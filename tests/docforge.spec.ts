import { test, expect } from "@playwright/test";

const BASE = "https://docforge.rvmtech.com.br";

test.describe("RVM.DocForge", () => {
  test("dashboard loads with layout", async ({ page }) => {
    await page.goto(BASE);
    await expect(page.locator(".sidebar-header h2")).toHaveText("RVM.DocForge");
    await expect(page.locator("h1")).toContainText("Dashboard");
  });

  test("dashboard shows stat cards", async ({ page }) => {
    await page.goto(BASE);
    await expect(page.locator(".stats-grid")).toBeVisible();
    await expect(page.locator(".stat-card")).toHaveCount(4);
    await expect(page.locator(".stat-label").nth(0)).toContainText("Projects");
    await expect(page.locator(".stat-label").nth(1)).toContainText(
      "Snapshots"
    );
    await expect(page.locator(".stat-label").nth(2)).toContainText(
      "Documents"
    );
    await expect(page.locator(".stat-label").nth(3)).toContainText(
      "Latest Analysis"
    );
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
    await expect(page.locator("h1")).toContainText("Projects");
  });

  test("projects page has new project button", async ({ page }) => {
    await page.goto(`${BASE}/projects`);
    const btn = page.locator(".toolbar .btn-primary");
    await expect(btn).toBeVisible();
    await expect(btn).toContainText("New Project");
  });

  test("new project form shows source toggle", async ({ page }) => {
    await page.goto(`${BASE}/projects`);
    await page.locator(".toolbar .btn-primary").click();

    await expect(page.locator(".form-card")).toBeVisible();
    await expect(page.locator(".form-card h3")).toContainText("New Project");

    const toggle = page.locator(".source-toggle");
    await expect(toggle).toBeVisible();
    await expect(toggle.locator(".toggle-btn").nth(0)).toContainText(
      "Local Path"
    );
    await expect(toggle.locator(".toggle-btn").nth(1)).toContainText(
      "Git Repository"
    );
  });

  test("git repository mode shows URL input", async ({ page }) => {
    await page.goto(`${BASE}/projects`);
    await page.locator(".toolbar .btn-primary").click();

    // Click Git Repository toggle
    await page.locator(".toggle-btn", { hasText: "Git Repository" }).click();

    await expect(
      page.locator('input[placeholder*="github.com"]')
    ).toBeVisible();
  });

  test("navigate to Documents page", async ({ page }) => {
    await page.goto(BASE);
    await page.locator(".nav-list").getByText("Documents").click();
    await expect(page).toHaveURL(/\/documents/);
    await expect(page.locator("h1")).toContainText("Documents");
  });

  test("health endpoint returns 200", async ({ request }) => {
    const response = await request.get(`${BASE}/health`);
    expect(response.ok()).toBeTruthy();
  });
});
