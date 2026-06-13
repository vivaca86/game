const MOBILE_FRAMING_ROOT_ID = "game-mobile-framing-cue";
const COMPACT_WIDTH = 700;
const MIN_LETTERBOX_SPACE = 90;

let resizeBound = false;
let latestSceneName = "";

export function renderMobileFramingCue(sceneName: string): void {
  latestSceneName = sceneName;
  const root = ensureMobileFramingRoot();
  root.dataset.scene = sceneName;
  root.replaceChildren(
    textElement("strong", "가로 화면 권장"),
    textElement("span", "화면을 가로로 돌리면 무대와 카드가 더 크게 보입니다.")
  );

  scheduleMobileFramingPlacement(root);
}

export function setMobileFramingCueSuppressed(suppressed: boolean): void {
  const root = document.getElementById(MOBILE_FRAMING_ROOT_ID);
  if (!root) return;
  root.dataset.suppressed = String(suppressed);
  root.style.transition = suppressed ? "none" : "";
  root.style.opacity = suppressed ? "0" : "";
  root.style.visibility = suppressed ? "hidden" : "";
  root.setAttribute("aria-hidden", suppressed || root.dataset.visible !== "true" ? "true" : "false");
}

function ensureMobileFramingRoot(): HTMLElement {
  const existing = document.getElementById(MOBILE_FRAMING_ROOT_ID);
  if (existing) return existing;

  const root = document.createElement("aside");
  root.id = MOBILE_FRAMING_ROOT_ID;
  root.className = "game-mobile-framing-cue";
  root.dataset.visible = "false";
  root.dataset.suppressed = "false";
  root.setAttribute("role", "status");
  root.setAttribute("aria-live", "polite");
  root.setAttribute("aria-atomic", "true");
  root.setAttribute("aria-hidden", "true");
  document.body.append(root);

  if (!resizeBound) {
    resizeBound = true;
    window.addEventListener("resize", () => {
      const current = document.getElementById(MOBILE_FRAMING_ROOT_ID);
      if (current && latestSceneName) updateMobileFramingPlacement(current);
    });
    window.addEventListener("orientationchange", () => {
      const current = document.getElementById(MOBILE_FRAMING_ROOT_ID);
      if (current && latestSceneName) scheduleMobileFramingPlacement(current);
    });
  }

  return root;
}

function scheduleMobileFramingPlacement(root: HTMLElement): void {
  window.requestAnimationFrame(() => updateMobileFramingPlacement(root));
  window.setTimeout(() => updateMobileFramingPlacement(root), 80);
  window.setTimeout(() => updateMobileFramingPlacement(root), 180);
}

function textElement(tagName: "strong" | "span", text: string): HTMLElement {
  const node = document.createElement(tagName);
  node.textContent = text;
  return node;
}

function updateMobileFramingPlacement(root: HTMLElement): void {
  const canvas = document.querySelector<HTMLCanvasElement>("#game-root canvas");
  const canvasBox = canvas?.getBoundingClientRect();
  if (!canvasBox) {
    setVisible(root, false);
    return;
  }

  const isPortrait = window.innerHeight > window.innerWidth;
  const isCompact = window.innerWidth <= COMPACT_WIDTH || canvasBox.width <= COMPACT_WIDTH;
  const topSpace = canvasBox.top;
  const bottomSpace = window.innerHeight - canvasBox.bottom;
  const largestLetterbox = Math.max(topSpace, bottomSpace);
  const canUseLetterbox = isPortrait
    && isCompact
    && canvasBox.height > 0
    && canvasBox.height < window.innerHeight * 0.45
    && largestLetterbox >= MIN_LETTERBOX_SPACE;

  if (!canUseLetterbox) {
    setVisible(root, false);
    return;
  }

  root.style.setProperty("--mobile-framing-width", `${Math.round(Math.min(canvasBox.width - 28, 330))}px`);
  const rootBox = root.getBoundingClientRect();
  const cueHeight = Math.max(58, rootBox.height || 64);
  const useTop = topSpace >= bottomSpace || bottomSpace < cueHeight + 24;
  const letterboxStart = useTop ? 0 : canvasBox.bottom;
  const letterboxHeight = useTop ? topSpace : bottomSpace;
  const top = letterboxStart + Math.max(14, (letterboxHeight - cueHeight) / 2);
  const left = canvasBox.left + (canvasBox.width - Math.min(canvasBox.width - 28, 330)) / 2;

  root.dataset.zone = useTop ? "top" : "bottom";
  root.style.left = `${Math.round(Math.max(14, left))}px`;
  root.style.top = `${Math.round(Math.max(14, Math.min(window.innerHeight - cueHeight - 14, top)))}px`;
  setVisible(root, true);
}

function setVisible(root: HTMLElement, visible: boolean): void {
  root.dataset.visible = String(visible);
  root.setAttribute("aria-hidden", visible && root.dataset.suppressed !== "true" ? "false" : "true");
}
