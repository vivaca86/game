# 구현 착수 체크리스트 v1

작성일: 2026-05-26

## 문서 상태

- 상태: 1차 scaffold 작성 후 갱신
- 목적: 실제 Phaser scaffold를 시작할 때 범위가 흔들리지 않게 한다.
- 아직 하지 않은 것: 전체 루프 구현, 실제 카드 전투 규칙 연결, 최종 에셋 생성, 전체 smoke 통과

## 착수 전 확인

| 항목 | 상태 | 기준 |
| --- | --- | --- |
| 구조 계획 | Done | `docs/phaser-project-structure-plan.md` |
| 부트 플로우 | Done | `docs/phaser-boot-flow-plan.md` |
| 디버그 진입 | Done | `docs/debug-entry-plan.md` |
| 데이터 fixture 검증 | Done | `npm.cmd run slice:validate` |
| 실제 `src/` 생성 | Done | `src/main.ts`, `src/app/`, `src/phaser/` |
| Phaser/Vite dependency 설치 | Done | `package.json`, `package-lock.json` |
| 브라우저 실행 검증 | Done | `npm.cmd run phaser:smoke` |

## 첫 구현 범위

첫 구현에서 포함할 것:

1. `Phaser 3 + TypeScript + Vite` scaffold
2. `src/` 폴더 구조 생성
3. `docs/game-data-types.v1.ts`를 `src/data/schema.ts`로 이관
4. `docs/vertical-slice-data.fixture.v1.json`을 runtime fixture로 이관
5. `docs/asset-manifest.slice.v1.json`을 runtime manifest로 이관
6. `BootScene`, `PreloadScene`, 최소 `TownScene` entry 생성
7. URL debug flag parser 생성
8. `?debug=1&entry=combat`가 최소 debug state까지 들어가는 경로 생성
9. `npm.cmd run slice:validate` 유지

첫 구현에서 제외할 것:

- 최종 아트 에셋 완성
- 전체 카드/몬스터 수량 확장
- 원작 95% 유사도 판정
- 모바일 최적화 완료
- 전체 세이브 migration 완성
- 모든 smoke 항목 완료 판정

## 첫 구현 검증 계획

1. `npm.cmd run slice:validate`
2. `git diff --check`
3. TypeScript/Vite build 또는 dev server 실행
4. 브라우저 콘솔 오류 확인
5. `?debug=1&entry=town`
6. `?debug=1&entry=combat`
7. `?debug=1&entry=boss`
8. 1920x1080 screenshot
9. 1280x720 screenshot

현재 scaffold에서는 1-7번을 수행했다. 1920x1080/1280x720 세부 시각 검수는 다음 UI smoke 확장에서 더 촘촘히 확인한다.

## 이번 scaffold에서 완료된 것

- `Phaser 3 + TypeScript + Vite` dependency와 scripts를 추가했다.
- 기존 정적 앱 파일은 삭제하지 않고, `legacy:*` scripts로 분리했다.
- `src/data/schema.ts`, `src/data/fixtures/vertical-slice.v1.json`, `src/data/assetManifest.slice.v1.json`을 만들었다.
- `BootScene`, `PreloadScene`, `TownScene`, debug entry용 최소 scene들을 만들었다.
- `?debug=1&entry=combat`, `?debug=1&entry=boss`를 smoke 대상으로 확인했다.

## 다음 결정 필요

실제 구현 착수 직전에는 아래 결정을 확인한다.

- `docs/` fixture를 계속 원본으로 둘지, `src/data/` fixture를 원본으로 승격할지
- `encounterPoolId`를 지금 분리할지, 첫 scaffold 이후로 미룰지
- 실제 simulation 시스템을 어느 순서로 연결할지
