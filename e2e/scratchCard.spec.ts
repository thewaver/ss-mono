import { type Page, expect, test } from "@playwright/test";

import { demo, example, prop, readout } from "./helpers";

/**
 * The cover is one element with an SVG mask cut into it. Every rub appends a subpath to that mask and the
 * subpaths union under `fill-rule: nonzero`, so there is nothing here to count: no cells, no layers, no
 * markup that grows with the stroke. What the component knows is the share of the cover that has gone,
 * measured by sampling a square lattice of points against the accumulated path, and it reports that through
 * `onScratch`, which the page prints. Every check reads that number.
 *
 * One test reads it twice at different precisions. That is not a precision check — it pins that the sampling
 * is unbiased, which is the property that replaced the exact count the old grid gave. If the two disagreed by
 * much, the number would depend on a knob nobody outside the demo will ever set.
 *
 * The threshold is driven right up in `beforeEach` so that rubbing does not trip the auto-clear in the middle
 * of a test that is about rubbing; the tests that are about the threshold set it themselves.
 */
const TICKET = example("ticket");
const FROSTED = example("frosted");
const COVER = `${TICKET} [role="button"]`;

const FULL_THRESHOLD = "1";
const LOW_THRESHOLD = "0.1";
const SETTLE_MS = 150;

const setField = async (page: Page, key: string, value: string) => {
    await page.locator(`${prop(key)} input`).fill(value);
    await page.locator(`${prop(key)} input`).blur();
    await page.waitForTimeout(SETTLE_MS);
};

const clearedPercent = async (page: Page, key = "ticket") =>
    Number.parseFloat((await readout(page, key)).replace(/%.*/, ""));

const coverChildCount = (page: Page, selector: string) => page.locator(`${selector} > div`).count();

const rubAcross = async (page: Page, selector: string, fromRatio = 0.2, toRatio = 0.7) => {
    const box = (await page.locator(selector).boundingBox())!;
    const y = box.y + box.height * 0.5;

    await page.mouse.move(box.x + box.width * fromRatio, y);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * toRatio, y, { steps: 20 });
    await page.mouse.up();
    await page.waitForTimeout(SETTLE_MS);
};

const rub = (page: Page, fromRatio: number, toRatio: number) => rubAcross(page, COVER, fromRatio, toRatio);

test.beforeEach(async ({ page }) => {
    await page.goto("/scratch-card");
    await expect(page.locator(TICKET)).toBeVisible();
    await setField(page, "clearThreshold", FULL_THRESHOLD);
});

test("what the pointer passes over stays rubbed off, rather than coming back behind it", async ({ page }) => {
    expect(await clearedPercent(page), "the ticket starts whole").toBe(0);

    await rub(page, 0.1, 0.5);

    const halfway = await clearedPercent(page);

    expect(halfway, "the drag took some of the cover off").toBeGreaterThan(0);

    await page.mouse.move(0, 0);
    await page.waitForTimeout(SETTLE_MS);

    expect(
        await clearedPercent(page),
        "and taking the pointer away leaves it off, which is what separates this from a travelling hole",
    ).toBe(halfway);
});

test("rubbing further takes more off, and never puts any back", async ({ page }) => {
    await rub(page, 0.1, 0.4);

    const first = await clearedPercent(page);

    await rub(page, 0.4, 0.9);

    expect(await clearedPercent(page), "the second pass adds to the first rather than replacing it").toBeGreaterThan(
        first,
    );
});

test("rubbing the same ground again adds nothing, however long it is worked over", async ({ page }) => {
    await rub(page, 0.2, 0.7);

    const once = await clearedPercent(page);

    await rub(page, 0.7, 0.2);
    await rub(page, 0.2, 0.7);

    expect(
        await clearedPercent(page),
        "the union of a shape with itself is the shape, so going back over it cannot report more",
    ).toBe(once);
});

test("a wider brush takes more off the same stroke", async ({ page }) => {
    await setField(page, "brushRadius", "6");
    await rub(page, 0.2, 0.8);

    const narrow = await clearedPercent(page);

    await page.locator("#newTicket").click();
    await setField(page, "brushRadius", "40");
    await rub(page, 0.2, 0.8);

    expect(await clearedPercent(page), "the same stroke with a bigger coin clears more of the foil").toBeGreaterThan(
        narrow,
    );
});

test("the reported share does not depend on how finely it was measured", async ({ page }) => {
    await setField(page, "precision", "16");
    await rub(page, 0.15, 0.75);

    const coarse = await clearedPercent(page);

    await setField(page, "precision", "64");
    await page.waitForTimeout(SETTLE_MS);
    await rub(page, 0.75, 0.15);

    const fine = await clearedPercent(page);

    expect(fine, "sixteen samples an axis and sixty-four agree on the same rubbed area").toBeGreaterThan(coarse - 5);
    expect(fine).toBeLessThan(coarse + 5);
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

    await expect(
        page.locator(COVER),
        "a control that only answers to dragging has no keyboard route, so pressing it reveals the lot",
    ).toHaveCount(0);
});

test("a fresh ticket waits to be pressed, rather than carrying the last one's drag over", async ({ page }) => {
    await setField(page, "clearThreshold", LOW_THRESHOLD);

    const box = (await page.locator(COVER).boundingBox())!;
    const y = box.y + box.height * 0.5;

    // the button stays down while the cover clears, so its release lands on an element that has already gone
    await page.mouse.move(box.x + box.width * 0.2, y);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.6, y, { steps: 20 });

    await expect(page.locator(COVER), "the ticket clears while the pointer is still held down").toHaveCount(0);

    await page.mouse.up();
    await page.locator("#newTicket").click();
    await expect(page.locator(COVER)).toHaveCount(1);

    const fresh = (await page.locator(COVER).boundingBox())!;

    await page.mouse.move(fresh.x + fresh.width * 0.1, fresh.y + fresh.height * 0.5);
    await page.mouse.move(fresh.x + fresh.width * 0.9, fresh.y + fresh.height * 0.5, { steps: 20 });
    await page.waitForTimeout(SETTLE_MS);

    expect(
        await clearedPercent(page),
        "moving across the new cover with nothing held down rubs off nothing at all",
    ).toBe(0);
});

test("the brush preview follows the pointer, and only where a consumer asked for one", async ({ page }) => {
    const box = (await page.locator(COVER).boundingBox())!;

    await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5);
    await page.waitForTimeout(SETTLE_MS);

    expect(
        await coverChildCount(page, COVER),
        "hovering the ticket mounts the preview beside the foil the consumer paints",
    ).toBe(2);

    await page.mouse.move(box.x - 50, box.y - 50);
    await page.waitForTimeout(SETTLE_MS);

    expect(await coverChildCount(page, COVER), "and taking the pointer off the card takes it away again").toBe(1);

    const frostedCover = `${FROSTED} [role="button"]`;
    const frosted = (await page.locator(frostedCover).boundingBox())!;

    await page.mouse.move(frosted.x + frosted.width * 0.5, frosted.y + frosted.height * 0.5);
    await page.waitForTimeout(SETTLE_MS);

    expect(
        await coverChildCount(page, frostedCover),
        "the frosted card passes no brush renderer, so hovering it mounts nothing extra",
    ).toBe(1);
});

test("each example keeps its own tally, rather than sharing one with the card beside it", async ({ page }) => {
    await rubAcross(page, `${FROSTED} [role="button"]`);

    expect(await clearedPercent(page, "frosted"), "the frosted cover reports what came off it").toBeGreaterThan(0);
    expect(await clearedPercent(page, "ticket"), "and the ticket beside it is untouched").toBe(0);
});

test("the ticket can be put back", async ({ page }) => {
    await rub(page, 0.1, 0.9);

    expect(await clearedPercent(page), "something came off").toBeGreaterThan(0);

    await page.locator("#newTicket").click();
    await page.waitForTimeout(SETTLE_MS);

    expect(await clearedPercent(page), "and the reset put the whole cover back").toBe(0);
});
