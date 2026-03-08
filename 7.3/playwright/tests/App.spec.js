const { test, expect } = require("@playwright/test");

test("test", async ({ page }) => {
  await page.goto("https://netology.ru/");
  await expect(page).toHaveURL("https://netology.ru/");

  const header = page.locator('h1').first();
  await expect(header).toBeVisible();
});

