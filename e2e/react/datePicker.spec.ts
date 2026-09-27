import { type Page, expect, test } from "@playwright/test";

import { inputValue } from "../helpers";

/**
 * The React `DatePicker`: the React `DateInput` with the React `Calendar` in a React `Popover`, opened by a
 * `PopupTrigger` it owns in the field's trailing slot. The cases follow the picker half of `e2e/datePicker.spec.ts`,
 * which covers the Solid one: the trigger opens a named calendar, picking writes the field and the owner together,
 * typing moves the calendar to the value's month, Escape closes it and returns focus to the field, bounds and a
 * consumer's own refusals reach the grid, and the trigger is refused while the picker is disabled. The typed-field
 * cases are in `e2e/react/dateInput.spec.ts`.
 */
const FIELD = "#field";
const TRIGGER = "#trigger";
const POPUP = '[role="dialog"]';
const TODAY_CELL = `${POPUP} [role="gridcell"][aria-current="date"]`;

const day = (label: string) => `${POPUP} [role="gridcell"][aria-label="${label}"]`;

const readout = (page: Page) => page.locator('[data-readout="value"]');

const typeInto = async (page: Page, text: string) => {
    await page.locator(FIELD).click();
    await page.keyboard.press("ControlOrMeta+a");
    await page.keyboard.type(text, { delay: 15 });
};

test("the trigger opens a calendar over the field, and says so", async ({ page, mount }) => {
    await mount("Essentials/DatePicker/Picked");

    await expect(page.locator(POPUP), "nothing is portaled before it opens").toHaveCount(0);
    await expect(page.locator(TRIGGER)).toHaveAttribute("aria-haspopup", "dialog");
    await expect(page.locator(TRIGGER)).toHaveAttribute("aria-label", "Open the calendar");
    await expect(page.locator(TRIGGER)).toHaveAttribute("aria-expanded", "false");

    await page.locator(TRIGGER).click();

    await expect(page.locator(POPUP)).toHaveAttribute("aria-label", "Choose a date");
    await expect(page.locator(`${POPUP} [role="gridcell"]`), "six weeks of days").toHaveCount(42);
    await expect(page.locator(TRIGGER)).toHaveAttribute("aria-expanded", "true");

    const controls = await page.locator(TRIGGER).getAttribute("aria-controls");

    expect(await page.locator(`[id="${controls}"]`).getAttribute("role")).toBe("dialog");
});

test("picking a day writes the field and the owner together", async ({ page, mount }) => {
    await mount("Essentials/DatePicker/Picked");
    await page.locator(TRIGGER).click();
    await page.locator(TODAY_CELL).click();

    const picked = await inputValue(page.locator(FIELD));

    expect(picked, "the field takes the day that was clicked").not.toBe("");
    await expect(readout(page), "and the owner holds the very same date").toHaveText(picked);
});

test("typing moves the calendar to the month it lands in", async ({ page, mount }) => {
    await mount("Essentials/DatePicker/Picked");
    await typeInto(page, "2027-03-09");
    await page.locator(TRIGGER).click();

    await expect(page.locator(day("9 March 2027")), "the popup opens on the value's own month").toHaveAttribute(
        "aria-selected",
        "true",
    );
});

test("the popup pages through the month it was handed", async ({ page, mount }) => {
    await mount("Essentials/DatePicker/Picked");
    await typeInto(page, "2027-03-09");
    await page.locator(TRIGGER).click();
    await page.locator("#nextPage").click();

    await expect(page.getByTestId("page")).toHaveText("2027-04-01");
    await expect(page.locator(day("9 April 2027"))).toHaveCount(1);
});

test("Escape closes the calendar, leaves the value alone and hands focus back to the field", async ({
    page,
    mount,
}) => {
    await mount("Essentials/DatePicker/Picked");
    await page.locator(TRIGGER).click();
    await page.locator(TODAY_CELL).click();

    const picked = await inputValue(page.locator(FIELD));

    await page.keyboard.press("Escape");

    await expect(page.locator(POPUP)).toHaveCount(0);
    await expect(readout(page), "the pick survives the dismissal").toHaveText(picked);
    await expect(page.locator(FIELD)).toBeFocused();
});

test("a press elsewhere closes the calendar without taking focus to the field", async ({ page, mount }) => {
    await mount("Essentials/DatePicker/Picked");
    await page.locator(TRIGGER).click();
    await expect(page.locator(POPUP)).toBeVisible();

    await page.getByTestId("elsewhere").click();

    await expect(page.locator(POPUP)).toHaveCount(0);
    await expect(page.getByTestId("elsewhere")).toBeFocused();
});

test("bounds refuse a date whether it is typed or picked", async ({ page, mount }) => {
    await mount("Essentials/DatePicker/Bounded");
    await typeInto(page, "2026-08-01");

    await expect(readout(page), "a typed date outside the range is not a value").toHaveText("none");

    await typeInto(page, "2026-08-12");

    await expect(readout(page), "one inside it is").toHaveText("2026-08-12");

    await page.locator(TRIGGER).click();

    await expect(page.locator(`${POPUP} [role="gridcell"][aria-disabled="true"]`)).toHaveCount(26);
});

test("a picker can refuse individual days, not only a range of them", async ({ page, mount }) => {
    await mount("Essentials/DatePicker/Weekdays");
    await page.locator(TRIGGER).click();

    await expect(page.locator(`${POPUP} [role="gridcell"]`)).toHaveCount(42);
    await expect(page.locator(`${POPUP} [role="gridcell"][aria-disabled="true"]`), "six weekends").toHaveCount(12);
});

test("the precision is handed to the calendar, so a pick there sets the first of the month", async ({
    page,
    mount,
}) => {
    await mount("Essentials/DatePicker/MonthPrecision");
    await page.locator(TRIGGER).click();

    await expect(page.locator(`${POPUP} [role="gridcell"]`), "a year of months").toHaveCount(12);

    await page.locator(`${POPUP} [role="gridcell"]`).nth(2).click();

    await expect(page.locator(FIELD)).toHaveValue(/^\d{4}-03-01$/);
});

test("a disabled picker refuses its trigger", async ({ page, mount }) => {
    await mount("Essentials/DatePicker/Picked", { isDisabled: true });

    await expect(page.locator(TRIGGER)).toHaveAttribute("aria-disabled", "true");

    await page.locator(TRIGGER).click({ force: true });

    await expect(page.locator(POPUP)).toHaveCount(0);
});
