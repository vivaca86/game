#!/usr/bin/env python3
"""Build deterministic PNG atlases for the taskbar cat v6 runtime.

The browser no longer depends on animated WebP compositing. Existing idle and
rest animations are decoded to complete 128px PNG atlas frames, while work,
fast, and overdrive are rebuilt from the approved v3 rigid layers. Only the
soft dough contact area is remapped; the registered lower dough root is copied
back byte-for-byte after every deformation.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageChops, ImageDraw

import build_cutout_rig_proof as v1
import build_transparent_cutout_rig_v2 as v2
import build_typing_motion_v1 as typing


PROJECT_ROOT = Path(__file__).resolve().parents[1]
ASSET_ROOT = PROJECT_ROOT / "assets" / "taskbar-cat-runtime-v6"
QA_ROOT = ASSET_ROOT / "qa"
SOURCE_LAYER_ROOT = PROJECT_ROOT / "assets" / "taskbar-cat-cutout-rig-v3" / "layers"
ROOT_BOX = (350, 1090, 1010, 1140)
SOURCE_SIZE = 1254
FRAME_SIZE = 128
GRID_X, GRID_Y = np.meshgrid(
    np.arange(SOURCE_SIZE, dtype=np.float32),
    np.arange(SOURCE_SIZE, dtype=np.float32),
)

MODE_CONFIG = {
    "ambient-v6": {
        "frame_count": 30,
        "frame_duration_ms": 40,
        "contacts": 3,
        "arm_scale": 1.55,
        "head_scale": 1.18,
        "fx": False,
        "overdrive": False,
    },
    "typing-fast": {
        "frame_count": 25,
        "frame_duration_ms": 40,
        "contacts": 4,
        "arm_scale": 1.72,
        "head_scale": 1.35,
        "fx": True,
        "overdrive": False,
    },
    "typing-overdrive": {
        "frame_count": 49,
        "frame_duration_ms": 20,
        "contacts": 8,
        "arm_scale": 1.72,
        "head_scale": 1.45,
        "fx": True,
        "overdrive": True,
    },
}

LEGACY_CLIPS = {
    "idle-alert": ("assets/taskbar-cat-idle-v1/chef-cat-idle-alert-128.webp", 80, True),
    "idle-attention": ("assets/taskbar-cat-idle-v1/chef-cat-idle-attention-128.webp", 50, False),
    "idle-sniff": ("assets/taskbar-cat-idle-v1/chef-cat-idle-sniff-128.webp", 50, False),
    "idle-sleepy": ("assets/taskbar-cat-idle-v1/chef-cat-idle-sleepy-128.webp", 80, True),
    "doze-loop": ("assets/taskbar-cat-rest-v1/chef-cat-doze-128.webp", 50, True),
    "wake-startle": ("assets/taskbar-cat-rest-v1/chef-cat-wake-startle-128.webp", 50, False),
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def smoothstep(value: float) -> float:
    value = max(0.0, min(1.0, value))
    return value * value * (3.0 - 2.0 * value)


def motion_values(phase: float, high_speed: bool) -> tuple[float, float, float]:
    """Return anticipation, contact, settle with a readable contact plateau."""

    if high_speed:
        anticipation_end, rise_end, hold_end = 0.18, 0.24, 0.82
    else:
        anticipation_end, rise_end, hold_end = 0.24, 0.34, 0.68

    if phase < anticipation_end:
        anticipation = smoothstep(phase / anticipation_end)
    elif phase < rise_end:
        anticipation = 1.0 - smoothstep((phase - anticipation_end) / (rise_end - anticipation_end))
    else:
        anticipation = 0.0

    if phase < anticipation_end:
        contact = 0.0
    elif phase < rise_end:
        contact = smoothstep((phase - anticipation_end) / (rise_end - anticipation_end))
    elif phase < hold_end:
        contact = 1.0
    else:
        contact = 1.0 - smoothstep((phase - hold_end) / (1.0 - hold_end))

    settle = 0.0 if phase < hold_end else smoothstep((phase - hold_end) / (1.0 - hold_end))
    return anticipation, contact, settle


def active_side_values(time01: float, contacts: int, high_speed: bool) -> tuple[tuple[float, float, float], tuple[float, float, float]]:
    if time01 >= 1.0:
        return (0.0, 0.0, 0.0), (0.0, 0.0, 0.0)
    event_position = time01 * contacts
    event_index = min(contacts - 1, int(event_position))
    phase = event_position - event_index
    values = motion_values(phase, high_speed)
    return (values, (0.0, 0.0, 0.0)) if event_index % 2 == 0 else ((0.0, 0.0, 0.0), values)


def head_pose(
    left_values: tuple[float, float, float],
    right_values: tuple[float, float, float],
    scale: float,
) -> tuple[float, tuple[float, float]]:
    """Return the rigid head pose for one sampled work beat.

    The head now rises slightly during anticipation and travels down only after
    the shoulder/arm chain commits.  The larger visible arc is intentional at
    112px and remains a child-layer movement; the registered taskbar root does
    not move.
    """

    left_ant, left_contact, left_settle = left_values
    right_ant, right_contact, right_settle = right_values
    angle = scale * (
        1.85 * left_ant - 1.85 * right_ant
        + 1.15 * left_contact - 1.15 * right_contact
        - 0.42 * left_settle + 0.42 * right_settle
    )
    translate = (
        scale * (-11.0 * left_ant - 6.0 * left_contact + 11.0 * right_ant + 6.0 * right_contact),
        scale * (-6.0 * (left_ant + right_ant) + 28.0 * (left_contact + right_contact)
                 - 4.0 * (left_settle + right_settle)),
    )
    return angle, translate


def deform_dough(base: Image.Image, left_strength: float, right_strength: float) -> Image.Image:
    """Compress and widen only the soft dough area above the fixed root."""

    if left_strength <= 0.001 and right_strength <= 0.001:
        return base.copy()
    source = np.array(base.convert("RGBA"), dtype=np.uint8)
    grid_x, grid_y = GRID_X, GRID_Y
    map_x = GRID_X.copy()
    map_y = GRID_Y.copy()

    for strength, center_x, top_y, radius_x in (
        (left_strength, 548.0, 942.0, 178.0),
        (right_strength, 876.0, 905.0, 164.0),
    ):
        if strength <= 0.001:
            continue
        x_weight = np.exp(-((grid_x - center_x) / radius_x) ** 4)
        y_weight = np.clip((1090.0 - grid_y) / (1090.0 - top_y), 0.0, 1.0)
        region = ((grid_y >= top_y) & (grid_y < 1090.0)).astype(np.float32)
        weight = x_weight * y_weight * region * strength

        # Sampling upward moves the visible dough surface down. Sampling closer
        # to the contact centre makes the same pixels occupy a wider footprint.
        map_y -= 27.0 * weight
        expansion = 0.065 * weight
        map_x = center_x + (map_x - center_x) / (1.0 + expansion)

    deformed = cv2.remap(
        source,
        map_x,
        map_y,
        interpolation=cv2.INTER_LANCZOS4,
        borderMode=cv2.BORDER_CONSTANT,
        borderValue=(0, 0, 0, 0),
    )
    x1, y1, x2, y2 = ROOT_BOX
    deformed[y1:y2, x1:x2] = source[y1:y2, x1:x2]
    return Image.fromarray(deformed, "RGBA")


def normal_contact_fx(size: tuple[int, int], side: str, strength: float) -> Image.Image:
    """Small flour pinch for ordinary input, kept below the fast-tier burst."""

    layer = Image.new("RGBA", size, (0, 0, 0, 0))
    if strength <= 0.45:
        return layer
    power = smoothstep((strength - 0.45) / 0.55)
    draw = ImageDraw.Draw(layer)
    cx, cy = (548, 991) if side == "viewer-left" else (876, 944)
    direction = -1 if side == "viewer-left" else 1
    cloud_x = cx + direction * 58
    cloud_y = cy - 38
    outline = (112, 72, 43, round(155 * power))
    flour = (255, 250, 231, round(224 * power))
    draw.ellipse((cloud_x - 40, cloud_y - 22, cloud_x + 40, cloud_y + 20), fill=outline)
    draw.ellipse((cloud_x - 31, cloud_y - 15, cloud_x + 31, cloud_y + 13), fill=flour)
    for offset_x, offset_y, radius in ((direction * 43, -30, 8), (direction * 67, -14, 6)):
        px, py = cloud_x + offset_x, cloud_y + offset_y
        draw.ellipse((px - radius - 3, py - radius - 3, px + radius + 3, py + radius + 3), fill=outline)
        draw.ellipse((px - radius, py - radius, px + radius, py + radius), fill=flour)
    return layer


def load_layers() -> tuple[Image.Image, dict[str, Image.Image]]:
    base = Image.open(SOURCE_LAYER_ROOT / "base-transparent.png").convert("RGBA")
    names = [
        "head-core", "left-ear", "right-ear", "hat-crown", "upper-arm",
        "forearm-paw", "right-upper-arm", "right-forearm-paw", "tail", "open-eyes",
    ]
    layers = {name.replace("-", "_"): Image.open(SOURCE_LAYER_ROOT / f"{name}.png").convert("RGBA") for name in names}
    layers["panic_face"] = Image.open(PROJECT_ROOT / "assets/taskbar-cat-typing-v1/layers/panic-face-overlay.png").convert("RGBA")
    layers["panic_sweat"] = Image.open(PROJECT_ROOT / "assets/taskbar-cat-typing-v1/layers/panic-sweat-overlay.png").convert("RGBA")
    return base, layers


def build_mode_frames(mode: str, base: Image.Image, layers: dict[str, Image.Image]) -> list[Image.Image]:
    config = MODE_CONFIG[mode]
    count = config["frame_count"]
    overdrive = config["overdrive"]
    high_speed = mode != "ambient-v6"
    frames: list[Image.Image] = []

    neck_pivot = (650.0, 735.0)
    left_shoulder, left_elbow = (418.0, 770.0), (485.0, 875.0)
    right_shoulder, right_elbow = (805.0, 748.0), (850.0, 850.0)
    left_ear_pivot, right_ear_pivot = (402.0, 458.0), (778.0, 365.0)
    crown_pivot, tail_pivot = (602.0, 269.0), (345.0, 910.0)

    for index in range(count):
        time01 = index / (count - 1)
        left_values, right_values = active_side_values(time01, config["contacts"], high_speed)
        left_ant, left_contact, left_settle = left_values
        right_ant, right_contact, right_settle = right_values
        head_scale = config["head_scale"]
        arm_scale = config["arm_scale"]

        head_angle, head_translate = head_pose(left_values, right_values, head_scale)

        # At eight contacts per second, repeating the full head bob on every
        # paw strike looks like jitter instead of speed.  Hold one braced body
        # arc across the clip and let only a very small left/right bias echo the
        # alternating paws.
        clip_energy = math.sin(math.pi * time01) ** 2
        if overdrive:
            side_bias = (
                left_contact + 0.45 * left_ant
                - right_contact - 0.45 * right_ant
            )
            head_angle = 0.65 * side_bias * clip_energy
            head_translate = (
                -3.5 * side_bias * clip_energy,
                14.0 * clip_energy + 1.5 * (left_contact + right_contact),
            )

        left_upper_angle = arm_scale * (-3.05 * left_ant - 1.55 * left_contact + 0.35 * right_contact)
        # Readability comes from a lift-to-press arc. Absolute penetration at
        # contact stays at the v5-safe limit instead of entering the dough root.
        left_upper_translate = (-2.0 * arm_scale * left_ant, -12.0 * left_ant + 5.0 * left_contact - 3.0 * right_contact)
        left_forearm_angle = arm_scale * (1.15 * left_ant + 4.15 * left_contact - 0.45 * right_contact)
        left_forearm_translate = (-3.5 * left_contact, -17.0 * left_ant + 16.0 * left_contact - 4.0 * right_contact)

        right_upper_angle = arm_scale * (3.05 * right_ant + 1.55 * right_contact - 0.35 * left_contact)
        right_upper_translate = (2.0 * arm_scale * right_ant, -12.0 * right_ant + 5.0 * right_contact - 3.0 * left_contact)
        right_forearm_angle = arm_scale * (-1.15 * right_ant - 4.15 * right_contact + 0.45 * left_contact)
        right_forearm_translate = (3.5 * right_contact, -17.0 * right_ant + 16.0 * right_contact - 4.0 * left_contact)

        # A full-strength tail swing on every one-second reaction competed with
        # the paws.  Keep one calm counter-sway and let the work chain lead.
        tail_amplitude = 11.0 if mode == "ambient-v6" else (7.0 if not overdrive else 6.0)
        tail_cycles = 1.0
        tail = v1.rigid(layers["tail"], tail_amplitude * math.sin(2.0 * math.pi * tail_cycles * time01), tail_pivot)

        head = v1.rigid(layers["head_core"], head_angle, neck_pivot, head_translate)
        eyes = v1.rigid(layers["open_eyes"], head_angle, neck_pivot, head_translate)
        panic = v1.rigid(layers["panic_face"], head_angle, neck_pivot, head_translate)
        sweat = v1.rigid(layers["panic_sweat"], head_angle, neck_pivot, head_translate)

        left_ear = v1.rigid(layers["left_ear"], head_angle, neck_pivot, head_translate)
        left_pivot = v1.transform_point(left_ear_pivot, head_angle, neck_pivot, head_translate)
        ear_envelope = math.sin(math.pi * time01) ** 2
        left_flap = (3.8 if not overdrive else -5.2) * ear_envelope
        left_ear = v1.rigid(left_ear, left_flap, left_pivot)

        right_ear = v1.rigid(layers["right_ear"], head_angle, neck_pivot, head_translate)
        right_pivot = v1.transform_point(right_ear_pivot, head_angle, neck_pivot, head_translate)
        right_flap = -(2.8 if not overdrive else 5.2) * ear_envelope
        right_ear = v1.rigid(right_ear, right_flap, right_pivot)

        # The crown must remain registered to the hat band in head_core.  A
        # one-frame transform lag made the two pieces visibly slide apart.
        # Keep the shared head transform exact and restrict secondary motion to
        # a sub-degree local crown settle around its own pivot.
        crown = v1.rigid(layers["hat_crown"], head_angle, neck_pivot, head_translate)
        crown_pivot_moved = v1.transform_point(crown_pivot, head_angle, neck_pivot, head_translate)
        crown_kick = -0.04 * left_flap - 0.04 * right_flap
        crown = v1.rigid(crown, crown_kick, crown_pivot_moved, (0.0, abs(crown_kick) * 0.18))

        left_upper = v1.rigid(layers["upper_arm"], left_upper_angle, left_shoulder, left_upper_translate)
        left_forearm = v1.rigid(layers["forearm_paw"], left_upper_angle, left_shoulder, left_upper_translate)
        left_elbow_moved = v1.transform_point(left_elbow, left_upper_angle, left_shoulder, left_upper_translate)
        left_forearm = v1.rigid(left_forearm, left_forearm_angle, left_elbow_moved, left_forearm_translate)

        right_upper = v1.rigid(layers["right_upper_arm"], right_upper_angle, right_shoulder, right_upper_translate)
        right_forearm = v1.rigid(layers["right_forearm_paw"], right_upper_angle, right_shoulder, right_upper_translate)
        right_elbow_moved = v1.transform_point(right_elbow, right_upper_angle, right_shoulder, right_upper_translate)
        right_forearm = v1.rigid(right_forearm, right_forearm_angle, right_elbow_moved, right_forearm_translate)

        deformed_base = deform_dough(base, left_contact, right_contact)
        scene = Image.new("RGBA", base.size, (0, 0, 0, 0))
        scene = Image.alpha_composite(scene, tail)
        scene = Image.alpha_composite(scene, deformed_base)

        # The pressure arc is part of the dough-response channel, not generic
        # decoration.  Normal work receives a restrained version; fast tiers
        # retain the full material response under their flour burst.
        response_scale = 0.72 if mode == "ambient-v6" else 1.0
        scene = Image.alpha_composite(scene, typing.dough_response_fx(base.size, "viewer-left", left_contact * response_scale, overdrive))
        scene = Image.alpha_composite(scene, typing.dough_response_fx(base.size, "viewer-right", right_contact * response_scale, overdrive))

        for contact, box in ((left_contact, (470, 982, 625, 1018)), (right_contact, (817, 928, 936, 978))):
            if contact > 0.02:
                shadow = Image.new("RGBA", base.size, (0, 0, 0, 0))
                ImageDraw.Draw(shadow).ellipse(box, fill=(105, 61, 28, round(38 * contact)))
                scene = Image.alpha_composite(scene, shadow)

        # Rapid overdrive still strikes on all eight beats, but alternating FX
        # weights stop the flour from becoming one continuous white cloud.
        event_position = min(time01 * config["contacts"], config["contacts"] - 1e-6)
        event_index = int(event_position)
        fx_weight = 0.58 if overdrive and event_index % 2 == 1 else 1.0
        left_fx_contact = left_contact * fx_weight
        right_fx_contact = right_contact * fx_weight

        if config["fx"]:
            # Streaks announce the incoming paw and recede at contact so the
            # dough deformation, paw silhouette, and flour peak do not compete.
            left_streak = min(1.0, (left_ant + 0.22 * left_contact) * fx_weight)
            right_streak = min(1.0, (right_ant + 0.22 * right_contact) * fx_weight)
            scene = Image.alpha_composite(scene, typing.speed_fx(base.size, "viewer-left", left_streak, overdrive))
            scene = Image.alpha_composite(scene, typing.speed_fx(base.size, "viewer-right", right_streak, overdrive))
            scene = Image.alpha_composite(scene, typing.impact_back_fx(base.size, "viewer-left", left_fx_contact, overdrive))
            scene = Image.alpha_composite(scene, typing.impact_back_fx(base.size, "viewer-right", right_fx_contact, overdrive))

        for layer in (left_upper, left_forearm, right_upper, right_forearm, left_ear, right_ear, crown, head):
            scene = Image.alpha_composite(scene, layer)

        if overdrive and 0 < index < count - 1:
            scene = Image.alpha_composite(scene, panic)
            scene = Image.alpha_composite(scene, sweat)
        else:
            scene = Image.alpha_composite(scene, eyes)

        if config["fx"]:
            scene = Image.alpha_composite(scene, typing.contact_fx(base.size, "viewer-left", left_fx_contact, overdrive))
            scene = Image.alpha_composite(scene, typing.contact_fx(base.size, "viewer-right", right_fx_contact, overdrive))
        else:
            scene = Image.alpha_composite(scene, normal_contact_fx(base.size, "viewer-left", left_contact))
            scene = Image.alpha_composite(scene, normal_contact_fx(base.size, "viewer-right", right_contact))

        frames.append(v2.sanitize_transparent_frame(scene))

    frames[0] = frames[-1].copy()
    return frames


def resize_frames(frames: list[Image.Image]) -> list[Image.Image]:
    return [frame.resize((FRAME_SIZE, FRAME_SIZE), Image.Resampling.LANCZOS) for frame in frames]


def save_atlas(frames: list[Image.Image], output: Path, columns: int | None = None) -> tuple[int, int]:
    columns = columns or min(10, max(1, math.ceil(math.sqrt(len(frames)))))
    rows = math.ceil(len(frames) / columns)
    atlas = Image.new("RGBA", (columns * FRAME_SIZE, rows * FRAME_SIZE), (0, 0, 0, 0))
    for index, frame in enumerate(frames):
        atlas.alpha_composite(frame.convert("RGBA"), ((index % columns) * FRAME_SIZE, (index // columns) * FRAME_SIZE))
    atlas.save(output, optimize=True)
    return columns, rows


def decode_uniform_webp(path: Path, frame_duration_ms: int) -> list[Image.Image]:
    image = Image.open(path)
    frames: list[Image.Image] = []
    for index in range(image.n_frames):
        image.seek(index)
        frame = image.convert("RGBA").copy()
        duration = int(image.info.get("duration", frame_duration_ms))
        repeats = max(1, round(duration / frame_duration_ms))
        frames.extend(frame.copy() for _ in range(repeats))
    return frames


def changed_pixels(first: Image.Image, other: Image.Image, box: tuple[int, int, int, int]) -> int:
    difference = ImageChops.difference(first.crop(box), other.crop(box)).convert("L")
    return sum(difference.histogram()[1:])


def save_contact_sheet(samples: dict[str, list[Image.Image]], output: Path) -> None:
    labels = [("ambient-v6", [0, 5, 10, 15, 20, 29]), ("typing-fast", [0, 4, 8, 13, 18, 24]), ("typing-overdrive", [0, 3, 9, 21, 39, 48])]
    cell, label_height = 256, 28
    sheet = Image.new("RGB", (6 * cell, 3 * (cell + label_height)), (42, 45, 51))
    draw = ImageDraw.Draw(sheet)
    for row, (mode, indices) in enumerate(labels):
        for column, frame_index in enumerate(indices):
            frame = samples[mode][frame_index].resize((cell, cell), Image.Resampling.LANCZOS)
            checker = v2.composite_background(frame, None, cell)
            y = row * (cell + label_height)
            sheet.paste(checker, (column * cell, y))
            draw.text((column * cell + 8, y + cell + 5), f"{mode} f{frame_index}", fill=(245, 238, 221))
    sheet.save(output, optimize=True)


def save_final_size_sheet(samples: dict[str, list[Image.Image]], output: Path) -> None:
    """Write current-atlas 112px samples on both desktop value extremes."""

    labels = [
        ("ambient-v6", [0, 5, 10, 15, 20, 29]),
        ("typing-fast", [0, 4, 8, 13, 18, 24]),
        ("typing-overdrive", [0, 3, 9, 21, 39, 48]),
    ]
    cell, art_size, label_height = 128, 112, 18
    sheet = Image.new("RGB", (6 * cell, 6 * (art_size + label_height)), (38, 42, 49))
    draw = ImageDraw.Draw(sheet)
    for mode_index, (mode, indices) in enumerate(labels):
        for background_index, background in enumerate(("#f3ecdc", "#17212b")):
            row = mode_index * 2 + background_index
            for column, frame_index in enumerate(indices):
                art = samples[mode][frame_index].resize((art_size, art_size), Image.Resampling.LANCZOS)
                composed = Image.alpha_composite(Image.new("RGBA", (art_size, art_size), background), art).convert("RGB")
                x = column * cell + (cell - art_size) // 2
                y = row * (art_size + label_height)
                sheet.paste(composed, (x, y))
                draw.text((column * cell + 4, y + art_size + 2), f"{mode} f{frame_index}", fill=(242, 235, 219))
    sheet.save(output, optimize=True)


def mode_clip_record(mode: str, atlas_path: Path) -> dict[str, object]:
    config = MODE_CONFIG[mode]
    frame_count = config["frame_count"]
    columns = min(10, max(1, math.ceil(math.sqrt(frame_count))))
    rows = math.ceil(frame_count / columns)
    return {
        "file": atlas_path.relative_to(PROJECT_ROOT).as_posix(),
        "sha256": sha256(atlas_path),
        "frame_count": frame_count,
        "frame_duration_ms": config["frame_duration_ms"],
        "duration_ms": frame_count * config["frame_duration_ms"],
        "columns": columns,
        "rows": rows,
        "loop": True,
        "contacts_per_second": round(config["contacts"] / (frame_count * config["frame_duration_ms"] / 1000), 2),
        "contact_peak_dwell_ms": round(config["frame_duration_ms"] * (0.58 if mode != "ambient-v6" else 0.34) * frame_count / config["contacts"]),
        "fixed_dough_root_max_changed_pixels": 0,
        "first_last_frames_identical": True,
        "neutral_entry_exit_identical": True,
    }


def extract_atlas_frames(path: Path, frame_count: int, columns: int) -> list[Image.Image]:
    atlas = Image.open(path).convert("RGBA")
    return [
        atlas.crop(((index % columns) * FRAME_SIZE, (index // columns) * FRAME_SIZE,
                    (index % columns + 1) * FRAME_SIZE, (index // columns + 1) * FRAME_SIZE))
        for index in range(frame_count)
    ]


def build_one_mode(mode: str, base: Image.Image, layers: dict[str, Image.Image]) -> None:
    config = MODE_CONFIG[mode]
    source_frames = build_mode_frames(mode, base, layers)
    fixed_root = max(changed_pixels(source_frames[0], frame, ROOT_BOX) for frame in source_frames)
    if fixed_root != 0:
        raise SystemExit(f"{mode}: fixed dough root changed ({fixed_root})")
    if ImageChops.difference(source_frames[0], source_frames[-1]).getbbox() is not None:
        raise SystemExit(f"{mode}: first/last seam differs")
    runtime_frames = resize_frames(source_frames)
    atlas_path = ASSET_ROOT / f"{mode}-atlas.png"
    save_atlas(runtime_frames, atlas_path)
    if mode == "ambient-v6":
        save_atlas([runtime_frames[-1]], ASSET_ROOT / "neutral-atlas.png", 1)
    print(json.dumps({"mode": mode, "atlas": atlas_path.as_posix(), "sha256": sha256(atlas_path), "fixed_root": fixed_root}, ensure_ascii=False))


def finalize_runtime() -> None:
    ASSET_ROOT.mkdir(parents=True, exist_ok=True)
    QA_ROOT.mkdir(parents=True, exist_ok=True)
    manifest: dict[str, object] = {
        "status": "deterministic canvas atlas runtime candidate; user live approval required",
        "display_size_px": 112,
        "frame_size_px": 128,
        "renderer": "canvas drawImage from complete lossless PNG atlas frames",
        "animated_webp_runtime": False,
        "input_alignment": {
            "normal_left_start_frame": 2,
            "normal_right_start_frame": 12,
            "normal_frame_duration_ms": 40,
            "contact_visible_within_ms": 40,
            "contact_peak_within_ms": 80,
            "normal_restart_policy": "fresh reaction token only",
            "fast_overdrive_restart_on_same_pose": False,
        },
        "fixed_dough_root_box_source_pixels": list(ROOT_BOX),
        "clips": {},
    }
    qa_samples: dict[str, list[Image.Image]] = {}

    for mode, config in MODE_CONFIG.items():
        atlas_path = ASSET_ROOT / f"{mode}-atlas.png"
        if not atlas_path.exists():
            raise SystemExit(f"missing mode atlas: {atlas_path}")
        record = mode_clip_record(mode, atlas_path)
        expected_size = (record["columns"] * FRAME_SIZE, record["rows"] * FRAME_SIZE)
        if Image.open(atlas_path).size != expected_size:
            raise SystemExit(f"{mode}: unexpected atlas dimensions")
        manifest["clips"][mode] = record
        qa_samples[mode] = extract_atlas_frames(atlas_path, config["frame_count"], record["columns"])

    neutral_path = ASSET_ROOT / "neutral-atlas.png"
    if not neutral_path.exists() or Image.open(neutral_path).size != (FRAME_SIZE, FRAME_SIZE):
        raise SystemExit("missing or invalid neutral atlas")
    neutral_frame = Image.open(neutral_path).convert("RGBA")
    for mode, frames in qa_samples.items():
        if (
            ImageChops.difference(frames[0], neutral_frame).getbbox() is not None
            or ImageChops.difference(frames[-1], neutral_frame).getbbox() is not None
        ):
            raise SystemExit(f"{mode}: entry/exit does not match registered neutral")
    manifest["clips"]["neutral"] = {
        "file": neutral_path.relative_to(PROJECT_ROOT).as_posix(),
        "sha256": sha256(neutral_path),
        "frame_count": 1,
        "frame_duration_ms": 1000,
        "duration_ms": 1000,
        "columns": 1,
        "rows": 1,
        "loop": False,
    }

    for pose, (relative_source, frame_duration, loop) in LEGACY_CLIPS.items():
        source_path = PROJECT_ROOT / relative_source
        frames = decode_uniform_webp(source_path, frame_duration)
        if any(frame.getchannel("A").getbbox() is None for frame in frames):
            raise SystemExit(f"{pose}: decoded a blank frame")
        atlas_path = ASSET_ROOT / f"{pose}-atlas.png"
        columns, rows = save_atlas(frames, atlas_path)
        manifest["clips"][pose] = {
            "file": atlas_path.relative_to(PROJECT_ROOT).as_posix(),
            "sha256": sha256(atlas_path),
            "frame_count": len(frames),
            "frame_duration_ms": frame_duration,
            "duration_ms": len(frames) * frame_duration,
            "columns": columns,
            "rows": rows,
            "loop": loop,
            "blank_decoded_frames": 0,
        }

    contact_sheet = QA_ROOT / "runtime-v6-contact-sheet.png"
    save_contact_sheet(qa_samples, contact_sheet)
    final_size_sheet = QA_ROOT / "runtime-v6-final-size-light-dark.png"
    save_final_size_sheet(qa_samples, final_size_sheet)
    manifest["qa"] = {
        "contact_sheet": contact_sheet.relative_to(PROJECT_ROOT).as_posix(),
        "contact_sheet_sha256": sha256(contact_sheet),
        "current_final_size_sheet": final_size_sheet.relative_to(PROJECT_ROOT).as_posix(),
        "current_final_size_sheet_sha256": sha256(final_size_sheet),
        "dough_max_vertical_compression_source_px": 27.0,
        "dough_max_vertical_compression_display_px": round(27.0 * 112.0 / SOURCE_SIZE, 2),
        "normal_paw_chain_peak_to_peak_display_px": round((29.0 + 21.0) * 112.0 / SOURCE_SIZE, 2),
        "fast_paw_chain_peak_to_peak_display_px": round((29.0 + 21.0) * 112.0 / SOURCE_SIZE, 2),
        "paw_contact_penetration_source_px": 21.0,
        "source_layers": "assets/taskbar-cat-cutout-rig-v3/layers",
        "cat_mesh_deformation_layers": [],
        "soft_mesh_deformation_layers": ["dough contact field above fixed root"],
    }
    live_sheet = QA_ROOT / "live-msedge-final-size-sheet.png"
    if live_sheet.exists():
        manifest["live_verification"] = {
            "status": "pending after current motion retune",
            "prior_sheet": live_sheet.relative_to(PROJECT_ROOT).as_posix(),
            "prior_sheet_sha256": sha256(live_sheet),
            "prior_sheet_matches_current_atlas_hashes": False,
            "user_visual_approval": False,
        }
    manifest_path = ASSET_ROOT / "runtime-v6-manifest.json"
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(manifest, ensure_ascii=False, indent=2))


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--mode", required=True, choices=[*MODE_CONFIG.keys(), "finalize"])
    args = parser.parse_args()
    ASSET_ROOT.mkdir(parents=True, exist_ok=True)
    QA_ROOT.mkdir(parents=True, exist_ok=True)
    if args.mode == "finalize":
        finalize_runtime()
        return
    base, layers = load_layers()
    build_one_mode(args.mode, base, layers)


if __name__ == "__main__":
    main()
