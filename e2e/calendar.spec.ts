import { expect, test } from "@playwright/test";

import { demo, prop, readout, tabIndex } from "./helpers";

const DEFAULT = demo("default");
const BOUNDED = demo("bounded");
const WEEKDAYS = demo("weekdays");

/**
 * Days are located by their accessible name rather than by their text, because the painter draws a bare
 * number and the neighboring months' days repeat it — selecting "31" by text finds July's before August's.
 * The name is also the only thing a screen reader gets, so asserting against it checks the contract twice.
 */
const cell = (scope: string) => `${scope} [role="gridcell"]`;
const roving = (scope: string) => `${cell(scope)}[tabindex="0"]`;
const day = (scope: string, label: string) => `${cell(scope)}[aria-label="${label}"]`;

/**
 * The week start and the calendar system are props-panel knobs rather than buttons inside one variant, so
 * they govern all three calendars at once. A knob is driven through its own `Select` the way a consumer would.
 */
const option = '[role="listbox"] [role="option"]';

const chooseProp = async (page: import("@playwright/test").Page, key: string, text: string) => {
    await page.locator(`${prop(key)} [role="combobox"]`).click();
    await page.locator(option, { hasText: text }).first().click();
};

const activeLabel = (page: import("@playwright/test").Page) =>
    page.evaluate(() => document.activeElement?.getAttribute("aria-label") ?? "");

test.beforeEach(async ({ page }) => {
    await page.goto("/calendar");
    await expect(page.locator(cell(DEFAULT)).first()).toBeVisible();
});

test("the grid is always six weeks, so paging never changes its height", async ({ page }) => {
    await expect(page.locator(cell(DEFAULT)), "six weeks of seven days").toHaveCount(42);
    await expect(page.locator(`${DEFAULT} [role="columnheader"]`), "with a weekday header each").toHaveCount(7);
    await expect(page.locator(`${DEFAULT} [role="row"]`), "in a header row plus six week rows").toHaveCount(7);

    await page.locator("#defaultNextMonth").click();

    await expect(page.locator(cell(DEFAULT)), "and the next month is the same size").toHaveCount(42);
});

test("each day is named in full, since the painter draws only a number", async ({ page }) => {
    await expect(page.locator(cell(DEFAULT)).first(), "the cell carries the whole date as its name").toHaveAttribute(
        "aria-label",
        /\d+ \w+ \d{4}/,
    );
    await expect(
        page.locator(`${cell(DEFAULT)}[aria-current="date"]`),
        "today is marked as the current date",
    ).toHaveAttribute("aria-label", "10 August 2026");
    await expect(
        page.locator(`${cell(DEFAULT)}[aria-selected="true"]`),
        "and the selection is marked too",
    ).toHaveAttribute("aria-label", "10 August 2026");
});

test("the grid is one tab stop wherever the roving day is", async ({ page }) => {
    await expect(page.locator(roving(DEFAULT)), "exactly one cell is tabbable").toHaveCount(1);

    const others = await page.locator(`${cell(DEFAULT)}[tabindex="-1"]`).count();

    expect(others, "and every other cell is out of the tab order").toBe(41);
    expect(await tabIndex(page.locator(`${cell(DEFAULT)}[aria-current="date"]`)), "which is today's cell").toBe(0);
});

test("clicking a day reports it to the owner as a date, not an index", async ({ page }) => {
    await page.locator(day(DEFAULT, "18 August 2026")).click();

    expect(await readout(page, "default"), "the owner's signal holds the date itself").toContain("value: 2026-08-18");
});

test("the arrow walk crosses the month boundary and takes the grid with it", async ({ page }) => {
    await page.locator(day(DEFAULT, "31 August 2026")).click();
    await page.locator(roving(DEFAULT)).focus();

    expect(await activeLabel(page)).toBe("31 August 2026");

    await page.keyboard.press("ArrowRight");

    expect(await activeLabel(page), "one day past the end of the month lands in the next one").toBe("1 September 2026");
    expect(await readout(page, "default"), "and the visible month follows the walk").toContain("month: 2026-09-01");

    await page.keyboard.press("ArrowUp");
    expect(await activeLabel(page), "and a week backwards crosses back").toBe("25 August 2026");
});

test("Home and End are the ends of the week, and the page keys are months", async ({ page }) => {
    await page.locator(day(DEFAULT, "12 August 2026")).click();
    await page.locator(roving(DEFAULT)).focus();

    await page.keyboard.press("Home");
    expect(await activeLabel(page), "Home is the start of the week, not of the month").toBe("10 August 2026");

    await page.keyboard.press("End");
    expect(await activeLabel(page), "and End is the end of the same week").toBe("16 August 2026");

    await page.keyboard.press("PageDown");
    expect(await activeLabel(page), "PageDown is a month rather than six weeks").toBe("16 September 2026");

    await page.keyboard.press("PageUp");
    expect(await activeLabel(page)).toBe("16 August 2026");
});

/**
 * The year step is the one part of this keyboard a consumer cannot add from outside: the grid owns its own
 * `keydown`, so a caption button can jump a year but a key cannot be bound to it. Held Shift is what the
 * published pattern asks for, and it lands on the same day of the same month a year away.
 */
test("Shift with the page keys is a year rather than a month", async ({ page }) => {
    await page.locator(day(DEFAULT, "12 August 2026")).click();
    await page.locator(roving(DEFAULT)).focus();

    await page.keyboard.press("Shift+PageDown");
    expect(await activeLabel(page), "the same day and month, a year on").toBe("12 August 2027");
    expect(await readout(page, "default"), "and the visible month follows it").toContain("month: 2027-08-01");

    await page.keyboard.press("Shift+PageUp");
    expect(await activeLabel(page)).toBe("12 August 2026");

    await page.keyboard.press("Shift+PageUp");
    expect(await activeLabel(page), "and it steps back across the year boundary too").toBe("12 August 2025");
});

test("Enter picks the day the keyboard is on", async ({ page }) => {
    await page.locator(roving(DEFAULT)).focus();
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("Enter");

    expect(await readout(page, "default")).toContain("value: 2026-08-11");
});

test("a bounded calendar refuses the days outside its range without a native attribute", async ({ page }) => {
    await expect(page.locator("[disabled]"), "nothing uses the native disabled attribute").toHaveCount(0);
    await expect(
        page.locator(`${cell(BOUNDED)}[aria-disabled="true"]`),
        "every day outside min..max is marked unavailable",
    ).toHaveCount(26);

    await page.locator(day(BOUNDED, "1 August 2026")).dispatchEvent("click");

    expect(await readout(page, "bounded"), "and clicking one picks nothing").toContain("value: none");
});

test("a consumer's own predicate can refuse days the range allows", async ({ page }) => {
    await expect(
        page.locator(`${cell(WEEKDAYS)}[aria-disabled="true"]`),
        "twelve weekend days in a six-week grid",
    ).toHaveCount(12);

    await chooseProp(page, "weekStartsOn", "Sunday");

    await expect(
        page.locator(`${WEEKDAYS} [role="columnheader"]`).first(),
        "flipping the week start rotates the header row",
    ).toHaveAttribute("aria-label", "Sun");
    await expect(
        page.locator(`${cell(WEEKDAYS)}[aria-disabled="true"]`),
        "and the weekend is still the weekend",
    ).toHaveCount(12);
});

/**
 * Every cell is an `InteractionWrapper`, so a div sits between the row and the cell. It is marked
 * presentational, which is what keeps the row owning its cells in the accessibility tree rather than
 * owning a generic container that happens to hold them.
 */
test("the wrapper between a row and its cells is transparent", async ({ page }) => {
    const structure = await page
        .locator(cell(DEFAULT))
        .first()
        .evaluate((element) => ({
            wrapper: element.parentElement?.getAttribute("role"),
            row: element.parentElement?.parentElement?.getAttribute("role"),
        }));

    expect(structure.wrapper, "the wrapper declares itself presentational").toBe("presentation");
    expect(structure.row, "so the row above it still owns the cells").toBe("row");
});

/**
 * Paging swaps all 42 cells and changes nothing else, so a screen reader user hears nothing until they move
 * the focus. The fix is a live region that belongs to no component — the month title on the page is the
 * consumer's own markup, so the announcement cannot be read off it — which means the assertion has to look
 * outside the calendar entirely, at the announcer's region on the body.
 *
 * The region is reserved on mount rather than created by the first message, because a region that appears
 * already carrying text can be read as silence — the reader never saw it empty. So the calendar starts with
 * one region holding nothing, and what is asserted is that paging puts a message into it.
 */
const ANNOUNCER = 'body > [role="log"][aria-live="polite"]';

test("paging announces the month it landed on, through a region no component owns", async ({ page }) => {
    await expect(page.locator(`${ANNOUNCER} > *`), "the region is reserved and empty, not absent").toHaveCount(0);

    await page.locator("#defaultNextMonth").click();

    await expect(page.locator(ANNOUNCER), "paging says where it landed").toContainText("September 2026");

    await page.locator("#defaultPreviousMonth").click();
    await page.locator("#defaultPreviousMonth").click();

    await expect(
        page.locator(ANNOUNCER),
        "and each page is its own message rather than one that is edited",
    ).toContainText("July 2026");
});

test("moving within a month announces nothing, so only paging talks", async ({ page }) => {
    await page.locator(day(DEFAULT, "10 August 2026")).click();
    await page.keyboard.press("ArrowRight");

    await expect(
        page.locator(`${ANNOUNCER} > *`),
        "a walk inside the visible month is not a page, and says nothing",
    ).toHaveCount(0);
});

/**
 * The calendar system is a property of the value rather than a way of drawing it, so switching it does not
 * re-label the same grid — it re-expresses the same instant in another system, and every displayed calendar
 * has to follow because the knob is a panel knob. Days are still located by accessible name, which is why
 * these tests assert on the name rather than on the number a painter drew.
 */
test.describe("another calendar system", () => {
    test("re-expresses the same instant without changing the grid's shape", async ({ page }) => {
        await expect(page.locator(day(DEFAULT, "10 August 2026"))).toHaveCount(1);

        await chooseProp(page, "calendarId", "hebrew");

        await expect(page.locator(cell(DEFAULT)), "still six weeks of seven days").toHaveCount(42);
        await expect(
            page.locator(day(DEFAULT, "10 August 2026")),
            "and no day is named the way the Gregorian calendar named it",
        ).toHaveCount(0);
    });

    test("reaches every calendar on the page, not just the first", async ({ page }) => {
        await chooseProp(page, "calendarId", "hebrew");

        for (const scope of [DEFAULT, BOUNDED, WEEKDAYS]) {
            await expect(page.locator(cell(scope)), "each variant is drawn in the chosen system").toHaveCount(42);
            await expect(page.locator(day(scope, "10 August 2026"))).toHaveCount(0);
        }
    });

    test("offers a thirteenth month where the calendar has one", async ({ page }) => {
        await chooseProp(page, "calendarId", "ethiopic");

        await page.locator("#defaultMonthTitle").click();
        await page.locator(`${DEFAULT} [role="combobox"]`).click();

        await expect(
            page.locator(option),
            "an Ethiopian year is twelve months of thirty days plus a short thirteenth",
        ).toHaveCount(13);
    });

    test("keeps a bounded calendar's refusals on the same real days", async ({ page }) => {
        await chooseProp(page, "calendarId", "hebrew");

        await expect(
            page.locator(`${cell(BOUNDED)}[aria-disabled="true"]`),
            "the bounds are dates, so re-expressing them refuses exactly the same days",
        ).toHaveCount(26);
    });
});

/**
 * `precision` changes what a cell is — a month or a year rather than a day — while keeping the grid, the
 * roving tab stop and the carry across a page's edge. Cells are still located by accessible name, which at
 * these precisions is the month and year or the bare year, because that is what a screen reader reads out.
 * No column headers are expected: a weekday heading means nothing over a grid of months.
 */
const MONTH_PICKER = demo("monthPicker");
const YEAR_PICKER = demo("yearPicker");

test.describe("a month picker", () => {
    test("holds the year's twelve months, each named with its year, and today's month is the tab stop", async ({
        page,
    }) => {
        await expect(page.locator(cell(MONTH_PICKER)), "one cell per month").toHaveCount(12);
        await expect(page.locator(`${MONTH_PICKER} [role="columnheader"]`), "and no weekday headings").toHaveCount(0);
        await expect(page.locator(cell(MONTH_PICKER)).first()).toHaveAttribute("aria-label", "January 2026");
        await expect(
            page.locator(`${cell(MONTH_PICKER)}[aria-current="date"]`),
            "the month holding today is the current one",
        ).toHaveAttribute("aria-label", "August 2026");
        await expect(page.locator(roving(MONTH_PICKER)), "and it is the grid's one tab stop").toHaveAttribute(
            "aria-label",
            "August 2026",
        );
    });

    test("a pick sets the first of the month and marks the cell selected", async ({ page }) => {
        await page.locator(day(MONTH_PICKER, "March 2026")).click();

        expect(await readout(page, "monthPicker"), "the owner receives a date on the first").toContain(
            "value: 2026-03-01",
        );
        await expect(page.locator(`${cell(MONTH_PICKER)}[aria-selected="true"]`)).toHaveAttribute(
            "aria-label",
            "March 2026",
        );
    });

    test("the arrows walk months by row and column and carry into the next year", async ({ page }) => {
        await page.locator(roving(MONTH_PICKER)).focus();

        await page.keyboard.press("ArrowRight");
        expect(await activeLabel(page), "a column is one month").toBe("September 2026");

        await page.keyboard.press("ArrowDown");
        expect(await activeLabel(page), "a row is as many months as there are columns").toBe("December 2026");

        await page.keyboard.press("ArrowRight");
        expect(await activeLabel(page), "and a step off the last month carries into the next year").toBe(
            "January 2027",
        );
        await expect(page.locator(cell(MONTH_PICKER)).first(), "taking the page with it").toHaveAttribute(
            "aria-label",
            "January 2027",
        );
    });

    test("the page keys step a year, and Shift steps twelve", async ({ page }) => {
        await page.locator(roving(MONTH_PICKER)).focus();

        await page.keyboard.press("PageDown");
        expect(await activeLabel(page), "the same month a year on").toBe("August 2027");

        await page.keyboard.press("PageUp");
        expect(await activeLabel(page)).toBe("August 2026");

        await page.keyboard.press("Shift+PageDown");
        expect(await activeLabel(page), "Shift is twelve pages above day precision, not one year").toBe("August 2038");
    });

    test("Enter picks the month the keyboard is on", async ({ page }) => {
        await page.locator(roving(MONTH_PICKER)).focus();
        await page.keyboard.press("ArrowLeft");
        await page.keyboard.press("Enter");

        expect(await readout(page, "monthPicker")).toContain("value: 2026-07-01");
    });

    test("the header pages a year at a time, and the page is announced", async ({ page }) => {
        await page.locator("#monthPickerNextPage").click();

        await expect(page.locator(cell(MONTH_PICKER)).first(), "the next page is the next year").toHaveAttribute(
            "aria-label",
            "January 2027",
        );
        await expect(page.locator(ANNOUNCER), "and the region says which year it landed on").toContainText("2027");

        await page.locator("#monthPickerPreviousPage").click();
        await page.locator("#monthPickerPreviousPage").click();

        await expect(page.locator(cell(MONTH_PICKER)).first()).toHaveAttribute("aria-label", "January 2025");
    });
});

test.describe("a year picker", () => {
    test("pages in twelves from year 1 of the era, and refuses the years outside its bounds", async ({ page }) => {
        await expect(page.locator(cell(YEAR_PICKER)), "twelve years to a page").toHaveCount(12);
        await expect(
            page.locator(cell(YEAR_PICKER)).first(),
            "the page holding today starts where the twelves from year 1 put it, not at today",
        ).toHaveAttribute("aria-label", "2017");
        await expect(page.locator(`${cell(YEAR_PICKER)}[aria-current="date"]`)).toHaveAttribute("aria-label", "2026");
        await expect(
            page.locator(`${cell(YEAR_PICKER)}[aria-disabled="true"]`),
            "the two years before the minimum are unavailable",
        ).toHaveCount(2);
        await expect(page.locator(day(YEAR_PICKER, "2019")), "and the minimum itself is not").not.toHaveAttribute(
            "aria-disabled",
        );
    });

    test("a pick sets the first day of the year, and a refused year picks nothing", async ({ page }) => {
        await page.locator(day(YEAR_PICKER, "2017")).dispatchEvent("click");
        expect(await readout(page, "yearPicker"), "a year before the minimum is refused").toContain("value: none");

        await page.locator(day(YEAR_PICKER, "2020")).click();
        expect(await readout(page, "yearPicker"), "an allowed one reaches the owner as 1 January").toContain(
            "value: 2020-01-01",
        );
        await expect(page.locator(`${cell(YEAR_PICKER)}[aria-selected="true"]`)).toHaveAttribute("aria-label", "2020");
    });

    test("the arrows carry past the page's last year into the next twelve", async ({ page }) => {
        await page.locator(roving(YEAR_PICKER)).focus();

        await page.keyboard.press("ArrowUp");
        expect(await activeLabel(page), "a row up is one row of years back").toBe("2023");

        await page.keyboard.press("ArrowDown");
        await page.keyboard.press("ArrowRight");
        await page.keyboard.press("ArrowRight");
        await page.keyboard.press("ArrowRight");

        expect(await activeLabel(page), "a step off the last cell lands on the next year").toBe("2029");
        await expect(page.locator(cell(YEAR_PICKER)).first(), "on the next page of twelve").toHaveAttribute(
            "aria-label",
            "2029",
        );
    });

    test("the keyboard stops at the bounds rather than landing on a refused year", async ({ page }) => {
        await page.locator(roving(YEAR_PICKER)).focus();

        await page.keyboard.press("PageUp");
        expect(await activeLabel(page), "a page back from today clamps to the minimum").toBe("2019");

        await page.keyboard.press("ArrowUp");
        expect(await activeLabel(page), "and a row back from the minimum stays on it").toBe("2019");

        await page.keyboard.press("Shift+PageDown");
        expect(await activeLabel(page), "a long step forward clamps to the maximum").toBe("2031");

        await page.keyboard.press("Enter");
        expect(await readout(page, "yearPicker")).toContain("value: 2031-01-01");
    });

    test("the header pages twelve years at a time and announces the span", async ({ page }) => {
        await page.locator("#yearPickerNextPage").click();

        await expect(page.locator(cell(YEAR_PICKER)).first()).toHaveAttribute("aria-label", "2029");
        await expect(
            page.locator(`${cell(YEAR_PICKER)}[aria-disabled="true"]`),
            "every year after the maximum is refused",
        ).toHaveCount(9);
        await expect(page.locator(ANNOUNCER), "and the region names the page as a span of years").toContainText(
            /2029\D+2040/,
        );
    });
});
