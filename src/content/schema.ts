import { z } from "zod";
import { LOCALES } from "@/i18n/locale";
import { TAG_TYPES } from "@/lib/taxonomy/types";

/**
 * Data contracts for `src/data/taxonomy.json` and `src/data/experience.json`.
 *
 * These schemas are the single source of truth for the content types:
 * `src/lib/taxonomy/types.ts` and `src/lib/experience/types.ts` re-export
 * `z.infer` of them, so a field can't be added to the data without the
 * compiler and the validator both knowing. Shape rules live here;
 * cross-file rules (slugs resolve, unique ids…) live in `validate.ts`.
 *
 * Zod runs at build time only (`assertValidContent()` in the root layout
 * and `pnpm validate:data`). Client code imports these types with
 * `import type`, so no validator ships to the browser.
 */

/* ── Taxonomy ─────────────────────────────────────────────────────────── */

export const TagTypeSchema = z.enum(TAG_TYPES);

export const TaxonomyEntrySchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "kebab-case slug"),
  display_name: z.string().min(1),
  type: TagTypeSchema,
  icon: z.string().nullable(),
  /** SVG logo URL (Simple Icons CDN or local path). Null for abstract tags with no canonical logo. */
  image: z.string().nullable(),
  color: z.string().nullable(),
  related: z.array(z.string()),
});

export const TaxonomySchema = z.record(
  TagTypeSchema,
  z.record(z.string(), TaxonomyEntrySchema),
);

/* ── Experience ───────────────────────────────────────────────────────── */

/** `YYYY-MM` or `YYYY`. */
const YearMonth = z
  .string()
  .regex(/^\d{4}(?:-(0[1-9]|1[0-2]))?$/, "YYYY or YYYY-MM");

export const PeriodSchema = z
  .object({
    /** null = unknown start. */
    start: YearMonth.nullable(),
    /** null = current. */
    end: YearMonth.nullable(),
  })
  .refine((p) => !p.start || !p.end || p.start.slice(0, 7) <= p.end.slice(0, 7), {
    message: "period.start is after period.end",
  });

export const MediaSchema = z.object({
  label: z.string().min(1),
  url: z.string().min(1),
  type: z.enum(["repo", "url", "demo", "article", "certificate"]),
});

/** All eight tag-type keys are required (use `[]` when empty). */
export const TagMapSchema = z
  .object(
    Object.fromEntries(TAG_TYPES.map((t) => [t, z.array(z.string())])) as Record<
      (typeof TAG_TYPES)[number],
      z.ZodArray<z.ZodString>
    >,
  )
  .strict();

export const EntryTranslationSchema = z
  .object({
    summary: z.string().min(1).optional(),
    /** Replaces `impact[0..n)`; lines past it stay in English. Max 3. */
    impact: z.array(z.string().min(1)).max(3).optional(),
    personal_impact: z.string().min(1).optional(),
  })
  .strict();

const BaseEntryShape = {
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "kebab-case id"),
  title: z.string().min(1),
  period: PeriodSchema,
  summary: z.string().min(1),
  description: z.string(),
  tags: TagMapSchema,
  impact: z.array(z.string().min(1)),
  media: z.array(MediaSchema),
  featured: z.boolean(),
  /**
   * Whether this entry counts as professional/technical experience. Drives
   * the Explorer "Discover" tool (only relevant entries are shown/filtered).
   * Non-relevant entries (unrelated jobs, formal education, personal
   * pursuits) stay in the data for the Story timeline and deep-dive links.
   */
  relevant: z.boolean(),
  /**
   * Which Story act this entry belongs to. Absent → not on the Story
   * timeline. `"foundation"` is Act 1, `"technical"` is Act 3 (and the
   * only entries counted in the years-in-engineering stat).
   */
  story_act: z.enum(["foundation", "technical"]).optional(),
  /**
   * 1–2 sentence reflective statement shown on the Story timeline in place
   * of `summary`. Distinct from `impact` (outcomes) and `summary` (facts).
   */
  personal_impact: z.string().min(1).optional(),
  /**
   * Hand-written translations of the reader-facing prose, keyed by locale.
   * Missing fields fall back to English (see `localizeEntry`).
   */
  translations: z.partialRecord(z.enum(LOCALES), EntryTranslationSchema).optional(),
};

export const CompanySchema = z.object({
  name: z.string().min(1),
  url: z.string().nullable(),
  industry: z.string(),
});

export const JobEntrySchema = z
  .object({
    ...BaseEntryShape,
    type: z.literal("job"),
    company: CompanySchema,
    location: z.string(),
    employment_type: z.enum(["full-time", "contract", "freelance", "part-time"]),
    team: z.string().nullable(),
  })
  .strict();

export const ProjectEntrySchema = z
  .object({
    ...BaseEntryShape,
    type: z.literal("project"),
    status: z.enum(["completed", "ongoing", "archived"]),
    client: z.string().nullable(),
  })
  .strict();

export const EducationEntrySchema = z
  .object({
    ...BaseEntryShape,
    type: z.literal("education"),
    institution: z.string().min(1),
    credential: z.enum(["degree", "certification", "course", "bootcamp"]),
    /** Certifying body, when different from the institution. */
    issuer: z.string().nullable().optional(),
    location: z.string().optional(),
  })
  .strict();

export const PersonalEntrySchema = z
  .object({
    ...BaseEntryShape,
    type: z.literal("personal"),
    region: z.string(),
  })
  .strict();

export const ExperienceEntrySchema = z.discriminatedUnion("type", [
  JobEntrySchema,
  ProjectEntrySchema,
  EducationEntrySchema,
  PersonalEntrySchema,
]);

export const ExperienceSchema = z.array(ExperienceEntrySchema);
