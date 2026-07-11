# 관리창 UX 재설계 v2 — 40분 제한 패스

## 상태

**Implemented, not browser-verified.**

이 패스는 기존 menu-v1을 다듬는 작업이 아니다. 기존 화면은 기본 표현 품질과 UI/UX 게이트에서 거절 상태로 보존하고, 새 관리창의 목적·흐름·정보 구조·시각 시스템을 비교할 수 있는 별도 프로토타입을 만든다.

시작: 2026-07-11 06:39:59 KST  
마감 상한: 2026-07-11 07:19:59 KST

## 한 문장 목적

> 플레이어가 관리창을 열고 10초 안에 `오늘 고양이가 무엇을 했는지`, `다음에 무엇을 시킬지`, `그 선택이 작업표시줄 고양이를 어떻게 바꾸는지` 결정하는 화면.

## 첫 10초 사용자 흐름

1. 큰 고양이 장면에서 현재 상태를 읽는다.
2. 오른쪽의 단 하나의 `다음에 할 일`을 확인한다.
3. 필요한 재료와 예상 시간을 확인한다.
4. 주 행동을 누르거나, 준비된 농장 항목으로 이동한다.
5. 하단 흐름과 작업표시줄 결과 문구로 선택의 결과를 확인한다.

## 기존 화면 감사

### 기능적으로 보존할 것

- 고양이 클릭으로 관리창 열기/닫기
- 요리 ↔ 재료 생산의 경제 연결
- 고양이 관계/의상 선택이 작업표시줄 표현에 영향을 주는 방향
- 농장 생산의 `준비됨 / 남은 시간 / 비어 있음` 상태
- 저장 가능한 안정 ID와 Unity용 데이터 분리 방향

### 표현에서 폐기할 것

- `assets/menu-v1/`의 래스터 아이콘, 생산 타일, 초상, 배경을 presentation runtime에 직접 재사용
- 상단 시스템 6개와 모든 콘텐츠를 한 화면에 동시 노출
- 이미지 자체의 불투명 사각 배경
- 한 자산을 카드·버튼·탭에 역할 구분 없이 복제
- 모든 생산 카드 아래 동일한 초록 막대와 `받기` 버튼
- 실제 의미가 없는 장식성 진행바
- 일반 웹 툴바처럼 보이는 동일 둥근 사각 버튼 나열

## 방향 3안

| 방향 | 중심 경험 | 장점 | 위험 | 판정 |
|---|---|---|---|---|
| A. 고양이 중심 홈 | 현재 고양이 + 다음 한 행동 + 작업표시줄 결과 | 펫 감성과 관리 루프를 동시에 연결 | 공간 아트가 약하면 카드 UI로 기울 수 있음 | **추천** |
| B. 하루 계획표 | 수확 → 요리 → 서빙 순서 | 목표와 진행 순서가 가장 명확 | 고양이가 임무 아이콘으로 축소될 수 있음 | 보조 모드 참고 |
| C. 식당 공간 | 한 장소 안의 주방/농장/고양이 핫스팟 | IP 세계와 장소성이 강함 | 고품질 방 배경과 상태 레이어 비용이 큼 | 장기 방향 후보 |

## 추천안 A — 정보 구조

### 전역 내비게이션 4개

1. **오늘** — 현재 상태, 다음 행동, 준비 알림, 작업표시줄 결과
2. **주방** — 레시피 한 개 선택, 재료 비교, 결과 확인
3. **농장** — 준비된 곳부터 수확, 다음 생산 한 개 배치
4. **고양이** — 관계, 의상, 작업표시줄 외형/행동 미리보기

파견과 컬렉션은 처음부터 전역 탭으로 노출하지 않는다. 파견은 농장/오늘 화면의 문맥 행동으로, 컬렉션은 고양이 화면의 하위 섹션으로 검증한다.

### 오늘 화면 위계

1. 현재 고양이 상태
2. 다음에 할 일 한 개
3. 준비된 알림
4. `수확 → 요리 → 작업표시줄 변화` 인과 흐름
5. 관계 상태

### 진행 표현

- `준비됨`: 초록 인장과 명시적인 행동 버튼
- `진행 중`: 남은 시간 칩 또는 원형 시간 표시
- `비어 있음`: 다음 생산 선택 행동
- 레벨/친밀도처럼 누적값이 필요한 경우에만 막대 사용
- 모든 카드에 동일한 막대를 넣지 않는다

## 시각 시스템 v0.1

### 역할 색

- Ink `#34251F` — 텍스트와 외곽
- Cream `#FFF8E9` — 주 표면
- Paper `#F8E8C8` — 보조 표면
- Teal `#277F72` — 현재 행동과 선택
- Coral `#DC624B` — 캐릭터/보상 강조
- Gold `#F0B84D` — 화폐와 축하
- Green `#58A65D` — 실제로 준비된 상태만

### 컨트롤 규칙

- 주 행동은 화면당 하나만 강한 teal 입체 버튼으로 표시
- 기본/hover/focus/pressed/selected/disabled/ready 상태를 역할별로 만든다
- 아이콘은 코드 기반 SVG에서 동일한 24×24 viewBox, 2px 둥근 선, fill 없음으로 시작한다
- 래스터 아이콘은 투명 배경과 공통 원근·광원·선 굵기를 갖춘 새 세트를 승인한 뒤 교체한다
- 같은 내용이라도 탭 아이콘, 행동 버튼, 보상 이미지는 역할별 프레이밍이 다르다

## 자산 분류

| 자산 | 분류 | v2 사용 |
|---|---|---|
| `assets/menu-v1/**` | rejected presentation runtime / reference evidence | 사용하지 않음 |
| `assets/taskbar-cat-cutout-rig-v4/chef-cat-transparent-neutral-open-eyes.png` | user-selected style derivative / prototype anchor | A안의 고양이 앵커로만 사용 |
| 인라인 SVG 내비게이션 | code-native prototype asset | 구조 검증에 사용 |
| 신규 홈/주방/농장 공간 아트 | 미제작 | 다음 아트 패스 |
| 신규 음식·재료·시설 아이콘 | 미제작 | 하나의 스타일 보드 승인 후 제작 |
| 신규 버튼/상태 스킨 | CSS 구조만 제작 | 아트 패스에서 9-slice/Unity Sprite로 전환 |

## Unity 포팅 경계

- 전역 화면 ID: `Today`, `Kitchen`, `Farm`, `Cat`
- 홈의 `NextAction`은 화면이 계산하지 않고 도메인 presenter가 제공
- `TaskbarConsequence`는 선택 결과를 설명하는 데이터이며 Windows 오버레이 어댑터와 분리
- 생산 상태: `Ready`, `Running`, `Empty`의 명시적 enum
- 컨트롤 스킨은 Unity UI Toolkit/UGUI의 9-slice Sprite와 상태별 Style로 매핑
- 내비게이션 SVG는 프로토타입용이며 최종 Unity 아이콘 세트로 교체

## 산출물

- 인터랙티브 비교 프로토타입: `prototypes/menu-redesign-v2/index.html`
- 추천안 정적 QA: `prototypes/menu-redesign-v2/qa/direction-a-cat-home-1280x720.png`
- B안 정적 QA: `prototypes/menu-redesign-v2/qa/direction-b-day-planner-1280x720.png`
- C안 정적 QA: `prototypes/menu-redesign-v2/qa/direction-c-restaurant-room-1280x720.png`
- 결정적 QA 렌더러: `scripts/build-menu-redesign-v2-preview.py`
- 컨트롤 상태표: `prototypes/menu-redesign-v2/control-states.html`
- 컨트롤 정적 QA: `prototypes/menu-redesign-v2/qa/control-state-sheet-1280x520.png`
- QA 해시/크기 매니페스트: `prototypes/menu-redesign-v2/prototype-manifest.json`
- 구조 회귀 테스트: `tests/menu-redesign-v2.test.js`

## 수행한 검증

- 기존 rejected `assets/menu-v1/` 참조: 0
- 추천안의 주 행동: 1개
- 전역 내비게이션: 4개
- 장식성 progress element/class: 0
- 방향 정적 QA 산출물: 3개, 각 1280×720
- 컨트롤 정적 QA 산출물: 1개, 1280×520
- 프로토타입 전용 테스트: 7/7 통과
- 프로젝트 전체 테스트: 42/42 통과
- JS 문법 검사: 통과
- A/B/C PNG를 실제 크기로 직접 검토

정적 QA PNG는 DOM 스크린샷이 아니다. HTML의 실제 레이아웃·hover/pressed·전환은 사용자가 열어 보거나 접근 가능한 HTTP(S) 검수 주소에서 다시 확인해야 한다.

## 다음 작업 순서

### P0 — 다음 40분 패스

1. 사용자가 A/B/C 방향 또는 혼합 방향을 선택
2. 추천안 A의 실제 HTML 전체 화면 캡처 검수
3. `주방` 화면 와이어프레임과 레시피 선택 흐름 구현
4. 상태별 버튼 스킨 표: default/hover/pressed/selected/disabled/ready
5. 홈 배경과 핵심 행동 아이콘의 아트 스타일 보드 한 장 제작

### P1 — 방향 승인 뒤

1. 음식·재료·시설 아이콘의 투명 고해상도 마스터 세트
2. 농장 `Ready/Running/Empty` 실제 인터랙션
3. 선택 결과를 작업표시줄 고양이 상태 머신과 연결
4. 1280×720, 1600×900, 1920×1080, 125%/150% DPI 검수
5. Unity ScriptableObject/Presenter 계약 문서와 9-slice 내보내기

### 아직 하지 않은 것

- 기존 `index.html/styles.css/app.js` 교체
- 최종 UI 아트 생성
- HTTP(S) 배포
- 브라우저 실제 화면 검수
- IP-holder 또는 사용자 방향 승인
