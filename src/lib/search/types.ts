import type { TaxonomyEntry } from "@/lib/taxonomy/types";

/**
 * SearchStrategy — pluggable algorithm for ranking taxonomy entries
 * against a free-text query. Swap implementations (substring → fuzzy →
 * synonym-aware) without touching the SearchBar component (OCP/DIP).
 */
export interface SearchStrategy {
  readonly id: string;
  /**
   * Return the matching entries ordered best→worst. An empty query MAY
   * return an empty array — the caller is responsible for the empty-state
   * (typically "top N tags by usage").
   */
  search(
    query: string,
    candidates: readonly TaxonomyEntry[],
  ): TaxonomyEntry[];
}
