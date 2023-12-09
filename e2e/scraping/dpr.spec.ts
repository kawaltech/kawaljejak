import { expect, test } from "@playwright/test";
import type { Dapils } from "e2e/models/dapils";
import { readFixture } from "e2e/utils/fixtures";

test("has title", async ({ page }) => {
  await page.goto("https://infopemilu.kpu.go.id/Pemilu/Dct_dpr");

  await expect(page).toHaveTitle("Portal Publikasi Pemilu dan Pemilihan");
  await expect(
    page.locator("b").filter({ hasText: "DAFTAR CALON TETAP DPR" }),
  ).toBeVisible();

  await page.getByRole("textbox", { name: /pilih dapil/i }).click();

  const dapils = JSON.parse(await readFixture(`dapils.json`)) as Dapils;
  // TODO: traverse all dapils

  const dapil = dapils.dpr[0];

  await page.getByRole("option", { name: dapil.name, exact: true }).click();

  await page
    .getByRole("cell", { name: "Harap Pilih Dapil Terlebih" })
    .waitFor({ state: "hidden", timeout: 60_000 });

  const rows = page.locator("tr");
  // TODO: traverse all rows

  const headers = rows.first().locator("td");
  const headerTexts = [];
  for (let i = 0; i < (await headers.count()); i++) {
    const textContent = await headers.nth(i).textContent();
    headerTexts.push(textContent);
    console.log(i, textContent);
  }

  const fields = rows.nth(1).locator("td");

  const textContents = [];
  for (let i = 0; i < (await fields.count()); i++) {
    const textContent = await fields.nth(i).textContent();
    textContents.push(textContent);
    console.log(i, textContent);
  }

  const party = await fields.nth(0).textContent();
  const number = parseInt(
    (await fields.nth(2).textContent())?.substring(10) ?? "0",
  );
  const name = await fields.nth(4).textContent();
  const gender = await fields.nth(5).textContent();
  const address = await fields.nth(6).textContent();

  console.debug({ party, number, name, gender, address });
});
