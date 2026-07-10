#!/usr/bin/env python3
"""Build a deterministic living-motion proof from the approved neutral master.

This is deliberately a review artifact, not the final Unity/runtime rig.  It keeps
the counter/root registered and uses a smooth mesh deformation only in declared
head, ear, hat, shoulder, paw, and dough regions.  The proof exists to approve
the motion direction before spending time on transparent layer separation.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont


FPS = 12
DURATION_SECONDS = 10
FRAME_COUNT = FPS * DURATION_SECONDS
PRESS_START_SECONDS = 4.0
PRESS_DURATION_SECONDS = 0.9
SOURCE_EXPECTED_SHA256 = "ec112924e2f6c9daa8988e68319ad05ee0c8d615459738a0b89be246c4f03704"


def clamp(value: float, low: float = 0.0, high: float = 1.0) -> float:
    return max(low, min(high, value))


def smoothstep(value: float) -> float:
    value = clamp(value)
    return value * value * (3.0 - 2.0 * value)


def pulse(time_s: float, start: float, duration: float) -> float:
    """Finite single beat with a readable rise, short hold, and soft settle."""

    u = (time_s - start) / duration
    if not 0.0 <= u <= 1.0:
        return 0.0
    if u < 0.30:
        return smoothstep(u / 0.30)
    if u < 0.46:
        return 1.0
    return 1.0 - smoothstep((u - 0.46) / 0.54)


def work_motion(time_s: float) -> tuple[float, float, float]:
    """Return anticipation/weight, contact, and small settle values."""

    u = (time_s - PRESS_START_SECONDS) / PRESS_DURATION_SECONDS
    if not 0.0 <= u <= 1.0:
        return 0.0, 0.0, 0.0
    if u < 0.18:
        return smoothstep(u / 0.18), 0.0, 0.0
    if u < 0.42:
        return 1.0, smoothstep((u - 0.18) / 0.24), 0.0
    if u < 0.54:
        return 1.0, 1.0, 0.0
    if u < 0.84:
        release = 1.0 - smoothstep((u - 0.54) / 0.30)
        return release, release, 0.0
    settle_u = (u - 0.84) / 0.16
    return 0.0, 0.0, -0.12 * math.sin(math.pi * settle_u)


def gaussian(
    x: float,
    y: float,
    center_x: float,
    center_y: float,
    sigma_x: float,
    sigma_y: float,
) -> float:
    dx = (x - center_x) / sigma_x
    dy = (y - center_y) / sigma_y
    return math.exp(-0.5 * (dx * dx + dy * dy))


def idle_ear_flick(time_s: float) -> float:
    # One rare, asymmetric idle flick.  It never becomes a constant ornament loop.
    return pulse(time_s, 2.05, 0.52)


def displacement_at(x: float, y: float, time_s: float) -> tuple[float, float]:
    """Return forward displacement in source pixels at normalized x/y."""

    anticipation, contact, settle = work_motion(time_s)
    delayed_anticipation, _, _ = work_motion(max(0.0, time_s - 0.075))

    # Five-second breathing cadence closes exactly at the ten-second loop seam.
    breath = 0.5 - 0.5 * math.cos(2.0 * math.pi * time_s / 5.0)
    breath -= 0.5  # centered around zero: approximately +/- 0.25 displayed pixels.

    dx = 0.0
    dy = 0.0

    # Upper-body breathing.  A vertical gate guarantees the wooden counter/root
    # does not inherit the motion.
    upper_gate = 1.0 - smoothstep((y - 0.72) / 0.09)
    head_breath = gaussian(x, y, 0.50, 0.49, 0.31, 0.30) * upper_gate
    torso_breath = gaussian(x, y, 0.52, 0.68, 0.25, 0.18) * upper_gate
    dy += breath * (4.0 * head_breath + 3.0 * torso_breath)

    # The whole upper head follows the working lean by a small amount; the stage
    # remains fixed.  This prevents the old isolated-hand/mechanical reading.
    upper_head = gaussian(x, y, 0.50, 0.42, 0.37, 0.34) * upper_gate
    dx += (-13.0 * anticipation + 2.0 * settle) * upper_head
    dy += (8.0 * anticipation - 1.5 * settle) * upper_head

    # Viewer-left shoulder -> forearm -> paw kinetic chain.
    shoulder = gaussian(x, y, 0.39, 0.69, 0.16, 0.14) * upper_gate
    forearm = gaussian(x, y, 0.42, 0.735, 0.115, 0.105)
    paw = gaussian(x, y, 0.445, 0.785, 0.095, 0.075)
    dx += (-5.0 * anticipation) * shoulder + (-3.0 * contact) * forearm
    dy += (12.0 * anticipation) * shoulder + (16.0 * contact) * forearm
    dx += -4.0 * contact * paw
    dy += 28.0 * contact * paw

    # One continuous dough responds under the same paw.  It widens slightly as
    # the contact point lowers, without splitting into multiple pads.
    dough = gaussian(x, y, 0.47, 0.815, 0.19, 0.065)
    dx += math.tanh((x - 0.47) / 0.055) * 10.0 * contact * dough
    dy += 10.0 * contact * dough

    # One idle ear flick plus a smaller work-linked attention cue.  The two ears
    # are deliberately asymmetric and never flap together on every beat.
    left_ear = gaussian(x, y, 0.305, 0.285, 0.10, 0.105)
    right_ear = gaussian(x, y, 0.675, 0.275, 0.09, 0.10)
    ear_idle = idle_ear_flick(time_s)
    dx += (15.0 * ear_idle + 7.0 * anticipation) * left_ear
    dy += (11.0 * ear_idle + 5.0 * anticipation) * left_ear
    dx += -4.5 * anticipation * right_ear
    dy += 3.5 * anticipation * right_ear

    # The band stays with the head; only the soft crown has a delayed residual.
    # Using the delayed-minus-current delta makes the crown lag then settle,
    # instead of floating in an independent loop.
    hat_crown = gaussian(x, y, 0.49, 0.14, 0.21, 0.105)
    lag = delayed_anticipation - anticipation
    dx += -10.0 * lag * hat_crown
    dy += 6.0 * lag * hat_crown

    return dx, dy


def mesh_for_frame(width: int, height: int, time_s: float, grid: int = 34):
    mesh = []
    for row in range(grid):
        top = round(row * height / grid)
        bottom = round((row + 1) * height / grid)
        for column in range(grid):
            left = round(column * width / grid)
            right = round((column + 1) * width / grid)

            corners = ((left, top), (left, bottom), (right, bottom), (right, top))
            source_quad: list[float] = []
            for px, py in corners:
                nx = px / width
                ny = py / height
                move_x, move_y = displacement_at(nx, ny, time_s)
                source_quad.extend((px - move_x, py - move_y))
            mesh.append(((left, top, right, bottom), tuple(source_quad)))
    return mesh


def active_region_mask(size: tuple[int, int]) -> Image.Image:
    width, height = size
    mask = Image.new("L", size, 0)
    draw = ImageDraw.Draw(mask)

    def ellipse(box: tuple[float, float, float, float], fill: int = 255) -> None:
        draw.ellipse(
            (
                round(box[0] * width),
                round(box[1] * height),
                round(box[2] * width),
                round(box[3] * height),
            ),
            fill=fill,
        )

    ellipse((0.20, 0.16, 0.80, 0.68))  # head and both ears
    ellipse((0.27, 0.02, 0.70, 0.31))  # chef-hat crown
    ellipse((0.25, 0.55, 0.74, 0.82))  # torso and viewer-left arm
    ellipse((0.32, 0.65, 0.56, 0.85))  # active forearm/paw
    ellipse((0.26, 0.735, 0.81, 0.895))  # one connected dough
    return mask.filter(ImageFilter.GaussianBlur(radius=max(4, width // 180)))


def build_source_frames(master: Image.Image) -> list[Image.Image]:
    width, height = master.size
    mask = active_region_mask(master.size)
    frames: list[Image.Image] = []
    for index in range(FRAME_COUNT):
        # The final frame is explicitly the same registered neutral as frame 0,
        # so the GIF loop cannot introduce a pivot jump at the seam.
        time_s = 0.0 if index == FRAME_COUNT - 1 else index / FPS
        deformed = master.transform(
            master.size,
            Image.Transform.MESH,
            mesh_for_frame(width, height, time_s),
            resample=Image.Resampling.BICUBIC,
        )
        composed = Image.composite(deformed, master, mask)
        # Absolute root lock: no deformation may survive in the lower counter.
        root_y = round(height * 0.905)
        composed.paste(master.crop((0, root_y, width, height)), (0, root_y))
        frames.append(composed)
    return frames


def shared_palette(frames: list[Image.Image]) -> list[Image.Image]:
    palette = frames[0].quantize(colors=256, method=Image.Quantize.MEDIANCUT)
    # Dithering propagates local motion error into otherwise identical pixels on
    # later scanlines.  Disabling it keeps the registered counter bit-identical.
    return [frame.quantize(palette=palette, dither=Image.Dither.NONE) for frame in frames]


def save_gif(frames: list[Image.Image], output: Path, size: int) -> None:
    resized = [frame.resize((size, size), Image.Resampling.LANCZOS) for frame in frames]
    paletted = shared_palette(resized)
    # GIF stores centiseconds.  Alternating 80/90ms frames preserves the intended
    # 12fps average while making the complete proof exactly 10,000ms long.
    frame_durations = [90 if index % 3 == 2 else 80 for index in range(len(paletted))]
    paletted[0].save(
        output,
        save_all=True,
        append_images=paletted[1:],
        duration=frame_durations,
        loop=0,
        # Keep the previous full frame.  Background restore (disposal=2) creates
        # false repaint artifacts in the otherwise registered wooden counter.
        disposal=1,
        optimize=False,
    )


def save_lossless_webp(frames: list[Image.Image], output: Path, size: int) -> None:
    """Save a full-color review copy so GIF palette limits do not lower art QA."""

    resized = [frame.resize((size, size), Image.Resampling.LANCZOS) for frame in frames]
    frame_durations = [90 if index % 3 == 2 else 80 for index in range(len(resized))]
    resized[0].save(
        output,
        save_all=True,
        append_images=resized[1:],
        duration=frame_durations,
        loop=0,
        lossless=True,
        quality=100,
        # Losslessness controls quality; method controls only compression search.
        # Method 0 avoids the >60s method-6 stall observed on this 120-frame proof.
        method=0,
    )


def save_contact_sheet(frames: list[Image.Image], output: Path) -> None:
    sample_indices = [0, 24, 25, 28, 46, 48, 50, 52, 54, 57, 61, 119]
    tile = 192
    label_height = 24
    sheet = Image.new("RGB", (tile * 4, (tile + label_height) * 3), "#fff7e7")
    draw = ImageDraw.Draw(sheet)
    font = ImageFont.load_default()
    for slot, frame_index in enumerate(sample_indices):
        preview = frames[frame_index].resize((tile, tile), Image.Resampling.LANCZOS)
        left = (slot % 4) * tile
        top = (slot // 4) * (tile + label_height)
        sheet.paste(preview, (left, top))
        label = f"{frame_index / FPS:4.2f}s / frame {frame_index:03d}"
        draw.text((left + 6, top + tile + 5), label, fill="#5c341f", font=font)
    sheet.save(output, optimize=True)


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--source",
        type=Path,
        default=Path("assets/taskbar-cat-living-v1/sources/chef-cat-v9-living-neutral-preview.png"),
    )
    parser.add_argument("--output-dir", type=Path, default=Path("assets/taskbar-cat-living-v1/qa"))
    args = parser.parse_args()

    source = args.source.resolve()
    output_dir = args.output_dir.resolve()
    output_dir.mkdir(parents=True, exist_ok=True)

    actual_hash = sha256(source)
    if actual_hash != SOURCE_EXPECTED_SHA256:
        raise SystemExit(
            "Refusing to build from an unapproved source: "
            f"expected {SOURCE_EXPECTED_SHA256}, found {actual_hash}"
        )

    master = Image.open(source).convert("RGB")
    if master.size != (1254, 1254):
        raise SystemExit(f"Expected the approved 1254x1254 master, found {master.size}")

    frames = build_source_frames(master)
    output_128 = output_dir / "living-neutral-motion-proof-128.gif"
    output_review = output_dir / "living-neutral-motion-proof-384-review.gif"
    output_review_webp = output_dir / "living-neutral-motion-proof-384-review-lossless.webp"
    contact_sheet = output_dir / "living-neutral-motion-contact-sheet.png"
    metrics_path = output_dir / "living-neutral-motion-metrics.json"

    save_gif(frames, output_128, 128)
    save_gif(frames, output_review, 384)
    save_lossless_webp(frames, output_review_webp, 384)
    save_contact_sheet(frames, contact_sheet)

    root_y = round(master.height * 0.905)
    root_reference = master.crop((0, root_y, master.width, master.height)).tobytes()
    root_changed_frames = sum(
        frame.crop((0, root_y, master.width, master.height)).tobytes() != root_reference
        for frame in frames
    )
    seam_difference = sum(
        abs(a - b)
        for a, b in zip(
            frames[0].resize((128, 128), Image.Resampling.LANCZOS).tobytes(),
            frames[-1].resize((128, 128), Image.Resampling.LANCZOS).tobytes(),
        )
    )

    metrics = {
        "status": "motion proof; user approval required",
        "source": source.as_posix(),
        "source_sha256": actual_hash,
        "source_size": list(master.size),
        "fps": FPS,
        "duration_seconds": DURATION_SECONDS,
        "frame_count": FRAME_COUNT,
        "gif_frame_duration_pattern_ms": [80, 80, 90],
        "press_side": "viewer-left only",
        "press_start_seconds": PRESS_START_SECONDS,
        "press_duration_seconds": PRESS_DURATION_SECONDS,
        "idle_ear_flick": {"side": "viewer-left", "start_seconds": 2.05, "duration_seconds": 0.52},
        "hat_follow_delay_ms": 75,
        "root_lock_y_normalized": 0.905,
        "root_changed_frames": root_changed_frames,
        "loop_seam_rgb_absolute_difference_at_128": seam_difference,
        "outputs": {
            "proof_128": {"path": output_128.as_posix(), "sha256": sha256(output_128)},
            "review_384": {"path": output_review.as_posix(), "sha256": sha256(output_review)},
            "review_384_lossless_webp": {
                "path": output_review_webp.as_posix(),
                "sha256": sha256(output_review_webp),
            },
            "contact_sheet": {"path": contact_sheet.as_posix(), "sha256": sha256(contact_sheet)},
        },
        "limitations": [
            "Cream background is preserved; transparency and production layer separation are not attempted.",
            "Motion is a deterministic mesh proof from one approved still, not the final Unity bone/layer rig.",
            "Only one viewer-left press is included; opposite-hand work and runtime input mapping are deferred.",
        ],
    }
    metrics_path.write_text(json.dumps(metrics, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(metrics, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
