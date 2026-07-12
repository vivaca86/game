# Taskbar Cat Runtime v6 Provenance

## Status

- Local runtime candidate. The atomic canvas renderer was browser-verified on 2026-07-11; the later motion-readability retune is not yet live-verified.
- User continuous-play approval is still required before visual acceptance.
- Prototype/IP-holder review material; this record is not Steam shipping-rights approval.

## Source and transformation scope

- Character master direction: `assets/concept/chef-cat-v9.png` and the approved-direction transparent rig derived from it.
- Rigid character layers: `assets/taskbar-cat-cutout-rig-v3/layers/`.
- Face/sweat overlays for overdrive: `assets/taskbar-cat-typing-v1/layers/`.
- No new full-body character frames were generated.
- Head, ears, hat crown, upper arms, forearms/paws, tail, and face retain rigid rotate/translate transforms around the existing documented pivots.
- Only the soft dough contact field above source y=1090 uses a bounded OpenCV remap. The registered root box `[350, 1090, 1010, 1140]` is restored byte-for-byte after every deformation.

## Runtime outputs

- Builder: `scripts/build_taskbar_cat_runtime_v6.py`.
- Runtime folder: `assets/taskbar-cat-runtime-v6/`.
- Renderer: `taskbar-cat-player.js`, one 128×128 canvas using complete lossless PNG atlas frames.
- Animated WebP remains archival/QA source material and is no longer used by the presentation runtime.
- `ambient-v6`: 30 frames, 40ms/frame, 1,200ms, 2.5 contacts/s.
- `typing-fast`: 25 frames, 40ms/frame, 1,000ms, 4 contacts/s.
- `typing-overdrive`: 49 frames, 20ms/frame, 980ms, 8.16 contacts/s.
- Existing idle/rest WebPs were decoded into complete uniform-duration PNG atlas frames. Every decoded source frame had nonempty visible alpha.

## Motion and material gates

- Normal/fast paw chain designed lift-to-press travel: 4.47px at the 112px display size.
- Dough vertical compression: 2.41px at the 112px display size.
- Paw contact penetration is capped at 21 source pixels; stronger tiers use cadence, FX density, and expression instead of deeper penetration.
- Normal, fast, and overdrive first/last frames match.
- Fixed lower dough-root changes: 0 pixels for all three new clips.
- Character mesh-deformation layers: none.
- Soft mesh-deformation layer: dough contact field only.

## 2026-07-11 motion-readability retune

- Increased the high-speed sampling density so the full anticipation pose is represented instead of being skipped between contact frames.
- Strengthened the rigid head/shoulder/upper-arm/forearm chain while keeping contact penetration at the same 21-source-pixel safety cap.
- Added a restrained dough pressure arc to normal work and the full material response to fast tiers.
- Added one small cocoa-edged flour pinch to ordinary contact; it is deliberately much smaller than the fast/overdrive burst.
- Replaced per-contact ear chatter and large fast tail swings with one bounded secondary-motion envelope.
- Registered the flexible hat crown to the exact current head transform; only a sub-degree local settle remains around the crown pivot.
- Limited cool speed streaks to the incoming-paw phase so the contact frame prioritizes paw anatomy, dough deformation, and flour.
- Overdrive now enters and exits through the neutral face instead of snapping between a panic face and idle at the clip seam.
- Fresh ordinary input aligns viewer-left/right to frames 2/12, where anticipation is already readable and contact appears within one 40ms frame; repeated fast tiers still do not restart.
- The prior Microsoft Edge sheet predates these atlas hashes and is retained only as evidence of the atomic canvas renderer. Current final-speed live verification is pending.

## Playback recovery

- The earlier CSS animated-WebP route produced intermittent missing-character captures even though direct decoding proved every stored frame was nonempty.
- The first canvas revision used `clearRect` followed by `drawImage`; Microsoft Edge captured one partially cleared frame.
- The accepted local renderer uses `globalCompositeOperation = "copy"` and one full-frame `drawImage` command, so transparent and visible pixels are replaced atomically without a separate clear.

## Verification

- Deterministic contact sheet: `qa/runtime-v6-contact-sheet.png`.
- Prior 112px Edge sheet: `qa/live-msedge-final-size-sheet.png`. It proves the unchanged atomic canvas renderer but predates the current atlas hashes and is not current motion evidence.
- Prior Microsoft Edge/Playwright CLI evidence: 20 consecutive idle screenshots and 19 work/fast/overdrive screenshots; 0 blank or partial frames after atomic copy and 0 console errors/warnings.
- Current motion evidence: source/root/neutral-seam gates and the regenerated deterministic contact sheet. Final-speed current-atlas playback remains pending.
- Node project tests and single-file verification are recorded in `docs/conversation-log.md`.

## Unity handoff

- Each PNG atlas maps to a Unity `SpriteAtlas` plus an `AnimationClip` using the manifest frame count and frame duration.
- `taskbar-cat-player.js` is only the browser presentation adapter. Unity should keep the same replace-current state contract and should not import the browser canvas implementation.
- Root motion remains disabled; the taskbar contact root must stay registered.

## 2026-07-11 user-feedback correction: hat registration and overdrive cadence

- The user rejected the one-frame hat-crown lag because it made the crown look detached from the fixed band. The lagged head translation and rotation were removed. Crown and `head_core` now share the exact same head transform on every frame; the remaining local crown settle stays below 0.5 degrees.
- The user also rejected the 4.96 contacts/s overdrive as too sparse to read as `우다다다`. Overdrive was rebuilt as 49 frames at 20ms with eight alternating contacts over 980ms, or 8.16 contacts/s.
- The head/body no longer repeats the full contact bob at 8Hz. It follows one clip-level braced arc with only a small alternating side bias, while both paw chains and dough contacts retain all eight beats.
- Flour/contact FX alternate full and 0.58 weight so rapid hits remain individually legible instead of merging into a continuous white cloud. Contact penetration remains capped at 21 source pixels.
- Current atlas hashes and exact timing are authoritative in `runtime-v6-manifest.json`. The deterministic 112px light/dark and contact sheets were regenerated after this correction.
- Static/build status: passed. Actual-speed user playback approval remains pending.
