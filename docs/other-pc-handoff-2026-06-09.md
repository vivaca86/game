# Other PC Handoff - 2026-06-09

Status: UI concept-raster work is partially complete. Do not call the UI finished.

Repository:

- GitHub: `https://github.com/vivaca86/game.git`
- Branch: `main`
- Latest pushed commit: run `git log -1 --oneline` after pulling.
- Expected latest commit title after the 2026-06-14 WorldMap selection route-stack continuation: `Audit WorldMap selection routes`

## Start On Another PC

```powershell
git clone https://github.com/vivaca86/game.git
cd game
git log --oneline -5
git status -sb
npm install
```

Expected first commit title in `git log --oneline -5` after the latest continuation:

```text
Audit WorldMap selection routes
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
- Keep completion language conservative. Current estimate is about a 95% candidate, not final, release-ready, or user-accepted 95%.

Main reference docs:

- `docs/current-issues-and-plan.md`
- `docs/ui-concept-raster-handoff-2026-06-05.md`

## Latest Completed Work

Older reference commits from the first handoff period:

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
   - First hidden accessibility labels and first visible tooltip zones now exist.
   - Representative keyboard-focus tooltip evidence now exists for Town, Dungeon, Combat, Reward, Event, RuneBench, Boss, Result, and Settings.
   - WorldMap locked/sealed/dormant nodes now expose danger-tone explanation tooltips through tooltip-only disabled hit targets, including the boss-sized red locked-node family. The locked-node audit now also verifies the original current marker, halo, body, frame, and status stack stays anchored during locked hover/click, and that the hovered/clicked locked target keeps its own sealed/dormant/red-far/red-next/red-boss body/frame/badge family without conflicting overlays.
   - WorldMap direction-key stage selection now shows the same DOM readability tooltip for the selected stage without adding another hover image, and now verifies the selected/current marker, halo, body, frame, and status stack across lower, mid, and boss routes.
   - WorldMap open-node hover/down now verifies the existing current marker, halo, body, frame, and status stack stays anchored to the current node while the target node shows hover/pressed halo feedback, and now also verifies the target open node keeps its completed base/late body, frame, and badge stack during hover/down without conflicting current or locked overlays.
   - WorldMap open-node pointer click now has lower/mid/boss route-family evidence that the selected/current marker, halo, body, frame, and status stack moves to the clicked node without conflicting completed/locked/sealed/dormant overlays.
   - Mobile portrait now has a non-blocking orientation/framing cue in unused letterbox space and suppresses it while readability tooltips are visible.
   - WorldMap now has muted locked/future route thread/bead material separate from completed/current cyan route material.
   - WorldMap route thread/bead material now has interaction evidence during open-node hover/down and locked-node hover/click, including base/current completed routes, muted locked/future routes, placement/style, rotation, and absence of the old route-hover image.
   - WorldMap open-node pointer click now also has post-click route-stack recomposition evidence: lower/mid/boss selected nodes verify base/current completed route threads/beads, muted locked/future route threads/beads, placement/style, rotation, and absence of the old route-hover image after `context.run.stageId` changes.
   - WorldMap now has neutral lower-node body and frame layers under the first five lower map nodes, separate from current/completed/sealed/dormant state stacks.
   - WorldMap now splits first locked sealed-node body/frame material into lower/base and mid-route variants, with a stage-6/current evidence case for the mid sealed family.
   - WorldMap now splits upper red locked body/frame material into next/base, far non-boss, and boss-sized variants. The stage 14/15 boss locks use the new boss family while the first red lock keeps the base family and non-boss distant locks keep the far family.
   - Continue broader gameplay-critical readable text, broader selected/focus approval, broader disabled-state breadth, final mobile UX review, and user acceptance.
   - Do not put explanatory text directly into the baked concept layers as a shortcut.

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

## 2026-06-13 Far Red Locked-Node Stack Variant WIP Continuation

Status remains `Partially complete`.

Current estimate is about 88% of the active UI goal, not 95%.

Additional local continuation work:

- Added first conservative WorldMap far red locked-node material:
  - `ui_locked_stage_far_body_wash_concept`
  - `ui_locked_stage_far_frame_concept`
- Both assets are extracted from the red locked-node crop in `assets/concepts/ui/world_map_ui_concept_v001.png`, but processed as quieter `lockedFar` variants.
- `WorldMapScene` now keeps the base red locked body/frame textures for the first/next red locked node and uses the far red locked body/frame textures for other upper red locked nodes when those textures exist.
- `src/data/releaseCatalogAdapter.ts`, `src/data/assetManifest.slice.v1.json`, `docs/asset-manifest.slice.v1.json`, and `tools/generate-dev-runtime-assets.mjs` now register the far locked body/frame assets for dev/runtime and release paths.
- `tmp/ui-worldmap-action-hit-target-audit.mjs` now splits locked body/frame verification into next and far counts. Default state reports 0 next + 6 far locked bodies/frames. Stage-4-progress reports 0 next + 6 far locked bodies/frames. Stage-9 late-progress reports 1 next + 5 far locked bodies/frames.

Verification for this continuation:

```powershell
node tools\extract-ui-state-assets.mjs
npm.cmd run assets:generate:dev
node tmp\ui-worldmap-action-hit-target-audit.mjs
node tmp\route-node-raster-hover-state-audit.mjs
npm.cmd run check
git diff --check
$env:PHASER_SMOKE_PROGRESS='1'
$env:PHASER_SMOKE_PROGRESS_FILE='tmp/phaser-smoke-progress-worldmap-locked-far-stack-targeted.log'
$env:PHASER_SMOKE_ONLY='checkViewScreenshots,checkReleaseStageRouteBatch'
node tmp\run-phaser-smoke-with-vite.mjs
```

All listed checks passed. `npm.cmd run check` reports `manifestAssets=485`, `existingFiles=485`, `missingFiles=0`, and only the existing Vite large JS chunk warning.

Important limitation: this is still not full WorldMap locked-node recomposition. The far red locked split improves one upper locked-node family gap, but locked nodes still need stronger stage-specific bodies, lower-node silhouette recomposition, complete route material, visible tooltip/readability zones, mobile/responsive review, user acceptance, and final concept-match approval next.

## 2026-06-14 Visible Readability Tooltip WIP Continuation

Status remains `Partially complete`.

Current estimate is about 89% of the active UI goal, not 95%.

Additional local continuation work:

- Added a first visible DOM readability-tooltip layer:
  - `src/ui/overlays/readabilityOverlay.ts`
  - `#game-readability-tooltip`
- `renderRasterHoverHitTarget` now accepts optional tooltip title/body/tone fields and shows the DOM tooltip on pointer hover/down or keyboard focus.
- The tooltip is positioned relative to the Phaser canvas using the existing 1920x1080 virtual coordinate system, clamps inside the viewport/canvas, uses `role="tooltip"` and `aria-live="polite"`, and stays hidden by default so normal concept screenshots remain textless.
- Representative visible tooltip content is wired for Town, WorldMap, Dungeon, Combat, Reward, Event, RuneBench, Boss, Result, and Settings.
- `debugOverlay` hides the readability tooltip during scene transitions so stale text does not remain after scene changes.
- Added `tools/ui-readability-tooltip-audit.mjs`, which verifies all ten primary raster scenes and captures screenshots under `tmp/ui-quality/readability-tooltips/`.

Verification for this continuation:

```powershell
node tools\ui-readability-tooltip-audit.mjs
node tools\ui-accessibility-overlay-audit.mjs
node tools\ui-responsive-raster-audit.mjs
node tmp\ui-worldmap-action-hit-target-audit.mjs
node tmp\route-node-raster-hover-state-audit.mjs
npx.cmd tsc --noEmit
git diff --check
$env:PHASER_SMOKE_PROGRESS='1'
$env:PHASER_SMOKE_PROGRESS_FILE='tmp/phaser-smoke-progress-readability-tooltip-targeted.log'
$env:PHASER_SMOKE_ONLY='checkViewScreenshots,checkClickableControls,checkFullInputCoverage,checkUiSkinStates'
node tmp\run-phaser-smoke-with-vite.mjs
```

All listed checks passed. The tooltip audit reported these representative titles:

- Town: `탐험 준비`
- WorldMap: `던전 진입`
- Dungeon: `방 진입`
- Combat/Boss card: Korean card title with `비용`
- Reward: `리본 튕기기`
- Event: `공격 카드에 불씨 룬`
- RuneBench: `보석 작업`
- Result: `결과 확인`
- Settings: `전체 음량`

Visual inspection of the Combat and Settings screenshots confirmed the tooltip is readable and does not cover the main playfield in the inspected states.

Important limitation: this is still not final readability approval. It proves representative visible tooltip zones after the hidden accessibility-label pass, but the project still needs broader gameplay-critical readable text decisions, disabled-state explanations, mobile tooltip/framing review, user acceptance, and final 95% concept-match approval next.

## 2026-06-14 Responsive Tooltip Placement WIP Continuation

Status remains `Partially complete`.

Current estimate is about 90% of the active UI goal, not 95%.

Additional local continuation work:

- The readability tooltip now sizes itself from the active Phaser canvas rather than only using a desktop-width default.
- On narrow portrait letterboxed screens, such as 390x844 where the canvas renders as `390x219`, the tooltip moves into the unused letterbox area above or below the canvas instead of covering the playfield.
- `src/styles/phaser-shell.css` now accepts tooltip sizing variables for width, min-height, max-height, and padding.
- `src/ui/overlays/readabilityOverlay.ts` computes responsive tooltip width/max-height from the canvas and uses portrait letterbox placement when enough vertical safe space exists.
- `tools/ui-readability-tooltip-audit.mjs` now verifies all ten primary raster scenes at:
  - `1920x1080`
  - `1280x720`
  - `390x844`
- Desktop cases must stay inside the canvas; mobile portrait cases must stay in the viewport and not overlap the canvas.

Verification for this continuation:

```powershell
npx.cmd tsc --noEmit
git diff --check
node tools\ui-readability-tooltip-audit.mjs
node tools\ui-accessibility-overlay-audit.mjs
node tools\ui-responsive-raster-audit.mjs
npm.cmd run check
$env:PHASER_SMOKE_PROGRESS='1'
$env:PHASER_SMOKE_PROGRESS_FILE='tmp/phaser-smoke-progress-responsive-tooltip-targeted.log'
$env:PHASER_SMOKE_ONLY='checkViewScreenshots,checkClickableControls,checkFullInputCoverage,checkUiSkinStates'
node tmp\run-phaser-smoke-with-vite.mjs
```

All listed checks passed. The tooltip audit now reports 30 passing scene/viewport cases. Representative mobile results:

- WorldMap mobile: tooltip `289x64`, canvas `390x219`, no canvas overlap.
- Combat mobile: tooltip `289x83`, canvas `390x219`, no canvas overlap.
- Settings mobile: tooltip `289x64`, canvas `390x219`, no canvas overlap.

Visual inspection of `worldmap-tooltip-v1-mobile-390x844.png`, `combat-tooltip-v1-mobile-390x844.png`, and `settings-tooltip-v1-mobile-390x844.png` confirmed the tooltip uses the letterbox space and no longer covers the game scene in portrait.

Important limitation: this still does not finish mobile UX. It only fixes and audits tooltip placement in the current portrait letterbox layout. Full mobile framing/orientation treatment, broader gameplay-critical readable text, disabled explanations, selected/focus tooltip consistency, user acceptance, and final 95% concept-match approval remain next.

## 2026-06-14 Disabled Explanation Tooltip WIP Continuation

Status remains `Partially complete`.

Current estimate is about 91% of the active UI goal, not 95%.

Additional local continuation work:

- `renderRasterDisabledHitTarget` now accepts tooltip title/body/tone metadata and shows the same DOM readability tooltip on hover/down while keeping disabled hit targets inert and non-clickable.
- Event unaffordable raster choices now explain missing HP/gold conditions. Example audit result: `주인의 숨은 서랍 · 조건 부족`, body `체력 5 이상 필요 / 현재 1`.
- Combat and Boss cost-disabled cards now explain current energy versus required energy using `getCombatCardCostAtIndex`, so rune/passive/discount/penalty adjusted costs match gameplay. Example audit result: `무대 덧대기 · 기운 부족`, body `현재 기운 0입니다. 이 카드를 사용하려면 기운 2가 필요합니다.`
- The existing disabled raster lock images remain the visible state art; this pass adds explanation through the DOM tooltip layer instead of adding new Phaser text or vector overlays.

Verification for this continuation:

```powershell
npx.cmd tsc --noEmit
git diff --check
node tmp\ui-disabled-raster-audit.mjs
node tmp\combat-boss-disabled-raster-state-audit.mjs
node tools\ui-readability-tooltip-audit.mjs
node tools\ui-accessibility-overlay-audit.mjs
npm.cmd run check
$env:PHASER_SMOKE_PROGRESS='1'
$env:PHASER_SMOKE_PROGRESS_FILE='tmp/phaser-smoke-progress-disabled-tooltip-targeted.log'
$env:PHASER_SMOKE_ONLY='checkViewScreenshots,checkClickableControls,checkFullInputCoverage,checkUiSkinStates'
node tmp\run-phaser-smoke-with-vite.mjs
```

All listed checks passed. One `node tools\ui-readability-tooltip-audit.mjs` attempt failed during Chromium screenshot capture because the page closed, then the immediate rerun passed all 30 scene/viewport cases. Count the rerun as the passing evidence.

Visual evidence:

- `tmp/ui-quality/disabled/event-disabled-tooltip-v1-1920.png`
- `tmp/ui-quality/disabled/combat-disabled-card-tooltip-v1-1920.png`
- `tmp/ui-quality/disabled/boss-disabled-card-tooltip-v1-1920.png`

Important limitation: this is first disabled explanation coverage, not final broad disabled approval. Existing evidence now covers Event unaffordable choices and Combat/Boss cost-disabled cards. Other disabled/locked controls, broader selected/focus approval, full mobile framing/orientation treatment, user acceptance, and final 95% concept-match approval remain next.

## 2026-06-14 Keyboard Focus Tooltip Audit WIP Continuation

Status remains `Partially complete`.

Current estimate is about 92% of the active UI goal, not 95%.

Additional local continuation work:

- Added `tools/ui-keyboard-focus-tooltip-audit.mjs`.
- The audit proves representative keyboard focus paths show the same DOM readability tooltip layer as pointer hover.
- Covered representative focus paths:
  - Town: expedition action.
  - Dungeon: room node.
  - Combat: first playable card.
  - Reward: first reward choice.
  - Event: first affordable event choice in release `stage_sunny_gate`.
  - RuneBench: action rail.
  - Boss: first playable card.
  - Result: action card.
  - Settings: volume master row after opening Settings from Town.
- The audit runs those nine focus paths at `1920x1080`, `1280x720`, and `390x844`.
- It verifies focus registry value, `role="tooltip"`, `aria-live="polite"`, tooltip scene/tone, title/body length, size ratios, viewport/canvas or letterbox-safe placement, `pointer-events: none`, z-index, canvas `role="img"`, and canvas `aria-label`.
- Screenshots are captured under `tmp/ui-quality/focus-tooltips/`.

Verification for this continuation:

```powershell
node tools\ui-keyboard-focus-tooltip-audit.mjs
npx.cmd tsc --noEmit
git diff --check
node tools\ui-readability-tooltip-audit.mjs
node tools\ui-accessibility-overlay-audit.mjs
npm.cmd run check
$env:PHASER_SMOKE_PROGRESS='1'
$env:PHASER_SMOKE_PROGRESS_FILE='tmp/phaser-smoke-progress-focus-tooltip-targeted.log'
$env:PHASER_SMOKE_ONLY='checkViewScreenshots,checkClickableControls,checkFullInputCoverage,checkUiSkinStates'
node tmp\run-phaser-smoke-with-vite.mjs
```

All listed checks passed. `tools/ui-keyboard-focus-tooltip-audit.mjs` reported 27 passing focus-tooltip cases. `npm.cmd run check` reports `manifestAssets=485`, `existingFiles=485`, `missingFiles=0`, and only the existing Vite large JS chunk warning. The targeted smoke ended with `Phaser smoke OK`.

Representative evidence:

- `tmp/ui-quality/focus-tooltips/town-focus-tooltip-v1-1920.png`
- `tmp/ui-quality/focus-tooltips/combat-focus-tooltip-v1-1920.png`
- `tmp/ui-quality/focus-tooltips/event-focus-tooltip-v1-desktop-1280.png`
- `tmp/ui-quality/focus-tooltips/settings-focus-tooltip-v1-mobile-390x844.png`

Important limitation: this closes the representative selected/focus tooltip-consistency gap, not full keyboard/focus approval. WorldMap keyboard stage selection still has its own state-selection evidence rather than a focus tooltip path, broader gameplay-critical readable text is not complete, disabled-state breadth is still limited, mobile portrait framing/orientation is still not final, user acceptance is missing, and the UI is not a 95% or release-ready completion candidate.

## 2026-06-14 WorldMap Locked Node Tooltip WIP Continuation

Status remains `Partially complete`.

Current estimate is about 93% of the active UI goal, not 95%.

Additional local continuation work:

- `renderRasterDisabledHitTarget` now accepts `disabledKey: false`, allowing tooltip-only disabled hit targets without drawing an extra default lock-stamp image.
- `WorldMapScene` now registers inert disabled hit targets over locked map nodes after unlocked stage targets are created.
- Locked WorldMap nodes now show danger-tone DOM tooltips with stage-specific titles and unlock explanations, while clicks keep the active scene and current stage unchanged.
- The pass covers the four locked-node families that mattered for the current route evidence: sealed next lower/mid lock, dormant mid lock, far red lock, and next red lock in the late-progress state.
- Added `tools/ui-worldmap-locked-tooltip-audit.mjs`.

Verification for this continuation:

```powershell
npx.cmd tsc --noEmit
git diff --check
node tools\ui-worldmap-locked-tooltip-audit.mjs
node tmp\ui-worldmap-action-hit-target-audit.mjs
node tools\ui-readability-tooltip-audit.mjs
node tools\ui-keyboard-focus-tooltip-audit.mjs
node tools\ui-accessibility-overlay-audit.mjs
npm.cmd run check
$env:PHASER_SMOKE_PROGRESS='1'
$env:PHASER_SMOKE_PROGRESS_FILE='tmp/phaser-smoke-progress-worldmap-locked-tooltip-targeted.log'
$env:PHASER_SMOKE_ONLY='checkViewScreenshots,checkClickableControls,checkFullInputCoverage,checkUiSkinStates'
node tmp\run-phaser-smoke-with-vite.mjs
```

All listed checks passed. The locked tooltip audit reported 12 passing cases across 1920x1080, 1280x720, and 390x844. A prior parallel rerun of readability/focus audits hit Playwright resource pressure, then the same audits were rerun serially and passed; count the serial runs as the evidence.

Representative evidence:

- `tmp/ui-quality/worldmap-locked-tooltips/sealed-next-locked-tooltip-v1-1920.png`
- `tmp/ui-quality/worldmap-locked-tooltips/dormant-mid-locked-tooltip-v1-1920.png`
- `tmp/ui-quality/worldmap-locked-tooltips/red-far-locked-tooltip-v1-1920.png`
- `tmp/ui-quality/worldmap-locked-tooltips/red-next-locked-tooltip-v1-mobile-390x844.png`

Important limitation: this improves WorldMap locked-node readability and disabled-state breadth, but it is still not final WorldMap recomposition or release-ready UI. Continue with full WorldMap node/route recomposition, broader disabled/focus coverage outside the audited paths, mobile framing/orientation review, and user acceptance.

## 2026-06-14 WorldMap Keyboard Selection Tooltip WIP Continuation

Status remains `Partially complete`.

Current estimate is about 94% of the active UI goal, not 95%.

Additional local continuation work:

- Added a small `showRasterReadabilityTooltip` export so scenes can show the existing DOM tooltip without also turning on hover/down bitmap state.
- WorldMap direction-key stage selection now marks the selected stage before restarting the scene, then shows the selected stage tooltip after the raster scene rebuilds.
- This reuses the existing selected/current marker stack and keeps exactly one visible current halo, so keyboard tooltip evidence does not add a second hover image or new visual style.
- Open WorldMap stage tooltip bodies now include status and room count in addition to the stage description, avoiding too-short readable copy on compact stage descriptions.
- Added `tools/ui-worldmap-keyboard-tooltip-audit.mjs`.

Verification for this continuation:

```powershell
npx.cmd tsc --noEmit
git diff --check
node tools\ui-worldmap-keyboard-tooltip-audit.mjs
node tmp\ui-worldmap-action-hit-target-audit.mjs
node tools\ui-worldmap-locked-tooltip-audit.mjs
node tools\ui-readability-tooltip-audit.mjs
node tools\ui-keyboard-focus-tooltip-audit.mjs
node tools\ui-accessibility-overlay-audit.mjs
npm.cmd run check
$env:PHASER_SMOKE_PROGRESS='1'
$env:PHASER_SMOKE_PROGRESS_FILE='tmp/phaser-smoke-progress-worldmap-keyboard-tooltip-targeted.log'
$env:PHASER_SMOKE_ONLY='checkViewScreenshots,checkClickableControls,checkFullInputCoverage,checkUiSkinStates'
node tmp\run-phaser-smoke-with-vite.mjs
```

All listed checks passed. The new WorldMap keyboard tooltip audit reported six passing cases:

- lower-left selection to `stage_sunny_gate` at 1920, 1280, and 390x844.
- late-right selection to `stage_prism_school` at 1920, 1280, and 390x844.

Representative evidence:

- `tmp/ui-quality/worldmap-keyboard-tooltips/lower-left-keyboard-tooltip-v1-1920.png`
- `tmp/ui-quality/worldmap-keyboard-tooltips/late-right-keyboard-tooltip-v1-1920.png`
- `tmp/ui-quality/worldmap-keyboard-tooltips/lower-left-keyboard-tooltip-v1-mobile-390x844.png`
- `tmp/ui-quality/worldmap-keyboard-tooltips/late-right-keyboard-tooltip-v1-mobile-390x844.png`

Important limitation: this closes the missing WorldMap selected-stage tooltip evidence, not full selected/focus approval. Full WorldMap node/route recomposition, broader disabled/focus coverage outside the audited paths, mobile framing/orientation review, user acceptance, and final 95% concept-match approval remain next.

## 2026-06-14 Mobile Portrait Framing Cue WIP Continuation

Status remains `Partially complete`.

Current estimate is about a 95% candidate of the active UI goal, not final, release-ready, or user-accepted 95%.

Additional local continuation work:

- Added `src/ui/overlays/mobileFramingOverlay.ts`, a DOM status cue that appears only when the Phaser FIT canvas is heavily letterboxed in narrow portrait layout.
- `renderDebugOverlay` now syncs the mobile framing cue with the same scene-level DOM overlay pass as accessibility labels and tooltip reset.
- The cue stays outside the canvas in unused portrait letterbox space, uses `pointer-events: none`, and hides on desktop 1920x1080, desktop 1280x720, and 844x390 landscape.
- `readabilityOverlay.ts` suppresses the framing cue immediately whenever a detailed readability tooltip is visible, so card/node/control explanations keep priority.
- Added `tools/ui-mobile-framing-audit.mjs`.

Verification for this continuation:

```powershell
npx.cmd tsc --noEmit
git diff --check
node tools\ui-mobile-framing-audit.mjs
node tools\ui-responsive-raster-audit.mjs
node tools\ui-readability-tooltip-audit.mjs
node tools\ui-accessibility-overlay-audit.mjs
npm.cmd run check
node tools\ui-keyboard-focus-tooltip-audit.mjs
$env:PHASER_SMOKE_PROGRESS='1'
$env:PHASER_SMOKE_PROGRESS_FILE='tmp/phaser-smoke-progress-mobile-framing-targeted.log'
$env:PHASER_SMOKE_ONLY='checkViewScreenshots,checkClickableControls,checkFullInputCoverage,checkUiSkinStates'
node tmp\run-phaser-smoke-with-vite.mjs
```

All listed checks passed. The new mobile framing audit verified all ten primary scenes at 390x844, 1920x1080, 1280x720, and 844x390 landscape. It also verified tooltip suppression on Combat mobile: the framing cue stayed `data-visible=true` but `data-suppressed=true`, `aria-hidden=true`, `opacity=0`, and `visibility=hidden` while the readability tooltip was visible.

Representative evidence:

- `tmp/ui-quality/mobile-framing/worldmap-framing-v1-mobile-390x844.png`
- `tmp/ui-quality/mobile-framing/combat-framing-v1-mobile-390x844.png`
- `tmp/ui-quality/mobile-framing/settings-framing-v1-mobile-390x844.png`
- `tmp/ui-quality/mobile-framing/combat-tooltip-suppresses-framing-v1-mobile-390x844.png`

Important limitation: this closes the first deliberate portrait framing/orientation cue, not final mobile UX approval. Full WorldMap node/route recomposition, broader disabled/focus coverage outside the audited paths, broader gameplay-critical readable text, user acceptance, and final concept-match approval remain next.

## 2026-06-14 WorldMap Locked Future Route WIP Continuation

Status remains `Partially complete`.

Current estimate remains about a 95% candidate of the active UI goal, not final, release-ready, or user-accepted 95%.

Additional local continuation work:

- Added `ui_world_map_route_locked_thread_concept` and `ui_world_map_route_locked_bead_concept`.
- The new source assets are extracted from `assets/concepts/ui/world_map_ui_concept_v001.png` using the same route crop family as the cyan route assets, but processed into a muted gray locked/future material.
- `WorldMapScene` now renders locked/future route thread/bead overlays only on forward route segments whose destination stage is still locked.
- Completed route legs keep `ui_world_map_route_progress_thread_concept` / `ui_world_map_route_progress_bead_concept`, the final/current leg keeps the brighter current route assets, and locked future routes use the new muted route assets.
- Keyboard-selected WorldMap evidence suppresses both progress and locked future route overlays so selected-stage marker/tooltip audits remain clean.
- Updated `tmp/ui-worldmap-action-hit-target-audit.mjs` to verify locked route thread/bead counts, placement, size, and alpha separately from base/current route material.

Verification for this continuation:

```powershell
npx.cmd tsc --noEmit
git diff --check
npm.cmd run assets:audit:strict
node tmp\ui-worldmap-action-hit-target-audit.mjs
node tmp\route-node-raster-hover-state-audit.mjs
node tools\ui-worldmap-keyboard-tooltip-audit.mjs
node tools\ui-worldmap-locked-tooltip-audit.mjs
npm.cmd run check
$env:PHASER_SMOKE_PROGRESS='1'
$env:PHASER_SMOKE_PROGRESS_FILE='tmp/phaser-smoke-progress-worldmap-locked-routes-targeted.log'
$env:PHASER_SMOKE_ONLY='checkViewScreenshots,checkClickableControls,checkFullInputCoverage,checkUiSkinStates'
node tmp\run-phaser-smoke-with-vite.mjs
```

All listed checks passed. The WorldMap action audit now reports:

- default state: `visibleRouteLockedThreads=7`, `visibleRouteLockedBeads=9`.
- stage-4 progress: `visibleRouteLockedThreads=6`, `visibleRouteLockedBeads=7`.
- stage-9 progress: `visibleRouteLockedThreads=3`, `visibleRouteLockedBeads=4`.
- keyboard-selected state: `visibleRouteLockedThreads=0`, `visibleRouteLockedBeads=0`.

Representative evidence:

- `tmp/ui-quality/worldmap/worldmap-state-overlays-v1-1920.png`
- `tmp/ui-quality/worldmap/worldmap-progress-current-stage4-v1-1920.png`
- `tmp/ui-quality/worldmap/worldmap-progress-current-stage9-v1-1920.png`
- `tmp/ui-quality/worldmap/worldmap-keyboard-stage-select-v1-1920.png`

Important limitation: this improves route-state texture-family separation, but it is still not full WorldMap recomposition. The map still needs deeper node/body variants, lower-node silhouette recomposition, broader disabled/focus coverage outside the audited paths, user acceptance, and final concept-match approval.

## 2026-06-14 WorldMap Lower Node Body WIP Continuation

Status remains `Partially complete`.

Current estimate remains about a 95% candidate of the active UI goal, not final, release-ready, or user-accepted 95%.

Additional local continuation work:

- Added `ui_world_map_lower_node_body_concept`.
- The asset is extracted from `assets/concepts/ui/world_map_ui_concept_v001.png` from the lower completed-node source family, but processed as a number/check-free neutral paper body so it does not carry the source stage number or completed badge into other runtime states.
- `WorldMapScene` renders this neutral lower-node body layer on the first five lower map nodes at low depth, after the underlay but below completed/current/locked route overlays and below state body/frame/badge stacks.
- The layer is deliberately conservative: it reduces baked lower-node silhouettes and old completed/current scars without replacing state-specific current/completed/sealed/dormant material.
- Updated `tmp/ui-worldmap-action-hit-target-audit.mjs` to verify exactly five lower-node body images, placement, size, and alpha in default, stage-4-progress, and stage-9-progress WorldMap states.

Verification for this continuation:

```powershell
node tools\extract-ui-state-assets.mjs
npm.cmd run assets:generate:dev
npx.cmd tsc --noEmit
git diff --check
npm.cmd run assets:audit:strict
node tmp\ui-worldmap-action-hit-target-audit.mjs
node tmp\route-node-raster-hover-state-audit.mjs
node tools\ui-worldmap-keyboard-tooltip-audit.mjs
node tools\ui-worldmap-locked-tooltip-audit.mjs
npm.cmd run check
$env:PHASER_SMOKE_PROGRESS='1'
$env:PHASER_SMOKE_PROGRESS_FILE='tmp/phaser-smoke-progress-worldmap-lower-node-body-targeted.log'
$env:PHASER_SMOKE_ONLY='checkViewScreenshots,checkClickableControls,checkFullInputCoverage,checkUiSkinStates'
node tmp\run-phaser-smoke-with-vite.mjs
```

All listed checks passed. `npm.cmd run assets:audit:strict` reports `manifestAssets=488`, `existingFiles=488`, `missingFiles=0`, and `orphanFiles=0`. The WorldMap action audit now reports `visibleLowerNodeBodies=5` / `expectedLowerNodeBodies=5` for default, stage-4-progress, and stage-9-progress states, with placement/style checks passing.

Representative evidence:

- `assets/source/ui/ui_world_map_lower_node_body_concept_v001.png`
- `public/assets/runtime/ui/ui_world_map_lower_node_body_concept_v001.png`
- `tmp/ui-quality/worldmap/worldmap-state-overlays-v1-1920.png`
- `tmp/ui-quality/worldmap/worldmap-progress-current-stage4-v1-1920.png`
- `tmp/ui-quality/worldmap/worldmap-progress-current-stage9-v1-1920.png`

Important limitation: this improves lower-node silhouette recomposition, but it is still not full WorldMap node/body recomposition. The map still needs stronger stage-specific current/completed/locked/sealed/dormant body variants, broader disabled/focus/readability coverage outside the audited paths, user acceptance, and final concept-match approval.

## 2026-06-14 WorldMap Lower Node Frame WIP Continuation

Status remains `Partially complete`.

Current estimate remains about a 95% candidate of the active UI goal, not final, release-ready, or user-accepted 95%.

Additional local continuation work:

- Added `ui_world_map_lower_node_frame_concept`.
- The asset is extracted from `assets/concepts/ui/world_map_ui_concept_v001.png` from the lower completed-node source family, but processed as a number/check-free warm rim. The extraction mirrors the cleaner left-side rim to avoid carrying right-side route fragments into the reusable frame.
- `WorldMapScene` renders this lower-node frame layer on the first five lower map nodes above the neutral lower-node body and below route overlays plus runtime state stacks.
- Updated release sharing, slice/docs manifests, dev runtime generation, and `tmp/ui-worldmap-action-hit-target-audit.mjs` so the new frame is required and audited in release-mode WorldMap states.
- The WorldMap action audit now verifies exactly five lower-node frame images, placement, display size, and alpha in default, stage-4-progress, and stage-9-progress states.

Verification for this continuation:

```powershell
node tools\extract-ui-state-assets.mjs
npm.cmd run assets:generate:dev
npx.cmd tsc --noEmit
git diff --check
npm.cmd run assets:audit:strict
node tmp\ui-worldmap-action-hit-target-audit.mjs
node tmp\route-node-raster-hover-state-audit.mjs
node tools\ui-worldmap-keyboard-tooltip-audit.mjs
node tools\ui-worldmap-locked-tooltip-audit.mjs
npm.cmd run check
$env:PHASER_SMOKE_PROGRESS='1'
$env:PHASER_SMOKE_PROGRESS_FILE='tmp/phaser-smoke-progress-worldmap-lower-node-frame-targeted.log'
$env:PHASER_SMOKE_ONLY='checkViewScreenshots,checkClickableControls,checkFullInputCoverage,checkUiSkinStates'
node tmp\run-phaser-smoke-with-vite.mjs
```

All listed checks passed. `npm.cmd run assets:audit:strict` reports `manifestAssets=489`, `existingFiles=489`, `missingFiles=0`, and `orphanFiles=0`. The WorldMap action audit now reports `visibleLowerNodeFrames=5` / `expectedLowerNodeFrames=5` for default, stage-4-progress, and stage-9-progress states, with placement/style checks passing. `npm.cmd run check` still reports only the existing Vite large JS chunk warning. The targeted smoke ended with `Phaser smoke OK`.

Representative evidence:

- `assets/source/ui/ui_world_map_lower_node_frame_concept_v001.png`
- `public/assets/runtime/ui/ui_world_map_lower_node_frame_concept_v001.png`
- `tmp/ui-quality/worldmap/worldmap-state-overlays-v1-1920.png`
- `tmp/ui-quality/worldmap/worldmap-progress-current-stage4-v1-1920.png`
- `tmp/ui-quality/worldmap/worldmap-progress-current-stage9-v1-1920.png`

Important limitation: this strengthens lower-node silhouette recomposition, but it is still not full WorldMap node/body recomposition. The map still needs stronger stage-specific current/completed/locked/sealed/dormant body variants, broader disabled/focus/readability coverage outside the audited paths, user acceptance, and final concept-match approval.

## 2026-06-14 WorldMap Mid Sealed Node WIP Continuation

Status remains `Partially complete`.

Current estimate remains about a 95% candidate of the active UI goal, not final, release-ready, or user-accepted 95%.

Additional local continuation work:

- Added `ui_sealed_stage_mid_body_wash_concept` and `ui_sealed_stage_mid_frame_concept`.
- The assets are extracted from the existing gray sealed/dormant WorldMap node crop with quieter `sealedMid` processing. They keep the transferable body/frame material number-safe and seal-center-safe, while avoiding the stronger lower sealed texture family on mid-route first-locked nodes.
- `WorldMapScene` now keeps the base sealed body/frame for first locked lower nodes and uses the mid sealed body/frame for first locked sealed nodes after the lower 1-5 family.
- Updated release sharing, slice/docs manifests, dev runtime generation, and `tmp/ui-worldmap-action-hit-target-audit.mjs`.
- The WorldMap action audit now includes a stage-6/current, stage-7 first-locked mid sealed evidence case and verifies base/mid sealed body/frame counts separately.

Verification for this continuation:

```powershell
node tools\extract-ui-state-assets.mjs
npm.cmd run assets:generate:dev
npx.cmd tsc --noEmit
npm.cmd run assets:audit:strict
node tmp\ui-worldmap-action-hit-target-audit.mjs
node tools\ui-worldmap-keyboard-tooltip-audit.mjs
node tools\ui-worldmap-locked-tooltip-audit.mjs
node tmp\route-node-raster-hover-state-audit.mjs
npm.cmd run check
$env:PHASER_SMOKE_PROGRESS='1'
$env:PHASER_SMOKE_PROGRESS_FILE='tmp/phaser-smoke-progress-worldmap-sealed-mid-targeted.log'
$env:PHASER_SMOKE_ONLY='checkViewScreenshots,checkClickableControls,checkFullInputCoverage,checkUiSkinStates'
node tmp\run-phaser-smoke-with-vite.mjs
```

All listed checks passed. `npm.cmd run assets:audit:strict` reports `manifestAssets=491`, `existingFiles=491`, `missingFiles=0`, and `orphanFiles=0`. The new mid sealed audit case reports `visibleSealedBaseBodies=0`, `visibleSealedMidBodies=1`, `visibleSealedBaseFrames=0`, and `visibleSealedMidFrames=1`; earlier lower sealed states still report base sealed 1 and mid sealed 0. `npm.cmd run check` still reports only the existing Vite large JS chunk warning. The targeted smoke ended with `Phaser smoke OK`. A parallel route-node hover audit attempt timed out under Playwright resource pressure, then the same audit passed when rerun serially.

Representative evidence:

- `assets/source/ui/ui_sealed_stage_mid_body_wash_concept_v001.png`
- `assets/source/ui/ui_sealed_stage_mid_frame_concept_v001.png`
- `public/assets/runtime/ui/ui_sealed_stage_mid_body_wash_concept_v001.png`
- `public/assets/runtime/ui/ui_sealed_stage_mid_frame_concept_v001.png`
- `tmp/ui-quality/worldmap/worldmap-progress-mid-sealed-stage6-v1-1920.png`

Important limitation: this improves the sealed-node stage-family split, but it is still not full WorldMap node/body recomposition. Stronger stage-specific current/completed/locked/sealed/dormant body variants, broader disabled/focus/readability coverage outside the audited paths, user acceptance, and final concept-match approval remain.

## 2026-06-14 WorldMap Boss Locked Node WIP Continuation

Status remains `95% candidate, not final`.

Additional local continuation work:

- Added `ui_locked_stage_boss_body_wash_concept` and `ui_locked_stage_boss_frame_concept`.
- The assets are extracted from the actual upper boss red-lock WorldMap crop and processed with number/lock/route/background-safe masking so the transferable material does not copy a full baked stage sticker.
- `WorldMapScene` now chooses the boss locked body/frame family for stage indexes 13+ when available. The base red locked family still owns the first/next non-boss red lock, and the far red locked family still owns other non-boss red locks.
- Updated release sharing, slice/docs manifests, dev runtime generation, and `tmp/ui-worldmap-action-hit-target-audit.mjs`.
- The WorldMap action audit now splits red locked body/frame verification into next, far, and boss counts. Default, stage-4-progress, and mid-sealed states report 0 next + 4 far + 2 boss locked bodies/frames; late-progress reports 1 next + 3 far + 2 boss locked bodies/frames.

Verification for this continuation:

```powershell
node tools\extract-ui-state-assets.mjs
npm.cmd run assets:generate:dev
node tmp\ui-worldmap-action-hit-target-audit.mjs
npx.cmd tsc --noEmit
npm.cmd run assets:audit:strict
node tools\ui-worldmap-keyboard-tooltip-audit.mjs
node tools\ui-worldmap-locked-tooltip-audit.mjs
node tmp\route-node-raster-hover-state-audit.mjs
npm.cmd run check
git diff --check
$env:PHASER_SMOKE_PROGRESS='1'
$env:PHASER_SMOKE_PROGRESS_FILE='tmp/phaser-smoke-progress-worldmap-boss-lock-targeted.log'
$env:PHASER_SMOKE_ONLY='checkViewScreenshots,checkClickableControls,checkFullInputCoverage,checkUiSkinStates'
node tmp\run-phaser-smoke-with-vite.mjs
```

All listed checks passed. `npm.cmd run assets:audit:strict` reports `manifestAssets=493`, `existingFiles=493`, `missingFiles=0`, and `orphanFiles=0`. `npm.cmd run check` still reports only the existing Vite large JS chunk warning. The targeted smoke ended with `Phaser smoke OK`.

Representative evidence:

- `assets/source/ui/ui_locked_stage_boss_body_wash_concept_v001.png`
- `assets/source/ui/ui_locked_stage_boss_frame_concept_v001.png`
- `public/assets/runtime/ui/ui_locked_stage_boss_body_wash_concept_v001.png`
- `public/assets/runtime/ui/ui_locked_stage_boss_frame_concept_v001.png`
- `tmp/ui-quality/worldmap/worldmap-state-overlays-v1-1920.png`
- `tmp/ui-quality/worldmap/worldmap-progress-current-stage9-v1-1920.png`

Important limitation: this improves the upper red locked-node stage-family split, but it is still not full WorldMap node/body recomposition. Stronger stage-specific current/completed/locked/sealed/dormant body variants, broader disabled/focus/readability coverage outside the audited paths, user acceptance, and final concept-match approval remain.

## 2026-06-14 WorldMap Boss Locked Tooltip Audit Continuation

Status remains `95% candidate, not final`.

Additional local continuation work:

- Extended `tools/ui-worldmap-locked-tooltip-audit.mjs` with a `red-boss` case.
- The new case seeds stage index 13 as the first boss-sized red locked node, hovers/clicks `stage_dream_arcade`, and verifies the danger-tone DOM tooltip while keeping the current stage unchanged.
- The audit now covers five WorldMap locked-node families across 1920x1080, 1280x720, and 390x844: sealed-next, dormant-mid, red-far, red-next, and red-boss.

Verification for this continuation:

```powershell
node tools\ui-worldmap-locked-tooltip-audit.mjs
```

The audit passed with 15 cases. The new boss case reported `stageId=stage_dream_arcade`, title `꿈빛 오락실 · 잠김`, `currentStageId=stage_morning_observatory`, and `firstLockedIndex=13` at all three viewport sizes.

Representative evidence:

- `tmp/ui-quality/worldmap-locked-tooltips/red-boss-locked-tooltip-v1-1920.png`
- `tmp/ui-quality/worldmap-locked-tooltips/red-boss-locked-tooltip-v1-desktop-1280.png`
- `tmp/ui-quality/worldmap-locked-tooltips/red-boss-locked-tooltip-v1-mobile-390x844.png`

Important limitation: this strengthens boss locked-node readability evidence, but it is still not full WorldMap node/body recomposition, final disabled/focus coverage, user acceptance, or release-ready UI.

## 2026-06-14 WorldMap Boss Keyboard Tooltip Audit Continuation

Status remains `95% candidate, not final`.

Additional local continuation work:

- Extended `tools/ui-worldmap-keyboard-tooltip-audit.mjs` with a `boss-up` case.
- The new case seeds the upper route around stage index 12, presses `ArrowUp`, selects `stage_dream_arcade`, and verifies the selected-stage choice-tone DOM tooltip without enabling an extra hover image.
- The audit now covers three WorldMap keyboard-selected stage paths across 1920x1080, 1280x720, and 390x844: lower-left, late-right, and boss-up.

Verification for this continuation:

```powershell
node tools\ui-worldmap-keyboard-tooltip-audit.mjs
npx.cmd tsc --noEmit
git diff --check
npm.cmd run check
$env:PHASER_SMOKE_PROGRESS='1'
$env:PHASER_SMOKE_PROGRESS_FILE='tmp/phaser-smoke-progress-worldmap-boss-keyboard-tooltip-targeted.log'
$env:PHASER_SMOKE_ONLY='checkViewScreenshots,checkClickableControls,checkFullInputCoverage,checkUiSkinStates'
node tmp\run-phaser-smoke-with-vite.mjs
```

All listed checks passed. The keyboard tooltip audit passed with 9 cases. The new boss-up case reported `stageId=stage_dream_arcade`, one current halo, no Phaser text/vector leak, and safe desktop/mobile tooltip placement. `npm.cmd run check` still reports only the existing Vite large JS chunk warning. The targeted smoke ended with `Phaser smoke OK`.

Representative evidence:

- `tmp/ui-quality/worldmap-keyboard-tooltips/boss-up-keyboard-tooltip-v1-1920.png`
- `tmp/ui-quality/worldmap-keyboard-tooltips/boss-up-keyboard-tooltip-v1-desktop-1280.png`
- `tmp/ui-quality/worldmap-keyboard-tooltips/boss-up-keyboard-tooltip-v1-mobile-390x844.png`

Important limitation: this strengthens boss/top selected-stage readability evidence, but it is still not full WorldMap node/body recomposition, final selected/focus approval, user acceptance, or release-ready UI.

## 2026-06-14 WorldMap Open Node Tooltip Audit Continuation

Status remains `95% candidate, not final`.

Additional local continuation work:

- Added `tools/ui-worldmap-open-node-tooltip-audit.mjs`.
- The new audit verifies unlocked WorldMap stage-node pointer hover/click paths for lower-open, mid-open, and boss-open route families.
- It checks that open nodes show the choice-tone DOM readability tooltip, display exactly two `ui_current_stage_halo_concept` images during hover (the current stage halo plus the hovered target halo), avoid Phaser text/vector overlay leaks, stay safely placed on desktop/mobile, and click-select into the hovered stage.

Verification for this continuation:

```powershell
node tools\ui-worldmap-open-node-tooltip-audit.mjs
npx.cmd tsc --noEmit
git diff --check
node tools\ui-worldmap-keyboard-tooltip-audit.mjs
node tools\ui-worldmap-locked-tooltip-audit.mjs
npm.cmd run check
$env:PHASER_SMOKE_PROGRESS='1'
$env:PHASER_SMOKE_PROGRESS_FILE='tmp/phaser-smoke-progress-worldmap-open-node-tooltip-targeted.log'
$env:PHASER_SMOKE_ONLY='checkViewScreenshots,checkClickableControls,checkFullInputCoverage,checkUiSkinStates'
node tmp\run-phaser-smoke-with-vite.mjs
```

All listed checks passed. The new open-node tooltip audit passed with 9 cases:

- lower-open to `stage_sunny_gate` at 1920, 1280, and 390x844.
- mid-open to `stage_prism_school` at 1920, 1280, and 390x844.
- boss-open to `stage_dream_arcade` at 1920, 1280, and 390x844.

Representative evidence:

- `tmp/ui-quality/worldmap-open-node-tooltips/boss-open-open-node-tooltip-v1-1920.png`
- `tmp/ui-quality/worldmap-open-node-tooltips/boss-open-open-node-tooltip-v1-desktop-1280.png`
- `tmp/ui-quality/worldmap-open-node-tooltips/boss-open-open-node-tooltip-v1-mobile-390x844.png`

Important limitation: this strengthens open stage-node pointer readability evidence, but it is still not full WorldMap node/body recomposition, final selected/focus approval, user acceptance, or release-ready UI.

## 2026-06-14 WorldMap Open Node Down-State Audit Continuation

Status remains `95% candidate, not final`.

Additional local continuation work:

- Added `tools/ui-worldmap-open-node-down-audit.mjs`.
- The new audit verifies unlocked WorldMap stage-node pointer-down/pressed paths for lower-open, mid-open, and boss-open route families.
- It checks that the pressed node uses the concept-derived `ui_current_stage_halo_concept` down state at the expected pressed size and alpha, keeps the choice-tone tooltip visible, avoids Phaser text/vector overlay leaks, stays safely placed on desktop/mobile, and selects the pressed stage on pointer up.

Verification for this continuation:

```powershell
node tools\ui-worldmap-open-node-down-audit.mjs
node tools\ui-worldmap-open-node-tooltip-audit.mjs
node tools\ui-worldmap-keyboard-tooltip-audit.mjs
npx.cmd tsc --noEmit
git diff --check
npm.cmd run check
$env:PHASER_SMOKE_PROGRESS='1'
$env:PHASER_SMOKE_PROGRESS_FILE='tmp/phaser-smoke-progress-worldmap-open-node-down-targeted.log'
$env:PHASER_SMOKE_ONLY='checkViewScreenshots,checkClickableControls,checkFullInputCoverage,checkUiSkinStates'
node tmp\run-phaser-smoke-with-vite.mjs
```

All listed checks passed. The new open-node down audit passed with 9 cases:

- lower-open to `stage_sunny_gate` at 1920, 1280, and 390x844, pressed halo `288x306`, alpha `0.98`.
- mid-open to `stage_prism_school` at 1920, 1280, and 390x844, pressed halo `273x290`, alpha `0.98`.
- boss-open to `stage_dream_arcade` at 1920, 1280, and 390x844, pressed halo `326x347`, alpha `0.98`.

Representative evidence:

- `tmp/ui-quality/worldmap-open-node-down/boss-open-open-node-down-v1-1920.png`
- `tmp/ui-quality/worldmap-open-node-down/boss-open-open-node-down-v1-desktop-1280.png`
- `tmp/ui-quality/worldmap-open-node-down/boss-open-open-node-down-v1-mobile-390x844.png`

Important limitation: this strengthens open stage-node pressed/down evidence, but it is still not full WorldMap node/body recomposition, final selected/focus approval, user acceptance, or release-ready UI.

## 2026-06-14 WorldMap Open Node Selection-State Audit Continuation

Status remains `95% candidate, not final`.

Additional local continuation work:

- Added `tools/ui-worldmap-open-node-selection-audit.mjs`.
- The new audit verifies unlocked WorldMap stage-node pointer click selection for lower-open, mid-open, and boss-open route families.
- It clicks the target node, waits for `context.run.stageId` to become the target stage, moves the pointer away, then verifies the selected/current marker, halo, body, frame, and status badge are anchored to the clicked node.
- It also verifies base current material for the lower node, late current material for mid/boss nodes, no conflicting completed/locked/sealed/dormant overlays on the selected node, no Phaser text/vector overlay leaks, no stale tooltip, and a `flow:stage_select:<stageId>` log entry.

Verification for this continuation:

```powershell
node tools\ui-worldmap-open-node-selection-audit.mjs
node tools\ui-worldmap-open-node-tooltip-audit.mjs
node tools\ui-worldmap-open-node-down-audit.mjs
node tools\ui-worldmap-keyboard-tooltip-audit.mjs
npx.cmd tsc --noEmit
git diff --check
npm.cmd run check
$env:PHASER_SMOKE_PROGRESS='1'
$env:PHASER_SMOKE_PROGRESS_FILE='tmp/phaser-smoke-progress-worldmap-open-node-selection-targeted.log'
$env:PHASER_SMOKE_ONLY='checkViewScreenshots,checkClickableControls,checkFullInputCoverage,checkUiSkinStates'
node tmp\run-phaser-smoke-with-vite.mjs
```

All listed checks passed. The new open-node selection audit passed with 9 cases:

- lower-open to `stage_sunny_gate` at 1920, 1280, and 390x844, using the base current body/frame family.
- mid-open to `stage_prism_school` at 1920, 1280, and 390x844, using the late current body/frame family.
- boss-open to `stage_dream_arcade` at 1920, 1280, and 390x844, using the late current body/frame family.

Representative evidence:

- `tmp/ui-quality/worldmap-open-node-selection/boss-open-open-node-selection-v1-1920.png`
- `tmp/ui-quality/worldmap-open-node-selection/boss-open-open-node-selection-v1-desktop-1280.png`
- `tmp/ui-quality/worldmap-open-node-selection/boss-open-open-node-selection-v1-mobile-390x844.png`

Important limitation: this strengthens open stage-node selected/current-state evidence, but it is still not full WorldMap node/body recomposition, final selected/focus approval, user acceptance, or release-ready UI.

## 2026-06-14 WorldMap Keyboard Selection-State Audit Continuation

Status remains `95% candidate, not final`.

Additional local continuation work:

- Extended `tools/ui-worldmap-keyboard-tooltip-audit.mjs` beyond tooltip/halo checks.
- The audit still covers lower-left, late-right, and boss-up direction-key selections across 1920x1080, 1280x720, and 390x844.
- It now also verifies the selected/current marker, halo, body, frame, and status badge are anchored to the keyboard-selected node.
- It verifies base current material for lower-left, late current material for late-right and boss-up, no conflicting completed/locked/sealed/dormant overlays on the selected node, no Phaser text/vector overlay leaks, and a `flow:stage_select:<stageId>` log entry.

Verification for this continuation:

```powershell
node tools\ui-worldmap-keyboard-tooltip-audit.mjs
node tools\ui-worldmap-open-node-selection-audit.mjs
npx.cmd tsc --noEmit
git diff --check
npm.cmd run check
$env:PHASER_SMOKE_PROGRESS='1'
$env:PHASER_SMOKE_PROGRESS_FILE='tmp/phaser-smoke-progress-worldmap-keyboard-selection-state-targeted.log'
$env:PHASER_SMOKE_ONLY='checkViewScreenshots,checkClickableControls,checkFullInputCoverage,checkUiSkinStates'
node tmp\run-phaser-smoke-with-vite.mjs
```

All listed checks passed. The strengthened keyboard tooltip audit passed with 9 cases:

- lower-left to `stage_sunny_gate` at 1920, 1280, and 390x844, with one current marker, one current halo, one base current body/frame, and one current status badge.
- late-right to `stage_prism_school` at 1920, 1280, and 390x844, with one current marker, one current halo, one late current body/frame, and one current status badge.
- boss-up to `stage_dream_arcade` at 1920, 1280, and 390x844, with one current marker, one current halo, one late current body/frame, and one current status badge.

Representative evidence:

- `tmp/ui-quality/worldmap-keyboard-tooltips/boss-up-keyboard-tooltip-v1-1920.png`
- `tmp/ui-quality/worldmap-keyboard-tooltips/boss-up-keyboard-tooltip-v1-desktop-1280.png`
- `tmp/ui-quality/worldmap-keyboard-tooltips/boss-up-keyboard-tooltip-v1-mobile-390x844.png`

Important limitation: this strengthens keyboard selected/current-state evidence, but it is still not full WorldMap node/body recomposition, final selected/focus approval, user acceptance, or release-ready UI.

## 2026-06-14 WorldMap Open Node Current-Stack Audit Continuation

Status remains `95% candidate, not final`.

Additional local continuation work:

- Strengthened `tools/ui-worldmap-open-node-tooltip-audit.mjs`.
- Strengthened `tools/ui-worldmap-open-node-down-audit.mjs`.
- Both audits still cover lower-open, mid-open, and boss-open unlocked stage nodes across 1920x1080, 1280x720, and 390x844.
- During hover, the tooltip audit now verifies the current marker, current halo, current body, current frame, and current status badge stay anchored to the original current node while the target node receives the second hover halo.
- During pointer-down, the down audit now verifies the same current stack remains anchored to the original current node while the target node receives the pressed-size halo.
- Both audits verify base current material for the lower current state, late current material for mid/boss current states, no conflicting completed/locked/sealed/dormant overlays on the current node, and no Phaser text/vector overlay leaks.

Verification for this continuation:

```powershell
node tools\ui-worldmap-open-node-tooltip-audit.mjs
node tools\ui-worldmap-open-node-down-audit.mjs
node tools\ui-worldmap-keyboard-tooltip-audit.mjs
node tools\ui-worldmap-open-node-selection-audit.mjs
npx.cmd tsc --noEmit
git diff --check
npm.cmd run check
$env:PHASER_SMOKE_PROGRESS='1'
$env:PHASER_SMOKE_PROGRESS_FILE='tmp/phaser-smoke-progress-worldmap-open-node-current-stack-targeted.log'
$env:PHASER_SMOKE_ONLY='checkViewScreenshots,checkClickableControls,checkFullInputCoverage,checkUiSkinStates'
node tmp\run-phaser-smoke-with-vite.mjs
```

All listed checks passed. The strengthened hover and down audits each passed with 9 cases:

- lower-open cases keep one current marker, one base current body/frame, one current status badge, and two halos during hover/down.
- mid-open cases keep one current marker, one late current body/frame, one current status badge, and two halos during hover/down.
- boss-open cases keep one current marker, one late current body/frame, one current status badge, and two halos during hover/down.

Representative evidence:

- `tmp/ui-quality/worldmap-open-node-tooltips/boss-open-open-node-tooltip-v1-1920.png`
- `tmp/ui-quality/worldmap-open-node-tooltips/boss-open-open-node-tooltip-v1-mobile-390x844.png`
- `tmp/ui-quality/worldmap-open-node-down/boss-open-open-node-down-v1-1920.png`
- `tmp/ui-quality/worldmap-open-node-down/boss-open-open-node-down-v1-mobile-390x844.png`

Important limitation: this strengthens open-node hover/down current-stack evidence, but it is still not full WorldMap node/body recomposition, final selected/focus approval, user acceptance, or release-ready UI.

## 2026-06-14 WorldMap Locked Node Current-Stack Audit Continuation

Status remains `95% candidate, not final`.

Additional local continuation work:

- Strengthened `tools/ui-worldmap-locked-tooltip-audit.mjs`.
- The audit still covers sealed-next, dormant-mid, red-far, red-next, and red-boss locked node families across 1920x1080, 1280x720, and 390x844.
- Locked hover and locked click now both verify the current stage id remains unchanged and the original current marker, halo, body, frame, and status badge stay anchored to the current node.
- The audit verifies base current material for lower current states, late current material for upper current states, no conflicting completed/locked/sealed/dormant overlays on the current node, and no Phaser text/vector overlay leaks.

Verification for this continuation:

```powershell
node tools\ui-worldmap-locked-tooltip-audit.mjs
node tools\ui-worldmap-keyboard-tooltip-audit.mjs
node tools\ui-worldmap-open-node-tooltip-audit.mjs
node tools\ui-worldmap-open-node-down-audit.mjs
node tools\ui-worldmap-open-node-selection-audit.mjs
npx.cmd tsc --noEmit
git diff --check
npm.cmd run check
$env:PHASER_SMOKE_PROGRESS='1'
$env:PHASER_SMOKE_PROGRESS_FILE='tmp/phaser-smoke-progress-worldmap-locked-current-stack-targeted.log'
$env:PHASER_SMOKE_ONLY='checkViewScreenshots,checkClickableControls,checkFullInputCoverage,checkUiSkinStates'
node tmp\run-phaser-smoke-with-vite.mjs
```

All listed checks passed. The strengthened locked tooltip audit passed with 15 cases:

- sealed-next, dormant-mid, and red-far keep one current marker, one current halo, one base current body/frame, and one current status badge.
- red-next and red-boss keep one current marker, one current halo, one late current body/frame, and one current status badge.
- Locked clicks leave `context.run.stageId` unchanged while preserving the current stack and danger-tone tooltip evidence.

Representative evidence:

- `tmp/ui-quality/worldmap-locked-tooltips/red-boss-locked-tooltip-v1-1920.png`
- `tmp/ui-quality/worldmap-locked-tooltips/red-boss-locked-tooltip-v1-desktop-1280.png`
- `tmp/ui-quality/worldmap-locked-tooltips/red-boss-locked-tooltip-v1-mobile-390x844.png`

Important limitation: this strengthens locked-node hover/click current-stack evidence, but it is still not full WorldMap node/body recomposition, final selected/focus approval, user acceptance, or release-ready UI.

## 2026-06-14 WorldMap Locked Target-Stack Audit Continuation

Status remains `95% candidate, not final`.

Additional local continuation work:

- Strengthened `tools/ui-worldmap-locked-tooltip-audit.mjs` again.
- The audit still covers sealed-next, dormant-mid, red-far, red-next, and red-boss locked node families across 1920x1080, 1280x720, and 390x844.
- Locked hover and locked click now verify the hovered/clicked target node itself keeps the correct state family:
  - sealed-next uses `sealed-base` body/frame/badge.
  - dormant-mid uses `dormant-mid` body/frame and no wrong badge family.
  - red-far uses far red locked body/frame/badge.
  - red-next uses next/base red locked body/frame/badge.
  - red-boss uses boss red locked body/frame/badge.
- The same audit verifies no current, completed, or wrong locked/sealed/dormant stack appears on the target during locked hover/click.

Verification for this continuation:

```powershell
node tools\ui-worldmap-locked-tooltip-audit.mjs
node tools\ui-worldmap-keyboard-tooltip-audit.mjs
node tools\ui-worldmap-open-node-tooltip-audit.mjs
node tools\ui-worldmap-open-node-down-audit.mjs
node tools\ui-worldmap-open-node-selection-audit.mjs
npx.cmd tsc --noEmit
git diff --check
npm.cmd run check
$env:PHASER_SMOKE_PROGRESS='1'
$env:PHASER_SMOKE_PROGRESS_FILE='tmp/phaser-smoke-progress-worldmap-locked-target-stack-targeted.log'
$env:PHASER_SMOKE_ONLY='checkViewScreenshots,checkClickableControls,checkFullInputCoverage,checkUiSkinStates'
node tmp\run-phaser-smoke-with-vite.mjs
```

All listed checks passed. The strengthened locked tooltip audit passed with 15 cases and reported target families `sealed-base`, `dormant-mid`, `red-far`, `red-next`, and `red-boss`, each with `targetBody`, `targetFrame`, and the badge/no-wrong-badge gate as `ok`.

Representative evidence:

- `tmp/ui-quality/worldmap-locked-tooltips/sealed-next-locked-tooltip-v1-1920.png`
- `tmp/ui-quality/worldmap-locked-tooltips/dormant-mid-locked-tooltip-v1-1920.png`
- `tmp/ui-quality/worldmap-locked-tooltips/red-far-locked-tooltip-v1-1920.png`
- `tmp/ui-quality/worldmap-locked-tooltips/red-next-locked-tooltip-v1-1920.png`
- `tmp/ui-quality/worldmap-locked-tooltips/red-boss-locked-tooltip-v1-1920.png`

Important limitation: this strengthens locked-target disabled-state evidence, but it is still not full WorldMap node/body recomposition, final selected/focus approval, user acceptance, or release-ready UI.

## 2026-06-14 WorldMap Open Target-Stack Audit Continuation

Status remains `95% candidate, not final`.

Additional local continuation work:

- Strengthened `tools/ui-worldmap-open-node-tooltip-audit.mjs` again.
- Strengthened `tools/ui-worldmap-open-node-down-audit.mjs` again.
- Both audits still cover lower-open, mid-open, and boss-open unlocked stage nodes across 1920x1080, 1280x720, and 390x844.
- During hover and pointer-down, the target open node now directly verifies its own completed state stack:
  - lower-open uses the `completed-base` body/frame/badge family.
  - mid-open and boss-open use the `completed-late` body/frame/badge family.
- The same audits verify the target has no current marker/body/frame/status stack and no locked/sealed/dormant stack while hover/down feedback is active.

Verification for this continuation:

```powershell
node tools\ui-worldmap-open-node-tooltip-audit.mjs
node tools\ui-worldmap-open-node-down-audit.mjs
node tools\ui-worldmap-open-node-selection-audit.mjs
node tools\ui-worldmap-keyboard-tooltip-audit.mjs
node tools\ui-worldmap-locked-tooltip-audit.mjs
npx.cmd tsc --noEmit
git diff --check
npm.cmd run check
$env:PHASER_SMOKE_PROGRESS='1'
$env:PHASER_SMOKE_PROGRESS_FILE='tmp/phaser-smoke-progress-worldmap-open-target-stack-targeted.log'
$env:PHASER_SMOKE_ONLY='checkViewScreenshots,checkClickableControls,checkFullInputCoverage,checkUiSkinStates'
node tmp\run-phaser-smoke-with-vite.mjs
```

All listed checks passed. The strengthened open tooltip and down audits each passed 9 cases and reported:

- lower-open target completed family `completed-base` with target completed body/frame/badge `ok`.
- mid-open target completed family `completed-late` with target completed body/frame/badge `ok`.
- boss-open target completed family `completed-late` with target completed body/frame/badge `ok`.

Representative evidence:

- `tmp/ui-quality/worldmap-open-node-tooltips/lower-open-open-node-tooltip-v1-1920.png`
- `tmp/ui-quality/worldmap-open-node-tooltips/mid-open-open-node-tooltip-v1-1920.png`
- `tmp/ui-quality/worldmap-open-node-tooltips/boss-open-open-node-tooltip-v1-1920.png`
- `tmp/ui-quality/worldmap-open-node-down/lower-open-open-node-down-v1-1920.png`
- `tmp/ui-quality/worldmap-open-node-down/mid-open-open-node-down-v1-1920.png`
- `tmp/ui-quality/worldmap-open-node-down/boss-open-open-node-down-v1-1920.png`

Important limitation: this strengthens open-node target completed-stack evidence, but it is still not full WorldMap node/body recomposition, final selected/focus approval, user acceptance, or release-ready UI.

## 2026-06-14 WorldMap Route-Interaction Audit Continuation

Status remains `95% candidate, not final`.

Additional local continuation work:

- Added `tools/ui-worldmap-route-interaction-audit.mjs`.
- The new audit verifies that WorldMap route overlays stay stable during node interactions:
  - open-node hover and pointer-down for lower-open, mid-open, and boss-open targets.
  - locked-node hover and click for sealed-next, dormant-mid, red-far, red-next, and red-boss targets.
- It checks base completed route threads/beads, current/final route threads/beads, and muted locked/future route threads/beads against expected counts, placement, display size, alpha, and rotation.
- It also verifies the old `ui_hover_route_node_concept` route-hover image does not leak back into the route interaction path.

Verification for this continuation:

```powershell
node tools\ui-worldmap-route-interaction-audit.mjs
node tools\ui-worldmap-open-node-tooltip-audit.mjs
node tools\ui-worldmap-open-node-down-audit.mjs
node tools\ui-worldmap-open-node-selection-audit.mjs
node tools\ui-worldmap-keyboard-tooltip-audit.mjs
node tools\ui-worldmap-locked-tooltip-audit.mjs
npx.cmd tsc --noEmit
git diff --check
npm.cmd run check
$env:PHASER_SMOKE_PROGRESS='1'
$env:PHASER_SMOKE_PROGRESS_FILE='tmp/phaser-smoke-progress-worldmap-route-interaction-targeted.log'
$env:PHASER_SMOKE_ONLY='checkViewScreenshots,checkClickableControls,checkFullInputCoverage,checkUiSkinStates'
node tmp\run-phaser-smoke-with-vite.mjs
```

All listed checks passed when rerun serially. A first attempt to run three browser audits in parallel timed out from resource contention; the stale audit processes were stopped and each audit passed on serial rerun. The new route-interaction audit passed 48 interaction cases across 1920x1080, 1280x720, and 390x844.

Representative route evidence:

- `tmp/ui-quality/worldmap-route-interactions/lower-open-route-hover-v1-1920.png`
- `tmp/ui-quality/worldmap-route-interactions/lower-open-route-down-v1-1920.png`
- `tmp/ui-quality/worldmap-route-interactions/mid-open-route-down-v1-1920.png`
- `tmp/ui-quality/worldmap-route-interactions/boss-open-route-down-v1-1920.png`
- `tmp/ui-quality/worldmap-route-interactions/sealed-next-route-locked-click-v1-1920.png`
- `tmp/ui-quality/worldmap-route-interactions/red-next-route-locked-click-v1-1920.png`
- `tmp/ui-quality/worldmap-route-interactions/red-boss-route-locked-click-v1-1920.png`

Important limitation: this strengthens route-state stability evidence during interaction, but it is still not full WorldMap route recomposition, final selected/focus approval, user acceptance, or release-ready UI.

## 2026-06-14 WorldMap Selection Route-Stack Audit Continuation

Status remains `95% candidate, not final`.

Additional local continuation work:

- Strengthened `tools/ui-worldmap-open-node-selection-audit.mjs`.
- The audit still clicks lower-open, mid-open, and boss-open unlocked WorldMap stage nodes across 1920x1080, 1280x720, and 390x844.
- After click, it waits for `context.run.stageId` to become the clicked stage, moves the pointer away, then verifies the selected/current marker, halo, body, frame, and status stack on the clicked node.
- It now also verifies route-stack recomposition after the selected current stage changes:
  - base completed route thread/bead count, placement, display size, alpha, and rotation.
  - current/final route thread/bead count, placement, display size, alpha, and rotation.
  - muted locked/future route thread/bead count, placement, display size, alpha, and rotation.
  - zero old `ui_hover_route_node_concept` route-hover images.

Verification for this continuation:

```powershell
node tools\ui-worldmap-open-node-selection-audit.mjs
node tools\ui-worldmap-route-interaction-audit.mjs
node tools\ui-worldmap-open-node-tooltip-audit.mjs
node tools\ui-worldmap-open-node-down-audit.mjs
node tools\ui-worldmap-keyboard-tooltip-audit.mjs
node tools\ui-worldmap-locked-tooltip-audit.mjs
npx.cmd tsc --noEmit
git diff --check
npm.cmd run check
$env:PHASER_SMOKE_PROGRESS='1'
$env:PHASER_SMOKE_PROGRESS_FILE='tmp/phaser-smoke-progress-worldmap-selection-route-stack-targeted.log'
$env:PHASER_SMOKE_ONLY='checkViewScreenshots,checkClickableControls,checkFullInputCoverage,checkUiSkinStates'
node tmp\run-phaser-smoke-with-vite.mjs
```

All listed checks passed. `npm.cmd run check` still reports only the existing Vite large JS chunk warning. The strengthened open-node selection audit passed 9 cases and now reports route recomposition counts, including:

- lower-open after selection: route base `0/0`, route current `0/0`, locked route threads `7/7`, locked route beads `9/9`.
- mid-open after selection: route base threads `6/6`, current threads `1/1`, base beads `10/10`, current beads `1/1`, locked route threads `3/3`, locked route beads `4/4`.
- boss-open after selection: route base threads `10/10`, current threads `1/1`, base beads `17/17`, current beads `2/2`, locked route threads `0/0`, locked route beads `1/1`.

Representative evidence:

- `tmp/ui-quality/worldmap-open-node-selection/lower-open-open-node-selection-v1-1920.png`
- `tmp/ui-quality/worldmap-open-node-selection/mid-open-open-node-selection-v1-1920.png`
- `tmp/ui-quality/worldmap-open-node-selection/boss-open-open-node-selection-v1-1920.png`

Important limitation: this strengthens post-click route recomposition evidence, but the project is still `95% candidate, not final`. Full WorldMap node/body/route recomposition approval, broader selected/focus approval, user acceptance, and release-ready UI remain unfinished.
