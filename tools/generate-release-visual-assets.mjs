import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { deflateSync } from "node:zlib";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(rootDir, "src", "data", "ko");
const publicRoot = path.join(rootDir, "public");
const docsManifestPath = path.join(rootDir, "docs", "asset-manifest.release.v1.json");
const runtimeManifestPath = path.join(rootDir, "src", "data", "assetManifest.release.v1.json");
const sourcePassthroughAssets = new Map([
  ["effect_stage_spotlight", path.join(rootDir, "assets", "source", "effects", "release", "effect_stage_spotlight_concept_v001.png")],
  ["effect_paper_slash", path.join(rootDir, "assets", "source", "effects", "release", "effect_paper_slash_concept_v001.png")],
  ["effect_ink_splash", path.join(rootDir, "assets", "source", "effects", "release", "effect_ink_splash_concept_v001.png")]
]);

const [cards, gems, relics, arcanas, characters, enemies, stages, events] = await Promise.all([
  readJson("cards.json"),
  readJson("gems.json"),
  readJson("relics.json"),
  readJson("arcanas.json"),
  readJson("characters.json"),
  readJson("enemies.json"),
  readJson("stages.json"),
  readJson("events.json")
]);

const assets = [
  ...sharedAssets(),
  ...cards.map((item) => imageAsset(releaseAssetKey("card_art", item.id, "card"), "card", item.id, 520, 360, `cards/${releaseAssetKey("card_art", item.id, "card")}_v001.png`)),
  ...gems.map((item) => imageAsset(releaseAssetKey("gem_icon", item.id, "gem"), "gem", item.id, 128, 128, `icons/${releaseAssetKey("gem_icon", item.id, "gem")}_v001.png`)),
  ...relics.map((item) => imageAsset(releaseAssetKey("relic_icon", item.id, "relic"), "relic", item.id, 128, 128, `icons/${releaseAssetKey("relic_icon", item.id, "relic")}_v001.png`)),
  ...arcanas.map((item) => imageAsset(releaseAssetKey("arcana_icon", item.id, "arcana"), "arcana", item.id, 128, 128, `icons/${releaseAssetKey("arcana_icon", item.id, "arcana")}_v001.png`)),
  ...characters.flatMap((item) => [
    imageAsset(releaseAssetKey("char_portrait", item.id, "char"), "character_portrait", item.id, 256, 256, `characters/${releaseAssetKey("char_portrait", item.id, "char")}_v001.png`),
    spriteAsset(releaseAssetKey("char_sprite", item.id, "char"), "character_sprite", item.id, 384, 384, 96, 96, `characters/${releaseAssetKey("char_sprite", item.id, "char")}_v001.png`)
  ]),
  ...stages.flatMap((item) => [
    imageAsset(releaseAssetKey("stage_bg", item.id, "stage"), "stage_background", item.id, 960, 540, `backgrounds/${releaseAssetKey("stage_bg", item.id, "stage")}_v001.png`),
    imageAsset(releaseAssetKey("stage_map_icon", item.id, "stage"), "stage_map_icon", item.id, 128, 128, `icons/${releaseAssetKey("stage_map_icon", item.id, "stage")}_v001.png`)
  ]),
  ...enemies.filter((item) => item.rank !== "boss")
    .map((item) => spriteAsset(releaseAssetKey("enemy_sprite", item.id, "enemy"), "enemy_sprite", item.id, 384, 384, 96, 96, `monsters/${releaseAssetKey("enemy_sprite", item.id, "enemy")}_v001.png`)),
  ...enemies.filter((item) => item.rank === "boss")
    .map((item) => spriteAsset(releaseAssetKey("boss_sprite", item.id, "boss"), "boss_sprite", item.id, 512, 512, 128, 128, `bosses/${releaseAssetKey("boss_sprite", item.id, "boss")}_v001.png`)),
  ...events.map((item) => imageAsset(releaseAssetKey("event_scene", item.id, "event"), "event_scene", item.id, 960, 540, `backgrounds/${releaseAssetKey("event_scene", item.id, "event")}_v001.png`))
];

assertUniqueAssets(assets);

const manifest = {
  metadata: {
    id: "asset_manifest_release_v1",
    date: "2026-06-01",
    status: "production_candidate_manifest",
    styleKey: "premium_popup_book",
    notes: [
      "Release catalog visual coverage manifest generated from local content ids.",
      "Entries are shippable-candidate coverage assets, not final approved art.",
      "Final art approval, animation polish, and manual readability review remain separate release gates."
    ]
  },
  assets
};

await mkdir(path.dirname(docsManifestPath), { recursive: true });
await mkdir(path.dirname(runtimeManifestPath), { recursive: true });
await writeFile(docsManifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
await writeFile(runtimeManifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

let generated = 0;
for (const asset of assets) {
  const outputPath = path.join(publicRoot, asset.path);
  await mkdir(path.dirname(outputPath), { recursive: true });
  const passthroughSource = sourcePassthroughAssets.get(asset.key);
  if (passthroughSource) {
    await copyFile(passthroughSource, outputPath);
  } else {
    await writeFile(outputPath, encodePng(asset.nativeSize.w, asset.nativeSize.h, paintFor(asset)));
  }
  generated += 1;
}

console.log(`Generated release visual assets: ${generated} files`);
console.log(`Release manifest assets=${assets.length}, cards=${cards.length}, gems=${gems.length}, relics=${relics.length}, arcanas=${arcanas.length}, characters=${characters.length}, enemies=${enemies.length}, stages=${stages.length}, events=${events.length}`);

async function readJson(fileName) {
  return JSON.parse(await readFile(path.join(dataDir, fileName), "utf8"));
}

function sharedAssets() {
  return [
    imageAsset("card_frame_attack", "card_frame", "attack", 300, 440, "cards/card_frame_attack_v001.png"),
    imageAsset("card_frame_defense", "card_frame", "defense", 300, 440, "cards/card_frame_defense_v001.png"),
    imageAsset("card_frame_skill", "card_frame", "skill", 300, 440, "cards/card_frame_skill_v001.png"),
    imageAsset("icon_card_attack", "card_type_icon", "attack", 96, 96, "icons/icon_card_attack_v001.png"),
    imageAsset("icon_card_defense", "card_type_icon", "defense", 96, 96, "icons/icon_card_defense_v001.png"),
    imageAsset("icon_card_skill", "card_type_icon", "skill", 96, 96, "icons/icon_card_skill_v001.png"),
    imageAsset("icon_intent_attack", "intent_icon", "attack", 96, 96, "icons/icon_intent_attack_v001.png"),
    imageAsset("icon_intent_disrupt", "intent_icon", "disrupt", 96, 96, "icons/icon_intent_disrupt_v001.png"),
    imageAsset("icon_intent_block", "intent_icon", "block", 96, 96, "icons/icon_intent_block_v001.png"),
    imageAsset("ui_button_primary_9slice", "ui", "button_primary", 256, 96, "ui/ui_button_primary_9slice_v001.png"),
    imageAsset("ui_button_secondary_9slice", "ui", "button_secondary", 256, 96, "ui/ui_button_secondary_9slice_v001.png"),
    imageAsset("ui_slot_reward_9slice", "ui", "slot_reward", 512, 128, "ui/ui_slot_reward_9slice_v001.png"),
    imageAsset("ui_slot_choice_9slice", "ui", "slot_choice", 512, 128, "ui/ui_slot_choice_9slice_v001.png"),
    imageAsset("ui_tooltip_paper_9slice", "ui", "tooltip_paper", 384, 128, "ui/ui_tooltip_paper_9slice_v001.png"),
    imageAsset("ui_panel_paper_9slice", "ui", "panel", 256, 256, "ui/ui_panel_paper_9slice_v001.png"),
    spriteAsset("effect_stage_spotlight", "effect", "stage_spotlight", 512, 512, 128, 128, "effects/effect_stage_spotlight_v001.png"),
    spriteAsset("effect_paper_slash", "effect", "paper_slash", 512, 512, 128, 128, "effects/effect_paper_slash_v001.png"),
    spriteAsset("effect_ink_splash", "effect", "ink_splash", 512, 512, 128, 128, "effects/effect_ink_splash_v001.png")
  ];
}

function imageAsset(key, domain, sourceContentId, width, height, fileName) {
  return {
    key,
    type: "image",
    path: `assets/runtime/release/${fileName}`,
    nativeSize: { w: width, h: height },
    styleKey: "premium_popup_book",
    production: productionMeta(domain, sourceContentId)
  };
}

function spriteAsset(key, domain, sourceContentId, width, height, frameWidth, frameHeight, fileName) {
  return {
    key,
    type: "spritesheet",
    path: `assets/runtime/release/${fileName}`,
    nativeSize: { w: width, h: height },
    frameSize: { w: frameWidth, h: frameHeight },
    anchor: { x: 0.5, y: 1 },
    styleKey: "premium_popup_book",
    production: productionMeta(domain, sourceContentId)
  };
}

function productionMeta(domain, sourceContentId) {
  return {
    status: "candidate",
    batch: "release_visual_coverage_1",
    source: "local_deterministic_generator",
    domain,
    sourceContentId,
    finalApproved: false
  };
}

function releaseAssetKey(prefix, id, sourcePrefix) {
  const trimmed = id.startsWith(`${sourcePrefix}_`) ? id.slice(sourcePrefix.length + 1) : id;
  return `${prefix}_${trimmed}`.replace(/[^a-z0-9_]/g, "_").replace(/_+/g, "_");
}

function assertUniqueAssets(rows) {
  const keys = new Set();
  const paths = new Set();
  for (const asset of rows) {
    if (keys.has(asset.key)) throw new Error(`duplicate asset key: ${asset.key}`);
    if (paths.has(asset.path)) throw new Error(`duplicate asset path: ${asset.path}`);
    keys.add(asset.key);
    paths.add(asset.path);
  }
}

function encodePng(width, height, paint) {
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y += 1) {
    const rowStart = y * (width * 4 + 1);
    raw[rowStart] = 0;
    for (let x = 0; x < width; x += 1) {
      const offset = rowStart + 1 + x * 4;
      const [r, g, b, a] = paint(x, y, width, height);
      raw[offset] = clamp(r);
      raw[offset + 1] = clamp(g);
      raw[offset + 2] = clamp(b);
      raw[offset + 3] = clamp(a);
    }
  }

  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8;
  header[9] = 6;

  return Buffer.concat([
    Buffer.from("89504e470d0a1a0a", "hex"),
    pngChunk("IHDR", header),
    pngChunk("IDAT", deflateSync(raw, { level: 6 })),
    pngChunk("IEND", Buffer.alloc(0))
  ]);
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

function paintFor(asset) {
  const palette = paletteFor(asset);
  const seed = hash(`${asset.key}:${asset.production.sourceContentId}`);
  if (asset.type === "spritesheet") return paintSprite(asset, palette, seed);
  if (asset.production.domain === "stage_background" || asset.production.domain === "event_scene") {
    return paintScene(asset, palette, seed);
  }
  if (asset.production.domain === "ui") return paintUiAsset(asset, palette, seed);
  if (asset.production.domain === "card_frame") return paintCardFrame(palette, seed);
  if (asset.production.domain === "card") return paintCardArt(palette, seed);
  return paintIcon(asset, palette, seed);
}

function paintScene(asset, palette, seed) {
  return (x, y, width, height) => {
    const sky = mix(palette.paper, palette.accent, 0.22 + ((seed % 13) / 100));
    const floor = mix(palette.paper, palette.dark, 0.18);
    let color = y < height * 0.58 ? sky : floor;
    color = addGrain(color, x, y, seed, 8);

    const archWidth = width * (0.28 + ((seed >>> 4) % 8) / 100);
    const center = width * (0.48 + ((seed >>> 9) % 7) / 100);
    const arch = Math.abs(x - center) < archWidth && y > height * 0.18 && y < height * 0.7;
    if (arch) color = mix(color, palette.dark, 0.18);
    if (Math.abs(x - center) < archWidth * 0.92 && y > height * 0.25 && y < height * 0.64) {
      color = mix(color, [255, 239, 178, 255], 0.3);
    }

    for (let panel = 0; panel < 6; panel += 1) {
      const px = width * (0.1 + panel * 0.16) + ((seed >>> panel) % 29);
      if (Math.abs(x - px) < 4 && y > height * 0.18 && y < height * 0.84) color = mix(color, palette.dark, 0.45);
    }
    if (y > height * 0.75 && ((x + seed) % 74) < 36) color = mix(color, palette.accent, 0.12);
    if (asset.production.domain === "event_scene" && insideEllipse(x, y, width * 0.5, height * 0.42, width * 0.16, height * 0.16)) {
      color = mix(color, palette.accent, 0.38);
    }
    return color;
  };
}

function paintCardFrame(palette, seed) {
  return (x, y, width, height) => {
    if (!insideRoundedRect(x, y, 0, 0, width, height, 24)) return [0, 0, 0, 0];
    let color = addGrain(palette.paper, x, y, seed, 9);
    if (!insideRoundedRect(x, y, 10, 10, width - 20, height - 20, 17)) color = palette.dark;
    if (!insideRoundedRect(x, y, 20, 20, width - 40, height - 40, 12)) color = mix(palette.accent, palette.dark, 0.24);
    if (insideRoundedRect(x, y, 34, 86, width - 68, 172, 12)
      || insideRoundedRect(x, y, 34, 278, width - 68, 116, 10)
      || insideRoundedRect(x, y, 82, 28, width - 106, 38, 10)) {
      color = mix(color, [255, 250, 230, 255], 0.55);
    }
    if (Math.hypot(x - 48, y - 48) < 34) color = palette.dark;
    if (Math.hypot(x - 48, y - 48) < 24) color = [245, 218, 118, 255];
    return color;
  };
}

function paintCardArt(palette, seed) {
  return (x, y, width, height) => {
    if (!insideRoundedRect(x, y, 8, 8, width - 16, height - 16, 24)) return [0, 0, 0, 0];
    let color = addGrain(mix(palette.paper, palette.accent, 0.08), x, y, seed, 8);
    if (!insideRoundedRect(x, y, 18, 18, width - 36, height - 36, 18)) color = palette.dark;
    if (y > height * 0.7) color = mix(color, palette.dark, 0.18);

    const cx = width * (0.48 + ((seed >>> 5) % 9) / 100);
    const cy = height * (0.43 + ((seed >>> 11) % 7) / 100);
    const motif = (seed % 5);
    if (motif === 0) {
      if (Math.hypot(x - cx, y - cy) < 82) color = palette.dark;
      if (Math.hypot(x - cx, y - cy) < 56) color = mix(palette.accent, [255, 237, 130, 255], 0.22);
    } else if (motif === 1) {
      if (distanceToSegment(x, y, width * 0.2, height * 0.72, width * 0.78, height * 0.25) < 18) color = palette.dark;
      if (distanceToSegment(x, y, width * 0.23, height * 0.7, width * 0.81, height * 0.23) < 8) color = palette.accent;
    } else if (motif === 2) {
      for (let i = 0; i < 6; i += 1) {
        const px = width * (0.25 + i * 0.1);
        const py = height * (0.66 - i * 0.06);
        if (insideRoundedRect(x, y, px, py, 96, 22, 6)) color = i % 2 ? palette.accent : palette.dark;
      }
    } else if (motif === 3) {
      for (let i = 0; i < 8; i += 1) {
        const angle = i * Math.PI / 4;
        const px = cx + Math.cos(angle) * 68;
        const py = cy + Math.sin(angle) * 46;
        if (insideEllipse(x, y, px, py, 34, 23)) color = i % 2 ? palette.accent : palette.dark;
      }
      if (insideEllipse(x, y, cx, cy, 34, 30)) color = [255, 223, 108, 255];
    } else {
      if (Math.abs(x - cx) + Math.abs(y - cy) < 100) color = palette.dark;
      if (Math.abs(x - cx) + Math.abs(y - cy) < 67) color = palette.accent;
      if (Math.abs(x - cx) < 5 || Math.abs(y - cy) < 5) color = [255, 241, 148, 255];
    }
    return color;
  };
}

function paintUiAsset(asset, palette, seed) {
  const isPrimaryButton = asset.key === "ui_button_primary_9slice";
  const isSecondaryButton = asset.key === "ui_button_secondary_9slice";
  const isRewardSlot = asset.key === "ui_slot_reward_9slice";
  const isChoiceSlot = asset.key === "ui_slot_choice_9slice";
  const isTooltip = asset.key === "ui_tooltip_paper_9slice";

  return (x, y, width, height) => {
    if (!insideRoundedRect(x, y, 5, 5, width - 10, height - 10, isTooltip ? 18 : 20)) return [0, 0, 0, 0];

    const paper = isPrimaryButton ? [54, 70, 98, 255] : [255, 244, 218, 255];
    const accent = isRewardSlot ? [86, 151, 130, 255] : isTooltip ? [96, 132, 161, 255] : [198, 160, 82, 255];
    const dark = isPrimaryButton ? [30, 42, 62, 255] : [76, 62, 58, 255];
    let color = addGrain(paper, x, y, seed, 6);

    if (!insideRoundedRect(x, y, 10, 10, width - 20, height - 20, 15)) {
      color = dark;
    } else if (!insideRoundedRect(x, y, 18, 18, width - 36, height - 36, 11)) {
      color = isPrimaryButton ? accent : mix(accent, dark, 0.16);
    }

    if (isPrimaryButton || isSecondaryButton) {
      if (insideRoundedRect(x, y, 25, 18, width - 50, Math.max(8, height * 0.18), 7)) {
        color = mix(color, [255, 255, 235, 255], isPrimaryButton ? 0.16 : 0.24);
      }
      if (distanceToSegment(x, y, 24, height - 17, width - 24, height - 17) < 2) color = mix(color, accent, 0.62);
    }

    if (isRewardSlot || isChoiceSlot) {
      const medallionX = isRewardSlot ? 54 : 38;
      if (insideEllipse(x, y, medallionX, height / 2, isRewardSlot ? 28 : 18, isRewardSlot ? 28 : 18)) color = dark;
      if (insideEllipse(x, y, medallionX, height / 2, isRewardSlot ? 20 : 11, isRewardSlot ? 20 : 11)) color = accent;
      if (distanceToSegment(x, y, isRewardSlot ? 92 : 66, 30, width - 38, 30) < 2
        || distanceToSegment(x, y, isRewardSlot ? 92 : 66, height - 30, width - 38, height - 30) < 2) {
        color = mix(color, [255, 255, 235, 255], 0.32);
      }
      if (isChoiceSlot && x > width - 56 && y < 48 && x + y > width - 44) {
        color = mix(accent, [255, 241, 180, 255], 0.28);
      }
    }

    if (isTooltip) {
      if (distanceToSegment(x, y, 34, 32, width - 34, 32) < 2) color = mix(color, [255, 255, 235, 255], 0.34);
      if (Math.abs(x - 31) + Math.abs(y - height / 2) < 12) color = accent;
    }

    if (asset.key === "ui_panel_paper_9slice") {
      if (distanceToSegment(x, y, 48, 48, width - 48, 48) < 2
        || distanceToSegment(x, y, 48, height - 48, width - 48, height - 48) < 2
        || distanceToSegment(x, y, 48, 48, 48, height - 48) < 2
        || distanceToSegment(x, y, width - 48, 48, width - 48, height - 48) < 2) {
        color = mix(color, dark, 0.18);
      }
    }

    return color;
  };
}

function paintIcon(asset, palette, seed) {
  return (x, y, width, height) => {
    const scale = Math.min(width, height) / 128;
    const nx = (x - width / 2) / scale + 64;
    const ny = (y - height / 2) / scale + 64;
    const distance = Math.hypot(nx - 64, ny - 64);
    if (!asset.key.includes("frame") && !asset.key.includes("panel") && distance > 59) return [0, 0, 0, 0];
    let color = distance > 53 ? palette.dark : addGrain(mix(palette.paper, palette.accent, 0.1), x, y, seed, 6);
    const sides = 3 + (seed % 5);
    for (let i = 0; i < sides; i += 1) {
      const angle = (Math.PI * 2 * i) / sides + (seed % 100) / 100;
      if (distanceToSegment(nx, ny, 64, 64, 64 + Math.cos(angle) * 40, 64 + Math.sin(angle) * 40) < 6) color = palette.dark;
    }
    if (insideEllipse(nx, ny, 64, 64, 23 + (seed % 11), 18 + ((seed >>> 4) % 9))) color = palette.accent;
    if (Math.abs(nx - 64) + Math.abs(ny - 64) < 20) color = [255, 235, 130, 255];
    if (asset.production.domain === "ui") {
      color = addGrain([255, 244, 218, 255], x, y, seed, 6);
      if (x < 18 || y < 18 || x > width - 19 || y > height - 19) color = [78, 62, 58, 255];
      if (x < 8 || y < 8 || x > width - 9 || y > height - 9) color = [198, 160, 82, 255];
    }
    return color;
  };
}

function paintSprite(asset, palette, seed) {
  return (x, y, width, height) => {
    const frameWidth = asset.frameSize.w;
    const frameHeight = asset.frameSize.h;
    const columns = Math.max(1, Math.floor(width / frameWidth));
    const frameIndex = Math.floor(y / frameHeight) * columns + Math.floor(x / frameWidth);
    const fx = x % frameWidth;
    const fy = y % frameHeight;
    const cx = frameWidth / 2 + Math.sin(frameIndex * 0.7 + seed) * 4;
    const cy = frameHeight * 0.58 + Math.cos(frameIndex * 0.5 + seed) * 4;
    if (insideEllipse(fx, fy, frameWidth / 2, frameHeight * 0.88, frameWidth * 0.3, frameHeight * 0.06)) {
      return [40, 36, 48, 80];
    }
    let color = [0, 0, 0, 0];
    const bodyWidth = frameWidth * (asset.production.domain === "boss_sprite" ? 0.31 : 0.25);
    const bodyHeight = frameHeight * (asset.production.domain === "boss_sprite" ? 0.32 : 0.27);
    const body = insideEllipse(fx, fy, cx, cy, bodyWidth, bodyHeight);
    const head = insideEllipse(fx, fy, cx, cy - frameHeight * 0.22, bodyWidth * 0.75, bodyHeight * 0.75);
    const crest = Math.abs(fx - cx) + Math.abs(fy - (cy - frameHeight * 0.42)) < frameWidth * 0.16;
    if (body || head || crest) color = palette.dark;
    if (body) color = mix(palette.paper, palette.accent, 0.24 + (seed % 19) / 100);
    if (head) color = mix(palette.paper, palette.dark, 0.08);
    if (crest) color = palette.accent;
    if (insideEllipse(fx, fy, cx - frameWidth * 0.08, cy - frameHeight * 0.24, 4, 3)
      || insideEllipse(fx, fy, cx + frameWidth * 0.08, cy - frameHeight * 0.24, 4, 3)) {
      color = [255, 228, 112, 255];
    }
    if (distanceToSegment(fx, fy, cx - frameWidth * 0.18, cy + frameHeight * 0.05, cx - frameWidth * 0.36, cy + frameHeight * 0.25) < 4
      || distanceToSegment(fx, fy, cx + frameWidth * 0.18, cy + frameHeight * 0.05, cx + frameWidth * 0.36, cy + frameHeight * 0.25) < 4) {
      color = palette.dark;
    }
    if (asset.production.domain === "effect") {
      const progress = frameIndex / 15;
      const radius = frameWidth * (0.18 + progress * 0.32);
      color = [0, 0, 0, 0];
      if (Math.hypot(fx - frameWidth / 2, fy - frameHeight / 2) < radius) {
        color = [...palette.accent.slice(0, 3), Math.round(230 - progress * 90)];
      }
      if (Math.abs(fx - frameWidth / 2) + Math.abs(fy - frameHeight / 2) < radius * 0.65) {
        color = [255, 241, 158, Math.round(230 - progress * 70)];
      }
    }
    return color;
  };
}

function paletteFor(asset) {
  const h = hash(asset.key);
  const base = [238 + (h % 14), 226 + ((h >>> 4) % 18), 198 + ((h >>> 8) % 24), 255];
  const accent = [70 + ((h >>> 2) % 145), 80 + ((h >>> 9) % 120), 95 + ((h >>> 16) % 115), 255];
  const dark = [46 + ((h >>> 7) % 42), 42 + ((h >>> 13) % 44), 58 + ((h >>> 19) % 44), 255];
  return { paper: base, accent, dark };
}

function hash(value) {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function mix(a, b, t) {
  return [
    Math.round(a[0] * (1 - t) + b[0] * t),
    Math.round(a[1] * (1 - t) + b[1] * t),
    Math.round(a[2] * (1 - t) + b[2] * t),
    Math.round((a[3] ?? 255) * (1 - t) + (b[3] ?? 255) * t)
  ];
}

function addGrain(color, x, y, seed, strength) {
  const grain = ((x * 17 + y * 11 + seed) % 37) < 7 ? -strength : strength / 2;
  return [color[0] + grain, color[1] + grain, color[2] + grain, color[3] ?? 255];
}

function clamp(value) {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function insideRoundedRect(x, y, rectX, rectY, width, height, radius) {
  const cornerX = x < rectX + radius ? rectX + radius : x > rectX + width - radius ? rectX + width - radius : x;
  const cornerY = y < rectY + radius ? rectY + radius : y > rectY + height - radius ? rectY + height - radius : y;
  return x >= rectX && y >= rectY && x < rectX + width && y < rectY + height
    && Math.hypot(x - cornerX, y - cornerY) <= radius;
}

function insideEllipse(x, y, centerX, centerY, radiusX, radiusY) {
  const dx = (x - centerX) / radiusX;
  const dy = (y - centerY) / radiusY;
  return dx * dx + dy * dy <= 1;
}

function distanceToSegment(px, py, ax, ay, bx, by) {
  const dx = bx - ax;
  const dy = by - ay;
  const lengthSquared = dx * dx + dy * dy || 1;
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lengthSquared));
  const x = ax + t * dx;
  const y = ay + t * dy;
  return Math.hypot(px - x, py - y);
}
