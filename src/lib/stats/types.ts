import type { ExperienceEntry } from "@/lib/experience/types";

/**
 * StatComputer — single-responsibility unit that turns a list of (filtered)
 * entries into one display value. Each concrete stat is a sibling file in
 * computers/. The Stats Bar consumes a registered list.
 */
export interface StatComputer<T = number | string> {
  readonly id: string;
  readonly label: string;
  compute(entries: ExperienceEntry[]): T;
  /**
   * Unit suffix appended after an animated number (e.g. " yrs").
   * Use this for numeric stats where the count-up animation is desirable.
   */
  suffix?: string;
  /**
   * Formatter for non-animatable display strings (e.g. "15M+").
   * When set, StatCard receives a plain string and skips the count-up.
   * Prefer `suffix` for numeric stats so animation is preserved.
   */
  format?(value: T): string;
}
