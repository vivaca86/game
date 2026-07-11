export const BUILD_ROLE_DEFINITIONS = Object.freeze({
  guard: { key: "guard", label: "보호 안정", icon: "막", tone: "guard" },
  flow: { key: "flow", label: "턴 흐름", icon: "흐", tone: "flow" },
  card: { key: "card", label: "카드 성장", icon: "카", tone: "card" },
  gem: { key: "gem", label: "보석 성장", icon: "젬", tone: "gem" },
  economy: { key: "economy", label: "경제 운영", icon: "별", tone: "economy" },
  scout: { key: "scout", label: "경로 예측", icon: "길", tone: "scout" },
  heal: { key: "heal", label: "회복 유지", icon: "회", tone: "heal" },
  damage: { key: "damage", label: "추가 피해", icon: "피", tone: "damage" },
  status: { key: "status", label: "상태 연계", icon: "표", tone: "status" },
  reward: { key: "reward", label: "보상 확장", icon: "보", tone: "reward" },
  utility: { key: "utility", label: "보조", icon: "보", tone: "note" }
});

const BUILD_ROLE_BY_OP = Object.freeze({
  shield_at_battle_start: "guard",
  carry_shield_percent: "guard",
  first_expensive_card_free_each_battle: "flow",
  start_with_energy: "flow",
  retain_one_card: "flow",
  preserve_chain_once: "flow",
  enable_cost_ladder_chain: "flow",
  draw_on_four_colors: "flow",
  discount_hand_when_cards_played: "flow",
  increase_card_reward_options: "card",
  upgrade_first_card_reward: "card",
  add_card_after_elite: "card",
  increase_next_card_reward_options: "card",
  increase_gem_reward_options: "gem",
  modify_gem_reward_chance_percent: "gem",
  reduce_gem_cost_percent: "gem",
  modify_gold_reward_percent: "economy",
  reduce_shop_prices_percent: "economy",
  gain_gold_on_perfect: "economy",
  gain_gold_on_zero_cost_play: "economy",
  reveal_next_room_type: "scout",
  heal_after_combat: "heal",
  heal_when_guard_played_count: "heal",
  damage_random_on_guard_play: "damage",
  damage_all_when_cards_played: "damage",
  damage_all_on_attack_kill: "damage",
  mark_front_on_heal: "status",
  reroll_reward_free: "reward",
  boss_reward_bonus: "reward"
});

export function buildItemRoleSummary(item, kind = "relic") {
  return BUILD_ROLE_DEFINITIONS[buildItemRoleKey(item, kind)] || BUILD_ROLE_DEFINITIONS.utility;
}

export function buildItemRoleKey(item, kind = "relic") {
  const effects = item?.effects || [];
  const ops = effects.map((effect) => effect.op).filter(Boolean);
  for (const op of ops) {
    const role = BUILD_ROLE_BY_OP[op];
    if (role) return role;
  }
  if (kind === "arcana" && /연쇄|비용|드로우|색/.test(item?.text || "")) return "flow";
  if (/보석|소켓/.test(item?.text || "")) return "gem";
  if (/카드|강화|보상/.test(item?.text || "")) return "card";
  if (/보호막|방어/.test(item?.text || "")) return "guard";
  if (/회복|체력/.test(item?.text || "")) return "heal";
  if (/피해|공격|처치/.test(item?.text || "")) return "damage";
  if (/별사탕|상점|가격/.test(item?.text || "")) return "economy";
  return "utility";
}

export function buildFitHints(item, kind = "relic") {
  const role = buildItemRoleKey(item, kind);
  const roleHints = {
    guard: ["방어 덱", "장기전", "안정 진행"],
    flow: ["연쇄 덱", "저비용 순환", "콤보"],
    card: ["카드 보상", "강화 성장", "덱 설계"],
    gem: ["보석 빌드", "소켓 성장", "효과 증폭"],
    economy: ["상점 운영", "별사탕 수급", "이벤트 선택"],
    scout: ["경로 선택", "위험 회피", "보스 준비"],
    heal: ["회복 운영", "방어 덱", "장기전"],
    damage: ["공격 덱", "광역 처리", "정예전"],
    status: ["표식 덱", "회복 연계", "집중 피해"],
    reward: ["보상 성장", "후반 준비", "보스전"],
    utility: ["보조", "상황 대응"]
  }[role] || ["보조", "상황 대응"];

  const poolHint = {
    combat: "전투 중심",
    reward: "보상 방",
    map: "경로 운영",
    shop: "상점",
    elite: "정예전",
    boss: "보스전"
  }[item?.pool];

  const kindHint = kind === "arcana" ? "기운 빌드" : "유물 빌드";
  return [...new Set([...roleHints, poolHint, kindHint].filter(Boolean))];
}

export function buildItemAudit(relics = [], arcanas = []) {
  const roleCounts = new Map();
  const kindRoleCounts = new Map();
  const missingRoles = [];
  const missingEffects = [];
  const missingHints = [];

  for (const [kind, rows] of [["relic", relics], ["arcana", arcanas]]) {
    for (const item of rows || []) {
      const role = buildItemRoleSummary(item, kind);
      roleCounts.set(role.key, (roleCounts.get(role.key) || 0) + 1);
      kindRoleCounts.set(`${kind}:${role.key}`, (kindRoleCounts.get(`${kind}:${role.key}`) || 0) + 1);
      if (role.key === "utility") missingRoles.push(item.id);
      if (!Array.isArray(item.effects) || item.effects.length === 0) missingEffects.push(item.id);
      if (buildFitHints(item, kind).length < 2) missingHints.push(item.id);
    }
  }

  return {
    roleCounts: Object.fromEntries([...roleCounts.entries()].sort(([left], [right]) => left.localeCompare(right))),
    kindRoleCounts: Object.fromEntries([...kindRoleCounts.entries()].sort(([left], [right]) => left.localeCompare(right))),
    missingRoles,
    missingEffects,
    missingHints
  };
}
