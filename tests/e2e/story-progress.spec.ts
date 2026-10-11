import { expect, test, type Page } from "@playwright/test";

/**
 * The sticky progress marker on /story (Phase 7): which act and year the
 * reader is at, on the career axis.
 */

const bar = (page: Page) => page.locator("[data-story-progress]");

/** Put an element's top just above the bar's reading line (35% down). */
const bringToReadingLine = (page: Page, selector: string, index: number) =>
  page.evaluate(
    ([selector, index]) => {
      const el = document.querySelectorAll<HTMLElement>(selector as string)[index as number];
      const top = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo(0, top - window.innerHeight * 0.35 + 8);
    },
    [selector, index] as const,
  );

test("the marker is hidden before and after the acts", async ({ page }) => {
  await page.goto("/story");
  await expect(bar(page)).toHaveAttribute("aria-hidden", "true");
  await expect(bar(page)).toHaveAttribute("data-visible", "false");
  await expect(bar(page)).toHaveCSS("opacity", "0");

  await bringToReadingLine(page, "[data-story-step]", 0);
  await expect(bar(page)).toHaveAttribute("data-visible", "true");
  await expect(bar(page)).toHaveCSS("opacity", "1");
  // It sits directly under the navbar.
  expect(Math.round((await bar(page).boundingBox())!.y)).toBe(64);

  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await expect(bar(page)).toHaveAttribute("data-visible", "false");
});

test("the marker follows each step's act and place on the axis", async ({ page }) => {
  await page.goto("/story");
  const steps = await page.locator("[data-story-step]").evaluateAll((els) =>
    els.map((el) => ({
      act: el.getAttribute("data-act"),
      left: el.getAttribute("data-left"),
      year: el.getAttribute("data-year"),
    })),
  );
  // Three acts, and the middle one is the interlude with no place of its own.
  expect([...new Set(steps.map((s) => s.act))]).toEqual(["Act 1", "Act 2", "Act 3"]);
  expect(steps.filter((s) => s.left === null).map((s) => s.act)).toEqual(["Act 2"]);

  let held = "0";
  let heldYear: string | null = null;
  for (const [i, step] of steps.entries()) {
    await bringToReadingLine(page, "[data-story-step]", i);
    if (step.left !== null) {
      held = String(Number(step.left));
      heldYear = step.year;
    }
    await expect(bar(page)).toHaveAttribute("data-act", step.act!);
    // Act 2 keeps the marker where Act 1 ended.
    await expect(bar(page)).toHaveAttribute("data-left", held);
    await expect(bar(page)).toContainText(`${step.act} · ${heldYear}`);
  }
});

test("the marker is localized", async ({ page }) => {
  await page.goto("/es/story");
  await bringToReadingLine(page, "[data-story-step]", 0);
  await expect(bar(page)).toContainText("Acto 1");
});

test.describe("on a phone", () => {
  test.use({ viewport: { width: 375, height: 700 } });

  test("the marker fits on one line", async ({ page }) => {
    await page.goto("/story");
    await bringToReadingLine(page, "[data-story-step]", 2);
    await expect(bar(page)).toHaveAttribute("data-visible", "true");
    const box = (await bar(page).boundingBox())!;
    expect(box.height).toBeLessThanOrEqual(40);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
});
