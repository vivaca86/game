# Evidence-Backed Failure Patterns

Use this file to recognize repeat failures before spending time or generation budget. `Verified failure` means the defect and route were observed. `Verified correction` means the named mechanical correction passed its stated checks. `Provisional direction` still needs live or user acceptance and must not be described as complete.

## Technical Pass Hides a Systemically Low-Quality UI Composite

- **Evidence:** user-provided menu screenshots and explicit rejection on 2026-07-11; `docs/conversation-log.md` Entries 50–54 and `docs/recovery-audit.md` section `국소 결함 수정과 UI/UX 설계의 혼동`.
- **User-confirmed failure:** the review caught overflow, blank paint, crop, and icon size but failed to reject more basic defects across the whole screen: opaque pale rectangles baked into item art against mismatched card backgrounds; the same stew image repeated without role-specific treatment; generic web-like rounded buttons; decorative or weakly meaningful progress bars; repeated claim cards; mixed icon styles and equal-weight toolbar controls; and uneven generated-image finish.
- **Cause:** the reviewer anchored on the latest named bug, treated the inherited layout as fixed, inspected assets for presence and legibility in isolation, and over-weighted automated tests, hashes, and no-overflow checks. The full screen was handled as a bug report rather than critiqued as a game product.
- **Required reroute:** stop local CSS polishing. Inventory the whole screen's assets, controls, states, typography, hierarchy, and reuse; define the screen purpose and primary flow; compare two or three actual-size wireframes; define one visual system; then implement and review a full composed screen before expanding.
- **Stop condition:** reject any pass that claims quality from asset loading, transparency tests, responsive fit, or unit tests while the full screen still contains mismatched mattes, placeholder-like duplication, generic controls, arbitrary progress, mixed art families, or no focal action.
- **Reuse conditions:** apply to expanded taskbar-game windows, menus, HUDs, inventories, production rows, and management screens. Functional prototypes may temporarily retain rough controls only when they are explicitly labeled as non-presentation placeholders and are not shown as a quality milestone.
- **Evidence level:** the failed review route and visible symptoms are `User confirmed`. The design-first replacement workflow remains `Provisional` until a redesigned screen receives user acceptance.

## Source Preservation Becomes Runtime Attachment

- **Evidence:** user rejection of menu-v1 on 2026-07-11 and the earlier near-total taskbar-cat rebuild; `docs/conversation-log.md` Entry 55.
- **User-confirmed failure:** rough concept images remained attached to the visible menu and were repeatedly cropped, resized, and reframed even though the project explicitly allowed using better reference material or generating coherent replacements.
- **Cause:** `preserve the source` was misread as `preserve the visible implementation`, and prior generation/integration effort created sunk-cost resistance to discarding weak runtime assets.
- **Required reroute:** keep the source, provenance, and rejection record; remove it from presentation runtime; decide whether a clean transparent extraction, tightly controlled derivative, or new reference-matched master is the lowest-risk quality route; then approve the replacement in the full composite before implementation.
- **Stop condition:** reject another crop, matte, border, scale, CSS filter, or slot adjustment when the underlying asset is still visibly incompatible with its role, art family, background, perspective, or finish.
- **Reuse conditions:** applies to concept art, UI icons, portraits, production tiles, buttons, HUD decorations, sprite frames, and any archived prototype. It does not require deleting historical files.
- **Evidence level:** the preservation/runtime distinction and failed route are `User confirmed`; a future replacement set still needs user acceptance.

## One Blocked Capture Surface Is Mistaken for No Verification

- **Evidence:** local `file:` browser-control denial followed by successful review of user-provided screenshots on 2026-07-11; `docs/conversation-log.md` Entries 45–55.
- **Verified failure:** Codex repeatedly described the missing automated local-page capture as a broad verification blocker even though direct asset inspection, target-size composites, state tests, user screenshots, and bounded user interaction checks remained available.
- **Required process:** name the blocked surface precisely, then continue every independent gate that remains valid. Use user-provided captures as real static composition evidence. Keep motion/live interaction status separate from asset and static UI status. Consider another installed capture surface only before binding to a conflicting surface, or after its policy explicitly allows switching; never use it as a forbidden workaround.
- **Stop condition:** do not say `verification is impossible` when only one evidence channel is unavailable. Do not say `complete` when the remaining missing channel is required for the claim.
- **Reuse conditions:** applies to browser, desktop, device, game-engine, remote-session, and connector review where evidence channels have different permissions.
- **Evidence level:** the overly broad blocker statement and successful screenshot alternative are `Observed/Corrected`; automatic capture of this exact local page remains unavailable in the recorded browser-control path.

## Whole-Body Drift and Frantic Idle

- **Evidence:** `docs/recovery-audit.md` sections 2.1 and 3; `docs/conversation-log.md` Entry 13.
- **Verified failure:** unregistered full-body frames with roughly 17px displayed drift played around 70ms per frame, while CSS movement compounded the displacement.
- **Verified correction:** keep a registered neutral, use finite local reactions, remove continuous whole-body transforms, and measure the used frames.
- **Stop condition:** more than 1 displayed pixel of body/stage drift, visible pivot jump, scale flicker, restless idle, or a reaction that does not settle to the same neutral.
- **Do not use:** merely slowing an unregistered strip. Timing cannot repair spatial discontinuity.

## Paw, Tool, Rim, and Liquid Intersections

- **Evidence:** `docs/recovery-audit.md` sections 2.2–6; rejected screenshots under `assets/taskbar-cat-v2/rejected-evidence/`.
- **Verified failure:** thin spatula/ladle shafts, open grips, pot rims, and liquid competing in one small region produced floating tools and a handle through a paw.
- **Verified safer structure:** immutable body/stage, two sleeve-connected paws, broad contact object, fixed anchors, and a 1–2px final-size boundary, shadow, or foreground ridge.
- **Stop condition:** a repeated floating, penetrating, detached, duplicated, or ambiguous contact defect after two targeted attempts.
- **Reroute:** remove detachable geometry or build a deterministic layered rig. Do not spend a third similar prompt.

## Technically Safe but Semantically Arbitrary Action

- **Evidence:** `docs/recovery-audit.md` sections 2.3 and 3.5; `docs/conversation-log.md` Entries 16–19.
- **Verified failure:** removing utensils prevented contact defects, but a chef drumming on a pot no longer read as a coherent job or game action.
- **Current best route:** pass a semantic gate before art production. The baker kneading one dough connects outfit, cat behavior, player rhythm, and food production more naturally.
- **Stop condition:** character/job, prop, action, and reward cannot be named as one immediate activity at 128px.
- **Project-only rejections:** pot drumming and service bells must not return unless the user explicitly reverses those decisions. Do not generalize every project taste to unrelated work.

## Independently Redrawn Full Frames

- **Evidence:** `docs/recovery-audit.md` sections 3.1–6 and 9; `docs/conversation-log.md` Entry 19.
- **Verified failure:** each generated pose reinterpreted anatomy, costume, lighting, stage, prop, and highlights. Alignment could not repair those redraws.
- **Verified correction:** start from one master and composite only registered, declared paw/dough/eye masks. The baker v2 build recorded zero changed full-resolution pixels outside its masks and a common baseline.
- **Stop condition:** outside-mask change, silhouette flicker, body/stage drift over 1px, or repeated seam/anatomy defects.
- **Current restriction:** do not create a new multi-pose full-body sheet for the one-dough baker.

## Transparency and Color-Key Contamination

- **Evidence:** `docs/workaround-ledger.md` entries for soft chroma key, warm-gold false positives, and straight-alpha leakage; `docs/recovery-audit.md` section 9.
- **Verified failure:** global soft mattes left interior key color; straight-alpha resize sampled hidden RGB; an average-channel predicate treated warm gold as green.
- **Verified correction:** use premultiplied-alpha blend/resize, inspect light/dark/checker previews, preserve the master outside declared masks, and use a true channel-dominance predicate for key-color detection.
- **Stop condition:** visible fringe, pinholes, halo, or bulk repair that changes valid art. Inspect flagged coordinates and RGBA before changing thresholds.

## Feathered RGBA Edit Becomes a Dark Sticker or U-Shaped Halo

- **Evidence:** `assets/taskbar-cat-typing-v1/layers/panic-face-overlay.png`; `docs/recovery-audit.md` section 22.
- **Reproduced failure:** pasting an RGBA face source into a transparent layer through a feathered mask premultiplied both RGB and alpha. A later alpha composite and Lanczos resize multiplied the edge again, producing dark rectangular/U-shaped halos even though the source expression was clean.
- **Verified correction:** keep the source RGB unchanged and assign the feather mask exactly once as the layer alpha (`putalpha` or equivalent). Then composite normally and inspect the final-size result on transparent/checker and the approved base.
- **Stop condition:** any local edit boundary reads as a gray/black sticker, rounded rectangle, U shape, or dark ring at 128px. Do not hide it with more blur or color transfer before checking whether the mask was applied twice.
- **Reuse conditions:** applies to feathered RGBA overlays in Pillow-style straight-alpha pipelines. Premultiplied-alpha transforms remain appropriate for resampling/rotation when the representation is converted deliberately and only once.

## Static Decoration With Weak Game or Pet Identity

- **Evidence:** `docs/conversation-log.md` Entries 21–22.
- **Observed problem:** most states look like the same neutral image; player input leaves no persistent result; personality, production phase, and expanded-window consequences are weak.
- **Provisional direction:** establish one readable causal promise before adding animation volume. Show a production stage or persistent result, use phase-aware local reactions, and add restrained pet behavior that does not obscure the work.
- **Stop condition:** the proposal is only a picture carousel, generic bounce, or transient FX with no readable state change.
- **Remaining gate:** asset and runtime implementation plus continuous user review are still required.

## Local Paw Motion Without a Living Kinetic Chain

- **Evidence:** the fast one-dough feel pass in `docs/recovery-audit.md` sections 10–11 and `docs/conversation-log.md` Entries 24–25.
- **User-confirmed failure:** a perfectly frontal, upright, symmetrical cat with fixed head, shoulders, torso, ears, and stage still read as a machine when only registered paw cells changed, even after adding visible progress, slower timing, autonomous presses, blink, and contact puffs.
- **Cause hypothesis:** the active paw has no readable anticipation or follow-through through the forearm/shoulder, no weight transfer, and no gaze or personality response. Random timing and stronger FX cannot replace that connected motion.
- **Provisional reroute:** approve one rig-ready working master with a slightly asymmetric weight-bearing pose, then separate stable root/stage from head/gaze, ears, tail, upper arms/forearms/paws, face, and contact deformation. Animate a bounded hierarchy—attention/anticipation → shoulder/forearm/paw contact → dough response → settle—without moving the taskbar root.
- **Stop condition:** if the proposed correction only changes paw timing, adds particles, randomizes the same hand-only pose, or applies a whole-sprite bob, reject it before implementation. If the body must be independently redrawn for every state, return to the layered-master route instead.
- **Evidence level:** the failure is `User accepted` as a diagnosis; the layered kinetic-chain correction remains `Provisional` until a new neutral and final-speed motion test receive user acceptance.

## Art, Labels, and Reward Tell Different Stories

- **Evidence:** `docs/conversation-log.md` Entries 21–22.
- **Observed problem:** baker/kneading art coexisted with stew/pot task identifiers and language, weakening the fiction.
- **Provisional direction:** align order ID, icon, label, phase, duration, prop, reward, completion result, and collected output around one activity. Reflect management-window recipe/equipment/outfit choices on the taskbar.
- **Stop condition:** any visible system still names or rewards a different activity.

## Input Reaction Becomes Generic or Noisy

- **Evidence:** `docs/conversation-log.md` Entries 21–22 and the v31 failure above.
- **Observed problem:** very brief swaps, identical click/wheel reactions, and event buildup read as weak or frantic rather than responsive.
- **Provisional direction:** respond locally to the current phase, coalesce dense pulses, hold the readable contact beat long enough to see, and return to neutral. Keep economic progress independent of input volume.
- **Stop condition:** queue buildup, whole-body agitation, unrelated phases sharing the same response, or incentives to spam/macro input.

## Impact FX Contradicts the Action Axis

- **Evidence:** user screenshot of the typing-v1 viewer-right speed streaks; `docs/recovery-audit.md` section 23.
- **User-confirmed failure:** horizontal speed lines beside a paw moving from top to bottom read as a sideways swipe. The FX changed the perceived action even though the articulated paw motion itself was correct.
- **Verified correction:** align streak tangents with the moving part's travel and mirror them by side. For the kneading cat, viewer-left slopes upper-left to lower-right and viewer-right slopes upper-right to lower-left, both converging toward the dough contact.
- **Stop condition:** if removing the FX makes the action clearer, or the FX suggests a different direction/force than the limb, utensil, projectile, or target contact, reject the effect before integration.
- **Reuse conditions:** apply to speed lines, dust trails, impact ticks, smear frames, and particles. The exact angle is action-specific; do not promote this project's diagonal angles into a universal preset.

## Impact FX Matches the Motion but Disappears Into the Contact Object

- **Evidence:** user review of the corrected diagonal typing-v1 FX; `docs/recovery-audit.md` section 24.
- **User-confirmed failure:** the diagonal direction was correct, but warm cream/gold contact rays and puffs were too close to the warm dough palette, so fast typing still lacked impact at the displayed size.
- **Current corrected route:** preserve the motion axis and change only the local effect palette to a cool flour-white core with a restrained teal edge/shadow. Inspect at the actual 112px display size on both light and dark backgrounds rather than approving from a zoomed sheet.
- **Stop condition:** the effect silhouette merges with the target object, vanishes on either common desktop value range, or requires a zoomed preview to identify the hit.
- **Evidence level:** the failure and causal contrast mismatch are user-confirmed; the corrected palette passes final-size static QA but remains `Implemented, not live-verified` until the user judges it in motion.

## No Single Impact Channel Replaces the Other Two

- **Evidence:** successive user reviews of the 112px one-dough fast/overdrive motion on 2026-07-10; `docs/recovery-audit.md` sections 26–27.
- **User-confirmed failures:** first, contrasting FX could not rescue paw displacement and dough response that were too small. After those channels were safely enlarged, the user confirmed the inverse: motion alone still read as a paw resting on dough because the contact explosion and airborne flour were too timid.
- **Bounded correction:** inspect three channels independently at the final display size—connected limb travel, local target compression/rebound, and material FX—and require all three to carry the hit. Once kinetic travel reaches its anatomy/root-safe limit, strengthen the contact silhouette, temporal peak, burst area/density, material debris and expression rather than moving the limb farther.
- **Recovery evidence:** fast and overdrive use 35.2 source pixels / 3.14 display pixels of forearm contact travel and a local dough response. Attempts at 42.9/3.83 and 38.27/3.42 changed the immutable dough-root region and were rejected. The later FX pass therefore kept 3.14px travel and added a 21.4px fast impact crown with seven flour particles, plus a 27.7px overdrive double crown with fourteen particles. Individual outlined puffs looked like flowers/bubbles, so their lobes were merged into one union cloud silhouette. Static 112px light/dark QA and automated root gates pass; user continuous-play acceptance is still pending.
- **Stop condition:** reject a pass where any one channel is expected to substitute for the other two, the target remains visually inert, the burst is too small to mark the exact contact beat, the effect hides the sensing/contact anatomy for more than the peak frame, or a higher tier achieves intensity by penetration or a weakened root gate.
- **Reuse conditions:** do not copy the 3.14px value to another character. Measure each rig at its real display size and keep the last anatomy/root-safe displacement, then differentiate higher tiers without violating it.

## Smell Gesture Reads as a Generic Head Tilt

- **Evidence:** user review of the initial curious-idle sniff on 2026-07-10; `docs/recovery-audit.md` section 26.
- **User-confirmed failure:** lowering and rotating the head communicated a bow or curious tilt but did not clearly communicate “킁킁.”
- **Cause:** the motion lacked a timed cue at the sensing body part and did not connect the nose to the inspected object. Head rotation carried more semantic weight than the nose action.
- **Bounded correction:** reduce lateral rotation, approach the target almost vertically, use two distinct nose-local squash/nostril beats, and add at most one restrained target-to-nose scent curl per beat. Keep text and speech-bubble clouds out of small taskbar gestures unless the UI intentionally uses comic notation.
- **Stop condition:** if the action is equally readable after hiding the nose/target cue, it is probably still only a head tilt; if the cue resembles drool, dialogue, or a permanent icon, reduce or reposition it.
- **Evidence level:** the failed interpretation is user-confirmed. The corrected route passes static 112px QA and root/loop gates but remains provisional until continuous user review.

## Persistent Status Ticket Outlives Its Function

- **Evidence:** user screenshot of the `꾹꾹 중 / 계속 작업` card after taskbar completion and claiming were removed; `docs/recovery-audit.md` section 24.
- **User-confirmed failure:** a permanent card continued to consume nearly half the widget footprint even though it no longer communicated an actionable deadline, completion, reward, or decision.
- **Verified code correction, live gate pending:** remove the unused ticket from markup, CSS, render lookups, phase labels, progress dots, and tests. Do not merely rename it to `계속 작업` or leave an invisible hit-area-sized container.
- **Stop condition:** persistent UI occupies taskbar space while repeating an always-true state, explaining an animation the player can already read, or advertising progress with no resulting use.
- **Reuse conditions:** this does not ban compact status UI. Keep it when it supports a real action, changing decision, warning, resource, or accepted progress loop whose value justifies the footprint.

## Completion Freezes the Character

- **Evidence:** `docs/current-issues-and-plan.md` and `docs/conversation-log.md` Entry 15.
- **Verified generic direction:** when an accepted design needs completion, separate the complete/check label from the motion state so blink and finite input reactions continue.
- **Current project decision:** the one-dough taskbar baker's completion/claim state was later removed because it had no meaningful downstream use and the user still perceived a stop. This is a project decision, not a universal ban on completion states.
- **Stop condition:** a ready/completed flag suppresses normal reactions, or the completion result has no clear player use and exists only to stop an otherwise satisfying ambient loop.

## Gesture and Window-State Arbitration

- **Evidence:** `docs/current-issues-and-plan.md`; `docs/conversation-log.md` Entries 15 and 20.
- **Verified code direction, live gate pending:** use pointer capture, a drag threshold, viewport clamp, normalized saved position, post-drag click suppression, persistent cat visibility, and close-before-claim ordering.
- **Stop condition:** drag end becomes click/claim/toggle, the cat disappears behind the panel, or close reopens/claims instead.

## Live Browser Verification Is Unavailable

- **Evidence:** latest applicable entry in `docs/workaround-ledger.md` and `docs/current-issues-and-plan.md`.
- **Verified process rule:** perform static, state-machine, registration, build, and preview checks; then request the missing continuous user interaction review.
- **Stop condition:** do not revive a blocked localhost/file-control route without a verified environment change, and do not substitute static evidence for live acceptance.

## Encoded Preview Creates False Static-Pixel Drift

- **Evidence:** `docs/workaround-ledger.md` entry `GIF encoding can repaint a registered counter`; `docs/conversation-log.md` Entry 28.
- **Verified failure:** GIF background-restore disposal and palette dithering changed decoded pixels in a counter region that was byte-identical across the source frames. The apparent drift came from the review encoding, not the motion source.
- **Verified correction:** use one shared palette, disable dithering for registration-review GIFs, retain the previous full frame instead of restoring a background, decode the written animation again, and compare the fixed region across every decoded frame. Use a full-color lossless animated review copy when palette limits could affect art judgment.
- **Stop condition:** any decoded preview changes a declared fixed region, changes the loop-neutral frame, or reports a duration different from the designed observation window.
- **Do not use:** a GIF screenshot or encoded-frame hash as proof that source-frame registration passed; verify both the source sequence and the decoded deliverable.

## Flat-Image Mesh Motion Reads as Rubber Stretch

- **Evidence:** `assets/taskbar-cat-living-v1/qa/living-neutral-motion-proof-128.gif`; `docs/recovery-audit.md` section 14; `docs/conversation-log.md` Entry 29.
- **User-confirmed failure:** a technically registered local mesh deformation of one approved still looked like the entire image was stretched and released, not like a cat moving through joints.
- **Cause:** the deformation changed outline curvature, feature spacing, limb thickness and facial/head volume continuously. A connected displacement field is not the same as articulated rotation, overlap and occlusion, even when the root is fixed and the intended kinetic-chain timing is present.
- **Reroute:** preserve the approved still as the style/pose reference, build real high-resolution rigid layers with clean plates and overlap allowance, and move head, ears, torso, upper arm, forearm and paw around documented pivots. Limit mesh/squash deformation to intentionally soft materials such as dough and a flexible hat crown.
- **Stop condition:** reject any proof where a rigid body feature changes thickness, the face stretches with the head, an ear base slides through the skull, a sleeve elongates instead of rotating, or the result can be described as zooming/stretching a flat card.
- **Do not use:** stronger/weaker mesh amplitudes, slower timing or more secondary motion as a correction. Once rubber stretch is visible, the representation must change from one flattened bitmap to separated articulated layers.
- **Evidence level:** the failed route is `User confirmed`. The separated-layer reroute remains `Provisional` until a one-motion final-speed proof receives user acceptance.
