import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createGameIndex, assertRuntimeData } from "../src/core/data-loader.js";
import { startRun } from "../src/core/progression.js";
import { createRewardOptions } from "../src/core/rewards.js";
import { createDefaultProfile } from "../src/core/profile.js";
import { rewardOptionInsightAudit } from "../src/core/reward-insights.js";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(rootDir, "src", "data", "ko");
const readJson = async (fileName) => JSON.parse(await readFile(path.join(dataDir, fileName), "utf8"));

const data = {
  targets: await readJson("content-targets.json"),
  strings: await readJson("strings.json"),
  cards: await readJson("cards.json"),
  gems: await readJson("gems.json"),
  relics: await readJson("relics.json"),
  arcanas: await readJson("arcanas.json"),
  characters: await readJson("characters.json"),
  enemies: await readJson("enemies.json"),
  stages: await readJson("stages.json"),
  events: await readJson("events.json"),
  metaUpgrades: await readJson("meta-upgrades.json"),
  achievements: await readJson("achievements.json")
};

const index = createGameIndex(data);
assertRuntimeData(data, index);

const profile = createDefaultProfile(index);
profile.unlockedCards = data.cards.map((card) => card.id);
profile.unlockedGems = data.gems.map((gem) => gem.id);
profile.unlockedRelics = data.relics.map((relic) => relic.id);
profile.unlockedArcanas = data.arcanas.map((arcana) => arcana.id);
profile.unlockedCharacters = data.characters.map((character) => character.id);
profile.unlockedStages = data.stages.map((stage) => stage.id);

const warnings = [];
const optionTypeCounts = new Map();
const sources = ["combat", "reward", "shop", "elite", "boss"];

for (const [indexNumber, source] of sources.entries()) {
  const state = startRun(index, {
    characterId: "char_haru",
    stageId: "stage_sunny_gate",
    seed: 20260700 + indexNumber,
    profile
  });
  state.player.gold = 999;
  const options = createRewardOptions(state, index, source);
  if (options.length < 3) warnings.push(`${source}: 보상 선택지 부족 ${options.length}`);
  const audit = rewardOptionInsightAudit(state, index, options);
  if (audit.missingInsights.length > 0) warnings.push(`${source}: 추천 신호 누락 ${audit.missingInsights.join(", ")}`);
  if (audit.weakInsights.length > 0) warnings.push(`${source}: 추천 점수 비정상 ${audit.weakInsights.join(", ")}`);
  Object.entries(audit.typeCounts).forEach(([type, count]) => {
    optionTypeCounts.set(type, (optionTypeCounts.get(type) || 0) + count);
  });
}

const coveredTypes = Object.keys(Object.fromEntries(optionTypeCounts));
if (coveredTypes.length < 5) warnings.push(`보상 타입 커버 부족: ${coveredTypes.join(", ")}`);
for (const requiredType of ["card", "gem", "relic", "arcana", "gold"]) {
  if (!optionTypeCounts.has(requiredType)) warnings.push(`보상 타입 감사 누락: ${requiredType}`);
}

if (warnings.length > 0) {
  console.log("보상 성장 감사 실패");
  warnings.forEach((warning) => console.log(`- ${warning}`));
  process.exit(1);
}

console.log("보상 성장 감사 통과");
console.log(`sources=${sources.length}, types=${coveredTypes.length}`);
console.log([...optionTypeCounts.entries()].sort(([left], [right]) => left.localeCompare(right)).map(([type, count]) => `${type}:${count}`).join(", "));
