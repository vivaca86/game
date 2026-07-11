const { execFileSync } = require("node:child_process");
const fs = require("node:fs/promises");
const path = require("node:path");
const electronExe = require("electron");

const rootDir = path.resolve(__dirname, "..");
const electronDistDir = path.dirname(electronExe);
const releaseDir = path.join(rootDir, "release");
const appName = "AbyssriumDesk-win-x64";
const outDir = path.join(releaseDir, appName);
const appDir = path.join(outDir, "resources", "app");
const zipPath = path.join(releaseDir, `${appName}.zip`);

const copyIntoApp = async (relativePath) => {
  await fs.cp(
    path.join(rootDir, relativePath),
    path.join(appDir, relativePath),
    { recursive: true }
  );
};

const copyRuntimeDependency = async (packageName) => {
  await fs.cp(
    path.join(rootDir, "node_modules", packageName),
    path.join(appDir, "node_modules", packageName),
    { recursive: true }
  );
};

const quoteForPowershell = (value) => `'${value.replace(/'/g, "''")}'`;

const createZip = () => {
  const sourceGlob = path.join(outDir, "*");
  execFileSync(
    "powershell.exe",
    [
      "-NoProfile",
      "-Command",
      `Compress-Archive -Path ${quoteForPowershell(sourceGlob)} -DestinationPath ${quoteForPowershell(zipPath)} -Force`
    ],
    { stdio: "inherit" }
  );
};

const main = async () => {
  await fs.rm(outDir, { recursive: true, force: true });
  await fs.rm(zipPath, { force: true });
  await fs.mkdir(releaseDir, { recursive: true });

  await fs.cp(electronDistDir, outDir, { recursive: true });
  await fs.rename(
    path.join(outDir, "electron.exe"),
    path.join(outDir, "Abyssrium Desk.exe")
  );
  await fs.rm(path.join(outDir, "resources", "default_app.asar"), { force: true });

  await fs.mkdir(path.join(appDir, "node_modules"), { recursive: true });
  await copyIntoApp("desktop");
  await copyIntoApp("dist");
  await fs.copyFile(path.join(rootDir, "package.json"), path.join(appDir, "package.json"));
  await copyRuntimeDependency("uiohook-napi");
  await copyRuntimeDependency("node-gyp-build");
  createZip();

  console.log(`Packaged desktop build: ${outDir}`);
  console.log(`Zip for another PC: ${zipPath}`);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
