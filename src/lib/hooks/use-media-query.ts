"use client";

import { useEffect, useState } from "react";

/**
 * useMediaQuery — subscribe to a CSS media query as a boolean.
 *
 * Returns `false` on the server and during the initial client render so the
 * SSR / hydration paint matches. The real value lands after the first
 * commit. Callers that need a different default (e.g. desktop-first) should
 * pass `initial`.
 *
 * SRP: this hook owns only the matchMedia ↔ state contract. Components
 * decide what to do with the boolean.
 */
export function useMediaQuery(query: string, initial = false): boolean {
  const [matches, setMatches] = useState<boolean>(initial);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [query]);

  return matches;
}
