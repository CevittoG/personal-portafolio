import type { ExperienceEntry, Period } from "./types";

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function parseYM(ym: string): { y: number; m: number } {
  const [y, m] = ym.split("-").map(Number);
  return { y, m };
}

function formatYM(ym: string): string {
  const { y, m } = parseYM(ym);
  if (!y || !m) return ym;
  return `${MONTH_NAMES[m - 1]} ${y}`;
}

/** "Mar 2022 — Present" or "Mar 2022 — Aug 2024". */
export function formatPeriod(period: Period): string {
  const start = formatYM(period.start);
  const end = period.end ? formatYM(period.end) : "Present";
  return `${start} — ${end}`;
}

/** Duration in whole months, for stat computations / display ("2 yrs 4 mo"). */
export function durationMonths(period: Period): number {
  const { y: sy, m: sm } = parseYM(period.start);
  const now = new Date();
  const { y: ey, m: em } = period.end
    ? parseYM(period.end)
    : { y: now.getUTCFullYear(), m: now.getUTCMonth() + 1 };
  return Math.max(0, (ey - sy) * 12 + (em - sm));
}

/**
 * Heading line for any entry type. The Card stays pure — type-specific
 * shape extraction lives here (discriminated-union exhaustiveness).
 */
export interface HeadingLine {
  primary: string;
  secondary: string | null;
}

export function getHeadingLine(entry: ExperienceEntry): HeadingLine {
  switch (entry.type) {
    case "job":
      return { primary: entry.title, secondary: entry.company.name };
    case "project":
      return { primary: entry.title, secondary: entry.client ?? "Independent project" };
    case "education":
      return { primary: entry.title, secondary: entry.institution };
    case "personal":
      return { primary: entry.title, secondary: entry.region };
  }
}

/** Small badge label shown next to the period (e.g., "Full-time", "Ongoing"). */
export function getMetaBadge(entry: ExperienceEntry): string | null {
  switch (entry.type) {
    case "job":
      return labelizeEmployment(entry.employment_type);
    case "project":
      return capitalize(entry.status);
    case "education":
      return capitalize(entry.credential);
    case "personal":
      return null;
  }
}

/** The single most impressive impact line — first one wins (curated). */
export function getImpactHighlight(entry: ExperienceEntry): string | null {
  return entry.impact[0] ?? null;
}

/** Teaser paragraph for the Drawer (plan §11) — first \\n-separated chunk
 *  of `description`, trimmed. Empty string when description is blank. */
export function getDescriptionTeaser(entry: ExperienceEntry): string {
  const desc = entry.description?.trim() ?? "";
  if (!desc) return "";
  const [first] = desc.split(/\n{2,}|\r\n\r\n/);
  return first.trim();
}

/** Location/employment meta line for any entry type — used by the Drawer
 *  sub-header (plan §11 Content). Returns `null` when nothing meaningful. */
export function getDrawerSubMeta(entry: ExperienceEntry): string | null {
  switch (entry.type) {
    case "job": {
      const bits = [entry.location, labelizeEmployment(entry.employment_type)];
      return bits.filter(Boolean).join(" · ");
    }
    case "project":
      return capitalize(entry.status);
    case "education":
      return [capitalize(entry.credential), entry.issuer].filter(Boolean).join(" · ");
    case "personal":
      return entry.region;
  }
}

/* ── private ─────────────────────────────────────────────────────────── */

function labelizeEmployment(t: string): string {
  // "full-time" → "Full-time", "part-time" → "Part-time"
  return t.split("-").map(capitalize).join("-");
}

function capitalize(s: string): string {
  return s.length === 0 ? s : s[0].toUpperCase() + s.slice(1);
}
