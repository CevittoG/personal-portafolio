import type { ExperienceEntry } from "@/lib/experience/types";
import { TAG_TYPES } from "@/lib/taxonomy/types";
import type { FilterStrategy } from "./types";

function flattenSlugs(entry: ExperienceEntry): Set<string> {
  const slugs = new Set<string>();
  for (const type of TAG_TYPES) {
    for (const slug of entry.tags[type] ?? []) slugs.add(slug);
  }
  return slugs;
}

/** Entry matches only when it contains EVERY active slug. */
export class AllTagsMatchStrategy implements FilterStrategy {
  readonly id = "all-tags";

  matches(entry: ExperienceEntry, activeTags: string[]): boolean {
    if (activeTags.length === 0) return true;
    const slugs = flattenSlugs(entry);
    return activeTags.every((slug) => slugs.has(slug));
  }
}

/** Entry matches when it contains AT LEAST ONE active slug. */
export class AnyTagMatchStrategy implements FilterStrategy {
  readonly id = "any-tag";

  matches(entry: ExperienceEntry, activeTags: string[]): boolean {
    if (activeTags.length === 0) return true;
    const slugs = flattenSlugs(entry);
    return activeTags.some((slug) => slugs.has(slug));
  }
}

export const defaultFilterStrategy: FilterStrategy = new AllTagsMatchStrategy();
