import type { TaxonomyEntry } from "@/lib/taxonomy/types";
import type { SearchStrategy } from "./types";

type Tier = 0 | 1 | 2 | 3;
//                   0 = exact, 1 = prefix on display_name, 2 = prefix on slug, 3 = contains

function tier(entry: TaxonomyEntry, q: string): Tier | null {
  const name = entry.display_name.toLowerCase();
  const slug = entry.slug.toLowerCase();
  if (name === q || slug === q) return 0;
  if (name.startsWith(q)) return 1;
  if (slug.startsWith(q)) return 2;
  if (name.includes(q) || slug.includes(q)) return 3;
  return null;
}

/**
 * Substring search — case-insensitive contains match, ranked by how
 * "close" the match is. Cheap, predictable, no dependencies.
 */
export class SubstringSearchStrategy implements SearchStrategy {
  readonly id = "substring";

  search(
    query: string,
    candidates: readonly TaxonomyEntry[],
  ): TaxonomyEntry[] {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const scored: Array<{ entry: TaxonomyEntry; t: Tier }> = [];
    for (const entry of candidates) {
      const t = tier(entry, q);
      if (t !== null) scored.push({ entry, t });
    }
    return scored
      .sort(
        (a, b) =>
          a.t - b.t ||
          a.entry.display_name.localeCompare(b.entry.display_name),
      )
      .map((s) => s.entry);
  }
}

export const defaultSearchStrategy: SearchStrategy = new SubstringSearchStrategy();
