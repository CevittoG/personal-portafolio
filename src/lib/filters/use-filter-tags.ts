"use client";

import { useSyncExternalStore } from "react";

/**
 * URL-synced filter state for the Explorer (plan §6, Zone 2).
 *
 * Keeps an array of tag slugs in sync with the `?tags=` query param so that
 * filtered views are shareable and linkable (e.g. `/?tags=python,etl`).
 *
 * The URL is the state. Every caller of `useFilterTags()` reads the same
 * store (`useSyncExternalStore` over `location.search`), so separate client
 * islands (the hero's tool field and the Explorer further down) always
 * agree without a provider around the server-rendered page between them.
 *
 * Writes use `history.replaceState`, not `next/navigation`: static export +
 * `useSearchParams` needs a Suspense boundary the Explorer doesn't otherwise
 * need, and replacing history (vs pushing) keeps the back button untouched
 * as recruiters tinker with filters.
 *
 * SRP: this module owns *only* the URL ↔ state contract. Components decide
 * what filtering to do with the slugs it returns.
 */

const PARAM = "tags";
const EMPTY: readonly string[] = [];

export interface FilterTagsApi {
  slugs: readonly string[];
  add: (slug: string) => void;
  remove: (slug: string) => void;
  toggle: (slug: string) => void;
  clear: () => void;
  set: (slugs: readonly string[]) => void;
}

/* ── The store ───────────────────────────────────────────────────────── */

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((listener) => listener());

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  // Back and forward change the URL without going through `write`.
  if (listeners.size === 1) window.addEventListener("popstate", emit);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("popstate", emit);
  };
}

/** The parsed slugs for the current URL, with a stable identity per URL. */
let cachedSearch: string | null = null;
let cachedSlugs: readonly string[] = EMPTY;
function getSnapshot(): readonly string[] {
  const search = window.location.search;
  if (search !== cachedSearch) {
    cachedSearch = search;
    const slugs = parseTagsParam(search);
    cachedSlugs = slugs.length > 0 ? slugs : EMPTY;
  }
  return cachedSlugs;
}

/** The server never sees a query string: every page is prerendered once. */
const getServerSnapshot = (): readonly string[] => EMPTY;

function write(next: readonly string[]): void {
  writeTagsParam(next);
  emit();
}

const actions: Omit<FilterTagsApi, "slugs"> = {
  add(slug) {
    const current = getSnapshot();
    if (!current.includes(slug)) write([...current, slug]);
  },
  remove(slug) {
    const current = getSnapshot();
    if (current.includes(slug)) write(current.filter((s) => s !== slug));
  },
  toggle(slug) {
    const current = getSnapshot();
    write(current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug]);
  },
  clear() {
    if (getSnapshot().length > 0) write([]);
  },
  set(slugs) {
    write(dedupe(slugs));
  },
};

export function useFilterTags(): FilterTagsApi {
  const slugs = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return { slugs, ...actions };
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
