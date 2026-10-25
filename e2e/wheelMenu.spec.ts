import { type Locator, type Page, expect, test } from "@playwright/test";

import { activeDescendantText, activeMatches, docsDemo, docsSettled, prop } from "./helpers";

const DOCS = "/src/App/Pages/Menus/WheelMenuPage/Docs";

const MENU = '[role="menu"]';
const ITEM_ROLE = '[role="menuitem"]';

const HALF_TURN_DEGREES = "180";

const trigger = (name: string) => `${docsDemo(DOCS, name)} [aria-haspopup="menu"]`;

/** Every example reads out the last command it ran, under its wheel. */
const readout = async (page: Page, name: string) =>
    ((await page.locator(`${docsDemo(DOCS, name)} [data-readout]`).textContent()) ?? "").trim();

/** The bands example's spread is a knob, typed the way a person would; a half wheel is half the turn. */
const setBandsSpread = async (page: Page, degrees: string) => {
    await page.locator(`${prop("bandsSpreadDegrees")} input`).click();
    await page.keyboard.press("ControlOrMeta+a");
    await page.keyboard.type(degrees);
    await page.keyboard.press("Tab");
};

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
 * the center comes off the element itself rather than out of a client rect — which is what keeps this
 * independent of the scale `Viewport` applies to the whole page. Nothing here pins a number: what is asserted
 * is the relationship between two levels, so re-tuning a radius cannot turn into a red run.
 */
const boxOf = (locator: Locator) =>
    locator.evaluate((node: HTMLElement) => {
        const { e: x, f: y } = new DOMMatrixReadOnly(node.style.transform || "none");

        return { centerX: x + node.offsetWidth * 0.5, centerY: y + node.offsetHeight * 0.5, width: node.offsetWidth };
    });

test.beforeEach(async ({ page }) => {
    await page.goto("/wheel-menu/docs");
    await expect(page.locator(trigger("Basic"))).toBeVisible();
    await docsSettled(page);
});

test("a submenu is a wider band round the center its parent already had", async ({ page }) => {
    await page.locator(trigger("Bands")).click();
    await openedLevel(page, 0);

    await itemAt(page, 0, "New").hover();
    await openedLevel(page, 1);

    await itemAt(page, 1, "From template").hover();
    await openedLevel(page, 2);

    const levels = await Promise.all([0, 1, 2].map((depth) => boxOf(page.locator(MENU).nth(depth))));

    levels.forEach((level, depth) => {
        if (depth === 0) return;

        expect(level.centerX, "every level is centered on the same point the root was").toBeCloseTo(
            levels[0].centerX,
            0,
        );
        expect(level.centerY).toBeCloseTo(levels[0].centerY, 0);
        expect(level.width, "and each one encloses the level above it").toBeGreaterThan(levels[depth - 1].width);
    });
});

test("a half wheel nests the same way, one wider arc round the last", async ({ page }) => {
    await setBandsSpread(page, HALF_TURN_DEGREES);
    await page.locator(trigger("Bands")).click();
    await openedLevel(page, 0);

    await itemAt(page, 0, "New").hover();
    await openedLevel(page, 1);

    const [root, band] = await Promise.all([0, 1].map((depth) => boxOf(page.locator(MENU).nth(depth))));

    expect(band.centerX, "the arc is drawn about the point the level above was").toBeCloseTo(root.centerX, 0);
    expect(band.centerY).toBeCloseTo(root.centerY, 0);
    expect(band.width, "and encloses it").toBeGreaterThan(root.width);
});

test("the hole holds a close control the walk reaches, and it has a name of its own", async ({ page }) => {
    await page.locator(trigger("Basic")).click();
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
    const before = await readout(page, "Basic");

    await page.locator(trigger("Basic")).click();
    await openedLevel(page, 0);

    await closerOf(page, 0).click();

    await expect(page.locator(MENU)).toHaveCount(0);
    expect(await readout(page, "Basic"), "and nothing ran").toBe(before);
    expect(await activeMatches(page, trigger("Basic")), "and focus goes back to the opener it covered").toBe(true);
});

/**
 * A wheel opens centered on its trigger, so the pointer that pressed the trigger is sitting on the close control
 * the moment the wheel appears. Hover follows the pointer moving, so the smallest twitch there would hand the close
 * control the highlight the wheel opened with. The item a level opens under ignores the pointer until the pointer
 * has left it once, as a desktop context menu ignores the item it appeared under — so a twitch keeps the first
 * wedge, a trip out to a wedge and back reaches the close control as usual, and pressing it never needed the hover.
 */
test("the close control the wheel opens under waits for the pointer to leave it before it takes the hover", async ({
    page,
}) => {
    const box = (await page.locator(trigger("Basic")).boundingBox())!;
    const center = { x: box.x + box.width * 0.5, y: box.y + box.height * 0.5 };

    await page.mouse.click(center.x, center.y);
    await openedLevel(page, 0);
    expect(await highlightAt(page, 0), "a wheel opens onto its first wedge").toContain("Cut");

    await page.mouse.move(center.x + 1, center.y + 1);
    await page.mouse.move(center.x + 2, center.y);
    expect(await highlightAt(page, 0), "a twitch over the close control leaves the first wedge chosen").toContain(
        "Cut",
    );

    await itemAt(page, 0, "Copy").hover();
    await page.mouse.move(center.x, center.y);
    expect(
        await page.locator(MENU).nth(0).getAttribute("aria-activedescendant"),
        "once the pointer has been away, coming back to the hole chooses it",
    ).toBe(await closerOf(page, 0).getAttribute("id"));
});

test("pressing the close control the wheel opened under closes it without a hover first", async ({ page }) => {
    const before = await readout(page, "Basic");
    const box = (await page.locator(trigger("Basic")).boundingBox())!;
    const center = { x: box.x + box.width * 0.5, y: box.y + box.height * 0.5 };

    await page.mouse.click(center.x, center.y);
    await openedLevel(page, 0);

    await page.mouse.click(center.x + 1, center.y);

    await expect(page.locator(MENU)).toHaveCount(0);
    expect(await readout(page, "Basic"), "and nothing ran").toBe(before);
});

test("hovering the hole drops the bands below it, the same as hovering a wedge with nothing under it", async ({
    page,
}) => {
    await page.locator(trigger("Bands")).click();
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
    await page.locator(trigger("Bands")).click();
    await openedLevel(page, 0);

    await itemAt(page, 0, "New").hover();
    await openedLevel(page, 1);

    await expect(closerOf(page, 1)).toHaveCount(0);
    await expect(closerOf(page, 0)).toHaveCount(1);
});

/**
 * A ring has no left and no right, so all four arrows walk it and the pair that opens and closes a level
 * in a straight menu is free for other work: a band is opened by activating the wedge that owns it, and
 * left by `Escape`, which steps out one band at a time rather than dropping the whole wheel at once.
 */
test("all four arrows walk the ring, and a band is entered and left without them", async ({ page }) => {
    await page.locator(trigger("Bands")).click();
    await openedLevel(page, 0);

    const first = await highlightAt(page, 0);

    await page.keyboard.press("ArrowRight");
    expect(await highlightAt(page, 0), "ArrowRight moves on rather than diving into a band").not.toBe(first);
    await expect(page.locator(MENU), "and opens nothing").toHaveCount(1);

    await page.keyboard.press("ArrowLeft");
    expect(await highlightAt(page, 0), "and ArrowLeft comes back, the mirror of ArrowRight").toBe(first);

    await page.keyboard.press("ArrowDown");
    expect(await highlightAt(page, 0), "the other pair walks the same ring in the same direction").not.toBe(first);

    await page.keyboard.press("ArrowUp");
    expect(await highlightAt(page, 0)).toBe(first);
});

test("a band is entered by activating its wedge and left one at a time with Escape", async ({ page }) => {
    await page.locator(trigger("Bands")).click();
    await openedLevel(page, 0);

    await page.keyboard.press("Enter");
    await openedLevel(page, 1);

    await page.keyboard.press("Escape");
    await expect(page.locator(MENU), "Escape drops the outer band rather than the whole wheel").toHaveCount(1);

    await page.keyboard.press("Escape");
    await expect(page.locator(MENU), "and the next one closes the wheel itself").toHaveCount(0);
});
