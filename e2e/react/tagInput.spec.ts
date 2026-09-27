import { expect, test } from "@playwright/test";

import { activeMatches, offsetHeight } from "../helpers";

/**
 * The React `TagInput`, a text field with the tags in front of it, each a button of its own, over the React
 * `InteractionWrapper`. The cases follow `e2e/tagInput.spec.ts`, which covers the Solid one: Enter turning text into
 * a tag, Backspace stepping onto a tag before it removes one, the arrows walking the tags and back to the field,
 * a consumer's transform refusing a word, the placeholder, wrapping, clicks reaching the field, and a disabled field
 * refusing everything. The right-to-left case mirrors the arrows, which the Solid spec does not cover.
 */
const FIELD = 'input[type="text"]';
const TAGS = '[role="group"] button';
const GROUP = '[role="group"]';
const TAGS_READOUT = '[data-readout="tags"]';

const tagNamed = (label: string) => `button[aria-label="${label}"]`;

test("typing and pressing Enter turns text into a tag, and empties the field", async ({ page, mount }) => {
    const component = await mount("Essentials/TagInput/Default");

    await component.locator(FIELD).fill("playwright");
    await page.keyboard.press("Enter");

    await expect(component.locator(TAGS_READOUT), "the typed word joins the list").toHaveText(
        "tags: solid, vanilla-extract, playwright",
    );
    await expect(component.locator(FIELD), "and the field is cleared to take the next one").toHaveValue("");
    await expect(component.locator(TAGS), "one tag element per value").toHaveCount(3);
});

test("Enter on an empty or blank field adds nothing", async ({ page, mount }) => {
    const component = await mount("Essentials/TagInput/Default");

    await component.locator(FIELD).press("Enter");
    await component.locator(FIELD).fill("   ");
    await page.keyboard.press("Enter");

    await expect(component.locator(TAGS_READOUT), "whitespace is not a tag").toHaveText("tags: solid, vanilla-extract");
});

/**
 * The first Backspace in an empty field steps onto the last tag rather than deleting it, so a reader has something
 * focused to hear before anything is lost; a second press removes it.
 */
test("Backspace steps into the tags before it deletes one", async ({ page, mount }) => {
    const component = await mount("Essentials/TagInput/Default");

    await component.locator(FIELD).fill("half typed");
    await page.keyboard.press("Backspace");
    expect(await activeMatches(page, FIELD), "Backspace with text in the field stays in the field").toBe(true);

    await component.locator(FIELD).fill("");
    await page.keyboard.press("Backspace");
    expect(
        await activeMatches(page, tagNamed("vanilla-extract")),
        "on an empty field it steps back onto the last tag instead of deleting it",
    ).toBe(true);
    await expect(component.locator(TAGS_READOUT), "and nothing has been removed yet").toHaveText(
        "tags: solid, vanilla-extract",
    );

    await page.keyboard.press("Backspace");
    await expect(component.locator(TAGS_READOUT), "a second press removes the tag focus is on").toHaveText(
        "tags: solid",
    );
    expect(await activeMatches(page, tagNamed("solid")), "and focus lands on the neighbor").toBe(true);
});

test("arrows walk the tags and return to the field", async ({ page, mount }) => {
    const component = await mount("Essentials/TagInput/Default");

    await component.locator(FIELD).press("ArrowLeft");
    expect(
        await activeMatches(page, tagNamed("vanilla-extract")),
        "ArrowLeft from an empty field enters the tags",
    ).toBe(true);

    await page.keyboard.press("ArrowLeft");
    expect(await activeMatches(page, tagNamed("solid")), "and walks towards the start").toBe(true);

    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");
    expect(await activeMatches(page, FIELD), "walking past the last tag returns to the field").toBe(true);
});

test("on a right-to-left page the arrows walk mirrored", async ({ page, mount }) => {
    const component = await mount("Essentials/TagInput/RightToLeft");

    await component.locator(FIELD).press("ArrowRight");
    expect(
        await activeMatches(page, tagNamed("vanilla-extract")),
        "the arrow pointing back is the right one, and it enters the tags",
    ).toBe(true);

    await page.keyboard.press("ArrowRight");
    expect(await activeMatches(page, tagNamed("solid")), "and walks towards the start").toBe(true);

    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("ArrowLeft");
    expect(await activeMatches(page, FIELD), "while the left arrow walks forward, back to the field").toBe(true);
});

test("pressing a tag removes it", async ({ mount }) => {
    const component = await mount("Essentials/TagInput/Default");

    await component.locator(TAGS).first().click();

    await expect(component.locator(TAGS_READOUT), "the pressed tag is gone and the rest stay in order").toHaveText(
        "tags: vanilla-extract",
    );
});

test("a consumer's transform can refuse a word", async ({ page, mount }) => {
    const component = await mount("Essentials/TagInput/Unique");

    await component.locator(FIELD).fill("SOLID");
    await page.keyboard.press("Enter");

    await expect(
        component.locator(TAGS_READOUT),
        "a duplicate is refused however it was cased, and no untransformed copy sneaks in either",
    ).not.toContainText("SOLID");
    await expect(component.locator(TAGS), "so the list is the length it started at").toHaveCount(2);
    await expect(component.locator(FIELD), "and the refused text is still there to be edited").toHaveValue("SOLID");
});

test("a placeholder shows only while there is nothing at all", async ({ page, mount }) => {
    const component = await mount("Essentials/TagInput/Empty");

    await expect(component.locator(GROUP), "an empty field shows its placeholder").toContainText(
        "Type and press Enter",
    );

    await component.locator(FIELD).fill("first");
    await page.keyboard.press("Enter");

    await expect(component.locator(GROUP), "and drops it as soon as a tag exists").not.toContainText(
        "Type and press Enter",
    );
});

test("tags wrap in a narrow box, and the box grows to hold them", async ({ mount }) => {
    const single = await mount("Essentials/TagInput/Default");
    const singleHeight = await offsetHeight(single.locator(GROUP));

    const crowded = await mount("Essentials/TagInput/Crowded");

    expect(
        await offsetHeight(crowded.locator(GROUP)),
        "twelve tags in 240px stand several rows tall, so nothing is clipped or hidden",
    ).toBeGreaterThan(singleHeight);
});

test("the box takes a click and the caret lands in the field", async ({ page, mount }) => {
    const component = await mount("Essentials/TagInput/Default");

    await component.locator(GROUP).click({ position: { x: 4, y: 4 } });

    await expect(component.locator(FIELD), "the padding around the tags belongs to the field").toBeFocused();

    await page.keyboard.type("typed");
    await expect(component.locator(FIELD), "and the keystrokes reach it").toHaveValue("typed");
});

test("a disabled tag input refuses the keyboard as well as the pointer", async ({ mount }) => {
    const component = await mount("Essentials/TagInput/Default", { isDisabled: true });

    await expect(component.locator(FIELD), "the field says so through ARIA").toHaveAttribute("aria-disabled", "true");
    await expect(component.locator(TAGS).first(), "and so does every tag").toHaveAttribute("aria-disabled", "true");

    await component.locator(FIELD).press("Enter");
    await component.locator(TAGS).first().press("Backspace");
    await component.locator(TAGS).first().click({ force: true });

    await expect(component.locator(TAGS_READOUT), "neither adding nor removing gets through").toHaveText(
        "tags: solid, vanilla-extract",
    );
});

test("what is typed paints above the box that was painted for it", async ({ page, mount }) => {
    const component = await mount("Essentials/TagInput/Default");

    expect(
        await component.locator(GROUP).evaluate((element) => getComputedStyle(element).position),
        "the control is positioned, so it is not painted under its own decoration",
    ).not.toBe("static");

    await component.locator(FIELD).click();
    await page.keyboard.type("visible");

    await expect(component.locator(FIELD)).toHaveValue("visible");
});

test("the field is a row of its own beneath the tags", async ({ mount }) => {
    const component = await mount("Essentials/TagInput/Default");

    const layout = await component.locator(GROUP).evaluate((element) => {
        const rect = (node: Element) => node.getBoundingClientRect();
        const input = rect(element.querySelector("input")!);
        const tags = Array.from(element.querySelectorAll("button")).map(rect);

        return {
            below: tags.every((tag) => input.top >= tag.bottom),
            tagRows: new Set(tags.map((tag) => Math.round(tag.top))).size,
            fillsWidth: Math.round(input.width) >= Math.round(rect(element).width) - 30,
        };
    });

    expect(layout.tagRows, "the two tags share a line").toBe(1);
    expect(layout.below, "and the field starts below every one of them").toBe(true);
    expect(layout.fillsWidth, "taking the whole row rather than the gap at the end of the tags").toBe(true);
});

test("the painter sets the caret, as it does on every other field", async ({ mount }) => {
    const component = await mount("Essentials/TagInput/Default");

    const caret = await component.locator(FIELD).evaluate((element) => getComputedStyle(element).caretColor);

    expect(caret, "the caret is the painter's, not the inherited text color").not.toBe(
        await component.locator(FIELD).evaluate((element) => getComputedStyle(element).color),
    );
});

test("typing while a tag has focus returns to the field and keeps the character", async ({ page, mount }) => {
    const component = await mount("Essentials/TagInput/Default");

    await component.locator(FIELD).press("ArrowLeft");
    expect(await activeMatches(page, tagNamed("vanilla-extract")), "focus starts on a tag").toBe(true);

    await page.keyboard.type("z");

    expect(await activeMatches(page, FIELD), "a letter puts focus back in the field").toBe(true);
    await expect(component.locator(FIELD), "and the letter is not swallowed on the way").toHaveValue("z");
    await expect(component.locator(TAGS_READOUT), "while the tags are left alone").toHaveText(
        "tags: solid, vanilla-extract",
    );
});
