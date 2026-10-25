import { type Page, expect, test } from "@playwright/test";

import {
    computedStyle,
    docsDemo,
    docsSettled,
    inputValue,
    isReadOnly,
    isScrolling,
    offsetHeight,
    prop,
    tagName,
} from "./helpers";

const DOCS = "/src/App/Pages/TextAreaPage/Docs";

const FIXED = `${docsDemo(DOCS, "Basic")} textarea`;
const GROWING = `${docsDemo(DOCS, "Growing")} textarea`;

const THREE_LINES = "one\ntwo\nthree";

/** Far more lines than any row limit the page's knob offers, so a loop adding them is sure to meet the limit. */
const MANY_LINES = 30;

const knob = (page: Page, key: string) => page.locator(`${prop(key)} input`);

test.beforeEach(async ({ page }) => {
    await page.goto("/text-area/docs");
    await expect(page.locator(FIXED)).toBeVisible();
    await docsSettled(page);
});

test("the control is a textarea rather than an input with a type", async ({ page }) => {
    expect(await tagName(page.locator(FIXED)), "a textarea is a different element, not a different type").toBe(
        "TEXTAREA",
    );
    await expect(page.locator(FIXED), "and carries no type attribute").not.toHaveAttribute("type");
});

test("the drag handle is off, because the painter owns the box", async ({ page }) => {
    expect(
        await computedStyle(page.locator(FIXED), "resize"),
        "a user-dragged element would leave the painted frame behind",
    ).toBe("none");
});

/** The basic example counts, in the line under it, the characters its owner holds: the one number in that line. */
const heldLength = async (page: Page) =>
    Number(/\d+/.exec((await page.locator(`${docsDemo(DOCS, "Basic")} [data-readout]`).textContent()) ?? "")?.[0]);

test("typing reports each keystroke across lines", async ({ page }) => {
    await page.locator(FIXED).click();
    await page.keyboard.type(THREE_LINES);
    expect(await inputValue(page.locator(FIXED)), "a newline is a value like any other").toBe(THREE_LINES);
    expect(await heldLength(page), "and every keystroke is reported to the owner").toBe(THREE_LINES.length);
});

test("a fixed field keeps the height its painter drew", async ({ page }) => {
    const before = await offsetHeight(page.locator(FIXED));

    await page.locator(FIXED).click();
    await page.keyboard.type(THREE_LINES);
    expect(await offsetHeight(page.locator(FIXED)), "nothing measures, so nothing moves").toBe(before);
    expect(await isScrolling(page.locator(FIXED)), "a fixed field scrolls its own content instead").toBe(false);
});

/**
 * The growing example starts with text in it and a row limit set, so the spec empties it first, then adds lines one
 * at a time and watches the height, rather than knowing how many rows the floor or the limit is.
 */
test("an auto-sizing field grows with what is typed and shrinks back", async ({ page }) => {
    const field = page.locator(GROWING);

    await field.click();
    await page.keyboard.press("ControlOrMeta+a");
    await page.keyboard.press("Backspace");

    const empty = await offsetHeight(field);

    await page.keyboard.type("one");

    for (let line = 0; line < MANY_LINES && (await offsetHeight(field)) === empty; line++) {
        await page.keyboard.type("\nmore");
    }

    expect(await offsetHeight(field), "once the lines outnumber its floor it grows").toBeGreaterThan(empty);
    expect(await isScrolling(field), "and it grew instead of scrolling").toBe(false);

    await page.keyboard.press("ControlOrMeta+a");
    await page.keyboard.press("Backspace");
    expect(await offsetHeight(field), "emptying it returns to the row floor").toBe(empty);
});

test("a capped field stops growing and scrolls from there", async ({ page }) => {
    const field = page.locator(GROWING);

    await field.click();
    await page.keyboard.press("ControlOrMeta+a");
    await page.keyboard.press("Backspace");

    const empty = await offsetHeight(field);

    await page.keyboard.type("one");

    for (let line = 0; line < MANY_LINES && !(await isScrolling(field)); line++) {
        await page.keyboard.type("\nmore");
    }

    const capped = await offsetHeight(field);

    expect(capped, "it grew").toBeGreaterThan(empty);
    expect(await isScrolling(field), "then hit the ceiling and started scrolling instead").toBe(true);

    await page.keyboard.type("\neleven\ntwelve");
    expect(await offsetHeight(field), "and stays there however much more arrives").toBe(capped);
});

test("a read-only field refuses a keystroke and a paste alike", async ({ page }) => {
    await page.locator(FIXED).click();
    await page.keyboard.type("draft");
    await knob(page, "isReadOnly").click();

    expect(await isReadOnly(page.locator(FIXED)), "a read-only field is readonly").toBe(true);
    await expect(page.locator(FIXED), "and says so").toHaveAttribute("aria-readonly", "true");

    const before = await inputValue(page.locator(FIXED));

    await page.locator(FIXED).click();
    await page.keyboard.type("x");
    await page.keyboard.insertText("pasted");
    expect(await inputValue(page.locator(FIXED)), "and takes neither").toBe(before);
});

test("a disabled field uses no native disabled attribute and suppresses its caret", async ({ page }) => {
    await knob(page, "isDisabled").click();

    await expect(page.locator("textarea[disabled]"), "no field carries the native disabled attribute").toHaveCount(0);
    await expect(page.locator(FIXED), "while ARIA carries the disabled meaning").toHaveAttribute(
        "aria-disabled",
        "true",
    );
    expect(
        await computedStyle(page.locator(FIXED), "caret-color"),
        "and the caret is suppressed, so a focusable disabled field does not invite typing",
    ).toBe("rgba(0, 0, 0, 0)");
});
