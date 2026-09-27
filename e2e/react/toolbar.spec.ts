import { type Page, expect, test } from "@playwright/test";

/**
 * The React `Toolbar`, over the React `Menu` for its overflow. The cases follow `e2e/toolbar.spec.ts`, which covers
 * the Solid one: every action is either in the row or in the overflow menu, the row is cut from the end and a
 * resize cannot drift, the row is one tab stop walked by the arrows, `collapse` refuses or forces the cut, one
 * callback serves both places, a laid-out bar collapses nothing, and with a pressed list every action is a toggle
 * button whose collapsed self is a checked checkbox in the menu.
 *
 * Nothing writes down a width or a number of buttons: every check is a relationship between what the row shows and
 * what the menu holds. "In the row" is read off `aria-hidden`, since a collapsed action is still rendered so it can
 * be measured.
 */
const TOOLBAR = '[role="toolbar"]';
const MENU_ITEM = '[role="menu"] [role="menuitem"]';
const CHECKBOX_ITEM = '[role="menu"] [role="menuitemcheckbox"]';
const SHOWN_BUTTON = `${TOOLBAR} > div:not([aria-hidden]) button`;
const PRESSED_ACTION = `${SHOWN_BUTTON}:not([aria-haspopup])`;

const WIDE_PX = "700";
const WIDEST_PX = "760";
const NARROW_PX = "320";
const TIGHT_PX = "150";
const SETTLE_MS = 250;

const readout = (page: Page) => page.locator('[data-readout="last"]').textContent();

const setBarWidth = async (page: Page, value: string) => {
    await page.getByTestId("barWidth").fill(value);
    await page.getByTestId("barWidth").blur();
    await page.waitForTimeout(SETTLE_MS);
};

const readItems = (page: Page, isHidden: boolean) =>
    page.evaluate(
        ({ selector, hidden }) =>
            [...document.querySelector(selector)!.children]
                .filter((item) => (item.getAttribute("aria-hidden") === "true") === hidden)
                .map((item) => (item.textContent ?? "").trim()),
        { selector: TOOLBAR, hidden: isHidden },
    );

const readRow = (page: Page) => readItems(page, false);

const readCollapsed = (page: Page) => readItems(page, true);

const openOverflow = async (page: Page) => {
    await page.locator(SHOWN_BUTTON).last().click();
    await expect(page.locator('[role="menu"] [role^="menuitem"]').first()).toBeVisible();
};

const readMenu = async (page: Page) => (await page.locator(MENU_ITEM).allTextContents()).map((text) => text.trim());

const focusedText = (page: Page) => page.evaluate(() => (document.activeElement?.textContent ?? "").trim());

const isInsideToolbar = (page: Page) =>
    page.evaluate((selector) => !!document.activeElement?.closest(selector), TOOLBAR);

type Mount = (story: string, props?: Record<string, unknown>) => Promise<unknown>;

const mountBar = async (mount: Mount, variant = "default") => {
    await mount("Essentials/Toolbar/Default", { variant });
};

test("the bar is a named toolbar, and every action is either in the row or in the menu, never both", async ({
    page,
    mount,
}) => {
    await mountBar(mount);
    await expect(page.locator(TOOLBAR)).toHaveAttribute("aria-label", "Formatting");

    await setBarWidth(page, NARROW_PX);

    const row = await readRow(page);
    const collapsed = await readCollapsed(page);

    expect(collapsed.length, "a narrow bar collapses something").toBeGreaterThan(0);

    await openOverflow(page);

    const menu = await readMenu(page);

    expect(menu, "what the menu holds is exactly what came out of the row").toEqual(collapsed);
    expect(
        row.filter((text) => menu.includes(text)),
        "and nothing appears in both places",
    ).toEqual([]);
});

test("narrowing the bar takes actions off the end, and widening it puts the same ones back", async ({
    page,
    mount,
}) => {
    await mountBar(mount);

    await setBarWidth(page, WIDE_PX);
    const wide = await readRow(page);

    await setBarWidth(page, NARROW_PX);
    const narrow = await readRow(page);

    await setBarWidth(page, WIDE_PX);
    const again = await readRow(page);

    expect(narrow.length, "a narrower bar shows fewer actions").toBeLessThan(wide.length);
    expect(wide.slice(0, narrow.length - 1), "the ones it keeps are the front of the row").toEqual(
        narrow.slice(0, narrow.length - 1),
    );
    expect(again, "the same width gives the same row").toEqual(wide);
});

test("a clicked action is where the arrows walk on from", async ({ page, mount }) => {
    await mountBar(mount);
    await setBarWidth(page, WIDE_PX);

    const row = await readRow(page);

    await page.locator(SHOWN_BUTTON, { hasText: row[2] }).click();
    await page.keyboard.press("ArrowRight");

    expect(await focusedText(page), "the walk moves on from the clicked action").toBe(row[3]);
});

test("the row is one tab stop, the arrows walk it with the overflow button last, and it wraps", async ({
    page,
    mount,
}) => {
    await mountBar(mount);
    await setBarWidth(page, NARROW_PX);

    const row = await readRow(page);
    const collapsed = await readCollapsed(page);

    await page.getByTestId("barWidth").focus();
    await page.keyboard.press("Tab");

    expect(await focusedText(page), "tabbing in lands on the first action").toBe(row[0]);

    const visited = [await focusedText(page)];

    for (let step = 1; step < row.length; step++) {
        await page.keyboard.press("ArrowRight");
        visited.push(await focusedText(page));
    }

    expect(visited, "the arrows reach every action in the row and the overflow button last").toEqual(row);
    expect(
        visited.filter((text) => collapsed.includes(text)),
        "a collapsed action is measurable but not reachable",
    ).toEqual([]);

    await page.keyboard.press("ArrowRight");
    expect(await focusedText(page), "and the walk wraps").toBe(row[0]);
});

test("tabbing again leaves the toolbar rather than moving along it", async ({ page, mount }) => {
    await mountBar(mount);
    await setBarWidth(page, NARROW_PX);

    await page.getByTestId("barWidth").focus();
    await page.keyboard.press("Tab");
    expect(await isInsideToolbar(page), "focus went in").toBe(true);

    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("Tab");
    expect(await isInsideToolbar(page), "and one more tab is out of it entirely").toBe(false);
});

test("an action that refuses to collapse is the last one standing, and one that always collapses never shows", async ({
    page,
    mount,
}) => {
    await mountBar(mount, "refusing");

    await setBarWidth(page, TIGHT_PX);
    const tight = await readRow(page);

    expect(tight.length, "the refusing action and the overflow button are all that is left").toBe(2);
    expect(tight[0], "and it is the refusing one").toBe("Share");

    await setBarWidth(page, WIDEST_PX);

    expect(await readCollapsed(page), "Print is out even at the widest").toContain("Print");
    expect(await readRow(page), "while the action after it is in the row").toContain("Archive");
});

test("the arrows step past a disabled action", async ({ page, mount }) => {
    await mountBar(mount, "refusing");
    await setBarWidth(page, WIDEST_PX);

    await page.getByTestId("barWidth").focus();
    await page.keyboard.press("Tab");
    await page.keyboard.press("End");
    expect(await focusedText(page), "End reaches the overflow button").toBe("More");

    await page.keyboard.press("ArrowLeft");
    expect(await focusedText(page), "Rename is disabled, so one step back is the action before it").toBe("Archive");

    await page.keyboard.press("ArrowRight");
    expect(await focusedText(page), "and the walk forward steps past it again").toBe("More");
});

test("the same action runs whether it is pressed in the row or picked in the menu", async ({ page, mount }) => {
    await mountBar(mount);
    await setBarWidth(page, NARROW_PX);

    const row = await readRow(page);
    const collapsed = await readCollapsed(page);

    await page.locator(SHOWN_BUTTON).first().click();
    expect(await readout(page)).toContain(row[0]);

    await openOverflow(page);
    await page.locator(MENU_ITEM).first().click();
    await expect(page.locator(MENU_ITEM).first()).toBeHidden();

    expect(await readout(page), "the menu row reports through the same callback").toContain(collapsed[0]);
});

test("the overflow menu is walked inside itself, and its arrows do not move focus out to the row", async ({
    page,
    mount,
}) => {
    await mountBar(mount);
    await setBarWidth(page, NARROW_PX);

    await page.locator(SHOWN_BUTTON).last().focus();
    await page.keyboard.press("Enter");
    await expect(page.locator('[role="menu"]')).toBeFocused();

    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("End");

    await expect(page.locator('[role="menu"]'), "the keys stayed with the menu").toBeFocused();
});

test.describe("a ring of tools", () => {
    const PALETTE = "Essentials/Toolbar/Palette";
    const PLACED = `${TOOLBAR} [role="presentation"][style*="left"]`;

    test("shows every action and collapses none of them", async ({ page, mount }) => {
        await mount(PALETTE);

        await expect(page.locator(TOOLBAR)).toHaveAttribute("aria-label", "Tools");

        const buttons = page.locator(`${TOOLBAR} button`);
        const placed = page.locator(PLACED);

        expect(await placed.count(), "one box for each action").toBe(
            (await buttons.count()) - (await page.locator(`${TOOLBAR} [aria-haspopup="menu"]`).count()),
        );
        await expect(
            page.locator(`${TOOLBAR} [aria-hidden="true"][inert] [aria-haspopup="menu"]`),
            "the overflow trigger is there but has nothing to hold, so it stays out of the tree",
        ).toHaveCount(1);
    });

    test("keeps the single tab stop, and both pairs of arrows walk it", async ({ page, mount }) => {
        await mount(PALETTE);

        const buttons = page.locator(`${TOOLBAR} button:not([aria-haspopup])`);

        await expect(page.locator(`${TOOLBAR} button:not([aria-haspopup])[tabindex="0"]`)).toHaveCount(1);

        await buttons.first().focus();
        await page.keyboard.press("ArrowRight");
        expect(await focusedText(page), "ArrowRight moves round the ring").toBe(
            ((await buttons.nth(1).textContent()) ?? "").trim(),
        );

        await page.keyboard.press("ArrowDown");
        expect(await focusedText(page), "and so does ArrowDown").toBe(
            ((await buttons.nth(2).textContent()) ?? "").trim(),
        );
    });
});

test.describe("a toolbar of pressed actions", () => {
    const PRESSED = "Essentials/Toolbar/Pressed";

    const markClass = (page: Page, index: number) =>
        page.locator(PRESSED_ACTION).nth(index).locator("span").first().getAttribute("class");

    test.beforeEach(async ({ page, mount }) => {
        await mount(PRESSED);
        await setBarWidth(page, WIDE_PX);
    });

    test("every action is a toggle button, and none starts pressed", async ({ page }) => {
        const pressed = await page
            .locator(PRESSED_ACTION)
            .evaluateAll((elements) => elements.map((element) => element.getAttribute("aria-pressed")));

        expect(pressed.length).toBeGreaterThan(1);
        expect(pressed, "each says it is not pressed rather than leaving the attribute off").toEqual(
            pressed.map(() => "false"),
        );
        expect(await readout(page)).toContain("pressed: nothing");
    });

    test("a press holds the action down until it is pressed again, and the owner's list follows", async ({ page }) => {
        const first = page.locator(PRESSED_ACTION).first();
        const name = ((await first.textContent()) ?? "").trim();
        const unpressedMark = await markClass(page, 1);

        await first.click();

        await expect(first).toHaveAttribute("aria-pressed", "true");
        await expect(page.locator(PRESSED_ACTION).nth(1), "the others are untouched").toHaveAttribute(
            "aria-pressed",
            "false",
        );
        expect(await readout(page)).toContain(name);
        expect(await markClass(page, 0), "and the painter hears the state").not.toBe(unpressedMark);

        await first.click();

        await expect(first).toHaveAttribute("aria-pressed", "false");
        expect(await readout(page)).toContain("pressed: nothing");
        expect(await markClass(page, 0)).toBe(unpressedMark);
    });

    test("several actions can be down at once", async ({ page }) => {
        const names = (await page.locator(PRESSED_ACTION).allTextContents()).map((text) => text.trim());

        await page.locator(PRESSED_ACTION).nth(0).click();
        await page.locator(PRESSED_ACTION).nth(1).click();

        await expect(page.locator(PRESSED_ACTION).nth(0)).toHaveAttribute("aria-pressed", "true");
        await expect(page.locator(PRESSED_ACTION).nth(1)).toHaveAttribute("aria-pressed", "true");

        const text = await readout(page);

        expect(text).toContain(names[0]);
        expect(text).toContain(names[1]);
    });

    test("the row is one tab stop, the arrows walk it, and Space and Enter toggle", async ({ page }) => {
        await expect(page.locator(`${PRESSED_ACTION}[tabindex="0"]`), "one stop for the whole row").toHaveCount(1);

        const names = (await page.locator(PRESSED_ACTION).allTextContents()).map((text) => text.trim());

        await page.locator(PRESSED_ACTION).first().focus();
        await page.keyboard.press("ArrowRight");
        expect(await focusedText(page)).toBe(names[1]);

        await page.keyboard.press(" ");
        await expect(page.locator(PRESSED_ACTION).nth(1), "Space presses it").toHaveAttribute("aria-pressed", "true");

        await page.keyboard.press("Enter");
        await expect(page.locator(PRESSED_ACTION).nth(1), "and Enter lets it up").toHaveAttribute(
            "aria-pressed",
            "false",
        );
        expect(await focusedText(page), "without the focus moving").toBe(names[1]);
    });

    test("a collapsed action is a checkbox in the menu, checked from the same list", async ({ page }) => {
        const name = ((await page.locator(PRESSED_ACTION).first().textContent()) ?? "").trim();

        await page.locator(PRESSED_ACTION).first().click();
        await setBarWidth(page, TIGHT_PX);

        const collapsed = await readCollapsed(page);

        expect(collapsed, "at the tightest width the pressed action has left the row").toContain(name);

        await page.locator(SHOWN_BUTTON).last().click();

        const items = page.locator(CHECKBOX_ITEM);

        await expect(items.first()).toBeVisible();

        const names = await items.evaluateAll((elements) =>
            elements.map((element) => {
                const clone = element.cloneNode(true) as HTMLElement;

                for (const hidden of clone.querySelectorAll("[aria-hidden]")) hidden.remove();

                return (clone.textContent ?? "").trim();
            }),
        );

        expect(names, "every collapsed action is a checkbox item, named without the check mark").toEqual(collapsed);
        await expect(items.filter({ hasText: name }), "the pressed one arrives checked").toHaveAttribute(
            "aria-checked",
            "true",
        );

        const other = collapsed.find((text) => text !== name)!;

        await expect(items.filter({ hasText: other })).toHaveAttribute("aria-checked", "false");

        await items.filter({ hasText: other }).click();
        expect(await readout(page), "checking it in the menu presses it in the owner's list").toContain(other);

        await page.keyboard.press("Escape");
        await setBarWidth(page, WIDE_PX);

        await expect(
            page.locator(PRESSED_ACTION).filter({ hasText: other }),
            "and it comes back to the row pressed",
        ).toHaveAttribute("aria-pressed", "true");
        await expect(page.locator(PRESSED_ACTION).filter({ hasText: name })).toHaveAttribute("aria-pressed", "true");
    });
});
