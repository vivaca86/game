import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const gems = JSON.parse(await readFile(path.join(rootDir, "src", "data", "ko", "gems.json"), "utf8"));

const curatedBatchIds = [
  "gem_morning_edge",
  "gem_cloud_edge",
  "gem_mint_edge",
  "gem_peach_edge",
  "gem_lavender_edge",
  "gem_morning_guard",
  "gem_cloud_guard",
  "gem_mint_guard",
  "gem_peach_guard",
  "gem_lavender_guard",
  "gem_morning_spark",
  "gem_cloud_spark",
  "gem_mint_spark",
  "gem_peach_spark",
  "gem_lavender_spark",
  "gem_morning_echo",
  "gem_cloud_echo",
  "gem_mint_echo",
  "gem_peach_echo",
  "gem_lavender_echo"
];

const supportedOps = new Set([
  "modify_damage_percent",
  "modify_shield_percent",
  "modify_cost",
  "heal_on_play",
  "apply_mark_on_play",
  "echo_basic_effect",
  "splash_damage",
  "preserve_chain",
  "bridge_next_color_bonus"
]);

const warnings = [];
const effectShapeCounts = countBy(gems, (gem) => effectShape(gem.effects));
const repeatedEffects = repeated(effectShapeCounts, 10);
const maxRepeatedEffectShape = Math.max(0, ...Object.values(effectShapeCounts));
const batchRows = curatedBatchIds.map((id) => gems.find((gem) => gem.id === id));
const missingBatchRows = curatedBatchIds.filter((id, index) => !batchRows[index]);
const shallowBatchRows = batchRows
  .filter(Boolean)
  .filter((gem) => !Array.isArray(gem.effects) || gem.effects.length < 2)
  .map((gem) => gem.id);
const batchShapes = new Set(batchRows.filter(Boolean).map((gem) => effectShape(gem.effects)));
const unsupportedOps = gems
  .flatMap((gem) => (gem.effects ?? []).map((effect) => ({ gemId: gem.id, op: effect.op })))
  .filter((effect) => !supportedOps.has(effect.op));

if (gems.length !== 58) warnings.push(`Expected 58 gems, got ${gems.length}`);
if (repeatedEffects.length > 0) {
  warnings.push(`Repeated gem effect structures remain: ${repeatedEffects.map(([shape, count]) => `${count}x ${shape}`).join(" | ")}`);
}
if (missingBatchRows.length > 0) warnings.push(`Missing curated batch gems: ${missingBatchRows.join(", ")}`);
if (shallowBatchRows.length > 0) warnings.push(`Curated gems still have only one effect: ${shallowBatchRows.join(", ")}`);
if (batchShapes.size !== curatedBatchIds.length) warnings.push(`Curated batch effect shapes are not all distinct: ${batchShapes.size}/${curatedBatchIds.length}`);
if (unsupportedOps.length > 0) {
  warnings.push(`Unsupported gem ops: ${unsupportedOps.map((effect) => `${effect.gemId}:${effect.op}`).join(", ")}`);
}

if (warnings.length > 0) {
  console.log("Gem release audit failed");
  warnings.forEach((warning) => console.log(`- ${warning}`));
  process.exit(1);
}

console.log("Gem release audit passed");
console.log(`gems=${gems.length}, curatedBatch=${curatedBatchIds.length}, maxRepeatedEffectShape=${maxRepeatedEffectShape}`);

function effectShape(effects = []) {
  if (!Array.isArray(effects) || effects.length === 0) return "no_effects";
  return effects.map((effect) => {
    const keys = Object.keys(effect)
      .filter((key) => key !== "op")
      .sort()
      .map((key) => `${key}:${valueShape(effect[key])}`)
      .join(",");
    return `${effect.op || "missing_op"}(${keys})`;
  }).join(" + ");
}

function valueShape(value) {
  if (Array.isArray(value)) return "array";
  if (value && typeof value === "object") return `object:${Object.keys(value).sort().join("+")}`;
  return typeof value;
}

function countBy(rows, keyFn) {
  return rows.reduce((counts, row) => {
    const key = keyFn(row);
    counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {});
}

function repeated(counts, minCount) {
  return Object.entries(counts)
    .filter(([, count]) => count >= minCount)
    .sort((left, right) => right[1] - left[1]);
}
