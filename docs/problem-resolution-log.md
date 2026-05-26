# 문제 해결 로그

이 문서는 작업 중 발견된 문제점, 반복되는 실패 원인, 품질 리스크, 해결 방안, 재발 방지 기준, 해결 커밋을 관리하는 파일이다.
대화 원문 기록은 `docs/conversation-log.md`에서 관리하고, 이 문서는 문제와 해결 방안을 따로 추적한다.

## 2026-05-24

### 문제: 대화 기록이 요약본으로 제안됨

- 원인: Codex가 "히스토리 보존용 대화 로그"를 원문 기록이 아니라 요약 인수인계 문서로 잘못 해석했다.
- 영향: 사용자가 원한 실제 대화 원문 기록과 달라, 나중에 맥락 확인 시 판단 과정이 누락될 수 있다.
- 해결 방안: 대화 로그는 요약하지 않고 사용자 요청과 Codex 답변을 가능한 한 원문 그대로 기록한다.
- 재발 방지 기준: `PROJECT_RULES.md` 2번 규칙에 "요약본이 아니라 원문 그대로"라는 기준을 명시한다.
- 해결 커밋: 이 항목이 포함된 커밋.

### 문제: 문제점과 해결 방안이 대화 로그에 섞일 가능성

- 원인: 대화 로그와 문제 해결 기록의 목적이 다르지만, 별도 파일이 없으면 한 문서에 섞일 수 있다.
- 영향: 이후 작업자가 반복 문제, 해결 방안, 재발 방지 기준을 빠르게 찾기 어렵다.
- 해결 방안: 문제점과 해결 방안은 `docs/problem-resolution-log.md`에서 별도 관리한다.
- 재발 방지 기준: `PROJECT_RULES.md` 3번 규칙에 문제 해결 로그 관리 기준을 명시한다.
- 해결 커밋: 이 항목이 포함된 커밋.

## 2026-05-26

### 문제: 프로젝트 운영 규칙을 에이전트가 놓칠 수 있음

- 원인: 원격 최신 저장소에는 `PROJECT_RULES.md`와 `docs/handoff.md`가 있었지만, Codex/에이전트가 작업 시작 시 어떤 문서를 먼저 읽어야 하는지 알려주는 루트 `AGENTS.md`가 없었다. 전역 `C:\Users\i\.codex\AGENTS.md`도 비어 있었다.
- 영향: 새 세션이나 다른 PC에서 `PROJECT_RULES.md`의 작업 루트 정리, 대화 원문 로그, 문제 해결 로그 규칙을 놓치고 작업할 수 있다.
- 해결 방안: 저장소 루트에 `AGENTS.md`를 추가해 작업 시작 전 `PROJECT_RULES.md`, `docs/handoff.md`, `docs/current-issues-and-plan.md`, `docs/recovery-audit.md`, `RESEARCH_CHECKLIST.md`를 읽도록 지정한다. 전역 `C:\Users\i\.codex\AGENTS.md`에도 저장소 `AGENTS.md`를 우선 확인하라는 공통 지시를 작성한다.
- 재발 방지 기준: 저장소 운영 규칙이 새로 생기거나 바뀌면, 실제 규칙 문서뿐 아니라 에이전트 진입점인 `AGENTS.md`도 함께 갱신한다.
- 해결 커밋: 이 항목이 포함된 커밋.

### 문제: 완료 판정과 작업 범위가 Codex 내부 판단으로 흐려질 수 있음

- 원인: 위험하거나 큰 작업에서 Codex가 사용자의 지시 범위를 그대로 제시하지 않고, 안전이나 속도를 이유로 내부에서 범위를 축소하거나 완료 상태를 좋게 표현할 여지가 있었다.
- 영향: 사용자는 Codex의 완료 보고를 기준으로 다음 결정을 하므로, 완료되지 않은 일을 완료처럼 말하면 프로젝트 판단 전체가 틀어질 수 있다.
- 해결 방안: `AGENTS.md`를 영어 authoritative 규칙과 한글 참고 번역 구조로 개편했다. 실제 기준은 `Authoritative English Rules`로 고정하고, 위험 작업 범위 제시, 조용한 범위 변경 금지, 전수조사 체크리스트 선행, 완료/부분 완료/검증 미완료 상태 구분을 명시했다. `PROJECT_RULES.md`에도 `AGENTS.md`의 영문 규칙을 에이전트 운영 기준으로 연결했다.
- 재발 방지 기준: 중요한 작업은 `Confirm instruction -> Check records -> Present scope/criteria -> Get approval when risky -> Execute -> Verify -> State completion level -> Report remaining risk` 흐름을 따른다. 체크리스트와 검증 근거 없이 `Research complete`, `95% close`, `Passed`, `Complete` 표현을 쓰지 않는다.
- 해결 커밋: 이 항목이 포함된 커밋.
