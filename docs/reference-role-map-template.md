# 원작 역기획 대응표 양식 v1

작성일: 2026-05-26

## 상태

- 상태: 양식 확정 초안
- 기준 문서: `docs/development-foundation.md`
- 목적: 원작의 기능적 역할을 우리 게임의 독자 IP 데이터와 연결한다.
- 아직 아님: 원작 조사 완료, 95% 유사도 판정, 콘텐츠 구현 승인

## 대응 원칙

- 대응 대상은 이름이 아니라 역할이다.
- 원작 이름, 원작 텍스트, 원작 이미지, 원작 사운드를 직접 복제하지 않는다.
- 원작 증거가 source-level뿐이면 직접 구현값으로 확정하지 않는다.
- 모든 대응 행은 독자 IP 치환 방향을 가져야 한다.
- 구현은 대응표의 빈칸을 줄인 뒤 시작한다.

## 상태값

| 상태 | 의미 |
| --- | --- |
| No source | 근거가 없다. |
| Source-level | 조사 문서나 외부 자료 근거는 있지만 직접 UI/런타임 증거는 아니다. |
| Needs direct proof | 원작 UI, 영상, 게임 파일, 직접 플레이 증거가 필요하다. |
| Mapped | 기능 역할과 독자 IP 치환 방향이 정리됐다. |
| Ready for slice | 세로 조각에 넣을 최소 구현 기준으로 충분하다. |
| Blocked | 자료, 도구, 권한, 결정 부족으로 진행할 수 없다. |

## 공통 열

모든 대응표는 아래 열을 기본으로 한다.

| 열 | 설명 |
| --- | --- |
| `referenceRole` | 원작 기능 역할 ID |
| `referenceSurface` | 카드, 보석, 유물, 스테이지, UI, 전투 흐름 같은 표면 |
| `observedFunction` | 원작에서 하는 기능 |
| `evidenceRefs` | `research/` 문서, 영상 ID, 스크린샷, 직접 플레이 증거 |
| `evidenceStatus` | 위 상태값 중 하나 |
| `ourContentId` | 우리 게임의 대응 콘텐츠 ID |
| `ourDisplayNameKo` | 우리 게임 표시 이름 |
| `ourFunctionalMatch` | 유지할 기능 핵심 |
| `ourOriginalization` | 이름, 그래픽, 세계관, 문구를 어떻게 바꾸는지 |
| `risk` | 저작권, 증거 부족, 밸런스, UI, 구현 위험 |
| `sliceNeed` | 세로 조각에 필요한지 여부 |
| `notes` | 추가 판단 |

## 시스템 대응표

| referenceRole | referenceSurface | observedFunction | evidenceRefs | evidenceStatus | ourSystemId | ourFunctionalMatch | ourOriginalization | risk | sliceNeed | notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| run_loop_basic | 진행 흐름 | 마을에서 던전으로 들어가 전투, 보상, 복귀로 이어진다. | `research/gap-map.md` | Source-level | loop_town_dungeon_return | 마을, 월드맵, 던전, 보상, 복귀 흐름 유지 | 팝업북 무대와 종이 던전 구조로 치환 | 세부 UI 증거 부족 | Yes | 세로 조각 핵심 |
| card_combat_hand_5 | 전투 | 손패 기반 카드 선택으로 몬스터를 상대한다. | `research/ui-screens.md` | Source-level | combat_card_hand_5 | 손패 판단, 비용, 적 의도 유지 | 카드 프레임과 이펙트는 독자 팝업북 스타일 | 정확 수치 증거 부족 | Yes | 5장 기준 고정 |

## 콘텐츠 대응표

| referenceRole | referenceSurface | observedFunction | evidenceRefs | evidenceStatus | ourContentId | ourDisplayNameKo | ourFunctionalMatch | ourOriginalization | risk | sliceNeed | notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| starter_cost_1_attack | card | 낮은 비용의 기본 공격 카드 | `research/card-gap-map.md` | Needs direct proof | card_sun_jab | 햇살 찌르기 | 초반 공격 판단 제공 | 이름, 일러스트, 문구를 독자 IP로 작성 | 수치 확정 금지 | Yes | 샘플 카드 후보 |
| basic_socket_modifier | rune_or_gem | 카드에 장착해 효과를 바꾼다. | `research/gem-gap-map.md` | Needs direct proof | rune_paper_spark | 종이 불씨 룬 | 카드 성장과 장착 판단 제공 | 유리종이 토큰 룬으로 치환 | 장착 규칙 증거 부족 | Yes | 세로 조각 장착 샘플 |

## 전투 흐름 대응표

| referenceRole | trigger | playerDecision | enemyFeedback | rewardOrStateChange | evidenceRefs | evidenceStatus | ourImplementationNeed | sliceNeed | notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| turn_card_use | 플레이어 턴 | 카드 선택, 대상 선택 | 피격, 피해 숫자, 의도 유지/변화 | 손패, 버림, 에너지 변화 | `research/ui-screens.md` | Source-level | 카드 사용 애니메이션, 로그, 상태 변경 | Yes | 첫 전투 핵심 |
| boss_phase_shift | 보스 체력 임계 | 다음 행동 대비 | 페이즈 전환 연출 | 보상 또는 다음 패턴 | `research/enemy-gap-map.md` | Needs direct proof | 페이즈 UI, 무대 장치 변화 | Yes | 첫 보스에 축소 적용 |

## UI 대응표

| referenceRole | screen | userGoal | requiredInformation | evidenceRefs | evidenceStatus | ourScreenId | ourOriginalization | sliceNeed | notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| town_entry | 마을 | 다음 런 준비 | 해금, 상점/시설, 시작 버튼 | `research/town-gap-map.md` | Needs direct proof | screen_town_stage | 팝업북 책상/무대 장치 마을 | Yes | 최소 기능만 |
| combat_main | 전투 | 이번 턴 판단 | HP, 에너지, 손패, 적 의도, 보상 맥락 | `research/ui-screens.md` | Source-level | screen_combat_main | 종이극장 전투판 | Yes | 1920 기준 |

## 밸런스 대응표

| referenceRole | valueType | observedRange | evidenceRefs | evidenceStatus | ourInitialValue | lockState | verificationNeed | notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| starter_attack_damage | card_value | 미확정 | `research/card-gap-map.md` | Needs direct proof | 6-8 후보 | draft | 세로 조각 전투 턴 수 확인 | 확정 수치 아님 |
| early_enemy_hp | enemy_value | 미확정 | `research/enemy-gap-map.md` | Needs direct proof | 18-28 후보 | draft | 첫 전투 3-5턴 목표 | 확정 수치 아님 |

## 작성 규칙

1. `referenceRole`은 한 번 정하면 쉽게 바꾸지 않는다.
2. 원작 이름은 조사 문서 참조 안에만 두고, 우리 데이터의 표시 이름으로 쓰지 않는다.
3. `evidenceStatus`가 `Ready for slice`가 아닌 행은 세로 조각에 넣을 때 리스크를 같이 적는다.
4. `ourOriginalization`이 비어 있으면 구현하지 않는다.
5. 수치가 불명확하면 후보 범위로 남기고 확정값처럼 말하지 않는다.

## 다음 작업

1. `research/gap-map.md`와 도메인별 gap map에서 세로 조각에 필요한 행만 골라 첫 대응표를 채운다.
2. 카드, 룬/보석, 몬스터, 보스, 스테이지, 마을, 보상 흐름의 `referenceRole` ID를 확정한다.
3. `Ready for slice` 기준을 만족하는 최소 콘텐츠 묶음을 만든다.
4. 데이터 스키마의 `referenceRole` 필드와 이 대응표를 검증 스크립트로 연결한다.
