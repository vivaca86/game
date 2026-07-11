import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(rootDir, "src", "data", "ko");
const readJson = async (fileName) => JSON.parse(await readFile(path.join(dataDir, fileName), "utf8"));

const [achievements, cards, gems, relics, arcanas] = await Promise.all([
  readJson("achievements.json"),
  readJson("cards.json"),
  readJson("gems.json"),
  readJson("relics.json"),
  readJson("arcanas.json")
]);

const expectedBatchIds = Array.from({ length: 31 }, (_, index) =>
  `ach_picnic_goal_${String(index + 1).padStart(3, "0")}`
);
const milestoneTriggers = new Set(["clear_rooms_in_stage", "defeat_enemy_count", "unlock_character", "clear_stage", "defeat_enemy"]);
const batch = achievements.filter((achievement) => expectedBatchIds.includes(achievement.id));
const triggerCounts = countBy(achievements, (achievement) => achievement.trigger?.op || "missing");
const batchTriggerCounts = countBy(batch, (achievement) => achievement.trigger?.op || "missing");
const rewardKindCounts = countBy(batch, (achievement) => rewardKind(achievement.reward || {}));
const milestoneTotal = achievements.filter((achievement) => milestoneTriggers.has(achievement.trigger?.op)).length;
const warnings = [];

const missingBatch = expectedBatchIds.filter((id) => !achievements.some((achievement) => achievement.id === id));
const genericBatch = batch.filter((achievement) => /소풍 목표\s*\d+/.test(achievement.name) || /방\s*\d+개/.test(achievement.description));
const roomClearBatch = batch.filter((achievement) => achievement.trigger?.op === "clear_rooms_in_stage");
const duplicateBatchTriggers = repeated(countBy(batch, triggerShape), 2);
const duplicateGlobalTriggers = repeated(countBy(achievements, triggerShape), 3);
const missingRewardKinds = ["gold", "unlockCardId", "unlockGemId", "unlockRelicId", "unlockArcanaId", "unlockCharacterId", "metaUpgradeId"]
  .filter((kind) => !rewardKindCounts[kind]);
const missingBatchOps = ["collect_cards", "collect_gems", "collect_relics", "collect_arcanas", "reach_chain"]
  .filter((op) => !batchTriggerCounts[op]);
const overCap = batch.filter((achievement) => isOverCollectionCap(achievement.trigger || {}));

if (achievements.length !== 161) warnings.push(`Expected 161 achievements, got ${achievements.length}`);
if (missingBatch.length > 0) warnings.push(`Missing curated achievement ids: ${missingBatch.join(", ")}`);
if (batch.length !== 31) warnings.push(`Expected 31 curated achievement rows, got ${batch.length}`);
if (milestoneTotal >= achievements.length * 0.6) warnings.push(`Milestone-like achievement triggers still dominate: ${milestoneTotal}/${achievements.length}`);
if ((triggerCounts.clear_rooms_in_stage || 0) > 0) warnings.push(`clear_rooms_in_stage filler triggers remain: ${triggerCounts.clear_rooms_in_stage}`);
if (genericBatch.length > 0) warnings.push(`Generic picnic achievement copy remains: ${genericBatch.map((achievement) => achievement.id).join(", ")}`);
if (roomClearBatch.length > 0) warnings.push(`Curated batch still uses room-count filler triggers: ${roomClearBatch.map((achievement) => achievement.id).join(", ")}`);
if (missingBatchOps.length > 0) warnings.push(`Curated batch missing trigger families: ${missingBatchOps.join(", ")}`);
if (Object.keys(batchTriggerCounts).length < 5) warnings.push(`Curated batch trigger variety too low: ${formatCounts(batchTriggerCounts)}`);
if (missingRewardKinds.length > 0) warnings.push(`Curated batch missing reward kinds: ${missingRewardKinds.join(", ")}`);
if (Object.keys(rewardKindCounts).length < 7) warnings.push(`Curated batch reward variety too low: ${formatCounts(rewardKindCounts)}`);
if (duplicateBatchTriggers.length > 0) {
  warnings.push(`Curated batch has duplicate exact trigger shapes: ${duplicateBatchTriggers.map(([shape, count]) => `${count}x ${shape}`).join(" | ")}`);
}
if (duplicateGlobalTriggers.length > 0) {
  warnings.push(`Global achievement trigger shapes repeat too much: ${duplicateGlobalTriggers.map(([shape, count]) => `${count}x ${shape}`).join(" | ")}`);
}
if (overCap.length > 0) warnings.push(`Collection thresholds exceed catalog caps: ${overCap.map((achievement) => achievement.id).join(", ")}`);

if (warnings.length > 0) {
  console.log("Achievement release audit failed");
  warnings.forEach((warning) => console.log(`- ${warning}`));
  process.exit(1);
}

console.log("Achievement release audit passed");
console.log(
  `achievements=${achievements.length}, curatedBatch=${batch.length}, milestoneLike=${milestoneTotal}, ` +
  `triggers=${formatCounts(triggerCounts)}, batchTriggers=${formatCounts(batchTriggerCounts)}, batchRewards=${formatCounts(rewardKindCounts)}`
);

function rewardKind(reward = {}) {
  if (reward.unlockCardId) return "unlockCardId";
  if (reward.unlockGemId) return "unlockGemId";
  if (reward.unlockRelicId) return "unlockRelicId";
  if (reward.unlockArcanaId) return "unlockArcanaId";
  if (reward.unlockCharacterId) return "unlockCharacterId";
  if (reward.metaUpgradeId) return "metaUpgradeId";
  if (reward.gold) return "gold";
  return "none";
}

function triggerShape(achievement = {}) {
  const trigger = achievement.trigger || {};
  return JSON.stringify(Object.fromEntries(Object.entries(trigger).sort(([left], [right]) => left.localeCompare(right))));
}

function isOverCollectionCap(trigger = {}) {
  if (trigger.op === "collect_cards") return trigger.amount > cards.length;
  if (trigger.op === "collect_gems") return trigger.amount > gems.length;
  if (trigger.op === "collect_relics") return trigger.amount > relics.length;
  if (trigger.op === "collect_arcanas") return trigger.amount > arcanas.length;
  return false;
}

function countBy(rows, keyFn) {
  return rows.reduce((counts, row) => {
    const key = keyFn(row) ?? "missing";
    counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {});
}

function repeated(counts, minCount) {
  return Object.entries(counts)
    .filter(([, count]) => count >= minCount)
    .sort((left, right) => right[1] - left[1]);
}

function formatCounts(counts) {
  return Object.entries(counts)
    .sort((left, right) => right[1] - left[1])
    .map(([key, count]) => `${key}:${count}`)
    .join(", ");
}
