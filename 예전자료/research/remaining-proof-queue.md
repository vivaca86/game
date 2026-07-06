# Remaining Proof Queue

Status: `updated 2026-05-22 / non-play handoff / full-app direct verification removed / completion not proven`

This document is the current compact queue after the user removed full app `3265700` direct verification from active requirements. Older direct-play rows in historical files are not the active next action unless the user explicitly restores them.

## Current Directive

| Directive | Current State |
| --- | --- |
| Direct gameplay | Do not directly play, launch-control, or continue manipulating demo/full runtime |
| Full app `3265700` direct verification | Removed from active requirements; do not keep asking for it as a blocker |
| Demo direct-play checklist | Historical/demo-scoped only; not active work |
| Broad public-source research | Stop unless a genuinely new official/source delta appears |
| Next useful work | Evidence-aware implementation scaffolding, schema/import, conflict-safe seed data, and safety tests |

## Current GitHub Handoff Artifacts

| Artifact | Use |
| --- | --- |
| [`source-only-closeout.md`](./source-only-closeout.md) | Current closeout and stop rule after removing active full-app direct verification |
| [`non-play-continuation-checkpoint.md`](./non-play-continuation-checkpoint.md) | Latest user directive and non-play work order |
| [`development-readiness-boundary.md`](./development-readiness-boundary.md) | What can be built now and what must not be claimed/hardcoded |
| [`evidence-aware-schema-plan.md`](./evidence-aware-schema-plan.md) | Schema/import/seed plan for preserving evidence grades, aliases, conflicts, and uncertainty |
| [`source-conflict-implementation-risk-triage.md`](./source-conflict-implementation-risk-triage.md) | Highest-risk unresolved source conflicts for development planning |
| [`source-conflicts.md`](./source-conflicts.md) | Full conflict list |
| Domain direct-capture matrices | Historical packet plans; useful if proof is later available, but not active gameplay tasks now |

## What Is Done Enough For Handoff

| Area | State |
| --- | --- |
| Source-only collection and reconciliation | Covered by crawl/reconciliation docs and source-only closeout |
| Domain packet planning | Matrices exist for enemies, cards, gems, characters/Inn, stages/routes, town/meta, events, achievements/Town Hall, and balance |
| Risk triage | Highest implementation-risk conflicts have a compact triage document |
| Development boundary | Evidence-aware schema and guardrails are documented |
| Usage policy | Broad recrawling and direct gameplay are stopped to preserve development budget |

## What Remains Open

These remain open, but they are not reasons to continue broad public-source investigation:

| Item | Current Handling |
| --- | --- |
| UI text finalization | Needs UI evidence, approved game-file/localization proof, or later implementation choice; public-source guesses should not be expanded |
| Balance measurement | Needs runtime/tuning work later; not solvable by source crawling |
| Original-identical implementation | Requires development/testing; current parity remains `0` |
| Source conflicts | Preserve as aliases/conflict flags in schema/seed data until stronger proof or explicit design choice exists |
| Game-file proof | Optional future track only if files are explicitly provided/approved; do not launch the game |

## Next Action

Start development from [`evidence-aware-schema-plan.md`](./evidence-aware-schema-plan.md):

1. Implement source-level schema/import scaffolding.
2. Seed only low-risk source and conflict rows first.
3. Preserve `evidence_grade`, `verification_status`, `conflict_ids`, aliases, and proof-task blockers.
4. Add tests that prevent source-only rows from being presented as original parity.
5. Keep formulas, costs, thresholds, balance, and final display strings nullable/configurable until future proof exists.

## Completion Boundary

Do not use these claims yet:

- `complete research`
- `full data collected`
- `95% identical`
- `same as original`
- `original parity achieved`

Allowed status language:

- `source-level collected`
- `source-level schema ready`
- `implementation scaffold ready`
- `conflict-preserving seed data`
- `game-file proof optional/future`
- `implementation parity 0`

Do not mark original-parity reconstruction complete from this queue.
