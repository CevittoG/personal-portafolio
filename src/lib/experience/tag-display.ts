import { TAG_TYPES, type TagType } from "@/lib/taxonomy/types";
import type { ExperienceEntry } from "./types";

/** Max non-matched tags shown per category before the rest collapse into "+N". */
export const TAG_DISPLAY_CAP = 3;

export interface VisibleTagGroup {
  type: TagType;
  /** Slugs to render as pills, matched (active-filter) ones first. */
  shown: string[];
  /** Count of tags in this category not shown — drives the "+N" pill. */
  hiddenCount: number;
}

/**
 * Decide which of an entry's tags to show on a grid card, per category.
 *
 * Active-filter matches are always shown (so a search never hides its own
 * hits). The remaining slots fill with non-matched tags up to
 * `max(TAG_DISPLAY_CAP, matchedCount)`; anything past that collapses into a
 * "+N" overflow pill. Order within `shown` is matched-first, then the
 * original tag order — so a card visibly leads with why it matched.
 */
export function visibleTagsByType(
  entry: ExperienceEntry,
  filterTags: readonly string[] = [],
): VisibleTagGroup[] {
  const filterSet = new Set(filterTags);

  return TAG_TYPES.flatMap((type) => {
    const all = entry.tags[type] ?? [];
    if (all.length === 0) return [];

    const matched = all.filter((slug) => filterSet.has(slug));
    const unmatched = all.filter((slug) => !filterSet.has(slug));

    const budget = Math.max(TAG_DISPLAY_CAP, matched.length);
    const fillCount = Math.max(0, budget - matched.length);
    const shown = [...matched, ...unmatched.slice(0, fillCount)];

    return [
      {
        type,
        shown,
        hiddenCount: all.length - shown.length,
      },
    ];
  });
}
