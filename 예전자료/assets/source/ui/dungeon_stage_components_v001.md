# Dungeon Stage Components v001

Date: 2026-06-02

Purpose: source pass for the Dungeon UI rebuild. This is not final approved production art.

## Source Direction

- Converts Dungeon from a standard shell plus current-room text into a paper-theater first-person corridor.
- Keeps the existing smoke-covered `방 입장` click coordinate at `1010,582`.
- Shows the current room as the truth source, without implying that full spatial dungeon navigation is complete.
- Uses a left exploration ledger, a center paper corridor/door, and a right route ledger.
- Shares Town and WorldMap paper-stage materials so the flow `Town -> WorldMap -> Dungeon` reads as one game object family.

## Current Status

This is candidate source evidence only. It does not complete the UI skin gate without debug-less screenshots, scoring, full primary-screen coverage, final art approval, user acceptance, and automated verification.

Evidence for this pass:

- `tmp/ui-quality/dungeon-1920-debugless-v1.png`
- `tmp/ui-quality/dungeon-1280-debugless-v1.png`
- `tmp/ui-quality/dungeon-release-1920-debugless-v1.png`
- `tmp/ui-quality/dungeon-1920-debugless-v2.png`
- `tmp/ui-quality/dungeon-1280-debugless-v2.png`
- `tmp/ui-quality/dungeon-release-1920-debugless-v2.png`
- `tmp/ui-quality/dungeon-1920-debugless-v3.png`
- `tmp/ui-quality/dungeon-1280-debugless-v3.png`
- `tmp/ui-quality/dungeon-release-1920-debugless-v3.png`

Review notes:

- v1 exposed right route-ledger crowding near the helper panel.
- v2 limited the visible route window to six entries and removed the route/helper collision.
- The first `phaser:smoke` run after v2 found the center room number overlapping `방 입장`; v3 moves the room number above the button while preserving the `1010,582` button coordinate.
- The v3 captures are debug-less and show full-canvas 1920, 1280, and release-mode Dungeon views.

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

- This visual pass does not complete a free-look, turn-left/right, minimap, or full spatial navigation system.
- The room door and corridor are candidate source shapes, not final painted dungeon art.
- Release stages with longer routes need screenshot review because only a local route window is shown in the right ledger.
