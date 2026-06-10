"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { TagPill } from "@/components/tags/TagPill";
import { tagTypeLabel } from "@/lib/taxonomy/labels";
import { useTranslations } from "@/i18n/I18nProvider";
import { track } from "@/lib/analytics/umami";
import type { TaxonomyEntry } from "@/lib/taxonomy/types";
import { cn } from "@/lib/utils";

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
 */
export interface ActiveFilterChipsProps {
  /** Currently active tag slugs. Order is preserved in the rendered row. */
  slugs: readonly string[];
  /** Slug → TaxonomyEntry lookup, supplied by the page so this component
   *  stays decoupled from the repository (DIP). Unknown slugs are skipped. */
  taxonomyBySlug: ReadonlyMap<string, TaxonomyEntry>;
  onRemove: (slug: string) => void;
  onClear: () => void;
  className?: string;
}

export function ActiveFilterChips({
  slugs,
  taxonomyBySlug,
  onRemove,
  onClear,
  className,
}: ActiveFilterChipsProps) {
  const reduceMotion = useReducedMotion();
  const t = useTranslations();
  if (slugs.length === 0) return null;

  const chipMotion = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, scale: 0.92, y: -2 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.92, y: -2 },
        transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] as const },
        layout: true,
      };

  return (
    <div
      role="region"
      aria-label={t("filters.region")}
      className={cn(
        "flex flex-wrap items-center gap-2",
        className,
      )}
    >
      <AnimatePresence initial={false}>
        {slugs.map((slug) => {
          const tag = taxonomyBySlug.get(slug);
          if (!tag) return null;
          return (
            <motion.span key={slug} {...chipMotion} className="inline-flex">
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
            </motion.span>
          );
        })}
      </AnimatePresence>
      <button
        type="button"
        onClick={onClear}
        className={cn(
          "ml-auto cursor-pointer text-xs text-text-secondary",
          "hover:text-text-primary transition-colors duration-150",
          "focus-visible:outline-none focus-visible:underline",
        )}
      >
        {t("filters.clearAll")}
      </button>
    </div>
  );
}
