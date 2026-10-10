"use client";

import { useMemo } from "react";
import { track } from "@/lib/analytics/umami";
import type { ExperienceEntry } from "@/lib/experience/types";
import { matchesAllTags } from "@/lib/filters/tag-match";
import type { CareerStripData } from "@/lib/story/career-lanes";
import { useTranslations } from "@/i18n/I18nProvider";
import { cn } from "@/lib/utils";

/**
 * CareerStrip — the career swimlane as the filter's readout, inside the
 * Explorer results: "where in my career did I use this?".
 *
 * With no filter every lane's bar is filled. With one, the lanes whose role
 * matches stay filled and the others go hollow: a change of shape, so it
 * never depends on color alone. Hovering or focusing a lane lights that
 * role's card in the grid; pressing it opens the role's drawer.
 *
 * Positions arrive as plain numbers computed at build time
 * (`toCareerStrip`), so nothing here reads the clock and the hydrated strip
 * matches the static HTML. The full swimlane with organizations and links
 * is `CareerSwimlane` (server), on /story and in the landing's Story teaser.
 */
export interface CareerStripProps {
  strip: CareerStripData;
  /** The Explorer's entries; a lane whose role is not among them is inert. */
  entries: readonly ExperienceEntry[];
  activeSlugs: readonly string[];
  /** Opens the drawer, like a card. */
  onSelect: (entry: ExperienceEntry) => void;
  /** The lane under the pointer or focus, or null when there is none. */
  onHighlight: (entryId: string | null) => void;
  className?: string;
}

const ROW = "col-span-full grid min-h-7 grid-cols-subgrid items-center";

export function CareerStrip({
  strip,
  entries,
  activeSlugs,
  onSelect,
  onHighlight,
  className,
}: CareerStripProps) {
  const t = useTranslations();
  const byId = useMemo(() => new Map(entries.map((e) => [e.id, e])), [entries]);
  const filtering = activeSlugs.length > 0;
  if (strip.rows.length === 0) return null;

  return (
    <figure className={cn("lane-draw-scroll", className)}>
      <figcaption className="sr-only">{t("career.title")}</figcaption>
      <ol
        className={cn(
          "grid grid-cols-[auto_minmax(0,1fr)] gap-x-4",
          "sm:grid-cols-[auto_minmax(0,1fr)_auto]",
        )}
      >
        {strip.rows.map((row) => {
          const entry = byId.get(row.entryId);
          const match = !filtering || (entry ? matchesAllTags(entry, activeSlugs) : false);
          const ongoing = row.endYear === null;
          const years = `${row.startYear}–${row.endYear ?? t("career.present")}`;

          const body = (
            <>
              <span
                className={cn(
                  "text-sm font-medium transition-colors duration-200",
                  match ? "text-text-primary" : "text-text-muted",
                  entry && "group-hover:text-accent",
                )}
              >
                {t(row.labelKey)}
              </span>
              <span
                aria-hidden="true"
                className="relative block h-2 rounded-full bg-surface-elevated"
              >
                <span
                  className={cn(
                    "lane-bar absolute inset-y-0 rounded-full border",
                    "transition-colors duration-200",
                    ongoing ? "border-accent" : "border-text-muted",
                    match ? (ongoing ? "bg-accent" : "bg-text-muted") : "bg-transparent",
                  )}
                  style={{ left: `${row.left}%`, width: `${row.width}%` }}
                />
              </span>
              {/* Years: read out everywhere, shown from `sm` up. */}
              <span className="sr-only text-xs text-text-muted sm:not-sr-only">
                {years}
                {row.org && ` · ${row.org}`}
              </span>
              {filtering && (
                <span className="sr-only">{t(match ? "career.match" : "career.noMatch")}</span>
              )}
            </>
          );

          return (
            <li key={row.entryId} className="col-span-full grid grid-cols-subgrid">
              {entry ? (
                <button
                  type="button"
                  data-entry-id={row.entryId}
                  data-match={match}
                  onClick={() => {
                    track("experience_opened", { id: entry.id, type: entry.type });
                    onSelect(entry);
                  }}
                  onPointerEnter={() => onHighlight(row.entryId)}
                  onPointerLeave={() => onHighlight(null)}
                  onFocus={() => onHighlight(row.entryId)}
                  onBlur={() => onHighlight(null)}
                  className={cn(
                    ROW,
                    "group cursor-pointer rounded-md text-left",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                    "focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
                  )}
                >
                  {body}
                </button>
              ) : (
                <div data-entry-id={row.entryId} data-match={match} className={ROW}>
                  {body}
                </div>
              )}
            </li>
          );
        })}
        <li aria-hidden="true" className="col-span-full grid grid-cols-subgrid">
          <span />
          <span className="relative block h-4 text-xs text-text-muted">
            {strip.ticks.map((tick, i) => (
              <span
                key={tick.year}
                className={cn(
                  "absolute -translate-x-1/2 first:translate-x-0",
                  // A phone's track is too narrow for a label every two years.
                  i % 2 === 1 && "hidden sm:inline",
                )}
                style={{ left: `${tick.left}%` }}
              >
                {tick.year}
              </span>
            ))}
          </span>
        </li>
      </ol>
    </figure>
  );
}
