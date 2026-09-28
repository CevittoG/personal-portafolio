import type { ExperienceEntry } from "@/lib/experience/types";
import type { MessageKey } from "@/i18n/translator";

/**
 * StatComputer — single-responsibility unit that turns a list of entries
 * into one value. The Stats Bar and its count-up were removed in Phase 4
 * (the landing now leads with featured-role results); the remaining
 * computer, years in engineering, feeds the hero proof line, metadata and
 * the Contact "At a glance" block through `getEngineeringYears()`.
 */
export interface StatComputer<T = number | string> {
  readonly id: string;
  readonly label: string;
  /** i18n key. Optional for backward-compat; preferred when present. */
  readonly labelKey?: MessageKey;
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
