import type {
  CandidateDetails,
  CandidateWithProvince,
} from "e2e/models/candidates";
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
  extension = "html",
}: {
  directory: Directory;
  dapil: Dapil;
  candidate: CandidateDetails;
  extension?: "html" | "json";
}) =>
  `${directory}/candidates/${dapil.id}_${dapil.name}_${candidate.party}_${candidate.number}_${candidate.name}.${extension}`;

export const getCandidateWithProvinceFilename = ({
  directory,
  dapil,
  candidate,
  extension = "html",
}: {
  directory: Directory;
  dapil: Dapil;
  candidate: CandidateWithProvince;
  extension?: "html" | "json";
}) =>
  `${directory}/candidates/${dapil.id}_${dapil.name}_${candidate.number}_${candidate.name}.${extension}`;
