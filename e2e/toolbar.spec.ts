import { type Page, expect, test } from "@playwright/test";

import { accessibleText, activeText, attributesOf, demo, example, prop, readout } from "./helpers";

/**
 * The toolbar decides what fits by measuring, so nothing here writes down a width or a number of buttons:
 * every check is a relationship between what the row is showing and what the menu is holding. A spec that
 * pinned "four buttons at 620px" would go red the day somebody changed the padding on a button, which is
 * not a behavior change at all.
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

/**
 * A row's whole behavior is the cut: it measures what fits and moves the tail into a menu. A layout sizes
 * the bar itself, so there is no width to run out of and nothing to collapse — which is the one case in
 * this pass where a layout removes a behavior rather than relocating one. What has to survive is
 * everything else the toolbar is: the role, the single tab stop and the roving walk.
 */
const PALETTE = demo("palette");

const placedBox = (scope: string) => `${scope} [role="presentation"][style*="left"]`;

test("a ring of tools shows every action and collapses none of them", async ({ page }) => {
    await expect(page.locator(`${PALETTE} [role="toolbar"]`)).toHaveAttribute("aria-label", "Tools");

    const buttons = page.locator(`${PALETTE} button`);
    const placed = page.locator(placedBox(PALETTE));

    await expect(placed, "a box for every action").toHaveCount(await placed.count());
    expect(await placed.count(), "and one for each of them, so none went into a menu").toBe(
        (await buttons.count()) - (await page.locator(`${PALETTE} [aria-haspopup="menu"]`).count()),
    );

    await expect(
        page.locator(`${PALETTE} [aria-hidden="true"][inert] [aria-haspopup="menu"]`),
        "the overflow trigger is there but has nothing to hold, so it stays out of the tree",
    ).toHaveCount(1);
});

test("a ring keeps the single tab stop, and both pairs of arrows walk it", async ({ page }) => {
    const buttons = page.locator(`${PALETTE} button:not([aria-haspopup])`);

    expect(
        (await attributesOf(page, `${PALETTE} button:not([aria-haspopup])`, "tabindex")).filter(
            (value) => value === "0",
        ).length,
        "one stop for the whole ring",
    ).toBe(1);

    await buttons.first().focus();
    await page.keyboard.press("ArrowRight");
    expect(await activeText(page), "ArrowRight moves round the ring").toBe(await buttons.nth(1).textContent());

    await page.keyboard.press("ArrowDown");
    expect(await activeText(page), "and so does ArrowDown, a ring having no single axis").toBe(
        await buttons.nth(2).textContent(),
    );
});

/**
 * With `pressedValuesSignal` every action is a toggle button, so the checks are the ones a toggle group
 * owes: `aria-pressed` written on every action (a `"false"` rather than no attribute, since a mixed row would
 * announce plain buttons as something they are not), a press that flips it and the owner's list together,
 * the same single tab stop, and a collapsed action that turns up as a checked checkbox in the menu. Which
 * actions are pressed is read back from the page's readout by the action's own text, never a written-down
 * name. What the painter draws for "pressed" is nobody's business here; that it hears the state is, and that
 * is read as its mark's class coming back different from an unpressed neighbor's and then the same again.
 */
const PRESSED = example("pressed");
const PRESSED_ACTION = `${PRESSED} ${TOOLBAR} > div:not([aria-hidden]) button:not([aria-haspopup])`;
const CHECKBOX_ITEM = '[role="menu"] [role="menuitemcheckbox"]';

const markClass = (page: Page, index: number) =>
    page.locator(PRESSED_ACTION).nth(index).locator("span").first().getAttribute("class");

test.describe("a toolbar of pressed actions", () => {
    test.beforeEach(async ({ page }) => {
        await setBarWidth(page, WIDE_PX);
    });

    test("every action is a toggle button, and none starts pressed", async ({ page }) => {
        const pressed = await attributesOf(page, PRESSED_ACTION, "aria-pressed");

        expect(pressed.length, "the row holds actions").toBeGreaterThan(1);
        expect(pressed, "each says it is not pressed rather than leaving the attribute off").toEqual(
            pressed.map(() => "false"),
        );
        expect(await readout(page, "pressed"), "and the owner's list is empty").toContain("pressed: nothing");
    });

    test("a press holds the action down until it is pressed again, and the owner's list follows", async ({ page }) => {
        const first = page.locator(PRESSED_ACTION).first();
        const name = ((await first.textContent()) ?? "").trim();
        const unpressedMark = await markClass(page, 1);

        await first.click();

        await expect(first, "the press stays down").toHaveAttribute("aria-pressed", "true");
        await expect(page.locator(PRESSED_ACTION).nth(1), "and the others are untouched").toHaveAttribute(
            "aria-pressed",
            "false",
        );
        expect(await readout(page, "pressed"), "the owner's list holds the pressed action").toContain(name);
        expect(await markClass(page, 0), "and the painter hears the state").not.toBe(unpressedMark);

        await first.click();

        await expect(first, "a second press lets it back up").toHaveAttribute("aria-pressed", "false");
        expect(await readout(page, "pressed"), "and takes it out of the list").toContain("pressed: nothing");
        expect(await markClass(page, 0), "the painter draws it as its neighbors again").toBe(unpressedMark);
    });

    test("several actions can be down at once, since they are independent toggles", async ({ page }) => {
        const names = (await page.locator(PRESSED_ACTION).allTextContents()).map((text) => text.trim());

        await page.locator(PRESSED_ACTION).nth(0).click();
        await page.locator(PRESSED_ACTION).nth(1).click();

        await expect(
            page.locator(PRESSED_ACTION).nth(0),
            "pressing a second does not release the first",
        ).toHaveAttribute("aria-pressed", "true");
        await expect(page.locator(PRESSED_ACTION).nth(1)).toHaveAttribute("aria-pressed", "true");

        const text = await readout(page, "pressed");

        expect(text, "the list holds both").toContain(names[0]);
        expect(text).toContain(names[1]);
    });

    test("the row is one tab stop, the arrows walk it, and Space and Enter toggle", async ({ page }) => {
        expect(
            (await attributesOf(page, PRESSED_ACTION, "tabindex")).filter((value) => value === "0").length,
            "one stop for the whole row",
        ).toBe(1);

        const names = (await page.locator(PRESSED_ACTION).allTextContents()).map((text) => text.trim());

        await page.locator(PRESSED_ACTION).first().focus();
        await page.keyboard.press("ArrowRight");
        expect(await focusedText(page), "the arrows move along the row").toBe(names[1]);

        await page.keyboard.press(" ");
        await expect(page.locator(PRESSED_ACTION).nth(1), "Space presses the focused action").toHaveAttribute(
            "aria-pressed",
            "true",
        );

        await page.keyboard.press("Enter");
        await expect(page.locator(PRESSED_ACTION).nth(1), "and Enter lets it back up").toHaveAttribute(
            "aria-pressed",
            "false",
        );
        expect(await focusedText(page), "without the focus moving").toBe(names[1]);
    });

    test("a collapsed action is a checkbox in the menu, checked from the same list", async ({ page }) => {
        const name = ((await page.locator(PRESSED_ACTION).first().textContent()) ?? "").trim();

        await page.locator(PRESSED_ACTION).first().click();
        await setBarWidth(page, TIGHT_PX);

        const collapsed = await readCollapsed(page, PRESSED);

        expect(collapsed, "at the tightest width the pressed action has left the row").toContain(name);

        await page.locator(`${PRESSED} ${TOOLBAR} > div:not([aria-hidden]) button`).last().click();

        const items = page.locator(CHECKBOX_ITEM);

        await expect(items.first()).toBeVisible();

        expect(
            await Promise.all((await items.all()).map((item) => accessibleText(item))),
            "every collapsed action is a checkbox item, named without the painter's check mark",
        ).toEqual(collapsed);
        await expect(items.filter({ hasText: name }), "the one pressed in the row arrives checked").toHaveAttribute(
            "aria-checked",
            "true",
        );

        const other = collapsed.find((text) => text !== name)!;

        await expect(items.filter({ hasText: other }), "and one never pressed arrives unchecked").toHaveAttribute(
            "aria-checked",
            "false",
        );

        await items.filter({ hasText: other }).click();

        expect(await readout(page, "pressed"), "checking it in the menu presses it in the owner's list").toContain(
            other,
        );

        await page.keyboard.press("Escape");
        await setBarWidth(page, WIDE_PX);

        await expect(
            page.locator(PRESSED_ACTION).filter({ hasText: other }),
            "and it comes back to the row pressed",
        ).toHaveAttribute("aria-pressed", "true");
        await expect(page.locator(PRESSED_ACTION).filter({ hasText: name })).toHaveAttribute("aria-pressed", "true");
    });
});
