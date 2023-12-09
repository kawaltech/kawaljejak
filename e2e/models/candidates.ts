export type CandidateDetails = {
  party: string;
  number: number;
  name: string;
  gender: string;
  address: string;
};

export type Candidate = { id: number } & CandidateDetails;
