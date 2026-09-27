import { type Page, expect, test } from "@playwright/test";

/**
 * The React `Clock`, over the React `InteractionWrapper` and the shared `ClockUtils`. The Solid one is covered through
 * its picker in `e2e/timePicker.spec.ts`; these carry over the cases that are the clock's own — a column per unit named
 * by `Intl`, a twelve-hour column running from twelve, a pick changing only its own unit, a stepped and bounded column,
 * the one tab stop walked by the arrows and committed by Enter — and add the walk flipping in a right-to-left box, the
 * fallback time pulled inside the bounds, and a disabled clock refusing every pick.
 */
const column = (name: string) => `[role="listbox"][aria-label="${name}"]`;
const option = (name: string, label: string) => `${column(name)} [role="option"][aria-label="${label}"]`;
const roving = '[role="option"][tabindex="0"]';

const readout = (page: Page) => page.locator('[data-readout="value"]');

const labelsOf = (page: Page, name: string) =>
    page
        .locator(`${column(name)} [role="option"]`)
        .evaluateAll((options) => options.map((element) => element.getAttribute("aria-label")));

test.describe("the clock's columns", () => {
    test("are one per unit, inside a group, and named by Intl", async ({ page, mount }) => {
        await mount("Essentials/Clock/Default");

        await expect(page.locator('[role="group"] [role="listbox"]'), "hours and minutes").toHaveCount(2);
        await expect(page.locator(column("hour"))).toBeVisible();
        await expect(page.locator(column("minute"))).toBeVisible();
    });

    test("gain an am/pm column when the clock reads twelve-hour, which runs from twelve", async ({ page, mount }) => {
        await mount("Essentials/Clock/TwelveHour");

        await expect(page.locator('[role="listbox"]')).toHaveCount(3);
        await expect(page.locator(column("am/pm"))).toBeVisible();
        expect(await labelsOf(page, "hour")).toEqual([
            "12",
            "01",
            "02",
            "03",
            "04",
            "05",
            "06",
            "07",
            "08",
            "09",
            "10",
            "11",
        ]);
    });

    test("gain a seconds column when seconds are offered", async ({ page, mount }) => {
        await mount("Essentials/Clock/Seconds");

        await expect(page.locator('[role="listbox"]')).toHaveCount(3);
        await expect(page.locator(column("second"))).toBeVisible();
    });
});

test("picking a unit changes that unit and leaves the rest, and marks the option selected", async ({ page, mount }) => {
    await mount("Essentials/Clock/Default");

    await page.locator(option("hour", "11")).click();

    await expect(readout(page), "the minute already held survives").toHaveText("11:30");
    await expect(page.locator(option("hour", "11"))).toHaveAttribute("aria-selected", "true");

    await page.locator(option("minute", "45")).click();

    await expect(readout(page)).toHaveText("11:45");
});

test("the am/pm column moves the value by twelve hours", async ({ page, mount }) => {
    await mount("Essentials/Clock/TwelveHour");

    await page.locator(option("am/pm", "am")).click();

    await expect(readout(page), "14:30 read as pm becomes 02:30 am").toHaveText("02:30");
});

test.describe("a stepped and bounded clock", () => {
    test("offers only the minutes it was given", async ({ page, mount }) => {
        await mount("Essentials/Clock/Booking");

        expect(await labelsOf(page, "minute")).toEqual(["00", "15", "30", "45"]);
    });

    test("refuses an hour that would land outside the bounds", async ({ page, mount }) => {
        await mount("Essentials/Clock/Booking");

        await expect(page.locator(option("hour", "08")), "before opening").toHaveAttribute("aria-disabled", "true");
        await expect(page.locator(option("hour", "10")), "inside opening hours").not.toHaveAttribute("aria-disabled");

        await page.locator(option("hour", "08")).click({ force: true });

        await expect(readout(page), "a disabled option does nothing at all").toHaveText("10:15");
    });

    test("with no value, starts from now pulled inside the bounds", async ({ page, mount }) => {
        await mount("Essentials/Clock/Empty");

        await expect(
            page.locator(`${column("hour")} ${roving}`),
            "ten at night is pulled back to closing",
        ).toHaveAttribute("aria-label", "17");
        await expect(
            page.locator(`${column("minute")} [role="option"]:not([aria-disabled])`),
            "so the minute column is not refused wholesale",
        ).not.toHaveCount(0);
    });
});

test("walks with the arrows and commits on Enter", async ({ page, mount }) => {
    await mount("Essentials/Clock/Default");

    await expect(page.locator(roving), "the whole clock is one tab stop").toHaveCount(1);

    await page.keyboard.press("Tab");
    await expect(page.locator(option("hour", "09"))).toBeFocused();

    await page.keyboard.press("ArrowDown");

    await expect(page.locator(option("hour", "10")), "the focus follows the highlight").toBeFocused();
    await expect(readout(page), "moving the highlight writes nothing").toHaveText("09:30");

    await page.keyboard.press("Enter");

    await expect(readout(page)).toHaveText("10:30");

    await page.keyboard.press("ArrowRight");
    await expect(page.locator(option("minute", "30")), "the next column reads the same time").toBeFocused();

    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");

    await expect(readout(page), "the second column commits its own unit").toHaveText("10:31");
});

test("Home and End go to the ends of a column, and up from the top wraps", async ({ page, mount }) => {
    await mount("Essentials/Clock/Default");

    await page.keyboard.press("Tab");
    await page.keyboard.press("End");
    await expect(page.locator(option("hour", "23"))).toBeFocused();

    await page.keyboard.press("Home");
    await expect(page.locator(option("hour", "00"))).toBeFocused();

    await page.keyboard.press("ArrowUp");
    await expect(page.locator(option("hour", "23")), "a column wraps").toBeFocused();
});

test("in a right-to-left box the left arrow crosses to the next column", async ({ page, mount }) => {
    await mount("Essentials/Clock/RightToLeft");

    await page.keyboard.press("Tab");
    await expect(page.locator(option("hour", "09"))).toBeFocused();

    await page.keyboard.press("ArrowLeft");
    await expect(page.locator(option("minute", "30"))).toBeFocused();

    await page.keyboard.press("ArrowRight");
    await expect(page.locator(option("hour", "09"))).toBeFocused();
});

test("a disabled clock refuses every pick without a native attribute", async ({ page, mount }) => {
    await mount("Essentials/Clock/Default", { isDisabled: true });

    await expect(page.locator('[role="group"]')).toHaveAttribute("aria-disabled", "true");
    await expect(page.locator("[disabled]")).toHaveCount(0);

    await page.locator(option("hour", "11")).dispatchEvent("click");

    await expect(readout(page)).toHaveText("09:30");
});
