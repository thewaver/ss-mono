import { type Page, expect, test } from "@playwright/test";

import { activeDescendantText, demo, readout } from "./helpers";

const MENU = '[role="menu"]';
const ITEM_ROLE = '[role="menuitem"]';

const trigger = (key: string) => `${demo(key)} [aria-haspopup="menu"]`;

const openedLevel = async (page: Page, depth: number) => {
    await expect(page.locator(MENU)).toHaveCount(depth + 1);
    await expect(page.locator(MENU).nth(depth)).toHaveAttribute("aria-activedescendant", /.+/);
    await expect(page.locator(MENU).nth(depth)).toBeFocused();
};

const highlightAt = async (page: Page, depth: number) =>
    activeDescendantText(page, `#${await page.locator(MENU).nth(depth).getAttribute("id")}`);

const firstItemOf = (page: Page, depth: number) => page.locator(MENU).nth(depth).locator(ITEM_ROLE).first();

test.beforeEach(async ({ page }) => {
    await page.goto("/fan-menu");
    await expect(page.locator("[data-example]").first()).toBeVisible();
});

test("a level replaces the one it came from rather than standing beside it", async ({ page }) => {
    await page.locator(trigger("submenus")).click();
    await openedLevel(page, 0);
    await expect(firstItemOf(page, 0), "the first arc is on screen").toBeVisible();

    await page.keyboard.press("Enter");
    await openedLevel(page, 1);

    await expect(
        firstItemOf(page, 0),
        "and once a level is opened the one behind it is gone from view",
    ).not.toBeVisible();
    await expect(firstItemOf(page, 1), "leaving only the one that replaced it").toBeVisible();
});

test("the head of a new arc is the item you came in through, and it takes you back", async ({ page }) => {
    await page.locator(trigger("submenus")).click();
    await openedLevel(page, 0);
    expect(await highlightAt(page, 0), "a fan opens onto its first card").toContain("New");

    await page.keyboard.press("Enter");
    await openedLevel(page, 1);
    expect(await firstItemOf(page, 1).textContent(), "the head of the new arc names the way in").toContain("New");
    expect(await highlightAt(page, 1), "and the choice starts below it rather than on it").toContain("Project");

    await page.keyboard.press("ArrowUp");
    expect(await highlightAt(page, 1), "one step up reaches it, so it is a card like any other").toContain("New");

    await page.keyboard.press("Enter");
    await expect(page.locator(MENU), "and taking it steps back out rather than closing the fan").toHaveCount(1);
    await expect(firstItemOf(page, 0)).toBeVisible();
    expect(await readout(page, "submenus"), "with nothing run on the way").toContain("nothing run yet");
});

test("a fan drills on a press and never on a hover, since a pointer sweeping it would fall through levels", async ({
    page,
}) => {
    await page.locator(trigger("submenus")).click();
    await openedLevel(page, 0);

    await firstItemOf(page, 0).hover();
    expect(await highlightAt(page, 0), "hovering a card still chooses it").toContain("New");
    await expect(page.locator(MENU), "but opens nothing").toHaveCount(1);

    await firstItemOf(page, 0).click();
    await openedLevel(page, 1);
    await expect(firstItemOf(page, 0), "a press is what steps in").not.toBeVisible();
});

test("a card with nothing under it still runs and closes the whole fan", async ({ page }) => {
    await page.locator(trigger("submenus")).click();
    await openedLevel(page, 0);

    await page.keyboard.press("Enter");
    await openedLevel(page, 1);

    await page.keyboard.press("Enter");
    await expect(page.locator(MENU)).toHaveCount(0);
    expect(await readout(page, "submenus")).toContain("Project");
});

test("ArrowLeft steps back out, the same as it does in a stacked menu", async ({ page }) => {
    await page.locator(trigger("submenus")).click();
    await openedLevel(page, 0);

    await page.keyboard.press("Enter");
    await openedLevel(page, 1);

    await page.keyboard.press("ArrowLeft");
    await expect(page.locator(MENU)).toHaveCount(1);
    expect(await highlightAt(page, 0), "landing back on the card that opened it").toContain("New");
});
