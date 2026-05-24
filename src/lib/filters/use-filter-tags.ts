"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * URL-synced filter state for the Explorer (plan §6, Zone 2).
 *
 * Keeps an array of tag slugs in sync with the `?tags=` query param so that
 * filtered views are shareable and linkable (e.g. `/?tags=python,etl`).
 *
 * Implementation: direct `history.replaceState` + `popstate` listener. We
 * avoid `next/navigation` here because static export + `useSearchParams`
 * requires a Suspense boundary the Explorer doesn't otherwise need, and
 * replacing history (vs pushing) keeps the back button untouched as
 * recruiters tinker with filters.
 *
 * SRP: this hook owns *only* the URL ↔ state contract. Components decide
 * what filtering to do with the slugs it returns.
 */

const PARAM = "tags";

export interface FilterTagsApi {
  slugs: readonly string[];
  add: (slug: string) => void;
  remove: (slug: string) => void;
  toggle: (slug: string) => void;
  clear: () => void;
  set: (slugs: readonly string[]) => void;
}

export function useFilterTags(): FilterTagsApi {
  const [slugs, setSlugsState] = useState<readonly string[]>([]);

  // Hydrate from URL once on mount + react to browser back/forward.
  useEffect(() => {
    const readFromUrl = () => setSlugsState(parseTagsParam(window.location.search));
    readFromUrl();
    window.addEventListener("popstate", readFromUrl);
    return () => window.removeEventListener("popstate", readFromUrl);
  }, []);

  const commit = useCallback((next: readonly string[]) => {
    setSlugsState(next);
    writeTagsParam(next);
  }, []);

  const add = useCallback(
    (slug: string) => {
      setSlugsState((prev) => {
        if (prev.includes(slug)) return prev;
        const next = [...prev, slug];
        writeTagsParam(next);
        return next;
      });
    },
    [],
  );

  const remove = useCallback((slug: string) => {
    setSlugsState((prev) => {
      if (!prev.includes(slug)) return prev;
      const next = prev.filter((s) => s !== slug);
      writeTagsParam(next);
      return next;
    });
  }, []);

  const toggle = useCallback((slug: string) => {
    setSlugsState((prev) => {
      const next = prev.includes(slug)
        ? prev.filter((s) => s !== slug)
        : [...prev, slug];
      writeTagsParam(next);
      return next;
    });
  }, []);

  const clear = useCallback(() => commit([]), [commit]);
  const set = useCallback((s: readonly string[]) => commit(dedupe(s)), [commit]);

  return { slugs, add, remove, toggle, clear, set };
}

/* ── URL <-> slugs helpers (pure, exported for testing) ───────────────── */

export function parseTagsParam(search: string): string[] {
  const params = new URLSearchParams(search);
  const raw = params.get(PARAM);
  if (!raw) return [];
  return dedupe(
    raw
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean),
  );
}

function writeTagsParam(slugs: readonly string[]): void {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  if (slugs.length === 0) {
    params.delete(PARAM);
  } else {
    params.set(PARAM, slugs.join(","));
  }
  const query = params.toString();
  const url = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;
  window.history.replaceState(window.history.state, "", url);
}

function dedupe(slugs: readonly string[]): string[] {
  return Array.from(new Set(slugs));
}
