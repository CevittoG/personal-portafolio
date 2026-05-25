import { DEFAULT_THEME, STORAGE_KEY } from "./types";

/**
 * Blocking inline script — runs in `<head>` **before** first paint to set
 * the correct `data-theme` on `<html>`. Without this, every page reload
 * would flash dark for one frame before React hydrated and applied the
 * stored light preference (the "dark flash" / FOUC).
 *
 * Resolution order on first paint:
 *   1. `localStorage.theme` if set to a known value
 *   2. `prefers-color-scheme` media query
 *   3. {@link DEFAULT_THEME}
 *
 * The script is intentionally tiny — no try/catch beyond the storage read,
 * no helper functions — so it parses and runs in well under a millisecond.
 * Strings are interpolated at build time from {@link STORAGE_KEY} /
 * {@link DEFAULT_THEME} so the single source of truth stays one file.
 */
export const themeInitScript = `(() => {
  try {
    const stored = localStorage.getItem(${JSON.stringify(STORAGE_KEY)});
    if (stored === "dark" || stored === "light") {
      document.documentElement.dataset.theme = stored;
      return;
    }
  } catch (_) {}
  const prefersLight =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: light)").matches;
  document.documentElement.dataset.theme = prefersLight
    ? "light"
    : ${JSON.stringify(DEFAULT_THEME)};
})();`;
