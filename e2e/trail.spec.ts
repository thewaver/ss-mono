import { type Page, expect, test } from "@playwright/test";

import { readout } from "./helpers";

const MARKER = "#timelineMarker";
const VEHICLE = "#circuitVehicle";
const SCRUBBER = "#timelineScrubber";
const PLAY = "#circuitPlay";
const PAUSE = "#circuitPause";
const REWIND = "#circuitRewind";

const A_FEW_FRAMES_MS = 400;

/**
 * The travelling element carries no role and no name of its own — it is whatever the consumer draws — so
 * the Playground gives the two demo travellers an id, which is the same handle every other driven control
 * on a page carries. What is read back is where it ended up, measured in the same pass as something else
 * on the page, never a pixel count: the Playground runs inside a `Viewport`, so a client rect is the layout
 * value times a scale that depends on the size of this window.
 */
const centreOf = (page: Page, selector: string) =>
    page.evaluate((value) => {
        const box = document.querySelector(value)?.getBoundingClientRect();

        if (!box) throw new Error("nothing is travelling");

        return { x: box.left + box.width / 2, y: box.top + box.height / 2 };
    }, selector);

/**
 * How far the traveller is from the path it is supposed to be on, in the same client space as the path
 * itself: every point along the curve is put through the element's own screen matrix and the nearest one to
 * the traveller's centre wins. Asking for the nearest point rather than the point at the reported progress
 * keeps the reading independent of the percentage the page rounds for its readout.
 */
const distanceFromPath = (page: Page, travellerSelector: string) =>
    page.evaluate((selector) => {
        const traveller = document.querySelector(selector);
        const root = traveller?.parentElement?.parentElement;
        const path = root?.querySelector("svg path");

        if (!traveller || !path) throw new Error("nothing is travelling");

        const box = traveller.getBoundingClientRect();
        const centre = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
        const matrix = (path as SVGPathElement).getScreenCTM();
        const length = (path as SVGPathElement).getTotalLength();

        if (!matrix) throw new Error("the path is not on screen");

        let nearest = Infinity;

        for (let at = 0; at <= length; at += 1) {
            const point = (path as SVGPathElement).getPointAtLength(at);
            const client = {
                x: point.x * matrix.a + point.y * matrix.c + matrix.e,
                y: point.x * matrix.b + point.y * matrix.d + matrix.f,
            };

            nearest = Math.min(nearest, Math.hypot(client.x - centre.x, client.y - centre.y));
        }

        return nearest;
    }, travellerSelector);

const progressOf = async (page: Page, key: string) => {
    const found = /(\d+)%/.exec(await readout(page, key));

    return found ? Number(found[1]) : -1;
};

test.beforeEach(async ({ page }) => {
    await page.goto("/trail");
    await expect(page.locator("[data-example]").first()).toBeVisible();
});

/**
 * The whole of the second demo is that nothing is running and the slider is what places the marker. The
 * path it follows climbs and falls, but it travels left to right overall, so three readings taken at the
 * start, the middle and the end have to come back in that order across the box.
 */
test("the slider is what puts the marker on the path", async ({ page }) => {
    await page.locator(SCRUBBER).focus();
    await page.keyboard.press("Home");

    const start = await centreOf(page, MARKER);

    expect(await progressOf(page, "timeline"), "Home is the beginning of the path").toBe(0);

    await page.keyboard.press("End");

    const end = await centreOf(page, MARKER);

    expect(await progressOf(page, "timeline"), "End is the far end of it").toBe(100);
    expect(end.x, "and the far end of this path is further across the box than the near end").toBeGreaterThan(start.x);
});

/**
 * A step of the slider is a step along the path, which is the thing a consumer wiring a scrubber is
 * relying on. One arrow press is one percent, and the marker has to have moved for it.
 */
test("one step of the slider moves the marker", async ({ page }) => {
    await page.locator(SCRUBBER).focus();
    await page.keyboard.press("Home");

    const before = await centreOf(page, MARKER);

    await page.keyboard.press("ArrowRight");

    const after = await centreOf(page, MARKER);

    expect(await progressOf(page, "timeline"), "the slider says one percent along").toBe(1);
    expect(
        Math.hypot(after.x - before.x, after.y - before.y),
        "and the marker is somewhere else than it was",
    ).toBeGreaterThan(0);
});

/**
 * Pause has to actually stop the frames rather than hide them: the reading is taken, several frames are
 * waited out, and the reading has to be the same one. This is also the mechanism 2.2.2 Pause, Stop, Hide
 * asks for — "for any moving, blinking or scrolling information that starts automatically… there is a
 * mechanism for the user to pause, stop, or hide it" — and the circuit is moving information that starts
 * on its own, so the page has to offer the control and it has to work.
 */
test("pause stops the travelling, and play starts it again", async ({ page }) => {
    await page.locator(PAUSE).click();

    const stopped = await progressOf(page, "circuit");

    await page.waitForTimeout(A_FEW_FRAMES_MS);

    expect(await progressOf(page, "circuit"), "nothing moves while it is paused").toBe(stopped);

    await page.locator(PLAY).click();
    await expect
        .poll(() => progressOf(page, "circuit"), { message: "and it carries on from where it stopped" })
        .toBeGreaterThan(stopped);
});

/**
 * Seeking is the third thing the controller offers, and the one a rewind button is: the position is set
 * outright rather than travelled to. It is pressed while the trail is paused so that what is read back is
 * the seek rather than the next frame.
 */
test("the controller can send it back to the start", async ({ page }) => {
    await expect.poll(() => progressOf(page, "circuit"), { message: "it sets off on its own" }).toBeGreaterThan(0);

    await page.locator(PAUSE).click();
    await page.locator(REWIND).click();

    expect(await progressOf(page, "circuit"), "and the rewind puts it back at the beginning").toBe(0);
});

/**
 * The readout is the page's arithmetic; this is the element itself. The traveller is parked at the start,
 * let go, and stopped again, and the two positions are compared with each other rather than with a
 * coordinate — which is what makes the assertion true at any scale.
 */
test("the traveller leaves the point it set off from", async ({ page }) => {
    await page.locator(PAUSE).click();
    await page.locator(REWIND).click();

    const start = await centreOf(page, VEHICLE);

    await page.locator(PLAY).click();
    await expect.poll(() => progressOf(page, "circuit")).toBeGreaterThan(0);
    await page.locator(PAUSE).click();

    const moved = await centreOf(page, VEHICLE);

    expect(Math.hypot(moved.x - start.x, moved.y - start.y), "it has left the starting point").toBeGreaterThan(0);
});

/**
 * The thing the whole component promises, and the one that broke: the traveller has to be **on** the path at
 * every point of it, including the corners. It is worth its own test because turning the traveller to face
 * along the path and placing its centre on the path are two transforms fighting over the same element — with
 * them in the wrong order the box swings off the curve wherever the direction is not straight, which is
 * invisible on a straight run and worst on a bend. The vehicle is oblong on purpose: a round one would sit
 * still under the same fault.
 */
test("the traveller stays on the path all the way round, at every angle", async ({ page }) => {
    const SAMPLES = 5;
    const A_SIXTH_OF_A_LAP_MS = 900;

    for (let sample = 0; sample < SAMPLES; sample += 1) {
        await page.locator(PAUSE).click();

        expect(
            await distanceFromPath(page, VEHICLE),
            `the traveller is on the curve at ${await progressOf(page, "circuit")}% round`,
        ).toBeLessThan(2);

        await page.locator(PLAY).click();
        await page.waitForTimeout(A_SIXTH_OF_A_LAP_MS);
    }
});
