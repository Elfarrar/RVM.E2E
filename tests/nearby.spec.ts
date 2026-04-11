import { test, expect } from "@playwright/test";

const BASE = "https://nearby.lab.rvmtech.com.br";

test.describe("RVM.NearBy", () => {
  test("dashboard loads with layout", async ({ page }) => {
    await page.goto(BASE);
    await expect(page.locator(".sidebar-header h2")).toHaveText("RVM.NearBy");
    await expect(page.locator("h1")).toContainText("Dashboard");
  });

  test("dashboard shows stat cards", async ({ page }) => {
    await page.goto(BASE);
    await expect(page.locator(".stats-grid")).toBeVisible();
    await expect(page.locator(".stat-card")).toHaveCount(3);
    await expect(page.locator(".stat-label").nth(0)).toContainText("Profiles");
    await expect(page.locator(".stat-label").nth(1)).toContainText("Posts");
    await expect(page.locator(".stat-label").nth(2)).toContainText("Places");
  });

  test("sidebar has all nav links", async ({ page }) => {
    await page.goto(BASE);
    const nav = page.locator(".nav-list");
    await expect(nav.getByText("Dashboard")).toBeVisible();
    await expect(nav.getByText("Feed")).toBeVisible();
    await expect(nav.getByText("Places")).toBeVisible();
    await expect(nav.getByText("Profiles")).toBeVisible();
  });

  test("navigate to Feed page", async ({ page }) => {
    await page.goto(BASE);
    await page.locator(".nav-list").getByText("Feed").click();
    await expect(page).toHaveURL(/\/feed/);
    await expect(page.locator("h1")).toContainText("Feed");
  });

  test("navigate to Places page", async ({ page }) => {
    await page.goto(BASE);
    await page.locator(".nav-list").getByText("Places", { exact: true }).click();
    await expect(page).toHaveURL(/\/places/);
    await expect(page.locator("h1")).toContainText("Places");
  });

  test("navigate to Profiles page", async ({ page }) => {
    await page.goto(BASE);
    await page.locator(".nav-list").getByText("Profiles").click();
    await expect(page).toHaveURL(/\/profiles/);
    await expect(page.locator("h1")).toContainText("Profiles");
  });

  test("health endpoint returns 200", async ({ request }) => {
    const response = await request.get(`${BASE}/health`);
    expect(response.ok()).toBeTruthy();
  });
});
