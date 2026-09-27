import type { Locale } from "@/i18n/locale";
import { getTranslator } from "@/i18n/server";
import { siteConfig } from "./config";

/**
 * Contact hrefs, built one way everywhere (Contact page, navbar, hero,
 * drawer, deep dive, sticky pill). The résumé is request-only by design:
 * the mailto pre-fills what's needed to tailor it to the role.
 */
export function emailHref(): string {
  return `mailto:${siteConfig.email}`;
}

export function resumeRequestHref(locale: Locale): string {
  const t = getTranslator(locale);
  return `mailto:${siteConfig.email}?subject=${encodeURIComponent(
    t("contact.resume.emailSubject"),
  )}&body=${encodeURIComponent(t("contact.resume.emailBody"))}`;
}
