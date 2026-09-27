import { getTranslator } from "@/i18n/server";
import { DEFAULT_LOCALE } from "@/i18n/locale";
import { siteConfig } from "./config";
import { CORE_STACK } from "./profile";

/**
 * schema.org `Person` for the root layout. Language-neutral facts only
 * (the root layout can't branch on locale), so it's authored in English.
 * `alternateName` catches searches typed without diacritics.
 */
export function personJsonLd(): Record<string, unknown> {
  const t = getTranslator(DEFAULT_LOCALE);
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    alternateName: siteConfig.alternateName,
    url: siteConfig.url,
    jobTitle: t("hero.role"),
    knowsAbout: [...CORE_STACK],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Austin",
      addressRegion: "TX",
      addressCountry: "US",
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Universidad Adolfo Ibáñez",
    },
    sameAs: [siteConfig.links.linkedin, siteConfig.links.github],
  };
}

/** Serialise for a `<script type="application/ld+json">`, safe against `</script>`. */
export function jsonLdScript(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
