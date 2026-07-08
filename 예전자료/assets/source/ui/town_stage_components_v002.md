# Town Stage Components v002

Date: 2026-06-02

Purpose: second source pass for Town. This is not final approved production art and does not complete the UI skin gate.

## Source Direction

- Keeps the v001 paper-theater village hub, but makes the screen more clearly save/profile-driven.
- Adds building tags for map readiness, current expedition readiness, and the next sealed chapter.
- Changes the expedition board from simple counts into an expedition dossier with unlocked/completed/remaining counts, next expedition, completed-stage stamps, route preview, and next locked stage.
- Keeps the smoke-covered Town click coordinates:
  - `1010,642` world map
  - `1010,724` save reset
  - `1010,806` settings

## Runtime Mapping

- Unlocked, completed, and remaining counts come from `save.profile` and `dataBundle.stages`.
- The next expedition is the first unlocked stage that is not completed, falling back to the current run stage.
- The next sealed chapter is the first stage not present in `save.profile.unlockedStages`.
- Completed-stage stamps resolve stage ids to Korean stage names instead of raw ids.
- The route preview is derived from the next expedition stage route.

## Current Status

This is candidate source evidence only. It raises Town from a thematic first hub toward a clearer progression hub, but it does not implement shops, upgrades, character unlock management, museum surfaces, relic/arcana galleries, or final town art.

Screenshot evidence for this candidate pass:

- `tmp/ui-quality/town-1920-debugless-v8.png`
- `tmp/ui-quality/town-1280-debugless-v8.png`
- `tmp/ui-quality/town-release-1920-debugless-v8.png`
- `tmp/ui-quality/town-release-progress-1920-debugless-v8.png`

Failed visual checkpoints before v8:

- v5 used a separate next-sealed card that crowded the route preview.
- v6 moved that information to the board bottom, but the bottom text sat too close to the panel edge.
- v7 moved it upward, but the line still sat too close to the next-expedition slot in the progressed release capture.
- v8 shortens the label and keeps it inside the remaining-stage stat area.

Verification performed before scoring this pass:

- `npx.cmd tsc --noEmit`
- `npm.cmd run phaser:smoke`
- `npm.cmd run check`
- `npm.cmd run data:validate`
- `npm.cmd run quality:audit:report`
- `npm.cmd run assets:audit`
- `npm.cmd run assets:audit:release-visuals`
- `git diff --check`

Known limits:

- This pass proves save/profile readability only.
- It does not complete Town/meta gameplay systems.
- The building tags are status summaries, not final interactive buildings.
- The preserved action-button rail is still a candidate layout, not final town interaction design.
