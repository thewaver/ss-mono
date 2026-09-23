import { type Page, expect, test } from "@playwright/test";

import { example, prop, readout } from "./helpers";

const MARKER = "#timelineMarker";
const VEHICLE = "#circuitVehicle";
const SCRUBBER = "#timelineScrubber";
const PLAY = "#circuitPlay";
const PAUSE = "#circuitPause";
const REWIND = "#circuitRewind";

const A_FEW_FRAMES_MS = 400;

/**
 * The traveling element carries no role and no name of its own — it is whatever the consumer draws — so
 * the Playground gives the two demo travelers an id, which is the same handle every other driven control
 * on a page carries. What is read back is where it ended up, measured in the same pass as something else
 * on the page, never a pixel count: the Playground runs inside a `Viewport`, so a client rect is the layout
 * value times a scale that depends on the size of this window.
 */
const centerOf = (page: Page, selector: string) =>
    page.evaluate((value) => {
        const box = document.querySelector(value)?.getBoundingClientRect();

        if (!box) throw new Error("nothing is traveling");

        return { x: box.left + box.width * 0.5, y: box.top + box.height * 0.5 };
    }, selector);

/**
 * How far the traveler is from the path it is supposed to be on, in the same client space as the path
 * itself: every point along the curve is put through the element's own screen matrix and the nearest one to
 * the traveler's center wins. Asking for the nearest point rather than the point at the reported progress
 * keeps the reading independent of the percentage the page rounds for its readout.
 */
const distanceFromPath = (page: Page, travelerSelector: string) =>
    page.evaluate((selector) => {
        const traveler = document.querySelector(selector);
        const root = traveler?.parentElement?.parentElement;
        const path = root?.querySelector("svg path");

        if (!traveler || !path) throw new Error("nothing is traveling");

        const box = traveler.getBoundingClientRect();
        const center = { x: box.x + box.width * 0.5, y: box.y + box.height * 0.5 };
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

            nearest = Math.min(nearest, Math.hypot(client.x - center.x, client.y - center.y));
        }

        return nearest;
    }, travelerSelector);

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

    const start = await centerOf(page, MARKER);

    expect(await progressOf(page, "timeline"), "Home is the beginning of the path").toBe(0);

    await page.keyboard.press("End");

    const end = await centerOf(page, MARKER);

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

    const before = await centerOf(page, MARKER);

    await page.keyboard.press("ArrowRight");

    const after = await centerOf(page, MARKER);

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
test("pause stops the traveling, and play starts it again", async ({ page }) => {
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
 * outright rather than traveled to. It is pressed while the trail is paused so that what is read back is
 * the seek rather than the next frame.
 */
test("the controller can send it back to the start", async ({ page }) => {
    await expect.poll(() => progressOf(page, "circuit"), { message: "it sets off on its own" }).toBeGreaterThan(0);

    await page.locator(PAUSE).click();
    await page.locator(REWIND).click();

    expect(await progressOf(page, "circuit"), "and the rewind puts it back at the beginning").toBe(0);
});

/**
 * The readout is the page's arithmetic; this is the element itself. The traveler is parked at the start,
 * let go, and stopped again, and the two positions are compared with each other rather than with a
 * coordinate — which is what makes the assertion true at any scale.
 */
test("the traveler leaves the point it set off from", async ({ page }) => {
    await page.locator(PAUSE).click();
    await page.locator(REWIND).click();

    const start = await centerOf(page, VEHICLE);

    await page.locator(PLAY).click();
    await expect.poll(() => progressOf(page, "circuit")).toBeGreaterThan(0);
    await page.locator(PAUSE).click();

    const moved = await centerOf(page, VEHICLE);

    expect(Math.hypot(moved.x - start.x, moved.y - start.y), "it has left the starting point").toBeGreaterThan(0);
});

/**
 * The thing the whole component promises, and the one that broke: the traveler has to be **on** the path at
 * every point of it, including the corners. It is worth its own test because turning the traveler to face
 * along the path and placing its center on the path are two transforms fighting over the same element — with
 * them in the wrong order the box swings off the curve wherever the direction is not straight, which is
 * invisible on a straight run and worst on a bend. The vehicle is oblong on purpose: a round one would sit
 * still under the same fault.
 */
test("the traveler stays on the path all the way round, at every angle", async ({ page }) => {
    const SAMPLES = 5;
    const A_SIXTH_OF_A_LAP_MS = 900;

    for (let sample = 0; sample < SAMPLES; sample += 1) {
        await page.locator(PAUSE).click();

        expect(
            await distanceFromPath(page, VEHICLE),
            `the traveler is on the curve at ${await progressOf(page, "circuit")}% round`,
        ).toBeLessThan(2);

        await page.locator(PLAY).click();
        await page.waitForTimeout(A_SIXTH_OF_A_LAP_MS);
    }
});

const CONVOY_PLAY = "#convoyPlay";
const CONVOY_PAUSE = "#convoyPause";
const CONVOY_REWIND = "#convoyRewind";
const CONVOY_COUNT = 4;
const convoyVehicle = (index: number) => `#convoyVehicle${index}`;
const SCROLL_MARKER = "#scrollMarker";

/**
 * How far along the path a traveler is, in the path's own length units: the point on the curve nearest the
 * traveler's center, found the same way `distanceFromPath` finds its distance. Positions along the path are
 * what a convoy promises to keep apart, so the spacing is measured along the curve rather than across the box.
 */
const arcPositionOf = (page: Page, travelerSelector: string) =>
    page.evaluate((selector) => {
        const traveler = document.querySelector(selector);
        const path = traveler?.parentElement?.parentElement?.querySelector("svg path") as SVGPathElement | null;

        if (!traveler || !path) throw new Error("nothing is traveling");

        const box = traveler.getBoundingClientRect();
        const center = { x: box.x + box.width * 0.5, y: box.y + box.height * 0.5 };
        const matrix = path.getScreenCTM();
        const length = path.getTotalLength();

        if (!matrix) throw new Error("the path is not on screen");

        let nearest = Infinity;
        let nearestAt = 0;

        for (let at = 0; at <= length; at += 0.5) {
            const point = path.getPointAtLength(at);
            const distance = Math.hypot(
                point.x * matrix.a + point.y * matrix.c + matrix.e - center.x,
                point.x * matrix.b + point.y * matrix.d + matrix.f - center.y,
            );

            if (distance < nearest) {
                nearest = distance;
                nearestAt = at;
            }
        }

        return { at: nearestAt, length };
    }, travelerSelector);

const convoyPositions = async (page: Page) => {
    const positions = [];

    for (let index = 0; index < CONVOY_COUNT; index++) positions.push(await arcPositionOf(page, convoyVehicle(index)));

    return positions;
};

/** The gap from each traveler back to the one behind it, along the path, wrapping round the end on a loop. */
const convoyGaps = async (page: Page) => {
    const positions = await convoyPositions(page);
    const length = positions[0].length;

    return positions.slice(1).map((behind, index) => (positions[index].at - behind.at + length) % length);
};

/** Half a unit of search resolution either side, plus a rounding of the transform the browser paints. */
const ALONG_PATH_TOLERANCE = 2;

/**
 * Four travelers on one clock, each a fixed share of the path behind the one in front — the page gives them
 * even shares, so the gaps along the curve come back equal to each other, and equal again a moment later
 * after all four have moved on.
 */
test("the travelers of a convoy keep their spacing along the path as they go", async ({ page }) => {
    await expect
        .poll(() => progressOf(page, "convoy"), { message: "the convoy sets off on its own" })
        .toBeGreaterThan(0);
    await page.locator(CONVOY_PAUSE).click();

    const first = await convoyGaps(page);
    const leadBefore = await arcPositionOf(page, convoyVehicle(0));

    for (const gap of first) {
        expect(Math.abs(gap - first[0]), "every gap is the same as the first").toBeLessThan(ALONG_PATH_TOLERANCE);
    }

    await page.locator(CONVOY_PLAY).click();
    await expect
        .poll(async () => Math.abs((await arcPositionOf(page, convoyVehicle(0))).at - leadBefore.at))
        .toBeGreaterThan(10);
    await page.locator(CONVOY_PAUSE).click();

    const second = await convoyGaps(page);

    for (const [index, gap] of second.entries()) {
        expect(Math.abs(gap - first[index]), "and it is the same gap after they have all moved on").toBeLessThan(
            ALONG_PATH_TOLERANCE,
        );
    }
});

/**
 * On a path that stops, the followers do not wrap round behind the lead: they all wait at the start, and each
 * sets off only once the lead is its share ahead. So from a rewind, all four are at the same spot, and the
 * moment the lead has left, the last follower is still sitting there.
 */
test("on a run that does not loop, the followers wait at the start until the lead is their share ahead", async ({
    page,
}) => {
    await page.locator(`${prop("isLooping")} input`).uncheck();
    await page.locator(CONVOY_PAUSE).click();
    await page.locator(CONVOY_REWIND).click();

    const parked = await convoyPositions(page);

    for (const position of parked) {
        expect(Math.abs(position.at - parked[0].at), "all four start on the same spot").toBeLessThan(
            ALONG_PATH_TOLERANCE,
        );
    }

    await page.locator(CONVOY_PLAY).click();
    await expect
        .poll(async () => (await arcPositionOf(page, convoyVehicle(0))).at - parked[0].at, {
            message: "the lead sets off",
        })
        .toBeGreaterThan(ALONG_PATH_TOLERANCE);
    await page.locator(CONVOY_PAUSE).click();

    const lead = await arcPositionOf(page, convoyVehicle(0));
    const last = await arcPositionOf(page, convoyVehicle(CONVOY_COUNT - 1));

    expect(lead.at, "the lead has left the start").toBeGreaterThan(parked[0].at + ALONG_PATH_TOLERANCE);
    expect(Math.abs(last.at - parked[0].at), "while the last of them is still waiting there").toBeLessThan(
        ALONG_PATH_TOLERANCE,
    );
});

/**
 * The fourth example runs no clock at all: how far the page has been scrolled past it is its progress. The
 * Playground scrolls inside its own frame rather than the window, so the scroll is a wheel over the page,
 * which is what a person does, and the readout and the marker are read back after each one. The example is
 * the last on the page, so bringing it into view can leave the page at the bottom of its scroll; it is
 * backed off first so that there is room to scroll down.
 *
 * At the suite's own window size the whole Trail page fits and nothing scrolls, so this test narrows the
 * window's height: `Viewport` keeps the window's aspect ratio, so a short, wide window gives the page less
 * height than its content and the page frame starts to scroll.
 */
const SHORT_WINDOW = { width: 1600, height: 500 };

const scrollPage = async (page: Page, byY: number) => {
    const box = (await page.locator(example("scroll")).boundingBox())!;

    await page.mouse.move(box.x + box.width * 0.5, box.y + 4);
    await page.mouse.wheel(0, byY);
    await page.waitForTimeout(A_FEW_FRAMES_MS);
};

test("scrolling the page moves the scroll-driven traveler forward, and scrolling back moves it back", async ({
    page,
}) => {
    await page.setViewportSize(SHORT_WINDOW);
    await page.reload();
    await page.locator(example("scroll")).scrollIntoViewIfNeeded();
    await scrollPage(page, -150);

    const startProgress = await progressOf(page, "scroll");
    const start = await arcPositionOf(page, SCROLL_MARKER);

    await scrollPage(page, 150);

    const forwardProgress = await progressOf(page, "scroll");
    const forward = await arcPositionOf(page, SCROLL_MARKER);

    expect(forwardProgress, "scrolling down takes the readout on").toBeGreaterThan(startProgress);
    expect(forward.at, "and the traveler further along its path").toBeGreaterThan(start.at);

    await scrollPage(page, -150);

    const backProgress = await progressOf(page, "scroll");
    const back = await arcPositionOf(page, SCROLL_MARKER);

    expect(backProgress, "scrolling up brings the readout back").toBeLessThan(forwardProgress);
    expect(back.at, "and the traveler back along the path").toBeLessThan(forward.at);
});
