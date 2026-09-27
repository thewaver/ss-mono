import { type Page, expect, test } from "@playwright/test";

import { inputValue } from "../helpers";

/**
 * The React `TimeInput`, over the React `TextField`, `MaskedFieldReactUtils` and the shared `TimeInputUtils`. The cases
 * follow the typed-time half of `e2e/datePicker.spec.ts`, which covers the Solid one: a complete time reaches the
 * owner and an impossible one does not, the arrows step whichever segment the caret is in and select it, stepping
 * carries and wraps, a seconds field has a third segment, bounds refuse a typed time and clamp a stepped one, and a
 * twelve-hour field reads a twenty-four-hour value through a meridiem control in the trailing slot.
 */
const FIELD = "#field";
const TOGGLE = "#meridiem";

const readout = (page: Page) => page.locator('[data-readout="value"]');

const typeInto = async (page: Page, text: string) => {
    await page.locator(FIELD).click();
    await page.keyboard.press("ControlOrMeta+a");
    await page.keyboard.type(text, { delay: 15 });
};

const caretAt = (page: Page, at: number) =>
    page.locator(FIELD).evaluate((element, offset) => {
        (element as HTMLInputElement).setSelectionRange(offset, offset);
    }, at);

const selectionOf = (page: Page) =>
    page
        .locator(FIELD)
        .evaluate(
            (element) =>
                `${(element as HTMLInputElement).selectionStart}-${(element as HTMLInputElement).selectionEnd}`,
        );

test("a complete time reaches the owner, and an impossible one does not", async ({ page, mount }) => {
    await mount("Essentials/TimeInput/Default");
    await typeInto(page, "14:45");

    await expect(readout(page)).toHaveText("14:45");

    await typeInto(page, "24:00");

    await expect(readout(page), "there is no 24th hour").toHaveText("14:45");
    await expect(page.locator(FIELD), "and the field marks what it shows").toHaveAttribute("aria-invalid", "true");

    await typeInto(page, "09:60");

    await expect(readout(page), "nor a 60th minute").toHaveText("14:45");
});

test("the mask punctuates the digits as they are typed", async ({ page, mount }) => {
    await mount("Essentials/TimeInput/Default");
    await typeInto(page, "203");

    expect(await inputValue(page.locator(FIELD))).toBe("20:3");
});

test("the arrows step whichever segment the caret is in, and select it", async ({ page, mount }) => {
    await mount("Essentials/TimeInput/Default");
    await typeInto(page, "14:45");

    await caretAt(page, 0);
    await page.keyboard.press("ArrowUp");

    await expect(readout(page), "the caret in the hour steps the hour").toHaveText("15:45");
    await expect(page.locator(FIELD)).toHaveValue("15:45");
    expect(await selectionOf(page), "and the stepped segment is selected").toBe("0-2");

    await caretAt(page, 4);
    await page.keyboard.press("ArrowDown");

    await expect(readout(page), "the caret in the minute steps the minute").toHaveText("15:44");
    await expect(page.locator(FIELD)).toHaveValue("15:44");
    expect(await selectionOf(page)).toBe("3-5");
});

test("a run of presses keeps stepping the same segment", async ({ page, mount }) => {
    await mount("Essentials/TimeInput/Default");
    await page.locator(FIELD).click();
    await caretAt(page, 4);

    await page.keyboard.press("ArrowUp");
    await page.keyboard.press("ArrowUp");
    await page.keyboard.press("ArrowUp");

    await expect(readout(page)).toHaveText("09:33");
    await expect(page.locator(FIELD)).toHaveValue("09:33");
});

test("stepping carries between segments and wraps around the day", async ({ page, mount }) => {
    await mount("Essentials/TimeInput/Default");
    await typeInto(page, "09:59");
    await caretAt(page, 4);
    await page.keyboard.press("ArrowUp");

    await expect(readout(page), "a minute past 59 carries into the hour").toHaveText("10:00");

    await typeInto(page, "23:30");
    await caretAt(page, 0);
    await page.keyboard.press("ArrowUp");

    await expect(readout(page), "an hour past 23 wraps").toHaveText("00:30");
});

test("a seconds field has a third segment of its own", async ({ page, mount }) => {
    await mount("Essentials/TimeInput/Seconds");
    await page.locator(FIELD).click();
    await caretAt(page, 7);
    await page.keyboard.press("ArrowUp");

    await expect(readout(page)).toHaveText("09:30:01");
    await expect(page.getByTestId("placeholder")).toHaveCount(0);
});

test("bounds refuse a typed time and clamp a stepped one", async ({ page, mount }) => {
    await mount("Essentials/TimeInput/Shift");

    await expect(page.getByTestId("placeholder"), "an empty field hints at its segments").toHaveText("hh:mm");

    await typeInto(page, "08:00");

    await expect(readout(page), "before opening is not a value").toHaveText("none");

    await typeInto(page, "17:30");

    await expect(readout(page), "the closing time itself is").toHaveText("17:30");

    await caretAt(page, 0);
    await page.keyboard.press("ArrowUp");

    await expect(readout(page), "and stepping past the end clamps").toHaveText("17:30");
    expect(await selectionOf(page), "still selecting the segment").toBe("0-2");
});

test("a disabled field does not step", async ({ page, mount }) => {
    await mount("Essentials/TimeInput/Default", { isDisabled: true });

    await expect(page.locator(FIELD)).toHaveAttribute("aria-disabled", "true");

    await page.locator(FIELD).focus();
    await caretAt(page, 0);
    await page.keyboard.press("ArrowUp");

    await expect(readout(page)).toHaveText("09:30");
});

test.describe("a twelve-hour field", () => {
    test("reads a 24-hour value as twelve hours plus a half of the day", async ({ page, mount }) => {
        await mount("Essentials/TimeInput/TwelveHour");

        expect(await inputValue(page.locator(FIELD))).toBe("02:30");
        await expect(page.locator(TOGGLE)).toHaveAttribute("aria-label", "Before or after noon: PM");
        await expect(readout(page), "while the owner still holds 14:30").toHaveText("14:30");
    });

    test("the toggle moves the value by twelve hours without touching the text", async ({ page, mount }) => {
        await mount("Essentials/TimeInput/TwelveHour");
        await page.locator(TOGGLE).click();

        await expect(readout(page)).toHaveText("02:30");
        expect(await inputValue(page.locator(FIELD))).toBe("02:30");

        await page.locator(TOGGLE).click();

        await expect(readout(page)).toHaveText("14:30");
    });

    test("typing twelve-hour digits lands the hour the half of the day says", async ({ page, mount }) => {
        await mount("Essentials/TimeInput/TwelveHour");
        await typeInto(page, "09:15");

        await expect(readout(page), "nine fifteen in the afternoon").toHaveText("21:15");

        await page.locator(TOGGLE).click();

        await expect(readout(page), "and in the morning").toHaveText("09:15");
    });

    test("twelve o'clock is the case that catches an off-by-twelve", async ({ page, mount }) => {
        await mount("Essentials/TimeInput/TwelveHour");
        await typeInto(page, "12:00");

        await expect(readout(page), "12:00 pm is noon").toHaveText("12:00");

        await page.locator(TOGGLE).click();

        await expect(readout(page), "and 12:00 am is midnight").toHaveText("00:00");
    });

    test("refuses an hour a twelve-hour clock does not have", async ({ page, mount }) => {
        await mount("Essentials/TimeInput/TwelveHour");
        await typeInto(page, "13:00");

        await expect(readout(page)).toHaveText("14:30");
        await expect(page.locator(FIELD)).toHaveAttribute("aria-invalid", "true");
    });

    test("stepping the hour crosses noon and takes the half of the day with it", async ({ page, mount }) => {
        await mount("Essentials/TimeInput/TwelveHour");
        await typeInto(page, "11:30");
        await caretAt(page, 0);

        await expect(readout(page), "half past eleven in the evening").toHaveText("23:30");

        await page.keyboard.press("ArrowUp");

        await expect(readout(page), "stepping wraps around midnight").toHaveText("00:30");
        await expect(page.locator(TOGGLE), "and the toggle follows the value").toHaveAttribute(
            "aria-label",
            "Before or after noon: AM",
        );
        await expect(page.locator(FIELD), "with the text reading twelve, not zero").toHaveValue("12:30");
    });

    test("an empty field remembers the half of the day chosen before any digit", async ({ page, mount }) => {
        await mount("Essentials/TimeInput/EmptyTwelveHour");

        await page.locator(TOGGLE).click();
        await expect(page.locator(TOGGLE)).toHaveAttribute("aria-label", "Before or after noon: PM");

        await typeInto(page, "03:00");

        await expect(readout(page)).toHaveText("15:00");
    });
});
