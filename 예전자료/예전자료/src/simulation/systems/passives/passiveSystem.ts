import type {
  CardData,
  ContentId,
  GameDataBundle,
  GameEffect,
  RewardEntry,
  RewardPoolData,
  RoomType
} from "../../../data/schema";
import type { SliceRunState } from "../../state/runState";

type PassiveDamageHandler = (amount: number) => void;
type PassiveDrawHandler = (amount: number) => void;

export interface PassiveCardCostAdjustment {
  cost: number;
  consumedFirstExpensiveCardFree: boolean;
}

interface PassiveAfterCardPlayedHandlers {
  dealDamage: PassiveDamageHandler;
  drawCards: PassiveDrawHandler;
}

export function applyCombatStartPassives(run: SliceRunState, bundle: GameDataBundle): void {
  if (!run.combat) return;

  const startingBlock = sumOwnedRelicEffectAmounts(run, bundle, "shield_at_battle_start");
  if (startingBlock > 0) {
    run.player.block += startingBlock;
    pushPassiveLog(run, `passive:relic:shield_at_battle_start:+${startingBlock}`);
  }

  const startingEnergy = sumOwnedRelicEffectAmounts(run, bundle, "start_with_energy");
  if (startingEnergy > 0) {
    const before = run.player.energy;
    run.player.energy = Math.min(run.player.maxEnergy + startingEnergy, run.player.energy + startingEnergy);
    pushPassiveLog(run, `passive:relic:start_with_energy:+${run.player.energy - before}`);
  }
}

export function applyAfterCardPlayedPassives(
  run: SliceRunState,
  bundle: GameDataBundle,
  card: CardData,
  paidCost: number,
  handlers: PassiveAfterCardPlayedHandlers
): void {
  if (!run.combat || run.combat.defeated) return;

  if (paidCost === 0) {
    const gold = sumOwnedArcanaEffectAmounts(run, bundle, "gain_gold_on_zero_cost_play");
    if (gold > 0) {
      run.player.gold += gold;
      pushPassiveLog(run, `passive:arcana:gain_gold_on_zero_cost_play:+${gold}`);
    }
  }

  if (card.type === "defense") {
    run.guardCardsPlayedThisCombat += 1;

    for (const effect of ownedArcanaEffects(run, bundle, "damage_random_on_guard_play")) {
      const damage = effect.value.amount ?? 0;
      if (damage <= 0) continue;
      handlers.dealDamage(damage);
      pushPassiveLog(run, `passive:arcana:damage_random_on_guard_play:${damage}`);
    }

    for (const effect of ownedArcanaEffects(run, bundle, "heal_when_guard_played_count")) {
      const threshold = effect.value.duration ?? readThreshold(effect.condition);
      const heal = effect.value.amount ?? 0;
      if (threshold <= 0 || heal <= 0 || run.guardCardsPlayedThisCombat % threshold !== 0) continue;
      healPlayerFromPassive(run, bundle, heal, "arcana:heal_when_guard_played_count");
    }
  }

  if (card.colorKey && !run.colorsPlayedThisTurn.includes(card.colorKey)) {
    run.colorsPlayedThisTurn.push(card.colorKey);
  }

  for (const effect of ownedArcanaEffects(run, bundle, "draw_on_four_colors")) {
    const threshold = effect.value.duration ?? 4;
    const amount = effect.value.amount ?? 0;
    if (threshold <= 0 || amount <= 0) continue;
    if (run.prismPathTriggeredThisTurn || run.colorsPlayedThisTurn.length < threshold) continue;
    run.prismPathTriggeredThisTurn = true;
    handlers.drawCards(amount);
    pushPassiveLog(run, `passive:arcana:draw_on_four_colors:${amount}`);
  }

  for (const effect of ownedArcanaEffects(run, bundle, "damage_all_when_cards_played")) {
    const threshold = effect.value.duration ?? readThreshold(effect.condition);
    const damage = effect.value.amount ?? 0;
    if (threshold <= 0 || damage <= 0 || run.chainCount !== threshold) continue;
    handlers.dealDamage(damage);
    pushPassiveLog(run, `passive:arcana:damage_all_when_cards_played:${damage}`);
  }
}

export function applyCombatVictoryPassives(run: SliceRunState, bundle: GameDataBundle): void {
  const heal = sumOwnedRelicEffectAmounts(run, bundle, "heal_after_combat");
  if (heal > 0) {
    healPlayerFromPassive(run, bundle, heal, "relic:heal_after_combat");
  }
}

export function applyAfterPlayerHealedPassives(
  run: SliceRunState,
  bundle: GameDataBundle,
  healedAmount: number
): void {
  if (healedAmount <= 0 || !run.combat || run.combat.enemyHp <= 0) return;

  const mark = sumOwnedArcanaEffectAmounts(run, bundle, "mark_front_on_heal");
  if (mark > 0) {
    run.combat.enemyMark += mark;
    pushPassiveLog(run, `passive:arcana:mark_front_on_heal:+${mark}`);
  }
}

export function getPassiveAdjustedCardCost(
  run: SliceRunState,
  bundle: GameDataBundle,
  card: CardData,
  baseCost: number
): PassiveCardCostAdjustment {
  if (!run.combat || !run.firstExpensiveCardFreeAvailable || baseCost <= 0) {
    return { cost: baseCost, consumedFirstExpensiveCardFree: false };
  }

  for (const effect of ownedRelicEffects(run, bundle, "first_expensive_card_free_each_battle")) {
    const minCost = effect.value.minCost ?? effect.value.duration ?? 2;
    if (card.cost < minCost) continue;
    return { cost: 0, consumedFirstExpensiveCardFree: true };
  }

  return { cost: baseCost, consumedFirstExpensiveCardFree: false };
}

export function consumePassiveCardCostAdjustment(
  run: SliceRunState,
  adjustment: PassiveCardCostAdjustment
): void {
  if (!adjustment.consumedFirstExpensiveCardFree) return;
  run.firstExpensiveCardFreeAvailable = false;
  pushPassiveLog(run, "passive:relic:first_expensive_card_free_each_battle:used");
}

export function applyTurnEndRetainPassive(run: SliceRunState, bundle: GameDataBundle): void {
  const retainCount = Math.max(0, sumOwnedRelicEffectAmounts(run, bundle, "retain_one_card"));
  if (retainCount <= 0 || run.hand.length === 0) {
    run.discard.push(...run.hand);
    run.hand = [];
    return;
  }

  const retainedCards = run.hand.slice(0, retainCount);
  const discardedCards = run.hand.slice(retainCount);
  run.discard.push(...discardedCards);
  run.hand = retainedCards;
  pushPassiveLog(run, `passive:relic:retain_one_card:${retainedCards.length}`);
}

export function getCarriedBlockForNextTurn(
  run: SliceRunState,
  bundle: GameDataBundle,
  currentBlock: number
): number {
  if (currentBlock <= 0) return 0;

  const percent = sumOwnedArcanaEffectAmounts(run, bundle, "carry_shield_percent");
  if (percent <= 0) return 0;

  const carried = Math.max(0, Math.ceil(currentBlock * (percent / 100)));
  if (carried > 0) {
    pushPassiveLog(run, `passive:arcana:carry_shield_percent:${currentBlock}->${carried}`);
  }
  return carried;
}

export function getRevealedNextRoomType(
  run: SliceRunState,
  bundle: GameDataBundle
): RoomType | undefined {
  const revealDistance = Math.max(0, sumOwnedRelicEffectAmounts(run, bundle, "reveal_next_room_type"));
  if (revealDistance <= 0) return undefined;

  const stage = bundle.stages.find((item) => item.id === run.stageId) ?? bundle.stages[0];
  return stage?.route[run.roomIndex + revealDistance]?.type;
}

export function getPassiveAdjustedRewardOfferCount(
  run: SliceRunState,
  bundle: GameDataBundle,
  rewardPoolId: ContentId | undefined,
  baseCount: number
): number {
  const pool = findRewardPool(bundle, rewardPoolId);
  const rewardTypes = new Set(pool?.entries.map((entry) => entry.type) ?? []);
  let count = baseCount;

  if (rewardTypes.has("card")) {
    count += sumOwnedRelicEffectAmounts(run, bundle, "increase_card_reward_options");
    if (sourceRoomType(run, bundle) === "elite") {
      count += sumOwnedRelicEffectAmounts(run, bundle, "add_card_after_elite");
    }
  }

  if (rewardTypes.has("rune")) {
    count += sumOwnedRelicEffectAmounts(run, bundle, "increase_gem_reward_options");
  }

  if (pool?.id.includes("stage_clear") || sourceRoomType(run, bundle) === "boss") {
    count += sumOwnedRelicEffectAmounts(run, bundle, "boss_reward_bonus");
  }

  return Math.max(1, count);
}

export function getPassiveSupplementalRewardEntries(
  run: SliceRunState,
  bundle: GameDataBundle,
  rewardPoolId: ContentId | undefined,
  currentEntries: RewardEntry[]
): RewardEntry[] {
  const pool = findRewardPool(bundle, rewardPoolId);
  const rewardTypes = new Set(pool?.entries.map((entry) => entry.type) ?? []);
  const supplementalEntries: RewardEntry[] = [];
  const existingIds = new Set(currentEntries.map((entry) => entry.id));

  if (!rewardTypes.has("card") && sourceRoomType(run, bundle) === "elite") {
    const cardCount = sumOwnedRelicEffectAmounts(run, bundle, "add_card_after_elite");
    supplementalEntries.push(...firstRewardEntriesOfType(bundle, "card", cardCount, existingIds));
  }

  return supplementalEntries;
}

export function modifyCurrencyRewardAmount(
  run: SliceRunState,
  bundle: GameDataBundle,
  baseAmount: number
): number {
  const percent = sumOwnedRelicEffectAmounts(run, bundle, "modify_gold_reward_percent");
  if (percent <= 0 || baseAmount <= 0) return baseAmount;

  const adjusted = Math.ceil(baseAmount * (1 + percent / 100));
  pushPassiveLog(run, `passive:relic:modify_gold_reward_percent:${baseAmount}->${adjusted}`);
  return adjusted;
}

function healPlayerFromPassive(
  run: SliceRunState,
  bundle: GameDataBundle,
  amount: number,
  source: string
): void {
  const before = run.player.hp;
  run.player.hp = Math.min(run.player.maxHp, run.player.hp + amount);
  const healed = run.player.hp - before;
  if (healed <= 0) return;

  pushPassiveLog(run, `passive:${source}:heal:${healed}`);
  applyAfterPlayerHealedPassives(run, bundle, healed);
}

function ownedRelicEffects(run: SliceRunState, bundle: GameDataBundle, op: string): GameEffect[] {
  return ownedPassiveEffects(run.relics, bundle.relics, op);
}

function ownedArcanaEffects(run: SliceRunState, bundle: GameDataBundle, op: string): GameEffect[] {
  return ownedPassiveEffects(run.arcanas, bundle.arcanas, op);
}

function ownedPassiveEffects(
  ownedIds: ContentId[],
  items: Array<{ id: ContentId; effects: GameEffect[] }>,
  op: string
): GameEffect[] {
  const owned = new Set(ownedIds);
  return items
    .filter((item) => owned.has(item.id))
    .flatMap((item) => item.effects)
    .filter((effect) => effect.op === op);
}

function sumOwnedRelicEffectAmounts(run: SliceRunState, bundle: GameDataBundle, op: string): number {
  return sumEffectAmounts(ownedRelicEffects(run, bundle, op));
}

function sumOwnedArcanaEffectAmounts(run: SliceRunState, bundle: GameDataBundle, op: string): number {
  return sumEffectAmounts(ownedArcanaEffects(run, bundle, op));
}

function sumEffectAmounts(effects: GameEffect[]): number {
  return effects.reduce((sum, effect) => sum + (effect.value.amount ?? 0), 0);
}

function firstRewardEntriesOfType(
  bundle: GameDataBundle,
  type: RewardEntry["type"],
  count: number,
  existingIds: Set<ContentId>
): RewardEntry[] {
  if (count <= 0) return [];

  return bundle.rewardPools
    .flatMap((pool) => pool.entries)
    .filter((entry) => entry.type === type && !existingIds.has(entry.id))
    .slice(0, count);
}

function findRewardPool(bundle: GameDataBundle, rewardPoolId: ContentId | undefined): RewardPoolData | undefined {
  return bundle.rewardPools.find((pool) => pool.id === rewardPoolId) ?? bundle.rewardPools[0];
}

function sourceRoomType(run: SliceRunState, bundle: GameDataBundle): string | undefined {
  const stage = bundle.stages.find((item) => item.id === run.stageId) ?? bundle.stages[0];
  return stage?.route[run.rewardSourceRoomIndex ?? run.roomIndex]?.type;
}

function readThreshold(condition: string | undefined): number {
  const match = condition?.match(/>=\s*(\d+)/);
  return match ? Number(match[1]) : 0;
}

function pushPassiveLog(run: SliceRunState, message: string): void {
  run.log = [...run.log, message].slice(-16);
}
