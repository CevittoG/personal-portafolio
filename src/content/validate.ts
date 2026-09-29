import type { z } from "zod";
import { SEARCH_ALIASES } from "@/lib/search/aliases";
import { SEARCHABLE_CONCEPTS } from "@/lib/search/scope";
import { STARTER_TAGS } from "@/lib/search/starters";
import { CAREER_LANES } from "@/lib/story/career-lanes";
import { TAG_TYPES } from "@/lib/taxonomy/types";
import { ExperienceSchema, TaxonomySchema } from "./schema";

/**
 * Validate the content files against their schemas, then check the rules
 * that span files and code:
 *
 *   - every tag slug on an entry exists in taxonomy.json, under that type
 *   - taxonomy keys equal their `slug`, sit in the bucket of their `type`,
 *     are unique across buckets, and `related` slugs resolve
 *   - experience ids are unique
 *   - hand-maintained references resolve: starter tags, search aliases,
 *     searchable concepts, career-lane entry ids
 *
 * Returns a list of human-readable problems; empty means valid.
 */
export function validateContent(taxonomyRaw: unknown, experienceRaw: unknown): string[] {
  const errors: string[] = [];

  const taxonomy = TaxonomySchema.safeParse(taxonomyRaw);
  if (!taxonomy.success) errors.push(...formatIssues("taxonomy.json", taxonomy.error));
  const experience = ExperienceSchema.safeParse(experienceRaw);
  if (!experience.success) errors.push(...formatIssues("experience.json", experience.error));
  if (!taxonomy.success || !experience.success) return errors;

  // Taxonomy: keys, buckets, uniqueness, related links.
  const typeOf = new Map<string, string>();
  for (const type of TAG_TYPES) {
    const bucket = taxonomy.data[type];
    if (!bucket) {
      errors.push(`taxonomy.json: missing "${type}" bucket`);
      continue;
    }
    for (const [key, tag] of Object.entries(bucket)) {
      if (key !== tag.slug) errors.push(`taxonomy.json: key "${key}" has slug "${tag.slug}"`);
      if (tag.type !== type) errors.push(`taxonomy.json: "${key}" is in "${type}" but has type "${tag.type}"`);
      if (typeOf.has(key)) errors.push(`taxonomy.json: slug "${key}" appears in both "${typeOf.get(key)}" and "${type}"`);
      typeOf.set(key, type);
    }
  }
  for (const type of TAG_TYPES) {
    for (const tag of Object.values(taxonomy.data[type] ?? {})) {
      for (const rel of tag.related) {
        if (!typeOf.has(rel)) errors.push(`taxonomy.json: "${tag.slug}" relates to unknown slug "${rel}"`);
      }
    }
  }

  // Experience: unique ids, tags resolve under the right type.
  const ids = new Set<string>();
  for (const entry of experience.data) {
    if (ids.has(entry.id)) errors.push(`experience.json: duplicate id "${entry.id}"`);
    ids.add(entry.id);
    for (const type of TAG_TYPES) {
      for (const slug of entry.tags[type]) {
        const actual = typeOf.get(slug);
        if (!actual) errors.push(`experience.json: "${entry.id}" uses unknown ${type} tag "${slug}"`);
        else if (actual !== type) errors.push(`experience.json: "${entry.id}" lists "${slug}" under ${type}, but it is a ${actual} tag`);
      }
    }
  }

  // Hand-maintained references in code.
  for (const slug of STARTER_TAGS) {
    if (!typeOf.has(slug)) errors.push(`search/starters.ts: unknown tag "${slug}"`);
  }
  for (const [alias, slug] of Object.entries(SEARCH_ALIASES)) {
    if (!typeOf.has(slug)) errors.push(`search/aliases.ts: "${alias}" points to unknown tag "${slug}"`);
  }
  for (const slug of SEARCHABLE_CONCEPTS) {
    if (typeOf.get(slug) !== "concepts") errors.push(`search/scope.ts: "${slug}" is not a concepts tag`);
  }
  for (const lane of CAREER_LANES) {
    for (const id of lane.entryIds) {
      if (!ids.has(id)) errors.push(`story/career-lanes.ts: lane "${lane.id}" points to unknown entry "${id}"`);
    }
  }

  return errors;
}

function formatIssues(file: string, error: z.ZodError): string[] {
  return error.issues.map((issue) => {
    const path = issue.path.length ? issue.path.join(".") : "(root)";
    return `${file}: ${path}: ${issue.message}`;
  });
}
