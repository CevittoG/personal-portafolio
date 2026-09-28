import { DEFAULT_LOCALE, type Locale } from "@/i18n/locale";
import type { ExperienceEntry } from "./types";

/**
 * Return the entry with its reader-facing prose in `locale`, when the entry
 * has a hand-written translation. Fields without one keep the English text,
 * so a partially translated entry still renders completely.
 *
 * Apply it once where entries enter a locale-aware tree (Explorer, Story,
 * DeepDive, metadata); components below render the result as usual.
 */
export function localizeEntry(
  entry: ExperienceEntry,
  locale: Locale,
): ExperienceEntry {
  if (locale === DEFAULT_LOCALE) return entry;
  const tr = entry.translations?.[locale];
  if (!tr) return entry;
  const impact = tr.impact?.length
    ? [...tr.impact, ...entry.impact.slice(tr.impact.length)]
    : entry.impact;
  return {
    ...entry,
    summary: tr.summary || entry.summary,
    impact,
    personal_impact: tr.personal_impact || entry.personal_impact,
  };
}
