# Game Repository

이 저장소는 이전 정적 카드 크롤러 구현물을 기준으로 이어가지 않는다.

현재 남기는 기준은 두 가지다.

- `research/`: 2026-05-22까지 진행한 방대한 게임 조사/역기획 자료
- 현재 앱/감사 산출물: `src/`, `tools/`, `docs/` 아래의 밝은 카드 던전 실험, 품질 감사, 인수인계, 손패 5장 검증 샘플

## 먼저 볼 문서

- `docs/current-issues-and-plan.md`: 현재 문제점, 반복 실패, 해결 방법
- `docs/handoff.md`: 다른 개발자가 이어받기 위한 인수인계서
- `docs/recovery-audit.md`: 현재 산출물 중 믿을 수 있는 것과 폐기할 것
- `RESEARCH_CHECKLIST.md`: 조사 기준과 남은 검증 항목

## 실행

```bash
node tools/serve-static.mjs
```

브라우저:

```text
http://127.0.0.1:4173/
```

검증 샘플:

```text
http://127.0.0.1:4173/docs/vertical-slice/proof.html
```

## 검증

```bash
node tools/vertical-slice-proof-smoke.mjs
node tools/content-quality-audit.mjs --report-only
```

`content-quality-audit.mjs`가 현재 본편을 `BLOCKED`로 보는 것은 의도된 상태다. 본편 그래픽/데이터가 아직 최종 품질이 아니라는 보호 장치다.

## 정리된 것

아래 이전 구현물은 현재 기준에서 혼동을 만들기 때문에 main에서 제거한다.

- 예전 정적 카드 크롤러 런타임 설명
- 예전 `assets/` 그래픽 묶음
- 예전 `src/content`, `src/rules`, `src/visual`, `src/ui` 기반 런타임
- 예전 `HANDOFF.md`와 구현 중심 README

조사 자료는 `research/`에 보존하고, 실제 새 개발은 `docs/vertical-slice/proof.html` 기준을 사용자가 승인한 뒤에만 진행한다.
