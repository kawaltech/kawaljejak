import { test } from "@playwright/test";
import type { CandidateWithProvince } from "e2e/models/candidates";
import type { DapilWithCandidatesWithProvince } from "e2e/models/dapils";
import { DIRECTORIES, URLS } from "e2e/utils/constants";
import { createCandidateWithProvinceExtractor } from "e2e/utils/extractors";
import {
  getCandidateWithProvinceFilename,
  getDapilFilename,
} from "e2e/utils/filenames";
import { findFile, readJSON, writeJSON } from "e2e/utils/fixtures";
import dpd from "../../fixtures/dpd.json" assert { type: "json" };

test.describe.configure({ mode: "parallel" });

const directory = DIRECTORIES.DPD;
const url = URLS.DPD;

dpd.slice(0, 1).forEach(({ id, name }) => {
  const dapil = readJSON<DapilWithCandidatesWithProvince>(
    getDapilFilename({ directory, dapil: { id, name } }),
  );
  dapil.candidates
    .slice(0, 7)
    .forEach((candidate: CandidateWithProvince, index: number) => {
      const filename = getCandidateWithProvinceFilename({
        directory,
        dapil,
        candidate,
      });
      const closedCandidateFilename = getCandidateWithProvinceFilename({
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
          filename,
          createCandidateWithProvinceExtractor({
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
