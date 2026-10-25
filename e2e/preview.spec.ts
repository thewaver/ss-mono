import { type Page, expect, test } from "@playwright/test";

import { docsDemo, docsSettled, inputValue, offsetHeight, prop, scrollTop } from "./helpers";

const DOCS = "/src/App/Pages/PreviewPage/Docs";

const BASIC = docsDemo(DOCS, "Basic");
const SHORT = docsDemo(DOCS, "Short");
const CONTROLLED = docsDemo(DOCS, "Controlled");
const SCROLLED = docsDemo(DOCS, "Scrolled");

const TRANSITION_TIMEOUT_MS = 5_000;

const trigger = (scope: string) => `${scope} button[aria-expanded]`;

const heightKnob = (page: Page) => page.locator(`${prop("collapsedHeight")} input`);

/** The height Basic's knob gives the preview while it is closed, read off the knob rather than written down here. */
const collapsedHeight = async (page: Page) => Number(await inputValue(heightKnob(page)));

/**
 * The clipped box is found through the control that owns it rather than by a class, which is also the
 * assertion that the two are wired together: a trigger whose `aria-controls` pointed at nothing would fail
 * here before any height was measured.
 */
const contentBox = async (page: Page, scope: string) => {
    const id = await page.locator(trigger(scope)).getAttribute("aria-controls");

    return page.locator(`[id="${id}"]`);
};

test.beforeEach(async ({ page }) => {
    await page.goto("/preview/docs");
    await expect(page.locator(trigger(BASIC))).toBeVisible();
    await docsSettled(page);
});

test("content taller than the height it was given is cut to it", async ({ page }) => {
    const box = await contentBox(page, BASIC);
    const given = await collapsedHeight(page);

    expect(await offsetHeight(box), "the box is exactly the height the consumer asked for").toBe(given);
    expect(
        await offsetHeight(box.locator("> *").first()),
        "while the content inside it is taller, which is what there is to open",
    ).toBeGreaterThan(given);
});

test("a new collapsed height is the height the closed box takes", async ({ page }) => {
    const box = await contentBox(page, BASIC);
    const before = await collapsedHeight(page);

    await heightKnob(page).click();
    await page.keyboard.press("ArrowUp");
    await page.keyboard.press("Tab");

    const after = await collapsedHeight(page);

    expect(after, "the knob stepped to a new height").not.toBe(before);
    await expect.poll(() => offsetHeight(box), { message: "and the closed box follows it" }).toBe(after);
});

/**
 * The line this component sits on the other side of from `Collapsible`. A collapsed disclosure hides its
 * panel from everyone, so `inert` is right there. Here the opening lines are on screen and being read, and
 * `inert` cannot be lifted off part of a text flow — so the remainder stays in the accessibility tree and
 * the control is an affordance for the eye. Asserted because it is the kind of thing a later change would
 * "tidy up" by copying `Collapsible`.
 */
test("nothing is hidden from a screen reader, because the opening lines are on screen", async ({ page }) => {
    const box = await contentBox(page, BASIC);
    const last = box.locator("> * > *").last();

    await expect(box, "the box is never inert").not.toHaveAttribute("inert");
    await expect(last, "and the text past the cut is still in the document").toBeAttached();
    expect(
        await box.evaluate((element) => {
            const paragraphs = element.firstElementChild!.children;
            const last = paragraphs[paragraphs.length - 1];

            return last.getBoundingClientRect().bottom - element.getBoundingClientRect().bottom;
        }),
        "though it does run past the cut",
    ).toBeGreaterThan(0);
});

test("the control opens it the rest of the way and says which state it is in", async ({ page }) => {
    const box = await contentBox(page, BASIC);
    const target = await offsetHeight(box.locator("> *").first());
    const given = await collapsedHeight(page);

    await expect(page.locator(trigger(BASIC)), "closed to begin with").toHaveAttribute("aria-expanded", "false");

    await page.locator(trigger(BASIC)).click();

    await expect(page.locator(trigger(BASIC))).toHaveAttribute("aria-expanded", "true");
    await expect.poll(() => offsetHeight(box), { timeout: TRANSITION_TIMEOUT_MS }).toBe(target);

    await page.locator(trigger(BASIC)).click();

    await expect(page.locator(trigger(BASIC))).toHaveAttribute("aria-expanded", "false");
    await expect.poll(() => offsetHeight(box), { timeout: TRANSITION_TIMEOUT_MS }).toBe(given);
});

/**
 * Both sides write the shared boolean. The owner's button flips the owner's own value, so pressing it after the
 * preview's own control has opened the preview closes it only if that press wrote the owner's value too.
 */
test("held from outside, the owner's boolean and the preview's control move together", async ({ page }) => {
    const toggle = page.locator(`${CONTROLLED} #toggleFromHere`);

    await toggle.click();
    await expect(page.locator(trigger(CONTROLLED)), "writing the owner's value opens the preview").toHaveAttribute(
        "aria-expanded",
        "true",
    );

    await toggle.click();
    await expect(page.locator(trigger(CONTROLLED)), "and writing it back closes it").toHaveAttribute(
        "aria-expanded",
        "false",
    );

    await page.locator(trigger(CONTROLLED)).click();
    await expect(page.locator(trigger(CONTROLLED))).toHaveAttribute("aria-expanded", "true");

    await toggle.click();
    await expect(
        page.locator(trigger(CONTROLLED)),
        "the preview's own control wrote the owner's boolean, so the owner's flip closes it",
    ).toHaveAttribute("aria-expanded", "false");
});

/**
 * A control that opens nothing is worse than no control: it invites a press and then does not reward it. So
 * the same component, given the same height as Basic starts with and less content, renders neither the control
 * nor the fade.
 */
test("content that already fits gets no control at all", async ({ page }) => {
    await expect(page.locator(trigger(SHORT)), "no control").toHaveCount(0);

    const box = page.locator(`${SHORT} > * > *`).first();
    const content = page.locator(`${SHORT} [id] > *`).first();

    await expect
        .poll(async () => (await offsetHeight(box)) - (await offsetHeight(content)), {
            message: "the box settles on its content's height",
        })
        .toBe(0);
    expect(await offsetHeight(box), "rather than the one it was given").toBeLessThan(await collapsedHeight(page));
});

/**
 * The scroll is opt-in, off by default, and it fires on the way **in** rather than on the way out — which is
 * the opposite of `Accordion`'s. Opening pushes what is below further down and leaves the reader where they
 * were, which is right; closing pulls it up by the height that just vanished and takes the control they
 * pressed with it, which is not. The box holds the preview plus more text under it, so there is something to
 * be pulled up. The example's knob starts on, since the scroll is what the section shows.
 */
const scrollBox = (page: Page) => page.locator(`${SCROLLED} [data-scroll-box]`);

const SETTLE_MS = 500;

test("closing brings the control back rather than leaving the reader further down", async ({ page }) => {
    await page.locator(trigger(SCROLLED)).click();
    await page.waitForTimeout(SETTLE_MS);

    await scrollBox(page).evaluate((element) => {
        element.scrollTop = element.scrollHeight;
    });
    await page.waitForTimeout(SETTLE_MS);

    const deepIn = await scrollTop(scrollBox(page));

    expect(deepIn, "the reader is at the end of the opened text").toBeGreaterThan(0);

    await page.locator(trigger(SCROLLED)).click();
    await page.waitForTimeout(SETTLE_MS);

    const box = (await scrollBox(page).boundingBox())!;
    const pressed = (await page.locator(trigger(SCROLLED)).boundingBox())!;

    expect(pressed.y, "the control they pressed is still inside the box").toBeGreaterThanOrEqual(box.y - 2);
    expect(pressed.y + pressed.height, "and not past the bottom of it either").toBeLessThanOrEqual(
        box.y + box.height + 2,
    );
});
