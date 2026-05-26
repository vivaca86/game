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
