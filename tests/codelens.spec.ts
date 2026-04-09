import { test, expect } from "@playwright/test";

const BASE = "https://codelens.rvmtech.com.br";

/** Wait for Blazor Server to connect (interactive mode ready). */
async function waitForBlazor(page: import("@playwright/test").Page) {
  await page.waitForLoadState("networkidle");
  await page.waitForFunction(
    () => document.querySelector("[data-server-rendered]") === null,
    { timeout: 10_000 }
  ).catch(() => {});
}

test.describe("RVM.CodeLens", () => {
  test("home page loads", async ({ page }) => {
    await page.goto(BASE);
    await expect(page.locator("h1")).toContainText("RVM.CodeLens");
    await expect(page.locator(".subtitle")).toContainText(
      "Analyze your .NET solution"
    );
  });

  test("has source toggle with Local Path and Git Repository", async ({
    page,
  }) => {
    await page.goto(BASE);
    const toggle = page.locator(".source-toggle");
    await expect(toggle).toBeVisible();
    await expect(toggle.locator(".toggle-btn").nth(0)).toContainText(
      "Local Path"
    );
    await expect(toggle.locator(".toggle-btn").nth(1)).toContainText(
      "Git Repository"
    );
  });

  test("local path mode shows solution input and analyze button", async ({
    page,
  }) => {
    await page.goto(BASE);
    await expect(page.locator(".input-path")).toBeVisible();
    await expect(page.locator(".btn-analyze")).toBeVisible();
    await expect(page.locator(".btn-analyze")).toContainText("Analyze");
  });

  test("git repository mode shows URL input and clone button", async ({
    page,
  }) => {
    await page.goto(BASE);
    await waitForBlazor(page);
    // Click Git Repository toggle
    await page.locator(".toggle-btn", { hasText: "Git Repository" }).click();

    await expect(
      page.locator('input[placeholder*="github.com"]')
    ).toBeVisible();
    await expect(page.locator(".btn-analyze")).toContainText("Clone & Analyze");
  });

  test("sidebar has all nav links", async ({ page }) => {
    await page.goto(BASE);
    const sidebar = page.locator(".sidebar");
    await expect(sidebar.locator("h2")).toContainText("RVM.CodeLens");
    await expect(sidebar.getByText("Home")).toBeVisible();
    await expect(sidebar.getByText("Dashboard")).toBeVisible();
    await expect(sidebar.getByText("Dependencies")).toBeVisible();
    await expect(sidebar.getByText("Metrics")).toBeVisible();
    await expect(sidebar.getByText("Hot Spots")).toBeVisible();
    await expect(sidebar.getByText("Architecture")).toBeVisible();
  });

  test("navigate to Dashboard page", async ({ page }) => {
    await page.goto(BASE);
    await waitForBlazor(page);
    await page.locator(".sidebar").getByText("Dashboard").click();
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("navigate to Metrics page", async ({ page }) => {
    await page.goto(BASE);
    await waitForBlazor(page);
    await page.locator(".sidebar").getByText("Metrics").click();
    await expect(page).toHaveURL(/\/metrics/);
  });

  test("navigate to Architecture page", async ({ page }) => {
    await page.goto(BASE);
    await waitForBlazor(page);
    await page.locator(".sidebar").getByText("Architecture").click();
    await expect(page).toHaveURL(/\/architecture/);
  });

  test("health endpoint returns 200", async ({ request }) => {
    const response = await request.get(`${BASE}/health`);
    expect(response.status()).toBe(200);
  });
});
