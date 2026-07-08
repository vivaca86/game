import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(rootDir, "src", "data", "ko");

const filePath = (fileName) => path.join(dataDir, fileName);
const readJson = async (fileName) => JSON.parse(await readFile(filePath(fileName), "utf8"));
const writeJson = async (fileName, data) => writeFile(filePath(fileName), `${JSON.stringify(data, null, 2)}\n`, "utf8");

const cards = await readJson("cards.json");
const existingGems = await readJson("gems.json");
const existingRelics = await readJson("relics.json");
const existingArcanas = await readJson("arcanas.json");

const playableCards = cards.filter((card) => !["curse", "temp"].includes(card.type));
const attackCards = playableCards.filter((card) => card.type === "attack");
const guardCards = playableCards.filter((card) => card.type === "guard");
const skillCards = playableCards.filter((card) => card.type === "skill");

function takeCard(list, index) {
  return list[index % list.length].id;
}

function uniqueById(rows, label) {
  const ids = new Set();
  rows.forEach((row) => {
    if (ids.has(row.id)) throw new Error(`${label} 중복 id: ${row.id}`);
    ids.add(row.id);
  });
  return rows;
}

function preserveRows(existingRows, ids) {
  const byId = new Map(existingRows.map((row) => [row.id, row]));
  return ids.map((id) => {
    const row = byId.get(id);
    if (!row) throw new Error(`보존할 데이터가 없습니다: ${id}`);
    return row;
  });
}

const stageBlueprints = [
  ["sunny_gate", "햇살 현관", "아이보리 성문", "bright_gate"],
  ["lavender_hall", "라벤더 복도", "보랏빛 장난감 회랑", "lavender_hall"],
  ["mint_garden", "민트 정원", "상쾌한 온실 미로", "mint_garden"],
  ["peach_canal", "복숭아 운하", "분홍빛 물길", "peach_canal"],
  ["cloud_rooftop", "구름 지붕길", "하늘색 기와 지붕", "cloud_rooftop"],
  ["ribbon_station", "리본 정거장", "리본 기차 승강장", "ribbon_station"],
  ["candy_cavern", "별사탕 동굴", "반짝이는 설탕 동굴", "candy_cavern"],
  ["prism_school", "프리즘 교실", "무지개 유리 교실", "prism_school"],
  ["moon_attic", "달빛 다락", "졸린 장난감 다락", "moon_attic"],
  ["sprout_fort", "새싹 요새", "초록 잎사귀 성벽", "sprout_fort"],
  ["bubble_port", "방울 항구", "비눗방울 부두", "bubble_port"],
  ["plush_theater", "말랑 극장", "봉제 인형 무대", "plush_theater"],
  ["morning_observatory", "아침 관측소", "햇살 망원경 탑", "morning_observatory"],
  ["dream_arcade", "꿈빛 오락실", "파스텔 놀이기계 거리", "dream_arcade"],
  ["rainbow_keep", "무지개 성채", "일곱 빛깔 마지막 성", "rainbow_keep"]
];

const enemyFamilies = [
  ["cloud", "구름", "몽실"],
  ["paper", "부적", "종이"],
  ["sprout", "새싹", "초록"],
  ["lantern", "등불", "반짝"],
  ["candy", "별사탕", "달콤"],
  ["ribbon", "리본", "빙글"],
  ["bubble", "방울", "통통"],
  ["plush", "말랑", "푹신"],
  ["prism", "프리즘", "무지개"],
  ["moon", "달빛", "졸린"],
  ["peach", "복숭아", "분홍"],
  ["toy", "장난감", "딸깍"],
  ["leaf", "잎사귀", "살랑"],
  ["star", "별빛", "반짝"],
  ["cookie", "쿠키", "바삭"]
];

const normalEnemies = enemyFamilies.flatMap(([slug, family, prefix], stageIndex) => [
  {
    id: `enemy_${slug}_buddy`,
    name: `${prefix} ${family} 친구`,
    rank: "normal",
    family,
    maxHp: 22 + stageIndex * 5,
    block: stageIndex % 3,
    intents: [
      { type: "attack", amount: 5 + stageIndex, label: "장난 공격" },
      { type: "guard", amount: 4 + Math.floor(stageIndex / 2), label: "동글 방어" }
    ],
    rewards: { gold: [8 + stageIndex * 2, 13 + stageIndex * 2], xp: 3 + stageIndex }
  },
  {
    id: `enemy_${slug}_trick`,
    name: `${prefix} ${family} 장난꾼`,
    rank: "normal",
    family,
    maxHp: 28 + stageIndex * 6,
    block: 1 + (stageIndex % 4),
    intents: [
      { type: "attack", amount: 4 + stageIndex, label: "폴짝 치기" },
      { type: "debuff", status: stageIndex % 2 === 0 ? "mark" : "weak", amount: 1, label: "장난 표식" }
    ],
    rewards: { gold: [10 + stageIndex * 2, 15 + stageIndex * 2], xp: 4 + stageIndex }
  }
]);

const elites = enemyFamilies.slice(0, 15).map(([slug, family, prefix], index) => ({
  id: `enemy_${slug}_elite`,
  name: `${prefix} ${family} 대장`,
  rank: "elite",
  family,
  maxHp: 68 + index * 12,
  block: 5 + index,
  intents: [
    { type: "attack", amount: 10 + index, label: "커다란 장난" },
    { type: "guard", amount: 9 + index, label: "대장 방어" },
    { type: "special", effect: index % 2 === 0 ? "add_temp_card" : "reduce_energy", amount: 1, label: "특별 장난" }
  ],
  rewards: { gold: [28 + index * 5, 38 + index * 5], xp: 11 + index * 2, relicChance: 0.35 }
}));

const bosses = stageBlueprints.map(([slug, name], index) => ({
  id: `boss_${slug}`,
  name: `${name} 왕방울`,
  rank: "boss",
  family: "왕방울",
  maxHp: 140 + index * 34,
  block: 10 + index * 2,
  phaseRules: [
    { hpBelowRatio: 0.5, addIntent: { type: "special", effect: "summon", enemyId: normalEnemies[index * 2].id, label: "친구 부르기" } }
  ],
  intents: [
    { type: "attack", amount: 14 + index * 2, label: "왕방울 쿵" },
    { type: "guard", amount: 12 + index * 2, label: "동그란 잠금" },
    { type: "special", effect: "add_temp_card", cardId: "card_temp_dust", amount: 1, label: "장난 카드" }
  ],
  rewards: { gold: [70 + index * 10, 90 + index * 12], xp: 25 + index * 4, relicChance: 1 }
}));

const enemies = uniqueById([...normalEnemies, ...elites, ...bosses], "enemies");

const stages = stageBlueprints.map(([slug, name, biome, backgroundKey], index) => {
  const normalStart = (index * 2) % normalEnemies.length;
  const elite = elites[index % elites.length];
  return {
    id: `stage_${slug}`,
    name,
    order: index + 1,
    biome,
    floorCount: 6 + Math.floor(index / 2),
    backgroundKey,
    enemyPool: [
      normalEnemies[normalStart].id,
      normalEnemies[(normalStart + 1) % normalEnemies.length].id,
      normalEnemies[(normalStart + 6) % normalEnemies.length].id
    ],
    elitePool: [elite.id],
    bossEnemyId: `boss_${slug}`,
    rooms: index < 5
      ? ["combat", "combat", "event", "elite", "reward", "boss"]
      : ["combat", "event", "combat", "shop", "elite", "event", "reward", "boss"],
    clearRewards: {
      gold: 60 + index * 15,
      unlockStageId: index + 1 < stageBlueprints.length ? `stage_${stageBlueprints[index + 1][0]}` : null
    },
    unlock: index === 0 ? { type: "starter" } : { type: "stage_clear", stageId: `stage_${stageBlueprints[index - 1][0]}` }
  };
});

const seedGemIds = [
  "gem_coral_edge",
  "gem_mint_breeze",
  "gem_lavender_echo",
  "gem_sky_discount",
  "gem_peach_splash",
  "gem_star_chain"
];
const seedGemIdSet = new Set(seedGemIds);

const gemFamilies = [
  ["morning", "아침", "yellow"],
  ["cloud", "구름", "sky"],
  ["mint", "민트", "mint"],
  ["peach", "복숭아", "peach"],
  ["lavender", "라벤더", "lavender"],
  ["bubble", "방울", "sky"],
  ["ribbon", "리본", "lavender"],
  ["candy", "별사탕", "yellow"],
  ["sprout", "새싹", "mint"],
  ["plush", "말랑", "peach"],
  ["prism", "프리즘", "lavender"],
  ["moon", "달빛", "sky"],
  ["rainbow", "무지개", "yellow"]
];

const gemTemplates = [
  {
    suffix: "edge",
    name: "칼날석",
    rarity: "common",
    socketTypes: ["attack"],
    text: (family, n) => `장착한 카드의 피해 +${n}%.`,
    effects: (n) => [{ op: "modify_damage_percent", amount: n }]
  },
  {
    suffix: "guard",
    name: "방석석",
    rarity: "common",
    socketTypes: ["guard"],
    text: (family, n) => `장착한 카드의 보호막 +${n}%.`,
    effects: (n) => [{ op: "modify_shield_percent", amount: n }]
  },
  {
    suffix: "spark",
    name: "반짝석",
    rarity: "uncommon",
    socketTypes: ["skill", "attack", "guard"],
    text: (family, n) => `장착한 카드를 사용하면 표식 ${Math.max(1, Math.floor(n / 10))}을 줍니다.`,
    effects: (n) => [{ op: "apply_mark_on_play", amount: Math.max(1, Math.floor(n / 10)) }]
  },
  {
    suffix: "echo",
    name: "메아리석",
    rarity: "rare",
    socketTypes: ["attack", "skill", "guard"],
    text: (family, n) => `장착한 카드의 기본 효과가 ${n}% 위력으로 한 번 더 발동합니다.`,
    effects: (n) => [{ op: "echo_basic_effect", ratio: n / 100 }]
  }
];

const generatedGems = gemFamilies.flatMap(([slug, label], familyIndex) =>
  gemTemplates.map((template, templateIndex) => {
    const amount = template.suffix === "echo" ? 25 + (familyIndex % 4) * 5 : 15 + familyIndex + templateIndex * 4;
    const unlockIndex = familyIndex + templateIndex;
    return {
      id: `gem_${slug}_${template.suffix}`,
      name: `${label} ${template.name}`,
      rarity: template.rarity,
      socketTypes: template.socketTypes,
      text: template.text(label, amount),
      effects: template.effects(amount),
      unlock: unlockIndex < 3
        ? { type: "starter_pool" }
        : { type: "stage_clear", stageId: stages[unlockIndex % stages.length].id }
    };
  })
).filter((gem) => !seedGemIdSet.has(gem.id));
const specialGems = [
  {
    id: "gem_rainbow_bridge",
    name: "무지개 다리석",
    rarity: "legendary",
    socketTypes: ["attack", "skill", "guard"],
    text: "장착한 카드는 사용 후 다음 카드의 색 보너스를 한 번 대신 이어줍니다.",
    effects: [{ op: "bridge_next_color_bonus", amount: 1 }],
    unlock: { type: "stage_clear", stageId: "stage_rainbow_keep" }
  }
];
const gems = uniqueById([...preserveRows(existingGems, seedGemIds), ...generatedGems, ...specialGems], "gems").slice(0, 58);

const seedRelicIds = [
  "relic_round_lantern",
  "relic_candy_pouch",
  "relic_soft_compass",
  "relic_ribbon_box",
  "relic_sun_cookie"
];

const relicAdditions = [
  ["relic_mint_thermos", "민트 보온병", "전투 후 체력 4 회복.", [{ op: "heal_after_combat", amount: 4 }], "combat"],
  ["relic_cloud_socks", "구름 양말", "전투 시작 시 기운 1을 추가로 얻습니다.", [{ op: "start_with_energy", amount: 1 }], "combat"],
  ["relic_bubble_lens", "방울 확대경", "보석 보상 선택지가 1개 늘어납니다.", [{ op: "increase_gem_reward_options", amount: 1 }], "reward"],
  ["relic_peach_coupon", "복숭아 쿠폰", "상점 가격이 15% 감소합니다.", [{ op: "reduce_shop_prices_percent", amount: 15 }], "shop"],
  ["relic_star_button", "별 단추", "보상 다시 보기 1회가 무료입니다.", [{ op: "reroll_reward_free", amount: 1 }], "reward"],
  ["relic_prism_stamp", "프리즘 도장", "첫 카드 보상은 강화된 카드로 등장합니다.", [{ op: "upgrade_first_card_reward", amount: 1 }], "reward"],
  ["relic_sleepy_pillow", "졸린 베개", "턴 종료 시 손패 1장을 보존할 수 있습니다.", [{ op: "retain_one_card", amount: 1 }], "combat"],
  ["relic_elite_sticker", "대장 스티커", "정예 처치 후 카드 보상 1개를 추가합니다.", [{ op: "add_card_after_elite", amount: 1 }], "elite"],
  ["relic_clean_plate", "반짝 접시", "피해 없이 전투를 끝내면 별사탕 20을 얻습니다.", [{ op: "gain_gold_on_perfect", amount: 20 }], "reward"],
  ["relic_rainbow_knot", "무지개 매듭", "전투마다 한 번 연쇄가 끊기지 않습니다.", [{ op: "preserve_chain_once", amount: 1 }], "combat"],
  ["relic_final_picnic", "마지막 소풍 깃발", "보스 보상이 1개 늘어납니다.", [{ op: "boss_reward_bonus", amount: 1 }], "boss"]
].map(([id, name, text, effects, pool], index) => ({
  id,
  name,
  rarity: index < 4 ? "common" : index < 8 ? "rare" : "legendary",
  text,
  effects,
  pool,
  unlock: index < 2 ? { type: "starter_pool" } : { type: "stage_clear", stageId: stages[(index + 2) % stages.length].id }
}));
const relics = uniqueById([...preserveRows(existingRelics, seedRelicIds), ...relicAdditions], "relics");

const seedArcanaIds = [
  "arcana_picnic_rhythm",
  "arcana_bubble_luck",
  "arcana_cloud_parade",
  "arcana_ribbon_firework"
];

const arcanaAdditions = [
  ["arcana_peach_boom", "복숭아 팡파르", "공격 카드로 적을 쓰러뜨리면 모든 적에게 피해 4.", [{ op: "damage_all_on_attack_kill", amount: 4 }]],
  ["arcana_mint_rest", "민트 낮잠", "방어 카드를 3장 낼 때마다 체력 3 회복.", [{ op: "heal_when_guard_played_count", threshold: 3, amount: 3 }]],
  ["arcana_star_bakery", "별빵 굽기", "0비용 카드를 낼 때마다 별사탕 2를 얻습니다.", [{ op: "gain_gold_on_zero_cost_play", amount: 2 }]],
  ["arcana_prism_path", "프리즘 산책길", "서로 다른 색 카드 4장을 내면 카드 2장을 뽑습니다.", [{ op: "draw_on_four_colors", amount: 2 }]],
  ["arcana_cloud_blanket", "구름 이불", "턴 시작 시 이전 턴에 남은 보호막의 30%를 회복합니다.", [{ op: "carry_shield_percent", amount: 30 }]],
  ["arcana_bubble_market", "방울 장터", "상점과 이벤트의 보석 가격이 20% 감소합니다.", [{ op: "reduce_gem_cost_percent", amount: 20 }]],
  ["arcana_sprout_song", "새싹 노래", "회복 효과가 발생하면 가장 앞의 적에게 표식 1.", [{ op: "mark_front_on_heal", amount: 1 }]],
  ["arcana_rainbow_finale", "무지개 피날레", "한 턴에 카드 7장을 내면 모든 카드 비용이 이번 턴 1 감소합니다.", [{ op: "discount_hand_when_cards_played", threshold: 7, amount: 1 }]]
].map(([id, name, text, effects], index) => ({
  id,
  name,
  rarity: index < 4 ? "rare" : "legendary",
  text,
  effects,
  unlock: { type: "stage_clear", stageId: stages[(index + 4) % stages.length].id }
}));
const arcanas = uniqueById([...preserveRows(existingArcanas, seedArcanaIds), ...arcanaAdditions], "arcanas");

const characterBlueprints = [
  ["haru", "하루", "햇살 탐험가", "coral"],
  ["moru", "모루", "구름 수호자", "sky"],
  ["riri", "리리", "리본 마술사", "lavender"],
  ["bomi", "보미", "새싹 기사", "mint"],
  ["naru", "나루", "방울 항해사", "sky"],
  ["koko", "코코", "별사탕 요리사", "yellow"],
  ["mimi", "미미", "복숭아 무용수", "peach"],
  ["duri", "두리", "말랑 기사", "peach"],
  ["ara", "아라", "프리즘 연구원", "lavender"],
  ["sora", "소라", "하늘 우체부", "sky"],
  ["pio", "피오", "민트 정원사", "mint"],
  ["lala", "라라", "노래 장난꾼", "yellow"],
  ["nuri", "누리", "무지개 안내원", "lavender"],
  ["danbi", "단비", "구름 화가", "sky"],
  ["yuna", "유나", "달빛 다락지기", "sky"],
  ["ruru", "루루", "리본 재단사", "lavender"],
  ["eden", "이든", "새싹 도서관장", "mint"],
  ["sena", "세나", "별빛 점원", "yellow"],
  ["tori", "토리", "장난감 정비사", "peach"],
  ["harang", "하랑", "아침 관측자", "yellow"],
  ["raon", "라온", "웃음 단장", "coral"],
  ["dasom", "다솜", "소풍 기록가", "mint"],
  ["byeori", "별이", "무지개 지휘자", "lavender"]
];

const passiveTemplates = [
  ["first_attack_damage_bonus_each_battle", "전투마다 처음 쓰는 공격 카드의 피해 +{n}.", "amount"],
  ["shield_at_battle_start", "전투 시작 시 보호막 {n}.", "amount"],
  ["draw_when_cards_played", "한 턴에 카드 {t}장을 내면 카드 1장을 뽑습니다.", "threshold"],
  ["heal_once_when_hp_ratio_below", "체력이 처음 절반 이하가 되면 체력 {n} 회복.", "amount"],
  ["gain_energy_on_chain", "연쇄 {t}을 달성하면 기운 1을 얻습니다.", "threshold"],
  ["bonus_gold_after_elite", "정예 전투 승리 후 별사탕 {n} 추가.", "amount"]
];

const characters = characterBlueprints.map(([slug, name, role, color], index) => {
  const passive = passiveTemplates[index % passiveTemplates.length];
  const amount = 3 + (index % 5);
  const threshold = 4 + (index % 4);
  return {
    id: `char_${slug}`,
    name,
    role,
    color,
    maxHp: 64 + (index % 6) * 4 + Math.floor(index / 6) * 6,
    energy: 3,
    starterDeck: [
      takeCard(attackCards, index),
      takeCard(attackCards, index + 5),
      takeCard(guardCards, index),
      takeCard(skillCards, index),
      takeCard(skillCards, index + 7)
    ],
    passiveText: passive[1].replace("{n}", String(amount)).replace("{t}", String(threshold)),
    passiveEffects: [
      passive[2] === "threshold"
        ? { op: passive[0], threshold, amount: 1 }
        : { op: passive[0], amount, ratio: passive[0].includes("hp_ratio") ? 0.5 : undefined }
    ].map((effect) => Object.fromEntries(Object.entries(effect).filter(([, value]) => value !== undefined))),
    unlock: index < 2
      ? { type: "starter" }
      : index < 15
        ? { type: "stage_clear", stageId: stages[(index - 2) % stages.length].id }
        : { type: "achievement", achievementId: `ach_character_${String(index + 1).padStart(2, "0")}` }
  };
});

const eventBlueprints = [
  ["bubble_shop", "방울 상점", "shop", "투명한 방울 안에 보석과 카드가 둥둥 떠 있습니다."],
  ["ribbon_fountain", "리본 분수", "choice", "분수에서 알록달록한 리본 물줄기가 솟아납니다."],
  ["sleeping_gate", "졸린 문", "choice", "커다란 문이 꾸벅꾸벅 졸고 있습니다."],
  ["gem_bench", "보석 작업대", "station", "작은 작업대가 카드의 빈 소켓을 반짝이게 합니다."],
  ["peach_mailbox", "복숭아 우체통", "choice", "향긋한 우체통에 누군가의 초대장이 꽂혀 있습니다."],
  ["cloud_picnic", "구름 소풍자리", "rest", "폭신한 돗자리와 따뜻한 간식이 놓여 있습니다."],
  ["star_lottery", "별사탕 추첨기", "choice", "손잡이를 돌리면 작은 별들이 굴러갑니다."],
  ["prism_class", "프리즘 수업", "station", "칠판 위에 카드 색을 바꾸는 공식이 적혀 있습니다."],
  ["plush_lost_child", "길 잃은 인형", "choice", "작은 봉제 인형이 길을 잃고 울먹입니다."],
  ["rainbow_gate", "무지개 회전문", "choice", "일곱 빛깔 문이 다음 방을 살짝 바꿔 줍니다."]
];

const events = eventBlueprints.map(([slug, name, type, text], index) => ({
  id: `event_${slug}`,
  name,
  type,
  text,
  choices: [
    {
      label: index % 2 === 0 ? "카드를 고른다" : "카드를 강화한다",
      cost: index % 2 === 0 ? { gold: 25 + index * 5 } : { hp: 4 + index },
      reward: index % 2 === 0
        ? { cardPool: [takeCard(playableCards, index * 3), takeCard(playableCards, index * 3 + 1)] }
        : { upgradeRandomCard: 1 }
    },
    {
      label: index % 3 === 0 ? "보석을 살펴본다" : "유물을 살펴본다",
      cost: { gold: 35 + index * 4 },
      reward: index % 3 === 0
        ? { gemPool: [gems[index % gems.length].id, gems[(index + 7) % gems.length].id] }
        : { relicPool: [relics[index % relics.length].id] }
    },
    {
      label: "장난을 받아준다",
      reward: index % 2 === 0
        ? { combat: normalEnemies[index % normalEnemies.length].id, gold: 20 + index * 3 }
        : { heal: 8 + index, openGemSocket: index % 4 === 0 }
    }
  ],
  unlock: index < 2 ? { type: "starter_pool" } : { type: "stage_clear", stageId: stages[(index - 2) % stages.length].id }
}));

function rewardForIndex(index) {
  if (index % 9 === 0) return { unlockCardId: takeCard(playableCards, index) };
  if (index % 9 === 1) return { unlockGemId: gems[index % gems.length].id };
  if (index % 9 === 2) return { unlockArcanaId: arcanas[index % arcanas.length].id };
  if (index % 9 === 3) return { unlockCharacterId: characters[index % characters.length].id };
  if (index % 9 === 4) return { metaUpgradeId: ["meta_town_candy_bank", "meta_town_card_workshop", "meta_town_gem_table", "meta_town_picnic_board"][index % 4] };
  return { gold: 30 + index * 3 };
}

const preservedAchievements = [
  {
    id: "ach_first_win",
    name: "첫 소풍 완료",
    description: "햇살 현관을 처음으로 클리어합니다.",
    trigger: { op: "clear_stage", stageId: "stage_sunny_gate" },
    reward: { gold: 50 }
  },
  {
    id: "ach_first_elite",
    name: "반짝 강적",
    description: "정예 몬스터를 처음으로 물리칩니다.",
    trigger: { op: "defeat_rank", rank: "elite" },
    reward: { unlockCardId: "card_star_candy" }
  },
  {
    id: "ach_chain_ten",
    name: "리본 열 고리",
    description: "한 전투에서 연쇄 10을 달성합니다.",
    trigger: { op: "reach_chain", amount: 10 },
    reward: { unlockGemId: "gem_star_chain", unlockArcanaId: "arcana_ribbon_firework" }
  }
];

const achievementRows = [...preservedAchievements];
function addAchievement(row) {
  if (!achievementRows.some((achievement) => achievement.id === row.id)) achievementRows.push(row);
}

stages.forEach((stage, index) => {
  addAchievement({
    id: `ach_clear_stage_${String(index + 1).padStart(2, "0")}`,
    name: `${stage.name} 산책`,
    description: `${stage.name}을 클리어합니다.`,
    trigger: { op: "clear_stage", stageId: stage.id },
    reward: rewardForIndex(index)
  });
  addAchievement({
    id: `ach_boss_${String(index + 1).padStart(2, "0")}`,
    name: `${bosses[index].name} 안녕`,
    description: `${bosses[index].name}을 물리칩니다.`,
    trigger: { op: "defeat_enemy", enemyId: bosses[index].id },
    reward: rewardForIndex(index + 15)
  });
});

characters.forEach((character, index) => {
  addAchievement({
    id: `ach_character_${String(index + 1).padStart(2, "0")}`,
    name: `${character.name}와 인사`,
    description: `${character.name} 캐릭터를 해금합니다.`,
    trigger: { op: "unlock_character", characterId: character.id },
    reward: rewardForIndex(index + 30)
  });
});

[
  ["cards", "카드", "collect_cards", [10, 20, 30, 40, 50, 65, 80, 95, 113]],
  ["gems", "보석", "collect_gems", [5, 10, 15, 20, 30, 40, 50, 58]],
  ["relics", "유물", "collect_relics", [3, 6, 9, 12, 16]],
  ["arcanas", "기운", "collect_arcanas", [2, 4, 6, 8, 10, 12]]
].forEach(([slug, label, op, milestones]) => {
  milestones.forEach((amount, milestoneIndex) => {
    addAchievement({
      id: `ach_collect_${slug}_${String(amount).padStart(3, "0")}`,
      name: `${label} ${amount}개 수집`,
      description: `${label} 도감 ${amount}개를 채웁니다.`,
      trigger: { op, amount },
      reward: rewardForIndex(amount + milestoneIndex)
    });
  });
});

events.forEach((event, index) => {
  addAchievement({
    id: `ach_event_${String(index + 1).padStart(2, "0")}`,
    name: `${event.name} 방문`,
    description: `${event.name} 이벤트를 해결합니다.`,
    trigger: { op: "complete_event", eventId: event.id },
    reward: rewardForIndex(index + 70)
  });
});

normalEnemies.slice(0, 30).forEach((enemy, index) => {
  addAchievement({
    id: `ach_enemy_${String(index + 1).padStart(2, "0")}`,
    name: `${enemy.name} 장난 끝`,
    description: `${enemy.name}을 누적 ${5 + index}번 물리칩니다.`,
    trigger: { op: "defeat_enemy_count", enemyId: enemy.id, amount: 5 + index },
    reward: rewardForIndex(index + 90)
  });
});

[
  [5, "가벼운 연쇄"],
  [10, "리본 연쇄"],
  [15, "반짝 연쇄"],
  [20, "무지개 연쇄"],
  [25, "소풍 연쇄"],
  [30, "피날레 연쇄"]
].forEach(([amount, name], index) => {
  addAchievement({
    id: `ach_chain_${String(amount).padStart(2, "0")}`,
    name,
    description: `한 전투에서 연쇄 ${amount}을 달성합니다.`,
    trigger: { op: "reach_chain", amount },
    reward: rewardForIndex(index + 130)
  });
});

let fillerIndex = 1;
while (achievementRows.length < 161) {
  const stage = stages[fillerIndex % stages.length];
  addAchievement({
    id: `ach_picnic_goal_${String(fillerIndex).padStart(3, "0")}`,
    name: `소풍 목표 ${fillerIndex}`,
    description: `${stage.name}에서 방 ${3 + (fillerIndex % 6)}개를 정리합니다.`,
    trigger: { op: "clear_rooms_in_stage", stageId: stage.id, amount: 3 + (fillerIndex % 6) },
    reward: rewardForIndex(fillerIndex + 140)
  });
  fillerIndex += 1;
}
const achievements = uniqueById(achievementRows.slice(0, 161), "achievements");

const contentTargets = await readJson("content-targets.json");
contentTargets.currentCounts = {
  cards: cards.length,
  gems: gems.length,
  characters: characters.length,
  stages: stages.length,
  relics: relics.length,
  arcanas: arcanas.length,
  events: events.length,
  achievements: achievements.length
};
contentTargets.supportingCounts = {
  enemies: enemies.length
};

await writeJson("enemies.json", enemies);
await writeJson("stages.json", stages);
await writeJson("gems.json", gems);
await writeJson("relics.json", relics);
await writeJson("arcanas.json", arcanas);
await writeJson("characters.json", characters);
await writeJson("events.json", events);
await writeJson("achievements.json", achievements);
await writeJson("content-targets.json", contentTargets);

console.log("풀 콘텐츠 데이터 생성 완료");
console.log(`보석 ${gems.length}, 캐릭터 ${characters.length}, 스테이지 ${stages.length}, 유물 ${relics.length}, 기운 ${arcanas.length}, 이벤트 ${events.length}, 업적 ${achievements.length}, 지원 몬스터 ${enemies.length}`);
