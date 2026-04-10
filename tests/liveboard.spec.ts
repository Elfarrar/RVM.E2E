import { test, expect } from "@playwright/test";

const BASE = "https://liveboard.portfolio.rvmtech.com.br";

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

test.describe("RVM.LiveBoard", () => {
  test("dashboard loads with layout", async ({ page }) => {
    await page.goto(BASE);
    await expect(page.locator(".sidebar-header")).toContainText("RVM.LiveBoard");
    await expect(page.locator(".page-body h3")).toContainText("Dashboard");
  });

  test("dashboard shows stat cards", async ({ page }) => {
    await page.goto(BASE);
    await expect(page.locator(".stats-grid")).toBeVisible();
    await expect(page.locator(".stat-card")).toHaveCount(3);
    await expect(page.locator(".stat-label").nth(0)).toContainText("Dashboards");
    await expect(page.locator(".stat-label").nth(1)).toContainText("Alerts");
    await expect(page.locator(".stat-label").nth(2)).toContainText("Metric");
  });

  test("sidebar has all nav links", async ({ page }) => {
    await page.goto(BASE);
    const nav = page.locator(".sidebar-nav");
    await expect(nav.locator("a", { hasText: "Dashboard" }).first()).toBeVisible();
    await expect(nav.getByText("Dashboards")).toBeVisible();
    await expect(nav.getByText("Alerts")).toBeVisible();
  });

  test("navigate to Dashboards page", async ({ page }) => {
    await page.goto(BASE);
    await waitForBlazor(page);
    await page.locator(".sidebar-nav a", { hasText: "Dashboards" }).click();
    await expect(page).toHaveURL(/\/dashboards/);
    await expect(page.locator(".page-body h3")).toContainText("Dashboards");
  });

  test("navigate to Alerts page", async ({ page }) => {
    await page.goto(BASE);
    await waitForBlazor(page);
    await page.locator(".sidebar-nav a", { hasText: "Alerts" }).click();
    await expect(page).toHaveURL(/\/alerts/);
    await expect(page.locator(".page-body h3")).toContainText("Alerts");
  });

  test("health endpoint returns 200", async ({ request }) => {
    const response = await request.get(`${BASE}/health`);
    expect(response.ok()).toBeTruthy();
  });
});
