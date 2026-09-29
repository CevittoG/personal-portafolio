import type { TagRef } from "@/lib/taxonomy/types";
import { SEARCH_ALIASES } from "./aliases";
import type { SearchStrategy } from "./types";

/**
 * Wraps another strategy and puts alias hits first: typing "k8s" or
 * "postgres" surfaces Kubernetes or PostgreSQL even though neither name
 * contains the query. An alias matches when it equals the query or starts
 * with it (from 2 characters), so "post" already finds PostgreSQL.
 */
export class AliasSearchStrategy implements SearchStrategy {
  readonly id: string;

  constructor(
    private readonly inner: SearchStrategy,
    private readonly aliases: Readonly<Record<string, string>> = SEARCH_ALIASES,
  ) {
    this.id = `alias+${inner.id}`;
  }

  search<T extends TagRef>(query: string, candidates: readonly T[]): T[] {
    const q = query.trim().toLowerCase();
    const results = this.inner.search(query, candidates);
    if (q.length < 2) return results;

    const bySlug = new Map(candidates.map((c) => [c.slug, c]));
    const aliasHits: T[] = [];
    for (const [alias, slug] of Object.entries(this.aliases)) {
      if (alias !== q && !alias.startsWith(q)) continue;
      const entry = bySlug.get(slug);
      if (entry && !aliasHits.includes(entry)) aliasHits.push(entry);
    }
    if (aliasHits.length === 0) return results;
    return [...aliasHits, ...results.filter((r) => !aliasHits.includes(r))];
  }
}
