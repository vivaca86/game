"""Register and verify the generated taskbar-cat v2 reaction atlas.

The image generator produced six visually consistent 512x512 cells, but the
characters were not centered on identical per-cell anchors. This build step
translates pixels inside each cell without scaling or repainting them. The
registered atlas is therefore suitable for both CSS sprite selection and a
Unity Sprite (Multiple) import while preserving the generated master quality.

Usage (with the project-local Pillow target on PYTHONPATH):
    python scripts/build-taskbar-cat-v2-atlas.py --write
    python scripts/build-taskbar-cat-v2-atlas.py --check
"""

from __future__ import annotations

import argparse
import hashlib
import io
import json
from pathlib import Path
from typing import Any

import PIL
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
ASSET_DIR = ROOT / "assets" / "taskbar-cat-v2"
SOURCE_CHROMA = ASSET_DIR / "taskbar-cat-v2-chroma-final-atlas.png"
SOURCE_HELPER = ASSET_DIR / "taskbar-cat-v2-alpha-helper-final.png"
SOURCE_ALPHA = ASSET_DIR / "taskbar-cat-v2-alpha-unregistered.png"
SOURCE_REFERENCE = ROOT / "assets" / "concept" / "widget-chef-cat-generated-cook-v31-16.png"
SOURCE_BASE_GENERATION = ASSET_DIR / "taskbar-cat-v2-chroma-atlas.png"
SOURCE_CORRECTED_GENERATION = ASSET_DIR / "taskbar-cat-v2-chroma-corrected-atlas.png"
SOURCE_SUPPORT_CORRECTED_GENERATION = ASSET_DIR / "taskbar-cat-v2-chroma-support-corrected-atlas.png"
PROVENANCE_DOCUMENT = ASSET_DIR / "PROVENANCE.md"
OUTPUT_ATLAS = ASSET_DIR / "taskbar-cat-v2-atlas.png"
OUTPUT_MANIFEST = ASSET_DIR / "taskbar-cat-v2-manifest.json"
QA_DIR = ASSET_DIR / "qa"
OUTPUT_DARK = QA_DIR / "taskbar-cat-v2-preview-dark.png"
OUTPUT_LIGHT = QA_DIR / "taskbar-cat-v2-preview-light.png"
OUTPUT_MOTION = QA_DIR / "taskbar-cat-v2-motion-preview.gif"

EXPECTED_PILLOW_VERSION = "12.3.0"
EXPECTED_REFERENCE_SHA256 = "3b7dca1f10c849b5fe3c13b7b0863667a7b140af7d31a6b666835c89bd7abeb3"
EXPECTED_BASE_GENERATION_SHA256 = "7d6ac550770e9617fd07ea6f969939ad34dccb899920e9ad5914b20f795e67a6"
EXPECTED_CORRECTED_GENERATION_SHA256 = "3a81d13774912d721e03ae7d9585045fedd361d40f040f6721b0176d49559183"
EXPECTED_SUPPORT_CORRECTED_GENERATION_SHA256 = "1a26c2c25467dc4b446ccf3c04599bf179fde5d87645f78748d9c69638276317"
EXPECTED_PROVENANCE_SHA256 = "3a6155db82fc7fb3aa08f3b75d6e8178dac1123e9b041e9dcc0a8ab21a562d6e"
EXPECTED_CHROMA_SHA256 = "0931a8b8256efa4596fb6429f5feda83914a252b86677027b211cfa1847643a0"
EXPECTED_ALPHA_SHA256 = "3095c52e8de664d71ccd0fafee39fff5f18affe512f7cdb5a6636bfee17a1230"
EXPECTED_HELPER_SHA256 = "db66aeb6db3023e7f93fcfe9a9a80683f19cf07073decb4da5e3f24254cfb6d9"

COLUMNS = 3
ROWS = 2
CELL_WIDTH = 512
CELL_HEIGHT = 512
DISPLAY_WIDTH = 128
DISPLAY_HEIGHT = 128
ALPHA_THRESHOLD = 32
LOWER_BODY_START_Y = 320
TARGET_LOWER_CENTER_X = 256
TARGET_BASELINE_Y = 472

FRAME_IDS = (
    "neutral",
    "key-left",
    "key-right",
    "blink",
    "happy-click",
    "doze",
)
VISUAL_REGISTRATION_NUDGE_X = {
    # The anatomy correction intentionally moved the utensils. A small baked
    # compromise keeps both the pot anchor and upper body below 1 displayed px.
    "key-left": -3,
    "key-right": -1,
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


def cell_at(atlas: Image.Image, index: int) -> Image.Image:
    column = index % COLUMNS
    row = index // COLUMNS
    left = column * CELL_WIDTH
    top = row * CELL_HEIGHT
    return atlas.crop((left, top, left + CELL_WIDTH, top + CELL_HEIGHT))


def alpha_bbox(image: Image.Image, threshold: int = ALPHA_THRESHOLD) -> tuple[int, int, int, int]:
    mask = image.getchannel("A").point(lambda value: 255 if value >= threshold else 0)
    bounds = mask.getbbox()
    if bounds is None:
        raise RuntimeError("A sprite cell contains no visible pixels")
    return bounds


def measure(image: Image.Image) -> dict[str, Any]:
    weighted_x = 0
    weighted_y = 0
    alpha_weight = 0
    lower_weighted_x = 0
    lower_weighted_y = 0
    lower_alpha_weight = 0
    upper_weighted_x = 0
    upper_weighted_y = 0
    upper_alpha_weight = 0
    visible_pixels = 0
    magenta_fringe_pixels = 0

    for y in range(CELL_HEIGHT):
        for x in range(CELL_WIDTH):
            red, green, blue, alpha = image.getpixel((x, y))
            if alpha < ALPHA_THRESHOLD:
                continue
            visible_pixels += 1
            weighted_x += x * alpha
            weighted_y += y * alpha
            alpha_weight += alpha
            if y >= LOWER_BODY_START_Y:
                lower_weighted_x += x * alpha
                lower_weighted_y += y * alpha
                lower_alpha_weight += alpha
            if 120 <= x < 392 and 30 <= y < 260:
                upper_weighted_x += x * alpha
                upper_weighted_y += y * alpha
                upper_alpha_weight += alpha
            if red > 120 and blue > 120 and ((red + blue) / 2) - green > 50:
                magenta_fringe_pixels += 1

    if alpha_weight == 0 or lower_alpha_weight == 0 or upper_alpha_weight == 0:
        raise RuntimeError("A sprite cell is missing its visible body or lower-body anchor")

    bounds = alpha_bbox(image)
    return {
        "bounds": list(bounds),
        "centroid": {
            "x": weighted_x / alpha_weight,
            "y": weighted_y / alpha_weight,
        },
        "lowerBodyCentroid": {
            "x": lower_weighted_x / lower_alpha_weight,
            "y": lower_weighted_y / lower_alpha_weight,
        },
        "upperBodyCentroid": {
            "x": upper_weighted_x / upper_alpha_weight,
            "y": upper_weighted_y / upper_alpha_weight,
        },
        "baselineY": bounds[3] - 1,
        "visiblePixels": visible_pixels,
        "magentaFringePixels": magenta_fringe_pixels,
    }


def translate_without_resampling(image: Image.Image, dx: int, dy: int) -> Image.Image:
    output = Image.new("RGBA", (CELL_WIDTH, CELL_HEIGHT), (0, 0, 0, 0))

    source_x = max(0, -dx)
    source_y = max(0, -dy)
    destination_x = max(0, dx)
    destination_y = max(0, dy)
    width = min(CELL_WIDTH - source_x, CELL_WIDTH - destination_x)
    height = min(CELL_HEIGHT - source_y, CELL_HEIGHT - destination_y)
    if width <= 0 or height <= 0:
        raise RuntimeError(f"Registration offset ({dx}, {dy}) moves the cell outside its canvas")

    region = image.crop((source_x, source_y, source_x + width, source_y + height))
    output.alpha_composite(region, (destination_x, destination_y))
    return output


def registered_cell(source: Image.Image, frame_id: str) -> tuple[Image.Image, dict[str, Any], dict[str, int]]:
    before = measure(source)
    dx = (
        round(TARGET_LOWER_CENTER_X - before["lowerBodyCentroid"]["x"])
        + VISUAL_REGISTRATION_NUDGE_X.get(frame_id, 0)
    )
    dy = TARGET_BASELINE_Y - before["baselineY"]

    exact_bounds = source.getchannel("A").getbbox()
    if exact_bounds is None:
        raise RuntimeError("A sprite cell is empty")
    if (
        exact_bounds[0] + dx < 0
        or exact_bounds[1] + dy < 0
        or exact_bounds[2] + dx > CELL_WIDTH
        or exact_bounds[3] + dy > CELL_HEIGHT
    ):
        raise RuntimeError(f"Registration offset ({dx}, {dy}) would crop visible alpha")

    output = translate_without_resampling(source, dx, dy)
    return output, before, {"x": dx, "y": dy}


def composite_at_display_size(cell: Image.Image, background: tuple[int, int, int]) -> Image.Image:
    high_resolution = Image.new("RGBA", (CELL_WIDTH, CELL_HEIGHT), (*background, 255))
    high_resolution.alpha_composite(cell)
    return high_resolution.convert("RGB").resize(
        (DISPLAY_WIDTH, DISPLAY_HEIGHT),
        Image.Resampling.LANCZOS,
    )


def contact_sheet(cells: list[Image.Image], background: tuple[int, int, int]) -> Image.Image:
    gap = 8
    sheet = Image.new(
        "RGB",
        (
            COLUMNS * DISPLAY_WIDTH + (COLUMNS - 1) * gap,
            ROWS * DISPLAY_HEIGHT + (ROWS - 1) * gap,
        ),
        background,
    )
    for index, cell in enumerate(cells):
        column = index % COLUMNS
        row = index // COLUMNS
        preview = composite_at_display_size(cell, background)
        sheet.paste(preview, (column * (DISPLAY_WIDTH + gap), row * (DISPLAY_HEIGHT + gap)))
    return sheet


def make_manifest(
    atlas_bytes: bytes,
    frame_records: list[dict[str, Any]],
) -> dict[str, Any]:
    registered = [record["registeredMetrics"] for record in frame_records]
    lower_centers = [record["lowerBodyCentroid"]["x"] for record in registered]
    full_centers = [record["centroid"]["x"] for record in registered]
    upper_centers = [record["upperBodyCentroid"]["x"] for record in registered[:5]]
    baselines = [record["baselineY"] for record in registered]
    bbox_lefts = [record["bounds"][0] for record in registered]
    bbox_rights = [record["bounds"][2] for record in registered]
    stable_records = [
        record["registeredMetrics"]
        for record in frame_records
        if record["id"] in {"neutral", "blink", "happy-click"}
    ]
    stable_bbox_lefts = [record["bounds"][0] for record in stable_records]
    stable_bbox_rights = [record["bounds"][2] for record in stable_records]
    display_scale = DISPLAY_WIDTH / CELL_WIDTH

    quality = {
        "lowerBodyCenterSpreadSourcePx": max(lower_centers) - min(lower_centers),
        "lowerBodyCenterSpreadDisplayPx": (max(lower_centers) - min(lower_centers)) * display_scale,
        "fullCenterSpreadSourcePx": max(full_centers) - min(full_centers),
        "fullCenterSpreadDisplayPx": (max(full_centers) - min(full_centers)) * display_scale,
        "upperBodyCenterSpreadSourcePx": max(upper_centers) - min(upper_centers),
        "upperBodyCenterSpreadDisplayPx": (max(upper_centers) - min(upper_centers)) * display_scale,
        "baselineRangeSourcePx": max(baselines) - min(baselines),
        "bboxLeftSpreadSourcePx": max(bbox_lefts) - min(bbox_lefts),
        "bboxRightSpreadSourcePx": max(bbox_rights) - min(bbox_rights),
        "stableBBoxLeftSpreadSourcePx": max(stable_bbox_lefts) - min(stable_bbox_lefts),
        "stableBBoxRightSpreadSourcePx": max(stable_bbox_rights) - min(stable_bbox_rights),
        "magentaFringePixels": sum(record["magentaFringePixels"] for record in registered),
    }

    if quality["lowerBodyCenterSpreadDisplayPx"] >= 1:
        raise RuntimeError(f"Lower-body registration failed: {quality}")
    if quality["upperBodyCenterSpreadDisplayPx"] >= 1:
        raise RuntimeError(f"Upper-body registration failed: {quality}")
    if quality["baselineRangeSourcePx"] != 0:
        raise RuntimeError(f"Baselines are not identical: {quality}")
    if quality["stableBBoxLeftSpreadSourcePx"] > 4 or quality["stableBBoxRightSpreadSourcePx"] > 4:
        raise RuntimeError(f"Stable registered silhouettes still slide: {quality}")
    if quality["magentaFringePixels"] != 0:
        raise RuntimeError(f"Chroma fringe remains: {quality}")

    return {
        "schemaVersion": 1,
        "id": "taskbar-chef-cat-v2",
        "status": "generated-prototype; IP-holder and shipping approval required",
        "createdOn": "2026-07-10",
        "generator": {
            "mode": "OpenAI built-in imagegen",
            "transparentBackgroundMethod": "flat magenta chroma key, official local soft matte, two-pixel spatial refinement, then visible-key pixel cleanup",
            "registrationMethod": "integer pixel translation only; no scaling, repainting, or lossy recompression",
            "pillowVersion": PIL.__version__,
        },
        "sources": {
            "referenceImage": str(SOURCE_REFERENCE.relative_to(ROOT)).replace("\\", "/"),
            "referenceSha256": EXPECTED_REFERENCE_SHA256,
            "baseGenerationImage": SOURCE_BASE_GENERATION.name,
            "baseGenerationSha256": EXPECTED_BASE_GENERATION_SHA256,
            "anatomyCorrectionImage": SOURCE_CORRECTED_GENERATION.name,
            "anatomyCorrectionSha256": EXPECTED_CORRECTED_GENERATION_SHA256,
            "toolSupportCorrectionImage": SOURCE_SUPPORT_CORRECTED_GENERATION.name,
            "toolSupportCorrectionSha256": EXPECTED_SUPPORT_CORRECTED_GENERATION_SHA256,
            "composedChromaImage": SOURCE_CHROMA.name,
            "composedChromaSha256": EXPECTED_CHROMA_SHA256,
            "helperRawImage": SOURCE_HELPER.name,
            "helperRawSha256": EXPECTED_HELPER_SHA256,
            "alphaUnregisteredImage": SOURCE_ALPHA.name,
            "alphaUnregisteredSha256": EXPECTED_ALPHA_SHA256,
            "provenanceDocument": PROVENANCE_DOCUMENT.name,
            "provenanceSha256": EXPECTED_PROVENANCE_SHA256,
        },
        "atlas": {
            "image": OUTPUT_ATLAS.name,
            "sha256": sha256_bytes(atlas_bytes),
            "width": COLUMNS * CELL_WIDTH,
            "height": ROWS * CELL_HEIGHT,
            "columns": COLUMNS,
            "rows": ROWS,
            "frameWidth": CELL_WIDTH,
            "frameHeight": CELL_HEIGHT,
            "spacing": 0,
            "padding": 0,
        },
        "display": {
            "frameWidth": DISPLAY_WIDTH,
            "frameHeight": DISPLAY_HEIGHT,
            "scale": display_scale,
            "filter": "bilinear/auto",
        },
        "pivot": {
            "sourcePixelsTopLeft": {"x": TARGET_LOWER_CENTER_X, "y": TARGET_BASELINE_Y},
            "normalizedTopLeft": {
                "x": TARGET_LOWER_CENTER_X / CELL_WIDTH,
                "y": TARGET_BASELINE_Y / CELL_HEIGHT,
            },
            "normalizedUnity": {
                "x": TARGET_LOWER_CENTER_X / CELL_WIDTH,
                "y": 1 - TARGET_BASELINE_Y / CELL_HEIGHT,
            },
        },
        "frames": frame_records,
        "runtime": {
            "aliases": {"click": "happy-click", "ready": "happy-click"},
            "wheelSequence": ["key-left", "key-right", "key-left", "neutral"],
            "idleSequence": ["neutral", "blink", "neutral"],
            "bodyLoop": False,
        },
        "quality": quality,
        "unityImport": {
            "textureType": "Sprite (2D and UI)",
            "spriteMode": "Multiple",
            "meshType": "Full Rect",
            "filterMode": "Bilinear",
            "compression": "None",
            "mipMaps": False,
            "allowRotation": False,
            "tightPacking": False,
        },
    }


def build_outputs() -> tuple[dict[Path, bytes], dict[str, Any]]:
    if PIL.__version__ != EXPECTED_PILLOW_VERSION:
        raise RuntimeError(
            f"Expected Pillow {EXPECTED_PILLOW_VERSION}, found {PIL.__version__}. "
            "Install scripts/requirements-imagegen.txt in the project-local tool path."
        )
    if sha256_file(SOURCE_CHROMA) != EXPECTED_CHROMA_SHA256:
        raise RuntimeError("The generated chroma master changed unexpectedly")
    if sha256_file(SOURCE_REFERENCE) != EXPECTED_REFERENCE_SHA256:
        raise RuntimeError("The v31 reference image changed unexpectedly")
    if sha256_file(SOURCE_BASE_GENERATION) != EXPECTED_BASE_GENERATION_SHA256:
        raise RuntimeError("The base imagegen output changed unexpectedly")
    if sha256_file(SOURCE_CORRECTED_GENERATION) != EXPECTED_CORRECTED_GENERATION_SHA256:
        raise RuntimeError("The anatomy-correction imagegen output changed unexpectedly")
    if sha256_file(SOURCE_SUPPORT_CORRECTED_GENERATION) != EXPECTED_SUPPORT_CORRECTED_GENERATION_SHA256:
        raise RuntimeError("The tool-support correction imagegen output changed unexpectedly")
    if sha256_file(PROVENANCE_DOCUMENT) != EXPECTED_PROVENANCE_SHA256:
        raise RuntimeError("The asset provenance document changed unexpectedly")
    if sha256_file(SOURCE_HELPER) != EXPECTED_HELPER_SHA256:
        raise RuntimeError("The official-helper alpha master changed unexpectedly")
    if sha256_file(SOURCE_ALPHA) != EXPECTED_ALPHA_SHA256:
        raise RuntimeError("The chroma-removed alpha master changed unexpectedly")

    source_atlas = Image.open(SOURCE_ALPHA).convert("RGBA")
    expected_size = (COLUMNS * CELL_WIDTH, ROWS * CELL_HEIGHT)
    if source_atlas.size != expected_size:
        raise RuntimeError(f"Expected atlas size {expected_size}, found {source_atlas.size}")

    output_atlas = Image.new("RGBA", expected_size, (0, 0, 0, 0))
    registered_cells: list[Image.Image] = []
    frame_records: list[dict[str, Any]] = []

    for index, frame_id in enumerate(FRAME_IDS):
        source_cell = cell_at(source_atlas, index)
        output_cell, source_metrics, offset = registered_cell(source_cell, frame_id)
        registered_metrics = measure(output_cell)
        registered_cells.append(output_cell)

        column = index % COLUMNS
        row = index // COLUMNS
        output_atlas.alpha_composite(output_cell, (column * CELL_WIDTH, row * CELL_HEIGHT))
        frame_records.append(
            {
                "id": frame_id,
                "index": index,
                "column": column,
                "row": row,
                "registrationOffset": offset,
                "sourceMetrics": source_metrics,
                "registeredMetrics": registered_metrics,
            }
        )

    atlas = png_bytes(output_atlas)
    reloaded = Image.open(io.BytesIO(atlas)).convert("RGBA")
    if reloaded.tobytes() != output_atlas.tobytes():
        raise RuntimeError("PNG round-trip changed registered RGBA pixels")

    manifest = make_manifest(atlas, frame_records)
    manifest_bytes = (json.dumps(manifest, ensure_ascii=False, indent=2) + "\n").encode("utf-8")

    dark_background = (8, 23, 34)
    light_background = (246, 239, 222)
    dark_sheet = png_bytes(contact_sheet(registered_cells, dark_background))
    light_sheet = png_bytes(contact_sheet(registered_cells, light_background))

    motion_indices = [0, 3, 0, 1, 0, 2, 0, 4, 0, 5]
    motion_durations = [1200, 110, 1600, 110, 140, 110, 900, 420, 1000, 1200]
    motion_frames = [
        composite_at_display_size(registered_cells[index], dark_background)
        for index in motion_indices
    ]
    motion = gif_bytes(motion_frames, motion_durations)

    return (
        {
            OUTPUT_ATLAS: atlas,
            OUTPUT_MANIFEST: manifest_bytes,
            OUTPUT_DARK: dark_sheet,
            OUTPUT_LIGHT: light_sheet,
            OUTPUT_MOTION: motion,
        },
        manifest,
    )


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

    outputs, manifest = build_outputs()
    if arguments.write:
        for path, content in outputs.items():
            atomic_write(path, content)
    else:
        stale = [path for path, content in outputs.items() if not path.exists() or path.read_bytes() != content]
        if stale:
            names = ", ".join(str(path.relative_to(ROOT)) for path in stale)
            raise RuntimeError(f"Generated taskbar-cat v2 artifacts are stale: {names}")

    quality = manifest["quality"]
    print(f"mode={'--write' if arguments.write else '--check'}")
    print(f"atlas_sha256={manifest['atlas']['sha256']}")
    print(f"lower_center_spread_display_px={quality['lowerBodyCenterSpreadDisplayPx']:.4f}")
    print(f"full_center_spread_display_px={quality['fullCenterSpreadDisplayPx']:.4f}")
    print(f"upper_body_center_spread_display_px={quality['upperBodyCenterSpreadDisplayPx']:.4f}")
    print(f"baseline_range_source_px={quality['baselineRangeSourcePx']}")
    print(f"magenta_fringe_pixels={quality['magentaFringePixels']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
