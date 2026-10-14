import type { Locale } from "@/i18n/locale";
import { getTranslator } from "@/i18n/server";
import { DEFAULT_LOCALE } from "@/i18n/locale";
import { siteConfig } from "./config";
import { FAQ_SECTIONS, faqText } from "./faq";
import { CORE_STACK, getEngineeringYears } from "./profile";

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
    "@id": `${siteConfig.url}/#person`,
    name: siteConfig.name,
    alternateName: siteConfig.alternateName,
    url: siteConfig.url,
    email: siteConfig.email,
    description: t("meta.description", { years: getEngineeringYears() }),
    knowsLanguage: siteConfig.languages.map((l) => l.code),
    jobTitle: t("hero.role"),
    knowsAbout: [...CORE_STACK],
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.location.locality,
      addressRegion: siteConfig.location.region,
      addressCountry: siteConfig.location.country,
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Universidad Adolfo Ibáñez",
    },
    sameAs: [siteConfig.links.linkedin, siteConfig.links.github],
  };
}

/** schema.org `FAQPage` for `/faq`, built from the same data the page renders. */
export function faqJsonLd(locale: Locale): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: locale,
    mainEntity: FAQ_SECTIONS.flatMap((section) =>
      section.items.map((item) => ({
        "@type": "Question",
        name: item.question[locale],
        acceptedAnswer: { "@type": "Answer", text: faqText(item.answer[locale]) },
      })),
    ),
  };
}

/** Serialise for a `<script type="application/ld+json">`, safe against `</script>`. */
export function jsonLdScript(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
