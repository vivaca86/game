const { spawn } = require("node:child_process");
const http = require("node:http");
const electronPath = require("electron");

const VITE_PORT = 4173;
const DEV_URL = `http://127.0.0.1:${VITE_PORT}/?surface=desktop`;
const npmBin = process.platform === "win32" ? "npm.cmd" : "npm";

let viteProcess;

const waitForServer = (url, timeoutMs = 45_000) =>
  new Promise((resolve, reject) => {
    const startedAt = Date.now();

    const probe = () => {
      const req = http.get(url, (res) => {
        res.resume();
        resolve();
      });

      req.on("error", () => {
        if (Date.now() - startedAt > timeoutMs) {
          reject(new Error(`Timed out waiting for ${url}`));
          return;
        }
        setTimeout(probe, 350);
      });
    };

    probe();
  });

const isServerAlreadyRunning = () =>
  new Promise((resolve) => {
    const req = http.get(DEV_URL, (res) => {
      res.resume();
      resolve(true);
    });
    req.on("error", () => resolve(false));
    req.setTimeout(800, () => {
      req.destroy();
      resolve(false);
    });
  });

const start = async () => {
  if (!(await isServerAlreadyRunning())) {
    viteProcess = spawn(
      npmBin,
      ["run", "dev", "--", "--port", String(VITE_PORT)],
      { stdio: "inherit" }
    );
  }

  await waitForServer(DEV_URL);

  const electronProcess = spawn(
    electronPath,
    ["desktop/main.cjs"],
    {
      env: {
        ...process.env,
        ABYSSRIUM_DESK_URL: DEV_URL
      },
      stdio: "inherit"
    }
  );

  electronProcess.on("exit", (code) => {
    if (viteProcess) {
      viteProcess.kill();
    }
    process.exit(code ?? 0);
  });
};

start().catch((error) => {
  console.error(error);
  if (viteProcess) {
    viteProcess.kill();
  }
  process.exit(1);
});
