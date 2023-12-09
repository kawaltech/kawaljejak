import { test } from "@playwright/test";
import { createDapilExtractor } from "e2e/utils/extractors";
import { getDapilFilename } from "e2e/utils/filenames";
import dpr from "../../fixtures/dpr.json" assert { type: "json" };

test.describe.configure({ mode: "parallel" });

const directory = "dpr";

dpr.forEach((dapil) => {
  test(
    `fetching for ${getDapilFilename({ directory, dapil })}}`,
    createDapilExtractor({
      dapil,
      directory,
      url: "https://infopemilu.kpu.go.id/Pemilu/Dct_dpr",
    }),
  );
});
