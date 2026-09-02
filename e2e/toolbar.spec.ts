import { type Page, expect, test } from "@playwright/test";

import { example, prop } from "./helpers";

/**
 * The toolbar decides what fits by measuring, so nothing here writes down a width or a number of buttons:
 * every check is a relationship between what the row is showing and what the menu is holding. A spec that
 * pinned "four buttons at 620px" would go red the day somebody changed the padding on a button, which is
 * not a behaviour change at all.
 *
 * Every action is rendered whether or not it fits — the ones that do not are taken out of the flow so they
 * can still be measured — so "in the row" is read off `aria-hidden` rather than off what is in the DOM.
 */
const DEFAULT = example("default");
const REFUSING = example("refusing");
const TOOLBAR = '[role="toolbar"]';
const MENU_ITEM = '[role="menu"] [role="menuitem"]';

const WIDE_PX = "700";
const WIDEST_PX = "760";
const NARROW_PX = "320";
const TIGHT_PX = "150";
const SETTLE_MS = 250;

const setBarWidth = async (page: Page, value: string) => {
    await page.locator(`${prop("barWidth")} input`).fill(value);
    await page.locator(`${prop("barWidth")} input`).blur();
    await page.waitForTimeout(SETTLE_MS);
};

const readRow = (page: Page, scope: string) =>
    page.evaluate((value) => {
        const bar = document.querySelector(`${value} [role="toolbar"]`) as HTMLElement;

        return [...bar.children]
            .filter((item) => item.getAttribute("aria-hidden") !== "true")
            .map((item) => (item.textContent ?? "").trim());
    }, scope);

const readCollapsed = (page: Page, scope: string) =>
    page.evaluate((value) => {
        const bar = document.querySelector(`${value} [role="toolbar"]`) as HTMLElement;

        return [...bar.children]
            .filter((item) => item.getAttribute("aria-hidden") === "true")
            .map((item) => (item.textContent ?? "").trim());
    }, scope);

const openOverflow = async (page: Page, scope: string) => {
    await page.locator(`${scope} ${TOOLBAR} > div:not([aria-hidden]) button`).last().click();
    await expect(page.locator(MENU_ITEM).first()).toBeVisible();
};

const readMenu = async (page: Page) => (await page.locator(MENU_ITEM).allTextContents()).map((text) => text.trim());

const focusedText = (page: Page) => page.evaluate(() => (document.activeElement?.textContent ?? "").trim());

const isInsideToolbar = (page: Page, scope: string) =>
    page.evaluate((value) => !!document.activeElement?.closest(`${value} [role="toolbar"]`), scope);

test.beforeEach(async ({ page }) => {
    await page.goto("/toolbar");
    await expect(page.locator(DEFAULT)).toBeVisible();
    await page.waitForTimeout(SETTLE_MS);
});

test("every action is either in the row or in the menu, and none is in both or in neither", async ({ page }) => {
    await setBarWidth(page, NARROW_PX);

    const row = await readRow(page, DEFAULT);
    const collapsed = await readCollapsed(page, DEFAULT);

    await openOverflow(page, DEFAULT);

    const menu = await readMenu(page);

    expect(menu, "what the menu holds is exactly what came out of the row").toEqual(collapsed);
    expect(
        row.filter((text) => menu.includes(text)),
        "and nothing appears in both places",
    ).toEqual([]);
});

test("narrowing the bar takes actions off the end, and widening it puts the same ones back", async ({ page }) => {
    await setBarWidth(page, WIDE_PX);

    const wide = await readRow(page, DEFAULT);

    await setBarWidth(page, NARROW_PX);

    const narrow = await readRow(page, DEFAULT);

    await setBarWidth(page, WIDE_PX);

    const again = await readRow(page, DEFAULT);

    expect(narrow.length, "a narrower bar shows fewer actions").toBeLessThan(wide.length);
    expect(
        wide.slice(0, narrow.length - 1),
        "and the ones it keeps are the front of the row, not a subset chosen by width",
    ).toEqual(narrow.slice(0, narrow.length - 1));
    expect(again, "the same width gives the same row, so a resize cannot drift").toEqual(wide);
});

test("the row is one tab stop, and the arrows walk it", async ({ page }) => {
    await setBarWidth(page, NARROW_PX);

    const row = await readRow(page, DEFAULT);

    await page.locator(`${DEFAULT} button`).first().focus();
    await page.keyboard.press("Tab");

    expect(await focusedText(page), "tabbing in lands on the first action rather than anywhere in the row").toBe(
        row[0],
    );

    const visited = [await focusedText(page)];

    for (let step = 1; step < row.length; step++) {
        await page.keyboard.press("ArrowRight");
        visited.push(await focusedText(page));
    }

    expect(visited, "the arrows reach every action in the row and the overflow button last").toEqual(row);

    await page.keyboard.press("ArrowRight");
    expect(await focusedText(page), "and the walk wraps rather than stopping").toBe(row[0]);
});

test("an action that has left the row has left the walk with it", async ({ page }) => {
    await setBarWidth(page, NARROW_PX);

    const collapsed = await readCollapsed(page, DEFAULT);
    const row = await readRow(page, DEFAULT);

    await page.locator(`${DEFAULT} button`).first().focus();
    await page.keyboard.press("Tab");

    const visited = [await focusedText(page)];

    for (let step = 1; step < row.length; step++) {
        await page.keyboard.press("ArrowRight");
        visited.push(await focusedText(page));
    }

    expect(
        visited.filter((text) => collapsed.includes(text)),
        "a collapsed action is measurable but not reachable",
    ).toEqual([]);
});

test("tabbing again leaves the toolbar rather than moving along it", async ({ page }) => {
    await setBarWidth(page, NARROW_PX);

    await page.locator(`${DEFAULT} button`).first().focus();
    await page.keyboard.press("Tab");

    expect(await isInsideToolbar(page, DEFAULT), "focus went in").toBe(true);

    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("Tab");

    expect(await isInsideToolbar(page, DEFAULT), "and one more tab is out of it entirely").toBe(false);
});

test("an action that refuses to collapse is the last one standing", async ({ page }) => {
    await setBarWidth(page, TIGHT_PX);

    const row = await readRow(page, REFUSING);

    expect(row.length, "the refusing action and the overflow button are all that is left").toBe(2);
    expect(row[0], "and it is the refusing one rather than the first in the list").toBe("Share");
});

test("an action that always collapses is never in the row, however much room there is", async ({ page }) => {
    await setBarWidth(page, WIDEST_PX);

    const row = await readRow(page, REFUSING);
    const collapsed = await readCollapsed(page, REFUSING);

    expect(collapsed, "it is out even at the widest the bar goes").toContain("Print");
    expect(row, "and the action after it in the list is in the row, so it did not simply fall off the end").toContain(
        "Archive",
    );
});

test("the same action runs whether it is pressed in the row or picked in the menu", async ({ page }) => {
    await setBarWidth(page, NARROW_PX);

    const row = await readRow(page, DEFAULT);
    const collapsed = await readCollapsed(page, DEFAULT);

    await page.locator(`${DEFAULT} ${TOOLBAR} > div:not([aria-hidden]) button`).first().click();

    expect(
        await page.locator(`${DEFAULT} [data-readout]`).textContent(),
        "the button in the row reports the action it was painting",
    ).toContain(row[0]);

    await openOverflow(page, DEFAULT);
    await page.locator(MENU_ITEM).first().click();
    await expect(page.locator(MENU_ITEM).first()).toBeHidden();

    expect(
        await page.locator(`${DEFAULT} [data-readout]`).textContent(),
        "and the menu row reports through the same callback, with no second description of the action",
    ).toContain(collapsed[0]);
});
