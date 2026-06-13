import type { BootContext } from "../../app/bootContext";
import type { EnemyData, RewardEntry, RoomSlot, StageData } from "../../data/schema";

const ACCESSIBILITY_ROOT_ID = "game-accessibility-summary";

const sceneTitles: Record<string, string> = {
  TownScene: "마을",
  WorldMapScene: "세계 지도",
  DungeonScene: "던전 경로",
  EventScene: "이벤트",
  CombatScene: "전투",
  RewardScene: "보상",
  RuneBenchScene: "보석 작업대",
  BossScene: "보스 전투",
  ResultScene: "결과",
  SettingsScene: "설정"
};

export function renderAccessibilityOverlay(context: BootContext, sceneName: string): void {
  const root = ensureAccessibilityRoot();
  const stage = currentStage(context);
  const room = currentRoom(stage, context);
  const title = sceneTitles[sceneName] ?? sceneName;
  const statusLines = buildStatusLines(context, sceneName, stage, room);
  const controlLines = buildControlLines(context, sceneName);
  const summaryText = [title, ...statusLines, ...controlLines].join(". ");

  root.dataset.scene = sceneName;
  root.dataset.title = title;
  root.setAttribute("aria-label", summaryText);
  root.replaceChildren(
    element("h2", title),
    ...statusLines.map((line) => element("p", line)),
    listElement(controlLines)
  );

  syncCanvasAccessibility(summaryText);
}

function ensureAccessibilityRoot(): HTMLElement {
  const existing = document.getElementById(ACCESSIBILITY_ROOT_ID);
  if (existing) return existing;

  const root = document.createElement("section");
  root.id = ACCESSIBILITY_ROOT_ID;
  root.className = "game-accessibility-summary";
  root.setAttribute("role", "status");
  root.setAttribute("aria-live", "polite");
  root.setAttribute("aria-atomic", "true");
  document.body.append(root);
  return root;
}

function element(tagName: "h2" | "p" | "li", text: string): HTMLElement {
  const node = document.createElement(tagName);
  node.textContent = text;
  return node;
}

function listElement(items: string[]): HTMLUListElement {
  const list = document.createElement("ul");
  items.forEach((item) => list.append(element("li", item)));
  return list;
}

function syncCanvasAccessibility(label: string): void {
  window.requestAnimationFrame(() => {
    const canvas = document.querySelector<HTMLCanvasElement>("#game-root canvas");
    if (!canvas) return;
    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", label);
  });
}

function buildStatusLines(
  context: BootContext,
  sceneName: string,
  stage: StageData | undefined,
  room: RoomSlot | undefined
): string[] {
  const run = context.run;
  const player = `체력 ${run.player.hp}/${run.player.maxHp}, 기운 ${run.player.energy}/${run.player.maxEnergy}, 별사탕 ${run.player.gold}`;
  const stageLine = `현재 스테이지 ${stage?.displayNameKo ?? run.stageId}`;
  const roomLine = room ? `현재 방 ${run.roomIndex + 1}/${stage?.route.length ?? "?"}, 유형 ${room.type}` : `현재 방 ${run.roomIndex + 1}`;

  if (sceneName === "WorldMapScene") {
    return [
      stageLine,
      `열린 스테이지 ${context.save.profile.unlockedStages.length}/${context.dataBundle.stages.length}, 완료 ${context.save.profile.completedStages.length}`
    ];
  }

  if (sceneName === "CombatScene" || sceneName === "BossScene") {
    const enemy = currentEnemy(context);
    const combat = run.combat;
    const enemyLine = combat
      ? `상대 ${enemy?.displayNameKo ?? combat.enemyId}, 체력 ${combat.enemyHp}/${combat.enemyMaxHp}, 방어 ${combat.enemyBlock}`
      : "상대 정보 없음";
    return [stageLine, player, enemyLine, `손패 ${run.hand.length}장, 턴 ${combat?.turn ?? 1}`];
  }

  if (sceneName === "RewardScene") {
    return [stageLine, rewardSummary(context)];
  }

  if (sceneName === "EventScene") {
    return [stageLine, roomLine, eventSummary(context, room)];
  }

  if (sceneName === "RuneBenchScene") {
    return [stageLine, `보유 보석 ${run.runes.length}, 덱 ${run.deck.length}장`];
  }

  if (sceneName === "ResultScene") {
    return [stageLine, `완료 스테이지 ${run.completedStages.length}, 덱 ${run.deck.length}장, 보석 ${run.runes.length}`];
  }

  if (sceneName === "SettingsScene") {
    const settings = context.save.settings;
    return [
      `마스터 음량 ${Math.round(settings.volumeMaster * 100)}%, 음악 ${Math.round(settings.volumeMusic * 100)}%, 효과음 ${Math.round(settings.volumeSfx * 100)}%`,
      `큰 글자 ${settings.largeText ? "켜짐" : "꺼짐"}, 감소 모션 ${settings.reducedMotion ? "켜짐" : "꺼짐"}`
    ];
  }

  return [stageLine, roomLine, player];
}

function buildControlLines(context: BootContext, sceneName: string): string[] {
  const spaceConfirm = context.save.settings.spaceConfirm ? "Space 또는 Enter" : "Enter";
  const common = `이동은 방향키, 선택은 ${spaceConfirm}`;

  if (sceneName === "CombatScene" || sceneName === "BossScene") {
    return [`${common}, 1-5 숫자키로 카드 사용`, "E 키로 턴 종료"];
  }

  if (sceneName === "RewardScene") {
    return [`${common}, 카드 숫자키로 보상 선택`];
  }

  if (sceneName === "EventScene") {
    return [`${common}, 가능한 선택지만 활성화`];
  }

  if (sceneName === "SettingsScene") {
    return [`${common}, Escape로 마을 복귀`];
  }

  if (sceneName === "WorldMapScene") {
    return [`${common}, 열린 스테이지 사이를 이동`];
  }

  return [common];
}

function rewardSummary(context: BootContext): string {
  const rewardPool = context.dataBundle.rewardPools.find((pool) => pool.id === context.run.rewardPoolId);
  const offers = rewardOffers(context);
  return `보상 묶음 ${rewardPool?.displayNameKo ?? context.run.rewardPoolId ?? "기본"}, 선택지 ${offers.length}개`;
}

function rewardOffers(context: BootContext): RewardEntry[] {
  const rewardIds = new Set(context.run.offeredRewards);
  if (rewardIds.size === 0) return [];
  return context.dataBundle.rewardPools
    .flatMap((pool) => pool.entries)
    .filter((entry) => rewardIds.has(entry.id));
}

function eventSummary(context: BootContext, room: RoomSlot | undefined): string {
  const pool = context.dataBundle.encounterPools.find((item) => item.id === room?.encounterPoolId);
  const eventId = pool?.entries[0]?.contentId;
  const event = context.dataBundle.events.find((item) => item.id === eventId);
  return event ? `이벤트 ${event.displayNameKo}, 선택지 ${event.choices.length}개` : "이벤트 선택지 확인";
}

function currentStage(context: BootContext): StageData | undefined {
  return context.dataBundle.stages.find((stage) => stage.id === context.run.stageId) ?? context.dataBundle.stages[0];
}

function currentRoom(stage: StageData | undefined, context: BootContext): RoomSlot | undefined {
  return stage?.route[context.run.roomIndex];
}

function currentEnemy(context: BootContext): EnemyData | undefined {
  const enemyId = context.run.combat?.enemyId;
  if (!enemyId) return undefined;
  return context.dataBundle.enemies.find((enemy) => enemy.id === enemyId)
    ?? context.dataBundle.bosses.find((boss) => boss.id === enemyId);
}
