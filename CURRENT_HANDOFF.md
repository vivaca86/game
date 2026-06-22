# Current Handoff

Date: 2026-06-22

Branch: `codex/worldmap-pc-state-coverage`

Status: `Partially complete`

This is the highest-priority continuation note for the current work. Read this after `AGENTS.md` and before older handoff or planning documents.

## Active Goal

Continue the WorldMap and PC UI work until it is truthful to say:

`WorldMap final cleanup / user approval / release complete`

That goal is not complete yet. Do not mark the goal complete, do not claim user approval, and do not claim full game release completion until the user explicitly accepts the result after trying it.

## Current User Scope

- PC only.
- Do not consider mobile in the current scope.
- The latest user concern was that many things still felt missing, combat card selection looked broken, and the biggest problem was that it was hard to tell what was a button.

## What Was Done In This Pass

- Strengthened combat card idle affordance.
  - Ready cards now show a direct `사용` command pill instead of passive availability wording.
  - Disabled cards expose `기운 부족` state metadata.
  - Combat cards have stronger idle borders and action chevrons.
- Strengthened combat end-turn affordance.
  - The persistent `턴 종료` label is larger and closer to the main seal.
  - Shared raster button labels now have higher contrast, stronger border/shadow, and side chevrons.
- Extended PC-only release-candidate coverage.
  - Added `tools/auditViewportScope.mjs`.
  - The PC release gate now runs desktop-only focus tooltip, disabled readability, WorldMap selected-state route recomposition, and WorldMap locked-state explanation audits.
- Fixed audit issues found during the gate.
  - Disabled readability no longer counts persistent `rasterIdleAffordance` images as hover/down leakage.
  - Keyboard focus tooltip audit waits longer for scene boot and waits for `TownScene` before clicking into Settings.
- Updated docs.
  - `README.md` now documents the broader `ui:pc-release-candidate` gate.
  - `docs/problem-resolution-log.md` records the combat affordance, disabled-audit, and focus-audit issues.

## Verification Completed

Manual browser check:

- In the in-app browser at `http://127.0.0.1:5173/?debug=1&entry=combat&resetSave=1`, clicking the first combat card changed the state:
  - enemy HP `24 -> 17`
  - player energy `3 -> 2`
  - hand `5 -> 4`
  - discard `0 -> 1`
  - latest effect `effect_paper_slash`

Commands that passed:

- `npm.cmd run ui:pc-action-affordance`
- `npm.cmd run ui:pc-combat:affordance`
- `$env:UI_AUDIT_VIEWPORTS='desktop'; node tools/ui-keyboard-focus-tooltip-audit.mjs`
- `$env:UI_AUDIT_VIEWPORTS='desktop'; node tools/ui-disabled-readability-audit.mjs`
- `npm.cmd run check`
- `npm.cmd run ui:pc-release-candidate`

The final `ui:pc-release-candidate` run passed all gates:

- PC idle/action affordance
- PC combat card/button affordance
- PC WorldMap keyboard states
- PC WorldMap release-state recomposition
- PC keyboard focus tooltips
- PC disabled readability
- PC WorldMap selected-state route recomposition
- PC WorldMap locked-state explanations
- PC core interaction smoke
- Build and fixture check

Important build notes:

- Vite build completed successfully.
- The existing large JS chunk warning still appears. Do not treat that as a new failure, and do not claim it is solved.

## What Remains

- User approval is still not done.
- Full game completion/release completion is still not proven.
- Mobile was intentionally excluded and was not validated.
- `content-quality-audit` remains a separate protective content gate unless the user changes the scope.
- A human PC playthrough is still needed to judge whether the improved button affordance is good enough for the user's eyes.
- If the user still says buttons are unclear, inspect the relevant scene visually first, then strengthen idle labels/contrast before expanding features.

## Next Recommended Steps

1. Pull this branch on the next PC and read `AGENTS.md`, then this file.
2. Run `npm.cmd install` only if dependencies are missing on that PC.
3. Run `npm.cmd run ui:pc-release-candidate` to reproduce the current verified baseline.
4. Start the dev server and have the user try the PC flow:
   - `npm.cmd run dev -- --host 127.0.0.1`
   - open `http://127.0.0.1:5173/`
5. Ask for explicit user approval on the PC button readability and WorldMap flow.
6. Only after user approval and any required fixes, update the active goal status.

## Do Not Say Yet

- Do not say the game is complete.
- Do not say release is complete.
- Do not say WorldMap is finally approved.
- Do not say mobile is covered.
- Do not say the content-quality gate is solved.
