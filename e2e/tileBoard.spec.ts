import { type Page, expect, test } from "@playwright/test";

import { demo, prop, readout } from "./helpers";

/**
 * Three claims the component makes can only be answered by a browser, and they are what this spec is for.
 *
 * The first is the tessellation. The board never writes a row-spacing constant: it reads the tile's own
 * corners and spaces the rows by what is left of a tile once its cap is overlapped. So the assertions
 * compare one measured row against another measured row, never against a number written here — a spec
 * that pinned "45px" would go red the day somebody resized a tile, which is a change rather than a break.
 *
 * The second is that a click lands on the tile you can see while what a tile draws is not cut off at its
 * edge. Tiles are rectangles in the DOM and hexagons on screen, and a hexagon's box overlaps the boxes of
 * the row above it by a quarter of its height. The shape is worn by a transparent layer over the tile that
 * takes the pointer and nothing else, so hit testing follows the drawing while a piece standing taller
 * than its tile still hangs over the row above. Without that layer, a press in the empty top-left corner
 * of a tile's box would activate that tile instead of the one drawn there.
 *
 * The third is the keyboard. The board is one tab stop, the arrows walk every tile whether it is
 * available or not, and a tile that refuses to be activated still takes focus and is still drawn as
 * focused — which is what lets somebody reading with a screen reader find out that the board has a shape
 * at all, and what stops focus landing somewhere invisible when it does.
 */
const MARKED = demo("default");
const MEEPLE = demo("meeple");
const DISABLED = demo("disabled");

const CORNER_RATIO = 0.06;

const tile = (scope: string) => `${scope} [role="gridcell"]`;
const row = (scope: string) => `${scope} [role="row"]`;

const hitLayer = (scope: string) => `${tile(scope)} > div:last-child`;

const boxOf = (page: Page, selector: string, index: number) =>
    page.evaluate(
        (args) => {
            const element = document.querySelectorAll(args.selector)[args.index] as HTMLElement;

            return {
                left: element.offsetLeft,
                top: element.offsetTop,
                width: element.offsetWidth,
                height: element.offsetHeight,
            };
        },
        { selector, index },
    );

const rowTopOf = (page: Page, selector: string, index: number) =>
    page.evaluate((args) => (document.querySelectorAll(args.selector)[args.index] as HTMLElement).offsetTop, {
        selector,
        index,
    });

const activeLabel = (page: Page) => page.evaluate(() => document.activeElement?.getAttribute("aria-label") ?? "");

const tabStops = (page: Page, scope: string) =>
    page
        .locator(tile(scope))
        .evaluateAll((elements) => elements.filter((element) => (element as HTMLElement).tabIndex === 0).length);

const strokeColour = (page: Page, selector: string, index: number) =>
    page.evaluate(
        (args) => {
            const cell = document.querySelectorAll(args.selector)[args.index] as HTMLElement;
            const paths = cell.querySelectorAll("svg path");

            return paths[paths.length - 1]?.getAttribute("fill") ?? "";
        },
        { selector, index },
    );

const clipPathOf = (page: Page, selector: string, index: number) =>
    page.evaluate((args) => (document.querySelectorAll(args.selector)[args.index] as HTMLElement).style.clipPath, {
        selector,
        index,
    });

const pickShape = async (page: Page, name: string) => {
    await page.locator('[data-prop][data-testid="shape"] button').first().click();
    await page.getByRole("option", { name, exact: true }).click();
};

test.beforeEach(async ({ page }) => {
    await page.goto("/tile-board");
    await expect(page.locator(tile(MARKED)).first()).toBeVisible();
});

test("every other row holds one tile fewer, which is what leaves room for the offset", async ({ page }) => {
    const full = await page
        .locator(`${row(MARKED)} >> nth=0`)
        .locator('[role="gridcell"]')
        .count();
    const short = await page
        .locator(`${row(MARKED)} >> nth=1`)
        .locator('[role="gridcell"]')
        .count();

    expect(short).toBe(full - 1);
});

test("a short row starts half a tile across from a full one, so its tiles sit in the notches", async ({ page }) => {
    const first = await boxOf(page, tile(MARKED), 0);
    const rowOffset = (await rowTopOf(page, `${row(MARKED)}`, 1)) - (await rowTopOf(page, `${row(MARKED)}`, 0));

    const fullRowTiles = await page
        .locator(`${row(MARKED)} >> nth=0`)
        .locator('[role="gridcell"]')
        .count();
    const shortRowFirst = await boxOf(page, tile(MARKED), fullRowTiles);

    const pitch = (await boxOf(page, tile(MARKED), 1)).left - first.left;

    expect(shortRowFirst.left - first.left, "half a tile's pitch across").toBe(pitch / 2);
    expect(rowOffset, "less than a whole tile down, or the rows would not overlap").toBeLessThan(first.height);
    expect(rowOffset).toBeGreaterThan(0);
});

test("the rows are spaced by the tile's own corners rather than by a written constant", async ({ page }) => {
    const hexagonPitch = (await rowTopOf(page, row(MARKED), 1)) - (await rowTopOf(page, row(MARKED), 0));

    await pickShape(page, "lozenge");

    const lozengePitch = (await rowTopOf(page, row(MARKED), 1)) - (await rowTopOf(page, row(MARKED), 0));

    expect(lozengePitch, "a lozenge reaches its full width halfway down, so its rows pack tighter").toBeLessThan(
        hexagonPitch,
    );
});

test("a press in the empty corner of a tile's box reaches the tile drawn there, not the box", async ({ page }) => {
    const fullRowTiles = await page
        .locator(`${row(MARKED)} >> nth=0`)
        .locator('[role="gridcell"]')
        .count();
    const box = (await page.locator(tile(MARKED)).nth(fullRowTiles).boundingBox())!;

    await page.mouse.click(box.x + box.width * CORNER_RATIO, box.y + box.height * CORNER_RATIO);

    const marked = await readout(page, "default");

    expect(marked, "the corner of a short row tile's box has the row above it drawn through it").toContain("ROW0_COL0");
    expect(marked, "and the tile whose box it is was not the one pressed").not.toContain("ROW1_COL0");
});

test("a press in the middle of a tile marks that tile and nothing else", async ({ page }) => {
    await page.locator(tile(MARKED)).nth(1).click();

    expect(await readout(page, "default")).toContain("ROW0_COL1");
});

test("the whole board is one tab stop", async ({ page }) => {
    expect(await tabStops(page, MARKED)).toBe(1);
});

test("a board whose first tile refuses a press can still be tabbed into", async ({ page }) => {
    expect(await tabStops(page, MEEPLE), "the roving tile is refused here, and still holds the tab stop").toBe(1);
});

test("the arrows walk onto a tile that refuses to be activated, rather than stepping over it", async ({ page }) => {
    const before = await readout(page, "meeple");

    await page.locator(tile(MEEPLE)).first().focus();
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");

    const walked = await activeLabel(page);

    await page.keyboard.press("Enter");

    expect(walked, "focus moved two tiles along the top row").toBe("Row 1, tile 3");
    expect(await readout(page, "meeple"), "and pressing Enter on it did nothing").toBe(before);
});

test("Enter on a tile the piece can reach moves the piece there", async ({ page }) => {
    await page.locator(tile(MEEPLE)).first().focus();

    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("Enter");

    expect(await readout(page, "meeple")).toContain("row 3, tile 2");
});

test("a disabled board takes neither a press nor a key", async ({ page }) => {
    const before = await readout(page, "disabled");

    await page.locator(tile(DISABLED)).nth(1).click({ force: true });

    expect(await readout(page, "disabled")).toBe(before);
    expect(await page.locator(`${DISABLED} [role="grid"]`).getAttribute("aria-disabled")).toBe("true");
});

test("a tile that refuses a press is still drawn as focused, because nothing else would draw it", async ({ page }) => {
    const resting = await strokeColour(page, tile(MEEPLE), 0);

    await page.locator(tile(MEEPLE)).first().focus();

    const focused = await strokeColour(page, tile(MEEPLE), 0);

    expect(resting, "the painter has an edge to change").not.toBe("");
    expect(focused, "and it changes it when the refused tile takes focus").not.toBe(resting);
});

test("triangles turn every other tile over, which is what makes them meet edge to edge", async ({ page }) => {
    await pickShape(page, "triangle-up");

    const first = await clipPathOf(page, hitLayer(MARKED), 0);
    const second = await clipPathOf(page, hitLayer(MARKED), 1);
    const third = await clipPathOf(page, hitLayer(MARKED), 2);

    expect(first, "neighbours in a row point opposite ways").not.toBe(second);
    expect(third, "and the one after that points back the first way").toBe(first);
});

test("a square board offsets no row and drops no tile, which is the shape that does not interlock", async ({
    page,
}) => {
    await pickShape(page, "square");

    const full = await page
        .locator(`${row(MARKED)} >> nth=0`)
        .locator('[role="gridcell"]')
        .count();
    const next = await page
        .locator(`${row(MARKED)} >> nth=1`)
        .locator('[role="gridcell"]')
        .count();
    const rowPitch = (await rowTopOf(page, row(MARKED), 1)) - (await rowTopOf(page, row(MARKED), 0));
    const box = await boxOf(page, tile(MARKED), 0);

    expect(next).toBe(full);
    expect(rowPitch, "a whole tile down, because nothing overlaps").toBeGreaterThan(box.height);
});

test("starting on the short row moves the missing tile to the top", async ({ page }) => {
    const before = await page
        .locator(`${row(MARKED)} >> nth=0`)
        .locator('[role="gridcell"]')
        .count();

    await page.locator('[data-prop][data-testid="hasShortFirstRow"] input').click();

    const after = await page
        .locator(`${row(MARKED)} >> nth=0`)
        .locator('[role="gridcell"]')
        .count();
    const second = await page
        .locator(`${row(MARKED)} >> nth=1`)
        .locator('[role="gridcell"]')
        .count();

    expect(after).toBe(before - 1);
    expect(second).toBe(before);
});

test("a piece is not covered by the tile it stands on, even while that tile is hovered", async ({ page }) => {
    const target = page.locator(tile(MARKED)).nth(2);

    await target.click();
    await target.hover();

    const covered = await page.evaluate((scope) => {
        const meeple = document.querySelector(`${scope} [data-meeple]`) as HTMLElement;
        const box = meeple.getBoundingClientRect();
        const atCentre = document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2);

        return meeple.contains(atCentre) || meeple === atCentre;
    }, MARKED);

    expect(covered, "the board's own hover lift must not reach past the board").toBe(false);
});

test("the layer that wears the shape takes the pointer, and nothing else in the tile is cut by it", async ({
    page,
}) => {
    const tile3 = await page.evaluate((selector) => {
        const cell = document.querySelectorAll(selector)[0] as HTMLElement;
        const paint = cell.firstElementChild as HTMLElement;
        const layer = cell.lastElementChild as HTMLElement;
        const style = getComputedStyle(layer);

        return {
            clip: style.clipPath,
            events: style.pointerEvents,
            hidden: layer.getAttribute("aria-hidden"),
            cellClip: getComputedStyle(cell).clipPath,
            paintClip: getComputedStyle(paint).clipPath,
        };
    }, tile(MARKED));

    expect(tile3.clip).toContain("polygon");
    expect(tile3.events).toBe("all");
    expect(tile3.hidden, "it is scenery to a screen reader, and the cell around it carries the name").toBe("true");
    expect(tile3.cellClip, "the cell wears no shape, so what it draws is not cut at the tile's edge").toBe("none");
    expect(tile3.paintClip, "and neither does the layer the consumer paints into").toBe("none");
});

test("a keyboard walk draws one focus ring, on the shape rather than around its box", async ({ page }) => {
    await page.locator(tile(MARKED)).first().focus();
    await page.keyboard.press("ArrowRight");

    const drawn = await page.evaluate((selector) => {
        const cell = document.querySelectorAll(selector)[1] as HTMLElement;

        return { focused: cell.matches(":focus-visible"), outline: getComputedStyle(cell).outlineStyle };
    }, tile(MARKED));

    expect(drawn.focused, "the cell is what the keyboard put focus on").toBe(true);
    expect(drawn.outline, "and nothing outlines its box, which is not the shape the tile is").toBe("none");
});

test("a press leaves the ring off, and the next arrow key brings it back", async ({ page }) => {
    const resting = await strokeColour(page, tile(MARKED), 2);

    await page.locator(tile(MARKED)).nth(2).click();

    const pressed = await strokeColour(page, tile(MARKED), 2);

    await page.keyboard.press("ArrowRight");

    const walked = await strokeColour(page, tile(MARKED), 3);

    expect(pressed, "a tile pressed with the pointer holds focus without advertising it").toBe(resting);
    expect(walked, "and the key that moved focus is what asks for the ring").not.toBe(resting);
});

test("a piece rendered above the board lands on the middle of the tile it is given", async ({ page }) => {
    const offsetFrom = (index: number) =>
        page.evaluate(
            (args) => {
                const meeple = document.querySelector(`${args.scope} [data-meeple]`) as HTMLElement;
                const cell = document.querySelectorAll(args.selector)[args.index] as HTMLElement;
                const piece = meeple.getBoundingClientRect();
                const tile = cell.getBoundingClientRect();

                return {
                    x: Math.round(piece.x + piece.width / 2 - (tile.x + tile.width / 2)),
                    y: Math.round(piece.bottom - (tile.y + tile.height / 2)),
                };
            },
            { scope: MEEPLE, selector: tile(MEEPLE), index },
        );

    await page.locator(tile(MEEPLE)).nth(12).click();

    await expect
        .poll(() => offsetFrom(12), {
            message: "the piece is told a tile index and stands on that tile's middle, measured rather than written",
        })
        .toEqual({ x: 0, y: 0 });

    expect(await readout(page, "meeple"), "and the board agrees which tile it is standing on").toContain(
        "row 3, tile 4",
    );
});

test("the piece is scenery: it takes no pointer and the tile under it is still pressable", async ({ page }) => {
    const before = await readout(page, "meeple");
    const events = await page.evaluate(
        (scope) => getComputedStyle(document.querySelector(`${scope} [data-meeple]`)!).pointerEvents,
        MEEPLE,
    );

    await page.locator(tile(MEEPLE)).nth(12).click();

    expect(events).toBe("none");
    expect(await readout(page, "meeple"), "the press under the piece still reached the board").not.toBe(before);
});

test("the reach knob widens the ring of tiles that will take the piece", async ({ page }) => {
    const enabled = () =>
        page.evaluate(
            (selector) =>
                Array.from(document.querySelectorAll(selector)).filter(
                    (cell) => cell.getAttribute("aria-disabled") !== "true",
                ).length,
            tile(MEEPLE),
        );

    const field = page.locator(`${MEEPLE} ${prop("reach")} input`);

    const near = await enabled();

    await field.fill("2");
    await field.blur();

    const far = await enabled();

    expect(near, "one step out is the six tiles sharing an edge with a central hexagon").toBe(6);
    expect(far, "and two steps adds the twelve around those").toBe(18);
});
