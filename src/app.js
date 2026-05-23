import { loadGameData } from "./core/data-loader.js";
import { cleanseDisruption, disruptionCleanseCost, intentDetail, nextIntent, playCard, endTurn } from "./core/combat.js";
import { advanceRoom, startRun } from "./core/progression.js";
import { applyEventChoice, applyRewardOption, rerollReward } from "./core/rewards.js";
import { cardCost } from "./core/card-effects.js";
import {
  canEquipGemToCard,
  ensureGemState,
  equipGemToCard,
  equippedGemInstancesForCard,
  grantGem,
  normalizeCardSockets,
  openSocketForCard,
  socketCapacity,
  unequipGem,
  unequippedGemInstances
} from "./core/gems.js";
import { adjustedRewardCost, ensureModifierState, grantArcana, grantRelic } from "./core/run-modifiers.js";
import { bossPhaseBlock } from "./core/balance.js";
import { clearSavedRun, hasSavedRun, loadSavedRun, saveRun } from "./core/persistence.js";
import {
  applyProfileToRun,
  availableIds,
  clearProfile,
  finalizeRunProfile,
  isUnlocked,
  loadProfile,
  saveProfile
} from "./core/profile.js";

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

const gemTypeLabels = {
  all: "전체",
  attack: "공격",
  guard: "방어",
  skill: "기술",
  power: "지속"
};

const colorLabels = {
  coral: "산호",
  sky: "구름",
  mint: "민트",
  peach: "복숭아",
  lavender: "라벤더",
  yellow: "아침"
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
      ${renderCardArt(card, "sample")}
      <p>${card.text}</p>
      <div class="tag-row">
        ${card.tags.map((tag) => `<span>${tag}</span>`).join("")}
      </div>
    </article>
  `).join("");
}

function renderStages(stages, enemies, profile) {
  const enemyById = new Map(enemies.map((enemy) => [enemy.id, enemy]));
  qs("#stageList").innerHTML = stages.map((stage) => {
    const boss = enemyById.get(stage.bossEnemyId);
    const unlocked = !profile || isUnlocked(profile, "unlockedStages", stage.id);
    const cleared = profile?.clearedStages?.includes(stage.id);
    return `
      <article class="stage-card ${unlocked ? "" : "locked"} ${cleared ? "cleared" : ""}">
        <span class="stage-order">${stage.order}</span>
        <div>
          <strong>${stage.name}${cleared ? " · 클리어" : unlocked ? "" : " · 잠김"}</strong>
          <p>${stage.biome}</p>
          <small>${stage.floorCount}개 방 · 보스 ${boss?.name || "미정"}</small>
          ${renderStageRoomStrip(stage)}
        </div>
      </article>
    `;
  }).join("");
}

function renderStageRoomStrip(stage) {
  return `
    <div class="stage-room-strip" aria-label="${stage.name} 방 구성">
      ${stage.rooms.map((roomType, roomIndex) => `
        <span class="room-mini room-${roomType}" title="${roomIndex + 1}번 방 · ${roomLabel(roomType)}">${roomIcon(roomType)}</span>
      `).join("")}
    </div>
  `;
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
  runtime.profile = loadProfile(index);
  renderSummary(data);
  renderCards(data.cards);
  renderStages(data.stages, data.enemies, runtime.profile);
  renderGameSetup(index);
}

function renderGameSetup(index) {
  const root = qs("#gameRoot");
  const profile = runtime.profile;
  const selectedCharacterId = index.data.characters.find((character) => isUnlocked(profile, "unlockedCharacters", character.id))?.id || index.data.characters[0]?.id;
  const selectedStageId = index.data.stages.find((stage) => isUnlocked(profile, "unlockedStages", stage.id))?.id || index.data.stages[0]?.id;
  root.innerHTML = `
    ${renderProfilePanel(profile, index)}
    <div class="setup-grid">
      <label>캐릭터
        <select id="characterSelect">
          ${index.data.characters.map((character) => {
            const unlocked = isUnlocked(profile, "unlockedCharacters", character.id);
            return `<option value="${character.id}" ${unlocked ? "" : "disabled"} ${character.id === selectedCharacterId ? "selected" : ""}>${unlocked ? "" : "잠김 · "}${character.name} · ${character.role}</option>`;
          }).join("")}
        </select>
      </label>
      <label>스테이지
        <select id="stageSelect">
          ${index.data.stages.map((stage) => {
            const unlocked = isUnlocked(profile, "unlockedStages", stage.id);
            const cleared = profile.clearedStages.includes(stage.id);
            return `<option value="${stage.id}" ${unlocked ? "" : "disabled"} ${stage.id === selectedStageId ? "selected" : ""}>${unlocked ? "" : "잠김 · "}${stage.order}. ${stage.name}${cleared ? " · 클리어" : ""}</option>`;
          }).join("")}
        </select>
      </label>
      <button class="primary-btn" id="startRunButton">탐험 시작</button>
      <button class="secondary-btn" id="loadRunButton" ${hasSavedRun() ? "" : "disabled"}>저장 불러오기</button>
      <button class="secondary-btn" id="clearProfileButton">진행 초기화</button>
    </div>
    <div id="setupPreview" class="setup-preview">
      ${renderSetupPreview(index, profile, selectedCharacterId, selectedStageId)}
    </div>
    <div id="runRoot"></div>
  `;
  const refreshSetupPreview = () => {
    qs("#setupPreview").innerHTML = renderSetupPreview(index, profile, qs("#characterSelect").value, qs("#stageSelect").value);
  };
  qs("#characterSelect").addEventListener("change", refreshSetupPreview);
  qs("#stageSelect").addEventListener("change", refreshSetupPreview);
  qs("#startRunButton").addEventListener("click", () => {
    const characterId = qs("#characterSelect").value;
    const stageId = qs("#stageSelect").value;
    runtime.state = startRun(index, { characterId, stageId, seed: 20260523, profile: runtime.profile });
    saveRun(runtime.state);
    renderGameSetup(index);
    renderRun();
  });
  qs("#loadRunButton").addEventListener("click", () => {
    runtime.state = loadSavedRun(index);
    if (runtime.state) applyProfileToRun(runtime.state, index, runtime.profile);
    renderRun();
  });
  qs("#clearProfileButton").addEventListener("click", () => {
    if (!confirm("진행 상황과 저장된 탐험을 초기화할까요?")) return;
    clearProfile();
    clearSavedRun();
    runtime.profile = loadProfile(index);
    runtime.state = null;
    renderStages(runtime.data.stages, runtime.data.enemies, runtime.profile);
    renderGameSetup(index);
  });
}

function renderSetupPreview(index, profile, characterId, stageId) {
  const character = index.characters.get(characterId) || index.data.characters[0];
  const stage = index.stages.get(stageId) || index.data.stages[0];
  const boss = index.enemies.get(stage.bossEnemyId);
  const cleared = profile.clearedStages.includes(stage.id);
  const starterCards = (character.starterDeck || []).map((cardId) => index.cards.get(cardId)).filter(Boolean);
  return `
    <section class="setup-preview-card character-preview-card" style="--character-accent:${accentFor(character.color)}">
      ${renderCharacterPortrait(character)}
      <div class="setup-preview-copy">
        <span class="route-kicker">선택 캐릭터</span>
        <strong>${character.name} · ${character.role}</strong>
        <p>${character.passiveText}</p>
        <div class="preview-stat-row">
          <span>체력 ${character.maxHp}</span>
          <span>기운 ${character.energy}</span>
          <span>시작 덱 ${starterCards.length}장</span>
        </div>
        <div class="starter-card-strip" aria-label="${character.name} 시작 카드">
          ${starterCards.slice(0, 5).map((card) => `<span style="--card-accent:${accentFor(card.color)}">${card.name}</span>`).join("")}
        </div>
      </div>
    </section>
    <section class="setup-preview-card stage-preview-card">
      <div class="stage-key-art stage-key-${stage.backgroundKey || "bright_gate"}">
        <span class="stage-sun"></span>
        <span class="stage-landmark"></span>
        <span class="stage-path"></span>
        <span class="stage-spark one"></span>
        <span class="stage-spark two"></span>
      </div>
      <div class="setup-preview-copy">
        <span class="route-kicker">${cleared ? "클리어한 스테이지" : "도전 스테이지"}</span>
        <strong>${stage.order}. ${stage.name}</strong>
        <p>${stage.biome} · 보스 ${boss?.name || "미정"}</p>
        <div class="preview-stat-row">
          <span>${stage.floorCount}개 방</span>
          <span>보상 별사탕 ${stage.clearRewards?.gold || 0}</span>
          <span>${cleared ? "클리어" : "진행 가능"}</span>
        </div>
        ${renderStageRoomStrip(stage)}
      </div>
    </section>
  `;
}

function renderCharacterPortrait(character) {
  const motif = characterMotifClass(character);
  return `
    <span class="character-portrait character-motif-${motif}" style="--character-accent:${accentFor(character.color)}" aria-hidden="true">
      <span class="character-hair"></span>
      <span class="character-face">
        <span class="character-eye left"></span>
        <span class="character-eye right"></span>
        <span class="character-cheek left"></span>
        <span class="character-cheek right"></span>
        <span class="character-smile"></span>
      </span>
      <span class="character-cloak"></span>
      <span class="character-badge"></span>
    </span>
  `;
}

function characterMotifClass(character) {
  const text = [character.name, character.role, character.passiveText].join(" ");
  if (/수호|보호|방어|기사/.test(text)) return "guard";
  if (/리본|마술|카드|연쇄|뽑/.test(text)) return "magic";
  if (/새싹|회복|정원|체력/.test(text)) return "sprout";
  if (/별|빛|기운|소풍/.test(text)) return "star";
  if (/구름|방울|하늘/.test(text)) return "cloud";
  return "sunny";
}

function renderProfilePanel(profile, index) {
  const nextStage = index.data.stages.find((stage) => isUnlocked(profile, "unlockedStages", stage.id) && !profile.clearedStages.includes(stage.id));
  const nextAchievements = nextAchievementGoals(profile, index).slice(0, 3);
  const nextUnlocks = nextUnlockGoals(profile, index).slice(0, 4);
  const counts = [
    ["스테이지", profile.clearedStages.length, index.data.stages.length],
    ["캐릭터", profile.unlockedCharacters.length, index.data.characters.length],
    ["카드", profile.unlockedCards.length, index.data.cards.length],
    ["보석", profile.unlockedGems.length, index.data.gems.length],
    ["유물", profile.unlockedRelics.length, index.data.relics.length],
    ["기운", profile.unlockedArcanas.length, index.data.arcanas.length],
    ["업적", profile.achievements.length, index.data.achievements.length]
  ];
  return `
    <section class="profile-panel">
      <div class="panel-head compact-head">
        <h2>진행 상황</h2>
        <span>${profile.stats.wins}승 · ${profile.stats.totalRuns}회 탐험</span>
      </div>
      <div class="profile-grid">
        ${counts.map(([label, current, total]) => `
          <div class="profile-stat">
            <span>${label}</span>
            <strong>${current}/${total}</strong>
          </div>
        `).join("")}
      </div>
      <div class="profile-next">
        <strong>다음 목표</strong>
        <span>${nextStage ? `${nextStage.order}. ${nextStage.name} 클리어` : "모든 스테이지 클리어"}</span>
      </div>
      <div class="profile-detail-grid">
        <div class="goal-list">
          <strong>다가오는 업적</strong>
          ${nextAchievements.map((item) => `
            <article class="goal-card">
              <span>${item.name}</span>
              <small>${item.progressLabel}</small>
              <em>${item.rewardLabel}</em>
            </article>
          `).join("") || "<span class='muted'>남은 업적 없음</span>"}
        </div>
        <div class="goal-list">
          <strong>다음 해금</strong>
          ${nextUnlocks.map((item) => `
            <article class="goal-card unlock-goal">
              <span>${item.name}</span>
              <small>${item.label}</small>
            </article>
          `).join("") || "<span class='muted'>남은 해금 없음</span>"}
        </div>
      </div>
    </section>
  `;
}

function nextAchievementGoals(profile, index) {
  return index.data.achievements
    .filter((achievement) => !profile.achievements.includes(achievement.id))
    .map((achievement) => ({
      ...achievement,
      progress: achievementProgress(profile, achievement.trigger || {}),
      rewardLabel: achievementRewardLabel(achievement.reward || {}, index)
    }))
    .filter((achievement) => achievement.progress.total > 0)
    .sort((a, b) => b.progress.ratio - a.progress.ratio || a.id.localeCompare(b.id))
    .map((achievement) => ({
      name: achievement.name,
      progressLabel: `${achievement.progress.current}/${achievement.progress.total} · ${achievement.description}`,
      rewardLabel: achievement.rewardLabel
    }));
}

function achievementProgress(profile, trigger) {
  if (trigger.op === "clear_stage") return progressValue(profile.clearedStages.includes(trigger.stageId) ? 1 : 0, 1);
  if (trigger.op === "unlock_character") return progressValue(profile.unlockedCharacters.includes(trigger.characterId) ? 1 : 0, 1);
  if (trigger.op === "collect_cards") return progressValue(profile.unlockedCards.length, trigger.amount);
  if (trigger.op === "collect_gems") return progressValue(profile.unlockedGems.length, trigger.amount);
  if (trigger.op === "collect_relics") return progressValue(profile.unlockedRelics.length, trigger.amount);
  if (trigger.op === "collect_arcanas") return progressValue(profile.unlockedArcanas.length, trigger.amount);
  return progressValue(0, 1);
}

function progressValue(current, total) {
  const safeTotal = Math.max(1, total || 1);
  return {
    current: Math.min(current || 0, safeTotal),
    total: safeTotal,
    ratio: Math.min(1, (current || 0) / safeTotal)
  };
}

function achievementRewardLabel(reward, index) {
  if (reward.unlockCharacterId) return `캐릭터 · ${index.characters.get(reward.unlockCharacterId)?.name || reward.unlockCharacterId}`;
  if (reward.unlockCardId) return `카드 · ${index.cards.get(reward.unlockCardId)?.name || reward.unlockCardId}`;
  if (reward.unlockGemId) return `보석 · ${index.gems.get(reward.unlockGemId)?.name || reward.unlockGemId}`;
  if (reward.unlockRelicId) return `유물 · ${index.relics.get(reward.unlockRelicId)?.name || reward.unlockRelicId}`;
  if (reward.unlockArcanaId) return `기운 · ${index.arcanas.get(reward.unlockArcanaId)?.name || reward.unlockArcanaId}`;
  if (reward.metaUpgradeId) return `마을 · ${index.metaUpgrades.get(reward.metaUpgradeId)?.name || reward.metaUpgradeId}`;
  if (reward.gold) return `별사탕 ${reward.gold}`;
  return "보상 없음";
}

function nextUnlockGoals(profile, index) {
  const rows = [
    ...index.data.stages
      .filter((stage) => !profile.unlockedStages.includes(stage.id))
      .map((stage) => ({ name: `${stage.order}. ${stage.name}`, label: unlockRequirementLabel(stage.unlock, index) })),
    ...index.data.characters
      .filter((character) => !profile.unlockedCharacters.includes(character.id))
      .map((character) => ({ name: character.name, label: unlockRequirementLabel(character.unlock, index) })),
    ...index.data.cards
      .filter((card) => !profile.unlockedCards.includes(card.id))
      .map((card) => ({ name: card.name, label: unlockRequirementLabel(card.unlock, index) })),
    ...index.data.gems
      .filter((gem) => !profile.unlockedGems.includes(gem.id))
      .map((gem) => ({ name: gem.name, label: unlockRequirementLabel(gem.unlock, index) }))
  ];
  return rows.filter((row) => row.label !== "기본 해금");
}

function unlockRequirementLabel(unlock = {}, index) {
  if (unlock.type === "stage_clear") return `${index.stages.get(unlock.stageId)?.name || unlock.stageId} 클리어`;
  if (unlock.type === "achievement") return `${index.achievements.get(unlock.achievementId)?.name || unlock.achievementId} 달성`;
  if (unlock.type === "pool") return `${index.stages.get(unlock.stageId)?.name || unlock.stageId} 이후 보상 풀`;
  return "기본 해금";
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
  syncCompletedRun(state, index);
  root.innerHTML = `
    <section class="run-board">
      <div class="run-status">
        <strong>${character.name}</strong>
        <span>${stage.name} · ${state.roomIndex + 1}/${stage.rooms.length} · ${phaseLabel(state.phase)}</span>
        <span>체력 ${state.player.hp}/${state.player.maxHp}</span>
        <span>보호막 ${state.player.shield}</span>
        <span>기운 ${state.player.energy}/${state.player.maxEnergy}</span>
        <span>별사탕 ${state.player.gold}</span>
        ${state.status.playerMarked > 0 ? `<span>표식 ${state.status.playerMarked}</span>` : ""}
        ${state.status.playerWeak > 0 ? `<span>약화 ${state.status.playerWeak}</span>` : ""}
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
      ${renderStageRoute(state, stage, index)}
      ${renderPhase(state, index)}
      ${renderBuildPanel(state, index)}
      ${renderGemVault(state, index)}
      <div class="log-list">${state.log.map((log) => `<span>${escapeHtml(log)}</span>`).join("")}</div>
    </section>
  `;
  bindRunActions();
}

function renderStageRoute(state, stage, index) {
  const currentIndex = Math.min(state.roomIndex, stage.rooms.length - 1);
  const currentRoomType = stage.rooms[currentIndex] || state.currentRoomType;
  const isStageDone = ["stage_clear", "defeat"].includes(state.phase);
  const roomComplete = state.phase === "room_complete";
  const doneCount = isStageDone ? stage.rooms.length : Math.max(0, state.roomIndex + (roomComplete ? 1 : 0));
  const progressRatio = Math.round((doneCount / stage.rooms.length) * 100);
  const nextRoomIndex = roomComplete ? state.roomIndex + 1 : state.roomIndex;
  const nextRoomType = stage.rooms[nextRoomIndex] || null;
  const boss = index.enemies.get(stage.bossEnemyId);
  return `
    <section class="stage-route-panel">
      <div class="stage-route-head">
        <div>
          <span class="route-kicker">스테이지 경로</span>
          <strong>${stage.name}</strong>
          <p>${stage.biome} · ${doneCount}/${stage.rooms.length}개 방 진행</p>
        </div>
        <div class="route-next-card">
          <span>${isStageDone ? "결과" : roomComplete ? "다음 방" : "현재 방"}</span>
          <strong>${isStageDone ? phaseLabel(state.phase) : roomLabel(nextRoomType || currentRoomType)}</strong>
          <small>${boss ? `보스 ${boss.name}` : "보스 미정"} · 클리어 보상 별사탕 ${stage.clearRewards?.gold || 0}</small>
        </div>
      </div>
      <div class="route-progress" aria-label="스테이지 진행률">
        <i style="width:${progressRatio}%"></i>
      </div>
      <div class="route-node-list">
        ${stage.rooms.map((roomType, roomIndex) => renderRouteNode(state, roomType, roomIndex, nextRoomIndex)).join("")}
      </div>
    </section>
  `;
}

function renderRouteNode(state, roomType, roomIndex, nextRoomIndex) {
  const isStageDone = state.phase === "stage_clear";
  const currentDone = state.phase === "room_complete" && roomIndex === state.roomIndex;
  const defeated = state.phase === "defeat" && roomIndex === state.roomIndex;
  const completed = isStageDone || roomIndex < state.roomIndex || currentDone;
  const active = roomIndex === state.roomIndex && !completed && !defeated;
  const next = !active && !completed && roomIndex === nextRoomIndex;
  const status = completed ? "완료" : defeated ? "실패" : active ? "진행 중" : next ? "다음" : "예정";
  return `
    <article class="route-node room-${roomType} ${completed ? "completed" : ""} ${active ? "active" : ""} ${next ? "next" : ""} ${defeated ? "defeated" : ""}">
      <span class="route-node-icon">${roomIcon(roomType)}</span>
      <div>
        <strong>${roomIndex + 1}. ${roomLabel(roomType)}</strong>
        <small>${status}</small>
      </div>
    </article>
  `;
}

function syncCompletedRun(state, index) {
  if (!["stage_clear", "defeat"].includes(state.phase) || state.status.profileFinalized) return;
  const result = finalizeRunProfile(state, index, runtime.profile);
  runtime.profile = result.profile;
  saveProfile(runtime.profile);
  saveRun(state);
  renderStages(runtime.data.stages, runtime.data.enemies, runtime.profile);
}

function renderPhase(state, index) {
  if (state.phase === "combat") return renderCombat(state, index);
  if (state.phase === "event") return renderEvent(state, index);
  if (state.phase === "reward") return renderReward(state, index);
  if (state.phase === "room_complete") return `<button class="primary-btn" data-action="advance">다음 방으로</button>`;
  if (state.phase === "stage_clear" || state.phase === "defeat") return renderRunResult(state);
  return "";
}

function renderCombat(state, index) {
  const forecast = combatForecast(state);
  return `
    <div class="combat-grid">
      ${renderCombatForecast(state, index, forecast)}
      ${renderDisruptionControl(state, index)}
      <section class="enemy-row">
        ${state.enemies.map((enemy) => renderEnemyCard(enemy, state, index)).join("")}
      </section>
      <section class="hand-row">
        ${state.hand.map((cardId, handIndex) => {
          const card = index.cards.get(cardId);
          const cost = cardCost(card, state, index);
          return `
            <button class="play-card card-type-${card.type}" data-action="play-card" data-hand-index="${handIndex}" style="--card-accent:${accentFor(card.color)}" ${cost > state.player.energy ? "disabled" : ""}>
              <span class="cost">${cost}</span>
              <strong>${card.name}</strong>
              <small>${typeLabels[card.type] || card.type}</small>
              ${renderCardArt(card, "hand")}
              <p>${card.text}</p>
            </button>
          `;
        }).join("")}
      </section>
      <button class="secondary-btn" data-action="end-turn">턴 종료</button>
    </div>
  `;
}

function renderDisruptionControl(state, index) {
  const disruptions = state.hand
    .map((cardId, handIndex) => ({ card: index.cards.get(cardId), handIndex }))
    .filter((item) => item.card && ["curse", "temp"].includes(item.card.type));
  if (disruptions.length === 0) return "";
  const target = (disruptions.find((item) => state.player.energy >= disruptionCleanseCost(item.card)) || disruptions[0]).card;
  const cost = disruptionCleanseCost(target);
  const canCleanse = state.player.energy >= cost;
  return `
    <section class="disruption-control">
      <div>
        <span class="route-kicker">방해 대응</span>
        <strong>${target.name}</strong>
        <p>손패 방해 ${disruptions.length}장 · 효과 발동 없이 이번 전투에서 정리</p>
      </div>
      <button class="secondary-btn disruption-btn" data-action="cleanse-disruption" ${canCleanse ? "" : "disabled"}>
        정리 · 기운 ${cost}
      </button>
    </section>
  `;
}

function renderCombatForecast(state, index, forecast) {
  return `
    <section class="combat-forecast intent-${forecast.tone}">
      <div class="forecast-main">
        <div>
          <span class="route-kicker">이번 턴 예고</span>
          <strong>${forecast.totalDamage > 0 ? `예상 피해 ${forecast.totalDamage}` : "피해 없음"}</strong>
          <p>${forecast.detail}</p>
        </div>
        <div class="forecast-meter">
          <span>보호막 ${state.player.shield}</span>
          <strong>${forecast.blocked} 차단</strong>
        </div>
      </div>
      <div class="forecast-chip-list">
        ${combatStatusChips(state, index, forecast).map((chip) => `<span class="forecast-chip ${chip.tone}">${chip.label}</span>`).join("")}
      </div>
      ${renderBattleRules(state, index)}
    </section>
  `;
}

function renderBattleRules(state, index) {
  const rules = (state.battleRules || []).filter((rule) => rule.rule === "shield_on_color_play");
  if (rules.length === 0) return "";
  return `
    <div class="battle-rule-list">
      ${rules.map((rule) => {
        const source = index.cards.get(rule.sourceCardId);
        return `
          <span class="battle-rule-chip" style="--rule-accent:${accentFor(rule.color)}">
            <b>${source?.name || "약속"}</b>
            <em>${colorLabels[rule.color] || rule.color} 카드 · 보호막 ${rule.amount || 0}</em>
          </span>
        `;
      }).join("")}
    </div>
  `;
}

function renderEnemyCard(enemy, state, index) {
  const intent = nextIntent(enemy, state.turn);
  const tone = intentTone(intent);
  return `
    <article class="enemy-card enemy-rank-${enemy.rank} intent-${tone}">
      <div class="enemy-head">
        ${renderMonsterPortrait(enemy)}
        <div>
          <strong>${enemy.name}</strong>
          <span>${enemyRankLabel(enemy.rank)} · ${enemy.role || "기본형"} · ${enemy.family || "미로"}</span>
        </div>
      </div>
      <div class="hp-line"><i style="width:${Math.max(0, Math.round((enemy.hp / enemy.maxHp) * 100))}%"></i></div>
      <div class="enemy-stat-row">
        <span>체력 ${enemy.hp}/${enemy.maxHp}</span>
        <span>방어 ${enemy.block || 0}</span>
      </div>
      ${renderBossPhasePanel(enemy, state, index)}
      <div class="intent-card intent-${tone}">
        <span class="intent-icon">${intentIcon(intent)}</span>
        <div>
          <strong>${intent?.label || "대기"}</strong>
          <small>${intentDetail(intent)}</small>
        </div>
      </div>
      ${renderIntentTimeline(enemy, state.turn)}
      ${renderEnemyStatus(enemy)}
    </article>
  `;
}

function renderMonsterPortrait(enemy) {
  const familyClass = monsterFamilyClass(enemy.family);
  const accent = monsterAccent(enemy);
  const crown = enemy.rank === "boss" ? `<span class="monster-rank-crown" aria-hidden="true"><b></b></span>` : "";
  const sparkle = enemy.rank === "elite" ? `<span class="monster-sparkle" aria-hidden="true"></span>` : "";
  return `
    <span class="monster-portrait rank-${enemy.rank} family-${familyClass}" style="${accent}" aria-hidden="true">
      ${crown}
      ${sparkle}
      <span class="monster-ear ear-left"></span>
      <span class="monster-ear ear-right"></span>
      <span class="monster-face">
        <span class="monster-eye eye-left"></span>
        <span class="monster-eye eye-right"></span>
        <span class="monster-cheek cheek-left"></span>
        <span class="monster-cheek cheek-right"></span>
        <span class="monster-mouth"></span>
      </span>
      <span class="monster-motif motif-one"></span>
      <span class="monster-motif motif-two"></span>
    </span>
  `;
}

function renderBossPhasePanel(enemy, state, index) {
  if (enemy.rank !== "boss" || !enemy.phaseRules?.length) return "";
  const stage = index.stages.get(state.stageId);
  const shield = bossPhaseBlock(stage?.order || 1);
  const ratio = enemy.maxHp > 0 ? enemy.hp / enemy.maxHp : 1;
  return `
    <div class="boss-phase-panel" aria-label="${enemy.name} 보스 변화">
      ${enemy.phaseRules.map((rule, ruleIndex) => {
        const threshold = Math.round((rule.hpBelowRatio || 0) * 100);
        const triggered = enemy.phaseRulesTriggered?.includes(ruleIndex);
        const armed = !triggered && ratio <= (rule.hpBelowRatio || 0);
        return `
          <span class="boss-phase-step ${triggered ? "triggered" : armed ? "armed" : ""}">
            <b>${triggered ? "발동 완료" : armed ? "곧 발동" : `${threshold}% 이하`}</b>
            <em>${phaseRuleDetail(rule)} · 장벽 +${shield}</em>
          </span>
        `;
      }).join("")}
    </div>
  `;
}

function renderIntentTimeline(enemy, turn) {
  const count = Math.min(4, enemy.intents.length);
  return `
    <div class="intent-timeline" aria-label="${enemy.name} 의도 순서">
      ${Array.from({ length: count }, (_, offset) => {
        const intent = nextIntent(enemy, turn + offset);
        return `
          <span class="intent-node intent-${intentTone(intent)} ${offset === 0 ? "current" : ""}" title="${intent?.label || "대기"} · ${intentDetail(intent)}">
            <b>${offset === 0 ? "이번" : `+${offset}`}</b>
            <em>${intentIcon(intent)}</em>
          </span>
        `;
      }).join("")}
    </div>
  `;
}

function renderEnemyStatus(enemy) {
  const entries = Object.entries(enemy.status || {}).filter(([, value]) => value > 0);
  if (entries.length === 0) return "";
  return `<div class="enemy-status">${entries.map(([key, value]) => `
    <span class="status-${key}" title="${statusDetail(key, value)}">${statusLabel(key)} ${value}${statusInlineDetail(key, value)}</span>
  `).join("")}</div>`;
}

function combatForecast(state) {
  const incoming = { normalDamage: 0, piercingDamage: 0 };
  const effects = [];
  state.enemies.forEach((enemy) => {
    const intent = nextIntent(enemy, state.turn);
    if (!intent) return;
    if (intent.type === "attack") incoming.normalDamage += intent.amount || 0;
    if (intent.effect === "pierce_attack") incoming.piercingDamage += intent.amount || 0;
    if (intent.type === "guard") effects.push(`${enemy.name} 방어 ${intent.amount || 0}`);
    if (intent.type === "debuff") effects.push(`${statusLabel(intent.status)} ${intent.amount || 1}`);
    if (intent.effect === "fortify_all") effects.push(`전체 방어 ${intent.amount || 0}`);
    if (intent.effect === "heal_self") effects.push(`회복 ${intent.amount || 0}`);
    if (intent.effect === "add_temp_card") effects.push(`방해 카드 ${intent.amount || 1}장`);
    if (intent.effect === "reduce_energy") effects.push(`다음 턴 기운 -${intent.amount || 1}`);
    if (intent.effect === "chain_down") effects.push(`연쇄 -${intent.amount || 1}`);
    if (intent.effect === "summon") effects.push("친구 호출");
  });
  const markBonus = state.status.playerMarked > 0 ? Math.ceil(incoming.normalDamage * Math.min(0.5, state.status.playerMarked * 0.15)) : 0;
  const reduced = Math.max(0, incoming.normalDamage + markBonus - (state.status.damageReduction || 0));
  const blocked = Math.min(state.player.shield, reduced);
  const normalAfterBlock = Math.max(0, reduced - blocked);
  const totalDamage = normalAfterBlock + incoming.piercingDamage;
  const damageParts = [
    incoming.normalDamage > 0 ? `일반 ${incoming.normalDamage}` : null,
    markBonus > 0 ? `표식 추가 ${markBonus}` : null,
    state.status.damageReduction > 0 ? `감소 ${state.status.damageReduction}` : null,
    incoming.piercingDamage > 0 ? `관통 ${incoming.piercingDamage}` : null
  ].filter(Boolean);
  return {
    ...incoming,
    markBonus,
    blocked,
    totalDamage,
    effects,
    tone: totalDamage > 0 ? "attack" : effects.length > 0 ? "trick" : "guard",
    detail: [...damageParts, ...effects].join(" · ") || "적이 공격 대신 정비합니다."
  };
}

function combatStatusChips(state, index, forecast) {
  const chips = [
    { label: `연쇄 ${state.status.chain || 0}`, tone: "chain" },
    { label: `손패 ${state.hand.length}`, tone: "hand" },
    { label: `기운 ${state.player.energy}/${state.player.maxEnergy}`, tone: "energy" }
  ];
  if (forecast.normalDamage > 0) chips.push({ label: `일반 피해 ${forecast.normalDamage}`, tone: "attack" });
  if (forecast.piercingDamage > 0) chips.push({ label: `관통 ${forecast.piercingDamage}`, tone: "pierce" });
  if (state.status.playerMarked > 0) chips.push({ label: `표식 ${state.status.playerMarked}`, tone: "danger" });
  if (state.status.playerWeak > 0) chips.push({ label: `약화 ${state.status.playerWeak}`, tone: "danger" });
  if (state.status.damageReduction > 0) chips.push({ label: `피해 감소 ${state.status.damageReduction}`, tone: "guard" });
  if (state.status.retainShield > 0) chips.push({ label: `보호막 유지 ${state.status.retainShield}`, tone: "guard" });
  if (state.status.reflectRatio > 0 && forecast.totalDamage > 0) chips.push({ label: `반사 ${Math.ceil(forecast.totalDamage * state.status.reflectRatio)}`, tone: "guard" });
  if (state.status.battleRuleTriggers > 0) chips.push({ label: `약속 발동 ${state.status.battleRuleTriggers}`, tone: "guard" });
  const disruptionCount = state.hand.filter((cardId) => ["curse", "temp"].includes(index.cards.get(cardId)?.type)).length;
  if (disruptionCount > 0) chips.push({ label: `방해 ${disruptionCount}`, tone: "danger" });
  if (state.status.disruptionsCleared > 0) chips.push({ label: `정리 ${state.status.disruptionsCleared}`, tone: "guard" });
  if (state.status.nextTurnEnergyPenalty > 0) chips.push({ label: `다음 기운 -${state.status.nextTurnEnergyPenalty}`, tone: "danger" });
  return chips;
}

function intentTone(intent) {
  if (!intent) return "guard";
  if (intent.type === "attack" || intent.effect === "pierce_attack") return "attack";
  if (intent.type === "guard" || intent.effect === "fortify_all" || intent.effect === "heal_self") return "guard";
  if (intent.effect === "summon") return "summon";
  return "trick";
}

function intentIcon(intent) {
  if (!intent) return "·";
  if (intent.type === "attack") return "공";
  if (intent.type === "guard") return "방";
  if (intent.type === "debuff") return "상";
  if (intent.effect === "pierce_attack") return "관";
  if (intent.effect === "fortify_all") return "방";
  if (intent.effect === "heal_self") return "회";
  if (intent.effect === "summon") return "호";
  if (intent.effect === "add_temp_card") return "방";
  if (intent.effect === "reduce_energy") return "기";
  if (intent.effect === "chain_down") return "연";
  return "특";
}

function enemyRankLabel(rank) {
  return rank === "boss" ? "보스" : rank === "elite" ? "정예" : "일반";
}

function monsterFamilyClass(family = "") {
  return ({
    "구름": "cloud",
    "부적": "paper",
    "방울": "bubble",
    "토끼": "bunny",
    "왕방울": "royal-bubble",
    "새싹": "sprout",
    "리본": "ribbon",
    "별": "star",
    "말랑": "plush",
    "달빛": "moon"
  })[family] || "maze";
}

function monsterAccent(enemy) {
  const palette = ({
    cloud: ["#7cccf7", "#eaf8ff", "#4f9ccc"],
    paper: ["#ffd45f", "#fff7db", "#c58a22"],
    bubble: ["#9ee8ff", "#f1fbff", "#5aa9ce"],
    bunny: ["#ffb3c2", "#fff1f4", "#c96b81"],
    "royal-bubble": ["#ff8ea2", "#fff1c8", "#c65367"],
    sprout: ["#67d9a5", "#ecfff6", "#3b9871"],
    ribbon: ["#ff9fcf", "#fff0f8", "#b94c82"],
    star: ["#ffd45f", "#fff8d7", "#bb8c1d"],
    plush: ["#d0a2ff", "#f8f0ff", "#7b61b5"],
    moon: ["#a99cff", "#f2edff", "#6657b0"],
    maze: ["#7cccf7", "#ffffff", "#4f536d"]
  })[monsterFamilyClass(enemy.family)] || ["#7cccf7", "#ffffff", "#4f536d"];
  if (enemy.rank === "elite") palette[0] = "#a99cff";
  if (enemy.rank === "boss") palette[0] = "#ff8ea2";
  return `--monster-a:${palette[0]};--monster-b:${palette[1]};--monster-line:${palette[2]};`;
}

function phaseRuleDetail(rule) {
  if (!rule?.addIntent) return "패턴 변화";
  return rule.addIntent.label || intentDetail(rule.addIntent);
}

function statusLabel(status) {
  return ({ mark: "표식", weak: "약화" })[status] || status;
}

function statusInlineDetail(status, value) {
  if (status === "mark") return ` · 피해 +${markDamagePercent(value)}%`;
  if (status === "weak") return " · 피해 감소";
  return "";
}

function statusDetail(status, value) {
  if (status === "mark") return `다음 피해를 ${markDamagePercent(value)}% 더 받고 표식 1을 소모합니다.`;
  if (status === "weak") return "주는 피해가 줄어듭니다.";
  return `${statusLabel(status)} ${value}`;
}

function markDamagePercent(value) {
  return Math.round(Math.min(0.6, Math.max(0, value || 0) * 0.15) * 100);
}

function renderRunResult(state) {
  const summary = state.resultSummary;
  const title = state.phase === "stage_clear" ? "스테이지 클리어" : "탐험 실패";
  const unlocks = [...(summary?.unlocks || []), ...(summary?.achievements || []), ...(summary?.metaUpgrades || [])];
  return `
    <section class="result-panel">
      <div class="result-head">
        <div>
          <strong>${title}</strong>
          <span>${summary?.stageName || ""} · ${summary?.characterName || ""}</span>
        </div>
        <button class="primary-btn" data-action="restart">다시 탐험</button>
      </div>
      <div class="result-grid">
        <div><span>클리어 방</span><strong>${summary?.roomsCleared ?? state.metrics.roomsCleared}</strong></div>
        <div><span>처치</span><strong>${summary?.enemiesDefeated ?? state.metrics.enemiesDefeated}</strong></div>
        <div><span>최대 연쇄</span><strong>${summary?.maxChain ?? state.metrics.maxChain}</strong></div>
        <div><span>적 의도</span><strong>${summary?.enemyIntentsResolved ?? state.metrics.enemyIntentsResolved ?? 0}</strong></div>
        <div><span>보스 변화</span><strong>${summary?.bossPhaseTriggers ?? state.metrics.bossPhaseTriggers ?? 0}</strong></div>
        <div><span>별사탕</span><strong>${summary?.gold ?? state.player.gold}</strong></div>
        <div><span>덱</span><strong>${summary?.deckSize ?? state.deck.length}</strong></div>
        <div><span>보석</span><strong>${summary?.gemCount ?? state.inventory.gemBag.length}</strong></div>
      </div>
      <div class="unlock-list">
        <strong>새로 열린 것</strong>
        <div class="build-chip-list">
          ${unlocks.length === 0 ? "<span class='muted'>이번 탐험의 신규 해금 없음</span>" : unlocks.map((item) => `<span class="build-chip unlock-chip">${item.label} · ${item.name}</span>`).join("")}
        </div>
      </div>
    </section>
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
            ${relics.length === 0 ? "<span class='muted'>보유 유물 없음</span>" : relics.map((relic) => renderBuildItemChip("relic", relic)).join("")}
          </div>
          <button class="secondary-btn" data-action="debug-relic">유물 지급</button>
        </div>
        <div class="build-column">
          <strong>기운</strong>
          <div class="build-chip-list">
            ${arcanas.length === 0 ? "<span class='muted'>보유 기운 없음</span>" : arcanas.map((arcana) => renderBuildItemChip("arcana", arcana)).join("")}
          </div>
          <button class="secondary-btn" data-action="debug-arcana">기운 지급</button>
        </div>
      </div>
    </section>
  `;
}

function renderGemVault(state, index) {
  ensureGemState(state);
  const filter = state.status.gemWorkbenchFilter || "all";
  const uniqueDeckIds = [...new Set(state.deck)];
  const filteredDeckIds = uniqueDeckIds
    .filter((cardId) => filter === "all" || index.cards.get(cardId)?.type === filter)
    .slice(0, 10);
  const unequipped = unequippedGemInstances(state);
  const equippedCount = state.inventory.gemBag.filter((gem) => gem.equippedCardId).length;
  const socketChargeCount = (state.status.socketBonus || 0) + (state.status.gemWorkshopCharges || 0);
  return `
    <section class="gem-vault gem-workbench">
      <div class="panel-head compact-head">
        <h2>보석 작업대</h2>
        <span>${state.inventory.gemBag.length}개 보유 · ${equippedCount}개 장착</span>
      </div>
      <div class="workbench-toolbar" role="group" aria-label="카드 타입 필터">
        ${Object.entries(gemTypeLabels).map(([type, label]) => `
          <button class="filter-chip ${filter === type ? "active" : ""}" data-action="gem-filter" data-filter="${type}">${label}</button>
        `).join("")}
      </div>
      <div class="socket-summary">
        <span>빈 보석 ${unequipped.length}개</span>
        <span>소켓 확장권 ${socketChargeCount}개</span>
        <span>표시 카드 ${filteredDeckIds.length}/${uniqueDeckIds.length}장</span>
      </div>
      <div class="gem-vault-grid">
        <div class="gem-bag">
          <strong>미장착 보석</strong>
          <div class="gem-card-list">
            ${unequipped.length === 0 ? "<span class='muted'>미장착 보석 없음</span>" : unequipped.map((instance) => renderGemCard(index, instance)).join("")}
          </div>
          <button class="secondary-btn" data-action="debug-gem">보석 지급</button>
        </div>
        <div class="socket-list">
          ${filteredDeckIds.length === 0 ? "<span class='muted'>필터에 맞는 카드가 없습니다.</span>" : filteredDeckIds.map((cardId) => renderSocketCard(state, index, cardId)).join("")}
        </div>
      </div>
    </section>
  `;
}

function renderSocketCard(state, index, cardId) {
  const card = index.cards.get(cardId);
  const sockets = normalizeCardSockets(state, index, cardId);
  const capacity = socketCapacity(state, index, cardId);
  const equippedGems = equippedGemInstancesForCard(state, index, cardId);
  const validGems = unequippedGemInstances(state).filter((instance) => {
    const gem = index.gems.get(instance.gemId);
    return gem && canEquipGemToCard(gem, card);
  }).slice(0, 4);
  const canOpenSocket = capacity < card.sockets.max && ((state.status.socketBonus || 0) > 0 || (state.status.gemWorkshopCharges || 0) > 0);
  const currentCost = cardCost(card, state, index);
  const upgraded = state.upgradedCards.includes(card.id);
  return `
    <article class="socket-card socket-card-${card.type}" style="--card-accent:${accentFor(card.color)}">
      <div class="socket-card-preview">
        <div class="socket-card-frame">
          <span class="cost">${currentCost}</span>
          <strong>${card.name}</strong>
          ${renderCardArt(card, "socket")}
        </div>
        <div class="socket-card-meta">
          <strong>${typeLabels[card.type] || card.type} 카드 ${upgraded ? "· 강화됨" : ""}</strong>
          <small>기본 비용 ${card.cost} · 현재 비용 ${currentCost} · 소켓 ${capacity}/${card.sockets.max}</small>
          <p>${upgraded ? card.upgrade?.text || card.text : card.text}</p>
        </div>
      </div>
      <div class="socket-row" aria-label="${card.name} 소켓">
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
      <div class="equipped-effect-list">
        ${equippedGems.length === 0 ? "<span class='muted'>장착 효과 없음</span>" : equippedGems.map((instance) => {
          const gem = index.gems.get(instance.gemId);
          return `<span class="effect-chip">${gem.name} · ${gemEffectSummary(gem)}</span>`;
        }).join("")}
      </div>
      <div class="socket-actions">
        ${canOpenSocket ? `<button class="secondary-btn" data-action="open-socket" data-card-id="${card.id}">소켓 +1</button>` : ""}
        ${validGems.map((instance) => {
          const gem = index.gems.get(instance.gemId);
          const isFull = sockets.every(Boolean);
          return `
            <button class="gem-option" data-action="equip-gem" data-card-id="${card.id}" data-gem-instance-id="${instance.instanceId}">
              <span class="gem-icon ${gemVisualClass(gem)}"></span>
              <strong>${isFull ? "교체" : "장착"} · ${gem.name}</strong>
              <small>${gemEffectSummary(gem)}</small>
            </button>
          `;
        }).join("")}
        ${validGems.length === 0 ? "<span class='muted'>장착 가능한 미사용 보석 없음</span>" : ""}
      </div>
    </article>
  `;
}

function renderGemCard(index, instance) {
  const gem = index.gems.get(instance.gemId);
  return `
    <article class="gem-card" title="${gem.text}">
      <span class="gem-icon ${gemVisualClass(gem)}"></span>
      <div>
        <strong>${gem.name}</strong>
        <small>${gem.socketTypes.map((type) => gemTypeLabels[type] || type).join(" · ")}</small>
        <em>${gemEffectSummary(gem)}</em>
      </div>
    </article>
  `;
}

function gemEffectSummary(gem) {
  const effect = gem.effects?.[0];
  if (!effect) return gem.text;
  if (effect.op === "modify_damage_percent") return `피해 +${effect.amount}%`;
  if (effect.op === "modify_shield_percent") return `보호막 +${effect.amount}%`;
  if (effect.op === "modify_cost") return `비용 ${effect.amount}`;
  if (effect.op === "heal_on_play") return `사용 시 체력 ${effect.amount} 회복`;
  if (effect.op === "apply_mark_on_play") return `사용 시 표식 ${effect.amount}`;
  if (effect.op === "echo_basic_effect") return `기본 효과 ${Math.round(effect.ratio * 100)}% 메아리`;
  if (effect.op === "splash_damage") return `주변 피해 ${Math.round(effect.ratio * 100)}%`;
  if (effect.op === "preserve_chain") return "연쇄 유지";
  if (effect.op === "bridge_next_color_bonus") return "다음 색 보너스 유지";
  return gem.text;
}

function gemVisualClass(gem) {
  const op = gem.effects?.[0]?.op || "";
  const rarity = `gem-rarity-${gem.rarity || "common"}`;
  const socket = gem.socketTypes?.[0] ? `gem-socket-${gem.socketTypes[0]}` : "gem-socket-any";
  if (op.includes("damage")) return `gem-red ${rarity} ${socket}`;
  if (op.includes("shield")) return `gem-blue ${rarity} ${socket}`;
  if (op.includes("cost")) return `gem-yellow ${rarity} ${socket}`;
  if (op.includes("heal")) return `gem-green ${rarity} ${socket}`;
  if (op.includes("mark")) return `gem-coral ${rarity} ${socket}`;
  if (op.includes("echo")) return `gem-violet ${rarity} ${socket}`;
  if (op.includes("chain") || op.includes("bridge")) return `gem-rainbow ${rarity} ${socket}`;
  return `gem-white ${rarity} ${socket}`;
}

function renderEvent(state, index) {
  const event = state.pendingEvent;
  const eventTone = event.type || "choice";
  return `
    <section class="choice-box market-box market-tone-${eventTone}">
      <div class="choice-head">
        <div>
          <span class="choice-kicker">${eventTypeLabel(eventTone)}</span>
          <strong>${event.name}</strong>
          <p>${event.text}</p>
        </div>
        <div class="choice-wallet">
          <span>별사탕 ${state.player.gold}</span>
          <span>체력 ${state.player.hp}/${state.player.maxHp}</span>
        </div>
      </div>
      <div class="choice-list market-list">
        ${event.choices.map((choice, choiceIndex) => {
          const cost = adjustedRewardCost(state, index, choice.cost || {}, { source: event.type, reward: choice.reward || {} });
          const affordable = canPayCost(state, cost);
          return `
          <button class="choice-btn market-choice ${affordable ? "" : "locked-choice"}" data-action="event-choice" data-choice-index="${choiceIndex}" ${affordable ? "" : "disabled"}>
            <span class="choice-cost ${affordable ? "can-pay" : "cannot-pay"}">${costLabel(cost)}</span>
            <strong>${choice.label}</strong>
            <span class="choice-note">${affordable ? rewardLabel(choice.reward) : shortageLabel(state, cost)}</span>
            <span class="reward-preview-grid">
              ${rewardPreviewItems(choice.reward || {}, index).map(renderRewardPreviewItem).join("")}
            </span>
          </button>
        `;
        }).join("")}
      </div>
    </section>
  `;
}

function renderReward(state, index) {
  const reward = state.pendingReward;
  const source = reward.source || "reward";
  return `
    <section class="choice-box market-box market-source-${source}">
      <div class="choice-head">
        <div>
          <span class="choice-kicker">${rewardSourceLabel(source)}</span>
          <strong>${source === "shop" ? "상점 선택" : "보상 선택"}</strong>
          <p>${source === "shop" ? "현재 별사탕으로 필요한 성장 요소를 고릅니다." : "이번 방의 보상 중 하나를 선택합니다."}</p>
        </div>
        <div class="choice-wallet">
          <span>별사탕 ${state.player.gold}</span>
          <span>다시 보기 ${reward.rerolls}</span>
        </div>
      </div>
      <div class="choice-list market-list">
        ${reward.options.map((option) => {
          const affordable = !option.cost || canPayCost(state, option.cost);
          return `
          <button class="choice-btn market-choice reward-${option.type} ${affordable ? "" : "locked-choice"}" data-action="reward-choice" data-reward-id="${option.id}" ${affordable ? "" : "disabled"}>
            <span class="choice-cost ${affordable ? "can-pay" : "cannot-pay"}">${option.cost ? costLabel(option.cost) : "비용 없음"}</span>
            <strong>${option.title}</strong>
            <span class="choice-note">${affordable ? option.description : shortageLabel(state, option.cost)}</span>
            <span class="reward-preview-grid">
              ${rewardOptionPreviewItems(option, index).map(renderRewardPreviewItem).join("")}
            </span>
          </button>
        `;
        }).join("")}
      </div>
      <button class="secondary-btn reroll-btn" data-action="reroll" ${reward.rerolls <= 0 ? "disabled" : ""}>다시 보기 ${reward.rerolls}</button>
    </section>
  `;
}

function bindRunActions() {
  const { state, index } = runtime;
  qs("#runRoot").querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.action;
      if (action === "play-card") playCard(state, index, Number(button.dataset.handIndex));
      if (action === "cleanse-disruption") cleanseDisruption(state, index);
      if (action === "end-turn") endTurn(state, index);
      if (action === "reward-choice") applyRewardOption(state, index, button.dataset.rewardId);
      if (action === "event-choice") applyEventChoice(state, index, Number(button.dataset.choiceIndex));
      if (action === "reroll") rerollReward(state, index);
      if (action === "advance") advanceRoom(state, index);
      if (action === "restart") runtime.state = startRun(index, { characterId: state.characterId, stageId: state.stageId, seed: Date.now(), profile: runtime.profile });
      if (action === "equip-gem") equipGemToCard(state, index, button.dataset.gemInstanceId, button.dataset.cardId);
      if (action === "unequip-gem") unequipGem(state, button.dataset.gemInstanceId);
      if (action === "open-socket") openSocketForCard(state, index, button.dataset.cardId);
      if (action === "gem-filter") state.status.gemWorkbenchFilter = button.dataset.filter;
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

function roomLabel(roomType) {
  return ({ combat: "일반전", elite: "정예전", boss: "보스전", shop: "상점", rest: "쉼터", event: "이벤트", reward: "보상" })[roomType] || roomType || "미정";
}

function roomIcon(roomType) {
  return ({ combat: "전", elite: "정", boss: "보", shop: "상", rest: "쉼", event: "이", reward: "★" })[roomType] || "?";
}

function costLabel(cost = {}) {
  const parts = [];
  if (cost.gold) parts.push(`별사탕 ${cost.gold}`);
  if (cost.hp) parts.push(`체력 ${cost.hp}`);
  if (parts.length) return `비용 ${parts.join(" · ")}`;
  return "비용 없음";
}

function canPayCost(state, cost = {}) {
  if (cost.gold && state.player.gold < cost.gold) return false;
  if (cost.hp && state.player.hp <= cost.hp) return false;
  return true;
}

function rewardLabel(reward = {}) {
  return rewardPreviewItems(reward, runtime.index)
    .map((item) => item.short)
    .filter(Boolean)
    .join(" · ") || "보상 없음";
}

function shortageLabel(state, cost = {}) {
  if (cost.gold && state.player.gold < cost.gold) return `별사탕 ${cost.gold - state.player.gold} 부족`;
  if (cost.hp && state.player.hp <= cost.hp) return "체력이 부족합니다";
  return "선택할 수 없습니다";
}

function eventTypeLabel(type) {
  return ({ shop: "상점", station: "작업대", rest: "쉼터", choice: "이벤트" })[type] || "이벤트";
}

function rewardSourceLabel(source) {
  return ({ combat: "전투 보상", elite: "정예 보상", boss: "보스 보상", reward: "특별 보상", shop: "상점" })[source] || "보상";
}

function rewardPreviewItems(reward = {}, index) {
  const items = [];
  if (reward.cardPool?.length) {
    reward.cardPool.forEach((id) => {
      const card = index.cards.get(id);
      if (card) items.push({ kind: "card", title: card.name, detail: card.text, short: "카드", accent: accentFor(card.color), cost: card.cost });
    });
  }
  if (reward.gemPool?.length) {
    reward.gemPool.forEach((id) => {
      const gem = index.gems.get(id);
      if (gem) items.push({ kind: "gem", title: gem.name, detail: gemEffectSummary(gem), short: "보석", visual: gemVisualClass(gem) });
    });
  }
  if (reward.relicPool?.length) {
    reward.relicPool.forEach((id) => {
      const relic = index.relics.get(id);
      if (relic) items.push({ kind: "relic", title: relic.name, detail: relicEffectSummary(relic), short: "유물", source: relic });
    });
  }
  if (reward.arcanaPool?.length) {
    reward.arcanaPool.forEach((id) => {
      const arcana = index.arcanas.get(id);
      if (arcana) items.push({ kind: "arcana", title: arcana.name, detail: arcanaEffectSummary(arcana), short: "기운", source: arcana });
    });
  }
  if (reward.upgradeRandomCard) items.push({ kind: "upgrade", title: "카드 강화", detail: "덱의 카드 1장을 강화합니다.", short: "강화" });
  if (reward.heal) items.push({ kind: "heal", title: "체력 회복", detail: `체력 ${reward.heal} 회복`, short: "회복" });
  if (reward.gold) items.push({ kind: "gold", title: "별사탕", detail: `${reward.gold}개 획득`, short: "별사탕" });
  if (reward.openGemSocket) items.push({ kind: "socket", title: "소켓 확장", detail: "보석 작업대 충전 +1", short: "소켓" });
  if (reward.combat) {
    const enemy = index.enemies.get(reward.combat);
    items.push({ kind: "combat", title: enemy?.name || "전투", detail: "전투 후 보상을 얻습니다.", short: "전투" });
  }
  return items;
}

function rewardOptionPreviewItems(option, index) {
  if (option.type === "card") {
    const card = index.cards.get(option.cardId);
    return card ? [{ kind: "card", title: card.name, detail: option.description, short: "카드", accent: accentFor(card.color), cost: card.cost, card }] : [];
  }
  if (option.type === "gem") {
    const gem = index.gems.get(option.gemId);
    return gem ? [{ kind: "gem", title: gem.name, detail: gemEffectSummary(gem), short: "보석", visual: gemVisualClass(gem) }] : [];
  }
  if (option.type === "relic") {
    const relic = index.relics.get(option.relicId);
    return relic ? [{ kind: "relic", title: relic.name, detail: relicEffectSummary(relic), short: "유물", source: relic }] : [];
  }
  if (option.type === "arcana") {
    const arcana = index.arcanas.get(option.arcanaId);
    return arcana ? [{ kind: "arcana", title: arcana.name, detail: arcanaEffectSummary(arcana), short: "기운", source: arcana }] : [];
  }
  if (option.type === "gold") return [{ kind: "gold", title: "별사탕", detail: `${option.amount}개 획득`, short: "별사탕" }];
  return [{ kind: option.type, title: option.title, detail: option.description, short: option.type }];
}

function renderRewardPreviewItem(item) {
  const icon = item.card
    ? renderCardArt(item.card, "preview")
    : item.kind === "gem"
    ? `<span class="gem-icon ${item.visual}"></span>`
    : ["relic", "arcana"].includes(item.kind)
    ? renderItemIcon(item.kind, item.source)
    : `<span class="reward-icon reward-icon-${item.kind}" ${item.accent ? `style="--preview-accent:${item.accent}"` : ""}>${item.cost ?? rewardIconText(item.kind)}</span>`;
  return `
    <span class="reward-preview-card reward-kind-${item.kind}" ${item.accent ? `style="--preview-accent:${item.accent}"` : ""}>
      ${icon}
      <span>
        <strong>${item.title}</strong>
        <small>${item.detail}</small>
      </span>
    </span>
  `;
}

function renderBuildItemChip(kind, item) {
  const summary = kind === "relic" ? relicEffectSummary(item) : arcanaEffectSummary(item);
  return `
    <span class="build-chip ${kind}-chip ${kind}-chip-${item.rarity || "common"}" title="${item.text}">
      ${renderItemIcon(kind, item)}
      <span>
        <b>${item.name}</b>
        <em>${summary}</em>
      </span>
    </span>
  `;
}

function renderItemIcon(kind, item = {}) {
  const motif = kind === "relic" ? relicMotif(item) : arcanaMotif(item);
  return `
    <span class="item-icon item-icon-${kind} ${kind}-motif-${motif} item-rarity-${item.rarity || "common"}" aria-hidden="true">
      <span class="item-shape main"></span>
      <span class="item-shape mark-one"></span>
      <span class="item-shape mark-two"></span>
    </span>
  `;
}

function renderCardArt(card, variant = "sample") {
  const subject = card.illustration?.subject || card.name;
  const mood = card.illustration?.mood || "";
  const motif = cardArtMotif(card);
  return `
    <span class="card-art card-art-${variant} motif-${motif} card-art-type-${card.type}" style="--card-accent:${accentFor(card.color)}" aria-label="${escapeHtml(subject)}">
      <span class="card-art-glow"></span>
      <span class="card-art-shape main"></span>
      <span class="card-art-shape aux"></span>
      <span class="card-art-shape trail-one"></span>
      <span class="card-art-shape trail-two"></span>
      <span class="card-art-label">
        <strong>${escapeHtml(shortCardSubject(subject))}</strong>
        ${mood ? `<small>${escapeHtml(mood)}</small>` : ""}
      </span>
    </span>
  `;
}

function cardArtMotif(card) {
  const text = [card.name, card.illustration?.subject, ...(card.tags || [])].join(" ");
  if (["curse", "temp"].includes(card.type)) return "disrupt";
  if (/방패|보호|방석|쿠션|장벽|거울/.test(text) || card.type === "guard") return "shield";
  if (/별|반짝|빛|충전|별사탕/.test(text)) return "star";
  if (/리본|연쇄|물결|소나기/.test(text)) return "ribbon";
  if (/부적|종이|지도|스티커/.test(text)) return "charm";
  if (/간식|병|회복|선물/.test(text)) return "potion";
  if (/구름|방울|비눗/.test(text)) return "cloud";
  if (card.type === "power" || /약속|지속/.test(text)) return "seal";
  if (card.type === "attack" || /펀치|망치|돌진|꼬리별|타격/.test(text)) return "burst";
  return "spark";
}

function shortCardSubject(subject) {
  const words = String(subject).trim().split(/\s+/);
  if (words.length <= 3) return subject;
  return words.slice(-3).join(" ");
}

function rewardIconText(kind) {
  return ({ card: "카", relic: "유", arcana: "기", gold: "★", heal: "＋", upgrade: "↑", socket: "◇", combat: "!" })[kind] || "·";
}

function relicEffectSummary(relic) {
  const effect = relic.effects?.[0];
  if (!effect) return relic.text;
  if (effect.op === "shield_at_battle_start") return `전투 시작 보호막 ${effect.amount}`;
  if (effect.op === "modify_gold_reward_percent") return `별사탕 보상 +${effect.amount}%`;
  if (effect.op === "reveal_next_room_type") return `다음 방 ${effect.amount}개 보기`;
  if (effect.op === "modify_reward_options") return `보상 선택지 +${effect.amount}`;
  if (effect.op === "free_first_high_cost_card") return "첫 고비용 카드 무료";
  if (effect.op === "retain_cards_between_turns") return `카드 ${effect.amount}장 보존`;
  if (effect.op === "modify_shop_cost_percent") return `상점 비용 ${effect.amount}%`;
  if (effect.op === "extra_card_reward_after_elite") return "정예 카드 보상 +1";
  return relic.text;
}

function arcanaEffectSummary(arcana) {
  const effect = arcana.effects?.[0];
  if (!effect) return arcana.text;
  if (effect.op === "enable_cost_ladder_chain") return "비용 순서 연쇄";
  if (effect.op === "modify_gem_reward_chance_percent") return `보석 보상 +${effect.amount}%`;
  if (effect.op === "damage_random_on_guard_play") return `방어 시 피해 ${effect.amount}`;
  if (effect.op === "damage_all_on_attack_kill") return `처치 시 전체 피해 ${effect.amount}`;
  if (effect.op === "heal_after_combat_if_low_hp") return "낮은 체력 전투 후 회복";
  if (effect.op === "draw_when_cards_played") return `카드 ${effect.threshold}장 사용 시 드로우`;
  if (effect.op === "reduce_first_skill_cost_each_turn") return "첫 기술 비용 감소";
  if (effect.op === "preserve_chain_once_per_turn") return "연쇄 보존";
  return arcana.text;
}

function relicMotif(relic) {
  const text = [relic.name, relic.text, relic.effects?.[0]?.op].join(" ");
  if (/등불|shield|보호막/.test(text)) return "lantern";
  if (/주머니|gold|별사탕/.test(text)) return "pouch";
  if (/나침반|map|방/.test(text)) return "compass";
  if (/카드|reward/.test(text)) return "card";
  if (/상점|cost/.test(text)) return "tag";
  if (/베개|retain/.test(text)) return "pillow";
  return "charm";
}

function arcanaMotif(arcana) {
  const text = [arcana.name, arcana.text, arcana.effects?.[0]?.op].join(" ");
  if (/리듬|chain|연쇄|순서/.test(text)) return "rhythm";
  if (/방울|gem|보석/.test(text)) return "bubble";
  if (/구름|guard|방어/.test(text)) return "cloud";
  if (/공격|처치|damage/.test(text)) return "spark";
  if (/회복|heal/.test(text)) return "leaf";
  if (/기술|cost|비용/.test(text)) return "rune";
  return "aura";
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}

main().catch((error) => {
  document.body.innerHTML = `<main class="app-shell"><section class="panel"><h1>데이터 로딩 실패</h1><p>${error.message}</p></section></main>`;
});
