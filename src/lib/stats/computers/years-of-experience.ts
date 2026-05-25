import type { ExperienceEntry } from "@/lib/experience/types";
import type { StatComputer } from "../types";

function monthsBetween(start: string, end: string | null): number {
  const [sy, sm] = start.split("-").map(Number);
  const now = new Date();
  const [ey, em] = end
    ? end.split("-").map(Number)
    : [now.getUTCFullYear(), now.getUTCMonth() + 1];
  return Math.max(0, (ey - sy) * 12 + (em - sm));
}

/** Sums non-overlapping months across all entries' periods, returns years. */
export const yearsOfExperienceComputer: StatComputer<number> = {
  id: "years-of-experience",
  label: "Years of relevant experience",
  labelKey: "stats.yearsOfExperience",
  // suffix keeps the count-up animation while still showing the unit
  suffix: " yrs",
  compute(entries: ExperienceEntry[]): number {
    const months = entries.reduce(
      (acc, entry) => acc + monthsBetween(entry.period.start, entry.period.end),
      0,
    );
    return Math.round((months / 12) * 10) / 10;
  },
};
