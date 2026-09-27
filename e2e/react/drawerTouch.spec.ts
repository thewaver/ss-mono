import { type Page, expect, test } from "@playwright/test";

/**
 * The React `Drawer` under a finger. The cases follow `e2e/drawerTouch.spec.ts`, which covers the Solid one: the
 * browser decides at the first move whether a touch belongs to it or to the page, and a gesture it claims arrives as
 * a `pointercancel`, so the drags here are real touches sent through the Chrome DevTools Protocol rather than
 * Playwright's own touch API, which only taps.
 *
 * The case that matters is a sheet whose own content scrolls. Pushing it down while the content sits at the top must
 * move the sheet; pushing it down after scrolling must scroll the content back instead.
 */
const DIALOG = '[aria-modal="true"]';
const PANEL = `${DIALOG} > *`;
const STORY = "Essentials/Drawer/Default";
const TOUCH_STEPS = 12;
const SETTLED_PX = 1;
const REST_POLL_MS = 100;

const dragFinger = async (page: Page, x: number, from: number, to: number) => {
    const session = await page.context().newCDPSession(page);
    const at = (y: number) => [{ x, y, radiusX: 10, radiusY: 10, force: 1, id: 1 }];

    await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: at(from) });

    for (let step = 1; step <= TOUCH_STEPS; step++) {
        await session.send("Input.dispatchTouchEvent", {
            type: "touchMove",
            touchPoints: at(from + ((to - from) * step) / TOUCH_STEPS),
        });
    }

    await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await session.detach();
};

const scrollTop = (page: Page) => page.locator(PANEL).evaluate((element) => element.scrollTop);

/** A flung scroller keeps moving after the finger has gone, so a reading is only usable once it repeats. */
const restedScrollTop = async (page: Page) => {
    let previous = await scrollTop(page);

    for (;;) {
        await page.waitForTimeout(REST_POLL_MS);

        const current = await scrollTop(page);

        if (current === previous) return current;

        previous = current;
    }
};

const hasPanelSettled = async (page: Page) => {
    const dialog = (await page.locator(DIALOG).boundingBox())!;
    const panel = (await page.locator(PANEL).boundingBox())!;

    return Math.abs(dialog.y - panel.y) < SETTLED_PX;
};

const openSheet = async (page: Page) => {
    await page.getByTestId("open").click();
    await expect(page.locator(DIALOG)).toBeVisible();
    await expect.poll(() => hasPanelSettled(page)).toBe(true);
};

test.use({ hasTouch: true });

test("a sheet whose content overflows is one that really does scroll", async ({ page, mount }) => {
    await mount(STORY, { edge: "bottom" });
    await openSheet(page);

    expect(
        await page.locator(PANEL).evaluate((element) => element.scrollHeight > element.clientHeight),
        "otherwise the rest of this file proves nothing",
    ).toBe(true);
});

test("a finger pushing a sheet down from the top of its content dismisses it", async ({ page, mount }) => {
    await mount(STORY, { edge: "bottom" });
    await openSheet(page);

    const box = (await page.locator(DIALOG).boundingBox())!;

    await dragFinger(page, box.x + box.width * 0.5, box.y + box.height * 0.2, box.y + box.height * 0.95);

    await expect(page.locator(DIALOG), "the sheet had nothing above to scroll to, so it took the gesture").toHaveCount(
        0,
    );
});

test("a finger pushing the same sheet down after reading scrolls it back instead", async ({ page, mount }) => {
    await mount(STORY, { edge: "bottom" });
    await openSheet(page);

    const box = (await page.locator(DIALOG).boundingBox())!;
    const x = box.x + box.width * 0.5;

    await dragFinger(page, x, box.y + box.height * 0.8, box.y + box.height * 0.2);

    const scrolled = await restedScrollTop(page);

    expect(scrolled, "pushing up scrolls the content, because that is what a scroller is for").toBeGreaterThan(0);

    await dragFinger(page, x, box.y + box.height * 0.2, box.y + box.height * 0.95);

    await expect(
        page.locator(DIALOG),
        "and pushing back down returns the content rather than dismissing",
    ).toBeVisible();
    expect(await restedScrollTop(page), "the scroller took the gesture, so it ends up nearer its top").toBeLessThan(
        scrolled,
    );
});
