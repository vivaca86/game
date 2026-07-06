const { app, BrowserWindow, ipcMain, screen } = require("electron");
const path = require("node:path");

const WINDOW = {
  compactHeight: 56,
  expandedHeight: 252,
  horizontalMargin: 16,
  bottomGap: 10
};

let reefWindow;
let currentMode = "compact";
let inputHook;
let lastMouseMoveAt = 0;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const getOverlayBounds = (mode = currentMode) => {
  const display = screen.getPrimaryDisplay();
  const { workArea } = display;
  const height = mode === "expanded" ? WINDOW.expandedHeight : WINDOW.compactHeight;
  const width = Math.max(320, workArea.width - WINDOW.horizontalMargin * 2);

  return {
    x: workArea.x + WINDOW.horizontalMargin,
    y: workArea.y + workArea.height - height - WINDOW.bottomGap,
    width,
    height
  };
};

const pointInsideWindow = (x, y) => {
  if (!reefWindow || reefWindow.isDestroyed()) {
    return false;
  }

  const bounds = reefWindow.getBounds();
  return (
    x >= bounds.x &&
    x <= bounds.x + bounds.width &&
    y >= bounds.y &&
    y <= bounds.y + bounds.height
  );
};

const normalizePointerX = (x, y) => {
  const display = screen.getDisplayNearestPoint({ x, y });
  const left = display.workArea.x + WINDOW.horizontalMargin;
  const width = Math.max(1, display.workArea.width - WINDOW.horizontalMargin * 2);
  return clamp((x - left) / width, 0, 1);
};

const sendInput = (payload) => {
  if (!reefWindow || reefWindow.isDestroyed()) {
    return;
  }

  reefWindow.webContents.send("reef:global-input", payload);
};

const setMode = (mode) => {
  if (mode !== "compact" && mode !== "expanded") {
    return;
  }

  currentMode = mode;
  if (reefWindow && !reefWindow.isDestroyed()) {
    reefWindow.setBounds(getOverlayBounds(mode), true);
  }
};

const createWindow = async () => {
  reefWindow = new BrowserWindow({
    ...getOverlayBounds("compact"),
    frame: false,
    transparent: true,
    resizable: false,
    movable: false,
    minimizable: false,
    maximizable: false,
    hasShadow: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    title: "Abyssrium Desk",
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  reefWindow.setAlwaysOnTop(true, "screen-saver");
  reefWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  reefWindow.removeMenu();

  const url = process.env.ABYSSRIUM_DESK_URL;
  if (!url) {
    throw new Error("ABYSSRIUM_DESK_URL is required. Run npm run desktop:dev.");
  }

  await reefWindow.loadURL(url);
};

const startGlobalInput = () => {
  try {
    inputHook = require("uiohook-napi").uIOhook;
  } catch (error) {
    console.warn("Global input hook could not be loaded:", error);
    return;
  }

  inputHook.on("keydown", (event) => {
    sendInput({
      kind: "keyboard",
      intensity: 0.9,
      keycode: event.keycode
    });
  });

  inputHook.on("mousedown", (event) => {
    if (pointInsideWindow(event.x, event.y)) {
      return;
    }

    sendInput({
      kind: "pointerTap",
      intensity: 1.15,
      xRatio: normalizePointerX(event.x, event.y)
    });
  });

  inputHook.on("mousemove", (event) => {
    const now = Date.now();
    if (now - lastMouseMoveAt < 55 || pointInsideWindow(event.x, event.y)) {
      return;
    }

    lastMouseMoveAt = now;
    sendInput({
      kind: "pointerMove",
      intensity: 0.55,
      xRatio: normalizePointerX(event.x, event.y)
    });
  });

  inputHook.on("wheel", (event) => {
    if (pointInsideWindow(event.x, event.y)) {
      return;
    }

    sendInput({
      kind: "pointerTap",
      intensity: 0.75,
      xRatio: normalizePointerX(event.x, event.y)
    });
  });

  inputHook.start();
};

app.whenReady().then(async () => {
  await createWindow();
  startGlobalInput();
  console.log("Abyssrium Desk desktop overlay is running.");

  ipcMain.on("reef:set-mode", (_event, mode) => {
    setMode(mode);
  });

  screen.on("display-metrics-changed", () => setMode(currentMode));

  const exitAfterMs = Number(process.env.ABYSSRIUM_DESK_EXIT_AFTER_MS || 0);
  if (exitAfterMs > 0) {
    setTimeout(() => app.quit(), exitAfterMs);
  }
});

app.on("window-all-closed", () => {
  app.quit();
});

app.on("before-quit", () => {
  if (inputHook) {
    inputHook.stop();
  }
});
