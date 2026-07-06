# PGG Beginner Systems Page Crawl

Status: `generated 2026-05-22 / source-level beginner-systems crawl`

Source URL: https://progameguides.com/vampire-crawlers/vampire-crawlers-beginners-guide/

This file stores selected system, evolution, relic, village, and demo-carryover claims from the Pro Game Guides beginner article. It does not prove exact in-game UI labels, deck mutation, support-card consumption, gem-slot rules, save transfer behavior, floor count, boss count, or runtime formulas.

## Crawl Notes

| Check | Result |
| --- | --- |
| Page fetched | 2026-05-22 |
| Page title | `Vampire Crawlers Beginner's Guide (May 2026)` |
| Author shown | `Nebojša Prijić` |
| Update shown | `Updated: May 4, 2026` |
| System rows extracted | 5 |
| Evolution / deck mutation rows extracted | 8 |
| Relic / route rows extracted | 4 |
| Village / demo rows extracted | 4 |
| Exact in-game UI proof present | No |
| Game-file proof present | No |
| Runtime verification present | No |

## Boundary Notes

- PGG beginner is a secondary guide. Use it for direct-capture planning only.
- The page includes both broad process wording and FAQ wording for evolutions. Keep source-level conflicts open until direct deck-before/deck-after proof resolves them.
- The page says demo progress transfers automatically to the full version, but this is not a platform-holder, save-file, or local install audit.
- The page says Guiding Light drops in Mad Forest after reaching Level 10; this conflicts with GameSpot's Inlaid Library location and needs direct relic-panel proof.

## Extracted System / Flow Rows

| Crawl ID | Topic | Source-Level Claim | Missing Before Implementation |
| --- | --- | --- | --- |
| PGG-SYS001 | Dungeon loop | Runs start at the Inn, move through first-person grid dungeons, and end with a boss fight before returning rewards to the Village | Exact first-run UI, floor count, boss roster, clear UI, reward order, and persistence |
| PGG-SYS002 | Level-up reward loop | Killing enemies grants XP and level-up drafts add cards to the deck | Exact reward UI, choice count, reroll/skip/remove timing, reward pools, and card-state mutation |
| PGG-SYS003 | Combo loop | The page describes ascending mana-cost play as the core combo rule and treats Wild cards as gap-bridges | Exact multiplier formula, reset timing, Wild consumption, exceptions, and max-stack cases |
| PGG-SYS004 | Gem / evolution warning | The page warns not to fill a gem socket on a card intended for evolution because the filled socket can block the evolution trigger | Exact socket UI, gem loss/refund behavior, valid socket targets, and whether all evolved cards inherit sockets |
| PGG-SYS005 | Destroyed-after-use cards | Some Item Cards marked `Destroyed after use` are described as permanently leaving the deck when played in combat, with Hollow Heart given as an example | Exact card UI text, destruction timing, exception cases, attached-gem behavior, and save/run boundary |

## Extracted Evolution / Deck Mutation Rows

| Crawl ID | Topic | Source-Level Claim | Missing Before Implementation |
| --- | --- | --- | --- |
| PGG-SYS006 | Standard evolution requirements | Standard evolution is framed as requiring the base weapon card, matching item card, and an empty gem socket on the base card | Exact recipe UI, socket requirement display, failed-case UI, and per-recipe exceptions |
| PGG-SYS007 | Evolution trigger surfaces | Evolution Statues, chests, and boss rewards are described as Evolution Gem sources that can trigger an evolution | Exact trigger UI, chest-vs-statue-vs-boss conditions, probabilities, and no-valid-recipe outcome |
| PGG-SYS008 | Internal consumption conflict | The main evolution section says both Base Card and Item Card are consumed, while the FAQ says the Base Card is consumed and the Item Card stays in the deck | Direct deck-before/deck-after capture, support-card state, duplicate support behavior, and version/language baseline |
| PGG-SYS009 | Holy Wand example | The quick-reference table maps Magic Wand plus Empty Tome variants to Holy Wand | Exact in-game names, accepted alternates, card cost/color/socket fields, and Grim Grimoire UI |
| PGG-SYS010 | Union recipe model | Phieraggi is described as a union of Phiera Der Tuphello, Eight the Sparrow, and Tirajisú, with all listed cards consumed | Exact union UI, spelling, full consumed-card list, duplicate handling, and resulting card fields |
| PGG-SYS011 | Vandalier union model | Peachone plus Ebony Wings are listed as a weapon-card union into Vandalier | Exact union UI, whether any item/card slot is required, and deck mutation |
| PGG-SYS012 | Grim Grimoire tracker | Grim Grimoire is described as an Inlaid Library relic that adds evolution and Union recipe tracking to the pause menu | Exact relic panel, pause-menu UI, hidden/discovered recipe states, and persistence |
| PGG-SYS013 | Evolution planning scope | The guide recommends focusing on one or two evolution pairs per run rather than spreading across many lines | Build-planning hint only; not a mechanical rule until reward pools and runtime pacing are measured |

## Extracted Relic / Route Rows

| Crawl ID | Topic | Source-Level Claim | Missing Before Implementation |
| --- | --- | --- | --- |
| PGG-SYS014 | Guiding Light route | Guiding Light is claimed to drop in Mad Forest after reaching Level 10 and to make breakable light sources visible on the minimap | Resolve location conflict against GameSpot/Inlaid Library, exact relic panel, minimap icon UI, and runtime use |
| PGG-SYS015 | Grim Grimoire route | Grim Grimoire is placed in Inlaid Library as the recipe-tracker relic | Direct relic-panel proof, pause-menu proof, and exact discovered-recipe behavior |
| PGG-SYS016 | Inlaid Library unlock route | Inlaid Library is listed as unlocked by reaching Level 10 in Mad Forest | Stage-select UI, unlock popup, and whether this shares conditions with Guiding Light |
| PGG-SYS017 | Dairy Plant / Milk Factory route | Dairy Plant is listed after Teeny Bridge and as the route into Milk Factory, with Milk Elemental as a boss context | Exact stage-select chain, boss panel/nameplate, and unlock popup |

## Extracted Village / Demo Rows

| Crawl ID | Topic | Source-Level Claim | Missing Before Implementation |
| --- | --- | --- | --- |
| PGG-SYS018 | Power Ups Shop priority | Greed, Might, Max Health/Recovery, and Blacksmith are presented as early village upgrade priorities | Exact shop rows, rank caps, full cost curve, unlock order, and refund/respec behavior |
| PGG-SYS019 | Greed rank value | Greed is described as increasing coin acquisition by 25% per rank | Direct shop UI text, rank scaling, formula, and runtime coin comparison |
| PGG-SYS020 | Blacksmith priority | Blacksmith is described as upgrading cards to add more gem slots for customization and evolution preparation | Exact Blacksmith UI, card slot costs, slot caps, valid targets, and persistence |
| PGG-SYS021 | Demo save carryover | PGG says demo progress automatically carries over into the full version, including achievements and transferred crawlers, maps, and relics | Direct local install/save-file audit, platform behavior, version baseline, and failure cases |

## Required Follow-Up

- Capture one standard evolution flow with deck before/after, support item state, and base-card socket state.
- Capture one union evolution with every consumed card visible.
- Capture a card marked `Destroyed after use` being played and verify deck mutation timing.
- Verify Guiding Light location and minimap light-source effect from relic panel/UI.
- Audit demo-to-full save carryover from a real install or official platform documentation.
