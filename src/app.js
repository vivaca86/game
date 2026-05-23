const dataFiles = {
  targets: "src/data/ko/content-targets.json",
  cards: "src/data/ko/cards.json",
  gems: "src/data/ko/gems.json",
  relics: "src/data/ko/relics.json",
  arcanas: "src/data/ko/arcanas.json",
  characters: "src/data/ko/characters.json",
  enemies: "src/data/ko/enemies.json",
  stages: "src/data/ko/stages.json",
  events: "src/data/ko/events.json",
  achievements: "src/data/ko/achievements.json"
};

const labels = {
  cards: "카드",
  gems: "보석",
  relics: "유물",
  arcanas: "기운",
  characters: "캐릭터",
  enemies: "몬스터",
  stages: "스테이지",
  events: "이벤트",
  achievements: "업적"
};

const rarityLabels = {
  basic: "기본",
  common: "일반",
  uncommon: "고급",
  rare: "희귀",
  legendary: "전설"
};

const typeLabels = {
  attack: "공격",
  guard: "방어",
  skill: "기술",
  power: "지속",
  curse: "방해",
  temp: "임시"
};

function qs(selector) {
  return document.querySelector(selector);
}

async function loadJson(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`${path} 로딩 실패`);
  }
  return response.json();
}

function renderSummary(data) {
  const grid = qs("#summaryGrid");
  const targets = data.targets.targets;
  const rows = Object.entries(labels).map(([key, label]) => {
    const current = data[key].length;
    const target = targets[key] || current;
    const ratio = Math.min(100, Math.round((current / target) * 100));
    return `
      <article class="summary-card">
        <div>
          <span>${label}</span>
          <strong>${current} / ${target}</strong>
        </div>
        <div class="progress"><i style="width:${ratio}%"></i></div>
      </article>
    `;
  });
  grid.innerHTML = rows.join("");
}

function renderCards(cards) {
  qs("#cardCountBadge").textContent = `${cards.length}장`;
  qs("#cardList").innerHTML = cards.map((card) => `
    <article class="sample-card" data-type="${card.type}" style="--card-accent:${accentFor(card.color)}">
      <div class="sample-card-top">
        <span class="cost">${card.cost}</span>
        <div>
          <strong>${card.name}</strong>
          <span>${typeLabels[card.type] || card.type} · ${rarityLabels[card.rarity] || card.rarity}</span>
        </div>
      </div>
      <div class="art-window">
        <span>${card.illustration.subject}</span>
      </div>
      <p>${card.text}</p>
      <div class="tag-row">
        ${card.tags.map((tag) => `<span>${tag}</span>`).join("")}
      </div>
    </article>
  `).join("");
}

function renderStages(stages, enemies) {
  const enemyById = new Map(enemies.map((enemy) => [enemy.id, enemy]));
  qs("#stageList").innerHTML = stages.map((stage) => {
    const boss = enemyById.get(stage.bossEnemyId);
    return `
      <article class="stage-card">
        <span class="stage-order">${stage.order}</span>
        <div>
          <strong>${stage.name}</strong>
          <p>${stage.biome}</p>
          <small>${stage.floorCount}개 방 · 보스 ${boss?.name || "미정"}</small>
        </div>
      </article>
    `;
  }).join("");
}

function accentFor(color) {
  const palette = {
    coral: "#ff7d7d",
    sky: "#72b8ff",
    mint: "#67d9a5",
    peach: "#ffb36b",
    lavender: "#a99cff",
    yellow: "#ffd45f"
  };
  return palette[color] || "#8fb3ff";
}

async function main() {
  const entries = await Promise.all(
    Object.entries(dataFiles).map(async ([key, path]) => [key, await loadJson(path)])
  );
  const data = Object.fromEntries(entries);
  renderSummary(data);
  renderCards(data.cards);
  renderStages(data.stages, data.enemies);
}

main().catch((error) => {
  document.body.innerHTML = `<main class="app-shell"><section class="panel"><h1>데이터 로딩 실패</h1><p>${error.message}</p></section></main>`;
});
