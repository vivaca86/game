import {
  Camera,
  Maximize2,
  Minimize2,
  Waves,
  createIcons
} from "lucide";
import { connectInputRouter } from "../input/inputRouter";
import { TaskbarReefRenderer } from "../render/TaskbarReefRenderer";
import {
  applyInputAction,
  createInitialReefState,
  setReefMode,
  tickReefState
} from "../simulation/reefState";

const refreshIcons = (): void => {
  createIcons({
    icons: {
      Camera,
      Maximize2,
      Minimize2,
      Waves
    }
  });
};

export const bootAbyssriumDesk = (): void => {
  const root = document.querySelector<HTMLDivElement>("#app");
  if (!root) {
    throw new Error("Missing #app root.");
  }

  const state = createInitialReefState();

  root.innerHTML = `
    <main class="desktop" aria-label="Abyssrium Desk prototype">
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

      <section class="reef-dock" data-mode="compact" aria-label="Abyssrium reef taskbar">
        <canvas class="reef-canvas" aria-hidden="true"></canvas>
        <div class="reef-hud">
          <span class="reef-mark" aria-hidden="true"><i data-lucide="waves"></i></span>
          <div class="reef-meter" aria-label="reef activity">
            <span data-glow-meter></span>
          </div>
          <div class="reef-actions">
            <button class="icon-button" type="button" data-action="capture" aria-label="react">
              <i data-lucide="camera"></i>
            </button>
            <button class="icon-button" type="button" data-action="toggle" aria-label="expand">
              <i data-lucide="maximize-2"></i>
            </button>
          </div>
        </div>
      </section>

      <nav class="windows-taskbar" aria-label="desktop taskbar mock">
        <span class="start-dot"></span>
        <span class="task-pill"></span>
        <span class="task-pill task-pill--wide"></span>
        <span class="task-clock">18:42</span>
      </nav>
    </main>
  `;

  refreshIcons();

  const reefDock = root.querySelector<HTMLElement>(".reef-dock");
  const canvas = root.querySelector<HTMLCanvasElement>(".reef-canvas");
  const toggleButton = root.querySelector<HTMLButtonElement>('[data-action="toggle"]');
  const captureButton = root.querySelector<HTMLButtonElement>('[data-action="capture"]');

  if (!reefDock || !canvas || !toggleButton || !captureButton) {
    throw new Error("Taskbar reef DOM failed to initialize.");
  }

  let renderedMode = "";

  const renderState = (): void => {
    root.toggleAttribute("data-expanded", state.mode === "expanded");
    reefDock.dataset.mode = state.mode;
    reefDock.style.setProperty("--reef-glow", state.glow.toFixed(3));

    const glowMeter = root.querySelector<HTMLElement>("[data-glow-meter]");
    if (glowMeter) {
      glowMeter.style.transform = `scaleX(${Math.max(0.08, state.glow)})`;
    }

    if (renderedMode !== state.mode) {
      toggleButton.setAttribute(
        "aria-label",
        state.mode === "compact" ? "expand" : "collapse"
      );
      toggleButton.innerHTML =
        state.mode === "compact"
          ? '<i data-lucide="maximize-2"></i>'
          : '<i data-lucide="minimize-2"></i>';
      renderedMode = state.mode;
      refreshIcons();
    }
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

  toggleButton.addEventListener("click", () => {
    setReefMode(state, state.mode === "compact" ? "expanded" : "compact");
    renderState();
    window.setTimeout(() => renderer.resize(), 180);
  });

  captureButton.addEventListener("click", () => {
    const action = {
      kind: "capture" as const,
      at: performance.now(),
      intensity: 1.2,
      x: reefDock.clientWidth * 0.5,
      y: reefDock.clientHeight * 0.5
    };
    applyInputAction(state, action);
    renderer.pushInput(action);
    if (state.mode === "compact") {
      setReefMode(state, "expanded");
      window.setTimeout(() => renderer.resize(), 180);
    }
    renderState();
  });

  renderState();
  renderer.start();
};
