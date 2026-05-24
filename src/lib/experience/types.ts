import type { TagType } from "@/lib/taxonomy/types";

export type TagMap = Record<TagType, string[]>;

export interface Period {
  start: string; // YYYY-MM
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
