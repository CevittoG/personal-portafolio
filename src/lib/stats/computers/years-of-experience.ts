import type { ExperienceEntry } from "@/lib/experience/types";
import { monthRange } from "@/lib/experience/format";
import type { StatComputer } from "../types";

/**
 * Calendar years of engineering work in the (filtered) entries.
 *
 * Only `story_act === "technical"` entries count — teaching, mentoring and
 * other foundation roles stay in Discover but never pad this number.
 * Overlapping periods are merged first, so concurrent roles count once:
 * the result matches what a recruiter would read off the dates.
 */
export const yearsOfExperienceComputer: StatComputer<number> = {
  id: "years-of-experience",
  label: "Years in engineering",
  labelKey: "stats.yearsOfExperience",
  // suffix keeps the count-up animation while still showing the unit
  suffix: " yrs",
  compute(entries: ExperienceEntry[]): number {
    const ranges = entries
      .filter((entry) => entry.story_act === "technical")
      .map((entry) => monthRange(entry.period))
      .filter((range): range is [number, number] => range !== null)
      .sort((a, b) => a[0] - b[0]);

    let months = 0;
    let current: [number, number] | null = null;
    for (const [start, end] of ranges) {
      if (current && start <= current[1]) {
        current[1] = Math.max(current[1], end);
      } else {
        if (current) months += current[1] - current[0];
        current = [start, end];
      }
    }
    if (current) months += current[1] - current[0];

    return Math.round((months / 12) * 10) / 10;
  },
};
