import { type Page, expect, test } from "@playwright/test";

import { demo, example, prop, revealProp, useElementRenderer } from "./helpers";

/**
 * A particle is only ever in the page while it is traveling or resting on its target: the component adds an
 * element when one sets off and removes it once its trip and its rest are over, which is also the moment it
 * reports the arrival. None of these examples print a reading, so the spec keeps its own: a log installed in
 * the page that notes each particle element as it is added, follows where it is painted frame by frame, and
 * closes its entry when the element is removed. **An entry's last position is where the particle arrived**, and
 * a nonzero rest (`restDurationMs`) is what makes that exact rather than a frame short of the end.
 *
 * Positions are never compared with a number. A particle arrived at its target when it ended up much closer to
 * that target than the distance it had to cover, and it set off from its spawner when it started much closer to
 * the spawner than that same distance — so a restyled marker or a resized demo leaves every check standing.
 * They are kept relative to the demo's own box, so a scroll between two readings cannot move them.
 *
 * A spawner is its `role="presentation"` root with `aria-hidden`, which is how the component marks the layer it
 * paints into. A target is a marker with nothing inside it that sits outside every spawner and is not the
 * marker a spawner is drawn on — the many-to-one example's single center, for one. Both are
 * looked for inside the example's own box, which leaves out the scrubber under it, whose track is empty elements too.
 */
const SINGLE_TARGET = example("singleTarget");
const MANY_TO_ONE = example("manyToOne");
const ROUND_TRIP = example("roundTrip");
const WIND = example("wind");
const ATTRACTION = example("attraction");

const SPAWNER = '[role="presentation"][aria-hidden="true"]';

const PARTICLE_COUNT = 6;
const RETENTION_MS = 300;
const NEAR_SHARE = 0.15;
const HOLD_MS = 600;
const SCRUB_TO = 30;
const PAST_THE_END = 100;
const HALF_TURN_DEGREES = 180;
const FULL_TURN_DEGREES = 360;

type Point = { x: number; y: number };

type Trip = {
    spawner: number;
    bornAt: number | null;
    diedAt: number | null;
    first: Point | null;
    last: Point;
    path: Point[];
};

type ParticleLog = {
    trips: Trip[];
    spawnerCenters: Point[];
    targetCenters: Point[];
};

const setNumber = async (page: Page, key: string, value: number) => {
    await page.locator(`${prop(key)} input`).fill(String(value));
    await page.locator(`${prop(key)} input`).blur();
};

const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);

/**
 * Particles already in flight when the log is installed are entered too, with no birth, so that their arrival
 * is still counted — the round trip pairs every arrival with a return, and one missed arrival would leave a
 * return with nothing to answer.
 */
const installLog = (page: Page, scope: string) =>
    page.evaluate(
        (value) => {
            const demoElement = document.querySelector(`${value.scope} [data-demo]`)!;
            const area = demoElement.querySelector("[data-measure-box]") ?? demoElement;
            const spawners = [...area.querySelectorAll(value.spawner)];

            const centerOf = (element: Element) => {
                const box = demoElement.getBoundingClientRect();
                const rect = element.getBoundingClientRect();

                return { x: rect.x + rect.width / 2 - box.x, y: rect.y + rect.height / 2 - box.y };
            };

            const live = new Map<Node, Trip>();
            const log: ParticleLog = {
                trips: [],
                spawnerCenters: spawners.map(centerOf),
                targetCenters: [...area.querySelectorAll("div:empty")]
                    .filter(
                        (element) =>
                            !spawners.some(
                                (spawner) =>
                                    spawner.contains(element) || spawner.parentElement === element.parentElement,
                            ),
                    )
                    .map(centerOf),
            };

            (window as unknown as { particleLog: ParticleLog }).particleLog = log;

            spawners.forEach((spawner, index) => {
                for (const child of spawner.children) {
                    const at = centerOf(child);
                    const trip = { spawner: index, bornAt: null, diedAt: null, first: null, last: at, path: [at] };

                    live.set(child, trip);
                    log.trips.push(trip);
                }

                new MutationObserver((records) => {
                    for (const record of records) {
                        for (const node of record.addedNodes) {
                            const at = centerOf(node as Element);
                            const trip = {
                                spawner: index,
                                bornAt: performance.now(),
                                diedAt: null,
                                first: at,
                                last: at,
                                path: [at],
                            };

                            live.set(node, trip);
                            log.trips.push(trip);
                        }

                        for (const node of record.removedNodes) {
                            const trip = live.get(node);

                            if (!trip) continue;

                            live.delete(node);
                            trip.diedAt = performance.now();
                        }
                    }
                }).observe(spawner, { childList: true });
            });

            const follow = () => {
                for (const [node, trip] of live) {
                    trip.last = centerOf(node as Element);
                    trip.path.push(trip.last);
                }

                requestAnimationFrame(follow);
            };

            requestAnimationFrame(follow);
        },
        { scope, spawner: SPAWNER },
    );

const readLog = (page: Page) => page.evaluate(() => (window as unknown as { particleLog: ParticleLog }).particleLog);

const arrivals = (log: ParticleLog) => log.trips.filter((trip) => trip.diedAt !== null);

const liveCount = (page: Page, key: string) => page.locator(`${demo(key)} ${SPAWNER} > *`).count();

const readPositions = (page: Page, key: string) =>
    page
        .locator(`${demo(key)} ${SPAWNER} > *`)
        .evaluateAll((elements) => elements.map((element) => (element as HTMLElement).style.transform));

/**
 * Only one example plays at a time, and only the first one starts on its own. A Playground whose examples have no
 * controls of their own plays every example, and there is nothing to press.
 */
const startPlaying = async (page: Page, key: string) => {
    const button = page.locator(`#${key}Playback`);

    if ((await button.count()) === 0) return;
    if ((await button.getAttribute("aria-label")) === "Play") await button.click();

    await expect(button).toHaveAccessibleName("Pause");
};

const chooseKnob = async (page: Page, key: string, name: string) => {
    const picker = page.locator(`${prop(key)} [role="combobox"]`);

    await picker.click();
    await page
        .locator(`[id="${await picker.getAttribute("aria-controls")}"]`)
        .getByRole("option", { name, exact: true })
        .click();
};

/**
 * The trips that began and ended while the log was installed — whole ones, from their spawner to where they were
 * taken away — once there are at least as many as one round sends.
 */
const logWholeTrips = async (page: Page, scope: string) => {
    await installLog(page, scope);
    await expect
        .poll(async () => arrivals(await readLog(page)).filter((trip) => trip.bornAt !== null).length, {
            message: "a round's worth of particles has made its whole trip",
            timeout: 15_000,
        })
        .toBeGreaterThanOrEqual(PARTICLE_COUNT);

    const log = await readLog(page);

    return { log, trips: arrivals(log).filter((trip) => trip.bornAt !== null) };
};

/**
 * How far each point of a trip lies to one side of the straight line from `from` to `to`: positive on the side a
 * clockwise turn of the line's direction faces, which is below a line running left to right.
 */
const sideOffsets = (trip: Trip, from: Point, to: Point) => {
    const length = distance(from, to);

    return trip.path.map(
        (point) => ((to.x - from.x) * (point.y - from.y) - (to.y - from.y) * (point.x - from.x)) / length,
    );
};

const scrubTo = async (page: Page, key: string, percent: number) => {
    await page.locator(`#${key}Progress`).click();
    await page.keyboard.press("Home");

    for (let i = 0; i < percent; i++) await page.keyboard.press("ArrowRight");
};

test.beforeEach(async ({ page }) => {
    await useElementRenderer(page);
    await page.goto("/particle-spawner");
    await expect(page.locator(SINGLE_TARGET)).toBeVisible();
    await setNumber(page, "particleCount", PARTICLE_COUNT);
    await setNumber(page, "restDurationMs", RETENTION_MS);
});

/**
 * On a straight path, as the wind and attraction tests use. A particle is first seen at whatever point of its path the
 * frame it sets off in has reached, and the scatter path the page starts on moves fastest at the very start, so there
 * one slow frame shows a particle beyond the near share of its spawner.
 */
test("particles from every spawner arrive at the one shared target", { tag: "@solo" }, async ({ page }) => {
    await chooseKnob(page, "travelPattern", "line");
    await page.locator(MANY_TO_ONE).scrollIntoViewIfNeeded();
    await startPlaying(page, "manyToOne");
    await installLog(page, MANY_TO_ONE);

    const initial = await readLog(page);

    expect(initial.spawnerCenters.length, "the example has several spawners").toBeGreaterThan(1);
    expect(initial.targetCenters.length, "and exactly one target").toBe(1);

    await expect
        .poll(
            async () =>
                new Set(
                    arrivals(await readLog(page))
                        .filter((trip) => trip.bornAt !== null)
                        .map((trip) => trip.spawner),
                ).size,
            { message: "every spawner has landed a particle it was seen sending", timeout: 10_000 },
        )
        .toBe(initial.spawnerCenters.length);

    const log = await readLog(page);
    const [target] = log.targetCenters;

    for (const trip of arrivals(log).filter((trip) => trip.bornAt !== null)) {
        const origin = log.spawnerCenters[trip.spawner];

        expect(distance(trip.first!, origin), "a particle sets off from its own spawner").toBeLessThan(
            distance(origin, target) * NEAR_SHARE,
        );
        expect(distance(trip.last, target), "and every one of them ends on the shared target").toBeLessThan(
            distance(origin, target) * NEAR_SHARE,
        );
    }
});

/**
 * The page plays one example at a time: only the first one plays when the page opens, and starting another pauses
 * whichever was playing. The second example is the one started, so the test names nothing an edit to the page's
 * examples would move.
 */
test("only the first example plays when the page opens, and starting another pauses it", async ({ page }) => {
    const [first, second] = ["singleTarget", "grid"];

    expect(second, "the page has at least two examples with their own controls").toBeDefined();

    await expect(page.locator(`#${first}Playback`)).toHaveAccessibleName("Pause");
    await expect(page.locator(`#${second}Playback`)).toHaveAccessibleName("Play");

    await page.locator(`#${second}Playback`).click();

    await expect(page.locator(`#${second}Playback`)).toHaveAccessibleName("Pause");
    await expect(page.locator(`#${first}Playback`)).toHaveAccessibleName("Play");
});

/**
 * A round is worked out from how far it has run, so a pause leaves every particle exactly where it stands, and
 * playing again carries the round on from that point. Nothing may move while paused, so the test lets time pass
 * rather than waiting on a change.
 */
test("pausing keeps every particle where it stands, and playing carries on from there", async ({ page }) => {
    await page.locator(SINGLE_TARGET).scrollIntoViewIfNeeded();
    await expect
        .poll(() => liveCount(page, "singleTarget"), { message: "the example has particles in flight" })
        .toBeGreaterThan(0);

    await page.locator("#singleTargetPlayback").click();
    await expect(page.locator("#singleTargetPlayback")).toHaveAccessibleName("Play");

    const held = await readPositions(page, "singleTarget");
    const progress = await page.locator("#singleTargetProgress").inputValue();

    expect(held.length, "the pause caught particles in flight").toBeGreaterThan(0);

    await page.waitForTimeout(HOLD_MS);

    expect(await readPositions(page, "singleTarget"), "every particle stays where it was").toEqual(held);
    expect(await page.locator("#singleTargetProgress").inputValue(), "and the round does not move on").toBe(progress);

    await page.locator("#singleTargetPlayback").click();

    await expect
        .poll(() => page.locator("#singleTargetProgress").inputValue(), {
            message: "playing again carries the round on",
        })
        .not.toBe(progress);
});

/**
 * Scrubbing a paused round draws its particles where they are at that point: none once the round is over, and the
 * same picture whenever it comes back to the same point.
 */
test("a scrub draws the round where it is, none past its end, and the same picture at the same point", async ({
    page,
}) => {
    await page.locator(SINGLE_TARGET).scrollIntoViewIfNeeded();
    await page.locator("#singleTargetPlayback").click();
    await expect(page.locator("#singleTargetPlayback")).toHaveAccessibleName("Play");

    await scrubTo(page, "singleTarget", SCRUB_TO);

    const midway = await readPositions(page, "singleTarget");

    expect(midway.length, "partway through the round, particles are out").toBeGreaterThan(0);

    for (let i = SCRUB_TO; i < PAST_THE_END; i++) await page.keyboard.press("ArrowRight");

    await expect.poll(() => liveCount(page, "singleTarget"), { message: "at the round's end, none is left" }).toBe(0);

    for (let i = PAST_THE_END; i > SCRUB_TO; i--) await page.keyboard.press("ArrowLeft");

    await expect
        .poll(() => readPositions(page, "singleTarget"), {
            message: "back at the same point, the same particles in the same places",
        })
        .toEqual(midway);
});

/**
 * A route of two stops — the target, then the spawner — takes every particle out and back within one spawner: it
 * sets off from the spawner, comes within reach of the target on the way, and is taken away back at the spawner.
 */
test("a route takes each particle out to its target and back to its own spawner", async ({ page }) => {
    await page.locator(ROUND_TRIP).scrollIntoViewIfNeeded();
    await startPlaying(page, "roundTrip");

    const { log, trips } = await logWholeTrips(page, ROUND_TRIP);
    const [origin] = log.spawnerCenters;
    const [target] = log.targetCenters;
    const near = distance(origin, target) * NEAR_SHARE;

    for (const trip of trips) {
        expect(distance(trip.first!, origin), "a particle sets off from its spawner").toBeLessThan(near);
        expect(
            Math.min(...trip.path.map((point) => distance(point, target))),
            "it reaches the target on the way",
        ).toBeLessThan(near);
        expect(distance(trip.last, origin), "and it comes back to the spawner").toBeLessThan(near);
    }
});

/**
 * On a straight path, wind is the only thing that moves a particle sideways, so every trip leans to the side the
 * wind blows toward and never as far to the other; turning the wind around turns the lean around. Either way the
 * push fades out before the end of the path, so every particle still lands on the target.
 */
test("wind pushes particles off their path the way it blows, and they still land on the target", async ({
    page,
}) => {
    await chooseKnob(page, "travelPattern", "line");
    await page.locator(WIND).scrollIntoViewIfNeeded();
    await startPlaying(page, "wind");

    const readLeans = async () => {
        const { log, trips } = await logWholeTrips(page, WIND);
        const [origin] = log.spawnerCenters;
        const [target] = log.targetCenters;

        for (const trip of trips) {
            expect(distance(trip.last, target), "every particle still lands on the target").toBeLessThan(
                distance(origin, target) * NEAR_SHARE,
            );
        }

        return trips.map((trip) => {
            const offsets = sideOffsets(trip, origin, target);

            return { clockwise: Math.max(...offsets), counterclockwise: -Math.min(...offsets) };
        });
    };

    await revealProp(page, "windDirectionDegrees", "wind");

    const direction = Number(await page.locator(`${prop("windDirectionDegrees")} input`).inputValue());
    const before = await readLeans();

    await revealProp(page, "windDirectionDegrees", "wind");
    await setNumber(page, "windDirectionDegrees", (direction + HALF_TURN_DEGREES) % FULL_TURN_DEGREES);

    const after = await readLeans();
    const [leaning, turned] = before[0].clockwise > before[0].counterclockwise ? [before, after] : [after, before];

    for (const lean of leaning) {
        expect(lean.clockwise, "one way, every trip leans to the side the wind blows toward").toBeGreaterThan(
            lean.counterclockwise,
        );
    }

    for (const lean of turned) {
        expect(
            lean.counterclockwise,
            "and with the wind turned around, every trip leans the other way",
        ).toBeGreaterThan(lean.clockwise);
    }
});

/**
 * On a straight path, a pull of nothing leaves every trip on the line, and the ring's pull bends trips off it toward
 * wherever the ring is as they pass. Either way the pull fades out before the end of the path, so every particle
 * still lands on the target.
 */
test("attraction bends the paths a pull of nothing leaves straight, and particles still land on the target", async ({
    page,
}) => {
    await chooseKnob(page, "travelPattern", "line");
    await page.locator(ATTRACTION).scrollIntoViewIfNeeded();
    await startPlaying(page, "attraction");

    const readBends = async () => {
        const { log, trips } = await logWholeTrips(page, ATTRACTION);
        const [origin] = log.spawnerCenters;
        const [target] = log.targetCenters;

        for (const trip of trips) {
            expect(distance(trip.last, target), "every particle still lands on the target").toBeLessThan(
                distance(origin, target) * NEAR_SHARE,
            );
        }

        const bends = trips.map((trip) => Math.max(...sideOffsets(trip, origin, target).map(Math.abs)));

        return bends.reduce((sum, bend) => sum + bend, 0) / bends.length;
    };

    await revealProp(page, "attractionStrengthRatio", "attraction");

    const strength = await page.locator(`${prop("attractionStrengthRatio")} input`).inputValue();

    await setNumber(page, "attractionStrengthRatio", 0);

    const straight = await readBends();

    await revealProp(page, "attractionStrengthRatio", "attraction");
    await setNumber(page, "attractionStrengthRatio", Number(strength));

    expect(await readBends(), "the pull bends the paths further than no pull does").toBeGreaterThan(straight);
});
