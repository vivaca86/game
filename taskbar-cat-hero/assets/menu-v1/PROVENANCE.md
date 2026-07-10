# Menu v1 asset provenance

Status: generated prototype assets for user review; not production/IP-holder approved.

## Visual direction

- Style anchor: `assets/taskbar-cat-cutout-rig-v4/chef-cat-transparent-neutral-open-eyes.png`.
- Reference-only composition sources: the prior `assets/concept/*-v9.png` menu art.
- Public research references checked on 2026-07-10: official/app-store descriptions and screenshots for `두근두근 레스토랑` and `에브리타운`. They were used to identify cozy restaurant-management composition, watercolor-like farm warmth, readable item cards, and production-location structure. Runtime pixels were generated anew; no downloaded third-party screenshot is shipped here.
- Required rendering language: warm cream/peach/honey-wood/leaf-green palette, clean dark-brown outline, compact rounded chibi forms, gentle cel shading, strong 28–64px readability.

## Public reference URLs checked

Acquisition/review date: 2026-07-10. Classification: `reference` only; none of these remote images are bundled in the project.

| Referenced IP | URL | What was studied |
|---|---|---|
| 두근두근 레스토랑 | `https://game.kakao.com/games/Bg0pMpv8` | cozy restaurant composition, recipe-card hierarchy, fairy-tale warmth |
| 두근두근 레스토랑 | `https://apps.apple.com/lk/app/%EB%91%90%EA%B7%BC%EB%91%90%EA%B7%BC-%EB%A0%88%EC%8A%A4%ED%86%A0%EB%9E%91/id770317890` | official feature framing for recipes, decorating, staff and pets |
| 에브리타운 | `https://play.google.com/store/apps/details?hl=ko&id=kr.co.feverstudio.apps.everytown` | official farm/town production framing and warm hand-drawn building language |
| 에브리타운 | `https://game.kakao.com/games/pM0oamQV` | cozy farm-management structure and town progression |

## Generated masters

| Master | Type | Intended use |
|---|---|---|
| `restaurant-scene-master.png` | generated | main restaurant scene |
| `production-strip-master.png` | generated | five crop-safe production locations |
| `dispatch-map-master.png` | generated | four-stop route background |
| `party-portraits-master.png` | generated | four crop-safe cat portraits |
| `object-icons-master.png` | generated | 5×4 ordered item icon atlas |

The complete prompts were submitted through the built-in image generator in the 2026-07-10 project task. Source SHA-256 values are pinned in `scripts/build-menu-v1-assets.py` and `menu-assets-manifest.json`.

## Derived assets and Unity handoff

- `scripts/build-menu-v1-assets.py --write` performs deterministic crops only; it does not repaint masters.
- Runtime PNGs are prototype derivatives. Unity should import the high-resolution masters and reproduce crop rectangles in a `SpriteAtlas` so card-size web crops do not become the production-resolution ceiling.
- `ui-symbols.svg` and `recipe-paper.svg` are project-native vector assets, not generated from third-party artwork. Rasterize them at the target Unity scale if SVG import is not part of the production pipeline.
- QA contact sheet: `qa/menu-v1-final-size-contact-sheet.png`.

## Generation and edit history

1. Generated a new restaurant scene from the taskbar chef-cat style anchor plus the old scene as composition-only reference.
2. Generated a new five-cell production strip with explicit cream gutters and no UI/text.
3. Generated a new four-stop dispatch map with empty node clearings and no UI/text.
4. Generated a new 2×2 party portrait atlas using the taskbar cat as the strict character-style anchor.
5. Generated a new 5×4 object atlas in an exact declared row-major order; the first result preserved the requested grid and was accepted for deterministic cropping.
6. Added project-native vector UI symbols and a low-contrast recipe-panel background to eliminate remaining emoji/old screenshot dependencies.
