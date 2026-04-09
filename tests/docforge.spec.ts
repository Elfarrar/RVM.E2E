import { test, expect } from "@playwright/test";

const BASE = "https://docforge.rvmtech.com.br";

/** Wait for Blazor Server to fully connect (reconnect modal gone). */
async function waitForBlazor(page: import("@playwright/test").Page) {
  await page.waitForLoadState("networkidle");
  await page.waitForFunction(
    () => {
      const modal = document.getElementById("components-reconnect-modal");
      return !modal || modal.style.display === "none" || !modal.classList.contains("components-reconnect-show");
    },
    { timeout: 15_000 }
  ).catch(() => {});
}

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
    await waitForBlazor(page);
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
    await waitForBlazor(page);
    await page.locator(".toolbar .btn-primary").click();

    await expect(page.locator(".form-card")).toBeVisible();
    await expect(page.locator(".form-card h3")).toContainText("New Project");

    const toggle = page.locator(".form-card .source-toggle");
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
    await waitForBlazor(page);
    await page.locator(".toolbar .btn-primary").click();
    await expect(page.locator(".form-card")).toBeVisible();

    // Click Git Repository toggle
    await page
      .locator(".form-card .toggle-btn", { hasText: "Git Repository" })
      .click();

    await expect(
      page.locator('.form-input[placeholder*="github.com"]')
    ).toBeVisible();
  });

  test("navigate to Documents page", async ({ page }) => {
    await page.goto(BASE);
    await waitForBlazor(page);
    await page.locator(".nav-list").getByText("Documents").click();
    await expect(page).toHaveURL(/\/documents/);
    await expect(page.locator("h1")).toContainText("Documents");
  });

  test("health endpoint returns 200", async ({ request }) => {
    const response = await request.get(`${BASE}/health`);
    expect(response.status()).toBe(200);
  });
});
