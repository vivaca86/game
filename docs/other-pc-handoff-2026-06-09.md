# Other PC Handoff - 2026-06-09

Status: UI concept-raster work is partially complete. Do not call the UI finished.

Repository:

- GitHub: `https://github.com/vivaca86/game.git`
- Branch: `main`
- Latest pushed commit at handoff time: `76dce417a87e63e9f276d43ed9db618f073dfb10`
- Commit title: `Add Dungeon keyboard focus feedback`

## Start On Another PC

```powershell
git clone https://github.com/vivaca86/game.git
cd game
git log --oneline -5
git status -sb
npm install
```

Expected first commit in `git log --oneline -5`:

```text
76dce41 Add Dungeon keyboard focus feedback
```

Expected status:

```text
## main...origin/main
```

## Current UI Direction

The user rejected procedural/vector-looking UI. Continue with these rules:

- Use raster concept underlays and concept-derived bitmap state assets.
- Do not add Phaser rectangle/stroke/vector overlays as visible UI on concept screens.
- Keyboard focus must reuse the same bitmap language as pointer hover/down where possible.
- Do not introduce a new focus ring, tint, generic badge, or new visual style without matching the concept source.
- Keep completion language conservative. Current estimate is about 75%, not final.

Main reference docs:

- `docs/current-issues-and-plan.md`
- `docs/ui-concept-raster-handoff-2026-06-05.md`

## Latest Completed Work

Recent commits, newest first:

- `76dce41` - Dungeon keyboard focus feedback.
- `87fb0e1` - Combat/Boss keyboard focus feedback.
- `c6f28c4` - Town/RuneBench/Result utility keyboard focus feedback.
- `55cd99e` - Reward/Event keyboard focus feedback.
- `028e17b` - Restored broad Phaser smoke gate.

The latest Dungeon pass added:

- Central room node keyboard focus.
- Lower confirm panel keyboard focus.
- Focus/down state using only `ui_hover_route_node_concept`.
- New audit: `tmp/dungeon-keyboard-focus-raster-state-audit.mjs`.

## Verified After Latest Dungeon Pass

These passed before this handoff:

```powershell
npx.cmd tsc --noEmit
node tmp\keyboard-confirm-raster-state-audit.mjs
node tmp\dungeon-keyboard-focus-raster-state-audit.mjs
node tmp\route-node-raster-hover-state-audit.mjs
node tmp\ui-raster-hover-audit.mjs
node tmp\ui-raster-down-audit.mjs
npm.cmd run check
```

Known note:

- One parallel hover/down audit attempt hit Playwright screenshot timing pressure. Single reruns passed.
- The broad Phaser smoke for the latest Dungeon focus commit was started but interrupted at end of day. It reached `checkUiSkinStates START` after `checkFullInputCoverage OK` and `checkSettingsSurface OK`, but did not finish with `Phaser smoke OK`.

## First Command To Run Next

Before making new UI changes on the other PC, rerun the full broad smoke for the latest commit:

```powershell
$env:PHASER_SMOKE_PROGRESS='1'
$env:PHASER_SMOKE_PROGRESS_FILE='tmp/phaser-smoke-progress-other-pc-start.log'
node tmp\run-phaser-smoke-with-vite.mjs
```

Only count it as broad-smoke evidence if it ends with:

```text
Phaser smoke OK
```

## Next Best Work

Recommended next work:

1. WorldMap recomposition and runtime state truth:
   - Continue reducing baked state conflicts on lower/mid route nodes.
   - Keep current/completed/locked/sealed overlays concept-derived.
   - Use existing WorldMap audits before changing asset placement.

2. Broader selected/focus review:
   - Existing first-pass focus evidence now covers WorldMap directional selection, Reward/Event, Town/RuneBench/Result, Combat/Boss, Settings, and Dungeon.
   - This is still not final focus approval.

3. Broader disabled-state coverage:
   - Existing first evidence covers Event unaffordable choices and Combat/Boss cost-disabled cards.
   - Other controls/screens still need review.

4. Dynamic labels/tooltips/accessibility:
   - Still unresolved.
   - Do not put explanatory text on top of baked concept layers as a shortcut.

## Useful Evidence Paths

Latest focused screenshots:

- `tmp/ui-quality/dungeon-keyboard-focus/dungeon-room-node-focus-v1-1920.png`
- `tmp/ui-quality/dungeon-keyboard-focus/dungeon-bottom-confirm-focus-v1-1920.png`
- `tmp/ui-quality/dungeon-keyboard-focus/dungeon-bottom-confirm-keyboard-activate-down-v1-1920.png`
- `tmp/ui-quality/combat-boss-keyboard-focus/combat-card-1-focus-v1-1920.png`
- `tmp/ui-quality/combat-boss-keyboard-focus/boss-card-1-focus-v1-1920.png`
- `tmp/ui-quality/utility-keyboard-focus/town-expedition-focus-v1-1920.png`
- `tmp/ui-quality/keyboard-focus/reward-choice-2-focus-v1-1920.png`

Remember: `tmp/` is gitignored, so new audit scripts under `tmp/` must be staged with `git add -f`.

## 2026-06-11 Fresh Clone Continuation Note

Status remains `Partially complete`.

The repository was freshly cloned and dependencies were installed with:

```powershell
npm.cmd ci
```

The previously missing broad-smoke evidence after the Dungeon focus pass was rerun and passed with `Phaser smoke OK`.

Additional local continuation work:

- WorldMap stage-5 neutralized-underlay source coordinates were corrected.
- `tools/extract-ui-state-assets.mjs` now mutes the actual stage-5 node plate, lower seal, and 4-to-5 route area instead of relying on the old too-far-right sample.
- `tmp/ui-worldmap-action-hit-target-audit.mjs` now samples corrected `stage5body`, `stage5lowerSeal`, and `stage5route` pixels.
- A later same-day pass also mutes the baked stage-4 current-marker scar and lower current-status scar so non-stage-4 runtime states no longer inherit as much of the original concept screenshot's fixed current-state silhouette.
- `tmp/ui-worldmap-action-hit-target-audit.mjs` now samples `stage4topMarkerScar` and `stage4statusScar` with tighter dominance limits.
- `assets/source/ui/world_map_raster_underlay_concept_v001.png` and `public/assets/runtime/ui/world_map_raster_underlay_concept_v001.png` were regenerated.

Verification for this continuation:

```powershell
node tools\extract-ui-state-assets.mjs
npm.cmd run assets:generate:dev
node tmp\ui-worldmap-action-hit-target-audit.mjs
node tmp\route-node-raster-hover-state-audit.mjs
npm.cmd run check
git diff --check
$env:PHASER_SMOKE_PROGRESS='1'
$env:PHASER_SMOKE_PROGRESS_FILE='tmp/phaser-smoke-progress-worldmap-stage5-neutral.log'
node tmp\run-phaser-smoke-with-vite.mjs
$env:PHASER_SMOKE_PROGRESS_FILE='tmp/phaser-smoke-progress-worldmap-stage4-scar-neutral-rerun.log'
node tmp\run-phaser-smoke-with-vite.mjs
```

All listed checks passed. The first stage-4 scar broad-smoke wrapper attempt timed out at 184s during `checkReleasePassiveBatch`; the longer rerun above completed with `Phaser smoke OK`. `npm.cmd run check` still reports only the existing Vite large JS chunk warning.

Next best work is still WorldMap recomposition beyond neutralized samples and first-pass badges. Do not treat these stage-4/5 corrections as final WorldMap state recomposition or final UI approval.

## 2026-06-11 Current-Frame WIP Continuation

Status remains `Partially complete`.

Additional local continuation work:

- Added a first `ui_current_stage_frame_concept` raster overlay for the WorldMap current node.
- The asset is extracted from `assets/concepts/ui/world_map_ui_concept_v001.png`, but the extraction masks the baked stage-4 number, top marker, route fragments, lower status badge, and parchment background as much as possible.
- `WorldMapScene` renders the current frame between the cleaned halo and the marker/status stack for the runtime current stage.
- `src/data/releaseCatalogAdapter.ts` now shares `ui_current_stage_frame_concept` into release mode so `?data=release` WorldMap states load the same bitmap.
- `tmp/ui-worldmap-action-hit-target-audit.mjs` now verifies exactly one current-frame image at the runtime current node for default, progressed, late-lock, and keyboard-selected WorldMap states.

Verification for this continuation:

```powershell
node tools\extract-ui-state-assets.mjs
npm.cmd run assets:generate:dev
node tmp\ui-worldmap-action-hit-target-audit.mjs
node tmp\route-node-raster-hover-state-audit.mjs
npm.cmd run check
git diff --check
$env:PHASER_SMOKE_PROGRESS='1'
$env:PHASER_SMOKE_PROGRESS_FILE='tmp/phaser-smoke-progress-worldmap-current-frame.log'
node tmp\run-phaser-smoke-with-vite.mjs
```

All listed checks passed. `npm.cmd run check` reports `manifestAssets=463`, `existingFiles=463`, `missingFiles=0`, and only the existing Vite large JS chunk warning.

Important limitation: this is not full current-node body recomposition. The current frame is deliberately conservative because copying the source stage-4 node body directly would carry the wrong baked number and old route/state fragments to other stages. Continue with source-derived, number-safe body variants next.

## 2026-06-11 Completed-Frame WIP Continuation

Status remains `Partially complete`.

Additional local continuation work:

- Added a first `ui_completed_stage_frame_concept` raster overlay for completed WorldMap nodes.
- The asset is extracted from `assets/concepts/ui/world_map_ui_concept_v001.png`, but the extraction masks the source completed node's baked number, check mark, route fragments, and surrounding background as much as possible.
- The existing `ui_completed_stage_badge_concept` still owns the visible completed check; the new frame is only a conservative node-material/body step.
- `WorldMapScene` renders completed frames under completed badges and above the neutralized underlay.
- `src/data/releaseCatalogAdapter.ts` now shares `ui_completed_stage_frame_concept` into release mode.
- `tmp/ui-worldmap-action-hit-target-audit.mjs` now verifies completed-frame count, placement, display size, alpha, and absence on the runtime current node.

Verification for this continuation:

```powershell
node tools\extract-ui-state-assets.mjs
npm.cmd run assets:generate:dev
node tmp\ui-worldmap-action-hit-target-audit.mjs
node tmp\route-node-raster-hover-state-audit.mjs
npm.cmd run check
git diff --check
$env:PHASER_SMOKE_PROGRESS='1'
$env:PHASER_SMOKE_PROGRESS_FILE='tmp/phaser-smoke-progress-worldmap-completed-frame.log'
node tmp\run-phaser-smoke-with-vite.mjs
```

All listed checks passed. `npm.cmd run check` reports `manifestAssets=464`, `existingFiles=464`, `missingFiles=0`, and only the existing Vite large JS chunk warning.

Important limitation: this is still not full completed-node body recomposition. The completed frame is intentionally partial/conservative to avoid dragging wrong baked numbers, checks, or route fragments between stages. Continue with stronger number-safe completed/current/locked body variants next.

## 2026-06-11 Locked-Frame WIP Continuation

Status remains `Partially complete`.

Additional local continuation work:

- Added a first `ui_locked_stage_frame_concept` raster overlay for upper red locked WorldMap nodes.
- The asset is extracted from `assets/concepts/ui/world_map_ui_concept_v001.png`, but the extraction masks the source node's baked number, lock center, route fragments, and surrounding background as much as possible.
- The existing `ui_locked_stage_badge_concept` still owns the visible lock symbol; the new frame is only a conservative red/gold node-material step.
- `WorldMapScene` renders locked frames under locked badges and above the neutralized underlay for red locked stages.
- `src/data/releaseCatalogAdapter.ts` now shares `ui_locked_stage_frame_concept` into release mode.
- `tmp/ui-worldmap-action-hit-target-audit.mjs` now verifies locked-frame count, placement, display size, alpha, and absence on the runtime current node.

Verification for this continuation:

```powershell
node tools\extract-ui-state-assets.mjs
npm.cmd run assets:generate:dev
node tmp\ui-worldmap-action-hit-target-audit.mjs
node tmp\route-node-raster-hover-state-audit.mjs
npm.cmd run check
git diff --check
$env:PHASER_SMOKE_PROGRESS='1'
$env:PHASER_SMOKE_PROGRESS_FILE='tmp/phaser-smoke-progress-worldmap-locked-frame.log'
node tmp\run-phaser-smoke-with-vite.mjs
```

All listed checks passed. `npm.cmd run check` reports `manifestAssets=465`, `existingFiles=465`, `missingFiles=0`, and only the existing Vite large JS chunk warning.

Important limitation: this is still not full locked-node body recomposition. The locked frame is intentionally partial/conservative to avoid dragging wrong numbers, locks, routes, or map background between stages. Continue with stronger number-safe current/completed/locked body variants next.

## 2026-06-11 Body-Wash WIP Continuation

Status remains `Partially complete`.

Additional local continuation work:

- Added first conservative WorldMap body-wash overlays:
  - `ui_current_stage_body_wash_concept`
  - `ui_completed_stage_body_wash_concept`
  - `ui_locked_stage_body_wash_concept`
- These assets are extracted from `assets/concepts/ui/world_map_ui_concept_v001.png`, but their masks cut out the source numbers, check/lock/status centers, route fragments, and background as much as possible.
- `WorldMapScene` renders the current body wash under the current frame/marker/status stack, completed body washes under completed frames/badges, and locked body washes under locked frames/badges.
- `src/data/releaseCatalogAdapter.ts` now shares all three body-wash assets into release mode.
- `tmp/ui-worldmap-action-hit-target-audit.mjs` now verifies current/completed/locked body count, placement, display size, alpha, and absence on the runtime current node where applicable.

Verification for this continuation:

```powershell
node tools\extract-ui-state-assets.mjs
npm.cmd run assets:generate:dev
node tmp\ui-worldmap-action-hit-target-audit.mjs
node tmp\route-node-raster-hover-state-audit.mjs
npm.cmd run check
git diff --check
$env:PHASER_SMOKE_PROGRESS='1'
$env:PHASER_SMOKE_PROGRESS_FILE='tmp/phaser-smoke-progress-worldmap-body-wash.log'
node tmp\run-phaser-smoke-with-vite.mjs
```

All listed checks passed. `npm.cmd run check` reports `manifestAssets=468`, `existingFiles=468`, `missingFiles=0`, and only the existing Vite large JS chunk warning.

Important limitation: these body washes are still conservative overlays, not full state-specific node bodies. The locked and completed body washes are intentionally sparse to avoid dragging wrong source numbers/icons/routes. Continue with stronger number-safe body variants next.

## 2026-06-11 Sealed Body/Frame WIP Continuation

Status remains `Partially complete`.

Additional local continuation work:

- Added first conservative WorldMap sealed-state overlays for the next lower/mid locked node:
  - `ui_sealed_stage_body_wash_concept`
  - `ui_sealed_stage_frame_concept`
- These assets are extracted from the gray/metal node region of `assets/concepts/ui/world_map_ui_concept_v001.png`, with masks cutting out the source number, route fragments, and background as much as possible.
- `WorldMapScene` renders the sealed body/frame below the existing `ui_sealed_stage_badge_concept` for the single expected next lower/mid locked node.
- `src/data/releaseCatalogAdapter.ts` now shares both sealed assets into release mode.
- `tmp/ui-worldmap-action-hit-target-audit.mjs` now verifies sealed body/frame/badge count, placement, display size, alpha, zero-count late states, and absence on the runtime current node.

Verification for this continuation:

```powershell
node tools\extract-ui-state-assets.mjs
npm.cmd run assets:generate:dev
node tmp\ui-worldmap-action-hit-target-audit.mjs
node tmp\route-node-raster-hover-state-audit.mjs
npm.cmd run check
git diff --check
$env:PHASER_SMOKE_PROGRESS='1'
$env:PHASER_SMOKE_PROGRESS_FILE='tmp/phaser-smoke-progress-worldmap-sealed-body-frame.log'
node tmp\run-phaser-smoke-with-vite.mjs
```

All listed checks passed. `npm.cmd run check` reports `manifestAssets=470`, `existingFiles=470`, `missingFiles=0`, and only the existing Vite large JS chunk warning.

Important limitation: this is still not a full sealed-node body variant set. It is a conservative gray-material overlay for the single next-sealed runtime state. Continue with stronger number-safe state-specific body variants and later-node variants next.

## 2026-06-11 Dormant Lower/Mid Locked-Node WIP Continuation

Status remains `Partially complete`.

Additional local continuation work:

- Added first conservative WorldMap dormant overlays for lower/mid locked nodes that are not the single next sealed node:
  - `ui_dormant_stage_body_wash_concept`
  - `ui_dormant_stage_frame_concept`
- These assets are extracted from the gray/metal node region of `assets/concepts/ui/world_map_ui_concept_v001.png`, with masks cutting out the source number, route fragments, and background as much as possible.
- `WorldMapScene` renders the dormant body/frame below other runtime state material for non-next lower/mid locked nodes. Upper red locks keep the red locked stack, and the next lower/mid lock keeps the sealed stack.
- `src/data/releaseCatalogAdapter.ts` now shares both dormant assets into release mode.
- `tmp/ui-worldmap-action-hit-target-audit.mjs` now verifies dormant body/frame count, placement, display size, alpha, zero-count late states, and absence on runtime current / keyboard-selected nodes.

Verification for this continuation:

```powershell
node tools\extract-ui-state-assets.mjs
npm.cmd run assets:generate:dev
node tmp\ui-worldmap-action-hit-target-audit.mjs
node tmp\route-node-raster-hover-state-audit.mjs
npm.cmd run check
git diff --check
node tmp\run-phaser-smoke-with-vite.mjs
```

All listed checks passed. `npm.cmd run check` reports `manifestAssets=472`, `existingFiles=472`, `missingFiles=0`, and only the existing Vite large JS chunk warning.

Important limitation: this is still not full lower/mid locked-node recomposition. The dormant overlays are conservative gray-material additions that reduce dependence on muted baked underlay material but do not replace complete state-specific node bodies. Continue with stronger number-safe state-specific body variants, later node variants, lower-node shape recomposition, dynamic labels/tooltips, mobile/responsive review, user acceptance, and final concept-match approval next.

## 2026-06-11 Route-Progress Bead WIP Continuation

Status remains `Partially complete`.

Additional local continuation work:

- Added first conservative WorldMap route-progress material:
  - `ui_world_map_route_progress_bead_concept`
- The asset is extracted from the cyan route material in `assets/concepts/ui/world_map_ui_concept_v001.png`; it is not a Phaser vector route.
- `WorldMapScene` renders route beads on completed/progressed segments before the current node.
- `src/data/releaseCatalogAdapter.ts` now shares the route-bead asset into release mode.
- `tmp/ui-worldmap-action-hit-target-audit.mjs` now verifies route-bead count, placement, display size, alpha, and absence during keyboard-selected state.

Verification for this continuation:

```powershell
node tools\extract-ui-state-assets.mjs
npm.cmd run assets:generate:dev
node tmp\ui-worldmap-action-hit-target-audit.mjs
node tmp\route-node-raster-hover-state-audit.mjs
npm.cmd run check
git diff --check
node tmp\run-phaser-smoke-with-vite.mjs
```

All listed checks passed. The WorldMap audit reported `visibleRouteBeads=2` in the default progressed state, `visibleRouteBeads=4` in the stage-4-progress state, `visibleRouteBeads=12` in the late stage-9-progress state, and `visibleRouteBeads=0` in keyboard-selected state. `npm.cmd run check` reports `manifestAssets=473`, `existingFiles=473`, `missingFiles=0`, and only the existing Vite large JS chunk warning.

Important limitation: this is still not full WorldMap route recomposition. The route beads are a first conservative runtime overlay, not a complete dynamic route-state system. Continue with stronger number-safe state-specific body variants, later node variants, lower-node shape recomposition, complete route material, dynamic labels/tooltips, mobile/responsive review, user acceptance, and final concept-match approval next.

## 2026-06-13 Late Completed-Badge Variant WIP Continuation

Status remains `Partially complete`.

Additional local continuation work:

- Added first conservative WorldMap late completed-badge material:
  - `ui_completed_stage_late_badge_concept`
- The asset is extracted from the original completed badge source crop in `assets/concepts/ui/world_map_ui_concept_v001.png`, but processed as a narrower/quieter `completedLate` variant so completed nodes after the lower 1-3 group do not reuse the exact same lower-node check texture.
- `WorldMapScene` now keeps `ui_completed_stage_badge_concept` for completed stages 1-3 and uses `ui_completed_stage_late_badge_concept` for completed stage indexes after that when the texture exists.
- `src/data/releaseCatalogAdapter.ts`, `src/data/assetManifest.slice.v1.json`, `docs/asset-manifest.slice.v1.json`, and `tools/generate-dev-runtime-assets.mjs` now register the late completed badge for dev and release paths.
- `tmp/ui-worldmap-action-hit-target-audit.mjs` now splits completed badge verification into base and late counts. The late stage-9 progress audit reports `visibleCompletedBaseBadges=3`, `expectedCompletedBaseBadges=3`, `visibleCompletedLateBadges=5`, and `expectedCompletedLateBadges=5`.

Verification for this continuation:

```powershell
node tools\extract-ui-state-assets.mjs
npm.cmd run assets:generate:dev
node tmp\ui-worldmap-action-hit-target-audit.mjs
node tmp\route-node-raster-hover-state-audit.mjs
npm.cmd run check
$env:PHASER_SMOKE_PROGRESS='1'
$env:PHASER_SMOKE_PROGRESS_FILE='tmp/phaser-smoke-progress-worldmap-late-completed-badge.log'
node tmp\run-phaser-smoke-with-vite.mjs
```

All listed checks passed. `npm.cmd run check` reports `manifestAssets=475`, `existingFiles=475`, `missingFiles=0`, and only the existing Vite large JS chunk warning.

Important limitation: this is still not full completed-node recomposition. The late badge split improves one later-node variant gap, but completed body/frame variants are still broad shared overlays and the WorldMap still needs stronger stage-family body variants, lower-node shape recomposition, complete route-state material, visible tooltip/readability zones, mobile/responsive review, user acceptance, and final concept-match approval next.

## 2026-06-13 Late Completed-Stack Variant WIP Continuation

Status remains `Partially complete`.

Additional local continuation work:

- Added first conservative WorldMap late completed body/frame material:
  - `ui_completed_stage_late_body_wash_concept`
  - `ui_completed_stage_late_frame_concept`
- Both assets are extracted from the original completed-node crop in `assets/concepts/ui/world_map_ui_concept_v001.png`, but processed as quieter `completedLate` variants so completed nodes after the lower 1-3 group no longer reuse the full lower completed stack.
- `WorldMapScene` now keeps base completed body/frame/badge assets for completed stages 1-3 and uses late body/frame/badge assets for completed stage indexes after that when the textures exist.
- `src/data/releaseCatalogAdapter.ts`, `src/data/assetManifest.slice.v1.json`, `docs/asset-manifest.slice.v1.json`, and `tools/generate-dev-runtime-assets.mjs` now register the late completed body/frame assets for dev and release paths.
- `tmp/ui-worldmap-action-hit-target-audit.mjs` now splits completed body/frame verification into base and late counts. The late stage-9 progress audit reports `visibleCompletedBaseBodies=3`, `expectedCompletedBaseBodies=3`, `visibleCompletedLateBodies=5`, `expectedCompletedLateBodies=5`, `visibleCompletedBaseFrames=3`, `expectedCompletedBaseFrames=3`, `visibleCompletedLateFrames=5`, and `expectedCompletedLateFrames=5`.

Verification for this continuation:

```powershell
node tools\extract-ui-state-assets.mjs
npm.cmd run assets:generate:dev
node tmp\ui-worldmap-action-hit-target-audit.mjs
node tmp\route-node-raster-hover-state-audit.mjs
npm.cmd run check
$env:PHASER_SMOKE_PROGRESS='1'
$env:PHASER_SMOKE_PROGRESS_FILE='tmp/phaser-smoke-progress-worldmap-late-completed-stack.log'
node tmp\run-phaser-smoke-with-vite.mjs
```

All listed checks passed. `npm.cmd run check` reports `manifestAssets=477`, `existingFiles=477`, `missingFiles=0`, and only the existing Vite large JS chunk warning.

Important limitation: this is still not full completed-node recomposition. The late completed stack split improves the mid/late completed-node family, but completed nodes still need stronger stage-family body/frame variants, lower-node silhouette recomposition, complete route-state material, visible tooltip/readability zones, mobile/responsive review, user acceptance, and final concept-match approval next.

## 2026-06-13 Route Current-Leg Variant WIP Continuation

Status remains `Partially complete`.

Current estimate remains about 85% of the active UI goal, not 95%.

Additional local continuation work:

- Added first conservative WorldMap route current-leg material:
  - `ui_world_map_route_progress_current_thread_concept`
  - `ui_world_map_route_progress_current_bead_concept`
- Both assets are extracted from the same cyan route material in `assets/concepts/ui/world_map_ui_concept_v001.png`, but processed as brighter `currentLeg` variants so the final leg into the current stage can read differently from earlier completed legs.
- `WorldMapScene` now keeps the base route thread/bead textures for earlier completed route legs and uses the current thread/bead textures for the final leg when those textures exist.
- `src/data/releaseCatalogAdapter.ts`, `src/data/assetManifest.slice.v1.json`, `docs/asset-manifest.slice.v1.json`, and `tools/generate-dev-runtime-assets.mjs` now register the current-leg route assets for dev/runtime and release paths.
- `tmp/ui-worldmap-action-hit-target-audit.mjs` now splits route thread/bead verification into base and current counts. The default audit reports 0 base / 1 current thread and 0 base / 2 current beads. The stage-4-progress audit reports 2 base / 1 current thread and 3 base / 1 current bead. The stage-9-progress audit reports 7 base / 1 current thread and 11 base / 1 current bead. Keyboard-selected state still reports zero route overlays.

Verification for this continuation:

```powershell
node tools\extract-ui-state-assets.mjs
npm.cmd run assets:generate:dev
node tmp\ui-worldmap-action-hit-target-audit.mjs
node tmp\route-node-raster-hover-state-audit.mjs
npm.cmd run check
git diff --check
$env:PHASER_SMOKE_PROGRESS='1'
$env:PHASER_SMOKE_PROGRESS_FILE='tmp/phaser-smoke-progress-worldmap-current-route-leg-targeted.log'
$env:PHASER_SMOKE_ONLY='checkViewScreenshots,checkReleaseStageRouteBatch'
node tmp\run-phaser-smoke-with-vite.mjs
```

All listed checks passed. `npm.cmd run check` reports `manifestAssets=479`, `existingFiles=479`, `missingFiles=0`, and only the existing Vite large JS chunk warning.

Broad smoke note: a full `node tmp\run-phaser-smoke-with-vite.mjs` attempt with progress logging reached `checkBossResultFlow OK`, meaning every logged smoke step reached OK, but the wrapper process did not exit before the 600s command timeout. The targeted route/view smoke above completed with `Phaser smoke OK`. Rerun broad smoke on the next PC if a full wrapper-returning gate is required.

Important limitation: this is still not full WorldMap route recomposition. The current-leg split improves route texture-family evidence, but the route system remains a conservative overlay on top of a neutralized concept underlay. Continue with complete route material, stronger stage-family node variants, lower-node silhouette recomposition, visible tooltip/readability zones, mobile/responsive review, user acceptance, and final concept-match approval next.

## 2026-06-13 Late Current-Node Stack Variant WIP Continuation

Status remains `Partially complete`.

Current estimate is about 86% of the active UI goal, not 95%.

Additional local continuation work:

- Added first conservative WorldMap late current-node material:
  - `ui_current_stage_late_body_wash_concept`
  - `ui_current_stage_late_frame_concept`
- Both assets are extracted from the original current-node crop in `assets/concepts/ui/world_map_ui_concept_v001.png`, but processed as quieter `currentLate` variants for later route nodes.
- `WorldMapScene` now keeps the base current body/frame textures for lower and stage-4 current states, and uses the late current body/frame textures for current stage indexes after stage 5 when those textures exist.
- `src/data/releaseCatalogAdapter.ts`, `src/data/assetManifest.slice.v1.json`, `docs/asset-manifest.slice.v1.json`, and `tools/generate-dev-runtime-assets.mjs` now register the late current body/frame assets for dev/runtime and release paths.
- `tmp/ui-worldmap-action-hit-target-audit.mjs` now splits current body/frame verification into base and late counts. The default, stage-4-progress, and keyboard-selected audits report one base current body/frame and zero late current body/frame. The stage-9 late-progress audit reports zero base current body/frame and one late current body/frame.

Verification for this continuation:

```powershell
node tools\extract-ui-state-assets.mjs
npm.cmd run assets:generate:dev
node tmp\ui-worldmap-action-hit-target-audit.mjs
node tmp\route-node-raster-hover-state-audit.mjs
npm.cmd run check
git diff --check
$env:PHASER_SMOKE_PROGRESS='1'
$env:PHASER_SMOKE_PROGRESS_FILE='tmp/phaser-smoke-progress-worldmap-current-late-stack-targeted.log'
$env:PHASER_SMOKE_ONLY='checkViewScreenshots,checkReleaseStageRouteBatch'
node tmp\run-phaser-smoke-with-vite.mjs
```

All listed checks passed. `npm.cmd run check` reports `manifestAssets=481`, `existingFiles=481`, `missingFiles=0`, and only the existing Vite large JS chunk warning plus one plugin timing warning.

Important limitation: this is still not full WorldMap current-node recomposition. The late current stack split improves one stage-family gap, but current nodes still need stronger stage-specific body/frame variants, lower-node silhouette recomposition, complete route material, visible tooltip/readability zones, mobile/responsive review, user acceptance, and final concept-match approval next.

## 2026-06-13 Mid Dormant-Node Stack Variant WIP Continuation

Status remains `Partially complete`.

Current estimate is about 87% of the active UI goal, not 95%.

Additional local continuation work:

- Added first conservative WorldMap mid dormant-node material:
  - `ui_dormant_stage_mid_body_wash_concept`
  - `ui_dormant_stage_mid_frame_concept`
- Both assets are extracted from the gray/metal dormant source crop in `assets/concepts/ui/world_map_ui_concept_v001.png`, but processed as quieter `dormantMid` variants.
- `WorldMapScene` now keeps the base dormant body/frame textures for lower dormant locked nodes and uses the mid dormant body/frame textures for dormant locked stage indexes after stage 5 when those textures exist.
- `src/data/releaseCatalogAdapter.ts`, `src/data/assetManifest.slice.v1.json`, `docs/asset-manifest.slice.v1.json`, and `tools/generate-dev-runtime-assets.mjs` now register the mid dormant body/frame assets for dev/runtime and release paths.
- `tmp/ui-worldmap-action-hit-target-audit.mjs` now splits dormant body/frame verification into base and mid counts. Default state reports 2 base + 4 mid dormant bodies/frames. Stage-4-progress reports 0 base + 4 mid dormant bodies/frames. Stage-9 late-progress reports zero dormant body/frame assets.

Verification for this continuation:

```powershell
node tools\extract-ui-state-assets.mjs
npm.cmd run assets:generate:dev
node tmp\ui-worldmap-action-hit-target-audit.mjs
node tmp\route-node-raster-hover-state-audit.mjs
npm.cmd run check
git diff --check
$env:PHASER_SMOKE_PROGRESS='1'
$env:PHASER_SMOKE_PROGRESS_FILE='tmp/phaser-smoke-progress-worldmap-dormant-mid-stack-targeted.log'
$env:PHASER_SMOKE_ONLY='checkViewScreenshots,checkReleaseStageRouteBatch'
node tmp\run-phaser-smoke-with-vite.mjs
```

All listed checks passed. `npm.cmd run check` reports `manifestAssets=483`, `existingFiles=483`, `missingFiles=0`, and only the existing Vite large JS chunk warning.

Important limitation: this is still not full WorldMap dormant-node recomposition. The mid dormant split improves one lower/mid locked-node family gap, but dormant nodes still need stronger stage-specific bodies, lower-node silhouette recomposition, complete route material, visible tooltip/readability zones, mobile/responsive review, user acceptance, and final concept-match approval next.
