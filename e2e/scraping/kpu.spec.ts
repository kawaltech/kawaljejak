import { expect, test } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("https://infopemilu.kpu.go.id/Pemilu/Dct_dpr");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle("Portal Publikasi Pemilu dan Pemilihan");
});
