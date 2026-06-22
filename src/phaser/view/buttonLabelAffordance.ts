import Phaser from "phaser";

const BUTTON_LABEL_VERSION = "v1";

interface ButtonLabelOptions {
  tone?: "confirm" | "danger" | "utility" | "default";
  depth?: number;
  largeText?: boolean;
  compact?: boolean;
}

export function renderButtonLabelAffordance(
  scene: Phaser.Scene,
  label: string,
  x: number,
  y: number,
  width: number,
  height: number,
  options: ButtonLabelOptions = {}
): Phaser.GameObjects.Image {
  const key = ensureButtonLabelTexture(scene, label, width, height, options);
  return scene.add.image(x, y, key)
    .setDisplaySize(width, height)
    .setDepth(options.depth ?? 22.45)
    .setData("buttonLabelAffordance", true)
    .setData("buttonLabel", label);
}

function ensureButtonLabelTexture(
  scene: Phaser.Scene,
  label: string,
  width: number,
  height: number,
  options: ButtonLabelOptions
): string {
  const key = [
    "button_label_affordance",
    BUTTON_LABEL_VERSION,
    hashLabel(label),
    width,
    height,
    options.tone ?? "default",
    options.largeText ? "lg" : "std",
    options.compact ? "compact" : "normal"
  ].join("_");

  if (scene.textures.exists(key)) {
    return key;
  }

  const scale = 2;
  const texture = scene.textures.createCanvas(key, width * scale, height * scale);
  if (!texture) {
    return key;
  }

  const context = texture.getContext();
  context.save();
  context.scale(scale, scale);
  drawButtonLabel(context, label, width, height, options);
  context.restore();
  texture.refresh();
  return key;
}

function drawButtonLabel(
  context: CanvasRenderingContext2D,
  label: string,
  width: number,
  height: number,
  options: ButtonLabelOptions
): void {
  const tone = options.tone ?? "default";
  const accent = tone === "danger" ? "#a5483f" : tone === "confirm" ? "#2f6b68" : tone === "utility" ? "#4c659d" : "#805845";
  const fill = tone === "danger" ? "rgba(255, 238, 224, 0.9)" : "rgba(255, 248, 232, 0.9)";
  const fontSize = options.largeText ? (options.compact ? 17 : 19) : (options.compact ? 15 : 17);
  const radius = Math.min(12, height / 2);

  context.clearRect(0, 0, width, height);
  context.lineJoin = "round";
  context.shadowColor = "rgba(20, 17, 22, 0.28)";
  context.shadowBlur = 6;
  context.fillStyle = fill;
  context.strokeStyle = accent;
  context.lineWidth = 2;
  drawRoundedRect(context, 2, 2, width - 4, height - 4, radius);
  context.fill();
  context.stroke();
  context.shadowBlur = 0;

  context.fillStyle = `${accent}24`;
  drawRoundedRect(context, 7, 7, Math.max(14, Math.min(28, width * 0.14)), height - 14, Math.max(6, radius - 4));
  context.fill();

  context.fillStyle = accent;
  context.font = `700 ${fontSize}px Arial, sans-serif`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(trimToWidth(context, label, width - 24), width / 2, height / 2 + 0.5);
}

function trimToWidth(context: CanvasRenderingContext2D, value: string, maxWidth: number): string {
  if (context.measureText(value).width <= maxWidth) {
    return value;
  }
  let next = value;
  while (next.length > 0 && context.measureText(`${next}...`).width > maxWidth) {
    next = next.slice(0, -1);
  }
  return `${next}...`;
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

function hashLabel(label: string): string {
  let hash = 2166136261;
  for (const char of label) {
    hash ^= char.codePointAt(0) ?? 0;
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}
