import { test } from "@playwright/test";
import { DIRECTORIES, URLS } from "e2e/utils/constants";
import { createDapilExtractor } from "e2e/utils/extractors";
import { getDapilFilename } from "e2e/utils/filenames";
import { findFile } from "e2e/utils/fixtures";
import dprd2 from "../../fixtures/dprd-2.json" assert { type: "json" };

test.describe.configure({ mode: "parallel" });

const directory = DIRECTORIES.DPRD_2;
const url = URLS.DPRD_2;

dprd2.forEach((dapil) => {
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
