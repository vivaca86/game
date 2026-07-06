# UI Concept Set v001

Status: concept reference only.

Created: 2026-06-02

Generation mode:

- Built-in image generation tool.
- Raster concept images copied into the project from the local Codex generated image folder.

Purpose:

- Establish a bitmap visual target set before UI implementation.
- Cover primary gameplay screens and reusable UI parts at the same premium popup-book paper-theater quality target.
- Prevent the runtime UI from drifting back into Phaser shape/SVG-only mockups.

This is not:

- final approved production art
- sliced runtime assets
- a Phaser implementation
- proof that `UI skin` is complete
- proof that the game is release-ready
- user/manual acceptance

Files:

| File | Purpose |
| --- | --- |
| `combat_multi_enemy_ui_concept_v001.png` | Normal combat layout supporting 1-3 enemies |
| `boss_combat_ui_concept_v001.png` | Boss combat layout with large boss and optional minion slots |
| `dungeon_ui_concept_v001.png` | Dungeon room progression / next-room / boss-distance screen |
| `world_map_ui_concept_v001.png` | Stage select / world map / unlock progression screen |
| `town_ui_concept_v001.png` | Town hub / meta progression surface |
| `reward_ui_concept_v001.png` | Reward selection supporting 3-4 options and multiple reward types |
| `event_ui_concept_v001.png` | Story event with 3-4 choices, costs, risks, and rewards |
| `rune_bench_ui_concept_v001.png` | Rune socket / before-after preview / compatibility screen |
| `result_ui_concept_v001.png` | Clear/defeat result and run-recap screen |
| `settings_ui_concept_v001.png` | Settings/options screen with audio, display, control, reset states |
| `ui_component_sheet_concept_v001.png` | Reusable UI part direction for panels, cards, buttons, badges, routes, sockets |
| `ui_concepts_contact_sheet_v001.png` | Review contact sheet for this set |

Known limitations:

- These are concept references, not cut-ready atlas parts.
- Some generated images may contain tiny pseudo-text or decorative marks. Runtime UI must not bake that text; Korean text must be rendered by Phaser from data/locale.
- The component sheet is useful for style direction but needs a cleaner no-text/slice-focused pass before production slicing.
- Combat implementation must not collapse to one enemy just because one concept emphasizes a front enemy. The normal combat target supports 1-3 enemy slots.
- Boss implementation must keep optional minion/summon space separate from the large boss silhouette.

Implementation gate before using these as progress evidence:

1. Select which concept images are accepted as the visual target.
2. Generate or extract separate bitmap parts: backgrounds, panels, card frames, buttons, intent badges, route nodes, ledgers, slots, and states.
3. Store runtime assets under the asset manifest with explicit `candidate` or `approved` status.
4. Implement Phaser placement from those bitmap parts.
5. Verify with debug-less screenshots at 1920x1080 and 1280x720.
6. Keep `UI skin` as `Not done` until final user/manual acceptance and the project rubric are satisfied.

Prompt baseline:

Premium popup-book fantasy paper-theater UI for a 2D Phaser card dungeon crawler, raster concept art, layered paper craft, tactile paper grain, folded cardstock, stitched seams, brass pins, ribbon tabs, sticker-like icons, ivory parchment, ink-blue shadows, teal magic accents, coral danger accents, brass/gold highlights, no readable baked-in text, runtime Korean text safe zones, original design only.
