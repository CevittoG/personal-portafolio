"use client";

import { useMemo, useState } from "react";
import { StickyContactPill } from "@/components/contact/StickyContactPill";
import { Hero } from "@/components/hero/Hero";
import { SearchBar } from "@/components/search/SearchBar";
import { StarterChips } from "@/components/search/StarterChips";
import { ActiveFilterChips } from "@/components/filters/ActiveFilterChips";
import { ExperienceDrawer } from "@/components/explorer/ExperienceDrawer";
import { ExperienceGrid } from "@/components/explorer/ExperienceGrid";
import { FeaturedRoles } from "@/components/explorer/FeaturedRoles";
import { experienceRepository } from "@/lib/experience/json-repository";
import { localizeEntry } from "@/lib/experience/localize";
import { sortEntries } from "@/lib/experience/sort";
import type { ExperienceEntry } from "@/lib/experience/types";
import { useFilterTags } from "@/lib/filters/use-filter-tags";
import { isSearchable } from "@/lib/search/scope";
import { STARTER_TAGS } from "@/lib/search/starters";
import { siteConfig } from "@/lib/site/config";
import { yearsInEngineering } from "@/lib/stats/years-in-engineering";
import { taxonomyRepository } from "@/lib/taxonomy/json-repository";
import type { TaxonomyEntry } from "@/lib/taxonomy/types";
import { useLocale, useTranslations } from "@/i18n/I18nProvider";

/**
 * Explorer — the interactive part of the landing page, shared by `/` and
 * `/es` (locale comes from the surrounding `I18nProvider`).
 *
 * Narrative first (plan §6, Phase 4):
 *   1. Hero
 *   2. Featured roles: the three engineering roles with their results
 *   3. "Filter by skill": search, starter chips and the filterable grid
 * The Story teaser and Contact block follow as server components
 * (`LandingTail`), rendered by the page after this component.
 */
const HERO_ID = "hero";
const WORK_ID = "work";
const FILTER_ID = "discover";
/** The Contact block in `LandingTail`; the sticky pill yields to it. */
const LANDING_CONTACT_ID = "landing-contact";

export function Explorer() {
  const t = useTranslations();
  const locale = useLocale();

  // Discover operates only on entries flagged as relevant (professional/
  // technical experience). Prose (summary, top impact lines, reflective
  // line) is in the active locale when a translation exists.
  const entries = useMemo(
    () =>
      experienceRepository
        .getRelevant()
        .map((entry) => localizeEntry(entry, locale)),
    [locale],
  );
  // The engineering roles, most recent first: the featured section and the
  // grid's empty-state fallback.
  const featured = useMemo(
    () =>
      sortEntries(
        entries.filter((e) => e.story_act === "technical"),
        "recent",
        [],
      ),
    [entries],
  );

  // Whole years only, so the proof line reads "5+ years" and never
  // overstates what the entry dates show.
  const engineeringYears = useMemo(
    () => Math.floor(yearsInEngineering(entries)),
    [entries],
  );

  // Search offers tools, roles and a few recruiter-facing concepts; the
  // starter chips are curated, not usage-ranked.
  const searchable = useMemo(
    () => taxonomyRepository.getAll().filter(isSearchable),
    [],
  );
  const starters = useMemo(
    () =>
      STARTER_TAGS.map((slug) => taxonomyRepository.getBySlug(slug)).filter(
        (tag): tag is TaxonomyEntry => Boolean(tag),
      ),
    [],
  );
  const taxonomyBySlug = useMemo(
    () => new Map(taxonomyRepository.getAll().map((tag) => [tag.slug, tag])),
    [],
  );

  const filter = useFilterTags();
  const activeSlugs = filter.slugs;

  const [selected, setSelected] = useState<ExperienceEntry | null>(null);
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
        exploreTargetId={WORK_ID}
        id={HERO_ID}
      />

      <FeaturedRoles id={WORK_ID} entries={featured} onSelect={handleSelect} />

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
              topSuggestions={STARTER_TAGS}
              excludeSlugs={activeSlugs}
              onSelect={filter.add}
            />
            <ActiveFilterChips
              slugs={activeSlugs}
              taxonomyBySlug={taxonomyBySlug}
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
        watchId={HERO_ID}
        suppressed={selected !== null}
        hideWhenVisibleId={LANDING_CONTACT_ID}
      />
    </>
  );
}
