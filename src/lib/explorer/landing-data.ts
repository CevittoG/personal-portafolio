import "server-only";
import type { Locale } from "@/i18n/locale";
import { toClientEntry } from "@/lib/experience/client-entry";
import { experienceRepository } from "@/lib/experience/json-repository";
import { localizeEntry } from "@/lib/experience/localize";
import { sortEntries } from "@/lib/experience/sort";
import type { ExperienceEntry } from "@/lib/experience/types";
import { isSearchable } from "@/lib/search/scope";
import { STARTER_TAGS } from "@/lib/search/starters";
import { getEngineeringYears } from "@/lib/site/profile";
import { taxonomyRepository } from "@/lib/taxonomy/json-repository";
import { buildTagIndex, tagRef } from "@/lib/taxonomy/tag-index";
import { TAG_TYPES, type TagRef } from "@/lib/taxonomy/types";

/**
 * Everything the landing page's client island needs, computed on the
 * server so the browser never loads experience.json or taxonomy.json.
 */
export interface LandingData {
  /** Relevant entries, localized and trimmed (`toClientEntry`). */
  entries: ExperienceEntry[];
  /** The engineering roles, most recent first (featured section). */
  featuredIds: string[];
  /** Tags the search offers. */
  searchable: TagRef[];
  /** Curated starter chips. */
  starters: TagRef[];
  /** Labels and types for every tag the island can show or filter by. */
  tagIndex: Record<string, TagRef>;
  /** Whole years in engineering, for the hero proof line. */
  years: number;
}

export function buildLandingData(locale: Locale): LandingData {
  const entries = experienceRepository
    .getRelevant()
    .map((entry) => toClientEntry(localizeEntry(entry, locale)));
  const featuredIds = sortEntries(
    entries.filter((e) => e.story_act === "technical"),
    "recent",
    [],
  ).map((e) => e.id);

  const searchable = taxonomyRepository.getAll().filter(isSearchable).map(tagRef);
  const starters = STARTER_TAGS.flatMap((slug) => {
    const tag = taxonomyRepository.getBySlug(slug);
    return tag ? [tagRef(tag)] : [];
  });

  const slugs = new Set(searchable.map((t) => t.slug));
  for (const entry of entries) {
    for (const type of TAG_TYPES) for (const slug of entry.tags[type]) slugs.add(slug);
  }

  return {
    entries,
    featuredIds,
    searchable,
    starters,
    tagIndex: buildTagIndex(slugs),
    years: getEngineeringYears(),
  };
}
