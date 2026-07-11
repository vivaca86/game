# Product And Development Goals

This file is the authoritative product-direction record for this project. The user's latest explicit instruction overrides older wording. Do not silently reinterpret, narrow, or expand these goals.

## 1. Shipping Target: Steam

- The product is intended for a Steam release, not merely a browser-demo handoff.
- The production result must be evaluated as a shippable desktop game: stable startup and shutdown, reliable save data, predictable updates, acceptable CPU/GPU/memory use, input accessibility, resolution and scaling support, packaging, crash recovery, and Steam-distribution readiness.
- The current web prototype is a design and systems-validation surface. Do not describe it as the final Steam product.
- Do not claim that the game is Steam-ready until the Unity production build and its release workflow have been implemented and verified.

## 2. Final Production Implementation: Unity

- The final game will be implemented and shipped in Unity.
- Current prototype work may continue in HTML, CSS, and JavaScript, but every material decision must account for later Unity implementation.
- Avoid web-only shortcuts that make the feature difficult to reproduce in Unity. When a temporary browser-specific technique is necessary, isolate it behind a clear boundary and document the Unity replacement.

### Unity-Portability Rules

- Separate the game/domain model from DOM rendering, CSS, localStorage, browser timers, and platform integration.
- Keep gameplay state serializable, versioned, deterministic where practical, and independent from view objects.
- Use stable IDs for cats, recipes, items, production buildings, dispatch locations, cosmetics, quests, and currencies.
- Keep balance and content data data-driven in formats that map cleanly to Unity `ScriptableObject`, JSON, CSV, localization tables, sprite atlases, and animation clips.
- Wrap persistence, time, input/activity tracking, audio, notifications, achievements, and platform APIs behind explicit interfaces so the browser prototype and Unity build can use different adapters.
- Model long-running timers from timestamps and explicit clock services so offline progress, pause/resume, and system-clock edge cases can be reproduced in Unity.
- Prefer commands, events, and state machines over DOM-class-only state. The UI should reflect authoritative game state rather than become the source of truth.
- Keep sprite sheets, frame sizes, pivots, anchors, crop bounds, animation speed, and export settings documented so they can be imported into Unity without visual guesswork.
- Maintain a clear mapping from prototype concepts to likely Unity responsibilities, such as:
  - state objects -> serializable C# game-state models;
  - recipe/production definitions -> `ScriptableObject` content definitions;
  - tick and offline progress -> clock/progression services;
  - render functions -> presenters/controllers plus Unity UI views;
  - localStorage -> a versioned save repository;
  - CSS sprite animation -> `SpriteAtlas`, animation clips, or an Animator/Timeline implementation;
  - taskbar/window behavior -> a platform-specific desktop-overlay integration layer.

### Comment And Handoff Requirements

- Comment non-obvious code thoroughly enough that a Unity developer can understand what the code does, why it exists, what state it reads or changes, and how it should map to Unity.
- For material systems, document inputs, outputs, side effects, timing assumptions, serialization shape, error behavior, and the intended Unity class/service/component boundary.
- Include implementation notes near browser-specific code explaining the Unity-equivalent approach and any behavior that must remain identical during the port.
- Prefer precise comments that explain intent and integration over comments that merely restate individual lines.
- Update or remove comments when behavior changes. Outdated comments are quality defects.

## 3. IP Worlds And Asset Use During Prototyping

The game direction combines material and visual references from:

- `당신에게 고양이`
- `두근두근 레스토랑`
- `에브리타운`

The user states that the project is being prepared for delivery to the relevant IP holder. That statement is the working authorization basis for prototype use; the agent does not independently claim or verify ownership.

### Asset Workflow

- During prototyping, available images from the referenced IPs may be used, cropped, isolated, composited, or studied when doing so materially improves fidelity.
- Preserve the unmodified source reference before cropping or editing it.
- Record source/provenance, original filename or URL, referenced IP, acquisition date, intended use, crop or edit history, and whether the file is `reference`, `prototype`, `generated`, or `production-approved`.
- Keep source references, extracted prototype assets, generated derivatives, and approved production assets distinguishable so a temporary reference cannot silently ship.
- If a crop or extracted element looks visibly awkward, do not force it into the game. Use the reference as visual guidance to generate or create a coherent replacement that matches the intended character, pose, perspective, lighting, line quality, and surrounding art direction.
- Retain prompts, source references, generation settings, frame/pivot metadata, and selected output versions for generated assets.
- Do not purchase licensed assets, use a metered generation service, or incur API/plugin costs without the user's explicit approval.
- Before a Steam release candidate is produced, require an explicit asset-rights and IP-holder approval pass. Unreviewed references and prototype-only extractions must be excluded from the shipping build.

### Image Quality Has Priority Over Porting Convenience

- Unity portability may change how images are catalogued, sliced, layered, packed, pivoted, animated, or imported, but it must not reduce their visible quality.
- Do not replace a high-quality source image with a visibly simpler, lower-resolution, flatter, rougher, or less expressive asset merely because the replacement is easier to rig or port.
- Preserve the highest-quality master image and derive runtime atlases, layers, masks, and import variants from that master without destructive downscaling.
- If a desired interaction needs additional poses or layers, create or generate matching high-quality material instead of falling back to lower-quality placeholder art in a user-facing build.
- Prototype-to-Unity metadata work is encouraged, including source classification, stable filenames, frame ranges, pivots, anchors, crop bounds, layer names, and import notes. This organization work must preserve the original visual fidelity.
- When portability and image fidelity conflict, stop and redesign the technical pipeline around the image quality requirement rather than silently lowering the art bar.

### Sprite Animation Continuity Gate

- A high-quality sprite sheet is not automatically a high-quality animation. Before a sheet or frame range is accepted for continuous playback, measure each used frame's anchor, pivot, visible bounds, and rendered displacement at the actual target size.
- Do not continuously play a full sheet merely because its cells have equal dimensions. If generated frames are not spatially registered, either align them against a documented reference anchor or restrict playback to a verified stable subset.
- Inspect the animation continuously at its final display size and final playback speed. A still screenshot, isolated-frame review, source-code assertion, unit test, or sprite-sheet checksum does not verify motion continuity.
- Verification must cover idle playback, input-triggered playback, loop boundaries, entry and exit from every used state, reduced-motion behavior, and return to the resting frame.
- Visible whole-character sliding, pivot jumps, unintended scale changes, frantic idle motion, or flicker is a failed quality result even when every frame is individually attractive.
- Record the measured drift, reference anchor or pivot, accepted frame indices, timing, observation duration, and observed result. Do not use `Complete`, `Passed`, or equivalent completion language for sprite animation until both the numeric anchor/pivot check and the final-speed continuous observation have succeeded.
- Unity import or porting convenience does not relax this gate. Unity clips, atlases, and Animator states must reproduce the same verified frame registration and timing without lowering image quality.

### Generated Character Interaction Art Gate

This gate was added after the generated chef-cat v2 passed numeric and internal review but the user correctly rejected visible hand/tool defects, and after a geometry-safe pot-tapping revision was rejected as thematically arbitrary. See `docs/recovery-audit.md` for the evidence and root-cause record.

- Semantic fit is a blocking gate. The character's clothing, job, prop, and action must form one immediately understandable activity at 128px. A technically clean interaction that feels arbitrary or out of character fails.
- Do not begin with a multi-pose atlas. First create one neutral master, show it at source size and final taskbar size on light and dark backgrounds, and obtain explicit user approval of the concept, silhouette, outfit, stage, and contact geometry.
- Do not independently generate six or more complete character frames for one interaction set. The body, clothing, stage, fixed props, lighting, and baseline must come from the same approved master pixels.
- Prefer a deterministic layered asset: immutable body/stage, separate left arm/paw, separate right arm/paw, small face overlays, and a broad contact object with fixed anchors. Animation should move or swap only those approved layers.
- Avoid thin handheld tools, long shafts crossing a paw, open-hand grips, liquid contact, and ambiguous foreground/background occlusion unless a deliberate rig and final-size contact test prove them safe. A prompt claiming that a grip is correct is not verification.
- Every frame must contain exactly two front paws, each visibly connected to one sleeve or forearm. No paw may float, merge into a prop, enter liquid, pierce a rim, or be pierced by a handle. Contact needs a readable 1–2px final-size boundary, shadow, or occlusion cue.
- For generated edits, pixels outside the declared mask or layer must remain identical to the approved master. If the same anatomy/contact defect survives two targeted edits, stop generation and redesign the layer/rig; do not keep spending prompts on the same route.
- If a future accepted design uses completion, it must be a status overlay rather than a pose lock. The current one-dough taskbar baker explicitly has no completion/claim state because the result had no meaningful use; its visual work phases loop continuously.
- Final acceptance requires neutral↔left↔neutral and neutral↔right↔neutral playback at 128px, light/dark inspection, fixed inactive layers, body/stage drift no greater than 1px, and explicit user visual approval. Internal or agent QA cannot override a user's failed acceptance signal.

#### Current Taskbar Art Decisions — 2026-07-10

- User-selected character style anchor: `assets/concept/chef-cat-v9.png` and the user's corresponding Image 1. Future taskbar cat masters must preserve its compact 2D chibi proportions, dark-brown outline, warm flat pastel shading, small closed-or-simple eyes, red neckerchief, white chef coat, tiny chef hat and mobile-game illustration finish.
- Rejected as the visual identity target: the semi-realistic baker v2 look shown in the user's Image 2. Its large realistic head, glossy eyes, rendered fur and dimensional painterly finish are too different from Image 1. Baker v2 remains reference-only for the one-dough/contact experiment and must not drive future character styling.
- Rejected: chef cat holding a spatula and ladle; the utensils floated, teleported between poses, or intersected a paw.
- Rejected: removing the utensils and making the chef cat drum on the cooking pot; the geometry was safer but the action was thematically abrupt.
- Rejected by user: twin service-bell concept.
- Superseded: baker cat kneading two separate dough pads. The user explicitly requested one dough, so the two-pad v1 neutral remains reference-only and must not return to runtime.
- Historical localized prototype: one continuous dough beneath both paws, plus three localized baker-v2 sources (viewer-left press, viewer-right press, eye-only blink). Preserve it as contact/registration evidence, not the active visual identity.
- Archived atlas: `assets/taskbar-cat-baker-v2/taskbar-cat-baker-v2-atlas.png`, 2 × 2 at 512px per cell, displayed at 128px. It has no utensil, no body loop, zero changes outside declared full-resolution masks, a common baseline, and `0.5184px` displayed lower-body center spread, but it must not return to the active runtime because its semi-realistic style was rejected.
- The user authorized applying the v4 one-dough motion to the local prototype. Final status still requires the user's actual continuous-play acceptance in the local page; internal light/dark sheets, GIFs, hashes and automated tests cannot substitute for that visual gate.
- Future additions must preserve the one-dough/contact lessons but rebuild the living neutral from the user-selected 2D chef-cat v9 style anchor. A newly generated six-frame full-body sheet remains prohibited for this concept.
- Rejected by user: the first chef-cat-v9 living proof that used one flattened bitmap and local mesh displacement. Even with exact root registration, it read as stretching and releasing an image. Do not retune or reuse that representation.
- Current motion candidate: `assets/taskbar-cat-cutout-rig-v1/`. It preserves the approved neutral exactly at rest, uses a generated clean plate only beneath missing head/arm pixels, and moves the separated head, viewer-left ear, hat crown, upper arm and forearm/paw through rigid documented pivots. It remains a user-review candidate, not an accepted runtime asset.
- Current transparent extension candidate: `assets/taskbar-cat-cutout-rig-v2/`. Its main taskbar output removes the cream square and wooden counter while preserving their source files, adds independently pivoted left/right ears and a tail layer behind the pouch/body, and keeps the one-piece dough bottom as the registered taskbar root. It remains a user-review candidate and must not replace runtime art until accepted in continuous play.
- Current two-hand motion candidate: `assets/taskbar-cat-cutout-rig-v3/`. It keeps the v2 transparent articulated structure, adds a separately extracted viewer-right upper arm and forearm/paw, alternates left/right kneads, switches tiny open-eye patches to the approved original line eyes for blinks, uses an 8° flap plus rebound on each ear, and keeps a continuous ±13° tail sway. Generated pixels are restricted to hidden clean-plate areas and the two tiny open-eye patches. It remains a user-review candidate and must not replace runtime art until accepted in continuous play.
- Current taskbar state runtime: `assets/taskbar-cat-idle-v1/` is the no-input default. Page load and inactivity show registered resting paws with a calm alert loop; they never start kneading. Keyboard pulses start/extend the v4 work loop for 1.2 seconds, then return to idle. A 70ms coalescer and 800ms anonymous pulse window select normal/fast/overdrive. Fast and overdrive use a 3.14px final-size connected paw strike, local dough compression, teal downward-diagonal motion streaks, and warm flour-white bursts with cocoa outlines. Fast uses a 21.4px behind-paw impact crown, four joined cloud lobes and seven particles; overdrive uses a 27.7px double crown, nine joined lobes and fourteen particles. Overdrive increases cadence, burst density, and expression rather than penetrating the fixed dough root; joined cloud silhouettes avoid flower/bubble outlines. Click/wheel plays a 1.2-second attention one-shot and resets inactivity without starting work. Alert idle lasts to 45 seconds; curious idle to 180 seconds may play a non-queued 3-second dough sniff at rotating 18/26/22-second intervals. The sniff approaches almost vertically and uses two nose-local pulses plus restrained dough-to-nose scent cues instead of a generic head tilt or speech bubble. Sleepy idle to 300 seconds uses slower tail, a long blink and one small head dip. `assets/taskbar-cat-rest-v1/` then provides the 4-second doze loop and protected 1-second wake. The taskbar has no ready/claim/reward endpoint or persistent status ticket, key content is not read or persisted, rewards remain independent, and the visible 112px canvas never replaces the 1254px masters. Local application still requires user continuous-play approval before final visual, Unity, IP-holder, or shipping acceptance.

## 4. Genre: Taskbar Game

- The primary genre is a taskbar game: a lightweight, persistent desktop companion that visibly lives on or immediately above the taskbar.
- Taskbar presence is a core play surface, not merely a shortcut that launches a conventional management game.
- The experience must remain delightful and legible at small scale, avoid obstructing normal desktop use, and respect performance, focus, window layering, multi-monitor, DPI, and fullscreen-application behavior.

## 5. Primary Steam References

- `Task Bar Hero` / `Taskbar Hero`
- `Bongo Cat`

Use these references to understand taskbar presence, immediate feedback, interaction rhythm, progression depth, window opening/closing, retention loops, and desktop coexistence. Reference study should inform the product rather than produce an unexplained clone.

## 6. Core Experience And Game Loop

- On the taskbar, cats should visibly do things rather than remain static decoration.
- Like `Bongo Cat`, cats should react to the player's actions or activity with readable, charming animation and immediate feedback.
- The taskbar layer should support ambient behavior, action response, short interactions, visible progression, and reasons to glance back without demanding constant attention.
- Clicking the taskbar cat or widget opens a deeper game window. The same cat remains visible and actionable above that window; clicking it again closes the window, so the top-bar close button is never the only exit.
- The expanded game should provide substantially more depth than Bongo Cat, using systems such as farming, food/cooking, restaurant activity, clothing and dress-up, collection, cat growth, production, dispatch, customization, and progression.
- `Taskbar Hero` is the structural reference for the relationship between the small taskbar presence and the deeper opened game.

The intended loop is:

1. Cats live and act on the taskbar.
2. Player activity or direct input produces a cat reaction and short feedback.
3. Ambient/taskbar activity generates progress, resources, discoveries, or relationship growth.
4. The player clicks the cat/widget to open the deeper management window.
5. The player farms, cooks, manages, dresses, collects, upgrades, and makes longer-term choices.
6. Those choices visibly change what the cats do and how they appear on the taskbar.
7. The game returns to a satisfying ambient desktop state while progress continues appropriately.

## Product Pillars

Every substantial feature should strengthen at least one pillar and should not materially damage the others:

1. **Immediate charm:** expressive cats and satisfying action feedback at taskbar scale.
2. **Meaningful depth:** management, progression, customization, collection, and long-term goals beyond a novelty widget.
3. **Living continuity:** the taskbar and expanded game reflect the same persistent world and state.
4. **IP fidelity:** characters, mood, systems, and visual language respect the intended IP-holder presentation.
5. **Unity portability:** prototype work has an explicit, maintainable path into the final Unity architecture.
6. **Steam-quality delivery:** stability, polish, accessibility, performance, and packaging are production concerns from the start.

## Feature Decision Gate

Before accepting a feature or implementation, ask:

- Does it improve the taskbar experience or the deeper management game?
- Does taskbar activity meaningfully connect to opened-window progression?
- Does it fit one or more of the three IP worlds and the two primary taskbar references?
- Can it be ported to Unity without reconstructing hidden browser-only state or behavior?
- Is the real output polished enough for the current milestone and verified against references?
- Are asset source, rights status, crop/generation history, and intended shipping status clear?

If the answer to a relevant question is no or unclear, the feature is not ready to be treated as complete.

## Decisions Not Yet Defined

Do not invent these without a later user decision:

- final product name and branding;
- exact supported operating systems and minimum specifications;
- premium/free-to-play structure, price, DLC, or monetization;
- Steamworks features such as achievements, cloud saves, workshop, trading items, or leaderboards;
- exact scope and written approval for each IP and production asset;
- final art pipeline, localization scope, content volume, and launch roadmap.

## User-Stated Source Goals — 2026-07-10

The following preserves the user's source direction. If an interpretation in this document ever conflicts with these statements, stop and ask the user rather than silently choosing one.

> 1. 스팀 출시 목표야
> 2. 최종 개발은 유니티야 그래서 지금 작업을하면서 나중에 개발 완료때 유니티로 포팅을 할꺼야
>    - 개발은 유니티 포팅에 신경써서 작업
>    - 주석 처리 잘해줘 어떤 코드고 어떻게 적용해야하는지
> 3. 게임은 당신에게 고양이, 두근두근 레스토랑, 에브리타운이야 이건 IP홀더에게 줄거라서 일단 저작권상관없이 가져다 쓸수있는 이미지들이 있다면 가져다 쓰고 잘라냈을때 너무 어색하다면 그 이미지를 기준으로 생성해
> 4. 레퍼런스 게임의 장르는 테스크바 게임이야
> 5. 레퍼런스 게임은 스팀에 Task Bar Hero와 **Bongo Cat이야**
> 6. 테스크바에서는 봉코켓과 같이 고양이들이 테스크바위에서 무언가를 한다거나 내 액션에 맞춰 움직이고
>    클릭해서 창을 열면 테스크바 히어로처럼 농장이던 음식만들기던 옷을입히면 봉고켓보다 깊이있는 게임으로 만드는거야

## User-Stated Image-Quality Clarification — 2026-07-10

> 나는 일단 IP홀더에게 전달을 해야해 그래서 개발적인 부분은 포팅이 중요하지만 이미지는 괜찮아 포팅을 위해서 이미지퀄리티가 낮아지는건 안되
>
> 포팅을 위해서 이미지의 분류나 이런건 괜찮지만 퀄리티가 낮아지는건 안되
