import { describe, expect, it } from "vitest";
import { closestMatches } from "@/lib/search/closest";
import { isSearchable } from "@/lib/search/scope";
import { defaultSearchStrategy } from "@/lib/search/substring";
import { taxonomyRepository } from "@/lib/taxonomy/json-repository";

const all = taxonomyRepository.getAll();
const searchable = all.filter(isSearchable);
const slugs = (q: string) => defaultSearchStrategy.search(q, searchable).map((e) => e.slug);

describe("search", () => {
  it("resolves recruiter shorthands first", () => {
    expect(slugs("k8s")[0]).toBe("kubernetes");
    expect(slugs("postgres")[0]).toBe("postgresql");
    expect(slugs("post")).toContain("postgresql");
  });

  it("ranks exact and prefix matches above contains", () => {
    expect(slugs("python")[0]).toBe("python");
    expect(slugs("snow")[0]).toBe("snowflake");
  });

  it("hides soft skills and scale but keeps recruiter concepts", () => {
    const soft = all.find((t) => t.type === "soft_skills")!;
    const scale = all.find((t) => t.type === "scale")!;
    expect(isSearchable(soft)).toBe(false);
    expect(isSearchable(scale)).toBe(false);
    expect(slugs("etl")).toContain("etl");
    expect(slugs("bag of words")).toEqual([]);
  });

  it("offers the closest tags for a typo, and nothing for noise", () => {
    expect(closestMatches("snowflke", searchable).map((e) => e.slug)).toContain("snowflake");
    expect(closestMatches("kubernets", searchable)[0]?.slug).toBe("kubernetes");
    expect(closestMatches("zzzzzzzz", searchable)).toEqual([]);
    expect(closestMatches("ab", searchable)).toEqual([]);
  });
});
