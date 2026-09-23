import { type Page, expect, test } from "@playwright/test";

import { demo, example, prop } from "./helpers";

/**
 * A particle is only ever in the page while it is traveling or resting on its target: the component adds an
 * element when one sets off and removes it once its trip and its rest are over, which is also the moment it
 * reports the arrival. None of these examples print a reading, so the spec keeps its own: a log installed in
 * the page that notes each particle element as it is added, follows where it is painted frame by frame, and
 * closes its entry when the element is removed. **An entry's last position is where the particle arrived**, and
 * a nonzero rest (`retentionMs`) is what makes that exact rather than a frame short of the end.
 *
 * Positions are never compared with a number. A particle arrived at its target when it ended up much closer to
 * that target than the distance it had to cover, and it set off from its spawner when it started much closer to
 * the spawner than that same distance — so a restyled marker or a resized demo leaves every check standing.
 * They are kept relative to the demo's own box, so a scroll between two readings cannot move them.
 *
 * A spawner is its `role="presentation"` root with `aria-hidden`, which is how the component marks the layer it
 * paints into. A target is a marker with nothing inside it that sits outside every spawner and is not the
 * marker a spawner is drawn on — the burst's six ring markers and the many-to-one example's single center.
 */
const BURST = example("burst");
const MANY_TO_ONE = example("manyToOne");
const ROUND_TRIP = example("roundTrip");

const BURST_BUTTON = "#particleBurst";
const SPAWNER = '[role="presentation"][aria-hidden="true"]';

const PARTICLE_COUNT = 6;
const RETENTION_MS = 300;
const NEAR_SHARE = 0.15;
const RELAY_WINDOW_MS = 500;

type Point = { x: number; y: number };

type Trip = {
    spawner: number;
    bornAt: number | null;
    diedAt: number | null;
    first: Point | null;
    last: Point;
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

const nearest = (point: Point, candidates: Point[]) =>
    candidates.reduce((best, candidate) => (distance(point, candidate) < distance(point, best) ? candidate : best));

/**
 * Particles already in flight when the log is installed are entered too, with no birth, so that their arrival
 * is still counted — the round trip pairs every arrival with a return, and one missed arrival would leave a
 * return with nothing to answer.
 */
const installLog = (page: Page, scope: string) =>
    page.evaluate(
        (value) => {
            const demoElement = document.querySelector(`${value.scope} [data-demo]`)!;
            const spawners = [...demoElement.querySelectorAll(value.spawner)];

            const centerOf = (element: Element) => {
                const box = demoElement.getBoundingClientRect();
                const rect = element.getBoundingClientRect();

                return { x: rect.x + rect.width / 2 - box.x, y: rect.y + rect.height / 2 - box.y };
            };

            const live = new Map<Node, Trip>();
            const log: ParticleLog = {
                trips: [],
                spawnerCenters: spawners.map(centerOf),
                targetCenters: [...demoElement.querySelectorAll("div:empty")]
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
                    const trip = { spawner: index, bornAt: null, diedAt: null, first: null, last: centerOf(child) };

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
                for (const [node, trip] of live) trip.last = centerOf(node as Element);

                requestAnimationFrame(follow);
            };

            requestAnimationFrame(follow);
        },
        { scope, spawner: SPAWNER },
    );

const readLog = (page: Page) => page.evaluate(() => (window as unknown as { particleLog: ParticleLog }).particleLog);

const arrivals = (log: ParticleLog) => log.trips.filter((trip) => trip.diedAt !== null);

const births = (log: ParticleLog) => log.trips.filter((trip) => trip.bornAt !== null);

const liveCount = (page: Page, key: string) => page.locator(`${demo(key)} ${SPAWNER} > *`).count();

/**
 * The second press has to land while the first round is still in the air, and a round lasts little more than a
 * second. Pressing from the spec once it had seen a particle asked "does a press mid-burst send nothing" and "did
 * the press arrive before the round was over" at once, and under a full parallel run the second question is the
 * one that answered: the press came in after the round had ended, rightly sent a round of its own, and the count
 * came out doubled. So the second press is armed from inside the page before the first is made, and fires the
 * moment the first particle is added — which is inside the round by construction, however slow the spec is. It
 * notes how many particles were in flight as it pressed, so that "mid-burst" is still checked rather than assumed.
 */
const pressAgainOnFirstParticle = (page: Page, key: string) =>
    page.evaluate(
        (args) => {
            const record = window as unknown as { __inFlightAtSecondPress: number | null };
            const layer = document.querySelector(args.layer)!;

            record.__inFlightAtSecondPress = null;

            new MutationObserver((_, observer) => {
                if (layer.children.length === 0) return;

                observer.disconnect();
                record.__inFlightAtSecondPress = layer.children.length;
                (document.querySelector(args.button) as HTMLElement).click();
            }).observe(layer, { childList: true });
        },
        { layer: `${demo(key)} ${SPAWNER}`, button: BURST_BUTTON },
    );

const inFlightAtSecondPress = (page: Page) =>
    page.evaluate(() => (window as unknown as { __inFlightAtSecondPress: number | null }).__inFlightAtSecondPress ?? 0);

test.beforeEach(async ({ page }) => {
    await page.goto("/particle-spawner");
    await expect(page.locator(BURST)).toBeVisible();
    await setNumber(page, "particleCount", PARTICLE_COUNT);
    await setNumber(page, "retentionMs", RETENTION_MS);
});

/**
 * The burst example gives its spawner a playback signal of its own that starts off: the press writes it on and
 * the end of the one round writes it off. So a press sends exactly one round, a press while that round is
 * still going finds the signal already on and does nothing, and once the round is over the button works again.
 */
test("a press sends one round, and a press mid-burst sends nothing extra", async ({ page }) => {
    await page.locator(BURST).scrollIntoViewIfNeeded();

    expect(await liveCount(page, "burst"), "nothing is sent until somebody presses").toBe(0);

    await installLog(page, BURST);
    await pressAgainOnFirstParticle(page, "burst");
    await page.locator(BURST_BUTTON).click();
    await expect
        .poll(() => inFlightAtSecondPress(page), { message: "the second press is made while the round is traveling" })
        .toBeGreaterThan(0);

    await expect
        .poll(async () => arrivals(await readLog(page)).length, { message: "the round lands", timeout: 10_000 })
        .toBe(PARTICLE_COUNT);
    await expect.poll(() => liveCount(page, "burst"), { message: "and nothing is left in flight" }).toBe(0);

    const log = await readLog(page);

    expect(births(log).length, "two presses, one round: the second found the burst already playing").toBe(
        PARTICLE_COUNT,
    );

    for (const trip of arrivals(log)) {
        const target = nearest(trip.last, log.targetCenters);
        const origin = log.spawnerCenters[trip.spawner];

        expect(distance(trip.first!, origin), "each particle sets off from the button").toBeLessThan(
            distance(origin, target) * NEAR_SHARE,
        );
        expect(distance(trip.last, target), "and lands on one of the ring's markers").toBeLessThan(
            distance(origin, target) * NEAR_SHARE,
        );
    }

    await page.locator(BURST_BUTTON).click();

    await expect
        .poll(async () => births(await readLog(page)).length, {
            message: "the round's end handed the button back, so a later press sends another round",
            timeout: 10_000,
        })
        .toBe(PARTICLE_COUNT * 2);
});

test("particles from every spawner arrive at the one shared target", async ({ page }) => {
    await page.locator(MANY_TO_ONE).scrollIntoViewIfNeeded();
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
 * The outbound spawner plays on its own; the return spawner never plays and only sends when told to, and it is
 * told to once for each particle that reaches it — `onParticleArrive` calls its `emit(1)`. So every return
 * trip is born just after an outbound arrival, one for one, and every outbound arrival gets its return. The
 * pairing is done in order with a generous window, and the arrivals too close to the end of the log to have
 * had their answer yet are left out, as are returns too close to its start to have had their arrival logged.
 */
test("every particle that reaches the far spawner is sent back, one for one", async ({ page }) => {
    await page.locator(ROUND_TRIP).scrollIntoViewIfNeeded();
    await installLog(page, ROUND_TRIP);

    const installedAt = await page.evaluate(() => performance.now());

    await expect
        .poll(async () => arrivals(await readLog(page)).filter((trip) => trip.spawner === 1).length, {
            message: "some returns have made it all the way back",
            timeout: 10_000,
        })
        .toBeGreaterThan(PARTICLE_COUNT);

    const log = await readLog(page);
    const loggedUntil = await page.evaluate(() => performance.now());
    const [outboundCenter, returnCenter] = log.spawnerCenters;

    const outboundArrivals = arrivals(log)
        .filter((trip) => trip.spawner === 0)
        .map((trip) => trip.diedAt!)
        .sort((a, b) => a - b);
    const returnBirths = births(log)
        .filter((trip) => trip.spawner === 1)
        .map((trip) => trip.bornAt!)
        .sort((a, b) => a - b);

    const claimed = new Set<number>();
    const unanswered: number[] = [];

    for (const bornAt of returnBirths) {
        const match = outboundArrivals.findIndex(
            (arrivedAt, index) => !claimed.has(index) && arrivedAt <= bornAt && bornAt - arrivedAt < RELAY_WINDOW_MS,
        );

        if (match >= 0) claimed.add(match);
        else if (bornAt - installedAt > RELAY_WINDOW_MS) unanswered.push(bornAt);
    }

    const unreturned = outboundArrivals.filter(
        (arrivedAt, index) => !claimed.has(index) && loggedUntil - arrivedAt > RELAY_WINDOW_MS,
    );

    expect(outboundArrivals.length, "the outbound spawner has been landing particles").toBeGreaterThan(0);
    expect(unanswered, "the return spawner sends nothing that an arrival did not ask for").toEqual([]);
    expect(unreturned, "and every arrival is answered with a return").toEqual([]);

    for (const trip of arrivals(log).filter((trip) => trip.bornAt !== null)) {
        const [from, to] = trip.spawner === 0 ? [outboundCenter, returnCenter] : [returnCenter, outboundCenter];

        expect(distance(trip.first!, from), "a trip starts at the spawner that sent it").toBeLessThan(
            distance(from, to) * NEAR_SHARE,
        );
        expect(distance(trip.last, to), "and ends on the other one").toBeLessThan(distance(from, to) * NEAR_SHARE);
    }
});
