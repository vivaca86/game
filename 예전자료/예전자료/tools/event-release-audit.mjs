import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { eventAudit } from "../src/core/event-roles.js";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const events = JSON.parse(await readFile(path.join(rootDir, "src", "data", "ko", "events.json"), "utf8"));

const expectedEventIds = [
  "event_bubble_shop",
  "event_ribbon_fountain",
  "event_sleeping_gate",
  "event_gem_bench",
  "event_peach_mailbox",
  "event_cloud_picnic",
  "event_star_lottery",
  "event_prism_class",
  "event_plush_lost_child",
  "event_rainbow_gate"
];

const audit = eventAudit(events);
const warnings = [];
const choiceCounts = countBy(events, (event) => String(event.choices?.length ?? 0));
const repeatedChoiceShapes = repeated(countBy(events, eventChoiceShape), 2);
const repeatedLabels = repeated(countBy(events.flatMap((event) => event.choices ?? []), (choice) => choice.label), 3);
const totalChoices = events.reduce((sum, event) => sum + (event.choices?.length ?? 0), 0);
const choiceRoleCount = Object.keys(audit.choiceRoleCounts).length;
const riskCount = Object.keys(audit.riskCounts).length;
const missingEvents = expectedEventIds.filter((id) => !events.some((event) => event.id === id));

if (events.length !== 10) warnings.push(`Expected 10 events, got ${events.length}`);
if (missingEvents.length > 0) warnings.push(`Missing expected events: ${missingEvents.join(", ")}`);
if (audit.thinChoices.length > 0) warnings.push(`Events with fewer than three choices: ${audit.thinChoices.join(", ")}`);
if (Object.keys(choiceCounts).length < 2) warnings.push(`Event choice-count distribution is still one-note: ${formatCounts(choiceCounts)}`);
if (totalChoices < 34) warnings.push(`Total event choices too low for release batch variety: ${totalChoices}`);
if (repeatedChoiceShapes.length > 0) {
  warnings.push(`Repeated event choice shapes remain: ${repeatedChoiceShapes.map(([shape, count]) => `${count}x ${shape}`).join(" | ")}`);
}
if (repeatedLabels.length > 0) {
  warnings.push(`Generic event choice labels repeat too often: ${repeatedLabels.map(([label, count]) => `${count}x ${label}`).join(" | ")}`);
}
if (audit.missingRewards.length > 0) warnings.push(`Choices without rewards: ${audit.missingRewards.join(", ")}`);
if (audit.missingRoles.length > 0) warnings.push(`Events or choices without role spread: ${audit.missingRoles.join(", ")}`);
if (audit.missingNoUpfrontCost.length > 0) warnings.push(`Events without a no-upfront-cost choice: ${audit.missingNoUpfrontCost.join(", ")}`);
if (audit.missingRiskSpread.length > 0) warnings.push(`Events without risk spread: ${audit.missingRiskSpread.join(", ")}`);
if (choiceRoleCount < 7) warnings.push(`Choice role variety too low: ${choiceRoleCount}/7`);
if (riskCount < 4) warnings.push(`Risk variety too low: ${riskCount}/4`);

if (warnings.length > 0) {
  console.log("Event release audit failed");
  warnings.forEach((warning) => console.log(`- ${warning}`));
  process.exit(1);
}

console.log("Event release audit passed");
console.log(`events=${events.length}, totalChoices=${totalChoices}, choiceCounts=${formatCounts(choiceCounts)}, choiceRoles=${choiceRoleCount}, risks=${riskCount}`);

function eventChoiceShape(event = {}) {
  return (event.choices ?? []).map(choiceShape).join(" | ");
}

function choiceShape(choice = {}) {
  const costKeys = Object.keys(choice.cost || {}).sort().join("+") || "free";
  const rewardKeys = Object.keys(choice.reward || {}).sort().join("+") || "no_reward";
  const effectKeys = Object.keys(choice.effect || {}).sort().join("+") || "no_effect";
  return `cost:${costKeys};reward:${rewardKeys};effect:${effectKeys}`;
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
