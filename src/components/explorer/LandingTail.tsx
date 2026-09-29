import Link from "next/link";
import { ContactActions } from "@/components/contact/ContactLinks";
import { CareerSwimlane } from "@/components/story/CareerSwimlane";
import { experienceRepository } from "@/lib/experience/json-repository";
import type { Locale } from "@/i18n/locale";
import { withLocale } from "@/i18n/path";
import { getTranslator } from "@/i18n/server";
import { cn } from "@/lib/utils";

/**
 * LandingTail — the last two landing sections, after the client Explorer:
 * a Story teaser (the career swimlane) and a compact Contact block.
 *
 * Server component on purpose: the swimlane's "ongoing" bar is computed at
 * build time, so rendering it here (not inside the client Explorer) keeps
 * the static HTML and the hydrated page identical.
 */
const LINK = cn(
  "inline-flex min-h-10 items-center gap-1 rounded-sm text-sm font-medium",
  "text-text-primary underline decoration-accent underline-offset-4",
  "hover:text-accent transition-colors duration-150",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
  "focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
);

export function LandingTail({
  locale,
  contactId,
}: {
  locale: Locale;
  /** DOM id of the Contact block (the sticky pill yields to it). */
  contactId: string;
}) {
  const t = getTranslator(locale);
  return (
    <>
      <section
        aria-labelledby="story-teaser-title"
        className="px-6 py-16 sm:py-20"
      >
        <div className="mx-auto max-w-3xl space-y-8">
          <header className="space-y-2 text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-text-secondary">
              {t("storyTeaser.eyebrow")}
            </p>
            <h2
              id="story-teaser-title"
              className="text-3xl sm:text-4xl font-semibold tracking-tight text-text-primary"
            >
              {t("storyTeaser.title")}
            </h2>
          </header>
          <CareerSwimlane
            entries={experienceRepository.getAll()}
            locale={locale}
          />
          <p className="text-center">
            <Link href={withLocale("/story", locale)} className={LINK}>
              {t("storyTeaser.cta")}
              <span aria-hidden="true">→</span>
            </Link>
          </p>
        </div>
      </section>

      <section
        id={contactId}
        aria-labelledby="landing-contact-title"
        className="px-6 pb-20 pt-4 sm:pb-28"
      >
        <div className="mx-auto max-w-2xl space-y-5 rounded-2xl border border-border bg-surface/40 px-6 py-8 text-center sm:px-10">
          <h2
            id="landing-contact-title"
            className="text-2xl font-semibold tracking-tight text-text-primary"
          >
            {t("contactCta.title")}
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-text-secondary">
            {t("contact.resume.body")}
          </p>
          <ContactActions
            t={t}
            source="landing"
            layout="row"
            className="mx-auto max-w-md"
          />
          <p>
            <Link href={withLocale("/contact", locale)} className={LINK}>
              {t("landingContact.more")}
              <span aria-hidden="true">→</span>
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
