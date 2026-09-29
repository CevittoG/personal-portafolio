"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { TagRef } from "@/lib/taxonomy/types";

/**
 * Tag labels for client islands.
 *
 * The browser never imports taxonomy.json: the server builds an index of
 * just the tags a page shows (`buildTagIndex`) and passes it here. Client
 * components read labels and types through `useTagIndex()` /
 * `useTagLabel()`.
 */
export type TagIndex = Readonly<Record<string, TagRef>>;

const TagIndexContext = createContext<TagIndex>({});

export function TagIndexProvider({
  index,
  children,
}: {
  index: TagIndex;
  children: ReactNode;
}) {
  return <TagIndexContext.Provider value={index}>{children}</TagIndexContext.Provider>;
}

export function useTagIndex(): TagIndex {
  return useContext(TagIndexContext);
}

/** Slug → display name, falling back to a titleized slug. */
export function useTagLabel(): (slug: string) => string {
  const index = useTagIndex();
  return (slug) => index[slug]?.display_name ?? titleize(slug);
}

function titleize(slug: string): string {
  return slug
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((w) => (w.length <= 3 ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1)))
    .join(" ");
}
