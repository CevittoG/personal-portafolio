import type { ExperienceEntry } from "@/lib/experience/types";

/**
 * FilterStrategy — a single-method strategy for deciding whether an entry
 * matches an active tag set. Adding a new matching rule (Any, NotAny, …)
 * means dropping a new file next to tag-match.ts — never touching this one.
 */
export interface FilterStrategy {
  readonly id: string;
  matches(entry: ExperienceEntry, activeTags: string[]): boolean;
}
