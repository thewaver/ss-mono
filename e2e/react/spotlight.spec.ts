import { type Page, expect, test } from "@playwright/test";

import { activeText, scrollTop } from "../helpers";

/**
 * The React `Spotlight` through its three presets, `SpotlightHint`, `SpotlightPrompt` and `SpotlightGuide`. The cases
 * follow `e2e/spotlight.spec.ts`, which covers the Solid ones, so the two frameworks are held to the same behavior:
 * one clipped layer with the element cut out, a tooltip on the lit element lifted over it, a hint yielding to a real
 * key, a prompt holding focus yet answering Escape, and a guide sealing the page, stepping, announcing and scrolling.
 * The Solid spec's shop tour is a Playground example that relays between a guide and a prompt and remembers its step
 * for the session; that relay is the example's, and has no counterpart here.
 */
const STORY = "Essentials/Spotlights";

const BLOCKER = 'div[style*="polygon(evenodd"]';
const CORNERS = "svg polygon";
const POPUP = '[role="dialog"]';
const TOOLTIP = '[role="tooltip"]';
const ANNOUNCER = '[role="log"][aria-live="polite"]';

const SPOTLIGHT_Z_INDEX = 10;
const SETTLE_MS = 300;

const button = (name: string) => `[data-testid="demo"] button:has-text("${name}")`;
const popupButton = (name: string) => `${POPUP} button:has-text("${name}")`;
const readout = (page: Page, key: string) => page.locator(`[data-readout="${key}"]`).textContent();

const isFocusInsidePopup = (page: Page) =>
    page.evaluate((selector) => {
        const popup = document.querySelector(selector);

        return !!popup && !!document.activeElement && popup.contains(document.activeElement);
    }, POPUP);

const inertCount = (page: Page) => page.locator("[inert]").count();

const pressByKeyboard = async (page: Page, selector: string) => {
    await page.locator(selector).first().focus();
    await page.keyboard.press("Enter");
};

test("nothing is portaled before anything is highlighted", async ({ page, mount }) => {
    await mount(`${STORY}/Hint`);

    await expect(page.locator(BLOCKER), "nothing is holding the pointer off the page").toHaveCount(0);
    await expect(page.locator(CORNERS), "and no highlight decoration").toHaveCount(0);
});

test("opening lays one clipped layer over the page with the element cut out of it", async ({ page, mount }) => {
    await mount(`${STORY}/Hint`);

    await pressByKeyboard(page, button("Highlight Me"));

    await expect(page.locator(BLOCKER), "one layer rather than a ring of boxes").toHaveCount(1);
    await expect(page.locator(CORNERS), "and the consumer's four corner marks").toHaveCount(4);
    expect(
        await page.getByTestId("cover").evaluate((element) => (element as HTMLElement).style.maskImage),
        "the overlay painter is handed the mask that cuts the hole",
    ).not.toBe("");
});

test("a tooltip on the highlighted element rises above the overlay, and only there", async ({ page, mount }) => {
    await mount(`${STORY}/Hint`);

    const readTooltipZIndex = () =>
        page.locator(TOOLTIP).evaluate((element) => Number.parseInt(getComputedStyle(element).zIndex, 10));

    await page.locator(button("Highlight Me")).hover();
    await expect(page.locator(TOOLTIP)).toBeVisible();

    expect(await readTooltipZIndex(), "on the plain page it sits just above its own button").toBeLessThan(
        SPOTLIGHT_Z_INDEX,
    );

    await pressByKeyboard(page, button("Highlight Me"));
    await expect(page.locator(BLOCKER)).toHaveCount(1);
    await expect(page.locator(TOOLTIP), "the tooltip is still the one opened before the spotlight").toBeVisible();

    await expect
        .poll(readTooltipZIndex, { message: "and it has risen over the overlay rather than blurring with the page" })
        .toBeGreaterThan(SPOTLIGHT_Z_INDEX);
});

test("a hint is dismissed by a real key and survives a bare modifier", async ({ page, mount }) => {
    await mount(`${STORY}/Hint`);

    await pressByKeyboard(page, button("Highlight Me"));
    expect(await readout(page, "hint")).toContain("open: true");

    await page.keyboard.down("Shift");
    await page.keyboard.up("Shift");
    expect(await readout(page, "hint"), "holding Shift is not moving on").toContain("open: true");

    await page.keyboard.press("a");
    await expect.poll(() => readout(page, "hint"), "but a key that means something is").toContain("open: false");
});

test("a hint is dismissed by a press on the overlay", async ({ page, mount }) => {
    await mount(`${STORY}/Hint`);

    await pressByKeyboard(page, button("Highlight Me"));
    await expect(page.locator(BLOCKER)).toHaveCount(1);

    await page.mouse.click(5, 5);

    await expect.poll(() => readout(page, "hint")).toContain("open: false");
    await expect(page.locator(BLOCKER), "and it fades away").toHaveCount(0);
});

test("a prompt refuses every other control until the highlighted one is used", async ({ page, mount }) => {
    await mount(`${STORY}/Prompt`);

    await page.locator(button("Insist")).click();
    await expect(page.locator(BLOCKER)).toHaveCount(1);

    await page
        .locator(button("Insist"))
        .click({ force: true, timeout: 2000 })
        .catch(() => undefined);
    await page.mouse.click(5, 5);
    expect(await readout(page, "prompt"), "the trigger behind the overlay is unreachable").toContain("bought: 0");
    await expect(page.locator(BLOCKER), "and a press on the overlay does not dismiss a prompt").toHaveCount(1);

    await page.keyboard.press("Tab");
    expect(await activeText(page), "focus is pulled back to the one live control").toContain("Buy the potato");

    await page.locator(button("Buy the potato")).click();
    await expect.poll(() => readout(page, "prompt"), "using it is the way out").toContain("bought: 1");
});

test("a prompt still answers Escape, which is what keeps it out of a keyboard trap", async ({ page, mount }) => {
    await mount(`${STORY}/Prompt`);

    await page.locator(button("Insist")).click();
    await expect(page.locator(BLOCKER)).toHaveCount(1);

    await page.keyboard.press("Escape");

    await expect(page.locator(BLOCKER), "the spotlight is gone").toHaveCount(0);
    expect(await readout(page, "prompt"), "without the highlighted control ever being used").toContain("bought: 0");
});

test("a guide seals the page and puts focus in its own popup", async ({ page, mount }) => {
    await mount(`${STORY}/Guide`);

    const alreadyInert = await inertCount(page);

    await page.locator(button("Take the tour")).click();
    await expect(page.locator(POPUP)).toBeVisible();
    await page.waitForTimeout(SETTLE_MS);

    await expect(page.locator(POPUP), "the popup names itself as a modal dialog").toHaveAttribute("aria-modal", "true");
    await expect(page.locator(POPUP)).toHaveAttribute("aria-label", "Product tour");
    await expect.poll(() => isFocusInsidePopup(page), { message: "and focus lands inside it" }).toBe(true);
    expect(
        await inertCount(page),
        "everything beside the portal is inert, so the page is out of reach entirely",
    ).toBeGreaterThan(alreadyInert);
});

test("a guide steps between elements and reports how it ended", async ({ page, mount }) => {
    await mount(`${STORY}/Guide`);

    const alreadyInert = await inertCount(page);

    await page.locator(button("Take the tour")).click();
    await expect(page.locator(POPUP)).toBeVisible();

    expect(await readout(page, "guide"), "it starts on the first step").toContain("step: 1 of 2");
    await expect(page.locator(POPUP)).toContainText("This is a potato");

    await page.locator(popupButton("Next")).click();

    await expect.poll(() => readout(page, "guide"), "Next advances it").toContain("step: 2 of 2");
    expect(
        await activeText(page),
        "and focus stays where the reader put it — a step change must not throw them onto Skip all",
    ).toContain("Done");
    await expect(page.locator(POPUP), "and the popup follows to the next element").toContainText("turnip");

    await page.locator(popupButton("Done")).click();

    await expect(page.locator(POPUP), "finishing closes it").toHaveCount(0);
    expect(await readout(page, "guide")).toContain("finished");
    await expect(page.locator("[inert]"), "and the page is handed back").toHaveCount(alreadyInert);
});

test("a step change is announced, and opening the tour is not announced twice", async ({ page, mount }) => {
    await mount(`${STORY}/Guide`);

    await page.locator(button("Take the tour")).click();
    await expect(page.locator(POPUP)).toBeVisible();

    await expect(
        page.locator(ANNOUNCER),
        "the popup took focus, so the reader is already on the first step",
    ).not.toContainText("Step 1 of 2");

    await page.locator(popupButton("Next")).click();

    await expect(page.locator(ANNOUNCER), "and the step that replaces it under held focus is spoken").toContainText(
        "Step 2 of 2",
    );
});

test("a guide scrolls a step that is out of sight into view", async ({ page, mount }) => {
    await mount(`${STORY}/Guide`);

    const strip = page.locator("[data-scroll-box]");

    await page.locator(button("Take the tour")).click();
    await expect(page.locator(POPUP)).toBeVisible();
    await page.waitForTimeout(SETTLE_MS);

    const atFirstStep = await scrollTop(strip);

    await page.locator(popupButton("Next")).click();
    await page.waitForTimeout(SETTLE_MS);

    expect(await scrollTop(strip), "the second is reached rather than highlighted off-screen").toBeGreaterThan(
        atFirstStep,
    );
});

test("a guide can be abandoned, and says so", async ({ page, mount }) => {
    await mount(`${STORY}/Guide`);

    await page.locator(button("Take the tour")).click();
    await expect(page.locator(POPUP)).toBeVisible();

    await page.locator(popupButton("Skip all")).click();

    await expect(page.locator(POPUP)).toHaveCount(0);
    expect(await readout(page, "guide")).toContain("skipped");
});
