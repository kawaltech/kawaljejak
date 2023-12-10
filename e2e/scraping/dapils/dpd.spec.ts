import { test } from "@playwright/test";
import { DIRECTORIES, URLS } from "e2e/utils/constants";
import { createDapilExtractor } from "e2e/utils/extractors";
import { getDapilFilename } from "e2e/utils/filenames";
import { findFile } from "e2e/utils/fixtures";
import dpd from "../../fixtures/dpd.json" assert { type: "json" };

test.describe.configure({ mode: "parallel" });

const directory = DIRECTORIES.DPD;
const url = URLS.DPD;

dpd.forEach((dapil) => {
  const filename = getDapilFilename({ directory, dapil });
  if (findFile(filename)) {
    test.skip(`skipping ${filename}`, () => {});
  } else {
    test(
      `fetching for ${getDapilFilename({ directory, dapil })}`,
      createDapilExtractor({
        dapil,
        directory,
        url,
        withProvince: true,
      }),
    );
  }
});
