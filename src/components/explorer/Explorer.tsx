"use client";

import { useMemo, useState } from "react";
import { StickyContactPill } from "@/components/contact/StickyContactPill";
import { Hero } from "@/components/hero/Hero";
import { SearchBar } from "@/components/search/SearchBar";
import { RoleShortcuts } from "@/components/search/RoleShortcuts";
import { ActiveFilterChips } from "@/components/filters/ActiveFilterChips";
import { StatsBar } from "@/components/stats/StatsBar";
import { ExperienceDrawer } from "@/components/explorer/ExperienceDrawer";
import { ExperienceGrid } from "@/components/explorer/ExperienceGrid";
import { experienceRepository } from "@/lib/experience/json-repository";
import type { ExperienceEntry } from "@/lib/experience/types";
import { useFilterTags } from "@/lib/filters/use-filter-tags";
import { siteConfig } from "@/lib/site/config";
import { yearsOfExperienceComputer } from "@/lib/stats/computers/years-of-experience";
import { taxonomyRepository } from "@/lib/taxonomy/json-repository";
import { logoSourcesFromTaxonomy } from "@/lib/taxonomy/logos";
import { topTagsByUsage } from "@/lib/taxonomy/top-tags";
import { useTranslations } from "@/i18n/I18nProvider";

/**
 * Explorer — shared across the EN (`/`) and ES (`/es`) routes.
 *
 * Assembles Zones 1–4 per plan §6. Both locale pages render this single
 * component; locale comes from the surrounding `I18nProvider`, which is
 * set by each route's layout. This keeps the page files trivial and avoids
 * duplicating the assembly logic.
 */
const ZONE_2_ID = "discover";
const HERO_ID = "hero";

export function Explorer() {
  const t = useTranslations();
  // Discover operates only on entries flagged as relevant (professional/
  // technical experience). Non-relevant entries stay available for the Story
  // timeline and direct deep-dive links, but never surface here or in stats.
  const entries = useMemo(() => experienceRepository.getRelevant(), []);
  const taxonomy = useMemo(() => taxonomyRepository.getAll(), []);
  const featured = useMemo(() => entries.filter((e) => e.featured), [entries]);

  // Whole years only, so the proof line reads "5+ years" and never
  // overstates what the entry dates show.
  const engineeringYears = useMemo(
    () => Math.floor(yearsOfExperienceComputer.compute(entries)),
    [entries],
  );
  const shortcutRoles = useMemo(
    () =>
      taxonomyRepository
        .getByType("roles")
        .filter((r) => roleUsageCount(entries, r.slug) >= 2),
    [entries],
  );

  const topTags = useMemo(() => topTagsByUsage(entries, 6), [entries]);
  const logos = useMemo(() => logoSourcesFromTaxonomy(taxonomyRepository), []);

  const filter = useFilterTags();
  const activeSlugs = filter.slugs;

  const [selected, setSelected] = useState<ExperienceEntry | null>(null);

  const taxonomyBySlug = useMemo(
    () => new Map(taxonomy.map((tag) => [tag.slug, tag])),
    [taxonomy],
  );

  const handleSelect = (entry: ExperienceEntry) => setSelected(entry);
  const handleClose = () => setSelected(null);

  return (
    <>
      <Hero
        name={siteConfig.name}
        positioningStatement={t("hero.positioningStatement")}
        role={t("hero.role")}
        proofLine={t("hero.proofLine", { years: engineeringYears })}
        availability={{
          open: siteConfig.availability.open,
          label: siteConfig.availability.open
            ? t("contact.availability.open")
            : t("contact.availability.closed"),
        }}
        exploreTargetId={ZONE_2_ID}
        id={HERO_ID}
        logos={logos}
      />

      <section
        id={ZONE_2_ID}
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
              suggestions={taxonomy}
              topSuggestions={topTags}
              excludeSlugs={activeSlugs}
              onSelect={filter.add}
            />
            <ActiveFilterChips
              slugs={activeSlugs}
              taxonomyBySlug={taxonomyBySlug}
              onRemove={filter.remove}
              onClear={filter.clear}
            />
            <RoleShortcuts
              roles={shortcutRoles}
              activeSlugs={activeSlugs}
              onSelect={filter.add}
            />
          </div>

          <StatsBar entries={entries} activeSlugs={activeSlugs} />

          <ExperienceGrid
            entries={entries}
            activeSlugs={activeSlugs}
            featuredFallback={featured}
            onSelect={handleSelect}
          />
        </div>
      </section>

      <ExperienceDrawer entry={selected} onClose={handleClose} />
      <StickyContactPill watchId={HERO_ID} suppressed={selected !== null} />
    </>
  );
}

function roleUsageCount(entries: readonly ExperienceEntry[], slug: string): number {
  let n = 0;
  for (const e of entries) {
    if ((e.tags.roles ?? []).includes(slug)) n++;
  }
  return n;
}
