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
  textSecondary: "#A6A6C0",
  accent: "#E5642E",
  accentHover: "#F07A45",
} as const;

/** The eight `--color-tag-*` dark values, for the share image artwork. */
export const OG_STRAND_COLORS = [
  "#D9798C",
  "#56A0CF",
  "#56CF9E",
  "#CF9A56",
  "#B680DB",
  "#D28162",
  "#56CF56",
  "#D771C3",
] as const;
