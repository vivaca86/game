import {
  copyFileSync,
  existsSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync
} from "node:fs";
import { createHash } from "node:crypto";
import { dirname, extname, isAbsolute, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDirectory, "..");
const outputPath = resolve(projectRoot, "taskbar-cat-hero-single.html");
const temporaryPath = `${outputPath}.tmp`;
const backupPath = `${outputPath}.bak`;

const styleEntries = [
  { href: "./game-ui-v4.css?v=6", file: "game-ui-v4.css" },
  { href: "./taskbar-companion.css?v=17", file: "taskbar-companion.css" }
];
const scriptEntries = [
  { src: "./taskbar-widget-core.js?v=10", file: "taskbar-widget-core.js" },
  { src: "./taskbar-cat-player.js?v=6", file: "taskbar-cat-player.js" },
  { src: "./app.js?v=49", file: "app.js" }
];
const runtimeV6QualityGate = Object.freeze({
  manifest: "assets/taskbar-cat-runtime-v6/runtime-v6-manifest.json",
  frameSize: 128,
  displaySize: 112,
  clips: Object.freeze({
    neutral: Object.freeze({ frames: 1, durationMs: 1000 }),
    "ambient-v6": Object.freeze({ frames: 30, durationMs: 1200, contactsPerSecond: 2.5, minPeakDwellMs: 100 }),
    "typing-fast": Object.freeze({ frames: 25, durationMs: 1000, contactsPerSecond: 4, minPeakDwellMs: 100 }),
    "typing-overdrive": Object.freeze({ frames: 49, durationMs: 980, contactsPerSecond: 8.16, minPeakDwellMs: 65 }),
    "idle-alert": Object.freeze({ frames: 100, durationMs: 8000 }),
    "idle-attention": Object.freeze({ frames: 24, durationMs: 1200 }),
    "idle-sniff": Object.freeze({ frames: 60, durationMs: 3000 }),
    "idle-sleepy": Object.freeze({ frames: 100, durationMs: 8000 }),
    "doze-loop": Object.freeze({ frames: 80, durationMs: 4000 }),
    "wake-startle": Object.freeze({ frames: 20, durationMs: 1000 })
  })
});
const v31QualityGate = Object.freeze({
  file: "assets/concept/widget-chef-cat-generated-cook-v31-16.png",
  width: 2880,
  height: 170,
  sha256: "3b7dca1f10c849b5fe3c13b7b0863667a7b140af7d31a6b666835c89bd7abeb3"
});
const bakerV2QualityGate = Object.freeze({
  file: "assets/taskbar-cat-baker-v2/taskbar-cat-baker-v2-atlas.png",
  manifest: "assets/taskbar-cat-baker-v2/taskbar-cat-baker-v2-manifest.json",
  width: 1024,
  height: 1024,
  sha256: "a651b8e1295d127355e6214b50ba4ad6157a3018636f335a2d5b5a3651cc4ce6"
});
const cutoutV4QualityGate = Object.freeze({
  motionFile: "assets/taskbar-cat-cutout-rig-v4/chef-cat-fast-knead-motion-128.webp",
  motionSha256: "34601b263b3d4c22b3f8ed79e36873ad8ed9f802cde63b3378915aca03c7a4d9",
  neutralFile: "assets/taskbar-cat-cutout-rig-v4/chef-cat-transparent-neutral-open-eyes.png",
  neutralSha256: "5ac0cffea0fd560a386b5b511dc67d03ddfdf051647abe93bb29014ce1eda2a9",
  neutralWidth: 1254,
  neutralHeight: 1254,
  manifest: "assets/taskbar-cat-cutout-rig-v4/fast-knead-manifest.json",
  width: 128,
  height: 128,
  frameCount: 120,
  durationMs: 6000
});
const typingV1QualityGate = Object.freeze({
  manifest: "assets/taskbar-cat-typing-v1/typing-motion-manifest.json",
  width: 128,
  height: 128,
  modes: Object.freeze({
    fast: Object.freeze({
      file: "assets/taskbar-cat-typing-v1/chef-cat-typing-fast-128.webp",
      sha256: "16dbf8bf994d1fbeee15129225b0b032e3b16b5f4f8fb9e8cfccc9f377e3015f",
      frameCount: 20,
      durationMs: 1000,
      contactsPerSecond: 6
    }),
    overdrive: Object.freeze({
      file: "assets/taskbar-cat-typing-v1/chef-cat-typing-overdrive-128.webp",
      sha256: "08678c4b0903a74ac84a0d2d4e249313d8ffffc923f19796966a1bfa95565a64",
      frameCount: 25,
      durationMs: 1000,
      contactsPerSecond: 8
    })
  })
});
const restV1QualityGate = Object.freeze({
  manifest: "assets/taskbar-cat-rest-v1/rest-motion-manifest.json",
  width: 128,
  height: 128,
  displaySize: 112,
  doze: Object.freeze({
    file: "assets/taskbar-cat-rest-v1/chef-cat-doze-128.webp",
    sha256: "5a48415867e6c8f23e2235f60126daa0e657044c8d75951cde2255f98ebfc39b",
    frameCount: 80,
    durationMs: 4000
  }),
  wake: Object.freeze({
    file: "assets/taskbar-cat-rest-v1/chef-cat-wake-startle-128.webp",
    sha256: "a7b740c19b4eaa1771f7e2eb16bb634e23bdaddf55d0f177a286958fcccb8ba4",
    frameCount: 20,
    durationMs: 1000
  })
});
const idleV1QualityGate = Object.freeze({
  manifest: "assets/taskbar-cat-idle-v1/awake-idle-manifest.json",
  width: 128,
  height: 128,
  displaySize: 112,
  modes: Object.freeze({
    alert: Object.freeze({
      file: "assets/taskbar-cat-idle-v1/chef-cat-idle-alert-128.webp",
      sha256: "e797e82a13358e57aff682b62bd57e3d105730a279338931c6473f3ea0a259bf",
      frameCount: 100,
      durationMs: 8000
    }),
    attention: Object.freeze({
      file: "assets/taskbar-cat-idle-v1/chef-cat-idle-attention-128.webp",
      sha256: "9d1eab71e43488ba6ebbeffa55b835b804810ad75abad5c75d6f9303719509c1",
      frameCount: 22,
      durationMs: 1200
    }),
    sniff: Object.freeze({
      file: "assets/taskbar-cat-idle-v1/chef-cat-idle-sniff-128.webp",
      sha256: "eda608432abcd062201bc0483ab209d2b4b2d2da5ffb85499dece7f01371f797",
      frameCount: 60,
      durationMs: 3000
    }),
    sleepy: Object.freeze({
      file: "assets/taskbar-cat-idle-v1/chef-cat-idle-sleepy-128.webp",
      sha256: "4360c3448a42f25a74041176e9b9f41d83107c81a77019585e7ba8048e4cad59",
      frameCount: 100,
      durationMs: 8000
    })
  })
});

function fail(message) {
  throw new Error(message);
}

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

/**
 * Index-based splicing avoids String.replace replacement-token semantics.
 * In particular, app.js contains `$$`; inserting it as a replacement string
 * would silently collapse each pair to one dollar sign.
 */
function spliceOnce(source, anchor, replacement) {
  const first = source.indexOf(anchor);
  if (first < 0 || source.indexOf(anchor, first + anchor.length) >= 0) {
    fail(`Expected exactly one anchor: ${anchor}`);
  }
  return source.slice(0, first) + replacement + source.slice(first + anchor.length);
}

function assertInsideProject(candidatePath) {
  const projectRelative = relative(projectRoot, candidatePath);
  if (projectRelative.startsWith("..") || isAbsolute(projectRelative)) {
    fail(`Asset resolves outside the project: ${candidatePath}`);
  }
}

function readPngDimensions(buffer) {
  const signature = buffer.subarray(0, 8).toString("hex");
  if (signature !== "89504e470d0a1a0a" || buffer.subarray(12, 16).toString("ascii") !== "IHDR") {
    fail("Expected a valid PNG with an IHDR header");
  }
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

function verifyPngMaster(gate, label) {
  const absolutePath = resolve(projectRoot, gate.file);
  const bytes = readFileSync(absolutePath);
  const dimensions = readPngDimensions(bytes);
  if (dimensions.width !== gate.width || dimensions.height !== gate.height) {
    fail(`${label} dimensions changed: ${dimensions.width}x${dimensions.height}`);
  }
  const actualHash = sha256(bytes);
  if (actualHash !== gate.sha256) {
    fail(`${label} master hash changed: ${actualHash}`);
  }
}

function readUint24Le(buffer, offset) {
  return buffer[offset] | (buffer[offset + 1] << 8) | (buffer[offset + 2] << 16);
}

function readAnimatedWebpInfo(buffer) {
  if (buffer.subarray(0, 4).toString("ascii") !== "RIFF" || buffer.subarray(8, 12).toString("ascii") !== "WEBP") {
    fail("Expected a RIFF WEBP asset");
  }

  let offset = 12;
  let width = null;
  let height = null;
  const frameDurations = [];
  while (offset + 8 <= buffer.length) {
    const type = buffer.subarray(offset, offset + 4).toString("ascii");
    const size = buffer.readUInt32LE(offset + 4);
    const payload = offset + 8;
    if (payload + size > buffer.length) fail(`Truncated WEBP chunk: ${type}`);

    if (type === "VP8X" && size >= 10) {
      width = 1 + readUint24Le(buffer, payload + 4);
      height = 1 + readUint24Le(buffer, payload + 7);
    } else if (type === "ANMF" && size >= 16) {
      frameDurations.push(readUint24Le(buffer, payload + 12));
    }
    offset = payload + size + (size & 1);
  }

  return {
    width,
    height,
    frameCount: frameDurations.length,
    durationMs: frameDurations.reduce((total, duration) => total + duration, 0)
  };
}

function verifyCutoutV4Runtime() {
  const motionBytes = readFileSync(resolve(projectRoot, cutoutV4QualityGate.motionFile));
  if (sha256(motionBytes) !== cutoutV4QualityGate.motionSha256) fail("cutout v4 motion hash changed");
  const animation = readAnimatedWebpInfo(motionBytes);
  if (animation.width !== cutoutV4QualityGate.width || animation.height !== cutoutV4QualityGate.height) {
    fail(`cutout v4 dimensions changed: ${animation.width}x${animation.height}`);
  }
  if (animation.frameCount !== cutoutV4QualityGate.frameCount || animation.durationMs !== cutoutV4QualityGate.durationMs) {
    fail(`cutout v4 timing changed: ${animation.frameCount} frames / ${animation.durationMs}ms`);
  }

  verifyPngMaster({
    file: cutoutV4QualityGate.neutralFile,
    width: cutoutV4QualityGate.neutralWidth,
    height: cutoutV4QualityGate.neutralHeight,
    sha256: cutoutV4QualityGate.neutralSha256
  }, "cutout v4 neutral");

  const manifest = JSON.parse(readFileSync(resolve(projectRoot, cutoutV4QualityGate.manifest), "utf8"));
  if (manifest.outputs?.motion_128_webp?.sha256 !== cutoutV4QualityGate.motionSha256) {
    fail("cutout v4 manifest differs from the registered motion");
  }
  if (manifest.outputs?.neutral?.sha256 !== cutoutV4QualityGate.neutralSha256) {
    fail("cutout v4 manifest differs from the registered neutral");
  }
  if (manifest.frame_count !== cutoutV4QualityGate.frameCount || manifest.duration_seconds * 1000 !== cutoutV4QualityGate.durationMs) {
    fail("cutout v4 manifest timing differs from the registered animation");
  }
  if (!manifest.first_last_frames_identical) fail("cutout v4 loop seam is not registered");
  if (manifest.max_visible_green_dominant_pixels !== 0) fail("cutout v4 contains visible chroma contamination");
  if (manifest.fixed_dough_root_max_changed_pixels !== 0) fail("cutout v4 dough root is not fixed");
  if (manifest.keyboard_or_runtime_integration !== false) fail("cutout v4 must remain the ambient-only source asset");
}

function verifyTypingV1Runtime() {
  const manifest = JSON.parse(readFileSync(resolve(projectRoot, typingV1QualityGate.manifest), "utf8"));
  for (const [modeName, gate] of Object.entries(typingV1QualityGate.modes)) {
    const bytes = readFileSync(resolve(projectRoot, gate.file));
    const actualHash = sha256(bytes);
    if (actualHash !== gate.sha256) fail(`typing ${modeName} hash changed: ${actualHash}`);
    const animation = readAnimatedWebpInfo(bytes);
    if (animation.width !== typingV1QualityGate.width || animation.height !== typingV1QualityGate.height) {
      fail(`typing ${modeName} dimensions changed: ${animation.width}x${animation.height}`);
    }
    if (animation.frameCount !== gate.frameCount || animation.durationMs !== gate.durationMs) {
      fail(`typing ${modeName} timing changed: ${animation.frameCount} frames / ${animation.durationMs}ms`);
    }
    const registered = manifest.modes?.[modeName];
    if (manifest.outputs?.[`${modeName}_128_webp`]?.sha256 !== gate.sha256) {
      fail(`typing ${modeName} manifest differs from the runtime asset`);
    }
    if (
      registered?.frame_count !== gate.frameCount ||
      registered?.duration_ms !== gate.durationMs ||
      registered?.contacts_per_second !== gate.contactsPerSecond
    ) {
      fail(`typing ${modeName} manifest timing/cadence differs from the quality gate`);
    }
    if (!registered?.first_last_frames_identical) fail(`typing ${modeName} loop seam is not registered`);
    if (registered?.fixed_dough_root_max_changed_pixels !== 0) fail(`typing ${modeName} dough root moved`);
    if (registered?.max_visible_green_dominant_pixels !== 0) fail(`typing ${modeName} has chroma contamination`);
  }

  const contract = manifest.runtime_intensity_contract;
  if (
    contract?.anonymous_window_ms !== 800 ||
    contract?.fast_min_pulses !== 4 ||
    contract?.overdrive_min_pulses !== 8 ||
    contract?.input_changes_rewards_or_duration !== false ||
    contract?.input_content_persisted !== false ||
    contract?.replace_current_no_queue !== true
  ) {
    fail("typing intensity runtime contract changed");
  }
  if (
    manifest.speed_fx?.horizontal_streaks_allowed !== false ||
    !manifest.speed_fx?.viewer_left_axis?.includes("downward press") ||
    !manifest.speed_fx?.viewer_right_axis?.includes("downward press") ||
    !manifest.speed_fx?.contrast_palette?.includes("cocoa outline")
  ) {
    fail("typing FX direction or contrast contract changed");
  }
  if (
    !manifest.speed_fx?.fast_burst?.includes("21.4px comic impact crown") ||
    !manifest.speed_fx?.fast_burst?.includes("seven airborne particles") ||
    !manifest.speed_fx?.overdrive_burst?.includes("27.7px double impact crown") ||
    !manifest.speed_fx?.overdrive_burst?.includes("fourteen airborne particles") ||
    manifest.speed_fx?.burst_is_layered_behind_paw !== true ||
    manifest.speed_fx?.burst_clouds_are_union_silhouette !== true ||
    manifest.motion_readability?.display_size_px !== 112 ||
    manifest.motion_readability?.fast_forearm_contact_translate_display_px !== 3.14 ||
    manifest.motion_readability?.overdrive_forearm_contact_translate_display_px !== 3.14 ||
    manifest.motion_readability?.dough_response_is_local_above_fixed_root !== true ||
    manifest.motion_readability?.overdrive_uses_extra_penetration !== false
  ) {
    fail("typing impact-readability contract changed");
  }
}

function verifyRestV1Runtime() {
  const manifest = JSON.parse(readFileSync(resolve(projectRoot, restV1QualityGate.manifest), "utf8"));
  for (const [name, gate] of [["doze", restV1QualityGate.doze], ["wake", restV1QualityGate.wake]]) {
    const bytes = readFileSync(resolve(projectRoot, gate.file));
    const actualHash = sha256(bytes);
    if (actualHash !== gate.sha256) fail(`rest ${name} hash changed: ${actualHash}`);
    const animation = readAnimatedWebpInfo(bytes);
    if (animation.width !== restV1QualityGate.width || animation.height !== restV1QualityGate.height) {
      fail(`rest ${name} dimensions changed: ${animation.width}x${animation.height}`);
    }
    if (animation.frameCount !== gate.frameCount || animation.durationMs !== gate.durationMs) {
      fail(`rest ${name} timing changed: ${animation.frameCount} frames / ${animation.durationMs}ms`);
    }
  }
  if (manifest.display_size_px !== restV1QualityGate.displaySize) fail("rest display size contract changed");
  if (manifest.outputs?.doze_128_webp?.sha256 !== restV1QualityGate.doze.sha256) fail("doze manifest hash differs");
  if (manifest.outputs?.wake_startle_128_webp?.sha256 !== restV1QualityGate.wake.sha256) fail("wake manifest hash differs");
  if (!manifest.motion?.doze?.first_last_frames_identical) fail("doze loop seam differs");
  if (manifest.motion?.doze?.fixed_dough_root_max_changed_pixels !== 0) fail("doze dough root moved");
  if (!manifest.motion?.wake_startle?.starts_from_deep_doze) fail("wake entry no longer starts from doze");
  if (!manifest.motion?.wake_startle?.ends_exact_approved_neutral) fail("wake no longer ends at approved neutral");
  if (manifest.motion?.wake_startle?.fixed_dough_root_max_changed_pixels !== 0) fail("wake dough root moved");
  if (manifest.unity_handoff?.root_motion !== false) fail("rest state must not introduce root motion");
}

function verifyIdleV1Runtime() {
  const manifest = JSON.parse(readFileSync(resolve(projectRoot, idleV1QualityGate.manifest), "utf8"));
  for (const [mode, gate] of Object.entries(idleV1QualityGate.modes)) {
    const bytes = readFileSync(resolve(projectRoot, gate.file));
    const actualHash = sha256(bytes);
    if (actualHash !== gate.sha256) fail(`idle ${mode} hash changed: ${actualHash}`);
    const animation = readAnimatedWebpInfo(bytes);
    if (animation.width !== idleV1QualityGate.width || animation.height !== idleV1QualityGate.height) {
      fail(`idle ${mode} dimensions changed: ${animation.width}x${animation.height}`);
    }
    if (animation.frameCount !== gate.frameCount || animation.durationMs !== gate.durationMs) {
      fail(`idle ${mode} timing changed: ${animation.frameCount} frames / ${animation.durationMs}ms`);
    }
    const registered = manifest.modes?.[mode];
    if (manifest.outputs?.[`${mode}_128_webp`]?.sha256 !== gate.sha256 || registered?.runtime_sha256 !== gate.sha256) {
      fail(`idle ${mode} manifest hash differs from runtime`);
    }
    if (
      !registered?.first_last_frames_identical ||
      registered?.fixed_dough_root_max_changed_pixels !== 0 ||
      registered?.max_visible_green_dominant_pixels !== 0 ||
      registered?.transparent_corners !== true ||
      registered?.decoded_frame_count !== gate.frameCount ||
      registered?.decoded_duration_ms !== gate.durationMs
    ) {
      fail(`idle ${mode} registration or written animation gate failed`);
    }
  }
  if (manifest.display_size_px !== idleV1QualityGate.displaySize) fail("idle display size contract changed");
  if (
    manifest.timeline_ms?.work_hold_after_keyboard !== 1200 ||
    manifest.timeline_ms?.alert_idle_until !== 45000 ||
    manifest.timeline_ms?.curious_idle_until !== 180000 ||
    manifest.timeline_ms?.sleepy_idle_until !== 300000 ||
    manifest.timeline_ms?.doze_after !== 300000
  ) {
    fail("idle state timeline changed");
  }
  if (
    manifest.rare_sniff?.only_in_state !== "curious-idle" ||
    manifest.rare_sniff?.queues_or_overlaps !== false ||
    manifest.rare_sniff?.speech_bubble_fx !== false ||
    !manifest.rare_sniff?.semantic_cues?.includes("near-vertical head approach") ||
    !manifest.rare_sniff?.semantic_cues?.includes("two nose-local squash pulses") ||
    !manifest.rare_sniff?.semantic_cues?.includes("one short dough-to-nose scent curl per pulse") ||
    manifest.unity_handoff?.keyboard_starts_kneading !== true ||
    manifest.unity_handoff?.pointer_starts_kneading !== false ||
    manifest.unity_handoff?.root_motion !== false
  ) {
    fail("idle behavior contract changed");
  }
}

function verifyRuntimeV6() {
  const manifest = JSON.parse(readFileSync(resolve(projectRoot, runtimeV6QualityGate.manifest), "utf8"));
  if (manifest.display_size_px !== runtimeV6QualityGate.displaySize) fail("runtime v6 display size changed");
  if (manifest.frame_size_px !== runtimeV6QualityGate.frameSize) fail("runtime v6 frame size changed");
  if (manifest.animated_webp_runtime !== false) fail("runtime v6 must not use animated WebP playback");
  if (!manifest.renderer?.includes("canvas drawImage")) fail("runtime v6 renderer contract changed");
  if (
    manifest.input_alignment?.normal_left_start_frame !== 2 ||
    manifest.input_alignment?.normal_right_start_frame !== 12 ||
    manifest.input_alignment?.contact_visible_within_ms > 40 ||
    manifest.input_alignment?.contact_peak_within_ms > 80 ||
    manifest.input_alignment?.fast_overdrive_restart_on_same_pose !== false
  ) {
    fail("runtime v6 input-to-contact alignment changed");
  }
  for (const [pose, gate] of Object.entries(runtimeV6QualityGate.clips)) {
    const clip = manifest.clips?.[pose];
    if (!clip) fail(`runtime v6 clip missing: ${pose}`);
    if (clip.frame_count !== gate.frames || clip.duration_ms !== gate.durationMs) {
      fail(`runtime v6 ${pose} timing changed`);
    }
    if (gate.contactsPerSecond != null && clip.contacts_per_second !== gate.contactsPerSecond) {
      fail(`runtime v6 ${pose} cadence changed`);
    }
    if (gate.minPeakDwellMs != null && clip.contact_peak_dwell_ms < gate.minPeakDwellMs) {
      fail(`runtime v6 ${pose} impact dwell is too short`);
    }
    if (pose === "ambient-v6" || pose.startsWith("typing-")) {
      if (clip.fixed_dough_root_max_changed_pixels !== 0 || clip.first_last_frames_identical !== true) {
        fail(`runtime v6 ${pose} registration gate failed`);
      }
      if (clip.neutral_entry_exit_identical !== true) fail(`runtime v6 ${pose} neutral seam changed`);
    } else if (pose !== "neutral" && clip.blank_decoded_frames !== 0) {
      fail(`runtime v6 ${pose} contains blank decoded frames`);
    }
    const bytes = readFileSync(resolve(projectRoot, clip.file));
    if (sha256(bytes) !== clip.sha256) fail(`runtime v6 ${pose} atlas hash changed`);
    const dimensions = readPngDimensions(bytes);
    if (
      dimensions.width !== clip.columns * runtimeV6QualityGate.frameSize ||
      dimensions.height !== clip.rows * runtimeV6QualityGate.frameSize
    ) {
      fail(`runtime v6 ${pose} atlas dimensions changed`);
    }
  }
  if (
    manifest.qa?.dough_max_vertical_compression_display_px < 2 ||
    manifest.qa?.normal_paw_chain_peak_to_peak_display_px < 3 ||
    manifest.qa?.fast_paw_chain_peak_to_peak_display_px < 3 ||
    manifest.qa?.paw_contact_penetration_source_px > 21 ||
    manifest.qa?.cat_mesh_deformation_layers?.length !== 0
  ) {
    fail("runtime v6 kinetic-chain or dough-response gate failed");
  }
}

function verifyVisualMasters() {
  verifyPngMaster(v31QualityGate, "v31 archive");
  verifyPngMaster(bakerV2QualityGate, "baker v2 registered atlas");

  const manifest = JSON.parse(readFileSync(resolve(projectRoot, bakerV2QualityGate.manifest), "utf8"));
  if (manifest.atlas?.sha256 !== bakerV2QualityGate.sha256) fail("baker v2 manifest hash differs from the registered atlas");
  if (manifest.atlas?.width !== bakerV2QualityGate.width || manifest.atlas?.height !== bakerV2QualityGate.height) {
    fail("baker v2 manifest dimensions differ from the registered atlas");
  }
  if (manifest.quality?.lowerCenterSpreadDisplayPx >= 1) fail("baker v2 lower-body registration exceeds 1px");
  if (manifest.quality?.baselineRangeRuntimePx !== 0) fail("baker v2 baselines are not identical");
  if (manifest.quality?.visibleGreenPixels !== 0) fail("baker v2 atlas still contains detected chroma fringe");
  if (manifest.quality?.outsideMaskChangedPixels !== 0) fail("baker v2 atlas changed pixels outside approved masks");
  if (manifest.frames?.length !== 4 || manifest.runtime?.bodyLoop !== false) {
    fail("baker v2 manifest must register exactly four non-looping poses");
  }

  verifyCutoutV4Runtime();
  verifyTypingV1Runtime();
  verifyRestV1Runtime();
  verifyIdleV1Runtime();
  verifyRuntimeV6();
}

function inlineCssAssets(css, cssPath, embeddedAssets) {
  const cssDirectory = dirname(cssPath);
  return css.replace(/url\(\s*(["']?)([^"')]+)\1\s*\)/g, (full, _quote, rawValue) => {
    const value = rawValue.trim();
    if (value.startsWith("#") || value.startsWith("data:")) return full;
    if (/^(?:https?:)?\/\//i.test(value)) {
      fail(`External CSS URL is not allowed in the standalone build: ${value}`);
    }

    const localValue = value.replace(/[?#].*$/, "");
    const assetPath = resolve(cssDirectory, localValue);
    assertInsideProject(assetPath);
    const extension = extname(assetPath).toLowerCase();
    const mimeType = extension === ".png"
      ? "image/png"
      : extension === ".webp"
        ? "image/webp"
        : extension === ".svg"
          ? "image/svg+xml"
          : null;
    if (!mimeType) fail(`Only PNG, WebP, and SVG CSS assets are supported: ${value}`);

    const bytes = readFileSync(assetPath);
    const encoded = bytes.toString("base64");
    embeddedAssets.push({
      source: assetPath,
      bytes: bytes.length,
      sha256: sha256(bytes),
      dataSha256: sha256(Buffer.from(encoded, "base64"))
    });
    return `url("data:${mimeType};base64,${encoded}")`;
  });
}

function extractMain(source) {
  const start = source.indexOf("<main ");
  const end = source.indexOf("</main>", start);
  if (start < 0 || end < 0) fail("Unable to locate the main element");
  return source.slice(start, end + "</main>".length);
}

function buildSingleFile() {
  verifyVisualMasters();

  const indexPath = resolve(projectRoot, "index.html");
  const indexSource = readFileSync(indexPath, "utf8");
  const embeddedAssets = [];

  const inlinedStyles = styleEntries.map(({ file }) => {
    const cssPath = resolve(projectRoot, file);
    const css = readFileSync(cssPath, "utf8");
    if (css.includes("</style>")) fail(`${file} contains a closing style tag`);
    return `/* Inlined from ${file} */\n${inlineCssAssets(css, cssPath, embeddedAssets)}`;
  }).join("\n\n");

  const inlinedScripts = scriptEntries.map(({ file }) => {
    const source = readFileSync(resolve(projectRoot, file), "utf8");
    if (source.includes("</script>")) fail(`${file} contains a closing script tag`);
    return `/* Inlined from ${file} */\n${source}`;
  }).join("\n\n");

  let output = indexSource;
  output = spliceOnce(
    output,
    "<title>Taskbar Cat Restaurant Hero</title>",
    "<title>Taskbar Cat Restaurant Hero - Single File</title>"
  );

  const styleTag = (href) => `<link rel="stylesheet" href="${href}" />`;
  output = spliceOnce(output, styleTag(styleEntries[0].href), `<style>\n${inlinedStyles}\n    </style>`);
  for (const entry of styleEntries.slice(1)) {
    output = spliceOnce(output, styleTag(entry.href), "");
  }

  const scriptTag = (src) => `<script src="${src}"></script>`;
  output = spliceOnce(output, scriptTag(scriptEntries[0].src), `<script>\n${inlinedScripts}\n    </script>`);
  for (const entry of scriptEntries.slice(1)) {
    output = spliceOnce(output, scriptTag(entry.src), "");
  }
  // Removing multiple adjacent external script tags can leave indentation-only
  // lines before </body>; normalize that boundary without rewriting inlined
  // source text or the main element.
  output = output.replace(/<\/script>[ \t\r\n]+<\/body>/, "</script>\n  </body>");

  if (extractMain(output) !== extractMain(indexSource)) {
    fail("The standalone main element differs from index.html");
  }
  if (output.includes("<link rel=\"stylesheet\"")) {
    fail("A stylesheet link remains in the standalone output");
  }
  if (/<script\s+src=/i.test(output)) {
    fail("A script src remains in the standalone output");
  }
  for (const entry of styleEntries) {
    if (output.includes(entry.href)) fail(`Standalone output still references ${entry.href}`);
  }
  for (const entry of scriptEntries) {
    const source = readFileSync(resolve(projectRoot, entry.file), "utf8");
    if (!output.includes(source)) fail(`Standalone output does not contain exact ${entry.file} source`);
  }
  for (const asset of embeddedAssets) {
    if (asset.sha256 !== asset.dataSha256) fail(`Base64 round trip changed ${asset.source}`);
  }

  return { output, embeddedAssets };
}

function writeVerified(output) {
  writeFileSync(temporaryPath, output, "utf8");
  const temporaryBytes = readFileSync(temporaryPath);
  if (temporaryBytes.toString("utf8") !== output) fail("Temporary standalone verification failed");

  if (existsSync(outputPath)) copyFileSync(outputPath, backupPath);
  try {
    if (existsSync(outputPath)) rmSync(outputPath);
    renameSync(temporaryPath, outputPath);
    if (readFileSync(outputPath, "utf8") !== output) fail("Final standalone verification failed");
    if (existsSync(backupPath)) rmSync(backupPath);
  } catch (error) {
    if (existsSync(backupPath)) copyFileSync(backupPath, outputPath);
    if (existsSync(temporaryPath)) rmSync(temporaryPath);
    throw error;
  }
}

function main() {
  const mode = process.argv[2] || "--check";
  if (mode !== "--check" && mode !== "--write") {
    fail("Usage: node scripts/build-single.mjs [--check|--write]");
  }

  const { output, embeddedAssets } = buildSingleFile();
  if (mode === "--write") {
    writeVerified(output);
  } else {
    if (!existsSync(outputPath) || readFileSync(outputPath, "utf8") !== output) {
      fail("Standalone file is stale. Run with --write after source verification.");
    }
  }

  const uniqueAssets = new Set(embeddedAssets.map((asset) => asset.source));
  console.log(`mode=${mode}`);
  console.log(`bytes=${Buffer.byteLength(output)}`);
  console.log(`sha256=${sha256(Buffer.from(output))}`);
  console.log(`embedded_asset_occurrences=${embeddedAssets.length}`);
  console.log(`embedded_asset_files=${uniqueAssets.size}`);
  console.log("v31_archive_quality_gate=passed");
  console.log("baker_v2_archive_quality_gate=passed");
  console.log("cutout_v4_runtime_quality_gate=passed");
  console.log("typing_v1_runtime_quality_gate=passed");
  console.log("rest_v1_runtime_quality_gate=passed");
  console.log("idle_v1_runtime_quality_gate=passed");
  console.log("runtime_v6_canvas_quality_gate=passed");
}

main();
