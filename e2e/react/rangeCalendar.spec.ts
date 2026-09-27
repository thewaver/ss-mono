import { type Page, expect, test } from "@playwright/test";

/**
 * The React `RangeCalendar`, over the React `CalendarComposite` and `RangeCalendarUtils`. The cases follow
 * `e2e/rangeCalendar.spec.ts`, which covers the Solid one: a first press starts a span without reporting one, the
 * second completes it as one ordered value, a third starts again, and a bounded calendar refuses both ends outside
 * its range. The band is read off data attributes the story's painter writes from the range flags, which is what
 * shows those flags reached the day renderer.
 */
const cell = '[role="gridcell"]';
const day = (label: string) => `${cell}[aria-label="${label}"]`;
const banded = `${cell} [data-in-range]`;

const readout = (page: Page) => page.locator('[data-readout="value"]');

test("one press starts a span without reporting one, because half a range is not a range", async ({ page, mount }) => {
    await mount("Essentials/RangeCalendar/Default");

    await expect(page.locator(banded), "nothing is banded before the first press").toHaveCount(0);

    await page.locator(day("10 August 2026")).click();

    await expect(readout(page), "a half-entered span is not reported").toHaveText("none");
    await expect(page.locator(banded), "the started end is still marked on the grid").toHaveCount(1);
});

test("the second press completes the span and reports it as one value", async ({ page, mount }) => {
    await mount("Essentials/RangeCalendar/Default");

    await page.locator(day("10 August 2026")).click();
    await page.locator(day("14 August 2026")).click();

    await expect(readout(page)).toHaveText("2026-08-10 to 2026-08-14");
    await expect(page.locator(banded), "both ends and the days between them are banded").toHaveCount(5);
    await expect(page.locator(`${cell} [data-range-start]`), "and the ends are marked apart").toHaveCount(1);
    await expect(page.locator(`${cell} [data-range-end]`)).toHaveCount(1);
    await expect(page.locator(`${cell}[aria-selected="true"]`), "both ends read as picked").toHaveCount(2);
});

test("picking the far end first gives the same span, because the value is ordered on the way out", async ({
    page,
    mount,
}) => {
    await mount("Essentials/RangeCalendar/Default");

    await page.locator(day("14 August 2026")).click();
    await page.locator(day("10 August 2026")).click();

    await expect(readout(page)).toHaveText("2026-08-10 to 2026-08-14");
});

test("a third press starts again rather than extending what is already there", async ({ page, mount }) => {
    await mount("Essentials/RangeCalendar/Default");

    await page.locator(day("10 August 2026")).click();
    await page.locator(day("14 August 2026")).click();
    await page.locator(day("18 August 2026")).click();

    await expect(readout(page), "the completed span is dropped, not extended").toHaveText("none");
    await expect(page.locator(banded), "only the newly started end is marked").toHaveCount(1);
});

test("the keyboard walk bands from the pending start to the day it is on", async ({ page, mount }) => {
    await mount("Essentials/RangeCalendar/Default");

    await page.locator(day("10 August 2026")).click();
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");

    await expect(page.locator(banded), "the band follows the highlight while a start is pending").toHaveCount(3);

    await page.keyboard.press("Enter");

    await expect(readout(page)).toHaveText("2026-08-10 to 2026-08-12");
});

test("a bounded calendar refuses both ends outside its range", async ({ page, mount }) => {
    await mount("Essentials/RangeCalendar/Bounded");

    await page.locator(day("3 August 2026")).dispatchEvent("click");

    await expect(readout(page), "a day before the minimum cannot start a span").toHaveText("none");
    await expect(page.locator(banded), "and nothing is marked as started").toHaveCount(0);

    await page.locator(day("6 August 2026")).click();
    await page.locator(day("25 August 2026")).dispatchEvent("click");

    await expect(readout(page), "a day past the maximum cannot finish one either").toHaveText("none");
});
