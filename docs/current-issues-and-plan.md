# 현재 문제점과 해결 방법

작성일: 2026-05-24

> 2026-05-26 업데이트: 이 문서는 이전 정적 HTML/밝은 파스텔 검증 샘플 기준의 문제 정리다. 새 개발은 `docs/development-foundation.md`, `docs/data-schema-draft.md`, `docs/reference-role-map-template.md`, `docs/vertical-slice-acceptance.md`를 우선한다. 기존 품질 감사와 `docs/vertical-slice/proof.html`은 과거 산출물 판단용 참고다.

## 목적

이 문서는 2026-05-23 대화 이후 확인된 문제, 반복된 실패 패턴, 해결 방법, 그리고 현재 Git에 올리는 산출물의 의미를 정리한다. 핵심은 "많이 만들었다"가 아니라 "검증 가능한 품질 기준을 통과했는가"로 개발 기준을 바꾸는 것이다.

## 지금 확인된 문제

1. 본편은 아직 완성 게임이 아니다.
   - 시스템은 일부 작동하지만, 콘텐츠와 그래픽은 최종품으로 믿을 수 없다.
   - 카드 113장, 보석 58종, 업적 161개 같은 수량은 품질 증명이 아니다.

2. 데이터는 개발용 골격에 가깝다.
   - 카드/보석/몬스터/스테이지/업적에 템플릿 반복이 많다.
   - 참조와 실행 검증은 가능하지만, 재미와 밸런스가 검증된 콘텐츠는 아니다.

3. 본편 그래픽은 최종 그래픽이 아니다.
   - 본편의 카드 아트, 몬스터 초상, 스테이지 키아트, 이벤트 장면, 아이콘은 대부분 CSS/DOM 임시 표현이다.
   - 따라서 현재 본편 화면을 실제 목표 퀄리티로 보면 안 된다.

4. 기존 검증 방식이 부족했다.
   - `npm run check`는 참조/실행 오류를 잡는 기술 검증이다.
   - 콘텐츠 반복성, 그래픽 품질, 실제 플레이 화면 완성도는 잡지 못했다.

5. 처음 만든 검증 샘플도 판단에 부족했다.
   - 카드 1장만 크게 보여 실제 손패 5장 배치가 보이지 않았다.
   - 전투 화면이 영상인지, 정적 화면인지, 실제 플레이 UI인지 판단하기 어려웠다.

## 계속 반복된 문제

- 수량을 완성도로 착각했다.
- 템플릿 생성 데이터를 실제 콘텐츠처럼 말했다.
- CSS 임시 그래픽을 실제 그래픽 진행처럼 다뤘다.
- 중간 검증물을 작게 보여주고 승인받는 절차가 없었다.
- 사용자가 나중에야 확인할 수 있는 부분을 내가 먼저 방어하지 못했다.
- "시스템", "데이터", "그래픽", "기획 품질"을 구분해서 보고하지 않았다.

## 해결 방법

1. 개발 확장 중단
   - 새 카드, 새 몬스터, 새 스테이지, 새 시스템을 더 얹지 않는다.
   - 지금은 감사와 검증 기준을 먼저 세운다.

2. 품질 감사 스크립트 추가
   - `node tools/content-quality-audit.mjs --report-only`
   - 현재 본편이 왜 최종품이 아닌지 반복 구조와 임시 그래픽을 수치로 보여준다.

3. 작은 검증물부터 확인
   - `docs/vertical-slice/proof.html`
   - 손패 5장, 몬스터 1종, 전투 판단 UI를 한 화면에서 보여준다.
   - 사용자가 이 기준을 인정하지 않으면 본편 개발을 계속하지 않는다.

4. 검증 샘플 smoke test 추가
   - `node tools/vertical-slice-proof-smoke.mjs`
   - 데스크톱/모바일에서 필수 한글 문구, 카드 5장, 이미지 참조, 텍스트 넘침을 확인한다.

5. 전투 표현 기준 고정
   - 전투는 영상 컷신이 아니다.
   - 기본은 정적 전투 화면이다.
   - 카드 사용, 피격, 피해 숫자, 의도 변화만 짧은 UI 애니메이션으로 처리한다.

## 이번에 Git에 올리는 산출물

- `docs/recovery-audit.md`: 현재 프로젝트가 왜 풀 완성이 아닌지 정리
- `docs/handoff.md`: 다른 개발자가 이어받을 수 있는 인수인계서
- `docs/current-issues-and-plan.md`: 현재 문제, 해결 방법, 반복 문제 정리
- `docs/vertical-slice/proof.html`: 손패 5장 기준 검증 샘플
- `docs/vertical-slice/*.png`: 검증 샘플용 bitmap 원본과 렌더링 스크린샷
- `tools/content-quality-audit.mjs`: 본편 품질 감사 게이트
- `tools/vertical-slice-proof-smoke.mjs`: 검증 샘플 렌더링 확인
- `package.json`: 감사/검증 스크립트 등록

## 다음 기준

다음 개발은 이 순서를 지켜야 한다.

1. 사용자가 `docs/vertical-slice/proof.html`을 보고 목표 퀄리티로 인정한다.
2. 인정되면 본편 전투 화면에 같은 구조를 이식한다.
3. 카드/몬스터/스테이지/보석/업적은 대량 확장이 아니라 한 묶음씩 재기획한다.
4. `content-quality-audit`의 실패 항목을 하나씩 줄인다.
5. 다시 수량으로 완료를 말하지 않는다.
## 2026-06-05 Current UI Concept-Art Plan

Status: `Partially complete`.

The current active goal is to make the game UI match the concept art at similar quality. This is not done.

Detailed continuation handoff:

- `docs/ui-concept-raster-handoff-2026-06-05.md`
- `docs/other-pc-handoff-2026-06-09.md` for a short clone-and-continue checklist on a different PC.

Current best estimate:

- Overall active UI goal: about 91% after the disabled explanation-tooltip pass, following the responsive readability-tooltip pass, the first visible readability-tooltip pass across ten primary raster scenes, the WorldMap late completed-stack split, route-progress current-leg variant, late current-node body/frame split, mid dormant-node split, and far red locked-node split. This is still WIP rather than final approval.
- Static first-view concept matching is ahead of interaction/dynamic-state work.
- WorldMap state truth is still a visible unfinished area, though it now has first-pass runtime current/completed/locked/sealed/dormant overlays, late current-node, mid dormant-node, and far red locked-node body/frame variants, first concept-derived route-progress bead/thread overlays plus a brighter current-leg route variant, and progressed-save audits for stage 4 current state and stage 9 current / stage 10 first-red-lock state.

Completed progress in this checkpoint:

- Primary scenes now use raster concept-underlay paths instead of old procedural UI shells.
- Shared raster hit targets now avoid visible Phaser vector rectangles on concept screens.
- First bitmap hover/down/disabled/current-state assets exist and are registered.
- WorldMap primary action moved to the visible bottom-right play button.
- WorldMap current node now uses runtime marker, cleaned halo, a first current body-wash overlay, a first current-frame overlay, and lower status badge from original concept art.
- WorldMap completed/locked/sealed/dormant nodes now have first-pass runtime raster state material derived from the original concept art. The red lock pass was corrected so lower/mid locked nodes no longer use red locks, the gray seal overlay is now reserved for the next lower/mid locked node, the lower baked 1-5 node body colors are muted, and the remaining cyan stage-4 plus 4-to-5 route cues are neutralized so runtime state reads more clearly. A 2026-06-11 follow-up corrected the stage-5 neutralization samples to the actual source coordinates and further muted the stage-5 node plate, lower seal, and 4-to-5 route read. A later same-day pass further reduced the baked stage-4 current-marker and lower-status scar so non-stage-4 states no longer inherit as much of the old concept screenshot's current-state silhouette. A further completed-frame pass added a first `ui_completed_stage_frame_concept` overlay so completed stages have a small source-derived frame treatment in addition to the completed badge. A later locked-frame pass added a first `ui_locked_stage_frame_concept` overlay for upper red locked nodes, masked to avoid carrying the baked stage number, lock center, route fragments, or background. A body-wash pass then added conservative `ui_current_stage_body_wash_concept`, `ui_completed_stage_body_wash_concept`, and `ui_locked_stage_body_wash_concept` overlays so current/completed/locked nodes have a little more concept-derived material under their frame/badge stacks without carrying the source number, check, lock, route, or background as a whole sticker. A sealed-state pass added `ui_sealed_stage_body_wash_concept` and `ui_sealed_stage_frame_concept` for the next lower/mid locked node so the gray sealed state is no longer badge-only. A dormant locked-node pass then added `ui_dormant_stage_body_wash_concept` and `ui_dormant_stage_frame_concept` for non-next lower/mid locked nodes so stages 4-9 no longer rely only on muted baked underlay material.
- WorldMap progressed route segments now have a first `ui_world_map_route_progress_bead_concept` overlay cropped from the original concept's cyan route material. The audit verifies default, stage-4-progress, stage-9-progress, and keyboard-selected states so progressed routes show runtime raster material while keyboard selection does not accidentally show route-progress beads.
- WorldMap progressed route segments now also have a first `ui_world_map_route_progress_thread_concept` overlay cropped/masked from the original concept's cyan route material. The audit verifies route-thread count, placement, size, and alpha in default, stage-4-progress, and stage-9-progress states, and verifies keyboard-selected state still shows zero route-progress thread/bead overlays.
- WorldMap progressed route segments now split the final/current leg from earlier completed legs with `ui_world_map_route_progress_current_thread_concept` and `ui_world_map_route_progress_current_bead_concept`. The audit verifies default state current route counts of 1 thread / 2 beads, stage-4-progress counts of 2 base + 1 current thread and 3 base + 1 current bead, stage-9-progress counts of 7 base + 1 current thread and 11 base + 1 current bead, and zero route overlays in keyboard-selected state.
- WorldMap current nodes after the lower/stage-4 source family now have first `ui_current_stage_late_body_wash_concept` and `ui_current_stage_late_frame_concept` variants. The audit verifies default, stage-4-progress, and keyboard-selected states keep one base current body/frame and zero late current body/frame, while the stage-9 late-progress state reports zero base and one late current body/frame.
- WorldMap dormant locked nodes after the lower family now have first `ui_dormant_stage_mid_body_wash_concept` and `ui_dormant_stage_mid_frame_concept` variants. The audit verifies default state dormant split as 2 base + 4 mid bodies/frames, stage-4-progress as 0 base + 4 mid bodies/frames, and late-progress as zero dormant bodies/frames.
- WorldMap upper red locked nodes now split the next/first red lock from farther red locks with `ui_locked_stage_far_body_wash_concept` and `ui_locked_stage_far_frame_concept`. The audit verifies default and stage-4-progress states as 0 next + 6 far locked bodies/frames, and late-progress as 1 next + 5 far locked bodies/frames.
- WorldMap completed nodes after the lower 1-3 group now have a first `ui_completed_stage_late_badge_concept` variant. The audit verifies default/progressed states keep `visibleCompletedLateBadges=0`, while the stage-9 late-progress state reports `visibleCompletedBaseBadges=3` and `visibleCompletedLateBadges=5`, so later completed nodes no longer reuse the exact lower-node completed badge texture.
- WorldMap completed nodes after the lower 1-3 group now also have first `ui_completed_stage_late_body_wash_concept` and `ui_completed_stage_late_frame_concept` variants. The audit verifies default/progressed states keep late completed body/frame counts at 0, while the stage-9 late-progress state reports 3 base completed bodies/frames and 5 late completed bodies/frames.
- The raster Phaser shell now has a first dynamic accessibility-label layer outside the baked concept images. `src/ui/overlays/accessibilityOverlay.ts` creates a visually hidden `#game-accessibility-summary` and synchronizes the game canvas `aria-label` with scene-specific status/control summaries for Town, WorldMap, Dungeon, Combat, Reward, Event, RuneBench, Boss, Result, and Settings. `tools/ui-accessibility-overlay-audit.mjs` verifies all ten primary scenes expose the hidden status layer and canvas label without adding visible text to the concept-art screenshots.
- The raster Phaser shell now also has a first automated responsive sanity audit. `tools/ui-responsive-raster-audit.mjs` opens Town, WorldMap, Dungeon, Combat, Reward, Event, RuneBench, Boss, Result, and Settings at 1920x1080, 1280x720, and 390x844 portrait. It verifies Phaser FIT canvas sizing, no viewport clipping, raster underlays, zero visible Phaser text/rectangle leaks above the underlays, hidden accessibility layer behavior, and captures screenshots under `tmp/ui-quality/responsive/`.
- The WorldMap neutralized underlay now also mutes sampled old baked red lock centers.
- `tmp/ui-worldmap-action-hit-target-audit.mjs` now verifies both the `stage_sunny_gate` completed / `stage_lavender_hall` current state and a progressed release state with stages 1-3 completed and `stage_peach_canal` current.
- Upper red-lock badges are now aligned to source-concept centers for stages 10-15 and the audit verifies their position, size, and alpha. Mid-route completed badges are smaller than lower 1-3 completed badges so late progression does not cover the route as heavily.
- `tmp/ui-worldmap-action-hit-target-audit.mjs` now also verifies a late release state with stages 1-8 completed, `stage_moon_attic` current, and stage 10 as the first red-locked node.
- Gray-seal density was reduced after screenshot review: early and stage-4-progress audits now expect one next sealed stack, while later non-next lower/mid nodes rely on the neutral gray node art instead of extra seal markers. The next sealed stack now includes body-wash/frame/badge material.
- WorldMap node hover no longer uses the detached component-sheet route token. The current-stage halo extraction now masks out the top marker and route-dot fragments, and WorldMap node hover/down uses that cleaned halo with additive blending. `tmp/route-node-raster-hover-state-audit.mjs` now seeds a stage-2 progress state and verifies the hover on a completed non-current node separately from the current marker.
- WorldMap current node now also has a first concept-derived `ui_current_stage_frame_concept` overlay. The extraction masks the baked stage number, top marker, route fragments, status badge, and parchment background as much as possible so the current state can move between nodes without carrying the old stage-4 number or route pieces. This is a current-frame pass, not full current-node body recomposition.
- WorldMap completed stages now also have a first concept-derived `ui_completed_stage_frame_concept` overlay. The extraction masks the completed source node's baked number, check, route fragments, and background as much as possible, while the existing completed badge still owns the check mark. This is a completed-frame pass, not full completed-node body recomposition.
- WorldMap raster mode now has a first keyboard stage-selection pass: arrow keys choose the nearest unlocked node in the pressed map direction using the concept node coordinates, then reuse the existing runtime current marker/halo/status stack. `tmp/ui-worldmap-action-hit-target-audit.mjs` verifies `ArrowLeft` from `stage_lavender_hall` selects `stage_sunny_gate` and captures `tmp/ui-quality/worldmap/worldmap-keyboard-stage-select-v1-1920.png`.
- After keyboard-selection screenshot review, the lower 1-3 baked check silhouettes received a source-aware neutral patch. The latest WorldMap audit samples now read `node1check=[97,85,69]`, `node2check=[95,84,69]`, and `node3check=[99,87,71]`, so those areas no longer carry green/cyan completed-state dominance even though full lower-node recomposition is still unfinished.
- Late-progress WorldMap completed badges now have a node-family placement pass: stages 6 and 7 sit closer to their illustrated node bases, and the stage-8 route-point marker is smaller/quieter because the concept art does not expose a full numbered node there. The late audit still verifies eight completed badges, but screenshot review shows less route-floating weight.
- Reward/Event raster choice pressed states now reuse the same `ui_hover_choice_badge_concept` family as their hover state instead of falling back to the shared pressed stamp. This keeps card-choice hover/down language on the card header badge axis.
- All ten audited raster pressed/down targets now avoid the shared `ui_down_pressed_stamp_concept` as their expected visible state. The current pass reuses each control family's concept-derived bitmap language: WorldMap play button, Dungeon route node, Combat gold seal, Reward/Event choice badge, Boss skull stamp, and the action seal used by Town/RuneBench/Result/Settings.
- Settings now has a dedicated 10-control raster pressed audit, matching its existing hover coverage. Screenshot review found the return-to-town feedback floating above the bottom-right red check button, so that hit target was re-anchored to the visible concept button. A later pass replaced its shared action-seal feedback with button-specific hover/down art cropped from the Settings concept underlay.
- Settings reset-save and reset-defaults now also have button-panel-specific hover/down art cropped from the Settings concept underlay. The reset-save skull card and reset-defaults gear card no longer use the shared action-seal family in the Settings per-control hover/pressed audits.
- Settings volume sliders, display-mode selector, large-text toggle, reduced-motion toggle, and space-confirm toggle now also have row/control-specific hover/down art cropped from the Settings concept underlay. All ten audited Settings controls now use Settings-specific raster hover/down art instead of the shared action-seal family.
- Town, RuneBench, and Result representative utility targets now have screen-specific hover/down art cropped from their own concept underlays instead of using the shared action-seal family. The 10-screen hover audit now verifies expected hover keys, and the down audit now expects `ui_down_town_expedition_action_concept`, `ui_down_runebench_action_rail_concept`, and `ui_down_result_action_card_concept`. Town's lower backpack/reset and gear/settings toolbar controls now have their own state art, while the ambiguous central legacy reset/settings coordinates keep click behavior without shared seal feedback. RuneBench lower confirm and Result lower return now also have dedicated hover/down audit evidence.
- Town, RuneBench, and Result now have first keyboard-confirm raster feedback evidence. Enter/confirm briefly shows the same concept-derived down art used by pointer press before the existing action advances, verified by `tmp/keyboard-confirm-raster-state-audit.mjs`.
- Reward and Event now also have first keyboard-confirm raster feedback evidence. Enter/confirm briefly shows the existing `ui_hover_choice_badge_concept` pressed state on the first Reward card badge or first affordable Event choice badge before the existing confirm flow advances.
- Dungeon now also has first keyboard-confirm raster feedback evidence. Enter/confirm briefly shows the existing `ui_hover_route_node_concept` pressed state on the primary route-node confirm target before the existing dungeon confirm flow advances.
- Combat and Boss now have first keyboard-action raster feedback evidence. `Digit1` and `KeyE` briefly show the existing local raster down state on the audited card and end-turn controls before the existing action runs.
- Combat and Boss now have first cost-disabled card raster evidence. Cards whose effective combat cost is higher than current player energy show the existing `ui_disabled_lock_stamp_concept` bitmap instead of hover/down affordance, and the disabled pointer/keyboard paths do not advance or add blocked-card log churn.
- Settings now has first keyboard-cancel raster feedback evidence for its existing return action. `Escape` briefly shows `ui_down_settings_return_button_concept` on the bottom-right return/check button before the unchanged Town transition runs. This does not add a Settings Enter/confirm behavior.
- Settings now has first keyboard navigation/focus evidence across its ten audited controls. Arrow keys reuse the existing Settings-specific hover bitmaps as focus, and Enter reuses the existing down bitmap before running the focused control's existing action.
- Broad Phaser smoke is passing again for this checkpoint. The smoke runner now has step filtering/progress timing, release passive subcase progress logs, longer keyboard settle timing for the delayed raster down feedback path, and state-waiting loops for repeated combat key actions. The full wrapper run ended with `Phaser smoke OK` after `checkBossResultFlow OK`.
- Reward and Event now have first directional keyboard-focus evidence on their raster choice cards. Arrow keys focus selectable choices using the existing `ui_hover_choice_badge_concept` badge, Enter shows the same badge at pressed size before activating the focused choice, and the audit verifies the focused second Reward/Event choice actually runs rather than falling back to the first/default confirm target.
- Broad Phaser smoke was rerun after the Reward/Event keyboard-focus input change and passed again with `Phaser smoke OK`.
- Town, RuneBench, and Result now have first utility keyboard-focus evidence. Their visible raster utility controls reuse existing screen-specific hover bitmaps as focus and existing down bitmaps for focused activation. Town keeps the ambiguous central legacy reset/settings coordinates click-only while including only the visible expedition, lower settings/gear, and lower reset/backpack controls in keyboard focus.
- Broad Phaser smoke was rerun after the Town/RuneBench/Result utility-focus input change and passed again with `Phaser smoke OK`.
- Combat and Boss now have first directional keyboard-focus evidence. Arrow keys can focus the first playable card and end-turn control using the existing Combat gold seal and Boss skull stamp hover bitmaps, and Enter reuses the existing pressed-size bitmap before advancing the turn. The new focused activation audit verifies exact focus id, state key, coordinate, size, no Phaser text, no visible rectangle overlays, and turn 1 to turn 2 progression.
- Broad Phaser smoke was rerun after the Combat/Boss keyboard-focus input change and passed again with `Phaser smoke OK`.
- Dungeon now has first directional keyboard-focus evidence. Arrow keys can focus the central room node and the lower confirm panel using the existing `ui_hover_route_node_concept` bitmap, and Enter reuses the pressed-size route-node bitmap before entering the current room. The new focused activation audit verifies exact focus id, state key, coordinate, size, no Phaser text, no visible rectangle overlays, and transition from `dungeon` to `combat`.
- Targeted Dungeon focus, keyboard-confirm, route-node hover, 10-screen hover, 10-screen down, and `npm.cmd run check` gates passed after this Dungeon focus input change.
- A 2026-06-11 fresh-clone continuation reran the full broad Phaser smoke after the Dungeon focus change and got `Phaser smoke OK`. The same continuation then applied the WorldMap stage-5 neutralized-underlay correction and reran the full broad smoke again with `Phaser smoke OK`. The later stage-4 scar-neutralization pass also reran the full broad smoke; the first 184s wrapper attempt timed out during `checkReleasePassiveBatch`, then the longer rerun completed with `Phaser smoke OK`. A further current-frame pass added `ui_current_stage_frame_concept`, updated release asset sharing, and reran WorldMap audits plus broad smoke with `Phaser smoke OK`. A completed-frame pass then added `ui_completed_stage_frame_concept`, updated the audit to check completed-frame count/placement/style, and reran WorldMap audits plus broad smoke with `Phaser smoke OK`. A locked-frame pass then added `ui_locked_stage_frame_concept`, updated the audit to check locked-frame count/placement/style/current-node absence, and reran WorldMap audits plus broad smoke with `Phaser smoke OK`. A body-wash pass then added current/completed/locked body-wash overlays, updated the audit to check body count/placement/style/current-node absence, and reran WorldMap audits plus broad smoke with `Phaser smoke OK`. A sealed body/frame pass then added `ui_sealed_stage_body_wash_concept` and `ui_sealed_stage_frame_concept`, updated the audit to check sealed stack count/placement/style/current-node absence, and reran WorldMap audits plus broad smoke with `Phaser smoke OK`. A dormant lower/mid locked-node pass then added `ui_dormant_stage_body_wash_concept` and `ui_dormant_stage_frame_concept`, updated the audit to check dormant count/placement/style/current-node absence, and reran WorldMap audits plus broad smoke with `Phaser smoke OK`.
- The next same-day route-progress bead pass added `ui_world_map_route_progress_bead_concept`, updated the WorldMap audit to check route-bead count/placement/style across default, stage-4-progress, stage-9-progress, and keyboard-selected states, and reran WorldMap audits plus broad smoke with `Phaser smoke OK`.
- A 2026-06-13 route-progress thread pass added `ui_world_map_route_progress_thread_concept`, updated the WorldMap audit to check route-thread count/placement/style across default, stage-4-progress, stage-9-progress, and keyboard-selected states, and reran WorldMap audits plus broad smoke with `Phaser smoke OK`.
- A 2026-06-13 accessibility-label pass added the first off-canvas dynamic status/control summaries for all ten primary raster scenes. The new audit passed for Town, WorldMap, Dungeon, Combat, Reward, Event, RuneBench, Boss, Result, and Settings with a 1x1 hidden DOM region plus synchronized canvas `aria-label`. Route-node hover, WorldMap state audit, `npm.cmd run check`, `git diff --check`, and the full broad Phaser smoke also passed after this pass.
- A 2026-06-13 responsive sanity pass added `tools/ui-responsive-raster-audit.mjs`. It passed across all ten primary raster scenes at 1920x1080, 1280x720, and 390x844. The mobile portrait captures confirm the game is not clipped and the DOM/accessibility layers do not leak, but they also show a narrow 16:9 canvas (`390x219`) with large portrait letterboxing, so mobile portrait UX remains a final-review item rather than approved completion.
- A 2026-06-13 late completed-badge variant pass added `ui_completed_stage_late_badge_concept`, updated the WorldMap audit to split completed badge counts into lower base and later variants, and reran WorldMap audits, route-node hover audit, `npm.cmd run check`, and the full broad Phaser smoke with `Phaser smoke OK`.
- A 2026-06-13 late completed-stack variant pass added `ui_completed_stage_late_body_wash_concept` and `ui_completed_stage_late_frame_concept`, updated the WorldMap audit to split completed body/frame counts into lower base and later variants, and reran WorldMap audits, route-node hover audit, `npm.cmd run check`, and the full broad Phaser smoke with `Phaser smoke OK`.
- A 2026-06-13 route current-leg variant pass added `ui_world_map_route_progress_current_thread_concept` and `ui_world_map_route_progress_current_bead_concept`, updated the WorldMap audit to split base/current route thread and bead texture-family counts, and reran WorldMap audit, route-node hover audit, `npm.cmd run check`, `git diff --check`, and targeted route/view smoke with `Phaser smoke OK`. A full broad smoke attempt logged all smoke steps through `checkBossResultFlow OK` but timed out during process cleanup before the command returned.
- A 2026-06-13 late current-node stack variant pass added `ui_current_stage_late_body_wash_concept` and `ui_current_stage_late_frame_concept`, updated the WorldMap audit to split base/late current body/frame counts, and reran WorldMap audit, route-node hover audit, `npm.cmd run check`, `git diff --check`, and targeted route/view smoke with `Phaser smoke OK`.
- A 2026-06-13 mid dormant-node stack variant pass added `ui_dormant_stage_mid_body_wash_concept` and `ui_dormant_stage_mid_frame_concept`, updated the WorldMap audit to split base/mid dormant body/frame counts, and reran WorldMap audit, route-node hover audit, `npm.cmd run check`, `git diff --check`, and targeted route/view smoke with `Phaser smoke OK`.
- A 2026-06-13 far red locked-node stack variant pass added `ui_locked_stage_far_body_wash_concept` and `ui_locked_stage_far_frame_concept`, updated the WorldMap audit to split next/far red locked body/frame counts, and reran WorldMap audit, route-node hover audit, `npm.cmd run check`, `git diff --check`, and targeted route/view smoke with `Phaser smoke OK`.
- A 2026-06-14 visible readability-tooltip pass added `src/ui/overlays/readabilityOverlay.ts` and `tools/ui-readability-tooltip-audit.mjs`. It wires visible DOM tooltips into representative raster controls for Town, WorldMap, Dungeon, Combat, Reward, Event, RuneBench, Boss, Result, and Settings while keeping the canvas concept layer textless. The audit passed for all ten scenes and screenshot review of Combat/Settings confirmed the tooltips are readable without covering the main playfield.
- A follow-up 2026-06-14 responsive tooltip pass makes the tooltip size itself from the canvas and, on narrow portrait letterboxed screens, places the tooltip in the unused letterbox area rather than over the 16:9 playfield. `tools/ui-readability-tooltip-audit.mjs` now verifies all ten scenes at 1920x1080, 1280x720, and 390x844; mobile cases must stay in the viewport without overlapping the canvas.
- A later 2026-06-14 disabled explanation-tooltip pass extends `renderRasterDisabledHitTarget` so locked controls can show the same DOM tooltip layer without becoming clickable. Event unaffordable choices now explain missing HP/gold conditions, and Combat/Boss cost-disabled cards explain current energy versus required energy using the same adjusted-cost path as gameplay. `tmp/ui-disabled-raster-audit.mjs` and `tmp/combat-boss-disabled-raster-state-audit.mjs` now verify the visible danger-tone tooltip plus unchanged blocked input behavior.

Next recommended work:

1. Continue refining later current/completed/dormant/locked-node stage-family variants and remaining baked route/node state against the concept; the late current stack split, late completed stack split, mid dormant split, far red locked split, and current route-leg split are cleaner now but not final node or route recomposition approval.
2. Continue neutralizing or replacing baked node/route geometry where it conflicts with runtime state, especially missing/weak later node variants, lower-node shape silhouettes, route-line state marks, and route-progress material that still does not amount to a complete runtime route system.
3. Refine selected/focus/keyboard state art without falling back to Phaser vector overlays. WorldMap directional keyboard selection, Town/Reward/Event/Dungeon/RuneBench/Result keyboard-confirm feedback, Dungeon directional focus, Reward/Event directional choice focus, Town/RuneBench/Result utility focus, Combat/Boss keyboard card/end-turn feedback plus directional focus, and Settings keyboard-cancel plus keyboard-focus feedback now have first evidence, but this is not final keyboard/focus coverage across screens.
4. Continue deeper pressed/down, disabled, and focus review beyond the audited representative/current controls. Settings' ten audited controls, Town's lower toolbar controls, RuneBench lower confirm, Result lower return, the Town/RuneBench/Result representative utility targets, and Combat/Boss cost-disabled cards now have first evidence, but selected/focus state art, broader disabled-state breadth, remaining legacy UX decisions, and final keyboard-focus approval are still missing.
5. Continue dynamic labels/tooltips/accessibility-safe text work beyond the first hidden DOM label pass, first visible tooltip pass, responsive tooltip placement audit, and representative disabled explanation pass. Representative safe tooltip zones now exist, including mobile portrait letterbox placement and locked-control explanations, but broader gameplay-critical readable text, selected/focus tooltip consistency, and user acceptance are still unfinished.
6. Continue mobile/responsive review beyond the first automated sanity pass, especially the portrait letterbox presentation and whether the game needs a deliberate mobile framing/orientation treatment.
7. Continue WorldMap recomposition beyond neutralized samples, first-pass badges, the first current/completed/locked/sealed/dormant body/frame overlays, the late current/completed, mid dormant, and far red locked splits, and the first route-progress bead/thread/current-leg overlays. The latest stage-5/stage-4 corrections and state body/frame/route passes reduce stale state reads but do not replace full current/completed/locked/sealed/dormant body variants or a complete dynamic route-state system.

Known unfinished scope:

- Full WorldMap current/completed/locked/sealed/dormant recomposition beyond first-pass badges, the late current/completed-stack, mid dormant, and far red locked splits, body washes, frames, and route-progress bead/thread/current-leg overlays.
- Selected/focus/keyboard state art beyond the first WorldMap directional-selection pass, Town/Reward/Event/Dungeon/RuneBench/Result keyboard-confirm feedback pass, Dungeon directional focus pass, Reward/Event directional choice-focus pass, Town/RuneBench/Result utility-focus pass, Combat/Boss keyboard-action plus directional focus pass, and Settings keyboard-cancel/focus feedback pass.
- Broad disabled-state coverage beyond Event unaffordable choice and Combat/Boss cost-disabled cards.
- Screen-specific pressed/down art beyond the currently audited controls.
- Dynamic readability and visible tooltip/safe-text zones beyond the first hidden accessibility-label layer, representative visible tooltip pass, responsive tooltip placement audit, and first disabled explanation pass.
- Mobile portrait UX/framing beyond the first automated responsive sanity audit. The 390x844 pass proves no clipping but still letterboxes the 16:9 canvas heavily.
- Broad Phaser smoke is passing for the 2026-06-13 WorldMap late completed-stack variant, route-progress thread, and hidden accessibility-label checkpoints, but it remains a regression gate rather than proof of final UI approval.
- User acceptance.
- Final 95% or release-ready UI.
