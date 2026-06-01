import type {
  CardData,
  ContentId,
  EncounterPoolType,
  GameDataBundle,
  RewardEntry,
  RunState,
  SavePhase,
  RoomSlot,
  StageData
} from "../../data/schema";
import type { DebugConfig, EntryKey } from "../../debug/debugEntry";
import {
  applyCombatStartPassives,
  getPassiveAdjustedRewardOfferCount,
  getPassiveSupplementalRewardEntries
} from "../systems/passives/passiveSystem";
import type { SliceCombatState } from "./combatState";

export type SlicePhase = SavePhase;

export interface SlicePlayerState {
  hp: number;
  maxHp: number;
  energy: number;
  maxEnergy: number;
  block: number;
  gold: number;
}

export interface SliceRunState {
  runId: string;
  phase: SlicePhase;
  characterId: ContentId;
  stageId: ContentId;
  roomIndex: number;
  deck: ContentId[];
  drawPile: ContentId[];
  hand: ContentId[];
  discard: ContentId[];
  player: SlicePlayerState;
  combat?: SliceCombatState;
  rewardPoolId?: ContentId;
  offeredRewards: ContentId[];
  rewardSourceRoomIndex?: number;
  equippedRunes: Record<ContentId, ContentId[]>;
  runes: ContentId[];
  relics: ContentId[];
  arcanas: ContentId[];
  completedStages: ContentId[];
  lastEventChoiceId?: ContentId;
  nextCardDiscount: number;
  nextCardCostPenalty: number;
  nextDamageReduction: number;
  nextRewardBonus: number;
  chainCount: number;
  firstExpensiveCardFreeAvailable: boolean;
  guardCardsPlayedThisCombat: number;
  colorsPlayedThisTurn: ContentId[];
  prismPathTriggeredThisTurn: boolean;
  playerMark: number;
  playerWeak: number;
  battleRules: SliceBattleRule[];
  previousCardId?: ContentId;
  reflectRatio: number;
  log: string[];
}

export interface SliceBattleRule {
  rule: string;
  colorKey?: string;
  amount: number;
  sourceCardId: ContentId;
}

export function createInitialRunState(
  bundle: GameDataBundle,
  debug: DebugConfig,
  savedRun?: RunState
): SliceRunState {
  if (savedRun) {
    return createRunFromSave(bundle, debug, savedRun);
  }

  const character = bundle.characters[0];
  const stage = bundle.stages.find((item) => item.id === debug.stageId) ?? bundle.stages[0];
  const deck = ensureCardsInDeck([...(character?.startingDeck ?? []), ...debug.grants.cards], debug.handCards);
  const hand = debug.handCards.length > 0 ? debug.handCards.slice(0, 5) : buildOpeningHand(deck);
  const roomIndex = resolveInitialRoomIndex(stage, debug);
  const phase = entryToPhase(debug.entry);
  const maxHp = character?.maxHp ?? 1;

  const run: SliceRunState = {
    runId: "slice-run-001",
    phase,
    characterId: character?.id ?? "missing_character",
    stageId: stage?.id ?? "missing_stage",
    roomIndex,
    deck,
    drawPile: removeCards(deck, hand),
    hand,
    discard: [],
    player: {
      hp: clampDebugHp(debug.playerHp, maxHp),
      maxHp,
      energy: character?.startingEnergy ?? 3,
      maxEnergy: character?.startingEnergy ?? 3,
      block: 0,
      gold: 80
    },
    rewardPoolId: debug.rewardPoolId,
    offeredRewards: [],
    equippedRunes: {},
    runes: [...debug.grants.runes],
    relics: [...debug.grants.relics],
    arcanas: [...debug.grants.arcanas],
    completedStages: [],
    lastEventChoiceId: undefined,
    nextCardDiscount: 0,
    nextCardCostPenalty: 0,
    nextDamageReduction: 0,
    nextRewardBonus: 0,
    chainCount: 0,
    firstExpensiveCardFreeAvailable: true,
    guardCardsPlayedThisCombat: 0,
    colorsPlayedThisTurn: [],
    prismPathTriggeredThisTurn: false,
    playerMark: 0,
    playerWeak: 0,
    battleRules: [],
    reflectRatio: 0,
    log: [`boot:${phase}`]
  };

  if (phase === "combat" || phase === "boss") {
    const combat = createInitialCombatForPhase(bundle, run, debug);
    if (combat) {
      run.combat = combat;
      applyCombatStartPassives(run, bundle);
    }
  }

  if (phase === "reward") {
    const rewardPoolId = debug.rewardPoolId ?? getCurrentRoom(bundle, run)?.rewardPoolId ?? stage?.rewardPools[0];
    const count = getPassiveAdjustedRewardOfferCount(run, bundle, rewardPoolId, 3 + run.nextRewardBonus);
    const baseEntries = selectRewardEntries(bundle, rewardPoolId, count);
    const supplementalEntries = getPassiveSupplementalRewardEntries(run, bundle, rewardPoolId, baseEntries);
    run.rewardPoolId = rewardPoolId;
    run.offeredRewards = [...baseEntries, ...supplementalEntries].map((entry) => entry.id);
    run.nextRewardBonus = 0;
  }

  if (phase === "rune_bench" && run.runes.length === 0 && bundle.runes[0]) {
    run.runes.push(bundle.runes[0].id);
  }

  return run;
}

export function sliceRunToSaveRun(run: SliceRunState): RunState {
  return {
    runId: run.runId,
    phase: run.phase,
    characterId: run.characterId,
    stageId: run.stageId,
    roomIndex: run.roomIndex,
    deck: [...run.deck],
    drawPile: [...run.drawPile],
    hand: [...run.hand],
    discard: [...run.discard],
    playerEnergy: run.player.energy,
    playerMaxEnergy: run.player.maxEnergy,
    playerBlock: run.player.block,
    combat: run.combat ? { ...run.combat } : undefined,
    rewardPoolId: run.rewardPoolId,
    offeredRewards: [...run.offeredRewards],
    rewardSourceRoomIndex: run.rewardSourceRoomIndex,
    equippedRunes: Object.fromEntries(
      Object.entries(run.equippedRunes).map(([cardId, runes]) => [cardId, [...runes]])
    ),
    runes: [...run.runes],
    relics: [...run.relics],
    arcanas: [...run.arcanas],
    completedStages: [...run.completedStages],
    lastEventChoiceId: run.lastEventChoiceId,
    nextCardDiscount: run.nextCardDiscount,
    nextCardCostPenalty: run.nextCardCostPenalty,
    nextDamageReduction: run.nextDamageReduction,
    nextRewardBonus: run.nextRewardBonus,
    chainCount: run.chainCount,
    firstExpensiveCardFreeAvailable: run.firstExpensiveCardFreeAvailable,
    guardCardsPlayedThisCombat: run.guardCardsPlayedThisCombat,
    colorsPlayedThisTurn: [...run.colorsPlayedThisTurn],
    prismPathTriggeredThisTurn: run.prismPathTriggeredThisTurn,
    playerMark: run.playerMark,
    playerWeak: run.playerWeak,
    log: [...run.log],
    hp: run.player.hp,
    maxHp: run.player.maxHp,
    currency: run.player.gold
  };
}

export function entryToPhase(entry: EntryKey): SlicePhase {
  return entry;
}

export function getStage(bundle: GameDataBundle, run: SliceRunState): StageData | undefined {
  return bundle.stages.find((stage) => stage.id === run.stageId) ?? bundle.stages[0];
}

export function getCurrentRoom(bundle: GameDataBundle, run: SliceRunState): RoomSlot | undefined {
  return getStage(bundle, run)?.route[run.roomIndex];
}

export function getEncounterPoolContentId(
  bundle: GameDataBundle,
  poolId: ContentId | undefined,
  expectedType: EncounterPoolType
): ContentId | undefined {
  const pool = bundle.encounterPools.find((item) => item.id === poolId && item.type === expectedType);
  return pool?.entries[0]?.contentId;
}

export function getCard(bundle: GameDataBundle, cardId: ContentId): CardData | undefined {
  return bundle.cards.find((card) => card.id === cardId);
}

export function selectRewardEntries(
  bundle: GameDataBundle,
  rewardPoolId: ContentId | undefined,
  count: number
): RewardEntry[] {
  const pool = bundle.rewardPools.find((item) => item.id === rewardPoolId) ?? bundle.rewardPools[0];
  return pool?.entries.slice(0, Math.max(1, count)) ?? [];
}

export function findRewardEntryById(
  bundle: GameDataBundle,
  rewardPoolId: ContentId | undefined,
  rewardId: ContentId | undefined
): RewardEntry | undefined {
  if (!rewardId) return undefined;
  const primaryPool = bundle.rewardPools.find((item) => item.id === rewardPoolId) ?? bundle.rewardPools[0];
  return primaryPool?.entries.find((entry) => entry.id === rewardId)
    ?? bundle.rewardPools.flatMap((pool) => pool.entries).find((entry) => entry.id === rewardId);
}

export function selectRewardIds(
  bundle: GameDataBundle,
  rewardPoolId: ContentId | undefined,
  count: number
): ContentId[] {
  return selectRewardEntries(bundle, rewardPoolId, count).map((entry) => entry.id);
}

export function buildOpeningHand(deck: ContentId[], handSize = 5): ContentId[] {
  const totalCounts = countCards(deck);
  const takenCounts = new Map<ContentId, number>();
  const hand: ContentId[] = [];

  for (const cardId of deck) {
    if (hand.length >= handSize) break;
    if (!takenCounts.has(cardId)) {
      takeCard(cardId, takenCounts);
      hand.push(cardId);
    }
  }

  for (const cardId of deck) {
    if (hand.length >= handSize) break;
    const taken = takenCounts.get(cardId) ?? 0;
    const total = totalCounts.get(cardId) ?? 0;
    if (taken < total) {
      takeCard(cardId, takenCounts);
      hand.push(cardId);
    }
  }

  return hand;
}

export function removeCards(deck: ContentId[], removedCards: ContentId[]): ContentId[] {
  const remainingRemovalCounts = countCards(removedCards);
  const remaining: ContentId[] = [];

  for (const cardId of deck) {
    const removalsLeft = remainingRemovalCounts.get(cardId) ?? 0;
    if (removalsLeft > 0) {
      remainingRemovalCounts.set(cardId, removalsLeft - 1);
    } else {
      remaining.push(cardId);
    }
  }

  return remaining;
}

export function resetCombatHand(run: SliceRunState): void {
  run.hand = buildOpeningHand(run.deck);
  run.drawPile = removeCards(run.deck, run.hand);
  run.discard = [];
}

export function pushRunLog(run: SliceRunState, message: string): void {
  run.log = [...run.log, message].slice(-16);
}

function createRunFromSave(
  bundle: GameDataBundle,
  debug: DebugConfig,
  savedRun: RunState
): SliceRunState {
  const run: SliceRunState = {
    runId: savedRun.runId,
    phase: savedRun.phase,
    characterId: savedRun.characterId,
    stageId: savedRun.stageId,
    roomIndex: savedRun.roomIndex,
    deck: [...savedRun.deck],
    drawPile: [...savedRun.drawPile],
    hand: [...savedRun.hand],
    discard: [...savedRun.discard],
    player: {
      hp: savedRun.hp,
      maxHp: savedRun.maxHp,
      energy: savedRun.playerEnergy,
      maxEnergy: savedRun.playerMaxEnergy,
      block: savedRun.playerBlock,
      gold: savedRun.currency
    },
    combat: savedRun.combat ? { ...savedRun.combat } : undefined,
    rewardPoolId: savedRun.rewardPoolId,
    offeredRewards: [...savedRun.offeredRewards],
    rewardSourceRoomIndex: savedRun.rewardSourceRoomIndex,
    equippedRunes: Object.fromEntries(
      Object.entries(savedRun.equippedRunes).map(([cardId, runes]) => [cardId, [...runes]])
    ),
    runes: [...savedRun.runes],
    relics: [...savedRun.relics],
    arcanas: [...savedRun.arcanas],
    completedStages: [...savedRun.completedStages],
    lastEventChoiceId: savedRun.lastEventChoiceId,
    nextCardDiscount: savedRun.nextCardDiscount,
    nextCardCostPenalty: savedRun.nextCardCostPenalty,
    nextDamageReduction: savedRun.nextDamageReduction,
    nextRewardBonus: savedRun.nextRewardBonus,
    chainCount: savedRun.chainCount,
    firstExpensiveCardFreeAvailable: savedRun.firstExpensiveCardFreeAvailable ?? true,
    guardCardsPlayedThisCombat: savedRun.guardCardsPlayedThisCombat ?? 0,
    colorsPlayedThisTurn: [...(savedRun.colorsPlayedThisTurn ?? [])],
    prismPathTriggeredThisTurn: savedRun.prismPathTriggeredThisTurn ?? false,
    playerMark: savedRun.playerMark ?? 0,
    playerWeak: savedRun.playerWeak ?? 0,
    battleRules: [],
    reflectRatio: 0,
    log: savedRun.log.length > 0 ? [...savedRun.log] : [`boot:${savedRun.phase}`]
  };

  if ((run.phase === "combat" || run.phase === "boss") && !run.combat) {
    const combat = createInitialCombatForPhase(bundle, run, debug);
    if (combat) {
      run.combat = combat;
      applyCombatStartPassives(run, bundle);
    }
  }

  return run;
}

function resolveInitialRoomIndex(stage: StageData | undefined, debug: DebugConfig): number {
  if (!stage) return 0;
  if (debug.roomId) {
    const requestedIndex = stage.route.findIndex((room) => room.id === debug.roomId);
    if (requestedIndex >= 0) return requestedIndex;
  }

  if (debug.entry === "boss") {
    return Math.max(0, stage.route.findIndex((room) => room.type === "boss"));
  }

  if (debug.entry === "reward") {
    const rewardIndex = stage.route.findIndex((room) => room.type === "reward");
    return rewardIndex >= 0 ? rewardIndex : 0;
  }

  if (debug.entry === "event") {
    const eventIndex = stage.route.findIndex((room) => room.type === "event");
    return eventIndex >= 0 ? eventIndex : 0;
  }

  if (debug.entry === "rune_bench") {
    const eventIndex = stage.route.findIndex((room) => room.type === "event");
    return eventIndex >= 0 ? eventIndex : 0;
  }

  if (debug.entry === "combat") {
    const combatIndex = stage.route.findIndex((room) => room.type === "combat");
    return combatIndex >= 0 ? combatIndex : 0;
  }

  return 0;
}

function createInitialCombatForPhase(
  bundle: GameDataBundle,
  run: SliceRunState,
  debug: DebugConfig
): SliceCombatState | undefined {
  if (run.phase === "boss") {
    const room = getCurrentRoom(bundle, run);
    const pooledBossId = getEncounterPoolContentId(bundle, room?.encounterPoolId, "boss");
    const boss = bundle.bosses.find((item) => item.id === debug.bossId)
      ?? bundle.bosses.find((item) => item.id === pooledBossId)
      ?? bundle.bosses.find((item) => item.id === getStage(bundle, run)?.bossId)
      ?? bundle.bosses[0];
    return boss ? applyDebugCombatHp({
      enemyId: boss.id,
      enemyKind: "boss",
      enemyHp: boss.maxHp,
      enemyMaxHp: boss.maxHp,
      enemyBlock: boss.block ?? 0,
      enemyMark: 0,
      intentIndex: 0,
      turn: 1,
      defeated: false,
      bossPhaseTriggered: false,
      pendingAttackBonus: 0
    }, debug) : undefined;
  }

  const room = getCurrentRoom(bundle, run);
  const pooledEnemyId = getEncounterPoolContentId(bundle, room?.encounterPoolId, "combat");
  const enemy = bundle.enemies.find((item) => item.id === debug.enemyId)
    ?? bundle.enemies.find((item) => item.id === pooledEnemyId)
    ?? bundle.enemies[0];

  return enemy ? applyDebugCombatHp({
    enemyId: enemy.id,
    enemyKind: "enemy",
    enemyHp: enemy.maxHp,
    enemyMaxHp: enemy.maxHp,
    enemyBlock: enemy.block ?? 0,
    enemyMark: 0,
    intentIndex: 0,
    turn: 1,
    defeated: false,
    bossPhaseTriggered: false,
    pendingAttackBonus: 0
  }, debug) : undefined;
}

function clampDebugHp(value: number | undefined, maxHp: number): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return maxHp;
  return Math.max(1, Math.min(maxHp, Math.floor(value)));
}

function applyDebugCombatHp(combat: SliceCombatState, debug: DebugConfig): SliceCombatState {
  if (typeof debug.enemyHp !== "number" || !Number.isFinite(debug.enemyHp)) return combat;
  return {
    ...combat,
    enemyHp: Math.max(1, Math.min(combat.enemyMaxHp, Math.floor(debug.enemyHp)))
  };
}

function ensureCardsInDeck(deck: ContentId[], requiredCards: ContentId[]): ContentId[] {
  if (requiredCards.length === 0) return deck;

  const adjusted = [...deck];
  const deckCounts = countCards(adjusted);
  const requiredCounts = countCards(requiredCards);

  for (const [cardId, requiredCount] of requiredCounts) {
    const existingCount = deckCounts.get(cardId) ?? 0;
    for (let index = existingCount; index < requiredCount; index += 1) {
      adjusted.push(cardId);
    }
  }

  return adjusted;
}

function countCards(cards: ContentId[]): Map<ContentId, number> {
  const counts = new Map<ContentId, number>();
  for (const cardId of cards) {
    counts.set(cardId, (counts.get(cardId) ?? 0) + 1);
  }
  return counts;
}

function takeCard(cardId: ContentId, counts: Map<ContentId, number>): void {
  counts.set(cardId, (counts.get(cardId) ?? 0) + 1);
}
