import { createRequire } from "node:module";
import Module from "node:module";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const bundledNodeModules = "C:/Users/i/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules";
const bundledPnpmModules = `${bundledNodeModules}/.pnpm/node_modules`;
process.env.NODE_PATH = [process.env.NODE_PATH, bundledNodeModules, bundledPnpmModules].filter(Boolean).join(";");
Module._initPaths();

function loadPlaywright() {
  try {
    return require("playwright");
  } catch {
    return require(`${bundledNodeModules}/playwright`);
  }
}

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const proofPath = path.join(rootDir, "docs", "vertical-slice", "proof.html");
const { chromium } = loadPlaywright();

const executableCandidates = [
  "C:/Users/i/AppData/Local/ms-playwright/chromium-1217/chrome-win64/chrome.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
];

let browser;
let launchError;
for (const executablePath of [null, ...executableCandidates]) {
  try {
    browser = await chromium.launch(executablePath ? { headless: true, executablePath } : { headless: true });
    break;
  } catch (error) {
    launchError = error;
  }
}
if (!browser) throw launchError;

try {
  await checkViewport({ width: 1280, height: 820 }, "desktop");
  await checkViewport({ width: 390, height: 980 }, "mobile");
  console.log("vertical slice proof smoke passed");
} finally {
  await browser.close();
}

async function checkViewport(viewport, label) {
  const page = await browser.newPage({ viewport });
  page.on("console", (message) => {
    if (message.type() === "error") throw new Error(`${label}: console error ${message.text()}`);
  });
  page.on("pageerror", (error) => {
    throw new Error(`${label}: page error ${error.message}`);
  });

  await page.goto(pathToFileURL(proofPath).href, { waitUntil: "networkidle" });
  await page.waitForSelector(".battle-frame", { timeout: 10000 });
  await page.waitForSelector(".hand-card", { timeout: 10000 });
  await page.waitForSelector(".monster-plate", { timeout: 10000 });

  const text = await page.textContent("body");
  const requiredText = [
    "검증 샘플",
    "손패 5장",
    "햇살 콩알탄",
    "앞의 적에게 피해 8. 연쇄 3 이상이면 +4.",
    "구름 쿠션",
    "민트 반짝",
    "리본 고리",
    "푸딩 박치기",
    "리본 방울등",
    "햇살 현관",
    "카드 사용",
    "턴 종료"
  ];
  const missingText = requiredText.filter((item) => !text?.includes(item));
  if (missingText.length > 0) throw new Error(`${label}: missing text ${missingText.join(", ")}`);

  const handCardCount = await page.locator(".hand-card").count();
  if (handCardCount !== 5) throw new Error(`${label}: expected 5 hand cards, found ${handCardCount}`);

  const unloadedImages = await page.evaluate(() => {
    const ruleTexts = Array.from(document.styleSheets).flatMap((sheet) => {
      try {
        return Array.from(sheet.cssRules).map((rule) => String(rule.cssText || ""));
      } catch {
        return [];
      }
    });
    const hasRule = (fileName) => ruleTexts.some((ruleText) => ruleText.includes(fileName));
    return [
      hasRule("battle-monster-background.png") ? null : "battle background css",
      hasRule("card-sunbean-art.png") ? null : "card art css",
      hasRule("card-art-sheet.png") ? null : "card sheet css"
    ].filter(Boolean);
  });
  if (unloadedImages.length > 0) throw new Error(`${label}: missing image references ${unloadedImages.join(", ")}`);

  const overflowItems = await page.locator(".proof-note, .stage-plate, .resource-chip, .monster-plate, .hand-panel, .hand-label, .hand-card, .card-title, .card-text, .preview-chip, .action-panel button").evaluateAll((elements) =>
    elements
      .filter((element) => element.scrollWidth > element.clientWidth + 2 || element.scrollHeight > element.clientHeight + 2)
      .map((element) => element.className || element.tagName)
  );
  if (overflowItems.length > 0) throw new Error(`${label}: overflow ${overflowItems.slice(0, 6).join(" | ")}`);

  await page.screenshot({
    path: path.join(rootDir, "docs", "vertical-slice", `proof-${label}.png`),
    fullPage: true
  });
  await page.close();
}
