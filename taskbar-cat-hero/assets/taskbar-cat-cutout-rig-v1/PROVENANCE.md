# Chef Cat Articulated Cutout Rig v1

## Status

`Implemented, user review required` — this is the replacement for the user-rejected flat-image mesh proof. It is a one-motion quality gate and is not connected to the current HTML/runtime.

## Authoritative source

- Approved neutral: `../taskbar-cat-living-v1/sources/chef-cat-v9-living-neutral-preview.png`
- Size: 1254 × 1254 RGB
- SHA-256: `ec112924e2f6c9daa8988e68319ad05ee0c8d615459738a0b89be246c4f03704`
- Style anchor: `../concept/chef-cat-v9.png` / user Image 1.

## Generated clean plate

- File: `../taskbar-cat-living-v1/sources/chef-cat-v9-clean-base-v1.png`
- SHA-256: `b778ff6bddf8b158c56c28ac149b0a75f2aba28f7a5cf14b3265a9028dbfb3ac`
- Built-in image generation edit target: the approved neutral above.
- Purpose: remove only the complete head group and viewer-left working arm, reconstructing the cream background, coat/neck and one continuous dough behind them.
- Usage restriction: generated pixels are copied only into the declared removed head/arm masks. Every pixel outside those masks remains from the approved neutral.

Final built-in edit prompt:

```text
Use case: precise-object-edit
Asset type: high-resolution 2D game-character animation clean plate
Input images: Image 1 is the exact edit target and authoritative style/geometry reference.
Primary request: Create a hidden-underlayer clean plate for cutout rigging. Remove only (A) the entire head group above the red neckerchief, including the face, both ears, chef-hat band and chef-hat crown, and (B) the viewer-left active sleeve, forearm and paw that currently press the left side of the dough. Reconstruct only what those removed parts had hidden: the same warm cream background, a simple white chef-coat neck/upper-torso continuation behind the missing head, and the same one-piece pale dough surface behind the missing paw. Keep the remaining torso, red neckerchief, viewer-right sleeve and paw, tail, brown pouch, one continuous dough, wooden counter, lighting, crop, scale and composition unchanged.
Style/medium: match Image 1 exactly—compact 2D chibi mobile-game illustration, dark-brown outline, warm flat pastel shading, crisp high-resolution edges.
Constraints: this is an animation clean plate, so the missing head and missing viewer-left arm must stay absent; exactly one remaining visible front paw on the viewer-right; exactly one continuous dough; no replacement character parts; no extra limbs; no tools; no text; no watermark. Preserve every non-removed element as closely as possible and do not redesign the outfit, stage, dough or counter.
```

## Actual RGBA layers

- `layers/base-clean-composite.png`
- `layers/head-core.png`
- `layers/left-ear.png`
- `layers/hat-crown.png`
- `layers/upper-arm.png`
- `layers/forearm-paw.png`

The neutral composition of these layers reconstructs the approved source with zero changed RGB pixels. No generated full-body state frame is used.

## Motion representation

- Builder: `scripts/build_cutout_rig_proof.py`
- Dependency pin: `scripts/requirements-cutout-rig.txt`
- Duration: 6 seconds, 72 frames, average 12fps.
- Rigid pivots at source resolution:
  - neck `(650, 735)`
  - viewer-left shoulder `(418, 770)`
  - viewer-left elbow `(485, 875)`
  - viewer-left ear base `(402, 458)`
  - hat crown base `(602, 269)`
- Rigid layers use only rotation and translation. Mesh deformation layers: none.
- One work beat: neutral → rare ear flick → head anticipation → connected upper-arm/forearm/paw press → settle → exact neutral.

## Outputs and verification

- `qa/cutout-rig-proof-128.gif` — actual taskbar-size compatibility proof.
- `qa/cutout-rig-proof-384.gif` — enlarged compatibility review.
- `qa/cutout-rig-proof-384-lossless.webp` — full-color lossless review master.
- `qa/cutout-rig-contact-sheet.png` — selected idle, ear, anticipation, contact and settle frames.
- `qa/cutout-neutral-reconstruction.png` — exact neutral reconstruction.
- `cutout-rig-manifest.json` — hashes, pivots and measured gates.

Verified:

- three delivered animations decode to 72 frames and exactly 6,000ms;
- first and last decoded frames are identical;
- fixed lower-counter changes are `0` in every decoded frame;
- neutral reconstruction differs from the approved neutral by `0` RGB pixels;
- every moving cat component is a non-empty RGBA layer;
- selected 384px frames were visually inspected after correcting the first doubled viewer-left ear outline.

## Remaining limitations

- The cream background remains; production transparency and Unity import settings are not yet generated.
- Only the viewer-left work beat exists. Opposite arm, input reactions, completion and production phases are excluded.
- User final-speed approval is required. Internal registration and layer checks cannot accept the motion on the user's behalf.
