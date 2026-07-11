# Taskbar Cat Typing Motion v1 Provenance

## Purpose

Prototype-only fast and overdrive keyboard reactions for the approved 2D chef-cat kneading one dough. These assets are for local/IP-holder review; they are not Steam shipping-rights approval.

## Sources

- Articulated body layers and pivots: `assets/taskbar-cat-cutout-rig-v3/layers/`.
- Ambient/static registration reference: `assets/taskbar-cat-cutout-rig-v4/`.
- Panic expression edit source: `sources/chef-cat-panic-face-v1.png`, generated with the built-in image tool from the approved neutral. Only three feathered regions containing eyes, brows, and mouth enter the rig.
- Sweat, speed lines, local dough compression, comic impact crowns, contact rays, and flour clouds: deterministic RGBA layers drawn by `scripts/build_typing_motion_v1.py`. Viewer-left streaks slope down-right and viewer-right streaks slope down-left so both follow the paw's downward press into the dough; horizontal streaks are prohibited by the manifest gate. Motion streaks retain a cool teal accent, while the material burst is warm flour-white with a cocoa outline so it reads as powder on both light and dark desktops at the actual 112px CSS display size. The fast tier uses a 21.4px crown, four joined cloud lobes and seven airborne particles; overdrive uses a 27.7px double crown, nine joined lobes and fourteen particles. The crown is composited behind the paw, and the lobes share one union outline so the effect does not read as flowers or bubbles.
- User reference images supplied on 2026-07-10: runner speed/impact language and cute overwhelmed sweat expression. They are references only and are not copied into runtime assets.

## Runtime Outputs

- `chef-cat-typing-fast-128.webp`: 128×128, 20 frames, 50ms/frame, 1,000ms, 6 contacts/second.
- `chef-cat-typing-overdrive-128.webp`: 128×128, 25 frames, 40ms/frame, 1,000ms, 8 contacts/second.
- Full hashes, source layer hashes, face masks, quality metrics, and runtime thresholds: `typing-motion-manifest.json`.

## Unity Handoff

- Preserve the 1254×1254 source layers; do not use the 128px WebPs as art masters.
- Recreate fast and overdrive as Animator states from the documented rigid pivots. Keep the dough/taskbar root fixed.
- Use an ephemeral anonymous input-pulse ring buffer: 800ms window, fast at 4 pulses, overdrive at 8 pulses. Do not serialize pulses or inspect key content.
- Use replace-current state arbitration and do not re-enter the same Animator state on every pulse; otherwise the clip will keep seeking to frame zero.
- Keep input intensity separate from the continuous visual loop and management rewards.
- Do not create a taskbar ready/claim state or persistent phase/status ticket for this activity. Keep any legacy timestamp loop internal, migrate old completion timestamps without exposing a claim, and reserve cat activation for the panel toggle.

## Verification Status

Both runtime files have identical first/last frames, zero source-frame fixed dough-root changes, zero visible green-dominant pixels, and transparent corners. Paw contact travel is 35.2 source pixels / 3.14 display pixels in both high tiers; overdrive adds cadence and burst density rather than dough penetration. The saved 112px light/dark sheet uses the actual peak frame for both tiers. Independent decoded review found no alpha/silhouette or lower-baseline change, but 128→112 Lanczos scaling can change 26 fast / 31 overdrive RGB pixels in the protected band's upper rows by at most 13 channel levels; continuous playback must judge whether this produces visible color shimmer. Current SHA-256 values are fast `16dbf8bf994d1fbeee15129225b0b032e3b16b5f4f8fb9e8cfccc9f377e3015f` and overdrive `08678c4b0903a74ac84a0d2d4e249313d8ffffc923f19796966a1bfa95565a64`. Continuous interaction in the user's open local `file:` page is still required, so status is `Implemented, not live-verified`.
