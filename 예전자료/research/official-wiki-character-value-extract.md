# Official Wiki Character Value Extract

Status: `generated 2026-05-22 / official wiki character value extract / SRC-149`

Source hub: https://vampire.survivors.wiki/w/Crawlers:Wiki

API endpoint used: https://vampire.survivors.wiki/api.php

Related crawl: [`official-wiki-character-field-crawl.md`](./official-wiki-character-field-crawl.md).

Related reconciliation: [`character-taxonomy-reconciliation.md`](./character-taxonomy-reconciliation.md).

Related town reconciliation: [`town-taxonomy-reconciliation.md`](./town-taxonomy-reconciliation.md).

This artifact keeps row-level structural values from official-wiki character-card pages and the Characters page rule text. It does not copy full article prose: character article text is represented by row values, starter-deck card lists, presence flags, and keyword buckets only. Treat this as official-wiki source-level evidence, not installed-build, Inn UI, character-select UI, combat runtime, save, or game-file proof.

## Crawl Notes

| Check | Result |
| --- | --- |
| Generated | 2026-05-22 |
| Character category queried | Category:Crawlers character cards |
| Category rows after excluding card/character indexes | 23 |
| Character infobox pages parsed | 23 |
| Starter-deck templates parsed | 22 |
| Character rows with base-stat fields | 22 |
| Full article/effect prose stored here | No; only row values, starter-deck lists, presence flags, and keyword buckets are stored |

## Characters Page Rule Flags

| Rule Area | Source-Level Flag | Missing Before Implementation |
| --- | --- | --- |
| Gorton Bell Inn purchase/equip | present | Fresh/progressed Inn UI, slot states, exact prices, lock text, and persistence |
| Lead crawler adds stats/power-ups and four starter cards | present | Character-select party UI plus starter-deck before/after proof |
| Later recruited crawler adds one attack/spell card and no extra power-ups | present | Follower recruitment UI, deck delta, and exception proof |
| Disco mode after five crawler purchases, 10% chance, 5% discount | present | Discount display, trigger/retrigger behavior, save persistence |

## Snapshot Counts

| Segment | Rows | Direct Runtime Proof Here? |
| --- | ---: | --- |
| Character category rows excluding indexes | 23 | No |
| Character infobox rows | 23 | No |
| Rows with starter decks | 22 | No |
| Rows with numeric unlockcost | 10 | No |
| Rows with blank unlockcost | 11 | No |
| Rows with non-numeric unlockcost | 2 | No |
| Rows with base-stat fields | 22 | No |

### Card Play Cost Distribution

| Card Cost | Rows |
| --- | ---: |
| 0 | 9 |
| 1 | 13 |
| blank | 1 |

### Inn Unlock Cost Candidate Distribution

| Unlock Cost Field | Rows |
| --- | ---: |
| 0 | 1 |
| 10 | 1 |
| 500 | 2 |
| 600 | 1 |
| 750 | 1 |
| 1100 | 1 |
| 1840 | 1 |
| 5200 | 1 |
| 6666 | 1 |
| blank | 11 |
| N/A | 1 |
| No | 1 |

### Demo Flag Distribution

| Demo Field | Rows |
| --- | ---: |
| No | 17 |
| Yes | 6 |

### Trigger Color / Condition Buckets

| Trigger Bucket | Rows |
| --- | ---: |
| blank | 1 |
| blue | 4 |
| purple | 6 |
| red | 6 |
| wild | 2 |
| yellow | 4 |

## Implementation-Relevant Queues

| Queue | Rows |
| --- | --- |
| Character rows with missing starter deck | Divano |
| Character rows with blank unlockcost | Divano; Dommario; Giovanna; Krochi; Lama; Mortaccio; O'Sole; Poppea; Porta; Pugnala; Ramba |
| Character rows with non-numeric unlockcost | Christine = N/A; Clerici = No |
| Character rows missing unlocked-by field | Divano; Imelda |
| Character rows missing crawlerduration field | Divano; Porta; Ramba |
| Character rows with base-stat fields | Antonio; Arca; Cavallo; Christine; Clerici; Concetta; Dommario; Gallo; Gennaro; Giovanna; Imelda; Krochi; Lama; MissingN0; Mortaccio; O'Sole; Pasqualina; Poe; Poppea; Porta; Pugnala; Ramba |
| Special source-level status notes | Divano unavailable current-game row; MissingN0 RedDeath/6666 hidden-row candidate; Imelda has unlockcost 10 with blank unlocked-by field; O'Sole has 15 Dragon Shrimps wording |

## Character Unlock / Card Value Rows

| Page | Name | ID | Card Cost | Unlock Cost | Unlocked By | Demo | Gem Slots | Duration | Trigger Bucket | Value Keyword Buckets | Release |
| --- | --- | --- | ---: | --- | --- | --- | ---: | ---: | --- | --- | --- |
| Antonio | Antonio | FCC_Antonio | 0 | 0 | Completing the Tutorial. | Yes | 0 | 5 | red | armor, damage, red, crawler | 21 April 2026 |
| Arca | Arca | FCC_arca | 0 | 500 | Playing Fire Wand 100 times. | Yes | 0 | 5 | purple | mana, purple, crawler | 21 April 2026 |
| Cavallo | Cavallo | FCC_Cavallo | 0 | 750 | Defeating 250 Lion Heads. | No | 0 | 2 | yellow | projectile, duration, yellow, amount, crawler | 21 April 2026 |
| Christine | Christine | FCC_Christine | 0 | N/A | Finding and playing the Pentagram. | No | 0 | 3 | purple | mana, duration, purple, disarm, hand, crawler | 21 April 2026 |
| Clerici | Clerici | FCC_Clerici | 0 | No | Recovering 1,000 HP. | No | 0 | 6 | blue | heal, blue, crawler | 21 April 2026 |
| Concetta | Concetta | FCC_Concetta | 1 | 1840 | Finding the coffin in Gallo Tower. | No | 0 | 10 | red | damage, red, splash, crawler | 21 April 2026 |
| Divano | Divano | FCC_Divano | blank | blank | blank | No | 0 | blank | blank | blank | blank |
| Dommario | Dommario | FCC_Dommario | 1 | blank | Collecting 5,000 coins. | No | 0 | 7 | purple | damage, duration, purple, knockback, crawler | 21 April 2026 |
| Gallo | Gallo | FCC_Gallo | 1 | 5200 | Defeating Gallo at the end of Gallo Tower. | No | 0 | 8 | wild | greed, coin, wild, crawler | 21 April 2026 |
| Gennaro | Gennaro | FCC_Gennaro | 1 | 600 | Defeating Mantichana in Mad Forest. | Yes | 0 | 5 | red | damage, projectile, red, crawler | 21 April 2026 |
| Giovanna | Giovanna | FCC_Giovanna | 1 | blank | Finding the coffin in Library Sanctum. | No | 0 | 6 | purple | luck, draw, purple, crawler | 21 April 2026 |
| Imelda | Imelda | FCC_Imelda | 0 | 10 | blank | Yes | 0 | 5 | yellow | yellow, xp, growth, crawler | 21 April 2026 |
| Krochi | Krochi | FCC_Krochi | 1 | blank | Defeating 6,666 enemies. | No | 0 | 10 | wild | revival, wild, crawler | 21 April 2026 |
| Lama | Lama | FCC_Lama | 1 | blank | Completing a dungeon with 10% Curse or more. | No | 0 | 5 | blue | damage, blue, crawler | 21 April 2026 |
| MissingN0 | MissingN0 | FCC_MissingNo | 0 | 6666 | Defeating RedDeath. | No | 0 | 170 | red | armor, draw, red, crawler | 21 April 2026 |
| Mortaccio | Mortaccio | FCC_Mortaccio | 0 | blank | Defeating 444 Skeletons. | No | 0 | 7 | blue | projectile, blue, amount, crawler | 21 April 2026 |
| O'Sole | O'Sole | FCC_OSole | 1 | blank | Defeating 15 Dragon Shrimps in Gallo Tower. | No | 0 | 4 | red | projectile, luck, red, amount, crawler | 21 April 2026 |
| Pasqualina | Pasqualina | FCC_Pasqualina | 1 | 1100 | Reaching level 20 with Imelda in Inlaid Library. | Yes | 0 | 2 | purple | damage, purple, splash, hand, crawler | 21 April 2026 |
| Poe | Poe | FCC_Poe | 1 | 500 | Playing Garlic 25 times. | Yes | 0 | 3 | blue | damage, draw, blue, splash, crawler | 21 April 2026 |
| Poppea | Poppea | FCC_Poppea | 1 | blank | Finding the coffin in Milk Factory. | No | 0 | 9 | yellow | yellow, hand, crawler | 21 April 2026 |
| Porta | Porta | FCC_Porta | 0 | blank | Playing Lightning Ring 100 times. | No | 0 | blank | red | mana, projectile, duration, red, crawler | 21 April 2026 |
| Pugnala | Pugnala | FCC_Pugnala | 1 | blank | Finding the coffin in Berserk Wood. | No | 0 | 3 | yellow | damage, draw, yellow, crawler | 21 April 2026 |
| Ramba | Ramba | FCC_Ramba | 1 | blank | Defeating the Milk Elemental in Dairy Plant. | No | 0 | blank | purple | projectile, purple, amount, crawler | 21 April 2026 |

## Starter Deck Value Rows

| Page | Starter Deck Cards / Counts | Non-Character Starter Cards | Starter Deck Row Count |
| --- | --- | --- | ---: |
| Antonio | Antonio x1; Whip x2; Armor x1; Spinach x1 | Whip x2; Armor x1; Spinach x1 | 4 |
| Arca | Arca x1; Fire Wand x2; Empty Tome x1; Armor x1 | Fire Wand x2; Empty Tome x1; Armor x1 | 4 |
| Cavallo | Cavallo x1; Cherry Bomb x3; Candelabrador x1 | Cherry Bomb x3; Candelabrador x1 | 3 |
| Christine | Christine x1; Light Tome x1; Armor x1; Pentagram x1; Attractorb x1 | Light Tome x1; Armor x1; Pentagram x1; Attractorb x1 | 5 |
| Clerici | Clerici x1; Santa Water x1; Empty Tome x1; Duplicator x1; Armor x1 | Santa Water x1; Empty Tome x1; Duplicator x1; Armor x1 | 5 |
| Concetta | Concetta x1; Shadow Pinion x2; Empty Tome x1; Armor x1 | Shadow Pinion x2; Empty Tome x1; Armor x1 | 4 |
| Divano | blank | blank | 0 |
| Dommario | Dommario x1; King Bible x2; Armor x1; Empty Tome x1 | King Bible x2; Armor x1; Empty Tome x1 | 4 |
| Gallo | Gallo x1; Clock Lancet x1; Clover x1; Empty Tome x1; Armor x1 | Clock Lancet x1; Clover x1; Empty Tome x1; Armor x1 | 5 |
| Gennaro | Gennaro x1; Knife x2; Armor x1; Spinach x1 | Knife x2; Armor x1; Spinach x1 | 4 |
| Giovanna | Giovanna x1; Armor x1; Gatti Amari x2; Empty Tome x1 | Armor x1; Gatti Amari x2; Empty Tome x1 | 4 |
| Imelda | Imelda x1; Magic Wand x2; Armor x1; Attractorb x1 | Magic Wand x2; Armor x1; Attractorb x1 | 4 |
| Krochi | Krochi x1; Cross x1; Armor x1; Light Tome x1; Attractorb x1 | Cross x1; Armor x1; Light Tome x1; Attractorb x1 | 5 |
| Lama | Lama x1; Axe x1; Empty Tome x1; Armor x1; Candella x1 | Axe x1; Empty Tome x1; Armor x1; Candella x1 | 5 |
| MissingN0 | MissingN0 x1; Death Spiral x3; Axe x2 | Death Spiral x3; Axe x2 | 3 |
| Mortaccio | Mortaccio x1; Bone x3; Golden Armor x1 | Bone x3; Golden Armor x1 | 3 |
| O'Sole | O'Sole x1; Celestial Dusting x2; Empty Tome x1; Armor x1 | Celestial Dusting x2; Empty Tome x1; Armor x1 | 4 |
| Pasqualina | Pasqualina x1; Runetracer x2; Empty Tome x1; Candelabrador x1 | Runetracer x2; Empty Tome x1; Candelabrador x1 | 4 |
| Poe | Poe x1; Garlic x2; Candelabrador x1; Armor x1 | Garlic x2; Candelabrador x1; Armor x1 | 4 |
| Poppea | Poppea x1; Song of Mana x1; Empty Tome x1; Attractorb x1; Candelabrador x1 | Song of Mana x1; Empty Tome x1; Attractorb x1; Candelabrador x1 | 5 |
| Porta | Porta x1; Lightning Ring x1; Empty Tome x1; Armor x1; Candelabrador x1 | Lightning Ring x1; Empty Tome x1; Armor x1; Candelabrador x1 | 5 |
| Pugnala | Pugnala x1; Phiera Der Tuphello x1; Eight The Sparrow x1; Empty Tome x1; Spellbinder x1 | Phiera Der Tuphello x1; Eight The Sparrow x1; Empty Tome x1; Spellbinder x1 | 5 |
| Ramba | Ramba x1; Carréllo x2; Empty Tome x1; Armor x1 | Carréllo x2; Empty Tome x1; Armor x1 | 4 |

## Lead Crawler Base Stat Candidate Rows

| Page | Max Health | Recovery | Hand | Mana | Armor | Might | Area | Amount | Magnet | Revival | Luck | Growth | Greed | Curse |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Antonio | +10 | blank | blank | blank | blank | blank | blank | blank | blank | blank | blank | blank | blank | blank |
| Arca | +5 | blank | blank | +1 | blank | +30% | blank | blank | blank | blank | blank | blank | blank | blank |
| Cavallo | +20 | blank | +1 | blank | blank | blank | blank | +2 | blank | blank | blank | blank | blank | blank |
| Christine | blank | blank | +2 | blank | blank | blank | blank | blank | blank | blank | +50% | +25% | blank | blank |
| Clerici | +10 | blank | +1 | +1 | blank | blank | +25% | blank | blank | blank | blank | blank | blank | blank |
| Concetta | blank | blank | +1 | +1 | blank | blank | +50% | blank | blank | blank | blank | blank | blank | blank |
| Dommario | blank | blank | +1 | +1 | blank | blank | blank | blank | blank | blank | blank | blank | blank | blank |
| Gallo | +30 | blank | blank | +1 | blank | blank | blank | +1 | blank | blank | +50% | blank | +50% | blank |
| Gennaro | blank | blank | +1 | blank | blank | +25% | blank | +1 | blank | blank | blank | blank | blank | blank |
| Giovanna | blank | blank | +1 | +1 | blank | blank | blank | blank | blank | blank | +50% | blank | +25% | blank |
| Imelda | blank | blank | blank | +1 | blank | blank | blank | blank | blank | blank | blank | +20% | blank | blank |
| Krochi | blank | blank | +1 | blank | blank | blank | blank | blank | blank | +100% | blank | blank | blank | blank |
| Lama | +10 | blank | blank | blank | +5 | +50% | blank | blank | blank | blank | blank | blank | blank | blank |
| MissingN0 | +97 | +1 | +8 | +80 | +125 | +80% | +260% | +2 | +8 | +2% | +80% | +80% | +80% | +95 |
| Mortaccio | +5 | +1 | +1 | blank | blank | blank | blank | +2 | blank | blank | blank | blank | blank | blank |
| O'Sole | +20 | blank | blank | blank | blank | blank | blank | +3 | blank | blank | blank | blank | blank | blank |
| Pasqualina | +5 | blank | +1 | blank | blank | blank | blank | blank | blank | blank | blank | blank | blank | blank |
| Poe | blank | blank | +1 | blank | blank | blank | +20% | blank | blank | blank | blank | blank | blank | blank |
| Poppea | +10 | blank | +2 | blank | blank | blank | +50% | blank | blank | blank | blank | blank | blank | blank |
| Porta | blank | blank | blank | +1 | blank | blank | +40% | blank | blank | blank | blank | blank | blank | blank |
| Pugnala | blank | blank | +2 | blank | blank | +30% | blank | blank | blank | blank | blank | blank | blank | blank |
| Ramba | +10 | +2 | blank | blank | blank | blank | +20% | +2 | blank | blank | blank | blank | blank | blank |

## Special Source-Level Notes

- Divano is preserved as an official-wiki character infobox row but the page marks it unavailable in the current game; keep it out of playable roster parity until UI or game files prove otherwise.
- MissingN0 is preserved as a hidden-row candidate with RedDeath unlock, 6666 unlockcost, unusually large duration/stat fields, and a follower-deck exception; the source field is spelled `max heath`, so the `+97` Max Health value remains a typo-mapped source-level candidate, not runtime proof.
- Imelda has unlockcost 10 and a blank unlocked-by field in this source layer; default, first-run unlock, paid purchase, and tutorial state remain unresolved until Inn UI or game files prove the current state.
- O'Sole uses 15 Dragon Shrimps in the official-wiki row, which must stay separate from secondary/achievement-facing 50 Dragon Shrimp claims until direct proof resolves the count.
- Crawler-card cost is a card play cost, not automatically an Inn purchase cost. Use unlockcost as a source-level purchase candidate only.

## Required Follow-Up

- Treat the 23 character rows as an Inn/character-select capture queue, not as final shipped roster membership.
- Verify full character-select or Gorton Bell Inn UI before implementing purchase cost, availability, default state, hidden rows, or exact roster count.
- Verify starter deck and lead-vs-follower deck rules with deck-before/deck-after UI, game files, or direct runtime proof before implementing party behavior.
- Verify trigger colors, durations, base stats, and passive effects in combat or game files before implementing runtime character effects.
- Keep Divano, MissingN0, Imelda, O'Sole, Christine, Clerici, and blank unlockcost rows as unresolved source-conflict/capture targets.
