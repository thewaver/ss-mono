import { expect, test } from "@playwright/test";

import { computedStyle, inputValue, isReadOnly, selectionRange, setSelectionRange } from "../helpers";

/**
 * The React `TextField` as a single-line input, over the React `InteractionWrapper`. The cases follow the text-field
 * half of `e2e/textInput.spec.ts`, which covers the Solid one through `TextInput`: the input kept in step with its
 * owner without the caret jumping, a setter that rewrites or refuses what was typed, read-only and disabled shutting
 * every write path, composition left alone until it is committed, and the text inset past what sits beside it.
 */
const FIELD = "#field";
const VALUE = '[data-readout="value"]';

test("no field uses the native disabled attribute", async ({ mount }) => {
    const component = await mount("Primitives/TextField/Disabled");

    await expect(component.locator("input[disabled]")).toHaveCount(0);
});

test("typing reports each keystroke, and the placeholder follows whether the field is empty", async ({
    page,
    mount,
}) => {
    const component = await mount("Primitives/TextField/Default");

    await expect(component.getByTestId("placeholder"), "an empty field shows its placeholder").toBeVisible();

    await component.locator(FIELD).focus();
    await page.keyboard.type("Ada");

    await expect(component.locator(VALUE), "typing reports each keystroke").toHaveText('value: "Ada"');
    expect(await inputValue(component.locator(FIELD)), "and the text stays where it was typed").toBe("Ada");
    await expect(component.getByTestId("placeholder"), "and the placeholder goes").toHaveCount(0);

    await setSelectionRange(component.locator(FIELD), 1, 1);
    await page.keyboard.type("x");

    expect(await inputValue(component.locator(FIELD)), "a mid-string keystroke lands where the caret was").toBe("Axda");
    expect(await selectionRange(component.locator(FIELD)), "and the caret stays after it").toEqual({
        start: 2,
        end: 2,
    });
});

test("a value set from outside is written into the field", async ({ mount }) => {
    const component = await mount("Primitives/TextField/Default", { initial: "Grace" });

    expect(await inputValue(component.locator(FIELD))).toBe("Grace");
});

test("a transforming setter rewrites the value and keeps the caret", async ({ page, mount }) => {
    const component = await mount("Primitives/TextField/TransformingSetter");

    await component.locator(FIELD).focus();
    await page.keyboard.type("ab");
    await expect(component.locator(VALUE), "a transforming setter is applied").toHaveText('value: "AB"');
    expect(await inputValue(component.locator(FIELD)), "and the DOM is corrected to match it").toBe("AB");

    await setSelectionRange(component.locator(FIELD), 1, 1);
    await page.keyboard.type("c");
    expect(await inputValue(component.locator(FIELD)), "a mid-string keystroke lands where the caret was").toBe("ACB");
    expect(
        await selectionRange(component.locator(FIELD)),
        "and the caret is restored after the rewrite rather than collapsing to the end",
    ).toEqual({ start: 2, end: 2 });
});

test("a refusing setter drops what it will not take", async ({ page, mount }) => {
    const component = await mount("Primitives/TextField/RefusingSetter");

    await component.locator(FIELD).focus();
    await page.keyboard.type("12ab34");
    expect(await inputValue(component.locator(FIELD)), "a refusing setter drops what it will not take").toBe("1234");
    await expect(component.locator(FIELD), "and the owner's own verdict reaches the field").toHaveAttribute(
        "aria-invalid",
        "true",
    );

    await page.keyboard.type("567");
    expect(await inputValue(component.locator(FIELD)), "and truncation clamps the caret rather than throwing").toBe(
        "123456",
    );
    await expect(component.locator(FIELD)).not.toHaveAttribute("aria-invalid");
});

test("a number field is a type rather than a component", async ({ page, mount }) => {
    const component = await mount("Primitives/TextField/NumberField");

    await expect(component.locator(FIELD), "a number field is a type, not a component").toHaveAttribute(
        "type",
        "number",
    );
    await expect(component.locator(FIELD), "and carries its stepping attributes").toHaveAttribute("step", "5");
    await expect(
        component.locator(FIELD),
        "without announcing a spin button it was not asked to be",
    ).not.toHaveAttribute("role");

    await component.locator(FIELD).focus();
    await page.keyboard.press("ArrowUp");
    await expect(component.locator(VALUE), "so an arrow steps by the step").toHaveText('value: "15"');
});

test("a spin button announces the number it holds and its range", async ({ page, mount }) => {
    const component = await mount("Primitives/TextField/NumberField", { isSpinButton: true });

    await expect(component.locator(FIELD)).toHaveAttribute("role", "spinbutton");
    await expect(component.locator(FIELD)).toHaveAttribute("aria-valuenow", "10");
    await expect(component.locator(FIELD)).toHaveAttribute("aria-valuemin", "0");
    await expect(component.locator(FIELD)).toHaveAttribute("aria-valuemax", "100");

    await component.locator(FIELD).focus();
    await page.keyboard.press("ArrowUp");
    await expect(component.locator(FIELD), "and the value it announces follows the text").toHaveAttribute(
        "aria-valuenow",
        "15",
    );
});

test("a read-only field refuses a keystroke and a paste alike", async ({ page, mount }) => {
    const component = await mount("Primitives/TextField/ReadOnly");

    expect(await isReadOnly(component.locator(FIELD)), "a read-only field is readonly").toBe(true);
    await expect(component.locator(FIELD), "and says so").toHaveAttribute("aria-readonly", "true");
    await expect(component.locator(FIELD), "without claiming to be disabled").not.toHaveAttribute("aria-disabled");

    const before = await inputValue(component.locator(FIELD));

    await component.locator(FIELD).focus();
    await page.keyboard.type("x");
    await page.keyboard.insertText("pasted");
    expect(await inputValue(component.locator(FIELD)), "and refuses both a keystroke and a paste").toBe(before);
});

test("a disabled field shuts every write path and suppresses its caret", async ({ page, mount }) => {
    const component = await mount("Primitives/TextField/Disabled");

    expect(await isReadOnly(component.locator(FIELD)), "disabled is readonly, so every write path is shut").toBe(true);
    await expect(component.locator(FIELD), "while ARIA carries the disabled meaning").toHaveAttribute(
        "aria-disabled",
        "true",
    );
    expect(
        await computedStyle(component.locator(FIELD), "caret-color"),
        "and the caret is suppressed, so a focusable disabled field does not invite typing",
    ).toBe("rgba(0, 0, 0, 0)");

    const before = await inputValue(component.locator(FIELD));

    await component.locator(FIELD).focus();
    await page.keyboard.insertText("pasted");
    expect(await inputValue(component.locator(FIELD)), "a disabled field takes nothing").toBe(before);
});

test("an errored field announces itself invalid, and its first value is written in", async ({ mount }) => {
    const component = await mount("Primitives/TextField/Errored");

    await expect(component.locator(FIELD), "the error variant is an email field").toHaveAttribute("type", "email");
    expect(
        await inputValue(component.locator(FIELD)),
        "whose initial sync survives a selection API that reports null instead of throwing",
    ).toBe("not-an-email");
    await expect(component.locator(FIELD), "and an errored field is announced invalid").toHaveAttribute(
        "aria-invalid",
        "true",
    );
    await expect(component.locator(FIELD)).toHaveAttribute("aria-required", "true");
});

/**
 * Playwright has no IME API of its own, so the composition is driven straight over the DevTools Protocol, as the
 * Solid spec does.
 */
test("a composition is left alone until it is committed", async ({ page, mount }) => {
    const component = await mount("Primitives/TextField/Default");
    const session = await page.context().newCDPSession(page);

    await component.locator(FIELD).focus();
    await page.keyboard.type("Ada");

    await session.send("Input.imeSetComposition", { text: "にほ", selectionStart: 2, selectionEnd: 2 });
    await expect(
        component.locator(VALUE),
        "a value mid-composition is not reported, so the IME's own buffer is left alone",
    ).toHaveText('value: "Ada"');

    await session.send("Input.insertText", { text: "日本" });
    await expect(component.locator(VALUE), "committing the composition reports it").toHaveText('value: "Ada日本"');
    expect(
        await inputValue(component.locator(FIELD)),
        "and the resync that follows does not write stale state over what the IME just committed",
    ).toBe("Ada日本");
});

test("the text is inset past what sits before and after it, and the field is kept wide enough for both", async ({
    mount,
}) => {
    const component = await mount("Primitives/TextField/Adorned");

    await expect(component.locator(FIELD), "the leading side clears the padding, the adornment and the gap").toHaveCSS(
        "padding-left",
        "36px",
    );
    await expect(component.locator(FIELD)).toHaveCSS("padding-right", "36px");
    await expect(component.locator('[role="presentation"]').first(), "and the box never shrinks below them").toHaveCSS(
        "min-width",
        "72px",
    );

    const bare = await mount("Primitives/TextField/Adorned", { hasLeading: false });

    await expect(bare.locator(FIELD), "no adornment leaves the padding alone, with no stray gap").toHaveCSS(
        "padding-left",
        "8px",
    );
});

test("inside a Label the caption names the field, and its own aria-label is dropped", async ({ mount }) => {
    const component = await mount("Primitives/TextField/Labeled");

    await expect(component.locator(FIELD)).not.toHaveAttribute("aria-label");
    await expect(component.locator(FIELD)).toHaveAccessibleName("Nickname");
});

test("inside a FormField the field is described by the field's message", async ({ mount }) => {
    const component = await mount("Primitives/TextField/InField");

    const describedBy = await component.locator(FIELD).getAttribute("aria-describedby");

    expect(describedBy, "the control carries a description reference it did not have to be given").toBeTruthy();
    await expect(component.locator(`[id="${describedBy}"]`)).toHaveText("Shown on your profile.");
});
