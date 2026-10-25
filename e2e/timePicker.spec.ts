import { type Page, expect, test } from "@playwright/test";

import { docsDemo, docsSettled } from "./helpers";

/**
 * The time picker's page is its Docs view. The basic example shows no value under its field, so what it holds is
 * read off the field, which spells the 24-hour value it holds; the twelve-hour and limits examples show theirs in a
 * line under the field, matched by the value it ends with, never by the words before it.
 */
const DOCS = "/src/App/Pages/TimePickerPage/Docs";

const CLOCKED = docsDemo(DOCS, "Basic");
const TWELVE = docsDemo(DOCS, "TwelveHour");
const BOOKING = docsDemo(DOCS, "Limits");
const POPUP = '[role="dialog"]';

const field = (scope: string) => `${scope} input`;
const trigger = (key: string) => `#${key}Trigger`;

const readout = (page: Page, scope: string) => page.locator(`${scope} [data-readout]`);

/** The line under a field says it holds exactly this value: the value is the last thing on the line. */
const holds = (value: string) => new RegExp(`(?:^|\\s)${value}\\s*$`);

/**
 * A column is found by the name the library gave it, which comes from `Intl.DisplayNames` for the page's
 * locale rather than from anything the painter wrote. The page is `en-GB`, so the three names are `hour`,
 * `minute` and `am/pm` — a different locale would rename them, which is the point of asking `Intl` at all.
 */
const column = (name: string) => `${POPUP} [role="listbox"][aria-label="${name}"]`;

const option = (name: string, label: string) => `${column(name)} [role="option"][aria-label="${label}"]`;

const openClock = async (page: Page, key: string) => {
    await page.locator(trigger(key)).click();
    await expect(page.locator(POPUP)).toBeVisible();
};

test.beforeEach(async ({ page }) => {
    await page.goto("/time-picker/docs");
    await expect(page.locator(field(CLOCKED))).toBeVisible();
    await docsSettled(page);
});

/**
 * The shape of the popup is the decision this component exists to carry: a column per unit rather than one
 * list of generated times. A single list cannot spell a seconds-granular time without eighty-six thousand
 * rows, so the field would have accepted values the picker refused; these check that each unit the field
 * shows gets its own column and nothing more.
 */
test.describe("the clock's columns", () => {
    test("are one per unit the field shows", async ({ page }) => {
        await openClock(page, "basic");

        await expect(page.locator(`${POPUP} [role="listbox"]`), "a plain field is hours and minutes").toHaveCount(2);
        await expect(page.locator(column("hour"))).toBeVisible();
        await expect(page.locator(column("minute"))).toBeVisible();
    });

    test("gain an am/pm column when the field reads twelve-hour", async ({ page }) => {
        await openClock(page, "twelveHour");

        await expect(page.locator(`${POPUP} [role="listbox"]`)).toHaveCount(3);
        await expect(page.locator(column("am/pm")), "named by Intl, not by the painter").toBeVisible();
    });

    /**
     * Twelve is the first reading rather than the last: the column runs 12, 01 … 11, which is the order the
     * hours actually fall in, since twelve am is midnight. Listing 01 … 12 would put midnight at the bottom.
     */
    test("run from twelve when the field reads twelve-hour", async ({ page }) => {
        await openClock(page, "twelveHour");

        const labels = await page
            .locator(`${column("hour")} [role="option"]`)
            .evaluateAll((options) => options.map((element) => element.getAttribute("aria-label")));

        expect(labels).toEqual(["12", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11"]);
    });
});

/**
 * Typing and picking write the same signal, so neither half has to know about the other — the same
 * arrangement `DatePicker` uses. Picking an hour leaves the minute alone and vice versa, which is what
 * makes a column per unit worth the extra keyboard walk.
 */
test("picking a unit changes that unit and leaves the rest", async ({ page }) => {
    await openClock(page, "basic");

    const [, minute] = (await page.locator(field(CLOCKED)).inputValue()).split(":");

    await page.locator(option("hour", "11")).click();

    await expect(page.locator(field(CLOCKED)), "the minute the field already held survives").toHaveValue(
        `11:${minute}`,
    );

    await page.locator(option("minute", "45")).click();

    await expect(page.locator(field(CLOCKED))).toHaveValue("11:45");
});

/**
 * The trailing slot was already spoken for on a twelve-hour field: the am/pm control lives there. Rather
 * than adding a second slot, `TimePicker` widens the same one to hand the painter the trigger as well, so
 * the painter draws both or neither.
 */
test("the am/pm control and the clock trigger share the trailing slot", async ({ page }) => {
    await expect(page.locator(`${TWELVE} [aria-label^="Before or after noon"]`)).toBeVisible();
    await expect(page.locator(trigger("twelveHour"))).toBeVisible();

    await expect(readout(page, TWELVE), "the example starts in the afternoon").toHaveText(holds("14:30"));

    await openClock(page, "twelveHour");
    await page.locator(option("am/pm", "am")).click();

    await expect(readout(page, TWELVE), "14:30 read as pm becomes 02:30 am").toHaveText(holds("02:30"));
});

/**
 * A step coarsens a column without bounding it — every hour is still reachable, there are simply fewer
 * minutes offered. The bounds are separate, and an option is disabled when the time it would *produce*
 * falls outside them, which is why 08 is refused while 10 is not.
 */
test.describe("a stepped and bounded clock", () => {
    test("offers only the minutes it was given", async ({ page }) => {
        await openClock(page, "limits");

        const labels = await page
            .locator(`${column("minute")} [role="option"]`)
            .evaluateAll((options) => options.map((element) => element.getAttribute("aria-label")));

        expect(labels).toEqual(["00", "15", "30", "45"]);
    });

    test("refuses an hour that would land outside the bounds", async ({ page }) => {
        await openClock(page, "limits");

        await expect(page.locator(option("hour", "08")), "before opening").toHaveAttribute("aria-disabled", "true");
        await expect(page.locator(option("hour", "10")), "inside opening hours").not.toHaveAttribute("aria-disabled");

        await page.locator(option("hour", "08")).click({ force: true });

        await expect(readout(page, BOOKING), "a disabled option does nothing at all").toHaveText(holds("10:15"));
    });
});

/**
 * The whole clock is one tab stop, as the calendar grid is: arrows move within a column, then across to the
 * next, and only Enter commits. Moving the highlight is deliberately not selecting, so a walk across three
 * columns does not write three times.
 */
test("walks with the arrows and commits on Enter", async ({ page }) => {
    await openClock(page, "basic");

    await page.keyboard.press("Tab");
    await expect(page.locator(`${column("hour")} [role="option"][aria-label="09"]`)).toBeFocused();

    await page.keyboard.press("ArrowDown");

    await expect(page.locator(field(CLOCKED)), "moving the highlight writes nothing").toHaveValue("09:30");

    await page.keyboard.press("Enter");

    await expect(page.locator(field(CLOCKED))).toHaveValue("10:30");

    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");

    await expect(page.locator(field(CLOCKED)), "the second column commits its own unit").toHaveValue("10:31");
});
