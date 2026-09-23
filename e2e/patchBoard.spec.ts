import { type Page, expect, test } from "@playwright/test";

import { demo, readout, waitUntilStill } from "./helpers";

const board = (key: string, label: string) => `${demo(key)} [role="group"][aria-label="${label}"]`;

const node = (key: string, label: string, boardLabel: string) =>
    `${board(key, boardLabel)} [role="button"][aria-label="${label}"]`;

/**
 * A socket's accessible name carries the node it belongs to, which side it is and whether it is connected
 * — and the last of those is the thing several of these tests are about to change. So a socket is found by
 * the beginning of that name rather than by all of it.
 */
const socket = (key: string, label: string, boardLabel: string) =>
    `${board(key, boardLabel)} [role="button"][aria-label^="${label},"]`;

const ANNOUNCER = 'body > [role="log"][aria-live="polite"]';

const CHAIN = "chain";
const CHAIN_LABEL = "Signal chain";
const MIXER = "mixer";
const MIXER_LABEL = "Mixing desk";

/**
 * Where a cable actually ends, in the same space as the socket it should be ending on. The cable is drawn
 * by the Playground as an SVG path, so its far end is `getPointAtLength` at the full length, put through
 * the element's own screen matrix — which is what turns user units into the client space a bounding box is
 * reported in, whatever the `Viewport` around it is scaling by.
 */
const cableEnds = (page: Page, key: string, boardLabel: string) =>
    page.evaluate(
        (selector) => {
            const paths = [...document.querySelectorAll<SVGPathElement>(`${selector} svg path`)];

            return paths.map((path) => {
                const point = path.getPointAtLength(path.getTotalLength());
                const matrix = path.getScreenCTM();

                if (!matrix) throw new Error("the cable is not on screen");

                return {
                    x: point.x * matrix.a + point.y * matrix.c + matrix.e,
                    y: point.x * matrix.b + point.y * matrix.d + matrix.f,
                };
            });
        },
        board(key, boardLabel),
    );

const centerOf = (page: Page, selector: string) =>
    page.evaluate((value) => {
        const box = document.querySelector(value)?.getBoundingClientRect();

        if (!box) throw new Error("no such socket");

        return { x: box.left + box.width * 0.5, y: box.top + box.height * 0.5 };
    }, selector);

const cableCount = async (page: Page, key: string) => {
    const found = /(\d+) cables/.exec(await readout(page, key));

    return found ? Number(found[1]) : -1;
};

test.beforeEach(async ({ page }) => {
    await page.goto("/patch-board");
    await expect(page.locator("[data-example]").first()).toBeVisible();
});

/**
 * The reason this is a component rather than a tree with a drag prop: the cable is fixed to the socket
 * and the socket travels with the box. The gate is walked four steps down with the keyboard and the end
 * of the one cable on the board has to still be sitting on the gate's input, which has moved with it.
 */
test("a cable stays on its socket while the node it hangs off is moved", async ({ page }) => {
    const target = socket(CHAIN, "Gate in", CHAIN_LABEL);

    const before = await centerOf(page, target);
    const [endBefore] = await cableEnds(page, CHAIN, CHAIN_LABEL);

    expect(
        Math.hypot(endBefore.x - before.x, endBefore.y - before.y),
        "the cable starts out on the socket",
    ).toBeLessThan(2);

    await page.locator(node(CHAIN, "Gate", CHAIN_LABEL)).focus();
    await page.keyboard.press("Enter");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");

    const after = await centerOf(page, target);
    const [endAfter] = await cableEnds(page, CHAIN, CHAIN_LABEL);

    expect(after.y, "the gate has actually moved down the board").toBeGreaterThan(before.y);
    expect(
        Math.hypot(endAfter.x - after.x, endAfter.y - after.y),
        "and the cable is still on the socket it was on",
    ).toBeLessThan(2);
});

/**
 * The keyboard route for wiring, which is the half a mouse-only patch bay never has. Enter on a socket
 * takes a cable out of it, the arrows step through the sockets it could go to, and Enter drops it in. The
 * step order is the sockets of the board in turn — the gate's three, then the lamp's one — so the fourth
 * step from the clock's output is the lamp's input.
 */
test("a cable can be taken from one socket and dropped in another without a pointer", async ({ page }) => {
    expect(await cableCount(page, CHAIN), "one cable to start with").toBe(1);

    await page.locator(socket(CHAIN, "Clock tick", CHAIN_LABEL)).focus();
    await page.keyboard.press("Enter");

    await expect(page.locator(ANNOUNCER), "picking it up says where it came from").toContainText("Clock tick");

    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("Enter");

    expect(await cableCount(page, CHAIN), "and the board has a second cable").toBe(2);
    expect(await readout(page, CHAIN), "which runs from the clock to the lamp").toContain(
        "connected clock tick to lamp sig",
    );
});

/**
 * The refusal, which is the other half of what the sockets are for. The gate's second input is disabled,
 * so a cable aimed at it is announced as refused and dropping it there leaves the board as it was rather
 * than making a connection nobody allowed.
 */
test("a socket that cannot take the cable says so, and refuses the drop", async ({ page }) => {
    await page.locator(socket(CHAIN, "Clock tick", CHAIN_LABEL)).focus();
    await page.keyboard.press("Enter");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");

    await expect(page.locator(ANNOUNCER), "the aim is announced as one that cannot be made").toContainText(
        "cannot connect",
    );

    await page.keyboard.press("Enter");

    expect(await cableCount(page, CHAIN), "and no cable was added").toBe(1);
});

/**
 * An input holds one cable and no more, which is what makes a patch bay different from a list of edges.
 * The desk's first channel is already fed by the drums, so the bass is refused there — and the same bass,
 * offered to the next channel along, is taken. The rule is about the state of the socket rather than about
 * which socket it is.
 */
test("an input that already has a cable will not take a second", async ({ page }) => {
    await page.locator(socket(MIXER, "Bass out", MIXER_LABEL)).click();
    await page.locator(socket(MIXER, "Mixer channel one", MIXER_LABEL)).click();

    expect(await cableCount(page, MIXER), "the channel the drums are in stays as it was").toBe(2);

    await page.locator(socket(MIXER, "Bass out", MIXER_LABEL)).click();
    await page.locator(socket(MIXER, "Mixer channel two", MIXER_LABEL)).click();

    expect(await cableCount(page, MIXER), "and the free channel beside it takes the same cable").toBe(3);
});

/**
 * Unplugging, which has to be reachable or a wrong connection is permanent. Pressing an input that is
 * already carrying a cable takes it off rather than starting a second one.
 */
test("pressing a connected input unplugs it", async ({ page }) => {
    await page.locator(socket(CHAIN, "Gate in", CHAIN_LABEL)).focus();
    await page.keyboard.press("Enter");

    await expect(page.locator(ANNOUNCER), "the removal is announced").toContainText("unplugged");

    expect(await cableCount(page, CHAIN), "and the cable is gone").toBe(0);
});

/**
 * The pointer route without a drag, which is what 2.5.7 Dragging Movements asks for: "all functionality
 * that uses a dragging movement for operation can be achieved by a single pointer without dragging". A
 * click picks the cable up and a second click puts it down, so a person who cannot hold a button down
 * while moving can still wire the board.
 */
test("a cable can be wired with two clicks and no drag at all", async ({ page }) => {
    await page.locator(socket(CHAIN, "Clock tick", CHAIN_LABEL)).click();
    await page.locator(socket(CHAIN, "Lamp signal", CHAIN_LABEL)).click();

    expect(await cableCount(page, CHAIN), "the second click made the connection").toBe(2);
});

/**
 * The consumer's own rule, on top of the component's. The mixing desk's board refuses any cable into the
 * amplifier that is not coming from the desk, so a source aimed straight at the amp is declined even
 * though the sockets themselves are a perfectly good pair.
 */
test("the consumer's refusal is enforced beside the component's own", async ({ page }) => {
    await page.locator(socket(MIXER, "Bass out", MIXER_LABEL)).click();
    await page.locator(socket(MIXER, "Amp in", MIXER_LABEL)).click();

    expect(await cableCount(page, MIXER), "the amp took nothing from the bass").toBe(2);

    await page.locator(socket(MIXER, "Bass out", MIXER_LABEL)).click();
    await page.locator(socket(MIXER, "Mixer channel two", MIXER_LABEL)).click();

    expect(await cableCount(page, MIXER), "while the desk takes it happily").toBe(3);
});

/**
 * The drag itself, which is the gesture the whole thing looks like it is for. It is worth a test of its own
 * beside the tap route because the two take different paths through the component: a drag starts only once
 * the pointer has traveled far enough to mean it, and a socket is far too small to hold the pointer for
 * that distance — so the board rather than the socket is what follows the pointer once a drag begins.
 */
test("a cable is drawn by dragging from one socket to another", async ({ page }) => {
    const from = await page.locator(socket(CHAIN, "Clock tick", CHAIN_LABEL)).boundingBox();
    const to = await page.locator(socket(CHAIN, "Lamp signal", CHAIN_LABEL)).boundingBox();

    if (!from || !to) throw new Error("the board has no such socket");

    await page.mouse.move(from.x + from.width * 0.5, from.y + from.height * 0.5);
    await page.mouse.down();
    await page.mouse.move(to.x + to.width * 0.5, to.y + to.height * 0.5, { steps: 12 });
    await page.mouse.up();

    expect(await cableCount(page, CHAIN), "the drag left a cable behind it").toBe(2);
});

/**
 * And the same gesture on a box, which is the other thing a pointer can do here: the box follows the pointer
 * and the cable hanging off it follows the box.
 */
test("a box is moved by dragging it, and its cable comes along", async ({ page }) => {
    const target = socket(CHAIN, "Gate in", CHAIN_LABEL);
    const box = await page.locator(node(CHAIN, "Gate", CHAIN_LABEL)).boundingBox();

    if (!box) throw new Error("the board has no such node");

    await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.5 + 60, box.y + box.height * 0.5 - 40, { steps: 12 });
    await page.mouse.up();

    const moved = await page.locator(node(CHAIN, "Gate", CHAIN_LABEL)).boundingBox();
    const after = await centerOf(page, target);
    const [end] = await cableEnds(page, CHAIN, CHAIN_LABEL);

    expect(moved?.x ?? 0, "the box went where the pointer took it").toBeGreaterThan(box.x);
    expect(Math.hypot(end.x - after.x, end.y - after.y), "and the cable is still on the socket it was on").toBeLessThan(
        2,
    );
});

/**
 * Snapping, in the effects rack. The rack's board snaps every spot a node is aimed at to a grid, and the
 * page draws that grid as dots behind the board. Where the grid lies is read back from the page rather than
 * written here: the dots are one background tile apart, measured against the board's own width, and a node
 * is on the grid when its corner is a whole number of those tiles from the board's corner — to within a
 * twentieth of a tile, which absorbs the rounding of a scaled client rect and nothing more.
 */
const RACK = "rack";
const RACK_LABEL = "Effects rack";
const GRID_SLACK = 0.05;

const rackPlacement = (page: Page, label: string) =>
    page.evaluate(
        (args) => {
            const root = document.querySelector(args.boardSelector) as HTMLElement | null;
            const slot = document.querySelector(args.nodeSelector)?.closest('[role="group"]');

            if (!root || !slot || !root.parentElement) throw new Error("the rack has no such node");

            const board = root.getBoundingClientRect();
            const box = slot.getBoundingClientRect();
            const cell = parseFloat(getComputedStyle(root.parentElement).backgroundSize) / root.offsetWidth;
            const x = (box.left - board.left) / board.width;
            const y = (box.top - board.top) / board.width;

            return { x, y, cell, columns: x / cell, rows: y / cell };
        },
        { boardSelector: board(RACK, RACK_LABEL), nodeSelector: node(RACK, label, RACK_LABEL) },
    );

const isOnGrid = (count: number) => Math.abs(count - Math.round(count)) < GRID_SLACK;

/**
 * The drag is by an amount that is deliberately not a whole number of grid steps. The node is asked where it
 * is while the button is still down, because the snap is applied to every aim and not only to the drop, and
 * again once it is let go.
 */
test("a node dragged in the rack lands on the grid, and is shown on it during the drag", async ({ page }) => {
    await page.locator(demo(RACK)).scrollIntoViewIfNeeded();

    const before = await rackPlacement(page, "Reverb");
    const box = await page.locator(node(RACK, "Reverb", RACK_LABEL)).boundingBox();

    if (!box) throw new Error("the rack has no such node");

    await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.5 + 37, box.y + box.height * 0.5 + 23, { steps: 12 });

    const during = await rackPlacement(page, "Reverb");

    await page.mouse.up();

    const after = await rackPlacement(page, "Reverb");

    expect(during.x, "the node is following the pointer before it is let go").toBeGreaterThan(before.x);
    expect(isOnGrid(during.columns) && isOnGrid(during.rows), "and is on the grid while still being dragged").toBe(
        true,
    );
    expect(after.x, "the node went where the pointer took it").toBeGreaterThan(before.x);
    expect(after.y, "down as well as across").toBeGreaterThan(before.y);
    expect(isOnGrid(after.columns), "and came to rest on a grid column").toBe(true);
    expect(isOnGrid(after.rows), "and on a grid row").toBe(true);
});

/**
 * The keyboard step on this board is smaller than a grid step, so a step that was simply snapped would snap
 * straight back to where it began and the key would do nothing. Instead an arrow goes to the next grid spot
 * along, which is exactly one grid step, and nothing moves on the other axis.
 */
test("an arrow key takes a node in the rack to the next grid spot", async ({ page }) => {
    const before = await rackPlacement(page, "Reverb");

    await page.locator(node(RACK, "Reverb", RACK_LABEL)).focus();
    await page.keyboard.press("Enter");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("Enter");

    const across = await rackPlacement(page, "Reverb");

    expect(across.columns - before.columns, "one grid step across").toBeCloseTo(1, 1);
    expect(across.rows, "and no step up or down").toBeCloseTo(before.rows, 1);

    await page.keyboard.press("Enter");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");

    const down = await rackPlacement(page, "Reverb");

    expect(down.rows - across.rows, "one grid step down").toBeCloseTo(1, 1);
    expect(down.columns, "and no step across").toBeCloseTo(across.columns, 1);
});

/**
 * The rack refuses a cable that would close a loop. Its chain already runs input, filter, delay, reverb, so a
 * cable from the reverb back into the delay's feedback would feed the reverb its own signal, and the board
 * declines it. The same feedback socket takes a cable from the input, which closes nothing — so the refusal
 * is about the loop, not about the socket.
 */
test("a cable that would close a loop is refused, and the same socket takes one that would not", async ({ page }) => {
    expect(await cableCount(page, RACK), "three cables in the chain to start with").toBe(3);

    await page.locator(socket(RACK, "Reverb out", RACK_LABEL)).click();
    await page.locator(socket(RACK, "Delay feedback", RACK_LABEL)).click();

    expect(await cableCount(page, RACK), "the reverb was not let back into the delay").toBe(3);

    await page.locator(socket(RACK, "Input out", RACK_LABEL)).click();
    await page.locator(socket(RACK, "Delay feedback", RACK_LABEL)).click();

    expect(await cableCount(page, RACK), "while the input, which is upstream of nothing, is taken").toBe(4);
});

/**
 * From the keyboard the refusal is heard before it is tried: once a cable from the reverb is aimed at the
 * delay's feedback socket, the aim is announced as one that cannot connect. The sockets are stepped through
 * in turn until the feedback socket is the one aimed at.
 */
test("a cable aimed at a socket that would close a loop is announced as refused", async ({ page }) => {
    await page.locator(socket(RACK, "Reverb out", RACK_LABEL)).focus();
    await page.keyboard.press("Enter");

    await expect(async () => {
        await page.keyboard.press("ArrowRight");
        await expect(page.locator(ANNOUNCER)).toContainText("Delay feedback", { timeout: 200 });
    }, "the feedback socket can be reached by stepping").toPass({ timeout: 5_000 });

    await expect(page.locator(ANNOUNCER), "and the aim there is refused").toContainText(
        "Delay feedback, cannot connect",
    );

    await page.keyboard.press("Enter");

    expect(await cableCount(page, RACK), "so dropping it there adds no cable").toBe(3);
});

/**
 * Zoom. The zoomed board is scaled by a CSS transform on an element around it, and the board takes no scale
 * prop — it converts the pointer against its own measured box, which already includes the transform. So after
 * zooming in, a node dragged by some distance moves by that same distance on screen, and its cable still
 * meets its socket.
 */
const ZOOM = "zoom";
const ZOOM_LABEL = "Zoomed chain";

const zoomIn = async (page: Page) => {
    const root = page.locator(board(ZOOM, ZOOM_LABEL));

    await page.locator(demo(ZOOM)).scrollIntoViewIfNeeded();

    const before = await root.boundingBox();

    await page.locator("#patchBoardZoomIn").click();
    await waitUntilStill(root);

    const after = await root.boundingBox();

    expect(after?.width ?? 0, "the board is drawn larger after zooming in").toBeGreaterThan(before?.width ?? 0);
};

test("after zooming in, a dragged node lands under the pointer and its cable stays on its socket", async ({ page }) => {
    await zoomIn(page);

    const target = socket(ZOOM, "Gate in", ZOOM_LABEL);
    const box = await page.locator(node(ZOOM, "Gate", ZOOM_LABEL)).boundingBox();

    if (!box) throw new Error("the board has no such node");

    const dx = 50;
    const dy = -30;

    await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.5 + dx, box.y + box.height * 0.5 + dy, { steps: 12 });
    await page.mouse.up();

    const moved = await page.locator(node(ZOOM, "Gate", ZOOM_LABEL)).boundingBox();
    const after = await centerOf(page, target);
    const [end] = await cableEnds(page, ZOOM, ZOOM_LABEL);

    expect(Math.abs((moved?.x ?? 0) - box.x - dx), "the node moved across as far as the pointer did").toBeLessThan(2);
    expect(Math.abs((moved?.y ?? 0) - box.y - dy), "and up as far as the pointer did").toBeLessThan(2);
    expect(Math.hypot(end.x - after.x, end.y - after.y), "and the cable is still on the socket it was on").toBeLessThan(
        2,
    );
});

/**
 * Wiring goes through the same conversion, so a cable dragged from one socket to another on the zoomed board
 * connects them, and its far end is drawn on the socket it was dropped in.
 */
test("after zooming in, a cable dragged between sockets connects them and meets the socket", async ({ page }) => {
    await zoomIn(page);

    const from = await centerOf(page, socket(ZOOM, "Clock tick", ZOOM_LABEL));
    const to = await centerOf(page, socket(ZOOM, "Lamp signal", ZOOM_LABEL));

    await page.mouse.move(from.x, from.y);
    await page.mouse.down();
    await page.mouse.move(to.x, to.y, { steps: 12 });
    await page.mouse.up();

    expect(await cableCount(page, ZOOM), "the drag left a second cable").toBe(2);

    const ends = await cableEnds(page, ZOOM, ZOOM_LABEL);

    expect(
        Math.min(...ends.map((end) => Math.hypot(end.x - to.x, end.y - to.y))),
        "and one cable ends on the lamp's socket",
    ).toBeLessThan(2);
});

/**
 * Pan. The panned board is wider than the window it sits in, and the window scrolls. Carrying a node with the
 * keyboard does not move focus, so the browser would not scroll on its own; the board keeps the carried node
 * in view instead. The mic starts at the left edge and is carried right until it is well past where the
 * window ends — and the window has followed it.
 */
const PAN = "pan";
const PAN_LABEL = "Recording chain";

const panView = (page: Page, label: string) =>
    page.evaluate(
        (args) => {
            const root = document.querySelector(args.boardSelector);
            const slot = document.querySelector(args.nodeSelector)?.closest('[role="group"]');

            let scroller = root?.parentElement ?? null;

            while (scroller && getComputedStyle(scroller).overflowX !== "auto") scroller = scroller.parentElement;

            if (!scroller || !slot) throw new Error("the panned board has no scrolling window");

            const view = scroller.getBoundingClientRect();
            const box = slot.getBoundingClientRect();

            return {
                scrollLeft: scroller.scrollLeft,
                isInView:
                    box.left >= view.left - 1 &&
                    box.right <= view.right + 1 &&
                    box.top >= view.top - 1 &&
                    box.bottom <= view.bottom + 1,
            };
        },
        { boardSelector: board(PAN, PAN_LABEL), nodeSelector: node(PAN, label, PAN_LABEL) },
    );

test("a node carried with the keyboard past the edge of the window brings the window with it", async ({ page }) => {
    await page.locator(demo(PAN)).scrollIntoViewIfNeeded();

    const before = await panView(page, "Mic");

    expect(before.scrollLeft, "the window starts at the left edge").toBe(0);
    expect(before.isInView, "with the mic in view").toBe(true);

    await page.locator(node(PAN, "Mic", PAN_LABEL)).focus();
    await page.keyboard.press("Enter");

    for (let press = 0; press < 15; press++) await page.keyboard.press("Shift+ArrowRight");

    await waitUntilStill(page.locator(node(PAN, "Mic", PAN_LABEL)));

    const carried = await panView(page, "Mic");

    expect(carried.scrollLeft, "the window has scrolled to follow").toBeGreaterThan(0);
    expect(carried.isInView, "and the carried mic is still inside it").toBe(true);

    await page.keyboard.press("Enter");
    await waitUntilStill(page.locator(node(PAN, "Mic", PAN_LABEL)));

    expect((await panView(page, "Mic")).isInView, "where it stays once it is dropped").toBe(true);
});
