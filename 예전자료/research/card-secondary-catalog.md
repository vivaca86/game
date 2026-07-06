# Secondary Card Catalog Map

Status: `secondary full-card catalog mapping / source conflict / implementation gap not closed`
Last updated: 2026-05-22

This file records public card-catalog hints that go beyond the existing 35 unlock-style card rows plus 17 evolution rows in `research/data-cards.md` and `research/card-gap-map.md`. `research/card-taxonomy-reconciliation.md` now reconciles these rows against the 87 Dexerto non-character pages, 90 official-wiki non-character rows, 113 official-wiki total rows, and official `65+ cards` shorthand. It is not direct UI proof. Costs, categories, and effect text here remain E1 until confirmed from individual card pages, high-resolution game UI, direct play, or game files.

## Source Basis

| Source ID | Source | Use | Grade |
| --- | --- | --- | --- |
| SRC-102 | Dexerto card index | Page-link boundary for 87 non-character card candidates and character-card links | E1 |
| SRC-127 | FRVR all cards list | Secondary card names, cost hints, and short effect hints across Crawler, attack, defense, boost, mana, wild, and temporary categories | E1 |
| SRC-128 | Dexerto Song of Mana individual card page | One-card schema sample for category, text, cost, gem slots, and evolution group fields | E1 |
| SRC-129 | Dexerto non-character card page crawl | 87-page non-character card crawl stored in `research/card-dexerto-page-crawl.md` | E1 |

## Coverage Counter

| Segment | Secondary count | Current row mapping | Notes |
| --- | ---: | ---: | --- |
| Dexerto non-character card-page links | 87 | 52 already mapped, 35 catalog-only rows below | 40 attack, 8 defense, 18 stat boost, 6 mana, 9 wild, 6 temporary |
| Dexerto individual pages crawled | 87 | 87 page rows in `research/card-dexerto-page-crawl.md` | 0 crawl errors; `Mana Bomb` still lacks a mana-cost value and 48 rows lack gem-slot fields |
| Official-wiki non-character card rows | 90 | 87 Dexerto name matches plus 3 official-wiki-only rows | `Angelo Spietato`, `Crystal Crown`, and `Rich Coin Bag` remain UI/game-file proof targets |
| Official-wiki total card rows | 113 | separate from this non-character map | Includes 23 character/Crawler rows; collection-count membership unresolved |
| Dexerto character links | 22 | tracked mainly in character research | Includes MissingN0 as a character link; direct character-select proof still required |
| FRVR card table rows | 109 table rows / 105 distinct names | source-level only | 21 Crawler rows, 37 attack, 8 defense, 18 boost, 6 mana, 13 wild, 6 temporary; duplicate W-cost cards appear in Wild |
| Existing `data-cards.md` rows | 52 | 52 row-level gaps mapped | 35 unlock-style rows plus 17 evolution result rows |
| Newly exposed non-character catalog-only rows | 35 | 0 exact parity | These rows reconcile the existing 52 rows with the 87 Dexerto non-character page-link boundary |

## Secondary Catalog Boundary Notes

- Dexerto's card index is the wider page-link boundary for non-character cards: 87 candidate pages before direct/UI validation.
- `research/card-taxonomy-reconciliation.md` preserves the current count split: Dexerto 87 non-character page rows, official-wiki 90 non-character rows, official-wiki 113 total rows, 23 character/Crawler rows, and official `65+ cards` shorthand.
- FRVR provides a useful effect/cost table, but it omits visible rows for `Mannajja`, `Valkyrie Turner`, and `Vicious Hunger` while duplicating `Bracelet`, `Friendship Amulet`, `Parm Aegis`, and `Wings` in the Wild section.
- The generated Dexerto page crawl now confirms the individual-page schema across all 87 non-character page links, but it remains E1 source-level data and still needs UI/game-file proof.
- Character/Crawler cards are not merged into the non-character card implementation gap map yet because their costs, passives, trigger colors, deck slots, and party persistence overlap with `research/data-characters.md` and `research/character-gap-map.md`.

## Newly Exposed Non-Character Rows

| ID | Original candidate | Category | Cost hint | Secondary behavior hint | Source | Current status |
| --- | --- | --- | --- | --- | --- | --- |
| CSEC-001 | Whip | Attack | 0 | low multi-enemy damage | SRC-102, SRC-127 | Catalog-only / direct UI required |
| CSEC-002 | Axe | Attack | 2 | multi-enemy damage with knockback chance | SRC-102, SRC-127 | Catalog-only / direct UI required |
| CSEC-003 | King Bible | Attack | 1 | damage with knockback chance | SRC-102, SRC-127 | Catalog-only / direct UI required |
| CSEC-004 | Knife | Attack | 0 | damage with crit behavior | SRC-102, SRC-127 | Catalog-only / direct UI required |
| CSEC-005 | Magic Wand | Attack | 0 | damage that prioritizes attackers | SRC-102, SRC-127 | Catalog-only / direct UI required |
| CSEC-006 | Santa Water | Attack | 3 | damage plus after-turn burn | SRC-102, SRC-127 | Catalog-only / direct UI required |
| CSEC-007 | Armor | Defense | 0 | armor gain | SRC-102, SRC-127 | Catalog-only / direct UI required |
| CSEC-008 | Golden Armor | Defense | 1 | larger armor gain | SRC-102, SRC-127 | Catalog-only / direct UI required |
| CSEC-009 | Hero's Armor | Defense | 3 | high armor gain | SRC-102, SRC-127 | Catalog-only / direct UI required |
| CSEC-010 | Pummadora | Defense | 2 | post-encounter recovery | SRC-102, SRC-127 | Catalog-only / direct UI required |
| CSEC-011 | Rainbow Armor | Defense | 2 | mid-tier armor gain | SRC-102, SRC-127 | Catalog-only / direct UI required |
| CSEC-012 | Candella | Stat Boost | 1 | area/splash damage increase | SRC-102, SRC-127 | Catalog-only / direct UI required |
| CSEC-013 | Candle | Stat Boost | 0 | smaller area/splash damage increase | SRC-102, SRC-127 | Catalog-only / direct UI required |
| CSEC-014 | Du-Duplicator | Stat Boost | 2 | larger projectile/amount increase | SRC-102, SRC-127 | Catalog-only / direct UI required |
| CSEC-015 | Forever Heart | Stat Boost | 2 | max-health increase | SRC-102, SRC-127 | Catalog-only / direct UI required |
| CSEC-016 | Spinach | Stat Boost | 1 | might/damage increase | SRC-102, SRC-127 | Catalog-only / direct UI required |
| CSEC-017 | Sprig o' Spinach | Stat Boost | 2 | larger might/damage increase | SRC-102, SRC-127 | Catalog-only / direct UI required |
| CSEC-018 | Ancient Tome | Mana | 3 | mana gain | SRC-102, SRC-127 | Catalog-only / direct UI required |
| CSEC-019 | Light Tome | Mana | 1 | mana gain | SRC-102, SRC-127 | Catalog-only / direct UI required |
| CSEC-020 | Weighty Tome | Mana | 2 | mana gain | SRC-102, SRC-127 | Catalog-only / direct UI required |
| CSEC-021 | Big Coin Bag | Wild | W | coin gain and destroy | SRC-102, SRC-127 | Catalog-only / direct UI required |
| CSEC-022 | Clover Petal | Wild | W | luck gain, draw, and destroy | SRC-102, SRC-127 | Catalog-only / direct UI required |
| CSEC-023 | Coin Purse | Wild | W | smaller coin gain, draw, and destroy | SRC-102, SRC-127 | Catalog-only / direct UI required |
| CSEC-024 | Little Clover | Wild | W | luck gain and destroy | SRC-102, SRC-127 | Catalog-only / direct UI required |
| CSEC-025 | Little Heart | Wild | W | heal and destroy | SRC-102, SRC-127 | Catalog-only / direct UI required |
| CSEC-026 | Orologion | Wild | W | front-row freeze and destroy | SRC-102, SRC-127 | Catalog-only / direct UI required |
| CSEC-027 | Raw Mana | Wild | W | temporary mana gain and destroy | SRC-102, SRC-127 | Catalog-only / direct UI required |
| CSEC-028 | Rosary | Wild | W | row kill and destroy | SRC-102, SRC-127 | Catalog-only / direct UI required |
| CSEC-029 | Vacuum | Wild | W | card draw and destroy | SRC-102, SRC-127 | Catalog-only / direct UI required |
| CSEC-030 | Confuse | Temporary | 0 | randomizes mana costs | SRC-102, SRC-127 | Catalog-only / direct UI required |
| CSEC-031 | Junk | Temporary | 1 | destroy-on-use plus draw | SRC-102, SRC-127 | Catalog-only / direct UI required |
| CSEC-032 | Muddle | Temporary | 0 | randomizes Crawler trigger types | SRC-102, SRC-127 | Catalog-only / direct UI required |
| CSEC-033 | Shatter | Temporary | 0 | effect unresolved in secondary table | SRC-102, SRC-127 | Catalog-only / direct UI required |
| CSEC-034 | Mana Bomb | Temporary | unknown | effect unresolved in secondary table | SRC-102, SRC-127 | Catalog-only / direct UI required |
| CSEC-035 | Cursed Lancet | Temporary | 0 | freezes next drawn card and raises its mana cost | SRC-102, SRC-127 | Catalog-only / direct UI required |

## Required Completion

- Use `research/card-dexerto-page-crawl.md` as the current individual-page crawl baseline for all 87 non-character card candidates.
- Use `research/card-taxonomy-reconciliation.md` before changing final catalog membership: it separates the 3 official-wiki-only non-character rows and the 23 character/Crawler rows from the Dexerto 87-page boundary.
- Resolve the remaining page-field holes: `Mana Bomb` cost and the 48 rows that do not expose a gem-slot field in the crawled page data.
- Cross-check the 35 catalog-only rows against game UI, game files, or high-resolution video before merging them into final implementation parity rows.
- Resolve `CON-031` and `CON-032` before claiming a complete card catalog.
- Keep exact implementation parity at `0` until original card names, text, costs, sockets, targeting, and runtime behavior are mapped to current files and acceptance tests.
