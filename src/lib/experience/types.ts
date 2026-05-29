import type { TagType } from "@/lib/taxonomy/types";

export type TagMap = Record<TagType, string[]>;

export interface Period {
  start: string | null; // YYYY-MM (or YYYY); null = unknown start
  end: string | null; // null = current
}

export interface Media {
  label: string;
  url: string;
  type: "repo" | "url" | "demo" | "article" | "certificate";
}

interface BaseEntry {
  id: string;
  title: string;
  period: Period;
  summary: string;
  description: string;
  tags: TagMap;
  impact: string[];
  media: Media[];
  featured: boolean;
  /**
   * Whether this entry counts as professional/technical experience. Drives
   * the Explorer "Discover" tool (only relevant entries are shown/filtered)
   * and the years-of-experience stat. Non-relevant entries (e.g. unrelated
   * jobs, formal education, personal pursuits) are kept in the data for the
   * Story timeline and direct deep-dive links but stay out of Discover.
   */
  relevant: boolean;
  /**
   * Which Story act this entry belongs to. Absent → not shown on the Story
   * timeline (e.g. formal education). Independent of `relevant`/Discover:
   * `"foundation"` is the non-technical Act 1, `"technical"` is the Act 3
   * engineering career.
   */
  story_act?: "foundation" | "technical";
  /**
   * 1–2 sentence reflective statement: the pillar of this chapter and how it
   * shaped the person. Shown on the Story timeline in place of `summary`.
   * Distinct from `impact` (quantifiable outcomes) and `summary` (factual capsule).
   */
  personal_impact?: string;
}

export interface Company {
  name: string;
  url: string | null;
  industry: string;
}

export interface JobEntry extends BaseEntry {
  type: "job";
  company: Company;
  location: string;
  employment_type: "full-time" | "contract" | "freelance" | "part-time";
  team: string | null;
}

export interface ProjectEntry extends BaseEntry {
  type: "project";
  status: "completed" | "ongoing" | "archived";
  client: string | null;
}

export interface EducationEntry extends BaseEntry {
  type: "education";
  institution: string;
  credential: "degree" | "certification" | "course" | "bootcamp";
  issuer: string;
}

export interface PersonalEntry extends BaseEntry {
  type: "personal";
  region: string;
}

export type ExperienceEntry =
  | JobEntry
  | ProjectEntry
  | EducationEntry
  | PersonalEntry;

export type ExperienceType = ExperienceEntry["type"];
