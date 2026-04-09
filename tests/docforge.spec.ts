import { test, expect } from "@playwright/test";

const BASE = "https://docforge.rvmtech.com.br";

test.describe("RVM.DocForge", () => {
  test("dashboard loads with layout", async ({ page }) => {
    await page.goto(BASE);
    await expect(page.locator(".sidebar-header h2")).toHaveText("RVM.DocForge");
    await expect(page.locator("h3")).toContainText("Dashboard");
  });

  test("dashboard shows stat cards", async ({ page }) => {
    await page.goto(BASE);
    await expect(page.locator(".stats-grid")).toBeVisible();
    await expect(page.locator(".stat-card")).toHaveCount(3);
    await expect(page.locator(".stat-label").nth(0)).toContainText("Projects");
    await expect(page.locator(".stat-label").nth(1)).toContainText("Snapshots");
    await expect(page.locator(".stat-label").nth(2)).toContainText("Documents");
  });

  test("sidebar has all nav links", async ({ page }) => {
    await page.goto(BASE);
    const nav = page.locator(".nav-list");
    await expect(nav.getByText("Dashboard")).toBeVisible();
    await expect(nav.getByText("Projects")).toBeVisible();
    await expect(nav.getByText("Documents")).toBeVisible();
  });

  test("navigate to Projects page", async ({ page }) => {
    await page.goto(BASE);
    await page.locator(".nav-list").getByText("Projects").click();
    await expect(page).toHaveURL(/\/projects/);
    await expect(page.locator("h3")).toContainText("Projects");
  });

  test("navigate to Documents page", async ({ page }) => {
    await page.goto(BASE);
    await page.locator(".nav-list").getByText("Documents").click();
    await expect(page).toHaveURL(/\/documents/);
    await expect(page.locator("h3")).toContainText("Documents");
  });

  test("health endpoint returns 200", async ({ request }) => {
    const response = await request.get(`${BASE}/health`);
    expect(response.status()).toBe(200);
  });
});
