# Character / Crawler Data

Status: `공식 메타데이터 수집 / secondary roster-passive mapping / individual character-page crawl / character taxonomy reconciliation / official wiki value extract / 출처 충돌 / 구현 차이 매핑 완료`

The character table currently captures static unlock claims. Full completion still requires character-select UI evidence, purchase cost, starting deck, Crawler card text, trigger color, and at least one real combat observation for every passive.

Official wiki update: `research/official-wiki-api-crawl.md` now exposes 23 character-card infobox rows and adds source-level party rules for lead vs non-lead crawlers plus a Gorton Bell Inn Disco-mode discount state. `research/official-wiki-character-field-crawl.md` stores field coverage for those 23 rows, and `research/official-wiki-character-value-extract.md` preserves the row-level values: card play costs, `unlockcost` candidates, demo flags, trigger-color buckets, starter deck card/count rows, and lead-crawler base stat fields. This improves roster and town-planning boundaries only; exact UI slots, prices, availability, and runtime passives still need direct proof.

Generated official wiki character field crawl: [`official-wiki-character-field-crawl.md`](./official-wiki-character-field-crawl.md).
Generated official wiki character value extract: [`official-wiki-character-value-extract.md`](./official-wiki-character-value-extract.md).
Generated character taxonomy reconciliation: [`character-taxonomy-reconciliation.md`](./character-taxonomy-reconciliation.md).
Generated official Steam news crawl: [`official-steam-news-crawl.md`](./official-steam-news-crawl.md).

Official Steam news update: `research/official-steam-news-crawl.md` adds high-level official support for different starting decks/base stats, up-to-three party progression, Character Card immediate effects, lingering color triggers, and example Poe / Suor Clerici / Mortaccio interactions. It does not replace character-select UI, Inn prices, or combat proof.

## Source Basis

| Source ID | Source | Used For | Current Grade |
| --- | --- | --- | --- |
| SRC-102 | Dexerto Vampire Crawlers hub | Character link list, including names not present in unlock-task table | E1 |
| SRC-159 | Dexerto character unlocks | 20 unlock-task rows | E1 |
| SRC-130 | Dexerto individual character page crawl | 22 character page rows with Crawler-card mana cost, duration, trigger text, and starter-deck links | E1 |
| SRC-108-C | GAMES.GG character guide | 21-character total claim, Inn purchase flow, party size note, coffin route notes | E1 |
| SRC-118 | Pro Game Guides tier list | 21-Crawler roster claim, starting weapon/card hints, passive/color-trigger hints, and build-role context | E1 |
| SRC-119 | VGC all Crawlers unlock guide | Tavern purchase flow, Antonio default, Imelda availability, Gallo/MissingN0 rows, and unlock-condition cross-check | E1 |
| SRC-136 | PC Gamer upgrade priority crawl | Generated planning hints for Pasqualina and Gennaro priority recruitment, Imelda first-run context, and Mantichana final-boss wording | E1 |
| SRC-121 | VGC best builds guide | Three-Crawler party examples and color-trigger draw/Amount build context | E1 |
| SRC-141 | Poncle official release FAQ crawl | Official-account broad `20+ characters` shorthand used only as roster-count boundary context | E5 developer statement via social FAQ |
| SRC-142 | Official wiki API and character field crawls | 23 character-card infobox rows, Crawler-card fields, starter decks, `unlockcost` candidates, demo flags, starter/lead party rules, Disco-mode Inn hint, Divano unavailable note, and MissingN0 source-level fields | E5 official wiki / not direct play |
| SRC-149 | Official wiki character value extract | 23 character value rows, 22 starter decks, card play cost distribution, 10 numeric / 11 blank / 2 non-numeric `unlockcost` candidates, trigger-color buckets, lead-crawler base stat fields, and Divano/MissingN0/Imelda/O'Sole capture targets | E5 official wiki structured values / not direct play |
| SRC-143 | Steam official news crawl | Official announcement support for different starting decks/base stats, up to 3 party members, Character Card immediate effects, lingering color triggers, and Poe/Suor Clerici/Mortaccio example interactions | E5 official announcement / not direct play |
| SRC-301 | Reddit hidden/endgame claims | MissingN0 / Red Death hypothesis only | E0-E1 |
| SRC-006 | Steam Community achievements page | Official public achievement names/descriptions for 20 character unlock-style achievements; no separate public Imelda or MissingN0 achievement found in the 161-row page | E5 metadata |

## Coverage Counter

| Segment | Known Total | Rows Collected | E2+ | E3+ | E4/E5 | Conflict / Missing |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Unlock-task rows | 20 | 20 | 20 metadata | 0 | 20 metadata | Precise values/passives/decks still missing |
| Character names seen in source-level roster surfaces | 23 official-wiki rows, 22 Dexerto page rows, 21 secondary playable-roster claims, 20 public unlock rows, plus official 20+ shorthand | 23 wiki rows + 22 Dexerto rows + 20 public unlock rows | 23 official-wiki rows with value extract / 22 Dexerto page rows / `research/character-taxonomy-reconciliation.md` / 21 secondary / 20 metadata / official shorthand | 0 | 20 metadata + 23 official-wiki rows | `research/character-taxonomy-reconciliation.md` now separates public unlock rows, Imelda's default/early layer, MissingN0's hidden/page layer, Divano's wiki-only/unavailable layer, and official shorthand; final membership still needs character-select/Inn UI or game-file proof |
| Character select UI | 미확정 | 0 | 0 | 0 | 0 | Needs video/direct play |
| Starting decks/passives | 23 official-wiki rows / 22 playable-field candidates | 23 wiki value rows + 22 Dexerto page rows | 23 official-wiki value rows / 22 Dexerto page rows / 21 secondary partial | 0 | official wiki source-level | `research/official-wiki-character-value-extract.md` captures 23 value rows, 22 starter-deck card/count rows, 22 base-stat rows, and trigger-color buckets; `research/character-dexerto-page-crawl.md` captures 22 page rows; purchase prices, availability, UI text, and combat behavior still need video/direct play |
| Current implementation gap map | 22 | 22 | 22 mapped | 0 | 0 exact parity | `research/character-gap-map.md` maps all 20 unlock rows plus Imelda/MissingN0 conflict rows; no current prototype character is an original parity match |

## Dexerto Individual Character Page Crawl

`research/character-dexerto-page-crawl.md` is the working individual-page crawl baseline for 22 character pages, and `research/character-taxonomy-reconciliation.md` is now the count/layer reconciliation for 20 public unlock rows, 21 secondary playable-roster claims, 22 Dexerto pages, 23 official-wiki character rows, and official `20+ characters` shorthand. The Dexerto crawl has no crawl errors and captures Crawler-card mana cost, duration where parsed, short effect text, trigger text, starter-deck links, release date, and URL.

`research/official-wiki-api-crawl.md` extends the row-level roster boundary to 23 character-card infobox rows: Antonio, Arca, Cavallo, Christine, Clerici, Concetta, Divano, Dommario, Gallo, Gennaro, Giovanna, Imelda, Krochi, Lama, MissingN0, Mortaccio, O'Sole, Pasqualina, Poe, Poppea, Porta, Pugnala, and Ramba. The wiki Characters page also says the lead crawler contributes stats and four starter cards, while later recruited crawlers contribute only one attack/spell card and no extra power-ups; Disco mode can appear after five crawler purchases and apply a discount. These remain source-level rules until the Inn/character-select UI is captured.

`research/official-wiki-character-field-crawl.md` adds field-level coverage for the 23 official-wiki rows: 22 rows with Crawler-card cost, text, Crawler text, and starter deck; 20 rows with `crawlerduration`; 12 rows with `unlockcost`; 10 numeric `unlockcost` candidates; 23 `demo` fields; and 23 `gem slots = 0` fields. `research/official-wiki-character-value-extract.md` preserves the row-level values behind that coverage, including 22 starter-deck card/count rows, 22 lead-crawler base-stat candidate rows, 10 numeric / 11 blank / 2 non-numeric `unlockcost` fields, trigger-color buckets, and explicit capture targets for Divano, MissingN0, Imelda, O'Sole, Christine, Clerici, and blank-cost rows.

This does not close character parity. `research/character-taxonomy-reconciliation.md` keeps Imelda, MissingN0, and Divano outside final playable-roster parity until UI or game files prove their states. The page `Mana Cost` field is a Crawler-card play cost, not an Inn purchase price. Availability state, purchase price, full character-select UI text, party persistence, trigger colors as displayed in UI, and runtime passive behavior still require high-resolution video, direct play, or game-file proof.

## Unlock Rows

| ID | Original Name | Unlock / Rescue Condition | Purchase Cost | Starting Deck | Passive / Trigger | Trigger Color | Runtime Observation | Evidence | Current Implementation | Gap | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CHR-001 | Poppea Pecorina | Find the coffin in Milk Factory | 미확정 | Song of Mana source-level starter; full deck unknown | Extra Hand on play candidate; +1 Duration when yellow cards are played | Yellow | 미검증 | SRC-159 E1; SRC-118 E1; SRC-119 E1 | no direct equivalent | Exact cost, full deck, UI text, coffin rescue, and passive runtime missing | secondary passive mapping |
| CHR-002 | Christine Davain | Find and play Pentagram | 2,800 gold per GAMES.GG text; needs UI proof | Pentagram plus Light Tome/Armor/Attractorb source-level starter candidates; full deck unknown | Prevents 1 enemy from attacking when a purple card is played | Purple | 미검증 | SRC-159 E1; SRC-108-C E1; SRC-118 E1; SRC-119 E1 | no direct equivalent | Level 35/40 threshold, cost, full deck, UI text, and passive runtime missing | 출처 충돌 / secondary passive mapping |
| CHR-003 | Iguana Gallo Valletto / Gallo | Defeat Gallo | 4,800 gold per GAMES.GG text; needs UI proof | Clock Lancet source-level starter; full deck unknown | Coin-farming/25% more coins per play candidate | 미확정 | 미검증 | SRC-159 E1; SRC-108-C E1; SRC-118 E1; SRC-119 E1 | no direct equivalent | Gallo/Iguana naming, boss-vs-character distinction, exact cost/deck/passive missing | 출처 충돌 / secondary passive mapping |
| CHR-004 | Concetta Caciotta | Find the coffin in Gallo Tower | 미확정 | Shadow Pinion source-level starter; full deck unknown | Area-bonus focused candidate; exact trigger/value unresolved | 미확정 | 미검증 | SRC-159 E1; SRC-118 E1; SRC-119 E1 | no direct equivalent | Exact cost, full deck, trigger color/value, coffin rescue, and passive runtime missing | secondary passive mapping |
| CHR-005 | O'Sole Meeo | Defeat 50 Dragon Shrimps in Gallo Tower in existing secondary/achievement-facing rows; official wiki value extract says 15 Dragon Shrimps | 미확정 | Celestial Dusting source-level starter plus Empty Tome + Armor in official wiki value extract | +3 Amount on play candidate; official wiki value extract buckets red trigger and Luck/Amount values | Red | 미검증 | SRC-159 E1; SRC-118 E1; SRC-119 E1; SRC-142; SRC-149 | no direct equivalent | Exact cost/deck/passive UI and Dragon Shrimp count/runtime proof missing | secondary passive mapping / source conflict |
| CHR-006 | Suor Clerici | Recover 1,000 HP | 미확정 | Santa Water source-level starter; full deck unknown | Heal 3 HP on play candidate; +1 HP when blue cards are played | Blue | 미검증 | SRC-159 E1; SRC-118 E1; SRC-119 E1 | no direct equivalent | Exact cost/deck/passive UI and healing counter behavior missing | secondary passive mapping |
| CHR-007 | Krochi Freetto | Defeat 6,666 enemies total | 3,000 gold per GAMES.GG text; needs UI proof | Cross source-level starter; full deck unknown | +5% Revival when Wild cards are played candidate | Wild | 미검증 | SRC-159 E1; SRC-108-C E1; SRC-118 E1; SRC-119 E1 | no direct equivalent | Exact cost/deck/passive UI, enemy-count persistence, and revive runtime missing | secondary passive mapping |
| CHR-008 | Giovanna Grana | Find the coffin in Library Sanctum | 미확정 | Gatti Amari source-level starter; full deck unknown | +20% Luck on play candidate; draw support when purple cards are played | Purple | 미검증 | SRC-159 E1; SRC-118 E1; SRC-119 E1; SRC-121 E1 | no direct equivalent | Exact cost/deck/passive UI, draw trigger, and coffin rescue proof missing | secondary passive mapping |
| CHR-009 | Yatta Cavallo | Defeat 250 Lion Heads | 미확정 | Cherry Bomb source-level starter; full deck unknown | Amount-focused candidate; exact value/trigger unresolved | 미확정 | 미검증 | SRC-159 E1; SRC-118 E1; SRC-119 E1 | no direct equivalent | Exact cost/deck/passive UI and Lion Head counter proof missing | secondary passive mapping |
| CHR-010 | Pugnala Provola | Find the coffin in Berserk Wood | 미확정 | Phiera Der Tuphello + Eight the Sparrow source-level starter candidates; full deck unknown | 20% damage buff on play candidate; draw 1 card when yellow cards are played | Yellow | 미검증 | SRC-159 E1; SRC-108-C E1; SRC-118 E1; SRC-119 E1; SRC-121 E1 | no direct equivalent | Exact cost/deck/passive UI, coffin floor, and runtime draw proof missing | secondary passive mapping |
| CHR-011 | Mortaccio | Defeat 444 Skeletons | 미확정 | Bone source-level starter; full deck unknown | Bone specialist; +1 Amount when blue cards are played candidate | Blue | 미검증 | SRC-159 E1; SRC-118 E1; SRC-119 E1; SRC-121 E1 | no direct equivalent | Exact cost/deck/passive UI and Skeleton counter proof missing | secondary passive mapping |
| CHR-012 | Porta Ladonna | Play Lightning Ring 100 times | 미확정 | Lightning Ring source-level starter; full deck unknown | +25 Area on play candidate; secondary mana/area trigger unresolved | 미확정 | 미검증 | SRC-159 E1; SRC-118 E1; SRC-119 E1 | no direct equivalent | Exact cost/deck/passive UI and Lightning Ring counter proof missing | secondary passive mapping |
| CHR-013 | Bianca Ramba | Defeat the Milk Elemental | 미확정 | Carrello source-level starter; full deck unknown | +3 Amount on play candidate; +1 Amount when purple cards are played | Purple | 미검증 | SRC-159 E1; SRC-118 E1; SRC-119 E1; SRC-121 E1 | no direct equivalent | Milk Elemental vs Dairy Plant clear wording, exact cost/deck/passive UI, and runtime proof missing | secondary passive mapping |
| CHR-014 | Lama Ladonna | Complete a dungeon with 10% Curse or more | 미확정 | Axe source-level starter; full deck unknown | 50% damage increase on play candidate; +15% damage when blue cards are played | Blue | 미검증 | SRC-159 E1; SRC-108-C E1; SRC-118 E1; SRC-119 E1 | no direct equivalent | Exact cost/deck/passive UI, Curse unlock, and damage runtime missing | secondary passive mapping |
| CHR-015 | Dommario | Collect 5,000 coins | 미확정 | King Bible source-level starter; full deck unknown | +2 Duration on play candidate; 40 damage when purple cards are played | Purple | 미검증 | SRC-159 E1; SRC-118 E1; SRC-119 E1 | no direct equivalent | Exact cost/deck/passive UI and economy counter proof missing | secondary passive mapping |
| CHR-016 | Poe Ratcho | Play Garlic 25 times | 미확정 | Garlic source-level starter; full deck unknown | +20 Area on play candidate; draw 1 card when blue cards are played | Blue | 미검증 | SRC-159 E1; SRC-118 E1; SRC-119 E1; SRC-121 E1 | no direct equivalent | Exact cost/deck/passive UI and Garlic counter proof missing | secondary passive mapping |
| CHR-017 | Arca Ladonna | Play Fire Wand 100 times | 미확정 | Fire Wand source-level starter; full deck unknown | +3 Mana on play candidate; +1 Mana when purple cards are played | Purple | 미검증 | SRC-159 E1; SRC-118 E1; SRC-119 E1 | no direct equivalent | Exact cost/deck/passive UI and Fire Wand counter proof missing | secondary passive mapping |
| CHR-018 | Gennaro Belpaese | Defeat the Mantichana in Mad Forest; PC Gamer crawl describes Mantichana as the Mad Forest final boss | 미확정 | Knife source-level starter; full deck unknown | +2 Amount on play candidate; 50 damage when red cards are played | Red | 미검증 | SRC-159 E1; SRC-118 E1; SRC-119 E1; SRC-136 E1 | no direct equivalent | Mantichana vs Mad Forest clear wording, exact cost/deck/passive UI, and boss proof missing | secondary passive mapping / PC Gamer planning hint |
| CHR-019 | Pasqualina Belpaese | Reach level 20 with Imelda Belpaese in Inlaid Library; PC Gamer crawl frames this as a priority recruit after Imelda's first-Mad-Forest availability | 미확정 | Runetracer source-level starter; full deck unknown | +10 Area on play candidate; +1 Hand when purple cards are played | Purple | 미검증 | SRC-159 E1; SRC-118 E1; SRC-119 E1; SRC-136 E1 | no direct equivalent | Imelda status, exact cost/deck/passive UI, and level-20 proof missing | secondary passive mapping / PC Gamer planning hint |
| CHR-020 | Antonio Belpaese | Rescued Antonio in the average Italian countryside; VGC/PGG/GAMES.GG treat him as starting/default | default per SRC-119/SRC-118; exact Inn state needs UI | Whip source-level starter; full deck unknown | Armor on play candidate; +10% damage when red cards are played | Red | 미검증 | SRC-159 E1; SRC-108-C E1; SRC-118 E1; SRC-119 E1 | no direct equivalent | Tutorial/rescue vs starting-default relation, full deck, UI text, and passive runtime missing | secondary passive mapping / 출처 충돌 |

## Name Rows Not Resolved By Unlock Table

| ID | Name | Why Separate | Evidence | Required Resolution | Status |
| --- | --- | --- | --- | --- | --- |
| CHR-X01 | Imelda Belpaese | Appears in navigation and Pasqualina condition but not as a public unlock achievement row; secondary sources treat her as starting or early-after-Mad-Forest; PC Gamer crawl says she unlocks after the first Mad Forest run; official wiki value extract gives `unlockcost = 10`, blank `unlocked by`, Magic Wand starter row, and yellow/XP/Growth buckets | SRC-102/SRC-159 E1, SRC-108-C E1, SRC-118 E1, SRC-119 E1, SRC-136 E1, SRC-142, SRC-149 | Verify whether Imelda is starting default, first-run unlock, purchased for 10 gold, tutorial reward, or omitted from the public achievement list | official wiki value extract / secondary roster mapping / 출처 충돌 |
| CHR-X02 | MissingN0 | Appears in Dexerto navigation, Reddit hidden-character claims, VGC's all-Crawlers article, and official wiki character value rows, but 21-roster guides and official achievements do not account for a normal public row | SRC-102 E1, SRC-119 E1, SRC-130 E1, SRC-142, SRC-149, SRC-301 E0-E1 | Verify character-select UI, Red Death hidden unlock, patch status, joke/placeholder status, or postgame-only availability | official wiki hidden-row support / secondary hidden-row claim / direct UI required |

## Current Implementation Snapshot

| Current ID | Current Name | Original Mapping | Gap |
| --- | --- | --- | --- |
| rowan | 로완 베일 | none verified | Original roster not represented |
| mira | 미라 퀼 | none verified | Original roster not represented |
| puck | 퍽 릴 | none verified | Original roster not represented |
| cinder | 신더 오라 | none verified | Original roster not represented |

## Required Completion

- Resolve 20 public unlock rows vs 21/22 secondary visible-name rows vs 23 official-wiki character infobox rows.
- Use `research/character-taxonomy-reconciliation.md` before changing final roster membership: it separates the 20 public unlock layer, 21 secondary playable layer, 22 Dexerto page layer, 23 official-wiki layer, and official `20+ characters` shorthand.
- Use `research/official-wiki-character-value-extract.md` as the character/Inn source-level value queue: 23 character value rows, 22 starter decks, 22 base-stat rows, trigger-color buckets, and 10 numeric / 11 blank / 2 non-numeric `unlockcost` candidates.
- Resolve official-wiki `unlockcost` candidates and conflicts against direct Inn UI, especially Imelda, Christine, Clerici, Gallo, MissingN0, O'Sole, and blank/non-numeric rows.
- Capture character-select UI for every character slot.
- Record purchase cost, starting deck, Crawler card text, trigger color, and passive.
- Verify every passive in at least one combat video/direct play case.
