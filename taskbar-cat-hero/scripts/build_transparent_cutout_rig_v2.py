#!/usr/bin/env python3
"""Build the transparent two-ear/tail articulated chef-cat proof.

The approved neutral supplies interior pixels.  Built-in image edits provide
only high-fidelity chroma/alpha mattes and the hidden clean-base pixels.  Every
cat part moves as a rigid RGBA layer around a documented pivot; no cat mesh
stretching is used.
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

import build_cutout_rig_proof as v1


FPS = 12
DURATION_SECONDS = 6
FRAME_COUNT = FPS * DURATION_SECONDS
SOURCE_SHA256 = "ec112924e2f6c9daa8988e68319ad05ee0c8d615459738a0b89be246c4f03704"
CLEAN_PLATE_SHA256 = "b778ff6bddf8b158c56c28ac149b0a75f2aba28f7a5cf14b3265a9028dbfb3ac"
ALPHA_SUBJECT_SHA256 = "c5819b6742ad3de7394f14bb57b461fcb61744a090b798903a0effd12e298b85"
ALPHA_CLEAN_BASE_SHA256 = "47b661bcbc9f5146fe2198a3da3f3edd630b6e241407fc8904ad83306fe701ce"


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def frame_durations(count: int) -> list[int]:
    return [90 if index % 3 == 2 else 80 for index in range(count)]


def build_v2_masks(
    original_bgr: np.ndarray,
    clean_bgr: np.ndarray,
    master_alpha: np.ndarray,
) -> dict[str, np.ndarray]:
    masks = v1.build_masks(original_bgr, clean_bgr)
    height, width = master_alpha.shape

    right_ear_limit = v1.polygon_mask(
        (width, height),
        [
            # Only the upper ear moves.  Extending this cut into the cheek made
            # a diagonal seam when the ear rotated independently.
            (700, 310), (758, 240), (792, 200), (826, 190),
            (855, 205), (872, 246), (870, 348), (862, 397),
            (843, 414), (807, 388), (770, 352), (732, 330),
        ],
    )
    right_ear = cv2.bitwise_and(masks["head_full"], right_ear_limit)

    head_core = masks["head_core"].copy()
    head_core[right_ear > 0] = 0
    right_ear_base_overlap = v1.polygon_mask(
        (width, height),
        [(730, 326), (770, 350), (808, 382), (846, 410), (820, 426), (776, 398), (740, 365)],
    )
    head_core[cv2.bitwise_and(masks["head_full"], right_ear_base_overlap) > 0] = 255

    tail_limit = v1.polygon_mask(
        (width, height),
        [
            (238, 858), (244, 826), (263, 807), (286, 808),
            (302, 829), (312, 857), (327, 877), (354, 892),
            (365, 913), (350, 936), (324, 954), (293, 949),
            (264, 929), (246, 901),
        ],
    )
    alpha_binary = np.where(master_alpha > 0, 255, 0).astype(np.uint8)
    tail = cv2.bitwise_and(alpha_binary, tail_limit)
    # The pouch owns the hidden attachment.  Removing this overlap from the
    # moving tail keeps the brown pouch and tail base stable while the visible
    # white tail sways behind them.
    pouch_keep = v1.polygon_mask(
        (width, height),
        [(318, 842), (458, 850), (456, 1035), (330, 1025)],
    )
    tail[pouch_keep > 0] = 0

    masks["head_core"] = head_core
    masks["right_ear"] = right_ear
    masks["tail"] = tail
    return masks


def layer_from_approved_pixels(
    original_rgb: np.ndarray,
    generated_subject_rgba: np.ndarray,
    binary_mask: np.ndarray,
) -> Image.Image:
    alpha = (
        generated_subject_rgba[:, :, 3].astype(np.uint16)
        * (binary_mask.astype(np.uint16) // 255)
    ).astype(np.uint8)
    rgb = original_rgb.copy()
    partial = (alpha > 0) & (alpha < 255)
    rgb[partial] = generated_subject_rgba[:, :, :3][partial]
    rgb[alpha == 0] = 0
    return Image.fromarray(np.dstack((rgb, alpha)), "RGBA")


def transparent_base(
    preserved_base_rgb: np.ndarray,
    generated_clean_rgba: np.ndarray,
    tail_mask: np.ndarray,
) -> Image.Image:
    alpha = generated_clean_rgba[:, :, 3].copy()
    alpha[tail_mask > 0] = 0
    rgb = preserved_base_rgb.copy()
    partial = (alpha > 0) & (alpha < 255)
    rgb[partial] = generated_clean_rgba[:, :, :3][partial]
    rgb[alpha == 0] = 0
    return Image.fromarray(np.dstack((rgb, alpha)), "RGBA")


def sanitize_transparent_frame(frame: Image.Image) -> Image.Image:
    """Clear hidden RGB and remove any remaining visible chroma-edge pixels."""

    array = np.array(frame.convert("RGBA"), dtype=np.uint8)
    alpha = array[:, :, 3]
    array[alpha == 0, :3] = 0

    work = array.astype(np.int16)
    red, green, blue = [work[:, :, index] for index in range(3)]
    bad = (alpha >= 32) & (green > 100) & (green > red + 20) & (green > blue + 35)
    ys, xs = np.where(bad)
    for y, x in zip(ys, xs):
        y0, y1 = max(0, y - 3), min(array.shape[0], y + 4)
        x0, x1 = max(0, x - 3), min(array.shape[1], x + 4)
        patch = array[y0:y1, x0:x1]
        patch_alpha = patch[:, :, 3]
        patch_rgb = patch[:, :, :3].astype(np.int16)
        pr, pg, pb = [patch_rgb[:, :, index] for index in range(3)]
        valid = (
            (patch_alpha >= 32)
            & ~((pg > 100) & (pg > pr + 20) & (pg > pb + 35))
        )
        candidates = patch[:, :, :3][valid]
        if len(candidates):
            array[y, x, :3] = np.median(candidates, axis=0).astype(np.uint8)
    return Image.fromarray(array, "RGBA")


def build_frames(
    base: Image.Image,
    layers: dict[str, Image.Image],
) -> list[Image.Image]:
    frames: list[Image.Image] = []
    neck_pivot = (650.0, 735.0)
    shoulder_pivot = (418.0, 770.0)
    elbow_pivot = (485.0, 875.0)
    left_ear_pivot = (402.0, 458.0)
    right_ear_pivot = (778.0, 365.0)
    crown_pivot = (602.0, 269.0)
    tail_pivot = (345.0, 910.0)

    for index in range(FRAME_COUNT):
        time_s = 0.0 if index == FRAME_COUNT - 1 else index / FPS
        anticipation, contact, settle = v1.work_values(time_s)

        idle_angle = 0.10 * math.sin(2.0 * math.pi * time_s / DURATION_SECONDS)
        head_angle = idle_angle + 1.45 * anticipation - 0.18 * settle
        head_translate = (-5.0 * anticipation, 5.0 * anticipation)

        upper_angle = -1.8 * anticipation - 0.8 * contact
        upper_translate = (-1.0 * anticipation, 7.0 * anticipation + 3.0 * contact)
        forearm_extra_angle = 2.4 * contact
        forearm_extra_translate = (-2.0 * contact, 14.0 * contact)

        tail_angle = 4.2 * math.sin(2.0 * math.pi * time_s / 3.0) - 0.8 * anticipation
        tail = v1.rigid(layers["tail"], tail_angle, tail_pivot)

        head_core = v1.rigid(layers["head_core"], head_angle, neck_pivot, head_translate)

        left_ear = v1.rigid(layers["left_ear"], head_angle, neck_pivot, head_translate)
        left_pivot = v1.transform_point(left_ear_pivot, head_angle, neck_pivot, head_translate)
        left_flick = 3.2 * v1.pulse(time_s, 1.15, 0.48) + 1.5 * anticipation
        left_ear = v1.rigid(left_ear, left_flick, left_pivot)

        right_ear = v1.rigid(layers["right_ear"], head_angle, neck_pivot, head_translate)
        right_pivot = v1.transform_point(right_ear_pivot, head_angle, neck_pivot, head_translate)
        right_flick = -2.6 * v1.pulse(time_s, 4.45, 0.48) - 0.7 * anticipation
        right_ear = v1.rigid(right_ear, right_flick, right_pivot)

        crown = v1.rigid(layers["hat_crown"], head_angle, neck_pivot, head_translate)
        crown_pivot_moved = v1.transform_point(crown_pivot, head_angle, neck_pivot, head_translate)
        delayed_anticipation, _, _ = v1.work_values(max(0.0, time_s - 0.075))
        crown_lag = (delayed_anticipation - anticipation) * 2.8
        crown = v1.rigid(crown, crown_lag, crown_pivot_moved, (0.0, abs(crown_lag) * 0.8))

        upper_arm = v1.rigid(layers["upper_arm"], upper_angle, shoulder_pivot, upper_translate)
        forearm = v1.rigid(layers["forearm_paw"], upper_angle, shoulder_pivot, upper_translate)
        elbow_moved = v1.transform_point(elbow_pivot, upper_angle, shoulder_pivot, upper_translate)
        forearm = v1.rigid(forearm, forearm_extra_angle, elbow_moved, forearm_extra_translate)

        scene = Image.new("RGBA", base.size, (0, 0, 0, 0))
        scene = Image.alpha_composite(scene, tail)
        scene = Image.alpha_composite(scene, base)
        if contact > 0.02:
            shadow = Image.new("RGBA", base.size, (0, 0, 0, 0))
            ImageDraw.Draw(shadow).ellipse(
                (470, 982, 625, 1018),
                fill=(105, 61, 28, round(30 * contact)),
            )
            scene = Image.alpha_composite(scene, shadow)
        for layer in (upper_arm, forearm, left_ear, right_ear, crown, head_core):
            scene = Image.alpha_composite(scene, layer)
        frames.append(sanitize_transparent_frame(scene))
    return frames


def checker(size: tuple[int, int], cell: int = 24) -> Image.Image:
    image = Image.new("RGBA", size, (232, 232, 232, 255))
    draw = ImageDraw.Draw(image)
    for y in range(0, size[1], cell):
        for x in range(0, size[0], cell):
            if (x // cell + y // cell) % 2:
                draw.rectangle((x, y, x + cell - 1, y + cell - 1), fill=(188, 188, 188, 255))
    return image


def composite_background(frame: Image.Image, color: str | None, size: int) -> Image.Image:
    resized = frame.resize((size, size), Image.Resampling.LANCZOS)
    background = checker((size, size), max(8, size // 16)) if color is None else Image.new("RGBA", (size, size), color)
    return Image.alpha_composite(background, resized).convert("RGB")


def save_gif(frames: list[Image.Image], output: Path, size: int, background: str | None) -> None:
    rgb_frames = [composite_background(frame, background, size) for frame in frames]
    palette = rgb_frames[0].quantize(colors=256, method=Image.Quantize.MEDIANCUT)
    paletted = [frame.quantize(palette=palette, dither=Image.Dither.NONE) for frame in rgb_frames]
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
    resized = [frame.resize((size, size), Image.Resampling.LANCZOS) for frame in frames]
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


def save_apng(frames: list[Image.Image], output: Path, size: int) -> None:
    resized = [frame.resize((size, size), Image.Resampling.LANCZOS) for frame in frames]
    resized[0].save(
        output,
        save_all=True,
        append_images=resized[1:],
        duration=frame_durations(len(resized)),
        loop=0,
        disposal=0,
        blend=0,
        optimize=False,
    )


def save_contact_sheet(frames: list[Image.Image], output: Path) -> None:
    indices = [0, 14, 16, 28, 30, 32, 34, 36, 39, 54, 56, 71]
    tile, label = 192, 24
    sheet = Image.new("RGB", (tile * 4, (tile + label) * 3), "white")
    draw = ImageDraw.Draw(sheet)
    font = ImageFont.load_default()
    for slot, index in enumerate(indices):
        preview = composite_background(frames[index], None, tile)
        x = slot % 4 * tile
        y = slot // 4 * (tile + label)
        sheet.paste(preview, (x, y))
        draw.text((x + 6, y + tile + 5), f"{index / FPS:4.2f}s / {index:03d}", fill="#3b2b26", font=font)
    sheet.save(output, optimize=True)


def save_background_qa(neutral: Image.Image, output: Path) -> None:
    tile = 256
    sheet = Image.new("RGB", (tile * 3, tile), "white")
    for index, background in enumerate(("#fff8ec", "#20252d", None)):
        sheet.paste(composite_background(neutral, background, tile), (index * tile, 0))
    sheet.save(output, optimize=True)


def green_dominant_visible_pixels(frame: Image.Image) -> int:
    array = np.array(frame.convert("RGBA"), dtype=np.int16)
    red, green, blue, alpha = [array[:, :, index] for index in range(4)]
    bad = (alpha >= 32) & (green > 100) & (green > red + 20) & (green > blue + 35)
    return int(bad.sum())


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--asset-root", type=Path, default=Path("assets/taskbar-cat-cutout-rig-v2"))
    parser.add_argument("--fast-preview", action="store_true")
    args = parser.parse_args()

    source = Path("assets/taskbar-cat-living-v1/sources/chef-cat-v9-living-neutral-preview.png").resolve()
    clean = Path("assets/taskbar-cat-living-v1/sources/chef-cat-v9-clean-base-v1.png").resolve()
    preserved_base_path = Path("assets/taskbar-cat-cutout-rig-v1/layers/base-clean-composite.png").resolve()
    generated_subject_path = Path("assets/taskbar-cat-cutout-rig-v1/sources/chef-cat-v9-alpha-subject-generated-v1.png").resolve()
    generated_clean_path = Path("assets/taskbar-cat-cutout-rig-v1/sources/chef-cat-v9-clean-base-alpha-v1.png").resolve()
    expected = {
        source: SOURCE_SHA256,
        clean: CLEAN_PLATE_SHA256,
        generated_subject_path: ALPHA_SUBJECT_SHA256,
        generated_clean_path: ALPHA_CLEAN_BASE_SHA256,
    }
    for path, expected_hash in expected.items():
        actual = sha256(path)
        if actual != expected_hash:
            raise SystemExit(f"Hash mismatch for {path}: {actual}")

    asset_root = args.asset_root.resolve()
    layers_dir, qa_dir = asset_root / "layers", asset_root / "qa"
    layers_dir.mkdir(parents=True, exist_ok=True)
    qa_dir.mkdir(parents=True, exist_ok=True)

    original_bgr = cv2.imread(str(source), cv2.IMREAD_COLOR)
    clean_bgr = cv2.imread(str(clean), cv2.IMREAD_COLOR)
    original_rgb = cv2.cvtColor(original_bgr, cv2.COLOR_BGR2RGB)
    generated_subject = np.array(Image.open(generated_subject_path).convert("RGBA"))
    generated_clean = np.array(Image.open(generated_clean_path).convert("RGBA"))
    preserved_base_rgb = np.array(Image.open(preserved_base_path).convert("RGB"))

    masks = build_v2_masks(original_bgr, clean_bgr, generated_subject[:, :, 3])
    base = transparent_base(preserved_base_rgb, generated_clean, masks["tail"])
    base.save(layers_dir / "base-transparent.png")

    names = ["head_core", "left_ear", "right_ear", "hat_crown", "upper_arm", "forearm_paw", "tail"]
    layers: dict[str, Image.Image] = {}
    for name in names:
        layer = layer_from_approved_pixels(original_rgb, generated_subject, masks[name])
        layer.save(layers_dir / f"{name.replace('_', '-')}.png")
        layers[name] = layer

    frames = build_frames(base, layers)
    if args.fast_preview:
        preview = composite_background(frames[56], "#20252d", 384)
        preview_path = Path("tmp/transparent-rig-v2-fast-frame-56.png").resolve()
        preview_path.parent.mkdir(parents=True, exist_ok=True)
        preview.save(preview_path)
        print(preview_path)
        return
    neutral = frames[0]
    neutral.save(asset_root / "chef-cat-transparent-neutral.png")
    save_webp(frames, asset_root / "chef-cat-transparent-motion-128.webp", 128)
    save_webp(frames, qa_dir / "chef-cat-transparent-motion-384.webp", 384)
    save_apng(frames, qa_dir / "chef-cat-transparent-motion-128.png", 128)
    save_gif(frames, qa_dir / "chef-cat-checker-motion-384.gif", 384, None)
    save_contact_sheet(frames, qa_dir / "transparent-motion-contact-sheet.png")
    save_background_qa(neutral, qa_dir / "neutral-light-dark-checker.png")

    alpha = neutral.getchannel("A")
    transparent_corners = [alpha.getpixel(point) for point in ((0, 0), (1253, 0), (0, 1253), (1253, 1253))]
    first_last_equal = ImageChops.difference(frames[0], frames[-1]).getbbox() is None
    # Bottom of the one-piece dough is the transparent taskbar contact root;
    # it is below every moving paw and contact-shadow pixel.
    root_box = (350, 1090, 1010, 1140)
    fixed_root_changes = max(
        sum(ImageChops.difference(frames[0].crop(root_box), frame.crop(root_box)).convert("L").histogram()[1:])
        for frame in frames
    )
    green_pixels = max(green_dominant_visible_pixels(frame) for frame in frames)

    outputs = {
        "neutral": asset_root / "chef-cat-transparent-neutral.png",
        "motion_128_webp": asset_root / "chef-cat-transparent-motion-128.webp",
        "motion_384_webp": qa_dir / "chef-cat-transparent-motion-384.webp",
        "motion_128_apng": qa_dir / "chef-cat-transparent-motion-128.png",
        "checker_motion_384_gif": qa_dir / "chef-cat-checker-motion-384.gif",
        "contact_sheet": qa_dir / "transparent-motion-contact-sheet.png",
        "background_qa": qa_dir / "neutral-light-dark-checker.png",
    }
    metrics = {
        "status": "transparent articulated proof; user approval required",
        "source_sha256": sha256(source),
        "alpha_subject_sha256": sha256(generated_subject_path),
        "alpha_clean_base_sha256": sha256(generated_clean_path),
        "frame_count": FRAME_COUNT,
        "duration_seconds": DURATION_SECONDS,
        "average_fps": FPS,
        "moving_layers": names,
        "cat_mesh_deformation_layers": [],
        "ear_events": [
            {"side": "viewer-left", "start_seconds": 1.15, "duration_seconds": 0.48},
            {"side": "viewer-right", "start_seconds": 4.45, "duration_seconds": 0.48},
        ],
        "tail_sway": {"period_seconds": 3.0, "amplitude_degrees": 4.2, "pivot_source_pixels": [345, 910]},
        "transparent_corner_alpha": transparent_corners,
        "neutral_alpha_bbox": list(alpha.getbbox() or ()),
        "max_visible_green_dominant_pixels": green_pixels,
        "first_last_frames_identical": first_last_equal,
        "fixed_dough_root_max_changed_pixels": fixed_root_changes,
        "fixed_dough_root_box_source_pixels": list(root_box),
        "outputs": {key: {"path": path.as_posix(), "sha256": sha256(path)} for key, path in outputs.items()},
        "limitations": [
            "The main output removes both cream background and wooden counter; the source images remain preserved.",
            "The proof is not connected to the current HTML/runtime.",
            "User final-speed approval is required before adding the opposite working arm or input states.",
        ],
    }
    (asset_root / "transparent-rig-manifest.json").write_text(
        json.dumps(metrics, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(json.dumps(metrics, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
