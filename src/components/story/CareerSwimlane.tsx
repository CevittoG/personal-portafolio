import Link from "next/link";
import { getHeadingLine } from "@/lib/experience/format";
import type { ExperienceEntry } from "@/lib/experience/types";
import { buildSwimlane } from "@/lib/story/career-lanes";
import type { Locale } from "@/i18n/locale";
import { withLocale } from "@/i18n/path";
import { getTranslator } from "@/i18n/server";
import { cn } from "@/lib/utils";

/**
 * CareerSwimlane — the career at a glance: Teaching, Founding, Data
 * engineering, Data platform, on a shared 2016 → now axis. Used at the top
 * of /story and as the landing page's Story teaser.
 *
 * Server component (hook-free): positions are computed once at build, so
 * ongoing roles end at the build date and never disagree with the client.
 * Each row reads as text first (lane · years · organization) with the bar
 * underneath, so it stays legible at phone width where bars get narrow.
 * Bars are neutral: the accent is kept for the one ongoing role.
 */
export interface CareerSwimlaneProps {
  entries: readonly ExperienceEntry[];
  locale: Locale;
  /** Link each row to its deep dive (new tab), like the Story cards. */
  linkToDeepDive?: boolean;
  className?: string;
}

export function CareerSwimlane({
  entries,
  locale,
  linkToDeepDive = false,
  className,
}: CareerSwimlaneProps) {
  const t = getTranslator(locale);
  const { lanes, ticks } = buildSwimlane(entries);
  if (lanes.length === 0) return null;

  return (
    <figure className={cn("space-y-4", className)}>
      <figcaption className="sr-only">{t("career.title")}</figcaption>
      <ol className="space-y-4">
        {lanes.map((lane) => (
          <li key={lane.id} className="space-y-1.5">
            {lane.bars.map((bar) => {
              const org = getHeadingLine(bar.entry).secondary;
              const years = `${bar.startYear}–${bar.endYear ?? t("career.present")}`;
              const text = (
                <span className="flex flex-wrap items-baseline justify-between gap-x-3 text-sm">
                  <span className="font-medium text-text-primary">
                    {t(lane.labelKey)}
                  </span>
                  <span className="text-text-secondary">
                    {years}
                    {org && <span className="text-text-muted"> · {org}</span>}
                  </span>
                </span>
              );
              const track = (
                <span
                  aria-hidden="true"
                  className="relative mt-1.5 block h-2 rounded-full bg-surface-elevated"
                >
                  <span
                    className={cn(
                      "absolute inset-y-0 rounded-full",
                      bar.endYear === null ? "bg-accent" : "bg-text-muted",
                    )}
                    style={{ left: `${bar.left}%`, width: `${bar.width}%` }}
                  />
                </span>
              );
              return linkToDeepDive ? (
                <Link
                  key={bar.entry.id}
                  href={withLocale(`/experience/${bar.entry.id}`, locale)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "group block rounded-md py-1",
                    "hover:[&_.font-medium]:text-accent",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                    "focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
                  )}
                >
                  {text}
                  {track}
                </Link>
              ) : (
                <div key={bar.entry.id} className="py-1">
                  {text}
                  {track}
                </div>
              );
            })}
          </li>
        ))}
      </ol>
      <div aria-hidden="true" className="relative h-4 text-xs text-text-muted">
        {ticks.map((tick) => (
          <span
            key={tick.year}
            className="absolute -translate-x-1/2 first:translate-x-0"
            style={{ left: `${tick.left}%` }}
          >
            {tick.year}
          </span>
        ))}
      </div>
    </figure>
  );
}
