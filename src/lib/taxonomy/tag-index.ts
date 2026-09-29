import "server-only";
import { taxonomyRepository } from "./json-repository";
import type { TagRef } from "./types";

/**
 * Slug → TagRef for just the tags a page shows, for `TagIndexProvider`.
 * Server-only: this is how client islands get labels without the browser
 * ever loading taxonomy.json. Unknown slugs are skipped.
 */
export function buildTagIndex(slugs: Iterable<string>): Record<string, TagRef> {
  const index: Record<string, TagRef> = {};
  for (const slug of slugs) {
    const tag = taxonomyRepository.getBySlug(slug);
    if (tag) index[slug] = tagRef(tag);
  }
  return index;
}

/** The slim client shape of a taxonomy entry. */
export function tagRef({ slug, display_name, type }: TagRef): TagRef {
  return { slug, display_name, type };
}
