import { checkAchievements } from "./achievements.js";
import { applyCardEffects, cardCost } from "./card-effects.js";
import { addLog, drawCards } from "./game-state.js";
import { openReward } from "./rewards.js";
import { ensureGemState } from "./gems.js";
import {
  afterCardPlayedModifiers,
  afterCombatCompleteModifiers,
  applyBattleStartModifiers,
  consumeChainPreserve,
  discardHandWithModifiers,
  nextTurnShieldWithModifiers,
  resetTurnModifierState
} from "./run-modifiers.js";

let enemyInstanceSeq = 1;

export function startCombat(state, index, roomType = "combat") {
  ensureGemState(state);
  const stage = index.stages.get(state.stageId);
  const sourcePool = roomType === "boss"
    ? [stage.bossEnemyId]
    : roomType === "elite"
      ? stage.elitePool
      : stage.enemyPool;
  const count = roomType === "combat" ? Math.min(2, sourcePool.length) : 1;
  state.enemies = sourcePool.slice(0, count).map((enemyId) => createEnemyInstance(index.enemies.get(enemyId)));
  state.phase = "combat";
  state.currentRoomType = roomType;
  state.turn = 1;
  state.status.chain = 0;
  state.status.previousCard = null;
  state.player.shield = 0;
  state.player.energy = state.player.maxEnergy;
  state.metrics.cardsPlayedThisTurn = 0;
  state.metrics.cardsPlayedThisCombat = 0;
  applyBattleStartModifiers(state, index);
  addLog(state, `${roomLabel(roomType)} 시작`);
}

export function playCard(state, index, handIndex) {
  if (state.phase !== "combat") return false;
  const cardId = state.hand[handIndex];
  const card = index.cards.get(cardId);
  if (!card) return false;
  const cost = cardCost(card, state, index);
  if (cost > state.player.energy) {
    addLog(state, "기운이 부족합니다.");
    return false;
  }

  state.hand.splice(handIndex, 1);
  state.player.energy -= cost;
  state.status.nextCardDiscount = 0;
  state.status.nextCardCostIncrease = 0;
  state.metrics.cardsPlayedThisTurn += 1;
  state.metrics.cardsPlayedThisCombat += 1;
  state.status.chain = (state.status.chain || 0) + 1;
  state.metrics.maxChain = Math.max(state.metrics.maxChain, state.status.chain);
  const context = { cardId, cost, killedThisPlay: false, exhaustSelf: false };
  const enemiesBefore = state.enemies.length;
  applyCardEffects({ card, state, index, context });
  context.killedThisPlay = context.killedThisPlay || state.enemies.length < enemiesBefore;
  afterCardPlayedModifiers({ state, index, card, context, cost });

  if (context.killedThisPlay) {
    checkAchievements(state, index, "defeat_rank", { rank: "normal" });
  }
  if (context.exhaustSelf || card.type === "temp" || card.type === "curse") state.exhaustPile.push(cardId);
  else state.discardPile.push(cardId);

  state.status.previousCard = { id: card.id, cost };
  checkAchievements(state, index, "reach_chain");
  if (state.enemies.length === 0) completeCombat(state, index);
  return true;
}

export function endTurn(state, index) {
  if (state.phase !== "combat") return false;
  let incomingDamage = 0;
  state.enemies.forEach((enemy) => {
    const intent = nextIntent(enemy, state.turn);
    if (intent.type === "attack") incomingDamage += intent.amount;
    if (intent.type === "guard") enemy.block = (enemy.block || 0) + intent.amount;
    if (intent.type === "debuff") state.status.nextCardCostIncrease = Math.max(state.status.nextCardCostIncrease || 0, 1);
    if (intent.type === "special" && intent.effect === "add_temp_card") state.discardPile.push(intent.cardId || "card_temp_dust");
    if (intent.type === "special" && intent.effect === "reduce_energy") state.status.nextTurnEnergyPenalty = 1;
  });
  const reduced = Math.max(0, incomingDamage - (state.status.damageReduction || 0));
  const blocked = Math.min(state.player.shield, reduced);
  const damage = Math.max(0, reduced - blocked);
  const remainingShield = Math.max(0, state.player.shield - blocked);
  state.player.shield = nextTurnShieldWithModifiers(state, index, remainingShield, state.status.retainShield || 0);
  state.player.hp = Math.max(0, state.player.hp - damage);
  state.status.damageTakenThisCombat = (state.status.damageTakenThisCombat || 0) + damage;
  addLog(state, damage > 0 ? `피해 ${damage} 받음` : "공격을 막았습니다.");

  discardHandWithModifiers(state, index);
  state.turn += 1;
  state.player.energy = Math.max(1, state.player.maxEnergy - (state.status.nextTurnEnergyPenalty || 0));
  state.status.nextTurnEnergyPenalty = 0;
  state.status.damageReduction = 0;
  state.status.retainShield = 0;
  state.metrics.cardsPlayedThisTurn = 0;
  if (state.status.preserveNextChain) state.status.preserveNextChain = false;
  else if (!consumeChainPreserve(state, index)) state.status.chain = 0;
  resetTurnModifierState(state);
  drawCards(state, 5);

  if (state.player.hp <= 0) {
    state.phase = "defeat";
    addLog(state, "탐험 실패");
  }
  return true;
}

export function nextIntent(enemy, turn) {
  return enemy.intents[(turn - 1) % enemy.intents.length];
}

function completeCombat(state, index) {
  const source = state.currentRoomType;
  state.metrics.roomsCleared += 1;
  checkAchievements(state, index, "room_clear", { stageId: state.stageId });
  if (source === "elite") checkAchievements(state, index, "defeat_rank", { rank: "elite" });
  if (source === "boss") {
    const stage = index.stages.get(state.stageId);
    checkAchievements(state, index, "defeat_enemy", { enemyId: stage.bossEnemyId });
    checkAchievements(state, index, "clear_stage", { stageId: state.stageId });
  }
  afterCombatCompleteModifiers(state, index);
  openReward(state, index, source);
}

function createEnemyInstance(enemy) {
  return {
    ...structuredClone(enemy),
    hp: enemy.maxHp,
    instanceId: `enemy_${enemyInstanceSeq++}`,
    status: {}
  };
}

function roomLabel(roomType) {
  return ({ combat: "전투", elite: "정예 전투", boss: "보스 전투" })[roomType] || "전투";
}
