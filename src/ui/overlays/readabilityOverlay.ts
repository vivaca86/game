import { setMobileFramingCueSuppressed } from "./mobileFramingOverlay";

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
  setMobileFramingCueSuppressed(true);
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
  setMobileFramingCueSuppressed(false);
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
  const canvasMargin = Math.max(12, Math.min(22, canvasBox.width * 0.014));
  applyResponsiveTooltipSizing(root, canvasBox.width, canvasBox.height, canvasMargin);
  const tooltipBox = root.getBoundingClientRect();
  const compact = canvasBox.width < 700;
  const tooltipWidth = Math.max(compact ? 220 : 280, tooltipBox.width || (compact ? 260 : 336));
  const tooltipHeight = Math.max(compact ? 54 : 74, tooltipBox.height || (compact ? 58 : 82));
  const letterboxTopSpace = canvasBox.top - canvasMargin;
  const letterboxBottomSpace = window.innerHeight - canvasBox.bottom - canvasMargin;
  const canUsePortraitLetterbox = compact
    && Math.max(letterboxTopSpace, letterboxBottomSpace) >= tooltipHeight + canvasMargin;
  if (canUsePortraitLetterbox) {
    const preferBelowCanvas = anchorCenterY >= canvasBox.top + canvasBox.height * 0.5;
    const canUseBottom = letterboxBottomSpace >= tooltipHeight + canvasMargin;
    const canUseTop = letterboxTopSpace >= tooltipHeight + canvasMargin;
    const tooltipTop = ((preferBelowCanvas && canUseBottom) || !canUseTop)
      ? canvasBox.bottom + canvasMargin
      : canvasBox.top - tooltipHeight - canvasMargin;
    root.style.left = `${clamp(anchorCenterX - tooltipWidth / 2, canvasMargin, window.innerWidth - tooltipWidth - canvasMargin)}px`;
    root.style.top = `${clamp(tooltipTop, canvasMargin, window.innerHeight - tooltipHeight - canvasMargin)}px`;
    return;
  }
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

function applyResponsiveTooltipSizing(
  root: HTMLElement,
  canvasWidth: number,
  canvasHeight: number,
  canvasMargin: number
): void {
  const compact = canvasWidth < 700;
  const maxWidth = Math.max(180, canvasWidth - canvasMargin * 2);
  const preferredWidth = compact
    ? Math.min(maxWidth, Math.max(220, canvasWidth * 0.74))
    : Math.min(maxWidth, 336);
  root.style.setProperty("--readability-tooltip-width", `${Math.round(preferredWidth)}px`);
  root.style.setProperty("--readability-tooltip-min-height", compact ? "54px" : "74px");
  root.style.setProperty("--readability-tooltip-max-height", `${Math.max(48, Math.round(canvasHeight - canvasMargin * 2))}px`);
  root.style.setProperty("--readability-tooltip-padding", compact ? "9px 11px 10px" : "12px 15px 13px");
}
