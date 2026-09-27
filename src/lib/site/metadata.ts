import type { Metadata } from "next";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/i18n/locale";
import { stripLocale, withLocale } from "@/i18n/path";
import { getTranslator } from "@/i18n/server";
import type { MessageKey } from "@/i18n/translator";
import { experienceTitle } from "@/lib/experience/format";
import { experienceRepository } from "@/lib/experience/json-repository";
import { siteConfig } from "./config";
import { experienceImage, staticPageImage } from "./og-image";
import { getEngineeringYears } from "./profile";

/**
 * One way to build page metadata, so canonical, hreflang and social cards
 * never drift between the EN and ES trees.
 *
 * `path` may be given in either locale; it is normalised to the EN path and
 * re-prefixed per locale. Relative URLs resolve against `metadataBase`,
 * which the root layout sets to `siteConfig.url`.
 */
export interface BuildMetadataInput {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  /** Root-relative share image path (`/og/….png`). */
  image: string;
}

const OG_LOCALE: Record<Locale, string> = { en: "en_US", es: "es_CL" };

export function localizedAlternates(path: string): Record<string, string> {
  const base = stripLocale(path);
  const languages: Record<string, string> = {};
  for (const locale of LOCALES) languages[locale] = withLocale(base, locale);
  languages["x-default"] = withLocale(base, DEFAULT_LOCALE);
  return languages;
}

export function buildMetadata({
  locale,
  path,
  title,
  description,
  image,
}: BuildMetadataInput): Metadata {
  const images = [{ url: image, width: 1200, height: 630, alt: title }];
  const canonical = withLocale(path, locale);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical, languages: localizedAlternates(path) },
    openGraph: {
      type: "website",
      url: canonical,
      siteName: siteConfig.name,
      title,
      description,
      locale: OG_LOCALE[locale],
      alternateLocale: LOCALES.filter((l) => l !== locale).map(
        (l) => OG_LOCALE[l],
      ),
      images,
    },
    twitter: { card: "summary_large_image", title, description, images },
  };
}

/* ── Per-page presets ────────────────────────────────────────────────── */

export type StaticPage = "home" | "story" | "contact";

const STATIC_PAGES = {
  home: { path: "/", title: "meta.title", description: "meta.description" },
  story: {
    path: "/story",
    title: "story.metaTitle",
    description: "story.metaDescription",
  },
  contact: {
    path: "/contact",
    title: "contact.metaTitle",
    description: "contact.metaDescription",
  },
} as const satisfies Record<
  StaticPage,
  { path: string; title: MessageKey; description: MessageKey }
>;

/** Metadata for the fixed routes, identical across locales except copy. */
export function staticPageMetadata(page: StaticPage, locale: Locale): Metadata {
  const { path, title, description } = STATIC_PAGES[page];
  const t = getTranslator(locale);
  const values = { name: siteConfig.name, years: getEngineeringYears() };
  return buildMetadata({
    locale,
    path,
    title: t(title, values),
    description: t(description, values),
    image: staticPageImage(page, locale),
  });
}

/** Metadata for `/experience/[id]` in either locale. */
export function experienceMetadata(id: string, locale: Locale): Metadata {
  const entry = experienceRepository.getById(id);
  if (!entry) return { title: "Not found" };
  const t = getTranslator(locale);
  return buildMetadata({
    locale,
    path: `/experience/${id}`,
    title: t("experience.metaTitle", {
      title: experienceTitle(entry),
      name: siteConfig.name,
    }),
    description: entry.summary,
    image: experienceImage(id, locale),
  });
}
