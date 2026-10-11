import { getHeadingLine, monthRange } from "@/lib/experience/format";
import type { ExperienceEntry } from "@/lib/experience/types";
import type { MessageKey } from "@/i18n/translator";

/**
 * Career swimlane: the career at a glance, one lane per kind of work,
 * 2016 (when computer science began) to now. Lanes point at entry ids so
 * the dates always come from experience.json; adding a role to the
 * swimlane means adding its id here.
 */
export interface CareerLaneConfig {
  id: string;
  labelKey: MessageKey;
  entryIds: readonly string[];
}

export const CAREER_LANES: readonly CareerLaneConfig[] = [
  {
    id: "teaching",
    labelKey: "career.lanes.teaching",
    entryIds: ["school-of-tech-instructor-2017"],
  },
  {
    id: "founding",
    labelKey: "career.lanes.founding",
    entryIds: ["aidprof-product-owner-2020"],
  },
  {
    id: "data",
    labelKey: "career.lanes.data",
    entryIds: ["uplanner-data-engineer-2021"],
  },
  {
    id: "platform",
    labelKey: "career.lanes.platform",
    entryIds: ["apple-software-project-engineer-2024"],
  },
];

/** Axis start: the year computer science studies began. */
export const CAREER_AXIS_START_YEAR = 2016;

/**
 * The shared axis: the start year to the month after "now", as a function
 * from an absolute month index to a percentage (clamped to the axis).
 */
function careerAxis() {
  const now = new Date();
  const start = CAREER_AXIS_START_YEAR * 12 + 1;
  const end = now.getUTCFullYear() * 12 + now.getUTCMonth() + 2;
  const pct = (month: number) =>
    Math.min(100, Math.max(0, ((month - start) / (end - start)) * 100));
  return { pct, endYear: now.getUTCFullYear() };
}

export interface SwimlaneBar {
  entry: ExperienceEntry;
  /** Left offset and width as percentages of the axis. */
  left: number;
  width: number;
  startYear: number;
  /** null while ongoing. */
  endYear: number | null;
}

export interface SwimlaneLane {
  id: string;
  labelKey: MessageKey;
  bars: SwimlaneBar[];
}

export interface Swimlane {
  lanes: SwimlaneLane[];
  /** Year ticks along the axis, with their left offset in percent. */
  ticks: { year: number; left: number }[];
}

/**
 * Lay the lanes out on a shared month axis. Evaluated at render time, so
 * on the static site "now" is the build date (ongoing roles end there).
 */
export function buildSwimlane(
  entries: readonly ExperienceEntry[],
  lanes: readonly CareerLaneConfig[] = CAREER_LANES,
): Swimlane {
  const byId = new Map(entries.map((e) => [e.id, e]));
  const { pct, endYear } = careerAxis();

  const built = lanes.map((lane) => ({
    id: lane.id,
    labelKey: lane.labelKey,
    bars: lane.entryIds.flatMap((id) => {
      const entry = byId.get(id);
      const range = entry && monthRange(entry.period);
      if (!entry || !range) return [];
      const left = pct(range[0]);
      return [
        {
          entry,
          left,
          width: Math.max(pct(range[1]) - left, 1.5),
          startYear: Math.floor((range[0] - 1) / 12),
          endYear: entry.period.end ? Math.floor((range[1] - 1) / 12) : null,
        },
      ];
    }),
  }));

  const ticks: Swimlane["ticks"] = [];
  for (let y = CAREER_AXIS_START_YEAR; y <= endYear; y += 2) {
    ticks.push({ year: y, left: pct(y * 12 + 1) });
  }
  return { lanes: built.filter((l) => l.bars.length > 0), ticks };
}

/**
 * The swimlane as plain data: one row per bar, no entry objects. This is
 * what a client component gets (the landing's career strip), so "now" stays
 * the build date and the browser never recomputes a position.
 */
export interface CareerStripRow {
  laneId: string;
  labelKey: MessageKey;
  entryId: string;
  /** Organization shown next to the years. */
  org: string | null;
  left: number;
  width: number;
  startYear: number;
  /** null while ongoing. */
  endYear: number | null;
}

export interface CareerStripData {
  rows: CareerStripRow[];
  ticks: Swimlane["ticks"];
}

export function toCareerStrip(swimlane: Swimlane): CareerStripData {
  return {
    rows: swimlane.lanes.flatMap((lane) =>
      lane.bars.map((bar) => ({
        laneId: lane.id,
        labelKey: lane.labelKey,
        entryId: bar.entry.id,
        org: getHeadingLine(bar.entry).secondary,
        left: bar.left,
        width: bar.width,
        startYear: bar.startYear,
        endYear: bar.endYear,
      })),
    ),
    ticks: swimlane.ticks,
  };
}

/**
 * Where each entry starts on the career axis, for the Story page's progress
 * marker. Entries that began before the axis sit at its start (their real
 * year is kept for the label). Computed on the server, like the swimlane.
 */
export interface StoryAxisPoint {
  /** The year the entry started. */
  year: number;
  /** Position on the axis, in percent. */
  left: number;
}

export interface StoryAxis {
  startYear: number;
  endYear: number;
  points: Record<string, StoryAxisPoint>;
}

export function buildStoryAxis(entries: readonly ExperienceEntry[]): StoryAxis {
  const { pct, endYear } = careerAxis();
  const points: StoryAxis["points"] = {};
  for (const entry of entries) {
    const range = monthRange(entry.period);
    if (!range) continue;
    points[entry.id] = { year: Math.floor((range[0] - 1) / 12), left: pct(range[0]) };
  }
  return { startYear: CAREER_AXIS_START_YEAR, endYear, points };
}
