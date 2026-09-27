import { type Page, expect, test } from "@playwright/test";

/**
 * The React `Menu` and `ContextMenu`, over the React `Popover`, `InteractionWrapper` and `PlacementBox`. The cases
 * follow `e2e/menu.spec.ts`, `e2e/menuStateful.spec.ts` and the `Menu` case of `e2e/rightToLeft.spec.ts`, which
 * cover the Solid one, so the two frameworks are held to the same behavior: a real button trigger, a menu that takes
 * focus and points at its highlight, the walk, submenus a level per popup, typeahead, the open state a consumer can
 * own, a right-click menu opened at a point, the hover guard, stateful rows and a cascader.
 */
const MENU = '[role="menu"]';
const ITEM_ROLE = '[role="menuitem"]';
const ITEM = `${MENU} ${ITEM_ROLE}`;
const TRIGGER = "#trigger";
const ROW = '[role="menu"] [role^="menuitem"]';

const readout = (page: Page) => page.locator('[data-readout="last"]').textContent();

const activeMatches = (page: Page, selector: string) =>
    page.evaluate((value) => document.activeElement?.matches(value) ?? false, selector);

const textOf = (page: Page, id: string | null) =>
    page.evaluate((value) => {
        const element = value ? document.getElementById(value) : null;

        if (!element) return null;

        const clone = element.cloneNode(true) as HTMLElement;

        for (const hidden of clone.querySelectorAll('[aria-hidden="true"]')) hidden.remove();

        return (clone.textContent ?? "").trim();
    }, id);

const highlightAt = async (page: Page, depth: number) =>
    textOf(page, await page.locator(MENU).nth(depth).getAttribute("aria-activedescendant"));

const itemAt = (page: Page, depth: number, name: string) =>
    page.locator(MENU).nth(depth).locator(ITEM_ROLE).filter({ hasText: name }).first();

/**
 * Opening is not instant, and the two things that have to land do so in either order: the menu points at a
 * highlighted item, and the menu takes focus. A key pressed before the focus half goes to the trigger and is lost,
 * so every keyboard case waits on both.
 */
const openedWithHighlight = async (page: Page, trigger = TRIGGER) => {
    await page.locator(trigger).click();
    await openedLevel(page, 0);
};

const openedLevel = async (page: Page, depth: number) => {
    await expect(page.locator(MENU)).toHaveCount(depth + 1);
    await expect(page.locator(MENU).nth(depth)).toHaveAttribute("aria-activedescendant", /.+/);
    await expect(page.locator(MENU).nth(depth)).toBeFocused();
};

test("the trigger is a real button that starts closed", async ({ page, mount }) => {
    const component = await mount("Essentials/Menu/Default");

    expect(await component.locator(TRIGGER).evaluate((element) => element.tagName)).toBe("BUTTON");
    await expect(component.locator(TRIGGER)).toHaveAttribute("aria-haspopup", "menu");
    await expect(component.locator(TRIGGER), "and starts closed").toHaveAttribute("aria-expanded", "false");
    await expect(page.locator(MENU), "with no menu in the tree at all").toHaveCount(0);
});

test("opening wires the menu to its trigger and takes focus itself", async ({ page, mount }) => {
    await mount("Essentials/Menu/Default");
    await openedWithHighlight(page);

    await expect(page.locator(TRIGGER)).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator(ITEM), "one menuitem per record").toHaveCount(5);
    expect(await page.locator(TRIGGER).getAttribute("aria-controls"), "the trigger points at the menu").toBe(
        await page.locator(MENU).getAttribute("id"),
    );
    expect(await page.locator(MENU).getAttribute("aria-labelledby"), "and the menu is named by the trigger").toBe(
        "trigger",
    );
    await expect(page.locator(`${ITEM}[tabindex="0"]`), "no item is a tab stop").toHaveCount(0);
    expect(await highlightAt(page, 0), "the highlight starts on the first item").toBe("CutCtrl+X");
});

test("the arrows and edge keys move the highlight", async ({ page, mount }) => {
    await mount("Essentials/Menu/Default");
    await openedWithHighlight(page);

    await page.keyboard.press("ArrowDown");
    expect(await highlightAt(page, 0)).toBe("CopyCtrl+C");

    await page.keyboard.press("End");
    expect(await highlightAt(page, 0)).toBe("DeleteDel");

    await page.keyboard.press("Home");
    expect(await highlightAt(page, 0)).toBe("CutCtrl+X");
});

test("Escape closes and hands focus back, and ArrowUp reopens onto the last item", async ({ page, mount }) => {
    await mount("Essentials/Menu/Default");
    await openedWithHighlight(page);

    await page.keyboard.press("Escape");
    await expect(page.locator(MENU), "Escape closes the menu").toHaveCount(0);
    expect(await activeMatches(page, TRIGGER), "and hands focus back to the trigger").toBe(true);

    await page.keyboard.press("ArrowUp");
    await openedLevel(page, 0);
    expect(await highlightAt(page, 0), "ArrowUp on a closed trigger opens onto the last item").toBe("DeleteDel");

    await page.keyboard.press("Enter");
    await expect(page.locator(MENU), "a menu closes on activation").toHaveCount(0);
    expect(await readout(page), "Enter activates the highlighted item").toContain("Delete");
    expect(await activeMatches(page, TRIGGER), "returning focus to the trigger").toBe(true);
});

test("clicking an item activates it and keeps focus in the menu long enough to resolve", async ({ page, mount }) => {
    await mount("Essentials/Menu/Default");
    await page.locator(TRIGGER).click();
    await page.locator(ITEM, { hasText: "Paste" }).first().click();

    await expect(page.locator(MENU)).toHaveCount(0);
    expect(await readout(page)).toContain("Paste");
    expect(await activeMatches(page, TRIGGER), "focus went back to the trigger rather than to nothing").toBe(true);
});

test("the trigger toggles closed on a second click", async ({ page, mount }) => {
    await mount("Essentials/Menu/Default");

    await page.locator(TRIGGER).click();
    await expect(page.locator(MENU)).toHaveCount(1);

    await page.locator(TRIGGER).click();
    await expect(page.locator(MENU), "clicking it again closes rather than reopening").toHaveCount(0);
});

test("the walk steps over disabled items and stops on a reachable one", async ({ page, mount }) => {
    await mount("Essentials/Menu/DisabledItems");
    await openedWithHighlight(page);
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowDown");
    expect(await highlightAt(page, 0), "the walk steps over disabled items").toBe("DeleteDel");

    await mount("Essentials/Menu/ReachableItems");
    await openedWithHighlight(page);
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowDown");
    expect(await highlightAt(page, 0), "and stops on one kept reachable").toBe("PasteCtrl+V");

    await page.keyboard.press("Enter");
    expect(await readout(page), "Enter on a reachable disabled item runs nothing").toContain("nothing run yet");
    await expect(page.locator(MENU), "and leaves the menu open").toHaveCount(1);
});

test("an item that owns a submenu says so, and the submenu is named by it", async ({ page, mount }) => {
    await mount("Essentials/Menu/Submenus");
    await openedWithHighlight(page);

    const parent = itemAt(page, 0, "New");

    await expect(parent).toHaveAttribute("aria-haspopup", "menu");
    await expect(parent).toHaveAttribute("aria-expanded", "false");
    expect(await itemAt(page, 0, "Open").getAttribute("aria-haspopup"), "a leaf claims nothing").toBe(null);

    await page.keyboard.press("ArrowRight");
    await openedLevel(page, 1);

    await expect(parent, "opening it flips the item").toHaveAttribute("aria-expanded", "true");
    expect(await parent.getAttribute("aria-controls")).toBe(await page.locator(MENU).nth(1).getAttribute("id"));
    expect(await page.locator(MENU).nth(1).getAttribute("aria-labelledby"), "named by that item").toBe(
        await parent.getAttribute("id"),
    );
});

test("the arrows step into a submenu and back out of it", async ({ page, mount }) => {
    await mount("Essentials/Menu/Submenus");
    await openedWithHighlight(page);
    expect(await highlightAt(page, 0)).toBe("New");

    await page.keyboard.press("ArrowRight");
    await openedLevel(page, 1);
    expect(await highlightAt(page, 1), "a submenu opens onto its own first item").toBe("Project");

    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowRight");
    await openedLevel(page, 2);
    expect(await highlightAt(page, 2)).toBe("Blank");

    await page.keyboard.press("ArrowLeft");
    await expect(page.locator(MENU), "ArrowLeft leaves one level").toHaveCount(2);
    expect(await highlightAt(page, 1), "landing back on the item that opened it").toBe("From template");
    await expect(page.locator(MENU).nth(1), "which has focus back").toBeFocused();

    await page.keyboard.press("ArrowLeft");
    await expect(page.locator(MENU)).toHaveCount(1);
    expect(await highlightAt(page, 0)).toBe("New");

    await page.keyboard.press("Escape");
    await expect(page.locator(MENU), "Escape at the top closes the menu itself").toHaveCount(0);
    expect(await activeMatches(page, TRIGGER)).toBe(true);
});

test("activating a leaf closes every level at once", async ({ page, mount }) => {
    await mount("Essentials/Menu/Submenus");
    await openedWithHighlight(page);

    await page.keyboard.press("ArrowRight");
    await openedLevel(page, 1);
    await page.keyboard.press("Enter");

    await expect(page.locator(MENU)).toHaveCount(0);
    expect(await readout(page), "the value that arrives is the leaf's own").toContain("Project");
    expect(await activeMatches(page, TRIGGER)).toBe(true);
});

test("hovering a level opens the submenu under the pointer and drops the others", async ({ page, mount }) => {
    await mount("Essentials/Menu/Submenus");
    await openedWithHighlight(page);

    await itemAt(page, 0, "Share").hover();
    await openedLevel(page, 1);

    await itemAt(page, 1, "Export").hover();
    await openedLevel(page, 2);

    await itemAt(page, 0, "Open").hover();
    await expect(page.locator(MENU), "hovering a leaf above drops every level below it").toHaveCount(1);

    await itemAt(page, 0, "Open").click();
    expect(await readout(page)).toContain("Open");
});

test("a disabled trigger opens nothing by pointer or by key", async ({ page, mount }) => {
    await mount("Essentials/Menu/DisabledTrigger");

    expect(await page.locator(TRIGGER).evaluate((element) => (element as HTMLElement).tabIndex)).toBe(-1);

    await page.locator(TRIGGER).click({ force: true });
    await expect(page.locator(MENU), "clicking it does not open the menu").toHaveCount(0);
    expect(await activeMatches(page, TRIGGER), "and does not focus it either").toBe(false);

    await mount("Essentials/Menu/DisabledTrigger", { isReachable: true });

    expect(await page.locator(TRIGGER).evaluate((element) => (element as HTMLElement).tabIndex)).toBe(0);

    await page.locator(TRIGGER).focus();
    await page.keyboard.press("Enter");
    await expect(page.locator(MENU), "Enter on a reachable disabled trigger still opens nothing").toHaveCount(0);
});

test.describe("an open state the consumer owns", () => {
    const TOGGLE = "#menuToggle";

    test("a button that is not the trigger opens the menu, and closes it again because it is the anchor", async ({
        page,
        mount,
    }) => {
        await mount("Essentials/Menu/Driven");
        expect(await readout(page)).toContain("the menu is closed");

        await page.locator(TOGGLE).click();
        await expect(page.locator(MENU)).toHaveCount(1);
        expect(await readout(page), "the owner's own variable says so").toContain("the menu is open");

        await page.locator(TOGGLE).click();
        await expect(page.locator(MENU)).toHaveCount(0);
        expect(await readout(page)).toContain("the menu is closed");
    });

    test("the menu writes its own dismissal and a pick back into the consumer's variable", async ({ page, mount }) => {
        await mount("Essentials/Menu/Driven");

        await page.locator(TOGGLE).click();
        await expect(page.locator(MENU)).toBeFocused();
        await page.keyboard.press("Escape");
        await expect(page.locator(MENU)).toHaveCount(0);
        expect(await readout(page), "Escape is visible to the owner").toContain("the menu is closed");

        await page.locator(TOGGLE).click();
        await page.locator(ITEM).filter({ hasText: "Copy" }).first().click();
        await expect(page.locator(MENU)).toHaveCount(0);
        expect(await readout(page)).toContain("Copy");
        expect(await readout(page)).toContain("the menu is closed");
    });

    test("the menu's own trigger writes the same variable", async ({ page, mount }) => {
        await mount("Essentials/Menu/Driven");
        await openedWithHighlight(page);

        expect(await readout(page)).toContain("the menu is open");
    });
});

test.describe("typeahead", () => {
    test("moves the highlight to the next item starting with what was typed", async ({ page, mount }) => {
        await mount("Essentials/Menu/Default");
        await openedWithHighlight(page);

        await page.keyboard.press("p");
        expect(await highlightAt(page, 0)).toContain("Paste");
    });

    test("cycles through the items sharing a letter when the letter is repeated", async ({ page, mount }) => {
        await mount("Essentials/Menu/Default");
        await openedWithHighlight(page);

        await page.keyboard.press("c");
        expect(await highlightAt(page, 0), "Cut is already highlighted, so c moves on to Copy").toContain("Copy");

        await page.keyboard.press("c");
        expect(await highlightAt(page, 0), "and again wraps back").toContain("Cut");
    });

    test("takes a space into the query rather than activating", async ({ page, mount }) => {
        await mount("Essentials/Menu/Default");
        await openedWithHighlight(page);

        await page.keyboard.press("d");
        await page.keyboard.press("Space");

        await expect(page.locator(MENU), "the menu is still open").toHaveCount(1);
        expect(await readout(page), "and nothing reached the owner").toContain("nothing run yet");
    });
});

test.describe("a menu opened by a right-click", () => {
    const REGION = '[data-testid="region"]';
    const CORNER_INSET = 5;
    const MOVE_MARGIN = 20;
    const PLACEMENT_TOLERANCE = 4;

    test("has no trigger anywhere, is a named tab stop, and opens at the pointer", async ({ page, mount }) => {
        await mount("Essentials/Menu/Context");

        await expect(page.locator('[data-testid="context"] button'), "nothing is rendered to press").toHaveCount(0);

        const region = page.locator('[role="group"][aria-haspopup="menu"]');

        await expect(region).toHaveAttribute("tabindex", "0");
        await expect(region).toHaveAttribute("aria-label", "Editing area");
        await expect(region).toHaveAttribute("aria-expanded", "false");

        const box = (await page.locator(REGION).boundingBox())!;
        const x = box.x + box.width * 0.4;
        const y = box.y + box.height * 0.4;

        await page.mouse.click(x, y, { button: "right" });

        await expect(page.locator(MENU)).toHaveCount(1);
        await expect(page.locator(MENU), "named by its own label").toHaveAttribute("aria-label", "Edit actions");
        await expect(region).toHaveAttribute("aria-expanded", "true");

        await expect
            .poll(async () => {
                const menuBox = (await page.locator(MENU).boundingBox())!;

                return Math.max(Math.abs(menuBox.x - x), Math.abs(menuBox.y - y));
            }, "the menu's near corner settles on the pointer")
            .toBeLessThan(PLACEMENT_TOLERANCE);
    });

    test("moves to the next point rather than staying where it was", async ({ page, mount }) => {
        await mount("Essentials/Menu/Context");

        const box = (await page.locator(REGION).boundingBox())!;
        const y = box.y + box.height * 0.4;
        const near = box.x + box.width * 0.2;
        const far = box.x + box.width * 0.6;

        await page.mouse.click(near, y, { button: "right" });
        await expect(page.locator(MENU)).toBeFocused();

        await page.mouse.click(far, y, { button: "right" });

        await expect(page.locator(MENU), "one menu, not two").toHaveCount(1);
        await expect
            .poll(async () => (await page.locator(MENU).boundingBox())!.x, "the second press re-anchors it")
            .toBeGreaterThan(near + MOVE_MARGIN);
    });

    test("runs an item and closes, and a plain click outside dismisses it", async ({ page, mount }) => {
        await mount("Essentials/Menu/Context");

        const box = (await page.locator(REGION).boundingBox())!;

        await page.mouse.click(box.x + box.width * 0.4, box.y + box.height * 0.4, { button: "right" });
        await expect(page.locator(MENU)).toBeFocused();
        await page.locator(ITEM).filter({ hasText: "Copy" }).first().click();

        await expect(page.locator(MENU), "activating closes it").toHaveCount(0);
        expect(await readout(page)).toContain("Copy");

        await page.mouse.click(box.x + box.width * 0.4, box.y + box.height * 0.4, { button: "right" });
        await expect(page.locator(MENU)).toHaveCount(1);

        await page.mouse.click(box.x + CORNER_INSET, box.y + CORNER_INSET);

        await expect(page.locator(MENU), "a left-click in the same box, clear of the menu, is outside it").toHaveCount(
            0,
        );
    });

    test("the keyboard opens it against the region, and a disabled one leaves the browser's own menu alone", async ({
        page,
        mount,
    }) => {
        await mount("Essentials/Menu/Context");

        const region = page.locator('[role="group"][aria-haspopup="menu"]');

        await region.focus();
        await page.keyboard.press("Shift+F10");
        await expect(page.locator(MENU), "Shift+F10 opens it").toBeFocused();

        await page.keyboard.press("Escape");
        await expect(page.locator(MENU)).toHaveCount(0);

        await mount("Essentials/Menu/Context", { isDisabled: true });

        await expect(region).toHaveAttribute("tabindex", "-1");
        await expect(region).toHaveAttribute("aria-disabled", "true");

        const prevented = await region.evaluate((element) => {
            const event = new MouseEvent("contextmenu", { bubbles: true, cancelable: true, clientX: 10, clientY: 10 });

            element.dispatchEvent(event);

            return event.defaultPrevented;
        });

        expect(prevented, "the right-click is left to the browser").toBe(false);
        await expect(page.locator(MENU)).toHaveCount(0);
    });
});

/**
 * A hover the pointer did not cause must not move the highlight. The browser re-runs hit-testing whenever
 * anything changes under a stationary cursor and reports the result as a fresh enter. React builds its enter from
 * the `mouseout` of the element the pointer left, so the invented enter is dispatched as a `mouseout` from the
 * hovered item towards another, carrying the coordinates the pointer last had — exactly the shape the guard
 * recognizes. The same dispatch at a point the pointer never moved to is the control: it does move the highlight,
 * which is what shows the first one reached the menu at all.
 */
const settle = (page: Page) =>
    page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));

test("a hover nothing caused leaves the highlight where it is", async ({ page, mount }) => {
    await mount("Essentials/Menu/Default");
    await openedWithHighlight(page);

    const hovered = itemAt(page, 0, "Copy");
    const other = itemAt(page, 0, "Duplicate");

    await hovered.hover();
    expect(await highlightAt(page, 0), "a real hover takes the highlight").toContain("Copy");

    const box = (await hovered.boundingBox())!;
    const hoveredId = (await hovered.getAttribute("id"))!;
    const leave = (point: { x: number; y: number }) =>
        other.evaluate(
            (target, { fromId, at }) => {
                document.getElementById(fromId)!.dispatchEvent(
                    new MouseEvent("mouseout", {
                        clientX: at.x,
                        clientY: at.y,
                        bubbles: true,
                        cancelable: true,
                        relatedTarget: target,
                    }),
                );
            },
            { fromId: hoveredId, at: point },
        );

    await leave({ x: box.x + box.width * 0.5, y: box.y + box.height * 0.5 });
    await settle(page);

    expect(
        await highlightAt(page, 0),
        "an enter arriving at the point the pointer is already on is the browser re-testing, not a choice",
    ).toContain("Copy");

    await leave({ x: box.x + box.width * 0.5, y: box.y + box.height * 0.5 + box.height * 2 });
    await expect.poll(() => highlightAt(page, 0), "the same enter from somewhere new moves it").toContain("Duplicate");
});

test.describe("stateful rows", () => {
    const ticked = async (page: Page) => (await readout(page))?.split("ticked: ")[1] ?? "";

    const rows = (page: Page) =>
        page.evaluate(
            (selector) =>
                [...document.querySelectorAll(selector)].map((element) => ({
                    role: element.getAttribute("role"),
                    checked: element.getAttribute("aria-checked"),
                    inGroup: element.closest('[role="group"]') !== null,
                })),
            ROW,
        );

    test("a row's role says what kind it is, only a stateful one is checkable, and a radio run is one group", async ({
        page,
        mount,
    }) => {
        await mount("Essentials/Menu/Stateful");
        await page.locator(TRIGGER).click();
        await expect(page.locator(ROW)).toHaveCount(7);

        expect(await rows(page)).toEqual([
            { role: "menuitemcheckbox", checked: "true", inGroup: false },
            { role: "menuitemcheckbox", checked: "false", inGroup: false },
            { role: "menuitemcheckbox", checked: "false", inGroup: false },
            { role: "menuitemradio", checked: "false", inGroup: true },
            { role: "menuitemradio", checked: "true", inGroup: true },
            { role: "menuitemradio", checked: "false", inGroup: true },
            { role: "menuitem", checked: null, inGroup: false },
        ]);
        await expect(page.locator(`${MENU} [role="group"]`), "one group, not one per radio").toHaveCount(1);
    });

    test("a tick toggles and keeps the menu open, and a pick clears its own run and closes", async ({
        page,
        mount,
    }) => {
        await mount("Essentials/Menu/Stateful");
        await page.locator(TRIGGER).click();

        await page.locator('[role="menuitemcheckbox"]', { hasText: "Minimap" }).click();
        await expect(page.locator(MENU), "ticking leaves the menu up").toHaveCount(1);
        expect(await ticked(page)).toContain("Minimap");

        await page.locator('[role="menuitemcheckbox"]', { hasText: "Word wrap" }).click();
        expect(await ticked(page), "ticking again takes it out").not.toContain("Word wrap");

        await page.locator('[role="menuitemradio"]', { hasText: "Small" }).click();
        await expect(page.locator(MENU), "picking one of a set closes it").toHaveCount(0);

        const after = await ticked(page);

        expect(after, "the size picked before is gone").not.toContain("Medium");
        expect(after).toContain("Small");
        expect(after, "and the tick outside the run is untouched").toContain("Minimap");
    });

    test("the keyboard reaches a stateful row the same as any other", async ({ page, mount }) => {
        await mount("Essentials/Menu/Stateful");
        await page.locator(TRIGGER).focus();
        await page.keyboard.press("Enter");
        await openedLevel(page, 0);

        await page.keyboard.press("ArrowDown");
        await page.keyboard.press("Enter");

        expect(await ticked(page)).toContain("Show whitespace");
        await expect(page.locator(MENU), "and ticking from the keyboard leaves it open").toHaveCount(1);
    });
});

test.describe("a cascader built on nested items", () => {
    const pathReadout = async (page: Page) => /path: \[(.*?)\]/.exec((await readout(page)) ?? "")?.[1] ?? null;

    test("a branch opens the next level and writes nothing, and only a leaf is picked", async ({ page, mount }) => {
        await mount("Essentials/Menu/Cascader");
        expect(await pathReadout(page)).toBe("");

        await openedWithHighlight(page);
        expect(await highlightAt(page, 0)).toBe("Europe");

        await page.keyboard.press("Enter");
        await openedLevel(page, 1);
        expect(await pathReadout(page), "Enter on a branch opens it").toBe("");

        await page.keyboard.press("Enter");
        await openedLevel(page, 2);

        await page.keyboard.press("ArrowDown");
        await page.keyboard.press("Enter");

        await expect(page.locator(MENU), "a leaf closes every level").toHaveCount(0);
        expect(await pathReadout(page)).toBe("Europe, France, Lyon");
        expect(await activeMatches(page, TRIGGER)).toBe(true);
    });

    test("the trigger's name carries the path picked so far, reached by pointer", async ({ page, mount }) => {
        await mount("Essentials/Menu/Cascader");

        const before = await page.locator(TRIGGER).getAttribute("aria-label");

        await page.locator(TRIGGER).click();
        await itemAt(page, 0, "Asia").click();
        await openedLevel(page, 1);
        await itemAt(page, 1, "Japan").click();
        await openedLevel(page, 2);
        await itemAt(page, 2, "Kyoto").click();

        await expect(page.locator(MENU)).toHaveCount(0);
        expect(await pathReadout(page)).toBe("Asia, Japan, Kyoto");

        const after = await page.locator(TRIGGER).getAttribute("aria-label");

        expect(after).not.toBe(before);
        expect(after).toMatch(/Asia.*Japan.*Kyoto/);
    });

    test("backing out keeps the path, and a new leaf replaces it", async ({ page, mount }) => {
        await mount("Essentials/Menu/Cascader");

        await openedWithHighlight(page);
        await page.keyboard.press("Enter");
        await openedLevel(page, 1);
        await page.keyboard.press("Enter");
        await openedLevel(page, 2);
        await page.keyboard.press("Enter");
        await expect(page.locator(MENU)).toHaveCount(0);
        expect(await pathReadout(page)).toBe("Europe, France, Paris");

        await openedWithHighlight(page);
        await page.keyboard.press("End");
        await page.keyboard.press("ArrowRight");
        await openedLevel(page, 1);
        await page.keyboard.press("ArrowLeft");
        await expect(page.locator(MENU)).toHaveCount(1);
        await page.keyboard.press("Escape");
        await expect(page.locator(MENU)).toHaveCount(0);
        expect(await pathReadout(page), "leaving without a leaf changes nothing").toBe("Europe, France, Paris");

        await openedWithHighlight(page);
        await page.keyboard.press("End");
        await page.keyboard.press("ArrowRight");
        await openedLevel(page, 1);
        await page.keyboard.press("ArrowRight");
        await openedLevel(page, 2);
        await page.keyboard.press("Enter");

        await expect(page.locator(MENU)).toHaveCount(0);
        expect(await pathReadout(page)).toBe("South America, Peru, Lima");
    });
});

/**
 * The popup is portaled out to the end of the document, where nothing is right-to-left, so the menu has to read its
 * direction off the trigger that stayed behind. The plain menu beside it is the other half of the comparison.
 */
test("in right-to-left text a submenu opens on the left, and ArrowLeft is the key that opens it", async ({
    page,
    mount,
}) => {
    await mount("Essentials/Menu/RightToLeft");
    await openedWithHighlight(page, "#rtlTrigger");
    expect(await highlightAt(page, 0)).toBe("New");

    await page.keyboard.press("ArrowRight");
    await expect(page.locator(MENU), "ArrowRight points away from the submenu").toHaveCount(1);

    await page.keyboard.press("ArrowLeft");
    await openedLevel(page, 1);
    expect(await highlightAt(page, 1)).toBe("Project");

    const rtlParent = (await itemAt(page, 0, "New").boundingBox())!;
    const rtlSubmenu = (await page.locator(MENU).nth(1).boundingBox())!;

    expect(rtlSubmenu.x + rtlSubmenu.width * 0.5, "the submenu sits to the left of its item").toBeLessThan(rtlParent.x);

    await page.keyboard.press("ArrowRight");
    await expect(page.locator(MENU), "ArrowRight steps back out").toHaveCount(1);

    await page.keyboard.press("Escape");
    await expect(page.locator(MENU)).toHaveCount(0);

    await openedWithHighlight(page, "#ltrTrigger");
    await page.keyboard.press("ArrowRight");
    await openedLevel(page, 1);

    const parent = (await itemAt(page, 0, "New").boundingBox())!;
    const submenu = (await page.locator(MENU).nth(1).boundingBox())!;

    expect(submenu.x + submenu.width * 0.5, "while the plain menu still opens to the right").toBeGreaterThan(
        parent.x + parent.width,
    );
});
