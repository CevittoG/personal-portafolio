import { SOCIAL_LINKS } from "@/components/layout/social-links";
import type { Translate } from "@/i18n/translator";
import {
  umamiAttributes,
  type ContactKind,
  type ContactSource,
} from "@/lib/analytics/umami";
import { emailHref, resumeRequestHref } from "@/lib/site/contact";
import { cn } from "@/lib/utils";

/**
 * Contact links shared by the navbar, hero, drawer, deep dive, sticky pill
 * and Contact page.
 *
 * Hook-free (like `AvailabilityBadge`) so it renders in server and client
 * trees alike. Tracking uses typed `data-umami-event-*` attributes, so a
 * server page gains no client JS for it.
 */

const FOCUS_RING = cn(
  "focus-visible:outline-none focus-visible:ring-2",
  "focus-visible:ring-accent focus-visible:ring-offset-2",
  "focus-visible:ring-offset-bg",
);

const SOCIAL_KIND: Record<string, ContactKind> = {
  GitHub: "github",
  LinkedIn: "linkedin",
};

/* ── GitHub + LinkedIn ───────────────────────────────────────────────── */

export interface SocialLinksProps {
  source: ContactSource;
  /** Icon + visible label (hero, mobile menu) or icon only (navbar). */
  showLabels?: boolean;
  className?: string;
  linkClassName?: string;
}

export function SocialLinks({
  source,
  showLabels = false,
  className,
  linkClassName,
}: SocialLinksProps) {
  const links = SOCIAL_LINKS.filter((link) => link.label in SOCIAL_KIND);
  return (
    <ul className={cn("flex items-center", className)}>
      {links.map((link) => (
        <li key={link.label}>
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={showLabels ? undefined : link.label}
            {...umamiAttributes("contact_clicked", {
              kind: SOCIAL_KIND[link.label],
              source,
            })}
            className={cn(
              "inline-flex items-center gap-2 rounded-md",
              "text-text-secondary hover:text-accent",
              "transition-colors duration-150",
              showLabels ? "min-h-10 px-2 text-sm font-medium" : "h-9 w-9 justify-center",
              FOCUS_RING,
              linkClassName,
            )}
          >
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              aria-hidden="true"
              fill="currentColor"
            >
              <path d={link.iconPath} />
            </svg>
            {showLabels && <span>{link.label}</span>}
          </a>
        </li>
      ))}
    </ul>
  );
}

/* ── Email + résumé request ──────────────────────────────────────────── */

export interface ContactActionsProps {
  /** `getTranslator(locale)` on the server, `useTranslations()` in client
   *  components: this component never imports the catalogues itself. */
  t: Translate;
  source: ContactSource;
  /** "stack": full-width buttons, one per row. "row": side by side. */
  layout?: "stack" | "row";
  className?: string;
}

export function ContactActions({
  t,
  source,
  layout = "stack",
  className,
}: ContactActionsProps) {
  const button = cn(
    "inline-flex flex-1 items-center justify-center rounded-full whitespace-nowrap",
    "border border-border bg-surface py-2.5 text-sm font-medium",
    layout === "row" ? "gap-1.5 px-3" : "gap-2 px-4",
    "text-text-primary hover:bg-surface-elevated hover:border-text-muted",
    "transition-colors duration-150",
    FOCUS_RING,
  );
  return (
    <div
      className={cn(
        "flex gap-2",
        layout === "stack" ? "flex-col" : "flex-row",
        className,
      )}
    >
      <a
        href={emailHref()}
        {...umamiAttributes("contact_clicked", { kind: "email", source })}
        className={button}
      >
        <MailIcon />
        <span>{t("contactCta.email")}</span>
      </a>
      <a
        href={resumeRequestHref(t)}
        {...umamiAttributes("contact_clicked", {
          kind: "resume_request",
          source,
        })}
        className={button}
      >
        <DocumentIcon />
        <span>{t("contactCta.resume")}</span>
      </a>
    </div>
  );
}

/* ── Icons ───────────────────────────────────────────────────────────── */

export function MailIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={className}>
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

export function DocumentIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={className}>
      <path
        d="M4 2h5l3 3v9H4zM9 2v3h3M6 8h4M6 11h4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
