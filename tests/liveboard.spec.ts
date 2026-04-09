import { test, expect } from "@playwright/test";

const BASE = "https://liveboard.rvmtech.com.br";

test.describe("RVM.LiveBoard", () => {
  test("dashboard loads with layout", async ({ page }) => {
    await page.goto(BASE);
    await expect(page.locator(".sidebar-header")).toContainText("RVM.LiveBoard");
    await expect(page.locator(".page-body h3")).toContainText("Dashboard");
  });

  test("dashboard shows stat cards", async ({ page }) => {
    await page.goto(BASE);
    await expect(page.locator(".stats-grid")).toBeVisible();
    await expect(page.locator(".stat-card")).toHaveCount(3);
    await expect(page.locator(".stat-label").nth(0)).toContainText("Dashboards");
    await expect(page.locator(".stat-label").nth(1)).toContainText("Alerts");
    await expect(page.locator(".stat-label").nth(2)).toContainText("Metric");
  });

  test("sidebar has all nav links", async ({ page }) => {
    await page.goto(BASE);
    const sidebar = page.locator(".sidebar-nav");
    await expect(sidebar.getByText("Dashboard", { exact: true })).toBeVisible();
    await expect(sidebar.getByText("Dashboards")).toBeVisible();
    await expect(sidebar.getByText("Alerts")).toBeVisible();
  });

  test("navigate to Dashboards page", async ({ page }) => {
    await page.goto(BASE);
    await page.locator(".sidebar-nav").getByText("Dashboards").click();
    await expect(page).toHaveURL(/\/dashboards/);
    await expect(page.locator("h3")).toContainText("Dashboards");
  });

  test("navigate to Alerts page", async ({ page }) => {
    await page.goto(BASE);
    await page.locator(".sidebar-nav").getByText("Alerts").click();
    await expect(page).toHaveURL(/\/alerts/);
    await expect(page.locator("h3")).toContainText("Alerts");
  });

  test("health endpoint returns 200", async ({ request }) => {
    const response = await request.get(`${BASE}/health`);
    expect(response.ok()).toBeTruthy();
  });
});
