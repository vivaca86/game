# Destructoid Power-Up Tier Page Crawl

Status: `generated 2026-05-22 / source-level power-up taxonomy crawl`

Source URL: https://www.destructoid.com/vampire-crawlers-power-ups-tier-list/

This file stores the extracted Destructoid Power Ups tier page as a generated source-level artifact. It does not prove the exact in-game Power-Up Shop UI, costs, rank caps, unlock order, refund/respec behavior, persistence, or whether the run-found rows can appear in another permanent upgrade surface.

## Crawl Notes

| Check | Result |
| --- | --- |
| Page fetched | 2026-05-22 |
| Page title | `Vampire Crawlers Power Ups tier list: Best ones to use` |
| Author / timestamp shown | `Arka Sarkar` / `Apr 23, 2026 2:48 pm` |
| Visible rankable tier sections | `S-tier`, `A-tier`, `B-tier` |
| Rankable Power-Up rows extracted | 13 |
| Run-found / not-yet-rankable rows extracted | 6 |
| Cost table present | No |
| Exact rank caps present | No |
| Full UI labels / prices present | No |

## Boundary Notes

- Destructoid separates Power Ups "that can be ranked up" from six Power Ups the author reports encountering during runs without finding a coin-rank option.
- The page says upgrade cost was not considered for its tiering, so this crawl cannot fill the shop cost curve.
- Only four rows have explicit per-rank mechanical hints in this page: `Crawler Slot`, `Armor`, `Amount`, and `Area`.
- `Mana` is listed in the run-found/not-yet-rankable group, even though the guide recommends prioritizing it when it appears during a run.
- This crawl is E1 source-level evidence only. Power-Up Shop UI, run reward UI, save data, or game files must resolve the final row classes.

## Extracted Rankable Rows

| Crawl ID | Destructoid Tier | Power Up | Source-Level Hint | Missing Before Implementation |
| --- | --- | --- | --- | --- |
| DES-PUP001 | S | Crawler Slot | Adds an extra Crawler per rank; useful after more Crawlers are unlocked | Exact shop row, price curve, cap, party-slot persistence |
| DES-PUP002 | S | Luck | Improves odds for stronger gems, rarer weapon cards, and other reward quality | Exact percentage, rarity pool math, affected reward screens |
| DES-PUP003 | S | Recovery | Restores health after encounters | Exact amount per rank, timing, cap/overheal rules |
| DES-PUP004 | A | Armor | Adds 2 Armor per rank | Whether armor is starting armor, per encounter, or another timing boundary |
| DES-PUP005 | A | Greed | Increases coin earnings | Exact percentage, affected sources, rounding |
| DES-PUP006 | A | Might | Universal damage buff for applicable cards | Exact percentage per rank and card eligibility |
| DES-PUP007 | A | Growth | Improves XP gain and level speed | Exact XP formula and affected XP sources |
| DES-PUP008 | A | Amount | Adds one projectile per rank for projectile-based cards | Eligible cards, cap, interaction with card/gem effects |
| DES-PUP009 | A | Reroll | Gives additional chances to reroll disliked options | Exact reroll count, screen coverage, cost/refill behavior |
| DES-PUP010 | B | Area | Destructoid describes a 10% per-rank area/splash-style benefit | Exact stat label, affected cards, formula |
| DES-PUP011 | B | Duration | Extends Duration Crawlers or duration-based effects | Exact targets, unit, and persistence |
| DES-PUP012 | B | Skip | Lets the player skip choices for XP | Exact screens, XP amount, and rank scaling |
| DES-PUP013 | B | Max Health | Raises HP cap for some Crawler builds | Exact amount, healing interaction, character-specific value |

## Extracted Run-Found / Not-Yet-Rankable Rows

| Crawl ID | Power Up | Source-Level Hint | Missing Before Implementation |
| --- | --- | --- | --- |
| DES-PUP014 | Banish | Encountered during runs; no coin-rank option found by the author | Determine if run reward, shop row, relic/card effect, or hidden permanent row |
| DES-PUP015 | Curse | Encountered during runs; no coin-rank option found by the author | Determine final class, scaling, unlock, and persistence |
| DES-PUP016 | Hand | Encountered during runs; no coin-rank option found by the author | Determine final class, stat meaning, and runtime effect |
| DES-PUP017 | Magnet | Encountered during runs; no coin-rank option found by the author | Determine final class, pickup/range behavior, and scaling |
| DES-PUP018 | Mana | Encountered during runs; no coin-rank option found by the author; recommended as a priority run pick | Determine whether it can ever be permanent, and exact mana/energy effect |
| DES-PUP019 | Revival | Encountered during runs; no coin-rank option found by the author | Determine final class, death timing, limits, and persistence |

## Required Follow-Up

- Capture Power-Up Shop UI with all rows, prices, ranks, caps, locked/unlocked state, and buy/refund/respec behavior.
- Capture run reward screens where Banish, Curse, Hand, Magnet, Mana, and Revival appear, then classify them separately from permanent shop rows.
- Verify Crawler Slot party-size behavior before and after purchase, including save persistence.
- Verify exact formulas for Luck, Recovery, Armor, Greed, Might, Growth, Amount, Reroll, Area, Duration, Skip, and Max Health from UI/game files or repeatable direct play.
