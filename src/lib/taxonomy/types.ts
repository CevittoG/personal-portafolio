import type { z } from "zod";
import type { TaxonomyEntrySchema } from "@/content/schema";

export const TAG_TYPES = [
  "roles",
  "languages",
  "technologies",
  "libraries",
  "domains",
  "concepts",
  "scale",
  "soft_skills",
] as const;

export type TagType = (typeof TAG_TYPES)[number];

/** A taxonomy tag. Derived from the schema in `src/content/schema.ts`. */
export type TaxonomyEntry = z.infer<typeof TaxonomyEntrySchema>;

export type Taxonomy = Record<TagType, Record<string, TaxonomyEntry>>;
