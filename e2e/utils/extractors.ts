import type { Locator } from "@playwright/test";

export const nthExtractor = (locator: Locator) => async (index: number) => {
  const textContent = (await locator.nth(index).textContent()) ?? "";
  return textContent.trim().replace(/\s+/g, " ");
};

export const extractText = async (locator: Locator) => {
  const textContent = (await locator.textContent()) ?? "";
  return textContent.trim().replace(/\s+/g, " ");
};
