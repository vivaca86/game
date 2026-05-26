# Game Repository

## 프로젝트 최상위 규칙

작업 운영 규칙은 `PROJECT_RULES.md`를 최우선 기준으로 따른다.

이 저장소는 이전 정적 카드 크롤러 구현물을 기준으로 이어가지 않는다.

현재 남기는 기준은 세 가지다.

- `research/`: 2026-05-22까지 진행한 방대한 게임 조사/역기획 자료
- 새 개발 기반 문서: `docs/development-foundation.md`, `docs/data-schema-draft.md`, `docs/reference-role-map-template.md`, `docs/vertical-slice-acceptance.md`
- 새 Phaser 골조: `src/main.ts`, `src/app/`, `src/phaser/`, `src/data/`, `src/debug/`, `src/save/`
- 이전 앱/감사 산출물: `src/`, `tools/`, `docs/vertical-slice/` 아래의 밝은 카드 던전 실험, 품질 감사, 인수인계, 손패 5장 검증 샘플

## 먼저 볼 문서

- `docs/development-foundation.md`: 2026-05-26 이후 새 게임 개발 기반 결정
- `docs/phaser-project-structure-plan.md`: Phaser 프로젝트 폴더와 책임 경계 계획
- `docs/phaser-boot-flow-plan.md`: Phaser 부트, preload, entry scene 순서 계획
- `docs/debug-entry-plan.md`: URL debug entry와 debug action 계획
- `docs/implementation-start-checklist.md`: 실제 구현 착수 전 체크리스트
- `docs/data-schema-draft.md`: 데이터 스키마 초안
- `docs/game-data-types.v1.ts`: TypeScript 타입 초안
- `docs/vertical-slice-data.fixture.v1.json`: 첫 세로 조각 데이터 fixture
- `docs/asset-manifest.slice.v1.json`: 첫 세로 조각 planned asset manifest
- `docs/validation-rules-v1.md`: fixture/manifest 검증 기준
- `docs/reference-role-map-template.md`: 원작 기능 역할 대응표 양식
- `docs/reference-role-map-slice-v1.md`: 첫 세로 조각 원작 대응표
- `docs/vertical-slice-acceptance.md`: 새 세로 조각 통과 기준
- `docs/vertical-slice-content-candidates.md`: 첫 세로 조각 콘텐츠 후보
- `docs/vertical-slice-smoke-checklist.md`: smoke 체크리스트
- `docs/source-version-baseline.md`: 원작 source/version 기준선
- `docs/current-issues-and-plan.md`: 현재 문제점, 반복 실패, 해결 방법
- `docs/handoff.md`: 다른 개발자가 이어받기 위한 인수인계서
- `docs/recovery-audit.md`: 현재 산출물 중 믿을 수 있는 것과 폐기할 것
- `RESEARCH_CHECKLIST.md`: 조사 기준과 남은 검증 항목

## 실행

```powershell
npm.cmd run dev
```

브라우저:

```text
http://127.0.0.1:5173/
```

디버그 진입:

```text
http://127.0.0.1:5173/?debug=1&entry=combat
http://127.0.0.1:5173/?debug=1&entry=boss
```

예전 정적 샘플은 legacy 명령으로만 확인한다.

```powershell
npm.cmd run legacy:dev
```

## 검증

```powershell
npm.cmd run slice:validate
npm.cmd run slice:effects
npm.cmd run assets:audit
npm.cmd run check
npm.cmd run phaser:smoke
```

PowerShell 실행 정책 때문에 `npm run ...`이 막히는 환경에서는 아래처럼 실행한다.

```powershell
npm.cmd run slice:validate
```

`content-quality-audit.mjs`가 현재 본편을 `BLOCKED`로 보는 것은 의도된 상태다. 본편 그래픽/데이터가 아직 최종 품질이 아니라는 보호 장치다.

`slice:validate`는 2026-05-26 이후 새 세로 조각 fixture와 planned asset manifest의 구조, `referenceRole`, asset key, reward, route 참조를 검사한다.

`slice:effects`는 docs/runtime fixture의 카드 한글 설명과 실제 effect op/amount가 서로 어긋나지 않는지 검사한다.

`assets:audit`은 docs/runtime asset manifest가 서로 갈라지지 않았는지 확인하고, 실제 `assets/runtime` PNG가 생기면 크기와 orphan 파일을 검사한다. 에셋 파이프라인이 시작된 뒤에는 `npm.cmd run assets:audit:strict`를 통과해야 한다.

`phaser:smoke`는 실행 중인 Vite dev server에서 기본 진입, `entry=combat`, `entry=boss` debug 화면의 canvas와 콘솔 오류를 확인한다.

## 정리된 것

아래 이전 구현물은 현재 기준에서 혼동을 만들기 때문에 main에서 제거한다.

- 예전 정적 카드 크롤러 런타임 설명
- 예전 `assets/` 그래픽 묶음
- 예전 `src/content`, `src/rules`, `src/visual`, `src/ui` 기반 런타임
- 예전 `HANDOFF.md`와 구현 중심 README

조사 자료는 `research/`에 보존한다. 2026-05-26 이후 실제 새 개발은 `docs/development-foundation.md`와 새 세로 조각 기준을 우선한다. 기존 `docs/vertical-slice/proof.html`은 과거 검증 샘플이며, 사용자가 다시 게이트로 지정하지 않는 한 현재 개발 승인 기준이 아니다.
