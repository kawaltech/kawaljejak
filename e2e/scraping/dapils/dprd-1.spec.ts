import { test } from "@playwright/test";
import { DIRECTORIES, URLS } from "e2e/utils/constants";
import { createDapilExtractor } from "e2e/utils/extractors";
import { getDapilFilename } from "e2e/utils/filenames";
import dprd1 from "../../fixtures/dprd-1.json" assert { type: "json" };

test.describe.configure({ mode: "parallel" });

const directory = DIRECTORIES.DPRD_1;

// TODO: Ensure the script works well for the first dapil before running it for all dapils
dprd1.slice(0, 1).forEach((dapil) => {
  test(
    `fetching for ${getDapilFilename({ directory, dapil })}}`,
    createDapilExtractor({
      dapil,
      directory,
      url: URLS.DPRD_1,
    }),
  );
});
