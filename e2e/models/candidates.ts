export type CandidateWithProvince = {
  province: string;
  number: number;
  name: string;
  gender: string;
  address: string;
};

export type CandidateDetails = {
  party: string;
  number: number;
  name: string;
  gender: string;
  address: string;
};

export type Candidate = { partyNumber: number } & CandidateDetails;
