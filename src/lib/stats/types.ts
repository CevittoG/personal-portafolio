import type { ExperienceEntry } from "@/lib/experience/types";
import type { MessageKey } from "@/i18n/translator";

/**
 * StatComputer — single-responsibility unit that turns a list of (filtered)
 * entries into one display value. Each concrete stat is a sibling file in
 * computers/. The Stats Bar consumes a registered list.
 *
 * `label` is the EN fallback / dev-readable name. `labelKey` is the i18n
 * key resolved through `useTranslations()` at render time — when set, the
 * Stats Bar prefers it over `label`. Existing computers keep working with
 * just `label`; new computers should provide both.
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
