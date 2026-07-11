# Taskbar Cat Living Motion Proof v1

## Status

`Rejected by user` — the neutral still remains an approved style/pose reference, but the deterministic one-bitmap motion proof looked like a stretched image returning to shape. It is preserved only as rejection evidence and is not a production/runtime candidate.

## Approved source

- Project copy: `sources/chef-cat-v9-living-neutral-preview.png`
- Original generation output: `C:/Users/i/.codex/generated_images/019f490a-eb2a-7632-8ba9-d7e765b0a259/exec-36771b83-ab5f-424b-8c70-4331466d45eb.png`
- Size/mode: 1254 × 1254 RGB
- SHA-256: `ec112924e2f6c9daa8988e68319ad05ee0c8d615459738a0b89be246c4f03704`
- User signal: the user answered `좋아 진행해봐` after the preview was shown, authorizing the next one-motion gate.
- Visual anchor: `assets/concept/chef-cat-v9.png` / the user's Image 1. The semi-realistic baker-v2 / Image 2 look remains rejected as the visual target.

## Motion proof

- Builder: `scripts/build_living_cat_motion_proof.py`
- Method: smooth deterministic mesh deformation of the single approved still; no independently redrawn full-body frames.
- Designed duration: 10 seconds, 120 frames, average 12fps.
- Content: calm breathing, one rare viewer-left ear flick, one viewer-left work beat, connected head/shoulder/forearm/paw force, one continuous dough response, 75ms delayed hat-crown follow, and registered neutral recovery.
- Root rule: the lower wooden counter is copied from the master after deformation and must remain identical in every source frame.
- Loop rule: frame 119 is the exact registered neutral used at frame 0.

## Outputs

- `qa/living-neutral-motion-proof-128.gif` — final-size compatibility proof.
- `qa/living-neutral-motion-proof-384-review.gif` — enlarged compatibility review.
- `qa/living-neutral-motion-proof-384-review-lossless.webp` — full-color lossless enlarged review; use this for art-quality judgment.
- `qa/living-neutral-motion-contact-sheet.png` — selected idle, ear-flick, anticipation, press and settle frames.
- `qa/living-neutral-motion-metrics.json` — source/output hashes, timing and root/loop checks.

## Verification performed

- Both GIFs and the lossless WebP decode to 120 frames and exactly 10,000ms.
- First and last decoded frames are identical.
- Decoded fixed lower-counter changes: 0 frames in all three animated outputs.
- 128px, 384px and selected-frame contact-sheet outputs were visually inspected for style continuity, one dough, two connected paws, restrained idle, readable asymmetric press and no whole-stage slide.
- The builder passes Python bytecode compilation.

## Known limitations and next gate

- The cream background remains. Transparency, clean plates, separate ear/hat/arm layers and Unity pivots have not been produced.
- Mesh deformation is only a fast direction proof; final production motion needs separated high-resolution layers or bones derived from an approved clean master.
- Only the viewer-left work beat exists. Opposite-hand work, input mapping, completion behavior and current HTML/runtime integration are intentionally excluded.
- User verdict: “그냥 이미지를 쭉 늘렸다가 되돌린거같아.” This overrides the earlier internal registration and timing checks.
- Do not tune this mesh proof further. The next candidate must use separated high-resolution rigid layers, clean plates and articulated pivots; only the dough and flexible hat crown may use bounded soft deformation.
