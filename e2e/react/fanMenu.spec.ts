import { type Page, expect, test } from "@playwright/test";

/**
 * The React `FanMenu`, a `Menu` whose levels replace one another along an arc. The cases follow
 * `e2e/fanMenu.spec.ts`: a level replaces the one it came from, the head of a new arc is the way back, a fan drills
 * on a press and never on a hover, a card with nothing under it runs and closes, and `Escape` steps out one level.
 */
const MENU = '[role="menu"]';
const ITEM_ROLE = '[role="menuitem"]';
const TRIGGER = "#trigger";
const STORY = "Essentials/FanMenu/Submenus";

const readout = (page: Page) => page.locator('[data-readout="last"]').textContent();

const openedLevel = async (page: Page, depth: number) => {
    await expect(page.locator(MENU)).toHaveCount(depth + 1);
    await expect(page.locator(MENU).nth(depth)).toHaveAttribute("aria-activedescendant", /.+/);
    await expect(page.locator(MENU).nth(depth)).toBeFocused();
};

const highlightAt = async (page: Page, depth: number) => {
    const id = await page.locator(MENU).nth(depth).getAttribute("aria-activedescendant");

    return page.locator(`[id="${id}"]`).textContent();
};

const firstItemOf = (page: Page, depth: number) => page.locator(MENU).nth(depth).locator(ITEM_ROLE).first();

test("a level replaces the one it came from rather than standing beside it", async ({ page, mount }) => {
    await mount(STORY);
    await page.locator(TRIGGER).click();
    await openedLevel(page, 0);
    await expect(firstItemOf(page, 0), "the first arc is on screen").toBeVisible();

    await page.keyboard.press("Enter");
    await openedLevel(page, 1);

    await expect(firstItemOf(page, 0), "the one behind it is gone from view").not.toBeVisible();
    await expect(firstItemOf(page, 1), "leaving only the one that replaced it").toBeVisible();
});

test("the head of a new arc is the item you came in through, and it takes you back", async ({ page, mount }) => {
    await mount(STORY);
    await page.locator(TRIGGER).click();
    await openedLevel(page, 0);
    expect(await highlightAt(page, 0), "a fan opens onto its first card").toContain("New");

    await page.keyboard.press("Enter");
    await openedLevel(page, 1);
    expect(await firstItemOf(page, 1).textContent(), "the head of the new arc names the way in").toContain("New");
    expect(await highlightAt(page, 1), "and the choice starts below it").toContain("Project");

    await page.keyboard.press("ArrowUp");
    expect(await highlightAt(page, 1), "one step up reaches it").toContain("New");

    await page.keyboard.press("Enter");
    await expect(page.locator(MENU), "taking it steps back out rather than closing the fan").toHaveCount(1);
    await expect(firstItemOf(page, 0)).toBeVisible();
    expect(await readout(page), "with nothing run on the way").toContain("nothing run yet");
});

test("a fan drills on a press and never on a hover", async ({ page, mount }) => {
    await mount(STORY);
    await page.locator(TRIGGER).click();
    await openedLevel(page, 0);

    await firstItemOf(page, 0).hover();
    expect(await highlightAt(page, 0), "hovering a card still chooses it").toContain("New");
    await expect(page.locator(MENU), "but opens nothing").toHaveCount(1);

    await firstItemOf(page, 0).click();
    await openedLevel(page, 1);
    await expect(firstItemOf(page, 0), "a press is what steps in").not.toBeVisible();
});

test("a card with nothing under it still runs and closes the whole fan", async ({ page, mount }) => {
    await mount(STORY);
    await page.locator(TRIGGER).click();
    await openedLevel(page, 0);

    await page.keyboard.press("Enter");
    await openedLevel(page, 1);

    await page.keyboard.press("Enter");
    await expect(page.locator(MENU)).toHaveCount(0);
    expect(await readout(page)).toContain("Project");
});

test("Escape steps back out one level, leaving the arrows to walk the arc", async ({ page, mount }) => {
    await mount(STORY);
    await page.locator(TRIGGER).click();
    await openedLevel(page, 0);

    await page.keyboard.press("Enter");
    await openedLevel(page, 1);

    await page.keyboard.press("Escape");
    await expect(page.locator(MENU)).toHaveCount(1);
    expect(await highlightAt(page, 0), "landing back on the card that opened it").toContain("New");
    await expect(page.locator(MENU).nth(0), "which has focus back").toBeFocused();
});
