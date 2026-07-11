#!/usr/bin/env python3
"""Build fast and overdrive typing reactions from the approved cutout rig.

The cat is never redrawn per frame.  Both reactions reuse the registered v3
rigid layers, keep the dough/taskbar root fixed, and add only deterministic
speed/contact FX.  Overdrive uses a tightly masked face edit from one generated
source plus three separately drawn sweat droplets, so the rest of the approved
master cannot drift or change style.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont

import build_cutout_rig_proof as v1
import build_transparent_cutout_rig_v2 as v2


SOURCE_SIZE = 1254
EXPECTED_V3_MANIFEST_SHA256 = "68692a3dcbd2389476de291306265b38da072bcba6996c675d1ba64520c85dfe"
EXPECTED_PANIC_SOURCE_SHA256 = "c5936cbfd0cdc3f7b83067f8bfd33890962c831ffff9e6d036a64c069da6e2d3"
ROOT_BOX = (350, 1090, 1010, 1140)

MODES = {
    "fast": {
        "fps": 20,
        "frame_count": 20,
        "frame_duration_ms": 50,
        "duration_ms": 1000,
        "cycles": 3,
        "contacts_per_second": 6,
    },
    "overdrive": {
        "fps": 25,
        "frame_count": 25,
        "frame_duration_ms": 40,
        "duration_ms": 1000,
        "cycles": 4,
        "contacts_per_second": 8,
    },
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def circular_bump(phase: float, center: float, half_width: float) -> float:
    """Cosine pulse on a looping 0..1 phase."""

    distance = abs((phase - center + 0.5) % 1.0 - 0.5)
    if distance >= half_width:
        return 0.0
    return 0.5 + 0.5 * math.cos(math.pi * distance / half_width)


def work_values(time01: float, cycles: int, side: str) -> tuple[float, float, float]:
    phase = (time01 * cycles) % 1.0
    offset = 0.0 if side == "viewer-left" else 0.5
    # 0.165/0.665 land on real samples at both 20fps×3 cycles and
    # 25fps×4 cycles.  The earlier 0.23/0.73 centers fell between frames and
    # capped overdrive contact at 0.52, visually erasing the intended impact.
    anticipation = circular_bump(phase, 0.08 + offset, 0.07)
    contact = circular_bump(phase, 0.165 + offset, 0.12)
    settle = circular_bump(phase, 0.31 + offset, 0.10)
    return anticipation, contact, settle


def rounded_patch_mask(size: tuple[int, int]) -> Image.Image:
    """Only the approved face edit regions may enter the animated rig."""

    mask = Image.new("L", size, 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle((490, 480, 622, 660), radius=34, fill=255)
    draw.rounded_rectangle((694, 470, 826, 648), radius=34, fill=255)
    draw.rounded_rectangle((604, 632, 744, 718), radius=28, fill=255)
    return mask.filter(ImageFilter.GaussianBlur(16.0))


def build_panic_face_overlay(panic_source: Image.Image, head_core: Image.Image) -> Image.Image:
    # The generated source already matches the approved face palette closely.
    # Use wide feathering instead of a low-frequency color transfer: the latter
    # can spread the original closed-eye strokes into dark circular shadows.
    del head_core
    mask = rounded_patch_mask(panic_source.size)
    # Keep straight-alpha RGB intact.  Pasting RGBA through the same feathered
    # mask premultiplies the edge colors and creates a dark U-shaped halo after
    # a second alpha composite/downsample.
    overlay = panic_source.copy()
    overlay.putalpha(mask)
    return overlay


def draw_drop(draw: ImageDraw.ImageDraw, center: tuple[int, int], scale: float) -> None:
    """Draw one high-contrast chibi sweat drop at source resolution."""

    cx, cy = center
    outer = [
        (cx, round(cy - 30 * scale)),
        (round(cx - 21 * scale), round(cy + 7 * scale)),
        (round(cx - 15 * scale), round(cy + 27 * scale)),
        (cx, round(cy + 36 * scale)),
        (round(cx + 16 * scale), round(cy + 27 * scale)),
        (round(cx + 22 * scale), round(cy + 7 * scale)),
    ]
    inner = [
        (cx, round(cy - 19 * scale)),
        (round(cx - 12 * scale), round(cy + 7 * scale)),
        (round(cx - 8 * scale), round(cy + 20 * scale)),
        (cx, round(cy + 25 * scale)),
        (round(cx + 9 * scale), round(cy + 19 * scale)),
        (round(cx + 12 * scale), round(cy + 7 * scale)),
    ]
    draw.polygon(outer, fill=(73, 47, 29, 246))
    draw.polygon(inner, fill=(167, 231, 247, 250))
    draw.ellipse(
        (round(cx - 6 * scale), round(cy - 2 * scale), round(cx + 1 * scale), round(cy + 10 * scale)),
        fill=(245, 255, 255, 230),
    )


def build_sweat_layer(size: tuple[int, int]) -> Image.Image:
    layer = Image.new("RGBA", size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    draw_drop(draw, (926, 410), 0.88)
    draw_drop(draw, (845, 507), 0.76)
    draw_drop(draw, (948, 494), 0.72)
    return layer


def speed_fx(size: tuple[int, int], side: str, strength: float, overdrive: bool) -> Image.Image:
    layer = Image.new("RGBA", size, (0, 0, 0, 0))
    if strength <= 0.035:
        return layer

    draw = ImageDraw.Draw(layer)
    alpha = round((248 if overdrive else 226) * (0.48 + 0.52 * min(1.0, strength)))
    # Dough and costume are warm cream/orange, so a second warm effect vanished
    # at 128px. Use a cool flour-white core and teal edge: it stays food-like,
    # but separates cleanly from the dough on both light and dark desktops.
    cool_white = (239, 253, 255, alpha)
    teal_edge = (39, 104, 120, round(alpha * 0.88))
    # The paw presses down and slightly inward. Horizontal streaks falsely read
    # as a sideways swipe, so mirror the downward motion axis on each side:
    # viewer-left slopes down-right (\), viewer-right slopes down-left (/).
    if side == "viewer-left":
        rows = [
            (350, 758, 447, 815),
            (328, 800, 436, 864),
            (350, 842, 462, 908),
            (374, 882, 474, 936),
        ]
    else:
        rows = [
            (900, 810, 1026, 746),
            (914, 852, 1050, 782),
            (906, 892, 1030, 826),
            (892, 926, 1010, 864),
        ]
    count = 4 if overdrive else 3
    for x1, y1, x2, y2 in rows[:count]:
        start_fraction = (1.0 - strength) * 0.28
        start_x = round(x1 + (x2 - x1) * start_fraction)
        start_y = round(y1 + (y2 - y1) * start_fraction)
        draw.line((start_x, start_y, x2, y2), fill=teal_edge, width=22 if overdrive else 20)
        draw.line((start_x + 4, start_y - 2, x2 - 3, y2 - 1), fill=cool_white, width=11 if overdrive else 10)
    return layer


def dough_response_fx(size: tuple[int, int], side: str, strength: float, overdrive: bool) -> Image.Image:
    """Local compression cue above the immutable lower dough root."""

    layer = Image.new("RGBA", size, (0, 0, 0, 0))
    if strength <= 0.12:
        return layer
    draw = ImageDraw.Draw(layer)
    cx, cy = (548, 997) if side == "viewer-left" else (876, 950)
    power = math.sqrt(min(1.0, max(0.0, (strength - 0.08) / 0.92)))
    half_width = 72 if overdrive else 61
    depth = 35 if overdrive else 28
    shadow_alpha = round((112 if overdrive else 86) * power)
    draw.ellipse(
        (cx - half_width, cy - 2, cx + half_width, cy + depth),
        fill=(116, 65, 28, shadow_alpha),
    )
    draw.arc(
        (cx - half_width - 4, cy - 12, cx + half_width + 4, cy + depth + 9),
        196,
        344,
        fill=(91, 52, 28, round((235 if overdrive else 205) * power)),
        width=16 if overdrive else 13,
    )
    draw.arc(
        (cx - half_width + 4, cy - 17, cx + half_width - 4, cy + depth - 1),
        203,
        337,
        fill=(255, 234, 184, round((242 if overdrive else 214) * power)),
        width=8 if overdrive else 7,
    )
    return layer


def impact_back_fx(size: tuple[int, int], side: str, strength: float, overdrive: bool) -> Image.Image:
    """Comic impact crown behind the paw, leaving anatomy readable in front."""

    layer = Image.new("RGBA", size, (0, 0, 0, 0))
    if strength <= 0.14:
        return layer
    draw = ImageDraw.Draw(layer)
    cx, cy = (548, 991) if side == "viewer-left" else (876, 944)
    power = math.sqrt(min(1.0, max(0.0, (strength - 0.04) / 0.96)))
    rx = 155 if overdrive else 120
    ry = 82 if overdrive else 64
    point_count = 17 if overdrive else 13
    cocoa = (104, 65, 40, round((248 if overdrive else 232) * power))
    flour = (255, 250, 226, round((255 if overdrive else 250) * power))

    # An alternating-radius upper crown borrows the reference's explosive
    # silhouette without importing black combat ink or onomatopoeia text.
    crown: list[tuple[int, int]] = []
    for index in range(point_count):
        angle = math.radians(192 + (156 * index / (point_count - 1)))
        spike = 1.0 if index % 2 == 0 else (0.48 if overdrive else 0.54)
        crown.append((
            cx + round(math.cos(angle) * rx * spike),
            cy + 8 + round(math.sin(angle) * ry * spike),
        ))
    draw.line(crown, fill=cocoa, width=27 if overdrive else 23, joint="curve")
    draw.line(crown, fill=flour, width=13 if overdrive else 11, joint="curve")

    # A flattened contact ring makes the force spread through the dough rather
    # than reading as decoration floating beside the paw.
    ring_box = (cx - rx, cy - 14, cx + rx, cy + (78 if overdrive else 64))
    draw.arc(ring_box, 184, 356, fill=cocoa, width=25 if overdrive else 21)
    draw.arc(ring_box, 184, 356, fill=flour, width=11 if overdrive else 9)
    if overdrive:
        echo_box = (cx - rx - 34, cy - 29, cx + rx + 34, cy + 92)
        echo_cocoa = (104, 65, 40, round(178 * power))
        echo_flour = (255, 250, 226, round(220 * power))
        draw.arc(echo_box, 192, 348, fill=echo_cocoa, width=18)
        draw.arc(echo_box, 192, 348, fill=echo_flour, width=8)
    return layer


def contact_fx(size: tuple[int, int], side: str, strength: float, overdrive: bool) -> Image.Image:
    layer = Image.new("RGBA", size, (0, 0, 0, 0))
    if strength <= 0.16:
        return layer

    draw = ImageDraw.Draw(layer)
    cx, cy = (548, 991) if side == "viewer-left" else (876, 944)
    power = math.sqrt(min(1.0, max(0.0, (strength - 0.05) / 0.95)))
    length = round((128 if overdrive else 96) * (0.65 + 0.35 * power))
    width = 21 if overdrive else 17
    # Flour must read as flour, not water.  A cocoa silhouette keeps the warm
    # white powder visible on both pale wallpaper and a dark desktop.
    color = (255, 249, 226, round((255 if overdrive else 246) * power))
    outline = (112, 72, 43, round((242 if overdrive else 222) * power))
    # Overdrive rays fan upward/outward. A former +76-degree ray reached the
    # immutable lower dough-root band, so no high-tier ray points down into it.
    angles = (-116, -94, -72, -50, -28, -6, 16, 38) if overdrive else (-92, -62, -30, 2, 36, 68)
    for angle in angles:
        rad = math.radians(angle)
        inner = 42 if overdrive else 37
        x1 = cx + round(math.cos(rad) * inner)
        y1 = cy + round(math.sin(rad) * inner)
        x2 = cx + round(math.cos(rad) * length)
        y2 = cy + round(math.sin(rad) * length)
        draw.line((x1, y1, x2, y2), fill=outline, width=width + 7)
        draw.line((x1, y1, x2, y2), fill=color, width=width)

    # Broad outlined flour bursts stay outside the paw silhouette. Fast gets a
    # readable single 팡; overdrive adds more lobes/particles for 파파팡.
    direction = -1 if side == "viewer-left" else 1
    puffs = [
        (-48, -20, 24),
        (43, -8, 38),
        (82, -48, 29),
        (126, -20, 21),
    ]
    if overdrive:
        puffs.extend((
            (-76, -52, 26),
            (48, -88, 25),
            (112, -92, 21),
            (163, -64, 18),
            (184, -20, 15),
        ))
    cloud_mask = Image.new("L", size, 0)
    cloud_draw = ImageDraw.Draw(cloud_mask)
    for offset_x, offset_y, radius in puffs:
        px = cx + direction * offset_x
        py = cy + offset_y
        cloud_draw.ellipse((px - radius, py - radius, px + radius, py + radius), fill=255)
    # One union silhouette reads as a torn powder cloud. Outlining every lobe
    # separately made the previous 112px preview look like flowers/bubbles.
    expanded = cloud_mask.filter(ImageFilter.MaxFilter(13 if overdrive else 11))
    outline_alpha = round((232 if overdrive else 212) * power)
    fill_alpha = round((255 if overdrive else 248) * power)
    outline_layer = Image.new("RGBA", size, (112, 72, 43, 0))
    outline_layer.putalpha(expanded.point(lambda value: round(value * outline_alpha / 255)))
    fill_layer = Image.new("RGBA", size, (255, 250, 231, 0))
    fill_layer.putalpha(cloud_mask.point(lambda value: round(value * fill_alpha / 255)))
    layer = Image.alpha_composite(layer, outline_layer)
    layer = Image.alpha_composite(layer, fill_layer)
    draw = ImageDraw.Draw(layer)
    particle_points = [
        (-78, -82, 10), (-38, -111, 8), (32, -126, 11),
        (83, -119, 9), (128, -98, 8), (159, -62, 7), (176, -24, 6),
    ]
    if overdrive:
        particle_points.extend((
            (-112, -118, 9), (-66, -154, 7), (2, -174, 10),
            (62, -163, 8), (116, -151, 9), (168, -126, 7), (205, -82, 8),
        ))
    for offset_x, offset_y, radius in particle_points:
        px = cx + direction * offset_x
        py = cy + offset_y
        draw.ellipse(
            (px - radius - 3, py - radius - 3, px + radius + 3, py + radius + 3),
            fill=(112, 72, 43, round((224 if overdrive else 190) * power)),
        )
        draw.ellipse(
            (px - radius, py - radius, px + radius, py + radius),
            fill=(255, 250, 231, round((255 if overdrive else 244) * power)),
        )
    return layer


def build_frames(
    mode: str,
    base: Image.Image,
    layers: dict[str, Image.Image],
    panic_face: Image.Image,
    sweat: Image.Image,
) -> list[Image.Image]:
    config = MODES[mode]
    frames: list[Image.Image] = []
    overdrive = mode == "overdrive"

    neck_pivot = (650.0, 735.0)
    left_shoulder = (418.0, 770.0)
    left_elbow = (485.0, 875.0)
    right_shoulder = (805.0, 748.0)
    right_elbow = (850.0, 850.0)
    left_ear_pivot = (402.0, 458.0)
    right_ear_pivot = (778.0, 365.0)
    crown_pivot = (602.0, 269.0)
    tail_pivot = (345.0, 910.0)

    for index in range(config["frame_count"]):
        # The last frame deliberately repeats t=1.0, proving a neutral loop seam.
        time01 = index / (config["frame_count"] - 1)
        left_ant, left_contact, left_settle = work_values(time01, config["cycles"], "viewer-left")
        right_ant, right_contact, right_settle = work_values(time01, config["cycles"], "viewer-right")

        head_strength = 1.58 if overdrive else 1.28
        head_angle = head_strength * (
            0.9 * left_ant - 0.9 * right_ant - 0.15 * left_settle + 0.15 * right_settle
        )
        head_translate = (
            (-3.0 * left_ant + 3.0 * right_ant) * head_strength,
            (9.2 * (left_contact + right_contact)) * head_strength,
        )

        # Both high tiers share the largest travel that passes the immutable
        # dough-root gate.  Overdrive intensity comes from contact frequency,
        # burst density and expression, never extra penetration.
        arm_scale = 1.60
        left_upper_angle = arm_scale * (-1.8 * left_ant - 0.9 * left_contact)
        left_upper_translate = (
            -1.1 * left_ant * arm_scale,
            (8.0 * left_ant + 5.0 * left_contact) * arm_scale,
        )
        left_forearm_angle = 3.5 * left_contact * arm_scale
        forearm_travel = 22.0
        left_forearm_translate = (-3.2 * left_contact, forearm_travel * left_contact * arm_scale)

        right_upper_angle = arm_scale * (1.8 * right_ant + 0.9 * right_contact)
        right_upper_translate = (
            1.1 * right_ant * arm_scale,
            (8.0 * right_ant + 5.0 * right_contact) * arm_scale,
        )
        right_forearm_angle = -3.5 * right_contact * arm_scale
        right_forearm_translate = (3.2 * right_contact, forearm_travel * right_contact * arm_scale)

        tail_cycles = 2 if overdrive else 1
        tail_amplitude = 17.0 if overdrive else 14.0
        tail_angle = tail_amplitude * math.sin(2.0 * math.pi * tail_cycles * time01)
        tail = v1.rigid(layers["tail"], tail_angle, tail_pivot)

        head_core = v1.rigid(layers["head_core"], head_angle, neck_pivot, head_translate)
        eyes = v1.rigid(layers["open_eyes"], head_angle, neck_pivot, head_translate)
        panic = v1.rigid(panic_face, head_angle, neck_pivot, head_translate)
        sweat_moved = v1.rigid(sweat, head_angle, neck_pivot, head_translate)

        left_ear = v1.rigid(layers["left_ear"], head_angle, neck_pivot, head_translate)
        left_pivot = v1.transform_point(left_ear_pivot, head_angle, neck_pivot, head_translate)
        left_flap = (7.6 if overdrive else 4.2) * (left_contact + 0.28 * right_contact)
        left_ear = v1.rigid(left_ear, left_flap, left_pivot)

        right_ear = v1.rigid(layers["right_ear"], head_angle, neck_pivot, head_translate)
        right_pivot = v1.transform_point(right_ear_pivot, head_angle, neck_pivot, head_translate)
        right_flap = -(7.6 if overdrive else 4.2) * (right_contact + 0.28 * left_contact)
        right_ear = v1.rigid(right_ear, right_flap, right_pivot)

        crown = v1.rigid(layers["hat_crown"], head_angle, neck_pivot, head_translate)
        crown_pivot_moved = v1.transform_point(crown_pivot, head_angle, neck_pivot, head_translate)
        crown_kick = -0.20 * left_flap - 0.20 * right_flap
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
                ImageDraw.Draw(shadow).ellipse(box, fill=(105, 61, 28, round(35 * contact)))
                scene = Image.alpha_composite(scene, shadow)

        scene = Image.alpha_composite(
            scene, speed_fx(base.size, "viewer-left", max(left_ant, left_contact), overdrive)
        )
        scene = Image.alpha_composite(
            scene, speed_fx(base.size, "viewer-right", max(right_ant, right_contact), overdrive)
        )
        scene = Image.alpha_composite(scene, dough_response_fx(base.size, "viewer-left", left_contact, overdrive))
        scene = Image.alpha_composite(scene, dough_response_fx(base.size, "viewer-right", right_contact, overdrive))
        scene = Image.alpha_composite(scene, impact_back_fx(base.size, "viewer-left", left_contact, overdrive))
        scene = Image.alpha_composite(scene, impact_back_fx(base.size, "viewer-right", right_contact, overdrive))
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

        if overdrive:
            scene = Image.alpha_composite(scene, panic)
            scene = Image.alpha_composite(scene, sweat_moved)
        else:
            scene = Image.alpha_composite(scene, eyes)

        scene = Image.alpha_composite(scene, contact_fx(base.size, "viewer-left", left_contact, overdrive))
        scene = Image.alpha_composite(scene, contact_fx(base.size, "viewer-right", right_contact, overdrive))
        frames.append(v2.sanitize_transparent_frame(scene))

    return frames


def save_webp(frames: list[Image.Image], output: Path, size: int, duration_ms: int) -> None:
    resized = [frame.resize((size, size), Image.Resampling.LANCZOS) for frame in frames]
    resized[0].save(
        output,
        save_all=True,
        append_images=resized[1:],
        duration=[duration_ms] * len(resized),
        loop=0,
        lossless=True,
        quality=100,
        method=0,
    )


def save_checker_gif(frames: list[Image.Image], output: Path, size: int, duration_ms: int) -> None:
    rgb_frames = [v2.composite_background(frame, None, size) for frame in frames]
    palette = rgb_frames[0].quantize(colors=256, method=Image.Quantize.MEDIANCUT)
    paletted = [frame.quantize(palette=palette, dither=Image.Dither.NONE) for frame in rgb_frames]
    paletted[0].save(
        output,
        save_all=True,
        append_images=paletted[1:],
        duration=[duration_ms] * len(paletted),
        loop=0,
        disposal=1,
        optimize=False,
    )


def changed_pixels(first: Image.Image, other: Image.Image, box: tuple[int, int, int, int]) -> int:
    diff = ImageChops.difference(first.crop(box), other.crop(box)).convert("L")
    return sum(diff.histogram()[1:])


def animation_metrics(frames: list[Image.Image]) -> dict[str, object]:
    neutral = frames[0]
    corner_alpha = [
        neutral.getchannel("A").getpixel(point)
        for point in ((0, 0), (SOURCE_SIZE - 1, 0), (0, SOURCE_SIZE - 1), (SOURCE_SIZE - 1, SOURCE_SIZE - 1))
    ]
    return {
        "first_last_frames_identical": ImageChops.difference(frames[0], frames[-1]).getbbox() is None,
        "fixed_dough_root_max_changed_pixels": max(changed_pixels(frames[0], frame, ROOT_BOX) for frame in frames),
        "max_visible_green_dominant_pixels": max(v2.green_dominant_visible_pixels(frame) for frame in frames),
        "transparent_corner_alpha": corner_alpha,
    }


def save_contact_sheet(fast: list[Image.Image], overdrive: list[Image.Image], output: Path) -> None:
    tile = 192
    label = 27
    sheet = Image.new("RGB", (tile * 5, (tile + label) * 2), "white")
    draw = ImageDraw.Draw(sheet)
    font = ImageFont.load_default()
    rows = [
        ("FAST", fast, [0, 1, 4, 8, 11]),
        ("OVERDRIVE", overdrive, [0, 1, 4, 7, 10]),
    ]
    for row, (name, frames, indices) in enumerate(rows):
        for column, index in enumerate(indices):
            preview = v2.composite_background(frames[index], None, tile)
            x = column * tile
            y = row * (tile + label)
            sheet.paste(preview, (x, y))
            draw.text((x + 5, y + tile + 6), f"{name} f{index:02d}", fill="#3b2b26", font=font)
    sheet.save(output, optimize=True)


def save_light_dark_sheet(fast: list[Image.Image], overdrive: list[Image.Image], output: Path) -> None:
    # Runtime CSS displays the 128px canvas at 112px (87.5%). Keep this sheet
    # at that exact final size so effect contrast is not approved from zoomed art.
    tile, label = 112, 22
    sheet = Image.new("RGB", (tile * 2, (tile + label) * 2), "white")
    draw = ImageDraw.Draw(sheet)
    font = ImageFont.load_default()
    # Both rows must show a true peak-contact frame. The former fast[11]
    # sample was only ~35% contact strength and understated the delivered FX.
    rows = [("FAST", fast[1]), ("OVERDRIVE", overdrive[1])]
    backgrounds = [((250, 246, 236, 255), "LIGHT", "#3b2b26"), ((23, 31, 42, 255), "DARK", "#f5ead7")]
    for row, (name, frame) in enumerate(rows):
        enlarged = frame.resize((tile, tile), Image.Resampling.LANCZOS)
        for column, (color, background_name, text_color) in enumerate(backgrounds):
            preview = Image.alpha_composite(Image.new("RGBA", (tile, tile), color), enlarged).convert("RGB")
            x = column * tile
            y = row * (tile + label)
            sheet.paste(preview, (x, y))
            draw.text((x + 4, y + tile + 5), f"{name} {background_name}", fill=text_color, font=font)
    sheet.save(output, optimize=True)


def verify_written_animation(path: Path, expected_frames: int, expected_duration_ms: int) -> None:
    data = path.read_bytes()
    if data[:4] != b"RIFF" or data[8:12] != b"WEBP":
        raise SystemExit(f"{path.name}: invalid WebP container")
    offset = 12
    frame_durations: list[int] = []
    while offset + 8 <= len(data):
        kind = data[offset:offset + 4]
        size = int.from_bytes(data[offset + 4:offset + 8], "little")
        payload = offset + 8
        if payload + size > len(data):
            raise SystemExit(f"{path.name}: truncated {kind!r} chunk")
        if kind == b"ANMF" and size >= 16:
            frame_durations.append(int.from_bytes(data[payload + 12:payload + 15], "little"))
        offset = payload + size + (size & 1)

    with Image.open(path) as animation:
        frame_count = getattr(animation, "n_frames", 1)
        decoded = []
        for index in range(frame_count):
            animation.seek(index)
            decoded.append(animation.convert("RGBA"))
    if frame_count != expected_frames:
        raise SystemExit(f"{path.name}: decoded {frame_count} frames, expected {expected_frames}")
    if sum(frame_durations) != expected_duration_ms:
        raise SystemExit(
            f"{path.name}: container duration {sum(frame_durations)}ms, expected {expected_duration_ms}ms"
        )
    if ImageChops.difference(decoded[0], decoded[-1]).getbbox() is not None:
        raise SystemExit(f"{path.name}: decoded first/last frames differ")


def read_animation_frames(path: Path) -> list[Image.Image]:
    frames: list[Image.Image] = []
    with Image.open(path) as animation:
        for index in range(getattr(animation, "n_frames", 1)):
            animation.seek(index)
            frames.append(animation.convert("RGBA"))
    return frames


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--asset-root", type=Path, default=Path("assets/taskbar-cat-typing-v1"))
    parser.add_argument(
        "--mode",
        choices=("fast", "overdrive", "all", "finalize"),
        default="all",
        help="Build one source-resolution mode per process to stay inside local command limits.",
    )
    args = parser.parse_args()

    asset_root = args.asset_root.resolve()
    source_dir = asset_root / "sources"
    layer_dir = asset_root / "layers"
    qa_dir = asset_root / "qa"
    layer_dir.mkdir(parents=True, exist_ok=True)
    qa_dir.mkdir(parents=True, exist_ok=True)

    v3_root = Path("assets/taskbar-cat-cutout-rig-v3").resolve()
    v3_manifest = v3_root / "transparent-rig-manifest.json"
    if sha256(v3_manifest) != EXPECTED_V3_MANIFEST_SHA256:
        raise SystemExit("v3 manifest changed; refusing to animate an unknown rig")

    panic_path = source_dir / "chef-cat-panic-face-v1.png"
    if sha256(panic_path) != EXPECTED_PANIC_SOURCE_SHA256:
        raise SystemExit("panic face source changed; review the local edit before rebuilding")

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
    if base.size != (SOURCE_SIZE, SOURCE_SIZE):
        raise SystemExit(f"unexpected rig size: {base.size}")
    layers = {
        name: Image.open(path).convert("RGBA")
        for name, path in layer_paths.items()
        if name != "base"
    }
    panic_source = Image.open(panic_path).convert("RGBA")
    if panic_source.size != base.size:
        raise SystemExit("panic source canvas differs from the approved master")
    panic_face = build_panic_face_overlay(panic_source, layers["head_core"])
    sweat = build_sweat_layer(base.size)
    panic_face.save(layer_dir / "panic-face-overlay.png", optimize=True)
    sweat.save(layer_dir / "panic-sweat-overlay.png", optimize=True)

    selected_modes = list(MODES) if args.mode == "all" else ([] if args.mode == "finalize" else [args.mode])
    for mode in selected_modes:
        frames = build_frames(mode, base, layers, panic_face, sweat)
        config = MODES[mode]
        runtime = asset_root / f"chef-cat-typing-{mode}-128.webp"
        # A final-speed checker GIF is sufficient for repeated motion review.
        # Avoid a second large lossless WebP encode: the prior 384px review
        # route exceeded the local 60-second command window without adding a
        # stronger gate than the source frames + 128px runtime decode already
        # provide.  The 1254px layers remain the fidelity master.
        qa_gif = qa_dir / f"chef-cat-typing-{mode}-checker-256.gif"
        save_webp(frames, runtime, 128, config["frame_duration_ms"])
        save_checker_gif(frames, qa_gif, 256, config["frame_duration_ms"])
        verify_written_animation(runtime, config["frame_count"], config["duration_ms"])
        metrics = {
            **MODES[mode],
            **animation_metrics(frames),
        }
        if not metrics["first_last_frames_identical"]:
            raise SystemExit(f"{mode}: source loop seam differs")
        if metrics["fixed_dough_root_max_changed_pixels"] != 0:
            raise SystemExit(f"{mode}: fixed dough root moved")
        if metrics["max_visible_green_dominant_pixels"] != 0:
            raise SystemExit(f"{mode}: visible chroma contamination detected")
        metrics.update({
            "runtime_sha256": sha256(runtime),
            "checker_sha256": sha256(qa_gif),
        })
        (qa_dir / f"typing-{mode}-metrics.json").write_text(
            json.dumps(metrics, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        print(json.dumps({"built_mode": mode, "metrics": metrics}, ensure_ascii=False, indent=2))

    metric_paths = {mode: qa_dir / f"typing-{mode}-metrics.json" for mode in MODES}
    runtime_paths = {mode: asset_root / f"chef-cat-typing-{mode}-128.webp" for mode in MODES}
    checker_paths = {mode: qa_dir / f"chef-cat-typing-{mode}-checker-256.gif" for mode in MODES}
    if not all(path.exists() for path in [*metric_paths.values(), *runtime_paths.values(), *checker_paths.values()]):
        print("incremental_build_pending=run the remaining --mode before manifest finalization")
        return

    mode_metrics = {
        mode: json.loads(path.read_text(encoding="utf-8"))
        for mode, path in metric_paths.items()
    }
    for mode in MODES:
        if mode_metrics[mode]["runtime_sha256"] != sha256(runtime_paths[mode]):
            raise SystemExit(f"{mode}: runtime differs from its incremental metrics")
        if mode_metrics[mode]["checker_sha256"] != sha256(checker_paths[mode]):
            raise SystemExit(f"{mode}: checker differs from its incremental metrics")

    contact_sheet = qa_dir / "typing-tier-contact-sheet.png"
    light_dark_sheet = qa_dir / "typing-tier-light-dark.png"
    decoded_fast = read_animation_frames(runtime_paths["fast"])
    decoded_overdrive = read_animation_frames(runtime_paths["overdrive"])
    save_contact_sheet(
        decoded_fast,
        decoded_overdrive,
        contact_sheet,
    )
    save_light_dark_sheet(decoded_fast, decoded_overdrive, light_dark_sheet)
    outputs: dict[str, Path] = {
        "fast_128_webp": runtime_paths["fast"],
        "fast_checker_256_gif": checker_paths["fast"],
        "overdrive_128_webp": runtime_paths["overdrive"],
        "overdrive_checker_256_gif": checker_paths["overdrive"],
        "contact_sheet": contact_sheet,
        "light_dark_sheet": light_dark_sheet,
        "panic_face_overlay": layer_dir / "panic-face-overlay.png",
        "panic_sweat_overlay": layer_dir / "panic-sweat-overlay.png",
    }

    manifest = {
        "status": "typing intensity motion candidate; user final-speed review required",
        "source_v3_manifest_sha256": sha256(v3_manifest),
        "panic_source": {
            "path": panic_path.as_posix(),
            "sha256": sha256(panic_path),
            "usage": "eyes, brows, and mouth only through three declared feathered masks",
        },
        "declared_face_masks_source_pixels": [
            [490, 480, 622, 660],
            [694, 470, 826, 648],
            [604, 632, 744, 718],
        ],
        "sweat": {
            "count": 3,
            "implementation": "deterministic separate RGBA overlay",
        },
        "speed_fx": {
            "viewer_left_axis": "upper-left to lower-right; downward press",
            "viewer_right_axis": "upper-right to lower-left; downward press",
            "horizontal_streaks_allowed": False,
            "contrast_palette": "teal diagonal motion streaks; warm flour-white burst with cocoa outline",
            "fast_burst": "one 21.4px comic impact crown plus four flour clouds and seven airborne particles per paw strike",
            "overdrive_burst": "one 27.7px double impact crown plus nine flour clouds and fourteen airborne particles per paw strike",
            "burst_is_layered_behind_paw": True,
            "burst_clouds_are_union_silhouette": True,
        },
        "motion_readability": {
            "display_size_px": 112,
            "fast_forearm_contact_translate_source_px": 35.2,
            "fast_forearm_contact_translate_display_px": 3.14,
            "overdrive_forearm_contact_translate_source_px": 35.2,
            "overdrive_forearm_contact_translate_display_px": 3.14,
            "dough_response_is_local_above_fixed_root": True,
            "overdrive_uses_extra_penetration": False,
        },
        "modes": mode_metrics,
        "runtime_intensity_contract": {
            "anonymous_window_ms": 800,
            "fast_min_pulses": 4,
            "overdrive_min_pulses": 8,
            "normal_hold_ms": 220,
            "fast_hold_ms": 620,
            "overdrive_hold_ms": 780,
            "input_changes_rewards_or_duration": False,
            "input_content_persisted": False,
            "replace_current_no_queue": True,
        },
        "fixed_dough_root_box_source_pixels": list(ROOT_BOX),
        "layer_sources": {
            name: {"path": path.as_posix(), "sha256": sha256(path)}
            for name, path in layer_paths.items()
        },
        "outputs": {
            key: {"path": path.as_posix(), "sha256": sha256(path)}
            for key, path in outputs.items()
        },
        "limitations": [
            "Browser file-page continuous playback still requires user review.",
            "Windows global input and Unity Animator/C# adapters are not implemented here.",
            "The panic source is prototype/IP-holder review material, not a Steam shipping-rights approval.",
        ],
    }
    manifest_path = asset_root / "typing-motion-manifest.json"
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(manifest, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
