const SAVE_KEY = "taskbar-cat-hero-state-v1";

const recipes = [
  { id: "stew", icon: "🥘", name: "스튜", level: 1, cost: { coins: 80, tomato: 2, milk: 1 } },
  { id: "pasta", icon: "🍝", name: "파스타", level: 1, cost: { coins: 95, wheat: 2, tomato: 2 } },
  { id: "cake", icon: "🍰", name: "케이크", level: 1, cost: { coins: 120, egg: 1, milk: 2 } },
  { id: "juice", icon: "🥤", name: "주스", level: 1, cost: { coins: 70, carrot: 2, tomato: 1 } },
  { id: "spatula", icon: "🍴", name: "뒤집개", level: 1, cost: { coins: 110, wheat: 1 } },
  { id: "pot", icon: "🍲", name: "냄비", level: 1, cost: { coins: 130, milk: 1, egg: 1 } },
  { id: "roller", icon: "🥖", name: "밀대", level: 1, cost: { coins: 90, wheat: 3 } },
  { id: "book", icon: "📔", name: "레시피", level: 1, cost: { coins: 150, shard: 1 } },
  { id: "wheat", icon: "🌾", name: "밀", level: 1, cost: { coins: 50 } },
  { id: "carrot", icon: "🥕", name: "당근", level: 1, cost: { coins: 50 } },
  { id: "tomato", icon: "🍅", name: "토마토", level: 1, cost: { coins: 50 } },
  { id: "milk", icon: "🥛", name: "우유", level: 1, cost: { coins: 65 } }
];

const production = [
  { id: "field", icon: "🌾", name: "밀밭", duration: 30, rewards: { wheat: 4, coins: 12 } },
  { id: "bakery", icon: "🥖", name: "베이커리", duration: 45, rewards: { wheat: 2, egg: 1, coins: 22 } },
  { id: "truck", icon: "🚚", name: "배달차", duration: 60, rewards: { coins: 65, shard: 1 } },
  { id: "greenhouse", icon: "🏡", name: "온실", duration: 75, rewards: { tomato: 3, carrot: 3 } },
  { id: "village", icon: "🏘️", name: "마을", duration: 90, rewards: { hearts: 4, gems: 1 } }
];

const partyCats = [
  { id: "momo", color: "#fff4df", level: 12 },
  { id: "gray", color: "#5c6065", level: 10 },
  { id: "marmalade", color: "#ffd283", level: 11 },
  { id: "locked", color: "#e6c697", level: 0 }
];

const baseState = {
  panelOpen: true,
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
  widgetSeconds: 30,
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

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(SAVE_KEY));
    if (!saved) return structuredClone(baseState);
    return {
      ...structuredClone(baseState),
      ...saved,
      ingredients: { ...baseState.ingredients, ...saved.ingredients },
      gear: { ...baseState.gear, ...saved.gear },
      recipes: { ...baseState.recipes, ...saved.recipes },
      production: { ...baseState.production, ...saved.production }
    };
  } catch {
    return structuredClone(baseState);
  }
}

function saveState() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function formatTimer(seconds) {
  const safe = Math.max(0, Math.ceil(seconds));
  return `00:${String(safe).padStart(2, "0")}`;
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

function tick() {
  const now = Date.now();
  const delta = Math.min(5, (now - lastTick) / 1000);
  lastTick = now;

  const passiveRate = 1 + state.gear.spatula * 0.18 + state.recipes.stew * 0.08;
  state.widgetSeconds -= delta;

  if (state.widgetSeconds <= 0) {
    state.widgetSeconds = 30;
    state.actionIndex = (state.actionIndex + 1) % 4;
    addRewards({
      coins: Math.round(24 * passiveRate),
      wheat: 1,
      carrot: state.actionIndex % 2 === 0 ? 1 : 0,
      hearts: 1
    });
    state.affection = clamp(state.affection + 2, 0, 100);
    state.focus = clamp(state.focus + 1, 0, 100);
    toast("고양이가 작은 일을 끝냈어요.");
  }

  production.forEach((item) => {
    const progress = state.production[item.id];
    if (!progress.ready) {
      progress.remaining -= delta;
      if (progress.remaining <= 0) {
        progress.remaining = 0;
        progress.ready = true;
      }
    }
  });

  state.energy = clamp(state.energy + delta * 0.018, 0, 50);
  render();
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
    const card = document.createElement("button");
    card.className = "party-card";
    card.style.setProperty("--cat-color", cat.color);
    card.disabled = cat.level === 0;
    card.innerHTML = `<b>${cat.level ? cat.level : "🔒"}</b>`;
    card.addEventListener("click", () => {
      state.affection = clamp(state.affection + 1, 0, 100);
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
    card.innerHTML = `
      <small>Lv.${level}</small>
      <span class="icon">${recipe.icon}</span>
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
    ["wheat", "🌾"],
    ["carrot", "🥕"],
    ["tomato", "🍅"],
    ["milk", "🥛"],
    ["cheese", "🧀"],
    ["egg", "🥚"]
  ];
  row.innerHTML = "";
  ingredients.forEach(([key, icon]) => {
    const item = document.createElement("div");
    item.className = "ingredient";
    item.innerHTML = `${icon}<b>${state.ingredients[key] || 0}</b>`;
    row.appendChild(item);
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
      <div class="production-art">${item.icon}</div>
      <div class="progress"><i style="width:${width}%"></i></div>
      <button data-claim="${item.id}">${complete ? "받기" : formatTimer(progress.remaining)}</button>
    `;
    const button = card.querySelector("button");
    button.disabled = !complete;
    button.addEventListener("click", () => {
      addRewards(item.rewards);
      progress.remaining = item.duration;
      progress.ready = false;
      toast(`${item.name} 보상 획득`);
      render();
    });
    list.appendChild(card);
  });
}

function renderWidget() {
  $("#miniTimer").textContent = formatTimer(state.widgetSeconds);
  document.documentElement.style.setProperty("--mini-heart", `${clamp(state.affection, 0, 100)}%`);
  document.documentElement.style.setProperty("--mini-energy", `${clamp(state.energy * 2, 0, 100)}%`);
  const notes = ["냄비를 젓는 중...", "허브에 물 주는 중...", "접시를 정리하는 중...", "레시피를 넘기는 중..."];
  $("#activityNote").textContent = notes[state.actionIndex];
}

function renderPanelState() {
  $("#gamePanel").classList.toggle("collapsed", !state.panelOpen);
}

function render() {
  renderPanelState();
  renderResources();
  renderRecipes();
  renderIngredients();
  renderProduction();
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
  const scaledCost = Object.fromEntries(
    Object.entries(recipe.cost).map(([key, amount]) => [key, Math.ceil(amount * (1 + level * 0.35))])
  );
  if (!pay(scaledCost)) {
    toast("재료가 부족해요.");
    return;
  }
  state.recipes[recipe.id] = level + 1;
  state.skill = clamp(state.skill + 4, 0, 100);
  toast(`${recipe.name} Lv.${level + 1}`);
  render();
}

function cookOnce() {
  if (state.energy < 3) {
    toast("에너지가 부족해요.");
    return;
  }
  const gain = 35 + (state.recipes[selectedRecipe] || 1) * 6;
  state.energy -= 3;
  state.coins += gain;
  state.hearts += 1;
  state.ingredients.shard += Math.random() > 0.78 ? 1 : 0;
  state.focus = clamp(state.focus + 3, 0, 100);
  toast(`요리 완료 +${gain}🪙`);
  render();
}

function collectAllReady() {
  let claimed = 0;
  production.forEach((item) => {
    const progress = state.production[item.id];
    if (progress.ready) {
      addRewards(item.rewards);
      progress.remaining = item.duration;
      progress.ready = false;
      claimed += 1;
    }
  });
  toast(claimed ? `${claimed}개 생산 보상 획득` : "아직 받을 생산품이 없어요.");
  render();
}

function decorate() {
  if (!pay({ coins: 45 })) {
    toast("코인이 부족해요.");
    return;
  }
  state.affection = clamp(state.affection + 4, 0, 100);
  state.hearts += 2;
  toast("식당 분위기가 좋아졌어요.");
  render();
}

function resetGame() {
  if (!confirm("진행 상황을 초기화할까요?")) return;
  localStorage.removeItem(SAVE_KEY);
  state = structuredClone(baseState);
  selectedRecipe = state.selectedRecipe;
  toast("초기화 완료");
  render();
}

function wireEvents() {
  $("#tinyWidget").addEventListener("click", () => {
    state.panelOpen = !state.panelOpen;
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
      const cost = { coins: 90 + state.gear[gear] * 45 };
      if (pay(cost)) {
        state.gear[gear] += 1;
        state.skill = clamp(state.skill + 2, 0, 100);
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
      if (node.classList.contains("locked")) {
        if (!pay({ coins: 300, shard: 1 })) {
          toast("파견지를 열 재료가 부족해요.");
          return;
        }
        node.classList.remove("locked");
      }
      $$(".node").forEach((button) => button.classList.remove("active"));
      node.classList.add("active");
      state.coins += 18;
      toast("파견 경로를 바꿨어요.");
      render();
    });
  });

  window.addEventListener("beforeunload", saveState);
}

wireEvents();
renderParty();
render();
setInterval(tick, 1000);
setInterval(saveState, 10000);
