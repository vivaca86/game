import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const stagePath = path.join(rootDir, "src", "data", "ko", "stages.json");

const roomPlans = {
  stage_sunny_gate: ["combat", "combat", "event", "elite", "reward", "rest", "boss"],
  stage_lavender_hall: ["combat", "event", "combat", "elite", "reward", "rest", "boss"],
  stage_mint_garden: ["combat", "combat", "rest", "elite", "event", "reward", "boss"],
  stage_peach_canal: ["combat", "event", "combat", "elite", "rest", "reward", "boss"],
  stage_cloud_rooftop: ["combat", "combat", "event", "reward", "elite", "rest", "boss"],
  stage_ribbon_station: ["combat", "event", "combat", "shop", "elite", "event", "reward", "rest", "boss"],
  stage_candy_cavern: ["combat", "shop", "combat", "event", "elite", "reward", "rest", "event", "boss"],
  stage_prism_school: ["combat", "event", "elite", "combat", "shop", "reward", "rest", "event", "boss"],
  stage_moon_attic: ["combat", "rest", "combat", "shop", "elite", "event", "reward", "rest", "boss"],
  stage_sprout_fort: ["combat", "event", "combat", "shop", "rest", "elite", "event", "reward", "rest", "boss"],
  stage_bubble_port: ["combat", "combat", "event", "shop", "rest", "elite", "reward", "event", "rest", "boss"],
  stage_plush_theater: ["combat", "event", "shop", "combat", "rest", "elite", "event", "reward", "rest", "boss"],
  stage_morning_observatory: ["combat", "rest", "event", "combat", "shop", "elite", "reward", "event", "rest", "boss"],
  stage_dream_arcade: ["combat", "event", "combat", "rest", "shop", "elite", "event", "reward", "rest", "boss"],
  stage_rainbow_keep: ["combat", "elite", "event", "combat", "shop", "rest", "elite", "reward", "event", "rest", "boss"]
};

const stages = JSON.parse(await readFile(stagePath, "utf8"));
const missing = Object.keys(roomPlans).filter((id) => !stages.some((stage) => stage.id === id));
if (missing.length > 0) {
  throw new Error(`Missing stage ids: ${missing.join(", ")}`);
}

const curated = stages.map((stage) => ({
  ...stage,
  rooms: roomPlans[stage.id] ?? stage.rooms
}));

await writeFile(stagePath, `${JSON.stringify(curated, null, 2)}\n`, "utf8");
console.log(`Curated release stage batch: ${Object.keys(roomPlans).length} stages`);
