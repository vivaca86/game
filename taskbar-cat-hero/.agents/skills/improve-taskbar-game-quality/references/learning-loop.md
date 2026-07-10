# Feedback-to-Skill Learning Loop

This process creates durable project learning; it does not retrain the underlying model. Persistence comes from reviewed repository files that future agents load.

## Capture the Event

Record the user's feedback and observable evidence without softening it. Include:

```text
Date / task:
Requested outcome:
Observed symptom:
Artifact, state, or file:
Failed route:
Objective evidence:
User acceptance signal:
Immediate disposition: rejected | superseded | provisional | accepted
```

Screenshots, source paths, frame/state names, timing, display size, hashes, mask bounds, and reproduction steps are stronger than adjectives alone. Redact secrets.

## Separate Observation From Explanation

Write three distinct statements:

1. **Observation:** what was visibly or mechanically wrong.
2. **Cause hypothesis:** what may have produced it.
3. **Evidence level:** what is known versus inferred.

Use these levels:

- **Observed:** symptom documented, cause not established.
- **Reproduced:** symptom repeats under known conditions.
- **Corrected:** a changed route removes the symptom under stated checks.
- **User accepted:** the user approves the relevant visual/behavioral result.
- **Contradicted:** later evidence invalidates the earlier rule or approval.

Never label a causal hypothesis `Corrected` merely because a different result looks better once.

## Run One Bounded Correction

Before retrying, state what changes and what remains controlled. Compare against the failed artifact at the same display size and timing. If the attempt fails, preserve the signature and change route; do not issue an unchanged retry.

For generated anatomy/contact, seams, or registration, two targeted failures force a structural reroute. Prefer master reuse, deterministic layers, broader contact geometry, or a different concept.

## Decide Where the Lesson Belongs

| Evidence type | Destination |
|---|---|
| Exact user/assistant exchange and completion status | `docs/conversation-log.md` |
| Project visual failure and recovery decision | `docs/recovery-audit.md` |
| Current live decision and next acceptance gate | `docs/current-issues-and-plan.md` |
| Repeatable environment/tool failure and verified route | `docs/workaround-ledger.md` |
| Durable product, IP, image, Unity, or shipping rule | `PROJECT_RULES.md` |
| Reusable taskbar art/motion/interaction/QA method | this skill |

One event may update multiple destinations, but do not duplicate long prose. Keep the detailed evidence in the project record and a concise operational rule in the skill.

## Promote Only Reusable Learning

Promote a lesson into this skill only when it has:

- a recognizable trigger or symptom;
- evidence from an artifact, test, playback, or explicit user decision;
- a bounded failed route;
- a corrected route or clearly labeled provisional direction;
- a verification method;
- stop/reroute conditions;
- known scope and exceptions.

One-off taste remains a project decision. Tool-specific trivia remains a workaround. A current user instruction always overrides a promoted rule.

Add repeated failure signatures to `failure-patterns.md`. Add required pass/fail criteria to `quality-gates.md`. Keep the main `SKILL.md` concise and change it only for workflow-level rules that should run on most relevant tasks.

## Demote or Correct Stale Learning

When new evidence conflicts with an old lesson:

1. Do not silently rewrite history.
2. Mark the earlier approval or inference contradicted in the relevant project record.
3. State why the environment, evidence, or user direction changed.
4. Narrow, demote, or replace the skill rule.
5. Re-run validation and a representative forward test.

The most recent verified route wins over an older workaround. The latest user decision wins over both.

## Validate a Skill Update

Run from the project root:

```powershell
python .agents/skills/improve-taskbar-game-quality/scripts/collect_project_context.py --self-test
python "$env:USERPROFILE/.codex/skills/.system/skill-creator/scripts/quick_validate.py" .agents/skills/improve-taskbar-game-quality
```

If Codex is installed elsewhere, locate the installed official `skill-creator` and use its validator rather than skipping validation.

Then ask a fresh agent to handle a realistic request such as:

```text
The taskbar baker's new three-frame reaction looks attractive in stills, but at 128px the body shifts and the bread task label still says stew. Review it and tell me what you would do next.
```

Do not give that agent the expected conclusion. Check whether it independently:

- reads current project evidence;
- detects both motion and semantic failures;
- refuses to call still-image QA sufficient;
- chooses a lower-risk correction route;
- uses a precise completion status;
- identifies what should and should not become a reusable rule.

Record the test outcome, failed expectations, and subsequent skill change in `docs/conversation-log.md`.
