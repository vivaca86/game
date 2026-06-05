import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { deflateSync } from "node:zlib";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = path.join(rootDir, "src", "data", "assetManifest.slice.v1.json");
const outputRoot = path.join(rootDir, "public");

const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const candidateCardArtKeys = new Set([
  "card_art_sun_jab",
  "card_art_fold_guard",
  "card_art_page_step",
  "card_art_ribbon_snap",
  "card_art_lamplight_mark",
  "card_art_stage_patch",
  "card_art_ink_spill",
  "card_art_paper_bloom",
  "card_art_pinpoint_glint",
  "card_art_curtain_call"
]);

const candidateIntentIconKeys = new Set([
  "icon_intent_attack",
  "icon_intent_disrupt",
  "icon_intent_block"
]);

const candidateBackgroundKeys = new Set([
  "bg_lantern_foyer_set",
  "scene_rune_bench"
]);

const candidateMonsterSpriteKeys = new Set([
  "monster_folded_sentry",
  "monster_ink_mote"
]);

const candidateBossSpriteKeys = new Set([
  "boss_curtain_lion"
]);

const candidateProgressIconKeys = new Set([
  "map_icon_lantern_foyer",
  "rune_paper_spark_icon",
  "rune_ribbon_loop_icon",
  "rune_glass_leaf_icon",
  "relic_brass_bookmark_icon",
  "char_mina_pagehand_portrait"
]);

const candidateCharacterSpriteKeys = new Set([
  "char_mina_pagehand_sprite"
]);

const candidateUiPanelKeys = new Set([
  "ui_button_primary_9slice",
  "ui_button_secondary_9slice",
  "ui_slot_reward_9slice",
  "ui_slot_choice_9slice",
  "ui_tooltip_paper_9slice",
  "ui_panel_paper_9slice"
]);

const candidateEffectSpriteKeys = new Set([
  "effect_stage_spotlight",
  "effect_paper_slash",
  "effect_ink_splash"
]);

const sourcePassthroughAssets = new Map([
  ["ui_hover_gold_seal_concept", path.join(rootDir, "assets", "source", "ui", "ui_hover_gold_seal_concept_v001.png")],
  ["ui_hover_boss_skull_stamp_concept", path.join(rootDir, "assets", "source", "ui", "ui_hover_boss_skull_stamp_concept_v001.png")],
  ["ui_hover_route_node_concept", path.join(rootDir, "assets", "source", "ui", "ui_hover_route_node_concept_v001.png")],
  ["ui_hover_choice_badge_concept", path.join(rootDir, "assets", "source", "ui", "ui_hover_choice_badge_concept_v001.png")],
  ["ui_hover_action_seal_concept", path.join(rootDir, "assets", "source", "ui", "ui_hover_action_seal_concept_v001.png")],
  ["ui_down_pressed_stamp_concept", path.join(rootDir, "assets", "source", "ui", "ui_down_pressed_stamp_concept_v001.png")],
  ["ui_disabled_lock_stamp_concept", path.join(rootDir, "assets", "source", "ui", "ui_disabled_lock_stamp_concept_v001.png")],
  ["ui_hover_world_map_play_button_concept", path.join(rootDir, "assets", "source", "ui", "ui_hover_world_map_play_button_concept_v001.png")],
  ["ui_down_world_map_play_button_concept", path.join(rootDir, "assets", "source", "ui", "ui_down_world_map_play_button_concept_v001.png")],
  ["ui_hover_settings_return_button_concept", path.join(rootDir, "assets", "source", "ui", "ui_hover_settings_return_button_concept_v001.png")],
  ["ui_down_settings_return_button_concept", path.join(rootDir, "assets", "source", "ui", "ui_down_settings_return_button_concept_v001.png")],
  ["ui_current_stage_marker_concept", path.join(rootDir, "assets", "source", "ui", "ui_current_stage_marker_concept_v001.png")],
  ["ui_current_stage_halo_concept", path.join(rootDir, "assets", "source", "ui", "ui_current_stage_halo_concept_v001.png")],
  ["ui_current_stage_status_badge_concept", path.join(rootDir, "assets", "source", "ui", "ui_current_stage_status_badge_concept_v001.png")],
  ["ui_completed_stage_badge_concept", path.join(rootDir, "assets", "source", "ui", "ui_completed_stage_badge_concept_v001.png")],
  ["ui_locked_stage_badge_concept", path.join(rootDir, "assets", "source", "ui", "ui_locked_stage_badge_concept_v001.png")],
  ["ui_sealed_stage_badge_concept", path.join(rootDir, "assets", "source", "ui", "ui_sealed_stage_badge_concept_v001.png")],
  ["combat_raster_underlay_concept", path.join(rootDir, "assets", "source", "ui", "combat_raster_underlay_concept_v001.png")],
  ["boss_raster_underlay_concept", path.join(rootDir, "assets", "source", "ui", "boss_raster_underlay_concept_v001.png")],
  ["reward_raster_underlay_concept", path.join(rootDir, "assets", "source", "ui", "reward_raster_underlay_concept_v001.png")],
  ["event_raster_underlay_concept", path.join(rootDir, "assets", "source", "ui", "event_raster_underlay_concept_v001.png")],
  ["town_raster_underlay_concept", path.join(rootDir, "assets", "source", "ui", "town_raster_underlay_concept_v001.png")],
  ["world_map_raster_underlay_concept", path.join(rootDir, "assets", "source", "ui", "world_map_raster_underlay_concept_v001.png")],
  ["dungeon_raster_underlay_concept", path.join(rootDir, "assets", "source", "ui", "dungeon_raster_underlay_concept_v001.png")],
  ["rune_bench_raster_underlay_concept", path.join(rootDir, "assets", "source", "ui", "rune_bench_raster_underlay_concept_v001.png")],
  ["result_raster_underlay_concept", path.join(rootDir, "assets", "source", "ui", "result_raster_underlay_concept_v001.png")],
  ["settings_raster_underlay_concept", path.join(rootDir, "assets", "source", "ui", "settings_raster_underlay_concept_v001.png")],
  ["effect_stage_spotlight", path.join(rootDir, "assets", "source", "effects", "effect_stage_spotlight_concept_v001.png")],
  ["effect_paper_slash", path.join(rootDir, "assets", "source", "effects", "effect_paper_slash_concept_v001.png")],
  ["effect_ink_splash", path.join(rootDir, "assets", "source", "effects", "effect_ink_splash_concept_v001.png")],
  ["char_mina_pagehand_sprite", path.join(rootDir, "assets", "source", "characters", "char_mina_pagehand_sprite_raster_v001.png")],
  ["monster_folded_sentry", path.join(rootDir, "assets", "source", "monsters", "monster_folded_sentry_sprite_raster_v001.png")],
  ["card_art_sun_jab", path.join(rootDir, "assets", "source", "cards", "card_art_sun_jab_raster_v001.png")],
  ["card_art_fold_guard", path.join(rootDir, "assets", "source", "cards", "card_art_fold_guard_raster_v001.png")],
  ["card_art_page_step", path.join(rootDir, "assets", "source", "cards", "card_art_page_step_raster_v001.png")]
]);

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const typeBuffer = Buffer.from(type, "ascii");
  const chunk = Buffer.alloc(12 + data.length);
  chunk.writeUInt32BE(data.length, 0);
  typeBuffer.copy(chunk, 4);
  data.copy(chunk, 8);
  chunk.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 8 + data.length);
  return chunk;
}

function encodePng(width, height, paint) {
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y += 1) {
    const rowStart = y * (width * 4 + 1);
    raw[rowStart] = 0;
    for (let x = 0; x < width; x += 1) {
      const offset = rowStart + 1 + x * 4;
      const [r, g, b, a] = paint(x, y, width, height);
      raw[offset] = r;
      raw[offset + 1] = g;
      raw[offset + 2] = b;
      raw[offset + 3] = a;
    }
  }

  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8;
  header[9] = 6;
  header[10] = 0;
  header[11] = 0;
  header[12] = 0;

  return Buffer.concat([
    Buffer.from("89504e470d0a1a0a", "hex"),
    pngChunk("IHDR", header),
    pngChunk("IDAT", deflateSync(raw, { level: 9 })),
    pngChunk("IEND", Buffer.alloc(0))
  ]);
}

function hash(value) {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function paletteFor(asset) {
  const h = hash(asset.key);
  const accent = [80 + (h & 95), 95 + ((h >>> 8) & 95), 105 + ((h >>> 16) & 95)];
  if (asset.key === "card_frame_attack" || asset.key === "icon_card_attack") {
    return { base: [250, 238, 206], accent: [207, 92, 82], dark: [82, 57, 55] };
  }
  if (asset.key === "card_frame_defense" || asset.key === "icon_card_defense") {
    return { base: [246, 238, 216], accent: [74, 121, 145], dark: [48, 72, 94] };
  }
  if (asset.key === "card_frame_skill" || asset.key === "icon_card_skill") {
    return { base: [247, 238, 212], accent: [86, 154, 135], dark: [72, 67, 108] };
  }
  if (asset.key === "card_art_sun_jab" || asset.key === "card_art_ribbon_snap") {
    return { base: [252, 235, 199], accent: [212, 88, 76], dark: [82, 57, 55] };
  }
  if (asset.key === "card_art_fold_guard") {
    return { base: [237, 238, 224], accent: [74, 121, 145], dark: [48, 72, 94] };
  }
  if (asset.key === "card_art_page_step" || asset.key === "card_art_lamplight_mark") {
    return { base: [246, 237, 207], accent: [91, 151, 133], dark: [72, 67, 108] };
  }
  if (asset.key === "card_art_stage_patch" || asset.key === "card_art_paper_bloom") {
    return { base: [245, 236, 210], accent: [91, 158, 128], dark: [73, 77, 94] };
  }
  if (asset.key === "card_art_ink_spill" || asset.key === "card_art_pinpoint_glint") {
    return { base: [241, 235, 216], accent: [78, 107, 164], dark: [52, 55, 92] };
  }
  if (asset.key === "card_art_curtain_call") {
    return { base: [246, 228, 200], accent: [190, 72, 86], dark: [72, 57, 76] };
  }
  if (asset.key === "icon_intent_attack") {
    return { base: [252, 232, 200], accent: [214, 82, 73], dark: [76, 48, 52] };
  }
  if (asset.key === "icon_intent_disrupt") {
    return { base: [236, 232, 214], accent: [83, 107, 176], dark: [54, 52, 92] };
  }
  if (asset.key === "icon_intent_block") {
    return { base: [235, 238, 218], accent: [78, 136, 148], dark: [48, 72, 90] };
  }
  if (asset.key === "bg_lantern_foyer_set") {
    return { base: [247, 226, 186], accent: [210, 93, 83], dark: [58, 68, 90] };
  }
  if (asset.key === "scene_rune_bench") {
    return { base: [235, 232, 208], accent: [72, 139, 151], dark: [62, 58, 94] };
  }
  if (asset.key === "monster_folded_sentry") {
    return { base: [243, 235, 207], accent: [77, 121, 143], dark: [45, 66, 86] };
  }
  if (asset.key === "monster_ink_mote") {
    return { base: [232, 226, 216], accent: [75, 98, 160], dark: [45, 45, 82] };
  }
  if (asset.key === "boss_curtain_lion") {
    return { base: [245, 221, 188], accent: [196, 73, 89], dark: [68, 52, 76] };
  }
  if (asset.key === "map_icon_lantern_foyer") {
    return { base: [246, 231, 192], accent: [214, 91, 80], dark: [58, 68, 90] };
  }
  if (asset.key === "rune_paper_spark_icon") {
    return { base: [249, 235, 203], accent: [218, 95, 74], dark: [77, 57, 72] };
  }
  if (asset.key === "rune_ribbon_loop_icon") {
    return { base: [244, 231, 205], accent: [186, 74, 106], dark: [78, 58, 90] };
  }
  if (asset.key === "rune_glass_leaf_icon") {
    return { base: [236, 240, 221], accent: [76, 151, 132], dark: [51, 82, 91] };
  }
  if (asset.key === "relic_brass_bookmark_icon") {
    return { base: [246, 229, 190], accent: [191, 139, 55], dark: [76, 58, 56] };
  }
  if (asset.key === "char_mina_pagehand_portrait") {
    return { base: [248, 236, 210], accent: [82, 143, 150], dark: [58, 65, 89] };
  }
  if (asset.key === "char_mina_pagehand_sprite") {
    return { base: [248, 236, 210], accent: [82, 143, 150], dark: [58, 65, 89] };
  }
  if (asset.key === "ui_panel_paper_9slice") {
    return { base: [255, 244, 218], accent: [198, 160, 82], dark: [76, 62, 58] };
  }
  if (asset.key === "ui_button_primary_9slice") {
    return { base: [54, 70, 98], accent: [245, 194, 107], dark: [30, 42, 62] };
  }
  if (asset.key === "ui_button_secondary_9slice") {
    return { base: [255, 248, 226], accent: [198, 160, 82], dark: [76, 62, 58] };
  }
  if (asset.key === "ui_slot_reward_9slice") {
    return { base: [255, 246, 220], accent: [88, 143, 129], dark: [76, 62, 58] };
  }
  if (asset.key === "ui_slot_choice_9slice") {
    return { base: [255, 249, 232], accent: [198, 139, 74], dark: [76, 62, 58] };
  }
  if (asset.key === "ui_tooltip_paper_9slice") {
    return { base: [255, 242, 208], accent: [112, 139, 164], dark: [76, 62, 58] };
  }
  if (asset.key === "effect_stage_spotlight") {
    return { base: [255, 241, 195], accent: [232, 183, 80], dark: [90, 69, 82] };
  }
  if (asset.key === "effect_paper_slash") {
    return { base: [255, 238, 207], accent: [216, 82, 72], dark: [79, 54, 58] };
  }
  if (asset.key === "effect_ink_splash") {
    return { base: [238, 234, 219], accent: [75, 103, 169], dark: [45, 45, 82] };
  }
  if (asset.path.includes("/backgrounds/")) return { base: [240, 222, 178], accent, dark: [112, 92, 72] };
  if (asset.path.includes("/cards/")) return { base: [250, 238, 206], accent, dark: [98, 72, 54] };
  if (asset.path.includes("/icons/")) return { base: [246, 231, 192], accent, dark: [76, 82, 96] };
  if (asset.path.includes("/monsters/") || asset.path.includes("/bosses/")) return { base: [230, 216, 198], accent, dark: [83, 63, 88] };
  if (asset.path.includes("/effects/")) return { base: [248, 242, 218], accent, dark: [110, 80, 46] };
  return { base: [244, 230, 198], accent, dark: [84, 74, 68] };
}

function paintFor(asset) {
  if (asset.key.startsWith("card_frame_")) return paintCardFrame(asset);
  if (asset.key.startsWith("icon_card_")) return paintCardTypeIcon(asset);
  if (candidateCardArtKeys.has(asset.key)) return paintCardArt(asset);
  if (candidateIntentIconKeys.has(asset.key)) return paintIntentIcon(asset);
  if (candidateBackgroundKeys.has(asset.key)) return paintBackground(asset);
  if (candidateMonsterSpriteKeys.has(asset.key)) return paintMonsterSprite(asset);
  if (candidateBossSpriteKeys.has(asset.key)) return paintBossSprite(asset);
  if (candidateProgressIconKeys.has(asset.key)) return paintProgressIcon(asset);
  if (candidateCharacterSpriteKeys.has(asset.key)) return paintCharacterSprite(asset);
  if (candidateUiPanelKeys.has(asset.key)) return paintUiPanel(asset);
  if (candidateEffectSpriteKeys.has(asset.key)) return paintEffectSprite(asset);

  const palette = paletteFor(asset);
  const frame = asset.frameSize;
  const seed = hash(asset.key);
  return (x, y, width, height) => {
    const [br, bg, bb] = palette.base;
    const [ar, ag, ab] = palette.accent;
    const [dr, dg, db] = palette.dark;
    const border = Math.max(4, Math.floor(Math.min(width, height) * 0.035));
    const stripe = Math.floor((x + y + (seed % 47)) / Math.max(12, Math.floor(Math.min(width, height) / 9))) % 2;
    const paper = stripe ? 10 : 0;
    let r = br - paper;
    let g = bg - paper;
    let b = bb - paper;

    const inBorder = x < border || y < border || x >= width - border || y >= height - border;
    if (inBorder) {
      r = dr;
      g = dg;
      b = db;
    }

    const centerX = Math.abs(x / width - 0.5);
    const centerY = Math.abs(y / height - 0.5);
    const motif = centerX < 0.24 && centerY < 0.24;
    if (motif) {
      r = Math.floor((r + ar) / 2);
      g = Math.floor((g + ag) / 2);
      b = Math.floor((b + ab) / 2);
    }

    if (frame && (x % frame.w < 3 || y % frame.h < 3)) {
      r = Math.floor((r + dr) / 2);
      g = Math.floor((g + dg) / 2);
      b = Math.floor((b + db) / 2);
    }

    return [r, g, b, 255];
  };
}

function paintCardArt(asset) {
  const palette = paletteFor(asset);
  const seed = hash(asset.key);
  return (x, y, width, height) => {
    const [paperR, paperG, paperB] = palette.base;
    const [accentR, accentG, accentB] = palette.accent;
    const [darkR, darkG, darkB] = palette.dark;
    const grain = ((x * 17 + y * 11 + seed) % 37) < 7 ? -9 : 0;
    const stageDepth = Math.max(0, Math.min(1, y / height));
    let color = mix(
      [paperR + grain, paperG + grain, paperB + grain, 255],
      [darkR, darkG, darkB, 255],
      stageDepth * 0.16
    );

    if (insideRoundedRect(x, y, 18, 18, width - 36, height - 36, 22)) {
      color = mix(color, [255, 249, 226, 255], 0.18);
    }
    if (!insideRoundedRect(x, y, 8, 8, width - 16, height - 16, 24)) {
      return [0, 0, 0, 0];
    }
    if (!insideRoundedRect(x, y, 16, 16, width - 32, height - 32, 18)) {
      color = [darkR, darkG, darkB, 255];
    }

    const floorLine = Math.floor(height * 0.72);
    if (y > floorLine) {
      color = mix(color, [darkR, darkG, darkB, 255], 0.12);
      if ((x + seed) % 42 < 4) color = mix(color, [255, 245, 212, 255], 0.2);
    }

    if (asset.key === "card_art_sun_jab") {
      const sun = Math.hypot(x - width * 0.27, y - height * 0.26);
      if (sun < 46) color = [255, 213, 94, 255];
      if (sun < 27) color = [255, 246, 177, 255];
      if (distanceToSegment(x, y, 176, 268, 395, 76) < 13) color = [darkR, darkG, darkB, 255];
      if (distanceToSegment(x, y, 190, 255, 410, 66) < 6) color = [accentR, accentG, accentB, 255];
      if (pointInPolygon(x, y, [[396, 76], [442, 56], [421, 102]])) color = [accentR, accentG, accentB, 255];
    } else if (asset.key === "card_art_fold_guard") {
      const shield = pointInPolygon(x, y, [[260, 66], [380, 118], [352, 270], [260, 316], [168, 270], [140, 118]]);
      const fold = pointInPolygon(x, y, [[260, 88], [336, 125], [319, 248], [260, 286]]);
      if (shield) color = [darkR, darkG, darkB, 255];
      if (fold) color = [112, 164, 178, 255];
      if (distanceToSegment(x, y, 260, 88, 260, 286) < 5) color = [244, 231, 189, 255];
      if (distanceToSegment(x, y, 140, 118, 380, 118) < 7) color = [244, 231, 189, 255];
    } else if (asset.key === "card_art_page_step") {
      for (let step = 0; step < 5; step += 1) {
        const sx = 130 + step * 58;
        const sy = 254 - step * 32;
        if (insideRoundedRect(x, y, sx, sy, 116, 26, 6)) color = [darkR, darkG, darkB, 255];
        if (insideRoundedRect(x, y, sx + 8, sy + 4, 100, 14, 4)) color = [240, 229, 192, 255];
      }
      if (Math.hypot(x - 382, y - 101) < 17 || Math.hypot(x - 422, y - 84) < 11) color = [accentR, accentG, accentB, 255];
    } else if (asset.key === "card_art_ribbon_snap") {
      if (distanceToSegment(x, y, 92, 238, 192, 118) < 15) color = [darkR, darkG, darkB, 255];
      if (distanceToSegment(x, y, 180, 122, 335, 216) < 15) color = [accentR, accentG, accentB, 255];
      if (distanceToSegment(x, y, 330, 216, 430, 96) < 12) color = [darkR, darkG, darkB, 255];
      if (Math.hypot(x - 430, y - 96) < 22) color = [255, 224, 113, 255];
      if (Math.abs(x - 430) + Math.abs(y - 96) < 36) color = mix(color, [255, 236, 138, 255], 0.75);
    } else if (asset.key === "card_art_lamplight_mark") {
      const glow = Math.hypot(x - 260, y - 164);
      if (glow < 130) color = mix(color, [255, 211, 104, 255], (130 - glow) / 185);
      if (insideRoundedRect(x, y, 224, 112, 72, 96, 12)) color = [darkR, darkG, darkB, 255];
      if (insideRoundedRect(x, y, 238, 128, 44, 58, 8)) color = [255, 231, 137, 255];
      if (distanceToSegment(x, y, 260, 80, 260, 112) < 5) color = [darkR, darkG, darkB, 255];
      if (distanceToSegment(x, y, 167, 267, 354, 267) < 5 || distanceToSegment(x, y, 260, 195, 260, 313) < 5) {
        color = [accentR, accentG, accentB, 255];
      }
      if (Math.hypot(x - 260, y - 267) < 43 && Math.hypot(x - 260, y - 267) > 34) {
        color = [accentR, accentG, accentB, 255];
      }
    } else if (asset.key === "card_art_stage_patch") {
      if (insideRoundedRect(x, y, 139, 84, 242, 178, 26)) color = [darkR, darkG, darkB, 255];
      if (insideRoundedRect(x, y, 156, 101, 208, 144, 18)) color = [236, 225, 188, 255];
      if ((x > 170 && x < 350 && (y - 116) % 28 < 4) || (y > 116 && y < 230 && (x - 178) % 32 < 4)) {
        color = mix(color, [accentR, accentG, accentB, 255], 0.6);
      }
      if (distanceToSegment(x, y, 112, 292, 408, 292) < 5) color = [185, 139, 52, 255];
      if (Math.hypot(x - 151, y - 91) < 15 || Math.hypot(x - 367, y - 253) < 13) color = [255, 236, 143, 255];
    } else if (asset.key === "card_art_ink_spill") {
      const puddles = [
        [238, 174, 72],
        [289, 145, 44],
        [201, 218, 37],
        [329, 212, 32],
        [172, 156, 27],
        [352, 120, 22]
      ];
      for (const [cx, cy, radius] of puddles) {
        if (Math.hypot(x - cx, y - cy) < radius) color = [darkR, darkG, darkB, 255];
      }
      if (distanceToSegment(x, y, 126, 282, 388, 98) < 7) color = [accentR, accentG, accentB, 255];
      if (distanceToSegment(x, y, 141, 297, 408, 112) < 3) color = [238, 229, 207, 255];
    } else if (asset.key === "card_art_paper_bloom") {
      for (let petal = 0; petal < 8; petal += 1) {
        const angle = (Math.PI * 2 * petal) / 8;
        const cx = 260 + Math.cos(angle) * 58;
        const cy = 166 + Math.sin(angle) * 44;
        if (Math.hypot((x - cx) / 1.35, y - cy) < 31) color = [darkR, darkG, darkB, 255];
        if (Math.hypot((x - cx) / 1.35, y - cy) < 21) color = [235, 229, 195, 255];
      }
      if (Math.hypot(x - 260, y - 166) < 35) color = [255, 218, 103, 255];
      if (distanceToSegment(x, y, 260, 197, 260, 296) < 6) color = [accentR, accentG, accentB, 255];
      if (pointInPolygon(x, y, [[260, 244], [196, 218], [222, 272]])) color = [accentR, accentG, accentB, 255];
      if (pointInPolygon(x, y, [[260, 259], [326, 230], [302, 286]])) color = [accentR, accentG, accentB, 255];
    } else if (asset.key === "card_art_pinpoint_glint") {
      if (Math.hypot(x - 260, y - 170) < 100 && Math.hypot(x - 260, y - 170) > 92) color = [darkR, darkG, darkB, 255];
      if (Math.hypot(x - 260, y - 170) < 56 && Math.hypot(x - 260, y - 170) > 50) color = [accentR, accentG, accentB, 255];
      if (distanceToSegment(x, y, 260, 56, 260, 286) < 4 || distanceToSegment(x, y, 146, 170, 374, 170) < 4) {
        color = [darkR, darkG, darkB, 255];
      }
      if (Math.abs(x - 260) + Math.abs(y - 170) < 30) color = [255, 236, 121, 255];
      if (Math.hypot(x - 348, y - 93) < 16 || Math.hypot(x - 174, y - 258) < 12) color = [255, 244, 168, 255];
    } else if (asset.key === "card_art_curtain_call") {
      if (x < 150 || x > 370) color = mix(color, [accentR, accentG, accentB, 255], 0.72);
      if ((x < 150 || x > 370) && (x + seed) % 44 < 9) color = [darkR, darkG, darkB, 255];
      if (insideRoundedRect(x, y, 166, 86, 188, 138, 18)) color = [255, 238, 179, 255];
      if (distanceToSegment(x, y, 154, 244, 366, 244) < 7) color = [185, 139, 52, 255];
      if (distanceToSegment(x, y, 260, 96, 260, 217) < 5) color = [darkR, darkG, darkB, 255];
      if (Math.hypot(x - 260, y - 83) < 18 || Math.hypot(x - 220, y - 128) < 10 || Math.hypot(x - 300, y - 128) < 10) {
        color = [255, 229, 116, 255];
      }
    }

    return color;
  };
}

function paintCardFrame(asset) {
  const palette = paletteFor(asset);
  const seed = hash(asset.key);
  return (x, y, width, height) => {
    const radius = 24;
    if (!insideRoundedRect(x, y, 0, 0, width, height, radius)) return [0, 0, 0, 0];

    const [paperR, paperG, paperB] = palette.base;
    const [accentR, accentG, accentB] = palette.accent;
    const [darkR, darkG, darkB] = palette.dark;
    const grain = ((x * 13 + y * 7 + seed) % 29) < 6 ? -8 : 0;
    let color = [paperR + grain, paperG + grain, paperB + grain, 255];

    if (!insideRoundedRect(x, y, 9, 9, width - 18, height - 18, 18)) {
      color = [darkR, darkG, darkB, 255];
    } else if (!insideRoundedRect(x, y, 18, 18, width - 36, height - 36, 14)) {
      color = mix([accentR, accentG, accentB, 255], [darkR, darkG, darkB, 255], 0.25);
    }

    const artPanel = insideRoundedRect(x, y, 34, 86, width - 68, 172, 12);
    const textPanel = insideRoundedRect(x, y, 34, 278, width - 68, 116, 10);
    const titlePanel = insideRoundedRect(x, y, 82, 28, width - 106, 38, 10);
    if (artPanel || textPanel || titlePanel) {
      color = mix(color, [255, 250, 230, 255], 0.6);
      if (nearPanelEdge(x, y, artPanel, 34, 86, width - 68, 172, 12)
        || nearPanelEdge(x, y, textPanel, 34, 278, width - 68, 116, 10)
        || nearPanelEdge(x, y, titlePanel, 82, 28, width - 106, 38, 10)) {
        color = [darkR, darkG, darkB, 255];
      }
    }

    const costDistance = Math.hypot(x - 48, y - 48);
    if (costDistance < 34) color = [darkR, darkG, darkB, 255];
    if (costDistance < 25) color = [247, 220, 124, 255];
    if (costDistance < 12) color = [255, 248, 199, 255];

    if (y > height - 56 && insideRoundedRect(x, y, 70, height - 62, width - 140, 34, 14)) {
      color = mix([accentR, accentG, accentB, 255], [255, 244, 214, 255], 0.18);
    }

    if ((x > 22 && x < 48 && y > height - 48 && y < height - 24)
      || (x > width - 48 && x < width - 22 && y > height - 48 && y < height - 24)) {
      color = [185, 139, 52, 255];
    }

    return color;
  };
}

function paintCardTypeIcon(asset) {
  const palette = paletteFor(asset);
  return (x, y, width, height) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.43;
    const distance = Math.hypot(x - centerX, y - centerY);
    if (distance > radius) return [0, 0, 0, 0];

    const [paperR, paperG, paperB] = palette.base;
    const [accentR, accentG, accentB] = palette.accent;
    const [darkR, darkG, darkB] = palette.dark;
    let color = distance > radius - 5
      ? [darkR, darkG, darkB, 255]
      : [paperR, paperG, paperB, 255];

    if (distance < radius - 12) color = mix(color, [accentR, accentG, accentB, 255], 0.2);

    if (asset.key.endsWith("_attack")) {
      const slashA = distanceToSegment(x, y, 29, 67, 67, 25) < 5;
      const slashB = distanceToSegment(x, y, 35, 72, 72, 35) < 3;
      if (slashA || slashB) color = [darkR, darkG, darkB, 255];
      if (Math.hypot(x - 68, y - 25) < 8) color = [207, 92, 82, 255];
    } else if (asset.key.endsWith("_defense")) {
      const shield = pointInPolygon(x, y, [[48, 22], [69, 33], [64, 65], [48, 78], [32, 65], [27, 33]]);
      const inner = pointInPolygon(x, y, [[48, 31], [59, 38], [56, 60], [48, 68], [40, 60], [37, 38]]);
      if (shield) color = [darkR, darkG, darkB, 255];
      if (inner) color = [92, 160, 177, 255];
    } else {
      const diamond = Math.abs(x - 48) + Math.abs(y - 48) < 22;
      const sparkleA = Math.abs(x - 67) + Math.abs(y - 28) < 9;
      const sparkleB = Math.abs(x - 28) + Math.abs(y - 66) < 7;
      if (diamond || sparkleA || sparkleB) color = [darkR, darkG, darkB, 255];
      if (Math.abs(x - 48) + Math.abs(y - 48) < 12) color = [244, 203, 96, 255];
    }

    return color;
  };
}

function paintIntentIcon(asset) {
  const palette = paletteFor(asset);
  const seed = hash(asset.key);
  return (x, y, width, height) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.44;
    const distance = Math.hypot(x - centerX, y - centerY);
    if (distance > radius) return [0, 0, 0, 0];

    const [paperR, paperG, paperB] = palette.base;
    const [accentR, accentG, accentB] = palette.accent;
    const [darkR, darkG, darkB] = palette.dark;
    const grain = ((x * 19 + y * 23 + seed) % 41) < 8 ? -8 : 0;
    let color = [paperR + grain, paperG + grain, paperB + grain, 255];

    if (distance > radius - 5) {
      color = [darkR, darkG, darkB, 255];
    } else if (distance < radius - 12) {
      color = mix(color, [accentR, accentG, accentB, 255], 0.18);
    }

    if (Math.abs(x - centerX) + Math.abs(y - centerY) < 22) {
      color = mix(color, [255, 248, 218, 255], 0.14);
    }

    if (asset.key === "icon_intent_attack") {
      if (distanceToSegment(x, y, 27, 70, 67, 30) < 6) color = [darkR, darkG, darkB, 255];
      if (distanceToSegment(x, y, 36, 73, 75, 34) < 3) color = [255, 224, 126, 255];
      if (pointInPolygon(x, y, [[66, 22], [80, 25], [72, 39]])) color = [accentR, accentG, accentB, 255];
      if (distanceToSegment(x, y, 23, 40, 38, 25) < 3 || distanceToSegment(x, y, 58, 74, 74, 58) < 3) {
        color = [accentR, accentG, accentB, 255];
      }
    } else if (asset.key === "icon_intent_disrupt") {
      const boltA = distanceToSegment(x, y, 27, 35, 43, 49) < 5;
      const boltB = distanceToSegment(x, y, 43, 49, 34, 62) < 5;
      const boltC = distanceToSegment(x, y, 34, 62, 65, 38) < 5;
      const boltD = distanceToSegment(x, y, 65, 38, 55, 66) < 5;
      if (boltA || boltB || boltC || boltD) color = [darkR, darkG, darkB, 255];
      if (distanceToSegment(x, y, 27, 35, 43, 49) < 2 || distanceToSegment(x, y, 34, 62, 65, 38) < 2) {
        color = [accentR, accentG, accentB, 255];
      }
      if (insideRoundedRect(x, y, 29, 25, 28, 19, 4) || insideRoundedRect(x, y, 47, 54, 24, 17, 4)) {
        color = mix([paperR, paperG, paperB, 255], [darkR, darkG, darkB, 255], 0.44);
      }
    } else if (asset.key === "icon_intent_block") {
      const shield = pointInPolygon(x, y, [[48, 18], [72, 30], [68, 64], [48, 79], [28, 64], [24, 30]]);
      const inner = pointInPolygon(x, y, [[48, 28], [61, 35], [58, 58], [48, 68], [38, 58], [35, 35]]);
      if (shield) color = [darkR, darkG, darkB, 255];
      if (inner) color = [accentR, accentG, accentB, 255];
      if (distanceToSegment(x, y, 48, 30, 48, 66) < 4 || distanceToSegment(x, y, 36, 43, 60, 43) < 3) {
        color = [235, 238, 218, 255];
      }
      if (distanceToSegment(x, y, 24, 72, 72, 72) < 3) color = [185, 139, 52, 255];
    }

    return color;
  };
}

function paintBackground(asset) {
  const palette = paletteFor(asset);
  const seed = hash(asset.key);
  return (x, y, width, height) => {
    const [paperR, paperG, paperB] = palette.base;
    const [accentR, accentG, accentB] = palette.accent;
    const [darkR, darkG, darkB] = palette.dark;
    const depth = Math.max(0, Math.min(1, y / height));
    const grain = ((x * 7 + y * 13 + seed) % 43) < 7 ? -7 : 0;
    let color = mix(
      [paperR + grain, paperG + grain, paperB + grain, 255],
      [darkR, darkG, darkB, 255],
      depth * 0.18
    );

    if (asset.key === "bg_lantern_foyer_set") {
      const centerGlow = Math.hypot((x - width * 0.5) / 1.35, y - height * 0.36);
      if (centerGlow < 420) color = mix(color, [255, 230, 134, 255], (420 - centerGlow) / 900);
      if (y > height * 0.68) color = mix(color, [116, 80, 68, 255], 0.22);
      if (Math.abs(y - height * 0.68) < 5) color = [darkR, darkG, darkB, 255];

      const archOuter = Math.hypot((x - width * 0.5) / 1.7, y - height * 0.37);
      if (archOuter > 410 && archOuter < 430 && y < height * 0.7) color = [darkR, darkG, darkB, 255];
      const archInner = Math.hypot((x - width * 0.5) / 1.7, y - height * 0.39);
      if (archInner > 330 && archInner < 338 && y < height * 0.66) color = [185, 139, 52, 255];

      for (const lx of [width * 0.19, width * 0.31, width * 0.69, width * 0.81]) {
        if (distanceToSegment(x, y, lx, 135, lx, 760) < 5) color = [darkR, darkG, darkB, 255];
        if (insideRoundedRect(x, y, lx - 24, 210, 48, 88, 12) || insideRoundedRect(x, y, lx - 20, 520, 40, 74, 10)) {
          color = [255, 218, 105, 255];
        }
        if (insideRoundedRect(x, y, lx - 31, 202, 62, 102, 14) && !insideRoundedRect(x, y, lx - 23, 211, 46, 84, 10)) {
          color = [darkR, darkG, darkB, 255];
        }
      }

      for (let panel = 0; panel < 7; panel += 1) {
        const px = 250 + panel * 236;
        if (insideRoundedRect(x, y, px, 718, 174, 116, 10)) color = mix(color, [255, 246, 211, 255], 0.42);
        if (Math.abs(x - px) < 4 && y > 720 && y < 870) color = [darkR, darkG, darkB, 255];
      }

      if ((x < width * 0.13 || x > width * 0.87) && y < height * 0.78) {
        color = mix(color, [accentR, accentG, accentB, 255], 0.46);
        if ((Math.floor((x + seed) / 38) + Math.floor(y / 54)) % 3 === 0) color = mix(color, [darkR, darkG, darkB, 255], 0.35);
      }
    } else if (asset.key === "scene_rune_bench") {
      const tableTop = insideRoundedRect(x, y, 520, 620, 880, 86, 20);
      const tableFront = insideRoundedRect(x, y, 570, 700, 780, 170, 18);
      if (y > height * 0.7) color = mix(color, [93, 78, 78, 255], 0.22);
      if (tableTop || tableFront) color = [darkR, darkG, darkB, 255];
      if (insideRoundedRect(x, y, 555, 638, 810, 42, 14)) color = [206, 178, 112, 255];
      if (insideRoundedRect(x, y, 615, 720, 660, 104, 18)) color = mix([paperR, paperG, paperB, 255], [darkR, darkG, darkB, 255], 0.38);

      const circle = Math.hypot(x - width * 0.5, y - height * 0.43);
      if (circle < 205) color = mix(color, [accentR, accentG, accentB, 255], 0.26);
      if (circle > 195 && circle < 207) color = [darkR, darkG, darkB, 255];
      if (circle > 128 && circle < 136) color = [185, 139, 52, 255];

      for (let mark = 0; mark < 8; mark += 1) {
        const angle = (Math.PI * 2 * mark) / 8;
        const cx = width * 0.5 + Math.cos(angle) * 160;
        const cy = height * 0.43 + Math.sin(angle) * 102;
        if (Math.abs(x - cx) + Math.abs(y - cy) < 28) color = [accentR, accentG, accentB, 255];
        if (Math.abs(x - cx) + Math.abs(y - cy) < 14) color = [255, 241, 172, 255];
      }

      if (distanceToSegment(x, y, 750, 565, 1170, 565) < 5 || distanceToSegment(x, y, 960, 342, 960, 565) < 5) {
        color = [darkR, darkG, darkB, 255];
      }
      if (insideRoundedRect(x, y, 898, 488, 124, 84, 14)) color = [255, 226, 118, 255];
      if (insideRoundedRect(x, y, 916, 505, 88, 48, 10)) color = [accentR, accentG, accentB, 255];

      for (const shelfY of [210, 308, 406]) {
        if (distanceToSegment(x, y, 240, shelfY, 560, shelfY) < 5 || distanceToSegment(x, y, 1360, shelfY, 1680, shelfY) < 5) {
          color = [darkR, darkG, darkB, 255];
        }
      }
    }

    if (x < 18 || y < 18 || x >= width - 18 || y >= height - 18) {
      color = mix(color, [darkR, darkG, darkB, 255], 0.55);
    }

    return color;
  };
}

function paintUiPanel(asset) {
  if (asset.key === "ui_button_primary_9slice" || asset.key === "ui_button_secondary_9slice") {
    return paintUiButton(asset);
  }
  if (asset.key === "ui_slot_reward_9slice" || asset.key === "ui_slot_choice_9slice") {
    return paintUiSlot(asset);
  }
  if (asset.key === "ui_tooltip_paper_9slice") {
    return paintUiTooltip(asset);
  }

  const palette = paletteFor(asset);
  const seed = hash(asset.key);
  return (x, y, width, height) => {
    const [paperR, paperG, paperB] = palette.base;
    const [accentR, accentG, accentB] = palette.accent;
    const [darkR, darkG, darkB] = palette.dark;
    const grain = ((x * 19 + y * 11 + seed) % 37) < 8 ? -8 : 0;
    const paper = [paperR + grain, paperG + grain, paperB + grain, 250];
    const accent = [accentR, accentG, accentB, 255];
    const dark = [darkR, darkG, darkB, 255];

    if (!insideRoundedRect(x, y, 6, 6, width - 12, height - 12, 22)) {
      return [0, 0, 0, 0];
    }

    let color = paper;
    if (!insideRoundedRect(x, y, 12, 12, width - 24, height - 24, 18)) {
      color = dark;
    } else if (!insideRoundedRect(x, y, 21, 21, width - 42, height - 42, 14)) {
      color = mix(accent, dark, 0.12);
    } else if (!insideRoundedRect(x, y, 34, 34, width - 68, height - 68, 10)) {
      color = mix(paper, accent, 0.22);
    }

    const brassCorners = [
      [[7, 7], [78, 7], [7, 78]],
      [[width - 8, 7], [width - 78, 7], [width - 8, 78]],
      [[7, height - 8], [78, height - 8], [7, height - 78]],
      [[width - 8, height - 8], [width - 78, height - 8], [width - 8, height - 78]]
    ];
    if (brassCorners.some((points) => pointInPolygon(x, y, points))) {
      color = mix(accent, dark, 0.08);
    }

    const foldInset = 48;
    const topStitch = distanceToSegment(x, y, foldInset, 52, width - foldInset, 52) < 2
      && Math.floor((x + seed) / 18) % 2 === 0;
    const bottomStitch = distanceToSegment(x, y, foldInset, height - 52, width - foldInset, height - 52) < 2
      && Math.floor((x + seed) / 18) % 2 === 0;
    const leftStitch = distanceToSegment(x, y, 52, foldInset, 52, height - foldInset) < 2
      && Math.floor((y + seed) / 18) % 2 === 0;
    const rightStitch = distanceToSegment(x, y, width - 52, foldInset, width - 52, height - foldInset) < 2
      && Math.floor((y + seed) / 18) % 2 === 0;
    if (topStitch || bottomStitch || leftStitch || rightStitch) {
      color = mix(color, dark, 0.28);
    }

    for (const [cx, cy] of [
      [34, 34],
      [width - 34, 34],
      [34, height - 34],
      [width - 34, height - 34]
    ]) {
      const pinDistance = Math.hypot(x - cx, y - cy);
      if (pinDistance < 12) color = dark;
      if (pinDistance < 7) color = accent;
      if (pinDistance < 3) color = [255, 236, 157, 255];
    }

    if (pointInPolygon(x, y, [[width - 82, 36], [width - 38, 36], [width - 38, 82]])) {
      color = mix(color, [255, 255, 235, 255], 0.28);
    }
    if (pointInPolygon(x, y, [[36, height - 82], [36, height - 38], [82, height - 38]])) {
      color = mix(color, dark, 0.08);
    }
    if ((x > 54 && x < width - 54 && y > 54 && y < height - 54)
      && ((Math.floor((x + seed) / 29) + Math.floor(y / 41)) % 9 === 0)) {
      color = mix(color, [255, 255, 235, 255], 0.18);
    }

    return color;
  };
}

function paintUiButton(asset) {
  const palette = paletteFor(asset);
  const seed = hash(asset.key);
  const isPrimary = asset.key === "ui_button_primary_9slice";
  return (x, y, width, height) => {
    const [paperR, paperG, paperB] = palette.base;
    const [accentR, accentG, accentB] = palette.accent;
    const [darkR, darkG, darkB] = palette.dark;
    const grain = ((x * 17 + y * 13 + seed) % 31) < 6 ? -8 : 0;
    if (!insideRoundedRect(x, y, 4, 6, width - 8, height - 12, 20)) return [0, 0, 0, 0];

    let color = isPrimary
      ? [paperR + grain, paperG + grain, paperB + grain, 255]
      : [255 + grain, 248 + grain, 226 + grain, 255];
    if (!insideRoundedRect(x, y, 9, 11, width - 18, height - 22, 15)) {
      color = [darkR, darkG, darkB, 255];
    } else if (!insideRoundedRect(x, y, 17, 18, width - 34, height - 36, 10)) {
      color = isPrimary ? [accentR, accentG, accentB, 255] : mix([accentR, accentG, accentB, 255], [darkR, darkG, darkB, 255], 0.12);
    } else if (isPrimary) {
      color = mix(color, [33, 76, 78, 255], 0.28);
    }
    if (insideRoundedRect(x, y, 25, 18, width - 50, Math.max(8, height * 0.2), 7)) {
      color = mix(color, isPrimary ? [255, 255, 235, 255] : [255, 236, 170, 255], isPrimary ? 0.16 : 0.22);
    }
    if (distanceToSegment(x, y, 24, height - 18, width - 24, height - 18) < 2
      && Math.floor((x + seed) / 15) % 2 === 0) {
      color = mix(color, [255, 239, 157, 255], 0.6);
    }
    if (pointInPolygon(x, y, [[9, height / 2], [31, height / 2 - 18], [31, height / 2 + 18]])
      || pointInPolygon(x, y, [[width - 9, height / 2], [width - 31, height / 2 - 18], [width - 31, height / 2 + 18]])) {
      color = mix(isPrimary ? [accentR, accentG, accentB, 255] : [darkR, darkG, darkB, 255], [255, 226, 126, 255], 0.18);
    }
    for (const [cx, cy] of [[20, 22], [width - 20, 22], [20, height - 22], [width - 20, height - 22]]) {
      if (Math.abs(x - cx) + Math.abs(y - cy) < 8) color = [accentR, accentG, accentB, 255];
      if (Math.abs(x - cx) + Math.abs(y - cy) < 4) color = [255, 240, 154, 255];
    }
    return color;
  };
}

function paintUiSlot(asset) {
  const palette = paletteFor(asset);
  const seed = hash(asset.key);
  const isReward = asset.key === "ui_slot_reward_9slice";
  return (x, y, width, height) => {
    const [paperR, paperG, paperB] = palette.base;
    const [accentR, accentG, accentB] = palette.accent;
    const [darkR, darkG, darkB] = palette.dark;
    const grain = ((x * 19 + y * 7 + seed) % 37) < 8 ? -8 : 0;
    if (!insideRoundedRect(x, y, 5, 6, width - 10, height - 12, 22)) return [0, 0, 0, 0];

    let color = [paperR + grain, paperG + grain, paperB + grain, 250];
    if (!insideRoundedRect(x, y, 11, 12, width - 22, height - 24, 16)) {
      color = [darkR, darkG, darkB, 255];
    } else if (!insideRoundedRect(x, y, 21, 22, width - 42, height - 44, 11)) {
      color = mix([accentR, accentG, accentB, 255], [darkR, darkG, darkB, 255], isReward ? 0.04 : 0.16);
    } else if (isReward && insideRoundedRect(x, y, 38, 44, width - 76, height - 92, 12)) {
      color = mix(color, [32, 52, 62, 255], 0.2);
    }

    const medallionX = isReward ? 54 : 38;
    if (Math.hypot(x - medallionX, y - height / 2) < (isReward ? 28 : 18)) {
      color = [darkR, darkG, darkB, 255];
    }
    if (Math.hypot(x - medallionX, y - height / 2) < (isReward ? 20 : 11)) {
      color = [accentR, accentG, accentB, 255];
    }
    if (isReward && pointInPolygon(x, y, [[width / 2 - 34, 14], [width / 2, 0], [width / 2 + 34, 14], [width / 2, 46]])) {
      color = mix([accentR, accentG, accentB, 255], [255, 230, 122, 255], 0.2);
    }
    if (!isReward && x > width - 56 && y < 48 && x + y > width - 44) {
      color = mix([accentR, accentG, accentB, 255], [255, 241, 180, 255], 0.28);
    }
    if ((distanceToSegment(x, y, isReward ? 92 : 66, 30, width - 38, 30) < 2
      || distanceToSegment(x, y, isReward ? 92 : 66, height - 30, width - 38, height - 30) < 2)
      && Math.floor((x + seed) / 16) % 2 === 0) {
      color = mix(color, [255, 255, 235, 255], 0.32);
    }
    for (const [cx, cy] of [[25, 24], [width - 25, 24], [25, height - 24], [width - 25, height - 24]]) {
      if (Math.hypot(x - cx, y - cy) < 8) color = [darkR, darkG, darkB, 255];
      if (Math.hypot(x - cx, y - cy) < 5) color = [accentR, accentG, accentB, 255];
    }
    return color;
  };
}

function paintUiTooltip(asset) {
  const palette = paletteFor(asset);
  const seed = hash(asset.key);
  return (x, y, width, height) => {
    const [paperR, paperG, paperB] = palette.base;
    const [accentR, accentG, accentB] = palette.accent;
    const [darkR, darkG, darkB] = palette.dark;
    const grain = ((x * 11 + y * 17 + seed) % 41) < 9 ? -7 : 0;
    if (!insideRoundedRect(x, y, 6, 6, width - 12, height - 12, 18)) return [0, 0, 0, 0];

    let color = [paperR + grain, paperG + grain, paperB + grain, 248];
    if (!insideRoundedRect(x, y, 12, 12, width - 24, height - 24, 13)) {
      color = [darkR, darkG, darkB, 255];
    } else if (!insideRoundedRect(x, y, 20, 20, width - 40, height - 40, 9)) {
      color = mix([accentR, accentG, accentB, 255], [255, 241, 180, 255], 0.3);
    }
    if (distanceToSegment(x, y, 34, 32, width - 34, 32) < 2
      && Math.floor((x + seed) / 17) % 2 === 0) color = mix(color, [255, 255, 235, 255], 0.34);
    if (Math.abs(x - 31) + Math.abs(y - height / 2) < 12) color = [accentR, accentG, accentB, 255];
    if (pointInPolygon(x, y, [[48, height - 16], [76, height - 16], [62, height - 2]])) {
      color = mix([accentR, accentG, accentB, 255], [255, 241, 180, 255], 0.26);
    }
    for (const [cx, cy] of [[28, 26], [width - 28, 26]]) {
      if (Math.hypot(x - cx, y - cy) < 8) color = [darkR, darkG, darkB, 255];
      if (Math.hypot(x - cx, y - cy) < 5) color = [accentR, accentG, accentB, 255];
    }
    return color;
  };
}

function paintCharacterSprite(asset) {
  const palette = paletteFor(asset);
  const seed = hash(asset.key);
  return (x, y, width, height) => {
    const frameWidth = asset.frameSize?.w ?? width;
    const frameHeight = asset.frameSize?.h ?? height;
    const columns = Math.max(1, Math.floor(width / frameWidth));
    const frameIndex = Math.floor(y / frameHeight) * columns + Math.floor(x / frameWidth);
    const fx = x % frameWidth;
    const fy = y % frameHeight;
    const bob = Math.round(Math.sin((frameIndex / 16) * Math.PI * 2) * 4);
    const armSwing = Math.round(Math.cos((frameIndex / 16) * Math.PI * 2) * 6);
    const [paperR, paperG, paperB] = palette.base;
    const [accentR, accentG, accentB] = palette.accent;
    const [darkR, darkG, darkB] = palette.dark;
    const grain = ((fx * 13 + fy * 17 + seed + frameIndex * 19) % 43) < 7 ? -8 : 0;
    const paper = [paperR + grain, paperG + grain, paperB + grain, 255];
    const accent = [accentR, accentG, accentB, 255];
    const dark = [darkR, darkG, darkB, 255];
    const gold = [224, 174, 82, 255];
    const centerX = 96;
    const headY = 58 + bob;

    if (insideEllipse(fx, fy, centerX, 170, 50, 12)) {
      return [darkR, darkG, darkB, 70];
    }

    let color = [0, 0, 0, 0];
    const cloak = pointInPolygon(fx, fy, [
      [centerX - 35, 88 + bob],
      [centerX + 35, 88 + bob],
      [centerX + 50, 160],
      [centerX - 50, 160]
    ]);
    const apron = pointInPolygon(fx, fy, [
      [centerX - 21, 95 + bob],
      [centerX + 21, 95 + bob],
      [centerX + 30, 151],
      [centerX - 30, 151]
    ]);
    const hair = insideEllipse(fx, fy, centerX, headY - 9, 31, 27)
      || insideEllipse(fx, fy, centerX - 22, headY + 6, 15, 21)
      || insideEllipse(fx, fy, centerX + 22, headY + 6, 15, 21);
    const face = insideEllipse(fx, fy, centerX, headY + 3, 22, 24);

    if (cloak) color = mix(accent, dark, 0.13);
    if (apron) color = mix(paper, [255, 255, 236, 255], 0.24);
    if (hair) color = dark;
    if (face) color = paper;

    const leftArm = distanceToSegment(fx, fy, centerX - 31, 101 + bob, centerX - 63 - armSwing, 135) < 7;
    const rightArm = distanceToSegment(fx, fy, centerX + 31, 101 + bob, centerX + 62 - armSwing, 130) < 7;
    if (leftArm || rightArm) color = dark;

    const leftPage = pointInPolygon(fx, fy, [
      [centerX - 78 - armSwing, 113],
      [centerX - 49 - armSwing, 121],
      [centerX - 53 - armSwing, 151],
      [centerX - 83 - armSwing, 143]
    ]);
    const rightPage = pointInPolygon(fx, fy, [
      [centerX + 47 - armSwing, 109],
      [centerX + 80 - armSwing, 102],
      [centerX + 85 - armSwing, 133],
      [centerX + 52 - armSwing, 141]
    ]);
    if (leftPage || rightPage) color = paper;
    if ((leftPage || rightPage) && ((fx + fy + frameIndex) % 23 < 2)) color = mix(color, gold, 0.34);

    if (insideEllipse(fx, fy, centerX - 8, headY + 1, 3, 3)
      || insideEllipse(fx, fy, centerX + 8, headY + 1, 3, 3)) {
      color = [255, 226, 107, 255];
    }
    if (distanceToSegment(fx, fy, centerX - 8, headY + 14, centerX, headY + 19) < 2
      || distanceToSegment(fx, fy, centerX, headY + 19, centerX + 8, headY + 14) < 2) {
      color = dark;
    }
    if (Math.abs(fx - centerX) + Math.abs(fy - (headY - 36)) < 14) color = gold;
    if (distanceToSegment(fx, fy, centerX - 20, 160, centerX - 33, 180) < 5
      || distanceToSegment(fx, fy, centerX + 20, 160, centerX + 33, 180) < 5) {
      color = dark;
    }
    if (insideRoundedRect(fx, fy, centerX - 43, 173, 28, 9, 5)
      || insideRoundedRect(fx, fy, centerX + 15, 173, 28, 9, 5)) {
      color = gold;
    }
    if ((cloak || apron || hair) && ((fx * 5 + fy + frameIndex) % 31 < 2)) {
      color = mix(color, [255, 250, 220, 255], 0.22);
    }

    return color;
  };
}

function paintMonsterSprite(asset) {
  const palette = paletteFor(asset);
  const seed = hash(asset.key);
  return (x, y, width, height) => {
    const frameWidth = asset.frameSize?.w ?? width;
    const frameHeight = asset.frameSize?.h ?? height;
    const columns = Math.max(1, Math.floor(width / frameWidth));
    const frameColumn = Math.floor(x / frameWidth);
    const frameRow = Math.floor(y / frameHeight);
    const frameIndex = frameRow * columns + frameColumn;
    const fx = x % frameWidth;
    const fy = y % frameHeight;
    const bob = Math.round(Math.sin((frameIndex / 16) * Math.PI * 2) * 5);
    const lean = Math.round(Math.cos((frameIndex / 16) * Math.PI * 2) * 3);
    const [paperR, paperG, paperB] = palette.base;
    const [accentR, accentG, accentB] = palette.accent;
    const [darkR, darkG, darkB] = palette.dark;
    const grain = ((fx * 17 + fy * 9 + seed + frameIndex * 11) % 37) < 6 ? -9 : 0;
    const paper = [paperR + grain, paperG + grain, paperB + grain, 255];
    const accent = [accentR, accentG, accentB, 255];
    const dark = [darkR, darkG, darkB, 255];

    if (insideEllipse(fx, fy, 96, 164, 56, 13)) {
      return [darkR, darkG, darkB, 72];
    }

    if (asset.key === "monster_folded_sentry") {
      let color = [0, 0, 0, 0];
      const body = pointInPolygon(fx, fy, [
        [96 + lean, 34 + bob],
        [143 + lean, 82 + bob],
        [130 + lean, 145 + bob],
        [96 + lean, 165 + bob],
        [62 + lean, 145 + bob],
        [49 + lean, 82 + bob]
      ]);
      const innerFold = pointInPolygon(fx, fy, [
        [96 + lean, 48 + bob],
        [130 + lean, 86 + bob],
        [119 + lean, 133 + bob],
        [96 + lean, 151 + bob]
      ]);
      const leftFold = pointInPolygon(fx, fy, [
        [96 + lean, 48 + bob],
        [61 + lean, 88 + bob],
        [72 + lean, 135 + bob],
        [96 + lean, 151 + bob]
      ]);

      if (body) color = paper;
      if (leftFold) color = mix(color, [255, 248, 220, 255], 0.26);
      if (innerFold) color = mix(accent, paper, 0.24);
      if (body && !pointInPolygon(fx, fy, [
        [96 + lean, 42 + bob],
        [135 + lean, 84 + bob],
        [124 + lean, 141 + bob],
        [96 + lean, 158 + bob],
        [68 + lean, 141 + bob],
        [57 + lean, 84 + bob]
      ])) {
        color = dark;
      }

      if (insideRoundedRect(fx, fy, 77 + lean, 76 + bob, 38, 22, 6)) color = dark;
      if (insideRoundedRect(fx, fy, 84 + lean, 82 + bob, 24, 9, 4)) color = [255, 225, 112, 255];
      if (distanceToSegment(fx, fy, 132 + lean, 58 + bob, 158 + lean, 143 + bob) < 4) color = dark;
      if (distanceToSegment(fx, fy, 136 + lean, 59 + bob, 162 + lean, 142 + bob) < 2) color = [185, 139, 52, 255];
      if (pointInPolygon(fx, fy, [[127 + lean, 52 + bob], [141 + lean, 47 + bob], [136 + lean, 66 + bob]])) color = [185, 139, 52, 255];
      if (distanceToSegment(fx, fy, 69 + lean, 150 + bob, 50 + lean, 174) < 5
        || distanceToSegment(fx, fy, 123 + lean, 150 + bob, 142 + lean, 174) < 5) {
        color = dark;
      }
      if (body && ((fx + fy + frameIndex) % 29 < 2)) color = mix(color, [255, 255, 235, 255], 0.3);
      return color;
    }

    if (asset.key === "monster_ink_mote") {
      let color = [0, 0, 0, 0];
      const centerX = 96 + lean;
      const centerY = 101 + bob;
      const body = insideEllipse(fx, fy, centerX, centerY, 48, 41)
        || insideEllipse(fx, fy, centerX - 27, centerY + 14, 27, 24)
        || insideEllipse(fx, fy, centerX + 28, centerY + 13, 25, 23);
      const core = insideEllipse(fx, fy, centerX, centerY + 3, 31, 27);
      const flame = pointInPolygon(fx, fy, [
        [centerX - 17, centerY - 34],
        [centerX + 2, centerY - 75],
        [centerX + 20, centerY - 35],
        [centerX + 15, centerY - 12],
        [centerX - 14, centerY - 11]
      ]);

      if (body || flame) color = dark;
      if (core) color = mix(accent, [38, 38, 72, 255], 0.4);
      if (insideEllipse(fx, fy, centerX - 15, centerY - 5, 9, 7)
        || insideEllipse(fx, fy, centerX + 15, centerY - 5, 9, 7)) {
        color = [255, 229, 119, 255];
      }
      if (insideEllipse(fx, fy, centerX - 17, centerY - 7, 4, 3)
        || insideEllipse(fx, fy, centerX + 13, centerY - 7, 4, 3)) {
        color = [255, 249, 192, 255];
      }
      if (insideEllipse(fx, fy, centerX - 33, centerY + 50, 7, 12)
        || insideEllipse(fx, fy, centerX + 38, centerY + 48, 6, 10)
        || insideEllipse(fx, fy, centerX + 8, centerY + 66, 8, 13)) {
        color = dark;
      }
      if (distanceToSegment(fx, fy, centerX - 36, centerY + 28, centerX + 40, centerY + 36) < 3) {
        color = mix(accent, [255, 248, 216, 255], 0.28);
      }
      if ((body || flame) && ((fx * 3 + fy + frameIndex) % 31 < 2)) color = mix(color, [121, 148, 206, 255], 0.45);
      return color;
    }

    return [0, 0, 0, 0];
  };
}

function paintBossSprite(asset) {
  const palette = paletteFor(asset);
  const seed = hash(asset.key);
  return (x, y, width, height) => {
    const frameWidth = asset.frameSize?.w ?? width;
    const frameHeight = asset.frameSize?.h ?? height;
    const columns = Math.max(1, Math.floor(width / frameWidth));
    const frameColumn = Math.floor(x / frameWidth);
    const frameRow = Math.floor(y / frameHeight);
    const frameIndex = frameRow * columns + frameColumn;
    const fx = x % frameWidth;
    const fy = y % frameHeight;
    const bob = Math.round(Math.sin((frameIndex / 16) * Math.PI * 2) * 7);
    const maneSpread = Math.round(Math.cos((frameIndex / 16) * Math.PI * 2) * 5);
    const [paperR, paperG, paperB] = palette.base;
    const [accentR, accentG, accentB] = palette.accent;
    const [darkR, darkG, darkB] = palette.dark;
    const grain = ((fx * 11 + fy * 15 + seed + frameIndex * 17) % 41) < 7 ? -8 : 0;
    const paper = [paperR + grain, paperG + grain, paperB + grain, 255];
    const accent = [accentR, accentG, accentB, 255];
    const dark = [darkR, darkG, darkB, 255];
    const gold = [231, 181, 82, 255];
    const centerX = 138;
    const centerY = 116 + bob;

    if (insideEllipse(fx, fy, centerX, 236, 82, 18)) {
      return [darkR, darkG, darkB, 72];
    }

    let color = [0, 0, 0, 0];
    const mane = insideEllipse(fx, fy, centerX, centerY, 82 + maneSpread, 70)
      || insideEllipse(fx, fy, centerX - 42, centerY + 19, 45, 54)
      || insideEllipse(fx, fy, centerX + 42, centerY + 19, 45, 54);
    const face = insideEllipse(fx, fy, centerX, centerY + 6, 52, 45);
    const muzzle = insideEllipse(fx, fy, centerX, centerY + 31, 37, 21);
    const chest = pointInPolygon(fx, fy, [
      [centerX - 58, 168 + bob],
      [centerX + 58, 168 + bob],
      [centerX + 73, 230],
      [centerX - 73, 230]
    ]);
    const leftCurtain = pointInPolygon(fx, fy, [
      [centerX - 113, 39],
      [centerX - 75, 31],
      [centerX - 83, 211],
      [centerX - 128, 230]
    ]);
    const rightCurtain = pointInPolygon(fx, fy, [
      [centerX + 75, 31],
      [centerX + 113, 39],
      [centerX + 128, 230],
      [centerX + 83, 211]
    ]);

    if (leftCurtain || rightCurtain) color = mix(accent, dark, 0.12);
    if ((leftCurtain || rightCurtain) && (Math.floor((fx + frameIndex * 5) / 16) % 2 === 0)) {
      color = mix(color, [255, 196, 132, 255], 0.18);
    }
    if (mane) color = dark;
    if (face) color = paper;
    if (muzzle) color = mix(paper, [255, 245, 216, 255], 0.42);
    if (chest) color = mix(paper, dark, 0.12);

    const crown = pointInPolygon(fx, fy, [
      [centerX - 39, centerY - 49],
      [centerX - 22, centerY - 78],
      [centerX, centerY - 52],
      [centerX + 23, centerY - 78],
      [centerX + 40, centerY - 49],
      [centerX + 32, centerY - 33],
      [centerX - 32, centerY - 33]
    ]);
    if (crown) color = gold;
    if (distanceToSegment(fx, fy, centerX - 32, centerY - 33, centerX + 32, centerY - 33) < 4) color = dark;

    if (insideEllipse(fx, fy, centerX - 19, centerY + 3, 8, 6)
      || insideEllipse(fx, fy, centerX + 19, centerY + 3, 8, 6)) {
      color = [255, 230, 112, 255];
    }
    if (insideEllipse(fx, fy, centerX - 20, centerY + 2, 3, 3)
      || insideEllipse(fx, fy, centerX + 18, centerY + 2, 3, 3)) {
      color = [255, 250, 196, 255];
    }
    if (insideEllipse(fx, fy, centerX, centerY + 26, 8, 6)) color = dark;
    if (distanceToSegment(fx, fy, centerX - 18, centerY + 41, centerX, centerY + 50) < 3
      || distanceToSegment(fx, fy, centerX, centerY + 50, centerX + 18, centerY + 41) < 3) {
      color = dark;
    }

    for (const [sx, sy] of [[centerX - 72, 88 + bob], [centerX + 72, 88 + bob], [centerX - 62, 141 + bob], [centerX + 62, 141 + bob]]) {
      if (Math.abs(fx - sx) + Math.abs(fy - sy) < 19) color = accent;
      if (Math.abs(fx - sx) + Math.abs(fy - sy) < 9) color = gold;
    }

    if (distanceToSegment(fx, fy, centerX - 78, 203, centerX - 46, 241) < 7
      || distanceToSegment(fx, fy, centerX + 78, 203, centerX + 46, 241) < 7) {
      color = dark;
    }
    if (insideRoundedRect(fx, fy, centerX - 88, 214, 42, 17, 8)
      || insideRoundedRect(fx, fy, centerX + 46, 214, 42, 17, 8)) {
      color = gold;
    }
    if ((mane || face || chest) && ((fx + fy + frameIndex) % 31 < 2)) {
      color = mix(color, [255, 239, 196, 255], 0.24);
    }

    return color;
  };
}

function paintProgressIcon(asset) {
  const palette = paletteFor(asset);
  const seed = hash(asset.key);
  return (x, y, width, height) => {
    const scale = Math.min(width, height) / 128;
    const nx = (x - width / 2) / scale + 64;
    const ny = (y - height / 2) / scale + 64;
    const [paperR, paperG, paperB] = palette.base;
    const [accentR, accentG, accentB] = palette.accent;
    const [darkR, darkG, darkB] = palette.dark;
    const grain = ((Math.floor(nx) * 17 + Math.floor(ny) * 23 + seed) % 43) < 8 ? -8 : 0;
    const paper = [paperR + grain, paperG + grain, paperB + grain, 255];
    const accent = [accentR, accentG, accentB, 255];
    const dark = [darkR, darkG, darkB, 255];
    const gold = [224, 174, 82, 255];
    const distance = Math.hypot(nx - 64, ny - 64);

    if (distance > 60) return [0, 0, 0, 0];

    let color = distance > 55
      ? dark
      : mix(paper, accent, distance < 47 ? 0.14 : 0.06);

    if (asset.key === "map_icon_lantern_foyer") {
      if (pointInPolygon(nx, ny, [[30, 43], [53, 35], [53, 91], [30, 99]])) color = mix(paper, accent, 0.2);
      if (pointInPolygon(nx, ny, [[53, 35], [80, 43], [80, 99], [53, 91]])) color = mix(paper, dark, 0.08);
      if (pointInPolygon(nx, ny, [[80, 43], [98, 35], [98, 91], [80, 99]])) color = mix(paper, accent, 0.34);
      if (distanceToSegment(nx, ny, 34, 47, 94, 38) < 2 || distanceToSegment(nx, ny, 53, 35, 53, 91) < 2
        || distanceToSegment(nx, ny, 80, 43, 80, 99) < 2) {
        color = dark;
      }
      if (distanceToSegment(nx, ny, 64, 23, 64, 43) < 3) color = dark;
      if (insideRoundedRect(nx, ny, 49, 43, 30, 38, 7)) color = dark;
      if (insideRoundedRect(nx, ny, 55, 52, 18, 21, 5)) color = [255, 225, 112, 255];
      if (Math.hypot(nx - 64, ny - 64) < 18) color = mix(color, [255, 240, 154, 255], 0.42);
      if (Math.abs(nx - 90) + Math.abs(ny - 83) < 12) color = accent;
      return color;
    }

    if (asset.key === "rune_paper_spark_icon") {
      const diamond = Math.abs(nx - 64) + Math.abs(ny - 64) < 38;
      const inner = Math.abs(nx - 64) + Math.abs(ny - 64) < 27;
      if (diamond) color = dark;
      if (inner) color = mix(paper, accent, 0.18);
      const flame = pointInPolygon(nx, ny, [[55, 70], [62, 39], [70, 58], [75, 42], [81, 73], [69, 89], [58, 88]]);
      if (flame) color = accent;
      if (pointInPolygon(nx, ny, [[61, 74], [65, 56], [72, 76], [66, 84]])) color = [255, 235, 128, 255];
      if (distanceToSegment(nx, ny, 36, 92, 92, 36) < 3) color = gold;
      return color;
    }

    if (asset.key === "rune_ribbon_loop_icon") {
      const leftLoop = Math.hypot((nx - 48) / 21, (ny - 64) / 16);
      const rightLoop = Math.hypot((nx - 80) / 21, (ny - 64) / 16);
      if ((leftLoop < 1.1 && leftLoop > 0.55) || (rightLoop < 1.1 && rightLoop > 0.55)) color = dark;
      if (distanceToSegment(nx, ny, 45, 49, 83, 79) < 7 || distanceToSegment(nx, ny, 45, 79, 83, 49) < 7) color = accent;
      if (distanceToSegment(nx, ny, 45, 49, 83, 79) < 3 || distanceToSegment(nx, ny, 45, 79, 83, 49) < 3) color = [255, 219, 120, 255];
      if (insideRoundedRect(nx, ny, 55, 55, 18, 18, 5)) color = dark;
      return color;
    }

    if (asset.key === "rune_glass_leaf_icon") {
      const leaf = pointInPolygon(nx, ny, [[65, 25], [91, 55], [82, 88], [56, 103], [38, 76], [43, 45]]);
      const cut = pointInPolygon(nx, ny, [[65, 35], [80, 56], [72, 80], [58, 90], [48, 72], [50, 50]]);
      if (leaf) color = dark;
      if (cut) color = mix([206, 240, 226, 255], accent, 0.22);
      if (distanceToSegment(nx, ny, 49, 92, 84, 42) < 3) color = [235, 255, 240, 255];
      if (distanceToSegment(nx, ny, 58, 74, 37, 96) < 5) color = accent;
      if (Math.hypot(nx - 85, ny - 39) < 8) color = [255, 242, 148, 255];
      return color;
    }

    if (asset.key === "relic_brass_bookmark_icon") {
      if (insideRoundedRect(nx, ny, 43, 24, 42, 82, 7)) color = dark;
      if (insideRoundedRect(nx, ny, 49, 31, 30, 67, 5)) color = gold;
      if (pointInPolygon(nx, ny, [[49, 76], [64, 93], [79, 76], [79, 99], [49, 99]])) color = dark;
      if (insideRoundedRect(nx, ny, 55, 39, 18, 9, 4) || insideRoundedRect(nx, ny, 55, 56, 18, 9, 4)) color = paper;
      if (distanceToSegment(nx, ny, 42, 106, 86, 106) < 4) color = mix(dark, gold, 0.34);
      return color;
    }

    if (asset.key === "char_mina_pagehand_portrait") {
      const hair = insideEllipse(nx, ny, 64, 50, 30, 28) || insideEllipse(nx, ny, 49, 61, 15, 20) || insideEllipse(nx, ny, 79, 61, 15, 20);
      const face = insideEllipse(nx, ny, 64, 57, 22, 24);
      const body = pointInPolygon(nx, ny, [[43, 92], [85, 92], [101, 121], [27, 121]]);
      if (body) color = mix(accent, dark, 0.12);
      if (hair) color = dark;
      if (face) color = paper;
      if (insideEllipse(nx, ny, 56, 57, 3, 3) || insideEllipse(nx, ny, 72, 57, 3, 3)) color = [255, 223, 104, 255];
      if (distanceToSegment(nx, ny, 57, 70, 64, 75) < 2 || distanceToSegment(nx, ny, 64, 75, 71, 70) < 2) color = dark;
      if (insideRoundedRect(nx, ny, 36, 88, 56, 24, 5)) color = mix(paper, [255, 255, 236, 255], 0.28);
      if (distanceToSegment(nx, ny, 36, 88, 92, 112) < 3 || distanceToSegment(nx, ny, 92, 88, 36, 112) < 3) color = dark;
      if (Math.abs(nx - 64) + Math.abs(ny - 27) < 15) color = gold;
      return color;
    }

    return color;
  };
}

function paintEffectSprite(asset) {
  const palette = paletteFor(asset);
  const seed = hash(asset.key);
  return (x, y, width, height) => {
    const frameWidth = asset.frameSize?.w ?? width;
    const frameHeight = asset.frameSize?.h ?? height;
    const columns = Math.max(1, Math.floor(width / frameWidth));
    const frameIndex = Math.floor(y / frameHeight) * columns + Math.floor(x / frameWidth);
    const fx = x % frameWidth;
    const fy = y % frameHeight;
    const progress = frameIndex / 15;
    const centerX = frameWidth / 2;
    const centerY = frameHeight / 2;
    const [paperR, paperG, paperB] = palette.base;
    const [accentR, accentG, accentB] = palette.accent;
    const [darkR, darkG, darkB] = palette.dark;
    const paper = [paperR, paperG, paperB, 255];
    const accent = [accentR, accentG, accentB, 255];
    const dark = [darkR, darkG, darkB, 255];
    const flicker = ((fx * 11 + fy * 17 + seed + frameIndex * 19) % 31) < 5 ? 22 : 0;

    if (asset.key === "effect_stage_spotlight") {
      let color = [0, 0, 0, 0];
      const coneWidth = 56 + progress * 68;
      const topWidth = 17 + progress * 8;
      const cone = pointInPolygon(fx, fy, [
        [centerX - topWidth, 24],
        [centerX + topWidth, 24],
        [centerX + coneWidth, 216],
        [centerX - coneWidth, 216]
      ]);
      const ring = Math.hypot((fx - centerX) / (78 + progress * 22), (fy - 203) / 16);
      if (cone) color = [255, 232, 133 + flicker, Math.round(72 + progress * 44)];
      if (ring < 1 && ring > 0.58) color = [232, 183, 80, Math.round(175 - progress * 35)];
      if (distanceToSegment(fx, fy, centerX - 18, 24, centerX + 18, 24) < 4) color = dark;
      if (insideEllipse(fx, fy, centerX, 26, 27, 8)) color = [255, 241, 178, 210];
      for (let dot = 0; dot < 7; dot += 1) {
        const angle = progress * Math.PI * 2 + dot * 0.9;
        const sx = centerX + Math.cos(angle) * (34 + dot * 9);
        const sy = 96 + Math.sin(angle * 1.4) * 44 + dot * 12;
        if (Math.abs(fx - sx) + Math.abs(fy - sy) < 8) color = [255, 245, 178, 190];
      }
      return color;
    }

    if (asset.key === "effect_paper_slash") {
      let color = [0, 0, 0, 0];
      const sweep = -34 + progress * 50;
      const slashA = distanceToSegment(fx, fy, 45 + sweep, 190, 206 + sweep, 49) < 9 + progress * 5;
      const slashB = distanceToSegment(fx, fy, 55 + sweep, 207, 221 + sweep, 61) < 4 + progress * 3;
      if (slashA) color = [paperR, paperG, paperB, Math.round(220 - progress * 55)];
      if (slashB) color = [accentR, accentG, accentB, Math.round(245 - progress * 65)];
      if (distanceToSegment(fx, fy, 68 + sweep, 194, 216 + sweep, 68) < 2) color = [255, 246, 185, 255];
      for (let shard = 0; shard < 8; shard += 1) {
        const sx = 66 + shard * 21 + sweep;
        const sy = 172 - shard * 15 + Math.sin(frameIndex + shard) * 18;
        if (Math.abs(fx - sx) + Math.abs(fy - sy) < 8) color = mix(accent, dark, 0.18);
        if (Math.abs(fx - sx) + Math.abs(fy - sy) < 4) color = [255, 238, 178, 230];
      }
      return color;
    }

    if (asset.key === "effect_ink_splash") {
      let color = [0, 0, 0, 0];
      const spread = 28 + progress * 72;
      const puddles = [
        [centerX, centerY, 30 + progress * 20],
        [centerX - spread * 0.58, centerY + 18, 18 + progress * 11],
        [centerX + spread * 0.66, centerY - 8, 16 + progress * 13],
        [centerX - spread * 0.3, centerY - 48, 13 + progress * 8],
        [centerX + spread * 0.28, centerY + 54, 15 + progress * 9]
      ];
      for (const [cx, cy, radius] of puddles) {
        if (insideEllipse(fx, fy, cx, cy, radius * 1.2, radius)) {
          color = mix(dark, accent, 0.18 + progress * 0.18);
          color[3] = Math.round(225 - progress * 50);
        }
      }
      for (let splat = 0; splat < 12; splat += 1) {
        const angle = splat * 0.72 + seed * 0.001;
        const sx = centerX + Math.cos(angle) * (spread * 0.42 + splat * 4);
        const sy = centerY + Math.sin(angle) * (spread * 0.3 + splat * 3);
        if (Math.hypot(fx - sx, fy - sy) < 5 + progress * 3) color = [75, 103, 169, Math.round(210 - progress * 55)];
      }
      if (Math.hypot((fx - centerX) / 1.3, fy - centerY) < 18 + progress * 10) {
        color = [45, 45, 82, Math.round(242 - progress * 42)];
      }
      return color;
    }

    return [0, 0, 0, 0];
  };
}

function mix(a, b, t) {
  return [
    Math.round(a[0] * (1 - t) + b[0] * t),
    Math.round(a[1] * (1 - t) + b[1] * t),
    Math.round(a[2] * (1 - t) + b[2] * t),
    Math.round(a[3] * (1 - t) + b[3] * t)
  ];
}

function insideRoundedRect(x, y, rectX, rectY, width, height, radius) {
  const cornerX = x < rectX + radius ? rectX + radius : x > rectX + width - radius ? rectX + width - radius : x;
  const cornerY = y < rectY + radius ? rectY + radius : y > rectY + height - radius ? rectY + height - radius : y;
  return x >= rectX && y >= rectY && x < rectX + width && y < rectY + height
    && Math.hypot(x - cornerX, y - cornerY) <= radius;
}

function nearPanelEdge(x, y, inside, rectX, rectY, width, height, radius) {
  if (!inside) return false;
  return !insideRoundedRect(x, y, rectX + 4, rectY + 4, width - 8, height - 8, Math.max(1, radius - 4));
}

function insideEllipse(x, y, centerX, centerY, radiusX, radiusY) {
  const dx = (x - centerX) / radiusX;
  const dy = (y - centerY) / radiusY;
  return dx * dx + dy * dy <= 1;
}

function distanceToSegment(px, py, ax, ay, bx, by) {
  const dx = bx - ax;
  const dy = by - ay;
  const lengthSquared = dx * dx + dy * dy;
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lengthSquared));
  const x = ax + t * dx;
  const y = ay + t * dy;
  return Math.hypot(px - x, py - y);
}

function pointInPolygon(x, y, points) {
  let inside = false;
  for (let index = 0, previous = points.length - 1; index < points.length; previous = index, index += 1) {
    const xi = points[index][0];
    const yi = points[index][1];
    const xj = points[previous][0];
    const yj = points[previous][1];
    const intersects = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
}

let generated = 0;
for (const asset of manifest.assets) {
  const width = asset.nativeSize?.w;
  const height = asset.nativeSize?.h;
  if (!Number.isInteger(width) || !Number.isInteger(height)) {
    throw new Error(`${asset.key}: nativeSize is required for dev runtime asset generation`);
  }

  const outputPath = path.join(outputRoot, asset.path);
  await mkdir(path.dirname(outputPath), { recursive: true });
  const passthroughSource = sourcePassthroughAssets.get(asset.key);
  if (passthroughSource) {
    await copyFile(passthroughSource, outputPath);
    generated += 1;
    continue;
  }
  await writeFile(outputPath, encodePng(width, height, paintFor(asset)));
  generated += 1;
}

console.log(`Generated dev runtime assets: ${generated} files under public/assets/runtime`);
