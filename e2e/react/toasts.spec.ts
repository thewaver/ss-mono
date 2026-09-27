import { type Page, expect, test } from "@playwright/test";

import { computedStyle } from "../helpers";

/**
 * The React `Toasts`. The cases follow `e2e/toasts.spec.ts`, which covers the Solid one, so the two frameworks are
 * held to the same behavior: the announcer regions, the hotkey route in and out, the owner told of each boundary, the
 * duration elapsing, the exit played after leaving the list, hovering holding the countdown, both overflow modes, the
 * pause arithmetic on a stepped clock, and a hidden tab holding every countdown. The story's stack is limited to three,
 * as the Playground's starts. The gallery renders under `StrictMode`, which mounts every effect twice, and the fader
 * reports a fade in beginning each time — so the arrival boundary is asserted as having been reported, not as having
 * been reported once.
 */
const STORY = "Essentials/Toasts/Default";

const REGION = '[role="region"]';
const TOASTS = `${REGION} > *`;
const COUNTDOWN = "[data-countdown]";
const POLITE_LOG = '[role="log"][aria-live="polite"]';
const ASSERTIVE_LOG = '[role="log"][aria-live="assertive"]';

const DISMISS_TIMEOUT_MS = 10_000;
const DURATION_MS = 4_000;
const TRANSITION_MS = 300;

const queue = (page: Page) => page.locator('[data-readout="queue"]');

test("both announcer regions exist before there is anything to announce", async ({ page, mount }) => {
    await mount(STORY);

    await expect(page.locator(REGION), "the visible region is mounted with an empty queue").toHaveCount(1);
    await expect(
        page.locator(REGION),
        "and carries no politeness of its own, because it cannot carry two",
    ).not.toHaveAttribute("aria-live", /.*/);
    await expect(page.locator(POLITE_LOG), "the polite announcer is waiting").toHaveCount(1);
    await expect(page.locator(ASSERTIVE_LOG), "and so is the assertive one").toHaveCount(1);
    await expect(page.locator(TOASTS), "with nothing in either yet").toHaveCount(0);
});

test("a stack with nothing to build announcements with is a live region itself", async ({ page, mount }) => {
    await mount(STORY, { isAnnounced: false });

    await expect(page.locator(REGION)).toHaveAttribute("aria-live", "polite");
    await expect(page.locator(REGION)).toHaveAttribute("aria-label", "Notifications");
});

test("a toast is announced at its own urgency rather than the region's", async ({ page, mount }) => {
    await mount(STORY);

    await page.locator("#raiseSuccess").click();

    await expect(page.locator(POLITE_LOG), "an ordinary toast waits its turn").toContainText("Settings saved.");
    await expect(page.locator(ASSERTIVE_LOG), "and does not interrupt anything").not.toContainText("Settings saved.");

    await page.locator("#raiseError").click();

    await expect(page.locator(ASSERTIVE_LOG), "a failure interrupts").toContainText("Upload failed");
    await expect(page.locator(POLITE_LOG), "and is not also announced politely").not.toContainText("Upload failed");
});

test("the stack has a keyboard route into it, and one back out", async ({ page, mount }) => {
    await mount(STORY);

    await page.locator("#raiseInfo").click();
    await expect(page.locator(TOASTS)).toHaveCount(1);

    await page.locator("#raiseInfo").focus();
    await page.keyboard.press("F8");

    expect(
        await page.evaluate((selector) => document.activeElement?.matches(selector) ?? false, REGION),
        "the hotkey puts the focus on the stack, which nothing could otherwise tab to",
    ).toBe(true);

    await page.keyboard.press("Tab");

    expect(
        await page.evaluate(
            (selector) => document.querySelector(selector)?.contains(document.activeElement) ?? false,
            REGION,
        ),
        "and from there the toast's own controls are reachable",
    ).toBe(true);

    await page.keyboard.press("Escape");

    await expect(page.locator("#raiseInfo"), "Escape hands the focus back where it came from").toBeFocused();
});

test("the owner is told when a toast starts arriving and when it starts leaving", async ({ page, mount }) => {
    await mount(STORY);

    await expect(queue(page)).toContainText("shown: 0");

    await page.locator("#raiseSuccess").click();

    await expect(queue(page), "the entry transition is a boundary the list alone cannot show").toContainText(
        /shown: [1-9]/,
    );
    await expect(queue(page), "and nothing has left yet").toContainText("hidden: 0");

    await page.locator("#clearToasts").click();

    await expect(queue(page), "removing it reports the other boundary").toContainText("hidden: 1");
});

test("raising one puts the consumer's own message inside the region", async ({ page, mount }) => {
    await mount(STORY);

    await page.locator("#raiseSuccess").click();

    await expect(page.locator(TOASTS), "raising a toast mounts one entry").toHaveCount(1);
    await expect(page.locator(REGION), "carrying the consumer's message").toContainText("Settings saved.");
    await expect(queue(page), "and the queue the consumer owns says so").toContainText("queued: 1");
});

test("a duration elapsing empties both the queue and the region", async ({ page, mount }) => {
    await mount(STORY);

    await page.locator("#raiseInfo").click();
    await expect(page.locator(TOASTS)).toHaveCount(1);
    await page.mouse.move(0, 0);

    await expect(queue(page), "the component removes the entry from the consumer's list").toContainText("queued: 0", {
        timeout: DISMISS_TIMEOUT_MS,
    });
    await expect(page.locator(TOASTS), "and unmounts it once its exit transition has finished").toHaveCount(0, {
        timeout: DISMISS_TIMEOUT_MS,
    });
});

test("an entry stays mounted while it plays its exit, after leaving the consumer's list", async ({ page, mount }) => {
    await mount(STORY);

    await page.locator("#raiseInfo").click();
    await expect(page.locator(TOASTS)).toHaveCount(1);

    await page.locator(TOASTS).first().locator("button").click();

    await expect(queue(page), "closing removes it from the list the consumer owns").toContainText("queued: 0");
    await expect(page.locator(TOASTS), "while the component holds it mounted for the transition").toHaveCount(1);
    await expect(page.locator(TOASTS), "and drops it when the transition is done").toHaveCount(0, {
        timeout: DISMISS_TIMEOUT_MS,
    });
});

test("hovering the stack holds the countdown the painter draws", async ({ page, mount }) => {
    await mount(STORY);

    await page.locator("#raiseInfo").click();
    await expect(page.locator(COUNTDOWN)).toHaveCount(1);
    await page.mouse.move(0, 0);

    await expect
        .poll(() => computedStyle(page.locator(COUNTDOWN), "animation-play-state"), {
            message: "it runs to begin with",
        })
        .toBe("running");

    await page.locator(TOASTS).first().hover();
    await expect
        .poll(() => computedStyle(page.locator(COUNTDOWN), "animation-play-state"), {
            message: "hovering pauses it, which is the isPaused flag reaching the painter",
        })
        .toBe("paused");

    await page.mouse.move(0, 0);
    await expect
        .poll(() => computedStyle(page.locator(COUNTDOWN), "animation-play-state"), {
            message: "and leaving lets it run again",
        })
        .toBe("running");
});

test("dismiss-oldest trims the consumer's list to the limit", async ({ page, mount }) => {
    await mount(STORY);

    await page.locator("#raiseBurst").click();

    await expect(queue(page), "the component writes the overflow out of the consumer's list").toContainText(
        "queued: 3",
    );
    await expect(page.locator(TOASTS), "leaving the newest three on screen").toHaveCount(3, {
        timeout: DISMISS_TIMEOUT_MS,
    });
});

test("hold-newest keeps the overflow queued rather than dropping it", async ({ page, mount }) => {
    await mount(STORY, { overflow: "hold-newest" });

    await page.locator("#raiseBurst").click();

    await expect(queue(page), "nothing is dropped from the consumer's list").toContainText("queued: 5");
    await expect(page.locator(TOASTS), "and only the limit is rendered, so the rest run no clock").toHaveCount(3);
});

test("a toast is swiped off the edge its stack sits on, and not at all from the middle", async ({ page, mount }) => {
    await mount(STORY);

    await page.locator("#raiseInfo").click();
    await expect(page.locator(`${TOASTS} [data-swipe]`), "a bottom-right stack is swiped right").toHaveAttribute(
        "data-swipe",
        "right",
    );

    await mount(STORY, { alignment: "middle-center" });

    await page.locator("#raiseInfo").click();
    await expect(page.locator(`${TOASTS} [data-swipe]`), "a stack in the middle has no edge").toHaveAttribute(
        "data-swipe",
        "none",
    );

    await mount(STORY, { isDismissableOnSwipe: false });

    await page.locator("#raiseInfo").click();
    await expect(page.locator(`${TOASTS} [data-swipe]`), "and switching it off leaves none").toHaveAttribute(
        "data-swipe",
        "none",
    );
});

test.describe("the pause arithmetic", () => {
    test.beforeEach(async ({ page }) => {
        await page.clock.install();
    });

    test("a toast paused half way through gets its remaining half, not a fresh duration", async ({ page, mount }) => {
        await mount(STORY);

        await page.locator("#raiseInfo").click();
        await expect(page.locator(TOASTS)).toHaveCount(1);
        await page.mouse.move(0, 0);

        await page.clock.runFor(DURATION_MS * 0.5);
        await expect(page.locator(TOASTS), "half the duration is not enough to dismiss it").toHaveCount(1);

        await page.locator(TOASTS).first().hover();
        await expect
            .poll(() => computedStyle(page.locator(COUNTDOWN), "animation-play-state"), {
                message: "hovering holds the countdown",
            })
            .toBe("paused");

        await page.clock.runFor(DURATION_MS * 2);
        await expect(
            page.locator(TOASTS),
            "and while it is held the clock buys nothing — twice the duration passes and it stays",
        ).toHaveCount(1);

        await page.mouse.move(0, 0);
        await expect
            .poll(() => computedStyle(page.locator(COUNTDOWN), "animation-play-state"), { message: "releasing it" })
            .toBe("running");

        await page.clock.runFor(DURATION_MS * 0.5 - TRANSITION_MS);
        await expect(
            queue(page),
            "the remaining half is all it has left, so it goes without a second full wait",
        ).toContainText("queued: 0");
    });

    test("a toast released early keeps the whole of its remaining time", async ({ page, mount }) => {
        await mount(STORY);

        await page.locator("#raiseInfo").click();
        await expect(page.locator(TOASTS)).toHaveCount(1);

        await page.locator(TOASTS).first().hover();
        await page.clock.runFor(DURATION_MS * 2);
        await page.mouse.move(0, 0);

        await page.clock.runFor(DURATION_MS * 0.5);
        await expect(
            queue(page),
            "pausing before any time elapsed leaves the full duration, so half of it is not enough",
        ).toContainText("queued: 1");

        await page.clock.runFor(DURATION_MS);
        await expect(queue(page), "and the rest of it dismisses").toContainText("queued: 0");
    });
});

test.describe("a hidden tab", () => {
    const setHidden = (page: Page, isHidden: boolean) =>
        page.evaluate((hidden) => {
            Object.defineProperty(document, "hidden", { value: hidden, configurable: true });
            document.dispatchEvent(new Event("visibilitychange"));
        }, isHidden);

    test.beforeEach(async ({ page }) => {
        await page.clock.install();
    });

    test("holds every countdown, so a burst raised in the background is still there on return", async ({
        page,
        mount,
    }) => {
        await mount(STORY);

        await page.locator("#raiseInfo").click();
        await expect(page.locator(TOASTS)).toHaveCount(1);
        await page.mouse.move(0, 0);

        await setHidden(page, true);
        await page.clock.runFor(DURATION_MS * 3);

        await expect(
            page.locator(TOASTS),
            "three times the duration passes while the tab is away and the toast survives it",
        ).toHaveCount(1);

        await setHidden(page, false);
        await page.clock.runFor(DURATION_MS - TRANSITION_MS);

        await expect(queue(page), "and the clock resumes from where it was").toContainText("queued: 0");
    });

    test("pauses the countdown the painter draws, the same way hovering does", async ({ page, mount }) => {
        await mount(STORY);

        await page.locator("#raiseInfo").click();
        await expect(page.locator(COUNTDOWN)).toHaveCount(1);
        await page.mouse.move(0, 0);

        await setHidden(page, true);

        await expect
            .poll(() => computedStyle(page.locator(COUNTDOWN), "animation-play-state"), {
                message: "the same isPaused flag reaches the painter",
            })
            .toBe("paused");

        await setHidden(page, false);

        await expect
            .poll(() => computedStyle(page.locator(COUNTDOWN), "animation-play-state"), { message: "and releases" })
            .toBe("running");
    });
});
