# 개발 기반 결정 v1

작성일: 2026-05-26

이 문서는 새 게임 개발의 1차 기반 결정 문서다. 현재 저장소의 예전 정적 HTML 카드 크롤러 구현을 그대로 이어가는 문서가 아니다. 지금부터의 기준은 높은 퀄리티의 PC 웹 카드 던전 크롤러를 새 기반 위에 다시 세우는 것이다.

## 문서 상태

- 상태: 기반 결정 1차 정리
- 완료 범위: 목표, 플랫폼, 빌드 방향, 엔진/스택, 해상도, 언어, 그래픽풍, 아트 담당 범위, 에셋 파이프라인 원칙, 데이터 원칙, 에셋 제작 규격 v1, 아트 바이블 v1
- 미완료 범위: 상세 데이터 스키마, 원작 역기획 대응표, 세로 조각 통과 기준, 실제 구현, 샘플 에셋 검증
- 완료로 말하면 안 되는 것: 원작 95% 유사도, 조사 완료, 구현 착수 가능, 아트 파이프라인 완성, 샘플 에셋 승인

## 최종 목표

- 장르: 카드 던전 크롤러
- 레퍼런스 게임: `Vampire Crawlers`
- 목표 성격: 영감작이 아니라 이름, 그래픽, 컨셉만 다른 구조적 대응작
- 유지해야 할 것: 게임 구조, 시스템 연결, 콘텐츠 역할, 보상 흐름, 진행 리듬, 플레이어 의사결정 구조
- 바꿔야 할 것: 이름, 세계관, 그래픽, 사운드, UI 표현, 카드명, 몬스터명, 텍스트
- 사용 금지: 원작 코드, 원작 그래픽, 원작 사운드, 원작 텍스트 문구의 직접 복제

## 개발 철학

- 게임은 처음부터 게임다워야 한다.
- 임시 기능을 쌓고 나중에 퀄리티를 올리는 방식은 사용하지 않는다.
- 세로 조각도 최종 구조의 축소판이어야 한다.
- 기반 없이 카드, 몬스터, 보상, 화면을 먼저 쌓지 않는다.
- 데이터 구조, 네이밍, 에셋 규격, 이미지 처리, 프레임 기준, 디버그 도구를 먼저 고정한다.
- 한 컷, 한 프레임, 한 데이터 필드가 후반 관리 비용을 결정한다.
- 완료 판정은 검증된 범위에만 사용한다.

## 플랫폼과 빌드

- 1차 플랫폼: PC 웹 브라우저
- 1차 배포: 정적 웹 빌드
- 서버 기능: 1차 제외
- 확장 가능성: 계정, 클라우드 세이브, 랭킹, 운영 데이터 패치가 필요해질 수 있으므로 클라이언트 데이터와 런타임 구조는 서버 확장을 막지 않게 분리한다.

정적 웹 빌드를 우선하는 이유는 초기 반복, 배포, 검증, 공유가 빠르기 때문이다. 동적 웹 빌드는 운영 기능이 필요할 때 검토한다.

## 엔진과 스택

확정 스택:

- `Phaser 3`
- `TypeScript`
- `Vite`
- 데이터 파일은 JSON 또는 TypeScript 데이터 모듈과 검증 스키마로 관리

현재 판단:

- Phaser는 웹 2D 게임, 씬 전환, 입력, 사운드, 카드 이동, 전투 연출, 카메라 효과, 스프라이트 애니메이션의 균형이 좋다.
- Unity는 그래픽 제작 환경과 에디터 툴링에서 더 강한 후보지만, WebGL 배포 무게와 한글 카드 UI, 데이터 반복 작업의 부담이 있다.
- PixiJS는 렌더링 자유도가 높지만 게임 프레임워크를 직접 많이 만들어야 한다.
- DOM/React 중심 구조는 카드 UI에는 강하지만 던전 시야, 공격 연출, 피격, 회전, 보스 등장 같은 게임 화면 연출이 핵심인 이번 목표에는 1차 엔진으로 약하다.

결정:

- 새 프로젝트는 `Phaser 3 + TypeScript + Vite` 기준으로 진행한다.
- Phaser가 담당할 범위는 게임 씬, 전투 화면, 던전 시야, 스프라이트 애니메이션, 카드 이동, 전투 이펙트, 입력, 사운드, 카메라 연출이다.
- 긴 설정창, 개발용 디버그 패널, 복잡한 텍스트 검수 화면은 필요할 경우 DOM overlay를 보조로 사용할 수 있다.
- 엔진, 그래픽풍, 에셋 제작 규격은 1차 기준으로 확정됐지만, 첫 샘플 에셋과 런타임 검증 전까지 최종 아트 파이프라인 완료로 보지 않는다.

## 해상도와 화면 기준

- 기준 해상도: `1920x1080`
- 화면비: `16:9`
- 기준 사용 환경: 27인치 `2560x1440` 모니터에서 브라우저 실행
- 최소 대응 기준: `1280x720`
- 스케일 원칙: 비율 유지, UI safe area 유지, 중요한 텍스트와 카드 정보가 축소 환경에서도 잘리지 않아야 한다.

화면 설계의 첫 기준은 1920x1080이다. 1280x720은 기준 화면이 아니라 최소 대응 및 축소 검증용으로 둔다.

## 게임 내 언어와 네이밍

- 게임 안에 보이는 텍스트는 전부 한글이다.
- 코드, 내부 ID, 파일명, 폴더명은 영어를 사용한다.
- 표시 이름과 내부 ID는 반드시 분리한다.
- 코드에 한글 표시 문구를 직접 박지 않는다.
- 한글 문구는 데이터 또는 locale 계층에서 관리한다.

예시:

```ts
id: "card_sun_jab"
displayNameKo: "햇살 찌르기"
descriptionKo: "앞의 적에게 피해를 준다."
roleKey: "starter_cost_1_attack"
```

## 아트 담당 범위

- 아트 디렉션, 시안, 생성 이미지 프롬프트, 에셋 규격, 정규화, 스프라이트 프레임 검수까지 Codex 담당 범위에 포함한다.
- 외부 아트 담당자가 따로 있다는 전제로 진행하지 않는다.
- AI 이미지는 원화와 원본 에셋 제작에 사용하되, 게임 화면은 규격화된 에셋 조립 구조로 만든다.

확정 그래픽풍:

- 프리미엄 팝업북 판타지 카드 크롤러
- 고급 스타일라이즈드 2D 캐릭터/몬스터와 팝업북/종이극장 질감을 결합한다.
- 배경은 레이어드 종이 무대, 접힌 길, 종이 컷아웃, 두꺼운 종이 단면, 손으로 칠한 무대 배경처럼 구성한다.
- 카드, UI, 룬/보석, 유물은 종이, 스티커, 유리종이 토큰, 황동 고정핀, 양피지 질감으로 조립한다.
- 원작 그래픽을 복제하지 않고, 원작의 기능적 구도와 시스템 역할만 참고
- 밝고 읽기 쉬운 화면을 유지하되, 전투 중심부는 충분한 대비와 타격감을 가진다.
- 공격 이펙트는 종이 찢김, 잉크 번짐, 접힘 폭발, 스티커 파편, 무대 조명 섬광 같은 언어를 사용한다.
- 몬스터/보스는 종이 질감 때문에 약해 보이지 않도록 큰 실루엣, 강한 중심 형태, 명확한 위협 포즈를 가진다.

## 에셋 제작 원칙

완성 이미지를 통째로 만들어 붙이는 방식을 금지한다. 모든 주요 에셋은 조립 가능한 단위로 분리한다.

카드:

- 카드 프레임
- 카드 일러스트
- 비용 아이콘
- 타입 아이콘
- 등급/희귀도 표시
- 카드명 텍스트
- 효과 텍스트
- 강화/진화 표시

전투:

- 던전 배경
- 몬스터/보스 스프라이트
- 플레이어 공격 주체 또는 손/무기 레이어
- 공격 이펙트
- 피격 이펙트
- 피해 숫자
- 상태이상 아이콘
- 카메라/화면 흔들림 연출

UI:

- 9-slice 패널
- 버튼
- 툴팁
- 보상 카드
- 마을/월드맵 패널
- 디버그 패널

## 에셋 분류

초기부터 아래 분류를 별도 폴더와 별도 규격으로 관리한다.

- 배경
- 캐릭터
- 몬스터
- 보스
- 카드 일러스트
- 카드 프레임
- 룬/보석 아이콘
- 유물 아이콘
- 아르카나 아이콘
- UI 패널/버튼
- 전투 이펙트
- 애니메이션 프레임
- 참고 이미지
- 작업 원본

참고 이미지와 작업 원본은 실제 런타임 에셋과 분리한다.

## 데이터 구조 원칙

- 데이터는 코드와 분리한다.
- 모든 주요 콘텐츠는 고유 ID를 가진다.
- 모든 주요 콘텐츠는 한글 표시명과 한글 설명을 가진다.
- 모든 주요 콘텐츠는 원작의 어떤 기능적 역할에 대응하는지 추적 가능한 필드를 가진다.
- 데이터는 먼저 작은 샘플로 구조를 검증하고, 같은 구조로 전체 규모까지 확장한다.
- 단순 수량 일치는 콘텐츠 완성으로 보지 않는다.

필수 데이터 그룹:

- cards
- gems 또는 runes
- relics
- arcanas
- characters
- stages
- rooms
- monsters
- bosses
- events
- rewardPools
- unlocks
- evolutions
- powerUps
- saveSchema

공통 필드 초안:

```ts
id: string
displayNameKo: string
descriptionKo: string
type: string
tags: string[]
unlockId?: string
rewardPools?: string[]
balance?: object
relations?: object
referenceRole: string
evidenceLevel?: string
notes?: string
```

## 원작 대응 원칙

원작 콘텐츠를 이름 그대로 옮기는 것이 아니라 기능적 역할을 대응시킨다.

예시:

- 원작의 기본 1비용 공격 카드 -> 우리 게임의 기본 1비용 공격 카드
- 원작의 체인 연결 Wild 카드 -> 우리 게임의 체인 연결 카드
- 원작의 카드 강화/보석 삽입 구조 -> 우리 게임의 같은 역할을 하는 룬/보석 장착 구조
- 원작의 보스 보상/해금 문턱 -> 우리 게임의 보스 보상/해금 문턱

따라서 각 콘텐츠는 `referenceRole` 또는 그에 준하는 역할 필드를 반드시 가진다.

## 초기 게임 구조 축

초기 세로 조각부터 아래 흐름을 최종 구조의 축소판으로 포함한다.

1. 마을
2. 월드맵
3. 던전 진입
4. 방 이동
5. 카드 전투
6. 카드 사용 연출
7. 몬스터 피격
8. 보상 선택
9. 보석/룬 장착
10. 보스전
11. 해금
12. 마을 복귀

이 중 전투 연출, 던전 시야, 좌우 회전 감각, 카드 사용 타이밍은 후순위 연출 작업이 아니라 초기 핵심 요구사항이다.

## 디버그와 검증 원칙

디버그 도구는 초기부터 필수다.

필수 디버그 기능:

- 카드 지급
- 보석/룬 지급
- 유물 지급
- 아르카나 지급
- 특정 스테이지 진입
- 특정 방 진입
- 특정 보스전 진입
- 보상 풀 테스트
- 세이브 초기화
- 애니메이션 프레임 보기
- 전투 로그 보기
- 데이터 참조 오류 검사
- 원작 대응 누락 검사

검증 없이 완료라고 말하지 않는다.

## 현재 저장소의 이전 산출물 처리

현재 저장소에는 예전 정적 HTML 카드 크롤러와 밝은 파스텔풍 검증 샘플의 흔적이 남아 있다. 이 문서부터는 그것을 최종 방향으로 보지 않는다.

- 기존 정적 HTML 앱: 새 개발의 최종 런타임 기준 아님
- 기존 밝은 파스텔 아트 기준: 새 아트 방향 최종 기준 아님
- 기존 데이터 수량: 구조 참고 가능, 완성 콘텐츠 아님
- 기존 조사 자료: 원작 역기획의 근거 자료로 유지
- 기존 검증 도구: 새 구조에 맞게 재평가 필요

이전 산출물을 자동 폐기하지는 않는다. 다만 새 기반 결정과 충돌하는 경우, 새 기반 결정 v1을 우선한다.

## 아직 확정해야 할 것

| 항목 | 상태 | 다음 작업 |
| --- | --- | --- |
| 상세 아트 바이블 | 1차 확정 | 색상 코드, 타입별 UI 상세, 몬스터 계열표, 첫 샘플 에셋 검증 |
| 에셋 해상도 규격 | 1차 확정 | 에셋 메타데이터 스키마, atlas 패킹 방식, 검증 스크립트 설계 |
| 데이터 스키마 상세 | 타입 초안 작성 | 실제 프로젝트 생성 시 `src/data/schema.ts`로 이관 |
| 원작 기준 버전 | 계획 기준선 확정, 직접 빌드 증거 deferred | Steam 없음 전제로 개발을 계속하고, 정확한 빌드/런타임 판정이 필요할 때만 `docs/source-version-baseline.md`를 재개 |
| 원작 대응표 | 첫 후보 행 작성 | `Ready for slice`와 `Needs direct proof` 행 분리 |
| 세로 조각 통과 기준 | fixture/manifest/checklist/validator 작성 | smoke script와 브라우저 검증으로 이관 |
| 세이브 구조 | 미확정 | saveVersion, unlocks, profile, settings 구조 설계 |
| 디버그 UI | URL/debug action 계획 작성 | 실제 DOM overlay와 debug action 구현 |
| Phaser 프로젝트 구조 | 1차 scaffold 작성 | simulation, scene flow, debug action 실제 연결 |

## 작성된 후속 산출물

1. `docs/data-schema-draft.md`: 데이터 스키마 초안
2. `docs/reference-role-map-template.md`: 원작 역기획 대응표 양식
3. `docs/vertical-slice-acceptance.md`: 세로 조각 통과 기준
4. `docs/game-data-types.v1.ts`: TypeScript 타입 초안
5. `docs/vertical-slice-content-candidates.md`: 첫 세로 조각 콘텐츠 후보
6. `docs/reference-role-map-slice-v1.md`: 첫 세로 조각 원작 대응표
7. `docs/vertical-slice-smoke-checklist.md`: smoke 체크리스트
8. `docs/vertical-slice-data.fixture.v1.json`: 첫 세로 조각 데이터 fixture
9. `docs/asset-manifest.slice.v1.json`: 첫 세로 조각 planned asset manifest
10. `docs/validation-rules-v1.md`: fixture/manifest 검증 기준
11. `docs/phaser-project-structure-plan.md`: Phaser 프로젝트 폴더와 책임 경계 계획
12. `docs/phaser-boot-flow-plan.md`: Phaser 부트, preload, entry scene 순서 계획
13. `docs/debug-entry-plan.md`: URL debug entry와 debug action 계획
14. `docs/implementation-start-checklist.md`: 실제 구현 착수 전 체크리스트

## 초기 구현 작업

1. `simulation/`에 전투 상태, 카드 사용, 적 의도 처리의 첫 규칙을 연결했다.
2. `TownScene -> WorldMapScene -> DungeonScene -> CombatScene`의 입력 기반 scene flow를 연결했다.
3. `RewardScene`, `RuneBenchScene`, `BossScene`, `ResultScene`을 실제 상태 변화와 연결했다.
4. fixture의 `encounterPoolId`는 explicit encounter pool 데이터로 분리했다.
5. 원작 기준 버전/패치/영상 계획 기준선은 `docs/source-version-baseline.md`에 고정했다. Steam 직접 설치 빌드 증거는 현재 개발 진행 조건이 아니라 deferred proof로 둔다.

직접 설치 빌드 증거가 나오기 전에는 원작 유사도 또는 정확한 런타임 값 판정을 하지 않는다. 다만 Steam이 없다는 전제에서도 공식 공개 자료, 보존된 조사, 역할 대응표, 자체 검증선을 기준으로 개발은 계속 진행한다.

관련 문서:

- `docs/asset-production-spec.md`: 에셋 제작 규격 v1
- `docs/art-bible.md`: 아트 바이블 v1
- `docs/data-schema-draft.md`: 데이터 스키마 초안
- `docs/reference-role-map-template.md`: 원작 역기획 대응표 양식
- `docs/vertical-slice-acceptance.md`: 세로 조각 통과 기준
- `docs/game-data-types.v1.ts`: TypeScript 타입 초안
- `docs/vertical-slice-content-candidates.md`: 첫 세로 조각 콘텐츠 후보
- `docs/reference-role-map-slice-v1.md`: 첫 세로 조각 원작 대응표
- `docs/vertical-slice-smoke-checklist.md`: smoke 체크리스트
- `docs/source-version-baseline.md`: 원작 source/version 기준선
- `docs/vertical-slice-data.fixture.v1.json`: 첫 세로 조각 데이터 fixture
- `docs/asset-manifest.slice.v1.json`: 첫 세로 조각 planned asset manifest
- `docs/validation-rules-v1.md`: fixture/manifest 검증 기준
- `docs/phaser-project-structure-plan.md`: Phaser 프로젝트 폴더와 책임 경계 계획
- `docs/phaser-boot-flow-plan.md`: Phaser 부트, preload, entry scene 순서 계획
- `docs/debug-entry-plan.md`: URL debug entry와 debug action 계획
- `docs/implementation-start-checklist.md`: 실제 구현 착수 전 체크리스트
- `docs/source-version-baseline.md`: 원작 source/version 기준선
## 2026-05-26 Implementation Status Update

- `src/simulation/` now owns the first slice run/combat state: player HP/energy/block, hand/draw/discard, enemy HP/block/intent, reward offers, rune attachment, boss phase flag, and run log.
- Phaser scenes now route keyboard input through a scene-to-simulation boundary instead of mutating view-only state.
- Verified flow: town -> world map -> dungeon -> combat -> reward -> rune bench -> combat -> boss -> result -> town.
- Verified combat behaviors: attack damage, block gain, draw, enemy turn damage, rune-modified damage, boss phase trigger.
- This is still foundation work, not final balance, final art, full save persistence, exhaustive source parity, or a full vertical-slice pass.

Current foundation status:

1. Save reload verification is in place for mid-combat and completed-stage state, including a save boundary check for Phaser object leakage.
2. 1920x1080 screenshot checks and debug-overlay visual overlap checks are in place.
3. Card description/effect-op audit is in place through `npm.cmd run slice:effects`.
4. Route `encounterPoolId` values now point to explicit encounter-pool data instead of direct enemy/boss/event ids.
5. Source/version planning baseline is fixed in `docs/source-version-baseline.md`; direct installed-build proof is deferred under the no-local-Steam working assumption and is not an active development blocker.
6. Generated development runtime assets exist under `public/assets/runtime`, Phaser preloads them by manifest path, and strict file verification is in place through `npm.cmd run assets:audit:strict`. These are not final or approved art assets.
7. The first asset replacement loop has been proven on a small UI group: card frames and card type icons now have deterministic candidate art generated by `tools/generate-dev-runtime-assets.mjs`. This is still candidate/development art, not approved final art.
8. The first visible card-art loop is connected: the opening hand's five illustration assets now have deterministic candidate art, and `renderCardHand` draws frame, illustration, and type icon textures instead of rectangle-only cards. This is still not final approved art.
9. All 10 slice card illustrations now have deterministic candidate art, and grant-card screenshots confirm the second five render through the same hand texture path. This closes the first card-illustration candidate pass only; approved/final art is still not done.
10. Enemy intent icons now have deterministic candidate art for attack, disrupt, and block, and Combat/Boss panels render the active intent texture from `assetKeys.intentIcons[]`. This is a development candidate pass only; final/approved intent art is still not done.
11. Stage and event backgrounds now have deterministic candidate art for `bg_lantern_foyer_set` and `scene_rune_bench`. Shared Phaser scenes render the current stage background, and Rune Bench can use the event scene asset resolved from the encounter pool. This is still not final approved background art.
12. Regular enemy sprites now have deterministic transparent pipeline placeholders for `monster_folded_sentry` and `monster_ink_mote`, and Combat renders the active regular enemy texture from `enemy.assetKeys.sprite`. This proves the data-to-spritesheet-to-scene path only; visual candidate and final sprite art are still not done.
13. The boss sprite now has a deterministic transparent pipeline placeholder for `boss_curtain_lion`, and Boss renders the active boss texture from `boss.assetKeys.sprite` through the shared combat panel. This proves the boss data-to-spritesheet-to-scene path only; visual candidate and final boss art are still not done.
14. Progression-facing icon assets now have deterministic candidate art for the stage map icon, rune icons, the first relic icon, and the first character portrait. Shared scene shells, Reward, Rune Bench, and Result render those assets through `assetKeys`. This proves the icon/portrait data-to-scene path only; effect spritesheets, character sprite animation, UI panel skinning, and final approved art are still not done.
15. Effect spritesheets now have deterministic transparent pipeline candidates for paper slash, ink splash, and stage spotlight feedback. Combat and Boss derive the visible feedback key from recent combat log state and render the matching spritesheet frame, with smoke screenshots covering all three effect keys. This proves the combat feedback asset path only; final VFX timing, animation playback polish, sound, and broader effect taxonomy are still not done.
16. The starter character spritesheet `char_mina_pagehand_sprite` now has a deterministic transparent pipeline candidate and is rendered as a player-side standee in Combat and Boss screens. Smoke verifies the debug sprite key and captures character-sprite screenshots. This proves the character data-to-spritesheet-to-scene path only; final character animation timing, motion states, and approved sprite art are still not done.
17. The reusable UI panel asset `ui_panel_paper_9slice` now has a deterministic candidate and is used through Phaser's `nineslice` object for the shared scene status panel and Combat/Boss enemy panel. Smoke verifies the panel key and captures UI-panel screenshots. This proves the UI panel texture path only; final UI skinning, final button-state art, and full interface polish are still not done.
18. A release catalog runtime bridge now exists behind `?data=release`. The default path still loads the verified slice fixture, while release mode adapts the local full catalog into the Phaser schema and smoke-verifies 113 cards, 58 gems-as-runes, 16 relics, 15 stages, validation success, and one working first-card combat action. This proves full-catalog connectivity only; card uniqueness, relic systems, character passives, full stage progression, balance, and release readiness are still not done.
19. Card release batch 1 has converted 32 generated morning/cloud/mint/peach cards into distinct release-facing card ids, effect structures, Korean text, and illustration briefs. `cards:release:audit` verifies the retired template ids are gone and the previous card repetition blockers no longer appear in `quality:audit:report`. This is a first card-content batch only; the remaining card families, upgrades/evolutions, card art, and balance are still not release-complete.
20. Gem release batch 1 has converted 20 generated morning/cloud/mint/peach/lavender edge/guard/spark/echo gems into distinct multi-effect socket modifiers with Korean text. `gems:release:audit` verifies the 58-gem catalog, the curated 20-gem batch, and max repeated gem effect shape 9. The legacy runtime smoke verifies a curated gem damage modifier plus preserve-chain behavior, and Phaser smoke verifies `gem_morning_edge` as a release rune modifying `card_sunbean_punch` damage in `?data=release`. This is a first gem-content batch only; remaining gem families, rune UI, acquisition pacing, icon polish, and balance are still not release-complete.
21. Enemy intent release batch 1 has converted 32 early normal/trick/elite/boss enemy rows into distinct intent structures with runtime-covered effects. `enemies:release:audit` verifies the 60-enemy catalog, curated batch 32, unique batch shapes 20, and max repeated enemy intent shape 7. Phaser release adapter and combat now cover player mark, player weak, temp-card discard, enemy heal, piercing damage, chain reduction, and summon logging for release enemy intents. This is an enemy-intent batch only; final monster art, all remaining enemy identities, reward/scaling balance, and boss completion are still not release-complete.
22. Stage route release batch 1 has converted all 15 generated stage room templates into distinct room patterns while preserving required event, elite, and final boss coverage. `stages:release:audit` verifies 15 unique room patterns with max repeated room pattern 1, and Phaser smoke verifies the `stage_rainbow_keep` route in `?data=release`. This is a route-pattern batch only; final background identity, stage-specific mechanics, boss/reward balance, and unlock flow are still not release-complete.
23. Event release batch 1 has converted all 10 generated event rows into varied release-facing choice counts, cost profiles, reward profiles, labels, and story text while preserving stable event ids. `events:release:audit` verifies 36 total choices, choice-count distribution `4:6, 3:4`, 7 choice roles, and 4 risk types. Core runtime smoke now chooses affordable event choices instead of assuming choice 0 is always valid, and Phaser smoke verifies release-mode event adapter output for `event_bubble_shop`. This is an event data/adapter batch only; dedicated Phaser EventScene, invalid-state handling, repeat rules, persistence, event art, and full choice execution remain not release-complete.
24. Achievement release batch 1 has converted 31 generated `ach_picnic_goal_*` rows from room-count filler into release-facing collection and chain mastery goals with varied rewards. `achievements:release:audit` verifies 161 achievements, curated batch 31, milestone-like triggers reduced to 84, five batch trigger families, and seven batch reward kinds. Core runtime smoke verifies the curated card/gem/relic/arcana collection and chain achievements actually apply unlock rewards. This is an achievement curation batch only; full thematic review, UI surfacing, reward pacing, and long-run profile balance remain not release-complete.
25. Enemy identity release batch 2 has converted the remaining 28 generated enemy rows into distinct release-facing names and intent structures, and relabeled the early boss phase rules so the boss phase set is not still carrying generic `친구 부르기` coverage. `enemies:release:audit` now verifies all 60 enemy ids under the stricter release-quality gate with `uniqueIntentShapes=37`, `maxRepeatedIntentShape=5`, all 7 supported special effects, both debuff statuses, and `bossPhaseCoverage=15/15`. Runtime smoke verifies a batch 2 weak intent and temp-card enemy behavior, and Phaser smoke verifies `enemy_prism_trick` applies `playerWeak=1` in `?data=release`. This removes the enemy generated-coverage blocker from `quality:audit:report`, but enemy art, reward/scaling balance, full encounter pacing, and manual monster-readability review remain not release-complete.
26. Release visual coverage batch 1 now generates a manifest-backed candidate PNG for the full local release catalog: 113 card illustrations, 58 gem icons, 16 relic icons, 12 arcana icons, 23 character portraits, 23 character sprites, 15 stage backgrounds, 15 stage map icons, 45 non-boss enemy sprites, 15 boss sprites, 10 event scenes, and 18 shared UI/VFX assets. `assets:audit:release-visuals` verifies 363 expected release assets and files, `assets:audit` verifies 403 total slice+release runtime files with 0 missing and 0 orphan files, and `phaser:smoke` verifies release-mode rendering still works. This removes the visual production blocker from `quality:audit:report`, but final art approval, manual readability review, originality/licensing review, animation polish, and full visual QA remain not release-complete.
27. EventScene execution batch 1 adds a dedicated `event` phase and Phaser `EventScene` instead of routing event rooms straight to the rune bench. Event choices now pay HP/gold costs, grant cards/runes/relics/arcanas/currency/heal rewards into the run state, can start an event combat through `eventCombatEnemyId`, and persist `lastEventChoiceId` plus player gold through save state. Phaser smoke verifies the slice `event_rune_bench` path, release `event_bubble_shop` choice 3 starting `enemy_cloud_buddy` combat with gold 104, and choice 4 spending HP, granting `relic_round_lantern`, and ending at gold 92. This is event execution progress only; invalid-state UX, repeat rules, event balance, persistence edge cases, event art approval, and full outcome coverage remain not release-complete.
28. Relic/arcana passive execution batch 1 adds a Phaser-side passive system for the first release item effects. Relics now affect combat start block/energy, after-combat healing, reward option count, and currency reward amount; arcanas now affect zero-cost card gold and defense-card damage. Debug grants now support `grantArcana`, and debug-only `playerHp`/`enemyHp` overrides exist for deterministic passive smoke states. Phaser smoke verifies all batch-1 passive effects listed in the release checklist. This is passive execution progress only; many relic/arcana effects, selection UI, unlock pacing, balance, and full persistence edge cases remain not release-complete.
29. Relic/arcana passive execution batch 2 adds additional passive hooks for card-cost adjustment, card retain, map room reveal, mixed elite rewards, boss victory rewards, per-combat defense counters, per-turn color counters, shield carry, and heal-trigger marks. Debug mode supports deterministic `handCard` setup for passive smoke states, and Phaser smoke verifies all 11 batch-2 effects listed in the release checklist. This is passive execution progress only; shop/reroll/upgrade/kill/damage-tracking passives, selection UI, unlock pacing, balance, and full persistence edge cases remain not release-complete.
30. The Input release gate now has screen-level keyboard and mouse/click coverage in `phaser:smoke` for Town, WorldMap, Dungeon, Combat, Reward, Event, RuneBench, Boss, and Result, including release event/reward click paths. Phaser action buttons, combat cards, and event choices now expose hover/down feedback, hover states are pixel-checked in canvas screenshots, and `entry=rune_bench` debug setup now starts from the first valid bench room instead of the first combat room. This completes the current Phaser input gate only; accessibility settings, remapping UI, final control art, and full UI polish remain separate unfinished gates.
31. The Text quality release gate now has Korean fixed UI text and automated Phaser text-object layout checks for the current screens. `phaser:smoke` verifies Town, WorldMap, Dungeon, Combat, Reward, Event, RuneBench, Boss, and Result text against scene bounds, severe text overlap, replacement characters, and old English placeholder labels. This completes current screen text fit/consistency only; full content copy review, final terminology review, and writing polish for every release row remain separate unfinished work under the broader content/domain gates.
32. The Core run loop release gate now has automated proof for both clear and defeat loops. `phaser:smoke` plays release `stage_sunny_gate` from Town through repeated combats, Event, elite combat, Reward, rest/RuneBench, Boss, stage-clear reward, Result, and Town return, and separately verifies 0-HP defeat routes to Result without completed-stage credit before returning to Town and starting a new world-map flow. This completes the current core loop gate only; run balance, build variety, manual QA, and all content/domain gates remain separate unfinished work.
33. The Save system release gate now has automated proof for durable load/reset/recovery in both debug and production storage paths. `saveCodec` accepts v1 saves, migrates recognizable v0/unversioned saves to v1, rejects unsupported future versions, normalizes invalid fields, and falls back to a valid initial save on corrupt JSON. Town now exposes a `저장 초기화` action that clears the active production/debug save key and reboots into an initial save. `phaser:smoke` verifies mid-combat reload, completed-stage reload, legacy migration, corrupt/future recovery, clear/defeat result save consistency, debug reset, production save creation, and production reset. This completes the current save-system gate only; broader progression, cloud/account save, settings options, and long-term unlock balance remain separate unfinished work.
34. The Settings release gate now has a dedicated Phaser settings surface. `SettingsScene` exposes Korean language status, master/music/SFX volume values, standard/high-contrast display mode, large text, reduced motion, Space-confirm control behavior, settings reset, and save reset. Settings are persisted in `SaveData.settings`, normalized through `saveCodec`, and the Space-confirm option is wired into keyboard input binding so it changes gameplay input behavior. `phaser:smoke` verifies settings changes, saved JSON shape, reload persistence, disabled/enabled Space-confirm behavior, and reset to defaults. This completes the current settings gate only; actual music/SFX assets, sound design, full key remapping, cloud save, and broader accessibility polish remain separate unfinished work.
35. The UI technical skin path now uses themed 9-slice candidate assets for primary buttons, secondary buttons, reward slots, event choice slots, tooltip paper, and shared panels. Current Phaser controls in Town, WorldMap, Dungeon, Combat, Reward, Event, RuneBench, Boss, Result, and Settings route through shared skinned helpers where applicable, and Event choices expose disabled/focus state instead of only plain rectangles. `phaser:smoke` verifies `uiSkin=button+slot+tooltip`, hover/down pixel changes, disabled event choice non-advancement, Settings control hover, and screenshot coverage. This is technical runtime proof only. The actual `UI skin` release gate is not done because the current visuals are not concept/source-backed, not art-bible-faithful enough, and failed manual acceptance on 2026-06-01.
36. The first concept-backed UI rebuild checkpoint exists for Reward and Event. `assets/concepts/ui/reward_event_ui_concept_v001.png` and its note file record the visual target, Reward now uses an unfolding paper-stage card layout, Event now uses a paper-stage choice-card layout, and Reward card clicks/number keys now claim the selected reward instead of always relying on first-reward confirmation. `phaser:smoke`, `npm.cmd run check`, and `git diff --check` pass. This is still not final UI completion: the rubric scores Reward at 60/100 and Event at 58/100, both below the 85 critical-screen red line.
37. The second concept-backed Reward/Event UI rebuild enlarges Reward cards, adds stronger paper-stage details, adds reward detail labels, and changes Event into a story diorama plus choice-card layout. Debug-less in-app browser screenshots were captured under `tmp/ui-quality/reward-immersive-chrome-v3.png` and `tmp/ui-quality/event-immersive-chrome-v3.png`. Verification passed with `npx.cmd tsc --noEmit`, `npm.cmd run phaser:smoke`, `npm.cmd run check`, `npm.cmd run data:validate`, `npm.cmd run quality:audit:report`, `npm.cmd run assets:audit:release-visuals`, and `git diff --check`. This is still not final UI completion: the rubric scores Reward at 70/100 and Event at 68/100, both below the 85 critical-screen red line, and the broader `UI skin` gate remains `Not done`.
38. The third Reward/Event UI rebuild adds source-level component evidence in `assets/source/ui/reward_event_stage_components_v001.svg`, removes extra immersive info chrome from Reward/Event so the stage owns the screen, and strengthens Event choice cards with clearer cost/reward/selection bands. Debug-less evidence now includes `tmp/ui-quality/reward-immersive-chrome-v4.png`, `tmp/ui-quality/event-immersive-chrome-v4.png`, `tmp/ui-quality/reward-1920-debugless-v4.png`, and `tmp/ui-quality/event-1920-debugless-v4.png`. Verification passed with `npx.cmd tsc --noEmit`, `npm.cmd run phaser:smoke`, `npm.cmd run check`, `npm.cmd run data:validate`, `npm.cmd run quality:audit:report`, `npm.cmd run assets:audit:release-visuals`, and `git diff --check`. This is still not final UI completion: the rubric scores Reward at 76/100 and Event at 75/100, below the 85 critical-screen red line.
39. The first Combat UI rebuild adds source-level component evidence in `assets/source/ui/combat_stage_components_v001.svg`, switches Combat to the same immersive paper-theater shell, moves the player status panel and route strip away from the title ribbon, keeps the enemy intent and hand click coordinates smoke-compatible, and renders the player standee inside the playfield. Debug-less evidence now includes `tmp/ui-quality/combat-1920-debugless-v1.png` and `tmp/ui-quality/combat-1920-debugless-v2.png`. Verification passed with `npx.cmd tsc --noEmit`, `npm.cmd run phaser:smoke`, `npm.cmd run check`, `npm.cmd run data:validate`, `npm.cmd run quality:audit:report`, `npm.cmd run assets:audit:release-visuals`, and `git diff --check`. This is still not final UI completion: the rubric scores Combat at 72/100, below the 85 critical-screen red line.
40. The second Combat UI rebuild adds `assets/source/ui/combat_stage_components_v002.svg`, improves stage depth with side paper wings and hanging pins, changes the player panel into compact stat tags, strengthens the route strip connector, and adds a combat-flow lane while preserving card and End Turn smoke coordinates. The first v3 screenshot exposed hidden central text and out-of-panel gold, so v4 moved those labels into readable positions. Debug-less evidence now includes `tmp/ui-quality/combat-1920-debugless-v3.png` and `tmp/ui-quality/combat-1920-debugless-v4.png`. Verification passed with `npx.cmd tsc --noEmit`, `npm.cmd run phaser:smoke`, `npm.cmd run check`, `npm.cmd run data:validate`, `npm.cmd run quality:audit:report`, `npm.cmd run assets:audit:release-visuals`, and `git diff --check`. This is still not final UI completion: the rubric scores Combat at 78/100, below the 85 critical-screen red line.
41. The fourth Event UI rebuild adds dedicated source evidence in `assets/source/ui/event_stage_components_v002.svg`, adds side paper wings, a story label band, a stronger choice shelf, and refined choice cards with separate cost/result rows. The release four-choice screenshot first exposed a confirm-button collision with the bottom choice row, so the button was reduced and moved below the cards before recapture. Debug-less evidence now includes `tmp/ui-quality/event-1920-debugless-v5.png`, `tmp/ui-quality/event-release-1920-debugless-v5.png`, `tmp/ui-quality/event-1920-debugless-v6.png`, and `tmp/ui-quality/event-release-1920-debugless-v6.png`. Verification passed with `npx.cmd tsc --noEmit`, `npm.cmd run phaser:smoke`, `npm.cmd run check`, `npm.cmd run data:validate`, `npm.cmd run quality:audit:report`, `npm.cmd run assets:audit:release-visuals`, and `git diff --check`. This is still not final UI completion: the rubric scores Event at 81/100, below the 85 critical-screen red line.
42. The fifth Reward UI rebuild adds dedicated source evidence in `assets/source/ui/reward_stage_components_v002.svg`, rebuilds the reward surface around a centered prize-stage header, input badge, side paper wings, reward shelf, stronger reward cards, type ribbons, medallions, icon stamps, detail wells, and footer action strips. Debug-less evidence now includes slice, release-card, release-rune, and 1280x720 captures under `tmp/ui-quality/reward-*-v6.png`. The first v5 release screenshots exposed English reward-pool titles and an obscured shelf label, so the release pool titles were localized in `src/data/releaseCatalogAdapter.ts` and the hidden label was removed before v6 recapture. Verification passed with `npx.cmd tsc --noEmit`, `npm.cmd run phaser:smoke`, `npm.cmd run check`, `npm.cmd run data:validate`, `npm.cmd run quality:audit:report`, `npm.cmd run assets:audit`, `npm.cmd run assets:audit:release-visuals`, and `git diff --check`. This is still not final UI completion: the rubric scores Reward at 85/100, while Event 81/100 and Combat 78/100 remain below the 85 critical-screen red line and the total UI gate remains below 95.
43. The third Combat UI rebuild adds dedicated v3 source evidence in `assets/source/ui/combat_stage_components_v003.svg`, removes duplicate runtime overlay layers from Combat, rebuilds the player and enemy information as ledgers, adds route label backplates, and keeps the smoke-covered card and End Turn coordinates stable. Screenshot review of v5 found duplicate-layer/label issues and the first rerun of `phaser:smoke` found a long release enemy name overlapping HP text, so the enemy name typography was guarded and v7 screenshots were captured for slice, 1280, release, and Boss shared-panel views. Verification passed with `npx.cmd tsc --noEmit`, `npm.cmd run phaser:smoke`, `npm.cmd run check`, `npm.cmd run data:validate`, `npm.cmd run quality:audit:report`, `npm.cmd run assets:audit`, `npm.cmd run assets:audit:release-visuals`, and `git diff --check`. This is still not final UI completion: the rubric scores Combat at 85/100, while Event remains 81/100 and the total UI gate remains below 95.
44. The fifth Event UI rebuild adds dedicated v3 source evidence in `assets/source/ui/event_stage_components_v003.svg`, keeps the diorama/stage direction, and improves the release four-choice card layout with compact reward summaries plus separated cost/result label chips. The first v7 screenshot showed cost/value text crowding, so the label/value columns were separated and v8 slice/release screenshots were captured at both 1920x1080 and 1280x720. Verification passed with `npx.cmd tsc --noEmit`, `npm.cmd run phaser:smoke`, `npm.cmd run check`, `npm.cmd run data:validate`, `npm.cmd run quality:audit:report`, `npm.cmd run assets:audit`, `npm.cmd run assets:audit:release-visuals`, and `git diff --check`. This is still not final UI completion: the rubric scores Event at 85/100, and Reward/Event/Combat are all internal 85-point candidates, not 95-point or user-accepted final UI.
45. The first Boss UI rebuild adds dedicated source evidence in `assets/source/ui/boss_stage_components_v001.svg`, moves Boss out of the standard menu-shell presentation, and renders it as a purple/brass paper-theater boss stage using the Combat v3 family: title ribbon, route strip, player ledger, enemy intent ledger, boss phase ledger, player standee, hand shelf, and End Turn action. The first smoke pass caught boss phase ledger overlap with hand card numbers, and screenshot review found the release boss intent label too long near the End Turn area; the ledger was moved upward and boss intent labels were compacted before v4 captures. Debug-less evidence now includes `tmp/ui-quality/boss-1920-debugless-v4.png`, `tmp/ui-quality/boss-1280-debugless-v4.png`, and `tmp/ui-quality/boss-release-1920-debugless-v4.png`. Verification passed with `npx.cmd tsc --noEmit`, `npm.cmd run phaser:smoke`, `npm.cmd run check`, `npm.cmd run data:validate`, `npm.cmd run quality:audit:report`, `npm.cmd run assets:audit`, `npm.cmd run assets:audit:release-visuals`, and `git diff --check`. This is still not final UI completion: the rubric scores Boss at 84/100, and the total UI skin gate remains below 95 and not user-accepted.
46. The first Town UI rebuild adds dedicated source evidence in `assets/source/ui/town_stage_components_v001.svg`, moves Town out of the standard shell/button-list presentation, and renders it as a paper-theater village hub with a title ribbon, side paper wings, village diorama, expedition board, save-derived record slot, route markers, player passport, and the existing smoke-covered world-map/reset/settings actions. Screenshot v1-v3 review found route markers behind the world-map button, village labels crowded by the passport panel, and shortcut-like tooltip copy; v4 fixes those issues. Debug-less evidence now includes `tmp/ui-quality/town-1920-debugless-v4.png`, `tmp/ui-quality/town-1280-debugless-v4.png`, and `tmp/ui-quality/town-release-1920-debugless-v4.png`. Verification passed with `npx.cmd tsc --noEmit`, `npm.cmd run phaser:smoke`, `npm.cmd run check`, `npm.cmd run data:validate`, `npm.cmd run quality:audit:report`, `npm.cmd run assets:audit`, `npm.cmd run assets:audit:release-visuals`, and `git diff --check`. This is still not final UI completion: the rubric scores Town at 83/100, and Town/meta systems remain incomplete outside this visual pass.
47. The first WorldMap UI rebuild adds dedicated source evidence in `assets/source/ui/world_map_stage_components_v001.svg`, moves WorldMap away from a standard shell plus one action button, and renders it as an unfolded paper-theater map with a left map drawer, center route sheet, right record ledger, current-stage icon, and the existing smoke-covered `던전으로` action at `1010,512`. Screenshot v1-v2 review found right-ledger/tooltip crowding, route nodes too close to the record panel, and non-in-world helper copy; v3 fixes those issues by rerouting later nodes away from the ledger and replacing the tooltip with a simple ledger line. Debug-less evidence now includes `tmp/ui-quality/world-map-1920-debugless-v3.png`, `tmp/ui-quality/world-map-1280-debugless-v3.png`, and `tmp/ui-quality/world-map-release-1920-debugless-v3.png`. Verification passed with `npx.cmd tsc --noEmit`, `npm.cmd run phaser:smoke`, `npm.cmd run check`, `npm.cmd run data:validate`, `npm.cmd run quality:audit:report`, `npm.cmd run assets:audit`, `npm.cmd run assets:audit:release-visuals`, and `git diff --check`. This is still not final UI completion: the rubric scores WorldMap at 82/100, and the visual pass does not complete a full multi-stage selectable map system.
48. The first Dungeon UI rebuild adds dedicated source evidence in `assets/source/ui/dungeon_stage_components_v001.svg`, moves Dungeon away from current-room text plus one action button, and renders it as a paper-theater corridor with a left exploration ledger, center room door, route rail, encounter plaque, and the existing smoke-covered `방 입장` action at `1010,582`. Screenshot v1-v2 review found route-helper crowding and the first post-rebuild `phaser:smoke` run found the room number overlapping the button; v3 fixes those issues while preserving the button coordinate. Debug-less evidence now includes `tmp/ui-quality/dungeon-1920-debugless-v3.png`, `tmp/ui-quality/dungeon-1280-debugless-v3.png`, and `tmp/ui-quality/dungeon-release-1920-debugless-v3.png`. Verification passed with `npx.cmd tsc --noEmit`, `npm.cmd run phaser:smoke`, `npm.cmd run check`, `npm.cmd run data:validate`, `npm.cmd run quality:audit:report`, `npm.cmd run assets:audit`, `npm.cmd run assets:audit:release-visuals`, and `git diff --check`. This is still not final UI completion: the rubric scores Dungeon at 82/100, and the visual pass does not complete a full spatial dungeon navigation system.
49. The first RuneBench UI rebuild adds dedicated source evidence in `assets/source/ui/rune_bench_stage_components_v001.svg`, moves RuneBench away from the standard shell plus rune text rows, and renders it as a paper-theater socket workbench with a rune inventory ledger, target-card preview, rune stone, socket connector, right tuning ledger, and the existing smoke-covered `룬 장착` action at `1010,742`. Screenshot v1 found the action button covering the target card, and v2 found raw internal effect op text in the visible effect line; v3 moves the target card away from the button and replaces internal op names with Korean effect summaries. Debug-less evidence now includes `tmp/ui-quality/rune-bench-1920-debugless-v3.png`, `tmp/ui-quality/rune-bench-1280-debugless-v3.png`, and `tmp/ui-quality/rune-bench-release-1920-debugless-v3.png`. Verification passed with `npx.cmd tsc --noEmit`, `npm.cmd run phaser:smoke`, `npm.cmd run check`, `npm.cmd run data:validate`, `npm.cmd run quality:audit:report`, `npm.cmd run assets:audit`, `npm.cmd run assets:audit:release-visuals`, and `git diff --check`. This is still not final UI completion: the rubric scores RuneBench at 82/100, and the visual pass does not complete full rune selection, socket progression, or rune balance.
50. The first Result UI rebuild adds dedicated source evidence in `assets/source/ui/result_stage_components_v001.svg`, moves Result away from a generic result surface, and renders it as a paper-theater curtain-call certificate with a return ledger, tone-colored result seal, collection ledger, and the existing smoke-covered `마을로` action at `1010,742`. Debug-less evidence now includes neutral 1920/1280 captures plus defeat, slice-clear, and release-clear result captures at `tmp/ui-quality/result-*-v1.png`. Verification passed with `npx.cmd tsc --noEmit`, `npm.cmd run phaser:smoke`, `npm.cmd run check`, `npm.cmd run data:validate`, `npm.cmd run quality:audit:report`, `npm.cmd run assets:audit`, `npm.cmd run assets:audit:release-visuals`, and `git diff --check`. This is still not final UI completion: the rubric scores Result at 83/100, and the visual pass does not complete ending cinematics, achievement surfacing, long-term progression recap, or final result-state art.
51. The first Settings UI rebuild adds dedicated source evidence in `assets/source/ui/settings_stage_components_v001.svg`, moves Settings away from the standard shell panel, and renders it as a paper-theater settings ledger with a save stamp, audio ledger, display/accessibility/control ledger, tooltip, bottom action rail, and the existing smoke-covered control coordinates. Screenshot v1 exposed oversized labels and headings crowding panel borders; v2 reduces the typography while preserving click coordinates. Debug-less evidence now includes 1920, 1280, release, and high-contrast captures under `tmp/ui-quality/settings-*-v2.png`. Verification passed with `npx.cmd tsc --noEmit`, `npm.cmd run phaser:smoke`, `npm.cmd run check`, `npm.cmd run data:validate`, `npm.cmd run quality:audit:report`, `npm.cmd run assets:audit`, `npm.cmd run assets:audit:release-visuals`, and `git diff --check`. This is still not final UI completion: the rubric scores Settings at 84/100, and the visual pass does not complete music/SFX implementation, sound licensing, full key remapping, or final accessibility acceptance.
52. The second WorldMap rebuild adds dedicated v2 source evidence in `assets/source/ui/world_map_stage_components_v002.svg`, changes the left drawer from a decorative current-stage row into save-backed current/complete, selectable, and next-locked stage rows, and adds actual next-stage unlock after a stage clear. `phaser:smoke` now verifies a release `stage_sunny_gate` clear unlocks `stage_lavender_hall`, then selects that stage from WorldMap and records `flow:stage_select:stage_lavender_hall`. Debug-less evidence includes v5 slice, 1280, release default, release unlocked, and release selected screenshots under `tmp/ui-quality/world-map-*-v5.png`. This is still not final UI completion: the rubric scores WorldMap at 86/100, and the pass does not complete a full 15-stage atlas, all progression rules, final map art, or user-accepted UI.
53. The second Dungeon rebuild adds dedicated v2 source evidence in `assets/source/ui/dungeon_stage_components_v002.svg`, changes the screen from a mostly static corridor into a state-driven room-progression surface, and displays current marker, sealed/revealed next marker, boss distance, resources, and route state labels from the active run. `phaser:smoke` verifies `relic_soft_compass` revealing the next room type and writes `tmp/phaser-dungeon-release-soft-compass.png`. Debug-less evidence includes v5 slice, 1280, release default, and release compass screenshots under `tmp/ui-quality/dungeon-*-v5.png`. This is still not final UI completion: the rubric scores Dungeon at 85/100, and the pass does not complete full spatial dungeon navigation, branching decisions, final dungeon art, or user-accepted UI.
54. The second RuneBench rebuild adds dedicated v2 source evidence in `assets/source/ui/rune_bench_stage_components_v002.svg`, changes the workbench from a visual target-card/rune display into a state-driven attachment preview, and displays before/after cost, damage, or block stats plus compatibility and change lines from the active rune/card pair. The first `phaser:smoke` rerun caught a text overlap between a decorative `룬` label and the socket label, so that label was removed before v5 screenshots. Debug-less evidence includes v5 slice, 1280, and release screenshots under `tmp/ui-quality/rune-bench-*-v5.png`. This is still not final UI completion: the rubric scores RuneBench at 85/100, and the pass does not complete manual rune/card selection, socket progression, rune balance, final rune art, or user-accepted UI.
55. The second Town rebuild adds dedicated v2 source evidence in `assets/source/ui/town_stage_components_v002.svg`, changes the hub from a mainly thematic village/passport screen into a save/profile-driven expedition board, and displays unlocked/completed/remaining stage counts, next expedition, completed-stage stamps, route preview, and next-sealed status from runtime state. v5/v6/v7 screenshots exposed route-card or sealed-label crowding, so v8 shortens and relocates the next-sealed summary inside the remaining-stage stat before scoring. Debug-less evidence includes v8 slice, 1280, release, and progressed-release screenshots under `tmp/ui-quality/town-*-v8.png`. Verification passed with `npx.cmd tsc --noEmit`, `npm.cmd run phaser:smoke`, `npm.cmd run check`, `npm.cmd run data:validate`, `npm.cmd run quality:audit:report`, `npm.cmd run assets:audit`, `npm.cmd run assets:audit:release-visuals`, and `git diff --check`. This is still not final UI completion: the rubric scores Town at 86/100, and the pass does not complete shops, upgrades, character unlocks, museum/relic/arcana surfaces, long-term progression balance, final town art, or user-accepted UI.
56. The second Result rebuild adds dedicated v2 source evidence in `assets/source/ui/result_stage_components_v002.svg`, changes the result certificate from a prettier summary into a clearer run-recap surface, and displays route progress, route composition, next action, saved clear count, deck delta, and preservation summary from runtime state. v2 placed the next-action ticket under the collection ledger, v3 made the top ribbon too cramped, and v4 widened it into the result title area; v5 moves next action into the lower record row before scoring. Debug-less evidence includes v5 neutral, 1280, defeat, slice-clear, and release-clear screenshots under `tmp/ui-quality/result-*-v5.png`. Verification passed with `npx.cmd tsc --noEmit`, `npm.cmd run phaser:smoke`, `npm.cmd run check`, `npm.cmd run data:validate`, `npm.cmd run quality:audit:report`, `npm.cmd run assets:audit`, `npm.cmd run assets:audit:release-visuals`, and `git diff --check`. This is still not final UI completion: the rubric scores Result at 86/100, and the pass does not complete ending cinematics, achievement surfacing, long-term progression recap, final result-state art, balance, or user-accepted UI.
