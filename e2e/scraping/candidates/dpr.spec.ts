import { test } from "@playwright/test";
import type { CandidateDetails } from "e2e/models/candidates";
import { createCandidateDetailsExtractor } from "e2e/utils/extractors";
import dapil from "../../fixtures/dpr/1201_SUMATERA UTARA I.json" assert { type: "json" };

test.describe.configure({ mode: "parallel" });

// TODO: import dapil files dynamically from fixtures/dpr/*.json
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
