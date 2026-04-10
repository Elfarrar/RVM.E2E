import { test, expect } from "@playwright/test";

const BASE = "https://authforge.portfolio.rvmtech.com.br";

test.describe("RVM.AuthForge", () => {
  test("root redirects to /admin", async ({ page }) => {
    await page.goto(BASE);
    await expect(page).toHaveURL(/\/admin/);
  });

  test("admin dashboard loads with layout", async ({ page }) => {
    await page.goto(`${BASE}/admin`);
    await expect(page.locator(".sidebar-header h2")).toHaveText("RVM.AuthForge");
    await expect(page.locator(".sidebar")).toBeVisible();
    await expect(page.locator(".main-content")).toBeVisible();
  });

  test("sidebar has all nav links", async ({ page }) => {
    await page.goto(`${BASE}/admin`);
    const nav = page.locator(".nav-list");
    await expect(nav.getByText("Dashboard")).toBeVisible();
    await expect(nav.getByText("Users")).toBeVisible();
    await expect(nav.getByText("Roles")).toBeVisible();
    await expect(nav.getByText("OAuth Clients")).toBeVisible();
    await expect(nav.getByText("API Keys")).toBeVisible();
    await expect(nav.getByText("Audit Log")).toBeVisible();
  });

  test("navigate to Users page", async ({ page }) => {
    await page.goto(`${BASE}/admin`);
    await page.locator(".nav-list").getByText("Users").click();
    await expect(page).toHaveURL(/\/admin\/users/);
    await expect(page.locator("h1")).toContainText("Users");
  });

  test("navigate to Roles page", async ({ page }) => {
    await page.goto(`${BASE}/admin`);
    await page.locator(".nav-list").getByText("Roles").click();
    await expect(page).toHaveURL(/\/admin\/roles/);
    await expect(page.locator("h1")).toContainText("Roles");
  });

  test("navigate to OAuth Clients page", async ({ page }) => {
    await page.goto(`${BASE}/admin`);
    await page.locator(".nav-list").getByText("OAuth Clients").click();
    await expect(page).toHaveURL(/\/admin\/clients/);
  });

  test("navigate to Audit Log page", async ({ page }) => {
    await page.goto(`${BASE}/admin`);
    await page.locator(".nav-list").getByText("Audit Log").click();
    await expect(page).toHaveURL(/\/admin\/audit/);
  });

  test("health endpoint returns 200", async ({ request }) => {
    const response = await request.get(`${BASE}/health`);
    expect(response.ok()).toBeTruthy();
  });
});
