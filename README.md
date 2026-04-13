# HTML5 Game Harness (Phaser + TypeScript + Vite)

턴마다 사건 카드를 받고 선택지를 고르는 **위기 생존형 회사 운영 게임** 프로토타입이다.

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
1. 턴 시작
2. 사건 카드 표시
3. 선택지 클릭으로 자원 변화 반영
4. 다음 턴 진행
5. 자원 고갈 혹은 최대 턴 달성 시 엔딩

## Project Structure
- `src/core`: 게임 상태 모델
- `src/data`: 사건/선택지 데이터 테이블
- `src/ui`: Phaser Scene 및 화면 렌더링
- `src/systems`: 턴 해석기/부트스트랩
