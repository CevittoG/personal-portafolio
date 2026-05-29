import type { ExperienceEntry } from "@/lib/experience/types";
import { durationMonths } from "@/lib/experience/format";
import type { StatComputer } from "../types";

/**
 * Sums each entry's own duration (in months) and returns the total in years.
 * Durations are added independently — concurrent roles count toward each, so
 * overlapping periods are intentionally counted once per role, not merged.
 * `durationMonths` tolerates missing/year-only boundaries (returns 0 for a
 * null start) so coarse entries never break the sum.
 */
export const yearsOfExperienceComputer: StatComputer<number> = {
  id: "years-of-experience",
  label: "Years of relevant experience",
  labelKey: "stats.yearsOfExperience",
  // suffix keeps the count-up animation while still showing the unit
  suffix: " yrs",
  compute(entries: ExperienceEntry[]): number {
    const months = entries.reduce(
      (acc, entry) => acc + durationMonths(entry.period),
      0,
    );
    return Math.round((months / 12) * 10) / 10;
  },
};
