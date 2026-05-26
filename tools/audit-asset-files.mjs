import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const docsManifestPath = path.join(rootDir, "docs", "asset-manifest.slice.v1.json");
const runtimeManifestPath = path.join(rootDir, "src", "data", "assetManifest.slice.v1.json");
const runtimeAssetRoot = path.join(rootDir, "assets", "runtime");
const requireFiles = process.argv.includes("--require-files") || process.env.ASSET_AUDIT_REQUIRE_FILES === "1";

const errors = [];
const warnings = [];
const idPattern = /^[a-z][a-z0-9_]*$/;
const allowedStatuses = new Set(["planned_manifest", "generated_manifest", "approved_manifest"]);
const allowedTypes = new Set(["image", "spritesheet"]);

function fail(message) {
  errors.push(message);
}

function warn(message) {
  warnings.push(message);
}

async function readJson(filePath) {
  try {
    return JSON.parse(await readFile(filePath, "utf8"));
  } catch (error) {
    fail(`${path.relative(rootDir, filePath)}: JSON read/parse failed: ${error.message}`);
    return null;
  }
}

function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function rel(filePath) {
  return path.relative(rootDir, filePath).replaceAll("\\", "/");
}

function checkSize(size, label) {
  if (!size || !Number.isInteger(size.w) || !Number.isInteger(size.h) || size.w <= 0 || size.h <= 0) {
    fail(`${label}: expected positive integer w/h`);
  }
}

function manifestMap(manifest, label) {
  const rows = Array.isArray(manifest?.assets) ? manifest.assets : [];
  if (!Array.isArray(manifest?.assets)) fail(`${label}: assets must be an array`);

  const byKey = new Map();
  const paths = new Set();

  rows.forEach((asset, index) => {
    const rowLabel = asset?.key ? `${label}/${asset.key}` : `${label}.assets[${index}]`;
    if (!asset?.key) {
      fail(`${rowLabel}: missing key`);
      return;
    }
    if (!idPattern.test(asset.key)) fail(`${rowLabel}: key must be lower snake_case`);
    if (byKey.has(asset.key)) fail(`${label}: duplicate asset key ${asset.key}`);
    byKey.set(asset.key, asset);

    if (!allowedTypes.has(asset.type)) fail(`${rowLabel}: unsupported type ${asset.type}`);
    if (!asset.path || typeof asset.path !== "string") {
      fail(`${rowLabel}: missing path`);
    } else {
      if (asset.path.includes("\\") || asset.path.includes("..")) {
        fail(`${rowLabel}: path must use forward-slash relative paths without parent traversal`);
      }
      if (!asset.path.startsWith("assets/runtime/")) fail(`${rowLabel}: path must stay under assets/runtime/`);
      if (!asset.path.endsWith(".png")) fail(`${rowLabel}: path must be a png runtime asset`);
      if (paths.has(asset.path)) fail(`${label}: duplicate asset path ${asset.path}`);
      paths.add(asset.path);
    }

    if (asset.styleKey !== "premium_popup_book") fail(`${rowLabel}: styleKey must be premium_popup_book`);
    checkSize(asset.nativeSize, `${rowLabel}.nativeSize`);
    if (asset.type === "spritesheet") checkSize(asset.frameSize, `${rowLabel}.frameSize`);
  });

  return byKey;
}

function compareManifests(docsManifest, runtimeManifest) {
  if (stableStringify(docsManifest?.metadata) !== stableStringify(runtimeManifest?.metadata)) {
    fail("docs and runtime asset manifest metadata differ");
  }

  const docsByKey = manifestMap(docsManifest, "docs manifest");
  const runtimeByKey = manifestMap(runtimeManifest, "runtime manifest");

  for (const key of docsByKey.keys()) {
    if (!runtimeByKey.has(key)) {
      fail(`runtime manifest missing key from docs manifest: ${key}`);
      continue;
    }
    if (stableStringify(docsByKey.get(key)) !== stableStringify(runtimeByKey.get(key))) {
      fail(`runtime manifest entry differs from docs manifest: ${key}`);
    }
  }

  for (const key of runtimeByKey.keys()) {
    if (!docsByKey.has(key)) fail(`runtime manifest has key not present in docs manifest: ${key}`);
  }

  return docsByKey;
}

async function fileExists(filePath) {
  try {
    const info = await stat(filePath);
    return info.isFile();
  } catch {
    return false;
  }
}

async function listRuntimeAssetFiles(dirPath) {
  try {
    const rows = await readdir(dirPath, { withFileTypes: true });
    const nested = await Promise.all(rows.map(async (entry) => {
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) return listRuntimeAssetFiles(fullPath);
      if (entry.isFile() && /\.(png|jpe?g|webp|gif|avif)$/i.test(entry.name)) return [fullPath];
      return [];
    }));
    return nested.flat();
  } catch {
    return [];
  }
}

async function readPngSize(filePath) {
  const buffer = await readFile(filePath);
  const pngSignature = "89504e470d0a1a0a";
  if (buffer.length < 24 || buffer.subarray(0, 8).toString("hex") !== pngSignature) {
    throw new Error("not a png file");
  }
  return {
    w: buffer.readUInt32BE(16),
    h: buffer.readUInt32BE(20)
  };
}

async function auditFiles(assetsByKey, manifestStatus) {
  const shouldRequireFiles = requireFiles || manifestStatus !== "planned_manifest";
  const missing = [];
  let existing = 0;

  for (const asset of assetsByKey.values()) {
    const filePath = path.join(rootDir, asset.path);
    const exists = await fileExists(filePath);
    if (!exists) {
      missing.push(asset.path);
      continue;
    }

    existing += 1;
    try {
      const size = await readPngSize(filePath);
      if (size.w !== asset.nativeSize.w || size.h !== asset.nativeSize.h) {
        fail(`${asset.key}: png size ${size.w}x${size.h} does not match nativeSize ${asset.nativeSize.w}x${asset.nativeSize.h}`);
      }
      if (asset.type === "spritesheet") {
        if (asset.nativeSize.w % asset.frameSize.w !== 0 || asset.nativeSize.h % asset.frameSize.h !== 0) {
          fail(`${asset.key}: nativeSize must divide evenly by frameSize`);
        }
      }
    } catch (error) {
      fail(`${asset.key}: png read failed for ${asset.path}: ${error.message}`);
    }
  }

  if (missing.length > 0) {
    const sample = missing.slice(0, 5).join(", ");
    const message = `missing runtime files: ${missing.length}/${assetsByKey.size}${sample ? ` (${sample}${missing.length > 5 ? ", ..." : ""})` : ""}`;
    if (shouldRequireFiles) fail(message);
    else warn(`${message}; allowed because manifest is still planned_manifest`);
  }

  const knownPaths = new Set([...assetsByKey.values()].map((asset) => asset.path));
  const actualFiles = await listRuntimeAssetFiles(runtimeAssetRoot);
  const orphanFiles = actualFiles.map(rel).filter((filePath) => !knownPaths.has(filePath));
  if (orphanFiles.length > 0) {
    const sample = orphanFiles.slice(0, 5).join(", ");
    const message = `runtime asset files not listed in manifest: ${orphanFiles.length}${sample ? ` (${sample}${orphanFiles.length > 5 ? ", ..." : ""})` : ""}`;
    if (shouldRequireFiles) fail(message);
    else warn(message);
  }

  return {
    existing,
    missing: missing.length,
    orphan: orphanFiles.length,
    strict: shouldRequireFiles
  };
}

const docsManifest = await readJson(docsManifestPath);
const runtimeManifest = await readJson(runtimeManifestPath);

let fileSummary = { existing: 0, missing: 0, orphan: 0, strict: requireFiles };
let assetCount = 0;

if (docsManifest && runtimeManifest) {
  const status = docsManifest.metadata?.status;
  if (!allowedStatuses.has(status)) fail(`docs manifest metadata.status is unsupported: ${status}`);
  if (runtimeManifest.metadata?.status !== status) fail("runtime manifest status differs from docs manifest status");

  const assetsByKey = compareManifests(docsManifest, runtimeManifest);
  assetCount = assetsByKey.size;
  fileSummary = await auditFiles(assetsByKey, status);
}

warnings.forEach((message) => console.log(`Warning: ${message}`));

if (errors.length > 0) {
  errors.forEach((message) => console.error(`Error: ${message}`));
  process.exit(1);
}

console.log(
  `Asset file audit OK: manifestAssets=${assetCount}, existingFiles=${fileSummary.existing}, missingFiles=${fileSummary.missing}, orphanFiles=${fileSummary.orphan}, strict=${fileSummary.strict}`
);
