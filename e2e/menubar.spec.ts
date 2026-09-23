import { type Page, expect, test } from "@playwright/test";

import { activeDescendantText, activeMatches, demo, prop, readout } from "./helpers";

const BAR = `${demo("default")} [role="menubar"]`;
const WORD = `${BAR} > div:not([aria-hidden]) [role="menuitem"][aria-haspopup="menu"]:not([aria-label])`;
const OVERFLOW = `${BAR} > div [role="menuitem"][aria-label]`;
const MENU = '[role="menu"]';

const NARROW_PX = "80";

/**
 * The overflow trigger is a menuitem that opens a menu as well, and is told apart from the words by the name
 * it is given in place of a caption. Words that have left the row are still rendered, so they can be
 * measured, and are read out of the row by `aria-hidden` rather than by being absent.
 *
 * Which word is which is read off the order the row draws them in, never off their captions: the first word,
 * the second, the last. A word's menu is found through the word itself, by the id its menu is labelled by.
 */
const word = (page: Page, index: number) => page.locator(WORD).nth(index);

const menuOf = async (page: Page, index: number) =>
    page.locator(`${MENU}[aria-labelledby="${await word(page, index).getAttribute("id")}"]`);

const wordCount = (page: Page) => page.locator(WORD).count();

/**
 * Opening is not instant, and the menu both takes focus and points at a highlighted item once it is
 * positioned. A key pressed before the focus half lands on the word, so every keyboard case waits on both.
 */
const expectOpenOn = async (page: Page, index: number) => {
    const menu = await menuOf(page, index);

    await expect(menu, "the word's own menu is open").toHaveCount(1);
    await expect(menu).toHaveAttribute("aria-activedescendant", /.+/);
    await expect(menu, "and has taken focus").toBeFocused();
};

const openedByClick = async (page: Page, index: number) => {
    await word(page, index).click();
    await expectOpenOn(page, index);
};

const expandedStates = (page: Page) =>
    page.evaluate(
        (selector) => [...document.querySelectorAll(selector)].map((element) => element.getAttribute("aria-expanded")),
        WORD,
    );

const tabStops = (page: Page) =>
    page.evaluate(
        (selector) => [...document.querySelectorAll(selector)].map((element) => (element as HTMLElement).tabIndex),
        WORD,
    );

const setBarWidth = async (page: Page, value: string) => {
    await page.locator(`${prop("barWidth")} input`).fill(value);
    await page.locator(`${prop("barWidth")} input`).blur();
};

test.beforeEach(async ({ page }) => {
    await page.goto("/menubar");
    await expect(page.locator(WORD).first()).toBeVisible();
});

test("the bar is a named menubar of words, each a menuitem that opens a menu", async ({ page }) => {
    await expect(page.locator(BAR), "the bar is named on its own element").toHaveAttribute("aria-label", /.+/);
    expect(await wordCount(page), "it has several words in the row").toBeGreaterThan(1);
    expect(
        (await expandedStates(page)).every((state) => state === "false"),
        "every word says it has a menu, and every one starts closed",
    ).toBe(true);
    await expect(page.locator(MENU), "with no menu in the tree at all").toHaveCount(0);
});

test("the row is one tab stop, and the arrows walk the words without opening anything", async ({ page }) => {
    expect(await tabStops(page), "only the first word is a tab stop").toEqual(
        (await tabStops(page)).map((_stop, index) => (index === 0 ? 0 : -1)),
    );

    await word(page, 0).focus();
    await page.keyboard.press("ArrowRight");

    expect(await activeMatches(page, `${WORD}[tabindex="0"]`), "the arrow moves focus to the next word").toBe(true);
    await expect(word(page, 1), "which is now the tab stop").toHaveAttribute("tabindex", "0");
    await expect(page.locator(MENU), "and walking a closed bar opens nothing").toHaveCount(0);
});

test("pressing a word opens its menu, labelled by the word, and moves focus into it", async ({ page }) => {
    await openedByClick(page, 0);

    await expect(word(page, 0), "the word says it is open").toHaveAttribute("aria-expanded", "true");
    expect(await word(page, 0).getAttribute("aria-controls"), "and points at the menu it controls").toBe(
        await (await menuOf(page, 0)).getAttribute("id"),
    );
});

/**
 * The one rule a menubar adds to a toolbar, and it had never been watched: with a menu open, the arrow that
 * moves to the next word closes that menu and opens the next word's. The first item of the second word's
 * menu has no submenu, so the arrow is not claimed by the menu and the handover is what happens.
 */
test("with a menu open, the right arrow closes it and opens the next word's menu", async ({ page }) => {
    await openedByClick(page, 1);

    await page.keyboard.press("ArrowRight");

    await expectOpenOn(page, 2);
    await expect(page.locator(MENU), "one menu is open, not two").toHaveCount(1);
    await expect(word(page, 1), "the word it came from says it is closed").toHaveAttribute("aria-expanded", "false");
    await expect(word(page, 2), "and the next word says it is open").toHaveAttribute("aria-expanded", "true");
    await expect(word(page, 2), "and the row's tab stop moved with it").toHaveAttribute("tabindex", "0");
});

test("with a menu open, the left arrow closes it and opens the previous word's menu", async ({ page }) => {
    await openedByClick(page, 2);

    await page.keyboard.press("ArrowLeft");

    await expectOpenOn(page, 1);
    await expect(page.locator(MENU), "one menu is open, not two").toHaveCount(1);
    await expect(word(page, 2), "the word it came from says it is closed").toHaveAttribute("aria-expanded", "false");
});

test("the handover wraps from the last word to the first, as the row's walk does", async ({ page }) => {
    const last = (await wordCount(page)) - 1;

    await openedByClick(page, last);
    await page.keyboard.press("ArrowRight");

    await expectOpenOn(page, 0);
    await expect(page.locator(MENU), "one menu is open, not two").toHaveCount(1);
});

/**
 * The switch closes the old menu first, which returns focus to its own word, then moves focus to the next
 * word, and only then opens the next menu — so the new popup records the new word as where focus came from.
 * Escape is how that order shows: it has to leave focus on the word whose menu was open, not on the first.
 */
test("Escape after a handover closes the menu and leaves focus on the word it now belongs to", async ({ page }) => {
    await openedByClick(page, 1);
    await page.keyboard.press("ArrowRight");
    await expectOpenOn(page, 2);

    await page.keyboard.press("Escape");

    await expect(page.locator(MENU), "Escape closes the menu").toHaveCount(0);
    await expect(word(page, 2), "and focus is on the word whose menu it was").toBeFocused();
});

/**
 * An arrow the open menu uses itself is left alone. The first item of the first word's menu has a submenu, so
 * the right arrow there opens the submenu, and the left arrow inside the submenu closes it — neither of them
 * moves to another word.
 */
test("an arrow that opens or closes a submenu is the menu's, and does not switch words", async ({ page }) => {
    await openedByClick(page, 0);
    const menu = await menuOf(page, 0);
    const menuId = await menu.getAttribute("id");

    await page.keyboard.press("ArrowRight");

    await expect(page.locator(MENU), "the right arrow on an item with a submenu opens the submenu").toHaveCount(2);
    await expect(page.locator(MENU).nth(1), "which takes focus").toBeFocused();
    await expect(word(page, 0), "and the word's menu is still open").toHaveAttribute("aria-expanded", "true");
    await expect(word(page, 1), "with no other word opened").toHaveAttribute("aria-expanded", "false");

    await page.keyboard.press("ArrowLeft");

    await expect(page.locator(MENU), "the left arrow inside the submenu closes only the submenu").toHaveCount(1);
    await expect(page.locator(`#${menuId}`), "leaving focus in the word's menu").toBeFocused();
    await expect(word(page, 0), "the first word still says it is open").toHaveAttribute("aria-expanded", "true");
    expect(
        (await expandedStates(page)).filter((state) => state === "true").length,
        "and no other word was opened on the way",
    ).toBe(1);
});

test("Home, End and the vertical arrows stay inside the open menu", async ({ page }) => {
    await openedByClick(page, 1);
    const menuSelector = `#${await (await menuOf(page, 1)).getAttribute("id")}`;
    const first = await activeDescendantText(page, menuSelector);

    await page.keyboard.press("End");
    const last = await activeDescendantText(page, menuSelector);

    expect(last, "End moves the highlight to another item").not.toBe(first);

    await page.keyboard.press("Home");
    expect(await activeDescendantText(page, menuSelector), "Home moves it back to the first").toBe(first);

    await page.keyboard.press("ArrowDown");
    expect(await activeDescendantText(page, menuSelector), "the down arrow moves it along").not.toBe(first);

    await expect(page.locator(MENU), "and none of them closed the menu or opened another").toHaveCount(1);
    await expect(word(page, 1)).toHaveAttribute("aria-expanded", "true");
});

test("picking an item runs it, closes the menu and puts focus back on its word", async ({ page }) => {
    await openedByClick(page, 1);
    const menuSelector = `#${await (await menuOf(page, 1)).getAttribute("id")}`;
    const highlighted = (await activeDescendantText(page, menuSelector)) ?? "";
    const before = await readout(page, "default");

    await page.keyboard.press("Enter");

    await expect(page.locator(MENU), "Enter closes the menu").toHaveCount(0);

    const after = await readout(page, "default");
    const picked = /last picked: (.+?) —/.exec(after)?.[1] ?? "";

    expect(after, "something ran").not.toBe(before);
    expect(highlighted.startsWith(picked) && picked.length > 0, "and it was the item the highlight was on").toBe(true);
    await expect(word(page, 1), "with focus back on the word the menu belonged to").toBeFocused();
});

test("a word pushed out of the row becomes a submenu of the overflow menu", async ({ page }) => {
    const all = await wordCount(page);

    await setBarWidth(page, NARROW_PX);
    await expect.poll(() => wordCount(page), "a narrow bar shows fewer words").toBeLessThan(all);

    const overflow = page.locator(OVERFLOW);

    await expect(
        overflow,
        "the overflow trigger is a menuitem too, as every child of a menubar must be",
    ).toHaveAttribute("aria-haspopup", "menu");

    await overflow.click();
    await expect(page.locator(MENU)).toHaveCount(1);

    const inRow = await wordCount(page);

    await expect(
        page.locator(`${MENU} [role="menuitem"][aria-haspopup="menu"]`),
        "every word that left the row is in the overflow menu, each as a submenu",
    ).toHaveCount(all - inRow);
});
