"use client";

import { useMemo, useState, type ReactNode, type Ref } from "react";
import * as m from "motion/react-m";
import { AnimatePresence, useReducedMotion } from "motion/react";
import { ExperienceCard } from "@/components/experience/ExperienceCard";
import { DURATION, EASE_OUT_QUINT, MAX_STAGGER_DELAY } from "@/lib/motion/tokens";
import { matchesAllTags } from "@/lib/filters/tag-match";
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

/** Matched pills light up card by card: one 50ms step each, capped at 150ms. */
const PILL_DELAY = [
  "[--pill-delay:0ms]",
  "[--pill-delay:50ms]",
  "[--pill-delay:100ms]",
  "[--pill-delay:150ms]",
];

/**
 * ExperienceGrid — Explorer Zone 4 (plan §6).
 *
 * Wraps the card grid with the secondary filter bar (sort + count) and an explicit empty state with featured-entry fallback.
 *
 * On a filter change the cards that stay glide to their new places at once
 * (`popLayout` takes the leaving cards out of the flow), the leaving ones
 * fade quickly, and only entering cards keep the short stagger.
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
  /** Called when the user clicks a pill on a card → adds it to the filter. */
  onTagSelect?: (slug: string) => void;
  /** When activeSlugs is empty AND there are no entries, show these as a
   *  fallback (plan §6 Zone 4 empty state). */
  featuredFallback?: readonly ExperienceEntry[];
  /** Rendered first, above the sort bar: the active-filter row, which
   *  sticks for as long as these results are in view. */
  filterBar?: ReactNode;
  /** The results' root, for scrolling them back into view. */
  ref?: Ref<HTMLDivElement>;
  className?: string;
}

export function ExperienceGrid({
  entries,
  activeSlugs,
  onSelect,
  onTagSelect,
  featuredFallback,
  filterBar,
  ref,
  className,
}: ExperienceGridProps) {
  const t = useTranslations();
  const [sort, setSort] = useState<SortId>("recent");

  const filtered = useMemo(
    () => entries.filter((e) => matchesAllTags(e, activeSlugs)),
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

  const reduceMotion = useReducedMotion();
  // Entering cards stagger in. The stagger must not hold back the cards
  // that stay (their move has its own undelayed `layout` transition) or
  // the ones that leave (a quicker exit of their own).
  const cardMotion = (index: number) =>
    reduceMotion
      ? {}
      : ({
          initial: { opacity: 0, y: 8 },
          animate: { opacity: 1, y: 0 },
          exit: {
            opacity: 0,
            y: -4,
            transition: { duration: DURATION.quick, ease: EASE_OUT_QUINT },
          },
          transition: {
            duration: DURATION.reveal,
            delay: Math.min(index * 0.05, MAX_STAGGER_DELAY),
            ease: EASE_OUT_QUINT,
            layout: { duration: DURATION.reveal, ease: EASE_OUT_QUINT },
          },
          layout: true,
        } as const);

  return (
    <div ref={ref} className={cn("scroll-mt-16 space-y-5", className)}>
      {filterBar}

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
              "cursor-pointer rounded-full border border-border bg-surface",
              "px-4 py-1.5 text-sm text-text-primary",
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
          <span role="status" className="text-xs text-text-muted">
            {t("grid.showing", { visible: sorted.length, total: entries.length })}
          </span>
        </div>
      </div>

      {/* Grid or empty state */}
      {!isEmpty && (
        // relative: popLayout positions the leaving cards against the grid.
        <div className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence initial={true} mode="popLayout">
            {sorted.map((entry, i) => (
              <m.div key={entry.id} {...cardMotion(i)}>
                <ExperienceCard
                  entry={entry}
                  filterTags={activeSlugs as string[]}
                  onSelect={onSelect ? () => onSelect(entry) : undefined}
                  onTagSelect={onTagSelect}
                  className={PILL_DELAY[Math.min(i, PILL_DELAY.length - 1)]}
                />
              </m.div>
            ))}
          </AnimatePresence>
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
                    onTagSelect={onTagSelect}
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
