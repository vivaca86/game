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

Current best estimate:

- Overall active UI goal: about 68%.
- Static first-view concept matching is ahead of interaction/dynamic-state work.
- WorldMap state truth is still a visible unfinished area, though it now has first-pass runtime current/completed/locked/sealed overlays plus progressed-save audits for stage 4 current state and stage 9 current / stage 10 first-red-lock state.

Completed progress in this checkpoint:

- Primary scenes now use raster concept-underlay paths instead of old procedural UI shells.
- Shared raster hit targets now avoid visible Phaser vector rectangles on concept screens.
- First bitmap hover/down/disabled/current-state assets exist and are registered.
- WorldMap primary action moved to the visible bottom-right play button.
- WorldMap current node now uses runtime marker, halo, and lower status badge from original concept art.
- WorldMap completed/locked/sealed nodes now have first-pass runtime raster badges derived from the original concept art. The red lock pass was corrected so lower/mid locked nodes no longer use red locks, the gray seal overlay is now reserved for the next lower/mid locked node, the lower baked 1-5 node body colors are muted, and the remaining cyan stage-4 plus 4-to-5 route cues are neutralized so runtime state reads more clearly.
- The WorldMap neutralized underlay now also mutes sampled old baked red lock centers.
- `tmp/ui-worldmap-action-hit-target-audit.mjs` now verifies both the `stage_sunny_gate` completed / `stage_lavender_hall` current state and a progressed release state with stages 1-3 completed and `stage_peach_canal` current.
- Upper red-lock badges are now aligned to source-concept centers for stages 10-15 and the audit verifies their position, size, and alpha. Mid-route completed badges are smaller than lower 1-3 completed badges so late progression does not cover the route as heavily.
- `tmp/ui-worldmap-action-hit-target-audit.mjs` now also verifies a late release state with stages 1-8 completed, `stage_moon_attic` current, and stage 10 as the first red-locked node.
- Gray-seal density was reduced after screenshot review: early and stage-4-progress audits now expect one next sealed badge, while later non-next lower/mid nodes rely on the neutral gray node art instead of extra seal markers.
- WorldMap node hover no longer uses the detached component-sheet route token. The current-stage halo extraction now masks out the top marker and route-dot fragments, and WorldMap node hover/down uses that cleaned halo with additive blending. `tmp/route-node-raster-hover-state-audit.mjs` now seeds a stage-2 progress state and verifies the hover on a completed non-current node separately from the current marker.
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

Next recommended work:

1. Continue refining later completed-node variants and remaining baked route/node state against the concept; the mid-route completed badge placement is cleaner now but not final art approval.
2. Continue neutralizing or replacing baked node/route geometry where it conflicts with runtime state, especially missing/weak later node variants, lower-node shape silhouettes, and any remaining route-line state marks.
3. Refine selected/focus/keyboard state art without falling back to Phaser vector overlays. WorldMap directional keyboard selection, Town/Reward/Event/Dungeon/RuneBench/Result keyboard-confirm feedback, Combat/Boss keyboard card/end-turn feedback, and Settings keyboard-cancel plus keyboard-focus feedback now have first evidence, but this is not final keyboard/focus coverage across screens.
4. Continue deeper pressed/down, disabled, and focus review beyond the audited representative/current controls. Settings' ten audited controls, Town's lower toolbar controls, RuneBench lower confirm, Result lower return, the Town/RuneBench/Result representative utility targets, and Combat/Boss cost-disabled cards now have first evidence, but selected/focus state art, broader disabled-state breadth, remaining legacy UX decisions, and final keyboard-focus approval are still missing.
5. Add dynamic labels/tooltips/accessibility-safe text strategy outside the baked concept layer.
6. Keep broad Phaser smoke as an ongoing regression gate. It is currently passing, but it is long-running and should be rerun after future keyboard/input/state changes.

Known unfinished scope:

- Full WorldMap current/completed/locked recomposition beyond first-pass badges.
- Selected/focus/keyboard state art beyond the first WorldMap directional-selection pass, Town/Reward/Event/Dungeon/RuneBench/Result keyboard-confirm feedback pass, Combat/Boss keyboard-action feedback pass, and Settings keyboard-cancel/focus feedback pass.
- Broad disabled-state coverage beyond Event unaffordable choice and Combat/Boss cost-disabled cards.
- Screen-specific pressed/down art beyond the currently audited controls.
- Dynamic readability and accessibility-safe text strategy.
- Broad Phaser smoke is currently passing for this checkpoint, but remains a long-running regression gate rather than evidence of final UI approval.
- User acceptance.
- Final 95% or release-ready UI.
