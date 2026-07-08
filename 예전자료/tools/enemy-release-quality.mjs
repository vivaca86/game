const releaseEnemyIds = [
  "enemy_cloud_buddy",
  "enemy_paper_buddy",
  "enemy_sprout_buddy",
  "enemy_lantern_buddy",
  "enemy_candy_buddy",
  "enemy_ribbon_buddy",
  "enemy_bubble_buddy",
  "enemy_plush_buddy",
  "enemy_prism_buddy",
  "enemy_moon_buddy",
  "enemy_peach_buddy",
  "enemy_toy_buddy",
  "enemy_leaf_buddy",
  "enemy_star_buddy",
  "enemy_cookie_buddy",
  "enemy_cloud_trick",
  "enemy_paper_trick",
  "enemy_sprout_trick",
  "enemy_lantern_trick",
  "enemy_candy_trick",
  "enemy_ribbon_trick",
  "enemy_bubble_trick",
  "enemy_plush_trick",
  "enemy_prism_trick",
  "enemy_moon_trick",
  "enemy_peach_trick",
  "enemy_toy_trick",
  "enemy_leaf_trick",
  "enemy_star_trick",
  "enemy_cookie_trick",
  "enemy_cloud_elite",
  "enemy_paper_elite",
  "enemy_sprout_elite",
  "enemy_lantern_elite",
  "enemy_candy_elite",
  "enemy_ribbon_elite",
  "enemy_bubble_elite",
  "enemy_plush_elite",
  "enemy_prism_elite",
  "enemy_moon_elite",
  "enemy_peach_elite",
  "enemy_toy_elite",
  "enemy_leaf_elite",
  "enemy_star_elite",
  "enemy_cookie_elite",
  "boss_sunny_gate",
  "boss_lavender_hall",
  "boss_mint_garden",
  "boss_peach_canal",
  "boss_cloud_rooftop",
  "boss_ribbon_station",
  "boss_candy_cavern",
  "boss_prism_school",
  "boss_moon_attic",
  "boss_sprout_fort",
  "boss_bubble_port",
  "boss_plush_theater",
  "boss_morning_observatory",
  "boss_dream_arcade",
  "boss_rainbow_keep"
];

const allowedTypes = new Set(["attack", "guard", "debuff", "special"]);
const allowedStatuses = new Set(["mark", "weak"]);
const allowedSpecialEffects = new Set([
  "add_temp_card",
  "reduce_energy",
  "fortify_all",
  "heal_self",
  "pierce_attack",
  "chain_down",
  "summon"
]);
const genericIntentLabels = new Set([
  "장난 공격",
  "동글 방어",
  "폴짝 치기",
  "장난 표식",
  "커다란 장난",
  "대장 방어",
  "특별 장난",
  "왕방울 쿵",
  "동그란 잠금",
  "장난 카드",
  "친구 부르기"
]);

export function enemyReleaseQualityFindings(rows) {
  const summary = enemyReleaseSummary(rows);
  const findings = [];

  if (summary.total !== 60) {
    findings.push({
      area: "enemies",
      message: "Enemy catalog size no longer matches the release audit target.",
      evidence: [`expected 60 enemies, got ${summary.total}`]
    });
  }

  if (summary.repeatedIntentShapes.length > 0) {
    findings.push({
      area: "enemies",
      message: "Enemy intent patterns repeat heavily; monsters need unique combat identities before expansion.",
      evidence: summary.repeatedIntentShapes.map(([shape, count]) => `${count}x ${shape}`)
    });
  }

  if (summary.unsupported.length > 0) {
    findings.push({
      area: "enemies",
      message: "Enemy intents include unsupported release effects or status values.",
      evidence: summary.unsupported.slice(0, 12)
    });
  }

  const generatedCoverageEvidence = [];
  if (summary.releaseIdsPresent < summary.releaseIdsTotal) {
    generatedCoverageEvidence.push(`curated ids present: ${summary.releaseIdsPresent}/${summary.releaseIdsTotal}`);
  }
  if (summary.shallowRows.length > 0) {
    generatedCoverageEvidence.push(`fewer than 3 intents: ${summary.shallowRows.slice(0, 10).join(", ")}`);
  }
  if (summary.genericLabels.length > 0) {
    generatedCoverageEvidence.push(`generic labels: ${summary.genericLabels.slice(0, 10).join(", ")}`);
  }
  if (summary.uniqueFamilies < 15) {
    generatedCoverageEvidence.push(`unique families: ${summary.uniqueFamilies}/15`);
  }
  if (summary.specialEffects.size < allowedSpecialEffects.size) {
    generatedCoverageEvidence.push(`special effects: ${formatSet(summary.specialEffects)} (${summary.specialEffects.size}/${allowedSpecialEffects.size})`);
  }
  if (summary.debuffStatuses.size < allowedStatuses.size) {
    generatedCoverageEvidence.push(`debuff statuses: ${formatSet(summary.debuffStatuses)} (${summary.debuffStatuses.size}/${allowedStatuses.size})`);
  }
  if (summary.bossPhaseCoverage < summary.bossTotal) {
    generatedCoverageEvidence.push(`boss phase coverage: ${summary.bossPhaseCoverage}/${summary.bossTotal}`);
  }
  if (summary.phaseGenericLabels.length > 0) {
    generatedCoverageEvidence.push(`generic boss phase labels: ${summary.phaseGenericLabels.slice(0, 10).join(", ")}`);
  }

  if (generatedCoverageEvidence.length > 0) {
    findings.push({
      area: "enemies",
      message: "Enemy set is still best treated as generated coverage, not final monster content.",
      evidence: [
        `rank counts: ${formatCounts(summary.rankCounts)}`,
        ...generatedCoverageEvidence
      ]
    });
  }

  return findings;
}

export function enemyReleaseSummary(rows) {
  const rowById = new Map(rows.map((row) => [row.id, row]));
  const intentShapeCounts = countBy(rows, (enemy) => intentShape(enemy.intents));
  const bossRows = rows.filter((enemy) => enemy.rank === "boss");
  const unsupported = [];
  const specialEffects = new Set();
  const debuffStatuses = new Set();
  const genericLabels = [];
  const phaseGenericLabels = [];

  for (const enemy of rows) {
    for (const intent of enemy.intents ?? []) {
      collectIntentQuality(enemy.id, intent, unsupported, specialEffects, debuffStatuses, genericLabels);
    }
    for (const rule of enemy.phaseRules ?? []) {
      if (rule.addIntent) {
        collectIntentQuality(`${enemy.id}:phase`, rule.addIntent, unsupported, specialEffects, debuffStatuses, phaseGenericLabels);
      }
    }
  }

  return {
    total: rows.length,
    rankCounts: countBy(rows, (enemy) => enemy.rank),
    releaseIdsTotal: releaseEnemyIds.length,
    releaseIdsPresent: releaseEnemyIds.filter((id) => rowById.has(id)).length,
    missingReleaseIds: releaseEnemyIds.filter((id) => !rowById.has(id)),
    shallowRows: rows
      .filter((enemy) => !Array.isArray(enemy.intents) || enemy.intents.length < 3)
      .map((enemy) => enemy.id),
    genericLabels,
    phaseGenericLabels,
    uniqueFamilies: new Set(rows.map((enemy) => enemy.family).filter(Boolean)).size,
    specialEffects,
    debuffStatuses,
    unsupported,
    uniqueIntentShapes: Object.keys(intentShapeCounts).length,
    maxRepeatedIntentShape: Math.max(0, ...Object.values(intentShapeCounts)),
    repeatedIntentShapes: repeated(intentShapeCounts, 8),
    bossTotal: bossRows.length,
    bossPhaseCoverage: bossRows.filter((enemy) => Array.isArray(enemy.phaseRules) && enemy.phaseRules.length > 0).length
  };
}

function collectIntentQuality(ownerId, intent, unsupported, specialEffects, debuffStatuses, genericLabels) {
  if (!allowedTypes.has(intent.type)) {
    unsupported.push(`${ownerId}:${intent.type ?? "missing_type"}`);
  }
  if (intent.type === "debuff") {
    if (!allowedStatuses.has(intent.status)) {
      unsupported.push(`${ownerId}:debuff:${intent.status ?? "missing_status"}`);
    } else {
      debuffStatuses.add(intent.status);
    }
  }
  if (intent.type === "special") {
    if (!allowedSpecialEffects.has(intent.effect)) {
      unsupported.push(`${ownerId}:special:${intent.effect ?? "missing_effect"}`);
    } else {
      specialEffects.add(intent.effect);
    }
    if (intent.effect === "summon" && !intent.enemyId) {
      unsupported.push(`${ownerId}:special:summon:missing_enemyId`);
    }
  }
  if (genericIntentLabels.has(intent.label)) {
    genericLabels.push(`${ownerId}:${intent.label}`);
  }
}

function intentShape(intents = []) {
  if (!Array.isArray(intents) || intents.length === 0) return "no_intents";
  return intents.map((intent) => {
    const keys = Object.keys(intent)
      .filter((key) => !["label", "amount"].includes(key))
      .sort()
      .map((key) => `${key}:${valueShape(intent[key])}`)
      .join(",");
    return `${intent.type || "missing_type"}(${keys})`;
  }).join(" + ");
}

function valueShape(value) {
  if (Array.isArray(value)) return "array";
  if (value && typeof value === "object") return "object";
  if (typeof value === "number") return "#";
  if (typeof value === "string") return value.includes("_") ? "id/text" : "text";
  return String(value);
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

function formatCounts(counts) {
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([key, count]) => `${key}:${count}`)
    .join(", ");
}

function formatSet(items) {
  return Array.from(items).sort().join(", ") || "none";
}
