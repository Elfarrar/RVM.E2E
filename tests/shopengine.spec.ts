import { test, expect } from "@playwright/test";

const BASE = "https://shopengine.rvmtech.com.br";

test.describe("RVM.ShopEngine", () => {
  test("dashboard loads with layout", async ({ page }) => {
    await page.goto(BASE);
    await expect(page.locator(".sidebar-header h2")).toHaveText("RVM.ShopEngine");
    await expect(page.locator("h3")).toContainText("Dashboard");
  });

  test("dashboard shows stat cards", async ({ page }) => {
    await page.goto(BASE);
    await expect(page.locator(".stats-grid")).toBeVisible();
    const cards = page.locator(".stat-card");
    await expect(cards).toHaveCount(3);
    await expect(page.locator(".stat-label").nth(0)).toContainText("Categories");
    await expect(page.locator(".stat-label").nth(1)).toContainText("Products");
    await expect(page.locator(".stat-label").nth(2)).toContainText("Orders");
  });

  test("sidebar has all nav links", async ({ page }) => {
    await page.goto(BASE);
    const nav = page.locator(".nav-list");
    await expect(nav.getByText("Dashboard")).toBeVisible();
    await expect(nav.getByText("Products")).toBeVisible();
    await expect(nav.getByText("Orders")).toBeVisible();
    await expect(nav.getByText("Payments")).toBeVisible();
  });

  test("navigate to Products page", async ({ page }) => {
    await page.goto(BASE);
    await page.locator(".nav-list").getByText("Products").click();
    await expect(page).toHaveURL(/\/products/);
    await expect(page.locator("h3")).toContainText("Products");
  });

  test("navigate to Orders page", async ({ page }) => {
    await page.goto(BASE);
    await page.locator(".nav-list").getByText("Orders").click();
    await expect(page).toHaveURL(/\/orders/);
    await expect(page.locator("h3")).toContainText("Orders");
  });

  test("navigate to Payments page", async ({ page }) => {
    await page.goto(BASE);
    await page.locator(".nav-list").getByText("Payments").click();
    await expect(page).toHaveURL(/\/payments/);
    await expect(page.locator("h3")).toContainText("Payments");
  });

  test("health endpoint returns 200", async ({ request }) => {
    const response = await request.get(`${BASE}/health`);
    expect(response.status()).toBe(200);
  });
});
