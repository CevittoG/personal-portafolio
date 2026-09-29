import experienceJson from "@/data/experience.json";
import taxonomyJson from "@/data/taxonomy.json";
import type { ExperienceEntry } from "@/lib/experience/types";
import type { Taxonomy } from "@/lib/taxonomy/types";

/**
 * The one place the raw JSON meets the typed world.
 *
 * JSON imports are typed loosely (plain `string`s, not the literal unions
 * the schemas describe), so a narrowing step is unavoidable. It happens
 * here, once, and it is backed by validation: every build runs
 * `assertValidContent()` (root layout) against the full schemas and
 * cross-file rules, and `pnpm validate:data` runs it in CI. Invalid data
 * fails the build before this assumption can be wrong in production.
 *
 * Repositories import from here; components import repositories (DIP).
 */
export const experienceData = experienceJson as unknown as ExperienceEntry[];
export const taxonomyData = taxonomyJson as unknown as Taxonomy;

/** Raw values for the validator, which must not trust the narrowed types. */
export const rawContent = { taxonomy: taxonomyJson as unknown, experience: experienceJson as unknown };
