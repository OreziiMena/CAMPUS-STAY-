// List of institutions active on Campus Tent (Delta State institutions + UNIBEN)
export interface University {
  code: string;
  name: string;
}

// Active tertiary institutions for platform operations (Delta State + UNIBEN)
export const ACTIVE_UNIVERSITIES: University[] = [
  { code: "FUPRE", name: "Federal University of Petroleum Resources, Effurun (FUPRE)" },
  { code: "DELSU", name: "Delta State University, Abraka (DELSU)" },
  { code: "PTI", name: "Petroleum Training Institute, Effurun (PTI)" },
  { code: "UNIBEN", name: "University of Benin (UNIBEN)" },
  { code: "DOU", name: "Dennis Osadebay University, Asaba (DOU)" },
  { code: "DSUST", name: "Delta State University of Science and Technology, Ozoro (DSUST)" },
  { code: "UNIDEL", name: "University of Delta, Agbor (UNIDEL)" },
  { code: "FEPO", name: "Federal Polytechnic, Orogun (FEPO)" },
  { code: "DSPG", name: "Delta State Polytechnic, Ogwashi-Uku (DSPG)" },
  { code: "DESPO", name: "Delta State Polytechnic, Otefe-Oghara (DESPO)" },
  { code: "NOVENA", name: "Novena University, Ogume-Amai (NOVENA)" },
  { code: "WDU", name: "Western Delta University, Oghara (WDU)" },
  { code: "ADUN", name: "Admiralty University of Nigeria, Ibusa (ADUN)" },
  { code: "COEWARRI", name: "College of Education, Warri (COEWARRI)" },
  { code: "COEMO", name: "College of Education, Mosogar (COEMO)" },
];

// Alias for platform-wide dropdowns
export const NIGERIAN_UNIVERSITIES: University[] = ACTIVE_UNIVERSITIES;
export const DELTA_STATE_UNIVERSITIES: University[] = ACTIVE_UNIVERSITIES;

export const ACTIVE_UNIVERSITY_CODES: string[] = ACTIVE_UNIVERSITIES.map((u) => u.code);
export const DELTA_STATE_CODES: string[] = ACTIVE_UNIVERSITY_CODES;

/**
 * Validates if an institution code or name belongs to the supported active institutions (Delta State + UNIBEN).
 */
export function isDeltaStateInstitution(codeOrName: string): boolean {
  if (!codeOrName || typeof codeOrName !== "string") return false;
  const upper = codeOrName.trim().toUpperCase();

  if (ACTIVE_UNIVERSITY_CODES.includes(upper)) return true;

  return ACTIVE_UNIVERSITIES.some(
    (uni) =>
      uni.code.toUpperCase() === upper ||
      uni.name.toUpperCase().includes(upper) ||
      upper.includes(uni.code.toUpperCase())
  );
}

export const isSupportedInstitution = isDeltaStateInstitution;


