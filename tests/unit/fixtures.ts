import type { ExperienceEntry, JobEntry, Period } from "@/lib/experience/types";
import { TAG_TYPES, type TagType } from "@/lib/taxonomy/types";

/** A valid job entry; override only what a test is about. */
export function job(
  id: string,
  opts: {
    period?: Period;
    tags?: Partial<Record<TagType, string[]>>;
    story_act?: "foundation" | "technical";
    relevant?: boolean;
    impact?: string[];
  } = {},
): JobEntry {
  const tags = Object.fromEntries(
    TAG_TYPES.map((t) => [t, opts.tags?.[t] ?? []]),
  ) as Record<TagType, string[]>;
  return {
    id,
    type: "job",
    title: `Title ${id}`,
    period: opts.period ?? { start: "2020-01", end: "2021-01" },
    summary: `Summary ${id}`,
    description: "",
    tags,
    impact: opts.impact ?? [],
    media: [],
    featured: false,
    relevant: opts.relevant ?? true,
    story_act: opts.story_act,
    company: { name: `Co ${id}`, url: null, industry: "tech" },
    location: "Remote",
    employment_type: "full-time",
    team: null,
  };
}

export type { ExperienceEntry };
