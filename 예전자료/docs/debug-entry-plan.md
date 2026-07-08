# 디버그 진입 계획 v1

작성일: 2026-05-26

## 문서 상태

- 상태: 구현 전 debug entry 확정안
- 기준 문서: `docs/vertical-slice-acceptance.md`, `docs/vertical-slice-smoke-checklist.md`
- 아직 하지 않은 것: 실제 debug overlay, URL parser, debug action 구현

## 목표

디버그 도구는 나중에 붙이는 편의 기능이 아니라 세로 조각 검증의 일부다. 특정 전투, 보스, 보상, 룬 장착, 저장 상태로 바로 들어갈 수 있어야 기반 작업을 검증할 수 있다.

## URL query 초안

기본 형태:

```text
?debug=1&entry=combat&stage=stage_lantern_foyer&seed=dev-001
```

지원할 query:

| Query | 예시 | 의미 |
| --- | --- | --- |
| `debug` | `debug=1` | debug mode 활성화 |
| `entry` | `entry=town` | 시작 scene 또는 상태 선택 |
| `stage` | `stage=stage_lantern_foyer` | stage id 지정 |
| `room` | `room=room_intro_combat` | dungeon room id 지정 |
| `enemy` | `enemy=enemy_folded_sentry` | combat debug 적 지정 |
| `boss` | `boss=boss_curtain_lion` | boss debug 대상 지정 |
| `seed` | `seed=dev-001` | 결정적 테스트 seed |
| `deck` | `deck=starter` | 시작 deck preset |
| `grantCard` | `grantCard=card_sun_jab` | 시작 시 카드 지급 |
| `grantRune` | `grantRune=rune_paper_spark` | 시작 시 룬 지급 |
| `grantRelic` | `grantRelic=relic_brass_bookmark` | 시작 시 유물 지급 |
| `rewardPool` | `rewardPool=reward_pool_foyer_common` | 보상 후보 테스트 |
| `resetSave` | `resetSave=1` | debug save 초기화 |
| `showLog` | `showLog=1` | 전투/상태 로그 표시 |

## `entry` 값

| Entry | 시작 위치 | 필요한 기본 데이터 |
| --- | --- | --- |
| `town` | `TownScene` | character, save, unlocks |
| `world_map` | `WorldMapScene` | stages, unlocks |
| `dungeon` | `DungeonScene` | stage, route |
| `combat` | `CombatScene` | character, deck, enemy, room |
| `reward` | `RewardScene` | rewardPool, run state |
| `rune_bench` | `RuneBenchScene` | deck, runes |
| `boss` | `BossScene` | boss, stage, deck |
| `result` | `ResultScene` | clear state, unlock result |

없는 id를 받으면 fallback하지 않고 debug error로 처리한다.

## Debug action 목록

첫 구현에서 필요한 action:

- fixture 다시 로드
- data validation 다시 실행
- save 초기화
- stage 시작
- room으로 이동
- combat 시작
- boss 시작
- 보상 풀 열기
- 카드 지급
- 룬 지급
- 유물 지급
- HP/기운 테스트 값 설정
- 적 의도 강제 선택
- 보스 페이즈 강제 전환
- 전투 승리 처리
- stage clear 처리
- 현재 simulation state JSON 보기

debug action은 simulation API를 통해서만 상태를 바꾼다. Phaser scene 내부 객체를 직접 고쳐서 테스트가 통과한 것처럼 보이면 안 된다.

## Debug overlay

첫 debug overlay는 DOM으로 만든다.

필수 표시:

- 현재 scene
- 현재 entry
- seed
- stage, room, enemy 또는 boss id
- player HP, energy
- hand card ids
- enemy intents
- reward pool id
- save version
- 마지막 action log
- data validation 결과

필수 조작:

- entry 이동
- save reset
- grant card/rune/relic
- run validation
- show combat log toggle

debug overlay는 최종 UI 품질 기준이 아니다. 다만 개발자가 상태를 검증하기 충분해야 한다.

## 안전 기준

- debug mode는 URL query 또는 local dev flag가 있을 때만 켠다.
- debug save와 일반 save를 구분한다.
- debug placeholder가 보이면 화면과 로그에 placeholder임을 표시한다.
- debug action으로 만든 성공 상태를 일반 플레이 통과로 말하지 않는다.
- `docs/vertical-slice-smoke-checklist.md`의 상태는 실제 확인 후에만 갱신한다.

## Smoke checklist 연결

| Smoke 항목 | debug entry |
| --- | --- |
| `PRE-005` | `?debug=1` |
| `DATA-*` | `run validation` action |
| `COMBAT-*` | `?debug=1&entry=combat` |
| `LOOP-004` | `?debug=1&entry=rune_bench` 후 combat 재진입 |
| `VIEW-*` | `?debug=1&entry=dungeon`, `combat`, `boss` |
