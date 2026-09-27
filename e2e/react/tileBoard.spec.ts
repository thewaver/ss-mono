import { type Page, expect, test } from "@playwright/test";

/**
 * The React `TileBoard`, over the React `InteractionWrapper` and the shared `TileBoardUtils` — the layout and tiling
 * table, the key map and the sweeper the Solid board runs on too. The cases follow `e2e/tileBoard.spec.ts`, which
 * covers the Solid one, so the two frameworks are held to the same three claims: the tiles tessellate, a press lands
 * on the tile drawn under it while nothing a tile paints is cut off, and the keyboard walks every tile, refused ones
 * included.
 *
 * The stories stand in for the Playground's examples with a plain painter of their own. What the painter was handed
 * is written onto it as data attributes — `data-marked` for a tile the story has marked, `data-focus-visible` for the
 * flag the board passed — so a case reads what the board told the painter, never what the painter drew. The Solid
 * case about the double focus ring has no counterpart: the ring it suppresses is the Playground's own global rule.
 */
const MARKED = "Exotics/TileBoard/Marked";
const PIECE = "Exotics/TileBoard/Piece";
const ROUTE = "Exotics/TileBoard/Route";
const PAINT = "Exotics/TileBoard/Paint";

const SCOPE = '[data-testid="board"]';
const TILE = `${SCOPE} [role="gridcell"]`;
const ROW = `${SCOPE} [role="row"]`;
const HIT_LAYER = `${TILE} > div:last-child`;
const CORNER_RATIO = 0.06;

const readout = (page: Page) => page.locator('[data-readout="board"]').innerText();

const boxOf = (page: Page, index: number) =>
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
        { selector: TILE, index },
    );

const rowTopOf = (page: Page, index: number) =>
    page.evaluate((args) => (document.querySelectorAll(args.selector)[args.index] as HTMLElement).offsetTop, {
        selector: ROW,
        index,
    });

const rowLength = (page: Page, index: number) =>
    page.locator(`${ROW} >> nth=${index}`).locator('[role="gridcell"]').count();

const activeLabel = (page: Page) => page.evaluate(() => document.activeElement?.getAttribute("aria-label") ?? "");

const tabStops = (page: Page) =>
    page
        .locator(TILE)
        .evaluateAll((elements) => elements.filter((element) => (element as HTMLElement).tabIndex === 0).length);

const isRingShown = (page: Page, index: number) =>
    page
        .locator(TILE)
        .nth(index)
        .locator("[data-focus-visible]")
        .count()
        .then((count) => count > 0);

const clipPathOf = (page: Page, index: number) =>
    page.evaluate((args) => (document.querySelectorAll(args.selector)[args.index] as HTMLElement).style.clipPath, {
        selector: HIT_LAYER,
        index,
    });

const tileNamed = (label: string) => `${TILE}[aria-label="${label}"]`;

const enabledCount = (page: Page) =>
    page
        .locator(TILE)
        .evaluateAll((cells) => cells.filter((cell) => cell.getAttribute("aria-disabled") !== "true").length);

type Cell = { label: string; isMarked: boolean; isDisabled: boolean };

const readCells = (page: Page): Promise<Cell[]> =>
    page.locator(TILE).evaluateAll((cells) =>
        cells.map((cell) => ({
            label: cell.getAttribute("aria-label") ?? "",
            isMarked: cell.querySelector("[data-marked]") !== null,
            isDisabled: cell.getAttribute("aria-disabled") === "true",
        })),
    );

const markedLabels = async (page: Page) =>
    (await readCells(page)).filter((cell) => cell.isMarked).map((cell) => cell.label);

test("every other row holds one tile fewer, which is what leaves room for the offset", async ({ page, mount }) => {
    await mount(MARKED);

    expect(await rowLength(page, 1)).toBe((await rowLength(page, 0)) - 1);
});

test("a short row starts half a tile across from a full one, so its tiles sit in the notches", async ({
    page,
    mount,
}) => {
    await mount(MARKED);

    const first = await boxOf(page, 0);
    const rowOffset = (await rowTopOf(page, 1)) - (await rowTopOf(page, 0));
    const shortRowFirst = await boxOf(page, await rowLength(page, 0));
    const pitch = (await boxOf(page, 1)).left - first.left;

    expect(shortRowFirst.left - first.left).toBe(pitch / 2);
    expect(rowOffset).toBeLessThan(first.height);
    expect(rowOffset).toBeGreaterThan(0);
});

test("the rows are spaced by the tile's own shape, so a lozenge packs tighter than a hexagon", async ({
    page,
    mount,
}) => {
    await mount(MARKED);

    const hexagonPitch = (await rowTopOf(page, 1)) - (await rowTopOf(page, 0));

    await mount(MARKED, { shape: "lozenge" });

    const lozengePitch = (await rowTopOf(page, 1)) - (await rowTopOf(page, 0));

    expect(lozengePitch).toBeLessThan(hexagonPitch);
});

test("a press in the empty corner of a tile's box reaches the tile drawn there, not the box", async ({
    page,
    mount,
}) => {
    await mount(MARKED);

    const box = (await page
        .locator(TILE)
        .nth(await rowLength(page, 0))
        .boundingBox())!;

    await page.mouse.click(box.x + box.width * CORNER_RATIO, box.y + box.height * CORNER_RATIO);

    const marked = await readout(page);

    expect(marked).toContain("ROW0_COL0");
    expect(marked).not.toContain("ROW1_COL0");
});

test("a press in the middle of a tile marks that tile and nothing else", async ({ page, mount }) => {
    await mount(MARKED);
    await page.locator(TILE).nth(1).click();

    expect(await readout(page)).toBe("marked: ROW0_COL1");
});

test("the whole board is one tab stop, and it is a grid of rows of cells", async ({ page, mount }) => {
    await mount(MARKED);

    expect(await tabStops(page)).toBe(1);
    await expect(page.locator(`${SCOPE} [role="grid"]`)).toHaveAttribute("aria-rowcount", "5");
    await expect(page.locator(TILE).nth(1)).toHaveAttribute("aria-colindex", "2");
});

test("a board whose first tile refuses a press can still be tabbed into", async ({ page, mount }) => {
    await mount(PIECE);

    expect(await tabStops(page)).toBe(1);
});

test("the arrows walk onto a tile that refuses to be activated, rather than stepping over it", async ({
    page,
    mount,
}) => {
    await mount(PIECE);

    const before = await readout(page);

    await page.locator(TILE).first().focus();
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");

    const walked = await activeLabel(page);

    await page.keyboard.press("Enter");

    expect(walked).toBe("Row 1, tile 3");
    expect(await readout(page)).toBe(before);
});

test("Ctrl with End and Home reach the last and first tile of the board", async ({ page, mount }) => {
    await mount(MARKED);
    await page.locator(TILE).first().focus();
    await page.keyboard.press("Control+End");

    expect(await activeLabel(page)).toBe("Row 5, tile 5");

    await page.keyboard.press("Control+Home");

    expect(await activeLabel(page)).toBe("Row 1, tile 1");
});

test("Enter on a tile the piece can reach moves the piece there", async ({ page, mount }) => {
    await mount(PIECE);
    await page.locator(TILE).first().focus();
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("Enter");

    expect(await readout(page)).toContain("row 3, tile 2");
});

test("a disabled board takes neither a press nor a key", async ({ page, mount }) => {
    await mount(MARKED, { isDisabled: true });

    const before = await readout(page);

    await page.locator(TILE).nth(1).click({ force: true });

    expect(await readout(page)).toBe(before);
    await expect(page.locator(`${SCOPE} [role="grid"]`)).toHaveAttribute("aria-disabled", "true");
    expect(await tabStops(page), "and nothing in it is a tab stop").toBe(0);
});

test("a tile that refuses a press is still drawn as focused, because nothing else would draw it", async ({
    page,
    mount,
}) => {
    await mount(PIECE);

    expect(await isRingShown(page, 0)).toBe(false);

    await page.locator(TILE).first().focus();

    await expect.poll(() => isRingShown(page, 0)).toBe(true);
});

test("triangles turn every other tile over, which is what makes them meet edge to edge", async ({ page, mount }) => {
    await mount(MARKED, { shape: "triangle-up" });

    const first = await clipPathOf(page, 0);

    expect(first).not.toBe(await clipPathOf(page, 1));
    expect(await clipPathOf(page, 2)).toBe(first);
});

test("a square board offsets no row and drops no tile", async ({ page, mount }) => {
    await mount(MARKED, { shape: "square" });

    const rowPitch = (await rowTopOf(page, 1)) - (await rowTopOf(page, 0));

    expect(await rowLength(page, 1)).toBe(await rowLength(page, 0));
    expect(rowPitch).toBeGreaterThan((await boxOf(page, 0)).height);
});

test("starting on the short row moves the missing tile to the top", async ({ page, mount }) => {
    await mount(MARKED);

    const before = await rowLength(page, 0);

    await mount(MARKED, { hasShortFirstRow: true });

    expect(await rowLength(page, 0)).toBe(before - 1);
    expect(await rowLength(page, 1)).toBe(before);
});

/**
 * The Solid case reads `elementFromPoint` at the piece's middle, which a `pointer-events: none` piece can never be
 * returned by. Here the piece is made hit-testable for the one reading, so the question asked is the real one: is the
 * hovered tile, lifted by the wrapper, still painted under a sibling drawn after the board.
 */
test("a piece is not covered by the tile it stands on, even while that tile is hovered", async ({ page, mount }) => {
    await mount(MARKED);

    const target = page.locator(TILE).nth(2);

    await target.click();
    await target.hover();

    const isOnTop = await page.evaluate((scope) => {
        const meeple = document.querySelector(`${scope} [data-meeple]`) as HTMLElement;

        meeple.style.pointerEvents = "auto";

        const box = meeple.getBoundingClientRect();
        const atCenter = document.elementFromPoint(box.x + box.width * 0.5, box.y + box.height * 0.5);

        meeple.style.pointerEvents = "";

        return meeple === atCenter || meeple.contains(atCenter);
    }, SCOPE);

    expect(isOnTop).toBe(true);
});

test("the layer that wears the shape takes the pointer, and nothing else in the tile is cut by it", async ({
    page,
    mount,
}) => {
    await mount(MARKED);

    const layers = await page.evaluate((selector) => {
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
    }, TILE);

    expect(layers.clip).toContain("polygon");
    expect(layers.events).toBe("all");
    expect(layers.hidden).toBe("true");
    expect(layers.cellClip).toBe("none");
    expect(layers.paintClip).toBe("none");
});

test("a press leaves the ring off, and the next arrow key brings it back", async ({ page, mount }) => {
    await mount(MARKED);
    await page.locator(TILE).nth(2).click();

    expect(await isRingShown(page, 2), "a pressed tile holds focus without advertising it").toBe(false);

    await page.keyboard.press("ArrowRight");

    await expect.poll(() => isRingShown(page, 3), { message: "the arrow key asks for the ring" }).toBe(true);
});

test("a piece rendered above the board lands on the middle of the tile it is given", async ({ page, mount }) => {
    await mount(PIECE);

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
            { scope: SCOPE, selector: TILE, index },
        );

    await page.locator(TILE).nth(12).click();

    await expect.poll(() => offsetFrom(12)).toEqual({ x: 0, y: 0 });
    expect(await readout(page)).toContain("row 3, tile 4");
});

test("the piece is scenery: it takes no pointer and the tile under it is still pressable", async ({ page, mount }) => {
    await mount(PIECE);

    const before = await readout(page);
    const events = await page.evaluate(
        (scope) => getComputedStyle(document.querySelector(`${scope} [data-meeple]`)!).pointerEvents,
        SCOPE,
    );

    await page.locator(TILE).nth(12).click();

    expect(events).toBe("none");
    expect(await readout(page)).not.toBe(before);
});

test("a wider reach widens the ring of tiles that will take the piece", async ({ page, mount }) => {
    await mount(PIECE, { reach: 1 });

    expect(await enabledCount(page)).toBe(6);

    await mount(PIECE, { reach: 2 });

    expect(await enabledCount(page)).toBe(18);
});

const TAPER = 0.5;
const FOOT_LIFT_PX = 2;

const drawnWidthOf = (page: Page, index: number) =>
    page.evaluate((args) => document.querySelectorAll(args.selector)[args.index].getBoundingClientRect().width, {
        selector: TILE,
        index,
    });

test("a tapered board draws its top row narrower than its bottom row", async ({ page, mount }) => {
    await mount(MARKED);

    const flatTop = await drawnWidthOf(page, 0);

    await mount(MARKED, { taper: TAPER });

    const count = await page.locator(TILE).count();
    const top = await drawnWidthOf(page, 0);

    expect(top).toBeLessThan(flatTop);
    expect(top).toBeLessThan(await drawnWidthOf(page, count - 1));
});

test("a tapered board reports the box it is drawn in, not a box bent by its own lean", async ({ page, mount }) => {
    await mount(MARKED, { taper: TAPER });

    const box = await page.evaluate((scope) => {
        const grid = document.querySelector(`${scope} [role="grid"]`) as HTMLElement;
        const drawn = grid.getBoundingClientRect();

        return { layout: grid.offsetWidth / grid.offsetHeight, drawn: drawn.width / drawn.height };
    }, SCOPE);

    expect(box.drawn).toBeCloseTo(box.layout, 2);
});

test("on a tapered board a press on a drawn tile marks that tile, not the one the flat layout had there", async ({
    page,
    mount,
}) => {
    await mount(MARKED, { taper: TAPER });

    for (const index of [1, await rowLength(page, 0)]) {
        const box = (await page.locator(HIT_LAYER).nth(index).boundingBox())!;

        await page.mouse.click(box.x + box.width * 0.5, box.y + box.height * 0.5);
    }

    const marked = await readout(page);

    expect(marked).toContain("ROW0_COL1");
    expect(marked).toContain("ROW1_COL0");
});

test("on a tapered board a piece stands on its tile and is smaller at the top than at the bottom", async ({
    page,
    mount,
}) => {
    await mount(PIECE, { taper: TAPER, reach: 4 });

    const standing = (index: number) =>
        page.evaluate(
            (args) => {
                const meeple = document.querySelector(`${args.scope} [data-meeple]`) as HTMLElement;
                const cell = document.querySelectorAll(args.selector)[args.index] as HTMLElement;
                const piece = meeple.getBoundingClientRect();
                const under = document.elementFromPoint(piece.x + piece.width * 0.5, piece.bottom - args.lift);

                return { isOnTile: cell.contains(under), width: Math.round(piece.width) };
            },
            { scope: SCOPE, selector: TILE, index, lift: FOOT_LIFT_PX },
        );

    const count = await page.locator(TILE).count();

    await page.locator(HIT_LAYER).nth(1).click();
    await expect.poll(async () => (await standing(1)).isOnTile).toBe(true);

    const farWidth = (await standing(1)).width;

    await page
        .locator(HIT_LAYER)
        .nth(count - 2)
        .click();
    await expect.poll(async () => (await standing(count - 2)).isOnTile).toBe(true);
    await expect.poll(async () => (await standing(count - 2)).width).toBeGreaterThan(farWidth);
});

const NEIGHBOR_SLACK = 1.3;

const routeGraph = (page: Page) =>
    page.locator(TILE).evaluateAll((cells, slack) => {
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

/**
 * A route is a line of tiles from the piece to the tile pressed, touching no rock, with each end touching one other
 * lit tile and every tile between touching two, and it is as short as a walk over the measured neighbors allows.
 */
const checkRoute = async (page: Page, destination: string) => {
    const start = "Row 1, tile 1";
    const cells = await readCells(page);
    const graph = await routeGraph(page);
    const neighbors = new Map(cells.map((cell, index) => [cell.label, graph[index]]));
    const onRoute = cells.filter((cell) => cell.isMarked).map((cell) => cell.label);
    const rocks = new Set(cells.filter((cell) => cell.isDisabled).map((cell) => cell.label));

    expect(onRoute).toContain(start);
    expect(onRoute).toContain(destination);
    expect(onRoute.filter((label) => rocks.has(label))).toEqual([]);

    for (const label of onRoute) {
        const litNeighbors = (neighbors.get(label) ?? []).filter((next) => onRoute.includes(next)).length;
        const isEnd = label === start || label === destination;

        expect(litNeighbors, label).toBe(isEnd ? 1 : 2);
    }

    const reached = new Map([[start, 0]]);
    const queue = [start];

    while (queue.length > 0) {
        const current = queue.shift()!;

        for (const next of neighbors.get(current) ?? []) {
            if (reached.has(next) || rocks.has(next)) continue;

            reached.set(next, reached.get(current)! + 1);
            queue.push(next);
        }
    }

    expect(onRoute.length - 1).toBe(reached.get(destination));
};

test("pressing a tile lights the shortest route to it, going round the rocks", async ({ page, mount }) => {
    await mount(ROUTE);
    await page.locator(tileNamed("Row 3, tile 1")).click();

    await checkRoute(page, "Row 3, tile 1");
});

test("Enter on a tile lights the route to it, the same as a press", async ({ page, mount }) => {
    await mount(ROUTE);
    await page.locator(TILE).first().focus();
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowDown");

    expect(await activeLabel(page)).toBe("Row 3, tile 1");

    await page.keyboard.press("Enter");

    await checkRoute(page, "Row 3, tile 1");
});

test("a press on a rock asks for no route", async ({ page, mount }) => {
    await mount(ROUTE);

    const before = await markedLabels(page);
    const rock = (await readCells(page)).find((cell) => cell.isDisabled)?.label ?? "";

    expect(rock).not.toBe("");

    await page.locator(tileNamed(rock)).click({ force: true });

    expect(await markedLabels(page)).toEqual(before);
});

const centerOf = async (page: Page, selector: string) => {
    const box = (await page.locator(selector).boundingBox())!;

    return { x: box.x + box.width * 0.5, y: box.y + box.height * 0.5 };
};

const sweep = async (page: Page, labels: string[]) => {
    const points = [];

    for (const label of labels) points.push(await centerOf(page, tileNamed(label)));

    await page.mouse.move(points[0].x, points[0].y);
    await page.mouse.down();

    for (const point of points.slice(1)) await page.mouse.move(point.x, point.y, { steps: 8 });

    await page.mouse.up();
};

test("a press dragged across tiles paints every tile it passes", async ({ page, mount }) => {
    await mount(PAINT);

    expect(await markedLabels(page)).toEqual([]);

    await sweep(page, ["Row 1, tile 1", "Row 1, tile 3"]);

    expect((await markedLabels(page)).sort()).toEqual(["Row 1, tile 1", "Row 1, tile 2", "Row 1, tile 3"]);
});

test("the click at the end of a sweep does not toggle the last tile back off", async ({ page, mount }) => {
    await mount(PAINT);
    await sweep(page, ["Row 1, tile 1", "Row 1, tile 2"]);

    expect(await markedLabels(page)).toContain("Row 1, tile 2");

    await sweep(page, ["Row 1, tile 2", "Row 1, tile 1"]);

    expect((await markedLabels(page)).sort()).toEqual(["Row 1, tile 1", "Row 1, tile 2"]);
});

test("a single press toggles one tile, and a wobble inside the tile is still a single press", async ({
    page,
    mount,
}) => {
    await mount(PAINT);

    const target = tileNamed("Row 3, tile 3");

    await page.locator(target).click();

    expect(await markedLabels(page)).toEqual(["Row 3, tile 3"]);

    await page.locator(target).click();

    expect(await markedLabels(page)).toEqual([]);

    const center = await centerOf(page, target);

    await page.mouse.move(center.x, center.y);
    await page.mouse.down();
    await page.mouse.move(center.x + 6, center.y + 4, { steps: 4 });
    await page.mouse.up();

    expect(await markedLabels(page)).toEqual(["Row 3, tile 3"]);
});

test("Enter toggles the focused tile on the paint board", async ({ page, mount }) => {
    await mount(PAINT);
    await page.locator(TILE).first().focus();
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("Enter");

    expect(await markedLabels(page)).toEqual(["Row 1, tile 2"]);

    await page.keyboard.press("Enter");

    expect(await markedLabels(page)).toEqual([]);
});

test("while sweeping is on, a touch on the board drags rather than scrolls", async ({ page, mount }) => {
    await mount(PAINT);

    expect(await page.locator(`${SCOPE} [role="grid"]`).evaluate((grid) => getComputedStyle(grid).touchAction)).toBe(
        "none",
    );

    await mount(MARKED);

    expect(
        await page.locator(`${SCOPE} [role="grid"]`).evaluate((grid) => getComputedStyle(grid).touchAction),
    ).not.toBe("none");
});
