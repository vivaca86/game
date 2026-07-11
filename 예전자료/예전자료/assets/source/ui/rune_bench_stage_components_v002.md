# Rune Bench Stage Components v002

Date: 2026-06-02

Purpose: second source pass for RuneBench. This is not final approved production art and does not complete the UI skin gate.

## Source Direction

- Keeps the v001 paper-theater socket workbench, but makes the visible decision surface more state-driven.
- Adds compact before/after cards for the selected target card's cost, damage, and block preview.
- Adds a compatibility proof band so the player can see why the selected rune can attach to the current target.
- Adds a ledger change row so the right panel is not only owned/equipped counts.
- Keeps the existing smoke-covered `룬 장착` click coordinate at `1010,742`.

## Runtime Mapping

- The selected rune is the first available run rune, matching the current deterministic equip behavior.
- The target card is the first compatible deck card that is not already carrying that rune.
- The before stats use currently attached runes through the rune runtime helpers.
- The after stats apply the selected rune's effect as a preview without mutating state.
- The socket/compatibility line is derived from card type, rune valid types, and default-unlocked rune slots.

## Current Status

This is candidate source evidence only. It raises RuneBench from a visual socket table toward a readable buildcraft preview, but it does not implement manual card selection, full rune sorting, socket progression, balance validation, or final rune art.

Screenshot evidence for this pass:

- `tmp/ui-quality/rune-bench-1920-debugless-v4.png`
- `tmp/ui-quality/rune-bench-1280-debugless-v4.png`
- `tmp/ui-quality/rune-bench-release-1920-debugless-v4.png`
- `tmp/ui-quality/rune-bench-1920-debugless-v5.png`
- `tmp/ui-quality/rune-bench-1280-debugless-v5.png`
- `tmp/ui-quality/rune-bench-release-1920-debugless-v5.png`

Visual review:

- v4 exposed an automated text-overlap failure between a decorative `룬` label and the rune stone's socket label.
- v5 removes that decorative label and is accepted as progress evidence only, not final UI completion.

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

- This pass proves decision readability only.
- It does not complete full rune selection, upgrade/socket unlock pacing, or rune balance.
- The after-preview supports the currently implemented rune modifier operations, not a final comprehensive tooltip system.
