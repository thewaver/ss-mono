import { type Page, expect, test } from "@playwright/test";

import { accessibleText, demo, example, prop } from "./helpers";

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

test("a column keeps turning when a sign appears in front of it", async ({ page }) => {
    await setField(page, "value", "0");

    const before = await readColumns(page);

    await setField(page, "value", "-1");

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
