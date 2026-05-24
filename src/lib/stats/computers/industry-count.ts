import type { ExperienceEntry } from "@/lib/experience/types";
import type { StatComputer } from "../types";

export const industryCountComputer: StatComputer<number> = {
  id: "industry-count",
  label: "Industries",
  compute(entries: ExperienceEntry[]): number {
    const seen = new Set<string>();
    for (const entry of entries) {
      for (const slug of entry.tags.domains ?? []) seen.add(slug);
    }
    return seen.size;
  },
};
