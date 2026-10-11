import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { TagPill } from "@/components/tags/TagPill";

const base = { slug: "python", label: "Python", type: "languages" } as const;

describe("TagPill aria-pressed", () => {
  it("is set on a clickable active pill, which renders a button", () => {
    const html = renderToStaticMarkup(
      createElement(TagPill, { ...base, state: "active", onClick: () => {} }),
    );
    expect(html).toMatch(/^<button/);
    expect(html).toContain('aria-pressed="true"');
  });

  // aria-pressed on a span is an axe `aria-allowed-attr` violation, which
  // dropped the deep-dive page below the Lighthouse accessibility budget.
  it("is left off an inert active pill, which renders a span", () => {
    const html = renderToStaticMarkup(createElement(TagPill, { ...base, state: "active" }));
    expect(html).toMatch(/^<span/);
    expect(html).not.toContain("aria-pressed");
  });

  it("is left off pills that are not active", () => {
    for (const state of ["inactive", "muted"] as const) {
      const html = renderToStaticMarkup(createElement(TagPill, { ...base, state, onClick: () => {} }));
      expect(html, state).not.toContain("aria-pressed");
    }
  });
});

describe("TagPill muted", () => {
  // In the Explorer grid a muted pill narrows the filter further.
  it("is a button when it can be pressed", () => {
    const html = renderToStaticMarkup(
      createElement(TagPill, { ...base, state: "muted", onClick: () => {} }),
    );
    expect(html).toMatch(/^<button/);
    expect(html).toContain("hover:border-text-muted");
  });

  it("is an inert label otherwise, with no hover", () => {
    const html = renderToStaticMarkup(createElement(TagPill, { ...base, state: "muted" }));
    expect(html).toMatch(/^<span/);
    expect(html).not.toContain("hover:");
  });
});
