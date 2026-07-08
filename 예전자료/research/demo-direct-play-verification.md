# Demo Direct Play Verification

Status: `priority 1 active / started 2026-05-22 / demo direct proof only / full app proof still missing`

This file records the first local direct-play proof after the user installed the demo build. It is not full-app proof for app `3265700`; it is direct evidence for the Steam demo app `4329470` only.

## Evidence Boundary

- This evidence comes from the local Windows Steam demo installation.
- Demo proof can verify demo UI/runtime behavior, input viability, and selected demo-build rows.
- Demo proof must not be generalized to the full release without app `3265700` install/build proof or matching game-file evidence.
- Existing source/storyboard labels remain unchanged unless this demo build directly proves a row.

## Priority 1 Demo Checklist

This is now the first playable verification track while the full app `3265700` remains unavailable. Keep each row demo-scoped unless matching full-app proof appears.

| Order | Task ID | Required Capture | Current State | Done When |
| ---: | --- | --- | --- | --- |
| 1 | DEMO-P1-001 | Demo install/build baseline | Done | App `4329470`, build `23111773`, install path, language, depot, and manifest are recorded |
| 2 | DEMO-P1-002 | Clean cropped game-window capture | Pending | A crop of the game window only is saved and linked, without desktop/chat UI around it |
| 3 | DEMO-P1-003 | Launch route classification | In progress | Determine whether the demo can reach title/options/save/town, or whether the observed session always opens into dungeon play |
| 4 | DEMO-P1-004 | Pause/settings/menu labels | Pending | Pause/menu/settings/default labels are captured in Korean demo UI |
| 5 | DEMO-P1-005 | Relaunch persistence | Pending | Exit/relaunch behavior, save continuation, and starting state are recorded for demo only |
| 6 | DEMO-P1-101 | First movement packet | Done | Onscreen movement input and resulting camera/position change are captured |
| 7 | DEMO-P1-102 | First combat packet | In progress | Enemy appearance, readable card state, combat result, counter/resource changes, and reward/drop are captured cleanly |
| 8 | DEMO-P1-103 | First card-use packet | In progress | `단검` text, resource/cost/icon state, click/use result, and after-state are verified with clean capture |
| 9 | DEMO-P1-104 | Enemy attack/damage packet | Pending | Let an enemy act or otherwise capture HP/damage/defense/healing order without guessing |
| 10 | DEMO-P1-105 | Reward/pickup packet | Pending | Blue crystal/reward pickup type, counter/resource change, and UI text are captured |
| 11 | DEMO-P1-106 | First branch/room transition | Pending | Next route node, room label if any, map mutation, and transition behavior are captured |
| 12 | DEMO-P1-107 | Demo-to-full boundary note | Pending | Identify any demo lock, full-game upsell, content cap, or unavailable system encountered during play |
| 13 | DEMO-P1-108 | Backfill pass | Pending | Update `direct-play-verification.md`, relevant matrices, and `source-conflicts.md` only for rows directly proven by demo evidence |

## Install Baseline

| Field | Observed Value |
| --- | --- |
| Steam library file | `C:\Program Files (x86)\Steam\steamapps\libraryfolders.vdf` |
| Full app manifest | `appmanifest_3265700.acf` missing in active Steam library |
| Demo app manifest | `C:\Program Files (x86)\Steam\steamapps\appmanifest_4329470.acf` |
| App ID | `4329470` |
| App name | `Vampire Crawlers Demo` |
| Install state | `StateFlags = 4` |
| Install dir | `C:\Program Files (x86)\Steam\steamapps\common\Vampire Crawlers Demo` |
| Executable | `Vampire Crawlers.exe` |
| Build ID | `23111773` |
| TargetBuildID | `23111773` |
| Installed depot | `4329471` |
| Depot manifest | `2829574765751965554` |
| Size on disk | `990190396` bytes |
| LastUpdated raw | `1779447407` |
| LastUpdated UTC | `2026-05-22 10:56:47 UTC` |
| Steam language | `koreana` |

## Launch Baseline

| Packet | Observation | Status |
| --- | --- | --- |
| DEMO-DP-001 | Launched `Vampire Crawlers.exe` with Unity window arguments `-screen-fullscreen 0 -screen-width 1280 -screen-height 720` | Passed |
| DEMO-DP-002 | Process/window title appeared as `Vampire Crawlers` | Passed |
| DEMO-DP-003 | Full-screen capture from the desktop captured the game window successfully | Passed |
| DEMO-DP-004 | The observed session opened directly into a playable first-person dungeon/combat UI, not a title/save/town screen | Observed; do not infer title/save absence yet |
| DEMO-DP-005 | Lower-left screen text visibly includes `Demo Version` | Passed |

## First Observed UI State

| UI Element | Observed Value / Description | Open Questions |
| --- | --- | --- |
| Level | `LV 1` visible at top-right of the top message/status bar | Exact role of top bar unresolved |
| Health | Heart panel shows `50 / 50` | Exact max-HP source unresolved |
| Counters | Top counters show `0` beside a skull-like icon and `0` beside a coin-like icon at first capture | Exact labels need UI/game-file proof |
| Blue resource | Right-side blue orb shows `2` | Exact resource name/function unresolved |
| Map | Bottom-right parchment minimap visible with route nodes and current arrow marker | Exact floor/stage label unresolved |
| Movement UI | Onscreen D-pad/arrow buttons visible at lower center-left | Input confirmed by click/hold |
| Menu icons | Book/card-like icons visible in lower side panels | Exact menu labels unresolved |
| Pause | Pause icon visible at upper-right | Settings/title behavior unresolved |

## Input Proof

| Packet | Action | Result | Status |
| --- | --- | --- | --- |
| DEMO-DP-101 | Click/hold onscreen up-direction button | Scene position changed and the player advanced along the visible path | Direct input confirmed |
| DEMO-DP-102 | Continue moving forward | A bat-like enemy/combat encounter appeared | Direct first-combat candidate |
| DEMO-DP-103 | Click visible card during combat | Card was consumed/played and the combat state changed | Direct card-use candidate |

## First Combat Observation

| Field | Observation | Proof Limit |
| --- | --- | --- |
| Encounter | A black/red bat-like enemy appeared in the center of the dungeon view after forward movement | Enemy nameplate not visible/readable in current capture |
| Card name | `단검` | Korean demo UI only; English row mapping still requires UI/game-file proof |
| Card text | `피해 40 입힘. 치명타.` | Exact punctuation and icon fields should be rechecked in a cropped/full-resolution capture pass |
| Card result | After clicking the card, the enemy was no longer blocking the center and a blue crystal/reward-like pickup appeared on the floor | Exact reward type and pickup rule unresolved |
| Counter change | A `1` appears beside the skull-like top counter after the card/combat moment | Treat as candidate kill/combat counter until label proof exists |

## Mapping To Existing Direct-Play Tasks

| Parent Task | Demo Evidence State | Notes |
| --- | --- | --- |
| DP-001 | Partially satisfied for demo app `4329470`; still blocked for full app `3265700` | Keep full-app baseline open |
| DP-002 | Not satisfied | Title/save/options not captured; demo opened into playable state in this observed session |
| DP-003 | Not satisfied | Save creation/relaunch persistence not tested |
| DP-004 | Not satisfied | Settings tabs/defaults not captured |
| DP-005 | Not satisfied | Town/menu state not captured |
| DP-101 | Partially satisfied for demo | Entry/movement/first enemy visible, exact stage/route and enemy row unresolved |
| DP-102 | Not satisfied | Auto-use order across several hands not tested |
| DP-103 | Not satisfied | Mana chain/Combo/TurboTurn not tested |
| DP-104 | Not satisfied | Wild not tested |
| DP-105 | Partially satisfied for demo | One card/combat result visible; enemy attack/damage/defense/healing order not tested |
| DP-106 | Not satisfied | Chest/level-up/gem/event/elite/boss/clear/failure not tested |

## Stop Conditions

- Do not treat app `4329470` demo behavior as final full-release behavior.
- Do not resolve app `3265700`, Steam Cloud, full achievement/Town Hall, full catalog, or balance rows from the demo alone.
- Do not mark implementation parity above `0` from this demo baseline.
