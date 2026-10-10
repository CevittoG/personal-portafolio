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
