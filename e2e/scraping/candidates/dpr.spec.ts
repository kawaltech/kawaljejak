import { test } from "@playwright/test";
import type { CandidateDetails } from "e2e/models/candidates";
import type { DapilWithCandidates } from "e2e/models/dapils";
import { DIRECTORIES, URLS } from "e2e/utils/constants";
import { createCandidateDetailsExtractor } from "e2e/utils/extractors";
import {
  getCandidateFilename,
  getClosedCandidateFilename,
  getDapilFilename,
} from "e2e/utils/filenames";
import { findFile, readJSON, writeJSON } from "e2e/utils/fixtures";
import dpr from "../../fixtures/dpr.json" assert { type: "json" };

test.describe.configure({ mode: "parallel" });

const directory = DIRECTORIES.DPR;

dpr.forEach(({ id, name }) => {
  const dapil = readJSON<DapilWithCandidates>(
    getDapilFilename({ directory, dapil: { id, name } }),
  );
  dapil.candidates.forEach((candidate: CandidateDetails, index: number) => {
    const filename = getCandidateFilename({ directory, dapil, candidate });
    const closedCandidateFilename = getClosedCandidateFilename({
      directory,
      dapil,
      candidate,
    });

    if (findFile(filename)) {
      test.skip(`skipping ${filename}`, () => {});
    } else if (findFile(closedCandidateFilename)) {
      test(`skipping ${closedCandidateFilename}`, () => {
        test.fail();
      });
    } else {
      test(
        `fetching for ${getCandidateFilename({ directory, dapil, candidate })}`,
        createCandidateDetailsExtractor({
          dapil,
          directory: "dpr",
          url: URLS.DPR,
          index,
          candidate,
        }),
      );
    }
  });
});

test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status === "timedOut") {
    const failedCandidateFilename = testInfo.title
      .replace(/^fetching for /, "")
      .replace(/html$/, "json");
    console.debug(
      `❌ Candidate's profile is open but unavailable, storing ${failedCandidateFilename} instead.`,
    );
    await writeJSON(failedCandidateFilename, { status: testInfo.status });
  }
});
