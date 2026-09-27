/**
 * Dark-theme brand colors for generated share images ONLY.
 *
 * Documented exception to "hex lives only in globals.css": `next/og`
 * renders outside the DOM and can't resolve CSS custom properties. These
 * mirror the dark `:root` tokens in `src/app/globals.css`; if a token
 * changes there, change it here. Never import this from a component.
 */
export const OG_COLORS = {
  bg: "#0A0A0F",
  surface: "#13131A",
  border: "#2A2A38",
  textPrimary: "#F0F0FF",
  textSecondary: "#8888AA",
  accent: "#E5642E",
} as const;
