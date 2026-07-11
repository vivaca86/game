import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(rootDir, "src", "data", "ko");

const idMap = new Map([
  ["card_morning_tap", "card_morning_sunhook"],
  ["card_morning_wave", "card_morning_daybreak"],
  ["card_morning_pad", "card_morning_windowshade"],
  ["card_morning_sparkle", "card_morning_bellnote"],
  ["card_morning_snack", "card_morning_breakfast"],
  ["card_morning_promise", "card_morning_goldenrule"],
  ["card_morning_shower", "card_morning_sunshower"],
  ["card_morning_gift", "card_morning_parcel"],
  ["card_cloud_tap", "card_cloud_pillowtap"],
  ["card_cloud_wave", "card_cloud_mistspill"],
  ["card_cloud_pad", "card_cloud_blanketbank"],
  ["card_cloud_sparkle", "card_cloud_doodles"],
  ["card_cloud_snack", "card_cloud_breeze"],
  ["card_cloud_promise", "card_cloud_rainrule"],
  ["card_cloud_shower", "card_cloud_hailpop"],
  ["card_cloud_gift", "card_cloud_floatbox"],
  ["card_mint_tap", "card_mint_leafjab"],
  ["card_mint_wave", "card_mint_gardensweep"],
  ["card_mint_pad", "card_mint_vinescreen"],
  ["card_mint_sparkle", "card_mint_notedrop"],
  ["card_mint_snack", "card_mint_freshbreath"],
  ["card_mint_promise", "card_mint_gardenrule"],
  ["card_mint_shower", "card_mint_needlerain"],
  ["card_mint_gift", "card_mint_workshop"],
  ["card_peach_tap", "card_peach_blushdash"],
  ["card_peach_wave", "card_peach_jamwave"],
  ["card_peach_pad", "card_peach_softguard"],
  ["card_peach_sparkle", "card_peach_sticker"],
  ["card_peach_snack", "card_peach_picnic"],
  ["card_peach_promise", "card_peach_warmrule"],
  ["card_peach_shower", "card_peach_pitscatter"],
  ["card_peach_gift", "card_peach_lunchbox"]
]);

const overrides = {
  card_morning_tap: card({
    id: "card_morning_sunhook",
    name: "아침 햇갈고리",
    type: "attack",
    rarity: "common",
    cost: 1,
    tags: ["타격", "연쇄"],
    text: "가장 앞의 적에게 피해 9. 이번 턴에 낸 카드가 2장 이상이면 피해 +3.",
    effects: [
      { op: "damage_front", amount: 9 },
      { op: "damage_bonus_if_cards_played_at_least", threshold: 2, amount: 3 }
    ],
    upgradeEffects: [{ op: "damage_front", amount: 12 }],
    subject: "아침빛 갈고리 장갑",
    mood: "빠르고 밝음"
  }),
  card_morning_wave: card({
    id: "card_morning_daybreak",
    name: "아침 여명결",
    type: "attack",
    rarity: "uncommon",
    cost: 2,
    tags: ["광역", "처치"],
    text: "모든 적에게 피해 6. 이 카드로 적을 쓰러뜨리면 카드 1장을 뽑습니다.",
    effects: [
      { op: "damage_all", amount: 6 },
      { op: "draw_if_kill", amount: 1 }
    ],
    upgradeEffects: [{ op: "damage_all", amount: 9 }],
    subject: "종이 무대 위로 퍼지는 여명 물결",
    mood: "환하고 산뜻함"
  }),
  card_morning_pad: card({
    id: "card_morning_windowshade",
    name: "아침 창가림",
    type: "guard",
    rarity: "common",
    cost: 1,
    tags: ["방어", "유지"],
    text: "보호막 8. 다음 턴 시작 시 보호막 2를 남깁니다.",
    effects: [
      { op: "gain_shield", amount: 8 },
      { op: "retain_shield_next_turn", amount: 2 }
    ],
    upgradeEffects: [{ op: "gain_shield", amount: 11 }],
    subject: "햇살을 걸러내는 종이 창가림",
    mood: "따뜻하고 단단함"
  }),
  card_morning_sparkle: card({
    id: "card_morning_bellnote",
    name: "아침 종소리",
    type: "skill",
    rarity: "common",
    cost: 1,
    tags: ["순환", "비용"],
    text: "카드 1장을 뽑습니다. 이번 턴 다음 카드 비용 -1.",
    effects: [
      { op: "draw", amount: 1 },
      { op: "discount_next_card", amount: 1 }
    ],
    upgradeEffects: [{ op: "draw", amount: 2 }],
    subject: "작은 종에서 튀는 금빛 음표",
    mood: "경쾌함"
  }),
  card_morning_snack: card({
    id: "card_morning_breakfast",
    name: "아침 도시락",
    type: "skill",
    rarity: "common",
    cost: 0,
    tags: ["기운", "회복"],
    text: "기운 1을 얻습니다. 체력이 65% 이하라면 체력 2를 회복합니다.",
    effects: [
      { op: "gain_energy", amount: 1 },
      { op: "heal_if_hp_ratio_below", ratio: 0.65, amount: 2 }
    ],
    upgradeEffects: [{ op: "gain_energy", amount: 2 }],
    subject: "노란 손수건에 싸인 작은 도시락",
    mood: "포근함"
  }),
  card_morning_promise: card({
    id: "card_morning_goldenrule",
    name: "아침 금빛 규칙",
    type: "power",
    rarity: "rare",
    cost: 2,
    tags: ["지속", "방어"],
    text: "이번 전투 동안 노란 계열 카드를 낼 때마다 보호막 2. 즉시 보호막 3.",
    effects: [
      { op: "add_battle_rule", rule: "shield_on_color_play", color: "yellow", amount: 2 },
      { op: "gain_shield", amount: 3 }
    ],
    upgradeEffects: [{ op: "add_battle_rule", rule: "shield_on_color_play", color: "yellow", amount: 3 }],
    subject: "금색 리본으로 묶인 전투 규칙 카드",
    mood: "의식적이고 선명함"
  }),
  card_morning_shower: card({
    id: "card_morning_sunshower",
    name: "아침 햇소나기",
    type: "attack",
    rarity: "rare",
    cost: 3,
    tags: ["다단", "표식"],
    text: "무작위 적에게 피해 3을 4번 줍니다. 가장 앞의 적에게 표식 1.",
    effects: [
      { op: "damage_random", amount: 3, hits: 4 },
      { op: "apply_mark", amount: 1 }
    ],
    upgradeEffects: [{ op: "damage_random", amount: 4, hits: 4 }],
    subject: "무대 위로 쏟아지는 노란 종이비",
    mood: "밝고 빠름"
  }),
  card_morning_gift: card({
    id: "card_morning_parcel",
    name: "아침 꾸러미",
    type: "skill",
    rarity: "uncommon",
    cost: 2,
    tags: ["보상", "순환"],
    text: "이번 전투 후 카드 보상 선택지 +1. 카드 1장을 뽑습니다.",
    effects: [
      { op: "increase_next_card_reward_options", amount: 1 },
      { op: "draw", amount: 1 }
    ],
    upgradeEffects: [{ op: "increase_next_card_reward_options", amount: 2 }],
    subject: "노란 끈으로 묶은 작은 선물 꾸러미",
    mood: "기대감 있음"
  }),
  card_cloud_tap: card({
    id: "card_cloud_pillowtap",
    name: "구름 베개톡",
    type: "attack",
    rarity: "common",
    cost: 1,
    tags: ["타격", "표식"],
    text: "가장 앞의 적에게 피해 7. 표식 1을 남깁니다.",
    effects: [
      { op: "damage_front", amount: 7 },
      { op: "apply_mark", amount: 1 }
    ],
    upgradeEffects: [{ op: "damage_front", amount: 10 }],
    subject: "푹신한 구름 베개 펀치",
    mood: "가볍고 장난스러움"
  }),
  card_cloud_wave: card({
    id: "card_cloud_mistspill",
    name: "구름 안개흘림",
    type: "attack",
    rarity: "uncommon",
    cost: 2,
    tags: ["광역", "완화"],
    text: "모든 적에게 피해 5. 다음 적 공격 피해를 2 줄입니다.",
    effects: [
      { op: "damage_all", amount: 5 },
      { op: "reduce_next_attack", amount: 2 }
    ],
    upgradeEffects: [{ op: "damage_all", amount: 8 }],
    subject: "무대를 낮게 덮는 푸른 안개",
    mood: "느긋하고 안전함"
  }),
  card_cloud_pad: card({
    id: "card_cloud_blanketbank",
    name: "구름 담요둑",
    type: "guard",
    rarity: "common",
    cost: 1,
    tags: ["방어", "순환"],
    text: "보호막 6. 카드 1장을 뽑습니다.",
    effects: [
      { op: "gain_shield", amount: 6 },
      { op: "draw", amount: 1 }
    ],
    upgradeEffects: [{ op: "gain_shield", amount: 9 }],
    subject: "겹겹이 쌓인 구름 담요",
    mood: "폭신함"
  }),
  card_cloud_sparkle: card({
    id: "card_cloud_doodles",
    name: "구름 낙서별",
    type: "skill",
    rarity: "common",
    cost: 1,
    tags: ["표식", "비용"],
    text: "가장 앞의 적에게 표식 2. 이번 턴 다음 카드 비용 -1.",
    effects: [
      { op: "apply_mark", amount: 2 },
      { op: "discount_next_card", amount: 1 }
    ],
    upgradeEffects: [{ op: "apply_mark", amount: 3 }],
    subject: "구름 위에 그린 작은 별 낙서",
    mood: "맑고 장난스러움"
  }),
  card_cloud_snack: card({
    id: "card_cloud_breeze",
    name: "구름 숨돌림",
    type: "skill",
    rarity: "common",
    cost: 0,
    tags: ["기운", "유지"],
    text: "기운 1을 얻습니다. 다음 턴 시작 시 보호막 1을 남깁니다.",
    effects: [
      { op: "gain_energy", amount: 1 },
      { op: "retain_shield_next_turn", amount: 1 }
    ],
    upgradeEffects: [{ op: "gain_energy", amount: 2 }],
    subject: "작은 구름 숨결",
    mood: "차분함"
  }),
  card_cloud_promise: card({
    id: "card_cloud_rainrule",
    name: "구름 비규칙",
    type: "power",
    rarity: "rare",
    cost: 2,
    tags: ["지속", "완화"],
    text: "이번 전투 동안 하늘 계열 카드를 낼 때마다 보호막 2. 다음 적 공격 피해를 2 줄입니다.",
    effects: [
      { op: "add_battle_rule", rule: "shield_on_color_play", color: "sky", amount: 2 },
      { op: "reduce_next_attack", amount: 2 }
    ],
    upgradeEffects: [{ op: "add_battle_rule", rule: "shield_on_color_play", color: "sky", amount: 3 }],
    subject: "비방울 모양 규칙표",
    mood: "부드러운 긴장감"
  }),
  card_cloud_shower: card({
    id: "card_cloud_hailpop",
    name: "구름 톡톡우박",
    type: "attack",
    rarity: "rare",
    cost: 3,
    tags: ["다단", "표식"],
    text: "무작위 적에게 피해 4를 3번 줍니다. 표식이 있는 적에게 피해 +2.",
    effects: [
      { op: "damage_random", amount: 4, hits: 3 },
      { op: "damage_bonus_vs_marked", amount: 2 }
    ],
    upgradeEffects: [{ op: "damage_random", amount: 5, hits: 3 }],
    subject: "작은 우박 조각들이 튀는 장면",
    mood: "통통 튐"
  }),
  card_cloud_gift: card({
    id: "card_cloud_floatbox",
    name: "구름 둥실상자",
    type: "skill",
    rarity: "uncommon",
    cost: 2,
    tags: ["소켓", "비용"],
    text: "손패의 무작위 카드가 임시 소켓 보너스 1을 얻습니다. 이번 턴 다음 카드 비용 -1.",
    effects: [
      { op: "prepare_socket_bonus", amount: 1 },
      { op: "discount_next_card", amount: 1 }
    ],
    upgradeEffects: [{ op: "prepare_socket_bonus", amount: 2 }],
    subject: "둥실 떠 있는 푸른 상자",
    mood: "가벼움"
  }),
  card_mint_tap: card({
    id: "card_mint_leafjab",
    name: "민트 잎찌르기",
    type: "attack",
    rarity: "common",
    cost: 1,
    tags: ["타격", "회복"],
    text: "가장 앞의 적에게 피해 8. 체력이 절반 이하라면 체력 2를 회복합니다.",
    effects: [
      { op: "damage_front", amount: 8 },
      { op: "heal_if_hp_ratio_below", ratio: 0.5, amount: 2 }
    ],
    upgradeEffects: [{ op: "damage_front", amount: 11 }],
    subject: "민트 잎 모양 찌르기",
    mood: "상쾌함"
  }),
  card_mint_wave: card({
    id: "card_mint_gardensweep",
    name: "민트 정원쓸기",
    type: "attack",
    rarity: "uncommon",
    cost: 2,
    tags: ["광역", "표식"],
    text: "모든 적에게 피해 5. 가장 앞의 적에게 표식 1.",
    effects: [
      { op: "damage_all", amount: 5 },
      { op: "apply_mark", amount: 1 }
    ],
    upgradeEffects: [{ op: "damage_all", amount: 8 }],
    subject: "정원을 쓸고 지나가는 민트색 붓",
    mood: "깨끗함"
  }),
  card_mint_pad: card({
    id: "card_mint_vinescreen",
    name: "민트 덩굴막",
    type: "guard",
    rarity: "common",
    cost: 1,
    tags: ["방어", "표식"],
    text: "보호막 7. 가장 앞의 적에게 표식 1.",
    effects: [
      { op: "gain_shield", amount: 7 },
      { op: "apply_mark", amount: 1 }
    ],
    upgradeEffects: [{ op: "gain_shield", amount: 10 }],
    subject: "덩굴처럼 감기는 민트 막",
    mood: "싱그러움"
  }),
  card_mint_sparkle: card({
    id: "card_mint_notedrop",
    name: "민트 음표방울",
    type: "skill",
    rarity: "common",
    cost: 1,
    tags: ["순환", "방어"],
    text: "카드 2장을 뽑습니다. 보호막 3.",
    effects: [
      { op: "draw", amount: 2 },
      { op: "gain_shield", amount: 3 }
    ],
    upgradeEffects: [{ op: "draw", amount: 3 }],
    subject: "민트색 음표 방울",
    mood: "맑음"
  }),
  card_mint_snack: card({
    id: "card_mint_freshbreath",
    name: "민트 숨고르기",
    type: "skill",
    rarity: "common",
    cost: 0,
    tags: ["기운", "완화"],
    text: "기운 1을 얻습니다. 다음 적 공격 피해를 1 줄입니다.",
    effects: [
      { op: "gain_energy", amount: 1 },
      { op: "reduce_next_attack", amount: 1 }
    ],
    upgradeEffects: [{ op: "gain_energy", amount: 2 }],
    subject: "상쾌한 민트 숨결",
    mood: "차갑고 깨끗함"
  }),
  card_mint_promise: card({
    id: "card_mint_gardenrule",
    name: "민트 정원규칙",
    type: "power",
    rarity: "rare",
    cost: 2,
    tags: ["지속", "순환"],
    text: "이번 전투 동안 민트 계열 카드를 낼 때마다 보호막 2. 카드 1장을 뽑습니다.",
    effects: [
      { op: "add_battle_rule", rule: "shield_on_color_play", color: "mint", amount: 2 },
      { op: "draw", amount: 1 }
    ],
    upgradeEffects: [{ op: "add_battle_rule", rule: "shield_on_color_play", color: "mint", amount: 3 }],
    subject: "정원 표지판처럼 세운 규칙 카드",
    mood: "정돈됨"
  }),
  card_mint_shower: card({
    id: "card_mint_needlerain",
    name: "민트 바늘비",
    type: "attack",
    rarity: "rare",
    cost: 3,
    tags: ["다단", "처치"],
    text: "무작위 적에게 피해 2를 5번 줍니다. 이 카드로 적을 쓰러뜨리면 카드 1장을 뽑습니다.",
    effects: [
      { op: "damage_random", amount: 2, hits: 5 },
      { op: "draw_if_kill", amount: 1 }
    ],
    upgradeEffects: [{ op: "damage_random", amount: 3, hits: 5 }],
    subject: "가는 민트색 바늘비",
    mood: "빠르고 시원함"
  }),
  card_mint_gift: card({
    id: "card_mint_workshop",
    name: "민트 공방도구",
    type: "skill",
    rarity: "uncommon",
    cost: 2,
    tags: ["소켓", "방어"],
    text: "손패의 무작위 카드가 임시 소켓 보너스 1을 얻습니다. 보호막 4.",
    effects: [
      { op: "prepare_socket_bonus", amount: 1 },
      { op: "gain_shield", amount: 4 }
    ],
    upgradeEffects: [{ op: "prepare_socket_bonus", amount: 2 }],
    subject: "민트색 소켓 공방 도구",
    mood: "꼼꼼함"
  }),
  card_peach_tap: card({
    id: "card_peach_blushdash",
    name: "복숭아 볼돌진",
    type: "attack",
    rarity: "common",
    cost: 1,
    tags: ["타격", "비용"],
    text: "가장 앞의 적에게 피해 11. 이번 턴 다음 카드 비용 -1.",
    effects: [
      { op: "damage_front", amount: 11 },
      { op: "discount_next_card", amount: 1 }
    ],
    upgradeEffects: [{ op: "damage_front", amount: 14 }],
    subject: "분홍 볼이 앞질러 돌진하는 모습",
    mood: "활기참"
  }),
  card_peach_wave: card({
    id: "card_peach_jamwave",
    name: "복숭아 잼물결",
    type: "attack",
    rarity: "uncommon",
    cost: 2,
    tags: ["광역", "연쇄"],
    text: "모든 적에게 피해 8. 이번 턴에 낸 카드가 2장 이상이면 피해 +3.",
    effects: [
      { op: "damage_all", amount: 8 },
      { op: "damage_bonus_if_cards_played_at_least", threshold: 2, amount: 3 }
    ],
    upgradeEffects: [{ op: "damage_all", amount: 11 }],
    subject: "잼처럼 퍼지는 복숭아빛 물결",
    mood: "달콤하고 무거움"
  }),
  card_peach_pad: card({
    id: "card_peach_softguard",
    name: "복숭아 말랑방패",
    type: "guard",
    rarity: "common",
    cost: 1,
    tags: ["방어", "회복"],
    text: "보호막 10. 체력이 60% 이하라면 체력 3을 회복합니다.",
    effects: [
      { op: "gain_shield", amount: 10 },
      { op: "heal_if_hp_ratio_below", ratio: 0.6, amount: 3 }
    ],
    upgradeEffects: [{ op: "gain_shield", amount: 13 }],
    subject: "말랑한 복숭아 방패",
    mood: "부드럽고 든든함"
  }),
  card_peach_sparkle: card({
    id: "card_peach_sticker",
    name: "복숭아 스티커별",
    type: "skill",
    rarity: "common",
    cost: 1,
    tags: ["순환", "표식"],
    text: "카드 1장을 뽑습니다. 표식이 있는 적에게 피해 +4.",
    effects: [
      { op: "draw", amount: 1 },
      { op: "damage_bonus_vs_marked", amount: 4 }
    ],
    upgradeEffects: [{ op: "draw", amount: 2 }],
    subject: "복숭아 모양 스티커 별",
    mood: "귀엽고 날렵함"
  }),
  card_peach_snack: card({
    id: "card_peach_picnic",
    name: "복숭아 소풍칸",
    type: "skill",
    rarity: "common",
    cost: 0,
    tags: ["기운", "표식"],
    text: "기운 1을 얻습니다. 가장 앞의 적에게 표식 1.",
    effects: [
      { op: "gain_energy", amount: 1 },
      { op: "apply_mark", amount: 1 }
    ],
    upgradeEffects: [{ op: "gain_energy", amount: 2 }],
    subject: "작은 복숭아 소풍 칸",
    mood: "가볍고 들뜸"
  }),
  card_peach_promise: card({
    id: "card_peach_warmrule",
    name: "복숭아 온기규칙",
    type: "power",
    rarity: "rare",
    cost: 2,
    tags: ["지속", "회복"],
    text: "이번 전투 동안 복숭아 계열 카드를 낼 때마다 보호막 2. 체력이 75% 이하라면 체력 2를 회복합니다.",
    effects: [
      { op: "add_battle_rule", rule: "shield_on_color_play", color: "peach", amount: 2 },
      { op: "heal_if_hp_ratio_below", ratio: 0.75, amount: 2 }
    ],
    upgradeEffects: [{ op: "add_battle_rule", rule: "shield_on_color_play", color: "peach", amount: 3 }],
    subject: "복숭아빛 온기 규칙서",
    mood: "다정함"
  }),
  card_peach_shower: card({
    id: "card_peach_pitscatter",
    name: "복숭아 씨앗흩기",
    type: "attack",
    rarity: "rare",
    cost: 3,
    tags: ["다단", "완화"],
    text: "무작위 적에게 피해 5를 2번 줍니다. 다음 적 공격 피해를 2 줄입니다.",
    effects: [
      { op: "damage_random", amount: 5, hits: 2 },
      { op: "reduce_next_attack", amount: 2 }
    ],
    upgradeEffects: [{ op: "damage_random", amount: 7, hits: 2 }],
    subject: "흩뿌려지는 복숭아 씨앗",
    mood: "묵직하고 산뜻함"
  }),
  card_peach_gift: card({
    id: "card_peach_lunchbox",
    name: "복숭아 도시락상자",
    type: "skill",
    rarity: "uncommon",
    cost: 2,
    tags: ["보상", "회복"],
    text: "이번 전투 후 카드 보상 선택지 +1. 체력이 80% 이하라면 체력 2를 회복합니다.",
    effects: [
      { op: "increase_next_card_reward_options", amount: 1 },
      { op: "heal_if_hp_ratio_below", ratio: 0.8, amount: 2 }
    ],
    upgradeEffects: [{ op: "increase_next_card_reward_options", amount: 2 }],
    subject: "분홍 끈으로 묶은 도시락상자",
    mood: "든든함"
  })
};

const jsonFiles = [
  "characters.json",
  "events.json",
  "achievements.json"
];

const textFiles = [
  path.join(rootDir, "tools", "phaser-smoke-test.mjs"),
  path.join(rootDir, "tools", "runtime-smoke-test.mjs")
];

const cardsPath = path.join(dataDir, "cards.json");
const cards = JSON.parse(await readFile(cardsPath, "utf8"));
let updatedCards = 0;
for (const cardRow of cards) {
  const override = overrides[cardRow.id];
  if (!override) continue;
  Object.assign(cardRow, override);
  updatedCards += 1;
}

if (updatedCards !== Object.keys(overrides).length) {
  throw new Error(`Expected ${Object.keys(overrides).length} curated cards, updated ${updatedCards}`);
}

assertUniqueIds(cards);
await writeFile(cardsPath, `${JSON.stringify(cards, null, 2)}\n`, "utf8");

for (const fileName of jsonFiles) {
  const filePath = path.join(dataDir, fileName);
  const value = replaceIds(JSON.parse(await readFile(filePath, "utf8")));
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

for (const filePath of textFiles) {
  let source = await readFile(filePath, "utf8");
  for (const [from, to] of idMap) {
    source = source.replaceAll(from, to);
  }
  await writeFile(filePath, source, "utf8");
}

console.log(`Curated release card batch: ${updatedCards} cards`);

function card({ upgradeEffects, subject, mood, ...row }) {
  return {
    ...row,
    illustration: { subject, mood },
    upgrade: {
      nameSuffix: "+",
      effects: upgradeEffects
    }
  };
}

function replaceIds(value) {
  if (typeof value === "string") return idMap.get(value) ?? value;
  if (Array.isArray(value)) return value.map(replaceIds);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, replaceIds(child)]));
}

function assertUniqueIds(rows) {
  const seen = new Set();
  for (const row of rows) {
    if (seen.has(row.id)) throw new Error(`Duplicate card id after curation: ${row.id}`);
    seen.add(row.id);
  }
}
