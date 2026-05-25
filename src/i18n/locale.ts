/**
 * Locale configuration (plan §18).
 *
 * The site is bilingual. English is the default and lives at the unprefixed
 * root (`/`); Spanish lives under `/es/...`. Both are first-class — Spanish
 * copy is hand-authored, not machine-translated.
 *
 * To add a third locale later:
 *   1. Append the code to `LOCALES`.
 *   2. Add a matching catalogue in `messages/<code>.ts` (shape enforced by
 *      `Messages` type).
 *   3. Mirror the route tree under `app/<code>/`.
 *   4. Update `localePathPrefix` if it isn't simply `/<code>`.
 *
 * Nothing else needs to change in the codebase (OCP).
 */

export const LOCALES = ["en", "es"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE = "NEXT_LOCALE";

/** Human-facing label for the switcher control. */
export const LOCALE_LABELS: Record<Locale, string> = {
  en: "EN",
  es: "ES",
};

/** The path prefix for a given locale. The default locale is unprefixed. */
export function localePathPrefix(locale: Locale): string {
  return locale === DEFAULT_LOCALE ? "" : `/${locale}`;
}

export function isLocale(value: unknown): value is Locale {
  return (
    typeof value === "string" && (LOCALES as readonly string[]).includes(value)
  );
}
