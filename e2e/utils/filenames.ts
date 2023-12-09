import type { CandidateDetails } from "e2e/models/candidates";
import type { Dapil } from "e2e/models/dapils";
import type { Directory } from "./constants";

export const getDapilFilename = ({
  directory,
  dapil,
}: {
  directory: Directory;
  dapil: Dapil;
}) => `${directory}/dapils/${dapil.id}_${dapil.name}.json`;

export const getCandidateFilename = ({
  directory,
  dapil,
  candidate,
}: {
  directory: Directory;
  dapil: Dapil;
  candidate: CandidateDetails;
}) =>
  `${directory}/candidates/${dapil.id}_${dapil.name}_${candidate.party}_${candidate.number}_${candidate.name}.html`;
