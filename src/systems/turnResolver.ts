import {
  MAX_PRODUCT_STAT,
  MIN_RESOURCE,
  type GameState,
  type ProductStats,
  type Resources,
  type RunReport,
  type TeamStats,
  type TurnSettlement
} from '../core/gameState';
import type { ChoiceEffect, EventChoice } from '../data/events';

function clampProductStat(value: number): number {
  return Math.max(0, Math.min(MAX_PRODUCT_STAT, value));
}

function clampSkill(value: number): number {
  return Math.max(10, Math.min(100, value));
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

function applyTeamEffect(team: TeamStats, effect: ChoiceEffect): TeamStats {
  return {
    headcount: Math.max(1, team.headcount + (effect.headcount ?? 0)),
    skill: clampSkill(team.skill + (effect.skill ?? 0))
  };
}

function moraleProductivityMultiplier(morale: number): number {
  if (morale >= 12) {
    return 1.12;
  }
  if (morale >= 8) {
    return 1;
  }
  if (morale >= 5) {
    return 0.9;
  }
  return 0.78;
}

function buildDevelopmentSettlement(state: GameState): TurnSettlement {
  const baseIncome = Math.round(state.team.headcount * (state.team.skill / 50));
  const officeCost = 3;
  const payrollCost = state.team.headcount * 2;
  const toolCost = Math.max(1, Math.round(state.team.headcount * 0.4));
  const cost = officeCost + payrollCost + toolCost;
  const income = baseIncome;

  return {
    income,
    cost,
    net: income - cost,
    summary: `개발정산 수익 ${income} / 비용 ${cost}`
  };
}

function applyDevelopmentSettlement(state: GameState): GameState {
  const settlement = buildDevelopmentSettlement(state);
  const productivity = moraleProductivityMultiplier(state.resources.morale);

  return {
    ...state,
    resources: {
      ...state.resources,
      money: state.resources.money + settlement.net,
      morale: state.resources.morale - 1
    },
    product: {
      ...state.product,
      progress: clampProductStat(state.product.progress + Math.round(state.team.headcount * 0.8 * productivity)),
      quality: clampProductStat(state.product.quality + Math.round((state.team.skill - 50) / 20))
    },
    lastSettlement: settlement
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

  const officeCost = 3;
  const payrollCost = state.team.headcount * 2;
  const serverCost = Math.max(2, Math.round(ccu * 0.08));
  const liveOpsCost = 2;
  const totalCost = officeCost + payrollCost + serverCost + liveOpsCost;

  const settlement: TurnSettlement = {
    income: revenue,
    cost: totalCost,
    net: revenue - totalCost,
    summary: `라이브정산 매출 ${revenue} / 비용 ${totalCost}`
  };

  return {
    ...state,
    resources: {
      ...state.resources,
      money: state.resources.money + settlement.net,
      morale: state.resources.morale - 1
    },
    live: {
      ccu,
      revenue,
      cumulativeRevenue: state.live.cumulativeRevenue + revenue,
      peakCcu: Math.max(state.live.peakCcu, ccu)
    },
    lastSettlement: settlement
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
      },
      lastSettlement: {
        income: 0,
        cost: 0,
        net: 0,
        summary: '출시 완료: 라이브 운영 시작'
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
    team: applyTeamEffect(state.team, choice.effect),
    product: applyProductEffect(state.product, choice.effect)
  };

  const settledState = updatedState.phase === 'development' ? applyDevelopmentSettlement(updatedState) : applyLiveSettlement(updatedState);
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
