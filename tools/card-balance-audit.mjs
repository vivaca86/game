import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { cardRoleAudit, cardRoleSummary } from "../src/core/card-roles.js";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(rootDir, "src", "data", "ko");
const cards = JSON.parse(await readFile(path.join(dataDir, "cards.json"), "utf8"));

const audit = cardRoleAudit(cards);
const visibleCards = cards.filter((card) => !["curse", "temp"].includes(card.type));
const uniqueRoles = Object.keys(audit.roleCounts).length;
const warnings = [];

if (cards.length !== 113) warnings.push(`카드 수가 113장이 아님: ${cards.length}`);
if (audit.missingRoles.length > 0) warnings.push(`역할 미분류 카드: ${audit.missingRoles.join(", ")}`);
if (audit.missingTags.length > 0) warnings.push(`태그 누락 카드: ${audit.missingTags.join(", ")}`);
if (uniqueRoles < 10) warnings.push(`카드 역할 종류 부족: ${uniqueRoles}`);

const typeCounts = countBy(visibleCards, (card) => card.type);
if ((typeCounts.attack || 0) < 30) warnings.push("공격 카드 풀이 부족함");
if ((typeCounts.guard || 0) < 12) warnings.push("방어 카드 풀이 부족함");
if ((typeCounts.skill || 0) < 30) warnings.push("기술 카드 풀이 부족함");
if ((typeCounts.power || 0) < 10) warnings.push("지속 카드 풀이 부족함");

const highCostWeakCards = visibleCards.filter((card) => card.cost >= 3 && roughCardImpact(card) < 10).map((card) => card.id);
if (highCostWeakCards.length > 0) warnings.push(`고비용 저효율 의심 카드: ${highCostWeakCards.join(", ")}`);

const zeroCostDamageCards = visibleCards.filter((card) => card.cost === 0 && (card.effects || []).some((effect) => effect.op?.startsWith("damage"))).map((card) => card.id);
if (zeroCostDamageCards.length > 0) warnings.push(`0비용 직접 피해 카드: ${zeroCostDamageCards.join(", ")}`);

if (warnings.length > 0) {
  console.log("카드 밸런스 감사 실패");
  warnings.forEach((warning) => console.log(`- ${warning}`));
  process.exit(1);
}

console.log("카드 밸런스 감사 통과");
console.log(`cards=${cards.length}, roles=${uniqueRoles}`);
console.log(Object.entries(audit.roleCounts).map(([role, count]) => `${role}:${count}`).join(", "));

function countBy(rows, picker) {
  return rows.reduce((acc, row) => {
    const key = picker(row);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

function roughCardImpact(card) {
  const role = cardRoleSummary(card);
  let score = role.key === "engine" ? 9 : role.key === "growth" ? 7 : 0;
  for (const effect of card.effects || []) {
    if (effect.op === "damage_front") score += effect.amount || 0;
    if (effect.op === "damage_all") score += (effect.amount || 0) * 1.8;
    if (effect.op === "damage_random") score += (effect.amount || 0) * (effect.hits || 1);
    if (effect.op === "gain_shield") score += (effect.amount || 0) * 0.9;
    if (effect.op === "draw") score += (effect.amount || 0) * 4;
    if (effect.op === "gain_energy") score += (effect.amount || 0) * 5;
    if (effect.op === "apply_mark") score += (effect.amount || 0) * 4;
    if (effect.op === "repeat_previous_basic_effect") score += 12;
    if (effect.op === "repeat_previous_basic_effect_if_cost_at_most") score += 9;
    if (effect.op === "add_battle_rule") score += 10;
    if (effect.op === "prepare_socket_bonus") score += 5;
    if (effect.op === "increase_next_card_reward_options") score += 5;
    if (effect.op === "exhaust_self") score -= 1;
  }
  return score;
}
