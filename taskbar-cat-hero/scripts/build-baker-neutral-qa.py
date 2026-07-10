"""Build deterministic approval previews for the single baker neutral master.

This is a review-only pipeline. It does not slice animation frames or update
the runtime. Unity should eventually import the approved high-resolution
master, while taskbar review uses the exact 128px composites emitted here.
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
QA_DIR = ASSET_DIR / "qa"
SOURCE = ASSET_DIR / "baker-cat-neutral-alpha-refined.png"
OUTPUT_LIGHT = QA_DIR / "baker-cat-neutral-128-light.png"
OUTPUT_DARK = QA_DIR / "baker-cat-neutral-128-dark.png"
OUTPUT_CHECKER = QA_DIR / "baker-cat-neutral-256-checker.png"

EXPECTED_PILLOW_VERSION = "12.3.0"
EXPECTED_SOURCE_SHA256 = "673eb8c12b2c6f0455e4ce0d07200588dd6ff9214caa321365eb604b4f80ebf9"
SOURCE_SIZE = (1254, 1254)


def sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def png_bytes(image: Image.Image) -> bytes:
    buffer = io.BytesIO()
    image.save(buffer, format="PNG", optimize=True, compress_level=9)
    return buffer.getvalue()


def composite(source: Image.Image, size: int, background: tuple[int, int, int]) -> Image.Image:
    reduced = source.resize((size, size), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (size, size), (*background, 255))
    canvas.alpha_composite(reduced)
    return canvas.convert("RGB")


def checkerboard(size: int, tile: int = 16) -> Image.Image:
    image = Image.new("RGB", (size, size), (238, 238, 238))
    pixels = image.load()
    for y in range(size):
        for x in range(size):
            shade = 238 if ((x // tile) + (y // tile)) % 2 == 0 else 194
            pixels[x, y] = (shade, shade, shade)
    return image


def build() -> tuple[dict[Path, bytes], dict[str, int | str | list[int]]]:
    if PIL.__version__ != EXPECTED_PILLOW_VERSION:
        raise RuntimeError(f"Expected Pillow {EXPECTED_PILLOW_VERSION}, found {PIL.__version__}")
    source_bytes = SOURCE.read_bytes()
    if sha256_bytes(source_bytes) != EXPECTED_SOURCE_SHA256:
        raise RuntimeError("The refined baker neutral master changed unexpectedly")

    source = Image.open(io.BytesIO(source_bytes)).convert("RGBA")
    if source.size != SOURCE_SIZE:
        raise RuntimeError(f"Expected source size {SOURCE_SIZE}, found {source.size}")

    alpha = source.getchannel("A")
    corners = [
        alpha.getpixel((0, 0)),
        alpha.getpixel((SOURCE_SIZE[0] - 1, 0)),
        alpha.getpixel((0, SOURCE_SIZE[1] - 1)),
        alpha.getpixel((SOURCE_SIZE[0] - 1, SOURCE_SIZE[1] - 1)),
    ]
    if corners[:2] != [0, 0]:
        raise RuntimeError(f"Top corners must be transparent: {corners}")
    if corners[2:] != [255, 255]:
        raise RuntimeError(f"The wooden counter must span both bottom corners: {corners}")

    light = composite(source, 128, (246, 239, 222))
    dark = composite(source, 128, (8, 23, 34))

    checker = checkerboard(256).convert("RGBA")
    checker.alpha_composite(source.resize((256, 256), Image.Resampling.LANCZOS))

    outputs = {
        OUTPUT_LIGHT: png_bytes(light),
        OUTPUT_DARK: png_bytes(dark),
        OUTPUT_CHECKER: png_bytes(checker.convert("RGB")),
    }
    return outputs, {
        "sourceSha256": EXPECTED_SOURCE_SHA256,
        "sourceWidth": source.width,
        "sourceHeight": source.height,
        "alphaBounds": list(alpha.getbbox() or ()),
        "transparentPixels": sum(1 for value in alpha.get_flattened_data() if value == 0),
        "partialAlphaPixels": sum(1 for value in alpha.get_flattened_data() if 0 < value < 255),
        "lightPreviewSha256": sha256_bytes(outputs[OUTPUT_LIGHT]),
        "darkPreviewSha256": sha256_bytes(outputs[OUTPUT_DARK]),
        "checkerPreviewSha256": sha256_bytes(outputs[OUTPUT_CHECKER]),
    }


def atomic_write(path: Path, content: bytes) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_name(f"{path.name}.tmp")
    temporary.write_bytes(content)
    temporary.replace(path)


def main() -> int:
    parser = argparse.ArgumentParser()
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument("--write", action="store_true")
    mode.add_argument("--check", action="store_true")
    arguments = parser.parse_args()

    outputs, report = build()
    if arguments.write:
        for path, content in outputs.items():
            atomic_write(path, content)
    else:
        stale = [path for path, content in outputs.items() if not path.exists() or path.read_bytes() != content]
        if stale:
            raise RuntimeError(f"Baker neutral QA previews are stale: {stale}")

    print(f"mode={'--write' if arguments.write else '--check'}")
    for key, value in report.items():
        print(f"{key}={value}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
