import { addLog } from "./game-state.js";
import { grantGem } from "./gems.js";
import { grantArcana, grantRelic } from "./run-modifiers.js";
import { achievementGoldReward } from "./balance.js";

export function checkAchievements(state, index, eventName, payload = {}) {
  const newlyUnlocked = [];
  for (const achievement of index.data.achievements) {
    if (state.inventory.achievements.includes(achievement.id)) continue;
    if (!matchesTrigger(achievement.trigger, eventName, payload, state)) continue;
    state.inventory.achievements.push(achievement.id);
    applyAchievementReward(state, index, achievement.reward);
    newlyUnlocked.push(achievement);
    addLog(state, `업적 달성: ${achievement.name}`);
  }
  return newlyUnlocked;
}

function matchesTrigger(trigger, eventName, payload, state) {
  if (!trigger) return false;
  if (trigger.op === "clear_stage") return eventName === "clear_stage" && trigger.stageId === payload.stageId;
  if (trigger.op === "defeat_rank") return eventName === "defeat_rank" && trigger.rank === payload.rank;
  if (trigger.op === "defeat_enemy") return eventName === "defeat_enemy" && trigger.enemyId === payload.enemyId;
  if (trigger.op === "defeat_enemy_count") {
    return eventName === "defeat_enemy_count" && trigger.enemyId === payload.enemyId && (state.metrics.defeatedEnemyCounts?.[trigger.enemyId] || 0) >= trigger.amount;
  }
  if (trigger.op === "reach_chain") return (state.status.chain || 0) >= trigger.amount;
  if (trigger.op === "collect_cards") return state.inventory.unlockedCards.length >= trigger.amount;
  if (trigger.op === "collect_gems") return state.inventory.gems.length >= trigger.amount;
  if (trigger.op === "collect_relics") return state.inventory.relics.length >= trigger.amount;
  if (trigger.op === "collect_arcanas") return state.inventory.arcanas.length >= trigger.amount;
  if (trigger.op === "complete_event") return eventName === "complete_event" && trigger.eventId === payload.eventId;
  if (trigger.op === "clear_rooms_in_stage") {
    return eventName === "room_clear" && trigger.stageId === payload.stageId && state.metrics.roomsCleared >= trigger.amount;
  }
  return false;
}

function applyAchievementReward(state, index, reward = {}) {
  if (reward.gold) state.player.gold += achievementGoldReward(reward.gold);
  if (reward.unlockCardId && !state.inventory.unlockedCards.includes(reward.unlockCardId)) state.inventory.unlockedCards.push(reward.unlockCardId);
  if (reward.unlockGemId && !state.inventory.gems.includes(reward.unlockGemId)) grantGem(state, reward.unlockGemId);
  if (reward.unlockRelicId && !state.inventory.relics.includes(reward.unlockRelicId)) grantRelic(state, index, reward.unlockRelicId);
  if (reward.unlockArcanaId && !state.inventory.arcanas.includes(reward.unlockArcanaId)) grantArcana(state, index, reward.unlockArcanaId);
  if (reward.unlockCharacterId && !state.inventory.unlockedCharacters.includes(reward.unlockCharacterId)) state.inventory.unlockedCharacters.push(reward.unlockCharacterId);
  if (reward.metaUpgradeId) {
    state.inventory.lastMetaReward = reward.metaUpgradeId;
    state.inventory.metaUpgrades = state.inventory.metaUpgrades || [];
    if (!state.inventory.metaUpgrades.includes(reward.metaUpgradeId)) state.inventory.metaUpgrades.push(reward.metaUpgradeId);
  }
}
