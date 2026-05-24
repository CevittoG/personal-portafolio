"use client";

import type { ExperienceEntry } from "@/lib/experience/types";
import {
  formatPeriod,
  getHeadingLine,
  getImpactHighlight,
  getMetaBadge,
} from "@/lib/experience/format";
import { formatTagLabel } from "@/lib/taxonomy/format";
import { TAG_TYPES, type TagType } from "@/lib/taxonomy/types";
import { TagPill, type TagPillState } from "@/components/tags/TagPill";
import { cn } from "@/lib/utils";

/**
 * ExperienceCard — used in the Explorer grid and the Related section
 * (plan §10). One component handles all four entry types via helpers in
 * `src/lib/experience/format.ts` (SRP — Card stays presentational; type
 * differences live in one place).
 *
 * Tag pill state is driven by `filterTags`:
 * - No filter active   → every pill renders as `inactive`.
 * - Filter active      → pills whose slug is in `filterTags` are `active`,
 *                        the rest are `muted` ("here's why this matched").
 */
export interface ExperienceCardProps {
  entry: ExperienceEntry;
  /** Active filter slugs from the Explorer. Empty/undefined = no filter. */
  filterTags?: readonly string[];
  /** Opens the drawer (wired in Build Order step 11). */
  onSelect?: (entry: ExperienceEntry) => void;
  className?: string;
}

export function ExperienceCard({
  entry,
  filterTags,
  onSelect,
  className,
}: ExperienceCardProps) {
  const heading = getHeadingLine(entry);
  const badge = getMetaBadge(entry);
  const impact = getImpactHighlight(entry);
  const period = formatPeriod(entry.period);

  const hasFilter = (filterTags?.length ?? 0) > 0;
  const filterSet = new Set(filterTags ?? []);

  const stateFor = (slug: string): TagPillState => {
    if (!hasFilter) return "inactive";
    return filterSet.has(slug) ? "active" : "muted";
  };

  const handleClick = onSelect ? () => onSelect(entry) : undefined;
  const interactive = Boolean(handleClick);

  return (
    <article
      className={cn(
        "group flex h-full flex-col gap-4 rounded-2xl border border-border",
        "bg-surface p-5 text-left",
        "transition-colors duration-200",
        interactive &&
          "hover:bg-surface-elevated hover:border-border/80 cursor-pointer",
        "focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2",
        "focus-within:ring-offset-bg",
        className,
      )}
    >
      {/* Heading */}
      <header className="space-y-1">
        <h3 className="text-lg font-semibold tracking-tight text-text-primary">
          {/* The clickable surface lives on the title — keeps the whole card
              traversable via Tab without nesting buttons inside <article>. */}
          {interactive ? (
            <button
              type="button"
              onClick={handleClick}
              className={cn(
                "text-left bg-transparent p-0 m-0 cursor-pointer",
                "outline-none after:absolute after:inset-0 after:rounded-2xl",
                "relative",
              )}
            >
              <span className="relative z-10">{heading.primary}</span>
              <span className="sr-only">. Open details</span>
            </button>
          ) : (
            heading.primary
          )}
        </h3>
        {heading.secondary && (
          <p className="text-sm text-text-secondary">{heading.secondary}</p>
        )}
      </header>

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-text-muted">
        <span>{period}</span>
        {badge && (
          <>
            <span aria-hidden="true">·</span>
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2 py-0.5",
                "border border-border text-text-secondary",
              )}
            >
              {badge}
            </span>
          </>
        )}
      </div>

      {/* Summary */}
      {entry.summary && (
        <p className="text-sm text-text-secondary line-clamp-2 leading-relaxed">
          {entry.summary}
        </p>
      )}

      {/* Tag pills (all types flattened, color comes from the type) */}
      <div className="flex flex-wrap gap-1.5">
        {TAG_TYPES.flatMap((type) =>
          (entry.tags[type] ?? []).map((slug) => (
            <TagPill
              key={`${type}:${slug}`}
              slug={slug}
              label={formatTagLabel(slug)}
              type={type as TagType}
              state={stateFor(slug)}
            />
          )),
        )}
      </div>

      {/* Impact pull-quote */}
      {impact && (
        <blockquote
          className={cn(
            "mt-auto border-l-2 pl-3 text-sm italic text-text-primary",
            "border-accent",
          )}
        >
          {impact}
        </blockquote>
      )}

      {/* CTA */}
      {interactive && (
        <p
          aria-hidden="true"
          className={cn(
            "text-xs font-medium text-accent",
            "transition-transform duration-150",
            "group-hover:translate-x-0.5",
          )}
        >
          View details →
        </p>
      )}
    </article>
  );
}
