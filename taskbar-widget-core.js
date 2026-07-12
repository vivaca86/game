/*
 * Taskbar companion domain rules.
 *
 * This file intentionally has no DOM, localStorage, CSS, or browser-timer
 * dependency. The same rules map to a Unity service plus serializable C#
 * models later: WorkLoop -> save model, ambient resolution -> state machine,
 * and the continuous kneading loop -> presentation phase.
 */
(function exposeTaskbarWidgetCore(globalObject, factory) {
  const api = factory();

  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }

  if (globalObject) {
    globalObject.TaskbarWidgetCore = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function createTaskbarWidgetCore() {
  "use strict";

  const WORK_DEFINITION_ID = "knead-bread-dough";
  const LEGACY_WORK_DEFINITION_IDS = Object.freeze(["cook-stew"]);
  const WORK_LOOP_DURATION_MS = 30_000;
  const AMBIENT_THRESHOLDS_MS = Object.freeze({
    workHold: 1_200,
    curiousIdle: 45_000,
    sleepyIdle: 180_000,
    doze: 300_000
  });
  const MOTION_LEVELS = Object.freeze(["full", "reduced", "off"]);
  const TYPING_INTENSITY_LEVELS = Object.freeze(["normal", "fast", "overdrive"]);
  const TYPING_PULSE_THRESHOLDS = Object.freeze({ fast: 4, overdrive: 8 });
  const TASKBAR_POSE_IDS = Object.freeze([
    "ambient-v6",
    "typing-fast",
    "typing-overdrive",
    "idle-alert",
    "idle-attention",
    "idle-sniff",
    "idle-sleepy",
    "doze-loop",
    "wake-startle",
    "neutral"
  ]);

  function clamp(value, minimum, maximum) {
    return Math.max(minimum, Math.min(maximum, value));
  }

  function isFiniteTimestamp(value) {
    return Number.isFinite(value) && value >= 0;
  }

  function normalizeTaskbarPosition(position) {
    if (!position || !Number.isFinite(position.x) || !Number.isFinite(position.y)) {
      return null;
    }

    return {
      x: clamp(position.x, 0, 1),
      y: clamp(position.y, 0, 1)
    };
  }

  function getTaskbarMovementBounds(viewport, element) {
    const viewportWidth = Number.isFinite(viewport?.width) ? Math.max(0, viewport.width) : 0;
    const viewportHeight = Number.isFinite(viewport?.height) ? Math.max(0, viewport.height) : 0;
    const elementWidth = Number.isFinite(element?.width) ? Math.max(0, element.width) : 0;
    const elementHeight = Number.isFinite(element?.height) ? Math.max(0, element.height) : 0;

    return {
      maxX: Math.max(0, viewportWidth - elementWidth),
      maxY: Math.max(0, viewportHeight - elementHeight)
    };
  }

  /**
   * Converts pointer-driven pixels into a viewport-relative save value. Unity's
   * desktop overlay host should persist the same normalized top-left position,
   * then re-project it after monitor work-area or DPI changes.
   */
  function taskbarPositionToNormalized(position, viewport, element) {
    const bounds = getTaskbarMovementBounds(viewport, element);
    const pixelX = Number.isFinite(position?.x) ? position.x : 0;
    const pixelY = Number.isFinite(position?.y) ? position.y : 0;
    const clampedX = clamp(pixelX, 0, bounds.maxX);
    const clampedY = clamp(pixelY, 0, bounds.maxY);

    return {
      x: bounds.maxX > 0 ? clampedX / bounds.maxX : 0,
      y: bounds.maxY > 0 ? clampedY / bounds.maxY : 0
    };
  }

  function taskbarPositionFromNormalized(position, viewport, element) {
    const safe = normalizeTaskbarPosition(position) || { x: 0.5, y: 0.5 };
    const bounds = getTaskbarMovementBounds(viewport, element);

    return {
      x: safe.x * bounds.maxX,
      y: safe.y * bounds.maxY
    };
  }

  function clampTaskbarPixelPosition(position, viewport, element) {
    const normalized = taskbarPositionToNormalized(position, viewport, element);
    return taskbarPositionFromNormalized(normalized, viewport, element);
  }

  function createWorkLoop(now, durationMs = WORK_LOOP_DURATION_MS) {
    const safeNow = isFiniteTimestamp(now) ? now : 0;
    const safeDuration = Number.isFinite(durationMs) && durationMs > 0
      ? durationMs
      : WORK_LOOP_DURATION_MS;

    return {
      definitionId: WORK_DEFINITION_ID,
      startedAt: safeNow,
      loopDurationMs: safeDuration
    };
  }

  function isValidWorkLoop(work) {
    return Boolean(
      work &&
      work.definitionId === WORK_DEFINITION_ID &&
      isFiniteTimestamp(work.startedAt) &&
      Number.isFinite(work.loopDurationMs) &&
      work.loopDurationMs > 0
    );
  }

  function isLegacyTimedWork(work) {
    return Boolean(
      work &&
      (work.definitionId === WORK_DEFINITION_ID || LEGACY_WORK_DEFINITION_IDS.includes(work.definitionId)) &&
      isFiniteTimestamp(work.startedAt) &&
      isFiniteTimestamp(work.completesAt) &&
      work.completesAt > work.startedAt
    );
  }

  /**
   * Migrates former countdown/claim saves into a continuous timestamp loop.
   * Timestamp phase survives background throttling and maps directly to a
   * Unity IClock/WorkLoopService implementation.
   */
  function normalizeWorkLoop(work, legacySeconds, now) {
    const safeNow = isFiniteTimestamp(now) ? now : 0;

    if (isValidWorkLoop(work)) {
      return {
        definitionId: WORK_DEFINITION_ID,
        startedAt: work.startedAt,
        loopDurationMs: work.loopDurationMs
      };
    }

    // Migrate the former claimable completion timestamp into a phase-loop
    // anchor. A save that was already "ready" resumes at the corresponding
    // modulo phase instead of freezing or creating a reward to claim.
    if (isLegacyTimedWork(work)) {
      return {
        definitionId: WORK_DEFINITION_ID,
        startedAt: work.startedAt,
        loopDurationMs: work.completesAt - work.startedAt
      };
    }

    if (Number.isFinite(legacySeconds)) {
      const remainingMs = clamp(legacySeconds * 1000, 0, WORK_LOOP_DURATION_MS);
      return {
        definitionId: WORK_DEFINITION_ID,
        startedAt: safeNow - (WORK_LOOP_DURATION_MS - remainingMs),
        loopDurationMs: WORK_LOOP_DURATION_MS
      };
    }

    return createWorkLoop(safeNow);
  }

  function normalizeWidgetState(widget, legacySeconds, now) {
    const motion = MOTION_LEVELS.includes(widget?.motion) ? widget.motion : "full";

    return {
      motion,
      position: normalizeTaskbarPosition(widget?.position),
      work: normalizeWorkLoop(widget?.work, legacySeconds, now)
    };
  }

  function getWorkProgress(work, now) {
    if (!isValidWorkLoop(work)) return 0;
    const elapsed = Math.max(0, now - work.startedAt);
    return (elapsed % work.loopDurationMs) / work.loopDurationMs;
  }

  function resolveAmbientState(lastActivityAt, now, returnUntil = 0, workUntil = 0) {
    if (now < returnUntil) return "return";
    if (now < workUntil) return "work";

    const idleFor = Math.max(0, now - lastActivityAt);
    if (idleFor < AMBIENT_THRESHOLDS_MS.curiousIdle) return "alert-idle";
    if (idleFor < AMBIENT_THRESHOLDS_MS.sleepyIdle) return "curious-idle";
    if (idleFor < AMBIENT_THRESHOLDS_MS.doze) return "sleepy-idle";
    return "doze";
  }

  /**
   * Maps only the anonymous pulse count in the current in-memory window.  Key
   * identity/content is intentionally outside this domain and no intensity is
   * serialized.  Unity can reproduce this with an ephemeral ring buffer.
   */
  function resolveTypingIntensity(recentPulseCount = 0) {
    const count = Number.isFinite(recentPulseCount)
      ? Math.max(0, Math.floor(recentPulseCount))
      : 0;
    if (count >= TYPING_PULSE_THRESHOLDS.overdrive) return "overdrive";
    if (count >= TYPING_PULSE_THRESHOLDS.fast) return "fast";
    return "normal";
  }

  /** Selects the registered ambient, input, rest, wake, or static derivative. */
  function resolveTaskbarPose({ ambientState = "work", motion = "full", reaction = "none" } = {}) {
    if (motion !== "full") return "neutral";
    if (reaction === "wake-startle") return "wake-startle";
    if (reaction === "typing-overdrive") return "typing-overdrive";
    if (reaction === "typing-fast") return "typing-fast";
    if (reaction === "idle-attention") return "idle-attention";
    if (reaction === "idle-sniff") return "idle-sniff";
    if (ambientState === "work") return "ambient-v6";
    if (ambientState === "doze") return "doze-loop";
    if (ambientState === "sleepy-idle") return "idle-sleepy";
    return "idle-alert";
  }

  function formatTimer(seconds) {
    const safe = Math.max(0, Math.ceil(Number.isFinite(seconds) ? seconds : 0));
    const minutes = Math.floor(safe / 60);
    const remainder = safe % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
  }

  return Object.freeze({
    WORK_DEFINITION_ID,
    WORK_LOOP_DURATION_MS,
    AMBIENT_THRESHOLDS_MS,
    MOTION_LEVELS,
    TYPING_INTENSITY_LEVELS,
    TYPING_PULSE_THRESHOLDS,
    TASKBAR_POSE_IDS,
    normalizeTaskbarPosition,
    getTaskbarMovementBounds,
    taskbarPositionToNormalized,
    taskbarPositionFromNormalized,
    clampTaskbarPixelPosition,
    createWorkLoop,
    isValidWorkLoop,
    normalizeWorkLoop,
    normalizeWidgetState,
    getWorkProgress,
    resolveAmbientState,
    resolveTypingIntensity,
    resolveTaskbarPose,
    formatTimer
  });
});
