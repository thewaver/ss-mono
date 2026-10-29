import { type Page, expect, test } from "@playwright/test";

import { useElementRenderer } from "./helpers";

/**
 * The slice animations and particle components draw on the graphics card by default and fall back to page elements
 * where they cannot. This spec checks only which of the two drew, and that the canvas holds a picture rather than
 * nothing: what each slice does is the same arithmetic on both, and the component specs read it off the elements.
 *
 * The suite's browser runs WebGL in software (`playwright.config.ts`), which is enough to tell a painted canvas from
 * an empty one and says nothing about how a real graphics card draws.
 */

const PAGES: { route: string; start?: (page: Page) => Promise<void> }[] = [
    { route: "/cell-animation" },
    { route: "/scanline-animation" },
    { route: "/rgb-animation" },
    { route: "/particle-field" },
    { route: "/particle-spawner" },
    {
        route: "/particle-dissolve",
        start: (page) => page.locator("#particleDissolveCardBurn").click(),
    },
];

/** The painted pixels in every demo's canvases, read by drawing each canvas onto one of the page's own. */
const paintedPixels = (page: Page) =>
    page.evaluate(() => {
        let painted = 0;

        for (const canvas of document.querySelectorAll<HTMLCanvasElement>("[data-demo] canvas")) {
            const copy = document.createElement("canvas");

            copy.width = canvas.width;
            copy.height = canvas.height;

            const context = copy.getContext("2d");

            if (!context || copy.width === 0 || copy.height === 0) continue;

            context.drawImage(canvas, 0, 0);

            const data = context.getImageData(0, 0, copy.width, copy.height).data;

            for (let i = 3; i < data.length; i += 4) {
                if (data[i] > 0) painted++;
            }
        }

        return painted;
    });

/** The elements in the demos filled with a picture: a cell, a line, a channel or a particle drawn as an element. */
const picturedElements = (page: Page) =>
    page.evaluate(
        () =>
            [...document.querySelectorAll("[data-demo] div")].filter((element) =>
                getComputedStyle(element).backgroundImage.startsWith("url("),
            ).length,
    );

const open = async (page: Page, route: string, start?: (page: Page) => Promise<void>) => {
    await page.goto(route);
    await expect(page.locator("[data-demo]").first()).toBeVisible();
    await start?.(page);
};

for (const { route, start } of PAGES) {
    test(`${route} draws its examples into canvases, not into an element per slice`, async ({ page }) => {
        await open(page, route, start);

        await expect
            .poll(() => paintedPixels(page), { message: "a canvas holds a picture", timeout: 10_000 })
            .toBeGreaterThan(0);

        expect(await picturedElements(page), "and no slice or particle is an element of its own").toBe(0);
    });

    test(`${route} draws with page elements where WebGL 2 is missing`, async ({ page }) => {
        await useElementRenderer(page);
        await open(page, route, start);

        await expect
            .poll(() => picturedElements(page), { message: "slices or particles drawn as elements", timeout: 10_000 })
            .toBeGreaterThan(0);

        await expect(page.locator("[data-demo] canvas"), "and no canvas stands in for them").toHaveCount(0);
    });
}
