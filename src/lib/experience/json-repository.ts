import experienceData from "@/data/experience.json";
import type { FilterStrategy } from "@/lib/filters/types";
import type { IExperienceRepository } from "./repository";
import type { ExperienceEntry, ExperienceType } from "./types";

const data = experienceData as ExperienceEntry[];

class JsonExperienceRepository implements IExperienceRepository {
  constructor(private readonly entries: ExperienceEntry[]) {}

  getAll(): ExperienceEntry[] {
    return this.entries;
  }

  getRelevant(): ExperienceEntry[] {
    return this.entries.filter((entry) => entry.relevant);
  }

  getById(id: string): ExperienceEntry | undefined {
    return this.entries.find((entry) => entry.id === id);
  }

  getByType(type: ExperienceType): ExperienceEntry[] {
    return this.entries.filter((entry) => entry.type === type);
  }

  getFiltered(activeTags: string[], strategy: FilterStrategy): ExperienceEntry[] {
    if (activeTags.length === 0) return this.entries;
    return this.entries.filter((entry) => strategy.matches(entry, activeTags));
  }
}

export const experienceRepository: IExperienceRepository = new JsonExperienceRepository(data);
