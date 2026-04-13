import type { Resources } from '../core/gameState';

export interface ChoiceEffect {
  money?: number;
  morale?: number;
  reputation?: number;
  risk?: number;
}

export interface EventChoice {
  id: string;
  label: string;
  effect: ChoiceEffect;
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  choices: EventChoice[];
}

export const EVENT_DECK: GameEvent[] = [
  {
    id: 'supplier-cost-spike',
    title: '원자재 단가 급등',
    description: '주요 공급사가 단가를 인상했다.',
    choices: [
      { id: 'pass-to-customers', label: '가격 전가', effect: { money: 3, reputation: -2, risk: 1 } },
      { id: 'absorb-cost', label: '회사가 흡수', effect: { money: -3, morale: 1, risk: -1 } },
      { id: 'cut-quality', label: '품질 하향', effect: { money: 1, reputation: -3, risk: 2 } }
    ]
  },
  {
    id: 'team-burnout',
    title: '팀 번아웃 조짐',
    description: '야근이 이어져 팀 분위기가 나빠지고 있다.',
    choices: [
      { id: 'mandatory-break', label: '강제 휴식', effect: { money: -2, morale: 3, risk: -1 } },
      { id: 'bonus-incentive', label: '성과급 지급', effect: { money: -3, morale: 2, reputation: 1 } },
      { id: 'push-through', label: '일단 밀어붙인다', effect: { money: 2, morale: -3, risk: 2 } }
    ]
  },
  {
    id: 'viral-opportunity',
    title: '바이럴 기회',
    description: '제품이 SNS에서 갑자기 언급되기 시작했다.',
    choices: [
      { id: 'ad-campaign', label: '광고비 증액', effect: { money: -2, reputation: 3, risk: -1 } },
      { id: 'organic-grow', label: '자연 확산 유도', effect: { reputation: 2, money: 1 } },
      { id: 'overpromise', label: '과한 홍보', effect: { money: 2, reputation: -1, risk: 2 } }
    ]
  }
];

export function getEventForTurn(turn: number): GameEvent {
  return EVENT_DECK[(turn - 1) % EVENT_DECK.length];
}

export function applyEffect(resources: Resources, effect: ChoiceEffect): Resources {
  return {
    money: resources.money + (effect.money ?? 0),
    morale: resources.morale + (effect.morale ?? 0),
    reputation: resources.reputation + (effect.reputation ?? 0),
    risk: resources.risk + (effect.risk ?? 0)
  };
}
