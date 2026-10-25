import { type Page, expect, test } from "@playwright/test";

import { computedStyle, docsDemo, docsSettled, prop } from "./helpers";

/**
 * The Docs page holds one `Toasts` provider per example, each at a place of its own, so the page carries several
 * stacks at once. A stack is a region portaled to the end of the document, and nothing on it says which example it
 * belongs to, so a test raises toasts in one example only and then reads "the stack holding toasts"; the tests about
 * several stacks raise in two examples on purpose.
 *
 * The examples used: Basic (Info, Success, Error, four seconds each), Limit (holds its own queue, with a readout of
 * its length and a Limit and Overflow knob), Duration (a Sticky toast that waits to be closed, and a readout of
 * `onShow` and `onHide`), FarDown (reads out what `show` answered), and RightToLeft (Publish, inside a right-to-left
 * box).
 */
const DOCS = "/src/App/Pages/ToastsPage/Docs";

const STACK = '[role="region"]';
const HOLDING = `${STACK}:has(> *)`;
const TOASTS = `${STACK} > *`;
const COUNTDOWN = "[data-countdown]";
const POLITE_LOG = '[role="log"][aria-live="polite"]';
const ASSERTIVE_LOG = '[role="log"][aria-live="assertive"]';

const LIMIT = docsDemo(DOCS, "Limit");
const DURATION = docsDemo(DOCS, "Duration");
const FAR_DOWN = docsDemo(DOCS, "FarDown");

const DISMISS_TIMEOUT_MS = 10_000;

/**
 * Pausing reaches the painter as the countdown's `animation-play-state`, which is the one place the
 * `isPaused` flag becomes something the DOM can show. The arithmetic underneath it — that a toast paused
 * half way through gets its remaining half rather than a fresh full duration — is not in the DOM at any
 * moment, and is driven with a fake clock instead; see the pause arithmetic below. Basic's and Limit's toasts
 * both last this long.
 */
const DURATION_MS = 4_000;
const TRANSITION_MS = 300;

const readoutOf = async (page: Page, demo: string) =>
    ((await page.locator(`${demo} [data-readout]`).textContent()) ?? "").trim();

const queued = async (page: Page) => Number(/\d+/.exec(await readoutOf(page, LIMIT))?.[0]);

const pickOption = async (page: Page, key: string, name: string) => {
    const picker = page.locator(`${prop(key)} [role="combobox"]`);

    await picker.click();
    await page
        .locator(`[id="${await picker.getAttribute("aria-controls")}"]`)
        .getByRole("option", { name, exact: true })
        .click();
};

const knobNumber = async (page: Page, key: string) =>
    Number(/\d+/.exec((await page.locator(`${prop(key)} [role="combobox"]`).textContent()) ?? "")?.[0]);

/** Which stack holds focus, as its place among the page's stacks, or -1 when focus is not on a stack. */
const focusedStack = (page: Page) =>
    page.evaluate((selector) => [...document.querySelectorAll(selector)].indexOf(document.activeElement!), STACK);

const isFocusOnHoldingStack = (page: Page) =>
    page.evaluate(
        (selector) => !!document.activeElement?.matches(selector) && document.activeElement.childElementCount > 0,
        STACK,
    );

test.beforeEach(async ({ page }) => {
    await page.goto("/toasts/docs");
    await expect(page.locator("#raiseInfo")).toBeVisible();
    await docsSettled(page);
});

/**
 * Announcing is the announcer's job rather than the visible region's, so that one toast can be urgent while
 * the next is not: a region carries one politeness for everything inside it, and there is no way to mark one
 * child as more urgent than its box. Both announcer regions are therefore created when a stack mounts —
 * a live region only announces what is inserted after it is already in the document, so one that arrives
 * with the first message may be silent for exactly that message.
 */
test("both announcer regions exist before there is anything to announce", async ({ page }) => {
    expect(await page.locator(STACK).count(), "every stack is mounted with an empty queue").toBeGreaterThan(0);
    expect(
        await page.locator(`${STACK}[aria-live]`).count(),
        "and none carries a politeness of its own, because it cannot carry two",
    ).toBe(0);
    await expect(page.locator(POLITE_LOG), "the polite announcer is waiting").toHaveCount(1);
    await expect(page.locator(ASSERTIVE_LOG), "and so is the assertive one").toHaveCount(1);
    await expect(page.locator(TOASTS), "with nothing in any stack yet").toHaveCount(0);
});

test("a toast is announced at its own urgency rather than the region's", async ({ page }) => {
    await page.locator("#raiseSuccess").click();

    await expect(page.locator(POLITE_LOG), "an ordinary toast waits its turn").toContainText("Settings saved.");
    await expect(page.locator(ASSERTIVE_LOG), "and does not interrupt anything").not.toContainText("Settings saved.");

    await page.locator("#raiseError").click();

    await expect(page.locator(ASSERTIVE_LOG), "a failure interrupts").toContainText("Upload failed");
    await expect(page.locator(POLITE_LOG), "and is not also announced politely").not.toContainText("Upload failed");
});

test("the stack has a keyboard route into it, and one back out", async ({ page }) => {
    await page.locator("#raiseInfo").click();
    await expect(page.locator(TOASTS)).toHaveCount(1);

    await page.locator("#raiseInfo").focus();
    await page.keyboard.press("F8");

    expect(
        await isFocusOnHoldingStack(page),
        "F8 puts the focus on the stack, which nothing could otherwise tab to",
    ).toBe(true);

    await page.keyboard.press("Tab");

    expect(
        await page.evaluate(
            (selector) => document.querySelector(selector)?.contains(document.activeElement) ?? false,
            HOLDING,
        ),
        "and from there the toast's own controls are reachable",
    ).toBe(true);

    await page.keyboard.press("Escape");

    await expect(page.locator("#raiseInfo"), "Escape hands the focus back where it came from").toBeFocused();
});

/**
 * One shortcut reaches every stack on the page: F8 moves to each stack holding toasts in turn, Shift+F8 goes the
 * other way, and a stack with nothing in it is skipped. Two examples raise here — Basic and Duration's sticky toast —
 * so exactly two stacks hold toasts, and the walk can be checked for going round and coming back without naming
 * either stack.
 */
test("F8 reaches every stack holding toasts in turn, Shift+F8 goes back, and Escape returns focus", async ({
    page,
}) => {
    await page.locator("#raiseInfo").click();
    await page.locator("#durationSticky").click();
    await expect(page.locator(HOLDING), "two stacks hold toasts").toHaveCount(2);

    await page.locator("#durationSticky").focus();

    await page.keyboard.press("F8");
    expect(await isFocusOnHoldingStack(page), "F8 lands on a stack holding toasts").toBe(true);
    const first = await focusedStack(page);

    await page.keyboard.press("F8");
    expect(await isFocusOnHoldingStack(page), "the next F8 lands on a stack holding toasts too").toBe(true);
    const second = await focusedStack(page);

    expect(second, "and on the other one, skipping every empty stack between them").not.toBe(first);

    await page.keyboard.press("F8");
    expect(await focusedStack(page), "a third F8 comes round to the first again").toBe(first);

    await page.keyboard.press("Shift+F8");
    expect(await focusedStack(page), "and Shift+F8 walks back the other way").toBe(second);

    await page.keyboard.press("Escape");
    await expect(
        page.locator("#durationSticky"),
        "Escape hands focus back to where it was before the first F8, however many stacks were visited",
    ).toBeFocused();
});

/**
 * F8 is a page shortcut like any other, so it belongs to the page and stays quiet while a dialog sits on top.
 * The Playground's own command palette is a dialog every page has: with it open, F8 leaves focus in the
 * palette's search field rather than pulling it out from under the dialog into a stack the dialog has sealed off.
 */
test("F8 stays quiet while a modal is open", async ({ page }) => {
    const dialog = page.locator('[role="dialog"]');
    const field = page.locator('[role="dialog"] [role="combobox"]');

    await page.locator("#raiseInfo").click();
    await expect(page.locator(TOASTS)).toHaveCount(1);

    await page.keyboard.press("ControlOrMeta+K");
    await expect(dialog, "the palette opens").toBeVisible();
    await expect(field, "with focus in its search field").toBeFocused();

    await page.keyboard.press("F8");

    await expect(field, "F8 leaves focus where the dialog put it").toBeFocused();
    expect(await focusedStack(page), "rather than on a stack beneath the dialog").toBe(-1);
});

test("the owner is told when a toast starts arriving and when it starts leaving", async ({ page }) => {
    const atRest = await readoutOf(page, DURATION);

    await page.locator("#durationSticky").click();
    await expect(page.locator(TOASTS)).toHaveCount(1);

    await expect
        .poll(() => readoutOf(page, DURATION), {
            message: "the entry transition is a boundary the list alone cannot show",
        })
        .not.toBe(atRest);

    const shown = await readoutOf(page, DURATION);

    await page.locator(TOASTS).first().locator("button").click();

    await expect
        .poll(() => readoutOf(page, DURATION), { message: "and closing it reports the other boundary" })
        .not.toBe(shown);
});

test("raising one puts the consumer's own message inside the region", async ({ page }) => {
    await page.locator("#limitRaise").click();

    await expect(page.locator(TOASTS), "raising a toast mounts one entry").toHaveCount(1);
    await expect(
        page.locator(HOLDING),
        "carrying the consumer's message rather than anything the library wrote",
    ).toContainText("Your export is being prepared.");
    await expect.poll(() => queued(page), { message: "and the queue the consumer owns says so" }).toBe(1);
});

test("a duration elapsing empties both the queue and the region", async ({ page }) => {
    await page.locator("#limitRaise").click();
    await expect(page.locator(TOASTS)).toHaveCount(1);

    await expect
        .poll(() => queued(page), {
            message: "the component removes the entry from the consumer's list",
            timeout: DISMISS_TIMEOUT_MS,
        })
        .toBe(0);
    await expect(page.locator(TOASTS), "and unmounts it once its exit transition has finished").toHaveCount(0, {
        timeout: DISMISS_TIMEOUT_MS,
    });
});

test("an entry stays mounted while it plays its exit, after leaving the consumer's list", async ({ page }) => {
    await page.locator("#limitRaise").click();
    await expect(page.locator(TOASTS)).toHaveCount(1);

    await page.locator(TOASTS).first().locator("button").click();

    await expect.poll(() => queued(page), { message: "closing removes it from the list the consumer owns" }).toBe(0);
    await expect(page.locator(TOASTS), "while the component holds it mounted for the transition").toHaveCount(1);
    await expect(page.locator(TOASTS), "and drops it when the transition is done").toHaveCount(0, {
        timeout: DISMISS_TIMEOUT_MS,
    });
});

test("hovering the stack holds the countdown the painter draws", async ({ page }) => {
    await page.locator("#raiseInfo").click();
    await expect(page.locator(COUNTDOWN)).toHaveCount(1);

    expect(await computedStyle(page.locator(COUNTDOWN), "animation-play-state"), "it runs to begin with").toBe(
        "running",
    );

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

/** The burst raises more than the limit the example starts with; both are read off the page. */
test("dismiss_oldest trims the consumer's list to the limit", async ({ page }) => {
    const limit = await knobNumber(page, "limit");

    await page.locator("#limitBurst").click();

    await expect
        .poll(() => queued(page), { message: "the component writes the overflow out of the consumer's list" })
        .toBe(limit);
    await expect(page.locator(TOASTS), "leaving the newest on screen, as many as the limit").toHaveCount(limit, {
        timeout: DISMISS_TIMEOUT_MS,
    });
});

test("hold_newest keeps the overflow queued rather than dropping it", async ({ page }) => {
    const limit = await knobNumber(page, "limit");

    await pickOption(page, "overflow", "hold_newest");
    await page.locator("#limitBurst").click();

    await expect
        .poll(() => queued(page), { message: "nothing is dropped from the consumer's list" })
        .toBeGreaterThan(limit);
    await expect(page.locator(TOASTS), "and only the limit is rendered, so the rest run no clock").toHaveCount(limit);
});

/**
 * Each toast reads in the direction of whatever raised it: the element focused when `show` was called. The stack
 * itself is always laid out left to right, because `alignment` names a side of the screen and flexbox would
 * otherwise measure its start from the text's direction — so the right-to-left example's `middle_left` stack still
 * sits on the left.
 */
test.describe("direction", () => {
    test("each toast takes the direction of what raised it", async ({ page }) => {
        await page.locator("#rightToLeftRaise").click();
        await expect(page.locator(TOASTS)).toHaveCount(1);
        await expect(
            page.locator(TOASTS),
            "raised from inside a right-to-left box, it reads right to left",
        ).toHaveAttribute("dir", "rtl");

        await page.locator("#raiseInfo").click();
        await expect(page.locator(HOLDING)).toHaveCount(2);

        const directions = await page
            .locator(TOASTS)
            .evaluateAll((toasts) => toasts.map((toast) => toast.getAttribute("dir")).sort());

        expect(directions, "while one raised from a left-to-right button reads left to right").toEqual(["ltr", "rtl"]);
    });

    test("the stack keeps dir=ltr, so a side named for the screen stays on that side", async ({ page }) => {
        expect(
            await page
                .locator(STACK)
                .evaluateAll((stacks) => stacks.every((stack) => stack.getAttribute("dir") === "ltr")),
            "every stack, the right-to-left example's included, is laid out left to right",
        ).toBe(true);

        await page.locator("#rightToLeftRaise").click();
        await expect(page.locator(TOASTS)).toHaveCount(1);

        const box = (await page.locator(TOASTS).boundingBox())!;
        const window = page.viewportSize()!;

        expect(
            box.x + box.width * 0.5,
            "the example's middle_left stack is drawn on the left of the screen, not mirrored to the right",
        ).toBeLessThan(window.width * 0.5);
    });
});

/**
 * `show` answers the toast's id, or `undefined` when it refused. The example reads the answer out: a button inside
 * the provider gets an id, and one outside any provider is refused.
 */
test("show returns an id, a fresh one each time, and nothing outside a provider", async ({ page }) => {
    const atRest = await readoutOf(page, FAR_DOWN);
    const answer = async () => /:\s*(.+)$/.exec(await readoutOf(page, FAR_DOWN))?.[1] ?? "";

    await page.locator("#farDownInside").click();
    await expect.poll(() => readoutOf(page, FAR_DOWN)).not.toBe(atRest);

    const firstId = await answer();

    expect(firstId, "a toast raised inside the provider is given an id").not.toBe("undefined");
    expect(firstId.length).toBeGreaterThan(0);

    await page.locator("#farDownInside").click();
    await expect.poll(answer, { message: "the next toast is given another one" }).not.toBe(firstId);
    expect(await answer()).not.toBe("undefined");

    await page.locator("#farDownOutside").click();
    await expect.poll(answer, { message: "and a toast asked for outside any provider is refused" }).toBe("undefined");
});

/**
 * The one behavior here with nowhere to show itself: a toast held half way through its duration must get
 * the remaining half back on release, not a fresh full one. Real time cannot ask that question — waiting
 * four seconds proves nothing about which four seconds elapsed — so time is faked and stepped instead.
 * `install` freezes time until it is advanced, so every step below is deliberate: the toast's own timer, the
 * enter transition and the exit transition all run on the same stepped clock. Limit's example is used for its
 * readout of the queue it holds.
 */
test.describe("the pause arithmetic", () => {
    test.beforeEach(async ({ page }) => {
        await page.clock.install();
        await page.goto("/toasts/docs");
        await expect(page.locator("#limitRaise")).toBeVisible();
    });

    test("a toast paused half way through gets its remaining half, not a fresh duration", async ({ page }) => {
        await page.locator("#limitRaise").click();
        await expect(page.locator(TOASTS)).toHaveCount(1);

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
        await expect
            .poll(() => queued(page), {
                message: "the remaining half is all it has left, so it goes without a second full wait",
            })
            .toBe(0);
    });

    test("a toast released early keeps the whole of its remaining time", async ({ page }) => {
        await page.locator("#limitRaise").click();
        await expect(page.locator(TOASTS)).toHaveCount(1);

        await page.locator(TOASTS).first().hover();
        await page.clock.runFor(DURATION_MS * 2);
        await page.mouse.move(0, 0);

        await page.clock.runFor(DURATION_MS * 0.5);
        expect(
            await queued(page),
            "pausing before any time elapsed leaves the full duration, so half of it is not enough",
        ).toBe(1);

        await page.clock.runFor(DURATION_MS);
        await expect.poll(() => queued(page), { message: "and the rest of it dismisses" }).toBe(0);
    });
});

/**
 * A hidden tab cannot be driven by Playwright — there is no API for backgrounding a page — so the platform's
 * own signal is faked: `document.hidden` is redefined and `visibilitychange` dispatched, which is exactly
 * what the browser does when a tab goes away. The clock is faked alongside it, because the question is
 * whether the duration was consumed while nobody could see it.
 */
test.describe("a hidden tab", () => {
    const setHidden = (page: Page, isHidden: boolean) =>
        page.evaluate((hidden) => {
            Object.defineProperty(document, "hidden", { value: hidden, configurable: true });
            document.dispatchEvent(new Event("visibilitychange"));
        }, isHidden);

    test.beforeEach(async ({ page }) => {
        await page.clock.install();
        await page.goto("/toasts/docs");
        await expect(page.locator("#limitRaise")).toBeVisible();
    });

    test("holds every countdown, so a burst raised in the background is still there on return", async ({ page }) => {
        await page.locator("#limitRaise").click();
        await expect(page.locator(TOASTS)).toHaveCount(1);

        await setHidden(page, true);
        await page.clock.runFor(DURATION_MS * 3);

        await expect(
            page.locator(TOASTS),
            "three times the duration passes while the tab is away and the toast survives it",
        ).toHaveCount(1);

        await setHidden(page, false);
        await page.clock.runFor(DURATION_MS - TRANSITION_MS);

        await expect.poll(() => queued(page), { message: "and the clock resumes from where it was" }).toBe(0);
    });

    test("pauses the countdown the painter draws, the same way hovering does", async ({ page }) => {
        await page.locator("#limitRaise").click();
        await expect(page.locator(COUNTDOWN)).toHaveCount(1);

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
