import { test, expect } from "@playwright/test";

const BASE = "https://mcpforge.portfolio.rvmtech.com.br";

/** Wait for Blazor Server circuit to be ready for interaction. */
async function waitForBlazor(page: import("@playwright/test").Page) {
  await page.waitForLoadState("domcontentloaded");
  await page.waitForFunction(
    () => {
      const modal = document.getElementById("components-reconnect-modal");
      return !modal || modal.style.display === "none" ||
        !modal.classList.contains("components-reconnect-show");
    },
    { timeout: 20_000 }
  ).catch(() => {});
  await page.waitForTimeout(2_000);
}

test.describe("RVM.McpForge", () => {
  test("dashboard loads with layout", async ({ page }) => {
    await page.goto(BASE);
    await expect(page.locator(".sidebar-header h2")).toHaveText("RVM.McpForge");
    await expect(page.locator(".sidebar-header .subtitle")).toContainText(
      "MCP Server Generator"
    );
  });

  test("dashboard shows stat cards", async ({ page }) => {
    await page.goto(BASE);
    await expect(page.locator(".stats-grid")).toBeVisible();
    await expect(page.locator(".stat-card")).toHaveCount(3);
    await expect(page.locator(".stat-label").nth(0)).toContainText("Projects");
    await expect(page.locator(".stat-label").nth(1)).toContainText("Analyzed");
    await expect(page.locator(".stat-label").nth(2)).toContainText("Ready");
  });

  test("sidebar has all nav links", async ({ page }) => {
    await page.goto(BASE);
    const nav = page.locator(".nav-list");
    await expect(nav.getByText("Dashboard")).toBeVisible();
    await expect(nav.getByText("Projects")).toBeVisible();
    await expect(nav.getByText("Generated Servers")).toBeVisible();
  });

  test("navigate to Projects page", async ({ page }) => {
    await page.goto(BASE);
    await waitForBlazor(page);
    await page.locator(".nav-list").getByText("Projects").click();
    await expect(page).toHaveURL(/\/projects/);
    await expect(page.locator("h2", { hasText: "Forge Projects" })).toBeVisible();
  });

  test("projects page has new project button", async ({ page }) => {
    await page.goto(`${BASE}/projects`);
    await waitForBlazor(page);
    const btn = page.locator(".toolbar .btn-primary");
    await expect(btn).toBeVisible();
    await expect(btn).toContainText("New Project");
  });

  test("new project form shows source type selector", async ({ page }) => {
    await page.goto(`${BASE}/projects`);
    await waitForBlazor(page);
    await page.locator(".toolbar .btn-primary").click();
    await expect(page.locator(".form-card")).toBeVisible();
    await expect(page.locator(".form-card h3")).toContainText("New Project");

    // Source type dropdown
    const select = page.locator(".form-card select.form-input");
    await expect(select).toBeVisible();
  });

  test("git source shows repository URL and local path fields", async ({
    page,
  }) => {
    await page.goto(`${BASE}/projects`);
    await waitForBlazor(page);
    await page.locator(".toolbar .btn-primary").click();
    await expect(page.locator(".form-card")).toBeVisible();

    // Default is Git source type
    await expect(
      page.locator('.form-card input[placeholder*="github.com"]')
    ).toBeVisible();
    await expect(
      page.locator('.form-card input[placeholder*="path"]')
    ).toBeVisible();
  });

  test("database source shows connection string fields", async ({ page }) => {
    await page.goto(`${BASE}/projects`);
    await waitForBlazor(page);
    await page.locator(".toolbar .btn-primary").click();
    await expect(page.locator(".form-card")).toBeVisible();

    // Switch to Database
    await page.locator(".form-card select.form-input").selectOption("Database");

    await expect(
      page.locator(".form-card").getByText("Connection String")
    ).toBeVisible();
    await expect(
      page.locator(".form-card").getByText("Database Name")
    ).toBeVisible();
  });

  test("navigate to Generated Servers page", async ({ page }) => {
    await page.goto(BASE);
    await waitForBlazor(page);
    await page.locator(".nav-list").getByText("Generated Servers").click();
    await expect(page).toHaveURL(/\/generated/);
  });

  test("generated page has data table", async ({ page }) => {
    await page.goto(`${BASE}/generated`);
    await waitForBlazor(page);
    await expect(page.locator(".data-table")).toBeVisible();
    const headers = page.locator(".data-table th");
    await expect(headers.nth(0)).toContainText("Server Name");
    await expect(headers.nth(1)).toContainText("Project");
    await expect(headers.nth(2)).toContainText("Tools");
    await expect(headers.nth(3)).toContainText("Resources");
  });

  test("health endpoint returns 200", async ({ request }) => {
    const response = await request.get(`${BASE}/health`);
    expect(response.ok()).toBeTruthy();
  });
});
