import { expect, type Locator, type Page } from "@playwright/test";
import type { Candidate, CandidateDetails } from "e2e/models/candidates";
import type { Dapil } from "e2e/models/dapils";
import { getPartyNumber } from "e2e/models/parties";
import type { Directory, Url } from "./constants";
import { getCandidateFilename, getDapilFilename } from "./filenames";
import { findFile, writeHTML, writeJSON } from "./fixtures";

const trim = (text: string) => text.trim().replace(/\s+/g, " ");

/**
 * Parse candidate's inner texts into a candidate object
 * @param innerTexts candidate's inner texts
 */
const parseCandidateDetails = (innerTexts: string[]): CandidateDetails => {
  const party = trim(innerTexts[0]);
  const number = parseInt(innerTexts[2].split("\n").pop() ?? "0");
  const name = innerTexts[4];
  const gender = innerTexts[5];
  const address = innerTexts[6];

  return { party, number, name, gender, address };
};

const createExtractCandidateDetailsFromRow =
  ({ withPartyNumber = false }: { withPartyNumber?: boolean } = {}) =>
  async (row: Locator): Promise<CandidateDetails | Candidate> => {
    const cells = row.locator("td");
    const allInnerTexts = await cells.allInnerTexts();
    const candidateDetails = parseCandidateDetails(allInnerTexts);

    // FIXME: Somehow, the ID is not always available in the table
    // const idInput = await cells.last().locator("#id_calon_dpr");
    // const id = idInput ? parseInt(await idInput.inputValue()) : 0;
    // const candidate: Candidate = { id, ...candidateDetails };
    // console.debug(candidate);

    if (withPartyNumber) {
      const partyNumber = getPartyNumber(candidateDetails.party);
      return { partyNumber, ...candidateDetails };
    }

    return candidateDetails;
  };

export const findCandidateRowsForDapil = async ({
  page,
  url,
  dapil,
}: {
  page: Page;
  url: Url;
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
    withPartyNumber = false,
  }: {
    url: Url;
    dapil: Dapil;
    directory: Directory;
    withPartyNumber?: boolean;
  }) =>
  async ({ page }: { page: Page }) => {
    const filename = getDapilFilename({ directory, dapil });
    if (findFile(filename)) {
      console.debug(`ℹ️ ${filename} exists, skipping.`);
      return;
    }

    const rows = await findCandidateRowsForDapil({ page, url, dapil });
    const allRows = await rows.all();
    const allRowsWithoutHeader = allRows.slice(1);

    const extractCandidateDetailsFromRow = createExtractCandidateDetailsFromRow(
      { withPartyNumber },
    );
    const candidates = await Promise.all(
      allRowsWithoutHeader.map(extractCandidateDetailsFromRow),
    );

    writeJSON(filename, {
      ...dapil,
      candidates,
    });
    console.debug(`✅ Writing to ${filename}`);
  };

export const createCandidateDetailsExtractor =
  ({
    url,
    dapil,
    directory,
    index,
    candidate,
  }: {
    url: Url;
    dapil: Dapil;
    directory: Directory;
    index: number;
    candidate: CandidateDetails;
  }) =>
  async ({ page }: { page: Page }) => {
    const rows = await findCandidateRowsForDapil({
      page,
      url,
      dapil,
    });

    const action = rows
      .nth(index + 1)
      .locator("td")
      .last();
    if (await action.getByRole("link").isVisible({ timeout: 1000 })) {
      const closedCandidateFilename = getCandidateFilename({
        directory,
        dapil,
        candidate,
        extension: "json",
      });
      console.debug(
        `❌ Candidate's profile is not open, storing ${closedCandidateFilename} instead.`,
      );
      await writeJSON(closedCandidateFilename, {});
      return;
    }

    await action.getByRole("button").click();
    await expect(
      page.getByRole("heading", { name: "PROFIL CALON" }),
    ).toBeVisible();

    const { name } = candidate;
    await expect(page.getByRole("cell", { name })).toBeVisible();

    const html = await page.locator("[class='card']").innerHTML();

    const filename = getCandidateFilename({ directory, dapil, candidate });
    console.debug(`✅ Writing to ${filename}`);
    await writeHTML(filename, html);
  };
