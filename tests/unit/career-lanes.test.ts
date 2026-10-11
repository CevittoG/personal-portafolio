import { describe, expect, it } from "vitest";
import { buildSwimlane, toCareerStrip, type CareerLaneConfig } from "@/lib/story/career-lanes";
import { job } from "./fixtures";

const LANES: CareerLaneConfig[] = [
  { id: "first", labelKey: "career.lanes.teaching", entryIds: ["one"] },
  { id: "second", labelKey: "career.lanes.data", entryIds: ["two", "not-in-the-data"] },
];

describe("story/career-lanes", () => {
  const entries = [
    job("one", { period: { start: "2018-01", end: "2019-06" } }),
    job("two", { period: { start: "2022-06", end: null } }),
  ];
  const strip = toCareerStrip(buildSwimlane(entries, LANES));

  it("flattens the swimlane to one row per bar, skipping unknown entries", () => {
    expect(strip.rows.map((row) => [row.laneId, row.entryId])).toEqual([
      ["first", "one"],
      ["second", "two"],
    ]);
    expect(strip.rows[0]).toMatchObject({ org: "Co one", startYear: 2018 });
    expect(strip.rows[0].endYear).not.toBeNull();
  });

  it("keeps an ongoing role open-ended and later on the axis", () => {
    expect(strip.rows[1].endYear).toBeNull();
    expect(strip.rows[1].left).toBeGreaterThan(strip.rows[0].left);
  });

  // The strip crosses to a client component as props.
  it("is plain data that survives serialization", () => {
    expect(JSON.parse(JSON.stringify(strip))).toEqual(strip);
  });
});

describe("story/career-lanes buildStoryAxis", () => {
  it("places each entry's start on the axis and clamps earlier ones to its start", async () => {
    const { buildStoryAxis, CAREER_AXIS_START_YEAR } = await import("@/lib/story/career-lanes");
    const axis = buildStoryAxis([
      job("before", { period: { start: "2010-03", end: "2014-01" } }),
      job("early", { period: { start: "2017-01", end: "2018-01" } }),
      job("late", { period: { start: "2023-01", end: null } }),
    ]);
    expect(axis.startYear).toBe(CAREER_AXIS_START_YEAR);
    expect(axis.endYear).toBeGreaterThanOrEqual(2026);
    // The real year is kept for the label even when the point is clamped.
    expect(axis.points.before).toEqual({ year: 2010, left: 0 });
    expect(axis.points.early.year).toBe(2017);
    expect(axis.points.early.left).toBeGreaterThan(0);
    expect(axis.points.late.left).toBeGreaterThan(axis.points.early.left);
    expect(axis.points.late.left).toBeLessThan(100);
  });
});
