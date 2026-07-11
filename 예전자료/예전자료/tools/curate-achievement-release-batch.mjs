import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const achievementPath = path.join(rootDir, "src", "data", "ko", "achievements.json");

const achievementPlans = {
  ach_picnic_goal_001: {
    name: "책갈피 첫 줄",
    description: "카드 도감 12장을 해금해 첫 선택 폭을 넓힙니다.",
    trigger: { op: "collect_cards", amount: 12 },
    reward: { gold: 90 }
  },
  ach_picnic_goal_002: {
    name: "구름 손패 공방",
    description: "카드 도감 24장을 해금해 손패 설계의 기본 재료를 모읍니다.",
    trigger: { op: "collect_cards", amount: 24 },
    reward: { unlockCardId: "card_cloud_breeze" }
  },
  ach_picnic_goal_003: {
    name: "민트 색연필 더미",
    description: "카드 도감 36장을 해금해 공격과 방어 선택지를 함께 넓힙니다.",
    trigger: { op: "collect_cards", amount: 36 },
    reward: { unlockGemId: "gem_cloud_spark" }
  },
  ach_picnic_goal_004: {
    name: "복숭아 덱 지도",
    description: "카드 도감 48장을 해금해 여러 보상 풀을 안정적으로 잇습니다.",
    trigger: { op: "collect_cards", amount: 48 },
    reward: { unlockRelicId: "relic_bubble_lens" }
  },
  ach_picnic_goal_005: {
    name: "리본 카드 서가",
    description: "카드 도감 60장을 해금해 장기 성장 공방을 엽니다.",
    trigger: { op: "collect_cards", amount: 60 },
    reward: { metaUpgradeId: "meta_town_card_workshop" }
  },
  ach_picnic_goal_006: {
    name: "아침 도서관 열쇠",
    description: "카드 도감 72장을 해금해 새 캐릭터가 쓸 덱 기반을 마련합니다.",
    trigger: { op: "collect_cards", amount: 72 },
    reward: { unlockCharacterId: "char_lala" }
  },
  ach_picnic_goal_007: {
    name: "무지개 카드 색인",
    description: "카드 도감 100장을 해금해 후반 빌드의 기운 선택지를 엽니다.",
    trigger: { op: "collect_cards", amount: 100 },
    reward: { unlockArcanaId: "arcana_sprout_song" }
  },
  ach_picnic_goal_008: {
    name: "첫 보석 주머니",
    description: "보석 6종을 해금해 장착 빌드의 출발선을 만듭니다.",
    trigger: { op: "collect_gems", amount: 6 },
    reward: { gold: 96 }
  },
  ach_picnic_goal_009: {
    name: "복숭아 광택판",
    description: "보석 12종을 해금해 공격 보석과 방어 보석을 함께 운용합니다.",
    trigger: { op: "collect_gems", amount: 12 },
    reward: { unlockGemId: "gem_peach_spark" }
  },
  ach_picnic_goal_010: {
    name: "민트 세공 도구",
    description: "보석 18종을 해금해 카드와 보석의 역할을 맞춰 갑니다.",
    trigger: { op: "collect_gems", amount: 18 },
    reward: { unlockCardId: "card_mint_workshop" }
  },
  ach_picnic_goal_011: {
    name: "방울 홈 시험",
    description: "보석 24종을 해금해 소켓 보상과 유물 보상을 연결합니다.",
    trigger: { op: "collect_gems", amount: 24 },
    reward: { unlockRelicId: "relic_peach_coupon" }
  },
  ach_picnic_goal_012: {
    name: "작업대 추가 서랍",
    description: "보석 36종을 해금해 마을의 세공 기반을 넓힙니다.",
    trigger: { op: "collect_gems", amount: 36 },
    reward: { metaUpgradeId: "meta_town_gem_table" }
  },
  ach_picnic_goal_013: {
    name: "보석 지도 친구",
    description: "보석 48종을 해금해 새 캐릭터가 쓸 장착 노선을 엽니다.",
    trigger: { op: "collect_gems", amount: 48 },
    reward: { unlockCharacterId: "char_nuri" }
  },
  ach_picnic_goal_014: {
    name: "무지개 다리 세공",
    description: "보석 56종을 해금해 후반 기운 보상과 연결합니다.",
    trigger: { op: "collect_gems", amount: 56 },
    reward: { unlockArcanaId: "arcana_bubble_market" }
  },
  ach_picnic_goal_015: {
    name: "작은 유물 주머니",
    description: "유물 2종을 해금해 첫 장기 보너스를 확보합니다.",
    trigger: { op: "collect_relics", amount: 2 },
    reward: { gold: 100 }
  },
  ach_picnic_goal_016: {
    name: "리본 보관함 정리",
    description: "유물 5종을 해금해 덱 보상과 유물 보상을 함께 키웁니다.",
    trigger: { op: "collect_relics", amount: 5 },
    reward: { unlockCardId: "card_peach_lunchbox" }
  },
  ach_picnic_goal_017: {
    name: "프리즘 진열대",
    description: "유물 8종을 해금해 보석 빌드의 후반 재료를 엽니다.",
    trigger: { op: "collect_relics", amount: 8 },
    reward: { unlockGemId: "gem_prism_edge" }
  },
  ach_picnic_goal_018: {
    name: "낮잠 베개 기록",
    description: "유물 11종을 해금해 기운 보상과 휴식 보너스를 연결합니다.",
    trigger: { op: "collect_relics", amount: 11 },
    reward: { unlockArcanaId: "arcana_prism_path" }
  },
  ach_picnic_goal_019: {
    name: "마지막 소풍 보관증",
    description: "유물 14종을 해금해 마을 게시판의 장기 목표를 강화합니다.",
    trigger: { op: "collect_relics", amount: 14 },
    reward: { metaUpgradeId: "meta_town_picnic_board" }
  },
  ach_picnic_goal_020: {
    name: "기운 첫 책갈피",
    description: "기운 3종을 해금해 런 시작 보너스 선택지를 넓힙니다.",
    trigger: { op: "collect_arcanas", amount: 3 },
    reward: { gold: 105 }
  },
  ach_picnic_goal_021: {
    name: "별빵 기운 접시",
    description: "기운 5종을 해금해 유물과 기운 보상을 함께 굴립니다.",
    trigger: { op: "collect_arcanas", amount: 5 },
    reward: { unlockRelicId: "relic_star_button" }
  },
  ach_picnic_goal_022: {
    name: "구름 이불 필기",
    description: "기운 7종을 해금해 카드 보상과 기운 보상을 교차시킵니다.",
    trigger: { op: "collect_arcanas", amount: 7 },
    reward: { unlockCardId: "card_cloud_floatbox" }
  },
  ach_picnic_goal_023: {
    name: "새싹 노래 악보",
    description: "기운 9종을 해금해 보석 장착 빌드에 새 축을 더합니다.",
    trigger: { op: "collect_arcanas", amount: 9 },
    reward: { unlockGemId: "gem_rainbow_bridge" }
  },
  ach_picnic_goal_024: {
    name: "무지개 피날레 예고",
    description: "기운 11종을 해금해 후반 캐릭터 선택지를 넓힙니다.",
    trigger: { op: "collect_arcanas", amount: 11 },
    reward: { unlockCharacterId: "char_tori" }
  },
  ach_picnic_goal_025: {
    name: "여섯 고리 리듬",
    description: "한 전투에서 연쇄 6을 달성해 첫 콤보 보상을 받습니다.",
    trigger: { op: "reach_chain", amount: 6 },
    reward: { gold: 70 }
  },
  ach_picnic_goal_026: {
    name: "여덟 고리 반짝",
    description: "한 전투에서 연쇄 8을 달성해 반짝 보석 보상을 엽니다.",
    trigger: { op: "reach_chain", amount: 8 },
    reward: { unlockGemId: "gem_mint_spark" }
  },
  ach_picnic_goal_027: {
    name: "열두 고리 소나기",
    description: "한 전투에서 연쇄 12를 달성해 연속 카드 보상을 엽니다.",
    trigger: { op: "reach_chain", amount: 12 },
    reward: { unlockCardId: "card_lavender_wave" }
  },
  ach_picnic_goal_028: {
    name: "열여덟 고리 도장",
    description: "한 전투에서 연쇄 18을 달성해 프리즘 유물 보상을 엽니다.",
    trigger: { op: "reach_chain", amount: 18 },
    reward: { unlockRelicId: "relic_prism_stamp" }
  },
  ach_picnic_goal_029: {
    name: "스물둘 고리 불꽃",
    description: "한 전투에서 연쇄 22를 달성해 리본 기운 보상을 엽니다.",
    trigger: { op: "reach_chain", amount: 22 },
    reward: { unlockArcanaId: "arcana_ribbon_firework" }
  },
  ach_picnic_goal_030: {
    name: "스물여덟 고리 초대장",
    description: "한 전투에서 연쇄 28을 달성해 새 캐릭터 보상을 엽니다.",
    trigger: { op: "reach_chain", amount: 28 },
    reward: { unlockCharacterId: "char_harang" }
  },
  ach_picnic_goal_031: {
    name: "서른둘 고리 저금통",
    description: "한 전투에서 연쇄 32를 달성해 마을 장기 보상을 강화합니다.",
    trigger: { op: "reach_chain", amount: 32 },
    reward: { metaUpgradeId: "meta_town_candy_bank" }
  }
};

const achievements = JSON.parse(await readFile(achievementPath, "utf8"));
const missing = Object.keys(achievementPlans).filter((id) => !achievements.some((achievement) => achievement.id === id));
if (missing.length > 0) {
  throw new Error(`Missing achievement ids: ${missing.join(", ")}`);
}

const curated = achievements.map((achievement) => {
  const plan = achievementPlans[achievement.id];
  return plan ? { ...achievement, ...plan } : achievement;
});

await writeFile(achievementPath, `${JSON.stringify(curated, null, 2)}\n`, "utf8");
console.log(`Curated release achievement batch: ${Object.keys(achievementPlans).length} achievements`);
