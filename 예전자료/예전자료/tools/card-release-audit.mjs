import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cards = JSON.parse(await readFile(path.join(rootDir, "src", "data", "ko", "cards.json"), "utf8"));

const visibleCards = cards.filter((card) => !["curse", "temp"].includes(card.type));
const errors = [];
const releaseHandledOps = new Set([
  "add_battle_rule",
  "apply_mark",
  "damage_all",
  "damage_bonus_if_cards_played_at_least",
  "damage_bonus_if_chain_at_least",
  "damage_bonus_if_hand_at_most",
  "damage_bonus_vs_marked",
  "damage_front",
  "damage_random",
  "discount_next_card",
  "draw",
  "draw_if_kill",
  "enable_reflect_damage",
  "exhaust_self",
  "gain_energy",
  "gain_shield",
  "heal_if_hp_ratio_below",
  "increase_next_card_cost",
  "increase_next_card_reward_options",
  "lose_energy",
  "prepare_socket_bonus",
  "reduce_next_attack",
  "repeat_previous_basic_effect",
  "repeat_previous_basic_effect_if_cost_at_most",
  "reset_chain",
  "retain_shield_next_turn"
]);

const curatedBatchIds = new Set([
  "card_morning_sunhook",
  "card_morning_daybreak",
  "card_morning_windowshade",
  "card_morning_bellnote",
  "card_morning_breakfast",
  "card_morning_goldenrule",
  "card_morning_sunshower",
  "card_morning_parcel",
  "card_cloud_pillowtap",
  "card_cloud_mistspill",
  "card_cloud_blanketbank",
  "card_cloud_doodles",
  "card_cloud_breeze",
  "card_cloud_rainrule",
  "card_cloud_hailpop",
  "card_cloud_floatbox",
  "card_mint_leafjab",
  "card_mint_gardensweep",
  "card_mint_vinescreen",
  "card_mint_notedrop",
  "card_mint_freshbreath",
  "card_mint_gardenrule",
  "card_mint_needlerain",
  "card_mint_workshop",
  "card_peach_blushdash",
  "card_peach_jamwave",
  "card_peach_softguard",
  "card_peach_sticker",
  "card_peach_picnic",
  "card_peach_warmrule",
  "card_peach_pitscatter",
  "card_peach_lunchbox"
]);
const retiredTemplateIds = new Set([
  "card_morning_tap",
  "card_morning_wave",
  "card_morning_pad",
  "card_morning_sparkle",
  "card_morning_snack",
  "card_morning_promise",
  "card_morning_shower",
  "card_morning_gift",
  "card_cloud_tap",
  "card_cloud_wave",
  "card_cloud_pad",
  "card_cloud_sparkle",
  "card_cloud_snack",
  "card_cloud_promise",
  "card_cloud_shower",
  "card_cloud_gift",
  "card_mint_tap",
  "card_mint_wave",
  "card_mint_pad",
  "card_mint_sparkle",
  "card_mint_snack",
  "card_mint_promise",
  "card_mint_shower",
  "card_mint_gift",
  "card_peach_tap",
  "card_peach_wave",
  "card_peach_pad",
  "card_peach_sparkle",
  "card_peach_snack",
  "card_peach_promise",
  "card_peach_shower",
  "card_peach_gift"
]);

if (cards.length !== 113) {
  errors.push(`Expected 113 cards, got ${cards.length}`);
}

const repeatedEffects = repeated(countBy(visibleCards, (card) => effectShape(card.effects)), 10);
if (repeatedEffects.length > 0) {
  errors.push(`Repeated release card effect structures remain at 10+: ${repeatedEffects.map(([shape, count]) => `${count}x ${shape}`).join(" | ")}`);
}

const repeatedSuffixes = repeated(countBy(visibleCards, (card) => lastIdSegment(card.id)), 10);
if (repeatedSuffixes.length > 0) {
  errors.push(`Repeated release card id suffixes remain at 10+: ${repeatedSuffixes.map(([suffix, count]) => `${count}x *_${suffix}`).join(" | ")}`);
}

const rawOps = new Set(cards.flatMap((card) => [...(card.effects ?? []), ...(card.upgrade?.effects ?? [])].map((effect) => effect.op)));
const unsupportedOps = [...rawOps].filter((op) => !releaseHandledOps.has(op)).sort();
if (unsupportedOps.length > 0) {
  errors.push(`Card ops are not in the release runtime handling list: ${unsupportedOps.join(", ")}`);
}

const retiredStillPresent = cards.filter((card) => retiredTemplateIds.has(card.id)).map((card) => card.id);
if (retiredStillPresent.length > 0) {
  errors.push(`Retired first-batch template ids still exist: ${retiredStillPresent.join(", ")}`);
}

const curatedBatchCount = visibleCards.filter((card) => curatedBatchIds.has(card.id)).length;
if (curatedBatchCount !== 32) {
  errors.push(`Expected 32 curated first-batch visible cards, got ${curatedBatchCount}`);
}

if (errors.length > 0) {
  console.error("Card release audit failed");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("Card release audit OK");
console.log(`cards=${cards.length}, visible=${visibleCards.length}, uniqueEffectShapes=${Object.keys(countBy(visibleCards, (card) => effectShape(card.effects))).length}, maxRepeatedEffectShape=${maxCount(countBy(visibleCards, (card) => effectShape(card.effects)))}, maxRepeatedSuffix=${maxCount(countBy(visibleCards, (card) => lastIdSegment(card.id)))}`);
console.log(`ops=${[...rawOps].sort().join(",")}`);

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

function maxCount(counts) {
  return Math.max(...Object.values(counts));
}

function lastIdSegment(id = "") {
  return id.split("_").at(-1) || id;
}
