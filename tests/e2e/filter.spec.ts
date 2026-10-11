import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

/**
 * The filter reshape (Phase 7): the sticky active-filter row, the results
 * staying in view, and the pill that flies to its chip.
 */

const NAVBAR_HEIGHT = 64;
const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

const filterRow = (page: Page) => page.getByRole("region", { name: "Active filters" });
/** A starter chip: the first pill for that tag (the cards come after). */
const starter = (page: Page, slug: string) =>
  page.locator(`#discover button[data-slug="${slug}"]`).first();

/** Top of an element measured from the top of the document. */
const documentTop = (page: Page, selector: string) =>
  page.locator(selector).evaluate((el) => el.getBoundingClientRect().top + window.scrollY);

test("the first filter does not push the results down", async ({ page }) => {
  await page.goto("/");
  await expect(filterRow(page)).toContainText("No filters yet");
  const before = await documentTop(page, "#grid-sort");

  await starter(page, "python").click();
  await expect(page).toHaveURL(/tags=python/);
  await expect(filterRow(page).getByRole("button", { name: "Remove Python" })).toBeVisible();
  expect(await documentTop(page, "#grid-sort")).toBe(before);
});

test("the filter row sticks under the navbar while the results are in view", async ({ page }) => {
  await page.goto("/?tags=python");
  const row = filterRow(page);
  await expect(row.getByRole("button", { name: "Remove Python" })).toBeVisible();

  const rowTop = await row.evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
  await page.evaluate((y) => window.scrollTo(0, y), rowTop + 120);
  await expect.poll(async () => Math.round((await row.boundingBox())!.y)).toBe(NAVBAR_HEIGHT);
  await expect(row).toHaveAttribute("data-stuck", "");

  // It only belongs to the results: past them it scrolls away again.
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await expect.poll(async () => (await row.boundingBox())!.y).toBeLessThan(0);

  // Back in view but not at the navbar: no longer marked as stuck.
  await page.evaluate((y) => window.scrollTo(0, y), rowTop - 300);
  await expect(row).toBeInViewport();
  await expect(row).not.toHaveAttribute("data-stuck", "");
});

for (const reducedMotion of ["reduce", "no-preference"] as const) {
  test.describe(`reduced motion: ${reducedMotion}`, () => {
    test.use({ contextOptions: { reducedMotion } });

    test("filtering from a card far down brings the results back", async ({ page }) => {
      await page.goto("/");
      const lastCardPill = page
        .locator("#discover article")
        .last()
        .locator("button[data-slug]")
        .first();
      await lastCardPill.scrollIntoViewIfNeeded();
      await page.mouse.wheel(0, 300);
      const slug = await lastCardPill.getAttribute("data-slug");
      await lastCardPill.click();
      await expect(page).toHaveURL(new RegExp(`tags=${slug}`));

      // The row is the first thing in the results, so it lands under the navbar.
      const row = filterRow(page);
      await expect.poll(async () => Math.round((await row.boundingBox())!.y)).toBe(NAVBAR_HEIGHT);
      await expect(page.locator("#discover article").first()).toBeInViewport();
    });
  });
}

test.describe("pill travel with motion allowed", () => {
  test.use({ contextOptions: { reducedMotion: "no-preference" } });

  /**
   * Record the flying copy the moment it is added. It lives for under half
   * a second, so looking for it after the click would be a race on a busy
   * machine; this notes it, and where it is headed, as it appears.
   */
  const watchForGhost = (page: Page, slug: string) =>
    page.evaluate((slug) => {
      const seen = ((window as unknown as { __ghosts: unknown[] }).__ghosts = [] as unknown[]);
      new MutationObserver((records) => {
        for (const node of records.flatMap((r) => Array.from(r.addedNodes))) {
          if (!(node instanceof HTMLElement) || !node.hasAttribute("data-pill-ghost")) continue;
          const from = node.getBoundingClientRect();
          const frames = (node.getAnimations()[0].effect as KeyframeEffect).getKeyframes();
          const [dx, dy] = String(frames[frames.length - 1].transform).match(/-?[\d.]+/g)!.map(Number);
          const chip = document.querySelector(`[data-filter-chip="${slug}"]`)!.getBoundingClientRect();
          seen.push({
            x: Math.abs(from.left + dx - chip.left),
            y: Math.abs(from.top + dy - chip.top),
            hidden: node.getAttribute("aria-hidden"),
            inert: node.inert,
          });
        }
      }).observe(document.body, { childList: true });
    }, slug);
  const ghosts = (page: Page) =>
    page.evaluate(() => (window as unknown as { __ghosts: { x: number; y: number; hidden: string; inert: boolean }[] }).__ghosts);

  test("a pressed pill flies to its chip and is then removed", async ({ page }) => {
    await page.goto("/");
    await watchForGhost(page, "python");
    await starter(page, "python").click();

    await expect.poll(async () => (await ghosts(page)).length).toBe(1);
    const [flight] = await ghosts(page);
    // Where it is headed (its last keyframe) against where the chip is. The
    // chip is still popping in (a few px of scale), hence the tolerance.
    expect(flight.x).toBeLessThan(8);
    expect(flight.y).toBeLessThan(8);
    expect(flight.hidden).toBe("true");
    expect(flight.inert).toBe(true);

    await expect(page.locator("[data-pill-ghost]")).toHaveCount(0);
    await expect(filterRow(page).getByRole("button", { name: "Remove Python" })).toBeVisible();
  });

  test("a muted card pill flies too", async ({ page }) => {
    await page.goto("/?tags=python");
    const muted = page.locator("#discover article button[data-state='muted']").first();
    await watchForGhost(page, (await muted.getAttribute("data-slug"))!);
    await muted.click();
    await expect.poll(async () => (await ghosts(page)).length).toBe(1);
    await expect(page.locator("[data-pill-ghost]")).toHaveCount(0);
  });

  test("a filter picked in the search box does not fly", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("combobox", { name: /search experiences/i }).fill("snow");
    await page.getByRole("option", { name: "Snowflake" }).click();
    await expect(page).toHaveURL(/tags=snowflake/);
    await expect(page.locator("[data-pill-ghost]")).toHaveCount(0);
  });
});

test("a muted pill on a card narrows the filter and keeps its card", async ({ page }) => {
  await page.goto("/?tags=python");
  const muted = page
    .locator("#discover article")
    .first()
    .locator("button[data-slug][data-state='muted']")
    .first();
  const slug = await muted.getAttribute("data-slug");
  await muted.click();

  await expect(page).toHaveURL(new RegExp(`tags=python(,|%2C)${slug}`));
  await expect(filterRow(page).getByRole("button", { name: /^Remove / })).toHaveCount(2);
  // The pill came from a card, so at least that card matches both tags:
  // a card pill can never empty the results.
  const matchesBoth = page.locator(
    `#discover article:has([data-slug="python"][data-state="active"]):has([data-slug="${slug}"][data-state="active"])`,
  );
  await expect(matchesBoth.first()).toBeVisible();
});

test("with reduced motion nothing flies", async ({ page }) => {
  await page.goto("/");
  await starter(page, "python").click();
  await expect(page).toHaveURL(/tags=python/);
  await expect(page.locator("[data-pill-ghost]")).toHaveCount(0);
});

test.describe("on a phone", () => {
  test.use({ viewport: { width: 375, height: 700 } });

  test("several filters stay on one scrolling line", async ({ page }) => {
    await page.goto("/?tags=python,snowflake,kubernetes,postgresql");
    const row = filterRow(page);
    await expect(row.getByRole("button", { name: /^Remove / })).toHaveCount(4);
    expect((await row.boundingBox())!.height).toBeLessThanOrEqual(52);
    const overflows = await row
      .locator("[data-filter-chip]")
      .first()
      .evaluate((chip) => chip.parentElement!.scrollWidth > chip.parentElement!.clientWidth);
    expect(overflows).toBe(true);
    // Nothing may make the page itself scroll sideways.
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
});

for (const theme of ["dark", "light"] as const) {
  test(`filtered landing has no WCAG violations (${theme})`, async ({ page }) => {
    await page.addInitScript((t) => localStorage.setItem("theme", t), theme);
    await page.goto("/?tags=python");
    await expect(filterRow(page).getByRole("button", { name: "Remove Python" })).toBeVisible();
    for (const state of ["at rest", "stuck"]) {
      if (state === "stuck") {
        const top = await filterRow(page).evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
        await page.evaluate((y) => window.scrollTo(0, y + 120), top);
        await expect(filterRow(page)).toHaveAttribute("data-stuck", "");
      }
      const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
      const summary = results.violations.flatMap((v) => v.nodes.map((n) => `${state}: ${v.id}: ${n.target.join(" ")}`));
      expect(summary).toEqual([]);
    }
  });
}

test("empty filter row has no WCAG violations in either theme", async ({ page }) => {
  for (const theme of ["dark", "light"] as const) {
    await page.addInitScript((t) => localStorage.setItem("theme", t), theme);
    await page.goto("/");
    await expect(filterRow(page)).toContainText("No filters yet");
    const results = await new AxeBuilder({ page }).include("#discover").withTags(WCAG_TAGS).analyze();
    expect(results.violations.map((v) => `${theme}: ${v.id}`)).toEqual([]);
  }
});
