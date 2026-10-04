import { type Page, expect, test } from "@playwright/test";

import { demo, readout } from "./helpers";

/**
 * The page changes the word on a timer and `MorphText` melts one word into the next. While a melt runs there are two
 * copies, the outgoing one hidden from screen readers and the incoming one carrying the text, under a filter on the
 * component's box; at rest there is one copy and no filter. Whether a melt is running is read off that structure,
 * never off what the blur looks like.
 */
const WORDS = demo("words");
const CYCLE_MS = 2600;

const shownWord = async (page: Page) => (await readout(page, "words")).match(/^showing: (\S+)/)![1];

test("at rest there is one copy, and it carries the word the page shows", async ({ page }) => {
    await page.goto("/morph-text");
    await expect.poll(() => shownWord(page)).not.toBe("");

    const word = await shownWord(page);

    await expect(page.locator(`${WORDS} [aria-hidden="true"]`, { hasText: word })).toHaveCount(0);
    await expect(page.locator(WORDS)).toContainText(word);
});

test("a change of word melts through two copies, the outgoing one hidden from screen readers", async ({ page }) => {
    await page.goto("/morph-text");
    await expect.poll(() => shownWord(page)).not.toBe("");

    const first = await shownWord(page);

    await expect
        .poll(() => page.locator(`${WORDS} span[aria-hidden="true"]`, { hasText: first }).count(), {
            timeout: CYCLE_MS * 2,
        })
        .toBe(1);
    await expect.poll(() => shownWord(page)).not.toBe(first);
});

test("Pause stops the words changing", async ({ page }) => {
    await page.goto("/morph-text");
    await expect.poll(() => shownWord(page)).not.toBe("");

    await page.locator("#morphWordsPlayback").click();

    const paused = await shownWord(page);

    await page.waitForTimeout(CYCLE_MS * 1.5);

    expect(await shownWord(page)).toBe(paused);
});

test("under reduced motion the word swaps with no melt", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/morph-text");
    await expect.poll(() => shownWord(page)).not.toBe("");

    const first = await shownWord(page);
    const sawTwoCopies = page.evaluate(
        ({ selector, waitMs }) =>
            new Promise<boolean>((resolve) => {
                let seen = false;
                const observer = new MutationObserver(() => {
                    if (document.querySelector(`${selector} span[aria-hidden="true"]`)) seen = true;
                });

                observer.observe(document.querySelector(selector)!, { subtree: true, childList: true });
                setTimeout(() => {
                    observer.disconnect();
                    resolve(seen);
                }, waitMs);
            }),
        { selector: WORDS, waitMs: CYCLE_MS * 1.5 },
    );

    expect(await sawTwoCopies, "no outgoing copy ever appeared").toBe(false);
    expect(await shownWord(page), "and the word still moved on").not.toBe(first);
});
