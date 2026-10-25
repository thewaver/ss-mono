import { type Page, expect, test } from "@playwright/test";

import { docsDemo, docsSettled, offsetHeight, prop } from "./helpers";

const DOCS = "/src/App/Pages/TagInputPage/Docs";

const BASIC = docsDemo(DOCS, "Basic");
const EMPTY = docsDemo(DOCS, "Empty");
const UNIQUE = docsDemo(DOCS, "Unique");
const CROWDED = docsDemo(DOCS, "Crowded");
const LABELED = docsDemo(DOCS, "Labeled");

const field = (scope: string) => `${scope} input[type="text"]`;
const box = (scope: string) => `${scope} [role="group"]`;
const tag = (scope: string) => `${box(scope)} button`;

/**
 * No example shows its tags in a readout, so the list is read the way a sighted person reads it: the words the tags
 * show, in order. Each tag's accessible name says more than its word, so the words are the tags' text, less the
 * decorative remove glyph the painter hides from screen readers.
 */
const tagWords = (page: Page, scope: string) =>
    page.locator(tag(scope)).evaluateAll((tags) =>
        tags.map((element) => {
            const clone = element.cloneNode(true) as HTMLElement;

            for (const hidden of clone.querySelectorAll('[aria-hidden="true"]')) hidden.remove();

            return (clone.textContent ?? "").trim();
        }),
    );

/** Replaces the field's text the way a person does: click into it, select everything, type over it. */
const typeInto = async (page: Page, scope: string, text: string) => {
    await page.locator(field(scope)).click();
    await page.keyboard.press("ControlOrMeta+a");
    await page.keyboard.type(text);
};

/** Empties the field with the keyboard, which a Backspace on text already there does without leaving it. */
const clearField = async (page: Page, scope: string) => {
    await page.locator(field(scope)).click();
    await page.keyboard.press("ControlOrMeta+a");
    await page.keyboard.press("Delete");
};

test.beforeEach(async ({ page }) => {
    await page.goto("/tag-input/docs");
    await expect(page.locator(field(BASIC))).toBeVisible();
    await docsSettled(page);
});

test("typing and pressing Enter turns text into a tag, and empties the field", async ({ page }) => {
    const before = await tagWords(page, BASIC);

    await typeInto(page, BASIC, "playwright");
    await page.keyboard.press("Enter");

    expect(await tagWords(page, BASIC), "the typed word joins the end of the list").toEqual([...before, "playwright"]);
    await expect(page.locator(field(BASIC)), "and the field is cleared to take the next one").toHaveValue("");
});

test("Enter on an empty or blank field adds nothing", async ({ page }) => {
    const before = await tagWords(page, BASIC);

    await page.locator(field(BASIC)).click();
    await page.keyboard.press("Enter");
    await typeInto(page, BASIC, "   ");
    await page.keyboard.press("Enter");

    expect(await tagWords(page, BASIC), "whitespace is not a tag").toEqual(before);
});

/**
 * Each tag is a button that removes it, so its name says both: the word first, as the tag shows it (WCAG 2.5.3,
 * the visible words begin the name), then what pressing does (2.4.6). The words come from the consumer's
 * `computeTagAriaLabel`.
 */
test("each tag is named by its word first, then by what pressing it does", async ({ page }) => {
    const words = await tagWords(page, BASIC);
    const tags = page.locator(tag(BASIC));

    expect(words.length, "the example starts with tags").toBeGreaterThan(0);

    for (const [index, word] of words.entries()) {
        const name = (await tags.nth(index).getAttribute("aria-label")) ?? "";

        expect(name.startsWith(word), "the name begins with the word the tag shows").toBe(true);
        expect(name, "and says more than the word alone").not.toBe(word);
    }
});

/**
 * Backspace on an empty field is the one keystroke everybody gets wrong. Deleting the last tag outright is
 * destructive and unannounced — the value changes with nothing focused to report it. So the first press
 * *steps into* the tags instead, moving focus onto the last one; a second press then removes the thing the
 * caret is demonstrably on. That gives a screen reader something to announce between the two, and gives a
 * sighted user a visible focus ring before anything is lost.
 *
 * The guard on the first assertion matters: Backspace must only leave the field when the field is empty,
 * or it would swallow ordinary text editing.
 */
test("Backspace steps into the tags before it deletes one", async ({ page }) => {
    const before = await tagWords(page, BASIC);
    const tags = page.locator(tag(BASIC));

    await typeInto(page, BASIC, "half typed");
    await page.keyboard.press("Backspace");
    await expect(page.locator(field(BASIC)), "Backspace with text in the field stays in the field").toBeFocused();

    await clearField(page, BASIC);
    await page.keyboard.press("Backspace");
    await expect(
        tags.nth(before.length - 1),
        "on an empty field it steps back onto the last tag instead of deleting it",
    ).toBeFocused();
    expect(await tagWords(page, BASIC), "and nothing has been removed yet").toEqual(before);

    await page.keyboard.press("Backspace");
    expect(await tagWords(page, BASIC), "a second press removes the tag focus is on").toEqual(before.slice(0, -1));
    await expect(tags.nth(before.length - 2), "and focus lands on the neighbor").toBeFocused();
});

test("arrows walk the tags and return to the field", async ({ page }) => {
    const count = (await tagWords(page, BASIC)).length;
    const tags = page.locator(tag(BASIC));

    await page.locator(field(BASIC)).click();
    await page.keyboard.press("ArrowLeft");
    await expect(tags.nth(count - 1), "ArrowLeft from an empty field enters the tags").toBeFocused();

    await page.keyboard.press("ArrowLeft");
    await expect(tags.nth(count - 2), "and walks towards the start").toBeFocused();

    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");
    await expect(page.locator(field(BASIC)), "walking past the last tag returns to the field").toBeFocused();
});

test("pressing a tag removes it", async ({ page }) => {
    const before = await tagWords(page, BASIC);

    await page.locator(tag(BASIC)).first().click();

    expect(await tagWords(page, BASIC), "the pressed tag is gone and the rest stay in order").toEqual(before.slice(1));
});

/**
 * The consumer decides what a typed word becomes, so refusing one is their arithmetic rather than a prop.
 * Returning nothing from that transform is how a duplicate — or anything else unwanted — gets declined, and
 * the field deliberately keeps the text so the person can edit rather than retype it.
 */
test("a consumer's transform can refuse a word", async ({ page }) => {
    const before = await tagWords(page, UNIQUE);
    const duplicate = before[0].toUpperCase();

    await typeInto(page, UNIQUE, duplicate);
    await page.keyboard.press("Enter");

    expect(
        await tagWords(page, UNIQUE),
        "a duplicate is refused however it was cased, and no untransformed copy sneaks in either",
    ).toEqual(before);
    await expect(page.locator(field(UNIQUE)), "and the refused text is still there to be edited").toHaveValue(
        duplicate,
    );
});

test("a placeholder shows only while there is nothing at all", async ({ page }) => {
    const placeholder = ((await page.locator(box(EMPTY)).textContent()) ?? "").trim();

    expect(placeholder, "an empty field shows its placeholder").not.toBe("");

    await typeInto(page, EMPTY, "first");
    await page.keyboard.press("Enter");

    await expect(page.locator(box(EMPTY)), "and drops it as soon as a tag exists").not.toContainText(placeholder);
});

/**
 * The height follows the value: tags wrap and the box grows rather than clipping or scrolling. That is the
 * behavior the alternatives were weighed against, so it is worth pinning — a later change to capping or
 * scrolling should have to break this test deliberately rather than quietly.
 */
test("tags wrap in a narrow box, and the box grows to hold them", async ({ page }) => {
    const crowded = page.locator(box(CROWDED));
    const tagRows = await page
        .locator(tag(CROWDED))
        .evaluateAll((tags) => new Set(tags.map((element) => Math.round(element.getBoundingClientRect().top))).size);

    expect(tagRows, "the crowded tags wrap onto several rows").toBeGreaterThan(1);
    expect(
        await offsetHeight(crowded),
        "and the box stands taller than one holding a single row, so nothing is clipped or hidden",
    ).toBeGreaterThan(await offsetHeight(page.locator(box(BASIC))));
});

/**
 * `InteractionWrapper`'s root turns pointer events off for the whole control and each part turns them back on
 * for itself; the field never did, so it was invisible to the mouse — the box looked like a text field, took a
 * click, and did nothing. So a press on the box's padding is asserted, not only typing.
 */
test("the box takes a click and the caret lands in the field", async ({ page }) => {
    await page.locator(box(BASIC)).click({ position: { x: 4, y: 4 } });

    await expect(
        page.locator(field(BASIC)),
        "the padding around the tags belongs to the field, the way it does in any text box",
    ).toBeFocused();

    await page.keyboard.type("typed");
    await expect(page.locator(field(BASIC)), "and the keystrokes reach it").toHaveValue("typed");
});

test("a disabled tag input refuses the keyboard as well as the pointer", async ({ page }) => {
    await page.locator(`${prop("isDisabled")} input`).click();

    const before = await tagWords(page, BASIC);

    await page.locator(field(BASIC)).press("Enter");
    await page.locator(tag(BASIC)).first().press("Backspace");
    await page.locator(tag(BASIC)).first().click({ force: true });

    expect(await tagWords(page, BASIC), "neither adding nor removing gets through").toEqual(before);
});

/**
 * The painter's box is `position: absolute; inset: 0`, and a positioned element paints above ordinary
 * in-flow content however early it appears in the markup. So the opaque background drew straight over the
 * typed text: the value was in the DOM, the caret was in the field, and the box looked empty. The tags
 * escaped it only because each one sits in an `InteractionWrapper` and is positioned too. Making the box
 * itself positioned puts it back on the painter's side of the order, which is what the assertion below is
 * really about — `static` here means invisible text, however well everything else behaves.
 */
test("what is typed paints above the box that was painted for it", async ({ page }) => {
    expect(
        await page.locator(box(BASIC)).evaluate((element) => getComputedStyle(element).position),
        "the control is positioned, so it is not painted under its own decoration",
    ).not.toBe("static");

    await page.locator(field(BASIC)).click();
    await page.keyboard.type("visible");

    await expect(page.locator(field(BASIC)), "and the value is on screen rather than only in the DOM").toHaveValue(
        "visible",
    );
});

/**
 * The field is a row of its own under the tags, the user's call. `flex: 1 0 100%` is what does it: a 100% basis
 * cannot share a line with anything, so the field breaks onto the next one however few tags there are. The
 * earlier arrangement let it sit beside them, which reads as a search box with chips in front of the caret
 * rather than as a list with a place to add to it.
 */
test("the field is a row of its own beneath the tags", async ({ page }) => {
    const layout = await page.locator(box(BASIC)).evaluate((element) => {
        const rect = (node: Element) => node.getBoundingClientRect();
        const input = rect(element.querySelector("input")!);
        const tags = Array.from(element.querySelectorAll("button")).map(rect);

        return {
            below: tags.every((tag) => input.top >= tag.bottom),
            tagRows: new Set(tags.map((tag) => Math.round(tag.top))).size,
            fillsWidth: Math.round(input.width) >= Math.round(rect(element).width) - 30,
        };
    });

    expect(layout.tagRows, "the tags share a line").toBe(1);
    expect(layout.below, "and the field starts below every one of them").toBe(true);
    expect(layout.fillsWidth, "taking the whole row rather than the gap at the end of the tags").toBe(true);
});

/**
 * The caret is paint, so it belongs to whoever painted the box — the same argument `computeTextStyle`
 * settles for `TextField`, whose slot and type this reuses rather than declaring a second one. Without it
 * the caret fell back to the text color while every other field on the site had the theme's own, which is
 * the sort of difference that is invisible in markup and obvious on screen.
 */
test("the painter sets the caret, as it does on every other field", async ({ page }) => {
    const caret = await page.locator(field(BASIC)).evaluate((element) => getComputedStyle(element).caretColor);

    expect(caret, "the caret is the theme's, not the inherited text color").not.toBe(
        await page.locator(field(BASIC)).evaluate((element) => getComputedStyle(element).color),
    );
});

/**
 * Walking onto a tag is a detour, not a destination: the tags answer Backspace, Delete and the arrows and
 * nothing else, so a letter typed there used to go nowhere at all — no character, no movement, no sound.
 * A printable key now hands focus back to the field and the character lands in it, which is the only
 * outcome anyone pressing a letter could have meant.
 */
test("typing while a tag has focus returns to the field and keeps the character", async ({ page }) => {
    const before = await tagWords(page, BASIC);

    await page.locator(field(BASIC)).click();
    await page.keyboard.press("ArrowLeft");
    await expect(page.locator(tag(BASIC)).last(), "focus starts on a tag").toBeFocused();

    await page.keyboard.type("z");

    await expect(page.locator(field(BASIC)), "a letter puts focus back in the field").toBeFocused();
    await expect(page.locator(field(BASIC)), "and the letter is not swallowed on the way").toHaveValue("z");
    expect(await tagWords(page, BASIC), "while the tags are left alone").toEqual(before);
});

/** Inside a Label the caption alone names the field and the box of tags, through `aria-labelledby`. */
test("inside a Label the caption names the field", async ({ page }) => {
    const labelledBy = await page.locator(field(LABELED)).getAttribute("aria-labelledby");

    expect(labelledBy, "the field points at its caption").toBeTruthy();

    const words = ((await page.locator(`#${labelledBy}`).textContent()) ?? "").trim();

    expect(words, "the caption has words").not.toBe("");
    await expect(page.locator(field(LABELED)), "and the field's name is those words alone").toHaveAccessibleName(words);
    await expect(page.locator(box(LABELED)), "as is the box holding the tags").toHaveAccessibleName(words);
});
