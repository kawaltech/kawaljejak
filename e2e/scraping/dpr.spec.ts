import { expect, test } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("https://infopemilu.kpu.go.id/Pemilu/Dct_dpr");

  await expect(page).toHaveTitle("Portal Publikasi Pemilu dan Pemilihan");
  await expect(
    page.locator("b").filter({ hasText: "DAFTAR CALON TETAP DPR" }),
  ).toBeVisible();
});
