import { type Page, expect, test } from "@playwright/test";

/**
 * The React `Menubar`, `Toolbar` with its role fixed to `menubar` and a `Menu` behind every word. The cases follow
 * `e2e/menubar.spec.ts`: a named bar of words that are each a `menuitem` opening a menu, one tab stop walked by the
 * arrows without opening anything, a word's menu labelled by the word, and the one rule a menubar adds — with a
 * menu open, the arrow to the next or previous word closes it and opens that word's, in an order that leaves focus
 * on the new word for Escape — while an arrow the open menu uses itself, and Home, End and the vertical arrows, stay
 * with the menu. A word pushed out of the row becomes a submenu of the overflow menu.
 *
 * Which word is which is read off the order the row draws them in, never off their captions, and a word's menu is
 * found through the id it is labelled by.
 */
const BAR = '[role="menubar"]';
const WORD = `${BAR} > div:not([aria-hidden]) [role="menuitem"][aria-haspopup="menu"]:not([aria-label])`;
const OVERFLOW = `${BAR} > div [role="menuitem"][aria-label]`;
const MENU = '[role="menu"]';
const STORY = "Essentials/Menubar/Default";
const NARROW_PX = "80";

const readout = (page: Page) => page.locator('[data-readout="last"]').textContent();

const word = (page: Page, index: number) => page.locator(WORD).nth(index);

const menuOf = async (page: Page, index: number) =>
    page.locator(`${MENU}[aria-labelledby="${await word(page, index).getAttribute("id")}"]`);

const wordCount = (page: Page) => page.locator(WORD).count();

const highlightOf = async (page: Page, index: number) => {
    const id = await (await menuOf(page, index)).getAttribute("aria-activedescendant");

    return page.evaluate((value) => {
        const element = value ? document.getElementById(value) : null;

        if (!element) return null;

        const clone = element.cloneNode(true) as HTMLElement;

        for (const hidden of clone.querySelectorAll('[aria-hidden="true"]')) hidden.remove();

        return (clone.textContent ?? "").trim();
    }, id);
};

/**
 * Opening is not instant, and the menu both takes focus and points at a highlighted item once it is positioned. A
 * key pressed before the focus half lands on the word, so every keyboard case waits on both.
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
    page.locator(WORD).evaluateAll((elements) => elements.map((element) => element.getAttribute("aria-expanded")));

const tabStops = (page: Page) =>
    page.locator(WORD).evaluateAll((elements) => elements.map((element) => (element as HTMLElement).tabIndex));

test.beforeEach(async ({ page, mount }) => {
    await mount(STORY);
    await expect(page.locator(WORD).first()).toBeVisible();
});

test("the bar is a named menubar of words, each a menuitem that opens a menu", async ({ page }) => {
    await expect(page.locator(BAR)).toHaveAttribute("aria-label", "Editor");
    expect(await wordCount(page)).toBeGreaterThan(1);
    expect(
        (await expandedStates(page)).every((state) => state === "false"),
        "every word starts closed",
    ).toBe(true);
    await expect(page.locator(MENU), "with no menu in the tree at all").toHaveCount(0);
});

test("the row is one tab stop, and the arrows walk the words without opening anything", async ({ page }) => {
    expect(await tabStops(page), "only the first word is a tab stop").toEqual(
        (await tabStops(page)).map((_stop, index) => (index === 0 ? 0 : -1)),
    );

    await word(page, 0).focus();
    await page.keyboard.press("ArrowRight");

    await expect(word(page, 1), "the arrow moves focus to the next word").toBeFocused();
    await expect(word(page, 1), "which is now the tab stop").toHaveAttribute("tabindex", "0");
    await expect(page.locator(MENU), "and walking a closed bar opens nothing").toHaveCount(0);
});

test("pressing a word opens its menu, labelled by the word, and moves focus into it", async ({ page }) => {
    await openedByClick(page, 0);

    await expect(word(page, 0)).toHaveAttribute("aria-expanded", "true");
    expect(await word(page, 0).getAttribute("aria-controls")).toBe(await (await menuOf(page, 0)).getAttribute("id"));
});

test("with a menu open, the right arrow closes it and opens the next word's menu", async ({ page }) => {
    await openedByClick(page, 1);

    await page.keyboard.press("ArrowRight");

    await expectOpenOn(page, 2);
    await expect(page.locator(MENU), "one menu is open, not two").toHaveCount(1);
    await expect(word(page, 1), "the word it came from says it is closed").toHaveAttribute("aria-expanded", "false");
    await expect(word(page, 2)).toHaveAttribute("aria-expanded", "true");
    await expect(word(page, 2), "and the row's tab stop moved with it").toHaveAttribute("tabindex", "0");
});

test("with a menu open, the left arrow closes it and opens the previous word's menu", async ({ page }) => {
    await openedByClick(page, 2);

    await page.keyboard.press("ArrowLeft");

    await expectOpenOn(page, 1);
    await expect(page.locator(MENU)).toHaveCount(1);
    await expect(word(page, 2)).toHaveAttribute("aria-expanded", "false");
});

test("the handover wraps from the last word to the first, as the row's walk does", async ({ page }) => {
    const last = (await wordCount(page)) - 1;

    await openedByClick(page, last);
    await page.keyboard.press("ArrowRight");

    await expectOpenOn(page, 0);
    await expect(page.locator(MENU)).toHaveCount(1);
});

test("Escape after a handover closes the menu and leaves focus on the word it now belongs to", async ({ page }) => {
    await openedByClick(page, 1);
    await page.keyboard.press("ArrowRight");
    await expectOpenOn(page, 2);

    await page.keyboard.press("Escape");

    await expect(page.locator(MENU)).toHaveCount(0);
    await expect(word(page, 2), "focus is on the word whose menu it was").toBeFocused();
});

test("an arrow that opens or closes a submenu is the menu's, and does not switch words", async ({ page }) => {
    await openedByClick(page, 0);
    const menuId = await (await menuOf(page, 0)).getAttribute("id");

    await page.keyboard.press("ArrowRight");

    await expect(page.locator(MENU), "the right arrow on an item with a submenu opens it").toHaveCount(2);
    await expect(page.locator(MENU).nth(1)).toBeFocused();
    await expect(word(page, 0)).toHaveAttribute("aria-expanded", "true");
    await expect(word(page, 1)).toHaveAttribute("aria-expanded", "false");

    await page.keyboard.press("ArrowLeft");

    await expect(page.locator(MENU), "the left arrow inside the submenu closes only the submenu").toHaveCount(1);
    await expect(page.locator(`[id="${menuId}"]`), "leaving focus in the word's menu").toBeFocused();
    expect((await expandedStates(page)).filter((state) => state === "true").length).toBe(1);
});

test("Home, End and the vertical arrows stay inside the open menu", async ({ page }) => {
    await openedByClick(page, 1);
    const first = await highlightOf(page, 1);

    await page.keyboard.press("End");
    expect(await highlightOf(page, 1)).not.toBe(first);

    await page.keyboard.press("Home");
    expect(await highlightOf(page, 1)).toBe(first);

    await page.keyboard.press("ArrowDown");
    expect(await highlightOf(page, 1)).not.toBe(first);

    await expect(page.locator(MENU)).toHaveCount(1);
    await expect(word(page, 1)).toHaveAttribute("aria-expanded", "true");
});

test("picking an item runs it, closes the menu and puts focus back on its word", async ({ page }) => {
    await openedByClick(page, 1);
    const highlighted = (await highlightOf(page, 1)) ?? "";

    await page.keyboard.press("Enter");

    await expect(page.locator(MENU)).toHaveCount(0);

    const picked = /last picked: (.+?) —/.exec((await readout(page)) ?? "")?.[1] ?? "";

    expect(highlighted.startsWith(picked) && picked.length > 0, "it was the item the highlight was on").toBe(true);
    await expect(word(page, 1)).toBeFocused();
});

test("a checked item keeps its state across visits, since one list serves every menu", async ({ page }) => {
    const last = (await wordCount(page)) - 1;

    await openedByClick(page, last);

    const checked = (await menuOf(page, last)).locator('[aria-checked="true"]');
    const before = await checked.count();

    await (await menuOf(page, last)).locator('[role="menuitemcheckbox"][aria-checked="false"]').first().click();
    await expect(checked, "ticking adds to the list and leaves the menu open").toHaveCount(before + 1);
});

test("a word pushed out of the row becomes a submenu of the overflow menu", async ({ page }) => {
    const all = await wordCount(page);

    await page.getByTestId("barWidth").fill(NARROW_PX);
    await page.getByTestId("barWidth").blur();
    await expect.poll(() => wordCount(page), "a narrow bar shows fewer words").toBeLessThan(all);

    const overflow = page.locator(OVERFLOW);

    await expect(overflow, "the overflow trigger is a menuitem too").toHaveAttribute("aria-haspopup", "menu");

    await overflow.click();
    await expect(page.locator(MENU)).toHaveCount(1);

    const inRow = await wordCount(page);

    await expect(
        page.locator(`${MENU} [role="menuitem"][aria-haspopup="menu"]`),
        "every word that left the row is in the overflow menu, each as a submenu",
    ).toHaveCount(all - inRow);
});
