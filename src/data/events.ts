import type { Phase } from '../core/gameState';

export interface ChoiceEffect {
  money?: number;
  morale?: number;
  reputation?: number;
  risk?: number;
  progress?: number;
  quality?: number;
  stability?: number;
  hype?: number;
}

export interface EventChoice {
  id: string;
  label: string;
  effect: ChoiceEffect;
}

export interface GameEvent {
  id: string;
  phase: Phase;
  title: string;
  description: string;
  choices: EventChoice[];
}

const DEVELOPMENT_EVENTS: GameEvent[] = [
  {
    id: 'feature-freeze',
    phase: 'development',
    title: '기능 동결 시점',
    description: '더 만들면 일정은 밀리고, 멈추면 완성도가 아쉽다.',
    choices: [
      { id: 'ship-now', label: '지금 범위 고정', effect: { progress: 12, quality: 3, morale: 1, hype: -1 } },
      { id: 'add-feature', label: '핵심 기능 1개 추가', effect: { progress: 5, quality: 7, morale: -2, risk: 1 } },
      { id: 'polish-only', label: '버그 픽스 집중', effect: { progress: 7, stability: 8, money: -2, morale: -1 } }
    ]
  },
  {
    id: 'hiring-window',
    phase: 'development',
    title: '경력자 영입 기회',
    description: '비용은 크지만 개발 속도를 올릴 수 있다.',
    choices: [
      { id: 'senior-hire', label: '시니어 채용', effect: { money: -4, progress: 10, quality: 4, morale: 1 } },
      { id: 'contractor', label: '단기 외주', effect: { money: -2, progress: 6, risk: 1 } },
      { id: 'skip-hire', label: '현 인력 유지', effect: { money: 1, morale: -1, progress: 2 } }
    ]
  },
  {
    id: 'marketing-preview',
    phase: 'development',
    title: '사전 마케팅 제안',
    description: '홍보를 빨리 시작하면 관심을 끌 수 있지만 역효과도 있다.',
    choices: [
      { id: 'big-campaign', label: '공격적 사전 홍보', effect: { money: -3, hype: 10, reputation: 2, risk: 1 } },
      { id: 'community-post', label: '커뮤니티 중심 공개', effect: { hype: 5, reputation: 1 } },
      { id: 'silent-dev', label: '조용히 개발 지속', effect: { quality: 2, stability: 2, hype: -2 } }
    ]
  }
];

const LIVE_EVENTS: GameEvent[] = [
  {
    id: 'server-alert',
    phase: 'live',
    title: '서버 과부하 경고',
    description: '동접이 늘면서 인프라가 한계에 가까워졌다.',
    choices: [
      { id: 'scale-up', label: '서버 증설', effect: { money: -4, stability: 10, reputation: 1 } },
      { id: 'hotfix', label: '핫픽스 대응', effect: { stability: 5, quality: -1, morale: -1 } },
      { id: 'ignore', label: '지켜본다', effect: { money: 1, stability: -8, reputation: -2, risk: 2 } }
    ]
  },
  {
    id: 'community-drama',
    phase: 'live',
    title: '커뮤니티 논란',
    description: '밸런스에 대한 불만이 급증하고 있다.',
    choices: [
      { id: 'transparent-note', label: '로드맵 공개', effect: { reputation: 3, morale: -1, quality: 1 } },
      { id: 'silent', label: '대응 미룸', effect: { reputation: -3, money: 1, risk: 2 } },
      { id: 'fast-patch', label: '긴급 패치', effect: { stability: 4, quality: 2, morale: -2, money: -2 } }
    ]
  },
  {
    id: 'platform-feature',
    phase: 'live',
    title: '스토어 메인 피처드 제안',
    description: '프로모션 참여 시 단기 유입이 커질 수 있다.',
    choices: [
      { id: 'join-feature', label: '프로모션 참여', effect: { money: -2, hype: 8, reputation: 1 } },
      { id: 'organic-liveops', label: '자체 이벤트', effect: { hype: 4, quality: 2 } },
      { id: 'skip-feature', label: '참여 보류', effect: { money: 1, stability: 1 } }
    ]
  }
];

export function getEventForTurn(turn: number, phase: Phase): GameEvent {
  const deck = phase === 'development' ? DEVELOPMENT_EVENTS : LIVE_EVENTS;
  return deck[(turn - 1) % deck.length];
}
