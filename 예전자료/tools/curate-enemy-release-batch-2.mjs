import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const enemyPath = path.join(rootDir, "src", "data", "ko", "enemies.json");

const enemyOverrides = {
  enemy_prism_buddy: {
    name: "프리즘 색연 친구",
    family: "프리즘",
    intents: [
      { type: "attack", amount: 13, label: "분광 콕" },
      { type: "debuff", status: "mark", amount: 1, label: "색연필 조준" },
      { type: "special", effect: "pierce_attack", amount: 5, label: "무지개 빛살" }
    ]
  },
  enemy_prism_trick: {
    name: "프리즘 눈부심 장난꾼",
    family: "프리즘",
    intents: [
      { type: "debuff", status: "weak", amount: 1, label: "눈부심" },
      { type: "attack", amount: 12, label: "반사 튕김" },
      { type: "special", effect: "add_temp_card", cardId: "card_temp_dust", amount: 1, label: "색종이 파편" }
    ]
  },
  enemy_moon_buddy: {
    name: "달빛 이불 친구",
    family: "달빛",
    intents: [
      { type: "guard", amount: 9, label: "달빛 이불" },
      { type: "special", effect: "reduce_energy", amount: 1, label: "졸음 하품" },
      { type: "attack", amount: 14, label: "초승달 툭" }
    ]
  },
  enemy_moon_trick: {
    name: "달빛 낮잠 장난꾼",
    family: "달빛",
    intents: [
      { type: "debuff", status: "weak", amount: 1, label: "졸음가루" },
      { type: "special", effect: "heal_self", amount: 7, label: "달빛 낮잠" },
      { type: "attack", amount: 13, label: "달조각 밀기" }
    ]
  },
  enemy_peach_buddy: {
    name: "복숭아 과즙 친구",
    family: "복숭아",
    intents: [
      { type: "attack", amount: 15, label: "복숭아 씨앗" },
      { type: "special", effect: "heal_self", amount: 6, label: "달콤 과즙" },
      { type: "guard", amount: 9, label: "말랑 껍질" }
    ]
  },
  enemy_peach_trick: {
    name: "복숭아 잼 장난꾼",
    family: "복숭아",
    intents: [
      { type: "special", effect: "chain_down", amount: 2, costIncrease: 1, label: "끈적잼 꼬임" },
      { type: "attack", amount: 14, label: "잼 튕김" },
      { type: "debuff", status: "mark", amount: 1, label: "분홍 표식" }
    ]
  },
  enemy_toy_buddy: {
    name: "태엽 장난감 친구",
    family: "장난감",
    intents: [
      { type: "special", effect: "add_temp_card", cardId: "card_temp_dust", amount: 1, label: "태엽 부품" },
      { type: "attack", amount: 16, label: "딸깍 펀치" },
      { type: "guard", amount: 9, label: "장난감 방패" }
    ]
  },
  enemy_toy_trick: {
    name: "태엽 스프링 장난꾼",
    family: "장난감",
    intents: [
      { type: "attack", amount: 15, label: "스프링 기습" },
      { type: "special", effect: "reduce_energy", amount: 1, label: "태엽 뻑뻑" },
      { type: "debuff", status: "weak", amount: 1, label: "삐걱 약화" }
    ]
  },
  enemy_leaf_buddy: {
    name: "잎맥 가림 친구",
    family: "잎사귀",
    intents: [
      { type: "guard", amount: 10, label: "잎맥 가림막" },
      { type: "attack", amount: 17, label: "잎사귀 베기" },
      { type: "special", effect: "fortify_all", amount: 5, label: "바람 숨기" }
    ]
  },
  enemy_leaf_trick: {
    name: "낙엽 바람 장난꾼",
    family: "잎사귀",
    intents: [
      { type: "special", effect: "pierce_attack", amount: 6, label: "잎끝 관통" },
      { type: "debuff", status: "mark", amount: 1, label: "바람 표식" },
      { type: "attack", amount: 16, label: "낙엽 휘두르기" }
    ]
  },
  enemy_star_buddy: {
    name: "별가루막 친구",
    family: "별빛",
    intents: [
      { type: "attack", amount: 18, label: "별빛 콕" },
      { type: "special", effect: "add_temp_card", cardId: "card_temp_dust", amount: 1, label: "반짝 먼지" },
      { type: "guard", amount: 10, label: "별가루막" }
    ]
  },
  enemy_star_trick: {
    name: "혜성 현기증 장난꾼",
    family: "별빛",
    intents: [
      { type: "special", effect: "reduce_energy", amount: 1, label: "별빛 현기증" },
      { type: "attack", amount: 17, label: "혜성 툭" },
      { type: "debuff", status: "weak", amount: 1, label: "눈부신 약화" }
    ]
  },
  enemy_cookie_buddy: {
    name: "쿠키 접시 친구",
    family: "쿠키",
    intents: [
      { type: "guard", amount: 11, label: "쿠키 접시막" },
      { type: "attack", amount: 19, label: "바삭 깨물기" },
      { type: "special", effect: "heal_self", amount: 8, label: "부스러기 줍기" }
    ]
  },
  enemy_cookie_trick: {
    name: "초코칩 부스러기 장난꾼",
    family: "쿠키",
    intents: [
      { type: "attack", amount: 18, label: "쿠키 조각비" },
      { type: "special", effect: "chain_down", amount: 2, costIncrease: 1, label: "부스러기 꼬임" },
      { type: "debuff", status: "mark", amount: 1, label: "초코칩 표식" }
    ]
  },
  enemy_prism_elite: {
    name: "프리즘 색분리 대장",
    family: "프리즘",
    intents: [
      { type: "attack", amount: 18, label: "색분리 강타" },
      { type: "special", effect: "pierce_attack", amount: 7, label: "분광 관통" },
      { type: "debuff", status: "mark", amount: 1, label: "굴절 조준" },
      { type: "guard", amount: 17, label: "프리즘 장벽" }
    ]
  },
  enemy_moon_elite: {
    name: "달빛 수면 대장",
    family: "달빛",
    intents: [
      { type: "guard", amount: 18, label: "달빛 커튼" },
      { type: "special", effect: "reduce_energy", amount: 1, label: "깊은 졸음" },
      { type: "debuff", status: "weak", amount: 1, label: "몽롱한 약화" },
      { type: "attack", amount: 19, label: "보름달 밀치기" }
    ]
  },
  enemy_peach_elite: {
    name: "복숭아 과수원 대장",
    family: "복숭아",
    intents: [
      { type: "special", effect: "heal_self", amount: 10, label: "과즙 회복" },
      { type: "attack", amount: 20, label: "씨앗 폭격" },
      { type: "special", effect: "chain_down", amount: 3, costIncrease: 1, label: "잼 덫" },
      { type: "guard", amount: 19, label: "복숭아 울타리" }
    ]
  },
  enemy_toy_elite: {
    name: "장난감 태엽 대장",
    family: "장난감",
    intents: [
      { type: "special", effect: "add_temp_card", cardId: "card_temp_dust", amount: 2, label: "태엽 부품비" },
      { type: "attack", amount: 21, label: "망치 딸깍" },
      { type: "special", effect: "reduce_energy", amount: 1, label: "태엽 역회전" },
      { type: "guard", amount: 20, label: "목마 방어" }
    ]
  },
  enemy_leaf_elite: {
    name: "잎사귀 바람 대장",
    family: "잎사귀",
    intents: [
      { type: "special", effect: "fortify_all", amount: 8, label: "숲바람 엄폐" },
      { type: "special", effect: "pierce_attack", amount: 8, label: "잎끝 비" },
      { type: "attack", amount: 22, label: "가지 휘두르기" },
      { type: "guard", amount: 21, label: "잎맥 성벽" }
    ]
  },
  enemy_star_elite: {
    name: "별빛 관측 대장",
    family: "별빛",
    intents: [
      { type: "debuff", status: "mark", amount: 1, label: "별자리 조준" },
      { type: "special", effect: "reduce_energy", amount: 1, label: "현기성 섬광" },
      { type: "attack", amount: 23, label: "별똥 강타" },
      { type: "special", effect: "add_temp_card", cardId: "card_temp_dust", amount: 1, label: "반짝 잔해" }
    ]
  },
  enemy_cookie_elite: {
    name: "쿠키 오븐 대장",
    family: "쿠키",
    intents: [
      { type: "special", effect: "heal_self", amount: 11, label: "오븐 데우기" },
      { type: "guard", amount: 23, label: "접시 성벽" },
      { type: "special", effect: "chain_down", amount: 3, costIncrease: 1, label: "초코칩 함정" },
      { type: "attack", amount: 24, label: "바삭 파편" }
    ]
  },
  boss_moon_attic: {
    name: "달빛 다락 졸음왕",
    family: "달빛 왕방울",
    maxHp: 300,
    intents: [
      { type: "guard", amount: 18, label: "달빛 커튼" },
      { type: "special", effect: "reduce_energy", amount: 1, label: "긴 하품" },
      { type: "debuff", status: "weak", amount: 1, label: "다락 졸음" },
      { type: "attack", amount: 24, label: "초승달 낙하" }
    ],
    phaseRules: [
      { hpBelowRatio: 0.45, addIntent: { type: "special", effect: "summon", enemyId: "enemy_moon_trick", label: "달빛 그림자 호출" } },
      { hpBelowRatio: 0.2, addIntent: { type: "special", effect: "pierce_attack", amount: 12, label: "다락 창문 빛살" } }
    ]
  },
  boss_sprout_fort: {
    name: "새싹 요새 뿌리왕",
    family: "새싹 왕방울",
    intents: [
      { type: "special", effect: "heal_self", amount: 16, label: "요새 뿌리 회복" },
      { type: "guard", amount: 28, label: "새싹 성벽" },
      { type: "attack", amount: 30, label: "줄기 돌진" },
      { type: "special", effect: "summon", enemyId: "enemy_leaf_buddy", label: "잎사귀 보초 호출" }
    ],
    phaseRules: [
      { hpBelowRatio: 0.5, addIntent: { type: "special", effect: "fortify_all", amount: 12, label: "요새 덩굴 장벽" } },
      { hpBelowRatio: 0.25, addIntent: { type: "special", effect: "summon", enemyId: "enemy_sprout_trick", label: "몰래 새싹 호출" } }
    ]
  },
  boss_bubble_port: {
    name: "방울 항구 조류왕",
    family: "방울 왕방울",
    intents: [
      { type: "special", effect: "add_temp_card", cardId: "card_temp_dust", amount: 2, label: "거품 화물" },
      { type: "special", effect: "pierce_attack", amount: 13, label: "물방울 관통" },
      { type: "guard", amount: 32, label: "항구 방파제" },
      { type: "attack", amount: 34, label: "파도 밀치기" }
    ],
    phaseRules: [
      { hpBelowRatio: 0.5, addIntent: { type: "special", effect: "summon", enemyId: "enemy_bubble_trick", label: "거품 선원 호출" } },
      { hpBelowRatio: 0.25, addIntent: { type: "special", effect: "add_temp_card", cardId: "card_temp_dust", amount: 2, label: "항구 물안개" } }
    ]
  },
  boss_plush_theater: {
    name: "말랑 극장 커튼왕",
    family: "말랑 왕방울",
    intents: [
      { type: "debuff", status: "weak", amount: 1, label: "커튼 졸림" },
      { type: "special", effect: "fortify_all", amount: 14, label: "무대 쿠션막" },
      { type: "attack", amount: 36, label: "인형 무대 추락" },
      { type: "guard", amount: 34, label: "분장실 방어" }
    ],
    phaseRules: [
      { hpBelowRatio: 0.5, addIntent: { type: "special", effect: "summon", enemyId: "enemy_toy_trick", label: "무대 소품 호출" } },
      { hpBelowRatio: 0.25, addIntent: { type: "special", effect: "fortify_all", amount: 16, label: "두꺼운 커튼막" } }
    ]
  },
  boss_morning_observatory: {
    name: "아침 관측소 별자리왕",
    family: "별빛 왕방울",
    intents: [
      { type: "debuff", status: "mark", amount: 1, label: "망원경 조준" },
      { type: "special", effect: "pierce_attack", amount: 15, label: "관측 빛살" },
      { type: "attack", amount: 38, label: "해돋이 강타" },
      { type: "special", effect: "reduce_energy", amount: 1, label: "새벽 현기증" }
    ],
    phaseRules: [
      { hpBelowRatio: 0.5, addIntent: { type: "special", effect: "summon", enemyId: "enemy_star_trick", label: "별자리 조수 호출" } },
      { hpBelowRatio: 0.25, addIntent: { type: "special", effect: "pierce_attack", amount: 18, label: "태양 렌즈 집중" } }
    ]
  },
  boss_dream_arcade: {
    name: "꿈빛 오락실 점수왕",
    family: "장난감 왕방울",
    intents: [
      { type: "special", effect: "add_temp_card", cardId: "card_temp_dust", amount: 2, label: "삐걱 토큰" },
      { type: "special", effect: "chain_down", amount: 4, costIncrease: 1, label: "콤보 리셋" },
      { type: "attack", amount: 40, label: "핀볼 강타" },
      { type: "guard", amount: 38, label: "점수판 방어" }
    ],
    phaseRules: [
      { hpBelowRatio: 0.5, addIntent: { type: "special", effect: "reduce_energy", amount: 1, label: "기계 과열" } },
      { hpBelowRatio: 0.25, addIntent: { type: "special", effect: "summon", enemyId: "enemy_toy_trick", label: "태엽 조수 호출" } }
    ]
  },
  boss_rainbow_keep: {
    name: "무지개 성채 관문왕",
    family: "프리즘 왕방울",
    intents: [
      { type: "attack", amount: 42, label: "성채 무지개 강타" },
      { type: "special", effect: "pierce_attack", amount: 18, label: "일곱빛 관통" },
      { type: "special", effect: "fortify_all", amount: 18, label: "색유리 성벽" },
      { type: "special", effect: "summon", enemyId: "enemy_prism_trick", label: "굴절 경비 호출" }
    ],
    phaseRules: [
      { hpBelowRatio: 0.5, addIntent: { type: "special", effect: "chain_down", amount: 5, costIncrease: 1, label: "성문 연쇄 봉인" } },
      { hpBelowRatio: 0.25, addIntent: { type: "special", effect: "summon", enemyId: "enemy_cookie_trick", label: "마지막 간식병 호출" } }
    ]
  }
};

const bossPhaseOverrides = {
  boss_sunny_gate: [
    { hpBelowRatio: 0.5, addIntent: { type: "special", effect: "summon", enemyId: "enemy_cloud_trick", label: "햇살 문지기 호출" } },
    { hpBelowRatio: 0.25, addIntent: { type: "special", effect: "fortify_all", amount: 12, label: "현관 장벽 넓히기" } }
  ],
  boss_lavender_hall: [
    { hpBelowRatio: 0.5, addIntent: { type: "special", effect: "reduce_energy", amount: 1, label: "라벤더 향기 압박" } },
    { hpBelowRatio: 0.25, addIntent: { type: "special", effect: "summon", enemyId: "enemy_paper_trick", label: "접힌 복도 조수 호출" } }
  ],
  boss_mint_garden: [
    { hpBelowRatio: 0.45, addIntent: { type: "special", effect: "summon", enemyId: "enemy_sprout_trick", label: "정원 새싹 호출" } },
    { hpBelowRatio: 0.2, addIntent: { type: "special", effect: "heal_self", amount: 18, label: "민트 온실 재생" } }
  ],
  boss_peach_canal: [
    { hpBelowRatio: 0.5, addIntent: { type: "special", effect: "pierce_attack", amount: 12, label: "수로 복숭아 물살" } },
    { hpBelowRatio: 0.25, addIntent: { type: "special", effect: "summon", enemyId: "enemy_peach_trick", label: "잼 수로 조수 호출" } }
  ],
  boss_cloud_rooftop: [
    { hpBelowRatio: 0.45, addIntent: { type: "special", effect: "fortify_all", amount: 14, label: "옥상 구름 장벽" } },
    { hpBelowRatio: 0.25, addIntent: { type: "special", effect: "summon", enemyId: "enemy_cloud_buddy", label: "구름 난간 친구 호출" } }
  ],
  boss_ribbon_station: [
    { hpBelowRatio: 0.45, addIntent: { type: "special", effect: "chain_down", amount: 4, costIncrease: 1, label: "개찰구 리본 봉인" } },
    { hpBelowRatio: 0.2, addIntent: { type: "special", effect: "summon", enemyId: "enemy_ribbon_trick", label: "매듭 역무원 호출" } }
  ],
  boss_candy_cavern: [
    { hpBelowRatio: 0.5, addIntent: { type: "special", effect: "add_temp_card", cardId: "card_temp_dust", amount: 2, label: "사탕 동굴 먼지비" } },
    { hpBelowRatio: 0.25, addIntent: { type: "special", effect: "summon", enemyId: "enemy_candy_trick", label: "별사탕 광부 호출" } }
  ],
  boss_prism_school: [
    { hpBelowRatio: 0.5, addIntent: { type: "special", effect: "pierce_attack", amount: 12, label: "칠판 분광 빛살" } },
    { hpBelowRatio: 0.2, addIntent: { type: "special", effect: "summon", enemyId: "enemy_prism_trick", label: "프리즘 짝꿍 호출" } }
  ]
};

const enemies = JSON.parse(await readFile(enemyPath, "utf8"));
const requiredIds = [
  ...Object.keys(enemyOverrides),
  ...Object.keys(bossPhaseOverrides)
];
const missing = requiredIds.filter((id) => !enemies.some((enemy) => enemy.id === id));
if (missing.length > 0) {
  throw new Error(`Missing enemy ids: ${missing.join(", ")}`);
}

const curated = enemies.map((enemy) => ({
  ...enemy,
  ...(enemyOverrides[enemy.id] ?? {}),
  ...(bossPhaseOverrides[enemy.id] ? { phaseRules: bossPhaseOverrides[enemy.id] } : {})
}));

await writeFile(enemyPath, `${JSON.stringify(curated, null, 2)}\n`, "utf8");
console.log(`Curated release enemy batch 2: ${Object.keys(enemyOverrides).length} enemy rows, ${Object.keys(bossPhaseOverrides).length} early boss phase sets`);
