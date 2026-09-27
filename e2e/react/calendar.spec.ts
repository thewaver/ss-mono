import { type Page, expect, test } from "@playwright/test";

import { tabIndex } from "../helpers";

/**
 * The React `Calendar`, over the React `InteractionWrapper` and the shared `CalendarUtils`. The cases follow
 * `e2e/calendar.spec.ts` and the calendar half of `e2e/rightToLeft.spec.ts`, which cover the Solid one: the fixed
 * six-week grid, the full name on every cell, one tab stop, the keyboard walk across months and years, bounds and a
 * consumer's own refusals, the transparent wrapper, the paging announcement, other calendar systems, the month and
 * year precisions, and the walk flipping in a right-to-left box.
 *
 * Days are located by their accessible name rather than by their text, for the reason the Solid spec gives: the
 * painter draws a bare number and the neighboring months' days repeat it. The Playground's week-start and calendar
 * knobs become mount props here, and its interactive caption is replaced by two paging buttons.
 */
const cell = '[role="gridcell"]';
const roving = `${cell}[tabindex="0"]`;
const day = (label: string) => `${cell}[aria-label="${label}"]`;

const ANNOUNCER = 'body > [role="log"][aria-live="polite"]';

const readout = (page: Page, key: string) => page.locator(`[data-readout="${key}"]`);

const activeLabel = (page: Page) => page.evaluate(() => document.activeElement?.getAttribute("aria-label") ?? "");

const box = async (page: Page, selector: string) => {
    const measured = await page.locator(selector).boundingBox();

    if (!measured) throw new Error("the element has no box to measure");

    return { centerX: measured.x + measured.width * 0.5, centerY: measured.y + measured.height * 0.5 };
};

test("the grid is always six weeks, so paging never changes its height", async ({ page, mount }) => {
    await mount("Essentials/Calendar/Default");

    await expect(page.locator(cell), "six weeks of seven days").toHaveCount(42);
    await expect(page.locator('[role="columnheader"]'), "with a weekday header each").toHaveCount(7);
    await expect(page.locator('[role="row"]'), "in a header row plus six week rows").toHaveCount(7);

    await page.locator("#defaultNextMonth").click();

    await expect(page.locator(cell), "and the next month is the same size").toHaveCount(42);
});

test("each day is named in full, and today and the selection are marked", async ({ page, mount }) => {
    await mount("Essentials/Calendar/Default");

    await expect(page.locator(cell).first()).toHaveAttribute("aria-label", /\d+ \w+ \d{4}/);
    await expect(page.locator(`${cell}[aria-current="date"]`)).toHaveAttribute("aria-label", "10 August 2026");
    await expect(page.locator(`${cell}[aria-selected="true"]`)).toHaveAttribute("aria-label", "10 August 2026");
});

test("the grid is one tab stop wherever the roving day is", async ({ page, mount }) => {
    await mount("Essentials/Calendar/Default");

    await expect(page.locator(roving), "exactly one cell is tabbable").toHaveCount(1);
    await expect(page.locator(`${cell}[tabindex="-1"]`), "and every other cell is out of the tab order").toHaveCount(
        41,
    );
    expect(await tabIndex(page.locator(`${cell}[aria-current="date"]`)), "which is today's cell").toBe(0);
});

test("clicking a day reports it to the owner as a date, not an index", async ({ page, mount }) => {
    await mount("Essentials/Calendar/Default");

    await page.locator(day("18 August 2026")).click();

    await expect(readout(page, "value")).toHaveText("2026-08-18");
});

test("the arrow walk crosses the month boundary and takes the grid with it", async ({ page, mount }) => {
    await mount("Essentials/Calendar/Default");

    await page.locator(day("31 August 2026")).click();
    await page.locator(roving).focus();

    expect(await activeLabel(page)).toBe("31 August 2026");

    await page.keyboard.press("ArrowRight");

    await expect
        .poll(() => activeLabel(page), { message: "one day past the end lands in the next month" })
        .toBe("1 September 2026");
    await expect(readout(page, "month"), "and the visible month follows the walk").toHaveText("2026-09-01");

    await page.keyboard.press("ArrowUp");
    await expect.poll(() => activeLabel(page), { message: "and a week backwards crosses back" }).toBe("25 August 2026");
});

test("Home and End are the ends of the week, and the page keys are months", async ({ page, mount }) => {
    await mount("Essentials/Calendar/Default");

    await page.locator(day("12 August 2026")).click();
    await page.locator(roving).focus();

    await page.keyboard.press("Home");
    await expect.poll(() => activeLabel(page), { message: "Home is the start of the week" }).toBe("10 August 2026");

    await page.keyboard.press("End");
    await expect.poll(() => activeLabel(page), { message: "End is the end of the same week" }).toBe("16 August 2026");

    await page.keyboard.press("PageDown");
    await expect.poll(() => activeLabel(page), { message: "PageDown is a month" }).toBe("16 September 2026");

    await page.keyboard.press("PageUp");
    await expect.poll(() => activeLabel(page)).toBe("16 August 2026");
});

test("Shift with the page keys is a year rather than a month", async ({ page, mount }) => {
    await mount("Essentials/Calendar/Default");

    await page.locator(day("12 August 2026")).click();
    await page.locator(roving).focus();

    await page.keyboard.press("Shift+PageDown");
    await expect.poll(() => activeLabel(page), { message: "the same day and month, a year on" }).toBe("12 August 2027");
    await expect(readout(page, "month"), "and the visible month follows it").toHaveText("2027-08-01");

    await page.keyboard.press("Shift+PageUp");
    await expect.poll(() => activeLabel(page)).toBe("12 August 2026");

    await page.keyboard.press("Shift+PageUp");
    await expect
        .poll(() => activeLabel(page), { message: "and it steps back across the year boundary" })
        .toBe("12 August 2025");
});

test("Enter picks the day the keyboard is on", async ({ page, mount }) => {
    await mount("Essentials/Calendar/Default");

    await page.locator(roving).focus();
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("Enter");

    await expect(readout(page, "value")).toHaveText("2026-08-11");
});

test("a bounded calendar refuses the days outside its range without a native attribute", async ({ page, mount }) => {
    await mount("Essentials/Calendar/Bounded");

    await expect(page.locator("[disabled]"), "nothing uses the native disabled attribute").toHaveCount(0);
    await expect(page.locator(`${cell}[aria-disabled="true"]`), "every day outside min..max").toHaveCount(26);

    await page.locator(day("1 August 2026")).dispatchEvent("click");

    await expect(readout(page, "value"), "and clicking one picks nothing").toHaveText("none");
});

test("a consumer's own predicate can refuse days the range allows, whichever day starts the week", async ({
    page,
    mount,
}) => {
    await mount("Essentials/Calendar/Weekdays");

    await expect(page.locator(`${cell}[aria-disabled="true"]`), "twelve weekend days").toHaveCount(12);

    await mount("Essentials/Calendar/Weekdays", { weekStartsOn: 0 });

    await expect(page.locator('[role="columnheader"]').first(), "the header row rotates").toHaveAttribute(
        "aria-label",
        "Sun",
    );
    await expect(page.locator(`${cell}[aria-disabled="true"]`), "and the weekend is still the weekend").toHaveCount(12);
});

test("the wrapper between a row and its cells is transparent", async ({ page, mount }) => {
    await mount("Essentials/Calendar/Default");

    const structure = await page
        .locator(cell)
        .first()
        .evaluate((element) => ({
            wrapper: element.parentElement?.getAttribute("role"),
            row: element.parentElement?.parentElement?.getAttribute("role"),
        }));

    expect(structure.wrapper, "the wrapper declares itself presentational").toBe("presentation");
    expect(structure.row, "so the row above it still owns the cells").toBe("row");
});

test("paging announces the month it landed on, through a region no component owns", async ({ page, mount }) => {
    await mount("Essentials/Calendar/Default");

    await expect(page.locator(ANNOUNCER), "the region is reserved on mount").toHaveCount(1);
    await expect(page.locator(`${ANNOUNCER} > *`), "and empty").toHaveCount(0);

    await page.locator("#defaultNextMonth").click();

    await expect(page.locator(ANNOUNCER), "paging says where it landed").toContainText("September 2026");

    await page.locator("#defaultPreviousMonth").click();
    await page.locator("#defaultPreviousMonth").click();

    await expect(page.locator(ANNOUNCER), "each page is its own message").toContainText("July 2026");
});

test("moving within a month announces nothing, so only paging talks", async ({ page, mount }) => {
    await mount("Essentials/Calendar/Default");

    await page.locator(day("10 August 2026")).click();
    await page.keyboard.press("ArrowRight");

    await expect(page.locator(`${ANNOUNCER} > *`)).toHaveCount(0);
});

test.describe("another calendar system", () => {
    test("re-expresses the same instant without changing the grid's shape", async ({ page, mount }) => {
        await mount("Essentials/Calendar/Default", { calendarId: "hebrew" });

        await expect(page.locator(cell), "still six weeks of seven days").toHaveCount(42);
        await expect(page.locator(day("10 August 2026")), "and no day is named the Gregorian way").toHaveCount(0);
        await expect(page.locator(`${cell}[aria-selected="true"]`), "while the picked day is still picked").toHaveCount(
            1,
        );
    });

    test("offers a thirteenth month where the calendar has one", async ({ page, mount }) => {
        await mount("Essentials/Calendar/MonthPicker", { calendarId: "ethiopic" });

        await expect(page.locator(cell), "twelve months of thirty days plus a short thirteenth").toHaveCount(13);
    });

    test("keeps a bounded calendar's refusals on the same real days", async ({ page, mount }) => {
        await mount("Essentials/Calendar/Bounded", { calendarId: "hebrew" });

        await expect(page.locator(`${cell}[aria-disabled="true"]`)).toHaveCount(26);
    });
});

test.describe("a month picker", () => {
    test("holds the year's twelve months, each named with its year, and today's month is the tab stop", async ({
        page,
        mount,
    }) => {
        await mount("Essentials/Calendar/MonthPicker");

        await expect(page.locator(cell)).toHaveCount(12);
        await expect(page.locator('[role="columnheader"]'), "and no weekday headings").toHaveCount(0);
        await expect(page.locator(cell).first()).toHaveAttribute("aria-label", "January 2026");
        await expect(page.locator(`${cell}[aria-current="date"]`)).toHaveAttribute("aria-label", "August 2026");
        await expect(page.locator(roving)).toHaveAttribute("aria-label", "August 2026");
    });

    test("a pick sets the first of the month and marks the cell selected", async ({ page, mount }) => {
        await mount("Essentials/Calendar/MonthPicker");

        await page.locator(day("March 2026")).click();

        await expect(readout(page, "value")).toHaveText("2026-03-01");
        await expect(page.locator(`${cell}[aria-selected="true"]`)).toHaveAttribute("aria-label", "March 2026");
    });

    test("the arrows walk months by row and column and carry into the next year", async ({ page, mount }) => {
        await mount("Essentials/Calendar/MonthPicker");

        await page.locator(roving).focus();

        await page.keyboard.press("ArrowRight");
        await expect.poll(() => activeLabel(page), { message: "a column is one month" }).toBe("September 2026");

        await page.keyboard.press("ArrowDown");
        await expect.poll(() => activeLabel(page), { message: "a row is three months" }).toBe("December 2026");

        await page.keyboard.press("ArrowRight");
        await expect
            .poll(() => activeLabel(page), { message: "and a step off the last carries on" })
            .toBe("January 2027");
        await expect(page.locator(cell).first(), "taking the page with it").toHaveAttribute(
            "aria-label",
            "January 2027",
        );
    });

    test("the page keys step a year, and Shift steps twelve", async ({ page, mount }) => {
        await mount("Essentials/Calendar/MonthPicker");

        await page.locator(roving).focus();

        await page.keyboard.press("PageDown");
        await expect.poll(() => activeLabel(page)).toBe("August 2027");

        await page.keyboard.press("PageUp");
        await expect.poll(() => activeLabel(page)).toBe("August 2026");

        await page.keyboard.press("Shift+PageDown");
        await expect.poll(() => activeLabel(page), { message: "twelve pages above day precision" }).toBe("August 2038");
    });

    test("Enter picks the month the keyboard is on", async ({ page, mount }) => {
        await mount("Essentials/Calendar/MonthPicker");

        await page.locator(roving).focus();
        await page.keyboard.press("ArrowLeft");
        await page.keyboard.press("Enter");

        await expect(readout(page, "value")).toHaveText("2026-07-01");
    });

    test("paging moves a year at a time, and the page is announced", async ({ page, mount }) => {
        await mount("Essentials/Calendar/MonthPicker");

        await page.locator("#monthPickerNextMonth").click();

        await expect(page.locator(cell).first()).toHaveAttribute("aria-label", "January 2027");
        await expect(page.locator(ANNOUNCER), "the region says which year it landed on").toContainText("2027");

        await page.locator("#monthPickerPreviousMonth").click();
        await page.locator("#monthPickerPreviousMonth").click();

        await expect(page.locator(cell).first()).toHaveAttribute("aria-label", "January 2025");
    });
});

test.describe("a year picker", () => {
    test("pages in twelves from year 1 of the era, and refuses the years outside its bounds", async ({
        page,
        mount,
    }) => {
        await mount("Essentials/Calendar/YearPicker");

        await expect(page.locator(cell)).toHaveCount(12);
        await expect(page.locator(cell).first()).toHaveAttribute("aria-label", "2017");
        await expect(page.locator(`${cell}[aria-current="date"]`)).toHaveAttribute("aria-label", "2026");
        await expect(page.locator(`${cell}[aria-disabled="true"]`), "the two years before the minimum").toHaveCount(2);
        await expect(page.locator(day("2019")), "and the minimum itself is not").not.toHaveAttribute("aria-disabled");
    });

    test("a pick sets the first day of the year, and a refused year picks nothing", async ({ page, mount }) => {
        await mount("Essentials/Calendar/YearPicker");

        await page.locator(day("2017")).dispatchEvent("click");
        await expect(readout(page, "value")).toHaveText("none");

        await page.locator(day("2020")).click();
        await expect(readout(page, "value")).toHaveText("2020-01-01");
        await expect(page.locator(`${cell}[aria-selected="true"]`)).toHaveAttribute("aria-label", "2020");
    });

    test("the arrows carry past the page's last year into the next twelve", async ({ page, mount }) => {
        await mount("Essentials/Calendar/YearPicker");

        await page.locator(roving).focus();

        await page.keyboard.press("ArrowUp");
        await expect.poll(() => activeLabel(page)).toBe("2023");

        await page.keyboard.press("ArrowDown");
        await page.keyboard.press("ArrowRight");
        await page.keyboard.press("ArrowRight");
        await page.keyboard.press("ArrowRight");

        await expect.poll(() => activeLabel(page)).toBe("2029");
        await expect(page.locator(cell).first(), "on the next page of twelve").toHaveAttribute("aria-label", "2029");
    });

    test("the keyboard stops at the bounds rather than landing on a refused year", async ({ page, mount }) => {
        await mount("Essentials/Calendar/YearPicker");

        await page.locator(roving).focus();

        await page.keyboard.press("PageUp");
        await expect.poll(() => activeLabel(page), { message: "a page back clamps to the minimum" }).toBe("2019");

        await page.keyboard.press("ArrowUp");
        await expect.poll(() => activeLabel(page), { message: "and a row back stays on it" }).toBe("2019");

        await page.keyboard.press("Shift+PageDown");
        await expect.poll(() => activeLabel(page), { message: "a long step clamps to the maximum" }).toBe("2031");

        await page.keyboard.press("Enter");
        await expect(readout(page, "value")).toHaveText("2031-01-01");
    });

    test("paging moves twelve years at a time and announces the span", async ({ page, mount }) => {
        await mount("Essentials/Calendar/YearPicker");

        await page.locator("#yearPickerNextMonth").click();

        await expect(page.locator(cell).first()).toHaveAttribute("aria-label", "2029");
        await expect(page.locator(`${cell}[aria-disabled="true"]`), "every year after the maximum").toHaveCount(9);
        await expect(page.locator(ANNOUNCER)).toContainText(/2029\D+2040/);
    });
});

test.describe("in a right-to-left box", () => {
    test("the left arrow moves to the next day, the right arrow to the previous one", async ({ page, mount }) => {
        await mount("Essentials/Calendar/RightToLeft");

        expect(
            (await box(page, day("13 August 2026"))).centerX,
            "the day after is drawn to the left of the day before",
        ).toBeLessThan((await box(page, day("12 August 2026"))).centerX);

        await page.locator(day("12 August 2026")).click();
        await page.locator(roving).focus();

        await page.keyboard.press("ArrowRight");
        await expect.poll(() => activeLabel(page), { message: "ArrowRight is the day before" }).toBe("11 August 2026");

        await page.keyboard.press("ArrowLeft");
        await page.keyboard.press("ArrowLeft");
        await expect.poll(() => activeLabel(page), { message: "and ArrowLeft the day after" }).toBe("13 August 2026");

        await page.keyboard.press("ArrowDown");
        await expect.poll(() => activeLabel(page), { message: "ArrowDown is still a week on" }).toBe("20 August 2026");
    });

    test("the walk still carries across the end of a row", async ({ page, mount }) => {
        await mount("Essentials/Calendar/RightToLeft");

        const last = await box(page, day("16 August 2026"));
        const first = await box(page, day("17 August 2026"));

        expect(first.centerY, "the two days sit on different rows").toBeGreaterThan(last.centerY);
        expect(first.centerX, "and the next week starts at the opposite edge").toBeGreaterThan(last.centerX);

        await page.locator(day("16 August 2026")).click();
        await page.locator(roving).focus();

        await page.keyboard.press("ArrowLeft");
        await expect.poll(() => activeLabel(page)).toBe("17 August 2026");

        await page.keyboard.press("ArrowRight");
        await expect.poll(() => activeLabel(page)).toBe("16 August 2026");
    });
});
