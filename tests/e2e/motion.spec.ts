import { expect, test, type Page } from "@playwright/test";

/**
 * Motion contracts (Phase 7). These guard behaviour that a screenshot or a
 * unit test would miss: what must not animate, and where an animation ends.
 */

const HERO = "#hero";

/** Viewport box of the desktop nav's active underline, sampled over time. */
async function sampleUnderline(page: Page, samples: number, everyMs: number) {
  return page.evaluate(
    async ({ samples, everyMs }) => {
      const out: { y: number; left: number; right: number }[] = [];
      for (let i = 0; i < samples; i++) {
        const line = document.querySelector("header nav ul a span[aria-hidden]");
        if (line) {
          const r = line.getBoundingClientRect();
          out.push({ y: r.y, left: r.left, right: r.right });
        }
        await new Promise((resolve) => setTimeout(resolve, everyMs));
      }
      return out;
    },
    { samples, everyMs },
  );
}

test.describe("with motion allowed", () => {
  test.use({ contextOptions: { reducedMotion: "no-preference" } });

  test("hero: the name and the positioning sentence never fade in", async ({ page }) => {
    await page.goto("/");
    // One of the two is the largest paint (name on desktop, sentence on
    // phones); a delayed fade on either would push that paint back.
    const largestPaintCandidates = [
      page.locator(`${HERO} h1`),
      page.locator(`${HERO} h1 ~ p`).nth(2),
    ];
    for (const el of largestPaintCandidates) {
      await expect(el).not.toHaveClass(/hero-enter/);
      await expect(el).toHaveCSS("animation-name", "none");
    }
    // The supporting lines do step in, and never later than the 150ms cap.
    const delays = await page
      .locator(`${HERO} .hero-enter`)
      .evaluateAll((els) => els.map((el) => parseFloat(getComputedStyle(el).animationDelay)));
    expect(delays.length).toBeGreaterThan(3);
    expect(Math.max(...delays)).toBeLessThanOrEqual(0.15);
  });

  test("nav underline slides sideways and stays in the header", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => window.scrollTo(0, 2000));
    const header = (await page.getByRole("banner").boundingBox())!;

    await page.locator("header nav ul a[href='/story']").click();
    const samples = await sampleUnderline(page, 12, 40);
    await expect(page).toHaveURL(/\/story$/);

    // The page scrolls back to the top on navigation; the underline must
    // not be dragged along with it.
    for (const s of samples) {
      expect(s.y).toBeGreaterThanOrEqual(header.y);
      expect(s.y).toBeLessThanOrEqual(header.y + header.height);
    }

    // And it comes to rest under the link for the page we are now on.
    const link = (await page.locator("header nav ul a[aria-current='page']").boundingBox())!;
    await expect
      .poll(async () => {
        const [rest] = await sampleUnderline(page, 1, 0);
        return rest.left >= link.x && rest.right <= link.x + link.width;
      })
      .toBe(true);
  });

  test("nothing stays hidden once the visitor has scrolled to the end", async ({ page }) => {
    await page.goto("/");
    // Scroll in steps, as a visitor would, so scroll-driven reveals run.
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y <= height; y += 400) await page.mouse.wheel(0, 400);
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));

    await expect
      .poll(() =>
        page.locator(".reveal").evaluateAll((els) =>
          els.filter((el) => getComputedStyle(el).opacity !== "1").length,
        ),
      )
      .toBe(0);
    await expect
      .poll(() =>
        page.locator(".lane-bar").evaluateAll((els) =>
          els.filter((el) => new DOMMatrix(getComputedStyle(el).transform).a < 0.999).length,
        ),
      )
      .toBe(0);
  });
});

test.describe("with reduced motion", () => {
  test.use({ contextOptions: { reducedMotion: "reduce" } });

  for (const path of ["/", "/story"]) {
    test(`${path} shows everything at once`, async ({ page }) => {
      await page.goto(path);
      const moving = await page
        .locator(".hero-enter, .reveal, .lane-bar, .tool-icon")
        .evaluateAll((els) =>
          els.filter((el) => {
            const style = getComputedStyle(el);
            return style.animationName !== "none" || style.opacity !== "1";
          }).length,
        );
      expect(moving).toBe(0);
    });
  }
});
