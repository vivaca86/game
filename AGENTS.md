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

### Pre-Execution Failure Mode Review

For important work, Codex must identify likely failure modes before execution.
This review must be visible to the user when the work is large, risky, ambiguous, or depends on external sources, tools, or verification.

At minimum, consider:

- Scope drift: whether the requested scope could be silently reduced, expanded, or reinterpreted.
- False completion: whether Codex could say complete before implementation, research, or verification is actually complete.
- Missing sources: whether the work needs external references, original materials, videos, docs, or user-provided files.
- Missing tools or dependencies: whether the work needs a package, runtime, browser, plugin, connector, API key, or local program.
- Verification gap: how the result will be tested, inspected, compared, or otherwise proven.
- Recovery risk: whether the work touches files, Git state, generated assets, or local cleanup in a way that is hard to undo.

For each serious failure mode, state how it will be prevented or verified.
If a failure mode cannot be prevented, report the limitation before continuing.

### Tool And Dependency Handling

Do not use missing tools, missing dependencies, or missing access as a vague excuse.
If a tool, package, runtime, connector, browser capability, API key, or source file is genuinely required, Codex must say so clearly.

Follow this order.

1. Check whether an existing local tool or available connector can solve the need.
2. If a free and installable dependency is required, ask the user for permission to install or enable it.
3. If a paid product, paid API, licensed asset, or account-restricted service is required, report that limitation and ask for user-provided access or propose a free alternative.
4. If the user does not approve the needed tool or access, continue only if a reduced-scope path is valid.
5. If a required tool or source is missing, do not mark the work as Complete. Use `Blocked`, `Cannot judge completion`, `Research incomplete`, or `Implemented, not verified` as appropriate.

### Verification Plan

For non-trivial implementation, research, UI, game, Git, or cleanup work, Codex must define the verification method before or during execution.
The final report must compare the actual verification performed against that plan.
If verification could not be performed, say so directly and do not use `Complete`.

### Progress Checkpoints And Drift Control

For long-running, multi-step, or high-risk work, Codex must create visible checkpoints before or during execution.
Each checkpoint must state what is done, what remains, whether the original scope still matches the current work, and whether any new risk, missing tool, missing source, or verification gap has appeared.

Use checkpoints when:

- The work has multiple phases or files.
- The work depends on research, external sources, generated assets, browser verification, or Git state.
- The user sends a new message while work is in progress.
- The conversation resumes after interruption, compaction, or context loss.
- A planned step takes longer than expected or produces unexpected results.

After any interruption or new user message, re-check the latest user instruction before continuing.
Do not finish against an older instruction when a newer one changes the target.

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
Confirm instruction -> Check records -> Present scope/criteria -> Identify failure modes -> Define verification/tool needs -> Get approval when risky -> Execute -> Verify -> State completion level -> Report remaining risk
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

### 작업 전 실패 가능성 점검

중요한 작업은 실행 전에 생길 수 있는 실패 유형을 먼저 점검한다.
작업이 크거나 위험하거나 애매하거나 외부 자료, 도구, 검증에 의존한다면 이 점검 내용을 사용자에게 보이게 제시한다.

최소한 다음을 확인한다.

- 범위 이탈: 요청 범위가 조용히 줄거나 늘거나 재해석될 가능성
- 완료 오판: 구현, 조사, 검증이 끝나기 전에 완료라고 말할 가능성
- 자료 부족: 외부 참고자료, 원본 자료, 영상, 문서, 사용자 제공 파일이 필요한지
- 도구/의존성 부족: 패키지, 런타임, 브라우저, 플러그인, 커넥터, API 키, 로컬 프로그램이 필요한지
- 검증 공백: 결과를 어떻게 테스트, 확인, 비교, 증명할지
- 복구 위험: 파일, Git 상태, 생성 산출물, 로컬 정리처럼 되돌리기 어려운 부분이 있는지

심각한 실패 가능성마다 예방하거나 검증할 방법을 말한다.
막을 수 없는 실패 가능성이 있으면 계속 진행하기 전에 한계를 보고한다.

### 도구와 의존성 처리

필요한 도구, 의존성, 접근 권한이 없다는 말을 흐릿한 변명처럼 쓰지 않는다.
도구, 패키지, 런타임, 커넥터, 브라우저 기능, API 키, 소스 파일이 정말 필요하면 명확하게 말한다.

처리 순서는 다음과 같다.

1. 기존 로컬 도구나 사용 가능한 커넥터로 해결 가능한지 확인한다.
2. 무료이며 설치 가능한 의존성이 필요하면 사용자에게 설치 또는 활성화 허가를 요청한다.
3. 유료 제품, 유료 API, 라이선스 자산, 계정 제한 서비스가 필요하면 그 한계를 보고하고 사용자 제공 접근 권한 또는 무료 대안을 제시한다.
4. 사용자가 필요한 도구나 접근 권한을 승인하지 않으면, 축소된 범위가 유효할 때만 계속한다.
5. 필수 도구나 자료가 없으면 `Complete`라고 하지 않는다. 상황에 따라 `Blocked`, `Cannot judge completion`, `Research incomplete`, `Implemented, not verified`를 사용한다.

### 검증 계획

단순하지 않은 구현, 조사, UI, 게임, Git, 정리 작업은 실행 전 또는 실행 중 검증 방법을 정한다.
최종 보고에서는 실제 수행한 검증이 그 계획과 맞는지 비교한다.
검증을 못 했으면 직접 말하고 `Complete`를 쓰지 않는다.

### 진행 체크포인트와 기준 이탈 방지

오래 걸리거나 여러 단계로 나뉘거나 위험도가 높은 작업은 실행 전 또는 실행 중 체크포인트를 만든다.
각 체크포인트에는 무엇이 끝났는지, 무엇이 남았는지, 원래 범위와 현재 작업이 여전히 맞는지, 새 위험/도구 부족/자료 부족/검증 공백이 생겼는지를 적는다.

다음 경우에는 체크포인트를 사용한다.

- 작업 단계나 파일이 여러 개인 경우
- 조사, 외부 자료, 생성 산출물, 브라우저 검증, Git 상태에 의존하는 경우
- 작업 중 사용자의 새 메시지가 들어온 경우
- 중단, 요약, 컨텍스트 손실 뒤 대화가 재개된 경우
- 계획한 단계가 예상보다 오래 걸리거나 예상과 다른 결과가 나온 경우

중단이나 새 사용자 메시지 이후에는 계속하기 전에 최신 사용자 지시를 다시 확인한다.
새 지시가 목표를 바꿨는데 이전 지시 기준으로 마무리하지 않는다.

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
Confirm instruction -> Check records -> Present scope/criteria -> Identify failure modes -> Define verification/tool needs -> Get approval when risky -> Execute -> Verify -> State completion level -> Report remaining risk
```

Codex는 안전, 속도, 편의, 추정이라는 이유로 사용자의 지시를 조용히 바꾸면 안 된다.
애매하거나 위험하거나 중요한 작업은 반드시 사용자에게 보이게 만든 다음 진행한다.
