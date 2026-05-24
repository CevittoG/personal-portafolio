import { taxonomyRepository } from "./json-repository";

/**
 * Resolve a tag slug to its display label.
 * - When the slug exists in taxonomy → returns its `display_name`.
 * - Otherwise → titleizes the slug ("data-engineer" → "Data Engineer").
 *
 * The fallback keeps components renderable while `taxonomy.json` is still
 * being populated. Once real data lands, the fallback becomes a no-op.
 */
export function formatTagLabel(slug: string): string {
  const entry = taxonomyRepository.getBySlug(slug);
  if (entry) return entry.display_name;
  return titleize(slug);
}

function titleize(slug: string): string {
  return slug
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((word) =>
      word.length <= 3
        ? word.toUpperCase()
        : word[0].toUpperCase() + word.slice(1),
    )
    .join(" ");
}
