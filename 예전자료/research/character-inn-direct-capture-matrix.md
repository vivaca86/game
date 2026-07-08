# Character / Inn Direct Capture Matrix

Status: `generated 2026-05-22 / direct-proof execution matrix / blocked until app 3265700 or game files are available`

Related files:

- [`direct-play-verification.md`](./direct-play-verification.md) DP-203 and DP-205
- [`remaining-proof-queue.md`](./remaining-proof-queue.md)
- [`character-taxonomy-reconciliation.md`](./character-taxonomy-reconciliation.md)
- [`character-gap-map.md`](./character-gap-map.md)
- [`character-dexerto-page-crawl.md`](./character-dexerto-page-crawl.md)
- [`official-wiki-character-value-extract.md`](./official-wiki-character-value-extract.md)
- [`town-taxonomy-reconciliation.md`](./town-taxonomy-reconciliation.md)
- [`enemy-direct-capture-matrix.md`](./enemy-direct-capture-matrix.md)
- [`card-direct-capture-matrix.md`](./card-direct-capture-matrix.md)
- [`source-conflicts.md`](./source-conflicts.md) CON-002, CON-007, CON-008, CON-023, CON-024, CON-033, CON-037, CON-040, CON-041

This matrix turns the Character / Crawler / Gorton Bell Inn taxonomy into direct-play, high-resolution video, and game-file capture packets. It is not proof by itself. Character and Inn implementation remains closed until every accepted row has shipped roster membership, availability state, purchase/equip behavior, exact text, starter deck, party rule, runtime behavior, unlock state, and acceptance criteria.

## Capture Packet Standard

Every character/Inn packet must include these fields before it can close a row:

| Field | Requirement |
| --- | --- |
| Build baseline | App `3265700`, build id/version, platform, language, timestamp, save state |
| Source layer | Steam/Dexerto public unlock row, secondary roster row, Dexerto character page row, official-wiki row, Store media candidate, storyboard row, or game-file row |
| Roster proof | Character-select UI, Gorton Bell Inn UI, party UI, locked/hidden slot, save data, or game-file table |
| Availability proof | Default, tutorial, first-run, purchase, rescue/coffin, achievement/Town Hall, hidden, unavailable, internal-only, postgame, or excluded |
| Price proof | Inn purchase price, discount price, non-purchasable marker, unlock cost, card play cost, and currency state; never mix these fields |
| Crawler-card proof | Exact name, mana cost, duration, text, trigger color/condition, card category, deck insertion/removal, and Crawler leave behavior |
| Starter-deck proof | Lead starter deck before/after, follower deck delta, duplicate handling, starter power-up/stat grants, and exception rows |
| Runtime proof | Passive trigger, lead/follower behavior, color trigger, duration countdown, stat formula, reward/economy impact, and failure cases |
| Unlock proof | Achievement/Town Hall counter, unlock popup, Inn row state change, route/stage/enemy trigger, or game-file unlock condition |
| Source resolution | Confirmed, contradicted, unresolved, version difference, hidden, unavailable, default-only, internal-only, or excluded |
| Implementation output | Exact row data and testable acceptance condition; do not implement from partial packets |

## Priority Order

| Priority | Packet IDs | Reason |
| --- | --- | --- |
| P0 | CHR-DP-001 to CHR-DP-006 | Close roster/count/availability boundaries before row implementation. |
| P1 | CHR-DP-007 to CHR-DP-017 | Capture the 20 public unlock-style rows and their unlock proof families. |
| P2 | CHR-DP-018 to CHR-DP-026 | Resolve Imelda, MissingN0, Divano, Inn costs, card costs, durations, and starter-deck fields. |
| P3 | CHR-DP-027 to CHR-DP-034 | Resolve party/lead/follower rules, Crawler cards, passives, and runtime behavior. |
| P4 | CHR-DP-035 to CHR-DP-043 | Resolve conflict rows, persistence, Town Hall linkage, and implementation acceptance. |

## P0 Roster / Count / Inn Boundary

| Packet ID | Target | Source-Layer Starting Point | Required Capture | Closes / Updates |
| --- | --- | --- | --- | --- |
| CHR-DP-001 | Full player-facing roster count | 20 public unlock rows, 21 secondary roster, 22 Dexerto pages, 23 official-wiki rows, official `20+` shorthand | Capture character-select and Inn roster counts, locked slots, filters/tabs, hidden slots, unavailable rows, and completion count | CON-002, CON-008, CON-037 |
| CHR-DP-002 | Fresh-save character state | Antonio/Imelda/default/tutorial/first-run conflict | Capture first launch, post-tutorial, first town, first run return, and fresh Inn state before purchases | Default vs tutorial vs first-run rows |
| CHR-DP-003 | Gorton Bell Inn surface | Town taxonomy and Store `THE GORTON BELL` exterior candidate | Capture building label, locked/unlocked state, entry UI, roster grid/list, currency, party slots, lock text, and previews | Inn system proof |
| CHR-DP-004 | Character-select vs Inn split | Character select, party/equip UI, purchase UI | Capture whether selecting, purchasing, equipping, and Crawler-card preview are one UI or separate surfaces | UI surface taxonomy |
| CHR-DP-005 | Game-file character table index | Official-wiki 23 rows, Dexerto 22 pages, public 20 rows | If game files are available, extract ids, display names, unlock states, costs, decks, passives, and availability flags | Source row-to-file token map |
| CHR-DP-006 | Hidden/unavailable/internal rows | MissingN0 and Divano plus blank/non-numeric official-wiki rows | Capture hidden slot markers, unavailable labels, internal-only flags, future/post-launch markers, or absence from shipped UI/files | Hidden/unavailable boundary |

## P1 Public 20 Unlock Row Capture

| Packet ID | Family | Source Rows | Required Capture | Output |
| --- | --- | --- | --- | --- |
| CHR-DP-007 | Coffin/rescue unlocks | Poppea, Concetta, Giovanna, Pugnala | Stage/route, coffin/object UI, rescue popup, Inn row state change, starter deck, and passive sample | Coffin unlock table |
| CHR-DP-008 | Boss/enemy unlocks | Gallo, Ramba, Gennaro, O'Sole, Cavallo, Mortaccio | Enemy identity, stage/floor, count/kill proof, unlock popup, Town Hall row, Inn row state | Boss/enemy unlock table |
| CHR-DP-009 | Card-use unlocks | Christine, Porta, Poe, Arca, Pasqualina | Card catalog proof, use counter, threshold, unlock popup, exact Inn row, and passive sample | Card-use unlock table |
| CHR-DP-010 | Stat/economy/condition unlocks | Clerici, Krochi, Lama, Dommario | Healing/enemy/curse/coin counter state, off-by-one threshold, unlock popup, and Inn row | Counter/condition unlock table |
| CHR-DP-011 | Antonio/tutorial row | Antonio | Capture tutorial/rescue wording, starting state, unlockcost `0` handling, starter deck, and first character card behavior | Antonio state resolution |
| CHR-DP-012 | Gennaro/Mantichana unlock | Gennaro and Mantichana | Capture Mantichana fight/name proof, Mad Forest link, unlock popup, Inn row, starter deck and passive | CON-024 bridge |
| CHR-DP-013 | Ramba/Milk Elemental unlock | Ramba and Milk Elemental | Capture Milk Elemental fight/name proof, Dairy Plant link, unlock popup, Inn row, missing duration proof | CON-024 bridge |
| CHR-DP-014 | Gallo boss vs character row | Iguana Gallo Valletto and Gallo boss | Capture boss Gallo nameplate/reward and character Gallo Inn/card row separately | Boss/character disambiguation |
| CHR-DP-015 | O'Sole Dragon Shrimp count | O'Sole, Dragon Shrimp | Capture Town Hall/achievement text, counter value, Dragon Shrimp enemy identity, unlock popup, and whether count is 50, 15, or another value | CON-041 |
| CHR-DP-016 | Public 20 full pass | CHR-001 through CHR-020 | Capture exact availability, unlock, price, Crawler-card, deck, passive, runtime sample, and unresolved reason for every public row | Public 20 acceptance matrix |
| CHR-DP-017 | Public-row reward linkage | All 20 public rows | Capture whether completion grants row availability, purchase option, free recruitment, Crawler-card, achievement only, or Town Hall reward | Unlock-state taxonomy |

## P2 Extra Rows / Costs / Field Conflicts

| Packet ID | Target | Source-Layer Starting Point | Required Capture | Closes / Updates |
| --- | --- | --- | --- | --- |
| CHR-DP-018 | Imelda state | Secondary playable row, Dexerto page, official wiki `unlockcost = 10`, blank unlocked-by field | Capture fresh-save, post-tutorial, first-Mad-Forest, Inn price/state, character-select state, starter deck, passive | CON-023 |
| CHR-DP-019 | MissingN0 hidden row | Dexerto page, VGC/RedDeath, official wiki `unlockcost = 6666`, unusual stats/duration | Capture hidden slot, RedDeath trigger, unlock popup, Inn price/state, spelling, starter deck, and whether row is shipped/current | CON-007 |
| CHR-DP-020 | Divano unavailable row | Official-wiki-only row with blank fields and unavailable note | Capture absence/presence in UI/files, unavailable marker, internal flag, placeholder status, or future/post-launch status | Divano boundary |
| CHR-DP-021 | Inn purchase costs | 10 numeric / 11 blank / 2 non-numeric official-wiki `unlockcost` candidates | Capture exact prices, blank rows, unavailable rows, no-cost rows, N/A/No interpretations, and currency state before/after purchase | CON-033, CON-040 |
| CHR-DP-022 | Crawler-card play cost vs purchase cost | Dexerto `Mana Cost`, official-wiki `Card Cost`, Inn `Unlock Cost` | Capture play cost in card tooltip/hand and purchase price in Inn UI for the same row, proving field separation | CON-033 |
| CHR-DP-023 | Missing duration rows | Porta, Ramba, Divano | Capture tooltip/game-file duration and runtime countdown for each missing-duration row or prove unavailable/excluded | Duration field queue |
| CHR-DP-024 | Trigger color buckets | blue, purple, red, wild, yellow, blank | Capture UI color labels/icons, trigger conditions, and at least one activation and non-activation for each bucket | Trigger color table |
| CHR-DP-025 | Starter-deck exactness | 22 official-wiki starter deck rows, Divano blank | Capture deck list and counts for fresh lead character and every confirmed row; compare Dexerto/wiki candidates | Starter deck table |
| CHR-DP-026 | Base stat / power-up grants | 22 official-wiki lead-crawler base-stat rows | Capture pre/post lead selection stats, power-up list, formulas, and whether follower rows omit stat grants | Lead stat table |

## P3 Party / Crawler Card / Runtime Behavior

| Packet ID | Target | Source-Layer Starting Point | Required Capture | Output |
| --- | --- | --- | --- | --- |
| CHR-DP-027 | Lead vs follower deck rule | Official-wiki rule flags | Capture lead starter deck, follower one-card addition, no-extra-power-up rule, duplicate handling, and exceptions | Party deck delta table |
| CHR-DP-028 | Party size and equip flow | Secondary three-Crawler party claims | Capture max party size, slot unlocks, swap/remove order, unavailable row behavior, and persistence | Party/equip rules |
| CHR-DP-029 | Crawler-card lifecycle | Every confirmed Crawler card | Capture hand insertion, play cost, duration, trigger count, leave timing, return/top-deck/discard behavior, and interaction with arcana/gems | Crawler-card lifecycle table |
| CHR-DP-030 | Passive trigger runtime | Every confirmed character | Capture one controlled trigger example and one non-trigger case per passive, with before/after stats or combat state | Passive runtime table |
| CHR-DP-031 | Lead passive vs follower passive | Same character as lead and follower where possible | Capture whether passives are active only while in party, only when card is active, or always after recruitment | Passive scope table |
| CHR-DP-032 | Color-trigger interactions | Trigger gems, Wild cards, arcana, and Crawler passives | Capture order and stacking when a card color, Wild bridge, gem, and Crawler trigger all apply | Cross-system trigger order |
| CHR-DP-033 | Crawler duration/countdown | 20 duration rows, missing duration rows, MissingN0 170 candidate | Capture turn/trigger decrement, encounter boundary, re-play behavior, duplicate Crawler card behavior, and duration display | Duration runtime table |
| CHR-DP-034 | Disco discount behavior | Official-wiki Characters page flag: after five purchases, 10% chance, 5% discount | Capture trigger threshold, displayed discount, affected rows, retrigger behavior, and save persistence | Disco/discount rule |

## P4 Persistence / Conflicts / Implementation Acceptance

| Packet ID | Target | Required Capture | Output |
| --- | --- | --- | --- |
| CHR-DP-035 | Save/load persistence | Purchased/unlocked/equipped characters, party order, discounts, hidden rows | Reload, relaunch, run restart, defeat/clear, and profile persistence proof |
| CHR-DP-036 | Town Hall / achievement linkage | All character public unlocks plus Imelda/MissingN0/Divano if present | In-game checklist rows, Steam achievements, unlock popup, reward state, and persistence |
| CHR-DP-037 | Character preview UI | Portrait/icon, name, card, passive, trigger, deck, cost, lock text | Exact UI field taxonomy for implementation |
| CHR-DP-038 | Error/invalid states | Insufficient coins, locked character, full party, duplicate row, hidden row, unavailable row | Disabled state, tooltip, confirmation, refund/no-op behavior |
| CHR-DP-039 | Fresh/progressed Inn snapshots | Fresh, after tutorial, after first run, after selected unlocks, late/postgame | State transition map and exact row availability |
| CHR-DP-040 | Cross-domain unlock dependencies | Enemy, stage, card, power-up, Town Hall, achievement rows | Update linked direct matrices only when proof is strong enough |
| CHR-DP-041 | Name/spelling normalization | O'Sole, MissingN0, RedDeath/Red Death, Mantichana, Milk Elemental, Gorton Bell Inn | In-game spelling table and alias map |
| CHR-DP-042 | Version/build regression check | Hotfix 1.4.1/build `23012943` candidate and installed build state | Confirm installed build/version before accepting captures as current-build proof |
| CHR-DP-043 | Implementation acceptance pass | All confirmed character/Inn rows | Exact data row, behavior tests, UI text, unlock condition, party rule, and parity status for later implementation |

## Backfill Instructions

When a character/Inn packet is completed, update these files in order:

1. [`direct-play-verification.md`](./direct-play-verification.md): mark DP-203/DP-205 evidence and build/language/platform.
2. [`character-taxonomy-reconciliation.md`](./character-taxonomy-reconciliation.md): change source-layer candidates into confirmed/rejected/hidden/unavailable/default mappings.
3. [`data-characters.md`](./data-characters.md): add exact character, Crawler-card, Inn, starter-deck, and runtime fields.
4. [`character-gap-map.md`](./character-gap-map.md): update parity only after all acceptance fields are proven.
5. [`town-taxonomy-reconciliation.md`](./town-taxonomy-reconciliation.md) and [`town-gap-map.md`](./town-gap-map.md): update Gorton Bell Inn and party/purchase flow proof.
6. [`source-conflicts.md`](./source-conflicts.md): resolve or preserve CON-002, CON-007, CON-008, CON-023, CON-024, CON-033, CON-037, CON-040, and CON-041.
7. [`enemy-taxonomy-reconciliation.md`](./enemy-taxonomy-reconciliation.md) and [`enemy-direct-capture-matrix.md`](./enemy-direct-capture-matrix.md) for boss/enemy count-linked rows.
8. [`card-taxonomy-reconciliation.md`](./card-taxonomy-reconciliation.md) and [`card-direct-capture-matrix.md`](./card-direct-capture-matrix.md) for Crawler-card membership and card-field proof.
9. [`achievement-gap-map.md`](./achievement-gap-map.md) and [`data-achievements.md`](./data-achievements.md) for Town Hall/achievement linkage.
10. [`gap-map.md`](./gap-map.md) only after row-level files are updated.
11. Later implementation files only after each row has a testable acceptance condition.

## Stop Conditions

Stop and preserve a row as unresolved when any of these happen:

- The roster row is visible but its price, lock text, or availability state is unreadable.
- A character page/source row exists but no shipped UI/game-file membership is proven.
- Purchase price and Crawler-card play cost cannot be separated.
- A starter deck is observed without before/after deck counts.
- A passive is described but no controlled runtime example or game-file formula is available.
- A row may be hidden, unavailable, internal-only, default-only, or post-launch, but no authoritative marker proves which.
- A direct capture uses an unknown build, language, save state, or modified profile.

Under those conditions, keep the row as `source-level / capture queue`, not implementation-ready.
