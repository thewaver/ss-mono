import { type Page, expect, test } from "@playwright/test";

import {
    activeDescendantText,
    attributesOf,
    computedStyle,
    demo,
    inputValue,
    isReadOnly,
    readout,
    selectionRange,
    setSelectionRange,
} from "./helpers";

const DEFAULT = `${demo("default")} input`;
const COUPON = `${demo("transformingSetter")} input`;
const PIN = `${demo("refusingSetter")} input`;
const NUMBER = `${demo("number")} input`;
const READ_ONLY = `${demo("readOnly")} input`;
const DISABLED = `${demo("disabled")} input`;
const EMAIL = `${demo("errored")} input`;

test.beforeEach(async ({ page }) => {
    await page.goto("/text-input");
    await expect(page.locator("[data-example]").first()).toBeVisible();
});

test("no field uses the native disabled attribute", async ({ page }) => {
    await expect(page.locator("input[disabled]"), "no field carries the native disabled attribute").toHaveCount(0);
});

test("typing reports each keystroke", async ({ page }) => {
    await page.locator(DEFAULT).focus();
    await page.keyboard.type("Ada");
    expect(await readout(page, "default"), "typing reports each keystroke").toContain('value: "Ada"');
});

test("a transforming setter rewrites the value and keeps the caret", async ({ page }) => {
    await page.locator(COUPON).focus();
    await page.keyboard.type("ab");
    expect(await readout(page, "transformingSetter"), "a transforming setter is applied").toContain('value: "AB"');
    expect(await inputValue(page.locator(COUPON)), "and the DOM is corrected to match it").toBe("AB");

    await setSelectionRange(page.locator(COUPON), 1, 1);
    await page.keyboard.type("c");
    expect(await inputValue(page.locator(COUPON)), "a mid-string keystroke lands where the caret was").toBe("ACB");
    expect(
        await selectionRange(page.locator(COUPON)),
        "and the caret is restored after the rewrite rather than collapsing to the end",
    ).toEqual({ start: 2, end: 2 });
});

test("a refusing setter drops what it will not take", async ({ page }) => {
    await page.locator(PIN).focus();
    await page.keyboard.type("12ab34");
    expect(await inputValue(page.locator(PIN)), "a refusing setter drops what it will not take").toBe("1234");

    await page.keyboard.type("567");
    expect(await inputValue(page.locator(PIN)), "and truncation clamps the caret rather than throwing").toBe("123456");
});

test("a number field is a type rather than a component", async ({ page }) => {
    await expect(page.locator(NUMBER), "a number field is a type, not a component").toHaveAttribute("type", "number");
    await expect(page.locator(NUMBER), "and carries its stepping attributes").toHaveAttribute("step", "5");

    await page.locator(NUMBER).focus();
    await page.keyboard.press("ArrowUp");
    expect(await readout(page, "number"), "so an arrow steps by the step").toContain('value: "15"');
});

test("a read-only field refuses a keystroke and a paste alike", async ({ page }) => {
    expect(await isReadOnly(page.locator(READ_ONLY)), "a read-only field is readonly").toBe(true);
    await expect(page.locator(READ_ONLY), "and says so").toHaveAttribute("aria-readonly", "true");
    await expect(page.locator(READ_ONLY), "without claiming to be disabled").not.toHaveAttribute("aria-disabled");

    const before = await inputValue(page.locator(READ_ONLY));

    await page.locator(READ_ONLY).focus();
    await page.keyboard.type("x");
    await page.keyboard.insertText("pasted");
    expect(
        await inputValue(page.locator(READ_ONLY)),
        "and refuses both a keystroke and a paste, which no keystroke guard would have caught",
    ).toBe(before);
});

test("a disabled field shuts every write path and suppresses its caret", async ({ page }) => {
    expect(await isReadOnly(page.locator(DISABLED)), "disabled is readonly, so every write path is shut").toBe(true);
    await expect(page.locator(DISABLED), "while ARIA carries the disabled meaning").toHaveAttribute(
        "aria-disabled",
        "true",
    );
    expect(
        await computedStyle(page.locator(DISABLED), "caret-color"),
        "and the caret is suppressed, so a focusable disabled field does not invite typing",
    ).toBe("rgba(0, 0, 0, 0)");

    const before = await inputValue(page.locator(DISABLED));

    await page.locator(DISABLED).focus();
    await page.keyboard.insertText("pasted");
    expect(await inputValue(page.locator(DISABLED)), "a disabled field takes nothing").toBe(before);
});

test("an errored field announces itself invalid", async ({ page }) => {
    await expect(page.locator(EMAIL), "the error variant is an email field").toHaveAttribute("type", "email");
    expect(
        await inputValue(page.locator(EMAIL)),
        "whose initial sync survives a selection API that reports null instead of throwing",
    ).toBe("not-an-email");
    await expect(page.locator(EMAIL), "and an errored field is announced invalid").toHaveAttribute(
        "aria-invalid",
        "true",
    );
});

/**
 * Playwright has no IME API of its own, so the composition is driven straight over the DevTools
 * Protocol — the one place this suite still reaches past the library it is built on.
 */
test("a composition is left alone until it is committed", async ({ page }) => {
    const session = await page.context().newCDPSession(page);

    await page.locator(DEFAULT).focus();
    await page.keyboard.type("Ada");

    await session.send("Input.imeSetComposition", {
        text: "にほ",
        selectionStart: 2,
        selectionEnd: 2,
    });
    expect(
        await readout(page, "default"),
        "a value mid-composition is not reported, so the IME's own buffer is left alone",
    ).toContain('value: "Ada"');

    await session.send("Input.insertText", { text: "日本" });
    expect(await readout(page, "default"), "committing the composition reports it").toContain("Ada日本");
    expect(
        await inputValue(page.locator(DEFAULT)),
        "and the resync that follows does not write stale state over what the IME just committed",
    ).toBe("Ada日本");
});

const CITY = `${demo("suggestions")} [role="combobox"]`;
const SUGGESTION = '[role="listbox"] [role="option"]';
const ONE_TIME_CODE = `${demo("oneTimeCode")} input`;
const CODE_CELLS = `${demo("oneTimeCode")} [aria-hidden="true"] > div`;
const EDITABLE = demo("editable");

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
    await page.locator(CITY).focus();
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
    expect(await readout(page, "suggestions"), "which is what the owner holds").toContain('value: "b"');
});

test("the arrows walk the list and Enter writes the highlighted suggestion", async ({ page }) => {
    await page.locator(CITY).focus();
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
    expect(await readout(page, "suggestions"), "and the owner holds it").toContain('value: "Bruges"');
    await expect(page.locator(CITY), "the pick closes the list").toHaveAttribute("aria-expanded", "false");
    await expect(page.locator(CITY), "and focus never left the field").toBeFocused();
});

test("the up arrow on a closed list opens it on the last suggestion", async ({ page }) => {
    await page.locator(CITY).focus();
    await page.keyboard.type("t");
    await page.keyboard.press("Escape");
    await expect(page.locator(CITY)).toHaveAttribute("aria-expanded", "false");

    await page.keyboard.press("ArrowUp");

    await expect(page.locator(CITY), "the arrow reopens the list").toHaveAttribute("aria-expanded", "true");
    await expect(page.locator(CITY)).toHaveAttribute("aria-activedescendant", /.+/);
    expect(await activeDescendantText(page, CITY), "on its last suggestion").toContain("Tartu");
});

test("a suggestion can be picked with the pointer", async ({ page }) => {
    await page.locator(CITY).focus();
    await page.keyboard.type("po");
    await page.locator(SUGGESTION, { hasText: "Porto" }).first().click();

    expect(await inputValue(page.locator(CITY)), "clicking a suggestion writes it").toBe("Porto");
    await expect(page.locator(CITY), "and closes the list").toHaveAttribute("aria-expanded", "false");
});

test("Escape closes the list without touching the text, and an empty filter keeps it shut", async ({ page }) => {
    await page.locator(CITY).focus();
    await page.keyboard.type("Lis");
    await expect(page.locator(CITY)).toHaveAttribute("aria-expanded", "true");

    await page.keyboard.press("Escape");

    await expect(page.locator(CITY), "Escape closes the list").toHaveAttribute("aria-expanded", "false");
    expect(await inputValue(page.locator(CITY)), "and the text stays as typed rather than being restored").toBe("Lis");

    await page.keyboard.type("zzz");

    expect(await readout(page, "suggestions"), "any text is kept, even text nothing matches").toContain(
        'value: "Liszzz"',
    );
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

test("a one-time code field asks for digits and a code the platform can fill", async ({ page }) => {
    await expect(page.locator(ONE_TIME_CODE), "the platform is told this is a one-time code").toHaveAttribute(
        "autocomplete",
        "one-time-code",
    );
    await expect(page.locator(ONE_TIME_CODE), "and a phone is asked for its digit keyboard").toHaveAttribute(
        "inputmode",
        "numeric",
    );
    await expect(page.locator(ONE_TIME_CODE), "with a name of its own").toHaveAttribute("aria-label", "One-time code");
});

/**
 * The cells are paint over one real field, so a screen reader reads the field's value and never the cells:
 * the cells are hidden from it, and the digits they show have to be the field's digits in order.
 */
test("a one-time code keeps digits only, stops at six, and the cells show what the field holds", async ({ page }) => {
    await expect(page.locator(CODE_CELLS), "one cell per digit of the code").toHaveCount(6);

    await page.locator(ONE_TIME_CODE).focus();
    await page.keyboard.type("1a2b3");

    expect(await inputValue(page.locator(ONE_TIME_CODE)), "letters are refused by the mask").toBe("123");
    expect(await readout(page, "oneTimeCode"), "and the owner holds only the digits").toContain('value: "123"');
    expect(
        await page.locator(CODE_CELLS).allTextContents(),
        "each cell shows the digit in its place, and the rest stay empty",
    ).toEqual(["1", "2", "3", "", "", ""]);

    await page.keyboard.insertText("456789");

    expect(await inputValue(page.locator(ONE_TIME_CODE)), "a paste past the end is cut at six digits").toBe("123456");
    expect(await page.locator(CODE_CELLS).allTextContents()).toEqual(["1", "2", "3", "4", "5", "6"]);
});

/**
 * Which cell is next is drawn by a class, and what that class paints is the painter's business. So the
 * check is only that one cell is set apart from the rest while the field has focus — the one the next
 * digit will land in — and that none is once focus leaves.
 */
test("while focused, exactly the next empty cell is set apart from the others", async ({ page }) => {
    const cellClasses = () => attributesOf(page, CODE_CELLS, "class");
    const oddOneOut = (classes: Array<string | null>) =>
        classes
            .map((value, index) => ({ value, index }))
            .filter(({ value }) => classes.filter((other) => other === value).length === 1);

    const unfocused = await cellClasses();

    expect(new Set(unfocused).size, "with the field unfocused every cell is drawn the same").toBe(1);

    await page.locator(ONE_TIME_CODE).focus();
    await page.keyboard.type("12");

    const focused = await cellClasses();

    expect(
        oddOneOut(focused).map(({ index }) => index),
        "focused, the one cell set apart is the one the next digit lands in",
    ).toEqual([2]);

    await page.locator(ONE_TIME_CODE).blur();

    expect(new Set(await cellClasses()).size, "and none is once focus leaves").toBe(1);
});

test("edit in place swaps a button for a focused field holding the current text", async ({ page }) => {
    const button = page.locator(`${EDITABLE} button`);

    await expect(button, "the resting state is a button named after what it edits").toHaveAttribute(
        "aria-label",
        "Edit name, Ada Lovelace",
    );

    await button.click();

    await expect(page.locator(`${EDITABLE} input`), "pressing it opens a field").toBeFocused();
    expect(
        await inputValue(page.locator(`${EDITABLE} input`)),
        "which starts from the current text rather than empty",
    ).toBe("Ada Lovelace");
    await expect(page.locator(`${EDITABLE} button`), "and the button is gone while editing").toHaveCount(0);
    expect(await readout(page, "editable")).toContain("editing: true");
});

test("Enter keeps the edit and hands focus back to the button", async ({ page }) => {
    await page.locator(`${EDITABLE} button`).click();
    await page.locator(`${EDITABLE} input`).fill("Grace Hopper");
    await page.keyboard.press("Enter");

    expect(await readout(page, "editable"), "Enter keeps the edit").toContain('value: "Grace Hopper" | editing: false');
    await expect(page.locator(`${EDITABLE} button`), "and focus returns to the button, not to the page").toBeFocused();
    await expect(page.locator(`${EDITABLE} button`), "whose name follows the new text").toHaveAttribute(
        "aria-label",
        "Edit name, Grace Hopper",
    );
});

test("Escape puts the old text back", async ({ page }) => {
    await page.locator(`${EDITABLE} button`).click();
    await page.locator(`${EDITABLE} input`).fill("Someone else");
    await page.keyboard.press("Escape");

    expect(await readout(page, "editable"), "Escape throws the draft away").toContain(
        'value: "Ada Lovelace" | editing: false',
    );
    await expect(page.locator(`${EDITABLE} button`), "and focus returns to the button").toBeFocused();
});

test("leaving the field keeps the edit", async ({ page }) => {
    await page.locator(`${EDITABLE} button`).click();
    await page.locator(`${EDITABLE} input`).fill("Alan Turing");
    await page.keyboard.press("Tab");

    expect(await readout(page, "editable"), "focus leaving commits, the same as Enter").toContain(
        'value: "Alan Turing" | editing: false',
    );
});
