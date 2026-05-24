import type { ExperienceEntry } from "@/lib/experience/types";
import type { StatComputer } from "../types";

export const entryCountComputer: StatComputer<number> = {
  id: "entry-count",
  label: "Projects & roles",
  compute(entries: ExperienceEntry[]): number {
    return entries.length;
  },
};
