import { type Page, expect, test } from "@playwright/test";

import { demo } from "./helpers";

/**
 * A pointer follower handed a point of its own follows that point and nothing else. The Light Catcher page's
 * placed example is a row of five lamps sharing one source whose box is the whole row, with a slider choosing
 * where along it the light sits — so the lamp under the light is the brightest and the far one the dimmest,
 * whichever lamp the pointer happens to be over.
 *
 * What a lamp looks like is not read. Each lamp's wrapper writes its strength as a `brightness()` filter, and
 * only the order of two lamps' numbers is compared, never a number itself.
 */
const PLACED = demo("placed");
const LAMPS = `${PLACED} [style*="brightness"]`;
const SLIDER = "#placedLightSlider";

const brightnessOf = (page: Page, index: number) =>
    page
        .locator(LAMPS)
        .nth(index)
        .evaluate((element) => Number(/brightness\(([\d.]+)\)/.exec((element as HTMLElement).style.filter)?.[1]));

const nextFrames = (page: Page) =>
    page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));

const FIRST = 0;
const LAST = 4;

test.beforeEach(async ({ page }) => {
    await page.goto("/light-catcher");
    await page.locator(PLACED).scrollIntoViewIfNeeded();
});

test("the lamp under a placed light is brighter than the lamp furthest from it", async ({ page }) => {
    await page.locator(SLIDER).focus();
    await page.keyboard.press("Home");

    await expect.poll(async () => (await brightnessOf(page, FIRST)) > (await brightnessOf(page, LAST))).toBe(true);

    await page.keyboard.press("End");

    await expect.poll(async () => (await brightnessOf(page, LAST)) > (await brightnessOf(page, FIRST))).toBe(true);
});

test("the pointer does not move a placed light", async ({ page }) => {
    await page.locator(SLIDER).focus();
    await page.keyboard.press("End");
    await expect.poll(async () => (await brightnessOf(page, LAST)) > (await brightnessOf(page, FIRST))).toBe(true);

    await page.locator(LAMPS).nth(FIRST).hover();
    await nextFrames(page);

    await expect.poll(async () => (await brightnessOf(page, LAST)) > (await brightnessOf(page, FIRST))).toBe(true);
});
