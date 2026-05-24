import type { ExperienceEntry } from "@/lib/experience/types";
import type { StatComputer } from "../types";

export const technologyCountComputer: StatComputer<number> = {
  id: "technology-count",
  label: "Technologies used",
  compute(entries: ExperienceEntry[]): number {
    const seen = new Set<string>();
    for (const entry of entries) {
      for (const slug of entry.tags.technologies ?? []) seen.add(slug);
    }
    return seen.size;
  },
};
