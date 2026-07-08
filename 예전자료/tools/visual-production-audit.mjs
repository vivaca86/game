import { visualProductionSummary } from "./visual-production-quality.mjs";

const summary = await visualProductionSummary();
const { counts } = summary;

if (summary.findings.length > 0) {
  console.error("Visual production audit failed");
  for (const finding of summary.findings) {
    console.error(`[${finding.area}] ${finding.message}`);
    for (const line of finding.evidence) {
      console.error(`- ${line}`);
    }
  }
  process.exit(1);
}

console.log("Visual production audit passed");
console.log(
  `assets=${counts.manifestAssets}, expectedAssets=${counts.expectedAssets}, existingFiles=${counts.existingFiles}, cards=${counts.cards}, gems=${counts.gems}, relics=${counts.relics}, arcanas=${counts.arcanas}, characters=${counts.characters}, enemies=${counts.enemies}, stages=${counts.stages}, events=${counts.events}`
);
