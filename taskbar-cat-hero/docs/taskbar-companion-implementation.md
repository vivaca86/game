# 한 반죽 작업표시줄 고양이 구현 및 Unity 인계

상태: **Implemented, not verified** — 자산·코드·자동 검증은 완료됐고 사용자의 실제 `file:` 연속 재생 승인이 남음  
범위: 작업표시줄 고양이, 입력 반응, 완료 표시, 드래그. 확장 관리 게임 마크업과 게임 밸런스는 변경하지 않음.  
권위 자료: `PROJECT_RULES.md`, `docs/recovery-audit.md`, `assets/taskbar-cat-baker-v2/PROVENANCE.md`, `assets/taskbar-cat-baker-v2/taskbar-cat-baker-v2-manifest.json`

## 최신 사용자 결정

- 반죽은 좌우 두 개가 아니라 두 앞발 아래에서 가운데가 끊기지 않은 **한 덩어리**다.
- 그 한 반죽에서 실제 입력에 따라 좌우 앞발이 번갈아 누른다.
- 도구, 냄비, 액체, 서비스 벨, 전신 6포즈 생성과 전신 무한 루프를 사용하지 않는다.
- 작업 완료는 체크/`완성` 표시만 추가하며 움직임을 잠그지 않는다.
- 고양이 전체 위젯은 드래그로 이동할 수 있다.
- 확장 메뉴가 열려도 고양이는 메뉴 위에 보이고 활성 상태를 유지하며, 같은 고양이를 다시 누르면 메뉴가 닫힌다.

## 현재 런타임 자산

- 경로: `assets/taskbar-cat-baker-v2/taskbar-cat-baker-v2-atlas.png`
- 분류: generated prototype, not IP-holder/production approved
- SHA-256: `a651b8e1295d127355e6214b50ba4ad6157a3018636f335a2d5b5a3651cc4ce6`
- 아틀라스: 1024 × 1024px, 2열 × 2행
- 셀: 512 × 512px
- 브라우저 표시: 128 × 128px, `background-size: 256px 256px`
- 보존 마스터: 각 상태의 1254 × 1254px 투명 합성본
- 피벗: Unity 정규화 bottom-center `(0.5, 0.0)`

| 인덱스 | ID | CSS 위치 | 용도 |
|---:|---|---|---|
| 0 | `neutral` | `0 0` | 한 반죽 위에 두 앞발을 둔 고정 중립 |
| 1 | `key-left` | `-128px 0` | viewer-left 앞발과 그 아래 반죽만 누름 |
| 2 | `key-right` | `0 -128px` | viewer-right 앞발과 그 아래 반죽만 누름 |
| 3 | `blink` | `-128px -128px` | 눈만 감은 상태, 졸기 정지 포즈 겸용 |

이전의 `happy-click` 포즈는 제거했다. `click`, `pet`, `celebrate` 같은 의미 ID가 필요할 때는 `neutral`로 안전하게 해석하고, 실제 클릭/휠 반죽 동작은 아래의 유한 시퀀스가 담당한다.

## 동작과 타이밍

| 상황 | 동작 |
|---|---|
| 평상시 | `neutral` 정지. 몸 애니메이션 루프 없음 |
| 자동 깜빡임 | 4.2–8.4초의 불규칙 간격, `blink` 130ms 뒤 중립 복귀 |
| 일반 키 입력 | 입력마다 viewer-left/right를 교대, 해당 pose 110ms |
| 빠른 키 입력 | 90ms 제한으로 중복 과속을 억제하고 마지막 유한 pose가 중립으로 복귀 |
| 페이지 클릭 | `key-left → key-right → key-left → neutral`, 각 95ms |
| 휠 | 클릭과 같은 유한 시퀀스, 각 95ms |
| 5분 이상 유휴 | `blink` 정지 포즈 + 기존 정적 `Zz` 표시 |
| 완료 | 체크와 `완성`만 표시; 키·클릭·휠·깜빡임 계속 허용 |
| 모션 끄기 | `neutral` 고정 |

`setWidgetReactionSequence`는 토큰으로 이전 타이머를 무효화한다. 입력이 겹쳐도 서로 다른 시퀀스가 쌓여 무한 반복되지 않으며, 마지막 단계 뒤 `reaction="none"`으로 돌아간다. CSS에는 고양이 본체의 translate, rotate, scale, bounce, cross-fade 또는 steps loop가 없다.

## 드래그와 완료 분리

- 주 포인터 왼쪽 버튼만 드래그를 시작한다.
- 5px 미만 이동은 클릭, 5px 이상은 드래그로 판정한다.
- 포인터 캡처로 빠른 이동 중에도 드래그를 유지한다.
- 위치는 화면 안으로 제한하고 viewport/고양이 크기에 대한 정규화 `x`, `y`로 저장한다.
- DPI·해상도·창 크기 변경 시 정규화 위치를 새 화면 경계에 다시 투영한다.
- 드래그 종료 뒤 700ms 안의 합성 pointer click은 수령/패널 열기로 사용하지 않는다.
- 키보드 활성화(`event.detail === 0`)는 이전 드래그 때문에 차단하지 않는다.
- 완료 상태는 `WorkOrder`에만 존재하며 pose 결정 함수에는 전달하지 않는다. 따라서 완료 표시가 움직임을 잠글 수 없다.

## 확장 메뉴 열기·닫기

- 닫힌 상태에서 고양이를 누르면 준비된 작업을 한 번만 수령한 뒤 확장 메뉴를 연다.
- 열린 상태에서 고양이를 누르면 보상 수령 검사보다 먼저 메뉴를 닫고 반환한다.
- 메뉴 뒤에서 작업이 완료되어도 “닫으려던 클릭”이 보상 수령과 재열기로 바뀌지 않는다.
- 고양이 버튼은 메뉴가 열려도 `disabled`가 되지 않으며 `aria-expanded`와 `aria-label`이 `가게 닫기` 상태를 반영한다.
- 고양이는 메뉴보다 높은 z-index에 유지되고, 투명한 나머지 위젯 영역은 계속 pointer pass-through다.
- 메뉴가 열린 동안에도 드래그 위치 저장과 드래그 후 합성 클릭 억제가 동일하게 동작한다.
- 상단 `×` 닫기 버튼은 대체 입력으로 그대로 유지한다.

## 품질 수치와 내부 시각 검사

- 선언된 전체 해상도 마스크 밖 변경: `0px`
- 네 런타임 프레임 바닥선: 모두 source y=`511`, 범위 `0px`
- active kneading 3상태의 128px 하체 중심 범위: `0.5184px`
- blink를 포함한 4상태의 별도 Node 하체 영역 중심 범위: `0.7171px`
- 보이는 초록 오염: `0px`
- 128px 밝은/어두운 접촉표와 1254px 좌/우 합성본: 내부 및 별도 디자인 검수에서 반죽 한 덩어리, 소매 연결 앞발 2개, 접촉 그림자, 좌우 눌림 가독성, 마스크 이음새 없음과 도구 없음 확인. 독립 판정 `APPROVE`

두 중심 측정은 서로 다른 하체 시작 행을 사용하지만 둘 다 품질 기준 1px 미만이다. 숫자는 실제 모션 감각을 대신하지 않으며 사용자의 최종 속도 연속 관찰이 필요하다.

## 프로토타입 코드와 Unity 대응

| 웹 책임 | Unity 대응 |
|---|---|
| `taskbar-widget-core.js`의 `WorkOrder` | 직렬화 가능한 `TaskbarWorkOrder` C# 모델 |
| `resolveAmbientState` | `CatAmbientDirector` 상태 머신 |
| `resolveTaskbarPose` | 등록 pose ID만 반환하는 `TaskbarCatPresenter` |
| `setWidgetReaction`/`setWidgetReactionSequence` | 비반복 `AnimationClip` 또는 pose-hold 큐 |
| 익명 키/클릭/휠 펄스 | 사용자 동의 기반 `IActivitySignalSource` Windows 어댑터 |
| 정규화 드래그 위치 | 모니터 work area/DPI를 처리하는 overlay placement service |
| `localStorage` | 버전이 있는 `ISaveRepository` |
| `Date.now()` | 주입 가능한 `IClock` |
| CSS 2 × 2 셀 선택 | Unity Sprite Multiple + Full Rect, Animator/Presenter의 이산 상태 |

Unity 가져오기: Sprite (2D and UI), Multiple, 2 × 2, 512px cells, spacing/padding 0, Full Rect, Bilinear, Compression None, mipmaps off, rotation/tight packing off. 캐릭터 Transform을 흔드는 별도 idle clip을 추가하지 않는다.

## 재생성 및 자동 검증

QA 전용 Python 의존성은 `scripts/requirements-imagegen.txt`의 `Pillow==12.3.0`이다. 런타임 의존성이 아니며 프로젝트 로컬 임시 경로에서만 사용한다.

```text
python scripts/refine-baker-motion-sources.py --check
python scripts/build-taskbar-cat-baker-v2-atlas.py --check
node --check taskbar-widget-core.js
node --check app.js
node --check scripts/build-single.mjs
node --test tests/taskbar-widget-core.test.js tests/taskbar-integration.test.js tests/taskbar-sprite-stability.test.js
node scripts/build-single.mjs --check
```

2026-07-10 실제 자동 검증 결과:

- Node 테스트: `26/26` 통과. 열린 메뉴에서 고양이 표시·활성·상단 배치, 재클릭 닫기 우선순위, 열린 상태 드래그 회귀 검사를 포함한다.
- 확장창 `<main>` 마크업: 5,754 bytes, SHA-256 `f78df5d5fcafefc378d0e56c1c6f3601ddf88a3264318126659105ffe10f3cdb`
- 단일 HTML: 14,190,915 bytes, SHA-256 `f6c468d757cdab2496d116f86cd7e3511924da851c1ecf5a553463abd3c8c97b`
- 단일 HTML은 PNG 18개를 무손실 Base64로 포함하고 v31 보관본 및 baker v2 아틀라스 품질 게이트를 통과했다.
- `package.json`이 없으므로 npm 스크립트가 아니라 Node 내장 테스트 러너를 사용한다.

## 남은 사용자 연속 플레이 게이트

현재 Browser 보안 응답은 사용자의 열린 로컬 `file:` 탭 제어와 localhost 대체를 모두 금지한다. 따라서 다음은 사용자가 `taskbar-cat-hero-single.html`을 새로고침해 직접 확인해야 한다.

1. 중립이 정지해 있고 몸 전체가 좌우로 흔들리지 않는가.
2. 키 입력에서 한 반죽의 좌우 누름이 자연스럽고 110ms가 과속처럼 보이지 않는가.
3. 클릭/휠의 세 번 누름이 95ms × 3 뒤 확실히 끝나는가.
4. 깜빡임에서 눈 외의 얼굴·몸·작업대가 번쩍이지 않는가.
5. 완료 뒤에도 반응하고 드래그가 수령 클릭으로 오인되지 않는가.
6. 밝고 어두운 바탕에서 마스크 이음새나 초록 프린지가 보이지 않는가.

이 실제 확인이 기록되기 전에는 상태를 `Complete`, `Passed`, production-approved 또는 IP-holder-approved로 올리지 않는다.
