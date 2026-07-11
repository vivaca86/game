# Baker Cat Neutral Master — Provenance

Status: **generated neutral approval candidate; user approval pending**  
Created: 2026-07-10  
Runtime status: **not connected**  
Shipping/IP-holder status: **not approved**

This folder intentionally contains one neutral master only. No left/right, blink, happy, doze, or full-body animation sheet was generated. Further pose work is blocked until the user approves this neutral concept at 128px.

## Reference

- File: `../concept/widget-chef-cat-generated-cook-v31-16.png`
- SHA-256: `3b7dca1f10c849b5fe3c13b7b0863667a7b140af7d31a6b666835c89bd7abeb3`
- Role: style and character-mood reference only
- Explicitly not used as: anatomy, utensil grip, pot, pose, layout, or animation reference

## Generation

- Mode: OpenAI built-in imagegen
- Use case: `stylized-concept`
- Generated source copied into the project as: `baker-cat-neutral-chroma.png`
- Dimensions: 1254 × 1254px
- Chroma-source SHA-256: `a0656f83cc2d6b58435766b6da6b89fe260b70b2d35f2105bf4e2b20b48af92b`

### Exact prompt

```text
Use case: stylized-concept
Asset type: single approved-neutral candidate for a 128px taskbar game character; NOT an animation sheet
Input image: Image 1 is a style and character-mood reference only. Do not copy its multi-frame strip composition, utensil pose, pot, or anatomy. Create exactly one new character, one scene, one frame.

Primary request: Create one premium neutral master illustration of a cute cream-and-orange baker cat calmly preparing bread dough. The action must read immediately as natural bakery work and as a future Bongo-style left/right paw interaction.

Subject: one front-facing chibi cat, waist-up behind a low wooden pastry counter. Warm cream fur with small orange forehead/ear markings, large readable face, white chef toque, clean white double-breasted baker jacket, warm orange neckerchief, and brown waist apron. The cat has exactly two forearms and exactly two large rounded front paws, each visibly connected to one sleeve.

Neutral contact pose: two separate broad matte bread-dough pads sit on the wooden counter, one on the left and one on the right. Each paw rests gently on top of its own dough pad. Preserve a crisp dark contact line or 1–2px-at-128 contact shadow under each paw. Both complete paw silhouettes and both dough outer edges remain readable. The paws must not sink into, merge with, pass through, or float above the dough. The dough is pale flour-dusted beige with a simple soft fold/crease, clearly raw bread dough—not soup, pancake, cookie, drum, bowl, cushion, or plate.

Composition: single centered character only, near-symmetrical neutral pose, large clear face and paws, broad stable silhouette, generous padding, square composition. Keep the wooden counter horizontal and visually rigid. Design for clean reduction to 128×128. No separate frame cells, no labels, no border.

Style/medium: polished high-end soft painterly game illustration with crisp readable edges, warm cozy restaurant-game charm, detailed fur and fabric without tiny noisy texture. Use Image 1 only for overall cute chef-cat appeal and warm palette.

Scene/backdrop: perfectly flat uniform solid #00ff00 chroma-key background for local removal. No gradient, texture, floor plane, backdrop shadow, cast shadow, reflection, glow, or green spill. Do not use #00ff00 in the character, counter, clothing, or dough.

Constraints: exactly one cat; exactly two connected forearms; exactly two paws; exactly two dough pads; fixed neutral pose suitable as a future immutable master. No utensil, spatula, ladle, rolling pin, whisk, pot, pan, bowl, plate, soup, liquid, service bell, food bag, extra prop, extra limb, detached paw, intersecting geometry, text, logo, watermark, panel, or sprite sheet.
```

## Transparency and QA pipeline

1. Official helper, auto border key, soft matte, thresholds 12/220, despill:
   - detected key: `#03f806`
   - output: `baker-cat-neutral-alpha.png`
   - SHA-256: `3a00ad30b8b86dc395cf3c90e296b478027d70d5e6bbd39a9b427ed0dbd92610`
   - result rejected as final because green fringe remained at fur edges
2. Official helper repeated once with the documented `--edge-contract 1` correction:
   - output: `baker-cat-neutral-alpha-edge1.png`
   - SHA-256: `84f11964a34bca21e0f20829fbf6a6468df08a4cbe242eff558615f23abad0f6`
3. Deterministic perceptual green cleanup with `scripts/refine-baker-neutral-alpha.py`:
   - corrected visible green-dominant pixels: 575
   - remaining visible green-dominant pixels under the recorded predicate: 0
   - alpha bytes unchanged from the one-pixel-contracted helper output
   - output: `baker-cat-neutral-alpha-refined.png`
   - SHA-256: `673eb8c12b2c6f0455e4ce0d07200588dd6ff9214caa321365eb604b4f80ebf9`
4. Deterministic previews with `scripts/build-baker-neutral-qa.py`:
   - `qa/baker-cat-neutral-128-light.png` — SHA-256 `f5241ab196a1fefa48f77634a6dfb6368a63eb833cbe2e6df17c6e97f9948237`
   - `qa/baker-cat-neutral-128-dark.png` — SHA-256 `cfbc2a62f5be191a1b51c67ed0eededc6eaee452d33cac8d745725108c8b7907`
   - `qa/baker-cat-neutral-256-checker.png` — SHA-256 `c25ff66e514064ca0a4dac2d28270e5dede015c41f594c51e5044d458328eca1`

Pinned local QA dependency: `Pillow==12.3.0` from `scripts/requirements-imagegen.txt`. It is installed only in a disposable project-local tool directory during validation and is not a game/runtime dependency.

## Approval gate

The following remain blocked until explicit user approval:

- decomposing the master into body, counter, dough, left paw, right paw and face layers;
- creating left/right input reactions;
- replacing the current runtime art;
- creating a Unity atlas, rig or animation clip;
- describing this candidate as production/IP-holder approved.
