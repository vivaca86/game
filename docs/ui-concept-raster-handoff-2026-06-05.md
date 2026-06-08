# UI Concept Raster Handoff - 2026-06-05

Status: Partially complete. Do not call this UI work complete.

Current working estimate: about 63% of the active UI concept-quality goal.

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

- Overall active goal: about 60-65%, roughly 63%.
- Static first-view concept matching: about 70-75%.
- Interaction states: about 45-50%.
- Dynamic state truth, especially WorldMap completed/current/locked variants: about 50-55%.
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
- Settings return, reset-save, reset-defaults, volume sliders, display-mode selector, large-text toggle, reduced-motion toggle, and space-confirm toggle now have concept-underlay-derived control-specific hover and down art instead of the shared action-seal family.
- Town expedition action, RuneBench action rail, and Result action card now also have concept-underlay-derived hover/down art instead of the shared action-seal family. RuneBench lower confirm and Result lower return buttons have first-pass button-specific hover/down art wired, but broader secondary/legacy target review remains unfinished.

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
- `assets/source/ui/ui_hover_settings_return_button_concept_v001.png`
- `assets/source/ui/ui_down_settings_return_button_concept_v001.png`
- `assets/source/ui/ui_hover_settings_reset_save_concept_v001.png`
- `assets/source/ui/ui_down_settings_reset_save_concept_v001.png`
- `assets/source/ui/ui_hover_settings_reset_defaults_concept_v001.png`
- `assets/source/ui/ui_down_settings_reset_defaults_concept_v001.png`
- `assets/source/ui/ui_hover_settings_volume_master_concept_v001.png`
- `assets/source/ui/ui_down_settings_volume_master_concept_v001.png`
- `assets/source/ui/ui_hover_settings_volume_music_concept_v001.png`
- `assets/source/ui/ui_down_settings_volume_music_concept_v001.png`
- `assets/source/ui/ui_hover_settings_volume_sfx_concept_v001.png`
- `assets/source/ui/ui_down_settings_volume_sfx_concept_v001.png`
- `assets/source/ui/ui_hover_settings_display_mode_concept_v001.png`
- `assets/source/ui/ui_down_settings_display_mode_concept_v001.png`
- `assets/source/ui/ui_hover_settings_large_text_concept_v001.png`
- `assets/source/ui/ui_down_settings_large_text_concept_v001.png`
- `assets/source/ui/ui_hover_settings_reduced_motion_concept_v001.png`
- `assets/source/ui/ui_down_settings_reduced_motion_concept_v001.png`
- `assets/source/ui/ui_hover_settings_space_confirm_concept_v001.png`
- `assets/source/ui/ui_down_settings_space_confirm_concept_v001.png`
- `assets/source/ui/ui_hover_town_expedition_action_concept_v001.png`
- `assets/source/ui/ui_down_town_expedition_action_concept_v001.png`
- `assets/source/ui/ui_hover_runebench_action_rail_concept_v001.png`
- `assets/source/ui/ui_down_runebench_action_rail_concept_v001.png`
- `assets/source/ui/ui_hover_runebench_confirm_button_concept_v001.png`
- `assets/source/ui/ui_down_runebench_confirm_button_concept_v001.png`
- `assets/source/ui/ui_hover_result_action_card_concept_v001.png`
- `assets/source/ui/ui_down_result_action_card_concept_v001.png`
- `assets/source/ui/ui_hover_result_return_button_concept_v001.png`
- `assets/source/ui/ui_down_result_return_button_concept_v001.png`

Still unfinished:

- Per-control selected/focus/disabled states, plus remaining bespoke state review for secondary/legacy Town/RuneBench/Result utility hit targets and unaudited controls outside the current Settings set.
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
- Completed/locked/sealed stage state now has first-pass runtime badges:
  - `ui_completed_stage_badge_concept`
  - `ui_locked_stage_badge_concept`
  - `ui_sealed_stage_badge_concept`
- WorldMap node hover now uses the cleaned `ui_current_stage_halo_concept` with additive blending instead of the detached route-node token.
- Arrow-key stage selection now works in raster WorldMap mode. It picks the nearest unlocked stage node in the pressed direction using the concept node coordinates, then reuses the runtime current marker/halo/status stack for the selected node.
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
- `assets/source/ui/ui_completed_stage_badge_concept_v001.png`
- `assets/source/ui/ui_locked_stage_badge_concept_v001.png`
- `assets/source/ui/ui_sealed_stage_badge_concept_v001.png`

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
- progressed node-hover audit: `tmp/ui-quality/worldmap/worldmap-node-halo-hover-state-v1-1920.png`, `visibleHoverImages=2`, `textCount=0`, and `visibleRectsAboveUnderlay=0`
- keyboard stage-select audit: `tmp/ui-quality/worldmap/worldmap-keyboard-stage-select-v1-1920.png`, `currentStageId=stage_sunny_gate`, `markerAtSelectedStage=true`, `haloAtSelectedStage=true`, `statusAtSelectedStage=true`, `selectedStageHasNoCompletedBadge=true`, and `hasStageSelectLog=true`
- neutralized samples:
  - `node1check=[111,97,80]`
  - `node2check=[108,94,78]`
  - `node3check=[116,101,84]`
  - `stage4diamond=[109,95,79]`

WorldMap still unfinished:

- The map is not fully recomposed into dynamic current/completed/locked state variants.
- Baked route/node geometry remains.
- The lower 1-3 baked completed-check silhouettes are more neutralized, but some badge silhouette can still be seen in certain selected states and needs later recomposition or stronger source-aware patching.
- Completed/locked/sealed stage nodes have first-pass runtime badges, but they are not final per-stage recomposition.
- Keyboard focus state is not concept-quality.
- Dynamic labels/accessibility-safe tooltips are unresolved.
- Mobile/responsive review is not final.
- No user acceptance yet.

Recommended next WorldMap work:

1. Refine later completed-node variants and remaining baked route/node geometry against the concept.
2. Refine selected/focus/keyboard state art without reintroducing Phaser vector overlays. The first WorldMap arrow-key selection pass exists, but broader keyboard/focus coverage is still open.
3. Add accessibility-safe dynamic labels/tooltips outside the baked concept layer.
4. Reinvestigate the broad Phaser smoke timeout from the 2026-06-08 continuation: the wrapper passed through `checkClickableControls` after the hover/down key update, then timed out during `checkFullInputCoverage`.
5. Capture 1920 screenshots and inspect visually before claiming improvement.

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

The following passed after the 2026-06-08 Settings reset-panel and row/control-specific state pass:

```powershell
node tools\extract-ui-state-assets.mjs
npm.cmd run assets:generate:dev
node tmp\settings-raster-hover-coverage-audit.mjs
node tmp\settings-raster-pressed-coverage-audit.mjs
node tmp\ui-raster-down-audit.mjs
npm.cmd run check
```

The following did not complete on 2026-06-08:

```powershell
$env:PHASER_SMOKE_PROGRESS='1'; $env:PHASER_SMOKE_PROGRESS_FILE='tmp/phaser-smoke-progress-current.log'; node tmp\run-phaser-smoke-with-vite.mjs
```

It passed through `checkClickableControls` after the smoke helper's down-key default was updated to the current control-family bitmap standard, then timed out during `checkFullInputCoverage`. Treat broad Phaser smoke as `Needs verification`, not passed, for this continuation.

The following passed after the Town/RuneBench/Result representative utility state pass:

```powershell
node tools\extract-ui-state-assets.mjs
npm.cmd run assets:generate:dev
node tmp\ui-raster-hover-audit.mjs
node tmp\ui-raster-down-audit.mjs
npm.cmd run check
git diff --check
```

Screenshot review used `tmp/ui-quality/town-hover-no-vector-v1-1920.png`, `tmp/ui-quality/down/town-down-pressed-v1-1920.png`, `tmp/ui-quality/runebench-hover-no-vector-v1-1920.png`, `tmp/ui-quality/down/runebench-down-pressed-v1-1920.png`, `tmp/ui-quality/result-hover-no-vector-v1-1920.png`, and `tmp/ui-quality/down/result-down-pressed-v1-1920.png`. Broad Phaser smoke was not rerun for this pass; keep its status as `Needs verification` from the previous timeout until it completes.

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
- `tmp/settings-raster-pressed-coverage-audit.mjs`
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

## 2026-06-05 Continuation: WorldMap Completed/Locked Overlay Pass

Status: `Partially complete`.

This follow-up adds the first runtime completed/locked state pass for the raster WorldMap. It does not make the WorldMap final or 95% complete.

Added/changed:

- `ui_completed_stage_badge_concept`
- `ui_locked_stage_badge_concept`
- `ui_sealed_stage_badge_concept`
- `assets/source/ui/ui_completed_stage_badge_concept_v001.png`
- `assets/source/ui/ui_locked_stage_badge_concept_v001.png`
- `assets/source/ui/ui_sealed_stage_badge_concept_v001.png`
- `public/assets/runtime/ui/ui_completed_stage_badge_concept_v001.png`
- `public/assets/runtime/ui/ui_locked_stage_badge_concept_v001.png`
- `public/assets/runtime/ui/ui_sealed_stage_badge_concept_v001.png`
- `tools/extract-ui-state-assets.mjs`
- `tools/generate-dev-runtime-assets.mjs`
- `src/data/assetManifest.slice.v1.json`
- `docs/asset-manifest.slice.v1.json`
- `src/data/releaseCatalogAdapter.ts`
- `src/phaser/scenes/WorldMapScene.ts`
- `tmp/ui-worldmap-action-hit-target-audit.mjs`
- `tmp/ui-quality/worldmap/worldmap-state-overlays-v1-1920.png`

Behavior now verified by `tmp/ui-worldmap-action-hit-target-audit.mjs`:

- Seeded release WorldMap state: `stage_sunny_gate` completed, `stage_lavender_hall` current/unlocked.
- `visibleCompletedBadges=1`, `expectedCompletedBadges=1`.
- `visibleLockedBadges=6`, `expectedLockedBadges=6` for the later red-lock chapter nodes.
- `visibleSealedBadges=1`, `expectedSealedBadges=1` for the next lower/mid gray-sealed locked node.
- Current stage has no completed or locked badge.
- Old center map click still does not advance.
- Bottom-right play button click still advances to `DungeonScene`.
- Neutralized underlay audit now also samples old baked red lock centers.

Verification run in this continuation:

```powershell
node tools\extract-ui-state-assets.mjs
npm.cmd run assets:generate:dev
npm.cmd run check
node tmp\ui-worldmap-action-hit-target-audit.mjs
```

Known verification note:

- `node tmp\run-phaser-smoke-with-vite.mjs` did not complete within either 420000 ms or 900000 ms in this continuation environment. It generated screenshots through late release/effect checks and showed no explicit assertion failure before timeout, but it must not be reported as passing for this checkpoint.
- The stale earlier note above says this smoke can take about 180-190 seconds and returned `Phaser smoke OK`; that was true for the previous checkpoint, not for this continuation run.

Remaining WorldMap work:

- Completed/locked/sealed badges are first-pass overlays only.
- Static node bodies and some route/node geometry are still baked into the underlay.
- Large-node/boss-node state composition still needs visual refinement against the concept.
- Selected/focus/keyboard/mobile/accessibility-safe dynamic labels remain unfinished.
- User acceptance has not happened.

Follow-up refinement in the same continuation:

- The first completed/locked pass overused red lock badges and made lower/mid map nodes look like red stickers.
- It was corrected to match the original concept rhythm: the next lower/mid locked node now uses `ui_sealed_stage_badge_concept`, while red `ui_locked_stage_badge_concept` is reserved for the later upper chapter nodes.
- The dedicated audit now verifies red locks and gray seals separately.
- The same continuation then reduced baked completed/current body color on the lower stage-1/2/3 nodes and the baked stage-4 current plate in `world_map_raster_underlay_concept_v001.png`. This keeps the original node frames/numbers but makes runtime badges carry the state read.
- `tmp/ui-worldmap-action-hit-target-audit.mjs` now samples `node1body`, `node2body`, `node3body`, and `stage4body` in addition to the old check/diamond/lock pixels.
- A later route-line refinement neutralized the remaining cyan dotted path near source coordinate `940,503`, preserving the gray route body while removing the baked stage-4 progress glow. The audit now samples `stage4routeDots`.
- A further progressed-save review found that stage 5 still read too blue when stages 1-3 were completed and stage 4 was current. The underlay extraction now also neutralizes the stage-5 node body and the 4-to-5 route segment, and the audit samples `stage5body` and `stage5route`.
- `tmp/ui-worldmap-action-hit-target-audit.mjs` now captures `tmp/ui-quality/worldmap/worldmap-progress-current-stage4-v1-1920.png` and verifies the progressed release state: stages 1-3 completed, `stage_peach_canal` current, three completed badges, one next gray sealed badge, six red locked badges, current marker/halo/status present, and no completed/locked/sealed badge on the current node.
- The upper red-lock overlay placement was then source-aligned for stages 10-15 instead of using only the generic node-relative formula. This fixed the visibly low stage-10/11 locks and made the red lock row sit closer to the original concept.
- Mid-route completed badges are now smaller than the original lower-stage completed checks, so late progression does not blanket the route with oversized green checks.
- `tmp/ui-worldmap-action-hit-target-audit.mjs` also captures `tmp/ui-quality/worldmap/worldmap-progress-current-stage9-v1-1920.png` and verifies a late release state: stages 1-8 completed, `stage_moon_attic` current, stage 10 as the first red-locked node, six red locks, no gray seals, and position/size/alpha checks for completed and locked badges.
- A later gray-seal density pass reduced lower/mid sealed overlays to only the next locked node. The early and stage-4-progress audits now verify one sealed badge with size/alpha checks; non-next lower/mid locked nodes rely on the gray node material in the underlay.
- A later WorldMap node-hover pass cleaned `ui_current_stage_halo_concept` so it no longer contains the top diamond marker or lower route-dot fragments. WorldMap node hover/down now uses that cleaned halo with additive blending, while Dungeon keeps `ui_hover_route_node_concept`. `tmp/route-node-raster-hover-state-audit.mjs` now seeds stage 2 as current, hovers completed stage 1, captures `tmp/ui-quality/worldmap/worldmap-node-halo-hover-state-v1-1920.png`, and verifies there are no visible text or rectangle overlays.
- A later keyboard-selection pass added raster WorldMap arrow-key navigation. Directional input now selects the nearest unlocked stage node in that direction by concept-map coordinates, preserves the existing `flow:stage_select:*` log path, and reuses the current marker/halo/status art to show the selected stage. `tmp/ui-worldmap-action-hit-target-audit.mjs` captures `tmp/ui-quality/worldmap/worldmap-keyboard-stage-select-v1-1920.png` after pressing `ArrowLeft` from stage 2 to stage 1. The same pass added a stronger neutral patch for the old lower 1-3 baked check areas in the runtime underlay, but full lower-node recomposition remains unfinished.
- Latest rerun after the lower-check neutral patch: `node tmp\ui-worldmap-action-hit-target-audit.mjs` passed with `node1check=[97,85,69]`, `node2check=[95,84,69]`, and `node3check=[99,87,71]`; `node tmp\route-node-raster-hover-state-audit.mjs`, `npm.cmd run check`, and `git diff --check` also passed. `npm.cmd run check` still reports only the existing Vite large JS chunk warning.
- Latest late-progress placement pass: `worldMapCompletedBadgePlacement` now uses mid-route node-family overrides. Stages 6 and 7 are pulled closer to their illustrated node bases, while the stage-8 route-point completed marker is smaller and quieter because the concept art has no clear full numbered node there. `node tmp\ui-worldmap-action-hit-target-audit.mjs`, `node tmp\route-node-raster-hover-state-audit.mjs`, `npm.cmd run check`, and `git diff --check` passed after the change. Evidence crop: `tmp/ui-quality/worldmap/crops/worldmap-late-mid-route-completed-crop-after-placement.png`.
- Latest Reward/Event choice pressed-state pass: raster Reward and Event choice hit targets now use `ui_hover_choice_badge_concept` for down state as well as hover state. This removes the shared brown pressed stamp from card-choice art and keeps the interaction marker on the choice header badge axis. `node tmp\ui-raster-down-audit.mjs`, `node tmp\choice-badge-raster-hover-state-audit.mjs`, `npm.cmd run check`, and `git diff --check` passed. Evidence: `tmp/ui-quality/down/reward-down-pressed-v1-1920.png` and `tmp/ui-quality/down/event-down-pressed-v1-1920.png`.
- Latest all-screen pressed-state pass: the audited pressed/down targets for Town, Dungeon, Combat, RuneBench, Boss, Result, and Settings now set explicit `downKey` values from their existing concept bitmap families instead of falling back to the shared `ui_down_pressed_stamp_concept`. Combat uses `ui_hover_gold_seal_concept`, Boss uses `ui_hover_boss_skull_stamp_concept`, Dungeon uses `ui_hover_route_node_concept`, and Town/RuneBench/Result/Settings use `ui_hover_action_seal_concept`. `node tmp\ui-raster-down-audit.mjs`, `node tmp\combat-raster-hover-state-audit.mjs`, `node tmp\boss-raster-hover-state-audit.mjs`, `npm.cmd run check`, and `git diff --check` passed. Evidence includes `tmp/ui-quality/down/town-down-pressed-v1-1920.png`, `tmp/ui-quality/down/dungeon-down-pressed-v1-1920.png`, `tmp/ui-quality/down/combat-down-pressed-v1-1920.png`, `tmp/ui-quality/down/runebench-down-pressed-v1-1920.png`, `tmp/ui-quality/down/boss-down-pressed-v1-1920.png`, `tmp/ui-quality/down/result-down-pressed-v1-1920.png`, and `tmp/ui-quality/down/settings-down-pressed-v1-1920.png`.
- Latest Settings pressed-coverage pass: `tmp/settings-raster-pressed-coverage-audit.mjs` now verifies all ten major Settings raster controls in pressed state, parallel to the existing hover coverage audit. Screenshot review found `return-town` feedback anchored above the bottom-right red check button, so `SettingsScene` now places that hit target and its action-seal feedback on the visible check button instead. `node tmp\settings-raster-pressed-coverage-audit.mjs`, `node tmp\settings-raster-hover-coverage-audit.mjs`, `node tmp\ui-raster-down-audit.mjs`, `npm.cmd run check`, and `git diff --check` passed. Evidence includes `tmp/ui-quality/settings-pressed-coverage/return-town-v1-1920.png` and the refreshed hover/pressed coverage folders.
- Latest Settings return button-specific state pass: `ui_hover_settings_return_button_concept` and `ui_down_settings_return_button_concept` are now extracted from `assets/source/ui/settings_raster_underlay_concept_v001.png`, registered in both manifests, copied to runtime assets, and preloaded for release data. `SettingsScene` uses those textures only for the bottom-right return/check button, replacing the shared action-seal feedback there. The crop was corrected after screenshot review caught a wrong source-coordinate crop and a later alignment pass matched the overlay check center to the concept check center. `node tools\extract-ui-state-assets.mjs`, `npm.cmd run assets:generate:dev`, `node tmp\settings-raster-hover-coverage-audit.mjs`, `node tmp\settings-raster-pressed-coverage-audit.mjs`, `node tmp\ui-raster-down-audit.mjs`, `npm.cmd run check`, and `git diff --check` passed. Evidence: `tmp/ui-quality/settings-hover-coverage/return-town-v1-1920.png`, `tmp/ui-quality/settings-pressed-coverage/return-town-v1-1920.png`, `assets/source/ui/ui_hover_settings_return_button_concept_v001.png`, and `assets/source/ui/ui_down_settings_return_button_concept_v001.png`.
