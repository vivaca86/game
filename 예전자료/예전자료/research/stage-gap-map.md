# Stage Implementation Gap Map

Status: `stage total conflict / stage taxonomy reconciliation / Dexerto unlock-table crawl / official wiki value extract / row-level current implementation gap-mapped`
Last updated: 2026-05-22

This file maps each collected Vampire Crawlers stage candidate against the current prototype implementation. It does not resolve the 13/14/15/16-stage source conflict by itself. The generated Dexerto crawl confirms only a 13-row unlock table, while Steam achievements and video metadata still support additional stage candidates. The official release FAQ crawl adds a broader 6-biome/few-dungeons/several-floors structure, and the stage taxonomy reconciliation separates 13 Dexerto rows, 14 Steam progression rows, 15 non-tutorial candidates, 9 official-wiki dungeon pages, and 16 official-wiki variants including `Tutorial`. `biome`, `dungeon/page`, `stage/variant`, `tutorial/onboarding`, `unlock entry`, and `floor` must be tracked separately. A stage is not counted as implemented until stage-select UI, unlock state, entry flow, floor/room structure, boss, reward, clear consequence, and persistence are verified.

## Source Basis

| Source ID | Source | Use | Grade |
| --- | --- | --- | --- |
| SRC-006 | Steam Community achievements page | 14 official stage progression unlock/completion achievement rows | E5 metadata |
| SRC-107 | Dexerto stage unlock list | 13 stage unlock-task rows | E1 |
| SRC-133 | Dexerto stage unlock table crawl | Generated 13-row table extraction and no-individual-stage-page boundary note | E1 |
| SRC-108 | GAMES.GG stage guide | 15-stage total claim, branching-map description, route notes | E1 |
| SRC-141 | Poncle official release FAQ crawl | Developer shorthand for 6 biomes, a few dungeons per biome, and several floors per dungeon | E5 developer statement via social FAQ |
| SRC-142 | Official wiki API crawl | 9 official-wiki dungeon pages and 16 named variant row boundary | E5 official wiki / not direct play |
| SRC-147 | Official wiki arcana/relic/dungeon value extract | 16 expanded official-wiki dungeon/stage variant rows with order, floor, difficulty, and demo fields | E5 official wiki structured values / not direct play |
| VID-002 | Full-game reference candidate | 15 chaptered stage entries with storyboard route/gameplay frames | E3 partial |
| VID-003/004/005/006/007/008/009/010/012 | Stage-specific storyboard logs | Partial stage entry, combat, reward, boss/elite, and result surfaces | E3 partial |
| stage-taxonomy-reconciliation.md | Generated reconciliation artifact | Separates 13 unlock-table rows, 14 Steam progression rows, 15 non-tutorial candidates, 9 official-wiki dungeon pages, and 16 variants including `Tutorial` | Source-level synthesis / not direct play |
| local implementation audit | `src/content/crawler-clone.js`, `src/rules/crawler-dungeon.js`, `src/ui/hud.js` | Current prototype floor/stage behavior | Local implementation evidence |

## Coverage Counter

| Segment | Rows | Current exact 1:1 implemented | Placeholder-adjacent rows | Current status |
| --- | ---: | ---: | ---: | --- |
| Playable stage candidates | 15 non-tutorial candidates, plus `Tutorial` as the 16th official-wiki variant | 0 | 3 | All 15 non-tutorial candidates are represented in research rows, and `research/stage-taxonomy-reconciliation.md` now separates the 13 Dexerto unlock rows, 14 Steam progression rows, 15 VID-002 candidates, 9 official-wiki dungeon pages, and 16 official-wiki variants; exact stage-select UI and clear consequences are unresolved |
| Steam achievement-backed progression rows | 14 | 0 | 0 | Metadata confirms progression names/triggers, including Milk Factory, not runtime stage behavior |
| Current prototype floors | 3 | 0 | 3 | `glassGrove`, `inkArchive`, and `cloudBridge` are original-flavored placeholders, not verified original stages |
| Stage-select/world-map implementation | 16 official-wiki named variants including `Tutorial`, or 15 non-tutorial candidates if `Tutorial` is excluded | 0 | partial menu only | Current prototype has no verified route map, lock graph, stage cards, tutorial/onboarding state, or per-stage persistence parity |

## Current Prototype Surface

| Surface | Current behavior | Why it is not final parity |
| --- | --- | --- |
| `crawlerCloneConfig.floors` | Three floor definitions with placeholder ids: `glassGrove`, `inkArchive`, `cloudBridge` | Original candidates list 15 playable stages and multiple branch chains |
| `crawlerFloorTemplate()` | Three fixed 7x7 templates reused for floor layouts | Original stage floor counts, room graph, special objects, and visual sets are unverified |
| `advanceCrawlerFloor()` | Boss defeat spawns shovel, then moves to the next prototype floor; completion after floor 3 | Original stage clear, next-stage unlock, rewards, and world-map persistence are not implemented |
| `startCrawlerRun()` | Starts directly in the prototype crawler state | Original title/town/world-map/stage-card entry flow is not reproduced |
| UI/HUD stage labels | Displays current floor index and current floor name | Original stage-select labels, locks, route branches, difficulty, and completed state are missing |

## Per-Stage Gap Rows

| ID | Original stage candidate | Collected unlock/proof | Current implementation surface | Parity | Current gap | Required proof |
| --- | --- | --- | --- | --- | --- | --- |
| STG-001 | Mad Forest | Default/start candidate; VID-003 and VID-002 show forest route/gameplay; Mantichana linked by achievement metadata | `glassGrove` placeholder only | Placeholder only | Stage-select default state, boss identity, reward, clear consequence, and exact room rhythm missing | Stage card/default unlock UI, Mad Forest entry, boss/name proof, clear/result proof |
| STG-002 | Furious Forest | Steam metadata says complete Mad Forest; VID-002 chapter/map frame | No direct equivalent | No | Separate forest-branch stage and clear route missing | Stage-select lock/unlock proof and representative run proof |
| STG-003 | Berserk Wood | Steam metadata says complete Furious Forest; VID-002 chapter/map frame; coffin/Yin Yang/Pugnala context unresolved | No direct equivalent | No | Coffin route, reward, boss, and special rules missing | Stage entry plus coffin/reward and clear-result proof |
| STG-004 | Inlaid Library | Steam metadata says reach level 10 in Mad Forest; VID-004 and VID-002 show library route/gameplay | `inkArchive` placeholder only | Placeholder only | Exact library stage card, boss, reward, clear/unlock, and room variety missing | Stage-select unlock proof, entry, boss/elite taxonomy, result/unlock proof |
| STG-005 | Library West Wing | Steam metadata says complete Inlaid Library; VID-002 chapter/transition frame | No direct equivalent | No | Separate west-wing stage behavior missing | Stage-select row, entry flow, boss/reward/clear proof |
| STG-006 | Library Sanctum | Steam metadata says complete Library West Wing; VID-005, VID-012, and VID-002 show route/context | No direct equivalent | No | High-pressure route, Arcana Finder/Bomba-like/recruit/no-valid-card events, boss identities, and persistence missing | Stage card, full run, boss names, rewards, event rules, clear consequence |
| STG-007 | Teeny Bridge | Steam metadata says reach level 15 in Inlaid Library; VID-006 and VID-002 show narrow bridge route | `cloudBridge` placeholder only | Placeholder only | Narrow bridge composition, stage-specific pressure, boss/reward, and unlock result missing | Stage entry, representative combat rhythm, boss/reward, clear/unlock proof |
| STG-008 | Dairy Plant | Steam metadata says complete Teeny Bridge; VID-007 and VID-002 show factory/dairy route | No direct equivalent | No | Dairy branch, arcade/duplicate-card events, boss identity, reward, and unlock consequence missing | Stage card, event proof, boss proof, clear-result proof |
| STG-009 | Milk Factory | Steam achievement `Unlock Milk Factory` says complete Dairy Plant; VID-008 and VID-002 show Milk Factory route; generated Dexerto crawl omits it as an item row but uses it as Curd Refinery prerequisite | No direct equivalent | No | Dexerto omission conflict, Milk Elemental mapping, failure/restart handling, reward, and clear/death fields missing | Stage-select proof, Milk Elemental/name proof, result and persistence proof |
| STG-010 | Curd Refinery | Steam metadata says complete Milk Factory; VID-002 chapter/factory combat frame | No direct equivalent | No | Nesufritto/Fireproof Gem/Ultimate Ultra Overkill reward path missing | Stage entry, boss/name, reward, clear consequence proof |
| STG-011 | Weeny Bridge | Steam metadata says reach level 15 in Dairy Plant; VID-002 bridge route frame | No direct equivalent | No | Separate bridge-chain stage behavior missing | Stage-select lock, entry, boss/reward/clear proof |
| STG-012 | Gallo Tower | Steam metadata says complete Weeny Bridge; VID-009 and VID-002 show tower route; Gallo/Giant Enemy Crab context unresolved | No direct equivalent | No | Tower rooms, floor/loading transition, multiple boss candidates, rewards, and unlock persistence missing | Stage card, representative run, boss name mapping, clear/result proof |
| STG-013 | Meany Bridge | Steam metadata says defeat Giant Enemy Crab in Gallo Tower; VID-002 chapter/combat frame | No direct equivalent | No | Giant Enemy Crab dependency, no-reward claim, and stage clear flow missing | Boss-trigger proof, stage unlock proof, run result proof |
| STG-014 | Cappella Magna | Steam metadata says complete Meany Bridge; VID-002 chapter/chapel combat frame; VID-010 route context | No direct equivalent | No | Exact spelling, selected-stage label, boss, reward, and clear result missing | High-resolution stage-select label plus clear-result proof |
| STG-015 | Cappella Ultima / Capella Ultima | Steam metadata says complete Cappella Magna; VID-010 ending route and VID-002 final chapter support final-stage candidate | No direct equivalent | No | Final boss identity, selected-stage spelling, endgame trigger, Ovenkilt reward, credits/unlock persistence missing | Stage card, final boss/name, STAGE COMPLETED, reward, credits, and save-persistence proof |

## Required Completion

- Capture high-resolution world-map/stage-select UI showing all playable biomes/stages/dungeons, locks, route branches, spelling, difficulty, floor counts, and completed state.
- Resolve the 13 Dexerto crawl rows vs 14 official progression achievement rows vs 15 playable-stage candidate rows vs 16 official-wiki variants including `Tutorial`.
- For every stage, log at least one representative run segment covering entry, first combat, level-up/reward, stage-specific object, boss/elite, clear or failure, reward, and next-stage unlock.
- Map every current prototype floor/room function to exact original behavior only after direct/video proof exists.
- Keep implementation approval closed until every stage row has a testable acceptance condition and the user approves the baseline.
