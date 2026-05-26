# Agent Entry

This file has two sections.

1. `Authoritative English Rules`: Codex must follow this section as the source of truth.
2. `Korean Reference`: this is a human-readable reference for the user. It is not the source of truth if wording differs.

## Authoritative English Rules

### Priority

The user's current instruction has the highest priority.
After that, follow this file and the project-specific handoff or rule documents.

When instructions conflict, follow this order.

1. The user's current instruction in the active conversation
2. `AGENTS.md`
3. `PROJECT_RULES.md`
4. `docs/handoff.md`
5. `docs/current-issues-and-plan.md`
6. `docs/recovery-audit.md`
7. `RESEARCH_CHECKLIST.md`
8. `README.md` and other files under `research/`

### Startup Checklist

Before starting any work in this repository, check the following in order when available.

1. The user's current instruction
2. `AGENTS.md`
3. `PROJECT_RULES.md`
4. `docs/handoff.md`
5. `docs/current-issues-and-plan.md`
6. `docs/recovery-audit.md`
7. `RESEARCH_CHECKLIST.md`
8. `README.md`

If a document is missing or the repository is empty, report that fact instead of assuming its contents.

### Core Principles

- Say done only when it is done.
- Say not done when it is not done.
- Say unclear when the state is unclear.
- Do not make incomplete work sound complete.
- Prefer accurate status reporting over fast-looking responses.
- Written rules and the user's current instruction override Codex's momentary judgment.

### Request Interpretation And Scope

Do not immediately execute large or ambiguous work.
First state the goal, target, exclusions, and impact range as understood.

The following work must include an explicit scope statement before execution.

- Deletion
- Local cleanup
- Git merge, reset, force push, remote synchronization
- Project structure changes
- Main file or main branch replacement
- Large-scale development
- Exhaustive research
- 95% similarity or perfection claims
- Completion claims

Use this format for risky work.

```text
Target:
Included:
Excluded:
Risk:
Confirmation question:
```

### No Silent Scope Changes

Codex must not silently reduce, expand, or reinterpret the user's requested scope.
If the requested scope seems risky, do not shrink it internally.
Present the user with choices instead.

- Proceed with the original instruction
- Proceed with a narrower scope
- Pause and clarify further

Do not perform risky work until the user chooses.

### Exhaustive Research And 95% Criteria

When the user asks for exhaustive research, perfection, 95% similarity, or near-identical reproduction, do not start without a checklist.
First create a 100% criteria table and track each item.

Use only these item states.

- Done
- Not done
- Unclear
- Needs verification
- No source
- Blocked

Do not use the following phrases without a checklist and verification basis.

- Research complete
- Fully understood
- 95% close
- Implemented identically
- Passed

### Handling Mismatches During Work

If actual state differs from the expected state, stop and report it before continuing.
This applies when:

- Git state differs from expectation
- File structure differs from documentation
- Existing instructions conflict with new instructions
- Delete or change scope is larger than expected
- Verification result does not match the target
- Permissions, sources, or environment prevent a completion judgment

### Completion Status Rules

Use completion language strictly.

- Complete: the requirement was performed, verified, and has no major remaining risk.
- Partially complete: some parts are done and some remain.
- Implemented, not verified: code or content was changed, but testing or browser verification is not complete.
- Research incomplete: source collection or analysis is insufficient.
- Cannot judge completion: criteria are unclear or verification evidence is insufficient.
- Blocked: permissions, sources, or environment prevent progress.

Every final completion report must include:

1. What was done
2. How it was verified
3. What remains
4. What was not done or is based on an assumption

### Repository-Specific Rules

- Do not claim incomplete research, implementation, or verification as complete.
- Exhaustive research must begin with a 100% checklist and tracked item states.
- If remote and local Git state diverge, do not merge, reset, or pull without user confirmation.
- Deletion, forced updates, `git reset`, force push, and local cleanup require user confirmation.
- Treat the current `content-quality-audit` failure as an intentional protective gate unless the user changes that direction.
- Main development must proceed only after the user approves the `docs/vertical-slice/proof.html` proof sample.
- Matching item counts must not be treated as content completion or 95% similarity to the reference game.
- Conversation logs and problem-resolution logs must follow `PROJECT_RULES.md`.

### Required Work Flow

Important work must follow this flow.

```text
Confirm instruction -> Check records -> Present scope/criteria -> Get approval when risky -> Execute -> Verify -> State completion level -> Report remaining risk
```

Codex must not quietly change the user's instruction for reasons of safety, speed, convenience, or assumption.
Ambiguous, risky, or important work must be made visible to the user before execution.

## Korean Reference

이 섹션은 사용자가 읽기 위한 참고 번역이다.
Codex가 실제로 따라야 하는 기준은 위의 `Authoritative English Rules` 섹션이다.
영문과 한글 표현이 다르면 영문 규칙을 우선한다.

### 우선순위

현재 사용자의 지시가 최우선이다.
그 다음 이 파일과 프로젝트별 인수인계/규칙 문서를 따른다.

작업 판단이 충돌할 때는 다음 순서로 따른다.

1. 현재 대화에서 사용자가 직접 지시한 내용
2. `AGENTS.md`
3. `PROJECT_RULES.md`
4. `docs/handoff.md`
5. `docs/current-issues-and-plan.md`
6. `docs/recovery-audit.md`
7. `RESEARCH_CHECKLIST.md`
8. `README.md`와 그 외 `research/` 문서

### 작업 시작 시 확인

이 저장소에서 어떤 작업을 시작하기 전에 가능한 범위에서 다음 문서를 먼저 확인한다.

1. 현재 사용자 지시
2. `AGENTS.md`
3. `PROJECT_RULES.md`
4. `docs/handoff.md`
5. `docs/current-issues-and-plan.md`
6. `docs/recovery-audit.md`
7. `RESEARCH_CHECKLIST.md`
8. `README.md`

문서가 없거나 저장소가 비어 있으면, 있다고 가정하지 말고 없다는 사실을 보고한다.

### 기본 원칙

- 완료된 것만 완료라고 말한다.
- 안 된 것은 안 됐다고 말한다.
- 애매하면 애매하다고 말한다.
- 미완성 작업을 완료처럼 포장하지 않는다.
- 빠른 응답보다 정확한 상태 보고를 우선한다.
- 기록된 규칙과 현재 사용자 지시가 Codex의 즉흥 판단보다 우선한다.

### 요청 해석과 범위

크거나 애매한 작업은 바로 실행하지 않는다.
먼저 내가 이해한 목표, 대상, 제외 대상, 영향 범위를 제시한다.

삭제, 로컬 정리, Git 조작, 구조 변경, 메인 교체, 대규모 개발, 전수조사, 95%/완벽 판정, 완료 판정은 실행 전 범위를 명시한다.

위험 작업은 다음 형식으로 제시한다.

```text
Target:
Included:
Excluded:
Risk:
Confirmation question:
```

### 조용한 범위 변경 금지

사용자가 요청한 범위를 Codex가 조용히 줄이거나 넓히거나 재해석하지 않는다.
위험해 보이면 혼자 축소하지 말고 선택지를 제시한다.

- 원래 지시 그대로 진행
- 더 좁은 범위로 진행
- 보류하고 추가 확인

사용자가 선택하기 전까지 위험 작업은 진행하지 않는다.

### 전수조사와 95% 기준

전수조사, 완벽, 95%, 원작과 거의 동일한 구현을 요구받으면 체크리스트 없이 시작하지 않는다.
먼저 100% 기준표를 만들고 항목별 상태를 추적한다.

항목 상태는 `Done`, `Not done`, `Unclear`, `Needs verification`, `No source`, `Blocked` 중 하나로 표시한다.

체크리스트와 검증 근거 없이 `Research complete`, `Fully understood`, `95% close`, `Implemented identically`, `Passed`라고 말하지 않는다.

### 작업 중 불일치 처리

실제 상태가 예상과 다르면 계속 진행하지 않고 보고한다.
Git 상태, 파일 구조, 지시 충돌, 삭제/변경 범위 확대, 검증 실패, 권한/자료/환경 문제는 즉시 보고 대상이다.

### 완료 판정

완료 표현은 엄격하게 사용한다.

- Complete: 요구사항을 수행했고 검증했고 큰 남은 리스크가 없음.
- Partially complete: 일부만 끝났고 남은 항목이 있음.
- Implemented, not verified: 구현은 했지만 테스트나 브라우저 확인이 끝나지 않음.
- Research incomplete: 자료 수집이나 분석이 부족함.
- Cannot judge completion: 기준이 불명확하거나 검증 근거가 부족함.
- Blocked: 권한, 자료, 환경 문제로 진행할 수 없음.

최종 보고에는 반드시 다음 네 가지를 포함한다.

1. 무엇을 했는지
2. 무엇으로 검증했는지
3. 무엇이 남았는지
4. 못 했거나 추정한 부분이 있는지

### 저장소 특화 규칙

- 완료되지 않은 조사, 구현, 검증을 완료처럼 말하지 않는다.
- 전수조사는 먼저 100% 체크리스트를 만들고 상태를 추적한다.
- 원격과 로컬 Git 상태가 갈라져 있으면 병합, 리셋, 풀을 임의로 하지 않는다.
- 삭제, 강제 업데이트, `git reset`, force push, 로컬 정리는 반드시 사용자 확인 후 진행한다.
- `content-quality-audit`가 실패하는 현재 상태를 정상 보호 장치로 취급한다.
- 본편 개발은 `docs/vertical-slice/proof.html` 기준 샘플이 사용자에게 승인된 뒤에만 진행한다.
- 수량이 맞는 것을 콘텐츠 완성이나 원작 95% 근접으로 말하지 않는다.
- 대화 원문 로그와 문제 해결 로그는 `PROJECT_RULES.md`의 기준을 따른다.

### 필수 작업 흐름

중요한 작업은 다음 흐름을 따른다.

```text
Confirm instruction -> Check records -> Present scope/criteria -> Get approval when risky -> Execute -> Verify -> State completion level -> Report remaining risk
```

Codex는 안전, 속도, 편의, 추정이라는 이유로 사용자의 지시를 조용히 바꾸면 안 된다.
애매하거나 위험하거나 중요한 작업은 반드시 사용자에게 보이게 만든 다음 진행한다.
