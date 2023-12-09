import { expect, test } from "@playwright/test";
import type { Dapils } from "e2e/models/dapils";
import { nthExtractor } from "e2e/utils/extractors";
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

  const fields = rows.nth(1).locator("td");

  const textContents = [];
  for (let i = 0; i < (await fields.count()); i++) {
    const textContent = await fields.nth(i).textContent();
    textContents.push(textContent);
    console.log(i, textContent);
  }

  const fieldExtractor = nthExtractor(fields);

  const party = await fieldExtractor(0);
  const number = parseInt((await fieldExtractor(2))?.substring(10) ?? "0");
  const name = await fieldExtractor(4);
  const gender = await fieldExtractor(5);
  const address = await fieldExtractor(6);

  console.debug({ party, number, name, gender, address });
});
