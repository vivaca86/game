import { loadGameData } from "./core/data-loader.js";
import { nextIntent, playCard, endTurn } from "./core/combat.js";
import { advanceRoom, startRun } from "./core/progression.js";
import { applyEventChoice, applyRewardOption, rerollReward } from "./core/rewards.js";
import { cardCost } from "./core/card-effects.js";

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
  qs("#cardList").innerHTML = cards.slice(0, 12).map((card) => `
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

let runtime = null;

async function main() {
  runtime = await loadGameData();
  const { data, index } = runtime;
  renderSummary(data);
  renderCards(data.cards);
  renderStages(data.stages, data.enemies);
  renderGameSetup(index);
}

function renderGameSetup(index) {
  const root = qs("#gameRoot");
  root.innerHTML = `
    <div class="setup-grid">
      <label>캐릭터
        <select id="characterSelect">
          ${index.data.characters.map((character) => `<option value="${character.id}">${character.name} · ${character.role}</option>`).join("")}
        </select>
      </label>
      <label>스테이지
        <select id="stageSelect">
          ${index.data.stages.map((stage) => `<option value="${stage.id}">${stage.order}. ${stage.name}</option>`).join("")}
        </select>
      </label>
      <button class="primary-btn" id="startRunButton">탐험 시작</button>
    </div>
    <div id="runRoot"></div>
  `;
  qs("#startRunButton").addEventListener("click", () => {
    const characterId = qs("#characterSelect").value;
    const stageId = qs("#stageSelect").value;
    runtime.state = startRun(index, { characterId, stageId, seed: 20260523 });
    renderRun();
  });
}

function renderRun() {
  const { state, index } = runtime;
  const root = qs("#runRoot");
  if (!state) {
    root.innerHTML = "";
    return;
  }
  const character = index.characters.get(state.characterId);
  const stage = index.stages.get(state.stageId);
  root.innerHTML = `
    <section class="run-board">
      <div class="run-status">
        <strong>${character.name}</strong>
        <span>${stage.name} · ${state.roomIndex + 1}/${stage.rooms.length} · ${phaseLabel(state.phase)}</span>
        <span>체력 ${state.player.hp}/${state.player.maxHp}</span>
        <span>보호막 ${state.player.shield}</span>
        <span>기운 ${state.player.energy}/${state.player.maxEnergy}</span>
        <span>별사탕 ${state.player.gold}</span>
      </div>
      ${renderPhase(state, index)}
      <div class="log-list">${state.log.map((log) => `<span>${escapeHtml(log)}</span>`).join("")}</div>
    </section>
  `;
  bindRunActions();
}

function renderPhase(state, index) {
  if (state.phase === "combat") return renderCombat(state, index);
  if (state.phase === "event") return renderEvent(state);
  if (state.phase === "reward") return renderReward(state);
  if (state.phase === "room_complete") return `<button class="primary-btn" data-action="advance">다음 방으로</button>`;
  if (state.phase === "stage_clear") return `<div class="clear-box"><strong>스테이지 클리어</strong><button class="primary-btn" data-action="restart">다시 탐험</button></div>`;
  if (state.phase === "defeat") return `<div class="clear-box"><strong>탐험 실패</strong><button class="primary-btn" data-action="restart">다시 탐험</button></div>`;
  return "";
}

function renderCombat(state, index) {
  return `
    <div class="combat-grid">
      <section class="enemy-row">
        ${state.enemies.map((enemy) => {
          const intent = nextIntent(enemy, state.turn);
          return `
            <article class="enemy-card">
              <strong>${enemy.name}</strong>
              <span>${enemy.rank === "boss" ? "보스" : enemy.rank === "elite" ? "정예" : "일반"}</span>
              <div class="hp-line"><i style="width:${Math.max(0, Math.round((enemy.hp / enemy.maxHp) * 100))}%"></i></div>
              <small>체력 ${enemy.hp}/${enemy.maxHp} · 방어 ${enemy.block || 0}</small>
              <small>의도: ${intent.label}</small>
            </article>
          `;
        }).join("")}
      </section>
      <section class="hand-row">
        ${state.hand.map((cardId, handIndex) => {
          const card = index.cards.get(cardId);
          const cost = cardCost(card, state);
          return `
            <button class="play-card" data-action="play-card" data-hand-index="${handIndex}" style="--card-accent:${accentFor(card.color)}" ${cost > state.player.energy ? "disabled" : ""}>
              <span class="cost">${cost}</span>
              <strong>${card.name}</strong>
              <small>${typeLabels[card.type] || card.type}</small>
              <p>${card.text}</p>
            </button>
          `;
        }).join("")}
      </section>
      <button class="secondary-btn" data-action="end-turn">턴 종료</button>
    </div>
  `;
}

function renderEvent(state) {
  const event = state.pendingEvent;
  return `
    <div class="choice-box">
      <strong>${event.name}</strong>
      <p>${event.text}</p>
      <div class="choice-list">
        ${event.choices.map((choice, index) => `
          <button class="choice-btn" data-action="event-choice" data-choice-index="${index}">
            <strong>${choice.label}</strong>
            <span>${costLabel(choice.cost)} ${rewardLabel(choice.reward)}</span>
          </button>
        `).join("")}
      </div>
    </div>
  `;
}

function renderReward(state) {
  const reward = state.pendingReward;
  return `
    <div class="choice-box">
      <strong>보상 선택</strong>
      <div class="choice-list">
        ${reward.options.map((option) => `
          <button class="choice-btn" data-action="reward-choice" data-reward-id="${option.id}">
            <strong>${option.title}</strong>
            <span>${option.description}</span>
          </button>
        `).join("")}
      </div>
      <button class="secondary-btn" data-action="reroll" ${reward.rerolls <= 0 ? "disabled" : ""}>다시 보기 ${reward.rerolls}</button>
    </div>
  `;
}

function bindRunActions() {
  const { state, index } = runtime;
  qs("#runRoot").querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.action;
      if (action === "play-card") playCard(state, index, Number(button.dataset.handIndex));
      if (action === "end-turn") endTurn(state, index);
      if (action === "reward-choice") applyRewardOption(state, index, button.dataset.rewardId);
      if (action === "event-choice") applyEventChoice(state, index, Number(button.dataset.choiceIndex));
      if (action === "reroll") rerollReward(state, index);
      if (action === "advance") advanceRoom(state, index);
      if (action === "restart") runtime.state = startRun(index, { characterId: state.characterId, stageId: state.stageId, seed: Date.now() });
      renderRun();
    });
  });
}

function phaseLabel(phase) {
  return ({ combat: "전투", event: "이벤트", reward: "보상", room_complete: "방 완료", stage_clear: "클리어", defeat: "실패" })[phase] || phase;
}

function costLabel(cost = {}) {
  if (cost.gold) return `비용 별사탕 ${cost.gold}`;
  if (cost.hp) return `비용 체력 ${cost.hp}`;
  return "비용 없음";
}

function rewardLabel(reward = {}) {
  if (reward.cardPool) return "· 카드 보상";
  if (reward.gemPool) return "· 보석 보상";
  if (reward.relicPool) return "· 유물 보상";
  if (reward.heal) return `· 체력 ${reward.heal} 회복`;
  if (reward.combat) return "· 전투 보상";
  return "";
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}

main().catch((error) => {
  document.body.innerHTML = `<main class="app-shell"><section class="panel"><h1>데이터 로딩 실패</h1><p>${error.message}</p></section></main>`;
});
