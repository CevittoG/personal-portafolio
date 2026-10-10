import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

/**
 * The career strip in the Explorer results (Phase 7): the swimlane as the
 * filter's readout, linked to the cards.
 */

const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

const strip = (page: Page) => page.locator("#discover figure");
const lanes = (page: Page) => strip(page).locator("[data-entry-id]");
const cardIds = (page: Page) =>
  page
    .locator("#discover div[data-entry-id]:has(> article)")
    .evaluateAll((cards) => cards.map((card) => card.getAttribute("data-entry-id")));

test("with no filter every lane is filled", async ({ page }) => {
  await page.goto("/");
  await expect(lanes(page)).toHaveCount(4);
  await expect(strip(page).locator("[data-match='true']")).toHaveCount(4);
});

test("a filter keeps exactly the lanes whose role is in the results", async ({ page }) => {
  await page.goto("/?tags=kubernetes");
  await expect(page.getByText(/^Showing \d+ of \d+$/)).toBeVisible();
  const shown = await cardIds(page);
  expect(shown.length).toBeGreaterThan(0);
  expect(shown.length).toBeLessThan(4);

  const state = await lanes(page).evaluateAll((els) =>
    els.map((el) => ({
      id: el.getAttribute("data-entry-id"),
      match: el.getAttribute("data-match") === "true",
      // Filled or hollow: the cue must be shape, not only color.
      filled: getComputedStyle(el.querySelector(".lane-bar")!).backgroundColor !== "rgba(0, 0, 0, 0)",
      readOut: el.textContent ?? "",
    })),
  );
  for (const lane of state) {
    expect(lane.match, lane.id!).toBe(shown.includes(lane.id));
    expect(lane.filled, lane.id!).toBe(lane.match);
    expect(lane.readOut).toContain(lane.match ? "Matches your filter" : "Not in your filter");
  }
});

test("a lane lights its card, and opens the role when pressed", async ({ page }) => {
  await page.goto("/");
  const lane = lanes(page).last();
  const id = await lane.getAttribute("data-entry-id");
  const card = page.locator(`#discover div[data-entry-id="${id}"] > article`);
  await expect(card).not.toHaveAttribute("data-highlighted", "");

  await lane.hover();
  await expect(card).toHaveAttribute("data-highlighted", "");
  await page.mouse.move(0, 0);
  await expect(card).not.toHaveAttribute("data-highlighted", "");

  await lane.focus();
  await expect(card).toHaveAttribute("data-highlighted", "");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toBeVisible();
});

test.describe("on a phone", () => {
  test.use({ viewport: { width: 375, height: 700 } });

  test("the strip fits and still reads out the years", async ({ page }) => {
    await page.goto("/");
    await expect(lanes(page)).toHaveCount(4);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    const track = (await strip(page).locator(".lane-bar").first().locator("..").boundingBox())!;
    expect(track.width).toBeGreaterThan(120);
    await expect(lanes(page).last()).toContainText(/\d{4}–/);
  });
});

for (const theme of ["dark", "light"] as const) {
  test(`career strip has no WCAG violations, filtered or not (${theme})`, async ({ page }) => {
    await page.addInitScript((t) => localStorage.setItem("theme", t), theme);
    for (const path of ["/", "/?tags=kubernetes", "/es?tags=kubernetes"]) {
      await page.goto(path);
      await expect(lanes(page)).toHaveCount(4);
      const results = await new AxeBuilder({ page }).include("#discover").withTags(WCAG_TAGS).analyze();
      const summary = results.violations.flatMap((v) => v.nodes.map((n) => `${path}: ${v.id}: ${n.target.join(" ")}`));
      expect(summary).toEqual([]);
    }
  });
}
