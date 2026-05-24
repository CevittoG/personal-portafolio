import type { ExperienceEntry } from "@/lib/experience/types";
import { TAG_TYPES, type TagType } from "@/lib/taxonomy/types";
import type { IRelatedScorer, ScoredEntry } from "./scorer";

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

export class WeightedTagOverlapScorer implements IRelatedScorer {
  readonly id = "weighted-tag-overlap";

  score(target: ExperienceEntry, candidate: ExperienceEntry): ScoredEntry {
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

  topN(target: ExperienceEntry, all: ExperienceEntry[], n: number): ScoredEntry[] {
    return all
      .filter((candidate) => candidate.id !== target.id)
      .map((candidate) => this.score(target, candidate))
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, n);
  }
}

export const defaultRelatedScorer: IRelatedScorer = new WeightedTagOverlapScorer();
