import type { BossData, EnemyData, GameDataBundle, GameEffect } from "../../../data/schema";
import { prepareRewardOffer } from "../rewards/rewardSystem";
import { getAttachedRuneBonus } from "../runes/runeSystem";
import type { SliceCombatState } from "../../state/combatState";
import {
  getCard,
  getCurrentRoom,
  getStage,
  pushRunLog,
  resetCombatHand,
  type SliceRunState
} from "../../state/runState";

type CombatantData = EnemyData | BossData;

export function startCombatForCurrentRoom(run: SliceRunState, bundle: GameDataBundle): void {
  const room = getCurrentRoom(bundle, run);
  const isBoss = room?.type === "boss";
  const combatant = isBoss
    ? bundle.bosses.find((boss) => boss.id === room?.encounterPoolId)
      ?? bundle.bosses.find((boss) => boss.id === getStage(bundle, run)?.bossId)
      ?? bundle.bosses[0]
    : bundle.enemies.find((enemy) => enemy.id === room?.encounterPoolId) ?? bundle.enemies[0];

  if (!combatant) {
    pushRunLog(run, "combat:start:missing");
    return;
  }

  run.phase = isBoss ? "boss" : "combat";
  run.combat = createCombatState(combatant, isBoss ? "boss" : "enemy");
  run.player.energy = run.player.maxEnergy;
  run.player.block = 0;
  run.chainCount = 0;
  run.nextCardDiscount = 0;
  run.nextCardCostPenalty = 0;
  run.nextDamageReduction = 0;
  resetCombatHand(run);
  pushRunLog(run, `combat:start:${combatant.id}`);
}

export function playCardAtIndex(run: SliceRunState, bundle: GameDataBundle, index: number): void {
  if (!run.combat || (run.phase !== "combat" && run.phase !== "boss")) return;

  const cardId = run.hand[index];
  const card = cardId ? getCard(bundle, cardId) : undefined;
  if (!card) {
    pushRunLog(run, `card:missing:${index + 1}`);
    return;
  }

  const cost = Math.max(0, card.cost - run.nextCardDiscount + run.nextCardCostPenalty);
  if (run.player.energy < cost) {
    pushRunLog(run, `card:blocked_energy:${card.id}:${cost}`);
    return;
  }

  run.player.energy -= cost;
  run.nextCardDiscount = 0;
  run.nextCardCostPenalty = 0;
  run.hand.splice(index, 1);
  run.chainCount += 1;
  pushRunLog(run, `card:play:${card.id}:cost=${cost}`);

  for (const effect of card.effects) {
    if (effect.timing === "on_play") {
      applyCardEffect(run, bundle, card.id, effect);
    }
  }

  run.discard.push(card.id);
  if (run.combat.enemyHp <= 0) {
    handleCombatVictory(run, bundle);
  }
}

export function endTurn(run: SliceRunState, bundle: GameDataBundle): void {
  if (!run.combat || (run.phase !== "combat" && run.phase !== "boss")) return;
  if (run.combat.defeated) return;

  run.discard.push(...run.hand);
  run.hand = [];
  applyEnemyIntent(run, bundle);
  run.player.block = 0;
  run.player.energy = run.player.maxEnergy;
  run.chainCount = 0;
  run.combat.intentIndex += 1;
  run.combat.turn += 1;
  drawCards(run, 5);
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
  effect: GameEffect
): void {
  const amount = effect.value.amount ?? 0;

  if (effect.op === "deal_damage") {
    dealDamageToEnemy(
      run,
      amount + getAttachedRuneBonus(run, bundle, cardId, "modify_attached_card_damage"),
      bundle
    );
  } else if (effect.op === "conditional_bonus_damage") {
    if (effect.condition === "chain_count >= 3" && run.chainCount >= 3) {
      dealDamageToEnemy(run, amount, bundle);
    }
  } else if (effect.op === "gain_block") {
    const block = amount + getAttachedRuneBonus(run, bundle, cardId, "modify_attached_card_block");
    run.player.block += block;
    pushRunLog(run, `player:block:+${block}`);
  } else if (effect.op === "draw_cards") {
    drawCards(run, amount);
  } else if (effect.op === "discount_next_card") {
    run.nextCardDiscount += amount;
    pushRunLog(run, `card:discount_next:${amount}`);
  } else if (effect.op === "heal") {
    const before = run.player.hp;
    run.player.hp = Math.min(run.player.maxHp, run.player.hp + amount);
    pushRunLog(run, `player:heal:${run.player.hp - before}`);
  } else if (effect.op === "reduce_next_damage") {
    run.nextDamageReduction += amount;
    pushRunLog(run, `player:reduce_next_damage:${amount}`);
  } else if (effect.op === "increase_next_card_reward_options") {
    run.nextRewardBonus += amount;
    pushRunLog(run, `reward:bonus_options:${amount}`);
  } else {
    pushRunLog(run, `effect:unhandled:${effect.op}`);
  }
}

function dealDamageToEnemy(run: SliceRunState, amount: number, bundle: GameDataBundle): void {
  if (!run.combat) return;
  const blocked = Math.min(run.combat.enemyBlock, amount);
  run.combat.enemyBlock -= blocked;
  const hpDamage = Math.max(0, amount - blocked);
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
      dealDamageToPlayer(run, attack);
    } else if (effect.op === "gain_enemy_block") {
      run.combat.enemyBlock += amount;
      pushRunLog(run, `enemy:block:+${amount}`);
    } else if (effect.op === "increase_next_card_cost") {
      run.nextCardCostPenalty += amount;
      pushRunLog(run, `card:cost_penalty_next:${amount}`);
    } else {
      pushRunLog(run, `intent:unhandled:${effect.op}`);
    }
  }
}

function dealDamageToPlayer(run: SliceRunState, amount: number): void {
  const reduced = Math.max(0, amount - run.nextDamageReduction);
  run.nextDamageReduction = 0;
  const blocked = Math.min(run.player.block, reduced);
  run.player.block -= blocked;
  const hpDamage = Math.max(0, reduced - blocked);
  run.player.hp = Math.max(0, run.player.hp - hpDamage);
  pushRunLog(run, `player:damage:${hpDamage}:hp=${run.player.hp}`);
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

  if (run.combat.enemyKind === "boss") {
    const stageId = run.stageId;
    if (!run.completedStages.includes(stageId)) run.completedStages.push(stageId);
    run.phase = "result";
    pushRunLog(run, `combat:victory_boss:${run.combat.enemyId}`);
    return;
  }

  const room = getCurrentRoom(bundle, run);
  run.rewardSourceRoomIndex = run.roomIndex;
  run.phase = "reward";
  prepareRewardOffer(run, bundle, room?.rewardPoolId, 3);
  pushRunLog(run, `combat:victory:${run.combat.enemyId}`);
}

