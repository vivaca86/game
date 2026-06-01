# Result Stage Components v002

Date: 2026-06-02

Purpose: second source pass for Result. This is not final approved production art and does not complete the UI skin gate.

## Source Direction

- Keeps the v001 curtain-call certificate, but makes the center panel communicate actual run consequences.
- Adds a progress ticket beside the seal: rooms reached and route composition.
- Adds a next-action record line under the return action: next stage after clear, retry after defeat, or save-preserving return.
- Changes the collection ledger deck row into total deck plus newly added card count.
- Changes the collection helper copy into a compact preservation summary for cards, runes, relics, and arcanas.
- Keeps the smoke-covered `마을로` click coordinate at `1010,742`.

## Runtime Mapping

- Result tone still comes from current HP and completed-stage state.
- Progress ticket uses the current stage route length, current room index, and route room-type counts.
- Next record uses the stage order in the loaded data bundle.
- Collection summary uses current run deck, runes, relics, arcanas, and the active character starter deck size.

## Current Status

This is candidate source evidence only. It raises Result toward a clearer run-recap screen, but it does not implement ending cinematics, achievements, full long-term progression recap, final result art, or balance review.

Accepted progress screenshot evidence for this pass:

- `tmp/ui-quality/result-1920-debugless-v5.png`
- `tmp/ui-quality/result-1280-debugless-v5.png`
- `tmp/ui-quality/result-defeat-1920-debugless-v5.png`
- `tmp/ui-quality/result-clear-1920-debugless-v5.png`
- `tmp/ui-quality/result-release-clear-1920-debugless-v5.png`

Rejected checkpoints before the accepted v5 set:

- v2 put the next-action ticket too far right, where release-clear Result hid it under the collection ledger.
- v3 moved the ticket into a top ribbon, but the ribbon was too cramped for longer next-action copy.
- v4 widened the ribbon, but then it visually collided with the central result title.
- v5 moves next-action copy into the lower record row, preserving clear result hierarchy and the `마을로` action coordinate.

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

- This pass proves run-recap readability only.
- It does not complete Result/progression systems.
- The progress ticket and next record are summary surfaces, not final ending/achievement presentation.
