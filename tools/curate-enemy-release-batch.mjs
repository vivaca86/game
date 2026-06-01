import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const enemyPath = path.join(rootDir, "src", "data", "ko", "enemies.json");

const overrides = {
  enemy_cloud_buddy: {
    intents: [
      { type: "attack", amount: 5, label: "솜털 박치기" },
      { type: "special", effect: "fortify_all", amount: 3, label: "몽실 숨기" },
      { type: "guard", amount: 4, label: "구름 폭신막" }
    ]
  },
  enemy_paper_buddy: {
    intents: [
      { type: "attack", amount: 6, label: "접힌 모서리" },
      { type: "debuff", status: "mark", amount: 1, label: "부적 표식" },
      { type: "guard", amount: 4, label: "종이 겹막" }
    ]
  },
  enemy_sprout_buddy: {
    intents: [
      { type: "attack", amount: 7, label: "새싹 찌르기" },
      { type: "special", effect: "heal_self", amount: 5, label: "새싹 돋기" },
      { type: "guard", amount: 5, label: "잎사귀 가림" }
    ]
  },
  enemy_lantern_buddy: {
    intents: [
      { type: "debuff", status: "mark", amount: 1, label: "반짝 표식" },
      { type: "attack", amount: 8, label: "등불 톡" },
      { type: "guard", amount: 5, label: "빛막 두르기" }
    ]
  },
  enemy_candy_buddy: {
    intents: [
      { type: "attack", amount: 9, label: "사탕 튕기기" },
      { type: "special", effect: "reduce_energy", amount: 1, label: "달콤한 현기증" },
      { type: "guard", amount: 6, label: "설탕막" }
    ]
  },
  enemy_ribbon_buddy: {
    intents: [
      { type: "special", effect: "chain_down", amount: 2, costIncrease: 1, label: "리본 헝클기" },
      { type: "attack", amount: 10, label: "리본 찰싹" },
      { type: "guard", amount: 6, label: "매듭 방어" }
    ]
  },
  enemy_bubble_buddy: {
    intents: [
      { type: "attack", amount: 11, label: "방울 튀기기" },
      { type: "special", effect: "add_temp_card", cardId: "card_temp_dust", amount: 1, label: "방울 먼지" },
      { type: "guard", amount: 7, label: "비눗방울막" }
    ]
  },
  enemy_plush_buddy: {
    intents: [
      { type: "guard", amount: 7, label: "말랑 쿠션" },
      { type: "special", effect: "fortify_all", amount: 4, label: "푹신 숨기" },
      { type: "attack", amount: 12, label: "말랑 박치기" }
    ]
  },
  enemy_cloud_trick: {
    intents: [
      { type: "debuff", status: "mark", amount: 1, label: "안개 표식" },
      { type: "attack", amount: 4, label: "구름 콕" },
      { type: "special", effect: "fortify_all", amount: 2, label: "장난 숨기" }
    ]
  },
  enemy_paper_trick: {
    intents: [
      { type: "attack", amount: 5, label: "부적 튕기기" },
      { type: "debuff", status: "weak", amount: 1, label: "종이 흔들기" },
      { type: "special", effect: "add_temp_card", cardId: "card_temp_dust", amount: 1, label: "접힌 먼지" }
    ]
  },
  enemy_sprout_trick: {
    intents: [
      { type: "special", effect: "heal_self", amount: 6, label: "몰래 돋기" },
      { type: "attack", amount: 6, label: "덩굴 콕" },
      { type: "debuff", status: "mark", amount: 1, label: "잎맥 표식" }
    ]
  },
  enemy_lantern_trick: {
    intents: [
      { type: "attack", amount: 7, label: "등불 깜빡" },
      { type: "special", effect: "pierce_attack", amount: 4, label: "빛살 관통" },
      { type: "debuff", status: "weak", amount: 1, label: "눈부심" }
    ]
  },
  enemy_candy_trick: {
    intents: [
      { type: "special", effect: "reduce_energy", amount: 1, label: "설탕 현기증" },
      { type: "debuff", status: "mark", amount: 1, label: "반짝 조준" },
      { type: "attack", amount: 8, label: "별사탕 툭" }
    ]
  },
  enemy_ribbon_trick: {
    intents: [
      { type: "attack", amount: 9, label: "리본 튕김" },
      { type: "special", effect: "chain_down", amount: 2, costIncrease: 1, label: "매듭 꼬기" },
      { type: "debuff", status: "weak", amount: 1, label: "헝클 약화" }
    ]
  },
  enemy_bubble_trick: {
    intents: [
      { type: "special", effect: "add_temp_card", cardId: "card_temp_dust", amount: 1, label: "거품 먼지" },
      { type: "attack", amount: 10, label: "방울 펑" },
      { type: "debuff", status: "mark", amount: 1, label: "물방울 표식" }
    ]
  },
  enemy_plush_trick: {
    intents: [
      { type: "debuff", status: "weak", amount: 1, label: "폭신 압박" },
      { type: "special", effect: "fortify_all", amount: 5, label: "말랑 버티기" },
      { type: "attack", amount: 11, label: "쿠션 밀기" }
    ]
  },
  enemy_cloud_elite: {
    intents: [
      { type: "attack", amount: 10, label: "구름 대장 박치기" },
      { type: "guard", amount: 9, label: "넓은 구름막" },
      { type: "special", effect: "fortify_all", amount: 6, label: "대장 은폐" },
      { type: "debuff", status: "mark", amount: 1, label: "안개 조준" }
    ]
  },
  enemy_paper_elite: {
    intents: [
      { type: "attack", amount: 11, label: "부적 대장 일격" },
      { type: "special", effect: "reduce_energy", amount: 1, label: "부적 압박" },
      { type: "guard", amount: 10, label: "겹부적 방어" }
    ]
  },
  enemy_sprout_elite: {
    intents: [
      { type: "special", effect: "heal_self", amount: 9, label: "대장 새싹 회복" },
      { type: "attack", amount: 12, label: "굵은 덩굴" },
      { type: "guard", amount: 11, label: "잎사귀 성벽" }
    ]
  },
  enemy_lantern_elite: {
    intents: [
      { type: "attack", amount: 13, label: "등불 대장 충돌" },
      { type: "special", effect: "pierce_attack", amount: 6, label: "직선 빛살" },
      { type: "debuff", status: "mark", amount: 1, label: "강한 조명" }
    ]
  },
  enemy_candy_elite: {
    intents: [
      { type: "guard", amount: 13, label: "설탕 결정막" },
      { type: "special", effect: "reduce_energy", amount: 1, label: "달콤한 압박" },
      { type: "attack", amount: 14, label: "별사탕 충돌" }
    ]
  },
  enemy_ribbon_elite: {
    intents: [
      { type: "attack", amount: 15, label: "리본 대장 채찍" },
      { type: "special", effect: "chain_down", amount: 3, costIncrease: 1, label: "거대 매듭" },
      { type: "guard", amount: 14, label: "묶음 방어" }
    ]
  },
  enemy_bubble_elite: {
    intents: [
      { type: "special", effect: "add_temp_card", cardId: "card_temp_dust", amount: 2, label: "거품 먼지비" },
      { type: "attack", amount: 16, label: "큰 방울 펑" },
      { type: "guard", amount: 15, label: "비눗막 대형" }
    ]
  },
  enemy_plush_elite: {
    intents: [
      { type: "debuff", status: "weak", amount: 1, label: "말랑 압박" },
      { type: "special", effect: "fortify_all", amount: 7, label: "대장 쿠션" },
      { type: "attack", amount: 17, label: "푹신 돌진" }
    ]
  },
  boss_sunny_gate: {
    intents: [
      { type: "attack", amount: 14, label: "현관 왕방울 쿵" },
      { type: "guard", amount: 12, label: "문틈 잠금" },
      { type: "special", effect: "add_temp_card", cardId: "card_temp_dust", amount: 1, label: "먼지 장난" },
      { type: "special", effect: "fortify_all", amount: 10, label: "현관 장벽" }
    ]
  },
  boss_lavender_hall: {
    intents: [
      { type: "attack", amount: 16, label: "복도 왕방울 쿵" },
      { type: "special", effect: "reduce_energy", amount: 1, label: "라벤더 압박" },
      { type: "guard", amount: 14, label: "향기 잠금" },
      { type: "debuff", status: "weak", amount: 1, label: "라벤더 졸음" }
    ]
  },
  boss_mint_garden: {
    intents: [
      { type: "special", effect: "heal_self", amount: 12, label: "정원 재생" },
      { type: "attack", amount: 18, label: "민트 왕방울 쿵" },
      { type: "guard", amount: 16, label: "덩굴 잠금" }
    ]
  },
  boss_peach_canal: {
    intents: [
      { type: "attack", amount: 20, label: "운하 왕방울 쿵" },
      { type: "special", effect: "pierce_attack", amount: 8, label: "복숭아 물살" },
      { type: "debuff", status: "mark", amount: 1, label: "물결 조준" }
    ]
  },
  boss_cloud_rooftop: {
    intents: [
      { type: "guard", amount: 20, label: "지붕 구름막" },
      { type: "special", effect: "fortify_all", amount: 12, label: "하늘 장벽" },
      { type: "attack", amount: 22, label: "낙하 쿵" }
    ]
  },
  boss_ribbon_station: {
    intents: [
      { type: "attack", amount: 24, label: "정거장 왕방울 쿵" },
      { type: "special", effect: "chain_down", amount: 4, costIncrease: 1, label: "개찰구 매듭" },
      { type: "guard", amount: 22, label: "리본 차단문" }
    ]
  },
  boss_candy_cavern: {
    intents: [
      { type: "special", effect: "add_temp_card", cardId: "card_temp_dust", amount: 2, label: "사탕 먼지비" },
      { type: "attack", amount: 26, label: "동굴 왕방울 쿵" },
      { type: "guard", amount: 24, label: "결정 잠금" }
    ]
  },
  boss_prism_school: {
    intents: [
      { type: "debuff", status: "weak", amount: 1, label: "프리즘 압박" },
      { type: "special", effect: "pierce_attack", amount: 10, label: "교실 빛살" },
      { type: "attack", amount: 28, label: "칠판 쿵" }
    ]
  }
};

const enemies = JSON.parse(await readFile(enemyPath, "utf8"));
const missing = Object.keys(overrides).filter((id) => !enemies.some((enemy) => enemy.id === id));
if (missing.length > 0) {
  throw new Error(`Missing enemy ids: ${missing.join(", ")}`);
}

const curated = enemies.map((enemy) => ({
  ...enemy,
  ...(overrides[enemy.id] ?? {})
}));

await writeFile(enemyPath, `${JSON.stringify(curated, null, 2)}\n`, "utf8");
console.log(`Curated release enemy batch: ${Object.keys(overrides).length} enemies`);
