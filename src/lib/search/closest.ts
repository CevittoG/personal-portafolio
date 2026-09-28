import type { TaxonomyEntry } from "@/lib/taxonomy/types";

/**
 * Nearest taxonomy entries by edit distance, for the "no exact match"
 * state: "snowflke" still offers Snowflake. Compares against both the
 * display name and the slug, and only returns entries within a distance
 * that scales with the query length, so nonsense queries return nothing.
 */
export function closestMatches(
  query: string,
  candidates: readonly TaxonomyEntry[],
  limit = 3,
): TaxonomyEntry[] {
  const q = query.trim().toLowerCase();
  if (q.length < 3) return [];
  const maxDistance = Math.max(2, Math.floor(q.length / 3));
  return candidates
    .map((entry) => ({
      entry,
      d: Math.min(
        distance(q, entry.display_name.toLowerCase()),
        distance(q, entry.slug.toLowerCase()),
      ),
    }))
    .filter((x) => x.d <= maxDistance)
    .sort((a, b) => a.d - b.d || a.entry.display_name.localeCompare(b.entry.display_name))
    .slice(0, limit)
    .map((x) => x.entry);
}

/** Levenshtein distance, two-row DP. Inputs are short tag names. */
function distance(a: string, b: string): number {
  if (a === b) return 0;
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const curr = [i];
    for (let j = 1; j <= b.length; j++) {
      curr[j] = Math.min(
        prev[j] + 1,
        curr[j - 1] + 1,
        prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
    prev = curr;
  }
  return prev[b.length];
}
