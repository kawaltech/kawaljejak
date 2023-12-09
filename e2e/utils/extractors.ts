import { expect, type Locator, type Page } from "@playwright/test";
import type { CandidateDetails } from "e2e/models/candidates";
import type { Dapil } from "e2e/models/dapils";
import { writeFixture } from "./fixtures";

export const trim = (text: string) => text.trim().replace(/\s+/g, " ");

export const nthExtractor = (locator: Locator) => async (index: number) => {
  const textContent = (await locator.nth(index).textContent()) ?? "";
  return trim(textContent);
};

/**
 * Parse candidate's inner texts into a candidate object
 * @param innerTexts candidate's inner texts
 */
export const parseCandidateDetails = (
  innerTexts: string[],
): CandidateDetails => {
  const party = trim(innerTexts[0]);
  const number = parseInt(innerTexts[2].split("\n").pop() ?? "0");
  const name = innerTexts[4];
  const gender = innerTexts[5];
  const address = innerTexts[6];

  return { party, number, name, gender, address };
};

export const extractCandidateDetailsFromRow = async (
  row: Locator,
): Promise<CandidateDetails> => {
  const cells = row.locator("td");
  const allInnerTexts = await cells.allInnerTexts();
  const candidateDetails = parseCandidateDetails(allInnerTexts);

  // FIXME: Somehow, the ID is not always available in the table
  // const idInput = await cells.last().locator("#id_calon_dpr");
  // const id = idInput ? parseInt(await idInput.inputValue()) : 0;
  // const candidate: Candidate = { id, ...candidateDetails };
  // console.debug(candidate);

  return candidateDetails;
};

export const findCandidateRowsForDapil = async ({
  page,
  url,
  dapil,
}: {
  page: Page;
  url: string;
  dapil: Dapil;
}) => {
  await page.goto(url);

  await expect(page).toHaveTitle("Portal Publikasi Pemilu dan Pemilihan");
  await page.getByRole("textbox", { name: /pilih dapil/i }).click();
  await page.getByRole("option", { name: dapil.name, exact: true }).click();

  await page
    .getByRole("cell", { name: "Harap Pilih Dapil Terlebih" })
    .waitFor({ state: "hidden", timeout: 60_000 });

  return page.locator("tr");
};

export const createDapilExtractor =
  ({
    url,
    dapil,
    directory,
  }: {
    url: string;
    dapil: Dapil;
    directory: string;
  }) =>
  async ({ page }: { page: Page }) => {
    const rows = await findCandidateRowsForDapil({ page, url, dapil });
    const allRows = await rows.all();
    const allRowsWithoutHeader = allRows.slice(1);

    const candidates = await Promise.all(
      allRowsWithoutHeader.map(extractCandidateDetailsFromRow),
    );

    const filename = `${directory}/${dapil.id}_${dapil.name}.json`;
    console.debug(`Writing candidates data to ${filename}`);

    writeFixture(`${directory}/${dapil.id}_${dapil.name}.json`, { candidates });
  };
