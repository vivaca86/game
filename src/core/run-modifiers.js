import { addLog, drawCards } from "./game-state.js";
import { BALANCE } from "./balance.js";

export function ensureModifierState(state) {
  state.inventory.relics = Array.isArray(state.inventory.relics) ? state.inventory.relics : [];
  state.inventory.arcanas = Array.isArray(state.inventory.arcanas) ? state.inventory.arcanas : [];
  state.inventory.metaUpgrades = Array.isArray(state.inventory.metaUpgrades) ? state.inventory.metaUpgrades : [];
  state.status = state.status || {};
}

export function initializeRunModifiers(state, index) {
  ensureModifierState(state);
  for (const arcana of index.data.arcanas.filter((item) => item.unlock?.type === "starter")) {
    if (!state.inventory.arcanas.includes(arcana.id)) state.inventory.arcanas.push(arcana.id);
  }
  const startingGold = sumMetaEffects(state, index, "starting_gold_per_rank", "amount");
  if (startingGold > 0) {
    state.player.gold += startingGold;
    addLog(state, `마을 준비금: 별사탕 ${startingGold} 획득`);
  }
  updateRevealedRoom(state, index);
}

export function updateRevealedRoom(state, index) {
  ensureModifierState(state);
  const stage = index.stages.get(state.stageId);
  const revealAmount = sumRelicEffects(state, index, "reveal_next_room_type", "amount");
  if (!stage || revealAmount <= 0) {
    state.status.revealedNextRoomType = null;
    return;
  }
  state.status.revealedNextRoomType = stage.rooms[state.roomIndex + revealAmount] || null;
}

export function grantRelic(state, index, relicId) {
  ensureModifierState(state);
  const relic = index.relics.get(relicId);
  if (!relic || state.inventory.relics.includes(relicId)) return false;
  state.inventory.relics.push(relicId);
  if (state.profileUnlocks?.relics && !state.profileUnlocks.relics.includes(relicId)) state.profileUnlocks.relics.push(relicId);
  addLog(state, `유물 획득: ${relic.name}`);
  return true;
}

export function grantArcana(state, index, arcanaId) {
  ensureModifierState(state);
  const arcana = index.arcanas.get(arcanaId);
  if (!arcana || state.inventory.arcanas.includes(arcanaId)) return false;
  state.inventory.arcanas.push(arcanaId);
  if (state.profileUnlocks?.arcanas && !state.profileUnlocks.arcanas.includes(arcanaId)) state.profileUnlocks.arcanas.push(arcanaId);
  addLog(state, `기운 획득: ${arcana.name}`);
  return true;
}

export function applyBattleStartModifiers(state, index) {
  ensureModifierState(state);
  state.status.firstExpensiveCardFreeAvailable = hasRelicEffect(state, index, "first_expensive_card_free_each_battle");
  state.status.firstAttackDamageBonusUsed = false;
  state.status.characterChainEnergyTriggeredThisTurn = false;
  state.status.relicChainPreserveCharges = sumRelicEffects(state, index, "preserve_chain_once", "amount");
  state.status.damageTakenThisCombat = 0;
  state.status.guardCardsPlayedThisCombat = 0;
  state.status.costLadderProgress = 0;
  state.status.colorsPlayedThisTurn = [];
  state.status.handCostDiscount = 0;
  state.status.rainbowFinaleAppliedThisTurn = false;
  state.status.prismPathTriggeredThisTurn = false;

  const shield = sumRelicEffects(state, index, "shield_at_battle_start", "amount")
    + sumCharacterEffects(state, index, "shield_at_battle_start", "amount");
  if (shield > 0) {
    state.player.shield += shield;
    addLog(state, `유물 보호막 ${shield} 획득`);
  }

  const energy = sumRelicEffects(state, index, "start_with_energy", "amount");
  if (energy > 0) {
    state.player.energy += energy;
    addLog(state, `전투 시작 기운 +${energy}`);
  }
}

export function adjustedModifierCardCost(card, state, index, cost) {
  if (!index) return cost;
  ensureModifierState(state);
  let nextCost = Math.max(0, cost - (state.status.handCostDiscount || 0));
  const freeExpensive = relicEffects(state, index, "first_expensive_card_free_each_battle")
    .some((effect) => card.cost >= (effect.minCost || 1));
  if (state.status.firstExpensiveCardFreeAvailable && freeExpensive) nextCost = 0;
  return nextCost;
}

export function consumeChainPreserve(state, index) {
  ensureModifierState(state);
  if ((state.status.relicChainPreserveCharges || 0) <= 0) return false;
  state.status.relicChainPreserveCharges -= 1;
  addLog(state, "무지개 매듭으로 연쇄 유지");
  return true;
}

export function afterCardPlayedModifiers({ state, index, card, context, cost }) {
  ensureModifierState(state);
  consumeFirstExpensiveCardFree(state, index, card);
  applyCostLadderArcana(state, index, cost);
  applyColorArcana(state, index, card);
  applyBattleRules(state, index, card);
  applyCharacterCardPassives(state, index);

  if (card.type === "guard") {
    state.status.guardCardsPlayedThisCombat = (state.status.guardCardsPlayedThisCombat || 0) + 1;
    for (const effect of arcanaEffects(state, index, "damage_random_on_guard_play")) {
      dealDirectDamage(state, index, state.rng.pick(state.enemies), effect.amount, "구름 행진", context);
    }
    for (const effect of arcanaEffects(state, index, "heal_when_guard_played_count")) {
      if (state.status.guardCardsPlayedThisCombat % effect.threshold === 0) {
        healPlayerFromModifier(state, index, effect.amount, "민트 낮잠");
      }
    }
  }

  if (card.type === "attack" && context.killedThisPlay) {
    for (const effect of arcanaEffects(state, index, "damage_all_on_attack_kill")) {
      [...state.enemies].forEach((enemy) => dealDirectDamage(state, index, enemy, effect.amount, "복숭아 팡파르", context));
    }
  }

  if (cost === 0) {
    for (const effect of arcanaEffects(state, index, "gain_gold_on_zero_cost_play")) {
      state.player.gold += effect.amount;
      addLog(state, `별빵 굽기: 별사탕 ${effect.amount} 획득`);
    }
  }

  for (const effect of arcanaEffects(state, index, "damage_all_when_cards_played")) {
    if (state.metrics.cardsPlayedThisTurn === effect.threshold) {
      [...state.enemies].forEach((enemy) => dealDirectDamage(state, index, enemy, effect.amount, "리본 불꽃놀이", context));
    }
  }

  for (const effect of arcanaEffects(state, index, "discount_hand_when_cards_played")) {
    if (state.metrics.cardsPlayedThisTurn >= effect.threshold && !state.status.rainbowFinaleAppliedThisTurn) {
      state.status.handCostDiscount = Math.max(state.status.handCostDiscount || 0, effect.amount);
      state.status.rainbowFinaleAppliedThisTurn = true;
      addLog(state, `무지개 피날레: 이번 턴 비용 -${effect.amount}`);
    }
  }
  state.status.firstAttackDamageBonusCardId = null;
  state.status.firstAttackDamageBonusAmount = 0;
}

export function afterPlayerHealed(state, index, amount) {
  if (!index || amount <= 0) return;
  for (const effect of arcanaEffects(state, index, "mark_front_on_heal")) {
    applyEnemyStatus(state.enemies[0], "mark", effect.amount);
    addLog(state, `새싹 노래: 앞 적 표식 ${effect.amount}`);
  }
}

export function discardHandWithModifiers(state, index) {
  const retainCount = sumRelicEffects(state, index, "retain_one_card", "amount");
  const retained = retainCount > 0 ? state.hand.slice(0, retainCount) : [];
  const discarded = retainCount > 0 ? state.hand.slice(retainCount) : state.hand;
  state.discardPile.push(...discarded);
  state.hand = retained;
  if (retained.length > 0) addLog(state, `졸린 베개: 카드 ${retained.length}장 보존`);
}

export function nextTurnShieldWithModifiers(state, index, remainingShield, retainedShield) {
  const carryPercent = sumArcanaEffects(state, index, "carry_shield_percent", "amount");
  const carried = carryPercent > 0 ? Math.ceil(remainingShield * (carryPercent / 100)) : 0;
  return Math.max(retainedShield || 0, carried);
}

export function resetTurnModifierState(state) {
  state.status.colorsPlayedThisTurn = [];
  state.status.handCostDiscount = 0;
  state.status.rainbowFinaleAppliedThisTurn = false;
  state.status.prismPathTriggeredThisTurn = false;
  state.status.characterChainEnergyTriggeredThisTurn = false;
}

export function modifiedCharacterDamageAmount(card, state, index, amount) {
  if (!index || card?.type !== "attack") return amount;
  if (state.status.firstAttackDamageBonusCardId === card.id) return amount + (state.status.firstAttackDamageBonusAmount || 0);
  if (state.status.firstAttackDamageBonusUsed) return amount;
  const bonus = sumCharacterEffects(state, index, "first_attack_damage_bonus_each_battle", "amount");
  if (bonus <= 0) return amount;
  state.status.firstAttackDamageBonusUsed = true;
  state.status.firstAttackDamageBonusCardId = card.id;
  state.status.firstAttackDamageBonusAmount = bonus;
  addLog(state, `패시브: 첫 공격 피해 +${bonus}`);
  return amount + bonus;
}

export function afterPlayerDamagedModifiers(state, index, damage) {
  if (!index || damage <= 0 || state.status.characterLowHpHealUsed) return;
  for (const effect of characterEffects(state, index, "heal_once_when_hp_ratio_below")) {
    if (state.player.hp / state.player.maxHp > effect.ratio) continue;
    state.status.characterLowHpHealUsed = true;
    healPlayerFromModifier(state, index, effect.amount, "패시브");
    return;
  }
}

export function afterCombatCompleteModifiers(state, index, source = "combat") {
  for (const effect of relicEffects(state, index, "heal_after_combat")) {
    healPlayerFromModifier(state, index, effect.amount, "민트 보온병");
  }
  if (source === "elite") {
    const eliteGold = sumCharacterEffects(state, index, "bonus_gold_after_elite", "amount");
    if (eliteGold > 0) {
      state.player.gold += eliteGold;
      addLog(state, `정예 보너스: 별사탕 ${eliteGold} 획득`);
    }
  }
  if ((state.status.damageTakenThisCombat || 0) === 0) {
    for (const effect of relicEffects(state, index, "gain_gold_on_perfect")) {
      state.player.gold += effect.amount;
      addLog(state, `반짝 접시: 별사탕 ${effect.amount} 획득`);
    }
  }
}

export function cardRewardOptionCount(state, index, source, baseCount) {
  let count = baseCount + (state.status.nextCardRewardBonus || 0);
  count += sumRelicEffects(state, index, "increase_card_reward_options", "amount");
  count += sumMetaEffects(state, index, "upgrade_choice_bonus_at_rank", "amount");
  if (source === "elite") count += sumRelicEffects(state, index, "add_card_after_elite", "amount");
  if (source === "boss") count += sumRelicEffects(state, index, "boss_reward_bonus", "amount");
  state.status.nextCardRewardBonus = 0;
  return Math.max(1, count);
}

export function gemRewardOptionCount(state, index, source, baseCount) {
  let count = baseCount + sumRelicEffects(state, index, "increase_gem_reward_options", "amount");
  if (source === "boss") count += sumRelicEffects(state, index, "boss_reward_bonus", "amount");
  return Math.max(0, count);
}

export function rewardRerolls(state, index, source) {
  const base = source === "boss" ? 2 : 1;
  return base + sumRelicEffects(state, index, "reroll_reward_free", "amount");
}

export function modifiedGoldReward(state, index, amount) {
  const percent = sumRelicEffects(state, index, "modify_gold_reward_percent", "amount");
  return Math.ceil(amount * (1 + percent / 100));
}

export function adjustedRewardCost(state, index, cost = {}, context = {}) {
  const adjusted = { ...cost };
  if (!adjusted.gold) return adjusted;
  let discount = 0;
  if (context.source === "shop") discount += sumRelicEffects(state, index, "reduce_shop_prices_percent", "amount");
  if (context.type === "gem" || context.reward?.gemPool) discount += sumArcanaEffects(state, index, "reduce_gem_cost_percent", "amount");
  if (discount > 0) adjusted.gold = Math.max(0, Math.ceil(adjusted.gold * (1 - discount / 100)));
  return adjusted;
}

export function shouldAddCombatGemReward(state, index) {
  const chance = BALANCE.rewards.combatGemChancePercent
    + sumArcanaEffects(state, index, "modify_gem_reward_chance_percent", "amount")
    + sumMetaEffects(state, index, "gem_reward_chance_per_rank", "amount");
  return state.rng.next() * 100 < chance;
}

export function upgradedFirstCardReward(state, index, optionIndex) {
  return optionIndex === 0 && hasRelicEffect(state, index, "upgrade_first_card_reward");
}

function consumeFirstExpensiveCardFree(state, index, card) {
  if (!state.status.firstExpensiveCardFreeAvailable) return;
  const matched = relicEffects(state, index, "first_expensive_card_free_each_battle")
    .some((effect) => card.cost >= (effect.minCost || 1));
  if (matched) {
    state.status.firstExpensiveCardFreeAvailable = false;
    addLog(state, "햇살 쿠키: 첫 고비용 카드 무료");
  }
}

function applyCostLadderArcana(state, index, cost) {
  for (const effect of arcanaEffects(state, index, "enable_cost_ladder_chain")) {
    const progress = state.status.costLadderProgress || 0;
    const expected = effect.steps[progress];
    if (cost === expected) {
      state.status.costLadderProgress = progress + 1;
      if (state.status.costLadderProgress >= effect.steps.length) {
        state.status.chain = (state.status.chain || 0) + effect.steps.length;
        state.metrics.maxChain = Math.max(state.metrics.maxChain, state.status.chain);
        state.status.costLadderProgress = 0;
        addLog(state, `소풍 리듬: 연쇄 +${effect.steps.length}`);
      }
    } else {
      state.status.costLadderProgress = cost === effect.steps[0] ? 1 : 0;
    }
  }
}

function applyColorArcana(state, index, card) {
  const colors = new Set(state.status.colorsPlayedThisTurn || []);
  colors.add(card.color);
  state.status.colorsPlayedThisTurn = [...colors];
  for (const effect of arcanaEffects(state, index, "draw_on_four_colors")) {
    if (colors.size >= 4 && !state.status.prismPathTriggeredThisTurn) {
      drawCards(state, effect.amount);
      state.status.prismPathTriggeredThisTurn = true;
      addLog(state, `프리즘 산책길: 카드 ${effect.amount}장 뽑기`);
    }
  }
}

function applyBattleRules(state, index, card) {
  const rules = (state.battleRules || []).filter((rule) => rule.rule === "shield_on_color_play" && rule.color === card.color);
  for (const rule of rules) {
    const amount = rule.amount || 0;
    if (amount <= 0) continue;
    state.player.shield += amount;
    state.status.battleRuleTriggers = (state.status.battleRuleTriggers || 0) + 1;
    const sourceName = index.cards.get(rule.sourceCardId)?.name || "약속";
    addLog(state, `${sourceName}: ${card.name} 보호막 ${amount}`);
  }
}

function applyCharacterCardPassives(state, index) {
  for (const effect of characterEffects(state, index, "draw_when_cards_played")) {
    if (state.metrics.cardsPlayedThisTurn === effect.threshold) {
      drawCards(state, effect.amount);
      addLog(state, `패시브: 카드 ${effect.amount}장 뽑기`);
    }
  }
  for (const effect of characterEffects(state, index, "gain_energy_on_chain")) {
    if ((state.status.chain || 0) >= effect.threshold && !state.status.characterChainEnergyTriggeredThisTurn) {
      state.player.energy = Math.min(state.player.maxEnergy + 3, state.player.energy + effect.amount);
      state.status.characterChainEnergyTriggeredThisTurn = true;
      addLog(state, `패시브: 기운 +${effect.amount}`);
    }
  }
}

function healPlayerFromModifier(state, index, amount, sourceName) {
  const before = state.player.hp;
  state.player.hp = Math.min(state.player.maxHp, state.player.hp + amount);
  const healed = state.player.hp - before;
  if (healed > 0) {
    addLog(state, `${sourceName}: 체력 ${healed} 회복`);
    afterPlayerHealed(state, index, healed);
  }
}

function dealDirectDamage(state, index, enemy, amount, sourceName, context) {
  if (!enemy || amount <= 0) return false;
  let incoming = amount;
  const blocked = Math.min(enemy.block || 0, incoming);
  enemy.block = Math.max(0, (enemy.block || 0) - blocked);
  incoming -= blocked;
  enemy.hp = Math.max(0, enemy.hp - incoming);
  if (incoming > 0) addLog(state, `${sourceName}: ${enemy.name}에게 피해 ${incoming}`);
  if (enemy.hp > 0) return false;
  if (context) context.killedThisPlay = true;
  if (context) {
    context.killedEnemyIds = context.killedEnemyIds || [];
    context.killedEnemyIds.push(enemy.id);
    context.killedEnemyRanks = context.killedEnemyRanks || [];
    context.killedEnemyRanks.push(enemy.rank);
  }
  state.metrics.enemiesDefeated += 1;
  state.metrics.defeatedEnemyCounts = state.metrics.defeatedEnemyCounts || {};
  state.metrics.defeatedEnemyCounts[enemy.id] = (state.metrics.defeatedEnemyCounts[enemy.id] || 0) + 1;
  if (enemy.rank === "elite") state.metrics.elitesDefeated += 1;
  state.enemies = state.enemies.filter((target) => target.instanceId !== enemy.instanceId);
  return true;
}

function applyEnemyStatus(enemy, status, amount) {
  if (!enemy) return;
  enemy.status = enemy.status || {};
  enemy.status[status] = (enemy.status[status] || 0) + amount;
}

function hasRelicEffect(state, index, op) {
  return relicEffects(state, index, op).length > 0;
}

function characterEffects(state, index, op) {
  const character = index.characters.get(state.characterId);
  return (character?.passiveEffects || []).filter((effect) => effect.op === op);
}

function sumCharacterEffects(state, index, op, key) {
  return characterEffects(state, index, op).reduce((sum, effect) => sum + (effect[key] || 0), 0);
}

function relicEffects(state, index, op) {
  ensureModifierState(state);
  return state.inventory.relics
    .map((id) => index.relics.get(id))
    .filter(Boolean)
    .flatMap((relic) => relic.effects || [])
    .filter((effect) => effect.op === op);
}

function arcanaEffects(state, index, op) {
  ensureModifierState(state);
  return state.inventory.arcanas
    .map((id) => index.arcanas.get(id))
    .filter(Boolean)
    .flatMap((arcana) => arcana.effects || [])
    .filter((effect) => effect.op === op);
}

function sumRelicEffects(state, index, op, key) {
  return relicEffects(state, index, op).reduce((sum, effect) => sum + (effect[key] || 0), 0);
}

function sumArcanaEffects(state, index, op, key) {
  return arcanaEffects(state, index, op).reduce((sum, effect) => sum + (effect[key] || 0), 0);
}

function sumMetaEffects(state, index, op, key) {
  return metaEffects(state, index, op).reduce((sum, effect) => sum + metaEffectValue(effect, key), 0);
}

function metaEffects(state, index, op) {
  ensureModifierState(state);
  return index.data.metaUpgrades
    .flatMap((upgrade) => {
      const rank = metaUpgradeRank(state, index, upgrade.id);
      if (rank <= 0) return [];
      return (upgrade.effects || [])
        .filter((effect) => effect.op === op && (!effect.rank || rank >= effect.rank))
        .map((effect) => ({ ...effect, rank }));
    });
}

function metaUpgradeRank(state, index, metaId) {
  const upgrade = index.metaUpgrades.get(metaId);
  const maxRank = upgrade?.maxRank || 1;
  const achievementRank = index.data.achievements
    .filter((achievement) => achievement.reward?.metaUpgradeId === metaId && state.inventory.achievements?.includes(achievement.id))
    .length;
  const fallbackRank = state.inventory.metaUpgrades?.includes(metaId) ? 1 : 0;
  return Math.min(maxRank, Math.max(achievementRank, fallbackRank));
}

function metaEffectValue(effect, key) {
  const value = effect[key] || 0;
  return effect.op.endsWith("_per_rank") ? value * effect.rank : value;
}
