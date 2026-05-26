# 세로 조각 smoke 체크리스트 v1

작성일: 2026-05-26

## 상태

- 상태: 초기 Phaser scaffold 검증 일부 완료
- 기준 문서: `docs/vertical-slice-acceptance.md`
- 기준 후보: `docs/vertical-slice-content-candidates.md`
- 목적: 첫 Phaser 세로 조각이 통과해야 할 검사 항목을 쪼갠다.
- 아직 아님: 전체 세로 조각 통과, 전투 규칙 통과, 전체 루프 통과, 최종 에셋 검증

## 상태값

| 상태 | 의미 |
| --- | --- |
| Not started | 아직 구현이나 검증이 없다. |
| Implemented, not verified | 구현은 있으나 검증이 끝나지 않았다. |
| Needs fix | 검증에서 문제가 나왔다. |
| Verified | 검사 기준을 충족했다. |
| Blocked | 도구, 자료, 결정 부족으로 진행할 수 없다. |

## 실행 전 검사

| ID | 검사 | 방법 | 현재 상태 |
| --- | --- | --- | --- |
| PRE-001 | Phaser 앱이 Vite로 실행된다. | `npm.cmd run dev`, `npm.cmd run phaser:smoke` | Verified |
| PRE-002 | TypeScript 타입 오류가 없다. | `npm.cmd run check` | Verified |
| PRE-003 | 데이터 파일이 로드된다. | `BootScene`, `npm.cmd run phaser:smoke` | Verified |
| PRE-004 | 에셋 manifest 누락이 없다. | `npm.cmd run slice:validate` | Verified |
| PRE-005 | 디버그 진입 플래그가 있다. | `?debug=1&entry=combat`, `?debug=1&entry=boss` | Verified |

## 데이터 검사

| ID | 검사 | 방법 | 현재 상태 |
| --- | --- | --- | --- |
| DATA-001 | 모든 콘텐츠에 `id`가 있다. | `npm.cmd run slice:validate` | Verified |
| DATA-002 | 모든 표시 콘텐츠에 한글 이름과 설명이 있다. | `npm.cmd run slice:validate` | Verified |
| DATA-003 | 모든 세로 조각 콘텐츠에 `referenceRole`이 있다. | `npm.cmd run slice:validate` | Verified |
| DATA-004 | 모든 `referenceRole`이 `reference-role-map-slice-v1.md`에 있다. | `npm.cmd run slice:validate` | Verified |
| DATA-005 | 모든 에셋 키가 manifest에 있다. | `npm.cmd run slice:validate` | Verified |
| DATA-006 | 카드 설명과 실제 효과 op가 어긋나지 않는다. | effect audit | Not started |
| DATA-007 | 세이브에는 Phaser 객체가 들어가지 않는다. | save serialization check | Implemented, not verified |

## 화면 검사

| ID | 검사 | 방법 | 현재 상태 |
| --- | --- | --- | --- |
| UI-001 | 마을 화면에서 시작 버튼과 진행 상태가 보인다. | desktop screenshot | Not started |
| UI-002 | 월드맵에서 `등불 현관` 진입이 가능하다. | click flow | Not started |
| UI-003 | 던전 시야가 정적 메뉴가 아니라 방/방향 감각을 준다. | screenshot + interaction | Not started |
| UI-004 | 전투 화면에 손패 5장, HP, 기운, 적 의도가 보인다. | screenshot | Implemented, not verified |
| UI-005 | 보상 화면에서 선택지와 추천 이유가 보인다. | click flow | Not started |
| UI-006 | 룬 작업대에서 장착 전후 변화가 보인다. | click flow | Not started |
| UI-007 | 보스전에서 일반 몬스터보다 큰 실루엣과 페이즈 신호가 보인다. | screenshot | Implemented, not verified |
| UI-008 | 결과 화면에서 해금과 마을 복귀가 보인다. | full loop | Not started |

## 전투 검사

| ID | 검사 | 방법 | 현재 상태 |
| --- | --- | --- | --- |
| COMBAT-001 | `햇살 찌르기`가 앞 적에게 피해를 준다. | debug combat | Not started |
| COMBAT-002 | `접힌 방패`가 보호막을 올린다. | debug combat | Not started |
| COMBAT-003 | `책장 넘기기`가 카드 드로우를 만든다. | debug combat | Not started |
| COMBAT-004 | 적 공격 의도가 턴 종료 때 실제 피해로 이어진다. | turn flow | Not started |
| COMBAT-005 | 피격, 피해 숫자, 로그가 같은 결과를 말한다. | screenshot + log | Not started |
| COMBAT-006 | 룬 장착 후 카드 수치가 실제로 바뀐다. | before/after check | Not started |
| COMBAT-007 | 보스 페이즈가 HP 조건에서 한 번 발동한다. | boss debug | Not started |

## 루프 검사

| ID | 검사 | 방법 | 현재 상태 |
| --- | --- | --- | --- |
| LOOP-001 | 마을에서 스테이지로 진입한다. | full loop | Not started |
| LOOP-002 | 첫 전투 승리 후 보상으로 이어진다. | full loop | Not started |
| LOOP-003 | 보상 선택 후 룬 장착으로 이어진다. | full loop | Not started |
| LOOP-004 | 룬 장착 효과가 다음 전투에 반영된다. | full loop | Not started |
| LOOP-005 | 보스 클리어 후 해금이 생긴다. | full loop | Not started |
| LOOP-006 | 해금 상태가 마을 복귀 후 보인다. | full loop | Not started |
| LOOP-007 | 새로고침 후 최소 진행 상태가 복원된다. | save reload | Not started |

## 반응형 검사

| ID | 검사 | 방법 | 현재 상태 |
| --- | --- | --- | --- |
| VIEW-001 | 1920x1080에서 카드 5장과 적 의도가 겹치지 않는다. | screenshot | Not started |
| VIEW-002 | 1280x720에서 핵심 텍스트가 잘리지 않는다. | screenshot | Implemented, not verified |
| VIEW-003 | 브라우저 콘솔에 런타임 오류가 없다. | `npm.cmd run phaser:smoke` | Verified |
| VIEW-004 | 디버그 패널이 전투 핵심 UI를 가리지 않는다. | screenshot | Implemented, not verified |

## 현재 검증 결과

- `npm.cmd run slice:validate`: 통과
- `npm.cmd run check`: 통과
- `npm.cmd run phaser:smoke`: 통과
- `git diff --check`: 통과

`phaser:smoke`는 `tmp/phaser-TownScene.png`, `tmp/phaser-CombatScene.png`, `tmp/phaser-BossScene.png`를 생성한다. `tmp/`는 검증 산출물이며 Git에 포함하지 않는다.

## 통과 판정

세로 조각을 통과로 말하려면 아래 조건이 모두 필요하다.

1. `PRE`, `DATA`, `UI`, `COMBAT`, `LOOP`, `VIEW` 그룹의 필수 항목이 `Verified`다.
2. 남은 `Needs fix` 항목이 없다.
3. `Blocked` 항목이 있으면 범위 밖인지 사용자가 승인해야 한다.
4. 검증 결과와 스크린샷 경로를 문서에 남긴다.
5. 통과 후에도 원작 95% 유사도나 전체 게임 완성으로 말하지 않는다.

## 다음 작업

1. 실제 combat simulation을 연결하고 `COMBAT-*` 항목을 검증한다.
2. 마을 -> 월드맵 -> 던전 -> 전투 -> 보상 -> 룬 -> 보스 -> 결과 흐름을 연결한다.
3. UI screenshot 검수 기준을 `phaser:smoke`에 더 촘촘히 추가한다.
