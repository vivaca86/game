# Town Stage Components v001

Date: 2026-06-02

Purpose: source pass for the Town UI rebuild. This is not final approved production art.

## Source Direction

- Converts Town from a standard shell plus button list into a paper-theater village hub.
- Uses the same material language as Reward/Event/Combat/Boss: pinned title ribbon, side paper wings, warm paper panels, brass trim, and readable ledger surfaces.
- Keeps the existing smoke-covered Town click coordinates:
  - `1010,642` world map
  - `1010,724` save reset
  - `1010,806` settings
- Shows only current verified state: active stage, unlocked count, completed count, first route marks, character passport, HP, gold, and save-derived completed-stage record.

## Current Status

This is candidate source evidence only. It does not complete the UI skin gate without scoring, full primary-screen coverage, final art approval, user acceptance, and final debug-less screenshot acceptance.

Captured evidence for this pass:

- `tmp/ui-quality/town-1920-debugless-v4.png`
- `tmp/ui-quality/town-1280-debugless-v4.png`
- `tmp/ui-quality/town-release-1920-debugless-v4.png`

Issues caught during this pass:

- The first screenshot pass placed route markers behind the `세계 지도` action button, so the route markers were shifted to the right side of the expedition board.
- The village building labels and passport footer text were crowded by the passport panel, so the labels were moved upward and the extra footer line was removed.
- The tooltip initially described a keyboard shortcut, so it was rewritten as in-world state text rather than visible usage instructions.

Verification performed:

- `npx.cmd tsc --noEmit`
- `npm.cmd run phaser:smoke`
- `npm.cmd run check`
- `npm.cmd run data:validate`
- `npm.cmd run quality:audit:report`
- `npm.cmd run assets:audit`
- `npm.cmd run assets:audit:release-visuals`
- `git diff --check`

The Town visual pass is a strong progress checkpoint, not final UI completion.
