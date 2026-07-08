# Character Implementation Gap Map

Status: `official metadata collected / secondary roster-passive mapping / individual character-page crawl / character taxonomy reconciliation / official wiki character value extract / roster total conflict / row-level current implementation gap-mapped`
Last updated: 2026-05-22

This file maps each collected Vampire Crawlers character/crawler candidate against the current prototype implementation. It keeps unlock-task rows, default-character candidates, hidden/uncertain candidates, and unavailable/wiki-only candidates separate because the current evidence supports 20 public character unlock-style achievements but does not settle the 21/22/23 total roster conflict.

## Source Basis

| Source ID | Source | Use | Grade |
| --- | --- | --- | --- |
| SRC-006 | Steam Community achievements page | 20 official public character unlock-style achievement rows | E5 metadata |
| SRC-159 | Dexerto character unlocks | 20 unlock-task rows and character names | E1 |
| SRC-102 | Dexerto Vampire Crawlers hub | Additional navigation names, including Imelda and MissingN0 | E1 |
| SRC-130 | Dexerto individual character page crawl | 22 character page rows with Crawler-card mana cost, duration, trigger text, and starter-deck links | E1 |
| SRC-108-C | GAMES.GG character guide | 21-character total claim, Inn purchase flow, party-size context | E1 |
| SRC-118 | Pro Game Guides tier list | 21-Crawler roster claim, starting weapon/card hints, passive/color-trigger hints | E1 |
| SRC-119 | VGC all Crawlers unlock guide | Tavern purchase flow, Antonio/Imelda state hints, Gallo/MissingN0 rows, unlock-condition cross-check | E1 |
| SRC-136 | PC Gamer upgrade priority crawl | Generated Pasqualina/Gennaro priority-recruit planning hints, Imelda first-run context, and Mantichana wording | E1 |
| SRC-121 | VGC best builds guide | Three-Crawler party examples and color-trigger draw/Amount build context | E1 |
| SRC-141 | Poncle official release FAQ crawl | Official-account broad `20+ characters` shorthand used as roster-count boundary context | E5 developer statement via social FAQ |
| SRC-142 | Official wiki API and character field crawls | 23 character-card rows, 22 starter-deck templates, `unlockcost` candidates, lead/non-lead party rules, Divano unavailable note, MissingN0 hidden-row support, and O'Sole count conflict | E5 official wiki / not direct play |
| SRC-149 | Official wiki character value extract | 23 character value rows, 22 starter deck card/count rows, 22 lead-crawler base-stat rows, trigger-color buckets, and Inn `unlockcost` candidates | E5 official wiki structured values / not direct play |
| derived | Character taxonomy reconciliation | `research/character-taxonomy-reconciliation.md` separates 20 public unlock rows, 21 secondary playable-roster claims, 22 Dexerto pages, 23 official-wiki rows, and official `20+ characters` shorthand | Source-level reconciliation / not direct play |
| SRC-301 | Reddit hidden/endgame claims | MissingN0/Red Death hypothesis only | E0-E1 |
| VID-009/011/012 | Storyboard videos | Partial character/party/Inn setup surfaces | E3 partial |
| local implementation audit | `src/content/crawler-clone.js`, `src/rules/crawler-dungeon.js` | Current prototype roster and character trigger behavior | Local implementation evidence |

## Coverage Counter

| Segment | Rows | Current exact 1:1 implemented | Placeholder-adjacent rows | Current status |
| --- | ---: | ---: | ---: | --- |
| Public unlock-style character rows | 20 | 0 | 0 | Official metadata collected, Dexerto individual-page fields added, and official-wiki value extract captured; exact purchase cost, availability state, UI text, trigger color display, and runtime proof still missing |
| Extra unresolved roster names | 3 plus official 20+ shorthand and 23-row wiki boundary | 0 | 0 | `research/character-taxonomy-reconciliation.md` separates Imelda as the source-level default/early roster candidate, MissingN0 as hidden/page-row candidate, and Divano as official-wiki-only/unavailable candidate; official FAQ shorthand does not settle the 21/22/23 row-level roster |
| Current prototype characters | 4 | 0 | 0 | `rowan`, `mira`, `puck`, and `cinder` are original-flavored prototype characters, not verified original mappings |
| Character-select/Inn flow | unknown total | 0 | partial surfaces only | Videos show partial party/Inn screens, and sources describe Tavern/Gorton Bell Inn purchase plus up-to-three-Crawler parties; Dexerto and official-wiki pages add Crawler-card/deck fields and official-wiki `unlockcost` candidates, but exact roster slots, purchase prices, availability, UI text, and persistence are unresolved |

## Individual Page Crawl Layer

`research/character-dexerto-page-crawl.md` stores 22 Dexerto character page rows. `research/character-taxonomy-reconciliation.md` reconciles that 22-page layer against the 20 public unlock rows, 21 secondary playable-roster claims, 23 official-wiki rows, and official `20+ characters` shorthand. The Dexerto crawl is useful for Crawler-card cost, duration, short effect, trigger text, and starter-deck links, but it is still E1 source-level data and does not prove character-select availability, Inn purchase cost, unlock state, or runtime passive behavior.

`research/official-wiki-character-field-crawl.md` stores 23 official-wiki character field rows, and `research/official-wiki-character-value-extract.md` preserves the row-level values behind them: 22 starter-deck card/count rows, 20 `crawlerduration` fields, 10 numeric / 11 blank / 2 non-numeric `unlockcost` candidates, demo flags, trigger buckets, 22 lead-crawler base-stat rows, and special notes for Divano, MissingN0, Imelda, and O'Sole. It is official-wiki source-level evidence only; it narrows the next Inn/character-select capture queue but does not prove shipped UI membership or final prices.

## Current Prototype Surface

| Surface | Current behavior | Why it is not final parity |
| --- | --- | --- |
| `crawlerCloneConfig.characters` | Four custom prototype characters: `rowan`, `mira`, `puck`, `cinder` | None match confirmed original character names or unlock rows |
| `state.crawl.unlockedCharacters` | Starts with `rowan` and `mira`, unlocks `cinder` and `puck` by prototype floor index | Original Inn/rescue/purchase/unlock flow is not implemented |
| `state.crawl.party` | Starts with two prototype party members | Original party size, selection order, and recruitment persistence are unverified |
| `crawlerPartyHas()` / `applyCrawlerCardTriggers()` | Prototype card-color/role triggers for the four custom characters | Original passive text, trigger colors, Crawler cards, and combat effects are missing |
| UI surfaces | Partial character/party screens appear in videos, but current UI has no exact original Inn/character-select parity | Current project cannot display original roster costs, decks, passives, or slot state |

## Per-Character Gap Rows

| ID | Original character candidate | Collected unlock/proof | Current implementation surface | Parity | Current gap | Required proof |
| --- | --- | --- | --- | --- | --- | --- |
| CHR-001 | Poppea Pecorina | Find the coffin in Milk Factory; official achievement metadata supports Poppea | No direct equivalent | No | Cost, starting deck, passive, trigger color, coffin rescue, and Milk Factory persistence missing | Character-select/Inn row, coffin rescue, purchase/unlock state, passive combat proof |
| CHR-002 | Christine Davain | Find and play Pentagram; threshold/source conflict noted | No direct equivalent | No | Pentagram dependency, cost, deck, passive, and trigger missing | Pentagram card-use proof plus Christine row/passive proof |
| CHR-003 | Iguana Gallo Valletto | Defeat Gallo; official achievement metadata supports Gallo | No direct equivalent | No | Gallo as boss vs character distinction, cost, deck, passive missing | Gallo fight/name proof plus character unlock/select proof |
| CHR-004 | Concetta Caciotta | Find the coffin in Gallo Tower | No direct equivalent | No | Coffin route, cost, deck, passive, trigger color missing | Gallo Tower coffin proof plus Inn/select and passive proof |
| CHR-005 | O'Sole Meeo | Defeat 50 Dragon Shrimps in Gallo Tower in current achievement/secondary-facing rows; official wiki value extract says 15 Dragon Shrimps and preserves Celestial Dusting starter row | No direct equivalent | No | Dragon Shrimp appearance/counting, exact count, cost, deck, passive missing | Enemy-count proof plus achievement/Town Hall/character unlock/select proof |
| CHR-006 | Suor Clerici | Recover 1,000 HP | No direct equivalent | No | Healing counter, cost, deck, passive, trigger missing | Healing unlock counter and passive combat proof |
| CHR-007 | Krochi Freetto | Defeat 6,666 enemies total | No direct equivalent | No | Enemy-count persistence, cost, deck, passive missing | Enemy-count unlock proof plus character row/passive proof |
| CHR-008 | Giovanna Grana | Find the coffin in Library Sanctum | No direct equivalent | No | Coffin route, cost, deck, passive, trigger missing | Library Sanctum coffin proof and passive combat proof |
| CHR-009 | Yatta Cavallo | Defeat 250 Lion Heads | No direct equivalent | No | Lion Head appearance/counting, cost, deck, passive missing | Lion Head combat/count proof and character row proof |
| CHR-010 | Pugnala Provola | Find the coffin in Berserk Wood | No direct equivalent | No | Berserk Wood coffin route, cost, deck, passive missing | Coffin rescue, Inn/select row, and passive combat proof |
| CHR-011 | Mortaccio | Defeat 444 Skeletons | No direct equivalent | No | Skeleton counting, cost, deck, passive missing | Skeleton combat/count proof and character row proof |
| CHR-012 | Porta Ladonna | Play Lightning Ring 100 times | No direct equivalent | No | Lightning Ring dependency, cost, deck, passive missing | Card-use counter and passive proof |
| CHR-013 | Bianca Ramba | Defeat the Milk Elemental | No direct equivalent | No | Milk Elemental identity, cost, deck, passive missing | Milk Elemental fight/name proof and character row proof |
| CHR-014 | Lama Ladonna | Complete a dungeon with 10% Curse or more | No direct equivalent | No | Curse system, cost, deck, passive missing | Curse setting/power-up proof, dungeon clear, and passive proof |
| CHR-015 | Dommario | Collect 5,000 coins | No direct equivalent | No | Economy counter, cost, deck, passive missing | Coin counter unlock and passive proof |
| CHR-016 | Poe Ratcho | Play Garlic 25 times | No direct equivalent | No | Garlic dependency, cost, deck, passive missing | Garlic use counter and passive proof |
| CHR-017 | Arca Ladonna | Play Fire Wand 100 times | No direct equivalent | No | Fire Wand dependency, cost, deck, passive missing | Fire Wand use counter and passive proof |
| CHR-018 | Gennaro Belpaese | Defeat the Mantichana in Mad Forest; PC Gamer crawl describes Mantichana as the Mad Forest final boss | No direct equivalent | No | Mantichana identity, cost, deck, passive missing | Mantichana fight/name proof plus character row/passive proof |
| CHR-019 | Pasqualina Belpaese | Reach level 20 with Imelda Belpaese in Inlaid Library; PC Gamer crawl frames this as a priority recruit after Imelda's first-Mad-Forest availability | No direct equivalent | No | Imelda default status, Inlaid Library level proof, cost, deck, passive missing | Imelda row, level-20 proof, Pasqualina unlock/select proof |
| CHR-020 | Antonio Belpaese | Rescued Antonio in the average Italian countryside | No direct equivalent | No | Tutorial/default relation, rescue flow, cost, deck, passive missing | First-run/tutorial rescue proof plus character row/passive proof |
| CHR-X01 | Imelda Belpaese | Appears in navigation and Pasqualina condition but not as a public unlock achievement row; PC Gamer crawl says she unlocks after the first Mad Forest run; official wiki value extract gives `unlockcost = 10`, blank `unlocked by`, Magic Wand starter row, and yellow/XP/Growth buckets | No direct equivalent | No | Default/purchased/tutorial/missing status unresolved | Character-select slot proof, starting state, cost/unlock state, passive proof |
| CHR-X02 | MissingN0 | Appears in navigation, Dexerto page rows, Reddit hidden-character claims, VGC, and official wiki value rows; no normal public achievement unlock row | No direct equivalent | No | Hidden/patch/joke/placeholder status unresolved | Character-select hidden slot or direct unlock proof from trusted source/game UI |

## Required Completion

- Resolve the 20 public unlock rows vs 21/22/23 visible-name conflict by capturing the full character-select or Inn roster.
- Use `research/character-taxonomy-reconciliation.md` before adding final playable-roster parity rows for Imelda, MissingN0, or Divano.
- Use `research/official-wiki-character-value-extract.md` as the source-level queue for 23 character values, 22 starter decks, 22 base-stat rows, trigger buckets, Divano/MissingN0/Imelda/O'Sole exceptions, and 10 numeric / 11 blank / 2 non-numeric `unlockcost` fields.
- For every confirmed character, record cost, unlock condition, starting deck, Crawler card text, passive text, trigger color, and party-slot rules.
- Reconcile official-wiki `unlockcost` candidates, Divano unavailable status, MissingN0 hidden-row support, Imelda default/paid state, and O'Sole's Dragon Shrimp count against direct UI, achievements/Town Hall, or game files.
- Verify every passive in at least one combat or direct-play example.
- Keep Imelda, MissingN0, and Divano separate until their default, hidden, unavailable, or placeholder status is proven.
- Keep implementation approval closed until every confirmed character row has an exact current file/function parity target and a testable acceptance condition.
