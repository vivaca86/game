# 구현 착수 체크리스트 v1

작성일: 2026-05-26

## 문서 상태

- 상태: 다음 작업 체크리스트
- 목적: 실제 Phaser scaffold를 시작할 때 범위가 흔들리지 않게 한다.
- 아직 하지 않은 것: scaffold 생성, dependency 설치, 브라우저 smoke

## 착수 전 확인

| 항목 | 상태 | 기준 |
| --- | --- | --- |
| 구조 계획 | Done | `docs/phaser-project-structure-plan.md` |
| 부트 플로우 | Done | `docs/phaser-boot-flow-plan.md` |
| 디버그 진입 | Done | `docs/debug-entry-plan.md` |
| 데이터 fixture 검증 | Done | `npm.cmd run slice:validate` |
| 실제 `src/` 생성 | Not done | 다음 작업 |
| Phaser/Vite dependency 설치 | Not done | 사용자 승인 또는 명시 지시 필요 |
| 브라우저 실행 검증 | Not done | Phaser 앱 생성 후 가능 |

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

3번 이후는 실제 scaffold가 생긴 뒤에만 가능하다.

## 다음 결정 필요

실제 구현 착수 직전에는 아래 결정을 확인한다.

- 기존 `package.json`을 Vite/Phaser 기준으로 교체할지, 새 scripts를 병행할지
- Phaser/Vite/TypeScript dependency를 설치할지
- 기존 정적 앱 `src/` 흔적을 유지할지, 새 구조로 교체할지
- `docs/` fixture를 계속 원본으로 둘지, `src/data/` fixture를 원본으로 승격할지
- `encounterPoolId`를 지금 분리할지, 첫 scaffold 이후로 미룰지
