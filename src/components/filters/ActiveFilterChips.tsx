"use client";

import { useEffect, useRef } from "react";
import * as m from "motion/react-m";
import { AnimatePresence, useReducedMotion } from "motion/react";
import { TagPill } from "@/components/tags/TagPill";
import { tagTypeLabel } from "@/lib/taxonomy/labels";
import { useTranslations } from "@/i18n/I18nProvider";
import { track } from "@/lib/analytics/umami";
import { DURATION, EASE_OUT_QUINT } from "@/lib/motion/tokens";
import type { TagRef } from "@/lib/taxonomy/types";
import { cn } from "@/lib/utils";
import type { PillArrival } from "./use-pill-travel";

/**
 * Active Filter Chips (plan §6, Zone 2).
 *
 * Presentational row of removable chips that represent the active filter
 * state. State is owned by the caller (typically `useFilterTags`) — this
 * component only renders and emits events. SRP: it does not know about URLs,
 * search, or which entries are being filtered.
 *
 * Each chip uses the shared `TagPill` primitive (LSP) with the new
 * `sublabel` slot showing the taxonomy type ("Python · Language"), and a
 * "Clear all" link sits at the end of the row.
 *
 * The row always takes its one line of height, with a hint when no filter
 * is active, so adding the first filter never pushes the results down.
 * With filters it sticks under the navbar for as long as its parent is in
 * view (render it as the first child of the results), on an opaque surface
 * with a border that appears only while stuck. On phones the chips are one
 * horizontally scrolling line, so several filters never eat the viewport.
 */
export interface ActiveFilterChipsProps {
  /** Currently active tag slugs. Order is preserved in the rendered row. */
  slugs: readonly string[];
  /** Slug → tag lookup, supplied by the page so this component stays
   *  decoupled from the repository. Unknown slugs are skipped. */
  taxonomyBySlug: ReadonlyMap<string, TagRef>;
  onRemove: (slug: string) => void;
  onClear: () => void;
  /** A chip whose pill is still flying in (`usePillTravel`): it waits. */
  arrival?: PillArrival | null;
  className?: string;
}

/** Navbar height in px: where the row sticks (`top-16`). */
const STICKY_TOP = 64;

export function ActiveFilterChips({
  slugs,
  taxonomyBySlug,
  onRemove,
  onClear,
  arrival,
  className,
}: ActiveFilterChipsProps) {
  const reduceMotion = useReducedMotion();
  const t = useTranslations();
  const rowRef = useRef<HTMLDivElement>(null);
  const hasFilters = slugs.length > 0;

  // Mark the row while it is stuck, so the border shows only then. An
  // attribute, not state: nothing else needs to re-render for a border.
  // Two thresholds: 1 catches a scroll that reaches the navbar, 0 a jump
  // straight from off screen to stuck (an anchor, a programmatic scroll).
  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const observer = new IntersectionObserver(
      ([entry]) =>
        row.toggleAttribute(
          "data-stuck",
          entry.intersectionRatio < 1 && entry.boundingClientRect.top <= STICKY_TOP + 1,
        ),
      { rootMargin: `-${STICKY_TOP + 1}px 0px 0px 0px`, threshold: [0, 1] },
    );
    observer.observe(row);
    return () => observer.disconnect();
  }, []);

  const chipMotion = (slug: string) => {
    if (reduceMotion) return {};
    const quick = { duration: DURATION.quick, ease: EASE_OUT_QUINT };
    return {
      initial: { opacity: 0, scale: 0.92, y: -2 },
      animate: { opacity: 1, scale: 1, y: 0 },
      exit: { opacity: 0, scale: 0.92, y: -2, transition: quick },
      transition: {
        ...quick,
        delay: arrival?.slug === slug ? arrival.delay : 0,
        layout: quick,
      },
      layout: true,
    };
  };

  return (
    <div
      ref={rowRef}
      role="region"
      aria-label={t("filters.region")}
      className={cn(
        "flex min-h-11 items-center gap-3",
        hasFilters && [
          "sticky top-16 z-20 bg-bg",
          "border-b border-transparent data-[stuck]:border-border",
        ],
        className,
      )}
    >
      {hasFilters ? (
        <>
          <div
            className={cn(
              // p-1 leaves room for the chips' focus rings inside the scroller.
              "flex min-w-0 flex-1 items-center gap-2 p-1",
              "overflow-x-auto sm:flex-wrap sm:overflow-visible",
              // No scrollbar under the chips: the clipped chip at the edge
              // already says there is more, and the buttons scroll into
              // view on focus.
              "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            )}
          >
            <AnimatePresence initial={false}>
              {slugs.map((slug) => {
                const tag = taxonomyBySlug.get(slug);
                if (!tag) return null;
                return (
                  <m.span
                    key={slug}
                    data-filter-chip={slug}
                    {...chipMotion(slug)}
                    className="inline-flex shrink-0"
                  >
                    <TagPill
                      slug={slug}
                      label={tag.display_name}
                      sublabel={tagTypeLabel(tag.type)}
                      type={tag.type}
                      state="removable"
                      onRemove={() => {
                        track("filter_removed", { slug, type: tag.type });
                        onRemove(slug);
                      }}
                      removeAriaLabel={t("filters.removeTag", { label: tag.display_name })}
                    />
                  </m.span>
                );
              })}
            </AnimatePresence>
          </div>
          <button
            type="button"
            onClick={onClear}
            className={cn(
              "min-h-6 shrink-0 cursor-pointer text-xs text-text-secondary",
              "hover:text-text-primary transition-colors duration-150",
              "focus-visible:outline-none focus-visible:underline",
            )}
          >
            {t("filters.clearAll")}
          </button>
        </>
      ) : (
        <p className="text-sm text-text-muted">{t("filters.empty")}</p>
      )}
    </div>
  );
}
