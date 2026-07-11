"""Constrain the official chroma helper's soft matte to real silhouette edges.

The official helper produces a useful antialiased matte, but color dominance
alone can classify dark red/brown interior pixels as partially transparent.
This deterministic refinement keeps helper RGBA only within two source pixels
of transparent background. Every other foreground pixel is restored to the
exact generated source RGB at alpha 255.
"""

from __future__ import annotations

import argparse
import hashlib
import io
from pathlib import Path

import PIL
from PIL import Image, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
ASSET_DIR = ROOT / "assets" / "taskbar-cat-v2"
SOURCE_CHROMA = ASSET_DIR / "taskbar-cat-v2-chroma-final-atlas.png"
SOURCE_HELPER = ASSET_DIR / "taskbar-cat-v2-alpha-helper-final.png"
OUTPUT = ASSET_DIR / "taskbar-cat-v2-alpha-unregistered.png"

EXPECTED_PILLOW_VERSION = "12.3.0"
EXPECTED_CHROMA_SHA256 = "0931a8b8256efa4596fb6429f5feda83914a252b86677027b211cfa1847643a0"
EXPECTED_HELPER_SHA256 = "db66aeb6db3023e7f93fcfe9a9a80683f19cf07073decb4da5e3f24254cfb6d9"
EDGE_RADIUS = 2


def is_visible_magenta(rgba: tuple[int, int, int, int]) -> bool:
    red, green, blue, alpha = rgba
    perceived_magenta = ((red + blue) / 2) - green
    return alpha >= 32 and red > 120 and blue > 120 and perceived_magenta > 50


def sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def sha256_file(path: Path) -> str:
    return sha256_bytes(path.read_bytes())


def png_bytes(image: Image.Image) -> bytes:
    buffer = io.BytesIO()
    image.save(buffer, format="PNG", optimize=True, compress_level=9)
    return buffer.getvalue()


def build() -> tuple[bytes, dict[str, int | str]]:
    if PIL.__version__ != EXPECTED_PILLOW_VERSION:
        raise RuntimeError(f"Expected Pillow {EXPECTED_PILLOW_VERSION}, found {PIL.__version__}")
    if sha256_file(SOURCE_CHROMA) != EXPECTED_CHROMA_SHA256:
        raise RuntimeError("The generated chroma source changed unexpectedly")
    if sha256_file(SOURCE_HELPER) != EXPECTED_HELPER_SHA256:
        raise RuntimeError("The official-helper alpha source changed unexpectedly")

    source = Image.open(SOURCE_CHROMA).convert("RGB")
    helper = Image.open(SOURCE_HELPER).convert("RGBA")
    if source.size != helper.size:
        raise RuntimeError("Chroma and helper images have different dimensions")

    helper_alpha = helper.getchannel("A")
    transparent = helper_alpha.point(lambda value: 255 if value == 0 else 0)
    near_transparent = transparent.filter(ImageFilter.MaxFilter(EDGE_RADIUS * 2 + 1))

    source_pixels = source.load()
    helper_pixels = helper.load()
    near_pixels = near_transparent.load()
    width, height = source.size
    output = Image.new("RGBA", source.size, (0, 0, 0, 0))
    output_pixels = output.load()

    transparent_count = 0
    helper_partial_count = 0
    retained_edge_partial_count = 0
    restored_interior_count = 0

    for y in range(height):
        for x in range(width):
            source_rgb = source_pixels[x, y]
            helper_rgba = helper_pixels[x, y]
            alpha = helper_rgba[3]

            if alpha == 0:
                output_pixels[x, y] = (0, 0, 0, 0)
                transparent_count += 1
            elif alpha == 255:
                output_pixels[x, y] = (*source_rgb, 255)
            elif near_pixels[x, y] == 255:
                output_pixels[x, y] = helper_rgba
                helper_partial_count += 1
                retained_edge_partial_count += 1
            else:
                output_pixels[x, y] = (*source_rgb, 255)
                helper_partial_count += 1
                restored_interior_count += 1

    # The generated chroma source contains a few fully opaque key-colored edge
    # pixels. Replace only those explicit out-of-palette pixels with the median
    # of nearby visible non-magenta artwork, preserving their alpha exactly.
    snapshot = output.copy()
    snapshot_pixels = snapshot.load()
    contaminated = [
        (x, y)
        for y in range(height)
        for x in range(width)
        if is_visible_magenta(snapshot_pixels[x, y])
    ]
    cleaned_coordinates: set[tuple[int, int]] = set()
    for x, y in contaminated:
        neighbors: list[tuple[int, int, int]] = []
        for radius in range(1, 6):
            for sample_y in range(max(0, y - radius), min(height, y + radius + 1)):
                for sample_x in range(max(0, x - radius), min(width, x + radius + 1)):
                    if max(abs(sample_x - x), abs(sample_y - y)) != radius:
                        continue
                    candidate = snapshot_pixels[sample_x, sample_y]
                    if candidate[3] >= 32 and not is_visible_magenta(candidate):
                        neighbors.append(candidate[:3])
            if len(neighbors) >= 4:
                break
        if not neighbors:
            raise RuntimeError(f"Unable to clean visible magenta at ({x}, {y})")

        channels = [sorted(color[channel] for color in neighbors) for channel in range(3)]
        median_rgb = tuple(values[len(values) // 2] for values in channels)
        output_pixels[x, y] = (*median_rgb, snapshot_pixels[x, y][3])
        cleaned_coordinates.add((x, y))

    # Quality invariants: every opaque output pixel must retain the exact RGB
    # generated by imagegen; every partial pixel must touch true transparency.
    output_alpha = output.getchannel("A")
    output_pixels_check = output.load()
    partial_count = 0
    for y in range(height):
        for x in range(width):
            rgba = output_pixels_check[x, y]
            if rgba[3] == 255 and rgba[:3] != source_pixels[x, y] and (x, y) not in cleaned_coordinates:
                raise RuntimeError(f"Opaque RGB changed at ({x}, {y})")
            if 0 < rgba[3] < 255:
                partial_count += 1
                if near_pixels[x, y] != 255:
                    raise RuntimeError(f"Interior partial alpha remained at ({x}, {y})")

    corners = [
        output_alpha.getpixel((0, 0)),
        output_alpha.getpixel((width - 1, 0)),
        output_alpha.getpixel((0, height - 1)),
        output_alpha.getpixel((width - 1, height - 1)),
    ]
    if corners != [0, 0, 0, 0]:
        raise RuntimeError(f"Output corners are not transparent: {corners}")
    if partial_count != retained_edge_partial_count:
        raise RuntimeError("Partial-alpha accounting mismatch")
    visible_magenta_after = sum(
        1
        for y in range(height)
        for x in range(width)
        if is_visible_magenta(output_pixels[x, y])
    )
    if visible_magenta_after != 0:
        raise RuntimeError(f"{visible_magenta_after} visible magenta pixels remain")

    encoded = png_bytes(output)
    reloaded = Image.open(io.BytesIO(encoded)).convert("RGBA")
    if reloaded.tobytes() != output.tobytes():
        raise RuntimeError("Refined PNG round-trip changed RGBA pixels")

    return encoded, {
        "sha256": sha256_bytes(encoded),
        "transparentPixels": transparent_count,
        "helperPartialPixels": helper_partial_count,
        "retainedEdgePartialPixels": retained_edge_partial_count,
        "restoredInteriorPixels": restored_interior_count,
        "visibleMagentaPixelsBefore": len(contaminated),
        "visibleMagentaPixelsCorrected": len(cleaned_coordinates),
        "visibleMagentaPixelsAfter": visible_magenta_after,
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument("--write", action="store_true")
    mode.add_argument("--check", action="store_true")
    arguments = parser.parse_args()

    content, report = build()
    if arguments.write:
        OUTPUT.parent.mkdir(parents=True, exist_ok=True)
        temporary = OUTPUT.with_name(f"{OUTPUT.name}.tmp")
        temporary.write_bytes(content)
        temporary.replace(OUTPUT)
    elif not OUTPUT.exists() or OUTPUT.read_bytes() != content:
        raise RuntimeError("Refined alpha atlas is stale")

    print(f"mode={'--write' if arguments.write else '--check'}")
    for key, value in report.items():
        print(f"{key}={value}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
