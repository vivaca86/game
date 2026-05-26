import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const fixturePath = path.join(rootDir, "docs", "vertical-slice-data.fixture.v1.json");
const manifestPath = path.join(rootDir, "docs", "asset-manifest.slice.v1.json");
const roleMapPath = path.join(rootDir, "docs", "reference-role-map-slice-v1.md");

const idPattern = /^[a-z][a-z0-9_]*$/;
const errors = [];
const warnings = [];

function fail(message) {
  errors.push(message);
}

function warn(message) {
  warnings.push(message);
}

async function readJson(filePath) {
  try {
    return JSON.parse(await readFile(filePath, "utf8"));
  } catch (error) {
    fail(`${path.relative(rootDir, filePath)}: JSON parse failed: ${error.message}`);
    return null;
  }
}

function asArray(value, label) {
  if (!Array.isArray(value)) {
    fail(`${label}: expected array`);
    return [];
  }
  return value;
}

function uniqueIds(rows, label) {
  const ids = new Set();
  rows.forEach((row, index) => {
    if (!row?.id) {
      fail(`${label}[${index}]: missing id`);
      return;
    }
    if (!idPattern.test(row.id)) fail(`${label}/${row.id}: id must be lower snake_case`);
    if (ids.has(row.id)) fail(`${label}: duplicate id "${row.id}"`);
    ids.add(row.id);
  });
  return ids;
}

function uniqueKeys(rows, label) {
  const keys = new Set();
  rows.forEach((row, index) => {
    if (!row?.key) {
      fail(`${label}[${index}]: missing key`);
      return;
    }
    if (!idPattern.test(row.key)) fail(`${label}/${row.key}: key must be lower snake_case`);
    if (keys.has(row.key)) fail(`${label}: duplicate key "${row.key}"`);
    keys.add(row.key);
  });
  return keys;
}

function requireCommon(rows, label, roleMapText) {
  rows.forEach((row, index) => {
    const rowLabel = row?.id ? `${label}/${row.id}` : `${label}[${index}]`;
    ["id", "displayNameKo", "descriptionKo", "referenceRole"].forEach((key) => {
      if (!row?.[key]) fail(`${rowLabel}: missing ${key}`);
    });
    if (!Array.isArray(row?.tags) || row.tags.length === 0) fail(`${rowLabel}: tags must be non-empty array`);
    if (!row?.evidence?.level) fail(`${rowLabel}: missing evidence.level`);
    if (!Array.isArray(row?.evidence?.sources) || row.evidence.sources.length === 0) {
      fail(`${rowLabel}: evidence.sources must be non-empty array`);
    }
    if (row?.referenceRole && !roleMapText.includes(row.referenceRole)) {
      fail(`${rowLabel}: referenceRole not found in docs/reference-role-map-slice-v1.md: ${row.referenceRole}`);
    }
  });
}

function requireNonEmptyEffects(rows, label) {
  rows.forEach((row) => {
    if (!Array.isArray(row.effects) || row.effects.length === 0) fail(`${label}/${row.id}: effects must be non-empty`);
  });
}

function checkAsset(assetKeys, key, label) {
  if (!key) {
    fail(`${label}: empty asset key`);
    return;
  }
  if (!assetKeys.has(key)) fail(`${label}: asset key missing from manifest: ${key}`);
}

function checkRewardRefs(data, ids) {
  const rewardPools = asArray(data.rewardPools, "rewardPools");
  rewardPools.forEach((pool) => {
    if (!Array.isArray(pool.entries) || pool.entries.length === 0) fail(`rewardPools/${pool.id}: entries must be non-empty`);
    if (!Array.isArray(pool.rules) || pool.rules.length === 0) fail(`rewardPools/${pool.id}: rules must be non-empty`);
    asArray(pool.entries || [], `rewardPools/${pool.id}.entries`).forEach((entry) => {
      if (["heal", "currency"].includes(entry.type)) {
        if (typeof entry.amount !== "number") fail(`reward/${entry.id}: ${entry.type} reward needs numeric amount`);
        return;
      }
      if (!entry.contentId) {
        fail(`reward/${entry.id}: missing contentId`);
        return;
      }
      const targetSet = ids[entry.type];
      if (!targetSet) {
        fail(`reward/${entry.id}: unsupported reward type "${entry.type}"`);
        return;
      }
      if (!targetSet.has(entry.contentId)) {
        fail(`reward/${entry.id}: missing ${entry.type} contentId "${entry.contentId}"`);
      }
    });
  });
}

function checkStageRoutes(data, ids) {
  const rewardPoolIds = ids.rewardPool;
  asArray(data.stages, "stages").forEach((stage) => {
    if (!ids.boss.has(stage.bossId)) fail(`stages/${stage.id}: missing bossId "${stage.bossId}"`);
    asArray(stage.rewardPools || [], `stages/${stage.id}.rewardPools`).forEach((rewardPoolId) => {
      if (!rewardPoolIds.has(rewardPoolId)) fail(`stages/${stage.id}: missing rewardPool "${rewardPoolId}"`);
    });
    asArray(stage.route || [], `stages/${stage.id}.route`).forEach((room) => {
      if (room.rewardPoolId && !rewardPoolIds.has(room.rewardPoolId)) {
        fail(`room/${room.id}: missing rewardPool "${room.rewardPoolId}"`);
      }
      if (room.type === "combat" && !ids.enemy.has(room.encounterPoolId)) {
        fail(`room/${room.id}: combat encounter must reference enemies[].id, got "${room.encounterPoolId}"`);
      }
      if (room.type === "event" && !ids.event.has(room.encounterPoolId)) {
        fail(`room/${room.id}: event encounter must reference events[].id, got "${room.encounterPoolId}"`);
      }
      if (room.type === "boss" && !ids.boss.has(room.encounterPoolId)) {
        fail(`room/${room.id}: boss encounter must reference bosses[].id, got "${room.encounterPoolId}"`);
      }
    });
  });
}

function checkUnlockRefs(data, ids) {
  asArray(data.unlocks, "unlocks").forEach((unlock) => {
    asArray(unlock.grants || [], `unlocks/${unlock.id}.grants`).forEach((grant) => {
      if (grant.type === "stage_clear") {
        if (!ids.stage.has(grant.contentId)) fail(`unlocks/${unlock.id}: missing stage_clear target "${grant.contentId}"`);
        return;
      }
      const targetSet = ids[grant.type];
      if (!targetSet) {
        fail(`unlocks/${unlock.id}: unsupported grant type "${grant.type}"`);
        return;
      }
      if (!targetSet.has(grant.contentId)) fail(`unlocks/${unlock.id}: missing ${grant.type} grant "${grant.contentId}"`);
    });
  });
}

const fixture = await readJson(fixturePath);
const manifest = await readJson(manifestPath);
const roleMapText = await readFile(roleMapPath, "utf8").catch((error) => {
  fail(`docs/reference-role-map-slice-v1.md: read failed: ${error.message}`);
  return "";
});

if (fixture && manifest) {
  if (fixture.metadata?.status !== "draft_fixture") warn("fixture metadata.status is not draft_fixture");
  if (manifest.metadata?.status !== "planned_manifest") warn("manifest metadata.status is not planned_manifest");

  const data = fixture.data || {};
  const assets = asArray(manifest.assets, "manifest.assets");
  const assetKeys = uniqueKeys(assets, "manifest.assets");

  assets.forEach((asset) => {
    if (!asset.path?.startsWith("assets/runtime/")) fail(`manifest/${asset.key}: path must be under assets/runtime/`);
    if (asset.styleKey !== "premium_popup_book") fail(`manifest/${asset.key}: styleKey must be premium_popup_book`);
  });

  const domains = {
    cards: asArray(data.cards, "cards"),
    runes: asArray(data.runes, "runes"),
    relics: asArray(data.relics, "relics"),
    arcanas: asArray(data.arcanas, "arcanas"),
    characters: asArray(data.characters, "characters"),
    stages: asArray(data.stages, "stages"),
    enemies: asArray(data.enemies, "enemies"),
    bosses: asArray(data.bosses, "bosses"),
    events: asArray(data.events, "events"),
    rewardPools: asArray(data.rewardPools, "rewardPools"),
    unlocks: asArray(data.unlocks, "unlocks"),
    evolutions: asArray(data.evolutions, "evolutions"),
    powerUps: asArray(data.powerUps, "powerUps")
  };

  ["cards", "runes", "relics", "characters", "stages", "enemies", "bosses", "events", "unlocks"].forEach((domain) => {
    requireCommon(domains[domain], domain, roleMapText);
  });

  requireNonEmptyEffects(domains.cards, "cards");
  requireNonEmptyEffects(domains.runes, "runes");
  requireNonEmptyEffects(domains.relics, "relics");

  domains.cards.forEach((card) => {
    checkAsset(assetKeys, card.assetKeys?.frame, `cards/${card.id}.assetKeys.frame`);
    checkAsset(assetKeys, card.assetKeys?.illustration, `cards/${card.id}.assetKeys.illustration`);
    checkAsset(assetKeys, card.assetKeys?.typeIcon, `cards/${card.id}.assetKeys.typeIcon`);
  });
  domains.runes.forEach((rune) => checkAsset(assetKeys, rune.assetKeys?.icon, `runes/${rune.id}.assetKeys.icon`));
  domains.relics.forEach((relic) => checkAsset(assetKeys, relic.assetKeys?.icon, `relics/${relic.id}.assetKeys.icon`));
  domains.characters.forEach((character) => {
    checkAsset(assetKeys, character.assetKeys?.portrait, `characters/${character.id}.assetKeys.portrait`);
    if (character.assetKeys?.sprite) checkAsset(assetKeys, character.assetKeys.sprite, `characters/${character.id}.assetKeys.sprite`);
  });
  domains.stages.forEach((stage) => {
    checkAsset(assetKeys, stage.assetKeys?.backgroundSet, `stages/${stage.id}.assetKeys.backgroundSet`);
    checkAsset(assetKeys, stage.assetKeys?.mapIcon, `stages/${stage.id}.assetKeys.mapIcon`);
  });
  domains.enemies.forEach((enemy) => {
    checkAsset(assetKeys, enemy.assetKeys?.sprite, `enemies/${enemy.id}.assetKeys.sprite`);
    asArray(enemy.assetKeys?.intentIcons || [], `enemies/${enemy.id}.assetKeys.intentIcons`).forEach((key) => {
      checkAsset(assetKeys, key, `enemies/${enemy.id}.assetKeys.intentIcons`);
    });
  });
  domains.bosses.forEach((boss) => {
    checkAsset(assetKeys, boss.assetKeys?.sprite, `bosses/${boss.id}.assetKeys.sprite`);
    asArray(boss.assetKeys?.intentIcons || [], `bosses/${boss.id}.assetKeys.intentIcons`).forEach((key) => {
      checkAsset(assetKeys, key, `bosses/${boss.id}.assetKeys.intentIcons`);
    });
    asArray(boss.phases || [], `bosses/${boss.id}.phases`).forEach((phase) => {
      checkAsset(assetKeys, phase.visualCueKey, `bosses/${boss.id}.phases/${phase.id}.visualCueKey`);
    });
  });
  domains.events.forEach((event) => checkAsset(assetKeys, event.assetKeys?.scene, `events/${event.id}.assetKeys.scene`));

  const ids = {
    card: uniqueIds(domains.cards, "cards"),
    rune: uniqueIds(domains.runes, "runes"),
    relic: uniqueIds(domains.relics, "relics"),
    arcana: uniqueIds(domains.arcanas, "arcanas"),
    character: uniqueIds(domains.characters, "characters"),
    stage: uniqueIds(domains.stages, "stages"),
    enemy: uniqueIds(domains.enemies, "enemies"),
    boss: uniqueIds(domains.bosses, "bosses"),
    event: uniqueIds(domains.events, "events"),
    unlock: uniqueIds(domains.unlocks, "unlocks"),
    power_up: uniqueIds(domains.powerUps, "powerUps"),
    rewardPool: uniqueIds(domains.rewardPools, "rewardPools")
  };

  checkRewardRefs(data, ids);
  checkStageRoutes(data, ids);
  checkUnlockRefs(data, ids);
}

warnings.forEach((message) => console.warn(`Warning: ${message}`));

if (errors.length > 0) {
  errors.forEach((message) => console.error(`Error: ${message}`));
  process.exit(1);
}

console.log("Slice fixture validation OK");
