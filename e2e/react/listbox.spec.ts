import { type Page, expect, test } from "@playwright/test";

import { accessibleText, activeMatches, attributesOf } from "../helpers";

/**
 * The React `Listbox` and `MultiListbox`, over `ListboxReactUtils.useCursor` and the React `InteractionWrapper`. The
 * cases follow `e2e/listbox.spec.ts`, which covers the Solid ones: a named list that says its orientation and whether
 * it holds several values, one tab stop that the arrows move while the value stays put, Enter and Space picking,
 * Home, End and the wrap, a disabled option that explains itself stopping the walk and refusing the pick, typeahead,
 * a click moving focus with the pick, a several-value list toggling, the walk crossing groups, a group heading told
 * how much of its group is picked, and a horizontal list in a right-to-left page walking forward with the left arrow.
 *
 * Options are picked out by their place in the list and by the ARIA they carry, never by the words they show.
 */
const SINGLE = "Essentials/Listbox/Single";
const HORIZONTAL = "Essentials/Listbox/Horizontal";
const MULTIPLE = "Essentials/MultiListbox/Grouped";

const LISTBOX = '[role="listbox"]';
const OPTIONS = '[role="listbox"] [role="option"]';
const GROUP_HEADER = '[role="group"] [data-checked-state]';
const CHECKED_STATE = "data-checked-state";

/** Long enough for the typeahead query to have been forgotten, which the library puts at a second. */
const QUERY_TIMEOUT_MS = 1_200;

const option = (page: Page, index: number) => page.locator(OPTIONS).nth(index);

const selectedFlags = (page: Page) =>
    attributesOf(page, OPTIONS, "aria-selected").then((values) => values.map((value) => value === "true"));

const tabStops = (page: Page) => attributesOf(page, OPTIONS, "tabindex");

const focusedIndex = (page: Page) =>
    page.evaluate(
        (selector) => [...document.querySelectorAll(selector)].indexOf(document.activeElement as Element),
        OPTIONS,
    );

const disabledIndexes = (page: Page) =>
    attributesOf(page, OPTIONS, "aria-disabled").then((values) =>
        values.flatMap((value, index) => (value === "true" ? [index] : [])),
    );

test("each list is a named listbox that says its orientation, and whether it holds several values", async ({
    page,
    mount,
}) => {
    await mount(SINGLE);

    await expect(page.locator(LISTBOX), "the list is named on its own element").toHaveAttribute("aria-label", /.+/);
    await expect(page.locator(LISTBOX), "a vertical list says so").toHaveAttribute("aria-orientation", "vertical");
    await expect(page.locator(LISTBOX), "a one-value list does not claim to hold several").not.toHaveAttribute(
        "aria-multiselectable",
    );

    await mount(HORIZONTAL);

    await expect(page.locator(LISTBOX), "and so does a horizontal one").toHaveAttribute(
        "aria-orientation",
        "horizontal",
    );

    await mount(MULTIPLE);

    await expect(page.locator(LISTBOX), "and a several-value list says it does").toHaveAttribute(
        "aria-multiselectable",
        "true",
    );
});

test("the list is one tab stop, on the picked option or on the first when nothing is picked", async ({
    page,
    mount,
}) => {
    await mount(SINGLE);

    const selected = await selectedFlags(page);

    expect(await tabStops(page), "the picked option is the one tab stop").toEqual(
        selected.map((isSelected) => (isSelected ? "0" : "-1")),
    );

    await page.locator("#singleSource").focus();
    await page.keyboard.press("Tab");

    expect(await focusedIndex(page), "Tab goes in onto the picked option").toBe(selected.indexOf(true));

    await page.keyboard.press("Tab");

    expect(
        await page.evaluate((selector) => !!document.activeElement?.closest(selector), LISTBOX),
        "and the next Tab leaves the list",
    ).toBe(false);

    await mount(HORIZONTAL);

    const unpicked = await tabStops(page);

    expect(unpicked, "and a list with nothing picked puts it on the first option").toEqual(
        unpicked.map((_stop, index) => (index === 0 ? "0" : "-1")),
    );
});

test("the arrows move focus without changing the value, and Enter or Space picks", async ({ page, mount }) => {
    await mount(SINGLE);

    const before = await selectedFlags(page);
    const start = before.indexOf(true);

    await option(page, start).focus();
    await page.keyboard.press("ArrowDown");

    expect(await focusedIndex(page), "the down arrow moves focus to the next option").toBe(start + 1);
    expect(await selectedFlags(page), "without changing what is picked").toEqual(before);
    expect(await tabStops(page), "the tab stop moves with focus").toEqual(
        before.map((_flag, index) => (index === start + 1 ? "0" : "-1")),
    );

    await page.keyboard.press("Space");

    expect(await selectedFlags(page), "Space picks the focused option, and only it").toEqual(
        before.map((_flag, index) => index === start + 1),
    );

    await page.keyboard.press("ArrowUp");
    await page.keyboard.press("Enter");

    expect(await selectedFlags(page), "and Enter picks too").toEqual(before);
});

test("Home and End reach the ends, and the walk wraps", async ({ page, mount }) => {
    await mount(SINGLE);

    const count = await page.locator(OPTIONS).count();

    await option(page, 2).focus();

    await page.keyboard.press("End");
    expect(await focusedIndex(page), "End reaches the last option").toBe(count - 1);

    await page.keyboard.press("ArrowDown");
    expect(await focusedIndex(page), "and the walk wraps from the last to the first").toBe(0);

    await page.keyboard.press("End");
    await page.keyboard.press("Home");
    expect(await focusedIndex(page), "Home goes back to the first").toBe(0);
});

test("the walk stops on a disabled option that explains itself, and it cannot be picked", async ({ page, mount }) => {
    await mount(SINGLE);

    const disabled = await disabledIndexes(page);
    const before = await selectedFlags(page);

    expect(disabled.length, "the list has a disabled option to walk onto").toBeGreaterThan(0);

    await option(page, disabled[0] - 1).focus();
    await page.keyboard.press("ArrowDown");

    expect(await focusedIndex(page), "the down arrow stops on the disabled option").toBe(disabled[0]);

    await page.keyboard.press("Enter");
    await page.keyboard.press("Space");
    expect(await selectedFlags(page), "and neither Enter nor Space picks it").toEqual(before);

    await option(page, disabled[0]).click({ force: true });
    expect(await selectedFlags(page), "nor does a click").toEqual(before);
});

test("typing a letter moves focus to the next option starting with it", async ({ page, mount }) => {
    await mount(SINGLE);

    const texts = await Promise.all((await page.locator(OPTIONS).all()).map((element) => accessibleText(element)));
    const disabled = await disabledIndexes(page);
    const target = texts.findIndex(
        (text, index) =>
            index > 0 && !disabled.includes(index) && texts.findIndex((other) => other[0] === text[0]) === index,
    );

    await option(page, 0).focus();
    await page.keyboard.press(texts[target][0].toLowerCase());

    expect(await focusedIndex(page), "a typed letter moves focus to the option it starts").toBe(target);

    await page.waitForTimeout(QUERY_TIMEOUT_MS);
    await page.keyboard.press(texts[0][0].toLowerCase());

    expect(await focusedIndex(page), "and once the query is forgotten, a new letter starts afresh").toBe(0);
});

test("a click picks the option and moves focus onto it", async ({ page, mount }) => {
    await mount(SINGLE);

    const before = await selectedFlags(page);
    const disabled = await disabledIndexes(page);
    const target = before.findIndex((isSelected, index) => !isSelected && !disabled.includes(index));

    await option(page, target).click();

    expect(await selectedFlags(page), "a click picks the option it lands on, and only it").toEqual(
        before.map((_flag, index) => index === target),
    );
    expect(await focusedIndex(page), "and focus follows it there").toBe(target);
});

test("in a several-value list, Enter or Space picks and drops one option and leaves the others", async ({
    page,
    mount,
}) => {
    await mount(MULTIPLE);

    const before = await selectedFlags(page);
    const start = before.indexOf(true);
    const disabled = await disabledIndexes(page);

    await option(page, start).focus();
    await page.keyboard.press("ArrowDown");

    const landed = await focusedIndex(page);

    expect(disabled, "the down arrow skips a disabled option that has nothing to explain").not.toContain(landed);
    expect(landed, "and lands on the next one after it").toBeGreaterThan(start);

    await page.keyboard.press("Space");
    expect(await selectedFlags(page), "Space adds the focused option and keeps the first").toEqual(
        before.map((flag, index) => flag || index === landed),
    );

    await page.keyboard.press("Enter");
    expect(await selectedFlags(page), "and Enter drops it again").toEqual(before);
});

test("the walk crosses from one group into the next", async ({ page, mount }) => {
    await mount(MULTIPLE);

    const firstGroupSize = await page.locator(`${LISTBOX} [role="group"]`).first().locator('[role="option"]').count();

    await option(page, firstGroupSize - 1).focus();
    await page.keyboard.press("ArrowDown");

    expect(await focusedIndex(page), "the down arrow goes on into the next group").toBe(firstGroupSize);
    expect(
        await page.evaluate(
            (selector) => document.activeElement?.closest('[role="group"]') === document.querySelectorAll(selector)[1],
            `${LISTBOX} [role="group"]`,
        ),
        "which is the second group's first option",
    ).toBe(true);
});

/**
 * The second group is the one without a disabled option, so every option in it can be picked and the heading can
 * reach "all".
 */
test("a group heading follows its options: none, some, all", async ({ page, mount }) => {
    await mount(MULTIPLE);

    const group = page.locator(`${LISTBOX} [role="group"]`).nth(1);
    const header = page.locator(`${LISTBOX} ${GROUP_HEADER}`).nth(1);
    const members = await group.locator('[role="option"]').count();

    await expect(header, "nothing in the group is picked").toHaveAttribute(CHECKED_STATE, "false");

    await group.locator('[role="option"]').nth(0).click();
    await expect(header, "one option picked makes it mixed").toHaveAttribute(CHECKED_STATE, "mixed");

    for (let index = 1; index < members; index++) await group.locator('[role="option"]').nth(index).click();

    await expect(header, "and every option picked makes it all").toHaveAttribute(CHECKED_STATE, "true");
});

test("with focus already in the list, clicking another option picks it", async ({ page, mount }) => {
    await mount(MULTIPLE);

    const before = await selectedFlags(page);
    const start = before.indexOf(true);
    const target = before.length - 2;

    await option(page, start).focus();
    await option(page, target).click();

    expect(await selectedFlags(page), "the click adds the option it was aimed at").toEqual(
        before.map((flag, index) => flag || index === target),
    );
});

test("a horizontal list in a right-to-left page walks forward with the left arrow", async ({ page, mount }) => {
    await mount(HORIZONTAL);

    const disabled = await disabledIndexes(page);

    await option(page, 0).focus();

    await page.keyboard.press("ArrowLeft");
    expect(await focusedIndex(page), "the left arrow moves forward").toBe(1);

    await page.keyboard.press("ArrowRight");
    expect(await focusedIndex(page), "and the right arrow moves back").toBe(0);

    await page.keyboard.press("ArrowDown");
    expect(await focusedIndex(page), "the down arrow does nothing on a horizontal list").toBe(0);

    const visited: number[] = [];

    for (let step = 0; step < 4; step++) {
        await page.keyboard.press("ArrowLeft");
        visited.push(await focusedIndex(page));
    }

    expect(
        visited.filter((index) => disabled.includes(index)),
        "and the walk steps over a disabled option that has nothing to explain",
    ).toEqual([]);

    await page.keyboard.press("Enter");
    expect(await activeMatches(page, `${LISTBOX} [role="option"][aria-selected="true"]`), "Enter picks it").toBe(true);
});
