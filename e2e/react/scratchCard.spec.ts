import { type Locator, type Page, expect, test } from "@playwright/test";

/**
 * The React `ScratchCard`. The cases follow `e2e/scratchCard.spec.ts`, which covers the Solid one. The cover is one
 * element with an SVG mask cut into it, and what the card knows is the share of it that has gone, reported through
 * `onScratch`, which the story prints — every check reads that number. The threshold is left at the whole card unless
 * a test is about the threshold, so rubbing does not trip the auto-clear in the middle of a test about rubbing.
 */
const STORY = "Exotics/ScratchCard/Default";
const TICKET = '[data-testid="ticket"]';
const FROSTED = '[data-testid="frosted"]';
const COVER = `${TICKET} [role="button"]`;
const SETTLE_MS = 200;

const clearedPercent = async (component: Locator, key = "ticket") =>
    Number.parseFloat((await component.locator(`[data-readout="${key}"]`).textContent()) ?? "NaN");

const rubAcross = async (page: Page, component: Locator, selector: string, fromRatio = 0.2, toRatio = 0.7) => {
    const box = (await component.locator(selector).boundingBox())!;
    const y = box.y + box.height * 0.5;

    await page.mouse.move(box.x + box.width * fromRatio, y);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * toRatio, y, { steps: 20 });
    await page.mouse.up();
    await page.waitForTimeout(SETTLE_MS);
};

test("what the pointer passes over stays rubbed off, rather than coming back behind it", async ({ page, mount }) => {
    const component = await mount(STORY);

    expect(await clearedPercent(component), "the ticket starts whole").toBe(0);

    await rubAcross(page, component, COVER, 0.1, 0.5);

    const halfway = await clearedPercent(component);

    expect(halfway, "the drag took some of the cover off").toBeGreaterThan(0);

    await page.mouse.move(0, 0);
    await page.waitForTimeout(SETTLE_MS);

    expect(await clearedPercent(component), "and taking the pointer away leaves it off").toBe(halfway);
});

test("rubbing further takes more off, and never puts any back", async ({ page, mount }) => {
    const component = await mount(STORY);

    await rubAcross(page, component, COVER, 0.1, 0.4);

    const first = await clearedPercent(component);

    await rubAcross(page, component, COVER, 0.4, 0.9);

    expect(await clearedPercent(component), "the second pass adds to the first").toBeGreaterThan(first);
});

test("rubbing the same ground again adds nothing, however long it is worked over", async ({ page, mount }) => {
    const component = await mount(STORY);

    await rubAcross(page, component, COVER, 0.2, 0.7);

    const once = await clearedPercent(component);

    await rubAcross(page, component, COVER, 0.7, 0.2);
    await rubAcross(page, component, COVER, 0.2, 0.7);

    expect(await clearedPercent(component), "the union of a shape with itself is the shape").toBe(once);
});

test("a wider brush takes more off the same stroke", async ({ page, mount }) => {
    const narrow = await mount(STORY, { brushRadius: 6 });

    await rubAcross(page, narrow, COVER, 0.2, 0.8);

    const narrowShare = await clearedPercent(narrow);
    const wide = await mount(STORY, { brushRadius: 40 });

    await rubAcross(page, wide, COVER, 0.2, 0.8);

    expect(await clearedPercent(wide), "the same stroke with a bigger coin clears more").toBeGreaterThan(narrowShare);
});

test("the reported share does not depend on how finely it was measured", async ({ page, mount }) => {
    const component = await mount(STORY);

    await rubAcross(page, component, COVER, 0.15, 0.75);

    const coarse = await clearedPercent(component);

    await component.getByTestId("finer").click();
    await page.waitForTimeout(SETTLE_MS);
    await rubAcross(page, component, COVER, 0.75, 0.15);

    const fine = await clearedPercent(component);

    expect(fine, "sixteen samples an axis and sixty-four agree on the same rubbed area").toBeGreaterThan(coarse - 5);
    expect(fine).toBeLessThan(coarse + 5);
});

test("crossing the threshold takes the rest of the cover away by itself", async ({ page, mount }) => {
    const component = await mount(STORY, { clearThreshold: 0.1 });

    await rubAcross(page, component, COVER, 0.1, 0.9);

    await expect(component.locator(COVER), "once enough has gone the cover goes altogether").toHaveCount(0);
    await expect(component.locator(TICKET), "and what was under it is what is left").toContainText("10");
    await expect(component.locator('[data-readout="clears"]'), "and the card says it is clear, once").toHaveText("1");
});

test("the cover can be operated without a pointer at all", async ({ page, mount }) => {
    const component = await mount(STORY);

    await component.locator(COVER).focus();
    await page.keyboard.press("Enter");

    await expect(component.locator(COVER), "pressing it reveals the lot").toHaveCount(0);
    expect(
        await component.locator(TICKET).evaluate((element) => element.contains(document.activeElement)),
        "and focus stays on the card rather than falling to the page",
    ).toBe(true);
});

test("the controller clears it and puts it back", async ({ mount }) => {
    const component = await mount(STORY);

    await component.getByTestId("clear").click();
    await expect(component.locator(COVER)).toHaveCount(0);

    await component.getByTestId("newTicket").click();
    await expect(component.locator(COVER), "a reset brings a whole cover back").toHaveCount(1);
    expect(await clearedPercent(component)).toBe(0);
});

test("a fresh ticket waits to be pressed, rather than carrying the last one's drag over", async ({ page, mount }) => {
    const component = await mount(STORY, { clearThreshold: 0.1 });
    const box = (await component.locator(COVER).boundingBox())!;
    const y = box.y + box.height * 0.5;

    await page.mouse.move(box.x + box.width * 0.2, y);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.6, y, { steps: 20 });

    await expect(component.locator(COVER), "the ticket clears while the pointer is still held down").toHaveCount(0);

    await page.mouse.up();
    await component.getByTestId("newTicket").click();
    await expect(component.locator(COVER)).toHaveCount(1);

    const fresh = (await component.locator(COVER).boundingBox())!;

    await page.mouse.move(fresh.x + fresh.width * 0.1, fresh.y + fresh.height * 0.5);
    await page.mouse.move(fresh.x + fresh.width * 0.9, fresh.y + fresh.height * 0.5, { steps: 20 });
    await page.waitForTimeout(SETTLE_MS);

    expect(await clearedPercent(component), "moving across the new cover with nothing held down rubs off nothing").toBe(
        0,
    );
});

test("the brush preview follows the pointer, and only where a consumer asked for one", async ({ page, mount }) => {
    const component = await mount(STORY);
    const box = (await component.locator(COVER).boundingBox())!;

    await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5);
    await expect(component.locator(`${COVER} > div`), "hovering mounts the preview beside the foil").toHaveCount(2);

    await page.mouse.move(box.x - 30, box.y - 30);
    await expect(component.locator(`${COVER} > div`), "and taking the pointer off takes it away").toHaveCount(1);

    const frostedCover = `${FROSTED} [role="button"]`;
    const frosted = (await component.locator(frostedCover).boundingBox())!;

    await page.mouse.move(frosted.x + frosted.width * 0.5, frosted.y + frosted.height * 0.5);
    await page.waitForTimeout(SETTLE_MS);

    expect(await component.locator(`${frostedCover} > div`).count(), "no brush renderer, nothing extra").toBe(1);
});

test("each card keeps its own tally, rather than sharing one with the card beside it", async ({ page, mount }) => {
    const component = await mount(STORY);

    await rubAcross(page, component, `${FROSTED} [role="button"]`);

    expect(await clearedPercent(component, "frosted"), "the frosted cover reports what came off it").toBeGreaterThan(0);
    expect(await clearedPercent(component, "ticket"), "and the ticket beside it is untouched").toBe(0);
});

test("the ticket can be put back", async ({ page, mount }) => {
    const component = await mount(STORY);

    await rubAcross(page, component, COVER, 0.1, 0.9);

    expect(await clearedPercent(component), "something came off").toBeGreaterThan(0);

    await component.getByTestId("newTicket").click();
    await page.waitForTimeout(SETTLE_MS);

    expect(await clearedPercent(component), "and the reset put the whole cover back").toBe(0);
});
