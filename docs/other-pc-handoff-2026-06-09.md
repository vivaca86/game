# Other PC Handoff - 2026-06-09

Status: UI concept-raster work is partially complete. Do not call the UI finished.

Repository:

- GitHub: `https://github.com/vivaca86/game.git`
- Branch: `main`
- Latest pushed commit at handoff time: `76dce417a87e63e9f276d43ed9db618f073dfb10`
- Commit title: `Add Dungeon keyboard focus feedback`

## Start On Another PC

```powershell
git clone https://github.com/vivaca86/game.git
cd game
git log --oneline -5
git status -sb
npm install
```

Expected first commit in `git log --oneline -5`:

```text
76dce41 Add Dungeon keyboard focus feedback
```

Expected status:

```text
## main...origin/main
```

## Current UI Direction

The user rejected procedural/vector-looking UI. Continue with these rules:

- Use raster concept underlays and concept-derived bitmap state assets.
- Do not add Phaser rectangle/stroke/vector overlays as visible UI on concept screens.
- Keyboard focus must reuse the same bitmap language as pointer hover/down where possible.
- Do not introduce a new focus ring, tint, generic badge, or new visual style without matching the concept source.
- Keep completion language conservative. Current estimate is about 75%, not final.

Main reference docs:

- `docs/current-issues-and-plan.md`
- `docs/ui-concept-raster-handoff-2026-06-05.md`

## Latest Completed Work

Recent commits, newest first:

- `76dce41` - Dungeon keyboard focus feedback.
- `87fb0e1` - Combat/Boss keyboard focus feedback.
- `c6f28c4` - Town/RuneBench/Result utility keyboard focus feedback.
- `55cd99e` - Reward/Event keyboard focus feedback.
- `028e17b` - Restored broad Phaser smoke gate.

The latest Dungeon pass added:

- Central room node keyboard focus.
- Lower confirm panel keyboard focus.
- Focus/down state using only `ui_hover_route_node_concept`.
- New audit: `tmp/dungeon-keyboard-focus-raster-state-audit.mjs`.

## Verified After Latest Dungeon Pass

These passed before this handoff:

```powershell
npx.cmd tsc --noEmit
node tmp\keyboard-confirm-raster-state-audit.mjs
node tmp\dungeon-keyboard-focus-raster-state-audit.mjs
node tmp\route-node-raster-hover-state-audit.mjs
node tmp\ui-raster-hover-audit.mjs
node tmp\ui-raster-down-audit.mjs
npm.cmd run check
```

Known note:

- One parallel hover/down audit attempt hit Playwright screenshot timing pressure. Single reruns passed.
- The broad Phaser smoke for the latest Dungeon focus commit was started but interrupted at end of day. It reached `checkUiSkinStates START` after `checkFullInputCoverage OK` and `checkSettingsSurface OK`, but did not finish with `Phaser smoke OK`.

## First Command To Run Next

Before making new UI changes on the other PC, rerun the full broad smoke for the latest commit:

```powershell
$env:PHASER_SMOKE_PROGRESS='1'
$env:PHASER_SMOKE_PROGRESS_FILE='tmp/phaser-smoke-progress-other-pc-start.log'
node tmp\run-phaser-smoke-with-vite.mjs
```

Only count it as broad-smoke evidence if it ends with:

```text
Phaser smoke OK
```

## Next Best Work

Recommended next work:

1. WorldMap recomposition and runtime state truth:
   - Continue reducing baked state conflicts on lower/mid route nodes.
   - Keep current/completed/locked/sealed overlays concept-derived.
   - Use existing WorldMap audits before changing asset placement.

2. Broader selected/focus review:
   - Existing first-pass focus evidence now covers WorldMap directional selection, Reward/Event, Town/RuneBench/Result, Combat/Boss, Settings, and Dungeon.
   - This is still not final focus approval.

3. Broader disabled-state coverage:
   - Existing first evidence covers Event unaffordable choices and Combat/Boss cost-disabled cards.
   - Other controls/screens still need review.

4. Dynamic labels/tooltips/accessibility:
   - Still unresolved.
   - Do not put explanatory text on top of baked concept layers as a shortcut.

## Useful Evidence Paths

Latest focused screenshots:

- `tmp/ui-quality/dungeon-keyboard-focus/dungeon-room-node-focus-v1-1920.png`
- `tmp/ui-quality/dungeon-keyboard-focus/dungeon-bottom-confirm-focus-v1-1920.png`
- `tmp/ui-quality/dungeon-keyboard-focus/dungeon-bottom-confirm-keyboard-activate-down-v1-1920.png`
- `tmp/ui-quality/combat-boss-keyboard-focus/combat-card-1-focus-v1-1920.png`
- `tmp/ui-quality/combat-boss-keyboard-focus/boss-card-1-focus-v1-1920.png`
- `tmp/ui-quality/utility-keyboard-focus/town-expedition-focus-v1-1920.png`
- `tmp/ui-quality/keyboard-focus/reward-choice-2-focus-v1-1920.png`

Remember: `tmp/` is gitignored, so new audit scripts under `tmp/` must be staged with `git add -f`.
