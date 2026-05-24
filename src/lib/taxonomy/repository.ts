import type { TagType, TaxonomyEntry } from "./types";

/**
 * ITaxonomyRepository — read-only surface for taxonomy lookups.
 * Components depend on this interface, not on the JSON impl (DIP).
 */
export interface ITaxonomyRepository {
  getAll(): TaxonomyEntry[];
  getByType(type: TagType): TaxonomyEntry[];
  getBySlug(slug: string): TaxonomyEntry | undefined;
  exists(slug: string): boolean;
}
