import type { StatComputer } from "./types";
import { entryCountComputer } from "./computers/entry-count";
import { industryCountComputer } from "./computers/industry-count";
import { technologyCountComputer } from "./computers/technology-count";
import { yearsOfExperienceComputer } from "./computers/years-of-experience";

/**
 * Registry consumed by the Stats Bar. Adding a stat = add a sibling file
 * in computers/, then append it here — no other code changes needed (OCP).
 */
export const statComputers: StatComputer[] = [
  yearsOfExperienceComputer,
  technologyCountComputer,
  industryCountComputer,
  entryCountComputer,
];
