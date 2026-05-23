# Achievement / Unlock Data

Status: `official metadata collected / domain mapped`
Last updated: 2026-05-21

Steam Community exposes 161 public achievements for app `3265700`. This table captures the official achievement name, official public description, and global completion percentage visible on 2026-05-21.

This is E5 platform/game-provided metadata for achievement text, but it is not direct proof of in-game unlock UI, reward timing, save persistence, or runtime behavior. Every row still needs E3/E4 linkage to gameplay footage or direct play before it can close an implementation row.

## Source Basis

| Source ID | Source | Used For | Current Grade |
| --- | --- | --- | --- |
| SRC-006 | Steam Community achievements page | 161 official achievement names/descriptions and global unlock percentages | E5 metadata |

## Coverage Counter

| Segment | Known Total | Rows Collected | E2+ | E3+ | E4/E5 | Conflict / Missing |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Steam public achievements | 161 | 161 | 161 | 0 | 161 metadata | Direct in-game achievement popup, Town Hall checklist mapping, reward linkage, and current implementation mapping missing |
| Metadata domain mapping | 161 | 161 | 161 | 0 | 161 metadata | Domain/table mapping complete; exact in-game Town Hall rows and unlock popups still missing |

## Domain Mapping

This mapping links every Steam achievement row to the research table it currently informs. It is a metadata-level map only: the current prototype has no full achievement/Town Hall mirror, no original unlock-popup system, and no verified reward-persistence mapping. Per-achievement current implementation gaps are tracked in `research/achievement-gap-map.md`; enemy/boss-specific runtime gaps are tracked in `research/enemy-gap-map.md`.

| Domain | Count | Achievement IDs | Research table(s) | Current implementation gap |
| --- | ---: | --- | --- | --- |
| Card unlocks | 35 | ACH-005, ACH-006, ACH-010, ACH-012, ACH-014, ACH-017, ACH-019, ACH-021, ACH-028, ACH-031, ACH-032, ACH-035, ACH-054, ACH-056, ACH-058, ACH-066, ACH-072, ACH-079, ACH-085, ACH-090, ACH-091, ACH-092, ACH-106, ACH-109, ACH-110, ACH-121, ACH-125, ACH-131, ACH-133, ACH-144, ACH-148, ACH-150, ACH-152, ACH-156, ACH-157 | `research/data-cards.md`, `research/card-secondary-catalog.md`, `research/card-dexerto-page-crawl.md` | Current cards are original-flavored prototypes; secondary catalog now tracks 87 non-character candidates with an individual-page crawl, but exact original cost/color/effect/socket/runtime behavior is still missing |
| Evolution discoveries | 17 | ACH-016, ACH-038, ACH-063, ACH-064, ACH-065, ACH-081, ACH-093, ACH-095, ACH-096, ACH-101, ACH-108, ACH-111, ACH-143, ACH-154, ACH-155, ACH-158, ACH-161 | `research/data-cards.md`, `research/card-secondary-catalog.md`, `research/card-dexerto-page-crawl.md` | Secondary recipe mapping and individual page rows now exist, but exact Grim Grimoire/UI text, missing sockets, ingredient consumption, aliases, deck mutation, catalog boundary conflicts, and runtime effects remain missing |
| Gems | 49 | ACH-009, ACH-018, ACH-020, ACH-024, ACH-025, ACH-026, ACH-027, ACH-029, ACH-034, ACH-037, ACH-040, ACH-042, ACH-043, ACH-044, ACH-045, ACH-047, ACH-048, ACH-050, ACH-051, ACH-052, ACH-057, ACH-060, ACH-061, ACH-067, ACH-068, ACH-071, ACH-073, ACH-080, ACH-083, ACH-084, ACH-087, ACH-097, ACH-103, ACH-104, ACH-105, ACH-107, ACH-114, ACH-115, ACH-119, ACH-120, ACH-124, ACH-135, ACH-137, ACH-140, ACH-142, ACH-149, ACH-151, ACH-159, ACH-160 | `research/data-gems.md` | Current gem system has a small prototype set; 49 original gem unlock rows are metadata-backed and now have secondary effect-family mapping, but exact rarity, socket restrictions, row-to-effect mapping, and runtime effects are missing |
| Characters / Crawlers | 20 | ACH-002, ACH-022, ACH-036, ACH-041, ACH-069, ACH-074, ACH-075, ACH-077, ACH-082, ACH-094, ACH-102, ACH-112, ACH-116, ACH-122, ACH-127, ACH-128, ACH-132, ACH-136, ACH-139, ACH-141 | `research/data-characters.md`, `research/character-dexerto-page-crawl.md` | Current roster has four prototype characters; Dexerto page crawl exposes 22 character page rows, but only 20 public unlock-style achievements, and original purchase costs, availability, passive UI text, trigger colors, runtime proof, and 21/22-total conflict remain unresolved |
| Stage progression | 14 | ACH-007, ACH-015, ACH-023, ACH-033, ACH-059, ACH-070, ACH-076, ACH-089, ACH-098, ACH-117, ACH-118, ACH-129, ACH-138, ACH-146 | `research/data-stages.md`, `research/stage-taxonomy-reconciliation.md` | Stage-select UI, exact clear rewards, bosses, floor counts, tutorial status, and base/default-stage relation missing |
| Relics / power-ups | 13 | ACH-001, ACH-003, ACH-013, ACH-039, ACH-046, ACH-055, ACH-062, ACH-086, ACH-088, ACH-126, ACH-130, ACH-134, ACH-153 | `research/data-relics.md`, `research/relic-gap-map.md` | Current relic pool is prototype-only; original effects, Museum toggles, persistence, and disabled behavior missing |
| Arcana | 10 | ACH-030, ACH-049, ACH-053, ACH-078, ACH-099, ACH-100, ACH-113, ACH-123, ACH-145, ACH-147 | `research/data-arcana.md`, `research/arcana-gap-map.md` | Fortune Teller UI, 2 automatic/default secondary rows, effects, and start-of-run selection still need direct proof |
| Town / meta buildings | 3 | ACH-004, ACH-008, ACH-011 | `research/data-town.md`, `research/town-gap-map.md`, `research/ui-screens.md` | Inn, Power-Up Shop, Relic Museum, Town Hall checklist details, costs, unlock order, and persistence missing |

## Achievement Rows

| ID | Achievement | Official Public Description | Global % |
| --- | --- | --- | --- |
| ACH-001 | Combo Stack | Found these Pancakes in the Tutorial. | 99.8% |
| ACH-002 | Antonio | Rescued Antonio in the average Italian countryside. | 99.4% |
| ACH-003 | Gem Hammer | Find the Gem Hammer Relic. | 97.1% |
| ACH-004 | The Inn | Crawler Selection Unlocked. | 94.6% |
| ACH-005 | Empty Tome | Collect 2 Mana Orbs. | 94.1% |
| ACH-006 | Hollow Heart | Reach Level 10. | 93.7% |
| ACH-007 | Unlock Inlaid Library | Reach Level 10 in Mad Forest. | 93.7% |
| ACH-008 | Power Ups Shop | Collect 250 coins. | 93.4% |
| ACH-009 | Return Gem | Play lots of cards. | 88.9% |
| ACH-010 | Duplicator | Play Magic Wand cards lots of times. | 87.7% |
| ACH-011 | Relic Museum | Play two dungeons. | 87.5% |
| ACH-012 | Crown | Reach Level 15. | 86.0% |
| ACH-013 | Guiding Light | Find the Guiding Light Relic. | 85.5% |
| ACH-014 | Fire Wand | Destroy 20 light sources. | 85.4% |
| ACH-015 | Unlock Teeny Bridge | Reach Level 15 in Inlaid Library. | 83.3% |
| ACH-016 | Discover Holy Wand | Evolve Magic Wand. | 83.0% |
| ACH-017 | Garlic | Pick up 5 Floor Chickens. | 82.1% |
| ACH-018 | Red Trigger Gem | Play lots of red cards. | 81.9% |
| ACH-019 | Bracer | Play King Bible cards 99 times. | 81.8% |
| ACH-020 | Copy Gem | Play lots and lots of cards. | 80.8% |
| ACH-021 | Stone Mask | Find and play a Stone Mask. | 79.9% |
| ACH-022 | Gennaro | Defeat the Mantichana in Mad Forest. | 79.6% |
| ACH-023 | Unlock Furious Forest | Complete Mad Forest. | 79.5% |
| ACH-024 | Leader Gem | Deal lots and lots and lots of damage. | 79.4% |
| ACH-025 | Nduja Gem | Defeat Nesufritto. | 78.4% |
| ACH-026 | Mug Gem | Collect lots of coins. | 77.9% |
| ACH-027 | Yellow Trigger Gem | Play lots of yellow cards. | 77.4% |
| ACH-028 | Clover | Find and play Little Clover cards. | 77.3% |
| ACH-029 | Easy Combo Gem | Reach 5 Combo or above. | 76.9% |
| ACH-030 | Sharp Mind | Play lots of purple cards. | 76.4% |
| ACH-031 | Candelabrador | Play 3 Santa Water cards. | 76.3% |
| ACH-032 | Peachone | Reach Level 25. | 76.0% |
| ACH-033 | Unlock Library West Wing | Complete Inlaid Library. | 75.4% |
| ACH-034 | Retain Gem | Have 7 cards in a Hand. | 75.2% |
| ACH-035 | Attractorb | Find and play Vacuum cards. | 73.9% |
| ACH-036 | Dommario | Collect lots and lots of coins. | 73.4% |
| ACH-037 | Armor Strike Gem | Gain lots of Armor in a turn. | 73.4% |
| ACH-038 | Discover Hellfire | Evolve Fire Wand. | 73.3% |
| ACH-039 | Polentír | Find the Polentír Relic. | 73.2% |
| ACH-040 | Refund Gem | Gain lots of Mana in a turn. | 72.9% |
| ACH-041 | Poe | Play Garlic cards lots of times. | 72.5% |
| ACH-042 | Magnetic Gem | Play lots and lots and lots of cards. | 72.5% |
| ACH-043 | Midas Gem | Collect lots and lots and lots of coins. | 72.1% |
| ACH-044 | Blue Trigger Gem | Play lots of blue cards. | 72.0% |
| ACH-045 | Recycle Gem | Have 8 cards in a Hand. | 71.0% |
| ACH-046 | Stardust Anvil | Find the Stardust Anvil Relic. | 70.3% |
| ACH-047 | Rainbow Gem | Activate lots of Crawler trigger abilities. | 70.1% |
| ACH-048 | Growth Gem | Play Crown cards. | 69.2% |
| ACH-049 | Over The Top | Play lots of Crawler cards. | 68.9% |
| ACH-050 | Purple Trigger Gem | Play lots and lots of purple cards. | 68.5% |
| ACH-051 | Mana Rebate Gem | Gain lots and lots and lots of Mana in a turn. | 67.7% |
| ACH-052 | Mana Cost Gems | Collect lots of Mana Orbs. | 67.7% |
| ACH-053 | Mana Syphon | Gain lots and lots of Mana in a turn. | 67.5% |
| ACH-054 | Ebony Wings | Play Peachone card once. | 67.4% |
| ACH-055 | Grim Grimoire | Find the Grim Grimoire Relic. | 66.9% |
| ACH-056 | Lightning Ring | Defeat many enemies. | 66.5% |
| ACH-057 | Echo Gem | Play lots and lots and lots and lots of cards. | 66.0% |
| ACH-058 | Cross | Find and play a Rosary card. | 65.3% |
| ACH-059 | Berserk Wood | Complete Furious Forest. | 65.2% |
| ACH-060 | Countdown Gem | Play lots of Empty Tome cards. | 65.1% |
| ACH-061 | Reverse Combo Gem | Reach a high Combo. | 64.2% |
| ACH-062 | Overkill | Find the Overkill Relic. | 64.0% |
| ACH-063 | Discover Thousand Edge | Evolve Knife. | 63.9% |
| ACH-064 | Discover La Borra | Evolve Santa Water. | 63.4% |
| ACH-065 | Discover Death Spiral | Evolve Axe. | 63.2% |
| ACH-066 | Clock Lancet | Find and play an Orologion card. | 63.2% |
| ACH-067 | Triple Damage Gem | Deal lots of damage. | 63.2% |
| ACH-068 | Luck Gem | Play Clover cards. | 62.0% |
| ACH-069 | Pasqualina | Reach Level 20 with Imelda Belpaese in Inlaid Library. | 61.4% |
| ACH-070 | Unlock Dairy Plant | Complete Teeny Bridge. | 61.0% |
| ACH-071 | Duration Gem | Play Spellbinder cards. | 60.2% |
| ACH-072 | Pummarola | Reach Level 10 with Gennaro Belpaese. | 60.1% |
| ACH-073 | Decimate Gem | Deal lots and lots of damage. | 59.2% |
| ACH-074 | Pugnala | Find the Coffin in Berserk Wood. | 59.1% |
| ACH-075 | Cavallo | Defeat many Lion Heads. | 59.0% |
| ACH-076 | Unlock Library Sanctum | Complete Library West Wing. | 58.7% |
| ACH-077 | Arca | Play Fire Wand cards lots of times. | 56.2% |
| ACH-078 | Your Shield My Liege | Gain 2,000 Armor. | 55.2% |
| ACH-079 | Pentagram | Reach Level 35. | 54.5% |
| ACH-080 | Yin Yang Gem | Complete Berserk Wood | 54.3% |
| ACH-081 | Discover Thunder Loop | Evolve Lightning Ring. | 54.2% |
| ACH-082 | Ramba | Defeat the Milk Elemental. | 54.1% |
| ACH-083 | Restore Health Gem | Play lots of Pummarola cards. | 53.4% |
| ACH-084 | Remote Gem | Destroy lots and lots of Mine Carts. | 53.4% |
| ACH-085 | Carréllo | Destroy lots of Mine Carts. | 53.3% |
| ACH-086 | Randomazzo | Find the Randomazzo Relic. | 53.2% |
| ACH-087 | Freeze Gem | Play Clock Lancet card. | 53.1% |
| ACH-088 | Bomba Infernale | Find the Bomba Infernale Relic. | 52.9% |
| ACH-089 | Unlock Weeny Bridge | Reach Level 15 in Dairy Plant. | 52.8% |
| ACH-090 | Spellbinder | Play Runetracer cards 10 times. | 52.7% |
| ACH-091 | Runetracer | Reach a high Level with Pasqualina Belpaese. | 52.3% |
| ACH-092 | Friendship Amulet | Reach a very high Combo. | 52.2% |
| ACH-093 | Discover Unholy Vespers | Evolve King Bible. | 52.1% |
| ACH-094 | Giovanna | Find the Coffin in the Library Sanctum. | 52.0% |
| ACH-095 | Discover Bloody Tear | Evolve Whip. | 51.4% |
| ACH-096 | Discover NO FUTURE | Evolve Runetracer. | 50.3% |
| ACH-097 | Greed Gem | Play Stone Mask cards 10 times. | 50.0% |
| ACH-098 | Unlock Milk Factory | Complete Dairy Plant. | 49.8% |
| ACH-099 | And Another | Play lots of Free-to-Play cards. | 49.2% |
| ACH-100 | Make a Scene | Activate lots and lots of Crawler trigger abilities. | 48.3% |
| ACH-101 | Discover Soul Eater | Evolve Garlic. | 47.8% |
| ACH-102 | Clerici | Recover lots and lots of HP. | 47.8% |
| ACH-103 | Quick Draw Gem | Reach 30 Deck size. | 47.8% |
| ACH-104 | Wild Gem | Play lots and lots of Wild cards. | 47.5% |
| ACH-105 | Mana Cost Gems 2 | Collect lots and lots of Mana Orbs. | 47.3% |
| ACH-106 | Eight The Sparrow | Reach a high Level with Pugnala Provola. | 47.1% |
| ACH-107 | Crawler Caller Gem | Complete Library Sanctum. | 47.1% |
| ACH-108 | Discover Vandalier | Unite Peachone and Ebony Wings. | 45.6% |
| ACH-109 | Phiera Der Tuphello | Reach a very high Level with Pugnala Provola. | 44.8% |
| ACH-110 | Wings | Reach Level 40. | 44.8% |
| ACH-111 | Discover Heaven Sword | Evolve Cross. | 42.0% |
| ACH-112 | Krochi | Defeat many, many enemies. | 41.6% |
| ACH-113 | Jester's Hat | Play lots of Wild cards. | 41.6% |
| ACH-114 | Destroy Gem | Play lots of cards picked up from light sources. | 41.6% |
| ACH-115 | Free To Play Gem | Play lots and lots of Free-to-Play cards. | 40.7% |
| ACH-116 | Poppea | Find the Coffin in Milk Factory. | 40.6% |
| ACH-117 | Unlock Gallo Tower | Complete Weeny Bridge. | 40.5% |
| ACH-118 | Unlock Curd Refinery | Complete Milk Factory. | 40.1% |
| ACH-119 | Drain Gem | Heal lots of HP. | 38.8% |
| ACH-120 | Coin Card Gem | Find and play lots of Big Coin Bag cards. | 37.7% |
| ACH-121 | Cherry Bomb | Reach Level 15 with Yatta Cavallo. | 35.7% |
| ACH-122 | O'Sole | Defeat many Dragon Shrimps. | 35.2% |
| ACH-123 | Chain Link | Reach 12 Combo or above. | 35.1% |
| ACH-124 | Bombard Gem | Play lots of Cherry Bomb cards. | 35.1% |
| ACH-125 | Parm Aegis | Reach a very very high Combo. | 35.0% |
| ACH-126 | Lapidary Loupe | Find the Lapidary Loupe Relic. | 34.9% |
| ACH-127 | Concetta | Find the Coffin in Gallo Tower. | 34.8% |
| ACH-128 | Christine | Find and play the Pentagram card. | 33.5% |
| ACH-129 | Unlock Meany Bridge | Defeat the Giant Enemy Crab in Gallo Tower. | 33.1% |
| ACH-130 | Ultimate Ultra Overkill | Find the Ultimate Ultra Overkill Relic. | 32.0% |
| ACH-131 | Bracelet | Reach a very very very high Combo. | 31.9% |
| ACH-132 | Mortaccio | Defeat many Skeletons. | 31.6% |
| ACH-133 | Gatti Amari | Reach a high Level with Giovanna Grana. | 31.4% |
| ACH-134 | Sorceress' Tears | Find the Sorceress' Tears Relic. | 31.4% |
| ACH-135 | Fireproof Gem | Complete Curd Refinery. | 31.2% |
| ACH-136 | Gallo | Defeat Gallo. | 30.8% |
| ACH-137 | Coin Count Gem | Collect a vast fortune of coins. | 28.3% |
| ACH-138 | Unlock Cappella Magna | Complete Meany Bridge. | 27.5% |
| ACH-139 | Porta | Play lots of Lightning Ring cards. | 27.4% |
| ACH-140 | Kill Count Gem | Defeat many, many, many enemies. | 25.9% |
| ACH-141 | Lama | Complete a dungeon with 10% Curse or more. | 25.1% |
| ACH-142 | Magic Hat Gem | Play lots of Peachone cards. | 24.0% |
| ACH-143 | Discover Vicious Hunger | Evolve Gatti Amari. | 23.9% |
| ACH-144 | Tirajisú | Reach Level 20 with Krochi Freetto. | 23.7% |
| ACH-145 | Swollen Fist | Reach 40 Deck size. | 23.3% |
| ACH-146 | Unlock Cappella Ultima | Complete Cappella Magna. | 22.6% |
| ACH-147 | Wild Buff | Play lots and lots of cards picked up from light sources. | 22.6% |
| ACH-148 | Bone | Reach a high Level with Mortaccio. | 22.3% |
| ACH-149 | Uncrackable Gem | Defeat The Trickster. | 20.6% |
| ACH-150 | Song of Mana | Reach a high Level with Poppea Pecorina. | 20.5% |
| ACH-151 | Calcium Gem | Play lots of Bone cards. | 20.0% |
| ACH-152 | Shadow Pinion | Reach Level 15 with Concetta Caciotta. | 17.8% |
| ACH-153 | Ovenkilt | Find the Ovenkilt Relic. | 16.2% |
| ACH-154 | Discover Phieraggi | Unite Eight The Sparrow and Phiera Der Tuphello. | 15.3% |
| ACH-155 | Discover Gorgeous Moon | Evolve Pentagram. | 15.3% |
| ACH-156 | Celestial Dusting | Reach a high Level with O'Sole Meeo. | 15.0% |
| ACH-157 | Skull O'Maniac | Reach Level 30 with Lama Ladonna. | 14.0% |
| ACH-158 | Discover Valkyrie Turner | Evolve Shadow Pinion. | 13.7% |
| ACH-159 | Mana X Damage Gem | Play lots and lots and lots of purple cards. | 12.7% |
| ACH-160 | Mild Gem | Complete Gallo Tower with Gallo. | 11.7% |
| ACH-161 | Discover Mannajja | Evolve Song of Mana. | 9.3% |

## Required Completion

- Map each achievement to the in-game Town Hall/checklist row or unlock popup.
- Record whether each achievement unlocks a card, gem, stage, crawler, relic, building, arcana, evolution, or only an external platform badge.
- Link every row to the relevant static data table and current implementation gap.
- Keep `research/achievement-gap-map.md` synchronized as the per-achievement current implementation parity table.
- Verify at least one direct or full-resolution gameplay route for each major unlock category.
