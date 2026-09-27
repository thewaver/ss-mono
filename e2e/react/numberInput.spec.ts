import { expect, test } from "@playwright/test";

import { accessibleText, inputValue, isReadOnly } from "../helpers";

/**
 * The React `NumberInput`, a `TextField` holding text on its way to being a number. The cases follow
 * `e2e/numberInput.spec.ts`, which covers the Solid one: a text input announcing a spin button, stepping on a ladder
 * counted from the minimum, the keyboard reaching the ends, typing that refuses what cannot be a number, clamping
 * deferred to leaving the field, read-only and disabled refusing every way in, and a held stepper repeating. The
 * German case checks the locale's separators, which the Solid spec leaves to the Playground's eye.
 */
const FIELD = "#field";
const UP = 'button:has-text("Increase")';
const DOWN = 'button:has-text("Decrease")';
const VALUE = '[data-readout="value"]';
const QUANTITY_STEP = 5;

test("the field is a text input announcing itself as a spin button", async ({ mount }) => {
    const component = await mount("Essentials/NumberInput/SteppedClamped");

    await expect(component.locator(FIELD), "the element is text, so no value is ever sanitized away").toHaveAttribute(
        "type",
        "text",
    );
    await expect(component.locator(FIELD), "while ARIA carries the spinning meaning").toHaveAttribute(
        "role",
        "spinbutton",
    );
    await expect(component.locator(FIELD), "with the range it can hold").toHaveAttribute("aria-valuemin", "0");
    await expect(component.locator(FIELD), "at both ends").toHaveAttribute("aria-valuemax", "100");
    await expect(component.locator(FIELD), "and the value it holds now").toHaveAttribute("aria-valuenow", "13");
});

test("the stepper buttons carry a readable name", async ({ mount }) => {
    const component = await mount("Essentials/NumberInput/SteppedClamped");

    expect(await accessibleText(component.locator(UP))).toBe("Increase");
});

test("a click steps to the next rung of the ladder", async ({ mount }) => {
    const component = await mount("Essentials/NumberInput/SteppedClamped");

    await component.locator(UP).click();
    await expect(component.locator(VALUE), "13 is between rungs, so up snaps to 15").toHaveText("value: 15");

    await component.locator(UP).click();
    await expect(component.locator(VALUE), "and a rung then moves a whole step").toHaveText("value: 20");

    await component.locator(DOWN).click();
    await expect(component.locator(VALUE), "down moves back the same way").toHaveText("value: 15");
});

test("the arrows step, PageUp moves ten steps, and Home and End reach the ends", async ({ page, mount }) => {
    const component = await mount("Essentials/NumberInput/SteppedClamped");

    await component.locator(FIELD).focus();
    await page.keyboard.press("ArrowUp");
    await expect(component.locator(VALUE), "an arrow steps like a click does").toHaveText("value: 15");

    await page.keyboard.press("PageUp");
    await expect(component.locator(VALUE), "a page is ten steps").toHaveText("value: 65");

    await page.keyboard.press("End");
    await expect(component.locator(VALUE), "End reaches the top of the range").toHaveText("value: 100");

    await page.keyboard.press("Home");
    await expect(component.locator(VALUE), "and Home the bottom").toHaveText("value: 0");
});

test("a fractional step does not drift", async ({ page, mount }) => {
    const component = await mount("Essentials/NumberInput/FractionalStep");

    await component.locator(FIELD).focus();
    await page.keyboard.press("ArrowUp");

    await expect(component.locator(FIELD), "a tenth added to 3.7 is 3.8 and nothing longer").toHaveValue("3.8");
});

test("the stepper stops at the ends of the range", async ({ page, mount }) => {
    const component = await mount("Essentials/NumberInput/SteppedClamped");

    await component.locator(FIELD).focus();
    await page.keyboard.press("End");
    await expect(component.locator(UP), "at the top there is nowhere further up to go").toHaveAttribute(
        "aria-disabled",
        "true",
    );

    await page.keyboard.press("Home");
    await expect(component.locator(DOWN), "and the same at the bottom").toHaveAttribute("aria-disabled", "true");
});

test("typing refuses what cannot appear in a number and keeps what is half typed", async ({ page, mount }) => {
    const component = await mount("Essentials/NumberInput/Default");

    await component.locator(FIELD).focus();
    await page.keyboard.type("12ab3");
    await expect(component.locator(FIELD), "letters never land").toHaveValue("123");

    await page.keyboard.press("Backspace");
    await page.keyboard.press("Backspace");
    await page.keyboard.press("Backspace");
    await page.keyboard.type("-1.");
    await expect(component.locator(FIELD), "a half-typed value stays typeable").toHaveValue("-1.");
    await expect(component.locator(VALUE), "and reads back as the number it already is").toHaveText("value: -1");
});

test("an empty field has no value rather than zero", async ({ page, mount }) => {
    const component = await mount("Essentials/NumberInput/Default");

    await component.locator(FIELD).focus();
    await page.keyboard.type("5");
    await page.keyboard.press("Backspace");

    await expect(component.locator(VALUE), "an emptied field reports no value at all").toHaveText("value: undefined");
});

test("a typed value is clamped when the field is left, not while it is typed", async ({ page, mount }) => {
    const component = await mount("Essentials/NumberInput/SteppedClamped");

    await component.locator(FIELD).focus();
    await page.keyboard.press("ControlOrMeta+a");
    await page.keyboard.type("999");
    await expect(component.locator(FIELD), "clamping per keystroke would make the second digit untypeable").toHaveValue(
        "999",
    );
    await expect(
        component.locator(VALUE),
        "while the owner keeps the last reading the range allowed and never sees the 999",
    ).toHaveText("value: 99");
    await expect(component.locator(FIELD), "which the field says of itself").toHaveAttribute("aria-invalid", "true");

    await component.locator(FIELD).blur();

    await expect(component.locator(FIELD), "leaving the field is when it is brought into range").toHaveValue("100");
    await expect(component.locator(VALUE), "and the owner is told then").toHaveText("value: 100");
    await expect(component.locator(FIELD), "with the field no longer marked").not.toHaveAttribute(
        "aria-invalid",
        "true",
    );
});

test("an out-of-range number in the field is what the stepper steps from", async ({ page, mount }) => {
    const component = await mount("Essentials/NumberInput/SteppedClamped");

    await component.locator(FIELD).focus();
    await page.keyboard.press("ControlOrMeta+a");
    await page.keyboard.type("999");
    await component.locator(DOWN).click();

    await expect(
        component.locator(FIELD),
        "stepping from the 99 the owner still holds would jump somewhere nobody typed",
    ).toHaveValue("100");
});

test("a German field reads a comma as the fraction and a point as grouping", async ({ page, mount }) => {
    const component = await mount("Essentials/NumberInput/German");

    await expect(component.locator(FIELD), "the value is written with the locale's decimal mark").toHaveValue("1234,5");

    await component.locator(FIELD).focus();
    await page.keyboard.press("ControlOrMeta+a");
    await page.keyboard.type("1.000,5");

    await expect(component.locator(VALUE), "the point groups and the comma marks the fraction").toHaveText(
        "value: 1000.5",
    );

    await page.keyboard.press("ArrowUp");

    await expect(component.locator(FIELD), "and a step writes the number back without grouping").toHaveValue("1001");
});

test("a read-only field refuses every way of moving the value", async ({ page, mount }) => {
    const component = await mount("Essentials/NumberInput/ReadOnly");

    expect(await isReadOnly(component.locator(FIELD)), "a read-only field is readonly").toBe(true);
    await expect(component.locator(UP), "and its stepper is unavailable with it").toHaveAttribute(
        "aria-disabled",
        "true",
    );

    const before = await inputValue(component.locator(FIELD));

    await component.locator(FIELD).focus();
    await page.keyboard.press("ArrowUp");

    await expect(component.locator(FIELD), "so the arrows move nothing either").toHaveValue(before);
});

test("a disabled field uses no native disabled attribute and takes nothing", async ({ page, mount }) => {
    const component = await mount("Essentials/NumberInput/Disabled");

    await expect(component.locator("input[disabled]"), "no native disabled attribute").toHaveCount(0);

    const before = await inputValue(component.locator(FIELD));

    await component.locator(FIELD).focus();
    await page.keyboard.press("ArrowUp");

    await expect(component.locator(FIELD), "a disabled field takes nothing").toHaveValue(before);
});

/**
 * A tap has to stay a single step, so both halves are asserted: the repeat only starts after the delay, and
 * releasing stops it.
 */
test("holding a stepper repeats, and a tap does not", async ({ page, mount }) => {
    const component = await mount("Essentials/NumberInput/SteppedClamped");

    const readValue = async () =>
        Number(/value: (\d+)/.exec((await component.locator(VALUE).textContent()) ?? "")?.[1]);

    const box = (await component.locator(UP).boundingBox())!;

    await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5);

    await page.mouse.down();
    await page.mouse.up();

    await expect(component.locator(VALUE), "a tap is one step").toHaveText("value: 15");

    await page.mouse.down();
    await page.waitForTimeout(1000);
    await page.mouse.up();

    const afterHold = await readValue();

    expect(afterHold, "holding steps repeatedly rather than once").toBeGreaterThan(15 + QUANTITY_STEP);

    await page.waitForTimeout(300);

    expect(await readValue(), "and releasing stops it").toBe(afterHold);
});
