import {
  Camera,
  Maximize2,
  Minimize2,
  Shell,
  Sparkles,
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
      Shell,
      Sparkles,
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
          <div class="reef-identity">
            <span class="reef-mark"><i data-lucide="waves"></i></span>
            <div>
              <strong>Abyssrium Desk</strong>
              <small data-status-line>심해 팔레트피쉬 방문 중</small>
            </div>
          </div>
          <div class="reef-meter" aria-label="reef activity">
            <span data-glow-meter></span>
          </div>
          <div class="reef-actions">
            <button class="icon-button" type="button" data-action="capture" title="오늘의 발견 카드">
              <i data-lucide="camera"></i>
            </button>
            <button class="icon-button" type="button" data-action="toggle" title="리프 확장">
              <i data-lucide="maximize-2"></i>
            </button>
          </div>
        </div>

        <aside class="reef-panel" aria-label="reef details">
          <div class="visitor-card">
            <span class="panel-icon"><i data-lucide="shell"></i></span>
            <div>
              <small>오늘의 방문자</small>
              <strong data-visitor-name>심해 팔레트피쉬</strong>
              <p data-visitor-mood>조용히 따라오는 중</p>
            </div>
          </div>
          <div class="reef-stats" aria-label="reef stats">
            <span><b data-focus-minutes>0</b><small>집중 분</small></span>
            <span><b data-bubble-score>12</b><small>버블</small></span>
            <span><b data-discovery-count>1</b><small>발견</small></span>
          </div>
          <ol class="discovery-list" data-discovery-list></ol>
        </aside>
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
  let renderedDiscoverySignature = "";

  const renderState = (): void => {
    root.toggleAttribute("data-expanded", state.mode === "expanded");
    reefDock.dataset.mode = state.mode;
    reefDock.style.setProperty("--reef-glow", state.glow.toFixed(3));

    const statusLine = root.querySelector<HTMLElement>("[data-status-line]");
    const glowMeter = root.querySelector<HTMLElement>("[data-glow-meter]");
    const focusMinutes = root.querySelector<HTMLElement>("[data-focus-minutes]");
    const bubbleScore = root.querySelector<HTMLElement>("[data-bubble-score]");
    const discoveryCount = root.querySelector<HTMLElement>("[data-discovery-count]");
    const visitorName = root.querySelector<HTMLElement>("[data-visitor-name]");
    const visitorMood = root.querySelector<HTMLElement>("[data-visitor-mood]");
    const discoveryList = root.querySelector<HTMLOListElement>("[data-discovery-list]");

    if (statusLine) {
      statusLine.textContent =
        state.bubblePressure > 0.55
          ? "버블 해류가 살아나는 중"
          : `${state.visitor.nameKo} 방문 중`;
    }
    if (glowMeter) {
      glowMeter.style.transform = `scaleX(${Math.max(0.08, state.glow)})`;
    }
    if (focusMinutes) {
      focusMinutes.textContent = Math.floor(state.focusSeconds / 60).toString();
    }
    if (bubbleScore) {
      bubbleScore.textContent = Math.round(state.bubblePressure * 100).toString();
    }
    if (discoveryCount) {
      discoveryCount.textContent = state.discoveries.length.toString();
    }
    if (visitorName) {
      visitorName.textContent = state.visitor.nameKo;
    }
    if (visitorMood) {
      visitorMood.textContent = state.visitor.moodKo;
    }
    const discoverySignature = state.discoveries.map((item) => item.id).join("|");
    if (discoveryList && discoverySignature !== renderedDiscoverySignature) {
      discoveryList.innerHTML = state.discoveries
        .slice(0, 3)
        .map(
          (item) => `
            <li>
              <span><i data-lucide="sparkles"></i></span>
              <div>
                <strong>${item.titleKo}</strong>
                <small>${item.detailKo}</small>
              </div>
            </li>
          `
        )
        .join("");
      renderedDiscoverySignature = discoverySignature;
      refreshIcons();
    }

    if (renderedMode !== state.mode) {
      toggleButton.title = state.mode === "compact" ? "리프 확장" : "리프 접기";
      toggleButton.setAttribute(
        "aria-label",
        state.mode === "compact" ? "리프 확장" : "리프 접기"
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
      x: reefDock.clientWidth * 0.72,
      y: reefDock.clientHeight * 0.58
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
