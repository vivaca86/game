# Enemy / Trickster Secondary Source Crawl

Status: `generated 2026-05-22 / source-level enemy-special-boss crawl`

Source URLs:

- https://progameguides.com/vampire-crawlers/vampire-crawlers-beginners-guide/
- https://gamerblurb.com/articles/vampire-crawlers-trickster-guide-how-to-find-and-beat-it
- https://nintendowire.com/guides/vampire-crawlers/how-to-encounter-the-trickster/

This file stores selected enemy, boss-loop, card-shatter, and Trickster claims from three public secondary sources. It does not prove exact in-game enemy UI, HP, attack intent, spawn threshold, card-loss timing, reward popup text, gem effect text, stage/floor placement, or runtime formulas.

## Crawl Notes

| Check | Result |
| --- | --- |
| Pages fetched | 2026-05-22 |
| Pro Game Guides page title | `Vampire Crawlers Beginner's Guide (May 2026)` |
| Pro Game Guides author shown | `Nebojša Prijić` |
| GamerBlurb page title | `Vampire Crawlers Trickster Guide: How To Find And Beat It` |
| GamerBlurb author/date shown | `GamerBlurb Team` / `Apr 27` |
| Nintendo Wire page title | `Guide - How To Encounter 'The Trickster' in Vampire Crawlers` |
| Nintendo Wire author/date shown | `Peter Glagowski` / `April 22nd, 2026` |
| PGG enemy/boss-loop rows extracted | 3 |
| Trickster trigger rows extracted | 4 |
| Trickster stat/damage rows extracted | 3 |
| Trickster reward rows extracted | 2 |
| Exact in-game UI proof present | No |
| Exact spawn threshold present | No |
| Runtime video/frame proof present | No |

## Boundary Notes

- These are guide-derived planning hints only. They can guide direct-capture tasks, but cannot authorize enemy, boss, card-shatter, or reward implementation.
- Nintendo Wire includes adjacent-title comparison language. Treat those sentences as context only; Vampire Survivors behavior is not Vampire Crawlers proof.
- GamerBlurb exposes a candidate Trickster stat line, while Nintendo Wire gives approximate stage-damage examples. Keep both as conflicting secondary numbers until direct runtime proof or game files resolve them.
- GamerBlurb uses `Uncrackable Gem`; Nintendo Wire uses `Unbreakable Gem`. Steam/Dexerto currently support `Uncrackable Gem`, but exact in-game gem UI still needs proof.

## Extracted PGG Enemy / Boss-Loop Rows

| Crawl ID | Topic | Source-Level Claim | Missing Before Implementation |
| --- | --- | --- | --- |
| ENM-TRI001 | Stage-end boss loop | PGG describes dungeons as multi-floor first-person grid spaces and says boss fights / clear rewards return progress to the Village | Exact per-stage floor count, boss roster, clear UI, reward order, and persistence |
| ENM-TRI002 | Mantichana route hint | PGG beginner context supports Mantichana as a Mad Forest boss / early unlock target context | Readable Mantichana nameplate, HP, attacks, reward, clear consequence, and Gennaro unlock flow |
| ENM-TRI003 | Milk Elemental route hint | PGG beginner context supports Milk Elemental as Dairy Plant / Bianca-Ramba unlock context and links Dairy Plant progression toward Milk Factory | Readable Milk Elemental nameplate, Dairy/Milk stage boundary, HP, attacks, reward, and unlock popup |

## Extracted Trickster Trigger Rows

| Crawl ID | Source | Source-Level Claim | Missing Before Implementation |
| --- | --- | --- | --- |
| ENM-TRI004 | GamerBlurb | Trickster is not a normal fixed stage boss; it appears when repeated card use pushes cards into cracking/breaking | Exact crack threshold, break timing, UI warning state, and affected card types |
| ENM-TRI005 | GamerBlurb | Long combo turns, loop decks, draw chains, Wild support, Mana support, and return effects are listed as ways to force the card-shatter state | Exact card categories, valid combos, and whether every listed setup works in-game |
| ENM-TRI006 | Nintendo Wire | Trickster can be spawned at any point by repeatedly playing the same card during a single turn until it breaks | Exact any-stage condition, one-turn threshold, card-loss behavior, and spawn UI |
| ENM-TRI007 | Nintendo Wire | Breaking another card after Trickster appears can spawn another Trickster | Multi-spawn cap, duplicate-spawn timing, reward counting, and failure cases |

## Extracted Trickster Stat / Damage Rows

| Crawl ID | Source | Source-Level Claim | Missing Before Implementation |
| --- | --- | --- | --- |
| ENM-TRI008 | GamerBlurb | Candidate stat line: 30,000 base health, max hit 30, 0 XP, 95 knockback resist, 95 disarm resist, 0.75 instakill resist, Boss `No`, Appears In `Any` | Exact UI/game-file stat proof, scaling, intent labels, and whether `Boss No` affects rewards/unlocks |
| ENM-TRI009 | Nintendo Wire | Approximate Cappella Ultimate damage example around 450 | Direct damage capture, stage scaling formula, armor/defense order, and patch baseline |
| ENM-TRI010 | Nintendo Wire | Approximate Mad Forest attack example around 45 | Direct damage capture, stage scaling formula, armor/defense order, and patch baseline |

## Extracted Trickster Reward Rows

| Crawl ID | Source | Source-Level Claim | Missing Before Implementation |
| --- | --- | --- | --- |
| ENM-TRI011 | GamerBlurb | Defeating Trickster is connected to `Uncrackable Gem`, which makes cards less likely to shatter | Exact reward popup, gem name, gem text, rarity, valid targets, and runtime reduction behavior |
| ENM-TRI012 | Nintendo Wire | Defeating Trickster unlocks `Unbreakable Gem`, described as preventing card breaking during looping combos | Resolve `Uncrackable` vs `Unbreakable`, exact gem text, and whether it reduces or prevents breaking |

## Required Follow-Up

- Capture a controlled card crack/break sequence, including visible warning state, card identity, and card-loss or deck mutation result.
- Capture one Trickster spawn in a low-pressure stage and one attempted multi-spawn or prevented-spawn case.
- Capture Trickster HP/intent/damage in at least one early stage and one late stage to resolve the GamerBlurb vs Nintendo Wire numeric conflict.
- Capture the reward popup and gem UI to resolve `Uncrackable Gem` vs `Unbreakable Gem` and the exact anti-shatter effect.
- Keep Trickster separate from fixed stage bosses until in-game UI or game files prove its final class.
