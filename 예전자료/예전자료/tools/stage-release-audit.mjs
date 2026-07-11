import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const stages = JSON.parse(await readFile(path.join(rootDir, "src", "data", "ko", "stages.json"), "utf8"));

const allowedRooms = new Set(["combat", "event", "elite", "reward", "boss", "shop", "rest"]);
const expectedStageIds = [
  "stage_sunny_gate",
  "stage_lavender_hall",
  "stage_mint_garden",
  "stage_peach_canal",
  "stage_cloud_rooftop",
  "stage_ribbon_station",
  "stage_candy_cavern",
  "stage_prism_school",
  "stage_moon_attic",
  "stage_sprout_fort",
  "stage_bubble_port",
  "stage_plush_theater",
  "stage_morning_observatory",
  "stage_dream_arcade",
  "stage_rainbow_keep"
];

const warnings = [];
const roomPatternCounts = countBy(stages, (stage) => roomPattern(stage.rooms));
const repeatedRoomPatterns = repeated(roomPatternCounts, 3);
const maxRepeatedRoomPattern = Math.max(0, ...Object.values(roomPatternCounts));
const uniqueRoomPatterns = new Set(stages.map((stage) => roomPattern(stage.rooms))).size;
const missingStages = expectedStageIds.filter((id) => !stages.some((stage) => stage.id === id));
const invalidRooms = [];
const shallowStages = [];
const noEventStages = [];
const noEliteStages = [];
const badBossStages = [];

for (const stage of stages) {
  const rooms = stage.rooms ?? [];
  if (rooms.length < 7) shallowStages.push(stage.id);
  if (!rooms.includes("event")) noEventStages.push(stage.id);
  if (!rooms.includes("elite")) noEliteStages.push(stage.id);
  if (rooms.at(-1) !== "boss") badBossStages.push(stage.id);
  rooms.forEach((room, index) => {
    if (!allowedRooms.has(room)) invalidRooms.push(`${stage.id}[${index}]=${room}`);
  });
}

if (stages.length !== 15) warnings.push(`Expected 15 stages, got ${stages.length}`);
if (missingStages.length > 0) warnings.push(`Missing expected stages: ${missingStages.join(", ")}`);
if (repeatedRoomPatterns.length > 0) {
  warnings.push(`Repeated stage room patterns remain: ${repeatedRoomPatterns.map(([pattern, count]) => `${count}x ${pattern}`).join(" | ")}`);
}
if (uniqueRoomPatterns < 12) warnings.push(`Stage route variety too low: ${uniqueRoomPatterns}/15`);
if (shallowStages.length > 0) warnings.push(`Stage routes too short: ${shallowStages.join(", ")}`);
if (noEventStages.length > 0) warnings.push(`Stages without events: ${noEventStages.join(", ")}`);
if (noEliteStages.length > 0) warnings.push(`Stages without elite rooms: ${noEliteStages.join(", ")}`);
if (badBossStages.length > 0) warnings.push(`Stages whose final room is not boss: ${badBossStages.join(", ")}`);
if (invalidRooms.length > 0) warnings.push(`Invalid room types: ${invalidRooms.join(", ")}`);

if (warnings.length > 0) {
  console.log("Stage release audit failed");
  warnings.forEach((warning) => console.log(`- ${warning}`));
  process.exit(1);
}

console.log("Stage release audit passed");
console.log(`stages=${stages.length}, uniqueRoomPatterns=${uniqueRoomPatterns}, maxRepeatedRoomPattern=${maxRepeatedRoomPattern}`);

function roomPattern(rooms = []) {
  return Array.isArray(rooms) ? rooms.join(" > ") : "no_rooms";
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
