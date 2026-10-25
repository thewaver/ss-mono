import { type Page, expect, test } from "@playwright/test";

import { attributesOf, docsDemo, docsSettled, prop, tabIndex } from "./helpers";

/**
 * The calendar's page is its Docs view, one example per feature, each holding its own value and month. None of them
 * shows its value in a readout, so a pick is read back off the grid: the cell the calendar marks `aria-selected` is
 * the value the example's own signal holds, handed back in. The visible month is read off the caption's title button,
 * whose name starts with the month it shows.
 */
const DOCS = "/src/App/Pages/CalendarPage/Docs";

const BASIC = docsDemo(DOCS, "Basic");
const BOUNDED = docsDemo(DOCS, "Bounded");
const DISABLED_DAYS = docsDemo(DOCS, "DisabledDays");
const CALENDARS = docsDemo(DOCS, "Calendars");

/**
 * Days are located by their accessible name rather than by their text, because the painter draws a bare
 * number and the neighboring months' days repeat it — selecting "31" by text finds July's before August's.
 * The name is also the only thing a screen reader gets, so asserting against it checks the contract twice.
 */
const cell = (scope: string) => `${scope} [role="gridcell"]`;
const roving = (scope: string) => `${cell(scope)}[tabindex="0"]`;
const selected = (scope: string) => `${cell(scope)}[aria-selected="true"]`;
const day = (scope: string, label: string) => `${cell(scope)}[aria-label="${label}"]`;

/** A knob is a `Select` beside its example, driven the way a consumer would: open it, then press the option. */
const chooseKnob = async (page: Page, key: string, name: string) => {
    const picker = page.locator(`${prop(key)} [role="combobox"]`);

    await picker.click();
    await page
        .locator(`[id="${await picker.getAttribute("aria-controls")}"]`)
        .getByRole("option", { name, exact: true })
        .click();
};

const activeLabel = (page: Page) => page.evaluate(() => document.activeElement?.getAttribute("aria-label") ?? "");

const shownMonth = (page: Page, key: string) => page.locator(`#${key}MonthTitle`);

test.beforeEach(async ({ page }) => {
    await page.goto("/calendar/docs");
    await expect(page.locator(cell(BASIC)).first()).toBeVisible();
    await docsSettled(page);
});

test("the grid is always six weeks, so paging never changes its height", async ({ page }) => {
    await expect(page.locator(cell(BASIC)), "six weeks of seven days").toHaveCount(42);
    await expect(page.locator(`${BASIC} [role="columnheader"]`), "with a weekday header each").toHaveCount(7);
    await expect(page.locator(`${BASIC} [role="row"]`), "in a header row plus six week rows").toHaveCount(7);

    await page.locator("#basicNextMonth").click();

    await expect(page.locator(cell(BASIC)), "and the next month is the same size").toHaveCount(42);
});

test("each day is named in full, since the painter draws only a number", async ({ page }) => {
    await expect(page.locator(cell(BASIC)).first(), "the cell carries the whole date as its name").toHaveAttribute(
        "aria-label",
        /\d+ \w+ \d{4}/,
    );
    await expect(
        page.locator(`${cell(BASIC)}[aria-current="date"]`),
        "today is marked as the current date",
    ).toHaveAttribute("aria-label", "10 August 2026");
    await expect(page.locator(selected(BASIC)), "and the selection is marked too").toHaveAttribute(
        "aria-label",
        "10 August 2026",
    );
});

test("the grid is one tab stop wherever the roving day is", async ({ page }) => {
    await expect(page.locator(roving(BASIC)), "exactly one cell is tabbable").toHaveCount(1);

    const others = await page.locator(`${cell(BASIC)}[tabindex="-1"]`).count();

    expect(others, "and every other cell is out of the tab order").toBe(41);
    expect(await tabIndex(page.locator(`${cell(BASIC)}[aria-current="date"]`)), "which is today's cell").toBe(0);
});

test("clicking a day hands it to the owner, which hands it back as the selection", async ({ page }) => {
    await page.locator(day(BASIC, "18 August 2026")).click();

    await expect(page.locator(selected(BASIC)), "the example's own value is the day clicked").toHaveAttribute(
        "aria-label",
        "18 August 2026",
    );
    await expect(page.locator(selected(BASIC)), "and only that day").toHaveCount(1);
});

test("the arrow walk crosses the month boundary and takes the grid with it", async ({ page }) => {
    await page.locator(day(BASIC, "31 August 2026")).click();
    await page.locator(roving(BASIC)).focus();

    expect(await activeLabel(page)).toBe("31 August 2026");

    await page.keyboard.press("ArrowRight");

    expect(await activeLabel(page), "one day past the end of the month lands in the next one").toBe("1 September 2026");
    await expect(shownMonth(page, "basic"), "and the visible month follows the walk").toHaveAttribute(
        "aria-label",
        /^September 2026/,
    );

    await page.keyboard.press("ArrowUp");
    expect(await activeLabel(page), "and a week backwards crosses back").toBe("25 August 2026");
});

test("Home and End are the ends of the week, and the page keys are months", async ({ page }) => {
    await page.locator(day(BASIC, "12 August 2026")).click();
    await page.locator(roving(BASIC)).focus();

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
    await page.locator(day(BASIC, "12 August 2026")).click();
    await page.locator(roving(BASIC)).focus();

    await page.keyboard.press("Shift+PageDown");
    expect(await activeLabel(page), "the same day and month, a year on").toBe("12 August 2027");
    await expect(shownMonth(page, "basic"), "and the visible month follows it").toHaveAttribute(
        "aria-label",
        /^August 2027/,
    );

    await page.keyboard.press("Shift+PageUp");
    expect(await activeLabel(page)).toBe("12 August 2026");

    await page.keyboard.press("Shift+PageUp");
    expect(await activeLabel(page), "and it steps back across the year boundary too").toBe("12 August 2025");
});

test("Enter picks the day the keyboard is on", async ({ page }) => {
    await page.locator(roving(BASIC)).focus();
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("Enter");

    await expect(page.locator(selected(BASIC))).toHaveAttribute("aria-label", "11 August 2026");
});

test("the week start rotates the header row", async ({ page }) => {
    await chooseKnob(page, "weekStartsOn", "Sunday");

    await expect(page.locator(`${BASIC} [role="columnheader"]`).first(), "Sunday now heads the week").toHaveAttribute(
        "aria-label",
        "Sun",
    );
    await expect(page.locator(cell(BASIC)), "and the grid is still six weeks").toHaveCount(42);
});

test("a bounded calendar refuses the days outside its range without a native attribute", async ({ page }) => {
    await expect(page.locator(`${BOUNDED} [disabled]`), "nothing uses the native disabled attribute").toHaveCount(0);
    await expect(
        page.locator(`${cell(BOUNDED)}[aria-disabled="true"]`),
        "every day outside min..max is marked unavailable",
    ).toHaveCount(26);

    await page.locator(day(BOUNDED, "1 August 2026")).dispatchEvent("click");

    await expect(page.locator(selected(BOUNDED)), "and clicking one picks nothing").toHaveCount(0);
});

/**
 * The grid is always six weeks of seven days, so whichever month is showing and whichever day starts the week,
 * exactly twelve of the forty-two cells are a Saturday or a Sunday.
 */
test("a consumer's own rule can refuse days the range allows", async ({ page }) => {
    await expect(
        page.locator(`${cell(DISABLED_DAYS)}[aria-disabled="true"]`),
        "twelve weekend days in a six-week grid",
    ).toHaveCount(12);

    await page.locator("#disabledDaysNextMonth").click();

    await expect(
        page.locator(`${cell(DISABLED_DAYS)}[aria-disabled="true"]`),
        "and the next month's weekends are refused the same way",
    ).toHaveCount(12);
});

/**
 * Every cell is an `InteractionWrapper`, so a div sits between the row and the cell. It is marked
 * presentational, which is what keeps the row owning its cells in the accessibility tree rather than
 * owning a generic container that happens to hold them.
 */
test("the wrapper between a row and its cells is transparent", async ({ page }) => {
    const structure = await page
        .locator(cell(BASIC))
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

    await page.locator("#basicNextMonth").click();

    await expect(page.locator(ANNOUNCER), "paging says where it landed").toContainText("September 2026");

    await page.locator("#basicPreviousMonth").click();
    await page.locator("#basicPreviousMonth").click();

    await expect(
        page.locator(ANNOUNCER),
        "and each page is its own message rather than one that is edited",
    ).toContainText("July 2026");
});

test("moving within a month announces nothing, so only paging talks", async ({ page }) => {
    await page.locator(day(BASIC, "10 August 2026")).click();
    await page.keyboard.press("ArrowRight");

    await expect(
        page.locator(`${ANNOUNCER} > *`),
        "a walk inside the visible month is not a page, and says nothing",
    ).toHaveCount(0);
});

/**
 * The calendar system is a property of the value rather than a way of drawing it, so switching it does not
 * re-label the same grid — it re-expresses the same instant in another system. The example converts its month to
 * the chosen system and starts on one other than the Gregorian. Days are still located by accessible name, which is
 * why these tests assert on the name rather than on the number a painter drew.
 */
test.describe("another calendar system", () => {
    test("re-expresses the same instant without changing the grid's shape", async ({ page }) => {
        await expect(page.locator(cell(CALENDARS)), "six weeks of seven days").toHaveCount(42);
        await expect(
            page.locator(day(CALENDARS, "10 August 2026")),
            "and no day is named the way the Gregorian calendar names it",
        ).toHaveCount(0);

        await chooseKnob(page, "calendar", "gregory");

        await expect(page.locator(cell(CALENDARS)), "still six weeks of seven days").toHaveCount(42);
        await expect(
            page.locator(day(CALENDARS, "10 August 2026")),
            "and back in the Gregorian calendar the day has its Gregorian name",
        ).toHaveCount(1);
    });

    test("keeps the picked day the same day in any of them", async ({ page }) => {
        const otherName = await page.locator(selected(CALENDARS)).getAttribute("aria-label");

        await expect(
            page.locator(`${cell(CALENDARS)}[aria-current="date"]`),
            "the example starts on today, picked",
        ).toHaveAttribute("aria-label", otherName!);

        await chooseKnob(page, "calendar", "gregory");

        await expect(
            page.locator(selected(CALENDARS)),
            "the pick is still today, named in the Gregorian calendar",
        ).toHaveAttribute("aria-label", "10 August 2026");
    });

    test("offers a thirteenth month where the calendar has one", async ({ page }) => {
        await chooseKnob(page, "calendar", "ethiopic");

        await page.locator("#calendarsMonthTitle").click();

        const monthPicker = page.locator(`${CALENDARS} [role="combobox"]`);

        await monthPicker.click();

        await expect(
            page.locator(`[id="${await monthPicker.getAttribute("aria-controls")}"] [role="option"]`),
            "an Ethiopian year is twelve months of thirty days plus a short thirteenth",
        ).toHaveCount(13);
    });
});

/**
 * `precision` changes what a cell is — a month or a year rather than a day — while keeping the grid, the
 * roving tab stop and the carry across a page's edge. Cells are still located by accessible name, which at
 * these precisions is the month and year or the bare year, because that is what a screen reader reads out.
 * No column headers are expected: a weekday heading means nothing over a grid of months.
 */
const MONTH_PICKER = docsDemo(DOCS, "MonthPicker");
const YEAR_PICKER = docsDemo(DOCS, "YearPicker");

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

    test("a pick marks the month selected", async ({ page }) => {
        await expect(page.locator(selected(MONTH_PICKER)), "nothing is picked to begin with").toHaveCount(0);

        await page.locator(day(MONTH_PICKER, "March 2026")).click();

        await expect(page.locator(selected(MONTH_PICKER))).toHaveAttribute("aria-label", "March 2026");
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

        await expect(page.locator(selected(MONTH_PICKER))).toHaveAttribute("aria-label", "July 2026");
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

    test("a refused year picks nothing, and an allowed one is selected", async ({ page }) => {
        await page.locator(day(YEAR_PICKER, "2017")).dispatchEvent("click");
        await expect(page.locator(selected(YEAR_PICKER)), "a year before the minimum is refused").toHaveCount(0);

        await page.locator(day(YEAR_PICKER, "2020")).click();
        await expect(page.locator(selected(YEAR_PICKER)), "an allowed one reaches the owner").toHaveAttribute(
            "aria-label",
            "2020",
        );
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
        await expect(page.locator(selected(YEAR_PICKER))).toHaveAttribute("aria-label", "2031");
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

/**
 * Week numbers are a column of row headings rather than an eighth day, so a screen reader moving along a row hears
 * which week it is in. What the number is depends on two things the consumer sets — which day starts a week and how
 * many days of the new year the first week must hold — and the second decides which week of a year is week one.
 * January 2027 is where the two common rules part: it begins on a Friday, so the row holding the first has three days
 * of the new year, which is week one under the United States' count and the last week of 2026 under ISO's.
 */
const WEEK_NUMBERS = docsDemo(DOCS, "WeekNumbers");

const weekNumbersOf = async (page: Page) =>
    (await attributesOf(page, `${WEEK_NUMBERS} [role="rowheader"]`, "aria-label")).map((label) =>
        Number(label?.match(/\d+/)?.[0]),
    );

test("every week carries a row heading with its number, and the weeks of a month count up by one", async ({ page }) => {
    await expect(
        page.locator(`${WEEK_NUMBERS} [role="columnheader"]`).first(),
        "the column has a named heading",
    ).toHaveAttribute("aria-label", /.+/);

    const numbers = await weekNumbersOf(page);

    expect(numbers.length, "one heading per row of days").toBe(
        await page.locator(`${WEEK_NUMBERS} [role="row"]:has([role="gridcell"])`).count(),
    );
    expect(
        numbers.slice(1).map((number, index) => number - numbers[index]),
        "and within one year each row is the week after the one above it",
    ).toEqual(numbers.slice(1).map(() => 1));
});

test("how many days the first week must hold decides which week is week one", async ({ page }) => {
    for (let month = 0; month < 5; month++) await page.locator("#weekNumbersNextMonth").click();

    await chooseKnob(page, "minDaysInFirstWeek", "4 days");
    await expect.poll(async () => (await weekNumbersOf(page))[0], { message: "ISO's count" }).not.toBe(1);

    await chooseKnob(page, "minDaysInFirstWeek", "1 day");
    await expect
        .poll(async () => (await weekNumbersOf(page))[0], {
            message: "with one day enough, the row holding 1 January is week one",
        })
        .toBe(1);
});
