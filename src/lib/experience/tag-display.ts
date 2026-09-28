import type { TagType } from "@/lib/taxonomy/types";
import type { ExperienceEntry } from "./types";

/** Max pills on a grid card. The drawer and deep dive show the full set. */
export const CARD_TAG_CAP = 6;

/** Tag types a card draws from when nothing is filtered: the stack. */
const CARD_TAG_TYPES: readonly TagType[] = ["languages", "technologies"];

export interface CardTag {
  slug: string;
  type: TagType;
}

export interface CardTags {
  /** Pills to render: active-filter matches first, then languages and technologies. */
  shown: CardTag[];
  /** How many of the entry's tags (all types) are not shown. Drives "+N". */
  hiddenCount: number;
}

/**
 * Decide which tags a grid card shows. A recruiter scans a card for the
 * stack, so it leads with languages and technologies, capped at six.
 * Active-filter matches of any type always come first, so a card never
 * hides why it matched, even past the cap.
 */
export function cardTags(
  entry: ExperienceEntry,
  filterTags: readonly string[] = [],
  cap = CARD_TAG_CAP,
): CardTags {
  const filterSet = new Set(filterTags);
  const all: CardTag[] = (Object.keys(entry.tags) as TagType[]).flatMap(
    (type) => (entry.tags[type] ?? []).map((slug) => ({ slug, type })),
  );

  const matched = all.filter((t) => filterSet.has(t.slug));
  const stack = CARD_TAG_TYPES.flatMap((type) =>
    (entry.tags[type] ?? [])
      .filter((slug) => !filterSet.has(slug))
      .map((slug) => ({ slug, type })),
  );
  const shown = [
    ...matched,
    ...stack.slice(0, Math.max(0, cap - matched.length)),
  ];
  return { shown, hiddenCount: all.length - shown.length };
}
