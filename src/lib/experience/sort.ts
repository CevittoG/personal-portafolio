import { TAG_TYPES } from "@/lib/taxonomy/types";
import type { ExperienceEntry } from "./types";

/**
 * Sort orderings for the Explorer card grid (plan §6 Zone 4).
 *
 * Adding a new order = add an id to `SORT_IDS` + a case in `sortEntries`.
 * Kept as a small switch (vs. full Strategy pattern) since we only ever
 * expose two options in the secondary filter bar. Promote to interface +
 * registry the day a third meaningful order appears.
 */
export const SORT_IDS = ["recent", "relevant"] as const;
export type SortId = (typeof SORT_IDS)[number];

export const SORT_LABELS: Record<SortId, string> = {
  recent: "Most recent",
  relevant: "Most relevant",
};

export function sortEntries(
  entries: readonly ExperienceEntry[],
  order: SortId,
  activeTags: readonly string[],
): ExperienceEntry[] {
  const copy = [...entries];
  switch (order) {
    case "recent":
      return copy.sort(compareByStartDateDesc);
    case "relevant":
      return copy.sort((a, b) => {
        const diff = overlap(b, activeTags) - overlap(a, activeTags);
        return diff !== 0 ? diff : compareByStartDateDesc(a, b);
      });
  }
}

function compareByStartDateDesc(a: ExperienceEntry, b: ExperienceEntry): number {
  // YYYY-MM strings sort lexicographically === chronologically.
  return b.period.start.localeCompare(a.period.start);
}

/** Count how many active tags appear anywhere in the entry's tag map. */
function overlap(entry: ExperienceEntry, activeTags: readonly string[]): number {
  if (activeTags.length === 0) return 0;
  const slugs = new Set<string>();
  for (const type of TAG_TYPES) {
    for (const slug of entry.tags[type] ?? []) slugs.add(slug);
  }
  let n = 0;
  for (const t of activeTags) if (slugs.has(t)) n++;
  return n;
}
