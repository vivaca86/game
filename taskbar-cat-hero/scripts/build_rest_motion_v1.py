#!/usr/bin/env python3
"""Build articulated doze and one-shot wake motion from the approved v3 rig.

The fixed body, dough root, costume, and stage are never mesh-warped. Only the
documented head, ears, hat crown, and tail rotate around existing pivots. This
keeps the taskbar root registered while giving long-idle behavior a readable
sleep -> startled wake -> neutral transition for the later Unity Animator port.
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


SOURCE_SIZE = 1254
FPS = 20
FRAME_DURATION_MS = 50
DOZE_FRAME_COUNT = 80
WAKE_FRAME_COUNT = 20
EXPECTED_V3_MANIFEST_SHA256 = "68692a3dcbd2389476de291306265b38da072bcba6996c675d1ba64520c85dfe"
ROOT_BOX = (350, 1020, 960, 1254)


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def smoothstep(value: float) -> float:
    value = max(0.0, min(1.0, value))
    return value * value * (3.0 - 2.0 * value)


def lerp(start: float, end: float, amount: float) -> float:
    return start + (end - start) * amount


def compose_pose(
    base: Image.Image,
    layers: dict[str, Image.Image],
    *,
    head_angle: float,
    head_translate: tuple[float, float],
    ear_flap: float,
    crown_kick: float,
    tail_angle: float,
    eyes_open: bool,
) -> Image.Image:
    neck_pivot = (650.0, 735.0)
    left_ear_pivot = (402.0, 458.0)
    right_ear_pivot = (778.0, 365.0)
    crown_pivot = (602.0, 269.0)
    tail_pivot = (345.0, 910.0)

    tail = v1.rigid(layers["tail"], tail_angle, tail_pivot)
    head_core = v1.rigid(layers["head_core"], head_angle, neck_pivot, head_translate)
    open_eyes = v1.rigid(layers["open_eyes"], head_angle, neck_pivot, head_translate)

    left_ear = v1.rigid(layers["left_ear"], head_angle, neck_pivot, head_translate)
    left_pivot = v1.transform_point(left_ear_pivot, head_angle, neck_pivot, head_translate)
    left_ear = v1.rigid(left_ear, ear_flap, left_pivot)

    right_ear = v1.rigid(layers["right_ear"], head_angle, neck_pivot, head_translate)
    right_pivot = v1.transform_point(right_ear_pivot, head_angle, neck_pivot, head_translate)
    right_ear = v1.rigid(right_ear, -ear_flap, right_pivot)

    crown = v1.rigid(layers["hat_crown"], head_angle, neck_pivot, head_translate)
    crown_pivot_moved = v1.transform_point(crown_pivot, head_angle, neck_pivot, head_translate)
    crown = v1.rigid(crown, crown_kick, crown_pivot_moved, (0.0, abs(crown_kick) * 0.7))

    scene = Image.new("RGBA", base.size, (0, 0, 0, 0))
    scene = Image.alpha_composite(scene, tail)
    scene = Image.alpha_composite(scene, base)
    for layer in (
        layers["upper_arm"],
        layers["forearm_paw"],
        layers["right_upper_arm"],
        layers["right_forearm_paw"],
        left_ear,
        right_ear,
        crown,
        head_core,
    ):
        scene = Image.alpha_composite(scene, layer)
    if eyes_open:
        scene = Image.alpha_composite(scene, open_eyes)
    return v2.sanitize_transparent_frame(scene)


def build_doze_frames(base: Image.Image, layers: dict[str, Image.Image]) -> list[Image.Image]:
    frames: list[Image.Image] = []
    for index in range(DOZE_FRAME_COUNT):
        # The duplicated endpoint closes every rigid layer without a loop pop.
        time01 = index / (DOZE_FRAME_COUNT - 1)
        nod = (0.5 - 0.5 * math.cos(4.0 * math.pi * time01)) ** 1.45
        head_angle = 4.2 * nod
        head_translate = (0.7 * math.sin(4.0 * math.pi * time01), 14.0 * nod)
        ear_flap = 3.8 * nod
        tail_angle = 5.5 * math.sin(2.0 * math.pi * time01)
        frames.append(compose_pose(
            base,
            layers,
            head_angle=head_angle,
            head_translate=head_translate,
            ear_flap=ear_flap,
            crown_kick=-0.22 * head_angle,
            tail_angle=tail_angle,
            eyes_open=False,
        ))
    return frames


def wake_values(time01: float) -> tuple[float, float, float, float]:
    # Start in a deep nod, snap above neutral, rebound once, then settle. The
    # ear value is mirrored in compose_pose so both ears react together.
    if time01 < 0.18:
        amount = smoothstep(time01 / 0.18)
        return (
            lerp(4.2, -3.5, amount),
            lerp(14.0, -8.0, amount),
            lerp(3.8, -10.0, amount),
            lerp(-5.0, 15.0, amount),
        )
    if time01 < 0.50:
        amount = smoothstep((time01 - 0.18) / 0.32)
        return (
            lerp(-3.5, 1.35, amount),
            lerp(-8.0, 2.5, amount),
            lerp(-10.0, 4.2, amount),
            lerp(15.0, -6.0, amount),
        )
    amount = smoothstep((time01 - 0.50) / 0.50)
    return (
        lerp(1.35, 0.0, amount),
        lerp(2.5, 0.0, amount),
        lerp(4.2, 0.0, amount),
        lerp(-6.0, 0.0, amount),
    )


def build_wake_frames(
    base: Image.Image,
    layers: dict[str, Image.Image],
    neutral: Image.Image,
) -> list[Image.Image]:
    frames: list[Image.Image] = []
    for index in range(WAKE_FRAME_COUNT):
        time01 = index / (WAKE_FRAME_COUNT - 1)
        head_angle, head_y, ear_flap, tail_angle = wake_values(time01)
        frame = compose_pose(
            base,
            layers,
            head_angle=head_angle,
            head_translate=(0.0, head_y),
            ear_flap=ear_flap,
            crown_kick=-0.34 * head_angle,
            tail_angle=tail_angle,
            eyes_open=time01 >= 0.08,
        )
        frames.append(frame)
    # Exact approved neutral ending prevents a one-shot return seam.
    frames[-1] = neutral.copy()
    return frames


def save_webp(frames: list[Image.Image], output: Path) -> None:
    resized = [frame.resize((128, 128), Image.Resampling.LANCZOS) for frame in frames]
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


def fixed_root_changes(frames: list[Image.Image]) -> int:
    reference = frames[0].crop(ROOT_BOX)
    return max(
        sum(1 for pixel in ImageChops.difference(reference, frame.crop(ROOT_BOX)).get_flattened_data() if pixel != (0, 0, 0, 0))
        for frame in frames
    )


def transparent_corners(frame: Image.Image) -> bool:
    alpha = frame.getchannel("A")
    width, height = frame.size
    return all(alpha.getpixel(point) == 0 for point in ((0, 0), (width - 1, 0), (0, height - 1), (width - 1, height - 1)))


def composite_background(frame: Image.Image, color: tuple[int, int, int, int]) -> Image.Image:
    background = Image.new("RGBA", frame.size, color)
    return Image.alpha_composite(background, frame)


def save_qa_sheet(doze: list[Image.Image], wake: list[Image.Image], output: Path) -> None:
    tile = 140
    columns = 5
    rows = 4
    sheet = Image.new("RGBA", (tile * columns, tile * rows), (255, 255, 255, 255))
    draw = ImageDraw.Draw(sheet)
    font = ImageFont.load_default()
    samples = [
        ("doze", doze, [0, 20, 40, 60, 79]),
        ("wake", wake, [0, 3, 6, 10, 19]),
    ]
    backgrounds = [((246, 239, 220, 255), "light"), ((36, 42, 51, 255), "dark")]
    for state_index, (name, frames, indices) in enumerate(samples):
        for background_index, (color, background_name) in enumerate(backgrounds):
            row = state_index * 2 + background_index
            for column, frame_index in enumerate(indices):
                frame = frames[frame_index].resize((112, 112), Image.Resampling.LANCZOS)
                tile_image = composite_background(frame, color)
                x = column * tile + 14
                y = row * tile + 5
                sheet.alpha_composite(tile_image, (x, y))
                text_color = "#3b2b26" if background_name == "light" else "#f8f0df"
                draw.text((column * tile + 5, row * tile + 121), f"{name} {background_name} f{frame_index:02d}", fill=text_color, font=font)
    sheet.convert("RGB").save(output, quality=96)


def read_animation(path: Path) -> list[Image.Image]:
    frames: list[Image.Image] = []
    with Image.open(path) as animation:
        for index in range(getattr(animation, "n_frames", 1)):
            animation.seek(index)
            frames.append(animation.convert("RGBA"))
    return frames


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--qa-only", action="store_true", help="Rebuild the final-size sheet from registered runtime WebPs.")
    args = parser.parse_args()
    asset_root = Path("assets/taskbar-cat-rest-v1").resolve()
    qa_dir = asset_root / "qa"
    qa_dir.mkdir(parents=True, exist_ok=True)
    if args.qa_only:
        doze_output = asset_root / "chef-cat-doze-128.webp"
        wake_output = asset_root / "chef-cat-wake-startle-128.webp"
        manifest_path = asset_root / "rest-motion-manifest.json"
        qa_output = qa_dir / "rest-motion-light-dark.png"
        save_qa_sheet(read_animation(doze_output), read_animation(wake_output), qa_output)
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
        manifest["outputs"]["light_dark_qa"]["sha256"] = sha256(qa_output)
        manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(json.dumps({"qa_only": True, "display_size_px": 112, "qa_sha256": sha256(qa_output)}, ensure_ascii=False))
        return

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

    doze = build_doze_frames(base, layers)
    wake = build_wake_frames(base, layers, neutral)
    doze_output = asset_root / "chef-cat-doze-128.webp"
    wake_output = asset_root / "chef-cat-wake-startle-128.webp"
    qa_output = qa_dir / "rest-motion-light-dark.png"
    save_webp(doze, doze_output)
    save_webp(wake, wake_output)
    save_qa_sheet(doze, wake, qa_output)

    doze_first_last_identical = ImageChops.difference(doze[0], doze[-1]).getbbox() is None
    wake_ends_exact_neutral = ImageChops.difference(wake[-1], neutral).getbbox() is None
    metrics = {
        "doze": {
            "frame_count": DOZE_FRAME_COUNT,
            "duration_ms": DOZE_FRAME_COUNT * FRAME_DURATION_MS,
            "first_last_frames_identical": doze_first_last_identical,
            "fixed_dough_root_max_changed_pixels": fixed_root_changes(doze),
            "transparent_corners": transparent_corners(doze[0]),
        },
        "wake_startle": {
            "frame_count": WAKE_FRAME_COUNT,
            "duration_ms": WAKE_FRAME_COUNT * FRAME_DURATION_MS,
            "starts_from_deep_doze": True,
            "ends_exact_approved_neutral": wake_ends_exact_neutral,
            "fixed_dough_root_max_changed_pixels": fixed_root_changes(wake),
            "transparent_corners": transparent_corners(wake[-1]),
        },
    }
    if not doze_first_last_identical or not wake_ends_exact_neutral:
        raise SystemExit("rest transition seam failed")
    if metrics["doze"]["fixed_dough_root_max_changed_pixels"] or metrics["wake_startle"]["fixed_dough_root_max_changed_pixels"]:
        raise SystemExit("fixed dough root moved")
    if not metrics["doze"]["transparent_corners"] or not metrics["wake_startle"]["transparent_corners"]:
        raise SystemExit("transparent canvas corners changed")

    outputs = {
        "doze_128_webp": doze_output,
        "wake_startle_128_webp": wake_output,
        "light_dark_qa": qa_output,
    }
    manifest = {
        "status": "articulated rest/wake candidate; user final-speed review required",
        "display_size_px": 112,
        "source_canvas_px": SOURCE_SIZE,
        "source_v3_manifest_sha256": sha256(v3_manifest),
        "neutral_source": {"path": neutral_path.as_posix(), "sha256": sha256(neutral_path)},
        "motion": metrics,
        "pivots_source_pixels": {
            "neck": [650, 735],
            "left_ear": [402, 458],
            "right_ear": [778, 365],
            "hat_crown": [602, 269],
            "tail": [345, 910],
        },
        "outputs": {name: {"path": path.as_posix(), "sha256": sha256(path)} for name, path in outputs.items()},
        "unity_handoff": {
            "doze_state": "loop after 300 seconds without anonymous activity pulses",
            "wake_state": "one-shot 1,000ms transition with priority over the first resumed input pulse",
            "return_state": "exact approved neutral, then normal kneading state",
            "root_motion": False,
        },
        "limitations": [
            "Browser file-page final-speed playback still requires user review.",
            "Windows global input and Unity Animator/C# adapters are not implemented here.",
        ],
    }
    manifest_path = asset_root / "rest-motion-manifest.json"
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(manifest, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
