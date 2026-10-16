import { type Page, expect, test } from "@playwright/test";

import { demo, prop } from "./helpers";

/**
 * The Infinite Corridor draws its items, repeated until the corridor is full, as absolutely placed boxes inside a
 * region. Nothing here reads a position as a number: what is compared is whether an item moved at all, which drawn item
 * is the one a keyboard can reach, and whether a setting comes back to where it started.
 *
 * The scrolled example is moved by scrolling its own box, so "the corridor moved" is the box's scroll position and the
 * transforms of its items changing; the clock example is moved by a clock the page runs, with a Play/Pause button.
 */
const SCROLLED = demo("scrolled");
const CLOCK = demo("clock");

const corridor = (scope: string) => `${scope} [aria-roledescription="corridor"]`;
const items = (scope: string) => `${corridor(scope)} > div`;
const field = (key: string) => `${prop(key)} input`;

const scrollBoxOf = (page: Page) =>
    page
        .locator(SCROLLED)
        .evaluateHandle((element) =>
            [...element.querySelectorAll("div")].find((d) => getComputedStyle(d).overflowY === "scroll")!,
        );

const scrollTopOf = async (page: Page) => (await scrollBoxOf(page)).evaluate((box) => (box as HTMLElement).scrollTop);

const transformsOf = (page: Page, scope: string) =>
    page
        .locator(items(scope))
        .evaluateAll((elements) => elements.map((element) => (element as HTMLElement).style.transform));

const pickLayout = async (page: Page, name: string) => {
    await page.locator(`${prop("layout")} [role="combobox"]`).click();
    await page.getByRole("option", { name, exact: true }).click();
};

test.beforeEach(async ({ page }) => {
    await page.goto("/infinite-corridor");
    await page.locator(SCROLLED).scrollIntoViewIfNeeded();
});

test("the corridor is a named region that says what it is", async ({ page }) => {
    await expect(page.locator(corridor(SCROLLED))).toHaveAttribute("role", "region");
    await expect(page.locator(corridor(SCROLLED))).toHaveAttribute("aria-label", /.+/);
});

/**
 * Too few items to fill the corridor are drawn more than once, and only one copy of each is the real one: every other
 * copy is out of reach. So the rooms a keyboard can reach are each item once, however many are drawn. Three rooms are
 * fewer than any layout's reach, so copies are certain to be drawn.
 */
test("every item can be reached exactly once, and every other copy is out of reach", async ({ page }) => {
    await page.locator(field("itemCount")).fill("3");
    await page.locator(field("itemCount")).blur();
    await expect.poll(() => page.locator(`${items(SCROLLED)}:not([inert])`).count()).toBe(3);

    const drawn = await page.locator(items(SCROLLED)).count();
    const reachable = page.locator(`${items(SCROLLED)}:not([inert])`);
    const names = await reachable.evaluateAll((elements) => elements.map((element) => element.textContent?.trim()));
    const itemCount = Number(await page.locator(field("itemCount")).inputValue());

    expect(new Set(names).size, "each item reachable once").toBe(names.length);
    expect(names.length).toBe(itemCount);
    expect(drawn, "and the rest are copies").toBeGreaterThan(itemCount);
    await expect(page.locator(`${items(SCROLLED)}[inert]`).first()).toHaveAttribute("aria-hidden", "true");
});

test("scrolling the box walks the corridor", async ({ page }) => {
    const before = await transformsOf(page, SCROLLED);

    await (
        await scrollBoxOf(page)
    ).evaluate((box) => {
        (box as HTMLElement).scrollTop += 200;
    });

    await expect.poll(async () => (await transformsOf(page, SCROLLED)).join("|")).not.toBe(before.join("|"));
});

/**
 * A scrolling box scrolls to what takes focus inside it, and so does the corridor: focusing a room far down it moves the
 * corridor — here by scrolling the box — and the room keeps focus all the way, since it is the very copy that moved.
 */
test("focusing a room out of view brings it into view, and it keeps focus", async ({ page }) => {
    const room = page.locator(`${items(SCROLLED)}:not([inert]) button`).nth(11);
    const name = await room.textContent();
    const before = await scrollTopOf(page);

    await room.focus();

    await expect.poll(() => scrollTopOf(page)).not.toBe(before);
    await expect.poll(() => page.evaluate(() => document.activeElement?.textContent)).toBe(name);
});

test("each layout brings its own settings, in a row of their own above the corridor's", async ({ page }) => {
    const sampleKeys = () =>
        page
            .locator('[data-panel="sample"] [data-prop]')
            .evaluateAll((rows) => rows.map((row) => row.getAttribute("data-testid")));

    expect(await sampleKeys()).toContain("nearAngleDegrees");
    expect(await sampleKeys()).not.toContain("sides");

    await pickLayout(page, "tube");

    await expect.poll(sampleKeys).toContain("sides");
    expect(await sampleKeys()).toContain("spinDegreesPerSecond");
    expect(await sampleKeys()).not.toContain("nearAngleDegrees");
    await expect(page.locator(`[data-panel="global"] ${prop("itemCount")}`)).toHaveCount(1);
});

/**
 * A layout's settings are held per layout, so a field rebuilt by switching layouts and back starts on whatever was last
 * set. Reset still has to bring it to the layout's own default, not to the value it happened to be rebuilt with.
 */
test("reset brings a layout setting back to its default after a round trip through another layout", async ({
    page,
}) => {
    const height = page.locator(field("heightRatio"));
    const original = await height.inputValue();
    const step = Number((await height.getAttribute("step")) ?? "0.05") || 0.05;

    await height.fill(String(Number(original) + step));
    await height.blur();
    await pickLayout(page, "tube");
    await pickLayout(page, "walls");

    await expect(height).not.toHaveValue(original);

    await page
        .locator('[data-panel="sample"]')
        .getByRole("button", { name: /^reset/i })
        .click();

    await expect(height).toHaveValue(original);
});

test("the clock walks the corridor until it is paused", async ({ page }) => {
    await page.locator(CLOCK).scrollIntoViewIfNeeded();

    const pause = page.locator(`${CLOCK} button[aria-label="Pause"]`);

    await expect(pause).toHaveCount(1);

    const first = (await transformsOf(page, CLOCK)).join("|");

    await expect.poll(async () => (await transformsOf(page, CLOCK)).join("|")).not.toBe(first);

    await pause.click();

    const paused = (await transformsOf(page, CLOCK)).join("|");

    await page.waitForTimeout(300);
    expect((await transformsOf(page, CLOCK)).join("|"), "nothing moves once paused").toBe(paused);
});

test.describe("with reduced motion asked for", () => {
    test.use({ reducedMotion: "reduce" });

    test("the clock starts paused", async ({ page }) => {
        await page.locator(CLOCK).scrollIntoViewIfNeeded();

        await expect(page.locator(`${CLOCK} button[aria-label="Walk"]`)).toHaveCount(1);

        const first = (await transformsOf(page, CLOCK)).join("|");

        await page.waitForTimeout(300);
        expect((await transformsOf(page, CLOCK)).join("|")).toBe(first);
    });
});
