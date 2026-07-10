#!/usr/bin/env python3
"""Build awake-idle states from the approved articulated v3 chef-cat rig.

Kneading is intentionally absent. The fixed body, both resting paws, and the
one-piece dough stay registered while head, ears, hat crown, tail and eye layer
create calm alert, attention, dough-sniff and sleepy behavior. Modes build
independently so the 1254px source quality never has to be reduced to fit a
single command window.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFont

import build_cutout_rig_proof as v1
import build_rest_motion_v1 as rest
import build_transparent_cutout_rig_v2 as v2


SOURCE_SIZE = 1254
DISPLAY_SIZE = 112
EXPECTED_V3_MANIFEST_SHA256 = "68692a3dcbd2389476de291306265b38da072bcba6996c675d1ba64520c85dfe"
ROOT_BOX = (350, 1020, 960, 1254)
MODES = {
    "alert": {"frame_count": 100, "frame_duration_ms": 80, "duration_ms": 8000},
    "attention": {"frame_count": 24, "frame_duration_ms": 50, "duration_ms": 1200},
    "sniff": {"frame_count": 60, "frame_duration_ms": 50, "duration_ms": 3000},
    "sleepy": {"frame_count": 100, "frame_duration_ms": 80, "duration_ms": 8000},
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def smoothstep(value: float) -> float:
    value = max(0.0, min(1.0, value))
    return value * value * (3.0 - 2.0 * value)


def pulse(time01: float, center: float, radius: float) -> float:
    distance = abs(time01 - center)
    if distance >= radius:
        return 0.0
    return 0.5 + 0.5 * math.cos(math.pi * distance / radius)


def with_sniff_marks(
    frame: Image.Image,
    head_angle: float,
    head_translate: tuple[float, float],
    sniff_one: float,
    sniff_two: float,
) -> Image.Image:
    strength = max(sniff_one, sniff_two)
    if strength <= 0.02:
        return frame
    nose = v1.transform_point((650.0, 657.0), head_angle, (650.0, 735.0), head_translate)
    fx = Image.new("RGBA", frame.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(fx)
    alpha = round(238 * min(1.0, strength))
    outline = (92, 58, 39, alpha)
    breath = (255, 244, 222, round(245 * strength))
    x, y = nose
    # Pulse the nose itself twice, then pull two short lines inward.  This keeps
    # the semantic cue on the nose instead of creating a speech-bubble puff.
    nose_y = y + 3 + round(5 * strength)
    draw.ellipse((x - 17, nose_y - 9, x + 17, nose_y + 10), fill=outline)
    draw.ellipse((x - 10, nose_y - 6, x + 10, nose_y + 5), fill=(239, 151, 132, alpha))
    for direction in (-1, 1):
        near_x = x + direction * 23
        far_x = x + direction * 68
        left = min(near_x, far_x)
        right = max(near_x, far_x)
        box = (left, y - 23, right, y + 20)
        if direction < 0:
            start, end = 205, 335
        else:
            start, end = 205, 335
        draw.arc(box, start, end, fill=outline, width=18)
        draw.arc(box, start, end, fill=breath, width=9)
    # A short scent path joins the dough and nose.  One curl peaks per sniff
    # beat, so the pose communicates smelling a specific object instead of a
    # generic bow or head tilt.
    curl_specs = ((-30, sniff_one), (28, sniff_two))
    for offset_x, curl_strength in curl_specs:
        if curl_strength <= 0.05:
            continue
        sx = x + offset_x
        sy = y + 42
        sway = 13 if offset_x < 0 else -13
        points = [
            (sx, sy),
            (sx + sway, sy + 22),
            (sx - sway, sy + 46),
            (sx + round(sway * 0.45), sy + 72),
            (sx, sy + 96),
        ]
        curl_alpha = round(alpha * curl_strength)
        curl_outline = (92, 58, 39, curl_alpha)
        curl_fill = (255, 244, 222, round(245 * curl_strength))
        draw.line(points, fill=curl_outline, width=16, joint="curve")
        draw.line(points, fill=curl_fill, width=7, joint="curve")
    return v2.sanitize_transparent_frame(Image.alpha_composite(frame, fx))


def build_alert(base: Image.Image, layers: dict[str, Image.Image], neutral: Image.Image) -> list[Image.Image]:
    config = MODES["alert"]
    frames: list[Image.Image] = []
    duration_s = config["duration_ms"] / 1000
    for index in range(config["frame_count"]):
        time01 = index / (config["frame_count"] - 1)
        time_s = time01 * duration_s
        head_angle = 0.34 * math.sin(2.0 * math.pi * time01)
        head_translate = (0.45 * math.sin(2.0 * math.pi * time01), 0.35 * (1.0 - math.cos(2.0 * math.pi * time01)))
        ear_flap = 5.2 * v1.pulse(time_s, 5.15, 0.28) - 2.8 * v1.pulse(time_s, 5.42, 0.18)
        tail_angle = 7.0 * math.sin(2.0 * math.pi * time01)
        eyes_open = not (3.42 <= time_s <= 3.66)
        frames.append(rest.compose_pose(
            base,
            layers,
            head_angle=head_angle,
            head_translate=head_translate,
            ear_flap=ear_flap,
            crown_kick=-0.16 * head_angle - 0.12 * ear_flap,
            tail_angle=tail_angle,
            eyes_open=eyes_open,
        ))
    frames[0] = neutral.copy()
    frames[-1] = neutral.copy()
    return frames


def build_attention(base: Image.Image, layers: dict[str, Image.Image], neutral: Image.Image) -> list[Image.Image]:
    config = MODES["attention"]
    frames: list[Image.Image] = []
    for index in range(config["frame_count"]):
        time01 = index / (config["frame_count"] - 1)
        notice = pulse(time01, 0.28, 0.28)
        settle = pulse(time01, 0.62, 0.28)
        head_angle = -2.2 * notice + 0.7 * settle
        head_translate = (2.0 * notice - 0.6 * settle, -2.4 * notice + 0.7 * settle)
        ear_flap = -7.8 * notice + 3.4 * settle
        tail_angle = 7.0 * notice - 3.0 * settle
        frames.append(rest.compose_pose(
            base,
            layers,
            head_angle=head_angle,
            head_translate=head_translate,
            ear_flap=ear_flap,
            crown_kick=-0.28 * head_angle - 0.12 * ear_flap,
            tail_angle=tail_angle,
            eyes_open=True,
        ))
    frames[0] = neutral.copy()
    frames[-1] = neutral.copy()
    return frames


def build_sniff(base: Image.Image, layers: dict[str, Image.Image], neutral: Image.Image) -> list[Image.Image]:
    config = MODES["sniff"]
    frames: list[Image.Image] = []
    for index in range(config["frame_count"]):
        time01 = index / (config["frame_count"] - 1)
        if time01 < 0.24:
            lean = smoothstep(time01 / 0.24)
        elif time01 < 0.72:
            lean = 1.0
        else:
            lean = 1.0 - smoothstep((time01 - 0.72) / 0.28)
        sniff_one = pulse(time01, 0.39, 0.09)
        sniff_two = pulse(time01, 0.57, 0.09)
        sniff = max(sniff_one, sniff_two)
        # Lower almost straight toward the dough. The former 4-degree rotation
        # read as a head tilt, so rotation is now secondary to vertical travel.
        head_angle = 0.8 * lean + 0.18 * sniff
        head_translate = (0.0, 31.0 * lean + 11.0 * sniff)
        ear_flap = 1.2 * lean + 2.4 * sniff
        tail_angle = 3.8 * math.sin(math.pi * time01)
        frame = rest.compose_pose(
            base,
            layers,
            head_angle=head_angle,
            head_translate=head_translate,
            ear_flap=ear_flap,
            crown_kick=-0.22 * head_angle,
            tail_angle=tail_angle,
            eyes_open=not (0.365 <= time01 <= 0.425 or 0.545 <= time01 <= 0.605),
        )
        frames.append(with_sniff_marks(frame, head_angle, head_translate, sniff_one, sniff_two))
    frames[0] = neutral.copy()
    frames[-1] = neutral.copy()
    return frames


def build_sleepy(base: Image.Image, layers: dict[str, Image.Image], neutral: Image.Image) -> list[Image.Image]:
    config = MODES["sleepy"]
    frames: list[Image.Image] = []
    duration_s = config["duration_ms"] / 1000
    for index in range(config["frame_count"]):
        time01 = index / (config["frame_count"] - 1)
        time_s = time01 * duration_s
        dip = (0.5 - 0.5 * math.cos(2.0 * math.pi * time01)) ** 2.0
        head_angle = 2.7 * dip
        head_translate = (0.0, 8.5 * dip)
        ear_flap = 3.1 * dip
        tail_angle = 3.0 * math.sin(2.0 * math.pi * time01)
        eyes_open = not (2.75 <= time_s <= 4.75)
        frames.append(rest.compose_pose(
            base,
            layers,
            head_angle=head_angle,
            head_translate=head_translate,
            ear_flap=ear_flap,
            crown_kick=-0.20 * head_angle,
            tail_angle=tail_angle,
            eyes_open=eyes_open,
        ))
    frames[0] = neutral.copy()
    frames[-1] = neutral.copy()
    return frames


BUILDERS = {
    "alert": build_alert,
    "attention": build_attention,
    "sniff": build_sniff,
    "sleepy": build_sleepy,
}


def save_webp(frames: list[Image.Image], output: Path, frame_duration_ms: int) -> None:
    resized = [frame.resize((128, 128), Image.Resampling.LANCZOS) for frame in frames]
    resized[0].save(
        output,
        save_all=True,
        append_images=resized[1:],
        duration=[frame_duration_ms] * len(resized),
        loop=0,
        lossless=True,
        quality=100,
        method=0,
    )


def metrics(frames: list[Image.Image]) -> dict[str, object]:
    return {
        "first_last_frames_identical": ImageChops.difference(frames[0], frames[-1]).getbbox() is None,
        "fixed_dough_root_max_changed_pixels": rest.fixed_root_changes(frames),
        "max_visible_green_dominant_pixels": max(v2.green_dominant_visible_pixels(frame) for frame in frames),
        "transparent_corners": rest.transparent_corners(frames[0]) and rest.transparent_corners(frames[-1]),
    }


def written_animation_info(path: Path) -> dict[str, int]:
    data = path.read_bytes()
    if data[:4] != b"RIFF" or data[8:12] != b"WEBP":
        raise SystemExit(f"{path.name}: invalid WebP container")
    offset = 12
    durations: list[int] = []
    while offset + 8 <= len(data):
        kind = data[offset:offset + 4]
        size = int.from_bytes(data[offset + 4:offset + 8], "little")
        payload = offset + 8
        if payload + size > len(data):
            raise SystemExit(f"{path.name}: truncated WebP chunk")
        if kind == b"ANMF" and size >= 16:
            durations.append(int.from_bytes(data[payload + 12:payload + 15], "little"))
        offset = payload + size + (size & 1)
    return {"decoded_frame_count": len(durations), "decoded_duration_ms": sum(durations)}


def save_qa_sheet(runtime_paths: dict[str, Path], output: Path) -> None:
    tile = 134
    label = 18
    sample_positions = {
        "alert": [0.0, 0.43, 0.66, 1.0],
        "attention": [0.0, 0.24, 0.52, 1.0],
        "sniff": [0.0, 0.34, 0.58, 1.0],
        "sleepy": [0.0, 0.36, 0.53, 1.0],
    }
    backgrounds = [((248, 242, 225, 255), "light", "#3b2b26"), ((31, 38, 48, 255), "dark", "#f5ead7")]
    sheet = Image.new("RGB", (tile * 8, (DISPLAY_SIZE + label) * 4), "white")
    draw = ImageDraw.Draw(sheet)
    font = ImageFont.load_default()
    for row, mode in enumerate(("alert", "attention", "sniff", "sleepy")):
        frames = rest.read_animation(runtime_paths[mode])
        indices = [round(position * (len(frames) - 1)) for position in sample_positions[mode]]
        for background_index, (color, background_name, text_color) in enumerate(backgrounds):
            for sample_index, frame_index in enumerate(indices):
                frame = frames[frame_index].resize((DISPLAY_SIZE, DISPLAY_SIZE), Image.Resampling.LANCZOS)
                preview = Image.alpha_composite(Image.new("RGBA", frame.size, color), frame).convert("RGB")
                column = background_index * 4 + sample_index
                x = column * tile + 11
                y = row * (DISPLAY_SIZE + label)
                sheet.paste(preview, (x, y))
                draw.text((column * tile + 3, y + DISPLAY_SIZE + 3), f"{mode} {background_name} f{frame_index:02d}", fill=text_color, font=font)
    sheet.save(output, quality=96)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--mode", choices=(*MODES, "all", "finalize"), default="all")
    args = parser.parse_args()

    asset_root = Path("assets/taskbar-cat-idle-v1").resolve()
    qa_dir = asset_root / "qa"
    qa_dir.mkdir(parents=True, exist_ok=True)
    v3_root = Path("assets/taskbar-cat-cutout-rig-v3").resolve()
    v3_manifest = v3_root / "transparent-rig-manifest.json"
    if sha256(v3_manifest) != EXPECTED_V3_MANIFEST_SHA256:
        raise SystemExit("v3 manifest changed; refusing to animate an unknown rig")

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
    layers = {name: Image.open(path).convert("RGBA") for name, path in layer_paths.items() if name != "base"}
    neutral_path = v3_root / "chef-cat-transparent-neutral-open-eyes.png"
    neutral = Image.open(neutral_path).convert("RGBA")
    if base.size != (SOURCE_SIZE, SOURCE_SIZE) or neutral.size != base.size:
        raise SystemExit("unexpected source canvas")

    selected = list(MODES) if args.mode == "all" else ([] if args.mode == "finalize" else [args.mode])
    for mode in selected:
        frames = BUILDERS[mode](base, layers, neutral)
        config = MODES[mode]
        output = asset_root / f"chef-cat-idle-{mode}-128.webp"
        save_webp(frames, output, config["frame_duration_ms"])
        mode_metrics = {
            **config,
            **metrics(frames),
            **written_animation_info(output),
            "runtime_sha256": sha256(output),
        }
        if not mode_metrics["first_last_frames_identical"]:
            raise SystemExit(f"{mode}: neutral seam differs")
        if mode_metrics["fixed_dough_root_max_changed_pixels"] != 0:
            raise SystemExit(f"{mode}: fixed dough root moved")
        if mode_metrics["max_visible_green_dominant_pixels"] != 0:
            raise SystemExit(f"{mode}: visible chroma contamination")
        if not mode_metrics["transparent_corners"]:
            raise SystemExit(f"{mode}: transparent corner changed")
        (qa_dir / f"idle-{mode}-metrics.json").write_text(
            json.dumps(mode_metrics, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        print(json.dumps({"built_mode": mode, "metrics": mode_metrics}, ensure_ascii=False, indent=2))

    runtime_paths = {mode: asset_root / f"chef-cat-idle-{mode}-128.webp" for mode in MODES}
    metric_paths = {mode: qa_dir / f"idle-{mode}-metrics.json" for mode in MODES}
    if not all(path.exists() for path in [*runtime_paths.values(), *metric_paths.values()]):
        print("incremental_build_pending=run the remaining --mode before manifest finalization")
        return

    mode_metrics = {mode: json.loads(metric_paths[mode].read_text(encoding="utf-8")) for mode in MODES}
    for mode in MODES:
        if mode_metrics[mode]["runtime_sha256"] != sha256(runtime_paths[mode]):
            raise SystemExit(f"{mode}: runtime differs from its metrics sidecar")
        mode_metrics[mode].update(written_animation_info(runtime_paths[mode]))
        if mode_metrics[mode]["decoded_duration_ms"] != MODES[mode]["duration_ms"]:
            raise SystemExit(f"{mode}: written duration differs from the designed duration")
        metric_paths[mode].write_text(
            json.dumps(mode_metrics[mode], ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )

    qa_output = qa_dir / "awake-idle-light-dark-112.png"
    save_qa_sheet(runtime_paths, qa_output)
    outputs = {
        **{f"{mode}_128_webp": path for mode, path in runtime_paths.items()},
        "light_dark_112_qa": qa_output,
    }
    manifest = {
        "status": "awake idle candidate; user final-speed review required",
        "source_v3_manifest_sha256": sha256(v3_manifest),
        "source_canvas_px": SOURCE_SIZE,
        "runtime_canvas_px": 128,
        "display_size_px": DISPLAY_SIZE,
        "neutral_source": {"path": neutral_path.as_posix(), "sha256": sha256(neutral_path)},
        "timeline_ms": {
            "work_hold_after_keyboard": 1200,
            "alert_idle_until": 45000,
            "curious_idle_until": 180000,
            "sleepy_idle_until": 300000,
            "doze_after": 300000,
        },
        "rare_sniff": {
            "only_in_state": "curious-idle",
            "interval_sequence_ms": [18000, 26000, 22000],
            "duration_ms": 3000,
            "queues_or_overlaps": False,
            "semantic_cues": [
                "near-vertical head approach",
                "two nose-local squash pulses",
                "one short dough-to-nose scent curl per pulse",
            ],
            "speech_bubble_fx": False,
        },
        "modes": mode_metrics,
        "outputs": {name: {"path": path.as_posix(), "sha256": sha256(path)} for name, path in outputs.items()},
        "fixed_dough_root_box_source_pixels": list(ROOT_BOX),
        "unity_handoff": {
            "root_motion": False,
            "keyboard_starts_kneading": True,
            "pointer_starts_kneading": False,
            "pointer_reaction": "idle-attention one-shot",
            "ambient_event_policy": "replace-current; never queue; disabled outside curious-idle",
        },
        "limitations": [
            "Browser file-page final-speed playback still requires user review.",
            "Windows global input and Unity Animator/C# adapters are not implemented here.",
        ],
    }
    manifest_path = asset_root / "awake-idle-manifest.json"
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(manifest, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
