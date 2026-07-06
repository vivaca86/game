# Official Wiki Character Field Crawl

Status: `generated 2026-05-22 / official wiki character field crawl`

Source hub: https://vampire.survivors.wiki/w/Crawlers:Wiki

Primary source pages:

- https://vampire.survivors.wiki/w/Crawlers:Characters
- `https://vampire.survivors.wiki/w/Crawlers:<character page>`

Follow-up value extract: [`official-wiki-character-value-extract.md`](./official-wiki-character-value-extract.md).

Related reconciliation: [`character-taxonomy-reconciliation.md`](./character-taxonomy-reconciliation.md).

This file stores field coverage extracted from official-wiki character-card pages. It is source-level official-wiki evidence only; character-select slots, Inn purchase prices, unlock states, party-slot behavior, and passive runtime effects still need shipped UI/game-file or direct-play proof before implementation.

## Crawl Notes

| Check | Result |
| --- | --- |
| Page/API fetched | 2026-05-22 |
| Character pages parsed | 23 |
| Infobox type | `Infobox VC Card` with `type = character` |
| Starter-deck templates found | 22 |
| API used | `api.php?action=parse` |
| Exact runtime proof present | No |
| Game-file proof present | No |

## Characters Page Rule Snapshot

| Rule Area | Source-Level Claim | Missing Before Implementation |
| --- | --- | --- |
| Inn system | Characters are purchased and equipped through Gorton Bell Inn | Fresh/progressed Inn UI, slot states, exact prices, lock text, and persistence |
| Lead crawler | The first chosen crawler contributes stats/power-ups and four starter cards | Character-select party UI and starter-deck before/after proof |
| Later crawlers | Later recruited crawlers contribute one attack/spell card and no extra power-ups | Party-slot behavior, follower recruitment behavior, and exception proof |
| Crawler effects | Each character card has a unique Crawler effect, usually triggered by a color card and lasting for a set duration | Trigger-color UI, duration stat interaction, and passive runtime proof |
| Disco mode | After five crawler purchases, Inn Disco mode can trigger; the page gives 10% chance, 5% discount, and no retrigger until after another dungeon run once the Inn is left | Trigger chance, discount display, repeatability, and save persistence |

## Field Coverage

| Field | Rows With Value | Rows Missing | Notes |
| --- | ---: | ---: | --- |
| `name` | 23 | 0 | All 23 character infobox rows expose names |
| `cost` | 22 | 1 | Missing only `Divano`; this is Crawler-card play cost, not purchase cost |
| `unlockcost` | 12 | 11 | Missing `Divano`, `Dommario`, `Giovanna`, `Krochi`, `Lama`, `Mortaccio`, `O'Sole`, `Poppea`, `Porta`, `Pugnala`, `Ramba` |
| numeric `unlockcost` | 10 | 13 | Non-numeric rows: `Christine = N/A`, `Clerici = No`; direct Inn proof required |
| `unlocked by` | 21 | 2 | Missing `Divano` and `Imelda`; Imelda has a prose 10-coin Inn statement |
| `text` | 22 | 1 | Missing only `Divano` |
| `crawlertext` | 22 | 1 | Missing only `Divano` |
| `crawlerduration` | 20 | 3 | Missing `Divano`, `Porta`, and `Ramba`; Porta text still includes an inline duration note |
| starter deck template | 22 | 1 | Missing only `Divano` |
| `demo` | 23 | 0 | `Yes`: Antonio, Arca, Gennaro, Imelda, Pasqualina, Poe; all other rows `No` |
| `gem slots` | 23 | 0 | All 23 rows expose `0` |

## Character Infobox Rows

| Page | Cost | Unlock Cost | Unlocked By | Duration | Card Text | Crawler Text | Starter Deck |
| --- | ---: | ---: | --- | ---: | --- | --- | --- |
| Antonio | 0 | 0 | Completing the Tutorial. | 5 | Add 3 Armor.; Crawler. | Deal 10% more damage when a red card is played. | Antonio + Whip + Armor + Spinach |
| Arca | 0 | 500 | Playing Fire Wand 100 times. | 5 | Add 3 Mana.; Crawler. | Add 1 Mana when a purple card is played. | Arca + Fire Wand + Empty Tome + Armor |
| Cavallo | 0 | 750 | Defeating 250 Lion Heads. | 2 | Fire 2 more projectiles.; (2 Duration); Crawler. | Add 1 Amount when a yellow card is played. | Cavallo + Cherry Bomb + Candelabrador |
| Christine | 0 | N/A | Finding and playing the Pentagram. | 3 | Reduce Mana cost of cards in hand by 1.; (9 Duration); Crawler | Disarm 1 enemy when a Purple card is played. | Christine + Light Tome + Armor + Pentagram + Attractorb |
| Clerici | 0 | No | Recovering 1,000 HP. | 6 | Heal 3.; Crawler | Heal 1 after encounter when a Blue Card is played. | Clerici + Santa Water + Empty Tome + Duplicator + Armor |
| Concetta | 1 | 1840 | Finding the coffin in Gallo Tower. | 10 | Area: Attacks deal 10% splash damage.; Crawler | Attacks deal 5% splash damage when a red card is played. | Concetta + Shadow Pinion + Empty Tome + Armor |
| Divano | blank | blank | blank | blank | blank | blank | blank |
| Dommario | 1 | blank | Collecting 5,000 coins. | 7 | Duration: Crawlers trigger 2 more abilities before leaving.; Crawler. | Deal 40 damage with a chance to knockback when a purple card is played. | Dommario + King Bible + Armor + Empty Tome |
| Gallo | 1 | 5200 | Defeating Gallo at the end of Gallo Tower. | 8 | Greed: Gain 25% more coins.; Crawler. | Gain 10% more coins when a Wild card is played | Gallo + Clock Lancet + Clover + Empty Tome + Armor |
| Gennaro | 1 | 600 | Defeating Mantichana in Mad Forest. | 5 | Fire 2 more projectiles.; Crawler | Deal 90 damage when a red card is played. | Gennaro + Knife + Armor + Spinach |
| Giovanna | 1 | blank | Finding the coffin in Library Sanctum. | 6 | Add 20% Luck.; Crawler. | Draw 1 card when a purple card is played. | Giovanna + Armor + Gatti Amari + Empty Tome |
| Imelda | 0 | 10 | blank | 5 | Add 18 XP.; Crawler. | Gain 1% XP Growth when a yellow card is played. | Imelda + Magic Wand + Armor + Attractorb |
| Krochi | 1 | blank | Defeating 6,666 enemies. | 10 | Gain 10% Revival.; Crawler. | Gain 5% Revival when a Wild card is played. | Krochi + Cross + Armor + Light Tome + Attractorb |
| Lama | 1 | blank | Completing a dungeon with 10% Curse or more. | 5 | Deal 50% more damage.; Crawler | Deal 15% more damage when a blue card is played. | Lama + Axe + Empty Tome + Armor + Candella |
| MissingN0 | 0 | 6666 | Defeating RedDeath. | 170 | Add 4 Armor.; Crawler. | Draw 2 cards when a red card is played | MissingN0 + Death Spiral + Axe |
| Mortaccio | 0 | blank | Defeating 444 Skeletons. | 7 | Amount: Fire 2 more projectiles.; Crawler. | Fire 1 more projectile when a blue card is played. | Mortaccio + Bone + Golden Armor |
| O'Sole | 1 | blank | Defeating 15 Dragon Shrimps in Gallo Tower. | 4 | Amount: Fire 3 more projectiles.; Crawler. | Add 5% Luck when a red card is played. | O'Sole + Celestial Dusting + Empty Tome + Armor |
| Pasqualina | 1 | 1100 | Reaching level 20 with Imelda in Inlaid Library. | 2 | Area: Attacks deal 10% splash damage.; Crawler. | Increase Hand by 1 when a purple card is played. | Pasqualina + Runetracer + Empty Tome + Candelabrador |
| Poe | 1 | 500 | Playing Garlic 25 times. | 3 | Area: Attacks deal 20% splash damage.; Crawler. | Draw 1 card when a blue card is played. | Poe + Garlic + Candelabrador + Armor |
| Poppea | 1 | blank | Finding the coffin in Milk Factory. | 9 | Increase Hand by 1.; Crawler | Crawlers trigger 1 more ability before leaving when a yellow card is played. | Poppea + Song of Mana + Empty Tome + Attractorb + Candelabrador |
| Porta | 0 | blank | Playing Lightning Ring 100 times. | blank | Projectiles hit 50% more times.; (11 Duration); Crawler | Add 1 Mana when a red card is played. | Porta + Lightning Ring + Empty Tome + Armor + Candelabrador |
| Pugnala | 1 | blank | Finding the coffin in Berserk Wood. | 3 | Might: Deal 20% more damage.; Crawler. | Draw 1 card when a yellow card is played. | Pugnala + Phiera Der Tuphello + Eight The Sparrow + Empty Tome + Spellbinder |
| Ramba | 1 | blank | Defeating the Milk Elemental in Dairy Plant. | blank | Amount: Fire 3 more projectiles.; Crawler. | Gain 1 Amount when a purple card is played. | Ramba + Carréllo + Empty Tome + Armor |

## Special Source-Level Notes

- `Divano` is a character infobox row but the page says it is unavailable in the current game, with some config and prerelease-video presence. Keep it separate from playable roster counts until UI/game files resolve it.
- `MissingN0` has official-wiki fields for `unlockcost = 6666`, RedDeath unlock, 170 duration, Death Spiral starter deck, and a prose note that follower MissingN0 adds a single Whip instead of its starter deck. This supports the hidden-row queue, not final availability.
- `O'Sole` official-wiki unlock wording says 15 Dragon Shrimps, conflicting with the 50 Dragon Shrimp value currently tracked from secondary/achievement-facing rows.
- Several `unlockcost` rows are blank or non-numeric, so this crawl narrows the Inn capture queue but does not complete purchase-cost proof.

## Source-Level Conflicts / Capture Targets

- Character roster taxonomy: 20 public achievement/unlock rows, 21 secondary playable-row claims, 22 Dexerto pages, 23 official-wiki character rows, and official 20+ shorthand remain separate until character-select UI/game files prove membership.
- Purchase costs: official-wiki `unlockcost` values conflict with secondary guide costs for at least Gallo and Christine; direct Inn UI is required.
- Imelda state: official wiki gives `unlockcost = 10` with no `unlocked by` field and prose that she costs 10 coins in the Inn, but secondary sources conflict on starting vs first-run vs paid state.
- MissingN0: official wiki supports the RedDeath hidden-row path but Steam public achievements still do not expose a normal MissingN0 row.
- O'Sole: official wiki uses 15 Dragon Shrimps while Steam/secondary rows should be checked before finalizing the kill count.
