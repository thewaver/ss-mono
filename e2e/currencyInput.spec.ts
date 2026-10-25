import { type Page, expect, test } from "@playwright/test";

import { docsDemo, docsSettled, inputValue, prop } from "./helpers";

const DOCS = "/src/App/Pages/CurrencyInputPage/Docs";

const BASIC = `${docsDemo(DOCS, "Basic")} input`;
const LOCALE = `${docsDemo(DOCS, "Locale")} input`;
const BOUNDED = `${docsDemo(DOCS, "Bounded")} input`;
const SIGNED = `${docsDemo(DOCS, "Signed")} input`;

/**
 * A knob's picker is opened and the option chosen from the list that picker controls, so a list still fading out
 * from the knob before can never answer instead. The option is matched by its whole name, since "3" and "3 then 2"
 * are both groupings.
 */
const chooseProp = async (page: Page, key: string, name: string) => {
    const picker = page.locator(`${prop(key)} [role="combobox"]`);

    await picker.click();

    const list = page.locator(`[id="${await picker.getAttribute("aria-controls")}"]`);

    await list.getByRole("option", { name, exact: true }).click();
};

/**
 * Typing is driven key by key rather than filled, because the whole of what is interesting here happens
 * between keystrokes: the group separators move as the value grows, and the caret has to stay after the digit
 * that was just pressed rather than where the browser left it.
 */
const typeInto = async (page: Page, selector: string, text: string) => {
    await page.locator(selector).click();
    await page.keyboard.press("ControlOrMeta+a");
    await page.keyboard.press("Delete");
    await page.keyboard.type(text, { delay: 15 });
};

/**
 * What an example's owner holds, from the line under it: the one number in it, or nothing when the line names none.
 * Only the basic and the signed examples have that line.
 */
const held = async (page: Page, name: string) => {
    const number = /-?\d+(\.\d+)?/.exec(
        (await page.locator(`${docsDemo(DOCS, name)} [data-readout]`).textContent()) ?? "",
    )?.[0];

    return number === undefined ? undefined : Number(number);
};

/** An amount written in this page's starting convention, read back as a number. */
const amountOf = (text: string) => Number(text.replace(/,/g, ""));

/** The whole-unit part of an amount, split at its group separators. */
const groupsOf = (text: string, separator = ",") => text.split(/[.,](?=\d+$)/)[0].split(separator);

test.beforeEach(async ({ page }) => {
    await page.goto("/currency-input/docs");
    await expect(page.locator(BASIC)).toBeVisible();
    await docsSettled(page);
});

test("fills the fraction from the right as digits arrive", async ({ page }) => {
    await typeInto(page, BASIC, "1");
    expect(await inputValue(page.locator(BASIC))).toBe("0.01");

    await page.keyboard.type("2", { delay: 15 });
    expect(await inputValue(page.locator(BASIC))).toBe("0.12");

    await page.keyboard.type("3", { delay: 15 });
    expect(await inputValue(page.locator(BASIC))).toBe("1.23");

    expect(await held(page, "Basic"), "and the owner is given a number, not the text").toBe(
        amountOf(await inputValue(page.locator(BASIC))),
    );
});

test("grows a separator as the value crosses a group, which a fixed pattern cannot do", async ({ page }) => {
    await typeInto(page, BASIC, "123456");

    expect(await inputValue(page.locator(BASIC))).toBe("1,234.56");

    await page.keyboard.type("7", { delay: 15 });

    expect(await inputValue(page.locator(BASIC)), "a second group appears rather than a slot filling").toBe(
        "12,345.67",
    );
});

test("keeps the caret after the digit that was typed, however the separators moved", async ({ page }) => {
    await typeInto(page, BASIC, "1234");

    const caret = await page.locator(BASIC).evaluate((element) => (element as HTMLInputElement).selectionStart);

    expect(await inputValue(page.locator(BASIC))).toBe("12.34");
    expect(caret, "at the end, so the next digit lands where it looks like it will").toBe(5);
});

test("takes the digit with the separator when the separator is backspaced", async ({ page }) => {
    await typeInto(page, BASIC, "123456");
    await page.locator(BASIC).evaluate((element) => (element as HTMLInputElement).setSelectionRange(2, 2));
    await page.keyboard.press("Backspace");

    expect(await inputValue(page.locator(BASIC)), "the comma cannot go, so the 1 in front of it does").toBe("234.56");
});

test("an emptied field has no value rather than a zero", async ({ page }) => {
    await typeInto(page, BASIC, "123");
    expect(await inputValue(page.locator(BASIC))).toBe("1.23");
    expect(await held(page, "Basic")).toBe(amountOf(await inputValue(page.locator(BASIC))));

    await page.locator(BASIC).press("ControlOrMeta+a");
    await page.locator(BASIC).press("Delete");

    expect(await inputValue(page.locator(BASIC)), "an empty field shows nothing").toBe("");
    expect(await held(page, "Basic"), "and is not worth nothing, it holds nothing").toBeUndefined();
});

/**
 * The bound is a knob, so the spec reads it there and types well past it — ten times over — rather than knowing it.
 */
test("a bound leaves a typed amount alone until the field is left, then pulls it back", async ({ page }) => {
    const max = Number(await inputValue(page.locator(`${prop("max")} input`)));

    await typeInto(page, BOUNDED, String(max * 10 * 100));

    expect(amountOf(await inputValue(page.locator(BOUNDED))), "the text is what was typed").toBe(max * 10);
    await expect(page.locator(BOUNDED), "a bound is not a format, so nothing is marked wrong").not.toHaveAttribute(
        "aria-invalid",
        "true",
    );

    await page.keyboard.press("Tab");

    expect(
        amountOf(await inputValue(page.locator(BOUNDED))),
        "leaving the field pulls the amount back to the bound",
    ).toBe(max);
});

test("reads a pasted amount in punctuation it does not use", async ({ page }) => {
    await page.locator(BASIC).click();
    await page.keyboard.press("ControlOrMeta+a");
    await page.keyboard.press("Delete");
    await page.keyboard.insertText("1.234.567,89");

    expect(await inputValue(page.locator(BASIC)), "only the digits carry meaning").toBe("1,234,567.89");
});

test("shows many groups for a large value", async ({ page }) => {
    const groups = groupsOf(await inputValue(page.locator(LOCALE)));

    expect(groups.length, "the large amount is split into more than two groups").toBeGreaterThan(2);
    expect(
        groups.slice(1).every((group) => group.length === 3),
        "every group after the first holds three digits",
    ).toBe(true);
});

test.describe("the locale owns the separators", () => {
    test("swaps both of them for a locale that writes numbers the other way round", async ({ page }) => {
        const before = await inputValue(page.locator(LOCALE));

        await chooseProp(page, "locale", "de-DE");

        expect(await inputValue(page.locator(LOCALE)), "the group and decimal marks trade places").toBe(
            before.replace(/[.,]/g, (mark) => (mark === "," ? "." : ",")),
        );
    });

    test("a different decimal count re-reads the same digits", async ({ page }) => {
        const before = amountOf(await inputValue(page.locator(LOCALE)));

        await chooseProp(page, "decimals", "0");

        const after = await inputValue(page.locator(LOCALE));

        expect(after, "no fraction is shown").not.toContain(".");
        expect(amountOf(after), "so every digit is a whole unit, the amount rounded to one").toBe(Math.round(before));
    });

    test("a different group size regroups without touching the value", async ({ page }) => {
        const before = await inputValue(page.locator(LOCALE));

        await chooseProp(page, "groupSizes", "4");

        const after = await inputValue(page.locator(LOCALE));

        expect(amountOf(after), "the digits are the same").toBe(amountOf(before));
        expect(
            groupsOf(after)
                .slice(1)
                .every((group) => group.length === 4),
            "regrouped in fours",
        ).toBe(true);
    });

    /**
     * The grouping is part of what a locale says, not a separate taste: `en-IN` writes the comma every two
     * digits above the first three, so a field that took its comma and grouped in threes anyway would be
     * spelling that locale wrong. The knob starts on the locale's own answer, which is what this drives.
     */
    test("takes the grouping from the locale as well as the separators", async ({ page }) => {
        const before = await inputValue(page.locator(LOCALE));

        await chooseProp(page, "locale", "en-IN");

        const after = await inputValue(page.locator(LOCALE));
        const groups = groupsOf(after);

        expect(amountOf(after), "the value is untouched by the regrouping").toBe(amountOf(before));
        expect(groups.at(-1), "three digits nearest the point").toHaveLength(3);
        expect(
            groups.slice(1, -1).every((group) => group.length === 2),
            "then twos",
        ).toBe(true);
    });

    test("an explicit grouping overrides the locale's own", async ({ page }) => {
        await chooseProp(page, "locale", "en-IN");

        const ownGrouping = await inputValue(page.locator(LOCALE));

        await chooseProp(page, "groupSizes", "3 then 2");

        expect(await inputValue(page.locator(LOCALE)), "naming the locale's own grouping changes nothing").toBe(
            ownGrouping,
        );

        await chooseProp(page, "groupSizes", "3");

        const after = await inputValue(page.locator(LOCALE));

        expect(after, "the locale keeps its comma").toContain(",");
        expect(
            groupsOf(after)
                .slice(1)
                .every((group) => group.length === 3),
            "and loses its grouping",
        ).toBe(true);
    });
});

/**
 * The sign is the one thing no mask here could express until now, and it is opt-in rather than automatic: a
 * date's ISO spelling uses the hyphen as a separator, so a field that read one as a sign would misread every
 * date. These check the seam in both directions — that a signed field takes it, and that an unsigned one does
 * not quietly acquire it. The signed example's knob starts on.
 */
test("a signed field takes a minus and shows a negative amount", async ({ page }) => {
    await typeInto(page, SIGNED, "-12345");

    await expect(page.locator(SIGNED), "the sign sits in front of the grouped amount").toHaveValue("-123.45");

    await expect.poll(() => held(page, "Signed"), { message: "and the owner holds the negative amount" }).toBe(-123.45);
});

test("the sign can be typed before the digits, so a lone minus is held rather than dropped", async ({ page }) => {
    await typeInto(page, SIGNED, "-");

    await expect(page.locator(SIGNED), "the field keeps the sign while it waits for digits").toHaveValue("-");

    await expect.poll(() => held(page, "Signed"), { message: "and a sign alone is not an amount" }).toBeUndefined();
});

test("an unsigned field ignores a minus rather than refusing the keystroke", async ({ page }) => {
    await typeInto(page, BASIC, "-12345");

    await expect(page.locator(BASIC), "the digits land and the sign does not").toHaveValue("123.45");

    await expect.poll(() => held(page, "Basic"), { message: "and the owner holds the amount unsigned" }).toBe(123.45);
});

/**
 * A negative amount has to survive the round trip through the value, not just look right while being typed —
 * the field is rebuilt from the number whenever the value changes, and that path drops the sign unless
 * `toDigits` carries it.
 */
test("a negative value seeded from outside shows its sign", async ({ page }) => {
    await expect(page.locator(SIGNED)).toHaveValue(/^-\d/);
});

test("clearing the sign turns the amount back to positive", async ({ page }) => {
    await typeInto(page, SIGNED, "-12345");
    await typeInto(page, SIGNED, "12345");

    await expect(page.locator(SIGNED)).toHaveValue("123.45");

    await expect.poll(() => held(page, "Signed"), { message: "and the owner holds it positive" }).toBe(123.45);
});

/**
 * Switching the sign off does not rewrite a negative amount the field already holds: the field keeps showing it,
 * minus and all, and marks it as something it may not hold under its settings. Switching the sign back on makes
 * the same text valid again, with nothing to restore.
 */
test("a held negative amount stays as it is, flagged, while the sign is off", async ({ page }) => {
    const seeded = await inputValue(page.locator(SIGNED));
    const seededValue = await held(page, "Signed");

    expect(seededValue, "the owner holds the negative amount the field shows").toBe(amountOf(seeded));

    await expect(page.locator(SIGNED), "a signed field holding a negative is not in error").not.toHaveAttribute(
        "aria-invalid",
        "true",
    );

    await page.locator(`${prop("hasSign")} input`).click();

    await expect(page.locator(SIGNED), "with the sign off, the amount is shown unchanged").toHaveValue(seeded);
    await expect(page.locator(SIGNED), "and marked as one the field may not hold").toHaveAttribute(
        "aria-invalid",
        "true",
    );
    expect(await held(page, "Signed"), "while the owner keeps it, sign and all").toBe(seededValue);

    await page.locator(`${prop("hasSign")} input`).click();

    await expect(page.locator(SIGNED), "with it back on, the same text").toHaveValue(seeded);
    await expect(page.locator(SIGNED), "is valid again").not.toHaveAttribute("aria-invalid", "true");
});
