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
| 원작 기준 버전 | 미확정 | 조사 기준 버전/패치/영상 기준선 확정 |
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

## 다음 작업

1. `simulation/`에 전투 상태, 카드 사용, 적 의도 처리의 첫 규칙을 연결한다.
2. `TownScene -> WorldMapScene -> DungeonScene -> CombatScene`의 입력 기반 scene flow를 연결한다.
3. `RewardScene`, `RuneBenchScene`, `BossScene`, `ResultScene`을 실제 상태 변화와 연결한다.
4. fixture의 `encounterPoolId`를 별도 encounter pool 데이터로 분리할지 결정한다.
5. 첫 구현 착수 전 원작 기준 버전/패치/영상 기준선을 확정한다.

위 작업이 나오기 전에는 본격 구현 착수 또는 원작 유사도 판정을 하지 않는다.

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
- `docs/vertical-slice-data.fixture.v1.json`: 첫 세로 조각 데이터 fixture
- `docs/asset-manifest.slice.v1.json`: 첫 세로 조각 planned asset manifest
- `docs/validation-rules-v1.md`: fixture/manifest 검증 기준
- `docs/phaser-project-structure-plan.md`: Phaser 프로젝트 폴더와 책임 경계 계획
- `docs/phaser-boot-flow-plan.md`: Phaser 부트, preload, entry scene 순서 계획
- `docs/debug-entry-plan.md`: URL debug entry와 debug action 계획
- `docs/implementation-start-checklist.md`: 실제 구현 착수 전 체크리스트
## 2026-05-26 Implementation Status Update

- `src/simulation/` now owns the first slice run/combat state: player HP/energy/block, hand/draw/discard, enemy HP/block/intent, reward offers, rune attachment, boss phase flag, and run log.
- Phaser scenes now route keyboard input through a scene-to-simulation boundary instead of mutating view-only state.
- Verified flow: town -> world map -> dungeon -> combat -> reward -> rune bench -> combat -> boss -> result -> town.
- Verified combat behaviors: attack damage, block gain, draw, enemy turn damage, rune-modified damage, boss phase trigger.
- This is still foundation work, not final balance, final art, full save persistence, exhaustive source parity, or a full vertical-slice pass.

Current next work:

1. Add save reload verification for the run state and confirm no Phaser objects enter save data.
2. Add 1920x1080 screenshot checks and visual overlap review.
3. Add effect-audit coverage so card descriptions and effect ops are checked against each other.
4. Decide whether `encounterPoolId` stays a direct enemy/boss id for the slice or becomes explicit encounter-pool data.
5. Continue source/version confirmation separately before any parity or 95% similarity claim.
