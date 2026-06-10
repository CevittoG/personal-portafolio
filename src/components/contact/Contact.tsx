import { siteConfig } from "@/lib/site/config";
import { getTranslator } from "@/i18n/server";
import type { Locale } from "@/i18n/locale";
import { cn } from "@/lib/utils";

/**
 * Contact — shared page body (plan §9, §18).
 *
 * Server component used by both EN and ES contact routes. Pure server-
 * rendered, zero client JS. `locale` is a prop because Server Components
 * can't read the React I18nProvider context.
 *
 *   1. Availability badge (open vs not looking — green or muted)
 *   2. "What you're looking for" paragraph
 *   3. Email link (primary, mailto — no friction)
 *   4. Resume PDF download (only when `siteConfig.resume` is set)
 */
export interface ContactProps {
  locale: Locale;
}

export function Contact({ locale }: ContactProps) {
  const t = getTranslator(locale);
  const { availability, email, resume, name } = siteConfig;
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
          <p className="text-sm text-text-secondary">{t("contact.availabilityNote")}</p>
        </header>

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
            href={`mailto:${email}`}
            data-umami-event="contact_clicked"
            data-umami-event-kind="email"
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
            <span>
              {t("contact.primaryAction")} — {name.split(" ")[0]}
            </span>
          </a>
          <p className="text-xs text-text-muted">
            <code className="rounded bg-surface px-1.5 py-0.5 text-text-secondary">
              {email}
            </code>
          </p>

          {resume && (
            <a
              href={resume.href}
              download
              data-umami-event="contact_clicked"
              data-umami-event-kind="resume"
              className={cn(
                "mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full",
                "border border-border bg-surface px-6 py-3 text-sm font-medium",
                "text-text-primary hover:bg-surface-elevated hover:border-text-muted",
                "transition-colors duration-150",
                "focus-visible:outline-none focus-visible:ring-2",
                "focus-visible:ring-accent focus-visible:ring-offset-2",
                "focus-visible:ring-offset-bg",
              )}
            >
              <DownloadIcon />
              <span>{t("contact.resumeAction")}</span>
            </a>
          )}
        </section>
      </div>
    </main>
  );
}

/* ── Page-local visual atoms ─────────────────────────────────────────── */

function AvailabilityBadge({ open, label }: { open: boolean; label: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1",
        "text-xs font-medium",
        open
          ? "border-[color:color-mix(in_srgb,var(--color-tag-scale)_50%,transparent)] text-[color:var(--color-tag-scale)] bg-[color:color-mix(in_srgb,var(--color-tag-scale)_12%,transparent)]"
          : "border-border text-text-muted bg-surface",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "relative h-1.5 w-1.5 rounded-full",
          open ? "bg-[color:var(--color-tag-scale)]" : "bg-text-muted",
        )}
      >
        {open && (
          <span
            aria-hidden="true"
            className={cn(
              "absolute inset-0 rounded-full",
              "bg-[color:var(--color-tag-scale)] opacity-60",
              "motion-safe:animate-ping",
            )}
          />
        )}
      </span>
      {label}
    </span>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4">
      <path
        d="M2 4h12v8H2zM2 4l6 5 6-5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4">
      <path
        d="M8 2v9m0 0l-3-3m3 3l3-3M3 14h10"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
