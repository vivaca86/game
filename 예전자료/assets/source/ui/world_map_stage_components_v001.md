# World Map Stage Components v001

Date: 2026-06-02

Purpose: source pass for the WorldMap UI rebuild. This is not final approved production art.

## Source Direction

- Converts WorldMap from a standard shell plus one button into a paper-theater unfolded map.
- Keeps the existing smoke-covered `던전으로` click coordinate at `1010,512`.
- Shows the current run's stage route as the truth source, without implying that full multi-stage selection UI is complete.
- Uses a left map-drawer ledger for unlocked maps, a center folded route sheet, and a right route record ledger.
- Shares the Town paper-stage language so the Town -> WorldMap transition feels like the same game object family.

## Current Status

This is candidate source evidence only. It does not complete the UI skin gate without full primary-screen coverage, final art approval, user acceptance, and the 95-point rubric result.

Captured evidence for this pass:

- `tmp/ui-quality/world-map-1920-debugless-v1.png`
- `tmp/ui-quality/world-map-1280-debugless-v1.png`
- `tmp/ui-quality/world-map-release-1920-debugless-v1.png`
- `tmp/ui-quality/world-map-1920-debugless-v2.png`
- `tmp/ui-quality/world-map-1280-debugless-v2.png`
- `tmp/ui-quality/world-map-release-1920-debugless-v2.png`
- `tmp/ui-quality/world-map-1920-debugless-v3.png`
- `tmp/ui-quality/world-map-1280-debugless-v3.png`
- `tmp/ui-quality/world-map-release-1920-debugless-v3.png`

Screenshot review findings:

- v1 was rejected because the right detail ledger and tooltip crowded the bottom route area, the route/button relationship was visually heavy, and a dev-status-like helper line did not belong in the in-game surface.
- v2 improved the in-world copy, but release route nodes 6/7 still sat too close to the right record panel and the bottom helper text clipped.
- v3 rerouted later nodes back toward the center-left and replaced the tooltip with a simple line inside the record ledger. Slice and release screenshots no longer show the right ledger covering route nodes. The 1280 view remains tight, so this is progress evidence only.

Verification performed:

- `npx.cmd tsc --noEmit`
- `npm.cmd run phaser:smoke`
- `npm.cmd run check`
- `npm.cmd run data:validate`
- `npm.cmd run quality:audit:report`
- `npm.cmd run assets:audit`
- `npm.cmd run assets:audit:release-visuals`
- `git diff --check`

Known limits:

- The screen still exposes the current route, not a complete multi-stage selectable map system.
- The source sheet is a candidate source pass, not final approved production art.
- 1280x720 is readable but compressed, so responsive polish remains part of the larger UI gate.
