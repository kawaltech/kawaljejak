import fs from "fs";
import path from "path";

const FIXTURES_ROOT = "./e2e/data";

export const readJSON = <DataType>(relativePath: string): DataType => {
  const fixturePath = path.join(FIXTURES_ROOT, relativePath);
  return JSON.parse(
    fs.readFileSync(fixturePath, { encoding: "utf-8" }),
  ) as DataType;
};

export const writeJSON = async (relativePath: string, data: object) => {
  const fixturePath = path.join(FIXTURES_ROOT, relativePath);
  await fs.promises.writeFile(fixturePath, JSON.stringify(data, null, 2));
};

export const findFile = (relativePath: string) => {
  const fixturePath = path.join(FIXTURES_ROOT, relativePath);
  return fs.existsSync(fixturePath);
};

export const writeHTML = async (relativePath: string, html: string) => {
  const fixturePath = path.join(FIXTURES_ROOT, relativePath);
  await fs.promises.writeFile(fixturePath, html);
};
