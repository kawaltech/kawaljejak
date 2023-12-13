import { expect, type Locator, type Page } from "@playwright/test";
import type {
  Candidate,
  CandidateDetails,
  CandidateWithProvince,
} from "e2e/models/candidates";
import type { Dapil } from "e2e/models/dapils";
import { getPartyNumber } from "e2e/models/parties";
import type { Directory, Url } from "./constants";
import {
  getCandidateFilename,
  getCandidateWithProvinceFilename,
  getDapilFilename,
} from "./filenames";
import { findFile, writeHTML, writeJSON } from "./fixtures";

const trim = (text: string) => text.trim().replace(/\s+/g, " ");

/**
 * Parse candidate's inner texts into a candidate with province instead of party
 * @param innerTexts candidate's inner texts
 */
const parseCandidateWithProvince = (
  innerTexts: string[],
  { dapil }: { dapil: Dapil },
): CandidateWithProvince => {
  const [, numberStr, , name, gender, address] = innerTexts;

  const province = dapil.name;
  const number = parseInt(numberStr.split("\n").pop() ?? "0");

  return { province, number, name, gender, address };
};

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
  (
    options: { withProvince: true; dapil: Dapil } | { withProvince: false } = {
      withProvince: false,
    },
  ) =>
  async (row: Locator): Promise<Candidate | CandidateWithProvince> => {
    const cells = row.locator("td");
    const allInnerTexts = await cells.allInnerTexts();

    if (options.withProvince) {
      const candidateWithProvince = parseCandidateWithProvince(allInnerTexts, {
        dapil: options.dapil,
      });
      return candidateWithProvince;
    }

    // FIXME: Somehow, the ID is not always available in the table
    // const idInput = await cells.last().locator("#id_calon_dpr");
    // const id = idInput ? parseInt(await idInput.inputValue()) : 0;
    // const candidate: Candidate = { id, ...candidateDetails };
    // console.debug(candidate);

    const candidateDetails = parseCandidateDetails(allInnerTexts);
    const partyNumber = getPartyNumber(candidateDetails.party);
    return { partyNumber, ...candidateDetails };
  };

export const findCandidateRowsForDapil = async ({
  page,
  url,
  dapil,
  withProvince = false,
}: {
  page: Page;
  url: Url;
  dapil: Dapil;
  withProvince?: boolean;
}) => {
  await page.goto(url);

  await expect(page).toHaveTitle("Portal Publikasi Pemilu dan Pemilihan");
  await page.getByRole("textbox", { name: /pilih/i }).click();
  await page.getByRole("option", { name: dapil.name, exact: true }).click();

  if (withProvince) {
    await page
      .getByRole("row", { name: dapil.alias ?? dapil.name, exact: false })
      .first()
      .waitFor({ state: "visible", timeout: 30_000 });
  } else {
    await page
      .getByRole("cell", { name: "Harap Pilih Dapil Terlebih" })
      .waitFor({ state: "hidden", timeout: 30_000 });
  }

  return page.locator("tr");
};

export const createDapilExtractor =
  ({
    url,
    dapil,
    directory,
    withProvince = false,
  }: {
    url: Url;
    dapil: Dapil;
    directory: Directory;
    withProvince?: boolean;
  }) =>
  async ({ page }: { page: Page }) => {
    const filename = getDapilFilename({ directory, dapil });
    if (findFile(filename)) {
      console.debug(`ℹ️ ${filename} exists, skipping.`);
      return;
    }

    const rows = await findCandidateRowsForDapil({
      page,
      url,
      dapil,
      withProvince,
    });
    const allRows = await rows.all();
    const allRowsWithoutHeader = allRows.slice(1);

    const extractCandidateDetailsFromRow = createExtractCandidateDetailsFromRow(
      { withProvince, dapil },
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
      await writeJSON(closedCandidateFilename, { status: "failed" });
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

export const createCandidateWithProvinceExtractor =
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
    candidate: CandidateWithProvince;
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
      const closedCandidateFilename = getCandidateWithProvinceFilename({
        directory,
        dapil,
        candidate,
        extension: "json",
      });
      console.debug(
        `❌ Candidate's profile is not open, storing ${closedCandidateFilename} instead.`,
      );
      await writeJSON(closedCandidateFilename, { status: "failed" });
      return;
    }

    await action.getByRole("button").click();
    await expect(
      page.getByRole("heading", { name: "PROFIL CALON" }),
    ).toBeVisible();

    const { name } = candidate;
    await expect(page.getByRole("cell", { name })).toBeVisible();

    const html = await page.locator("[class='card']").innerHTML();

    const filename = getCandidateWithProvinceFilename({
      directory,
      dapil,
      candidate,
    });
    console.debug(`✅ Writing to ${filename}`);
    await writeHTML(filename, html);
  };
