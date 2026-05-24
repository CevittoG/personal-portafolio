"use client";

import { useMemo, useState } from "react";
import { ExperienceCard } from "@/components/experience/ExperienceCard";
import { ActiveFilterChips } from "@/components/filters/ActiveFilterChips";
import { SearchBar } from "@/components/search/SearchBar";
import { TagPill, type TagPillState } from "@/components/tags/TagPill";
import type { ExperienceEntry } from "@/lib/experience/types";
import { useFilterTags } from "@/lib/filters/use-filter-tags";
import { topTagsByUsage } from "@/lib/taxonomy/top-tags";
import {
  TAG_TYPES,
  type TagType,
  type TaxonomyEntry,
} from "@/lib/taxonomy/types";

const STATES: TagPillState[] = ["active", "inactive", "muted", "removable"];

/* ── Mock entries (preview only — taxonomy.json/experience.json are still
   empty seeds; real data lands via the /portfolio-json-builder skill). ── */
const MOCK_ENTRIES: ExperienceEntry[] = [
  {
    id: "demo-uplanner-data-engineer-2022",
    type: "job",
    title: "Data Engineer",
    company: { name: "uPlanner", url: null, industry: "EdTech" },
    location: "Remote · LATAM",
    employment_type: "full-time",
    team: "Analytics Platform",
    period: { start: "2022-03", end: null },
    summary:
      "Lead ETL across multi-tenant EdTech analytics. Snowflake + Airflow stack feeding institution-facing dashboards.",
    description: "",
    tags: {
      roles: ["data-engineer"],
      languages: ["python", "sql"],
      technologies: ["snowflake", "airflow", "aws"],
      libraries: ["pandas", "fastapi"],
      domains: ["edtech", "analytics"],
      concepts: ["etl", "data-pipelines"],
      scale: ["production-system"],
      soft_skills: ["communication"],
    },
    impact: [
      "15M+ rows processed daily across 40+ institutions",
      "Cut nightly batch from 4h to 38min",
    ],
    media: [],
    featured: true,
  },
  {
    id: "demo-aidprof-cofounder-2020",
    type: "project",
    title: "AidProf — Co-founder",
    status: "ongoing",
    client: null,
    period: { start: "2020-08", end: null },
    summary:
      "Built a SaaS that helps teachers structure feedback at scale. Wore every hat — product, backend, fundraising.",
    description: "",
    tags: {
      roles: ["full-stack", "founder"],
      languages: ["typescript", "python"],
      technologies: ["postgres", "docker"],
      libraries: ["fastapi", "nextjs"],
      domains: ["edtech", "saas"],
      concepts: ["rest-apis", "rag"],
      scale: ["greenfield"],
      soft_skills: ["leadership", "communication"],
    },
    impact: ["100+ institutions onboarded in pilot phase"],
    media: [],
    featured: true,
  },
];

/** Synthesize a TaxonomyEntry for every slug present in MOCK_ENTRIES so the
 *  SearchBar has something to suggest while taxonomy.json is still empty. */
function mockTaxonomy(): TaxonomyEntry[] {
  const seen = new Map<string, TaxonomyEntry>();
  for (const entry of MOCK_ENTRIES) {
    for (const type of TAG_TYPES) {
      for (const slug of entry.tags[type] ?? []) {
        if (seen.has(slug)) continue;
        seen.set(slug, {
          slug,
          display_name: titleize(slug),
          type: type as TagType,
          icon: null,
          image: null,
          color: null,
          related: [],
        });
      }
    }
  }
  return Array.from(seen.values());
}

function titleize(slug: string): string {
  return slug
    .split(/[-_]/)
    .map((w) =>
      w.length <= 3 ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1),
    )
    .join(" ");
}

export default function ExplorerPage() {
  const [removed, setRemoved] = useState<Record<string, boolean>>({});
  const filter = useFilterTags();
  const activeSlugs = filter.slugs;

  const taxonomy = useMemo(mockTaxonomy, []);
  const topTags = useMemo(() => topTagsByUsage(MOCK_ENTRIES, 6), []);

  const taxonomyBySlug = useMemo(
    () => new Map(taxonomy.map((t) => [t.slug, t])),
    [taxonomy],
  );

  return (
    <main className="px-6 py-12 sm:py-16">
      <div className="mx-auto max-w-6xl space-y-12">
        <header className="space-y-3 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-text-secondary">
            Shape in progress — Build Order step 8 landed
          </p>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-text-primary">
            Component playground
          </h1>
          <p className="text-base text-text-secondary leading-relaxed mx-auto max-w-xl">
            SearchBar drives the live filter below. Picks become removable
            chips synced to the URL (`?tags=…`) — refresh, share, or hit back
            and the state survives. Real Explorer assembly lands at step 10.
          </p>
        </header>

        {/* ── Search + active filter chips + cards ──────────────────── */}
        <section
          aria-labelledby="card-demo"
          className="rounded-2xl border border-border bg-surface/30 p-6 sm:p-8 space-y-6"
        >
          <div className="flex items-baseline justify-between gap-4 flex-wrap">
            <h2
              id="card-demo"
              className="text-sm uppercase tracking-wider text-text-secondary"
            >
              Search & Discovery
            </h2>
            <p className="text-xs text-text-muted">
              {activeSlugs.length === 0
                ? "No filter"
                : `Filtering by ${activeSlugs.length} tag${activeSlugs.length === 1 ? "" : "s"}`}
            </p>
          </div>

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

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MOCK_ENTRIES.map((entry) => (
              <ExperienceCard
                key={entry.id}
                entry={entry}
                filterTags={activeSlugs}
                onSelect={() =>
                  console.info("drawer trigger (step 11)", entry.id)
                }
              />
            ))}
          </div>
        </section>

        {/* ── Tag Pill matrix (kept for visual sanity) ──────────────── */}
        <section
          aria-labelledby="tagpill-matrix"
          className="rounded-2xl border border-border bg-surface/30 p-6 sm:p-8"
        >
          <h2
            id="tagpill-matrix"
            className="text-sm uppercase tracking-wider text-text-secondary mb-6"
          >
            Tag Pill — type × state matrix
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-y-3 text-sm">
              <thead>
                <tr className="text-left text-text-secondary">
                  <th className="pr-6 font-normal text-xs uppercase tracking-wider">
                    Type
                  </th>
                  {STATES.map((s) => (
                    <th
                      key={s}
                      className="pr-6 font-normal text-xs uppercase tracking-wider"
                    >
                      {s}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TAG_TYPES.map((type) => {
                  const label = type.replace("_", " ");
                  return (
                    <tr key={type}>
                      <td className="pr-6 text-text-secondary align-middle">
                        {label}
                      </td>
                      {STATES.map((state) => {
                        const key = `${type}:${state}`;
                        if (state === "removable" && removed[key]) {
                          return (
                            <td key={state} className="pr-6 align-middle">
                              <button
                                type="button"
                                onClick={() =>
                                  setRemoved((r) => ({ ...r, [key]: false }))
                                }
                                className="text-xs text-text-muted hover:text-text-secondary cursor-pointer transition-colors"
                              >
                                restore →
                              </button>
                            </td>
                          );
                        }
                        return (
                          <td key={state} className="pr-6 align-middle">
                            <TagPill
                              slug={`${type}-${state}-demo`}
                              label={label}
                              type={type}
                              state={state}
                              onRemove={
                                state === "removable"
                                  ? () =>
                                      setRemoved((r) => ({
                                        ...r,
                                        [key]: true,
                                      }))
                                  : undefined
                              }
                            />
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <p className="text-center text-xs text-text-muted">
          Next: Build Order step 9 — Stats Bar wired to filtered entries.
        </p>
      </div>
    </main>
  );
}
