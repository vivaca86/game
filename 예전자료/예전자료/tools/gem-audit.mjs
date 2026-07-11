import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { gemAudit, gemFitHints } from "../src/core/gem-roles.js";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(rootDir, "src", "data", "ko");
const gems = JSON.parse(await readFile(path.join(dataDir, "gems.json"), "utf8"));

const audit = gemAudit(gems);
const warnings = [];
const roleCount = Object.keys(audit.roleCounts).length;
const socketTypeCount = new Set(gems.flatMap((gem) => gem.socketTypes || [])).size;

if (gems.length !== 58) warnings.push(`보석 수가 58종이 아님: ${gems.length}`);
if (audit.missingRoles.length > 0) warnings.push(`역할 미분류 보석: ${audit.missingRoles.join(", ")}`);
if (audit.missingSocketTypes.length > 0) warnings.push(`소켓 타입 누락 보석: ${audit.missingSocketTypes.join(", ")}`);
if (audit.missingEffects.length > 0) warnings.push(`효과 누락 보석: ${audit.missingEffects.join(", ")}`);
if (roleCount < 8) warnings.push(`보석 역할 종류 부족: ${roleCount}`);
if (socketTypeCount < 3) warnings.push(`보석 소켓 타입 폭 부족: ${socketTypeCount}`);

const hintless = gems.filter((gem) => gemFitHints(gem).length < 2).map((gem) => gem.id);
if (hintless.length > 0) warnings.push(`추천 장착 힌트 부족: ${hintless.join(", ")}`);

const nonPositivePercent = gems
  .filter((gem) => {
    const effect = gem.effects?.[0];
    return ["modify_damage_percent", "modify_shield_percent"].includes(effect?.op) && effect.amount <= 0;
  })
  .map((gem) => gem.id);
if (nonPositivePercent.length > 0) warnings.push(`증폭 수치 비정상: ${nonPositivePercent.join(", ")}`);

if (warnings.length > 0) {
  console.log("보석 감사 실패");
  warnings.forEach((warning) => console.log(`- ${warning}`));
  process.exit(1);
}

console.log("보석 감사 통과");
console.log(`gems=${gems.length}, roles=${roleCount}, socketTypes=${socketTypeCount}`);
console.log(Object.entries(audit.roleCounts).map(([role, count]) => `${role}:${count}`).join(", "));
