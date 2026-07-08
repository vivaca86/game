# World Map Stage Components v002

Date: 2026-06-02

Purpose: second source pass for WorldMap. This is not final approved production art and does not complete the UI skin gate.

## Source Direction

- Extends the v001 unfolded paper-map screen with real stage rows instead of a single decorative current-map entry.
- Shows three explicit row states: current/complete, selectable, and next locked.
- Keeps the existing smoke-covered `던전으로` click coordinate at `1010,512`.
- Keeps the actual selected stage route in the center folded route sheet, while the left drawer exposes unlocked/current/next-locked stage state.
- Adds a route-ledger copy rule: short labels only, no clipped helper blocks near the lower right panel.

## Runtime Mapping

- `WorldMapScene` builds rows from `save.profile.unlockedStages`, `save.profile.completedStages`, the current stage, and the first locked stage in `dataBundle.stages`.
- Unlocked non-current rows are clickable through `selectWorldMapStage`, which resets the run to room 0 on that stage and persists it back to the active save.
- Stage clear save sync now adds the completed stage to `profile.completedStages`, keeps it unlocked, and unlocks the next stage in the ordered stage list.
- Debug smoke exposes `unlockedStages=` and verifies selecting `stage_lavender_hall` after clearing `stage_sunny_gate`.

## Current Status

This is candidate source evidence only. It raises WorldMap from a visual-only route surface toward a functional map-selection surface, but it is still not a full production world map.

Captured evidence for this pass:

- `tmp/ui-quality/world-map-1920-debugless-v4.png`
- `tmp/ui-quality/world-map-1280-debugless-v4.png`
- `tmp/ui-quality/world-map-release-1920-debugless-v4.png`
- `tmp/ui-quality/world-map-release-unlocked-1920-debugless-v4.png`
- `tmp/ui-quality/world-map-release-selected-1920-debugless-v4.png`
- `tmp/ui-quality/world-map-1920-debugless-v5.png`
- `tmp/ui-quality/world-map-1280-debugless-v5.png`
- `tmp/ui-quality/world-map-release-1920-debugless-v5.png`
- `tmp/ui-quality/world-map-release-unlocked-1920-debugless-v5.png`
- `tmp/ui-quality/world-map-release-selected-1920-debugless-v5.png`

Screenshot review findings:

- v4 proved the new stage drawer and release selection states, but the right ledger helper sat too close to the bottom border and row status strings were too long for the compact drawer.
- v5 shortens row states and the right ledger helper. Slice 1920/1280 and release default/unlocked/selected screenshots no longer show the earlier bottom clipping.
- The 1280 view remains compact and the screen still shows a limited drawer around unlocked/current/next-locked rows instead of a final full 15-stage atlas.

Verification performed for this pass:

- `npx.cmd tsc --noEmit`
- `npm.cmd run phaser:smoke`
- `npm.cmd run check`
- `npm.cmd run data:validate`
- `npm.cmd run quality:audit:report`
- `npm.cmd run assets:audit`
- `npm.cmd run assets:audit:release-visuals`
- `git diff --check`

Known limits:

- This is not a complete multi-biome atlas or final stage-select UX.
- It proves the first next-stage unlock and selectable-stage path only.
- It does not complete stage progression, map art, stage-specific mechanics, balance, or final responsive polish.
