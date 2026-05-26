import type {
  CardData,
  ContentId,
  GameDataBundle,
  RewardEntry,
  RunState,
  SavePhase,
  RoomSlot,
  StageData
} from "../../data/schema";
import type { DebugConfig, EntryKey } from "../../debug/debugEntry";
import type { SliceCombatState } from "./combatState";

export type SlicePhase = SavePhase;

export interface SlicePlayerState {
  hp: number;
  maxHp: number;
  energy: number;
  maxEnergy: number;
  block: number;
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
  nextCardDiscount: number;
  nextCardCostPenalty: number;
  nextDamageReduction: number;
  nextRewardBonus: number;
  chainCount: number;
  log: string[];
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
  const deck = [...(character?.startingDeck ?? []), ...debug.grants.cards];
  const hand = buildOpeningHand(deck);
  const roomIndex = resolveInitialRoomIndex(stage, debug);
  const phase = entryToPhase(debug.entry);

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
      hp: character?.maxHp ?? 1,
      maxHp: character?.maxHp ?? 1,
      energy: character?.startingEnergy ?? 3,
      maxEnergy: character?.startingEnergy ?? 3,
      block: 0
    },
    rewardPoolId: debug.rewardPoolId,
    offeredRewards: [],
    equippedRunes: {},
    runes: [...debug.grants.runes],
    relics: [...debug.grants.relics],
    arcanas: [],
    completedStages: [],
    nextCardDiscount: 0,
    nextCardCostPenalty: 0,
    nextDamageReduction: 0,
    nextRewardBonus: 0,
    chainCount: 0,
    log: [`boot:${phase}`]
  };

  if (phase === "combat" || phase === "boss") {
    const combat = createInitialCombatForPhase(bundle, run, debug);
    if (combat) run.combat = combat;
  }

  if (phase === "reward") {
    const rewardPoolId = debug.rewardPoolId ?? getCurrentRoom(bundle, run)?.rewardPoolId ?? stage?.rewardPools[0];
    run.rewardPoolId = rewardPoolId;
    run.offeredRewards = selectRewardIds(bundle, rewardPoolId, 3);
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
    nextCardDiscount: run.nextCardDiscount,
    nextCardCostPenalty: run.nextCardCostPenalty,
    nextDamageReduction: run.nextDamageReduction,
    nextRewardBonus: run.nextRewardBonus,
    chainCount: run.chainCount,
    log: [...run.log],
    hp: run.player.hp,
    maxHp: run.player.maxHp,
    currency: 0
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
      block: savedRun.playerBlock
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
    nextCardDiscount: savedRun.nextCardDiscount,
    nextCardCostPenalty: savedRun.nextCardCostPenalty,
    nextDamageReduction: savedRun.nextDamageReduction,
    nextRewardBonus: savedRun.nextRewardBonus,
    chainCount: savedRun.chainCount,
    log: savedRun.log.length > 0 ? [...savedRun.log] : [`boot:${savedRun.phase}`]
  };

  if ((run.phase === "combat" || run.phase === "boss") && !run.combat) {
    const combat = createInitialCombatForPhase(bundle, run, debug);
    if (combat) run.combat = combat;
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
    const boss = bundle.bosses.find((item) => item.id === debug.bossId)
      ?? bundle.bosses.find((item) => item.id === getStage(bundle, run)?.bossId)
      ?? bundle.bosses[0];
    return boss ? {
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
    } : undefined;
  }

  const room = getCurrentRoom(bundle, run);
  const enemy = bundle.enemies.find((item) => item.id === debug.enemyId)
    ?? bundle.enemies.find((item) => item.id === room?.encounterPoolId)
    ?? bundle.enemies[0];

  return enemy ? {
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
  } : undefined;
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
