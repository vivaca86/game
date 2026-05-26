# 첫 세로 조각 콘텐츠 후보 v1

작성일: 2026-05-26

## 상태

- 상태: 후보 고정 초안
- 기준 문서: `docs/vertical-slice-acceptance.md`
- 목적: 첫 구현에 들어갈 최소 데이터 묶음을 정한다.
- 아직 아님: 최종 밸런스, 최종 이름 승인, 에셋 승인, 원작 95% 판정

## 선택 기준

- 마을에서 시작해 마을로 돌아오는 루프를 닫을 수 있어야 한다.
- 모든 후보는 `referenceRole`을 가져야 한다.
- 원작 이름과 문구를 직접 쓰지 않는다.
- 수치는 세로 조각 검증용 draft 값이다.
- 카드, 룬, 몬스터, 보스는 서로 기능적으로 맞물려야 한다.

## 핵심 루프

```text
paper_town_start
-> stage_lantern_foyer
-> room_combat_intro
-> room_reward_card
-> room_rune_bench
-> room_combat_pressure
-> room_boss_pop_stage
-> unlock_stage_route_key
-> paper_town_return
```

## 캐릭터

| id | 표시명 | referenceRole | 역할 | 세로 조각 이유 |
| --- | --- | --- | --- | --- |
| char_mina_pagehand | 미나 종이손 | starter_balanced_character | 기본형 캐릭터 | 공격/방어/기술 카드를 모두 테스트하기 좋다. |

초안 수치:

- HP: 42
- 시작 기운: 3
- 시작 덱: `card_sun_jab` 3장, `card_fold_guard` 2장, `card_page_step` 1장
- 패시브: 전투 시작 시 첫 공격 카드 피해 +1

## 스테이지

| id | 표시명 | referenceRole | 구조 | 세로 조각 이유 |
| --- | --- | --- | --- | --- |
| stage_lantern_foyer | 등불 현관 | first_slice_stage | 전투 -> 보상 -> 장착 -> 압박 전투 -> 보스 | 마을, 전투, 보상, 장착, 보스, 복귀를 모두 검증한다. |

방 구성:

| 순서 | roomId | type | 목적 |
| --- | --- | --- | --- |
| 1 | room_intro_combat | combat | 카드 사용과 적 의도 첫 검증 |
| 2 | room_card_reward | reward | 카드 보상 선택 |
| 3 | room_rune_bench | event | 룬/보석 장착 |
| 4 | room_pressure_combat | combat | 장착 효과가 실제 전투에 반영되는지 검증 |
| 5 | room_foyer_boss | boss | 보스 페이즈와 클리어 보상 검증 |

## 카드 후보

| id | 표시명 | type | cost | referenceRole | 기능 |
| --- | --- | --- | --- | --- | --- |
| card_sun_jab | 햇살 찌르기 | attack | 1 | starter_cost_1_attack | 앞 적에게 피해 7 |
| card_fold_guard | 접힌 방패 | defense | 1 | starter_basic_guard | 보호막 6 |
| card_page_step | 책장 넘기기 | skill | 0 | starter_draw_cycle | 카드 1장 드로우, 다음 카드 비용 후보 -1 |
| card_ribbon_snap | 리본 튕기기 | attack | 1 | starter_chain_attack | 피해 4, 연쇄 3 이상이면 추가 피해 |
| card_lamplight_mark | 등불 표식 | skill | 1 | starter_mark_setup | 표식 2 부여 |
| card_stage_patch | 무대 덧대기 | defense | 2 | starter_big_guard | 보호막 11, 다음 피해 1 감소 |
| card_ink_spill | 잉크 번짐 | attack | 2 | starter_area_attack | 모든 적에게 피해 4 |
| card_paper_bloom | 종이꽃 회복 | skill | 1 | starter_small_heal | HP 3 회복, 전투당 1회 제한 후보 |
| card_pinpoint_glint | 금핀 반짝임 | attack | 0 | starter_free_chip | 피해 3, 룬 발동 테스트 |
| card_curtain_call | 커튼콜 | skill | 2 | starter_reward_setup | 이번 전투 후 카드 보상 선택지 +1 후보 |

세로 조각 투입 기본값:

- 시작 덱에는 6장만 넣는다.
- 나머지 4장은 보상 후보로 둔다.
- 모든 수치는 draft이며 첫 전투 턴 수 검증 후 바꾼다.

## 룬/보석 후보

| id | 표시명 | socketType | referenceRole | 기능 |
| --- | --- | --- | --- | --- |
| rune_paper_spark | 종이 불씨 룬 | attack | basic_socket_modifier | 장착 카드 피해 +2 |
| rune_ribbon_loop | 리본 고리 룬 | skill | chain_bridge_modifier | 장착 카드 사용 후 연쇄 +1 |
| rune_glass_leaf | 유리잎 룬 | defense | defense_socket_modifier | 장착 카드 보호막 +3 |

장착 검증:

- `card_sun_jab`에 `rune_paper_spark`를 장착해 피해 변화가 UI와 실제 전투에 반영되어야 한다.
- `card_fold_guard`에 `rune_glass_leaf`를 장착해 보호막 변화가 표시되어야 한다.
- `card_page_step`에 `rune_ribbon_loop`를 장착해 연쇄 변화가 로그에 남아야 한다.

## 일반 몬스터 후보

| id | 표시명 | role | referenceRole | 기능 |
| --- | --- | --- | --- | --- |
| enemy_folded_sentry | 접힌 파수꾼 | attacker | early_basic_attacker | 공격 의도와 피격 피드백 테스트 |
| enemy_ink_mote | 잉크 얼룩불 | disruptor | early_light_disruptor | 다음 카드 비용 +1 또는 표식 압박 테스트 |

초안 수치:

- `enemy_folded_sentry`: HP 24, 공격 6
- `enemy_ink_mote`: HP 18, 공격 4 또는 다음 카드 비용 +1

## 보스 후보

| id | 표시명 | role | referenceRole | 기능 |
| --- | --- | --- | --- | --- |
| boss_curtain_lion | 커튼 사자무대 | hybrid | first_boss_phase_gate | 페이즈, 큰 실루엣, 클리어 보상 테스트 |

초안 수치:

- HP: 64
- 기본 의도: 공격 7, 장벽 5, 리본 압박
- 페이즈: HP 50% 이하에서 무대 장치 전환, 다음 공격 +3

## 유물/아르카나 후보

| id | 표시명 | type | referenceRole | 기능 |
| --- | --- | --- | --- | --- |
| relic_brass_bookmark | 황동 책갈피 | relic | first_reward_relic | 전투 시작 시 카드 1장 추가 드로우 후보 |

세로 조각에서는 보스 클리어 보상으로만 등장시킨다.

## 이벤트/장착 화면 후보

| id | 표시명 | referenceRole | 기능 |
| --- | --- | --- | --- |
| event_rune_bench | 접힌 작업대 | rune_socket_event | 카드 1장에 룬 1개 장착 |

선택지:

1. 공격 카드에 룬 장착
2. 방어 카드에 룬 장착
3. 장착하지 않고 HP 2 회복

## 해금 후보

| id | 표시명 | referenceRole | 조건 | 보상 |
| --- | --- | --- | --- | --- |
| unlock_stage_route_key | 첫 무대 열쇠 | first_stage_clear_unlock | `stage_lantern_foyer` 클리어 | 다음 스테이지 placeholder 잠금 해제 |

## 에셋 키 후보

| key | type | 용도 |
| --- | --- | --- |
| bg_lantern_foyer_set | image_set | 등불 현관 배경 레이어 |
| card_frame_attack | image | 공격 카드 프레임 |
| card_frame_defense | image | 방어 카드 프레임 |
| card_frame_skill | image | 기술 카드 프레임 |
| monster_folded_sentry | spritesheet | 접힌 파수꾼 |
| monster_ink_mote | spritesheet | 잉크 얼룩불 |
| boss_curtain_lion | spritesheet | 커튼 사자무대 |
| effect_paper_slash | spritesheet | 카드 공격 이펙트 |
| effect_ink_splash | spritesheet | 잉크 이펙트 |
| ui_panel_paper_9slice | image | 기본 패널 |

## 다음 작업

1. 이 후보를 `docs/reference-role-map-slice-v1.md`에 대응표로 연결한다.
2. `docs/game-data-types.v1.ts` 기준으로 최소 샘플 데이터를 작성한다.
3. 각 후보의 asset key를 `assets/runtime` manifest 초안으로 분리한다.
4. 첫 Phaser 구조를 만들 때 이 후보만 로드하도록 제한한다.
