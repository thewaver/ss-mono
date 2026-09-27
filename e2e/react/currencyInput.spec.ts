import { type Locator, type Page, expect, test } from "@playwright/test";

/**
 * The React `CurrencyInput`, a `TextField` over the React masked field. The cases follow `e2e/currencyInput.spec.ts`,
 * which covers the Solid one: digits filling the fraction from the right, separators that grow with the value and
 * keep the caret where it was, an emptied field holding no value, a bound refusing an amount rather than nudging it,
 * the locale owning the separators and the grouping, and a sign taken only where the field was told to hold one.
 * The knobs the Solid spec drives on the Playground are buttons in the story here.
 */
const FIELD = "#field";
const VALUE = '[data-readout="value"]';

/**
 * Typing is driven key by key rather than filled, because what is interesting happens between keystrokes: the
 * separators move as the value grows, and the caret has to stay after the digit that was just pressed.
 */
const typeInto = async (page: Page, field: Locator, text: string) => {
    await field.click();
    await page.keyboard.press("ControlOrMeta+a");
    await page.keyboard.press("Delete");
    await page.keyboard.type(text, { delay: 15 });
};

test("fills the fraction from the right as digits arrive", async ({ page, mount }) => {
    const component = await mount("Essentials/CurrencyInput/Empty");
    const field = component.locator(FIELD);

    await typeInto(page, field, "1");
    await expect(field).toHaveValue("0.01");

    await page.keyboard.type("2", { delay: 15 });
    await expect(field).toHaveValue("0.12");

    await page.keyboard.type("3", { delay: 15 });
    await expect(field).toHaveValue("1.23");

    await expect(component.locator(VALUE), "and the owner is given a number, not the text").toHaveText("value: 1.23");
});

test("grows a separator as the value crosses a group", async ({ page, mount }) => {
    const component = await mount("Essentials/CurrencyInput/Empty");
    const field = component.locator(FIELD);

    await typeInto(page, field, "123456");
    await expect(field).toHaveValue("1,234.56");

    await page.keyboard.type("7", { delay: 15 });
    await expect(field, "a second group appears rather than a slot filling").toHaveValue("12,345.67");
});

test("keeps the caret after the digit that was typed, however the separators moved", async ({ page, mount }) => {
    const component = await mount("Essentials/CurrencyInput/Empty");
    const field = component.locator(FIELD);

    await typeInto(page, field, "1234");

    await expect(field).toHaveValue("12.34");
    expect(
        await field.evaluate((element) => (element as HTMLInputElement).selectionStart),
        "at the end, so the next digit lands where it looks like it will",
    ).toBe(5);
});

test("takes the digit with the separator when the separator is backspaced", async ({ page, mount }) => {
    const component = await mount("Essentials/CurrencyInput/Empty");
    const field = component.locator(FIELD);

    await typeInto(page, field, "123456");
    await field.evaluate((element) => (element as HTMLInputElement).setSelectionRange(2, 2));
    await page.keyboard.press("Backspace");

    await expect(field, "the comma cannot go, so the 1 in front of it does").toHaveValue("234.56");
});

test("an emptied field has no value rather than a zero", async ({ page, mount }) => {
    const component = await mount("Essentials/CurrencyInput/Empty");
    const field = component.locator(FIELD);

    await typeInto(page, field, "123");
    await expect(component.locator(VALUE)).toHaveText("value: 1.23");

    await field.press("ControlOrMeta+a");
    await field.press("Delete");

    await expect(field).toHaveValue("");
    await expect(component.locator(VALUE), "an empty field holds nothing").toHaveText("value: none");
});

test("a bound refuses a value as it is typed rather than nudging it", async ({ page, mount }) => {
    const component = await mount("Essentials/CurrencyInput/Bounded");
    const field = component.locator(FIELD);

    await typeInto(page, field, "600000");

    await expect(field, "the text is what was typed").toHaveValue("6,000.00");
    await expect(
        component.locator(VALUE),
        "while the owner keeps the last amount the bound allowed, which 600000 passed through on its way up",
    ).toHaveText("value: 600");
    await expect(field, "and the field says the figure it is showing is not the value").toHaveAttribute(
        "aria-invalid",
        "true",
    );

    await typeInto(page, field, "400000");

    await expect(component.locator(VALUE), "and one inside it is").toHaveText("value: 4000");
    await expect(field, "with the mark gone again").not.toHaveAttribute("aria-invalid", "true");
});

test("reads a pasted amount in punctuation it does not use", async ({ page, mount }) => {
    const component = await mount("Essentials/CurrencyInput/Empty");
    const field = component.locator(FIELD);

    await field.click();
    await page.keyboard.press("ControlOrMeta+a");
    await field.fill("1.234.567,89");

    await expect(field, "only the digits carry meaning").toHaveValue("1,234,567.89");
});

test("shows many groups for a large value, and a hint in the field's own spelling", async ({ mount }) => {
    const component = await mount("Essentials/CurrencyInput/Big");

    await expect(component.locator(FIELD)).toHaveValue("9,876,543,210.12");

    const empty = await mount("Essentials/CurrencyInput/Empty");

    await expect(empty.getByTestId("placeholder"), "a zero with the full fraction").toHaveText("0.00");
});

test.describe("the locale owns the separators", () => {
    test("swaps both of them for a locale that writes numbers the other way round", async ({ mount }) => {
        const component = await mount("Essentials/CurrencyInput/Default");

        await expect(component.locator(FIELD)).toHaveValue("1,234.56");

        await component.getByTestId("locale-de-DE").click();

        await expect(component.locator(FIELD), "the group and decimal marks trade places").toHaveValue("1.234,56");
        await expect(component.locator(VALUE), "and the value itself has not moved").toHaveText("value: 1234.56");
    });

    test("a different decimal count re-reads the same digits", async ({ mount }) => {
        const component = await mount("Essentials/CurrencyInput/Default");

        await component.getByTestId("decimals-0").click();

        await expect(component.locator(FIELD), "no fraction, so every digit is a whole unit").toHaveValue("1,235");
        await expect(component.locator(VALUE), "and the amount is read again from the digits now shown").toHaveText(
            "value: 1235",
        );
    });

    test("a different group size regroups without touching the value", async ({ mount }) => {
        const component = await mount("Essentials/CurrencyInput/Big");

        await component.getByTestId("grouping-4").click();

        await expect(component.locator(FIELD)).toHaveValue("98,7654,3210.12");
        await expect(component.locator(VALUE)).toHaveText("value: 9876543210.12");
    });

    test("takes the grouping from the locale as well as the separators", async ({ mount }) => {
        const component = await mount("Essentials/CurrencyInput/Big");

        await component.getByTestId("locale-en-IN").click();

        await expect(component.locator(FIELD), "three digits nearest the point, then twos").toHaveValue(
            "9,87,65,43,210.12",
        );
        await expect(component.locator(VALUE), "and the value is untouched by the regrouping").toHaveText(
            "value: 9876543210.12",
        );
    });

    test("an explicit grouping overrides the locale's own", async ({ mount }) => {
        const component = await mount("Essentials/CurrencyInput/Big");

        await component.getByTestId("locale-en-IN").click();
        await component.getByTestId("grouping-3-2").click();

        await expect(component.locator(FIELD)).toHaveValue("9,87,65,43,210.12");

        await component.getByTestId("grouping-3").click();

        await expect(component.locator(FIELD), "the locale keeps its comma and loses its grouping").toHaveValue(
            "9,876,543,210.12",
        );
    });
});

/**
 * The sign is opt-in rather than automatic: a date's ISO spelling uses the hyphen as a separator, so a field that
 * read one as a sign would misread every date. These check the seam in both directions.
 */
test("a signed field takes a minus and reports a negative amount", async ({ page, mount }) => {
    const component = await mount("Essentials/CurrencyInput/Negative");

    await typeInto(page, component.locator(FIELD), "-12345");

    await expect(component.locator(FIELD), "the sign sits in front of the grouped amount").toHaveValue("-123.45");
    await expect(component.locator(VALUE)).toHaveText("value: -123.45");
});

test("the sign can be typed before the digits, so a lone minus is held rather than dropped", async ({
    page,
    mount,
}) => {
    const component = await mount("Essentials/CurrencyInput/Negative");

    await typeInto(page, component.locator(FIELD), "-");

    await expect(component.locator(FIELD), "the field keeps the sign while it waits for digits").toHaveValue("-");
    await expect(component.locator(VALUE), "and a sign alone is not an amount").toHaveText("value: none");
});

test("an unsigned field ignores a minus rather than refusing the keystroke", async ({ page, mount }) => {
    const component = await mount("Essentials/CurrencyInput/Default");

    await typeInto(page, component.locator(FIELD), "-12345");

    await expect(component.locator(FIELD), "the digits land and the sign does not").toHaveValue("123.45");
    await expect(component.locator(VALUE)).toHaveText("value: 123.45");
});

test("a negative value seeded from outside shows its sign", async ({ mount }) => {
    const component = await mount("Essentials/CurrencyInput/Negative");

    await expect(component.locator(FIELD)).toHaveValue("-250.50");
});

test("clearing the sign turns the amount back to positive", async ({ page, mount }) => {
    const component = await mount("Essentials/CurrencyInput/Negative");

    await typeInto(page, component.locator(FIELD), "-12345");
    await typeInto(page, component.locator(FIELD), "12345");

    await expect(component.locator(FIELD)).toHaveValue("123.45");
    await expect(component.locator(VALUE)).toHaveText("value: 123.45");
});
