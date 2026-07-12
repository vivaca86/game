const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const readText = (file) => fs.readFileSync(path.join(root, file), "utf8");
const sha256 = (value) => crypto.createHash("sha256").update(value).digest("hex");
const stripCssComments = (value) => value.replace(/\/\*[\s\S]*?\*\//g, "");

test("index loads only the new taskbar companion runtime", () => {
  const html = readText("index.html");

  assert.match(html, /game-ui-v4\.css\?v=6/);
  assert.match(html, /taskbar-companion\.css\?v=17/);
  assert.match(html, /taskbar-widget-core\.js\?v=10/);
  assert.match(html, /taskbar-cat-player\.js\?v=6/);
  assert.match(html, /app\.js\?v=49/);
  assert.match(html, /data-ambient="alert-idle"/);
  assert.match(html, /data-pose="idle-alert"/);
  assert.doesNotMatch(html, /widget-v28\.css/);
  assert.doesNotMatch(html, /class="tiny-widget"/);
  assert.doesNotMatch(html, /class="widget-stage"/);
});

test("all HTML ids are unique and static app id selectors resolve", () => {
  const html = readText("index.html");
  const app = readText("app.js");
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  const referenced = [...app.matchAll(/\$\("#([A-Za-z0-9_-]+)"\)/g)].map((match) => match[1]);
  const missing = [...new Set(referenced)].filter((id) => !ids.includes(id));

  assert.deepEqual(duplicates, []);
  assert.deepEqual(missing, []);
});

test("activity handling never reads key identity or persists runtime pulses", () => {
  const app = readText("app.js");

  assert.match(app, /addEventListener\("keydown", \(\) =>/);
  assert.doesNotMatch(app, /event\.key/);
  assert.doesNotMatch(app, /event\.code/);
  assert.doesNotMatch(app, /state\.widgetRuntime/);
  assert.match(app, /const widgetRuntime = \{/);
});

test("new saves start taskbar-first and the hidden panel is inert", () => {
  const app = readText("app.js");

  assert.match(app, /panelOpen: false/);
  assert.match(app, /panel\.toggleAttribute\("inert", !state\.panelOpen\)/);
  assert.match(app, /companion\.dataset\.panel = state\.panelOpen \? "open" : "closed"/);
});

test("pointer drag is captured, clamped, persisted, and cannot consume a keyboard click", () => {
  const app = readText("app.js");
  const css = stripCssComments(readText("taskbar-companion.css"));

  assert.match(app, /position: null/);
  assert.match(app, /setPointerCapture\(event\.pointerId\)/);
  assert.match(app, /hasPointerCapture\(pointerId\)/);
  assert.match(app, /releasePointerCapture\(pointerId\)/);
  assert.match(app, /addEventListener\("pointerdown", beginWidgetDrag\)/);
  assert.match(app, /addEventListener\("pointermove", moveWidgetDrag\)/);
  assert.match(app, /addEventListener\("pointerup", finishWidgetDrag\)/);
  assert.match(app, /addEventListener\("pointercancel", finishWidgetDrag\)/);
  assert.match(app, /addEventListener\("lostpointercapture", finishWidgetDrag\)/);
  assert.match(app, /WIDGET_DRAG_THRESHOLD_PX = 5/);
  assert.match(app, /state\.widget\.position = WidgetCore\.taskbarPositionToNormalized/);
  assert.match(app, /window\.addEventListener\("resize"/);
  assert.match(app, /restoreWidgetPosition\(\)/);
  assert.match(app, /if \(event\.detail === 0\) return false/);
  assert.match(
    app,
    /event\.stopPropagation\(\);\s+if \(suppressClickAfterWidgetDrag\(event\)\) return;\s+markWidgetActivity\(Date\.now\(\), false\)/
  );
  assert.match(css, /\.taskbar-companion\[data-positioned="true"\]/);
  assert.match(css, /cursor\s*:\s*grab\b/);
  assert.match(css, /\[data-dragging="true"\][^}]+cursor\s*:\s*grabbing\b/);
  assert.match(css, /touch-action\s*:\s*none\b/);
});

test("the visible taskbar cat only toggles the panel and never claims taskbar work", () => {
  const app = readText("app.js");
  const css = stripCssComments(readText("taskbar-companion.css"));
  const styles = stripCssComments(readText("game-ui-v4.css"));
  const html = readText("index.html");
  const clickStart = app.indexOf('$("#tinyWidget").addEventListener("click"');
  const clickEnd = app.indexOf('$("#collapseButton").addEventListener', clickStart);
  const clickHandler = app.slice(clickStart, clickEnd);
  const dragStart = app.indexOf("function beginWidgetDrag");
  const dragEnd = app.indexOf("function moveWidgetDrag", dragStart);
  const dragHandler = app.slice(dragStart, dragEnd);

  assert.ok(clickStart >= 0 && clickEnd > clickStart, "taskbar cat click handler must be found");
  assert.doesNotMatch(app, /hitTarget\.disabled\s*=\s*state\.panelOpen/);
  assert.match(app, /state\.panelOpen\s*\?\s*"고양이를 눌러 가게 닫기"/);
  assert.match(html, /id="tinyWidget"[\s\S]{0,220}aria-expanded="false"/);
  assert.match(css, /\.taskbar-companion\s*\{[^}]*z-index\s*:\s*4\b/);
  assert.match(styles, /\.game-panel\s*\{[^}]*z-index\s*:\s*2\b/);
  assert.doesNotMatch(
    css,
    /\.taskbar-companion\[data-panel="open"\]\s*\{[^}]*(?:opacity\s*:\s*0|pointer-events\s*:\s*none)/
  );
  assert.doesNotMatch(
    css,
    /\[data-panel="open"\]\s+\.taskbar-cat-hit-target\s*\{[^}]*pointer-events\s*:\s*none/
  );
  assert.doesNotMatch(dragHandler, /state\.panelOpen/);
  assert.match(
    clickHandler,
    /if \(state\.panelOpen\) \{\s*state\.panelOpen = false;\s*render\(\);\s*return;\s*\}\s*state\.panelOpen = true;/
  );
  assert.doesNotMatch(clickHandler, /claim|reward|완성|수령/i);
});

test("direction A runtime is one compact restaurant scene with one recipe board", () => {
  const html = readText("index.html");
  const app = readText("app.js");
  const styles = readText("game-ui-v4.css");
  const visibleMenuEmoji = /[🐾🍳🥄🌿🏠⭐🪙💎⚡🐱💾🍴🥼🎒🍲📔🍝🍰🥘🥤🥖🌾🥕🍅🥛🧀🥚🚚🏡🏘️🎁🪑🔒♥]/u;
  const combined = `${html}\n${app}\n${styles}`;

  assert.equal((html.match(/class="restaurant-scene"/g) || []).length, 1);
  assert.equal((html.match(/class="recipe-board"/g) || []).length, 1);
  assert.equal((html.match(/class="scene-action /g) || []).length, 3);
  assert.equal((html.match(/class="primary-action"/g) || []).length, 1);
  assert.doesNotMatch(combined, /assets\/menu-v1\//);
  assert.doesNotMatch(combined, /game-ui-v3\.css/);
  assert.doesNotMatch(html, /<svg\b|class="nav-item|class="management-view/);
  assert.doesNotMatch(combined, visibleMenuEmoji);
  assert.match(html, /id="cookButton"/);
  assert.match(styles, /assets\/management-v4\/restaurant-scene-v3-empty\.png/);
  assert.doesNotMatch(styles, /url\("\.\/assets\/management-v4\/restaurant-scene\.png"\)/);
  assert.match(styles, /assets\/management-v4\/recipes-v2\/cake\.png/);
  assert.match(styles, /assets\/management-v4\/tabs\/kitchen\.png/);
  assert.match(styles, /\.scene-action::before\s*\{[^}]*border-radius\s*:\s*9px[^}]*background-position\s*:\s*-68px -19px/s);
  assert.match(styles, /\.recipe-symbol\s*\{[^}]*background-size\s*:\s*contain/s);
  assert.doesNotMatch(styles, /\.recipe-symbol\s*\{[^}]*border-radius\s*:\s*50%/s);
  assert.match(styles, /assets\/management-v4\/recipes-v2\/stew\.png/);
  assert.match(styles, /\.resource i\s*\{[^}]*overflow\s*:\s*hidden[^}]*border-radius\s*:\s*50%/s);
  assert.doesNotMatch(styles, /\.scene-action--kitchen\s*\{[^}]*background-image/s);
  assert.match(styles, /\.primary-action:hover/);
  assert.match(styles, /\.primary-action:active/);
  assert.match(styles, /\.primary-action:focus-visible/);
  assert.match(styles, /\.primary-action:disabled/);
});

test("owned restaurant customers arrive, order, react, and leave with their bubbles", () => {
  const html = readText("index.html");
  const app = readText("app.js");
  const styles = stripCssComments(readText("game-ui-v4.css"));

  assert.equal((html.match(/data-scene-customer="[0-2]"/g) || []).length, 3);
  assert.equal((html.match(/class="scene-customer-body"/g) || []).length, 3);
  assert.equal((html.match(/class="scene-bubble"/g) || []).length, 3);
  assert.match(html, /data-phase="empty"[^>]*aria-hidden="true"/);
  assert.match(html, /id="sceneStatusTitle"/);
  assert.match(html, /id="sceneStatusCopy"/);
  assert.match(app, /const SCENE_ORDER_IDS = Object\.freeze\(\["stew", "pasta", "cake", "juice"\]\)/);
  assert.match(app, /function tickSceneLife\(now\)/);
  assert.match(app, /function serveSceneOrder\(orderId\)/);
  assert.match(app, /function nextSceneOrderId\(\)/);
  assert.match(app, /tickSceneLife\(now\)/);
  assert.match(app, /render\(\);\s+serveSceneOrder\(recipe\.id\);/);
  assert.match(app, /customer\.phase === "empty"/);
  assert.match(app, /customer\.phase === "arriving"/);
  assert.match(app, /customer\.phase === "leaving"/);
  assert.match(app, /sweatCount < 1/);
  assert.match(app, /angryCount < 1/);
  assert.match(styles, /\.scene-customer\[data-phase="present"\] \.scene-bubble/);
  assert.match(styles, /\.scene-customer\[data-kind="happy"\] \.scene-bubble/);
  assert.match(styles, /\.scene-customer\[data-kind="sweat"\] \.scene-bubble/);
  assert.match(styles, /\.scene-customer\[data-kind="angry"\] \.scene-bubble/);
  assert.match(styles, /assets\/management-v4\/customers-v1\/gray\.png/);
  assert.match(styles, /assets\/management-v4\/customers-v1\/orange\.png/);
  assert.match(styles, /assets\/management-v4\/customers-v1\/tuxedo\.png/);
  assert.match(styles, /assets\/management-v4\/moods\/happy\.png/);
  assert.match(styles, /assets\/management-v4\/moods\/waiting\.png/);
  assert.match(styles, /assets\/management-v4\/moods\/angry\.png/);
  assert.match(styles, /@keyframes sceneBubbleFloat/);
  assert.match(styles, /@keyframes sceneBubbleSwap/);
  assert.match(styles, /@media\s*\(prefers-reduced-motion: reduce\)[\s\S]*\.scene-customer[^}]*transition\s*:\s*none/);
});

test("direction A stays compact and preserves responsive control states", () => {
  const styles = stripCssComments(readText("game-ui-v4.css"));
  const html = readText("index.html");

  assert.match(styles, /\.game-panel\s*\{[^}]*width\s*:\s*910px[^}]*height\s*:\s*520px/s);
  assert.match(styles, /\.management-v4-shell\s*\{[^}]*grid-template-columns\s*:\s*minmax\(0, 584px\) minmax\(0, 292px\)/s);
  assert.match(styles, /\.restaurant-board\s*\{[^}]*grid-template-rows\s*:\s*minmax\(0, 1fr\) 82px/s);
  assert.match(styles, /\.recipe-board\s*\{[^}]*overflow\s*:\s*hidden/s);
  assert.match(styles, /@media\s*\(max-width: 760px\)/);
  assert.match(styles, /\.desktop \.taskbar-companion\[data-panel="open"\][^}]*right\s*:\s*22px/);
  assert.match(html, /모모의 작은 식당/);
  assert.match(html, /무엇을 만들까요\?/);
  assert.match(html, /준비된 재료 받기/);
  assert.doesNotMatch(html, /class="progress"/);
});

test("taskbar CSS is isolated, 12.5 percent smaller, and uses registered PNG atlases", () => {
  const css = readText("taskbar-companion.css");

  for (const atlas of [
    "neutral", "ambient-v6", "typing-fast", "typing-overdrive", "idle-alert",
    "idle-attention", "idle-sniff", "idle-sleepy", "doze-loop", "wake-startle"
  ]) {
    assert.match(css, new RegExp(`taskbar-cat-runtime-v6/${atlas}-atlas\\.png`));
  }
  assert.doesNotMatch(css, /\.webp/);
  assert.match(css, /width: 112px/);
  assert.match(css, /height: 112px/);
  assert.match(css, /transform: scale\(0\.875\)/);
  assert.match(css, /background-size: 128px 128px/);
  assert.doesNotMatch(css, /taskbar-cat-baker-v2\/taskbar-cat-baker-v2-atlas\.png/);
  assert.doesNotMatch(css, /taskbar-cat-v2\/taskbar-cat-v2-atlas\.png/);
  assert.doesNotMatch(css, /widget-chef-cat-generated-cook-v31-16\.png/);
  assert.doesNotMatch(css, /!important/);
  assert.doesNotMatch(css, /widget-stage/);
});

test("taskbar cat has no space-consuming status ticket or completion claim", () => {
  const html = readText("index.html");
  const app = readText("app.js");
  const core = readText("taskbar-widget-core.js");
  const css = stripCssComments(readText("taskbar-companion.css"));
  const widgetStart = html.indexOf('<aside\n        class="taskbar-companion"');
  const widgetEnd = html.indexOf("</aside>", widgetStart);
  const widget = html.slice(widgetStart, widgetEnd);

  assert.match(core, /WORK_DEFINITION_ID = "knead-bread-dough"/);
  assert.match(core, /LEGACY_WORK_DEFINITION_IDS = Object\.freeze\(\["cook-stew"\]\)/);
  assert.doesNotMatch(widget, /taskbar-cat-status|taskbar-cat-job-icon|taskbarPhaseLabel|taskbarLoopLabel|taskbar-cat-progress-dots/);
  assert.doesNotMatch(widget, /🍲|스튜|냄비|완성|ready|claim/i);
  assert.doesNotMatch(app, /claimWidgetWork|taskbarCatAnnouncement|반죽 완성|완성된 반죽/);
  assert.doesNotMatch(core, /claimWork|getWorkStatus|getRemainingSeconds/);
  assert.doesNotMatch(app, /taskbarPhaseLabel|taskbarLoopLabel|dataset\.workStep|getWidgetWorkPresentation/);
  assert.doesNotMatch(css, /taskbar-cat-status|taskbar-cat-job-icon|taskbar-cat-progress-dots|data-work-step/);
});

test("awake idle, typing, doze, and wake use registered assets without whole-image pose transforms", () => {
  const css = stripCssComments(readText("taskbar-companion.css"));
  const app = readText("app.js");
  const core = readText("taskbar-widget-core.js");
  const player = readText("taskbar-cat-player.js");
  const html = readText("index.html");

  assert.doesNotMatch(css, /steps\s*\(/);
  assert.doesNotMatch(css, /--work-cycle\b/);
  assert.doesNotMatch(css, /--cat-look-(?:x|y)\b/);
  assert.doesNotMatch(app, /\b(?:recordPointerMove|pointerLastSampleAt|pointerLastX|lookX)\b/);

  const basePoseRule = [...css.matchAll(/\.taskbar-cat-pose\s*\{([^}]*)\}/g)]
    .find((match) => match[1].includes("background-image"));
  assert.ok(basePoseRule, "a base .taskbar-cat-pose rule must exist");
  assert.match(basePoseRule[1], /var\(--taskbar-cat-neutral-atlas\)/);
  assert.match(basePoseRule[1], /animation\s*:\s*none\b/);
  assert.match(basePoseRule[1], /transition\s*:\s*none\b/);
  assert.match(basePoseRule[1], /transform\s*:\s*none\b/);
  assert.match(html, /<canvas class="taskbar-cat-pose" id="taskbarCatCanvas" width="128" height="128"><\/canvas>/);
  assert.match(player, /canvas\.getContext\("2d"/);
  assert.match(player, /context\.drawImage/);
  assert.match(player, /globalCompositeOperation = "copy"/);
  assert.doesNotMatch(player, /context\.clearRect/);
  assert.match(player, /Do not clear the previous complete frame/);
  assert.match(player, /"ambient-v6"/);
  assert.doesNotMatch(player, /\.webp/);
  assert.match(css, /taskbarCatDozeZ 1800ms ease-in-out infinite/);
  assert.match(app, /companion\.dataset\.pose = pose/);
  assert.match(app, /if \(companion\.dataset\.pose !== pose\)/);
  assert.match(app, /function recordPointerPulse\(now\)\s*\{[\s\S]*?setWidgetReaction\("wake-startle"/);
  assert.doesNotMatch(app, /maybeRunWidgetWorkBeat|maybeBlinkWidget/);
  assert.deepEqual(require("../taskbar-widget-core.js").TASKBAR_POSE_IDS, [
    "ambient-v6", "typing-fast", "typing-overdrive", "idle-alert", "idle-attention",
    "idle-sniff", "idle-sleepy", "doze-loop", "wake-startle", "neutral"
  ]);
  assert.doesNotMatch(app, /setWidgetReactionSequence|WIDGET_GESTURE_SEQUENCE/);
  assert.doesNotMatch(css, /happy-click/);
  assert.doesNotMatch(core, /"happy-click"/);
  assert.doesNotMatch(app, /dataset\.task|claimWidgetWork|observedReadyCycle/);
  assert.doesNotMatch(css, /data-task|taskbar-cat-ready|taskbarReadyPop/);
});

test("typing escalates through bounded normal, fast, and overdrive cues without reading keys", () => {
  const app = readText("app.js");
  const css = stripCssComments(readText("taskbar-companion.css"));
  const keyboardStart = app.indexOf("function recordKeyboardPulse");
  const keyboardEnd = app.indexOf("function recordPointerPulse", keyboardStart);
  const keyboard = app.slice(keyboardStart, keyboardEnd);
  const pointerStart = keyboardEnd;
  const pointerEnd = app.indexOf("function wireWidgetActivitySignals", pointerStart);
  const pointer = app.slice(pointerStart, pointerEnd);

  assert.match(app, /WIDGET_KEY_FEEDBACK_MS = 220/);
  assert.match(app, /WIDGET_KEY_COOLDOWN_MS = 70/);
  assert.match(app, /WIDGET_TYPING_WINDOW_MS = 800/);
  assert.match(app, /WIDGET_TYPING_FAST_HOLD_MS = 1000/);
  assert.match(app, /WIDGET_TYPING_OVERDRIVE_HOLD_MS = 980/);
  assert.match(app, /WIDGET_WAKE_STARTLE_HOLD_MS = 1000/);
  assert.match(app, /WIDGET_WORK_HOLD_MS = 1200/);
  assert.match(app, /reactionToken \+= 1/);
  assert.match(keyboard, /markWidgetActivity\(now, true\)/);
  assert.match(keyboard, /if \(wokeFromDoze\) \{[\s\S]*?keyPulseTimes = \[\][\s\S]*?setWidgetReaction\("wake-startle"/);
  assert.match(keyboard, /if \(widgetRuntime\.reaction === "wake-startle"\) return/);
  assert.match(keyboard, /now - widgetRuntime\.lastKeyReactionAt < WIDGET_KEY_COOLDOWN_MS/);
  assert.match(keyboard, /widgetRuntime\.keyPulseTimes = widgetRuntime\.keyPulseTimes\.filter/);
  assert.match(keyboard, /WidgetCore\.resolveTypingIntensity\(widgetRuntime\.keyPulseTimes\.length\)/);
  assert.match(keyboard, /setWidgetReaction\("typing-fast", WIDGET_TYPING_FAST_HOLD_MS, "input"\)/);
  assert.match(keyboard, /setWidgetReaction\("typing-overdrive", WIDGET_TYPING_OVERDRIVE_HOLD_MS, "input"\)/);
  assert.match(keyboard, /widgetRuntime\.keySide = widgetRuntime\.keySide === "left" \? "right" : "left"/);
  assert.match(keyboard, /setWidgetReaction\(`key-\$\{widgetRuntime\.keySide\}`, WIDGET_KEY_FEEDBACK_MS, "input"\)/);
  assert.doesNotMatch(keyboard, /event\.key|event\.code|localStorage|saveState/);
  assert.doesNotMatch(pointer, /setWidgetReaction\("(?:typing-fast|typing-overdrive|key-left|key-right)"/);
  assert.match(pointer, /setWidgetReaction\("wake-startle", WIDGET_WAKE_STARTLE_HOLD_MS, "wake"\)/);
  assert.match(pointer, /markWidgetActivity\(now, false\)/);
  assert.match(pointer, /\["wake-startle", "typing-fast", "typing-overdrive"\]\.includes\(widgetRuntime\.reaction\)/);
  assert.match(pointer, /setWidgetReaction\("idle-attention", WIDGET_IDLE_ATTENTION_HOLD_MS, "input"\)/);
  assert.match(css, /taskbar-cat-key-flash--left\s*\{ left: 43px; \}/);
  assert.match(css, /taskbar-cat-key-flash--right\s*\{ left: 78px; \}/);
  assert.match(css, /taskbarCatFlourPuff 220ms ease-out/);
  assert.doesNotMatch(css, /\[data-reaction="key-(?:left|right)"\][^}]*background-image/);
});

test("no-input state stops kneading and schedules bounded curious sniff events", () => {
  const html = readText("index.html");
  const app = readText("app.js");
  const core = require("../taskbar-widget-core.js");

  assert.match(html, /data-ambient="alert-idle"[\s\S]{0,180}data-pose="idle-alert"/);
  assert.match(app, /workUntil: 0/);
  assert.match(app, /ambientState: "alert-idle"/);
  assert.match(app, /WIDGET_IDLE_SNIFF_INTERVALS_MS = Object\.freeze\(\[18_000, 26_000, 22_000\]\)/);
  assert.match(app, /if \(ambientState !== "curious-idle"\) \{[\s\S]*?nextIdleEventAt = 0/);
  assert.match(app, /if \(widgetRuntime\.reaction !== "none"\) return/);
  assert.match(app, /setWidgetReaction\("idle-sniff", WIDGET_IDLE_SNIFF_HOLD_MS, "ambient"\)/);
  assert.match(app, /widgetRuntime\.workUntil = Math\.max/);
  assert.equal(core.resolveAmbientState(1_000, 1_000, 0, 0), "alert-idle");
  assert.equal(core.resolveAmbientState(1_000, 2_199, 0, 2_200), "work");
  assert.equal(core.resolveAmbientState(1_000, 2_200, 0, 2_200), "alert-idle");
});

test("motion preferences and panel ownership select the static neutral atlas", () => {
  const css = stripCssComments(readText("taskbar-companion.css"));
  const app = readText("app.js");
  const player = readText("taskbar-cat-player.js");
  const mediaIndex = css.indexOf("@media (prefers-reduced-motion: reduce)");
  const mediaRules = css.slice(mediaIndex);

  assert.ok(mediaIndex >= 0, "system reduced-motion rules must exist");
  assert.match(mediaRules, /\.taskbar-companion\[data-motion\] \.taskbar-cat-pose/);
  assert.match(mediaRules, /animation\s*:\s*none\b/);
  assert.match(mediaRules, /var\(--taskbar-cat-neutral-atlas\)/);
  assert.match(css, /\.taskbar-companion\[data-motion="reduced"\] \.taskbar-cat-pose\s*\{[^}]*var\(--taskbar-cat-neutral-atlas\)/);
  assert.match(css, /\.taskbar-companion\[data-motion="off"\] \.taskbar-cat-pose\s*\{[^}]*var\(--taskbar-cat-neutral-atlas\)/);
  assert.match(app, /TaskbarCatPlayer\?\.sync\(\{[\s\S]*?panelOpen: state\.panelOpen/);
  assert.match(app, /reaction: widgetRuntime\.reaction/);
  assert.match(app, /reactionId: widgetRuntime\.reactionToken/);
  assert.match(player, /panelOpen \|\| motion !== "full"[\s\S]*?"neutral"/);
  assert.match(player, /isFreshNormalPulse[\s\S]*?reaction === "key-right" \? 480 : 80/);
  assert.match(player, /reaction === "key-right" \? 12 : 2/);
});

test("runtime v6 atlases register complete frames, readable dwell, and deformable dough", () => {
  const manifest = JSON.parse(readText("assets/taskbar-cat-runtime-v6/runtime-v6-manifest.json"));
  assert.equal(manifest.animated_webp_runtime, false);
  assert.match(manifest.renderer, /canvas drawImage/);
  assert.equal(manifest.display_size_px, 112);
  assert.equal(manifest.frame_size_px, 128);
  assert.equal(manifest.input_alignment.normal_left_start_frame, 2);
  assert.equal(manifest.input_alignment.normal_right_start_frame, 12);
  assert.ok(manifest.input_alignment.contact_visible_within_ms <= 40);
  assert.ok(manifest.input_alignment.contact_peak_within_ms <= 80);
  assert.equal(manifest.input_alignment.fast_overdrive_restart_on_same_pose, false);
  assert.equal(manifest.clips["ambient-v6"].contacts_per_second, 2.5);
  assert.equal(manifest.clips["typing-fast"].contacts_per_second, 4);
  assert.equal(manifest.clips["typing-overdrive"].contacts_per_second, 8.16);
  assert.ok(manifest.clips["ambient-v6"].contact_peak_dwell_ms >= 100);
  assert.ok(manifest.clips["typing-fast"].contact_peak_dwell_ms >= 100);
  assert.ok(manifest.clips["typing-overdrive"].contact_peak_dwell_ms >= 65);
  for (const pose of ["ambient-v6", "typing-fast", "typing-overdrive"]) {
    assert.equal(manifest.clips[pose].fixed_dough_root_max_changed_pixels, 0);
    assert.equal(manifest.clips[pose].first_last_frames_identical, true);
    assert.equal(manifest.clips[pose].neutral_entry_exit_identical, true);
  }
  for (const pose of ["idle-alert", "idle-attention", "idle-sniff", "idle-sleepy", "doze-loop", "wake-startle"]) {
    assert.equal(manifest.clips[pose].blank_decoded_frames, 0);
  }
  assert.ok(manifest.qa.dough_max_vertical_compression_display_px >= 2);
  assert.ok(manifest.qa.normal_paw_chain_peak_to_peak_display_px >= 3);
  assert.equal(manifest.qa.paw_contact_penetration_source_px, 21);
  assert.deepEqual(manifest.qa.cat_mesh_deformation_layers, []);
  assert.deepEqual(manifest.qa.soft_mesh_deformation_layers, ["dough contact field above fixed root"]);
});

test("former completion saves become a continuous loop and no ready UI remains", () => {
  const app = readText("app.js");
  const core = readText("taskbar-widget-core.js");
  const css = stripCssComments(readText("taskbar-companion.css"));
  const html = readText("index.html");
  const visualHarness = readText("tests/taskbar-visual-states.html");

  assert.match(core, /loopDurationMs/);
  assert.match(core, /\(elapsed % work\.loopDurationMs\) \/ work\.loopDurationMs/);
  for (const source of [app, css, html, visualHarness]) {
    assert.doesNotMatch(source, /taskbar-cat-ready|data-task="ready"|반죽 완성|Ready indicator/);
  }
  assert.doesNotMatch(app, /claimWidgetWork|observedReadyCycle|dataset\.task/);
  assert.doesNotMatch(core, /function claimWork|function getWorkStatus|function getRemainingSeconds/);
});

test("v31 master dimensions and bytes remain exact", () => {
  const bytes = fs.readFileSync(path.join(root, "assets/concept/widget-chef-cat-generated-cook-v31-16.png"));
  assert.equal(bytes.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
  assert.equal(bytes.readUInt32BE(16), 2880);
  assert.equal(bytes.readUInt32BE(20), 170);
  assert.equal(sha256(bytes), "3b7dca1f10c849b5fe3c13b7b0863667a7b140af7d31a6b666835c89bd7abeb3");
});

test("archived baker v2 atlas and manifest remain exact", () => {
  const bytes = fs.readFileSync(path.join(root, "assets/taskbar-cat-baker-v2/taskbar-cat-baker-v2-atlas.png"));
  const manifest = JSON.parse(readText("assets/taskbar-cat-baker-v2/taskbar-cat-baker-v2-manifest.json"));
  const expectedHash = "a651b8e1295d127355e6214b50ba4ad6157a3018636f335a2d5b5a3651cc4ce6";

  assert.equal(bytes.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
  assert.equal(bytes.readUInt32BE(16), 1024);
  assert.equal(bytes.readUInt32BE(20), 1024);
  assert.equal(sha256(bytes), expectedHash);
  assert.equal(manifest.atlas.sha256, expectedHash);
  assert.equal(manifest.frames.length, 4);
  assert.deepEqual(manifest.frames.map((frame) => frame.id), [
    "neutral", "key-left", "key-right", "blink"
  ]);
  assert.ok(manifest.quality.lowerCenterSpreadDisplayPx < 1);
  assert.equal(manifest.quality.baselineRangeRuntimePx, 0);
  assert.equal(manifest.quality.visibleGreenPixels, 0);
  assert.equal(manifest.runtime.keyHoldMs, 165);
  assert.equal(manifest.runtime.blinkHoldMs, 170);
  assert.equal(manifest.runtime.pointerHoldMs, 165);
  assert.equal(manifest.runtime.pointerCooldownMs, 140);
  assert.deepEqual(manifest.runtime.pointerReaction, ["alternating-key-side", "neutral"]);
  assert.deepEqual(manifest.runtime.ambientWorkBeatIntervalMs, [3800, 5800]);
  assert.equal(manifest.runtime.ambientWorkBeatHoldMs, 165);
  assert.equal(manifest.runtime.bodyLoop, false);
});

test("registered cutout v4 runtime assets and manifest remain exact", () => {
  const motion = fs.readFileSync(path.join(root, "assets/taskbar-cat-cutout-rig-v4/chef-cat-fast-knead-motion-128.webp"));
  const neutral = fs.readFileSync(path.join(root, "assets/taskbar-cat-cutout-rig-v4/chef-cat-transparent-neutral-open-eyes.png"));
  const manifest = JSON.parse(readText("assets/taskbar-cat-cutout-rig-v4/fast-knead-manifest.json"));
  const motionHash = "34601b263b3d4c22b3f8ed79e36873ad8ed9f802cde63b3378915aca03c7a4d9";
  const neutralHash = "5ac0cffea0fd560a386b5b511dc67d03ddfdf051647abe93bb29014ce1eda2a9";

  assert.equal(motion.subarray(0, 4).toString("ascii"), "RIFF");
  assert.equal(motion.subarray(8, 12).toString("ascii"), "WEBP");
  assert.equal(sha256(motion), motionHash);
  assert.equal(neutral.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
  assert.equal(neutral.readUInt32BE(16), 1254);
  assert.equal(neutral.readUInt32BE(20), 1254);
  assert.equal(sha256(neutral), neutralHash);
  assert.equal(manifest.outputs.motion_128_webp.sha256, motionHash);
  assert.equal(manifest.outputs.neutral.sha256, neutralHash);
  assert.equal(manifest.frame_count, 120);
  assert.equal(manifest.duration_seconds, 6);
  assert.equal(manifest.fps, 20);
  assert.equal(manifest.knead_events.length, 10);
  assert.equal(manifest.first_last_frames_identical, true);
  assert.equal(manifest.fixed_dough_root_max_changed_pixels, 0);
  assert.equal(manifest.max_visible_green_dominant_pixels, 0);
  assert.equal(manifest.keyboard_or_runtime_integration, false);
});

test("typing fast and overdrive assets match their intensity contract", () => {
  const fast = fs.readFileSync(path.join(root, "assets/taskbar-cat-typing-v1/chef-cat-typing-fast-128.webp"));
  const overdrive = fs.readFileSync(path.join(root, "assets/taskbar-cat-typing-v1/chef-cat-typing-overdrive-128.webp"));
  const manifest = JSON.parse(readText("assets/taskbar-cat-typing-v1/typing-motion-manifest.json"));
  const fastHash = "16dbf8bf994d1fbeee15129225b0b032e3b16b5f4f8fb9e8cfccc9f377e3015f";
  const overdriveHash = "08678c4b0903a74ac84a0d2d4e249313d8ffffc923f19796966a1bfa95565a64";

  assert.equal(fast.subarray(0, 4).toString("ascii"), "RIFF");
  assert.equal(overdrive.subarray(0, 4).toString("ascii"), "RIFF");
  assert.equal(sha256(fast), fastHash);
  assert.equal(sha256(overdrive), overdriveHash);
  assert.equal(manifest.outputs.fast_128_webp.sha256, fastHash);
  assert.equal(manifest.outputs.overdrive_128_webp.sha256, overdriveHash);
  assert.equal(manifest.modes.fast.frame_count, 20);
  assert.equal(manifest.modes.fast.duration_ms, 1000);
  assert.equal(manifest.modes.fast.contacts_per_second, 6);
  assert.equal(manifest.modes.overdrive.frame_count, 25);
  assert.equal(manifest.modes.overdrive.duration_ms, 1000);
  assert.equal(manifest.modes.overdrive.contacts_per_second, 8);
  assert.equal(manifest.speed_fx.horizontal_streaks_allowed, false);
  assert.match(manifest.speed_fx.contrast_palette, /warm flour-white burst with cocoa outline/);
  assert.match(manifest.speed_fx.fast_burst, /21\.4px comic impact crown/);
  assert.match(manifest.speed_fx.fast_burst, /seven airborne particles/);
  assert.match(manifest.speed_fx.overdrive_burst, /27\.7px double impact crown/);
  assert.match(manifest.speed_fx.overdrive_burst, /fourteen airborne particles/);
  assert.equal(manifest.speed_fx.burst_is_layered_behind_paw, true);
  assert.equal(manifest.speed_fx.burst_clouds_are_union_silhouette, true);
  assert.match(manifest.speed_fx.viewer_left_axis, /downward press/);
  assert.match(manifest.speed_fx.viewer_right_axis, /downward press/);
  for (const mode of [manifest.modes.fast, manifest.modes.overdrive]) {
    assert.equal(mode.first_last_frames_identical, true);
    assert.equal(mode.fixed_dough_root_max_changed_pixels, 0);
    assert.equal(mode.max_visible_green_dominant_pixels, 0);
  }
  assert.deepEqual(manifest.motion_readability, {
    display_size_px: 112,
    fast_forearm_contact_translate_source_px: 35.2,
    fast_forearm_contact_translate_display_px: 3.14,
    overdrive_forearm_contact_translate_source_px: 35.2,
    overdrive_forearm_contact_translate_display_px: 3.14,
    dough_response_is_local_above_fixed_root: true,
    overdrive_uses_extra_penetration: false
  });
  assert.deepEqual(manifest.runtime_intensity_contract, {
    anonymous_window_ms: 800,
    fast_min_pulses: 4,
    overdrive_min_pulses: 8,
    normal_hold_ms: 220,
    fast_hold_ms: 620,
    overdrive_hold_ms: 780,
    input_changes_rewards_or_duration: false,
    input_content_persisted: false,
    replace_current_no_queue: true
  });
});

test("awake idle assets match the no-input state contract", () => {
  const manifest = JSON.parse(readText("assets/taskbar-cat-idle-v1/awake-idle-manifest.json"));
  const expected = {
    alert: "e797e82a13358e57aff682b62bd57e3d105730a279338931c6473f3ea0a259bf",
    attention: "9d1eab71e43488ba6ebbeffa55b835b804810ad75abad5c75d6f9303719509c1",
    sniff: "eda608432abcd062201bc0483ab209d2b4b2d2da5ffb85499dece7f01371f797",
    sleepy: "4360c3448a42f25a74041176e9b9f41d83107c81a77019585e7ba8048e4cad59"
  };
  for (const [mode, hash] of Object.entries(expected)) {
    const bytes = fs.readFileSync(path.join(root, `assets/taskbar-cat-idle-v1/chef-cat-idle-${mode}-128.webp`));
    assert.equal(bytes.subarray(0, 4).toString("ascii"), "RIFF");
    assert.equal(sha256(bytes), hash);
    assert.equal(manifest.outputs[`${mode}_128_webp`].sha256, hash);
    assert.equal(manifest.modes[mode].runtime_sha256, hash);
    assert.equal(manifest.modes[mode].first_last_frames_identical, true);
    assert.equal(manifest.modes[mode].fixed_dough_root_max_changed_pixels, 0);
    assert.equal(manifest.modes[mode].max_visible_green_dominant_pixels, 0);
    assert.equal(manifest.modes[mode].transparent_corners, true);
    assert.equal(manifest.modes[mode].decoded_duration_ms, manifest.modes[mode].duration_ms);
  }
  assert.deepEqual(manifest.timeline_ms, {
    work_hold_after_keyboard: 1200,
    alert_idle_until: 45000,
    curious_idle_until: 180000,
    sleepy_idle_until: 300000,
    doze_after: 300000
  });
  assert.deepEqual(manifest.rare_sniff.interval_sequence_ms, [18000, 26000, 22000]);
  assert.equal(manifest.rare_sniff.queues_or_overlaps, false);
  assert.equal(manifest.rare_sniff.speech_bubble_fx, false);
  assert.deepEqual(manifest.rare_sniff.semantic_cues, [
    "near-vertical head approach",
    "two nose-local squash pulses",
    "one short dough-to-nose scent curl per pulse"
  ]);
  assert.equal(manifest.unity_handoff.keyboard_starts_kneading, true);
  assert.equal(manifest.unity_handoff.pointer_starts_kneading, false);
  assert.equal(manifest.unity_handoff.root_motion, false);
});

test("articulated doze and wake assets keep the dough root fixed", () => {
  const doze = fs.readFileSync(path.join(root, "assets/taskbar-cat-rest-v1/chef-cat-doze-128.webp"));
  const wake = fs.readFileSync(path.join(root, "assets/taskbar-cat-rest-v1/chef-cat-wake-startle-128.webp"));
  const manifest = JSON.parse(readText("assets/taskbar-cat-rest-v1/rest-motion-manifest.json"));
  const dozeHash = "5a48415867e6c8f23e2235f60126daa0e657044c8d75951cde2255f98ebfc39b";
  const wakeHash = "a7b740c19b4eaa1771f7e2eb16bb634e23bdaddf55d0f177a286958fcccb8ba4";

  assert.equal(doze.subarray(0, 4).toString("ascii"), "RIFF");
  assert.equal(wake.subarray(0, 4).toString("ascii"), "RIFF");
  assert.equal(sha256(doze), dozeHash);
  assert.equal(sha256(wake), wakeHash);
  assert.equal(manifest.outputs.doze_128_webp.sha256, dozeHash);
  assert.equal(manifest.outputs.wake_startle_128_webp.sha256, wakeHash);
  assert.equal(manifest.display_size_px, 112);
  assert.equal(manifest.motion.doze.frame_count, 80);
  assert.equal(manifest.motion.doze.duration_ms, 4000);
  assert.equal(manifest.motion.doze.first_last_frames_identical, true);
  assert.equal(manifest.motion.doze.fixed_dough_root_max_changed_pixels, 0);
  assert.equal(manifest.motion.wake_startle.frame_count, 20);
  assert.equal(manifest.motion.wake_startle.duration_ms, 1000);
  assert.equal(manifest.motion.wake_startle.starts_from_deep_doze, true);
  assert.equal(manifest.motion.wake_startle.ends_exact_approved_neutral, true);
  assert.equal(manifest.motion.wake_startle.fixed_dough_root_max_changed_pixels, 0);
  assert.equal(manifest.unity_handoff.root_motion, false);
});

test("standalone output contains no external source dependencies", () => {
  const single = readText("taskbar-cat-hero-single.html");

  assert.doesNotMatch(single, /<link\s+rel="stylesheet"/i);
  assert.doesNotMatch(single, /<script\s+src=/i);
  assert.match(single, /data:image\/png;base64,/);
  assert.doesNotMatch(single, /data:image\/webp;base64,/);
  assert.match(single, /Inlined from taskbar-widget-core\.js/);
  assert.match(single, /Inlined from taskbar-cat-player\.js/);
  assert.match(single, /Inlined from app\.js/);
});
