import type { ExperienceEntry } from "@/lib/experience/types";
import { TAG_TYPES } from "@/lib/taxonomy/types";

/**
 * Explorer filter rule: an entry matches when it carries EVERY active tag
 * (any type). No active tags matches everything. Filters narrow; they never
 * widen, so a recruiter adding "Snowflake" to "Python" sees fewer cards.
 */
export function matchesAllTags(
  entry: ExperienceEntry,
  activeTags: readonly string[],
): boolean {
  if (activeTags.length === 0) return true;
  const slugs = new Set<string>();
  for (const type of TAG_TYPES) {
    for (const slug of entry.tags[type] ?? []) slugs.add(slug);
  }
  return activeTags.every((slug) => slugs.has(slug));
}
