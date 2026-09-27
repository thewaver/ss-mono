import { type Page, expect, test } from "@playwright/test";

/**
 * The React `SortableGrid`, over the React `Carrier` hooks and the zone it shares with the Solid one. The cases follow
 * `e2e/sortableGrid.spec.ts`: an item covers exactly its cells, the arrows walk a carried item on both axes and over
 * walls, an occupied spot or a wall refuses the drop, the turn commands turn a carry by key and mid-drag and an L
 * tells the two directions apart, items cross between two grids and from a list, a locked grid takes nothing, a
 * disabled one moves nothing, a notch belongs to the board, the painted shape covers its box, and `compact()` slides
 * items up by button and after every move. Each grid sits in a box keyed by `data-testid` in place of the
 * Playground's example keys, and the turn key is bound by the story on the window, as the Playground does.
 *
 * Every geometric assertion compares rects measured in the same pass, never a rect against a number of pixels.
 */
const STORY = "Exotics/SortableGrid";

const scope = (key: string) => `[data-testid="${key}"]`;
const grid = (key: string, label: string) => `${scope(key)} [role="list"][aria-label="${label}"]`;

/** Found by the name the story gave it, since the grid appends the footprint and the spot, which the cases move. */
const item = (key: string, label: string, gridLabel: string) =>
    `${grid(key, gridLabel)} [role="listitem"][aria-label^="${label},"]`;

const ANNOUNCER = 'body > [role="log"][aria-live="polite"]';

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
                item: [box.left, box.top, box.right, box.bottom].map(Math.round),
                cells: [
                    Math.min(...covered.map((cell) => cell.left)),
                    Math.min(...covered.map((cell) => cell.top)),
                    Math.max(...covered.map((cell) => cell.right)),
                    Math.max(...covered.map((cell) => cell.bottom)),
                ].map(Math.round),
            };
        },
        { gridSelector: grid(key, gridLabel), itemSelector: item(key, label, gridLabel), spots },
    );

/** Cells are laid out row by row, so a cell's index is its row times the width plus its column. */
const ROW_FOUR_COLUMN_FIVE = 28;
const NOTCH_OF_THE_PICKAXE = 23;
const WALL_ROW_TWO_COLUMN_THREE = 10;
const ROW_ONE_COLUMN_THREE = 2;
const ROW_FIVE_COLUMN_SIX = 37;

const cellPoint = (page: Page, key: string, gridLabel: string, index: number) =>
    page.evaluate(
        (args) => {
            const cell = document.querySelector(args.gridSelector)?.firstElementChild?.children[args.index];
            const box = cell?.getBoundingClientRect();

            if (!box) throw new Error("the board has no such cell");

            return { x: box.left + box.width * 0.5, y: box.top + box.height * 0.5 };
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

const dragTo = async (page: Page, from: { x: number; y: number }, to: { x: number; y: number }) => {
    await page.mouse.move(from.x, from.y);
    await page.mouse.down();
    await page.mouse.move(from.x + 20, from.y, { steps: 5 });
    await page.mouse.move(to.x, to.y, { steps: 10 });
    await page.mouse.up();
};

test.describe("one grid", () => {
    test.beforeEach(async ({ page, mount }) => {
        await mount(`${STORY}/Default`);
        await expect(page.locator(grid("pack", "Pack"))).toBeVisible();
    });

    test("an item covers exactly the cells its footprint names", async ({ page }) => {
        const shield = await rectsOf(page, "pack", "Pack", "Kite Shield", [1, 2, 9, 10]);

        expect(shield?.item, "the item's box is the union of the cells under it").toEqual(shield?.cells);

        const potion = await rectsOf(page, "pack", "Pack", "Potion", [17]);

        expect(potion?.item, "and a single-cell item is exactly its one cell").toEqual(potion?.cells);
    });

    test("the arrows move a carried item one cell at a time, on both axes", async ({ page }) => {
        expect(await spotOf(page, "pack", "Pack", "Potion"), "the potion starts at column 2, row 3").toBe("2,3");

        await page.locator(item("pack", "Potion", "Pack")).focus();
        await page.keyboard.press("Enter");
        await page.keyboard.press("ArrowDown");
        await page.keyboard.press("ArrowRight");
        await page.keyboard.press("Enter");

        expect(await spotOf(page, "pack", "Pack", "Potion"), "one row down and one column across").toBe("3,4");
    });

    test("a drop onto an occupied cell is refused, and the item stays where it was", async ({ page }) => {
        await page.locator(item("pack", "Potion", "Pack")).focus();
        await page.keyboard.press("Enter");
        await page.keyboard.press("ArrowUp");

        await expect(page.locator(ANNOUNCER), "the aim says it will not fit").toContainText("no room");

        await page.keyboard.press("Enter");

        expect(await spotOf(page, "pack", "Pack", "Potion"), "the potion is still where it started").toBe("2,3");
        expect(await spotOf(page, "pack", "Pack", "Kite Shield"), "and the shield has not moved").toBe("2,1");
    });

    test("the page's turn command turns the carried item, and it lands with the turned footprint", async ({ page }) => {
        expect(await sizeOf(page, "pack", "Pack", "Scroll"), "the scroll starts two cells wide").toBe("2x1");

        await page.locator(item("pack", "Scroll", "Pack")).focus();
        await page.keyboard.press("Enter");
        await page.keyboard.press("r");
        await page.keyboard.press("Enter");

        expect(await sizeOf(page, "pack", "Pack", "Scroll"), "and comes to rest two cells tall").toBe("1x2");

        const scroll = await rectsOf(page, "pack", "Pack", "Scroll", [4, 12]);

        expect(scroll?.item, "covering the cell below the one it was in").toEqual(scroll?.cells);
    });

    test("the turn buttons follow the controller, off while nothing is carried", async ({ page }) => {
        const clockwise = page.locator(`${scope("pack")} [data-turn="cw"]`);

        await expect(clockwise, "nothing is carried yet").toBeDisabled();

        await page.locator(item("pack", "Scroll", "Pack")).focus();
        await page.keyboard.press("Enter");

        await expect(clockwise, "a carry in flight turns the button on").toBeEnabled();

        await page.keyboard.press("Escape");

        await expect(clockwise, "and putting it back turns it off again").toBeDisabled();
    });

    test("a turn lands while the button is still held down", async ({ page }) => {
        const from = await page.locator(item("pack", "Scroll", "Pack")).boundingBox();
        const to = await cellPoint(page, "pack", "Pack", ROW_FOUR_COLUMN_FIVE);

        if (!from) throw new Error("a drag needs a box to start from");

        await page.mouse.move(from.x + from.width * 0.25, from.y + from.height * 0.5);
        await page.mouse.down();
        await page.mouse.move(from.x + from.width * 0.25 + 20, from.y + from.height * 0.5, { steps: 5 });
        await page.keyboard.press("r");
        await page.mouse.move(to.x, to.y, { steps: 10 });
        await page.mouse.up();

        expect(await sizeOf(page, "pack", "Pack", "Scroll"), "it landed turned").toBe("1x2");
        expect(await spotOf(page, "pack", "Pack", "Scroll"), "at the cell the pointer was over").toBe("5,4");
    });

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

        expect(await sizeOf(page, "turns", "Bench", "Hook"), "and counterclockwise is taken").toBe("3x2");
    });

    test("a disabled grid moves nothing, by pointer or by key", async ({ page }) => {
        const before = await spotOf(page, "disabled", "Disabled pack", "Potion");

        await page.locator(item("disabled", "Potion", "Disabled pack")).focus();
        await page.keyboard.press("Enter");
        await page.keyboard.press("ArrowDown");
        await page.keyboard.press("Enter");

        expect(await spotOf(page, "disabled", "Disabled pack", "Potion"), "nothing moved").toBe(before);
    });

    test("a press in the notch of an L belongs to the board rather than to the item", async ({ page }) => {
        const notch = await cellPoint(page, "pack", "Pack", NOTCH_OF_THE_PICKAXE);

        await page.mouse.move(notch.x, notch.y);
        await page.mouse.down();
        await page.mouse.move(notch.x + 30, notch.y + 30, { steps: 5 });
        await page.mouse.up();

        expect(await spotOf(page, "pack", "Pack", "Pickaxe"), "the pickaxe never moved").toBe("7,2");
        await expect(page.locator(`${ANNOUNCER} > *`), "and nothing was ever picked up").toHaveCount(0);
    });

    test("the painted shape is the size of the item it belongs to, at every ratio", async ({ page }) => {
        const drawn = await page.evaluate(
            (selector) =>
                [...document.querySelectorAll(selector)].map((element) => {
                    const painted = element.querySelector("polygon")?.getBoundingClientRect();
                    const box = element.getBoundingClientRect();

                    return {
                        name: (element.getAttribute("aria-label") ?? "").split(",")[0],
                        isCovered: painted !== undefined && painted.width >= box.width && painted.height >= box.height,
                    };
                }),
            `${scope("pack")} [role="listitem"]`,
        );

        expect(drawn.length, "the pack has items to check").toBeGreaterThan(0);

        for (const entry of drawn) expect(entry.isCovered, `${entry.name} is painted over its own box`).toBe(true);
    });
});

test.describe("two grids and a list", () => {
    test("an item carried out of one grid arrives in the other", async ({ page, mount }) => {
        await mount(`${STORY}/Pairs`);

        await page.locator(item("pair", "Gem", "Stash")).focus();
        await page.keyboard.press("Enter");
        await page.keyboard.press("Tab");
        await page.keyboard.press("Enter");

        await expect(page.locator(item("pair", "Gem", "Stash")), "the gem has left the stash").toHaveCount(0);
        await expect(page.locator(item("pair", "Gem", "Pack")), "and is in the pack").toHaveCount(1);
    });

    test("a locked grid is not offered as a destination", async ({ page, mount }) => {
        await mount(`${STORY}/Pairs`);

        await page.locator(item("locked", "Potion", "Pack")).focus();
        await page.keyboard.press("Enter");
        await page.keyboard.press("Tab");
        await page.keyboard.press("Enter");

        await expect(page.locator(item("locked", "Potion", "Stash")), "the stash took nothing").toHaveCount(0);
        await expect(page.locator(item("locked", "Potion", "Pack")), "the potion is still in the pack").toHaveCount(1);
    });

    test("an item crosses from a list into a grid, and is given a single cell", async ({ page, mount }) => {
        await mount(`${STORY}/Loot`);

        await page.locator(`${scope("loot")} [role="listitem"][aria-label="Iron Key"]`).focus();
        await page.keyboard.press("Enter");
        await page.keyboard.press("Tab");
        await page.keyboard.press("Enter");

        expect(await sizeOf(page, "loot", "Pack", "Iron Key"), "it lands one cell by one").toBe("1x1");
        await expect(
            page.locator(`${scope("loot")} [data-readout="ground"]`),
            "and is gone from the ground",
        ).not.toContainText("Iron Key");
    });
});

const WALLS = "walls";
const WALLS_LABEL = "Walled pack";
const WALLED_ITEMS = ["Longsword", "Kite Shield", "Scroll", "Pickaxe", "Bread", "Potion"];
const DASHBOARD = "dashboard";
const DASHBOARD_LABEL = "Packed pack";

const spotsOf = async (page: Page, key: string, gridLabel: string, labels: string[]) => {
    const found: Record<string, { col: number; row: number }> = {};

    for (const label of labels) {
        const [col, row] = (await spotOf(page, key, gridLabel, label)).split(",").map(Number);

        found[label] = { col, row };
    }

    return found;
};

const rowOf = async (page: Page, key: string, gridLabel: string, label: string) =>
    Number((await spotOf(page, key, gridLabel, label)).split(",")[1]);

const colOf = async (page: Page, key: string, gridLabel: string, label: string) =>
    Number((await spotOf(page, key, gridLabel, label)).split(",")[0]);

test.describe("walls and compacting", () => {
    test.beforeEach(async ({ page, mount }) => {
        await mount(`${STORY}/Walls`);
        await expect(page.locator(grid(WALLS, WALLS_LABEL))).toBeVisible();
    });

    test("a pointer drop onto a wall is refused, and the item stays where it was", async ({ page }) => {
        const before = await spotOf(page, WALLS, WALLS_LABEL, "Potion");
        const from = await page.locator(item(WALLS, "Potion", WALLS_LABEL)).boundingBox();
        const to = await cellPoint(page, WALLS, WALLS_LABEL, WALL_ROW_TWO_COLUMN_THREE);

        if (!from) throw new Error("a drag needs a box to start from");

        await dragTo(page, { x: from.x + from.width * 0.5, y: from.y + from.height * 0.5 }, to);

        await expect(page.locator(`${ANNOUNCER} > *`), "the drag did pick the potion up").not.toHaveCount(0);
        expect(await spotOf(page, WALLS, WALLS_LABEL, "Potion"), "but it did not land on the wall").toBe(before);
    });

    test("a pointer drop that would reach over a wall is refused", async ({ page }) => {
        const before = await spotOf(page, WALLS, WALLS_LABEL, "Kite Shield");
        const from = await page.locator(item(WALLS, "Kite Shield", WALLS_LABEL)).boundingBox();
        const to = await cellPoint(page, WALLS, WALLS_LABEL, ROW_ONE_COLUMN_THREE);

        if (!from) throw new Error("a drag needs a box to start from");

        await dragTo(page, { x: from.x + from.width * 0.25, y: from.y + from.height * 0.25 }, to);

        await expect(page.locator(`${ANNOUNCER} > *`), "the drag did pick the shield up").not.toHaveCount(0);
        expect(await spotOf(page, WALLS, WALLS_LABEL, "Kite Shield"), "but it is still where it started").toBe(before);
    });

    test("the arrows step a carried item over walls, but not over another item", async ({ page }) => {
        await page.locator(item(WALLS, "Potion", WALLS_LABEL)).focus();
        await page.keyboard.press("Enter");
        await page.keyboard.press("ArrowUp");
        await page.keyboard.press("ArrowUp");

        await expect(page.locator(ANNOUNCER), "the scroll's cell is aimed at, not stepped over").toContainText(
            "no room",
        );

        await page.keyboard.press("ArrowUp");
        await page.keyboard.press("ArrowLeft");
        await page.keyboard.press("ArrowLeft");
        await page.keyboard.press("Enter");

        expect(await spotOf(page, WALLS, WALLS_LABEL, "Potion"), "one step went over both walls at once").toBe("2,2");
    });

    test("a keyboard drop that would reach over a wall is refused", async ({ page }) => {
        const before = await spotOf(page, WALLS, WALLS_LABEL, "Kite Shield");

        await page.locator(item(WALLS, "Kite Shield", WALLS_LABEL)).focus();
        await page.keyboard.press("Enter");
        await page.keyboard.press("ArrowUp");
        await page.keyboard.press("ArrowUp");

        await expect(page.locator(ANNOUNCER), "the aim over the walls has no room").toContainText("no room");

        await page.keyboard.press("Enter");

        expect(await spotOf(page, WALLS, WALLS_LABEL, "Kite Shield"), "so the shield stays where it was").toBe(before);
    });

    test("a wall is handed to the cell painter as blocked", async ({ page }) => {
        await expect(
            page.locator(`${grid(WALLS, WALLS_LABEL)} [data-blocked]`),
            "one painted wall per wall",
        ).toHaveCount(3);
    });

    test("Tidy up slides every item straight up, and a wall holds what is under it", async ({ page }) => {
        const before = await spotsOf(page, WALLS, WALLS_LABEL, WALLED_ITEMS);

        await page.locator(scope(WALLS)).getByRole("button", { name: "Tidy up" }).click();

        const after = await spotsOf(page, WALLS, WALLS_LABEL, WALLED_ITEMS);

        for (const label of WALLED_ITEMS) {
            expect(after[label].col, `${label} kept its column`).toBe(before[label].col);
            expect(after[label].row, `${label} did not move down`).toBeLessThanOrEqual(before[label].row);
        }

        expect(
            WALLED_ITEMS.filter((label) => after[label].row < before[label].row).length,
            "and the scattered items did rise",
        ).toBeGreaterThan(0);
        expect(await spotOf(page, WALLS, WALLS_LABEL, "Kite Shield"), "the shield rests below the walls").toBe("3,3");
        expect(await spotOf(page, WALLS, WALLS_LABEL, "Pickaxe"), "the pickaxe's foot is held by the wall").toBe("7,2");
    });

    test("Tidy up on a grid that is already packed moves nothing", async ({ page }) => {
        const tidy = page.locator(scope(WALLS)).getByRole("button", { name: "Tidy up" });

        await tidy.click();

        const packed = await spotsOf(page, WALLS, WALLS_LABEL, WALLED_ITEMS);

        await tidy.click();

        expect(await spotsOf(page, WALLS, WALLS_LABEL, WALLED_ITEMS), "the second tidy-up changed nothing").toEqual(
            packed,
        );
    });

    test("a grid packed after every move slides a keyboard drop up to close the hole", async ({ page }) => {
        const scrollRow = await rowOf(page, DASHBOARD, DASHBOARD_LABEL, "Scroll");
        const scrollCol = await colOf(page, DASHBOARD, DASHBOARD_LABEL, "Scroll");
        const breadRow = await rowOf(page, DASHBOARD, DASHBOARD_LABEL, "Bread");

        await page.locator(item(DASHBOARD, "Bread", DASHBOARD_LABEL)).focus();
        await page.keyboard.press("Enter");

        for (let step = 0; step < 3; step++) await page.keyboard.press("ArrowRight");

        await page.keyboard.press("Enter");

        expect(breadRow, "the bread was dropped below the row under the scroll").toBeGreaterThan(scrollRow + 1);
        expect(await colOf(page, DASHBOARD, DASHBOARD_LABEL, "Bread"), "it stayed in its column").toBe(scrollCol + 1);
        expect(await rowOf(page, DASHBOARD, DASHBOARD_LABEL, "Bread"), "and slid up under the scroll").toBe(
            scrollRow + 1,
        );
    });

    test("a grid packed after every move slides a pointer drop up to close the hole", async ({ page }) => {
        await page.locator(scope(DASHBOARD)).scrollIntoViewIfNeeded();

        const scrollRow = await rowOf(page, DASHBOARD, DASHBOARD_LABEL, "Scroll");
        const scrollCol = await colOf(page, DASHBOARD, DASHBOARD_LABEL, "Scroll");
        const from = await page.locator(item(DASHBOARD, "Potion", DASHBOARD_LABEL)).boundingBox();
        const to = await cellPoint(page, DASHBOARD, DASHBOARD_LABEL, ROW_FIVE_COLUMN_SIX);

        if (!from) throw new Error("a drag needs a box to start from");

        await dragTo(page, { x: from.x + from.width * 0.5, y: from.y + from.height * 0.5 }, to);

        expect(await colOf(page, DASHBOARD, DASHBOARD_LABEL, "Potion"), "in the column it was dropped in").toBe(
            scrollCol + 1,
        );
        expect(await rowOf(page, DASHBOARD, DASHBOARD_LABEL, "Potion"), "and slid up to the scroll").toBe(
            scrollRow + 1,
        );
    });
});
