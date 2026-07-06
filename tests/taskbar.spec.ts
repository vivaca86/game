import { expect, test } from "@playwright/test";

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

  await page.keyboard.press("A");
  await page.mouse.move(400, 680);
  await page.mouse.down();
  await page.mouse.up();

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
    .poll(async () => {
      const expandedBox = await reef.boundingBox();
      return expandedBox?.height ?? 0;
    })
    .toBeGreaterThan(180);
});
