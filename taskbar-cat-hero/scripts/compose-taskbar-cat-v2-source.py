"""Compose the anatomy-corrected action cells into the approved v2 source.

Imagegen's second pass corrected only the two action poses. To guarantee that
neutral, blink, happy-click, and doze remain byte-for-byte identical to the
first approved generation, this script copies complete 512x512 cells without
resampling instead of accepting a full-atlas redraw.
"""

from __future__ import annotations

import argparse
import hashlib
import io
from pathlib import Path

import PIL
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
ASSET_DIR = ROOT / "assets" / "taskbar-cat-v2"
BASE = ASSET_DIR / "taskbar-cat-v2-chroma-atlas.png"
CORRECTED = ASSET_DIR / "taskbar-cat-v2-chroma-corrected-atlas.png"
SUPPORT_CORRECTED = ASSET_DIR / "taskbar-cat-v2-chroma-support-corrected-atlas.png"
OUTPUT = ASSET_DIR / "taskbar-cat-v2-chroma-final-atlas.png"

EXPECTED_PILLOW_VERSION = "12.3.0"
EXPECTED_BASE_SHA256 = "7d6ac550770e9617fd07ea6f969939ad34dccb899920e9ad5914b20f795e67a6"
EXPECTED_CORRECTED_SHA256 = "3a81d13774912d721e03ae7d9585045fedd361d40f040f6721b0176d49559183"
EXPECTED_SUPPORT_CORRECTED_SHA256 = "1a26c2c25467dc4b446ccf3c04599bf179fde5d87645f78748d9c69638276317"
CELL_SIZE = 512
COLUMNS = 3
ROWS = 2
CELL_SOURCES = {1: "support-corrected", 2: "anatomy-corrected"}


def sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def sha256_file(path: Path) -> str:
    return sha256_bytes(path.read_bytes())


def png_bytes(image: Image.Image) -> bytes:
    buffer = io.BytesIO()
    image.save(buffer, format="PNG", optimize=True, compress_level=9)
    return buffer.getvalue()


def cell_box(index: int) -> tuple[int, int, int, int]:
    column = index % COLUMNS
    row = index // COLUMNS
    left = column * CELL_SIZE
    top = row * CELL_SIZE
    return left, top, left + CELL_SIZE, top + CELL_SIZE


def build() -> tuple[bytes, list[dict[str, str | int]]]:
    if PIL.__version__ != EXPECTED_PILLOW_VERSION:
        raise RuntimeError(f"Expected Pillow {EXPECTED_PILLOW_VERSION}, found {PIL.__version__}")
    if sha256_file(BASE) != EXPECTED_BASE_SHA256:
        raise RuntimeError("The first generated source changed unexpectedly")
    if sha256_file(CORRECTED) != EXPECTED_CORRECTED_SHA256:
        raise RuntimeError("The corrected generated source changed unexpectedly")
    if sha256_file(SUPPORT_CORRECTED) != EXPECTED_SUPPORT_CORRECTED_SHA256:
        raise RuntimeError("The support-corrected generated source changed unexpectedly")

    base = Image.open(BASE).convert("RGB")
    corrected = Image.open(CORRECTED).convert("RGB")
    support_corrected = Image.open(SUPPORT_CORRECTED).convert("RGB")
    expected_size = (COLUMNS * CELL_SIZE, ROWS * CELL_SIZE)
    if any(image.size != expected_size for image in (base, corrected, support_corrected)):
        raise RuntimeError(f"All source atlases must be {expected_size}")

    output = Image.new("RGB", expected_size)
    records: list[dict[str, str | int]] = []
    for index in range(COLUMNS * ROWS):
        source_name = CELL_SOURCES.get(index, "base")
        source = {
            "base": base,
            "anatomy-corrected": corrected,
            "support-corrected": support_corrected,
        }[source_name]
        cell = source.crop(cell_box(index))
        column = index % COLUMNS
        row = index // COLUMNS
        output.paste(cell, (column * CELL_SIZE, row * CELL_SIZE))
        raw_hash = sha256_bytes(cell.tobytes())
        records.append(
            {
                "index": index,
                "source": source_name,
                "rawRgbSha256": raw_hash,
            }
        )

    encoded = png_bytes(output)
    reloaded = Image.open(io.BytesIO(encoded)).convert("RGB")
    if reloaded.tobytes() != output.tobytes():
        raise RuntimeError("Composed source PNG round-trip changed RGB pixels")
    return encoded, records


def main() -> int:
    parser = argparse.ArgumentParser()
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument("--write", action="store_true")
    mode.add_argument("--check", action="store_true")
    arguments = parser.parse_args()

    content, records = build()
    if arguments.write:
        temporary = OUTPUT.with_name(f"{OUTPUT.name}.tmp")
        temporary.write_bytes(content)
        temporary.replace(OUTPUT)
    elif not OUTPUT.exists() or OUTPUT.read_bytes() != content:
        raise RuntimeError("Composed v2 chroma source is stale")

    print(f"mode={'--write' if arguments.write else '--check'}")
    print(f"sha256={sha256_bytes(content)}")
    print("cell_sources=" + ",".join(f"{record['index']}:{record['source']}" for record in records))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
