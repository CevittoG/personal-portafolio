"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
  useSyncExternalStore,
} from "react";
import { defaultThemeStorage, type ThemeStorage } from "./storage";
import { DEFAULT_THEME, type Theme } from "./types";

/**
 * Theme context — plan §17.
 *
 * The blocking inline script (see `inline-script.ts`) has already set
 * `data-theme` on `<html>` before React paints, so this provider's job is
 * narrow:
 *   1. Sync state from the DOM attribute after mount. The first render
 *      always uses {@link DEFAULT_THEME}, same as the server, so hydration
 *      matches; anything that must look right on first paint styles itself
 *      off `[data-theme]` in CSS (the `light:` variant), not off this state.
 *   2. Expose `theme` + `setTheme` + `toggle` to consumers.
 *   3. Persist changes via the injected {@link ThemeStorage} (DIP).
 *   4. Reflect changes back to `<html data-theme>` so CSS picks them up.
 *
 * The storage adapter is overridable for tests or future swap to cookies.
 */
export interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export interface ThemeProviderProps {
  children: ReactNode;
  /** Override the storage adapter (defaults to localStorage). */
  storage?: ThemeStorage;
}

export function ThemeProvider({
  children,
  storage = defaultThemeStorage,
}: ThemeProviderProps) {
  // `<html data-theme>` is the source of truth (the inline script sets it
  // before paint). During hydration React uses the server snapshot
  // (DEFAULT_THEME), so the first render matches the static HTML; right
  // after, it reads the DOM and re-renders if they differ. No effect, no
  // hydration mismatch.
  const theme = useSyncExternalStore(
    subscribeToDomTheme,
    () => readDomTheme() ?? DEFAULT_THEME,
    () => DEFAULT_THEME,
  );

  const applyTheme = useCallback(
    (next: Theme) => {
      if (typeof document !== "undefined") {
        document.documentElement.dataset.theme = next;
      }
      storage.write(next);
    },
    [storage],
  );

  const toggle = useCallback(() => {
    applyTheme(theme === "dark" ? "light" : "dark");
  }, [theme, applyTheme]);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, setTheme: applyTheme, toggle }),
    [theme, applyTheme, toggle],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/** Re-render when `<html data-theme>` changes (toggle, other tabs' writes). */
function subscribeToDomTheme(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

/** Read the theme attribute set on `<html>` by the inline script. */
function readDomTheme(): Theme | null {
  if (typeof document === "undefined") return null;
  const value = document.documentElement.dataset.theme;
  return value === "dark" || value === "light" ? value : null;
}

/**
 * useTheme — consumer hook. Throws if used outside `ThemeProvider` so
 * mis-wired consumers fail loudly in development rather than silently
 * rendering with the default theme.
 */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a <ThemeProvider>");
  }
  return ctx;
}
