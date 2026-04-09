import { test, expect } from "@playwright/test";

const BASE = "https://menunamao.rvmtech.com.br";

test.describe("RVM.MenuNaMao", () => {
  test("root redirects to /admin", async ({ page }) => {
    await page.goto(BASE);
    await expect(page).toHaveURL(/\/admin/);
  });

  test("admin dashboard loads with layout", async ({ page }) => {
    await page.goto(`${BASE}/admin`);
    await expect(page.locator(".sidebar-brand")).toContainText("RVM.MenuNaMao");
    await expect(page.locator(".sidebar")).toBeVisible();
    await expect(page.locator(".main-content")).toBeVisible();
  });

  test("dashboard shows stat cards", async ({ page }) => {
    await page.goto(`${BASE}/admin`);
    await expect(page.locator(".stats-grid")).toBeVisible();
    const cards = page.locator(".stat-card");
    await expect(cards).toHaveCount(4);
  });

  test("sidebar has all nav links", async ({ page }) => {
    await page.goto(`${BASE}/admin`);
    const sidebar = page.locator(".sidebar");
    await expect(sidebar.getByText("Dashboard")).toBeVisible();
    await expect(sidebar.getByText("Pedidos")).toBeVisible();
    await expect(sidebar.getByText("Mesas")).toBeVisible();
    await expect(sidebar.getByText("Estoque")).toBeVisible();
  });

  test("navigate to Pedidos page", async ({ page }) => {
    await page.goto(`${BASE}/admin`);
    await page.locator(".sidebar").getByText("Pedidos").click();
    await expect(page).toHaveURL(/\/admin\/orders/);
  });

  test("navigate to Mesas page", async ({ page }) => {
    await page.goto(`${BASE}/admin`);
    await page.locator(".sidebar").getByText("Mesas").click();
    await expect(page).toHaveURL(/\/admin\/tables/);
  });

  test("navigate to Estoque page", async ({ page }) => {
    await page.goto(`${BASE}/admin`);
    await page.locator(".sidebar").getByText("Estoque").click();
    await expect(page).toHaveURL(/\/admin\/stock/);
  });

  test("health endpoint returns 200", async ({ request }) => {
    const response = await request.get(`${BASE}/health`);
    expect(response.status()).toBe(200);
  });
});
