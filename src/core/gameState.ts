export interface Resources {
  money: number;
  morale: number;
  reputation: number;
  risk: number;
}

export interface GameState {
  turn: number;
  maxTurns: number;
  gameOver: boolean;
  ending: string | null;
  resources: Resources;
}

export const MIN_RESOURCE = 0;

export const initialGameState: GameState = {
  turn: 1,
  maxTurns: 12,
  gameOver: false,
  ending: null,
  resources: {
    money: 12,
    morale: 8,
    reputation: 5,
    risk: 3
  }
};
