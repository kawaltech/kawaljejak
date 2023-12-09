import { expect, test } from "@playwright/test";
import {
  createDapilExtractor,
  findCandidateRowsForDapil,
  parseCandidateDetails,
} from "e2e/utils/extractors";
import { writeHtml } from "e2e/utils/fixtures";
import dpr from "../fixtures/dpr.json" assert { type: "json" };

test.describe.configure({ mode: "parallel" });

dpr.forEach((dapil) => {
  test(
    `fetch DPR candidates from ${dapil.name} dapil`,
    createDapilExtractor({
      dapil,
      directory: "dpr",
      url: "https://infopemilu.kpu.go.id/Pemilu/Dct_dpr",
    }),
  );
});

test("fetch candidate details", async ({ page }) => {
  const dapil = dpr[0];

  const rows = await findCandidateRowsForDapil({
    page,
    url: "https://infopemilu.kpu.go.id/Pemilu/Dct_dpr",
    dapil,
  });

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
  const directory = "dpr";
  const filename = `${directory}/${dapil.name}_${party}_${number}_${name}.html`;
  console.debug(`Writing candidate HTML profile to ${filename}`);
  await writeHtml(filename, html);

  // TODO: Render the HTML file with custom CSS
});
