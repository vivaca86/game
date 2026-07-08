export const GEM_ROLE_DEFINITIONS = Object.freeze({
  damage: { key: "damage", label: "피해 증폭", icon: "피", tone: "damage" },
  shield: { key: "shield", label: "보호 증폭", icon: "막", tone: "guard" },
  cost: { key: "cost", label: "비용 압축", icon: "값", tone: "flow" },
  heal: { key: "heal", label: "회복 보조", icon: "회", tone: "heal" },
  mark: { key: "mark", label: "표식 보조", icon: "표", tone: "status" },
  echo: { key: "echo", label: "효과 메아리", icon: "메", tone: "flow" },
  splash: { key: "splash", label: "주변 피해", icon: "주", tone: "damage" },
  chain: { key: "chain", label: "연쇄 유지", icon: "연", tone: "flow" },
  bridge: { key: "bridge", label: "색 연결", icon: "색", tone: "flow" },
  utility: { key: "utility", label: "보조", icon: "보", tone: "note" }
});

export function gemRoleSummary(gem) {
  return GEM_ROLE_DEFINITIONS[gemRoleKey(gem)] || GEM_ROLE_DEFINITIONS.utility;
}

export function gemRoleKey(gem) {
  const op = gem?.effects?.[0]?.op || "";
  if (op === "modify_damage_percent") return "damage";
  if (op === "modify_shield_percent") return "shield";
  if (op === "modify_cost") return "cost";
  if (op === "heal_on_play") return "heal";
  if (op === "apply_mark_on_play") return "mark";
  if (op === "echo_basic_effect") return "echo";
  if (op === "splash_damage") return "splash";
  if (op === "preserve_chain") return "chain";
  if (op === "bridge_next_color_bonus") return "bridge";
  return "utility";
}

export function gemFitHints(gem) {
  const role = gemRoleKey(gem);
  const socketTypes = gem?.socketTypes || [];
  const hints = {
    damage: ["공격", "연쇄", "광역"],
    shield: ["방어", "반격"],
    cost: ["고비용", "복사", "성장"],
    heal: ["방어", "순환"],
    mark: ["다단", "광역", "표식"],
    echo: ["고효과", "복사", "성장"],
    splash: ["단일 공격", "처치"],
    chain: ["연쇄", "콤보"],
    bridge: ["색 연결", "순환"],
    utility: ["보조"]
  }[role] || ["보조"];
  const typeHints = socketTypes.map((type) => ({
    attack: "공격 카드",
    guard: "방어 카드",
    skill: "기술 카드",
    power: "지속 카드"
  })[type]).filter(Boolean);
  return [...new Set([...hints, ...typeHints])];
}

export function gemAudit(gems) {
  const roleCounts = new Map();
  const missingRoles = [];
  const missingSocketTypes = [];
  const missingEffects = [];
  for (const gem of gems || []) {
    const role = gemRoleSummary(gem);
    roleCounts.set(role.key, (roleCounts.get(role.key) || 0) + 1);
    if (role.key === "utility") missingRoles.push(gem.id);
    if (!Array.isArray(gem.socketTypes) || gem.socketTypes.length === 0) missingSocketTypes.push(gem.id);
    if (!Array.isArray(gem.effects) || gem.effects.length === 0) missingEffects.push(gem.id);
  }
  return {
    roleCounts: Object.fromEntries([...roleCounts.entries()].sort(([left], [right]) => left.localeCompare(right))),
    missingRoles,
    missingSocketTypes,
    missingEffects
  };
}
