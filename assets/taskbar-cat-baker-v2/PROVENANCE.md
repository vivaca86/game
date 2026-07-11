# One-Dough Baker Cat v2 — Provenance and QA

Status: **generated runtime prototype; user continuous-play and IP-holder approval required**  
Created: 2026-07-10  
Runtime target: 128 × 128px taskbar character  
Shipping status: **not production-approved**

## User direction and production boundary

The user asked to replace the two dough pads with one connected dough and to apply the movement. The accepted production boundary for this pass was:

- one immutable one-dough neutral master;
- localized viewer-left paw/dough, viewer-right paw/dough, and eye-only blink edits;
- no utensil, pot, liquid, bell, rolling pin, detached prop, or generated six-frame full-body sheet;
- no whole-body runtime loop or transform animation;
- completion remains an indicator and does not stop input reactions;
- retain 1254px transparent masters and derive a Unity-friendly 2 × 2 runtime atlas.

## Reference chain

- Initial edit target: `../taskbar-cat-baker-v1/baker-cat-neutral-chroma.png`
- Initial edit target SHA-256: `a0656f83cc2d6b58435766b6da6b89fe260b70b2d35f2105bf4e2b20b48af92b`
- Role: approved direction source for the same cat, clothing, camera, lighting, counter, and contact layout. Its two dough pads were explicitly replaced.
- The resulting `baker-cat-one-dough-neutral-chroma.png` became the only image input for the left, right, and blink edit requests.
- Mode: OpenAI built-in image generation, `precise-object-edit`. No external paid API or plugin was used.

## Exact generation prompts

The following are the exact prompts submitted to the built-in image editor and echoed as its revised prompts.

### One-dough neutral

```text
Use case: precise-object-edit
Asset type: one-dough neutral master for a 128px taskbar game character
Input image: Image 1 is the only edit target.

Primary request: Change only the bread dough arrangement in the lower part of Image 1. Replace the two separate round dough pads with exactly ONE single, continuous, wide raw bread-dough mass centered on the wooden counter beneath both paws. Both existing paws must rest naturally on two separated contact areas of the same connected dough.

One-dough geometry: one broad low oval/soft rectangular mound, roughly spanning from below the left paw to below the right paw with an unbroken center bridge. The center must clearly be filled with the same dough—no gap, seam, duplicate piece, plate, bowl, or two-lobed split that could read as two doughs. Use one coherent flour-dusted beige surface with a few restrained kneading folds. It must read as one large bread dough prepared by two paws.

Contact constraints: keep exactly the original two paws and two forearms, each connected to its original sleeve. Preserve clear contact shadows/occlusion under both paws. No paw may float, sink, merge, pass through, or be redrawn with extra toes. Both paws sit on the same dough, left paw on its left area and right paw on its right area.

Critical invariants: preserve the cat's identity, face, expression, chef hat, ears, whiskers, fur, orange markings, neckerchief, jacket, buttons, apron, forearms, paws, body proportions, centered composition, wooden counter, lighting, painting style, image dimensions, and flat green background as closely as possible. Do not change anything above or beside the dough area.

Backdrop: keep the perfectly flat uniform solid green chroma-key background with no gradient, shadow, reflection, text, or watermark.

Avoid: second dough; gap through the dough center; two buns; two pads; bowl; plate; pot; liquid; service bell; utensil; rolling pin; extra prop; extra limb; detached paw; intersecting geometry; altered face; altered pose; animation sheet; panels.
```

### Viewer-left press

```text
Use case: precise-object-edit
Asset type: localized left-paw kneading reaction source for a 128px taskbar character
Input image: Image 1 is the only edit target.

Primary request: Create the LEFT kneading reaction by changing only the viewer-left lower forearm/paw and the small area of the same single dough directly beneath it. Lower the viewer-left paw a subtle amount, about 3–4 pixels at final 128px display scale, as it gently presses the left side of the one continuous dough. Slightly compress only the contacted left dough surface while keeping the dough one connected mass.

Contact and anatomy: exactly two forearms and two paws remain. The viewer-left paw stays visibly attached to its original sleeve and presses into the top surface with a clear contact shadow/occlusion; it must not float, detach, merge, gain toes, or pass through the dough or counter. The viewer-right forearm, paw, and right dough area remain in the exact neutral pose.

Critical invariants: keep the entire face, eyes, expression, head, hat, ears, whiskers, fur, scarf, jacket, buttons, apron, torso, viewer-right arm/paw, overall one-dough outline, wooden counter, lighting, camera, scale, centered composition, image dimensions, painting style, and flat green background visually unchanged. Do not redraw the whole character.

Backdrop: preserve the flat solid green chroma background with no gradient, shadow, text, watermark, or panels.

Avoid: second dough; split dough; whole-body movement; changed head or expression; changed right paw; extra limb; extra toe; detached paw; deep hand penetration; liquid; tool; prop; frame sheet.
```

### Viewer-right press

```text
Use case: precise-object-edit
Asset type: localized right-paw kneading reaction source for a 128px taskbar character
Input image: Image 1 is the only edit target.

Primary request: Create the RIGHT kneading reaction by changing only the viewer-right lower forearm/paw and the small area of the same single dough directly beneath it. Lower the viewer-right paw a subtle amount, about 3–4 pixels at final 128px display scale, as it gently presses the right side of the one continuous dough. Slightly compress only the contacted right dough surface while keeping the dough one connected mass.

Contact and anatomy: exactly two forearms and two paws remain. The viewer-right paw stays visibly attached to its original sleeve and presses into the top surface with a clear contact shadow/occlusion; it must not float, detach, merge, gain toes, or pass through the dough or counter. The viewer-left forearm, paw, and left dough area remain in the exact neutral pose.

Critical invariants: keep the entire face, eyes, expression, head, hat, ears, whiskers, fur, scarf, jacket, buttons, apron, torso, viewer-left arm/paw, overall one-dough outline, wooden counter, lighting, camera, scale, centered composition, image dimensions, painting style, and flat green background visually unchanged. Do not redraw the whole character.

Backdrop: preserve the flat solid green chroma background with no gradient, shadow, text, watermark, or panels.

Avoid: second dough; split dough; whole-body movement; changed head or expression; changed left paw; extra limb; extra toe; detached paw; deep hand penetration; liquid; tool; prop; frame sheet.
```

### Blink

```text
Use case: precise-object-edit
Asset type: localized blink source for a 128px taskbar character
Input image: Image 1 is the only edit target.

Primary request: Change only the two open eyes into a gentle natural blink. Both eyes are softly closed as two short warm-brown curved lines with the same placement, spacing, and expression. Keep the mouth and cheeks calm and unchanged.

Critical invariants: preserve every other part of Image 1 visually unchanged—cat identity, head shape, hat, ears, whiskers, orange markings, nose, mouth, scarf, jacket, buttons, apron, torso, both forearms and paws, the one continuous dough, contact shadows, wooden counter, lighting, camera, scale, centered composition, image dimensions, painting style, and flat green chroma background. Do not redraw the body or lower scene.

Backdrop: preserve the flat solid green chroma background with no gradient, shadow, text, watermark, or panels.

Avoid: changed mouth; changed paws; changed dough; extra eyelids or eyes; asymmetrical eye placement; sleep symbols; tears; tools; props; whole-body motion; animation sheet.
```

## Source and derivative hashes

| State | Chroma SHA-256 | Edge-contracted alpha SHA-256 | Refined alpha SHA-256 |
|---|---|---|---|
| neutral | `974e11b766f7cc4562c174ebf5c3056a00a75a41c9bc040fd4995ad32b4b8867` | `295af105b2b4cd151b838a2ce78c9323f1327ba434b6e6e00de4b6eec8772965` | `0552ce49c004dbbcb4dd97fd87732916b909ad9ec108301949addc389ce97d4d` |
| key-left source | `a605dbba30f51cea3752af94789fabfcab88a02ddf2eaac564a1fe8a1dcc7219` | `352fd99e47fbea006612e7d397783eaef78a59e2531042d96818bcf02007834a` | `53f433d636ab8a40b10d4d1bfe88e7f621dc50b9579eea984ff6621b9729bc32` |
| key-right source | `f4d39559f682ed65bb751ec85a7c334f845570b546f2994fa460c083c96c8f94` | `94890b30f7dcfe88c337f398df14c8d6814f55a9634792f0ae3b765bd88fd9e1` | `b0c31f3b45745691db9bdfa9d46f37756076e398d08bc6e9a876d2d2c61f8186` |
| blink source | `34d98e0a5fb99c4b0d5db401c133955c81a8cd6c5859208ba12040a88277af0e` | `d6ef6ff2c81a9878713a62e655af6219fb3e6eab1627c16d65382a7d56a46c47` | `c81f179e7759e8f211361b36c05e97977d626480f5047f12e18d37ccdc89d7cd` |

All source and full-frame masters are 1254 × 1254px. The original generated variants redraw more than their requested local region, so no complete variant became a runtime frame. `scripts/build-taskbar-cat-baker-v2-atlas.py` starts from the neutral master and copies only fixed feathered masks after registration offsets `(0,-1)`, `(0,-2)`, and `(0,-1)` for left, right, and blink.

## Transparency, correction, and failure record

1. The imagegen chroma helper ran with border auto-key, soft matte, transparent/opaque thresholds `12/220`, despill, and one-pixel edge contraction.
2. `scripts/refine-baker-motion-sources.py` preserves the helper alpha bytes and checks only genuinely green-dominant visible pixels (`G > R + 20`, `G > B + 35`). Final count is 0 in every source.
3. An earlier average-channel predicate incorrectly classified warm gold/tan antialiasing as green and replaced 326–473 pixels per source. That output was rejected and regenerated deterministically from the edge-contracted inputs. It is not the recorded final source.
4. Straight-alpha feather composition was rejected before artifact writing because hidden chroma RGB could leak through the mask edge. The verified builder uses premultiplied-alpha composition.
5. Runtime and preview downscaling also use premultiplied-alpha Lanczos so transparent RGB cannot bleed into displayed edges.

Pinned QA-only dependency: `Pillow==12.3.0` from `scripts/requirements-imagegen.txt`. It is installed only in a disposable project-local path during verification and is not a browser or game dependency.

## Runtime atlas and internal QA

- Atlas: `taskbar-cat-baker-v2-atlas.png`
- SHA-256: `a651b8e1295d127355e6214b50ba4ad6157a3018636f335a2d5b5a3651cc4ce6`
- Layout: 1024 × 1024px, 2 × 2 grid, 512 × 512px cells
- Frame order: `neutral`, `key-left`, `key-right`, `blink`
- Display: 128 × 128px; retained master-to-display ratio is approximately 9.8×
- Common runtime alpha bounds: `[0,17,512,512]`
- Baseline range: `0px`
- Lower-body center spread at display size: `0.5183855354px`
- Changed pixels outside declared full-resolution masks: `0`
- Visible green-dominant pixels: `0`
- Body loop: disabled
- Light preview SHA-256: `a6f8e40533156fe06206218dc5db6621c15835882a13b3357ac34783ae881d20`
- Dark preview SHA-256: `653625839e36d2d854d72677f4af8de30fe2845a9f21cc49cececee2c3306ea6`
- Motion GIF SHA-256: `5aa8fe7fafd6ddbd82587d85fd091baa79feae59a7a035260a64ac06a320809c`

The 128px light/dark sheets and full-resolution masked states were visually inspected internally and by a separate design-review agent. The independent review returned `APPROVE`: all four states read as one connected dough; exactly two sleeve-connected paws retain contact shadows; no gap, floating, penetration, mask seam or unintended face/body/counter change was visible; left/right pressing remained distinct and local at 128px. This is internal/agent QA, not the user's continuous-play approval.

### 2026-07-10 fast game-feel runtime pass

No bitmap, atlas cell, mask, crop, registration offset, or high-resolution master changed. The feel prototype lengthened each registered press to `165ms`, slowed the eye-only blink to `170ms` every `6.5–11s`, and added one finite autonomous alternating press every `3.8–5.8s` while the 30-second dough order is running. Keyboard, click and wheel pulses use one coalesced alternating press and never change production time or rewards. The always-visible order ticket carries progress and completion; it does not move or redraw the cat. These timing and UI choices remain pending actual continuous-play user acceptance.

## Unity import

Use `taskbar-cat-baker-v2-manifest.json` as the import record: Sprite (2D and UI), Multiple, 2 × 2 grid, 512px cells, Full Rect, Bilinear, Compression None, mipmaps off, atlas rotation/tight packing off, normalized bottom-center pivot `(0.5,0.0)`. Preserve the 1254px full masters for any later layer extraction or higher-resolution IP-holder presentation.

## Remaining approval gate

The browser-control policy did not permit controlling the user's current local `file:` tab or substituting localhost. Automated checks and the generated motion GIF therefore do not establish actual in-page continuous playback. Status remains `Implemented, not verified` until the user reloads the standalone file and accepts typing, click/wheel, drag, completion-state motion, and final-size visual continuity. IP-holder and Steam shipping approval remain separate future gates.
