import { type Page, expect, test } from "@playwright/test";

import { demo, readout } from "./helpers";

const board = (key: string, label: string) => `${demo(key)} [role="list"][aria-label="${label}"]`;

const node = (key: string, label: string, boardLabel: string) =>
    `${board(key, boardLabel)} [role="listitem"][aria-label="${label}"]`;

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

const centreOf = (page: Page, selector: string) =>
    page.evaluate((value) => {
        const box = document.querySelector(value)?.getBoundingClientRect();

        if (!box) throw new Error("no such socket");

        return { x: box.left + box.width / 2, y: box.top + box.height / 2 };
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

    const before = await centreOf(page, target);
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

    const after = await centreOf(page, target);
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
 * the pointer has travelled far enough to mean it, and a socket is far too small to hold the pointer for
 * that distance — so the board rather than the socket is what follows the pointer once a drag begins.
 */
test("a cable is drawn by dragging from one socket to another", async ({ page }) => {
    const from = await page.locator(socket(CHAIN, "Clock tick", CHAIN_LABEL)).boundingBox();
    const to = await page.locator(socket(CHAIN, "Lamp signal", CHAIN_LABEL)).boundingBox();

    if (!from || !to) throw new Error("the board has no such socket");

    await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
    await page.mouse.down();
    await page.mouse.move(to.x + to.width / 2, to.y + to.height / 2, { steps: 12 });
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

    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2 + 60, box.y + box.height / 2 - 40, { steps: 12 });
    await page.mouse.up();

    const moved = await page.locator(node(CHAIN, "Gate", CHAIN_LABEL)).boundingBox();
    const after = await centreOf(page, target);
    const [end] = await cableEnds(page, CHAIN, CHAIN_LABEL);

    expect(moved?.x ?? 0, "the box went where the pointer took it").toBeGreaterThan(box.x);
    expect(Math.hypot(end.x - after.x, end.y - after.y), "and the cable is still on the socket it was on").toBeLessThan(
        2,
    );
});
