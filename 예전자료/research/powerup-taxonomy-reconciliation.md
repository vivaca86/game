# Power-Up Taxonomy Reconciliation

Status: `generated 2026-05-22 / source-level Power-Up Shop taxonomy reconciliation`

This artifact reconciles the 13 Destructoid rankable Power-Up rows, the 6 Destructoid run-found/not-yet-rankable rows, the selected PC Gamer cost/stat hints, and the 19 official-wiki Power-Up value rows. It does not prove the shipped Power-Up Shop UI, final labels, current costs, rank caps, refund/respec rules, run-reward classification, or persistence. Treat it as a capture queue for Power-Up Shop UI, run reward UI, save data, and game-file proof.

Primary inputs:

- `research/powerup-destructoid-tier-crawl.md`
- `research/pcgamer-upgrade-priority-crawl.md`
- `research/official-wiki-enemy-event-powerup-value-extract.md`
- `research/data-town.md`
- `research/source-conflicts.md` CON-027, CON-038, and CON-039
- Sources: SRC-120, SRC-135, SRC-136, SRC-142, SRC-148, SRC-202

## Reconciliation Snapshot

| Segment | Rows | Notes |
| --- | ---: | --- |
| Destructoid rankable Power-Up rows | 13 | S/A/B tier rows described as rankable |
| Destructoid run-found / not-yet-rankable rows | 6 | Rows the author encountered during runs but did not find as coin-rank options |
| Official-wiki Power-Up infobox rows | 19 | Rows with id, cost, max level, bonus, max effect, and unlock fields where present |
| Direct Destructoid-to-wiki page/name matches | 19 | Page/name-level only; not shop UI or runtime parity |
| Destructoid run-found rows with official-wiki cost/rank fields | 6 | Banish, Curse, Hand, Magnet, Mana/Cooldown, and Revival |
| PC Gamer selected rows cross-checked | 5 | Recovery, Reroll, Duration, Might, and Luck; not a full table |
| Implementation parity closed by this file | 0 | Direct UI, game files, or runtime proof still required |

## Working Interpretation

The current source-level split is a classification conflict, not a simple roster mismatch:

- Destructoid and the official wiki line up to 19 Power-Up page/name rows at source level.
- Destructoid marks 13 rows as rankable and separates 6 rows as run-found or not-yet-rankable.
- The official wiki assigns cost and max-level fields to all 19 rows, including the 6 Destructoid run-found rows.
- PC Gamer supplies selected early-shop hints only. Recovery agrees with the official wiki at 500 coins, while Reroll conflicts at 250 vs official-wiki 200 and Might/Luck conflict at 20% vs official-wiki +25%.
- The `Mana` row remains a label conflict: Destructoid and the official-wiki page name use `Mana`, while the official-wiki infobox name and id expose `Cooldown` / `PowerUp_Cooldown`.

Do not implement all 19 rows as permanent shop rows yet. The shipped UI or game files must prove whether the six Destructoid run-found rows are locked permanent upgrades, separate run rewards, or another upgrade class.

## Official-Wiki Unlock Buckets

| Unlock Bucket | Rows | Notes |
| --- | ---: | --- |
| Accessing Power Ups shop | 9 | Area, Armor, Duration, Growth, Luck, Max Health, Might, Recovery, Reroll |
| Complete Weeny Bridge | 5 | Banish, Curse, Hand, Magnet, Revival |
| Complete Meany Bridge | 3 | Amount, Crawler Slot, Mana/Cooldown |
| Complete Inlaid Library | 1 | Greed |
| Blank unlock field | 1 | Skip |

These buckets are official-wiki source-level values only. They should drive fresh-save/progressed-save capture planning, not final unlock implementation.

## Row-Level Reconciliation

| Row | Destructoid Class | Official-Wiki Page / Infobox | ID | Max Level | Bonus | Max Effect | Cost | Unlock Field | Reconciliation Note |
| --- | --- | --- | --- | ---: | --- | --- | ---: | --- | --- |
| Amount | Rankable A-tier | Amount / Amount | PowerUp_Amount | 3 | +1 | +3 | 1250 | Complete Meany Bridge | Destructoid rankable; official wiki says Meany Bridge unlock |
| Area | Rankable B-tier | Area / Area | PowerUp_Area | 5 | +10% | +50% | 850 | Accessing Power Ups shop | Destructoid 10% hint matches official-wiki bonus size |
| Armor | Rankable A-tier | Armor (stat) / Armor | PowerUp_Armor | 3 | +2 | +6 | 1250 | Accessing Power Ups shop | Destructoid +2 hint matches official-wiki bonus size |
| Banish | Run-found / not-yet-rankable | Banish / Banish | PowerUp_Banish | 5 | +2 | +10 | 300 | Complete Weeny Bridge | Classification conflict: wiki has cost/rank values, Destructoid did not find coin-rank option |
| Crawler Slot | Rankable S-tier | Crawler Slot / Crawler Slot | PowerUp_CharacterSlot | 2 | +1 | +2 | 3500 | Complete Meany Bridge | Destructoid extra-Crawler hint matches official-wiki bonus direction |
| Curse | Run-found / not-yet-rankable | Curse / Curse | PowerUp_Curse | 5 | +20% | +100% | 350 | Complete Weeny Bridge | Classification conflict: wiki has cost/rank values, Destructoid did not find coin-rank option |
| Duration | Rankable B-tier / PC Gamer selected | Duration / Duration | PowerUp_Duration | 5 | +1 | +5 | 250 | Accessing Power Ups shop | PC Gamer says useful cheap early ranks but gives no exact cost |
| Greed | Rankable A-tier / PGG priority | Greed / Greed | PowerUp_Greed | 4 | +25% | +100% | 1000 | Complete Inlaid Library | PGG priority aligns with economy role; UI still needed |
| Growth | Rankable A-tier | Growth / Growth | PowerUp_Growth | 5 | +20% | +100% | 750 | Accessing Power Ups shop | Source-level match; exact XP formula still unproven |
| Hand | Run-found / not-yet-rankable | Hand / Hand | PowerUp_Speed | 2 | +1 | +2 | 2500 | Complete Weeny Bridge | Classification conflict and id-label mismatch candidate: wiki id uses `Speed` |
| Luck | Rankable S-tier / PC Gamer selected | Luck / Luck | PowerUp_Luck | 3 | +25% | +75% | 400 | Accessing Power Ups shop | PC Gamer says 20%; official wiki says +25%; direct UI/game-file proof required |
| Magnet | Run-found / not-yet-rankable | Magnet / Magnet | PowerUp_Magnet | 1 | +1 | +1 | 2000 | Complete Weeny Bridge | Classification conflict: wiki has cost/rank values, Destructoid did not find coin-rank option |
| Mana / Cooldown | Run-found / not-yet-rankable | Mana / Cooldown | PowerUp_Cooldown | 2 | +1 | +2 | 3500 | Complete Meany Bridge | Label conflict: page/secondary `Mana` vs infobox/id `Cooldown` |
| Max Health | Rankable B-tier | Max Health / Max Health | PowerUp_MaxHealth | 5 | +10% | +50% | 450 | Accessing Power Ups shop | Source-level match; healing/cap interaction still unproven |
| Might | Rankable A-tier / PC Gamer selected | Might / Might | PowerUp_Might | 5 | +25% | +125% | 500 | Accessing Power Ups shop | PC Gamer says 20%; official wiki says +25%; direct UI/game-file proof required |
| Recovery | Rankable S-tier / PC Gamer selected | Recovery / Recovery | PowerUp_Recovery | 3 | +1 | +3 | 500 | Accessing Power Ups shop | PC Gamer 500-coin hint matches official-wiki cost |
| Reroll | Rankable A-tier / PC Gamer selected | Reroll / Reroll | PowerUp_Reroll | 5 | +2 | +10 | 200 | Accessing Power Ups shop | Cost conflict: PC Gamer 250 vs official-wiki 200 |
| Revival | Run-found / not-yet-rankable | Revival / Revival | PowerUp_Revival | 1 | +1 | +1 | 4000 | Complete Weeny Bridge | Classification conflict: wiki has cost/rank values, Destructoid did not find coin-rank option |
| Skip | Rankable B-tier | Skip / Skip | PowerUp_Skip | 5 | +2 | +10 | 250 | blank | Official-wiki unlock field is blank; UI/game-file proof required |

## PC Gamer Conflict Queue

| Row | PC Gamer Claim | Official-Wiki Value | Current Treatment |
| --- | --- | --- | --- |
| Recovery | First rank costs 500 coins and restores 1 HP after each encounter | Cost 500, bonus +1, max +3 | Source-level agreement, still needs shop UI and runtime timing |
| Reroll | First rank costs 250 coins | Cost 200, bonus +2, max +10 | Source conflict; do not finalize until UI/game files |
| Might | First rank is a 20% stat increase | Bonus +25%, max +125% | Source conflict; do not finalize until UI/game files |
| Luck | First rank is a 20% stat increase | Bonus +25%, max +75% | Source conflict; do not finalize until UI/game files |
| Refund control | Shop has a refund button | No refund/respec row in value extract | UI-only claim; capture rules, cost return, and persistence |

## Direct Proof Queue

- Capture fresh-save and progressed Power-Up Shop UI, including row labels, lock state, prices, rank counters, max-rank state, buy button state, and currency.
- Capture the shop after `Weeny Bridge`, `Meany Bridge`, and `Inlaid Library` unlock gates to verify the official-wiki unlock buckets.
- Capture run reward screens where Banish, Curse, Hand, Magnet, Mana/Cooldown, and Revival appear, then classify them separately from permanent upgrades.
- Confirm whether the displayed label is `Mana`, `Cooldown`, or context-dependent.
- Buy or preview Recovery, Reroll, Might, Luck, Crawler Slot, and Skip to resolve cost/stat/rank conflicts and party-slot behavior.
- Capture any refund/respec control, including unavailable state, refund value, reset scope, and save persistence.
