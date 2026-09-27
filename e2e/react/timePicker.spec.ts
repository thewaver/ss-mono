import { type Page, expect, test } from "@playwright/test";

/**
 * The React `TimePicker`: the React `TimeInput` with the React `Clock` in a React `Popover`, opened by a
 * `PopupTrigger` it owns in the field's trailing slot beside whatever the consumer puts there. The cases follow
 * `e2e/timePicker.spec.ts`, which covers the Solid one: the clock's columns per unit, twelve-hour columns running from
 * twelve, picking one unit leaving the rest, the meridiem control sharing the trailing slot with the trigger, a stepped
 * and bounded clock, and the one-tab-stop walk committed on Enter — plus Escape returning focus to the field.
 */
const FIELD = "#field";
const TRIGGER = "#trigger";
const POPUP = '[role="dialog"]';

const column = (name: string) => `${POPUP} [role="listbox"][aria-label="${name}"]`;
const option = (name: string, label: string) => `${column(name)} [role="option"][aria-label="${label}"]`;

const readout = (page: Page) => page.locator('[data-readout="value"]');

const openClock = async (page: Page) => {
    await page.locator(TRIGGER).click();
    await expect(page.locator(POPUP)).toBeVisible();
};

test.describe("the clock's columns", () => {
    test("are one per unit the field shows, in a dialog named for the clock", async ({ page, mount }) => {
        await mount("Essentials/TimePicker/Clocked");
        await openClock(page);

        await expect(page.locator(POPUP)).toHaveAttribute("aria-label", "Choose a time");
        await expect(page.locator(`${POPUP} [role="listbox"]`)).toHaveCount(2);
        await expect(page.locator(column("hour"))).toBeVisible();
        await expect(page.locator(column("minute"))).toBeVisible();
    });

    test("gain an am/pm column that runs from twelve when the field reads twelve-hour", async ({ page, mount }) => {
        await mount("Essentials/TimePicker/ClockedTwelve");
        await openClock(page);

        await expect(page.locator(`${POPUP} [role="listbox"]`)).toHaveCount(3);
        await expect(page.locator(column("am/pm"))).toBeVisible();

        const labels = await page
            .locator(`${column("hour")} [role="option"]`)
            .evaluateAll((options) => options.map((element) => element.getAttribute("aria-label")));

        expect(labels.slice(0, 3)).toEqual(["12", "01", "02"]);
    });
});

test("picking a unit changes that unit and leaves the rest, in the field too", async ({ page, mount }) => {
    await mount("Essentials/TimePicker/Clocked");
    await openClock(page);

    await page.locator(option("hour", "11")).click();

    await expect(readout(page), "the minute the field already held survives").toHaveText("11:30");
    await expect(page.locator(FIELD)).toHaveValue("11:30");

    await page.locator(option("minute", "45")).click();

    await expect(readout(page)).toHaveText("11:45");
});

test("the am/pm control and the clock trigger share the trailing slot", async ({ page, mount }) => {
    await mount("Essentials/TimePicker/ClockedTwelve");

    await expect(page.locator('[aria-label^="Before or after noon"]')).toBeVisible();
    await expect(page.locator(TRIGGER)).toBeVisible();
    await expect(page.getByTestId("trigger-content"), "the trigger's painter is handed the meridiem").toHaveText(
        "Open pm",
    );

    await openClock(page);
    await page.locator(option("am/pm", "am")).click();

    await expect(readout(page), "14:30 read as pm becomes 02:30 am").toHaveText("02:30");
});

test.describe("a stepped and bounded clock", () => {
    test("offers only the minutes it was given", async ({ page, mount }) => {
        await mount("Essentials/TimePicker/Booking");
        await openClock(page);

        const labels = await page
            .locator(`${column("minute")} [role="option"]`)
            .evaluateAll((options) => options.map((element) => element.getAttribute("aria-label")));

        expect(labels).toEqual(["00", "15", "30", "45"]);
    });

    test("refuses an hour that would land outside the bounds", async ({ page, mount }) => {
        await mount("Essentials/TimePicker/Booking");
        await openClock(page);

        await expect(page.locator(option("hour", "08"))).toHaveAttribute("aria-disabled", "true");
        await expect(page.locator(option("hour", "10"))).not.toHaveAttribute("aria-disabled");

        await page.locator(option("hour", "08")).click({ force: true });

        await expect(readout(page)).toHaveText("10:15");
    });
});

test("walks with the arrows and commits on Enter", async ({ page, mount }) => {
    await mount("Essentials/TimePicker/Clocked");
    await openClock(page);

    await page.keyboard.press("Tab");
    await expect(page.locator(option("hour", "09"))).toBeFocused();

    await page.keyboard.press("ArrowDown");

    await expect(readout(page), "moving the highlight writes nothing").toHaveText("09:30");

    await page.keyboard.press("Enter");

    await expect(readout(page)).toHaveText("10:30");

    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");

    await expect(readout(page), "the second column commits its own unit").toHaveText("10:31");
});

test("Escape closes the clock and hands focus back to the field", async ({ page, mount }) => {
    await mount("Essentials/TimePicker/Clocked");
    await openClock(page);

    await page.keyboard.press("Escape");

    await expect(page.locator(POPUP)).toHaveCount(0);
    await expect(page.locator(FIELD)).toBeFocused();
});

test("a disabled picker refuses its trigger", async ({ page, mount }) => {
    await mount("Essentials/TimePicker/Clocked", { isDisabled: true });

    await page.locator(TRIGGER).click({ force: true });

    await expect(page.locator(POPUP)).toHaveCount(0);
});
