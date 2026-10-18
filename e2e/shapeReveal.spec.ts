import { type Page, expect, test } from "@playwright/test";

import { demo, prop, readout, revealProp } from "./helpers";

/**
 * The page's one example is a button that keeps switching the Playground's theme through `ShapeReveal`, pausing
 * between switches, until it is pressed again or the page is left. Every check here is a relationship rather than
 * a theme written down: which theme a Playground starts on is that framework's own, and which one comes next is
 * random, so the spec asks only that the theme changed, that it never "changed" to itself, that it stopped when
 * told to, and that the settings' Theme select names the theme the readout names.
 *
 * The duration is set to 0 first, so each switch happens at once rather than through a view transition, and the
 * pause is left at the page's own starting value. Nothing then depends on how long an animation takes.
 */
const BUTTON = `${demo("themeCycle")} button`;
const VIEW_TABS = "[data-view-tabs]";

const SWITCHES_TO_WATCH = 3;
const SWITCH_TIMEOUT_MS = 5_000;

const themeClass = (page: Page) => page.evaluate(() => document.documentElement.className);

const delayMs = async (page: Page) => Number(await page.locator(`${prop("delayMs")} input`).inputValue());

const waitForSwitch = async (page: Page, previous: string) => {
    await expect.poll(() => readout(page, "themeCycle"), { timeout: SWITCH_TIMEOUT_MS }).not.toBe(previous);

    return readout(page, "themeCycle");
};

test.beforeEach(async ({ page }) => {
    await page.goto("/shape-reveal");
    await expect(page.locator(BUTTON)).toBeVisible();

    await revealProp(page, "durationMs");
    const duration = page.locator(`${prop("durationMs")} input`);

    await duration.fill("0");
    await duration.press("Enter");
});

test("starting it switches the theme again and again, never to the one already showing", async ({ page }) => {
    let previous = await readout(page, "themeCycle");
    let previousClass = await themeClass(page);

    await page.locator(BUTTON).click();
    await expect(page.locator(BUTTON), "the same button now stops it").toHaveText("Stop cycling");

    for (let index = 0; index < SWITCHES_TO_WATCH; index++) {
        const next = await waitForSwitch(page, previous);
        const nextClass = await themeClass(page);

        expect(next, "every switch lands on a theme other than the one before it").not.toBe(previous);
        expect(nextClass, "and is applied to the page, not only reported").not.toBe(previousClass);

        previous = next;
        previousClass = nextClass;
    }
});

test("pressing it again stops it where it is", async ({ page }) => {
    await page.locator(BUTTON).click();
    await waitForSwitch(page, await readout(page, "themeCycle"));

    await page.locator(BUTTON).click();
    await expect(page.locator(BUTTON)).toHaveText("Start cycling");

    const stoppedOn = await readout(page, "themeCycle");
    const stoppedClass = await themeClass(page);

    await page.waitForTimeout((await delayMs(page)) * 2);

    expect(await readout(page, "themeCycle"), "nothing switches once it is stopped").toBe(stoppedOn);
    expect(await themeClass(page)).toBe(stoppedClass);
});

test("leaving the examples stops it", async ({ page }) => {
    await page.locator(BUTTON).click();
    await waitForSwitch(page, await readout(page, "themeCycle"));

    const pause = await delayMs(page);

    await page.locator(VIEW_TABS).getByRole("tab", { name: "Docs" }).click();
    await expect(page.locator(BUTTON)).toHaveCount(0);

    const leftOn = await themeClass(page);

    await page.waitForTimeout(pause * 2);

    expect(await themeClass(page), "no switch happens once the button is gone").toBe(leftOn);
});

test("the settings' Theme select names the theme the button switched to", async ({ page }) => {
    await page.locator(BUTTON).click();
    await waitForSwitch(page, await readout(page, "themeCycle"));
    await page.locator(BUTTON).click();

    const shown = await readout(page, "themeCycle");

    await revealProp(page, "theme", "library");
    const selected = ((await page.locator(`${prop("theme")} [role="combobox"]`).textContent()) ?? "").trim();

    expect(selected.length, "the select shows a theme").toBeGreaterThan(0);
    expect(shown, "and it is the one the page is showing").toContain(selected);
});
