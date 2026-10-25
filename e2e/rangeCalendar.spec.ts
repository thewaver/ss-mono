import { type Page, expect, test } from "@playwright/test";

import { docsDemo, docsSettled } from "./helpers";

/**
 * The range calendar's page is its Docs view. The basic example shows its value in a line under the grid; the
 * bounded and two-month ones show none, so what they hold is read off the band the painter draws.
 */
const DOCS = "/src/App/Pages/RangeCalendarPage/Docs";

const BASIC = docsDemo(DOCS, "Basic");
const BOUNDED = docsDemo(DOCS, "Bounded");
const TWO_MONTHS = docsDemo(DOCS, "TwoMonths");

/**
 * Days are located by their accessible name rather than by their text, for the reason `calendar.spec.ts`
 * gives: the painter draws a bare number and the neighboring months repeat it.
 */
const cell = (scope: string) => `${scope} [role="gridcell"]`;
const day = (scope: string, label: string) => `${cell(scope)}[aria-label="${label}"]`;

/**
 * The band is read off a data attribute the painter writes rather than off a class name or a color: a
 * production build hashes the class away, and a computed background also catches the hover and the selected
 * gradient, which are different states that happen to paint. The attribute asserts the thing that actually
 * crosses the boundary — that the three range flags reached the day renderer.
 */
const banded = (scope: string) => `${cell(scope)} [data-in-range]`;

const readout = (page: Page, scope: string) => page.locator(`${scope} [data-readout]`);

/** The span the basic example's line states, as its two ends in the order written. */
const SPAN = /(\d{4}-\d{2}-\d{2}) to (\d{4}-\d{2}-\d{2})/;

test.beforeEach(async ({ page }) => {
    await page.goto("/range-calendar/docs");
    await expect(page.locator(`${BASIC} [role="grid"]`)).toBeVisible();
    await docsSettled(page);
});

/**
 * The whole point of the decision behind this component: the consumer holds one signal, and the state while
 * only the first end has been picked is the component's. So a first press must not report a range outwards —
 * there isn't one yet — while still showing the reader that a pick is under way.
 */
test("one press starts a span without reporting one, because half a range is not a range", async ({ page }) => {
    await expect(page.locator(banded(BASIC)), "nothing is banded before the first press").toHaveCount(0);

    await page.locator(day(BASIC, "10 August 2026")).click();

    await expect(page.locator(banded(BASIC)), "the started end is marked on the grid").toHaveCount(1);
    await expect(readout(page, BASIC), "but a half-entered span is not reported to the consumer").not.toContainText(
        SPAN,
    );
});

test("the second press completes the span and reports it as one value", async ({ page }) => {
    await page.locator(day(BASIC, "10 August 2026")).click();
    await page.locator(day(BASIC, "14 August 2026")).click();

    await expect(readout(page, BASIC), "the pair arrives as one value, both ends at once").toContainText(
        "2026-08-10 to 2026-08-14",
    );

    await expect(page.locator(banded(BASIC)), "both ends and the days between them are banded").toHaveCount(5);
    await expect(page.locator(`${cell(BASIC)} [data-range-start]`), "and the ends are marked apart").toHaveCount(1);
    await expect(page.locator(`${cell(BASIC)} [data-range-end]`)).toHaveCount(1);
});

/**
 * Picking backwards is the case a consumer hits by accident, and it is the reason the value is ordered by the
 * component rather than by whoever reads it. The span is the same span either way round.
 */
test("picking the far end first gives the same span, because the value is ordered on the way out", async ({ page }) => {
    await page.locator(day(BASIC, "14 August 2026")).click();
    await page.locator(day(BASIC, "10 August 2026")).click();

    await expect(readout(page, BASIC)).toContainText("2026-08-10 to 2026-08-14");
});

test("a third press starts again rather than extending what is already there", async ({ page }) => {
    await page.locator(day(BASIC, "10 August 2026")).click();
    await page.locator(day(BASIC, "14 August 2026")).click();

    await expect(readout(page, BASIC)).toContainText("2026-08-10 to 2026-08-14");

    await page.locator(day(BASIC, "18 August 2026")).click();

    await expect(readout(page, BASIC), "the completed span is dropped, not extended").not.toContainText(SPAN);
    await expect(page.locator(banded(BASIC)), "only the newly started end is marked").toHaveCount(1);
});

/**
 * The bounds are the calendar's own, so a range cannot be started or finished outside them. A span has two chances
 * to escape a bound where a single date has one, so both ends are tried; the example shows no value, so what it
 * holds is read off the band.
 */
test("a bounded calendar refuses both ends outside its range", async ({ page }) => {
    await page.locator(day(BOUNDED, "3 August 2026")).dispatchEvent("click");

    await expect(page.locator(banded(BOUNDED)), "a day before the minimum starts nothing").toHaveCount(0);

    await page.locator(day(BOUNDED, "6 August 2026")).click();

    await expect(page.locator(banded(BOUNDED)), "a day inside it does").toHaveCount(1);

    await page.locator(day(BOUNDED, "25 August 2026")).dispatchEvent("click");

    await expect(
        page.locator(`${day(BOUNDED, "25 August 2026")} [data-in-range]`),
        "and a day past the maximum cannot finish the span",
    ).toHaveCount(0);
    await expect(page.locator(banded(BOUNDED)), "which is still only started").toHaveCount(1);
});

/**
 * Two months shown at once are one calendar, not two: one tab stop, an arrow walk that runs off the end of one month
 * into the next grid, and page keys that move both. Each day is drawn once — the trailing days of the first month's
 * grid are left blank, since the second grid already shows them — which is also what keeps every day's name, and so
 * every locator here, unique.
 */
const gridLabels = (page: Page) =>
    page
        .locator(`${TWO_MONTHS} [role="grid"]`)
        .evaluateAll((grids) => grids.map((grid) => grid.getAttribute("aria-label")));

test("two months sit side by side, and each day is drawn in its own month only", async ({ page }) => {
    await expect(page.locator(`${TWO_MONTHS} [role="grid"]`)).toHaveCount(2);

    const labels = await page
        .locator(`${cell(TWO_MONTHS)}[aria-label]`)
        .evaluateAll((cells) => cells.map((cell) => cell.getAttribute("aria-label")));

    expect(new Set(labels).size, "no day appears twice across the two grids").toBe(labels.length);
});

test("the arrow walk runs from the end of the first month into the second grid", async ({ page }) => {
    const before = await gridLabels(page);

    await page.locator(day(TWO_MONTHS, "31 August 2026")).click();
    await page.keyboard.press("ArrowRight");

    await expect(
        page.locator(`${TWO_MONTHS} [role="grid"]`).nth(1).locator(":focus"),
        "the next day is focused in the second grid",
    ).toHaveCount(1);
    expect(await gridLabels(page), "and neither grid moved, since that day was already shown").toEqual(before);
});

test("the page keys step both months at once", async ({ page }) => {
    const before = await gridLabels(page);

    await page.locator(day(TWO_MONTHS, "10 August 2026")).click();
    await page.keyboard.press("PageDown");

    await expect.poll(() => gridLabels(page)).not.toEqual(before);

    expect((await gridLabels(page))[0], "the first grid does not just take the second one's month").not.toBe(before[1]);
});
