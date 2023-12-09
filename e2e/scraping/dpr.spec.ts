import { expect, test } from "@playwright/test";
import type { Dapils } from "e2e/models/dapils";
import { nthExtractor } from "e2e/utils/extractors";
import { readFixture, writeHtml } from "e2e/utils/fixtures";

test("fetch candidates", async ({ page }) => {
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

  const id = parseInt(
    await fields.last().locator("#id_calon_dpr").inputValue(),
  );
  const party = await fieldExtractor(0);
  const number = parseInt((await fieldExtractor(2))?.substring(10));
  const name = await fieldExtractor(4);
  const gender = await fieldExtractor(5);
  const address = await fieldExtractor(6);

  console.debug({ id, party, number, name, gender, address });
  // TODO: Store data
  // TODO: Fetch and store images

  await fields.last().getByRole("button").click();

  await expect(
    page.getByRole("heading", { name: "PROFIL CALON" }),
  ).toBeVisible();

  await expect(page.getByRole("cell", { name })).toBeVisible();
});

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
  const fieldExtractor = nthExtractor(fields);
  const name = await fieldExtractor(4);
  await fields.last().getByRole("button").click();

  await expect(
    page.getByRole("heading", { name: "PROFIL CALON" }),
  ).toBeVisible();

  await expect(page.getByRole("cell", { name })).toBeVisible();

  const html = await page.locator("[class='card']").innerHTML();

  await writeHtml(`dpr/${name}.html`, html);
  // TODO: Store data as HTML file
  // TODO: Render the HTML file with the image and custom CSS
});
