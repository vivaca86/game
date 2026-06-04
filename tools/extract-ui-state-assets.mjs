import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const executableCandidates = [
  "C:/Users/i/AppData/Local/ms-playwright/chromium-1217/chrome-win64/chrome.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
];

const targets = [
  {
    key: "world_map_raster_underlay_concept",
    kind: "world_map_neutral_underlay",
    source: path.join(rootDir, "assets", "concepts", "ui", "world_map_ui_concept_v001.png"),
    output: path.join(rootDir, "assets", "source", "ui", "world_map_raster_underlay_concept_v001.png"),
    nativeSize: { w: 1672, h: 941 }
  },
  {
    key: "ui_hover_gold_seal_concept",
    source: path.join(rootDir, "assets", "concepts", "ui", "ui_component_sheet_concept_v001.png"),
    output: path.join(rootDir, "assets", "source", "ui", "ui_hover_gold_seal_concept_v001.png"),
    crop: { x: 742, y: 790, w: 102, h: 102 },
    nativeSize: { w: 144, h: 144 }
  },
  {
    key: "ui_hover_boss_skull_stamp_concept",
    source: path.join(rootDir, "assets", "concepts", "ui", "ui_component_sheet_concept_v001.png"),
    output: path.join(rootDir, "assets", "source", "ui", "ui_hover_boss_skull_stamp_concept_v001.png"),
    crop: { x: 1527, y: 370, w: 96, h: 106 },
    nativeSize: { w: 144, h: 144 },
    clearRects: [{ x: 0, y: 134, w: 144, h: 10 }]
  },
  {
    key: "ui_hover_route_node_concept",
    source: path.join(rootDir, "assets", "concepts", "ui", "ui_component_sheet_concept_v001.png"),
    output: path.join(rootDir, "assets", "source", "ui", "ui_hover_route_node_concept_v001.png"),
    crop: { x: 1388, y: 386, w: 78, h: 100 },
    nativeSize: { w: 144, h: 144 },
    clearRects: [
      { x: 0, y: 0, w: 26, h: 144 },
      { x: 128, y: 0, w: 16, h: 144 }
    ]
  },
  {
    key: "ui_hover_choice_badge_concept",
    source: path.join(rootDir, "assets", "concepts", "ui", "ui_component_sheet_concept_v001.png"),
    output: path.join(rootDir, "assets", "source", "ui", "ui_hover_choice_badge_concept_v001.png"),
    crop: { x: 1014, y: 488, w: 98, h: 98 },
    nativeSize: { w: 144, h: 144 }
  },
  {
    key: "ui_hover_action_seal_concept",
    source: path.join(rootDir, "assets", "concepts", "ui", "ui_component_sheet_concept_v001.png"),
    output: path.join(rootDir, "assets", "source", "ui", "ui_hover_action_seal_concept_v001.png"),
    crop: { x: 835, y: 770, w: 100, h: 132 },
    nativeSize: { w: 144, h: 144 },
    clearRects: [{ x: 126, y: 0, w: 18, h: 144 }]
  },
  {
    key: "ui_down_pressed_stamp_concept",
    source: path.join(rootDir, "assets", "concepts", "ui", "ui_component_sheet_concept_v001.png"),
    output: path.join(rootDir, "assets", "source", "ui", "ui_down_pressed_stamp_concept_v001.png"),
    crop: { x: 835, y: 770, w: 100, h: 132 },
    nativeSize: { w: 144, h: 144 },
    clearRects: [{ x: 126, y: 0, w: 18, h: 144 }],
    stateVariant: "pressed"
  },
  {
    key: "ui_disabled_lock_stamp_concept",
    source: path.join(rootDir, "assets", "concepts", "ui", "ui_component_sheet_concept_v001.png"),
    output: path.join(rootDir, "assets", "source", "ui", "ui_disabled_lock_stamp_concept_v001.png"),
    crop: { x: 360, y: 800, w: 92, h: 92 },
    nativeSize: { w: 144, h: 144 },
    stateVariant: "disabled"
  },
  {
    key: "ui_hover_world_map_play_button_concept",
    kind: "button_state",
    source: path.join(rootDir, "assets", "concepts", "ui", "world_map_ui_concept_v001.png"),
    output: path.join(rootDir, "assets", "source", "ui", "ui_hover_world_map_play_button_concept_v001.png"),
    crop: { x: 1250, y: 780, w: 245, h: 130 },
    nativeSize: { w: 280, h: 144 },
    stateVariant: "buttonHover"
  },
  {
    key: "ui_down_world_map_play_button_concept",
    kind: "button_state",
    source: path.join(rootDir, "assets", "concepts", "ui", "world_map_ui_concept_v001.png"),
    output: path.join(rootDir, "assets", "source", "ui", "ui_down_world_map_play_button_concept_v001.png"),
    crop: { x: 1250, y: 780, w: 245, h: 130 },
    nativeSize: { w: 280, h: 144 },
    stateVariant: "buttonDown"
  },
  {
    key: "ui_current_stage_marker_concept",
    kind: "current_marker",
    source: path.join(rootDir, "assets", "concepts", "ui", "world_map_ui_concept_v001.png"),
    output: path.join(rootDir, "assets", "source", "ui", "ui_current_stage_marker_concept_v001.png"),
    crop: { x: 987, y: 487, w: 70, h: 78 },
    nativeSize: { w: 96, h: 108 }
  },
  {
    key: "ui_current_stage_halo_concept",
    kind: "current_halo",
    source: path.join(rootDir, "assets", "concepts", "ui", "world_map_ui_concept_v001.png"),
    output: path.join(rootDir, "assets", "source", "ui", "ui_current_stage_halo_concept_v001.png"),
    crop: { x: 908, y: 490, w: 226, h: 244 },
    nativeSize: { w: 246, h: 264 }
  },
  {
    key: "ui_current_stage_status_badge_concept",
    kind: "current_status_badge",
    source: path.join(rootDir, "assets", "concepts", "ui", "world_map_ui_concept_v001.png"),
    output: path.join(rootDir, "assets", "source", "ui", "ui_current_stage_status_badge_concept_v001.png"),
    crop: { x: 1034, y: 600, w: 82, h: 82 },
    nativeSize: { w: 96, h: 96 }
  },
  {
    key: "effect_paper_slash_concept",
    kind: "effect_sheet",
    effectKind: "paper_slash",
    source: path.join(rootDir, "assets", "source", "cards", "card_art_sun_jab_raster_v001.png"),
    outputs: [
      path.join(rootDir, "assets", "source", "effects", "effect_paper_slash_concept_v001.png"),
      path.join(rootDir, "public", "assets", "runtime", "effects", "effect_paper_slash_v001.png")
    ],
    crop: { x: 152, y: 24, w: 252, h: 252 },
    nativeSize: { w: 1024, h: 1024 },
    frameSize: { w: 256, h: 256 },
    drawScale: 1.08,
    baseAngle: -7,
    angleRange: 9
  },
  {
    key: "effect_stage_spotlight_concept",
    kind: "effect_sheet",
    effectKind: "stage_spotlight",
    source: path.join(rootDir, "assets", "concepts", "ui", "ui_component_sheet_concept_v001.png"),
    outputs: [
      path.join(rootDir, "assets", "source", "effects", "effect_stage_spotlight_concept_v001.png"),
      path.join(rootDir, "public", "assets", "runtime", "effects", "effect_stage_spotlight_v001.png")
    ],
    crop: { x: 596, y: 544, w: 90, h: 90 },
    nativeSize: { w: 1024, h: 1024 },
    frameSize: { w: 256, h: 256 },
    drawScale: 1.04,
    baseAngle: -3,
    angleRange: 6
  },
  {
    key: "effect_ink_splash_concept",
    kind: "effect_sheet",
    effectKind: "ink_splash",
    source: path.join(rootDir, "assets", "concepts", "ui", "ui_component_sheet_concept_v001.png"),
    outputs: [
      path.join(rootDir, "assets", "source", "effects", "effect_ink_splash_concept_v001.png"),
      path.join(rootDir, "public", "assets", "runtime", "effects", "effect_ink_splash_v001.png")
    ],
    crop: { x: 1326, y: 798, w: 90, h: 84 },
    nativeSize: { w: 1024, h: 1024 },
    frameSize: { w: 256, h: 256 },
    drawScale: 1.62,
    baseAngle: -3,
    angleRange: 7
  },
  {
    key: "effect_paper_slash_concept_release",
    kind: "effect_sheet",
    effectKind: "paper_slash",
    source: path.join(rootDir, "assets", "source", "cards", "card_art_sun_jab_raster_v001.png"),
    outputs: [
      path.join(rootDir, "assets", "source", "effects", "release", "effect_paper_slash_concept_v001.png"),
      path.join(rootDir, "public", "assets", "runtime", "release", "effects", "effect_paper_slash_v001.png")
    ],
    crop: { x: 152, y: 24, w: 252, h: 252 },
    nativeSize: { w: 512, h: 512 },
    frameSize: { w: 128, h: 128 },
    drawScale: 1.08,
    baseAngle: -7,
    angleRange: 9
  },
  {
    key: "effect_stage_spotlight_concept_release",
    kind: "effect_sheet",
    effectKind: "stage_spotlight",
    source: path.join(rootDir, "assets", "concepts", "ui", "ui_component_sheet_concept_v001.png"),
    outputs: [
      path.join(rootDir, "assets", "source", "effects", "release", "effect_stage_spotlight_concept_v001.png"),
      path.join(rootDir, "public", "assets", "runtime", "release", "effects", "effect_stage_spotlight_v001.png")
    ],
    crop: { x: 596, y: 544, w: 90, h: 90 },
    nativeSize: { w: 512, h: 512 },
    frameSize: { w: 128, h: 128 },
    drawScale: 1.04,
    baseAngle: -3,
    angleRange: 6
  },
  {
    key: "effect_ink_splash_concept_release",
    kind: "effect_sheet",
    effectKind: "ink_splash",
    source: path.join(rootDir, "assets", "concepts", "ui", "ui_component_sheet_concept_v001.png"),
    outputs: [
      path.join(rootDir, "assets", "source", "effects", "release", "effect_ink_splash_concept_v001.png"),
      path.join(rootDir, "public", "assets", "runtime", "release", "effects", "effect_ink_splash_v001.png")
    ],
    crop: { x: 1326, y: 798, w: 90, h: 84 },
    nativeSize: { w: 512, h: 512 },
    frameSize: { w: 128, h: 128 },
    drawScale: 1.62,
    baseAngle: -3,
    angleRange: 7
  }
];

let browser;
let launchError;
for (const executablePath of [null, ...executableCandidates]) {
  try {
    browser = await chromium.launch(executablePath ? { headless: true, executablePath } : { headless: true });
    break;
  } catch (error) {
    launchError = error;
  }
}
if (!browser) throw launchError;

try {
  const page = await browser.newPage();
  for (const target of targets) {
    const sourceBuffer = await readFile(target.source);
    const dataUrl = target.kind === "world_map_neutral_underlay"
      ? await page.evaluate(async ({ base64, nativeSize }) => {
        const image = await new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error("source concept image failed to load"));
          img.src = `data:image/png;base64,${base64}`;
        });

        const canvas = document.createElement("canvas");
        canvas.width = nativeSize.w;
        canvas.height = nativeSize.h;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) throw new Error("2d canvas context unavailable");
        ctx.drawImage(image, 0, 0, nativeSize.w, nativeSize.h);

        const imageData = ctx.getImageData(0, 0, nativeSize.w, nativeSize.h);
        const data = imageData.data;
        const regions = [
          { x: 510, y: 704, rx: 76, ry: 54, strength: 1.08, mode: "green" },
          { x: 704, y: 700, rx: 76, ry: 54, strength: 1.08, mode: "green" },
          { x: 872, y: 690, rx: 76, ry: 54, strength: 1.08, mode: "green" },
          { x: 1018, y: 615, rx: 166, ry: 178, strength: 1.08, mode: "cyan" },
          { x: 1022, y: 512, rx: 96, ry: 112, strength: 1.12, mode: "cyan" },
          { x: 1160, y: 502, rx: 82, ry: 90, strength: 0.78, mode: "cyan" }
        ];
        const segments = [
          { x1: 510, y1: 676, x2: 704, y2: 676, r: 42, strength: 1.05 },
          { x1: 704, y1: 676, x2: 872, y2: 662, r: 42, strength: 1.05 },
          { x1: 872, y1: 662, x2: 1018, y2: 615, r: 48, strength: 1.08 },
          { x1: 1018, y1: 588, x2: 1160, y2: 502, r: 42, strength: 0.94 }
        ];

        for (let y = 420; y < 780; y += 1) {
          for (let x = 420; x < 1250; x += 1) {
            let greenMask = 0;
            let cyanMask = 0;

            for (const region of regions) {
              const dx = (x - region.x) / region.rx;
              const dy = (y - region.y) / region.ry;
              const distance = Math.sqrt(dx * dx + dy * dy);
              if (distance >= 1) continue;
              const mask = (1 - distance) * region.strength;
              if (region.mode === "green") {
                greenMask = Math.max(greenMask, mask);
              } else {
                cyanMask = Math.max(cyanMask, mask);
              }
            }

            for (const segment of segments) {
              const distance = distanceToSegment(x, y, segment.x1, segment.y1, segment.x2, segment.y2);
              if (distance < segment.r) {
                cyanMask = Math.max(cyanMask, (1 - distance / segment.r) * segment.strength);
              }
            }

            if (greenMask <= 0 && cyanMask <= 0) continue;

            const offset = (y * nativeSize.w + x) * 4;
            const r = data[offset];
            const g = data[offset + 1];
            const b = data[offset + 2];
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            const saturation = max - min;
            const luminance = r * 0.299 + g * 0.587 + b * 0.114;
            const cyan = smoothstep(20, 112, ((g + b) / 2) - r * 0.56 + saturation * 0.22);
            const green = smoothstep(12, 92, g - Math.max(r, b) * 0.7 + saturation * 0.22);
            const state = Math.max(cyan * cyanMask, green * greenMask);
            const glowState = Math.max(cyanMask, greenMask) * smoothstep(96, 188, luminance) * smoothstep(8, 70, saturation);
            const amount = Math.min(1, Math.max(state * 1.72, glowState * 0.58));
            if (amount <= 0.035) continue;

            const neutralR = Math.min(255, 94 + luminance * 0.22);
            const neutralG = Math.min(255, 82 + luminance * 0.19);
            const neutralB = Math.min(255, 68 + luminance * 0.16);
            data[offset] = Math.round(r * (1 - amount) + neutralR * amount);
            data[offset + 1] = Math.round(g * (1 - amount) + neutralG * amount);
            data[offset + 2] = Math.round(b * (1 - amount) + neutralB * amount);
          }
        }

        ctx.putImageData(imageData, 0, 0);
        const blurCanvas = document.createElement("canvas");
        blurCanvas.width = nativeSize.w;
        blurCanvas.height = nativeSize.h;
        const blurCtx = blurCanvas.getContext("2d", { willReadFrequently: true });
        if (!blurCtx) throw new Error("2d blur canvas context unavailable");
        blurCtx.filter = "blur(22px)";
        blurCtx.drawImage(canvas, 0, 0);
        const blurData = blurCtx.getImageData(0, 0, nativeSize.w, nativeSize.h).data;
        const scrubRegions = [
          { x: 510, y: 704, rx: 58, ry: 42, strength: 0.74 },
          { x: 704, y: 700, rx: 58, ry: 42, strength: 0.74 },
          { x: 872, y: 690, rx: 58, ry: 42, strength: 0.74 },
          { x: 1022, y: 512, rx: 62, ry: 78, strength: 0.82 },
          { x: 1018, y: 615, rx: 122, ry: 140, strength: 0.58 },
          { x: 1018, y: 684, rx: 96, ry: 70, strength: 0.5 }
        ];
        const scrubSegments = [
          { x1: 510, y1: 676, x2: 704, y2: 676, r: 32, strength: 0.44 },
          { x1: 704, y1: 676, x2: 872, y2: 662, r: 32, strength: 0.44 },
          { x1: 872, y1: 662, x2: 1018, y2: 615, r: 38, strength: 0.5 },
          { x1: 1018, y1: 588, x2: 1160, y2: 502, r: 32, strength: 0.42 }
        ];

        for (let y = 450; y < 760; y += 1) {
          for (let x = 450; x < 1210; x += 1) {
            let scrubMask = 0;

            for (const region of scrubRegions) {
              const dx = (x - region.x) / region.rx;
              const dy = (y - region.y) / region.ry;
              const distance = Math.sqrt(dx * dx + dy * dy);
              if (distance >= 1) continue;
              scrubMask = Math.max(scrubMask, smoothstep(1, 0, distance) * region.strength);
            }

            for (const segment of scrubSegments) {
              const distance = distanceToSegment(x, y, segment.x1, segment.y1, segment.x2, segment.y2);
              if (distance < segment.r) {
                scrubMask = Math.max(scrubMask, smoothstep(segment.r, 0, distance) * segment.strength);
              }
            }

            if (scrubMask <= 0.025) continue;

            const offset = (y * nativeSize.w + x) * 4;
            const r = data[offset];
            const g = data[offset + 1];
            const b = data[offset + 2];
            const luminance = r * 0.299 + g * 0.587 + b * 0.114;
            const neutralR = Math.min(255, 96 + luminance * 0.18);
            const neutralG = Math.min(255, 84 + luminance * 0.16);
            const neutralB = Math.min(255, 70 + luminance * 0.14);
            const targetR = blurData[offset] * 0.56 + neutralR * 0.44;
            const targetG = blurData[offset + 1] * 0.56 + neutralG * 0.44;
            const targetB = blurData[offset + 2] * 0.56 + neutralB * 0.44;
            const amount = Math.min(0.74, scrubMask * 0.92);
            data[offset] = Math.round(r * (1 - amount) + targetR * amount);
            data[offset + 1] = Math.round(g * (1 - amount) + targetG * amount);
            data[offset + 2] = Math.round(b * (1 - amount) + targetB * amount);
          }
        }

        const coverRegions = [
          { x: 510, y: 704, rx: 58, ry: 44, strength: 1.22 },
          { x: 704, y: 700, rx: 58, ry: 44, strength: 1.22 },
          { x: 872, y: 690, rx: 58, ry: 44, strength: 1.22 },
          { x: 1022, y: 512, rx: 56, ry: 70, strength: 0.86 }
        ];

        for (let y = 470; y < 735; y += 1) {
          for (let x = 470; x < 1080; x += 1) {
            let coverMask = 0;
            for (const region of coverRegions) {
              const dx = (x - region.x) / region.rx;
              const dy = (y - region.y) / region.ry;
              const distance = Math.sqrt(dx * dx + dy * dy);
              if (distance >= 1) continue;
              coverMask = Math.max(coverMask, smoothstep(1, 0, distance) * region.strength);
            }
            if (coverMask <= 0.025) continue;

            const offset = (y * nativeSize.w + x) * 4;
            const r = data[offset];
            const g = data[offset + 1];
            const b = data[offset + 2];
            const luminance = r * 0.299 + g * 0.587 + b * 0.114;
            const neutralR = Math.min(255, 92 + luminance * 0.16);
            const neutralG = Math.min(255, 80 + luminance * 0.14);
            const neutralB = Math.min(255, 66 + luminance * 0.12);
            const amount = Math.min(0.98, coverMask * 1.36);
            data[offset] = Math.round(r * (1 - amount) + neutralR * amount);
            data[offset + 1] = Math.round(g * (1 - amount) + neutralG * amount);
            data[offset + 2] = Math.round(b * (1 - amount) + neutralB * amount);
          }
        }

        ctx.putImageData(imageData, 0, 0);
        return canvas.toDataURL("image/png");

        function smoothstep(edge0, edge1, value) {
          const t = Math.max(0, Math.min(1, (value - edge0) / Math.max(1, edge1 - edge0)));
          return t * t * (3 - 2 * t);
        }

        function distanceToSegment(px, py, ax, ay, bx, by) {
          const dx = bx - ax;
          const dy = by - ay;
          if (dx === 0 && dy === 0) return Math.hypot(px - ax, py - ay);
          const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)));
          return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
        }
      }, {
        base64: sourceBuffer.toString("base64"),
        nativeSize: target.nativeSize
      })
      : target.kind === "effect_sheet"
      ? await page.evaluate(async ({ base64, crop, nativeSize, frameSize, effectKind, drawScale, baseAngle, angleRange }) => {
        const image = await new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error("source concept image failed to load"));
          img.src = `data:image/png;base64,${base64}`;
        });

        const canvas = document.createElement("canvas");
        canvas.width = nativeSize.w;
        canvas.height = nativeSize.h;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) throw new Error("2d canvas context unavailable");

        const columns = Math.max(1, Math.floor(nativeSize.w / frameSize.w));
        const rows = Math.max(1, Math.floor(nativeSize.h / frameSize.h));
        const totalFrames = columns * rows;
        for (let frame = 0; frame < totalFrames; frame += 1) {
          const column = frame % columns;
          const row = Math.floor(frame / columns);
          const progress = totalFrames <= 1 ? 1 : frame / (totalFrames - 1);
          const pulse = Math.sin(progress * Math.PI);
          const frameX = column * frameSize.w;
          const frameY = row * frameSize.h;
          const fit = Math.min(frameSize.w / crop.w, frameSize.h / crop.h) * drawScale * (0.86 + progress * 0.18);
          const drawW = crop.w * fit;
          const drawH = crop.h * fit;
          const wobbleX = Math.sin(frame * 1.7) * frameSize.w * 0.025;
          const wobbleY = Math.cos(frame * 1.3) * frameSize.h * 0.018;

          ctx.save();
          ctx.translate(frameX + frameSize.w / 2 + wobbleX, frameY + frameSize.h / 2 + wobbleY);
          ctx.rotate(((baseAngle ?? 0) + (progress - 0.5) * (angleRange ?? 0)) * Math.PI / 180);
          ctx.globalAlpha = 0.72 + pulse * 0.28;
          ctx.filter = "saturate(1.12) contrast(1.08)";
          ctx.drawImage(image, crop.x, crop.y, crop.w, crop.h, -drawW / 2, -drawH / 2, drawW, drawH);
          ctx.restore();
        }

        const imageData = ctx.getImageData(0, 0, nativeSize.w, nativeSize.h);
        const data = imageData.data;
        for (let y = 0; y < nativeSize.h; y += 1) {
          for (let x = 0; x < nativeSize.w; x += 1) {
            const offset = (y * nativeSize.w + x) * 4;
            const originalAlpha = data[offset + 3] / 255;
            if (originalAlpha <= 0) continue;

            const frameX = x % frameSize.w;
            const frameY = y % frameSize.h;
            const cx = frameSize.w / 2;
            const cy = frameSize.h / 2;
            const dx = (frameX - cx) / (frameSize.w * 0.5);
            const dy = (frameY - cy) / (frameSize.h * 0.5);
            const radial = Math.max(0, 1 - Math.max(0, Math.sqrt(dx * dx + dy * dy) - 0.64) / 0.36);

            const r = data[offset];
            const g = data[offset + 1];
            const b = data[offset + 2];
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            const saturation = max - min;
            const luminance = r * 0.299 + g * 0.587 + b * 0.114;
            const parchment = r > 138 && g > 112 && b > 78 && saturation < 82;

            let keep = 0;
            if (effectKind === "paper_slash") {
              const warm = smoothstep(14, 92, (r - b) + saturation * 0.24);
              const bright = smoothstep(62, 180, luminance);
              keep = Math.max(warm, bright * 0.86) * radial;
              if (parchment && luminance < 154) keep *= 0.34;
              data[offset] = Math.min(255, Math.round(r * 1.08 + 10));
              data[offset + 1] = Math.min(255, Math.round(g * 1.02 + 3));
              data[offset + 2] = Math.max(0, Math.round(b * 0.92));
            } else if (effectKind === "stage_spotlight") {
              const warmGold = smoothstep(24, 112, (r - b) + saturation * 0.32);
              const brightInk = smoothstep(94, 196, luminance);
              const starLine = smoothstep(126, 218, luminance);
              const tealShadow = smoothstep(14, 92, ((g + b) / 2) - r + saturation * 0.08) * 0.36;
              keep = Math.max(warmGold * brightInk, starLine * 0.92, tealShadow) * radial;
              if (luminance < 92) keep *= 0.16;
              if (parchment && luminance < 168) keep *= 0.2;
              data[offset] = Math.min(255, Math.round(r * 1.1 + 12));
              data[offset + 1] = Math.min(255, Math.round(g * 1.03 + 5));
              data[offset + 2] = Math.max(0, Math.round(b * 0.9));
            } else {
              const purple = smoothstep(5, 74, (b - g) + saturation * 0.32);
              const darkInk = luminance < 122 && saturation > 22 && b > r * 0.86 ? 0.86 : 0;
              keep = Math.max(purple, darkInk) * radial;
              if (parchment) keep = 0;
              data[offset] = Math.max(0, Math.round(r * 0.9));
              data[offset + 1] = Math.max(0, Math.round(g * 0.82));
              data[offset + 2] = Math.min(255, Math.round(b * 1.14 + 7));
            }

            const alpha = Math.max(0, Math.min(1, originalAlpha * keep));
            data[offset + 3] = alpha < 0.045 ? 0 : Math.round(alpha * 255);
          }
        }
        ctx.putImageData(imageData, 0, 0);

        return canvas.toDataURL("image/png");

        function smoothstep(edge0, edge1, value) {
          const t = Math.max(0, Math.min(1, (value - edge0) / Math.max(1, edge1 - edge0)));
          return t * t * (3 - 2 * t);
        }
      }, {
        base64: sourceBuffer.toString("base64"),
        crop: target.crop,
        nativeSize: target.nativeSize,
        frameSize: target.frameSize,
        effectKind: target.effectKind,
        drawScale: target.drawScale,
        baseAngle: target.baseAngle,
        angleRange: target.angleRange
      })
      : target.kind === "current_status_badge"
      ? await page.evaluate(async ({ base64, crop, nativeSize }) => {
        const image = await new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error("source concept image failed to load"));
          img.src = `data:image/png;base64,${base64}`;
        });

        const canvas = document.createElement("canvas");
        canvas.width = nativeSize.w;
        canvas.height = nativeSize.h;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) throw new Error("2d canvas context unavailable");

        ctx.drawImage(image, crop.x, crop.y, crop.w, crop.h, 0, 0, nativeSize.w, nativeSize.h);
        const imageData = ctx.getImageData(0, 0, nativeSize.w, nativeSize.h);
        const data = imageData.data;
        const cx = nativeSize.w * 0.22;
        const cy = nativeSize.h * 0.48;

        for (let y = 0; y < nativeSize.h; y += 1) {
          for (let x = 0; x < nativeSize.w; x += 1) {
            const offset = (y * nativeSize.w + x) * 4;
            const r = data[offset];
            const g = data[offset + 1];
            const b = data[offset + 2];
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            const saturation = max - min;
            const luminance = r * 0.299 + g * 0.587 + b * 0.114;
            const dx = (x - cx) / (nativeSize.w * 0.34);
            const dy = (y - cy) / (nativeSize.h * 0.34);
            const radial = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy));
            const gold = smoothstep(58, 154, r + g * 0.78 - b * 1.58 + saturation * 0.22);
            const keep = gold * smoothstep(0, 0.3, radial);
            if (keep <= 0.1) {
              data[offset + 3] = 0;
              continue;
            }

            data[offset] = Math.min(255, Math.round(r * 1.06 + luminance * 0.04 + gold * 10));
            data[offset + 1] = Math.min(255, Math.round(g * 1.05 + gold * 8));
            data[offset + 2] = Math.min(255, Math.round(b * 0.98));
            data[offset + 3] = Math.round(Math.min(236, 232 * keep * (0.6 + radial * 0.5)));
          }
        }

        ctx.putImageData(imageData, 0, 0);
        return canvas.toDataURL("image/png");

        function smoothstep(edge0, edge1, value) {
          const t = Math.max(0, Math.min(1, (value - edge0) / Math.max(1, edge1 - edge0)));
          return t * t * (3 - 2 * t);
        }
      }, {
        base64: sourceBuffer.toString("base64"),
        crop: target.crop,
        nativeSize: target.nativeSize
      })
      : target.kind === "current_halo"
      ? await page.evaluate(async ({ base64, crop, nativeSize }) => {
        const image = await new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error("source concept image failed to load"));
          img.src = `data:image/png;base64,${base64}`;
        });

        const canvas = document.createElement("canvas");
        canvas.width = nativeSize.w;
        canvas.height = nativeSize.h;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) throw new Error("2d canvas context unavailable");

        ctx.drawImage(image, crop.x, crop.y, crop.w, crop.h, 0, 0, nativeSize.w, nativeSize.h);
        const imageData = ctx.getImageData(0, 0, nativeSize.w, nativeSize.h);
        const data = imageData.data;
        const centerX = nativeSize.w * 0.5;
        const centerY = nativeSize.h * 0.56;

        for (let y = 0; y < nativeSize.h; y += 1) {
          for (let x = 0; x < nativeSize.w; x += 1) {
            const offset = (y * nativeSize.w + x) * 4;
            const r = data[offset];
            const g = data[offset + 1];
            const b = data[offset + 2];
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            const saturation = max - min;
            const luminance = r * 0.299 + g * 0.587 + b * 0.114;
            const dx = (x - centerX) / (nativeSize.w * 0.52);
            const dy = (y - centerY) / (nativeSize.h * 0.54);
            const radial = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy));
            const centerCutout = smoothstep(
              0.72,
              1.1,
              Math.hypot((x - centerX) / (nativeSize.w * 0.22), (y - (centerY + nativeSize.h * 0.03)) / (nativeSize.h * 0.22))
            );
            const cyan = smoothstep(38, 136, Math.min(g, b) - r * 0.74 + saturation * 0.08);
            const whiteHot = smoothstep(196, 248, luminance) * cyan;
            const keep = Math.max(cyan, whiteHot * 0.18) * smoothstep(0, 0.22, radial) * centerCutout;
            if (keep <= 0.07) {
              data[offset + 3] = 0;
              continue;
            }

            data[offset] = Math.min(255, Math.round(r * 0.88 + luminance * 0.02));
            data[offset + 1] = Math.min(255, Math.round(g * 1.08 + cyan * 18));
            data[offset + 2] = Math.min(255, Math.round(b * 1.12 + cyan * 24));
            data[offset + 3] = Math.round(Math.min(230, 236 * keep * (0.56 + radial * 0.54)));
          }
        }

        ctx.putImageData(imageData, 0, 0);
        return canvas.toDataURL("image/png");

        function smoothstep(edge0, edge1, value) {
          const t = Math.max(0, Math.min(1, (value - edge0) / Math.max(1, edge1 - edge0)));
          return t * t * (3 - 2 * t);
        }
      }, {
        base64: sourceBuffer.toString("base64"),
        crop: target.crop,
        nativeSize: target.nativeSize
      })
      : target.kind === "current_marker"
      ? await page.evaluate(async ({ base64, crop, nativeSize }) => {
        const image = await new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error("source concept image failed to load"));
          img.src = `data:image/png;base64,${base64}`;
        });

        const canvas = document.createElement("canvas");
        canvas.width = nativeSize.w;
        canvas.height = nativeSize.h;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) throw new Error("2d canvas context unavailable");

        const glow = ctx.createRadialGradient(
          nativeSize.w * 0.5,
          nativeSize.h * 0.5,
          nativeSize.w * 0.16,
          nativeSize.w * 0.5,
          nativeSize.h * 0.5,
          nativeSize.w * 0.58
        );
        glow.addColorStop(0, "rgba(94, 234, 212, 0.22)");
        glow.addColorStop(0.58, "rgba(94, 234, 212, 0.08)");
        glow.addColorStop(1, "rgba(94, 234, 212, 0)");
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, nativeSize.w, nativeSize.h);
        ctx.drawImage(image, crop.x, crop.y, crop.w, crop.h, 0, 0, nativeSize.w, nativeSize.h);

        const imageData = ctx.getImageData(0, 0, nativeSize.w, nativeSize.h);
        const data = imageData.data;
        const diamond = [
          { x: 48, y: 7 },
          { x: 78, y: 38 },
          { x: 49, y: 96 },
          { x: 17, y: 41 }
        ];

        for (let y = 0; y < nativeSize.h; y += 1) {
          for (let x = 0; x < nativeSize.w; x += 1) {
            const offset = (y * nativeSize.w + x) * 4;
            const mask = softPolygonMask(x, y, diamond);
            if (mask <= 0) {
              data[offset + 3] = 0;
              continue;
            }

            const r = data[offset];
            const g = data[offset + 1];
            const b = data[offset + 2];
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            const luminance = r * 0.299 + g * 0.587 + b * 0.114;
            const cyan = Math.max(0, (g + b) * 0.5 - r * 0.58 + (max - min) * 0.36);
            const brightFrame = luminance > 154 ? 1 : 0;
            const keep = Math.max(Math.min(1, cyan / 120), brightFrame * 0.8);
            if (keep <= 0.08) {
              data[offset + 3] = 0;
              continue;
            }

            data[offset] = Math.min(255, Math.round(r * 1.06 + luminance * 0.04));
            data[offset + 1] = Math.min(255, Math.round(g * 1.08 + cyan * 0.1));
            data[offset + 2] = Math.min(255, Math.round(b * 1.1 + cyan * 0.12));
            data[offset + 3] = Math.round(248 * mask * keep);
          }
        }

        ctx.putImageData(imageData, 0, 0);
        return canvas.toDataURL("image/png");

        function softPolygonMask(x, y, points) {
          if (!insidePolygon(x, y, points)) return 0;
          let minDistance = Infinity;
          for (let index = 0; index < points.length; index += 1) {
            const a = points[index];
            const b = points[(index + 1) % points.length];
            minDistance = Math.min(minDistance, distanceToSegment(x, y, a.x, a.y, b.x, b.y));
          }
          return Math.max(0, Math.min(1, minDistance / 6));
        }

        function insidePolygon(x, y, points) {
          let inside = false;
          for (let i = 0, j = points.length - 1; i < points.length; j = i, i += 1) {
            const yi = points[i].y;
            const yj = points[j].y;
            if ((yi > y) !== (yj > y)) {
              const xIntersect = ((points[j].x - points[i].x) * (y - yi)) / (yj - yi) + points[i].x;
              if (x < xIntersect) inside = !inside;
            }
          }
          return inside;
        }

        function distanceToSegment(px, py, ax, ay, bx, by) {
          const dx = bx - ax;
          const dy = by - ay;
          if (dx === 0 && dy === 0) return Math.hypot(px - ax, py - ay);
          const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)));
          return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
        }
      }, {
        base64: sourceBuffer.toString("base64"),
        crop: target.crop,
        nativeSize: target.nativeSize
      })
      : target.kind === "button_state"
        ? await page.evaluate(async ({ base64, crop, nativeSize, stateVariant }) => {
        const image = await new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error("source concept image failed to load"));
          img.src = `data:image/png;base64,${base64}`;
        });

        const canvas = document.createElement("canvas");
        canvas.width = nativeSize.w;
        canvas.height = nativeSize.h;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) throw new Error("2d canvas context unavailable");

        ctx.drawImage(image, crop.x, crop.y, crop.w, crop.h, 0, 0, nativeSize.w, nativeSize.h);

        const imageData = ctx.getImageData(0, 0, nativeSize.w, nativeSize.h);
        const data = imageData.data;
        const polygon = [
          { x: 8, y: 42 },
          { x: 38, y: 14 },
          { x: 245, y: 14 },
          { x: 272, y: 32 },
          { x: 260, y: 124 },
          { x: 31, y: 128 },
          { x: 8, y: 110 }
        ];

        for (let y = 0; y < nativeSize.h; y += 1) {
          for (let x = 0; x < nativeSize.w; x += 1) {
            const offset = (y * nativeSize.w + x) * 4;
            const mask = softPolygonMask(x, y, polygon);
            if (mask <= 0) {
              data[offset + 3] = 0;
              continue;
            }

            const r = data[offset];
            const g = data[offset + 1];
            const b = data[offset + 2];
            const luminance = r * 0.299 + g * 0.587 + b * 0.114;
            const center = 1 - Math.min(1, Math.hypot((x - nativeSize.w * 0.5) / (nativeSize.w * 0.54), (y - nativeSize.h * 0.54) / (nativeSize.h * 0.6)));

            if (stateVariant === "buttonDown") {
              const shade = 0.58 + center * 0.12;
              data[offset] = Math.max(0, Math.round(r * shade));
              data[offset + 1] = Math.max(0, Math.round(g * (shade * 0.9)));
              data[offset + 2] = Math.max(0, Math.round(b * (shade * 0.82)));
              data[offset + 3] = Math.round(230 * mask);
            } else {
              data[offset] = Math.min(255, Math.round(r * 1.08 + luminance * 0.08 + center * 18));
              data[offset + 1] = Math.min(255, Math.round(g * 1.08 + luminance * 0.06 + center * 18));
              data[offset + 2] = Math.min(255, Math.round(b * 1.04 + center * 12));
              data[offset + 3] = Math.round(246 * mask);
            }
          }
        }

        ctx.putImageData(imageData, 0, 0);
        return canvas.toDataURL("image/png");

        function softPolygonMask(x, y, points) {
          if (!insidePolygon(x, y, points)) return 0;
          let minDistance = Infinity;
          for (let index = 0; index < points.length; index += 1) {
            const a = points[index];
            const b = points[(index + 1) % points.length];
            minDistance = Math.min(minDistance, distanceToSegment(x, y, a.x, a.y, b.x, b.y));
          }
          return Math.max(0, Math.min(1, minDistance / 8));
        }

        function insidePolygon(x, y, points) {
          let inside = false;
          for (let i = 0, j = points.length - 1; i < points.length; j = i, i += 1) {
            const yi = points[i].y;
            const yj = points[j].y;
            if ((yi > y) !== (yj > y)) {
              const xIntersect = ((points[j].x - points[i].x) * (y - yi)) / (yj - yi) + points[i].x;
              if (x < xIntersect) inside = !inside;
            }
          }
          return inside;
        }

        function distanceToSegment(px, py, ax, ay, bx, by) {
          const dx = bx - ax;
          const dy = by - ay;
          if (dx === 0 && dy === 0) return Math.hypot(px - ax, py - ay);
          const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)));
          return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
        }
      }, {
        base64: sourceBuffer.toString("base64"),
        crop: target.crop,
        nativeSize: target.nativeSize,
        stateVariant: target.stateVariant
      })
      : await page.evaluate(async ({ base64, crop, nativeSize, clearRects, stateVariant }) => {
      const image = await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error("source concept image failed to load"));
        img.src = `data:image/png;base64,${base64}`;
      });

      const canvas = document.createElement("canvas");
      canvas.width = nativeSize.w;
      canvas.height = nativeSize.h;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) throw new Error("2d canvas context unavailable");

      const cx = nativeSize.w / 2;
      const cy = nativeSize.h / 2;
      const radius = Math.min(nativeSize.w, nativeSize.h) * 0.43;
      const glow = ctx.createRadialGradient(cx, cy, radius * 0.42, cx, cy, radius * 0.98);
      if (stateVariant === "disabled") {
        glow.addColorStop(0, "rgba(31, 42, 56, 0.16)");
        glow.addColorStop(0.64, "rgba(79, 69, 56, 0.12)");
        glow.addColorStop(1, "rgba(31, 42, 56, 0)");
      } else {
        glow.addColorStop(0, "rgba(245, 194, 107, 0.18)");
        glow.addColorStop(0.64, "rgba(245, 194, 107, 0.12)");
        glow.addColorStop(1, "rgba(245, 194, 107, 0)");
      }
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, nativeSize.w, nativeSize.h);

      ctx.drawImage(image, crop.x, crop.y, crop.w, crop.h, 0, 0, nativeSize.w, nativeSize.h);

      const imageData = ctx.getImageData(0, 0, nativeSize.w, nativeSize.h);
      const data = imageData.data;
      for (let y = 0; y < nativeSize.h; y += 1) {
        for (let x = 0; x < nativeSize.w; x += 1) {
          const dx = x - cx;
          const dy = y - cy;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const hard = radius * 1.03;
          const soft = radius * 0.78;
          const mask = distance <= soft ? 1 : Math.max(0, 1 - ((distance - soft) / Math.max(1, hard - soft)));
          const offset = (y * nativeSize.w + x) * 4;
          const r = data[offset];
          const g = data[offset + 1];
          const b = data[offset + 2];
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const luminance = r * 0.299 + g * 0.587 + b * 0.114;
          const parchment = r > 142 && g > 118 && b > 88 && max - min < 92;
          const paperFade = parchment ? 0 : 1;
          data[offset + 3] = Math.round(data[offset + 3] * mask * paperFade);
          if (stateVariant === "pressed" && data[offset + 3] > 0) {
            const centerPull = Math.max(0, 1 - (distance / Math.max(1, radius)));
            const shade = 0.48 + centerPull * 0.18;
            data[offset] = Math.max(0, Math.round(r * shade));
            data[offset + 1] = Math.max(0, Math.round(g * (shade * 0.78)));
            data[offset + 2] = Math.max(0, Math.round(b * (shade * 0.68)));
            data[offset + 3] = Math.round(data[offset + 3] * 0.96);
          } else if (stateVariant === "disabled" && data[offset + 3] > 0) {
            const centerPull = Math.max(0, 1 - (distance / Math.max(1, radius)));
            const dull = 0.68 + centerPull * 0.08;
            data[offset] = Math.max(0, Math.min(255, Math.round(r * dull + luminance * 0.14)));
            data[offset + 1] = Math.max(0, Math.min(255, Math.round(g * (dull * 0.92) + luminance * 0.12)));
            data[offset + 2] = Math.max(0, Math.min(255, Math.round(b * (dull * 0.84) + 16)));
            data[offset + 3] = Math.round(data[offset + 3] * 0.94);
          }
        }
      }
      for (const rect of clearRects ?? []) {
        for (let y = Math.max(0, rect.y); y < Math.min(nativeSize.h, rect.y + rect.h); y += 1) {
          for (let x = Math.max(0, rect.x); x < Math.min(nativeSize.w, rect.x + rect.w); x += 1) {
            data[(y * nativeSize.w + x) * 4 + 3] = 0;
          }
        }
      }
      ctx.putImageData(imageData, 0, 0);

      return canvas.toDataURL("image/png");
    }, {
      base64: sourceBuffer.toString("base64"),
      crop: target.crop,
      nativeSize: target.nativeSize,
      clearRects: target.clearRects,
      stateVariant: target.stateVariant
    });

    for (const outputPath of target.outputs ?? [target.output]) {
      await mkdir(path.dirname(outputPath), { recursive: true });
      await writeFile(outputPath, Buffer.from(dataUrl.split(",")[1], "base64"));
      console.log(`extracted ${target.key} -> ${path.relative(rootDir, outputPath)}`);
    }
  }
} finally {
  await browser.close();
}
