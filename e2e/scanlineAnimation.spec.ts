import { type Page, expect, test } from "@playwright/test";

import { demo } from "./helpers";

/**
 * Each example on the page has its own pause button and scrubber, driving its own playback and progress. The lines'
 * motion is the consumer's function and is not judged here; what is read is that the controls reach the right
 * example: pausing one leaves the others running, a paused example holds its frame, and scrubbing it moves its lines.
 *
 * An example is found by its key, and its controls by the id the page composes from it (`_wave` drives
 * `#scanlineWave…`). An example with no scrubber, such as the stress test, is skipped. An effect can look the same
 * at two points of its pass, and one that swings a whole number of times per pass rests at every quarter, so movement
 * is read at several uneven points rather than one, stepping on from each to the next. The sweep visits every example
 * by keyboard, a thousand key presses in all, so it is given longer than the default to finish.
 */
const HOLD_MS = 300;
const SCRUB_POINTS = [13, 37, 61, 89];
const SWEEP_TIMEOUT_MS = 120_000;

const toControlId = (key: string) => `scanline${key.replace(/^_/, "").replace(/^./, (first) => first.toUpperCase())}`;

const readFrame = (page: Page, key: string) =>
    page
        .locator(demo(key))
        .evaluate((root) =>
            [...root.querySelectorAll<HTMLElement>("div")]
                .map((element) => `${element.style.transform}|${element.style.filter}|${element.style.opacity}`)
                .join(";"),
        );

const pause = async (page: Page, id: string) => {
    await page.locator(`#${id}Playback`).click();
    await expect(page.locator(`#${id}Playback`)).toHaveAccessibleName("Play");
};

const scrubTo = async (page: Page, id: string, percent: number) => {
    await page.locator(`#${id}Progress`).focus();
    await page.keyboard.press("Home");

    for (let i = 0; i < percent; i++) await page.keyboard.press("ArrowRight");
};

const readScrubbedKeys = async (page: Page) => {
    const keys = await page.locator("[data-example]").evaluateAll((cards) => cards.map((card) => card.dataset.testid!));
    const scrubbed: string[] = [];

    for (const key of keys) {
        if ((await page.locator(`#${toControlId(key)}Playback`).count()) > 0) scrubbed.push(key);
    }

    return scrubbed;
};

test.beforeEach(async ({ page }) => {
    await page.goto("/scanline-animation");
    await expect(page.locator("[data-example]").first()).toBeVisible();
});

test("pausing one example leaves the others running", async ({ page }) => {
    const [first, second] = await readScrubbedKeys(page);

    expect(second, "the page has at least two examples with their own controls").toBeDefined();

    await pause(page, toControlId(first));

    await expect(page.locator(`#${toControlId(second)}Playback`)).toHaveAccessibleName("Pause");
});

test("every example's scrubber moves its own lines, and a paused example holds its frame", async ({ page }) => {
    test.setTimeout(SWEEP_TIMEOUT_MS);

    const keys = await readScrubbedKeys(page);

    expect(keys.length).toBeGreaterThan(0);

    for (const key of keys) {
        const id = toControlId(key);

        await pause(page, id);
        await scrubTo(page, id, 0);

        const start = await readFrame(page, key);

        const frames: string[] = [];

        let at = 0;

        for (const percent of SCRUB_POINTS) {
            for (; at < percent; at++) await page.keyboard.press("ArrowRight");

            frames.push(await readFrame(page, key));
        }

        expect(
            frames.some((frame) => frame !== start),
            `${key} moves when scrubbed`,
        ).toBe(true);

        const held = await readFrame(page, key);

        await page.waitForTimeout(HOLD_MS);

        expect(await readFrame(page, key), `${key} holds while paused`).toBe(held);
    }
});
