import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const gemPath = path.join(rootDir, "src", "data", "ko", "gems.json");

const overrides = {
  gem_morning_edge: {
    name: "아침 매듭 칼날석",
    text: "장착한 카드의 피해 +15%. 사용 후 연쇄 초기화 한 번을 막습니다.",
    effects: [
      { op: "modify_damage_percent", amount: 15 },
      { op: "preserve_chain" }
    ]
  },
  gem_cloud_edge: {
    name: "구름 이음 칼날석",
    text: "장착한 카드의 피해 +14%. 사용 후 다음 카드 비용 -1.",
    effects: [
      { op: "modify_damage_percent", amount: 14 },
      { op: "bridge_next_color_bonus", amount: 1 }
    ]
  },
  gem_mint_edge: {
    name: "민트 생기 칼날석",
    text: "장착한 카드의 피해 +12%. 사용 후 체력 1을 회복합니다.",
    effects: [
      { op: "modify_damage_percent", amount: 12 },
      { op: "heal_on_play", amount: 1 }
    ]
  },
  gem_peach_edge: {
    name: "복숭아 표식 칼날석",
    text: "장착한 카드의 피해 +10%. 사용 후 표식 1을 줍니다.",
    effects: [
      { op: "modify_damage_percent", amount: 10 },
      { op: "apply_mark_on_play", amount: 1 }
    ]
  },
  gem_lavender_edge: {
    name: "라벤더 무거운 칼날석",
    text: "장착한 카드의 피해 +30%. 그 카드의 비용 +1.",
    effects: [
      { op: "modify_damage_percent", amount: 30 },
      { op: "modify_cost", amount: 1, min: 0 }
    ]
  },
  gem_morning_guard: {
    name: "아침 매듭 방석석",
    text: "장착한 카드의 보호막 +19%. 사용 후 연쇄 초기화 한 번을 막습니다.",
    effects: [
      { op: "modify_shield_percent", amount: 19 },
      { op: "preserve_chain" }
    ]
  },
  gem_cloud_guard: {
    name: "구름 온기 방석석",
    text: "장착한 카드의 보호막 +18%. 사용 후 체력 1을 회복합니다.",
    effects: [
      { op: "modify_shield_percent", amount: 18 },
      { op: "heal_on_play", amount: 1 }
    ]
  },
  gem_mint_guard: {
    name: "민트 가벼운 방석석",
    text: "장착한 카드의 보호막 +12%. 그 카드의 비용 -1.",
    effects: [
      { op: "modify_shield_percent", amount: 12 },
      { op: "modify_cost", amount: -1, min: 0 }
    ]
  },
  gem_peach_guard: {
    name: "복숭아 이음 방석석",
    text: "장착한 카드의 보호막 +16%. 사용 후 다음 카드 비용 -1.",
    effects: [
      { op: "modify_shield_percent", amount: 16 },
      { op: "bridge_next_color_bonus", amount: 1 }
    ]
  },
  gem_lavender_guard: {
    name: "라벤더 표식 방석석",
    text: "장착한 카드의 보호막 +15%. 사용 후 표식 1을 줍니다.",
    effects: [
      { op: "modify_shield_percent", amount: 15 },
      { op: "apply_mark_on_play", amount: 1 }
    ]
  },
  gem_morning_spark: {
    name: "아침 매듭 반짝석",
    text: "장착한 카드를 사용하면 표식 2를 주고 연쇄 초기화 한 번을 막습니다.",
    effects: [
      { op: "apply_mark_on_play", amount: 2 },
      { op: "preserve_chain" }
    ]
  },
  gem_cloud_spark: {
    name: "구름 온기 반짝석",
    text: "장착한 카드를 사용하면 표식 2를 주고 체력 1을 회복합니다.",
    effects: [
      { op: "apply_mark_on_play", amount: 2 },
      { op: "heal_on_play", amount: 1 }
    ]
  },
  gem_mint_spark: {
    name: "민트 이음 반짝석",
    text: "장착한 카드를 사용하면 표식 1을 주고 다음 카드 비용 -1.",
    effects: [
      { op: "apply_mark_on_play", amount: 1 },
      { op: "bridge_next_color_bonus", amount: 1 }
    ]
  },
  gem_peach_spark: {
    name: "복숭아 잔향 반짝석",
    text: "장착한 카드를 사용하면 표식 1을 주고 기본 효과가 20% 위력으로 한 번 더 발동합니다.",
    effects: [
      { op: "apply_mark_on_play", amount: 1 },
      { op: "echo_basic_effect", ratio: 0.2 }
    ]
  },
  gem_lavender_spark: {
    name: "라벤더 경량 반짝석",
    text: "장착한 카드를 사용하면 표식 1을 줍니다. 그 카드의 비용 -1.",
    effects: [
      { op: "apply_mark_on_play", amount: 1 },
      { op: "modify_cost", amount: -1, min: 0 }
    ]
  },
  gem_morning_echo: {
    name: "아침 매듭 메아리석",
    text: "장착한 카드의 기본 효과가 25% 위력으로 한 번 더 발동합니다. 사용 후 연쇄 초기화 한 번을 막습니다.",
    effects: [
      { op: "echo_basic_effect", ratio: 0.25 },
      { op: "preserve_chain" }
    ]
  },
  gem_cloud_echo: {
    name: "구름 온기 메아리석",
    text: "장착한 카드의 기본 효과가 28% 위력으로 한 번 더 발동하고 체력 1을 회복합니다.",
    effects: [
      { op: "echo_basic_effect", ratio: 0.28 },
      { op: "heal_on_play", amount: 1 }
    ]
  },
  gem_mint_echo: {
    name: "민트 이음 메아리석",
    text: "장착한 카드의 기본 효과가 30% 위력으로 한 번 더 발동합니다. 사용 후 다음 카드 비용 -1.",
    effects: [
      { op: "echo_basic_effect", ratio: 0.3 },
      { op: "bridge_next_color_bonus", amount: 1 }
    ]
  },
  gem_peach_echo: {
    name: "복숭아 표식 메아리석",
    text: "장착한 카드의 기본 효과가 35% 위력으로 한 번 더 발동합니다. 사용 후 표식 1을 줍니다.",
    effects: [
      { op: "echo_basic_effect", ratio: 0.35 },
      { op: "apply_mark_on_play", amount: 1 }
    ]
  },
  gem_lavender_echo: {
    name: "라벤더 무거운 메아리석",
    text: "장착한 카드의 기본 효과가 45% 위력으로 한 번 더 발동합니다. 그 카드의 비용 +1.",
    effects: [
      { op: "echo_basic_effect", ratio: 0.45 },
      { op: "modify_cost", amount: 1, min: 0 }
    ]
  }
};

const gems = JSON.parse(await readFile(gemPath, "utf8"));
const missing = Object.keys(overrides).filter((id) => !gems.some((gem) => gem.id === id));
if (missing.length > 0) {
  throw new Error(`Missing gem ids: ${missing.join(", ")}`);
}

const curated = gems.map((gem) => ({
  ...gem,
  ...(overrides[gem.id] ?? {})
}));

await writeFile(gemPath, `${JSON.stringify(curated, null, 2)}\n`, "utf8");
console.log(`Curated release gem batch: ${Object.keys(overrides).length} gems`);
