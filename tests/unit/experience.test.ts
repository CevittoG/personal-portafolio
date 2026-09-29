import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { durationMonths, formatPeriod, monthRange } from "@/lib/experience/format";
import { localizeEntry } from "@/lib/experience/localize";
import { sortEntries } from "@/lib/experience/sort";
import { cardTags } from "@/lib/experience/tag-display";
import { defaultRelatedScorer } from "@/lib/related/weighted-tag-overlap";
import { yearsOfExperienceComputer } from "@/lib/stats/computers/years-of-experience";
import { job } from "./fixtures";

describe("experience/format", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-15T12:00:00Z"));
  });
  afterEach(() => vi.useRealTimers());

  it("gives [start, end) month indexes", () => {
    expect(monthRange({ start: "2021-07", end: "2024-10" })).toEqual([2021 * 12 + 7, 2024 * 12 + 10]);
  });

  it("widens year-only boundaries to Jan…Dec", () => {
    expect(monthRange({ start: "2004", end: "2013" })).toEqual([2004 * 12 + 1, 2013 * 12 + 12]);
  });

  it("ends ongoing periods at the current month", () => {
    expect(monthRange({ start: "2024-11", end: null })).toEqual([2024 * 12 + 11, 2026 * 12 + 9]);
    expect(durationMonths({ start: "2024-11", end: null })).toBe(22);
  });

  it("returns null / 0 for an unknown start", () => {
    expect(monthRange({ start: null, end: "2020-01" })).toBeNull();
    expect(durationMonths({ start: null, end: "2020-01" })).toBe(0);
  });

  it("formats periods", () => {
    expect(formatPeriod({ start: "2021-07", end: "2024-10" })).toBe("Jul 2021 — Oct 2024");
    expect(formatPeriod({ start: "2024-11", end: null })).toBe("Nov 2024 — Present");
    expect(formatPeriod({ start: "2004", end: "2013" })).toBe("2004 — 2013");
  });
});

describe("stats/years-of-experience", () => {
  it("counts only technical entries and merges overlaps", () => {
    const years = yearsOfExperienceComputer.compute([
      // 2020-12 → 2022-02 and 2021-07 → 2024-10 overlap: one span, 2020-12 → 2024-10
      job("founder", { story_act: "technical", period: { start: "2020-12", end: "2022-02" } }),
      job("data", { story_act: "technical", period: { start: "2021-07", end: "2024-10" } }),
      // teaching never counts
      job("teach", { story_act: "foundation", period: { start: "2017-01", end: "2021-02" } }),
    ]);
    expect(years).toBeCloseTo(46 / 12, 1);
  });

  it("adds disjoint spans", () => {
    const years = yearsOfExperienceComputer.compute([
      job("a", { story_act: "technical", period: { start: "2018-01", end: "2019-01" } }),
      job("b", { story_act: "technical", period: { start: "2020-01", end: "2021-01" } }),
    ]);
    expect(years).toBe(2);
  });
});

describe("experience/sort", () => {
  const a = job("a", { period: { start: "2019-03", end: null }, tags: { languages: ["python"] } });
  const b = job("b", { period: { start: "2023-01", end: null }, tags: { languages: ["sql"] } });
  const c = job("c", { period: { start: null, end: null }, tags: { languages: ["python", "sql"] } });

  it("sorts most recent first, unknown starts last", () => {
    expect(sortEntries([a, c, b], "recent", []).map((e) => e.id)).toEqual(["b", "a", "c"]);
  });

  it("sorts by tag overlap, then recency", () => {
    expect(sortEntries([a, b, c], "relevant", ["python", "sql"]).map((e) => e.id)).toEqual(["c", "b", "a"]);
    expect(sortEntries([a, b, c], "relevant", ["python"]).map((e) => e.id)).toEqual(["a", "c", "b"]);
  });
});

describe("related/weighted-tag-overlap", () => {
  const target = job("t", { tags: { concepts: ["etl"], technologies: ["snowflake"], languages: ["python"] } });
  const concept = job("concept", { tags: { concepts: ["etl"] } }); // 3
  const tech = job("tech", { tags: { technologies: ["snowflake"], languages: ["python"] } }); // 2 + 1
  const none = job("none", { tags: { languages: ["php"] } });

  it("weights concepts 3, technologies/roles 2, others 1", () => {
    expect(defaultRelatedScorer.score(target, concept).score).toBe(3);
    expect(defaultRelatedScorer.score(target, tech).score).toBe(3);
    expect(defaultRelatedScorer.score(target, tech).matchedSlugs.sort()).toEqual(["python", "snowflake"]);
  });

  it("excludes the target itself and zero scores", () => {
    const top = defaultRelatedScorer.topN(target, [target, concept, tech, none], 3);
    expect(top.map((s) => s.entry.id).sort()).toEqual(["concept", "tech"]);
  });
});

describe("experience/tag-display", () => {
  const entry = job("e", {
    tags: {
      languages: ["python", "sql", "bash"],
      technologies: ["snowflake", "kubernetes", "postgresql", "docker"],
      concepts: ["etl", "data-pipelines"],
    },
  });

  it("shows at most six stack tags with a hidden count", () => {
    const { shown, hiddenCount } = cardTags(entry);
    expect(shown.map((t) => t.slug)).toEqual(["python", "sql", "bash", "snowflake", "kubernetes", "postgresql"]);
    expect(hiddenCount).toBe(3);
  });

  it("leads with filter matches of any type", () => {
    const { shown } = cardTags(entry, ["etl", "docker"]);
    // Matches first, in tag-type order (technologies before concepts),
    // then the stack fills the remaining four slots.
    expect(shown.map((t) => t.slug)).toEqual(["docker", "etl", "python", "sql", "bash", "snowflake"]);
  });
});

describe("experience/localize", () => {
  const base = { ...job("x", { impact: ["one", "two", "three", "four"] }), personal_impact: "reflect" };
  const translated = {
    ...base,
    translations: { es: { summary: "Resumen", impact: ["uno", "dos"] } },
  };

  it("returns English entries untouched", () => {
    expect(localizeEntry(translated, "en")).toBe(translated);
    expect(localizeEntry(base, "es")).toBe(base);
  });

  it("merges translated fields and falls back per field", () => {
    const es = localizeEntry(translated, "es");
    expect(es.summary).toBe("Resumen");
    expect(es.impact).toEqual(["uno", "dos", "three", "four"]);
    expect(es.personal_impact).toBe("reflect");
  });
});
