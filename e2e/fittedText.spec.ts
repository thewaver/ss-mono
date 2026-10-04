import { type Page, expect, test } from "@playwright/test";

import { demo, prop } from "./helpers";

/**
 * `FittedText` sizes each line to the full width of its box, then shrinks the whole stack by one factor until it fits
 * the height. So the checks are relationships between the lines and the box: lines scaled by the same factor stay
 * equally wide, a box that runs out of width first leaves every line exactly as wide as itself, and the stack never
 * stands taller than its box. Sizes are read in layout space, so the window's scale does not enter.
 */
const POSTER = demo("poster");
const STACK = demo("stack");
const WIDTH_TOLERANCE = 0.04;

const measure = (page: Page, scope: string) =>
    page.evaluate((selector) => {
        const lines = [...document.querySelectorAll<HTMLElement>(`${selector} span`)];
        const box = lines[0].parentElement!;

        return {
            boxWidth: box.clientWidth,
            boxHeight: box.clientHeight,
            widths: lines.map((line) => line.offsetWidth),
            fontSizes: lines.map((line) => parseFloat(line.style.fontSize)),
            stackHeight: lines.reduce((sum, line) => sum + line.offsetHeight, 0),
        };
    }, scope);

const firstFontSize = (page: Page, scope: string) =>
    page.evaluate(
        (selector) => parseFloat(document.querySelector<HTMLElement>(`${selector} span`)?.style.fontSize ?? "0"),
        scope,
    );

test.beforeEach(async ({ page }) => {
    await page.goto("/fitted-text");
    await expect.poll(() => firstFontSize(page, POSTER)).toBeGreaterThan(0);
    await expect.poll(() => firstFontSize(page, STACK)).toBeGreaterThan(0);
});

test("a stack that runs out of height shrinks as one, so its lines stay equally wide and it fits the box", async ({
    page,
}) => {
    const poster = await measure(page, POSTER);
    const widest = Math.max(...poster.widths);

    for (const width of poster.widths) expect(width / widest).toBeGreaterThan(1 - WIDTH_TOLERANCE);

    expect(poster.stackHeight, "the stack fits the box's height").toBeLessThanOrEqual(poster.boxHeight + 1);
    expect(poster.fontSizes[1], "a short line comes out larger than a long one").toBeGreaterThan(poster.fontSizes[3]);
});

test("a box that runs out of width first leaves every line as wide as the box", async ({ page }) => {
    const stack = await measure(page, STACK);

    for (const width of stack.widths) expect(width / stack.boxWidth).toBeGreaterThan(1 - WIDTH_TOLERANCE);
});

test("taller lines leave less room, so the stack shrinks", async ({ page }) => {
    const before = await measure(page, POSTER);

    await page.locator(`${prop("lineHeightRatio")} input`).fill("1.8");
    await page.locator(`${prop("lineHeightRatio")} input`).blur();

    await expect.poll(async () => (await measure(page, POSTER)).fontSizes[0]).toBeLessThan(before.fontSizes[0]);
});
