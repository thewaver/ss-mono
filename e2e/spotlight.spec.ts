import { type Page, expect, test } from "@playwright/test";

import { activeText, demo, readout, scrollTop } from "./helpers";

const HINT = demo("hint");
const PROMPT = demo("prompt");
const GUIDE = demo("guide");

const SETTLE_MS = 300;

/**
 * The overlay is portalled and every part of it is styled through a hashed class, so these key on what the
 * geometry produces rather than on names: one transparent layer carries an inline `clip-path` with the
 * highlighted rect cut out of it, which is what keeps the pointer off everything but the hole, and the
 * corner polygons are what the consumer's `renderHighlight` draws. The even-odd fill rule is what makes the
 * inner ring a hole rather than a second filled box, so it is the part of the value worth keying on — a bare
 * `clip-path` would also catch the announcer's visually-hidden region, which clips itself to nothing.
 */
const BLOCKER = 'div[style*="polygon(evenodd"]';
const CORNERS = "svg polygon";
const POPUP = '[role="dialog"]';
const TOOLTIP = '[role="tooltip"]';

/** Every layer the spotlight paints sits here, so a tooltip that is to stay readable has to beat it. */
const SPOTLIGHT_Z_INDEX = 10;

const button = (scope: string, name: string) => `${scope} button:has-text("${name}")`;

/** The popup is portalled out of its variant container, so its own buttons are scoped to the dialog. */
const popupButton = (name: string) => `${POPUP} button:has-text("${name}")`;

const isFocusInsidePopup = (page: Page) =>
    page.evaluate(() => {
        const popup = document.querySelector('[role="dialog"]');

        return !!popup && !!document.activeElement && popup.contains(document.activeElement);
    });

/**
 * The hint's own triggers sit inside a container running a looping CSS slide, so they never stop moving and
 * Playwright's stability check can never pass — a pointer click there waits out the full timeout. Focus and
 * Enter need no geometry, and a keyboard user reaching a moving button is the same journey.
 */
const pressByKeyboard = async (page: Page, selector: string) => {
    await page.locator(selector).first().focus();
    await page.keyboard.press("Enter");
};

/**
 * The hint's triggers loop forever, which is also what stops a pointer action from ever settling. Pausing the
 * looping animations and leaving every other one alone gives the pointer something to land on without
 * freezing the fades the spotlight and the tooltip run to show themselves.
 */
const stopSliding = (page: Page) =>
    page.evaluate(() => {
        for (const animation of document.getAnimations()) {
            if (animation.effect?.getTiming().iterations === Infinity) animation.pause();
        }
    });

test.beforeEach(async ({ page }) => {
    await page.goto("/spotlight");
    await expect(page.locator(button(HINT, "Highlight Me")).first()).toBeVisible();
});

test("nothing is portalled before anything is highlighted", async ({ page }) => {
    await expect(page.locator(BLOCKER), "nothing is holding the pointer off the page").toHaveCount(0);
    await expect(page.locator(CORNERS), "and no highlight decoration").toHaveCount(0);
});

test("opening lays one clipped layer over the page with the element cut out of it", async ({ page }) => {
    await pressByKeyboard(page, button(HINT, "Highlight Me"));

    await expect(page.locator(BLOCKER), "one layer rather than a ring of boxes").toHaveCount(1);
    await expect(page.locator(CORNERS), "and the consumer's four corner marks").toHaveCount(4);
});

/**
 * A spotlight's whole promise is that the highlighted element stays readable, and a tooltip describing that
 * element is part of what has to be read. The tooltip works out its own height by walking up from its anchor
 * and going one above the tallest thing it passes — and the overlay is not on that walk, because it is a
 * sibling in the portal rather than an ancestor of the button. So the height has to be published rather than
 * discovered, which is what the elevation registry does. The second half of this is the half that matters: it
 * is the spotlight granting the lift, not tooltips outranking overlays everywhere.
 *
 * The lift is asserted without hovering a second time, because the tooltip is already open when the spotlight
 * arrives — that is the ordering a visitor produces by hovering the button and then pressing it, and the one
 * that needs the registry to be reactive rather than merely read once on show.
 */
test("a tooltip on the highlighted element rises above the overlay, and only there", async ({ page }) => {
    const readTooltipZIndex = () =>
        page.locator(TOOLTIP).evaluate((element) => Number.parseInt(getComputedStyle(element).zIndex, 10));

    await stopSliding(page);
    await page.locator(button(HINT, "Highlight Me")).first().hover();
    await expect(page.locator(TOOLTIP)).toBeVisible();

    expect(await readTooltipZIndex(), "on the plain page it sits just above its own button").toBeLessThan(
        SPOTLIGHT_Z_INDEX,
    );

    await pressByKeyboard(page, button(HINT, "Highlight Me"));
    await expect(page.locator(BLOCKER)).toHaveCount(1);
    await expect(page.locator(TOOLTIP), "the tooltip is still the one opened before the spotlight").toBeVisible();

    expect(
        await readTooltipZIndex(),
        "and it has risen over the overlay rather than blurring with the page",
    ).toBeGreaterThan(SPOTLIGHT_Z_INDEX);
});

/**
 * A hint yields to anything. It is the one mode that treats a keypress as "you have moved on" rather than as
 * something to swallow — but a bare modifier is not moving on, and a screen reader's virtual cursor would
 * otherwise kill the hint before it was read.
 */
test("a hint is dismissed by a real key and survives a bare modifier", async ({ page }) => {
    await pressByKeyboard(page, button(HINT, "Highlight Me"));
    expect(await readout(page, "hint")).toContain("open: true");

    await page.keyboard.down("Shift");
    await page.keyboard.up("Shift");
    expect(await readout(page, "hint"), "holding Shift is not moving on").toContain("open: true");

    await page.keyboard.press("a");
    expect(await readout(page, "hint"), "but a key that means something is").toContain("open: false");
});

test("a prompt refuses every other control until the highlighted one is used", async ({ page }) => {
    await page.locator(button(PROMPT, "Insist")).click();
    await expect(page.locator(BLOCKER)).toHaveCount(1);

    await page
        .locator(button(PROMPT, "Insist"))
        .click({ force: true, timeout: 2000 })
        .catch(() => undefined);
    expect(await readout(page, "prompt"), "the trigger behind the overlay is unreachable").toContain("bought: 0");

    await page.keyboard.press("Tab");
    expect(await activeText(page), "and focus is pulled back to the one live control").toContain("Buy the potato");

    await page.locator(button(PROMPT, "Buy the potato")).click();
    expect(await readout(page, "prompt"), "using it is the way out").toContain("bought: 1");
});

/**
 * WCAG 2.1.2 is Level A and permits trapping focus only while a standard exit remains, so the mode whose
 * whole promise is that you cannot do anything else still has to answer Escape. This is that guarantee.
 */
test("a prompt still answers Escape, which is what keeps it out of a keyboard trap", async ({ page }) => {
    await page.locator(button(PROMPT, "Insist")).click();
    await expect(page.locator(BLOCKER)).toHaveCount(1);

    await page.keyboard.press("Escape");

    await expect(page.locator(BLOCKER), "the spotlight is gone").toHaveCount(0);
    expect(await readout(page, "prompt"), "without the highlighted control ever being used").toContain("bought: 0");
});

test("a guide seals the page and puts focus in its own popup", async ({ page }) => {
    await page.locator(button(GUIDE, "Take the tour")).click();
    await expect(page.locator(POPUP)).toBeVisible();
    await page.waitForTimeout(SETTLE_MS);

    await expect(page.locator(POPUP), "the popup names itself as a modal dialog").toHaveAttribute("aria-modal", "true");
    expect(await isFocusInsidePopup(page), "and focus lands inside it").toBe(true);

    const inertCount = await page.locator("[inert]").count();

    expect(inertCount, "everything beside the portal is inert, so the page is out of reach entirely").toBeGreaterThan(
        0,
    );
});

test("a guide steps between elements and reports how it ended", async ({ page }) => {
    await page.locator(button(GUIDE, "Take the tour")).click();
    await expect(page.locator(POPUP)).toBeVisible();

    expect(await readout(page, "guide"), "it starts on the first step").toContain("step: 1 of 2");
    await expect(page.locator(POPUP)).toContainText("This is a potato");

    await page.locator(popupButton("Next")).click();

    expect(await readout(page, "guide"), "Next advances it").toContain("step: 2 of 2");
    expect(
        await activeText(page),
        "and focus stays where the reader put it — a step change must not throw them onto Skip all",
    ).toContain("Done");
    await expect(page.locator(POPUP), "and the popup follows to the next element").toContainText("turnip");

    await page.locator(popupButton("Done")).click();

    await expect(page.locator(POPUP), "finishing closes it").toHaveCount(0);
    expect(await readout(page, "guide")).toContain("finished");
    await expect(page.locator("[inert]"), "and the page is handed back").toHaveCount(0);
});

/**
 * A step change replaces the popup's content while focus deliberately stays put, so a screen reader is told
 * nothing at all — the one case where holding focus still costs something. The words are the consumer's, as
 * they are for a toast: the library owns neither the step count nor the title. Announced only on a change,
 * because the popup takes focus when the tour opens and the first step is read there already.
 */
test("a step change is announced, and opening the tour is not announced twice", async ({ page }) => {
    const announcer = '[role="log"][aria-live="polite"]';

    await page.locator(button(GUIDE, "Take the tour")).click();
    await expect(page.locator(POPUP)).toBeVisible();

    await expect(
        page.locator(announcer),
        "the popup took focus, so the reader is already on the first step",
    ).not.toContainText("Step 1 of 2");

    await page.locator(popupButton("Next")).click();

    await expect(page.locator(announcer), "and the step that replaces it under held focus is spoken").toContainText(
        "Step 2 of 2",
    );
});

/**
 * Every mode scrolls to what it highlights, because none of them chooses what is on screen when it opens —
 * the element is wherever the page put it. A tour is where that bites first and where it is easiest to
 * drive: the guide example holds its steps in a strip only one step tall, so the second one is out of sight
 * until something scrolls to it, which is the situation a long page produces naturally.
 *
 * The reading at the first step is captured rather than asserted to be zero. The strip is padded and a step
 * is taller than the band left inside it, so `scrollIntoView({ block: "nearest" })` aligns the step's top
 * and that alone moves the strip by the padding — a fact about how the example is painted, which is not what
 * this test is for. What it is for is the travel between the two, so the second reading is compared against
 * the first.
 */
test("a guide scrolls a step that is out of sight into view", async ({ page }) => {
    const strip = page.locator(`${GUIDE} [data-scroll-box]`);

    await page.locator(button(GUIDE, "Take the tour")).click();
    await expect(page.locator(POPUP)).toBeVisible();
    await page.waitForTimeout(SETTLE_MS);

    const atFirstStep = await scrollTop(strip);

    await page.locator(popupButton("Next")).click();
    await page.waitForTimeout(SETTLE_MS);

    expect(await scrollTop(strip), "the second is reached rather than highlighted off-screen").toBeGreaterThan(
        atFirstStep,
    );
});

test("a guide can be abandoned, and says so", async ({ page }) => {
    await page.locator(button(GUIDE, "Take the tour")).click();
    await expect(page.locator(POPUP)).toBeVisible();

    await page.locator(popupButton("Skip all")).click();

    await expect(page.locator(POPUP)).toHaveCount(0);
    expect(await readout(page, "guide")).toContain("skipped");
});
