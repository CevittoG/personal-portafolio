/**
 * Inline `<html lang>` corrector (plan §18).
 *
 * The root layout pre-renders `<html lang="en">` for every static page —
 * including those under `/es/...`. This tiny script runs before paint and
 * updates `lang` to "es" if the current path is in the Spanish tree, so
 * screen readers and accessibility tooling see the correct language on
 * hydration. SEO crawlers that execute JavaScript pick it up too; the
 * non-JS-running crawlers rely on `hreflang` (set in `<head>` per route).
 *
 * Kept intentionally tiny — no helpers, no allocations — so it parses and
 * runs in well under a millisecond.
 */
export const langInitScript = `(() => {
  try {
    if (location.pathname === "/es" || location.pathname.startsWith("/es/")) {
      document.documentElement.lang = "es";
    }
  } catch (_) {}
})();`;
