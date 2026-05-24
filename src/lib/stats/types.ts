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
  /** Optional formatter for display (e.g. "15M+", "4 yrs"). */
  format?(value: T): string;
}
