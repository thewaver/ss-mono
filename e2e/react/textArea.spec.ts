import { expect, test } from "@playwright/test";

import { computedStyle, inputValue, isReadOnly, isScrolling, offsetHeight, tagName } from "../helpers";

/**
 * The React `TextArea`, a `TextField` drawn as a textarea. The cases follow `e2e/textArea.spec.ts`, which covers the
 * Solid one: a real textarea with no drag handle, a fixed box that scrolls, an auto-sizing one that grows with its
 * text between a row floor and ceiling, and read-only and disabled shutting every write path.
 */
const FIELD = "#field";

const THREE_LINES = "one\ntwo\nthree";

test("the control is a textarea rather than an input with a type, with no drag handle", async ({ mount }) => {
    const component = await mount("Essentials/TextArea/Fixed");

    expect(await tagName(component.locator(FIELD)), "a textarea is a different element, not a different type").toBe(
        "TEXTAREA",
    );
    await expect(component.locator(FIELD), "and carries no type attribute").not.toHaveAttribute("type");
    expect(
        await computedStyle(component.locator(FIELD), "resize"),
        "a user-dragged element would leave the painted frame behind",
    ).toBe("none");
});

test("typing reports each keystroke across lines", async ({ page, mount }) => {
    const component = await mount("Essentials/TextArea/Fixed");

    await component.locator(FIELD).focus();
    await page.keyboard.type(THREE_LINES);

    expect(await inputValue(component.locator(FIELD)), "a newline is a value like any other").toBe(THREE_LINES);
    await expect(component.locator('[data-readout="length"]'), "and every keystroke is reported").toHaveText(
        `length: ${THREE_LINES.length}`,
    );
});

test("a fixed field keeps the height its painter drew", async ({ page, mount }) => {
    const component = await mount("Essentials/TextArea/Fixed");
    const before = await offsetHeight(component.locator(FIELD));

    await component.locator(FIELD).focus();
    await page.keyboard.type(THREE_LINES);

    expect(await offsetHeight(component.locator(FIELD)), "nothing measures, so nothing moves").toBe(before);
    expect(await isScrolling(component.locator(FIELD)), "and three lines still fit").toBe(false);
});

test("an auto-sizing field grows with what is typed and shrinks back", async ({ page, mount }) => {
    const component = await mount("Essentials/TextArea/AutoSizing");
    const empty = await offsetHeight(component.locator(FIELD));

    expect(empty, "it starts at its row floor rather than collapsed").toBeGreaterThan(0);

    await component.locator(FIELD).focus();
    await page.keyboard.type(THREE_LINES);

    await expect
        .poll(() => offsetHeight(component.locator(FIELD)), "three lines need more room than the two it starts at")
        .toBeGreaterThan(empty);
    expect(await isScrolling(component.locator(FIELD)), "and it grew instead of scrolling").toBe(false);
    await expect(component.locator(FIELD), "an unbounded box has no scrollbar to flash").toHaveCSS(
        "overflow-y",
        "hidden",
    );

    await page.keyboard.press("ControlOrMeta+a");
    await page.keyboard.press("Backspace");

    await expect.poll(() => offsetHeight(component.locator(FIELD)), "emptying it returns to the row floor").toBe(empty);
});

test("a capped field stops growing and scrolls from there", async ({ page, mount }) => {
    const component = await mount("Essentials/TextArea/Capped");
    const before = await offsetHeight(component.locator(FIELD));

    await component.locator(FIELD).focus();
    await page.keyboard.type("one\ntwo\nthree\nfour\nfive\nsix\nseven\neight\nnine\nten");

    const grown = await offsetHeight(component.locator(FIELD));

    expect(grown, "it grew").toBeGreaterThan(before);
    expect(await isScrolling(component.locator(FIELD)), "then hit the ceiling and started scrolling instead").toBe(
        true,
    );

    await page.keyboard.type("\neleven\ntwelve");

    expect(await offsetHeight(component.locator(FIELD)), "and stays there however much more arrives").toBe(grown);
});

test("a read-only field refuses a keystroke and a paste alike", async ({ page, mount }) => {
    const component = await mount("Essentials/TextArea/ReadOnly");

    expect(await isReadOnly(component.locator(FIELD)), "a read-only field is readonly").toBe(true);
    await expect(component.locator(FIELD), "and says so").toHaveAttribute("aria-readonly", "true");

    const before = await inputValue(component.locator(FIELD));

    await component.locator(FIELD).focus();
    await page.keyboard.type("x");
    await page.keyboard.insertText("pasted");

    expect(await inputValue(component.locator(FIELD)), "and takes neither").toBe(before);
});

test("a disabled field uses no native disabled attribute and suppresses its caret", async ({ mount }) => {
    const component = await mount("Essentials/TextArea/Disabled");

    await expect(component.locator("textarea[disabled]"), "no field carries the native disabled attribute").toHaveCount(
        0,
    );
    await expect(component.locator(FIELD), "while ARIA carries the disabled meaning").toHaveAttribute(
        "aria-disabled",
        "true",
    );
    expect(
        await computedStyle(component.locator(FIELD), "caret-color"),
        "and the caret is suppressed, so a focusable disabled field does not invite typing",
    ).toBe("rgba(0, 0, 0, 0)");
});
