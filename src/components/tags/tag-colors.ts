import type { TagType } from "@/lib/taxonomy/types";

/**
 * Map from taxonomy type → CSS custom-property name defined in
 * src/app/globals.css. The Tag Pill reads colors through this map so a new
 * tag type only needs (a) the union entry, (b) a new CSS var, (c) an entry
 * here — never a component edit.
 */
export const TAG_COLOR_VAR: Record<TagType, string> = {
  roles: "--color-tag-roles",
  languages: "--color-tag-languages",
  technologies: "--color-tag-technologies",
  libraries: "--color-tag-libraries",
  domains: "--color-tag-domains",
  concepts: "--color-tag-concepts",
  scale: "--color-tag-scale",
  soft_skills: "--color-tag-soft-skills",
};

/** CSS `var(...)` reference for a tag type, e.g. `var(--color-tag-roles)`. */
export function tagColorVar(type: TagType): string {
  return `var(${TAG_COLOR_VAR[type]})`;
}
