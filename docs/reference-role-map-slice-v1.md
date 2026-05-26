# 첫 세로 조각 원작 대응표 v1

작성일: 2026-05-26

## 상태

- 상태: 첫 행 채움
- 기준 양식: `docs/reference-role-map-template.md`
- 기준 후보: `docs/vertical-slice-content-candidates.md`
- 목적: 첫 세로 조각 후보가 어떤 기능 역할을 담당하는지 고정한다.
- 아직 아님: 직접 UI 증거 완료, 최종 수치 승인, 원작 95% 판정

## 시스템 대응

| referenceRole | referenceSurface | observedFunction | evidenceRefs | evidenceStatus | ourSystemId | ourFunctionalMatch | ourOriginalization | risk | sliceNeed | notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| run_loop_basic | 진행 흐름 | 마을에서 던전으로 들어가 전투, 보상, 복귀로 이어진다. | `research/gap-map.md`, `research/ui-screens.md` | Source-level | loop_town_dungeon_return | 준비, 진입, 전투, 보상, 복귀 흐름 유지 | 종이극장 마을과 팝업북 던전 무대로 치환 | 원작 세부 UI 증거 부족 | Yes | 세로 조각 루프 |
| card_combat_hand_5 | 전투 | 손패 기반 카드 선택으로 몬스터를 상대한다. | `research/ui-screens.md`, `research/data-cards.md` | Source-level | combat_card_hand_5 | 손패, 비용, 적 의도, 카드 결과 유지 | 카드 프레임/이펙트/문구 독자화 | 정확 수치와 손패 규칙 직접 증거 부족 | Yes | 5장 손패 고정 |
| rune_socket_growth | 카드 성장 | 카드에 룬/보석을 장착해 효과를 바꾼다. | `research/gem-gap-map.md`, `research/systems-rules.md` | Needs direct proof | system_rune_socket | 장착 전후 카드 효과 변화 유지 | 유리종이 룬과 종이 작업대 UI | 장착 제한과 소모 규칙 불명확 | Yes | 장착 이벤트로 축소 |
| boss_phase_gate | 보스전 | 보스가 체력/패턴 변화로 런의 문턱이 된다. | `research/enemy-gap-map.md`, `research/ui-screens.md` | Needs direct proof | system_boss_phase | 페이즈, 큰 위협, 클리어 보상 유지 | 커튼 사자무대의 무대 장치 변화 | 페이즈 원작 증거 부족 | Yes | 첫 보스 축소 적용 |

## 콘텐츠 대응

| referenceRole | referenceSurface | observedFunction | evidenceRefs | evidenceStatus | ourContentId | ourDisplayNameKo | ourFunctionalMatch | ourOriginalization | risk | sliceNeed | notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| starter_balanced_character | character | 기본 캐릭터로 전투 흐름을 검증한다. | `research/character-gap-map.md` | Source-level | char_mina_pagehand | 미나 종이손 | 공격/방어/기술 모두 테스트 가능한 기본형 | 종이극장 조수 콘셉트 | 캐릭터 원작 직접 대응 없음 | Yes | 세로 조각 테스트 캐릭터 |
| first_slice_stage | stage | 첫 스테이지가 전투, 보상, 보스 흐름을 제공한다. | `research/stage-gap-map.md` | Source-level | stage_lantern_foyer | 등불 현관 | 한 런의 축소 루프 제공 | 밝은 등불 현관 무대 | 원작 stage 라벨과 직접 대응 금지 | Yes | 첫 구현 스테이지 |
| starter_cost_1_attack | card | 낮은 비용의 기본 공격 카드 | `research/card-gap-map.md` | Needs direct proof | card_sun_jab | 햇살 찌르기 | 초반 공격 판단 제공 | 햇살/종이 이펙트 카드 | 피해 수치 draft | Yes | 시작 덱 핵심 |
| starter_basic_guard | card | 기본 방어 카드 | `research/card-gap-map.md` | Needs direct proof | card_fold_guard | 접힌 방패 | 피해를 막는 기본 선택지 | 접힌 종이 방패 | 보호막 수치 draft | Yes | 시작 덱 핵심 |
| starter_draw_cycle | card | 손패 순환 카드 | `research/card-gap-map.md` | Needs direct proof | card_page_step | 책장 넘기기 | 드로우와 다음 행동 연결 | 페이지 넘김 연출 | 비용/드로우 규칙 draft | Yes | 손패 흐름 검증 |
| starter_chain_attack | card | 연쇄 조건 공격 카드 | `research/systems-rules.md` | Source-level | card_ribbon_snap | 리본 튕기기 | 연쇄 보상 판단 | 리본 스냅 이펙트 | 연쇄 기준 draft | Yes | 연쇄 UI 검증 |
| starter_mark_setup | card | 표식/대상 설정 카드 | `research/systems-rules.md` | Source-level | card_lamplight_mark | 등불 표식 | 다음 피해 증가 준비 | 등불 스티커 표식 | 표식 공식 draft | Yes | 상태 UI 검증 |
| basic_socket_modifier | rune_or_gem | 카드에 장착해 효과를 바꾼다. | `research/gem-gap-map.md` | Needs direct proof | rune_paper_spark | 종이 불씨 룬 | 공격 카드 피해 증가 | 유리종이 불씨 토큰 | 장착 제한 증거 부족 | Yes | 장착 검증 1 |
| defense_socket_modifier | rune_or_gem | 방어 카드에 장착해 방어 효율을 바꾼다. | `research/gem-gap-map.md` | Needs direct proof | rune_glass_leaf | 유리잎 룬 | 보호막 증가 | 투명 유리종이 잎 토큰 | 장착 제한 증거 부족 | Yes | 장착 검증 2 |
| early_basic_attacker | enemy | 초반 기본 공격 적 | `research/enemy-gap-map.md` | Needs direct proof | enemy_folded_sentry | 접힌 파수꾼 | 공격 의도와 피격 확인 | 접힌 종이 경비 형태 | 원작 몬스터 직접 대응 없음 | Yes | 첫 전투 적 |
| early_light_disruptor | enemy | 초반 방해 적 | `research/enemy-gap-map.md` | Needs direct proof | enemy_ink_mote | 잉크 얼룩불 | 비용 압박 또는 상태 방해 | 잉크 얼룩과 종이 불빛 | 방해 공식 draft | Yes | 압박 전투 적 |
| first_boss_phase_gate | boss | 첫 보스 문턱 | `research/enemy-gap-map.md` | Needs direct proof | boss_curtain_lion | 커튼 사자무대 | 페이즈와 클리어 보상 제공 | 거대한 팝업 무대 장치 | 페이즈 수치 draft | Yes | 첫 보스 |
| first_reward_relic | relic | 보스 클리어 보상 | `research/relic-gap-map.md` | Source-level | relic_brass_bookmark | 황동 책갈피 | 다음 런 성장 신호 | 황동 책갈피 소품 | 효과 수치 draft | Yes | 보스 보상 |

## UI 대응

| referenceRole | screen | userGoal | requiredInformation | evidenceRefs | evidenceStatus | ourScreenId | ourOriginalization | sliceNeed | notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| town_entry | 마을 | 다음 런 준비 | 해금, 시작 버튼, 현재 진행 | `research/town-gap-map.md` | Needs direct proof | screen_town_stage | 종이 무대 책상 마을 | Yes | 시설은 최소화 |
| world_map_entry | 월드맵 | 스테이지 선택 | 열린 스테이지, 잠긴 스테이지, 보상 | `research/stage-gap-map.md` | Source-level | screen_world_map | 팝업북 목차형 지도 | Yes | 1개 스테이지 우선 |
| dungeon_view | 던전 시야 | 다음 방으로 진행 | 현재 방, 방향감, 다음 방 힌트 | `research/ui-screens.md` | Source-level | screen_dungeon_view | 레이어드 종이 무대 시야 | Yes | 좌우 회전 감각 필요 |
| combat_main | 전투 | 이번 턴 판단 | HP, 기운, 손패 5장, 적 의도, 로그 | `research/ui-screens.md` | Source-level | screen_combat_main | 종이극장 전투판 | Yes | 1920/1280 검증 |
| rune_bench | 장착 | 카드 성장 | 카드 슬롯, 룬 후보, 전후 효과 | `research/gem-gap-map.md` | Needs direct proof | screen_rune_bench | 접힌 작업대 | Yes | 실제 효과 반영 필수 |
| run_result | 결과/복귀 | 진행 확인 | 클리어, 해금, 마을 복귀 | `research/ui-screens.md` | Source-level | screen_run_result | 무대 커튼 종료판 | Yes | 세이브 확인 |

## 밸런스 draft

| referenceRole | valueType | observedRange | evidenceRefs | evidenceStatus | ourInitialValue | lockState | verificationNeed | notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| starter_attack_damage | card_value | 미확정 | `research/card-gap-map.md` | Needs direct proof | 7 | draft | 첫 전투 3-5턴 목표 | 확정 수치 아님 |
| starter_guard_block | card_value | 미확정 | `research/card-gap-map.md` | Needs direct proof | 6 | draft | 공격 6을 막는지 확인 | 확정 수치 아님 |
| early_enemy_hp | enemy_value | 미확정 | `research/enemy-gap-map.md` | Needs direct proof | 18-24 | draft | 카드 3-4회로 처치 후보 | 확정 수치 아님 |
| first_boss_hp | boss_value | 미확정 | `research/enemy-gap-map.md` | Needs direct proof | 64 | draft | 장착 후 6-8턴 목표 | 확정 수치 아님 |

## 다음 작업

1. 이 대응표의 `ourContentId`를 최소 샘플 데이터 파일로 옮긴다.
2. `evidenceStatus`가 `Needs direct proof`인 행은 구현 전에도 draft임을 UI/debug에 표시한다.
3. 세로 조각 smoke 체크리스트에서 각 `referenceRole`이 실제 화면에 나타나는지 확인한다.
