import { type Page, expect, test } from "@playwright/test";

import { accessibleText, demo, example, prop, revealProp } from "./helpers";

/**
 * Every column is a barrel turned to an angle, so the checks read the angle the component wrote rather than
 * anything about how a digit looks. The angles are cumulative on purpose — they are never wrapped back into
 * a circle — because that is what stops a column going from nine to zero taking the short way round and
 * reading as a rewind, so a spec that compared them modulo 360 would be checking the wrong thing.
 */
const COUNTER = example("counter");
const COLUMN = `${COUNTER} [data-demo] [style*="rotateX"]`;

const SETTLE_MS = 250;

const setField = async (page: Page, key: string, value: string) => {
    await page.locator(`${prop(key)} input`).fill(value);
    await page.locator(`${prop(key)} input`).blur();
    await page.waitForTimeout(SETTLE_MS);
};

/**
 * One reading per column: the angle its first face carries, and the delay before it starts moving. A face's
 * own angle is the negative of the drum's, so a drum turning forward reads here as a rising number — which is
 * why these tests compare two readings rather than naming a direction.
 */
const readColumns = (page: Page) =>
    page.evaluate((value) => {
        const barrels = [
            ...document.querySelectorAll(`${value} [data-demo] div[style*="translateZ"]`),
        ] as HTMLElement[];

        return barrels.flatMap((barrel) => {
            const face = barrel.querySelector('[style*="rotateX"]') as HTMLElement | null;

            if (!face) return [];

            const found = /rotateX\((-?[\d.]+)deg\)/.exec(face.style.transform);

            return [
                {
                    angle: Number.parseFloat(found?.[1] ?? "0"),
                    delayMs: Number.parseFloat(face.style.transitionDelay) || 0,
                },
            ];
        });
    }, COUNTER);

test.beforeEach(async ({ page }) => {
    await page.goto("/odometer");
    await expect(page.locator(COLUMN).first()).toBeVisible();
    await page.waitForTimeout(SETTLE_MS);
});

test("a column that carries keeps turning the way the number is going", async ({ page }) => {
    await setField(page, "value", "199");

    const before = await readColumns(page);

    await page.locator("#stepUp").click();
    await page.waitForTimeout(SETTLE_MS);

    const after = await readColumns(page);

    expect(after.length, "the same three columns are being compared").toBe(before.length);

    for (const [index, column] of after.entries()) {
        expect(
            column.angle,
            "counting up turns every column that moved the same way, nine to zero included",
        ).toBeGreaterThanOrEqual(before[index].angle);
    }

    expect(after[after.length - 1].angle, "and the units really did move rather than staying put").toBeGreaterThan(
        before[before.length - 1].angle,
    );
});

test("counting down turns the columns back the other way", async ({ page }) => {
    await setField(page, "value", "200");

    const before = await readColumns(page);

    await page.locator("#stepDown").click();
    await page.waitForTimeout(SETTLE_MS);

    const after = await readColumns(page);

    expect(
        after[after.length - 1].angle,
        "the units go the other way, which is what makes it read as a rewind rather than another lap",
    ).toBeLessThan(before[before.length - 1].angle);
});

test("a column waits for every column to its right that is also carrying", async ({ page }) => {
    await setField(page, "cascadeDelayMs", "100");
    await setField(page, "value", "199");
    await page.locator("#stepUp").click();
    await page.waitForTimeout(SETTLE_MS);

    const columns = await readColumns(page);

    expect(columns.length, "199 to 200 carries all three").toBe(3);
    expect(
        columns.map((column) => column.delayMs),
        "the units start at once, the tens after one beat, the hundreds after two",
    ).toEqual([200, 100, 0]);
});

test("a column whose digit has not changed waits for nobody", async ({ page }) => {
    await setField(page, "cascadeDelayMs", "100");
    await setField(page, "value", "123");
    await setField(page, "value", "223");

    const columns = await readColumns(page);

    expect(
        columns.map((column) => column.delayMs),
        "only the hundreds moved, so nothing is waiting on anything",
    ).toEqual([0, 0, 0]);
});

/**
 * A column the new value no longer needs does not vanish: it shrinks away first, and only leaves the page when
 * the shrink is over. Counting columns while one is still on its way out would count it, so every reading here
 * waits until nothing in the counter is animating — which is the moment the count means what the test says.
 */
const waitForSlotsToSettle = (page: Page) =>
    page.evaluate(
        (value) =>
            Promise.all(
                (document.querySelector(`${value} [data-demo]`)?.getAnimations({ subtree: true }) ?? []).map(
                    (animation) => animation.finished.catch(() => undefined),
                ),
            ).then(() => undefined),
        COUNTER,
    );

test("a column keeps turning when a sign appears in front of it", async ({ page }) => {
    await setField(page, "value", "0");
    await waitForSlotsToSettle(page);

    const before = await readColumns(page);

    await setField(page, "value", "-1");
    await waitForSlotsToSettle(page);

    const after = await readColumns(page);

    expect(after.length, "the same one column is on the board").toBe(before.length);
    expect(
        Math.abs(after[0].angle - before[0].angle),
        "and it turned one step rather than being replaced by a new one at rest",
    ).toBe(36);
});

test("a separator is a slot that never turns", async ({ page }) => {
    await setField(page, "value", "1200");

    const columns = await readColumns(page);

    expect(columns.length, "four digits are four barrels, and the comma is not one of them").toBe(4);
    await expect(page.locator(demo("counter")), "the comma is still on the page").toContainText(",");
});

test("what a screen reader gets is the number, and never the digits going past", async ({ page }) => {
    await setField(page, "value", "4321");

    expect(await accessibleText(page.locator(demo("counter"))), "the whole value, once").toContain("4,321");
    expect(
        (await accessibleText(page.locator(demo("counter")))).match(/9/g) ?? [],
        "and no trace of the other nine faces every column is carrying",
    ).toEqual([]);
});

const REELS = example("reels");
const PULL = "#pullReels";

/**
 * The reel example's columns, read the way `readColumns` reads the counter's, plus the duration each column's
 * faces were handed — which is the reel's answer for that column and so the order it should stop in.
 */
const readReelColumns = (page: Page) =>
    page.evaluate((value) => {
        const barrels = [
            ...document.querySelectorAll(`${value} [data-demo] div[style*="translateZ"]`),
        ] as HTMLElement[];

        return barrels.flatMap((barrel) => {
            const face = barrel.querySelector('[style*="rotateX"]') as HTMLElement | null;

            if (!face) return [];

            return [
                {
                    angle: Number.parseFloat(/rotateX\((-?[\d.]+)deg\)/.exec(face.style.transform)?.[1] ?? "0"),
                    durationMs: Number.parseFloat(face.style.transitionDuration) || 0,
                    delayMs: Number.parseFloat(face.style.transitionDelay) || 0,
                },
            ];
        });
    }, REELS);

/**
 * When each column actually came to rest, taken from the browser's own end-of-transition event rather than
 * from any number the page set: a listener per column records the moment its first face finishes turning.
 */
const watchReelStops = (page: Page) =>
    page.evaluate((value) => {
        const barrels = [
            ...document.querySelectorAll(`${value} [data-demo] div[style*="translateZ"]:not([style*="rotateX"])`),
        ] as HTMLElement[];
        const stops: (number | null)[] = barrels.map(() => null);

        (window as unknown as { reelStops: (number | null)[] }).reelStops = stops;

        barrels.forEach((barrel, index) => {
            barrel.addEventListener("transitionend", (event) => {
                if ((event as TransitionEvent).propertyName !== "transform" || stops[index] !== null) return;

                stops[index] = performance.now();
            });
        });
    }, REELS);

const readReelStops = (page: Page) =>
    page.evaluate(() => (window as unknown as { reelStops: (number | null)[] }).reelStops);

/** Column indices listed in the order they came to rest, or in the order the given numbers rise. */
const orderBy = (values: number[]) =>
    values
        .map((value, index) => ({ value, index }))
        .sort((first, second) => first.value - second.value)
        .map((entry) => entry.index);

const pullAndWatch = async (page: Page) => {
    const before = await readReelColumns(page);

    await watchReelStops(page);
    await page.locator(PULL).click();
    await expect
        .poll(async () => (await readReelStops(page)).every((stop) => stop !== null), {
            message: "every column comes to rest",
            timeout: 10_000,
        })
        .toBe(true);

    return { before, after: await readReelColumns(page), stops: (await readReelStops(page)) as number[] };
};

const pickReel = async (page: Page, key: string) => {
    await revealProp(page, "reelKey");
    await page.locator(`${prop("reelKey")} [role="combobox"]`).click();
    await page.locator('[role="listbox"] [role="option"]', { hasText: key }).first().click();
    await page.waitForTimeout(SETTLE_MS);
};

/**
 * A reel replaces the ripple: every column starts together, an unchanged digit included, and the order they
 * stop in is the reel's. The order is asserted as a relationship — the columns rest in the order of the
 * durations the reel handed them — and then again with the reel that runs the other way, which has to
 * reverse it. Nothing here names a duration or which column is slowest.
 */
test("a pull turns every column, and they come to rest in the order the chosen reel gives", async ({ page }) => {
    await expect(page.locator(`${REELS} [data-demo] [style*="rotateX"]`).first()).toBeVisible();
    await pickReel(page, "leftToRight");

    const first = await pullAndWatch(page);
    const turns = first.after.map((column, index) => column.angle - first.before[index].angle);

    expect(first.after.length, "the same columns before and after").toBe(first.before.length);

    for (const turn of turns) {
        expect(turn, "every column turned, whether or not its digit changed").not.toBe(0);
        expect(Math.sign(turn), "and all of them the same way").toBe(Math.sign(turns[0]));
    }

    expect(
        new Set(first.after.map((column) => column.delayMs)).size,
        "no column waits for another, so the order comes from the reel alone",
    ).toBeLessThanOrEqual(1);

    const leftToRight = orderBy(first.stops);

    expect(leftToRight, "the columns rest in the order of the durations the reel gave them").toEqual(
        orderBy(first.after.map((column) => column.durationMs)),
    );

    await pickReel(page, "rightToLeft");

    const second = await pullAndWatch(page);
    const rightToLeft = orderBy(second.stops);

    expect(rightToLeft, "a different reel is a different order, and it is still the reel's").toEqual(
        orderBy(second.after.map((column) => column.durationMs)),
    );
    expect(rightToLeft, "the reel running the other way reverses it").toEqual([...leftToRight].reverse());
});

/**
 * Every slot in the counter, read in one pass: digit windows and fixed slots apart, each with its laid-out
 * width, whether its width is being animated right now, the class list the page's painter carries and, for a
 * digit, the angle its drum is at. Widths are `offsetWidth`, which is layout space and so unaffected by the
 * Playground's scaling.
 */
type Slot = {
    width: number;
    isResizing: boolean;
    classes: string[];
    angle: number;
};

const readSlots = (page: Page) =>
    page.evaluate((value) => {
        const root = document.querySelector(`${value} [data-demo] [role="group"][aria-label]`) as HTMLElement;
        const slots = [...root.children].filter((child) => child.tagName === "DIV") as HTMLElement[];

        const read = (slot: HTMLElement, painter: Element | null | undefined) => ({
            width: slot.offsetWidth,
            isResizing: slot.getAnimations().length > 0,
            classes: [...(painter?.classList ?? [])],
            angle: Number.parseFloat(
                /rotateX\((-?[\d.]+)deg\)/.exec(
                    (slot.querySelector('[style*="rotateX"]') as HTMLElement | null)?.style.transform ?? "",
                )?.[1] ?? "0",
            ),
        });

        return {
            digits: slots
                .filter((slot) => slot.querySelector('[style*="translateZ"]'))
                .map((slot) =>
                    read(slot, slot.querySelector('[style*="rotateX"]')?.firstElementChild?.firstElementChild),
                ),
            fixed: slots
                .filter((slot) => !slot.querySelector('[style*="translateZ"]'))
                .map((slot) => read(slot, slot.firstElementChild)),
        };
    }, COUNTER);

/** The class tokens one painter carries that another does not — how the entering and leaving flags show. */
const extraClasses = (slot: Slot, resting: Slot) => slot.classes.filter((name) => !resting.classes.includes(name));

const LONG_TURN_MS = "3000";

const isBetween = (width: number, full: number) => width > 0 && width < full;

/**
 * A digit arriving grows in from nothing and a digit going shrinks away before it leaves the page, and the
 * painter is told which is happening so it can fade itself. The flags are read as class tokens the painter
 * carries only while the slot is arriving or leaving — what the class draws is the page's business — and the
 * two have to be different tokens. The turn is made long so the in-between states are there to be read.
 */
test("a column arriving grows in and one going shrinks away, and the painter is told which", async ({ page }) => {
    await setField(page, "turnDurationMs", LONG_TURN_MS);
    await setField(page, "value", "999");
    await waitForSlotsToSettle(page);

    const settled = await readSlots(page);
    const full = settled.digits[0].width;

    expect(settled.digits.length).toBe(3);

    await page.locator("#stepUp").click();
    await expect
        .poll(async () => (await readSlots(page)).digits.length, { message: "a fourth column arrives" })
        .toBe(4);

    const arriving = () => readSlots(page).then((slots) => slots.digits.find((digit) => digit.isResizing));

    await expect
        .poll(async () => isBetween((await arriving())?.width ?? -1, full), { message: "it is on its way in" })
        .toBe(true);

    const growing = await readSlots(page);
    const enteringColumn = growing.digits.find((digit) => digit.isResizing)!;
    const restingColumn = growing.digits.find((digit) => !digit.isResizing)!;
    const entering = extraClasses(enteringColumn, restingColumn);

    expect(entering.length, "the arriving column's painter carries a mark the resting ones do not").toBeGreaterThan(0);
    expect(
        growing.fixed.some((slot) => slot.isResizing),
        "the separator that 1,000 needs grows in beside it",
    ).toBe(true);

    await waitForSlotsToSettle(page);

    const grown = await readSlots(page);

    for (const digit of grown.digits) {
        expect(digit.width, "once in, every column is full width").toBe(full);
        expect(extraClasses(digit, grown.digits[0]), "and no painter is marked any more").toEqual([]);
    }

    await page.locator("#stepUp").click();
    await waitForSlotsToSettle(page);

    const turned = await readSlots(page);

    await page.locator(`${prop("value")} input`).fill("999");
    await page.locator(`${prop("value")} input`).blur();

    const leavingColumn = () => readSlots(page).then((slots) => slots.digits.find((digit) => digit.isResizing));

    await expect
        .poll(async () => isBetween((await leavingColumn())?.width ?? -1, full), {
            message: "the column 999 does not need, having just turned to 1, is on its way out",
        })
        .toBe(true);

    const shrinking = await readSlots(page);
    const outgoing = shrinking.digits.find((digit) => digit.isResizing)!;
    const staying = shrinking.digits.find((digit) => !digit.isResizing)!;
    const leaving = extraClasses(outgoing, staying);

    expect(shrinking.digits.length, "it is still on the page while it shrinks").toBe(4);
    expect(leaving.length, "its painter is marked as leaving").toBeGreaterThan(0);
    expect(leaving, "with a different mark from the arriving one").not.toEqual(entering);
    expect(outgoing.angle, "and it holds the angle it was at rather than spinning back to rest").toBe(
        turned.digits[shrinking.digits.indexOf(outgoing)].angle,
    );

    await waitForSlotsToSettle(page);

    const gone = await readSlots(page);

    expect(gone.digits.length, "once it has shrunk away it is removed").toBe(3);
    expect(gone.fixed.length, "and so is the separator").toBe(0);
});

/**
 * WCAG 2.3.3 Animation from Interactions: with less motion asked for, the width changes at once, nothing is
 * animated, and no painter is ever told a slot is arriving or leaving.
 */
test("with reduced motion a column arrives and leaves at once, and no painter is marked", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.reload();
    await expect(page.locator(COLUMN).first()).toBeVisible();

    await setField(page, "turnDurationMs", LONG_TURN_MS);
    await setField(page, "value", "999");
    await page.locator("#stepUp").click();

    const arrived = await readSlots(page);

    expect(arrived.digits.length, "the fourth column is there straight away").toBe(4);

    for (const slot of [...arrived.digits, ...arrived.fixed]) {
        expect(slot.isResizing, "and no slot's width is moving").toBe(false);
    }

    for (const digit of arrived.digits) {
        expect(digit.width, "every column is already full width").toBe(arrived.digits[0].width);
        expect(extraClasses(digit, arrived.digits[0]), "and no painter is marked").toEqual([]);
    }

    await page.locator("#stepDown").click();

    const left = await readSlots(page);

    expect(left.digits.length, "the column 999 does not need is gone straight away").toBe(3);
    expect(left.fixed.length).toBe(0);
});
