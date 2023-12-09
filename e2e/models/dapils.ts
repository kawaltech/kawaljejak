import type { CandidateDetails } from "./candidates";

export type Dapil = {
  readonly id: number;
  readonly name: string;
};

export type DapilWithCandidates = Dapil & {
  readonly candidates: readonly CandidateDetails[];
};
