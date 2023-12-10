import { test } from "@playwright/test";
import { DIRECTORIES, URLS } from "e2e/utils/constants";
import { createDapilExtractor } from "e2e/utils/extractors";
import { getDapilFilename } from "e2e/utils/filenames";
import dpd from "../../fixtures/dpd.json" assert { type: "json" };

test.describe.configure({ mode: "parallel" });

const directory = DIRECTORIES.DPD;
const url = URLS.DPD;

dpd.forEach((dapil) => {
  test(
    `fetching for ${getDapilFilename({ directory, dapil })}}`,
    createDapilExtractor({
      dapil,
      directory,
      url,
      withProvince: true,
    }),
  );
});
