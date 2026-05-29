import type { FilterStrategy } from "@/lib/filters/types";
import type { ExperienceEntry, ExperienceType } from "./types";

/**
 * IExperienceRepository — read-only surface for experience data.
 * Kept narrow (ISP): callers only need these four methods.
 */
export interface IExperienceRepository {
  getAll(): ExperienceEntry[];
  /** Entries flagged as professional/technical experience — the set the
   *  Explorer "Discover" tool and the stats bar operate on. */
  getRelevant(): ExperienceEntry[];
  getById(id: string): ExperienceEntry | undefined;
  getByType(type: ExperienceType): ExperienceEntry[];
  /** Apply a FilterStrategy (Strategy pattern → OCP). */
  getFiltered(activeTags: string[], strategy: FilterStrategy): ExperienceEntry[];
}
