import { expect, test } from "@playwright/test";

import { attributesOf, selectionRange } from "../helpers";

/**
 * The React `SegmentedInput`, a row of painted cells over one concealed `TextField`. The cases follow
 * `e2e/segmentedInput.spec.ts`, which covers the Solid one: one real field however many cells are drawn, typing and
 * pasting that keep only allowed characters and stop at the cell count, a press on a cell selecting that cell's
 * character, and the caret and selection handed to the painter rather than drawn by the field.
 *
 * A press on a cell is forced because the field lies over every cell, which is the design: the press lands on the
 * input, and the component works out which cell was under it.
 */
const FIELD = "#field";
const CELLS = '[aria-hidden="true"] > div';
const PAINTED = `${CELLS} > *`;

test("a one-time code field asks for digits and a code the platform can fill", async ({ mount }) => {
    const component = await mount("Essentials/SegmentedInput/OneTimeCode");

    await expect(component.locator(FIELD), "the platform is told this is a one-time code").toHaveAttribute(
        "autocomplete",
        "one-time-code",
    );
    await expect(component.locator(FIELD), "and a phone is asked for its digit keyboard").toHaveAttribute(
        "inputmode",
        "numeric",
    );
    await expect(component.locator(FIELD), "with a name of its own").toHaveAttribute("aria-label", "One-time code");
    await expect(component.locator("input"), "and it is one field, however many cells are drawn").toHaveCount(1);
});

test("typing fills the cells in order, keeps digits only and stops at six", async ({ page, mount }) => {
    const component = await mount("Essentials/SegmentedInput/OneTimeCode");

    await expect(component.locator(CELLS), "one cell per digit of the code").toHaveCount(6);

    await component.locator(FIELD).focus();
    await page.keyboard.type("1a2b3");

    await expect(component.locator(FIELD), "letters are refused").toHaveValue("123");
    await expect(component.locator('[data-readout="value"]'), "and the owner holds only the digits").toHaveText(
        'value: "123"',
    );
    await expect(component.locator(CELLS), "each cell shows the digit in its place").toHaveText([
        "1",
        "2",
        "3",
        "",
        "",
        "",
    ]);

    await page.keyboard.insertText("456789");

    await expect(component.locator(FIELD), "a paste past the end is cut at six digits").toHaveValue("123456");
    await expect(component.locator(CELLS)).toHaveText(["1", "2", "3", "4", "5", "6"]);
});

test("a pasted code fills every cell, separators and all dropped", async ({ page, mount }) => {
    const component = await mount("Essentials/SegmentedInput/OneTimeCode");

    await component.locator(FIELD).focus();
    await page.keyboard.insertText("123-456");

    await expect(component.locator(FIELD)).toHaveValue("123456");
    await expect(component.locator(CELLS), "every cell is filled").toHaveText(["1", "2", "3", "4", "5", "6"]);
});

test("pressing the third cell of a four-digit code and typing replaces the third digit alone", async ({
    page,
    mount,
}) => {
    const component = await mount("Essentials/SegmentedInput/OneTimeCode");

    await component.locator(FIELD).focus();
    await page.keyboard.type("1234");

    await component.locator(CELLS).nth(2).click({ force: true });

    await expect(component.locator(FIELD), "the press leaves focus in the field").toBeFocused();
    expect(await selectionRange(component.locator(FIELD)), "and selects the digit in that cell").toEqual({
        start: 2,
        end: 3,
    });

    await page.keyboard.type("9");

    await expect(component.locator(FIELD), "the fourth digit survives").toHaveValue("1294");
    await expect(component.locator(CELLS)).toHaveText(["1", "2", "9", "4", "", ""]);
});

test("pressing an empty cell puts the caret after the last digit", async ({ page, mount }) => {
    const component = await mount("Essentials/SegmentedInput/OneTimeCode");

    await component.locator(FIELD).focus();
    await page.keyboard.type("12");

    await component.locator(CELLS).nth(5).click({ force: true });

    expect(await selectionRange(component.locator(FIELD))).toEqual({ start: 2, end: 2 });
});

test("the painter is told which cell has the caret, and none once focus leaves", async ({ page, mount }) => {
    const component = await mount("Essentials/SegmentedInput/OneTimeCode");
    const carets = () => attributesOf(page, PAINTED, "data-has-caret");

    expect(await carets(), "unfocused, no cell has the caret").toEqual([null, null, null, null, null, null]);

    await component.locator(FIELD).focus();
    await page.keyboard.type("12");

    await expect
        .poll(carets, { message: "focused, the caret is in the cell the next digit lands in" })
        .toEqual([null, null, "true", null, null, null]);

    await page.keyboard.press("ArrowLeft");

    await expect
        .poll(carets, { message: "and it follows the arrow keys" })
        .toEqual([null, "true", null, null, null, null]);

    await component.locator(FIELD).blur();

    await expect
        .poll(carets, { message: "and none has it once focus leaves" })
        .toEqual([null, null, null, null, null, null]);
});

test("a selection is reported to the painter, by keyboard and by dragging across cells", async ({ page, mount }) => {
    const component = await mount("Essentials/SegmentedInput/OneTimeCode");
    const selected = () => attributesOf(page, PAINTED, "data-selected");

    await component.locator(FIELD).focus();
    await page.keyboard.type("12345");
    await page.keyboard.press("Shift+ArrowLeft");
    await page.keyboard.press("Shift+ArrowLeft");

    await expect
        .poll(selected, { message: "a keyboard selection marks the cells it covers" })
        .toEqual([null, null, null, "true", "true", null]);

    const first = (await component.locator(CELLS).nth(0).boundingBox())!;
    const third = (await component.locator(CELLS).nth(2).boundingBox())!;

    await page.mouse.move(first.x + first.width * 0.5, first.y + first.height * 0.5);
    await page.mouse.down();
    await page.mouse.move(third.x + third.width * 0.5, third.y + third.height * 0.5);
    await page.mouse.up();

    expect(await selectionRange(component.locator(FIELD)), "a drag selects the digits it crosses").toEqual({
        start: 0,
        end: 3,
    });
    await expect.poll(selected).toEqual(["true", "true", "true", null, null, null]);
});

test("a field that takes letters keeps letters and digits and refuses the rest", async ({ page, mount }) => {
    const component = await mount("Essentials/SegmentedInput/RecoveryCode");

    await component.locator(FIELD).focus();
    await page.keyboard.insertText("ab-12 cd!ef99");

    await expect(component.locator(FIELD), "cut at its eight cells").toHaveValue("ab12cdef");
    await expect(component.locator(FIELD), "and a phone is not asked for digits").toHaveAttribute("inputmode", "text");
});
