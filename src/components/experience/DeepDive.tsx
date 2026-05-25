import Link from "next/link";
import { notFound } from "next/navigation";
import { TagPill } from "@/components/tags/TagPill";
import { RelatedExperience } from "@/components/experience/RelatedExperience";
import { renderDescription } from "@/lib/experience/description";
import {
  durationMonths,
  formatPeriod,
  getDrawerSubMeta,
  getHeadingLine,
  getMetaBadge,
} from "@/lib/experience/format";
import { experienceRepository } from "@/lib/experience/json-repository";
import type { ExperienceEntry } from "@/lib/experience/types";
import { defaultRelatedScorer } from "@/lib/related/weighted-tag-overlap";
import { formatTagLabel } from "@/lib/taxonomy/format";
import { tagTypeLabel } from "@/lib/taxonomy/labels";
import { TAG_TYPES, type TagType } from "@/lib/taxonomy/types";
import { getTranslator, type ServerTranslator } from "@/i18n/server";
import { withLocale } from "@/i18n/path";
import type { Locale } from "@/i18n/locale";
import { cn } from "@/lib/utils";

/**
 * DeepDive — shared `/experience/[id]` page body (plan §8, §18).
 *
 * Server component used by both EN and ES routes. Pure RSC — zero client
 * JS in this tree. The entry description stays in its authored language
 * per plan §18 Phase 1; only the chrome (labels, "Back to Explorer", etc.)
 * is locale-aware.
 */
export interface DeepDiveProps {
  locale: Locale;
  id: string;
}

export function DeepDive({ locale, id }: DeepDiveProps) {
  const entry = experienceRepository.getById(id);
  if (!entry) notFound();
  const t = getTranslator(locale);

  const heading = getHeadingLine(entry);
  const subMeta = getDrawerSubMeta(entry);
  const badge = getMetaBadge(entry);
  const period = formatPeriod(entry.period);
  const months = durationMonths(entry.period);
  const durationLabel = months > 0 ? humanDuration(months, t) : null;

  const tagBuckets = TAG_TYPES
    .map((type) => ({ type, slugs: entry.tags[type] ?? [] }))
    .filter((b) => b.slugs.length > 0);

  const related = defaultRelatedScorer.topN(
    entry,
    experienceRepository.getAll(),
    3,
  );

  return (
    <main className="px-6 py-12 sm:py-16">
      <div className="mx-auto max-w-6xl space-y-12">
        <Link
          href={withLocale("/", locale)}
          className={cn(
            "inline-flex items-center gap-1 text-sm text-text-secondary",
            "hover:text-text-primary transition-colors duration-150",
            "focus-visible:outline-none focus-visible:underline",
          )}
        >
          {t("experience.backToExplorer")}
        </Link>

        <div className="grid gap-10 lg:grid-cols-[18rem_1fr] lg:gap-14">
          <Sidebar
            entry={entry}
            heading={heading}
            subMeta={subMeta}
            badge={badge}
            period={period}
            durationLabel={durationLabel}
            tagBuckets={tagBuckets}
            t={t}
          />
          <MainContent
            entry={entry}
            heading={heading}
            period={period}
            t={t}
          />
        </div>

        <RelatedExperience scored={related} locale={locale} />
      </div>
    </main>
  );
}

/* ── Sidebar ────────────────────────────────────────────────────────── */

interface SidebarProps {
  entry: ExperienceEntry;
  heading: { primary: string; secondary: string | null };
  subMeta: string | null;
  badge: string | null;
  period: string;
  durationLabel: string | null;
  tagBuckets: { type: TagType; slugs: string[] }[];
  t: ServerTranslator;
}

function Sidebar({
  entry,
  heading,
  subMeta,
  badge,
  period,
  durationLabel,
  tagBuckets,
  t,
}: SidebarProps) {
  const identityLabel =
    entry.type === "job"
      ? t("experience.sidebar.company")
      : entry.type === "education"
        ? t("experience.sidebar.institution")
        : t("experience.sidebar.context");

  return (
    <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-wider text-text-muted">
          {identityLabel}
        </p>
        {entry.type === "job" && entry.company.url ? (
          <a
            href={entry.company.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-base font-medium text-text-primary hover:text-accent transition-colors"
          >
            {heading.secondary}
          </a>
        ) : (
          <p className="text-base font-medium text-text-primary">
            {heading.secondary ?? "—"}
          </p>
        )}
      </div>

      <MetaRow label={t("experience.sidebar.period")}>
        <span>{period}</span>
        {durationLabel && (
          <span className="text-text-muted"> · {durationLabel}</span>
        )}
      </MetaRow>

      {subMeta && (
        <MetaRow label={t("experience.sidebar.context")}>{subMeta}</MetaRow>
      )}

      {badge && (
        <MetaRow label={t("experience.sidebar.type")}>
          <span
            className={cn(
              "rounded-full border border-border bg-surface px-2 py-0.5 text-xs",
            )}
          >
            {badge}
          </span>
        </MetaRow>
      )}

      {entry.impact.length > 0 && (
        <section className="space-y-2">
          <p className="text-xs uppercase tracking-wider text-text-muted">
            {t("experience.sidebar.impact")}
          </p>
          <ul className="space-y-1.5">
            {entry.impact.map((line, i) => (
              <li
                key={i}
                className="flex gap-2 text-sm leading-relaxed text-text-primary"
              >
                <span aria-hidden="true" className="mt-1 text-accent">▸</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {tagBuckets.length > 0 && (
        <section className="space-y-3">
          <p className="text-xs uppercase tracking-wider text-text-muted">
            {t("experience.sidebar.tags")}
          </p>
          <div className="space-y-3">
            {tagBuckets.map(({ type, slugs }) => (
              <div key={type} className="space-y-1.5">
                <p className="text-[0.65rem] uppercase tracking-wider text-text-muted">
                  {tagTypeLabel(type)}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {slugs.map((slug) => (
                    <TagPill
                      key={slug}
                      slug={slug}
                      label={formatTagLabel(slug)}
                      type={type}
                      state="inactive"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {entry.media.length > 0 && (
        <section className="space-y-2">
          <p className="text-xs uppercase tracking-wider text-text-muted">
            {t("experience.sidebar.links")}
          </p>
          <ul className="space-y-1.5">
            {entry.media.map((m, i) => (
              <li key={i}>
                <a
                  href={m.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-accent transition-colors"
                >
                  {m.label}
                  <span aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </aside>
  );
}

function MetaRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs uppercase tracking-wider text-text-muted">{label}</p>
      <p className="text-sm text-text-primary">{children}</p>
    </div>
  );
}

/* ── Main content ───────────────────────────────────────────────────── */

function MainContent({
  entry,
  heading,
  period,
  t,
}: {
  entry: ExperienceEntry;
  heading: { primary: string; secondary: string | null };
  period: string;
  t: ServerTranslator;
}) {
  const body = renderDescription(entry.description ?? "");

  return (
    <article className="min-w-0 space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-text-primary">
          {heading.primary}
        </h1>
        <p className="text-base text-text-secondary">
          {heading.secondary && (
            <>
              <span className="text-text-primary">{heading.secondary}</span>
              <span aria-hidden="true" className="mx-2 text-text-muted">·</span>
            </>
          )}
          <span>{period}</span>
        </p>
        {entry.summary && (
          <p className="text-lg leading-relaxed text-text-primary">
            {entry.summary}
          </p>
        )}
      </header>

      {body.length > 0 ? (
        <div className="space-y-5 text-base">{body}</div>
      ) : (
        <p className="text-sm italic text-text-muted">
          {t("experience.fullWriteupSoon")}
        </p>
      )}
    </article>
  );
}

/* ── helpers ─────────────────────────────────────────────────────────── */

function humanDuration(months: number, t: ServerTranslator): string {
  const years = Math.floor(months / 12);
  const remMonths = months % 12;
  const yPart =
    years > 0
      ? t(years === 1 ? "experience.duration.year" : "experience.duration.years", {
          n: years,
        })
      : "";
  const mPart =
    remMonths > 0
      ? t(
          remMonths === 1
            ? "experience.duration.month"
            : "experience.duration.months",
          { n: remMonths },
        )
      : "";
  return [yPart, mPart].filter(Boolean).join(" ");
}
