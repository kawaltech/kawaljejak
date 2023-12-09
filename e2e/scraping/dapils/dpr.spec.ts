import { test } from "@playwright/test";
import { createDapilExtractor } from "e2e/utils/extractors";
import dpr from "../../fixtures/dpr.json" assert { type: "json" };

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
