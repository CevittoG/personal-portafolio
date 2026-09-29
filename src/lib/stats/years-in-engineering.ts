import { monthRange } from "@/lib/experience/format";
import type { ExperienceEntry } from "@/lib/experience/types";

/**
 * Calendar years of engineering work in `entries`.
 *
 * Only `story_act === "technical"` entries count: teaching, mentoring and
 * other foundation roles never pad this number. Overlapping periods are
 * merged first, so concurrent roles count once and the result matches what
 * a recruiter reads off the dates. Rounded to one decimal; callers floor it
 * for "5+ years" copy (see `getEngineeringYears()`).
 */
export function yearsInEngineering(entries: readonly ExperienceEntry[]): number {
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
}
