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
  { id: "momo", portrait: "momo", level: 12 },
  { id: "gray", portrait: "gray", level: 10 },
  { id: "marmalade", portrait: "marmalade", level: 11 },
  { id: "locked", portrait: "calico", level: 0 }
];

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
let selectedRecipe = state.selectedRecipe;

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
const WIDGET_TYPING_FAST_HOLD_MS = 620;
const WIDGET_TYPING_OVERDRIVE_HOLD_MS = 780;
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
    card.setAttribute("aria-label", recruited ? `${cat.id} Lv.${cat.level || 1}` : "고양이 영입");
    card.innerHTML = recruited
      ? `<b>Lv.${cat.level || 1}</b>`
      : `<b class="party-lock"><span class="ui-symbol ui-symbol--lock"></span></b>`;
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
  recipes.forEach((recipe) => {
    const level = state.recipes[recipe.id] || 1;
    const card = document.createElement("button");
    card.className = `recipe-card ${selectedRecipe === recipe.id ? "selected" : ""}`;
    card.setAttribute("aria-label", `${recipe.name} Lv.${level}`);
    card.innerHTML = `
      <small>Lv.${level}</small>
      <span class="icon"><i class="menu-icon menu-icon--${recipe.icon}"></i></span>
      <div class="progress"><i style="width:${Math.min(100, 28 + level * 9)}%"></i></div>
    `;
    card.addEventListener("click", () => {
      selectedRecipe = recipe.id;
      state.selectedRecipe = recipe.id;
      renderRecipes();
    });
    grid.appendChild(card);
  });
}

function renderIngredients() {
  const row = $("#ingredientRow");
  const ingredients = [
    ["wheat", "밀"],
    ["carrot", "당근"],
    ["tomato", "토마토"],
    ["milk", "우유"],
    ["cheese", "치즈"],
    ["egg", "달걀"]
  ];
  row.innerHTML = "";
  ingredients.forEach(([key, name]) => {
    const item = document.createElement("div");
    item.className = "ingredient";
    item.setAttribute("aria-label", `${name} ${state.ingredients[key] || 0}개`);
    item.innerHTML = `<i class="menu-icon menu-icon--${key}"></i><b>${state.ingredients[key] || 0}</b>`;
    row.appendChild(item);
  });
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
    const width = complete ? 100 : 100 - (progress.remaining / item.duration) * 100;
    const card = document.createElement("article");
    card.className = "production-card";
    card.innerHTML = `
      <div class="production-art production-art--${item.art}"><strong>${item.name}</strong></div>
      <div class="progress"><i style="width:${width}%"></i></div>
      <button data-claim="${item.id}">${complete ? "받기" : formatTimer(progress.remaining)}</button>
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
  hitTarget.setAttribute("aria-expanded", String(state.panelOpen));
  hitTarget.setAttribute(
    "aria-label",
    state.panelOpen
      ? "고양이를 눌러 가게 닫기"
      : `${getWidgetAmbientLabel(ambientState)}. 고양이를 눌러 가게 열기`
  );

  const notes = ["한 덩이 반죽을 치대는 중...", "반죽 결을 살피는 중...", "작업대를 정리하는 중...", "다음 치대기 박자를 맞추는 중..."];
  const activityNote = $("#activityNote");
  if (activityNote) activityNote.textContent = notes[state.actionIndex];
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

function render() {
  renderPanelState();
  renderResources();
  renderParty();
  renderRecipes();
  renderIngredients();
  renderProduction();
  renderDispatch();
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

  $$(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      $$(".tab").forEach((button) => button.classList.remove("active"));
      tab.classList.add("active");
      toast(`${tab.getAttribute("aria-label")} 보기`);
    });
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
