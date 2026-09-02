import { type Page, expect, test } from "@playwright/test";

import { demo, readout } from "./helpers";

const grid = (key: string, label: string) => `${demo(key)} [role="list"][aria-label="${label}"]`;

/**
 * An item is found by the name its page gave it rather than by its whole accessible name, because the
 * component appends the footprint and the coordinates to that name — which is the very thing most of
 * these tests are about to move. A locator that pinned the full string would have to be rewritten every
 * time an item was expected to end up somewhere else.
 */
const item = (key: string, label: string, gridLabel: string) =>
    `${grid(key, gridLabel)} [role="listitem"][aria-label^="${label},"]`;

const ANNOUNCER = 'body > [role="log"][aria-live="polite"]';

/**
 * Every geometric assertion here compares two rects measured in the same pass rather than a rect against
 * a number of pixels. The Playground runs inside a `Viewport`, so a client rect is the layout value times
 * a scale that depends on the size of this window; two rects taken together are in the same space whatever
 * that scale is, while a hardcoded 44 would only be right at a scale of exactly 1. It also keeps the cell
 * size a decision the Playground page is free to change without turning this suite red.
 */
const rectsOf = (page: Page, key: string, gridLabel: string, label: string, spots: number[]) =>
    page.evaluate(
        (args) => {
            const root = document.querySelector(args.gridSelector);
            const element = document.querySelector(args.itemSelector);
            const cells = [...(root?.firstElementChild?.children ?? [])];

            if (!root || !element) return;

            const box = element.getBoundingClientRect();
            const covered = args.spots.map((spot) => cells[spot].getBoundingClientRect());

            return {
                item: {
                    left: Math.round(box.left),
                    top: Math.round(box.top),
                    right: Math.round(box.right),
                    bottom: Math.round(box.bottom),
                },
                cells: {
                    left: Math.round(Math.min(...covered.map((cell) => cell.left))),
                    top: Math.round(Math.min(...covered.map((cell) => cell.top))),
                    right: Math.round(Math.max(...covered.map((cell) => cell.right))),
                    bottom: Math.round(Math.max(...covered.map((cell) => cell.bottom))),
                },
            };
        },
        { gridSelector: grid(key, gridLabel), itemSelector: item(key, label, gridLabel), spots },
    );

/**
 * The empty cells are in the DOM as a layer of their own, so a spot on the board can be turned into a point
 * to move the pointer to without this file knowing what a cell measures. Cells are laid out row by row, so
 * the index is the row times the width plus the column.
 */
const ROW_FOUR_COLUMN_FIVE = 28;
const NOTCH_OF_THE_PICKAXE = 23;

const cellPoint = (page: Page, key: string, gridLabel: string, index: number) =>
    page.evaluate(
        (args) => {
            const cell = document.querySelector(args.gridSelector)?.firstElementChild?.children[args.index];
            const box = cell?.getBoundingClientRect();

            if (!box) throw new Error("the board has no such cell");

            return { x: box.left + box.width / 2, y: box.top + box.height / 2 };
        },
        { gridSelector: grid(key, gridLabel), index },
    );

const spotOf = async (page: Page, key: string, gridLabel: string, label: string) => {
    const name = (await page.locator(item(key, label, gridLabel)).getAttribute("aria-label")) ?? "";
    const found = /column (\d+), row (\d+)/.exec(name);

    return found ? `${found[1]},${found[2]}` : "gone";
};

const sizeOf = async (page: Page, key: string, gridLabel: string, label: string) => {
    const name = (await page.locator(item(key, label, gridLabel)).getAttribute("aria-label")) ?? "";
    const found = /(\d+) by (\d+)/.exec(name);

    return found ? `${found[1]}x${found[2]}` : "gone";
};

test.beforeEach(async ({ page }) => {
    await page.goto("/sortable-grid");
    await expect(page.locator("[data-example]").first()).toBeVisible();
});

/**
 * The whole difference between this and a list is that an item holds an area rather than a place in a
 * line, so the first thing worth pinning is that the area it draws is the area it claims. The shield is
 * declared as two cells by two at column 2, row 1, and the four cells it names are asked for their own
 * corners — nothing here knows how big a cell is.
 */
test("an item covers exactly the cells its footprint names", async ({ page }) => {
    const shield = await rectsOf(page, "pack", "Pack", "Kite Shield", [1, 2, 9, 10]);

    expect(shield?.item, "the item's box is the union of the cells under it").toEqual(shield?.cells);

    const potion = await rectsOf(page, "pack", "Pack", "Potion", [17]);

    expect(potion?.item, "and a single-cell item is exactly its one cell").toEqual(potion?.cells);
});

/**
 * The keyboard route is the one the standard asks for, and in a grid it has two axes rather than one.
 * Enter lifts the potion, two presses of the down arrow and one of the right walk it, and Enter puts it down.
 */
test("the arrows move a carried item one cell at a time, on both axes", async ({ page }) => {
    expect(await spotOf(page, "pack", "Pack", "Potion"), "the potion starts at column 2, row 3").toBe("2,3");

    await page.locator(item("pack", "Potion", "Pack")).focus();
    await page.keyboard.press("Enter");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("Enter");

    expect(await spotOf(page, "pack", "Pack", "Potion"), "one row down and one column across").toBe("3,4");
});

/**
 * The refusal is the thing a list has no equivalent of: there is no such thing as a place a list cannot
 * take an item. Here the potion is walked back up onto the shield, which is already there, and the drop
 * is declined rather than pushing anything aside — the potion is left exactly where it was picked up.
 */
test("a drop onto an occupied cell is refused, and the item stays where it was", async ({ page }) => {
    await page.locator(item("pack", "Potion", "Pack")).focus();
    await page.keyboard.press("Enter");
    await page.keyboard.press("ArrowUp");

    await expect(page.locator(ANNOUNCER), "the aim says out loud that it will not fit").toContainText("no room");

    await page.keyboard.press("Enter");

    expect(await spotOf(page, "pack", "Pack", "Potion"), "so the potion is still where it started").toBe("2,3");
    expect(await spotOf(page, "pack", "Pack", "Kite Shield"), "and the shield has not been pushed anywhere").toBe(
        "2,1",
    );
});

/**
 * Turning is the second thing a footprint makes possible: the same item, the same top-left cell, two cells
 * wide instead of two cells tall. The scroll is two by one, so a turn makes it one by two, and the cells it
 * covers afterwards are asked the same way as in the first test.
 *
 * The component owns no turn gesture of its own — it hands out two commands and the page decides what
 * reaches them, which here is R for one direction and Shift with R for the other. So every turn driven from
 * this file is going through the same handle a consumer would use.
 */
test("the page's turn command turns the carried item, and it lands with the turned footprint", async ({ page }) => {
    expect(await sizeOf(page, "pack", "Pack", "Scroll"), "the scroll starts two cells wide").toBe("2x1");

    await page.locator(item("pack", "Scroll", "Pack")).focus();
    await page.keyboard.press("Enter");
    await page.keyboard.press("r");
    await page.keyboard.press("Enter");

    expect(await sizeOf(page, "pack", "Pack", "Scroll"), "and comes to rest two cells tall").toBe("1x2");

    const scroll = await rectsOf(page, "pack", "Pack", "Scroll", [4, 12]);

    expect(scroll?.item, "covering the cell below the one it was in rather than the one beside it").toEqual(
        scroll?.cells,
    );
});

/**
 * A held drag is the one carry that ignores the keyboard, so that a stray arrow key cannot fight the pointer
 * for where the item is going. A turn is not a second opinion about where the item is going, so it has to
 * work anyway — and because it arrives as a command rather than as a key the component listens for, nothing
 * about the carry's own deafness stands in its way.
 */
test("a turn lands while the button is still held down", async ({ page }) => {
    const from = await page.locator(item("pack", "Scroll", "Pack")).boundingBox();
    const to = await cellPoint(page, "pack", "Pack", ROW_FOUR_COLUMN_FIVE);

    if (!from) throw new Error("a drag needs a box to start from");

    await page.mouse.move(from.x + from.width / 4, from.y + from.height / 2);
    await page.mouse.down();

    // The first move only has to beat the slop distance, which is what separates a drag from a click.
    await page.mouse.move(from.x + from.width / 4 + 20, from.y + from.height / 2, { steps: 5 });
    await page.keyboard.press("r");
    await page.mouse.move(to.x, to.y, { steps: 10 });
    await page.mouse.up();

    expect(await sizeOf(page, "pack", "Pack", "Scroll"), "it landed turned").toBe("1x2");
    expect(await spotOf(page, "pack", "Pack", "Scroll"), "at the cell the pointer was over").toBe("5,4");
});

/**
 * A rectangle turned either way covers the same cells, so a single turn would have been enough for a grid of
 * boxes. An L is what makes the two directions different things, and the bench is built to tell them apart:
 * the hook is an upright L in the corner and the flint sits in the cell that only the clockwise turn needs.
 * So one direction is refused and the other is not, from the same item in the same place.
 */
test("an L turned one way fits and the other way does not", async ({ page }) => {
    expect(await sizeOf(page, "turns", "Bench", "Hook"), "the hook starts upright").toBe("2x3");

    await page.locator(item("turns", "Hook", "Bench")).focus();
    await page.keyboard.press("Enter");
    await page.keyboard.press("r");

    await expect(page.locator(ANNOUNCER), "clockwise lands the arm on the flint").toContainText("no room");

    await page.keyboard.press("Enter");

    expect(await sizeOf(page, "turns", "Bench", "Hook"), "so the hook is still upright").toBe("2x3");

    await page.keyboard.press("Enter");
    await page.keyboard.press("Shift+r");
    await page.keyboard.press("Enter");

    expect(await sizeOf(page, "turns", "Bench", "Hook"), "and anticlockwise is taken").toBe("3x2");
});

/**
 * Two grids exchange through the same registry a pair of lists uses, so the item leaves one and arrives in
 * the other in a single commit. Tab is what changes container while carrying, and the arrival place is the
 * first spot the gem actually fits in rather than wherever the pointer last was.
 */
test("an item carried out of one grid arrives in the other", async ({ page }) => {
    await page.locator(item("pair", "Gem", "Stash")).focus();
    await page.keyboard.press("Enter");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");

    await expect(page.locator(item("pair", "Gem", "Stash")), "the gem has left the stash").toHaveCount(0);
    await expect(page.locator(item("pair", "Gem", "Pack")), "and is in the pack").toHaveCount(1);
});

/**
 * A grid and a list can share one group, which is the point of the carry knowing nothing about either
 * shape. The list's item carries no footprint at all, so the grid gives it one cell — the smallest thing
 * that can be said about something that has never had a size.
 */
test("an item crosses from a list into a grid, and is given a single cell", async ({ page }) => {
    await page.locator(`${demo("loot")} [role="listitem"][aria-label="Iron Key"]`).focus();
    await page.keyboard.press("Enter");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");

    expect(await sizeOf(page, "loot", "Pack", "Iron Key"), "it lands one cell by one").toBe("1x1");
    expect(await readout(page, "loot"), "and is gone from the ground").not.toContain("Iron Key");
});

/**
 * The locked grid is the coarse form of refusing: it can be rearranged from inside and takes nothing from
 * outside. While carrying from the pack there is therefore only one container to be in, so Tab has nowhere
 * to go and the gem stays put.
 */
test("a locked grid is not offered as a destination", async ({ page }) => {
    await page.locator(item("locked", "Potion", "Pack")).focus();
    await page.keyboard.press("Enter");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");

    await expect(page.locator(item("locked", "Potion", "Stash")), "the stash took nothing").toHaveCount(0);
    await expect(page.locator(item("locked", "Potion", "Pack")), "and the potion is still in the pack").toHaveCount(1);
});

/**
 * A disabled grid answers nothing by either route. The keyboard one is checked here because it is the one
 * that would still work if the guard were only written into the pointer handlers, which is exactly the
 * shape of mistake a disabled state usually has.
 */
test("a disabled grid moves nothing, by pointer or by key", async ({ page }) => {
    const before = await spotOf(page, "disabled", "Disabled pack", "Potion");

    await page.locator(item("disabled", "Potion", "Disabled pack")).focus();
    await page.keyboard.press("Enter");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");

    expect(await spotOf(page, "disabled", "Disabled pack", "Potion"), "nothing moved").toBe(before);
});

/**
 * An item that is not a rectangle must not answer for the rectangle it is drawn inside. The pickaxe is an
 * upright L in the pack, and the cell diagonally in from its corner is inside its bounding box while being
 * no part of the pickaxe — a press there belongs to the board, not to the item. It was the item's until the
 * hit area was cut into one transparent square per cell it actually holds.
 */
test("a press in the notch of an L belongs to the board rather than to the item", async ({ page }) => {
    const notch = await cellPoint(page, "pack", "Pack", NOTCH_OF_THE_PICKAXE);

    await page.mouse.move(notch.x, notch.y);
    await page.mouse.down();
    await page.mouse.move(notch.x + 30, notch.y + 30, { steps: 5 });
    await page.mouse.up();

    expect(await spotOf(page, "pack", "Pack", "Pickaxe"), "the pickaxe never moved").toBe("7,2");

    await expect(page.locator(ANNOUNCER), "and nothing was ever picked up").toHaveCount(0);
});

/**
 * The painted shape and the item's own box have to be the same size, which is a thing that can quietly stop
 * being true: an SVG whose viewBox is a different shape from the element scales its contents to fit and
 * centres what is left, so the drawing comes out short of the cells it is supposed to cover. A tall thin
 * item is where the two ratios are furthest apart, so the sword and the bow are the ones asked here — the
 * shield went on looking right through the whole of that fault.
 */
test("the painted shape is the size of the item it belongs to, at every ratio", async ({ page }) => {
    const drawn = await page.evaluate(
        (selector) => {
            const items = [...document.querySelectorAll(selector)];

            return items.map((element) => {
                const painted = element.querySelector("polygon")?.getBoundingClientRect();
                const box = element.getBoundingClientRect();

                return {
                    name: (element.getAttribute("aria-label") ?? "").split(",")[0],
                    isCovered: painted !== undefined && painted.width >= box.width && painted.height >= box.height,
                };
            });
        },
        `${demo("pack")} [role="listitem"]`,
    );

    expect(drawn.length, "the pack has items to check").toBeGreaterThan(0);

    /**
     * Only the lower bound is asserted, and `getBoundingClientRect` rather than `getBBox`, which reports the
     * geometry before the viewBox is applied and would have gone on passing throughout the fault. A stroke
     * sits half outside the shape it draws, so what is painted is always a little larger than the box, and
     * by how much is the painter's business — pinning that would answer "has somebody restyled it" in the
     * same red as "has the drawing come loose from its cells".
     */
    for (const item of drawn) {
        expect(item.isCovered, `${item.name} is painted over the whole of its own box`).toBe(true);
    }
});
