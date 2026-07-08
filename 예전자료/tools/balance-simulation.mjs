import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createGameIndex, assertRuntimeData } from "../src/core/data-loader.js";
import { cleanseDisruption, disruptionCleanseCost, endTurn, playCard } from "../src/core/combat.js";
import { startRun, advanceRoom } from "../src/core/progression.js";
import { applyEventChoice, applyRewardOption } from "../src/core/rewards.js";
import { cardCost } from "../src/core/card-effects.js";
import { createDefaultProfile, finalizeRunProfile } from "../src/core/profile.js";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(rootDir, "src", "data", "ko");
const readJson = async (fileName) => JSON.parse(await readFile(path.join(dataDir, fileName), "utf8"));

const args = parseArgs(process.argv.slice(2));
const runCount = Number(args.runs || 12);
const stageOrders = String(args.stages || "1,3,6,10,15")
  .split(",")
  .map((value) => Number(value.trim()))
  .filter(Boolean);

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

const results = [];
for (const order of stageOrders) {
  const stage = data.stages.find((item) => item.order === order);
  if (!stage) continue;
  for (let runIndex = 0; runIndex < runCount; runIndex += 1) {
    const seed = 20260523 + order * 1000 + runIndex;
    results.push(simulateRun({ stage, seed }));
  }
}

printSummary(results);

function simulateRun({ stage, seed }) {
  const profile = createDefaultProfile(index);
  unlockForStage(profile, stage.order);
  seedProgressAchievements(profile, stage.order);
  const state = startRun(index, {
    characterId: pickCharacter(profile),
    stageId: stage.id,
    seed,
    profile
  });
  const rewardChoices = {};
  let safety = 0;
  while (!["stage_clear", "defeat"].includes(state.phase) && safety < 900) {
    safety += 1;
    if (state.phase === "combat") {
      if (shouldCleanseDisruption(state)) {
        cleanseDisruption(state, index);
        continue;
      }
      const handIndex = chooseCardToPlay(state);
      if (handIndex >= 0) playCard(state, index, handIndex);
      else endTurn(state, index);
      continue;
    }
    if (state.phase === "event") {
      applyEventChoice(state, index, chooseEventChoice(state));
      continue;
    }
    if (state.phase === "reward") {
      const option = chooseRewardOption(state);
      if (option) {
        rewardChoices[option.type] = (rewardChoices[option.type] || 0) + 1;
        applyRewardOption(state, index, option.id);
      } else {
        state.pendingReward = null;
        state.phase = "room_complete";
      }
      continue;
    }
    if (state.phase === "room_complete") {
      advanceRoom(state, index);
    }
  }
  finalizeRunProfile(state, index, profile);
  return {
    stageOrder: stage.order,
    stageName: stage.name,
    won: state.phase === "stage_clear",
    safety,
    hp: state.player.hp,
    maxHp: state.player.maxHp,
    gold: state.player.gold,
    deckSize: state.deck.length,
    gemBag: state.inventory.gemBag.length,
    relics: state.inventory.relics.length,
    arcanas: state.inventory.arcanas.length,
    upgradedCards: state.upgradedCards.length,
    roomsCleared: state.metrics.roomsCleared,
    enemiesDefeated: state.metrics.enemiesDefeated,
    maxChain: state.metrics.maxChain,
    intents: state.metrics.enemyIntentsResolved || 0,
    bossPhases: state.metrics.bossPhaseTriggers || 0,
    damageTaken: state.status.damageTakenThisCombat || 0,
    rewardChoices
  };
}

function shouldCleanseDisruption(state) {
  const disruptions = state.hand
    .map((cardId) => index.cards.get(cardId))
    .filter((card) => card && ["curse", "temp"].includes(card.type));
  const target = disruptions.find((card) => disruptionCleanseCost(card) <= state.player.energy);
  if (!target) return false;
  const remainingEnergy = state.player.energy - disruptionCleanseCost(target);
  const playableUsefulCards = state.hand.filter((cardId) => {
    const card = index.cards.get(cardId);
    return card && !["curse", "temp"].includes(card.type) && cardCost(card, state, index) <= remainingEnergy;
  });
  return playableUsefulCards.length <= 1 || state.hand.length >= 5;
}

function chooseCardToPlay(state) {
  const playable = state.hand
    .map((cardId, handIndex) => ({ card: index.cards.get(cardId), handIndex }))
    .filter(({ card }) => card && cardCost(card, state, index) <= state.player.energy);
  if (playable.length === 0) return -1;
  const incomingDamage = estimateIncomingDamage(state);
  const scored = playable.map((item) => ({
    ...item,
    score: scoreCard(item.card, state, incomingDamage)
  }));
  scored.sort((a, b) => b.score - a.score || cardCost(a.card, state, index) - cardCost(b.card, state, index));
  return scored[0].handIndex;
}

function scoreCard(card, state, incomingDamage) {
  let score = 0;
  const shieldGap = Math.max(0, incomingDamage - state.player.shield);
  const hpRatio = state.player.hp / state.player.maxHp;
  if (card.type === "attack") score += 30;
  if (card.type === "guard") score += shieldGap > 0 ? 38 + shieldGap * (hpRatio < 0.55 ? 2.2 : 1.4) : 12;
  if (card.type === "skill") score += 18;
  if (card.type === "power") score += state.metrics.cardsPlayedThisCombat < 4 ? 24 : 8;
  for (const effect of card.effects || []) {
    if (effect.op?.startsWith("damage")) score += 4 + (effect.amount || 0);
    if (effect.op === "gain_shield") score += shieldGap > 0 ? 6 + (effect.amount || 0) * 1.6 : 2;
    if (effect.op === "draw") score += 4 * (effect.amount || 1);
    if (effect.op === "gain_energy") score += 5 * (effect.amount || 1);
    if (effect.op === "heal_if_hp_ratio_below" && state.player.hp / state.player.maxHp <= effect.ratio) score += 18;
  }
  return score - cardCost(card, state, index) * 2;
}

function estimateIncomingDamage(state) {
  return state.enemies.reduce((sum, enemy) => {
    const intent = enemy.intents[(state.turn - 1) % enemy.intents.length];
    if (!intent) return sum;
    if (intent.type === "attack") return sum + (intent.amount || 0);
    if (intent.effect === "pierce_attack") return sum + (intent.amount || 0);
    return sum;
  }, 0);
}

function chooseRewardOption(state) {
  const reward = state.pendingReward;
  if (!reward) return null;
  const options = reward.options.filter((option) => !option.cost || canPay(state, option.cost));
  if (options.length === 0) return null;
  return options
    .map((option) => ({ option, score: scoreRewardOption(state, option) }))
    .sort((a, b) => b.score - a.score)[0].option;
}

function scoreRewardOption(state, option) {
  const costPenalty = option.cost?.gold ? option.cost.gold * 0.65 : 0;
  const deckPressure = Math.max(0, state.deck.length - 13) * 4;
  const scores = {
    relic: 90,
    arcana: 82,
    gem: state.inventory.gemBag.length < 5 ? 68 : 38,
    card: state.deck.length < 15 ? 58 : 34 - deckPressure,
    gold: 40 + (option.amount || 0) * 0.35
  };
  return (scores[option.type] || 10) - costPenalty;
}

function chooseEventChoice(state) {
  const choices = state.pendingEvent?.choices || [];
  const affordable = choices
    .map((choice, index) => ({ choice, index }))
    .filter(({ choice }) => canPay(state, choice.cost || {}));
  if (affordable.length === 0) return 0;
  return affordable
    .map((entry) => ({ ...entry, score: scoreEventChoice(state, entry.choice) }))
    .sort((a, b) => b.score - a.score)[0].index;
}

function scoreEventChoice(state, choice) {
  const reward = choice.reward || {};
  let score = 0;
  if (reward.relicPool) score += 80;
  if (reward.gemPool) score += 62;
  if (reward.cardPool) score += state.deck.length < 15 ? 50 : 24;
  if (reward.upgradeRandomCard) score += 46;
  if (reward.heal) score += state.player.hp / state.player.maxHp < 0.7 ? 50 : 12;
  if (reward.gold) score += reward.gold * 0.5;
  if (reward.combat) score += 18;
  if (choice.cost?.gold) score -= choice.cost.gold * 0.7;
  if (choice.cost?.hp) score -= choice.cost.hp * 2;
  return score;
}

function canPay(state, cost = {}) {
  if (cost.gold && state.player.gold < cost.gold) return false;
  if (cost.hp && state.player.hp <= cost.hp) return false;
  return true;
}

function unlockForStage(profile, stageOrder) {
  for (const stage of data.stages.filter((item) => item.order <= stageOrder)) {
    addUnique(profile.unlockedStages, stage.id);
    if (stage.order < stageOrder) addUnique(profile.clearedStages, stage.id);
  }
  for (const row of data.characters.filter((item) => isUnlockedByStage(item, stageOrder))) addUnique(profile.unlockedCharacters, row.id);
  for (const row of data.cards.filter((item) => isUnlockedByStage(item, stageOrder))) addUnique(profile.unlockedCards, row.id);
  for (const row of data.gems.filter((item) => isUnlockedByStage(item, stageOrder))) addUnique(profile.unlockedGems, row.id);
  for (const row of data.relics.filter((item) => isUnlockedByStage(item, stageOrder))) addUnique(profile.unlockedRelics, row.id);
  for (const row of data.arcanas.filter((item) => isUnlockedByStage(item, stageOrder))) addUnique(profile.unlockedArcanas, row.id);
}

function isUnlockedByStage(item, stageOrder) {
  if (!item.unlock || ["starter", "starter_pool", "base_pool"].includes(item.unlock.type)) return true;
  if (!["stage_clear", "pool"].includes(item.unlock.type)) return false;
  const unlockStage = data.stages.find((stage) => stage.id === item.unlock.stageId);
  return unlockStage ? unlockStage.order < stageOrder : false;
}

function pickCharacter(profile) {
  return [...profile.unlockedCharacters]
    .map((id) => index.characters.get(id))
    .filter(Boolean)
    .sort((a, b) => b.maxHp - a.maxHp)[0]?.id || "char_haru";
}

function seedProgressAchievements(profile, stageOrder) {
  for (const achievement of data.achievements) {
    const trigger = achievement.trigger || {};
    if (trigger.op === "reach_chain" && trigger.amount <= 5 && stageOrder >= 3) addUnique(profile.achievements, achievement.id);
    if (!["clear_stage", "defeat_enemy", "clear_rooms_in_stage"].includes(trigger.op)) continue;
    const relatedStage = trigger.stageId
      ? data.stages.find((stage) => stage.id === trigger.stageId)
      : data.stages.find((stage) => stage.bossEnemyId === trigger.enemyId);
    if (relatedStage && relatedStage.order < stageOrder) addUnique(profile.achievements, achievement.id);
  }
}

function printSummary(rows) {
  const grouped = Map.groupBy(rows, (row) => row.stageOrder);
  const summary = [...grouped.entries()].map(([stageOrder, stageRows]) => summarizeStage(stageOrder, stageRows));
  console.log("밸런스 시뮬레이션");
  console.log(`runs=${runCount}, stages=${stageOrders.join(",")}`);
  for (const row of summary) {
    console.log(
      [
        `${row.stageOrder}. ${row.stageName}`,
        `승률 ${percent(row.winRate)}`,
        `방 ${fixed(row.rooms)}`,
        `체력 ${fixed(row.hp)}`,
        `골드 ${fixed(row.gold)}`,
        `덱 ${fixed(row.deckSize)}`,
        `보석 ${fixed(row.gemBag)}`,
        `유물 ${fixed(row.relics)}`,
        `기운 ${fixed(row.arcanas)}`,
        `의도 ${fixed(row.intents)}`,
        `보스변화 ${fixed(row.bossPhases)}`
      ].join(" | ")
    );
  }
  const warnings = summary.flatMap(balanceWarnings);
  if (warnings.length > 0) {
    console.log("\n주의");
    warnings.forEach((warning) => console.log(`- ${warning}`));
  }
}

function summarizeStage(stageOrder, rows) {
  return {
    stageOrder,
    stageName: rows[0]?.stageName || "",
    winRate: avg(rows.map((row) => (row.won ? 1 : 0))),
    rooms: avg(rows.map((row) => row.roomsCleared)),
    hp: avg(rows.map((row) => row.hp)),
    gold: avg(rows.map((row) => row.gold)),
    deckSize: avg(rows.map((row) => row.deckSize)),
    gemBag: avg(rows.map((row) => row.gemBag)),
    relics: avg(rows.map((row) => row.relics)),
    arcanas: avg(rows.map((row) => row.arcanas)),
    intents: avg(rows.map((row) => row.intents)),
    bossPhases: avg(rows.map((row) => row.bossPhases))
  };
}

function balanceWarnings(row) {
  const warnings = [];
  const lowWinRate = row.stageOrder >= 10 ? 0.2 : 0.35;
  if (row.winRate < lowWinRate) warnings.push(`${row.stageOrder}. ${row.stageName}: 승률이 낮음`);
  if (row.winRate > 0.95 && row.stageOrder >= 6) warnings.push(`${row.stageOrder}. ${row.stageName}: 승률이 너무 높음`);
  if (row.deckSize > 18) warnings.push(`${row.stageOrder}. ${row.stageName}: 덱이 빠르게 불어남`);
  if (row.gold > 260 && row.stageOrder <= 6) warnings.push(`${row.stageOrder}. ${row.stageName}: 초중반 골드가 많음`);
  if (row.relics + row.arcanas > 7 && row.stageOrder <= 6) warnings.push(`${row.stageOrder}. ${row.stageName}: 핵심 보상이 빠르게 쌓임`);
  return warnings;
}

function parseArgs(values) {
  const parsed = {};
  for (const value of values) {
    const [key, raw] = value.replace(/^--/, "").split("=");
    parsed[key] = raw || true;
  }
  return parsed;
}

function addUnique(list, value) {
  if (value && !list.includes(value)) list.push(value);
}

function avg(values) {
  return values.reduce((sum, value) => sum + value, 0) / Math.max(1, values.length);
}

function fixed(value) {
  return Number(value).toFixed(1);
}

function percent(value) {
  return `${Math.round(value * 100)}%`;
}
