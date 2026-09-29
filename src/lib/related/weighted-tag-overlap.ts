import type { ExperienceEntry } from "@/lib/experience/types";
import { TAG_TYPES, type TagType } from "@/lib/taxonomy/types";

/** A candidate entry, its related-ness score and the tags that earned it. */
export interface ScoredEntry {
  entry: ExperienceEntry;
  score: number;
  matchedSlugs: string[];
}

/** Weights from portfolio-website-plan.md §12. */
const WEIGHTS: Record<TagType, number> = {
  concepts: 3,
  technologies: 2,
  roles: 2,
  languages: 1,
  libraries: 1,
  domains: 1,
  scale: 1,
  soft_skills: 1,
};

/** Weighted tag overlap between two entries. */
export function scoreRelated(
  target: ExperienceEntry,
  candidate: ExperienceEntry,
): ScoredEntry {
  let score = 0;
  const matchedSlugs: string[] = [];
  for (const type of TAG_TYPES) {
    const targetSlugs = new Set(target.tags[type] ?? []);
    for (const slug of candidate.tags[type] ?? []) {
      if (targetSlugs.has(slug)) {
        score += WEIGHTS[type];
        matchedSlugs.push(slug);
      }
    }
  }
  return { entry: candidate, score, matchedSlugs };
}

/** The `n` most related entries to `target`, excluding itself and zero scores. */
export function topRelated(
  target: ExperienceEntry,
  all: readonly ExperienceEntry[],
  n: number,
): ScoredEntry[] {
  return all
    .filter((candidate) => candidate.id !== target.id)
    .map((candidate) => scoreRelated(target, candidate))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, n);
}
