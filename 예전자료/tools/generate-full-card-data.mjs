import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cardsPath = path.join(rootDir, "src", "data", "ko", "cards.json");

const seedCardIds = [
  "card_sunbean_punch",
  "card_cloud_cushion",
  "card_mint_spark",
  "card_peach_dash",
  "card_paper_charm",
  "card_lantern_puff",
  "card_sprout_guard",
  "card_star_candy",
  "card_round_mirror",
  "card_ribbon_loop",
  "card_pudding_wallop",
  "card_bubble_map"
];

const families = [
  { slug: "morning", label: "아침", color: "yellow", subject: "해님 병아리", mood: "밝고 산뜻함", tier: 1 },
  { slug: "cloud", label: "구름", color: "sky", subject: "몽실 구름 친구", mood: "푹신하고 안전함", tier: 1 },
  { slug: "mint", label: "민트", color: "mint", subject: "새싹 정원사", mood: "상쾌하고 경쾌함", tier: 1 },
  { slug: "peach", label: "복숭아", color: "peach", subject: "복숭아 꼬리별", mood: "달콤하고 빠름", tier: 2 },
  { slug: "lavender", label: "라벤더", color: "lavender", subject: "보랏빛 종이부적", mood: "차분하고 장난스러움", tier: 2 },
  { slug: "bubble", label: "방울", color: "sky", subject: "비눗방울 요정", mood: "맑고 통통 튐", tier: 2 },
  { slug: "ribbon", label: "리본", color: "lavender", subject: "리본 마술사", mood: "화려하고 유쾌함", tier: 3 },
  { slug: "candy", label: "별사탕", color: "yellow", subject: "별사탕 병정", mood: "달콤하고 반짝임", tier: 3 },
  { slug: "sprout", label: "새싹", color: "mint", subject: "잎사귀 기사", mood: "든든하고 싱그러움", tier: 3 },
  { slug: "plush", label: "말랑", color: "peach", subject: "봉제 인형 수호자", mood: "귀엽고 묵직함", tier: 4 },
  { slug: "prism", label: "프리즘", color: "lavender", subject: "무지개 조각새", mood: "맑고 신비함", tier: 4 },
  { slug: "moon", label: "달빛", color: "sky", subject: "졸린 달토끼", mood: "부드럽고 조용함", tier: 5 }
];

const templates = [
  {
    suffix: "tap",
    name: "톡",
    type: "attack",
    rarity: "common",
    cost: 1,
    frame: "rounded_attack",
    sockets: { base: 1, max: 3 },
    tags: ["타격", "연쇄"],
    text: (f, n) => `가장 앞의 적에게 피해 ${n.damage}. 연쇄가 3 이상이면 피해 +${n.bonus}.`,
    effects: (n) => [
      { op: "damage_front", amount: n.damage },
      { op: "damage_bonus_if_chain_at_least", threshold: 3, amount: n.bonus }
    ],
    upgrade: (n) => [{ op: "damage_front", amount: n.damage + 4 }]
  },
  {
    suffix: "wave",
    name: "물결",
    type: "attack",
    rarity: "uncommon",
    cost: 2,
    frame: "rounded_attack",
    sockets: { base: 1, max: 3 },
    tags: ["광역", "표식"],
    text: (f, n) => `모든 적에게 피해 ${n.splash}. 표식이 있는 적에게 피해 +${n.bonus}.`,
    effects: (n) => [
      { op: "damage_all", amount: n.splash },
      { op: "damage_bonus_vs_marked", amount: n.bonus }
    ],
    upgrade: (n) => [{ op: "damage_all", amount: n.splash + 5 }]
  },
  {
    suffix: "pad",
    name: "쿠션",
    type: "guard",
    rarity: "common",
    cost: 1,
    frame: "rounded_guard",
    sockets: { base: 1, max: 3 },
    tags: ["방어", "완충"],
    text: (f, n) => `보호막 ${n.shield}. 다음 적 공격 피해를 ${n.reduce} 줄입니다.`,
    effects: (n) => [
      { op: "gain_shield", amount: n.shield },
      { op: "reduce_next_attack", amount: n.reduce }
    ],
    upgrade: (n) => [{ op: "gain_shield", amount: n.shield + 4 }]
  },
  {
    suffix: "sparkle",
    name: "반짝",
    type: "skill",
    rarity: "common",
    cost: 1,
    frame: "rounded_skill",
    sockets: { base: 1, max: 2 },
    tags: ["드로우", "표식"],
    text: (f, n) => `카드 ${n.draw}장을 뽑습니다. 가장 앞의 적에게 표식 ${n.mark}.`,
    effects: (n) => [
      { op: "draw", amount: n.draw },
      { op: "apply_mark", amount: n.mark }
    ],
    upgrade: (n) => [{ op: "draw", amount: n.draw + 1 }]
  },
  {
    suffix: "snack",
    name: "간식",
    type: "skill",
    rarity: "common",
    cost: 0,
    frame: "rounded_skill",
    sockets: { base: 0, max: 2 },
    tags: ["기운", "비용"],
    text: (f, n) => `기운 ${n.energy}을 얻습니다. 다음 카드 비용 -1.`,
    effects: (n) => [
      { op: "gain_energy", amount: n.energy },
      { op: "discount_next_card", amount: 1 }
    ],
    upgrade: (n) => [{ op: "gain_energy", amount: n.energy + 1 }]
  },
  {
    suffix: "promise",
    name: "약속",
    type: "power",
    rarity: "rare",
    cost: 2,
    frame: "rounded_power",
    sockets: { base: 0, max: 1 },
    tags: ["지속", "전투"],
    text: (f, n) => `이번 전투 동안 ${f.label} 계열 카드를 낼 때마다 보호막 ${n.rule}.`,
    effects: (n, f) => [
      { op: "add_battle_rule", rule: "shield_on_color_play", color: f.color, amount: n.rule }
    ],
    upgrade: (n, f) => [{ op: "add_battle_rule", rule: "shield_on_color_play", color: f.color, amount: n.rule + 1 }]
  },
  {
    suffix: "shower",
    name: "소나기",
    type: "attack",
    rarity: "rare",
    cost: 3,
    frame: "rounded_attack",
    sockets: { base: 2, max: 4 },
    tags: ["다단", "무작위"],
    text: (f, n) => `무작위 적에게 피해 ${n.multi}를 ${n.hits}번 줍니다.`,
    effects: (n) => [
      { op: "damage_random", amount: n.multi, hits: n.hits }
    ],
    upgrade: (n) => [{ op: "damage_random", amount: n.multi + 2, hits: n.hits }]
  },
  {
    suffix: "gift",
    name: "선물",
    type: "skill",
    rarity: "uncommon",
    cost: 2,
    frame: "rounded_skill",
    sockets: { base: 1, max: 3 },
    tags: ["보상", "소켓"],
    text: (f, n) => `이번 전투 후 카드 보상 선택지 +1. 손패의 무작위 카드가 임시 소켓 보너스 ${n.socket}를 얻습니다.`,
    effects: (n) => [
      { op: "increase_next_card_reward_options", amount: 1 },
      { op: "prepare_socket_bonus", amount: n.socket }
    ],
    upgrade: (n) => [{ op: "prepare_socket_bonus", amount: n.socket + 1 }]
  }
];

const tempCards = [
  {
    id: "card_temp_dust",
    name: "먼지 카드",
    type: "temp",
    rarity: "common",
    cost: 1,
    color: "peach",
    frame: "rounded_temp",
    sockets: { base: 0, max: 0 },
    tags: ["임시", "방해"],
    illustration: { subject: "작은 먼지 뭉치", mood: "가볍고 성가심" },
    text: "아무 효과가 없습니다. 사용 후 이번 전투에서 사라집니다.",
    effects: [{ op: "exhaust_self" }],
    upgrade: { nameSuffix: "+", effects: [{ op: "exhaust_self" }] },
    unlock: { type: "enemy_created" }
  },
  {
    id: "card_temp_sleepy",
    name: "졸음 하품",
    type: "curse",
    rarity: "common",
    cost: 1,
    color: "sky",
    frame: "rounded_temp",
    sockets: { base: 0, max: 0 },
    tags: ["임시", "졸림"],
    illustration: { subject: "하품하는 달토끼", mood: "나른함" },
    text: "기운 1을 잃습니다. 사용 후 이번 전투에서 사라집니다.",
    effects: [
      { op: "lose_energy", amount: 1 },
      { op: "exhaust_self" }
    ],
    upgrade: { nameSuffix: "+", effects: [{ op: "exhaust_self" }] },
    unlock: { type: "enemy_created" }
  },
  {
    id: "card_temp_tangle",
    name: "엉킨 리본",
    type: "curse",
    rarity: "uncommon",
    cost: 2,
    color: "lavender",
    frame: "rounded_temp",
    sockets: { base: 0, max: 0 },
    tags: ["임시", "연쇄"],
    illustration: { subject: "엉킨 보라 리본", mood: "복잡함" },
    text: "연쇄를 0으로 만듭니다. 사용 후 이번 전투에서 사라집니다.",
    effects: [
      { op: "reset_chain" },
      { op: "exhaust_self" }
    ],
    upgrade: { nameSuffix: "+", effects: [{ op: "exhaust_self" }] },
    unlock: { type: "enemy_created" }
  },
  {
    id: "card_temp_soggy",
    name: "눅눅한 지도",
    type: "temp",
    rarity: "uncommon",
    cost: 0,
    color: "mint",
    frame: "rounded_temp",
    sockets: { base: 0, max: 0 },
    tags: ["임시", "탐색"],
    illustration: { subject: "젖은 종이 지도", mood: "난감함" },
    text: "카드 1장을 뽑지만 다음 카드 비용 +1. 사용 후 사라집니다.",
    effects: [
      { op: "draw", amount: 1 },
      { op: "increase_next_card_cost", amount: 1 },
      { op: "exhaust_self" }
    ],
    upgrade: { nameSuffix: "+", effects: [{ op: "draw", amount: 1 }, { op: "exhaust_self" }] },
    unlock: { type: "enemy_created" }
  },
  {
    id: "card_temp_blank",
    name: "빈 스티커",
    type: "temp",
    rarity: "rare",
    cost: 0,
    color: "yellow",
    frame: "rounded_temp",
    sockets: { base: 0, max: 0 },
    tags: ["임시", "복사"],
    illustration: { subject: "하얀 별 모양 스티커", mood: "비어 있지만 귀여움" },
    text: "이번 턴 마지막으로 낸 1비용 이하 카드의 기본 효과를 반복합니다. 사용 후 사라집니다.",
    effects: [
      { op: "repeat_previous_basic_effect_if_cost_at_most", cost: 1, amount: 1 },
      { op: "exhaust_self" }
    ],
    upgrade: { nameSuffix: "+", effects: [{ op: "repeat_previous_basic_effect_if_cost_at_most", cost: 2, amount: 1 }, { op: "exhaust_self" }] },
    unlock: { type: "enemy_created" }
  }
];

function numbersFor(familyIndex, templateIndex, tier) {
  const scale = tier + Math.floor(familyIndex / 4);
  return {
    damage: 7 + scale * 2 + (templateIndex % 2),
    bonus: 2 + tier,
    splash: 5 + scale * 2,
    shield: 6 + scale * 2,
    reduce: 1 + Math.min(4, tier),
    draw: templateIndex % 3 === 0 ? 2 : 1,
    mark: 1 + Math.min(3, tier),
    energy: tier >= 4 ? 2 : 1,
    rule: 1 + Math.ceil(tier / 2),
    multi: 3 + tier + Math.floor(familyIndex / 3),
    hits: 3 + (familyIndex % 2),
    socket: 1 + Math.floor(tier / 2)
  };
}

function poolUnlock(tier) {
  if (tier <= 1) return { type: "base_pool", tier };
  if (tier <= 3) return { type: "card_pool_tier", tier };
  return { type: "advanced_pool", tier };
}

function createCard(family, familyIndex, template, templateIndex) {
  const numbers = numbersFor(familyIndex, templateIndex, family.tier);
  const name = `${family.label} ${template.name}`;
  return {
    id: `card_${family.slug}_${template.suffix}`,
    name,
    type: template.type,
    rarity: template.rarity,
    cost: template.cost,
    color: family.color,
    frame: template.frame,
    sockets: template.sockets,
    tags: template.tags,
    illustration: {
      subject: `${family.subject}의 ${template.name}`,
      mood: family.mood
    },
    text: template.text(family, numbers),
    effects: template.effects(numbers, family),
    upgrade: {
      nameSuffix: "+",
      effects: template.upgrade(numbers, family)
    },
    unlock: poolUnlock(family.tier)
  };
}

const currentCards = JSON.parse(await readFile(cardsPath, "utf8"));
const currentById = new Map(currentCards.map((card) => [card.id, card]));
const seedCards = seedCardIds.map((id) => {
  const card = currentById.get(id);
  if (!card) throw new Error(`기존 seed 카드가 없습니다: ${id}`);
  return card;
});

const generatedCards = families.flatMap((family, familyIndex) =>
  templates.map((template, templateIndex) => createCard(family, familyIndex, template, templateIndex))
);

const cards = [...seedCards, ...generatedCards, ...tempCards];
const ids = new Set();
for (const card of cards) {
  if (ids.has(card.id)) throw new Error(`중복 카드 id: ${card.id}`);
  ids.add(card.id);
}
if (cards.length !== 113) {
  throw new Error(`카드 수량 오류: ${cards.length} / 113`);
}

await writeFile(cardsPath, `${JSON.stringify(cards, null, 2)}\n`, "utf8");
console.log(`카드 데이터 생성 완료: ${cards.length}장`);
