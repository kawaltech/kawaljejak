import type { Locator } from "@playwright/test";
import type { Candidate, CandidateDetails } from "e2e/models/candidates";

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

export const extractCandidateFromRow = async (
  row: Locator,
): Promise<Candidate> => {
  const cells = row.locator("td");
  const allInnerTexts = await cells.allInnerTexts();
  const candidateDetails = parseCandidateDetails(allInnerTexts);

  const idInput = await cells.last().locator("#id_calon_dpr");
  const id = idInput ? parseInt(await idInput.inputValue()) : 0;

  const candidate: Candidate = { id, ...candidateDetails };

  console.debug(candidate);

  return candidate;
};
