#!/usr/bin/env python3
"""Retiming-only v4 proof: brisk grouped kneading from approved v3 layers.

No art is regenerated and no runtime/input code is touched. The v3 rigid RGBA
parts are reused byte-for-byte, while this builder changes only the ambient
timeline: two five-beat alternating knead groups with short recovery windows.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFont

import build_cutout_rig_proof as v1
import build_transparent_cutout_rig_v2 as v2
import build_transparent_cutout_rig_v3 as v3


FPS = 20
DURATION_SECONDS = 6
FRAME_COUNT = FPS * DURATION_SECONDS
FRAME_DURATION_MS = 50
KNEAD_DURATION_SECONDS = 0.46
EXPECTED_V3_MANIFEST_SHA256 = "68692a3dcbd2389476de291306265b38da072bcba6996c675d1ba64520c85dfe"

KNEAD_EVENTS = [
    {"side": "viewer-left", "start_seconds": 0.25},
    {"side": "viewer-right", "start_seconds": 0.70},
    {"side": "viewer-left", "start_seconds": 1.15},
    {"side": "viewer-right", "start_seconds": 1.60},
    {"side": "viewer-left", "start_seconds": 2.05},
    {"side": "viewer-right", "start_seconds": 3.10},
    {"side": "viewer-left", "start_seconds": 3.55},
    {"side": "viewer-right", "start_seconds": 4.00},
    {"side": "viewer-left", "start_seconds": 4.45},
    {"side": "viewer-right", "start_seconds": 4.90},
]


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def bounded_sum(values: list[float]) -> float:
    return min(1.0, sum(values))


def side_work_values(time_s: float, side: str) -> tuple[float, float, float]:
    values = [
        v3.work_values(time_s, event["start_seconds"], KNEAD_DURATION_SECONDS)
        for event in KNEAD_EVENTS
        if event["side"] == side
    ]
    return tuple(bounded_sum([value[index] for value in values]) for index in range(3))


def blink_closed(time_s: float) -> bool:
    # Blinks live in recovery windows; they never compete with a paw contact.
    return 2.58 <= time_s <= 2.72


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
        # Duplicate the exact six-second endpoint to close every rigid layer.
        time_s = index * DURATION_SECONDS / (FRAME_COUNT - 1)
        left_ant, left_contact, left_settle = side_work_values(time_s, "viewer-left")
        right_ant, right_contact, right_settle = side_work_values(time_s, "viewer-right")

        # Frequent work uses a smaller head/weight cue than the v3 proof. This
        # preserves a living kinetic chain without turning each press into a bob.
        idle_angle = 0.08 * math.sin(2.0 * math.pi * time_s / DURATION_SECONDS)
        head_angle = (
            idle_angle
            + 0.68 * left_ant
            - 0.68 * right_ant
            - 0.08 * left_settle
            + 0.08 * right_settle
        )
        head_translate = (
            -2.4 * left_ant + 2.4 * right_ant,
            2.6 * (left_ant + right_ant),
        )

        left_upper_angle = -1.45 * left_ant - 0.70 * left_contact
        left_upper_translate = (-0.8 * left_ant, 5.2 * left_ant + 2.6 * left_contact)
        left_forearm_angle = 2.1 * left_contact
        left_forearm_translate = (-1.6 * left_contact, 10.5 * left_contact)

        right_upper_angle = 1.45 * right_ant + 0.70 * right_contact
        right_upper_translate = (0.8 * right_ant, 5.2 * right_ant + 2.6 * right_contact)
        right_forearm_angle = -2.1 * right_contact
        right_forearm_translate = (1.6 * right_contact, 10.5 * right_contact)

        tail_angle = 13.0 * math.sin(2.0 * math.pi * time_s / 3.0)
        tail = v1.rigid(layers["tail"], tail_angle, tail_pivot)

        head_core = v1.rigid(layers["head_core"], head_angle, neck_pivot, head_translate)
        open_eyes = v1.rigid(layers["open_eyes"], head_angle, neck_pivot, head_translate)

        left_ear = v1.rigid(layers["left_ear"], head_angle, neck_pivot, head_translate)
        left_pivot = v1.transform_point(left_ear_pivot, head_angle, neck_pivot, head_translate)
        left_flap = 8.0 * v1.pulse(time_s, 2.76, 0.22) - 4.2 * v1.pulse(time_s, 2.96, 0.12)
        left_ear = v1.rigid(left_ear, left_flap, left_pivot)

        right_ear = v1.rigid(layers["right_ear"], head_angle, neck_pivot, head_translate)
        right_pivot = v1.transform_point(right_ear_pivot, head_angle, neck_pivot, head_translate)
        right_flap = -8.0 * v1.pulse(time_s, 5.46, 0.28) + 4.2 * v1.pulse(time_s, 5.72, 0.17)
        right_ear = v1.rigid(right_ear, right_flap, right_pivot)

        crown = v1.rigid(layers["hat_crown"], head_angle, neck_pivot, head_translate)
        crown_pivot_moved = v1.transform_point(crown_pivot, head_angle, neck_pivot, head_translate)
        crown_kick = -0.18 * left_flap - 0.18 * right_flap
        crown = v1.rigid(crown, crown_kick, crown_pivot_moved, (0.0, abs(crown_kick) * 0.65))

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
                ImageDraw.Draw(shadow).ellipse(box, fill=(105, 61, 28, round(26 * contact)))
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


def save_webp(frames: list[Image.Image], output: Path, size: int) -> None:
    resized = [frame.resize((size, size), Image.Resampling.LANCZOS) for frame in frames]
    resized[0].save(
        output,
        save_all=True,
        append_images=resized[1:],
        duration=[FRAME_DURATION_MS] * len(resized),
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
        duration=[FRAME_DURATION_MS] * len(resized),
        loop=0,
        disposal=0,
        blend=0,
        optimize=False,
    )


def save_gif(frames: list[Image.Image], output: Path, size: int) -> None:
    rgb_frames = [v2.composite_background(frame, None, size) for frame in frames]
    palette = rgb_frames[0].quantize(colors=256, method=Image.Quantize.MEDIANCUT)
    paletted = [frame.quantize(palette=palette, dither=Image.Dither.NONE) for frame in rgb_frames]
    paletted[0].save(
        output,
        save_all=True,
        append_images=paletted[1:],
        duration=[FRAME_DURATION_MS] * len(paletted),
        loop=0,
        disposal=1,
        optimize=False,
    )


def frame_index(time_s: float) -> int:
    return round(time_s / DURATION_SECONDS * (FRAME_COUNT - 1))


def save_contact_sheet(frames: list[Image.Image], output: Path) -> None:
    samples = [
        (0.00, "neutral"), (0.48, "L contact"), (0.93, "R contact"),
        (1.38, "L contact"), (1.83, "R contact"), (2.28, "L contact"),
        (2.65, "blink/rest"), (2.86, "left ear"), (3.33, "R contact"),
        (3.78, "L contact"), (4.23, "R contact"), (4.68, "L contact"),
        (5.13, "R contact"), (5.56, "right ear"), (5.95, "settled"),
    ]
    tile, label = 192, 26
    sheet = Image.new("RGB", (tile * 5, (tile + label) * 3), "white")
    draw = ImageDraw.Draw(sheet)
    font = ImageFont.load_default()
    for slot, (time_s, caption) in enumerate(samples):
        index = frame_index(time_s)
        preview = v2.composite_background(frames[index], None, tile)
        x = slot % 5 * tile
        y = slot // 5 * (tile + label)
        sheet.paste(preview, (x, y))
        draw.text((x + 5, y + tile + 6), f"{time_s:0.2f}s {caption}", fill="#3b2b26", font=font)
    sheet.save(output, optimize=True)


def changed_pixels(first: Image.Image, other: Image.Image, box: tuple[int, int, int, int]) -> int:
    diff = ImageChops.difference(first.crop(box), other.crop(box)).convert("L")
    return sum(diff.histogram()[1:])


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--asset-root", type=Path, default=Path("assets/taskbar-cat-cutout-rig-v4"))
    parser.add_argument("--fast-preview", action="store_true")
    args = parser.parse_args()

    v3_root = Path("assets/taskbar-cat-cutout-rig-v3").resolve()
    v3_manifest = v3_root / "transparent-rig-manifest.json"
    if sha256(v3_manifest) != EXPECTED_V3_MANIFEST_SHA256:
        raise SystemExit("v3 manifest changed; refusing to retime an unknown rig")

    layer_paths = {
        "base": v3_root / "layers/base-transparent.png",
        "head_core": v3_root / "layers/head-core.png",
        "left_ear": v3_root / "layers/left-ear.png",
        "right_ear": v3_root / "layers/right-ear.png",
        "hat_crown": v3_root / "layers/hat-crown.png",
        "upper_arm": v3_root / "layers/upper-arm.png",
        "forearm_paw": v3_root / "layers/forearm-paw.png",
        "right_upper_arm": v3_root / "layers/right-upper-arm.png",
        "right_forearm_paw": v3_root / "layers/right-forearm-paw.png",
        "tail": v3_root / "layers/tail.png",
        "open_eyes": v3_root / "layers/open-eyes.png",
    }
    base = Image.open(layer_paths["base"]).convert("RGBA")
    layers = {
        name: Image.open(path).convert("RGBA")
        for name, path in layer_paths.items()
        if name != "base"
    }

    asset_root = args.asset_root.resolve()
    qa_dir = asset_root / "qa"
    qa_dir.mkdir(parents=True, exist_ok=True)
    frames = build_frames(base, layers)

    if args.fast_preview:
        save_gif(frames, Path("tmp/cutout-rig-v4-fast-motion-384.gif"), 384)
        save_contact_sheet(frames, Path("tmp/cutout-rig-v4-fast-contact.png"))
        print(Path("tmp/cutout-rig-v4-fast-motion-384.gif").resolve())
        print(Path("tmp/cutout-rig-v4-fast-contact.png").resolve())
        return

    neutral = frames[0]
    neutral.save(asset_root / "chef-cat-transparent-neutral-open-eyes.png")
    save_webp(frames, asset_root / "chef-cat-fast-knead-motion-128.webp", 128)
    save_webp(frames, qa_dir / "chef-cat-fast-knead-motion-384.webp", 384)
    save_apng(frames, qa_dir / "chef-cat-fast-knead-motion-128.png", 128)
    save_gif(frames, qa_dir / "chef-cat-fast-knead-checker-384.gif", 384)
    save_contact_sheet(frames, qa_dir / "fast-knead-contact-sheet.png")
    v2.save_background_qa(neutral, qa_dir / "neutral-light-dark-checker.png")

    root_box = (350, 1090, 1010, 1140)
    first_last_equal = ImageChops.difference(frames[0], frames[-1]).getbbox() is None
    fixed_root_changes = max(changed_pixels(frames[0], frame, root_box) for frame in frames)
    green_pixels = max(v2.green_dominant_visible_pixels(frame) for frame in frames)
    corner_alpha = [
        neutral.getchannel("A").getpixel(point)
        for point in ((0, 0), (1253, 0), (0, 1253), (1253, 1253))
    ]

    outputs = {
        "neutral": asset_root / "chef-cat-transparent-neutral-open-eyes.png",
        "motion_128_webp": asset_root / "chef-cat-fast-knead-motion-128.webp",
        "motion_384_webp": qa_dir / "chef-cat-fast-knead-motion-384.webp",
        "motion_128_apng": qa_dir / "chef-cat-fast-knead-motion-128.png",
        "checker_motion_384_gif": qa_dir / "chef-cat-fast-knead-checker-384.gif",
        "contact_sheet": qa_dir / "fast-knead-contact-sheet.png",
        "background_qa": qa_dir / "neutral-light-dark-checker.png",
    }
    layer_sources = {
        name: {"path": path.as_posix(), "sha256": sha256(path)}
        for name, path in layer_paths.items()
    }
    metrics = {
        "status": "brisk grouped ambient knead proof; user approval required",
        "source_v3_manifest_sha256": sha256(v3_manifest),
        "frame_count": FRAME_COUNT,
        "duration_seconds": DURATION_SECONDS,
        "fps": FPS,
        "frame_duration_ms": FRAME_DURATION_MS,
        "knead_duration_seconds": KNEAD_DURATION_SECONDS,
        "knead_events": KNEAD_EVENTS,
        "knead_groups": [
            {"start_seconds": 0.25, "beat_count": 5, "beat_interval_seconds": 0.45},
            {"start_seconds": 3.10, "beat_count": 5, "beat_interval_seconds": 0.45},
        ],
        "blink_windows_seconds": [[2.58, 2.72]],
        "ear_recovery_events": [
            {"side": "viewer-left", "start_seconds": 2.76},
            {"side": "viewer-right", "start_seconds": 5.46},
        ],
        "tail_sway": {"period_seconds": 3.0, "amplitude_degrees": 13.0},
        "cat_mesh_deformation_layers": [],
        "keyboard_or_runtime_integration": False,
        "transparent_corner_alpha": corner_alpha,
        "max_visible_green_dominant_pixels": green_pixels,
        "first_last_frames_identical": first_last_equal,
        "fixed_dough_root_max_changed_pixels": fixed_root_changes,
        "fixed_dough_root_box_source_pixels": list(root_box),
        "layer_sources": layer_sources,
        "outputs": {key: {"path": path.as_posix(), "sha256": sha256(path)} for key, path in outputs.items()},
        "limitations": [
            "Typing-speed and keyboard-triggered motion are intentionally deferred.",
            "HTML/runtime files are unchanged.",
            "User final-speed approval is required before this cadence becomes the ambient production state.",
        ],
    }
    (asset_root / "fast-knead-manifest.json").write_text(
        json.dumps(metrics, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(json.dumps(metrics, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
