# Management v4 Prototype Runtime Assets

- Date: 2026-07-12
- Direction: user-selected `A · 작은 식당 경영`
- Status: prototype runtime candidate; not production approved
- Builder: `scripts/build-management-v4-assets.py`
- Manifest: `management-v4-manifest.json`

## Source policy

All visible v4 UI art is deterministically cropped from the coherent high-resolution v9 concept family. The original files remain unchanged. The outputs are allowed for the selected prototype direction but remain classified as prototype/reference derivatives until the user accepts the real runtime composition.

- Restaurant scene: `assets/concept/restaurant-scene-v9.png`
- Recipe and ingredient art: `assets/concept/recipe-panel-v9.png`; the cake uses the cake thought-bubble crop from `restaurant-room-v9.png` because the recipe panel's third card is a hot-pot dish, not cake.
- Illustrated lower actions: `assets/concept/restaurant-room-v9.png`
- Resource symbols: `assets/concept/full-v9.png`

Rejected `assets/menu-v1/**` runtime derivatives, thin code SVG icons, external assets, paid generation, and copied UI kits are not used.

## Runtime contract

- Target window: 910×520 at 1280×720.
- One scene, one recipe panel, one primary cook action.
- Three lower actions: kitchen, decorate, farm.
- Assets keep their source-family cream matte and thick brown outline; receiving surfaces must use the same cream/outline palette so no pasted rectangular mismatch is visible.
- The browser prototype must map these bitmap roles to Unity Sprite/9-slice assets later without degrading the source masters.
