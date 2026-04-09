import { test, expect } from "@playwright/test";

const BASE = "https://codelens.rvmtech.com.br";

test.describe("RVM.CodeLens", () => {
  test("home page loads", async ({ page }) => {
    await page.goto(BASE);
    await expect(page.locator("h1")).toContainText("RVM.CodeLens");
    await expect(page.locator(".subtitle")).toContainText("Analyze your .NET solution");
  });

  test("has solution path input and analyze button", async ({ page }) => {
    await page.goto(BASE);
    await expect(page.locator(".input-path")).toBeVisible();
    await expect(page.locator(".btn-analyze")).toBeVisible();
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
    await page.locator(".sidebar").getByText("Dashboard").click();
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("navigate to Metrics page", async ({ page }) => {
    await page.goto(BASE);
    await page.locator(".sidebar").getByText("Metrics").click();
    await expect(page).toHaveURL(/\/metrics/);
  });

  test("navigate to Architecture page", async ({ page }) => {
    await page.goto(BASE);
    await page.locator(".sidebar").getByText("Architecture").click();
    await expect(page).toHaveURL(/\/architecture/);
  });

  test("health endpoint returns 200", async ({ request }) => {
    const response = await request.get(`${BASE}/health`);
    expect(response.status()).toBe(200);
  });
});
