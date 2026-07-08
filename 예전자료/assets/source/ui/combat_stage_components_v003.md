# Combat Stage Components v003

Date: 2026-06-02

Purpose: third source pass for the Combat UI rebuild. This is not final approved production art.

## Changes From v002

- Adds a clearer title ribbon with a separate turn badge so the input hint and current turn do not compete with the route.
- Rebuilds the left player panel as a ledger with a header rail, gold badge, and three stat tags.
- Rebuilds the right enemy panel as an intent ledger with enemy name, HP, block, mark, portrait stamp, and intent row.
- Strengthens the center combat-flow lane so the player standee, current action, and enemy intent read as one paper-stage mechanism.
- Keeps the hand shelf and existing card click coordinates unchanged.
- Keeps the End Turn button coordinate area unchanged so existing smoke tests still cover the same player action.
- Removes the previous duplicate runtime overlay approach so route labels, enemy stats, and Boss shared combat panel text do not show through older layers.
- Adds a long-enemy-name font-size guard for release enemies such as `프리즘 눈부심 장난꾼`.

## Current Status

This is a candidate source sheet for the runtime Combat v3 layout. It is source-direction evidence only. It does not complete the UI skin gate without screenshot scoring, full primary-screen coverage, final art approval, and automated verification.

Final v7 evidence for this pass:

- `tmp/ui-quality/combat-1920-debugless-v7.png`
- `tmp/ui-quality/combat-1280-debugless-v7.png`
- `tmp/ui-quality/combat-release-1920-debugless-v7.png`
- `tmp/ui-quality/boss-combat-panel-1920-debugless-v7.png`

Verification passed after the long-name overlap fix with `npm.cmd run phaser:smoke`, `npm.cmd run check`, `npm.cmd run data:validate`, `npm.cmd run quality:audit:report`, `npm.cmd run assets:audit`, `npm.cmd run assets:audit:release-visuals`, and `git diff --check`. The Vite large JS chunk warning still remains a separate Performance gate risk.
