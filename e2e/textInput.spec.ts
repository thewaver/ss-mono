import { type Locator, type Page, expect, test } from "@playwright/test";

import {
    accessibleText,
    activeDescendantText,
    attributesOf,
    computedStyle,
    docsDemo,
    docsSettled,
    inputValue,
    isReadOnly,
    prop,
    selectionRange,
    setSelectionRange,
} from "./helpers";

const DOCS = "/src/App/Pages/TextInputPage/Docs";

const BASIC = `${docsDemo(DOCS, "Basic")} input`;
const COUPON = `${docsDemo(DOCS, "Rewriting")} input`;
const PIN = `${docsDemo(DOCS, "Refusing")} input`;
const NUMBER = `${docsDemo(DOCS, "Number")} input`;
const ADORNED = docsDemo(DOCS, "Adornments");

const knob = (page: Page, key: string) => page.locator(`${prop(key)} input`);

/**
 * The upper-casing example writes, in the line under it, the text its owner holds, in double quotes. A value is
 * checked by whether the line holds it whole, quotes and all, so "AB" is not found in "ABxy".
 */
const ownerHolds = (page: Page, text: string, message: string) =>
    expect(page.locator(`${docsDemo(DOCS, "Rewriting")} [data-readout]`), message).toContainText(`"${text}"`);

/**
 * No example shows its value in words, and every one writes what it holds back into the field, so the field's own
 * text is what the owner holds once a keystroke has settled.
 */
test.beforeEach(async ({ page }) => {
    await page.goto("/text-input/docs");
    await expect(page.locator(BASIC)).toBeVisible();
    await docsSettled(page);
});

test("no field uses the native disabled attribute", async ({ page }) => {
    await knob(page, "isDisabled").click();
    await knob(page, "tooltipIsDisabled").click();

    await expect(page.locator("input[disabled]"), "no field carries the native disabled attribute").toHaveCount(0);
});

test("typing lands each keystroke", async ({ page }) => {
    await page.locator(BASIC).click();
    await page.keyboard.type("Ada");
    expect(await inputValue(page.locator(BASIC)), "every keystroke lands in what the field holds").toBe("Ada");
});

test("a transforming setter rewrites the value and keeps the caret", async ({ page }) => {
    await page.locator(COUPON).click();
    await page.keyboard.type("ab");
    await ownerHolds(page, "AB", "the owner holds what its setter made of the keystrokes");
    expect(await inputValue(page.locator(COUPON)), "a transforming setter is applied, and the DOM follows it").toBe(
        "AB",
    );

    await setSelectionRange(page.locator(COUPON), 1, 1);
    await page.keyboard.type("c");
    expect(await inputValue(page.locator(COUPON)), "a mid-string keystroke lands where the caret was").toBe("ACB");
    expect(
        await selectionRange(page.locator(COUPON)),
        "and the caret is restored after the rewrite rather than collapsing to the end",
    ).toEqual({ start: 2, end: 2 });
});

/**
 * The refusing example keeps digits only and stops at a fixed length. The length is the page's, so the spec types
 * well past any length a PIN could have and asks only that what is kept is a prefix of the digits typed.
 */
test("a refusing setter drops what it will not take", async ({ page }) => {
    await page.locator(PIN).click();
    await page.keyboard.type("12ab34");
    expect(await inputValue(page.locator(PIN)), "a refusing setter drops what it will not take").toBe("1234");

    const digits = "1234567890123456";

    await page.keyboard.type(digits.slice(4));

    const kept = await inputValue(page.locator(PIN));

    expect(digits.startsWith(kept), "and truncation keeps the digits typed first, in order").toBe(true);
    expect(kept.length, "stopping short of everything typed rather than throwing").toBeLessThan(digits.length);
    expect(kept.length, "having still taken what fitted").toBeGreaterThan(4);
});

/**
 * A number input has no selection API — `selectionStart` answers null rather than throwing — so the example's
 * starting value reaching the element at all is what shows the initial sync survives it.
 */
test("a number field is a type rather than a component", async ({ page }) => {
    const field = page.locator(NUMBER);
    const step = Number(await field.getAttribute("step"));
    const start = Number(await inputValue(field));

    await expect(field, "a number field is a type, not a component").toHaveAttribute("type", "number");
    expect(step, "and carries its stepping attributes").toBeGreaterThan(0);
    expect(await inputValue(field), "its starting value survives a selection API that answers null").not.toBe("");

    await field.click();
    await page.keyboard.press("ArrowUp");
    expect(Number(await inputValue(field)), "so an arrow steps by the step").toBe(start + step);
});

test("a read-only field refuses a keystroke and a paste alike", async ({ page }) => {
    await page.locator(BASIC).click();
    await page.keyboard.type("Ada");
    await knob(page, "isReadOnly").click();

    expect(await isReadOnly(page.locator(BASIC)), "a read-only field is readonly").toBe(true);
    await expect(page.locator(BASIC), "and says so").toHaveAttribute("aria-readonly", "true");
    await expect(page.locator(BASIC), "without claiming to be disabled").not.toHaveAttribute("aria-disabled");

    const before = await inputValue(page.locator(BASIC));

    await page.locator(BASIC).click();
    await page.keyboard.type("x");
    await page.keyboard.insertText("pasted");
    expect(
        await inputValue(page.locator(BASIC)),
        "and refuses both a keystroke and a paste, which no keystroke guard would have caught",
    ).toBe(before);
});

test("a disabled field shuts every write path and suppresses its caret", async ({ page }) => {
    await knob(page, "isDisabled").click();

    expect(await isReadOnly(page.locator(BASIC)), "disabled is readonly, so every write path is shut").toBe(true);
    await expect(page.locator(BASIC), "while ARIA carries the disabled meaning").toHaveAttribute(
        "aria-disabled",
        "true",
    );
    expect(
        await computedStyle(page.locator(BASIC), "caret-color"),
        "and the caret is suppressed, so a focusable disabled field does not invite typing",
    ).toBe("rgba(0, 0, 0, 0)");

    const before = await inputValue(page.locator(BASIC));

    await page.locator(BASIC).focus();
    await page.keyboard.insertText("pasted");
    expect(await inputValue(page.locator(BASIC)), "a disabled field takes nothing").toBe(before);
});

test("an errored field announces itself invalid", async ({ page }) => {
    await expect(page.locator(BASIC), "a field in its plain state is not invalid").not.toHaveAttribute(
        "aria-invalid",
        "true",
    );

    await knob(page, "hasError").click();

    await expect(page.locator(BASIC), "and an errored field is announced invalid").toHaveAttribute(
        "aria-invalid",
        "true",
    );
});

/**
 * Playwright has no IME API of its own, so the composition is driven straight over the DevTools
 * Protocol — the one place this suite still reaches past the library it is built on.
 *
 * It runs on the upper-casing field, because there a value reported mid-composition shows: its owner would write
 * the half-composed letters back upper-cased, into the middle of the IME's own buffer.
 */
test("a composition is left alone until it is committed", async ({ page }) => {
    const session = await page.context().newCDPSession(page);

    await page.locator(COUPON).click();
    await page.keyboard.type("ab");

    await session.send("Input.imeSetComposition", {
        text: "xy",
        selectionStart: 2,
        selectionEnd: 2,
    });
    expect(
        await inputValue(page.locator(COUPON)),
        "a value mid-composition is not reported, so the owner never rewrites the IME's own buffer",
    ).toBe("ABxy");
    await ownerHolds(page, "AB", "the owner still holds what it held before the composition began");

    await session.send("Input.insertText", { text: "日本" });
    expect(
        await inputValue(page.locator(COUPON)),
        "committing the composition reports it, and the resync that follows does not write stale state over it",
    ).toBe("AB日本");
    await ownerHolds(page, "AB日本", "and is told of the committed text");
});

/**
 * The leading slot sits where the text starts and the trailing one where it ends, so under right-to-left the two
 * trade sides. No page is right-to-left, so the spec turns the whole document over itself. The leading slot holds a
 * glyph and the trailing one the clear button, and the two are compared with each other rather than with numbers.
 */
test("the leading and trailing slots follow the reading direction", async ({ page }) => {
    const leading = page.locator(`${ADORNED} span[aria-hidden="true"]`);
    const trailing = page.locator(`${ADORNED} button`);
    const centerX = async (locator: Locator) => {
        const box = (await locator.boundingBox())!;

        return box.x + box.width * 0.5;
    };

    expect(await centerX(leading), "left to right, the leading slot is on the left").toBeLessThan(
        await centerX(trailing),
    );

    await page.evaluate(() => {
        document.documentElement.dir = "rtl";
    });

    await expect
        .poll(async () => (await centerX(leading)) > (await centerX(trailing)), {
            message: "right to left, it moves to the right, where the text starts",
        })
        .toBe(true);
});

const CITY = `${docsDemo(DOCS, "Suggestions")} [role="combobox"]`;
const SUGGESTION = '[role="listbox"] [role="option"]';
const EDITABLE = docsDemo(DOCS, "Editable");

/**
 * The suggestion list's id is minted per mount, so the list is reached through the field's own
 * `aria-controls` — which is also what makes the pairing real to a screen reader rather than incidental.
 */
const suggestionList = async (page: Page) => {
    const id = await page.locator(CITY).getAttribute("aria-controls");

    return page.locator(`[id="${id}"]`);
};

test("a field with suggestions is a combobox that starts closed and keeps the browser's own list away", async ({
    page,
}) => {
    await expect(page.locator(CITY), "a field with suggestions announces the list it pops up").toHaveAttribute(
        "aria-haspopup",
        "listbox",
    );
    await expect(page.locator(CITY), "and that the list completes what is typed").toHaveAttribute(
        "aria-autocomplete",
        "list",
    );
    await expect(page.locator(CITY), "it starts closed").toHaveAttribute("aria-expanded", "false");
    await expect(page.locator(CITY), "pointing at no list while there is none").not.toHaveAttribute("aria-controls");
    await expect(page.locator(CITY), "and the browser's autofill is off, so two lists never stack").toHaveAttribute(
        "autocomplete",
        "off",
    );
});

/**
 * Nothing is highlighted until the reader moves into the list — the one difference from `Select`'s
 * autocomplete — so Enter on typed text has to leave the text exactly as typed.
 */
test("typing opens the list with nothing highlighted, and Enter keeps the typed text", async ({ page }) => {
    await page.locator(CITY).click();
    await page.keyboard.type("b");

    await expect(page.locator(CITY), "typing opens the list").toHaveAttribute("aria-expanded", "true");
    await expect(await suggestionList(page), "and the field points at a listbox that exists").toHaveAttribute(
        "role",
        "listbox",
    );
    await expect(page.locator(SUGGESTION), "holding what the owner's filter returned").toHaveCount(3);
    expect(
        await attributesOf(page, SUGGESTION, "aria-selected"),
        "none of which is ever selected, because the value is text rather than a pick",
    ).toEqual(["false", "false", "false"]);
    expect(
        await activeDescendantText(page, CITY),
        "and nothing is highlighted until the arrows move into the list",
    ).toBeNull();

    await page.keyboard.press("Enter");

    await expect(page.locator(CITY), "Enter with nothing highlighted closes the list").toHaveAttribute(
        "aria-expanded",
        "false",
    );
    expect(await inputValue(page.locator(CITY)), "and leaves the typed text alone").toBe("b");
});

test("the arrows walk the list and Enter writes the highlighted suggestion", async ({ page }) => {
    await page.locator(CITY).click();
    await page.keyboard.type("br");
    await expect(page.locator(SUGGESTION), "two cities start with the typed text").toHaveCount(2);

    await page.keyboard.press("ArrowDown");
    await expect(page.locator(CITY), "the first arrow lands on the first suggestion").toHaveAttribute(
        "aria-activedescendant",
        /.+/,
    );
    expect(await activeDescendantText(page, CITY)).toContain("Braga");

    await page.keyboard.press("ArrowDown");
    expect(await activeDescendantText(page, CITY), "and the next moves on").toContain("Bruges");

    await page.keyboard.press("Enter");

    expect(await inputValue(page.locator(CITY)), "Enter writes the suggestion's own text, not its description").toBe(
        "Bruges",
    );
    await expect(page.locator(CITY), "the pick closes the list").toHaveAttribute("aria-expanded", "false");
    await expect(page.locator(CITY), "and focus never left the field").toBeFocused();
});

test("the up arrow on a closed list opens it on the last suggestion", async ({ page }) => {
    await page.locator(CITY).click();
    await page.keyboard.type("t");
    await page.keyboard.press("Escape");
    await expect(page.locator(CITY)).toHaveAttribute("aria-expanded", "false");

    await page.keyboard.press("ArrowUp");

    await expect(page.locator(CITY), "the arrow reopens the list").toHaveAttribute("aria-expanded", "true");
    await expect(page.locator(CITY)).toHaveAttribute("aria-activedescendant", /.+/);
    expect(await activeDescendantText(page, CITY), "on its last suggestion").toContain("Tartu");
});

test("a suggestion can be picked with the pointer", async ({ page }) => {
    await page.locator(CITY).click();
    await page.keyboard.type("po");
    await page.locator(SUGGESTION, { hasText: "Porto" }).first().click();

    expect(await inputValue(page.locator(CITY)), "clicking a suggestion writes it").toBe("Porto");
    await expect(page.locator(CITY), "and closes the list").toHaveAttribute("aria-expanded", "false");
});

test("Escape closes the list without touching the text, and an empty filter keeps it shut", async ({ page }) => {
    await page.locator(CITY).click();
    await page.keyboard.type("Lis");
    await expect(page.locator(CITY)).toHaveAttribute("aria-expanded", "true");

    await page.keyboard.press("Escape");

    await expect(page.locator(CITY), "Escape closes the list").toHaveAttribute("aria-expanded", "false");
    expect(await inputValue(page.locator(CITY)), "and the text stays as typed rather than being restored").toBe("Lis");

    await page.keyboard.type("zzz");

    expect(await inputValue(page.locator(CITY)), "any text is kept, even text nothing matches").toBe("Liszzz");
    await expect(page.locator(CITY), "while the filter returns nothing the list stays shut").toHaveAttribute(
        "aria-expanded",
        "false",
    );

    for (let i = 0; i < 3; i++) await page.keyboard.press("Backspace");

    await expect(page.locator(CITY), "and it comes back when the list refills").toHaveAttribute(
        "aria-expanded",
        "true",
    );
});

/**
 * Edit in place is a button showing the text, swapped for a focused field while editing. The button is named after
 * what it edits followed by the text itself. Its pencil is decoration, so the text it shows is read the way a screen
 * reader reads it.
 */
const editButton = (page: Page) => page.locator(`${EDITABLE} button`);
const editField = (page: Page) => page.locator(`${EDITABLE} input`);

const typeOver = async (page: Page, text: string) => {
    await editField(page).click();
    await page.keyboard.press("ControlOrMeta+a");
    await page.keyboard.type(text);
};

test("edit in place swaps a button for a focused field holding the current text", async ({ page }) => {
    const shown = await accessibleText(editButton(page));

    expect(shown, "the resting state is a button showing the text").not.toBe("");
    await expect(editButton(page), "named after what it edits, its text included").toHaveAttribute(
        "aria-label",
        new RegExp(`${shown}$`),
    );

    await editButton(page).click();

    await expect(editField(page), "pressing it opens a field").toBeFocused();
    expect(await inputValue(editField(page)), "which starts from the current text rather than empty").toBe(shown);
    await expect(editButton(page), "and the button is gone while editing").toHaveCount(0);
});

test("Enter keeps the edit and hands focus back to the button", async ({ page }) => {
    await editButton(page).click();
    await typeOver(page, "Grace Hopper");
    await page.keyboard.press("Enter");

    await expect(editField(page), "Enter ends the edit").toHaveCount(0);
    await expect.poll(() => accessibleText(editButton(page)), { message: "keeping it" }).toBe("Grace Hopper");
    await expect(editButton(page), "and focus returns to the button, not to the page").toBeFocused();
    await expect(editButton(page), "whose name follows the new text").toHaveAttribute("aria-label", /Grace Hopper$/);
});

test("Escape puts the old text back", async ({ page }) => {
    const shown = await accessibleText(editButton(page));

    await editButton(page).click();
    await typeOver(page, "Someone else");
    await page.keyboard.press("Escape");

    await expect.poll(() => accessibleText(editButton(page)), { message: "Escape throws the draft away" }).toBe(shown);
    await expect(editButton(page), "and focus returns to the button").toBeFocused();
});

test("leaving the field keeps the edit", async ({ page }) => {
    await editButton(page).click();
    await typeOver(page, "Alan Turing");
    await page.keyboard.press("Tab");

    await expect
        .poll(() => accessibleText(editButton(page)), { message: "focus leaving commits, the same as Enter" })
        .toBe("Alan Turing");
});
