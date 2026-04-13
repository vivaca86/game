import {
  MAX_PRODUCT_STAT,
  MIN_RESOURCE,
  type GameState,
  type ProductStats,
  type Resources,
  type RunReport
} from '../core/gameState';
import type { ChoiceEffect, EventChoice } from '../data/events';

function clampProductStat(value: number): number {
  return Math.max(0, Math.min(MAX_PRODUCT_STAT, value));
}

function applyResourceEffect(resources: Resources, effect: ChoiceEffect): Resources {
  return {
    money: resources.money + (effect.money ?? 0),
    morale: resources.morale + (effect.morale ?? 0),
    reputation: resources.reputation + (effect.reputation ?? 0),
    risk: resources.risk + (effect.risk ?? 0)
  };
}

function applyProductEffect(product: ProductStats, effect: ChoiceEffect): ProductStats {
  return {
    progress: clampProductStat(product.progress + (effect.progress ?? 0)),
    quality: clampProductStat(product.quality + (effect.quality ?? 0)),
    stability: clampProductStat(product.stability + (effect.stability ?? 0)),
    hype: clampProductStat(product.hype + (effect.hype ?? 0))
  };
}

function applyDevelopmentUpkeep(state: GameState): GameState {
  return {
    ...state,
    resources: {
      ...state.resources,
      money: state.resources.money - 2,
      morale: state.resources.morale - 1
    }
  };
}

function applyLiveSettlement(state: GameState): GameState {
  const qualityFactor = state.product.quality * 0.35;
  const stabilityFactor = state.product.stability * 0.25;
  const hypeFactor = state.product.hype * 0.4;
  const reputationFactor = state.resources.reputation * 1.5;
  const riskPenalty = state.resources.risk * 4;

  const ccu = Math.max(0, Math.round(qualityFactor + stabilityFactor + hypeFactor + reputationFactor - riskPenalty));
  const revenue = Math.max(0, Math.round(ccu * 0.45));
  const liveCost = 3;

  return {
    ...state,
    resources: {
      ...state.resources,
      money: state.resources.money + revenue - liveCost,
      morale: state.resources.morale - 1
    },
    live: {
      ccu,
      revenue,
      cumulativeRevenue: state.live.cumulativeRevenue + revenue,
      peakCcu: Math.max(state.live.peakCcu, ccu)
    }
  };
}

function tryLaunch(state: GameState): GameState {
  if (state.phase === 'development' && state.product.progress >= 100) {
    return {
      ...state,
      phase: 'live',
      resources: {
        ...state.resources,
        reputation: state.resources.reputation + 2,
        risk: Math.max(0, state.resources.risk - 1)
      }
    };
  }

  return state;
}

export function resolveTurn(state: GameState, choice: EventChoice): GameState {
  if (state.gameOver) {
    return state;
  }

  const updatedState: GameState = {
    ...state,
    turn: state.turn + 1,
    resources: applyResourceEffect(state.resources, choice.effect),
    product: applyProductEffect(state.product, choice.effect)
  };

  const settledState = updatedState.phase === 'development' ? applyDevelopmentUpkeep(updatedState) : applyLiveSettlement(updatedState);
  const launchedState = tryLaunch(settledState);

  return evaluateEnding(launchedState);
}

export function getCompanyTier(state: GameState): string {
  const score =
    state.resources.money * 2 +
    state.resources.reputation * 6 +
    state.product.quality +
    state.product.stability +
    state.live.cumulativeRevenue * 0.4;

  if (score >= 260) {
    return '글로벌 스튜디오';
  }
  if (score >= 200) {
    return '대기업 스튜디오';
  }
  if (score >= 140) {
    return '중견 스튜디오';
  }
  return '스타트업 스튜디오';
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
    return {
      ...state,
      gameOver: true,
      ending: `${getCompanyTier(state)} 달성`
    };
  }

  return state;
}

export function buildRunReport(state: GameState): RunReport {
  const ending = state.ending ?? '미확정 엔딩';
  let failureCause = '시즌 완료';

  if (ending.includes('파산')) {
    failureCause = '현금 부족';
  } else if (ending.includes('붕괴')) {
    failureCause = '팀 멘탈 붕괴';
  } else if (ending.includes('퇴출')) {
    failureCause = '시장 신뢰 상실';
  }

  return {
    ending,
    turnsSurvived: Math.min(state.turn, state.maxTurns),
    tier: getCompanyTier(state),
    peakCcu: state.live.peakCcu,
    cumulativeRevenue: state.live.cumulativeRevenue,
    finalQuality: state.product.quality,
    failureCause
  };
}
