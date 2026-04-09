import { test, expect } from "@playwright/test";

const BASE = "https://logstream.rvmtech.com.br";

test.describe("RVM.LogStream", () => {
  test("dashboard loads with layout", async ({ page }) => {
    await page.goto(BASE);
    await expect(page.locator(".sidebar-header h2")).toHaveText("RVM.LogStream");
    await expect(page.locator("h1")).toContainText("Dashboard");
  });

  test("dashboard shows stat cards", async ({ page }) => {
    await page.goto(BASE);
    await expect(page.locator(".stats-grid")).toBeVisible();
    await expect(page.locator(".stat-card")).toHaveCount(2);
    await expect(page.locator(".stat-label").nth(0)).toContainText("Total Sources");
    await expect(page.locator(".stat-label").nth(1)).toContainText("Total Log Entries");
  });

  test("sidebar has all nav links", async ({ page }) => {
    await page.goto(BASE);
    const nav = page.locator(".nav-list");
    await expect(nav.getByText("Dashboard")).toBeVisible();
    await expect(nav.getByText("Log Search")).toBeVisible();
    await expect(nav.getByText("Sources")).toBeVisible();
    await expect(nav.getByText("Retention")).toBeVisible();
  });

  test("navigate to Log Search page", async ({ page }) => {
    await page.goto(BASE);
    await page.locator(".nav-list").getByText("Log Search").click();
    await expect(page).toHaveURL(/\/search/);
    await expect(page.locator("h1")).toContainText("Log Search");
  });

  test("navigate to Sources page", async ({ page }) => {
    await page.goto(BASE);
    await page.locator(".nav-list").getByText("Sources", { exact: true }).click();
    await expect(page).toHaveURL(/\/sources/);
    await expect(page.locator("h1")).toContainText("Sources");
  });

  test("navigate to Retention page", async ({ page }) => {
    await page.goto(BASE);
    await page.locator(".nav-list").getByText("Retention").click();
    await expect(page).toHaveURL(/\/retention/);
    await expect(page.locator("h1")).toContainText("Retention Policies");
  });

  test("health endpoint returns 200", async ({ request }) => {
    const response = await request.get(`${BASE}/health`);
    expect(response.ok()).toBeTruthy();
  });
});
