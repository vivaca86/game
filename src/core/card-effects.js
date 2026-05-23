import { addLog, drawCards } from "./game-state.js";

export function cardCost(card, state) {
  const discount = state.status.nextCardDiscount || 0;
  const increase = state.status.nextCardCostIncrease || 0;
  return Math.max(0, card.cost - discount + increase);
}

export function applyCardEffects({ card, state, index, context, effects = card.effects }) {
  for (const effect of effects) {
    applyEffect({ effect, card, state, index, context });
  }
}

export function applyEffect({ effect, card, state, index, context }) {
  switch (effect.op) {
    case "damage_front":
      damageEnemy(frontEnemy(state), effect.amount, state, card, context);
      break;
    case "damage_all":
      [...state.enemies].forEach((enemy) => damageEnemy(enemy, effect.amount, state, card, context));
      break;
    case "damage_random":
      for (let hit = 0; hit < (effect.hits || 1); hit += 1) {
        damageEnemy(state.rng.pick(state.enemies), effect.amount, state, card, context);
      }
      break;
    case "damage_bonus_if_cards_played_at_least":
      if (state.metrics.cardsPlayedThisTurn >= effect.threshold) damageEnemy(frontEnemy(state), effect.amount, state, card, context);
      break;
    case "damage_bonus_if_chain_at_least":
      if ((state.status.chain || 0) >= effect.threshold) damageEnemy(frontEnemy(state), effect.amount, state, card, context);
      break;
    case "damage_bonus_if_hand_at_most":
      if (state.hand.length <= effect.threshold) damageEnemy(frontEnemy(state), effect.amount, state, card, context);
      break;
    case "damage_bonus_vs_marked":
      state.enemies.filter((enemy) => enemy.status?.mark > 0).forEach((enemy) => damageEnemy(enemy, effect.amount, state, card, context));
      break;
    case "gain_shield":
      state.player.shield += effect.amount;
      addLog(state, `보호막 ${effect.amount} 획득`);
      break;
    case "retain_shield_next_turn":
      state.status.retainShield = Math.max(state.status.retainShield || 0, effect.amount);
      break;
    case "reduce_next_attack":
      state.status.damageReduction = Math.max(state.status.damageReduction || 0, effect.amount);
      break;
    case "draw":
      drawCards(state, effect.amount);
      break;
    case "draw_if_kill":
      if (context.killedThisPlay) drawCards(state, effect.amount);
      break;
    case "gain_energy":
      state.player.energy = Math.min(state.player.maxEnergy + 3, state.player.energy + effect.amount);
      break;
    case "lose_energy":
      state.player.energy = Math.max(0, state.player.energy - effect.amount);
      break;
    case "discount_next_card":
      state.status.nextCardDiscount = Math.max(state.status.nextCardDiscount || 0, effect.amount);
      break;
    case "increase_next_card_cost":
      state.status.nextCardCostIncrease = Math.max(state.status.nextCardCostIncrease || 0, effect.amount);
      break;
    case "apply_mark":
      applyStatus(frontEnemy(state), "mark", effect.amount);
      break;
    case "heal_if_hp_ratio_below":
      if (state.player.hp / state.player.maxHp <= effect.ratio) healPlayer(state, effect.amount);
      break;
    case "enable_reflect_damage":
      state.status.reflectRatio = Math.max(state.status.reflectRatio || 0, effect.ratio);
      break;
    case "increase_next_card_reward_options":
      state.status.nextCardRewardBonus = (state.status.nextCardRewardBonus || 0) + effect.amount;
      break;
    case "prepare_socket_bonus":
      state.status.socketBonus = (state.status.socketBonus || 0) + effect.amount;
      break;
    case "repeat_previous_basic_effect":
      repeatPreviousEffect({ state, index, context, maxCost: Infinity });
      break;
    case "repeat_previous_basic_effect_if_cost_at_most":
      repeatPreviousEffect({ state, index, context, maxCost: effect.cost });
      break;
    case "add_battle_rule":
      state.battleRules.push({ ...effect, sourceCardId: card.id });
      break;
    case "reset_chain":
      state.status.chain = 0;
      break;
    case "exhaust_self":
      context.exhaustSelf = true;
      break;
    default:
      throw new Error(`${card.name}: 알 수 없는 카드 효과 ${effect.op}`);
  }
}

export function healPlayer(state, amount) {
  state.player.hp = Math.min(state.player.maxHp, state.player.hp + amount);
  addLog(state, `체력 ${amount} 회복`);
}

function repeatPreviousEffect({ state, index, context, maxCost }) {
  const previous = state.status.previousCard;
  if (!previous || previous.id === context.cardId || previous.cost > maxCost) return;
  const card = index.cards.get(previous.id);
  if (!card) return;
  const effects = card.effects.filter((effect) => !effect.op.startsWith("repeat_") && effect.op !== "exhaust_self");
  applyCardEffects({ card, state, index, context: { ...context, repeated: true }, effects });
}

function frontEnemy(state) {
  return state.enemies[0] || null;
}

function damageEnemy(enemy, amount, state, card, context) {
  if (!enemy || amount <= 0) return;
  const markBonus = enemy.status?.mark ? Math.ceil(amount * 0.2) : 0;
  let incoming = amount + markBonus;
  const blocked = Math.min(enemy.block || 0, incoming);
  enemy.block = Math.max(0, (enemy.block || 0) - blocked);
  incoming -= blocked;
  enemy.hp = Math.max(0, enemy.hp - incoming);
  addLog(state, `${card.name}: ${enemy.name}에게 피해 ${incoming}`);
  if (enemy.hp <= 0) {
    context.killedThisPlay = true;
    state.metrics.enemiesDefeated += 1;
    if (enemy.rank === "elite") state.metrics.elitesDefeated += 1;
    state.enemies = state.enemies.filter((target) => target.instanceId !== enemy.instanceId);
  }
}

function applyStatus(enemy, status, amount) {
  if (!enemy) return;
  enemy.status = enemy.status || {};
  enemy.status[status] = (enemy.status[status] || 0) + amount;
}
