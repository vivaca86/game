const READABILITY_ROOT_ID = "game-readability-tooltip";
const VIRTUAL_WIDTH = 1920;
const VIRTUAL_HEIGHT = 1080;

export type ReadabilityTooltipTone = "default" | "confirm" | "choice" | "danger";

interface ReadabilityTooltipAnchor {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ReadabilityTooltipOptions {
  sceneName: string;
  title: string;
  body?: string;
  tone?: ReadabilityTooltipTone;
  anchor: ReadabilityTooltipAnchor;
}

export function showReadabilityTooltip(options: ReadabilityTooltipOptions): void {
  const root = ensureReadabilityRoot();
  root.dataset.visible = "true";
  root.dataset.scene = options.sceneName;
  root.dataset.title = options.title;
  root.dataset.tone = options.tone ?? "default";
  root.replaceChildren(
    textElement("strong", options.title),
    textElement("span", options.body ?? "")
  );
  positionTooltip(root, options.anchor);
}

export function hideReadabilityTooltip(): void {
  const root = document.getElementById(READABILITY_ROOT_ID);
  if (!root) return;
  root.dataset.visible = "false";
  root.removeAttribute("data-title");
}

function ensureReadabilityRoot(): HTMLElement {
  const existing = document.getElementById(READABILITY_ROOT_ID);
  if (existing) return existing;

  const root = document.createElement("aside");
  root.id = READABILITY_ROOT_ID;
  root.className = "game-readability-tooltip";
  root.dataset.visible = "false";
  root.setAttribute("role", "tooltip");
  root.setAttribute("aria-live", "polite");
  document.body.append(root);
  return root;
}

function textElement(tagName: "strong" | "span", text: string): HTMLElement {
  const node = document.createElement(tagName);
  node.textContent = text;
  return node;
}

function positionTooltip(root: HTMLElement, anchor: ReadabilityTooltipAnchor): void {
  const canvas = document.querySelector<HTMLCanvasElement>("#game-root canvas");
  const canvasBox = canvas?.getBoundingClientRect();
  if (!canvasBox) {
    root.style.left = "16px";
    root.style.top = "16px";
    return;
  }

  const anchorCenterX = canvasBox.left + (anchor.x / VIRTUAL_WIDTH) * canvasBox.width;
  const anchorCenterY = canvasBox.top + (anchor.y / VIRTUAL_HEIGHT) * canvasBox.height;
  const anchorWidth = (anchor.width / VIRTUAL_WIDTH) * canvasBox.width;
  const anchorHeight = (anchor.height / VIRTUAL_HEIGHT) * canvasBox.height;
  const tooltipBox = root.getBoundingClientRect();
  const tooltipWidth = Math.max(280, tooltipBox.width || 336);
  const tooltipHeight = Math.max(74, tooltipBox.height || 82);
  const canvasMargin = Math.max(12, Math.min(22, canvasBox.width * 0.014));
  const above = anchorCenterY > canvasBox.top + canvasBox.height * 0.56;
  const preferredLeft = anchorCenterX - tooltipWidth / 2;
  const preferredTop = above
    ? anchorCenterY - anchorHeight / 2 - tooltipHeight - 14
    : anchorCenterY + anchorHeight / 2 + 14;
  const minLeft = canvasBox.left + canvasMargin;
  const maxLeft = canvasBox.right - tooltipWidth - canvasMargin;
  const minTop = canvasBox.top + canvasMargin;
  const maxTop = canvasBox.bottom - tooltipHeight - canvasMargin;

  root.style.left = `${clamp(preferredLeft, minLeft, maxLeft)}px`;
  root.style.top = `${clamp(preferredTop, minTop, maxTop)}px`;
}

function clamp(value: number, min: number, max: number): number {
  if (max < min) return min;
  return Math.max(min, Math.min(max, value));
}
