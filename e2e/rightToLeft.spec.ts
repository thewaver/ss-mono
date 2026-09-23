import { type Locator, type Page, expect, test } from "@playwright/test";

import { activeDescendantText, activeText, demo, readout } from "./helpers";

/**
 * Every demo here is an existing example with a `<div dir="rtl">` around it, keyed `rightToLeft` on its own
 * page. That is the whole of the setup on purpose: the component is told nothing, and has to find out the
 * direction for itself from the box it sits in. So each test below is really asking one question — did the
 * component read its surroundings — and answers it through the keys a person presses.
 *
 * Where a test says which way something is drawn, it compares two boxes with each other rather than either
 * with a number. Both are measured the same way, so the `Viewport` scale divides out, and "the next tab sits
 * to the left of this one" holds at any window size and any restyle.
 */
const RTL = demo("rightToLeft");

const box = async (locator: Locator) => {
    const measured = await locator.boundingBox();

    if (!measured) throw new Error("the element has no box to measure");

    return { ...measured, centerX: measured.x + measured.width * 0.5, centerY: measured.y + measured.height * 0.5 };
};

const activeLabel = (page: Page) => page.evaluate(() => document.activeElement?.getAttribute("aria-label") ?? "");

test.describe("Tabs", () => {
    const ROW = demo("row");
    const tab = (scope: string) => `${scope} [role="tab"]`;
    const named = (scope: string, name: string) => `${tab(scope)}:has-text("${name}")`;

    test.beforeEach(async ({ page }) => {
        await page.goto("/tabs");
        await expect(page.locator(tab(RTL)).first()).toBeVisible();
    });

    /**
     * The row runs from the right, so the tab after the selected one is drawn to its left, and the left arrow
     * is the one that points at it. Home and End name the first and last tab, not a side of the screen, so they
     * are the same keys either way. The walk still skips the disabled tab, which proves the flip happened in the
     * walker rather than by swapping two handlers.
     */
    test("the left arrow moves to the next tab and the right arrow to the previous one", async ({ page }) => {
        expect(
            (await box(page.locator(named(RTL, "Source")))).centerX,
            "the second tab is drawn to the left of the first, which is what makes the flip the right one",
        ).toBeLessThan((await box(page.locator(named(RTL, "Render")))).centerX);

        await page.locator(`${tab(RTL)}[tabindex="0"]`).focus();
        expect(await activeText(page), "focus starts on the selected tab").toBe("Render");

        await page.keyboard.press("ArrowLeft");
        expect(await activeText(page), "ArrowLeft walks forward, toward where the next tab is drawn").toBe("Source");

        await page.keyboard.press("ArrowLeft");
        expect(await activeText(page), "and still steps over the disabled tab").toBe("Export");

        await page.keyboard.press("ArrowRight");
        expect(await activeText(page), "ArrowRight walks back").toBe("Source");

        await page.keyboard.press("ArrowRight");
        expect(await activeText(page)).toBe("Render");

        await page.keyboard.press("End");
        expect(await activeText(page), "End is still the last tab").toBe("Export");

        await page.keyboard.press("Home");
        expect(await activeText(page), "and Home the first").toBe("Render");
    });

    /**
     * Every reader on the page shares one observer, which is the place a direction could leak: if the answer
     * were cached per page rather than read per element, walking the right-to-left list first would leave the
     * plain row answering the flipped keys. So the right-to-left list is used first, and the row beside it is
     * asked afterwards whether its right arrow still points forward.
     */
    test("a left-to-right list on the same page keeps its own direction", async ({ page }) => {
        await page.locator(`${tab(RTL)}[tabindex="0"]`).focus();
        await page.keyboard.press("ArrowLeft");
        expect(await activeText(page), "the right-to-left list has been walked").toBe("Source");

        expect(
            (await box(page.locator(named(ROW, "Source")))).centerX,
            "the plain row is drawn from the left",
        ).toBeGreaterThan((await box(page.locator(named(ROW, "Render")))).centerX);

        await page.locator(`${tab(ROW)}[tabindex="0"]`).focus();
        expect(await activeText(page)).toBe("Render");

        await page.keyboard.press("ArrowRight");
        expect(await activeText(page), "and its right arrow still walks forward").toBe("Source");

        await page.keyboard.press("ArrowLeft");
        expect(await activeText(page), "and its left arrow back").toBe("Render");
    });
});

test.describe("Calendar", () => {
    const cell = (scope: string) => `${scope} [role="gridcell"]`;
    const roving = (scope: string) => `${cell(scope)}[tabindex="0"]`;
    const day = (scope: string, label: string) => `${cell(scope)}[aria-label="${label}"]`;

    test.beforeEach(async ({ page }) => {
        await page.goto("/calendar");
        await expect(page.locator(cell(RTL)).first()).toBeVisible();
    });

    /**
     * A week that runs from the right draws tomorrow to the left of today, so ArrowLeft is tomorrow and
     * ArrowRight yesterday. The rows are not mirrored, so ArrowDown is still a week on.
     */
    test("the left arrow moves to the next day, the right arrow to the previous one", async ({ page }) => {
        expect(
            (await box(page.locator(day(RTL, "13 August 2026")))).centerX,
            "the day after is drawn to the left of the day before",
        ).toBeLessThan((await box(page.locator(day(RTL, "12 August 2026")))).centerX);

        await page.locator(day(RTL, "12 August 2026")).click();
        await page.locator(roving(RTL)).focus();
        expect(await activeLabel(page)).toBe("12 August 2026");

        await page.keyboard.press("ArrowRight");
        expect(await activeLabel(page), "ArrowRight is the day before").toBe("11 August 2026");

        await page.keyboard.press("ArrowLeft");
        await page.keyboard.press("ArrowLeft");
        expect(await activeLabel(page), "and ArrowLeft the day after").toBe("13 August 2026");

        await page.keyboard.press("ArrowDown");
        expect(await activeLabel(page), "ArrowDown is still a week on").toBe("20 August 2026");

        await page.keyboard.press("ArrowUp");
        expect(await activeLabel(page), "and ArrowUp a week back").toBe("13 August 2026");
    });

    /**
     * The carry is the part worth checking on its own. The day after the last day of a week is the first day of
     * the next row, and under right-to-left that row starts on the far right, so the walk has to jump from the
     * left edge of one row to the right edge of the next. A walker that flipped the column but not the carry
     * would stop at the edge or land a row off.
     */
    test("the walk still carries across the end of a row", async ({ page }) => {
        const lastOfWeek = "16 August 2026";
        const firstOfNext = "17 August 2026";

        const last = await box(page.locator(day(RTL, lastOfWeek)));
        const first = await box(page.locator(day(RTL, firstOfNext)));

        expect(first.centerY, "the two days sit on different rows").toBeGreaterThan(last.centerY);
        expect(first.centerX, "and the next week starts at the opposite edge").toBeGreaterThan(last.centerX);

        await page.locator(day(RTL, lastOfWeek)).click();
        await page.locator(roving(RTL)).focus();

        await page.keyboard.press("ArrowLeft");
        expect(await activeLabel(page), "ArrowLeft off the end of a week lands on the next week's first day").toBe(
            firstOfNext,
        );

        await page.keyboard.press("ArrowRight");
        expect(await activeLabel(page), "and ArrowRight carries back up").toBe(lastOfWeek);
    });
});

test.describe("SplitPane", () => {
    const root = (scope: string) => `${scope} [role="group"]`;
    const gutter = (scope: string) => `${scope} [role="separator"]`;

    const panes = (page: Page, scope: string) =>
        page.locator(root(scope)).evaluate((element) =>
            Array.from(element.children)
                .filter((child) => child.tagName === "DIV")
                .map((child) => (child as HTMLElement).offsetWidth),
        );

    const boundary = async (page: Page) => Number(await page.locator(gutter(RTL)).getAttribute("aria-valuenow"));

    test.beforeEach(async ({ page }) => {
        await page.goto("/split-pane");
        await expect(page.locator(gutter(RTL))).toBeVisible();
    });

    /**
     * The first pane sits on the right, so moving the divider to the left makes it larger. That is what
     * ArrowLeft has to do: the key names the direction the divider travels on screen, whichever pane that
     * happens to grow.
     */
    test("the first pane sits on the right, and ArrowLeft grows it", async ({ page }) => {
        const first = page.locator(`${root(RTL)} > div`).first();
        const second = page.locator(`${root(RTL)} > div`).last();

        expect((await box(first)).centerX, "the first pane is drawn on the right").toBeGreaterThan(
            (await box(second)).centerX,
        );

        const startBoundary = await boundary(page);
        const [startFirst] = await panes(page, RTL);

        await page.locator(gutter(RTL)).focus();
        await page.keyboard.press("ArrowLeft");

        await expect
            .poll(() => boundary(page), "ArrowLeft moves the boundary in the first pane's favor")
            .toBeGreaterThan(startBoundary);
        expect((await panes(page, RTL))[0], "and the first pane is wider for it").toBeGreaterThan(startFirst);

        await page.keyboard.press("ArrowRight");
        await page.keyboard.press("ArrowRight");

        await expect.poll(() => boundary(page), "ArrowRight gives the space back and more").toBeLessThan(startBoundary);
        expect((await panes(page, RTL))[0]).toBeLessThan(startFirst);
    });

    /**
     * A drag is measured from the start edge, which here is the right one. Measured from the left instead, the
     * divider would run away from the pointer: dragging left would shrink the pane on the right. So the pointer
     * goes left, and the divider has to follow it and the right-hand pane has to grow.
     */
    const DRAG_PX = 60;

    test("a drag moves the divider the way the pointer went", async ({ page }) => {
        const handle = page.locator(gutter(RTL));
        const before = await box(handle);
        const [startFirst] = await panes(page, RTL);

        await page.mouse.move(before.centerX, before.centerY);
        await page.mouse.down();
        await page.mouse.move(before.centerX - DRAG_PX, before.centerY, { steps: 10 });
        await page.mouse.up();

        expect((await box(handle)).centerX, "the divider moved left, with the pointer").toBeLessThan(before.centerX);
        expect(
            (await panes(page, RTL))[0],
            "which grows the first pane, since it is the one on the right",
        ).toBeGreaterThan(startFirst);
    });
});

test.describe("RadioGroup", () => {
    const option = (scope: string, label: string) => `${scope} input[aria-label="${label}"]`;

    test.beforeEach(async ({ page }) => {
        await page.goto("/radio");
        await expect(page.locator(option(RTL, "Small"))).toBeVisible();
    });

    /**
     * A radio group answers both pairs of arrows, and only one pair has a side to it. Under right-to-left the
     * horizontal pair trades places, since the next radio is drawn to the left; the vertical pair keeps its
     * meaning, since the group is not turned upside down. Pressing all four in one walk is what separates a
     * flip of the horizontal pair from a flip of everything.
     */
    test("the horizontal arrows flip and the vertical ones do not", async ({ page }) => {
        expect(
            (await box(page.locator(option(RTL, "Medium")))).centerX,
            "the second radio is drawn to the left of the first",
        ).toBeLessThan((await box(page.locator(option(RTL, "Small")))).centerX);

        await page.locator(option(RTL, "Small")).focus();

        await page.keyboard.press("ArrowLeft");
        expect(await readout(page, "rightToLeft"), "ArrowLeft moves to the next radio").toContain("value: medium");
        await expect(page.locator(option(RTL, "Medium")), "and focus goes with it").toBeFocused();

        await page.keyboard.press("ArrowRight");
        expect(await readout(page, "rightToLeft"), "ArrowRight to the previous one").toContain("value: small");

        await page.keyboard.press("ArrowDown");
        expect(await readout(page, "rightToLeft"), "ArrowDown still moves forward").toContain("value: medium");

        await page.keyboard.press("ArrowUp");
        expect(await readout(page, "rightToLeft"), "and ArrowUp back").toContain("value: small");
    });
});

test.describe("Menu", () => {
    const MENU = '[role="menu"]';
    const ITEM_ROLE = '[role="menuitem"]';

    const trigger = (key: string) => `${demo(key)} [aria-haspopup="menu"]`;

    /** Opening lands the highlight and the focus in either order, so both are waited on, as `menu.spec.ts` does. */
    const openedWithHighlight = async (page: Page, key: string) => {
        await page.locator(trigger(key)).click();
        await expect(page.locator(MENU)).toHaveAttribute("aria-activedescendant", /.+/);
        await expect(page.locator(MENU)).toBeFocused();
    };

    const openedLevel = async (page: Page, depth: number) => {
        await expect(page.locator(MENU)).toHaveCount(depth + 1);
        await expect(page.locator(MENU).nth(depth)).toHaveAttribute("aria-activedescendant", /.+/);
        await expect(page.locator(MENU).nth(depth)).toBeFocused();
    };

    const highlightAt = async (page: Page, depth: number) =>
        activeDescendantText(page, `#${await page.locator(MENU).nth(depth).getAttribute("id")}`);

    const itemAt = (page: Page, depth: number, name: string) =>
        page.locator(MENU).nth(depth).locator(ITEM_ROLE).filter({ hasText: name }).first();

    test.beforeEach(async ({ page }) => {
        await page.goto("/menu");
        await expect(page.locator(trigger("rightToLeft"))).toBeVisible();
    });

    /**
     * The popup is moved out to the end of the document, where nothing is right-to-left, so the menu has to
     * read its direction off the trigger that stayed behind. If it read the popup instead it would answer
     * left-to-right, open the submenu on the right and wait for ArrowRight — which is exactly what the plain
     * submenus demo does, and is checked at the end as the other half of the comparison.
     */
    test("a submenu opens on the left, and ArrowLeft is the key that opens it", async ({ page }) => {
        await openedWithHighlight(page, "rightToLeft");
        expect(await highlightAt(page, 0)).toBe("New");

        await page.keyboard.press("ArrowRight");
        await expect(page.locator(MENU), "ArrowRight points away from where the submenu would be").toHaveCount(1);

        await page.keyboard.press("ArrowLeft");
        await openedLevel(page, 1);
        expect(await highlightAt(page, 1), "ArrowLeft steps in").toBe("Project");

        expect(
            (await box(page.locator(MENU).nth(1))).centerX,
            "and the submenu sits to the left of the item that opened it",
        ).toBeLessThan((await box(itemAt(page, 0, "New"))).x);

        await page.keyboard.press("ArrowRight");
        await expect(page.locator(MENU), "ArrowRight steps back out one level").toHaveCount(1);
        expect(await highlightAt(page, 0)).toBe("New");

        await page.keyboard.press("Escape");
        await expect(page.locator(MENU)).toHaveCount(0);

        await openedWithHighlight(page, "submenus");
        await page.keyboard.press("ArrowRight");
        await openedLevel(page, 1);

        const parent = await box(itemAt(page, 0, "New"));

        expect(
            (await box(page.locator(MENU).nth(1))).centerX,
            "while the plain demo on the same page still opens to the right",
        ).toBeGreaterThan(parent.x + parent.width);
    });
});

test.describe("Sortable", () => {
    const item = (label: string) => `${RTL} [role="listitem"][aria-label="${label}"]`;

    test.beforeEach(async ({ page }) => {
        await page.goto("/sortable");
        await expect(page.locator(item("Ember Sprite"))).toBeVisible();
    });

    /**
     * The carry chooses forward or back from the logical key, so the arrow that points at the next place on
     * screen is the one that moves the item later in the list. The readout is the list's own order, which is
     * the thing a reorder changes; the boxes are only there to show which way "later" is drawn.
     */
    test("a carried item moves later with the left arrow and earlier with the right", async ({ page }) => {
        expect(
            (await box(page.locator(item("Gale Warden")))).centerX,
            "the second card is drawn to the left of the first",
        ).toBeLessThan((await box(page.locator(item("Ember Sprite")))).centerX);

        await page.locator(item("Ember Sprite")).focus();
        await page.keyboard.press("ArrowLeft");
        await expect(page.locator(item("Gale Warden")), "with nothing carried, ArrowLeft walks forward").toBeFocused();

        await page.locator(item("Ember Sprite")).focus();
        await page.keyboard.press("Enter");
        await page.keyboard.press("ArrowLeft");
        await page.keyboard.press("Enter");

        expect(await readout(page, "rightToLeft"), "and a carried card goes one place later").toContain(
            "Gale Warden, Ember Sprite, Tide Caller",
        );

        await page.locator(item("Tide Caller")).focus();
        await page.keyboard.press("Enter");
        await page.keyboard.press("ArrowRight");
        await page.keyboard.press("Enter");

        expect(await readout(page, "rightToLeft"), "while ArrowRight carries one place earlier").toContain(
            "Gale Warden, Tide Caller, Ember Sprite",
        );
    });
});

test.describe("Tree", () => {
    const node = (scope: string) => `${scope} [role="treeitem"]`;

    test.beforeEach(async ({ page }) => {
        await page.goto("/tree");
        await expect(page.locator(node(RTL)).first()).toBeVisible();
    });

    /**
     * A tree under right-to-left is indented from the right, so going deeper means going left, and the left
     * arrow is the one that goes into a branch. The four steps are the whole of the horizontal pair — open,
     * enter, climb, close — so a tree that flipped only some of them fails here.
     */
    test("the left arrow opens a branch and the right arrow closes it", async ({ page }) => {
        const branch = page.locator(node(RTL)).first();

        await expect(branch, "the demo starts with every branch closed").toHaveAttribute("aria-expanded", "false");

        await branch.focus();

        await page.keyboard.press("ArrowRight");
        await expect(branch, "ArrowRight on a closed branch opens nothing").toHaveAttribute("aria-expanded", "false");

        await page.keyboard.press("ArrowLeft");
        await expect(branch, "ArrowLeft opens it").toHaveAttribute("aria-expanded", "true");
        expect(await activeText(page), "without moving").toContain("src");

        await page.keyboard.press("ArrowLeft");
        expect(await activeText(page), "a second ArrowLeft moves to the first child").toContain("index.ts");

        await page.keyboard.press("ArrowRight");
        expect(await activeText(page), "ArrowRight on a leaf climbs to the parent").toContain("src");

        await page.keyboard.press("ArrowRight");
        await expect(branch, "and on an open branch closes it").toHaveAttribute("aria-expanded", "false");
    });
});
