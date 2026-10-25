import { type Page, expect, test } from "@playwright/test";

import { docsDemo, docsSettled, inputValue } from "./helpers";

/**
 * The date range picker's page is its Docs view. The basic and bounded examples show the range they hold in a line
 * under the fields; that line is matched by the span it states, never by the words before it.
 */
const DOCS = "/src/App/Pages/DateRangePickerPage/Docs";

const DAYS_APART = 4;

const PICKED = docsDemo(DOCS, "Basic");
const BOUNDED = docsDemo(DOCS, "Bounded");

/**
 * Both fields belong to the one picker, so they are found by position within it rather than by label — the
 * labels are editorial, and the thing being asserted is that the first field is the start and the second the
 * end, which is a structural claim.
 */
const field = (scope: string, index: number) => `${scope} input >> nth=${index}`;
const trigger = (key: string) => `#${key}Trigger`;

const readout = (page: Page, scope: string) => page.locator(`${scope} [data-readout]`);

const SPAN = /\d{4}-\d{2}-\d{2} to \d{4}-\d{2}-\d{2}/;

/**
 * The fields take ISO digits, which is `DateInput`'s default format, and the mask inserts the separators —
 * so a spec types eight digits and reads back a formatted string. Whatever the field held is selected first,
 * so the digits replace it.
 */
const typeInto = async (page: Page, selector: string, digits: string) => {
    await page.locator(selector).click();
    await page.keyboard.press("ControlOrMeta+a");
    await page.keyboard.type(digits, { delay: 15 });
};

/** Empties a field the way a person does — select it all, delete, move on — so the field is left, too. */
const clear = async (page: Page, selector: string) => {
    await page.locator(selector).click();
    await page.keyboard.press("ControlOrMeta+a");
    await page.keyboard.press("Backspace");
    await page.keyboard.press("Tab");
};

test.beforeEach(async ({ page }) => {
    await page.goto("/date-range-picker/docs");
    await expect(page.locator(field(PICKED, 0))).toBeVisible();
    await docsSettled(page);
});

/**
 * The decision this component exists to carry: the consumer holds one signal. So a start on its own is not a
 * value, however complete that field looks on screen — which is the difference between this and two date
 * fields a consumer wires together, where a half-filled pair is something the consumer has to handle.
 */
test("a start on its own is a filled field but not a value", async ({ page }) => {
    await typeInto(page, field(PICKED, 0), "20260810");

    await expect(page.locator(field(PICKED, 0)), "the field shows what was typed").toHaveValue("2026-08-10");
    await expect(readout(page, PICKED), "but half a range is not reported outwards").not.toContainText(SPAN);
});

test("filling both fields reports the pair as one value", async ({ page }) => {
    await typeInto(page, field(PICKED, 0), "20260810");
    await typeInto(page, field(PICKED, 1), "20260814");

    await expect(readout(page, PICKED), "the two fields resolve to a single { start, end }").toContainText(
        "2026-08-10 to 2026-08-14",
    );
});

/**
 * Typing the later date into the start field is the case a consumer reaches by editing an existing range.
 * The value is ordered on the way out, so the pair is a span rather than a record of which box was typed in.
 */
test("the ends are ordered on the way out, whichever field holds the later date", async ({ page }) => {
    await typeInto(page, field(PICKED, 0), "20260814");
    await typeInto(page, field(PICKED, 1), "20260810");

    await expect(readout(page, PICKED)).toContainText("2026-08-10 to 2026-08-14");
});

test("clearing one field clears the value, because the pair is one value", async ({ page }) => {
    await typeInto(page, field(PICKED, 0), "20260810");
    await typeInto(page, field(PICKED, 1), "20260814");

    await expect(readout(page, PICKED)).toContainText("2026-08-10 to 2026-08-14");

    await clear(page, field(PICKED, 1));

    await expect(readout(page, PICKED), "half a range is not a range on the way back down either").not.toContainText(
        SPAN,
    );
});

/**
 * Clearing a half empties the value but must not empty the other half behind the user's back: the start field
 * still shows its date, so retyping the end is a complete pair again and has to be reported as one.
 */
test("retyping a cleared field brings the range back", async ({ page }) => {
    await typeInto(page, field(PICKED, 0), "20260810");
    await typeInto(page, field(PICKED, 1), "20260814");

    await expect(readout(page, PICKED)).toContainText("2026-08-10 to 2026-08-14");

    await clear(page, field(PICKED, 1));

    await expect(readout(page, PICKED)).not.toContainText(SPAN);
    await expect(page.locator(field(PICKED, 0)), "the start field keeps its date").toHaveValue("2026-08-10");

    await typeInto(page, field(PICKED, 1), "20260816");

    await expect(
        readout(page, PICKED),
        "the start the field still shows and the retyped end are one range again",
    ).toContainText("2026-08-10 to 2026-08-16");
});

/**
 * The calendar in the popup and the two fields are two ways into the same signal, so a span picked in the
 * grid has to arrive in the fields. This is the pairing that would break first if the value were two signals.
 */
test("a span picked in the calendar fills both fields", async ({ page }) => {
    await page.locator(trigger("basic")).click();

    const grid = page.locator('[role="dialog"] [role="grid"]');

    await expect(grid).toBeVisible();

    const days = grid.locator('[role="gridcell"]:not([aria-disabled="true"])');

    expect(await days.count(), "the open month offers days to pick between").toBeGreaterThan(DAYS_APART);

    await days.nth(0).click();
    await days.nth(DAYS_APART).click();

    const start = await inputValue(page.locator(field(PICKED, 0)));
    const end = await inputValue(page.locator(field(PICKED, 1)));

    expect(start, "the start field takes an end of the span").not.toBe("");
    expect(end.localeCompare(start), "and the later click lands in the end field").toBeGreaterThan(0);
    await expect(readout(page, PICKED), "the owner holds the span the two fields show").toContainText(
        `${start} to ${end}`,
    );
});

test("a bounded picker refuses a day outside its range", async ({ page }) => {
    await page.locator(trigger("bounded")).click();

    const grid = page.locator('[role="dialog"] [role="grid"]');

    await expect(grid).toBeVisible();

    const refused = grid.locator('[role="gridcell"][aria-disabled="true"]').first();

    await expect(refused, "the calendar marks the days its own bounds exclude").toBeAttached();

    await refused.dispatchEvent("click");

    await expect(
        grid.locator('[role="gridcell"] [data-in-range]'),
        "a day outside the bounds starts nothing on the grid",
    ).toHaveCount(0);
    await expect(readout(page, BOUNDED), "nor reaches the owner").not.toContainText(SPAN);
});

/**
 * The bounds are not written here: a start typed before them is held as typed, and leaving the field moves it
 * forward, to a day the calendar allows.
 */
test("a date typed outside the bounds is kept as typed and moved inside on leaving", async ({ page }) => {
    await typeInto(page, field(BOUNDED, 0), "20260801");

    await expect(page.locator(field(BOUNDED, 0)), "the typed start is kept as typed").toHaveValue("2026-08-01");

    await page.keyboard.press("Tab");

    await expect(page.locator(field(BOUNDED, 0)), "until the field is left").not.toHaveValue("2026-08-01");

    const start = await inputValue(page.locator(field(BOUNDED, 0)));

    expect(start > "2026-08-01", "and it moves forward, to the start of the range").toBe(true);

    await typeInto(page, field(BOUNDED, 1), "20260812");

    await expect(readout(page, BOUNDED), "the moved start is the start of the value").toContainText(
        `${start} to 2026-08-12`,
    );
});
