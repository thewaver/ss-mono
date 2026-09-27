import { type Page, expect, test } from "@playwright/test";

import { inputValue } from "../helpers";

/**
 * The React `DateInput`, over the React `TextField`, `MaskedFieldReactUtils` and the shared `DateInputUtils`. The cases
 * follow the typed-date half of `e2e/datePicker.spec.ts`, which covers the Solid one: a complete date reaches the owner
 * as a date, an impossible one is refused and flagged, a half-typed one leaves the value alone and snaps back when the
 * field is left, the day-first mask supplies its separators and takes a digit with a backspaced one, a paste in foreign
 * punctuation is re-punctuated, the era is a control in the leading slot, and another calendar system re-expresses the
 * same day. The Playground's calendar knob becomes a mount prop.
 */
const FIELD = "#field";
const ERA = 'button[aria-label^="Era:"]';

const readout = (page: Page) => page.locator('[data-readout="value"]');

const typeInto = async (page: Page, text: string) => {
    await page.locator(FIELD).click();
    await page.keyboard.press("ControlOrMeta+a");
    await page.keyboard.type(text, { delay: 15 });
};

test("a complete date reaches the owner as a date, not as text", async ({ page, mount }) => {
    await mount("Essentials/DateInput/Typed");
    await typeInto(page, "2026-12-25");

    await expect(readout(page)).toHaveText("2026-12-25");
    await expect(page.locator(FIELD), "the field is numeric and not flagged").toHaveAttribute("inputmode", "numeric");
    await expect(page.locator(FIELD)).not.toHaveAttribute("aria-invalid");
});

test("a date that does not exist is refused rather than nudged, and costs the owner nothing", async ({
    page,
    mount,
}) => {
    await mount("Essentials/DateInput/Typed");
    await typeInto(page, "2026-02-31");

    await expect(readout(page), "the date the field started with still stands").toHaveText("2026-08-10");
    await expect(page.locator(FIELD), "and the field says what it shows is not a date").toHaveAttribute(
        "aria-invalid",
        "true",
    );

    await typeInto(page, "2026-02-28");

    await expect(readout(page), "while a real date lands").toHaveText("2026-02-28");
});

test("a part that cannot exist is flagged before the rest of the date is typed", async ({ page, mount }) => {
    await mount("Essentials/DateInput/Typed");
    await typeInto(page, "202613");

    await expect(page.locator(FIELD), "a thirteenth month is wrong at once").toHaveAttribute("aria-invalid", "true");
});

test("a half-typed date leaves the previous value alone, and is flagged only once the field is left", async ({
    page,
    mount,
}) => {
    await mount("Essentials/DateInput/Typed");
    await typeInto(page, "2026-12-25");
    await typeInto(page, "2026-1");

    await expect(readout(page), "an incomplete date neither commits nor clears").toHaveText("2026-12-25");
    await expect(page.locator(FIELD), "and is not wrong yet").not.toHaveAttribute("aria-invalid");

    await page.getByTestId("elsewhere").click();

    await expect(page.locator(FIELD), "leaving restores the spelling of the value held").toHaveValue("2026-12-25");
});

test("an unreadable field keeps its text and says so, rather than erasing what was typed", async ({ page, mount }) => {
    await mount("Essentials/DateInput/Empty");
    await typeInto(page, "2026-1");
    await page.getByTestId("elsewhere").click();

    await expect(page.locator(FIELD), "the text stays").toHaveValue("2026-1");
    await expect(page.locator(FIELD), "and is flagged now the field is left").toHaveAttribute("aria-invalid", "true");
    await expect(readout(page)).toHaveText("none");
});

test("the placeholder is handed the format's hint", async ({ page, mount }) => {
    await mount("Essentials/DateInput/MonthFirst");

    await expect(page.getByTestId("placeholder")).toHaveText("mm/dd/yyyy");
});

test.describe("a day-first field", () => {
    test("supplies its own separators, and reads back as a real date", async ({ page, mount }) => {
        await mount("Essentials/DateInput/DayFirst");
        await typeInto(page, "25122026");

        expect(await inputValue(page.locator(FIELD)), "eight digits become a punctuated date").toBe("25/12/2026");
        await expect(readout(page)).toHaveText("2026-12-25");
    });

    test("refuses a date that does not exist, in this order too", async ({ page, mount }) => {
        await mount("Essentials/DateInput/DayFirst");
        await typeInto(page, "31022026");

        expect(await inputValue(page.locator(FIELD))).toBe("31/02/2026");
        await expect(readout(page)).toHaveText("2026-08-10");
    });

    test("takes the digit with the separator when the separator is backspaced", async ({ page, mount }) => {
        await mount("Essentials/DateInput/DayFirst");
        await typeInto(page, "2512");

        expect(await inputValue(page.locator(FIELD)), "a full group carries its separator").toBe("25/12/");

        await page.locator(FIELD).press("Backspace");
        await page.locator(FIELD).press("Backspace");

        expect(await inputValue(page.locator(FIELD)), "two presses remove two digits").toBe("25/");
    });

    test("accepts a paste in a punctuation it does not use", async ({ page, mount }) => {
        await mount("Essentials/DateInput/DayFirst");
        await page.locator(FIELD).click();
        await page.keyboard.press("ControlOrMeta+a");
        await page.locator(FIELD).fill("25.12.2026");

        expect(await inputValue(page.locator(FIELD)), "the mask re-punctuates it").toBe("25/12/2026");
        await expect(readout(page)).toHaveText("2026-12-25");
    });

    test("leaves the previous value alone while it is half typed, and snaps back on blur", async ({ page, mount }) => {
        await mount("Essentials/DateInput/DayFirst");
        await typeInto(page, "25122026");
        await typeInto(page, "2512");

        await expect(readout(page)).toHaveText("2026-12-25");

        await page.getByTestId("elsewhere").click();

        expect(await inputValue(page.locator(FIELD))).toBe("25/12/2026");
    });
});

test.describe("eras and other calendar systems", () => {
    test("spells a year before the common era as a positive year beside its era", async ({ page, mount }) => {
        await mount("Essentials/DateInput/Era");

        expect(await inputValue(page.locator(FIELD)), "four digits, and no sign among them").toBe("0044-03-15");
        await expect(page.locator(ERA), "the era is named beside the digits").toHaveText("BC");
        await expect(readout(page), "and the value is the astronomical year").toHaveText("-000043-03-15");
    });

    test("moving the era keeps the year and lands on a different real date", async ({ page, mount }) => {
        await mount("Essentials/DateInput/Era");
        await page.locator(ERA).click();

        await expect(page.locator(ERA)).toHaveText("AD");
        await expect(readout(page)).toHaveText("0044-03-15");
        expect(await inputValue(page.locator(FIELD)), "the digits are untouched").toBe("0044-03-15");
    });

    test("a typed date is re-expressed when the calendar system changes", async ({ page, mount }) => {
        await mount("Essentials/DateInput/Typed");
        expect(await inputValue(page.locator(FIELD))).toBe("2026-08-10");

        await mount("Essentials/DateInput/Typed", { calendarId: "japanese" });

        await expect(page.locator(FIELD), "the same day, counted inside the Japanese era").toHaveValue("0008-08-10");
        await expect(readout(page), "and the value itself has not moved").toHaveText("2026-08-10");
    });

    test("offers the calendar's own era list rather than a pair", async ({ page, mount }) => {
        await mount("Essentials/DateInput/Typed", { calendarId: "japanese" });

        await expect(page.locator(ERA), "a date in 2026 is in the current era").toHaveText("Reiwa");

        await page.locator(ERA).click();

        await expect(page.locator(ERA), "and cycling past the last of five wraps to the first").toHaveText("Meiji");
    });

    test("typing a date in another calendar reads back as that calendar's date", async ({ page, mount }) => {
        await mount("Essentials/DateInput/Typed", { calendarId: "hebrew" });
        await typeInto(page, "5784-06-01");

        await expect(readout(page), "Adar I of a leap year is a real month").toHaveText("2024-02-10");
    });
});

test("a disabled field reads as disabled and cannot move its era", async ({ page, mount }) => {
    await mount("Essentials/DateInput/Era", { isDisabled: true });

    await expect(page.locator(FIELD)).toHaveAttribute("aria-disabled", "true");
    await expect(page.locator(FIELD)).toHaveAttribute("readonly", "");

    await page.locator(ERA).click({ force: true });

    await expect(readout(page)).toHaveText("-000043-03-15");
});
