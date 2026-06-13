import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const executableCandidates = [
  "C:/Users/i/AppData/Local/ms-playwright/chromium-1217/chrome-win64/chrome.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
];

const targets = [
  {
    key: "world_map_raster_underlay_concept",
    kind: "world_map_neutral_underlay",
    source: path.join(rootDir, "assets", "concepts", "ui", "world_map_ui_concept_v001.png"),
    output: path.join(rootDir, "assets", "source", "ui", "world_map_raster_underlay_concept_v001.png"),
    nativeSize: { w: 1672, h: 941 }
  },
  {
    key: "ui_hover_gold_seal_concept",
    source: path.join(rootDir, "assets", "concepts", "ui", "ui_component_sheet_concept_v001.png"),
    output: path.join(rootDir, "assets", "source", "ui", "ui_hover_gold_seal_concept_v001.png"),
    crop: { x: 742, y: 790, w: 102, h: 102 },
    nativeSize: { w: 144, h: 144 }
  },
  {
    key: "ui_hover_boss_skull_stamp_concept",
    source: path.join(rootDir, "assets", "concepts", "ui", "ui_component_sheet_concept_v001.png"),
    output: path.join(rootDir, "assets", "source", "ui", "ui_hover_boss_skull_stamp_concept_v001.png"),
    crop: { x: 1527, y: 370, w: 96, h: 106 },
    nativeSize: { w: 144, h: 144 },
    clearRects: [{ x: 0, y: 134, w: 144, h: 10 }]
  },
  {
    key: "ui_hover_route_node_concept",
    source: path.join(rootDir, "assets", "concepts", "ui", "ui_component_sheet_concept_v001.png"),
    output: path.join(rootDir, "assets", "source", "ui", "ui_hover_route_node_concept_v001.png"),
    crop: { x: 1388, y: 386, w: 78, h: 100 },
    nativeSize: { w: 144, h: 144 },
    clearRects: [
      { x: 0, y: 0, w: 26, h: 144 },
      { x: 128, y: 0, w: 16, h: 144 }
    ]
  },
  {
    key: "ui_hover_choice_badge_concept",
    source: path.join(rootDir, "assets", "concepts", "ui", "ui_component_sheet_concept_v001.png"),
    output: path.join(rootDir, "assets", "source", "ui", "ui_hover_choice_badge_concept_v001.png"),
    crop: { x: 1014, y: 488, w: 98, h: 98 },
    nativeSize: { w: 144, h: 144 }
  },
  {
    key: "ui_hover_action_seal_concept",
    source: path.join(rootDir, "assets", "concepts", "ui", "ui_component_sheet_concept_v001.png"),
    output: path.join(rootDir, "assets", "source", "ui", "ui_hover_action_seal_concept_v001.png"),
    crop: { x: 835, y: 770, w: 100, h: 132 },
    nativeSize: { w: 144, h: 144 },
    clearRects: [{ x: 126, y: 0, w: 18, h: 144 }]
  },
  {
    key: "ui_down_pressed_stamp_concept",
    source: path.join(rootDir, "assets", "concepts", "ui", "ui_component_sheet_concept_v001.png"),
    output: path.join(rootDir, "assets", "source", "ui", "ui_down_pressed_stamp_concept_v001.png"),
    crop: { x: 835, y: 770, w: 100, h: 132 },
    nativeSize: { w: 144, h: 144 },
    clearRects: [{ x: 126, y: 0, w: 18, h: 144 }],
    stateVariant: "pressed"
  },
  {
    key: "ui_disabled_lock_stamp_concept",
    source: path.join(rootDir, "assets", "concepts", "ui", "ui_component_sheet_concept_v001.png"),
    output: path.join(rootDir, "assets", "source", "ui", "ui_disabled_lock_stamp_concept_v001.png"),
    crop: { x: 360, y: 800, w: 92, h: 92 },
    nativeSize: { w: 144, h: 144 },
    stateVariant: "disabled"
  },
  {
    key: "ui_hover_world_map_play_button_concept",
    kind: "button_state",
    source: path.join(rootDir, "assets", "concepts", "ui", "world_map_ui_concept_v001.png"),
    output: path.join(rootDir, "assets", "source", "ui", "ui_hover_world_map_play_button_concept_v001.png"),
    crop: { x: 1250, y: 780, w: 245, h: 130 },
    nativeSize: { w: 280, h: 144 },
    stateVariant: "buttonHover"
  },
  {
    key: "ui_down_world_map_play_button_concept",
    kind: "button_state",
    source: path.join(rootDir, "assets", "concepts", "ui", "world_map_ui_concept_v001.png"),
    output: path.join(rootDir, "assets", "source", "ui", "ui_down_world_map_play_button_concept_v001.png"),
    crop: { x: 1250, y: 780, w: 245, h: 130 },
    nativeSize: { w: 280, h: 144 },
    stateVariant: "buttonDown"
  },
  {
    key: "ui_hover_settings_return_button_concept",
    kind: "button_state",
    source: path.join(rootDir, "assets", "source", "ui", "settings_raster_underlay_concept_v001.png"),
    output: path.join(rootDir, "assets", "source", "ui", "ui_hover_settings_return_button_concept_v001.png"),
    crop: { x: 1340, y: 775, w: 260, h: 140 },
    nativeSize: { w: 330, h: 170 },
    maskPolygon: [
      { x: 18, y: 42 },
      { x: 72, y: 16 },
      { x: 300, y: 16 },
      { x: 324, y: 50 },
      { x: 308, y: 148 },
      { x: 46, y: 160 },
      { x: 8, y: 122 }
    ],
    stateVariant: "buttonHover"
  },
  {
    key: "ui_down_settings_return_button_concept",
    kind: "button_state",
    source: path.join(rootDir, "assets", "source", "ui", "settings_raster_underlay_concept_v001.png"),
    output: path.join(rootDir, "assets", "source", "ui", "ui_down_settings_return_button_concept_v001.png"),
    crop: { x: 1340, y: 775, w: 260, h: 140 },
    nativeSize: { w: 330, h: 170 },
    maskPolygon: [
      { x: 18, y: 42 },
      { x: 72, y: 16 },
      { x: 300, y: 16 },
      { x: 324, y: 50 },
      { x: 308, y: 148 },
      { x: 46, y: 160 },
      { x: 8, y: 122 }
    ],
    stateVariant: "buttonDown"
  },
  {
    key: "ui_hover_settings_reset_save_concept",
    kind: "button_state",
    source: path.join(rootDir, "assets", "source", "ui", "settings_raster_underlay_concept_v001.png"),
    output: path.join(rootDir, "assets", "source", "ui", "ui_hover_settings_reset_save_concept_v001.png"),
    crop: { x: 1278, y: 360, w: 290, h: 128 },
    nativeSize: { w: 330, h: 150 },
    maskPolygon: [
      { x: 92, y: 24 },
      { x: 106, y: 10 },
      { x: 292, y: 8 },
      { x: 318, y: 26 },
      { x: 326, y: 72 },
      { x: 314, y: 126 },
      { x: 292, y: 144 },
      { x: 100, y: 140 },
      { x: 86, y: 112 }
    ],
    stateVariant: "buttonHover"
  },
  {
    key: "ui_down_settings_reset_save_concept",
    kind: "button_state",
    source: path.join(rootDir, "assets", "source", "ui", "settings_raster_underlay_concept_v001.png"),
    output: path.join(rootDir, "assets", "source", "ui", "ui_down_settings_reset_save_concept_v001.png"),
    crop: { x: 1278, y: 360, w: 290, h: 128 },
    nativeSize: { w: 330, h: 150 },
    maskPolygon: [
      { x: 92, y: 24 },
      { x: 106, y: 10 },
      { x: 292, y: 8 },
      { x: 318, y: 26 },
      { x: 326, y: 72 },
      { x: 314, y: 126 },
      { x: 292, y: 144 },
      { x: 100, y: 140 },
      { x: 86, y: 112 }
    ],
    stateVariant: "buttonDown"
  },
  {
    key: "ui_hover_settings_reset_defaults_concept",
    kind: "button_state",
    source: path.join(rootDir, "assets", "source", "ui", "settings_raster_underlay_concept_v001.png"),
    output: path.join(rootDir, "assets", "source", "ui", "ui_hover_settings_reset_defaults_concept_v001.png"),
    crop: { x: 1278, y: 532, w: 290, h: 128 },
    nativeSize: { w: 330, h: 150 },
    maskPolygon: [
      { x: 92, y: 24 },
      { x: 106, y: 10 },
      { x: 292, y: 8 },
      { x: 318, y: 26 },
      { x: 326, y: 72 },
      { x: 314, y: 126 },
      { x: 292, y: 144 },
      { x: 100, y: 140 },
      { x: 86, y: 112 }
    ],
    stateVariant: "buttonHover"
  },
  {
    key: "ui_down_settings_reset_defaults_concept",
    kind: "button_state",
    source: path.join(rootDir, "assets", "source", "ui", "settings_raster_underlay_concept_v001.png"),
    output: path.join(rootDir, "assets", "source", "ui", "ui_down_settings_reset_defaults_concept_v001.png"),
    crop: { x: 1278, y: 532, w: 290, h: 128 },
    nativeSize: { w: 330, h: 150 },
    maskPolygon: [
      { x: 92, y: 24 },
      { x: 106, y: 10 },
      { x: 292, y: 8 },
      { x: 318, y: 26 },
      { x: 326, y: 72 },
      { x: 314, y: 126 },
      { x: 292, y: 144 },
      { x: 100, y: 140 },
      { x: 86, y: 112 }
    ],
    stateVariant: "buttonDown"
  },
  {
    key: "ui_hover_settings_volume_master_concept",
    kind: "settings_control_state",
    source: path.join(rootDir, "assets", "source", "ui", "settings_raster_underlay_concept_v001.png"),
    output: path.join(rootDir, "assets", "source", "ui", "ui_hover_settings_volume_master_concept_v001.png"),
    crop: { x: 390, y: 208, w: 470, h: 54 },
    nativeSize: { w: 540, h: 64 },
    stateVariant: "controlHover"
  },
  {
    key: "ui_down_settings_volume_master_concept",
    kind: "settings_control_state",
    source: path.join(rootDir, "assets", "source", "ui", "settings_raster_underlay_concept_v001.png"),
    output: path.join(rootDir, "assets", "source", "ui", "ui_down_settings_volume_master_concept_v001.png"),
    crop: { x: 390, y: 208, w: 470, h: 54 },
    nativeSize: { w: 540, h: 64 },
    stateVariant: "controlDown"
  },
  {
    key: "ui_hover_settings_volume_music_concept",
    kind: "settings_control_state",
    source: path.join(rootDir, "assets", "source", "ui", "settings_raster_underlay_concept_v001.png"),
    output: path.join(rootDir, "assets", "source", "ui", "ui_hover_settings_volume_music_concept_v001.png"),
    crop: { x: 390, y: 288, w: 470, h: 54 },
    nativeSize: { w: 540, h: 64 },
    stateVariant: "controlHover"
  },
  {
    key: "ui_down_settings_volume_music_concept",
    kind: "settings_control_state",
    source: path.join(rootDir, "assets", "source", "ui", "settings_raster_underlay_concept_v001.png"),
    output: path.join(rootDir, "assets", "source", "ui", "ui_down_settings_volume_music_concept_v001.png"),
    crop: { x: 390, y: 288, w: 470, h: 54 },
    nativeSize: { w: 540, h: 64 },
    stateVariant: "controlDown"
  },
  {
    key: "ui_hover_settings_volume_sfx_concept",
    kind: "settings_control_state",
    source: path.join(rootDir, "assets", "source", "ui", "settings_raster_underlay_concept_v001.png"),
    output: path.join(rootDir, "assets", "source", "ui", "ui_hover_settings_volume_sfx_concept_v001.png"),
    crop: { x: 390, y: 368, w: 470, h: 54 },
    nativeSize: { w: 540, h: 64 },
    stateVariant: "controlHover"
  },
  {
    key: "ui_down_settings_volume_sfx_concept",
    kind: "settings_control_state",
    source: path.join(rootDir, "assets", "source", "ui", "settings_raster_underlay_concept_v001.png"),
    output: path.join(rootDir, "assets", "source", "ui", "ui_down_settings_volume_sfx_concept_v001.png"),
    crop: { x: 390, y: 368, w: 470, h: 54 },
    nativeSize: { w: 540, h: 64 },
    stateVariant: "controlDown"
  },
  {
    key: "ui_hover_settings_display_mode_concept",
    kind: "settings_control_state",
    source: path.join(rootDir, "assets", "source", "ui", "settings_raster_underlay_concept_v001.png"),
    output: path.join(rootDir, "assets", "source", "ui", "ui_hover_settings_display_mode_concept_v001.png"),
    crop: { x: 930, y: 208, w: 430, h: 54 },
    nativeSize: { w: 492, h: 64 },
    stateVariant: "controlHover"
  },
  {
    key: "ui_down_settings_display_mode_concept",
    kind: "settings_control_state",
    source: path.join(rootDir, "assets", "source", "ui", "settings_raster_underlay_concept_v001.png"),
    output: path.join(rootDir, "assets", "source", "ui", "ui_down_settings_display_mode_concept_v001.png"),
    crop: { x: 930, y: 208, w: 430, h: 54 },
    nativeSize: { w: 492, h: 64 },
    stateVariant: "controlDown"
  },
  {
    key: "ui_hover_settings_large_text_concept",
    kind: "settings_control_state",
    source: path.join(rootDir, "assets", "source", "ui", "settings_raster_underlay_concept_v001.png"),
    output: path.join(rootDir, "assets", "source", "ui", "ui_hover_settings_large_text_concept_v001.png"),
    crop: { x: 930, y: 288, w: 430, h: 54 },
    nativeSize: { w: 492, h: 64 },
    stateVariant: "controlHover"
  },
  {
    key: "ui_down_settings_large_text_concept",
    kind: "settings_control_state",
    source: path.join(rootDir, "assets", "source", "ui", "settings_raster_underlay_concept_v001.png"),
    output: path.join(rootDir, "assets", "source", "ui", "ui_down_settings_large_text_concept_v001.png"),
    crop: { x: 930, y: 288, w: 430, h: 54 },
    nativeSize: { w: 492, h: 64 },
    stateVariant: "controlDown"
  },
  {
    key: "ui_hover_settings_reduced_motion_concept",
    kind: "settings_control_state",
    source: path.join(rootDir, "assets", "source", "ui", "settings_raster_underlay_concept_v001.png"),
    output: path.join(rootDir, "assets", "source", "ui", "ui_hover_settings_reduced_motion_concept_v001.png"),
    crop: { x: 930, y: 368, w: 430, h: 54 },
    nativeSize: { w: 492, h: 64 },
    stateVariant: "controlHover"
  },
  {
    key: "ui_down_settings_reduced_motion_concept",
    kind: "settings_control_state",
    source: path.join(rootDir, "assets", "source", "ui", "settings_raster_underlay_concept_v001.png"),
    output: path.join(rootDir, "assets", "source", "ui", "ui_down_settings_reduced_motion_concept_v001.png"),
    crop: { x: 930, y: 368, w: 430, h: 54 },
    nativeSize: { w: 492, h: 64 },
    stateVariant: "controlDown"
  },
  {
    key: "ui_hover_settings_space_confirm_concept",
    kind: "settings_control_state",
    source: path.join(rootDir, "assets", "source", "ui", "settings_raster_underlay_concept_v001.png"),
    output: path.join(rootDir, "assets", "source", "ui", "ui_hover_settings_space_confirm_concept_v001.png"),
    crop: { x: 930, y: 528, w: 430, h: 54 },
    nativeSize: { w: 492, h: 64 },
    stateVariant: "controlHover"
  },
  {
    key: "ui_down_settings_space_confirm_concept",
    kind: "settings_control_state",
    source: path.join(rootDir, "assets", "source", "ui", "settings_raster_underlay_concept_v001.png"),
    output: path.join(rootDir, "assets", "source", "ui", "ui_down_settings_space_confirm_concept_v001.png"),
    crop: { x: 930, y: 528, w: 430, h: 54 },
    nativeSize: { w: 492, h: 64 },
    stateVariant: "controlDown"
  },
  {
    key: "ui_hover_town_expedition_action_concept",
    kind: "button_state",
    source: path.join(rootDir, "assets", "source", "ui", "town_raster_underlay_concept_v001.png"),
    output: path.join(rootDir, "assets", "source", "ui", "ui_hover_town_expedition_action_concept_v001.png"),
    crop: { x: 850, y: 500, w: 125, h: 120 },
    nativeSize: { w: 160, h: 154 },
    maskPolygon: [
      { x: 28, y: 34 },
      { x: 54, y: 10 },
      { x: 108, y: 10 },
      { x: 134, y: 34 },
      { x: 134, y: 86 },
      { x: 106, y: 112 },
      { x: 52, y: 112 },
      { x: 24, y: 84 }
    ],
    stateVariant: "buttonHover"
  },
  {
    key: "ui_down_town_expedition_action_concept",
    kind: "button_state",
    source: path.join(rootDir, "assets", "source", "ui", "town_raster_underlay_concept_v001.png"),
    output: path.join(rootDir, "assets", "source", "ui", "ui_down_town_expedition_action_concept_v001.png"),
    crop: { x: 850, y: 500, w: 125, h: 120 },
    nativeSize: { w: 160, h: 154 },
    maskPolygon: [
      { x: 28, y: 34 },
      { x: 54, y: 10 },
      { x: 108, y: 10 },
      { x: 134, y: 34 },
      { x: 134, y: 86 },
      { x: 106, y: 112 },
      { x: 52, y: 112 },
      { x: 24, y: 84 }
    ],
    stateVariant: "buttonDown"
  },
  {
    key: "ui_hover_town_toolbar_reset_concept",
    kind: "button_state",
    source: path.join(rootDir, "assets", "source", "ui", "town_raster_underlay_concept_v001.png"),
    output: path.join(rootDir, "assets", "source", "ui", "ui_hover_town_toolbar_reset_concept_v001.png"),
    crop: { x: 338, y: 785, w: 210, h: 130 },
    nativeSize: { w: 230, h: 142 },
    maskPolygon: [
      { x: 12, y: 58 },
      { x: 40, y: 36 },
      { x: 188, y: 36 },
      { x: 212, y: 58 },
      { x: 204, y: 126 },
      { x: 40, y: 134 },
      { x: 12, y: 114 }
    ],
    stateVariant: "buttonHover"
  },
  {
    key: "ui_down_town_toolbar_reset_concept",
    kind: "button_state",
    source: path.join(rootDir, "assets", "source", "ui", "town_raster_underlay_concept_v001.png"),
    output: path.join(rootDir, "assets", "source", "ui", "ui_down_town_toolbar_reset_concept_v001.png"),
    crop: { x: 338, y: 785, w: 210, h: 130 },
    nativeSize: { w: 230, h: 142 },
    maskPolygon: [
      { x: 12, y: 58 },
      { x: 40, y: 36 },
      { x: 188, y: 36 },
      { x: 212, y: 58 },
      { x: 204, y: 126 },
      { x: 40, y: 134 },
      { x: 12, y: 114 }
    ],
    stateVariant: "buttonDown"
  },
  {
    key: "ui_hover_town_toolbar_settings_concept",
    kind: "button_state",
    source: path.join(rootDir, "assets", "source", "ui", "town_raster_underlay_concept_v001.png"),
    output: path.join(rootDir, "assets", "source", "ui", "ui_hover_town_toolbar_settings_concept_v001.png"),
    crop: { x: 1080, y: 785, w: 175, h: 130 },
    nativeSize: { w: 220, h: 164 },
    maskPolygon: [
      { x: 12, y: 62 },
      { x: 40, y: 42 },
      { x: 188, y: 42 },
      { x: 206, y: 62 },
      { x: 198, y: 144 },
      { x: 36, y: 152 },
      { x: 12, y: 126 }
    ],
    stateVariant: "buttonHover"
  },
  {
    key: "ui_down_town_toolbar_settings_concept",
    kind: "button_state",
    source: path.join(rootDir, "assets", "source", "ui", "town_raster_underlay_concept_v001.png"),
    output: path.join(rootDir, "assets", "source", "ui", "ui_down_town_toolbar_settings_concept_v001.png"),
    crop: { x: 1080, y: 785, w: 175, h: 130 },
    nativeSize: { w: 220, h: 164 },
    maskPolygon: [
      { x: 12, y: 62 },
      { x: 40, y: 42 },
      { x: 188, y: 42 },
      { x: 206, y: 62 },
      { x: 198, y: 144 },
      { x: 36, y: 152 },
      { x: 12, y: 126 }
    ],
    stateVariant: "buttonDown"
  },
  {
    key: "ui_hover_runebench_action_rail_concept",
    kind: "underlay_control_state",
    source: path.join(rootDir, "assets", "source", "ui", "rune_bench_raster_underlay_concept_v001.png"),
    output: path.join(rootDir, "assets", "source", "ui", "ui_hover_runebench_action_rail_concept_v001.png"),
    crop: { x: 690, y: 575, w: 470, h: 92 },
    nativeSize: { w: 540, h: 112 },
    stateVariant: "controlHover"
  },
  {
    key: "ui_down_runebench_action_rail_concept",
    kind: "underlay_control_state",
    source: path.join(rootDir, "assets", "source", "ui", "rune_bench_raster_underlay_concept_v001.png"),
    output: path.join(rootDir, "assets", "source", "ui", "ui_down_runebench_action_rail_concept_v001.png"),
    crop: { x: 690, y: 575, w: 470, h: 92 },
    nativeSize: { w: 540, h: 112 },
    stateVariant: "controlDown"
  },
  {
    key: "ui_hover_runebench_confirm_button_concept",
    kind: "button_state",
    source: path.join(rootDir, "assets", "source", "ui", "rune_bench_raster_underlay_concept_v001.png"),
    output: path.join(rootDir, "assets", "source", "ui", "ui_hover_runebench_confirm_button_concept_v001.png"),
    crop: { x: 1288, y: 790, w: 285, h: 105 },
    nativeSize: { w: 330, h: 122 },
    maskPolygon: [
      { x: 4, y: 40 },
      { x: 28, y: 18 },
      { x: 292, y: 14 },
      { x: 326, y: 36 },
      { x: 318, y: 112 },
      { x: 28, y: 118 },
      { x: 4, y: 98 }
    ],
    stateVariant: "buttonHover"
  },
  {
    key: "ui_down_runebench_confirm_button_concept",
    kind: "button_state",
    source: path.join(rootDir, "assets", "source", "ui", "rune_bench_raster_underlay_concept_v001.png"),
    output: path.join(rootDir, "assets", "source", "ui", "ui_down_runebench_confirm_button_concept_v001.png"),
    crop: { x: 1288, y: 790, w: 285, h: 105 },
    nativeSize: { w: 330, h: 122 },
    maskPolygon: [
      { x: 4, y: 40 },
      { x: 28, y: 18 },
      { x: 292, y: 14 },
      { x: 326, y: 36 },
      { x: 318, y: 112 },
      { x: 28, y: 118 },
      { x: 4, y: 98 }
    ],
    stateVariant: "buttonDown"
  },
  {
    key: "ui_hover_result_action_card_concept",
    kind: "underlay_control_state",
    source: path.join(rootDir, "assets", "source", "ui", "result_raster_underlay_concept_v001.png"),
    output: path.join(rootDir, "assets", "source", "ui", "ui_hover_result_action_card_concept_v001.png"),
    crop: { x: 910, y: 565, w: 220, h: 95 },
    nativeSize: { w: 300, h: 128 },
    stateVariant: "controlHover"
  },
  {
    key: "ui_down_result_action_card_concept",
    kind: "underlay_control_state",
    source: path.join(rootDir, "assets", "source", "ui", "result_raster_underlay_concept_v001.png"),
    output: path.join(rootDir, "assets", "source", "ui", "ui_down_result_action_card_concept_v001.png"),
    crop: { x: 910, y: 565, w: 220, h: 95 },
    nativeSize: { w: 300, h: 128 },
    stateVariant: "controlDown"
  },
  {
    key: "ui_hover_result_return_button_concept",
    kind: "button_state",
    source: path.join(rootDir, "assets", "source", "ui", "result_raster_underlay_concept_v001.png"),
    output: path.join(rootDir, "assets", "source", "ui", "ui_hover_result_return_button_concept_v001.png"),
    crop: { x: 662, y: 760, w: 350, h: 116 },
    nativeSize: { w: 440, h: 146 },
    maskPolygon: [
      { x: 18, y: 34 },
      { x: 48, y: 12 },
      { x: 396, y: 12 },
      { x: 430, y: 40 },
      { x: 418, y: 132 },
      { x: 38, y: 138 },
      { x: 10, y: 108 }
    ],
    stateVariant: "buttonHover"
  },
  {
    key: "ui_down_result_return_button_concept",
    kind: "button_state",
    source: path.join(rootDir, "assets", "source", "ui", "result_raster_underlay_concept_v001.png"),
    output: path.join(rootDir, "assets", "source", "ui", "ui_down_result_return_button_concept_v001.png"),
    crop: { x: 662, y: 760, w: 350, h: 116 },
    nativeSize: { w: 440, h: 146 },
    maskPolygon: [
      { x: 18, y: 34 },
      { x: 48, y: 12 },
      { x: 396, y: 12 },
      { x: 430, y: 40 },
      { x: 418, y: 132 },
      { x: 38, y: 138 },
      { x: 10, y: 108 }
    ],
    stateVariant: "buttonDown"
  },
  {
    key: "ui_current_stage_marker_concept",
    kind: "current_marker",
    source: path.join(rootDir, "assets", "concepts", "ui", "world_map_ui_concept_v001.png"),
    output: path.join(rootDir, "assets", "source", "ui", "ui_current_stage_marker_concept_v001.png"),
    crop: { x: 987, y: 487, w: 70, h: 78 },
    nativeSize: { w: 96, h: 108 }
  },
  {
    key: "ui_current_stage_frame_concept",
    kind: "current_stage_frame",
    source: path.join(rootDir, "assets", "concepts", "ui", "world_map_ui_concept_v001.png"),
    output: path.join(rootDir, "assets", "source", "ui", "ui_current_stage_frame_concept_v001.png"),
    crop: { x: 940, y: 532, w: 170, h: 176 },
    nativeSize: { w: 210, h: 216 }
  },
  {
    key: "ui_current_stage_body_wash_concept",
    kind: "world_map_stage_body_wash",
    source: path.join(rootDir, "assets", "concepts", "ui", "world_map_ui_concept_v001.png"),
    output: path.join(rootDir, "assets", "source", "ui", "ui_current_stage_body_wash_concept_v001.png"),
    crop: { x: 940, y: 532, w: 170, h: 176 },
    nativeSize: { w: 210, h: 216 },
    stateVariant: "current"
  },
  {
    key: "ui_completed_stage_frame_concept",
    kind: "completed_stage_frame",
    source: path.join(rootDir, "assets", "concepts", "ui", "world_map_ui_concept_v001.png"),
    output: path.join(rootDir, "assets", "source", "ui", "ui_completed_stage_frame_concept_v001.png"),
    crop: { x: 622, y: 586, w: 170, h: 178 },
    nativeSize: { w: 210, h: 220 }
  },
  {
    key: "ui_completed_stage_body_wash_concept",
    kind: "world_map_stage_body_wash",
    source: path.join(rootDir, "assets", "concepts", "ui", "world_map_ui_concept_v001.png"),
    output: path.join(rootDir, "assets", "source", "ui", "ui_completed_stage_body_wash_concept_v001.png"),
    crop: { x: 622, y: 586, w: 170, h: 178 },
    nativeSize: { w: 210, h: 220 },
    stateVariant: "completed"
  },
  {
    key: "ui_locked_stage_frame_concept",
    kind: "locked_stage_frame",
    source: path.join(rootDir, "assets", "concepts", "ui", "world_map_ui_concept_v001.png"),
    output: path.join(rootDir, "assets", "source", "ui", "ui_locked_stage_frame_concept_v001.png"),
    crop: { x: 708, y: 222, w: 170, h: 178 },
    nativeSize: { w: 210, h: 220 }
  },
  {
    key: "ui_locked_stage_body_wash_concept",
    kind: "world_map_stage_body_wash",
    source: path.join(rootDir, "assets", "concepts", "ui", "world_map_ui_concept_v001.png"),
    output: path.join(rootDir, "assets", "source", "ui", "ui_locked_stage_body_wash_concept_v001.png"),
    crop: { x: 708, y: 222, w: 170, h: 178 },
    nativeSize: { w: 210, h: 220 },
    stateVariant: "locked"
  },
  {
    key: "ui_sealed_stage_frame_concept",
    kind: "sealed_stage_frame",
    source: path.join(rootDir, "assets", "concepts", "ui", "world_map_ui_concept_v001.png"),
    output: path.join(rootDir, "assets", "source", "ui", "ui_sealed_stage_frame_concept_v001.png"),
    crop: { x: 564, y: 356, w: 170, h: 178 },
    nativeSize: { w: 210, h: 220 }
  },
  {
    key: "ui_sealed_stage_body_wash_concept",
    kind: "world_map_stage_body_wash",
    source: path.join(rootDir, "assets", "concepts", "ui", "world_map_ui_concept_v001.png"),
    output: path.join(rootDir, "assets", "source", "ui", "ui_sealed_stage_body_wash_concept_v001.png"),
    crop: { x: 564, y: 356, w: 170, h: 178 },
    nativeSize: { w: 210, h: 220 },
    stateVariant: "sealed"
  },
  {
    key: "ui_dormant_stage_frame_concept",
    kind: "sealed_stage_frame",
    source: path.join(rootDir, "assets", "concepts", "ui", "world_map_ui_concept_v001.png"),
    output: path.join(rootDir, "assets", "source", "ui", "ui_dormant_stage_frame_concept_v001.png"),
    crop: { x: 564, y: 356, w: 170, h: 178 },
    nativeSize: { w: 210, h: 220 }
  },
  {
    key: "ui_dormant_stage_body_wash_concept",
    kind: "world_map_stage_body_wash",
    source: path.join(rootDir, "assets", "concepts", "ui", "world_map_ui_concept_v001.png"),
    output: path.join(rootDir, "assets", "source", "ui", "ui_dormant_stage_body_wash_concept_v001.png"),
    crop: { x: 564, y: 356, w: 170, h: 178 },
    nativeSize: { w: 210, h: 220 },
    stateVariant: "dormant"
  },
  {
    key: "ui_world_map_route_progress_thread_concept",
    kind: "world_map_route_thread",
    source: path.join(rootDir, "assets", "concepts", "ui", "world_map_ui_concept_v001.png"),
    output: path.join(rootDir, "assets", "source", "ui", "ui_world_map_route_progress_thread_concept_v001.png"),
    crop: { x: 710, y: 638, w: 130, h: 42 },
    nativeSize: { w: 220, h: 56 }
  },
  {
    key: "ui_world_map_route_progress_bead_concept",
    kind: "world_map_route_bead",
    source: path.join(rootDir, "assets", "concepts", "ui", "world_map_ui_concept_v001.png"),
    output: path.join(rootDir, "assets", "source", "ui", "ui_world_map_route_progress_bead_concept_v001.png"),
    crop: { x: 1048, y: 548, w: 54, h: 74 },
    nativeSize: { w: 80, h: 100 }
  },
  {
    key: "ui_current_stage_halo_concept",
    kind: "current_halo",
    source: path.join(rootDir, "assets", "concepts", "ui", "world_map_ui_concept_v001.png"),
    output: path.join(rootDir, "assets", "source", "ui", "ui_current_stage_halo_concept_v001.png"),
    crop: { x: 908, y: 490, w: 226, h: 244 },
    nativeSize: { w: 246, h: 264 }
  },
  {
    key: "ui_current_stage_status_badge_concept",
    kind: "current_status_badge",
    source: path.join(rootDir, "assets", "concepts", "ui", "world_map_ui_concept_v001.png"),
    output: path.join(rootDir, "assets", "source", "ui", "ui_current_stage_status_badge_concept_v001.png"),
    crop: { x: 1034, y: 600, w: 82, h: 82 },
    nativeSize: { w: 96, h: 96 }
  },
  {
    key: "ui_completed_stage_badge_concept",
    kind: "world_map_stage_badge",
    source: path.join(rootDir, "assets", "concepts", "ui", "world_map_ui_concept_v001.png"),
    output: path.join(rootDir, "assets", "source", "ui", "ui_completed_stage_badge_concept_v001.png"),
    crop: { x: 486, y: 680, w: 55, h: 58 },
    nativeSize: { w: 96, h: 96 },
    stateVariant: "completed"
  },
  {
    key: "ui_completed_stage_late_badge_concept",
    kind: "world_map_stage_badge",
    source: path.join(rootDir, "assets", "concepts", "ui", "world_map_ui_concept_v001.png"),
    output: path.join(rootDir, "assets", "source", "ui", "ui_completed_stage_late_badge_concept_v001.png"),
    crop: { x: 486, y: 680, w: 55, h: 58 },
    nativeSize: { w: 96, h: 96 },
    stateVariant: "completedLate"
  },
  {
    key: "ui_locked_stage_badge_concept",
    kind: "world_map_stage_badge",
    source: path.join(rootDir, "assets", "concepts", "ui", "world_map_ui_concept_v001.png"),
    output: path.join(rootDir, "assets", "source", "ui", "ui_locked_stage_badge_concept_v001.png"),
    crop: { x: 793, y: 292, w: 52, h: 53 },
    nativeSize: { w: 96, h: 96 },
    stateVariant: "locked"
  },
  {
    key: "ui_sealed_stage_badge_concept",
    kind: "world_map_stage_badge",
    source: path.join(rootDir, "assets", "concepts", "ui", "world_map_ui_concept_v001.png"),
    output: path.join(rootDir, "assets", "source", "ui", "ui_sealed_stage_badge_concept_v001.png"),
    crop: { x: 1142, y: 530, w: 36, h: 44 },
    nativeSize: { w: 96, h: 96 },
    stateVariant: "sealed"
  },
  {
    key: "effect_paper_slash_concept",
    kind: "effect_sheet",
    effectKind: "paper_slash",
    source: path.join(rootDir, "assets", "source", "cards", "card_art_sun_jab_raster_v001.png"),
    outputs: [
      path.join(rootDir, "assets", "source", "effects", "effect_paper_slash_concept_v001.png"),
      path.join(rootDir, "public", "assets", "runtime", "effects", "effect_paper_slash_v001.png")
    ],
    crop: { x: 152, y: 24, w: 252, h: 252 },
    nativeSize: { w: 1024, h: 1024 },
    frameSize: { w: 256, h: 256 },
    drawScale: 1.08,
    baseAngle: -7,
    angleRange: 9
  },
  {
    key: "effect_stage_spotlight_concept",
    kind: "effect_sheet",
    effectKind: "stage_spotlight",
    source: path.join(rootDir, "assets", "concepts", "ui", "ui_component_sheet_concept_v001.png"),
    outputs: [
      path.join(rootDir, "assets", "source", "effects", "effect_stage_spotlight_concept_v001.png"),
      path.join(rootDir, "public", "assets", "runtime", "effects", "effect_stage_spotlight_v001.png")
    ],
    crop: { x: 596, y: 544, w: 90, h: 90 },
    nativeSize: { w: 1024, h: 1024 },
    frameSize: { w: 256, h: 256 },
    drawScale: 1.04,
    baseAngle: -3,
    angleRange: 6
  },
  {
    key: "effect_ink_splash_concept",
    kind: "effect_sheet",
    effectKind: "ink_splash",
    source: path.join(rootDir, "assets", "concepts", "ui", "ui_component_sheet_concept_v001.png"),
    outputs: [
      path.join(rootDir, "assets", "source", "effects", "effect_ink_splash_concept_v001.png"),
      path.join(rootDir, "public", "assets", "runtime", "effects", "effect_ink_splash_v001.png")
    ],
    crop: { x: 1326, y: 798, w: 90, h: 84 },
    nativeSize: { w: 1024, h: 1024 },
    frameSize: { w: 256, h: 256 },
    drawScale: 1.62,
    baseAngle: -3,
    angleRange: 7
  },
  {
    key: "effect_paper_slash_concept_release",
    kind: "effect_sheet",
    effectKind: "paper_slash",
    source: path.join(rootDir, "assets", "source", "cards", "card_art_sun_jab_raster_v001.png"),
    outputs: [
      path.join(rootDir, "assets", "source", "effects", "release", "effect_paper_slash_concept_v001.png"),
      path.join(rootDir, "public", "assets", "runtime", "release", "effects", "effect_paper_slash_v001.png")
    ],
    crop: { x: 152, y: 24, w: 252, h: 252 },
    nativeSize: { w: 512, h: 512 },
    frameSize: { w: 128, h: 128 },
    drawScale: 1.08,
    baseAngle: -7,
    angleRange: 9
  },
  {
    key: "effect_stage_spotlight_concept_release",
    kind: "effect_sheet",
    effectKind: "stage_spotlight",
    source: path.join(rootDir, "assets", "concepts", "ui", "ui_component_sheet_concept_v001.png"),
    outputs: [
      path.join(rootDir, "assets", "source", "effects", "release", "effect_stage_spotlight_concept_v001.png"),
      path.join(rootDir, "public", "assets", "runtime", "release", "effects", "effect_stage_spotlight_v001.png")
    ],
    crop: { x: 596, y: 544, w: 90, h: 90 },
    nativeSize: { w: 512, h: 512 },
    frameSize: { w: 128, h: 128 },
    drawScale: 1.04,
    baseAngle: -3,
    angleRange: 6
  },
  {
    key: "effect_ink_splash_concept_release",
    kind: "effect_sheet",
    effectKind: "ink_splash",
    source: path.join(rootDir, "assets", "concepts", "ui", "ui_component_sheet_concept_v001.png"),
    outputs: [
      path.join(rootDir, "assets", "source", "effects", "release", "effect_ink_splash_concept_v001.png"),
      path.join(rootDir, "public", "assets", "runtime", "release", "effects", "effect_ink_splash_v001.png")
    ],
    crop: { x: 1326, y: 798, w: 90, h: 84 },
    nativeSize: { w: 512, h: 512 },
    frameSize: { w: 128, h: 128 },
    drawScale: 1.62,
    baseAngle: -3,
    angleRange: 7
  }
];

let browser;
let launchError;
for (const executablePath of [null, ...executableCandidates]) {
  try {
    browser = await chromium.launch(executablePath ? { headless: true, executablePath } : { headless: true });
    break;
  } catch (error) {
    launchError = error;
  }
}
if (!browser) throw launchError;

try {
  const page = await browser.newPage();
  for (const target of targets) {
    const sourceBuffer = await readFile(target.source);
    const dataUrl = target.kind === "world_map_neutral_underlay"
      ? await page.evaluate(async ({ base64, nativeSize }) => {
        const image = await new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error("source concept image failed to load"));
          img.src = `data:image/png;base64,${base64}`;
        });

        const canvas = document.createElement("canvas");
        canvas.width = nativeSize.w;
        canvas.height = nativeSize.h;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) throw new Error("2d canvas context unavailable");
        ctx.drawImage(image, 0, 0, nativeSize.w, nativeSize.h);

        const imageData = ctx.getImageData(0, 0, nativeSize.w, nativeSize.h);
        const data = imageData.data;
        const regions = [
          { x: 510, y: 662, rx: 58, ry: 76, strength: 0.88, mode: "cyan" },
          { x: 704, y: 658, rx: 58, ry: 76, strength: 0.88, mode: "cyan" },
          { x: 872, y: 648, rx: 58, ry: 76, strength: 0.88, mode: "cyan" },
          { x: 873, y: 631, rx: 44, ry: 40, strength: 1.12, mode: "teal" },
          { x: 1018, y: 604, rx: 66, ry: 88, strength: 0.92, mode: "cyan" },
          { x: 510, y: 704, rx: 76, ry: 54, strength: 1.08, mode: "green" },
          { x: 704, y: 700, rx: 76, ry: 54, strength: 1.08, mode: "green" },
          { x: 872, y: 690, rx: 76, ry: 54, strength: 1.08, mode: "green" },
          { x: 1018, y: 615, rx: 166, ry: 178, strength: 1.08, mode: "cyan" },
          { x: 1022, y: 512, rx: 96, ry: 112, strength: 1.12, mode: "cyan" },
          { x: 1160, y: 502, rx: 82, ry: 90, strength: 0.78, mode: "cyan" },
          { x: 1176, y: 540, rx: 68, ry: 86, strength: 1.04, mode: "cyan" },
          { x: 1176, y: 516, rx: 54, ry: 50, strength: 0.96, mode: "teal" },
          { x: 1180, y: 592, rx: 44, ry: 42, strength: 0.92, mode: "cyan" },
          { x: 563, y: 248, rx: 52, ry: 52, strength: 0.94, mode: "red" },
          { x: 686, y: 294, rx: 52, ry: 52, strength: 0.94, mode: "red" },
          { x: 819, y: 312, rx: 52, ry: 52, strength: 0.98, mode: "red" },
          { x: 930, y: 299, rx: 52, ry: 52, strength: 0.94, mode: "red" },
          { x: 1052, y: 202, rx: 54, ry: 54, strength: 0.94, mode: "red" },
          { x: 1142, y: 329, rx: 58, ry: 58, strength: 1, mode: "red" }
        ];
        const segments = [
          { x1: 510, y1: 676, x2: 704, y2: 676, r: 42, strength: 1.05 },
          { x1: 704, y1: 676, x2: 872, y2: 662, r: 42, strength: 1.05 },
          { x1: 872, y1: 662, x2: 1018, y2: 615, r: 48, strength: 1.08 },
          { x1: 940, y1: 474, x2: 942, y2: 538, r: 34, strength: 1.16 },
          { x1: 1018, y1: 588, x2: 1174, y2: 558, r: 42, strength: 1.04 },
          { x1: 1160, y1: 502, x2: 1328, y2: 574, r: 38, strength: 0.86 }
        ];

        for (let y = 150; y < 780; y += 1) {
          for (let x = 420; x < 1415; x += 1) {
            let greenMask = 0;
            let cyanMask = 0;
            let redMask = 0;
            let tealMask = 0;

            for (const region of regions) {
              const dx = (x - region.x) / region.rx;
              const dy = (y - region.y) / region.ry;
              const distance = Math.sqrt(dx * dx + dy * dy);
              if (distance >= 1) continue;
              const mask = (1 - distance) * region.strength;
              if (region.mode === "green") {
                greenMask = Math.max(greenMask, mask);
              } else if (region.mode === "cyan") {
                cyanMask = Math.max(cyanMask, mask);
              } else if (region.mode === "teal") {
                tealMask = Math.max(tealMask, mask);
              } else {
                redMask = Math.max(redMask, mask);
              }
            }

            for (const segment of segments) {
              const distance = distanceToSegment(x, y, segment.x1, segment.y1, segment.x2, segment.y2);
              if (distance < segment.r) {
                cyanMask = Math.max(cyanMask, (1 - distance / segment.r) * segment.strength);
              }
            }

            if (greenMask <= 0 && cyanMask <= 0 && redMask <= 0 && tealMask <= 0) continue;

            const offset = (y * nativeSize.w + x) * 4;
            const r = data[offset];
            const g = data[offset + 1];
            const b = data[offset + 2];
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            const saturation = max - min;
            const luminance = r * 0.299 + g * 0.587 + b * 0.114;
            const cyan = smoothstep(20, 112, ((g + b) / 2) - r * 0.56 + saturation * 0.22);
            const green = smoothstep(12, 92, g - Math.max(r, b) * 0.7 + saturation * 0.22);
            const red = smoothstep(26, 118, r - Math.max(g, b) * 0.92 + saturation * 0.18);
            const darkTeal = smoothstep(14, 88, ((g + b) / 2) - r * 0.8 + saturation * 0.16) * (1 - smoothstep(118, 188, luminance));
            const state = Math.max(cyan * cyanMask, green * greenMask, red * redMask, darkTeal * tealMask);
            const glowState = Math.max(cyanMask, greenMask, redMask * 0.74, tealMask * 0.54) * smoothstep(96, 188, luminance) * smoothstep(8, 70, saturation);
            const amount = Math.min(1, Math.max(state * 1.72, glowState * 0.58));
            if (amount <= 0.035) continue;

            const neutralR = Math.min(255, 94 + luminance * 0.22);
            const neutralG = Math.min(255, 82 + luminance * 0.19);
            const neutralB = Math.min(255, 68 + luminance * 0.16);
            data[offset] = Math.round(r * (1 - amount) + neutralR * amount);
            data[offset + 1] = Math.round(g * (1 - amount) + neutralG * amount);
            data[offset + 2] = Math.round(b * (1 - amount) + neutralB * amount);
          }
        }

        ctx.putImageData(imageData, 0, 0);
        const blurCanvas = document.createElement("canvas");
        blurCanvas.width = nativeSize.w;
        blurCanvas.height = nativeSize.h;
        const blurCtx = blurCanvas.getContext("2d", { willReadFrequently: true });
        if (!blurCtx) throw new Error("2d blur canvas context unavailable");
        blurCtx.filter = "blur(22px)";
        blurCtx.drawImage(canvas, 0, 0);
        const blurData = blurCtx.getImageData(0, 0, nativeSize.w, nativeSize.h).data;
        const scrubRegions = [
          { x: 510, y: 704, rx: 58, ry: 42, strength: 0.74 },
          { x: 704, y: 700, rx: 58, ry: 42, strength: 0.74 },
          { x: 872, y: 690, rx: 58, ry: 42, strength: 0.74 },
          { x: 1022, y: 512, rx: 62, ry: 78, strength: 0.82 },
          { x: 1018, y: 615, rx: 122, ry: 140, strength: 0.58 },
          { x: 1018, y: 684, rx: 96, ry: 70, strength: 0.5 },
          { x: 1176, y: 540, rx: 58, ry: 72, strength: 0.62 },
          { x: 1180, y: 592, rx: 36, ry: 36, strength: 0.56 },
          { x: 563, y: 248, rx: 36, ry: 40, strength: 0.68 },
          { x: 686, y: 294, rx: 36, ry: 40, strength: 0.68 },
          { x: 819, y: 312, rx: 36, ry: 40, strength: 0.72 },
          { x: 930, y: 299, rx: 36, ry: 40, strength: 0.68 },
          { x: 1052, y: 202, rx: 38, ry: 42, strength: 0.68 },
          { x: 1142, y: 329, rx: 40, ry: 44, strength: 0.72 }
        ];
        const scrubSegments = [
          { x1: 510, y1: 676, x2: 704, y2: 676, r: 32, strength: 0.44 },
          { x1: 704, y1: 676, x2: 872, y2: 662, r: 32, strength: 0.44 },
          { x1: 872, y1: 662, x2: 1018, y2: 615, r: 38, strength: 0.5 },
          { x1: 940, y1: 474, x2: 942, y2: 538, r: 24, strength: 0.52 },
          { x1: 1018, y1: 588, x2: 1174, y2: 558, r: 32, strength: 0.52 },
          { x1: 1160, y1: 502, x2: 1328, y2: 574, r: 28, strength: 0.38 }
        ];

        for (let y = 160; y < 760; y += 1) {
          for (let x = 450; x < 1405; x += 1) {
            let scrubMask = 0;

            for (const region of scrubRegions) {
              const dx = (x - region.x) / region.rx;
              const dy = (y - region.y) / region.ry;
              const distance = Math.sqrt(dx * dx + dy * dy);
              if (distance >= 1) continue;
              scrubMask = Math.max(scrubMask, smoothstep(1, 0, distance) * region.strength);
            }

            for (const segment of scrubSegments) {
              const distance = distanceToSegment(x, y, segment.x1, segment.y1, segment.x2, segment.y2);
              if (distance < segment.r) {
                scrubMask = Math.max(scrubMask, smoothstep(segment.r, 0, distance) * segment.strength);
              }
            }

            if (scrubMask <= 0.025) continue;

            const offset = (y * nativeSize.w + x) * 4;
            const r = data[offset];
            const g = data[offset + 1];
            const b = data[offset + 2];
            const luminance = r * 0.299 + g * 0.587 + b * 0.114;
            const neutralR = Math.min(255, 96 + luminance * 0.18);
            const neutralG = Math.min(255, 84 + luminance * 0.16);
            const neutralB = Math.min(255, 70 + luminance * 0.14);
            const targetR = blurData[offset] * 0.56 + neutralR * 0.44;
            const targetG = blurData[offset + 1] * 0.56 + neutralG * 0.44;
            const targetB = blurData[offset + 2] * 0.56 + neutralB * 0.44;
            const amount = Math.min(0.74, scrubMask * 0.92);
            data[offset] = Math.round(r * (1 - amount) + targetR * amount);
            data[offset + 1] = Math.round(g * (1 - amount) + targetG * amount);
            data[offset + 2] = Math.round(b * (1 - amount) + targetB * amount);
          }
        }

        const coverRegions = [
          { x: 510, y: 704, rx: 58, ry: 44, strength: 1.22 },
          { x: 704, y: 700, rx: 58, ry: 44, strength: 1.22 },
          { x: 872, y: 690, rx: 58, ry: 44, strength: 1.22 },
          { x: 1022, y: 512, rx: 56, ry: 70, strength: 0.86 },
          { x: 1176, y: 540, rx: 46, ry: 56, strength: 0.72 },
          { x: 1180, y: 592, rx: 30, ry: 32, strength: 0.78 },
          { x: 563, y: 248, rx: 30, ry: 34, strength: 1.02 },
          { x: 686, y: 294, rx: 30, ry: 34, strength: 1.02 },
          { x: 819, y: 312, rx: 30, ry: 34, strength: 1.08 },
          { x: 930, y: 299, rx: 30, ry: 34, strength: 1.02 },
          { x: 1052, y: 202, rx: 32, ry: 36, strength: 1.02 },
          { x: 1142, y: 329, rx: 34, ry: 38, strength: 1.08 }
        ];

        for (let y = 170; y < 735; y += 1) {
          for (let x = 470; x < 1200; x += 1) {
            let coverMask = 0;
            for (const region of coverRegions) {
              const dx = (x - region.x) / region.rx;
              const dy = (y - region.y) / region.ry;
              const distance = Math.sqrt(dx * dx + dy * dy);
              if (distance >= 1) continue;
              coverMask = Math.max(coverMask, smoothstep(1, 0, distance) * region.strength);
            }
            if (coverMask <= 0.025) continue;

            const offset = (y * nativeSize.w + x) * 4;
            const r = data[offset];
            const g = data[offset + 1];
            const b = data[offset + 2];
            const luminance = r * 0.299 + g * 0.587 + b * 0.114;
            const neutralR = Math.min(255, 92 + luminance * 0.16);
            const neutralG = Math.min(255, 80 + luminance * 0.14);
            const neutralB = Math.min(255, 66 + luminance * 0.12);
            const amount = Math.min(0.98, coverMask * 1.36);
            data[offset] = Math.round(r * (1 - amount) + neutralR * amount);
            data[offset + 1] = Math.round(g * (1 - amount) + neutralG * amount);
            data[offset + 2] = Math.round(b * (1 - amount) + neutralB * amount);
          }
        }

        const checkPatchRegions = [
          { x: 510, y: 704, rx: 42, ry: 32, strength: 1.12, target: [96, 84, 68] },
          { x: 704, y: 700, rx: 42, ry: 32, strength: 1.12, target: [94, 83, 68] },
          { x: 872, y: 690, rx: 42, ry: 32, strength: 1.12, target: [98, 86, 70] }
        ];

        for (let y = 662; y < 724; y += 1) {
          for (let x = 468; x < 914; x += 1) {
            let patch;
            let patchMask = 0;
            for (const region of checkPatchRegions) {
              const dx = (x - region.x) / region.rx;
              const dy = (y - region.y) / region.ry;
              const distance = Math.sqrt(dx * dx + dy * dy);
              if (distance >= 1) continue;
              const mask = (1 - smoothstep(0, 1, distance)) * region.strength;
              if (mask > patchMask) {
                patchMask = mask;
                patch = region;
              }
            }
            if (!patch || patchMask <= 0.025) continue;

            const offset = (y * nativeSize.w + x) * 4;
            const r = data[offset];
            const g = data[offset + 1];
            const b = data[offset + 2];
            const amount = Math.min(0.94, patchMask * 1.18);
            data[offset] = Math.round(r * (1 - amount) + patch.target[0] * amount);
            data[offset + 1] = Math.round(g * (1 - amount) + patch.target[1] * amount);
            data[offset + 2] = Math.round(b * (1 - amount) + patch.target[2] * amount);
          }
        }

        const stage5PatchRegions = [
          { x: 1176, y: 540, rx: 42, ry: 48, strength: 0.82, target: [100, 93, 82] },
          { x: 1180, y: 592, rx: 28, ry: 28, strength: 0.82, target: [112, 105, 94] }
        ];
        const stage5PatchSegments = [
          { x1: 1018, y1: 588, x2: 1174, y2: 558, r: 24, strength: 0.74, target: [126, 116, 98] }
        ];

        for (let y = 500; y < 620; y += 1) {
          for (let x = 990; x < 1218; x += 1) {
            let targetColor;
            let patchMask = 0;
            for (const region of stage5PatchRegions) {
              const dx = (x - region.x) / region.rx;
              const dy = (y - region.y) / region.ry;
              const distance = Math.sqrt(dx * dx + dy * dy);
              if (distance >= 1) continue;
              const mask = (1 - smoothstep(0, 1, distance)) * region.strength;
              if (mask > patchMask) {
                patchMask = mask;
                targetColor = region.target;
              }
            }
            for (const segment of stage5PatchSegments) {
              const distance = distanceToSegment(x, y, segment.x1, segment.y1, segment.x2, segment.y2);
              if (distance >= segment.r) continue;
              const mask = smoothstep(segment.r, 0, distance) * segment.strength;
              if (mask > patchMask) {
                patchMask = mask;
                targetColor = segment.target;
              }
            }
            if (!targetColor || patchMask <= 0.025) continue;

            const offset = (y * nativeSize.w + x) * 4;
            const r = data[offset];
            const g = data[offset + 1];
            const b = data[offset + 2];
            const amount = Math.min(0.9, patchMask * 1.06);
            data[offset] = Math.round(r * (1 - amount) + targetColor[0] * amount);
            data[offset + 1] = Math.round(g * (1 - amount) + targetColor[1] * amount);
            data[offset + 2] = Math.round(b * (1 - amount) + targetColor[2] * amount);
          }
        }

        const stage4ScarPatchRegions = [
          { x: 1022, y: 512, rx: 46, ry: 58, strength: 0.98, target: [116, 108, 96] },
          { x: 1075, y: 641, rx: 36, ry: 34, strength: 0.9, target: [118, 108, 86] },
          { x: 1018, y: 604, rx: 92, ry: 110, strength: 0.38, target: [94, 88, 76], innerRx: 46, innerRy: 58 }
        ];
        const stage4ScarPatchSegments = [
          { x1: 940, y1: 474, x2: 942, y2: 538, r: 22, strength: 0.82, target: [112, 104, 92] },
          { x1: 1004, y1: 636, x2: 1082, y2: 660, r: 18, strength: 0.56, target: [108, 98, 82] }
        ];

        for (let y = 470; y < 690; y += 1) {
          for (let x = 930; x < 1120; x += 1) {
            let targetColor;
            let patchMask = 0;
            for (const region of stage4ScarPatchRegions) {
              const dx = (x - region.x) / region.rx;
              const dy = (y - region.y) / region.ry;
              const distance = Math.sqrt(dx * dx + dy * dy);
              if (distance >= 1) continue;
              let mask = (1 - smoothstep(0, 1, distance)) * region.strength;
              if (region.innerRx && region.innerRy) {
                const innerDistance = Math.sqrt(
                  ((x - region.x) / region.innerRx) ** 2
                  + ((y - region.y) / region.innerRy) ** 2
                );
                mask *= smoothstep(0.64, 0.94, innerDistance);
              }
              if (mask > patchMask) {
                patchMask = mask;
                targetColor = region.target;
              }
            }
            for (const segment of stage4ScarPatchSegments) {
              const distance = distanceToSegment(x, y, segment.x1, segment.y1, segment.x2, segment.y2);
              if (distance >= segment.r) continue;
              const mask = smoothstep(segment.r, 0, distance) * segment.strength;
              if (mask > patchMask) {
                patchMask = mask;
                targetColor = segment.target;
              }
            }
            if (!targetColor || patchMask <= 0.025) continue;

            const offset = (y * nativeSize.w + x) * 4;
            const r = data[offset];
            const g = data[offset + 1];
            const b = data[offset + 2];
            const amount = Math.min(0.88, patchMask * 1.04);
            data[offset] = Math.round(r * (1 - amount) + targetColor[0] * amount);
            data[offset + 1] = Math.round(g * (1 - amount) + targetColor[1] * amount);
            data[offset + 2] = Math.round(b * (1 - amount) + targetColor[2] * amount);
          }
        }

        ctx.putImageData(imageData, 0, 0);
        return canvas.toDataURL("image/png");

        function smoothstep(edge0, edge1, value) {
          const t = Math.max(0, Math.min(1, (value - edge0) / Math.max(1, edge1 - edge0)));
          return t * t * (3 - 2 * t);
        }

        function distanceToSegment(px, py, ax, ay, bx, by) {
          const dx = bx - ax;
          const dy = by - ay;
          if (dx === 0 && dy === 0) return Math.hypot(px - ax, py - ay);
          const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)));
          return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
        }
      }, {
        base64: sourceBuffer.toString("base64"),
        nativeSize: target.nativeSize
      })
      : target.kind === "world_map_stage_badge"
      ? await page.evaluate(async ({ base64, crop, nativeSize, stateVariant }) => {
        const image = await new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error("source concept image failed to load"));
          img.src = `data:image/png;base64,${base64}`;
        });

        const canvas = document.createElement("canvas");
        canvas.width = nativeSize.w;
        canvas.height = nativeSize.h;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) throw new Error("2d canvas context unavailable");

        ctx.drawImage(image, crop.x, crop.y, crop.w, crop.h, 0, 0, nativeSize.w, nativeSize.h);
        const imageData = ctx.getImageData(0, 0, nativeSize.w, nativeSize.h);
        const data = imageData.data;
        const centerX = nativeSize.w * 0.5;
        const centerY = stateVariant === "sealed" ? nativeSize.h * 0.46 : stateVariant === "locked" ? nativeSize.h * 0.48 : nativeSize.h * 0.5;
        const radiusX = nativeSize.w * (stateVariant === "locked" ? 0.43 : stateVariant === "sealed" ? 0.35 : stateVariant === "completedLate" ? 0.37 : 0.42);
        const radiusY = nativeSize.h * (stateVariant === "locked" ? 0.42 : stateVariant === "sealed" ? 0.38 : stateVariant === "completedLate" ? 0.38 : 0.43);

        for (let y = 0; y < nativeSize.h; y += 1) {
          for (let x = 0; x < nativeSize.w; x += 1) {
            const offset = (y * nativeSize.w + x) * 4;
            const r = data[offset];
            const g = data[offset + 1];
            const b = data[offset + 2];
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            const saturation = max - min;
            const luminance = r * 0.299 + g * 0.587 + b * 0.114;
            const dx = (x - centerX) / radiusX;
            const dy = (y - centerY) / radiusY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const radial = distance <= 0.72 ? 1 : Math.max(0, 1 - (distance - 0.72) / 0.18);
            const sealedShape = stateVariant === "sealed"
              ? Math.max(0, 1 - Math.max(0, Math.abs(x - centerX) / (nativeSize.w * 0.34) + Math.abs(y - centerY) / (nativeSize.h * 0.42) - 0.82) / 0.18)
              : 1;
            const gold = smoothstep(44, 146, r + g * 0.72 - b * 1.48 + saturation * 0.18);
            const green = smoothstep(16, 104, g - Math.max(r, b) * 0.72 + saturation * 0.18);
            const red = smoothstep(28, 120, r - Math.max(g, b) * 0.92 + saturation * 0.18);
            const silver = smoothstep(22, 118, luminance - Math.abs(r - g) * 0.36 - Math.abs(g - b) * 0.36);
            const coolEdge = smoothstep(8, 84, b - r * 0.72 + saturation * 0.12);
            const darkInk = (1 - smoothstep(42, 132, luminance)) * smoothstep(12, 92, saturation);
            const parchment = r > 132 && g > 106 && b > 78 && saturation < 78;

            let keep = 0;
            if (stateVariant === "locked") {
              keep = Math.max(red, gold * 0.54, darkInk * 0.68) * radial;
              if (parchment && red < 0.24 && gold < 0.34 && darkInk < 0.36) keep = 0;
              data[offset] = Math.min(255, Math.round(r * 1.06 + red * 20 + gold * 6));
              data[offset + 1] = Math.min(255, Math.round(g * 0.98 + gold * 9));
              data[offset + 2] = Math.max(0, Math.round(b * 0.94));
            } else if (stateVariant === "sealed") {
              const innerInk = distance < 0.72 ? darkInk * (1 - smoothstep(28, 96, luminance)) * 0.36 : 0;
              keep = Math.max(silver, coolEdge * 0.72, innerInk) * radial * sealedShape;
              if (parchment && silver < 0.52 && coolEdge < 0.42) keep = 0;
              data[offset] = Math.min(255, Math.round(r * 1.02 + silver * 9));
              data[offset + 1] = Math.min(255, Math.round(g * 1.03 + silver * 9));
              data[offset + 2] = Math.min(255, Math.round(b * 1.08 + silver * 12 + coolEdge * 6));
            } else if (stateVariant === "completedLate") {
              keep = Math.max(green * 0.84, gold * 0.68, coolEdge * 0.26) * radial;
              if (parchment && green < 0.24 && gold < 0.3 && coolEdge < 0.42) keep = 0;
              data[offset] = Math.min(255, Math.round(r * 0.98 + gold * 6));
              data[offset + 1] = Math.min(255, Math.round(g * 1.01 + green * 10 + coolEdge * 4));
              data[offset + 2] = Math.min(255, Math.round(b * 0.98 + coolEdge * 9));
            } else {
              keep = Math.max(green, gold * 0.86) * radial;
              if (parchment && green < 0.22 && gold < 0.32) keep = 0;
              data[offset] = Math.min(255, Math.round(r * 1.04 + gold * 10));
              data[offset + 1] = Math.min(255, Math.round(g * 1.07 + green * 18 + gold * 5));
              data[offset + 2] = Math.max(0, Math.round(b * 0.94));
            }

            if (keep <= 0.08) {
              data[offset + 3] = 0;
              continue;
            }
            const alphaScale = stateVariant === "completedLate" ? 0.82 : 1;
            const alphaCap = stateVariant === "completedLate" ? 218 : 242;
            data[offset + 3] = Math.round(Math.min(alphaCap, 238 * keep * (0.58 + radial * 0.5) * alphaScale));
          }
        }

        ctx.putImageData(imageData, 0, 0);
        return canvas.toDataURL("image/png");

        function smoothstep(edge0, edge1, value) {
          const t = Math.max(0, Math.min(1, (value - edge0) / Math.max(1, edge1 - edge0)));
          return t * t * (3 - 2 * t);
        }
      }, {
        base64: sourceBuffer.toString("base64"),
        crop: target.crop,
        nativeSize: target.nativeSize,
        stateVariant: target.stateVariant
      })
      : target.kind === "current_stage_frame"
      ? await page.evaluate(async ({ base64, crop, nativeSize }) => {
        const image = await new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error("source concept image failed to load"));
          img.src = `data:image/png;base64,${base64}`;
        });

        const canvas = document.createElement("canvas");
        canvas.width = nativeSize.w;
        canvas.height = nativeSize.h;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) throw new Error("2d canvas context unavailable");

        ctx.drawImage(image, crop.x, crop.y, crop.w, crop.h, 0, 0, nativeSize.w, nativeSize.h);
        const imageData = ctx.getImageData(0, 0, nativeSize.w, nativeSize.h);
        const data = imageData.data;
        const centerX = nativeSize.w * 0.48;
        const centerY = nativeSize.h * 0.49;
        const statusX = nativeSize.w * 0.8;
        const statusY = nativeSize.h * 0.62;

        for (let y = 0; y < nativeSize.h; y += 1) {
          for (let x = 0; x < nativeSize.w; x += 1) {
            const offset = (y * nativeSize.w + x) * 4;
            const r = data[offset];
            const g = data[offset + 1];
            const b = data[offset + 2];
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            const saturation = max - min;
            const luminance = r * 0.299 + g * 0.587 + b * 0.114;
            const dx = (x - centerX) / (nativeSize.w * 0.42);
            const dy = (y - centerY) / (nativeSize.h * 0.45);
            const shieldDistance = Math.sqrt(dx * dx + dy * dy);
            const outerFalloff = 1 - smoothstep(0.94, 1.18, shieldDistance);
            const centerCutout = smoothstep(
              0.74,
              0.98,
              Math.hypot((x - centerX) / (nativeSize.w * 0.22), (y - centerY) / (nativeSize.h * 0.24))
            );
            const ring = smoothstep(0.34, 0.58, shieldDistance) * outerFalloff * centerCutout;
            const statusCutout = smoothstep(
              0.78,
              1.04,
              Math.hypot((x - statusX) / (nativeSize.w * 0.18), (y - statusY) / (nativeSize.h * 0.2))
            );
            const markerCutout = smoothstep(
              0.82,
              1.08,
              Math.hypot((x - centerX) / (nativeSize.w * 0.17), (y - nativeSize.h * 0.08) / (nativeSize.h * 0.15))
            );
            const topRouteCutout = y < nativeSize.h * 0.31 && (x < nativeSize.w * 0.34 || x > nativeSize.w * 0.66) ? 0 : 1;
            const lowerLeftRouteCutout = x < nativeSize.w * 0.31 && y > nativeSize.h * 0.58 ? 0 : 1;
            const rightRouteCutout = x > nativeSize.w * 0.72 && y > nativeSize.h * 0.42 && y < nativeSize.h * 0.62 ? 0 : 1;
            const routeCutout = topRouteCutout * lowerLeftRouteCutout * rightRouteCutout;
            const cyan = smoothstep(34, 136, Math.min(g, b) - r * 0.72 + saturation * 0.08);
            const blue = smoothstep(10, 86, b - r * 0.58 + (g - r) * 0.12 + saturation * 0.12)
              * (1 - smoothstep(154, 230, luminance));
            const gold = smoothstep(46, 148, r + g * 0.72 - b * 1.48 + saturation * 0.16);
            const darkEdge = (1 - smoothstep(52, 138, luminance)) * smoothstep(18, 108, saturation);
            const parchment = r > 128 && g > 102 && b > 74 && saturation < 82;

            let keep = Math.max(cyan * 1.06, blue * 0.98, gold * 0.18) * ring * statusCutout * markerCutout * routeCutout;
            if (parchment) keep = 0;

            if (keep <= 0.08) {
              data[offset + 3] = 0;
              continue;
            }

            data[offset] = Math.min(255, Math.round(r * 0.98 + cyan * 4 + gold * 8));
            data[offset + 1] = Math.min(255, Math.round(g * 1.02 + cyan * 12 + gold * 5));
            data[offset + 2] = Math.min(255, Math.round(b * 1.06 + cyan * 18));
            data[offset + 3] = Math.round(Math.min(232, 238 * keep * (0.58 + outerFalloff * 0.48)));
          }
        }

        ctx.putImageData(imageData, 0, 0);
        return canvas.toDataURL("image/png");

        function smoothstep(edge0, edge1, value) {
          const t = Math.max(0, Math.min(1, (value - edge0) / Math.max(1, edge1 - edge0)));
          return t * t * (3 - 2 * t);
        }
      }, {
        base64: sourceBuffer.toString("base64"),
        crop: target.crop,
        nativeSize: target.nativeSize
      })
      : target.kind === "completed_stage_frame"
      ? await page.evaluate(async ({ base64, crop, nativeSize }) => {
        const image = await new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error("source concept image failed to load"));
          img.src = `data:image/png;base64,${base64}`;
        });

        const canvas = document.createElement("canvas");
        canvas.width = nativeSize.w;
        canvas.height = nativeSize.h;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) throw new Error("2d canvas context unavailable");

        ctx.drawImage(image, crop.x, crop.y, crop.w, crop.h, 0, 0, nativeSize.w, nativeSize.h);
        const imageData = ctx.getImageData(0, 0, nativeSize.w, nativeSize.h);
        const data = imageData.data;
        const centerX = nativeSize.w * 0.49;
        const centerY = nativeSize.h * 0.48;
        const checkX = nativeSize.w * 0.5;
        const checkY = nativeSize.h * 0.8;

        for (let y = 0; y < nativeSize.h; y += 1) {
          for (let x = 0; x < nativeSize.w; x += 1) {
            const offset = (y * nativeSize.w + x) * 4;
            const r = data[offset];
            const g = data[offset + 1];
            const b = data[offset + 2];
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            const saturation = max - min;
            const luminance = r * 0.299 + g * 0.587 + b * 0.114;
            const outer = [
              { x: nativeSize.w * 0.5, y: nativeSize.h * 0.11 },
              { x: nativeSize.w * 0.77, y: nativeSize.h * 0.25 },
              { x: nativeSize.w * 0.82, y: nativeSize.h * 0.49 },
              { x: nativeSize.w * 0.68, y: nativeSize.h * 0.69 },
              { x: nativeSize.w * 0.5, y: nativeSize.h * 0.82 },
              { x: nativeSize.w * 0.32, y: nativeSize.h * 0.69 },
              { x: nativeSize.w * 0.18, y: nativeSize.h * 0.49 },
              { x: nativeSize.w * 0.23, y: nativeSize.h * 0.25 }
            ];
            const inner = [
              { x: nativeSize.w * 0.5, y: nativeSize.h * 0.22 },
              { x: nativeSize.w * 0.66, y: nativeSize.h * 0.32 },
              { x: nativeSize.w * 0.7, y: nativeSize.h * 0.49 },
              { x: nativeSize.w * 0.6, y: nativeSize.h * 0.61 },
              { x: nativeSize.w * 0.5, y: nativeSize.h * 0.68 },
              { x: nativeSize.w * 0.4, y: nativeSize.h * 0.61 },
              { x: nativeSize.w * 0.3, y: nativeSize.h * 0.49 },
              { x: nativeSize.w * 0.34, y: nativeSize.h * 0.32 }
            ];
            const outerMask = pointInPolygon(x, y, outer) ? 1 : 0;
            const innerCutout = pointInPolygon(x, y, inner) ? 0 : 1;
            const dy = (y - centerY) / (nativeSize.h * 0.43);
            const outerFalloff = 1 - smoothstep(0.78, 1.12, Math.abs(dy));
            const checkCutout = smoothstep(
              0.78,
              1.04,
              Math.hypot((x - checkX) / (nativeSize.w * 0.32), (y - checkY) / (nativeSize.h * 0.24))
            );
            const ring = outerMask * innerCutout * checkCutout;
            const lowerRouteCutout = y > nativeSize.h * 0.72 && (x < nativeSize.w * 0.35 || x > nativeSize.w * 0.65) ? 0 : 1;
            const sideRouteCutout = (x < nativeSize.w * 0.2 || x > nativeSize.w * 0.72) && y > nativeSize.h * 0.36 ? 0 : 1;
            const routeCutout = lowerRouteCutout * sideRouteCutout;
            const green = smoothstep(18, 112, g - Math.max(r, b) * 0.72 + saturation * 0.16);
            const cyan = smoothstep(18, 112, Math.min(g, b) - r * 0.66 + saturation * 0.1);
            const gold = smoothstep(44, 142, r + g * 0.78 - b * 1.5 + saturation * 0.16);
            const parchment = r > 126 && g > 100 && b > 72 && saturation < 86;

            let keep = Math.max(green * 1.06, cyan * 0.96, gold * 0.16) * ring * routeCutout;
            if (parchment && green < 0.3 && cyan < 0.32 && gold < 0.5) keep = 0;

            if (keep <= 0.08) {
              data[offset + 3] = 0;
              continue;
            }

            data[offset] = Math.min(255, Math.round(r * 1.02 + gold * 9));
            data[offset + 1] = Math.min(255, Math.round(g * 1.06 + green * 16 + cyan * 6));
            data[offset + 2] = Math.min(255, Math.round(b * 1.02 + cyan * 10));
            data[offset + 3] = Math.round(Math.min(232, 238 * keep * (0.58 + outerFalloff * 0.46)));
          }
        }

        ctx.putImageData(imageData, 0, 0);
        return canvas.toDataURL("image/png");

        function smoothstep(edge0, edge1, value) {
          const t = Math.max(0, Math.min(1, (value - edge0) / Math.max(1, edge1 - edge0)));
          return t * t * (3 - 2 * t);
        }

        function pointInPolygon(x, y, polygon) {
          let inside = false;
          for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i, i += 1) {
            const xi = polygon[i].x;
            const yi = polygon[i].y;
            const xj = polygon[j].x;
            const yj = polygon[j].y;
            const intersects = ((yi > y) !== (yj > y))
              && x < ((xj - xi) * (y - yi)) / ((yj - yi) || 1) + xi;
            if (intersects) inside = !inside;
          }
          return inside;
        }
      }, {
        base64: sourceBuffer.toString("base64"),
        crop: target.crop,
        nativeSize: target.nativeSize
      })
      : target.kind === "locked_stage_frame"
      ? await page.evaluate(async ({ base64, crop, nativeSize }) => {
        const image = await new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error("source concept image failed to load"));
          img.src = `data:image/png;base64,${base64}`;
        });

        const canvas = document.createElement("canvas");
        canvas.width = nativeSize.w;
        canvas.height = nativeSize.h;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) throw new Error("2d canvas context unavailable");

        ctx.drawImage(image, crop.x, crop.y, crop.w, crop.h, 0, 0, nativeSize.w, nativeSize.h);
        const imageData = ctx.getImageData(0, 0, nativeSize.w, nativeSize.h);
        const data = imageData.data;
        const centerX = nativeSize.w * 0.49;
        const centerY = nativeSize.h * 0.49;
        const numberX = nativeSize.w * 0.5;
        const numberY = nativeSize.h * 0.36;
        const lockX = nativeSize.w * 0.5;
        const lockY = nativeSize.h * 0.67;

        for (let y = 0; y < nativeSize.h; y += 1) {
          for (let x = 0; x < nativeSize.w; x += 1) {
            const offset = (y * nativeSize.w + x) * 4;
            const r = data[offset];
            const g = data[offset + 1];
            const b = data[offset + 2];
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            const saturation = max - min;
            const luminance = r * 0.299 + g * 0.587 + b * 0.114;
            const outer = [
              { x: nativeSize.w * 0.5, y: nativeSize.h * 0.07 },
              { x: nativeSize.w * 0.74, y: nativeSize.h * 0.2 },
              { x: nativeSize.w * 0.84, y: nativeSize.h * 0.46 },
              { x: nativeSize.w * 0.7, y: nativeSize.h * 0.75 },
              { x: nativeSize.w * 0.5, y: nativeSize.h * 0.9 },
              { x: nativeSize.w * 0.3, y: nativeSize.h * 0.75 },
              { x: nativeSize.w * 0.16, y: nativeSize.h * 0.46 },
              { x: nativeSize.w * 0.26, y: nativeSize.h * 0.2 }
            ];
            const inner = [
              { x: nativeSize.w * 0.5, y: nativeSize.h * 0.22 },
              { x: nativeSize.w * 0.63, y: nativeSize.h * 0.31 },
              { x: nativeSize.w * 0.68, y: nativeSize.h * 0.48 },
              { x: nativeSize.w * 0.61, y: nativeSize.h * 0.62 },
              { x: nativeSize.w * 0.5, y: nativeSize.h * 0.7 },
              { x: nativeSize.w * 0.39, y: nativeSize.h * 0.62 },
              { x: nativeSize.w * 0.32, y: nativeSize.h * 0.48 },
              { x: nativeSize.w * 0.37, y: nativeSize.h * 0.31 }
            ];
            const outerMask = pointInPolygon(x, y, outer) ? 1 : 0;
            const innerCutout = pointInPolygon(x, y, inner) ? 0 : 1;
            const dx = (x - centerX) / (nativeSize.w * 0.44);
            const dy = (y - centerY) / (nativeSize.h * 0.46);
            const radial = Math.sqrt(dx * dx + dy * dy);
            const outerFalloff = 1 - smoothstep(0.76, 1.12, radial);
            const numberCutout = smoothstep(
              0.78,
              1.06,
              Math.hypot((x - numberX) / (nativeSize.w * 0.23), (y - numberY) / (nativeSize.h * 0.22))
            );
            const lockCutout = smoothstep(
              0.72,
              1.02,
              Math.hypot((x - lockX) / (nativeSize.w * 0.29), (y - lockY) / (nativeSize.h * 0.23))
            );
            const sideRouteCutout = (x < nativeSize.w * 0.2 || x > nativeSize.w * 0.78) && y > nativeSize.h * 0.34 ? 0 : 1;
            const lowerRouteCutout = y > nativeSize.h * 0.76 && (x < nativeSize.w * 0.36 || x > nativeSize.w * 0.64) ? 0 : 1;
            const routeCutout = sideRouteCutout * lowerRouteCutout;
            const red = smoothstep(26, 132, r - Math.max(g, b) * 0.72 + saturation * 0.18);
            const gold = smoothstep(48, 150, r + g * 0.74 - b * 1.5 + saturation * 0.16);
            const darkEdge = (1 - smoothstep(52, 136, luminance)) * smoothstep(18, 108, saturation);
            const parchment = r > 126 && g > 100 && b > 72 && saturation < 82;
            const brightRoute = r > 168 && g > 158 && b > 136 && saturation < 76;

            let keep = Math.max(red * 1.08, gold * 0.2, darkEdge * 0.28)
              * outerMask
              * innerCutout
              * numberCutout
              * lockCutout
              * routeCutout;
            if ((parchment && red < 0.34 && gold < 0.48) || brightRoute) keep = 0;

            if (keep <= 0.08) {
              data[offset + 3] = 0;
              continue;
            }

            data[offset] = Math.min(255, Math.round(r * 1.05 + red * 22 + gold * 8));
            data[offset + 1] = Math.min(255, Math.round(g * 0.96 + gold * 10));
            data[offset + 2] = Math.max(0, Math.round(b * 0.9));
            data[offset + 3] = Math.round(Math.min(232, 238 * keep * (0.58 + outerFalloff * 0.46)));
          }
        }

        ctx.putImageData(imageData, 0, 0);
        return canvas.toDataURL("image/png");

        function smoothstep(edge0, edge1, value) {
          const t = Math.max(0, Math.min(1, (value - edge0) / Math.max(1, edge1 - edge0)));
          return t * t * (3 - 2 * t);
        }

        function pointInPolygon(x, y, polygon) {
          let inside = false;
          for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i, i += 1) {
            const xi = polygon[i].x;
            const yi = polygon[i].y;
            const xj = polygon[j].x;
            const yj = polygon[j].y;
            const intersects = ((yi > y) !== (yj > y))
              && x < ((xj - xi) * (y - yi)) / ((yj - yi) || 1) + xi;
            if (intersects) inside = !inside;
          }
          return inside;
        }
      }, {
        base64: sourceBuffer.toString("base64"),
        crop: target.crop,
        nativeSize: target.nativeSize
      })
      : target.kind === "sealed_stage_frame"
      ? await page.evaluate(async ({ base64, crop, nativeSize }) => {
        const image = await new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error("source concept image failed to load"));
          img.src = `data:image/png;base64,${base64}`;
        });

        const canvas = document.createElement("canvas");
        canvas.width = nativeSize.w;
        canvas.height = nativeSize.h;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) throw new Error("2d canvas context unavailable");

        ctx.drawImage(image, crop.x, crop.y, crop.w, crop.h, 0, 0, nativeSize.w, nativeSize.h);
        const imageData = ctx.getImageData(0, 0, nativeSize.w, nativeSize.h);
        const data = imageData.data;
        const centerX = nativeSize.w * 0.49;
        const centerY = nativeSize.h * 0.5;
        const numberX = nativeSize.w * 0.5;
        const numberY = nativeSize.h * 0.36;
        const sealX = nativeSize.w * 0.5;
        const sealY = nativeSize.h * 0.73;

        for (let y = 0; y < nativeSize.h; y += 1) {
          for (let x = 0; x < nativeSize.w; x += 1) {
            const offset = (y * nativeSize.w + x) * 4;
            const r = data[offset];
            const g = data[offset + 1];
            const b = data[offset + 2];
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            const saturation = max - min;
            const luminance = r * 0.299 + g * 0.587 + b * 0.114;
            const outer = [
              { x: nativeSize.w * 0.5, y: nativeSize.h * 0.08 },
              { x: nativeSize.w * 0.75, y: nativeSize.h * 0.21 },
              { x: nativeSize.w * 0.83, y: nativeSize.h * 0.49 },
              { x: nativeSize.w * 0.68, y: nativeSize.h * 0.76 },
              { x: nativeSize.w * 0.5, y: nativeSize.h * 0.89 },
              { x: nativeSize.w * 0.32, y: nativeSize.h * 0.76 },
              { x: nativeSize.w * 0.17, y: nativeSize.h * 0.49 },
              { x: nativeSize.w * 0.25, y: nativeSize.h * 0.21 }
            ];
            const inner = [
              { x: nativeSize.w * 0.5, y: nativeSize.h * 0.23 },
              { x: nativeSize.w * 0.63, y: nativeSize.h * 0.32 },
              { x: nativeSize.w * 0.68, y: nativeSize.h * 0.5 },
              { x: nativeSize.w * 0.6, y: nativeSize.h * 0.64 },
              { x: nativeSize.w * 0.5, y: nativeSize.h * 0.72 },
              { x: nativeSize.w * 0.4, y: nativeSize.h * 0.64 },
              { x: nativeSize.w * 0.32, y: nativeSize.h * 0.5 },
              { x: nativeSize.w * 0.37, y: nativeSize.h * 0.32 }
            ];
            const outerMask = pointInPolygon(x, y, outer) ? 1 : 0;
            const innerCutout = pointInPolygon(x, y, inner) ? 0 : 1;
            const dx = (x - centerX) / (nativeSize.w * 0.44);
            const dy = (y - centerY) / (nativeSize.h * 0.46);
            const radial = Math.sqrt(dx * dx + dy * dy);
            const outerFalloff = 1 - smoothstep(0.76, 1.12, radial);
            const numberCutout = smoothstep(
              0.76,
              1.04,
              Math.hypot((x - numberX) / (nativeSize.w * 0.26), (y - numberY) / (nativeSize.h * 0.22))
            );
            const sealCutout = smoothstep(
              0.76,
              1.04,
              Math.hypot((x - sealX) / (nativeSize.w * 0.3), (y - sealY) / (nativeSize.h * 0.22))
            );
            const sideRouteCutout = (x < nativeSize.w * 0.2 || x > nativeSize.w * 0.78) && y > nativeSize.h * 0.34 ? 0 : 1;
            const lowerRouteCutout = y > nativeSize.h * 0.76 && (x < nativeSize.w * 0.36 || x > nativeSize.w * 0.64) ? 0 : 1;
            const routeCutout = sideRouteCutout * lowerRouteCutout;
            const silver = smoothstep(66, 178, luminance) * (1 - smoothstep(52, 132, saturation));
            const coolEdge = smoothstep(8, 72, b + g * 0.4 - r * 0.86 + saturation * 0.08)
              * (1 - smoothstep(176, 232, luminance));
            const gold = smoothstep(50, 146, r + g * 0.72 - b * 1.48 + saturation * 0.14);
            const darkEdge = (1 - smoothstep(48, 128, luminance)) * smoothstep(16, 104, saturation);
            const parchment = r > 126 && g > 100 && b > 72 && saturation < 82;
            const brightRoute = r > 164 && g > 154 && b > 132 && saturation < 78;

            let keep = Math.max(silver * 0.96, coolEdge * 1.02, gold * 0.2, darkEdge * 0.22)
              * outerMask
              * innerCutout
              * numberCutout
              * sealCutout
              * routeCutout;
            if ((parchment && coolEdge < 0.34 && silver < 0.44) || brightRoute) keep = 0;

            if (keep <= 0.08) {
              data[offset + 3] = 0;
              continue;
            }

            data[offset] = Math.min(255, Math.round(r * 0.98 + gold * 6));
            data[offset + 1] = Math.min(255, Math.round(g * 1.01 + silver * 5));
            data[offset + 2] = Math.min(255, Math.round(b * 1.03 + coolEdge * 9));
            data[offset + 3] = Math.round(Math.min(226, 232 * keep * (0.56 + outerFalloff * 0.44)));
          }
        }

        ctx.putImageData(imageData, 0, 0);
        return canvas.toDataURL("image/png");

        function smoothstep(edge0, edge1, value) {
          const t = Math.max(0, Math.min(1, (value - edge0) / Math.max(1, edge1 - edge0)));
          return t * t * (3 - 2 * t);
        }

        function pointInPolygon(x, y, polygon) {
          let inside = false;
          for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i, i += 1) {
            const xi = polygon[i].x;
            const yi = polygon[i].y;
            const xj = polygon[j].x;
            const yj = polygon[j].y;
            const intersects = ((yi > y) !== (yj > y))
              && x < ((xj - xi) * (y - yi)) / ((yj - yi) || 1) + xi;
            if (intersects) inside = !inside;
          }
          return inside;
        }
      }, {
        base64: sourceBuffer.toString("base64"),
        crop: target.crop,
        nativeSize: target.nativeSize
      })
      : target.kind === "world_map_stage_body_wash"
      ? await page.evaluate(async ({ base64, crop, nativeSize, stateVariant }) => {
        const image = await new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error("source concept image failed to load"));
          img.src = `data:image/png;base64,${base64}`;
        });

        const canvas = document.createElement("canvas");
        canvas.width = nativeSize.w;
        canvas.height = nativeSize.h;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) throw new Error("2d canvas context unavailable");

        ctx.drawImage(image, crop.x, crop.y, crop.w, crop.h, 0, 0, nativeSize.w, nativeSize.h);
        const imageData = ctx.getImageData(0, 0, nativeSize.w, nativeSize.h);
        const data = imageData.data;
        const centerX = nativeSize.w * 0.49;
        const centerY = nativeSize.h * 0.5;
        const grayLockedVariant = stateVariant === "sealed" || stateVariant === "dormant";
        const numberY = stateVariant === "current"
          ? nativeSize.h * 0.43
          : stateVariant === "locked"
            ? nativeSize.h * 0.32
            : grayLockedVariant
              ? nativeSize.h * 0.35
              : nativeSize.h * 0.36;
        const numberRx = stateVariant === "locked" ? nativeSize.w * 0.31 : grayLockedVariant ? nativeSize.w * 0.27 : nativeSize.w * 0.21;
        const numberRy = stateVariant === "locked" ? nativeSize.h * 0.24 : grayLockedVariant ? nativeSize.h * 0.22 : nativeSize.h * 0.17;
        const lowerIconY = stateVariant === "current" ? nativeSize.h * 0.63 : stateVariant === "locked" ? nativeSize.h * 0.67 : grayLockedVariant ? nativeSize.h * 0.72 : nativeSize.h * 0.77;
        const lowerIconX = stateVariant === "current" ? nativeSize.w * 0.79 : nativeSize.w * 0.5;
        const lowerIconRx = stateVariant === "current" ? nativeSize.w * 0.18 : stateVariant === "locked" ? nativeSize.w * 0.38 : grayLockedVariant ? nativeSize.w * 0.32 : nativeSize.w * 0.28;
        const lowerIconRy = stateVariant === "locked" ? nativeSize.h * 0.27 : grayLockedVariant ? nativeSize.h * 0.24 : nativeSize.h * 0.2;

        for (let y = 0; y < nativeSize.h; y += 1) {
          for (let x = 0; x < nativeSize.w; x += 1) {
            const offset = (y * nativeSize.w + x) * 4;
            const r = data[offset];
            const g = data[offset + 1];
            const b = data[offset + 2];
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            const saturation = max - min;
            const luminance = r * 0.299 + g * 0.587 + b * 0.114;
            const outer = [
              { x: nativeSize.w * 0.5, y: nativeSize.h * 0.09 },
              { x: nativeSize.w * 0.76, y: nativeSize.h * 0.22 },
              { x: nativeSize.w * 0.84, y: nativeSize.h * 0.49 },
              { x: nativeSize.w * 0.68, y: nativeSize.h * 0.77 },
              { x: nativeSize.w * 0.5, y: nativeSize.h * 0.89 },
              { x: nativeSize.w * 0.32, y: nativeSize.h * 0.77 },
              { x: nativeSize.w * 0.16, y: nativeSize.h * 0.49 },
              { x: nativeSize.w * 0.24, y: nativeSize.h * 0.22 }
            ];
            const outerMask = pointInPolygon(x, y, outer) ? 1 : 0;
            const dx = (x - centerX) / (nativeSize.w * 0.43);
            const dy = (y - centerY) / (nativeSize.h * 0.45);
            const radial = Math.sqrt(dx * dx + dy * dy);
            const outerFalloff = 1 - smoothstep(0.78, 1.12, radial);
            const numberCutout = smoothstep(
              0.68,
              1.0,
              Math.hypot((x - centerX) / numberRx, (y - numberY) / numberRy)
            );
            const lowerCutout = smoothstep(
              0.74,
              1.04,
              Math.hypot((x - lowerIconX) / lowerIconRx, (y - lowerIconY) / lowerIconRy)
            );
            const currentMarkerCutout = stateVariant === "current"
              ? smoothstep(
                0.78,
                1.04,
                Math.hypot((x - centerX) / (nativeSize.w * 0.2), (y - nativeSize.h * 0.08) / (nativeSize.h * 0.14))
              )
              : 1;
            const sideRouteCutout = (x < nativeSize.w * 0.18 || x > nativeSize.w * 0.8) && y > nativeSize.h * 0.34 ? 0 : 1;
            const lowerRouteCutout = y > nativeSize.h * 0.75 && (x < nativeSize.w * 0.34 || x > nativeSize.w * 0.66) ? 0 : 1;
            const rightStatusRouteCutout = stateVariant === "current" && x > nativeSize.w * 0.7 && y > nativeSize.h * 0.42 && y < nativeSize.h * 0.68 ? 0 : 1;
            const routeCutout = sideRouteCutout * lowerRouteCutout * rightStatusRouteCutout;
            const cyan = smoothstep(24, 122, Math.min(g, b) - r * 0.68 + saturation * 0.12);
            const blue = smoothstep(14, 92, b - r * 0.56 + (g - r) * 0.12 + saturation * 0.14)
              * (1 - smoothstep(156, 232, luminance));
            const green = smoothstep(18, 116, g - Math.max(r, b) * 0.72 + saturation * 0.16);
            const red = smoothstep(26, 132, r - Math.max(g, b) * 0.72 + saturation * 0.18);
            const silver = smoothstep(64, 176, luminance) * (1 - smoothstep(52, 132, saturation));
            const coolEdge = smoothstep(8, 72, b + g * 0.4 - r * 0.86 + saturation * 0.08)
              * (1 - smoothstep(176, 232, luminance));
            const gold = smoothstep(48, 150, r + g * 0.74 - b * 1.5 + saturation * 0.16);
            const darkEdge = (1 - smoothstep(48, 132, luminance)) * smoothstep(18, 108, saturation);
            const parchment = r > 126 && g > 100 && b > 72 && saturation < 86;
            const brightRoute = r > 166 && g > 154 && b > 132 && saturation < 78;

            let colorKeep = 0;
            if (stateVariant === "current") {
              colorKeep = Math.max(cyan * 1.08, blue * 1.02, gold * 0.24, darkEdge * 0.16);
            } else if (stateVariant === "completed") {
              colorKeep = Math.max(green * 1.12, cyan * 0.82, gold * 0.22, darkEdge * 0.16);
            } else if (grayLockedVariant) {
              colorKeep = Math.max(silver * 0.98, coolEdge * 1.04, gold * 0.2, darkEdge * 0.2);
            } else {
              colorKeep = Math.max(red * 1.12, gold * 0.24, darkEdge * 0.2);
            }

            let keep = colorKeep
              * outerMask
              * outerFalloff
              * numberCutout
              * lowerCutout
              * currentMarkerCutout
              * routeCutout;
            if ((parchment && colorKeep < 0.42) || brightRoute) keep = 0;

            if (keep <= 0.06) {
              data[offset + 3] = 0;
              continue;
            }

            if (stateVariant === "current") {
              data[offset] = Math.min(255, Math.round(r * 0.98 + cyan * 6 + gold * 7));
              data[offset + 1] = Math.min(255, Math.round(g * 1.03 + cyan * 12 + gold * 5));
              data[offset + 2] = Math.min(255, Math.round(b * 1.07 + cyan * 17));
            } else if (stateVariant === "completed") {
              data[offset] = Math.min(255, Math.round(r * 1.0 + gold * 8));
              data[offset + 1] = Math.min(255, Math.round(g * 1.07 + green * 16 + cyan * 5));
              data[offset + 2] = Math.min(255, Math.round(b * 1.02 + cyan * 8));
            } else if (grayLockedVariant) {
              data[offset] = Math.min(255, Math.round(r * 0.98 + gold * 6));
              data[offset + 1] = Math.min(255, Math.round(g * 1.01 + silver * 5));
              data[offset + 2] = Math.min(255, Math.round(b * 1.03 + coolEdge * 9));
            } else {
              data[offset] = Math.min(255, Math.round(r * 1.05 + red * 20 + gold * 8));
              data[offset + 1] = Math.min(255, Math.round(g * 0.96 + gold * 9));
              data[offset + 2] = Math.max(0, Math.round(b * 0.9));
            }
            data[offset + 3] = Math.round(Math.min(216, 220 * keep * (0.48 + outerFalloff * 0.36)));
          }
        }

        ctx.putImageData(imageData, 0, 0);
        return canvas.toDataURL("image/png");

        function smoothstep(edge0, edge1, value) {
          const t = Math.max(0, Math.min(1, (value - edge0) / Math.max(1, edge1 - edge0)));
          return t * t * (3 - 2 * t);
        }

        function pointInPolygon(x, y, polygon) {
          let inside = false;
          for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i, i += 1) {
            const xi = polygon[i].x;
            const yi = polygon[i].y;
            const xj = polygon[j].x;
            const yj = polygon[j].y;
            const intersects = ((yi > y) !== (yj > y))
              && x < ((xj - xi) * (y - yi)) / ((yj - yi) || 1) + xi;
            if (intersects) inside = !inside;
          }
          return inside;
        }
      }, {
        base64: sourceBuffer.toString("base64"),
        crop: target.crop,
        nativeSize: target.nativeSize,
        stateVariant: target.stateVariant
      })
      : target.kind === "world_map_route_thread"
      ? await page.evaluate(async ({ base64, crop, nativeSize }) => {
        const image = await new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error("source concept image failed to load"));
          img.src = `data:image/png;base64,${base64}`;
        });

        const canvas = document.createElement("canvas");
        canvas.width = nativeSize.w;
        canvas.height = nativeSize.h;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) throw new Error("2d canvas context unavailable");

        const glow = ctx.createLinearGradient(0, nativeSize.h * 0.5, nativeSize.w, nativeSize.h * 0.5);
        glow.addColorStop(0, "rgba(66, 215, 206, 0)");
        glow.addColorStop(0.18, "rgba(66, 215, 206, 0.1)");
        glow.addColorStop(0.5, "rgba(88, 244, 233, 0.18)");
        glow.addColorStop(0.82, "rgba(66, 215, 206, 0.1)");
        glow.addColorStop(1, "rgba(66, 215, 206, 0)");
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, nativeSize.w, nativeSize.h);
        ctx.drawImage(image, crop.x, crop.y, crop.w, crop.h, 0, 0, nativeSize.w, nativeSize.h);

        const imageData = ctx.getImageData(0, 0, nativeSize.w, nativeSize.h);
        const data = imageData.data;
        const centerY = nativeSize.h * 0.5;

        for (let y = 0; y < nativeSize.h; y += 1) {
          for (let x = 0; x < nativeSize.w; x += 1) {
            const offset = (y * nativeSize.w + x) * 4;
            const r = data[offset];
            const g = data[offset + 1];
            const b = data[offset + 2];
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            const saturation = max - min;
            const luminance = r * 0.299 + g * 0.587 + b * 0.114;
            const lane = 1 - smoothstep(0.46, 1.0, Math.abs(y - centerY) / (nativeSize.h * 0.5));
            const cap = smoothstep(0.02, 0.14, x / nativeSize.w)
              * (1 - smoothstep(0.86, 0.98, x / nativeSize.w));
            const cyan = smoothstep(18, 122, Math.min(g, b) - r * 0.68 + saturation * 0.12);
            const blue = smoothstep(12, 92, b - r * 0.5 + (g - r) * 0.12 + saturation * 0.12);
            const parchment = r > 128 && g > 104 && b > 78 && saturation < 86;
            let keep = Math.max(cyan, blue * 0.86) * lane * cap;
            if (parchment && keep < 0.62) keep = 0;

            if (keep <= 0.045) {
              data[offset + 3] = 0;
              continue;
            }

            data[offset] = Math.min(255, Math.round(r * 0.82 + luminance * 0.02));
            data[offset + 1] = Math.min(255, Math.round(g * 1.08 + cyan * 22));
            data[offset + 2] = Math.min(255, Math.round(b * 1.13 + cyan * 28));
            data[offset + 3] = Math.round(Math.min(210, 224 * keep * (0.42 + lane * 0.58)));
          }
        }

        ctx.putImageData(imageData, 0, 0);
        return canvas.toDataURL("image/png");

        function smoothstep(edge0, edge1, value) {
          const t = Math.max(0, Math.min(1, (value - edge0) / Math.max(0.0001, edge1 - edge0)));
          return t * t * (3 - 2 * t);
        }
      }, {
        base64: sourceBuffer.toString("base64"),
        crop: target.crop,
        nativeSize: target.nativeSize
      })
      : target.kind === "world_map_route_bead"
      ? await page.evaluate(async ({ base64, crop, nativeSize }) => {
        const image = await new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error("source concept image failed to load"));
          img.src = `data:image/png;base64,${base64}`;
        });

        const canvas = document.createElement("canvas");
        canvas.width = nativeSize.w;
        canvas.height = nativeSize.h;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) throw new Error("2d canvas context unavailable");

        const glow = ctx.createRadialGradient(
          nativeSize.w * 0.5,
          nativeSize.h * 0.5,
          nativeSize.w * 0.06,
          nativeSize.w * 0.5,
          nativeSize.h * 0.5,
          nativeSize.w * 0.56
        );
        glow.addColorStop(0, "rgba(84, 238, 226, 0.22)");
        glow.addColorStop(0.48, "rgba(84, 238, 226, 0.1)");
        glow.addColorStop(1, "rgba(84, 238, 226, 0)");
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, nativeSize.w, nativeSize.h);
        ctx.drawImage(image, crop.x, crop.y, crop.w, crop.h, 0, 0, nativeSize.w, nativeSize.h);

        const imageData = ctx.getImageData(0, 0, nativeSize.w, nativeSize.h);
        const data = imageData.data;
        const centerX = nativeSize.w * 0.5;
        const centerY = nativeSize.h * 0.5;

        for (let y = 0; y < nativeSize.h; y += 1) {
          for (let x = 0; x < nativeSize.w; x += 1) {
            const offset = (y * nativeSize.w + x) * 4;
            const r = data[offset];
            const g = data[offset + 1];
            const b = data[offset + 2];
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            const saturation = max - min;
            const luminance = r * 0.299 + g * 0.587 + b * 0.114;
            const dx = (x - centerX) / (nativeSize.w * 0.48);
            const dy = (y - centerY) / (nativeSize.h * 0.5);
            const radial = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy));
            const cyan = smoothstep(20, 122, Math.min(g, b) - r * 0.68 + saturation * 0.12);
            const blue = smoothstep(12, 92, b - r * 0.5 + (g - r) * 0.12 + saturation * 0.12);
            const whiteHot = smoothstep(180, 246, luminance) * (1 - smoothstep(48, 128, saturation));
            const parchment = r > 126 && g > 104 && b > 78 && saturation < 84;
            let keep = Math.max(cyan, blue * 0.84, whiteHot * 0.72) * smoothstep(0, 0.24, radial);
            if (parchment && keep < 0.62) keep = 0;

            if (keep <= 0.05) {
              data[offset + 3] = 0;
              continue;
            }

            data[offset] = Math.min(255, Math.round(r * 0.82 + luminance * 0.03));
            data[offset + 1] = Math.min(255, Math.round(g * 1.1 + cyan * 24 + whiteHot * 18));
            data[offset + 2] = Math.min(255, Math.round(b * 1.14 + cyan * 30 + whiteHot * 20));
            data[offset + 3] = Math.round(Math.min(226, 236 * keep * (0.5 + radial * 0.5)));
          }
        }

        ctx.putImageData(imageData, 0, 0);
        return canvas.toDataURL("image/png");

        function smoothstep(edge0, edge1, value) {
          const t = Math.max(0, Math.min(1, (value - edge0) / Math.max(1, edge1 - edge0)));
          return t * t * (3 - 2 * t);
        }
      }, {
        base64: sourceBuffer.toString("base64"),
        crop: target.crop,
        nativeSize: target.nativeSize
      })
      : target.kind === "effect_sheet"
      ? await page.evaluate(async ({ base64, crop, nativeSize, frameSize, effectKind, drawScale, baseAngle, angleRange }) => {
        const image = await new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error("source concept image failed to load"));
          img.src = `data:image/png;base64,${base64}`;
        });

        const canvas = document.createElement("canvas");
        canvas.width = nativeSize.w;
        canvas.height = nativeSize.h;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) throw new Error("2d canvas context unavailable");

        const columns = Math.max(1, Math.floor(nativeSize.w / frameSize.w));
        const rows = Math.max(1, Math.floor(nativeSize.h / frameSize.h));
        const totalFrames = columns * rows;
        for (let frame = 0; frame < totalFrames; frame += 1) {
          const column = frame % columns;
          const row = Math.floor(frame / columns);
          const progress = totalFrames <= 1 ? 1 : frame / (totalFrames - 1);
          const pulse = Math.sin(progress * Math.PI);
          const frameX = column * frameSize.w;
          const frameY = row * frameSize.h;
          const fit = Math.min(frameSize.w / crop.w, frameSize.h / crop.h) * drawScale * (0.86 + progress * 0.18);
          const drawW = crop.w * fit;
          const drawH = crop.h * fit;
          const wobbleX = Math.sin(frame * 1.7) * frameSize.w * 0.025;
          const wobbleY = Math.cos(frame * 1.3) * frameSize.h * 0.018;

          ctx.save();
          ctx.translate(frameX + frameSize.w / 2 + wobbleX, frameY + frameSize.h / 2 + wobbleY);
          ctx.rotate(((baseAngle ?? 0) + (progress - 0.5) * (angleRange ?? 0)) * Math.PI / 180);
          ctx.globalAlpha = 0.72 + pulse * 0.28;
          ctx.filter = "saturate(1.12) contrast(1.08)";
          ctx.drawImage(image, crop.x, crop.y, crop.w, crop.h, -drawW / 2, -drawH / 2, drawW, drawH);
          ctx.restore();
        }

        const imageData = ctx.getImageData(0, 0, nativeSize.w, nativeSize.h);
        const data = imageData.data;
        for (let y = 0; y < nativeSize.h; y += 1) {
          for (let x = 0; x < nativeSize.w; x += 1) {
            const offset = (y * nativeSize.w + x) * 4;
            const originalAlpha = data[offset + 3] / 255;
            if (originalAlpha <= 0) continue;

            const frameX = x % frameSize.w;
            const frameY = y % frameSize.h;
            const cx = frameSize.w / 2;
            const cy = frameSize.h / 2;
            const dx = (frameX - cx) / (frameSize.w * 0.5);
            const dy = (frameY - cy) / (frameSize.h * 0.5);
            const radial = Math.max(0, 1 - Math.max(0, Math.sqrt(dx * dx + dy * dy) - 0.64) / 0.36);

            const r = data[offset];
            const g = data[offset + 1];
            const b = data[offset + 2];
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            const saturation = max - min;
            const luminance = r * 0.299 + g * 0.587 + b * 0.114;
            const parchment = r > 138 && g > 112 && b > 78 && saturation < 82;

            let keep = 0;
            if (effectKind === "paper_slash") {
              const warm = smoothstep(14, 92, (r - b) + saturation * 0.24);
              const bright = smoothstep(62, 180, luminance);
              keep = Math.max(warm, bright * 0.86) * radial;
              if (parchment && luminance < 154) keep *= 0.34;
              data[offset] = Math.min(255, Math.round(r * 1.08 + 10));
              data[offset + 1] = Math.min(255, Math.round(g * 1.02 + 3));
              data[offset + 2] = Math.max(0, Math.round(b * 0.92));
            } else if (effectKind === "stage_spotlight") {
              const warmGold = smoothstep(24, 112, (r - b) + saturation * 0.32);
              const brightInk = smoothstep(94, 196, luminance);
              const starLine = smoothstep(126, 218, luminance);
              const tealShadow = smoothstep(14, 92, ((g + b) / 2) - r + saturation * 0.08) * 0.36;
              keep = Math.max(warmGold * brightInk, starLine * 0.92, tealShadow) * radial;
              if (luminance < 92) keep *= 0.16;
              if (parchment && luminance < 168) keep *= 0.2;
              data[offset] = Math.min(255, Math.round(r * 1.1 + 12));
              data[offset + 1] = Math.min(255, Math.round(g * 1.03 + 5));
              data[offset + 2] = Math.max(0, Math.round(b * 0.9));
            } else {
              const purple = smoothstep(5, 74, (b - g) + saturation * 0.32);
              const darkInk = luminance < 122 && saturation > 22 && b > r * 0.86 ? 0.86 : 0;
              keep = Math.max(purple, darkInk) * radial;
              if (parchment) keep = 0;
              data[offset] = Math.max(0, Math.round(r * 0.9));
              data[offset + 1] = Math.max(0, Math.round(g * 0.82));
              data[offset + 2] = Math.min(255, Math.round(b * 1.14 + 7));
            }

            const alpha = Math.max(0, Math.min(1, originalAlpha * keep));
            data[offset + 3] = alpha < 0.045 ? 0 : Math.round(alpha * 255);
          }
        }
        ctx.putImageData(imageData, 0, 0);

        return canvas.toDataURL("image/png");

        function smoothstep(edge0, edge1, value) {
          const t = Math.max(0, Math.min(1, (value - edge0) / Math.max(1, edge1 - edge0)));
          return t * t * (3 - 2 * t);
        }
      }, {
        base64: sourceBuffer.toString("base64"),
        crop: target.crop,
        nativeSize: target.nativeSize,
        frameSize: target.frameSize,
        effectKind: target.effectKind,
        drawScale: target.drawScale,
        baseAngle: target.baseAngle,
        angleRange: target.angleRange
      })
      : target.kind === "current_status_badge"
      ? await page.evaluate(async ({ base64, crop, nativeSize }) => {
        const image = await new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error("source concept image failed to load"));
          img.src = `data:image/png;base64,${base64}`;
        });

        const canvas = document.createElement("canvas");
        canvas.width = nativeSize.w;
        canvas.height = nativeSize.h;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) throw new Error("2d canvas context unavailable");

        ctx.drawImage(image, crop.x, crop.y, crop.w, crop.h, 0, 0, nativeSize.w, nativeSize.h);
        const imageData = ctx.getImageData(0, 0, nativeSize.w, nativeSize.h);
        const data = imageData.data;
        const cx = nativeSize.w * 0.22;
        const cy = nativeSize.h * 0.48;

        for (let y = 0; y < nativeSize.h; y += 1) {
          for (let x = 0; x < nativeSize.w; x += 1) {
            const offset = (y * nativeSize.w + x) * 4;
            const r = data[offset];
            const g = data[offset + 1];
            const b = data[offset + 2];
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            const saturation = max - min;
            const luminance = r * 0.299 + g * 0.587 + b * 0.114;
            const dx = (x - cx) / (nativeSize.w * 0.34);
            const dy = (y - cy) / (nativeSize.h * 0.34);
            const radial = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy));
            const gold = smoothstep(58, 154, r + g * 0.78 - b * 1.58 + saturation * 0.22);
            const keep = gold * smoothstep(0, 0.3, radial);
            if (keep <= 0.1) {
              data[offset + 3] = 0;
              continue;
            }

            data[offset] = Math.min(255, Math.round(r * 1.06 + luminance * 0.04 + gold * 10));
            data[offset + 1] = Math.min(255, Math.round(g * 1.05 + gold * 8));
            data[offset + 2] = Math.min(255, Math.round(b * 0.98));
            data[offset + 3] = Math.round(Math.min(236, 232 * keep * (0.6 + radial * 0.5)));
          }
        }

        ctx.putImageData(imageData, 0, 0);
        return canvas.toDataURL("image/png");

        function smoothstep(edge0, edge1, value) {
          const t = Math.max(0, Math.min(1, (value - edge0) / Math.max(1, edge1 - edge0)));
          return t * t * (3 - 2 * t);
        }
      }, {
        base64: sourceBuffer.toString("base64"),
        crop: target.crop,
        nativeSize: target.nativeSize
      })
      : target.kind === "current_halo"
      ? await page.evaluate(async ({ base64, crop, nativeSize }) => {
        const image = await new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error("source concept image failed to load"));
          img.src = `data:image/png;base64,${base64}`;
        });

        const canvas = document.createElement("canvas");
        canvas.width = nativeSize.w;
        canvas.height = nativeSize.h;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) throw new Error("2d canvas context unavailable");

        ctx.drawImage(image, crop.x, crop.y, crop.w, crop.h, 0, 0, nativeSize.w, nativeSize.h);
        const imageData = ctx.getImageData(0, 0, nativeSize.w, nativeSize.h);
        const data = imageData.data;
        const centerX = nativeSize.w * 0.5;
        const centerY = nativeSize.h * 0.56;

        for (let y = 0; y < nativeSize.h; y += 1) {
          for (let x = 0; x < nativeSize.w; x += 1) {
            const offset = (y * nativeSize.w + x) * 4;
            const r = data[offset];
            const g = data[offset + 1];
            const b = data[offset + 2];
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            const saturation = max - min;
            const luminance = r * 0.299 + g * 0.587 + b * 0.114;
            const dx = (x - centerX) / (nativeSize.w * 0.52);
            const dy = (y - centerY) / (nativeSize.h * 0.54);
            const radial = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy));
            const centerCutout = smoothstep(
              0.72,
              1.1,
              Math.hypot((x - centerX) / (nativeSize.w * 0.22), (y - (centerY + nativeSize.h * 0.03)) / (nativeSize.h * 0.22))
            );
            const markerCutout = smoothstep(
              0.84,
              1.08,
              Math.hypot((x - centerX) / (nativeSize.w * 0.16), (y - nativeSize.h * 0.16) / (nativeSize.h * 0.13))
            );
            const routeCutout = x < nativeSize.w * 0.34 && y > nativeSize.h * 0.43 ? 0 : 1;
            const cyan = smoothstep(38, 136, Math.min(g, b) - r * 0.74 + saturation * 0.08);
            const whiteHot = smoothstep(196, 248, luminance) * cyan;
            const keep = Math.max(cyan, whiteHot * 0.18) * smoothstep(0, 0.22, radial) * centerCutout * markerCutout * routeCutout;
            if (keep <= 0.07) {
              data[offset + 3] = 0;
              continue;
            }

            data[offset] = Math.min(255, Math.round(r * 0.88 + luminance * 0.02));
            data[offset + 1] = Math.min(255, Math.round(g * 1.08 + cyan * 18));
            data[offset + 2] = Math.min(255, Math.round(b * 1.12 + cyan * 24));
            data[offset + 3] = Math.round(Math.min(230, 236 * keep * (0.56 + radial * 0.54)));
          }
        }

        ctx.putImageData(imageData, 0, 0);
        return canvas.toDataURL("image/png");

        function smoothstep(edge0, edge1, value) {
          const t = Math.max(0, Math.min(1, (value - edge0) / Math.max(1, edge1 - edge0)));
          return t * t * (3 - 2 * t);
        }
      }, {
        base64: sourceBuffer.toString("base64"),
        crop: target.crop,
        nativeSize: target.nativeSize
      })
      : target.kind === "current_marker"
      ? await page.evaluate(async ({ base64, crop, nativeSize }) => {
        const image = await new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error("source concept image failed to load"));
          img.src = `data:image/png;base64,${base64}`;
        });

        const canvas = document.createElement("canvas");
        canvas.width = nativeSize.w;
        canvas.height = nativeSize.h;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) throw new Error("2d canvas context unavailable");

        const glow = ctx.createRadialGradient(
          nativeSize.w * 0.5,
          nativeSize.h * 0.5,
          nativeSize.w * 0.16,
          nativeSize.w * 0.5,
          nativeSize.h * 0.5,
          nativeSize.w * 0.58
        );
        glow.addColorStop(0, "rgba(94, 234, 212, 0.22)");
        glow.addColorStop(0.58, "rgba(94, 234, 212, 0.08)");
        glow.addColorStop(1, "rgba(94, 234, 212, 0)");
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, nativeSize.w, nativeSize.h);
        ctx.drawImage(image, crop.x, crop.y, crop.w, crop.h, 0, 0, nativeSize.w, nativeSize.h);

        const imageData = ctx.getImageData(0, 0, nativeSize.w, nativeSize.h);
        const data = imageData.data;
        const diamond = [
          { x: 48, y: 7 },
          { x: 78, y: 38 },
          { x: 49, y: 96 },
          { x: 17, y: 41 }
        ];

        for (let y = 0; y < nativeSize.h; y += 1) {
          for (let x = 0; x < nativeSize.w; x += 1) {
            const offset = (y * nativeSize.w + x) * 4;
            const mask = softPolygonMask(x, y, diamond);
            if (mask <= 0) {
              data[offset + 3] = 0;
              continue;
            }

            const r = data[offset];
            const g = data[offset + 1];
            const b = data[offset + 2];
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            const luminance = r * 0.299 + g * 0.587 + b * 0.114;
            const cyan = Math.max(0, (g + b) * 0.5 - r * 0.58 + (max - min) * 0.36);
            const brightFrame = luminance > 154 ? 1 : 0;
            const keep = Math.max(Math.min(1, cyan / 120), brightFrame * 0.8);
            if (keep <= 0.08) {
              data[offset + 3] = 0;
              continue;
            }

            data[offset] = Math.min(255, Math.round(r * 1.06 + luminance * 0.04));
            data[offset + 1] = Math.min(255, Math.round(g * 1.08 + cyan * 0.1));
            data[offset + 2] = Math.min(255, Math.round(b * 1.1 + cyan * 0.12));
            data[offset + 3] = Math.round(248 * mask * keep);
          }
        }

        ctx.putImageData(imageData, 0, 0);
        return canvas.toDataURL("image/png");

        function softPolygonMask(x, y, points) {
          if (!insidePolygon(x, y, points)) return 0;
          let minDistance = Infinity;
          for (let index = 0; index < points.length; index += 1) {
            const a = points[index];
            const b = points[(index + 1) % points.length];
            minDistance = Math.min(minDistance, distanceToSegment(x, y, a.x, a.y, b.x, b.y));
          }
          return Math.max(0, Math.min(1, minDistance / 6));
        }

        function insidePolygon(x, y, points) {
          let inside = false;
          for (let i = 0, j = points.length - 1; i < points.length; j = i, i += 1) {
            const yi = points[i].y;
            const yj = points[j].y;
            if ((yi > y) !== (yj > y)) {
              const xIntersect = ((points[j].x - points[i].x) * (y - yi)) / (yj - yi) + points[i].x;
              if (x < xIntersect) inside = !inside;
            }
          }
          return inside;
        }

        function distanceToSegment(px, py, ax, ay, bx, by) {
          const dx = bx - ax;
          const dy = by - ay;
          if (dx === 0 && dy === 0) return Math.hypot(px - ax, py - ay);
          const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)));
          return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
        }
      }, {
        base64: sourceBuffer.toString("base64"),
        crop: target.crop,
        nativeSize: target.nativeSize
      })
      : target.kind === "settings_control_state" || target.kind === "underlay_control_state"
        ? await page.evaluate(async ({ base64, crop, nativeSize, stateVariant }) => {
        const image = await new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error("source concept image failed to load"));
          img.src = `data:image/png;base64,${base64}`;
        });

        const canvas = document.createElement("canvas");
        canvas.width = nativeSize.w;
        canvas.height = nativeSize.h;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) throw new Error("2d canvas context unavailable");

        ctx.drawImage(image, crop.x, crop.y, crop.w, crop.h, 0, 0, nativeSize.w, nativeSize.h);

        const imageData = ctx.getImageData(0, 0, nativeSize.w, nativeSize.h);
        const data = imageData.data;
        for (let y = 0; y < nativeSize.h; y += 1) {
          for (let x = 0; x < nativeSize.w; x += 1) {
            const offset = (y * nativeSize.w + x) * 4;
            const edge = softRectMask(x, y, nativeSize.w, nativeSize.h);
            if (edge <= 0) {
              data[offset + 3] = 0;
              continue;
            }

            const r = data[offset];
            const g = data[offset + 1];
            const b = data[offset + 2];
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            const saturation = max - min;
            const luminance = r * 0.299 + g * 0.587 + b * 0.114;
            const parchment = r > 138 && g > 112 && b > 82 && saturation < 74;
            const darkInk = (1 - smoothstep(72, 160, luminance)) * 0.95;
            const saturatedMaterial = smoothstep(18, 92, saturation) * 0.82;
            const tealMaterial = smoothstep(18, 96, g + b * 0.7 - r * 1.12 - 42) * 0.9;
            const warmMetal = smoothstep(22, 112, r + g * 0.72 - b * 1.38 - 92) * 0.72;
            const fineLine = (1 - smoothstep(108, 184, luminance)) * smoothstep(10, 58, saturation + Math.abs(r - g) * 0.34);
            let keep = Math.max(darkInk, saturatedMaterial, tealMaterial, warmMetal, fineLine * 0.82);
            if (parchment && keep < 0.46) keep = 0;
            if (keep <= 0.06) {
              data[offset + 3] = 0;
              continue;
            }

            const materialAlpha = Math.min(1, keep * 1.15) * edge;
            if (stateVariant === "controlDown") {
              const shade = 0.52 + Math.min(1, keep) * 0.16;
              data[offset] = Math.max(0, Math.round(r * shade));
              data[offset + 1] = Math.max(0, Math.round(g * (shade * 0.88)));
              data[offset + 2] = Math.max(0, Math.round(b * (shade * 0.82)));
              data[offset + 3] = Math.round(226 * materialAlpha);
            } else {
              data[offset] = Math.min(255, Math.round(r * 1.08 + luminance * 0.07 + warmMetal * 18));
              data[offset + 1] = Math.min(255, Math.round(g * 1.07 + luminance * 0.05 + tealMaterial * 16 + warmMetal * 10));
              data[offset + 2] = Math.min(255, Math.round(b * 1.02 + tealMaterial * 12));
              data[offset + 3] = Math.round(236 * materialAlpha);
            }
          }
        }

        ctx.putImageData(imageData, 0, 0);
        return canvas.toDataURL("image/png");

        function smoothstep(edge0, edge1, value) {
          const t = Math.max(0, Math.min(1, (value - edge0) / Math.max(1, edge1 - edge0)));
          return t * t * (3 - 2 * t);
        }

        function softRectMask(x, y, width, height) {
          const inset = 2;
          const feather = 8;
          const dx = Math.min(x - inset, width - inset - x);
          const dy = Math.min(y - inset, height - inset - y);
          return Math.max(0, Math.min(1, Math.min(dx, dy) / feather));
        }
      }, {
        base64: sourceBuffer.toString("base64"),
        crop: target.crop,
        nativeSize: target.nativeSize,
        stateVariant: target.stateVariant
      })
      : target.kind === "button_state"
        ? await page.evaluate(async ({ base64, crop, nativeSize, stateVariant, maskPolygon }) => {
        const image = await new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error("source concept image failed to load"));
          img.src = `data:image/png;base64,${base64}`;
        });

        const canvas = document.createElement("canvas");
        canvas.width = nativeSize.w;
        canvas.height = nativeSize.h;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) throw new Error("2d canvas context unavailable");

        ctx.drawImage(image, crop.x, crop.y, crop.w, crop.h, 0, 0, nativeSize.w, nativeSize.h);

        const imageData = ctx.getImageData(0, 0, nativeSize.w, nativeSize.h);
        const data = imageData.data;
        const polygon = maskPolygon ?? [
          { x: 8, y: 42 },
          { x: 38, y: 14 },
          { x: 245, y: 14 },
          { x: 272, y: 32 },
          { x: 260, y: 124 },
          { x: 31, y: 128 },
          { x: 8, y: 110 }
        ];

        for (let y = 0; y < nativeSize.h; y += 1) {
          for (let x = 0; x < nativeSize.w; x += 1) {
            const offset = (y * nativeSize.w + x) * 4;
            const mask = softPolygonMask(x, y, polygon);
            if (mask <= 0) {
              data[offset + 3] = 0;
              continue;
            }

            const r = data[offset];
            const g = data[offset + 1];
            const b = data[offset + 2];
            const luminance = r * 0.299 + g * 0.587 + b * 0.114;
            const center = 1 - Math.min(1, Math.hypot((x - nativeSize.w * 0.5) / (nativeSize.w * 0.54), (y - nativeSize.h * 0.54) / (nativeSize.h * 0.6)));

            if (stateVariant === "buttonDown") {
              const shade = 0.58 + center * 0.12;
              data[offset] = Math.max(0, Math.round(r * shade));
              data[offset + 1] = Math.max(0, Math.round(g * (shade * 0.9)));
              data[offset + 2] = Math.max(0, Math.round(b * (shade * 0.82)));
              data[offset + 3] = Math.round(230 * mask);
            } else {
              data[offset] = Math.min(255, Math.round(r * 1.08 + luminance * 0.08 + center * 18));
              data[offset + 1] = Math.min(255, Math.round(g * 1.08 + luminance * 0.06 + center * 18));
              data[offset + 2] = Math.min(255, Math.round(b * 1.04 + center * 12));
              data[offset + 3] = Math.round(246 * mask);
            }
          }
        }

        ctx.putImageData(imageData, 0, 0);
        return canvas.toDataURL("image/png");

        function softPolygonMask(x, y, points) {
          if (!insidePolygon(x, y, points)) return 0;
          let minDistance = Infinity;
          for (let index = 0; index < points.length; index += 1) {
            const a = points[index];
            const b = points[(index + 1) % points.length];
            minDistance = Math.min(minDistance, distanceToSegment(x, y, a.x, a.y, b.x, b.y));
          }
          return Math.max(0, Math.min(1, minDistance / 8));
        }

        function insidePolygon(x, y, points) {
          let inside = false;
          for (let i = 0, j = points.length - 1; i < points.length; j = i, i += 1) {
            const yi = points[i].y;
            const yj = points[j].y;
            if ((yi > y) !== (yj > y)) {
              const xIntersect = ((points[j].x - points[i].x) * (y - yi)) / (yj - yi) + points[i].x;
              if (x < xIntersect) inside = !inside;
            }
          }
          return inside;
        }

        function distanceToSegment(px, py, ax, ay, bx, by) {
          const dx = bx - ax;
          const dy = by - ay;
          if (dx === 0 && dy === 0) return Math.hypot(px - ax, py - ay);
          const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)));
          return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
        }
      }, {
        base64: sourceBuffer.toString("base64"),
        crop: target.crop,
        nativeSize: target.nativeSize,
        stateVariant: target.stateVariant,
        maskPolygon: target.maskPolygon
      })
      : await page.evaluate(async ({ base64, crop, nativeSize, clearRects, stateVariant }) => {
      const image = await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error("source concept image failed to load"));
        img.src = `data:image/png;base64,${base64}`;
      });

      const canvas = document.createElement("canvas");
      canvas.width = nativeSize.w;
      canvas.height = nativeSize.h;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) throw new Error("2d canvas context unavailable");

      const cx = nativeSize.w / 2;
      const cy = nativeSize.h / 2;
      const radius = Math.min(nativeSize.w, nativeSize.h) * 0.43;
      const glow = ctx.createRadialGradient(cx, cy, radius * 0.42, cx, cy, radius * 0.98);
      if (stateVariant === "disabled") {
        glow.addColorStop(0, "rgba(31, 42, 56, 0.16)");
        glow.addColorStop(0.64, "rgba(79, 69, 56, 0.12)");
        glow.addColorStop(1, "rgba(31, 42, 56, 0)");
      } else {
        glow.addColorStop(0, "rgba(245, 194, 107, 0.18)");
        glow.addColorStop(0.64, "rgba(245, 194, 107, 0.12)");
        glow.addColorStop(1, "rgba(245, 194, 107, 0)");
      }
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, nativeSize.w, nativeSize.h);

      ctx.drawImage(image, crop.x, crop.y, crop.w, crop.h, 0, 0, nativeSize.w, nativeSize.h);

      const imageData = ctx.getImageData(0, 0, nativeSize.w, nativeSize.h);
      const data = imageData.data;
      for (let y = 0; y < nativeSize.h; y += 1) {
        for (let x = 0; x < nativeSize.w; x += 1) {
          const dx = x - cx;
          const dy = y - cy;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const hard = radius * 1.03;
          const soft = radius * 0.78;
          const mask = distance <= soft ? 1 : Math.max(0, 1 - ((distance - soft) / Math.max(1, hard - soft)));
          const offset = (y * nativeSize.w + x) * 4;
          const r = data[offset];
          const g = data[offset + 1];
          const b = data[offset + 2];
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const luminance = r * 0.299 + g * 0.587 + b * 0.114;
          const parchment = r > 142 && g > 118 && b > 88 && max - min < 92;
          const paperFade = parchment ? 0 : 1;
          data[offset + 3] = Math.round(data[offset + 3] * mask * paperFade);
          if (stateVariant === "pressed" && data[offset + 3] > 0) {
            const centerPull = Math.max(0, 1 - (distance / Math.max(1, radius)));
            const shade = 0.48 + centerPull * 0.18;
            data[offset] = Math.max(0, Math.round(r * shade));
            data[offset + 1] = Math.max(0, Math.round(g * (shade * 0.78)));
            data[offset + 2] = Math.max(0, Math.round(b * (shade * 0.68)));
            data[offset + 3] = Math.round(data[offset + 3] * 0.96);
          } else if (stateVariant === "disabled" && data[offset + 3] > 0) {
            const centerPull = Math.max(0, 1 - (distance / Math.max(1, radius)));
            const dull = 0.68 + centerPull * 0.08;
            data[offset] = Math.max(0, Math.min(255, Math.round(r * dull + luminance * 0.14)));
            data[offset + 1] = Math.max(0, Math.min(255, Math.round(g * (dull * 0.92) + luminance * 0.12)));
            data[offset + 2] = Math.max(0, Math.min(255, Math.round(b * (dull * 0.84) + 16)));
            data[offset + 3] = Math.round(data[offset + 3] * 0.94);
          }
        }
      }
      for (const rect of clearRects ?? []) {
        for (let y = Math.max(0, rect.y); y < Math.min(nativeSize.h, rect.y + rect.h); y += 1) {
          for (let x = Math.max(0, rect.x); x < Math.min(nativeSize.w, rect.x + rect.w); x += 1) {
            data[(y * nativeSize.w + x) * 4 + 3] = 0;
          }
        }
      }
      ctx.putImageData(imageData, 0, 0);

      return canvas.toDataURL("image/png");
    }, {
      base64: sourceBuffer.toString("base64"),
      crop: target.crop,
      nativeSize: target.nativeSize,
      clearRects: target.clearRects,
      stateVariant: target.stateVariant
    });

    for (const outputPath of target.outputs ?? [target.output]) {
      await mkdir(path.dirname(outputPath), { recursive: true });
      await writeFile(outputPath, Buffer.from(dataUrl.split(",")[1], "base64"));
      console.log(`extracted ${target.key} -> ${path.relative(rootDir, outputPath)}`);
    }
  }
} finally {
  await browser.close();
}
