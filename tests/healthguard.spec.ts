import { test, expect } from "@playwright/test";

const BASE = "https://healthguard.rvmtech.com.br";

test.describe("RVM.HealthGuard", () => {
  test("dashboard loads with layout", async ({ page }) => {
    await page.goto(BASE);
    await expect(page.locator(".sidebar-header h2")).toHaveText("RVM.HealthGuard");
    await expect(page.locator(".top-header h1")).toContainText("RVM.HealthGuard");
  });

  test("dashboard shows stat cards", async ({ page }) => {
    await page.goto(BASE);
    await expect(page.locator(".stats-grid")).toBeVisible();
    const cards = page.locator(".stat-card");
    await expect(cards).toHaveCount(3);
  });

  test("sidebar has all nav links", async ({ page }) => {
    await page.goto(BASE);
    const sidebar = page.locator(".sidebar");
    await expect(sidebar.getByText("Dashboard")).toBeVisible();
    await expect(sidebar.getByText("Services")).toBeVisible();
    await expect(sidebar.getByText("Incidents")).toBeVisible();
  });

  test("navigate to Services page", async ({ page }) => {
    await page.goto(BASE);
    await page.locator(".sidebar").getByText("Services").click();
    await expect(page).toHaveURL(/\/services/);
    await expect(page.locator("h3")).toContainText("Services");
  });

  test("navigate to Incidents page", async ({ page }) => {
    await page.goto(BASE);
    await page.locator(".sidebar").getByText("Incidents").click();
    await expect(page).toHaveURL(/\/incidents/);
    await expect(page.locator("h3")).toContainText("Incidents");
  });

  test("health endpoint returns 200", async ({ request }) => {
    const response = await request.get(`${BASE}/health`);
    expect(response.status()).toBe(200);
  });
});
