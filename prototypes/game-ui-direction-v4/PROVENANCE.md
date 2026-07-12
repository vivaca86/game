# Game UI Direction v4 — Provenance

- Date: 2026-07-12
- Purpose: actual-size concept and composition approval before another runtime implementation
- Status: direction A selected by user and connected to prototype runtime; not production approved
- Target desktop: 1280×720
- Target management window: 790–910×480–520

## Source classifications

- `assets/concept/full-v9.png`: rough high-resolution concept/reference; used for palette, finish, resource-strip crops, and overall art-language comparison.
- `assets/concept/restaurant-room-v9.png`: rough concept/reference; used in direction B and for its illustrated navigation strip.
- `assets/concept/restaurant-scene-v9.png`: rough concept/reference; used in direction A.
- `assets/concept/recipe-panel-v9.png`: rough concept/reference; used only in direction A to test a compact single-panel composition.
- `assets/concept/production-strip-v9.png` and `route-map-v9.png`: rough concept/reference; used only in direction C.
- `assets/taskbar-cat-cutout-rig-v4/chef-cat-transparent-neutral-open-eyes.png`: current approved-direction character derivative; used as the character anchor in direction C and the desktop companion preview.

## Constraints

- Rejected `assets/menu-v1/**` runtime derivatives are not used.
- No new generated art, paid API, external asset, or copied UI kit is used.
- These mockups deliberately reuse source/reference pixels to decide composition and art direction. Approval does not automatically promote the rough source crops to production assets.
- Runtime code and `taskbar-cat-hero-single.html` are unchanged by this mockup pass.

## Directions

1. **A · 작은 식당 경영** — one restaurant scene plus one content panel; closest to traditional mobile management games.
2. **B · 식당 장면 중심** — the room is the main interaction surface; smallest amount of visible interface chrome.
3. **C · 고양이 카운터** — the approved cat is the focal point; production and route information remain secondary.

User selection: **A**. The prior B recommendation is retired because its mockup fidelity was too low to support a fair quality judgment. Runtime integration must follow A only unless the user explicitly reopens direction selection.
