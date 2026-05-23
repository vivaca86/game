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

const allowedCardEffectOps = new Set([
  "add_battle_rule",
  "apply_mark",
  "damage_all",
  "damage_bonus_if_cards_played_at_least",
  "damage_bonus_if_chain_at_least",
  "damage_bonus_if_hand_at_most",
  "damage_bonus_vs_marked",
  "damage_front",
  "damage_random",
  "discount_next_card",
  "draw",
  "draw_if_kill",
  "enable_reflect_damage",
  "exhaust_self",
  "gain_energy",
  "gain_shield",
  "heal_if_hp_ratio_below",
  "increase_next_card_cost",
  "increase_next_card_reward_options",
  "lose_energy",
  "prepare_socket_bonus",
  "reduce_next_attack",
  "repeat_previous_basic_effect",
  "repeat_previous_basic_effect_if_cost_at_most",
  "reset_chain",
  "retain_shield_next_turn"
]);

const allowedAchievementTriggerOps = new Set([
  "clear_rooms_in_stage",
  "clear_stage",
  "collect_arcanas",
  "collect_cards",
  "collect_gems",
  "collect_relics",
  "complete_event",
  "defeat_enemy",
  "defeat_enemy_count",
  "defeat_rank",
  "reach_chain",
  "unlock_character"
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

function inspectEffects(effects, label, allowedOps = null) {
  if (!Array.isArray(effects) || effects.length === 0) {
    fail(`${label}: effects가 필요합니다.`);
    return;
  }
  effects.forEach((effect, index) => {
    if (!effect || typeof effect !== "object") {
      fail(`${label}[${index}]: 효과는 객체여야 합니다.`);
      return;
    }
    if (!effect.op || typeof effect.op !== "string") {
      fail(`${label}[${index}]: op 문자열이 필요합니다.`);
      return;
    }
    if (allowedOps && !allowedOps.has(effect.op)) {
      fail(`${label}[${index}]: 알 수 없는 카드 효과 op "${effect.op}"`);
    }
  });
}

function assertUnlockRefs(unlock, label, refs) {
  if (!unlock || typeof unlock !== "object") {
    fail(`${label}: unlock 정보가 필요합니다.`);
    return;
  }
  assertRefs(refs.stageIds, unlock.stageId ? [unlock.stageId] : [], `${label}.stageId`);
  assertRefs(refs.eventIds, unlock.eventId ? [unlock.eventId] : [], `${label}.eventId`);
  assertRefs(refs.achievementIds, unlock.achievementId ? [unlock.achievementId] : [], `${label}.achievementId`);
  assertRefs(refs.characterIds, unlock.characterId ? [unlock.characterId] : [], `${label}.characterId`);
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
const refs = { cardIds, gemIds, relicIds, arcanaIds, characterIds, enemyIds, stageIds, eventIds, metaIds, achievementIds };

cards.forEach((card) => {
  if (!["attack", "guard", "skill", "power", "curse", "temp"].includes(card.type)) {
    fail(`cards.json:${card.id}: 알 수 없는 카드 타입 "${card.type}"`);
  }
  if (!card.name || !hangulPattern.test(card.name)) {
    fail(`cards.json:${card.id}: 한글 카드명이 필요합니다.`);
  }
  if (!card.text || !hangulPattern.test(card.text)) {
    fail(`cards.json:${card.id}: 한글 효과 설명이 필요합니다.`);
  }
  if (!Array.isArray(card.tags) || card.tags.length === 0) {
    fail(`cards.json:${card.id}: tags가 필요합니다.`);
  }
  if (!card.frame || typeof card.frame !== "string") {
    fail(`cards.json:${card.id}: 카드 프레임 키가 필요합니다.`);
  }
  if (!Number.isInteger(card.cost) || card.cost < 0) {
    fail(`cards.json:${card.id}: cost는 0 이상의 정수여야 합니다.`);
  }
  if (!card.sockets || !Number.isInteger(card.sockets.base) || !Number.isInteger(card.sockets.max) || card.sockets.base > card.sockets.max) {
    fail(`cards.json:${card.id}: 소켓 base/max 구조가 잘못되었습니다.`);
  }
  if (!card.illustration?.subject || !card.illustration?.mood) {
    fail(`cards.json:${card.id}: 일러스트 방향 subject/mood가 필요합니다.`);
  }
  card.tags.forEach((tag, index) => {
    if (!hangulPattern.test(tag)) fail(`cards.json:${card.id}.tags[${index}]: 한글 태그가 필요합니다.`);
  });
  inspectEffects(card.effects, `cards.json:${card.id}.effects`, allowedCardEffectOps);
  inspectEffects(card.upgrade?.effects, `cards.json:${card.id}.upgrade.effects`, allowedCardEffectOps);
  assertUnlockRefs(card.unlock, `cards.json:${card.id}.unlock`, refs);
});

gems.forEach((gem) => {
  if (!gem.name || !hangulPattern.test(gem.name)) fail(`gems.json:${gem.id}: 한글 보석명이 필요합니다.`);
  if (!gem.text || !hangulPattern.test(gem.text)) fail(`gems.json:${gem.id}: 한글 효과 설명이 필요합니다.`);
  if (!Array.isArray(gem.socketTypes) || gem.socketTypes.length === 0) fail(`gems.json:${gem.id}: socketTypes가 필요합니다.`);
  (gem.socketTypes || []).forEach((type) => {
    if (!["attack", "guard", "skill", "power"].includes(type)) fail(`gems.json:${gem.id}: 알 수 없는 소켓 타입 "${type}"`);
  });
  inspectEffects(gem.effects, `gems.json:${gem.id}.effects`);
  assertUnlockRefs(gem.unlock, `gems.json:${gem.id}.unlock`, refs);
});

relics.forEach((relic) => {
  if (!relic.name || !hangulPattern.test(relic.name)) fail(`relics.json:${relic.id}: 한글 유물명이 필요합니다.`);
  if (!relic.text || !hangulPattern.test(relic.text)) fail(`relics.json:${relic.id}: 한글 효과 설명이 필요합니다.`);
  if (!relic.pool || typeof relic.pool !== "string") fail(`relics.json:${relic.id}: pool이 필요합니다.`);
  inspectEffects(relic.effects, `relics.json:${relic.id}.effects`);
  assertUnlockRefs(relic.unlock || { type: "starter_pool" }, `relics.json:${relic.id}.unlock`, refs);
});

arcanas.forEach((arcana) => {
  if (!arcana.name || !hangulPattern.test(arcana.name)) fail(`arcanas.json:${arcana.id}: 한글 기운명이 필요합니다.`);
  if (!arcana.text || !hangulPattern.test(arcana.text)) fail(`arcanas.json:${arcana.id}: 한글 효과 설명이 필요합니다.`);
  inspectEffects(arcana.effects, `arcanas.json:${arcana.id}.effects`);
  assertUnlockRefs(arcana.unlock, `arcanas.json:${arcana.id}.unlock`, refs);
});

characters.forEach((character) => {
  if (!character.name || !hangulPattern.test(character.name)) fail(`characters.json:${character.id}: 한글 캐릭터명이 필요합니다.`);
  if (!character.role || !hangulPattern.test(character.role)) fail(`characters.json:${character.id}: 한글 역할명이 필요합니다.`);
  if (!character.passiveText || !hangulPattern.test(character.passiveText)) fail(`characters.json:${character.id}: 한글 패시브 설명이 필요합니다.`);
  if (!Number.isInteger(character.maxHp) || character.maxHp <= 0) fail(`characters.json:${character.id}: maxHp는 양의 정수여야 합니다.`);
  if (!Number.isInteger(character.energy) || character.energy <= 0) fail(`characters.json:${character.id}: energy는 양의 정수여야 합니다.`);
  assertRefs(cardIds, character.starterDeck || [], `characters.json:${character.id}.starterDeck`);
  inspectEffects(character.passiveEffects, `characters.json:${character.id}.passiveEffects`);
  assertUnlockRefs(character.unlock, `characters.json:${character.id}.unlock`, refs);
});

enemies.forEach((enemy) => {
  if (!enemy.name || !hangulPattern.test(enemy.name)) fail(`enemies.json:${enemy.id}: 한글 몬스터명이 필요합니다.`);
  if (!enemy.family || !hangulPattern.test(enemy.family)) fail(`enemies.json:${enemy.id}: 한글 계열명이 필요합니다.`);
  if (!["normal", "elite", "boss"].includes(enemy.rank)) fail(`enemies.json:${enemy.id}: 알 수 없는 rank "${enemy.rank}"`);
  if (!Number.isInteger(enemy.maxHp) || enemy.maxHp <= 0) fail(`enemies.json:${enemy.id}: maxHp는 양의 정수여야 합니다.`);
  if (!Array.isArray(enemy.intents) || enemy.intents.length === 0) fail(`enemies.json:${enemy.id}: intents가 필요합니다.`);
  (enemy.intents || []).forEach((intent, index) => {
    if (!intent.type || !intent.label || !hangulPattern.test(intent.label)) fail(`enemies.json:${enemy.id}.intents[${index}]: 한글 의도 label이 필요합니다.`);
    assertRefs(cardIds, intent.cardId ? [intent.cardId] : [], `enemies.json:${enemy.id}.intents[${index}].cardId`);
  });
  (enemy.phaseRules || []).forEach((rule, index) => {
    assertRefs(enemyIds, rule.addIntent?.enemyId ? [rule.addIntent.enemyId] : [], `enemies.json:${enemy.id}.phaseRules[${index}].enemyId`);
  });
});

stages.forEach((stage) => {
  if (!stage.name || !hangulPattern.test(stage.name)) fail(`stages.json:${stage.id}: 한글 스테이지명이 필요합니다.`);
  if (!stage.biome || !hangulPattern.test(stage.biome)) fail(`stages.json:${stage.id}: 한글 biome이 필요합니다.`);
  assertRefs(enemyIds, stage.enemyPool || [], `stages.json:${stage.id}.enemyPool`);
  assertRefs(enemyIds, stage.elitePool || [], `stages.json:${stage.id}.elitePool`);
  assertRefs(enemyIds, [stage.bossEnemyId], `stages.json:${stage.id}.bossEnemyId`);
  assertRefs(stageIds, stage.clearRewards?.unlockStageId ? [stage.clearRewards.unlockStageId] : [], `stages.json:${stage.id}.clearRewards.unlockStageId`);
  assertUnlockRefs(stage.unlock, `stages.json:${stage.id}.unlock`, refs);
  (stage.rooms || []).forEach((room, index) => {
    if (!["combat", "event", "elite", "reward", "boss", "shop", "rest"].includes(room)) {
      fail(`stages.json:${stage.id}.rooms[${index}]: 알 수 없는 방 타입 "${room}"`);
    }
  });
});

events.forEach((event) => {
  if (!event.name || !hangulPattern.test(event.name)) fail(`events.json:${event.id}: 한글 이벤트명이 필요합니다.`);
  if (!event.text || !hangulPattern.test(event.text)) fail(`events.json:${event.id}: 한글 이벤트 설명이 필요합니다.`);
  if (!Array.isArray(event.choices) || event.choices.length === 0) fail(`events.json:${event.id}: choices가 필요합니다.`);
  (event.choices || []).forEach((choice, index) => {
    if (!choice.label || !hangulPattern.test(choice.label)) fail(`events.json:${event.id}.choices[${index}]: 한글 선택지 label이 필요합니다.`);
    const reward = choice.reward || {};
    assertRefs(cardIds, reward.cardPool || [], `events.json:${event.id}.choices[${index}].cardPool`);
    assertRefs(gemIds, reward.gemPool || [], `events.json:${event.id}.choices[${index}].gemPool`);
    assertRefs(relicIds, reward.relicPool || [], `events.json:${event.id}.choices[${index}].relicPool`);
    assertRefs(enemyIds, reward.combat ? [reward.combat] : [], `events.json:${event.id}.choices[${index}].combat`);
  });
  assertUnlockRefs(event.unlock || { type: "starter_pool" }, `events.json:${event.id}.unlock`, refs);
});

achievements.forEach((achievement) => {
  const trigger = achievement.trigger || {};
  const reward = achievement.reward || {};
  if (!allowedAchievementTriggerOps.has(trigger.op)) fail(`achievements.json:${achievement.id}: unsupported trigger "${trigger.op}"`);
  if (!achievement.name || !hangulPattern.test(achievement.name)) fail(`achievements.json:${achievement.id}: 한글 업적명이 필요합니다.`);
  if (!achievement.description || !hangulPattern.test(achievement.description)) fail(`achievements.json:${achievement.id}: 한글 업적 설명이 필요합니다.`);
  assertRefs(stageIds, trigger.stageId ? [trigger.stageId] : [], `achievements.json:${achievement.id}.trigger.stageId`);
  assertRefs(enemyIds, trigger.enemyId ? [trigger.enemyId] : [], `achievements.json:${achievement.id}.trigger.enemyId`);
  assertRefs(characterIds, trigger.characterId ? [trigger.characterId] : [], `achievements.json:${achievement.id}.trigger.characterId`);
  assertRefs(eventIds, trigger.eventId ? [trigger.eventId] : [], `achievements.json:${achievement.id}.trigger.eventId`);
  assertRefs(cardIds, reward.unlockCardId ? [reward.unlockCardId] : [], `achievements.json:${achievement.id}.reward.unlockCardId`);
  assertRefs(gemIds, reward.unlockGemId ? [reward.unlockGemId] : [], `achievements.json:${achievement.id}.reward.unlockGemId`);
  assertRefs(relicIds, reward.unlockRelicId ? [reward.unlockRelicId] : [], `achievements.json:${achievement.id}.reward.unlockRelicId`);
  assertRefs(arcanaIds, reward.unlockArcanaId ? [reward.unlockArcanaId] : [], `achievements.json:${achievement.id}.reward.unlockArcanaId`);
  assertRefs(characterIds, reward.unlockCharacterId ? [reward.unlockCharacterId] : [], `achievements.json:${achievement.id}.reward.unlockCharacterId`);
  assertRefs(metaIds, reward.metaUpgradeId ? [reward.metaUpgradeId] : [], `achievements.json:${achievement.id}.reward.metaUpgradeId`);
});

const targets = data["content-targets.json"]?.targets || {};
const actualCounts = {
  cards: cards.length,
  gems: gems.length,
  relics: relics.length,
  arcanas: arcanas.length,
  characters: characters.length,
  stages: stages.length,
  events: events.length,
  achievements: achievements.length
};
Object.entries(targets).forEach(([key, targetCount]) => {
  if (actualCounts[key] === undefined) return;
  if (actualCounts[key] !== targetCount) {
    fail(`${key}: 현재 ${actualCounts[key]}개 / 목표 ${targetCount}개. 풀 콘텐츠 목표와 정확히 일치해야 합니다.`);
  }
});

const recordedCounts = data["content-targets.json"]?.currentCounts || {};
Object.entries(actualCounts).forEach(([key, actualCount]) => {
  if (recordedCounts[key] !== actualCount) {
    fail(`content-targets.json.currentCounts.${key}: 기록 ${recordedCounts[key]} / 실제 ${actualCount}`);
  }
});

if (data["content-targets.json"]?.supportingCounts?.enemies !== enemies.length) {
  fail(`content-targets.json.supportingCounts.enemies: 기록 ${data["content-targets.json"]?.supportingCounts?.enemies} / 실제 ${enemies.length}`);
}
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
  if (key !== "cards" && targets[key] && count < targets[key]) {
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
