import type { MetadataRoute } from "next";
import { LOCALES } from "@/i18n/locale";
import { withLocale } from "@/i18n/path";
import { experienceRepository } from "@/lib/experience/json-repository";
import { siteConfig } from "@/lib/site/config";
import { localizedAlternates } from "@/lib/site/metadata";

export const dynamic = "force-static";

/**
 * Every prerendered route in both locales, each carrying its hreflang set.
 * Deep dives are included because they're the pages a search for a specific
 * role or tool should land on.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/story",
    "/contact",
    ...experienceRepository.getAll().map((e) => `/experience/${e.id}`),
  ];
  const absolute = (path: string) =>
    `${siteConfig.url}${path === "/" ? "" : path}`;

  return paths.flatMap((path) => {
    const languages = Object.fromEntries(
      Object.entries(localizedAlternates(path)).map(([k, v]) => [k, absolute(v)]),
    );
    return LOCALES.map((locale) => ({
      url: absolute(withLocale(path, locale)),
      alternates: { languages },
    }));
  });
}
