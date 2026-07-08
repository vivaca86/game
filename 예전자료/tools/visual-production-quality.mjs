import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const defaultRootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const allowedManifestStatuses = new Set(["production_candidate_manifest", "approved_manifest"]);
const allowedAssetStatuses = new Set(["candidate", "approved"]);

export async function visualProductionFindings(rootDir = defaultRootDir) {
  const summary = await visualProductionSummary(rootDir);
  return summary.findings;
}

export async function visualProductionSummary(rootDir = defaultRootDir) {
  const dataDir = path.join(rootDir, "src", "data", "ko");
  const publicRoot = path.join(rootDir, "public");
  const docsManifestPath = path.join(rootDir, "docs", "asset-manifest.release.v1.json");
  const runtimeManifestPath = path.join(rootDir, "src", "data", "assetManifest.release.v1.json");
  const errors = [];

  const [cards, gems, relics, arcanas, characters, enemies, stages, events] = await Promise.all([
    readJson(path.join(dataDir, "cards.json"), errors),
    readJson(path.join(dataDir, "gems.json"), errors),
    readJson(path.join(dataDir, "relics.json"), errors),
    readJson(path.join(dataDir, "arcanas.json"), errors),
    readJson(path.join(dataDir, "characters.json"), errors),
    readJson(path.join(dataDir, "enemies.json"), errors),
    readJson(path.join(dataDir, "stages.json"), errors),
    readJson(path.join(dataDir, "events.json"), errors)
  ]);

  const counts = {
    cards: cards?.length ?? 0,
    gems: gems?.length ?? 0,
    relics: relics?.length ?? 0,
    arcanas: arcanas?.length ?? 0,
    characters: characters?.length ?? 0,
    enemies: enemies?.length ?? 0,
    nonBossEnemies: Array.isArray(enemies) ? enemies.filter((item) => item.rank !== "boss").length : 0,
    bosses: Array.isArray(enemies) ? enemies.filter((item) => item.rank === "boss").length : 0,
    stages: stages?.length ?? 0,
    events: events?.length ?? 0,
    shared: sharedExpectations().length,
    expectedAssets: 0,
    manifestAssets: 0,
    existingFiles: 0,
    missingFiles: 0
  };

  if ([cards, gems, relics, arcanas, characters, enemies, stages, events].some((rows) => !Array.isArray(rows))) {
    return makeSummary(errors, counts);
  }

  const expectedAssets = buildExpectedAssets({ cards, gems, relics, arcanas, characters, enemies, stages, events });
  counts.expectedAssets = expectedAssets.length;

  const [docsManifest, runtimeManifest] = await Promise.all([
    readJson(docsManifestPath, errors),
    readJson(runtimeManifestPath, errors)
  ]);

  if (!docsManifest || !runtimeManifest) {
    return makeSummary(errors, counts);
  }

  if (stableStringify(docsManifest) !== stableStringify(runtimeManifest)) {
    errors.push("docs/asset-manifest.release.v1.json and src/data/assetManifest.release.v1.json differ");
  }

  const status = docsManifest.metadata?.status;
  if (!allowedManifestStatuses.has(status)) {
    errors.push(`release manifest metadata.status must be production_candidate_manifest or approved_manifest, got ${status ?? "missing"}`);
  }
  if (runtimeManifest.metadata?.status !== status) {
    errors.push("runtime release manifest status differs from docs release manifest status");
  }

  const assets = Array.isArray(docsManifest.assets) ? docsManifest.assets : [];
  if (!Array.isArray(docsManifest.assets)) errors.push("release manifest assets must be an array");
  counts.manifestAssets = assets.length;

  const expectedByKey = new Map(expectedAssets.map((asset) => [asset.key, asset]));
  const manifestByKey = new Map();
  const manifestPaths = new Set();

  assets.forEach((asset, index) => {
    const key = asset?.key;
    const label = key ? `release manifest/${key}` : `release manifest.assets[${index}]`;
    if (!key) {
      errors.push(`${label}: missing key`);
      return;
    }
    if (manifestByKey.has(key)) errors.push(`release manifest: duplicate key ${key}`);
    manifestByKey.set(key, asset);
    if (!expectedByKey.has(key)) errors.push(`${label}: unexpected release visual key`);
    validateManifestAsset(asset, expectedByKey.get(key), label, manifestPaths, errors);
  });

  for (const expected of expectedAssets) {
    if (!manifestByKey.has(expected.key)) errors.push(`release manifest missing expected key: ${expected.key}`);
  }

  for (const [key, asset] of manifestByKey.entries()) {
    if (!asset?.path) continue;
    const filePath = path.join(publicRoot, asset.path);
    const exists = await fileExists(filePath);
    if (!exists) {
      counts.missingFiles += 1;
      errors.push(`${key}: missing runtime png ${asset.path}`);
      continue;
    }

    counts.existingFiles += 1;
    try {
      const size = await readPngSize(filePath);
      if (size.w !== asset.nativeSize?.w || size.h !== asset.nativeSize?.h) {
        errors.push(`${key}: png size ${size.w}x${size.h} does not match nativeSize ${asset.nativeSize?.w}x${asset.nativeSize?.h}`);
      }
    } catch (error) {
      errors.push(`${key}: png read failed for ${asset.path}: ${error.message}`);
    }
  }

  return makeSummary(errors, counts);
}

function makeSummary(errors, counts) {
  return {
    counts,
    findings: errors.length === 0 ? [] : [{
      area: "visuals",
      message: "Release visual production candidate coverage is incomplete.",
      evidence: errors
    }]
  };
}

function buildExpectedAssets({ cards, gems, relics, arcanas, characters, enemies, stages, events }) {
  return [
    ...sharedExpectations(),
    ...cards.map((item) => expectedImage(releaseAssetKey("card_art", item.id, "card"), "card", item.id, 520, 360)),
    ...gems.map((item) => expectedImage(releaseAssetKey("gem_icon", item.id, "gem"), "gem", item.id, 128, 128)),
    ...relics.map((item) => expectedImage(releaseAssetKey("relic_icon", item.id, "relic"), "relic", item.id, 128, 128)),
    ...arcanas.map((item) => expectedImage(releaseAssetKey("arcana_icon", item.id, "arcana"), "arcana", item.id, 128, 128)),
    ...characters.flatMap((item) => [
      expectedImage(releaseAssetKey("char_portrait", item.id, "char"), "character_portrait", item.id, 256, 256),
      expectedSprite(releaseAssetKey("char_sprite", item.id, "char"), "character_sprite", item.id, 384, 384, 96, 96)
    ]),
    ...stages.flatMap((item) => [
      expectedImage(releaseAssetKey("stage_bg", item.id, "stage"), "stage_background", item.id, 960, 540),
      expectedImage(releaseAssetKey("stage_map_icon", item.id, "stage"), "stage_map_icon", item.id, 128, 128)
    ]),
    ...enemies
      .filter((item) => item.rank !== "boss")
      .map((item) => expectedSprite(releaseAssetKey("enemy_sprite", item.id, "enemy"), "enemy_sprite", item.id, 384, 384, 96, 96)),
    ...enemies
      .filter((item) => item.rank === "boss")
      .map((item) => expectedSprite(releaseAssetKey("boss_sprite", item.id, "boss"), "boss_sprite", item.id, 512, 512, 128, 128)),
    ...events.map((item) => expectedImage(releaseAssetKey("event_scene", item.id, "event"), "event_scene", item.id, 960, 540))
  ];
}

function sharedExpectations() {
  return [
    expectedImage("card_frame_attack", "card_frame", "attack", 300, 440),
    expectedImage("card_frame_defense", "card_frame", "defense", 300, 440),
    expectedImage("card_frame_skill", "card_frame", "skill", 300, 440),
    expectedImage("icon_card_attack", "card_type_icon", "attack", 96, 96),
    expectedImage("icon_card_defense", "card_type_icon", "defense", 96, 96),
    expectedImage("icon_card_skill", "card_type_icon", "skill", 96, 96),
    expectedImage("icon_intent_attack", "intent_icon", "attack", 96, 96),
    expectedImage("icon_intent_disrupt", "intent_icon", "disrupt", 96, 96),
    expectedImage("icon_intent_block", "intent_icon", "block", 96, 96),
    expectedImage("ui_button_primary_9slice", "ui", "button_primary", 256, 96),
    expectedImage("ui_button_secondary_9slice", "ui", "button_secondary", 256, 96),
    expectedImage("ui_slot_reward_9slice", "ui", "slot_reward", 512, 128),
    expectedImage("ui_slot_choice_9slice", "ui", "slot_choice", 512, 128),
    expectedImage("ui_tooltip_paper_9slice", "ui", "tooltip_paper", 384, 128),
    expectedImage("ui_panel_paper_9slice", "ui", "panel", 256, 256),
    expectedSprite("effect_stage_spotlight", "effect", "stage_spotlight", 512, 512, 128, 128),
    expectedSprite("effect_paper_slash", "effect", "paper_slash", 512, 512, 128, 128),
    expectedSprite("effect_ink_splash", "effect", "ink_splash", 512, 512, 128, 128)
  ];
}

function expectedImage(key, domain, sourceContentId, width, height) {
  return {
    key,
    type: "image",
    domain,
    sourceContentId,
    nativeSize: { w: width, h: height }
  };
}

function expectedSprite(key, domain, sourceContentId, width, height, frameWidth, frameHeight) {
  return {
    key,
    type: "spritesheet",
    domain,
    sourceContentId,
    nativeSize: { w: width, h: height },
    frameSize: { w: frameWidth, h: frameHeight }
  };
}

function validateManifestAsset(asset, expected, label, manifestPaths, errors) {
  if (!/^[a-z][a-z0-9_]*$/.test(asset?.key ?? "")) errors.push(`${label}: key must be lower snake_case`);
  if (!["image", "spritesheet"].includes(asset?.type)) errors.push(`${label}: unsupported type ${asset?.type}`);
  if (asset?.styleKey !== "premium_popup_book") errors.push(`${label}: styleKey must be premium_popup_book`);
  if (!asset?.path || typeof asset.path !== "string") {
    errors.push(`${label}: missing path`);
  } else {
    if (!asset.path.startsWith("assets/runtime/release/")) errors.push(`${label}: path must stay under assets/runtime/release/`);
    if (asset.path.includes("\\") || asset.path.includes("..")) errors.push(`${label}: path must use forward slash relative paths without parent traversal`);
    if (!asset.path.endsWith(".png")) errors.push(`${label}: path must be a png runtime asset`);
    if (manifestPaths.has(asset.path)) errors.push(`release manifest: duplicate path ${asset.path}`);
    manifestPaths.add(asset.path);
  }

  if (!expected) return;
  if (asset.type !== expected.type) errors.push(`${label}: type ${asset.type} does not match expected ${expected.type}`);
  compareSize(asset.nativeSize, expected.nativeSize, `${label}.nativeSize`, errors);
  if (expected.type === "spritesheet") {
    compareSize(asset.frameSize, expected.frameSize, `${label}.frameSize`, errors);
    if (asset.nativeSize?.w % asset.frameSize?.w !== 0 || asset.nativeSize?.h % asset.frameSize?.h !== 0) {
      errors.push(`${label}: nativeSize must divide evenly by frameSize`);
    }
  }

  const production = asset.production;
  if (!production || typeof production !== "object") {
    errors.push(`${label}: missing production metadata`);
    return;
  }
  if (!allowedAssetStatuses.has(production.status)) errors.push(`${label}: production.status must be candidate or approved`);
  if (production.batch !== "release_visual_coverage_1") errors.push(`${label}: production.batch must be release_visual_coverage_1`);
  if (production.source !== "local_deterministic_generator") errors.push(`${label}: production.source must be local_deterministic_generator`);
  if (production.domain !== expected.domain) errors.push(`${label}: production.domain ${production.domain} does not match expected ${expected.domain}`);
  if (production.sourceContentId !== expected.sourceContentId) {
    errors.push(`${label}: production.sourceContentId ${production.sourceContentId} does not match expected ${expected.sourceContentId}`);
  }
  if (typeof production.finalApproved !== "boolean") errors.push(`${label}: production.finalApproved must be boolean`);
}

function compareSize(actual, expected, label, errors) {
  if (!actual || !Number.isInteger(actual.w) || !Number.isInteger(actual.h)) {
    errors.push(`${label}: missing positive integer w/h`);
    return;
  }
  if (actual.w !== expected.w || actual.h !== expected.h) {
    errors.push(`${label}: ${actual.w}x${actual.h} does not match expected ${expected.w}x${expected.h}`);
  }
}

async function readJson(filePath, errors) {
  try {
    return JSON.parse(await readFile(filePath, "utf8"));
  } catch (error) {
    errors.push(`${path.basename(filePath)}: JSON read/parse failed: ${error.message}`);
    return null;
  }
}

async function fileExists(filePath) {
  try {
    const info = await stat(filePath);
    return info.isFile();
  } catch {
    return false;
  }
}

async function readPngSize(filePath) {
  const buffer = await readFile(filePath);
  const pngSignature = "89504e470d0a1a0a";
  if (buffer.length < 24 || buffer.subarray(0, 8).toString("hex") !== pngSignature) {
    throw new Error("not a png file");
  }
  return {
    w: buffer.readUInt32BE(16),
    h: buffer.readUInt32BE(20)
  };
}

function releaseAssetKey(prefix, id, sourcePrefix) {
  const trimmed = id.startsWith(`${sourcePrefix}_`) ? id.slice(sourcePrefix.length + 1) : id;
  return `${prefix}_${trimmed}`.replace(/[^a-z0-9_]/g, "_").replace(/_+/g, "_");
}

function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}
