import { loadGameData } from "./core/data-loader.js";
import { nextIntent, playCard, endTurn } from "./core/combat.js";
import { advanceRoom, startRun } from "./core/progression.js";
import { applyEventChoice, applyRewardOption, rerollReward } from "./core/rewards.js";
import { cardCost } from "./core/card-effects.js";
import {
  canEquipGemToCard,
  ensureGemState,
  equipGemToCard,
  grantGem,
  normalizeCardSockets,
  openSocketForCard,
  socketCapacity,
  unequipGem,
  unequippedGemInstances
} from "./core/gems.js";
import { adjustedRewardCost, ensureModifierState, grantArcana, grantRelic } from "./core/run-modifiers.js";
import { clearSavedRun, hasSavedRun, loadSavedRun, saveRun } from "./core/persistence.js";

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
      <button class="secondary-btn" id="loadRunButton" ${hasSavedRun() ? "" : "disabled"}>저장 불러오기</button>
    </div>
    <div id="runRoot"></div>
  `;
  qs("#startRunButton").addEventListener("click", () => {
    const characterId = qs("#characterSelect").value;
    const stageId = qs("#stageSelect").value;
    runtime.state = startRun(index, { characterId, stageId, seed: 20260523 });
    saveRun(runtime.state);
    renderGameSetup(index);
    renderRun();
  });
  qs("#loadRunButton").addEventListener("click", () => {
    runtime.state = loadSavedRun(index);
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
  ensureGemState(state);
  ensureModifierState(state);
  root.innerHTML = `
    <section class="run-board">
      <div class="run-status">
        <strong>${character.name}</strong>
        <span>${stage.name} · ${state.roomIndex + 1}/${stage.rooms.length} · ${phaseLabel(state.phase)}</span>
        <span>체력 ${state.player.hp}/${state.player.maxHp}</span>
        <span>보호막 ${state.player.shield}</span>
        <span>기운 ${state.player.energy}/${state.player.maxEnergy}</span>
        <span>별사탕 ${state.player.gold}</span>
        <span>보석 ${state.inventory.gemBag.length}개</span>
        <span>장착 ${state.inventory.gemBag.filter((gem) => gem.equippedCardId).length}개</span>
        <span>유물 ${state.inventory.relics.length}개</span>
        <span>기운 ${state.inventory.arcanas.length}개</span>
        ${state.status.revealedNextRoomType ? `<span>다음 방 ${phaseLabel(state.status.revealedNextRoomType)}</span>` : ""}
      </div>
      <div class="run-actions">
        <button class="secondary-btn" data-action="save-run">저장</button>
        <button class="secondary-btn" data-action="clear-save">저장 삭제</button>
      </div>
      ${renderPhase(state, index)}
      ${renderBuildPanel(state, index)}
      ${renderGemVault(state, index)}
      <div class="log-list">${state.log.map((log) => `<span>${escapeHtml(log)}</span>`).join("")}</div>
    </section>
  `;
  bindRunActions();
}

function renderPhase(state, index) {
  if (state.phase === "combat") return renderCombat(state, index);
  if (state.phase === "event") return renderEvent(state, index);
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
          const cost = cardCost(card, state, index);
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

function renderBuildPanel(state, index) {
  ensureModifierState(state);
  const relics = state.inventory.relics.map((id) => index.relics.get(id)).filter(Boolean);
  const arcanas = state.inventory.arcanas.map((id) => index.arcanas.get(id)).filter(Boolean);
  return `
    <section class="build-panel">
      <div class="panel-head compact-head">
        <h2>현재 빌드</h2>
        <span>유물 ${relics.length} · 기운 ${arcanas.length}</span>
      </div>
      <div class="build-grid">
        <div class="build-column">
          <strong>유물</strong>
          <div class="build-chip-list">
            ${relics.length === 0 ? "<span class='muted'>보유 유물 없음</span>" : relics.map((relic) => `<span class="build-chip relic-chip" title="${relic.text}">${relic.name}</span>`).join("")}
          </div>
          <button class="secondary-btn" data-action="debug-relic">유물 지급</button>
        </div>
        <div class="build-column">
          <strong>기운</strong>
          <div class="build-chip-list">
            ${arcanas.length === 0 ? "<span class='muted'>보유 기운 없음</span>" : arcanas.map((arcana) => `<span class="build-chip arcana-chip" title="${arcana.text}">${arcana.name}</span>`).join("")}
          </div>
          <button class="secondary-btn" data-action="debug-arcana">기운 지급</button>
        </div>
      </div>
    </section>
  `;
}

function renderGemVault(state, index) {
  ensureGemState(state);
  const uniqueDeckIds = [...new Set(state.deck)].slice(0, 8);
  return `
    <section class="gem-vault">
      <div class="panel-head compact-head">
        <h2>보석 보관함</h2>
        <span>${state.inventory.gemBag.length}개 보유</span>
      </div>
      <div class="gem-vault-grid">
        <div class="gem-bag">
          <strong>미장착 보석</strong>
          <div class="gem-chip-list">
            ${unequippedGemInstances(state).length === 0 ? "<span class='muted'>미장착 보석 없음</span>" : unequippedGemInstances(state).map((instance) => {
              const gem = index.gems.get(instance.gemId);
              return `<span class="gem-chip" title="${gem.text}">${gem.name}</span>`;
            }).join("")}
          </div>
          <button class="secondary-btn" data-action="debug-gem">보석 지급</button>
        </div>
        <div class="socket-list">
          ${uniqueDeckIds.map((cardId) => renderSocketCard(state, index, cardId)).join("")}
        </div>
      </div>
    </section>
  `;
}

function renderSocketCard(state, index, cardId) {
  const card = index.cards.get(cardId);
  const sockets = normalizeCardSockets(state, index, cardId);
  const capacity = socketCapacity(state, index, cardId);
  const validGems = unequippedGemInstances(state).filter((instance) => {
    const gem = index.gems.get(instance.gemId);
    return gem && canEquipGemToCard(gem, card);
  }).slice(0, 4);
  const canOpenSocket = capacity < card.sockets.max && ((state.status.socketBonus || 0) > 0 || (state.status.gemWorkshopCharges || 0) > 0);
  return `
    <article class="socket-card" style="--card-accent:${accentFor(card.color)}">
      <div>
        <strong>${card.name}</strong>
        <small>${typeLabels[card.type] || card.type} · 소켓 ${capacity}/${card.sockets.max}</small>
      </div>
      <div class="socket-row">
        ${sockets.map((instanceId, slotIndex) => {
          const instance = state.inventory.gemBag.find((gem) => gem.instanceId === instanceId);
          const gem = instance ? index.gems.get(instance.gemId) : null;
          return `
            <span class="socket-dot ${gem ? "filled" : ""}">
              ${gem ? `<button data-action="unequip-gem" data-gem-instance-id="${instance.instanceId}" title="해제">${gem.name}</button>` : `빈 소켓 ${slotIndex + 1}`}
            </span>
          `;
        }).join("")}
      </div>
      <div class="socket-actions">
        ${canOpenSocket ? `<button class="secondary-btn" data-action="open-socket" data-card-id="${card.id}">소켓 +1</button>` : ""}
        ${validGems.map((instance) => {
          const gem = index.gems.get(instance.gemId);
          const isFull = sockets.every(Boolean);
          return `<button class="secondary-btn" data-action="equip-gem" data-card-id="${card.id}" data-gem-instance-id="${instance.instanceId}">${isFull ? "교체" : "장착"}: ${gem.name}</button>`;
        }).join("")}
      </div>
    </article>
  `;
}

function renderEvent(state, index) {
  const event = state.pendingEvent;
  return `
    <div class="choice-box">
      <strong>${event.name}</strong>
      <p>${event.text}</p>
      <div class="choice-list">
        ${event.choices.map((choice, choiceIndex) => {
          const cost = adjustedRewardCost(state, index, choice.cost || {}, { source: event.type, reward: choice.reward || {} });
          return `
          <button class="choice-btn" data-action="event-choice" data-choice-index="${choiceIndex}" ${canPayCost(state, cost) ? "" : "disabled"}>
            <strong>${choice.label}</strong>
            <span>${costLabel(cost)} ${rewardLabel(choice.reward)}</span>
          </button>
        `;
        }).join("")}
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
          <button class="choice-btn" data-action="reward-choice" data-reward-id="${option.id}" ${option.cost && !canPayCost(state, option.cost) ? "disabled" : ""}>
            <strong>${option.title}</strong>
            <span>${option.cost ? `${costLabel(option.cost)} · ` : ""}${option.description}</span>
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
      if (action === "equip-gem") equipGemToCard(state, index, button.dataset.gemInstanceId, button.dataset.cardId);
      if (action === "unequip-gem") unequipGem(state, button.dataset.gemInstanceId);
      if (action === "open-socket") openSocketForCard(state, index, button.dataset.cardId);
      if (action === "debug-gem") grantGem(state, index.data.gems[state.inventory.gemBag.length % index.data.gems.length].id);
      if (action === "debug-relic") {
        const nextRelic = index.data.relics.find((relic) => !state.inventory.relics.includes(relic.id));
        if (nextRelic) grantRelic(state, index, nextRelic.id);
      }
      if (action === "debug-arcana") {
        const nextArcana = index.data.arcanas.find((arcana) => !state.inventory.arcanas.includes(arcana.id));
        if (nextArcana) grantArcana(state, index, nextArcana.id);
      }
      if (action === "save-run") saveRun(state);
      if (action === "clear-save") {
        clearSavedRun();
      } else {
        saveRun(runtime.state);
      }
      renderRun();
    });
  });
}

function phaseLabel(phase) {
  return ({ combat: "전투", elite: "정예", boss: "보스", shop: "상점", rest: "휴식", event: "이벤트", reward: "보상", room_complete: "방 완료", stage_clear: "클리어", defeat: "실패" })[phase] || phase;
}

function costLabel(cost = {}) {
  if (cost.gold) return `비용 별사탕 ${cost.gold}`;
  if (cost.hp) return `비용 체력 ${cost.hp}`;
  return "비용 없음";
}

function canPayCost(state, cost = {}) {
  if (cost.gold && state.player.gold < cost.gold) return false;
  if (cost.hp && state.player.hp <= cost.hp) return false;
  return true;
}

function rewardLabel(reward = {}) {
  if (reward.cardPool) return "· 카드 보상";
  if (reward.gemPool) return "· 보석 보상";
  if (reward.relicPool) return "· 유물 보상";
  if (reward.arcanaPool) return "· 기운 보상";
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
