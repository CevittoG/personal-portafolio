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

export interface TaxonomyEntry {
  slug: string;
  display_name: string;
  type: TagType;
  icon: string | null;
  /** SVG logo URL (Simple Icons CDN or local path). Null for abstract tags with no canonical logo. */
  image: string | null;
  color: string | null;
  related: string[];
}

export type Taxonomy = Record<TagType, Record<string, TaxonomyEntry>>;
