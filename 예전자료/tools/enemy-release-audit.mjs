import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { enemyReleaseQualityFindings, enemyReleaseSummary } from "./enemy-release-quality.mjs";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const enemies = JSON.parse(await readFile(path.join(rootDir, "src", "data", "ko", "enemies.json"), "utf8"));

const findings = enemyReleaseQualityFindings(enemies);

if (findings.length > 0) {
  console.log("Enemy release audit failed");
  findings.forEach((finding) => {
    console.log(`- [${finding.area}] ${finding.message}`);
    finding.evidence?.slice(0, 8).forEach((line) => console.log(`  - ${line}`));
  });
  process.exit(1);
}

const summary = enemyReleaseSummary(enemies);

console.log("Enemy release audit passed");
console.log(
  [
    `enemies=${summary.total}`,
    `curatedCoverage=${summary.releaseIdsPresent}/${summary.releaseIdsTotal}`,
    `uniqueIntentShapes=${summary.uniqueIntentShapes}`,
    `maxRepeatedIntentShape=${summary.maxRepeatedIntentShape}`,
    `specialEffects=${summary.specialEffects.size}`,
    `debuffStatuses=${summary.debuffStatuses.size}`,
    `bossPhaseCoverage=${summary.bossPhaseCoverage}/${summary.bossTotal}`
  ].join(", ")
);
