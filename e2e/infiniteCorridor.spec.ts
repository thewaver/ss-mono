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

const setSpeed = async (page: Page, degreesPerSecond: number) => {
    const speed = page.locator(field("spinDegreesPerSecond"));

    await speed.click();
    await page.keyboard.press("ControlOrMeta+a");
    await page.keyboard.type(String(degreesPerSecond));
    await speed.blur();
};

const originsOf = (page: Page, scope: string) =>
    page
        .locator(items(scope))
        .evaluateAll((elements) => elements.map((element) => (element as HTMLElement).style.transformOrigin));

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

/**
 * The tube pins each item's four corners instead of turning a centered box, so its items are drawn from their own
 * top-left with a full matrix. Which numbers that matrix holds is not asked: only that tube items are drawn this way
 * and walls items are not.
 */
test("a tube draws its items by pinned corners, and walls does not", async ({ page }) => {
    const drawnBy = async () => {
        const origins = await originsOf(page, SCROLLED);
        const transforms = await transformsOf(page, SCROLLED);

        return {
            origins: new Set(origins),
            pinned: transforms.filter((transform) => transform.startsWith("matrix3d")),
        };
    };

    const walls = await drawnBy();

    await pickLayout(page, "tube");
    await expect.poll(async () => (await drawnBy()).pinned.length).toBeGreaterThan(0);

    const tube = await drawnBy();

    expect(walls.pinned, "walls turns centered boxes").toHaveLength(0);
    expect(tube.origins.size, "every tube item turns about one and the same point").toBe(1);
    expect([...tube.origins][0], "which is not the center walls items turn about").not.toBe([...walls.origins][0]);
});

/**
 * The tube's spin runs on a clock the page owns, and that clock belongs to the Clock example's Walk/Pause button as
 * much as the walking does: pausing has to stop the spin too, not only the walk down the corridor.
 */
test("pausing the clock stops a spinning tube as well", async ({ page }) => {
    await pickLayout(page, "tube");
    await setSpeed(page, 90);
    await page.locator(CLOCK).scrollIntoViewIfNeeded();

    const first = (await transformsOf(page, CLOCK)).join("|");

    await expect.poll(async () => (await transformsOf(page, CLOCK)).join("|")).not.toBe(first);

    await page.locator(`${CLOCK} button[aria-label="Pause"]`).click();

    const paused = (await transformsOf(page, CLOCK)).join("|");

    await page.waitForTimeout(300);
    expect((await transformsOf(page, CLOCK)).join("|"), "nothing moves once paused, the spin included").toBe(paused);
});

/**
 * Pinned corners shared by neighbors are what keep a tube watertight: where one item ends the next begins. Each
 * visible item's four corners are mapped to the corridor's own layout space (its box's place plus its matrix applied
 * to the box's corners), and at least one pair of different items has a corner in the same place.
 */
test("neighboring tube items share corner points", async ({ page }) => {
    await pickLayout(page, "tube");

    await expect
        .poll(async () => (await transformsOf(page, SCROLLED)).some((t) => t.startsWith("matrix3d")))
        .toBe(true);

    const corners = await page.locator(items(SCROLLED)).evaluateAll((elements) =>
        elements
            .map((element) => element as HTMLElement)
            .filter((element) => element.style.transform.startsWith("matrix3d") && element.style.opacity !== "0")
            .map((element) => {
                const matrix = new DOMMatrix(element.style.transform);
                const width = element.offsetWidth;
                const height = element.offsetHeight;

                return [
                    [0, 0],
                    [width, 0],
                    [width, height],
                    [0, height],
                ].map(([x, y]) => {
                    const mapped = matrix.transformPoint(new DOMPoint(x, y, 0, 1));

                    return [element.offsetLeft + mapped.x / mapped.w, element.offsetTop + mapped.y / mapped.w];
                });
            }),
    );

    const TOLERANCE = 1;
    const isShared = corners.some((first, index) =>
        corners
            .slice(index + 1)
            .some((second) => first.some((a) => second.some((b) => Math.hypot(a[0] - b[0], a[1] - b[1]) <= TOLERANCE))),
    );

    expect(corners.length, "more than one item is drawn").toBeGreaterThan(1);
    expect(isShared).toBe(true);
});

test.describe("with reduced motion asked for", () => {
    test.use({ reducedMotion: "reduce" });

    test("a spinning tube does not move either until the clock is walked", async ({ page }) => {
        await pickLayout(page, "tube");
        await setSpeed(page, 90);
        await page.locator(CLOCK).scrollIntoViewIfNeeded();

        await expect(page.locator(`${CLOCK} button[aria-label="Walk"]`)).toHaveCount(1);

        const first = (await transformsOf(page, CLOCK)).join("|");

        await page.waitForTimeout(300);
        expect((await transformsOf(page, CLOCK)).join("|"), "the spin is paused with the walk").toBe(first);
    });

    test("the clock starts paused", async ({ page }) => {
        await page.locator(CLOCK).scrollIntoViewIfNeeded();

        await expect(page.locator(`${CLOCK} button[aria-label="Walk"]`)).toHaveCount(1);

        const first = (await transformsOf(page, CLOCK)).join("|");

        await page.waitForTimeout(300);
        expect((await transformsOf(page, CLOCK)).join("|")).toBe(first);
    });
});
