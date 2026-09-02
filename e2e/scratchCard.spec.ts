import { type Page, expect, test } from "@playwright/test";

import { demo, example, prop, readout } from "./helpers";

/**
 * The cover is a grid of cells rather than a canvas, so what has been rubbed off is countable: every check
 * here is a count of hidden cells against the total, which is what the component itself reports through
 * `onScratch`. Nothing pins a pixel or a cell count, because both are the page's choice rather than the
 * component's behaviour.
 *
 * The threshold is driven right up in `beforeEach` so that scratching does not trip the auto-clear in the
 * middle of a test that is about scratching; the tests that are about the threshold set it themselves.
 */
const TICKET = example("ticket");
const COVER = `${TICKET} [role="button"]`;

const FULL_THRESHOLD = "1";
const LOW_THRESHOLD = "0.1";
const SETTLE_MS = 150;

const setField = async (page: Page, key: string, value: string) => {
    await page.locator(`${prop(key)} input`).fill(value);
    await page.locator(`${prop(key)} input`).blur();
    await page.waitForTimeout(SETTLE_MS);
};

const countCells = (page: Page) =>
    page.evaluate((value) => {
        const cover = document.querySelector(value) as HTMLElement | null;

        if (!cover) return { total: 0, scratched: 0 };

        const cells = [...cover.children] as HTMLElement[];

        return {
            total: cells.length,
            scratched: cells.filter((cell) => getComputedStyle(cell).visibility === "hidden").length,
        };
    }, COVER);

const rub = async (page: Page, fromRatio: number, toRatio: number) => {
    const box = (await page.locator(COVER).boundingBox())!;
    const y = box.y + box.height / 2;

    await page.mouse.move(box.x + box.width * fromRatio, y);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * toRatio, y, { steps: 20 });
    await page.mouse.up();
    await page.waitForTimeout(SETTLE_MS);
};

test.beforeEach(async ({ page }) => {
    await page.goto("/scratch-card");
    await expect(page.locator(TICKET)).toBeVisible();
    await setField(page, "clearThreshold", FULL_THRESHOLD);
});

test("what the pointer passes over stays rubbed off, rather than coming back behind it", async ({ page }) => {
    const before = await countCells(page);

    expect(before.scratched, "the ticket starts whole").toBe(0);

    await rub(page, 0.1, 0.5);

    const halfway = await countCells(page);

    expect(halfway.scratched, "the drag took cells off").toBeGreaterThan(0);

    await page.mouse.move(0, 0);
    await page.waitForTimeout(SETTLE_MS);

    expect(
        (await countCells(page)).scratched,
        "and taking the pointer away leaves them off, which is what separates this from a travelling hole",
    ).toBe(halfway.scratched);
});

test("rubbing further takes more off, and never puts any back", async ({ page }) => {
    await rub(page, 0.1, 0.4);

    const first = await countCells(page);

    await rub(page, 0.4, 0.9);

    const second = await countCells(page);

    expect(second.scratched, "the second pass adds to the first rather than replacing it").toBeGreaterThan(
        first.scratched,
    );
});

test("a wider brush takes more off the same stroke", async ({ page }) => {
    await setField(page, "brushRadius", "6");
    await rub(page, 0.2, 0.8);

    const narrow = (await countCells(page)).scratched;

    await page.locator("#newTicket").click();
    await setField(page, "brushRadius", "40");
    await rub(page, 0.2, 0.8);

    const wide = (await countCells(page)).scratched;

    expect(wide, "the same stroke with a bigger coin clears more of the foil").toBeGreaterThan(narrow);
});

test("the readout counts what has gone as a share of the whole cover", async ({ page }) => {
    await rub(page, 0.1, 0.6);

    const counted = await countCells(page);
    const reported = Number.parseFloat((await readout(page, "ticket")).replace(/%.*/, ""));

    expect(Math.round(reported), "what the component reports and what the cover shows are the same number").toBe(
        Math.round((counted.scratched / counted.total) * 100),
    );
});

test("crossing the threshold takes the rest of the cover away by itself", async ({ page }) => {
    await setField(page, "clearThreshold", LOW_THRESHOLD);
    await rub(page, 0.2, 0.5);

    await expect(page.locator(COVER), "once enough has gone the cover goes altogether").toHaveCount(0);
    await expect(page.locator(demo("ticket")), "and what was under it is what is left").toContainText("10");
});

test("the cover can be operated without a pointer at all", async ({ page }) => {
    await page.locator(COVER).focus();
    await page.keyboard.press("Enter");
    await page.waitForTimeout(SETTLE_MS);

    await expect(
        page.locator(COVER),
        "a control that only answers to dragging has no keyboard route, so pressing it reveals the lot",
    ).toHaveCount(0);
});

test("the ticket can be put back", async ({ page }) => {
    await rub(page, 0.1, 0.9);

    expect((await countCells(page)).scratched, "something came off").toBeGreaterThan(0);

    await page.locator("#newTicket").click();
    await page.waitForTimeout(SETTLE_MS);

    expect((await countCells(page)).scratched, "and the reset put the whole cover back").toBe(0);
});
