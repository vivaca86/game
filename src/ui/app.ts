import { connectInputRouter } from "../input/inputRouter";
import { TaskbarReefRenderer } from "../render/TaskbarReefRenderer";
import {
  createInitialReefState,
  setReefMode,
  type ReefMode,
  tickReefState
} from "../simulation/reefState";

declare global {
  interface Window {
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
      </section>

      <nav class="windows-taskbar" aria-label="desktop taskbar mock">
        <span class="start-dot"></span>
        <span class="task-pill"></span>
        <span class="task-pill task-pill--wide"></span>
        <span class="task-clock">18:42</span>
      </nav>
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
    reefDock.style.setProperty("--reef-glow", state.glow.toFixed(3));
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
      setMode: (mode) => {
        setReefMode(state, mode);
        renderState();
        window.setTimeout(() => renderer.resize(), 0);
      }
    };
  }

  renderState();
  renderer.start();
};
