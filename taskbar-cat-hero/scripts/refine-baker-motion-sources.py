"""Deterministically remove residual green spill from baker motion sources.

These are generated edit sources, not runtime frames. A later builder aligns
them to the immutable neutral master and accepts pixels only inside explicit
left/right interaction masks. This pass preserves every helper alpha value and
changes only visible green-dominant RGB pixels.
"""

from __future__ import annotations

import argparse
import hashlib
import io
from pathlib import Path

import PIL
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "assets" / "taskbar-cat-baker-v2" / "sources"
EXPECTED_PILLOW_VERSION = "12.3.0"
SOURCES = {
    "neutral": (
        SOURCE_DIR / "baker-cat-one-dough-neutral-alpha-edge1.png",
        "295af105b2b4cd151b838a2ce78c9323f1327ba434b6e6e00de4b6eec8772965",
    ),
    "press-left": (
        SOURCE_DIR / "baker-cat-one-dough-press-left-alpha-edge1.png",
        "352fd99e47fbea006612e7d397783eaef78a59e2531042d96818bcf02007834a",
    ),
    "press-right": (
        SOURCE_DIR / "baker-cat-one-dough-press-right-alpha-edge1.png",
        "94890b30f7dcfe88c337f398df14c8d6814f55a9634792f0ae3b765bd88fd9e1",
    ),
    "blink": (
        SOURCE_DIR / "baker-cat-one-dough-blink-alpha-edge1.png",
        "d6ef6ff2c81a9878713a62e655af6219fb3e6eab1627c16d65382a7d56a46c47",
    ),
}


def sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def sha256_file(path: Path) -> str:
    return sha256_bytes(path.read_bytes())


def is_visible_green(rgba: tuple[int, int, int, int]) -> bool:
    red, green, blue, alpha = rgba
    # Chroma spill must be genuinely green-dominant. Comparing against the
    # average of red and blue misclassifies warm gold/tan antialiasing when its
    # blue channel is naturally low, even if red is stronger than green.
    return alpha >= 32 and green > 100 and green > red + 20 and green > blue + 35


def png_bytes(image: Image.Image) -> bytes:
    buffer = io.BytesIO()
    image.save(buffer, format="PNG", optimize=True, compress_level=9)
    return buffer.getvalue()


def refine(path: Path, expected_hash: str) -> tuple[bytes, dict[str, int | str]]:
    if sha256_file(path) != expected_hash:
        raise RuntimeError(f"Unexpected source hash: {path.name}")

    source = Image.open(path).convert("RGBA")
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
            raise RuntimeError(f"Unable to remove green spill at ({x}, {y}) in {path.name}")

        channels = [sorted(color[channel] for color in neighbors) for channel in range(3)]
        median_rgb = tuple(values[len(values) // 2] for values in channels)
        output_pixels[x, y] = (*median_rgb, source_pixels[x, y][3])

    remaining = sum(
        1
        for y in range(height)
        for x in range(width)
        if is_visible_green(output_pixels[x, y])
    )
    if remaining:
        raise RuntimeError(f"{remaining} green-dominant pixels remain in {path.name}")
    if output.getchannel("A").tobytes() != source.getchannel("A").tobytes():
        raise RuntimeError(f"Refinement changed alpha in {path.name}")

    encoded = png_bytes(output)
    if Image.open(io.BytesIO(encoded)).convert("RGBA").tobytes() != output.tobytes():
        raise RuntimeError(f"PNG round-trip changed RGBA in {path.name}")
    return encoded, {
        "sha256": sha256_bytes(encoded),
        "greenBefore": len(contaminated),
        "greenAfter": remaining,
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument("--write", action="store_true")
    mode.add_argument("--check", action="store_true")
    arguments = parser.parse_args()
    if PIL.__version__ != EXPECTED_PILLOW_VERSION:
        raise RuntimeError(f"Expected Pillow {EXPECTED_PILLOW_VERSION}, found {PIL.__version__}")

    reports: list[tuple[str, dict[str, int | str]]] = []
    for state, (source_path, expected_hash) in SOURCES.items():
        content, report = refine(source_path, expected_hash)
        output_path = source_path.with_name(source_path.name.replace("-alpha-edge1.png", "-alpha-refined.png"))
        if arguments.write:
            temporary = output_path.with_name(f"{output_path.name}.tmp")
            temporary.write_bytes(content)
            temporary.replace(output_path)
        elif not output_path.exists() or output_path.read_bytes() != content:
            raise RuntimeError(f"Refined baker motion source is stale: {output_path.name}")
        reports.append((state, report))

    print(f"mode={'--write' if arguments.write else '--check'}")
    for state, report in reports:
        print(f"{state}.sha256={report['sha256']}")
        print(f"{state}.greenBefore={report['greenBefore']}")
        print(f"{state}.greenAfter={report['greenAfter']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
