import Phaser from "phaser";
import type { BootContext } from "../../app/bootContext";
import type { EventChoice, RewardEntry } from "../../data/schema";

const CHOICE_INFO_VERSION = "v2";

interface ChoiceInfoOptions {
  index: number;
  width: number;
  height: number;
  largeText: boolean;
  state: "ready" | "disabled";
}

interface ChoiceInfoModel {
  id: string;
  title: string;
  body: string;
  kind: string;
  cost?: string;
  result?: string;
}

export function renderRewardChoiceInfo(
  scene: Phaser.Scene,
  context: BootContext,
  entry: RewardEntry,
  x: number,
  y: number,
  width: number,
  height: number,
  options: { index: number; largeText: boolean }
): Phaser.GameObjects.Image {
  const model = rewardChoiceInfoModel(context, entry);
  const key = ensureChoiceInfoTexture(scene, model, {
    index: options.index,
    width,
    height,
    largeText: options.largeText,
    state: "ready"
  });
  return scene.add.image(x, y, key)
    .setDisplaySize(width, height)
    .setDepth(13)
    .setData("choiceInfoAffordance", true)
    .setData("choiceInfoKind", "reward");
}

export function renderEventChoiceInfo(
  scene: Phaser.Scene,
  context: BootContext,
  choice: EventChoice,
  x: number,
  y: number,
  width: number,
  height: number,
  options: { index: number; affordable: boolean; largeText: boolean }
): Phaser.GameObjects.Image {
  const model = eventChoiceInfoModel(context, choice);
  const key = ensureChoiceInfoTexture(scene, model, {
    index: options.index,
    width,
    height,
    largeText: options.largeText,
    state: options.affordable ? "ready" : "disabled"
  });
  return scene.add.image(x, y, key)
    .setDisplaySize(width, height)
    .setDepth(13)
    .setData("choiceInfoAffordance", true)
    .setData("choiceInfoKind", "event");
}

function rewardChoiceInfoModel(context: BootContext, entry: RewardEntry): ChoiceInfoModel {
  const content = rewardContent(context, entry);
  const title = content?.displayNameKo ?? rewardFallbackTitle(entry);
  const body = content?.descriptionKo ?? rewardFallbackBody(entry);
  return {
    id: entry.id,
    title,
    body,
    kind: rewardTypeLabel(entry.type),
    result: rewardResultLabel(entry, title)
  };
}

function eventChoiceInfoModel(context: BootContext, choice: EventChoice): ChoiceInfoModel {
  return {
    id: choice.id,
    title: choice.displayNameKo,
    body: choice.descriptionKo,
    kind: "이벤트 선택",
    cost: eventCostLabel(choice),
    result: eventRewardLabel(context, choice.rewards ?? [])
  };
}

function ensureChoiceInfoTexture(scene: Phaser.Scene, model: ChoiceInfoModel, options: ChoiceInfoOptions): string {
  const key = [
    "choice_info_affordance",
    CHOICE_INFO_VERSION,
    safeTextureKeyPart(model.id),
    options.width,
    options.height,
    options.index,
    options.state,
    options.largeText ? "lg" : "std"
  ].join("_");

  if (scene.textures.exists(key)) {
    return key;
  }

  const scale = 2;
  const texture = scene.textures.createCanvas(key, options.width * scale, options.height * scale);
  if (!texture) {
    return key;
  }

  const context = texture.getContext();
  context.save();
  context.scale(scale, scale);
  drawChoiceInfoTexture(context, model, options);
  context.restore();
  texture.refresh();
  return key;
}

function drawChoiceInfoTexture(
  context: CanvasRenderingContext2D,
  model: ChoiceInfoModel,
  options: ChoiceInfoOptions
): void {
  const { width, height, state, largeText } = options;
  const disabled = state === "disabled";
  const accent = disabled ? "#7d6f69" : "#2f6b68";
  const danger = disabled ? "#9a5048" : "#a5483f";
  const textColor = disabled ? "#6f635d" : "#2f211a";
  const titleSize = largeText ? 20 : 18;
  const bodySize = largeText ? 14 : 13;
  const smallSize = largeText ? 13 : 12;
  const compact = height <= 440;

  context.clearRect(0, 0, width, height);
  context.lineJoin = "round";

  const titlePanelY = compact ? Math.round(height * 0.45) : Math.round(height * 0.47);
  const titlePanelHeight = compact ? 44 : Math.max(50, Math.round(height * 0.12));
  drawPanel(context, 14, titlePanelY, width - 28, titlePanelHeight, 14, disabled, accent);

  context.fillStyle = accent;
  drawRoundedRect(context, 22, titlePanelY + 8, compact ? 44 : 48, titlePanelHeight - 16, 12);
  context.fill();
  context.fillStyle = "#fff5d7";
  drawFittedText(context, String(options.index + 1), compact ? 44 : 46, titlePanelY + titlePanelHeight / 2, 28, titleSize + 4, 14, true, "center");

  context.fillStyle = textColor;
  drawFittedText(context, model.title, 78, titlePanelY + titlePanelHeight / 2 - 8, width - 104, titleSize, 12, true, "left");
  context.fillStyle = disabled ? "#8f8179" : "#805845";
  drawFittedText(context, model.kind, 78, titlePanelY + titlePanelHeight / 2 + (compact ? 12 : 14), width - 104, smallSize, 10, true, "left");

  const bodyPanelY = titlePanelY + titlePanelHeight + (compact ? 8 : 10);
  const bodyPanelHeight = compact ? 62 : Math.max(84, Math.round(height * 0.19));
  drawPanel(context, 18, bodyPanelY, width - 36, bodyPanelHeight, 13, disabled, "#c6a65e");
  context.fillStyle = textColor;
  context.font = `${largeText ? "700" : "600"} ${bodySize}px Arial, sans-serif`;
  drawWrappedText(
    context,
    compactText(model.body),
    30,
    bodyPanelY + (compact ? 9 : 12),
    width - 60,
    compact ? (largeText ? 15 : 14) : (largeText ? 17 : 15),
    compact ? 3 : 4
  );

  const footerY = bodyPanelY + bodyPanelHeight + (compact ? 8 : 10);
  const footerHeight = compact ? Math.min(60, height - footerY - 48) : Math.min(70, height - footerY - 18);
  if (footerHeight >= 42) {
    drawPanel(context, 22, footerY, width - 44, footerHeight, 13, disabled, accent);
    if (model.cost) {
      drawInfoRow(context, "비용", model.cost, 34, footerY + (compact ? 9 : 12), width - 68, smallSize, disabled ? danger : "#805845");
      drawInfoRow(context, "결과", model.result ?? "효과", 34, footerY + (compact ? 31 : 34), width - 68, smallSize, accent);
    } else {
      drawInfoRow(context, "획득", model.result ?? model.kind, 34, footerY + 18, width - 68, smallSize + 1, accent);
    }
  }

  context.fillStyle = disabled ? "rgba(125, 85, 80, 0.95)" : "rgba(47, 107, 104, 0.96)";
  context.strokeStyle = disabled ? "rgba(255, 241, 208, 0.42)" : "rgba(255, 243, 176, 0.82)";
  context.lineWidth = 2;
  const statusWidth = Math.min(116, width - 78);
  drawRoundedRect(context, (width - statusWidth) / 2, height - 34, statusWidth, 24, 12);
  context.fill();
  context.stroke();
  context.fillStyle = "#fff5d7";
  drawFittedText(context, disabled ? "조건 부족" : "선택 가능", width / 2, height - 22, statusWidth - 16, smallSize + 1, 10, true, "center");
}

function drawInfoRow(
  context: CanvasRenderingContext2D,
  label: string,
  value: string,
  x: number,
  y: number,
  width: number,
  size: number,
  color: string
): void {
  context.fillStyle = color;
  context.font = `700 ${size}px Arial, sans-serif`;
  context.textAlign = "left";
  context.textBaseline = "top";
  context.fillText(label, x, y);
  context.fillStyle = "#2f211a";
  context.font = `600 ${size}px Arial, sans-serif`;
  context.fillText(trimToWidth(context, value, width - 52, "..."), x + 52, y);
}

function drawPanel(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  disabled: boolean,
  accent: string
): void {
  context.shadowColor = "rgba(20, 17, 22, 0.22)";
  context.shadowBlur = 6;
  context.fillStyle = disabled ? "rgba(236, 224, 204, 0.72)" : "rgba(255, 248, 232, 0.82)";
  context.strokeStyle = disabled ? "rgba(143, 129, 121, 0.62)" : "rgba(198, 166, 94, 0.68)";
  context.lineWidth = 2;
  drawRoundedRect(context, x, y, width, height, radius);
  context.fill();
  context.stroke();
  context.shadowBlur = 0;
  context.fillStyle = disabled ? "rgba(143, 129, 121, 0.18)" : `${accent}24`;
  drawRoundedRect(context, x + 7, y + 7, width - 14, Math.max(8, Math.min(16, height - 14)), 7);
  context.fill();
}

function rewardContent(context: BootContext, entry: RewardEntry): { displayNameKo: string; descriptionKo: string } | undefined {
  if (!entry.contentId) return undefined;
  if (entry.type === "card") return context.dataBundle.cards.find((item) => item.id === entry.contentId);
  if (entry.type === "rune") return context.dataBundle.runes.find((item) => item.id === entry.contentId);
  if (entry.type === "relic") return context.dataBundle.relics.find((item) => item.id === entry.contentId);
  if (entry.type === "arcana") return context.dataBundle.arcanas.find((item) => item.id === entry.contentId);
  return undefined;
}

function rewardFallbackTitle(entry: RewardEntry): string {
  if (entry.type === "currency") return `골드 ${entry.amount ?? 0}`;
  if (entry.type === "heal") return `체력 회복 ${entry.amount ?? 0}`;
  return entry.contentId ?? entry.id;
}

function rewardFallbackBody(entry: RewardEntry): string {
  if (entry.type === "currency") return "다음 상점과 이벤트 선택에 사용할 수 있는 골드를 얻습니다.";
  if (entry.type === "heal") return "현재 모험에서 잃은 체력을 회복합니다.";
  return "이번 보상을 선택합니다.";
}

function rewardResultLabel(entry: RewardEntry, title: string): string {
  if (entry.type === "currency") return `골드 +${entry.amount ?? 0}`;
  if (entry.type === "heal") return `회복 +${entry.amount ?? 0}`;
  return `${rewardTypeLabel(entry.type)} ${title}`.trim();
}

function eventCostLabel(choice: EventChoice): string {
  const costs = (choice.cost ?? []).map((effect) => {
    const amount = effect.value.amount ?? 0;
    if (effect.op === "spend_currency") return `골드 -${amount}`;
    if (effect.op === "spend_hp") return `체력 -${amount}`;
    return effect.op;
  });
  return costs.length > 0 ? costs.join(", ") : "무료";
}

function eventRewardLabel(context: BootContext, rewards: RewardEntry[]): string {
  if (rewards.length === 0) return "효과 적용";
  if (rewards.length > 2) return compactRewardLabel(rewards);
  return rewards.map((reward) => {
    const content = rewardContent(context, reward);
    if (reward.type === "currency") return `골드 +${reward.amount ?? 0}`;
    if (reward.type === "heal") return `회복 +${reward.amount ?? 0}`;
    return `${rewardTypeLabel(reward.type)} ${content?.displayNameKo ?? reward.contentId ?? ""}`.trim();
  }).join(", ");
}

function compactRewardLabel(rewards: RewardEntry[]): string {
  const counts = new Map<RewardEntry["type"], number>();
  let currency = 0;
  let heal = 0;
  rewards.forEach((reward) => {
    if (reward.type === "currency") {
      currency += reward.amount ?? 0;
    } else if (reward.type === "heal") {
      heal += reward.amount ?? 0;
    } else {
      counts.set(reward.type, (counts.get(reward.type) ?? 0) + 1);
    }
  });

  const parts: string[] = [];
  (["card", "rune", "relic", "arcana", "unlock"] as const).forEach((type) => {
    const count = counts.get(type);
    if (!count) return;
    const label = rewardTypeLabel(type);
    parts.push(count > 1 ? `${label} ${count}` : label);
  });
  if (heal > 0) parts.push(`회복 +${heal}`);
  if (currency > 0) parts.push(`골드 +${currency}`);
  return parts.length > 0 ? parts.join(" / ") : "효과 적용";
}

function rewardTypeLabel(type: RewardEntry["type"]): string {
  const labels: Record<RewardEntry["type"], string> = {
    card: "카드",
    rune: "룬",
    relic: "유물",
    arcana: "아르카나",
    currency: "골드",
    heal: "회복",
    unlock: "해금"
  };
  return labels[type] ?? type;
}

function compactText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function drawFittedText(
  context: CanvasRenderingContext2D,
  value: string,
  x: number,
  y: number,
  maxWidth: number,
  maxSize: number,
  minSize: number,
  bold: boolean,
  align: CanvasTextAlign
): void {
  context.textAlign = align;
  context.textBaseline = "middle";
  let size = maxSize;
  while (size > minSize) {
    context.font = `${bold ? "700" : "500"} ${size}px Arial, sans-serif`;
    if (context.measureText(value).width <= maxWidth) break;
    size -= 1;
  }
  context.font = `${bold ? "700" : "500"} ${size}px Arial, sans-serif`;
  context.fillText(trimToWidth(context, value, maxWidth), x, y);
}

function drawWrappedText(
  context: CanvasRenderingContext2D,
  value: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number
): void {
  context.textAlign = "left";
  context.textBaseline = "top";
  const lines = wrapCanvasText(context, value, maxWidth, maxLines);
  lines.forEach((line, index) => {
    context.fillText(line, x, y + index * lineHeight);
  });
}

function wrapCanvasText(context: CanvasRenderingContext2D, value: string, maxWidth: number, maxLines: number): string[] {
  const units = Array.from(compactText(value));
  const lines: string[] = [];
  let current = "";

  for (const unit of units) {
    const next = current + unit;
    if (current && context.measureText(next).width > maxWidth) {
      lines.push(current.trim());
      current = unit.trimStart();
      if (lines.length >= maxLines) break;
    } else {
      current = next;
    }
  }

  if (lines.length < maxLines && current.trim()) {
    lines.push(current.trim());
  }
  if (lines.length > maxLines) {
    lines.length = maxLines;
  }
  if (lines.length === maxLines) {
    lines[maxLines - 1] = trimToWidth(context, lines[maxLines - 1], maxWidth, "...");
  }
  return lines;
}

function trimToWidth(context: CanvasRenderingContext2D, value: string, maxWidth: number, suffix = ""): string {
  if (context.measureText(value).width <= maxWidth) {
    return value;
  }
  let next = value;
  while (next.length > 0 && context.measureText(`${next}${suffix}`).width > maxWidth) {
    next = next.slice(0, -1);
  }
  return `${next}${suffix}`;
}

function drawRoundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
): void {
  const r = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + r, y);
  context.lineTo(x + width - r, y);
  context.quadraticCurveTo(x + width, y, x + width, y + r);
  context.lineTo(x + width, y + height - r);
  context.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  context.lineTo(x + r, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - r);
  context.lineTo(x, y + r);
  context.quadraticCurveTo(x, y, x + r, y);
  context.closePath();
}

function safeTextureKeyPart(value: string): string {
  return value.replace(/[^a-zA-Z0-9_]/g, "_").slice(0, 80);
}
