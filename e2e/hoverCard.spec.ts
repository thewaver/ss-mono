import { type Page, expect, test } from "@playwright/test";

import { activeMatches, demo, readout } from "./helpers";

const ANCHOR = `${demo("profile")} button`;
const BEFORE_ANCHOR = "#profileSource";
const CARD = '[role="dialog"]';
const FLYOUT_TRIGGER = `${demo("navigation")} [aria-haspopup="dialog"]`;

/**
 * Longer than the hover wait and the focus wait the page starts with, plus the fade. Only ever spent to show
 * that something did **not** happen — a card that opens is waited on through the card itself.
 */
const WAITS_SETTLED_MS = 1_500;

/** Comfortably past the fade, so a card that had been withdrawn is unmounted rather than fading. */
const FADE_SETTLED_MS = 600;

const isFocusInsideCard = (page: Page) =>
    page.evaluate((selector) => !!document.activeElement?.closest(selector), CARD);

const anchorAttributeNames = (page: Page) =>
    page.evaluate((selector) => document.querySelector(selector)!.getAttributeNames().sort(), ANCHOR);

/**
 * Keyboard focus is reached by Tab from the element before the anchor rather than by `focus()`, because the
 * card tells a keyboard focus from a pointer press by whether the anchor is `:focus-visible`, and a real Tab is
 * the one route that answers that the way a person's keyboard would.
 */
const tabToAnchor = async (page: Page) => {
    await page.locator(BEFORE_ANCHOR).focus();
    await page.keyboard.press("Tab");
    expect(await activeMatches(page, ANCHOR), "Tab from the element before it lands on the name").toBe(true);
};

const openedByKeyboard = async (page: Page) => {
    await tabToAnchor(page);
    await expect(page.locator(CARD), "resting keyboard focus on the name opens the card after its wait").toBeVisible();
};

test.beforeEach(async ({ page }) => {
    await page.goto("/hover-card");
    await expect(page.locator("[data-example]").first()).toBeVisible();
});

/**
 * A card is somewhere to go rather than something read out, so it describes nothing: no `aria-describedby`,
 * no `aria-expanded`, nothing at all written onto the anchor. The check compares the anchor's attributes with
 * the card closed and open, so it does not have to list which attributes a button happens to carry.
 */
test("nothing is open at rest, and opening writes nothing onto the anchor", async ({ page }) => {
    await expect(page.locator(CARD), "no card is in the tree before anything happens").toHaveCount(0);

    const atRest = await anchorAttributeNames(page);

    await page.locator(ANCHOR).hover();
    await expect(page.locator(CARD)).toBeVisible();

    expect(await anchorAttributeNames(page), "the anchor carries the same attributes open as closed").toEqual(atRest);
});

test("resting the pointer on the name opens a named dialog, portaled out of the sentence", async ({ page }) => {
    await page.locator(ANCHOR).hover();

    await expect(page.locator(CARD), "resting on the name opens the card").toBeVisible();
    expect(await readout(page, "profile"), "and the page's own reading agrees").toContain("open: true");
    expect(
        await page.evaluate(
            (selectors) => !document.querySelector(selectors.demo)!.contains(document.querySelector(selectors.card)),
            { demo: demo("profile"), card: CARD },
        ),
        "the card is portaled out of the sentence rather than nested in it",
    ).toBe(true);
    expect(
        await page.evaluate((selector) => {
            const card = document.querySelector(selector)!;
            const name = document.getElementById(card.getAttribute("aria-labelledby") ?? "");

            return !!name && card.contains(name) && (name.textContent ?? "").trim().length > 0;
        }, CARD),
        "and it is named by a heading of its own, as any dialog must be",
    ).toBe(true);
});

test("leaving the name before the wait is up opens nothing", async ({ page }) => {
    const demoBox = (await page.locator(demo("profile")).boundingBox())!;

    await page.locator(ANCHOR).hover();
    await page.mouse.move(demoBox.x + 2, demoBox.y + 2);
    await page.waitForTimeout(WAITS_SETTLED_MS);

    await expect(page.locator(CARD), "a pointer passing over the name does not open the card").toHaveCount(0);
});

/**
 * Success criterion 1.4.13 asks that content shown on hover can itself be hovered. The card is held clear of
 * its anchor by an offset, and the gap is bridged, so a pointer resting halfway across it keeps the card. It
 * rests rather than crossing in one movement for the reason the tooltip spec gives: a fast crossing hides
 * inside the fade, and a slow hand would not get away with it.
 */
test("the pointer can cross the gap onto the card, and leaving both closes it", async ({ page }) => {
    await page.locator(ANCHOR).hover();
    await expect(page.locator(CARD)).toBeVisible();

    const anchorBox = (await page.locator(ANCHOR).boundingBox())!;
    const cardBox = (await page.locator(CARD).boundingBox())!;
    const demoBox = (await page.locator(demo("profile")).boundingBox())!;

    const midX = anchorBox.x + anchorBox.width / 2;
    const gapMidY = (anchorBox.y + anchorBox.height + cardBox.y) / 2;

    await page.mouse.move(midX, gapMidY);
    await page.waitForTimeout(FADE_SETTLED_MS);
    await expect(page.locator(CARD), "resting in the gap between the two does not lose it").toHaveCount(1);

    await page.mouse.move(cardBox.x + cardBox.width / 2, cardBox.y + cardBox.height / 2);
    await page.waitForTimeout(FADE_SETTLED_MS);
    await expect(page.locator(CARD), "and neither does arriving on the card itself").toHaveCount(1);

    await page.mouse.move(demoBox.x + 2, demoBox.y + 2);
    await expect(page.locator(CARD), "leaving both for good takes it away").toHaveCount(0);
});

/**
 * The card is portaled to the end of the document, so without help the next Tab after the anchor would land on
 * whatever follows the anchor on the page and the card's controls could only be reached by a pointer. Tab is
 * the key into it: while the card is open, Tab from the anchor moves to the card's first control, the card's
 * own controls follow in order, and Tab past the last one goes on to what follows the anchor. Success criterion
 * 2.1.1 is why: a control a keyboard cannot reach might as well not be there.
 */
test("Tab from the name moves into the card, through its controls, and on to what follows the name", async ({
    page,
}) => {
    await openedByKeyboard(page);

    await page.keyboard.press("Tab");
    expect(await isFocusInsideCard(page), "Tab from the name moves into the card").toBe(true);
    expect(
        await page.evaluate((selector) => {
            const card = document.querySelector(selector)!;
            const first = card.querySelector("button, a[href], input, select, textarea, [tabindex]");

            return document.activeElement === first;
        }, CARD),
        "onto its first control",
    ).toBe(true);

    const first = await page.evaluateHandle(() => document.activeElement);

    await page.keyboard.press("Tab");
    expect(await isFocusInsideCard(page), "the next Tab stays in the card").toBe(true);
    expect(
        await page.evaluate((previous) => document.activeElement !== previous, first),
        "and moves on to its next control",
    ).toBe(true);

    await page.keyboard.press("Tab");
    expect(await isFocusInsideCard(page), "Tab past the last control leaves the card").toBe(false);
    expect(
        await page.evaluate(
            (selector) =>
                (document.querySelector(selector)!.compareDocumentPosition(document.activeElement!) &
                    Node.DOCUMENT_POSITION_FOLLOWING) !==
                0,
            ANCHOR,
        ),
        "for whatever follows the name on the page, not for the top of the document",
    ).toBe(true);
    await expect(page.locator(CARD), "and with both focus and pointer gone, the card closes").toHaveCount(0);
});

test("Shift+Tab from the card's first control goes back to the name, and the card stays open", async ({ page }) => {
    await openedByKeyboard(page);

    await page.keyboard.press("Tab");
    expect(await isFocusInsideCard(page)).toBe(true);

    await page.keyboard.press("Shift+Tab");
    expect(await activeMatches(page, ANCHOR), "Shift+Tab from the first control goes back to the name").toBe(true);

    await page.waitForTimeout(FADE_SETTLED_MS);
    await expect(
        page.locator(CARD),
        "and the card stays open while the name has keyboard focus, so Tab can go straight back in",
    ).toHaveCount(1);

    await page.keyboard.press("Tab");
    expect(await isFocusInsideCard(page), "which it does").toBe(true);
});

test("a control inside the card works from the keyboard", async ({ page }) => {
    await openedByKeyboard(page);

    expect(await readout(page, "profile"), "nothing has been pressed yet").toContain("following: false");

    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");

    expect(await readout(page, "profile"), "Enter on the card's first control presses it").toContain("following: true");
    await expect(page.locator(CARD), "and the card stays open around it").toHaveCount(1);
});

/**
 * Escape from inside the card puts focus back on the anchor, and that focus is marked as a restore — without
 * the mark, the anchor would take it as a fresh keyboard focus and open the card again once its wait was up,
 * so Escape would appear to do nothing. The wait after it is what gives a reopening card the time to show.
 */
test("Escape from inside the card closes it, puts focus back on the name, and does not reopen it", async ({ page }) => {
    await openedByKeyboard(page);

    await page.keyboard.press("Tab");
    expect(await isFocusInsideCard(page)).toBe(true);

    await page.keyboard.press("Escape");
    await expect(page.locator(CARD), "Escape closes the card").toHaveCount(0);
    expect(await activeMatches(page, ANCHOR), "and puts focus back on the name").toBe(true);

    await page.waitForTimeout(WAITS_SETTLED_MS);
    await expect(page.locator(CARD), "without the returning focus opening it again").toHaveCount(0);
});

test("Escape with focus on the name closes the card and leaves focus where it was", async ({ page }) => {
    await openedByKeyboard(page);

    await page.keyboard.press("Escape");
    await expect(page.locator(CARD), "Escape closes the card from the name too").toHaveCount(0);
    expect(await activeMatches(page, ANCHOR), "and focus stays on the name").toBe(true);
});

/**
 * The navigation example is a popup trigger over a popover, sharing the hover engine: a press opens a flyout
 * and moves focus into it, and one shared "which is open" value keeps a second flyout from opening beside the
 * first, since hovering another trigger never passes through the dismiss layer.
 */
test("a press opens a flyout and moves focus into it", async ({ page }) => {
    const trigger = page.locator(FLYOUT_TRIGGER).first();

    await expect(trigger, "a flyout trigger starts closed").toHaveAttribute("aria-expanded", "false");

    await trigger.click();

    await expect(page.locator(CARD), "pressing it opens its flyout").toHaveCount(1);
    await expect(trigger, "and the trigger says so").toHaveAttribute("aria-expanded", "true");
    expect(await page.locator(CARD).getAttribute("aria-label"), "the flyout carries a name of its own").toBeTruthy();
    await expect.poll(() => isFocusInsideCard(page), "and focus moves into it, since a press asked for it").toBe(true);
});

test("opening a second flyout closes the first, so only one is ever open", async ({ page }) => {
    const first = page.locator(FLYOUT_TRIGGER).nth(0);
    const second = page.locator(FLYOUT_TRIGGER).nth(1);

    await first.click();
    await expect(first).toHaveAttribute("aria-expanded", "true");

    await second.click();

    await expect(second, "pressing the second trigger opens its flyout").toHaveAttribute("aria-expanded", "true");
    await expect(first, "and closes the first").toHaveAttribute("aria-expanded", "false");
    await expect(page.locator(CARD), "so one flyout is on the page, not two").toHaveCount(1);
});

test("Escape closes a pressed-open flyout", async ({ page }) => {
    const trigger = page.locator(FLYOUT_TRIGGER).first();

    await trigger.click();
    await expect.poll(() => isFocusInsideCard(page)).toBe(true);

    await page.keyboard.press("Escape");

    await expect(page.locator(CARD), "Escape closes the flyout").toHaveCount(0);
    await expect(trigger, "and the trigger says it is closed").toHaveAttribute("aria-expanded", "false");
});
