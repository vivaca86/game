export type Phase = 'development' | 'live';

export interface Resources {
  money: number;
  morale: number;
  reputation: number;
  risk: number;
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
  product: ProductStats;
  live: LiveStats;
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
  }
};
