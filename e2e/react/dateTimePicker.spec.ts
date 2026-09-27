import { type Page, expect, test } from "@playwright/test";

import { inputValue } from "../helpers";

/**
 * The React `DateTimePicker` and the pairing under it: one date-and-time value split by
 * `DateTimeValueReactUtils.useSplit` into a React `DatePicker` and `TimePicker`, or into a plain `DateInput` and
 * `TimeInput`. The cases follow `e2e/dateTimePicker.spec.ts`, which covers the Solid one: one half alone is not a
 * value, the two halves land in one value, editing one half leaves the other, an existing value reaches both fields,
 * clearing a half clears the value, the calendar fills only the date half and the clock completes it, and the two
 * popups are separate layers — plus the ids and names suffixed per half, and a bound that stops the clock only on
 * its own day.
 */
const DATE = "#date";
const TIME = "#time";
const POPUP = '[role="dialog"]';
const TODAY_CELL = '[role="gridcell"][aria-current="date"]';

const readout = (page: Page) => page.locator('[data-readout="value"]');

const typeInto = async (page: Page, selector: string, digits: string) => {
    await page.locator(selector).fill("");
    await page.locator(selector).click();
    await page.keyboard.type(digits, { delay: 15 });
};

test("one half on its own is not a value", async ({ page, mount }) => {
    await mount("Essentials/DateTimePicker/Paired");
    await typeInto(page, DATE, "20260810");

    await expect(readout(page)).toHaveText("none");
});

test("the two halves land in one value rather than two", async ({ page, mount }) => {
    await mount("Essentials/DateTimePicker/Paired");
    await typeInto(page, DATE, "20260810");
    await typeInto(page, TIME, "0930");

    await expect(readout(page)).toHaveText("2026-08-10 at 09:30");
});

test("editing one half leaves the other where it was", async ({ page, mount }) => {
    await mount("Essentials/DateTimePicker/Paired");
    await typeInto(page, DATE, "20260810");
    await typeInto(page, TIME, "0930");
    await typeInto(page, DATE, "20260814");

    await expect(readout(page)).toHaveText("2026-08-14 at 09:30");
});

test("an existing value shows up in both fields at once", async ({ page, mount }) => {
    await mount("Essentials/DateTimePicker/Seeded");

    await expect(page.locator(DATE)).toHaveValue("2026-08-10");
    await expect(page.locator(TIME)).toHaveValue("12:00");
    await expect(readout(page)).toHaveText("2026-08-10 at 12:00");
});

test("clearing one half clears the value, because there is no half a value", async ({ page, mount }) => {
    await mount("Essentials/DateTimePicker/Seeded");
    await page.locator(DATE).fill("");
    await page.locator(DATE).blur();

    await expect(readout(page)).toHaveText("none");
});

test.describe("the control over both halves", () => {
    test("suffixes the id and name per half", async ({ page, mount }) => {
        await mount("Essentials/DateTimePicker/Picked");

        await expect(page.locator("#moment-date")).toHaveAttribute("name", "moment-date");
        await expect(page.locator("#moment-time")).toHaveAttribute("name", "moment-time");
        await expect(page.locator("#moment-date")).toHaveAttribute("aria-label", "Date");
        await expect(page.locator("#moment-time")).toHaveAttribute("aria-label", "Time");
        await expect(page.getByTestId("separator")).toBeVisible();
    });

    test("the calendar fills only the date half, so the value is still incomplete", async ({ page, mount }) => {
        await mount("Essentials/DateTimePicker/Picked");
        await page.locator("#dateTrigger").click();
        await page.locator(`${POPUP} ${TODAY_CELL}`).click();

        await expect(page.locator("#moment-date")).not.toHaveValue("");
        await expect(readout(page)).toHaveText("none");
    });

    test("the clock completes the value the calendar started", async ({ page, mount }) => {
        await mount("Essentials/DateTimePicker/Picked");
        await page.locator("#dateTrigger").click();
        await page.locator(`${POPUP} ${TODAY_CELL}`).click();

        const date = await inputValue(page.locator("#moment-date"));

        await page.keyboard.press("Escape");
        await expect(page.locator(POPUP)).toHaveCount(0);

        await page.locator("#timeTrigger").click();
        await page.locator(`${POPUP} [role="option"]`).filter({ hasText: /^09$/ }).first().click();

        await expect(readout(page), "both popups write into the one value").toContainText(`${date} at 09`);
    });

    test("the two popups are separate layers", async ({ page, mount }) => {
        await mount("Essentials/DateTimePicker/Picked");
        await page.locator("#dateTrigger").click();

        await expect(page.locator(`${POPUP} [role="grid"]`)).toBeVisible();

        await page.keyboard.press("Escape");
        await expect(page.locator(POPUP)).toHaveCount(0);

        await page.locator("#timeTrigger").click();

        await expect(page.locator(`${POPUP} [role="option"]`).first()).toBeVisible();
        await expect(page.locator(`${POPUP} [role="grid"]`), "with no calendar left behind it").toHaveCount(0);
    });

    test("a bound stops the clock at its time only on its own day", async ({ page, mount }) => {
        await mount("Essentials/DateTimePicker/Bounded");
        await page.locator("#timeTrigger").click();

        const hour = (label: string) => `${POPUP} [role="listbox"][aria-label="hour"] [aria-label="${label}"]`;

        await expect(page.locator(hour("08")), "before the bound's time on the bound's day").toHaveAttribute(
            "aria-disabled",
            "true",
        );

        await page.keyboard.press("Escape");
        await typeInto(page, "#moment-date", "20260811");
        await page.locator("#timeTrigger").click();

        await expect(page.locator(hour("08")), "and the whole day on any later one").not.toHaveAttribute(
            "aria-disabled",
        );
    });
});
