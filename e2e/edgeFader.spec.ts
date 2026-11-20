import { type Page, expect, test } from "@playwright/test";

import { docsDemo, docsSettled } from "./helpers";

/**
 * An `EdgeFader` around content that overflows is a scrolling box, and a keyboard user can only scroll a box by
 * focusing something in it. The Docs examples hold only text, so the fader itself must take focus while it
 * overflows (WCAG 2.1.1), and must not while everything fits, or Tab stops on a box with nothing to do.
 */
const DOCS = "/src/App/Pages/EdgeFaderPage/Docs";

const OVERFLOWING = docsDemo(DOCS, "Basic");
const FITTING = docsDemo(DOCS, "Unscrolled");
const SCROLL_AWARE = docsDemo(DOCS, "ScrollAware");

/** The box a scroll-aware fader masks: the only element in the demo that both carries a mask and scrolls. */
const readMask = (page: Page, scope: string) =>
    page.evaluate((selector) => {
        const box = [...document.querySelectorAll<HTMLElement>(`${selector} *`)].find(
            (element) =>
                (element.scrollWidth > element.clientWidth || element.scrollHeight > element.clientHeight) &&
                element.style.maskImage !== "",
        );

        return box?.style.maskImage ?? "";
    }, scope);

test.beforeEach(async ({ page }) => {
    await page.goto("/edge-fader/docs");
    await expect(page.locator(OVERFLOWING)).toBeVisible();
    await docsSettled(page);
});

test("a fader whose content overflows takes focus, as a named region", async ({ page }) => {
    const region = page.locator(OVERFLOWING).getByRole("region", { name: "Rows" });

    await expect(region).toHaveAttribute("tabindex", "0");
});

test("a fader whose content fits takes no focus", async ({ page }) => {
    await expect(page.locator(FITTING)).toBeVisible();
    await expect(page.locator(`${FITTING} [tabindex]`)).toHaveCount(0);
});

test("a scroll-aware fader redraws its fades when its box is scrolled", async ({ page }) => {
    const atRest = await readMask(page, SCROLL_AWARE);

    expect(atRest).not.toBe("");

    await page.locator(SCROLL_AWARE).hover();
    await page.mouse.wheel(200, 0);

    await expect.poll(() => readMask(page, SCROLL_AWARE)).not.toBe(atRest);
});
