# Town / Power-Up / Relic / Arcana Direct Capture Matrix

Status: `generated 2026-05-22 / direct-proof execution matrix / blocked until app 3265700 or game files are available`

Related files:

- [`direct-play-verification.md`](./direct-play-verification.md) DP-001 to DP-005, DP-201 to DP-208, and DP-301 to DP-304
- [`remaining-proof-queue.md`](./remaining-proof-queue.md)
- [`town-taxonomy-reconciliation.md`](./town-taxonomy-reconciliation.md)
- [`town-gap-map.md`](./town-gap-map.md)
- [`data-town.md`](./data-town.md)
- [`powerup-taxonomy-reconciliation.md`](./powerup-taxonomy-reconciliation.md)
- [`powerup-destructoid-tier-crawl.md`](./powerup-destructoid-tier-crawl.md)
- [`relic-taxonomy-reconciliation.md`](./relic-taxonomy-reconciliation.md)
- [`relic-gamespot-page-crawl.md`](./relic-gamespot-page-crawl.md)
- [`arcana-taxonomy-reconciliation.md`](./arcana-taxonomy-reconciliation.md)
- [`arcana-dexerto-unlock-crawl.md`](./arcana-dexerto-unlock-crawl.md)
- [`official-wiki-arcana-relic-dungeon-value-extract.md`](./official-wiki-arcana-relic-dungeon-value-extract.md)
- [`official-wiki-enemy-event-powerup-value-extract.md`](./official-wiki-enemy-event-powerup-value-extract.md)
- [`character-inn-direct-capture-matrix.md`](./character-inn-direct-capture-matrix.md)
- [`gem-direct-capture-matrix.md`](./gem-direct-capture-matrix.md)
- [`stage-route-direct-capture-matrix.md`](./stage-route-direct-capture-matrix.md)
- [`source-conflicts.md`](./source-conflicts.md) CON-003, CON-006, CON-011, CON-012, CON-018, CON-019, CON-020, CON-026, CON-027, CON-035, CON-036, CON-038, CON-039, CON-040, CON-043, CON-044

This matrix turns village, Power-Up, relic, and Arcana source-level taxonomy into direct-play, high-resolution video, and game-file capture packets. It is not proof by itself. Town/meta implementation remains closed until each accepted row has shipped UI membership, exact label text, lock state, cost or toggle rule, runtime consequence, persistence, and a row-level acceptance condition.

## Capture Packet Standard

Every packet in this file must include these fields before it can close a row:

| Field | Requirement |
| --- | --- |
| Build baseline | App `3265700`, build id/version, platform, language, timestamp, save slot, save age, and whether demo app `4329470` was ever used |
| Source layer | Steam achievement metadata, Store media, official wiki value row, guide row, storyboard/video row, official FAQ/news/platform row, or game-file row |
| Town-state proof | Fresh-save village, progressed village, building lock/unlock state, currency, route progress, achievement/checklist state, and visible building labels |
| Surface proof | Building entry, tab/list contents, selected row, tooltip/panel text, disabled state, confirm/cancel flow, and exact displayed wording |
| Transaction proof | Buy, refund, rank-up, seal/unseal, toggle, equip, unequip, reroll, skip, invalid purchase, or no-op state where relevant |
| Runtime proof | Next-run or same-run effect after the town action, including stat/card/gem/relic/Arcana behavior rather than only menu text |
| Persistence proof | Return to town, save/reload, relaunch, changed slot, failure/retry, and next-run comparison |
| Source resolution | Confirmed, contradicted, unresolved, version difference, hidden, default-only, run-only, internal-only, or excluded |
| Implementation output | Exact row data and testable acceptance condition; do not implement from partial packets |

## Priority Order

| Priority | Packet IDs | Reason |
| --- | --- | --- |
| P0 | TPRA-DP-001 to TPRA-DP-006 | Establish village, save, platform, and building-boundary proof before entering per-system rows. |
| P1 | TPRA-DP-007 to TPRA-DP-014 | Capture the town surfaces that gate all meta progression. |
| P2 | TPRA-DP-015 to TPRA-DP-026 | Resolve 13 rankable / 6 run-found / 19 official-wiki Power-Up split and cost/name conflicts. |
| P3 | TPRA-DP-027 to TPRA-DP-040 | Resolve 15 guide / 16 official-wiki relic boundary, Museum toggles, and blank-field rows. |
| P4 | TPRA-DP-041 to TPRA-DP-052 | Resolve 10 public / 12 official-wiki Arcana boundary and Fortune Teller selection/runtime behavior. |
| P5 | TPRA-DP-053 to TPRA-DP-060 | Backfill persistence, cross-domain effects, Town Hall mapping, and implementation acceptance. |

## P0 Village / Save / Building Boundary

| Packet ID | Target | Source-Layer Starting Point | Required Capture | Closes / Updates |
| --- | --- | --- | --- | --- |
| TPRA-DP-001 | Installed build and save baseline | Main app `3265700`, demo app `4329470`, Store appdetails, Steam news, SteamDB build candidate | Capture installed app id, build/version, branch, language, platform, save-slot list, Steam Cloud state, and whether a demo save exists | CON-042, platform baseline |
| TPRA-DP-002 | Fresh village exterior | 8 collected town/meta rows; Store movie `THE GORTON BELL` exterior proof | Capture first loaded village before any run: all visible building labels, locks, guidance text, currency, menu tabs, and camera positions | TOWN-001 to TOWN-008 |
| TPRA-DP-003 | Progressed village exterior | The Inn, Power Ups Shop, Relic Museum, Blacksmith, Jeweller, Fortune Teller, Town Hall, stage-map links | Capture village after each major unlock and after late-route progress; preserve before/after images for each building | Building unlock order |
| TPRA-DP-004 | Game-file town table | Building rows, menu ids, save flags, unlock flags, costs, toggle flags | If game files are available, extract town/building/menu/save identifiers and map them to display rows | Source row-to-file token map |
| TPRA-DP-005 | Building entry and exit loop | Village hub and route/menu boundaries | For every building, record entry trigger, loading/transition, close/back state, changed/unchanged currency, and return-to-village persistence | Village navigation parity |
| TPRA-DP-006 | Demo/full/save migration boundary | Official FAQ/news demo carryover, no launch cross-save, save slots, tutorial-demo-save deletion exception | Capture demo-to-full behavior if available, full-version fresh-start prompt, migration exception, achievement grant, and cross-save/cloud boundary | TOWN-008, CON-042 |

## P1 Town Surface Capture

| Packet ID | Target | Source-Layer Starting Point | Required Capture | Output |
| --- | --- | --- | --- | --- |
| TPRA-DP-007 | Gorton Bell Inn wrapper | Store sign, Steam Inn achievement, 23 official-wiki character rows, 22 starter decks, 10 numeric / 11 blank / 2 nonnumeric `unlockcost` candidates | Capture Inn exterior/interior label, roster list, prices, locks, party slots, Disco state, and link detailed row work to `character-inn-direct-capture-matrix.md` | Inn building proof and handoff to character matrix |
| TPRA-DP-008 | Power-Up Shop entry | Steam `Power Ups Shop`; 19 official-wiki rows; 13/6 Destructoid split | Capture building label, row count, initial visible rows, locked rows, currency, refund/respec controls, and any rank filters | Power-Up surface baseline |
| TPRA-DP-009 | Blacksmith entry | Gem Hammer socket access; Stardust Anvil extra-slot purchase; PC Gamer/PGG Blacksmith hints | Capture building label, unlock route, valid card targets, slot cap, cost, buy/cancel flow, socket-blocked evolution cases, and save persistence | Blacksmith slot-purchase proof |
| TPRA-DP-010 | Jeweller / Jeweler entry | Lapidary Loupe, rarity adjustment, sealing, Luck interaction, Blacksmith/Jeweller split | Capture exact building/menu label, rarity controls, seal/unseal, cost table, valid/invalid gems, Luck or pool text if visible, and persistence | CON-006, CON-026 |
| TPRA-DP-011 | Fortune Teller / Arcana Tent entry | Polentir/Arcana Finder, 10 public Arcana rows, 12 official-wiki rows | Capture exact building label, row count, lock state, selection flow, equip limits, default rows, and start-run handoff | CON-003, CON-043 |
| TPRA-DP-012 | Relic Museum entry | Steam `Relic Museum`, 15 GameSpot rows, 16 official-wiki rows, toggle claims | Capture exact building label, row count, visible/locked/hidden rows, toggles, disabled state, source/location text, and list filters | CON-011 |
| TPRA-DP-013 | Town Hall / Unlocks entry | 161 Steam achievements and VID-013 Town Hall/Unlocks surface | Capture counters, filters, locked/completed/new rows, reward links, achievement mappings, and several before/after unlock popups | Town Hall sample map; full achievement matrix later |
| TPRA-DP-014 | Cross-building dependency pass | Inn, Power-Up Shop, Blacksmith, Jeweller, Fortune Teller, Museum, Town Hall | After every route/relic/stage/achievement unlock, revisit all buildings and capture changed labels, rows, costs, locks, and notifications | Dependency update map |

## P2 Power-Up Shop And Run-Found Power-Ups

| Packet ID | Target | Source-Layer Starting Point | Required Capture | Closes / Updates |
| --- | --- | --- | --- | --- |
| TPRA-DP-015 | Full Power-Up roster count | 13 Destructoid rankable rows, 6 Destructoid run-found rows, 19 official-wiki rows | Capture complete shop list at fresh/progressed states and any separate run-found reward list; record visible/hidden/locked rows | CON-027, CON-037 |
| TPRA-DP-016 | Initial-shop official-wiki bucket | Area, Armor, Duration, Growth, Luck, Max Health, Might, Recovery, Reroll | Capture labels, prices, ranks, max states, unlock text, buy flow, stat preview, and persistence | Initial Power-Up rows |
| TPRA-DP-017 | Weeny Bridge bucket | Banish, Curse, Hand, Magnet, Revival | Capture shop after Weeny Bridge and run reward screens for the same rows; determine permanent shop vs run-only class | CON-027 |
| TPRA-DP-018 | Meany Bridge bucket | Amount, Crawler Slot, Mana/Cooldown | Capture unlock state, rank caps, costs, Crawler Slot party-size before/after, and Mana/Cooldown displayed label | CON-027, CON-039 |
| TPRA-DP-019 | Inlaid Library and blank bucket | Greed; Skip blank official-wiki unlock field | Capture Greed unlock route, Skip availability, lock text if any, price/rank, and whether blank means default, hidden, or incomplete source field | Skip boundary |
| TPRA-DP-020 | Reroll cost conflict | PC Gamer 250 vs official-wiki 200 | Capture first-rank price, later ranks, shop version/build, refund impact, and reroll runtime screens | CON-038 |
| TPRA-DP-021 | Might and Luck percent conflict | PC Gamer 20% vs official-wiki +25% | Capture display percent per rank, affected stat panels, reward quality/rarity hints, and one runtime before/after sample | CON-038, CON-006 |
| TPRA-DP-022 | Recovery timing | PC Gamer/official-wiki 500 and +1 source agreement | Capture buy flow, exact wording, heal timing after encounters, overheal/cap behavior, and save persistence | Recovery row proof |
| TPRA-DP-023 | Crawler Slot behavior | Destructoid S-tier; official-wiki max level 2, +1/+2, cost 3500 | Capture party limit before rank 1, after rank 1, after rank 2, invalid over-limit state, Inn interaction, and persistence | Party-size proof |
| TPRA-DP-024 | Refund/respec control | PC Gamer refund-button claim; no official-wiki refund row | Capture absent/present refund control, enabled/disabled state, refund value, reset scope, confirmation, and save/reload behavior | Refund/respec proof |
| TPRA-DP-025 | Run-found reward classification | Banish, Curse, Hand, Magnet, Mana/Cooldown, Revival | Capture dungeon reward/event screens where these appear and compare against shop rows after unlock gates | Permanent-vs-run class split |
| TPRA-DP-026 | Power-Up game-file table | Official-wiki ids: `PowerUp_*` rows and costs | If files are available, extract ids, display names, cost curves, max ranks, unlock flags, stat formulas, and localization keys | Final Power-Up source map |

## P3 Relic Museum And Relic Runtime

| Packet ID | Target | Source-Layer Starting Point | Required Capture | Closes / Updates |
| --- | --- | --- | --- | --- |
| TPRA-DP-027 | Full Museum roster count | GameSpot 15 visible rows vs official-wiki 16 rows | Capture fresh and progressed Museum list, row count, locked/hidden rows, `Deck Box` presence/absence, and filters | CON-011 |
| TPRA-DP-028 | Starting/system relics | Milky Way Map, Rilevatore, Deck Box blank `foundin` candidates | Capture fresh-save map/Museum state, starting active relics, and whether each row is visible, hidden, toggleable, or file-only | CON-011, CON-018 |
| TPRA-DP-029 | Deck Box boundary | Official-wiki-only 16th row; blank found-in/effects | Capture Museum row, relic-found panel, save flags, game-file row, or absence proof; classify as normal, hidden, starting, system, or wiki-only | CON-011 |
| TPRA-DP-030 | Combo Stack / Combo Stash | GameSpot/wiki `Combo Stack`; storyboard `Combo Stash` candidate | Capture full-resolution relic panel, Museum label, pause/evolution text if linked, and runtime combo example | CON-012 |
| TPRA-DP-031 | Randomazzo / Arcana Finder | GameSpot `Randomazzo`; official-wiki `Arcana Finder`; VID panel candidate | Capture exact relic-found text, Museum row, Arcana event/chest effect, and Fortune Teller dependency | Display-name split |
| TPRA-DP-032 | Rilevatore location/effect | GameSpot Curd Refinery; GAMES.GG starting; wiki blank fields | Capture fresh state, Curd Refinery reward panel, Museum source text, effect text, and combat-info runtime | CON-018 |
| TPRA-DP-033 | Ultimate Ultra Overkill location | GameSpot blank location; wiki Curd Refinery | Capture reward panel, Museum source/location text, Overkill cap before/after, and save persistence | CON-035 |
| TPRA-DP-034 | Guiding Light location | GameSpot/wiki Inlaid Library; PGG Mad Forest level-10 claim | Capture reward panel/source text and light-source map effect in next run | CON-036 |
| TPRA-DP-035 | Polentir route text | GameSpot Furious Forest; official-wiki Fortune Forest; PC Gamer after-Mad-Forest hint | Capture panel/source text, route node, Fortune Teller unlock, and exact display spelling | CON-043 |
| TPRA-DP-036 | Blacksmith/Jeweller relics | Gem Hammer, Stardust Anvil, Lapidary Loupe | Capture relic panel and immediate town-building effect for socket access, extra slots, rarity, and sealing | CON-026 |
| TPRA-DP-037 | Overkill/Ovenkilt economy | Overkill, Ovenkilt, Ultimate Ultra Overkill | Capture panel text, boss overkill gold, damage cap, chest gold disabled state, and cap changes | Relic economy proof |
| TPRA-DP-038 | Museum toggle behavior | Guide toggle claim | Toggle at least one active relic off/on; compare next-run effects, disabled UI, and save/reload persistence | Museum persistence |
| TPRA-DP-039 | Relic blank-effect rows | Combo Stack, Deck Box, Ovenkilt, Rilevatore | Capture exact panel text or game-file text for each blank wiki effects row | CON-011, CON-012, CON-018 |
| TPRA-DP-040 | Relic game-file table | 16 official-wiki ids and GameSpot 15 rows | If files are available, extract ids, display names, found-in fields, effects, toggle flags, starting flags, and localization keys | Final relic source map |

## P4 Fortune Teller And Arcana Runtime

| Packet ID | Target | Source-Layer Starting Point | Required Capture | Closes / Updates |
| --- | --- | --- | --- | --- |
| TPRA-DP-041 | Full Arcana roster count | Dexerto/Steam 10 public rows vs official-wiki 12 rows | Capture Fortune Teller list count, locked/hidden/default rows, `Experimental Medicine`, `Shield Bash`, and any filters | CON-003, CON-037 |
| TPRA-DP-042 | Polentir default rows | Official-wiki says Experimental Medicine and Shield Bash unlock when taking Polentir | Capture state before/after Polentir, visibility, automatic unlock/equip state, and Town Hall rows for both | CON-003, CON-043 |
| TPRA-DP-043 | Public 10 unlock rows | Dexerto 10-row table and Steam public metadata | Capture locked/unlocked text, row order, exact names, tracker text, and current progress for all 10 public rows | Public Arcana proof |
| TPRA-DP-044 | Wild Buff count | Dexerto 200 light-source cards vs official-wiki 250 | Capture Fortune Teller/Town Hall tracker or game-file value; if using play, preserve before/after count proof | CON-044 |
| TPRA-DP-045 | And Another count | Dexerto/official-wiki 150 Free-to-Play vs GAMES.GG 500 | Capture tracker/UI/game-file threshold and one unlock transition if possible | CON-019 |
| TPRA-DP-046 | Over The Top return zone | NeonLightsMedia hand-return vs PC Gamer/Store top-of-deck wording | Capture exact effect text and one runtime case where a Crawler leaves and returns | CON-020 |
| TPRA-DP-047 | Mana Syphon / Sharp Mind mana behavior | Mana in one turn, purple-card usage | Capture exact effect text, trigger counter, mana carryover/reset, and one runtime sample | Mana Arcana proof |
| TPRA-DP-048 | Armor/deck/trigger Arcana | Your Shield My Liege, Swollen Fist, Make a Scene, Chain Link, Jester's Hat | Capture exact tracker text, effect text, runtime examples, and whether Town Hall matches Steam metadata | Arcana tracker proof |
| TPRA-DP-049 | Equip limit and selection flow | One-Arcana equip assumption; start-run selection | Capture select/confirm/cancel, replace, unequip, multiple-selection invalid state, and run-start state | Fortune Teller rules |
| TPRA-DP-050 | Arcana Finder interaction | Arcana Finder/Randomazzo adds Arcana events/chests | Capture dungeon Arcana reward, whether it bypasses equip limit, and persistence after run | Relic-Arcana cross-domain proof |
| TPRA-DP-051 | Store/movie visible Arcana candidates | Mana Syphon, Over The Top, Wild Buff, Your Shield My Liege visible selection candidates | Use direct UI or high-resolution official media to confirm exact wording, not cropped/partial text alone | Media candidate resolution |
| TPRA-DP-052 | Arcana game-file table | 12 official-wiki rows and public 10 rows | If files are available, extract ids, display names, unlock conditions, default flags, effect formulas, equip limits, and localization keys | Final Arcana source map |

## P5 Backfill, Persistence, And Acceptance

| Packet ID | Target | Source-Layer Starting Point | Required Capture | Output |
| --- | --- | --- | --- | --- |
| TPRA-DP-053 | Town Hall mapping sample | Town Hall/Unlocks surface, Steam 161 rows | Map at least one Power-Up, one relic, one Arcana, one Inn, and one stage unlock between Town Hall, popup, and Steam achievement text | Achievement matrix seed |
| TPRA-DP-054 | Economy persistence | Coins, purchases, refunds, toggles, unlocks | Capture currency before/after transactions, return to town, save/reload, relaunch, and rollback/invalid state | Save/economy acceptance |
| TPRA-DP-055 | Cross-domain run comparison | Power-Ups, relic toggles, Arcana, Inn party, Blacksmith/Jeweller | Run before/after comparisons proving the menu action changes actual run behavior | Runtime acceptance |
| TPRA-DP-056 | Localization and spelling audit | Jeweller/Jeweler, Power Ups/Power-Ups, Polentir, Cappella/Capella, Randomazzo/Arcana Finder, Combo Stack/Stash | Capture exact English labels and any localization keys available; preserve aliases until game text is final | Name normalization |
| TPRA-DP-057 | Fresh vs progressed delta sheet | Every building and every major table | Build a row-level before/after table: fresh, after first run, after each unlock gate, after final route, after reload | Progression state map |
| TPRA-DP-058 | Game-file-only classification | Rows visible in files but not UI | Mark rows as hidden, future, internal, default-only, debug, cut, or unresolved; never count as player-facing without UI/save proof | File-vs-UI boundary |
| TPRA-DP-059 | Implementation acceptance rows | All confirmed town/meta rows | For each confirmed row, write exact display text, data fields, effect rules, persistence behavior, and a local test target | Data backfill queue |
| TPRA-DP-060 | Stop condition audit | All packets above | Verify unresolved rows remain tagged source-level/capture queue and do not unlock implementation parity | Handoff safety gate |

## Row Groups That Must Stay Separate

| Group | Current Source-Level Boundary | Do Not Collapse Until |
| --- | --- | --- |
| Town building rows | 8 collected rows plus Steam/Store/media/platform layers | Fresh/progressed village UI or game-file building table proves exact membership |
| Inn values | 23 character rows, 22 starter decks, and purchase-cost candidates | Inn UI/game files prove roster, prices, default/paid state, and party rules |
| Power-Ups | 13 Destructoid rankable, 6 Destructoid run-found, 19 official-wiki rows | Shop UI, run reward UI, or game files prove class, costs, ranks, unlocks, and labels |
| Relics | 15 GameSpot visible rows, 16 official-wiki rows, `Deck Box` extra row | Museum UI, relic panels, save flags, or game files prove player-facing status |
| Arcana | 10 public unlock rows, 12 official-wiki rows, 2 Polentir/default candidates | Fortune Teller UI, Town Hall tracker, runtime proof, or game files prove roster and state |
| Blacksmith vs Jeweller | Socket/slot purchase vs rarity/sealing/pool controls | Building menus prove labels, entry path, costs, valid targets, and persistence |
| Platform save | Main app, demo app, Steam Cloud, no launch cross-save, save-slot fixes | Direct install/platform audit or official files prove target-build behavior |

## Backfill Targets

When any packet resolves a row, update in this order:

1. This packet row and/or [`direct-play-verification.md`](./direct-play-verification.md).
2. `data-town.md`, `data-relics.md`, `data-arcana.md`, and the relevant Power-Up data file if one is added.
3. `town-gap-map.md`, `relic-gap-map.md`, `arcana-gap-map.md`, and future Power-Up gap rows.
4. `town-taxonomy-reconciliation.md`, `powerup-taxonomy-reconciliation.md`, `relic-taxonomy-reconciliation.md`, and `arcana-taxonomy-reconciliation.md`.
5. `source-conflicts.md` when a conflict closes or remains explicitly unresolved.
6. `gap-map.md`, `RESEARCH_CHECKLIST.md`, and `HANDOFF.md` only after row-level files are stable.

## Stop Conditions

- Do not mark Town, Power-Up, Relic, or Arcana research complete from this matrix alone.
- Do not implement all 19 Power-Up rows as permanent shop rows until class membership is proven.
- Do not implement `Deck Box` as a normal Museum relic until player-facing status is proven.
- Do not implement `Experimental Medicine` or `Shield Bash` as default/automatic Arcana until Fortune Teller UI or game files prove the state.
- Do not resolve Reroll, Might, Luck, Mana/Cooldown, Wild Buff, And Another, Over The Top, Rilevatore, Guiding Light, Ultimate Ultra Overkill, Polentir, Combo Stack/Stash, or Randomazzo/Arcana Finder from source-level text alone.
- Keep current implementation parity at `0` until direct-play or game-file proof closes the row-level acceptance conditions.
