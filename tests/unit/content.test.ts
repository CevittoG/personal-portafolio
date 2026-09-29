import { describe, expect, it } from "vitest";
import { rawContent } from "@/content/data";
import { validateContent } from "@/content/validate";

/** Deep copy of the real content, so each test can break one thing. */
function content() {
  return structuredClone(rawContent) as {
    taxonomy: Record<string, Record<string, { slug: string; type: string; related: string[] }>>;
    experience: Array<Record<string, unknown> & { id: string; tags: Record<string, string[]>; period: Record<string, unknown> }>;
  };
}

describe("content integrity", () => {
  it("the shipped taxonomy.json and experience.json are valid", () => {
    expect(validateContent(rawContent.taxonomy, rawContent.experience)).toEqual([]);
  });

  it("catches an unknown tag slug", () => {
    const c = content();
    c.experience[0].tags.languages.push("cobol");
    expect(validateContent(c.taxonomy, c.experience).join()).toMatch(/unknown languages tag "cobol"/);
  });

  it("catches a tag filed under the wrong type", () => {
    const c = content();
    c.experience[0].tags.roles.push("python");
    expect(validateContent(c.taxonomy, c.experience).join()).toMatch(/"python" under roles, but it is a languages tag/);
  });

  it("catches a missing tag-type key", () => {
    const c = content();
    delete c.experience[0].tags.scale;
    expect(validateContent(c.taxonomy, c.experience).join()).toMatch(/tags\.scale/);
  });

  it("catches duplicate ids", () => {
    const c = content();
    c.experience.push(structuredClone(c.experience[0]));
    expect(validateContent(c.taxonomy, c.experience).join()).toMatch(/duplicate id/);
  });

  it("catches malformed and inverted periods", () => {
    const c = content();
    c.experience[0].period = { start: "2024-13", end: null };
    c.experience[1].period = { start: "2022-05", end: "2021-01" };
    const errors = validateContent(c.taxonomy, c.experience).join("\n");
    expect(errors).toMatch(/YYYY or YYYY-MM/);
    expect(errors).toMatch(/start is after period.end/);
  });

  it("catches broken related links and misfiled taxonomy entries", () => {
    const c = content();
    c.taxonomy.languages.python.related.push("nope");
    c.taxonomy.languages.sql.type = "roles";
    const errors = validateContent(c.taxonomy, c.experience).join("\n");
    expect(errors).toMatch(/relates to unknown slug "nope"/);
    expect(errors).toMatch(/"sql" is in "languages" but has type "roles"/);
  });
});
