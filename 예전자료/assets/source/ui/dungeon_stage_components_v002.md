# Dungeon Stage Components v002

Date: 2026-06-02

Purpose: second source pass for Dungeon. This is not final approved production art and does not complete the UI skin gate.

## Source Direction

- Keeps the v001 paper-theater corridor, but makes the visible decision surface more state-driven.
- Adds explicit current-room, next-room intel, boss-distance, and resource rows to the left exploration ledger.
- Adds center intel cards for the current marker and the next marker. The next marker only becomes specific when a real reveal source exists, such as `relic_soft_compass`.
- Adds route-row state labels: completed, current, next, and waiting.
- Keeps the existing smoke-covered `방 입장` click coordinate at `1010,582`.

## Runtime Mapping

- Current room is read from `getCurrentRoom`.
- Next-room reveal uses `getRevealedNextRoomType`, which is driven by owned relic effects.
- Boss distance is derived from the active stage route and current `roomIndex`.
- The right route ledger is a window over the actual stage route, not a decorative static path.

## Current Status

This is candidate source evidence only. It raises Dungeon from a static corridor screen toward a readable room-progression surface, but it does not implement free-look, turn-left/right movement, branching route choice, or a final spatial dungeon system.

Screenshot evidence for this pass:

- `tmp/ui-quality/dungeon-1920-debugless-v4.png`
- `tmp/ui-quality/dungeon-1280-debugless-v4.png`
- `tmp/ui-quality/dungeon-release-1920-debugless-v4.png`
- `tmp/ui-quality/dungeon-release-compass-1920-debugless-v4.png`
- `tmp/ui-quality/dungeon-1920-debugless-v5.png`
- `tmp/ui-quality/dungeon-1280-debugless-v5.png`
- `tmp/ui-quality/dungeon-release-1920-debugless-v5.png`
- `tmp/ui-quality/dungeon-release-compass-1920-debugless-v5.png`
- `tmp/phaser-dungeon-release-soft-compass.png`

Visual review:

- v4 was rejected because the next-room intel card overlapped the right route panel.
- v5 fixes that overlap and is accepted as progress evidence only, not final UI completion.

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

- This pass proves screen readability and next-room intel surfacing only.
- It does not complete full dungeon navigation, branching decisions, encounter pacing, or final dungeon background art.
- 1280x720 still needs screenshot review because the screen is information-dense.
