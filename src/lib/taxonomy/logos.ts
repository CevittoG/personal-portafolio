import type { ITaxonomyRepository } from "./repository";
import type { TaxonomyEntry } from "./types";

/**
 * Logo source for the Hero cluster (plan §6 Zone 1, step 17).
 *
 * Returns every taxonomy entry that has a non-null `image`, deduplicated by
 * image URL so identical CDN logos (rare but possible across types) don't
 * appear twice. Order is taxonomy order so the seed is stable across runs.
 *
 * Lives in `src/lib/taxonomy/` (DIP) so the Explorer page can pass the
 * derived list down to `LogoDropCluster` without the component reaching
 * into the repository itself.
 */
export interface LogoSource {
  slug: string;
  label: string;
  image: string;
}

export function logoSourcesFromTaxonomy(
  repo: ITaxonomyRepository,
): LogoSource[] {
  const all = repo.getAll();
  const seen = new Set<string>();
  const result: LogoSource[] = [];
  for (const entry of all) {
    if (!hasImage(entry)) continue;
    const image = entry.image!;
    if (seen.has(image)) continue;
    seen.add(image);
    result.push({
      slug: entry.slug,
      label: entry.display_name,
      image,
    });
  }
  return result;
}

function hasImage(entry: TaxonomyEntry): boolean {
  return typeof entry.image === "string" && entry.image.length > 0;
}
