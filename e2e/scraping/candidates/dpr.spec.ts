import { test } from "@playwright/test";
import type { CandidateDetails } from "e2e/models/candidates";
import type { DapilWithCandidates } from "e2e/models/dapils";
import { DIRECTORIES, URLS } from "e2e/utils/constants";
import { createCandidateDetailsExtractor } from "e2e/utils/extractors";
import { getCandidateFilename, getDapilFilename } from "e2e/utils/filenames";
import { readJSON } from "e2e/utils/fixtures";
import dpr from "../../fixtures/dpr.json" assert { type: "json" };

test.describe.configure({ mode: "parallel" });

const directory = DIRECTORIES.DPR;

dpr.forEach(({ id, name }) => {
  const dapil = readJSON<DapilWithCandidates>(
    getDapilFilename({ directory, dapil: { id, name } }),
  );
  dapil.candidates.forEach((candidate: CandidateDetails, index: number) => {
    test(
      `fetching for ${getCandidateFilename({ directory, dapil, candidate })}`,
      createCandidateDetailsExtractor({
        dapil,
        directory: "dpr",
        url: URLS.DPR,
        index,
        candidate,
        retrying: true,
      }),
    );
  });
});
