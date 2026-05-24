"use client";

import { useMemo, useState } from "react";
import { ExperienceCard } from "@/components/experience/ExperienceCard";
import { downloadCsv, entriesToCsv } from "@/lib/experience/csv";
import { defaultFilterStrategy } from "@/lib/filters/tag-match";
import {
  SORT_IDS,
  SORT_LABELS,
  type SortId,
  sortEntries,
} from "@/lib/experience/sort";
import type { ExperienceEntry } from "@/lib/experience/types";
import { cn } from "@/lib/utils";

/**
 * ExperienceGrid — Explorer Zone 4 (plan §6).
 *
 * Wraps the card grid with the secondary filter bar (sort + count + CSV
 * download) and an explicit empty state with featured-entry fallback.
 *
 * Owns its own UI state (`sort` selection); receives entries and active
 * filter slugs from the page. Filtering is performed inside via the default
 * AllTagsMatch strategy — swap by passing a different strategy through if
 * needed later (Strategy/DIP).
 */
export interface ExperienceGridProps {
  entries: readonly ExperienceEntry[];
  activeSlugs: readonly string[];
  /** Called when the user clicks a card → opens the drawer (step 11). */
  onSelect?: (entry: ExperienceEntry) => void;
  /** When activeSlugs is empty AND there are no entries, show these as a
   *  fallback (plan §6 Zone 4 empty state). */
  featuredFallback?: readonly ExperienceEntry[];
  className?: string;
}

export function ExperienceGrid({
  entries,
  activeSlugs,
  onSelect,
  featuredFallback,
  className,
}: ExperienceGridProps) {
  const [sort, setSort] = useState<SortId>("recent");

  const filtered = useMemo(
    () => entries.filter((e) => defaultFilterStrategy.matches(e, activeSlugs as string[])),
    [entries, activeSlugs],
  );

  const sorted = useMemo(
    () => sortEntries(filtered, sort, activeSlugs),
    [filtered, sort, activeSlugs],
  );

  const isEmpty = sorted.length === 0;
  const showFallback = isEmpty && (featuredFallback?.length ?? 0) > 0;
  const fallback = useMemo(
    () =>
      featuredFallback
        ? [...featuredFallback].slice(0, 3)
        : ([] as ExperienceEntry[]),
    [featuredFallback],
  );

  const handleDownload = () => {
    const csv = entriesToCsv(sorted.length > 0 ? sorted : entries);
    const stamp = new Date().toISOString().slice(0, 10);
    downloadCsv(csv, `experience-${stamp}.csv`);
  };

  return (
    <div className={cn("space-y-5", className)}>
      {/* Secondary filter bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-3">
          <label
            htmlFor="grid-sort"
            className="text-xs uppercase tracking-wider text-text-secondary"
          >
            Sort
          </label>
          <select
            id="grid-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortId)}
            className={cn(
              "cursor-pointer rounded-md border border-border bg-surface",
              "px-3 py-1.5 text-sm text-text-primary",
              "hover:border-text-muted transition-colors duration-150",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-accent focus-visible:ring-offset-2",
              "focus-visible:ring-offset-bg",
            )}
          >
            {SORT_IDS.map((id) => (
              <option key={id} value={id}>
                {SORT_LABELS[id]}
              </option>
            ))}
          </select>
          <span className="text-xs text-text-muted">
            Showing {sorted.length} of {entries.length}
          </span>
        </div>

        <button
          type="button"
          onClick={handleDownload}
          disabled={entries.length === 0}
          className={cn(
            "inline-flex items-center gap-2 rounded-md border border-border",
            "bg-surface px-3 py-1.5 text-xs font-medium text-text-secondary",
            "hover:text-text-primary hover:border-text-muted transition-colors duration-150",
            "focus-visible:outline-none focus-visible:ring-2",
            "focus-visible:ring-accent focus-visible:ring-offset-2",
            "focus-visible:ring-offset-bg",
            "disabled:cursor-not-allowed disabled:opacity-50",
          )}
        >
          <span aria-hidden="true">↓</span>
          Download filtered profile
        </button>
      </div>

      {/* Grid or empty state */}
      {!isEmpty && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((entry) => (
            <ExperienceCard
              key={entry.id}
              entry={entry}
              filterTags={activeSlugs as string[]}
              onSelect={onSelect ? () => onSelect(entry) : undefined}
            />
          ))}
        </div>
      )}

      {isEmpty && (
        <div
          className={cn(
            "rounded-2xl border border-dashed border-border bg-surface/30",
            "px-6 py-10 text-center",
          )}
        >
          <p className="text-sm text-text-primary font-medium">
            No experiences match these filters.
          </p>
          <p className="mt-1 text-sm text-text-secondary">
            Try removing a tag or broadening your search.
          </p>
          {showFallback && (
            <div className="mt-8 text-left">
              <p className="mb-3 text-xs uppercase tracking-wider text-text-muted text-center">
                Featured instead
              </p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {fallback.map((entry) => (
                  <ExperienceCard
                    key={entry.id}
                    entry={entry}
                    filterTags={[]}
                    onSelect={onSelect ? () => onSelect(entry) : undefined}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
