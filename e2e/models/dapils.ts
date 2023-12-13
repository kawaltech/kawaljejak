import type { CandidateDetails, CandidateWithProvince } from "./candidates";

export type Dapil = {
  readonly id: number;
  readonly name: string;
  readonly alias?: string;
};

export type DapilWithCandidates = Dapil & {
  readonly candidates: readonly CandidateDetails[];
};

export type DapilWithCandidatesWithProvince = Dapil & {
  readonly candidates: readonly CandidateWithProvince[];
};
