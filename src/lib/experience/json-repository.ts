import { experienceData } from "@/content/data";
import type { ExperienceEntry } from "./types";

/**
 * Read access to experience.json (validated at build, see `src/content/`).
 * A plain module: one data source, three lookups. Components still go
 * through here rather than importing the JSON, so the data boundary stays
 * in one place.
 */
export const experienceRepository = {
  getAll(): ExperienceEntry[] {
    return experienceData;
  },

  /** Professional/technical entries: what the Explorer filters. */
  getRelevant(): ExperienceEntry[] {
    return experienceData.filter((entry) => entry.relevant);
  },

  getById(id: string): ExperienceEntry | undefined {
    return experienceData.find((entry) => entry.id === id);
  },
};
