# Development Readiness Boundary

Status: `generated 2026-05-22 / non-play continuation / full-app direct verification removed / development-preserving summary`

This file translates the current research state into a compact development boundary. It is meant to save future usage: do not reread every research artifact just to decide whether implementation can start.

Related implementation scaffold:

- [`evidence-aware-schema-plan.md`](./evidence-aware-schema-plan.md): structured data model, import order, status values, and safety tests for source-level implementation work.
- [`non-play-continuation-checkpoint.md`](./non-play-continuation-checkpoint.md): latest user directive removing direct gameplay and full app `3265700` direct verification from active requirements.

## What Is Safe To Build Now

These are safe only as infrastructure or clearly marked approximations:

| Area | Safe Work | Required Label |
| --- | --- | --- |
| Data model | Tables/entities for cards, gems, characters, stages, relics, Arcana, enemies, events, achievements, Power-Ups, evidence sources, aliases, and conflict status | `source-level schema` |
| Import tooling | Parsers/loaders for existing `data-*`, `*-taxonomy-reconciliation.md`, and crawl outputs | `research import` |
| UI scaffolding | Empty or placeholder catalog screens, filters, evidence badges, conflict badges, and developer-only audit views | `placeholder / not original parity` |
| Rule engine scaffolding | Configurable hooks for Combo, Wild, gem sockets, evolutions, rewards, unlocks, and save mutation | `unverified rule shell` |
| Test harness | Tests that assert evidence labels, conflict preservation, schema integrity, and no hardcoded final counts | `research safety tests` |

## What Should Not Be Claimed Or Hardcoded Yet

| Area | Do Not Finalize Because |
| --- | --- |
| Exact card/gem/character/stage/relic/Arcana/enemy/event totals | Source layers disagree or represent different row categories |
| Final display names/effects/costs/unlock thresholds | Many rows need UI/game-file proof or have source conflicts |
| Combo/TurboTurn/Wild formulas | Official text is high-level; runtime caps and reset/failure cases remain unresolved |
| Save/demo/cloud/cross-save behavior | Official notes exist, but current runtime/game-file proof is missing |
| Balance timings/economy pressure/failure pacing | No current measured run data exists |
| Full original parity | Current parity remains `0` until future proof and implementation tests close row-level gates |

## Minimum Implementation Guardrails

1. Every imported row should carry `evidence_grade`, `source_refs`, `conflict_ids`, and `verification_status`.
2. All public-facing original-parity labels should be disabled unless the row has direct UI/game-file/runtime proof.
3. Use aliases rather than choosing final names for disputed rows such as `X Mana`, `Mana X Damage Gem`, `Combo Stack/Stash`, `Cappella/Capella`, `Mana/Cooldown`, and `Uncrackable/Unbreakable Gem`.
4. Keep category layers separate: unlock achievement, catalog membership, wiki infobox row, guide row, character/Crawler card, run-found reward, shop purchase, hidden/unavailable row.
5. Prefer data-driven configuration over hardcoded constants for counts, costs, caps, thresholds, and rewards.
6. Do not treat full app `3265700` direct verification as a required blocker; it has been removed from active requirements.

## Next Useful Work Without Playing

If continuing without direct gameplay, the next useful step is not another broad crawl. Use one of these narrow tracks:

| Priority | Track | Output |
| ---: | --- | --- |
| 1 | Implementation schema | Start actual schema/migration implementation from [`evidence-aware-schema-plan.md`](./evidence-aware-schema-plan.md) |
| 2 | Conflict-safe seed data | Create seed rows that preserve aliases/conflict IDs and avoid final parity claims |
| 3 | Game-file proof, only if explicitly approved/provided | Extract localization/data rows and map them to conflicts without launching the game |
| 4 | Delta-only official source check | Add a short note only if Steam/official wiki/SteamDB changed since the last check |

## Stop Rule

Do not spend more research usage trying to prove runtime behavior from public text. If no new source or game-file proof is available, move to evidence-aware implementation scaffolding rather than recrawling the same public sources.
