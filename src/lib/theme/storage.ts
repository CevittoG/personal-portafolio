import { STORAGE_KEY, THEMES, type Theme } from "./types";

/**
 * ThemeStorage — DIP boundary between the ThemeProvider and where the
 * preference actually lives. The provider depends on the interface so we can
 * later swap to a cookie (for SSR-perfect hydration), a query param (for
 * preview links), or a backend (multi-device sync) without touching React.
 */
export interface ThemeStorage {
  /** Read the persisted theme, or `null` if none is set / unavailable. */
  read(): Theme | null;
  /** Persist the user's selection. May silently no-op if unavailable. */
  write(theme: Theme): void;
}

/**
 * localStorage adapter. Safe on the server (returns null, write is a no-op)
 * and resilient to private-mode quota errors.
 */
export class LocalStorageThemeStorage implements ThemeStorage {
  read(): Theme | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return isTheme(raw) ? raw : null;
    } catch {
      return null;
    }
  }
  write(theme: Theme): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* private mode / disabled storage — silently accept */
    }
  }
}

export const defaultThemeStorage: ThemeStorage = new LocalStorageThemeStorage();

function isTheme(value: unknown): value is Theme {
  return (
    typeof value === "string" && (THEMES as readonly string[]).includes(value)
  );
}
