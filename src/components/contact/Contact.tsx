import { siteConfig } from "@/lib/site/config";
import { getTranslator } from "@/i18n/server";
import type { Locale } from "@/i18n/locale";
import { cn } from "@/lib/utils";
import { umamiAttributes } from "@/lib/analytics/umami";
import { emailHref, resumeRequestHref } from "@/lib/site/contact";
import { AtAGlance } from "./AtAGlance";
import { AvailabilityBadge } from "./AvailabilityBadge";
import { DocumentIcon, MailIcon } from "./ContactLinks";

/**
 * Contact — shared page body (plan §9, §18).
 *
 * Server component used by both EN and ES contact routes. Pure server-
 * rendered, zero client JS. `locale` is a prop because Server Components
 * can't read the React I18nProvider context.
 *
 *   1. Availability badge and remote/time-zone note
 *   2. At a glance: role, years, stack, location, work authorization, degree
 *   3. "What you're looking for" paragraph
 *   4. Email link (primary, mailto — no friction)
 *   5. Résumé request (`#resume`). There is deliberately no public résumé
 *      file: it is tailored per role, and asking for it opens a
 *      conversation. The mailto pre-fills the details needed to tailor it.
 */
export interface ContactProps {
  locale: Locale;
}

export function Contact({ locale }: ContactProps) {
  const t = getTranslator(locale);
  const { availability, email } = siteConfig;
  const availabilityLabel = availability.open
    ? t("contact.availability.open")
    : t("contact.availability.closed");

  return (
    <main className="px-6 py-16 sm:py-24">
      <div className="mx-auto max-w-2xl space-y-10 text-center">
        <header className="space-y-5">
          <AvailabilityBadge open={availability.open} label={availabilityLabel} />
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-text-primary">
            {t("contact.title")}
          </h1>
          <p className="text-sm text-text-secondary">
            {t("contact.availabilityNote")}
          </p>
        </header>

        <AtAGlance locale={locale} />

        <section
          aria-label={t("contact.lookingForTitle")}
          className="rounded-2xl border border-border bg-surface/40 px-6 py-6 sm:px-8 sm:py-7"
        >
          <p className="text-base sm:text-lg leading-relaxed text-text-secondary">
            {t("contact.lookingForBody")}
          </p>
        </section>

        <section aria-label={t("contact.eyebrow")} className="space-y-3">
          <a
            href={emailHref()}
            {...umamiAttributes("contact_clicked", {
              kind: "email",
              source: "contact",
            })}
            className={cn(
              "inline-flex w-full items-center justify-center gap-2 rounded-full",
              "bg-accent px-6 py-3 text-sm font-medium text-on-accent",
              "hover:bg-accent-hover transition-colors duration-150",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-accent focus-visible:ring-offset-2",
              "focus-visible:ring-offset-bg",
            )}
          >
            <MailIcon />
            <span>{t("contact.primaryAction")}</span>
          </a>
          <p className="text-xs text-text-muted">
            <code className="rounded bg-surface px-1.5 py-0.5 text-text-secondary">
              {email}
            </code>
          </p>
        </section>

        <section
          id="resume"
          aria-labelledby="resume-title"
          className="scroll-mt-24 space-y-4 border-t border-border pt-10"
        >
          <h2
            id="resume-title"
            className="text-xl font-semibold tracking-tight text-text-primary"
          >
            {t("contact.resume.title")}
          </h2>
          <p className="mx-auto max-w-lg text-sm sm:text-base leading-relaxed text-text-secondary">
            {t("contact.resume.body")}
          </p>
          <a
            href={resumeRequestHref(locale)}
            {...umamiAttributes("contact_clicked", {
              kind: "resume_request",
              source: "contact",
            })}
            className={cn(
              "inline-flex w-full items-center justify-center gap-2 rounded-full",
              "border border-border bg-surface px-6 py-3 text-sm font-medium",
              "text-text-primary hover:bg-surface-elevated hover:border-text-muted",
              "transition-colors duration-150",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-accent focus-visible:ring-offset-2",
              "focus-visible:ring-offset-bg",
            )}
          >
            <DocumentIcon />
            <span>{t("contact.resume.action")}</span>
          </a>
        </section>
      </div>
    </main>
  );
}
