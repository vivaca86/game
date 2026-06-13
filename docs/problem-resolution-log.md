# 문제 해결 로그

이 문서는 작업 중 발견된 문제점, 반복되는 실패 원인, 품질 리스크, 해결 방안, 재발 방지 기준, 해결 커밋을 관리하는 파일이다.
대화 원문 기록은 `docs/conversation-log.md`에서 관리하고, 이 문서는 문제와 해결 방안을 따로 추적한다.

## 2026-05-24

### 문제: 대화 기록이 요약본으로 제안됨

- 원인: Codex가 "히스토리 보존용 대화 로그"를 원문 기록이 아니라 요약 인수인계 문서로 잘못 해석했다.
- 영향: 사용자가 원한 실제 대화 원문 기록과 달라, 나중에 맥락 확인 시 판단 과정이 누락될 수 있다.
- 해결 방안: 대화 로그는 요약하지 않고 사용자 요청과 Codex 답변을 가능한 한 원문 그대로 기록한다.
- 재발 방지 기준: `PROJECT_RULES.md` 2번 규칙에 "요약본이 아니라 원문 그대로"라는 기준을 명시한다.
- 해결 커밋: `d87fe0e Add conversation and problem logs`

### 문제: 문제점과 해결 방안이 대화 로그에 섞일 가능성

- 원인: 대화 로그와 문제 해결 기록의 목적이 다르지만, 별도 파일이 없으면 한 문서에 섞일 수 있다.
- 영향: 이후 작업자가 반복 문제, 해결 방안, 재발 방지 기준을 빠르게 찾기 어렵다.
- 해결 방안: 문제점과 해결 방안은 `docs/problem-resolution-log.md`에서 별도 관리한다.
- 재발 방지 기준: `PROJECT_RULES.md` 3번 규칙에 문제 해결 로그 관리 기준을 명시한다.
- 해결 커밋: `d87fe0e Add conversation and problem logs`

## 2026-05-26

### 문제: 프로젝트 운영 규칙을 에이전트가 놓칠 수 있음

- 원인: 원격 최신 저장소에는 `PROJECT_RULES.md`와 `docs/handoff.md`가 있었지만, Codex/에이전트가 작업 시작 시 어떤 문서를 먼저 읽어야 하는지 알려주는 루트 `AGENTS.md`가 없었다. 전역 `C:\Users\i\.codex\AGENTS.md`도 비어 있었다.
- 영향: 새 세션이나 다른 PC에서 `PROJECT_RULES.md`의 작업 루트 정리, 대화 원문 로그, 문제 해결 로그 규칙을 놓치고 작업할 수 있다.
- 해결 방안: 저장소 루트에 `AGENTS.md`를 추가해 작업 시작 전 `PROJECT_RULES.md`, `docs/handoff.md`, `docs/current-issues-and-plan.md`, `docs/recovery-audit.md`, `RESEARCH_CHECKLIST.md`를 읽도록 지정한다. 전역 `C:\Users\i\.codex\AGENTS.md`에도 저장소 `AGENTS.md`를 우선 확인하라는 공통 지시를 작성한다.
- 재발 방지 기준: 저장소 운영 규칙이 새로 생기거나 바뀌면, 실제 규칙 문서뿐 아니라 에이전트 진입점인 `AGENTS.md`도 함께 갱신한다.
- 해결 커밋: `7ecf677 Add agent entry rules`, later strengthened by `61c40d5 Strengthen agent operating rules`

### 문제: 완료 판정과 작업 범위가 Codex 내부 판단으로 흐려질 수 있음

- 원인: 위험하거나 큰 작업에서 Codex가 사용자의 지시 범위를 그대로 제시하지 않고, 안전이나 속도를 이유로 내부에서 범위를 축소하거나 완료 상태를 좋게 표현할 여지가 있었다.
- 영향: 사용자는 Codex의 완료 보고를 기준으로 다음 결정을 하므로, 완료되지 않은 일을 완료처럼 말하면 프로젝트 판단 전체가 틀어질 수 있다.
- 해결 방안: `AGENTS.md`를 영어 authoritative 규칙과 한글 참고 번역 구조로 개편했다. 실제 기준은 `Authoritative English Rules`로 고정하고, 위험 작업 범위 제시, 조용한 범위 변경 금지, 전수조사 체크리스트 선행, 완료/부분 완료/검증 미완료 상태 구분을 명시했다. `PROJECT_RULES.md`에도 `AGENTS.md`의 영문 규칙을 에이전트 운영 기준으로 연결했다.
- 재발 방지 기준: 중요한 작업은 `Confirm instruction -> Check records -> Present scope/criteria -> Get approval when risky -> Execute -> Verify -> State completion level -> Report remaining risk` 흐름을 따른다. 체크리스트와 검증 근거 없이 `Research complete`, `95% close`, `Passed`, `Complete` 표현을 쓰지 않는다.
- 해결 커밋: `61c40d5 Strengthen agent operating rules`

### 문제: 실패 가능성, 검증 계획, 필요한 도구 요청이 늦게 드러날 수 있음

- 원인: Codex가 작업 전에 실패 가능성, 필요한 외부 자료, 도구/의존성, 검증 방법을 명시하지 않으면 중간에 "자료가 없다", "도구가 없다", "검증을 못 했다"는 식으로 뒤늦게 한계가 드러날 수 있다.
- 영향: 실제로 필요한 무료 도구나 의존성을 설치하면 해결될 문제도 차단처럼 보일 수 있고, 반대로 유료 도구나 계정 제한이 필요한 일을 완료 가능한 것처럼 오판할 수 있다.
- 해결 방안: `AGENTS.md`에 `Pre-Execution Failure Mode Review`, `Tool And Dependency Handling`, `Verification Plan` 조항을 추가했다. 무료로 설치 가능한 필수 의존성은 사용자에게 허가를 요청하고, 유료 제품/유료 API/라이선스 자산/계정 제한 서비스는 한계를 보고한 뒤 사용자 제공 접근 권한 또는 무료 대안을 제시하도록 했다.
- 재발 방지 기준: 중요한 작업은 실행 전에 범위 이탈, 완료 오판, 자료 부족, 도구/의존성 부족, 검증 공백, 복구 위험을 점검한다. 필수 도구나 자료가 없으면 `Complete`라고 말하지 않고 `Blocked`, `Cannot judge completion`, `Research incomplete`, `Implemented, not verified` 중 맞는 상태로 보고한다.
- 해결 커밋: `2d59f94 Add preflight failure mode rules`

### 문제: 긴 작업 중 기준 이탈이나 최신 사용자 지시 누락이 생길 수 있음

- 원인: 여러 단계로 진행되는 작업에서 중간 체크포인트가 없으면 원래 범위와 현재 작업이 어긋나거나, 중단/요약/새 사용자 메시지 이후 이전 지시 기준으로 마무리할 수 있다.
- 영향: 사용자가 최신 지시로 방향을 바꿨는데도 Codex가 이전 목표를 완료 처리하거나, 새 위험과 검증 공백을 놓친 채 진행할 수 있다.
- 해결 방안: `AGENTS.md`에 `Progress Checkpoints And Drift Control` 조항을 추가하고, `PROJECT_RULES.md`에도 오래 걸리거나 여러 단계로 나뉘거나 위험도가 높은 작업은 체크포인트를 두도록 명시했다.
- 재발 방지 기준: 체크포인트마다 완료 항목, 남은 항목, 원래 범위와 현재 작업의 일치 여부, 새 위험/도구 부족/자료 부족/검증 공백을 갱신한다. 중단, 요약, 컨텍스트 손실, 사용자 새 메시지 이후에는 계속하기 전에 최신 사용자 지시를 다시 확인한다.
- 해결 커밋: `62e92bd Add progress checkpoint rules`

### 문제: 문제 해결 로그의 해결 커밋이 placeholder로 남아 있음

- 원인: 문제 해결 로그는 해결 커밋을 기록해야 하지만, 기존 항목들이 실제 커밋 해시가 아닌 일반 placeholder 문구로 남아 있었다.
- 영향: 이후 작업자가 어떤 변경으로 문제가 해결됐는지 Git에서 직접 추적하기 어렵다.
- 해결 방안: 기존 문제 해결 항목의 해결 커밋을 실제 커밋 해시와 커밋 제목으로 교체했다.
- 재발 방지 기준: 문제 해결 로그를 작성할 때는 placeholder가 아니라 실제 커밋 해시를 적는다. 아직 커밋 전이면 커밋 전 상태임을 명확히 적고, 커밋 후 실제 해시로 교체한다.
- 해결 커밋: `62f53b0 Record explicit resolution commits`

### 문제: 원격 GitHub 문서만 보고 로컬 최신 기반 결정을 놓침

- 원인: 원격 `main`의 예전 handoff/recovery 문서를 먼저 기준으로 삼아, 로컬 작업트리에 남아 있던 2026-05-26 기반 결정과 미커밋 문서를 최신 상태로 보지 못했다.
- 영향: 다음 작업을 예전 `docs/vertical-slice/proof.html` 승인 게이트로 잘못 보고해, 실제로는 데이터 스키마와 원작 대응표, 세로 조각 기준으로 넘어가야 하는 흐름을 흐릴 수 있었다.
- 해결 방안: 로컬 변경분과 원격 `main` 커밋을 다시 대조하고, 새 기반 문서를 `e07c3e6 Document new game foundation`으로 GitHub에 푸시했다. 이어서 `AGENTS.md`, `README.md`, 기존 handoff/current-issues/recovery 문서에 새 기반 문서 우선 규칙을 반영했다.
- 재발 방지 기준: GitHub 상태를 묻는 작업이라도 로컬 작업트리에 미커밋 최신 문서가 있는지 먼저 확인하고, 원격 기준과 로컬 기준을 분리해 보고한다. 오래된 handoff 문서와 새 기반 문서가 충돌하면 `docs/development-foundation.md`와 새 세로 조각 기준을 우선한다.
- 해결 커밋: `e07c3e6 Document new game foundation`

### 문제: fixture 검증 스크립트가 manifest key를 id로 오판함

- 원인: `tools/validate-slice-fixture.mjs`에서 일반 콘텐츠 ID 검증 함수를 asset manifest에도 재사용했다. 그러나 manifest 항목은 `id`가 아니라 `key`를 기준으로 한다.
- 영향: manifest에 정상 등록된 에셋 키가 전부 누락된 것으로 보고되어, fixture와 manifest 참조 검증이 실패했다.
- 해결 방안: manifest 전용 `uniqueKeys` 검증 함수를 추가하고, asset manifest는 `assets[].key` 기준으로 검사하도록 수정했다.
- 재발 방지 기준: 콘텐츠 ID와 에셋 키는 둘 다 snake_case라도 의미가 다르므로 검증 함수와 오류 메시지를 분리한다.
- 해결 커밋: `39144e0 Add slice fixture validation base`

### 문제: Phaser 최신 메이저가 기준 스택과 달랐음

- 원인: `npm install phaser`가 현재 최신 메이저인 Phaser 4.x를 설치했다. 그러나 프로젝트 기준 문서는 `Phaser 3 + TypeScript + Vite`로 확정되어 있다.
- 영향: 타입, scene API, loader 동작이 기준 문서와 달라져 초기 골조가 이후 작업 기준을 흔들 수 있었다.
- 해결 방안: 설치 직후 `package.json`을 확인하고 `npm.cmd install phaser@3`로 되돌려 `phaser`를 `^3.90.0` 범위로 고정했다.
- 재발 방지 기준: dependency 설치 후에는 `package.json`의 실제 major version이 기반 문서의 확정 스택과 맞는지 확인한다.
- 해결 커밋: `9c05c2c Add Phaser scaffold runtime`

### 문제: 브라우저 smoke 검증 도구 경로가 현재 환경과 맞지 않음

- 원인: 기존 smoke script는 예전 Codex 런타임의 Playwright 경로를 하드코딩하고 있었고, 현재 PC에는 그 경로의 Playwright 모듈이 없었다.
- 영향: Phaser 앱의 실제 브라우저 렌더링과 console error 검증을 완료할 수 없었다.
- 해결 방안: `playwright`를 dev dependency로 추가하고, 새 Phaser 전용 `tools/phaser-smoke-test.mjs`를 작성해 기본 진입, combat debug entry, boss debug entry를 확인했다.
- 재발 방지 기준: 브라우저 검증 스크립트는 로컬 dependency를 우선 사용하고, 하드코딩된 번들 경로는 fallback으로만 둔다.
- 해결 커밋: `9c05c2c Add Phaser scaffold runtime`
### 문제: `apply_patch` 기준 경로가 저장소 바깥으로 잡혀 simulation 파일이 잘못 생성됨

- 원인: `apply_patch`가 현재 저장소 루트가 아니라 상위 작업 폴더 기준으로 파일을 적용하면서, `src/simulation/...` 파일들이 `C:\Users\i\Documents\New project\src\simulation` 아래에 생성됐다.
- 영향: 저장소 Git 상태에는 들어가지 않았지만, 작업 루트 바깥에 Codex가 만든 불필요한 파일이 생겼다.
- 해결 방안: 사용자에게 대상/포함/제외/위험을 보고하고 승인을 받은 뒤, `C:\Users\i\Documents\New project\src\simulation`만 정확히 확인해 삭제했다. 이후 모든 `apply_patch` 경로를 `sunlight-map-card-crawler/...`로 명시해 저장소 내부에 다시 적용했다.
- 재발 방지 기준: `apply_patch`에 workdir을 줄 수 없는 환경에서는 저장소 하위 경로를 명시한다. 파일이 예상 위치와 다르면 즉시 멈추고 실제 경로를 보고한다.
- 해결 커밋: `b71f7ad Add first combat simulation flow`; 로그 해시 정리는 후속 커밋에서 반영.

### 문제: 장기 boss smoke 중 overlay 갱신 전 다음 키 입력이 들어감

- 원인: 보스전 자동 플레이 smoke가 scene restart 직후 debug overlay가 갱신되기 전에 다음 키를 눌러, 이미 사라진 카드 슬롯을 다시 선택했다.
- 영향: 실제 simulation 검증이 아니라 smoke timing 문제로 `card:missing:5` 로그가 발생하며 `phaser:smoke`가 실패했다.
- 해결 방안: smoke 입력마다 짧은 안정화 대기를 넣고, boss phase trigger는 `bossPhaseTriggered=true` debug overlay 값으로 명시 검증하도록 바꿨다.
- 재발 방지 기준: scene restart를 동반하는 브라우저 smoke는 키 입력 후 overlay 상태 안정화를 기다리고, 장기 루프 검증은 최종 phase뿐 아니라 중간 핵심 상태도 직접 확인한다.
- 해결 커밋: `b71f7ad Add first combat simulation flow`; 로그 해시 정리는 후속 커밋에서 반영.

### 문제: Phaser 화면의 진행 문구가 버튼처럼 보이지만 클릭되지 않음

- 원인: Town, WorldMap, Dungeon, Reward, RuneBench, Result 장면의 진행 안내가 `add.text`로만 렌더링되어 pointer input을 받지 않았다. Combat/Boss 카드와 턴 종료도 키보드 입력에는 연결되어 있었지만 마우스 클릭 경로가 없었다.
- 영향: 인앱 브라우저에서 사용자가 화면에 보이는 버튼/카드를 클릭해도 진행되지 않고, 키보드 조작을 알아야만 흐름을 확인할 수 있었다.
- 해결 방안: 공통 `renderActionButton`을 추가해 진행 UI를 실제 interactive Phaser rectangle로 만들고, card hand와 `End Turn`에도 `pointerdown` action을 연결했다.
- 재발 방지 기준: `tools/phaser-smoke-test.mjs`에 canvas 좌표 기반 click smoke를 추가해 `town -> world_map -> dungeon -> combat`, 첫 카드 사용, 턴 종료까지 마우스 클릭으로 검증한다. 인앱 브라우저에서도 같은 흐름을 직접 클릭해 debug overlay 변화로 확인한다.
- 해결 커밋: `8518d18 Make Phaser controls clickable`

### 문제: 새로고침 후 최소 run 진행 상태를 복원하는 저장 검증선이 없음

- 원인: 기존 `saveCodec`은 초기 `SaveData`만 만들었고, localStorage read/write, debug save 분리, simulation state -> serializable save 변환, reload 복원 경로가 없었다.
- 영향: `LOOP-007`과 `DATA-007`을 검증할 수 없었고, 사용자가 브라우저 새로고침 또는 재진입을 하면 현재 흐름이 실제로 유지되는지 판단할 수 없었다.
- 해결 방안: 일반 save와 debug save를 별도 storage key로 분리하고, `RunState`에 phase, deck/hand/draw/discard, 전투 상태, 보상/룬 상태, 완료 stage, 로그 등 최소 복원 필드를 추가했다. `BootScene`은 저장된 run을 복원하고 `PreloadScene`은 `context.run.phase` 기준으로 장면을 시작한다.
- 재발 방지 기준: `phaser:smoke`에서 mid-combat 저장 복원, completed-stage profile 복원, save JSON에 renderer key가 없는지 확인한다. 인앱 브라우저에서도 reset 없는 재진입 후 debug overlay의 `phase`, `enemyHp`, `playerEnergy`, `savedPhase`를 확인한다.
- 해결 커밋: `f1c5a2f Add save reload verification`

### 문제: 1920/좁은 화면 검증 전까지 UI 겹침을 놓칠 수 있음

- 원인: 기존 smoke는 canvas가 뜨는지와 전투 흐름을 주로 확인했고, 1920 full-page screenshot, debug overlay 위치, 장면별 손패 노출 여부를 별도로 검증하지 않았다. `renderSceneShell`도 모든 장면에 손패를 렌더링해 Town/Reward/Rune/Dungeon의 버튼과 정보가 카드에 겹칠 수 있었다.
- 영향: 자동 테스트가 통과해도 사용자가 보는 화면에서는 debug overlay가 enemy intent panel을 가리거나, 비전투 장면의 진행 버튼과 카드가 겹치는 상태가 남을 수 있었다. Boss 화면에서는 보스 phase 문구가 enemy panel 뒤에 묻혀 boss-specific signal이 약해질 수 있었다.
- 해결 방안: `phaser:smoke`에 1920x1080 full-page screenshot 검증을 추가하고, Combat/Boss는 손패 5장, 기대 debug state, overlay와 hand/enemy intent critical area 간 겹침 여부를 좌표로 검사한다. 1280/1080 overlay screenshot과 geometry 검사도 추가했다. 장면 shell에는 `showHand` 옵션을 추가해 손패를 Combat/Boss에만 표시하고, debug overlay 폭/overflow/compact media query, Combat/Boss panel과 End Turn 위치, Boss phase 표시 위치를 조정했다.
- 재발 방지 기준: 화면 관련 체크리스트를 `Verified`로 바꿀 때는 DOM/state assertion만이 아니라 screenshot 또는 geometry 근거를 남긴다. debug overlay는 테스트 도구라도 전투 손패와 enemy intent panel을 가리지 않아야 한다.
- 해결 커밋: `1921c9e Add Phaser view verification`

### 문제: 카드 설명과 effect op가 서로 어긋나도 자동으로 막지 못함

- 원인: slice fixture에는 카드 설명과 `effects`가 함께 있었지만, 설명 문구가 실제 op/amount/runtime 처리와 맞는지 검사하는 별도 감사가 없었다. 특히 `card_lamplight_mark`는 데이터에 `apply_mark`가 있었지만 Phaser slice simulation에서 처리되지 않았고, 일부 카드에는 이미 구현된 효과에도 `후보` 문구가 남아 있었다.
- 영향: 사용자가 보는 카드 설명과 실제 전투 결과가 달라질 수 있고, 구현되지 않은 제한 조건이나 후보 문구를 실제 기능처럼 오해할 수 있었다.
- 해결 방안: `tools/audit-slice-effects.mjs`를 추가해 docs/runtime fixture의 카드 설명/effect drift, `후보` 잔존, effect op별 한글 설명 단서/수치, Phaser runtime 처리 여부를 검사한다. `package.json`의 `check`에도 `slice:effects`를 연결했다. `apply_mark`는 `enemyMark` 상태로 구현하고, 다음 피해 보너스로 소비되도록 했다.
- 재발 방지 기준: 새 카드 effect op를 추가할 때는 fixture 설명, runtime simulation 처리, `slice:effects` 규칙, smoke test 필요 여부를 함께 갱신한다. 설명에 적힌 기능이 현재 slice에서 구현되지 않았으면 후보나 조건을 남기지 않는다.
- 해결 커밋: `fd49a77 Add slice effect audit`

### 문제: 방의 `encounterPoolId`가 직접 enemy/event/boss id를 참조해 확장성이 막힘

- 원인: 첫 세로 조각에서는 route room의 `encounterPoolId`가 `enemy_folded_sentry`, `event_rune_bench`, `boss_curtain_lion`처럼 실제 콘텐츠 id를 직접 가리켰다. 이 구조는 이름은 pool이지만 실제로는 단일 직접 참조라서 여러 적 후보, 가중치, 방 타입별 검증을 붙이기 어려웠다.
- 영향: 이후 콘텐츠를 늘릴 때 방마다 enemy id를 직접 바꾸는 방식으로 흐르기 쉬워지고, combat/event/boss 참조 도메인이 섞여도 검증하기 어렵다.
- 해결 방안: explicit `encounterPools[]` 데이터를 추가하고 route `encounterPoolId`가 pool id를 참조하게 바꿨다. pool entries는 실제 enemy/event/boss content id와 weight를 갖고, runtime은 pool entry를 통해 전투 대상을 선택한다. validator는 pool 타입, entries, weight, 방 타입 일치, boss pool의 stage boss 포함 여부를 검사한다.
- 재발 방지 기준: 새 방이나 encounter pool을 추가할 때 직접 enemy/event/boss id를 route에 넣지 않는다. route는 pool id만 참조하고, 실제 후보는 `encounterPools[].entries`에 둔다.
- 해결 커밋: `7420a77 Add explicit encounter pools`

### 문제: 공식 패치 라벨과 설치 빌드 ID를 섞어 원작 기준선을 과대확정할 수 있음

- 원인: 기존 연구에는 공식 Steam 공지의 `Hotfix 1.4.1` 라벨과 SteamDB의 build `23012943` 후보가 함께 있었지만, 설치된 게임의 app manifest, 인게임 버전 표시, 게임 파일 증거가 아직 없었다. 이 상태에서 build 후보를 공식 패치 확정처럼 다루면 이후 원작 대응 작업이 잘못된 기준 위에 쌓일 수 있었다.
- 영향: `Hotfix 1.4.1`을 현재 설치 빌드로 단정하거나, SteamDB build `23012943`을 공식 패치 증거로 오해할 수 있었다. 그러면 카드/젬/세이브/밸런스 값 비교가 실제 기준 빌드와 어긋날 수 있다.
- 해결 방안: `docs/source-version-baseline.md`를 추가해 공식 Steam Store/Steam News API, 기존 Store/media crawl, 기존 SteamDB crawl의 역할과 한계를 분리했다. 2026-05-26 공식 Steam News API 재조회 기준 최신 공식 공지는 2026-04-29 `1 million Crawlers in 1 week`이고, 그 안의 최신 패치 라벨은 `Hotfix 1.4.1`로 기록했다. 동시에 직접 설치 빌드 ID와 인게임 버전 라벨은 `Needs verification`으로 남겼다.
- 재발 방지 기준: 원작 유사도, 정확한 런타임 값, 빌드별 동작을 말하려면 먼저 local Steam `appmanifest_3265700.acf`, 인게임 버전 표시, 게임 파일 또는 fresh direct capture를 확보한다. SteamDB는 보조 build ordering 후보로만 쓰고 공식 패치 증거로 쓰지 않는다.
- 해결 커밋: `b1349c3 Add source version baseline`

### 문제: 로컬에서 직접 설치 빌드 증거를 확보할 수 없음

- 원인: 현재 PC에서 Steam 설치 루트, Steam registry key, `appmanifest_3265700.acf`, app `3265700` 설치 폴더가 발견되지 않았다. 세션에서 보이는 파일 시스템 드라이브도 `C:`뿐이라 다른 Steam library 위치를 확인할 수 없었다.
- 영향: `Hotfix 1.4.1` 공식 라벨과 SteamDB build 후보를 직접 설치 빌드 ID로 연결할 수 없고, fresh installed-build screenshot이나 인게임 버전 라벨도 확보할 수 없다.
- 해결 방안: common Windows Steam roots, Steam registry paths, 사용자 프로필 내 appmanifest 검색, fixed drive의 Steam/SteamLibrary 후보 경로를 비파괴적으로 확인했다. 결과를 `docs/source-version-baseline.md`, `docs/development-foundation.md`, `docs/vertical-slice-smoke-checklist.md`에 `Blocked locally`로 남겼다.
- 재발 방지 기준: Steam library 접근이 없는 상태에서는 직접 빌드 증거를 완료로 말하지 않는다. 사용자가 Steam 설치본, `appmanifest_3265700.acf`, 설치 게임 폴더 또는 fresh direct capture를 제공한 뒤에만 build id, 인게임 버전 라벨, screenshot 기준선을 `Verified`로 올린다.
- 해결 커밋: `6ed8ae8 Document blocked local build proof`

### 문제: planned asset manifest와 실제 runtime 파일이 갈라져도 잡는 검증선이 없음

- 원인: 첫 세로 조각 manifest는 planned key/path를 갖고 있었지만, `docs/asset-manifest.slice.v1.json`과 `src/data/assetManifest.slice.v1.json`의 drift, 실제 `assets/runtime` PNG 크기, orphan 파일, strict 파일 존재 조건을 검사하는 별도 도구가 없었다.
- 영향: 에셋 파이프라인이 시작된 뒤 key/path가 틀리거나 PNG 크기가 manifest와 달라도 placeholder scaffold가 계속 돌아가서 문제를 늦게 발견할 수 있었다. 반대로 아직 파일이 없는 planned 상태를 에셋 실패 또는 완료로 잘못 말할 위험도 있었다.
- 해결 방안: `tools/audit-asset-files.mjs`를 추가해 docs/runtime manifest 동기화, key/path 중복, runtime path 규칙, 실제 PNG `nativeSize`, spritesheet `frameSize`, orphan runtime image를 검사한다. 기본 `assets:audit`는 `planned_manifest` missing을 warning으로 보고하고, `assets:audit:strict`는 에셋 생성 이후 파일 누락을 실패로 잡는다.
- 재발 방지 기준: 실제 runtime asset 파일을 생성하거나 교체할 때는 `npm.cmd run assets:audit:strict`를 통과시킨다. `planned_manifest`에서 missing warning이 난 상태를 에셋 완료로 말하지 않는다.
- 해결 커밋: `a1636df Add asset file audit guard`

### 문제: Steam 직접 증거가 계속 활성 다음 작업처럼 보일 수 있음

- 원인: local Steam/appmanifest 탐색이 막힌 뒤에도 `docs/vertical-slice-smoke-checklist.md`의 `Next Work` 첫 항목이 Steam library 제공/설치였고, `docs/source-version-baseline.md`도 직접 증거를 `still needed`처럼 표현했다. 사용자는 현재 Steam이 없다고 보는 전제를 명확히 했다.
- 영향: 실제 개발은 진행 가능한데도 Codex가 다음 작업마다 Steam 확인을 반복하거나, Steam 없음이 전체 개발 blocker처럼 오해될 수 있었다.
- 해결 방안: `docs/source-version-baseline.md`에 2026-05-27 no-local-Steam working assumption을 추가하고, direct proof를 deferred로 낮췄다. `docs/development-foundation.md`와 `docs/vertical-slice-smoke-checklist.md`에서도 Steam 직접 증거를 active next work에서 제외하고, exact build/runtime claims가 필요하거나 사용자가 접근을 제공할 때만 재개하도록 했다.
- 재발 방지 기준: Steam/appmanifest 접근이 없는 동안에는 공식 공개 자료, 보존된 조사, 역할 대응표, 자체 검증선을 기준으로 개발을 계속한다. Steam proof는 원작 유사도, 정확한 현행 빌드값, 빌드별 동작을 주장할 때만 다시 연다.
- 해결 커밋: `ec1ae3c Defer Steam direct proof path`

### 문제: asset manifest는 있어도 Phaser가 실제 runtime 파일을 로드하지 않음

- 원인: 이전 단계에서는 manifest key/path 검증선만 있었고, 실제 `public/assets/runtime` 파일이 없었다. `PreloadScene`도 manifest path를 Phaser loader에 넣지 않고 scene 안에서 placeholder texture를 즉석 생성했다.
- 영향: strict 파일 검증이 실제로 닫히지 않았고, 나중에 에셋 파일을 바꿔도 브라우저 preload 실패, 크기 불일치, orphan 파일, spritesheet frame 오류를 빠르게 잡기 어려웠다. 또한 placeholder가 최종 아트처럼 오해될 위험이 있었다.
- 해결 방안: `tools/generate-dev-runtime-assets.mjs`를 추가해 manifest 35개 항목의 개발용 PNG를 `public/assets/runtime`에 생성했다. manifest status를 `generated_manifest`로 바꾸고, `PreloadScene`은 manifest path를 Phaser image/spritesheet loader에 queue하도록 변경했다. `assets:audit:strict`는 파일 35개, 누락 0개, orphan 0개를 검증하고, `phaser:smoke`는 첫 페이지에서 35개 runtime asset URL이 로드되는지 확인한다.
- 재발 방지 기준: 개발용 placeholder pack은 최종 아트가 아니다. 새 runtime asset을 추가하거나 교체할 때는 generator 또는 실제 asset export 후 `npm.cmd run assets:audit:strict`와 `npm.cmd run phaser:smoke`를 통과시킨다.
- 해결 커밋: `2168556 Generate dev runtime asset pack`

### 문제: 첫 에셋 교체 루프가 작은 검증 단위로 아직 닫히지 않음

- 원인: 35개 runtime placeholder pack은 strict preload 기반을 만들었지만, 실제 교체 작업을 어떤 단위로 제한하고 범위 이탈을 어떻게 잡을지 아직 한 번도 검증하지 않았다.
- 영향: 이후 아트 그룹을 바꿀 때 의도하지 않은 PNG가 함께 바뀌거나, candidate art를 승인/최종 아트처럼 착각할 위험이 있었다.
- 해결 방안: 첫 교체 단위를 카드 프레임 3종과 카드 타입 아이콘 3종으로 제한하고, generator에 exact key 기반 전용 paint branch를 추가했다. 작업 중 넓은 attack 조건 때문에 `icon_intent_attack`이 같이 바뀌는 것을 `git status`로 발견했고, exact key 조건으로 좁힌 뒤 재생성했다.
- 재발 방지 기준: 에셋 그룹을 교체할 때는 `git diff --name-only`로 변경 파일이 목표 그룹에만 남았는지 확인하고, `npm.cmd run assets:audit:strict`, `npm.cmd run check`, `npm.cmd run phaser:smoke`, `git diff --check`를 통과시킨다. candidate/development asset은 approved final art로 말하지 않는다.
- 해결 커밋: `dce1754 Add card UI candidate assets`

### 문제: 카드 에셋이 preload만 되고 실제 손패 렌더링에는 쓰이지 않음

- 원인: Phaser `PreloadScene`은 manifest의 card frame/art/icon texture를 로드했지만, `renderCardHand`는 rectangle과 text만 직접 그렸다.
- 영향: card art PNG를 교체해도 전투/보스 화면에서 사용자가 변화를 확인할 수 없고, 에셋 파이프라인이 실제 UI 표면까지 닫혔다고 말할 수 없었다.
- 해결 방안: 첫 손패 카드 일러스트 5종에 exact key candidate art branch를 추가하고, `renderCardHand`가 `assetKeys.frame`, `assetKeys.illustration`, `assetKeys.typeIcon` texture를 그리도록 연결했다. 기존 클릭 동작은 card 전체 invisible hit target으로 유지했다.
- 재발 방지 기준: runtime asset을 교체할 때는 preload/audit뿐 아니라 실제 사용하는 화면 또는 smoke screenshot에서 texture가 렌더링되는지 확인한다. 후보 아트가 화면에 보이더라도 approved final art로 말하지 않는다.
- 해결 커밋: `a9f6ef3 Render card candidate art in hand`

### 문제: 카드 일러스트 후보 패스가 첫 손패 5장까지만 닫혀 있음

- 원인: 이전 단계에서 실제 손패 렌더링 연결과 첫 5개 카드 일러스트 후보는 검증했지만, reward/확장 카드 5종은 아직 generic placeholder 패턴에 남아 있었다.
- 영향: 같은 카드 그룹 안에서도 일부는 후보 모티프가 있고 일부는 generic placeholder라, 카드 아트 파이프라인의 첫 candidate pass가 완전히 닫혔다고 말할 수 없었다.
- 해결 방안: 남은 5개 card art exact key를 generator candidate set에 추가하고, 각 카드 기능에 맞는 단순 모티프를 생성했다. `grantCard` debug URL로 3개 화면을 캡처해 stage/ink, bloom/pinpoint, curtain 카드가 실제 손패 texture path에서 렌더링되는 것을 확인했다.
- 재발 방지 기준: 에셋 그룹 완료를 말할 때는 그룹 전체 파일 목록과 실제 화면 렌더링 증거를 함께 확인한다. 이 기준은 candidate pass에만 적용되며, approved final art 완료와는 별도로 기록한다.
- 해결 커밋: `4f1a91c Add remaining card candidate art`

### Problem: Intent icon assets existed but the combat panel only rendered intent text

- Cause: The slice data already had `assetKeys.intentIcons[]` and the manifest had intent icon PNG entries, but the runtime asset generator still treated those files as generic icon placeholders. The Combat/Boss panel also read `getActiveIntent()` for text only, so replacing intent PNGs would not prove that the game screen actually used them.
- Impact: Enemy telegraphs could look like plain text even after icon assets were generated, and attack/disrupt/block intent art could silently drift from the active intent index.
- Resolution: Added exact-key deterministic candidate art for `icon_intent_attack`, `icon_intent_disrupt`, and `icon_intent_block`. Updated `renderCombatPanel` to resolve the active icon from `assetKeys.intentIcons[]` with `combat.intentIndex`, render the texture beside the intent text, and preserve a text fallback if the texture is missing. The shared panel path covers both Combat and Boss scenes.
- Prevention: Intent asset replacement should be verified in the real scene, not just by manifest preload. For multi-intent enemies or bosses, check at least one later turn so non-first icon slots are proven.
- Resolution commit: `49d5575 Render intent candidate icons`

### Problem: Background assets existed but shared Phaser scenes still used a flat color

- Cause: Stage and event data referenced `assetKeys.backgroundSet` and event `assetKeys.scene`, and Phaser preloaded those files, but `renderSceneShell` still drew a full-screen solid rectangle. The Rune Bench scene also had no renderer path that preferred its event scene asset over the generic stage backdrop.
- Impact: Replacing background PNGs would not be visible in the actual game screens, and event-specific visual identity could silently remain unused.
- Resolution: Added exact-key deterministic candidate backgrounds for `bg_lantern_foyer_set` and `scene_rune_bench`. Updated the shared scene shell to render the stage background texture behind UI with a readability wash. Updated Rune Bench to resolve its event scene background from the event encounter pool, falling back to the stage route's event room when debug entry keeps the run on room index 0.
- Prevention: Background asset replacement must be verified in screenshots from scenes that actually use those backgrounds. Scene-specific backgrounds need a data path from room/event data, not just manifest preload.
- Resolution commit: `2b156ef Render background candidate assets`

### Problem: Regular enemy sprite assets existed but CombatScene did not render them

- Cause: Enemy data already referenced `assetKeys.sprite`, and the manifest loaded regular monster spritesheets, but CombatScene only displayed text, HP, block, mark, and intent. The generated monster files were still generic placeholder sheets and had no screen-level proof.
- Impact: Sprite pipeline work could appear complete through preload/audit alone while the actual combat UI still ignored enemy sprite data.
- Resolution: Added deterministic transparent spritesheet placeholders for `monster_folded_sentry` and `monster_ink_mote`. Updated CombatScene to render a regular-enemy portrait from `enemy.assetKeys.sprite` when `combat.enemyKind === "enemy"`, intentionally leaving boss sprite rendering for a separate pass.
- Prevention: Sprite placeholder work must include both manifest/file verification and a scene screenshot using the relevant enemy id. Regular enemy and boss sprite paths should be tracked separately so the smaller pass does not silently imply boss art completion.
- Resolution commit: `33b0837 Render enemy sprite placeholders`

### Problem: Boss sprite assets existed but BossScene did not render the boss texture

- Cause: The boss data and manifest referenced `boss_curtain_lion`, and Phaser preloaded the boss spritesheet, but the shared combat panel only rendered regular enemy portraits after the previous pass. BossScene still showed the boss mostly as text and intent state.
- Impact: Boss sprite pipeline work could appear complete through preload/audit alone while the actual boss combat screen ignored `boss.assetKeys.sprite`.
- Resolution: Added a deterministic transparent spritesheet placeholder for `boss_curtain_lion`. Updated the shared combat panel portrait renderer to support both regular enemies and bosses from `assetKeys.sprite`, with a larger boss display size. Screenshot review also moved the Boss End Turn button to the safer Combat button position.
- Prevention: Boss sprite passes must include an actual BossScene screenshot, not only a generated spritesheet or manifest audit. Regular enemy and boss rendering can share code, but completion should still be recorded separately.
- Resolution commit: `a98ec51 Render boss sprite placeholder`

### Problem: Progression icon assets were validated but not visible in player-facing scenes

- Cause: The data and manifest referenced stage map, rune, relic, and character portrait asset keys, but the Phaser scenes mostly rendered those surfaces as text-only state. Strict asset audit could pass while those visual keys were not meaningfully exercised in screenshots.
- Impact: The foundation could claim an asset path was connected because preload and manifest checks passed, even though Reward, Rune Bench, Result, and the common scene shell did not prove those icons or portrait assets in context.
- Resolution: Added deterministic candidate art for the stage map icon, rune icons, first relic icon, and first character portrait. Updated shared scene shells, Reward, Rune Bench, and Result to render those assets through `assetKeys`, and added a relic debug summary plus a Result smoke screenshot case for a debug-granted relic.
- Prevention: Future asset surface passes should identify whether a key is only preloaded or also visible in a representative scene. Smoke should include at least one debug state for assets that do not appear in the default loop.
- Resolution commit: `6ea9679 Render progression icon candidates`

### Problem: Effect spritesheets existed but combat feedback did not use them

- Cause: The manifest preloaded `effect_paper_slash`, `effect_ink_splash`, and `effect_stage_spotlight`, and boss phase data referenced `visualCueKey`, but Combat and Boss scenes did not choose or render any effect spritesheet from combat state.
- Impact: Card actions and boss phase changes could be mechanically verified while still feeling visually inert, and asset audit could pass without proving the effect assets in a gameplay screenshot.
- Resolution: Added deterministic transparent spritesheet candidates for the three effect assets. Added a combat feedback selector based on recent combat log state, rendered the selected spritesheet frame in Combat/Boss scenes, exposed `effect=` in the debug overlay, and extended smoke coverage with paper-slash, ink-splash, and stage-spotlight screenshots.
- Prevention: Future effect work should keep simulation state serializable and derive renderer feedback from explicit state/log boundaries. Any new effect key should include an automated debug state or screenshot that proves it renders in context.
- Resolution commit: `a0a15e1 Render combat effect feedback`

### Problem: Character spritesheet assets existed but player combat scenes did not render them

- Cause: The starter character data referenced `assetKeys.sprite`, and the manifest loaded `char_mina_pagehand_sprite`, but the Phaser scene shell only rendered the character portrait. The spritesheet file also used the generic generated placeholder branch rather than a scoped character sprite candidate.
- Impact: The character sprite path could pass manifest, preload, and strict asset audits while the player-side combat presentation still ignored the character spritesheet.
- Resolution: Added an exact-key deterministic transparent spritesheet candidate for `char_mina_pagehand_sprite`. Updated the shared Phaser scene shell to render the active character sprite as a player-side standee in Combat and Boss screens. Added `characterSprite=` to the debug overlay and smoke screenshots for the character sprite path.
- Prevention: Character sprite work should include a screen-level debug state and screenshot from at least one real combat scene. Portrait completion must not be treated as character spritesheet completion.

### Problem: UI panel asset existed but core Phaser panels still used flat rectangles

- Cause: The manifest included `ui_panel_paper_9slice`, but shared status panels and Combat/Boss enemy panels were still drawn as plain Phaser rectangles with stroke colors. The generated file also used the generic placeholder branch rather than a scoped paper-panel candidate.
- Impact: UI asset audits could pass while the visible game interface still looked like flat debug panels, and the 9-slice path could remain unproven.
- Resolution: Added an exact-key deterministic candidate for `ui_panel_paper_9slice`. Added a shared `renderPaperPanel` helper that uses Phaser `nineslice` when the texture exists, with a rectangle fallback. Routed the shared scene status panel and Combat/Boss enemy panel through that helper, exposed `uiPanel=` in the debug overlay, and added smoke screenshots for the UI panel path.
- Prevention: Reusable UI skin work should prove both texture generation and at least one real scene usage. Button skinning and state-specific UI assets should be tracked separately from the base panel pass.

### Problem: Full catalog rows existed but Phaser still loaded only the slice fixture

- Cause: `loadGameData()` imported only `fixtures/vertical-slice.v1.json`, so the browser game could pass all slice smoke checks while the 113-card/16-relic/15-stage catalog never entered the Phaser runtime.
- Impact: Missing release content could be hidden behind a working slice. Counts in `src/data/ko` did not prove cards, relics, enemies, stages, or events were playable in the actual game.
- Resolution: Added `?data=release` through `RuntimeFlags`, `loadGameData(mode)`, and `src/data/releaseCatalogAdapter.ts`. The adapter maps full local cards, gems-as-runes, relics, arcanas, characters, enemies, bosses, stages, events, encounter pools, and reward pools into the current runtime schema without replacing the default slice mode. Combat effect handling now covers the first wave of full-data ops needed for the first release hand, including `damage_front`, `damage_all`, `damage_random`, `gain_shield`, `draw`, chain/card-count bonus damage, marked-target bonus damage, `gain_energy`, and next-attack reduction bridges.
- Prevention: `phaser:smoke` now includes a release catalog case that verifies `dataMode=release`, `cards=113`, `runesTotal=58`, `relicsTotal=16`, `stagesTotal=15`, `validation=ok`, the first release enemy/hand, and `card_sunbean_punch` reducing `enemy_cloud_buddy` from 22 HP to 14 HP. This is connectivity proof only; release readiness still requires the release checklist gates to move from `Not done` through implementation and verification.

### Problem: The full card set had visible family x template repetition

- Cause: The generated full card data used 12 families multiplied by 8 repeated template suffixes and effect structures. This produced repeated shapes such as 12x `damage_front + damage_bonus_if_chain_at_least`, 12x `gain_shield + reduce_next_attack`, and repeated id suffixes such as `*_tap`, `*_wave`, `*_pad`, `*_sparkle`, and `*_snack`.
- Impact: The game could report 113 cards while still feeling like a small set stretched by templates. This directly violated the release-readiness rule that counts are not completion proof.
- Resolution: Added `tools/curate-card-release-batch.mjs` and `tools/card-release-audit.mjs`. The first curation batch retired 32 template ids across morning/cloud/mint/peach, replaced them with distinct card ids, names, Korean rules text, effect structures, and illustration briefs, and updated references in characters, events, achievements, and smoke tests. Phaser release card handling was extended for full-data ops including random hit count, hand-size bonus, kill draw, battle rules, reflect, repeat, energy loss, cost increase, chain reset, and exhaust.
- Prevention: `cards:release:audit` now fails if visible card effect structures or id suffixes repeat at 10 or more, if retired first-batch template ids reappear, or if card ops fall outside the release runtime handling list. `quality:audit:report` no longer reports the previous card repetition blockers, but card release readiness remains `Not done` until the remaining card families, upgrades/evolutions, art, and balance are verified.

### Problem: The full gem set had visible single-effect template repetition

- Cause: The generated full gem data repeated edge, guard, spark, and echo rows as single-effect family variants. `content-quality-audit` treated those as repeated release-blocking effect shapes even when numeric values differed.
- Impact: The game could report 58 gems while still behaving like a small socket-modifier set stretched by templates. The release catalog also adapted gems as Phaser runes, but Phaser only handled the older flat slice rune modifiers before this pass.
- Resolution: Added `tools/curate-gem-release-batch.mjs` and `tools/gem-release-audit.mjs`. The first curation batch keeps stable gem ids but gives 20 morning/cloud/mint/peach/lavender edge/guard/spark/echo gems distinct names, Korean rules text, and multi-effect structures. Phaser rune handling now supports release gem damage percent, shield percent, cost modification, heal-on-play, mark-on-play, bridge discount, preserve-chain logging, and basic echo behavior. Runtime smoke verifies a curated gem damage modifier plus preserve-chain behavior, and Phaser smoke verifies `gem_morning_edge` equipped as a release rune changes `card_sunbean_punch` damage in `?data=release`.
- Prevention: `gems:release:audit` now fails if any gem effect shape repeats at 10 or more, if the curated batch is missing or still single-effect, if curated batch shapes are not distinct, or if gem ops fall outside the supported release gem op list. `quality:audit:report` no longer reports the previous gem repetition blocker, but gem/rune release readiness remains `Not done` until remaining families, UI/icon polish, acquisition pacing, and balance are verified.

### Problem: The full enemy set had visible intent-template repetition

- Cause: The generated enemy data repeated four intent templates across 15 normal buddy rows, 15 normal trick rows, 15 elite rows, and 15 boss rows. The release adapter also collapsed debuff and special intents into a generic next-card-cost penalty, so several distinct source intents were not mechanically distinct in Phaser.
- Impact: The game could report 60 enemies while still feeling like four enemy patterns stretched across families. This violated the release-readiness rule that counts are not completion proof, and it also left release enemy behavior under-adapted in the Phaser path.
- Resolution: Added `tools/curate-enemy-release-batch.mjs` and `tools/enemy-release-audit.mjs`. The first curation batch keeps stable ids while converting 32 early normal/trick/elite/boss rows into distinct intent structures with family-facing labels and supported special/debuff fields. The release adapter now maps debuffs and special intents into explicit effects, and Phaser combat handles player mark, player weak, temp-card discard, enemy heal, piercing damage, chain reduction, and summon logging.
- Prevention: `enemies:release:audit` now fails if any enemy intent shape repeats at 8 or more, if the curated batch is missing or too shallow, if batch shape variety falls below 20, or if unsupported intent types/statuses/special effects appear. `quality:audit:report` no longer reports the previous enemy intent-pattern blocker, but enemy release readiness remains `Not done` until remaining identities, final art, reward/scaling balance, and boss completion are verified.

### Problem: The full stage set reused a few route templates

- Cause: The generated stage data repeated the same room-order patterns across several stage groups. Six stages shared one 10-room pattern, five stages shared one 7-room pattern, and three stages shared one 9-room pattern.
- Impact: The game could report 15 stages while still feeling like a small set of route templates stretched across names. The release adapter could load those stages, but the route pacing was not distinct enough to treat stage content as release-ready.
- Resolution: Added `tools/curate-stage-release-batch.mjs` and `tools/stage-release-audit.mjs`. The first route batch keeps stable stage ids while assigning all 15 stages distinct room patterns, preserving event rooms, elite rooms, and final boss rooms. The debug overlay now exposes the active stage route, and Phaser smoke verifies `stage_rainbow_keep` in `?data=release`.
- Prevention: `stages:release:audit` now fails if repeated room patterns appear 3 or more times, if fewer than 12 unique route patterns exist, if routes are too short, if required event/elite/final boss coverage is missing, or if invalid room types appear. `quality:audit:report` no longer reports the previous stage room-pattern blocker, but stage release readiness remains `Not done` until background identity, stage-specific mechanics, boss/reward balance, and unlock flow are verified.

### Problem: The full event set reused the same three-choice pattern

- Cause: The generated event data used 10 events with exactly three choices each, repeated generic labels, and repeated cost/reward shapes such as gold-for-card, gold-for-relic, free combat/gold, and free heal/socket.
- Impact: The game could report 10 events while still feeling like a small event template stretched across different names. The release adapter could load events, but the event rows did not yet prove varied choice pressure, reward identity, or runtime visibility.
- Resolution: Added `tools/curate-event-release-batch.mjs` and `tools/event-release-audit.mjs`. The first event batch keeps stable ids while curating all 10 events into varied 3- and 4-choice structures, distinct labels/story text, mixed gold/hp/free costs, and card/gem/relic/arcana/heal/gold/combat/socket/upgrade outcomes. The release adapter now maps hp costs and rotates event pools by stage, the debug overlay exposes event id, choice count, cost profile, and reward profile, and Phaser smoke verifies `event_bubble_shop` in `?data=release`.
- Prevention: `events:release:audit` now fails if all events have the same choice count, if total choices fall below 34, if event choice-shape profiles repeat, if generic labels repeat too often, if role/risk spread falls short, or if events lack a no-upfront-cost option. `quality:audit:report` no longer reports the previous event choice-shape blockers, but event release readiness remains `Not done` until dedicated EventScene, invalid-state handling, repeat rules, persistence, event art, and full choice execution are verified.

### Problem: The achievement set was dominated by milestone and filler triggers

- Cause: The generated achievement data included 31 `ach_picnic_goal_*` rows with generic `소풍 목표 N` names and repeated `clear_rooms_in_stage` triggers. Combined with generated enemy-count, character-unlock, stage-clear, and boss-defeat rows, the quality audit counted 115 of 161 achievements as milestone-like bulk triggers.
- Impact: The game could report 161 achievements while still presenting a shallow checklist instead of meaningful goals. Worse, reward unlocks such as cards, gems, relics, arcanas, characters, and meta upgrades could look numerous without being tied to distinctive player behavior.
- Resolution: Added `tools/curate-achievement-release-batch.mjs` and `tools/achievement-release-audit.mjs`. The first achievement batch keeps stable ids while converting all 31 `ach_picnic_goal_*` rows into card/gem/relic/arcana collection goals and chain mastery goals with thematic Korean copy and seven reward kinds, including `unlockRelicId` which was previously absent from reward-shape coverage. Runtime smoke now directly verifies curated achievement triggers and reward application paths.
- Prevention: `achievements:release:audit` now fails if milestone-like triggers still dominate, if `clear_rooms_in_stage` filler remains, if generic picnic copy remains, if curated batch trigger/reward variety falls short, if exact trigger shapes repeat too much, or if collection thresholds exceed catalog caps. `quality:audit:report` no longer reports the previous achievement bulk-trigger blocker, but achievement release readiness remains `Not done` until full thematic review, UI goal surfacing, reward pacing, and long-run profile balance are verified.

### Problem: The enemy quality audit still treated the full enemy set as generated coverage

- Cause: After enemy intent batch 1, the remaining 28 enemy rows still used repeated generated labels and shallow two-intent structures, and the quality audit kept an unconditional enemy generated-coverage blocker. Several boss phase rules also still carried generic `친구 부르기` labels.
- Impact: The game could report 60 enemies while still hiding late-family template rows behind the first curated batch. Removing the blocker without content work would have weakened the protective gate and repeated the count-as-completion mistake.
- Resolution: Added `tools/curate-enemy-release-batch-2.mjs` and `tools/enemy-release-quality.mjs`. Batch 2 keeps stable ids while curating the remaining prism/moon/peach/toy/leaf/star/cookie normal, trick, elite, and late boss rows, plus relabeling the early boss phase sets. `tools/enemy-release-audit.mjs` and `tools/content-quality-audit.mjs` now share the same stricter criteria instead of using an unconditional blocker.
- Prevention: `enemies:release:audit` now fails if the 60-id release coverage is incomplete, intent shapes repeat at 8 or more, any enemy has fewer than 3 intents, generic generated labels remain, supported special/debuff coverage falls short, boss phase coverage is incomplete, or unsupported effects/statuses appear. `quality:audit:report` no longer reports enemy generated coverage, but enemy release readiness remains `Not done` until art, reward/scaling balance, encounter pacing, and manual readability review are verified.

### Problem: Release mode reused a tiny slice asset set across the full catalog

- Cause: The release adapter loaded the full local catalog, but its visual keys reused a small slice asset set: 10 card illustrations modulo across 113 cards, 3 rune icons across 58 gems, one relic icon for relics/arcanas, one character portrait/sprite for 23 characters, one stage background/map icon across 15 stages, two regular enemy sprites across 45 enemies, one boss sprite across 15 bosses, and one event scene across 10 events.
- Impact: The game could pass release data and smoke checks while visually looking like a stretched test slice. That directly risked the count-as-completion mistake the release checklist is meant to prevent.
- Resolution: Added `tools/generate-release-visual-assets.mjs`, `tools/visual-production-quality.mjs`, and `tools/visual-production-audit.mjs`. The release adapter now imports `assetManifest.release.v1.json` and maps each full-catalog card, gem, relic, arcana, character, stage, enemy, boss, and event to its own release candidate key. The generator writes 358 manifest-backed PNGs under `public/assets/runtime/release`, and the visual audit verifies exact expected coverage, production metadata, file existence, and PNG dimensions.
- Prevention: `quality:audit:report` now delegates visual judgment to the release visual production audit instead of old CSS/DOM placeholder heuristics. `assets:audit` now unions slice and release manifests so generated release files cannot be silently orphaned. Release visual coverage can remove the automated visual blocker, but final approval, readability, animation polish, originality/licensing review, and full UI skinning remain separate release gates.

### Problem: Event rooms were not actual event gameplay screens

- Cause: Phaser routed event rooms directly to `RuneBenchScene`, so release event data could be audited and exposed in debug output while the player never saw a dedicated event choice screen or paid/applied choices in the Phaser flow.
- Impact: The event gate could look healthier than it was. Event choice counts and profiles were visible, but costs, rewards, event combat, and event scene art were not proven as player-facing gameplay.
- Resolution: Added the `event` phase, `EventScene`, and `src/simulation/systems/events/eventSystem.ts`. Event choices now pay HP/gold costs, grant run-state rewards, route rune rewards to the rune bench, start event combat when a choice has `eventCombatEnemyId`, and persist `lastEventChoiceId` plus player gold. `phaser:smoke` now verifies both slice and release event execution paths and captures an EventScene screenshot.
- Prevention: Future event work must prove screen rendering and state mutation together. Debug-only event metadata is not enough to move an event gate; smoke should verify at least one paid choice, one reward grant, and one branch transition.

### Problem: Release relics and arcanas could be acquired without proving gameplay effects

- Cause: Release mode exposed relic and arcana rows, and EventScene could grant them, but Phaser combat/reward systems did not yet apply most passive item effects. This made item counts and acquisition look healthier than the actual game behavior.
- Impact: A player could receive a relic or arcana and see no meaningful change, repeating the exact count-as-completion risk called out in the release checklist.
- Resolution: Added `src/simulation/systems/passives/passiveSystem.ts` and wired it into combat start, card play, combat victory, reward offer count, and currency reward grants. Added `grantArcana` plus deterministic debug HP overrides for smoke. `phaser:smoke` verifies batch-1 relic effects for start block/energy, after-combat heal, reward options, and gold rewards, plus arcana effects for zero-cost gold and defense-card damage.
- Prevention: Future relic/arcana work must pair every supported passive op with a state-changing smoke or audit check. Acquisition alone is not enough evidence for a release item gate.

### Problem: Several passive rows needed runtime state that did not exist yet

- Cause: Batch-2 relics/arcanas depended on per-combat cost flags, turn-end retained cards, map lookahead, elite mixed rewards, defense-card counters, per-turn color counters, and shield carry. The existing passive hooks could not prove those effects without adding run-state fields and reward resolution support.
- Impact: These items could have been incorrectly marked as implemented if only their rows were present or if reward option counts were tested in artificial card pools. `relic_elite_sticker` was especially risky because the actual elite room uses a relic pool, so adding a card reward required mixed-pool display and claim resolution.
- Resolution: Added serializable passive state for first-expensive-card-free, guard counts, turn color counts, and prism trigger state. Added passive cost adjustment, turn-end retain, block carry, next-room reveal, three-defense heal, four-color draw, five-card damage, and heal-trigger mark behavior. Reward offers can now append supplemental card entries after elite sources and resolve/display reward ids across pools. Boss victory now routes through the stage-clear reward pool before Result so boss reward passives are not debug-only. Debug `handCard` setup was added only for deterministic smoke states.
- Prevention: Passive completion must keep using state-changing smoke cases, not data-row presence. Mixed reward effects must be tested in the actual source-room/pool shape they will encounter in release mode.

### Problem: Input coverage existed for the main slice path but not for every Phaser screen

- Cause: `phaser:smoke` covered keyboard flow and a small click path through Town, WorldMap, Dungeon, Combat, and End Turn, but Reward, Event, RuneBench, Boss, Result, and release event/reward click paths were not audited as explicit input cases. `entry=rune_bench` also defaulted to the first combat room, so a RuneBench test could advance to the wrong next room while still looking like an input issue.
- Impact: The release checklist could not honestly mark Input as done. A screen could be visible and keyboard-accessible while mouse/click behavior or feedback was unproven.
- Resolution: Added full-screen click coverage to `tools/phaser-smoke-test.mjs` for Town, WorldMap, Dungeon, Combat, Reward, Event, RuneBench, Boss, Result, release event choice, and release reward claim paths. Fixed `createDebugConfig()` so `entry=rune_bench` starts from the first rest room or event bench source instead of the first combat room. Added hover/down feedback for shared action buttons, Combat/Boss End Turn buttons, combat cards, and affordable event choices, then added pixel-change smoke checks for representative hover states.
- Prevention: Input gate changes must continue to pair visible controls with a state-changing smoke check and a feedback check where practical. Debug entry shortcuts must not be allowed to hide incorrect room indices or artificial flow assumptions.

### Problem: Current Phaser screens still carried English placeholder UI text and weak text-fit evidence

- Cause: Several Phaser scene titles, buttons, status labels, reward labels, and combat labels were still English placeholders such as `World Map`, `End Turn`, `Claim Reward`, and `Intent`. Existing screenshot smoke proved screens rendered, but it did not inspect Phaser text-object bounds or severe text overlap.
- Impact: The Text quality gate could not honestly be marked done. A screenshot could be nonblank while a label remained untranslated, off-screen, or overlapped by another text object.
- Resolution: Converted the current Phaser screen chrome to Korean fixed UI text, including scene titles, buttons, combat labels, reward/event labels, route/status labels, and manifest/status labels. Exposed the Phaser game object to browser smoke and added text-object layout checks for scene bounds, severe overlap, replacement characters, and old English placeholder labels across the current Town, WorldMap, Dungeon, Combat, Reward, Event, RuneBench, Boss, and Result screens.
- Prevention: Any new Phaser screen or UI label should be covered by `phaser:smoke` text layout checks before the Text quality gate remains green. This gate is screen-fit/consistency proof only and must not be used as final copywriting approval for all release content rows.

### Problem: Core run loop proof covered victory slices but not release full-loop clear and defeat recovery

- Cause: Existing smoke covered the slice scene flow and a boss result flow, but it did not prove a release-mode run from Town across repeated rooms to boss clear and Town return. Player HP reaching 0 also did not route into a result/return/retry flow, so failure could silently stay inside combat state.
- Impact: The Core run loop gate could not honestly move to Done. The game could appear playable in the winning path while lacking a real failure/retry loop, and release-mode route progression could remain under-tested.
- Resolution: Added player defeat handling to combat damage resolution: lethal damage now sets `phase=result`, clears pending rewards, records `combat:defeat:*`, and prevents the next turn from starting. Result now distinguishes clear versus defeat. `phaser:smoke` gained a release `stage_sunny_gate` tracked playthrough that visits repeated combats, Event, elite, Reward, rest/RuneBench, Boss, stage-clear reward, Result, and Town return. It also verifies a 1-HP defeat path to Result, no completed-stage credit, Town return, and new world-map start.
- Prevention: Core loop changes must keep both clear and defeat/retry smoke coverage. A boss clear alone is not enough evidence for the release loop, and combat HP reaching zero must always have a visible recovery path.

### Problem: Save recovery and reset were only partially proven

- Cause: Earlier save smoke verified mid-combat reload and completed-stage reload, but it did not prove legacy migration, corrupt save recovery, unsupported future-version handling, clear/defeat result consistency, or a player-facing reset/delete path in the current Phaser runtime. Relying on debug `resetSave=1` alone was not enough for the release checklist requirement.
- Impact: A damaged localStorage save or future incompatible save could silently break boot, old saves could be discarded instead of migrated, defeat could accidentally persist clear credit, and the project could claim a save system without a real in-game reset/delete route.
- Resolution: Added supported-version detection in `saveCodec` so v1 saves load, recognizable v0/unversioned saves migrate through normalization, unsupported future versions fall back to an initial save, and corrupt JSON recovers safely. Added `clearStoredSave()` and a Town `저장 초기화` action that clears the active save key and reboots into an initial save. Extended `phaser:smoke` to cover legacy migration with invalid-field normalization, corrupt JSON recovery, future-version recovery, clear-result and defeat-result save consistency, debug reset, production save key creation, and production reset through the Town action.
- Prevention: Save-system completion must prove both debug and production storage paths, successful reloads, schema migration, failure recovery, result-state consistency, and a player-facing reset/delete action. Broader progression and settings completion must remain separate gates.

### Problem: Settings were stored only as raw defaults and had no player-facing surface

- Cause: `SaveData.settings` only carried volume defaults, no Phaser screen exposed them, and keyboard controls did not read any saved setting. Town had a save reset button, but there was no release-facing place for audio/display/language/control/accessibility options.
- Impact: The settings gate could not honestly move to Done. Players had no way to adjust or verify settings, and a saved setting could not be proven to survive reload or alter gameplay input.
- Resolution: Added `SettingsScene`, extended `SettingsState` with display mode, large text, reduced motion, and Space-confirm behavior, and normalized those fields through `saveCodec`. Town now links to Settings. The shared scene shell applies master volume and high-contrast/large-text presentation, and keyboard bindings respect `spaceConfirm=false`. Settings includes default reset and save reset actions.
- Prevention: Settings completion must prove screen rendering, persistence, reload survival, reset-to-default behavior, and at least one setting that changes real input or presentation. Audio settings do not complete the separate `Sound/music` gate until actual music/SFX assets and playback behavior exist.

### Problem: UI skinning still relied on flat rectangles after the panel proof

- Cause: The earlier UI panel pass proved only `ui_panel_paper_9slice`. Shared action buttons, Reward rows, Event choices, Settings controls, tooltip/hint surfaces, disabled state, and focus state still used mostly plain Phaser rectangles or had no dedicated skin asset.
- Impact: The project could claim a UI asset path while the actual game still looked like a prototype. This was the same count-as-completion risk as content rows: having one panel asset did not mean the whole interface was skinned.
- Resolution: Added dedicated 9-slice candidate assets for primary buttons, secondary buttons, reward slots, event choice slots, and tooltip paper in both slice and release manifests/generators. Added shared skinned UI helpers in `sceneShell`, routed current Phaser buttons/slots/settings/event choices through them, exposed `uiSkin=button+slot+tooltip`, and extended smoke to verify hover/down feedback, disabled event choice non-advancement, Settings control hover, and screenshots. Manual screenshot review found cramped Event choice text and Reward/debug overlap, so the Event rows and Reward layout were tightened before rerunning smoke.
- Prevention: UI skin completion requires actual screen use plus smoke and screenshot evidence for controls, slots, tooltips, disabled/focus/hover/down states. A generated asset key alone is not enough evidence, and final art approval plus broad visual QA remain separate gates.

### Problem: UI skin was incorrectly reported as complete after a technical-only pass

- Cause: The 9-slice/runtime-helper pass proved that Phaser can load and render skinned UI components, but it did not use the approved concept/source pipeline and did not meet the art bible's premium popup-book fantasy standard. Codex treated technical integration evidence as if it were final visual quality evidence.
- Impact: The release checklist said `UI skin` was `Done` even though the visible Reward/Event result still looked like a prototype to manual review. This repeated the false-completion risk the project rules explicitly forbid.
- Resolution: Downgraded the release checklist so `UI technical skin path` is `Done` and `UI skin` is `Not done`. Added a dedicated visual-quality rubric requirement for concept/source evidence, art-bible fidelity, screen composition, production component states, and debug-less screenshot acceptance before the UI skin gate can move back to `Done`.
- Prevention: UI completion claims must now cite `docs/ui-visual-quality-rubric.md`, current screen scores, red-line blocker status, and screenshot evidence. Automated smoke, generated 9-slice assets, or debug screenshots cannot by themselves complete `UI skin`.

### Problem: Reward choices looked selectable but only first-reward confirmation was wired

- Cause: RewardScene displayed multiple reward options, but the runtime claim path only claimed `offeredRewards[0]` through the confirm action. Number/click choice behavior was not wired to a reward index.
- Impact: A player could read the screen as a real choice while the game silently granted only the first reward. This is both a gameplay trust issue and a UI quality issue.
- Resolution: Added `claimRewardAtIndex`, changed `claimRewardAndAdvance` to accept a reward index, and routed Reward `card_1` through `card_5` actions to claim the matching reward. Reward cards now have click targets, and `phaser:smoke` checks hover plus selected reward-card click flow.
- Prevention: Reward UI changes must prove that visible choices mutate the matching gameplay state. A visual choice card is not acceptable unless the input path and reward grant path agree.

### Problem: First Reward/Event concept rebuild still read too much like small menu cards

- Cause: The first rebuild introduced paper-stage structure, but the selectable Reward cards and Event choices were still visually small inside the stage, and Event did not separate story scene, event art, and choices strongly enough. The result improved technically but did not meet the popup-book visual standard.
- Impact: The UI could pass smoke while still failing manual visual acceptance. This risked repeating the earlier false-completion mistake where technical evidence was mistaken for shippable UI quality.
- Resolution: Enlarged Reward cards and their art/detail hierarchy, added more stage threads/folded-corner paper treatment, and changed Event into a diorama layout with scene art, story panel, and separate choice cards. Captured debug-less screenshots after the pass and rescored Reward/Event in `docs/ui-visual-quality-rubric.md`.
- Prevention: Reward/Event are now tracked by explicit numeric scores and red-line blockers. Even with passing smoke/check/audit evidence, the UI remains `Not done` until critical screens reach at least 85 and the full UI skin gate reaches the 95/100 completion rule.

### Problem: Reward/Event had concept evidence but not enough source-component traceability

- Cause: The visual direction had a generated concept image and runtime Phaser drawing, but there was no separate source component sheet showing the reusable UI parts behind the stage, reward cards, event choices, pins, folds, ribbons, and diorama panels.
- Impact: The UI could drift into hand-tuned runtime shapes without a traceable source language. That weakens the concept/source pipeline requirement and makes it easier to overstate candidate visuals as final art.
- Resolution: Added `assets/source/ui/reward_event_stage_components_v001.svg` and `assets/source/ui/reward_event_stage_components_v001.md`, then mapped Reward/Event runtime pieces back to those source components. Also removed extra immersive info chrome from Reward/Event so the source stage composition owns the screen.
- Prevention: Future UI skin work should add or update source component evidence before claiming visual gates, then capture debug-less screenshots and score against the rubric. Source evidence alone still does not complete the UI gate.

### Problem: Combat first rebuild created a crowded top stack

- Cause: The initial immersive Combat pass moved the screen away from the old header, but the large player status panel and route strip were still placed across the top ribbon area. They visually collided with the title and made the screen look like stacked UI panels instead of a clear combat stage.
- Impact: Combat could not be scored as a critical-screen pass because the title, route, and player state competed for the same space. This was a manual visual blocker even though the technical paths still compiled.
- Resolution: Added `assets/source/ui/combat_stage_components_v001.svg` and its note file, then moved the player status panel into the left playfield side and compressed the route strip below the title ribbon. The 1920 debug-less screenshot `tmp/ui-quality/combat-1920-debugless-v2.png` confirms the top collision is removed, and smoke/check/audit commands passed after the change.
- Prevention: Combat UI changes must be reviewed with debug-less screenshots before any completion language. Preserving input coordinates and smoke coverage is necessary but not enough; the title, route, player status, enemy intent, and card hand each need visible non-overlap and clear hierarchy.

### Problem: Combat v2 screenshot introduced new local label placement defects

- Cause: The second Combat polish pass added a central combat-flow lane and compact stat tags, but the first screenshot placed the flow text behind the player standee and put the gold label below the player panel boundary.
- Impact: The screen looked more crafted, but it introduced new visible defects that would have been easy to miss if only automated smoke was checked. This would have inflated the score without real visual evidence.
- Resolution: Treated `tmp/ui-quality/combat-1920-debugless-v3.png` as a failed visual checkpoint, moved the gold label back inside the player panel, shortened and shifted the central lane text, and recaptured `tmp/ui-quality/combat-1920-debugless-v4.png`. Typecheck, smoke, check, data validation, quality report, release visual audit, and diff check all passed afterward.
- Prevention: Every visual polish pass needs screenshot review before scoring. If the screenshot reveals a new defect, the pass is not accepted until the defect is fixed and a new screenshot is captured.

### Problem: Event release four-choice layout had a bottom-button collision

- Cause: The Event v2 choice-card polish was reviewed first on the three-choice slice event. The release event can render four choices in two rows, and the confirm button at the bottom still occupied the same vertical space as the lower row.
- Impact: The release four-choice screenshot showed the button overlapping the lower choices. This would make the release Event surface visually untrustworthy even if the default slice Event looked improved.
- Resolution: Captured `tmp/ui-quality/event-release-1920-debugless-v5.png`, treated the overlap as a failed visual checkpoint, moved and reduced the confirm button, and recaptured `tmp/ui-quality/event-release-1920-debugless-v6.png`. The follow-up screenshot no longer has the button covering the lower choice cards, and smoke/check/audit commands passed after the fix.
- Prevention: Event UI scoring must include both default/slice and release four-choice screenshot evidence. A single Event screenshot is not enough when the screen has multiple choice-count layouts.

### Problem: Reward v5 release screenshots exposed English titles and a hidden shelf label

- Cause: The Reward visual pass was first checked against the slice reward pool, while release reward pools in `src/data/releaseCatalogAdapter.ts` still had English `displayNameKo` values. The new shelf label was also placed behind the bottom of the reward cards, so it became partially hidden in both three-card and four-card screenshots.
- Impact: Reward could have been over-scored based on the default slice screenshot while the release Reward header still showed English copy and one decorative label was visibly obscured. That would violate the text quality and screenshot-review rules even though smoke still passed.
- Resolution: Captured v5 slice, release-card, and release-rune screenshots, treated the English titles and hidden shelf label as failed visual checkpoints, localized the release reward-pool titles to Korean, removed the obscured label, and recaptured v6 screenshots at 1920x1080 and 1280x720. Typecheck, smoke, check, data validation, quality report, asset audits, release visual audit, and diff check passed afterward.
- Prevention: Reward UI scoring must include release reward-pool screenshots, not only the slice pool. Any new decorative label must be inspected in both three-option and four-option layouts before a score is recorded.

### Problem: Combat v3 polish initially relied on duplicate overlay layers and missed a long-name text overlap

- Cause: The first v3 Combat attempt drew improved header, route, player, and enemy components on top of older runtime components instead of replacing the old layer. That made some labels and enemy text bleed through visually. After the duplicate layers were removed, the first smoke rerun also found that the release enemy name `프리즘 눈부심 장난꾼` overlapped the HP row.
- Impact: Combat could have been over-scored based on a better-looking default screenshot while release enemies or the shared Boss combat panel still had hidden text defects. It also risked preserving a fragile UI implementation where old and new layers both existed.
- Resolution: Removed the old Combat title/player/route/flow drawing from the base theater, made the v3 stage polish the single source for those components, replaced the old enemy panel body with one enemy intent ledger, added route label backplates, and added an enemy-name font-size guard for long Korean release names. Captured v7 debug-less screenshots for slice Combat, 1280 Combat, release Combat, and the Boss shared-panel view. Verification passed with typecheck, smoke, check, data validation, quality report, asset audits, release visual audit, and diff check.
- Prevention: Future visual rebuilds must replace obsolete layers instead of hiding them behind translucent panels. Release-mode long names and any shared component consumers, such as Boss using the Combat enemy panel, must be included before a critical-screen score is raised.

### Problem: Event release choice cards hid useful outcomes behind cramped long text

- Cause: The Event v2 layout rendered release four-choice rewards by listing individual item names in a narrow result row. After the first v3 adjustment, the cost/result label chips were added, but the value text still started too close to the label text.
- Impact: The default three-choice Event looked acceptable, but the release four-choice screen could still look like a compressed data table. That would make the Event score depend on the easy slice case instead of the real release layout.
- Resolution: Added `assets/source/ui/event_stage_components_v003.svg` and changed dense two-column Event cards to show compact reward summaries such as `카드 3`, `룬 2 / 회복 +3`, and `유물 / 골드 +12`. The v7 screenshots exposed label/value crowding, so the value columns were shifted right and v8 slice/release screenshots were captured at 1920x1080 and 1280x720. Smoke, check, data validation, quality report, asset audits, release visual audit, and diff check passed afterward.
- Prevention: Event UI scoring must include the release four-choice layout and 1280 capture. Reward/result rows should summarize dense rewards instead of trying to display every item name in compressed UI space.

### Problem: Boss screen still read like a standard shell with a combat panel

- Cause: Boss reused the standard screen shell around the shared combat panel instead of presenting a boss-specific source-backed stage. The first rebuild also placed the boss phase ledger too close to hand card numbers, and release boss intent telegraph text was too long for the compact right-side action area.
- Impact: Boss could have been counted as visually covered just because the shared Combat panel worked, while the actual Boss screen still lacked boss-scene composition and had text crowding risks. That would overstate UI coverage and repeat the technical-proof-as-final-UI mistake.
- Resolution: Added `assets/source/ui/boss_stage_components_v001.svg`, switched Boss to an immersive purple/brass paper-theater stage, rendered the Combat v3 theater family directly, added a boss phase ledger, moved that ledger after smoke caught overlap, and compacted boss intent labels for release bosses. Captured v4 debug-less screenshots for 1920, 1280, and release Boss views. Typecheck, smoke, check, data validation, quality report, asset audits, release visual audit, and diff check passed afterward.
- Prevention: Boss UI scoring must include boss-specific source evidence plus slice, release, and 1280 debug-less screenshots. Shared Combat panel evidence is not enough to score the Boss screen, and release long text must stay in the screenshot/smoke path.

### Problem: Town first screen still looked like a standard shell with buttons

- Cause: Town used the shared standard shell and then placed unlocked/completed counts plus three action buttons on top. That proved input and save/reset behavior, but it did not make the first screen feel like a game hub or follow the source-backed paper-theater UI standard.
- Impact: The first screen could undercut the visual direction even if Reward/Event/Combat/Boss looked stronger. It also risked implying the Town/meta gate was complete because buttons existed, while actual Town systems remain incomplete.
- Resolution: Added `assets/source/ui/town_stage_components_v001.svg`, switched Town to an immersive paper-theater village hub, and rendered a village diorama, player passport, expedition board, route markers, save-derived record slot, and the same smoke-covered world-map/reset/settings buttons. Screenshot review caught route markers under the world-map button, crowded village/passport text, and shortcut-like tooltip copy; v4 screenshots fixed those issues. Typecheck, smoke, check, data validation, quality report, asset audits, release visual audit, and diff check passed afterward.
- Prevention: Town UI scoring must separate visual hub quality from Town/meta system completion. Future Town changes need both slice/release/1280 screenshots and a clear note that visual polish does not complete character unlocks, shops, museums, or progression systems.

### Problem: WorldMap looked like a functional route screen instead of a source-backed map stage

- Cause: WorldMap previously relied on the shared shell and a single `던전으로` action, so it technically connected the flow but did not look like an unfolded in-world map. The first rebuild also put the right record ledger and tooltip too close to the route nodes, and v2 still left later release route nodes near the ledger edge.
- Impact: WorldMap could have been incorrectly counted as visually covered because the click path worked. That would repeat the same technical-proof-as-final-UI mistake and hide a real release-mode layout risk.
- Resolution: Added `assets/source/ui/world_map_stage_components_v001.svg`, rebuilt the screen into a paper-theater map with a left map drawer, center folded route, right record ledger, route nodes, and current-stage icon. v1/v2 screenshots were treated as failed visual checkpoints; v3 rerouted later nodes away from the record panel and replaced the clipping tooltip with a simple ledger line. Typecheck, smoke, check, data validation, quality report, asset audits, release visual audit, and diff check passed afterward.
- Prevention: WorldMap scoring must include slice 1920, slice 1280, and release 1920 debug-less screenshots. The screen must stay labeled as visual progress only until the actual multi-stage selection/unlock system and final map art are proven separately.

### Problem: Dungeon first rebuild hid a room number behind the primary button

- Cause: The Dungeon corridor pass preserved the existing `방 입장` button coordinate, but the center room number was still placed in the same vertical band as that button. The first release-route screenshot also showed the route helper area could crowd the visible route entries.
- Impact: The screen looked more like a dungeon stage, but it still had a real text-overlap defect. If only the 1920 screenshot had been accepted by eye, the screen could have been over-scored while `phaser:smoke` correctly rejected it.
- Resolution: Limited the visible route ledger to six entries, recaptured v2 screenshots, then moved the center room number above the button after `phaser:smoke` failed on `text overlap "1" with "방 입장"`. v3 screenshots cover slice 1920, slice 1280, and release 1920, and the rerun smoke passed.
- Prevention: Dungeon scoring must include automated text-overlap smoke plus debug-less screenshots at slice 1920, slice 1280, and release 1920. Preserving the action coordinate is required, but all decorative room labels must be checked against the primary button area before scoring.

### Problem: RuneBench first rebuild exposed a button/card collision and internal effect names

- Cause: The first RuneBench workbench pass preserved the existing `룬 장착` button coordinate, but the target-card preview still sat under the button. The effect summary also displayed raw implementation op names such as `modify_damage_percent`.
- Impact: The screen looked more like a rune workbench, but it still exposed implementation language and hid part of the target card behind the action button. That would make the UI feel unfinished even with smoke passing.
- Resolution: Moved the target-card preview left while preserving the `1010,742` action coordinate, replaced internal op names with Korean effect summaries such as `피해 +15%`, and recaptured v3 slice, 1280, and release screenshots.
- Prevention: RuneBench scoring must include screenshot review for both slice and release rune text. Any player-facing line must be Korean gameplay copy, not schema/effect op names, and the preserved action coordinate must be checked against card preview bounds.

### Problem: Result first rebuild could be over-counted from a neutral entry only

- Cause: Result can be entered as a neutral debug/result surface, a real defeat, a slice boss clear, or a release boss clear. Judging only the default `entry=result` view would miss tone-specific copy, completed-stage counts, collection counts, and route progress text.
- Impact: Result could be scored as visually covered while the actual clear or defeat paths still had text hierarchy or layout risks. That would repeat the mistake of treating a narrow technical path as final UI evidence.
- Resolution: Added `assets/source/ui/result_stage_components_v001.svg`, captured neutral 1920/1280, real defeat, slice-clear, and release-clear debug-less screenshots, and verified the screen through typecheck, Phaser smoke, check, data validation, quality report, asset audits, release visual audit, and diff check.
- Prevention: Result scoring must include at least neutral, defeat, clear, release-clear, and 1280 evidence. Any future Result changes must preserve the `1010,742` `마을로` action and rerun text-overlap smoke before a score is recorded.

### Problem: Settings v1 used oversized row labels and crowded headings

- Cause: The first Settings ledger pass kept the existing smoke-covered control coordinates, but used row typography that was too large for the dense settings rows. Panel headings also sat too close to the panel borders.
- Impact: The screen technically kept the controls working, but visually it looked crowded and unfinished. Counting that first capture as acceptable would have inflated the Settings score while hiding a visible UI polish defect.
- Resolution: Reduced row label/value typography, moved section headings down, reduced small-button type size, and recaptured v2 1920, 1280, release, and high-contrast screenshots. The control coordinates remained unchanged and `phaser:smoke` passed.
- Prevention: Settings scoring must include 1280 and toggled/high-contrast screenshots, not only the default 1920 view. The smoke-covered click coordinates are mandatory, but typography still has to be judged visually before recording a score.

### Problem: WorldMap first rebuild still looked selectable without proving selection

- Cause: The first WorldMap rebuild made the screen look like an unfolded map, but the drawer was still effectively a current-stage display and did not prove a release clear would unlock a next stage or that a player could select it from the map.
- Impact: The screen could be over-scored as a finished map UI because it looked more thematic, while the real game behavior was still only the current `던전으로` path. That would repeat the exact false-completion risk the user called out.
- Resolution: Added `assets/source/ui/world_map_stage_components_v002.svg`, implemented `selectWorldMapStage`, synced completed stages into profile completed/unlocked lists, unlocked the next ordered stage after clear, added `unlockedStages=` debug evidence, and extended `phaser:smoke` to clear `stage_sunny_gate`, verify `stage_lavender_hall` unlock, click the second map row, and verify `flow:stage_select:stage_lavender_hall`.
- Prevention: WorldMap scoring must separate visual map presentation from actual progression behavior. A map row is not accepted as meaningful unless smoke or manual evidence proves the row is driven by save/profile state and changes the selected stage.

### Problem: WorldMap v4 stage drawer and right ledger still had compact text defects

- Cause: The v4 functional drawer added real row states, but some status labels such as `클리어 / 선택 가능` were too long for the compact drawer, and the right ledger helper sat too close to the bottom border.
- Impact: The new functional proof could have been accepted while visible text still looked cramped, especially in the release map screenshots. That would make the score improvement too generous.
- Resolution: Shortened row status labels, changed the right ledger helper to a shorter line, and recaptured v5 screenshots for slice 1920, slice 1280, release default, release unlocked, and release selected states. v5 no longer shows the v4 bottom clipping defect.
- Prevention: Any future map/progression UI work must capture both default and progressed release states. The accepted screenshot set must include the selected-stage state, not only the easiest default entry.

### Problem: Dungeon v1 corridor did not expose enough real progression information

- Cause: The first Dungeon rebuild made the screen thematic, but the visible state still leaned on current-room presentation. It did not strongly surface the next-room uncertainty/reveal, boss distance, resource pressure, or route-state labels in a way that made the screen feel like an active dungeon-progression decision surface.
- Impact: Dungeon could have been over-scored because it looked more like a paper corridor while still behaving visually like a mostly static room entry screen. That would repeat the user's concern that a thin visual pass might be called complete.
- Resolution: Added `assets/source/ui/dungeon_stage_components_v002.svg`, added current/next intel cards, boss-distance and resource rows, route-row state labels, and copy that changes when `relic_soft_compass` reveals the next room. `phaser:smoke` verifies the soft-compass reveal and writes `tmp/phaser-dungeon-release-soft-compass.png`.
- Prevention: Dungeon scoring must separate visual corridor polish from actual progression/readability proof. Any future Dungeon score increase must include state-driven evidence for route decisions, not only a better-looking door scene.

### Problem: Dungeon v4 next-room intel card overlapped the route panel

- Cause: The first v2 layout placed the next-room intel card too far right while preserving the center door and right route ledger positions.
- Impact: The new compass/reveal information was technically present, but the release screenshots showed the card sitting under the route panel edge. Accepting v4 would have hidden a visible layout defect behind a functionality pass.
- Resolution: Reduced the intel-card width, moved the next-room card left, and recaptured v5 screenshots for slice 1920, slice 1280, release default, and release soft-compass states. v5 removes the route-panel overlap while preserving the smoke-covered `방 입장` coordinate.
- Prevention: Dungeon v2+ changes must include both default and `relic_soft_compass` release screenshots. New center-stage cards must be inspected against the right route panel at 1920 and 1280 before a score is raised.

### Problem: RuneBench first pass showed the target but not enough attachment consequence

- Cause: The first RuneBench pass showed the selected rune, target card, socket connector, and ledger counts, but it did not clearly show what would change on the card after attachment or why the card was a valid target.
- Impact: The screen could be scored as visually thematic while still failing as a buildcraft surface. A player could see that a rune would attach, but not easily judge whether the attachment was meaningful.
- Resolution: Added `assets/source/ui/rune_bench_stage_components_v002.svg`, added before/after cost/damage/block preview cards, compatibility proof copy, recommendation text, and a right-ledger change row. The preview uses current rune runtime helpers for existing attached stats and applies the selected rune as a non-mutating after-preview.
- Prevention: RuneBench score increases must prove decision readability, not just visual workbench polish. The accepted evidence set must show the target, compatibility, and at least one before/after stat change.

### Problem: RuneBench v4 introduced a decorative label overlap

- Cause: The v2 workbench added stat preview cards and moved the connector label, but kept a decorative `룬` label near the rune stone. That label overlapped the existing socket-type label rendered by the rune stone.
- Impact: The new before/after preview improved the screen, but the visible overlap would make the result unscorable as a clean UI pass. The defect was caught by `phaser:smoke` text-overlap auditing before documentation scoring.
- Resolution: Removed the decorative `룬` label, reran `phaser:smoke`, and recaptured v5 slice, 1280, and release screenshots. v5 keeps the state-driven preview while avoiding the socket-label overlap.
- Prevention: New decorative labels around existing component labels must be treated as overlap risks. Smoke text auditing and a recaptured debug-less screenshot set are required before any RuneBench v2+ score increase.

### Problem: Town v1 hub looked thematic but did not show enough save/profile progression

- Cause: The first Town rebuild made the village feel like a paper-theater hub, but the expedition board still leaned on simple counts and current-stage presentation. It did not clearly show the next expedition, completed-stage stamp, route preview, or next locked chapter from the save/profile state.
- Impact: Town could have been over-scored as visually covered while still failing as a progression hub. That would repeat the false-completion risk where a screen looks nicer but does not communicate the actual game state.
- Resolution: Added `assets/source/ui/town_stage_components_v002.svg`, changed the expedition board into a save/profile-driven dossier, and surfaced unlocked/completed/remaining counts, next expedition, completed stamps, route preview, and next-sealed status. Captured slice, 1280, release, and progressed-release screenshots before scoring.
- Prevention: Future Town score increases must prove state readability, not only village theming. Evidence must include a progressed save state when progression copy or counts are changed.

### Problem: Town v2 next-sealed information crowded the route board before v8

- Cause: v5 placed next-sealed information as a separate card near the route preview, and v6 moved it to the board bottom. v7 moved it upward but still left it too close to the next-expedition slot in the progressed release capture.
- Impact: The new progression information was technically present, but accepting those captures would hide visible crowding in the exact area meant to clarify progression.
- Resolution: Shortened the next-sealed label, moved it inside the remaining-stage stat area, recaptured v8 slice, 1280, release, and progressed-release screenshots, then reran typecheck, Phaser smoke, check, data validation, quality report, asset audits, release visual audit, and diff check.
- Prevention: Town v2+ changes must include both default and progressed release screenshots. Any new summary line near the route preview has to be checked at 1920 and 1280 before a score is raised.

### Problem: Result first pass looked like a certificate but did not expose enough run consequence

- Cause: The first Result rebuild made the screen thematic, but the center certificate still leaned on outcome, HP/gold, completed count, and collection totals. It did not clearly show route composition, next action, or deck/collection deltas as a player-facing run recap.
- Impact: Result could be over-scored because it looked more polished while still failing to answer what happened in the run and what changes next. That is the same false-completion risk as calling a pretty shell a finished game screen.
- Resolution: Added `assets/source/ui/result_stage_components_v002.svg`, added route progress and route-composition display, added a next-record row, changed the deck row to total plus newly added cards, and added a compact preservation summary.
- Prevention: Result score increases must prove run consequence readability, not only curtain-call styling. Evidence must include neutral, defeat, clear, release-clear, and 1280 screenshots.

### Problem: Result v2-v4 next-action layout failed before v5

- Cause: v2 placed the next-action ticket too far right, where release-clear screenshots hid it under the collection ledger. v3 moved it into a top ribbon but left longer copy cramped. v4 widened the ribbon enough to read, but then it visually collided with the central result title.
- Impact: Each version improved one defect while creating another visible layout problem. Accepting any of those captures would have inflated the score and hidden a real UI polish defect.
- Resolution: Treated v2, v3, and v4 as failed visual checkpoints. v5 moved next-action copy into the lower record row, kept the central title clean, preserved the `마을로` coordinate, and recaptured neutral 1920/1280, defeat, slice-clear, and release-clear screenshots.
- Prevention: Result v2+ scoring must include release-clear and 1280 screenshot review after every placement change. A new summary surface is not accepted until it avoids both side-panel overlap and title/action crowding.

### Problem: Combat concept-reset pass initially moved End Turn into enemy intent text

- Cause: The concept-reset pass moved the enemy ledger farther right but left the End Turn button near the old intent area.
- Impact: The screen looked closer to the concept art, but the action button overlapped the enemy intent text. Accepting that screenshot would have repeated the previous false-completion pattern where a visual pass hides a gameplay readability defect.
- Resolution: `phaser:smoke` caught the overlap between `의도 공격 6` and `턴 종료`. Codex moved the Combat and Boss End Turn buttons to `1630,708`, then updated the smoke hover/click coordinates to match the new intentional placement.
- Prevention: Any future Combat/Boss action-button move must update both the runtime button placement and the smoke-covered hover/click coordinates in the same pass.

### Problem: UI panel generator produced cyan hatching after the concept reset

- Cause: The UI generator added positive paper-grain values to colors that could already be 255. When written into the PNG buffer, values above 255 wrapped into bright cyan/green channel artifacts.
- Impact: The runtime panels technically loaded and smoke passed, but debug-less review showed noisy cyan diagonal hatching across panels, which directly conflicted with the premium paper-theater concept target.
- Resolution: Removed the positive grain branches from the UI panel, button, slot, and tooltip generators, regenerated dev runtime assets, inspected `ui_panel_paper_9slice_v001.png`, and recaptured `tmp/ui-quality/combat-1920-concept-reset-v5.png`.
- Prevention: Future procedural color work must avoid channel overflow by clamping or by using only safe darkening grain. UI generator changes must include direct PNG inspection, not only smoke/check.

### Problem: Combat still looked vector/procedural after the concept reset

- Cause: The first concept-reset pass improved procedural panel material and layout, but it still relied on generated 9-slice/procedural sprites and card icons as if they were enough to prove the concept-art direction.
- Impact: The user correctly rejected the result because the runtime screen did not visually justify the earlier concept-art work. Calling that state concept-matched would have repeated the false-completion pattern.
- Resolution: Added a raster Combat underlay, raster player/enemy standee spritesheets, and raster starter card illustrations for `card_art_sun_jab`, `card_art_fold_guard`, and `card_art_page_step`. `CombatScene` now uses that raster path for the normal Combat first view.
- Prevention: Combat visual-quality claims must be based on debug-less screenshots that include the actual runtime raster assets, not on procedural placeholder panels or code-native vector stand-ins.

### Problem: Generated standee cutouts left green chroma remnants

- Cause: The first chroma-key cleanup used border flood-fill, which removed connected background but missed internal holes in the folded sentry silhouette.
- Impact: v2 screenshots showed bright green remnants under and inside the enemy standee, which made the new high-quality sprite look unfinished and broke the paper-theater illusion.
- Resolution: Reprocessed the player and enemy generated PNGs with stricter global chroma-key removal for clear background hue pixels, then repacked the transparent 4x4 spritesheets. v3 screenshots removed the visible green remnants.
- Prevention: Generated transparent sprites must be validated both by alpha statistics and by actual Phaser screenshots. Border-only keying is not sufficient for silhouettes with internal gaps.

### Problem: Starter card art remained placeholder-like after standee replacement

- Cause: The Combat hand used high-quality underlay card frames, but the card illustration assets for the visible starter hand were still deterministic icon-like placeholder images.
- Impact: Even after replacing the stage and standees, the bottom hand still read as vector/test art and visibly conflicted with the concept-art target.
- Resolution: Generated raster paper-theater card illustrations for `햇살 찌르기`, `접힌 방패`, and `책장 넘기기`, resized them to the manifest `520x360` card-art size, saved them under `assets/source/cards/`, and copied them to the existing runtime card-art paths.
- Prevention: First-view Combat screenshot review must include the card interiors, not only the stage and side panels. Source passthrough entries must protect generated raster card art from dev asset regeneration.

### Problem: Enemy panel copy floated over decorative art

- Cause: Runtime enemy name and intent copy were initially overlaid on the raster underlay at coordinates that crossed the right-side shield decoration and intent rows.
- Impact: The screen looked less like a composed concept-art UI and more like debug text placed over a painting.
- Resolution: Moved the enemy name into the right-panel banner, separated health/block/mark y positions, hid empty intent copy, and kept actual intent copy small and low in the panel. v6 screenshots show the corrected first-view layout.
- Prevention: Raster underlay text overlays must be placed only in reserved blank panel zones, and every coordinate change must be recaptured at 1920 and 1280 before acceptance as progress evidence.

### Problem: Boss first view still used the procedural UI shell after Combat was rasterized

- Cause: The normal Combat scene gained a raster underlay path, but BossScene still reused the old procedural theater, command board, enemy panel, player standee, and default card-hand renderer.
- Impact: The game looked visually inconsistent: normal Combat moved toward the concept-art target, while Boss still looked like the vector/procedural candidate UI the user rejected. The upgraded card art also clashed with the older Boss shell.
- Resolution: Added `boss_raster_underlay_concept` as a project-bound runtime/source asset, registered it in both slice manifests, protected it in `tools/generate-dev-runtime-assets.mjs`, and added a Boss raster render branch that uses the boss concept underlay with state overlays and a Boss-specific card/action layer.
- Prevention: Concept-match progress must be checked screen by screen. Updating Combat does not prove Boss, Reward, Town, or other screens meet the same raster quality bar.

### Problem: Boss raster v1 overlaid runtime art and text in the wrong zones

- Cause: The first Boss raster pass reused the normal Combat raster card overlay and placed phase/reward text over the boss body instead of the right-side blank panels.
- Impact: The screen had high-quality raster background art, but the extra overlays made it look like a debug layer pasted on top of concept art.
- Resolution: Replaced the normal Combat card overlay with a Boss-specific overlay that does not draw duplicate card art, moved phase/reward text into right-panel zones, moved the End Turn action to the lower-right visual control area, and updated the smoke click/hover coordinate.
- Prevention: Raster underlay reuse must still be layout-specific. Card overlays, action buttons, and text zones should be tuned per concept screen and recaptured before any checkpoint is recorded.

### Problem: Reward first view still used the procedural UI shell after Combat and Boss were rasterized

- Cause: The Reward concept art existed, but `RewardScene` still rendered the older generated paper-stage layout with code-drawn cards, panels, and decorative shapes.
- Impact: The runtime Reward screen would repeat the exact mismatch the user rejected: the project had a high-quality concept target, but the playable UI still looked like a procedural candidate rather than concept-matched art.
- Resolution: Added `reward_raster_underlay_concept` as a project-bound runtime/source asset, registered it in both slice manifests, protected it in `tools/generate-dev-runtime-assets.mjs`, and added a Reward raster render branch that uses the concept underlay with minimal text and hit-target overlays.
- Prevention: Reward visual-quality claims must be based on screenshots that show the actual raster concept underlay in runtime. The old procedural Reward fallback remains only as a fallback path, not as evidence of meeting the concept-art goal.

### Problem: Reward raster v1 placed guidance text outside the intended panel zone

- Cause: The first raster Reward pass placed the right-side reward guidance too close to the center card area, so the text floated over the underlay boundary instead of sitting inside the right ledger panel.
- Impact: Even though the raster background was present, the overlay still looked pasted on top of the concept art and would have hidden a real composition defect if accepted as the checkpoint.
- Resolution: Moved the right-panel copy into the panel body, narrowed it to the concept-safe area, and removed an unnecessary top stage label in v3. Recaptured 1920 and 1280 screenshots after the adjustment.
- Prevention: Raster underlay text overlays must be checked against the concept's reserved blank zones. Each primary screen should get at least one 1920 and one 1280 debug-less capture before it is recorded as progress.

### Problem: Event first view still used the procedural UI shell after Combat, Boss, and Reward were rasterized

- Cause: The Event concept art existed, but `EventScene` still rendered the older code-drawn paper stage, choice slots, and decorative card structure.
- Impact: Event would have remained a visible exception to the user's explicit rejection of vector/procedural-looking UI, even though the project already had a higher-quality raster concept target for the screen.
- Resolution: Added `event_raster_underlay_concept` as a project-bound runtime/source asset, registered it in both slice manifests, protected it in `tools/generate-dev-runtime-assets.mjs`, and added an Event raster render branch with minimal title, record, choice, and transparent hit-target overlays.
- Prevention: Event visual-quality claims must show the actual runtime raster underlay in 1920 and 1280 screenshots. The old procedural Event renderer is fallback only, not evidence that Event meets the concept-art goal.

### Problem: Release Event still fell back to procedural UI after the slice Event raster pass

- Cause: Release mode builds its runtime bundle from `assetManifest.release.v1.json`, while the new shared UI raster underlays were only added to the slice manifest. `hasEventRasterUnderlay` therefore returned false in release mode.
- Impact: `?data=release&entry=event` still showed the rejected procedural Event UI even after slice Event looked correct. This would have hidden a mode-specific visual regression behind slice-only screenshots.
- Resolution: `releaseCatalogAdapter` now merges the shared Combat/Boss/Reward/Event raster UI underlay assets from the slice manifest into the release runtime bundle without modifying the strict release visual manifest. Release Event screenshots now use the raster underlay, and smoke coordinates were updated to the visible four-card raster layout.
- Prevention: Every raster UI checkpoint that affects gameplay scenes must be checked in both slice and release mode when release smoke covers that scene. A slice-only screenshot is not enough evidence.

### Problem: Event raster overlays initially crowded concept art zones

- Cause: Early Event raster passes placed left status text over the concept's icon rows and placed cost/result labels over the card-bottom icon area.
- Impact: The screen had the correct raster artwork, but the overlays still looked pasted onto the painting and weakened the concept match.
- Resolution: Removed redundant left status text and moved cost/result details to the right-side record panel only. v5 screenshots keep the card-bottom concept icons clean while preserving choice descriptions and click targets.
- Prevention: Raster UI overlays should prefer fewer, better-placed runtime labels. If the concept already communicates a surface with icons or art, runtime text should not duplicate it unless readability requires it.

### Problem: Town first view still used the procedural village shell after adjacent screens were rasterized

- Cause: The Town concept art existed, but `TownScene` still rendered code-drawn buildings, side panels, stat cards, and stacked action buttons.
- Impact: Town is a high-frequency hub screen, so leaving it procedural would make the game feel visually inconsistent immediately after Combat/Boss/Reward/Event moved toward the concept-art target.
- Resolution: Added `town_raster_underlay_concept` as a project-bound runtime/source asset, registered it in both slice manifests, protected it in `tools/generate-dev-runtime-assets.mjs`, added it to the release shared UI raster bundle, and added a Town raster render branch with minimal side-panel overlays and transparent hit targets.
- Prevention: Hub screens must be checked under the same raster/source-art standard as combat screens. A polished procedural hub cannot be treated as concept-matched if a higher-quality raster concept exists.

### Problem: Town raster v1 placed text over portrait and side-panel icons

- Cause: The first Town raster pass reused functional labels that were too close to the portrait and right-side badge column.
- Impact: The Town background art was correct, but the labels made the screen read like runtime text pasted over concept art.
- Resolution: Moved the character name into the left nameplate, reduced the left status rows to numeric values, and moved stage/progression copy to the right-side blank rows. v2 screenshots show the cleaner placement.
- Prevention: Town overlays should be anchored to blank side-panel labels or existing toolbar affordances. Text should not sit on top of portraits, building art, badge icons, or decorative route artwork.

### Problem: WorldMap still used the procedural map shell after adjacent screens were rasterized

- Cause: The WorldMap concept art existed, but `WorldMapScene` still rendered the older code-drawn unfolded map, ledgers, panels, and stage rows.
- Impact: WorldMap remained visibly out of sync with the user's concept-art target and would have repeated the rejected vector/procedural UI look between Town and Dungeon.
- Resolution: Added `world_map_raster_underlay_concept` as a project-bound runtime/source asset, registered it in both slice manifests, protected it in `tools/generate-dev-runtime-assets.mjs`, added it to the release shared UI raster bundle, and added a WorldMap raster render branch that uses the concept underlay.
- Prevention: Map visual-quality claims must show the actual runtime raster concept art in slice and release screenshots. A thematic procedural fallback is not evidence of meeting the concept-art goal.

### Problem: WorldMap raster text overlays weakened the concept match

- Cause: Early WorldMap raster passes kept runtime character/stage labels over the concept portrait and right ledger.
- Impact: The background was raster, but the overlays made the screen read like text pasted over a painting instead of a composed concept-art UI.
- Resolution: Removed the WorldMap raster text overlays and kept the raster path to concept art plus transparent hit targets only. Latest evidence is `tmp/ui-quality/world-map-raster-underlay-v6-node-hit-1280.png` and `tmp/ui-quality/world-map-raster-underlay-release-v6-node-hit-1920.png`.
- Prevention: Raster concept screens should use no runtime text unless the concept has a safe blank label zone and the capture proves it does not collide with portrait, map, icon, or panel art.

### Problem: Removing the procedural WorldMap row list broke proven stage selection

- Cause: The old stage selection behavior was tied to procedural row hit targets. The first raster WorldMap path only preserved the confirm/play hit target, so the release-run smoke could no longer click a second-stage row after unlock.
- Impact: The raster map looked closer to the concept, but stage selection behavior regressed. Accepting only the visual screenshot would have hidden a real progression UX failure.
- Resolution: Added invisible hit targets over the concept map's numbered stage nodes and updated smoke to click node 2 at `808,756` after `stage_sunny_gate` clears. The smoke now verifies `stage=stage_lavender_hall` and `log=flow:stage_select:stage_lavender_hall`.
- Prevention: When replacing a procedural UI with raster concept art, every previous gameplay action must be remapped to concept-native hit zones and verified through smoke or manual click probes.

### Problem: Dungeon still used the procedural dungeon shell after adjacent screens were rasterized

- Cause: The Dungeon concept art existed, but `DungeonScene` still rendered the older code-drawn dungeon theater, ledgers, route rail, and action button.
- Impact: Dungeon remained visually inconsistent with the new raster concept direction, especially because it sits immediately after WorldMap in the main loop.
- Resolution: Added `dungeon_raster_underlay_concept` as a project-bound runtime/source asset, registered it in both slice manifests, protected it in `tools/generate-dev-runtime-assets.mjs`, added it to the release shared UI raster bundle, and added a Dungeon raster render branch that uses the concept underlay.
- Prevention: Main-loop transition screens must be audited together. Town, WorldMap, and Dungeon should not mix raster concept art with procedural fallback visuals unless the fallback is explicitly being tested as fallback only.

### Problem: Dungeon raster v1 pasted text over the concept panels and door art

- Cause: The first Dungeon raster pass tried to preserve runtime labels on top of the full-screen concept image.
- Impact: The labels crowded the left ledger, right route panel, and central door composition. This made the screen less faithful to the concept than using the concept image cleanly.
- Resolution: Removed Dungeon raster runtime text overlays and kept only transparent hit targets for the legacy smoke coordinate and the visible bottom-center concept action. v3 slice and release screenshots show the clean concept-first layout.
- Prevention: Dungeon runtime state labels need a later, deliberate pass using safe blank panel zones. Until that pass is designed, textless concept underlay is the cleaner progress checkpoint.

### Problem: Phaser smoke assumed every scene had visible Phaser text

- Cause: `assertSceneTextLayout` waited for visible Phaser text and required at least five text objects. Raster-only WorldMap and Dungeon intentionally moved visible UI information into the concept image and kept Phaser text at zero.
- Impact: The first smoke rerun failed even though the raster-only screen was intentionally textless. Leaving the test unchanged would force new procedural labels back onto the concept art.
- Resolution: Narrowed the text-layout exception to raster-only `DungeonScene`, `WorldMapScene`, `RuneBenchScene`, `ResultScene`, and later `SettingsScene`, and only when the matching raster underlay texture is present as a visible scene image.
- Prevention: Smoke tests should distinguish text-layout audits from raster concept-art audits. Textless screens are allowed only when the intended raster underlay is actually loaded and visible.

### Problem: RuneBench still used the procedural workbench shell after the raster-screen pass

- Cause: The RuneBench concept art existed, but `RuneBenchScene` still rendered the older code-drawn paper panels, rune slots, card preview, stat preview cards, and action button.
- Impact: RuneBench looked especially far from the concept target: the concept was a rich raster workbench, while the runtime screen was a bright procedural layout. This would have kept a major buildcraft screen visibly below the user's stated quality bar.
- Resolution: Added `rune_bench_raster_underlay_concept` as a project-bound runtime/source asset, registered it in both slice manifests, protected it in `tools/generate-dev-runtime-assets.mjs`, added it to the release shared UI raster bundle, and added a RuneBench raster render branch that uses the concept underlay.
- Prevention: Prior "second rebuild" scores cannot be reused under the current no-procedural-final-UI standard. Each screen with an approved concept target must be checked for actual runtime concept-underlay usage.

### Problem: RuneBench text-layout smoke would reject the intended textless raster path

- Cause: After the raster RuneBench pass, the visible UI information comes from the concept image and Phaser text is intentionally absent. The smoke text audit only allowed Dungeon and WorldMap as raster-only exceptions.
- Impact: Keeping the test unchanged would push runtime labels back onto the concept art or make the smoke fail despite the intended visual direction.
- Resolution: Added `RuneBenchScene: "rune_bench_raster_underlay_concept"` to the narrow raster-only smoke exception. The exception still requires the matching underlay to be loaded and visible.
- Prevention: Textless raster exceptions must be per-scene and tied to a specific underlay key. They should not become a broad bypass for layout problems on text-heavy screens.

### Problem: Result still used the procedural certificate shell after the raster-screen pass

- Cause: The Result concept art existed, but `ResultScene` still rendered the older code-drawn certificate, side ledgers, collection panel, and action button.
- Impact: Result remained visually inconsistent with the user's concept-art target. A run could end on a screen that looked like the earlier procedural UI the user explicitly rejected.
- Resolution: Added `result_raster_underlay_concept` as a project-bound runtime/source asset, registered it in both slice manifests, protected it in `tools/generate-dev-runtime-assets.mjs`, added it to the release shared UI raster bundle, and added a Result raster render branch that uses the concept underlay.
- Prevention: End-state screens need the same raster/source-art standard as the main loop. A readable procedural result screen is not accepted as concept-matched when a full result concept exists.

### Problem: Result text-layout smoke would reject the intended textless raster path

- Cause: After the raster Result pass, the visible UI information comes from the concept image and Phaser text is intentionally absent. The smoke text audit needed a scene-specific raster exception.
- Impact: Keeping the test unchanged would push labels back over the concept art or make the smoke fail even though the raster path is intentional.
- Resolution: Added `ResultScene: "result_raster_underlay_concept"` to the narrow raster-only smoke exception. The exception still requires the matching underlay to be loaded and visible.
- Prevention: Result needs a later state/readability pass with safe zones if dynamic labels are reintroduced. The textless smoke exception should not be treated as final result UX approval.

### Problem: Settings still used the procedural options shell after the raster-screen pass

- Cause: The Settings concept art existed, but `SettingsScene` still rendered the older code-drawn options panels, controls, tooltip, and action buttons.
- Impact: Settings remained visually inconsistent with the user's concept-art target and would still look like the rejected procedural UI when opened from the raster Town hub.
- Resolution: Added `settings_raster_underlay_concept` as a project-bound runtime/source asset, registered it in both slice manifests, protected it in `tools/generate-dev-runtime-assets.mjs`, added it to the release shared UI raster bundle, and added a Settings raster render branch that uses the concept underlay.
- Prevention: Utility screens are still part of the visible UI skin. They should not be exempted from concept-art matching just because they are functional/options-heavy.

### Problem: Settings raster path risked breaking existing settings controls

- Cause: Unlike Dungeon or Result, Settings has many smoke-covered controls for volume increments, display mode, accessibility toggles, settings reset, save reset, and return-to-town.
- Impact: A pure image-only replacement would visually match the concept but break actual settings behavior and persistence.
- Resolution: Remapped the existing smoke-covered Settings controls to transparent hit targets over the concept art while keeping the same `updateSettings`, `resetSettings`, `resetStoredSave`, and return-to-town logic.
- Prevention: Textless raster UI replacement must still preserve every gameplay/control coordinate covered by smoke. If a screen has many controls, the transparent hit-target map must be verified before visual progress is recorded.

### Problem: Settings concept PNG native size was entered incorrectly

- Cause: Most UI concepts used `1672x941`, but `settings_ui_concept_v001.png` is actually `1677x938`. The new manifest entry initially reused the common size without checking.
- Impact: `npm.cmd run check` failed in `assets:audit` with a native-size mismatch. If not caught, the manifest would have documented wrong source dimensions.
- Resolution: Corrected both slice and docs manifest native sizes for `settings_raster_underlay_concept` to `1677x938`, then reran `npm.cmd run check` successfully.
- Prevention: Every new raster underlay must be audited by `assets:audit`; do not assume all concept images share identical dimensions.

### Problem: Settings text-layout smoke would reject the intended textless raster path

- Cause: After the raster Settings pass, the visible UI information comes from the concept image and Phaser text is intentionally absent. The smoke text audit needed a scene-specific raster exception.
- Impact: Keeping the test unchanged would push labels back over the concept art or make the smoke fail even though the raster path is intentional.
- Resolution: Added `SettingsScene: "settings_raster_underlay_concept"` to the narrow raster-only smoke exception. The exception still requires the matching underlay to be loaded and visible.
- Prevention: Settings needs a later accessibility/readability pass with safe dynamic labels, but the concept-match checkpoint should not reintroduce procedural panels simply to satisfy a text-count audit.

### Problem: Combat still looked vector/procedural despite loading a raster underlay

- Cause: The Combat scene had a raster underlay texture, but the runtime still drew placeholder standees, card art, card labels, enemy/player text overlays, icons, and temporary combat effects over it. The runtime underlay file was also a clean empty UI template, not the full approved Combat concept image.
- Impact: The screen contradicted the user's stated standard. It technically loaded a raster asset, but visually it still looked like a vector/procedural composite rather than the concept art that had been selected.
- Resolution: Replaced the Combat runtime/source underlay with `assets/concepts/ui/combat_ui_concept_v001.png` so concept, source, and runtime hashes match. Updated `CombatScene` so the raster path shows the full concept art and keeps only transparent hit targets for card and end-turn actions. Removed visible placeholder standees, card art/text/icon overlays, dynamic raster-mode text, and placeholder combat effects from the raster path. Added `CombatScene: "combat_raster_underlay_concept"` to the narrow smoke raster-only exception.
- Prevention: A raster underlay is not enough evidence. For concept-match claims, inspect the full scene child list and screenshot: visible runtime Text/Sprite/Image overlays must not dilute the approved concept unless they are matching-quality raster assets intentionally designed for that screen.

### Problem: Combat smoke screenshot was taken after card play and exposed placeholder effect art

- Cause: `checkReleaseCatalogMode` captures `tmp/phaser-release-catalog-combat.png` after pressing a card. The first corrected pass hid card and standee overlays, but still rendered a temporary combat effect sprite over the concept monster.
- Impact: Even after the main overlay cleanup, the verification screenshot still contained a non-concept effect mark, making the evidence weaker and risking the same "why vector?" complaint.
- Resolution: Combat raster mode now suppresses placeholder combat effect rendering until matching-quality raster effect art exists. The debug state still records the effect for functional tests, and `phaser:smoke` verifies that combat flow still works.
- Prevention: Verification screenshots should be reviewed in the same state that automated smoke captures. If automation clicks before capture, post-click transient effects must meet the same concept-art standard or be hidden from concept-match checkpoints.

### Problem: Boss raster source was correct but runtime overlays still diluted the concept art

- Cause: Boss concept/source/runtime hashes already matched, but `BossScene` still drew dynamic text, card labels, and a visible end-turn rectangle on top of `boss_raster_underlay_concept`.
- Impact: Boss looked closer than the old procedural fallback, but it still repeated the same pattern the user rejected: a high-quality raster concept with code-drawn overlays pasted on top.
- Resolution: Added an underlay-only Boss raster route that renders the concept image and preserves card/end-turn interaction through transparent hit targets only. Added `BossScene: "boss_raster_underlay_concept"` to the scene-specific raster-only smoke exception.
- Prevention: For each rasterized screen, verify not only that the underlay hash is correct, but also that the active scene child list has no visible Text/Sprite/procedural overlay objects unless they are approved matching-quality raster assets.

### Problem: Reward, Event, and Town still treated concept art as a background layer

- Cause: Earlier raster passes preserved functional Phaser text on top of the full-screen concept images. The intent was readability, but visually it still pasted code-drawn UI over the selected concept art.
- Impact: The screens no longer used the old procedural shells, but they still failed the user's comparison standard because the runtime text layer made the concept art look like an underlay rather than the actual UI.
- Resolution: Removed visible raster-path Phaser text from Reward, Event, and Town. Each scene now renders the full raster concept underlay as the visible first-view UI and keeps interaction through transparent hit targets with hover/down feedback. The procedural/text-heavy renderers remain only as fallback when the raster underlay is absent.
- Prevention: A concept-match checkpoint must check `textCount` and visible overlays, not just asset loading. If a raster path is meant to show the concept art, runtime text should be zero unless a later approved safe-zone text pass proves it matches the art quality.

### Problem: Smoke text-layout audit would force text back onto Reward, Event, and Town

- Cause: The smoke text audit historically required visible Phaser text for every scene unless the scene was already registered as raster-only. Reward, Event, and Town were not yet in that exception list.
- Impact: Keeping the test unchanged would either fail the intended textless concept screens or pressure future work to add procedural labels back onto the art just to satisfy the old text-count rule.
- Resolution: Added `RewardScene`, `EventScene`, and `TownScene` to the narrow raster-only smoke exception, tied to `reward_raster_underlay_concept`, `event_raster_underlay_concept`, and `town_raster_underlay_concept`. The exception only applies when the matching underlay image exists and is visible.
- Prevention: Textless exceptions must stay scene-specific and underlay-specific. They are not proof of final UX; they only prevent automated tests from reintroducing the rejected procedural overlay layer during concept-match checkpoints.

### Problem: Raster hover states still drew vector-like rectangles over the concept art

- Cause: Transparent raster hit targets still used the shared `attachPressFeedback` helper. At rest they were invisible, but pointer hover/down changed an invisible rectangle into a visible Phaser stroke or tint.
- Impact: The first-view screenshots looked concept-matched, but actual interaction could still expose the rejected code-drawn overlay style on cards, buttons, map nodes, and settings controls.
- Resolution: Added `renderTransparentHitTarget` for concept-underlay paths and replaced raster hover-frame feedback in Combat, Boss, Reward, Event, Town, WorldMap, Dungeon, RuneBench, Result, and Settings. Smoke now asserts raster hover keeps the canvas stable, while click/state checks still prove the hit targets work.
- Prevention: Concept-match QA must include interaction states, not only idle screenshots. Until matching-quality raster hover/selected art exists, raster concept screens should not draw Phaser rectangle strokes over the underlay.

### Problem: Previous smoke checks encouraged procedural hover feedback on raster screens

- Cause: `assertHoverChangesCanvas` expected a canvas pixel change on hover for several main actions. That was useful for procedural UI but misaligned with the raster concept-art standard.
- Impact: The test would push future changes toward adding visible hover strokes back onto concept art just to make the canvas change.
- Resolution: Replaced those raster checks with `assertHoverKeepsCanvasStable`, which fails if hover visibly alters the canvas above the concept art. Existing click and state assertions remain the functional proof.
- Prevention: Automated tests must reflect the current visual target. For raster-only scenes, hover stability is the correct guard until bespoke raster state art is designed and approved.

### Problem: Raster interaction cleanup removed bad hover feedback but left no final state art

- Cause: The no-vector hover pass intentionally made raster hit-target feedback invisible. That solved the immediate vector-rectangle complaint, but it did not create a concept-quality hover/selected/down state.
- Impact: The UI became visually cleaner, but interaction states were still incomplete. A player could click functional areas without seeing a matching-quality material response.
- Resolution: Added a first Combat bitmap hover state using `ui_hover_gold_seal_concept`, extracted from the approved `ui_component_sheet_concept_v001.png` component sheet. Combat card slots and the visible end-turn button now reveal this raster seal on hover/down through `renderRasterHoverHitTarget`, with no visible Phaser text or rectangle overlay.
- Prevention: Future interaction-state work should use registered bitmap assets derived from concept/source art, then verify `visibleHoverImages` rather than accepting invisible feedback or procedural rectangle effects.

### Problem: Combat raster end-turn hit target still followed the old procedural button coordinate

- Cause: The transparent raster end-turn hit target used the old `1630,708`-style procedural control area rather than the large crossed-swords button visible in the Combat concept art.
- Impact: Hover feedback appeared on the right ledger area instead of the button the user would visually target. This made the raster state feel pasted on rather than aligned to the concept UI.
- Resolution: Moved the Combat raster end-turn hit target and smoke click/hover coordinate to the actual bottom-right button area around `1660,910`, and placed the raster hover seal near that button.
- Prevention: Every transparent hit target added over a raster concept must be checked against the visible concept control, not inherited from the old procedural layout.

### Problem: Boss raster controls had no matching visible interaction-state art

- Cause: The no-vector hover cleanup intentionally removed visible Phaser rectangle feedback from Boss. That avoided the rejected procedural overlay, but left Boss controls without concept-quality visual response.
- Impact: Boss could look clean at rest, but interaction still did not meet the user's concept-art quality target because hover/down state art was missing.
- Resolution: Added `ui_hover_boss_skull_stamp_concept`, extracted as a bitmap from the approved `ui_component_sheet_concept_v001.png` component sheet, registered it in source/runtime manifests and release shared UI assets, and wired Boss card/end-turn controls through `renderRasterHoverHitTarget`.
- Prevention: Raster concept screens need explicit bitmap hover/selected/focus assets. Removing procedural feedback is only a temporary cleanup step, not final interaction-state design.

### Problem: First Boss hover candidate was technically raster but visually too weak

- Cause: The first Boss hover crop came from the lower stamp area of the component sheet and was dark, partial, and too small once placed over the Boss concept screen. The initial placement also treated hover coordinates like top-left values even though Phaser image positions are center-based.
- Impact: Automated checks could pass while the screenshot still looked visually unconvincing, which would repeat the user's complaint that the implementation did not actually match the concept art.
- Resolution: Re-cropped the Boss hover asset from the sharper red skull route-node token in the same approved component sheet, enlarged the card hover state, and corrected Boss card/end-turn hover placement using center coordinates. Targeted Boss screenshots were reviewed after the change.
- Prevention: Interaction-state checkpoints require both object-level audit data (`visibleHoverImages`, no text/rect overlays) and visual comparison screenshots. Passing automation alone is not enough for concept-art quality claims.

### Problem: WorldMap and Dungeon still had invisible raster interaction feedback

- Cause: After the no-vector cleanup, WorldMap and Dungeon used transparent hit targets with no visible hover state. This removed bad rectangle feedback but did not provide concept-quality response for map nodes or progress buttons.
- Impact: The screens remained clean at rest, but interaction still felt unfinished compared with the approved route-node-heavy concept art.
- Resolution: Added `ui_hover_route_node_concept`, extracted from the approved component sheet's `Route Nodes` row, registered it as a shared raster UI asset, and wired WorldMap/Dungeon raster controls through `renderRasterHoverHitTarget`.
- Prevention: Navigation/map screens should use their own route-node material language for interaction states rather than borrowing combat seals or leaving feedback invisible.

### Problem: First route-node hover pass covered important WorldMap concept information

- Cause: The initial WorldMap stage-node hover placed the new route-node texture directly over the selected map node. It was raster and passed object-level checks, but it covered the concept node's number/check mark.
- Impact: The feedback looked like an overlay pasted on top of the concept rather than a state embellishment integrated with it.
- Resolution: Split WorldMap node hover from button hover. Stage nodes now show the route-node texture as a smaller corner badge, while confirm/progress buttons keep centered bitmap feedback. The targeted screenshot was reviewed after repositioning.
- Prevention: Bitmap state art still needs layout review. A matching raster asset can be wrong if it hides baked concept information or changes the intended reading order.

### Problem: Reward and Event choice cards still lacked visible concept-quality hover state

- Cause: Reward and Event had been converted to clean textless raster-underlay screens, but their selectable cards still used transparent hit targets with no final bitmap state art.
- Impact: The screens looked closer to the concept art at rest, but choice interaction remained unfinished and could feel unresponsive compared with the card-heavy concept screens.
- Resolution: Added `ui_hover_choice_badge_concept`, extracted from the approved component sheet's Event Choice Card badge, registered it as a shared raster UI asset, and wired Reward/Event selectable cards through `renderRasterHoverHitTarget`.
- Prevention: Choice-card screens need their own card/tab material state assets. A no-vector invisible hover pass is only a stopgap.

### Problem: First choice-badge hover placement covered art or floated off the card

- Cause: The first Reward placement put the badge over the main card illustration, and the first Event placement floated too high into the diorama area. Both passed automated bitmap checks but were visually weaker than the concept target.
- Impact: The interaction state looked pasted onto the artwork instead of integrated with the card frame, risking the same mismatch the user objected to.
- Resolution: Repositioned and slightly reduced the choice badge so Reward uses the upper card frame and Event uses the top card header area. Re-ran targeted screenshots and click-transition checks after the adjustment.
- Prevention: For every bitmap hover state, inspect screenshots for occlusion and visual anchoring. `visibleHoverImages=1` is necessary but not sufficient for concept-quality comparison.

### Problem: Town, RuneBench, Result, and Settings still had invisible representative hover feedback

- Cause: After the no-vector hover cleanup, these raster concept paths kept interactions functional through transparent hit targets, but their representative action/settings controls did not yet show matching-quality bitmap state art.
- Impact: The screens avoided the rejected Phaser rectangle/vector look, but interaction still felt unfinished and below the concept-art quality target.
- Resolution: Added `ui_hover_action_seal_concept`, extracted from the approved bitmap component sheet, registered it as shared raster UI art, and wired Town, RuneBench, Result, and Settings representative controls through `renderRasterHoverHitTarget`.
- Prevention: After removing procedural hover feedback, each major raster screen needs an explicit bitmap hover-state pass rather than staying invisible indefinitely.

### Problem: Settings representative hover audit is not full Settings state coverage

- Cause: Settings has many controls, while the current action-seal audit checks one representative settings row/control after entering Settings from Town.
- Impact: The audit proves the new raster hover mechanism works on Settings, but it does not prove every volume, display, accessibility, reset, save-reset, and return target has final state art.
- Resolution: Preserved existing smoke-covered Settings behavior and added a representative raster action-seal hover state. Full per-control state coverage remains explicitly unfinished.
- Prevention: Do not treat a representative Settings hover audit as full Settings UX approval. Later Settings work needs a per-control matrix for hover, selected, disabled, focus, persistence, and return behavior.

### Problem: Bitmap hover art can still be visually wrong if it covers baked concept information

- Cause: A state asset can be raster and still fail the concept comparison if it sits on top of important baked labels, icons, card art, or route information.
- Impact: Automation can pass with `visibleHoverImages=1` while the screenshot still looks pasted on or obscures the visual hierarchy.
- Resolution: Reviewed the Town, RuneBench, Result, and Settings action-seal screenshots. The current placements are acceptable as first-pass candidates because they do not introduce Phaser vector overlays or block the main baked concept information.
- Prevention: Every new bitmap state asset needs screenshot review in addition to DOM/object audits. The next passes should keep badges anchored to frames, buttons, tabs, or seals rather than covering illustrations or critical baked UI.

### Problem: Settings raster hover coordinates still followed the old procedural layout

- Cause: The first Settings action-seal pass reused several legacy SettingsScene coordinates. The feedback was a bitmap seal, but some controls were still anchored to the previous code-drawn options layout rather than to the visible sliders, toggles, side panels, and confirmation button in the Settings concept art.
- Impact: The screen could pass the no-vector audit while still feeling wrong under the user's actual comparison standard: the interaction state did not consistently belong to the concept-art controls.
- Resolution: Remapped Settings raster hit targets to the visible concept controls: left-page audio sliders, right-page display/accessibility controls, right-side skull and gear panels, and bottom-right confirmation. Existing settings logic and persistence behavior were preserved.
- Prevention: For concept-underlay screens, hit targets must be placed from the concept art, not inherited from old procedural UI coordinates. Smoke and screenshot evidence should name the visual control each coordinate represents.

### Problem: Settings hover proof was representative-only instead of per-control

- Cause: `tools/phaser-smoke-test.mjs` previously checked only one Settings raster hover coordinate, even though Settings has many smoke-covered controls.
- Impact: A regression could leave some Settings controls with invisible or misaligned feedback while the single representative hover assertion still passed.
- Resolution: Added raster hover assertions for all ten major Settings controls: three audio controls, four display/accessibility/control toggles, settings reset, save reset, and return-to-town. Added a temporary debugless 1920 coverage audit that captures every Settings hover target.
- Prevention: Dense utility screens need per-control interaction-state coverage. A representative audit is acceptable for early proof only, not for continued concept-quality claims.

### Problem: Combat/Boss raster paths had no visible effect feedback after suppressing vector-like placeholders

- Cause: The old effect spritesheets were PNG files, but they were deterministic placeholder art with flat, vector-like slash/splash/spotlight shapes. To avoid violating the concept-art direction, raster Combat/Boss paths had suppressed those effects entirely.
- Impact: The screens avoided bad placeholder overlays, but card impact, mark feedback, and boss phase changes felt unfinished compared with the concept-art target.
- Resolution: Replaced the effect assets with concept-source-derived bitmap spritesheets extracted from approved card/component concept art, then re-enabled `renderCombatFeedbackEffect` on Combat and Boss raster paths as sprite-only overlays.
- Prevention: File format is not enough. Raster UI effects must be checked for visual source/fidelity, not merely for being PNGs. Generated placeholder effects should stay out of concept-underlay paths unless they are replaced or clearly marked as temporary.

### Problem: Concept-derived effects can still look pasted on if crop, mask, or placement is wrong

- Cause: The first `effect_ink_splash` crop included card-frame edges and unrelated baked UI fragments. The first attempts were technically bitmap assets, but screenshot review showed they would look like mis-cropped art rather than intentional state feedback.
- Impact: Automated object checks could have passed while the user-facing screen still failed the concept comparison standard.
- Resolution: Iterated the crop/mask until the visible artifact was reduced to a standalone purple bitmap component. Added `tmp/raster-effect-concept-audit.mjs` to verify effect sprite presence, no Phaser text, and no visible rectangles on raster effect screenshots.
- Prevention: Every effect extraction needs both source review and in-scene screenshot review. `visibleEffectSprites=1` proves wiring only; it does not prove final art quality.

### Problem: Boss stage feedback used the wrong concept source even though it was raster

- Cause: The first `effect_stage_spotlight` replacement was extracted from `card_art_fold_guard`. It was a real bitmap spritesheet, but the visible motif was shield/card-fragment art, not a boss phase or theatrical spotlight cue.
- Impact: The Boss screen could pass the no-vector object audit while still failing the user's actual comparison standard: it did not look like the approved Boss/UI concept language and appeared pasted near the lower combat area.
- Resolution: Re-sourced `effect_stage_spotlight` from the Special card starburst in `assets/concepts/ui/ui_component_sheet_concept_v001.png`, regenerated slice/release spritesheets, and moved Boss placement to the boss body/phase focal area.
- Prevention: Raster replacement work must check semantic source fit, not only file type. A bitmap from the wrong concept area should stay candidate-level until screenshot review confirms it belongs on that screen.

### Problem: New stage spotlight crop initially produced a circular card-fragment token

- Cause: The first Special-card crop retained too much card frame, parchment, and circular masked background. It was concept-derived but still looked like a cut-out token rather than a starburst effect.
- Impact: It risked repeating the same mismatch: technically raster but visually wrong in scene.
- Resolution: Iterated crop coordinates and tightened the alpha mask so the final sheet keeps warm gold starburst strokes and removes the round background/card-frame strip.
- Prevention: Effect source extraction should include at least one direct spritesheet inspection before browser screenshot tests. If the sheet itself looks like a UI fragment, do not rely on in-scene blending to hide it.

### Problem: Raster hit target down state reused hover art instead of its own concept state

- Cause: `renderRasterHoverHitTarget` used the hover bitmap for both hover and pointer-down states, changing only alpha. That avoided Phaser rectangles, but it did not provide a distinct concept-art-quality pressed state.
- Impact: The screen could pass hover no-vector checks while the actual click moment still felt weak, ambiguous, or unverified against the component-sheet state language.
- Resolution: Added `ui_down_pressed_stamp_concept`, a darkened wax-stamp bitmap extracted from the approved component sheet, and changed raster hit targets to show this separate image while the pointer is held down.
- Prevention: Hover and pressed/down states need separate visual evidence. A shared texture plus alpha change is not enough for continued concept-quality claims unless screenshot review proves it reads as an intentional state.

### Problem: Pointer-down actions made pressed-state screenshots impossible

- Cause: Raster hit targets fired gameplay actions on `pointerdown`, so holding the pointer on a control could immediately transition scenes or mutate combat before the pressed state could be observed.
- Impact: Down-state proof was indirect; tests could click controls successfully without ever proving a visible pressed state existed in the original scene.
- Resolution: `renderRasterHoverHitTarget` now shows the down image on `pointerdown` and fires the action on `pointerup`. Smoke and the down audit hold the pointer down, capture/inspect the pressed image, then move outside before releasing when they only need visual proof.
- Prevention: Interaction-state tests should distinguish visual-state capture from action execution. Pressed-state audits should not rely on click completion as visual evidence.

### Problem: Event disabled choices were functional but visually absent on the raster concept screen

- Cause: `EventScene` used a transparent inert hit target for unaffordable raster choices. That preserved behavior, but it did not add any concept-art-quality disabled state.
- Impact: The Event UI could look like a baked concept mockup with no clear disabled/locked feedback, and it did not answer the user's objection that state art must come from the concept language rather than invisible or vector-like overlays.
- Resolution: Added `ui_disabled_lock_stamp_concept`, extracted from the approved component sheet's Rune Socket lock, registered it as shared raster UI art, and introduced `renderRasterDisabledHitTarget` so Event unaffordable choices show a bitmap lock while remaining non-interactive.
- Prevention: Disabled-state work must have visible bitmap evidence, not only a disabled click result. Future disabled audits should verify visible raster state art and inert behavior together.

### Problem: Choice state badges were horizontally offset from the baked card badge axis

- Cause: The first Reward/Event choice hover placements used `x + 64` or `x + 72` offsets inherited from early positioning passes. The bitmap state assets were visible, but they drifted off the card header badge area in screenshots.
- Impact: Automated checks passed because the assets were PNG images and no vector overlays were visible, but the placement looked pasted on and weaker than the concept art comparison target.
- Resolution: Recentered Reward choice hover badges to the card header axis and applied an Event-specific `x - 32` badge-axis correction for hover/down/disabled state art. Re-ran smoke and a 1920 disabled audit after screenshot review.
- Prevention: State art placement must be compared against the baked concept control, not just against the clickable hit target. Passing `visibleHoverImages=1` or `visibleLockImages=1` is necessary but not sufficient.

### Problem: WorldMap had a hidden center confirm target that did not match the concept art

- Cause: The raster WorldMap retained an old confirm hit target at `1010,512`, a coordinate from the previous procedural layout. On the concept underlay, that point sits in the map illustration rather than on the visible play button.
- Impact: Hover feedback appeared as route-node art in the middle of the map, and clicking the map center advanced to Dungeon. This contradicted the concept screen, where the obvious primary action is the bottom-right play button.
- Resolution: Removed the center confirm target, first kept confirm on the bottom-right play button at `1512,950`, changed that button's hover art to `ui_hover_action_seal_concept`, and updated smoke/audits to verify the visible play button instead of the hidden center coordinate. The next WorldMap problem entry supersedes the shared-seal state art with button-specific textures.
- Prevention: Concept-underlay hit targets must be placed from the visible control in the concept art. Legacy procedural coordinates should be treated as suspicious until screenshot review proves they still align.

### Problem: WorldMap play button state art still looked pasted on after moving the hit target

- Cause: The previous WorldMap correction moved the primary action to the visible bottom-right button, but it reused the shared action seal and shared pressed stamp. Those were bitmap assets, but their wax-stamp shape did not match the teal play button drawn in the WorldMap concept art.
- Impact: The UI could pass the no-vector audit while still failing the user's actual comparison standard: the state feedback looked like a generic overlay pasted onto the concept instead of the concept button responding.
- Resolution: Added `ui_hover_world_map_play_button_concept` and `ui_down_world_map_play_button_concept`, both cropped from `assets/source/ui/world_map_raster_underlay_concept_v001.png`, then wired the WorldMap play button at `1576,970` to those button-specific textures. The no-underlay fallback button coordinate was also moved to the same bottom-right action area.
- Prevention: Raster state art must match the specific control when a clear control exists in the concept. Shared stamps remain candidate-level only; screenshot review should compare semantic fit, source fit, and placement fit, not just file type.

### Problem: WorldMap current stage was still visually fixed by the static concept underlay

- Cause: The WorldMap raster underlay bakes a bright stage-4 glow/path into the image, while the actual runtime `context.run.stageId` can be a different stage such as `stage_lantern_foyer`.
- Impact: The screen looked like high-quality concept art, but it could still communicate the wrong selected/current stage. That undermines the concept-quality target because polish without state truth is misleading UI.
- Resolution: Added `ui_current_stage_marker_concept`, extracted from the WorldMap underlay's cyan diamond marker, and rendered it above the node that matches `context.run.stageId`. The dedicated audit now verifies `visibleCurrentMarkerImages=1` and `markerAtCurrentStage=true`.
- Prevention: Static raster underlays need runtime-state overlays or recomposed variants for stateful screens. A beautiful baked underlay is not enough when the underlying game state changes.

### Problem: WorldMap baked progress colors still overpowered the runtime current marker

- Cause: The static WorldMap concept underlay carried saturated green completed check marks and cyan current/path colors in the map region. After adding the runtime current-stage marker, those baked colors still read as stronger state information than the real current stage.
- Impact: The screen used raster concept art, but the state language remained misleading. The user-facing result could still look wrong because the old baked progress state visually competed with the runtime marker.
- Resolution: Added a `world_map_neutral_underlay` extraction branch that regenerates `world_map_raster_underlay_concept_v001.png` from `assets/concepts/ui/world_map_ui_concept_v001.png` and mutes the baked green/cyan progress samples toward neutral parchment/map colors. After screenshot review still showed too much gray stage-4 glow silhouette, the extraction pass was strengthened to reduce bright glow remnants as well as color dominance. The play-button hover/down and current-stage marker extractions now source from the original concept image so those state assets keep their intended saturation.
- Prevention: Stateful concept underlays need either neutral runtime-ready versions or full per-state recomposition. A marker overlay alone is not enough if baked state colors remain stronger than runtime state. Audits should sample known baked-state pixels in addition to verifying overlay visibility.

### Problem: WorldMap current marker was too small to overcome remaining baked state geometry

- Cause: After neutralizing the static underlay, the actual current stage had only a small diamond marker while the baked map still retained faint completed-check and stage-4 node/glow shapes.
- Impact: The runtime state was technically correct, but the visual hierarchy still risked looking wrong when compared against the concept art: old baked state geometry could compete with the real current stage.
- Resolution: Added `ui_current_stage_halo_concept`, extracted from the original WorldMap concept's cyan current-node glow. The extraction removes the baked `4` node plate and parchment fragments, then `WorldMapScene` renders the halo and diamond marker together at the node matching `context.run.stageId`. The underlay extraction also gained a stronger small-symbol cover pass for completed-check samples and the old stage-4 marker sample area.
- Prevention: On stateful concept-underlay screens, correct state needs both a neutralized background and strong runtime state art at the real target. A tiny marker is not enough when the baked underlay still contains readable old-state geometry.

### Problem: WorldMap current node still read partially completed because the lower baked check remained

- Cause: The static WorldMap underlay retained completed-check badge geometry in the lower part of the first nodes. The marker and halo fixed the top/current emphasis but did not fully cover the lower completed-state read.
- Impact: The runtime current stage could still look like a completed stage in screenshot comparison, even though the actual `context.run.stageId` was `stage_lantern_foyer`.
- Resolution: Added `ui_current_stage_status_badge_concept`, cropped from the original WorldMap concept's gold current-status diamond/check area. `WorldMapScene` renders it on the lower area of the current node, and the dedicated audit now verifies `visibleCurrentStatusImages=1` and `statusAtCurrentStage=true`.
- Prevention: Stateful concept-underlay screens need a full state-read stack or recomposed variants. For WorldMap, the minimum current-node stack is now top marker plus halo plus lower status badge; a single marker is not enough when baked completed/current geometry remains.

### Problem: WorldMap completed and locked states were not runtime-driven

- Cause: The raster WorldMap had runtime current-state art, but completed and locked reads still came mostly from the static concept underlay. Completed nodes did not receive a runtime completed badge, and locked nodes did not have a verified runtime lock overlay tied to `profile.unlockedStages`/`profile.completedStages`.
- Impact: The map could still look polished while communicating stale progress. A saved run with different stage progress could disagree with the baked concept art, especially after the underlay was neutralized for current-state work.
- Resolution: Added `ui_completed_stage_badge_concept` and `ui_locked_stage_badge_concept`, both extracted from `assets/concepts/ui/world_map_ui_concept_v001.png`, registered them in the slice manifests and release shared UI raster bundle, and copied them through `tools/generate-dev-runtime-assets.mjs`. `WorldMapScene` now renders completed badges for completed non-current stages and locked badges for locked stages, while current stages keep precedence. The dedicated WorldMap audit now seeds `stage_sunny_gate` as completed and `stage_lavender_hall` as current, then verifies `visibleCompletedBadges=1`, `visibleLockedBadges=13`, and no completed/locked badge on the current stage.
- Prevention: Future WorldMap state work should test at least one mixed progress save, not just the default first-stage state. Static concept underlays need runtime-state audits for every state family they visually imply.

### Problem: WorldMap first locked-state overlay overused red lock badges

- Cause: The first completed/locked runtime pass treated every locked stage as a red-lock stage. That made stages 3-9 read like red stickers even though the original WorldMap concept reserves red lock badges for the later upper chapter nodes and uses subtler gray sealed states through the lower/mid path.
- Impact: The implementation was more state-complete but less faithful to the concept art. It repeated the risk of optimizing for an audit count instead of the user's visual target.
- Resolution: Added `ui_sealed_stage_badge_concept`, extracted from the original concept's gray sealed diamond, and changed `WorldMapScene` so locked stages before the upper chapter row use gray seal badges while later chapter nodes use red lock badges. The dedicated WorldMap audit now verifies `visibleLockedBadges=6` and `visibleSealedBadges=7` separately for the seeded release state.
- Prevention: State audits should encode the concept's visual taxonomy, not just the data taxonomy. `locked` can map to different visual families depending on stage position and concept language.

### Problem: WorldMap lower node bodies still baked completed/current color into the runtime underlay

- Cause: Earlier neutralization focused on completed check marks, the stage-4 diamond, and lock badges. The node bodies for stages 1-3 still retained strong teal completed-state color, and the stage-4 plate still retained current-state blue/cyan color.
- Impact: Even with runtime completed/current/locked/sealed badges, the underlying node bodies could still imply the old static concept progress state. This made the map more polished than truthful and weakened the user's requested concept-quality alignment.
- Resolution: Extended the `world_map_neutral_underlay` extraction pass with body-color regions for the lower stage-1/2/3 nodes and the stage-4 current plate. The pass reduces state-color dominance while preserving the node numbers and metal frame language. The dedicated WorldMap audit now samples `node1body`, `node2body`, `node3body`, and `stage4body` in addition to the older check/diamond/lock samples.
- Prevention: Stateful raster underlays need both symbol-level and body-level samples. Verifying only badges/check marks is not enough when the node plate itself carries state color.

### Problem: WorldMap stage-4 route still had a cyan dotted progress remnant

- Cause: Earlier route neutralization covered the lower 1-4 path and the stage-4 node plate, but a vertical dotted cyan segment around source coordinate `940,503` remained. This segment came from the original concept's bright current-route path.
- Impact: In a runtime state where stage 2 is current and stage 3 is locked/sealed, the leftover cyan dots still visually pointed back to the old baked stage-4 progress state.
- Resolution: Added a narrow route segment mask to the `world_map_neutral_underlay` extraction. It removes cyan dominance from the dotted path while preserving the gray route body. The dedicated audit now samples `stage4routeDots`, which reports neutral warm values instead of cyan dominance.
- Prevention: Route-line state checks need their own samples. Node/body checks can pass while route geometry still communicates stale progress.

### Problem: WorldMap stage-5 still read like an unlocked blue node in the progressed state

- Cause: The earlier neutralized-underlay pass stopped before the stage-5 node and the 4-to-5 route. In a progressed save with stages 1-3 completed and stage 4 current, stage 5 should read as sealed, but the static concept underlay still carried a strong blue node body and route tint.
- Impact: The new completed/current/sealed overlays could pass object-count audits while the screenshot still implied stale progress beyond the real current stage.
- Resolution: Extended the `world_map_neutral_underlay` extraction to include the stage-5 node body and the 4-to-5 route segment. The dedicated audit now samples `stage5body` and `stage5route` in addition to the earlier stage-4 route sample.
- Prevention: WorldMap state audits should include at least one progressed save beyond the first unlock. `tmp/ui-worldmap-action-hit-target-audit.mjs` now captures `tmp/ui-quality/worldmap/worldmap-progress-current-stage4-v1-1920.png` and verifies stages 1-3 completed, `stage_peach_canal` current, five gray seals, six red locks, and no completed/locked/sealed badge on the current node.

### Problem: WorldMap upper red-lock badges were visibly lower than the source concept

- Cause: The first red-lock placement used a generic node-relative formula. That formula worked acceptably for the large right-side boss nodes, but it placed stages 10 and 11 noticeably below the source concept's red lock centers.
- Impact: The red-lock overlay was technically runtime-driven, but the upper chapter row looked like pasted stickers rather than part of the illustrated node assemblies. This was a concept-quality mismatch, not a data-state bug.
- Resolution: Added source-aligned red-lock placements for stages 10-15 in `WorldMapScene`, using the original concept's lock centers scaled to the 1920x1080 runtime canvas. The dedicated audit now verifies red-lock position, display size, and alpha rather than only the badge count.
- Prevention: Concept-derived overlays should keep source-aligned anchors when the concept provides a clear state-art location. Generic node-relative formulas are only a fallback.

### Problem: WorldMap late-progress completed badges were too large on mid-route nodes

- Cause: The completed badge used one size and one lower-node anchor for every stage. That matched the original stage-1/2/3 completed checks, but in a late save it made stages 4-8 look noisy and route-covering.
- Impact: A late progression map could pass count/position audits while still feeling visually heavy and less like the source concept. The runtime state was true, but the overlay density was not yet tuned to the node family.
- Resolution: Split completed-badge placement by stage family. Stages 1-3 keep the larger original-style check, while later completed nodes use a smaller, slightly quieter check. The late-state audit now captures `tmp/ui-quality/worldmap/worldmap-progress-current-stage9-v1-1920.png` and verifies completed-badge position, size, and alpha.
- Prevention: WorldMap audits should include late progression states, not only early progression. State overlay size should be checked as well as object count.

### Problem: WorldMap lower/mid gray-seal overlays were too dense after the red-lock split

- Cause: After red locks were reserved for stages 10-15, every locked lower/mid stage still received a small gray seal overlay. That made stages 3-9 or 5-9 read like a row of audit markers, even though the concept already communicates inactive lower/mid nodes through gray node bodies.
- Impact: The map state was technically correct but visually noisier than the source concept. This risked replacing the old red-sticker problem with a subtler gray-sticker problem.
- Resolution: `WorldMapScene` now renders the gray seal overlay only on the next lower/mid locked node. Later lower/mid locked nodes rely on the neutralized gray node art instead of additional seal markers. The dedicated audit now expects one sealed badge in the early and stage-4-progress cases and zero sealed badges in the late stage-9 current case, and it verifies the one seal's size and alpha.
- Prevention: State audits must not only count all possible data-state markers. For concept-matched UI, they should encode visual hierarchy: next blocked stage gets explicit emphasis, non-next blocked stages can be quieter if the underlay already carries the inactive material language.

### Problem: WorldMap stage-node hover looked like a detached UI token

- Cause: WorldMap stage-node hover reused the shared component-sheet route token and positioned it at `x + 72, y - 62`. In screenshot review it appeared as a separate gold ring/teal token near the node rather than as the illustrated map node responding. The `ui_current_stage_halo_concept` asset also still contained the top diamond marker and lower route-dot fragments, so reusing it directly would have carried stale state pieces into hover.
- Impact: The screen could pass raster/no-vector checks while still failing the user's concept-art standard because hover feedback felt pasted on. It also blurred the distinction between current, selected, and hover state.
- Resolution: The `current_halo` extraction now masks out the top marker and lower route-dot fragments, leaving only the cyan concept glow arcs. `renderRasterHoverHitTarget` gained optional hover/down blend modes, and `WorldMapScene` now uses the cleaned `ui_current_stage_halo_concept` with additive blending for stage-node hover/down. Dungeon keeps the shared `ui_hover_route_node_concept`.
- Prevention: Hover-state audits must include screenshot review and semantic fit checks, not just "a bitmap became visible." `tmp/route-node-raster-hover-state-audit.mjs` now seeds WorldMap to a stage-2 progress state and hovers completed stage 1, so node hover is verified independently from the current-stage marker.

### Problem: WorldMap raster mode had no keyboard stage-selection path

- Cause: `ArrowUp/Down/Left/Right` were already defined input actions, but `WorldMapScene` routed every action through the generic scene action handler. The generic handler ignores movement actions, so keyboard users could confirm the current stage but could not select another unlocked map node.
- Impact: The visual UI had click hit targets and first-pass raster hover, but selected/focus/keyboard state remained unfinished. This contradicted the documented UI quality goal and left keyboard interaction behind pointer interaction.
- Resolution: `WorldMapScene` now handles directional actions in raster mode before falling back to the generic handler. The resolver uses the concept node coordinates to pick the nearest unlocked stage in the pressed direction, then calls the existing `selectWorldMapStage`/save persistence path so the runtime current marker, halo, and status badge move to the selected node. `tmp/ui-worldmap-action-hit-target-audit.mjs` now verifies `ArrowLeft` from stage 2 selects stage 1 and captures `worldmap-keyboard-stage-select-v1-1920.png`.
- Prevention: Keyboard/focus work should reuse existing gameplay selection paths and concept-derived state art rather than inventing a separate procedural focus ring. Audits should prove both the state transition and the raster-only visual result.

### Problem: Keyboard-selected WorldMap states exposed remaining lower baked completed-check silhouettes

- Cause: The neutralized underlay had reduced the green/cyan state color, but the lower check-badge shapes for stages 1-3 still remained visible enough to read as completed in some selected states.
- Impact: After keyboard selection moved current focus back to stage 1, stage 2 could still look partly completed from the baked underlay even though the runtime completed data did not mark it completed.
- Resolution: `tools/extract-ui-state-assets.mjs` now applies an additional neutral patch over the lower 1-3 baked check areas so runtime completed/current badges carry more of the state read. The latest WorldMap audit samples those old check areas as `node1check=[97,85,69]`, `node2check=[95,84,69]`, and `node3check=[99,87,71]`, with no green/cyan completed-state dominance.
- Prevention: Pixel dominance samples are not enough when the silhouette itself remains readable. Future WorldMap recomposition should include shape-level screenshot review for non-current/non-completed lower nodes.

### Problem: Late WorldMap completed badges looked like route-floating markers on mid nodes

- Cause: After reducing late completed-badge size, stages 6-8 still used one generic node-relative placement. In the late-progress screenshot, stage 6 and 7 badges sat closer to the route than to the illustrated node bases, and stage 8 is effectively a weak route checkpoint rather than a fully visible numbered concept node.
- Impact: The audit count was correct, but the visual read still felt pasted on in the mid-route area. This repeated the same failure mode where a runtime state marker is technically present but not integrated into the concept illustration.
- Resolution: `WorldMapScene` now uses mid-route completed-badge placement overrides. Stage 6 and 7 badges are moved closer to their node-base material, and stage 8 uses a smaller, quieter completed marker. The dedicated WorldMap audit verifies the new positions/sizes/alpha, and the late-progress crop shows less route-floating weight.
- Prevention: Late progression needs screenshot review in addition to count checks. When the concept does not expose a full numbered node, the runtime marker should be quieter or the node should be properly recomposed later rather than using the same badge treatment everywhere.

### Problem: Reward/Event choice pressed state used a generic stamp instead of the choice badge language

- Cause: Reward and Event raster choices used `ui_hover_choice_badge_concept` for hover, but their down state fell back to the shared `ui_down_pressed_stamp_concept`. That meant one control changed visual language between hover and press.
- Impact: In the pressed screenshot, the selection looked like a separate brown stamp pasted over the card instead of the card header badge responding. This was technically raster, but weaker than the concept-matched state-art standard.
- Resolution: Reward and Event choice hit targets now set `downKey` to `ui_hover_choice_badge_concept` and use a slightly larger pressed size on the same badge axis. The down audit now expects the choice-badge key for those two screens, and hover audit still verifies the existing choice-badge hover path.
- Prevention: Control families should share state language across hover/down/disabled when a control-specific concept asset exists. The shared pressed stamp should remain a fallback, not the default for controls with a better local state asset.

### Problem: Remaining audited raster pressed states still used the shared fallback stamp

- Cause: Town, Dungeon, Combat, RuneBench, Boss, Result, and Settings already had concept-derived hover bitmap families, but several pressed/down states still inherited `ui_down_pressed_stamp_concept` from the shared raster hit-target helper.
- Impact: The pressed screenshots could pass the raster/no-vector audit while still looking like a generic stamp had been placed over unrelated controls. This was especially visible on combat, boss, route, and utility controls where the hover language already had a better local visual family.
- Resolution: The audited pressed/down targets now set explicit `downKey` values from their existing concept bitmap families. Combat uses `ui_hover_gold_seal_concept`, Boss uses `ui_hover_boss_skull_stamp_concept`, Dungeon uses `ui_hover_route_node_concept`, and Town/RuneBench/Result/Settings use `ui_hover_action_seal_concept`. The 10-screen down audit now expects those keys and still verifies exactly one visible down image, no text, and no visible rectangles above each concept underlay.
- Prevention: Shared `ui_down_pressed_stamp_concept` should be treated as fallback state art only. When a screen/control family already has a concept-derived hover asset, down state should either reuse that local family intentionally or get a more specific concept-derived pressed asset after screenshot review.

### Problem: Settings return-to-town feedback was anchored above the visible concept button

- Cause: Settings raster mode used the old `1570,890` return hit target. That coordinate overlapped the lower-right area, but the visible concept control is the red check button lower and farther right.
- Impact: The Settings per-control pressed audit passed object-level checks, but screenshot review showed the action-seal feedback floating on the dark area above the button. This repeated the core risk: technically raster state art can still fail if it is not anchored to the visible concept control.
- Resolution: The return-to-town hit target moved to the visible bottom-right red check button, with a return-specific action-seal anchor. The Settings hover coverage audit, new Settings pressed coverage audit, and broad 10-screen down audit were updated and rerun.
- Prevention: Dense concept screens need per-control screenshot review, not only representative checks. Any control whose feedback is tied to a large button, side panel, or tab should have its own tested coordinate instead of inheriting the generic placement formula.

### Problem: Settings return button still used shared action-seal feedback after re-anchoring

- Cause: The previous fix put the feedback on the correct button, but it still used the shared `ui_hover_action_seal_concept` family. That was better than a floating stamp, yet still weaker than the WorldMap play button standard where the concept button itself responds.
- Impact: Settings could pass per-control hover/pressed audits while still looking less integrated than the concept art because the bottom-right red check button had an unrelated stamp on top rather than a button-specific state.
- Resolution: Added `ui_hover_settings_return_button_concept` and `ui_down_settings_return_button_concept`, extracted from the Settings concept underlay. The first crop used runtime coordinates against the smaller source image and captured the wrong dark area; screenshot/source inspection caught it before in-game use. A corrected source-space crop and check-center alignment now make the button itself brighten/darken for hover/down.
- Prevention: Button-specific assets must be checked at three levels: source crop, in-scene hover screenshot, and in-scene down screenshot. Runtime coordinates must be converted to the source image's native resolution before extracting from concept underlays.

### Problem: Settings reset panels still used the shared action-seal feedback

- Cause: After the return/check button-specific pass, the two right-side Settings reset controls still used `ui_hover_action_seal_concept` for hover/down. The skull save-reset card and gear defaults-reset card were visually clear concept panels, so a shared seal remained a weaker, pasted-on response.
- Impact: Settings per-control audits could pass while the reset controls still failed the stricter concept-state standard. The user-facing screen looked less integrated because the visible panel itself did not respond.
- Resolution: Added `ui_hover_settings_reset_save_concept`, `ui_down_settings_reset_save_concept`, `ui_hover_settings_reset_defaults_concept`, and `ui_down_settings_reset_defaults_concept`, all extracted from `settings_raster_underlay_concept_v001.png`. `SettingsScene` now maps reset-save and reset-defaults to their own panel-specific hover/down art. Settings hover/pressed coverage audits now expect those keys, and the 10-screen down audit still passes.
- Prevention: When a concept screen has a visible button or side-card control, prefer a source-cropped state for that control before using a shared action seal. Preview the source asset first, then inspect in-scene hover and down screenshots so background book/page material does not become the primary feedback shape.

### Problem: Phaser smoke expected the obsolete shared pressed-stamp default

- Cause: `tools/phaser-smoke-test.mjs` still defaulted down-state assertions to `ui_down_pressed_stamp_concept`, even though the documented raster pressed-state pass had moved audited controls to control-family bitmap keys.
- Impact: The broad smoke failed at `town-action-button` even though the current down-state standard is now `ui_hover_action_seal_concept` for that control family. This made smoke disagree with the current UI rubric and dedicated down audit.
- Resolution: Changed `assertHoverUsesRasterImageOnly` so omitted down-key expectations default to the expected hover key. WorldMap and Settings controls with bespoke down art still pass explicit down keys.
- Prevention: Shared helper defaults must follow the current UI-state standard. If a state-art migration changes the visual family, update broad smoke helpers as well as dedicated audit scripts.

### Problem: Settings sliders and toggles still used the shared action-seal feedback

- Cause: The Settings return and reset panels had moved to concept-underlay-specific state art, but the three volume sliders, display-mode selector, large-text toggle, reduced-motion toggle, and space-confirm toggle still used the broad action-seal family.
- Impact: The Settings screen could pass interaction audits while most of its main controls still responded with an unrelated pasted-on seal instead of the actual row/control brightening or darkening. This weakened concept-match quality on the screen with the most dense control surface.
- Resolution: Added fourteen Settings row/control-specific assets: hover/down pairs for volume-master, volume-music, volume-sfx, display-mode, large-text, reduced-motion, and space-confirm. `SettingsScene` now maps those seven controls to their own hover/down art, and the Settings hover/pressed coverage audits expect the new keys. The 10-screen down audit and `npm.cmd run check` still pass.
- Prevention: For dense concept-raster screens, finish the full audited control set before treating a shared state family as acceptable. Each control should have source preview, in-scene hover screenshot, and in-scene pressed screenshot evidence before the audit expectation is changed.

### Problem: Town/RuneBench/Result representative utility controls still used the shared action seal

- Cause: After Settings moved to screen-specific state art, the audited Town, RuneBench, and Result utility targets still reused `ui_hover_action_seal_concept` for both hover and down states. The 10-screen hover audit checked for no text/vector overlays, but it did not verify the exact raster key.
- Impact: Those screens could keep passing the broad raster audits while still showing a pasted-on generic seal instead of the visible concept control responding. This made the remaining utility surfaces look less integrated than the Settings pass.
- Resolution: Added screen-underlay-derived hover/down pairs for the Town expedition arrow, RuneBench action rail, and Result action card. RuneBench's lower confirm button and Result's lower return button also received first-pass button-specific hover/down assets. `TownScene`, `RuneBenchScene`, and `ResultScene` now map the representative targets to those keys, `tools/phaser-smoke-test.mjs` expects the new keys, and `tmp/ui-raster-hover-audit.mjs` now verifies the expected hover key for every audited scene.
- Prevention: Broad hover audits must verify exact texture keys, not only absence of vector/text overlays. Any representative control still using a shared state family should remain in the open scope until it has source crop, in-scene hover screenshot, and in-scene down screenshot evidence.

### Problem: Town lower toolbar controls still used generic or mis-anchored state feedback

- Cause: Town raster mode preserved legacy reset/settings coordinates for smoke-covered flows and added lower toolbar affordances, but the lower affordances still inherited the broad action-seal fallback. Crop review also showed the settings lower hit target sat near the scroll tile rather than the visible gear tile.
- Impact: The Town screen could technically respond to input while still failing the concept-state standard: the visible toolbar controls did not brighten/darken as their own material, and central legacy hover feedback risked putting a shared seal over ambiguous town buildings/background material.
- Resolution: Added `ui_hover_town_toolbar_reset_concept`, `ui_down_town_toolbar_reset_concept`, `ui_hover_town_toolbar_settings_concept`, and `ui_down_town_toolbar_settings_concept`, all cropped from `town_raster_underlay_concept_v001.png`. `TownScene` now anchors the lower reset/backpack target at `514,976` and the lower settings/gear target at `1340,976`. The central legacy reset/settings coordinates keep their click behavior but no longer show shared action-seal hover/down art.
- Prevention: Do source-crop review before turning a hit target into state art. If a coordinate does not map to a clear visible control, preserve behavior separately and document the UX debt instead of inventing a state surface from background art.

### Problem: RuneBench and Result lower button state art lacked dedicated evidence

- Cause: RuneBench's lower confirm button and Result's lower return button had button-specific hover/down assets wired, but the broad 10-screen audits only checked the representative legacy/action coordinates. The lower visible buttons therefore had no dedicated screenshot/audit proof.
- Impact: The UI could appear more complete than the evidence supported. A button-specific asset can still be misaligned, oversized, or masked poorly even if the representative scene audit passes.
- Resolution: Added `tmp/runebench-result-lower-button-state-audit.mjs` to verify RuneBench lower confirm and Result lower return hover/down states directly. The audit checks exact texture keys, absence of the shared action seal, absence of Phaser text, and absence of visible rectangles above the raster underlay. Focused screenshot crops confirmed both buttons brighten/darken on their own concept button surfaces.
- Prevention: Any first-pass secondary button state should receive its own hover/down screenshot evidence before it is treated as a covered utility target.

### Problem: Keyboard confirm had no visible raster material feedback on utility screens

- Cause: Town, RuneBench, and Result had pointer hover/down raster state art, but their keyboard `confirm` path used `bindKeyboardActions` to run the scene action immediately. That meant Enter/Space could advance the scene without ever showing the same material response.
- Impact: Keyboard users had weaker feedback than pointer users, and the selected/focus scope could be overstated because the UI had state art but not keyboard-triggered state evidence.
- Resolution: `renderRasterHoverHitTarget` now stores its existing down/idle callbacks on the hit target, and `triggerRasterHitTargetDown` can briefly show that down bitmap before completing the action. Town, RuneBench, and Result use this for keyboard confirm on their current primary raster confirm targets. `tmp/keyboard-confirm-raster-state-audit.mjs` verifies exact down keys, no text, no visible rectangles, and continued scene flow.
- Prevention: Keyboard focus work should reuse existing concept-raster state art where possible and include a screenshot/audit that proves the keyboard path, not only pointer hover/down.

### Problem: Reward/Event/Dungeon keyboard confirm skipped the local raster material response

- Cause: Reward and Event choice cards had concept-derived pointer hover/down feedback, and Dungeon's confirm route node had concept-derived pointer hover/down feedback, but Enter/confirm still called the scene action directly. Those keyboard paths could therefore advance without showing the same local material state that pointer input showed.
- Impact: The user-facing keyboard path looked less integrated than the pointer path, and the selected/focus scope still had missing evidence on three raster confirm screens even though their pointer state art was already aligned.
- Resolution: `RewardScene` now exposes the first reward-card raster hit target for keyboard confirm, `EventScene` exposes the first affordable event-choice raster hit target, and `DungeonScene` exposes its primary raster confirm hit target. They use `triggerRasterHitTargetDown` to show the existing `ui_hover_choice_badge_concept` or `ui_hover_route_node_concept` pressed state before running the unchanged confirm behavior. `tmp/keyboard-confirm-raster-state-audit.mjs` now verifies Reward, Event, and Dungeon alongside Town, RuneBench, and Result.
- Prevention: Any scene where `confirm` maps to a visible card, choice, route node, or button should route keyboard activation through that control's existing raster hit-target state before advancing. Reuse the local concept bitmap family first; do not add a generic focus ring or stamp unless no clear concept control exists.

### Problem: Combat/Boss keyboard actions skipped card and end-turn material response

- Cause: Combat and Boss raster card/end-turn controls already had pointer hover/down bitmap feedback, but `Digit1` and `KeyE` keyboard actions still called `handleSceneAction` directly. The action could happen without showing the same local control material response.
- Impact: Keyboard play felt less grounded than pointer play on the two main combat screens, and existing hover/down screenshots could be mistaken for keyboard feedback evidence even though they only proved pointer paths.
- Resolution: `CombatScene` and `BossScene` now keep references to their raster card and end-turn hit targets, then route keyboard card/end-turn actions through `triggerRasterHitTargetDown` before running the unchanged action. `tmp/combat-boss-keyboard-action-raster-state-audit.mjs` verifies `Digit1` and `KeyE` on both screens with exact local raster keys, no text, and no visible rectangle overlays.
- Prevention: Keyboard audits for action-heavy scenes should cover the actual gameplay keys, not only Enter/Space confirm. Reuse each visible control's existing raster hit-target callbacks so pointer and keyboard state language stays matched.

### Problem: Settings Escape/cancel skipped the return-button material response

- Cause: Settings raster mode had button-specific hover/down art for the return/check button, but its only existing keyboard action, `Escape`/cancel, went straight to `TownScene`.
- Impact: Keyboard users could leave Settings without seeing the same return-button material response that pointer users saw. This left Settings out of the first keyboard-material feedback pass.
- Resolution: `SettingsScene` now keeps the return/check raster hit target and routes `Escape`/cancel through `triggerRasterHitTargetDown` before the unchanged Town transition. `tmp/settings-keyboard-cancel-raster-state-audit.mjs` verifies the `ui_down_settings_return_button_concept` frame, no Phaser text, no visible rectangle overlays, and the return to Town.
- Prevention: When a scene has only cancel/back keyboard behavior, audit that behavior directly instead of adding a new confirm action. Keyboard feedback should reuse the visible concept control that already owns the pointer state art.

### Problem: Settings controls had pointer state art but no keyboard focus path

- Cause: Settings had ten concept-derived hover/down raster controls, but keyboard input only handled `Escape`/cancel. Directional actions and Enter did not move across or activate the visible Settings controls.
- Impact: The Settings screen could pass pointer hover/pressed audits while remaining incomplete for keyboard focus. The UI had the right control-specific bitmap state art, but keyboard users could not see or use it.
- Resolution: `SettingsScene` now tracks its ten raster controls, uses arrow-key movement to focus the nearest visible control, shows the existing control-specific hover bitmap as keyboard focus, and uses the existing down bitmap before running the focused control's existing action on Enter. `tmp/settings-keyboard-focus-raster-state-audit.mjs` verifies focus coverage, no text/vector leakage, Enter activation, persisted setting change, and focus restoration after scene restart.
- Prevention: Dense settings/control screens should not count pointer hover/down coverage as keyboard focus coverage. Keyboard focus must have its own audit and should reuse the same concept-derived material state before any new focus language is considered.

### Problem: Combat/Boss cost-disabled cards still looked playable in raster mode

- Cause: Combat and Boss raster card controls created hover/down hit targets for every visible hand card. The simulation already rejected cards whose effective cost exceeded player energy, but the UI did not ask the same cost path before showing the playable affordance.
- Impact: A player could see hover/down material feedback on a card that would only log `card:blocked_energy` and restart the scene. That weakened the disabled-state language and made keyboard/pointer feedback disagree with actual combat rules.
- Resolution: `combatSystem` now exposes `getCombatCardCostAtIndex` and `canPlayCardAtIndex`, reusing the same rune, discount, penalty, and passive cost adjustment used by real card play. `CombatScene` and `BossScene` use that helper when building raster card targets: playable cards keep their local concept hover/down family, while cost-disabled cards show `ui_disabled_lock_stamp_concept` and do not respond to pointer click or blocked keyboard card activation. `tmp/combat-boss-disabled-raster-state-audit.mjs` verifies lock placement, no hover leakage, no vector/text leakage, and no state/log change after click or `Digit1`.
- Prevention: Disabled-state art should be driven from the same rule path as gameplay eligibility. Do not rely on a simulation rejection log as UI feedback when the control can be identified as disabled before input.

### Problem: Broad Phaser smoke looked like a generic timeout after keyboard raster feedback was added

- Cause: The broad smoke runner only logged coarse top-level progress, so a release passive failure looked like a long timeout. The failing passive cases pressed combat keys repeatedly with a fixed 80ms settle, but keyboard activation now intentionally shows a short raster down state before the action runs. `ribbon-firework` also used five draw/discount cards and repeated `Digit1`, which was a fragile way to prove five actual card plays.
- Impact: The UI work could not honestly claim the broad browser gate was passing. It also made progress look slower than it was because the run spent minutes hiding the exact failing subcase instead of reporting actionable state.
- Resolution: `tools/phaser-smoke-test.mjs` now supports `PHASER_SMOKE_ONLY`, logs `START`/`OK`/`FAIL` timings, and logs release passive subcase labels. Repeated combat-key passive checks now wait for real debug-state advancement, `ribbon-firework` uses a deterministic non-draw 0-cost hand, and debug-value timeouts include the current value, phase, hand, and log. Targeted `checkReleasePassiveBatch` and the full Vite wrapper smoke both now end with `Phaser smoke OK`.
- Prevention: Any smoke path that exercises delayed raster keyboard feedback must wait for a state change, not a fixed key interval. Long broad smoke batches need subcase progress labels before they are used as release/UI gates.

### Problem: Reward/Event had keyboard confirm feedback but no directional choice focus

- Cause: Reward and Event raster modes only stored a single first/default `confirmHitTarget`. Enter could briefly show the first choice's down bitmap, but arrow keys did not focus visible choices, and Enter had no way to activate the currently focused card-like choice.
- Impact: The UI could claim first keyboard-confirm feedback while still missing the more important selected/focus path for multi-choice screens. Keyboard users could not see which Reward/Event card was selected, and a weak scene-transition check could hide whether Enter activated the focused choice or the default first choice.
- Resolution: `RewardScene` and `EventScene` now keep ordered raster choice controls. Arrow keys set keyboard focus using the existing `ui_hover_choice_badge_concept` hover bitmap, Enter triggers the focused choice's existing down bitmap before running that choice action, and visible number-key choices also route through the same down feedback. Event focus only includes affordable choices, leaving disabled lock behavior unchanged. `tmp/reward-event-keyboard-focus-raster-state-audit.mjs` verifies second-choice focus coordinates, pressed badge size, no text/vector leakage, and actual second-choice execution.
- Prevention: Multi-choice raster scenes should track choice controls, not only a default confirm target. Focus audits must prove both visible state and action identity, because a scene transition alone is too weak to prove the selected choice was activated.

### Problem: Utility screens had raster hover/down art but no directional keyboard focus

- Cause: Town, RuneBench, and Result had screen-specific pointer hover/down bitmaps and first keyboard-confirm down feedback, but their raster controls were still reduced to a single default confirm target for keyboard input. Arrow keys could not focus visible utility controls, and Enter could not activate a focused lower button or toolbar control.
- Impact: The UI looked increasingly consistent for pointer users while keyboard users still lacked selected/focus feedback on utility surfaces. Town's lower toolbar, RuneBench's lower confirm tile, and Result's lower return panel could have dedicated state art without being reachable through keyboard focus.
- Resolution: `TownScene`, `RuneBenchScene`, and `ResultScene` now keep ordered visible raster controls. Arrow keys show each control's existing hover bitmap as focus, and Enter shows the same control's existing down bitmap before running its existing action. Town deliberately excludes the ambiguous central legacy reset/settings coordinates from keyboard focus while preserving their click behavior. `tmp/utility-keyboard-focus-raster-state-audit.mjs` verifies focus ids, exact keys, coordinates, sizes, no text/vector leakage, and focused activation paths.
- Prevention: If a utility control has dedicated pointer state art and a visible button/tile/panel, it should either be included in keyboard focus or explicitly documented as click-only legacy behavior. Audits should verify focus registry state plus exact bitmap placement, not only visible image count.

### Problem: WorldMap stage-5 neutralization sampled the wrong source area

- Cause: The earlier WorldMap neutralized-underlay pass treated stage-5 body and route coordinates as if runtime 1920 coordinates mapped directly to the 1672x941 concept source. This meant the audit could sample a neutral-looking area while the visible stage-5 plate and 4-to-5 route still carried a stronger blue/cyan active-state read.
- Impact: In the `stage_peach_canal` current-state screenshot, stage 5 could still read more like an upcoming active route node than a quieter next-locked node. The dedicated audit was green, but its sample evidence was too weak for the actual visual issue.
- Resolution: `tools/extract-ui-state-assets.mjs` now applies source-coordinate stage-5 neutralization over the actual node plate, lower seal, and 4-to-5 route segment. `tmp/ui-worldmap-action-hit-target-audit.mjs` now samples `stage5body`, `stage5lowerSeal`, and `stage5route` at the corrected source locations. The refreshed audit reports neutral values for those samples, and screenshot review of `tmp/ui-quality/worldmap/worldmap-progress-current-stage4-v1-1920.png` shows the stage-5 active-state read is reduced.
- Prevention: WorldMap state samples must be checked against source crops before being trusted. A count/position audit can pass while still sampling the wrong pixel region, so future recomposition work should pair source crops, runtime screenshots, and corrected pixel samples.

### Problem: WorldMap still showed the old stage-4 current-state scars in other runtime states

- Cause: After the stage-5 source-coordinate fix, screenshot review still showed faint but recognizable remnants of the original concept's fixed stage-4 current marker and lower current-status badge. Color-dominance samples were neutral enough, but the silhouette still made non-stage-4 runtime states inherit part of the old baked state.
- Impact: WorldMap could pass the state-count audit while still looking like the runtime marker stack was sitting on top of a ghosted stage-4 current node. This weakened the concept-match goal because the screen looked less like a recomposed runtime state and more like a muted screenshot with stickers.
- Resolution: `tools/extract-ui-state-assets.mjs` now applies an additional source-aware stage-4 scar patch for the top current marker, lower status badge, and nearby route/status scar. `tmp/ui-worldmap-action-hit-target-audit.mjs` now samples `stage4topMarkerScar` and `stage4statusScar` with tighter dominance thresholds. The refreshed audit reports `stage4topMarkerScar=[115,106,94]` and `stage4statusScar=[122,110,87]`.
- Prevention: WorldMap recomposition audits need to check visible stale-state silhouettes, not only green/cyan dominance. When a muted shape still reads as a state marker, add a source-coordinate sample and screenshot review before treating the underlay as neutral enough.

### Problem: WorldMap current state still depended too much on the neutralized underlay body

- Cause: The runtime current node had a marker, halo, and lower status badge, but the node body/frame itself still came mostly from the neutralized WorldMap underlay. A direct copy of the source stage-4 current node would have carried the baked `4`, top marker, lower status badge, route fragments, and parchment background into other runtime stages.
- Impact: Current-state movement could be technically correct while still looking like a marker stack pasted onto a muted screenshot. The WorldMap remained under-recomposed compared with the concept-art target, especially when keyboard selection moved current state to earlier nodes.
- Resolution: Added `ui_current_stage_frame_concept`, extracted from the original WorldMap concept with masking for the baked number, top marker, status badge, route fragments, and parchment background. `WorldMapScene` now renders this frame at the runtime current node between the cleaned halo and marker/status stack. `releaseCatalogAdapter` also shares the new key into release mode, after the first audit showed the release state could not see the frame texture. `tmp/ui-worldmap-action-hit-target-audit.mjs` now verifies the frame in default, progressed, late-lock, and keyboard-selected states.
- Prevention: Any new concept-derived WorldMap state asset must be checked in both slice and `?data=release` paths. Avoid copying a whole source node unless the baked number and old route/state pieces are removed or the asset is stage-specific by design.

### Problem: WorldMap completed state still leaned on badge-only composition

- Cause: Completed stages had runtime check badges, but the node body/frame still mostly came from the neutralized underlay. Directly copying a source completed node would have moved the baked stage number, check mark, route fragments, and map background to other runtime stages.
- Impact: Completed state could be counted and positioned correctly while still reading like a green check sticker on a muted screenshot. This was a weaker match to the concept-art goal than a runtime recomposed completed node.
- Resolution: Added `ui_completed_stage_frame_concept`, extracted from the original WorldMap completed-node concept with masking for the baked number, check mark, route fragments, and background. `WorldMapScene` renders it under completed badges and above the neutralized underlay. `releaseCatalogAdapter` shares the key into release mode, and `tmp/ui-worldmap-action-hit-target-audit.mjs` now verifies completed-frame count, placement, display size, alpha, and absence on the runtime current node.
- Prevention: Completed-state audits should check both the badge and body/frame material. When extracting from a completed source node, keep the check mark in a separate badge asset unless the body variant is explicitly stage-specific.

### Problem: WorldMap locked state still leaned on badge-only composition

- Cause: Upper red locked stages had source-aligned runtime lock badges, but the node body/frame still mostly came from the neutralized underlay. Directly copying a source locked node would have moved the baked stage number, lock center, route fragments, and map background to other runtime stages.
- Impact: Locked state could be counted and positioned correctly while still reading like a lock sticker on a muted screenshot. It also left current/completed/locked state recomposition uneven: current and completed had first frame overlays, but locked did not.
- Resolution: Added `ui_locked_stage_frame_concept`, extracted from the original WorldMap locked-node concept with masking for the baked number, lock center, route fragments, and background. `WorldMapScene` renders it under locked badges and above the neutralized underlay for red locked stages. `releaseCatalogAdapter` shares the key into release mode, and `tmp/ui-worldmap-action-hit-target-audit.mjs` now verifies locked-frame count, placement, display size, alpha, and absence on the runtime current node.
- Prevention: Locked-state audits should check both the lock badge and body/frame material. When extracting from a locked source node, keep the lock symbol in a separate badge asset unless the body variant is explicitly stage-specific.

### Problem: WorldMap state frames improved silhouettes but body material still came mostly from the underlay

- Cause: Current, completed, and locked nodes had first frame/badge overlays, but the larger node body material still came mostly from the neutralized WorldMap screenshot. Directly copying full source nodes would carry baked numbers, check/lock/status centers, route fragments, and map background between runtime states.
- Impact: The WorldMap was moving in the right direction but could still read as underlay plus state stickers, especially when the current state moved to another node through keyboard selection. This limited the visible quality gain from the frame overlays.
- Resolution: Added conservative `ui_current_stage_body_wash_concept`, `ui_completed_stage_body_wash_concept`, and `ui_locked_stage_body_wash_concept` assets. They are extracted from the original WorldMap concept with broad number/icon/route/background cutouts. `WorldMapScene` renders them below the frame/badge/marker stacks, `releaseCatalogAdapter` shares them into release mode, and `tmp/ui-worldmap-action-hit-target-audit.mjs` verifies body-wash count, placement, display size, alpha, and current-node absence rules.
- Prevention: Future body-variant work should keep numbers and state icons separate from transferable body material unless the asset is explicitly stage-specific. Audits should prove body overlays exist and do not overlap the current node with completed/locked state material.

### Problem: WorldMap sealed state was still badge-only after red locked body/frame work

- Cause: Red locked stages had body/frame/badge material, but the lower/mid next-locked sealed state still rendered only `ui_sealed_stage_badge_concept` on top of the neutralized underlay.
- Impact: The state language was uneven: upper red locks had a richer recomposed stack, while the gray sealed next node still looked like a small badge placed on a muted screenshot.
- Resolution: Added `ui_sealed_stage_body_wash_concept` and `ui_sealed_stage_frame_concept`, extracted from gray WorldMap node material with number/route/background cutouts. `WorldMapScene` renders them below the sealed badge for the single next lower/mid locked node. `releaseCatalogAdapter` shares the keys into release mode, and `tmp/ui-worldmap-action-hit-target-audit.mjs` verifies sealed body/frame/badge count, placement, display size, alpha, zero-count late states, and absence on the runtime current node.
- Prevention: Sealed-state audits should check the full body/frame/badge stack, not just the badge. Continue keeping gray sealed body material separate from source numbers or stage-specific route fragments unless the asset is intentionally stage-specific.

### Problem: Non-next lower/mid locked WorldMap nodes still relied only on muted baked underlay art

- Cause: After the sealed pass, only the single next lower/mid locked node received gray body/frame material. Other lower/mid locked nodes still depended on the neutralized WorldMap underlay, so stages 4-9 could look like muted old-state screenshot pieces rather than runtime-composed locked nodes.
- Impact: The state language stayed uneven: current/completed/red-locked/sealed nodes had runtime material stacks, but non-next lower/mid locked nodes had no matching dormant-state layer. This made the map feel less recomposed and left some old stage-4/stage-5 silhouettes visually important.
- Resolution: Added `ui_dormant_stage_body_wash_concept` and `ui_dormant_stage_frame_concept`, extracted from gray WorldMap node material with source number, route, and background cutouts. `WorldMapScene` renders them on non-next lower/mid locked nodes, while the first lower/mid locked node keeps the sealed stack and upper locked nodes keep the red locked stack. `tmp/ui-worldmap-action-hit-target-audit.mjs` verifies dormant body/frame count, placement, style, zero-count late states, and absence on runtime current / keyboard-selected nodes.
- Prevention: WorldMap state audits should distinguish next-sealed, dormant lower/mid locked, and upper red locked nodes. Do not let non-next locked nodes silently fall back to only neutralized baked underlay material when other state families have runtime body/frame stacks.

### Problem: WorldMap progressed routes still depended mostly on baked underlay route cues

- Cause: After current/completed/locked/sealed/dormant node overlays were added, progressed route segments still read mostly from the original concept screenshot's baked route marks plus neutralized underlay. That meant runtime progress could be counted correctly while the route itself still looked less recomposed than the nodes.
- Impact: The WorldMap state language remained uneven. Nodes had first runtime body/frame/badge stacks, but route progress could still look like old baked screenshot material instead of current save-state material.
- Resolution: Added `ui_world_map_route_progress_bead_concept`, cropped from the original concept's cyan route material rather than drawn as a vector line. `WorldMapScene` renders small additive route beads on completed/progressed route segments before the current node. `tmp/ui-worldmap-action-hit-target-audit.mjs` verifies route-bead count, placement, style, and zero beads in keyboard-selected state; the broad Phaser smoke still passes.
- Prevention: WorldMap route audits should verify route-state material separately from node-state material. Do not let a neutralized baked underlay route count as dynamic route progress unless runtime route overlays are also present and checked in default, progressed, late-progress, and selected states.

### Problem: Mid/late WorldMap completed nodes reused the lower completed badge texture

- Cause: Completed stages all rendered `ui_completed_stage_badge_concept`; later node placement made the badge smaller, but the texture itself still came from the lower completed-node check treatment.
- Impact: The late-progress map could pass count and placement audits while still reading like the lower 1-3 completed sticker had been pasted across mid/late route nodes. This weakened the later-node variant story and kept one of the WorldMap state families too uniform.
- Resolution: Added `ui_completed_stage_late_badge_concept`, a source-derived `completedLate` variant extracted from the original completed badge crop with a narrower mask and quieter alpha/color treatment. `WorldMapScene` uses the base completed badge for completed stages 1-3 and the late completed badge after that group. `tmp/ui-worldmap-action-hit-target-audit.mjs` now verifies base and late completed badge counts separately; the late stage-9 progress state reports 3 base badges and 5 late badges.
- Prevention: Future WorldMap variant work should audit texture-family choice, not only total badge count. If a later state is meant to be visually quieter, add a distinct source-derived variant and verify the runtime uses it only in the intended stage family.

### Problem: Mid/late WorldMap completed nodes still reused the lower completed body/frame stack

- Cause: After the late badge split, completed stages after the lower 1-3 group still rendered the shared `ui_completed_stage_body_wash_concept` and `ui_completed_stage_frame_concept` textures. Their alpha was lower, but the texture family was still the same lower completed-node material.
- Impact: The late-progress map was better than the badge-only split, but the broader completed-node stack still looked too uniform. Count/placement audits could pass without proving that later completed nodes had their own quieter body/frame family.
- Resolution: Added `ui_completed_stage_late_body_wash_concept` and `ui_completed_stage_late_frame_concept`, both source-derived from the original completed-node crop with quieter `completedLate` processing. `WorldMapScene` now uses the base completed body/frame/badge stack for stages 1-3 and the late completed stack after that group. `tmp/ui-worldmap-action-hit-target-audit.mjs` verifies base and late completed body/frame counts separately; the late stage-9 progress state reports 3 base bodies/frames and 5 late bodies/frames.
- Prevention: WorldMap state audits should verify the whole stack's texture family, not only the top badge. When a late node family is split, body, frame, and badge should be checked together unless the difference is intentionally limited to one layer.

### Problem: WorldMap final route leg reused the same route-progress material as earlier completed legs

- Cause: After the bead/thread route-progress pass, the final route leg into the current stage used the same `ui_world_map_route_progress_thread_concept` and `ui_world_map_route_progress_bead_concept` texture families as earlier completed route legs. Size and alpha differed, but the source texture family did not.
- Impact: The route-progress audit could prove total route count, placement, and alpha, but it could not prove that the active/current leg had distinct material language. This kept the route-state system flatter than the node-state work, where current, completed, locked, sealed, dormant, and late completed families were being split explicitly.
- Resolution: Added `ui_world_map_route_progress_current_thread_concept` and `ui_world_map_route_progress_current_bead_concept`, both source-derived from the original cyan WorldMap route crop with a brighter `currentLeg` treatment. `WorldMapScene` now uses base route thread/bead textures for earlier completed legs and current route thread/bead textures for the final leg into the current node. `tmp/ui-worldmap-action-hit-target-audit.mjs` verifies base/current route thread and bead counts separately in default, stage-4-progress, stage-9-progress, and keyboard-selected states.
- Prevention: Route-state audits should verify texture-family choice, not only total route overlay count. If the current leg is intended to read differently from earlier completed legs, keep it in a distinct source-derived asset family and check that keyboard selection does not accidentally show route-progress material.

### Problem: Late WorldMap current nodes reused the lower/stage-4 current body and frame stack

- Cause: The runtime current node always rendered `ui_current_stage_body_wash_concept` and `ui_current_stage_frame_concept`, regardless of whether the current stage was in the lower route, stage 4, or the later stage-9 progress state.
- Impact: The late-progress map could prove that the current marker/halo/status stack moved correctly, but the underlying current body/frame material still came from the same source family as lower/stage-4 current states. This left current-node stage-family variation weaker than the completed-node late split.
- Resolution: Added `ui_current_stage_late_body_wash_concept` and `ui_current_stage_late_frame_concept`, both source-derived from the original current-node crop with quieter `currentLate` processing. `WorldMapScene` now uses base current body/frame textures for lower and stage-4 current states, and late current body/frame textures for current stage indexes after stage 5. `tmp/ui-worldmap-action-hit-target-audit.mjs` verifies base/late current body and frame counts separately.
- Prevention: Current-node audits should verify texture-family choice across default, progressed, late-progress, and keyboard-selected states. A single movable current marker stack is not enough evidence that later current nodes have their own material language.

### Problem: Mid dormant WorldMap locked nodes reused the lower dormant body and frame stack

- Cause: Non-next lower/mid locked nodes used a shared dormant body/frame texture family. Placement and alpha differed for lower versus mid nodes, but the texture keys remained `ui_dormant_stage_body_wash_concept` and `ui_dormant_stage_frame_concept`.
- Impact: Default and stage-4-progress maps could prove dormant count and placement, but not that mid-route dormant nodes had their own quieter material language. This left the lower/mid locked family flatter than the current and completed families after their late splits.
- Resolution: Added `ui_dormant_stage_mid_body_wash_concept` and `ui_dormant_stage_mid_frame_concept`, both source-derived from the gray WorldMap node crop with quieter `dormantMid` processing. `WorldMapScene` now uses base dormant body/frame textures for lower dormant locked nodes and mid dormant body/frame textures after stage 5. `tmp/ui-worldmap-action-hit-target-audit.mjs` verifies base/mid dormant body and frame counts separately.
- Prevention: Dormant-state audits should verify lower and mid texture-family choice, not only total dormant overlay count. When placement logic already treats lower and mid nodes differently, the texture family should be audited separately too.

### Problem: Far upper red locked WorldMap nodes reused the first red lock body and frame stack

- Cause: Upper red locked nodes all used `ui_locked_stage_body_wash_concept` and `ui_locked_stage_frame_concept`. The first red lock had stronger placement/alpha when it was the next locked node, but farther red locks still shared the same source texture family.
- Impact: Default, stage-4-progress, and late-progress maps could prove red lock count and placement, but not that the first/next red lock had stronger material than farther red locks. This kept the upper locked family flatter than the current, completed, and dormant families after their stage-family splits.
- Resolution: Added `ui_locked_stage_far_body_wash_concept` and `ui_locked_stage_far_frame_concept`, both source-derived from the red WorldMap locked-node crop with quieter `lockedFar` processing. `WorldMapScene` now keeps the base locked body/frame for the first/next red locked node and uses far locked body/frame textures for other red locked nodes. `tmp/ui-worldmap-action-hit-target-audit.mjs` verifies next/far locked body and frame counts separately.
- Prevention: Locked-state audits should verify next/far texture-family choice, not only total red lock overlay count. When the runtime already distinguishes first locked and distant locked nodes through alpha/depth, the texture family should be audited separately too.

### Problem: Dynamic readability was hidden-only and had no visible tooltip evidence

- Cause: The raster concept screens intentionally avoided visible Phaser text to preserve the concept-art look. The hidden accessibility-label pass improved screen-reader/status evidence, but it did not prove that a sighted player could inspect card costs, choices, settings rows, stage nodes, or primary actions through a readable in-game surface.
- Impact: The project could overstate dynamic readability progress while still depending on baked concept information and invisible DOM summaries. It also left no screenshot evidence for safe visible text zones that do not cover the main playfield.
- Resolution: Added `src/ui/overlays/readabilityOverlay.ts` and wired optional tooltip title/body/tone metadata through `renderRasterHoverHitTarget`. Town, WorldMap, Dungeon, Combat, Reward, Event, RuneBench, Boss, Result, and Settings now expose representative visible DOM tooltips on pointer hover/down and keyboard focus. `tools/ui-readability-tooltip-audit.mjs` verifies all ten scenes for content, size, role/aria attributes, canvas bounds, z-index, and screenshots.
- Prevention: Treat hidden labels and visible readability as separate evidence tracks. Future gameplay-critical controls should add tooltip copy through the shared raster hit-target path and include screenshot/audit proof, especially for mobile placement, disabled explanations, and focused/selected states.

### Problem: Mobile portrait tooltips could pass while still covering the tiny 16:9 playfield

- Cause: The first visible tooltip audit only checked 1920x1080, and the tooltip placement always clamped inside the Phaser canvas. In the existing 390x844 portrait layout the canvas is only `390x219`, so a readable tooltip could occupy a large portion of the actual playfield even while passing desktop checks.
- Impact: Mobile screenshots could be technically unclipped but still poor to play: the tooltip protected DOM readability while hiding the map, cards, or settings controls it was explaining.
- Resolution: `readabilityOverlay.ts` now detects narrow portrait letterbox layouts and moves the tooltip into unused space above or below the canvas when there is enough room. `ui-readability-tooltip-audit.mjs` now runs all ten primary scenes at 1920x1080, 1280x720, and 390x844. Desktop tooltips must stay inside the canvas; mobile portrait tooltips must stay in the viewport and avoid canvas overlap.
- Prevention: Any mobile tooltip or helper-text pass must inspect actual screenshots, not only DOM bounds. In letterboxed portrait layouts, prefer safe letterbox space before covering the game canvas.

### Problem: Disabled raster controls showed lock art without explaining the blocked condition

- Cause: Event unaffordable choices and Combat/Boss cost-disabled cards had source-derived lock stamps and blocked input behavior, but `renderRasterDisabledHitTarget` did not expose a readable reason through the DOM tooltip layer.
- Impact: A player could see that a control was locked but not know whether the reason was HP, gold, current energy, or an adjusted card cost. This weakened the UI's gameplay readability even though the disabled art itself was audited.
- Resolution: `renderRasterDisabledHitTarget` now accepts tooltip title/body/tone metadata and shows a danger-tone readability tooltip while remaining inert. Event disabled choices explain missing HP/gold conditions. Combat/Boss disabled cards use `getCombatCardCostAtIndex` to report current energy versus adjusted required energy. The disabled audits now verify tooltip role/aria, danger tone, bounds, screenshot evidence, and unchanged blocked click/keyboard behavior.
- Prevention: Disabled-state audits should check both the visual lock material and the reason text. The explanation must use the same gameplay eligibility path as the blocked action, especially for card costs affected by runes, passives, discounts, or penalties.

### Problem: Keyboard focus state had bitmap evidence but no separate visible tooltip proof

- Cause: Earlier keyboard-focus audits proved that arrow-key navigation reused the correct concept-derived hover/down bitmap states, but they mostly inspected Phaser scene state and screenshots of the canvas layer. The visible DOM readability tooltip was added later, so the project had no durable proof that focused controls exposed the same tooltip layer as pointer hover across responsive layouts.
- Impact: The UI could claim representative focus art support while still missing visible readable copy for keyboard users, especially at 1280 desktop or 390x844 portrait letterbox sizes.
- Resolution: Added `tools/ui-keyboard-focus-tooltip-audit.mjs`. It opens Town, Dungeon, Combat, Reward, Event, RuneBench, Boss, Result, and Settings at 1920x1080, 1280x720, and 390x844, triggers representative arrow-key focus paths, verifies the expected focus registry value, checks `#game-readability-tooltip` role/aria/tone/title/body/placement/z-index/pointer-events/canvas accessibility metadata, and captures screenshots under `tmp/ui-quality/focus-tooltips/`.
- Prevention: Future focus/readability work should test pointer hover and keyboard focus as separate access paths. A bitmap focus state is not enough if the readable tooltip layer does not appear and stay safely placed in both desktop and portrait letterbox layouts.

### Problem: WorldMap locked nodes had state art but no readable blocked-condition explanation

- Cause: WorldMap locked/sealed/dormant nodes had runtime raster state material, but only unlocked nodes had interactive hover/tooltip surfaces. Locked nodes could look correctly unavailable while still failing to explain the unlock requirement to a sighted player.
- Impact: The disabled/readability evidence covered Event unaffordable choices and Combat/Boss cost-disabled cards, but the WorldMap, one of the main progression screens, still had silent locked state. This made the 95% claim weaker because a player could not inspect why sealed, dormant, or red locked stages were blocked.
- Resolution: `renderRasterDisabledHitTarget` now supports `disabledKey: false`, allowing tooltip-only disabled hit targets. `WorldMapScene` registers those inert hit targets over locked stage nodes and supplies danger-tone tooltip copy for first locked and later locked stages. `tools/ui-worldmap-locked-tooltip-audit.mjs` verifies sealed-next, dormant-mid, far red locked, and next red locked cases across 1920x1080, 1280x720, and 390x844, including unchanged current stage and no visible default disabled stamp.
- Prevention: Future WorldMap disabled/readability work should test locked-node visual state, blocked input behavior, and tooltip explanation together. Do not count state art alone as disabled UX completion when the player cannot inspect the blocked condition.

### Problem: WorldMap keyboard-selected stages had state evidence but no selected-stage tooltip evidence

- Cause: Direction-key WorldMap stage selection changed the selected/current stage and had raster state audits, but it did not show the visible DOM readability tooltip after keyboard selection. Calling the existing hover handler directly would have shown a second hover halo and weakened the existing state-layer evidence.
- Impact: The project could claim WorldMap keyboard selection worked visually while still leaving keyboard users without immediate selected-stage readable copy. It also left WorldMap as an exception to the focus/tooltip consistency evidence gathered for other screens.
- Resolution: Added `showRasterReadabilityTooltip` so scenes can show the existing DOM tooltip without enabling hover/down images. WorldMap keyboard stage selection stores the selected stage id before scene restart and shows the selected-stage tooltip after the raster scene rebuilds. `tools/ui-worldmap-keyboard-tooltip-audit.mjs` verifies lower-left and late-right keyboard selections across 1920x1080, 1280x720, and 390x844, including one current halo, no visible text/vector leak, and safe tooltip placement.
- Prevention: Keyboard selection audits should check readable tooltip/accessibility output separately from visual marker movement. If a keyboard path needs text, do not reuse pointer hover internals in a way that changes the visual state stack unless that visual change is explicitly intended and audited.

### Problem: Mobile portrait had safe tooltip placement but no deliberate framing cue

- Cause: The responsive sanity and tooltip passes proved the 390x844 layout was unclipped and could place detailed tooltips in letterbox space, but the default portrait view still showed a tiny `390x219` canvas surrounded by empty letterbox space with no deliberate orientation/framing treatment.
- Impact: The UI could pass automated responsive checks while still feeling unfinished on portrait mobile. A player would see that the game technically fits, but would not receive any lightweight framing signal that landscape is the intended readable stage size.
- Resolution: Added `mobileFramingOverlay.ts`, wired it through the shared scene overlay pass, and added `tools/ui-mobile-framing-audit.mjs`. The cue appears only in narrow portrait letterbox layouts, remains outside the canvas, stays hidden on desktop and landscape, uses `pointer-events: none`, and is immediately suppressed when the detailed readability tooltip appears.
- Prevention: Future mobile/responsive work should audit the empty-space treatment separately from canvas clipping. If a helper cue shares space with detail tooltips, test the z-index/suppression path so the most specific player explanation wins.
