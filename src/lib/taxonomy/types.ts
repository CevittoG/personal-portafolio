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

/** The three fields the browser needs about a tag: sent to client islands
 *  instead of full taxonomy entries (no `related`, `image`…). */
export type TagRef = Pick<TaxonomyEntry, "slug" | "display_name" | "type">;
