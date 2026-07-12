const test = require("node:test");
const assert = require("node:assert/strict");

const core = require("../taskbar-widget-core.js");

test("keyboard work hold and awake-idle states change at documented boundaries", () => {
  const start = 1_000_000;

  assert.deepEqual(core.AMBIENT_THRESHOLDS_MS, {
    workHold: 1_200,
    curiousIdle: 45_000,
    sleepyIdle: 180_000,
    doze: 300_000
  });
  assert.equal(core.resolveAmbientState(start, start), "alert-idle");
  assert.equal(core.resolveAmbientState(start, start + 1_199, 0, start + 1_200), "work");
  assert.equal(core.resolveAmbientState(start, start + 1_200, 0, start + 1_200), "alert-idle");
  assert.equal(core.resolveAmbientState(start, start + 44_999), "alert-idle");
  assert.equal(core.resolveAmbientState(start, start + 45_000), "curious-idle");
  assert.equal(core.resolveAmbientState(start, start + 179_999), "curious-idle");
  assert.equal(core.resolveAmbientState(start, start + 180_000), "sleepy-idle");
  assert.equal(core.resolveAmbientState(start, start + 299_999), "sleepy-idle");
  assert.equal(core.resolveAmbientState(start, start + 300_000), "doze");
});

test("return state temporarily overrides inactivity", () => {
  assert.equal(core.resolveAmbientState(0, 500_000, 500_600), "return");
  assert.equal(core.resolveAmbientState(500_000, 500_601, 500_600), "alert-idle");
});

test("legacy seconds migrate to a continuous timestamp work loop", () => {
  const now = 50_000;
  const widget = core.normalizeWidgetState(undefined, 12, now);

  assert.equal(widget.work.startedAt, now - 18_000);
  assert.equal(widget.work.loopDurationMs, 30_000);
  assert.equal("completesAt" in widget.work, false);
  assert.equal("cycle" in widget.work, false);
  assert.equal(widget.work.definitionId, "knead-bread-dough");
});

test("legacy stew work migrates to bread dough without losing elapsed time", () => {
  const legacy = {
    definitionId: "cook-stew",
    cycle: 5,
    startedAt: 10_000,
    completesAt: 40_000
  };
  const widget = core.normalizeWidgetState({ motion: "full", work: legacy }, undefined, 20_000);

  assert.deepEqual(widget.work, {
    definitionId: "knead-bread-dough",
    startedAt: 10_000,
    loopDurationMs: 30_000
  });
  assert.equal(core.getWorkProgress(widget.work, 20_000), 1 / 3);
});

test("a formerly completed save migrates into motion instead of a ready state", () => {
  const formerReady = {
    definitionId: "knead-bread-dough",
    cycle: 4,
    startedAt: 10_000,
    completesAt: 40_000
  };
  const widget = core.normalizeWidgetState({ motion: "full", work: formerReady }, undefined, 50_000);

  assert.deepEqual(widget.work, {
    definitionId: "knead-bread-dough",
    startedAt: 10_000,
    loopDurationMs: 30_000
  });
  assert.equal(core.getWorkProgress(widget.work, 50_000), 1 / 3);
  assert.equal(core.claimWork, undefined);
  assert.equal(core.getWorkStatus, undefined);
});

test("work progress is timestamp-derived and loops without completion", () => {
  const work = core.createWorkLoop(10_000, 30_000);

  assert.equal(core.getWorkProgress(work, 5_000), 0);
  assert.equal(core.getWorkProgress(work, 25_000), 0.5);
  assert.equal(core.getWorkProgress(work, 40_000), 0);
  assert.equal(core.getWorkProgress(work, 50_000), 1 / 3);
  assert.equal(core.getWorkProgress(work, 70_000), 0);
});

test("typing pulse counts map to normal, fast, and overdrive without key content", () => {
  assert.deepEqual(core.TYPING_PULSE_THRESHOLDS, { fast: 4, overdrive: 8 });
  assert.equal(core.resolveTypingIntensity(0), "normal");
  assert.equal(core.resolveTypingIntensity(3), "normal");
  assert.equal(core.resolveTypingIntensity(4), "fast");
  assert.equal(core.resolveTypingIntensity(7), "fast");
  assert.equal(core.resolveTypingIntensity(8), "overdrive");
  assert.equal(core.resolveTypingIntensity(Number.NaN), "normal");
});

test("work, awake idle, typing, doze, wake, and static pose selection are deterministic", () => {
  assert.equal(core.resolveTaskbarPose(), "ambient-v6");
  assert.equal(core.resolveTaskbarPose({ ambientState: "alert-idle" }), "idle-alert");
  assert.equal(core.resolveTaskbarPose({ ambientState: "curious-idle" }), "idle-alert");
  assert.equal(core.resolveTaskbarPose({ ambientState: "sleepy-idle" }), "idle-sleepy");
  assert.equal(core.resolveTaskbarPose({ ambientState: "return" }), "idle-alert");
  assert.equal(core.resolveTaskbarPose({ ambientState: "doze" }), "doze-loop");
  assert.equal(core.resolveTaskbarPose({ motion: "reduced" }), "neutral");
  assert.equal(core.resolveTaskbarPose({ motion: "off" }), "neutral");
  assert.equal(core.resolveTaskbarPose({ reaction: "key-left" }), "ambient-v6");
  assert.equal(core.resolveTaskbarPose({ reaction: "typing-fast" }), "typing-fast");
  assert.equal(core.resolveTaskbarPose({ reaction: "typing-overdrive" }), "typing-overdrive");
  assert.equal(core.resolveTaskbarPose({ reaction: "idle-attention" }), "idle-attention");
  assert.equal(core.resolveTaskbarPose({ reaction: "idle-sniff" }), "idle-sniff");
  assert.equal(core.resolveTaskbarPose({ reaction: "wake-startle" }), "wake-startle");
  assert.equal(core.resolveTaskbarPose({ ambientState: "doze", reaction: "wake-startle" }), "wake-startle");
  assert.equal(core.resolveTaskbarPose({ reaction: "typing-overdrive", motion: "reduced" }), "neutral");
  assert.equal(core.resolveTaskbarPose({ reaction: "wake-startle", motion: "off" }), "neutral");
});

test("taskbar position is normalized, viewport-safe, and stable across resize", () => {
  const viewport = { width: 1000, height: 700 };
  const element = { width: 112, height: 112 };

  assert.deepEqual(core.normalizeTaskbarPosition({ x: -2, y: 3 }), { x: 0, y: 1 });
  assert.equal(core.normalizeTaskbarPosition({ x: Number.NaN, y: 0.5 }), null);
  assert.deepEqual(core.getTaskbarMovementBounds(viewport, element), { maxX: 888, maxY: 588 });
  assert.deepEqual(
    core.clampTaskbarPixelPosition({ x: -40, y: 900 }, viewport, element),
    { x: 0, y: 588 }
  );

  const normalized = core.taskbarPositionToNormalized({ x: 444, y: 294 }, viewport, element);
  assert.deepEqual(normalized, { x: 0.5, y: 0.5 });
  assert.deepEqual(
    core.taskbarPositionFromNormalized(normalized, { width: 500, height: 400 }, element),
    { x: 194, y: 144 }
  );
});

test("widget state keeps only a clamped normalized taskbar position", () => {
  const widget = core.normalizeWidgetState({
    motion: "full",
    position: { x: 1.4, y: -0.2 },
    work: core.createWorkLoop(1_000)
  }, undefined, 1_000);

  assert.deepEqual(widget.position, { x: 1, y: 0 });
});

test("timer formatting supports values longer than one minute", () => {
  assert.equal(core.formatTimer(90), "01:30");
  assert.equal(core.formatTimer(-1), "00:00");
});

test("normalized widget state contains no activity or input content", () => {
  const sensitive = "NEVER_PERSIST_THIS_TEXT";
  const normalized = core.normalizeWidgetState({
    motion: "full",
    work: core.createWorkLoop(1_000),
    key: sensitive,
    windowTitle: sensitive,
    inputHistory: [sensitive]
  }, undefined, 1_000);

  assert.equal(JSON.stringify(normalized).includes(sensitive), false);
});
