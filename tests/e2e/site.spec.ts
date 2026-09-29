import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const ORIGIN = "https://asebagutierrezm.com";
const DEEP_DIVE = "apple-software-project-engineer-2024";

/** Every page family in both locales: path, expected <html lang>, canonical path. */
const PAGES = [
  { path: "/", lang: "en", canonical: "" },
  { path: "/story", lang: "en", canonical: "/story" },
  { path: "/contact", lang: "en", canonical: "/contact" },
  { path: "/how-its-built", lang: "en", canonical: "/how-its-built" },
  { path: `/experience/${DEEP_DIVE}`, lang: "en", canonical: `/experience/${DEEP_DIVE}` },
  { path: "/es", lang: "es", canonical: "/es" },
  { path: "/es/story", lang: "es", canonical: "/es/story" },
  { path: "/es/contact", lang: "es", canonical: "/es/contact" },
  { path: "/es/how-its-built", lang: "es", canonical: "/es/how-its-built" },
  { path: `/es/experience/${DEEP_DIVE}`, lang: "es", canonical: `/es/experience/${DEEP_DIVE}` },
] as const;

for (const page of PAGES) {
  test.describe(page.path, () => {
    test("returns 200 with the right lang, canonical and hreflang", async ({ page: p }) => {
      const res = await p.goto(page.path);
      expect(res?.status()).toBe(200);
      await expect(p.locator("html")).toHaveAttribute("lang", page.lang);
      await expect(p.locator('link[rel="canonical"]')).toHaveAttribute("href", `${ORIGIN}${page.canonical}`);
      for (const hreflang of ["en", "es", "x-default"]) {
        await expect(p.locator(`link[rel="alternate"][hreflang="${hreflang}"]`)).toHaveCount(1);
      }
      await expect(p.locator("h1")).toHaveCount(1);
    });

    for (const theme of ["dark", "light"] as const) {
      test(`has no color-contrast violations (${theme})`, async ({ page: p }) => {
        await p.addInitScript((t) => localStorage.setItem("theme", t), theme);
        await p.goto(page.path);
        await expect(p.locator("html")).toHaveAttribute("data-theme", theme);
        const results = await new AxeBuilder({ page: p }).withRules(["color-contrast"]).analyze();
        const summary = results.violations.flatMap((v) =>
          v.nodes.map((n) => `${n.target.join(" ")}: ${n.failureSummary?.split("\n")[1] ?? ""}`),
        );
        expect(summary).toEqual([]);
      });
    }
  });
}

test("static SEO files and share images are served", async ({ request }) => {
  for (const path of ["/sitemap.xml", "/robots.txt", "/og/en-home.png", "/og/es-story.png", "/og/en-how-its-built.png"]) {
    const res = await request.get(path);
    expect(res.status(), path).toBe(200);
  }
  const png = await request.get("/og/en-home.png");
  expect(png.headers()["content-type"]).toContain("image/png");
});

/**
 * No page may throw in the browser, in either motion mode. A hydration
 * mismatch (React #418) makes React re-render the whole document, which
 * silently resets the <html> lang and theme the pre-paint scripts set.
 */
for (const reducedMotion of ["reduce", "no-preference"] as const) {
  test.describe(`runtime errors (reduced motion: ${reducedMotion})`, () => {
    test.use({ contextOptions: { reducedMotion } });
    for (const { path } of PAGES) {
      test(`${path} hydrates without errors`, async ({ page }) => {
        const errors: string[] = [];
        page.on("pageerror", (e) => errors.push(e.message));
        await page.goto(path);
        await page.waitForLoadState("networkidle");
        expect(errors).toEqual([]);
      });
    }
  });
}
