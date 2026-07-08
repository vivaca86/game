# PC Gamer Upgrade Priority Page Crawl

Status: `generated 2026-05-22 / source-level upgrade-priority crawl`

Source URL: https://www.pcgamer.com/games/roguelike/vampire-crawlers-best-upgrades-unlock-order/

This file stores the extracted PC Gamer upgrade-priority article as a source-level artifact. It does not prove exact in-game UI labels, costs beyond the visible hints, rank caps, formulas, unlock order, refund behavior, persistence, or runtime effects.

## Crawl Notes

| Check | Result |
| --- | --- |
| Page fetched | 2026-05-22 |
| Page title | `Unlock these Vampire Crawlers upgrades first to blast through the hardest stages` |
| Author / publication date shown | `Diego Perez` / `23 April 2026` |
| Jump sections exposed | `Unlock these Crawlers`, `Buy these upgrades`, `Add an Arcana`, `Priority relics` |
| Crawler priority rows extracted | 2 |
| Shop upgrade hint rows extracted | 5 |
| Arcana hint rows extracted | 3 |
| Relic / village-feature hint rows extracted | 4 |
| Full Power-Up Shop table present | No |
| Full cost curve present | No |
| Exact rank caps present | No |
| Refund/respec UI claim present | Yes, article says the shop has a refund button |

## Boundary Notes

- PC Gamer is a recommendation article, not a full table. It should guide direct-capture planning but cannot authorize implementation.
- The page gives selected early cost/stat hints: `Recovery` first rank at 500 coins, `Reroll` first rank at 250 coins, and first `Might` / `Luck` upgrades as 20% stat increases.
- The page states a refund button exists in the shop, but does not show its UI, rules, or persistence.
- The article says the shop uses the same upgrade family as Vampire Survivors; this is not used as Vampire Crawlers proof beyond the names explicitly discussed in this article.
- PC Gamer's `Over The Top` wording supports the top-of-deck side of `CON-020`; this still needs runtime or UI proof.

## Extracted Crawler Priority Rows

| Crawl ID | Topic | Source-Level Claim | Missing Before Implementation |
| --- | --- | --- | --- |
| PCG-UPG001 | Pasqualina priority | Priority recruit after reaching level 20 with Imelda on Inlaid Library; article says Imelda unlocks after the first Mad Forest run | Exact Inn state, cost, starter deck, trigger text/color, and runtime passive proof |
| PCG-UPG002 | Gennaro priority | Priority recruit after defeating Mantichana in Mad Forest; article describes Mantichana as the Mad Forest final boss | Exact achievement/Town Hall wording, boss proof, Inn price, starter deck, and passive runtime proof |

## Extracted Shop Upgrade Hints

| Crawl ID | Upgrade | PC Gamer Hint | Missing Before Implementation |
| --- | --- | --- | --- |
| PCG-UPG003 | Recovery | First shop purchase recommendation; 500-coin first rank; restores 1 HP after every encounter | Exact row label, later costs, rank cap, timing, overheal/cap behavior, persistence |
| PCG-UPG004 | Reroll | 250-coin first rank; unlocks reward rerolls; later ranks described as fairly cheap | Exact row label, later costs, rank cap, affected reward screens, persistence |
| PCG-UPG005 | Duration | One or two early ranks recommended; described as cheap and useful for Crawler buff uptime | Exact cost, rank cap, affected buffs, timing unit, persistence |
| PCG-UPG006 | Might | First rank described as a 20% stat increase | Exact cost, rank cap, affected card/effect categories, stacking |
| PCG-UPG007 | Luck | First rank described as a 20% stat increase | Exact cost, rank cap, rarity/reward-pool math, interaction with Jeweler |

## Extracted Arcana Hints

| Crawl ID | Arcana / System | PC Gamer Hint | Missing Before Implementation |
| --- | --- | --- | --- |
| PCG-UPG008 | Fortune Teller / Arcana Tent | Polentir in Furious Forest unlocks the Fortune Teller's tent and Arcana system | Polentir panel, building unlock flow, exact Arcana UI, start selection, persistence |
| PCG-UPG009 | Over The Top | Crawler returns to the top of the deck after leaving; unlock by playing Crawler cards 100 times | Resolve return zone/timing against other sources, exact effect text, runtime case |
| PCG-UPG010 | Your Shield My Liege | Armor can be kept between turns; unlock after gaining 2,000 armor; article mentions an armor-value damage gem synergy | Exact effect text, turn/encounter boundary, matching gem name/effect, runtime example |

## Extracted Relic / Village Feature Hints

| Crawl ID | Relic / Feature | PC Gamer Hint | Missing Before Implementation |
| --- | --- | --- | --- |
| PCG-UPG011 | Combo Stack / Gem Hammer | Article says these are obtained in tutorial context | Exact panel text, acquisition route, naming, Museum toggle, and runtime proof |
| PCG-UPG012 | Polentir | Furious Forest after clearing Mad Forest; unlocks Fortune Teller / Arcana system | Exact location, panel, Arcana Tent unlock, persistence |
| PCG-UPG013 | Grim Grimoire | Library West Wing after clearing Inlaid Library; tracks discovered weapon evolutions | Exact pause-menu UI, discovered/undiscovered states, recipe visibility rules |
| PCG-UPG014 | Stardust Anvil | Teeny Bridge reward; unlocks Blacksmith's Shop, which adds gem slots to cards in the deck | Exact Blacksmith UI, costs, slot caps, valid targets, save persistence |

## Required Follow-Up

- Capture Power-Up Shop rows for Recovery, Reroll, Duration, Might, Luck, and any refund/respec control.
- Capture exact first-rank and later-rank costs, stat values, rank caps, persistence, and affected screens.
- Verify Polentir/Fortune Teller and Stardust Anvil/Blacksmith unlock flows with UI or direct play.
- Resolve `Over The Top` return-zone wording with runtime proof or game-file text.
- Keep character priority rows as planning hints only until Inn UI, roster costs, starter decks, and passive text are directly verified.
