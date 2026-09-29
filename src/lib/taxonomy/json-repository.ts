import { taxonomyData } from "@/content/data";
import { TAG_TYPES, type TaxonomyEntry } from "./types";

/**
 * Read access to taxonomy.json (validated at build, see `src/content/`).
 * Flattened once into a slug index; a plain module, like the experience one.
 */
const bySlug = new Map<string, TaxonomyEntry>();
for (const type of TAG_TYPES) {
  for (const entry of Object.values(taxonomyData[type] ?? {})) {
    bySlug.set(entry.slug, entry);
  }
}

export const taxonomyRepository = {
  getAll(): TaxonomyEntry[] {
    return Array.from(bySlug.values());
  },

  getBySlug(slug: string): TaxonomyEntry | undefined {
    return bySlug.get(slug);
  },
};
