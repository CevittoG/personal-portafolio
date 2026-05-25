"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { defaultThemeStorage, type ThemeStorage } from "./storage";
import { DEFAULT_THEME, type Theme } from "./types";

/**
 * Theme context — plan §17.
 *
 * The blocking inline script (see `inline-script.ts`) has already set
 * `data-theme` on `<html>` before React paints, so this provider's job is
 * narrow:
 *   1. Hydrate state from the DOM attribute (single source of truth, no
 *      mismatch with the pre-paint resolution).
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
  // Initialize from the DOM attribute that the inline script already set.
  // Falls back to DEFAULT_THEME during SSR where `document` is undefined.
  const [theme, setThemeState] = useState<Theme>(() => readDomTheme() ?? DEFAULT_THEME);

  // After mount: re-sync once in case the inline script and the SSR markup
  // disagreed (e.g. user has a stored preference that differs from default).
  useEffect(() => {
    const fromDom = readDomTheme();
    if (fromDom && fromDom !== theme) setThemeState(fromDom);
    // Intentionally one-shot on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyTheme = useCallback(
    (next: Theme) => {
      setThemeState(next);
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
