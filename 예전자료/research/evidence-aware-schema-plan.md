# Evidence-Aware Schema Plan

Status: `generated 2026-05-22 / non-play continuation / implementation scaffold only`

This plan turns the current research boundary into implementation-facing data structures. It is deliberately evidence-aware: rows can be imported and displayed without claiming original parity.

## Scope

Use this for schema, seed-data, import, and audit tooling. Do not use it to finalize gameplay formulas, catalog totals, costs, unlock thresholds, save behavior, or balance.

Inputs already available in GitHub research:

| Input Type | Example Files | Use |
| --- | --- | --- |
| Source rows | `data-*`, crawl outputs, official Steam/news/wiki extracts | Candidate records and claims |
| Reconciliation docs | `*-taxonomy-reconciliation.md` | Source-layer grouping and known splits |
| Capture matrices | `*-direct-capture-matrix.md` | Future proof packets and acceptance criteria |
| Conflict docs | `source-conflicts.md`, `source-conflict-implementation-risk-triage.md` | Open conflicts and implementation risk |
| Gate docs | `development-readiness-boundary.md`, `non-play-continuation-checkpoint.md` | Current work limits and stop rules |

## Core Tables

| Table | Purpose | Minimum Fields |
| --- | --- | --- |
| `research_sources` | One row per source artifact or source URL | `id`, `kind`, `title`, `url_or_path`, `fetched_at`, `evidence_grade`, `notes` |
| `claims` | Atomic source claims before reconciliation | `id`, `source_id`, `domain`, `subject_key`, `field`, `value`, `raw_text`, `confidence`, `conflict_ids` |
| `entities` | Canonical-ish implementation candidates without final parity claims | `id`, `domain`, `working_name`, `entity_kind`, `verification_status`, `evidence_grade`, `notes` |
| `entity_aliases` | Preserve spelling/name variants | `entity_id`, `alias`, `source_id`, `language`, `is_preferred_source_level` |
| `entity_claims` | Many-to-many link from entities to claims | `entity_id`, `claim_id`, `mapping_status`, `notes` |
| `conflicts` | Mirror `source-conflicts.md` in structured form | `id`, `topic`, `risk_level`, `blocked_by`, `safe_action`, `resolution_rule` |
| `proof_tasks` | Future direct/game-file proof requirements | `id`, `domain`, `task_ref`, `required_proof`, `status`, `blocks_entities` |
| `implementation_flags` | Guardrails consumed by code/UI | `entity_id`, `flag`, `reason`, `cleared_by_proof_task` |

## Domain-Specific Extension Tables

Keep extension tables sparse. Unknown values should remain `null` plus an evidence flag, not guessed.

| Domain | Extension Table | Fields To Keep Separate |
| --- | --- | --- |
| Cards | `card_details` | `card_category`, `mana_cost`, `color`, `socket_count`, `is_character_card`, `is_evolution_result`, `temporary_or_wild_kind` |
| Gems | `gem_details` | `rarity`, `effect_family`, `socket_target`, `unlock_bucket`, `cost_modifier_kind` |
| Characters | `character_details` | `roster_layer`, `crawler_card_cost`, `inn_purchase_cost`, `starting_deck_ref`, `trigger_color`, `availability_state` |
| Stages | `stage_details` | `biome`, `dungeon_page`, `stage_variant`, `floor`, `is_tutorial`, `unlock_entry_ref` |
| Power-Ups | `powerup_details` | `shop_or_run_found`, `rank_cap`, `cost_curve_ref`, `bonus_kind`, `unlock_bucket` |
| Relics | `relic_details` | `museum_state`, `found_in_alias`, `toggleable`, `effect_family` |
| Arcana | `arcana_details` | `unlock_threshold`, `default_or_unlock_state`, `effect_family`, `equip_limit_ref` |
| Enemies | `enemy_details` | `enemy_kind`, `stage_ref`, `hp_claim`, `intent_claim`, `spawn_trigger`, `reward_ref` |
| Events | `event_details` | `event_kind`, `option_count`, `cost_ref`, `reward_ref`, `repeat_rule`, `invalid_state_rule` |
| Achievements | `achievement_details` | `steam_id`, `townhall_row_ref`, `reward_ref`, `platform_sync_state` |

## Required Status Values

Use controlled values so implementation cannot accidentally present uncertain rows as final.

| Field | Values |
| --- | --- |
| `evidence_grade` | `official_metadata`, `official_media`, `official_text`, `wiki_source`, `guide_source`, `storyboard_candidate`, `demo_direct`, `full_direct`, `game_file`, `unverified` |
| `verification_status` | `source_only`, `media_candidate`, `demo_scoped`, `blocked_direct`, `blocked_game_file`, `verified_game_file`, `verified_full_direct`, `rejected` |
| `blocked_by` | `direct_play_paused`, `full_app_missing`, `game_file_missing`, `source_conflict`, `low_resolution`, `time_sensitive` |
| `mapping_status` | `direct_match`, `alias_match`, `category_match`, `conflicting`, `unmapped`, `rejected` |

## Import Order

1. Import `research_sources` from known crawl/source documents.
2. Import raw `claims` without merging rows.
3. Create `entities` only where reconciliation docs already define a working grouping.
4. Attach aliases before choosing display names.
5. Attach `conflicts` and `implementation_flags` before exposing rows in UI.
6. Generate `proof_tasks` from direct capture matrices and gap maps.
7. Only after game-file or direct proof arrives, upgrade `verification_status` row by row.

## Safety Tests

Minimum tests for the first implementation pass:

| Test | Failure Means |
| --- | --- |
| Every entity has at least one source or explicit placeholder flag | Silent invented data entered the system |
| No public row with `source_only` can show an `original_parity` badge | UI can overclaim fidelity |
| Any row with `conflict_ids` must expose a conflict badge or developer warning | Source conflict got hidden |
| Disputed aliases are preserved for known conflicts | Implementation chose a final name too early |
| Domain totals are derived from filtered views, not hardcoded constants | Count conflicts can corrupt catalogs |
| Formula/cost/threshold fields with no proof stay nullable/configurable | Runtime assumptions were baked in |

## First Seed Slice

Start with a tiny seed, not every catalog:

| Slice | Why First |
| --- | --- |
| `research_sources` for official Steam/store/news/wiki and major crawl files | Low risk and useful everywhere |
| `conflicts` for the top 10 risk groups from `source-conflict-implementation-risk-triage.md` | Prevents false parity during early UI/data work |
| `entities` only for domains and high-level row groups, not every card/gem yet | Lets UI and import tooling be built without premature totals |
| Alias examples for disputed rows such as `X Mana`, `Combo Stack/Stash`, `Cappella/Capella`, `Mana/Cooldown`, `Uncrackable/Unbreakable Gem` | Exercises conflict-safe display logic |

## Stop Rule

If a field would require gameplay observation, leave it nullable and blocked. The current user directive skips direct gameplay; this schema should preserve uncertainty, not erase it.
