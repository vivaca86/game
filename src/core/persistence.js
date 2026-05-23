import { createRng } from "./random.js";
import { createNewRun } from "./game-state.js";
import { ensureGemState } from "./gems.js";
import { ensureModifierState } from "./run-modifiers.js";

export const SAVE_KEY = "sunny_maze_run_v1";

export function createSaveSnapshot(state) {
  if (!state) return null;
  ensureGemState(state);
  ensureModifierState(state);
  return {
    version: 1,
    savedAt: new Date().toISOString(),
    seed: state.seed,
    phase: state.phase,
    turn: state.turn,
    roomIndex: state.roomIndex,
    currentRoomType: state.currentRoomType,
    characterId: state.characterId,
    stageId: state.stageId,
    player: structuredClone(state.player),
    deck: [...state.deck],
    drawPile: [...state.drawPile],
    discardPile: [...state.discardPile],
    exhaustPile: [...state.exhaustPile],
    hand: [...state.hand],
    enemies: structuredClone(state.enemies),
    inventory: structuredClone(state.inventory),
    profileUnlocks: structuredClone(state.profileUnlocks || {}),
    upgradedCards: [...state.upgradedCards],
    cardSockets: structuredClone(state.cardSockets),
    cardSocketBonuses: structuredClone(state.cardSocketBonuses),
    nextGemInstanceId: state.nextGemInstanceId,
    battleRules: structuredClone(state.battleRules),
    status: structuredClone(state.status),
    metrics: structuredClone(state.metrics),
    pendingReward: structuredClone(state.pendingReward),
    pendingEvent: structuredClone(state.pendingEvent),
    resultSummary: structuredClone(state.resultSummary || null),
    log: [...state.log]
  };
}

export function restoreRunState(snapshot, index) {
  if (!snapshot || snapshot.version !== 1) return null;
  const state = createNewRun(index, {
    characterId: snapshot.characterId,
    stageId: snapshot.stageId,
    seed: snapshot.seed
  });
  Object.assign(state, {
    seed: snapshot.seed,
    rng: createRng(snapshot.seed),
    phase: snapshot.phase,
    turn: snapshot.turn,
    roomIndex: snapshot.roomIndex,
    currentRoomType: snapshot.currentRoomType,
    player: structuredClone(snapshot.player),
    deck: [...snapshot.deck],
    drawPile: [...snapshot.drawPile],
    discardPile: [...snapshot.discardPile],
    exhaustPile: [...snapshot.exhaustPile],
    hand: [...snapshot.hand],
    enemies: structuredClone(snapshot.enemies),
    inventory: structuredClone(snapshot.inventory),
    profileUnlocks: structuredClone(snapshot.profileUnlocks || {}),
    upgradedCards: [...snapshot.upgradedCards],
    cardSockets: structuredClone(snapshot.cardSockets || {}),
    cardSocketBonuses: structuredClone(snapshot.cardSocketBonuses || {}),
    nextGemInstanceId: snapshot.nextGemInstanceId || 1,
    battleRules: structuredClone(snapshot.battleRules || []),
    status: structuredClone(snapshot.status || {}),
    metrics: structuredClone(snapshot.metrics),
    pendingReward: structuredClone(snapshot.pendingReward),
    pendingEvent: structuredClone(snapshot.pendingEvent),
    resultSummary: structuredClone(snapshot.resultSummary || null),
    log: [...(snapshot.log || [])]
  });
  ensureGemState(state);
  ensureModifierState(state);
  return state;
}

export function saveRun(state, storage = globalThis.localStorage) {
  if (!storage || !state) return false;
  storage.setItem(SAVE_KEY, JSON.stringify(createSaveSnapshot(state)));
  return true;
}

export function loadSavedRun(index, storage = globalThis.localStorage) {
  if (!storage) return null;
  const raw = storage.getItem(SAVE_KEY);
  if (!raw) return null;
  return restoreRunState(JSON.parse(raw), index);
}

export function clearSavedRun(storage = globalThis.localStorage) {
  if (!storage) return false;
  storage.removeItem(SAVE_KEY);
  return true;
}

export function hasSavedRun(storage = globalThis.localStorage) {
  return Boolean(storage?.getItem(SAVE_KEY));
}
