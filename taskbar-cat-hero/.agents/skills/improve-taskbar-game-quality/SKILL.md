---
name: improve-taskbar-game-quality
description: Improve and review taskbar-game character art, sprite motion, desktop-pet reactions, progress loops, image/code semantic consistency, and Unity-ready asset handoff by applying verified project lessons. Use for taskbar cat image generation or editing, animation/runtime integration, visual rejection diagnosis, final-size QA, interaction design, or when user feedback should become a reusable project rule.
---

# Improve Taskbar Game Quality

## Purpose

Turn each taskbar-game art or interaction iteration into a better verified result and, when evidence supports it, a reusable rule. Preserve image quality while reducing repeated failed generations, semantic mismatches, motion defects, and verification gaps.

## Start With Current Evidence

1. Re-read the user's latest instruction. It overrides this skill and older records.
2. From the project root, run:

   ```powershell
   python .agents/skills/improve-taskbar-game-quality/scripts/collect_project_context.py
   ```

3. Read any source asset, runtime file, screenshot, or provenance file directly involved in the request.
4. Treat the collector as a context index, not a substitute for the source documents it points to.
5. If expected records are missing or conflict, report the mismatch before consequential work.

## Classify the Task

Choose every applicable path:

- **Concept:** define what the cat is doing and why it belongs on the taskbar.
- **Asset:** generate, edit, crop, layer, composite, or export image material.
- **Motion:** build or tune idle, input response, state transitions, or progress animation.
- **Integration:** connect art to labels, tasks, rewards, menu state, drag/toggle behavior, or Unity metadata.
- **Review:** diagnose a user-rejected or suspicious result without changing it unless asked.
- **Learning:** decide whether feedback is a one-off preference, project decision, workaround, provisional lesson, or verified reusable rule.

For non-trivial work, state the target, included scope, exclusions, acceptance criteria, likely failure modes, and verification plan before execution.

## Choose the Lowest-Risk Art Route

Use this order unless the user explicitly chooses otherwise:

1. Reuse an approved high-resolution master and deterministic transforms or layers.
2. Apply a tightly masked local edit while keeping pixels outside the mask identical.
3. Generate one new neutral master for concept and final-size approval.
4. Generate multiple full-body frames only after defining registration, anatomy, contact, semantic, and playback gates.

Reuse applies only to an accepted asset. Preserve rejected, superseded, reference, and rough-concept sources for provenance, but remove them from the presentation runtime when they miss the current quality bar. Archival preservation never requires visual retention, and prior effort never creates a reason to keep a weak asset.

For the current one-dough baker, a newly generated multi-pose full-body sheet remains prohibited. Continue from the approved-direction neutral and declared local masks or layers.

Never lower source resolution, detail, expression, or finish merely to simplify browser integration or Unity porting. Preserve the best master and derive runtime material from it.

## Gate the Concept Before Producing States

Require one sentence that makes the scene immediately understandable: **character/job + action + object + game purpose**.

At the intended 128px display size, confirm:

- outfit, prop, and action tell the same story;
- the activity belongs to the persistent taskbar world;
- the scene has a primary promise: production/game progress, companion/pet presence, or a deliberate blend;
- keyboard, mouse, and idle behavior reinforce that promise instead of adding generic movement;
- the expanded window can cause a visible taskbar consequence.

Reject a technically safe image when its action is arbitrary. Do not compensate for a weak concept by producing more frames.

## Build Images and Motion Conservatively

- Keep body, outfit, stage, fixed props, lighting, baseline, and pivot from the same master pixels.
- Prefer broad contact surfaces and fixed anchors. Avoid thin detachable tools, open-paw grips, liquid/rim intersections, and ambiguous occlusion unless a deliberate rig proves them safe.
- Keep exactly two front paws, each visibly connected to a sleeve or forearm.
- Separate local paw/arm, face, contact deformation, and FX layers when practical.
- Use premultiplied-alpha composition and resizing for translucent edges.
- Store prompts, references, source/output hashes, masks, pivots, frame meaning, settings, and rights/prototype status.
- Make idle restrained. Do not loop whole-body displacement merely to show activity.
- Do not confuse root/stage stability with freezing the entire character. Keep the taskbar contact root stable while connected child layers such as shoulder, head, gaze, ear, tail, and forearm carry bounded anticipation, contact, and recovery when a living-character result is required.
- Coalesce dense input pulses and use finite, readable reactions that return to the same registered neutral.
- At final display size, require important impacts to remain readable in three separate channels: limb travel, contact-object response, and material FX. Do not use particles to hide an under-traveling limb, and do not relax a fixed-root/anatomy gate to make a higher tier look stronger.
- Make object-inspection gestures local to the relevant sense and target. A smell action needs a near-vertical approach plus nose-timed pulses or a restrained object-to-nose scent cue; head rotation alone usually reads as curiosity or a tilt.
- Keep progress and rewards independent of typing/click volume. Input may add expression, not macro incentives or covert surveillance.
- Treat completion as a status overlay, not a pose lock; normal reactions may continue.

Read [failure-patterns.md](references/failure-patterns.md) before reusing a previously failed action or generation route.

## Verify the Actual Result

Apply [quality-gates.md](references/quality-gates.md). At minimum:

1. Review the full composed screen once for the named request and once again without that narrow framing. Reject systemic low quality even when the requested bug is fixed.
2. Inspect source-size anatomy, contact, occlusion, and local-edit boundaries.
3. Inspect 128px output on light, dark, and transparent/checker backgrounds.
4. Measure baseline, anchor/pivot, visible bounds, and body/stage drift. The project limit is no more than 1 displayed pixel unless the user changes it.
5. Play every used transition continuously at final speed: idle, reaction, return, loop boundary, state entry/exit, and reduced-motion behavior.
6. Confirm art, task name, icon, phase, reward, and persistent result describe the same activity.
7. For expanded UI, verify composited asset backgrounds, art-family consistency, semantic reuse, typography hierarchy, control states, progress meaning, focal order, and game-specific visual language at actual window size.
8. Exercise drag, click/toggle, completion, and input arbitration when they are in scope.
9. Verify derived Unity metadata without replacing or degrading the master.

A still image, checksum, unit test, static contact sheet, or internal agent approval cannot prove final-speed motion quality. If live playback is unavailable, report `Implemented, not verified`; never silently replace the missing gate with weaker evidence. A user's visual rejection invalidates an internal approval.

If one live-control surface is unavailable, do not equate that with all verification being unavailable. Use the strongest policy-compliant evidence ladder: inspect masters and composites directly; generate deterministic actual-size QA sheets and state exports; inspect user-provided full-screen captures; use another supported capture/control surface only when its own policy and the user's chosen surface allow it; and isolate the exact remaining live-only gate. Installing a safe dependency may add an authorized QA capability, but it never bypasses a platform restriction.

## Reroute Instead of Repeating Failure

- Record the exact symptom and failed route after the first meaningful failure.
- Do not retry an unchanged prompt, tool, permission path, composition method, or animation structure.
- If the same anatomy, contact, seam, or registration defect survives two targeted attempts, stop generation and change the rig, layers, contact geometry, or concept.
- If numeric checks pass but the result looks wrong, improve the visual gate; do not defend the numbers.
- If a safer route removes the activity's meaning, return to concept selection rather than shipping an arbitrary action.
- Follow the latest verified workaround in `docs/workaround-ledger.md`; do not revive an older blocked route unless the environment has materially changed and that change is verified.

## Convert Feedback Into Reusable Learning

After user feedback, a failed attempt, or a successful correction, follow [learning-loop.md](references/learning-loop.md).

Route evidence to the right place:

- current task transcript and status -> `docs/conversation-log.md`;
- visual failure, cause, rejected route, and recovery -> `docs/recovery-audit.md`;
- current accepted/rejected state and next gate -> `docs/current-issues-and-plan.md`;
- repeatable environment/tool workaround -> `docs/workaround-ledger.md`;
- reusable cross-task art, motion, interaction, or verification rule -> this skill's references;
- durable product or asset policy -> `PROJECT_RULES.md` after checking for conflict.

Do not promote a guess or one-off taste into a universal rule. Mark unconfirmed directions as provisional. Promote a lesson only when evidence identifies the symptom, causal mechanism or bounded correlation, corrected route, verification performed, and reuse conditions. Preserve rejected history rather than rewriting it.

After a material skill update:

1. Validate the skill with the official `skill-creator` validator.
2. Run the context collector self-test.
3. Forward-test the skill with a fresh agent and a realistic generic request without supplying the expected conclusion.
4. Record the update and remaining uncertainty in the conversation log.

## Report Status Precisely

End with:

1. what changed;
2. what was actually verified;
3. what remains;
4. what was not done or remains an assumption;
5. whether a new lesson was captured and, if so, its evidence level and destination.

Use `Complete` only after all required quality gates pass. Otherwise use the project's exact status vocabulary.
