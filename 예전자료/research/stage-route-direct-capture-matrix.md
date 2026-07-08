# Stage / Route Direct Capture Matrix

Status: `generated 2026-05-22 / direct-proof execution matrix / blocked until app 3265700 or game files are available`

Related files:

- [`direct-play-verification.md`](./direct-play-verification.md) DP-101 to DP-106 and DP-204
- [`remaining-proof-queue.md`](./remaining-proof-queue.md)
- [`stage-taxonomy-reconciliation.md`](./stage-taxonomy-reconciliation.md)
- [`stage-gap-map.md`](./stage-gap-map.md)
- [`stage-dexerto-unlock-crawl.md`](./stage-dexerto-unlock-crawl.md)
- [`official-wiki-arcana-relic-dungeon-value-extract.md`](./official-wiki-arcana-relic-dungeon-value-extract.md)
- [`enemy-direct-capture-matrix.md`](./enemy-direct-capture-matrix.md)
- [`character-inn-direct-capture-matrix.md`](./character-inn-direct-capture-matrix.md)
- [`gem-direct-capture-matrix.md`](./gem-direct-capture-matrix.md)
- [`source-conflicts.md`](./source-conflicts.md) CON-001, CON-009, CON-013, CON-015, CON-024, CON-035, CON-036, CON-037, CON-043

This matrix turns the stage/dungeon/route taxonomy into direct-play, high-resolution video, and game-file capture packets. It is not proof by itself. Stage implementation remains closed until each accepted row has shipped stage-select membership, route state, floor count, lock/unlock condition, boss/reward linkage, clear/failure result, persistence, and acceptance criteria.

## Capture Packet Standard

Every stage/route packet must include these fields before it can close a row:

| Field | Requirement |
| --- | --- |
| Build baseline | App `3265700`, build id/version, platform, language, timestamp, save state |
| Source layer | Dexerto unlock row, Steam progression row, official-wiki dungeon variant, official FAQ biome shorthand, storyboard/video row, guide row, or game-file row |
| Stage-select proof | World-map/stage-card UI, lock state, route node, difficulty/floor label, completed marker, selected-state text, or game-file table |
| Route proof | Parent/child route link, prerequisite, branch unlock, biome/page/variant relationship, route graph position, and persistence after town return |
| Entry proof | Run start, selected stage label, first room, deck/player state, floor count display, music/visual set if visible |
| Runtime proof | Floor transition, stage-specific object/event, enemy set, boss/final encounter, clear/failure condition, and reward cadence |
| Reward proof | Unlock popup, relic/gem/character/stage/achievement reward, skipped/no-reward state, Town Hall/achievement linkage |
| Persistence proof | Save/reload state, completed marker, next-stage unlock, stage replay, route branch persistence, and failure/retry state |
| Source resolution | Confirmed, contradicted, unresolved, version difference, tutorial-only, default-only, hidden, internal-only, or excluded |
| Implementation output | Exact row data and testable acceptance condition; do not implement from partial packets |

## Priority Order

| Priority | Packet IDs | Reason |
| --- | --- | --- |
| P0 | STG-DP-001 to STG-DP-007 | Close stage-count, tutorial/default, world-map, and route boundaries first. |
| P1 | STG-DP-008 to STG-DP-018 | Capture every non-tutorial stage row and row-specific route/reward proof. |
| P2 | STG-DP-019 to STG-DP-026 | Resolve conflicts: Dexerto/Steam/video/wiki layers, Milk Factory, Cappella spelling, Tutorial, biome/page/variant split. |
| P3 | STG-DP-027 to STG-DP-035 | Resolve floor/runtime/boss/reward/stage-object behavior. |
| P4 | STG-DP-036 to STG-DP-043 | Resolve persistence, cross-domain dependencies, and implementation acceptance. |

## P0 Stage-Select / Count / Route Boundary

| Packet ID | Target | Source-Layer Starting Point | Required Capture | Closes / Updates |
| --- | --- | --- | --- | --- |
| STG-DP-001 | Full stage-select roster count | 13 Dexerto rows, 14 Steam rows, 15 non-tutorial candidates, 16 wiki variants including Tutorial | Capture world-map/stage-select roster, visible/locked/hidden rows, filters, completion count, and selected-state text | CON-001, CON-037 |
| STG-DP-002 | Fresh-save world map | Mad Forest default, Tutorial, locked route nodes | Capture first selectable stage state, tutorial/onboarding entry, locks, guidance text, currency/progress state, and route branches | Default/tutorial boundary |
| STG-DP-003 | Progressed world map | All major unlock chains | Capture stage-select after each branch unlock and after late/postgame progress; preserve screenshots/video timestamps for every row | Route progression map |
| STG-DP-004 | Game-file stage table index | 9 official-wiki pages, 16 expanded variants, 15 candidates | If game files are available, extract stage ids, display names, order, variants, floors, difficulty, unlocks, boss/reward links | Source row-to-file token map |
| STG-DP-005 | Biome/page/stage/floor split | Official 6-biome shorthand, 9 wiki pages, 16 variants | Capture whether UI groups stages by biome, dungeon page, row variant, floor path, or route node | Biome taxonomy |
| STG-DP-006 | Tutorial status | Official-wiki `Tutorial`, Combo Stack found-in Tutorial, no Dexerto/Steam row | Capture whether Tutorial is replayable/selectable, onboarding-only, demo-only, hidden, or game-file-only | Tutorial boundary |
| STG-DP-007 | Mad Forest default row | No Dexerto/Steam item row; video/default candidate | Capture exact fresh-save label, stage card, route position, floor count, difficulty, unlock state, and first-run relation | Mad Forest default proof |

## P1 Non-Tutorial Stage Row Capture

| Packet ID | Stage Row | Source-Layer Starting Point | Required Capture | Output |
| --- | --- | --- | --- | --- |
| STG-DP-008 | Mad Forest | STG-001; default/base candidate; Gem Hammer and Mantichana links | Stage-select row, entry, first combat, floor transitions, Mantichana/boss proof, Gem Hammer/reward proof, clear state | Mad Forest row proof |
| STG-DP-009 | Furious Forest | STG-002; complete Mad Forest | Lock/unlock transition, route link, entry, boss/reward, clear consequence, Polentir route conflict if surfaced | Furious Forest row proof |
| STG-DP-010 | Berserk Wood | STG-003; complete Furious Forest | Route link, coffin/Pugnala/Yin Yang proof if present, boss/reward, clear state | Berserk Wood row proof |
| STG-DP-011 | Inlaid Library | STG-004; reach level 10 in Mad Forest | Level-threshold unlock, stage-select row, entry, Guiding Light route conflict, boss/reward, clear state | Inlaid Library row proof |
| STG-DP-012 | Library West Wing | STG-005; complete Inlaid Library | Route link, Grim Grimoire source/reward proof, boss/reward, clear consequence | Library West Wing row proof |
| STG-DP-013 | Library Sanctum | STG-006; complete Library West Wing | Arcana Finder/relic proof, event-heavy route proof, boss/reward, clear consequence | Library Sanctum row proof |
| STG-DP-014 | Teeny Bridge | STG-007; level 15 in Inlaid Library | Single-floor stage UI, bridge geometry, Stardust Anvil/Overkill proof, boss/reward, clear state | Teeny Bridge row proof |
| STG-DP-015 | Dairy Plant | STG-008; complete Teeny Bridge | Stage-select row, dairy/factory visual proof, Bomba Infernale/arcade/event candidates, boss/reward, clear state | Dairy Plant row proof |
| STG-DP-016 | Milk Factory | STG-009; Steam row, Dexerto omission, Milk Elemental link | Stage-select row/lock state, unlock popup, Milk Elemental proof, failure/retry if observed, reward, clear state | CON-009 |
| STG-DP-017 | Curd Refinery | STG-010; complete Milk Factory | Stage-select row, Nesufritto proof, Fireproof Gem link, Ultimate Ultra Overkill route proof, clear state | Curd Refinery row proof |
| STG-DP-018 | Bridge/Tower/Final chain | Weeny Bridge, Gallo Tower, Meany Bridge, Cappella Magna, Cappella Ultima | Capture route chain from Weeny Bridge through final stage with locks, unlocks, boss/reward, clear/failure, and persistence | Late-route chain proof |

## P2 Row-Layer / Naming Conflict Resolution

| Packet ID | Target | Source-Layer Starting Point | Required Capture | Closes / Updates |
| --- | --- | --- | --- | --- |
| STG-DP-019 | Dexerto 13 vs Steam 14 | Dexerto omits Milk Factory; Steam includes it | Capture stage-select and unlock popup proving whether Milk Factory is normal, implicit, hidden, or source-only | CON-001, CON-009 |
| STG-DP-020 | 15 non-tutorial vs 16 wiki variants | Tutorial plus 15 route candidates | Capture Tutorial status and final non-tutorial row count in UI/files | CON-001 |
| STG-DP-021 | 6 biomes vs 9 pages vs 16 variants | Official FAQ shorthand and official-wiki page/variant rows | Capture UI group labels and route structure to separate biome/page/stage/variant fields | CON-037 |
| STG-DP-022 | Cappella/Capella spelling | Dexerto/wiki `Cappella`; VID-002 `Capella Ultima` | Capture high-resolution stage-select, result, unlock popup, or game-file string for both late-stage rows | CON-015 |
| STG-DP-023 | Cappella Magna vs Ultima selection | VID-010 ambiguity and final-route context | Capture selected-stage label, route node, entry screen, clear screen, and result/reward for both rows | CON-013 |
| STG-DP-024 | Polentir route text | Furious Forest/Fortune Forest/after-Mad-Forest claims | Capture Polentir relic panel, found-in text, Fortune Teller unlock, and route node | CON-043 |
| STG-DP-025 | Rilevatore / Guiding Light / U.U.O. route text | Relic found-in conflicts | Capture relic panel/Museum/source text and stage-select route for each conflict row | CON-018, CON-035, CON-036 |
| STG-DP-026 | Official-wiki values as constants | order/floors/difficulty/demo fields | Verify whether UI/files expose the same values before using them as implementation constants | Source-value validation |

## P3 Floor / Runtime / Boss / Reward Capture

| Packet ID | Target | Required Capture | Output |
| --- | --- | --- | --- |
| STG-DP-027 | Floor count and transition | Every confirmed stage | Floor display, stairs/exit/transition, loading screen, room count if shown, and final-floor marker |
| STG-DP-028 | Stage-entry baseline | Every confirmed stage | Selected label, starting deck/party, modifiers, initial room, starting enemies, and music/visual set if useful |
| STG-DP-029 | Stage-specific objects/events | Coffins, mine carts, light sources, relic panels, duplicate/arcade/recruit/sacrifice stations | Object name, option text, cost/reward, repeat state, invalid state, persistence |
| STG-DP-030 | Boss/final encounter mapping | Mantichana, Milk Elemental, Giant Enemy Crab, Gallo, Nesufritto, final boss, route bosses | Nameplate, HP/intent, spawn trigger, stage/floor, reward, unlock links |
| STG-DP-031 | Enemy pool and special spawns | Stage enemy sets, Trickster, Dragon Shrimp, Lion Head, Skeleton, RedDeath/Red Death | Stage/floor membership, spawn trigger, count tracking, and conflict closure |
| STG-DP-032 | Clear/failure result screens | Every stage | Completed/failed label, reward, stats, route unlock, town return, retry, save state |
| STG-DP-033 | Stage reward linkage | Relics, gems, characters, arcana, Power-Ups, stages, achievements | Reward popup and subsequent row availability in relevant UI |
| STG-DP-034 | Progression thresholds | Level 10/15, complete-stage, defeat-boss, stage-specific clear | Off-by-one proof, tracker text, unlock timing, and persistence |
| STG-DP-035 | Representative full-run packet | One full uninterrupted run per stage when possible | Entry-to-town-return proof set for implementation acceptance |

## P4 Persistence / Cross-Domain / Implementation Acceptance

| Packet ID | Target | Required Capture | Output |
| --- | --- | --- | --- |
| STG-DP-036 | Save/load persistence | Stage unlocks, completed state, route branches, tutorial state, rewards | Reload/relaunch and profile persistence proof |
| STG-DP-037 | Stage-select UI field taxonomy | Name, lock text, difficulty, floors, route line, biome group, reward preview, completed marker | Exact field list for implementation |
| STG-DP-038 | First-run/town linkage | Title, tutorial, Mad Forest, first return, village unlocks | Onboarding and first-loop flow proof |
| STG-DP-039 | Stage-to-character linkage | Coffins, boss kills, enemy counts, Imelda/Pasqualina route, O'Sole count | Backfill character and enemy matrices only after proof is strong enough |
| STG-DP-040 | Stage-to-gem/relic/arcana linkage | Gem Hammer, Stardust Anvil, Lapidary Loupe, Polentir, Arcana Finder, Ovenkilt, stage gems | Backfill gem/town/relic/arcana maps only after direct proof |
| STG-DP-041 | Stage-to-achievement linkage | 14 Steam progression rows plus completion/clear rows | Town Hall, Steam, unlock popup, and persistence mapping |
| STG-DP-042 | Version/build regression check | Hotfix 1.4.1/build `23012943` candidate and installed build state | Confirm installed build/version before accepting captures as current-build proof |
| STG-DP-043 | Implementation acceptance pass | All confirmed stage/route rows | Exact data row, behavior tests, UI text, unlock condition, floor rule, reward rule, and parity status for later implementation |

## Backfill Instructions

When a stage/route packet is completed, update these files in order:

1. [`direct-play-verification.md`](./direct-play-verification.md): mark DP-101 to DP-106 and DP-204 evidence and build/language/platform.
2. [`stage-taxonomy-reconciliation.md`](./stage-taxonomy-reconciliation.md): change source-layer candidates into confirmed/rejected/tutorial/default/variant mappings.
3. [`data-stages.md`](./data-stages.md): add exact stage fields and direct/game-file proof.
4. [`stage-gap-map.md`](./stage-gap-map.md): update parity only after all acceptance fields are proven.
5. [`source-conflicts.md`](./source-conflicts.md): resolve or preserve CON-001, CON-009, CON-013, CON-015, CON-024, CON-035, CON-036, CON-037, and CON-043.
6. [`enemy-taxonomy-reconciliation.md`](./enemy-taxonomy-reconciliation.md) and [`enemy-direct-capture-matrix.md`](./enemy-direct-capture-matrix.md) for boss/enemy membership.
7. [`character-taxonomy-reconciliation.md`](./character-taxonomy-reconciliation.md) and [`character-inn-direct-capture-matrix.md`](./character-inn-direct-capture-matrix.md) for stage-linked character unlocks.
8. [`gem-taxonomy-reconciliation.md`](./gem-taxonomy-reconciliation.md) and [`gem-direct-capture-matrix.md`](./gem-direct-capture-matrix.md) for stage/enemy-linked gem rows.
9. [`town-taxonomy-reconciliation.md`](./town-taxonomy-reconciliation.md), relic, arcana, and Power-Up maps for building/relic/arcana unlock linkage.
10. [`achievement-gap-map.md`](./achievement-gap-map.md) and [`data-achievements.md`](./data-achievements.md) for progression achievements.
11. [`gap-map.md`](./gap-map.md) only after row-level files are updated.
12. Later implementation files only after each row has a testable acceptance condition.

## Stop Conditions

Stop and preserve a row as unresolved when any of these happen:

- A stage name is visible but lock state, route position, or completion state is unreadable.
- A source row exists but no shipped stage-select/game-file membership is proven.
- A stage is entered but the selected-stage label or build/save state is missing.
- A boss/reward is observed without stage/floor linkage.
- A clear screen is observed without subsequent town/world-map persistence proof.
- A stage may be tutorial-only, default-only, hidden, internal-only, or source-only, but no authoritative marker proves which.
- A direct capture uses an unknown build, language, save state, or modified profile.

Under those conditions, keep the row as `source-level / capture queue`, not implementation-ready.
