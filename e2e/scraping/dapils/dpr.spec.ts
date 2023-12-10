import { test } from "@playwright/test";
import { DIRECTORIES, URLS } from "e2e/utils/constants";
import { createDapilExtractor } from "e2e/utils/extractors";
import { getDapilFilename } from "e2e/utils/filenames";
import { findFile } from "e2e/utils/fixtures";
import dpr from "../../fixtures/dpr.json" assert { type: "json" };

test.describe.configure({ mode: "parallel" });

const directory = DIRECTORIES.DPR;
const url = URLS.DPR;

dpr.forEach((dapil) => {
  const filename = getDapilFilename({ directory, dapil });
  if (findFile(filename)) {
    test.skip(`skipping ${filename}`, () => {});
  } else {
    test(
      filename,
      createDapilExtractor({
        dapil,
        directory,
        url,
      }),
    );
  }
});
