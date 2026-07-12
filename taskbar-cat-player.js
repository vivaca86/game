/*
 * Deterministic 128px taskbar-cat frame player.
 *
 * Animated WebP background compositing intermittently omitted the complete
 * character in the browser preview. This adapter draws full lossless PNG
 * atlas frames into one canvas instead. The same clip/frame metadata maps to
 * Unity SpriteAtlas + AnimationClip data without making the DOM authoritative.
 */
(function exposeTaskbarCatPlayer(globalObject) {
  "use strict";

  const FRAME_SIZE = 128;
  const CLIPS = Object.freeze({
    neutral: Object.freeze({ css: "--taskbar-cat-neutral-atlas", frames: 1, frameMs: 1000, columns: 1, loop: false }),
    "ambient-v6": Object.freeze({ css: "--taskbar-cat-work-atlas", frames: 30, frameMs: 40, columns: 6, loop: true }),
    "typing-fast": Object.freeze({ css: "--taskbar-cat-typing-fast-atlas", frames: 25, frameMs: 40, columns: 5, loop: true }),
    "typing-overdrive": Object.freeze({ css: "--taskbar-cat-typing-overdrive-atlas", frames: 49, frameMs: 20, columns: 7, loop: true }),
    "idle-alert": Object.freeze({ css: "--taskbar-cat-idle-alert-atlas", frames: 100, frameMs: 80, columns: 10, loop: true }),
    "idle-attention": Object.freeze({ css: "--taskbar-cat-idle-attention-atlas", frames: 24, frameMs: 50, columns: 5, loop: false }),
    "idle-sniff": Object.freeze({ css: "--taskbar-cat-idle-sniff-atlas", frames: 60, frameMs: 50, columns: 8, loop: false }),
    "idle-sleepy": Object.freeze({ css: "--taskbar-cat-idle-sleepy-atlas", frames: 100, frameMs: 80, columns: 10, loop: true }),
    "doze-loop": Object.freeze({ css: "--taskbar-cat-doze-atlas", frames: 80, frameMs: 50, columns: 9, loop: true }),
    "wake-startle": Object.freeze({ css: "--taskbar-cat-wake-atlas", frames: 20, frameMs: 50, columns: 5, loop: false })
  });

  const runtime = {
    canvas: null,
    context: null,
    companion: null,
    images: new Map(),
    activePose: "neutral",
    lastReactionId: -1,
    startedAt: 0,
    lastFrame: -1,
    animationFrame: 0,
    initialized: false
  };

  function parseCssUrl(value) {
    const trimmed = value.trim();
    const match = trimmed.match(/^url\((['"]?)(.*)\1\)$/);
    return match ? match[2] : "";
  }

  function imageSource(spec) {
    const styles = getComputedStyle(runtime.companion);
    return parseCssUrl(styles.getPropertyValue(spec.css));
  }

  function drawFrame(pose, frameIndex) {
    const spec = CLIPS[pose] || CLIPS.neutral;
    const image = runtime.images.get(pose);
    if (!image || !image.complete || image.naturalWidth === 0) return false;
    const sourceX = (frameIndex % spec.columns) * FRAME_SIZE;
    const sourceY = Math.floor(frameIndex / spec.columns) * FRAME_SIZE;
    // `copy` replaces the full destination in one draw command, including
    // transparent pixels. A prior clearRect + drawImage pair allowed GPU-layer
    // capture to observe the canvas between the two commands.
    runtime.context.globalCompositeOperation = "copy";
    runtime.context.drawImage(
      image,
      sourceX,
      sourceY,
      FRAME_SIZE,
      FRAME_SIZE,
      0,
      0,
      FRAME_SIZE,
      FRAME_SIZE
    );
    runtime.canvas.dataset.rendererReady = "true";
    runtime.canvas.dataset.renderedPose = pose;
    runtime.canvas.dataset.renderedFrame = String(frameIndex);
    return true;
  }

  function frameIndexAt(spec, elapsedMs) {
    const duration = spec.frames * spec.frameMs;
    const bounded = spec.loop
      ? ((elapsedMs % duration) + duration) % duration
      : Math.min(Math.max(0, elapsedMs), Math.max(0, duration - 1));
    return Math.min(spec.frames - 1, Math.floor(bounded / spec.frameMs));
  }

  function tick(timestamp) {
    const pose = runtime.activePose;
    const spec = CLIPS[pose] || CLIPS.neutral;
    const frame = frameIndexAt(spec, timestamp - runtime.startedAt);
    if (frame !== runtime.lastFrame && drawFrame(pose, frame)) {
      runtime.lastFrame = frame;
    }
    runtime.animationFrame = requestAnimationFrame(tick);
  }

  function loadClip(pose) {
    const spec = CLIPS[pose];
    const source = imageSource(spec);
    const image = new Image();
    image.decoding = "async";
    image.onload = () => {
      if (runtime.activePose === pose) {
        runtime.lastFrame = -1;
        drawFrame(pose, frameIndexAt(spec, performance.now() - runtime.startedAt));
      }
    };
    image.src = source;
    runtime.images.set(pose, image);
  }

  function initialize() {
    if (runtime.initialized) return true;
    runtime.canvas = document.querySelector("#taskbarCatCanvas");
    runtime.companion = document.querySelector("#taskbarCompanion");
    if (!runtime.canvas || !runtime.companion) return false;
    runtime.context = runtime.canvas.getContext("2d", { alpha: true, desynchronized: true });
    if (!runtime.context) return false;
    runtime.context.globalCompositeOperation = "copy";
    runtime.context.imageSmoothingEnabled = true;
    runtime.context.imageSmoothingQuality = "high";
    runtime.initialized = true;
    for (const pose of Object.keys(CLIPS)) loadClip(pose);
    runtime.startedAt = performance.now();
    runtime.animationFrame = requestAnimationFrame(tick);
    return true;
  }

  function sync({
    pose = "neutral",
    reaction = "none",
    reactionId = -1,
    panelOpen = false,
    motion = "full"
  } = {}) {
    if (!initialize()) return;
    const nextPose = panelOpen || motion !== "full" || !CLIPS[pose] ? "neutral" : pose;
    const isFreshNormalPulse = nextPose === "ambient-v6"
      && (reaction === "key-left" || reaction === "key-right")
      && reactionId !== runtime.lastReactionId;
    runtime.lastReactionId = reactionId;
    if (isFreshNormalPulse) {
      runtime.activePose = nextPose;
      // ambient-v6 has three 400ms alternating contacts. Align a fresh input
      // with the requested side's anticipation frame, while fast/overdrive
      // continue uninterrupted so dense typing cannot stutter the clip.
      // Start from the already readable anticipation sample. Contact then
      // begins within one frame instead of waiting ~96ms, so two or three
      // ordinary pulses cannot keep replacing each other before any hit lands.
      const sideOffsetMs = reaction === "key-right" ? 480 : 80;
      runtime.startedAt = performance.now() - sideOffsetMs;
      runtime.lastFrame = -1;
      drawFrame(nextPose, reaction === "key-right" ? 12 : 2);
      return;
    }
    if (nextPose === runtime.activePose) return;
    runtime.activePose = nextPose;
    runtime.startedAt = performance.now();
    runtime.lastFrame = -1;
    // Do not clear the previous complete frame while the next atlas loads.
    // The onload callback or next animation tick performs an atomic full draw.
    drawFrame(nextPose, 0);
  }

  globalObject.TaskbarCatPlayer = Object.freeze({
    sync,
    getRuntimeState() {
      return Object.freeze({
        activePose: runtime.activePose,
        renderedPose: runtime.canvas?.dataset.renderedPose || "",
        renderedFrame: Number(runtime.canvas?.dataset.renderedFrame || -1),
        lastReactionId: runtime.lastReactionId,
        ready: runtime.canvas?.dataset.rendererReady === "true"
      });
    }
  });
})(typeof globalThis !== "undefined" ? globalThis : window);
