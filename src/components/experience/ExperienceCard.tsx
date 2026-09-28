"use client";

import type { ExperienceEntry } from "@/lib/experience/types";
import {
  formatPeriod,
  getHeadingLine,
  getImpactHighlight,
  getMetaBadge,
} from "@/lib/experience/format";
import { cardTags } from "@/lib/experience/tag-display";
import { formatTagLabel } from "@/lib/taxonomy/format";
import type { TagType } from "@/lib/taxonomy/types";
import { TagPill, type TagPillState } from "@/components/tags/TagPill";
import { useTranslations } from "@/i18n/I18nProvider";
import { track } from "@/lib/analytics/umami";
import { cn } from "@/lib/utils";

/**
 * ExperienceCard — used in the Explorer grid and the Related section
 * (plan §10). One component handles all four entry types via helpers in
 * `src/lib/experience/format.ts` (SRP — Card stays presentational; type
 * differences live in one place).
 *
 * Order is what a recruiter scans for: heading, meta, summary, the headline
 * result (`impact[0]`), then at most six stack pills (see `cardTags`).
 *
 * Tag pill state is driven by `filterTags`:
 * - No filter active   → every pill renders as `inactive`.
 * - Filter active      → pills whose slug is in `filterTags` are `active`,
 *                        the rest are `muted` ("here's why this matched").
 *
 * Pills either do something or look inert: with `onTagSelect` (Explorer
 * grid) an inactive pill adds that tag to the filter; without it (Related
 * section) pills render as plain labels with no hover affordance.
 */
export interface ExperienceCardProps {
  entry: ExperienceEntry;
  /** Active filter slugs from the Explorer. Empty/undefined = no filter. */
  filterTags?: readonly string[];
  /** Opens the drawer. */
  onSelect?: (entry: ExperienceEntry) => void;
  /** Adds a tag to the Explorer filter. Omit to render pills as inert labels. */
  onTagSelect?: (slug: string) => void;
  className?: string;
}

export function ExperienceCard({
  entry,
  filterTags,
  onSelect,
  onTagSelect,
  className,
}: ExperienceCardProps) {
  const t = useTranslations();
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

  const tags = cardTags(entry, filterTags ?? []);

  const handleClick = onSelect
    ? () => {
        track("experience_opened", { id: entry.id, type: entry.type });
        onSelect(entry);
      }
    : undefined;
  const interactive = Boolean(handleClick);

  const pillClick = (slug: string, type: TagType, state: TagPillState) =>
    onTagSelect && state === "inactive"
      ? () => {
          track("filter_added", { slug, type, source: "card" });
          onTagSelect(slug);
        }
      : undefined;

  return (
    <article
      className={cn(
        "group flex h-full flex-col gap-4 rounded-2xl border border-border",
        "bg-surface p-5 text-left",
        "transition-[transform,background-color,border-color,box-shadow] duration-200 ease-out",
        interactive && [
          "relative cursor-pointer",
          "hover:-translate-y-0.5",
          "hover:bg-surface-elevated",
          "hover:border-accent/40",
          "hover:shadow-[0_8px_24px_-12px_color-mix(in_srgb,var(--color-accent)_30%,transparent)]",
        ],
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
              )}
            >
              <span className="relative z-10">{heading.primary}</span>
              <span className="sr-only">. {t("card.open")}</span>
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
        <p className="text-sm text-text-secondary line-clamp-3 leading-relaxed">
          {entry.summary}
        </p>
      )}

      {/* Headline result — inline callout with a leading accent dot rather
          than a side-stripe border (shared design law: no >1px coloured
          side borders). Sits above the pills: the result is what a recruiter
          should read second, after the role. */}
      {impact && (
        <p
          className={cn(
            "flex items-start gap-2 rounded-lg",
            "bg-[color-mix(in_srgb,var(--color-accent)_8%,transparent)]",
            "px-3 py-2 text-sm italic text-text-primary",
          )}
        >
          <span
            aria-hidden="true"
            className="mt-[0.45rem] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
          />
          <span>{impact}</span>
        </p>
      )}

      {/* Stack pills — at most six, filter matches first. Interactive pills
          sit above the card's stretched click target (relative z-10). */}
      {tags.shown.length > 0 && (
        <div className="mt-auto flex flex-wrap items-center gap-1.5">
          {tags.shown.map(({ slug, type }) => {
            const state = stateFor(slug);
            const onClick = pillClick(slug, type, state);
            return (
              <TagPill
                key={`${type}:${slug}`}
                slug={slug}
                label={formatTagLabel(slug)}
                type={type}
                state={state}
                onClick={onClick}
                className={cn(onClick && "relative z-10 min-h-6")}
              />
            );
          })}
          {tags.hiddenCount > 0 && (
            <span className="text-xs text-text-muted">+{tags.hiddenCount}</span>
          )}
        </div>
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
          {t("grid.viewDetails")}
        </p>
      )}
    </article>
  );
}
