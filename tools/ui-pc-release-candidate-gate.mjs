import { spawn } from "node:child_process";

const npmExecPath = process.env.npm_execpath;
const npmCommand = npmExecPath ? process.execPath : process.platform === "win32" ? "npm.cmd" : "npm";
const npmArgPrefix = npmExecPath ? [npmExecPath] : [];

const smokeOnly = [
  "checkViewScreenshots",
  "checkClickableControls",
  "checkFullInputCoverage",
  "checkSettingsSurface",
  "checkUiSkinStates",
  "checkSaveReload",
  "checkCombatActions",
  "checkBossResultFlow"
].join(",");

const gates = [
  {
    label: "PC idle/action affordance",
    command: npmCommand,
    args: [...npmArgPrefix, "run", "ui:pc-action-affordance"]
  },
  {
    label: "PC combat card/button affordance",
    command: npmCommand,
    args: [...npmArgPrefix, "run", "ui:pc-combat:affordance"]
  },
  {
    label: "PC WorldMap keyboard states",
    command: npmCommand,
    args: [...npmArgPrefix, "run", "ui:pc-worldmap:keyboard"]
  },
  {
    label: "PC WorldMap release-state recomposition",
    command: npmCommand,
    args: [...npmArgPrefix, "run", "ui:pc-worldmap:release-state"]
  },
  {
    label: "PC keyboard focus tooltips",
    command: process.execPath,
    args: ["tools/ui-keyboard-focus-tooltip-audit.mjs"],
    env: { UI_AUDIT_VIEWPORTS: "desktop" }
  },
  {
    label: "PC disabled readability",
    command: process.execPath,
    args: ["tools/ui-disabled-readability-audit.mjs"],
    env: { UI_AUDIT_VIEWPORTS: "desktop" }
  },
  {
    label: "PC WorldMap selected-state route recomposition",
    command: process.execPath,
    args: ["tools/ui-worldmap-open-node-selection-audit.mjs"],
    env: { UI_AUDIT_VIEWPORTS: "desktop" }
  },
  {
    label: "PC WorldMap locked-state explanations",
    command: process.execPath,
    args: ["tools/ui-worldmap-locked-tooltip-audit.mjs"],
    env: { UI_AUDIT_VIEWPORTS: "desktop" }
  },
  {
    label: "PC core interaction smoke",
    command: npmCommand,
    args: [...npmArgPrefix, "run", "phaser:smoke"],
    env: { PHASER_SMOKE_ONLY: smokeOnly }
  },
  {
    label: "Build and fixture check",
    command: npmCommand,
    args: [...npmArgPrefix, "run", "check"]
  }
];

const startedAt = Date.now();
const results = [];

for (const gate of gates) {
  const gateStartedAt = Date.now();
  console.log(`\n[pc-release-candidate] ${gate.label}`);
  const code = await runGate(gate);
  const elapsedMs = Date.now() - gateStartedAt;
  results.push({ label: gate.label, code, elapsedMs });
  if (code !== 0) {
    console.error(`\n[pc-release-candidate] FAILED: ${gate.label} exited with ${code}`);
    printSummary(results, Date.now() - startedAt);
    process.exit(code ?? 1);
  }
}

printSummary(results, Date.now() - startedAt);
console.log("\n[pc-release-candidate] OK");

function runGate(gate) {
  return new Promise((resolve, reject) => {
    const child = spawn(gate.command, gate.args, {
      cwd: process.cwd(),
      env: { ...process.env, ...(gate.env ?? {}) },
      shell: process.platform === "win32" && !npmExecPath,
      stdio: "inherit"
    });

    child.on("error", reject);
    child.on("close", resolve);
  });
}

function printSummary(items, elapsedMs) {
  console.log("\n[pc-release-candidate] Summary");
  for (const item of items) {
    const seconds = (item.elapsedMs / 1000).toFixed(1);
    console.log(`- ${item.code === 0 ? "ok" : "failed"} ${item.label} (${seconds}s)`);
  }
  console.log(`- total ${(elapsedMs / 1000).toFixed(1)}s`);
}
