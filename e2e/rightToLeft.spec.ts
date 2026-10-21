import { type Locator, type Page, expect, test } from "@playwright/test";

import { activeDescendantText, activeText, demo, prop, readout, revealProp } from "./helpers";

/**
 * Every demo here is an existing example with a `<div dir="rtl">` around it, keyed `rightToLeft` on its own
 * page, except where a page needs more than one: the menu page also has `contextRightToLeft` and
 * `rightToLeftPlaced`, and the tabs page `switchedDirection`, whose box only turns right-to-left once its
 * settings say so. That is the whole of the setup on purpose: the component is told nothing, and has to find
 * out the direction for itself from the box it sits in. So each test below is really asking one question —
 * did the component read its surroundings — and answers it through the keys a person presses.
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

    /**
     * The direction is read from the box rather than fixed when the tabs first appear, so switching the box
     * while they are on screen turns the arrows round with it. The same row is walked before and after the
     * switch, and the second walk also steps over the disabled tab, as the fixed right-to-left row does.
     */
    test("switching the box to right-to-left while the tabs are on screen turns the arrows round", async ({ page }) => {
        const SWITCHED = demo("switchedDirection");

        expect(
            (await box(page.locator(named(SWITCHED, "Source")))).centerX,
            "left to right, the second tab is drawn to the right of the first",
        ).toBeGreaterThan((await box(page.locator(named(SWITCHED, "Render")))).centerX);

        await page.locator(`${tab(SWITCHED)}[tabindex="0"]`).focus();
        await page.keyboard.press("ArrowRight");
        expect(await activeText(page), "ArrowRight walks forward").toBe("Source");

        await revealProp(page, "isRightToLeft", "switchedDirection");
        await page.locator(`${prop("isRightToLeft")} input`).check();
        await page.keyboard.press("Escape");

        await expect
            .poll(async () => (await box(page.locator(named(SWITCHED, "Source")))).centerX, {
                message: "once switched, the second tab is drawn to the left of the first",
            })
            .toBeLessThan((await box(page.locator(named(SWITCHED, "Render")))).centerX);

        await page.locator(`${tab(SWITCHED)}[tabindex="0"]`).focus();
        expect(await activeText(page)).toBe("Source");

        await page.keyboard.press("ArrowLeft");
        expect(await activeText(page), "and ArrowLeft now walks forward, over the disabled tab").toBe("Export");

        await page.keyboard.press("ArrowRight");
        expect(await activeText(page), "while ArrowRight walks back").toBe("Source");
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

test.describe("RangeCalendar", () => {
    const cell = (scope: string) => `${scope} [role="gridcell"]`;
    const day = (scope: string, label: string) => `${cell(scope)}[aria-label="${label}"]`;

    test.beforeEach(async ({ page }) => {
        await page.goto("/range-calendar");
        await expect(page.locator(cell(RTL)).first()).toBeVisible();
    });

    /**
     * The same week as the single-date calendar's, read the same way, and then used for the one thing a range
     * adds: the second press, made at the day the left arrow reached, closes the span on the day after.
     */
    test("the left arrow moves to the next day, and the span it closes runs forward", async ({ page }) => {
        expect(
            (await box(page.locator(day(RTL, "13 August 2026")))).centerX,
            "the day after is drawn to the left of the day before",
        ).toBeLessThan((await box(page.locator(day(RTL, "12 August 2026")))).centerX);

        await page.locator(day(RTL, "12 August 2026")).click();
        await page.keyboard.press("ArrowLeft");
        expect(await activeLabel(page), "ArrowLeft is the day after").toBe("13 August 2026");

        await page.keyboard.press("Enter");
        expect(await readout(page, "rightToLeft"), "and pressing it there ends the span a day on").toContain(
            "2026-08-12 to 2026-08-13",
        );
    });
});

test.describe("Clock", () => {
    const column = (scope: string) => `${scope} [role="listbox"]`;

    const activeColumn = (page: Page) =>
        page.evaluate((selector) => {
            const columns = [...document.querySelectorAll(selector)];

            return columns.findIndex((element) => element.contains(document.activeElement));
        }, column(RTL));

    test.beforeEach(async ({ page }) => {
        await page.goto("/clock");
        await expect(page.locator(column(RTL)).first()).toBeVisible();
    });

    /**
     * The columns are a row like any other, so under right-to-left the first of them — the hour — sits on the
     * right, and the left arrow is the one that moves on to the next. Up and down stay inside a column.
     */
    test("the hour column sits on the right, and the left arrow moves on to the minutes", async ({ page }) => {
        expect(
            (await box(page.locator(column(RTL)).nth(0))).centerX,
            "the hours are drawn to the right of the minutes",
        ).toBeGreaterThan((await box(page.locator(column(RTL)).nth(1))).centerX);

        await page.locator(`${RTL} [tabindex="0"]`).first().focus();
        expect(await activeColumn(page), "focus starts in the hours").toBe(0);

        await page.keyboard.press("ArrowLeft");
        expect(await activeColumn(page), "ArrowLeft moves on to the minutes").toBe(1);

        await page.keyboard.press("ArrowRight");
        expect(await activeColumn(page), "and ArrowRight back to the hours").toBe(0);
    });
});

test.describe("TagInput", () => {
    const field = (scope: string) => `${scope} input[type="text"]`;
    const tag = (scope: string) => `${scope} [role="group"] button`;

    test.beforeEach(async ({ page }) => {
        await page.goto("/tag-input");
        await expect(page.locator(field(RTL))).toBeVisible();
    });

    /**
     * The tags run from the right and the field follows the last of them, so the field is on the far left and
     * the tags lie to its right. The arrow that leaves the field for the tags is therefore the right one, which
     * is the left one in the plain demo.
     */
    test("the right arrow leaves the empty field for the last tag, and the left arrow returns", async ({ page }) => {
        const first = page.locator(tag(RTL)).nth(0);
        const last = page.locator(tag(RTL)).nth(1);

        expect((await box(last)).centerX, "the second tag is drawn to the left of the first").toBeLessThan(
            (await box(first)).centerX,
        );
        expect((await box(page.locator(field(RTL)))).centerX, "and the field to the left of both").toBeLessThan(
            (await box(last)).centerX,
        );

        await page.locator(field(RTL)).press("ArrowRight");
        await expect(last, "ArrowRight from the empty field enters the tags at the last one").toBeFocused();

        await page.keyboard.press("ArrowRight");
        await expect(first, "and walks on towards the first").toBeFocused();

        await page.keyboard.press("ArrowLeft");
        await page.keyboard.press("ArrowLeft");
        await expect(page.locator(field(RTL)), "ArrowLeft walks back out to the field").toBeFocused();
    });
});

test.describe("Range", () => {
    const thumbs = (scope: string) => `${scope} input[type="range"]`;

    const valueOf = async (locator: Locator) => Number(await locator.inputValue());

    /** As in `range.spec.ts`: the nearer thumb is raised on the move, so the mouse moves before it presses. */
    const dragFrom = async (page: Page, locator: Locator, from: number, to: number) => {
        const track = await box(locator);
        const y = track.y + track.height * 0.5;

        await page.mouse.move(track.x + track.width * from, y);
        await page.mouse.down();
        await page.mouse.move(track.x + track.width * to, y, { steps: 5 });
        await page.mouse.up();
    };

    test.beforeEach(async ({ page }) => {
        await page.goto("/range");
        await expect(page.locator(thumbs(RTL)).first()).toBeVisible();
    });

    /**
     * The track runs from the right, so the lowest price is the thumb near the right end. A drag that starts
     * there has to take that thumb and not the other: which thumb answers is decided by how near the pointer
     * is, and nearness measured on an unmirrored track would hand the right end to the highest price.
     */
    test("a drag near the right end takes the lowest price, and one near the left end the highest", async ({
        page,
    }) => {
        const lowest = page.locator(thumbs(RTL)).nth(0);
        const highest = page.locator(thumbs(RTL)).nth(1);

        const lowestBefore = await valueOf(lowest);
        const highestBefore = await valueOf(highest);

        await dragFrom(page, lowest, 0.95, 0.9);
        expect(await valueOf(lowest), "the lowest price moved").not.toBe(lowestBefore);
        expect(await valueOf(highest), "and the highest did not").toBe(highestBefore);

        const lowestAfter = await valueOf(lowest);

        await dragFrom(page, lowest, 0.05, 0.1);
        expect(await valueOf(highest), "near the left end the highest price moves").not.toBe(highestBefore);
        expect(await valueOf(lowest), "and the lowest stays where the first drag left it").toBe(lowestAfter);
    });
});

test.describe("Table", () => {
    const header = (scope: string) => `${scope} [role="columnheader"]`;
    const headerNamed = (page: Page, name: string) => page.locator(header(RTL)).filter({ hasText: name });
    const widthOf = (locator: Locator) => locator.evaluate((element) => (element as HTMLElement).offsetWidth);

    test.beforeEach(async ({ page }) => {
        await page.goto("/table");
        await expect(page.locator(header(RTL)).first()).toBeVisible();
        await page.locator(header(RTL)).first().scrollIntoViewIfNeeded();
    });

    /**
     * A column's resize edge is the one its neighbors start from, which under right-to-left is its left edge, so
     * Ctrl with the left arrow drags that edge outward and widens the column. The widths are read off the header
     * cell's own layout box, which is the thing a resize changes.
     */
    test("the columns run from the right, and Ctrl with the left arrow widens the focused one", async ({ page }) => {
        const sku = headerNamed(page, "SKU");

        expect(
            (await box(headerNamed(page, "Name"))).centerX,
            "the second column is drawn left of the first",
        ).toBeLessThan((await box(sku)).centerX);

        const declared = await widthOf(sku);

        await sku.click();
        await page.keyboard.press("Control+ArrowLeft");
        expect(await widthOf(sku), "Ctrl+ArrowLeft widens it").toBeGreaterThan(declared);

        await page.keyboard.press("Control+ArrowRight");
        await page.keyboard.press("Control+ArrowRight");
        expect(await widthOf(sku), "and Ctrl+ArrowRight narrows it").toBeLessThan(declared);
    });

    /**
     * The handle sits on the column's left edge. A press that ends without moving steps the width towards the
     * half it landed on, which WCAG 2.5.7 asks for as the single-pointer route, so the outer half widens and the
     * inner half narrows. A drag to the left pulls the edge outward too. The handle moves as the column grows,
     * so it is measured again before every press.
     */
    test("the resize handle sits on the left edge, and widens the column outward", async ({ page }) => {
        const sku = headerNamed(page, "SKU");
        const handle = sku.locator(':scope > [aria-hidden="true"]');

        expect((await box(handle)).centerX, "the handle is on the column's left side").toBeLessThan(
            (await box(sku)).centerX,
        );

        const declared = await widthOf(sku);

        let at = await box(handle);
        await page.mouse.click(at.x + at.width * 0.2, at.centerY);
        expect(await widthOf(sku), "a press on the outer half widens it").toBeGreaterThan(declared);

        at = await box(handle);
        await page.mouse.click(at.x + at.width * 0.8, at.centerY);
        expect(await widthOf(sku), "and one on the inner half narrows it back").toBe(declared);

        at = await box(handle);
        await page.mouse.move(at.centerX, at.centerY);
        await page.mouse.down();
        await page.mouse.move(at.centerX - 30, at.centerY, { steps: 6 });
        await page.mouse.up();
        expect(await widthOf(sku), "a drag to the left widens it as well").toBeGreaterThan(declared);
    });

    test("Shift with the left arrow moves the focused column one place later", async ({ page }) => {
        await expect(page.locator(header(RTL)).nth(0)).toContainText("SKU");

        await page.locator(header(RTL)).nth(0).click();
        await page.keyboard.press("Shift+ArrowLeft");

        await expect(page.locator(header(RTL)).nth(0)).toContainText("Name");
        await expect(page.locator(header(RTL)).nth(1)).toContainText("SKU");
        await expect(page.locator(`${header(RTL)}:focus`), "focus travels with it").toContainText("SKU");

        await page.keyboard.press("Shift+ArrowRight");
        await expect(page.locator(header(RTL)).nth(0), "and Shift+ArrowRight moves it back").toContainText("SKU");
    });

    /**
     * Dragged past the middle of the column to its left, a column lands after it, so the drop marker belongs on
     * that neighbor's far side: the edge between Name and the column beyond it, which is to the left of Name
     * under right-to-left. The marker is the one absolutely placed, pointer-transparent thing the drag adds to a
     * header cell, and only its position is asked about, never its look.
     */
    test("a header dragged past its neighbor's middle drops on the far side of it, marked there", async ({ page }) => {
        const from = await box(headerNamed(page, "SKU"));
        const name = await box(headerNamed(page, "Name"));
        const category = await box(headerNamed(page, "Category"));

        await page.mouse.move(from.centerX, from.centerY);
        await page.mouse.down();
        await page.mouse.move(name.x + name.width * 0.25, name.centerY, { steps: 12 });

        const markers = await page.locator(header(RTL)).evaluateAll((cells) =>
            cells.flatMap((cell) =>
                [...cell.children]
                    .filter((child) => {
                        const style = getComputedStyle(child);

                        return style.position === "absolute" && style.pointerEvents === "none";
                    })
                    .map((child) => {
                        const rect = child.getBoundingClientRect();

                        return rect.left + rect.width * 0.5;
                    }),
            ),
        );

        expect(markers, "one marker is drawn while the header is carried").toHaveLength(1);
        expect(markers[0], "to the left of Name").toBeLessThan(name.centerX);
        expect(markers[0], "and to the right of the column beyond it").toBeGreaterThan(category.centerX);

        await page.mouse.up();

        await expect(page.locator(header(RTL)).nth(0)).toContainText("Name");
        await expect(page.locator(header(RTL)).nth(1)).toContainText("SKU");
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

    /**
     * The menu hangs from its trigger lined up with the edge the text starts from, which is the right one here.
     * Rather than asking for a number, the gap between the two right edges is compared with the gap between the
     * two left edges in the plain submenus demo on the same page: mirrored, they are the same distance.
     */
    test("the menu lines up with its trigger's right edge, as the plain one lines up with its left", async ({
        page,
    }) => {
        await openedWithHighlight(page, "submenus");

        const plainTrigger = await box(page.locator(trigger("submenus")));
        const plainMenu = await box(page.locator(MENU));

        await page.keyboard.press("Escape");
        await expect(page.locator(MENU)).toHaveCount(0);

        await openedWithHighlight(page, "rightToLeft");

        const mirroredTrigger = await box(page.locator(trigger("rightToLeft")));
        const mirroredMenu = await box(page.locator(MENU));

        expect(
            mirroredTrigger.x + mirroredTrigger.width - (mirroredMenu.x + mirroredMenu.width),
            "the right edges sit as far apart as the plain demo's left edges",
        ).toBeCloseTo(plainMenu.x - plainTrigger.x, 0);
    });

    /**
     * A context menu has no trigger to read the direction off, so it reads its region instead, which is the one
     * thing it leaves behind in the right-to-left box. The menu then spreads from the pointer the way the text
     * runs, to the left, and its submenus open on the left, as a triggered menu's do.
     */
    test("a menu opened by a right-click in a right-to-left box spreads left and opens its submenus on the left", async ({
        page,
    }) => {
        const region = await box(page.locator(`${demo("contextRightToLeft")} [tabindex="0"]`));

        await page.mouse.click(region.centerX, region.centerY, { button: "right" });
        await expect(page.locator(MENU)).toHaveAttribute("aria-activedescendant", /.+/);
        await expect(page.locator(MENU)).toBeFocused();
        expect(await highlightAt(page, 0)).toBe("New");

        expect(
            (await box(page.locator(MENU))).centerX,
            "the menu lies to the left of where the pointer was",
        ).toBeLessThan(region.centerX);

        await page.keyboard.press("ArrowRight");
        await expect(page.locator(MENU), "ArrowRight points away from where the submenu would be").toHaveCount(1);

        await page.keyboard.press("ArrowLeft");
        await openedLevel(page, 1);

        expect(
            (await box(page.locator(MENU).nth(1))).centerX,
            "the submenu sits to the left of the item that opened it",
        ).toBeLessThan((await box(itemAt(page, 0, "New"))).x);

        await page.keyboard.press("ArrowRight");
        await expect(page.locator(MENU), "and ArrowRight steps back out").toHaveCount(1);
    });

    /**
     * Only the side a submenu opens on when the menu says nothing follows the direction. A menu that names a side
     * meant that side, so this one, told to open its submenus on the right, does so inside a right-to-left box —
     * and the arrows follow the side rather than the text, so the one that opens a submenu still points at it.
     */
    test("a submenu side the menu names is used as given, and the arrow pointing at it opens it", async ({ page }) => {
        await openedWithHighlight(page, "rightToLeftPlaced");
        expect(await highlightAt(page, 0)).toBe("New");

        await page.keyboard.press("ArrowLeft");
        await expect(page.locator(MENU), "ArrowLeft points away from the submenu").toHaveCount(1);

        await page.keyboard.press("ArrowRight");
        await openedLevel(page, 1);

        const parent = await box(itemAt(page, 0, "New"));

        expect(
            (await box(page.locator(MENU).nth(1))).centerX,
            "the submenu sits to the right of the item that opened it",
        ).toBeGreaterThan(parent.x + parent.width);

        await page.keyboard.press("ArrowLeft");
        await expect(page.locator(MENU), "and ArrowLeft steps back out").toHaveCount(1);
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

    /**
     * The pointer route reaches the same landing places as the keys. Carried past the far side of its neighbor —
     * which is the left side under right-to-left — a card lands after it, and the marker that says where it will
     * land is drawn in the gap beyond that neighbor rather than on its near side.
     */
    test("a card dragged past its neighbor's middle lands after it, and the marker shows where", async ({ page }) => {
        const ember = await box(page.locator(item("Ember Sprite")));
        const gale = await box(page.locator(item("Gale Warden")));
        const tide = await box(page.locator(item("Tide Caller")));

        await page.mouse.move(ember.centerX, ember.centerY);
        await page.mouse.down();
        await page.mouse.move(gale.x + gale.width * 0.25, gale.centerY, { steps: 14 });

        const markers = await page.locator(RTL).evaluate((root) =>
            [...root.querySelectorAll("*")]
                .filter((element) => {
                    const style = getComputedStyle(element);

                    return style.position === "absolute" && style.pointerEvents === "none";
                })
                .map((element) => {
                    const rect = element.getBoundingClientRect();

                    return rect.left + rect.width * 0.5;
                }),
        );

        expect(
            markers.some((center) => center < gale.centerX && center > tide.centerX),
            "a marker is drawn between the neighbor and the card beyond it",
        ).toBe(true);

        await page.mouse.up();

        expect(await readout(page, "rightToLeft"), "and the drop puts the card one place later").toContain(
            "Gale Warden, Ember Sprite, Tide Caller",
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
