"use client";

import { useLayoutEffect, useRef } from "react";

/**
 * Keep the results in view when the visitor changes the filter.
 *
 * Filtering from a card halfway down the grid can shrink the list to one
 * row, which leaves the visitor looking at whatever now sits at that scroll
 * position (often the next section). When the start of the results has
 * scrolled above the navbar, bring it back under it, where the sticky
 * filter row sits, so the reshaped list is what they see.
 *
 * Only changes the visitor made count: call `byVisitor()` in the handler.
 * Filters read from the URL on load never move the page.
 */

/** Navbar height in px; the results' `scroll-mt-16` matches it. */
const NAVBAR_HEIGHT = 64;

export function useKeepResultsInView<T extends HTMLElement>(activeSlugs: readonly string[]) {
  const resultsRef = useRef<T>(null);
  const visitorChanged = useRef(false);

  const byVisitor = () => {
    visitorChanged.current = true;
  };

  useLayoutEffect(() => {
    if (!visitorChanged.current) return;
    visitorChanged.current = false;
    const results = resultsRef.current;
    if (!results || results.getBoundingClientRect().top >= NAVBAR_HEIGHT) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    results.scrollIntoView({ block: "start", behavior: reduced ? "auto" : "smooth" });
  }, [activeSlugs]);

  return { resultsRef, byVisitor };
}
