/**
 * lib/roommate-helper.ts
 * Utilities for Interactive Co-Renting & Roommate Pairing (Unpaid House Hunting)
 * Compatibility matching is strictly focused on Department, Level, and Gender.
 */

export interface RoommateCompatibilityViewer {
  department?: string | null;
  level?: string | null;
  gender?: string | null;
}

export interface RoommateCompatibilityListing {
  department?: string | null;
  level?: string | null;
  gender?: string | null;
  genderPreference?: string | null;
}

export interface CompatibilityResult {
  score: number; // 0 to 100
  label: string;
  badgeClass: "high" | "compatible" | "fair" | "unmatched" | "guest";
  matchReasons: string[];
}

/**
 * Calculates student compatibility score strictly based on Department, Level, and Gender.
 */
export function calculateRoommateCompatibility(
  viewer: RoommateCompatibilityViewer | null | undefined,
  listing: RoommateCompatibilityListing
): CompatibilityResult {
  if (!viewer) {
    return {
      score: 0,
      label: "Log in to check compatibility",
      badgeClass: "guest",
      matchReasons: ["Department, Level & Gender matching available after login"],
    };
  }

  let totalScore = 0;
  const matchReasons: string[] = [];

  // 1. Gender Compatibility (Weight: 40 points)
  const reqGender = (listing.genderPreference || "Any").trim().toLowerCase();
  const listingGender = (listing.gender || "").trim().toLowerCase();
  const viewerGender = (viewer.gender || "").trim().toLowerCase();

  if (reqGender === "any" || !reqGender) {
    totalScore += 40;
    matchReasons.push("Gender: Open to all");
  } else if (viewerGender && (reqGender === viewerGender || reqGender === "all")) {
    totalScore += 40;
    matchReasons.push(`Gender: Matches preference (${listing.genderPreference})`);
  } else if (!viewerGender) {
    totalScore += 20; // Gender not specified on viewer profile
  } else {
    // Explicit gender mismatch
    totalScore += 5;
  }

  // 2. Academic Level Compatibility (Weight: 30 points)
  const listingLevel = (listing.level || "").trim().toUpperCase();
  const viewerLevel = (viewer.level || "").trim().toUpperCase();

  if (listingLevel && viewerLevel && listingLevel !== "ANY LEVEL" && viewerLevel !== "ANY LEVEL") {
    if (listingLevel === viewerLevel) {
      totalScore += 30;
      matchReasons.push(`Level: Same Year (${viewerLevel})`);
    } else {
      const numListing = parseInt(listingLevel.replace(/\D/g, ""), 10);
      const numViewer = parseInt(viewerLevel.replace(/\D/g, ""), 10);
      if (!isNaN(numListing) && !isNaN(numViewer) && Math.abs(numListing - numViewer) <= 100) {
        totalScore += 20;
        matchReasons.push(`Level: Close Year (${viewerLevel} & ${listingLevel})`);
      } else {
        totalScore += 10;
        matchReasons.push(`Level: Different Year`);
      }
    }
  } else {
    totalScore += 15;
  }

  // 3. Department Compatibility (Weight: 30 points)
  const listingDept = (listing.department || "").trim().toLowerCase();
  const viewerDept = (viewer.department || "").trim().toLowerCase();

  if (
    listingDept &&
    viewerDept &&
    listingDept !== "general studies" &&
    viewerDept !== "general studies" &&
    listingDept !== "general" &&
    viewerDept !== "general"
  ) {
    if (listingDept === viewerDept) {
      totalScore += 30;
      matchReasons.push(`Department: Same Dept (${listing.department})`);
    } else {
      // Check for related faculty / engineering / science keywords
      const commonWords = listingDept
        .split(/[\s,&/]+/)
        .filter((w) => w.length > 3 && viewerDept.includes(w));

      if (commonWords.length > 0) {
        totalScore += 20;
        matchReasons.push(`Department: Related Faculty`);
      } else {
        totalScore += 10;
      }
    }
  } else {
    totalScore += 15;
  }

  const score = Math.min(100, Math.max(10, totalScore));

  let label = "Fair Match";
  let badgeClass: "high" | "compatible" | "fair" | "unmatched" = "fair";

  if (score >= 90) {
    label = "High Compatibility Match";
    badgeClass = "high";
  } else if (score >= 70) {
    label = "Compatible Match";
    badgeClass = "compatible";
  } else {
    label = "Fair Match";
    badgeClass = "fair";
  }

  return {
    score,
    label,
    badgeClass,
    matchReasons,
  };
}

/**
 * Parses co-renting tags stored in amenities array.
 */
export function parsePairingTags(amenities: string[] = [], fallbackRent: number = 0) {
  const findTag = (prefix: string) => {
    const found = amenities.find((a) => a.startsWith(prefix));
    return found ? found.slice(prefix.length) : null;
  };

  const intentTag = findTag("intent:");
  const isLookingToPair = intentTag === "LOOKING_TO_PAIR" || findTag("pairing:looking_to_pair") !== null;
  const roommateIntent: "LOOKING_TO_PAIR" | "HAVE_SPACE" = isLookingToPair ? "LOOKING_TO_PAIR" : "HAVE_SPACE";

  const myBudgetParsed = parseFloat(findTag("my_budget:") || "");
  const targetRentParsed = parseFloat(findTag("target_rent:") || "");
  const department = findTag("dept:") || undefined;
  const level = findTag("level:") || undefined;
  const slotsTotal = parseInt(findTag("slots_total:") || "2", 10);
  const slotsFilled = parseInt(findTag("slots_filled:") || "1", 10);
  const targetPropertyId = findTag("target_prop:") || undefined;

  const myBudget = !isNaN(myBudgetParsed) && myBudgetParsed > 0 ? myBudgetParsed : fallbackRent;
  const targetTotalRent = !isNaN(targetRentParsed) && targetRentParsed > 0 ? targetRentParsed : myBudget * 2;

  const cleanAmenities = amenities.filter(
    (a) =>
      !a.startsWith("intent:") &&
      !a.startsWith("pairing:") &&
      !a.startsWith("my_budget:") &&
      !a.startsWith("target_rent:") &&
      !a.startsWith("dept:") &&
      !a.startsWith("level:") &&
      !a.startsWith("slots_total:") &&
      !a.startsWith("slots_filled:") &&
      !a.startsWith("target_prop:")
  );

  return {
    roommateIntent,
    isLookingToPair,
    myBudget,
    targetTotalRent,
    department,
    level,
    slotsTotal: slotsTotal || 2,
    slotsFilled: slotsFilled || 1,
    targetPropertyId,
    cleanAmenities,
  };
}

/**
 * Builds encoded pairing tags to include in property amenities.
 */
export function buildPairingTags(params: {
  roommateIntent?: "HAVE_SPACE" | "LOOKING_TO_PAIR";
  myBudget?: number | string;
  targetTotalRent?: number | string;
  department?: string;
  level?: string;
  slotsTotal?: number | string;
  slotsFilled?: number | string;
  targetPropertyId?: string;
}): string[] {
  if (params.roommateIntent !== "LOOKING_TO_PAIR") {
    return ["intent:HAVE_SPACE"];
  }

  const tags: string[] = [
    "intent:LOOKING_TO_PAIR",
    `my_budget:${params.myBudget || 0}`,
    `target_rent:${params.targetTotalRent || 0}`,
    `dept:${params.department?.trim() || "General Studies"}`,
    `level:${params.level?.trim() || "100L"}`,
    `slots_total:${params.slotsTotal || 2}`,
    `slots_filled:${params.slotsFilled || 1}`,
  ];

  if (params.targetPropertyId) {
    tags.push(`target_prop:${params.targetPropertyId}`);
  }

  return tags;
}
