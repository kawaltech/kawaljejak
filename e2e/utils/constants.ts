export const DIRECTORIES = {
  DPD: "dpd",
  DPR: "dpr",
  DPRD_1: "dprd-1",
  DPRD_2: "dprd-2",
} as const;
export type Directory = (typeof DIRECTORIES)[keyof typeof DIRECTORIES];

export const URLS = {
  DPD: "https://infopemilu.kpu.go.id/Pemilu/Dct_dpd",
  DPR: "https://infopemilu.kpu.go.id/Pemilu/Dct_dpr",
  DPRD_1: "https://infopemilu.kpu.go.id/Pemilu/Dct_dprprov",
  DPRD_2: "https://infopemilu.kpu.go.id/Pemilu/Dct_dprd",
} as const;
export type Url = (typeof URLS)[keyof typeof URLS];
