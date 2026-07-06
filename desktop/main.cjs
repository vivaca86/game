const {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  nativeImage,
  screen,
  Tray
} = require("electron");
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
let tray;

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
  updateTrayMenu();
};

const createTrayImage = () => {
  const size = 16;
  const bitmap = Buffer.alloc(size * size * 4);
  const center = (size - 1) / 2;

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const index = (y * size + x) * 4;
      const dx = x - center;
      const dy = y - center;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const inside = distance <= 7.2;
      const edge = distance > 6.1;

      bitmap[index] = inside ? 222 : 0;
      bitmap[index + 1] = inside ? (edge ? 245 : 205) : 0;
      bitmap[index + 2] = inside ? (edge ? 255 : 79) : 0;
      bitmap[index + 3] = inside ? 255 : 0;
    }
  }

  return nativeImage.createFromBitmap(bitmap, {
    width: size,
    height: size,
    scaleFactor: 1
  });
};

const updateTrayMenu = () => {
  if (!tray) {
    return;
  }

  tray.setContextMenu(
    Menu.buildFromTemplate([
      { label: "Abyssrium Desk", enabled: false },
      { type: "separator" },
      {
        label: currentMode === "compact" ? "펼치기" : "접기",
        click: () => setMode(currentMode === "compact" ? "expanded" : "compact")
      },
      {
        label: "위치 다시 맞추기",
        click: () => setMode(currentMode)
      },
      { type: "separator" },
      {
        label: "종료",
        click: () => app.quit()
      }
    ])
  );
};

const createTray = () => {
  tray = new Tray(createTrayImage());
  tray.setToolTip("Abyssrium Desk");
  tray.on("click", () => {
    setMode(currentMode === "compact" ? "expanded" : "compact");
  });
  updateTrayMenu();
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
  if (url) {
    await reefWindow.loadURL(url);
    return;
  }

  await reefWindow.loadFile(
    path.join(__dirname, "..", "dist", "index.html"),
    { query: { surface: "desktop" } }
  );
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
  createTray();
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
