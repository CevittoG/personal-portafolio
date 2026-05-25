"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ExperienceCard } from "@/components/experience/ExperienceCard";
import { downloadCsv, entriesToCsv } from "@/lib/experience/csv";
import { defaultFilterStrategy } from "@/lib/filters/tag-match";
import {
  SORT_IDS,
  type SortId,
  sortEntries,
} from "@/lib/experience/sort";
import type { ExperienceEntry } from "@/lib/experience/types";
import { useTranslations } from "@/i18n/I18nProvider";
import type { MessageKey } from "@/i18n/translator";
import { cn } from "@/lib/utils";

const SORT_KEYS: Record<SortId, MessageKey> = {
  recent: "grid.sortRecent",
  relevant: "grid.sortRelevant",
};

const EASE_OUT_QUINT: [number, number, number, number] = [0.22, 1, 0.36, 1];

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
  const t = useTranslations();
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

  const reduceMotion = useReducedMotion();
  // Stagger first paint reveal across the visible cards; filter changes
  // get a quieter same-position fade via `layout`. Layer A of plan §15.
  const cardMotion = (index: number) =>
    reduceMotion
      ? {}
      : ({
          initial: { opacity: 0, y: 8 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -4 },
          transition: {
            duration: 0.32,
            delay: Math.min(index * 0.05, 0.4),
            ease: EASE_OUT_QUINT,
          },
          layout: true,
        } as const);

  return (
    <div className={cn("space-y-5", className)}>
      {/* Secondary filter bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-3">
          <label
            htmlFor="grid-sort"
            className="text-xs uppercase tracking-wider text-text-secondary"
          >
            {t("grid.sortLabel")}
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
                {t(SORT_KEYS[id])}
              </option>
            ))}
          </select>
          <span className="text-xs text-text-muted">
            {t("grid.showing", { visible: sorted.length, total: entries.length })}
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
          {t("grid.download")}
        </button>
      </div>

      {/* Grid or empty state */}
      {!isEmpty && (
        <motion.div layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence initial={true}>
            {sorted.map((entry, i) => (
              <motion.div key={entry.id} {...cardMotion(i)}>
                <ExperienceCard
                  entry={entry}
                  filterTags={activeSlugs as string[]}
                  onSelect={onSelect ? () => onSelect(entry) : undefined}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {isEmpty && (
        <div
          className={cn(
            "rounded-2xl border border-dashed border-border bg-surface/30",
            "px-6 py-10 text-center",
          )}
        >
          <p className="text-sm text-text-primary font-medium">
            {t("grid.emptyTitle")}
          </p>
          <p className="mt-1 text-sm text-text-secondary">
            {t("grid.emptyHint")}
          </p>
          {showFallback && (
            <div className="mt-8 text-left">
              <p className="mb-3 text-xs uppercase tracking-wider text-text-muted text-center">
                {t("grid.featuredInstead")}
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
