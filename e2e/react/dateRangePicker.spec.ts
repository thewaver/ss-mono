import { type Page, expect, test } from "@playwright/test";

import { inputValue } from "../helpers";

/**
 * The React `DateRangePicker`: two React `DateInput`s over one range through `SignalMirrorReactUtils.useSplit` and the
 * shared `DateRangePickerUtils`, with the React `RangeCalendar` in a popup. The cases follow `e2e/dateRangePicker.spec.ts`,
 * which covers the Solid one: a start alone is not a value, both fields report one ordered range, clearing a field
 * clears the value and retyping it brings the range back, a span picked in the calendar fills both fields, a bounded
 * picker refuses a day outside its range — and the ids and names suffixed per field, and Escape returning focus to
 * the end field.
 */
const START = "#range-start";
const END = "#range-end";
const TRIGGER = "#trigger";
const POPUP = '[role="dialog"]';

const readout = (page: Page) => page.locator('[data-readout="value"]');

const typeInto = async (page: Page, selector: string, digits: string) => {
    await page.locator(selector).click();
    await page.keyboard.type(digits, { delay: 15 });
};

test("the two fields take the id and name suffixed, so nothing lands on two elements", async ({ page, mount }) => {
    await mount("Essentials/DateRangePicker/Picked");

    await expect(page.locator(START)).toHaveAttribute("name", "stay-start");
    await expect(page.locator(END)).toHaveAttribute("name", "stay-end");
    await expect(page.locator(START)).toHaveAttribute("aria-label", "Start date");
    await expect(page.locator(END)).toHaveAttribute("aria-label", "End date");
    await expect(page.getByTestId("separator"), "with the separator drawn between them").toBeVisible();
});

test("a start on its own is a filled field but not a value", async ({ page, mount }) => {
    await mount("Essentials/DateRangePicker/Picked");
    await typeInto(page, START, "20260810");

    await expect(page.locator(START)).toHaveValue("2026-08-10");
    await expect(readout(page), "half a range is not reported outwards").toHaveText("none");
});

test("filling both fields reports the pair as one value", async ({ page, mount }) => {
    await mount("Essentials/DateRangePicker/Picked");
    await typeInto(page, START, "20260810");
    await typeInto(page, END, "20260814");

    await expect(readout(page)).toHaveText("2026-08-10 to 2026-08-14");
});

test("the ends are ordered on the way out, whichever field holds the later date", async ({ page, mount }) => {
    await mount("Essentials/DateRangePicker/Picked");
    await typeInto(page, START, "20260814");
    await typeInto(page, END, "20260810");

    await expect(readout(page)).toHaveText("2026-08-10 to 2026-08-14");
});

test("clearing one field clears the value, and retyping it brings the range back", async ({ page, mount }) => {
    await mount("Essentials/DateRangePicker/Picked");
    await typeInto(page, START, "20260810");
    await typeInto(page, END, "20260814");

    await expect(readout(page)).toHaveText("2026-08-10 to 2026-08-14");

    await page.locator(END).fill("");
    await page.locator(END).blur();

    await expect(readout(page), "half a range is not a range on the way back down either").toHaveText("none");
    await expect(page.locator(START), "and the other half is left standing").toHaveValue("2026-08-10");

    await typeInto(page, END, "20260816");

    await expect(readout(page)).toHaveText("2026-08-10 to 2026-08-16");
});

test("a span picked in the calendar fills both fields", async ({ page, mount }) => {
    await mount("Essentials/DateRangePicker/Picked");
    await page.locator(TRIGGER).click();

    const days = page.locator(`${POPUP} [role="gridcell"]:not([aria-disabled="true"])`);

    await days.nth(0).click();
    await days.nth(4).click();

    const start = await inputValue(page.locator(START));
    const end = await inputValue(page.locator(END));

    expect(start).not.toBe("");
    expect(end.localeCompare(start), "the later click lands in the end field").toBeGreaterThan(0);
    await expect(readout(page)).toHaveText(`${start} to ${end}`);
});

test("Escape closes the calendar and hands focus to the end field", async ({ page, mount }) => {
    await mount("Essentials/DateRangePicker/Picked");
    await page.locator(TRIGGER).click();
    await expect(page.locator(POPUP)).toBeVisible();

    await page.keyboard.press("Escape");

    await expect(page.locator(POPUP)).toHaveCount(0);
    await expect(page.locator(END)).toBeFocused();
});

test("a bounded picker refuses a day outside its range", async ({ page, mount }) => {
    await mount("Essentials/DateRangePicker/Bounded");
    await typeInto(page, START, "20260810");
    await page.locator(TRIGGER).click();

    const refused = page.locator(`${POPUP} [role="gridcell"][aria-disabled="true"]`).first();

    await expect(refused).toBeAttached();

    await refused.dispatchEvent("click");

    await expect(readout(page), "a day outside the bounds starts nothing").toHaveText("none");
});
