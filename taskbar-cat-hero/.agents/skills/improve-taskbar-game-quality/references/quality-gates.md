# Taskbar Game Quality Gates

Use the relevant gates before claiming a task is complete. A gate marked required by the request, project rules, or known failure history cannot be replaced by a weaker proxy.

## 1. Scope and Evidence Gate

- Latest user instruction is restated accurately.
- Included and excluded files/features are explicit for broad work.
- Existing master, runtime, provenance, current decision, and rejection evidence were inspected.
- Any conflict or missing source is reported before execution.
- Paid services, licensed assets, or broad external access are not used without approval.
- Every source is classified as reference, rough concept, prototype, current candidate, user accepted, or production approved. Preservation and provenance do not imply runtime inclusion.
- A rejected, superseded, or visibly weak source is absent from presentation runtime even when keeping it would reduce rework.
- When a live-control surface is blocked, the report names which gates remain possible from direct assets, deterministic QA exports, user-provided captures, and automated state tests, and which exact gate still requires supported live observation.

## 2. Semantic Gate

- One sentence names character/job, action, object, and game purpose.
- Outfit, prop, action, task label, icon, progress state, result, and reward tell the same story.
- The activity reads at 128px without relying on an explanation.
- The taskbar scene has a clear primary promise: game progress, companion presence, or a deliberate blend.
- Idle and input behavior reinforce the active scene instead of adding unrelated motion.
- Expanded-window choices can visibly affect the taskbar scene when that connection is in scope.

Any “no” is a concept failure, even if the image is attractive and technically clean.

## 3. Master and Anatomy Gate

- Highest-quality master is preserved separately from derived runtime assets.
- Exactly two front paws are visible when the pose requires them; both connect to believable sleeves/forearms.
- Paw/object contact, support, occlusion, and depth order are unambiguous at source size and final size.
- No floating, piercing, merging, duplicated anatomy, detached prop, or unexplained object teleport occurs.
- Thin tools/open grips/liquid intersections have a proven rig or are removed from the route.
- Local edits change no pixels outside the declared mask unless the change is explicitly approved.

## 4. Registration and Motion Gate

- Pivot, baseline, visible bounds, and reference anchor are documented for every used frame/layer.
- Body/stage drift is at most 1 displayed pixel under the current project rule.
- Distinguish unintended root/stage drift from deliberate child-layer motion. The counter/taskbar contact root stays registered; documented head, shoulder, forearm, ear, tail, and facial movement may be larger when it is purposeful, bounded, and returns cleanly.
- Neutral -> reaction -> neutral uses the same resting registration.
- A working limb has a readable kinetic chain rather than an isolated cell swap: anticipation or attention, connected shoulder/forearm motion, contact response, and settle. At least one non-paw cue such as gaze, head, ear, torso compression, or tail should support important work reactions.
- Speed lines, dust, impact ticks, smears, and particles follow the actual motion/force axis and target contact; decorative FX must not imply a different action direction.
- At the actual displayed size, impact FX retain enough hue or value separation from the limb, contact object, and common light/dark desktop backgrounds to identify the hit without zooming. Directionally correct FX that visually merge into the target still fail.
- For every important impact, inspect three channels separately at the actual displayed size: connected limb displacement, local target compression/rebound, and FX. All three must contribute; particles cannot substitute for an almost-static limb or target.
- The FX channel has its own readable peak: a contact-centered silhouette, short high-contrast crown/ring/smear, and material-appropriate debris must make the hit frame obvious without relying on larger limb travel. If separate outlined puffs read as flowers, bubbles, or UI badges, merge them into one irregular material cloud and keep only true debris particles separate.
- Layer broad crowns behind the limb when possible, keep the exact contact anatomy readable before and after the peak, and prevent FX geometry from entering protected root/baseline regions.
- If a stronger tier reaches the last anatomy/root-safe displacement, keep that travel fixed and differentiate with cadence, burst area/density, timing, and expression. Never relax the root gate or permit penetration to manufacture intensity.
- Sensory inspection gestures identify both the sensing body part and the target. For smell, prefer a near-vertical approach with two nose-timed beats and a restrained target-to-nose cue; head rotation alone does not pass semantic review.
- Continuous final-speed playback covers idle, every trigger, entry/exit, loop boundary, completion, and reduced-motion behavior.
- Idle is calm enough to live on the desktop; no full-body wobble, scale pop, highlight flicker, or concealed infinite reaction loop remains.
- Dense inputs are coalesced or bounded so event queues cannot accumulate.
- The written review animation is decoded again before approval. Palette conversion, dithering, frame disposal, timing quantization, and loop metadata must not repaint a declared fixed region or change the designed duration/neutral seam.
- Rigid-form preservation is inspected separately from root registration. Head/face proportions, ear bases, torso volume, sleeve length and paw thickness must remain stable under motion; articulated parts rotate/translate around documented pivots instead of being stretched by a broad displacement field. Mesh deformation is allowed only on explicitly soft layers.

Record measured drift, frame indices/state names, timing, display size, observation duration, and observed result.

## 5. Transparency and Final-Size Gate

- Source and derived assets are inspected on light, dark, and transparent/checker backgrounds.
- Premultiplied alpha is used for translucent composition and resize when edge contamination is possible.
- Feathered RGBA local edits preserve source RGB and apply the feather mask once as alpha; no paste-through-mask plus second alpha composite may double-darken the boundary.
- No visible chroma fringe, halo, pinhole, matte interior, or hidden-RGB bleed remains.
- The silhouette, face, contact, and state difference remain readable at 128px and intended DPI scaling.
- Compression, filtering, or atlas derivation does not visibly degrade the master.

## 6. Living Taskbar Gate

- The cat visibly belongs to the taskbar rather than looking like a pasted static card.
- Something meaningful can change while the user looks away: phase, result, relationship, environment, or another approved persistent state.
- Keyboard/mouse feedback is immediate, local, context-aware, and finite.
- Pet behavior adds charm without masking the game activity or becoming restless.
- With input absent, the character still shows low-frequency life outside the active paw—such as breathing, gaze, ear, tail, posture adjustment, or attention to the work—without stacking every cue at once.
- A long-idle sleep/doze state has a bounded entry/loop and a readable wake transition back to the exact registered working neutral; resumed input must not leave the character asleep or cut the wake cue before it can be read.
- The resting silhouette and weight distribution avoid a permanently centered mannequin pose when the intended activity requires effort or personality.
- When completion is part of the accepted design, it remains visible until its intended resolution and does not freeze unrelated reactions. Do not invent an endpoint with no downstream player use merely to stop an ambient loop.
- Any persistent taskbar status card must justify its footprint with actionable or changing information. Remove markup and layout for labels that only restate an always-visible animation or an always-true state.
- Input volume does not change reward value or task duration unless the user explicitly approves that game design and anti-macro/privacy implications.

## 7. Interaction and State Gate

- Drag and click/toggle are distinguishable; drag end does not claim, reopen, or close by accident.
- The cat remains visible/actionable in every intended window state.
- The same cat control toggles the deeper window when specified, with accessible alternate close control.
- State ordering is deterministic: close, any accepted claim action, reaction, and persistence cannot race or double-fire.
- Position, progress, any accepted completion state, and visible scene survive reload according to the intended persistence design.

## 8. Code and Asset Agreement Gate

- Runtime frame/state names match manifest and provenance names.
- Task identifiers, labels, icons, timings, rewards, and displayed art use the same fiction.
- Old rejected assets are not referenced by runtime or generated single-file builds.
- Generated embedded assets match the current source hashes where reproducibility is required.
- Automated tests cover state transitions and invariants, while visual/live tests cover appearance and timing.

## 9. Expanded UI Composition and Visual-System Gate

- Inspect the full composed screen at every intended window size before approving isolated icons or controls. Run one pass for the requested defect and a second unframed pass for any other obvious quality failure.
- Every raster UI asset has either clean transparency or a deliberate framed tile whose matte, corner treatment, lighting, and edge belong to the receiving component. A baked rectangular background that visibly disagrees with its container fails even when the asset is sharp and loaded correctly.
- Reusing one image in a card, action button, tab, reward, or toolbar is intentional and role-appropriate. When roles differ, use distinct framing, crop, scale, label, or state treatment; raw duplication that makes the UI look assembled from placeholders fails.
- Icons and illustrations in one visual family agree on line weight, perspective, palette, lighting, texture, edge treatment, and apparent resolution. A manifest or common directory does not prove visual consistency.
- Buttons use a game-specific control language and define default, hover/focus, pressed, selected, disabled, and actionable/ready states as applicable. Generic browser-like rounded rectangles, default-looking gradients, and equal emphasis across every action fail presentation review.
- A progress bar exists only for a real quantity, threshold, duration, or upgrade state that the player can interpret. It distinguishes meaningful states and does not act as decorative filler beneath every card.
- Typography, spacing, and scale establish a focal point, one primary action, secondary actions, status, and supporting detail. Tiny labels, repeated borders, and all-equal card weight fail even if nothing clips.
- The screen's visual hierarchy expresses the user flow and the game's identity. A dense inventory of systems is not accepted merely because every system is visible.
- Compare the composed result with the intended reference-quality bar at actual size. Use references to judge finish, density, hierarchy, and emotional tone without copying protected surface art.
- Automated layout, asset, and state tests remain engineering gates only. They cannot approve taste, cohesion, perceived effort, game feel, or visual authorship.

Record the target window sizes, full-screen screenshots, obvious failures found in the unframed pass, control/state inventory, asset-background findings, and user acceptance signal.

## 10. Unity Handoff Gate

- High-resolution masters remain intact; derived sprites are traceable to them.
- Stable filenames, crop bounds, pivots, anchors, pixels-per-unit assumptions, layer order, and frame meaning are documented.
- Recommended Unity import settings preserve alpha and fidelity; avoid destructive compression and mipmaps for taskbar-scale UI unless tested and approved.
- Browser-only input, timing, storage, and window behavior have explicit adapter boundaries for later C# implementation.
- Comments explain intent, constraints, and porting behavior rather than restating syntax.

## 11. Acceptance and Status Gate

- Compare the actual result with the current instruction and every required gate.
- A user rejection overrides an internal approve label.
- If continuous/live review is required but unavailable, use `Implemented, not verified`.
- Use `Partially complete`, `Research incomplete`, `Cannot judge completion`, or `Blocked` exactly when applicable.
- Use `Complete` only after implementation, required verification, and major-risk review all pass.
