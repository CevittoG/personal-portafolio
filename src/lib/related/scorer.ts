import type { ExperienceEntry } from "@/lib/experience/types";

export interface ScoredEntry {
  entry: ExperienceEntry;
  score: number;
  matchedSlugs: string[];
}

/**
 * IRelatedScorer — pluggable scoring for the Related Experience section.
 * Swap implementations (e.g., semantic-similarity scorer) without changing
 * the page that consumes it (DIP).
 */
export interface IRelatedScorer {
  readonly id: string;
  score(target: ExperienceEntry, candidate: ExperienceEntry): ScoredEntry;
  topN(target: ExperienceEntry, all: ExperienceEntry[], n: number): ScoredEntry[];
}
