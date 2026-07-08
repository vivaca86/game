# Arcana Implementation Gap Map

Status: `official metadata collected / Dexerto unlock-table crawl / official wiki value extract / arcana taxonomy reconciliation / source-level 12-row mapping / row-level current implementation gap-mapped`
Last updated: 2026-05-22

This file maps each collected Vampire Crawlers arcana row against the current prototype implementation. The 10 public unlock rows vs 12 total claim now has a working source-level resolution: the generated Dexerto crawl confirms a 10-row unlock table, while secondary guides identify two automatic/default arcanas, `Experimental Medicine` and `Shield Bash`, and `arcana-taxonomy-reconciliation.md` maps all 10 public rows to official-wiki rows while preserving the two official-wiki-only Polentir rows. This is not final game proof. A row is not counted as implemented until the exact original name, effect text, unlock condition, Fortune Teller/start-of-run selection behavior, Arcana Finder chest behavior where relevant, and runtime build impact are verified.

## Source Basis

| Source ID | Source | Use | Grade |
| --- | --- | --- | --- |
| SRC-006 | Steam Community achievements page | 10 official public arcana achievement names/descriptions | E5 metadata |
| SRC-106 | Dexerto arcana unlock list | 10 unlock-task rows | E1 |
| SRC-132 | Dexerto arcana unlock table crawl | Generated 10-row table extraction and no-individual-arcana-page boundary note | E1 |
| SRC-111 | GAMES.GG arcana guide | 12-total claim, Fortune Teller flow, two automatic arcana claim, selected effect hints | E1 |
| SRC-206 | NeonLightsMedia arcana guide | 12 arcana names, unlock requirements, and effect summaries | E1 |
| SRC-202 | PC Gamer upgrade guide | Polentir/Fortune Teller flow, Over The Top and Your Shield My Liege effect anecdotes | E1 |
| SRC-136 | PC Gamer upgrade priority crawl | Generated Polentir/Fortune Teller, Over The Top top-of-deck, and Your Shield My Liege hints | E1 |
| SRC-141 | Poncle official release FAQ crawl | Official-account broad `12 arcana` shorthand supporting the total-set boundary only | E5 developer statement via social FAQ |
| SRC-142 | Official wiki API crawl | 12 official-wiki arcana infobox rows, including `Experimental Medicine` and `Shield Bash` as Polentir-unlocked rows | E5 official wiki / not direct play |
| SRC-147 | Official wiki arcana/relic/dungeon value extract | 12 official-wiki arcana unlock fields and keyword buckets without full effect prose | E5 official wiki structured values / not direct play |
| SRC-145 | Steam Store movie frame crawl | Arcana/Fortune Teller-like selection frame with `Mana Syphon`, `Over The Top`, `Wild Buff`, `Your Shield My Liege`, `Equip`, and `Confirm` | E5 official Store media for visible UI candidates only |
| derived | Arcana taxonomy reconciliation | 10 public rows vs 12 official-wiki rows, 10 normalized public-to-wiki matches, 2 Polentir rows outside the public table, and Wild Buff / And Another / Over The Top conflict queues | Source-level reconciliation |
| VID-005 | Library Sanctum storyboard | Arcana Finder relic panel and arcana-chest context | E3 partial |
| local implementation audit | `src/rules/crawler-dungeon.js`, `src/content/crawler-clone.js`, `src/rules/turboturn.js` | Current placeholder arcana-adjacent state and mana/card systems | Local implementation evidence |

## Coverage Counter

| Segment | Rows | Current exact 1:1 implemented | Placeholder-adjacent rows | Current status |
| --- | ---: | ---: | ---: | --- |
| Official arcana unlock rows | 10 | 0 | 3 | Official metadata names exist; generated Dexerto crawl confirms 10 table rows and no individual arcana pages in the current page; official-wiki value extract adds row-level unlock fields and keyword buckets; `arcana-taxonomy-reconciliation.md` maps all 10 public rows to wiki rows and exposes the Wild Buff 200-vs-250 conflict; exact UI/runtime missing |
| Automatic/default arcana candidates | 2 | 0 | 0 | `Experimental Medicine` and `Shield Bash` are cross-source secondary candidates and official-wiki Polentir-unlocked rows; the Dexerto crawl does not expose these rows, so direct UI proof is still required |
| Current prototype arcana surface | unknown original total | 0 | 1 | `state.crawl.arcana` exists only as a shallow local array |
| Fortune Teller / start selection | 12 candidate rows | 0 | 0 | Store movie shows one Arcana/Fortune Teller-like selection surface, but exact Fortune Teller entry, locks, selection limit, and effect application are unresolved |

## Current Prototype Surface

| Surface | Current behavior | Why it is not final parity |
| --- | --- | --- |
| `state.crawl.arcana` | Empty array on crawler state; local events can push a relic id | No original arcana names, cards, effect text, start selection, chest reward, or persistence |
| `portraitGallery` / event rewards | Can grant a random prototype relic and add its id to `arcana` | This is a local event, not proven Fortune Teller or Arcana Finder behavior |
| `src/rules/turboturn.js` | Supports local combo/mana chain behavior | Chain Link, Wild Buff, Jester's Hat, and Mana Syphon effects are not implemented as arcana |
| Crawler card / trigger systems | Local characters, cards, and color concepts exist | Arcana effects tied to crawler cards, purple cards, armor, deck size, or triggers are not implemented |

## Per-Arcana Gap Rows

| ID | Original arcana | Collected unlock/proof | Current implementation surface | Parity | Current gap | Required proof |
| --- | --- | --- | --- | --- | --- | --- |
| ARC-001 | Wild Buff Arcana | Official achievement and Dexerto row; Dexerto says 200 light-source cards while official-wiki value extract says 250; secondary effect says light-source cards get combo scaling | No direct equivalent | No | Unlock count conflict, exact effect text, light-source card category, start selection, and runtime interaction missing | Fortune Teller/start UI, exact effect text, unlock popup, tracker count, and light-source runtime example |
| ARC-002 | Jester's Hat Arcana | Official achievement and Dexerto row; secondary effect says Wild access each floor | Wild card / link-gem concepts only | Placeholder only | Adds-vs-drop wording, Wild count relation, and chain behavior changes missing | Effect text plus normal Wild and arcana-modified Wild comparison |
| ARC-003 | Chain Link Arcana | Official achievement and Dexerto row; secondary effect says combo does not clear between turns | TurboTurn chain is local base system only | Placeholder only | Arcana-specific chain carryover, threshold, and cap behavior missing | Effect text plus combo 12+ unlock and before/after chain example |
| ARC-004 | Your Shield My Liege Arcana | Official achievement and Dexerto row; secondary/PC Gamer crawl effect says remaining Armor carries between turns | Local armor cards exist but no arcana | No | Armor persistence boundary and build impact missing | Armor unlock proof, effect text, and armor runtime comparison |
| ARC-005 | Swollen Fist Arcana | Official achievement and Dexerto row; secondary effect says end-turn damage scales with deck size | Local deck size exists but no arcana | No | Damage timing, target, and formula missing | Deck-size unlock proof, effect text, and a deck-size-dependent runtime example |
| ARC-006 | And Another Arcana | Official achievement and Dexerto row; official-wiki value extract and Dexerto support 150 Free-to-Play cards, while GAMES.GG says 500; secondary effect says repeated same-turn cards become free | No direct equivalent | No | Free-to-Play category, 150-vs-500 unlock count conflict, and exact effect missing | Category UI, unlock proof, effect text, and runtime example |
| ARC-007 | Make a Scene Arcana | Official achievement and Dexerto row; secondary effect says crawler triggers fire at turn start | Local character triggers exist but no arcana | No | Start-turn timing, trigger scope, and modifier behavior missing | Crawler trigger example before/after arcana and exact effect text |
| ARC-008 | Over The Top Arcana | Official achievement and Dexerto row; PC Gamer crawl and SRC-145 Store movie frame support top-of-deck wording while other secondary sources say hand/next-turn return | Local crawler cards/characters are not original-mapped | No | Return zone/timing conflict and crawler-card category missing; Store movie is visible-media wording only | Crawler card UI, unlock popup, effect text, and runtime proof |
| ARC-009 | Sharp Mind Arcana | Official achievement and Dexerto row; secondary effect says up to 5 Mana carries between turns | Local color/mana concepts exist but no arcana | No | Purple-card category, carryover cap, reset timing, and runtime behavior missing | Purple-card UI/count proof, exact effect text, and before/after example |
| ARC-010 | Mana Syphon Arcana | Official achievement and Dexerto row; SRC-145 Store movie frame reads `Increase Mana every 100 cards.`; secondary effect says every 100 cards played grants +1 Mana for the run | Local mana gain exists but no arcana | No | Counter scope, mana-gain timing, within-run permanence, and exact omitted details in Store frame missing | 15-mana unlock proof, effect text, and mana-flow runtime example |
| ARC-011 | Experimental Medicine | Secondary sources identify this as an automatic/default Fortune Teller arcana; official-wiki value extract marks it as unlocked when taking Polentir | No direct equivalent | No | Direct roster/default-state proof, healing multiplier text, and runtime effect missing | Fortune Teller list plus healing comparison before/after selection |
| ARC-012 | Shield Bash | Secondary sources identify this as an automatic/default Fortune Teller arcana; official-wiki value extract marks it as unlocked when taking Polentir | No direct equivalent | No | Direct roster/default-state proof, armor-to-damage text, and runtime effect missing | Fortune Teller list plus armor-card damage comparison |

## Required Completion

- Capture Fortune Teller unlock flow, start-of-run arcana selection, locked/unlocked states, and Arcana Finder chest behavior.
- Verify whether `Experimental Medicine` and `Shield Bash` are automatic/default arcanas in the target build despite their absence from the generated Dexerto unlock-table crawl.
- Resolve the `Wild Buff` 200-vs-250 count conflict, `And Another` unlock-count conflict, and `Over The Top` return-zone wording with direct UI/runtime proof.
- Keep implementation approval closed until each arcana row has a verified file/function target and testable acceptance condition.
