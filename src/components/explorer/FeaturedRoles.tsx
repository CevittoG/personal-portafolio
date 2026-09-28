"use client";

import { formatPeriod, getHeadingLine } from "@/lib/experience/format";
import type { ExperienceEntry } from "@/lib/experience/types";
import { track } from "@/lib/analytics/umami";
import { useLocale, useTranslations } from "@/i18n/I18nProvider";
import { withLocale } from "@/i18n/path";
import { cn } from "@/lib/utils";

/**
 * FeaturedRoles — the landing's second section: the three engineering roles
 * with an impact strip (their first three `impact` lines). Replaced the
 * count-up Stats Bar: a recruiter reads outcomes here, not totals.
 *
 * "Details" opens the Explorer drawer (same path as a grid card);
 * "Full write-up" opens the deep dive in a new tab.
 */
export interface FeaturedRolesProps {
  id: string;
  entries: readonly ExperienceEntry[];
  onSelect: (entry: ExperienceEntry) => void;
}

const FOCUS = cn(
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
  "focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
);

export function FeaturedRoles({ id, entries, onSelect }: FeaturedRolesProps) {
  const t = useTranslations();
  const locale = useLocale();
  if (entries.length === 0) return null;

  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="scroll-mt-24 px-6 py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl space-y-10">
        <header className="space-y-2 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-text-secondary">
            {t("featured.eyebrow")}
          </p>
          <h2
            id={`${id}-title`}
            className="text-3xl sm:text-4xl font-semibold tracking-tight text-text-primary"
          >
            {t("featured.title")}
          </h2>
        </header>

        <ol className="grid gap-4 lg:grid-cols-3">
          {entries.map((entry) => {
            const heading = getHeadingLine(entry);
            return (
              <li
                key={entry.id}
                className="flex flex-col gap-5 rounded-2xl border border-border bg-surface p-6"
              >
                <header className="space-y-1">
                  <p className="text-xs uppercase tracking-wider text-text-muted">
                    {heading.secondary && <>{heading.secondary} · </>}
                    {formatPeriod(entry.period)}
                  </p>
                  <h3 className="text-lg font-semibold tracking-tight text-text-primary">
                    {heading.primary}
                  </h3>
                </header>

                <ul className="space-y-3">
                  {entry.impact.slice(0, 3).map((line, i) => (
                    <li
                      key={i}
                      className="flex gap-2 text-sm leading-relaxed text-text-secondary"
                    >
                      <span aria-hidden="true" className="mt-0.5 text-accent">
                        ▸
                      </span>
                      <span className={cn(i === 0 && "text-text-primary")}>
                        {line}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-1 text-sm">
                  <button
                    type="button"
                    onClick={() => {
                      track("experience_opened", { id: entry.id, type: entry.type });
                      onSelect(entry);
                    }}
                    className={cn(
                      "min-h-10 cursor-pointer rounded-full border border-border bg-surface px-4",
                      "font-medium text-text-primary hover:bg-surface-elevated hover:border-text-muted",
                      "transition-colors duration-150",
                      FOCUS,
                    )}
                  >
                    {t("featured.details")}
                  </button>
                  <a
                    href={withLocale(`/experience/${entry.id}`, locale)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => track("deep_dive_opened", { id: entry.id })}
                    className={cn(
                      "inline-flex min-h-10 items-center gap-1 rounded-sm font-medium",
                      "text-text-secondary hover:text-accent transition-colors duration-150",
                      FOCUS,
                    )}
                  >
                    {t("featured.fullWriteup")}
                    <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
