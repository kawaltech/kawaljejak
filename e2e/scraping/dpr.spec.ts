import { expect, test } from "@playwright/test";
import type { Dapils } from "e2e/models/dapils";
import {
  createDapilExtractor,
  parseCandidateDetails,
} from "e2e/utils/extractors";
import { readFixture, writeHtml } from "e2e/utils/fixtures";

test.describe.configure({ mode: "parallel" });

test(
  "fetch candidates from ACEH I dapil",
  createDapilExtractor({
    id: 1101,
    name: "ACEH I",
  }),
);

test(
  "fetch candidates from ACEH II dapil",
  createDapilExtractor({
    id: 1102,
    name: "ACEH II",
  }),
);

test(
  "fetch candidates from SUMATERA UTARA I dapil",
  createDapilExtractor({
    id: 1201,
    name: "SUMATERA UTARA I",
  }),
);

test("fetch candidate details", async ({ page }) => {
  await page.goto("https://infopemilu.kpu.go.id/Pemilu/Dct_dpr");

  await expect(page).toHaveTitle("Portal Publikasi Pemilu dan Pemilihan");
  await expect(
    page.locator("b").filter({ hasText: "DAFTAR CALON TETAP DPR" }),
  ).toBeVisible();

  await page.getByRole("textbox", { name: /pilih dapil/i }).click();

  const dapils = JSON.parse(await readFixture(`dapils.json`)) as Dapils;
  const dapil = dapils.dpr[0];

  await page.getByRole("option", { name: dapil.name, exact: true }).click();

  await page
    .getByRole("cell", { name: "Harap Pilih Dapil Terlebih" })
    .waitFor({ state: "hidden", timeout: 60_000 });

  const rows = page.locator("tr");
  // TODO: traverse all rows

  const fields = rows.nth(1).locator("td");
  const allInnerTexts = await fields.allInnerTexts();
  const { party, number, name } = parseCandidateDetails(allInnerTexts);

  await fields.last().getByRole("button").click();
  await expect(
    page.getByRole("heading", { name: "PROFIL CALON" }),
  ).toBeVisible();

  await expect(page.getByRole("cell", { name })).toBeVisible();

  const html = await page.locator("[class='card']").innerHTML();

  // TODO: Move the HTML file location to the build assets
  await writeHtml(`dpr/${dapil.name}_${party}_${number}_${name}.html`, html);

  // TODO: Render the HTML file with custom CSS
});
