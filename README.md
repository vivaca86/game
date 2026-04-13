# HTML5 Game Harness (Phaser + TypeScript + Vite)

작은 게임회사로 시작해 게임을 개발/출시/운영하며 회사를 키워가는 **턴제 밸런스 경영 게임** 프로토타입이다.

## Requirements
- Node.js 20+
- npm 10+

## Setup
```bash
npm install
```

## Run (Dev)
```bash
npm run dev
```

## Build
```bash
npm run build
```

## Validation
```bash
npm run typecheck
npm run lint
```

## Current Gameplay Loop
1. 개발 단계에서 사건 대응으로 진척/품질/안정성/하이프를 관리
2. 진척 100% 달성 시 자동 출시 → 라이브 운영 단계 전환
3. 라이브 단계에서 사건 대응 + 동접/매출 정산
4. 파산/팀붕괴/시장퇴출을 피하며 턴 종료 시 회사 티어 엔딩 달성

## Save / Load
- `S`: 현재 상태 저장
- `L`: 저장 상태 불러오기
- `C`: 저장 데이터 삭제

## End Report
런 종료 시 아래 항목을 요약 표시한다.
- 최종 엔딩
- 회사 티어
- 생존 턴 및 실패 원인
- 최대 동접 / 누적 매출 / 최종 품질

## Core Systems
- `src/core`: 게임 상태(자원, 제품 지표, 라이브 지표, 단계)
- `src/data`: 단계별 사건 카드 데이터
- `src/systems`: 턴 해석기, 개발/라이브 정산, 저장/불러오기, 엔딩 평가
- `src/ui`: UI 렌더링 및 플레이 입력 처리

## Event Progression
- 턴 구간별 난이도 가중치로 사건 풀이 확장된다.
- 초반(1~4턴): 난이도 1 중심
- 중반(5~10턴): 난이도 2 포함
- 후반(11턴+): 난이도 3 포함
