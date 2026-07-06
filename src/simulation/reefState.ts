export type ReefMode = "compact" | "expanded";

export type InputKind =
  | "keyboard"
  | "pointerMove"
  | "pointerTap"
  | "capture"
  | "idlePulse";

export interface InputAction {
  kind: InputKind;
  at: number;
  intensity: number;
  x?: number;
  y?: number;
  key?: string;
}

export interface Visitor {
  id: string;
  nameKo: string;
  moodKo: string;
  discoveredAtKo: string;
}

export interface Discovery {
  id: string;
  titleKo: string;
  detailKo: string;
  atKo: string;
}

export interface ReefState {
  mode: ReefMode;
  tide: number;
  glow: number;
  bubblePressure: number;
  focusSeconds: number;
  idleSeconds: number;
  interactionCount: number;
  lastActivityAt: number;
  visitor: Visitor;
  discoveries: Discovery[];
}

export const reefTuning = {
  compactHeightPx: 56,
  expandedHeightPx: 252,
  keyboardBubbleGain: 0.18,
  pointerBubbleGain: 0.08,
  idleDecayPerSecond: 0.055,
  focusWindowMs: 45_000,
  discoveryThresholds: [3, 9, 18]
} as const;

export const createInitialReefState = (): ReefState => ({
  mode: "compact",
  tide: 0.24,
  glow: 0.38,
  bubblePressure: 0.12,
  focusSeconds: 0,
  idleSeconds: 0,
  interactionCount: 0,
  lastActivityAt: performance.now(),
  visitor: {
    id: "deep-palette-fish",
    nameKo: "심해 팔레트피쉬",
    moodKo: "조용히 따라오는 중",
    discoveredAtKo: "오늘 18:42"
  },
  discoveries: [
    {
      id: "morning-reef",
      titleKo: "작은 산호가 깨어남",
      detailKo: "입력 리듬에 맞춰 리프 조명이 살아났다.",
      atKo: "오늘"
    }
  ]
});

export const setReefMode = (state: ReefState, mode: ReefMode): void => {
  state.mode = mode;
  state.glow = Math.min(1, state.glow + (mode === "expanded" ? 0.24 : 0.08));
};

export const applyInputAction = (
  state: ReefState,
  action: InputAction
): void => {
  const gain =
    action.kind === "keyboard"
      ? reefTuning.keyboardBubbleGain
      : action.kind === "pointerMove"
        ? reefTuning.pointerBubbleGain
        : action.kind === "capture"
          ? 0.22
          : 0.14;

  state.lastActivityAt = action.at;
  state.idleSeconds = 0;
  state.interactionCount += action.kind === "pointerMove" ? 0.18 : 1;
  state.bubblePressure = clamp(
    state.bubblePressure + gain * action.intensity,
    0,
    1
  );
  state.glow = clamp(state.glow + gain * 0.72, 0, 1);

  maybeAddDiscovery(state);
};

export const tickReefState = (
  state: ReefState,
  now: number,
  deltaSeconds: number
): void => {
  const active = now - state.lastActivityAt <= reefTuning.focusWindowMs;

  // Unity port note: focus, idle, and ambient tide are renderer-agnostic
  // values. Keep direct player input out of camera anchors; input should drive
  // reaction particles and creature behavior, not scene position.
  if (active) {
    state.focusSeconds += deltaSeconds;
  } else {
    state.idleSeconds += deltaSeconds;
  }

  state.tide = wrap01(state.tide + deltaSeconds * 0.012);
  state.bubblePressure = clamp(
    state.bubblePressure - reefTuning.idleDecayPerSecond * deltaSeconds,
    0,
    1
  );
  state.glow = clamp(state.glow - deltaSeconds * 0.028, 0.24, 1);
};

const maybeAddDiscovery = (state: ReefState): void => {
  const nextIndex = state.discoveries.length - 1;
  const nextThreshold = reefTuning.discoveryThresholds[nextIndex];
  if (!nextThreshold || state.interactionCount < nextThreshold) {
    return;
  }

  const discoveries: Discovery[] = [
    {
      id: "bubble-current",
      titleKo: "버블 해류 형성",
      detailKo: "키보드 박자가 리프 아래로 작은 물길을 만들었다.",
      atKo: "방금"
    },
    {
      id: "visitor-close",
      titleKo: "방문자가 가까워짐",
      detailKo: "마우스 움직임을 따라 물고기 시선이 부드럽게 이동했다.",
      atKo: "방금"
    },
    {
      id: "calm-loop",
      titleKo: "조용한 업무 루프",
      detailKo: "작업 리듬이 안정되며 산호 빛이 오래 유지된다.",
      atKo: "방금"
    }
  ];

  const discovery = discoveries[nextIndex];
  if (discovery) {
    state.discoveries.unshift(discovery);
  }
};

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const wrap01 = (value: number): number => ((value % 1) + 1) % 1;
