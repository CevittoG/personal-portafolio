import { describe, expect, it } from "vitest";
import { LOCALES } from "@/i18n/locale";
import { FAQ_SECTIONS, faqText } from "@/lib/site/faq";
import { faqJsonLd } from "@/lib/site/structured-data";

const words = (text: string) => faqText(text).trim().split(/\s+/).length;

const blocks = FAQ_SECTIONS.flatMap((section) => [
  { id: `${section.id} lead`, text: section.lead },
  ...section.items.map((item) => ({ id: item.id, text: item.answer })),
]);

describe("faq content", () => {
  it.each(blocks)("keeps the English $id between 40 and 60 words", ({ text }) => {
    const n = words(text.en);
    expect(n).toBeGreaterThanOrEqual(40);
    expect(n).toBeLessThanOrEqual(60);
  });

  it("has every string in every locale", () => {
    for (const section of FAQ_SECTIONS) {
      const strings = [
        section.title,
        section.lead,
        ...section.items.flatMap((i) => [i.question, i.answer]),
      ];
      for (const s of strings) {
        for (const locale of LOCALES) expect(s[locale]?.trim()).toBeTruthy();
      }
    }
  });

  it("uses unique section and question ids", () => {
    const ids = FAQ_SECTIONS.flatMap((s) => [s.id, ...s.items.map((i) => i.id)]);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("builds FAQPage JSON-LD with one Question per item and no unresolved placeholders", () => {
    const count = FAQ_SECTIONS.reduce((n, s) => n + s.items.length, 0);
    for (const locale of LOCALES) {
      const ld = faqJsonLd(locale) as { mainEntity: unknown[] };
      expect(ld.mainEntity).toHaveLength(count);
      expect(JSON.stringify(ld)).not.toContain("{years}");
    }
  });
});
