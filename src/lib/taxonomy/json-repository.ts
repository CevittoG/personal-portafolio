import taxonomyData from "@/data/taxonomy.json";
import type { ITaxonomyRepository } from "./repository";
import { TAG_TYPES, type TagType, type Taxonomy, type TaxonomyEntry } from "./types";

const data = taxonomyData as Taxonomy;

class JsonTaxonomyRepository implements ITaxonomyRepository {
  private readonly bySlug: Map<string, TaxonomyEntry>;

  constructor(source: Taxonomy) {
    this.bySlug = new Map();
    for (const type of TAG_TYPES) {
      const bucket = source[type] ?? {};
      for (const slug of Object.keys(bucket)) {
        this.bySlug.set(slug, bucket[slug]);
      }
    }
  }

  getAll(): TaxonomyEntry[] {
    return Array.from(this.bySlug.values());
  }

  getByType(type: TagType): TaxonomyEntry[] {
    return this.getAll().filter((entry) => entry.type === type);
  }

  getBySlug(slug: string): TaxonomyEntry | undefined {
    return this.bySlug.get(slug);
  }

  exists(slug: string): boolean {
    return this.bySlug.has(slug);
  }
}

export const taxonomyRepository: ITaxonomyRepository = new JsonTaxonomyRepository(data);
