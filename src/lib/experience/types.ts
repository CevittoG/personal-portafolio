import type { z } from "zod";
import type {
  CompanySchema,
  EducationEntrySchema,
  EntryTranslationSchema,
  ExperienceEntrySchema,
  JobEntrySchema,
  MediaSchema,
  PeriodSchema,
  PersonalEntrySchema,
  ProjectEntrySchema,
} from "@/content/schema";
import type { TagType } from "@/lib/taxonomy/types";

/**
 * Experience types, derived from the Zod schemas in `src/content/schema.ts`
 * (field docs live there). Type-only imports: no validator reaches the
 * client bundle.
 */
export type TagMap = Record<TagType, string[]>;

export type Period = z.infer<typeof PeriodSchema>;
export type Media = z.infer<typeof MediaSchema>;
export type Company = z.infer<typeof CompanySchema>;
export type EntryTranslation = z.infer<typeof EntryTranslationSchema>;

export type JobEntry = z.infer<typeof JobEntrySchema>;
export type ProjectEntry = z.infer<typeof ProjectEntrySchema>;
export type EducationEntry = z.infer<typeof EducationEntrySchema>;
export type PersonalEntry = z.infer<typeof PersonalEntrySchema>;

export type ExperienceEntry = z.infer<typeof ExperienceEntrySchema>;

export type ExperienceType = ExperienceEntry["type"];
