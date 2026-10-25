import { type Page, expect, test } from "@playwright/test";

import { docsDemo, docsSettled, inputValue } from "./helpers";

/**
 * The date and time picker's page is its Docs view. The basic example is the picker itself, empty; "two fields of
 * your own" is a plain `DateInput` and `TimeInput` sharing one value through the split the picker is built on,
 * starting from a value. Both show the value in a line under the fields, matched by the value it states, never by
 * the words before it.
 */
const DOCS = "/src/App/Pages/DateTimePickerPage/Docs";

const PICKED = docsDemo(DOCS, "Basic");
const PAIRED = docsDemo(DOCS, "Paired");

const DIALOG = '[role="dialog"]';

/**
 * The day the calendar itself marks as today, rather than a date written down here, so the spec does not depend on
 * which day the page was built to treat as today.
 */
const TODAY_CELL = '[role="gridcell"][aria-current="date"]';

/**
 * The two fields are a date field and a time field, side by side and in that order, so they are found by position:
 * the claim under test is that both are driven by one value, not that either is labeled a particular way.
 */
const field = (scope: string, index: number) => `${scope} input >> nth=${index}`;
const trigger = (id: string) => `#${id}`;

const readout = (page: Page, scope: string) => page.locator(`${scope} [data-readout]`);

const DATE_TIME = /\d{4}-\d{2}-\d{2} at \d{2}:\d{2}/;

/**
 * Whatever the field held is selected before the digits are typed, so they replace it rather than landing at
 * whatever position the caret happened to be.
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
    await page.goto("/date-time-picker/docs");
    await expect(page.locator(field(PICKED, 0))).toBeVisible();
    await docsSettled(page);
});

/**
 * The decision behind this: one signal owns the pair, and a pair with a half missing is not a value. That is
 * the same rule the range calendar follows, and it is the difference from two signals, where the consumer
 * would be holding a date and an absent time and deciding for itself what that combination meant.
 */
test("one half on its own is not a value", async ({ page }) => {
    await typeInto(page, field(PICKED, 0), "20260810");

    await expect(page.locator(field(PICKED, 0)), "the date field shows what was typed").toHaveValue("2026-08-10");
    await expect(readout(page, PICKED), "but a date without a time is not a date-time").not.toContainText(DATE_TIME);
});

test("the two halves land in one value rather than two", async ({ page }) => {
    await typeInto(page, field(PICKED, 0), "20260810");
    await typeInto(page, field(PICKED, 1), "0930");

    await expect(readout(page, PICKED)).toContainText("2026-08-10 at 09:30");
});

test("an existing value shows up in both fields at once", async ({ page }) => {
    const [date, time] = ((await readout(page, PAIRED).textContent()) ?? "").match(DATE_TIME)?.[0].split(" at ") ?? [];

    expect(date, "the example starts from a value").toBeDefined();

    await expect(page.locator(field(PAIRED, 0)), "the date half reaches the date field").toHaveValue(date!);
    await expect(page.locator(field(PAIRED, 1)), "and the time half reaches the time field").toHaveValue(time!);
});

/**
 * Writing one half must not disturb the other, which is the whole job of the split: the date field's setter
 * rebuilds the pair rather than replacing it.
 */
test("editing one half leaves the other where it was", async ({ page }) => {
    const time = await inputValue(page.locator(field(PAIRED, 1)));

    await typeInto(page, field(PAIRED, 0), "20260814");

    await expect(readout(page, PAIRED), "the time survives a change of date").toContainText(`2026-08-14 at ${time}`);
});

/**
 * Clearing either field clears the whole value. That is the honest reading of a pair held as one value: there
 * is no state in which the value exists with half of it missing, so the alternative would be inventing one.
 */
test("clearing one half clears the value, because there is no half a value", async ({ page }) => {
    await clear(page, field(PAIRED, 0));

    await expect(readout(page, PAIRED)).not.toContainText(DATE_TIME);
});

/**
 * The other half is still on screen after a clear, so typing the cleared one again has to bring the whole value
 * back rather than leave the visible half with nothing behind it.
 */
test("typing a cleared half again brings the other half back", async ({ page }) => {
    const time = await inputValue(page.locator(field(PAIRED, 1)));

    await clear(page, field(PAIRED, 0));
    await expect(readout(page, PAIRED)).not.toContainText(DATE_TIME);

    await typeInto(page, field(PAIRED, 0), "20260814");

    await expect(readout(page, PAIRED), "the time the other field still shows is part of it again").toContainText(
        `2026-08-14 at ${time}`,
    );
});

/**
 * `DateTimePicker` is the control over the same value: two fields, each with its own popup, and one signal
 * underneath. These check the seam rather than the two pickers, which have their own specs — that both
 * popups write into the one value, and that neither half alone amounts to one.
 */
test("the calendar fills only the date half, so the value is still incomplete", async ({ page }) => {
    await page.locator(trigger("basicDateTrigger")).click();

    const dialog = page.locator(DIALOG);

    await expect(dialog).toBeVisible();

    await dialog.locator(TODAY_CELL).click();

    await expect(page.locator(field(PICKED, 0)), "the date field takes the pick").not.toHaveValue("");
    await expect(readout(page, PICKED), "but a date without a time is not a date-time").not.toContainText(DATE_TIME);
});

test("the clock completes the value the calendar started", async ({ page }) => {
    await page.locator(trigger("basicDateTrigger")).click();

    const dialog = page.locator(DIALOG);

    await dialog.locator(TODAY_CELL).click();

    const date = await inputValue(page.locator(field(PICKED, 0)));

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();

    await page.locator(trigger("basicTimeTrigger")).click();
    await expect(dialog).toBeVisible();

    await dialog.locator('[role="listbox"][aria-label="hour"] [role="option"][aria-label="09"]').click();

    await expect(readout(page, PICKED), "both popups write into the one value").toContainText(`${date} at 09`);
});

test("the two popups are separate layers, so opening one closes nothing of the other's", async ({ page }) => {
    const dialog = page.locator(DIALOG);

    await page.locator(trigger("basicDateTrigger")).click();

    await expect(dialog.locator('[role="grid"]'), "the calendar is the open layer").toBeVisible();

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();

    await page.locator(trigger("basicTimeTrigger")).click();

    await expect(dialog.locator('[role="option"]').first(), "and the clock is the next one").toBeVisible();
    await expect(dialog.locator('[role="grid"]'), "with no calendar left behind it").toHaveCount(0);
});
