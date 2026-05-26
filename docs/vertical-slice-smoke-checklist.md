# Vertical Slice Smoke Checklist v1

Date: 2026-05-26

## Status

- Status: combat simulation, scene flow, click controls, and save reload smoke verified.
- Basis: `docs/vertical-slice-acceptance.md`
- Candidate data: `docs/vertical-slice-content-candidates.md`
- Still not complete: full vertical-slice pass, final art/assets, exhaustive source parity, 95% similarity.

## State Values

| State | Meaning |
| --- | --- |
| Not started | No implementation or verification yet. |
| Implemented, not verified | Code exists, but the specific acceptance check has not been proven. |
| Needs fix | Verification found a problem. |
| Verified | The stated check has verification evidence. |
| Blocked | Tool, source, or decision gap blocks progress. |

## Pre-Run Checks

| ID | Check | Method | Current state |
| --- | --- | --- | --- |
| PRE-001 | Phaser app runs through Vite. | `npm.cmd run dev`, `npm.cmd run phaser:smoke` | Verified |
| PRE-002 | TypeScript has no errors. | `npm.cmd run check` | Verified |
| PRE-003 | Runtime data loads. | `BootScene`, `npm.cmd run phaser:smoke` | Verified |
| PRE-004 | Asset manifest has no missing references. | `npm.cmd run slice:validate` | Verified |
| PRE-005 | Debug entry flags exist. | `?debug=1&entry=combat`, `?debug=1&entry=boss` | Verified |

## Data Checks

| ID | Check | Method | Current state |
| --- | --- | --- | --- |
| DATA-001 | All content has `id`. | `npm.cmd run slice:validate` | Verified |
| DATA-002 | All displayed content has Korean name/description fields. | `npm.cmd run slice:validate` | Verified |
| DATA-003 | All slice content has `referenceRole`. | `npm.cmd run slice:validate` | Verified |
| DATA-004 | All `referenceRole` values are mapped in `reference-role-map-slice-v1.md`. | `npm.cmd run slice:validate` | Verified |
| DATA-005 | All referenced asset keys exist in the planned manifest. | `npm.cmd run slice:validate` | Verified |
| DATA-006 | Card descriptions and effect ops do not contradict each other. | effect audit | Not started |
| DATA-007 | Save data does not store Phaser objects. | `npm.cmd run phaser:smoke` save snapshot check | Verified |

## UI Checks

| ID | Check | Method | Current state |
| --- | --- | --- | --- |
| UI-001 | Town screen shows start/progress state. | desktop screenshot | Implemented, not verified |
| UI-002 | World map can enter the selected stage. | keyboard flow | Verified |
| UI-003 | Dungeon view is not only a static menu and shows route position. | screenshot + interaction | Implemented, not verified |
| UI-004 | Combat shows hand, HP, energy, block, and intent. | `npm.cmd run phaser:smoke` | Verified |
| UI-005 | Reward screen shows options and claim result. | flow smoke | Implemented, not verified |
| UI-006 | Rune bench shows equip result before/after. | flow smoke | Implemented, not verified |
| UI-007 | Boss screen shows boss-specific phase signal. | `npm.cmd run phaser:smoke` | Verified |
| UI-008 | Result screen shows clear/return state. | full loop smoke | Verified |

## Combat Checks

| ID | Check | Method | Current state |
| --- | --- | --- | --- |
| COMBAT-001 | `card_sun_jab` damages the front enemy. | debug combat overlay: `enemyHp=17` after Digit1 | Verified |
| COMBAT-002 | `card_fold_guard` gives block. | debug combat overlay: `playerBlock=6` after Digit2 | Verified |
| COMBAT-003 | `card_page_step` draws a card. | debug combat overlay: `drawPile=0`, `discard=1`, hand updated | Verified |
| COMBAT-004 | Enemy attack intent deals damage after end turn. | debug combat overlay: `playerHp=36`, `turn=2` after `E` | Verified |
| COMBAT-005 | Combat log and state agree with the action result. | debug overlay `log=...` plus smoke assertions | Verified |
| COMBAT-006 | Equipped rune changes attached-card value. | flow smoke: `rune_paper_spark` makes `card_sun_jab` deal 9 | Verified |
| COMBAT-007 | Boss phase triggers at HP threshold. | boss debug smoke: `bossPhaseTriggered=true` | Verified |

## Loop Checks

| ID | Check | Method | Current state |
| --- | --- | --- | --- |
| LOOP-001 | Town enters stage flow. | full loop smoke | Verified |
| LOOP-002 | First combat victory enters reward. | full loop smoke | Verified |
| LOOP-003 | Reward claim enters rune bench. | full loop smoke | Verified |
| LOOP-004 | Rune equip affects the next combat. | full loop smoke | Verified |
| LOOP-005 | Boss clear creates result state. | boss loop smoke | Verified |
| LOOP-006 | Result can return to town. | boss loop smoke | Verified |
| LOOP-007 | Minimum progress survives save reload. | `npm.cmd run phaser:smoke` + in-app browser reload check | Verified |

## Responsive/View Checks

| ID | Check | Method | Current state |
| --- | --- | --- | --- |
| VIEW-001 | 1920x1080 layout keeps five cards and intent readable. | screenshot | Not started |
| VIEW-002 | 1280x720 layout renders nonblank without console errors. | `npm.cmd run phaser:smoke` | Verified |
| VIEW-003 | Browser console has no app errors. | `npm.cmd run phaser:smoke` | Verified |
| VIEW-004 | Debug overlay does not hide critical combat information. | screenshot review | Implemented, not verified |

## Current Verification Results

- `npm.cmd run slice:validate`: passed.
- `npm.cmd run check`: passed.
- `npm.cmd run phaser:smoke`: passed.
- `git diff --check`: passed.
- Save reload: `phaser:smoke` verifies saved mid-combat state restores after reload and saved completed-stage profile state survives reload. In-app browser also verified reset-save flow, card action, no-reset reload, and restored `phase=combat`, `enemyHp=17`, `playerEnergy=2`, `savedPhase=combat`.

`phaser:smoke` writes screenshots under `tmp/`, including `tmp/phaser-TownScene.png`, `tmp/phaser-CombatScene.png`, and `tmp/phaser-BossScene.png`. `tmp/` is verification output and is not committed.

## Pass Judgment

This is not a full vertical-slice pass yet.

To call the first vertical slice passed, all required `PRE`, `DATA`, `UI`, `COMBAT`, `LOOP`, and `VIEW` rows must be `Verified`, no `Needs fix` rows may remain, and screenshot/save-reload evidence must be recorded. This checklist also does not authorize any original-game 95% similarity claim.

## Next Work

1. Add 1920x1080 screenshot checks and review debug overlay placement.
2. Add effect-audit coverage for card description/effect-op consistency.
3. Split fixture `encounterPoolId` into explicit encounter-pool data if the next content pass needs multiple enemies per room.
4. Continue source/version confirmation separately; current implementation is a slice foundation, not source parity.
