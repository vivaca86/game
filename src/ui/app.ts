import { connectInputRouter } from "../input/inputRouter";
import { TaskbarReefRenderer } from "../render/TaskbarReefRenderer";
import {
  createInitialReefState,
  isReefModeToggleZone,
  setReefMode,
  type ReefMode,
  tickReefState
} from "../simulation/reefState";

declare global {
  interface Window {
    abyssriumDesktop?: {
      setMode: (mode: ReefMode) => void;
      onGlobalInput: (
        callback: (payload: {
          kind: "keyboard" | "pointerMove" | "pointerTap";
          intensity: number;
          xRatio?: number;
          keycode?: number;
        }) => void
      ) => () => void;
    };
    __abyssriumDeskDebug?: {
      getMode: () => ReefMode;
      setMode: (mode: ReefMode) => void;
    };
  }
}

export const bootAbyssriumDesk = (): void => {
  const root = document.querySelector<HTMLDivElement>("#app");
  if (!root) {
    throw new Error("Missing #app root.");
  }

  const state = createInitialReefState();
  const surface = getSurfaceMode();
  const browserMockMarkup =
    surface === "browser"
      ? `
      <section class="work-window work-window--document" aria-label="work document mock">
        <div class="window-bar">
          <span></span><span></span><span></span>
        </div>
        <div class="doc-lines">
          <b></b><i></i><i></i><i></i><em></em><i></i><i></i>
        </div>
      </section>

      <section class="work-window work-window--chart" aria-label="work chart mock">
        <div class="window-bar">
          <span></span><span></span><span></span>
        </div>
        <div class="chart-line"></div>
        <div class="chart-bars"><span></span><span></span><span></span><span></span></div>
      </section>
      `
      : "";
  const taskbarMockMarkup =
    surface === "browser"
      ? `
      <nav class="windows-taskbar" aria-label="desktop taskbar mock">
        <span class="start-dot"></span>
        <span class="task-pill"></span>
        <span class="task-pill task-pill--wide"></span>
        <span class="task-clock">18:42</span>
      </nav>
      `
      : "";

  document.documentElement.dataset.surface = surface;
  root.dataset.surface = surface;

  root.innerHTML = `
    <main class="desktop ${surface === "desktop" ? "desktop--overlay" : ""}" aria-label="Abyssrium Desk prototype">
      ${browserMockMarkup}

      <section class="reef-dock" data-mode="compact" aria-label="Abyssrium reef taskbar">
        <canvas class="reef-canvas" aria-hidden="true"></canvas>
      </section>

      ${taskbarMockMarkup}
    </main>
  `;

  const reefDock = root.querySelector<HTMLElement>(".reef-dock");
  const canvas = root.querySelector<HTMLCanvasElement>(".reef-canvas");

  if (!reefDock || !canvas) {
    throw new Error("Taskbar reef DOM failed to initialize.");
  }

  const renderState = (): void => {
    root.toggleAttribute("data-expanded", state.mode === "expanded");
    reefDock.dataset.mode = state.mode;
    reefDock.setAttribute("aria-expanded", String(state.mode === "expanded"));
    reefDock.style.setProperty("--reef-glow", state.glow.toFixed(3));
  };

  const applyMode = (mode: ReefMode): void => {
    setReefMode(state, mode);
    renderState();
    window.abyssriumDesktop?.setMode(mode);
    requestAnimationFrame(() => renderer.resize());
    window.setTimeout(() => renderer.resize(), 60);
    window.setTimeout(() => renderer.resize(), 220);
  };

  const renderer = new TaskbarReefRenderer(canvas, () => state, (now, delta) => {
    tickReefState(state, now, delta);
    renderState();
  });

  const resizeObserver = new ResizeObserver(() => renderer.resize());
  resizeObserver.observe(reefDock);
  window.addEventListener("resize", () => renderer.resize());

  connectInputRouter({
    reefElement: reefDock,
    state,
    renderer,
    onStateChange: renderState
  });

  if (import.meta.env.DEV) {
    window.__abyssriumDeskDebug = {
      getMode: () => state.mode,
      setMode: applyMode
    };
  }

  reefDock.addEventListener("click", (event) => {
    const rect = reefDock.getBoundingClientRect();
    const localY = event.clientY - rect.top;
    if (!isReefModeToggleZone(state.mode, localY, rect.height)) {
      return;
    }

    // Unity port note: compact reef click opens and expanded reef click closes.
    // Keeping this symmetric makes the desktop overlay usable without visible
    // chrome while global input still drives ambient reef reactions.
    applyMode(state.mode === "compact" ? "expanded" : "compact");
  });

  renderState();
  renderer.start();
};

const getSurfaceMode = (): "browser" | "desktop" => {
  const params = new URLSearchParams(window.location.search);
  return params.get("surface") === "desktop" || window.abyssriumDesktop
    ? "desktop"
    : "browser";
};
