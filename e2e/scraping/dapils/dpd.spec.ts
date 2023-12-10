import { test } from "@playwright/test";
import { DIRECTORIES, URLS } from "e2e/utils/constants";
import { createDapilExtractor } from "e2e/utils/extractors";
import { getDapilFilename } from "e2e/utils/filenames";
import dpd from "../../fixtures/dpd.json" assert { type: "json" };

test.describe.configure({ mode: "parallel" });

const directory = DIRECTORIES.DPD;

// TODO: Ensure the script works well for the first dapil before running it for all dapils
dpd.slice(0, 0).forEach((dapil) => {
  // FIXME: Ensure we have a proper data traversal for this
  test.skip(
    `fetching for ${getDapilFilename({ directory, dapil })}}`,
    createDapilExtractor({
      dapil,
      directory,
      url: URLS.DPD,
    }),
  );
});
