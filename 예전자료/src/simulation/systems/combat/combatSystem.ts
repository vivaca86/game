import type { BossData, CardData, EnemyData, GameDataBundle, GameEffect } from "../../../data/schema";
import {
  applyAfterCardPlayedPassives,
  applyAfterPlayerHealedPassives,
  applyCombatStartPassives,
  applyCombatVictoryPassives,
  applyTurnEndRetainPassive,
  consumePassiveCardCostAdjustment,
  getCarriedBlockForNextTurn,
  getPassiveAdjustedCardCost
} from "../passives/passiveSystem";
import { prepareRewardOffer } from "../rewards/rewardSystem";
import {
  getAttachedRuneEffects,
  getAttachedRuneModifiedAmount,
  getAttachedRuneModifiedCost
} from "../runes/runeSystem";
import type { SliceCombatState } from "../../state/combatState";
import {
  getCard,
  getCurrentRoom,
  getEncounterPoolContentId,
  getStage,
  pushRunLog,
  resetCombatHand,
  type SliceRunState
} from "../../state/runState";

type CombatantData = EnemyData | BossData;
interface ApplyCardEffectOptions {
  skipAttachedRuneModifiers?: boolean;
}

export function startCombatForCurrentRoom(run: SliceRunState, bundle: GameDataBundle): void {
  const room = getCurrentRoom(bundle, run);
  const isBoss = room?.type === "boss";
  const encounterContentId = getEncounterPoolContentId(bundle, room?.encounterPoolId, isBoss ? "boss" : "combat");
  const combatant = isBoss
    ? bundle.bosses.find((boss) => boss.id === encounterContentId)
      ?? bundle.bosses.find((boss) => boss.id === getStage(bundle, run)?.bossId)
      ?? bundle.bosses[0]
    : bundle.enemies.find((enemy) => enemy.id === encounterContentId) ?? bundle.enemies[0];

  if (!combatant) {
    pushRunLog(run, "combat:start:missing");
    return;
  }

  beginCombat(run, combatant, isBoss ? "boss" : "enemy");
  applyCombatStartPassives(run, bundle);
  pushRunLog(run, `combat:start:${combatant.id}`);
}

export function startCombatWithEnemyId(run: SliceRunState, bundle: GameDataBundle, enemyId: string): void {
  const enemy = bundle.enemies.find((item) => item.id === enemyId) ?? bundle.enemies[0];
  if (!enemy) {
    pushRunLog(run, `combat:event_missing:${enemyId}`);
    return;
  }

  beginCombat(run, enemy, "enemy");
  applyCombatStartPassives(run, bundle);
  pushRunLog(run, `combat:event_start:${enemy.id}`);
}

function beginCombat(run: SliceRunState, combatant: CombatantData, enemyKind: SliceCombatState["enemyKind"]): void {
  run.phase = enemyKind === "boss" ? "boss" : "combat";
  run.combat = createCombatState(combatant, enemyKind);
  run.player.energy = run.player.maxEnergy;
  run.player.block = 0;
  run.chainCount = 0;
  run.nextCardDiscount = 0;
  run.nextCardCostPenalty = 0;
  run.nextDamageReduction = 0;
  run.battleRules = [];
  run.previousCardId = undefined;
  run.reflectRatio = 0;
  run.firstExpensiveCardFreeAvailable = true;
  run.guardCardsPlayedThisCombat = 0;
  run.colorsPlayedThisTurn = [];
  run.prismPathTriggeredThisTurn = false;
  run.playerMark = 0;
  run.playerWeak = 0;
  resetCombatHand(run);
}

export function playCardAtIndex(run: SliceRunState, bundle: GameDataBundle, index: number): void {
  if (!run.combat || (run.phase !== "combat" && run.phase !== "boss")) return;

  const cardId = run.hand[index];
  const card = cardId ? getCard(bundle, cardId) : undefined;
  if (!card) {
    pushRunLog(run, `card:missing:${index + 1}`);
    return;
  }

  const baseCost = getAttachedRuneModifiedCost(
    run,
    bundle,
    card.id,
    Math.max(0, card.cost - run.nextCardDiscount + run.nextCardCostPenalty)
  );
  const passiveCost = getPassiveAdjustedCardCost(run, bundle, card, baseCost);
  const cost = passiveCost.cost;
  if (run.player.energy < cost) {
    pushRunLog(run, `card:blocked_energy:${card.id}:${cost}`);
    return;
  }

  run.player.energy -= cost;
  run.nextCardDiscount = 0;
  run.nextCardCostPenalty = 0;
  consumePassiveCardCostAdjustment(run, passiveCost);
  run.hand.splice(index, 1);
  run.chainCount += 1;
  applyBattleRulesForPlayedCard(run, card);
  pushRunLog(run, `card:play:${card.id}:cost=${cost}`);

  for (const effect of card.effects) {
    if (effect.timing === "on_play") {
      applyCardEffect(run, bundle, card.id, effect);
    }
  }
  applyAttachedRuneAfterCardPlayed(run, bundle, card);
  applyAfterCardPlayedPassives(run, bundle, card, cost, {
    dealDamage: (amount) => dealDamageToEnemy(run, amount, bundle),
    drawCards: (amount) => drawCards(run, amount)
  });

  if (card.effects.some((effect) => effect.op === "exhaust_self")) {
    pushRunLog(run, `card:exhaust:${card.id}`);
  } else {
    run.discard.push(card.id);
  }
  run.previousCardId = card.id;
  if (run.combat.enemyHp <= 0) {
    handleCombatVictory(run, bundle);
  }
}

export function getCombatCardCostAtIndex(
  run: SliceRunState,
  bundle: GameDataBundle,
  index: number
): number | undefined {
  if (!run.combat || (run.phase !== "combat" && run.phase !== "boss")) return undefined;

  const cardId = run.hand[index];
  const card = cardId ? getCard(bundle, cardId) : undefined;
  if (!card) return undefined;

  const baseCost = getAttachedRuneModifiedCost(
    run,
    bundle,
    card.id,
    Math.max(0, card.cost - run.nextCardDiscount + run.nextCardCostPenalty)
  );
  return getPassiveAdjustedCardCost(run, bundle, card, baseCost).cost;
}

export function canPlayCardAtIndex(
  run: SliceRunState,
  bundle: GameDataBundle,
  index: number
): boolean {
  const cost = getCombatCardCostAtIndex(run, bundle, index);
  return cost !== undefined && run.player.energy >= cost;
}

export function endTurn(run: SliceRunState, bundle: GameDataBundle): void {
  if (!run.combat || (run.phase !== "combat" && run.phase !== "boss")) return;
  if (run.combat.defeated) return;

  applyTurnEndRetainPassive(run, bundle);
  applyEnemyIntent(run, bundle);
  if (run.player.hp <= 0) {
    return;
  }
  run.player.block = getCarriedBlockForNextTurn(run, bundle, run.player.block);
  run.player.energy = run.player.maxEnergy;
  run.chainCount = 0;
  run.colorsPlayedThisTurn = [];
  run.prismPathTriggeredThisTurn = false;
  run.combat.intentIndex += 1;
  run.combat.turn += 1;
  drawCards(run, Math.max(0, 5 - run.hand.length));
  pushRunLog(run, `turn:start:${run.combat.turn}`);
}

export function getCombatantData(
  run: SliceRunState,
  bundle: GameDataBundle
): CombatantData | undefined {
  if (!run.combat) return undefined;
  return run.combat.enemyKind === "boss"
    ? bundle.bosses.find((boss) => boss.id === run.combat?.enemyId)
    : bundle.enemies.find((enemy) => enemy.id === run.combat?.enemyId);
}

export function getActiveIntent(run: SliceRunState, bundle: GameDataBundle) {
  const combatant = getCombatantData(run, bundle);
  if (!combatant || combatant.intents.length === 0 || !run.combat) return undefined;
  return combatant.intents[run.combat.intentIndex % combatant.intents.length];
}

function createCombatState(combatant: CombatantData, enemyKind: SliceCombatState["enemyKind"]): SliceCombatState {
  return {
    enemyId: combatant.id,
    enemyKind,
    enemyHp: combatant.maxHp,
    enemyMaxHp: combatant.maxHp,
    enemyBlock: combatant.block ?? 0,
    enemyMark: 0,
    intentIndex: 0,
    turn: 1,
    defeated: false,
    bossPhaseTriggered: false,
    pendingAttackBonus: 0
  };
}

function applyCardEffect(
  run: SliceRunState,
  bundle: GameDataBundle,
  cardId: string,
  effect: GameEffect,
  options: ApplyCardEffectOptions = {}
): void {
  const amount = effect.value.amount ?? 0;

  if (effect.op === "deal_damage" || effect.op === "damage_front" || effect.op === "damage_all") {
    dealDamageToEnemy(
      run,
      options.skipAttachedRuneModifiers
        ? amount
        : getAttachedRuneModifiedAmount(run, bundle, cardId, amount, "damage"),
      bundle
    );
  } else if (effect.op === "damage_random") {
    const hits = Math.max(1, effect.value.duration ?? 1);
    dealDamageToEnemy(
      run,
      (options.skipAttachedRuneModifiers
        ? amount
        : getAttachedRuneModifiedAmount(run, bundle, cardId, amount, "damage")) * hits,
      bundle
    );
  } else if (effect.op === "conditional_bonus_damage") {
    if (effect.condition === "chain_count >= 3" && run.chainCount >= 3) {
      dealDamageToEnemy(
        run,
        options.skipAttachedRuneModifiers
          ? amount
          : getAttachedRuneModifiedAmount(run, bundle, cardId, amount, "damage"),
        bundle
      );
    }
  } else if (effect.op === "damage_bonus_if_cards_played_at_least" || effect.op === "damage_bonus_if_chain_at_least") {
    const threshold = effect.value.duration ?? readConditionThreshold(effect.condition);
    if (run.chainCount >= threshold) {
      dealDamageToEnemy(
        run,
        options.skipAttachedRuneModifiers
          ? amount
          : getAttachedRuneModifiedAmount(run, bundle, cardId, amount, "damage"),
        bundle
      );
    }
  } else if (effect.op === "damage_bonus_vs_marked") {
    if (run.combat && run.combat.enemyMark > 0) {
      dealDamageToEnemy(
        run,
        options.skipAttachedRuneModifiers
          ? amount
          : getAttachedRuneModifiedAmount(run, bundle, cardId, amount, "damage"),
        bundle
      );
    }
  } else if (effect.op === "damage_bonus_if_hand_at_most") {
    const threshold = effect.value.duration ?? readConditionThreshold(effect.condition);
    if (run.hand.length <= threshold) {
      dealDamageToEnemy(
        run,
        options.skipAttachedRuneModifiers
          ? amount
          : getAttachedRuneModifiedAmount(run, bundle, cardId, amount, "damage"),
        bundle
      );
    }
  } else if (effect.op === "gain_block") {
    const block = options.skipAttachedRuneModifiers
      ? amount
      : getAttachedRuneModifiedAmount(run, bundle, cardId, amount, "block");
    run.player.block += block;
    pushRunLog(run, `player:block:+${block}`);
  } else if (effect.op === "gain_shield") {
    const block = options.skipAttachedRuneModifiers
      ? amount
      : getAttachedRuneModifiedAmount(run, bundle, cardId, amount, "block");
    run.player.block += block;
    pushRunLog(run, `player:block:+${block}`);
  } else if (effect.op === "apply_mark") {
    if (!run.combat) return;
    run.combat.enemyMark += amount;
    pushRunLog(run, `enemy:mark:+${amount}`);
  } else if (effect.op === "draw_cards") {
    drawCards(run, amount);
  } else if (effect.op === "draw") {
    drawCards(run, amount);
  } else if (effect.op === "draw_if_kill") {
    if (run.combat && run.combat.enemyHp <= 0) {
      drawCards(run, amount);
    }
  } else if (effect.op === "discount_next_card") {
    run.nextCardDiscount += amount;
    pushRunLog(run, `card:discount_next:${amount}`);
  } else if (effect.op === "increase_next_card_cost") {
    run.nextCardCostPenalty += amount;
    pushRunLog(run, `card:cost_penalty_next:${amount}`);
  } else if (effect.op === "gain_energy") {
    const before = run.player.energy;
    run.player.energy = Math.min(run.player.maxEnergy + amount, run.player.energy + amount);
    pushRunLog(run, `player:energy:+${run.player.energy - before}`);
  } else if (effect.op === "lose_energy") {
    const before = run.player.energy;
    run.player.energy = Math.max(0, run.player.energy - amount);
    pushRunLog(run, `player:energy:-${before - run.player.energy}`);
  } else if (effect.op === "heal") {
    const before = run.player.hp;
    run.player.hp = Math.min(run.player.maxHp, run.player.hp + amount);
    const healed = run.player.hp - before;
    pushRunLog(run, `player:heal:${healed}`);
    applyAfterPlayerHealedPassives(run, bundle, healed);
  } else if (effect.op === "heal_if_hp_ratio_below") {
    const threshold = effect.value.percent ?? effect.value.duration ?? 0.5;
    if (run.player.hp / run.player.maxHp <= threshold) {
      const before = run.player.hp;
      run.player.hp = Math.min(run.player.maxHp, run.player.hp + amount);
      const healed = run.player.hp - before;
      pushRunLog(run, `player:heal:${healed}`);
      applyAfterPlayerHealedPassives(run, bundle, healed);
    }
  } else if (effect.op === "reduce_next_damage") {
    run.nextDamageReduction += amount;
    pushRunLog(run, `player:reduce_next_damage:${amount}`);
  } else if (effect.op === "reduce_next_attack" || effect.op === "retain_shield_next_turn") {
    run.nextDamageReduction += amount;
    pushRunLog(run, `player:reduce_next_damage:${amount}`);
  } else if (effect.op === "increase_next_card_reward_options") {
    run.nextRewardBonus += amount;
    pushRunLog(run, `reward:bonus_options:${amount}`);
  } else if (effect.op === "prepare_socket_bonus") {
    run.nextRewardBonus += amount;
    pushRunLog(run, `reward:socket_bonus:${amount}`);
  } else if (effect.op === "add_battle_rule") {
    addBattleRule(run, bundle, cardId, effect);
  } else if (effect.op === "repeat_previous_basic_effect") {
    repeatPreviousBasicEffect(run, bundle, cardId);
  } else if (effect.op === "repeat_previous_basic_effect_if_cost_at_most") {
    repeatPreviousBasicEffect(run, bundle, cardId, effect.value.duration);
  } else if (effect.op === "enable_reflect_damage") {
    run.reflectRatio = Math.max(run.reflectRatio, effect.value.percent ?? 0);
    pushRunLog(run, `player:reflect:${run.reflectRatio}`);
  } else if (effect.op === "reset_chain") {
    run.chainCount = 0;
    pushRunLog(run, "chain:reset");
  } else if (effect.op === "exhaust_self") {
    pushRunLog(run, `effect:exhaust_self:${cardId}`);
  } else {
    pushRunLog(run, `effect:unhandled:${effect.op}`);
  }
}

function addBattleRule(run: SliceRunState, bundle: GameDataBundle, cardId: string, effect: GameEffect): void {
  const [rule, colorKey] = (effect.condition ?? "shield_on_color_play").split(":");
  const amount = effect.value.amount ?? 0;
  run.battleRules.push({
    rule,
    colorKey,
    amount,
    sourceCardId: cardId
  });
  pushRunLog(run, `battle_rule:add:${rule}:${colorKey ?? "any"}:${amount}`);

  const card = getCard(bundle, cardId);
  if (!colorKey || card?.colorKey === colorKey) {
    run.player.block += amount;
    pushRunLog(run, `battle_rule:block:+${amount}`);
  }
}

function applyBattleRulesForPlayedCard(run: SliceRunState, card: CardData): void {
  for (const rule of run.battleRules) {
    if (rule.rule !== "shield_on_color_play") continue;
    if (rule.colorKey && card.colorKey !== rule.colorKey) continue;
    run.player.block += rule.amount;
    pushRunLog(run, `battle_rule:block:+${rule.amount}`);
  }
}

function repeatPreviousBasicEffect(
  run: SliceRunState,
  bundle: GameDataBundle,
  currentCardId: string,
  maxCost = Number.POSITIVE_INFINITY
): void {
  if (!run.previousCardId || run.previousCardId === currentCardId) {
    pushRunLog(run, "repeat:none");
    return;
  }

  const previousCard = getCard(bundle, run.previousCardId);
  if (!previousCard || previousCard.cost > maxCost) {
    pushRunLog(run, "repeat:blocked");
    return;
  }

  for (const effect of previousCard.effects) {
    if (effect.op === "exhaust_self" || effect.op.startsWith("repeat_")) continue;
    applyCardEffect(run, bundle, previousCard.id, effect);
  }
  pushRunLog(run, `repeat:${previousCard.id}`);
}

function applyAttachedRuneAfterCardPlayed(run: SliceRunState, bundle: GameDataBundle, card: CardData): void {
  for (const effect of getAttachedRuneEffects(run, bundle, card.id, "heal_on_play")) {
    const amount = effect.value.amount ?? 0;
    const before = run.player.hp;
    run.player.hp = Math.min(run.player.maxHp, run.player.hp + amount);
    const healed = run.player.hp - before;
    pushRunLog(run, `rune:heal:${healed}`);
    applyAfterPlayerHealedPassives(run, bundle, healed);
  }

  for (const effect of getAttachedRuneEffects(run, bundle, card.id, "apply_mark_on_play")) {
    if (!run.combat) continue;
    const amount = effect.value.amount ?? 0;
    run.combat.enemyMark += amount;
    pushRunLog(run, `rune:mark:+${amount}`);
  }

  for (const effect of getAttachedRuneEffects(run, bundle, card.id, "bridge_next_color_bonus")) {
    const amount = effect.value.amount ?? 0;
    run.nextCardDiscount += amount;
    pushRunLog(run, `rune:bridge_discount:${amount}`);
  }

  for (const effect of getAttachedRuneEffects(run, bundle, card.id, "preserve_chain")) {
    pushRunLog(run, `rune:preserve_chain:${effect.op}`);
  }

  for (const effect of getAttachedRuneEffects(run, bundle, card.id, "echo_basic_effect")) {
    const ratio = effect.value.percent ?? 0;
    const echoedEffects = card.effects
      .filter((cardEffect) => !cardEffect.op.startsWith("repeat_") && cardEffect.op !== "exhaust_self")
      .map((cardEffect) => scaledEffect(cardEffect, ratio));
    for (const echoedEffect of echoedEffects) {
      applyCardEffect(run, bundle, card.id, echoedEffect, { skipAttachedRuneModifiers: true });
    }
    pushRunLog(run, `rune:echo:${ratio}`);
  }
}

function scaledEffect(effect: GameEffect, ratio: number): GameEffect {
  const amount = effect.value.amount;
  return {
    ...effect,
    value: {
      ...effect.value,
      amount: typeof amount === "number" ? Math.max(1, Math.ceil(amount * ratio)) : amount
    }
  };
}

function readConditionThreshold(condition: string | undefined): number {
  const match = condition?.match(/>=\s*(\d+)/);
  return match ? Number(match[1]) : 0;
}

function dealDamageToEnemy(run: SliceRunState, amount: number, bundle: GameDataBundle): void {
  if (!run.combat) return;
  const weakenedAmount = run.playerWeak > 0 ? Math.max(1, Math.ceil(amount * 0.75)) : amount;
  if (run.playerWeak > 0) {
    run.playerWeak = Math.max(0, run.playerWeak - 1);
    pushRunLog(run, `player:weak_damage:${amount}->${weakenedAmount}`);
  }
  const markBonus = run.combat.enemyMark > 0 ? run.combat.enemyMark : 0;
  const incoming = weakenedAmount + markBonus;
  if (markBonus > 0) {
    run.combat.enemyMark = 0;
    pushRunLog(run, `enemy:mark_bonus:${markBonus}`);
  }

  const blocked = Math.min(run.combat.enemyBlock, incoming);
  run.combat.enemyBlock -= blocked;
  const hpDamage = Math.max(0, incoming - blocked);
  run.combat.enemyHp = Math.max(0, run.combat.enemyHp - hpDamage);
  pushRunLog(run, `enemy:damage:${hpDamage}:hp=${run.combat.enemyHp}`);
  triggerBossPhaseIfNeeded(run, bundle);
}

function drawCards(run: SliceRunState, amount: number): void {
  for (let i = 0; i < amount; i += 1) {
    if (run.drawPile.length === 0 && run.discard.length > 0) {
      run.drawPile = [...run.discard];
      run.discard = [];
      pushRunLog(run, "deck:reshuffle");
    }

    const drawn = run.drawPile.shift();
    if (!drawn) {
      pushRunLog(run, "draw:none");
      return;
    }

    run.hand.push(drawn);
    pushRunLog(run, `draw:${drawn}`);
  }
}

function applyEnemyIntent(run: SliceRunState, bundle: GameDataBundle): void {
  if (!run.combat) return;
  const intent = getActiveIntent(run, bundle);
  if (!intent) {
    pushRunLog(run, "intent:none");
    return;
  }

  for (const effect of intent.effects) {
    const amount = effect.value.amount ?? 0;
    if (effect.op === "deal_damage_to_player") {
      const attack = amount + run.combat.pendingAttackBonus;
      run.combat.pendingAttackBonus = 0;
      dealDamageToPlayer(run, attack, bundle);
    } else if (effect.op === "gain_enemy_block") {
      run.combat.enemyBlock += amount;
      pushRunLog(run, `enemy:block:+${amount}`);
    } else if (effect.op === "increase_next_card_cost") {
      run.nextCardCostPenalty += amount;
      pushRunLog(run, `card:cost_penalty_next:${amount}`);
    } else if (effect.op === "apply_player_mark") {
      run.playerMark += amount;
      pushRunLog(run, `player:mark:+${amount}`);
    } else if (effect.op === "apply_player_weak") {
      run.playerWeak += amount;
      pushRunLog(run, `player:weak:+${amount}`);
    } else if (effect.op === "add_temp_card_to_discard") {
      const cardId = effect.condition ?? "card_temp_dust";
      for (let count = 0; count < Math.max(1, amount); count += 1) {
        run.discard.push(cardId);
      }
      pushRunLog(run, `enemy:add_temp:${cardId}:${Math.max(1, amount)}`);
    } else if (effect.op === "heal_enemy") {
      const before = run.combat.enemyHp;
      run.combat.enemyHp = Math.min(run.combat.enemyMaxHp, run.combat.enemyHp + amount);
      pushRunLog(run, `enemy:heal:${run.combat.enemyHp - before}`);
    } else if (effect.op === "deal_piercing_damage_to_player") {
      dealPiercingDamageToPlayer(run, amount);
    } else if (effect.op === "reduce_player_chain") {
      run.chainCount = Math.max(0, run.chainCount - amount);
      pushRunLog(run, `player:chain:-${amount}`);
    } else if (effect.op === "summon_enemy") {
      pushRunLog(run, `enemy:summon:${effect.condition ?? "none"}`);
    } else {
      pushRunLog(run, `intent:unhandled:${effect.op}`);
    }
  }
}

function dealDamageToPlayer(run: SliceRunState, amount: number, bundle: GameDataBundle): void {
  const markBonus = run.playerMark > 0 ? Math.ceil(amount * Math.min(0.5, run.playerMark * 0.15)) : 0;
  if (markBonus > 0) {
    run.playerMark = Math.max(0, run.playerMark - 1);
    pushRunLog(run, `player:mark_bonus:${markBonus}`);
  }
  const reduced = Math.max(0, amount + markBonus - run.nextDamageReduction);
  run.nextDamageReduction = 0;
  const blocked = Math.min(run.player.block, reduced);
  run.player.block -= blocked;
  const hpDamage = Math.max(0, reduced - blocked);
  run.player.hp = Math.max(0, run.player.hp - hpDamage);
  pushRunLog(run, `player:damage:${hpDamage}:hp=${run.player.hp}`);

  if (run.reflectRatio > 0 && hpDamage > 0) {
    const reflected = Math.max(1, Math.ceil(hpDamage * run.reflectRatio));
    run.reflectRatio = 0;
    dealDamageToEnemy(run, reflected, bundle);
    pushRunLog(run, `player:reflect_damage:${reflected}`);
  }

  if (run.player.hp <= 0) {
    handlePlayerDefeat(run);
  }
}

function dealPiercingDamageToPlayer(run: SliceRunState, amount: number): void {
  run.player.hp = Math.max(0, run.player.hp - amount);
  pushRunLog(run, `player:piercing_damage:${amount}:hp=${run.player.hp}`);
  if (run.player.hp <= 0) {
    handlePlayerDefeat(run);
  }
}

function triggerBossPhaseIfNeeded(run: SliceRunState, bundle: GameDataBundle): void {
  if (!run.combat || run.combat.enemyKind !== "boss" || run.combat.bossPhaseTriggered) return;
  const boss = bundle.bosses.find((item) => item.id === run.combat?.enemyId);
  const phase = boss?.phases.find((item) => run.combat && run.combat.enemyHp / run.combat.enemyMaxHp <= item.hpRatioAtOrBelow);
  if (!phase) return;

  run.combat.bossPhaseTriggered = true;
  for (const effect of phase.effects) {
    if (effect.op === "boss_next_attack_bonus") {
      run.combat.pendingAttackBonus += effect.value.amount ?? 0;
    }
  }
  pushRunLog(run, `boss:phase:${phase.id}`);
}

function handleCombatVictory(run: SliceRunState, bundle: GameDataBundle): void {
  if (!run.combat) return;
  run.combat.defeated = true;
  applyCombatVictoryPassives(run, bundle);

  if (run.combat.enemyKind === "boss") {
    const stageId = run.stageId;
    if (!run.completedStages.includes(stageId)) run.completedStages.push(stageId);
    const room = getCurrentRoom(bundle, run);
    run.rewardSourceRoomIndex = run.roomIndex;
    run.phase = "reward";
    prepareRewardOffer(run, bundle, room?.rewardPoolId, 3);
    pushRunLog(run, `combat:victory_boss:${run.combat.enemyId}`);
    return;
  }

  const room = getCurrentRoom(bundle, run);
  run.rewardSourceRoomIndex = run.roomIndex;
  run.phase = "reward";
  prepareRewardOffer(run, bundle, room?.rewardPoolId, 3);
  pushRunLog(run, `combat:victory:${run.combat.enemyId}`);
}

function handlePlayerDefeat(run: SliceRunState): void {
  const enemyId = run.combat?.enemyId ?? "unknown";
  if (run.combat) {
    run.combat.defeated = true;
  }
  run.phase = "result";
  run.rewardPoolId = undefined;
  run.offeredRewards = [];
  run.rewardSourceRoomIndex = undefined;
  pushRunLog(run, `combat:defeat:${enemyId}`);
}
