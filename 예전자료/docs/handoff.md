# 프로젝트 인수인계서

작성일: 2026-05-23

> 2026-05-26 업데이트: 이 문서는 이전 정적 HTML/밝은 파스텔 검증 샘플 기준의 복구 인수인계다. 새 개발 기준은 `docs/development-foundation.md`, `docs/data-schema-draft.md`, `docs/reference-role-map-template.md`, `docs/vertical-slice-acceptance.md`를 우선한다. 아래 내용은 과거 산출물의 위험과 보존 범위를 이해하기 위한 참고로 본다.

## 현재 판단

이 프로젝트는 현재 개발 중단 상태다. 기술 골격은 남길 수 있지만, 콘텐츠와 그래픽은 최종품으로 넘기면 안 된다. 다음 개발자는 먼저 `docs/recovery-audit.md`와 이 문서를 읽고, 현재 데이터가 "완성 콘텐츠"가 아니라 "검증용 초안"임을 전제로 이어받아야 한다.

## 실행 방법

- 로컬 서버: `node tools/serve-static.mjs`
- 기본 접속: `http://127.0.0.1:4173/`
- 기존 기술 검증: `node tools/validate-data.mjs`
- 기존 전체 기술 체크: `node tools/validate-data.mjs && node tools/card-balance-audit.mjs && node tools/gem-audit.mjs && node tools/build-item-audit.mjs && node tools/event-audit.mjs && node tools/reward-flow-audit.mjs && node tools/runtime-smoke-test.mjs && node tools/build-static.mjs`
- 품질 감사 보고서: `node tools/content-quality-audit.mjs --report-only`
- 품질 게이트: `node tools/content-quality-audit.mjs`
- 검증 샘플 화면 체크: `node tools/vertical-slice-proof-smoke.mjs`

현재 `content-quality-audit.mjs`는 실패하는 것이 맞다. 실패 이유는 현재 앱 본편 그래픽과 콘텐츠가 최종 기준이 아니라는 뜻이다.

## 쓸 수 있는 것

- 정적 웹 앱 구조
- 한국어 데이터 파일 분리 구조
- 전투, 카드 사용, 보상, 이벤트, 상점, 휴식, 스테이지 진행의 기본 연결
- 저장/프로필/해금 흐름의 개발용 골격
- 데이터 참조 오류를 찾는 검증 스크립트
- 1차 밸런스/역할 분류를 위한 보조 스크립트
- 검증 샘플용 bitmap 아트 소스

## 폐기 대상

- 현재 CSS/DOM 기반 카드 아트, 몬스터 초상, 스테이지 키아트, 이벤트 장면, 보석/유물/기운 아이콘을 최종 그래픽으로 쓰는 계획
- 템플릿으로 대량 생성된 카드/보석/몬스터/스테이지/업적을 그대로 최종 콘텐츠로 쓰는 계획
- "데이터 수량이 맞다"를 "콘텐츠가 완성됐다"로 보는 판단
- 기존 `docs/development-foundation.md`에 적힌 완료 표현

## 데이터 상태

- 카드: 113장 존재. 구조와 참조는 개발용으로 쓸 수 있지만, 효과 구조 반복이 많아 최종 카드군으로 믿으면 안 된다.
- 보석: 58종 존재. 효과 타입이 반복되어 개별 정체성 재설계가 필요하다.
- 캐릭터: 23명 존재. 해금/패시브 구조는 있으나 캐릭터별 플레이 정체성 검증이 필요하다.
- 스테이지: 15개 존재. 방 구성 패턴이 반복되어 스테이지 고유 기믹이 부족하다.
- 적: 60종 존재. 의도 패턴 반복이 많아 몬스터별 전투 경험이 충분하지 않다.
- 이벤트: 10종 존재. 모두 선택지 3개 구조지만 서사/위험/보상 차별화가 약하다.
- 업적: 161개 존재. 대부분 마일스톤형이라 큐레이션이 필요하다.

## 그래픽 상태

본편 앱 그래픽은 아직 최종품이 아니다. 현재 본편의 주요 시각 요소는 CSS/DOM 기반 임시 표현이다.

검증 샘플용으로만 아래 bitmap 소스를 추가했다.

- `docs/vertical-slice/battle-monster-background.png`: 밝은 전투 배경과 몬스터 분위기 검증용
- `docs/vertical-slice/card-sunbean-art.png`: 카드 1장 일러스트 칸 검증용
- `docs/vertical-slice/card-art-sheet.png`: 손패 5장 비교를 위한 추가 카드 일러스트 4종
- `docs/vertical-slice/proof.html`: 손패 5장, 몬스터 1종, 전투 판단 UI를 한 화면에 얹은 정적 검증물

이 샘플이 승인되기 전까지 본편에 대량 적용하지 않는다.

## 시스템 상태

시스템은 "플레이 가능한 골격"까지는 의미가 있다. 하지만 시스템이 돌아간다는 것과 게임 완성도는 다르다.

현재 믿을 수 있는 시스템 범위:

- 카드 비용, 손패, 버림/드로우 흐름
- 기본 피해/보호막/상태 효과 처리
- 적 의도와 턴 진행
- 보상 선택, 보석 장착, 유물/기운 효과 일부 연결
- 스테이지 방 진행과 결과 화면

아직 믿으면 안 되는 시스템 범위:

- 장기 밸런스
- 카드군별 빌드 다양성
- 모든 보석/유물/기운의 조합 안정성
- 보스별 고유 재미
- 업적/해금의 실제 성장 체감

## 검증 샘플 기준

다음 세 가지가 먼저 통과해야 한다.

1. 카드 1장: `햇살 콩알탄`
   - 비용 1, 공격 카드
   - 효과: `앞의 적에게 피해 8. 연쇄 3 이상이면 +4.`
   - 요구 기준: 이름, 비용, 효과, 프레임, 일러스트가 한 장의 실제 카드처럼 보여야 한다.

2. 몬스터 1종: `리본 방울등`
   - 의도: `공격 7`
   - 요구 기준: 기존 IP를 닮지 않은 원본 몬스터로 보이고, 전투 대상이라는 인상이 있어야 한다.

3. 전투 화면 1개
   - 스테이지: `햇살 현관`
   - 플레이어 체력: `42/50`
   - 기운: `3`
   - 요구 기준: 밝은 풍, 손패 5장, 몬스터, UI, 피드백이 한 화면에서 어울려야 한다.
   - 전투는 영상 컷신이 아니라 정적 전투 화면 위에서 카드 사용, 피격, 피해 숫자만 짧게 움직이는 UI 연출을 기본으로 한다.

이 샘플이 "실제 목표 퀄리티"로 인정되지 않으면 개발을 계속하지 않는다. 인정되면 그때부터 이 기준을 본편 카드/몬스터/전투 화면에 이식한다.

## 다음 개발자에게 넘길 순서

1. `node tools/content-quality-audit.mjs --report-only`로 현재 문제를 확인한다.
2. `docs/vertical-slice/proof.html`을 열어 작은 검증물을 본다.
3. `node tools/vertical-slice-proof-smoke.mjs`로 검증 화면의 기본 렌더링을 확인한다.
4. 사용자가 샘플을 승인하지 않으면 본편 개발을 멈춘다.
5. 사용자가 샘플을 승인하면 본편의 CSS 임시 그래픽을 실제 asset 기반 렌더링으로 교체한다.
6. 카드/몬스터/스테이지/보석/업적은 수량 확장이 아니라 한 묶음씩 재기획하고 감사 스크립트를 통과시킨다.
## 2026-06-05 UI Concept Raster Handoff

Current status: `Partially complete`.

The active UI concept-art goal is not complete. The current checkpoint is a WIP save point for continuation.

Read the detailed handoff before continuing:

- `docs/ui-concept-raster-handoff-2026-06-05.md`

Most important continuation notes:

- The user rejected vector/procedural-looking UI. Continue with raster concept art and concept-derived bitmap state assets.
- Do not claim final UI, 95% similarity, release readiness, or user acceptance.
- WorldMap is the current highest-priority mismatch area. It now has runtime current marker, halo, and status badge, but it still lacks full dynamic current/completed/locked state recomposition.
- Latest useful WorldMap evidence screenshot: `tmp/ui-quality/worldmap/worldmap-play-button-action-hover-v1-1920.png`.
- Latest passed checks included `npm.cmd run check`, `node tmp/ui-worldmap-action-hit-target-audit.mjs`, `node tmp/ui-raster-hover-audit.mjs`, `node tmp/ui-raster-down-audit.mjs`, and `node tmp/run-phaser-smoke-with-vite.mjs`.
- `npm.cmd run check` still reports the existing Vite large JS chunk warning; do not treat that as newly solved.
