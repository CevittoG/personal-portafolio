import { DEFAULT_LOCALE, LOCALES, type Locale } from "./locale";

/**
 * Convert a path between locales (plan §18).
 *
 * The default locale is unprefixed (`/story`); every other locale is
 * prefixed (`/es/story`). These helpers handle the conversion in both
 * directions and preserve the query/hash so a filtered Explorer link
 * survives the language switch.
 *
 *   localeForPath("/es/story")       // → "es"
 *   stripLocale("/es/story")          // → "/story"
 *   withLocale("/story", "es")        // → "/es/story"
 *   withLocale("/es/story", "en")     // → "/story"
 *   switchLocale("/es/story?tags=x", "en") // → "/story?tags=x"
 */

/** Identify the locale prefix at the start of a pathname, if any. */
export function localeForPath(pathname: string): Locale {
  for (const code of LOCALES) {
    if (code === DEFAULT_LOCALE) continue;
    if (pathname === `/${code}` || pathname.startsWith(`/${code}/`)) {
      return code;
    }
  }
  return DEFAULT_LOCALE;
}

/** Strip any locale prefix, returning a `/`-rooted path in the default locale. */
export function stripLocale(pathname: string): string {
  for (const code of LOCALES) {
    if (code === DEFAULT_LOCALE) continue;
    if (pathname === `/${code}`) return "/";
    if (pathname.startsWith(`/${code}/`)) {
      return pathname.slice(`/${code}`.length);
    }
  }
  return pathname;
}

/** Apply a locale prefix to a default-locale path. No-op for default locale. */
export function withLocale(pathname: string, locale: Locale): string {
  const base = stripLocale(pathname);
  if (locale === DEFAULT_LOCALE) return base;
  return base === "/" ? `/${locale}` : `/${locale}${base}`;
}

/**
 * Swap the locale of a full URL-or-path-with-query-and-hash. The query and
 * hash are preserved verbatim so shareable filtered links survive the swap.
 */
export function switchLocale(url: string, locale: Locale): string {
  const hashSplit = url.indexOf("#");
  const querySplit = url.indexOf("?");
  const pathEnd =
    querySplit === -1
      ? hashSplit === -1
        ? url.length
        : hashSplit
      : hashSplit === -1
        ? querySplit
        : Math.min(querySplit, hashSplit);
  const path = url.slice(0, pathEnd);
  const tail = url.slice(pathEnd);
  return withLocale(path, locale) + tail;
}
