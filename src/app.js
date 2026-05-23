import { loadGameData } from "./core/data-loader.js";
import { cleanseDisruption, disruptionCleanseCost, intentDetail, nextIntent, playCard, endTurn } from "./core/combat.js";
import { advanceRoom, startRun } from "./core/progression.js";
import { applyEventChoice, applyRewardOption, rerollReward } from "./core/rewards.js";
import { cardCost } from "./core/card-effects.js";
import { cardRoleSummary } from "./core/card-roles.js";
import { gemFitHints, gemRoleSummary } from "./core/gem-roles.js";
import { buildFitHints, buildItemRoleSummary } from "./core/build-roles.js";
import { eventChoiceRiskSummary, eventChoiceRoleSummary, eventChoiceSignalItems, eventRiskSpread, eventRoleSummary } from "./core/event-roles.js";
import { rewardOptionInsight } from "./core/reward-insights.js";
import {
  canEquipGemToCard,
  ensureGemState,
  equipGemToCard,
  equippedGemInstancesForCard,
  grantGem,
  modifiedDamageAmount,
  modifiedShieldAmount,
  normalizeCardSockets,
  openSocketForCard,
  socketCapacity,
  unequipGem,
  unequippedGemInstances
} from "./core/gems.js";
import { adjustedRewardCost, ensureModifierState, grantArcana, grantRelic, modifiedCharacterDamageAmount } from "./core/run-modifiers.js";
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
      ${renderCardRoleChip(card)}
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
  runtime.codexKind = runtime.codexKind || "cards";
  runtime.codexStatus = runtime.codexStatus || "unlocked";
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
    <div id="codexPanel">
      ${renderCodexPanel(index, profile, runtime.codexKind, runtime.codexStatus)}
    </div>
    <div id="runRoot"></div>
  `;
  const refreshSetupPreview = () => {
    qs("#setupPreview").innerHTML = renderSetupPreview(index, profile, qs("#characterSelect").value, qs("#stageSelect").value);
  };
  qs("#characterSelect").addEventListener("change", refreshSetupPreview);
  qs("#stageSelect").addEventListener("change", refreshSetupPreview);
  qs("#codexPanel").addEventListener("change", (event) => {
    if (!event.target.matches("#codexKindSelect, #codexStatusSelect")) return;
    runtime.codexKind = qs("#codexKindSelect").value;
    runtime.codexStatus = qs("#codexStatusSelect").value;
    qs("#codexPanel").innerHTML = renderCodexPanel(index, profile, runtime.codexKind, runtime.codexStatus);
  });
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
        ${renderCharacterPassiveChips(character)}
        <div class="preview-stat-row">
          <span>체력 ${character.maxHp}</span>
          <span>기운 ${character.energy}</span>
          <span>시작 덱 ${starterCards.length}장</span>
        </div>
        ${renderStarterCardStrip(starterCards, character.name)}
      </div>
    </section>
    <section class="setup-preview-card stage-preview-card">
      ${renderStageKeyArt(stage)}
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

function renderStageKeyArt(stage) {
  return `
    <div class="stage-key-art stage-key-${stage.backgroundKey || "bright_gate"}">
      <span class="stage-sun"></span>
      <span class="stage-landmark"></span>
      <span class="stage-path"></span>
      <span class="stage-spark one"></span>
      <span class="stage-spark two"></span>
    </div>
  `;
}

function renderCharacterPassiveChips(character) {
  const chips = (character.passiveEffects || []).map(characterPassiveChip);
  if (chips.length === 0) return "";
  return `
    <div class="character-passive-chips" aria-label="${character.name} 패시브 요약">
      ${chips.map((chip) => `
        <span class="character-passive-chip passive-${chip.tone}">
          <b>${chip.icon}</b>
          <em>${chip.label}</em>
          <small>${chip.value}</small>
        </span>
      `).join("")}
    </div>
  `;
}

function characterPassiveChip(effect) {
  if (effect.op === "first_attack_damage_bonus_each_battle") return { tone: "attack", icon: "공", label: "첫 공격", value: `+${effect.amount}` };
  if (effect.op === "shield_at_battle_start") return { tone: "guard", icon: "막", label: "시작 보호막", value: `+${effect.amount}` };
  if (effect.op === "shield_on_first_guard_each_battle") return { tone: "guard", icon: "막", label: "첫 방어", value: `+${effect.amount}` };
  if (effect.op === "draw_when_cards_played") return { tone: "flow", icon: "손", label: `${effect.threshold}장 연계`, value: `드로우 ${effect.amount}` };
  if (effect.op === "draw_at_battle_start") return { tone: "flow", icon: "손", label: "전투 시작", value: `드로우 ${effect.amount}` };
  if (effect.op === "heal_once_when_hp_ratio_below") return { tone: "heal", icon: "회", label: "위기 회복", value: `${Math.round((effect.ratio || 0.5) * 100)}% · +${effect.amount}` };
  if (effect.op === "heal_after_combat_if_low") return { tone: "heal", icon: "회", label: "전투 후 회복", value: `${Math.round((effect.ratio || 0.7) * 100)}% · +${effect.amount}` };
  if (effect.op === "gain_energy_on_chain") return { tone: "flow", icon: "연", label: `연쇄 ${effect.threshold}`, value: `기운 +${effect.amount}` };
  if (effect.op === "gain_shield_on_chain") return { tone: "guard", icon: "연", label: `연쇄 ${effect.threshold}`, value: `보호막 +${effect.amount}` };
  if (effect.op === "bonus_gold_after_elite") return { tone: "reward", icon: "별", label: "정예 보너스", value: `+${effect.amount}` };
  if (effect.op === "gain_gold_on_perfect_combat") return { tone: "reward", icon: "별", label: "완벽 전투", value: `+${effect.amount}` };
  if (effect.op === "damage_front_on_first_skill_each_battle") return { tone: "attack", icon: "술", label: "첫 기술", value: `피해 ${effect.amount}` };
  if (effect.op === "mark_front_at_battle_start") return { tone: "status", icon: "표", label: "시작 표식", value: `+${effect.amount}` };
  if (effect.op === "mark_front_when_cards_played") return { tone: "status", icon: "표", label: `${effect.threshold}장 연계`, value: `표식 +${effect.amount}` };
  if (effect.op === "discount_first_card_type_each_battle") return { tone: "flow", icon: "할", label: `첫 ${typeLabels[effect.cardType] || "카드"}`, value: `비용 -${effect.amount}` };
  if (effect.op === "start_with_energy_each_battle") return { tone: "flow", icon: "기", label: "전투 시작", value: `기운 +${effect.amount}` };
  return { tone: "note", icon: "특", label: "패시브", value: effect.op || "효과" };
}

function renderStarterCardStrip(starterCards, characterName) {
  return `
    <div class="starter-card-strip" aria-label="${characterName} 시작 카드">
      ${starterCards.slice(0, 5).map((card) => `
        <span class="starter-card-pill type-${card.type}" style="--card-accent:${accentFor(card.color)}">
          <b>${cardTypeIcon(card.type)}</b>
          <em>${card.name}</em>
          <small>${typeLabels[card.type] || card.type}</small>
        </span>
      `).join("")}
    </div>
  `;
}

function cardTypeIcon(type) {
  return ({ attack: "공", guard: "막", skill: "술", power: "지", curse: "방", temp: "임" })[type] || "카";
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

function renderCodexPanel(index, profile, kind = "cards", status = "unlocked") {
  const config = codexConfig(kind);
  const entries = codexEntries(index, profile, kind);
  const filtered = entries.filter((entry) => status === "all" || (status === "unlocked" ? entry.unlocked : !entry.unlocked));
  const unlockedCount = entries.filter((entry) => entry.unlocked).length;
  const lockedCount = entries.length - unlockedCount;
  return `
    <section class="codex-panel">
      <div class="panel-head compact-head">
        <div>
          <h2>콘텐츠 도감</h2>
          <span>${config.label} ${filtered.length}/${entries.length} · 해금 ${unlockedCount} · 잠김 ${lockedCount}</span>
        </div>
        <div class="codex-controls">
          <label>분류
            <select id="codexKindSelect">
              ${codexKinds().map((row) => `<option value="${row.kind}" ${row.kind === kind ? "selected" : ""}>${row.label}</option>`).join("")}
            </select>
          </label>
          <label>상태
            <select id="codexStatusSelect">
              ${[
                ["unlocked", "해금"],
                ["all", "전체"],
                ["locked", "잠김"]
              ].map(([value, label]) => `<option value="${value}" ${value === status ? "selected" : ""}>${label}</option>`).join("")}
            </select>
          </label>
        </div>
      </div>
      <div class="codex-grid codex-kind-${kind}" aria-label="${config.label} 도감 목록">
        ${filtered.map((entry) => renderCodexEntry(entry, kind, index)).join("") || "<span class='muted'>표시할 항목 없음</span>"}
      </div>
    </section>
  `;
}

function codexKinds() {
  return [
    { kind: "cards", label: "카드" },
    { kind: "gems", label: "보석" },
    { kind: "relics", label: "유물" },
    { kind: "arcanas", label: "기운" },
    { kind: "characters", label: "캐릭터" },
    { kind: "stages", label: "스테이지" },
    { kind: "events", label: "이벤트" },
    { kind: "enemies", label: "몬스터" }
  ];
}

function codexConfig(kind) {
  return codexKinds().find((row) => row.kind === kind) || codexKinds()[0];
}

function codexEntries(index, profile, kind) {
  const rows = {
    cards: index.data.cards,
    gems: index.data.gems,
    relics: index.data.relics,
    arcanas: index.data.arcanas,
    characters: index.data.characters,
    stages: index.data.stages,
    events: index.data.events,
    enemies: index.data.enemies
  }[kind] || index.data.cards;
  return rows.map((item) => ({ item, unlocked: isCodexUnlocked(profile, kind, item, index) }));
}

function isCodexUnlocked(profile, kind, item, index) {
  if (kind === "cards") return profile.unlockedCards?.includes(item.id);
  if (kind === "gems") return profile.unlockedGems?.includes(item.id);
  if (kind === "relics") return profile.unlockedRelics?.includes(item.id);
  if (kind === "arcanas") return profile.unlockedArcanas?.includes(item.id);
  if (kind === "characters") return profile.unlockedCharacters?.includes(item.id);
  if (kind === "stages") return profile.unlockedStages?.includes(item.id);
  if (kind === "events") return isEventUnlocked(profile, item);
  if (kind === "enemies") {
    return index.data.stages
      .filter((stage) => profile.unlockedStages?.includes(stage.id))
      .some((stage) => [stage.bossEnemyId, ...(stage.enemyPool || []), ...(stage.elitePool || [])].includes(item.id));
  }
  return false;
}

function isEventUnlocked(profile, event) {
  const unlock = event.unlock || { type: "starter_pool" };
  if (["starter", "starter_pool", "none"].includes(unlock.type)) return true;
  if (unlock.type === "stage_clear") return profile.clearedStages?.includes(unlock.stageId);
  return false;
}

function renderCodexEntry(entry, kind, index) {
  const item = entry.item;
  const stateClass = entry.unlocked ? "unlocked" : "locked";
  const entryClass = `codex-entry-kind-${kind} ${stateClass}`;
  const stateBadge = entry.unlocked ? "해금" : "잠김";
  if (kind === "cards") return renderCodexCard(item, entryClass, stateBadge);
  if (kind === "gems") return renderCodexGem(item, entryClass, stateBadge);
  if (kind === "relics") return renderCodexBuildItem("relic", item, entryClass, stateBadge);
  if (kind === "arcanas") return renderCodexBuildItem("arcana", item, entryClass, stateBadge);
  if (kind === "characters") return renderCodexCharacter(item, entryClass, stateBadge);
  if (kind === "stages") return renderCodexStage(item, entryClass, stateBadge, index);
  if (kind === "events") return renderCodexEvent(item, entryClass, stateBadge);
  if (kind === "enemies") return renderCodexEnemy(item, entryClass, stateBadge);
  return "";
}

function renderCodexCard(card, entryClass, stateBadge) {
  return `
    <article class="codex-entry codex-card ${entryClass}" style="--card-accent:${accentFor(card.color)}">
      ${renderCardArt(card, "codex")}
      <div class="codex-copy">
        <span><b>${stateBadge}</b> · ${typeLabels[card.type] || card.type} · ${rarityLabels[card.rarity] || card.rarity} · 비용 ${card.cost}</span>
        <strong>${card.name}</strong>
        ${renderCardRoleChip(card)}
        <p>${card.text}</p>
        <div class="tag-row">${(card.tags || []).map((tag) => `<span>${tag}</span>`).join("")}</div>
      </div>
    </article>
  `;
}

function renderCodexGem(gem, entryClass, stateBadge) {
  return `
    <article class="codex-entry codex-build ${entryClass}">
      <span class="gem-icon ${gemVisualClass(gem)}"></span>
      <div class="codex-copy">
        <span><b>${stateBadge}</b> · ${rarityLabels[gem.rarity] || gem.rarity} · ${gem.socketTypes?.map((type) => gemTypeLabels[type] || type).join(" · ") || "공용"}</span>
        <strong>${gem.name}</strong>
        ${renderGemRoleChip(gem)}
        <p>${gemEffectSummary(gem)}</p>
        ${renderGemFitHints(gem)}
      </div>
    </article>
  `;
}

function renderCodexBuildItem(kind, item, entryClass, stateBadge) {
  return `
    <article class="codex-entry codex-build ${entryClass}">
      ${renderItemIcon(kind, item)}
      <div class="codex-copy">
        <span><b>${stateBadge}</b> · ${kind === "relic" ? "유물" : "기운"} · ${rarityLabels[item.rarity] || item.rarity}</span>
        <strong>${item.name}</strong>
        ${renderBuildRoleChip(item, kind)}
        <p>${kind === "relic" ? relicEffectSummary(item) : arcanaEffectSummary(item)}</p>
        ${renderBuildFitHints(item, kind)}
      </div>
    </article>
  `;
}

function renderCodexEvent(event, entryClass, stateBadge) {
  const role = eventRoleSummary(event);
  const spread = eventRiskSpread(event);
  return `
    <article class="codex-entry codex-event ${entryClass}">
      ${renderEventSceneGraphic(event, "codex")}
      <div class="codex-copy">
        <span><b>${stateBadge}</b> · ${eventTypeLabel(event.type)} · 위험 ${spread.highest.label}</span>
        <strong>${event.name}</strong>
        ${renderEventRoleChip(role)}
        ${renderEventRiskChip(spread.highest, spread.maxLevel)}
        <p>${event.text}</p>
        <span class="event-choice-preview-list" aria-label="${event.name} 선택지 성향">
          ${(event.choices || []).map((choice) => renderEventChoicePreview(choice)).join("")}
        </span>
      </div>
    </article>
  `;
}

function renderCodexCharacter(character, entryClass, stateBadge) {
  return `
    <article class="codex-entry codex-character ${entryClass}" style="--character-accent:${accentFor(character.color)}">
      <div class="codex-portrait-slot">${renderCharacterPortrait(character)}</div>
      <div class="codex-copy">
        <span><b>${stateBadge}</b> · ${character.role} · 체력 ${character.maxHp}</span>
        <strong>${character.name}</strong>
        <p>${character.passiveText}</p>
        ${renderCharacterPassiveChips(character)}
      </div>
    </article>
  `;
}

function renderCodexStage(stage, entryClass, stateBadge, index) {
  const boss = index.enemies.get(stage.bossEnemyId);
  return `
    <article class="codex-entry codex-stage ${entryClass}">
      ${renderStageKeyArt(stage)}
      <div class="codex-copy">
        <span><b>${stateBadge}</b> · ${stage.order}. 스테이지 · ${stage.floorCount}개 방</span>
        <strong>${stage.name}</strong>
        <p>${stage.biome} · 보스 ${boss?.name || "미정"}</p>
        ${renderStageRoomStrip(stage)}
      </div>
    </article>
  `;
}

function renderCodexEnemy(enemy, entryClass, stateBadge) {
  return `
    <article class="codex-entry codex-enemy ${entryClass}">
      ${renderMonsterPortrait(enemy)}
      <div class="codex-copy">
        <span><b>${stateBadge}</b> · ${enemyRankLabel(enemy.rank)} · ${enemy.family || "미로"}</span>
        <strong>${enemy.name}</strong>
        <p>체력 ${enemy.maxHp} · 방어 ${enemy.block || 0} · 의도 ${enemy.intents?.length || 0}종</p>
      </div>
    </article>
  `;
}

function renderProfilePanel(profile, index) {
  const nextStage = index.data.stages.find((stage) => isUnlocked(profile, "unlockedStages", stage.id) && !profile.clearedStages.includes(stage.id));
  const nextAchievements = nextAchievementGoals(profile, index).slice(0, 3);
  const nextUnlocks = nextUnlockGoals(profile, index).slice(0, 4);
  const counts = [
    { key: "stage", label: "스테이지", current: profile.clearedStages.length, total: index.data.stages.length },
    { key: "character", label: "캐릭터", current: profile.unlockedCharacters.length, total: index.data.characters.length },
    { key: "card", label: "카드", current: profile.unlockedCards.length, total: index.data.cards.length },
    { key: "gem", label: "보석", current: profile.unlockedGems.length, total: index.data.gems.length },
    { key: "relic", label: "유물", current: profile.unlockedRelics.length, total: index.data.relics.length },
    { key: "arcana", label: "기운", current: profile.unlockedArcanas.length, total: index.data.arcanas.length },
    { key: "achievement", label: "업적", current: profile.achievements.length, total: index.data.achievements.length }
  ];
  return `
    <section class="profile-panel">
      <div class="panel-head compact-head">
        <h2>진행 상황</h2>
        <span>${profile.stats.wins}승 · ${profile.stats.totalRuns}회 탐험</span>
      </div>
      <div class="profile-grid">
        ${counts.map(renderProfileStat).join("")}
      </div>
      <div class="profile-next">
        <strong>다음 목표</strong>
        <span>${nextStage ? `${nextStage.order}. ${nextStage.name} 클리어` : "모든 스테이지 클리어"}</span>
      </div>
      <div class="profile-detail-grid">
        <div class="goal-list">
          <strong>다가오는 업적</strong>
          ${nextAchievements.map(renderAchievementGoalCard).join("") || "<span class='muted'>남은 업적 없음</span>"}
        </div>
        <div class="goal-list">
          <strong>다음 해금</strong>
          ${nextUnlocks.map(renderUnlockGoalCard).join("") || "<span class='muted'>남은 해금 없음</span>"}
        </div>
      </div>
    </section>
  `;
}

function renderProfileStat(stat) {
  const ratio = stat.total > 0 ? Math.min(100, Math.round((stat.current / stat.total) * 100)) : 0;
  return `
    <div class="profile-stat profile-stat-${stat.key}" style="--profile-progress:${ratio}%">
      <span class="profile-stat-icon">${profileStatIcon(stat.key)}</span>
      <div>
        <span>${stat.label}</span>
        <strong>${stat.current}/${stat.total}</strong>
      </div>
      <i class="profile-stat-meter"><b></b></i>
    </div>
  `;
}

function renderAchievementGoalCard(item) {
  const percent = Math.round(item.progress.ratio * 100);
  return `
    <article class="goal-card achievement-goal goal-${item.goalType}" style="--goal-progress:${percent}%">
      <span class="achievement-badge">${achievementBadgeText(item.goalType)}</span>
      <div class="goal-copy">
        <span>${item.name}</span>
        <small>${item.progress.current}/${item.progress.total} · ${item.description}</small>
        <em>${item.rewardLabel}</em>
      </div>
      <i class="goal-progress-meter"><b></b></i>
    </article>
  `;
}

function renderUnlockGoalCard(item) {
  return `
    <article class="goal-card unlock-goal unlock-kind-${item.kind}">
      <span class="unlock-icon">${unlockIconText(item.kind)}</span>
      <div class="goal-copy">
        <span>${item.name}</span>
        <small>${item.label}</small>
      </div>
    </article>
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
      description: achievement.description,
      progress: achievement.progress,
      rewardLabel: achievement.rewardLabel,
      goalType: achievementGoalType(achievement.trigger || {}, achievement.reward || {})
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
      .map((stage) => ({ kind: "stage", name: `${stage.order}. ${stage.name}`, label: unlockRequirementLabel(stage.unlock, index) })),
    ...index.data.characters
      .filter((character) => !profile.unlockedCharacters.includes(character.id))
      .map((character) => ({ kind: "character", name: character.name, label: unlockRequirementLabel(character.unlock, index) })),
    ...index.data.cards
      .filter((card) => !profile.unlockedCards.includes(card.id))
      .map((card) => ({ kind: "card", name: card.name, label: unlockRequirementLabel(card.unlock, index) })),
    ...index.data.gems
      .filter((gem) => !profile.unlockedGems.includes(gem.id))
      .map((gem) => ({ kind: "gem", name: gem.name, label: unlockRequirementLabel(gem.unlock, index) })),
    ...index.data.relics
      .filter((relic) => !profile.unlockedRelics.includes(relic.id))
      .map((relic) => ({ kind: "relic", name: relic.name, label: unlockRequirementLabel(relic.unlock, index) })),
    ...index.data.arcanas
      .filter((arcana) => !profile.unlockedArcanas.includes(arcana.id))
      .map((arcana) => ({ kind: "arcana", name: arcana.name, label: unlockRequirementLabel(arcana.unlock, index) }))
  ];
  return rows.filter((row) => row.label !== "기본 해금");
}

function achievementGoalType(trigger = {}, reward = {}) {
  if (trigger.op === "clear_stage" || trigger.op === "clear_rooms_in_stage") return "stage";
  if (trigger.op === "defeat_enemy" || trigger.op === "defeat_rank") return "battle";
  if (trigger.op === "reach_chain") return "chain";
  if (trigger.op?.startsWith("collect")) return "collection";
  if (trigger.op === "unlock_character") return "character";
  if (reward.unlockGemId || reward.unlockRelicId || reward.unlockArcanaId) return "build";
  return "achievement";
}

function achievementBadgeText(type) {
  return ({ stage: "길", battle: "전", chain: "연", collection: "수", character: "친", build: "빌", achievement: "★" })[type] || "★";
}

function unlockIconText(kind) {
  return ({ stage: "길", character: "친", card: "카", gem: "보", relic: "유", arcana: "기", achievement: "★", town: "마" })[kind] || "열";
}

function profileStatIcon(key) {
  return ({ stage: "길", character: "친", card: "카", gem: "보", relic: "유", arcana: "기", achievement: "★" })[key] || "·";
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
      ${state.phase === "room_complete" ? "" : renderActionFeedback(state)}
      ${renderStageRoute(state, stage, index)}
      ${renderCurrentRoomPanel(state, stage, index)}
      ${renderPhase(state, index)}
      ${renderBuildPanel(state, index)}
      ${renderGemVault(state, index)}
      <div class="log-list">${state.log.map((log) => `<span>${escapeHtml(log)}</span>`).join("")}</div>
    </section>
  `;
  bindRunActions();
}

function renderActionFeedback(state) {
  const feedback = state.status.actionFeedback;
  if (!feedback) return "";
  return `
    <section class="action-feedback action-feedback-${feedback.kind} feedback-tone-${feedback.tone}" data-feedback-id="${feedback.id}">
      <span class="action-feedback-icon" aria-hidden="true">${escapeHtml(feedback.icon)}</span>
      <div class="action-feedback-copy">
        <span>${escapeHtml(feedback.title)}</span>
        <strong>${escapeHtml(feedback.subject)}</strong>
        ${feedback.detail ? `<p>${escapeHtml(feedback.detail)}</p>` : ""}
      </div>
      <div class="action-feedback-metrics">
        ${(feedback.metrics || []).map((metric) => `
          <span class="feedback-stat feedback-stat-${feedbackMetricClass(metric.label)}">
            <em>${escapeHtml(metric.label)}</em>
            <b>${escapeHtml(metric.value)}</b>
          </span>
        `).join("")}
      </div>
    </section>
  `;
}

function feedbackMetricClass(label = "") {
  if (label.includes("피해") || label.includes("처치")) return "damage";
  if (label.includes("차단") || label.includes("보호막")) return "guard";
  if (label.includes("회복")) return "heal";
  if (label.includes("드로우") || label.includes("기운")) return "flow";
  if (label.includes("별사탕") || label.includes("획득")) return "reward";
  return "note";
}

function renderCurrentRoomPanel(state, stage, index) {
  if (!stage || ["room_complete", "stage_clear", "defeat"].includes(state.phase)) return "";
  const roomType = state.currentRoomType || stage.rooms?.[state.roomIndex] || state.phase;
  const roomNumber = Math.min((state.roomIndex || 0) + 1, stage.rooms?.length || 1);
  const boss = index.enemies.get(stage.bossEnemyId);
  const chips = currentRoomChips(roomType, state, stage, boss);
  return `
    <section class="current-room-panel room-current-${roomType}">
      <div class="current-room-core">
        <span class="current-room-emblem room-${roomType}">${roomIcon(roomType)}</span>
        <div class="current-room-copy">
          <span class="route-kicker">현재 방</span>
          <strong>${roomNumber}. ${roomLabel(roomType)}</strong>
          <p>${currentRoomDetail(roomType, state, stage, boss)}</p>
        </div>
      </div>
      <div class="current-room-chip-list">
        ${chips.map((chip) => `<span class="current-room-chip chip-${chip.tone}"><b>${chip.label}</b>${chip.value ? `<em>${chip.value}</em>` : ""}</span>`).join("")}
      </div>
    </section>
  `;
}

function currentRoomDetail(roomType, state, stage, boss) {
  const enemies = Array.isArray(state.enemies) ? state.enemies : [];
  if (roomType === "boss") return `${boss?.name || enemies[0]?.name || "보스"}의 페이즈 변화를 보며 마지막 보상을 향해 갑니다.`;
  if (roomType === "elite") return "정예 몬스터는 더 거칠지만 보상도 큽니다. 손패 순서와 보호막을 먼저 확인하세요.";
  if (roomType === "combat") return `${enemies.length || 1}마리 몬스터와 전투합니다. 의도와 예상 피해를 보고 카드 순서를 고릅니다.`;
  if (roomType === "event") return `${state.pendingEvent?.name || "이벤트"} 선택지로 덱과 체력 흐름이 달라집니다.`;
  if (roomType === "shop") return "별사탕으로 카드, 보석, 유물, 기운을 정비하는 방입니다.";
  if (roomType === "reward") return "이번 전투의 보상 중 다음 빌드에 맞는 성장을 고릅니다.";
  if (roomType === "rest") return "체력을 회복하고 다음 전투를 준비하는 쉼터입니다.";
  return `${stage.name}의 다음 선택을 준비합니다.`;
}

function currentRoomChips(roomType, state, stage, boss) {
  const chips = [
    { tone: "note", label: "진행", value: `${Math.min((state.roomIndex || 0) + 1, stage.rooms?.length || 1)}/${stage.rooms?.length || 1}` }
  ];
  if (["combat", "elite", "boss"].includes(roomType)) {
    chips.push({ tone: roomType === "boss" ? "danger" : "combat", label: "적", value: `${state.enemies?.length || 1}` });
    chips.push({ tone: "flow", label: "턴", value: `${state.turn || 1}` });
    chips.push({ tone: "guard", label: "보호막", value: `${state.player?.shield || 0}` });
  }
  if (roomType === "boss") chips.push({ tone: "danger", label: "보스", value: boss?.name || "결전" });
  if (roomType === "elite") chips.push({ tone: "reward", label: "추가 보상", value: "높음" });
  if (roomType === "event") chips.push({ tone: "reward", label: "선택지", value: `${state.pendingEvent?.choices?.length || 0}` });
  if (["shop", "reward"].includes(roomType)) {
    chips.push({ tone: "reward", label: "별사탕", value: `${state.player?.gold || 0}` });
    chips.push({ tone: "flow", label: "선택", value: `${state.pendingReward?.options?.length || 0}` });
  }
  if (roomType === "rest") chips.push({ tone: "heal", label: "회복", value: "즉시" });
  return chips;
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
  if (state.phase === "room_complete") return renderRoomComplete(state, index);
  if (state.phase === "stage_clear" || state.phase === "defeat") return renderRunResult(state);
  return "";
}

function renderRoomComplete(state, index) {
  const stage = index.stages.get(state.stageId);
  const player = state.player || {};
  const metrics = state.metrics || {};
  const completedRoomType = state.currentRoomType || stage?.rooms?.[state.roomIndex] || "combat";
  const nextRoomIndex = state.roomIndex + 1;
  const nextRoomType = stage?.rooms?.[nextRoomIndex] || null;
  const pendingEventEnemy = state.status?.eventCombatEnemyId ? index.enemies.get(state.status.eventCombatEnemyId) : null;
  const progress = stage?.rooms?.length ? boundedPercent(nextRoomIndex, stage.rooms.length) : 100;
  const boss = stage ? index.enemies.get(stage.bossEnemyId) : null;
  return `
    <section class="room-complete-panel room-complete-${completedRoomType}">
      <div class="room-complete-head">
        <span class="room-complete-emblem room-${completedRoomType}">${roomIcon(completedRoomType)}</span>
        <div>
          <span class="route-kicker">방 완료</span>
          <strong>${roomLabel(completedRoomType)} 완료</strong>
          <p>${stage?.name || "스테이지"} · ${Math.min(nextRoomIndex, stage?.rooms?.length || nextRoomIndex)}/${stage?.rooms?.length || nextRoomIndex}개 방 진행</p>
        </div>
      </div>
      <div class="room-complete-meter" aria-label="다음 방 진행률">
        <i style="width:${progress}%"></i>
      </div>
      <div class="room-complete-grid">
        <article class="room-complete-card">
          <span>이번 방 성과</span>
          <strong>${roomCompleteSummary(completedRoomType, state)}</strong>
          <p>체력 ${player.hp ?? 0}/${player.maxHp ?? 0} · 별사탕 ${player.gold ?? 0} · 처치 ${metrics.enemiesDefeated || 0}</p>
        </article>
        <article class="room-complete-card next-room-preview ${pendingEventEnemy ? "room-combat pending-event-combat" : nextRoomType ? `room-${nextRoomType}` : "room-stage-clear"}">
          <span>${pendingEventEnemy ? "추가 전투" : nextRoomType ? "다음 방" : "다음 목표"}</span>
          <strong>${pendingEventEnemy ? pendingEventEnemy.name : nextRoomType ? roomLabel(nextRoomType) : "스테이지 결과"}</strong>
          <p>${pendingEventEnemy ? `${rankLabel(pendingEventEnemy.rank)} 장난 전투 후 보상을 확인합니다.` : nextRoomDetail(nextRoomType, boss, stage)}</p>
        </article>
      </div>
      ${renderRoomCompleteFeedback(state)}
      <button class="primary-btn room-advance-btn" data-action="advance">${pendingEventEnemy ? "추가 전투 시작" : nextRoomType ? "다음 방으로" : "결과 보기"}</button>
    </section>
  `;
}

function renderRoomCompleteFeedback(state) {
  const feedback = state.status?.actionFeedback;
  if (!feedback) return "";
  return `
    <article class="room-complete-feedback room-complete-feedback-${feedback.kind} feedback-tone-${feedback.tone}">
      <span class="room-complete-feedback-icon" aria-hidden="true">${escapeHtml(feedback.icon)}</span>
      <div class="room-complete-feedback-copy">
        <span>직전 결과 · ${escapeHtml(feedback.title)}</span>
        <strong>${escapeHtml(feedback.subject)}</strong>
        ${feedback.detail ? `<p>${escapeHtml(feedback.detail)}</p>` : ""}
      </div>
      <div class="room-complete-feedback-metrics">
        ${(feedback.metrics || []).map((metric) => `
          <span class="feedback-stat feedback-stat-${feedbackMetricClass(metric.label)}">
            <em>${escapeHtml(metric.label)}</em>
            <b>${escapeHtml(metric.value)}</b>
          </span>
        `).join("")}
      </div>
    </article>
  `;
}

function roomCompleteSummary(roomType, state) {
  const metrics = state.metrics || {};
  if (["combat", "elite", "boss"].includes(roomType)) return `전투 승리 · 최대 연쇄 ${metrics.maxChain || 0}`;
  if (roomType === "event") return "이벤트 선택 완료";
  if (roomType === "rest") return "쉼터 회복 완료";
  if (roomType === "shop") return "상점 정비 완료";
  if (roomType === "reward") return "보상 선택 완료";
  return "탐험 진행";
}

function nextRoomDetail(roomType, boss, stage) {
  if (!roomType) return `${stage?.clearRewards?.gold || 0} 별사탕 보상 정산`;
  if (roomType === "boss") return `보스 ${boss?.name || "미정"}와 결전`;
  if (roomType === "elite") return "강한 몬스터와 추가 보상";
  if (roomType === "event") return "선택지에 따라 성장";
  if (roomType === "shop") return "별사탕으로 보상 구매";
  if (roomType === "rest") return "체력 회복과 숨 고르기";
  if (roomType === "reward") return "추가 보상 선택";
  return "일반 몬스터 전투";
}

function renderCombat(state, index) {
  const forecast = combatForecast(state);
  return `
    <div class="combat-grid">
      ${renderCombatForecast(state, index, forecast)}
      ${renderDisruptionControl(state, index)}
      ${renderCombatImpactStrip(state)}
      <section class="enemy-row">
        ${state.enemies.map((enemy) => renderEnemyCard(enemy, state, index)).join("")}
      </section>
      <section class="hand-row">
        ${state.hand.map((cardId, handIndex) => {
          const card = index.cards.get(cardId);
          return renderHandCard(card, handIndex, state, index);
        }).join("")}
      </section>
      <button class="secondary-btn" data-action="end-turn">턴 종료</button>
    </div>
  `;
}

function renderCombatImpactStrip(state) {
  const feedback = state.status?.actionFeedback;
  if (!feedback || !["card", "enemy", "cleanse"].includes(feedback.kind)) return "";
  const items = combatImpactItems(feedback);
  if (items.length === 0) return "";
  return `
    <section class="combat-impact-strip feedback-tone-${feedback.tone}" aria-label="방금 전투 효과">
      <div class="combat-impact-head">
        <span class="combat-impact-icon">${escapeHtml(feedback.icon)}</span>
        <div>
          <span>방금 효과</span>
          <strong>${escapeHtml(feedback.subject)}</strong>
        </div>
      </div>
      <div class="combat-impact-list">
        ${items.map((item) => `
          <span class="combat-impact-chip impact-${item.tone}">
            <b>${escapeHtml(item.label)}</b>
            <em>${escapeHtml(item.value)}</em>
          </span>
        `).join("")}
      </div>
    </section>
  `;
}

function combatImpactItems(feedback) {
  const items = [];
  for (const event of feedback.selfEvents || []) {
    items.push({ tone: event.tone || "note", label: event.label || "효과", value: String(event.value || "") });
  }
  for (const event of feedback.targetEvents || []) {
    const parts = [];
    if (event.damage > 0) parts.push(`피해 -${event.damage}`);
    if (event.blocked > 0) parts.push(`차단 ${event.blocked}`);
    if (event.defeated) parts.push("처치");
    if (parts.length > 0) {
      items.push({
        tone: event.defeated || event.damage > 0 ? "damage" : "guard",
        label: event.targetName || "대상",
        value: parts.join(" · ")
      });
    }
  }
  for (const event of feedback.gemEvents || []) {
    items.push({ tone: "gem", label: "보석", value: `${event.name} · ${event.summary}` });
  }
  if (items.length === 0) {
    for (const metric of feedback.metrics || []) {
      items.push({ tone: feedbackMetricClass(metric.label), label: metric.label, value: String(metric.value) });
    }
  }
  return items.slice(0, 6);
}

function renderHandCard(card, handIndex, state, index) {
  if (!card) return "";
  const cost = cardCost(card, state, index);
  const canPlay = cost <= state.player.energy;
  const previews = cardEffectPreviewChips(card, state, index);
  const equippedGems = equippedGemInstancesForCard(state, index, card.id)
    .map((instance) => ({ instance, gem: index.gems.get(instance.gemId) }))
    .filter((item) => item.gem);
  return `
    <button class="play-card card-type-${card.type} ${canPlay ? "playable" : "unplayable"}" data-action="play-card" data-hand-index="${handIndex}" style="--card-accent:${accentFor(card.color)}" ${canPlay ? "" : "disabled"}>
      <span class="cost">${cost}</span>
      <span class="card-ready-chip ${canPlay ? "ready" : "blocked"}">${canPlay ? "사용 가능" : `기운 ${cost - state.player.energy} 부족`}</span>
      <strong>${card.name}</strong>
      <small>${typeLabels[card.type] || card.type}</small>
      ${renderCardArt(card, "hand")}
      ${renderCardRoleChip(card)}
      <p>${card.text}</p>
      ${renderCardPlayCue(card, state, cost, canPlay, previews, equippedGems)}
      ${renderHandGemEffects(equippedGems, card, state, index, cost)}
      <span class="card-preview-list" aria-label="${card.name} 효과 미리보기">
        ${previews.map(renderCardPreviewChip).join("") || `<span class="card-preview-chip preview-note"><b>효</b><em>특수 효과</em></span>`}
      </span>
    </button>
  `;
}

function renderCardRoleChip(card) {
  const role = cardRoleSummary(card);
  return `
    <span class="card-role-chip card-role-${role.tone}" title="${role.label}">
      <b>${role.icon}</b>
      <em>${role.label}</em>
    </span>
  `;
}

function renderCardPreviewChip(chip) {
  return `<span class="card-preview-chip preview-${chip.tone}"><b>${chip.icon}</b><em>${chip.label}</em></span>`;
}

function renderCardPlayCue(card, state, cost, canPlay, previews, equippedGems) {
  const items = cardPlayCueItems(card, state, cost, canPlay, previews, equippedGems);
  if (items.length === 0) return "";
  return `
    <span class="card-play-cue" aria-label="${card.name} 발동 흐름">
      ${items.map((item) => `
        <span class="card-cue-chip cue-${item.key} cue-${item.tone}">
          <b>${item.label}</b>
          <em>${item.value}</em>
        </span>
      `).join("")}
    </span>
  `;
}

function cardPlayCueItems(card, state, cost, canPlay, previews, equippedGems) {
  const items = [
    {
      key: "cost",
      tone: canPlay ? "flow" : "danger",
      label: "1 비용",
      value: canPlay ? `기운 ${cost}` : `${Math.max(1, cost - state.player.energy)} 부족`
    }
  ];
  const primaryPreview = previews.find((chip) => !["danger", "note"].includes(chip.tone)) || previews[0];
  if (primaryPreview) {
    items.push({
      key: "effect",
      tone: primaryPreview.tone,
      label: "2 효과",
      value: primaryPreview.label
    });
  }
  const condition = cardConditionCue(card, state);
  if (condition) items.push(condition);
  if (equippedGems.length > 0) {
    items.push({
      key: "gem",
      tone: "gem",
      label: "보석",
      value: `${equippedGems.length}개 적용`
    });
  }
  if (card.type === "temp" || card.type === "curse" || card.effects?.some((effect) => effect.op === "exhaust_self")) {
    items.push({
      key: "exit",
      tone: "note",
      label: "사용 후",
      value: "소멸"
    });
  }
  return items.slice(0, 4);
}

function cardConditionCue(card, state) {
  for (const effect of card.effects || []) {
    if (effect.op === "damage_bonus_if_cards_played_at_least") {
      const ready = state.metrics.cardsPlayedThisTurn >= effect.threshold;
      return { key: "condition", tone: ready ? "reward" : "note", label: "조건", value: ready ? "활성" : `${effect.threshold}장 필요` };
    }
    if (effect.op === "damage_bonus_if_chain_at_least") {
      const ready = (state.status.chain || 0) >= effect.threshold;
      return { key: "condition", tone: ready ? "reward" : "note", label: "조건", value: ready ? "연쇄 활성" : `연쇄 ${effect.threshold}` };
    }
    if (effect.op === "damage_bonus_if_hand_at_most") {
      const ready = state.hand.length <= effect.threshold;
      return { key: "condition", tone: ready ? "reward" : "note", label: "조건", value: ready ? "손패 활성" : `${effect.threshold}장 이하` };
    }
    if (effect.op === "damage_bonus_vs_marked") {
      const markedCount = state.enemies.filter((enemy) => enemy.status?.mark > 0).length;
      return { key: "condition", tone: markedCount > 0 ? "reward" : "note", label: "조건", value: markedCount > 0 ? `표식 ${markedCount}` : "표식 필요" };
    }
    if (effect.op === "draw_if_kill") {
      return { key: "condition", tone: "note", label: "조건", value: "처치 시" };
    }
    if (effect.op === "heal_if_hp_ratio_below") {
      const ready = state.player.hp / state.player.maxHp <= effect.ratio;
      return { key: "condition", tone: ready ? "heal" : "note", label: "조건", value: ready ? "회복 준비" : `${Math.round(effect.ratio * 100)}% 이하` };
    }
    if (effect.op === "repeat_previous_basic_effect" || effect.op === "repeat_previous_basic_effect_if_cost_at_most") {
      const previous = state.status.previousCard;
      const ready = previous && (!effect.cost || previous.cost <= effect.cost) && previous.id !== card.id;
      return { key: "condition", tone: ready ? "flow" : "note", label: "조건", value: ready ? "이전 카드" : "이전 필요" };
    }
  }
  return null;
}

function renderHandGemEffects(equippedGems, card, state, index, currentCost) {
  const items = equippedGems.flatMap(({ gem }) =>
    handGemEffectItems(gem, card, state, index, currentCost).map((item) => ({ ...item, gem }))
  );
  if (items.length === 0) return "";
  const visibleItems = items.slice(0, 3);
  const hiddenCount = items.length - visibleItems.length;
  return `
    <span class="hand-gem-list" aria-label="${card.name} 장착 보석 효과">
      ${visibleItems.map(renderHandGemChip).join("")}
      ${hiddenCount > 0 ? `
        <span class="hand-gem-chip hand-gem-note" title="추가 장착 보석 ${hiddenCount}개">
          <span class="gem-icon gem-white gem-rarity-common gem-socket-any"></span>
          <span class="hand-gem-copy"><b>보석</b><em>+${hiddenCount}개</em></span>
        </span>
      ` : ""}
    </span>
  `;
}

function renderHandGemChip(item) {
  const role = gemRoleSummary(item.gem);
  return `
    <span class="hand-gem-chip hand-gem-${item.tone}" title="${item.gem.name} · ${role.label} · ${gemEffectSummary(item.gem)}">
      <span class="gem-icon ${gemVisualClass(item.gem)}"></span>
      <span class="hand-gem-copy"><b>${item.label}</b><em>${item.value} · ${role.icon}</em></span>
    </span>
  `;
}

function handGemEffectItems(gem, card, state, index, currentCost) {
  const effect = gem.effects?.[0];
  if (!effect) return [{ tone: "note", label: "보석", value: gem.name }];
  if (effect.op === "modify_damage_percent") return [{ tone: "damage", label: "보석 피해", value: `+${effect.amount}%` }];
  if (effect.op === "modify_shield_percent") return [{ tone: "guard", label: "보석 보호", value: `+${effect.amount}%` }];
  if (effect.op === "modify_cost") return [{ tone: "flow", label: "보석 비용", value: `${effect.amount} · 현재 ${currentCost}` }];
  if (effect.op === "heal_on_play") return [{ tone: "heal", label: "보석 회복", value: `+${effect.amount}` }];
  if (effect.op === "apply_mark_on_play") return [{ tone: "status", label: "보석 표식", value: `+${effect.amount}` }];
  if (effect.op === "echo_basic_effect") return [{ tone: "flow", label: "보석 메아리", value: `${Math.round(effect.ratio * 100)}%` }];
  if (effect.op === "splash_damage") return [{ tone: "damage", label: "보석 주변", value: `${Math.round(effect.ratio * 100)}%` }];
  if (effect.op === "preserve_chain") return [{ tone: "flow", label: "보석 연쇄", value: "유지" }];
  if (effect.op === "bridge_next_color_bonus") return [{ tone: "flow", label: "다음 색", value: "연결" }];
  return [{ tone: "note", label: "보석", value: gemEffectSummary(gem) }];
}

function cardEffectPreviewChips(card, state, index) {
  const preview = createCardPreviewState(state);
  const chips = [];
  for (const effect of card.effects || []) {
    const chip = cardEffectPreviewChip(effect, card, state, index, preview);
    if (Array.isArray(chip)) chips.push(...chip);
    else if (chip) chips.push(chip);
  }
  if (state.status.playerWeak > 0 && chips.some((chip) => chip.tone === "damage")) {
    chips.push({ tone: "danger", icon: "약", label: "약화 반영" });
  }
  return chips.slice(0, 5);
}

function cardEffectPreviewChip(effect, card, state, index, preview) {
  const front = previewFrontEnemy(preview);
  const aliveEnemies = preview.enemies.filter((enemy) => enemy.hp > 0);
  if (effect.op === "damage_front") return previewDamageEffect("피", "피해", effect.amount, front, card, preview, index);
  if (effect.op === "damage_all") {
    const result = aliveEnemies.reduce((sum, enemy) => {
      const next = previewDamageEnemy(effect.amount, enemy, card, preview, index);
      return { damage: sum.damage + next.damage, blocked: sum.blocked + next.blocked, killed: sum.killed || next.killed };
    }, { damage: 0, blocked: 0, killed: false });
    return damagePreviewChip("전", result, `전체 ${aliveEnemies.length}`);
  }
  if (effect.op === "damage_random") {
    const amount = previewModifiedDamage(effect.amount, card, preview, index);
    return { tone: "damage", icon: "무", label: `무작위 ${amount}x${effect.hits || 1}` };
  }
  if (effect.op === "damage_bonus_if_cards_played_at_least") {
    const ready = state.metrics.cardsPlayedThisTurn >= effect.threshold;
    return ready ? previewDamageEffect("추", "조건 피해", effect.amount, front, card, preview, index) : { tone: "note", icon: "조", label: `${effect.threshold}장 필요` };
  }
  if (effect.op === "damage_bonus_if_chain_at_least") {
    const ready = (state.status.chain || 0) >= effect.threshold;
    return ready ? previewDamageEffect("연", "연쇄 피해", effect.amount, front, card, preview, index) : { tone: "note", icon: "연", label: `연쇄 ${effect.threshold} 필요` };
  }
  if (effect.op === "damage_bonus_if_hand_at_most") {
    const ready = state.hand.length <= effect.threshold;
    return ready ? previewDamageEffect("손", "손패 보너스", effect.amount, front, card, preview, index) : { tone: "note", icon: "손", label: `${effect.threshold}장 이하` };
  }
  if (effect.op === "damage_bonus_vs_marked") {
    const marked = aliveEnemies.filter((enemy) => enemy.status?.mark > 0);
    const result = marked.reduce((sum, enemy) => {
      const next = previewDamageEnemy(effect.amount, enemy, card, preview, index);
      return { damage: sum.damage + next.damage, blocked: sum.blocked + next.blocked, killed: sum.killed || next.killed };
    }, { damage: 0, blocked: 0, killed: false });
    return marked.length > 0 ? damagePreviewChip("표", result, `표식 ${marked.length}`) : { tone: "note", icon: "표", label: "표식 대상 필요" };
  }
  if (effect.op === "gain_shield") return { tone: "guard", icon: "막", label: `보호막 +${modifiedShieldAmount(card, state, index, effect.amount)}` };
  if (effect.op === "retain_shield_next_turn") return { tone: "guard", icon: "유", label: `유지 ${effect.amount}` };
  if (effect.op === "reduce_next_attack") return { tone: "guard", icon: "감", label: `피해감소 ${effect.amount}` };
  if (effect.op === "draw") return { tone: "flow", icon: "뽑", label: `드로우 ${effect.amount}` };
  if (effect.op === "draw_if_kill") return { tone: preview.killedThisPlay ? "flow" : "note", icon: "처", label: preview.killedThisPlay ? `처치 드로우 +${effect.amount}` : `처치 시 +${effect.amount}` };
  if (effect.op === "gain_energy") return { tone: "flow", icon: "기", label: `기운 +${effect.amount}` };
  if (effect.op === "lose_energy") return { tone: "danger", icon: "기", label: `기운 -${effect.amount}` };
  if (effect.op === "discount_next_card") return { tone: "flow", icon: "할", label: `다음 비용 -${effect.amount}` };
  if (effect.op === "increase_next_card_cost") return { tone: "danger", icon: "값", label: `다음 비용 +${effect.amount}` };
  if (effect.op === "apply_mark") return { tone: "status", icon: "표", label: `표식 +${effect.amount}` };
  if (effect.op === "heal_if_hp_ratio_below") {
    const ready = state.player.hp / state.player.maxHp <= effect.ratio;
    return { tone: ready ? "heal" : "note", icon: "회", label: ready ? `회복 +${effect.amount}` : `${Math.round(effect.ratio * 100)}% 이하` };
  }
  if (effect.op === "enable_reflect_damage") return { tone: "guard", icon: "반", label: `반사 ${Math.round(effect.ratio * 100)}%` };
  if (effect.op === "increase_next_card_reward_options") return { tone: "reward", icon: "보", label: `보상 +${effect.amount}` };
  if (effect.op === "prepare_socket_bonus") return { tone: "reward", icon: "홈", label: `소켓 +${effect.amount}` };
  if (effect.op === "repeat_previous_basic_effect" || effect.op === "repeat_previous_basic_effect_if_cost_at_most") {
    const previous = state.status.previousCard;
    const allowed = previous && (!effect.cost || previous.cost <= effect.cost) && previous.id !== card.id;
    return { tone: allowed ? "flow" : "note", icon: "반", label: allowed ? "이전 효과" : "이전 카드 필요" };
  }
  if (effect.op === "add_battle_rule") return { tone: "guard", icon: "약", label: `${colorLabels[effect.color] || effect.color} 보호막` };
  if (effect.op === "reset_chain") return { tone: "danger", icon: "끊", label: "연쇄 초기화" };
  if (effect.op === "exhaust_self") return { tone: "note", icon: "소", label: "이번 전투 제외" };
  return { tone: "note", icon: "효", label: effect.op };
}

function previewDamageEffect(icon, label, amount, enemy, card, preview, index) {
  return damagePreviewChip(icon, previewDamageEnemy(amount, enemy, card, preview, index), label);
}

function damagePreviewChip(icon, result, label) {
  const blocked = result.blocked > 0 ? ` · 차단 ${result.blocked}` : "";
  const killed = result.killed ? " · 처치 예상" : "";
  return { tone: "damage", icon, label: `${label} ${result.damage}${blocked}${killed}` };
}

function createCardPreviewState(state) {
  return {
    ...state,
    player: { ...state.player },
    status: { ...state.status },
    metrics: { ...state.metrics },
    log: [],
    enemies: state.enemies.map((enemy) => ({
      ...enemy,
      status: { ...(enemy.status || {}) }
    }))
  };
}

function previewFrontEnemy(preview) {
  return preview.enemies.find((enemy) => enemy.hp > 0) || null;
}

function previewDamageEnemy(amount, enemy, card, preview, index) {
  if (!amount || !enemy || enemy.hp <= 0) return { damage: 0, blocked: 0, killed: false };
  const finalAmount = previewModifiedDamage(amount, card, preview, index);
  const markBonus = enemy.status?.mark ? Math.ceil(finalAmount * Math.min(0.6, enemy.status.mark * 0.15)) : 0;
  let incoming = finalAmount + markBonus;
  const blocked = Math.min(enemy.block || 0, incoming);
  enemy.block = Math.max(0, (enemy.block || 0) - blocked);
  incoming -= blocked;
  enemy.hp = Math.max(0, enemy.hp - incoming);
  const killed = enemy.hp <= 0;
  if (killed) preview.killedThisPlay = true;
  return { damage: incoming, blocked, killed };
}

function previewModifiedDamage(amount, card, preview, index) {
  const characterAmount = modifiedCharacterDamageAmount(card, preview, index, amount);
  const gemAmount = modifiedDamageAmount(card, preview, index, characterAmount);
  return preview.status.playerWeak > 0 ? Math.max(1, Math.ceil(gemAmount * 0.75)) : gemAmount;
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
      ${renderCombatStatusBoard(state, index, forecast)}
      ${renderBattleRules(state, index)}
    </section>
  `;
}

function renderCombatStatusBoard(state, index, forecast) {
  const disruptionCount = state.hand.filter((cardId) => ["curse", "temp"].includes(index.cards.get(cardId)?.type)).length;
  const predictedReflect = state.status.reflectRatio > 0 && forecast.totalDamage > 0 ? Math.ceil(forecast.totalDamage * state.status.reflectRatio) : 0;
  const cards = [
    {
      key: "hp",
      tone: state.player.hp / state.player.maxHp <= 0.35 ? "danger" : "health",
      icon: "체",
      label: "체력",
      value: `${state.player.hp}/${state.player.maxHp}`,
      detail: forecast.totalDamage > 0 ? `예상 후 ${Math.max(0, state.player.hp - forecast.totalDamage)}` : "피해 없음",
      fill: boundedPercent(state.player.hp, state.player.maxHp)
    },
    {
      key: "shield",
      tone: "guard",
      icon: "막",
      label: "보호막",
      value: state.player.shield,
      detail: forecast.blocked > 0 ? `${forecast.blocked} 차단 예정` : "차단 대기",
      fill: boundedPercent(state.player.shield, Math.max(state.player.maxHp, 1))
    },
    {
      key: "energy",
      tone: "energy",
      icon: "기",
      label: "기운",
      value: `${state.player.energy}/${state.player.maxEnergy}`,
      detail: state.status.nextTurnEnergyPenalty > 0 ? `다음 턴 -${state.status.nextTurnEnergyPenalty}` : "사용 가능",
      fill: boundedPercent(state.player.energy, state.player.maxEnergy)
    },
    {
      key: "chain",
      tone: "chain",
      icon: "연",
      label: "연쇄",
      value: state.status.chain || 0,
      detail: state.status.preserveNextChain ? "다음에도 유지" : "이번 턴 흐름",
      fill: boundedPercent(state.status.chain || 0, 8)
    },
    {
      key: "incoming",
      tone: forecast.totalDamage > 0 ? "danger" : "guard",
      icon: "예",
      label: "예상 피해",
      value: forecast.totalDamage,
      detail: forecast.piercingDamage > 0 ? `관통 ${forecast.piercingDamage}` : "보호막 반영",
      fill: boundedPercent(forecast.totalDamage, state.player.maxHp)
    }
  ];
  if (state.status.playerMarked > 0) cards.push({
    key: "mark",
    tone: "danger",
    icon: statusIcon("mark"),
    label: "표식",
    value: state.status.playerMarked,
    detail: `받는 피해 +${markDamagePercent(state.status.playerMarked)}%`,
    fill: boundedPercent(state.status.playerMarked, 4)
  });
  if (state.status.playerWeak > 0) cards.push({
    key: "weak",
    tone: "danger",
    icon: statusIcon("weak"),
    label: "약화",
    value: state.status.playerWeak,
    detail: "카드 피해 75%",
    fill: boundedPercent(state.status.playerWeak, 3)
  });
  if (state.status.damageReduction > 0) cards.push({
    key: "reduce",
    tone: "guard",
    icon: "감",
    label: "피해 감소",
    value: state.status.damageReduction,
    detail: "이번 적 차례",
    fill: boundedPercent(state.status.damageReduction, 12)
  });
  if (state.status.retainShield > 0) cards.push({
    key: "retain",
    tone: "guard",
    icon: "유",
    label: "보호막 유지",
    value: state.status.retainShield,
    detail: "턴 종료 후 보존",
    fill: boundedPercent(state.status.retainShield, 12)
  });
  if (state.status.reflectRatio > 0) cards.push({
    key: "reflect",
    tone: "guard",
    icon: "반",
    label: "반사",
    value: predictedReflect > 0 ? predictedReflect : `${Math.round(state.status.reflectRatio * 100)}%`,
    detail: "받은 피해 되돌림",
    fill: boundedPercent(state.status.reflectRatio * 100, 100)
  });
  if (disruptionCount > 0) cards.push({
    key: "disruption",
    tone: "danger",
    icon: "방",
    label: "방해",
    value: disruptionCount,
    detail: "정리 액션 가능",
    fill: boundedPercent(disruptionCount, 5)
  });
  return `
    <div class="combat-status-board" aria-label="전투 상태판">
      <span class="combat-status-title">상태판</span>
      ${cards.map(renderCombatStatusCard).join("")}
    </div>
  `;
}

function renderCombatStatusCard(card) {
  return `
    <article class="combat-status-card status-card-${card.key} status-tone-${card.tone}" style="--status-fill:${card.fill}%">
      <span class="status-card-icon">${card.icon}</span>
      <span class="status-card-copy">
        <em>${card.label}</em>
        <strong>${card.value}</strong>
        <small>${card.detail}</small>
      </span>
      <i class="status-card-meter"><b></b></i>
    </article>
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
  const hit = state.status.actionFeedback?.targetInstanceIds?.includes(enemy.instanceId);
  return `
    <article class="enemy-card enemy-rank-${enemy.rank} intent-${tone} ${hit ? "enemy-hit" : ""}">
      <div class="enemy-head">
        ${renderMonsterPortrait(enemy)}
        <div>
          <strong>${enemy.name}</strong>
          <span>${enemyRankLabel(enemy.rank)} · ${enemy.role || "기본형"} · ${enemy.family || "미로"}</span>
        </div>
      </div>
      ${renderEnemyPatternChips(enemy, state)}
      <div class="hp-line"><i style="width:${Math.max(0, Math.round((enemy.hp / enemy.maxHp) * 100))}%"></i></div>
      ${renderEnemyImpactBadges(enemy, state.status.actionFeedback)}
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

function renderEnemyPatternChips(enemy, state) {
  const items = enemyPatternItems(enemy, state);
  return `
    <div class="enemy-pattern-row" aria-label="${enemy.name} 역할과 패턴">
      ${items.map((item) => `
        <span class="enemy-pattern-chip pattern-${item.tone}">
          <b>${item.label}</b>
          <em>${item.value}</em>
        </span>
      `).join("")}
    </div>
  `;
}

function enemyPatternItems(enemy, state) {
  const intents = Array.isArray(enemy.intents) ? enemy.intents : [];
  const current = nextIntent(enemy, state.turn);
  const patternNames = [...new Set(intents.map(intentPatternName).filter(Boolean))].slice(0, 3);
  const maxAttack = intents
    .filter((intent) => intent.type === "attack" || intent.effect === "pierce_attack")
    .reduce((max, intent) => Math.max(max, intent.amount || 0), 0);
  const hasDisruption = intents.some((intent) => ["debuff"].includes(intent.type) || ["add_temp_card", "reduce_energy", "chain_down"].includes(intent.effect));
  const hasSummon = intents.some((intent) => intent.effect === "summon");
  return [
    { tone: enemyRoleTone(enemy), label: "역할", value: enemy.role || enemyRankLabel(enemy.rank) },
    { tone: intentTone(current), label: "이번", value: intentShortDetail(current) },
    { tone: enemyPatternTone(intents), label: "패턴", value: patternNames.join(" · ") || "기본" },
    {
      tone: hasSummon || hasDisruption || maxAttack >= 12 ? "danger" : maxAttack > 0 ? "attack" : "guard",
      label: "위협",
      value: hasSummon ? "호출" : hasDisruption ? "방해" : maxAttack > 0 ? `최대 ${maxAttack}` : "정비"
    }
  ];
}

function enemyRoleTone(enemy) {
  const role = enemy.role || "";
  if (enemy.rank === "boss" || role.includes("보스")) return "danger";
  if (enemy.rank === "elite" || role.includes("정예")) return "reward";
  if (/방해|관통|압박|연쇄/.test(role)) return "trick";
  if (/방어|회복|장벽/.test(role)) return "guard";
  return "attack";
}

function enemyPatternTone(intents) {
  if (intents.some((intent) => intent.effect === "summon")) return "summon";
  if (intents.some((intent) => intent.effect === "pierce_attack")) return "danger";
  if (intents.some((intent) => intent.type === "debuff" || ["add_temp_card", "reduce_energy", "chain_down"].includes(intent.effect))) return "trick";
  if (intents.some((intent) => intent.type === "guard" || ["fortify_all", "heal_self"].includes(intent.effect))) return "guard";
  return "attack";
}

function intentShortDetail(intent) {
  if (!intent) return "대기";
  if (intent.type === "attack") return `피해 ${intent.amount || 0}`;
  if (intent.type === "guard") return `방어 ${intent.amount || 0}`;
  if (intent.type === "debuff") return `${statusLabel(intent.status)} ${intent.amount || 1}`;
  if (intent.effect === "pierce_attack") return `관통 ${intent.amount || 0}`;
  if (intent.effect === "fortify_all") return `전체 방어 ${intent.amount || 0}`;
  if (intent.effect === "heal_self") return `회복 ${intent.amount || 0}`;
  if (intent.effect === "summon") return "친구 호출";
  if (intent.effect === "add_temp_card") return `방해 ${intent.amount || 1}`;
  if (intent.effect === "reduce_energy") return `기운 -${intent.amount || 1}`;
  if (intent.effect === "chain_down") {
    return intent.costIncrease ? `연쇄 -${intent.amount || 1} · 비용 +${intent.costIncrease}` : `연쇄 -${intent.amount || 1}`;
  }
  return intent.label || "특수";
}

function intentPatternName(intent) {
  if (!intent) return "대기";
  if (intent.type === "attack") return "공격";
  if (intent.type === "guard") return "방어";
  if (intent.type === "debuff") return "상태";
  if (intent.effect === "pierce_attack") return "관통";
  if (intent.effect === "fortify_all") return "장벽";
  if (intent.effect === "heal_self") return "회복";
  if (intent.effect === "summon") return "호출";
  if (intent.effect === "add_temp_card") return "방해";
  if (intent.effect === "reduce_energy") return "기운";
  if (intent.effect === "chain_down") return "연쇄";
  return "특수";
}

function renderEnemyImpactBadges(enemy, feedback) {
  const event = feedback?.targetEvents?.find((item) => item.targetInstanceId === enemy.instanceId);
  if (!event) return "";
  const badges = [];
  if (event.damage > 0) badges.push({ tone: "damage", label: "피해", value: `-${event.damage}` });
  if (event.blocked > 0) badges.push({ tone: "guard", label: "차단", value: `${event.blocked}` });
  if (event.defeated) badges.push({ tone: "damage", label: "처치", value: "완료" });
  if (badges.length === 0) return "";
  return `
    <div class="enemy-impact-badges" aria-label="${enemy.name} 직전 피해">
      ${badges.map((badge) => `
        <span class="enemy-impact-chip impact-${badge.tone}">
          <b>${badge.label}</b>
          <em>${badge.value}</em>
        </span>
      `).join("")}
    </div>
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
  const triggeredCount = enemy.phaseRulesTriggered?.length || 0;
  const hpPercent = boundedPercent(enemy.hp, enemy.maxHp);
  return `
    <div class="boss-phase-panel" aria-label="${enemy.name} 보스 변화">
      <div class="boss-phase-head">
        <span>페이즈 ${triggeredCount}/${enemy.phaseRules.length}</span>
        <strong>체력 ${hpPercent}%</strong>
      </div>
      <i class="boss-phase-meter"><b style="width:${hpPercent}%"></b></i>
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
    <span class="enemy-status-chip status-${key}" title="${statusDetail(key, value)}">
      <b>${statusIcon(key)}</b>
      <span>
        <em>${statusLabel(key)} ${value}</em>
        <small>${statusShortDetail(key, value)}</small>
      </span>
    </span>
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
    if (intent.effect === "chain_down") {
      effects.push(intent.costIncrease ? `연쇄 -${intent.amount || 1}, 다음 비용 +${intent.costIncrease}` : `연쇄 -${intent.amount || 1}`);
    }
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
  if (state.status.nextCardCostIncrease > 0) chips.push({ label: `다음 비용 +${state.status.nextCardCostIncrease}`, tone: "danger" });
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

function statusIcon(status) {
  return ({ mark: "표", weak: "약" })[status] || "상";
}

function statusShortDetail(status, value) {
  if (status === "mark") return `피해 +${markDamagePercent(value)}%`;
  if (status === "weak") return "주는 피해 감소";
  return statusDetail(status, value);
}

function statusDetail(status, value) {
  if (status === "mark") return `다음 피해를 ${markDamagePercent(value)}% 더 받고 표식 1을 소모합니다.`;
  if (status === "weak") return "주는 피해가 줄어듭니다.";
  return `${statusLabel(status)} ${value}`;
}

function markDamagePercent(value) {
  return Math.round(Math.min(0.6, Math.max(0, value || 0) * 0.15) * 100);
}

function boundedPercent(value, total) {
  return Math.max(0, Math.min(100, Math.round(((value || 0) / Math.max(1, total || 1)) * 100)));
}

function renderRunResult(state) {
  const summary = state.resultSummary || {};
  const won = summary.won ?? (state.phase === "stage_clear");
  const title = won ? "스테이지 클리어" : "탐험 실패";
  const subtitle = [summary.stageName, summary.characterName].filter(Boolean).join(" · ") || "탐험 기록";
  const unlocks = [...(summary.unlocks || []), ...(summary.achievements || []), ...(summary.metaUpgrades || [])];
  const stats = [
    { key: "rooms", icon: "방", label: "클리어 방", value: summary.roomsCleared ?? state.metrics?.roomsCleared ?? 0, detail: "탐험 진행" },
    { key: "defeat", icon: "전", label: "처치", value: summary.enemiesDefeated ?? state.metrics?.enemiesDefeated ?? 0, detail: "전투 성과" },
    { key: "chain", icon: "연", label: "최대 연쇄", value: summary.maxChain ?? state.metrics?.maxChain ?? 0, detail: "카드 흐름" },
    { key: "intent", icon: "의", label: "적 의도", value: summary.enemyIntentsResolved ?? state.metrics?.enemyIntentsResolved ?? 0, detail: "대응 성공" },
    { key: "boss", icon: "보", label: "보스 변화", value: summary.bossPhaseTriggers ?? state.metrics?.bossPhaseTriggers ?? 0, detail: "페이즈 대응" },
    { key: "gold", icon: "별", label: "별사탕", value: summary.gold ?? state.player?.gold ?? 0, detail: "획득 재화" },
    { key: "deck", icon: "덱", label: "덱", value: summary.deckSize ?? state.deck?.length ?? 0, detail: "최종 카드" },
    { key: "gem", icon: "젬", label: "보석", value: summary.gemCount ?? state.inventory?.gemBag?.length ?? 0, detail: "보관함" }
  ];
  return `
    <section class="result-panel result-panel-${won ? "victory" : "defeat"}">
      <div class="result-head">
        <div class="result-title-wrap">
          <span class="result-emblem" aria-hidden="true">${won ? "★" : "!"}</span>
          <div class="result-title">
            <strong>${title}</strong>
            <span>${escapeHtml(subtitle)}</span>
          </div>
        </div>
        <button class="primary-btn" data-action="restart">다시 탐험</button>
      </div>
      <div class="result-grid">
        ${stats.map(renderResultStat).join("")}
      </div>
      <div class="unlock-list result-unlock-list">
        <div class="unlock-list-head">
          <strong>새로 열린 것</strong>
          <span>${unlocks.length}개</span>
        </div>
        <div class="build-chip-list result-unlock-chip-list">
          ${unlocks.length === 0 ? "<span class='muted'>이번 탐험의 신규 해금 없음</span>" : unlocks.map(renderResultUnlockChip).join("")}
        </div>
      </div>
    </section>
  `;
}

function renderResultStat(stat) {
  const value = Number(stat.value) || 0;
  const ratio = resultStatRatio(stat.key, value);
  return `
    <div class="result-stat result-stat-${stat.key}" style="--result-progress:${ratio}">
      <span class="result-stat-icon">${stat.icon}</span>
      <span class="result-stat-copy">
        <em>${stat.label}</em>
        <strong>${escapeHtml(stat.value)}</strong>
        <small>${stat.detail}</small>
      </span>
      <i class="result-stat-meter"><b></b></i>
    </div>
  `;
}

function resultStatRatio(key, value) {
  const caps = { rooms: 15, defeat: 24, chain: 9, intent: 18, boss: 3, gold: 150, deck: 28, gem: 12 };
  return `${Math.max(8, Math.min(100, Math.round((value / (caps[key] || 10)) * 100)))}%`;
}

function renderResultUnlockChip(item) {
  const kind = resultUnlockKind(item);
  return `
    <span class="build-chip unlock-chip result-unlock-chip unlock-kind-${kind}">
      <span class="unlock-icon result-unlock-icon">${unlockIconText(kind)}</span>
      <span>
        <b>${escapeHtml(item.name || "새 해금")}</b>
        <em>${escapeHtml(item.label || resultUnlockLabel(kind))}</em>
      </span>
    </span>
  `;
}

function resultUnlockKind(item = {}) {
  const label = item.label || "";
  if (label.includes("스테이지")) return "stage";
  if (label.includes("캐릭터")) return "character";
  if (label.includes("카드")) return "card";
  if (label.includes("보석")) return "gem";
  if (label.includes("유물")) return "relic";
  if (label.includes("기운")) return "arcana";
  if (label.includes("업적")) return "achievement";
  if (label.includes("마을")) return "town";
  return "unlock";
}

function resultUnlockLabel(kind) {
  return ({ stage: "스테이지", character: "캐릭터", card: "카드", gem: "보석", relic: "유물", arcana: "기운", achievement: "업적", town: "마을" })[kind] || "해금";
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
      ${renderDeckOverview(state, index)}
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

function renderDeckOverview(state, index) {
  const cards = (state.deck || []).map((id) => index.cards.get(id)).filter(Boolean);
  const total = cards.length;
  const upgradedCount = cards.filter((card) => state.upgradedCards.includes(card.id)).length;
  const equippedCardCount = new Set((state.inventory.gemBag || []).filter((gem) => gem.equippedCardId).map((gem) => gem.equippedCardId)).size;
  const averageCost = total
    ? (cards.reduce((sum, card) => sum + cardCost(card, state, index), 0) / total).toFixed(1)
    : "0.0";
  const pileStats = [
    { key: "draw", label: "드로우", value: state.drawPile?.length || 0 },
    { key: "discard", label: "버림", value: state.discardPile?.length || 0 },
    { key: "hand", label: "손패", value: state.hand?.length || 0 },
    { key: "exhaust", label: "소멸", value: state.exhaustPile?.length || 0 }
  ];
  const typeEntries = ["attack", "guard", "skill", "power", "curse", "temp"]
    .map((type) => ({ type, count: cards.filter((card) => card.type === type).length }))
    .filter((entry) => entry.count > 0);
  const costEntries = [0, 1, 2, 3].map((cost) => ({
    cost,
    label: cost === 3 ? "3+" : `${cost}`,
    count: cards.filter((card) => Math.min(3, cardCost(card, state, index)) === cost).length
  }));
  return `
    <div class="deck-overview">
      <div class="deck-overview-head">
        <div>
          <span class="choice-kicker">덱 현황</span>
          <strong>카드 ${total}장</strong>
          <p>강화 ${upgradedCount}장 · 보석 장착 ${equippedCardCount}장 · 평균 비용 ${averageCost}</p>
        </div>
        <div class="deck-pile-grid">
          ${pileStats.map((pile) => `
            <span class="deck-pile-chip pile-${pile.key}">
              <b>${pile.label}</b>
              <em>${pile.value}</em>
            </span>
          `).join("")}
        </div>
      </div>
      <div class="deck-type-row" aria-label="덱 카드 타입 분포">
        ${typeEntries.map((entry) => `
          <span class="deck-type-chip deck-type-${entry.type}">
            <b>${typeLabels[entry.type] || entry.type}</b>
            <em>${entry.count}장</em>
          </span>
        `).join("")}
      </div>
      <div class="deck-cost-row" aria-label="덱 비용 곡선">
        ${costEntries.map((entry) => `
          <span class="deck-cost-chip cost-${entry.cost}">
            <b>${entry.label} 비용</b>
            <i class="deck-cost-track"><em style="width:${boundedPercent(entry.count, total)}%"></em></i>
            <strong>${entry.count}장</strong>
          </span>
        `).join("")}
      </div>
    </div>
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
  const growthItems = socketGrowthItems(card, currentCost, upgraded, capacity, equippedGems.length, validGems.length);
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
      <div class="socket-growth-row" aria-label="${card.name} 성장 상태">
        ${growthItems.map((item) => `
          <span class="socket-growth-chip growth-${item.tone}">
            <b>${item.label}</b>
            <em>${item.value}</em>
          </span>
        `).join("")}
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
          return `<span class="effect-chip">${gem.name} · ${gemRoleSummary(gem).label} · ${gemEffectSummary(gem)}</span>`;
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
              ${renderGemRoleChip(gem)}
              <small>${gemEffectSummary(gem)}</small>
              ${renderGemFitHints(gem)}
              ${renderGemComparisonList(gem, card, state, index, currentCost)}
            </button>
          `;
        }).join("")}
        ${validGems.length === 0 ? "<span class='muted'>장착 가능한 미사용 보석 없음</span>" : ""}
      </div>
    </article>
  `;
}

function socketGrowthItems(card, currentCost, upgraded, capacity, equippedCount, validGemCount) {
  return [
    { tone: upgraded ? "power" : "note", label: "강화", value: upgraded ? "완료" : "기본" },
    { tone: currentCost < card.cost ? "flow" : "note", label: "비용", value: `${card.cost}→${currentCost}` },
    { tone: equippedCount >= capacity ? "full" : "socket", label: "소켓", value: `${equippedCount}/${capacity}` },
    { tone: validGemCount > 0 ? "gem" : "note", label: "후보", value: `${validGemCount}개` }
  ];
}

function renderGemComparisonList(gem, card, state, index, currentCost) {
  const items = gemComparisonItems(gem, card, state, index, currentCost);
  if (items.length === 0) return "";
  return `
    <span class="gem-comparison-list">
      ${items.slice(0, 3).map((item) => `
        <span class="gem-comparison-chip compare-${item.tone}">
          <b>${item.label}</b>
          <em>${item.value}</em>
        </span>
      `).join("")}
    </span>
  `;
}

function gemComparisonItems(gem, card, state, index, currentCost) {
  const effect = gem.effects?.[0];
  const socketTypes = (gem.socketTypes || []).map((type) => gemTypeLabels[type] || type).join("/");
  const items = socketTypes ? [{ tone: "socket", label: "소켓", value: socketTypes }] : [];
  if (!effect) return items;
  if (effect.op === "modify_damage_percent") items.push({ tone: "damage", label: "피해", value: `+${effect.amount}%` });
  if (effect.op === "modify_shield_percent") items.push({ tone: "guard", label: "보호막", value: `+${effect.amount}%` });
  if (effect.op === "modify_cost") items.push({ tone: "flow", label: "비용", value: `${currentCost}→${Math.max(0, currentCost + effect.amount)}` });
  if (effect.op === "heal_on_play") items.push({ tone: "heal", label: "회복", value: `${effect.amount}` });
  if (effect.op === "apply_mark_on_play") items.push({ tone: "status", label: "표식", value: `${effect.amount}` });
  if (effect.op === "echo_basic_effect") items.push({ tone: "flow", label: "메아리", value: `${Math.round(effect.ratio * 100)}%` });
  if (effect.op === "splash_damage") items.push({ tone: "damage", label: "주변", value: `${Math.round(effect.ratio * 100)}%` });
  if (effect.op === "preserve_chain") items.push({ tone: "flow", label: "연쇄", value: "유지" });
  if (effect.op === "bridge_next_color_bonus") items.push({ tone: "flow", label: "다음 색", value: "보너스" });
  return items;
}

function renderGemCard(index, instance) {
  const gem = index.gems.get(instance.gemId);
  return `
    <article class="gem-card" title="${gem.text}">
      <span class="gem-icon ${gemVisualClass(gem)}"></span>
      <div>
        <strong>${gem.name}</strong>
        ${renderGemRoleChip(gem)}
        <small>${gem.socketTypes.map((type) => gemTypeLabels[type] || type).join(" · ")}</small>
        ${renderGemFitHints(gem)}
        <em>${gemEffectSummary(gem)}</em>
      </div>
    </article>
  `;
}

function renderGemRoleChip(gem) {
  const role = gemRoleSummary(gem);
  return `
    <span class="gem-role-chip gem-role-${role.tone}" title="${role.label}">
      <b>${role.icon}</b>
      <em>${role.label}</em>
    </span>
  `;
}

function renderGemFitHints(gem) {
  const hints = gemFitHints(gem).slice(0, 3);
  return `
    <span class="gem-fit-list" aria-label="${gem.name} 추천 장착">
      ${hints.map((hint) => `<span>${hint}</span>`).join("")}
    </span>
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
  const scene = eventSceneKey(event);
  const eventRole = eventRoleSummary(event);
  const riskSpread = eventRiskSpread(event);
  return `
    <section class="choice-box market-box event-box market-tone-${eventTone} event-scene-tone-${scene}">
      <div class="choice-head event-head">
        <div class="event-copy">
          <span class="choice-kicker">${eventTypeLabel(eventTone)}</span>
          <strong>${event.name}</strong>
          <span class="event-summary-row">
            ${renderEventRoleChip(eventRole)}
            ${renderEventRiskChip(riskSpread.highest, riskSpread.maxLevel)}
            <span class="event-choice-count-chip"><b>선</b><em>선택지 ${event.choices?.length || 0}</em></span>
          </span>
          <p>${event.text}</p>
        </div>
        <div class="event-visual-card" aria-hidden="true">
          ${renderEventSceneGraphic(event, "panel")}
        </div>
        <div class="choice-wallet event-wallet">
          <span>별사탕 ${state.player.gold}</span>
          <span>체력 ${state.player.hp}/${state.player.maxHp}</span>
        </div>
      </div>
      <div class="choice-list market-list">
        ${event.choices.map((choice, choiceIndex) => {
          const cost = adjustedRewardCost(state, index, choice.cost || {}, { source: event.type, reward: choice.reward || {} });
          const affordable = canPayCost(state, cost);
          const rewardKind = choiceRewardKind(choice.reward || {});
          const choiceRole = eventChoiceRoleSummary(choice);
          const choiceRisk = eventChoiceRiskSummary(choice, cost);
          return `
          <button class="choice-btn market-choice event-choice event-choice-${rewardKind} event-risk-${choiceRisk.key} ${affordable ? "" : "locked-choice"}" data-action="event-choice" data-choice-index="${choiceIndex}" ${affordable ? "" : "disabled"}>
            <span class="event-choice-topline">
              <span class="choice-reward-icon">${choiceRewardIcon(rewardKind)}</span>
              <span class="choice-cost ${affordable ? "can-pay" : "cannot-pay"}">${costLabel(cost)}</span>
            </span>
            <strong>${choice.label}</strong>
            <span class="event-choice-traits">
              ${renderEventRoleChip(choiceRole)}
              ${renderEventRiskChip(choiceRisk)}
            </span>
            <span class="choice-note">${affordable ? rewardLabel(choice.reward) : shortageLabel(state, cost)}</span>
            ${renderChoiceImpactList(eventChoiceImpactItems(choice, cost, state, index, affordable))}
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

function renderEventSceneGraphic(event = {}, variant = "panel") {
  const scene = eventSceneKey(event);
  const role = eventRoleSummary(event);
  return `
    <span class="event-scene event-scene-${scene} event-scene-${variant}">
      <span class="event-scene-icon">${eventSceneIcon(scene)}</span>
      <span class="event-shape main"></span>
      <span class="event-shape aux"></span>
      <span class="event-shape sparkle-one"></span>
      <span class="event-shape sparkle-two"></span>
      <span class="event-scene-role-mark event-scene-role-${role.tone}">${role.icon}</span>
    </span>
  `;
}

function renderEventRoleChip(role) {
  return `
    <span class="event-role-chip event-role-${role.tone}" title="${role.label}">
      <b>${role.icon}</b>
      <em>${role.label}</em>
    </span>
  `;
}

function renderEventRiskChip(risk, levelOverride = risk.level) {
  return `
    <span class="event-risk-chip event-risk-chip-${risk.key}" title="${risk.label}">
      <b>${risk.icon}</b>
      <em>${risk.label}</em>
      ${renderEventRiskMeter(levelOverride)}
    </span>
  `;
}

function renderEventRiskMeter(level = 0) {
  return `
    <span class="event-risk-meter" aria-hidden="true">
      ${[1, 2, 3].map((step) => `<i class="${level >= step ? "active" : ""}"></i>`).join("")}
    </span>
  `;
}

function renderEventChoicePreview(choice) {
  const role = eventChoiceRoleSummary(choice);
  const risk = eventChoiceRiskSummary(choice);
  return `
    <span class="event-choice-preview event-choice-preview-${risk.key}">
      <b>${role.icon}</b>
      <em>${role.label}</em>
      <small>${risk.label}</small>
    </span>
  `;
}

function eventSceneKey(event = {}) {
  const text = `${event.id || ""} ${event.name || ""} ${event.text || ""}`;
  if (/bubble|방울/.test(text)) return "bubble";
  if (/ribbon|리본|분수/.test(text)) return "ribbon";
  if (/gate|문/.test(text)) return "gate";
  if (/gem|보석|작업대/.test(text)) return "gem";
  if (/mail|우체통|초대장/.test(text)) return "mail";
  if (/picnic|소풍/.test(text)) return "picnic";
  if (/lottery|복권|별/.test(text)) return "star";
  if (/class|교실/.test(text)) return "class";
  if (/lost|아이/.test(text)) return "friend";
  if (/rainbow|무지개/.test(text)) return "rainbow";
  return "choice";
}

function eventSceneIcon(scene) {
  return ({ bubble: "방", ribbon: "리", gate: "문", gem: "젬", mail: "우", picnic: "소", star: "별", class: "교", friend: "친", rainbow: "빛", choice: "이" })[scene] || "이";
}

function choiceRewardKind(reward = {}) {
  if (reward.combat) return "combat";
  if (reward.cardPool?.length) return "card";
  if (reward.gemPool?.length) return "gem";
  if (reward.relicPool?.length) return "relic";
  if (reward.arcanaPool?.length) return "arcana";
  if (reward.upgradeRandomCard) return "upgrade";
  if (reward.heal) return "heal";
  if (reward.gold) return "gold";
  if (reward.openGemSocket) return "socket";
  return "choice";
}

function choiceRewardIcon(kind) {
  return ({ card: "카", gem: "보", relic: "유", arcana: "기", upgrade: "↑", heal: "＋", gold: "★", combat: "전", socket: "◇", choice: "?" })[kind] || "?";
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
          const insight = rewardOptionInsight(option, state, index);
          return `
          <button class="choice-btn market-choice reward-${option.type} reward-fit-${insight.tone} ${affordable ? "" : "locked-choice"}" data-action="reward-choice" data-reward-id="${option.id}" ${affordable ? "" : "disabled"}>
            <span class="choice-cost ${affordable ? "can-pay" : "cannot-pay"}">${option.cost ? costLabel(option.cost) : "비용 없음"}</span>
            <strong>${option.title}</strong>
            <span class="choice-note">${affordable ? option.description : shortageLabel(state, option.cost)}</span>
            ${renderRewardInsight(insight)}
            ${renderChoiceImpactList(rewardOptionImpactItems(option, state, index, affordable))}
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

function renderRewardInsight(insight) {
  return `
    <span class="reward-fit-panel fit-${insight.tone}" aria-label="보상 추천도 ${insight.label}">
      <span class="reward-fit-score">
        <b>${insight.score}</b>
        <em>${insight.label}</em>
      </span>
      <span class="reward-fit-chip-list">
        ${insight.items.map((item) => `
          <span class="reward-fit-chip fit-chip-${item.tone || "note"}">
            <b>${item.icon || "·"}</b>
            <span>
              <em>${item.label}</em>
              <strong>${item.value}</strong>
            </span>
          </span>
        `).join("")}
      </span>
    </span>
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

function rankLabel(rank) {
  return ({ minion: "일반", normal: "일반", elite: "정예", boss: "보스" })[rank] || "일반";
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

function renderChoiceImpactList(items = []) {
  const visibleItems = items.filter(Boolean).slice(0, 5);
  if (visibleItems.length === 0) return "";
  return `
    <span class="choice-impact-list">
      ${visibleItems.map((item) => `
        <span class="choice-impact-chip impact-${item.tone || "note"}">
          <b>${item.icon || "·"}</b>
          <span>
            <em>${item.label}</em>
            <strong>${item.value}</strong>
          </span>
        </span>
      `).join("")}
    </span>
  `;
}

function eventChoiceImpactItems(choice = {}, cost = {}, state, index, affordable = true) {
  return [
    ...eventChoiceSignalItems(choice, cost),
    ...costImpactItems(cost, state, affordable),
    ...rewardImpactItems(choice.reward || {}, index),
    affordable ? null : { tone: "danger", icon: "!", label: "부족", value: shortageLabel(state, cost) }
  ];
}

function rewardOptionImpactItems(option = {}, state, index, affordable = true) {
  const reward = rewardFromOption(option);
  return [
    ...costImpactItems(option.cost || {}, state, affordable),
    ...rewardImpactItems(reward, index),
    option.upgraded ? { tone: "power", icon: "강", label: "강화", value: "획득 즉시" } : null,
    affordable ? null : { tone: "danger", icon: "!", label: "부족", value: shortageLabel(state, option.cost || {}) }
  ];
}

function rewardFromOption(option = {}) {
  if (option.type === "card") return { cardPool: [option.cardId] };
  if (option.type === "gem") return { gemPool: [option.gemId] };
  if (option.type === "relic") return { relicPool: [option.relicId] };
  if (option.type === "arcana") return { arcanaPool: [option.arcanaId] };
  if (option.type === "gold") return { gold: option.amount || 0 };
  return {};
}

function costImpactItems(cost = {}, state, affordable = true) {
  const items = [];
  if (cost.gold) items.push({ tone: affordable ? "cost" : "danger", icon: "비", label: "비용", value: `별사탕 ${cost.gold}` });
  if (cost.hp) items.push({ tone: affordable ? "danger" : "danger", icon: "체", label: "소모", value: `체력 ${cost.hp}` });
  if (items.length === 0) items.push({ tone: "safe", icon: "무", label: "비용", value: "없음" });
  return items;
}

function rewardImpactItems(reward = {}, index) {
  const items = [];
  if (reward.cardPool?.length) items.push({ tone: "card", icon: "카", label: "덱 성장", value: `${reward.cardPool.length}장 후보` });
  if (reward.gemPool?.length) items.push({ tone: "gem", icon: "보", label: "보석", value: `${reward.gemPool.length}종 후보` });
  if (reward.relicPool?.length) items.push({ tone: "relic", icon: "유", label: "유물", value: `${reward.relicPool.length}종 후보` });
  if (reward.arcanaPool?.length) items.push({ tone: "arcana", icon: "기", label: "기운", value: `${reward.arcanaPool.length}종 후보` });
  if (reward.upgradeRandomCard) items.push({ tone: "power", icon: "강", label: "강화", value: `${reward.upgradeRandomCard}장` });
  if (reward.heal) items.push({ tone: "heal", icon: "회", label: "회복", value: `${reward.heal}` });
  if (reward.gold) items.push({ tone: "gold", icon: "별", label: "획득", value: `${reward.gold}` });
  if (reward.openGemSocket) items.push({ tone: "gem", icon: "홈", label: "소켓", value: "+1" });
  if (reward.combat) {
    const enemy = index.enemies.get(reward.combat);
    items.push({ tone: "danger", icon: "전", label: "추가 전투", value: enemy?.name || "준비" });
  }
  return items;
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
  const buildMeta = ["relic", "arcana"].includes(item.kind) && item.source
    ? `${renderBuildRoleChip(item.source, item.kind)}${renderBuildFitHints(item.source, item.kind, 2)}`
    : "";
  return `
    <span class="reward-preview-card reward-kind-${item.kind}" ${item.accent ? `style="--preview-accent:${item.accent}"` : ""}>
      ${icon}
      <span class="reward-preview-copy">
        <strong>${item.title}</strong>
        ${buildMeta}
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
      <span class="build-chip-copy">
        <b>${item.name}</b>
        ${renderBuildRoleChip(item, kind)}
        <em>${summary}</em>
        ${renderBuildFitHints(item, kind, 2)}
      </span>
    </span>
  `;
}

function renderBuildRoleChip(item, kind) {
  const role = buildItemRoleSummary(item, kind);
  return `
    <span class="build-role-chip build-role-${role.tone}" title="${role.label}">
      <b>${role.icon}</b>
      <em>${role.label}</em>
    </span>
  `;
}

function renderBuildFitHints(item, kind, limit = 3) {
  const hints = buildFitHints(item, kind).slice(0, limit);
  return `
    <span class="build-fit-list" aria-label="${item.name} 추천 빌드">
      ${hints.map((hint) => `<span>${hint}</span>`).join("")}
    </span>
  `;
}

function renderItemIcon(kind, item = {}) {
  const motif = kind === "relic" ? relicMotif(item) : arcanaMotif(item);
  const role = buildItemRoleSummary(item, kind);
  return `
    <span class="item-icon item-icon-${kind} ${kind}-motif-${motif} item-rarity-${item.rarity || "common"} item-role-${role.key}" aria-hidden="true">
      <span class="item-shape main"></span>
      <span class="item-shape mark-one"></span>
      <span class="item-shape mark-two"></span>
      <span class="item-role-mark">${role.icon}</span>
    </span>
  `;
}

function renderCardArt(card, variant = "sample") {
  const subject = card.illustration?.subject || card.name;
  const mood = card.illustration?.mood || "";
  const motif = cardArtMotif(card);
  const role = cardRoleSummary(card);
  return `
    <span class="card-art card-art-${variant} motif-${motif} card-art-type-${card.type} card-role-key-${role.key}" style="--card-accent:${accentFor(card.color)}" aria-label="${escapeHtml(subject)}">
      <span class="card-art-glow"></span>
      <span class="card-art-shape main"></span>
      <span class="card-art-shape aux"></span>
      <span class="card-art-shape trail-one"></span>
      <span class="card-art-shape trail-two"></span>
      <span class="card-art-role-mark">${role.icon}</span>
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
  if (effect.op === "increase_card_reward_options") return `카드 보상 선택지 +${effect.amount}`;
  if (effect.op === "first_expensive_card_free_each_battle") return `${effect.minCost || 2}비용 이상 첫 카드 무료`;
  if (effect.op === "heal_after_combat") return `전투 후 체력 ${effect.amount} 회복`;
  if (effect.op === "start_with_energy") return `전투 시작 기운 +${effect.amount}`;
  if (effect.op === "increase_gem_reward_options") return `보석 보상 선택지 +${effect.amount}`;
  if (effect.op === "reduce_shop_prices_percent") return `상점 가격 -${effect.amount}%`;
  if (effect.op === "reroll_reward_free") return `보상 다시 보기 ${effect.amount}회 무료`;
  if (effect.op === "upgrade_first_card_reward") return "첫 카드 보상 강화";
  if (effect.op === "retain_one_card") return `턴 종료 손패 ${effect.amount}장 보존`;
  if (effect.op === "add_card_after_elite") return `정예 카드 보상 +${effect.amount}`;
  if (effect.op === "gain_gold_on_perfect") return `완벽 전투 별사탕 +${effect.amount}`;
  if (effect.op === "preserve_chain_once") return `전투마다 연쇄 보존 ${effect.amount}회`;
  if (effect.op === "boss_reward_bonus") return `보스 보상 +${effect.amount}`;
  return relic.text;
}

function arcanaEffectSummary(arcana) {
  const effect = arcana.effects?.[0];
  if (!effect) return arcana.text;
  if (effect.op === "enable_cost_ladder_chain") return "비용 순서 연쇄";
  if (effect.op === "modify_gem_reward_chance_percent") return `보석 보상 +${effect.amount}%`;
  if (effect.op === "damage_random_on_guard_play") return `방어 시 피해 ${effect.amount}`;
  if (effect.op === "damage_all_when_cards_played") return `카드 ${effect.threshold}장 사용 시 전체 피해 ${effect.amount}`;
  if (effect.op === "damage_all_on_attack_kill") return `처치 시 전체 피해 ${effect.amount}`;
  if (effect.op === "heal_when_guard_played_count") return `방어 ${effect.threshold}장마다 체력 ${effect.amount} 회복`;
  if (effect.op === "gain_gold_on_zero_cost_play") return `0비용 카드마다 별사탕 +${effect.amount}`;
  if (effect.op === "draw_on_four_colors") return `서로 다른 색 4장 사용 시 드로우 ${effect.amount}`;
  if (effect.op === "carry_shield_percent") return `남은 보호막 ${effect.amount}% 유지`;
  if (effect.op === "reduce_gem_cost_percent") return `보석 비용 -${effect.amount}%`;
  if (effect.op === "mark_front_on_heal") return `회복 시 앞 적 표식 +${effect.amount}`;
  if (effect.op === "discount_hand_when_cards_played") return `카드 ${effect.threshold}장 사용 시 손패 비용 -${effect.amount}`;
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
