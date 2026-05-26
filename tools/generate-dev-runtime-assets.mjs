import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { deflateSync } from "node:zlib";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = path.join(rootDir, "src", "data", "assetManifest.slice.v1.json");
const outputRoot = path.join(rootDir, "public");

const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const candidateCardArtKeys = new Set([
  "card_art_sun_jab",
  "card_art_fold_guard",
  "card_art_page_step",
  "card_art_ribbon_snap",
  "card_art_lamplight_mark"
]);

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const typeBuffer = Buffer.from(type, "ascii");
  const chunk = Buffer.alloc(12 + data.length);
  chunk.writeUInt32BE(data.length, 0);
  typeBuffer.copy(chunk, 4);
  data.copy(chunk, 8);
  chunk.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 8 + data.length);
  return chunk;
}

function encodePng(width, height, paint) {
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y += 1) {
    const rowStart = y * (width * 4 + 1);
    raw[rowStart] = 0;
    for (let x = 0; x < width; x += 1) {
      const offset = rowStart + 1 + x * 4;
      const [r, g, b, a] = paint(x, y, width, height);
      raw[offset] = r;
      raw[offset + 1] = g;
      raw[offset + 2] = b;
      raw[offset + 3] = a;
    }
  }

  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8;
  header[9] = 6;
  header[10] = 0;
  header[11] = 0;
  header[12] = 0;

  return Buffer.concat([
    Buffer.from("89504e470d0a1a0a", "hex"),
    pngChunk("IHDR", header),
    pngChunk("IDAT", deflateSync(raw, { level: 9 })),
    pngChunk("IEND", Buffer.alloc(0))
  ]);
}

function hash(value) {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function paletteFor(asset) {
  const h = hash(asset.key);
  const accent = [80 + (h & 95), 95 + ((h >>> 8) & 95), 105 + ((h >>> 16) & 95)];
  if (asset.key === "card_frame_attack" || asset.key === "icon_card_attack") {
    return { base: [250, 238, 206], accent: [207, 92, 82], dark: [82, 57, 55] };
  }
  if (asset.key === "card_frame_defense" || asset.key === "icon_card_defense") {
    return { base: [246, 238, 216], accent: [74, 121, 145], dark: [48, 72, 94] };
  }
  if (asset.key === "card_frame_skill" || asset.key === "icon_card_skill") {
    return { base: [247, 238, 212], accent: [86, 154, 135], dark: [72, 67, 108] };
  }
  if (asset.key === "card_art_sun_jab" || asset.key === "card_art_ribbon_snap") {
    return { base: [252, 235, 199], accent: [212, 88, 76], dark: [82, 57, 55] };
  }
  if (asset.key === "card_art_fold_guard") {
    return { base: [237, 238, 224], accent: [74, 121, 145], dark: [48, 72, 94] };
  }
  if (asset.key === "card_art_page_step" || asset.key === "card_art_lamplight_mark") {
    return { base: [246, 237, 207], accent: [91, 151, 133], dark: [72, 67, 108] };
  }
  if (asset.path.includes("/backgrounds/")) return { base: [240, 222, 178], accent, dark: [112, 92, 72] };
  if (asset.path.includes("/cards/")) return { base: [250, 238, 206], accent, dark: [98, 72, 54] };
  if (asset.path.includes("/icons/")) return { base: [246, 231, 192], accent, dark: [76, 82, 96] };
  if (asset.path.includes("/monsters/") || asset.path.includes("/bosses/")) return { base: [230, 216, 198], accent, dark: [83, 63, 88] };
  if (asset.path.includes("/effects/")) return { base: [248, 242, 218], accent, dark: [110, 80, 46] };
  return { base: [244, 230, 198], accent, dark: [84, 74, 68] };
}

function paintFor(asset) {
  if (asset.key.startsWith("card_frame_")) return paintCardFrame(asset);
  if (asset.key.startsWith("icon_card_")) return paintCardTypeIcon(asset);
  if (candidateCardArtKeys.has(asset.key)) return paintCardArt(asset);

  const palette = paletteFor(asset);
  const frame = asset.frameSize;
  const seed = hash(asset.key);
  return (x, y, width, height) => {
    const [br, bg, bb] = palette.base;
    const [ar, ag, ab] = palette.accent;
    const [dr, dg, db] = palette.dark;
    const border = Math.max(4, Math.floor(Math.min(width, height) * 0.035));
    const stripe = Math.floor((x + y + (seed % 47)) / Math.max(12, Math.floor(Math.min(width, height) / 9))) % 2;
    const paper = stripe ? 10 : 0;
    let r = br - paper;
    let g = bg - paper;
    let b = bb - paper;

    const inBorder = x < border || y < border || x >= width - border || y >= height - border;
    if (inBorder) {
      r = dr;
      g = dg;
      b = db;
    }

    const centerX = Math.abs(x / width - 0.5);
    const centerY = Math.abs(y / height - 0.5);
    const motif = centerX < 0.24 && centerY < 0.24;
    if (motif) {
      r = Math.floor((r + ar) / 2);
      g = Math.floor((g + ag) / 2);
      b = Math.floor((b + ab) / 2);
    }

    if (frame && (x % frame.w < 3 || y % frame.h < 3)) {
      r = Math.floor((r + dr) / 2);
      g = Math.floor((g + dg) / 2);
      b = Math.floor((b + db) / 2);
    }

    return [r, g, b, 255];
  };
}

function paintCardArt(asset) {
  const palette = paletteFor(asset);
  const seed = hash(asset.key);
  return (x, y, width, height) => {
    const [paperR, paperG, paperB] = palette.base;
    const [accentR, accentG, accentB] = palette.accent;
    const [darkR, darkG, darkB] = palette.dark;
    const grain = ((x * 17 + y * 11 + seed) % 37) < 7 ? -9 : 0;
    const stageDepth = Math.max(0, Math.min(1, y / height));
    let color = mix(
      [paperR + grain, paperG + grain, paperB + grain, 255],
      [darkR, darkG, darkB, 255],
      stageDepth * 0.16
    );

    if (insideRoundedRect(x, y, 18, 18, width - 36, height - 36, 22)) {
      color = mix(color, [255, 249, 226, 255], 0.18);
    }
    if (!insideRoundedRect(x, y, 8, 8, width - 16, height - 16, 24)) {
      return [0, 0, 0, 0];
    }
    if (!insideRoundedRect(x, y, 16, 16, width - 32, height - 32, 18)) {
      color = [darkR, darkG, darkB, 255];
    }

    const floorLine = Math.floor(height * 0.72);
    if (y > floorLine) {
      color = mix(color, [darkR, darkG, darkB, 255], 0.12);
      if ((x + seed) % 42 < 4) color = mix(color, [255, 245, 212, 255], 0.2);
    }

    if (asset.key === "card_art_sun_jab") {
      const sun = Math.hypot(x - width * 0.27, y - height * 0.26);
      if (sun < 46) color = [255, 213, 94, 255];
      if (sun < 27) color = [255, 246, 177, 255];
      if (distanceToSegment(x, y, 176, 268, 395, 76) < 13) color = [darkR, darkG, darkB, 255];
      if (distanceToSegment(x, y, 190, 255, 410, 66) < 6) color = [accentR, accentG, accentB, 255];
      if (pointInPolygon(x, y, [[396, 76], [442, 56], [421, 102]])) color = [accentR, accentG, accentB, 255];
    } else if (asset.key === "card_art_fold_guard") {
      const shield = pointInPolygon(x, y, [[260, 66], [380, 118], [352, 270], [260, 316], [168, 270], [140, 118]]);
      const fold = pointInPolygon(x, y, [[260, 88], [336, 125], [319, 248], [260, 286]]);
      if (shield) color = [darkR, darkG, darkB, 255];
      if (fold) color = [112, 164, 178, 255];
      if (distanceToSegment(x, y, 260, 88, 260, 286) < 5) color = [244, 231, 189, 255];
      if (distanceToSegment(x, y, 140, 118, 380, 118) < 7) color = [244, 231, 189, 255];
    } else if (asset.key === "card_art_page_step") {
      for (let step = 0; step < 5; step += 1) {
        const sx = 130 + step * 58;
        const sy = 254 - step * 32;
        if (insideRoundedRect(x, y, sx, sy, 116, 26, 6)) color = [darkR, darkG, darkB, 255];
        if (insideRoundedRect(x, y, sx + 8, sy + 4, 100, 14, 4)) color = [240, 229, 192, 255];
      }
      if (Math.hypot(x - 382, y - 101) < 17 || Math.hypot(x - 422, y - 84) < 11) color = [accentR, accentG, accentB, 255];
    } else if (asset.key === "card_art_ribbon_snap") {
      if (distanceToSegment(x, y, 92, 238, 192, 118) < 15) color = [darkR, darkG, darkB, 255];
      if (distanceToSegment(x, y, 180, 122, 335, 216) < 15) color = [accentR, accentG, accentB, 255];
      if (distanceToSegment(x, y, 330, 216, 430, 96) < 12) color = [darkR, darkG, darkB, 255];
      if (Math.hypot(x - 430, y - 96) < 22) color = [255, 224, 113, 255];
      if (Math.abs(x - 430) + Math.abs(y - 96) < 36) color = mix(color, [255, 236, 138, 255], 0.75);
    } else if (asset.key === "card_art_lamplight_mark") {
      const glow = Math.hypot(x - 260, y - 164);
      if (glow < 130) color = mix(color, [255, 211, 104, 255], (130 - glow) / 185);
      if (insideRoundedRect(x, y, 224, 112, 72, 96, 12)) color = [darkR, darkG, darkB, 255];
      if (insideRoundedRect(x, y, 238, 128, 44, 58, 8)) color = [255, 231, 137, 255];
      if (distanceToSegment(x, y, 260, 80, 260, 112) < 5) color = [darkR, darkG, darkB, 255];
      if (distanceToSegment(x, y, 167, 267, 354, 267) < 5 || distanceToSegment(x, y, 260, 195, 260, 313) < 5) {
        color = [accentR, accentG, accentB, 255];
      }
      if (Math.hypot(x - 260, y - 267) < 43 && Math.hypot(x - 260, y - 267) > 34) {
        color = [accentR, accentG, accentB, 255];
      }
    }

    return color;
  };
}

function paintCardFrame(asset) {
  const palette = paletteFor(asset);
  const seed = hash(asset.key);
  return (x, y, width, height) => {
    const radius = 24;
    if (!insideRoundedRect(x, y, 0, 0, width, height, radius)) return [0, 0, 0, 0];

    const [paperR, paperG, paperB] = palette.base;
    const [accentR, accentG, accentB] = palette.accent;
    const [darkR, darkG, darkB] = palette.dark;
    const grain = ((x * 13 + y * 7 + seed) % 29) < 6 ? -8 : 0;
    let color = [paperR + grain, paperG + grain, paperB + grain, 255];

    if (!insideRoundedRect(x, y, 9, 9, width - 18, height - 18, 18)) {
      color = [darkR, darkG, darkB, 255];
    } else if (!insideRoundedRect(x, y, 18, 18, width - 36, height - 36, 14)) {
      color = mix([accentR, accentG, accentB, 255], [darkR, darkG, darkB, 255], 0.25);
    }

    const artPanel = insideRoundedRect(x, y, 34, 86, width - 68, 172, 12);
    const textPanel = insideRoundedRect(x, y, 34, 278, width - 68, 116, 10);
    const titlePanel = insideRoundedRect(x, y, 82, 28, width - 106, 38, 10);
    if (artPanel || textPanel || titlePanel) {
      color = mix(color, [255, 250, 230, 255], 0.6);
      if (nearPanelEdge(x, y, artPanel, 34, 86, width - 68, 172, 12)
        || nearPanelEdge(x, y, textPanel, 34, 278, width - 68, 116, 10)
        || nearPanelEdge(x, y, titlePanel, 82, 28, width - 106, 38, 10)) {
        color = [darkR, darkG, darkB, 255];
      }
    }

    const costDistance = Math.hypot(x - 48, y - 48);
    if (costDistance < 34) color = [darkR, darkG, darkB, 255];
    if (costDistance < 25) color = [247, 220, 124, 255];
    if (costDistance < 12) color = [255, 248, 199, 255];

    if (y > height - 56 && insideRoundedRect(x, y, 70, height - 62, width - 140, 34, 14)) {
      color = mix([accentR, accentG, accentB, 255], [255, 244, 214, 255], 0.18);
    }

    if ((x > 22 && x < 48 && y > height - 48 && y < height - 24)
      || (x > width - 48 && x < width - 22 && y > height - 48 && y < height - 24)) {
      color = [185, 139, 52, 255];
    }

    return color;
  };
}

function paintCardTypeIcon(asset) {
  const palette = paletteFor(asset);
  return (x, y, width, height) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.43;
    const distance = Math.hypot(x - centerX, y - centerY);
    if (distance > radius) return [0, 0, 0, 0];

    const [paperR, paperG, paperB] = palette.base;
    const [accentR, accentG, accentB] = palette.accent;
    const [darkR, darkG, darkB] = palette.dark;
    let color = distance > radius - 5
      ? [darkR, darkG, darkB, 255]
      : [paperR, paperG, paperB, 255];

    if (distance < radius - 12) color = mix(color, [accentR, accentG, accentB, 255], 0.2);

    if (asset.key.endsWith("_attack")) {
      const slashA = distanceToSegment(x, y, 29, 67, 67, 25) < 5;
      const slashB = distanceToSegment(x, y, 35, 72, 72, 35) < 3;
      if (slashA || slashB) color = [darkR, darkG, darkB, 255];
      if (Math.hypot(x - 68, y - 25) < 8) color = [207, 92, 82, 255];
    } else if (asset.key.endsWith("_defense")) {
      const shield = pointInPolygon(x, y, [[48, 22], [69, 33], [64, 65], [48, 78], [32, 65], [27, 33]]);
      const inner = pointInPolygon(x, y, [[48, 31], [59, 38], [56, 60], [48, 68], [40, 60], [37, 38]]);
      if (shield) color = [darkR, darkG, darkB, 255];
      if (inner) color = [92, 160, 177, 255];
    } else {
      const diamond = Math.abs(x - 48) + Math.abs(y - 48) < 22;
      const sparkleA = Math.abs(x - 67) + Math.abs(y - 28) < 9;
      const sparkleB = Math.abs(x - 28) + Math.abs(y - 66) < 7;
      if (diamond || sparkleA || sparkleB) color = [darkR, darkG, darkB, 255];
      if (Math.abs(x - 48) + Math.abs(y - 48) < 12) color = [244, 203, 96, 255];
    }

    return color;
  };
}

function mix(a, b, t) {
  return [
    Math.round(a[0] * (1 - t) + b[0] * t),
    Math.round(a[1] * (1 - t) + b[1] * t),
    Math.round(a[2] * (1 - t) + b[2] * t),
    Math.round(a[3] * (1 - t) + b[3] * t)
  ];
}

function insideRoundedRect(x, y, rectX, rectY, width, height, radius) {
  const cornerX = x < rectX + radius ? rectX + radius : x > rectX + width - radius ? rectX + width - radius : x;
  const cornerY = y < rectY + radius ? rectY + radius : y > rectY + height - radius ? rectY + height - radius : y;
  return x >= rectX && y >= rectY && x < rectX + width && y < rectY + height
    && Math.hypot(x - cornerX, y - cornerY) <= radius;
}

function nearPanelEdge(x, y, inside, rectX, rectY, width, height, radius) {
  if (!inside) return false;
  return !insideRoundedRect(x, y, rectX + 4, rectY + 4, width - 8, height - 8, Math.max(1, radius - 4));
}

function distanceToSegment(px, py, ax, ay, bx, by) {
  const dx = bx - ax;
  const dy = by - ay;
  const lengthSquared = dx * dx + dy * dy;
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lengthSquared));
  const x = ax + t * dx;
  const y = ay + t * dy;
  return Math.hypot(px - x, py - y);
}

function pointInPolygon(x, y, points) {
  let inside = false;
  for (let index = 0, previous = points.length - 1; index < points.length; previous = index, index += 1) {
    const xi = points[index][0];
    const yi = points[index][1];
    const xj = points[previous][0];
    const yj = points[previous][1];
    const intersects = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
}

let generated = 0;
for (const asset of manifest.assets) {
  const width = asset.nativeSize?.w;
  const height = asset.nativeSize?.h;
  if (!Number.isInteger(width) || !Number.isInteger(height)) {
    throw new Error(`${asset.key}: nativeSize is required for dev runtime asset generation`);
  }

  const outputPath = path.join(outputRoot, asset.path);
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, encodePng(width, height, paintFor(asset)));
  generated += 1;
}

console.log(`Generated dev runtime assets: ${generated} files under public/assets/runtime`);
