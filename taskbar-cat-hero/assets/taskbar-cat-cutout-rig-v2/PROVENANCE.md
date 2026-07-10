# Chef Cat Transparent Articulated Cutout Rig v2

## Status

`Implemented, user review required` — transparent background, alternating ear flicks and slow tail sway are implemented as a second quality gate. Current HTML/runtime files are unchanged.

## User request and interpretation

- Request: `그럼 이제 뒤에 배경 제거해주고 귀 파닥 꼬리 살랑도 넣어보자`.
- Main transparent asset removes both the cream square and the full-width wooden counter, leaving only the chef cat, outfit/pouch, visible tail and one continuous dough.
- The original cream/counter sources and v1 outputs remain preserved; no source was deleted.

## Authoritative inputs

- Approved neutral: `../taskbar-cat-living-v1/sources/chef-cat-v9-living-neutral-preview.png`
- SHA-256: `ec112924e2f6c9daa8988e68319ad05ee0c8d615459738a0b89be246c4f03704`
- Existing hidden-area clean plate: `../taskbar-cat-living-v1/sources/chef-cat-v9-clean-base-v1.png`
- SHA-256: `b778ff6bddf8b158c56c28ac149b0a75f2aba28f7a5cf14b3265a9028dbfb3ac`

## Built-in image edits and alpha extraction

Two built-in `imagegen` background-extraction edits were used. They are chroma/hidden-edge sources, not independently generated animation frames.

### Full neutral chroma source

- `../taskbar-cat-cutout-rig-v1/sources/chef-cat-v9-chroma-subject-v1.png`
- SHA-256: `9fe7c43a2d9ff4d39f5777e88d2cd3ff132832e158b31398078a34ec12b9b973`
- Alpha result: `../taskbar-cat-cutout-rig-v1/sources/chef-cat-v9-alpha-subject-generated-v1.png`
- SHA-256: `c5819b6742ad3de7394f14bb57b461fcb61744a090b798903a0effd12e298b85`

Final prompt:

```text
Use case: background-extraction
Asset type: high-resolution 2D game-character chroma-key source for a transparent taskbar sprite
Input images: Image 1 is the exact edit target. Preserve the chef cat, outfit, pouch, visible tail, both sleeve-connected front paws, and the single continuous dough exactly.
Primary request: Replace only the entire cream backdrop and the entire wooden counter/platform with one perfectly flat solid #00ff00 chroma-key background. The final visible subject must be only the original chef cat plus its outfit, pouch, tail, two paws, and one continuous dough.
Scene/backdrop: perfectly uniform #00ff00 from edge to edge, including beneath and behind the dough; no floor plane.
Style/medium: preserve Image 1's exact compact 2D chibi mobile-game illustration, dark-brown outline, warm flat pastel shading, facial identity, proportions, crop and scale.
Constraints: change only the background and wooden counter; do not redraw, restyle, resize, reposition, simplify, sharpen or alter any subject pixel or silhouette; exactly one cat, exactly two front paws, exactly one dough; keep the tail and pouch; keep internal contact/occlusion shadows that belong to the cat and dough; no cast shadow on the green background; no gradients, texture, reflections, floor, extra objects, text or watermark; do not use #00ff00 anywhere inside the subject.
```

### Clean-base chroma source

- `../taskbar-cat-cutout-rig-v1/sources/chef-cat-v9-clean-base-chroma-v1.png`
- SHA-256: `1534f8e6f18de4b31bc6c30cf0923a3216e2cf4d2385a0e0826e0792f9b974a2`
- Alpha result: `../taskbar-cat-cutout-rig-v1/sources/chef-cat-v9-clean-base-alpha-v1.png`
- SHA-256: `47b661bcbc9f5146fe2198a3da3f3edd630b6e241407fc8904ad83306fe701ce`

Final prompt:

```text
Use case: background-extraction
Asset type: high-resolution transparent cutout-rig clean-base chroma source
Input images: Image 1 is the exact edit target and already is an animation clean plate with no head and no viewer-left working arm.
Primary request: Replace only the entire cream backdrop and entire wooden counter/platform with one perfectly flat solid #00ff00 chroma-key background. Keep exactly the existing headless chef-coat torso, red neckerchief, brown pouch, visible tail, viewer-right sleeve and paw, and one continuous dough in exactly the same location, scale and style. The removed head and removed viewer-left arm must remain absent.
Scene/backdrop: perfectly uniform #00ff00 edge to edge, including behind and beneath the torso and dough; no floor plane.
Style/medium: preserve Image 1's exact compact 2D chibi mobile-game illustration, dark-brown outline, warm flat pastel shading and crisp high-resolution edges.
Constraints: change only the background and wooden counter; do not add a head, ears, hat, face, missing arm, extra paw or any new object; do not redraw, restyle, resize, reposition or simplify the remaining torso, tail, pouch, right paw or dough; exactly one visible front paw, exactly one dough; no cast shadow on green; no gradients, texture, reflection, floor, text or watermark; do not use #00ff00 inside the remaining subject.
```

Both chroma sources were converted with the installed imagegen `remove_chroma_key.py` helper using border auto-key, soft matte, thresholds `12/220` and despill. The approved neutral supplies opaque interior pixels; generated alpha/RGB is used at transparent edges and hidden clean-base areas.

## Rig and motion

- Builder: `scripts/build_transparent_cutout_rig_v2.py`
- Dependency pins: `scripts/requirements-cutout-rig.txt`
- Moving RGBA layers: head core, viewer-left ear, viewer-right ear, hat crown, upper arm, forearm/paw and tail.
- Cat mesh-deformation layers: none.
- Ear events:
  - viewer-left: 1.15s, 0.48s;
  - viewer-right: 4.45s, 0.48s.
- Tail: 3.0s period, ±4.2°, pivot `(345, 910)`, rendered behind the transparent base/pouch.
- Motion duration: 6 seconds, 72 frames, average 12fps.

## Outputs

- `chef-cat-transparent-neutral.png` — transparent high-resolution neutral.
- `chef-cat-transparent-motion-128.webp` — main taskbar-size lossless animated WebP.
- `qa/chef-cat-transparent-motion-384.webp` — enlarged lossless transparent review.
- `qa/chef-cat-transparent-motion-128.png` — 128px APNG.
- `qa/chef-cat-checker-motion-384.gif` — checker-background compatibility review.
- `qa/transparent-motion-contact-sheet.png` — selected transparent/checker frames.
- `qa/neutral-light-dark-checker.png` — neutral edge QA.
- `transparent-rig-manifest.json` — hashes and measured gates.

## Verification

- Four corner alpha values: `0, 0, 0, 0`.
- Neutral alpha bounds: `(242, 68)–(1007, 1119)` at 1254px.
- Visible green-dominant pixels across source motion frames: `0`.
- First/last RGBA frames: identical.
- Fixed lower-dough taskbar root `(350,1090)–(1010,1140)`: `0` changed pixels.
- Right-ear first cut produced a diagonal cheek seam. The moving mask was restricted to the upper ear and pivot moved to `(778,365)`; the corrected 384px right-ear frame was re-inspected on dark background.
- Neutral was inspected on light, dark and checker backgrounds; selected motion frames were inspected at 192px/384px.

## Remaining limitations

- No current HTML/runtime or Unity import was changed.
- Only the viewer-left kneading work beat exists.
- User continuous-motion approval remains the blocking acceptance gate.
