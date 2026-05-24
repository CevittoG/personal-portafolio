import type { ExperienceEntry } from "@/lib/experience/types";
import { TAG_TYPES } from "./types";

/**
 * Top tag slugs by raw usage count across the given experience entries.
 * Used by the Search empty-state ("when the user hasn't typed yet, suggest
 * the 5–6 most-used tags as starting points" — plan §6 Zone 2).
 */
export function topTagsByUsage(
  entries: readonly ExperienceEntry[],
  limit = 6,
): string[] {
  const counts = new Map<string, number>();
  for (const entry of entries) {
    for (const type of TAG_TYPES) {
      for (const slug of entry.tags[type] ?? []) {
        counts.set(slug, (counts.get(slug) ?? 0) + 1);
      }
    }
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([slug]) => slug);
}
