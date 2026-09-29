"use client";

import { useMediaQuery } from "./use-media-query";

/**
 * Hydration-safe `prefers-reduced-motion`.
 *
 * Framer Motion's `useReducedMotion()` reads the media query during the
 * first client render, so a component that renders *different markup* for
 * reduced motion (a plain `div` instead of a `motion.div`, or omitting an
 * element) disagrees with the server HTML. React then throws away hydration
 * and re-renders the whole document, which resets the `lang` and theme the
 * pre-paint scripts set on `<html>`.
 *
 * This hook is `false` on the server and on the first client render, then
 * reports the real preference after mount. Use it whenever reduced motion
 * changes *what* renders; Framer's hook is fine when it only changes
 * animation props.
 */
export function useReducedMotionAfterMount(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
