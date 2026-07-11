# Chef Cat Two-Hand Transparent Cutout Rig v3

## Status

`Implemented, user review required` — 반대손 교대 주무르기, 눈 깜빡임, 더 큰 양쪽 귀 파닥, 중단 없는 강한 꼬리 살랑을 투명 관절 리그로 구현했다. 현재 HTML/runtime 파일은 변경하지 않았다.

## Authoritative source

- 승인 중립 원화: `../taskbar-cat-living-v1/sources/chef-cat-v9-living-neutral-preview.png`
- SHA-256: `ec112924e2f6c9daa8988e68319ad05ee0c8d615459738a0b89be246c4f03704`
- 전체 피사체 알파: `../taskbar-cat-cutout-rig-v1/sources/chef-cat-v9-alpha-subject-generated-v1.png`
- SHA-256: `c5819b6742ad3de7394f14bb57b461fcb61744a090b798903a0effd12e298b85`

승인 원화의 내부 픽셀이 모든 보이는 고양이 파츠의 기준이다. 새 생성 결과 전체를 애니메이션 프레임으로 사용하지 않았다.

## Built-in image edits

### Both-arms-removed hidden clean plate

- Chroma source: `sources/chef-cat-v9-clean-base-both-arms-chroma-v1.png`
- SHA-256: `4c106af37f6992c8b6ae0ca6c5832ad95accc3895a1cf8b0c2b7fc33da52ee5b`
- Alpha result: `sources/chef-cat-v9-clean-base-both-arms-alpha-v1.png`
- SHA-256: `c0c338eb6d90e0144ef5de4b1322b51fc34508fc6aaca560d26baea359315394`

Prompt:

```text
Use case: precise object removal for a 2D cutout-rig hidden clean plate.

Image 1 is the exact edit target. It already has a flat vivid green background, no head, and no viewer-left working arm. Remove ONLY the remaining viewer-right sleeve, forearm, and front paw—the image-right paw currently resting on the dough. Reconstruct only the small areas of white double-breasted chef coat and the single existing dough loaf that were hidden behind that arm. Preserve the existing illustration style, line weight, warm shading, body geometry, red scarf, buttons, pouch, tail, one-piece dough, scale, crop, and flat green background exactly. Keep the head absent and keep the viewer-left arm absent. Do not add any head, arm, paw, tool, text, extra dough, counter, or new object. Final clean plate must show zero front paws and zero front sleeves, with the same single dough loaf.
```

The chroma source was converted with the installed imagegen `remove_chroma_key.py` helper using border auto-key, soft matte, thresholds `12/220`, and despill. Generated RGB is used only inside the removed viewer-right-arm footprint and its narrow antialias cleanup band.

### Open-eye source

- Source: `sources/chef-cat-v9-open-eyes-v1.png`
- SHA-256: `6d0c3ae11f48b2469a141234f7e9237161edebabd4bf8973441b1f9a3134759b`

Prompt:

```text
Use case: precise facial-state edit for a 2D cutout animation.

Image 1 is the exact edit target. Change ONLY the two short black horizontal eye lines into two very small, simple, calm, dark-brown open oval/dot eyes at the same centers and spacing. The open eyes must match the cute flat illustrated style: tiny solid ovals, understated, no iris detail, no large glossy anime eyes, no highlights, no eyelashes, and no changed eyebrows or expression. Preserve every other part exactly: head silhouette, cheeks, muzzle, mouth, ears, hat, body, scarf, coat, paws, single dough, background, counter, scale, crop, colors, line weight, and geometry. Do not alter anything outside the two tiny eye areas.
```

Only two feathered eye patches are retained. At blink time those patches are hidden, revealing the approved neutral's original short closed-eye lines beneath them.

## Rig and motion

- Builder: `scripts/build_transparent_cutout_rig_v3.py`
- Dependency pins: `scripts/requirements-cutout-rig.txt`
- Moving RGBA layers: head core, left/right ear, hat crown, left upper arm, left forearm/paw, right upper arm, right forearm/paw, tail, open-eye patches.
- Cat mesh-deformation layers: none.
- Viewer-left knead: `1.30s`, duration `0.94s`.
- Viewer-right knead: `3.22s`, duration `0.94s`.
- Blink windows: `2.50–2.68s`, `5.22–5.38s`.
- Ear flap: each side uses an `8°` main flap plus a `4.2°` rebound rather than a single one-way turn.
- Tail: continuous 3-second sine sway, `±13°`, pivot `(345, 910)`, rendered behind the pouch/body.
- Loop: 6 seconds, 72 frames, average 12fps. Frame zero and the 6-second endpoint are identical.

## Outputs

- `chef-cat-transparent-neutral-open-eyes.png` — high-resolution transparent neutral.
- `chef-cat-transparent-motion-128.webp` — main taskbar-size lossless animated WebP.
- `qa/chef-cat-transparent-motion-384.webp` — enlarged lossless transparent review.
- `qa/chef-cat-transparent-motion-128.png` — transparent 128px APNG.
- `qa/chef-cat-checker-motion-384.gif` — moving checker-background review.
- `qa/transparent-motion-contact-sheet.png` — neutral, ears, both kneads, blink, and tail extremes.
- `qa/neutral-light-dark-checker.png` — transparent-edge QA.
- `transparent-rig-manifest.json` — hashes, timing, pivots, and measured gates.

## Verification

- WebP RIFF/`ANMF` headers, APNG metadata, and GIF metadata each report `72` frames and exactly `6,000ms`: 48 frames × 80ms plus 24 frames × 90ms.
- First and last decoded RGBA frames are identical in every output.
- Transparent corner alpha: `0, 0, 0, 0`.
- Maximum visible green-dominant pixels at source and 128px output: `0`.
- Fixed lower-dough root `(350,1090)–(1010,1140)`: maximum changed pixels `0`.
- Viewer-right upper arm, forearm/paw, both ears, and tail each have exactly one visible connected alpha component after final cleanup.
- Blink changes `442` pixels in the 128px eye review region and remains readable as dot eyes → original line eyes → dot eyes.
- Tail amplitude increased from v2 `±4.2°` to v3 `±13°`; documented geometric peak-to-peak tip travel is approximately `4.89px` at 128px.
- Final 128px animation and 384px checker animation were visually inspected for one dough, exactly two sleeve-connected paws, arm/ear seams, stable body/root, readable blink, continuous tail motion, and absence of full-image stretching.

## Failure handling

1. A recorded checker preview filename did not match the actual v2 path. The folder was enumerated and the real `qa/chef-cat-checker-motion-384.gif` path was used; the wrong filename was not retried.
2. The first v3 tail amplitude (`±10°`) still read weak at taskbar size. Because the pivot is hidden behind the pouch, it was safely increased to `±13°` and re-reviewed as motion.
3. The first right-upper-arm delta mask contained several detached 1–56 pixel antialias components. The builder now keeps only the largest connected anatomical component before rendering.
4. Pillow does not expose per-frame WebP durations through normal frame metadata. A first validator therefore falsely inferred `6.48s` by repeating the last frame duration. Validation was corrected to parse WebP `ANMF` duration bytes directly, proving the file is exactly `6.00s`.

## Remaining limitations

- No current HTML/runtime or Unity import was changed.
- User continuous-motion approval remains the final acceptance gate for these timings and amplitudes.
- The generated clean plate and open-eye edit are rig support sources, not independently approved production frames.
