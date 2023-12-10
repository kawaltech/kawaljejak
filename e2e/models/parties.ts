export type Party = {
  number: number;
  abbreviation: string;
};

export const PARTIES_RECORD: Record<string, Party> = {
  "Partai Kebangkitan Bangsa": {
    number: 1,
    abbreviation: "PKB",
  },
  "Partai Gerakan Indonesia Raya": {
    number: 2,
    abbreviation: "Gerindra",
  },
  "Partai Demokrasi Indonesia Perjuangan": {
    number: 3,
    abbreviation: "PDI-P",
  },
  "Partai Golongan Karya": {
    number: 4,
    abbreviation: "Golkar",
  },
  "Partai NasDem": {
    number: 5,
    abbreviation: "NasDem",
  },
  "Partai Buruh": {
    number: 6,
    abbreviation: "Partai Buruh",
  },
  "Partai Gelombang Rakyat Indonesia": {
    number: 7,
    abbreviation: "Gelora",
  },
  "Partai Keadilan Sejahtera": {
    number: 8,
    abbreviation: "PKS",
  },
  "Partai Kebangkitan Nusantara": {
    number: 9,
    abbreviation: "PKN",
  },
  "Partai Hati Nurani Rakyat": {
    number: 10,
    abbreviation: "Hanura",
  },
  "Partai Garda Republik Indonesia": {
    number: 11,
    abbreviation: "Garuda",
  },
  "Partai Amanat Nasional": {
    number: 12,
    abbreviation: "PAN",
  },
  "Partai Bulan Bintang": {
    number: 13,
    abbreviation: "PBB",
  },
  "Partai Demokrat": {
    number: 14,
    abbreviation: "Demokrat",
  },
  "Partai Solidaritas Indonesia": {
    number: 15,
    abbreviation: "PSI",
  },
  "PARTAI PERINDO": {
    number: 16,
    abbreviation: "Perindo",
  },
  "Partai Persatuan Pembangunan": {
    number: 17,
    abbreviation: "PPP",
  },
  "Partai Nanggroe Aceh": {
    number: 18,
    abbreviation: "PNA",
  },
  "Partai Generasi Atjeh Beusaboh Tha'at Dan Taqwa": {
    number: 19,
    abbreviation: "Gabthat",
  },
  "Partai Darul Aceh": {
    number: 20,
    abbreviation: "PDA",
  },
  "Partai Aceh": {
    number: 21,
    abbreviation: "PA",
  },
  "Partai Adil Sejahtera Aceh": {
    number: 22,
    abbreviation: "PASA",
  },
  "PARTAI SIRA (SOLIDITAS INDEPENDEN RAKYAT ACEH)": {
    number: 23,
    abbreviation: "PSIRA",
  },
  "Partai Ummat": {
    number: 24,
    abbreviation: "PU",
  },
};

export const getPartyNumber = (partyName: string): number => {
  const party = PARTIES_RECORD[partyName];
  if (party === undefined) {
    throw new Error(`Unknown party: ${partyName}`);
  }
  return party.number;
};
