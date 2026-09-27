import { type Page, expect, test } from "@playwright/test";

import { activeDescendantText, attributesOf, inputValue } from "../helpers";

/**
 * The React `TextInput`'s suggestions, over the React `TextField`, `Popover` and `ListboxReactUtils.useCursor`. The
 * cases follow the suggestion half of `e2e/textInput.spec.ts`; the text-field half is `e2e/react/textField.spec.ts`.
 * They cover a combobox that starts closed and keeps the browser's own list away, nothing highlighted until the arrows
 * move into the list, Enter keeping typed text or writing the highlighted suggestion, the up arrow reopening on the
 * last suggestion, a pointer pick, Escape leaving the text alone, and an empty filter keeping the list shut. Three
 * have no Solid counterpart: a field without suggestions is no combobox, a pick with no text of the consumer's own
 * writes what a screen reader reads, and a disabled or read-only field never opens the list.
 */
const STORY = "Essentials/TextInput/Cities";
const CITY = '[role="combobox"]';
const SUGGESTION = '[role="listbox"] [role="option"]';

const readout = (page: Page, key: string) => page.locator(`[data-readout="${key}"]`);

/** The list's id is minted per mount, so it is reached through the field's own `aria-controls`. */
const suggestionList = async (page: Page) => {
    const id = await page.locator(CITY).getAttribute("aria-controls");

    return page.locator(`[id="${id}"]`);
};

test("a field with suggestions is a combobox that starts closed and keeps the browser's own list away", async ({
    page,
    mount,
}) => {
    await mount(STORY);

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

test("a field without suggestions is a plain text field", async ({ page, mount }) => {
    await mount("Essentials/TextInput/Plain");

    await expect(page.locator("#field"), "it takes no combobox role").not.toHaveAttribute("role");
    await expect(page.locator("#field"), "and says nothing about a popup").not.toHaveAttribute("aria-haspopup");
    await expect(page.locator("#field"), "nor turns the browser's autofill off").not.toHaveAttribute("autocomplete");
});

test("typing opens the list with nothing highlighted, and Enter keeps the typed text", async ({ page, mount }) => {
    await mount(STORY);
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
    expect(await activeDescendantText(page, CITY), "and nothing is highlighted until the arrows move").toBeNull();

    await page.keyboard.press("Enter");

    await expect(page.locator(CITY), "Enter with nothing highlighted closes the list").toHaveAttribute(
        "aria-expanded",
        "false",
    );
    expect(await inputValue(page.locator(CITY)), "and leaves the typed text alone").toBe("b");
    await expect(readout(page, "value"), "which is what the owner holds").toHaveText('value: "b"');
});

test("the arrows walk the list and Enter writes the highlighted suggestion", async ({ page, mount }) => {
    await mount(STORY);
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

    await expect
        .poll(() => inputValue(page.locator(CITY)), { message: "Enter writes the suggestion's own text" })
        .toBe("Bruges");
    await expect(readout(page, "value"), "and the owner holds it").toHaveText('value: "Bruges"');
    await expect(readout(page, "picks"), "and hears which suggestion it was").toHaveText("Bruges");
    await expect(page.locator(CITY), "the pick closes the list").toHaveAttribute("aria-expanded", "false");
    await expect(page.locator(CITY), "and focus never left the field").toBeFocused();
});

test("without text of the consumer's own, a pick writes what a screen reader reads of the suggestion", async ({
    page,
    mount,
}) => {
    await mount(STORY, { hasCustomText: false });
    await page.locator(CITY).focus();
    await page.keyboard.type("po");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");

    await expect(readout(page, "value"), "the painter's hidden country stays out of the field").toHaveText(
        'value: "Porto"',
    );
});

test("the up arrow on a closed list opens it on the last suggestion", async ({ page, mount }) => {
    await mount(STORY);
    await page.locator(CITY).focus();
    await page.keyboard.type("t");
    await expect(page.locator(CITY)).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Escape");
    await expect(page.locator(CITY)).toHaveAttribute("aria-expanded", "false");

    await page.keyboard.press("ArrowUp");

    await expect(page.locator(CITY), "the arrow reopens the list").toHaveAttribute("aria-expanded", "true");
    await expect(page.locator(CITY)).toHaveAttribute("aria-activedescendant", /.+/);
    expect(await activeDescendantText(page, CITY), "on its last suggestion").toContain("Tartu");
});

test("a suggestion can be picked with the pointer", async ({ page, mount }) => {
    await mount(STORY);
    await page.locator(CITY).focus();
    await page.keyboard.type("po");
    await page.locator(SUGGESTION, { hasText: "Porto" }).first().click();

    await expect
        .poll(() => inputValue(page.locator(CITY)), { message: "clicking a suggestion writes it" })
        .toBe("Porto");
    await expect(page.locator(CITY), "and closes the list").toHaveAttribute("aria-expanded", "false");
});

test("Escape closes the list without touching the text, and an empty filter keeps it shut", async ({ page, mount }) => {
    await mount(STORY);
    await page.locator(CITY).focus();
    await page.keyboard.type("Lis");
    await expect(page.locator(CITY)).toHaveAttribute("aria-expanded", "true");

    await page.keyboard.press("Escape");

    await expect(page.locator(CITY), "Escape closes the list").toHaveAttribute("aria-expanded", "false");
    expect(await inputValue(page.locator(CITY)), "and the text stays as typed rather than being restored").toBe("Lis");

    await page.keyboard.type("zzz");

    await expect(readout(page, "value"), "any text is kept, even text nothing matches").toHaveText('value: "Liszzz"');
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

/** Both fields start holding text with suggestions to show, so only the refusal keeps the list shut. */
test("a read-only or disabled field never opens the list", async ({ page, mount }) => {
    await mount(STORY, { initial: "b" });
    await page.locator(CITY).focus();
    await page.keyboard.press("ArrowDown");

    await expect(page.locator(CITY), "an editable field holding text opens on the arrow").toHaveAttribute(
        "aria-expanded",
        "true",
    );

    await mount(STORY, { initial: "b", isReadOnly: true });
    await page.locator(CITY).focus();
    await page.keyboard.press("ArrowDown");

    await expect(page.locator(CITY), "a read-only field stays closed").toHaveAttribute("aria-expanded", "false");

    await mount(STORY, { initial: "b", isDisabled: true });
    await page.locator(CITY).focus();
    await page.keyboard.press("ArrowDown");

    await expect(page.locator(CITY), "and so does a disabled one").toHaveAttribute("aria-expanded", "false");
});
