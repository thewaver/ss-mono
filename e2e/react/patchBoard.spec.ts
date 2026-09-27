import { type Page, expect, test } from "@playwright/test";

import { waitUntilStill } from "../helpers";

/**
 * The React `PatchBoard`, over the React `Carrier` hooks and the board core it shares with the Solid one. The cases
 * follow `e2e/patchBoard.spec.ts`: a cable stays on its socket as its node moves, a cable is made by keyboard, by two
 * clicks and by a drag, the board's own refusals and the consumer's are both kept, a connected input unplugs, the
 * rack snaps to its grid and refuses a loop, a zoomed board still lands under the pointer, and a panned board keeps a
 * keyboard-carried node in view. Each board sits in a box keyed by `data-testid` in place of the Playground's example
 * keys, and its readout counts the cables.
 */
const STORY = "Exotics/PatchBoard";

const scope = (key: string) => `[data-testid="${key}"]`;
const board = (key: string, label: string) => `${scope(key)} [role="group"][aria-label="${label}"]`;
const node = (key: string, label: string, boardLabel: string) =>
    `${board(key, boardLabel)} [role="button"][aria-label="${label}"]`;

/**
 * A socket's accessible name ends by saying whether it is connected, which several of these cases are about to
 * change, so a socket is found by the beginning of that name.
 */
const socket = (key: string, label: string, boardLabel: string) =>
    `${board(key, boardLabel)} [role="button"][aria-label^="${label},"]`;

const ANNOUNCER = 'body > [role="log"][aria-live="polite"]';

const CHAIN = "chain";
const CHAIN_LABEL = "Signal chain";
const MIXER = "mixer";
const MIXER_LABEL = "Mixing desk";
const RACK = "rack";
const RACK_LABEL = "Effects rack";
const ZOOM = "zoom";
const ZOOM_LABEL = "Zoomed chain";
const PAN = "pan";
const PAN_LABEL = "Recording chain";

/** The story's grid, as a fraction of the board's width: thirty-two columns across. */
const GRID_CELL = 1 / 32;
const GRID_SLACK = 0.05;

const readout = (page: Page, key: string) =>
    page
        .locator(`${scope(key)} [data-readout="board"]`)
        .textContent()
        .then((text) => text ?? "");

const cableCount = async (page: Page, key: string) => {
    const found = /(\d+) cables/.exec(await readout(page, key));

    return found ? Number(found[1]) : -1;
};

/** Where each cable actually ends on screen: the path's far end through its own screen matrix. */
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

const drag = async (page: Page, from: { x: number; y: number }, to: { x: number; y: number }) => {
    await page.mouse.move(from.x, from.y);
    await page.mouse.down();
    await page.mouse.move(to.x, to.y, { steps: 12 });
    await page.mouse.up();
};

test.describe("the chain and the desk", () => {
    test.beforeEach(async ({ page, mount }) => {
        await mount(`${STORY}/Default`);
        await expect(page.locator(board(CHAIN, CHAIN_LABEL))).toBeVisible();
    });

    test("a cable stays on its socket while the node it hangs off is moved", async ({ page }) => {
        const target = socket(CHAIN, "Gate in", CHAIN_LABEL);
        const before = await centerOf(page, target);
        const [endBefore] = await cableEnds(page, CHAIN, CHAIN_LABEL);

        expect(
            Math.hypot(endBefore.x - before.x, endBefore.y - before.y),
            "the cable starts on the socket",
        ).toBeLessThan(2);

        await page.locator(node(CHAIN, "Gate", CHAIN_LABEL)).focus();
        await page.keyboard.press("Enter");
        await page.keyboard.press("ArrowDown");
        await page.keyboard.press("ArrowDown");
        await page.keyboard.press("Enter");

        const after = await centerOf(page, target);
        const [endAfter] = await cableEnds(page, CHAIN, CHAIN_LABEL);

        expect(after.y, "the gate has moved down the board").toBeGreaterThan(before.y);
        expect(Math.hypot(endAfter.x - after.x, endAfter.y - after.y), "and the cable is still on it").toBeLessThan(2);
    });

    test("a cable can be taken from one socket and dropped in another without a pointer", async ({ page }) => {
        expect(await cableCount(page, CHAIN), "one cable to start with").toBe(1);

        await page.locator(socket(CHAIN, "Clock tick", CHAIN_LABEL)).focus();
        await page.keyboard.press("Enter");

        await expect(page.locator(ANNOUNCER), "picking it up says where it came from").toContainText("Clock tick");

        for (let step = 0; step < 4; step++) await page.keyboard.press("ArrowRight");

        await page.keyboard.press("Enter");

        expect(await cableCount(page, CHAIN), "and the board has a second cable").toBe(2);
        expect(await readout(page, CHAIN), "which runs from the clock to the lamp").toContain(
            "connected clock tick to lamp sig",
        );
    });

    test("a socket that cannot take the cable says so, and refuses the drop", async ({ page }) => {
        await page.locator(socket(CHAIN, "Clock tick", CHAIN_LABEL)).focus();
        await page.keyboard.press("Enter");
        await page.keyboard.press("ArrowRight");
        await page.keyboard.press("ArrowRight");

        await expect(page.locator(ANNOUNCER), "the aim is announced as refused").toContainText("cannot connect");

        await page.keyboard.press("Enter");

        expect(await cableCount(page, CHAIN), "and no cable was added").toBe(1);
    });

    test("an input that already has a cable will not take a second", async ({ page }) => {
        await page.locator(socket(MIXER, "Bass out", MIXER_LABEL)).click();
        await page.locator(socket(MIXER, "Mixer channel one", MIXER_LABEL)).click();

        expect(await cableCount(page, MIXER), "the channel the drums are in stays as it was").toBe(2);

        await page.locator(socket(MIXER, "Bass out", MIXER_LABEL)).click();
        await page.locator(socket(MIXER, "Mixer channel two", MIXER_LABEL)).click();

        expect(await cableCount(page, MIXER), "and the free channel beside it takes the same cable").toBe(3);
    });

    test("pressing a connected input unplugs it", async ({ page }) => {
        await page.locator(socket(CHAIN, "Gate in", CHAIN_LABEL)).focus();
        await page.keyboard.press("Enter");

        await expect(page.locator(ANNOUNCER), "the removal is announced").toContainText("unplugged");

        expect(await cableCount(page, CHAIN), "and the cable is gone").toBe(0);
    });

    test("a cable can be wired with two clicks and no drag at all", async ({ page }) => {
        await page.locator(socket(CHAIN, "Clock tick", CHAIN_LABEL)).click();
        await page.locator(socket(CHAIN, "Lamp signal", CHAIN_LABEL)).click();

        expect(await cableCount(page, CHAIN), "the second click made the connection").toBe(2);
    });

    test("the consumer's refusal is enforced beside the component's own", async ({ page }) => {
        await page.locator(socket(MIXER, "Bass out", MIXER_LABEL)).click();
        await page.locator(socket(MIXER, "Amp in", MIXER_LABEL)).click();

        expect(await cableCount(page, MIXER), "the amp took nothing from the bass").toBe(2);

        await page.locator(socket(MIXER, "Bass out", MIXER_LABEL)).click();
        await page.locator(socket(MIXER, "Mixer channel two", MIXER_LABEL)).click();

        expect(await cableCount(page, MIXER), "while the desk takes it happily").toBe(3);
    });

    test("a cable is drawn by dragging from one socket to another", async ({ page }) => {
        const from = await centerOf(page, socket(CHAIN, "Clock tick", CHAIN_LABEL));
        const to = await centerOf(page, socket(CHAIN, "Lamp signal", CHAIN_LABEL));

        await drag(page, from, to);

        expect(await cableCount(page, CHAIN), "the drag left a cable behind it").toBe(2);
    });

    test("a box is moved by dragging it, and its cable comes along", async ({ page }) => {
        const target = socket(CHAIN, "Gate in", CHAIN_LABEL);
        const box = await page.locator(node(CHAIN, "Gate", CHAIN_LABEL)).boundingBox();

        if (!box) throw new Error("the board has no such node");

        const middle = { x: box.x + box.width * 0.5, y: box.y + box.height * 0.5 };

        await drag(page, middle, { x: middle.x + 60, y: middle.y - 40 });

        const moved = await page.locator(node(CHAIN, "Gate", CHAIN_LABEL)).boundingBox();
        const after = await centerOf(page, target);
        const [end] = await cableEnds(page, CHAIN, CHAIN_LABEL);

        expect(moved?.x ?? 0, "the box went where the pointer took it").toBeGreaterThan(box.x);
        expect(Math.hypot(end.x - after.x, end.y - after.y), "and the cable is still on its socket").toBeLessThan(2);
    });
});

test.describe("a board that answers to nothing", () => {
    test("a disabled board neither picks up a node nor wires a cable", async ({ page, mount }) => {
        await mount(`${STORY}/Disabled`);

        await page.locator(socket("disabled", "Clock tick", "Disabled chain")).click({ force: true });
        await page.locator(socket("disabled", "Lamp signal", "Disabled chain")).click({ force: true });

        expect(await cableCount(page, "disabled"), "no cable was made").toBe(1);

        await page.locator(node("disabled", "Gate", "Disabled chain")).focus();
        await page.keyboard.press("Enter");

        await expect(page.locator(`${ANNOUNCER} > *`), "and nothing was ever picked up").toHaveCount(0);
    });

    test("a locked board keeps its wiring but still lets a node move", async ({ page, mount }) => {
        await mount(`${STORY}/Locked`);

        await page.locator(socket("locked", "Gate in", "Locked chain")).focus();
        await page.keyboard.press("Enter");

        expect(await cableCount(page, "locked"), "the connected input did not unplug").toBe(1);

        await page.locator(node("locked", "Gate", "Locked chain")).focus();
        await page.keyboard.press("Enter");
        await page.keyboard.press("ArrowDown");
        await page.keyboard.press("Enter");

        expect(await readout(page, "locked"), "while the gate still moved").toContain("moved gate");
    });
});

const rackPlacement = (page: Page, label: string) =>
    page.evaluate(
        (args) => {
            const root = document.querySelector(args.boardSelector);
            const slot = document.querySelector(args.nodeSelector)?.closest('[role="group"]');

            if (!root || !slot) throw new Error("the rack has no such node");

            const box = root.getBoundingClientRect();
            const placed = slot.getBoundingClientRect();
            const x = (placed.left - box.left) / box.width;
            const y = (placed.top - box.top) / box.width;

            return { x, y, columns: x / args.cell, rows: y / args.cell };
        },
        { boardSelector: board(RACK, RACK_LABEL), nodeSelector: node(RACK, label, RACK_LABEL), cell: GRID_CELL },
    );

const isOnGrid = (count: number) => Math.abs(count - Math.round(count)) < GRID_SLACK;

test.describe("the rack", () => {
    test.beforeEach(async ({ page, mount }) => {
        await mount(`${STORY}/Rack`);
        await expect(page.locator(board(RACK, RACK_LABEL))).toBeVisible();
    });

    test("a node dragged in the rack lands on the grid, and is shown on it during the drag", async ({ page }) => {
        const before = await rackPlacement(page, "Reverb");
        const box = await page.locator(node(RACK, "Reverb", RACK_LABEL)).boundingBox();

        if (!box) throw new Error("the rack has no such node");

        await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5);
        await page.mouse.down();
        await page.mouse.move(box.x + box.width * 0.5 + 37, box.y + box.height * 0.5 + 23, { steps: 12 });

        const during = await rackPlacement(page, "Reverb");

        await page.mouse.up();

        const after = await rackPlacement(page, "Reverb");

        expect(during.x, "the node follows the pointer before it is let go").toBeGreaterThan(before.x);
        expect(isOnGrid(during.columns) && isOnGrid(during.rows), "and is on the grid while dragged").toBe(true);
        expect(after.x, "it went across").toBeGreaterThan(before.x);
        expect(after.y, "and down").toBeGreaterThan(before.y);
        expect(isOnGrid(after.columns), "and came to rest on a grid column").toBe(true);
        expect(isOnGrid(after.rows), "and on a grid row").toBe(true);
    });

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

    test("a cable that would close a loop is refused, and the same socket takes one that would not", async ({
        page,
    }) => {
        expect(await cableCount(page, RACK), "three cables in the chain to start with").toBe(3);

        await page.locator(socket(RACK, "Reverb out", RACK_LABEL)).click();
        await page.locator(socket(RACK, "Delay feedback", RACK_LABEL)).click();

        expect(await cableCount(page, RACK), "the reverb was not let back into the delay").toBe(3);

        await page.locator(socket(RACK, "Input out", RACK_LABEL)).click();
        await page.locator(socket(RACK, "Delay feedback", RACK_LABEL)).click();

        expect(await cableCount(page, RACK), "while the input is taken").toBe(4);
    });

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
});

test.describe("the zoomed board", () => {
    test.beforeEach(async ({ page, mount }) => {
        await mount(`${STORY}/Zoom`);

        const root = page.locator(board(ZOOM, ZOOM_LABEL));
        const before = await root.boundingBox();

        await page.locator("#patchBoardZoomIn").click();
        await waitUntilStill(root);

        expect((await root.boundingBox())?.width ?? 0, "the board is drawn larger").toBeGreaterThan(before?.width ?? 0);
    });

    test("after zooming in, a dragged node lands under the pointer and its cable stays on its socket", async ({
        page,
    }) => {
        const target = socket(ZOOM, "Gate in", ZOOM_LABEL);
        const box = await page.locator(node(ZOOM, "Gate", ZOOM_LABEL)).boundingBox();

        if (!box) throw new Error("the board has no such node");

        const dx = 50;
        const dy = -30;
        const middle = { x: box.x + box.width * 0.5, y: box.y + box.height * 0.5 };

        await drag(page, middle, { x: middle.x + dx, y: middle.y + dy });

        const moved = await page.locator(node(ZOOM, "Gate", ZOOM_LABEL)).boundingBox();
        const after = await centerOf(page, target);
        const [end] = await cableEnds(page, ZOOM, ZOOM_LABEL);

        expect(Math.abs((moved?.x ?? 0) - box.x - dx), "across as far as the pointer went").toBeLessThan(2);
        expect(Math.abs((moved?.y ?? 0) - box.y - dy), "and up as far as the pointer went").toBeLessThan(2);
        expect(Math.hypot(end.x - after.x, end.y - after.y), "and the cable is still on its socket").toBeLessThan(2);
    });

    test("after zooming in, a cable dragged between sockets connects them and meets the socket", async ({ page }) => {
        const from = await centerOf(page, socket(ZOOM, "Clock tick", ZOOM_LABEL));
        const to = await centerOf(page, socket(ZOOM, "Lamp signal", ZOOM_LABEL));

        await drag(page, from, to);

        expect(await cableCount(page, ZOOM), "the drag left a second cable").toBe(2);

        const ends = await cableEnds(page, ZOOM, ZOOM_LABEL);

        expect(
            Math.min(...ends.map((end) => Math.hypot(end.x - to.x, end.y - to.y))),
            "and one cable ends on the lamp's socket",
        ).toBeLessThan(2);
    });
});

const panView = (page: Page, label: string) =>
    page.evaluate(
        (args) => {
            const scroller = document.querySelector(args.windowSelector);
            const slot = document.querySelector(args.nodeSelector)?.closest('[role="group"]');

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
        { windowSelector: `${scope(PAN)} [data-pan-window]`, nodeSelector: node(PAN, label, PAN_LABEL) },
    );

test("a node carried with the keyboard past the edge of the window brings the window with it", async ({
    page,
    mount,
}) => {
    await mount(`${STORY}/Pan`);

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
