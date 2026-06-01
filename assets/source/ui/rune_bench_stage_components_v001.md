# Rune Bench Stage Components v001

Date: 2026-06-02

Purpose: source pass for the RuneBench UI rebuild. This is not final approved production art.

## Source Direction

- Converts RuneBench from a standard shell plus rune text rows into a paper-theater socket workbench.
- Keeps the existing smoke-covered `룬 장착` click coordinate at `1010,742`.
- Shows the rune inventory, the target card, the rune stone, and the socket ledger without implying that full rune balance or buildcraft is complete.
- Shares the Town, WorldMap, Dungeon, Reward, Event, and Combat paper-stage material language.

## Current Status

This is candidate source evidence only. It does not complete the UI skin gate without debug-less screenshots, scoring, full primary-screen coverage, final art approval, user acceptance, and automated verification.

Evidence for this pass:

- `tmp/ui-quality/rune-bench-1920-debugless-v1.png`
- `tmp/ui-quality/rune-bench-1280-debugless-v1.png`
- `tmp/ui-quality/rune-bench-release-1920-debugless-v1.png`
- `tmp/ui-quality/rune-bench-1920-debugless-v2.png`
- `tmp/ui-quality/rune-bench-1280-debugless-v2.png`
- `tmp/ui-quality/rune-bench-release-1920-debugless-v2.png`
- `tmp/ui-quality/rune-bench-1920-debugless-v3.png`
- `tmp/ui-quality/rune-bench-1280-debugless-v3.png`
- `tmp/ui-quality/rune-bench-release-1920-debugless-v3.png`

Review notes:

- v1 exposed the `룬 장착` button visually covering the target-card preview.
- v2 moved the target card left while preserving the `1010,742` button coordinate.
- v2 also exposed raw internal effect op text such as `modify_damage_percent`; v3 replaces that with Korean effect summaries.
- The v3 captures are debug-less and show full-canvas 1920, 1280, and release-mode RuneBench views.

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

- This visual pass does not complete rune balance, rune acquisition pacing, full socket progression, or final rune art approval.
- The target card preview is a deterministic preview of the first compatible card, not a full manual selection UI.
- Release-mode rune names and effects need screenshot review because the local catalog can produce longer text than the slice fixture.
