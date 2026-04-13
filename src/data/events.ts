import type { Phase } from '../core/gameState';

export type EventTag = 'cash' | 'team' | 'quality' | 'liveops' | 'risk' | 'marketing';

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
  difficulty: 1 | 2 | 3;
  tags: EventTag[];
  title: string;
  description: string;
  choices: EventChoice[];
}

const TUTORIAL_EVENTS: GameEvent[] = [
  {
    id: 'tutorial-budget',
    phase: 'development',
    difficulty: 1,
    tags: ['cash', 'team'],
    title: '[튜토리얼] 첫 달 운영비',
    description: '초기 자금은 넉넉하지 않다. 운영 전략을 고르자.',
    choices: [
      { id: 'safe-plan', label: '보수 운영', effect: { money: -1, morale: 1, risk: -1, progress: 2 } },
      { id: 'balanced-plan', label: '균형 운영', effect: { money: -2, morale: 1, progress: 4, quality: 1 } },
      { id: 'aggressive-plan', label: '공격 운영', effect: { money: -3, progress: 7, morale: -1, risk: 1 } }
    ]
  },
  {
    id: 'tutorial-scope',
    phase: 'development',
    difficulty: 1,
    tags: ['quality', 'risk'],
    title: '[튜토리얼] 핵심 기능 확정',
    description: '무엇을 넣고 무엇을 빼는지가 향후 품질을 좌우한다.',
    choices: [
      { id: 'focus-core', label: '핵심만 만든다', effect: { progress: 6, quality: 2, stability: 2 } },
      { id: 'one-more-feature', label: '기능 하나 더', effect: { progress: 8, quality: 1, risk: 1 } },
      { id: 'prototype-fast', label: '프로토타입 우선', effect: { progress: 5, hype: 3, quality: -1 } }
    ]
  },
  {
    id: 'tutorial-team',
    phase: 'development',
    difficulty: 1,
    tags: ['team', 'marketing'],
    title: '[튜토리얼] 팀 분위기와 외부 기대감',
    description: '팀 컨디션과 유저 기대를 함께 관리해야 한다.',
    choices: [
      { id: 'internal-day', label: '팀 케어 데이', effect: { morale: 3, progress: 2, hype: -1 } },
      { id: 'dev-log', label: '개발자 노트 공개', effect: { morale: 1, hype: 4, reputation: 1 } },
      { id: 'silent-sprint', label: '조용히 스퍼트', effect: { progress: 6, morale: -2, risk: 1 } }
    ]
  }
];

const DEVELOPMENT_EVENTS: GameEvent[] = [
  {
    id: 'feature-freeze',
    phase: 'development',
    difficulty: 1,
    tags: ['quality', 'risk'],
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
    difficulty: 1,
    tags: ['team', 'cash'],
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
    difficulty: 1,
    tags: ['marketing', 'risk'],
    title: '사전 마케팅 제안',
    description: '홍보를 빨리 시작하면 관심을 끌 수 있지만 역효과도 있다.',
    choices: [
      { id: 'big-campaign', label: '공격적 사전 홍보', effect: { money: -3, hype: 10, reputation: 2, risk: 1 } },
      { id: 'community-post', label: '커뮤니티 중심 공개', effect: { hype: 5, reputation: 1 } },
      { id: 'silent-dev', label: '조용히 개발 지속', effect: { quality: 2, stability: 2, hype: -2 } }
    ]
  },
  {
    id: 'toolchain-break',
    phase: 'development',
    difficulty: 2,
    tags: ['quality', 'cash'],
    title: '빌드 파이프라인 장애',
    description: 'CI가 깨져 배포 테스트가 중단됐다.',
    choices: [
      { id: 'buy-support', label: '유료 지원 구매', effect: { money: -3, stability: 8, progress: 3 } },
      { id: 'manual-fix', label: '내부 수리', effect: { morale: -2, stability: 5, progress: 2 } },
      { id: 'skip-tests', label: '테스트 축소', effect: { progress: 6, quality: -5, risk: 2 } }
    ]
  },
  {
    id: 'scope-creep',
    phase: 'development',
    difficulty: 2,
    tags: ['risk', 'team'],
    title: '기획 범위 확대 요구',
    description: '핵심 관계자가 기능 추가를 강하게 요청한다.',
    choices: [
      { id: 'accept', label: '요구 수용', effect: { progress: -3, quality: 5, hype: 4, risk: 1 } },
      { id: 'negotiate', label: '기능 축소 협상', effect: { progress: 5, morale: -1, reputation: 1 } },
      { id: 'reject', label: '단호히 거절', effect: { progress: 8, reputation: -2, risk: -1 } }
    ]
  },
  {
    id: 'qa-fire',
    phase: 'development',
    difficulty: 3,
    tags: ['quality', 'risk'],
    title: '치명 버그 다발',
    description: 'QA에서 출시 차단급 버그가 여러 건 확인됐다.',
    choices: [
      { id: 'delay-release', label: '출시 연기', effect: { money: -4, quality: 8, stability: 8, morale: -1 } },
      { id: 'crunch', label: '크런치 모드', effect: { progress: 8, stability: 4, morale: -4, risk: 1 } },
      { id: 'known-issues', label: 'Known Issues로 출고', effect: { progress: 10, quality: -8, reputation: -2, risk: 3 } }
    ]
  }
];

const LIVE_EVENTS: GameEvent[] = [
  {
    id: 'server-alert',
    phase: 'live',
    difficulty: 1,
    tags: ['liveops', 'risk'],
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
    difficulty: 1,
    tags: ['team', 'risk'],
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
    difficulty: 1,
    tags: ['marketing', 'cash'],
    title: '스토어 메인 피처드 제안',
    description: '프로모션 참여 시 단기 유입이 커질 수 있다.',
    choices: [
      { id: 'join-feature', label: '프로모션 참여', effect: { money: -2, hype: 8, reputation: 1 } },
      { id: 'organic-liveops', label: '자체 이벤트', effect: { hype: 4, quality: 2 } },
      { id: 'skip-feature', label: '참여 보류', effect: { money: 1, stability: 1 } }
    ]
  },
  {
    id: 'cheat-wave',
    phase: 'live',
    difficulty: 2,
    tags: ['liveops', 'quality'],
    title: '치트 프로그램 확산',
    description: '상위 랭커 구간에서 어뷰저 신고가 폭증했다.',
    choices: [
      { id: 'anti-cheat', label: '안티치트 도입', effect: { money: -4, stability: 6, reputation: 3 } },
      { id: 'ban-wave', label: '일괄 제재', effect: { reputation: 2, risk: -1, morale: -1 } },
      { id: 'watch', label: '추적 후 대응', effect: { money: 1, reputation: -2, risk: 2 } }
    ]
  },
  {
    id: 'cash-shop-backlash',
    phase: 'live',
    difficulty: 2,
    tags: ['cash', 'marketing', 'risk'],
    title: '과금 모델 반발',
    description: '새 패키지 판매 정책이 유저 반발을 일으켰다.',
    choices: [
      { id: 'discount', label: '가격 인하', effect: { money: -2, reputation: 3, hype: 1 } },
      { id: 'bundle-more', label: '구성품 강화', effect: { money: -1, quality: 2, reputation: 2 } },
      { id: 'hold-line', label: '정책 유지', effect: { money: 3, reputation: -4, risk: 2 } }
    ]
  },
  {
    id: 'major-outage',
    phase: 'live',
    difficulty: 3,
    tags: ['liveops', 'risk'],
    title: '대규모 장애 발생',
    description: '피크 타임에 서버가 장시간 다운됐다.',
    choices: [
      { id: 'full-comp', label: '전면 보상', effect: { money: -5, reputation: 5, stability: 4 } },
      { id: 'small-comp', label: '최소 보상', effect: { money: -2, reputation: -2, stability: 2 } },
      { id: 'no-comp', label: '점검 공지만', effect: { money: 1, reputation: -5, risk: 3 } }
    ]
  }
];

const TURN_DIFFICULTY: Record<number, 1 | 2 | 3> = {
  1: 1,
  2: 1,
  3: 1,
  4: 1,
  5: 2,
  6: 2,
  7: 2,
  8: 2,
  9: 2,
  10: 2,
  11: 3,
  12: 3,
  13: 3,
  14: 3,
  15: 3,
  16: 3
};

function maxDifficultyForTurn(turn: number): 1 | 2 | 3 {
  if (turn in TURN_DIFFICULTY) {
    return TURN_DIFFICULTY[turn];
  }
  return turn > 16 ? 3 : 1;
}

function weightedPick(deck: GameEvent[], turn: number): GameEvent {
  const maxDifficulty = maxDifficultyForTurn(turn);
  const pool = deck.filter((event) => event.difficulty <= maxDifficulty);
  const fallback = pool.length > 0 ? pool : deck;
  const pickIndex = Math.abs((turn * 7 + maxDifficulty * 3) % fallback.length);
  return fallback[pickIndex];
}

export function isTutorialTurn(turn: number, phase: Phase): boolean {
  return phase === 'development' && turn <= TUTORIAL_EVENTS.length;
}

export function getEventForTurn(turn: number, phase: Phase): GameEvent {
  if (isTutorialTurn(turn, phase)) {
    return TUTORIAL_EVENTS[turn - 1];
  }

  const deck = phase === 'development' ? DEVELOPMENT_EVENTS : LIVE_EVENTS;
  return weightedPick(deck, turn);
}
