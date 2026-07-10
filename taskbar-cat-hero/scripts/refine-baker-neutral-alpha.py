"""Remove residual green spill from the baker neutral approval candidate.

The official chroma helper plus a one-pixel edge contraction removes the flat
background, but a small number of antialiased fur-edge pixels remain visibly
green-dominant. The character palette intentionally contains no green, so this
deterministic pass replaces only those perceptual-key pixels with the local
median of visible non-green artwork while preserving the helper alpha exactly.

This script does not approve the art or create animation states. It only builds
the neutral candidate used for 128px light/dark user review.
"""

from __future__ import annotations

import argparse
import hashlib
import io
from pathlib import Path

import PIL
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
ASSET_DIR = ROOT / "assets" / "taskbar-cat-baker-v1"
SOURCE = ASSET_DIR / "baker-cat-neutral-alpha-edge1.png"
OUTPUT = ASSET_DIR / "baker-cat-neutral-alpha-refined.png"

EXPECTED_PILLOW_VERSION = "12.3.0"
EXPECTED_SOURCE_SHA256 = "84f11964a34bca21e0f20829fbf6a6468df08a4cbe242eff558615f23abad0f6"


def sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def sha256_file(path: Path) -> str:
    return sha256_bytes(path.read_bytes())


def is_visible_green(rgba: tuple[int, int, int, int]) -> bool:
    red, green, blue, alpha = rgba
    return alpha >= 32 and green > 100 and green - ((red + blue) / 2) > 35


def png_bytes(image: Image.Image) -> bytes:
    buffer = io.BytesIO()
    image.save(buffer, format="PNG", optimize=True, compress_level=9)
    return buffer.getvalue()


def build() -> tuple[bytes, dict[str, int | str]]:
    if PIL.__version__ != EXPECTED_PILLOW_VERSION:
        raise RuntimeError(f"Expected Pillow {EXPECTED_PILLOW_VERSION}, found {PIL.__version__}")
    if sha256_file(SOURCE) != EXPECTED_SOURCE_SHA256:
        raise RuntimeError("The edge-contracted neutral source changed unexpectedly")

    source = Image.open(SOURCE).convert("RGBA")
    output = source.copy()
    source_pixels = source.load()
    output_pixels = output.load()
    width, height = source.size

    contaminated = [
        (x, y)
        for y in range(height)
        for x in range(width)
        if is_visible_green(source_pixels[x, y])
    ]

    for x, y in contaminated:
        neighbors: list[tuple[int, int, int]] = []
        for radius in range(1, 7):
            for sample_y in range(max(0, y - radius), min(height, y + radius + 1)):
                for sample_x in range(max(0, x - radius), min(width, x + radius + 1)):
                    if max(abs(sample_x - x), abs(sample_y - y)) != radius:
                        continue
                    candidate = source_pixels[sample_x, sample_y]
                    if candidate[3] >= 32 and not is_visible_green(candidate):
                        neighbors.append(candidate[:3])
            if len(neighbors) >= 4:
                break

        if not neighbors:
            raise RuntimeError(f"Unable to remove green spill at ({x}, {y})")

        channels = [sorted(color[channel] for color in neighbors) for channel in range(3)]
        median_rgb = tuple(values[len(values) // 2] for values in channels)
        output_pixels[x, y] = (*median_rgb, source_pixels[x, y][3])

    remaining = sum(
        1
        for y in range(height)
        for x in range(width)
        if is_visible_green(output_pixels[x, y])
    )
    if remaining != 0:
        raise RuntimeError(f"{remaining} green-dominant visible pixels remain")

    if output.getchannel("A").tobytes() != source.getchannel("A").tobytes():
        raise RuntimeError("Green cleanup changed the approved helper alpha")

    encoded = png_bytes(output)
    reloaded = Image.open(io.BytesIO(encoded)).convert("RGBA")
    if reloaded.tobytes() != output.tobytes():
        raise RuntimeError("Refined PNG round-trip changed RGBA pixels")

    return encoded, {
        "sha256": sha256_bytes(encoded),
        "visibleGreenPixelsBefore": len(contaminated),
        "visibleGreenPixelsCorrected": len(contaminated),
        "visibleGreenPixelsAfter": remaining,
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument("--write", action="store_true")
    mode.add_argument("--check", action="store_true")
    arguments = parser.parse_args()

    content, report = build()
    if arguments.write:
        temporary = OUTPUT.with_name(f"{OUTPUT.name}.tmp")
        temporary.write_bytes(content)
        temporary.replace(OUTPUT)
    elif not OUTPUT.exists() or OUTPUT.read_bytes() != content:
        raise RuntimeError("Refined baker neutral alpha is stale")

    print(f"mode={'--write' if arguments.write else '--check'}")
    for key, value in report.items():
        print(f"{key}={value}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
