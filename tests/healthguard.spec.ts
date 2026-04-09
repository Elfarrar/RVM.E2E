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
    await expect(page.locator(".stat-card")).toHaveCount(4);
    await expect(page.locator(".stat-label").nth(0)).toContainText("Total Services");
    await expect(page.locator(".stat-label").nth(1)).toContainText("Enabled");
    await expect(page.locator(".stat-label").nth(2)).toContainText("Active Incidents");
    await expect(page.locator(".stat-label").nth(3)).toContainText("Healthy");
  });

  test("sidebar has all nav links", async ({ page }) => {
    await page.goto(BASE);
    const sidebar = page.locator(".sidebar-nav");
    await expect(sidebar.getByText("Dashboard")).toBeVisible();
    await expect(sidebar.getByText("Services")).toBeVisible();
    await expect(sidebar.getByText("Incidents")).toBeVisible();
  });

  test("navigate to Services page", async ({ page }) => {
    await page.goto(BASE);
    await page.locator(".sidebar-nav").getByText("Services").click();
    await expect(page).toHaveURL(/\/services/);
    await expect(page.locator("h2")).toContainText("Services");
  });

  test("navigate to Incidents page", async ({ page }) => {
    await page.goto(BASE);
    await page.locator(".sidebar-nav").getByText("Incidents").click();
    await expect(page).toHaveURL(/\/incidents/);
    await expect(page.locator("h2").first()).toContainText("Incidents");
  });

  test("health endpoint returns 200", async ({ request }) => {
    const response = await request.get(`${BASE}/health`);
    expect(response.ok()).toBeTruthy();
  });
});
