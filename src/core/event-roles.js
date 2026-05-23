export const EVENT_ROLE_DEFINITIONS = Object.freeze({
  market: { key: "market", label: "거래 선택", icon: "상", tone: "gold" },
  station: { key: "station", label: "작업대", icon: "작", tone: "gem" },
  rest: { key: "rest", label: "회복 휴식", icon: "쉼", tone: "heal" },
  card: { key: "card", label: "덱 성장", icon: "카", tone: "card" },
  gem: { key: "gem", label: "보석 성장", icon: "젬", tone: "gem" },
  relic: { key: "relic", label: "유물 탐색", icon: "유", tone: "relic" },
  upgrade: { key: "upgrade", label: "카드 강화", icon: "강", tone: "power" },
  combat: { key: "combat", label: "장난 전투", icon: "전", tone: "danger" },
  economy: { key: "economy", label: "별사탕", icon: "별", tone: "gold" },
  utility: { key: "utility", label: "보조 선택", icon: "보", tone: "note" }
});

export const EVENT_RISK_DEFINITIONS = Object.freeze({
  safe: { key: "safe", label: "안전", icon: "안", tone: "safe", level: 0 },
  trade: { key: "trade", label: "거래", icon: "비", tone: "cost", level: 1 },
  strain: { key: "strain", label: "체력 소모", icon: "체", tone: "danger", level: 2 },
  danger: { key: "danger", label: "추가 전투", icon: "전", tone: "danger", level: 3 }
});

export function eventRoleSummary(event) {
  return EVENT_ROLE_DEFINITIONS[eventRoleKey(event)] || EVENT_ROLE_DEFINITIONS.utility;
}

export function eventRoleKey(event = {}) {
  if (event.type === "shop") return "market";
  if (event.type === "station") return "station";
  if (event.type === "rest") return "rest";
  const choiceRoles = new Set((event.choices || []).map((choice) => eventChoiceRoleKey(choice)));
  if (choiceRoles.has("relic")) return "relic";
  if (choiceRoles.has("gem")) return "gem";
  if (choiceRoles.has("card")) return "card";
  if (choiceRoles.has("combat")) return "combat";
  return "utility";
}

export function eventChoiceRoleSummary(choice) {
  return EVENT_ROLE_DEFINITIONS[eventChoiceRoleKey(choice)] || EVENT_ROLE_DEFINITIONS.utility;
}

export function eventChoiceRoleKey(choice = {}) {
  const reward = choice.reward || {};
  if (reward.combat) return "combat";
  if (reward.relicPool?.length) return "relic";
  if (reward.arcanaPool?.length) return "relic";
  if (reward.gemPool?.length || reward.openGemSocket) return "gem";
  if (reward.cardPool?.length) return "card";
  if (reward.upgradeRandomCard) return "upgrade";
  if (reward.heal) return "rest";
  if (reward.gold) return "economy";
  return "utility";
}

export function eventChoiceRiskSummary(choice = {}, adjustedCost = null) {
  const reward = choice.reward || {};
  const cost = adjustedCost || choice.cost || {};
  if (reward.combat) return EVENT_RISK_DEFINITIONS.danger;
  if (cost.hp) return EVENT_RISK_DEFINITIONS.strain;
  if (cost.gold) return EVENT_RISK_DEFINITIONS.trade;
  return EVENT_RISK_DEFINITIONS.safe;
}

export function eventChoiceSignalItems(choice = {}, adjustedCost = null) {
  const role = eventChoiceRoleSummary(choice);
  const risk = eventChoiceRiskSummary(choice, adjustedCost);
  return [
    { tone: role.tone, icon: role.icon, label: "성향", value: role.label },
    { tone: risk.tone, icon: risk.icon, label: "위험도", value: risk.label }
  ];
}

export function eventRiskSpread(event = {}) {
  const risks = (event.choices || []).map((choice) => eventChoiceRiskSummary(choice));
  const maxLevel = Math.max(...risks.map((risk) => risk.level), 0);
  const labels = [...new Set(risks.map((risk) => risk.label))];
  return {
    maxLevel,
    labels,
    highest: Object.values(EVENT_RISK_DEFINITIONS).find((risk) => risk.level === maxLevel) || EVENT_RISK_DEFINITIONS.safe
  };
}

export function eventAudit(events = []) {
  const roleCounts = new Map();
  const choiceRoleCounts = new Map();
  const riskCounts = new Map();
  const missingRoles = [];
  const thinChoices = [];
  const missingRewards = [];
  const missingNoUpfrontCost = [];
  const missingRiskSpread = [];

  for (const event of events || []) {
    const role = eventRoleSummary(event);
    roleCounts.set(role.key, (roleCounts.get(role.key) || 0) + 1);
    if (role.key === "utility") missingRoles.push(event.id);
    if (!Array.isArray(event.choices) || event.choices.length < 3) thinChoices.push(event.id);

    const choiceRoles = new Set();
    const riskLevels = new Set();
    let hasNoUpfrontCost = false;
    for (const choice of event.choices || []) {
      if (!choice.reward || Object.keys(choice.reward).length === 0) missingRewards.push(`${event.id}:${choice.label || "선택지"}`);
      const choiceRole = eventChoiceRoleSummary(choice);
      const risk = eventChoiceRiskSummary(choice);
      choiceRoles.add(choiceRole.key);
      riskLevels.add(risk.level);
      if (!choice.cost || Object.keys(choice.cost).length === 0) hasNoUpfrontCost = true;
      choiceRoleCounts.set(choiceRole.key, (choiceRoleCounts.get(choiceRole.key) || 0) + 1);
      riskCounts.set(risk.key, (riskCounts.get(risk.key) || 0) + 1);
    }
    if (choiceRoles.size < 2) missingRoles.push(`${event.id}:choices`);
    if (!hasNoUpfrontCost) missingNoUpfrontCost.push(event.id);
    if (riskLevels.size < 2) missingRiskSpread.push(event.id);
  }

  return {
    roleCounts: sortedObject(roleCounts),
    choiceRoleCounts: sortedObject(choiceRoleCounts),
    riskCounts: sortedObject(riskCounts),
    missingRoles,
    thinChoices,
    missingRewards,
    missingNoUpfrontCost,
    missingRiskSpread
  };
}

function sortedObject(map) {
  return Object.fromEntries([...map.entries()].sort(([left], [right]) => left.localeCompare(right)));
}
