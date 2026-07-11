#!/usr/bin/env python3
"""Build the two-hand, blink, ear-flap, and continuous-tail chef-cat proof.

The approved neutral remains the visible artwork source. Generated edits are
used only as hidden clean-plate pixels and as two tiny open-eye patches. Every
anatomical motion is a rigid RGBA-layer transform around a documented pivot;
the cat, paws, ears, and tail are never mesh-stretched.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont

import build_cutout_rig_proof as v1
import build_transparent_cutout_rig_v2 as v2


FPS = 12
DURATION_SECONDS = 6
FRAME_COUNT = FPS * DURATION_SECONDS

SOURCE_SHA256 = "ec112924e2f6c9daa8988e68319ad05ee0c8d615459738a0b89be246c4f03704"
ALPHA_SUBJECT_SHA256 = "c5819b6742ad3de7394f14bb57b461fcb61744a090b798903a0effd12e298b85"


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def largest_filled_component(mask: np.ndarray) -> np.ndarray:
    component = v1.largest_component(mask)
    contours, _ = cv2.findContours(component, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    filled = np.zeros_like(component)
    cv2.drawContours(filled, contours, -1, 255, cv2.FILLED)
    return filled


def build_right_arm_masks(
    old_clean_bgr: np.ndarray,
    both_arms_clean_bgr: np.ndarray,
    master_alpha: np.ndarray,
) -> dict[str, np.ndarray]:
    """Recover the approved viewer-right arm from the clean-plate delta."""

    height, width = master_alpha.shape
    difference = np.max(cv2.absdiff(old_clean_bgr, both_arms_clean_bgr), axis=2)
    search = np.zeros((height, width), np.uint8)
    search[675:1010, 700:970] = np.where(
        difference[675:1010, 700:970] > 32, 255, 0
    ).astype(np.uint8)
    search = cv2.morphologyEx(
        search,
        cv2.MORPH_CLOSE,
        cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (11, 11)),
    )
    arm_full = largest_filled_component(search)
    arm_limit = v1.polygon_mask(
        (width, height),
        [
            (742, 690), (810, 690), (856, 720), (879, 770),
            (895, 819), (925, 865), (943, 922), (930, 970),
            (898, 988), (850, 981), (812, 948), (795, 903),
            (779, 868), (759, 835), (742, 785), (730, 735),
        ],
    )
    arm_full = cv2.bitwise_and(arm_full, arm_limit)
    arm_full = cv2.bitwise_and(arm_full, np.where(master_alpha > 0, 255, 0).astype(np.uint8))

    forearm_limit = v1.polygon_mask(
        (width, height),
        [
            (776, 827), (820, 811), (866, 827), (901, 861),
            (931, 912), (938, 953), (917, 982), (875, 989),
            (833, 970), (807, 935), (794, 893),
        ],
    )
    forearm = cv2.bitwise_and(arm_full, forearm_limit)
    upper_arm = arm_full.copy()
    upper_arm[forearm > 0] = 0

    # Both pieces retain a cuff overlap so rotations cannot open an elbow seam.
    cuff_overlap = v1.polygon_mask(
        (width, height),
        [(767, 816), (813, 800), (864, 817), (893, 853), (872, 881), (821, 875), (786, 854)],
    )
    shared = cv2.bitwise_and(arm_full, cuff_overlap)
    upper_arm[shared > 0] = 255
    forearm[shared > 0] = 255
    # Threshold deltas can leave isolated antialias specks near the scarf.
    # They are not anatomy, so keep only each articulated piece's body.
    upper_arm = largest_filled_component(upper_arm)
    forearm = largest_filled_component(forearm)
    return {
        "right_arm_full": arm_full,
        "right_upper_arm": upper_arm,
        "right_forearm_paw": forearm,
    }


def soft_eye_overlay(open_eye_rgb: np.ndarray, size: tuple[int, int]) -> Image.Image:
    """Keep only the two generated open-eye patches with feathered edges."""

    width, height = size
    mask = Image.new("L", size, 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle((500, 586, 611, 653), radius=27, fill=255)
    draw.rounded_rectangle((731, 551, 837, 621), radius=28, fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(4.0))
    rgba = np.zeros((height, width, 4), np.uint8)
    rgba[:, :, :3] = open_eye_rgb
    rgba[:, :, 3] = np.array(mask)
    return Image.fromarray(rgba, "RGBA")


def build_base(
    prior_base: Image.Image,
    both_arms_clean_rgba: np.ndarray,
    right_arm_mask: np.ndarray,
) -> Image.Image:
    """Replace only the removed right-arm footprint with hidden clean pixels."""

    base = np.array(prior_base.convert("RGBA"))
    replacement = both_arms_clean_rgba.copy()
    # A narrow dilation clears antialiased pixels from the removed arm edge.
    replace_mask = cv2.dilate(
        right_arm_mask,
        cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9)),
        iterations=1,
    )
    base[replace_mask > 0] = replacement[replace_mask > 0]
    return v2.sanitize_transparent_frame(Image.fromarray(base, "RGBA"))


def work_values(time_s: float, start: float, duration: float) -> tuple[float, float, float]:
    """Return anticipation, contact, and settle for one hand's knead beat."""

    u = (time_s - start) / duration
    if not 0.0 <= u <= 1.0:
        return 0.0, 0.0, 0.0
    if u < 0.22:
        return v1.smoothstep(u / 0.22), 0.0, 0.0
    if u < 0.50:
        return 1.0, v1.smoothstep((u - 0.22) / 0.28), 0.0
    if u < 0.64:
        return 1.0, 1.0, 0.0
    if u < 0.92:
        release = 1.0 - v1.smoothstep((u - 0.64) / 0.28)
        return release, release, 0.0
    settle_u = (u - 0.92) / 0.08
    return 0.0, 0.0, -0.10 * math.sin(math.pi * settle_u)


def blink_closed(time_s: float) -> bool:
    """Two short, readable blinks; closing reveals the approved line eyes."""

    return (2.50 <= time_s <= 2.68) or (5.22 <= time_s <= 5.38)


def build_frames(base: Image.Image, layers: dict[str, Image.Image]) -> list[Image.Image]:
    frames: list[Image.Image] = []
    neck_pivot = (650.0, 735.0)
    left_shoulder = (418.0, 770.0)
    left_elbow = (485.0, 875.0)
    right_shoulder = (805.0, 748.0)
    right_elbow = (850.0, 850.0)
    left_ear_pivot = (402.0, 458.0)
    right_ear_pivot = (778.0, 365.0)
    crown_pivot = (602.0, 269.0)
    tail_pivot = (345.0, 910.0)

    for index in range(FRAME_COUNT):
        # Sampling both 0 and 6 seconds makes a mathematically closed loop.
        time_s = index * DURATION_SECONDS / (FRAME_COUNT - 1)
        left_ant, left_contact, left_settle = work_values(time_s, 1.30, 0.94)
        right_ant, right_contact, right_settle = work_values(time_s, 3.22, 0.94)

        idle_angle = 0.11 * math.sin(2.0 * math.pi * time_s / DURATION_SECONDS)
        head_angle = (
            idle_angle
            + 1.30 * left_ant
            - 1.30 * right_ant
            - 0.16 * left_settle
            + 0.16 * right_settle
        )
        head_translate = (
            -4.5 * left_ant + 4.5 * right_ant,
            4.5 * (left_ant + right_ant),
        )

        left_upper_angle = -1.8 * left_ant - 0.8 * left_contact
        left_upper_translate = (-1.0 * left_ant, 7.0 * left_ant + 3.0 * left_contact)
        left_forearm_angle = 2.5 * left_contact
        left_forearm_translate = (-2.0 * left_contact, 14.0 * left_contact)

        right_upper_angle = 1.8 * right_ant + 0.8 * right_contact
        right_upper_translate = (1.0 * right_ant, 7.0 * right_ant + 3.0 * right_contact)
        right_forearm_angle = -2.5 * right_contact
        right_forearm_translate = (2.0 * right_contact, 14.0 * right_contact)

        # A full-time two-cycle sway is intentionally stronger than v2.
        tail_angle = 13.0 * math.sin(2.0 * math.pi * time_s / 3.0)
        tail = v1.rigid(layers["tail"], tail_angle, tail_pivot)

        head_core = v1.rigid(layers["head_core"], head_angle, neck_pivot, head_translate)
        open_eyes = v1.rigid(layers["open_eyes"], head_angle, neck_pivot, head_translate)

        left_ear = v1.rigid(layers["left_ear"], head_angle, neck_pivot, head_translate)
        left_pivot = v1.transform_point(left_ear_pivot, head_angle, neck_pivot, head_translate)
        left_flap = 8.0 * v1.pulse(time_s, 0.48, 0.34) - 4.2 * v1.pulse(time_s, 0.80, 0.25)
        left_ear = v1.rigid(left_ear, left_flap, left_pivot)

        right_ear = v1.rigid(layers["right_ear"], head_angle, neck_pivot, head_translate)
        right_pivot = v1.transform_point(right_ear_pivot, head_angle, neck_pivot, head_translate)
        right_flap = -8.0 * v1.pulse(time_s, 4.52, 0.34) + 4.2 * v1.pulse(time_s, 4.84, 0.25)
        right_ear = v1.rigid(right_ear, right_flap, right_pivot)

        crown = v1.rigid(layers["hat_crown"], head_angle, neck_pivot, head_translate)
        crown_pivot_moved = v1.transform_point(crown_pivot, head_angle, neck_pivot, head_translate)
        crown_kick = -0.20 * left_flap - 0.20 * right_flap
        crown = v1.rigid(crown, crown_kick, crown_pivot_moved, (0.0, abs(crown_kick) * 0.75))

        left_upper = v1.rigid(layers["upper_arm"], left_upper_angle, left_shoulder, left_upper_translate)
        left_forearm = v1.rigid(layers["forearm_paw"], left_upper_angle, left_shoulder, left_upper_translate)
        left_elbow_moved = v1.transform_point(left_elbow, left_upper_angle, left_shoulder, left_upper_translate)
        left_forearm = v1.rigid(left_forearm, left_forearm_angle, left_elbow_moved, left_forearm_translate)

        right_upper = v1.rigid(layers["right_upper_arm"], right_upper_angle, right_shoulder, right_upper_translate)
        right_forearm = v1.rigid(
            layers["right_forearm_paw"], right_upper_angle, right_shoulder, right_upper_translate
        )
        right_elbow_moved = v1.transform_point(
            right_elbow, right_upper_angle, right_shoulder, right_upper_translate
        )
        right_forearm = v1.rigid(
            right_forearm, right_forearm_angle, right_elbow_moved, right_forearm_translate
        )

        scene = Image.new("RGBA", base.size, (0, 0, 0, 0))
        scene = Image.alpha_composite(scene, tail)
        scene = Image.alpha_composite(scene, base)
        for contact, box in (
            (left_contact, (470, 982, 625, 1018)),
            (right_contact, (817, 928, 936, 978)),
        ):
            if contact > 0.02:
                shadow = Image.new("RGBA", base.size, (0, 0, 0, 0))
                ImageDraw.Draw(shadow).ellipse(box, fill=(105, 61, 28, round(30 * contact)))
                scene = Image.alpha_composite(scene, shadow)

        for layer in (
            left_upper,
            left_forearm,
            right_upper,
            right_forearm,
            left_ear,
            right_ear,
            crown,
            head_core,
        ):
            scene = Image.alpha_composite(scene, layer)
        if not blink_closed(time_s):
            scene = Image.alpha_composite(scene, open_eyes)
        frames.append(v2.sanitize_transparent_frame(scene))
    return frames


def save_contact_sheet(frames: list[Image.Image], output: Path) -> None:
    samples = [
        (0, "neutral/open"), (7, "left ear flap"), (20, "left knead"),
        (30, "blink"), (45, "right knead"), (55, "right ear flap"),
        (9, "tail right"), (27, "tail left"), (62, "open"),
    ]
    tile, label = 256, 30
    sheet = Image.new("RGB", (tile * 3, (tile + label) * 3), "white")
    draw = ImageDraw.Draw(sheet)
    font = ImageFont.load_default()
    for slot, (index, caption) in enumerate(samples):
        preview = v2.composite_background(frames[index], None, tile)
        x = slot % 3 * tile
        y = slot // 3 * (tile + label)
        sheet.paste(preview, (x, y))
        draw.text((x + 6, y + tile + 7), f"{index:02d} {caption}", fill="#3b2b26", font=font)
    sheet.save(output, optimize=True)


def changed_pixels(first: Image.Image, other: Image.Image, box: tuple[int, int, int, int]) -> int:
    diff = ImageChops.difference(first.crop(box), other.crop(box)).convert("L")
    return sum(diff.histogram()[1:])


def tail_tip_centroid(frame: Image.Image, tail_mask: np.ndarray) -> tuple[float, float]:
    ys, xs = np.where(tail_mask > 0)
    tip_x = int(xs.min())
    tip_region = tail_mask[:, max(0, tip_x - 8):tip_x + 14]
    ty, tx = np.where(tip_region > 0)
    return float((tx + max(0, tip_x - 8)).mean()), float(ty.mean())


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--asset-root", type=Path, default=Path("assets/taskbar-cat-cutout-rig-v3"))
    parser.add_argument("--fast-preview", action="store_true")
    args = parser.parse_args()

    source = Path("assets/taskbar-cat-living-v1/sources/chef-cat-v9-living-neutral-preview.png").resolve()
    old_clean_chroma = Path("assets/taskbar-cat-cutout-rig-v1/sources/chef-cat-v9-clean-base-chroma-v1.png").resolve()
    alpha_subject_path = Path("assets/taskbar-cat-cutout-rig-v1/sources/chef-cat-v9-alpha-subject-generated-v1.png").resolve()
    both_clean_chroma = Path("assets/taskbar-cat-cutout-rig-v3/sources/chef-cat-v9-clean-base-both-arms-chroma-v1.png").resolve()
    both_clean_alpha = Path("assets/taskbar-cat-cutout-rig-v3/sources/chef-cat-v9-clean-base-both-arms-alpha-v1.png").resolve()
    open_eyes_path = Path("assets/taskbar-cat-cutout-rig-v3/sources/chef-cat-v9-open-eyes-v1.png").resolve()
    prior_base_path = Path("assets/taskbar-cat-cutout-rig-v2/layers/base-transparent.png").resolve()

    if sha256(source) != SOURCE_SHA256:
        raise SystemExit("Approved source hash changed; refusing to build")
    if sha256(alpha_subject_path) != ALPHA_SUBJECT_SHA256:
        raise SystemExit("Approved subject alpha changed; refusing to build")

    asset_root = args.asset_root.resolve()
    layers_dir, qa_dir = asset_root / "layers", asset_root / "qa"
    layers_dir.mkdir(parents=True, exist_ok=True)
    qa_dir.mkdir(parents=True, exist_ok=True)

    source_bgr = cv2.imread(str(source), cv2.IMREAD_COLOR)
    old_clean_bgr = cv2.imread(str(old_clean_chroma), cv2.IMREAD_COLOR)
    both_clean_bgr = cv2.imread(str(both_clean_chroma), cv2.IMREAD_COLOR)
    source_rgb = cv2.cvtColor(source_bgr, cv2.COLOR_BGR2RGB)
    alpha_subject = np.array(Image.open(alpha_subject_path).convert("RGBA"))
    both_clean_rgba = np.array(Image.open(both_clean_alpha).convert("RGBA"))
    open_eyes_rgb = np.array(Image.open(open_eyes_path).convert("RGB"))

    masks = v2.build_v2_masks(source_bgr, cv2.imread(str(Path("assets/taskbar-cat-living-v1/sources/chef-cat-v9-clean-base-v1.png")), cv2.IMREAD_COLOR), alpha_subject[:, :, 3])
    masks.update(build_right_arm_masks(old_clean_bgr, both_clean_bgr, alpha_subject[:, :, 3]))
    base = build_base(Image.open(prior_base_path).convert("RGBA"), both_clean_rgba, masks["right_arm_full"])
    base.save(layers_dir / "base-transparent.png")

    layer_names = [
        "head_core", "left_ear", "right_ear", "hat_crown", "upper_arm",
        "forearm_paw", "right_upper_arm", "right_forearm_paw", "tail",
    ]
    layers: dict[str, Image.Image] = {}
    for name in layer_names:
        layer = v2.layer_from_approved_pixels(source_rgb, alpha_subject, masks[name])
        layer.save(layers_dir / f"{name.replace('_', '-')}.png")
        layers[name] = layer
    layers["open_eyes"] = soft_eye_overlay(open_eyes_rgb, Image.open(source).size)
    layers["open_eyes"].save(layers_dir / "open-eyes.png")

    frames = build_frames(base, layers)
    if args.fast_preview:
        save_contact_sheet(frames, Path("tmp/cutout-rig-v3-fast-contact.png"))
        v2.save_gif(frames, Path("tmp/cutout-rig-v3-fast-motion-384.gif"), 384, None)
        print(Path("tmp/cutout-rig-v3-fast-contact.png").resolve())
        print(Path("tmp/cutout-rig-v3-fast-motion-384.gif").resolve())
        return

    neutral = frames[0]
    neutral.save(asset_root / "chef-cat-transparent-neutral-open-eyes.png")
    v2.save_webp(frames, asset_root / "chef-cat-transparent-motion-128.webp", 128)
    v2.save_webp(frames, qa_dir / "chef-cat-transparent-motion-384.webp", 384)
    v2.save_apng(frames, qa_dir / "chef-cat-transparent-motion-128.png", 128)
    v2.save_gif(frames, qa_dir / "chef-cat-checker-motion-384.gif", 384, None)
    save_contact_sheet(frames, qa_dir / "transparent-motion-contact-sheet.png")
    v2.save_background_qa(neutral, qa_dir / "neutral-light-dark-checker.png")

    first_last_equal = ImageChops.difference(frames[0], frames[-1]).getbbox() is None
    root_box = (350, 1090, 1010, 1140)
    fixed_root_changes = max(changed_pixels(frames[0], frame, root_box) for frame in frames)
    green_pixels = max(v2.green_dominant_visible_pixels(frame) for frame in frames)
    corner_alpha = [
        neutral.getchannel("A").getpixel(point)
        for point in ((0, 0), (1253, 0), (0, 1253), (1253, 1253))
    ]

    # Directly measure the geometric tail-tip travel from the documented rigid transform.
    tail_tip = tail_tip_centroid(neutral, masks["tail"])
    radius = math.dist(tail_tip, (345.0, 910.0))
    tail_tip_source_travel = 2.0 * radius * math.sin(math.radians(13.0))
    tail_tip_128_travel = tail_tip_source_travel * 128.0 / 1254.0

    outputs = {
        "neutral": asset_root / "chef-cat-transparent-neutral-open-eyes.png",
        "motion_128_webp": asset_root / "chef-cat-transparent-motion-128.webp",
        "motion_384_webp": qa_dir / "chef-cat-transparent-motion-384.webp",
        "motion_128_apng": qa_dir / "chef-cat-transparent-motion-128.png",
        "checker_motion_384_gif": qa_dir / "chef-cat-checker-motion-384.gif",
        "contact_sheet": qa_dir / "transparent-motion-contact-sheet.png",
        "background_qa": qa_dir / "neutral-light-dark-checker.png",
    }
    metrics = {
        "status": "two-hand transparent articulated proof; user approval required",
        "source_sha256": sha256(source),
        "both_arms_clean_chroma_sha256": sha256(both_clean_chroma),
        "both_arms_clean_alpha_sha256": sha256(both_clean_alpha),
        "open_eyes_source_sha256": sha256(open_eyes_path),
        "frame_count": FRAME_COUNT,
        "duration_seconds": DURATION_SECONDS,
        "average_fps": FPS,
        "moving_layers": layer_names + ["open_eyes"],
        "cat_mesh_deformation_layers": [],
        "knead_events": [
            {"side": "viewer-left", "start_seconds": 1.30, "duration_seconds": 0.94},
            {"side": "viewer-right", "start_seconds": 3.22, "duration_seconds": 0.94},
        ],
        "blink_windows_seconds": [[2.50, 2.68], [5.22, 5.38]],
        "ear_flaps": {
            "viewer_left": {"primary_degrees": 8.0, "rebound_degrees": -4.2},
            "viewer_right": {"primary_degrees": -8.0, "rebound_degrees": 4.2},
        },
        "tail_sway": {
            "period_seconds": 3.0,
            "amplitude_degrees": 13.0,
            "pivot_source_pixels": [345, 910],
            "estimated_peak_to_peak_tip_travel_source_pixels": round(tail_tip_source_travel, 2),
            "estimated_peak_to_peak_tip_travel_128_pixels": round(tail_tip_128_travel, 2),
        },
        "transparent_corner_alpha": corner_alpha,
        "max_visible_green_dominant_pixels": green_pixels,
        "first_last_frames_identical": first_last_equal,
        "fixed_dough_root_max_changed_pixels": fixed_root_changes,
        "fixed_dough_root_box_source_pixels": list(root_box),
        "outputs": {key: {"path": path.as_posix(), "sha256": sha256(path)} for key, path in outputs.items()},
        "limitations": [
            "This proof is not connected to the HTML/runtime.",
            "Generated pixels are limited to the hidden viewer-right-arm clean plate and tiny open-eye patches.",
            "User visual approval is required before these timings become a production state.",
        ],
    }
    (asset_root / "transparent-rig-manifest.json").write_text(
        json.dumps(metrics, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(json.dumps(metrics, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
