import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 390, height: 844 } });

test("keeps all six clocks on screen and opens the mobile menu", async ({ page }) => {
  await page.goto("/");

  const cards = page.locator(".city-clock");
  await expect(cards).toHaveCount(6);
  await expect(cards.filter({ hasText: "Dubai" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);

  for (const index of [0, 1, 2]) {
    const box = await cards.nth(index).boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(390);
  }

  const heroBackground = await page.locator(".city-skyline").evaluate((element) => getComputedStyle(element).backgroundImage);
  expect(heroBackground).toContain("/cities/");

  await page.getByRole("button", { name: "Open menu" }).click();
  const menu = page.getByRole("navigation", { name: "Mobile navigation" });
  await expect(menu).toBeVisible();
  await expect(menu.getByRole("link", { name: "World Clock" })).toBeVisible();
  await expect(menu.getByRole("link", { name: "Convert time" })).toBeVisible();
  await expect(menu.getByRole("link", { name: "Meeting planner" })).toBeVisible();
  await expect(menu.getByRole("link", { name: "Blog" })).toBeVisible();
});
