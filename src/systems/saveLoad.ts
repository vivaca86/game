import { initialGameState, type GameState } from '../core/gameState';

const SAVE_KEY = 'studio-balance-save-v1';

function isGameState(candidate: unknown): candidate is GameState {
  if (!candidate || typeof candidate !== 'object') {
    return false;
  }

  const state = candidate as Partial<GameState>;
  return (
    typeof state.turn === 'number' &&
    typeof state.maxTurns === 'number' &&
    typeof state.phase === 'string' &&
    typeof state.gameOver === 'boolean' &&
    typeof state.resources === 'object' &&
    typeof state.product === 'object' &&
    typeof state.live === 'object'
  );
}

export function saveGame(state: GameState): void {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

export function loadGame(): GameState {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) {
    return structuredClone(initialGameState);
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (isGameState(parsed)) {
      return parsed;
    }
  } catch {
    localStorage.removeItem(SAVE_KEY);
  }

  return structuredClone(initialGameState);
}

export function clearSave(): void {
  localStorage.removeItem(SAVE_KEY);
}
