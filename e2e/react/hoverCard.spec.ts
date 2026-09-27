import { type Page, expect, test } from "@playwright/test";

import { activeMatches } from "../helpers";

/**
 * The React `HoverCard`. The cases follow `e2e/hoverCard.spec.ts`, which covers the Solid one, so the two frameworks
 * are held to the same behavior: nothing written onto the anchor, a named dialog portaled away, the hover wait, the
 * bridged gap, the Tab route into and out of the card, and Escape. The Solid spec's flyout cases are about the
 * Playground's navigation example, a popup trigger over a popover, and have no counterpart here. A touch press
 * standing in for the hover is added, since it is the card's own behavior and the Solid spec does not reach it.
 */
const STORY = "Essentials/HoverCard/Default";
const ANCHOR = '[data-testid="anchor"]';
const BEFORE_ANCHOR = "#profileSource";
const CARD = '[role="dialog"]';

const WAITS_SETTLED_MS = 1_000;
const FADE_SETTLED_MS = 600;

const readout = (page: Page) => page.locator('[data-readout="profile"]').textContent();

const isFocusInsideCard = (page: Page) =>
    page.evaluate((selector) => !!document.activeElement?.closest(selector), CARD);

const anchorAttributeNames = (page: Page) =>
    page.evaluate((selector) => document.querySelector(selector)!.getAttributeNames().sort(), ANCHOR);

const tabToAnchor = async (page: Page) => {
    await page.locator(BEFORE_ANCHOR).focus();
    await page.keyboard.press("Tab");
    expect(await activeMatches(page, ANCHOR), "Tab from the element before it lands on the name").toBe(true);
};

const openedByKeyboard = async (page: Page) => {
    await tabToAnchor(page);
    await expect(page.locator(CARD), "resting keyboard focus on the name opens the card after its wait").toBeVisible();
};

test("nothing is open at rest, and opening writes nothing onto the anchor", async ({ page, mount }) => {
    await mount(STORY);

    await expect(page.locator(CARD), "no card is in the tree before anything happens").toHaveCount(0);

    const atRest = await anchorAttributeNames(page);

    await page.locator(ANCHOR).hover();
    await expect(page.locator(CARD)).toBeVisible();

    expect(await anchorAttributeNames(page), "the anchor carries the same attributes open as closed").toEqual(atRest);
});

test("resting the pointer on the name opens a named dialog, portaled out of the sentence", async ({ page, mount }) => {
    await mount(STORY);

    await page.locator(ANCHOR).hover();

    await expect(page.locator(CARD), "resting on the name opens the card").toBeVisible();
    await expect.poll(() => readout(page), "and the owner's state agrees").toContain("open: true");
    expect(
        await page.evaluate(
            (selectors) => !document.querySelector(selectors.demo)!.contains(document.querySelector(selectors.card)),
            { demo: '[data-testid="demo"]', card: CARD },
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

test("a card left to itself keeps its own state", async ({ page, mount }) => {
    await mount("Essentials/HoverCard/Uncontrolled");

    await page.locator(ANCHOR).hover();

    await expect(page.locator(CARD)).toBeVisible();
    await expect(page.locator(CARD)).toHaveAttribute("aria-label", "Details");
});

test("leaving the name before the wait is up opens nothing", async ({ page, mount }) => {
    await mount(STORY);

    await page.locator(ANCHOR).hover();
    await page.mouse.move(2, 2);
    await page.waitForTimeout(WAITS_SETTLED_MS);

    await expect(page.locator(CARD), "a pointer passing over the name does not open the card").toHaveCount(0);
});

test("the pointer can cross the gap onto the card, and leaving both closes it", async ({ page, mount }) => {
    await mount(STORY);

    await page.locator(ANCHOR).hover();
    await expect(page.locator(CARD)).toBeVisible();

    const anchorBox = (await page.locator(ANCHOR).boundingBox())!;
    const cardBox = (await page.locator(CARD).boundingBox())!;

    const midX = anchorBox.x + anchorBox.width * 0.5;
    const gapMidY = (anchorBox.y + anchorBox.height + cardBox.y) * 0.5;

    await page.mouse.move(midX, gapMidY);
    await page.waitForTimeout(FADE_SETTLED_MS);
    await expect(page.locator(CARD), "resting in the gap between the two does not lose it").toHaveCount(1);

    await page.mouse.move(cardBox.x + cardBox.width * 0.5, cardBox.y + cardBox.height * 0.5);
    await page.waitForTimeout(FADE_SETTLED_MS);
    await expect(page.locator(CARD), "and neither does arriving on the card itself").toHaveCount(1);

    await page.mouse.move(2, 2);
    await expect(page.locator(CARD), "leaving both for good takes it away").toHaveCount(0);
    await expect.poll(() => readout(page), "and the owner is told").toContain("open: false");
});

test("Tab from the name moves into the card, through its controls, and on to what follows the name", async ({
    page,
    mount,
}) => {
    await mount(STORY);
    await openedByKeyboard(page);

    await page.keyboard.press("Tab");
    expect(await isFocusInsideCard(page), "Tab from the name moves into the card").toBe(true);
    await expect(page.getByTestId("follow"), "onto its first control").toBeFocused();

    await page.keyboard.press("Tab");
    await expect(page.getByTestId("message"), "the next Tab moves on to its next control").toBeFocused();

    await page.keyboard.press("Tab");
    expect(await isFocusInsideCard(page), "Tab past the last control leaves the card").toBe(false);
    await expect(
        page.locator("#afterAnchor"),
        "for whatever follows the name on the page, not for the top of the document",
    ).toBeFocused();
    await expect(page.locator(CARD), "and with both focus and pointer gone, the card closes").toHaveCount(0);
});

test("Shift+Tab from the card's first control goes back to the name, and the card stays open", async ({
    page,
    mount,
}) => {
    await mount(STORY);
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

test("a control inside the card works from the keyboard", async ({ page, mount }) => {
    await mount(STORY);
    await openedByKeyboard(page);

    expect(await readout(page), "nothing has been pressed yet").toContain("following: false");

    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");

    await expect.poll(() => readout(page), "Enter on the card's first control presses it").toContain("following: true");
    await expect(page.locator(CARD), "and the card stays open around it").toHaveCount(1);
});

test("Escape from inside the card closes it, puts focus back on the name, and does not reopen it", async ({
    page,
    mount,
}) => {
    await mount(STORY);
    await openedByKeyboard(page);

    await page.keyboard.press("Tab");
    expect(await isFocusInsideCard(page)).toBe(true);

    await page.keyboard.press("Escape");
    await expect(page.locator(CARD), "Escape closes the card").toHaveCount(0);
    expect(await activeMatches(page, ANCHOR), "and puts focus back on the name").toBe(true);

    await page.waitForTimeout(WAITS_SETTLED_MS);
    await expect(page.locator(CARD), "without the returning focus opening it again").toHaveCount(0);
});

test("Escape with focus on the name closes the card and leaves focus where it was", async ({ page, mount }) => {
    await mount(STORY);
    await openedByKeyboard(page);

    await page.keyboard.press("Escape");
    await expect(page.locator(CARD), "Escape closes the card from the name too").toHaveCount(0);
    expect(await activeMatches(page, ANCHOR), "and focus stays on the name").toBe(true);
});

test.describe("where the pointer cannot hover", () => {
    test.use({ hasTouch: true });

    test("a press on the name opens the card, and a second press closes it", async ({ page, mount }) => {
        await mount(STORY);

        await page.locator(ANCHOR).tap();
        await expect(page.locator(CARD), "the press stands in for the hover").toBeVisible();

        await page.locator(ANCHOR).tap();
        await expect(page.locator(CARD), "and pressing again takes it away").toHaveCount(0);
    });
});
