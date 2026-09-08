import { type Locator, type Page, expect, test } from "@playwright/test";

import { activeDescendantText, activeMatches, demo, readout } from "./helpers";

const MENU = '[role="menu"]';
const ITEM_ROLE = '[role="menuitem"]';
const NOTHING_RUN = "nothing run yet";

const trigger = (key: string) => `${demo(key)} [aria-haspopup="menu"]`;

/** The same open-and-focus race the ordinary menu spec waits on: a level is ready once it holds focus. */
const openedLevel = async (page: Page, depth: number) => {
    await expect(page.locator(MENU)).toHaveCount(depth + 1);
    await expect(page.locator(MENU).nth(depth)).toHaveAttribute("aria-activedescendant", /.+/);
    await expect(page.locator(MENU).nth(depth)).toBeFocused();
};

const itemAt = (page: Page, depth: number, name: string) =>
    page.locator(MENU).nth(depth).locator(ITEM_ROLE).filter({ hasText: name }).first();

const highlightAt = async (page: Page, depth: number) =>
    activeDescendantText(page, `#${await page.locator(MENU).nth(depth).getAttribute("id")}`);

/**
 * The only `menuitem` in a wheel carrying an `aria-label` is the one in the hole: the wedges take their names
 * from what the painter drew, so this finds the control by the thing that makes it one rather than by a
 * caption or a position.
 */
const closerOf = (page: Page, depth: number) => page.locator(MENU).nth(depth).locator(`${ITEM_ROLE}[aria-label]`);

/**
 * A level is sized by its own layout and moved by a transform the `Popover` writes, both in layout space, so
 * the centre comes off the element itself rather than out of a client rect — which is what keeps this
 * independent of the scale `Viewport` applies to the whole page. Nothing here pins a number: what is asserted
 * is the relationship between two levels, so re-tuning a radius cannot turn into a red run.
 */
const boxOf = (locator: Locator) =>
    locator.evaluate((node: HTMLElement) => {
        const [x, y] = (node.style.transform.match(/-?[\d.]+/g) ?? ["0", "0"]).map(Number);

        return { centreX: x + node.offsetWidth / 2, centreY: y + node.offsetHeight / 2, width: node.offsetWidth };
    });

test.beforeEach(async ({ page }) => {
    await page.goto("/wheel-menu");
    await expect(page.locator("[data-example]").first()).toBeVisible();
});

test("a submenu is a wider band round the centre its parent already had", async ({ page }) => {
    await page.locator(trigger("concentric")).click();
    await openedLevel(page, 0);

    await itemAt(page, 0, "New").hover();
    await openedLevel(page, 1);

    await itemAt(page, 1, "From template").hover();
    await openedLevel(page, 2);

    const levels = await Promise.all([0, 1, 2].map((depth) => boxOf(page.locator(MENU).nth(depth))));

    levels.forEach((level, depth) => {
        if (depth === 0) return;

        expect(level.centreX, "every level is centred on the same point the root was").toBeCloseTo(
            levels[0].centreX,
            0,
        );
        expect(level.centreY).toBeCloseTo(levels[0].centreY, 0);
        expect(level.width, "and each one encloses the level above it").toBeGreaterThan(levels[depth - 1].width);
    });
});

test("a half wheel nests the same way, one wider arc round the last", async ({ page }) => {
    await page.locator(trigger("concentricHalves")).click();
    await openedLevel(page, 0);

    await itemAt(page, 0, "New").hover();
    await openedLevel(page, 1);

    const [root, band] = await Promise.all([0, 1].map((depth) => boxOf(page.locator(MENU).nth(depth))));

    expect(band.centreX, "the arc is drawn about the point the level above was").toBeCloseTo(root.centreX, 0);
    expect(band.centreY).toBeCloseTo(root.centreY, 0);
    expect(band.width, "and encloses it").toBeGreaterThan(root.width);
});

test("the hole holds a close control the walk reaches, and it has a name of its own", async ({ page }) => {
    await page.locator(trigger("wheel")).click();
    await openedLevel(page, 0);

    await expect(closerOf(page, 0), "one close control, and only one").toHaveCount(1);
    expect(
        (await closerOf(page, 0).getAttribute("aria-label")) ?? "",
        "and it is named, since the painter draws a glyph and nothing else",
    ).not.toBe("");

    expect(await highlightAt(page, 0), "a wheel opens onto its first wedge").toContain("Cut");

    await itemAt(page, 0, "Copy").hover();
    expect(await highlightAt(page, 0), "and the pointer moves the choice as it always did").toContain("Copy");

    await closerOf(page, 0).hover();
    expect(
        await page.locator(MENU).nth(0).getAttribute("aria-activedescendant"),
        "coming back to the hole takes the choice off the wedge, since only one thing is ever chosen",
    ).toBe(await closerOf(page, 0).getAttribute("id"));

    await page.keyboard.press("ArrowDown");
    expect(await highlightAt(page, 0), "and it is a stop in the same walk, so one step leaves it").toContain("Cut");

    await page.keyboard.press("Enter");
    await expect(page.locator(MENU), "and activating a wedge closes the wheel").toHaveCount(0);
});

test("clicking the close control shuts the wheel and runs nothing", async ({ page }) => {
    await page.locator(trigger("wheel")).click();
    await openedLevel(page, 0);

    await closerOf(page, 0).click();

    await expect(page.locator(MENU)).toHaveCount(0);
    expect(await readout(page, "wheel")).toContain(NOTHING_RUN);
    expect(await activeMatches(page, trigger("wheel")), "and focus goes back to the opener it covered").toBe(true);
});

test("hovering the hole drops the bands below it, the same as hovering a wedge with nothing under it", async ({
    page,
}) => {
    await page.locator(trigger("concentric")).click();
    await openedLevel(page, 0);

    await itemAt(page, 0, "New").hover();
    await openedLevel(page, 1);

    await itemAt(page, 1, "Project").hover();
    expect(await highlightAt(page, 1), "the outer band is following the pointer").toContain("Project");

    await closerOf(page, 0).hover();

    await expect(page.locator(MENU), "and the hole takes the wheel back to one band").toHaveCount(1);
    expect(
        await page.locator(MENU).nth(0).getAttribute("aria-activedescendant"),
        "with the hole holding the only thing that is chosen",
    ).toBe(await closerOf(page, 0).getAttribute("id"));
});

test("a deeper band brings no second closer, so the hole keeps holding one", async ({ page }) => {
    await page.locator(trigger("concentric")).click();
    await openedLevel(page, 0);

    await itemAt(page, 0, "New").hover();
    await openedLevel(page, 1);

    await expect(closerOf(page, 1)).toHaveCount(0);
    await expect(closerOf(page, 0)).toHaveCount(1);
});

test("the keyboard walks the bands the same as any other menu", async ({ page }) => {
    await page.locator(trigger("concentric")).click();
    await openedLevel(page, 0);

    await page.keyboard.press("ArrowRight");
    await openedLevel(page, 1);

    await page.keyboard.press("ArrowLeft");
    await expect(page.locator(MENU), "ArrowLeft drops the outer band rather than the whole wheel").toHaveCount(1);

    await page.keyboard.press("Escape");
    await expect(page.locator(MENU)).toHaveCount(0);
});
