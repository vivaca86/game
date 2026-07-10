"""Build the one-dough baker runtime atlas from one immutable neutral master.

Image generation supplied localized edit sources. This builder never accepts a
complete generated reaction frame: it starts from the neutral RGBA master and
copies only the explicitly masked active paw/dough or eye regions after a fixed
registration offset. Pixels outside those masks stay byte-identical at source
resolution, preventing the face, body, counter, inactive paw, and lighting from
shimmering between states.

The 1254px masters are preserved. Runtime cells are derived at 512px for a
128px display target, giving 4x source resolution per displayed pixel and a
Unity-friendly 2x2 atlas without discarding the approval masters.
"""

from __future__ import annotations

import argparse
import hashlib
import io
import json
from pathlib import Path
from typing import Any

import PIL
from PIL import Image, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
ASSET_DIR = ROOT / "assets" / "taskbar-cat-baker-v2"
SOURCE_DIR = ASSET_DIR / "sources"
FULL_DIR = ASSET_DIR / "frames" / "full"
QA_DIR = ASSET_DIR / "qa"

OUTPUT_ATLAS = ASSET_DIR / "taskbar-cat-baker-v2-atlas.png"
OUTPUT_MANIFEST = ASSET_DIR / "taskbar-cat-baker-v2-manifest.json"
OUTPUT_LIGHT = QA_DIR / "taskbar-cat-baker-v2-preview-light.png"
OUTPUT_DARK = QA_DIR / "taskbar-cat-baker-v2-preview-dark.png"
OUTPUT_MOTION = QA_DIR / "taskbar-cat-baker-v2-motion-preview.gif"

EXPECTED_PILLOW_VERSION = "12.3.0"
SOURCE_SIZE = 1254
CELL_SIZE = 512
DISPLAY_SIZE = 128
FRAME_IDS = ("neutral", "key-left", "key-right", "blink")
SOURCES = {
    "neutral": (
        SOURCE_DIR / "baker-cat-one-dough-neutral-alpha-refined.png",
        "0552ce49c004dbbcb4dd97fd87732916b909ad9ec108301949addc389ce97d4d",
    ),
    "key-left": (
        SOURCE_DIR / "baker-cat-one-dough-press-left-alpha-refined.png",
        "53f433d636ab8a40b10d4d1bfe88e7f621dc50b9579eea984ff6621b9729bc32",
    ),
    "key-right": (
        SOURCE_DIR / "baker-cat-one-dough-press-right-alpha-refined.png",
        "b0c31f3b45745691db9bdfa9d46f37756076e398d08bc6e9a876d2d2c61f8186",
    ),
    "blink": (
        SOURCE_DIR / "baker-cat-one-dough-blink-alpha-refined.png",
        "c81f179e7759e8f211361b36c05e97977d626480f5047f12e18d37ccdc89d7cd",
    ),
}
REGISTRATION_OFFSETS = {
    "key-left": (0, -1),
    "key-right": (0, -2),
    "blink": (0, -1),
}


def sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def sha256_file(path: Path) -> str:
    return sha256_bytes(path.read_bytes())


def png_bytes(image: Image.Image) -> bytes:
    buffer = io.BytesIO()
    image.save(buffer, format="PNG", optimize=True, compress_level=9)
    return buffer.getvalue()


def gif_bytes(frames: list[Image.Image], durations: list[int]) -> bytes:
    buffer = io.BytesIO()
    frames[0].save(
        buffer,
        format="GIF",
        save_all=True,
        append_images=frames[1:],
        duration=durations,
        disposal=2,
        optimize=False,
    )
    return buffer.getvalue()


def translated(image: Image.Image, dx: int, dy: int) -> Image.Image:
    output = Image.new("RGBA", image.size, (0, 0, 0, 0))
    output.alpha_composite(image, (dx, dy))
    return output


def interaction_mask(frame_id: str) -> tuple[Image.Image, dict[str, Any]]:
    hard = Image.new("L", (SOURCE_SIZE, SOURCE_SIZE), 0)
    draw = ImageDraw.Draw(hard)
    if frame_id == "key-left":
        regions = [(150, 650, 525, 1090), (55, 900, 740, 1215)]
        for bounds in regions:
            draw.ellipse(bounds, fill=255)
    elif frame_id == "key-right":
        regions = [(729, 650, 1104, 1110), (514, 900, 1199, 1215)]
        for bounds in regions:
            draw.ellipse(bounds, fill=255)
    elif frame_id == "blink":
        regions = [(455, 370, 590, 530), (664, 370, 799, 530)]
        for bounds in regions:
            draw.ellipse(bounds, fill=255)
    else:
        regions = []

    feather_radius = 10
    soft = hard.filter(ImageFilter.GaussianBlur(feather_radius))
    return soft, {
        "regions": [list(bounds) for bounds in regions],
        "featherRadiusSourcePx": feather_radius,
    }


def premultiplied_composite(base: Image.Image, variant: Image.Image, mask: Image.Image) -> Image.Image:
    """Blend a localized RGBA edit without leaking hidden transparent RGB.

    Pillow's regular Image.composite interpolates straight-alpha RGB channels.
    Chroma-key sources can retain irrelevant RGB under near-transparent pixels,
    which then appears as a colored halo at a feathered mask boundary. Blend in
    premultiplied-alpha space and copy the base exactly wherever mask is zero.
    """

    output = base.copy()
    bounds = mask.getbbox()
    if bounds is None:
        return output

    base_pixels = base.load()
    variant_pixels = variant.load()
    mask_pixels = mask.load()
    output_pixels = output.load()
    left, top, right, bottom = bounds
    for y in range(top, bottom):
        for x in range(left, right):
            amount = mask_pixels[x, y]
            if amount == 0:
                continue
            if amount == 255:
                output_pixels[x, y] = variant_pixels[x, y]
                continue

            base_rgba = base_pixels[x, y]
            variant_rgba = variant_pixels[x, y]
            inverse = 255 - amount
            alpha_numerator = variant_rgba[3] * amount + base_rgba[3] * inverse
            alpha = round(alpha_numerator / 255)
            if alpha_numerator == 0:
                output_pixels[x, y] = (0, 0, 0, 0)
                continue

            channels = []
            for channel in range(3):
                premultiplied = (
                    variant_rgba[channel] * variant_rgba[3] * amount
                    + base_rgba[channel] * base_rgba[3] * inverse
                )
                channels.append(round(premultiplied / alpha_numerator))
            output_pixels[x, y] = (*channels, alpha)
    return output


def premultiplied_resize(image: Image.Image, size: tuple[int, int]) -> Image.Image:
    """Resize RGBA art without sampling irrelevant RGB beneath transparency.

    Pillow's ``RGBa`` mode stores color channels already multiplied by alpha.
    Resampling in that mode prevents transparent chroma-key remnants from
    bleeding into the visible antialiased edge, then converts the derivative
    back to ordinary straight-alpha RGBA for the browser and Unity.
    """

    return image.convert("RGBa").resize(size, Image.Resampling.LANCZOS).convert("RGBA")


def visible_green_count(image: Image.Image) -> int:
    count = 0
    pixels = image.load()
    for y in range(image.height):
        for x in range(image.width):
            red, green, blue, alpha = pixels[x, y]
            if alpha >= 32 and green > 100 and green > red + 20 and green > blue + 35:
                count += 1
    return count


def changed_outside_mask(base: Image.Image, candidate: Image.Image, mask: Image.Image) -> int:
    base_pixels = base.load()
    candidate_pixels = candidate.load()
    mask_pixels = mask.load()
    changed = 0
    for y in range(base.height):
        for x in range(base.width):
            if mask_pixels[x, y] == 0 and base_pixels[x, y] != candidate_pixels[x, y]:
                changed += 1
    return changed


def changed_pixels(first: Image.Image, second: Image.Image) -> int:
    first_pixels = first.load()
    second_pixels = second.load()
    return sum(
        1
        for y in range(first.height)
        for x in range(first.width)
        if first_pixels[x, y] != second_pixels[x, y]
    )


def alpha_bounds(image: Image.Image) -> list[int]:
    bounds = image.getchannel("A").getbbox()
    if bounds is None:
        raise RuntimeError("Frame contains no visible pixels")
    return list(bounds)


def lower_center(image: Image.Image) -> float:
    pixels = image.load()
    weighted = 0
    weight = 0
    for y in range(360, CELL_SIZE):
        for x in range(CELL_SIZE):
            alpha = pixels[x, y][3]
            if alpha >= 32:
                weighted += x * alpha
                weight += alpha
    if not weight:
        raise RuntimeError("Runtime frame has no lower-body anchor")
    return weighted / weight


def composite_preview(cell: Image.Image, background: tuple[int, int, int]) -> Image.Image:
    reduced = premultiplied_resize(cell, (DISPLAY_SIZE, DISPLAY_SIZE))
    canvas = Image.new("RGBA", (DISPLAY_SIZE, DISPLAY_SIZE), (*background, 255))
    canvas.alpha_composite(reduced)
    return canvas.convert("RGB")


def contact_sheet(cells: list[Image.Image], background: tuple[int, int, int]) -> Image.Image:
    gap = 8
    sheet = Image.new("RGB", (DISPLAY_SIZE * 2 + gap, DISPLAY_SIZE * 2 + gap), background)
    for index, cell in enumerate(cells):
        x = (index % 2) * (DISPLAY_SIZE + gap)
        y = (index // 2) * (DISPLAY_SIZE + gap)
        sheet.paste(composite_preview(cell, background), (x, y))
    return sheet


def build() -> tuple[dict[Path, bytes], dict[str, Any]]:
    if PIL.__version__ != EXPECTED_PILLOW_VERSION:
        raise RuntimeError(f"Expected Pillow {EXPECTED_PILLOW_VERSION}, found {PIL.__version__}")

    source_images: dict[str, Image.Image] = {}
    for state, (path, expected_hash) in SOURCES.items():
        if sha256_file(path) != expected_hash:
            raise RuntimeError(f"Unexpected source hash: {path.name}")
        image = Image.open(path).convert("RGBA")
        if image.size != (SOURCE_SIZE, SOURCE_SIZE):
            raise RuntimeError(f"Unexpected source size: {path.name} {image.size}")
        source_images[state] = image

    neutral = source_images["neutral"]
    full_frames: dict[str, Image.Image] = {"neutral": neutral.copy()}
    frame_records: list[dict[str, Any]] = [
        {
            "id": "neutral",
            "index": 0,
            "registrationOffset": {"x": 0, "y": 0},
            "mask": None,
            "changedPixelsFullSource": 0,
            "changedOutsideMaskPixels": 0,
        }
    ]

    for frame_id in FRAME_IDS[1:]:
        dx, dy = REGISTRATION_OFFSETS[frame_id]
        registered_source = translated(source_images[frame_id], dx, dy)
        mask, mask_record = interaction_mask(frame_id)
        composed = premultiplied_composite(neutral, registered_source, mask)
        outside_changes = changed_outside_mask(neutral, composed, mask)
        total_changes = changed_pixels(neutral, composed)
        if outside_changes != 0:
            raise RuntimeError(f"{frame_id} changed {outside_changes} pixels outside its allowed mask")
        if total_changes < 1_000:
            raise RuntimeError(f"{frame_id} does not contain a meaningful localized change")
        if total_changes > SOURCE_SIZE * SOURCE_SIZE * 0.22:
            raise RuntimeError(f"{frame_id} changed too much of the neutral master: {total_changes}")
        green_count = visible_green_count(composed)
        if green_count:
            raise RuntimeError(f"{frame_id} contains {green_count} visible green-spill pixels")

        full_frames[frame_id] = composed
        frame_records.append(
            {
                "id": frame_id,
                "index": len(frame_records),
                "registrationOffset": {"x": dx, "y": dy},
                "mask": mask_record,
                "changedPixelsFullSource": total_changes,
                "changedOutsideMaskPixels": outside_changes,
            }
        )

    runtime_cells = [premultiplied_resize(full_frames[frame_id], (CELL_SIZE, CELL_SIZE)) for frame_id in FRAME_IDS]
    atlas_image = Image.new("RGBA", (CELL_SIZE * 2, CELL_SIZE * 2), (0, 0, 0, 0))
    for index, cell in enumerate(runtime_cells):
        atlas_image.alpha_composite(cell, ((index % 2) * CELL_SIZE, (index // 2) * CELL_SIZE))
    atlas = png_bytes(atlas_image)
    if Image.open(io.BytesIO(atlas)).convert("RGBA").tobytes() != atlas_image.tobytes():
        raise RuntimeError("Runtime atlas PNG round-trip changed pixels")

    bounds = [alpha_bounds(cell) for cell in runtime_cells]
    baselines = [record[3] - 1 for record in bounds]
    lower_centers = [lower_center(cell) for cell in runtime_cells[:3]]
    quality = {
        "runtimeAlphaBounds": bounds,
        "baselineRangeRuntimePx": max(baselines) - min(baselines),
        "lowerCenterSpreadRuntimePx": max(lower_centers) - min(lower_centers),
        "lowerCenterSpreadDisplayPx": (max(lower_centers) - min(lower_centers)) * DISPLAY_SIZE / CELL_SIZE,
        "visibleGreenPixels": sum(visible_green_count(cell) for cell in runtime_cells),
        "outsideMaskChangedPixels": sum(record["changedOutsideMaskPixels"] for record in frame_records),
    }
    if quality["baselineRangeRuntimePx"] != 0:
        raise RuntimeError(f"Runtime baselines differ: {quality}")
    if quality["lowerCenterSpreadDisplayPx"] >= 1:
        raise RuntimeError(f"Runtime lower-body drift exceeds one displayed pixel: {quality}")
    if quality["visibleGreenPixels"] != 0 or quality["outsideMaskChangedPixels"] != 0:
        raise RuntimeError(f"Runtime localization quality failed: {quality}")

    manifest = {
        "schemaVersion": 1,
        "id": "taskbar-baker-cat-one-dough-v2",
        "status": "generated prototype; user continuous-play and IP-holder approval required",
        "createdOn": "2026-07-10",
        "generator": {
            "mode": "OpenAI built-in imagegen plus deterministic masked composition",
            "pillowVersion": PIL.__version__,
            "runtimeCellDerivation": (
                "1254px approval masters to 512px cells with premultiplied-alpha Lanczos; masters preserved"
            ),
        },
        "sources": {
            state: {"file": path.name, "sha256": expected_hash}
            for state, (path, expected_hash) in SOURCES.items()
        },
        "atlas": {
            "image": OUTPUT_ATLAS.name,
            "sha256": sha256_bytes(atlas),
            "width": CELL_SIZE * 2,
            "height": CELL_SIZE * 2,
            "columns": 2,
            "rows": 2,
            "frameWidth": CELL_SIZE,
            "frameHeight": CELL_SIZE,
            "padding": 0,
            "spacing": 0,
        },
        "display": {"frameWidth": DISPLAY_SIZE, "frameHeight": DISPLAY_SIZE, "scale": 0.25},
        "frames": frame_records,
        "quality": quality,
        "runtime": {
            "frameOrder": list(FRAME_IDS),
            "keyHoldMs": 110,
            "blinkHoldMs": 130,
            "clickSequence": ["key-left", "key-right", "key-left", "neutral"],
            "bodyLoop": False,
        },
        "unityImport": {
            "textureType": "Sprite (2D and UI)",
            "spriteMode": "Multiple",
            "grid": {"columns": 2, "rows": 2, "cellWidth": CELL_SIZE, "cellHeight": CELL_SIZE},
            "meshType": "Full Rect",
            "filterMode": "Bilinear",
            "compression": "None",
            "mipMaps": False,
            "allowRotation": False,
            "tightPacking": False,
            "pivotNormalizedUnity": {"x": 0.5, "y": 0.0},
        },
    }

    dark = (8, 23, 34)
    light = (246, 239, 222)
    light_sheet = png_bytes(contact_sheet(runtime_cells, light))
    dark_sheet = png_bytes(contact_sheet(runtime_cells, dark))
    motion_indices = [0, 1, 0, 2, 0, 3, 0, 1, 2, 1, 0]
    motion_durations = [900, 110, 180, 110, 1200, 130, 900, 95, 95, 95, 900]
    motion_frames = [composite_preview(runtime_cells[index], dark) for index in motion_indices]
    motion = gif_bytes(motion_frames, motion_durations)

    outputs: dict[Path, bytes] = {
        OUTPUT_ATLAS: atlas,
        OUTPUT_MANIFEST: (json.dumps(manifest, ensure_ascii=False, indent=2) + "\n").encode("utf-8"),
        OUTPUT_LIGHT: light_sheet,
        OUTPUT_DARK: dark_sheet,
        OUTPUT_MOTION: motion,
    }
    for frame_id in FRAME_IDS:
        outputs[FULL_DIR / f"baker-cat-one-dough-{frame_id}.png"] = png_bytes(full_frames[frame_id])
    return outputs, manifest


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

    outputs, manifest = build()
    if arguments.write:
        for path, content in outputs.items():
            atomic_write(path, content)
    else:
        stale = [path for path, content in outputs.items() if not path.exists() or path.read_bytes() != content]
        if stale:
            raise RuntimeError(f"Baker v2 runtime artifacts are stale: {stale}")

    quality = manifest["quality"]
    print(f"mode={'--write' if arguments.write else '--check'}")
    print(f"atlasSha256={manifest['atlas']['sha256']}")
    print(f"baselineRangeRuntimePx={quality['baselineRangeRuntimePx']}")
    print(f"lowerCenterSpreadDisplayPx={quality['lowerCenterSpreadDisplayPx']:.4f}")
    print(f"visibleGreenPixels={quality['visibleGreenPixels']}")
    print(f"outsideMaskChangedPixels={quality['outsideMaskChangedPixels']}")
    for frame in manifest["frames"]:
        print(f"{frame['id']}.changedPixels={frame['changedPixelsFullSource']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
