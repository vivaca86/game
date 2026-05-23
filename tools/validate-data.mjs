import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(rootDir, "src", "data", "ko");
const hangulPattern = /[가-힣]/;
const idPattern = /^[a-z][a-z0-9_]*$/;
const forbiddenVisibleWords = ["뱀파이어", "흡혈", "고딕"];

const requiredFiles = [
  "content-targets.json",
  "strings.json",
  "cards.json",
  "gems.json",
  "relics.json",
  "arcanas.json",
  "characters.json",
  "enemies.json",
  "stages.json",
  "events.json",
  "meta-upgrades.json",
  "achievements.json"
];

const humanTextKeys = new Set([
  "name",
  "title",
  "text",
  "description",
  "label",
  "role",
  "biome",
  "family",
  "mood",
  "subject",
  "passiveText",
  "workingTitle",
  "visibleLanguage",
  "tone",
  "monsterShape",
  "cardFrame",
  "palette"
]);

const errors = [];
const warnings = [];

function fail(message) {
  errors.push(message);
}

function warn(message) {
  warnings.push(message);
}

function asArray(data, fileName) {
  if (!Array.isArray(data)) {
    fail(`${fileName}: 배열이어야 합니다.`);
    return [];
  }
  return data;
}

function uniqueIds(rows, fileName) {
  const seen = new Set();
  rows.forEach((row, index) => {
    if (!row.id) {
      fail(`${fileName}[${index}]: id가 없습니다.`);
      return;
    }
    if (!idPattern.test(row.id)) {
      fail(`${fileName}[${index}]: id "${row.id}"는 영문 소문자, 숫자, 밑줄만 사용해야 합니다.`);
    }
    if (seen.has(row.id)) {
      fail(`${fileName}: 중복 id "${row.id}"가 있습니다.`);
    }
    seen.add(row.id);
  });
  return seen;
}

function inspectHumanText(value, keyPath) {
  if (typeof value === "string") {
    const key = keyPath.at(-1);
    if (humanTextKeys.has(key) && !hangulPattern.test(value)) {
      fail(`${keyPath.join(".")}: 게임 표시 문구는 한글을 포함해야 합니다.`);
    }
    if (humanTextKeys.has(key)) {
      forbiddenVisibleWords.forEach((word) => {
        if (value.includes(word)) {
          fail(`${keyPath.join(".")}: 독자 IP 기준 금지어 "${word}"가 포함되어 있습니다.`);
        }
      });
    }
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => inspectHumanText(item, [...keyPath, String(index)]));
    return;
  }
  if (value && typeof value === "object") {
    Object.entries(value).forEach(([childKey, childValue]) => inspectHumanText(childValue, [...keyPath, childKey]));
  }
}

function assertRefs(ids, refs, label) {
  refs.forEach((ref) => {
    if (ref && !ids.has(ref)) fail(`${label}: 알 수 없는 참조 "${ref}"`);
  });
}

async function loadJson(fileName) {
  const source = await readFile(path.join(dataDir, fileName), "utf8");
  try {
    return JSON.parse(source);
  } catch (error) {
    fail(`${fileName}: JSON 파싱 실패 - ${error.message}`);
    return null;
  }
}

const existingFiles = new Set(await readdir(dataDir));
requiredFiles.forEach((fileName) => {
  if (!existingFiles.has(fileName)) fail(`${fileName}: 필수 데이터 파일이 없습니다.`);
});

const data = Object.fromEntries(
  await Promise.all(requiredFiles.map(async (fileName) => [fileName, await loadJson(fileName)]))
);

Object.entries(data).forEach(([fileName, value]) => {
  if (value) inspectHumanText(value, [fileName]);
});

const cards = asArray(data["cards.json"], "cards.json");
const gems = asArray(data["gems.json"], "gems.json");
const relics = asArray(data["relics.json"], "relics.json");
const arcanas = asArray(data["arcanas.json"], "arcanas.json");
const characters = asArray(data["characters.json"], "characters.json");
const enemies = asArray(data["enemies.json"], "enemies.json");
const stages = asArray(data["stages.json"], "stages.json");
const events = asArray(data["events.json"], "events.json");
const metaUpgrades = asArray(data["meta-upgrades.json"], "meta-upgrades.json");
const achievements = asArray(data["achievements.json"], "achievements.json");

const cardIds = uniqueIds(cards, "cards.json");
const gemIds = uniqueIds(gems, "gems.json");
const relicIds = uniqueIds(relics, "relics.json");
const arcanaIds = uniqueIds(arcanas, "arcanas.json");
const characterIds = uniqueIds(characters, "characters.json");
const enemyIds = uniqueIds(enemies, "enemies.json");
const stageIds = uniqueIds(stages, "stages.json");
const eventIds = uniqueIds(events, "events.json");
const metaIds = uniqueIds(metaUpgrades, "meta-upgrades.json");
const achievementIds = uniqueIds(achievements, "achievements.json");

cards.forEach((card) => {
  if (!["attack", "guard", "skill", "power", "curse", "temp"].includes(card.type)) {
    fail(`cards.json:${card.id}: 알 수 없는 카드 타입 "${card.type}"`);
  }
  if (!Number.isInteger(card.cost) || card.cost < 0) {
    fail(`cards.json:${card.id}: cost는 0 이상의 정수여야 합니다.`);
  }
  if (!card.sockets || card.sockets.base > card.sockets.max) {
    fail(`cards.json:${card.id}: 소켓 base/max 구조가 잘못되었습니다.`);
  }
  if (!Array.isArray(card.effects) || card.effects.length === 0) {
    fail(`cards.json:${card.id}: effects가 필요합니다.`);
  }
});

characters.forEach((character) => {
  assertRefs(cardIds, character.starterDeck || [], `characters.json:${character.id}.starterDeck`);
});

stages.forEach((stage) => {
  assertRefs(enemyIds, stage.enemyPool || [], `stages.json:${stage.id}.enemyPool`);
  assertRefs(enemyIds, stage.elitePool || [], `stages.json:${stage.id}.elitePool`);
  assertRefs(enemyIds, [stage.bossEnemyId], `stages.json:${stage.id}.bossEnemyId`);
});

events.forEach((event) => {
  (event.choices || []).forEach((choice, index) => {
    const reward = choice.reward || {};
    assertRefs(cardIds, reward.cardPool || [], `events.json:${event.id}.choices[${index}].cardPool`);
    assertRefs(gemIds, reward.gemPool || [], `events.json:${event.id}.choices[${index}].gemPool`);
    assertRefs(relicIds, reward.relicPool || [], `events.json:${event.id}.choices[${index}].relicPool`);
    assertRefs(enemyIds, reward.combat ? [reward.combat] : [], `events.json:${event.id}.choices[${index}].combat`);
  });
});

achievements.forEach((achievement) => {
  const trigger = achievement.trigger || {};
  const reward = achievement.reward || {};
  assertRefs(stageIds, trigger.stageId ? [trigger.stageId] : [], `achievements.json:${achievement.id}.trigger.stageId`);
  assertRefs(enemyIds, trigger.enemyId ? [trigger.enemyId] : [], `achievements.json:${achievement.id}.trigger.enemyId`);
  assertRefs(cardIds, reward.unlockCardId ? [reward.unlockCardId] : [], `achievements.json:${achievement.id}.reward.unlockCardId`);
  assertRefs(gemIds, reward.unlockGemId ? [reward.unlockGemId] : [], `achievements.json:${achievement.id}.reward.unlockGemId`);
  assertRefs(arcanaIds, reward.unlockArcanaId ? [reward.unlockArcanaId] : [], `achievements.json:${achievement.id}.reward.unlockArcanaId`);
  assertRefs(characterIds, reward.unlockCharacterId ? [reward.unlockCharacterId] : [], `achievements.json:${achievement.id}.reward.unlockCharacterId`);
  assertRefs(metaIds, reward.metaUpgradeId ? [reward.metaUpgradeId] : [], `achievements.json:${achievement.id}.reward.metaUpgradeId`);
});

const targets = data["content-targets.json"]?.targets || {};
[
  ["cards", cards.length],
  ["gems", gems.length],
  ["relics", relics.length],
  ["arcanas", arcanas.length],
  ["characters", characters.length],
  ["enemies", enemies.length],
  ["stages", stages.length],
  ["events", events.length],
  ["achievements", achievements.length]
].forEach(([key, count]) => {
  if (targets[key] && count < targets[key]) {
    warn(`${key}: 현재 ${count}개 / 목표 ${targets[key]}개`);
  }
});

if (errors.length > 0) {
  console.error("데이터 검증 실패");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("데이터 검증 통과");
console.log(`카드 ${cards.length}, 보석 ${gems.length}, 유물 ${relics.length}, 기운 ${arcanas.length}, 캐릭터 ${characters.length}, 적 ${enemies.length}, 스테이지 ${stages.length}, 이벤트 ${events.length}, 업적 ${achievements.length}`);
if (warnings.length > 0) {
  console.log("확장 예정");
  warnings.forEach((message) => console.log(`- ${message}`));
}
