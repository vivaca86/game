import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildFitHints, buildItemAudit, buildItemRoleSummary } from "../src/core/build-roles.js";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(rootDir, "src", "data", "ko");
const relics = JSON.parse(await readFile(path.join(dataDir, "relics.json"), "utf8"));
const arcanas = JSON.parse(await readFile(path.join(dataDir, "arcanas.json"), "utf8"));

const audit = buildItemAudit(relics, arcanas);
const warnings = [];
const roleCount = Object.keys(audit.roleCounts).length;
const relicRoleCount = new Set(relics.map((relic) => buildItemRoleSummary(relic, "relic").key)).size;
const arcanaRoleCount = new Set(arcanas.map((arcana) => buildItemRoleSummary(arcana, "arcana").key)).size;

if (relics.length !== 16) warnings.push(`유물 수가 16종이 아님: ${relics.length}`);
if (arcanas.length !== 12) warnings.push(`기운 수가 12종이 아님: ${arcanas.length}`);
if (audit.missingRoles.length > 0) warnings.push(`역할 미분류 유물/기운: ${audit.missingRoles.join(", ")}`);
if (audit.missingEffects.length > 0) warnings.push(`효과 누락 유물/기운: ${audit.missingEffects.join(", ")}`);
if (audit.missingHints.length > 0) warnings.push(`추천 힌트 부족 유물/기운: ${audit.missingHints.join(", ")}`);
if (roleCount < 8) warnings.push(`유물/기운 역할 종류 부족: ${roleCount}`);
if (relicRoleCount < 7) warnings.push(`유물 역할 폭 부족: ${relicRoleCount}`);
if (arcanaRoleCount < 6) warnings.push(`기운 역할 폭 부족: ${arcanaRoleCount}`);

const thinHints = [
  ...relics.filter((relic) => buildFitHints(relic, "relic").length < 3).map((relic) => relic.id),
  ...arcanas.filter((arcana) => buildFitHints(arcana, "arcana").length < 3).map((arcana) => arcana.id)
];
if (thinHints.length > 0) warnings.push(`역할 추천 힌트 3개 미만: ${thinHints.join(", ")}`);

if (warnings.length > 0) {
  console.log("유물/기운 감사 실패");
  warnings.forEach((warning) => console.log(`- ${warning}`));
  process.exit(1);
}

console.log("유물/기운 감사 통과");
console.log(`relics=${relics.length}, arcanas=${arcanas.length}, roles=${roleCount}`);
console.log(Object.entries(audit.roleCounts).map(([role, count]) => `${role}:${count}`).join(", "));
