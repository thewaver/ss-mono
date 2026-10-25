import { type Page, expect, test } from "@playwright/test";

import { accessibleText, docsDemo, docsSettled, inputValue, isReadOnly, prop } from "./helpers";

const DOCS = "/src/App/Pages/NumberInputPage/Docs";

const BASIC = docsDemo(DOCS, "Basic");
const STEPPING = docsDemo(DOCS, "Stepping");

const DEFAULT = `${BASIC} input`;
const DEFAULT_UP = `${BASIC} button:has-text("Increase")`;
const QUANTITY = `${STEPPING} input`;
const QUANTITY_UP = `${STEPPING} button:has-text("Increase")`;
const QUANTITY_DOWN = `${STEPPING} button:has-text("Decrease")`;

const knob = (page: Page, key: string) => page.locator(`${prop(key)} input`);

/**
 * The stepping example takes its limits and its step from knobs, so the spec reads them there rather than knowing
 * them. What the field holds is read back from `aria-valuenow`, the number a screen reader is given.
 */
const limits = async (page: Page) => ({
    min: Number(await inputValue(knob(page, "min"))),
    max: Number(await inputValue(knob(page, "max"))),
    step: Number(await inputValue(knob(page, "step"))),
});

/**
 * What the stepping example's owner holds, from the line under it: the one number in it, or nothing when the line
 * names none. Unlike `aria-valuenow`, which follows the text the field shows, this is the value the field reported.
 */
const held = async (page: Page) => {
    const number = /-?\d+(\.\d+)?/.exec((await page.locator(`${STEPPING} [data-readout]`).textContent()) ?? "")?.[0];

    return number === undefined ? undefined : Number(number);
};

const valueNow = async (page: Page, selector: string) => {
    const now = await page.locator(selector).getAttribute("aria-valuenow");

    return now === null ? undefined : Number(now);
};

/** Replaces what a field holds, the way a person does: click in, select everything, type over it. */
const typeOver = async (page: Page, selector: string, text: string) => {
    await page.locator(selector).click();
    await page.keyboard.press("ControlOrMeta+a");
    await page.keyboard.type(text);
};

test.beforeEach(async ({ page }) => {
    await page.goto("/number-input/docs");
    await expect(page.locator(QUANTITY)).toBeVisible();
    await docsSettled(page);
});

test("the field is a text input announcing itself as a spin button", async ({ page }) => {
    const { min, max } = await limits(page);

    await expect(page.locator(QUANTITY), "the element is text, so no value is ever sanitized away").toHaveAttribute(
        "type",
        "text",
    );
    await expect(page.locator(QUANTITY), "while ARIA carries the spinning meaning").toHaveAttribute(
        "role",
        "spinbutton",
    );
    await expect(page.locator(QUANTITY), "with the range it can hold").toHaveAttribute("aria-valuemin", String(min));
    await expect(page.locator(QUANTITY), "at both ends").toHaveAttribute("aria-valuemax", String(max));
    expect(await valueNow(page, QUANTITY), "and the value it holds now, which is the one it shows").toBe(
        Number(await inputValue(page.locator(QUANTITY))),
    );
});

test("the stepper buttons carry a readable name rather than a glyph", async ({ page }) => {
    expect(
        await accessibleText(page.locator(QUANTITY_UP)),
        "the triangle is decoration, so the name has to come from somewhere else",
    ).toBe("Increase");
});

/**
 * The example starts between two rungs of the step ladder, so the first step up snaps to the next rung rather than
 * adding a whole step, and every step after that moves a whole step.
 */
test("a click steps to the next rung of the ladder", async ({ page }) => {
    const { min, step } = await limits(page);
    const start = (await valueNow(page, QUANTITY))!;
    const isOnRung = (value: number) => Number.isInteger((value - min) / step);

    expect(isOnRung(start), "the example starts between rungs").toBe(false);

    await page.locator(QUANTITY_UP).click();

    const snapped = (await valueNow(page, QUANTITY))!;

    expect(isOnRung(snapped), "up snaps to a rung").toBe(true);
    expect(snapped, "the next one above").toBeGreaterThan(start);
    expect(snapped - start, "rather than a whole step on").toBeLessThan(step);

    await page.locator(QUANTITY_UP).click();
    expect(await valueNow(page, QUANTITY), "and a rung then moves a whole step").toBe(snapped + step);

    await page.locator(QUANTITY_DOWN).click();
    expect(await valueNow(page, QUANTITY), "down moves back the same way").toBe(snapped);
});

test("the arrows step and Home and End reach the ends", async ({ page }) => {
    const { min, max, step } = await limits(page);

    await page.locator(QUANTITY_UP).click();

    const start = (await valueNow(page, QUANTITY))!;

    await page.locator(QUANTITY).click();
    await page.keyboard.press("ArrowUp");
    expect(await valueNow(page, QUANTITY), "an arrow steps like a click does").toBe(start + step);

    await page.keyboard.press("End");
    expect(await valueNow(page, QUANTITY), "End reaches the top of the range").toBe(max);

    await page.keyboard.press("Home");
    expect(await valueNow(page, QUANTITY), "and Home the bottom").toBe(min);
});

/**
 * A tenth added to 3.7 in floating point is 3.8000000000000003. The step knob goes down to a tenth, so the spec sets
 * it there and types the 3.7 itself.
 */
test("a fractional step does not drift", async ({ page }) => {
    await typeOver(page, `${prop("step")} input`, "0.1");
    await page.keyboard.press("Tab");

    await typeOver(page, QUANTITY, "3.7");
    await page.keyboard.press("ArrowUp");
    expect(await inputValue(page.locator(QUANTITY)), "a tenth added to 3.7 is 3.8 and nothing longer").toBe("3.8");
});

test("the stepper stops at the ends of the range", async ({ page }) => {
    await page.locator(QUANTITY).click();
    await page.keyboard.press("End");
    await expect(page.locator(QUANTITY_UP), "at the top there is nowhere further up to go").toHaveAttribute(
        "aria-disabled",
        "true",
    );

    await page.keyboard.press("Home");
    await expect(page.locator(QUANTITY_DOWN), "and the same at the bottom").toHaveAttribute("aria-disabled", "true");
});

test("typing refuses what cannot appear in a number and keeps what is half typed", async ({ page }) => {
    await page.locator(DEFAULT).click();
    await page.keyboard.type("12ab3");
    expect(await inputValue(page.locator(DEFAULT)), "letters never land").toBe("123");

    await page.keyboard.press("Backspace");
    await page.keyboard.press("Backspace");
    await page.keyboard.press("Backspace");
    await page.keyboard.type("-1.");
    expect(await inputValue(page.locator(DEFAULT)), "a half-typed value stays typeable").toBe("-1.");
    expect(await valueNow(page, DEFAULT), "and reads back as the number it already is").toBe(-1);
});

test("an empty field has no value rather than zero", async ({ page }) => {
    await page.locator(DEFAULT).click();
    await page.keyboard.type("5");
    expect(await valueNow(page, DEFAULT), "a digit is a value").toBe(5);

    await page.keyboard.press("Backspace");
    expect(await valueNow(page, DEFAULT), "an emptied field holds no value at all").toBeUndefined();
});

test("a typed value is clamped when the field is left, not while it is typed", async ({ page }) => {
    const { max } = await limits(page);
    const beyond = String(max * 10 - 1);

    await typeOver(page, QUANTITY, beyond);
    expect(
        await inputValue(page.locator(QUANTITY)),
        "clamping per keystroke would make the second digit untypeable",
    ).toBe(beyond);
    expect(
        await held(page),
        "while the owner keeps the last reading the range allowed, one keystroke short, and never sees the whole of it",
    ).toBe(Number(beyond.slice(0, -1)));
    await expect(page.locator(QUANTITY), "the field says of itself that what it shows is out of range").toHaveAttribute(
        "aria-invalid",
        "true",
    );

    await page.locator(DEFAULT).click();
    expect(Number(await inputValue(page.locator(QUANTITY))), "leaving the field is when it is brought into range").toBe(
        max,
    );
    expect(await valueNow(page, QUANTITY), "and the value with it").toBe(max);
    expect(await held(page), "and the owner is told then").toBe(max);
    await expect(page.locator(QUANTITY), "with the field back in range and no longer marked").not.toHaveAttribute(
        "aria-invalid",
        "true",
    );
});

test("an out-of-range number in the field is what the stepper steps from", async ({ page }) => {
    const { max } = await limits(page);

    await typeOver(page, QUANTITY, String(max * 10 - 1));
    await page.locator(QUANTITY_DOWN).click();
    expect(
        Number(await inputValue(page.locator(QUANTITY))),
        "stepping from the last value in range would jump somewhere nobody typed",
    ).toBe(max);
});

test("a read-only field refuses every way of moving the value", async ({ page }) => {
    await page.locator(DEFAULT).click();
    await page.keyboard.type("7");
    await knob(page, "isReadOnly").click();

    expect(await isReadOnly(page.locator(DEFAULT)), "a read-only field is readonly").toBe(true);
    await expect(page.locator(DEFAULT_UP), "and its stepper is unavailable with it").toHaveAttribute(
        "aria-disabled",
        "true",
    );

    const before = await inputValue(page.locator(DEFAULT));

    await page.locator(DEFAULT).click();
    await page.keyboard.press("ArrowUp");
    expect(await inputValue(page.locator(DEFAULT)), "so the arrows move nothing either").toBe(before);
});

test("a disabled field uses no native disabled attribute and takes nothing", async ({ page }) => {
    await page.locator(DEFAULT).click();
    await page.keyboard.type("7");
    await knob(page, "isDisabled").click();

    await expect(page.locator("input[disabled]"), "no field carries the native disabled attribute").toHaveCount(0);

    const before = await inputValue(page.locator(DEFAULT));

    await page.locator(DEFAULT).focus();
    await page.keyboard.press("ArrowUp");
    expect(await inputValue(page.locator(DEFAULT)), "a disabled field takes nothing").toBe(before);
});

/**
 * Holding the stepper repeats, which is what a native spinner does and what this one could not do until
 * `Button` reported the pointer going down. A tap has to stay a single step, so both halves are asserted:
 * the repeat only starts after the delay, and releasing stops it.
 */
test("holding a stepper repeats, and a tap does not", async ({ page }) => {
    const { step } = await limits(page);
    await page.locator(QUANTITY_UP).scrollIntoViewIfNeeded();

    const box = (await page.locator(QUANTITY_UP).boundingBox())!;

    await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5);

    await page.mouse.down();
    await page.mouse.up();

    const afterTap = (await valueNow(page, QUANTITY))!;

    await page.mouse.down();
    await page.waitForTimeout(1000);
    await page.mouse.up();

    const afterHold = (await valueNow(page, QUANTITY))!;

    expect(afterHold, "holding steps repeatedly rather than once").toBeGreaterThan(afterTap + step);

    await page.waitForTimeout(300);

    expect(await valueNow(page, QUANTITY), "and releasing stops it").toBe(afterHold);
});

/**
 * Holding a stepper into its bound used to leave the repeat running unseen: the button disables itself at the
 * bound, a disabled button does not hear the release, and the repeat went on stepping into the bound until
 * something moved the value away — then walked it straight back. Reported from the Playground's Reset, which
 * put a field back to its default only to watch it slide to the bound again. Typing a value after the hold is
 * the same move made from inside the field, so this page can show it without a panel.
 */
test("a stepper held into its bound does not pull a value moved away afterwards back to it", async ({ page }) => {
    const { min } = await limits(page);
    await page.locator(QUANTITY_UP).scrollIntoViewIfNeeded();

    const box = (await page.locator(QUANTITY_UP).boundingBox())!;

    await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5);
    await page.mouse.down();
    await expect(page.locator(QUANTITY_UP), "held until the button gives up at the top").toHaveAttribute(
        "aria-disabled",
        "true",
        { timeout: 15_000 },
    );
    await page.mouse.up();

    await typeOver(page, QUANTITY, String(min));
    await page.locator(QUANTITY).blur();

    expect(await valueNow(page, QUANTITY), "the typed value is taken").toBe(min);

    await page.waitForTimeout(1000);

    expect(await valueNow(page, QUANTITY), "and nothing walks it back up afterwards").toBe(min);
});
