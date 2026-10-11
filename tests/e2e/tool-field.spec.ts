import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

/**
 * The hero's tool field (Phase 8): the stack scattered around the copy,
 * each tool a filter that shares its state with the Explorer below.
 */

const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

const field = (page: Page) => page.getByRole("group", { name: "Filter by tool" });
const tool = (page: Page, slug: string) => page.locator(`#hero button[data-tool="${slug}"]`);
const readout = (page: Page) => page.locator("#hero p[aria-live]");
const filterRow = (page: Page) => page.getByRole("region", { name: "Active filters" });

/** Where the tools are, measured against the copy and each other. */
const geometry = (page: Page) =>
  page.evaluate(() => {
    const hit = (a: DOMRect, b: DOMRect) => a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
    const hero = document.getElementById("hero")!;
    const copy = hero.querySelector("h1")!.parentElement!.getBoundingClientRect();
    const tools = Array.from(hero.querySelectorAll<HTMLElement>("button[data-tool]"))
      .filter((el) => el.offsetParent !== null)
      .map((el) => ({ box: el.getBoundingClientRect(), icon: el.querySelector("svg")!.getBoundingClientRect() }));
    let overlapping = 0;
    for (let i = 0; i < tools.length; i++) {
      for (let j = i + 1; j < tools.length; j++) if (hit(tools[i].icon, tools[j].icon)) overlapping++;
    }
    return {
      shown: tools.length,
      onCopy: tools.filter((t) => hit(t.icon, copy)).length,
      offScreen: tools.filter((t) => t.icon.left < 0 || t.icon.right > window.innerWidth).length,
      overlapping,
      smallestTarget: Math.min(...tools.map((t) => Math.min(t.box.width, t.box.height))),
      pageScrollsSideways: document.documentElement.scrollWidth > window.innerWidth,
    };
  });

for (const [width, height, shown] of [
  [390, 844, 12],
  [768, 1024, 20],
  [1024, 768, 20],
  [1280, 800, 36],
  [1920, 1080, 36],
] as const) {
  test(`at ${width}px the field shows ${shown} tools, clear of the copy and of each other`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.goto("/");
    const g = await geometry(page);
    expect(g.shown).toBe(shown);
    expect(g.onCopy).toBe(0);
    expect(g.overlapping).toBe(0);
    expect(g.offScreen).toBe(0);
    expect(g.pageScrollsSideways).toBe(false);
    expect(g.smallestTarget).toBeGreaterThanOrEqual(24);
  });
}

test("the icons come from one sprite that has every tool", async ({ page, request }) => {
  await page.goto("/");
  const pending = page.locator("#hero button[data-tool] use:not([href])");
  await expect(pending).toHaveCount(0);
  const hrefs = await page
    .locator("#hero button[data-tool] use")
    .evaluateAll((uses) => uses.map((use) => use.getAttribute("href")!));
  const files = new Set(hrefs.map((href) => href.split("#")[0]));
  expect(files.size).toBe(1);
  const [file] = files;
  expect(file).toMatch(/^\/sprites\/tools\.svg\?v=[0-9a-f]{8}$/);

  const sprite = await request.get(file);
  expect(sprite.status()).toBe(200);
  expect(sprite.headers()["content-type"]).toContain("image/svg+xml");
  const svg = await sprite.text();
  for (const href of hrefs) expect(svg).toContain(`<symbol id="${href.split("#")[1]}"`);
});

test.describe("on a phone", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  // The field is under the first screen there: its icons must not compete
  // with the text for the connection.
  test("the sprite is not requested until the page has loaded", async ({ page }) => {
    let requestedAt: number | null = null;
    let loadedAt: number | null = null;
    page.on("request", (request) => {
      if (request.url().includes("/sprites/tools.svg")) requestedAt ??= Date.now();
    });
    page.on("load", () => (loadedAt ??= Date.now()));
    await page.goto("/", { waitUntil: "load" });
    await expect(page.locator("#hero button[data-tool] use:not([href])")).toHaveCount(0);
    await expect.poll(() => requestedAt).not.toBeNull();
    expect(requestedAt!).toBeGreaterThanOrEqual(loadedAt!);
  });
});

test("on a wide screen the icons load without waiting for the page", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  // JavaScript off: only the inline script can have set the addresses.
  await page.route("**/_next/static/**/*.js", (route) => route.abort());
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator("#hero button[data-tool] use[href]")).toHaveCount(36);
});

test("a tool filters the Explorer, and the Explorer answers back", async ({ page }) => {
  await page.goto("/");
  await expect(readout(page)).toContainText("Pick a tool");

  await tool(page, "python").click();
  await tool(page, "pandas").click();
  await expect(page).toHaveURL(/tags=python(,|%2C)pandas/);
  await expect(tool(page, "python")).toHaveAttribute("aria-pressed", "true");
  await expect(filterRow(page).getByRole("button", { name: /^Remove / })).toHaveCount(2);

  // The hero and the grid count the same roles.
  const shownInGrid = await page.getByText(/^Showing \d+ of \d+$/).innerText();
  const [, count, total] = shownInGrid.match(/(\d+) of (\d+)/)!;
  await expect(readout(page)).toContainText(`${count} of ${total} roles match`);
  await expect(readout(page).getByRole("link", { name: /See them/ })).toHaveAttribute("href", "#discover");

  // Removing a chip down in the Explorer releases the tool up in the hero.
  await filterRow(page).getByRole("button", { name: "Remove Pandas" }).click();
  await expect(tool(page, "pandas")).toHaveAttribute("aria-pressed", "false");
  await expect(tool(page, "python")).toHaveAttribute("aria-pressed", "true");

  await readout(page).getByRole("button", { name: "Clear" }).click();
  await expect(page).not.toHaveURL(/tags=/);
  await expect(field(page).locator('[aria-pressed="true"]')).toHaveCount(0);
});

test("a tool that would leave no role is switched off", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await tool(page, "snowflake").click();
  await expect(page).toHaveURL(/tags=snowflake/);

  const off = field(page).locator('button[aria-disabled="true"]');
  expect(await off.count()).toBeGreaterThan(0);
  const first = off.first();
  await expect(first).toHaveAttribute("data-off", /no role combines it/);
  await first.click({ force: true });
  await expect(page).toHaveURL(/tags=snowflake$/);
  // Nothing that is still on would empty the results.
  const live = await field(page).locator('button[data-tool]:not([aria-disabled]):not([aria-pressed="true"])').all();
  for (const candidate of live.slice(0, 4)) {
    await candidate.click();
    await expect(page.getByText(/^Showing [1-9]\d* of \d+$/)).toBeVisible();
    await candidate.click();
  }
});

test("the field is one tab stop; arrows move within it", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(field(page).locator('button[data-tool][tabindex="0"]')).toHaveCount(1);

  await tool(page, "python").focus();
  await page.keyboard.press("ArrowRight");
  const second = await page.evaluate(() => (document.activeElement as HTMLElement).dataset.tool);
  expect(second).toBeTruthy();
  expect(second).not.toBe("python");
  await page.keyboard.press("End");
  await page.keyboard.press("Home");
  expect(await page.evaluate(() => (document.activeElement as HTMLElement).dataset.tool)).toBe("python");

  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/tags=python/);
  await expect(field(page).locator('button[data-tool][tabindex="0"]')).toHaveCount(1);
  // One more Tab leaves the tools.
  await page.keyboard.press("Tab");
  expect(await page.evaluate(() => (document.activeElement as HTMLElement).dataset.tool)).toBeUndefined();
});

test("the filter follows the URL across pages", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/?tags=python");
  await expect(tool(page, "python")).toHaveAttribute("aria-pressed", "true");
  await page.locator("header nav ul a[href='/story']").click();
  await expect(page).toHaveURL(/\/story$/);
  await page.locator("header nav ul a[href='/']").click();
  await expect(page).toHaveURL(/\/$/);
  await expect(tool(page, "python")).toHaveAttribute("aria-pressed", "false");
  await expect(readout(page)).toContainText("Pick a tool");
});

test.describe("with motion allowed", () => {
  test.use({ contextOptions: { reducedMotion: "no-preference" }, viewport: { width: 1440, height: 900 } });

  const moving = (page: Page) =>
    page.locator("#hero .tool-icon").evaluateAll(
      (els) => els.filter((el) => getComputedStyle(el).transform !== "none" && !new DOMMatrix(getComputedStyle(el).transform).isIdentity).length,
    );

  test("the arrival gust crosses the field once and leaves it at rest", async ({ page }) => {
    await page.goto("/");
    await expect.poll(() => moving(page)).toBeGreaterThan(0);
    await expect.poll(() => moving(page), { timeout: 5000 }).toBe(0);
    // And it stays at rest: nothing loops.
    await page.waitForTimeout(1200);
    expect(await moving(page)).toBe(0);
  });

  test("pressing a tool sends a gust from it, which also settles", async ({ page }) => {
    await page.goto("/");
    await expect.poll(() => moving(page), { timeout: 5000 }).toBe(0);
    await page.waitForTimeout(1500);
    await tool(page, "python").click();
    await expect.poll(() => moving(page)).toBeGreaterThan(0);
    await expect.poll(() => moving(page), { timeout: 5000 }).toBe(0);
  });

  test("tools near the pointer move away from it", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(2500);
    const box = (await tool(page, "python").boundingBox())!;
    await page.mouse.move(box.x - 40, box.y + box.height / 2);
    await page.mouse.move(box.x - 36, box.y + box.height / 2);
    const lean = tool(page, "python").locator(".tool-icon");
    await expect.poll(() => lean.evaluate((el) => parseFloat(el.style.getPropertyValue("--lx") || "0"))).toBeGreaterThan(0);
    await page.getByRole("banner").hover();
    await expect.poll(() => lean.evaluate((el) => el.style.getPropertyValue("--lx"))).toBe("");
  });
});

test("with reduced motion the field never moves", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  expect(
    await page.locator("#hero .tool-icon").evaluateAll((els) => els.filter((el) => getComputedStyle(el).animationName !== "none").length),
  ).toBe(0);
  await tool(page, "python").click();
  await expect(page).toHaveURL(/tags=python/);
  expect(await page.locator("#hero .tool-icon").evaluateAll((els) => els.reduce((n, el) => n + el.getAnimations().length, 0))).toBe(0);
});

test("the field is localized", async ({ page }) => {
  await page.goto("/es");
  await expect(page.getByRole("group", { name: "Filtrar por herramienta" })).toBeVisible();
  await expect(readout(page)).toContainText("Elige una herramienta");
});

for (const theme of ["dark", "light"] as const) {
  test(`hero with a selection has no WCAG violations (${theme})`, async ({ page }) => {
    await page.addInitScript((t) => localStorage.setItem("theme", t), theme);
    for (const [width, height] of [[1440, 900], [390, 844]] as const) {
      await page.setViewportSize({ width, height });
      await page.goto("/?tags=python,pandas");
      await expect(tool(page, "python")).toHaveAttribute("aria-pressed", "true");
      const results = await new AxeBuilder({ page }).include("#hero").withTags(WCAG_TAGS).analyze();
      const summary = results.violations.flatMap((v) => v.nodes.map((n) => `${width}px: ${v.id}: ${n.target.join(" ")}`));
      expect(summary).toEqual([]);
    }
  });
}
