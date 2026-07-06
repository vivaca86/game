# Character / Crawler Taxonomy Reconciliation

Status: `generated 2026-05-22 / source-level character taxonomy reconciliation`

This artifact reconciles the 20 public character unlock-style rows, the 21 secondary playable-roster claims, the 22 Dexerto individual character pages, the 23 official-wiki character rows, and the official `20+ characters` shorthand. It does not prove the shipped character-select UI, Gorton Bell Inn roster, purchase prices, default state, hidden slots, starter decks, trigger colors, passive formulas, lead/follower party behavior, or runtime effects. Treat it as a capture queue for character-select UI, Inn UI, high-resolution video, and game-file proof.

Primary inputs:

- `research/data-characters.md`
- `research/character-gap-map.md`
- `research/character-dexerto-page-crawl.md`
- `research/official-wiki-character-field-crawl.md`
- `research/official-wiki-character-value-extract.md`
- `research/official-release-faq-crawl.md`
- `research/pcgamer-upgrade-priority-crawl.md`
- `research/source-conflicts.md` CON-002, CON-007, CON-008, CON-023, CON-024, CON-033, CON-037, CON-040, and CON-041
- Sources: SRC-006, SRC-102, SRC-108-C, SRC-118, SRC-119, SRC-121, SRC-130, SRC-136, SRC-141, SRC-142, SRC-143, SRC-149, SRC-159, and SRC-301

## Reconciliation Snapshot

| Segment | Rows | Notes |
| --- | ---: | --- |
| Public character unlock-style rows | 20 | Steam public achievements and Dexerto unlock table layer |
| Secondary playable-roster claims | 21 | Public 20 plus Imelda as default/early roster candidate |
| Dexerto individual character pages | 22 | Public 20 plus Imelda and MissingN0 page rows |
| Dexerto page rows matching official-wiki character names | 22 | Name-level source match only; not availability or runtime parity |
| Official-wiki character rows | 23 | Same 22 Dexerto rows plus Divano |
| Official release FAQ character shorthand | 20+ | Developer-social shorthand, not a row-level roster |
| Official-wiki rows outside Dexerto 22 | 1 | Divano |
| Dexerto rows outside the public 20 unlock table | 2 | Imelda and MissingN0 |
| Official-wiki rows outside the public 20 unlock table | 3 | Imelda, MissingN0, and Divano |
| Official-wiki starter-deck rows | 22 | Divano has no starter-deck row |
| Official-wiki lead-crawler base-stat rows | 22 | Divano has no base-stat row |
| Official-wiki numeric `unlockcost` rows | 10 | Source-level Inn purchase candidates only |
| Official-wiki blank `unlockcost` rows | 11 | Requires Inn UI or game-file proof |
| Official-wiki non-numeric `unlockcost` rows | 2 | Christine = `N/A`; Clerici = `No` |
| Dexerto missing duration rows | 2 | Porta and Ramba omit parsed duration despite duration wording |
| Official-wiki missing duration rows | 3 | Divano, Porta, and Ramba |
| Implementation parity closed by this file | 0 | Direct UI, game files, or runtime proof still required |

## Working Interpretation

The current source-level split is:

- The 20 public unlock-style rows are not the full roster. They are achievement/checklist-facing rows.
- The 21 secondary playable-roster layer is best read as the public 20 plus Imelda. It does not settle whether Imelda is default, first-run, tutorial-linked, or paid.
- The 22 Dexerto individual character pages add Imelda and MissingN0 to the public 20 layer. Those pages provide Crawler-card costs, duration/text candidates, trigger text, and starter-deck links, but do not prove availability.
- The 23 official-wiki rows add Divano outside the Dexerto 22-page boundary. Divano should remain an unavailable/wiki-only capture target until shipped UI or game files prove otherwise.
- The official FAQ's `20+ characters` shorthand is compatible with several row layers, but it is not precise enough to choose 20, 21, 22, or 23 as the final player-facing roster.
- Character-page `Mana Cost` / card `cost` is a Crawler-card play cost, not an Inn purchase price. Official-wiki `unlockcost` is only a source-level purchase candidate until Inn UI or game files confirm it.
- Official-wiki lead/follower deck rules are source-level system rules. They should drive deck-before/deck-after capture, not immediate implementation.

Do not implement all 23 official-wiki rows as a final playable roster yet. The official wiki can include hidden, unavailable, wiki-only, or taxonomy rows whose shipped UI status still needs proof.

## Source-Layer Reconciliation

| Source Layer | Rows | Added / Missing Rows | Current Treatment |
| --- | ---: | --- | --- |
| Steam / Dexerto public unlock layer | 20 | Excludes Imelda, MissingN0, and Divano as public unlock rows | Use for public achievement/Town Hall-style unlock metadata only |
| Secondary playable-roster layer | 21 | Adds Imelda to the public 20; leaves MissingN0/Divano unresolved | Treat as playable-roster hint, not final UI proof |
| Dexerto individual page layer | 22 | Adds Imelda and MissingN0; no Divano page row | Use for Crawler-card/deck field candidates only |
| Official-wiki character row layer | 23 | Adds Divano to the Dexerto 22; preserves MissingN0 and Imelda fields | Use as source-level capture queue, not final playable membership |
| Official FAQ shorthand | 20+ | No row table | Preserve as public shorthand/minimum-category context |

## Rows Outside The Public 20 Unlock Table

| Row | Present In | Current Source-Level Status | Direct-Proof Need |
| --- | --- | --- | --- |
| Imelda | Secondary roster, Dexerto page, official wiki | Strong default/early roster candidate; official wiki has `unlockcost = 10`, blank `unlocked by`, Magic Wand starter row, and yellow/XP/Growth buckets | Fresh-save character-select/Inn UI must choose default, tutorial, first-run, paid, or other state |
| MissingN0 | Dexerto page, VGC, official wiki, Reddit hidden claims | Hidden/postgame candidate with RedDeath unlock, `unlockcost = 6666`, Death Spiral starter row, and unusual stat/duration fields | Character-select hidden slot, direct unlock, or game-file proof must confirm availability and spelling/status |
| Divano | Official wiki only | Official-wiki row with blank card cost, unlockcost, unlocked-by, duration, starter deck, and base stats; current-game unavailable note in source layer | Shipped UI or game files must prove whether it is unavailable, wiki-only, placeholder, or future/post-launch content |

## Field Conflict Queue

| Conflict | Rows | Current Treatment |
| --- | --- | --- |
| `20+` shorthand vs 20/21/22/23 row layers | Full character roster | Keep official shorthand, public unlock rows, secondary roster rows, Dexerto pages, and official-wiki rows separate |
| Imelda starting state | Imelda | Treat as source-level default/early/purchase candidate; do not finalize without fresh-save/Inn UI proof |
| MissingN0 hidden status | MissingN0 | Keep separate from normal public roster until hidden slot, RedDeath unlock, or game-file proof confirms it |
| Divano membership | Divano | Keep as official-wiki-only/unavailable candidate outside playable-roster parity |
| Crawler-card cost vs Inn purchase price | All character rows | Treat page/card `cost` as play cost; use `unlockcost` only as source-level purchase candidate |
| Blank and non-numeric official-wiki `unlockcost` fields | Divano, Dommario, Giovanna, Krochi, Lama, Mortaccio, O'Sole, Poppea, Porta, Pugnala, Ramba, Christine, Clerici | Use Inn UI or game files before implementing purchase costs or unavailable states |
| O'Sole Dragon Shrimp count | O'Sole | Preserve 50 secondary/achievement-facing count vs 15 official-wiki count until Town Hall/UI/game-file proof |
| Boss vs stage-clear unlock wording | Gennaro, Ramba, Gallo, and related boss/stage rows | Prefer official achievement wording as metadata, but require unlock popup/Town Hall/Inn proof for final UI wording |
| Missing duration fields | Porta, Ramba, Divano | Use UI/game files before implementing duration values or exceptions |
| Lead vs follower deck behavior | All recruited Crawler rows | Official-wiki rule flags need deck-before/deck-after proof before party implementation |

## Direct Proof Queue

- Capture fresh-save character-select and Gorton Bell Inn UI to record the exact visible roster, locked slots, prices, default rows, and unavailable rows.
- Confirm whether the shipped player-facing roster count is 20+, 20, 21, 22, 23, or another number.
- Resolve Imelda's state: default starter, tutorial reward, first-Mad-Forest unlock, paid 10-gold recruit, or another route.
- Resolve MissingN0's state: hidden slot, RedDeath unlock, postgame row, joke/placeholder row, unavailable row, or absent from the current build.
- Resolve Divano's state: unavailable current-game row, wiki-only row, placeholder, future/post-launch row, or hidden row.
- Reconcile every official-wiki `unlockcost` candidate, blank value, and non-numeric value against Inn UI or game files.
- Capture starter deck and lead-vs-follower deck deltas for at least one fresh lead Crawler and one recruited follower, then repeat for exceptions.
- Capture trigger color, Crawler-card text, duration, and at least one runtime passive example for every confirmed playable Crawler.
- Resolve O'Sole's Dragon Shrimp count and boss/stage-clear wording from Town Hall, unlock popup, Inn UI, or game files.
- Keep current implementation parity at `0` until every confirmed row has an exact local file/function target and a testable acceptance condition.
