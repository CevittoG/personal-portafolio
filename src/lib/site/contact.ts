import type { Translate } from "@/i18n/translator";
import { siteConfig } from "./config";

/**
 * Contact hrefs, built one way everywhere (Contact page, navbar, hero,
 * drawer, deep dive, sticky pill). The résumé is request-only by design:
 * the mailto pre-fills what's needed to tailor it to the role.
 *
 * Takes a translator rather than a locale so client callers don't pull the
 * message catalogues into their bundle.
 */
export function emailHref(): string {
  return `mailto:${siteConfig.email}`;
}

export function resumeRequestHref(t: Translate): string {
  return `mailto:${siteConfig.email}?subject=${encodeURIComponent(
    t("contact.resume.emailSubject"),
  )}&body=${encodeURIComponent(t("contact.resume.emailBody"))}`;
}
