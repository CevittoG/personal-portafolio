import { monthRange } from "@/lib/experience/format";
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
  const now = new Date();
  const axisStart = CAREER_AXIS_START_YEAR * 12 + 1;
  const axisEnd = now.getUTCFullYear() * 12 + now.getUTCMonth() + 2;
  const span = axisEnd - axisStart;
  const pct = (month: number) =>
    Math.min(100, Math.max(0, ((month - axisStart) / span) * 100));

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
  for (let y = CAREER_AXIS_START_YEAR; y <= now.getUTCFullYear(); y += 2) {
    ticks.push({ year: y, left: pct(y * 12 + 1) });
  }
  return { lanes: built.filter((l) => l.bars.length > 0), ticks };
}
