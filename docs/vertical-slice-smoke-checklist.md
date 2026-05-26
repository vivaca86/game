# Vertical Slice Smoke Checklist v1

Date: 2026-05-26

## Status

- Status: combat simulation, scene flow, click controls, save reload, 1920/view smoke, and card effect audit verified.
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
| DATA-005 | All referenced asset keys exist in the generated manifest. | `npm.cmd run slice:validate` | Verified |
| DATA-006 | Card descriptions and effect ops do not contradict each other. | `npm.cmd run slice:effects` | Verified |
| DATA-007 | Save data does not store Phaser objects. | `npm.cmd run phaser:smoke` save snapshot check | Verified |
| DATA-008 | Room `encounterPoolId` values reference explicit encounter-pool data, and pool entries point to the right content domain. | `npm.cmd run slice:validate` + `npm.cmd run phaser:smoke` | Verified |
| DATA-009 | Generated asset manifest stays in sync with runtime manifest, strict file audit passes, and Phaser preloads runtime asset URLs. | `npm.cmd run assets:audit:strict` + `npm.cmd run phaser:smoke` asset response check | Verified |

## UI Checks

| ID | Check | Method | Current state |
| --- | --- | --- | --- |
| UI-001 | Town screen shows start/progress state. | 1920 screenshot | Verified |
| UI-002 | World map can enter the selected stage. | keyboard flow | Verified |
| UI-003 | Dungeon view is not only a static menu and shows route position. | 1920 screenshot + interaction smoke | Verified |
| UI-004 | Combat shows hand, HP, energy, block, and intent. | `npm.cmd run phaser:smoke` | Verified |
| UI-005 | Reward screen shows options and claim result. | flow smoke + 1920 screenshot | Verified |
| UI-006 | Rune bench shows equip result before/after. | flow smoke + 1920 screenshot | Verified |
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
| COMBAT-008 | `card_lamplight_mark` applies mark and the next attack consumes it as bonus damage. | debug combat smoke: `enemyMark=2`, then `enemyMark=0` and `enemyHp=15` | Verified |

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
| VIEW-001 | 1920x1080 layout keeps five cards and intent readable. | 1920 screenshot + smoke assertions | Verified |
| VIEW-002 | 1280x720 layout renders nonblank without console errors. | `npm.cmd run phaser:smoke` | Verified |
| VIEW-003 | Browser console has no app errors. | `npm.cmd run phaser:smoke` | Verified |
| VIEW-004 | Debug overlay does not hide critical combat information. | 1920/1280/1080 overlay geometry + screenshot review | Verified |

## Current Verification Results

- `npm.cmd run slice:validate`: passed.
- `npm.cmd run slice:effects`: passed.
- `npm.cmd run assets:audit`: passed in generated-manifest mode.
- `npm.cmd run check`: passed.
- `npm.cmd run phaser:smoke`: passed.
- `git diff --check`: passed.
- Save reload: `phaser:smoke` verifies saved mid-combat state restores after reload and saved completed-stage profile state survives reload. In-app browser also verified reset-save flow, card action, no-reset reload, and restored `phase=combat`, `enemyHp=17`, `playerEnergy=2`, `savedPhase=combat`.
- Effect audit: `slice:effects` verifies docs/runtime fixture card effect text stays in sync, implemented card descriptions do not keep draft `후보` wording, each card effect op has a Korean description cue/amount, and each op is handled by the Phaser slice simulation.
- Encounter pool refs: `slice:validate` verifies route `encounterPoolId` values point to `encounterPools[].id`, pool type matches the room type, pool entries reference the right enemy/event/boss domain, and the boss pool includes the stage `bossId`.
- Mark smoke: `phaser:smoke` uses `?debug=1&entry=combat&resetSave=1&grantCard=card_lamplight_mark`, confirms mark becomes `enemyMark=2`, then the next attack consumes mark to `enemyMark=0` and reduces enemy HP from 24 to 15.
- 1920/view checks: `phaser:smoke` now captures 1920x1080 screenshots for Town, Dungeon, Combat, Reward, Rune Bench, and Boss under `tmp/phaser-1920-*.png`. Combat and Boss assertions verify five-card hands, expected debug state, non-empty screenshots, and debug-overlay avoidance of the hand and enemy intent areas.
- Responsive overlay checks: `phaser:smoke` also captures 1280 and 1080 overlay screenshots for Combat and Boss under `tmp/phaser-overlay-*.png`. In-app browser verification at 1080x918 confirmed `phase=combat`, `enemyHp=24`, `playerEnergy=3`, overlay size `220x260`, and no overlap with the five-card hand or enemy intent panel.
- Asset file audit: `assets:audit` verifies the docs manifest and runtime manifest stay synchronized, asset keys/paths remain unique, generated PNG files under `public/assets/runtime` match `nativeSize`, and these files are still development placeholders rather than final art. `phaser:smoke` verifies the first page preloads all 35 `assets/runtime` URLs without browser errors.
- 2026-05-27 card UI candidate pass: the generated development art for `card_frame_attack`, `card_frame_defense`, `card_frame_skill`, `icon_card_attack`, `icon_card_defense`, and `icon_card_skill` was replaced with more specific deterministic candidate art. This is a first replacement-loop proof, not approved final art.

`phaser:smoke` writes screenshots under `tmp/`, including `tmp/phaser-TownScene.png`, `tmp/phaser-CombatScene.png`, and `tmp/phaser-BossScene.png`. `tmp/` is verification output and is not committed.

## Pass Judgment

The first vertical-slice smoke checklist is verified: all listed `PRE`, `DATA`, `UI`, `COMBAT`, `LOOP`, and `VIEW` rows are `Verified`, no `Needs fix` rows remain, and screenshot/save-reload/effect-audit evidence is recorded.

This is still not a production-complete game, final art/assets pass, exhaustive source parity check, or original-game 95% similarity claim.

## Next Work

1. Continue replacing generated development placeholders one group at a time, keeping `npm.cmd run assets:audit:strict` green. The first candidate pass covered card frames and card type icons; next likely groups are card illustrations, intent icons, backgrounds, monsters, and boss art.
2. Expand content, final art/assets, balance, and UX polish only after the foundation remains green.
3. Keep Steam/appmanifest direct proof deferred unless the user later provides access or exact build/runtime claims become necessary.
