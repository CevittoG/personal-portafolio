import { TAG_TYPES } from "@/lib/taxonomy/types";
import { formatPeriod } from "./format";
import type { ExperienceEntry } from "./types";

/**
 * Client-side CSV generator for filtered experience entries (plan §6 Zone 4).
 *
 * Columns per plan: Title, Company, Period, Summary, Tags (pipe-separated),
 * Impact (pipe-separated). No server, no library — Excel/Sheets understand
 * RFC 4180 quoting and a UTF-8 BOM is added so non-ASCII chars survive
 * round-trips through Excel on Windows.
 */
const COLUMNS = ["Title", "Company", "Period", "Summary", "Tags", "Impact"] as const;

export function entriesToCsv(entries: readonly ExperienceEntry[]): string {
  const rows = entries.map((e) => [
    e.title,
    companyOrContext(e),
    formatPeriod(e.period),
    e.summary,
    flattenTags(e).join("|"),
    e.impact.join("|"),
  ]);
  const lines = [COLUMNS.join(","), ...rows.map((r) => r.map(csvEscape).join(","))];
  return "﻿" + lines.join("\r\n");
}

/**
 * Trigger a browser download of the given CSV content. Safe to call only
 * from event handlers (creates and clicks an anchor; needs window).
 */
export function downloadCsv(content: string, filename: string): void {
  if (typeof window === "undefined") return;
  const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/* ── helpers ─────────────────────────────────────────────────────────── */

function csvEscape(value: string): string {
  const needsQuotes = /[",\r\n]/.test(value);
  const escaped = value.replace(/"/g, '""');
  return needsQuotes ? `"${escaped}"` : escaped;
}

function flattenTags(entry: ExperienceEntry): string[] {
  const all: string[] = [];
  for (const type of TAG_TYPES) {
    for (const slug of entry.tags[type] ?? []) all.push(slug);
  }
  return all;
}

function companyOrContext(entry: ExperienceEntry): string {
  switch (entry.type) {
    case "job":
      return entry.company.name;
    case "project":
      return entry.client ?? "Personal project";
    case "education":
      return entry.institution;
    case "personal":
      return entry.region;
  }
}
