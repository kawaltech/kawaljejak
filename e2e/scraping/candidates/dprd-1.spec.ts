import { test } from "@playwright/test";
import type { CandidateDetails } from "e2e/models/candidates";
import type { DapilWithCandidates } from "e2e/models/dapils";
import { DIRECTORIES, URLS } from "e2e/utils/constants";
import { createCandidateDetailsExtractor } from "e2e/utils/extractors";
import { getCandidateFilename, getDapilFilename } from "e2e/utils/filenames";
import { findFile, readJSON, writeJSON } from "e2e/utils/fixtures";
import dprd1 from "../../fixtures/dprd-1.json" assert { type: "json" };

test.describe.configure({ mode: "parallel" });

const directory = DIRECTORIES.DPRD_1;
const url = URLS.DPRD_1;

dprd1.slice(0, 1).forEach(({ id, name }) => {
  const dapil = readJSON<DapilWithCandidates>(
    getDapilFilename({ directory, dapil: { id, name } }),
  );
  dapil.candidates
    .slice(0, 1)
    .forEach((candidate: CandidateDetails, index: number) => {
      const filename = getCandidateFilename({ directory, dapil, candidate });
      const closedCandidateFilename = getCandidateFilename({
        directory,
        dapil,
        candidate,
        extension: "json",
      });

      if (findFile(filename)) {
        test.skip(`skipping ${filename}`, () => {});
      } else if (findFile(closedCandidateFilename)) {
        test(`skipping ${closedCandidateFilename}`, () => {
          test.fail();
        });
      } else {
        test(
          `${getCandidateFilename({
            directory,
            dapil,
            candidate,
          })}`,
          createCandidateDetailsExtractor({
            dapil,
            directory,
            url,
            index,
            candidate,
          }),
        );
      }
    });
});

test.afterEach(async ({ page }, { title, status }) => {
  const closedCandidateFilename = title.replace(/html$/, "json");
  if (status === "timedOut") {
    console.debug(
      `❌ Candidate's profile is open but unavailable, storing ${closedCandidateFilename} instead.`,
    );
    await writeJSON(closedCandidateFilename, { status });
  }
});
