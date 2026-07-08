import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { enemyReleaseQualityFindings } from "./enemy-release-quality.mjs";
import { visualProductionFindings } from "./visual-production-quality.mjs";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(rootDir, "src", "data", "ko");
const reportOnly = process.argv.includes("--report-only");

const dataFiles = {
  cards: "cards.json",
  gems: "gems.json",
  enemies: "enemies.json",
  stages: "stages.json",
  events: "events.json",
  achievements: "achievements.json"
};

const [cards, gems, enemies, stages, events, achievements] = await Promise.all([
  readJson(dataFiles.cards),
  readJson(dataFiles.gems),
  readJson(dataFiles.enemies),
  readJson(dataFiles.stages),
  readJson(dataFiles.events),
  readJson(dataFiles.achievements)
]);

const assetFiles = await listFiles(rootDir, /\.(png|jpg|jpeg|webp|gif|avif)$/i);
const visualFindings = await visualProductionFindings(rootDir);

const findings = [
  visualFindings,
  auditCards(cards),
  auditGems(gems),
  auditEnemies(enemies),
  auditStages(stages),
  auditEvents(events),
  auditAchievements(achievements)
].flat();

console.log("Content quality audit");
console.log("=====================");
console.log(`cards=${cards.length}, gems=${gems.length}, enemies=${enemies.length}, stages=${stages.length}, events=${events.length}, achievements=${achievements.length}`);
console.log(`bitmap_assets=${assetFiles.length}`);
console.log("");

if (findings.length === 0) {
  console.log("No quality blockers detected.");
} else {
  console.log("Quality blockers:");
  findings.forEach((finding, index) => {
    console.log(`${index + 1}. [${finding.area}] ${finding.message}`);
    if (finding.evidence?.length) {
      finding.evidence.slice(0, 5).forEach((line) => console.log(`   - ${line}`));
    }
  });
}

if (findings.length > 0 && !reportOnly) {
  console.log("");
  console.log("Result: BLOCKED. Treat current data/art as draft scaffolding, not final content.");
  process.exit(1);
}

console.log("");
console.log(reportOnly ? "Result: report-only mode." : "Result: PASS.");

async function readJson(fileName) {
  return JSON.parse(await readFile(path.join(dataDir, fileName), "utf8"));
}

function auditCards(rows) {
  const visibleRows = rows.filter((card) => !["curse", "temp"].includes(card.type));
  const repeatedEffects = repeated(countBy(visibleRows, (card) => effectShape(card.effects)), 10);
  const repeatedIdSuffixes = repeated(countBy(visibleRows, (card) => lastIdSegment(card.id)), 10);
  const findings = [];

  if (repeatedEffects.length > 0) {
    findings.push({
      area: "cards",
      message: "Many cards share the same effect structures; this indicates template mass generation.",
      evidence: repeatedEffects.map(([shape, count]) => `${count}x ${shape}`)
    });
  }

  if (repeatedIdSuffixes.length > 0) {
    findings.push({
      area: "cards",
      message: "Card ID suffixes repeat at scale; this points to family x template generation.",
      evidence: repeatedIdSuffixes.map(([suffix, count]) => `${count}x *_${suffix}`)
    });
  }

  return findings;
}

function auditGems(rows) {
  const repeatedEffects = repeated(countBy(rows, (gem) => effectShape(gem.effects)), 10);
  if (repeatedEffects.length === 0) return [];

  return [{
    area: "gems",
    message: "Many gems share the same effect structures; they are not yet individually designed.",
    evidence: repeatedEffects.map(([shape, count]) => `${count}x ${shape}`)
  }];
}

function auditEnemies(rows) {
  return enemyReleaseQualityFindings(rows);
}

function auditStages(rows) {
  const repeatedRoomPatterns = repeated(countBy(rows, (stage) => (stage.rooms || []).join(" > ")), 3);
  if (repeatedRoomPatterns.length === 0) return [];

  return [{
    area: "stages",
    message: "Stage room patterns repeat; stage-specific pacing and gimmicks are not proven.",
    evidence: repeatedRoomPatterns.map(([pattern, count]) => `${count}x ${pattern}`)
  }];
}

function auditEvents(rows) {
  const choiceCounts = countBy(rows, (event) => String((event.choices || []).length));
  const repeatedChoiceShapes = repeated(countBy(rows, (event) => (event.choices || []).map(choiceShape).join(" | ")), 2);
  const findings = [];

  if (Object.keys(choiceCounts).length === 1 && choiceCounts["3"] === rows.length) {
    findings.push({
      area: "events",
      message: "Every event has exactly three choices; that is acceptable structurally but still skeletal.",
      evidence: [`choice count distribution: ${formatCounts(choiceCounts)}`]
    });
  }

  if (repeatedChoiceShapes.length > 0) {
    findings.push({
      area: "events",
      message: "Event choice reward/cost shapes repeat; narrative and mechanical uniqueness needs review.",
      evidence: repeatedChoiceShapes.map(([shape, count]) => `${count}x ${shape}`)
    });
  }

  return findings;
}

function auditAchievements(rows) {
  const triggerCounts = countBy(rows, (achievement) => achievement.trigger?.op || "missing");
  const milestoneTriggers = ["clear_rooms_in_stage", "defeat_enemy_count", "unlock_character", "clear_stage", "defeat_enemy"];
  const milestoneTotal = milestoneTriggers.reduce((sum, op) => sum + (triggerCounts[op] || 0), 0);

  if (milestoneTotal < rows.length * 0.6) return [];

  return [{
    area: "achievements",
    message: "Achievements are dominated by milestone/bulk triggers; they are not yet a curated achievement set.",
    evidence: [
      `milestone-like triggers: ${milestoneTotal}/${rows.length}`,
      `trigger counts: ${formatCounts(triggerCounts)}`
    ]
  }];
}

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

function intentShape(intents = []) {
  if (!Array.isArray(intents) || intents.length === 0) return "no_intents";
  return intents.map((intent) => {
    const keys = Object.keys(intent)
      .filter((key) => !["label", "amount"].includes(key))
      .sort()
      .map((key) => `${key}:${valueShape(intent[key])}`)
      .join(",");
    return `${intent.type || "missing_type"}(${keys})`;
  }).join(" + ");
}

function choiceShape(choice = {}) {
  const costKeys = Object.keys(choice.cost || {}).sort().join("+") || "free";
  const rewardKeys = Object.keys(choice.reward || {}).sort().join("+") || "no_reward";
  const effectKeys = Object.keys(choice.effect || {}).sort().join("+") || "no_effect";
  return `cost:${costKeys};reward:${rewardKeys};effect:${effectKeys}`;
}

function valueShape(value) {
  if (Array.isArray(value)) return "array";
  if (value && typeof value === "object") return "object";
  if (typeof value === "number") return "#";
  if (typeof value === "string") return value.includes("_") ? "id/text" : "text";
  return String(value);
}

function countBy(rows, picker) {
  return rows.reduce((acc, row) => {
    const key = picker(row);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

function repeated(counts, minCount) {
  return Object.entries(counts)
    .filter(([, count]) => count >= minCount)
    .sort((a, b) => b[1] - a[1]);
}

function formatCounts(counts) {
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([key, count]) => `${key}:${count}`)
    .join(", ");
}

function lastIdSegment(id = "") {
  return id.split("_").at(-1) || id;
}

async function listFiles(startDir, pattern) {
  const results = [];
  await walk(startDir);
  return results;

  async function walk(dir) {
    const entries = await readdir(dir, { withFileTypes: true });
    await Promise.all(entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if ([".git", "node_modules", "tmp", "dist"].includes(entry.name)) return;
      if (entry.isDirectory()) {
        await walk(fullPath);
        return;
      }
      if (!entry.isFile()) return;
      if (/proof-(desktop|mobile)\.png$/i.test(entry.name)) return;
      const info = await stat(fullPath);
      if (info.size > 0 && pattern.test(fullPath)) results.push(fullPath);
    }));
  }
}
