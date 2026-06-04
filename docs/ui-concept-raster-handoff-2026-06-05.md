# UI Concept Raster Handoff - 2026-06-05

Status: Partially complete. Do not call this UI work complete.

Current working estimate: about 58% of the active UI concept-quality goal.

Active user goal:

```text
Build the game UI to match the concept art and keep improving until it reaches similar quality.
```

Why this handoff exists:

- The user ended today's work and asked for the current unfinished state to be saved to GitHub.
- The user explicitly wants the next worker to continue without losing context.
- This document is intentionally detailed. Do not compress it into a vague summary when continuing.

## User Direction

The user objected strongly to vector/procedural-looking UI and asked why concept art was made if the runtime UI did not match it. The correct direction is:

- Use raster concept art and concept-derived bitmap state assets.
- Do not solve visual UI with Phaser rectangles, strokes, generic vector shapes, or procedural placeholder art on concept screens.
- Treat current work as unfinished until the user accepts the quality.
- Do not claim 95%, final UI skin, release readiness, or completion.

## Current Completion Read

Approximate current state:

- Overall active goal: about 55-60%, roughly 58%.
- Static first-view concept matching: about 70-75%.
- Interaction states: about 45-50%.
- Dynamic state truth, especially WorldMap completed/current/locked variants: about 40%.
- Final polish/user acceptance: still missing.

This is not a formal metric and must not be used as a completion claim.

## High-Level Work Completed

The runtime UI has been moved away from the older paper-theater/vector/procedural look toward full-screen raster concept-underlay screens.

Primary raster underlays now exist for:

- Combat
- Boss
- Reward
- Event
- Town
- WorldMap
- Dungeon
- RuneBench
- Result
- Settings

Important source/runtime files:

- `assets/concepts/ui/`
- `assets/source/ui/*_raster_underlay_concept_v001.png`
- `public/assets/runtime/ui/*_raster_underlay_concept_v001.png`
- `src/data/assetManifest.slice.v1.json`
- `docs/asset-manifest.slice.v1.json`
- `src/data/releaseCatalogAdapter.ts`
- `tools/generate-dev-runtime-assets.mjs`

## Screen Work Summary

### Combat

Current state:

- Uses `combat_raster_underlay_concept`.
- Uses raster player/enemy standees and raster starter card art.
- Runtime overlays are reduced and placed into concept-safe zones.
- Card/end-turn controls use bitmap hover/down state paths.
- Concept-source-derived attack/mark effects were reintroduced as sprite-only overlays.

Key files:

- `src/phaser/scenes/CombatScene.ts`
- `assets/source/ui/combat_raster_underlay_concept_v001.png`
- `assets/source/cards/card_art_sun_jab_raster_v001.png`
- `assets/source/cards/card_art_fold_guard_raster_v001.png`
- `assets/source/cards/card_art_page_step_raster_v001.png`
- `assets/source/characters/char_mina_pagehand_sprite_raster_v001.png`
- `assets/source/monsters/monster_folded_sentry_sprite_raster_v001.png`

Still unfinished:

- Final multi-card/card-art coverage.
- Full combat state readability without relying on text overlays.
- Effect timing and target-specific placement.
- User acceptance.

### Boss

Current state:

- Uses `boss_raster_underlay_concept`.
- Uses raster card state and concept-source-derived boss stage/starburst effect.
- Old shield-like boss phase cue was replaced with a warmer component-sheet starburst.

Key files:

- `src/phaser/scenes/BossScene.ts`
- `assets/source/ui/boss_raster_underlay_concept_v001.png`
- `assets/source/effects/effect_stage_spotlight_concept_v001.png`

Still unfinished:

- Final boss phase communication.
- Final boss VFX timing.
- More specific selected/focus/disabled states.
- User acceptance.

### Reward / Event

Current state:

- Both use full raster underlays.
- Choice cards have concept-derived bitmap hover badges.
- Event unaffordable choice has first bitmap disabled lock candidate.
- Choice badge axis was corrected so hover/down/disabled art sits closer to baked card headers.

Key files:

- `src/phaser/scenes/RewardScene.ts`
- `src/phaser/scenes/EventScene.ts`
- `assets/source/ui/reward_raster_underlay_concept_v001.png`
- `assets/source/ui/event_raster_underlay_concept_v001.png`
- `assets/source/ui/ui_hover_choice_badge_concept_v001.png`
- `assets/source/ui/ui_disabled_lock_stamp_concept_v001.png`

Still unfinished:

- Broad disabled coverage across all scenes.
- Final selected/focus states.
- Dynamic label/accessibility strategy.
- User acceptance.

### Town / RuneBench / Result / Settings

Current state:

- All use raster concept underlays.
- Representative action/settings controls use concept-derived bitmap hover art.
- Settings has hover coverage for ten major controls.
- All ten primary raster screens share first bitmap down-state candidate.

Key files:

- `src/phaser/scenes/TownScene.ts`
- `src/phaser/scenes/RuneBenchScene.ts`
- `src/phaser/scenes/ResultScene.ts`
- `src/phaser/scenes/SettingsScene.ts`
- `assets/source/ui/town_raster_underlay_concept_v001.png`
- `assets/source/ui/rune_bench_raster_underlay_concept_v001.png`
- `assets/source/ui/result_raster_underlay_concept_v001.png`
- `assets/source/ui/settings_raster_underlay_concept_v001.png`
- `assets/source/ui/ui_hover_action_seal_concept_v001.png`
- `assets/source/ui/ui_down_pressed_stamp_concept_v001.png`

Still unfinished:

- Per-control selected/focus/disabled/down states.
- Dynamic labels and tooltips that do not hurt the concept-art look.
- User acceptance.

## WorldMap Current State

WorldMap has received the most recent focus because it still visibly mismatched the concept-art state language.

Current changes:

- `WorldMapScene` uses `world_map_raster_underlay_concept`.
- The old hidden center confirm hit target at `1010,512` was removed.
- The primary action is now the visible bottom-right play button at about `1576,970`.
- Play button hover/down art is cropped from the WorldMap concept itself:
  - `ui_hover_world_map_play_button_concept`
  - `ui_down_world_map_play_button_concept`
- The runtime underlay is regenerated from the original concept art but neutralizes strong baked green/cyan progress colors.
- The original concept image remains unchanged at `assets/concepts/ui/world_map_ui_concept_v001.png`.
- Current stage runtime state now has:
  - `ui_current_stage_marker_concept`
  - `ui_current_stage_halo_concept`
  - `ui_current_stage_status_badge_concept`
- The default current stage verified by audit is `stage_lantern_foyer`.

Key files:

- `src/phaser/scenes/WorldMapScene.ts`
- `tools/extract-ui-state-assets.mjs`
- `tools/generate-dev-runtime-assets.mjs`
- `tmp/ui-worldmap-action-hit-target-audit.mjs`
- `assets/source/ui/world_map_raster_underlay_concept_v001.png`
- `assets/source/ui/ui_hover_world_map_play_button_concept_v001.png`
- `assets/source/ui/ui_down_world_map_play_button_concept_v001.png`
- `assets/source/ui/ui_current_stage_marker_concept_v001.png`
- `assets/source/ui/ui_current_stage_halo_concept_v001.png`
- `assets/source/ui/ui_current_stage_status_badge_concept_v001.png`

Latest WorldMap screenshot:

- `tmp/ui-quality/worldmap/worldmap-play-button-action-hover-v1-1920.png`

Latest WorldMap audit result included:

- `currentStageId=stage_lantern_foyer`
- `visibleCurrentMarkerImages=1`
- `markerAtCurrentStage=true`
- `visibleCurrentHaloImages=1`
- `haloAtCurrentStage=true`
- `visibleCurrentStatusImages=1`
- `statusAtCurrentStage=true`
- `visibleTextCount=0`
- `visibleRectsAboveUnderlay=0`
- neutralized samples:
  - `node1check=[111,97,80]`
  - `node2check=[108,94,78]`
  - `node3check=[116,101,84]`
  - `stage4diamond=[109,95,79]`

WorldMap still unfinished:

- The map is not fully recomposed into dynamic current/completed/locked state variants.
- Baked route/node geometry remains.
- Completed stage nodes still mostly rely on neutralized baked underlay, not proper runtime completed art.
- Locked stage nodes still rely on baked art, not a full runtime locked-state system.
- Keyboard focus state is not concept-quality.
- Dynamic labels/accessibility-safe tooltips are unresolved.
- Mobile/responsive review is not final.
- No user acceptance yet.

Recommended next WorldMap work:

1. Add concept-derived completed-stage raster overlay for completed nodes.
2. Add concept-derived locked-stage raster overlay for locked/next-locked nodes.
3. Update `WorldMapScene` to render current/completed/locked overlays from runtime save/profile state.
4. Extend `tmp/ui-worldmap-action-hit-target-audit.mjs` to verify completed and locked overlays at correct nodes.
5. Capture 1920 screenshot and inspect visually before claiming improvement.

## Shared Raster Interaction System

Important helper:

- `src/phaser/view/sceneShell.ts`

Current helpers include:

- `renderTransparentHitTarget`
- `renderRasterHoverHitTarget`
- `renderRasterDisabledHitTarget`

The important behavior:

- Concept-underlay paths should not draw Phaser text/rectangles/strokes above the underlay unless deliberately reviewed.
- Hover shows bitmap state art.
- Pointer down shows bitmap down state.
- Actions fire on `pointerup` so the down state can be captured and verified.

Do not regress this back to visible vector rectangles.

## Asset Extraction

Important script:

- `tools/extract-ui-state-assets.mjs`

It extracts/crops/masks concept-derived assets from:

- `assets/concepts/ui/ui_component_sheet_concept_v001.png`
- `assets/concepts/ui/world_map_ui_concept_v001.png`
- selected raster card/source art

Then run:

```powershell
npm.cmd run assets:generate:dev
```

This copies source passthrough assets into runtime paths.

## Verification Already Run

The following passed after the WorldMap current-status-badge pass:

```powershell
node tools/extract-ui-state-assets.mjs
npm.cmd run assets:generate:dev
node tmp/ui-worldmap-action-hit-target-audit.mjs
npm.cmd run check
git diff --check
node tmp/ui-raster-hover-audit.mjs
node tmp/ui-raster-down-audit.mjs
node tmp/run-phaser-smoke-with-vite.mjs
```

`node tmp/run-phaser-smoke-with-vite.mjs` returned:

```text
Phaser smoke OK
```

Known warning:

- `npm.cmd run check` still emits the existing Vite large JS chunk warning.
- Treat performance as `Needs verification`; this warning is not newly introduced by the final WorldMap badge pass.

Important timing:

- `node tmp/run-phaser-smoke-with-vite.mjs` can take about 180-190 seconds.
- Use a timeout of at least 420000 ms.

## Temporary Audit Scripts

There are temporary audit scripts under `tmp/` that are important for continuation even though they are not all tracked by git unless staged.

Known useful scripts:

- `tmp/ui-worldmap-action-hit-target-audit.mjs`
- `tmp/ui-raster-hover-audit.mjs`
- `tmp/ui-raster-down-audit.mjs`
- `tmp/raster-effect-concept-audit.mjs`
- `tmp/ui-disabled-raster-audit.mjs`
- `tmp/settings-raster-hover-coverage-audit.mjs`
- `tmp/run-phaser-smoke-with-vite.mjs`

If they are absent in a fresh checkout because `tmp/` is gitignored, recreate or recover them from conversation logs before relying only on broad smoke.

## Documentation Updated

Important docs:

- `docs/conversation-log.md`
- `docs/problem-resolution-log.md`
- `docs/ui-visual-quality-rubric.md`
- `docs/asset-manifest.slice.v1.json`
- this file: `docs/ui-concept-raster-handoff-2026-06-05.md`

The rubric's current bottom section is the best status snapshot:

- `WorldMap Current Status Badge Checkpoint`
- `Current Remaining Raster-Quality Scope`

## What Not To Do Next

Do not:

- Claim the UI is complete.
- Claim 95% similarity.
- Claim user acceptance.
- Replace raster concept work with Phaser vector shapes.
- Clean or delete the large generated/source asset set just because it looks noisy.
- Reset, force push, or pull/merge without user confirmation if remote diverges.
- Treat `npm.cmd run check` as visual approval. It is only technical validation.

## Suggested Next Session Startup

At the start of the next session:

1. Read `AGENTS.md`.
2. Read `PROJECT_RULES.md`.
3. Read this handoff.
4. Read the tail of `docs/conversation-log.md`.
5. Read the bottom of `docs/ui-visual-quality-rubric.md`.
6. Inspect `src/phaser/scenes/WorldMapScene.ts`.
7. Inspect `tools/extract-ui-state-assets.mjs`.
8. Run or review:

```powershell
git status -sb
npm.cmd run check
node tmp/ui-worldmap-action-hit-target-audit.mjs
```

If `tmp` scripts are missing, first inspect gitignore and previous logs before making completion claims.

## End-of-Day Git Checkpoint Intent

This checkpoint is intentionally a WIP save point.

The reason for pushing is preservation and continuation, not final approval. The next worker should replace or improve these assets and runtime paths as the UI moves closer to the concept art.
