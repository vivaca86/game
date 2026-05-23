export const CARD_ROLE_DEFINITIONS = Object.freeze({
  strike: { key: "strike", label: "단일 공격", icon: "공", tone: "damage" },
  chain: { key: "chain", label: "연쇄 공격", icon: "연", tone: "damage" },
  sweep: { key: "sweep", label: "광역 공격", icon: "광", tone: "damage" },
  multi: { key: "multi", label: "다단 공격", icon: "다", tone: "damage" },
  mark: { key: "mark", label: "표식", icon: "표", tone: "status" },
  guard: { key: "guard", label: "보호", icon: "막", tone: "guard" },
  counter: { key: "counter", label: "반격 방어", icon: "반", tone: "guard" },
  flow: { key: "flow", label: "순환", icon: "순", tone: "flow" },
  energy: { key: "energy", label: "기운", icon: "기", tone: "flow" },
  growth: { key: "growth", label: "성장", icon: "성", tone: "reward" },
  engine: { key: "engine", label: "지속", icon: "지", tone: "reward" },
  copy: { key: "copy", label: "복사", icon: "복", tone: "flow" },
  disrupt: { key: "disrupt", label: "방해", icon: "방", tone: "danger" },
  recovery: { key: "recovery", label: "회복", icon: "회", tone: "heal" },
  utility: { key: "utility", label: "보조", icon: "보", tone: "note" }
});

export function cardRoleSummary(card) {
  return CARD_ROLE_DEFINITIONS[cardRoleKey(card)] || CARD_ROLE_DEFINITIONS.utility;
}

export function cardRoleKey(card) {
  const effects = card?.effects || [];
  const ops = new Set(effects.map((effect) => effect.op));
  const tags = new Set(card?.tags || []);

  if (["curse", "temp"].includes(card?.type)) return "disrupt";
  if (ops.has("increase_next_card_cost") || ops.has("lose_energy") || ops.has("reset_chain")) return "disrupt";
  if (ops.has("repeat_previous_basic_effect") || ops.has("repeat_previous_basic_effect_if_cost_at_most")) return "copy";
  if (ops.has("add_battle_rule") || card?.type === "power") return "engine";
  if (ops.has("increase_next_card_reward_options") || ops.has("prepare_socket_bonus")) return "growth";
  if (ops.has("enable_reflect_damage") || ops.has("reduce_next_attack") || ops.has("retain_shield_next_turn")) return "counter";
  if (ops.has("gain_shield")) return "guard";
  if (ops.has("heal_if_hp_ratio_below")) return "recovery";
  if (ops.has("apply_mark") || ops.has("damage_bonus_vs_marked") || tags.has("표식")) return "mark";
  if (ops.has("gain_energy")) return "energy";
  if (ops.has("draw") || ops.has("discount_next_card") || ops.has("draw_if_kill")) return "flow";
  if (ops.has("damage_all")) return "sweep";
  if (ops.has("damage_random")) return "multi";
  if (ops.has("damage_bonus_if_chain_at_least") || ops.has("damage_bonus_if_cards_played_at_least")) return "chain";
  if (ops.has("damage_front")) return "strike";
  return "utility";
}

export function cardRoleAudit(cards) {
  const roleCounts = new Map();
  const missingRoles = [];
  const missingTags = [];
  for (const card of cards || []) {
    const role = cardRoleSummary(card);
    roleCounts.set(role.key, (roleCounts.get(role.key) || 0) + 1);
    if (role.key === "utility") missingRoles.push(card.id);
    if (!Array.isArray(card.tags) || card.tags.length === 0) missingTags.push(card.id);
  }
  return {
    roleCounts: Object.fromEntries([...roleCounts.entries()].sort(([left], [right]) => left.localeCompare(right))),
    missingRoles,
    missingTags
  };
}
