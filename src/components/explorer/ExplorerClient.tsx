"use client";

import { useMemo, useState } from "react";
import { StickyContactPill } from "@/components/contact/StickyContactPill";
import { SearchBar } from "@/components/search/SearchBar";
import { StarterChips } from "@/components/search/StarterChips";
import { ActiveFilterChips } from "@/components/filters/ActiveFilterChips";
import { ExperienceDrawer } from "@/components/explorer/ExperienceDrawer";
import { ExperienceGrid } from "@/components/explorer/ExperienceGrid";
import { FeaturedRoles } from "@/components/explorer/FeaturedRoles";
import { TagIndexProvider } from "@/components/tags/TagIndex";
import type { ExperienceEntry } from "@/lib/experience/types";
import type { LandingData } from "@/lib/explorer/landing-data";
import { useFilterTags } from "@/lib/filters/use-filter-tags";
import { useTranslations } from "@/i18n/I18nProvider";

/**
 * ExplorerClient — the landing page's only client island: featured roles
 * (they open the drawer), the "Filter by skill" section, the drawer and the
 * mobile contact pill.
 *
 * It receives everything pre-computed from the server (`buildLandingData`):
 * localized, trimmed entries and a small tag index. It never imports the
 * repositories, so experience.json and taxonomy.json stay out of the
 * browser bundle. The Hero before it and `LandingTail` after it are server
 * components (see `Landing`).
 */
export type ExplorerClientProps = Omit<LandingData, "years"> & {
  /** Hero's DOM id: the sticky pill appears once it scrolls away. */
  heroId: string;
  /** Featured section id: the hero's primary CTA scrolls here. */
  workId: string;
  /** Landing contact block id: the sticky pill yields to it. */
  contactId: string;
};

const FILTER_ID = "discover";

export function ExplorerClient({
  entries,
  featuredIds,
  searchable,
  starters,
  tagIndex,
  heroId,
  workId,
  contactId,
}: ExplorerClientProps) {
  const t = useTranslations();

  const featured = useMemo(() => {
    const byId = new Map(entries.map((e) => [e.id, e]));
    return featuredIds.flatMap((id) => byId.get(id) ?? []);
  }, [entries, featuredIds]);
  const tagsBySlug = useMemo(() => new Map(Object.entries(tagIndex)), [tagIndex]);
  const starterSlugs = useMemo(() => starters.map((s) => s.slug), [starters]);

  const filter = useFilterTags();
  const activeSlugs = filter.slugs;

  const [selected, setSelected] = useState<ExperienceEntry | null>(null);
  const handleSelect = (entry: ExperienceEntry) => setSelected(entry);
  const handleClose = () => setSelected(null);

  return (
    <TagIndexProvider index={tagIndex}>
      <FeaturedRoles id={workId} entries={featured} onSelect={handleSelect} />

      <section
        id={FILTER_ID}
        aria-labelledby="discover-title"
        className="scroll-mt-24 px-6 py-16 sm:py-20"
      >
        <div className="mx-auto max-w-6xl space-y-10">
          <header className="space-y-2 text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-text-secondary">
              {t("discover.eyebrow")}
            </p>
            <h2
              id="discover-title"
              className="text-3xl sm:text-4xl font-semibold tracking-tight text-text-primary"
            >
              {t("discover.title")}
            </h2>
            <p className="mx-auto max-w-xl text-base text-text-secondary leading-relaxed">
              {t("discover.subtitle")}
            </p>
          </header>

          <div className="space-y-5">
            <SearchBar
              suggestions={searchable}
              topSuggestions={starterSlugs}
              excludeSlugs={activeSlugs}
              onSelect={filter.add}
            />
            <ActiveFilterChips
              slugs={activeSlugs}
              taxonomyBySlug={tagsBySlug}
              onRemove={filter.remove}
              onClear={filter.clear}
            />
            <StarterChips
              tags={starters}
              activeSlugs={activeSlugs}
              onSelect={filter.add}
            />
          </div>

          <ExperienceGrid
            entries={entries}
            activeSlugs={activeSlugs}
            featuredFallback={featured}
            onSelect={handleSelect}
            onTagSelect={filter.add}
          />
        </div>
      </section>

      <ExperienceDrawer entry={selected} onClose={handleClose} />
      <StickyContactPill
        watchId={heroId}
        suppressed={selected !== null}
        hideWhenVisibleId={contactId}
      />
    </TagIndexProvider>
  );
}
