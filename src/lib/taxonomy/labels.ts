import type { TagType } from "./types";

/**
 * Human-readable singular label for a taxonomy type.
 * Used in filter chips ("Python · Language") and any other UI surface that
 * needs to say "this is a {kind of tag}".
 *
 * Lives next to the types so adding a new taxonomy type touches one file —
 * add a `TAG_TYPES` entry, a `--color-tag-{type}` token, and one line here.
 */
const SINGULAR_LABEL: Record<TagType, string> = {
  roles: "Role",
  languages: "Language",
  technologies: "Technology",
  libraries: "Library",
  domains: "Domain",
  concepts: "Concept",
  scale: "Scale",
  soft_skills: "Soft skill",
};

export function tagTypeLabel(type: TagType): string {
  return SINGULAR_LABEL[type];
}
