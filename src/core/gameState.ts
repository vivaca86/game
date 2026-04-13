export type Phase = 'development' | 'live';

export interface Resources {
  money: number;
  morale: number;
  reputation: number;
  risk: number;
}

export interface TeamStats {
  headcount: number;
  skill: number;
}

export interface ProductStats {
  progress: number;
  quality: number;
  stability: number;
  hype: number;
}

export interface LiveStats {
  ccu: number;
  revenue: number;
  cumulativeRevenue: number;
  peakCcu: number;
}

export interface TurnSettlement {
  income: number;
  cost: number;
  net: number;
  summary: string;
}

export interface RunReport {
  ending: string;
  turnsSurvived: number;
  tier: string;
  peakCcu: number;
  cumulativeRevenue: number;
  finalQuality: number;
  failureCause: string;
}

export interface GameState {
  turn: number;
  maxTurns: number;
  phase: Phase;
  gameOver: boolean;
  ending: string | null;
  resources: Resources;
  team: TeamStats;
  product: ProductStats;
  live: LiveStats;
  lastSettlement: TurnSettlement;
}

export const MIN_RESOURCE = 0;
export const MAX_PRODUCT_STAT = 100;

export const initialGameState: GameState = {
  turn: 1,
  maxTurns: 16,
  phase: 'development',
  gameOver: false,
  ending: null,
  resources: {
    money: 18,
    morale: 10,
    reputation: 5,
    risk: 3
  },
  team: {
    headcount: 4,
    skill: 50
  },
  product: {
    progress: 15,
    quality: 45,
    stability: 50,
    hype: 30
  },
  live: {
    ccu: 0,
    revenue: 0,
    cumulativeRevenue: 0,
    peakCcu: 0
  },
  lastSettlement: {
    income: 0,
    cost: 0,
    net: 0,
    summary: '초기 상태'
  }
};
