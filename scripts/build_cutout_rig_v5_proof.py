#!/usr/bin/env python3
"""v5 amplitude proof: same approved v3 layers and rig, higher-amplitude
connected kneading so the motion actually reads at 128px.

Non-destructive: writes to assets/taskbar-cat-cutout-rig-v5-proof/ and never
touches the v4 runtime asset or any HTML/runtime code. Only the motion
*amplitudes* change versus v4 — pivots, layer bytes, timing grid, blink/ear
windows, and the fixed dough root are all unchanged. Art is not regenerated;
the existing high-quality rigid layers are simply moved more, and only with
rigid rotate/translate (no mesh deformation).
"""

from __future__ import annotations

import math
import sys

from PIL import Image, ImageDraw

import build_transparent_cutout_rig_v4 as v4

v1, v2 = v4.v1, v4.v2


def build_frames_v5(base: Image.Image, layers: dict[str, Image.Image]) -> list[Image.Image]:
    frames: list[Image.Image] = []
    # Pivots: identical to v4 (documented rig).
    neck_pivot = (650.0, 735.0)
    left_shoulder = (418.0, 770.0)
    left_elbow = (485.0, 875.0)
    right_shoulder = (805.0, 748.0)
    right_elbow = (850.0, 850.0)
    left_ear_pivot = (402.0, 458.0)
    right_ear_pivot = (778.0, 365.0)
    crown_pivot = (602.0, 269.0)
    tail_pivot = (345.0, 910.0)

    N = v4.FRAME_COUNT
    D = v4.DURATION_SECONDS

    for index in range(N):
        time_s = index * D / (N - 1)
        left_ant, left_contact, left_settle = v4.side_work_values(time_s, "viewer-left")
        right_ant, right_contact, right_settle = v4.side_work_values(time_s, "viewer-right")

        # --- AMPLITUDE CHANGES vs v4 (source-pixel space; /~9.8 at 128px) ---
        # v4 deliberately shrank the head/weight cue to near-zero, which read as
        # a frozen cat. v5 restores a readable, connected effort: gentle idle
        # breathing sway + a real head dip and lean into each press, driven from
        # the shoulder through the forearm. Terms stay 0 at t=0 and t=D so the
        # loop seam and first/last-identical guarantee are preserved.
        idle_angle = 0.45 * math.sin(2.0 * math.pi * time_s / D)          # v4: 0.08
        head_angle = (
            idle_angle
            + 1.20 * left_ant                                            # v4: 0.68
            - 1.20 * right_ant
            - 0.12 * left_settle
            + 0.12 * right_settle
        )
        head_translate = (
            -4.2 * left_ant + 4.2 * right_ant,                           # v4: 2.4  (lean toward press)
            3.0 * (left_ant + right_ant)                                 # anticipation lift
            + 13.0 * (left_contact + right_contact),                     # v5 NEW: dip into the press
        )

        # Shoulder drives the whole arm down; forearm adds the paw press. ~2.4x v4.
        left_upper_angle = -2.60 * left_ant - 1.30 * left_contact        # v4: -1.45 / -0.70
        left_upper_translate = (-1.4 * left_ant, 9.0 * left_ant + 7.0 * left_contact)  # v4: 5.2 / 2.6
        left_forearm_angle = 3.60 * left_contact                        # v4: 2.1
        # Press depth capped at 16 (v4: 10.5): the paw art bottom at rest sits
        # ~1050 in source space; the fixed dough-root gate begins at y=1090, so a
        # ~23px total descent (upper 7 + forearm 16) stays clear of it while still
        # reading as a real press at 128px.
        left_forearm_translate = (-2.6 * left_contact, 16.0 * left_contact)

        right_upper_angle = 2.60 * right_ant + 1.30 * right_contact
        right_upper_translate = (1.4 * right_ant, 9.0 * right_ant + 7.0 * right_contact)
        right_forearm_angle = -3.60 * right_contact
        right_forearm_translate = (2.6 * right_contact, 16.0 * right_contact)

        # Kept at v4's 13.0: the tail pivot (345,910) sits on the fixed dough
        # root box's left edge (x=350), so a larger sway leaks pixels into the
        # protected root region and fails the 0-change gate.
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
        # Contact shadow scales with press depth; slightly deeper than v4 to
        # ground the stronger press.
        for contact, box in (
            (left_contact, (470, 982, 625, 1018)),
            (right_contact, (817, 928, 936, 978)),
        ):
            if contact > 0.02:
                shadow = Image.new("RGBA", base.size, (0, 0, 0, 0))
                ImageDraw.Draw(shadow).ellipse(box, fill=(105, 61, 28, round(34 * contact)))
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
        if not v4.blink_closed(time_s):
            scene = Image.alpha_composite(scene, open_eyes)
        frames.append(v2.sanitize_transparent_frame(scene))
    return frames


# Reuse v4's whole IO/QA/manifest pipeline; only the frame builder differs.
v4.build_frames = build_frames_v5

if __name__ == "__main__":
    sys.argv = ["v5", "--asset-root", "assets/taskbar-cat-cutout-rig-v5-proof"]
    v4.main()
