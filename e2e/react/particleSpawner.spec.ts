import { type Page, expect, test } from "@playwright/test";

/**
 * The React `ParticleSpawner`. The cases follow `e2e/particleSpawner.spec.ts`, which covers the Solid one. A particle
 * is in the page only while it travels or rests on its target, so the spec keeps its own log, installed in the page:
 * each particle element is noted as it is added, followed frame by frame, and closed when it is removed. An entry's
 * last position is where it arrived, and a nonzero rest makes that exact. Positions are never compared with a number:
 * a particle set off from its spawner and arrived at its target when it was much nearer each of them than the distance
 * between the two. Everything is measured relative to the story's stage, so a scroll cannot move a reading.
 */
const SPAWNER = '[data-testid="stage"] [role="presentation"][aria-hidden="true"]';
const NEAR_SHARE = 0.15;
const RELAY_WINDOW_MS = 500;
const PARTICLE_COUNT = 6;

type Point = { x: number; y: number };
type Trip = { spawner: number; bornAt: number | null; diedAt: number | null; first: Point | null; last: Point };
type ParticleLog = { trips: Trip[]; spawnerCenters: Point[]; targetCenters: Point[] };

const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);

const nearest = (point: Point, candidates: Point[]) =>
    candidates.reduce((best, candidate) => (distance(point, candidate) < distance(point, best) ? candidate : best));

const installLog = (page: Page, targetSelector: string) =>
    page.evaluate(
        (value) => {
            const stage = document.querySelector('[data-testid="stage"]')!;
            const spawners = [...stage.querySelectorAll(value.spawner)];

            const centerOf = (element: Element) => {
                const box = stage.getBoundingClientRect();
                const rect = element.getBoundingClientRect();

                return { x: rect.x + rect.width / 2 - box.x, y: rect.y + rect.height / 2 - box.y };
            };

            const live = new Map<Node, Trip>();
            const log: ParticleLog = {
                trips: [],
                spawnerCenters: spawners.map(centerOf),
                targetCenters: [...stage.querySelectorAll(value.target)].map(centerOf),
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
        { spawner: SPAWNER, target: targetSelector },
    );

const readLog = (page: Page) => page.evaluate(() => (window as unknown as { particleLog: ParticleLog }).particleLog);

const arrivals = (log: ParticleLog) => log.trips.filter((trip) => trip.diedAt !== null);

const births = (log: ParticleLog) => log.trips.filter((trip) => trip.bornAt !== null);

/** The second press is armed inside the page and fires the moment the first particle is added, so it is mid-round. */
const pressAgainOnFirstParticle = (page: Page) =>
    page.evaluate((selector) => {
        const record = window as unknown as { __inFlightAtSecondPress: number | null };
        const layer = document.querySelector(selector)!;

        record.__inFlightAtSecondPress = null;

        new MutationObserver((_, observer) => {
            if (layer.children.length === 0) return;

            observer.disconnect();
            record.__inFlightAtSecondPress = layer.children.length;
            (document.querySelector("#burst") as HTMLElement).click();
        }).observe(layer, { childList: true });
    }, SPAWNER);

test("a press sends one round, and a press mid-burst sends nothing extra", async ({ page, mount }) => {
    const component = await mount("Exotics/ParticleSpawner/Burst", { particleCount: PARTICLE_COUNT });

    expect(await component.locator(`${SPAWNER} > *`).count(), "nothing is sent until somebody presses").toBe(0);

    await installLog(page, "[data-target]");
    await pressAgainOnFirstParticle(page);
    await component.locator("#burst").click();

    await expect
        .poll(
            () =>
                page.evaluate(
                    () =>
                        (window as unknown as { __inFlightAtSecondPress: number | null }).__inFlightAtSecondPress ?? 0,
                ),
            { message: "the second press is made while the round is traveling" },
        )
        .toBeGreaterThan(0);
    await expect
        .poll(async () => arrivals(await readLog(page)).length, { message: "the round lands", timeout: 10_000 })
        .toBe(PARTICLE_COUNT);
    await expect(component.locator(`${SPAWNER} > *`), "and nothing is left in flight").toHaveCount(0);
    await expect(component.locator('[data-readout="arrivals"]'), "each arrival is reported").toHaveText(
        String(PARTICLE_COUNT),
    );
    await expect(component.locator('[data-readout="rounds"]'), "and the round's end, once").toHaveText("1");

    const log = await readLog(page);

    expect(births(log).length, "two presses, one round").toBe(PARTICLE_COUNT);

    for (const trip of arrivals(log)) {
        const target = nearest(trip.last, log.targetCenters);
        const origin = log.spawnerCenters[trip.spawner];

        expect(distance(trip.first!, origin), "each particle sets off from the spawner").toBeLessThan(
            distance(origin, target) * NEAR_SHARE,
        );
        expect(distance(trip.last, target), "and lands on one of the ring's markers").toBeLessThan(
            distance(origin, target) * NEAR_SHARE,
        );
    }

    await component.locator("#burst").click();

    await expect
        .poll(async () => births(await readLog(page)).length, {
            message: "the round's end handed the button back, so a later press sends another round",
            timeout: 10_000,
        })
        .toBe(PARTICLE_COUNT * 2);
});

test("particles from every spawner arrive at the one shared target", async ({ page, mount }) => {
    await mount("Exotics/ParticleSpawner/ManyToOne");
    await installLog(page, "[data-target]");

    const initial = await readLog(page);

    expect(initial.spawnerCenters.length, "the story has several spawners").toBeGreaterThan(1);
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
        expect(distance(trip.last, target), "and ends on the shared target").toBeLessThan(
            distance(origin, target) * NEAR_SHARE,
        );
    }
});

test("every particle that reaches the far spawner is sent back, one for one", async ({ page, mount }) => {
    const component = await mount("Exotics/ParticleSpawner/RoundTrip");

    await installLog(page, "[data-end]");

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
    expect(
        Number(await component.locator('[data-readout="emitted"]').textContent()),
        "each emit said it sent",
    ).toBeGreaterThan(0);

    for (const trip of arrivals(log).filter((trip) => trip.bornAt !== null)) {
        const [from, to] = trip.spawner === 0 ? [outboundCenter, returnCenter] : [returnCenter, outboundCenter];

        expect(distance(trip.first!, from), "a trip starts at the spawner that sent it").toBeLessThan(
            distance(from, to) * NEAR_SHARE,
        );
        expect(distance(trip.last, to), "and ends on the other one").toBeLessThan(distance(from, to) * NEAR_SHARE);
    }
});

test("a particle's painter is told how far along its path it is", async ({ mount }) => {
    const component = await mount("Exotics/ParticleSpawner/Burst", { particleCount: 2, retentionMs: 600 });

    await component.locator("#burst").click();

    await expect
        .poll(() => component.locator(`${SPAWNER} [data-t="1.00"]`).count(), {
            message: "a particle resting at its target has walked the whole path",
        })
        .toBeGreaterThan(0);
});
