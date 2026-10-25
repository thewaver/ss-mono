import { type Page, expect, test } from "@playwright/test";

import { activeDescendantText, docsDemo, docsSettled } from "./helpers";

const DOCS = "/src/App/Pages/Menus/FanMenuPage/Docs";

const MENU = '[role="menu"]';
const ITEM_ROLE = '[role="menuitem"]';

const trigger = (name: string) => `${docsDemo(DOCS, name)} [aria-haspopup="menu"]`;

/** Each example reads out the last command it ran, under its fan. */
const readout = async (page: Page, name: string) =>
    ((await page.locator(`${docsDemo(DOCS, name)} [data-readout]`).textContent()) ?? "").trim();

const openedLevel = async (page: Page, depth: number) => {
    await expect(page.locator(MENU)).toHaveCount(depth + 1);
    await expect(page.locator(MENU).nth(depth)).toHaveAttribute("aria-activedescendant", /.+/);
    await expect(page.locator(MENU).nth(depth)).toBeFocused();
};

const highlightAt = async (page: Page, depth: number) =>
    activeDescendantText(page, `#${await page.locator(MENU).nth(depth).getAttribute("id")}`);

const firstItemOf = (page: Page, depth: number) => page.locator(MENU).nth(depth).locator(ITEM_ROLE).first();

test.beforeEach(async ({ page }) => {
    await page.goto("/fan-menu/docs");
    await expect(page.locator(trigger("Submenus"))).toBeVisible();
    await docsSettled(page);
});

test("a level replaces the one it came from rather than standing beside it", async ({ page }) => {
    await page.locator(trigger("Submenus")).click();
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
    const before = await readout(page, "Submenus");

    await page.locator(trigger("Submenus")).click();
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
    expect(await readout(page, "Submenus"), "with nothing run on the way").toBe(before);
});

test("a fan drills on a press and never on a hover, since a pointer sweeping it would fall through levels", async ({
    page,
}) => {
    await page.locator(trigger("Submenus")).click();
    await openedLevel(page, 0);

    await firstItemOf(page, 0).hover();
    expect(await highlightAt(page, 0), "hovering a card still chooses it").toContain("New");
    await expect(page.locator(MENU), "but opens nothing").toHaveCount(1);

    await firstItemOf(page, 0).click();
    await openedLevel(page, 1);
    await expect(firstItemOf(page, 0), "a press is what steps in").not.toBeVisible();
});

test("a card with nothing under it still runs and closes the whole fan", async ({ page }) => {
    await page.locator(trigger("Submenus")).click();
    await openedLevel(page, 0);

    await page.keyboard.press("Enter");
    await openedLevel(page, 1);

    await page.keyboard.press("Enter");
    await expect(page.locator(MENU)).toHaveCount(0);
    expect(await readout(page, "Submenus")).toContain("Project");
});

/**
 * A fan is laid out, so its arrows all walk the arc and stepping out of a level is `Escape`'s job rather
 * than `ArrowLeft`'s. The card at the head of the arc still walks back when it is activated, which is the
 * route a pointer takes.
 */
test("Escape steps back out one level, leaving the arrows to walk the arc", async ({ page }) => {
    await page.locator(trigger("Submenus")).click();
    await openedLevel(page, 0);

    await page.keyboard.press("Enter");
    await openedLevel(page, 1);

    await page.keyboard.press("Escape");
    await expect(page.locator(MENU)).toHaveCount(1);
    expect(await highlightAt(page, 0), "landing back on the card that opened it").toContain("New");
});
