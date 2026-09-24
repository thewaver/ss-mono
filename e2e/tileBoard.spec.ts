import { type Page, expect, test } from "@playwright/test";

import { demo, prop, readout, revealProp } from "./helpers";

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

const strokeColor = (page: Page, selector: string, index: number) =>
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
    await page.locator(`${prop("shape")} [role="combobox"]`).click();
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
    const resting = await strokeColor(page, tile(MEEPLE), 0);

    await page.locator(tile(MEEPLE)).first().focus();

    const focused = await strokeColor(page, tile(MEEPLE), 0);

    expect(resting, "the painter has an edge to change").not.toBe("");
    expect(focused, "and it changes it when the refused tile takes focus").not.toBe(resting);
});

test("triangles turn every other tile over, which is what makes them meet edge to edge", async ({ page }) => {
    await pickShape(page, "triangle-up");

    const first = await clipPathOf(page, hitLayer(MARKED), 0);
    const second = await clipPathOf(page, hitLayer(MARKED), 1);
    const third = await clipPathOf(page, hitLayer(MARKED), 2);

    expect(first, "neighbors in a row point opposite ways").not.toBe(second);
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
        const atCenter = document.elementFromPoint(box.x + box.width * 0.5, box.y + box.height * 0.5);

        return meeple.contains(atCenter) || meeple === atCenter;
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
    const resting = await strokeColor(page, tile(MARKED), 2);

    await page.locator(tile(MARKED)).nth(2).click();

    const pressed = await strokeColor(page, tile(MARKED), 2);

    await page.keyboard.press("ArrowRight");

    const walked = await strokeColor(page, tile(MARKED), 3);

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
                    x: Math.round(piece.x + piece.width * 0.5 - (tile.x + tile.width * 0.5)),
                    y: Math.round(piece.bottom - (tile.y + tile.height * 0.5)),
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

    await revealProp(page, "reach", "meeple");
    const field = page.locator(`${prop("reach")} input`);

    const near = await enabled();

    await field.fill("2");
    await field.blur();

    const far = await enabled();

    expect(near, "one step out is the six tiles sharing an edge with a central hexagon").toBe(6);
    expect(far, "and two steps adds the twelve around those").toBe(18);
});

/**
 * A taper leans the board away from the viewer: the top row is drawn narrower than the bottom one, and the
 * rows close up towards the top. The browser draws it through one 3D transform on the board, so these ask
 * what only a browser can answer — that the tiles are drawn smaller the further up they are, that a press
 * still lands on the tile drawn under it rather than the one the flat layout would have put there, and
 * that a piece drawn beside the board stands on its tile and shrinks with it.
 */
const TAPER = "0.5";
const FOOT_LIFT_PX = 2;

const setTaper = async (page: Page) => {
    const field = page.locator(`${prop("taper")} input`);

    await field.fill(TAPER);
    await field.blur();
};

const drawnWidthOf = (page: Page, selector: string, index: number) =>
    page.evaluate((args) => document.querySelectorAll(args.selector)[args.index].getBoundingClientRect().width, {
        selector,
        index,
    });

test("a tapered board draws its top row narrower than its bottom row", async ({ page }) => {
    const flatTop = await drawnWidthOf(page, tile(MARKED), 0);

    await setTaper(page);

    const count = await page.locator(tile(MARKED)).count();
    const top = await drawnWidthOf(page, tile(MARKED), 0);
    const bottom = await drawnWidthOf(page, tile(MARKED), count - 1);

    expect(top, "the far row shrinks").toBeLessThan(flatTop);
    expect(top, "and is drawn smaller than the near one").toBeLessThan(bottom);
});

test("a tapered board reports the box it is drawn in, not a box bent by its own lean", async ({ page }) => {
    await setTaper(page);

    const box = await page.evaluate((scope) => {
        const grid = document.querySelector(`${scope} [role="grid"]`) as HTMLElement;
        const drawn = grid.getBoundingClientRect();

        return { layout: grid.offsetWidth / grid.offsetHeight, drawn: drawn.width / drawn.height };
    }, MARKED);

    expect(box.drawn, "the box on screen has the shape layout gave it").toBeCloseTo(box.layout, 2);
});

test("on a tapered board a press on a drawn tile marks that tile, not the one the flat layout had there", async ({
    page,
}) => {
    await setTaper(page);

    const fullRowTiles = await page
        .locator(`${row(MARKED)} >> nth=0`)
        .locator('[role="gridcell"]')
        .count();

    for (const index of [1, fullRowTiles]) {
        const box = (await page.locator(hitLayer(MARKED)).nth(index).boundingBox())!;

        await page.mouse.click(box.x + box.width * 0.5, box.y + box.height * 0.5);
    }

    const marked = await readout(page, "default");

    expect(marked, "a tile on the top row").toContain("ROW0_COL1");
    expect(marked, "and the first tile of the short row beneath it").toContain("ROW1_COL0");
});

test("on a tapered board a piece stands on its tile and is smaller at the top than at the bottom", async ({ page }) => {
    await setTaper(page);

    await revealProp(page, "reach", "meeple");
    const reach = page.locator(`${prop("reach")} input`);

    await reach.fill("4");
    await reach.blur();

    const standing = (index: number) =>
        page.evaluate(
            (args) => {
                const meeple = document.querySelector(`${args.scope} [data-meeple]`) as HTMLElement;
                const cell = document.querySelectorAll(args.selector)[args.index] as HTMLElement;
                const piece = meeple.getBoundingClientRect();
                const under = document.elementFromPoint(piece.x + piece.width * 0.5, piece.bottom - args.lift);

                return { isOnTile: cell.contains(under), width: Math.round(piece.width) };
            },
            { scope: MEEPLE, selector: tile(MEEPLE), index, lift: FOOT_LIFT_PX },
        );

    const count = await page.locator(tile(MEEPLE)).count();

    await page.locator(hitLayer(MEEPLE)).nth(1).click();
    await expect
        .poll(async () => (await standing(1)).isOnTile, { message: "its foot is on the top row tile" })
        .toBe(true);

    const farWidth = (await standing(1)).width;

    await page
        .locator(hitLayer(MEEPLE))
        .nth(count - 2)
        .click();
    await expect
        .poll(async () => (await standing(count - 2)).isOnTile, { message: "and then on the bottom row tile" })
        .toBe(true);
    await expect.poll(async () => (await standing(count - 2)).width).toBeGreaterThan(farWidth);
});

/**
 * Whether a tile is lit is the Playground's own drawing, so it is read the way the rules for this suite ask:
 * not by what the lit class paints, but by which tiles carry the class a lit tile was given. The tile the
 * Playground draws sits inside the board's paint layer, and the only class it toggles is the lit one — so a
 * tile is lit exactly when its class list differs from a tile that is known not to be.
 */
const ROUTE = demo("route");
const PAINT = demo("paint");

const tileNamed = (scope: string, label: string) => `${tile(scope)}[aria-label="${label}"]`;

const drawnClasses = (page: Page, scope: string) =>
    page.locator(tile(scope)).evaluateAll((cells) =>
        cells.map((cell) => ({
            label: cell.getAttribute("aria-label") ?? "",
            className: cell.firstElementChild?.firstElementChild?.className ?? "",
            isDisabled: cell.getAttribute("aria-disabled") === "true",
        })),
    );

const litLabels = async (page: Page, scope: string, restingClassName: string) =>
    (await drawnClasses(page, scope)).filter((cell) => cell.className !== restingClassName).map((cell) => cell.label);

/**
 * The route example starts every route from the piece on the first tile, and at rest that tile is the only
 * lit one. So the class it wears is the lit class and the class every other tile wears is the resting one,
 * and both are taken from the page rather than written here.
 */
const routeClasses = async (page: Page) => {
    const cells = await drawnClasses(page, ROUTE);
    const lit = cells.find((cell) => cell.label === "Row 1, tile 1")?.className ?? "";
    const resting = cells.find((cell) => cell.className !== lit)?.className ?? "";

    return { lit, resting };
};

/**
 * Two tiles are neighbors when their centers are no further apart than a little over the closest pair on
 * the board: on a hexagon board every edge-sharing pair sits at one of two nearly equal distances, and the
 * next-nearest tiles are half as far again. Measured from the page, so no tile size is written here.
 */
const NEIGHBOR_SLACK = 1.3;

const routeGraph = (page: Page) =>
    page.locator(tile(ROUTE)).evaluateAll((cells, slack) => {
        const centers = cells.map((cell) => {
            const box = cell.getBoundingClientRect();

            return { x: box.left + box.width * 0.5, y: box.top + box.height * 0.5 };
        });
        const distance = (a: number, b: number) => Math.hypot(centers[a].x - centers[b].x, centers[a].y - centers[b].y);

        let closest = Infinity;

        for (let a = 0; a < cells.length; a++) {
            for (let b = a + 1; b < cells.length; b++) closest = Math.min(closest, distance(a, b));
        }

        return cells.map((_, a) =>
            cells
                .map((__, b) => b)
                .filter((b) => b !== a && distance(a, b) <= closest * slack)
                .map((b) => cells[b].getAttribute("aria-label") ?? ""),
        );
    }, NEIGHBOR_SLACK);

const checkRoute = async (page: Page, destination: string) => {
    const { lit, resting } = await routeClasses(page);
    const cells = await drawnClasses(page, ROUTE);
    const graph = await routeGraph(page);
    const neighbors = new Map(cells.map((cell, index) => [cell.label, graph[index]]));
    const onRoute = cells.filter((cell) => cell.className === lit).map((cell) => cell.label);
    const rocks = new Set(cells.filter((cell) => cell.isDisabled).map((cell) => cell.label));

    expect(lit, "the lit class and the resting class are different classes").not.toBe(resting);
    expect(onRoute, "the route starts on the piece").toContain("Row 1, tile 1");
    expect(onRoute, "and ends on the tile pressed").toContain(destination);
    expect(
        onRoute.filter((label) => rocks.has(label)),
        "and not one tile of it is a rock",
    ).toEqual([]);

    /**
     * A route is a line of tiles: the two ends each touch one other lit tile, and every tile between touches
     * exactly two. A lit tile touching three would mean the line doubled back on itself, which a shortest
     * route never does.
     */
    for (const label of onRoute) {
        const litNeighbors = (neighbors.get(label) ?? []).filter((next) => onRoute.includes(next)).length;
        const isEnd = label === "Row 1, tile 1" || label === destination;

        expect(litNeighbors, `${label} touches ${isEnd ? "one" : "two"} other tiles of the route`).toBe(isEnd ? 1 : 2);
    }

    /**
     * And it is the shortest such line: a walk outward from the piece over the measured neighbors, never
     * entering a rock, reaches the destination in exactly as many steps as the lit route has.
     */
    const reached = new Map([["Row 1, tile 1", 0]]);
    const queue = ["Row 1, tile 1"];

    while (queue.length > 0) {
        const current = queue.shift()!;

        for (const next of neighbors.get(current) ?? []) {
            if (reached.has(next) || rocks.has(next)) continue;

            reached.set(next, reached.get(current)! + 1);
            queue.push(next);
        }
    }

    expect(onRoute.length - 1, "and no shorter way round the rocks exists").toBe(reached.get(destination));
};

/**
 * The first tile of the third row sits straight below two rocks, so the way there from the piece has to go
 * the long way round. Pressing it lights a route that starts on the piece, ends on the pressed tile, touches
 * no rock and is as short as a way round can be.
 */
test("pressing a tile lights the shortest route to it, going round the rocks", async ({ page }) => {
    await page.locator(tileNamed(ROUTE, "Row 3, tile 1")).click();

    await checkRoute(page, "Row 3, tile 1");
});

/**
 * The same from the keyboard: the board is walked with the arrows and Enter asks for the route, exactly as a
 * press does.
 */
test("Enter on a tile lights the route to it, the same as a press", async ({ page }) => {
    await page.locator(tile(ROUTE)).first().focus();
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowDown");

    expect(await activeLabel(page), "the walk reached the first tile of the third row").toBe("Row 3, tile 1");

    await page.keyboard.press("Enter");

    await checkRoute(page, "Row 3, tile 1");
});

/**
 * A rock refuses a press, so pressing one asks for no route and the board stays as it was.
 */
test("a press on a rock asks for no route", async ({ page }) => {
    const { resting } = await routeClasses(page);
    const before = await litLabels(page, ROUTE, resting);
    const rock = (await drawnClasses(page, ROUTE)).find((cell) => cell.isDisabled)?.label ?? "";

    expect(rock, "the board has a rock to press").not.toBe("");

    await page.locator(tileNamed(ROUTE, rock)).click({ force: true });

    expect(await litLabels(page, ROUTE, resting), "nothing new was lit").toEqual(before);
});

/**
 * Sweeping. A press that moves across tiles paints each one it passes, a press that stays on one tile is a
 * click and toggles that tile, and the click the browser fires when a sweep ends is swallowed so that the
 * last tile swept is not toggled straight back off. At rest nothing is painted, so every tile carries the
 * resting class and anything that carries another has been painted.
 */
const restingPaintClass = async (page: Page) => {
    const classNames = [...new Set((await drawnClasses(page, PAINT)).map((cell) => cell.className))];

    expect(classNames, "at rest every tile of the paint board is drawn the same").toHaveLength(1);

    return classNames[0];
};

const centerOf = async (page: Page, selector: string) => {
    const box = await page.locator(selector).boundingBox();

    if (!box) throw new Error("the board has no such tile");

    return { x: box.x + box.width * 0.5, y: box.y + box.height * 0.5 };
};

const sweep = async (page: Page, labels: string[]) => {
    const points = [];

    for (const label of labels) points.push(await centerOf(page, tileNamed(PAINT, label)));

    await page.mouse.move(points[0].x, points[0].y);
    await page.mouse.down();

    for (const point of points.slice(1)) await page.mouse.move(point.x, point.y, { steps: 8 });

    await page.mouse.up();
};

test("a press dragged across tiles paints every tile it passes", async ({ page }) => {
    await page.locator(PAINT).scrollIntoViewIfNeeded();

    const resting = await restingPaintClass(page);

    await sweep(page, ["Row 1, tile 1", "Row 1, tile 3"]);

    expect((await litLabels(page, PAINT, resting)).sort(), "the start, the tile passed over and the end").toEqual([
        "Row 1, tile 1",
        "Row 1, tile 2",
        "Row 1, tile 3",
    ]);
});

/**
 * The browser follows a press that moved with a click on the tile it ended on. Were that click to reach the
 * toggle, the last tile swept would be painted by the sweep and cleared again by the click. Sweeping back
 * over tiles already painted leaves them painted too, because a sweep paints rather than toggles.
 */
test("the click at the end of a sweep does not toggle the last tile back off", async ({ page }) => {
    await page.locator(PAINT).scrollIntoViewIfNeeded();

    const resting = await restingPaintClass(page);

    await sweep(page, ["Row 1, tile 1", "Row 1, tile 2"]);

    expect(await litLabels(page, PAINT, resting), "the tile the sweep ended on stayed painted").toContain(
        "Row 1, tile 2",
    );

    await sweep(page, ["Row 1, tile 2", "Row 1, tile 1"]);

    expect(
        (await litLabels(page, PAINT, resting)).sort(),
        "sweeping back over painted tiles leaves them painted",
    ).toEqual(["Row 1, tile 1", "Row 1, tile 2"]);
});

/**
 * A press that never leaves its tile is not a sweep at all: it is a click, and the page gives clicks the
 * toggle. So it paints one tile, the same press again clears it, and a press that wobbles a little without
 * crossing into the next tile is still just a click.
 */
test("a single press toggles one tile, and a wobble inside the tile is still a single press", async ({ page }) => {
    await page.locator(PAINT).scrollIntoViewIfNeeded();

    const resting = await restingPaintClass(page);
    const target = tileNamed(PAINT, "Row 3, tile 3");

    await page.locator(target).click();

    expect(await litLabels(page, PAINT, resting), "one press painted that tile and no other").toEqual([
        "Row 3, tile 3",
    ]);

    await page.locator(target).click();

    expect(await litLabels(page, PAINT, resting), "and the same press again cleared it").toEqual([]);

    const center = await centerOf(page, target);

    await page.mouse.move(center.x, center.y);
    await page.mouse.down();
    await page.mouse.move(center.x + 6, center.y + 4, { steps: 4 });
    await page.mouse.up();

    expect(await litLabels(page, PAINT, resting), "a wobble inside the tile toggled it exactly once").toEqual([
        "Row 3, tile 3",
    ]);
});

/**
 * The keyboard route to the same board is Enter, which reaches the toggle like a click does.
 */
test("Enter toggles the focused tile on the paint board", async ({ page }) => {
    const resting = await restingPaintClass(page);

    await page.locator(tile(PAINT)).first().focus();
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("Enter");

    expect(await litLabels(page, PAINT, resting), "the focused tile was painted").toEqual(["Row 1, tile 2"]);

    await page.keyboard.press("Enter");

    expect(await litLabels(page, PAINT, resting), "and cleared again").toEqual([]);
});
