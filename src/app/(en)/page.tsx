"use client";

import { useMemo, useState } from "react";
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
import { taxonomyRepository } from "@/lib/taxonomy/json-repository";
import { topTagsByUsage } from "@/lib/taxonomy/top-tags";

/**
 * Explorer (`/`) — landing page (plan §6).
 *
 * Assembles all four zones:
 *   Zone 1  Hero                — name + animated role line + CTAs
 *   Zone 2  Search & Discovery  — SearchBar + ActiveFilterChips + role shortcuts
 *   Zone 3  Stats Bar           — filter-reactive stat cards
 *   Zone 4  Experience Cards    — sort + count + CSV export + grid + empty state
 *
 * Filter state lives in `useFilterTags`, URL-synced via `?tags=…` so views
 * are shareable. Data flows from typed repositories — components never
 * import the JSON files directly (DIP).
 */

const ZONE_2_ID = "discover";

export default function ExplorerPage() {
  const entries = useMemo(() => experienceRepository.getAll(), []);
  const taxonomy = useMemo(() => taxonomyRepository.getAll(), []);
  const featured = useMemo(() => entries.filter((e) => e.featured), [entries]);

  // Roles that actually appear in entries → drives Hero animation + shortcuts
  const usedRoles = useMemo(() => collectUsedRoles(entries), [entries]);
  const roleLabels = useMemo(
    () =>
      usedRoles.length > 0
        ? usedRoles.map(
            (slug) =>
              taxonomyRepository.getBySlug(slug)?.display_name ?? slug,
          )
        : [siteConfig.title],
    [usedRoles],
  );
  const shortcutRoles = useMemo(
    () =>
      taxonomyRepository
        .getByType("roles")
        .filter((r) => roleUsageCount(entries, r.slug) >= 2),
    [entries],
  );

  const topTags = useMemo(() => topTagsByUsage(entries, 6), [entries]);

  const filter = useFilterTags();
  const activeSlugs = filter.slugs;

  const [selected, setSelected] = useState<ExperienceEntry | null>(null);

  const taxonomyBySlug = useMemo(
    () => new Map(taxonomy.map((t) => [t.slug, t])),
    [taxonomy],
  );

  const handleSelect = (entry: ExperienceEntry) => setSelected(entry);
  const handleClose = () => setSelected(null);

  return (
    <>
      {/* ── Zone 1 — Hero ──────────────────────────────────────────── */}
      <Hero
        name={siteConfig.name}
        positioningStatement={siteConfig.positioningStatement}
        roleLabels={roleLabels}
        exploreTargetId={ZONE_2_ID}
      />

      {/* ── Zone 2 — Search & Discovery + Zone 3 — Stats + Zone 4 — Grid ── */}
      <section
        id={ZONE_2_ID}
        aria-labelledby="discover-title"
        className="scroll-mt-24 px-6 py-16 sm:py-20"
      >
        <div className="mx-auto max-w-6xl space-y-10">
          <header className="space-y-2 text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-text-secondary">
              Discover
            </p>
            <h2
              id="discover-title"
              className="text-3xl sm:text-4xl font-semibold tracking-tight text-text-primary"
            >
              What are you looking for?
            </h2>
            <p className="mx-auto max-w-xl text-base text-text-secondary leading-relaxed">
              Search by skill, tool, or role. The cards and stats reshape to
              match what you pick.
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
    </>
  );
}

/* ── helpers ─────────────────────────────────────────────────────────── */

/** Distinct role slugs that appear in any entry, in document order. */
function collectUsedRoles(entries: readonly ExperienceEntry[]): string[] {
  const seen = new Set<string>();
  for (const entry of entries) {
    for (const slug of entry.tags.roles ?? []) seen.add(slug);
  }
  return Array.from(seen);
}

function roleUsageCount(entries: readonly ExperienceEntry[], slug: string): number {
  let n = 0;
  for (const e of entries) {
    if ((e.tags.roles ?? []).includes(slug)) n++;
  }
  return n;
}
