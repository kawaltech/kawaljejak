import { test } from "@playwright/test";
import type { CandidateDetails } from "e2e/models/candidates";
import type { DapilWithCandidates } from "e2e/models/dapils";
import { createCandidateDetailsExtractor } from "e2e/utils/extractors";
import { readJSON } from "e2e/utils/fixtures";
import dpr from "../../fixtures/dpr.json" assert { type: "json" };

test.describe.configure({ mode: "parallel" });

dpr.slice(0, 1).forEach(({ id, name }) => {
  const directory = "dpr";
  const dapil = readJSON<DapilWithCandidates>(
    `${directory}/dapils/${id}_${name}.json`,
  );
  dapil.candidates.forEach((candidate: CandidateDetails, index: number) => {
    test(
      `fetch DPR dapil ${"ACEH II"} candidate details for ${candidate.name}`,
      createCandidateDetailsExtractor({
        dapil,
        directory: "dpr",
        url: "https://infopemilu.kpu.go.id/Pemilu/Dct_dpr",
        index,
        candidate,
      }),
    );
  });
});
