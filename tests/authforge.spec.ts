import { test, expect } from "@playwright/test";

const BASE = "https://authforge.portfolio.rvmtech.com.br";

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
    await waitForBlazor(page);
    await page.locator(".nav-list").getByText("Users").click();
    await page.waitForURL(/\/admin\/users/, { timeout: 15_000 });
    await expect(page.locator("h1")).toContainText("Users", { timeout: 10_000 });
  });

  test("navigate to Roles page", async ({ page }) => {
    await page.goto(`${BASE}/admin`);
    await waitForBlazor(page);
    await page.locator(".nav-list").getByText("Roles").click();
    await page.waitForURL(/\/admin\/roles/, { timeout: 15_000 });
    await expect(page.locator("h1")).toContainText("Roles", { timeout: 10_000 });
  });

  test("navigate to OAuth Clients page", async ({ page }) => {
    await page.goto(`${BASE}/admin`);
    await waitForBlazor(page);
    await page.locator(".nav-list").getByText("OAuth Clients").click();
    await page.waitForURL(/\/admin\/clients/, { timeout: 15_000 });
  });

  test("navigate to Audit Log page", async ({ page }) => {
    await page.goto(`${BASE}/admin`);
    await waitForBlazor(page);
    await page.locator(".nav-list").getByText("Audit Log").click();
    await page.waitForURL(/\/admin\/audit/, { timeout: 15_000 });
  });

  test("health endpoint returns 200", async ({ request }) => {
    const response = await request.get(`${BASE}/health`);
    expect(response.ok()).toBeTruthy();
  });
});
