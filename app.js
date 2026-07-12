const SAVE_KEY = "taskbar-cat-hero-state-v1";
const WidgetCore = window.TaskbarWidgetCore;

if (!WidgetCore) {
  throw new Error("TaskbarWidgetCore must load before app.js");
}

// One grid, three economic roles so every card feeds a real system:
//  - dish: cookable. `cook` ingredients are consumed per serving -> the farm↔요리 link.
//  - farm: upgrading raises that ingredient's harvest yield (farm mastery).
//  - tool: upgrading feeds 스킬, which speeds up every production facility.
const recipes = [
  { id: "stew", icon: "stew", name: "스튜", level: 1, dish: true, cook: { tomato: 1, milk: 1 }, cost: { coins: 80, tomato: 2, milk: 1 } },
  { id: "pasta", icon: "pasta", name: "파스타", level: 1, dish: true, cook: { wheat: 1, tomato: 1 }, cost: { coins: 95, wheat: 2, tomato: 2 } },
  { id: "cake", icon: "cake", name: "케이크", level: 1, dish: true, cook: { egg: 1, milk: 1, cheese: 1 }, cost: { coins: 120, egg: 1, milk: 2, cheese: 1 } },
  { id: "juice", icon: "juice", name: "주스", level: 1, dish: true, cook: { carrot: 1, tomato: 1 }, cost: { coins: 70, carrot: 2, tomato: 1 } },
  { id: "spatula", icon: "spatula", name: "뒤집개", level: 1, cost: { coins: 110, wheat: 1 } },
  { id: "pot", icon: "pot", name: "냄비", level: 1, cost: { coins: 130, milk: 1, egg: 1 } },
  { id: "roller", icon: "roller", name: "밀대", level: 1, cost: { coins: 90, wheat: 3 } },
  { id: "book", icon: "book", name: "레시피", level: 1, cost: { coins: 150, shard: 1 } },
  { id: "wheat", icon: "wheat", name: "밀", level: 1, farm: true, cost: { coins: 50 } },
  { id: "carrot", icon: "carrot", name: "당근", level: 1, farm: true, cost: { coins: 50 } },
  { id: "tomato", icon: "tomato", name: "토마토", level: 1, farm: true, cost: { coins: 50 } },
  { id: "milk", icon: "milk", name: "우유", level: 1, farm: true, cost: { coins: 65 } }
];

// Every consumable ingredient now has a facility that produces it, so no dish
// or upgrade can be soft-locked by a resource that has no source.
//   wheat -> field/bakery, egg -> bakery, tomato/carrot/milk -> greenhouse,
//   cheese -> village, shard -> truck(+cooking).
const production = [
  { id: "field", art: "field", name: "밀밭", duration: 30, rewards: { wheat: 4, coins: 12 } },
  { id: "bakery", art: "bakery", name: "베이커리", duration: 45, rewards: { wheat: 2, egg: 1, coins: 22 } },
  { id: "truck", art: "truck", name: "배달차", duration: 60, rewards: { coins: 65, shard: 1 } },
  { id: "greenhouse", art: "greenhouse", name: "온실", duration: 75, rewards: { tomato: 3, carrot: 3, milk: 3 } },
  { id: "village", art: "village", name: "마을", duration: 90, rewards: { cheese: 2, milk: 1, hearts: 4, gems: 1 } }
];

const partyCats = [
  { id: "momo", portrait: "momo", name: "모모", level: 12 },
  { id: "gray", portrait: "gray", name: "구름", level: 10 },
  { id: "marmalade", portrait: "marmalade", name: "마롱", level: 11 },
  { id: "locked", portrait: "calico", name: "새 친구", level: 0 }
];

// Code-native prototype symbols keep the management UI in one visual family
// and prevent the rejected menu-v1 raster set from leaking back into runtime.
// Unity target: replace these paths with one approved vector/SpriteAtlas set
// while keeping the stable semantic ids used by the presenter.
const UI_ICON_PATHS = Object.freeze({
  stew: '<path d="M6 11h12v7H6z"/><path d="M8 11V8a4 4 0 0 1 8 0v3M4 11h16"/>',
  pasta: '<path d="M5 12h14c0 4-3 7-7 7s-7-3-7-7Z"/><path d="M8 9c1-2 2 2 3 0s2 2 3 0 2 2 3 0"/>',
  cake: '<path d="M6 10h12v9H6z"/><path d="M6 14h12M9 10V7h6v3M12 7V4"/>',
  juice: '<path d="M8 7h8l-1 12H9Z"/><path d="m14 7 3-3M10 11h4"/>',
  wheat: '<path d="M12 21V5M12 9 8 6M12 12l4-3M12 15l-4-3M12 18l4-3"/>',
  carrot: '<path d="M9 8c2-2 5-2 7 0-1 6-3 10-6 12-2-3-2-8-1-12Z"/><path d="M11 7 9 3M13 7l2-4M12 7l1-5"/>',
  tomato: '<circle cx="12" cy="13" r="7"/><path d="m12 6 2-3M12 6 9 4m3 2 4 1"/>',
  milk: '<path d="M8 7h8v13H8zM9 3h6l1 4H8Z"/><path d="M9 11h6"/>',
  cheese: '<path d="m5 17 14 2V7L5 17Z"/><circle cx="14" cy="12" r="1"/><circle cx="10" cy="16" r="1"/>',
  egg: '<path d="M12 4c4 0 6 7 6 10a6 6 0 0 1-12 0c0-3 2-10 6-10Z"/>',
  field: '<path d="M4 19c4-5 12-5 16 0M7 19c2-4 8-4 10 0M12 16V7"/><path d="M12 11c-3 0-4-2-4-4 3 0 4 1 4 4Zm0 2c3 0 4-2 4-4-3 0-4 1-4 4Z"/>',
  bakery: '<path d="M5 10h14v10H5zM8 10V7a4 4 0 0 1 8 0v3"/><path d="M9 15h6"/>',
  truck: '<path d="M4 8h10v9H4zM14 11h4l2 3v3h-6z"/><circle cx="8" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
  greenhouse: '<path d="M4 20V9l8-5 8 5v11Z"/><path d="M12 5v15M5 10h14M8 20v-6h8v6"/>',
  village: '<path d="m4 12 8-7 8 7v8H4z"/><path d="M9 20v-6h6v6"/>'
});

const INGREDIENT_LABELS = Object.freeze({
  wheat: "밀", carrot: "당근", tomato: "토마토", milk: "우유",
  cheese: "치즈", egg: "달걀", shard: "조각"
});

function iconMarkup(id) {
  const paths = UI_ICON_PATHS[id] || UI_ICON_PATHS.stew;
  return `<svg class="game-icon" viewBox="0 0 24 24" aria-hidden="true">${paths}</svg>`;
}

function requirementMarkup(cost) {
  return Object.entries(cost || {}).map(([key, amount]) => {
    const owned = state.ingredients[key] || 0;
    const missing = owned < amount;
    return `<span class="requirement-chip${missing ? " is-missing" : ""}"><i class="ingredient-mark ingredient-mark--${key}"></i>${INGREDIENT_LABELS[key] || key} ${owned}/${amount}</span>`;
  }).join("");
}

function rewardSummary(rewards) {
  return Object.entries(rewards).map(([key, amount]) => `${INGREDIENT_LABELS[key] || ({ coins: "코인", gems: "보석", hearts: "하트" }[key]) || key} +${amount}`).join(" · ");
}

// ============================================================================
// BALANCE — every tunable economy number in one data table.
// PROJECT_RULES.md §2 requires balance data to be data-driven and map cleanly
// to a Unity ScriptableObject. Nothing below this table should hardcode a
// tunable value; the derived-bonus and action functions all read from here, so
// a designer can retune the game (or load a JSON/CSV/ScriptableObject variant)
// without touching gameplay logic. Unity target: a `BalanceConfig`
// ScriptableObject with the same field names.
// ============================================================================
const BALANCE = {
  energy: { max: 50, baseRegenPerSec: 0.08, focusFactor: 0.003, coatFactor: 0.1 },
  // Cooking: energy cost per serving, coin payout curve, heart + shard drops.
  cook: { energyCost: 3, basePayout: 35, payoutPerLevel: 10, heartLevelDivisor: 2, focusPerCook: 3, shardChance: 0.22 },
  // Cook payout multiplier inputs (식당 등급·조리 장비·영입 고양이).
  cookMultiplier: { affectionDivisor: 200, panFactor: 0.1, spatulaFactor: 0.1, catBaseline: 4, catFactor: 0.08 },
  // Production speed inputs (스킬·가방) and harvest yield inputs (농장 숙련·가방).
  production: { skillSpeedFactor: 0.005, bagSpeedFactor: 0.1 },
  farmYield: { masteryFactor: 0.15, bagFactor: 0.05 },
  // Upgrades: cost growth per level, 레시피북 discount floor, skill gained.
  upgrade: { costGrowthPerLevel: 0.35, recipeBookDiscount: 0.05, minCostFactor: 0.6, skillPerUpgrade: 4 },
  gear: { baseCost: 90, costPerLevel: 45, skillPerUpgrade: 2 },
  // 배치: hearts + coins spent to raise restaurant rating (애정).
  decorate: { heartCost: 6, coinCost: 45, baseAffection: 4, apronFactor: 1 },
  // 영입: hearts + gems for a permanent cat that lifts every dish payout.
  recruit: { heartCost: 20, gemCost: 2 },
  pat: { affection: 1 },
  caps: { affection: 100, skill: 100, focus: 100 },
};

// 파견 경로 정의 + 활성 시 지속 보너스. Unity target: a list of
// `DispatchRouteDefinition` ScriptableObjects keyed by id.
const dispatchRoutes = {
  garden: { label: "정원: 농장 수확 +15%", farmMultiplier: 1.15 },
  market: { label: "시장: 코인 +15%", coinMultiplier: 1.15 },
  harbor: { label: "항구: 조각·보석 보너스", shardBonus: 1, gemBonus: 1 },
  festival: { label: "축제: 하트 보너스", heartBonus: 2 },
};
const DISPATCH_UNLOCK_COST = { coins: 300, shard: 1, gems: 1 };
const DISPATCH_DEFAULT_UNLOCKED = ["garden", "festival"];

// Resource keys that count as harvestable ingredients (vs coins/gems/hearts).
const INGREDIENT_KEYS = ["wheat", "carrot", "tomato", "milk", "cheese", "egg", "shard"];

const baseState = {
  panelOpen: false,
  selectedRecipe: "stew",
  selectedGear: "spatula",
  coins: 1250,
  gems: 8,
  hearts: 34,
  energy: 45,
  affection: 72,
  focus: 66,
  skill: 48,
  cats: 4,
  dispatch: "garden",
  dispatchUnlocked: [...DISPATCH_DEFAULT_UNLOCKED],
  recruited: [],
  widget: {
    motion: "full",
    position: null,
    work: null
  },
  actionIndex: 0,
  ingredients: {
    wheat: 24,
    carrot: 18,
    tomato: 22,
    milk: 16,
    cheese: 12,
    egg: 15,
    shard: 2
  },
  gear: {
    spatula: 1,
    coat: 1,
    bag: 1,
    pan: 1,
    apron: 1,
    recipeBook: 1
  },
  recipes: recipes.reduce((acc, recipe) => {
    acc[recipe.id] = recipe.level;
    return acc;
  }, {}),
  production: production.reduce((acc, item) => {
    acc[item.id] = { remaining: item.duration, ready: false };
    return acc;
  }, {})
};

let state = loadState();
let lastTick = Date.now();
let selectedRecipe = recipes.some((recipe) => recipe.id === state.selectedRecipe && recipe.dish)
  ? state.selectedRecipe
  : "stew";
let activePanelView = "today";

// The room is a clean plate. Every visible customer is a separate owned actor:
// its body and bubble arrive, wait, react, and leave together. Empty seats are
// deliberate spawn locations, so there are no decorative cats without state
// and no bubble can remain visible when its customer is absent.
const SCENE_ORDER_IDS = Object.freeze(["stew", "pasta", "cake", "juice"]);
const SCENE_CUSTOMER_STEP_MS = 2800;
const SCENE_SERVED_HOLD_MS = 2600;
const sceneRuntime = {
  cursor: 2,
  orderCursor: 2,
  nextChangeAt: Date.now() + SCENE_CUSTOMER_STEP_MS,
  statusMessage: "",
  statusUntil: 0,
  customers: [
    { phase: "present", kind: "order", orderId: "stew" },
    { phase: "present", kind: "order", orderId: "cake" },
    { phase: "empty", kind: "order", orderId: "pasta" }
  ]
};

/*
 * Ephemeral activity data is intentionally separate from the save state.
 * It contains no key values, text, window titles, application names, click
 * targets, clipboard content, or screen data. The Unity port should keep the
 * same separation through an IActivitySignalSource adapter whose output is
 * anonymous pulse categories only.
 */
const widgetRuntime = {
  lastActivityAt: Date.now(),
  workUntil: 0,
  returnUntil: 0,
  ambientState: "alert-idle",
  reaction: "none",
  reactionSource: "none",
  reactionToken: 0,
  nextIdleEventAt: 0,
  idleEventIndex: 0,
  keySide: "right",
  lastKeyReactionAt: 0,
  keyPulseTimes: [],
  resizeFrame: 0,
  drag: {
    pointerId: null,
    startClientX: 0,
    startClientY: 0,
    startLeft: 0,
    startTop: 0,
    moved: false,
    suppressPointerClickUntil: 0
  }
};

const WIDGET_DRAG_THRESHOLD_PX = 5;
const WIDGET_DRAG_CLICK_SUPPRESSION_MS = 700;
const WIDGET_KEY_FEEDBACK_MS = 220;
const WIDGET_KEY_COOLDOWN_MS = 70;
const WIDGET_TYPING_WINDOW_MS = 800;
const WIDGET_TYPING_FAST_HOLD_MS = 1000;
const WIDGET_TYPING_OVERDRIVE_HOLD_MS = 980;
const WIDGET_WAKE_STARTLE_HOLD_MS = 1000;
const WIDGET_WORK_HOLD_MS = 1200;
const WIDGET_IDLE_ATTENTION_HOLD_MS = 1200;
const WIDGET_IDLE_SNIFF_HOLD_MS = 3000;
const WIDGET_IDLE_SNIFF_INTERVALS_MS = Object.freeze([18_000, 26_000, 22_000]);

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(SAVE_KEY));
    const source = saved && typeof saved === "object" ? saved : {};
    const merged = {
      ...structuredClone(baseState),
      ...source,
      ingredients: { ...baseState.ingredients, ...(source.ingredients || {}) },
      gear: { ...baseState.gear, ...(source.gear || {}) },
      recipes: { ...baseState.recipes, ...(source.recipes || {}) },
      production: { ...baseState.production, ...(source.production || {}) }
    };
    merged.widget = WidgetCore.normalizeWidgetState(source.widget, source.widgetSeconds, Date.now());
    delete merged.widgetSeconds;
    return merged;
  } catch {
    const fallback = structuredClone(baseState);
    fallback.widget = WidgetCore.normalizeWidgetState(undefined, undefined, Date.now());
    return fallback;
  }
}

function saveState() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function formatTimer(seconds) {
  return WidgetCore.formatTimer(seconds);
}

function canPay(cost) {
  return Object.entries(cost).every(([key, amount]) => {
    if (key === "coins") return state.coins >= amount;
    if (key === "gems") return state.gems >= amount;
    return (state.ingredients[key] || 0) >= amount;
  });
}

function pay(cost) {
  if (!canPay(cost)) return false;
  Object.entries(cost).forEach(([key, amount]) => {
    if (key === "coins") state.coins -= amount;
    else if (key === "gems") state.gems -= amount;
    else state.ingredients[key] -= amount;
  });
  return true;
}

function addRewards(rewards) {
  Object.entries(rewards).forEach(([key, amount]) => {
    if (key === "coins") state.coins += amount;
    else if (key === "gems") state.gems += amount;
    else if (key === "hearts") state.hearts += amount;
    else state.ingredients[key] = (state.ingredients[key] || 0) + amount;
  });
}

// --- Derived bonuses -------------------------------------------------------
// Central place where every stat, gear level, upgrade, and 파견 choice turns
// into a concrete gameplay effect. This is what makes the systems interlock
// instead of being parallel counters. All coefficients come from BALANCE /
// dispatchRoutes so nothing here is hardcoded (PROJECT_RULES.md §2).
// Unity target: a `BonusService` reading BalanceConfig + the active route.
function gearLv(id) {
  return state.gear[id] || 1;
}

function recipeLv(id) {
  return state.recipes[id] || 1;
}

function activeRoute() {
  return dispatchRoutes[state.dispatch] || {};
}

// 식당 등급(애정) + 조리 장비 + 시장 파견 + 영입한 고양이 → 요리 수익 배율.
// 배치로 올린 애정이 여기서 요리 수익으로 돌아오는 되먹임 고리.
function cookMultiplier() {
  const c = BALANCE.cookMultiplier;
  const rating = 1 + state.affection / c.affectionDivisor;
  const tools = 1 + (gearLv("pan") - 1) * c.panFactor + (gearLv("spatula") - 1) * c.spatulaFactor;
  const market = activeRoute().coinMultiplier || 1;
  const cats = 1 + Math.max(0, state.cats - c.catBaseline) * c.catFactor;
  return rating * tools * market * cats;
}

// 스킬(레시피·장비 강화의 결과) + 가방 → 모든 생산 시설 속도.
function productionSpeed() {
  return 1 + state.skill * BALANCE.production.skillSpeedFactor + (gearLv("bag") - 1) * BALANCE.production.bagSpeedFactor;
}

// 레시피북 → 강화 코인 할인.
function upgradeCostFactor() {
  return Math.max(BALANCE.upgrade.minCostFactor, 1 - (gearLv("recipeBook") - 1) * BALANCE.upgrade.recipeBookDiscount);
}

// 집중(요리로 오름) + 코트 → 에너지 회복 속도. 집중이 드디어 실효를 가진다.
// baseRegenPerSec 0.08: 빈 에너지(50)를 약 9분에 채우고, 능동 플레이 시 약
// 30초마다 한 번 요리할 수 있는 리듬을 만든다(오프닝 버스트 후에도 루프 생존).
function energyRegen() {
  const e = BALANCE.energy;
  return e.baseRegenPerSec * (1 + state.focus * e.focusFactor + (gearLv("coat") - 1) * e.coatFactor);
}

// 농장 숙련 레시피 + 가방 + 정원 파견 → 수확량. farm 레시피의 id가 곧 재료 key.
function farmYield(key, amount) {
  const f = BALANCE.farmYield;
  const master = 1 + (recipeLv(key) - 1) * f.masteryFactor;
  const bag = 1 + (gearLv("bag") - 1) * f.bagFactor;
  const garden = activeRoute().farmMultiplier || 1;
  return Math.max(amount, Math.round(amount * master * bag * garden));
}

// 한 시설의 보상을 지급하되 수확 보너스와 활성 파견 보너스를 적용한다.
// 받기와 일괄 수확이 같은 규칙을 쓰도록 한곳에 모은다. 파견 보너스는
// dispatchRoutes 정의에서 읽어 노드별 효과를 데이터로 유지한다.
function grantProduction(item) {
  const route = activeRoute();
  Object.entries(item.rewards).forEach(([key, amount]) => {
    let gain = amount;
    if (INGREDIENT_KEYS.includes(key)) gain = farmYield(key, amount);
    if (key === "coins" && route.coinMultiplier) gain = Math.round(gain * route.coinMultiplier);
    if (key === "shard" && route.shardBonus) gain += route.shardBonus;
    if (key === "gems" && route.gemBonus) gain += route.gemBonus;
    if (key === "hearts" && route.heartBonus) gain += route.heartBonus;
    addRewards({ [key]: gain });
  });
}

function getSceneOrder(orderId) {
  const safeOrderId = SCENE_ORDER_IDS.includes(orderId) ? orderId : "stew";
  return recipes.find((recipe) => recipe.id === safeOrderId && recipe.dish) || recipes[0];
}

function resetSceneLife() {
  sceneRuntime.cursor = 2;
  sceneRuntime.orderCursor = 2;
  sceneRuntime.nextChangeAt = Date.now() + SCENE_CUSTOMER_STEP_MS;
  sceneRuntime.statusMessage = "";
  sceneRuntime.statusUntil = 0;
  sceneRuntime.customers = [
    { phase: "present", kind: "order", orderId: "stew" },
    { phase: "present", kind: "order", orderId: "cake" },
    { phase: "empty", kind: "order", orderId: "pasta" }
  ];
}

function nextSceneOrderId() {
  for (let offset = 0; offset < SCENE_ORDER_IDS.length; offset += 1) {
    const index = (sceneRuntime.orderCursor + offset) % SCENE_ORDER_IDS.length;
    const candidate = SCENE_ORDER_IDS[index];
    const duplicate = sceneRuntime.customers.some(
      (customer) => customer.phase !== "empty" && customer.orderId === candidate
    );
    if (!duplicate) {
      sceneRuntime.orderCursor = (index + 1) % SCENE_ORDER_IDS.length;
      return candidate;
    }
  }
  const fallback = SCENE_ORDER_IDS[sceneRuntime.orderCursor % SCENE_ORDER_IDS.length];
  sceneRuntime.orderCursor = (sceneRuntime.orderCursor + 1) % SCENE_ORDER_IDS.length;
  return fallback;
}

function renderSceneLife(animateSlot = -1) {
  const actors = $$('[data-scene-customer]');
  if (!actors.length) return;

  sceneRuntime.customers.forEach((customer, index) => {
    const actor = actors[index];
    if (!actor) return;
    const recipe = getSceneOrder(customer.orderId);
    actor.dataset.phase = customer.phase;
    actor.dataset.kind = customer.kind;
    actor.dataset.order = customer.orderId;
    actor.toggleAttribute("aria-hidden", customer.phase === "empty");
    actor.setAttribute(
      "aria-label",
      customer.phase === "empty"
        ? "빈 손님 자리"
        : customer.phase === "arriving"
          ? `${recipe.name}를 주문하려고 입장하는 손님`
          : customer.phase === "leaving"
            ? "식사를 마치고 떠나는 손님"
            : customer.kind === "order"
              ? `${recipe.name}를 주문한 손님`
              : customer.kind === "happy"
                ? `${recipe.name}를 받아 기뻐하는 손님`
                : customer.kind === "sweat"
                  ? `${recipe.name}를 기다리며 초조한 손님`
                  : `${recipe.name}를 오래 기다려 화난 손님`
    );
    if (index === animateSlot) {
      actor.classList.remove("is-swapping");
      void actor.offsetWidth;
      actor.classList.add("is-swapping");
    }
  });

  const presentCustomers = sceneRuntime.customers.filter(
    (customer) => customer.phase === "present" || customer.phase === "arriving"
  );
  const activeOrders = presentCustomers.filter((customer) => customer.phase === "present" && customer.kind !== "happy").length;
  const angryCount = presentCustomers.filter((customer) => customer.kind === "angry").length;
  const sweatCount = presentCustomers.filter((customer) => customer.kind === "sweat").length;
  const happyCount = presentCustomers.filter((customer) => customer.kind === "happy").length;
  const arrivingCount = presentCustomers.filter((customer) => customer.phase === "arriving").length;
  const now = Date.now();
  const title = $("#sceneStatusTitle");
  const copy = $("#sceneStatusCopy");
  if (title) title.textContent = `영업 중 · 손님 ${presentCustomers.length}명 · 주문 ${activeOrders}건`;
  if (copy) {
    copy.textContent = sceneRuntime.statusUntil > now
      ? sceneRuntime.statusMessage
      : angryCount
        ? "오래 기다린 손님이 화나기 전에 서빙해 주세요"
        : sweatCount
          ? "기다리는 손님이 초조해하고 있어요"
          : happyCount
            ? "방금 나온 요리에 손님이 기뻐해요"
            : arrivingCount
              ? "새 손님이 빈자리에 앉고 있어요"
              : presentCustomers.length
                ? "손님 머리 위 주문을 확인해 주세요"
                : "빈자리에 곧 새 손님이 찾아와요";
  }
}

function advanceSceneCustomer(index) {
  const customer = sceneRuntime.customers[index];
  if (!customer) return false;
  const sweatCount = sceneRuntime.customers.filter(
    (item) => item.phase === "present" && item.kind === "sweat"
  ).length;
  const angryCount = sceneRuntime.customers.filter(
    (item) => item.phase === "present" && item.kind === "angry"
  ).length;
  if (customer.phase === "empty") {
    customer.phase = "arriving";
    customer.kind = "order";
    customer.orderId = nextSceneOrderId();
    return true;
  }
  if (customer.phase === "arriving") {
    customer.phase = "present";
    customer.kind = "order";
    return true;
  }
  if (customer.phase === "leaving") {
    customer.phase = "empty";
    customer.kind = "order";
    return true;
  }
  if (customer.kind === "happy" || customer.kind === "angry") {
    customer.phase = "leaving";
    return true;
  }
  if (customer.kind === "order") {
    if (sweatCount < 1) {
      customer.kind = "sweat";
      return true;
    }
    if (angryCount < 1) {
      customer.kind = "angry";
      return true;
    }
    return false;
  }
  if (customer.kind === "sweat" && angryCount < 1) {
    customer.kind = "angry";
    return true;
  }
  customer.phase = "leaving";
  return true;
}

function tickSceneLife(now) {
  if (now < sceneRuntime.nextChangeAt) return;
  const slot = sceneRuntime.cursor % sceneRuntime.customers.length;
  sceneRuntime.cursor = (sceneRuntime.cursor + 1) % sceneRuntime.customers.length;
  const changed = advanceSceneCustomer(slot);
  sceneRuntime.nextChangeAt = now + SCENE_CUSTOMER_STEP_MS;
  renderSceneLife(changed ? slot : -1);
}

function serveSceneOrder(orderId) {
  const slot = sceneRuntime.customers.findIndex(
    (customer) => customer.phase === "present" && customer.orderId === orderId && customer.kind !== "happy"
  );
  if (slot < 0) return;
  const recipe = getSceneOrder(orderId);
  sceneRuntime.customers[slot].kind = "happy";
  sceneRuntime.statusMessage = `${recipe.name} 서빙 완료 · 손님 기분이 좋아졌어요`;
  sceneRuntime.statusUntil = Date.now() + SCENE_SERVED_HOLD_MS;
  sceneRuntime.nextChangeAt = Math.max(sceneRuntime.nextChangeAt, Date.now() + SCENE_SERVED_HOLD_MS);
  renderSceneLife(slot);
}

function tick() {
  const now = Date.now();
  const delta = Math.min(5, (now - lastTick) / 1000);
  lastTick = now;

  const speed = productionSpeed();
  production.forEach((item) => {
    const progress = state.production[item.id];
    if (!progress.ready) {
      progress.remaining -= delta * speed;
      if (progress.remaining <= 0) {
        progress.remaining = 0;
        progress.ready = true;
      }
    }
  });

  state.energy = clamp(state.energy + delta * energyRegen(), 0, 50);
  maybeRunWidgetAmbientEvent(now);
  tickSceneLife(now);
  renderResources();
  renderProduction();
  renderWidget();
}

function renderResources() {
  $("#heartValue").textContent = Math.floor(state.hearts);
  $("#coinValue").textContent = Math.floor(state.coins).toLocaleString();
  $("#gemValue").textContent = Math.floor(state.gems).toLocaleString();
  $("#energyValue").textContent = Math.floor(state.energy);
  $("#catValue").textContent = state.cats;
  $("#affectionText").textContent = Math.floor(state.affection);
  $("#focusText").textContent = Math.floor(state.focus);
  $("#skillText").textContent = Math.floor(state.skill);
  $("#affectionBar").style.width = `${state.affection}%`;
  $("#energyBar").style.width = `${state.focus}%`;
  $("#skillBar").style.width = `${state.skill}%`;
  $("#catStars").textContent = "★".repeat(Math.min(5, 2 + Math.floor(state.affection / 34))).padEnd(5, "☆");
  $("#todayAffection").textContent = Math.floor(state.affection);

  Object.entries(state.gear).forEach(([gear, level]) => {
    const el = $(`#gear-${gear}`);
    if (el) el.textContent = level;
  });
}

function renderParty() {
  const list = $("#partyList");
  list.innerHTML = "";
  partyCats.forEach((cat) => {
    const recruited = cat.level > 0 || (state.recruited || []).includes(cat.id);
    const card = document.createElement("button");
    card.className = `party-card party-card--${cat.portrait}`;
    card.setAttribute("aria-label", recruited ? `${cat.name} Lv.${cat.level || 1}` : "새 고양이 영입");
    card.innerHTML = recruited
      ? `<span>${cat.name.slice(0, 1)}</span><small>Lv.${cat.level || 1}</small>`
      : `<b class="party-lock">영입</b>`;
    card.addEventListener("click", () => {
      if (!recruited) {
        // Hearts (from cooking) + gems (from 마을) turn into a permanent cat that
        // lifts every dish's payout. This is the sink both currencies lacked.
        const rc = BALANCE.recruit;
        if (state.hearts < rc.heartCost || !canPay({ gems: rc.gemCost })) {
          toast(`영입에는 하트 ${rc.heartCost}·보석 ${rc.gemCost}이 필요해요.`);
          return;
        }
        state.hearts -= rc.heartCost;
        pay({ gems: rc.gemCost });
        state.recruited = [...(state.recruited || []), cat.id];
        state.cats += 1;
        toast(`새 고양이 영입! 요리 수익 +${Math.round(BALANCE.cookMultiplier.catFactor * 100)}%`);
        render();
        return;
      }
      state.affection = clamp(state.affection + BALANCE.pat.affection, 0, BALANCE.caps.affection);
      toast("파티 고양이를 쓰다듬었어요.");
      render();
    });
    list.appendChild(card);
  });
}

function renderRecipes() {
  const grid = $("#recipeGrid");
  grid.innerHTML = "";
  recipes.filter((recipe) => recipe.dish).forEach((recipe) => {
    const level = state.recipes[recipe.id] || 1;
    const ready = canPay(recipe.cook) && state.energy >= BALANCE.cook.energyCost;
    const card = document.createElement("button");
    card.className = `recipe-card ${selectedRecipe === recipe.id ? "selected" : ""} ${ready ? "is-ready" : ""}`;
    card.setAttribute("aria-label", `${recipe.name} Lv.${level}`);
    card.innerHTML = `
      <span class="recipe-symbol recipe-symbol--${recipe.id}" aria-hidden="true"></span>
      <span><b>${recipe.name}</b><small>레시피 Lv.${level}</small></span>
      <em>${ready ? "준비됨" : "재료 확인"}</em>
    `;
    card.addEventListener("click", () => {
      selectedRecipe = recipe.id;
      state.selectedRecipe = recipe.id;
      renderRecipes();
      renderKitchenFocus();
      renderToday();
    });
    grid.appendChild(card);
  });
  renderKitchenFocus();
}

function renderIngredients() {
  const row = $("#ingredientRow");
  const ingredients = Object.entries(INGREDIENT_LABELS).filter(([key]) => key !== "shard");
  row.innerHTML = "";
  ingredients.forEach(([key, name]) => {
    const item = document.createElement("div");
    item.className = "ingredient";
    item.setAttribute("aria-label", `${name} ${state.ingredients[key] || 0}개`);
    item.innerHTML = `<i class="ingredient-mark ingredient-mark--${key}"></i><span>${name}</span><b>${state.ingredients[key] || 0}</b>`;
    row.appendChild(item);
  });
}

function renderKitchenFocus() {
  const recipe = recipes.find((item) => item.id === selectedRecipe && item.dish) || recipes[0];
  const level = state.recipes[recipe.id] || 1;
  const ready = canPay(recipe.cook) && state.energy >= BALANCE.cook.energyCost;
  const selectedIcon = $("#selectedRecipeIcon");
  selectedIcon.className = `focus-icon focus-icon--${recipe.id}`;
  selectedIcon.innerHTML = "";
  $("#selectedRecipeLevel").textContent = `Lv.${level} 레시피`;
  $("#selectedRecipeName").textContent = recipe.name;
  $("#selectedRecipeStatus").textContent = ready
    ? "재료와 에너지가 준비됐어요. 바로 요리할 수 있습니다."
    : "부족한 재료는 붉은 칩으로 표시했어요. 농장에서 먼저 준비해 주세요.";
  $("#recipeRequirementList").innerHTML = requirementMarkup(recipe.cook);
  const base = BALANCE.cook.basePayout + level * BALANCE.cook.payoutPerLevel;
  $("#selectedRecipeResult").textContent = `약 ${Math.round(base * cookMultiplier())} 코인 · 하트 ${1 + Math.floor(level / BALANCE.cook.heartLevelDivisor)}`;
  $("#cookButton").disabled = !ready;
}

function renderToday() {
  const recipe = recipes.find((item) => item.id === selectedRecipe && item.dish) || recipes[0];
  const readyFacilities = production.filter((item) => state.production[item.id].ready);
  const readyToCook = canPay(recipe.cook) && state.energy >= BALANCE.cook.energyCost;
  $("#todayRecipeName").textContent = recipe.name;
  $("#todayRecipeCopy").textContent = readyToCook
    ? "재료와 에너지가 준비됐어요. 오늘의 첫 요리를 바로 완성해 보세요."
    : "재료가 조금 부족해요. 농장에서 준비된 생산품을 먼저 확인해 보세요.";
  $("#todayRequirementList").innerHTML = requirementMarkup(recipe.cook);
  $("#readyCount").textContent = readyFacilities.length;
  $("#readySummary").textContent = readyFacilities.length
    ? `${readyFacilities.map((item) => item.name).slice(0, 2).join(" · ")} 수확 가능`
    : "모든 시설이 생산 중이에요";
  $("#chainFarmLabel").textContent = readyFacilities.length ? `${readyFacilities.length}곳 수확 가능` : "생산 진행 중";
  const primary = $("#todayPrimary");
  primary.dataset.action = readyToCook ? "cook" : "farm";
  primary.innerHTML = readyToCook ? `이 요리 만들기 <span>→</span>` : `부족한 재료 보러 가기 <span>→</span>`;
}

// Keep the 파견 map in sync with saved state so unlocks and the active route
// survive a reload instead of living only in DOM classes.
function renderDispatch() {
  const unlocked = state.dispatchUnlocked || DISPATCH_DEFAULT_UNLOCKED;
  $$(".node").forEach((node) => {
    const id = node.dataset.dispatch;
    const isFinal = node.classList.contains("final");
    node.classList.toggle("locked", !unlocked.includes(id) && !isFinal);
    node.classList.toggle("active", state.dispatch === id);
  });
}

function renderProduction() {
  const list = $("#productionList");
  list.innerHTML = "";
  production.forEach((item) => {
    const progress = state.production[item.id];
    const complete = progress.ready;
    const width = complete ? 100 : Math.max(0, 100 - (progress.remaining / item.duration) * 100);
    const card = document.createElement("article");
    card.className = `production-card ${complete ? "is-ready" : "is-running"}`;
    card.innerHTML = `
      <header class="facility-head"><span>${iconMarkup(item.art)}</span><em class="facility-state">${complete ? "준비됨" : "생산 중"}</em></header>
      <div class="facility-copy"><h2>${item.name}</h2><p>${rewardSummary(item.rewards)}</p></div>
      <footer class="production-footer"><span class="timer-dial" style="--progress:${width}%" aria-label="진행률 ${Math.round(width)}퍼센트"></span><button data-claim="${item.id}">${complete ? "수확하기" : formatTimer(progress.remaining)}</button></footer>
    `;
    const button = card.querySelector("button");
    button.disabled = !complete;
    button.addEventListener("click", () => {
      grantProduction(item);
      progress.remaining = item.duration;
      progress.ready = false;
      toast(`${item.name} 보상 획득`);
      render();
    });
    list.appendChild(card);
  });
  const readyTotal = production.filter((item) => state.production[item.id].ready).length;
  const collectButton = $("#collectButton");
  collectButton.disabled = readyTotal === 0;
  collectButton.innerHTML = `<span>농장</span><small>${readyTotal ? `준비된 재료 ${readyTotal}곳 받기` : "다음 재료를 생산 중"}</small>`;
  renderToday();
}

function getWidgetAmbientLabel(ambientState) {
  if (ambientState === "alert-idle") return "반죽 위에 앞발을 쉬고 있는 중";
  if (ambientState === "curious-idle") return "반죽 상태를 살펴보는 중";
  if (ambientState === "sleepy-idle") return "반죽 옆에서 졸음을 참는 중";
  if (ambientState === "doze") return "반죽 옆에서 꾸벅꾸벅 조는 중";
  if (ambientState === "return") return "돌아온 주인을 반기는 중";
  return "빵 반죽을 치대는 중";
}

/**
 * Projects authoritative taskbar state into DOM attributes. CSS is only a
 * presenter; timestamps and ambient state remain independent of the view so
 * the Unity port can reproduce them in a controller/Animator.
 */
function renderWidget() {
  const companion = $("#taskbarCompanion");
  const hitTarget = $("#tinyWidget");
  if (!companion || !hitTarget) return;

  const now = Date.now();
  const ambientState = WidgetCore.resolveAmbientState(
    widgetRuntime.lastActivityAt,
    now,
    widgetRuntime.returnUntil,
    widgetRuntime.workUntil
  );

  widgetRuntime.ambientState = ambientState;
  const pose = WidgetCore.resolveTaskbarPose({
    ambientState,
    motion: state.widget.motion,
    reaction: widgetRuntime.reaction
  });

  companion.dataset.ambient = ambientState;
  companion.dataset.reaction = widgetRuntime.reaction;
  companion.dataset.reactionSource = widgetRuntime.reactionSource;
  // Reassigning the same animated-image pose on every key can restart playback
  // in some browser engines.  Mutate only when the intensity tier changes.
  if (companion.dataset.pose !== pose) companion.dataset.pose = pose;
  companion.dataset.motion = state.widget.motion;
  companion.dataset.panel = state.panelOpen ? "open" : "closed";
  window.TaskbarCatPlayer?.sync({
    pose,
    reaction: widgetRuntime.reaction,
    reactionId: widgetRuntime.reactionToken,
    panelOpen: state.panelOpen,
    motion: state.widget.motion
  });
  hitTarget.setAttribute("aria-expanded", String(state.panelOpen));
  hitTarget.setAttribute(
    "aria-label",
    state.panelOpen
      ? "고양이를 눌러 가게 닫기"
      : `${getWidgetAmbientLabel(ambientState)}. 고양이를 눌러 가게 열기`
  );

  const taskbarResult = $("#taskbarResult");
  if (taskbarResult) taskbarResult.textContent = getWidgetAmbientLabel(ambientState);
}

function setWidgetReaction(kind, durationMs, source) {
  // A monotonically increasing token coalesces overlapping key pulses. Older
  // timeouts cannot clear a newer reaction, so normal typing never builds a
  // delayed animation queue. Unity should use the same replace-current rule.
  widgetRuntime.reactionToken += 1;
  const token = widgetRuntime.reactionToken;
  widgetRuntime.reaction = kind;
  widgetRuntime.reactionSource = source;
  renderWidget();

  window.setTimeout(() => {
    if (widgetRuntime.reactionToken !== token) return;
    widgetRuntime.reaction = "none";
    widgetRuntime.reactionSource = "none";
    renderWidget();
  }, durationMs);
}

function getNextIdleSniffDelay() {
  const delay = WIDGET_IDLE_SNIFF_INTERVALS_MS[
    widgetRuntime.idleEventIndex % WIDGET_IDLE_SNIFF_INTERVALS_MS.length
  ];
  widgetRuntime.idleEventIndex += 1;
  return delay;
}

function maybeRunWidgetAmbientEvent(now) {
  if (state.panelOpen || state.widget.motion !== "full") return;
  const ambientState = WidgetCore.resolveAmbientState(
    widgetRuntime.lastActivityAt,
    now,
    widgetRuntime.returnUntil,
    widgetRuntime.workUntil
  );
  if (ambientState !== "curious-idle") {
    widgetRuntime.nextIdleEventAt = 0;
    return;
  }
  if (widgetRuntime.reaction !== "none") return;
  if (!widgetRuntime.nextIdleEventAt) {
    widgetRuntime.nextIdleEventAt = now + getNextIdleSniffDelay();
    return;
  }
  if (now < widgetRuntime.nextIdleEventAt) return;
  widgetRuntime.nextIdleEventAt = now + getNextIdleSniffDelay();
  setWidgetReaction("idle-sniff", WIDGET_IDLE_SNIFF_HOLD_MS, "ambient");
}

function markWidgetActivity(now, startsWork) {
  const previousAmbient = WidgetCore.resolveAmbientState(
    widgetRuntime.lastActivityAt,
    now,
    widgetRuntime.returnUntil,
    widgetRuntime.workUntil
  );
  const wokeFromDoze = previousAmbient === "doze";
  if (wokeFromDoze) {
    widgetRuntime.returnUntil = now + WIDGET_WAKE_STARTLE_HOLD_MS;
  }
  widgetRuntime.lastActivityAt = now;
  widgetRuntime.nextIdleEventAt = 0;
  if (startsWork) {
    const workStart = wokeFromDoze ? widgetRuntime.returnUntil : now;
    widgetRuntime.workUntil = Math.max(widgetRuntime.workUntil, workStart + WIDGET_WORK_HOLD_MS);
  }
  return wokeFromDoze;
}

function recordKeyboardPulse(now) {
  // Only anonymous timestamps live in this short in-memory window.  We never
  // inspect key identity/content, persist the pulses, or connect their volume
  // to work duration/rewards.
  const wokeFromDoze = markWidgetActivity(now, true);
  if (wokeFromDoze) {
    widgetRuntime.keyPulseTimes = [];
    widgetRuntime.lastKeyReactionAt = now;
    setWidgetReaction("wake-startle", WIDGET_WAKE_STARTLE_HOLD_MS, "wake");
    return;
  }
  // Preserve the readable one-shot wake beat instead of allowing the second
  // physical key to replace it immediately. Input resumes normally afterward.
  if (widgetRuntime.reaction === "wake-startle") return;
  if (now - widgetRuntime.lastKeyReactionAt < WIDGET_KEY_COOLDOWN_MS) return;
  widgetRuntime.lastKeyReactionAt = now;

  const cutoff = now - WIDGET_TYPING_WINDOW_MS;
  widgetRuntime.keyPulseTimes = widgetRuntime.keyPulseTimes.filter((time) => time >= cutoff);
  widgetRuntime.keyPulseTimes.push(now);
  const intensity = WidgetCore.resolveTypingIntensity(widgetRuntime.keyPulseTimes.length);

  if (intensity === "overdrive") {
    setWidgetReaction("typing-overdrive", WIDGET_TYPING_OVERDRIVE_HOLD_MS, "input");
    return;
  }
  if (intensity === "fast") {
    setWidgetReaction("typing-fast", WIDGET_TYPING_FAST_HOLD_MS, "input");
    return;
  }

  widgetRuntime.keySide = widgetRuntime.keySide === "left" ? "right" : "left";
  setWidgetReaction(`key-${widgetRuntime.keySide}`, WIDGET_KEY_FEEDBACK_MS, "input");
}

function recordPointerPulse(now) {
  if (markWidgetActivity(now, false)) {
    setWidgetReaction("wake-startle", WIDGET_WAKE_STARTLE_HOLD_MS, "wake");
    return;
  }
  if (["wake-startle", "typing-fast", "typing-overdrive"].includes(widgetRuntime.reaction)) return;
  setWidgetReaction("idle-attention", WIDGET_IDLE_ATTENTION_HOLD_MS, "input");
}

function wireWidgetActivitySignals() {
  /*
   * Browser scope: these listeners see activity only while this page receives
   * events. A future Windows build must use an explicit opt-in platform adapter
   * and send only the same anonymous pulse categories to the game domain.
  */
  window.addEventListener("keydown", () => {
    if (!document.hidden && !state.panelOpen) recordKeyboardPulse(Date.now());
  }, { passive: true });

  window.addEventListener("click", () => {
    if (document.hidden || state.panelOpen) return;
    recordPointerPulse(Date.now());
  });

  window.addEventListener("wheel", () => {
    if (document.hidden || state.panelOpen) return;
    recordPointerPulse(Date.now());
  }, { passive: true });

}

function getWidgetViewportSize() {
  return { width: window.innerWidth, height: window.innerHeight };
}

function getWidgetElementSize(companion) {
  const bounds = companion.getBoundingClientRect();
  return { width: bounds.width, height: bounds.height };
}

function applyWidgetPixelPosition(companion, position) {
  const clamped = WidgetCore.clampTaskbarPixelPosition(
    position,
    getWidgetViewportSize(),
    getWidgetElementSize(companion)
  );
  companion.style.setProperty("--taskbar-cat-x", `${clamped.x}px`);
  companion.style.setProperty("--taskbar-cat-y", `${clamped.y}px`);
  companion.dataset.positioned = "true";
  return clamped;
}

/**
 * Restores the normalized top-left position and always projects it through the
 * current viewport. Unity's overlay adapter should perform the same operation
 * against the active monitor work area after DPI, taskbar, or monitor changes.
 */
function restoreWidgetPosition() {
  const companion = $("#taskbarCompanion");
  if (!companion) return;

  const viewport = getWidgetViewportSize();
  const element = getWidgetElementSize(companion);
  let pixelPosition;

  if (state.widget.position) {
    pixelPosition = WidgetCore.taskbarPositionFromNormalized(
      state.widget.position,
      viewport,
      element
    );
  } else {
    // Read the CSS default once, then convert it to the same normalized format
    // used by dragged positions so later resize handling has only one path.
    companion.style.removeProperty("--taskbar-cat-x");
    companion.style.removeProperty("--taskbar-cat-y");
    delete companion.dataset.positioned;
    const defaultBounds = companion.getBoundingClientRect();
    pixelPosition = { x: defaultBounds.left, y: defaultBounds.top };
  }

  const clamped = applyWidgetPixelPosition(companion, pixelPosition);
  state.widget.position = WidgetCore.taskbarPositionToNormalized(
    clamped,
    viewport,
    element
  );
}

function beginWidgetDrag(event) {
  // The companion remains the stable open/close control above the management
  // window. Keeping drag enabled in both states avoids a visible-but-inert cat;
  // Unity should likewise keep its overlay hit target active above the window.
  if (event.button !== 0 || !event.isPrimary) return;
  recordPointerPulse(Date.now());
  const companion = $("#taskbarCompanion");
  const hitTarget = $("#tinyWidget");
  if (!companion || !hitTarget) return;

  const bounds = companion.getBoundingClientRect();
  widgetRuntime.drag.pointerId = event.pointerId;
  widgetRuntime.drag.startClientX = event.clientX;
  widgetRuntime.drag.startClientY = event.clientY;
  widgetRuntime.drag.startLeft = bounds.left;
  widgetRuntime.drag.startTop = bounds.top;
  widgetRuntime.drag.moved = false;
  hitTarget.setPointerCapture(event.pointerId);
}

function moveWidgetDrag(event) {
  const drag = widgetRuntime.drag;
  if (drag.pointerId !== event.pointerId) return;

  const deltaX = event.clientX - drag.startClientX;
  const deltaY = event.clientY - drag.startClientY;
  if (!drag.moved && Math.hypot(deltaX, deltaY) < WIDGET_DRAG_THRESHOLD_PX) return;

  drag.moved = true;
  event.preventDefault();
  const companion = $("#taskbarCompanion");
  if (!companion) return;
  companion.dataset.dragging = "true";
  applyWidgetPixelPosition(companion, {
    x: drag.startLeft + deltaX,
    y: drag.startTop + deltaY
  });
}

function finishWidgetDrag(event) {
  const drag = widgetRuntime.drag;
  if (drag.pointerId === null || (event && drag.pointerId !== event.pointerId)) return;

  const pointerId = drag.pointerId;
  const wasDragged = drag.moved;
  drag.pointerId = null;
  drag.moved = false;

  const companion = $("#taskbarCompanion");
  const hitTarget = $("#tinyWidget");
  if (companion) delete companion.dataset.dragging;
  if (hitTarget?.hasPointerCapture(pointerId)) hitTarget.releasePointerCapture(pointerId);

  if (!wasDragged || !companion) return;
  if (event?.cancelable) event.preventDefault();

  const viewport = getWidgetViewportSize();
  const element = getWidgetElementSize(companion);
  const bounds = companion.getBoundingClientRect();
  const clamped = applyWidgetPixelPosition(companion, { x: bounds.left, y: bounds.top });
  state.widget.position = WidgetCore.taskbarPositionToNormalized(clamped, viewport, element);
  drag.suppressPointerClickUntil = performance.now() + WIDGET_DRAG_CLICK_SUPPRESSION_MS;
  saveState();
}

function suppressClickAfterWidgetDrag(event) {
  // Keyboard activation reports detail=0 and must never be consumed by a prior
  // pointer drag. Pointer click suppression also expires in case a browser
  // omits the synthetic click after preventDefault().
  if (event.detail === 0) return false;
  if (performance.now() > widgetRuntime.drag.suppressPointerClickUntil) {
    widgetRuntime.drag.suppressPointerClickUntil = 0;
    return false;
  }

  widgetRuntime.drag.suppressPointerClickUntil = 0;
  event.preventDefault();
  return true;
}

function wireWidgetDrag() {
  const hitTarget = $("#tinyWidget");
  if (!hitTarget) return;

  hitTarget.addEventListener("pointerdown", beginWidgetDrag);
  hitTarget.addEventListener("pointermove", moveWidgetDrag);
  hitTarget.addEventListener("pointerup", finishWidgetDrag);
  hitTarget.addEventListener("pointercancel", finishWidgetDrag);
  hitTarget.addEventListener("lostpointercapture", finishWidgetDrag);

  window.addEventListener("resize", () => {
    if (widgetRuntime.resizeFrame) window.cancelAnimationFrame(widgetRuntime.resizeFrame);
    widgetRuntime.resizeFrame = window.requestAnimationFrame(() => {
      widgetRuntime.resizeFrame = 0;
      if (widgetRuntime.drag.pointerId === null) restoreWidgetPosition();
    });
  });
}

function renderPanelState() {
  const panel = $("#gamePanel");
  panel.classList.toggle("collapsed", !state.panelOpen);
  panel.setAttribute("aria-hidden", String(!state.panelOpen));
  panel.toggleAttribute("inert", !state.panelOpen);
}

function selectPanelView(view) {
  if (!['today', 'kitchen', 'farm', 'cat'].includes(view)) return;
  activePanelView = view;
  renderPanelView();
}

function renderPanelView() {
  $$(".nav-item[data-view]").forEach((button) => {
    const active = button.dataset.view === activePanelView;
    button.classList.toggle("is-active", active);
    if (active) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });
  $$(".management-view[data-view-panel]").forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.viewPanel === activePanelView);
  });
}

function render() {
  renderPanelState();
  renderResources();
  renderSceneLife();
  renderParty();
  renderRecipes();
  renderIngredients();
  renderProduction();
  renderDispatch();
  renderToday();
  renderPanelView();
  renderWidget();
}

function toast(message) {
  const existing = $(".toast");
  if (existing) existing.remove();
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = message;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1650);
}

function upgradeSelectedRecipe() {
  const recipe = recipes.find((item) => item.id === selectedRecipe);
  if (!recipe) return;
  const level = state.recipes[recipe.id] || 1;
  const u = BALANCE.upgrade;
  const discount = upgradeCostFactor();
  const scaledCost = Object.fromEntries(
    Object.entries(recipe.cost).map(([key, amount]) => [
      key,
      Math.max(1, Math.ceil(amount * (1 + level * u.costGrowthPerLevel) * (key === "coins" ? discount : 1)))
    ])
  );
  if (!pay(scaledCost)) {
    toast("재료가 부족해요.");
    return;
  }
  state.recipes[recipe.id] = level + 1;
  state.skill = clamp(state.skill + u.skillPerUpgrade, 0, BALANCE.caps.skill);
  // Tell the player what the upgrade actually buys, per role.
  const role = recipe.dish ? "요리 등급" : recipe.farm ? "농장 숙련" : "도구 숙련";
  toast(`${recipe.name} ${role} Lv.${level + 1}`);
  render();
}

function cookOnce() {
  const recipe = recipes.find((item) => item.id === selectedRecipe);
  if (!recipe || !recipe.dish) {
    toast("요리할 요리를 먼저 골라주세요 (스튜·파스타·케이크·주스).");
    return;
  }
  const c = BALANCE.cook;
  if (state.energy < c.energyCost) {
    toast("에너지가 부족해요.");
    return;
  }
  // The farm supplies what the kitchen burns: no ingredients, no dish.
  if (!canPay(recipe.cook)) {
    toast(`${recipe.name} 재료가 부족해요. 농장에서 수확하세요.`);
    return;
  }
  pay(recipe.cook);
  state.energy -= c.energyCost;
  const level = recipeLv(recipe.id);
  const base = c.basePayout + level * c.payoutPerLevel;
  const gain = Math.round(base * cookMultiplier());
  const heartGain = 1 + Math.floor(level / c.heartLevelDivisor);
  state.coins += gain;
  state.hearts += heartGain;
  state.ingredients.shard += Math.random() < c.shardChance ? 1 : 0;
  state.focus = clamp(state.focus + c.focusPerCook, 0, BALANCE.caps.focus);
  toast(`${recipe.name} 완성 +${gain} 코인 · 하트 +${heartGain}`);
  render();
  serveSceneOrder(recipe.id);
}

function collectAllReady() {
  let claimed = 0;
  production.forEach((item) => {
    const progress = state.production[item.id];
    if (progress.ready) {
      grantProduction(item);
      progress.remaining = item.duration;
      progress.ready = false;
      claimed += 1;
    }
  });
  toast(claimed ? `${claimed}개 생산 보상 획득` : "아직 받을 생산품이 없어요.");
  render();
}

function decorate() {
  // Spend the hearts earned from cooking to raise the restaurant rating.
  // Rating feeds cookMultiplier(), so 배치 is a real investment, not a dead end.
  const d = BALANCE.decorate;
  if (state.hearts < d.heartCost) {
    toast(`배치에는 하트 ${d.heartCost}이 필요해요. 요리로 모으세요.`);
    return;
  }
  if (!pay({ coins: d.coinCost })) {
    toast("코인이 부족해요.");
    return;
  }
  state.hearts -= d.heartCost;
  const gain = d.baseAffection + (gearLv("apron") - 1) * d.apronFactor; // 앞치마가 배치 효율을 높인다
  state.affection = clamp(state.affection + gain, 0, BALANCE.caps.affection);
  toast(`식당 등급 상승 · 애정 +${gain} (요리 수익 ↑)`);
  render();
}

function resetGame() {
  if (!confirm("진행 상황을 초기화할까요?")) return;
  localStorage.removeItem(SAVE_KEY);
  state = structuredClone(baseState);
  state.widget = WidgetCore.normalizeWidgetState(undefined, undefined, Date.now());
  selectedRecipe = state.selectedRecipe;
  activePanelView = "today";
  resetSceneLife();
  widgetRuntime.lastActivityAt = Date.now();
  widgetRuntime.workUntil = 0;
  widgetRuntime.returnUntil = 0;
  widgetRuntime.ambientState = "alert-idle";
  widgetRuntime.reaction = "none";
  widgetRuntime.reactionSource = "none";
  widgetRuntime.reactionToken += 1;
  widgetRuntime.nextIdleEventAt = 0;
  widgetRuntime.idleEventIndex = 0;
  widgetRuntime.keySide = "right";
  widgetRuntime.lastKeyReactionAt = 0;
  widgetRuntime.keyPulseTimes = [];
  toast("초기화 완료");
  render();
  restoreWidgetPosition();
}

function wireEvents() {
  $("#tinyWidget").addEventListener("click", (event) => {
    // Opening the management panel must not also trigger the page-level
    // activity listener; the click belongs only to the panel toggle.
    event.stopPropagation();
    if (suppressClickAfterWidgetDrag(event)) return;
    markWidgetActivity(Date.now(), false);

    // The taskbar work is a continuous companion loop. The cat click has one
    // deterministic job: toggle the management panel.
    if (state.panelOpen) {
      state.panelOpen = false;
      render();
      return;
    }

    state.panelOpen = true;
    render();
  });
  $("#collapseButton").addEventListener("click", () => {
    state.panelOpen = false;
    render();
  });
  $("#saveButton").addEventListener("click", () => {
    saveState();
    toast("저장 완료");
  });
  $("#resetButton").addEventListener("click", resetGame);
  $("#upgradeSelected").addEventListener("click", upgradeSelectedRecipe);
  $("#cookButton").addEventListener("click", cookOnce);
  $("#todayPrimary").addEventListener("click", () => {
    if ($("#todayPrimary").dataset.action === "cook") cookOnce();
    else selectPanelView("farm");
  });
  $("#collectButton").addEventListener("click", collectAllReady);
  $("#decorateButton").addEventListener("click", decorate);

  $$(".gear").forEach((gearButton) => {
    gearButton.addEventListener("click", () => {
      $$(".gear").forEach((button) => button.classList.remove("selected"));
      gearButton.classList.add("selected");
      const gear = gearButton.dataset.gear;
      state.selectedGear = gear;
      const cost = { coins: BALANCE.gear.baseCost + state.gear[gear] * BALANCE.gear.costPerLevel };
      if (pay(cost)) {
        state.gear[gear] += 1;
        state.skill = clamp(state.skill + BALANCE.gear.skillPerUpgrade, 0, BALANCE.caps.skill);
        toast("장비 강화 완료");
      } else {
        toast("장비를 선택했어요.");
      }
      render();
    });
  });

  $$(".nav-item[data-view]").forEach((button) => {
    button.addEventListener("click", () => selectPanelView(button.dataset.view));
  });

  $$('[data-view-jump]').forEach((button) => {
    button.addEventListener("click", () => selectPanelView(button.dataset.viewJump));
  });

  $$(".node").forEach((node) => {
    node.addEventListener("click", () => {
      const target = node.dataset.dispatch;
      const route = dispatchRoutes[target];
      const unlocked = state.dispatchUnlocked || (state.dispatchUnlocked = [...DISPATCH_DEFAULT_UNLOCKED]);
      // Switching to the already-active node does nothing — no per-click coin
      // drip to farm. Unlocking costs, and each node grants a persistent bonus.
      if (!unlocked.includes(target)) {
        if (!pay(DISPATCH_UNLOCK_COST)) {
          toast("해금 재료가 부족해요 (코인 300·조각 1·보석 1).");
          return;
        }
        unlocked.push(target);
      }
      if (state.dispatch === target) {
        toast((route && route.label) || "이미 파견 중인 경로예요.");
        return;
      }
      state.dispatch = target;
      toast((route && route.label) || "파견 경로를 바꿨어요.");
      render();
    });
  });

  window.addEventListener("beforeunload", saveState);
}

wireEvents();
wireWidgetActivitySignals();
wireWidgetDrag();
render();
restoreWidgetPosition();
setInterval(tick, 1000);
setInterval(saveState, 10000);
