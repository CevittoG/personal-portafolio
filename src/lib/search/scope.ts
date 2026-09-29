import type { TagType, TaxonomyEntry } from "@/lib/taxonomy/types";

/**
 * What the Explorer search offers. Recruiters search for tools and roles,
 * so the long tail of concepts, scale descriptors and soft skills stays out
 * of the dropdown (it still shows on cards and deep dives).
 *
 * Exception: the concepts a data-platform recruiter actually types (ETL,
 * data pipelines, warehousing…). Hiding those would make the most relevant
 * queries dead ends.
 */
const HIDDEN_TYPES: ReadonlySet<TagType> = new Set([
  "concepts",
  "scale",
  "soft_skills",
]);

export const SEARCHABLE_CONCEPTS: ReadonlySet<string> = new Set([
  "etl",
  "elt",
  "data-pipelines",
  "data-modeling",
  "data-warehousing",
  "cdc",
  "workflow-orchestration",
  "distributed-systems",
  "microservices",
  "rest-apis",
  "database-partitioning",
  "performance-optimization",
  "observability",
  "ci-cd",
  "machine-learning",
  "mlops",
  "llms",
  "rag",
]);

export function isSearchable(entry: TaxonomyEntry): boolean {
  if (!HIDDEN_TYPES.has(entry.type)) return true;
  return entry.type === "concepts" && SEARCHABLE_CONCEPTS.has(entry.slug);
}
