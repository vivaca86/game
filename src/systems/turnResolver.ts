import { MIN_RESOURCE, type GameState } from '../core/gameState';
import type { EventChoice } from '../data/events';
import { applyEffect } from '../data/events';

export function resolveTurn(state: GameState, choice: EventChoice): GameState {
  if (state.gameOver) {
    return state;
  }

  const nextResources = applyEffect(state.resources, choice.effect);

  const nextState: GameState = {
    ...state,
    turn: state.turn + 1,
    resources: nextResources
  };

  return evaluateEnding(nextState);
}

export function evaluateEnding(state: GameState): GameState {
  const { money, morale, reputation } = state.resources;

  if (money <= MIN_RESOURCE) {
    return { ...state, gameOver: true, ending: '파산 엔딩' };
  }

  if (morale <= MIN_RESOURCE) {
    return { ...state, gameOver: true, ending: '팀 붕괴 엔딩' };
  }

  if (reputation <= MIN_RESOURCE) {
    return { ...state, gameOver: true, ending: '시장 퇴출 엔딩' };
  }

  if (state.turn > state.maxTurns) {
    return { ...state, gameOver: true, ending: '생존 성공 엔딩' };
  }

  return state;
}
