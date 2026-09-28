"use client";

import { TagPill } from "@/components/tags/TagPill";
import { useTranslations } from "@/i18n/I18nProvider";
import { track } from "@/lib/analytics/umami";
import type { TaxonomyEntry } from "@/lib/taxonomy/types";
import { cn } from "@/lib/utils";

/**
 * StarterChips — the Explorer's one-tap starting points (plan §6 Zone 2).
 *
 * Renders the curated `STARTER_TAGS` (tools and roles a data-platform
 * recruiter searches for) as pills under the search bar. Clicking one
 * delegates to `onSelect`, the same path as picking from the dropdown.
 * Chips are 32px tall so they clear the 24px minimum hit area on touch.
 */
export interface StarterChipsProps {
  tags: readonly TaxonomyEntry[];
  /** Already-selected slugs render as `active` and stop being clickable. */
  activeSlugs: readonly string[];
  onSelect: (slug: string) => void;
  className?: string;
}

export function StarterChips({
  tags,
  activeSlugs,
  onSelect,
  className,
}: StarterChipsProps) {
  const t = useTranslations();
  if (tags.length === 0) return null;
  const active = new Set(activeSlugs);

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <span className="mr-1 text-xs uppercase tracking-wider text-text-muted">
        {t("search.commonSearches")}
      </span>
      {tags.map((tag) => {
        const isActive = active.has(tag.slug);
        return (
          <TagPill
            key={tag.slug}
            slug={tag.slug}
            label={tag.display_name}
            type={tag.type}
            state={isActive ? "active" : "inactive"}
            className="min-h-8 px-3"
            onClick={
              isActive
                ? undefined
                : () => {
                    track("filter_added", {
                      slug: tag.slug,
                      type: tag.type,
                      source: "shortcut",
                    });
                    onSelect(tag.slug);
                  }
            }
          />
        );
      })}
    </div>
  );
}
