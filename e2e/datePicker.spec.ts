import { type Page, expect, test } from "@playwright/test";

import { docsDemo, docsSettled, inputValue, prop } from "./helpers";

/**
 * The typed date field, the typed time field and the picker each have a Docs page of their own, so each test opens
 * the one it is about. An example that holds a value it does not draw shows it in a line under the field; that line
 * is matched by the value alone at its end, never by the words before it, which are the page's to reword.
 */
const DATE_INPUT_DOCS = "/src/App/Pages/DateInputPage/Docs";
const DATE_PICKER_DOCS = "/src/App/Pages/DatePickerPage/Docs";
const TIME_INPUT_DOCS = "/src/App/Pages/TimeInputPage/Docs";

const TYPED = docsDemo(DATE_INPUT_DOCS, "Basic");
const DAY_FIRST = docsDemo(DATE_INPUT_DOCS, "DayFirst");
const ERA = docsDemo(DATE_INPUT_DOCS, "Era");
const CALENDARS = docsDemo(DATE_INPUT_DOCS, "Calendars");

const PICKED = docsDemo(DATE_PICKER_DOCS, "Basic");
const BOUNDED = docsDemo(DATE_PICKER_DOCS, "Bounded");
const WEEKDAYS = docsDemo(DATE_PICKER_DOCS, "DisabledDays");

const TIME = docsDemo(TIME_INPUT_DOCS, "Basic");
const TWELVE = docsDemo(TIME_INPUT_DOCS, "TwelveHour");
const PRECISE = docsDemo(TIME_INPUT_DOCS, "Seconds");
const SHIFT = docsDemo(TIME_INPUT_DOCS, "Limits");

const POPUP = '[role="dialog"]';

const field = (scope: string) => `${scope} input:not([type="hidden"])`;
const trigger = (key: string) => `#${key}Trigger`;
const day = (label: string) => `${POPUP} [role="gridcell"][aria-label="${label}"]`;

const readout = (page: Page, scope: string) => page.locator(`${scope} [data-readout]`);

const escapePattern = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** The line under a field says it holds exactly this value: the value is the last thing on the line. */
const holds = (value: string) => new RegExp(`(?:^|\\s)${escapePattern(value)}\\s*$`);

const ISO_DATE = /-?\d{4,6}-\d{2}-\d{2}/;
const ISO_TIME = /\d{2}:\d{2}(?::\d{2})?/;

/** The value the line under a field states, or `undefined` when it states none. */
const heldValue = async (page: Page, scope: string, pattern: RegExp) =>
    ((await readout(page, scope).textContent()) ?? "").match(pattern)?.[0];

/**
 * A day the open calendar lets through, rather than a date written down here. A picker with no value opens on the
 * machine's current month, so any date spelled out in this file is right only until the clock passes it, and today
 * itself may be a day the example refuses.
 */
const OPEN_DAY = `${POPUP} [role="gridcell"]:not([aria-disabled="true"])`;

/**
 * The field is typed in ISO order, which is the one format `DateValueUtils.fromIso` accepts and refuses
 * precisely. Typing is driven character by character rather than filled, because the interesting cases are
 * the partial ones — a date is not a value until the last digit lands.
 */
const typeInto = async (page: Page, selector: string, text: string) => {
    await page.locator(selector).click();
    await page.keyboard.press("ControlOrMeta+a");
    await page.keyboard.type(text, { delay: 15 });
};

const openDocs = async (page: Page, route: string, ready: string) => {
    await page.goto(route);
    await expect(page.locator(field(ready))).toBeVisible();
    await docsSettled(page);
};

const openDateInput = (page: Page) => openDocs(page, "/date-input/docs", TYPED);

const openDatePicker = (page: Page) => openDocs(page, "/date-picker/docs", PICKED);

const openTimeInput = (page: Page) => openDocs(page, "/time-input/docs", TIME);

test("a complete date reaches the owner as a date, not as text", async ({ page }) => {
    await openDateInput(page);
    await typeInto(page, field(TYPED), "2026-12-25");

    await expect(readout(page, TYPED)).toHaveText(holds("2026-12-25"));
});

test("a date that does not exist is refused rather than nudged, and costs the owner nothing", async ({ page }) => {
    await openDateInput(page);
    await typeInto(page, field(TYPED), "2026-08-10");
    await expect(readout(page, TYPED)).toHaveText(holds("2026-08-10"));

    await typeInto(page, field(TYPED), "2026-02-31");

    await expect(
        readout(page, TYPED),
        "the 31st of February is not the 3rd of March, and the date the field held still stands",
    ).toHaveText(holds("2026-08-10"));
    await expect(
        page.locator(field(TYPED)),
        "the field says instead that what it is showing is not a date",
    ).toHaveAttribute("aria-invalid", "true");

    await typeInto(page, field(TYPED), "2026-02-28");

    await expect(readout(page, TYPED), "while a real date lands").toHaveText(holds("2026-02-28"));
});

/**
 * The day-first field is the mask's only consumer, and the mask's contract is that **only digits are typed**:
 * the separators are supplied from the pattern, so what a user presses and what the field holds are different
 * strings. That is the whole reason the caret is computed rather than preserved, so these drive real
 * keystrokes rather than filling the value. The example's Format knob starts on day, month, year.
 */
test.describe("a day-first field", () => {
    test("supplies its own separators, and reads back as a real date", async ({ page }) => {
        await openDateInput(page);
        await typeInto(page, field(DAY_FIRST), "25122026");

        expect(await inputValue(page.locator(field(DAY_FIRST))), "eight digits become a punctuated date").toBe(
            "25/12/2026",
        );
        await expect(readout(page, DAY_FIRST), "and the owner gets the date, in its own order").toHaveText(
            holds("2026-12-25"),
        );
    });

    test("refuses a date that does not exist, in this order too", async ({ page }) => {
        await openDateInput(page);

        const before = await heldValue(page, DAY_FIRST, ISO_DATE);

        expect(before, "the example starts holding a date").toBeDefined();

        await typeInto(page, field(DAY_FIRST), "31022026");

        expect(await inputValue(page.locator(field(DAY_FIRST))), "the text is what was typed").toBe("31/02/2026");
        await expect(
            readout(page, DAY_FIRST),
            "but the 31st of February is still not a date, so the owner keeps the one it had",
        ).toHaveText(holds(before!));
    });

    test("takes the digit with the separator when the separator is backspaced", async ({ page }) => {
        await openDateInput(page);
        await typeInto(page, field(DAY_FIRST), "2512");

        expect(
            await inputValue(page.locator(field(DAY_FIRST))),
            "a full group carries its separator, so the field says a year is wanted next",
        ).toBe("25/12/");

        await page.locator(field(DAY_FIRST)).press("Backspace");
        await page.locator(field(DAY_FIRST)).press("Backspace");

        expect(
            await inputValue(page.locator(field(DAY_FIRST))),
            "two presses remove two digits, not a digit and a slash",
        ).toBe("25/");
    });

    /**
     * A paste is the one input here that does not arrive a key at a time, so it is driven as the browser delivers
     * one: the whole text inserted at once, over the selection.
     */
    test("accepts a paste in a punctuation it does not use", async ({ page }) => {
        await openDateInput(page);
        await page.locator(field(DAY_FIRST)).click();
        await page.keyboard.press("ControlOrMeta+a");
        await page.keyboard.insertText("25.12.2026");

        expect(await inputValue(page.locator(field(DAY_FIRST))), "the mask re-punctuates it").toBe("25/12/2026");
        await expect(readout(page, DAY_FIRST)).toHaveText(holds("2026-12-25"));
    });

    test("leaves the previous value alone while it is half typed, and snaps back on blur", async ({ page }) => {
        await openDateInput(page);
        await typeInto(page, field(DAY_FIRST), "25122026");
        await typeInto(page, field(DAY_FIRST), "2512");

        await expect(
            readout(page, DAY_FIRST),
            "four digits are not a date, so they neither commit nor clear",
        ).toHaveText(holds("2026-12-25"));

        await page.locator(field(TYPED)).click();

        expect(
            await inputValue(page.locator(field(DAY_FIRST))),
            "and leaving restores the spelling of the value that is actually held",
        ).toBe("25/12/2026");
    });
});

test("a half-typed date leaves the previous value alone until it is complete", async ({ page }) => {
    await openDateInput(page);
    await typeInto(page, field(TYPED), "2026-12-25");
    await typeInto(page, field(TYPED), "2026-1");

    await expect(readout(page, TYPED), "an incomplete date is neither committed nor treated as cleared").toHaveText(
        holds("2026-12-25"),
    );
});

test("the trigger opens a calendar over the field", async ({ page }) => {
    await openDatePicker(page);
    await expect(page.locator(POPUP), "nothing is portaled before it opens").toHaveCount(0);

    await page.locator(trigger("basic")).click();

    await expect(page.locator(POPUP)).toHaveAttribute("aria-label", "Choose a date");
    await expect(page.locator(`${POPUP} [role="gridcell"]`), "six weeks of days").toHaveCount(42);
});

test("picking a day writes the field and the owner together", async ({ page }) => {
    await openDatePicker(page);
    await page.locator(trigger("disabledDays")).click();
    await page.locator(OPEN_DAY).first().click();

    const picked = await inputValue(page.locator(field(WEEKDAYS)));

    expect(picked, "the field takes the day that was clicked").not.toBe("");
    await expect(readout(page, WEEKDAYS), "and the owner holds the very same date").toHaveText(holds(picked));
});

test("typing moves the calendar to the month it lands in", async ({ page }) => {
    await openDatePicker(page);
    await typeInto(page, field(PICKED), "2027-03-09");
    await page.locator(trigger("basic")).click();

    await expect(page.locator(day("9 March 2027")), "the popup opens on the value's own month").toHaveAttribute(
        "aria-selected",
        "true",
    );
});

test("Escape closes the calendar and leaves the value alone", async ({ page }) => {
    await openDatePicker(page);
    await page.locator(trigger("disabledDays")).click();
    await page.locator(OPEN_DAY).first().click();

    const picked = await inputValue(page.locator(field(WEEKDAYS)));

    await page.keyboard.press("Escape");

    await expect(page.locator(POPUP)).toHaveCount(0);
    await expect(readout(page, WEEKDAYS), "the pick survives the dismissal").toHaveText(holds(picked));
});

/**
 * The example's limits are not written here: the date a typed one is pulled to is read back off the page, and
 * checked against the calendar, where it has to be the first day not refused.
 */
test("a date outside the bounds is kept as typed and pulled to the nearest one on leaving", async ({ page }) => {
    await openDatePicker(page);
    await typeInto(page, field(BOUNDED), "2026-08-01");

    await expect(readout(page, BOUNDED), "a typed date outside the range is held as typed").toHaveText(
        holds("2026-08-01"),
    );

    await page.keyboard.press("Tab");

    await expect(readout(page, BOUNDED), "leaving the field moves the value").not.toHaveText(holds("2026-08-01"));

    const start = (await heldValue(page, BOUNDED, ISO_DATE))!;

    expect(start > "2026-08-01", "forward, to the start of the range").toBe(true);
    expect(await inputValue(page.locator(field(BOUNDED))), "and the field shows where it went").toBe(start);

    await page.locator(trigger("bounded")).click();

    const cells = await page.locator(`${POPUP} [role="gridcell"]`).evaluateAll((elements) =>
        elements.map((element) => ({
            isSelected: element.getAttribute("aria-selected") === "true",
            isRefused: element.getAttribute("aria-disabled") === "true",
        })),
    );
    const at = cells.findIndex((cell) => cell.isSelected);

    expect(at, "the calendar marks the value").toBeGreaterThan(0);
    expect(cells[at].isRefused, "it is a day the range allows").toBe(false);
    expect(cells[at - 1].isRefused, "and the day before it is not").toBe(true);

    await page.keyboard.press("Escape");
    await typeInto(page, field(BOUNDED), "2026-08-12");

    await expect(readout(page, BOUNDED), "one inside it is").toHaveText(holds("2026-08-12"));

    await page.locator(trigger("bounded")).click();

    await expect(
        page.locator(`${POPUP} [role="gridcell"][aria-disabled="true"]`),
        "and the grid marks every day the range excludes",
    ).toHaveCount(26);
});

const caretAt = (page: Page, selector: string, at: number) =>
    page.locator(selector).evaluate((element, offset) => {
        (element as HTMLInputElement).setSelectionRange(offset, offset);
    }, at);

const selectionOf = (page: Page, selector: string) =>
    page
        .locator(selector)
        .evaluate(
            (element) =>
                `${(element as HTMLInputElement).selectionStart}-${(element as HTMLInputElement).selectionEnd}`,
        );

test("a complete time reaches the owner, and an impossible one does not", async ({ page }) => {
    await openTimeInput(page);
    await typeInto(page, field(TIME), "14:45");

    await expect(readout(page, TIME)).toHaveText(holds("14:45"));

    await typeInto(page, field(TIME), "24:00");

    await expect(readout(page, TIME), "there is no 24th hour, so quarter to three still stands").toHaveText(
        holds("14:45"),
    );
    await expect(page.locator(field(TIME)), "with the field marking what it shows").toHaveAttribute(
        "aria-invalid",
        "true",
    );

    await typeInto(page, field(TIME), "09:60");

    await expect(readout(page, TIME), "nor a 60th minute").toHaveText(holds("14:45"));
});

test("the arrows step whichever segment the caret is in, and select it", async ({ page }) => {
    await openTimeInput(page);
    await typeInto(page, field(TIME), "14:45");

    await caretAt(page, field(TIME), 0);
    await page.keyboard.press("ArrowUp");

    await expect(readout(page, TIME), "the caret in the hour steps the hour").toHaveText(holds("15:45"));
    expect(await selectionOf(page, field(TIME)), "and the stepped segment is selected, ready to be stepped again").toBe(
        "0-2",
    );

    await caretAt(page, field(TIME), 4);
    await page.keyboard.press("ArrowDown");

    await expect(readout(page, TIME), "the caret in the minute steps the minute").toHaveText(holds("15:44"));
    expect(await selectionOf(page, field(TIME))).toBe("3-5");
});

test("stepping carries between segments and wraps around the day", async ({ page }) => {
    await openTimeInput(page);
    await typeInto(page, field(TIME), "09:59");
    await caretAt(page, field(TIME), 4);
    await page.keyboard.press("ArrowUp");

    await expect(readout(page, TIME), "a minute past 59 carries into the hour").toHaveText(holds("10:00"));

    await typeInto(page, field(TIME), "23:30");
    await caretAt(page, field(TIME), 0);
    await page.keyboard.press("ArrowUp");

    await expect(readout(page, TIME), "and an hour past 23 wraps rather than leaving the day").toHaveText(
        holds("00:30"),
    );
});

/** The example shows no line under the field, so the step is read off the text, which spells the value held. */
test("a seconds field has a third segment of its own", async ({ page }) => {
    await openTimeInput(page);

    const before = await inputValue(page.locator(field(PRECISE)));
    const [hours, minutes, seconds] = before.split(":");

    expect(seconds, "the field starts with a seconds segment").toBeDefined();

    await page.locator(field(PRECISE)).click();
    await caretAt(page, field(PRECISE), 7);
    await page.keyboard.press("ArrowUp");

    expect(await inputValue(page.locator(field(PRECISE))), "the caret in the seconds steps the seconds").toBe(
        `${hours}:${minutes}:${String(Number(seconds) + 1).padStart(2, "0")}`,
    );
});

/**
 * The example's opening hours are not written here: each end is found by typing a time beyond it and reading back
 * where leaving the field pulled it.
 */
test("bounds pull a typed time in on leaving and clamp a stepped one", async ({ page }) => {
    await openTimeInput(page);
    await typeInto(page, field(SHIFT), "00:00");

    await expect(readout(page, SHIFT), "a time before opening is held as typed").toHaveText(holds("00:00"));

    await page.keyboard.press("Tab");

    await expect(readout(page, SHIFT), "and leaving the field pulls it in").not.toHaveText(holds("00:00"));

    const start = (await heldValue(page, SHIFT, ISO_TIME))!;

    await typeInto(page, field(SHIFT), "23:59");

    await expect(readout(page, SHIFT), "a time after closing is held as typed too").toHaveText(holds("23:59"));

    await page.keyboard.press("Tab");

    await expect(readout(page, SHIFT), "until the field is left").not.toHaveText(holds("23:59"));

    const end = (await heldValue(page, SHIFT, ISO_TIME))!;

    expect(start < end, "the two ends it was pulled to are opening and closing, in that order").toBe(true);

    await typeInto(page, field(SHIFT), end);

    await expect(readout(page, SHIFT), "the closing time itself is a value").toHaveText(holds(end));

    await caretAt(page, field(SHIFT), 0);
    await page.keyboard.press("ArrowUp");

    await expect(readout(page, SHIFT), "and stepping past the end clamps rather than wrapping").toHaveText(holds(end));
});

/**
 * A 12-hour field is the mask's other half of the story and deliberately not a mask feature: the digits stay
 * digits, and the half of the day is a control in the trailing slot rather than a letter slot in the pattern.
 * So the value the owner holds is still 24-hour and the field is only a way of reading it — which is what
 * these drive, since nothing about it is visible in the text alone. The example's Twelve hour knob starts on.
 */
test.describe("a twelve-hour field", () => {
    const toggle = `${TWELVE} button[aria-label^="Before or after noon"]`;

    test("reads a 24-hour value as twelve hours plus a half of the day", async ({ page }) => {
        await openTimeInput(page);
        expect(await inputValue(page.locator(field(TWELVE))), "half past two in the afternoon reads as 02:30").toBe(
            "02:30",
        );
        await expect(page.locator(toggle), "with the half of the day named for a screen reader").toHaveAttribute(
            "aria-label",
            "Before or after noon: PM",
        );
        await expect(readout(page, TWELVE), "while the owner still holds 14:30").toHaveText(holds("14:30"));
    });

    test("the toggle moves the value by twelve hours without touching the text", async ({ page }) => {
        await openTimeInput(page);
        await page.locator(toggle).click();

        await expect(readout(page, TWELVE), "pm becomes am, so 14:30 becomes 02:30").toHaveText(holds("02:30"));
        expect(
            await inputValue(page.locator(field(TWELVE))),
            "and the text is unchanged, because it reads the same",
        ).toBe("02:30");

        await page.locator(toggle).click();

        await expect(readout(page, TWELVE), "and back again").toHaveText(holds("14:30"));
    });

    test("typing twelve-hour digits lands the hour the half of the day says", async ({ page }) => {
        await openTimeInput(page);
        await typeInto(page, field(TWELVE), "09:15");

        await expect(readout(page, TWELVE), "nine fifteen in the afternoon is 21:15").toHaveText(holds("21:15"));

        await page.locator(toggle).click();

        await expect(readout(page, TWELVE), "and in the morning it is 09:15").toHaveText(holds("09:15"));
    });

    test("twelve o'clock is the case that catches an off-by-twelve", async ({ page }) => {
        await openTimeInput(page);
        await typeInto(page, field(TWELVE), "12:00");

        await expect(readout(page, TWELVE), "12:00 pm is noon, not midnight").toHaveText(holds("12:00"));

        await page.locator(toggle).click();

        await expect(readout(page, TWELVE), "and 12:00 am is midnight, not noon").toHaveText(holds("00:00"));
    });

    test("refuses an hour a twelve-hour clock does not have", async ({ page }) => {
        await openTimeInput(page);
        await typeInto(page, field(TWELVE), "13:00");

        await expect(
            readout(page, TWELVE),
            "there is no thirteenth hour to read, and half past two in the afternoon is unharmed by the attempt",
        ).toHaveText(holds("14:30"));
    });

    test("stepping the hour crosses noon and takes the half of the day with it", async ({ page }) => {
        await openTimeInput(page);
        await typeInto(page, field(TWELVE), "11:30");
        await caretAt(page, field(TWELVE), 0);

        await expect(readout(page, TWELVE), "starting at half past eleven in the evening").toHaveText(holds("23:30"));

        await page.keyboard.press("ArrowUp");

        await expect(readout(page, TWELVE), "stepping the hour wraps around midnight").toHaveText(holds("00:30"));
        await expect(
            page.locator(toggle),
            "and the toggle follows the value rather than being set twice",
        ).toHaveAttribute("aria-label", "Before or after noon: AM");
        expect(await inputValue(page.locator(field(TWELVE))), "with the text reading twelve, not zero").toBe("12:30");
    });
});

/**
 * The era is a control in the field's leading slot rather than a segment of the mask, so the mask stays
 * digits-only and the year the field spells is the year *within* the era. Locating the control by the start of
 * its accessible name keeps these tests independent of the era's display name, which is the locale's to choose.
 *
 * The calendar systems example has its own Calendar knob, starting on a calendar other than the Gregorian.
 */
test.describe("eras and other calendar systems", () => {
    const eraButton = (scope: string) => `${scope} button[aria-label^="Era:"]`;

    const chooseKnob = async (page: Page, key: string, name: string) => {
        const picker = page.locator(`${prop(key)} [role="combobox"]`);

        await picker.click();
        await page
            .locator(`[id="${await picker.getAttribute("aria-controls")}"]`)
            .getByRole("option", { name, exact: true })
            .click();
    };

    test("spells a year before the common era as a positive year beside its era", async ({ page }) => {
        await openDateInput(page);
        expect(await inputValue(page.locator(field(ERA))), "four digits, and no sign among them").toBe("0044-03-15");
        await expect(page.locator(eraButton(ERA)), "the era is named beside the digits").toHaveText("BC");
        await expect(readout(page, ERA), "and the value is the astronomical year").toHaveText(holds("-000043-03-15"));
    });

    test("moving the era keeps the year and lands on a different real date", async ({ page }) => {
        await openDateInput(page);
        await page.locator(eraButton(ERA)).click();

        await expect(page.locator(eraButton(ERA))).toHaveText("AD");
        await expect(readout(page, ERA)).toHaveText(holds("0044-03-15"));
        expect(await inputValue(page.locator(field(ERA))), "the digits are untouched by the era moving").toBe(
            "0044-03-15",
        );
    });

    test("a typed date is re-expressed when the calendar system changes", async ({ page }) => {
        await openDateInput(page);
        await chooseKnob(page, "calendar", "gregory");

        const held = await heldValue(page, CALENDARS, ISO_DATE);

        await expect(page.locator(field(CALENDARS)), "the Gregorian field spells the value as it is").toHaveValue(
            held!,
        );

        await chooseKnob(page, "calendar", "japanese");

        await expect(
            page.locator(field(CALENDARS)),
            "the same day, counted inside the era the Japanese calendar is in",
        ).toHaveValue("0008-08-10");
        await expect(readout(page, CALENDARS), "and the value itself has not moved").toHaveText(holds(held!));
    });

    test("offers the calendar's own era list rather than a pair", async ({ page }) => {
        await openDateInput(page);
        await chooseKnob(page, "calendar", "japanese");

        await expect(page.locator(eraButton(CALENDARS)), "a date in 2026 is in the current era").toHaveText("Reiwa");

        await page.locator(eraButton(CALENDARS)).click();

        await expect(
            page.locator(eraButton(CALENDARS)),
            "and cycling past the last of five wraps to the first rather than toggling a pair",
        ).toHaveText("Meiji");
    });

    test("typing a date in another calendar reads back as that calendar's date", async ({ page }) => {
        await openDateInput(page);
        await chooseKnob(page, "calendar", "hebrew");
        await typeInto(page, field(CALENDARS), "5784-06-01");

        await expect(readout(page, CALENDARS), "Adar I of a leap year is a real month and lands a real day").toHaveText(
            holds("2024-02-10"),
        );
    });
});

/**
 * The bounds a picker takes are a range, and a range cannot say "not on a Sunday". `Calendar` has always
 * taken a predicate for that; `DatePicker` passes it through rather than making a consumer drop down to
 * `Calendar` and build the popup themselves.
 *
 * The count is what makes this checkable without pinning a month: the grid is always six weeks of seven
 * days, so whichever month is showing, exactly twelve of the forty-two cells are a Saturday or a Sunday.
 */
test("a picker can refuse individual days, not only a range of them", async ({ page }) => {
    await openDatePicker(page);
    await page.locator(trigger("disabledDays")).click();
    await expect(page.locator(POPUP)).toBeVisible();

    await expect(page.locator(`${POPUP} [role="gridcell"]`)).toHaveCount(42);
    await expect(
        page.locator(`${POPUP} [role="gridcell"][aria-disabled="true"]`),
        "six weekends, whichever month is showing",
    ).toHaveCount(12);
});

/**
 * A refused weekday has no nearest allowed day to be pulled to, so the field treats it like a date that does not
 * exist: kept as typed, marked, and not a value.
 */
test("a refused day typed into the field is an error, not a value", async ({ page }) => {
    await openDatePicker(page);
    await typeInto(page, field(WEEKDAYS), "2026-08-12");

    await expect(readout(page, WEEKDAYS), "a Wednesday is a working day").toHaveText(holds("2026-08-12"));

    await typeInto(page, field(WEEKDAYS), "2026-08-15");

    await expect(page.locator(field(WEEKDAYS)), "a Saturday is kept as typed").toHaveValue("2026-08-15");
    await expect(page.locator(field(WEEKDAYS)), "and marked as not a value").toHaveAttribute("aria-invalid", "true");
    await expect(readout(page, WEEKDAYS), "while the value stays where it was").toHaveText(holds("2026-08-12"));
});
