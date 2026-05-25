/**
 * Theme system types — plan §17.
 *
 * The site supports two themes. Dark is the default and the primary
 * experience; light is a first-class alternative. Selection persists across
 * visits and respects the user's OS preference on first visit.
 */

export const THEMES = ["dark", "light"] as const;
export type Theme = (typeof THEMES)[number];

export const DEFAULT_THEME: Theme = "dark";
export const STORAGE_KEY = "theme";
