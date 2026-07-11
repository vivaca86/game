# Taskbar Cat v2 Asset Provenance

Status: generated prototype for IP-holder review. Shipping approval is not implied.

## Generator

- Mode: OpenAI built-in `imagegen`
- Base generation source: `taskbar-cat-v2-chroma-atlas.png`
- Anatomy-correction source: `taskbar-cat-v2-chroma-corrected-atlas.png`
- Tool-support correction source: `taskbar-cat-v2-chroma-support-corrected-atlas.png`
- Canonical composed source: `taskbar-cat-v2-chroma-final-atlas.png`
- Reference image: `../concept/widget-chef-cat-generated-cook-v31-16.png`
- Reference SHA-256: `3b7dca1f10c849b5fe3c13b7b0863667a7b140af7d31a6b666835c89bd7abeb3`

## Base generation prompt

```text
Use case: stylized-concept
Asset type: production-ready 2D game character animation atlas for a Windows taskbar companion
Input images: Image 1 is a style and character-direction reference only; create a new animation-ready asset rather than copying its faulty frame layout.
Primary request: Create one polished 3-column by 2-row sprite atlas of the same charming cream-and-orange cat chef cooking at a tiny copper soup pot. Six equal cells in this exact order: top-left NEUTRAL with both paws resting; top-center LEFT ACTION with only the cat's left front paw making a small downward cooking tap; top-right RIGHT ACTION with only the cat's right front paw making a small downward cooking tap; bottom-left BLINK with only the eyelids changed; bottom-center HAPPY with only a bright happy facial expression changed; bottom-right DOZE with closed eyes and the head lowered very slightly.
Scene/backdrop: every cell on one perfectly flat uniform solid #FF00FF chroma-key background for local background removal. No shadows, gradients, texture, floor plane, reflections, lighting variation, cell borders, separator lines, labels, captions, or text. Do not use #FF00FF anywhere in the character, clothing, pot, or props.
Subject: one identical compact full-body cat chef in every cell, warm cream fur, small orange ear and forehead markings, white chef toque, rust-red neckerchief, warm brown apron, tiny copper pot centered at the bottom, cozy restaurant-game personality. Keep the pot and both small cooking utensils present and identical in every cell.
Style/medium: premium hand-painted 2D mobile/PC cozy-game character art; clean readable silhouette; softly shaded raster illustration; crisp antialiased edges; richer and more dimensional than a simple flat icon; appealing at 119x112 pixels.
Composition/framing: exact orthographic front view; identical camera, scale, body proportions, silhouette, head position, hat, torso, pot position, ground baseline, center anchor, lighting, palette, outline thickness, and padding in all six cells. Center each character on the same invisible vertical guide and place every pot bottom on the same horizontal baseline. Generous consistent padding around every cell.
Constraints: Only the explicitly named paw, eyelid, expression, or slight head angle may change per cell. The torso and pot must never translate, rotate, scale, squash, stretch, or be redrawn differently. Preserve character identity perfectly across all six cells. No motion streaks, steam, sparkles, loose particles, extra props, extra limbs, extra characters, cropped ears or hat, watermark, logo, or text.
Avoid: frame-to-frame model drift, wobbling body, changing face shape, changing hat size, changing pot width, asymmetric canvas placement, frantic exaggeration, pixel art, 3D render, photorealism, thick black comic outlines.
```

## Anatomy-correction prompt

```text
Use case: precise-object-edit
Asset type: corrected 3x2 game sprite atlas on flat chroma background
Input images: Image 1 is the edit target. Preserve the atlas dimensions, 3x2 layout, character identity, lighting, palette, and every unmentioned pixel as closely as possible.
Primary request: Correct ONLY the anatomy in the TOP-CENTER and TOP-RIGHT cells. Both currently show an extra third forepaw. Each cat must have exactly two forepaws total.
Top-center cell (left-action): replace the original viewer-left forepaw that was gripping the gray spatula with the single downward tapping forepaw already shown near the center-left. Remove the old gripping forepaw completely. Keep the viewer-right forepaw holding the wooden spoon unchanged. The gray spatula may rest securely against the left side of the copper pot, but must not float and must not be held by an extra paw.
Top-right cell (right-action): replace the original viewer-right forepaw that was gripping the wooden spoon with the single downward tapping forepaw already shown near the center-right. Remove the old gripping forepaw completely. Keep the viewer-left forepaw holding the gray spatula unchanged. The wooden spoon may remain resting securely inside the pot, but must not be held by an extra paw.
Hard invariants: do not change the top-left neutral cell or any of the three bottom-row cells. Do not change any face, ears, hat, scarf, coat, torso, tail, feet, copper pot, soup, camera, character scale, cell placement, ground baseline, or solid background. Do not add, remove, resize, shift, rotate, or redraw the body or pot. Keep the perfectly flat uniform solid magenta chroma background with no grid lines, text, labels, shadows, or texture.
Anatomy constraint: exactly two forepaws per cat in every cell; no hidden duplicate grip, no third limb, no floating utensil, no malformed wrist, no extra paw behind a tool.
Constraints: no text, no watermark, no new props, no steam, no particles. Change only the two faulty forepaw/tool grip regions in the top-center and top-right cells.
```

## Tool-support correction prompt

```text
Use case: precise-object-edit
Asset type: final anatomy correction for one cell of a 3x2 game sprite atlas
Input images: Image 1 is the edit target. Preserve the exact 1536x1024 canvas, 3x2 cell layout, character identity, palette, scale, lighting, and flat magenta background.
Primary request: Change ONLY the gray spatula in the TOP-CENTER cell. It currently leans beside the pot without a clear support point and looks as if it floats at 128px. Move that same gray spatula so it is unmistakably resting inside the copper pot behind the viewer-left side of the pot rim: the lower part of its brown handle must be visibly occluded by the copper rim, while the upper handle and gray slotted head emerge diagonally upward to the viewer-left. The rim must clearly overlap the handle and support it.
Hard invariants: keep exactly two forepaws. Keep the tapping viewer-left forepaw and the viewer-right forepaw holding the wooden spoon unchanged. Do not add a grip paw. Do not change the face, hat, ears, scarf, coat, torso, tail, feet, pot shape, soup, character scale, camera, baseline, or placement. Do not change any other atlas cell, including the top-right action cell.
Background: perfectly flat uniform magenta chroma color, no texture, shadow, grid, label, or gradient.
Constraints: no extra limb, no floating utensil, no third paw, no new prop, no steam, no particles, no text, no watermark. Edit only the top-center spatula and the tiny pot-rim occlusion needed to show support.
```

## Deterministic local processing

1. The support-corrected atlas contributes cell 1, the anatomy-corrected atlas contributes cell 2, and cells 0, 3, 4, and 5 are copied byte-for-byte at decoded RGB level from the base generation.
2. The composed source uses a flat magenta key and the official imagegen chroma helper.
3. A two-pixel spatial refinement retains soft matte only next to transparent background, restores false interior partial pixels to the exact generated RGB at alpha 255, and replaces the tiny set of visible key-colored edge pixels with neighboring artwork colors.
4. Each 512×512 cell is registered by integer pixel translation only. No frame is scaled, repainted, blurred, color-reduced, or lossily recompressed.
5. The registered atlas, manifest, 128px dark/light previews, and motion preview are generated reproducibly by project scripts.
