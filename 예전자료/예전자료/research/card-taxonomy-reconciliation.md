# Card Taxonomy Reconciliation

Status: `generated 2026-05-22 / source-level card taxonomy reconciliation`

This artifact reconciles the existing 52 unlock/evolution rows, the 87 Dexerto non-character card pages, the 90 official-wiki non-character card rows, the 113 official-wiki total card rows, and the official `65+ cards` shorthand. It does not prove the shipped collection UI, exact card text, mana cost, color/category, gem-slot count, target rules, evolution trigger, deck mutation, spawn pool, or runtime formulas. Treat it as a capture queue for card collection UI, Grim Grimoire/evolution UI, high-resolution video, and game-file proof.

Primary inputs:

- `research/data-cards.md`
- `research/card-gap-map.md`
- `research/card-secondary-catalog.md`
- `research/card-dexerto-page-crawl.md`
- `research/official-wiki-card-gem-field-crawl.md`
- `research/official-wiki-card-gem-value-extract.md`
- `research/official-release-faq-crawl.md`
- `research/source-conflicts.md` CON-017, CON-021, CON-022, CON-031, CON-032, and CON-037
- Sources: SRC-006, SRC-102, SRC-103, SRC-104, SRC-113, SRC-114, SRC-115, SRC-117, SRC-127, SRC-129, SRC-141, SRC-142, and SRC-146

## Reconciliation Snapshot

| Segment | Rows | Notes |
| --- | ---: | --- |
| Existing unlock/evolution implementation-gap rows | 52 | 35 unlock-style rows plus 17 evolution result rows |
| Dexerto non-character individual card pages | 87 | 40 attack, 8 defense, 18 stat-boost, 6 mana, 9 wild, and 6 temporary pages |
| Dexerto non-character rows matching official-wiki card names | 87 | Name-level source match only; not runtime parity |
| Official-wiki non-character card rows | 90 | Same 87 Dexerto rows plus 3 official-wiki-only non-character rows |
| Official-wiki total card rows | 113 | 90 non-character rows plus 23 character/Crawler card rows |
| Dexerto character links / pages | 22 | Tracked in character research; not merged into the non-character card table |
| Official release FAQ card shorthand | 65+ | Developer-social shorthand, not a row-level catalog |
| Dexerto page rows missing mana cost | 1 | `Mana Bomb`; official wiki gives a source-level `5` candidate |
| Dexerto page rows missing gem-slot field | 48 | Mostly Wild, Temporary, and evolved-card pages |
| Official-wiki card rows missing cost | 8 | 7 wild rows plus `Divano` |
| Official-wiki card rows missing gem slots | 16 | Mostly evolved/stat rows plus `Shatter` |
| Implementation parity closed by this file | 0 | Direct UI, game files, or runtime proof still required |

## Working Interpretation

The current source-level split is:

- The 35 public unlock-style rows and 17 evolution result rows are not the full card catalog. They are achievement/checklist-facing rows and evolution outputs.
- Dexerto exposes 87 non-character individual card pages. Those pages widen the non-character source-level catalog beyond the original 52 mapped rows by adding 35 catalog-only rows.
- Every Dexerto non-character page row currently has a normalized official-wiki card-row match.
- The official wiki has 90 non-character card rows, adding `Angelo Spietato`, `Crystal Crown`, and `Rich Coin Bag` outside the Dexerto 87-page boundary.
- The official wiki has 113 total card rows because it includes 23 character/Crawler card rows. Those overlap with character/Inn/party research and should stay separate until the shipped UI proves whether the card collection counts Crawler cards together with non-character cards.
- The official FAQ's `65+ cards` shorthand should remain a marketing/developer shorthand layer. It is not precise enough to override the 87, 90, or 113 row boundaries.
- `Mana Bomb` is the highest-priority cost reconciliation row: Dexerto has the page but no cost value; official wiki gives cost `5`; UI or game files must choose the final value.

Do not implement all 113 official-wiki rows as a final player-facing collection yet. The official wiki can include character cards, hidden/unavailable rows, or taxonomy rows whose shipped UI status still needs proof.

## Category-Level Reconciliation

| Category Layer | Dexerto Non-Character Rows | Official-Wiki Non-Character Rows | Delta | Current Treatment |
| --- | ---: | ---: | ---: | --- |
| Attack | 40 | 40 | 0 | All Dexerto attack rows have official-wiki name matches |
| Defense | 8 | 8 | 0 | All Dexerto defense rows have official-wiki name matches |
| Stat / Stat Boost | 18 | 19 | +1 wiki | `Crystal Crown` is official-wiki-only outside the Dexerto 87-page boundary |
| Mana | 6 | 6 | 0 | All Dexerto mana rows have official-wiki name matches; `Wings` is a `mana` path row with Wild type/cost behavior |
| Wild | 9 | 10 | +1 wiki | `Rich Coin Bag` is official-wiki-only and has missing official-wiki cost/text fields |
| Temporary | 6 | 7 | +1 wiki | `Angelo Spietato` is official-wiki-only outside the Dexerto 87-page boundary |
| Character / Crawler cards | 22 Dexerto character pages | 23 official-wiki character rows | +1 wiki | Character card rows belong to character taxonomy until card collection UI proves final count membership |

## Official-Wiki Non-Character Rows Outside Dexerto 87

| Official-Wiki Row | Type | Cost | Gem Slots | Demo | Text Keyword Buckets | Current Treatment |
| --- | --- | --- | --- | --- | --- | --- |
| Angelo Spietato | temporary | 5 | 0 | No | heal, retain, destroy | Official-wiki-only non-character row; prove whether it appears in shipped card UI/game files |
| Crystal Crown | stat | 2 | 1 | No | xp, destroy | Official-wiki-only non-character row; prove whether it is collectible, evolved, hidden, or taxonomy-only |
| Rich Coin Bag | wild | missing | 0 | No | none stored | Highest-priority wiki-only missing-text/cost row; direct UI or game-file proof required |

## Field Conflict Queue

| Conflict | Rows | Current Treatment |
| --- | --- | --- |
| 65+ shorthand vs 87/90/113 row tables | Full card catalog | Keep official shorthand, Dexerto pages, official-wiki non-character rows, and character-card rows as separate counting layers |
| Dexerto 87 vs official-wiki 90 non-character rows | `Angelo Spietato`, `Crystal Crown`, `Rich Coin Bag` | Track as official-wiki-only candidates until UI/game files prove player-facing status |
| 87 non-character vs 113 total official-wiki rows | 23 character/Crawler card rows | Keep in character research until collection UI proves whether they count inside the card catalog |
| Missing Dexerto cost | `Mana Bomb` | Official wiki gives source-level cost `5`; do not finalize without UI/game-file proof |
| Missing official-wiki costs | `Big Coin Bag`, `Clover Petal`, `Coin Purse`, `Divano`, `Little Clover`, `Raw Mana`, `Rich Coin Bag`, `Vacuum` | Use shipped UI or game files; do not infer all Wild costs from neighboring rows |
| Missing official-wiki gem slots | `Bloody Tear`, `Candelabrador`, `Candella`, `Candle`, `Death Spiral`, `Duplicator`, `Hellfire`, `Holy Wand`, `La Borra`, `NO FUTURE`, `Pummarola`, `Shatter`, `Skull O'Maniac`, `Soul Eater`, `Spinach`, `Unholy Vespers` | Use UI/game files before implementing socket eligibility |
| Evolution mapping | 17 public evolution result rows vs 19 official-wiki `evointo` base-card rows | Treat the 19 wiki rows as base/union mapping support, not extra evolution result rows |
| FRVR vs Dexerto boundary | FRVR 109 table rows / 105 distinct names vs Dexerto 87 non-character pages | Use FRVR as effect/cost hints only; Dexerto/wiki rows are the current row-boundary anchors |

## Direct Proof Queue

- Capture the shipped card collection/catalog UI and record whether it shows 65+, 87, 90, 113, or another count.
- Confirm whether Crawler/character cards are counted in the same card catalog or a separate character/party system.
- Confirm whether `Angelo Spietato`, `Crystal Crown`, and `Rich Coin Bag` appear in game UI, save data, reward pools, or game files.
- Resolve `Mana Bomb` cost and text from card UI or game files.
- Resolve official-wiki missing-cost Wild rows and the `Divano` character-card missing-cost row from UI/game files.
- Resolve all missing gem-slot rows and socket eligibility before implementing card/gem compatibility.
- Capture Grim Grimoire/evolution UI for every public evolution result, including accepted alternate ingredients, union recipes, consumed/retained cards, socket-blocking behavior, and deck-before/deck-after state.
- Capture at least one runtime use case for each confirmed Wild and Temporary card row, especially destroy/temporary behavior, draw/cost randomization, freeze, and shatter effects.
- Record exact card text, cost, gem slots, target rules, timing, unlock state, and runtime behavior for every confirmed card row before implementation approval.
