import { type Page, expect, test } from "@playwright/test";

import { attributesOf, docsDemo, docsSettled, inputValue, selectionRange } from "./helpers";

const DOCS = "/src/App/Pages/SegmentedInputPage/Docs";

const BASIC = docsDemo(DOCS, "Basic");
const RTL = docsDemo(DOCS, "RightToLeft");
const ONE_TIME_CODE = `${BASIC} input`;
const RECOVERY_CODE = `${docsDemo(DOCS, "Letters")} input`;
const LABELED = `${docsDemo(DOCS, "Labeled")} input`;

/**
 * The component wraps each cell the painter draws in a box of its own, inside a row hidden from assistive
 * technology. Those boxes are what a spec clicks and reads: their text is whatever the painter drew for the
 * character, and the painter's own element inside carries the state it was handed.
 */
const cells = (scope: string) => `${scope} [aria-hidden="true"] > div`;
const CODE_CELLS = cells(BASIC);
const CODE_PAINTED = `${CODE_CELLS} > *`;

/** The cells' texts in the order they sit on screen, left to right, whatever order the markup holds them in. */
const textsLeftToRight = (page: Page, scope: string) =>
    page.locator(cells(scope)).evaluateAll((elements) =>
        elements
            .map((element) => ({ x: element.getBoundingClientRect().x, text: element.textContent ?? "" }))
            .sort((a, b) => a.x - b.x)
            .map((cell) => cell.text),
    );

/*
 * A press on a cell is forced because the field itself lies over every cell, which is the whole design: the
 * press lands on the input, and the component works out which cell was under it. Playwright's hit-target check
 * sees the input on top and would otherwise refuse to press the cell at all.
 */

test.beforeEach(async ({ page }) => {
    await page.goto("/segmented-input/docs");
    await expect(page.locator(ONE_TIME_CODE)).toBeVisible();
    await docsSettled(page);
});

test("a one-time code field asks for digits and a code the platform can fill", async ({ page }) => {
    await expect(page.locator(ONE_TIME_CODE), "the platform is told this is a one-time code").toHaveAttribute(
        "autocomplete",
        "one-time-code",
    );
    await expect(page.locator(ONE_TIME_CODE), "and a phone is asked for its digit keyboard").toHaveAttribute(
        "inputmode",
        "numeric",
    );
    expect(await page.locator(ONE_TIME_CODE).getAttribute("aria-label"), "with a name of its own").toBeTruthy();
    await expect(page.locator(ONE_TIME_CODE), "and it is one field, however many cells are drawn").toHaveCount(1);
});

/**
 * The cells are paint over one real field, so a screen reader reads the field's value and never the cells:
 * the cells are hidden from it, and the digits they show have to be the field's digits in order.
 */
test("typing fills the cells in order, keeps digits only and stops at six", async ({ page }) => {
    await expect(page.locator(CODE_CELLS), "one cell per digit of the code").toHaveCount(6);

    await page.locator(ONE_TIME_CODE).click();
    await page.keyboard.type("1a2b3");

    expect(await inputValue(page.locator(ONE_TIME_CODE)), "letters are refused").toBe("123");
    expect(
        await page.locator(CODE_CELLS).allTextContents(),
        "each cell shows the digit in its place, and the rest stay empty",
    ).toEqual(["1", "2", "3", "", "", ""]);

    await page.keyboard.insertText("456789");

    expect(await inputValue(page.locator(ONE_TIME_CODE)), "a paste past the end is cut at six digits").toBe("123456");
    expect(await page.locator(CODE_CELLS).allTextContents()).toEqual(["1", "2", "3", "4", "5", "6"]);
});

/**
 * An SMS code often arrives written with a space or a dash in the middle. Only the characters the field
 * accepts are data, so the separator is dropped and the code lands whole.
 */
test("a pasted code fills every cell, separators and all dropped", async ({ page }) => {
    await page.locator(ONE_TIME_CODE).click();
    await page.keyboard.insertText("123-456");

    expect(await inputValue(page.locator(ONE_TIME_CODE))).toBe("123456");
    expect(await page.locator(CODE_CELLS).allTextContents(), "every cell is filled").toEqual([
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
    ]);
});

/**
 * The defect this component exists to fix: with the characters hidden in the field, the browser put a
 * pressed caret wherever the invisible text happened to be, so correcting one digit meant erasing everything
 * after it. A press on a cell now selects that cell's digit, and the next digit typed replaces it.
 */
test("pressing the third cell of a four-digit code and typing replaces the third digit alone", async ({ page }) => {
    await page.locator(ONE_TIME_CODE).click();
    await page.keyboard.type("1234");

    await page.locator(CODE_CELLS).nth(2).click({ force: true });

    await expect(page.locator(ONE_TIME_CODE), "the press leaves focus in the field").toBeFocused();
    expect(await selectionRange(page.locator(ONE_TIME_CODE)), "and selects the digit in that cell").toEqual({
        start: 2,
        end: 3,
    });

    await page.keyboard.type("9");

    expect(await inputValue(page.locator(ONE_TIME_CODE)), "the fourth digit survives").toBe("1294");
    expect(await page.locator(CODE_CELLS).allTextContents()).toEqual(["1", "2", "9", "4", "", ""]);
});

test("pressing an empty cell puts the caret after the last digit", async ({ page }) => {
    await page.locator(ONE_TIME_CODE).click();
    await page.keyboard.type("12");

    await page.locator(CODE_CELLS).nth(5).click({ force: true });

    expect(await selectionRange(page.locator(ONE_TIME_CODE))).toEqual({ start: 2, end: 2 });
});

/**
 * Which cell holds the caret and which are selected is state the component hands the painter, and the
 * Playground's painter writes both out as attributes beside whatever it paints for them. So the check reads
 * the state and says nothing about the look.
 */
test("the painter is told which cell has the caret, and none once focus leaves", async ({ page }) => {
    const carets = () => attributesOf(page, CODE_PAINTED, "data-has-caret");

    expect(await carets(), "unfocused, no cell has the caret").toEqual([null, null, null, null, null, null]);

    await page.locator(ONE_TIME_CODE).click();
    await page.keyboard.type("12");

    await expect
        .poll(carets, { message: "focused, the caret is in the cell the next digit lands in" })
        .toEqual([null, null, "true", null, null, null]);

    await page.keyboard.press("ArrowLeft");

    await expect
        .poll(carets, { message: "and it follows the arrow keys" })
        .toEqual([null, "true", null, null, null, null]);

    await page.locator(ONE_TIME_CODE).blur();

    await expect
        .poll(carets, { message: "and none has it once focus leaves" })
        .toEqual([null, null, null, null, null, null]);
});

test("a selection is reported to the painter, by keyboard and by dragging across cells", async ({ page }) => {
    const selected = () => attributesOf(page, CODE_PAINTED, "data-selected");

    await page.locator(ONE_TIME_CODE).click();
    await page.keyboard.type("12345");
    await page.keyboard.press("Shift+ArrowLeft");
    await page.keyboard.press("Shift+ArrowLeft");

    await expect
        .poll(selected, { message: "a keyboard selection marks the cells it covers" })
        .toEqual([null, null, null, "true", "true", null]);

    const first = await page.locator(CODE_CELLS).nth(0).boundingBox();
    const third = await page.locator(CODE_CELLS).nth(2).boundingBox();

    await page.mouse.move(first!.x + first!.width * 0.5, first!.y + first!.height * 0.5);
    await page.mouse.down();
    await page.mouse.move(third!.x + third!.width * 0.5, third!.y + third!.height * 0.5);
    await page.mouse.up();

    expect(await selectionRange(page.locator(ONE_TIME_CODE)), "a drag selects the digits it crosses").toEqual({
        start: 0,
        end: 3,
    });
    await expect.poll(selected).toEqual(["true", "true", "true", null, null, null]);
});

test("a field that takes letters keeps letters and digits and refuses the rest", async ({ page }) => {
    await page.locator(RECOVERY_CODE).click();
    await page.keyboard.insertText("ab-12 cd!ef99");

    expect(await inputValue(page.locator(RECOVERY_CODE)), "cut at its eight cells").toBe("ab12cdef");
    await expect(page.locator(RECOVERY_CODE), "and a phone is not asked for digits").toHaveAttribute(
        "inputmode",
        "text",
    );
});

/**
 * One-time and recovery codes are digits and Latin letters, so the cells run left to right even in a right-to-left
 * box: the example holds "123", and its first digit sits in the leftmost cell rather than the rightmost.
 */
test("in right-to-left text the cells still fill from the left", async ({ page }) => {
    const value = await inputValue(page.locator(`${RTL} input`));
    const texts = await textsLeftToRight(page, RTL);

    expect(value, "the example holds a code to read").not.toBe("");
    expect(texts.join(""), "read left to right, the cells spell the value in order").toBe(value);
    expect(texts[0], "starting from the leftmost cell").toBe(value[0]);
});

/** Inside a Label the caption alone names the field, through `aria-labelledby`. */
test("inside a Label the caption names the field", async ({ page }) => {
    const labelledBy = await page.locator(LABELED).getAttribute("aria-labelledby");

    expect(labelledBy, "the field points at its caption").toBeTruthy();

    const words = ((await page.locator(`#${labelledBy}`).textContent()) ?? "").trim();

    expect(words, "the caption has words").not.toBe("");
    await expect(page.locator(LABELED), "and the field's name is those words alone").toHaveAccessibleName(words);
});
