import fs from "fs";
import path from "path";

const FIXTURES_ROOT = "./e2e/fixtures";

export const writeFixture = async (relativePath: string, data: object) => {
  const fixturePath = path.join(FIXTURES_ROOT, relativePath);
  await fs.promises.writeFile(fixturePath, JSON.stringify(data, null, 2));
};

export const readFixture = async (relativePath: string) => {
  const fixturePath = path.join(FIXTURES_ROOT, relativePath);
  return await fs.promises.readFile(fixturePath, "utf8");
};

export const findHtml = (relativePath: string) => {
  const fixturePath = path.join(FIXTURES_ROOT, relativePath);
  return fs.existsSync(fixturePath);
};

export const writeHtml = async (relativePath: string, html: string) => {
  const fixturePath = path.join(FIXTURES_ROOT, relativePath);
  await fs.promises.writeFile(fixturePath, html);
};
