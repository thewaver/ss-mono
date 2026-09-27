import { type Locator, type Page, expect, test } from "@playwright/test";

/**
 * The React `Trail`. The cases follow `e2e/trail.spec.ts`, which covers the Solid one: a slider that owns the progress
 * is what places a marker, pause stops the walking and play resumes it, the controller's seek sends it back, the
 * traveler stays on the path at every angle, a convoy keeps its spacing, and on a run that does not loop the followers
 * wait at the start. The Solid spec's scroll-driven example is the Playground's own wiring and has no counterpart.
 * Positions are compared with each other or with the path, never with a coordinate written here.
 */
const CIRCUIT = "Exotics/Trail/Circuit";
const TIMELINE = "Exotics/Trail/Timeline";
const A_FEW_FRAMES_MS = 400;
const ALONG_PATH_TOLERANCE = 2;
const CONVOY = [0, 0.25, 0.5, 0.75];

const centerOf = (page: Page, selector: string) =>
    page.evaluate((value) => {
        const box = document.querySelector(value)!.getBoundingClientRect();

        return { x: box.left + box.width * 0.5, y: box.top + box.height * 0.5 };
    }, selector);

const arcPositionOf = (page: Page, travelerSelector: string) =>
    page.evaluate((selector) => {
        const traveler = document.querySelector(selector);
        const path = traveler?.parentElement?.parentElement?.querySelector("svg path") as SVGPathElement | null;

        if (!traveler || !path) throw new Error("nothing is traveling");

        const box = traveler.getBoundingClientRect();
        const center = { x: box.x + box.width * 0.5, y: box.y + box.height * 0.5 };
        const matrix = path.getScreenCTM()!;
        const length = path.getTotalLength();

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

        return { at: nearestAt, length, distance: nearest };
    }, travelerSelector);

const progressOf = async (component: Locator) =>
    Number(await component.locator('[data-readout="progress"]').textContent());

test("the slider is what puts the marker on the path", async ({ page, mount }) => {
    const component = await mount(TIMELINE);
    const scrubber = component.locator("#scrubber");

    await scrubber.focus();
    await page.keyboard.press("Home");

    const start = await centerOf(page, "#marker");

    await page.keyboard.press("End");
    await expect(component.locator('[data-readout="progress"]')).toHaveText("100");

    const end = await centerOf(page, "#marker");

    expect(end.x, "the far end of this path is further across the box than the near end").toBeGreaterThan(start.x);
});

test("one step of the slider moves the marker", async ({ page, mount }) => {
    const component = await mount(TIMELINE);

    await component.locator("#scrubber").focus();
    await page.keyboard.press("Home");

    const before = await centerOf(page, "#marker");

    await page.keyboard.press("ArrowRight");
    await expect(component.locator('[data-readout="progress"]')).toHaveText("1");

    const after = await centerOf(page, "#marker");

    expect(Math.hypot(after.x - before.x, after.y - before.y), "the marker is somewhere else").toBeGreaterThan(0);
});

test("with nothing owning playback it stands still", async ({ page, mount }) => {
    const component = await mount(TIMELINE);
    const before = await centerOf(page, "#marker");

    await page.waitForTimeout(A_FEW_FRAMES_MS);

    expect(await centerOf(page, "#marker")).toEqual(before);
    expect(await progressOf(component)).toBe(0);
});

test("pause stops the traveling, and play starts it again", async ({ page, mount }) => {
    const component = await mount(CIRCUIT);

    await expect.poll(() => progressOf(component), { message: "it sets off on its own" }).toBeGreaterThan(0);
    await component.locator("#pause").click();

    const stopped = await progressOf(component);

    await page.waitForTimeout(A_FEW_FRAMES_MS);

    expect(await progressOf(component), "nothing moves while it is paused").toBe(stopped);

    await component.locator("#play").click();
    await expect
        .poll(() => progressOf(component), { message: "and it carries on from where it stopped" })
        .toBeGreaterThan(stopped);
});

test("the controller can send it back to the start, and the traveler leaves it again", async ({ page, mount }) => {
    const component = await mount(CIRCUIT);

    await expect.poll(() => progressOf(component)).toBeGreaterThan(0);
    await component.locator("#pause").click();
    await component.locator("#rewind").click();

    await expect(component.locator('[data-readout="progress"]'), "the rewind puts it at the beginning").toHaveText("0");

    const start = await centerOf(page, "#vehicle0");

    await component.locator("#play").click();
    await expect.poll(() => progressOf(component)).toBeGreaterThan(0);
    await component.locator("#pause").click();

    const moved = await centerOf(page, "#vehicle0");

    expect(Math.hypot(moved.x - start.x, moved.y - start.y), "it has left the starting point").toBeGreaterThan(0);
});

test("the traveler stays on the path all the way round, at every angle", async ({ page, mount }) => {
    const component = await mount(CIRCUIT);

    for (let sample = 0; sample < 5; sample += 1) {
        await component.locator("#pause").click();

        expect(
            (await arcPositionOf(page, "#vehicle0")).distance,
            `the traveler is on the curve at ${await progressOf(component)}% round`,
        ).toBeLessThan(2);

        await component.locator("#play").click();
        await page.waitForTimeout(500);
    }
});

test("the travelers of a convoy keep their spacing along the path as they go", async ({ page, mount }) => {
    const component = await mount(CIRCUIT, { followerOffsets: CONVOY });

    const gaps = async () => {
        const positions: Awaited<ReturnType<typeof arcPositionOf>>[] = [];

        for (let index = 0; index < CONVOY.length; index++) {
            positions.push(await arcPositionOf(page, `#vehicle${index}`));
        }

        const length = positions[0].length;

        return positions.slice(1).map((behind, index) => (positions[index].at - behind.at + length) % length);
    };

    await expect.poll(() => progressOf(component)).toBeGreaterThan(0);
    await component.locator("#pause").click();

    const first = await gaps();
    const leadBefore = await arcPositionOf(page, "#vehicle0");

    for (const gap of first) {
        expect(Math.abs(gap - first[0]), "every gap is the same as the first").toBeLessThan(ALONG_PATH_TOLERANCE);
    }

    await component.locator("#play").click();
    await expect
        .poll(async () => Math.abs((await arcPositionOf(page, "#vehicle0")).at - leadBefore.at))
        .toBeGreaterThan(10);
    await component.locator("#pause").click();

    for (const [index, gap] of (await gaps()).entries()) {
        expect(Math.abs(gap - first[index]), "and the same gap after they have moved on").toBeLessThan(
            ALONG_PATH_TOLERANCE,
        );
    }
});

test("on a run that does not loop, the followers wait at the start until the lead is their share ahead", async ({
    page,
    mount,
}) => {
    const component = await mount(CIRCUIT, { followerOffsets: CONVOY, isLooping: false });

    await component.locator("#pause").click();
    await component.locator("#rewind").click();
    await expect(component.locator('[data-readout="progress"]')).toHaveText("0");

    const parked = await Promise.all(CONVOY.map((_, index) => arcPositionOf(page, `#vehicle${index}`)));

    for (const position of parked) {
        expect(Math.abs(position.at - parked[0].at), "all four start on the same spot").toBeLessThan(
            ALONG_PATH_TOLERANCE,
        );
    }

    await component.locator("#play").click();
    await expect
        .poll(async () => (await arcPositionOf(page, "#vehicle0")).at - parked[0].at, { message: "the lead sets off" })
        .toBeGreaterThan(ALONG_PATH_TOLERANCE);
    await component.locator("#pause").click();

    const last = await arcPositionOf(page, `#vehicle${CONVOY.length - 1}`);

    expect(Math.abs(last.at - parked[0].at), "while the last of them is still waiting there").toBeLessThan(
        ALONG_PATH_TOLERANCE,
    );
});

test("a run that does not loop reports the lap and hands playback back as it arrives", async ({ mount }) => {
    const component = await mount(CIRCUIT, { isLooping: false, durationMs: 300 });

    await expect(component.locator('[data-readout="laps"]'), "it reaches the end once").toHaveText("1");
    await expect(component.locator('[data-readout="playing"]'), "and stops there").toHaveText("false");
    await expect(component.locator('[data-readout="progress"]')).toHaveText("100");
});
