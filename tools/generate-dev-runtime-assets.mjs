import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { deflateSync } from "node:zlib";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = path.join(rootDir, "src", "data", "assetManifest.slice.v1.json");
const outputRoot = path.join(rootDir, "public");

const manifest = JSON.parse(await readFile(manifestPath, "utf8"));

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
  if (asset.path.includes("/backgrounds/")) return { base: [240, 222, 178], accent, dark: [112, 92, 72] };
  if (asset.path.includes("/cards/")) return { base: [250, 238, 206], accent, dark: [98, 72, 54] };
  if (asset.path.includes("/icons/")) return { base: [246, 231, 192], accent, dark: [76, 82, 96] };
  if (asset.path.includes("/monsters/") || asset.path.includes("/bosses/")) return { base: [230, 216, 198], accent, dark: [83, 63, 88] };
  if (asset.path.includes("/effects/")) return { base: [248, 242, 218], accent, dark: [110, 80, 46] };
  return { base: [244, 230, 198], accent, dark: [84, 74, 68] };
}

function paintFor(asset) {
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
