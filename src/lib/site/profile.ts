import { experienceRepository } from "@/lib/experience/json-repository";
import { yearsInEngineering } from "@/lib/stats/years-in-engineering";

/**
 * Facts about the owner that several surfaces repeat: meta descriptions,
 * JSON-LD, the Contact "At a glance" block and share images. Kept in one
 * place so a recruiter never reads two different numbers.
 */

/** Core stack, in the order recruiters scan for it. Proper nouns: same in every locale. */
export const CORE_STACK = [
  "Python",
  "SQL",
  "Snowflake",
  "Kubernetes",
  "PostgreSQL",
  "Spark",
  "FastAPI",
  "Airflow",
] as const;

/**
 * Whole years of engineering work, rounded down so "5+ years" never
 * overstates what the entry dates show. Same source as the Stats Bar.
 */
export function getEngineeringYears(): number {
  return Math.floor(yearsInEngineering(experienceRepository.getRelevant()));
}
