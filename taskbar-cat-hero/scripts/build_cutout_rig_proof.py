#!/usr/bin/env python3
"""Build a rigid cutout-rig proof from the approved chef-cat neutral.

Rigid cat anatomy is extracted into RGBA layers and animated only with pivoted
rotation/translation.  No mesh deformation is applied to the head, face,
ears, torso, sleeves, or paws.  The generated clean plate is used only where
the approved still contains no hidden pixels behind the moving layers.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageChops, ImageDraw, ImageFont


FPS = 12
DURATION_SECONDS = 6
FRAME_COUNT = FPS * DURATION_SECONDS
EXPECTED_SOURCE_SHA256 = "ec112924e2f6c9daa8988e68319ad05ee0c8d615459738a0b89be246c4f03704"
EXPECTED_CLEAN_SHA256 = "b778ff6bddf8b158c56c28ac149b0a75f2aba28f7a5cf14b3265a9028dbfb3ac"


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def smoothstep(value: float) -> float:
    value = max(0.0, min(1.0, value))
    return value * value * (3.0 - 2.0 * value)


def pulse(time_s: float, start: float, duration: float) -> float:
    u = (time_s - start) / duration
    if not 0.0 <= u <= 1.0:
        return 0.0
    if u < 0.30:
        return smoothstep(u / 0.30)
    if u < 0.48:
        return 1.0
    return 1.0 - smoothstep((u - 0.48) / 0.52)


def work_values(time_s: float) -> tuple[float, float, float]:
    """Return anticipation, contact, and settle for a single work beat."""

    u = (time_s - 2.45) / 1.05
    if not 0.0 <= u <= 1.0:
        return 0.0, 0.0, 0.0
    if u < 0.22:
        return smoothstep(u / 0.22), 0.0, 0.0
    if u < 0.50:
        return 1.0, smoothstep((u - 0.22) / 0.28), 0.0
    if u < 0.63:
        return 1.0, 1.0, 0.0
    if u < 0.92:
        release = 1.0 - smoothstep((u - 0.63) / 0.29)
        return release, release, 0.0
    settle_u = (u - 0.92) / 0.08
    return 0.0, 0.0, -0.10 * math.sin(math.pi * settle_u)


def polygon_mask(size: tuple[int, int], points: list[tuple[int, int]]) -> np.ndarray:
    mask = np.zeros((size[1], size[0]), np.uint8)
    cv2.fillPoly(mask, [np.array(points, np.int32)], 255)
    return mask


def largest_component(mask: np.ndarray) -> np.ndarray:
    count, labels, stats, _ = cv2.connectedComponentsWithStats(mask)
    if count <= 1:
        raise RuntimeError("No foreground component found")
    index = 1 + int(np.argmax(stats[1:, cv2.CC_STAT_AREA]))
    component = np.where(labels == index, 255, 0).astype(np.uint8)
    contours, _ = cv2.findContours(component, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    filled = np.zeros_like(component)
    cv2.drawContours(filled, contours, -1, 255, cv2.FILLED)
    return filled


def build_masks(original: np.ndarray, clean: np.ndarray) -> dict[str, np.ndarray]:
    height, width = original.shape[:2]
    difference = np.max(cv2.absdiff(original, clean), axis=2)

    head_raw = np.zeros((height, width), np.uint8)
    head_raw[40:790, 240:960] = np.where(
        difference[40:790, 240:960] > 12, 255, 0
    ).astype(np.uint8)
    head_raw = cv2.morphologyEx(
        head_raw,
        cv2.MORPH_CLOSE,
        cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7)),
    )
    head_full = largest_component(head_raw)
    head_full[758:, :] = 0  # chin/scarf seam; the generated base keeps the scarf.

    arm_search = np.zeros((height, width), np.uint8)
    arm_search[690:1080, 340:680] = np.where(
        difference[690:1080, 340:680] > 18, 255, 0
    ).astype(np.uint8)
    arm_search = cv2.morphologyEx(
        arm_search,
        cv2.MORPH_CLOSE,
        cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7)),
    )
    arm_search = largest_component(arm_search)
    arm_limit = polygon_mask(
        (width, height),
        [
            (392, 724), (440, 728), (500, 770), (548, 830),
            (585, 892), (620, 952), (640, 1008), (620, 1042),
            (575, 1055), (522, 1040), (475, 1008), (448, 960),
            (426, 918), (397, 902), (375, 858), (374, 790),
        ],
    )
    arm_full = cv2.bitwise_and(arm_search, arm_limit)
    arm_full = largest_component(arm_full)

    crown_limit = polygon_mask(
        (width, height),
        [
            (370, 218), (374, 165), (394, 124), (430, 100),
            (478, 100), (501, 69), (619, 64), (678, 101),
            (727, 98), (765, 126), (774, 174), (760, 218),
            (720, 247), (670, 260), (600, 272), (510, 284),
            (435, 278), (393, 254),
        ],
    )
    crown = cv2.bitwise_and(head_full, crown_limit)

    ear_limit = polygon_mask(
        (width, height),
        [
            # The polygon sits outside the full visible ear contour.  A tighter
            # polygon left part of the old outer outline in head_core, producing
            # a doubled line when the rigid ear rotated.
            (310, 505), (286, 460), (284, 360), (294, 270),
            (324, 250), (378, 263), (438, 298), (501, 338),
            (492, 401), (462, 441), (421, 474), (360, 506),
        ],
    )
    left_ear = cv2.bitwise_and(head_full, ear_limit)

    # Head/band overlap hides the two moving-layer bases and prevents visible gaps.
    band_overlap = polygon_mask(
        (width, height),
        [(455, 250), (700, 244), (718, 263), (716, 338), (681, 353), (503, 368), (472, 344)],
    )
    ear_base_overlap = polygon_mask(
        (width, height),
        # Only the inner attachment stays with the head.  Keeping the outer
        # ear outline here creates a visible doubled contour when the ear turns.
        [(405, 432), (442, 410), (486, 382), (480, 454), (447, 478), (410, 482)],
    )

    head_core = head_full.copy()
    head_core[crown > 0] = 0
    head_core[left_ear > 0] = 0
    head_core[cv2.bitwise_and(head_full, band_overlap) > 0] = 255
    head_core[cv2.bitwise_and(head_full, ear_base_overlap) > 0] = 255

    forearm_limit = polygon_mask(
        (width, height),
        [
            (425, 862), (470, 838), (528, 850), (574, 890),
            (610, 945), (637, 1004), (619, 1043), (575, 1056),
            (522, 1040), (476, 1008), (447, 962),
        ],
    )
    forearm = cv2.bitwise_and(arm_full, forearm_limit)
    upper_arm = arm_full.copy()
    upper_arm[forearm > 0] = 0
    # A small cuff overlap follows both pieces and conceals the elbow split.
    cuff_overlap = polygon_mask(
        (width, height),
        [(421, 852), (468, 830), (530, 843), (566, 883), (545, 910), (485, 900), (440, 882)],
    )
    forearm[cv2.bitwise_and(arm_full, cuff_overlap) > 0] = 255
    upper_arm[cv2.bitwise_and(arm_full, cuff_overlap) > 0] = 255

    return {
        "head_full": head_full,
        "arm_full": arm_full,
        "head_core": head_core,
        "left_ear": left_ear,
        "hat_crown": crown,
        "upper_arm": upper_arm,
        "forearm_paw": forearm,
    }


def rgba_layer(original_rgb: np.ndarray, mask: np.ndarray) -> Image.Image:
    rgba = np.dstack((original_rgb, mask))
    return Image.fromarray(rgba, "RGBA")


def rigid(
    layer: Image.Image,
    angle_deg: float,
    pivot: tuple[float, float],
    translate: tuple[float, float] = (0.0, 0.0),
) -> Image.Image:
    # Rotate in premultiplied-alpha space.  Straight-alpha bicubic sampling lets
    # hidden RGB from transparent pixels leak into the ear/hat outline as a
    # doubled gray fringe after rotation.
    premultiplied = layer.convert("RGBa")
    transformed = premultiplied.rotate(
        angle_deg,
        resample=Image.Resampling.BICUBIC,
        center=(round(pivot[0]), round(pivot[1])),
        translate=(round(translate[0]), round(translate[1])),
        fillcolor=(0, 0, 0, 0),
    )
    return transformed.convert("RGBA")


def transform_point(
    point: tuple[float, float],
    angle_deg: float,
    pivot: tuple[float, float],
    translate: tuple[float, float],
) -> tuple[float, float]:
    angle = math.radians(-angle_deg)  # Pillow image-space rotation.
    x, y = point[0] - pivot[0], point[1] - pivot[1]
    return (
        pivot[0] + x * math.cos(angle) - y * math.sin(angle) + translate[0],
        pivot[1] + x * math.sin(angle) + y * math.cos(angle) + translate[1],
    )


def alpha_over(base: Image.Image, *layers: Image.Image) -> Image.Image:
    output = base.copy()
    for layer in layers:
        output = Image.alpha_composite(output, layer)
    return output


def build_frames(base: Image.Image, layers: dict[str, Image.Image]) -> list[Image.Image]:
    frames: list[Image.Image] = []
    neck_pivot = (650.0, 735.0)
    shoulder_pivot = (418.0, 770.0)
    elbow_pivot = (485.0, 875.0)
    ear_pivot = (402.0, 458.0)
    crown_pivot = (602.0, 269.0)

    for index in range(FRAME_COUNT):
        time_s = 0.0 if index == FRAME_COUNT - 1 else index / FPS
        anticipation, contact, settle = work_values(time_s)

        # Very small rigid idle rotation; never scaling or mesh deformation.
        idle_angle = 0.10 * math.sin(2.0 * math.pi * time_s / DURATION_SECONDS)
        head_angle = idle_angle + 1.45 * anticipation - 0.18 * settle
        head_translate = (-5.0 * anticipation, 5.0 * anticipation)

        upper_angle = -1.8 * anticipation - 0.8 * contact
        upper_translate = (-1.0 * anticipation, 7.0 * anticipation + 3.0 * contact)
        forearm_extra_angle = 2.4 * contact
        forearm_extra_translate = (-2.0 * contact, 14.0 * contact)

        head_core = rigid(layers["head_core"], head_angle, neck_pivot, head_translate)

        left_ear = rigid(layers["left_ear"], head_angle, neck_pivot, head_translate)
        transformed_ear_pivot = transform_point(ear_pivot, head_angle, neck_pivot, head_translate)
        ear_flick = 3.2 * pulse(time_s, 1.15, 0.48) + 1.5 * anticipation
        left_ear = rigid(left_ear, ear_flick, transformed_ear_pivot)

        crown = rigid(layers["hat_crown"], head_angle, neck_pivot, head_translate)
        transformed_crown_pivot = transform_point(crown_pivot, head_angle, neck_pivot, head_translate)
        delayed_anticipation, _, _ = work_values(max(0.0, time_s - 0.075))
        crown_lag = (delayed_anticipation - anticipation) * 2.8
        crown = rigid(crown, crown_lag, transformed_crown_pivot, (0.0, abs(crown_lag) * 0.8))

        upper_arm = rigid(layers["upper_arm"], upper_angle, shoulder_pivot, upper_translate)
        forearm = rigid(layers["forearm_paw"], upper_angle, shoulder_pivot, upper_translate)
        transformed_elbow = transform_point(elbow_pivot, upper_angle, shoulder_pivot, upper_translate)
        forearm = rigid(forearm, forearm_extra_angle, transformed_elbow, forearm_extra_translate)

        scene = base.copy()
        if contact > 0.02:
            shadow = Image.new("RGBA", base.size, (0, 0, 0, 0))
            draw = ImageDraw.Draw(shadow)
            alpha = round(30 * contact)
            draw.ellipse((470, 982, 625, 1018), fill=(105, 61, 28, alpha))
            scene = Image.alpha_composite(scene, shadow)

        frame = alpha_over(scene, upper_arm, forearm, left_ear, crown, head_core)
        frames.append(frame)
    return frames


def frame_durations(count: int) -> list[int]:
    return [90 if index % 3 == 2 else 80 for index in range(count)]


def save_gif(frames: list[Image.Image], output: Path, size: int) -> None:
    resized = [frame.convert("RGB").resize((size, size), Image.Resampling.LANCZOS) for frame in frames]
    palette = resized[0].quantize(colors=256, method=Image.Quantize.MEDIANCUT)
    paletted = [frame.quantize(palette=palette, dither=Image.Dither.NONE) for frame in resized]
    paletted[0].save(
        output,
        save_all=True,
        append_images=paletted[1:],
        duration=frame_durations(len(paletted)),
        loop=0,
        disposal=1,
        optimize=False,
    )


def save_webp(frames: list[Image.Image], output: Path, size: int) -> None:
    resized = [frame.convert("RGB").resize((size, size), Image.Resampling.LANCZOS) for frame in frames]
    resized[0].save(
        output,
        save_all=True,
        append_images=resized[1:],
        duration=frame_durations(len(resized)),
        loop=0,
        lossless=True,
        quality=100,
        method=0,
    )


def save_contact_sheet(frames: list[Image.Image], output: Path) -> None:
    sample_indices = [0, 14, 16, 28, 30, 32, 34, 36, 39, 43, 55, 71]
    tile = 192
    label_height = 24
    sheet = Image.new("RGB", (tile * 4, (tile + label_height) * 3), "#fff5df")
    draw = ImageDraw.Draw(sheet)
    font = ImageFont.load_default()
    for slot, frame_index in enumerate(sample_indices):
        preview = frames[frame_index].convert("RGB").resize((tile, tile), Image.Resampling.LANCZOS)
        left = slot % 4 * tile
        top = slot // 4 * (tile + label_height)
        sheet.paste(preview, (left, top))
        draw.text(
            (left + 6, top + tile + 5),
            f"{frame_index / FPS:4.2f}s / {frame_index:03d}",
            fill="#5c341f",
            font=font,
        )
    sheet.save(output, optimize=True)


def changed_pixels(first: Image.Image, other: Image.Image, box: tuple[int, int, int, int]) -> int:
    difference = ImageChops.difference(first.crop(box).convert("RGB"), other.crop(box).convert("RGB"))
    return sum(difference.convert("L").histogram()[1:])


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--source",
        type=Path,
        default=Path("assets/taskbar-cat-living-v1/sources/chef-cat-v9-living-neutral-preview.png"),
    )
    parser.add_argument(
        "--clean",
        type=Path,
        default=Path("assets/taskbar-cat-living-v1/sources/chef-cat-v9-clean-base-v1.png"),
    )
    parser.add_argument(
        "--asset-root",
        type=Path,
        default=Path("assets/taskbar-cat-cutout-rig-v1"),
    )
    args = parser.parse_args()

    source = args.source.resolve()
    clean_path = args.clean.resolve()
    asset_root = args.asset_root.resolve()
    layers_dir = asset_root / "layers"
    qa_dir = asset_root / "qa"
    layers_dir.mkdir(parents=True, exist_ok=True)
    qa_dir.mkdir(parents=True, exist_ok=True)

    if sha256(source) != EXPECTED_SOURCE_SHA256:
        raise SystemExit("Approved source hash changed; refusing to build")
    if sha256(clean_path) != EXPECTED_CLEAN_SHA256:
        raise SystemExit("Clean-plate hash changed; refusing to build")

    original_bgr = cv2.imread(str(source), cv2.IMREAD_COLOR)
    clean_bgr = cv2.imread(str(clean_path), cv2.IMREAD_COLOR)
    if original_bgr is None or clean_bgr is None or original_bgr.shape != clean_bgr.shape:
        raise SystemExit("Source and clean plate must be readable and have the same size")
    original_rgb = cv2.cvtColor(original_bgr, cv2.COLOR_BGR2RGB)
    clean_rgb = cv2.cvtColor(clean_bgr, cv2.COLOR_BGR2RGB)

    masks = build_masks(original_bgr, clean_bgr)
    removal = cv2.bitwise_or(masks["head_full"], masks["arm_full"])
    base_rgb = original_rgb.copy()
    base_rgb[removal > 0] = clean_rgb[removal > 0]
    base = Image.fromarray(np.dstack((base_rgb, np.full(removal.shape, 255, np.uint8))), "RGBA")
    base.save(layers_dir / "base-clean-composite.png")

    layer_names = ["head_core", "left_ear", "hat_crown", "upper_arm", "forearm_paw"]
    layers: dict[str, Image.Image] = {}
    for name in layer_names:
        layer = rgba_layer(original_rgb, masks[name])
        layer.save(layers_dir / f"{name.replace('_', '-')}.png")
        layers[name] = layer

    frames = build_frames(base, layers)
    neutral = frames[0]
    original_image = Image.open(source).convert("RGBA")
    neutral.save(qa_dir / "cutout-neutral-reconstruction.png")
    save_contact_sheet(frames, qa_dir / "cutout-rig-contact-sheet.png")
    save_gif(frames, qa_dir / "cutout-rig-proof-128.gif", 128)
    save_gif(frames, qa_dir / "cutout-rig-proof-384.gif", 384)
    save_webp(frames, qa_dir / "cutout-rig-proof-384-lossless.webp", 384)

    source_diff = ImageChops.difference(neutral.convert("RGB"), original_image.convert("RGB"))
    source_diff_hist = source_diff.convert("L").histogram()
    source_changed = sum(source_diff_hist[1:])
    source_diff_bbox = source_diff.getbbox()
    fixed_counter_box = (0, round(base.height * 0.91), base.width, base.height)
    fixed_counter_changed = max(changed_pixels(frames[0], frame, fixed_counter_box) for frame in frames)
    first_last_equal = ImageChops.difference(frames[0], frames[-1]).getbbox() is None

    outputs = {
        "proof_128": qa_dir / "cutout-rig-proof-128.gif",
        "proof_384": qa_dir / "cutout-rig-proof-384.gif",
        "proof_384_lossless": qa_dir / "cutout-rig-proof-384-lossless.webp",
        "contact_sheet": qa_dir / "cutout-rig-contact-sheet.png",
        "neutral_reconstruction": qa_dir / "cutout-neutral-reconstruction.png",
    }
    metrics = {
        "status": "articulated cutout proof; user approval required",
        "source_sha256": sha256(source),
        "clean_plate_sha256": sha256(clean_path),
        "size": list(original_image.size),
        "fps": FPS,
        "duration_seconds": DURATION_SECONDS,
        "frame_count": FRAME_COUNT,
        "rigid_layers": layer_names,
        "soft_mesh_deformation_layers": [],
        "pivots_source_pixels": {
            "neck": [650, 735],
            "viewer_left_shoulder": [418, 770],
            "viewer_left_elbow": [485, 875],
            "viewer_left_ear_base": [402, 458],
            "hat_crown_base": [602, 269],
        },
        "neutral_reconstruction_changed_pixels": source_changed,
        "neutral_reconstruction_difference_bbox": list(source_diff_bbox) if source_diff_bbox else None,
        "fixed_lower_counter_max_changed_pixels": fixed_counter_changed,
        "first_last_frames_identical": first_last_equal,
        "outputs": {
            key: {"path": path.as_posix(), "sha256": sha256(path)} for key, path in outputs.items()
        },
        "limitations": [
            "The generated clean plate is used only under removed head/arm regions.",
            "The proof has one viewer-left work beat and is not connected to runtime input.",
            "The cream background remains; production transparency and Unity import are deferred.",
            "User final-speed visual approval is required before adding the opposite arm or runtime states.",
        ],
    }
    (asset_root / "cutout-rig-manifest.json").write_text(
        json.dumps(metrics, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(json.dumps(metrics, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
