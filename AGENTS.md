# Agent Entry

이 파일은 Codex/에이전트 작업 진입점이다.

이 저장소에서 어떤 작업을 시작하기 전에 반드시 아래 문서를 먼저 읽는다.

1. `PROJECT_RULES.md`
2. `docs/handoff.md`
3. `docs/current-issues-and-plan.md`
4. `docs/recovery-audit.md`
5. `RESEARCH_CHECKLIST.md`

## 규칙 우선순위

작업 판단이 충돌할 때는 아래 순서로 따른다.

1. 현재 대화에서 사용자가 직접 지시한 내용
2. `PROJECT_RULES.md`
3. `docs/handoff.md`
4. `docs/current-issues-and-plan.md`
5. `docs/recovery-audit.md`
6. `RESEARCH_CHECKLIST.md`
7. `README.md`와 그 외 `research/` 문서

## 작업 원칙

- 완료되지 않은 조사, 구현, 검증을 완료처럼 말하지 않는다.
- 전수조사는 먼저 100% 체크리스트를 만들고 상태를 추적한다.
- 원격과 로컬 Git 상태가 갈라져 있으면 병합, 리셋, 풀을 임의로 하지 않는다.
- 삭제, 강제 업데이트, `git reset`, force push, 로컬 정리는 반드시 사용자 확인 후 진행한다.
- `content-quality-audit`가 실패하는 현재 상태를 정상 보호 장치로 취급한다.
- 본편 개발은 `docs/vertical-slice/proof.html` 기준 샘플이 사용자에게 승인된 뒤에만 진행한다.
- 수량이 맞는 것을 콘텐츠 완성이나 원작 95% 근접으로 말하지 않는다.
- 대화 원문 로그와 문제 해결 로그는 `PROJECT_RULES.md`의 기준을 따른다.
