import { test } from "@playwright/test";
import type { CandidateDetails } from "e2e/models/candidates";
import {
  createCandidateDetailsExtractor,
  createDapilExtractor,
} from "e2e/utils/extractors";
import dpr from "../fixtures/dpr.json" assert { type: "json" };
import ACEH_II from "../fixtures/dpr/1102_ACEH II.json" assert { type: "json" };

test.describe.configure({ mode: "parallel" });

dpr.forEach((dapil) => {
  test(
    `fetch DPR candidates from ${dapil.name} dapil`,
    createDapilExtractor({
      dapil,
      directory: "dpr",
      url: "https://infopemilu.kpu.go.id/Pemilu/Dct_dpr",
    }),
  );
});

// TODO: import dapil files dynamically from fixtures/dpr/*.json
const { candidates } = ACEH_II;

candidates.forEach((candidate: CandidateDetails, index: number) => {
  test(
    `fetch DPR dapil ${"ACEH II"} candidate details for ${candidate.name}`,
    createCandidateDetailsExtractor({
      dapil: {
        id: 1102,
        name: "ACEH II",
      },
      directory: "dpr",
      url: "https://infopemilu.kpu.go.id/Pemilu/Dct_dpr",
      index,
      candidate,
    }),
  );
});
