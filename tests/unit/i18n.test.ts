import { describe, expect, it, vi } from "vitest";
import { en } from "@/i18n/messages/en";
import { es } from "@/i18n/messages/es";
import { localeForPath, stripLocale, switchLocale, withLocale } from "@/i18n/path";
import { translate } from "@/i18n/translator";

describe("i18n/path", () => {
  it("detects the locale prefix", () => {
    expect(localeForPath("/")).toBe("en");
    expect(localeForPath("/story")).toBe("en");
    expect(localeForPath("/es")).toBe("es");
    expect(localeForPath("/es/story")).toBe("es");
    // "/estate" is not the ES tree
    expect(localeForPath("/estate")).toBe("en");
  });

  it("strips and applies prefixes", () => {
    expect(stripLocale("/es")).toBe("/");
    expect(stripLocale("/es/experience/x")).toBe("/experience/x");
    expect(withLocale("/", "es")).toBe("/es");
    expect(withLocale("/story", "es")).toBe("/es/story");
    expect(withLocale("/es/story", "en")).toBe("/story");
    expect(withLocale("/es/story", "es")).toBe("/es/story");
  });

  it("keeps query and hash when switching locale", () => {
    expect(switchLocale("/?tags=python,sql", "es")).toBe("/es?tags=python,sql");
    expect(switchLocale("/es/contact#resume", "en")).toBe("/contact#resume");
    expect(switchLocale("/story?x=1#act-2", "es")).toBe("/es/story?x=1#act-2");
  });
});

describe("i18n/translator", () => {
  it("resolves nested keys and interpolates values", () => {
    expect(translate(en, "nav.story")).toBe("My Story");
    expect(translate(en, "hero.proofLine", { years: 5 })).toContain("5+ years");
  });

  it("leaves unknown placeholders intact", () => {
    expect(translate(en, "hero.proofLine")).toContain("{years}");
  });

  it("returns the key for missing or non-string paths", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(translate(en, "nav.nope")).toBe("nav.nope");
    expect(translate(en, "nav")).toBe("nav");
    expect(translate(en, "constructor")).toBe("constructor");
    warn.mockRestore();
  });

  it("keeps EN and ES catalogues in key parity", () => {
    const keys = (o: object, p = ""): string[] =>
      Object.entries(o).flatMap(([k, v]) =>
        v && typeof v === "object" && !Array.isArray(v) ? keys(v, `${p}${k}.`) : [`${p}${k}`],
      );
    expect(keys(es).sort()).toEqual(keys(en).sort());
  });
});
