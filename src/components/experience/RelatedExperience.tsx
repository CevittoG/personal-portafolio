import Link from "next/link";
import { TagPill } from "@/components/tags/TagPill";
import { formatPeriod, getHeadingLine } from "@/lib/experience/format";
import type { ScoredEntry } from "@/lib/related/scorer";
import { formatTagLabel } from "@/lib/taxonomy/format";
import { taxonomyRepository } from "@/lib/taxonomy/json-repository";
import type { TagType } from "@/lib/taxonomy/types";
import { getTranslator } from "@/i18n/server";
import { withLocale } from "@/i18n/path";
import type { Locale } from "@/i18n/locale";
import { cn } from "@/lib/utils";

/**
 * RelatedExperience — bottom section of `/experience/[id]` (plan §8 + §12).
 *
 * Renders the top-N scored entries returned by the page's chosen scorer.
 * Each card highlights its top matching tags so the reader sees *why* the
 * entry was related, not just that it was.
 *
 * Server-renderable (no interactivity) — keeps the deep-dive page able to
 * stay a pure RSC and ship zero JS for this section.
 */
export interface RelatedExperienceProps {
  scored: readonly ScoredEntry[];
  /** Locale used to localize the chrome (title, "View →") and the
   *  per-card deep-dive link prefix. */
  locale: Locale;
  /** Max matching tags to show per card. Defaults to 3 per plan. */
  maxTagsPerCard?: number;
  className?: string;
}

export function RelatedExperience({
  scored,
  locale,
  maxTagsPerCard = 3,
  className,
}: RelatedExperienceProps) {
  if (scored.length === 0) return null;
  const t = getTranslator(locale);

  return (
    <section
      aria-labelledby="related-heading"
      className={cn("space-y-5", className)}
    >
      <div className="space-y-1">
        <h2
          id="related-heading"
          className="text-2xl font-semibold tracking-tight text-text-primary"
        >
          {t("experience.related.title")}
        </h2>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {scored.map((s) => (
          <RelatedCard
            key={s.entry.id}
            scored={s}
            maxTags={maxTagsPerCard}
            locale={locale}
            viewLabel={t("experience.related.view")}
          />
        ))}
      </ul>
    </section>
  );
}

function RelatedCard({
  scored,
  maxTags,
  locale,
  viewLabel,
}: {
  scored: ScoredEntry;
  maxTags: number;
  locale: Locale;
  viewLabel: string;
}) {
  const { entry, matchedSlugs } = scored;
  const heading = getHeadingLine(entry);
  const matchedTopN = matchedSlugs.slice(0, maxTags);

  return (
    <li>
      <Link
        href={withLocale(`/experience/${entry.id}`, locale)}
        className={cn(
          "group flex h-full flex-col rounded-2xl border border-border bg-surface/40",
          "p-5 transition-colors duration-150",
          "hover:bg-surface hover:border-text-muted",
          "focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-accent focus-visible:ring-offset-2",
          "focus-visible:ring-offset-bg",
        )}
      >
        <p className="text-xs uppercase tracking-wider text-text-muted">
          {heading.secondary}
        </p>
        <h3 className="mt-1 text-base font-semibold text-text-primary group-hover:text-accent transition-colors">
          {heading.primary}
        </h3>
        <p className="mt-1 text-xs text-text-secondary">
          {formatPeriod(entry.period)}
        </p>

        {matchedTopN.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {matchedTopN.map((slug) => {
              const tax = taxonomyRepository.getBySlug(slug);
              const type: TagType = tax?.type ?? "concepts";
              return (
                <TagPill
                  key={slug}
                  slug={slug}
                  label={formatTagLabel(slug)}
                  type={type}
                  state="active"
                />
              );
            })}
          </div>
        )}

        <span className="mt-auto pt-4 text-xs text-text-secondary group-hover:text-accent transition-colors">
          {viewLabel}
        </span>
      </Link>
    </li>
  );
}
