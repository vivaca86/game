import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { eventAudit } from "../src/core/event-roles.js";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const events = JSON.parse(await readFile(path.join(rootDir, "src", "data", "ko", "events.json"), "utf8"));

const audit = eventAudit(events);
const warnings = [];
const eventRoleCount = Object.keys(audit.roleCounts).length;
const choiceRoleCount = Object.keys(audit.choiceRoleCounts).length;
const riskCount = Object.keys(audit.riskCounts).length;

if (events.length !== 10) warnings.push(`이벤트 수가 10종이 아님: ${events.length}`);
if (audit.thinChoices.length > 0) warnings.push(`선택지 3개 미만 이벤트: ${audit.thinChoices.join(", ")}`);
if (audit.missingRewards.length > 0) warnings.push(`보상 없는 선택지: ${audit.missingRewards.join(", ")}`);
if (audit.missingRoles.length > 0) warnings.push(`역할 미분류 이벤트/선택지: ${audit.missingRoles.join(", ")}`);
if (audit.missingNoUpfrontCost.length > 0) warnings.push(`즉시 비용 없는 선택지 누락 이벤트: ${audit.missingNoUpfrontCost.join(", ")}`);
if (audit.missingRiskSpread.length > 0) warnings.push(`위험도 단계 부족 이벤트: ${audit.missingRiskSpread.join(", ")}`);
if (eventRoleCount < 4) warnings.push(`이벤트 역할 종류 부족: ${eventRoleCount}`);
if (choiceRoleCount < 6) warnings.push(`선택지 역할 종류 부족: ${choiceRoleCount}`);
if (riskCount < 3) warnings.push(`위험도 종류 부족: ${riskCount}`);

if (warnings.length > 0) {
  console.log("이벤트 감사 실패");
  warnings.forEach((warning) => console.log(`- ${warning}`));
  process.exit(1);
}

console.log("이벤트 감사 통과");
console.log(`events=${events.length}, eventRoles=${eventRoleCount}, choiceRoles=${choiceRoleCount}, risks=${riskCount}`);
console.log(Object.entries(audit.choiceRoleCounts).map(([role, count]) => `${role}:${count}`).join(", "));
