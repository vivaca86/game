import { expect, test } from "@playwright/test";
import {
  getBubbleSourceRatio,
  reefTuning
} from "../src/simulation/reefState";

test("taskbar reef renders and reacts to input", async ({ page }) => {
  await page.goto("/");
  const reef = page.locator(".reef-dock");
  await expect(reef).toBeVisible();
  await expect(reef).toHaveAttribute("data-mode", "compact");
  await expect(reef).toHaveText("");
  await expect(page.locator(".reef-mark, .reef-meter, .reef-actions, .icon-button")).toHaveCount(0);

  const compactBox = await reef.boundingBox();
  expect(compactBox?.height).toBeGreaterThanOrEqual(54);
  expect(compactBox?.height).toBeLessThanOrEqual(62);
  expect(compactBox?.width).toBeLessThanOrEqual(642);

  await page.keyboard.press("A");
  await page.mouse.move(400, 680);
  await page.mouse.down();
  await page.mouse.up();

  const afterInputBox = await reef.boundingBox();
  expect(afterInputBox?.x).toBeCloseTo(compactBox?.x ?? 0, 0);
  expect(afterInputBox?.y).toBeCloseTo(compactBox?.y ?? 0, 0);
  expect(afterInputBox?.width).toBeCloseTo(compactBox?.width ?? 0, 0);
  expect(afterInputBox?.height).toBeCloseTo(compactBox?.height ?? 0, 0);
  await expect(reef).toHaveAttribute("data-mode", "compact");

  const pixelSample = await page.locator(".reef-canvas").evaluate((canvas) => {
    const c = canvas as HTMLCanvasElement;
    const ctx = c.getContext("2d");
    if (!ctx) return 0;
    const { data } = ctx.getImageData(Math.floor(c.width / 2), Math.floor(c.height / 2), 1, 1);
    return data[0] + data[1] + data[2] + data[3];
  });
  expect(pixelSample).toBeGreaterThan(0);

  await reef.click();
  await expect(reef).toHaveAttribute("data-mode", "expanded");
  await expect
    .poll(async () => Math.round((await reef.boundingBox())?.height ?? 0))
    .toBe(252);

  const expandedBox = await reef.boundingBox();
  await page.mouse.click(expandedBox!.x + expandedBox!.width * 0.5, expandedBox!.y + expandedBox!.height * 0.72);
  await expect(reef).toHaveAttribute("data-mode", "compact");

  await reef.click();
  await expect(reef).toHaveAttribute("data-mode", "expanded");
  await expect
    .poll(async () => Math.round((await reef.boundingBox())?.height ?? 0))
    .toBe(252);
  const expandedBoxAgain = await reef.boundingBox();
  await page.mouse.click(expandedBoxAgain!.x + expandedBoxAgain!.width * 0.5, expandedBoxAgain!.y + 10);
  await expect(reef).toHaveAttribute("data-mode", "compact");
});

test("input bubbles originate from the lower reef in both modes", async ({ page }) => {
  expect(getBubbleSourceRatio("compact")).toBeGreaterThan(0.88);
  expect(getBubbleSourceRatio("expanded")).toBeGreaterThan(0.9);
  expect(reefTuning.compactCameraWidthPx).toBe(640);
  expect(reefTuning.expandedCollapseHotZoneRatio).toBe(1);

  await page.goto("/");
  const reef = page.locator(".reef-dock");
  await expect(reef).toHaveAttribute("data-mode", "compact");

  await page.keyboard.press("A");
  await page.mouse.click(720, 520);
  const compactBox = await reef.boundingBox();
  await expect(reef).toHaveAttribute("data-mode", "compact");

  await page.evaluate(() => {
    window.__abyssriumDeskDebug?.setMode("expanded");
  });
  await expect(reef).toHaveAttribute("data-mode", "expanded");
  await expect
    .poll(async () => Math.round((await reef.boundingBox())?.height ?? 0))
    .toBe(252);

  const expandedBox = await reef.boundingBox();
  await page.keyboard.press("B");
  await page.mouse.click(720, expandedBox!.y - 20);
  await expect(reef).toHaveAttribute("data-mode", "expanded");
  const expandedBoxAfterInput = await reef.boundingBox();

  expect(compactBox?.height).toBeGreaterThanOrEqual(54);
  expect(expandedBoxAfterInput?.x).toBeCloseTo(expandedBox?.x ?? 0, 0);
  expect(expandedBoxAfterInput?.y).toBeCloseTo(expandedBox?.y ?? 0, 0);
  expect(expandedBoxAfterInput?.width).toBeCloseTo(expandedBox?.width ?? 0, 0);
  expect(expandedBoxAfterInput?.height).toBeCloseTo(expandedBox?.height ?? 0, 0);
});

test("desktop surface renders only the reef overlay", async ({ page }) => {
  await page.setViewportSize({ width: 1408, height: 56 });
  await page.goto("/?surface=desktop");

  const reef = page.locator(".reef-dock");
  await expect(reef).toBeVisible();
  await expect(page.locator(".work-window, .windows-taskbar")).toHaveCount(0);
  await expect(reef).toHaveCSS("border-radius", "0px");

  const box = await reef.boundingBox();
  expect(box?.x).toBeCloseTo(0, 0);
  expect(box?.y).toBeCloseTo(0, 0);
  expect(box?.width).toBeCloseTo(1408, 0);
  expect(box?.height).toBeCloseTo(56, 0);
});
