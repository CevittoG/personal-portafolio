import { NowMarker } from "@/components/story/NowMarker";
import { PivotInterlude } from "@/components/story/PivotInterlude";
import { StoryTimeline } from "@/components/story/StoryTimeline";
import { experienceRepository } from "@/lib/experience/json-repository";
import { sortEntries } from "@/lib/experience/sort";
import type { ExperienceEntry } from "@/lib/experience/types";
import { getMessages, getTranslator } from "@/i18n/server";
import { withLocale } from "@/i18n/path";
import type { Locale } from "@/i18n/locale";
import { cn } from "@/lib/utils";

/**
 * Story — shared three-act page (plan §7, §18).
 *
 * Server component used by both `(en)/story/page.tsx` and `es/story/page.tsx`.
 * Takes `locale` as a prop because server components can't read the React
 * I18nProvider context. The same `getTranslator(locale)` returns a `t()` with
 * the same call site as the client hook.
 *
 * Pure server-renderable still — no client JS shipped from this component.
 * The interactive bits (rail draw-in, reveal stagger) live inside the client
 * `StoryTimeline`.
 */
export interface StoryProps {
  locale: Locale;
}

export function Story({ locale }: StoryProps) {
  const t = getTranslator(locale);
  const messages = getMessages(locale);

  const all = experienceRepository.getAll();
  const act1Entries = chronological(
    all.filter((e) => e.story_act === "foundation"),
  );
  const act3Entries = chronological(
    all.filter((e) => e.story_act === "technical"),
  );

  return (
    <main className="px-6 py-12 sm:py-16">
      <div className="mx-auto max-w-5xl space-y-20 sm:space-y-24">
        <header className="text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-text-secondary">
            {t("story.eyebrow")}
          </p>
          <h1 className="mt-3 text-4xl sm:text-5xl font-semibold tracking-tight text-text-primary">
            {t("story.title")}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base sm:text-lg leading-relaxed text-text-secondary">
            {t("story.intro")}
          </p>
        </header>

        <Act
          eyebrow={t("story.actOne.eyebrow")}
          title={t("story.actOne.title")}
          intro={t("story.actOne.intro")}
        >
          {act1Entries.length > 0 ? (
            <StoryTimeline
              entries={act1Entries}
              highlightTagType="soft_skills"
              linkToDeepDive
              locale={locale}
            />
          ) : (
            <ActPlaceholder
              title={t("story.actOne.emptyTitle")}
              hint={t("story.actOne.emptyHint")}
            />
          )}
        </Act>

        <PivotInterlude
          eyebrow={t("story.actTwo.eyebrow")}
          title={t("story.actTwo.title")}
          paragraphs={messages.story.actTwo.paragraphs}
        />

        <Act
          eyebrow={t("story.actThree.eyebrow")}
          title={t("story.actThree.title")}
          intro={t("story.actThree.intro")}
        >
          {act3Entries.length > 0 ? (
            <StoryTimeline
              entries={act3Entries}
              highlightTagType="concepts"
              linkToDeepDive
              locale={locale}
            />
          ) : (
            <ActPlaceholder
              title={t("story.actThree.emptyTitle")}
              hint={t("story.actThree.emptyHint")}
            />
          )}
        </Act>

        <NowMarker
          eyebrow={t("story.now.eyebrow")}
          title={t("story.now.title")}
          body={t("story.now.body")}
          ctaLabel={t("story.now.cta")}
          ctaHref={withLocale("/contact", locale)}
        />
      </div>
    </main>
  );
}

/* ── Building blocks (page-local — not reused elsewhere) ─────────────── */

function Act({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  const id = `${slugify(title)}-heading`;
  return (
    <section aria-labelledby={id} className="space-y-8">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-accent">
          {eyebrow}
        </p>
        <h2
          id={id}
          className="text-3xl sm:text-4xl font-semibold tracking-tight text-text-primary"
        >
          {title}
        </h2>
        <p className="max-w-2xl text-base sm:text-lg leading-relaxed text-text-secondary">
          {intro}
        </p>
      </header>
      {children}
    </section>
  );
}

function ActPlaceholder({ title, hint }: { title: string; hint: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-dashed border-border bg-surface/30",
        "px-6 py-8 text-center",
      )}
    >
      <p className="text-sm font-medium text-text-primary">{title}</p>
      <p className="mt-1 text-sm italic text-text-muted">{hint}</p>
    </div>
  );
}

function chronological(entries: readonly ExperienceEntry[]): ExperienceEntry[] {
  return sortEntries(entries, "recent", []).reverse();
}

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
