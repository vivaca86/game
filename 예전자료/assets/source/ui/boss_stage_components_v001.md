# Boss Stage Components v001

Date: 2026-06-02

Purpose: source pass for the Boss UI rebuild. This is not final approved production art.

## Source Direction

- Reuses the Combat v3 paper-theater structure so Boss is not a separate flat standard-shell screen.
- Changes the combat ribbon, side wings, and boss ledger accents to deeper purple and brass.
- Adds a boss phase ledger inside the playfield for phase state and next-attack bonus.
- Keeps the enemy intent ledger, player ledger, route strip, hand shelf, five-card hand, and End Turn interaction in the same coordinate family as Combat.
- Keeps card click targets and the End Turn button coordinate area smoke-compatible.

## Current Status

This is candidate source evidence only. It does not complete the UI skin gate without scoring, full primary-screen coverage, final art approval, user acceptance, and final debug-less screenshot acceptance.

Captured evidence for this pass:

- `tmp/ui-quality/boss-1920-debugless-v4.png`
- `tmp/ui-quality/boss-1280-debugless-v4.png`
- `tmp/ui-quality/boss-release-1920-debugless-v4.png`

Issues caught during this pass:

- The first smoke pass caught the new boss phase ledger overlapping hand-card numbers, so the ledger was moved upward and tightened before acceptance screenshots.
- The release boss intent label was too long near the End Turn area, so boss intent labels now use compact effect summaries such as `공격 14`.
- An intermediate smoke attempt exceeded the shorter command timeout; the smoke-created helper process was cleaned up and the smoke was rerun with a longer timeout.

Verification performed:

- `npx.cmd tsc --noEmit`
- `npm.cmd run phaser:smoke`
- `npm.cmd run check`
- `npm.cmd run data:validate`
- `npm.cmd run quality:audit:report`
- `npm.cmd run assets:audit`
- `npm.cmd run assets:audit:release-visuals`
- `git diff --check`

The Boss visual pass is a strong progress checkpoint, not final UI completion.
