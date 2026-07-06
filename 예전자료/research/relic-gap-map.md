# Relic / Power-Up Implementation Gap Map

Status: `official metadata collected / official wiki value extract / relic taxonomy reconciliation / cross-source secondary effect mapping / row-level current implementation gap-mapped`
Last updated: 2026-05-22

This file maps each collected Vampire Crawlers relic or power-up row against the current prototype implementation. Secondary guides provide effect/location hints for the 15-row guide boundary, the generated GameSpot page crawl preserves that 15-row page boundary including the blank `Ultimate Ultra Overkill` unlock-stage value, the official wiki value extract adds `Deck Box` as a 16th candidate row, `relic-taxonomy-reconciliation.md` maps the 15 guide rows against the 16 official-wiki rows, and the PGG beginner systems crawl adds a conflicting Guiding Light route claim. A similar local relic, map flag, gem socket flow, or combo helper is not counted as original-accurate until the original relic name, effect text, unlock location, Museum toggle behavior, persistence, and runtime consequence are verified.

## Source Basis

| Source ID | Source | Use | Grade |
| --- | --- | --- | --- |
| SRC-006 | Steam Community achievements page | 13 official achievement-backed relic names/descriptions | E5 metadata |
| SRC-112 | GameSpot relic list | 15 relic names, secondary location/effect table, toggle context | E1 |
| SRC-134 | GameSpot relic page crawl | Generated 15-row page crawl, row order, toggle context, Rilevatore/Ultimate Ultra Overkill boundaries | E1 |
| SRC-136 | PC Gamer upgrade priority crawl | Generated selected route hints for Combo Stack, Gem Hammer, Polentir, Grim Grimoire, and Stardust Anvil | E1 |
| SRC-140 | PGG beginner systems crawl | Generated Guiding Light route/effect claim, Grim Grimoire tracker context, and Blacksmith route hint | E1 |
| SRC-108-R | GAMES.GG relic guide | 15-relic total claim, starting relic claims, location/effect hints, Museum behavior | E1 |
| SRC-142 | Official wiki API crawl | 16 official-wiki relic infobox rows, adding `Deck Box` to the previous 15-row guide boundary | E5 official wiki / not direct play |
| SRC-147 | Official wiki arcana/relic/dungeon value extract | 16 official-wiki relic rows with id/found-in/presence/keyword fields and blank-field queues | E5 official wiki structured values / not direct play |
| derived | Relic taxonomy reconciliation | 15 guide rows vs 16 official-wiki rows, `Deck Box` boundary, `Randomazzo` / `Arcana Finder` alias mapping, blank-field queues, and location conflict queue | Source-level reconciliation |
| VID-001 | Early run storyboard | Combo relic panel / combo tutorial context | E3 partial |
| VID-005 | Library Sanctum storyboard | Arcana Finder and Bomba-like relic panel candidates | E3 partial |
| VID-010 | Cappella/Ultima storyboard | Ovenkilt relic panel candidate | E3 partial |
| local implementation audit | `src/content/crawler-clone.js`, `src/content/balance.js`, `src/content/expansion.js`, `src/rules/crawler-dungeon.js`, `src/rules/progression.js`, `src/rules/turboturn.js` | Current prototype relic data and runtime behavior | Local implementation evidence |

## Coverage Counter

| Segment | Rows | Current exact 1:1 implemented | Placeholder-adjacent rows | Current status |
| --- | ---: | ---: | ---: | --- |
| Collected relic / power-up rows | 16 | 0 | 6 | 13 official metadata rows plus 2 non-achievement guide rows and `Deck Box` as an official-wiki row now have source-level hints; GameSpot page crawl preserves 15 visible guide rows; `relic-taxonomy-reconciliation.md` maps 15 guide rows to 16 wiki rows with one wiki-only row; PGG beginner systems crawl adds the open Guiding Light location conflict |
| Steam achievement-backed relic rows | 13 | 0 | 4 | Official names exist, but exact original UI panels, persistence, and toggle behavior are not implemented |
| Non-achievement / wiki-only candidate relic rows | 3 | 0 | 2 | Milky Way Map and Rilevatore need direct baseline proof; Deck Box needs proof whether it is player-facing; Rilevatore location conflicts across secondary sources |
| Current prototype relic pool | 20 | 0 | 0 | Local relic ids are prototype content and are not original Vampire Crawlers rows |
| Relic Museum / toggles / persistence | 16 candidate rows if wiki roster is final | 0 | 0 | Current prototype has no Museum, toggle state, disabled-relic behavior, or save persistence parity |

## Current Prototype Surface

| Surface | Current behavior | Why it is not final parity |
| --- | --- | --- |
| `balance.relicPool` in `crawler-clone.js` | Replaces the generic relic pool with eight prototype-local relic ids | Names, locations, effects, toggles, and unlock persistence do not match the collected original rows |
| `content/expansion.js` relic additions | Adds twelve more prototype relic ids to the generic pool | These expand the local prototype but still do not prove original relic parity |
| `grantRelic()` / `grantRandomRelic()` | Grants local relic ids to `state.ownedRelics` | No original unlock order, Museum state, disabled state, or save-persistence mapping |
| `applyStartOfRoomRelics()` | Applies local room-start effects for prototype relic ids | Original room-start, map, Fortune Teller, Blacksmith, Hurry, and overkill behaviors are unresolved |
| `state.crawl.mapRelic` / minimap reveal | A boolean flag can reveal map-like information in the crawler prototype | This is not Milky Way Map parity because enemy-position behavior, starting state, and Museum toggle proof are missing |
| `state.crawl.arcana` / `portraitGallery` | A local event can push a relic id into an `arcana` array | This is not Arcana Finder, Randomazzo, Polentir, or Fortune Teller parity |
| `src/rules/turboturn.js` | Implements a local ascending mana chain and multiplier report | Combo Stack/Stash exact name, effect text, formula, cap, and relic ownership boundaries remain unresolved |

## Per-Relic Gap Rows

| ID | Original relic / power-up | Collected proof | Current implementation surface | Parity | Current gap | Required proof |
| --- | --- | --- | --- | --- | --- | --- |
| REL-001 | Milky Way Map | Secondary sources say starting/tutorial or N/A; effect shows enemy positions/map info | `state.crawl.mapRelic` and minimap reveal are placeholder-adjacent | Placeholder only | Starting baseline, exact map info, enemy-position display, Museum toggle, and persistence are missing | Fresh-save/direct UI proof showing starting relic, minimap behavior, toggle state, and save carryover |
| REL-002 | Rilevatore | Secondary sources conflict: starting vs Curd Refinery; effect shows weapon effectiveness | No direct equivalent | No | Location conflict, combat-info / weapon-effectiveness display, and Museum toggle missing | Direct UI panel and combat example showing effectiveness information plus unlock source |
| REL-003 | Combo Stack / Combo Stash | Steam achievement `Combo Stack`; VID-001 reads `Combo Stash`; secondary effect is ascending-cost combo multiplier; PC Gamer crawl says Combo Stack / Gem Hammer are tutorial-context rewards | `src/rules/turboturn.js` is placeholder-adjacent | Placeholder only | Name conflict, full panel text, multiplier formula, cap, reset behavior, and relic ownership boundaries are unresolved | High-resolution panel/direct play plus normal, failed, Wild, and long-chain examples |
| REL-004 | Gem Hammer | Steam achievement name; secondary effect allows gems to be added to cards; PC Gamer crawl says tutorial-context reward | Prototype gem socket flow exists | Placeholder only | Unlock source, persistence, socket authorization, exact card target rules, and Museum toggle are missing | Relic panel, post-unlock gem station access, socket UI, and save-state proof |
| REL-005 | Polentir | Steam achievement name; secondary effect unlocks Fortune Teller / Arcana Tent; GameSpot places it in Furious Forest, official-wiki value extract says `Fortune Forest`, and PC Gamer gives an after-Mad-Forest route hint | No mature Arcana/Fortune Teller system | Placeholder only | Fortune Teller unlock, route/location text, arcana list, start-selection behavior, and persistence are missing; `CON-043` tracks Furious Forest vs Fortune Forest | Polentir panel plus Fortune Teller UI and start-of-run arcana selection proof |
| REL-006 | Grim Grimoire | Steam achievement name; secondary effect adds discovered evolution/union reference; PC Gamer crawl places it in Library West Wing after clearing Inlaid Library, while PGG beginner systems crawl places the tracker in Inlaid Library | No direct equivalent | No | Pause-menu evolution reference, discovered recipe state, and recipe highlight behavior are missing | Relic panel plus pause/menu reference before and after discovering an evolution |
| REL-007 | Arcana Finder / Randomazzo | Steam achievement `Randomazzo`; VID-005 panel reads `Arcana Finder`; secondary effect adds Arcana events/chests | `state.crawl.arcana` / `portraitGallery` is placeholder-adjacent only | Placeholder only | Achievement name vs panel name relation, Arcana chest spawn rules, persistence, and toggle behavior are unresolved | High-resolution panel, chest spawn example, arcana reward flow, and Museum proof |
| REL-008 | Stardust Anvil | Steam achievement name; secondary effect unlocks Blacksmith card-slot purchases; PC Gamer crawl places it as a Teeny Bridge reward | Prototype gem/socket economy only | Placeholder only | Blacksmith building, card-slot purchase UI, costs, and persistence are missing | Relic panel plus Blacksmith UI, purchase, resulting card-slot state, and save proof |
| REL-009 | Overkill | Steam achievement name; secondary effect allows attacking defeated bosses for gold | No exact equivalent | No | Post-boss overkill trigger, coin conversion, cap, and persistence are missing | Boss kill / overkill sequence with coin reward math and toggle proof |
| REL-010 | Lapidary Loupe | Steam achievement name; secondary effect changes gem spawn rates or seals gems | No direct equivalent | No | Exact Jeweller/rate UI, costs, rarity behavior, and run impact unknown | Relic panel with effect text and one runtime example |
| REL-011 | Sorceress' Tears | Steam achievement name; secondary effect adds Hurry/game-speed control | No direct equivalent | No | Hurry control, speed setting, animation/timing effect, and toggle state are missing | Relic panel plus before/after speed UI and gameplay timing proof |
| REL-012 | Ultimate Ultra Overkill | Steam achievement name; secondary effect extends Overkill cap, with GameSpot giving 5,000 but no visible GameSpot unlock-stage value | No direct equivalent | No | Exact overkill cap, source location, dependency on REL-009, and formula missing; GameSpot blank unlock-stage value conflicts with GAMES.GG Curd Refinery placement | Relic panel plus overkill cap comparison before and after unlock, and Museum/UI proof of source location |
| REL-013 | Ovenkilt | Steam achievement name; VID-010 shows `Ovenkilt`; secondary effect triggers Overkill on final encounter enemy but removes chest gold | No direct equivalent | No | Exact effect text, final-enemy trigger, chest-gold tradeoff, and persistence are unresolved | High-resolution panel, final enemy overkill trigger, reward math, and save proof |
| REL-014 | Bomba Infernale | Steam achievement confirms official relic name; secondary effect vaporizes first floor of cleared dungeons; VID-005 has Bomba-like panel candidate | No direct equivalent | No | Exact panel mapping, cleared-dungeon rule, source stage, toggle, and run consequence are unresolved | Full-resolution/direct panel text plus runtime effect example |
| REL-015 | Guiding Light | Steam achievement confirms official relic name; secondary effect shows breakable light sources on the map; GameSpot places it in Inlaid Library while PGG beginner systems crawl says Mad Forest Level 10 (`CON-036`) | No direct equivalent | No | Exact map icon behavior, light-source category, location proof, and run impact are unresolved; location/unlock route conflicts across secondary sources | Relic panel, location/unlock route, minimap light-source proof, and at least one runtime consequence |
| REL-016 | Deck Box | Official wiki value extract exposes `Deck Box` as a 16th relic row with a blank `foundin` field and blank effects field; absent from the 15-row GameSpot guide boundary; `relic-taxonomy-reconciliation.md` keeps it as the one wiki-only row | No direct equivalent | No | Whether this is a player-facing Museum relic, starting/system item, wiki-only taxonomy row, or non-toggleable baseline is unresolved | Museum roster, fresh-save baseline, relic panel, and game-file proof showing whether Deck Box is collectible/toggleable |

## Required Completion

- Capture all 16 candidate relic rows from Museum/UI, direct play, high-resolution video, or game files, or prove which official-wiki row is outside the player-facing Museum roster.
- Record exact relic panel text, location/unlock route, toggle state, disabled behavior, persistence, and at least one runtime consequence.
- Resolve the 15 guide rows vs 16 official-wiki rows boundary, Rilevatore's location conflict, `Ultimate Ultra Overkill` location, Guiding Light's Inlaid-Library-vs-Mad-Forest route conflict, Polentir's Furious-Forest-vs-Fortune-Forest route-text conflict, `Combo Stack` vs `Combo Stash`, `Arcana Finder` vs `Randomazzo`, and the VID-005 Bomba-like panel mapping with direct or high-resolution evidence.
- Keep implementation approval closed until each relic row has a testable acceptance condition and the user approves the remaining proof gaps.
