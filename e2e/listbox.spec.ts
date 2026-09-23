import { type Page, expect, test } from "@playwright/test";

import { accessibleText, activeMatches, attributesOf, demo } from "./helpers";

const SINGLE = demo("single");
const MULTIPLE = demo("multiple");
const HORIZONTAL = demo("horizontalRightToLeft");

const LISTBOX = '[role="listbox"]';
const GROUP_HEADER = '[role="group"] [data-checked-state]';
const CHECKED_STATE = "data-checked-state";

/**
 * Options are picked out by their place in the list and by the ARIA they carry — which one is disabled, which
 * one is selected — never by the words they show. A country list reworded or reordered is not a behavior
 * change, and a spec that reads the names would say it was.
 */
const options = (scope: string) => `${scope} [role="option"]`;

const option = (page: Page, scope: string, index: number) => page.locator(options(scope)).nth(index);

const selectedFlags = (page: Page, scope: string) =>
    attributesOf(page, options(scope), "aria-selected").then((values) => values.map((value) => value === "true"));

const tabStops = (page: Page, scope: string) => attributesOf(page, options(scope), "tabindex");

const focusedIndex = (page: Page, scope: string) =>
    page.evaluate(
        (selector) => [...document.querySelectorAll(selector)].indexOf(document.activeElement as Element),
        options(scope),
    );

const disabledIndexes = (page: Page, scope: string) =>
    attributesOf(page, options(scope), "aria-disabled").then((values) =>
        values.flatMap((value, index) => (value === "true" ? [index] : [])),
    );

/** Long enough for the typeahead query to have been forgotten, which the library puts at a second. */
const QUERY_TIMEOUT_MS = 1_200;

test.beforeEach(async ({ page }) => {
    await page.goto("/listbox");
    await expect(page.locator("[data-example]").first()).toBeVisible();
});

test("each list is a named listbox that says its orientation, and whether it holds several values", async ({
    page,
}) => {
    for (const scope of [SINGLE, MULTIPLE, HORIZONTAL]) {
        await expect(page.locator(`${scope} ${LISTBOX}`), "every list is named on its own element").toHaveAttribute(
            "aria-label",
            /.+/,
        );
    }

    await expect(page.locator(`${SINGLE} ${LISTBOX}`), "a vertical list says so").toHaveAttribute(
        "aria-orientation",
        "vertical",
    );
    await expect(page.locator(`${HORIZONTAL} ${LISTBOX}`), "and so does a horizontal one").toHaveAttribute(
        "aria-orientation",
        "horizontal",
    );
    await expect(
        page.locator(`${SINGLE} ${LISTBOX}`),
        "a one-value list does not claim to hold several",
    ).not.toHaveAttribute("aria-multiselectable");
    await expect(page.locator(`${MULTIPLE} ${LISTBOX}`), "and a several-value list says it does").toHaveAttribute(
        "aria-multiselectable",
        "true",
    );
});

/**
 * The options take focus themselves, so the list is one tab stop: the picked option carries it, and a list with
 * nothing picked puts it on the first option. Tab goes in onto that option, and the next Tab leaves the list
 * rather than walking along it.
 */
test("the list is one tab stop, on the picked option or on the first when nothing is picked", async ({ page }) => {
    const selected = await selectedFlags(page, SINGLE);

    expect(await tabStops(page, SINGLE), "the picked option is the one tab stop").toEqual(
        selected.map((isSelected) => (isSelected ? "0" : "-1")),
    );

    const unpicked = await tabStops(page, HORIZONTAL);

    expect(unpicked, "and a list with nothing picked puts it on the first option").toEqual(
        unpicked.map((_stop, index) => (index === 0 ? "0" : "-1")),
    );

    await page.locator("#singleSource").focus();
    await page.keyboard.press("Tab");

    expect(await focusedIndex(page, SINGLE), "Tab goes in onto the picked option").toBe(selected.indexOf(true));

    await page.keyboard.press("Tab");

    expect(
        await page.evaluate((selector) => !!document.activeElement?.closest(selector), `${SINGLE} ${LISTBOX}`),
        "and the next Tab leaves the list",
    ).toBe(false);
});

test("the arrows move focus without changing the value, and Enter or Space picks", async ({ page }) => {
    const before = await selectedFlags(page, SINGLE);
    const start = before.indexOf(true);

    await option(page, SINGLE, start).focus();
    await page.keyboard.press("ArrowDown");

    expect(await focusedIndex(page, SINGLE), "the down arrow moves focus to the next option").toBe(start + 1);
    expect(await selectedFlags(page, SINGLE), "without changing what is picked").toEqual(before);
    expect(await tabStops(page, SINGLE), "the tab stop moves with focus").toEqual(
        before.map((_flag, index) => (index === start + 1 ? "0" : "-1")),
    );

    await page.keyboard.press("Space");

    expect(await selectedFlags(page, SINGLE), "Space picks the focused option, and only it").toEqual(
        before.map((_flag, index) => index === start + 1),
    );

    await page.keyboard.press("ArrowUp");
    await page.keyboard.press("Enter");

    expect(await selectedFlags(page, SINGLE), "and Enter picks too").toEqual(before);
});

test("Home and End reach the ends, and the walk wraps", async ({ page }) => {
    const count = await page.locator(options(SINGLE)).count();

    await option(page, SINGLE, 2).focus();

    await page.keyboard.press("End");
    expect(await focusedIndex(page, SINGLE), "End reaches the last option").toBe(count - 1);

    await page.keyboard.press("ArrowDown");
    expect(await focusedIndex(page, SINGLE), "and the walk wraps from the last to the first").toBe(0);

    await page.keyboard.press("End");
    await page.keyboard.press("Home");
    expect(await focusedIndex(page, SINGLE), "Home goes back to the first").toBe(0);
});

/**
 * The one-value list's disabled options carry an explanation on hover, so the walk stops on them rather than
 * stepping over — focus has to be able to land where the explanation is. Landing is all it can do: the option
 * refuses to be picked, by key or by pointer.
 */
test("the walk stops on a disabled option that explains itself, and it cannot be picked", async ({ page }) => {
    const disabled = await disabledIndexes(page, SINGLE);
    const before = await selectedFlags(page, SINGLE);

    expect(disabled.length, "the list has a disabled option to walk onto").toBeGreaterThan(0);

    await option(page, SINGLE, disabled[0] - 1).focus();
    await page.keyboard.press("ArrowDown");

    expect(await focusedIndex(page, SINGLE), "the down arrow stops on the disabled option").toBe(disabled[0]);

    await page.keyboard.press("Enter");
    await page.keyboard.press("Space");
    expect(await selectedFlags(page, SINGLE), "and neither Enter nor Space picks it").toEqual(before);

    await option(page, SINGLE, disabled[0]).click({ force: true });
    expect(await selectedFlags(page, SINGLE), "nor does a click").toEqual(before);
});

test("typing a letter moves focus to the next option starting with it", async ({ page }) => {
    const texts = await Promise.all(
        (await page.locator(options(SINGLE)).all()).map((element) => accessibleText(element)),
    );
    const disabled = await disabledIndexes(page, SINGLE);
    const target = texts.findIndex(
        (text, index) =>
            index > 0 && !disabled.includes(index) && texts.findIndex((other) => other[0] === text[0]) === index,
    );

    await option(page, SINGLE, 0).focus();
    await page.keyboard.press(texts[target][0].toLowerCase());

    expect(await focusedIndex(page, SINGLE), "a typed letter moves focus to the option it starts").toBe(target);

    await page.waitForTimeout(QUERY_TIMEOUT_MS);
    await page.keyboard.press(texts[0][0].toLowerCase());

    expect(await focusedIndex(page, SINGLE), "and once the query is forgotten, a new letter starts afresh").toBe(0);
});

test("a click picks the option and moves focus onto it", async ({ page }) => {
    const before = await selectedFlags(page, SINGLE);
    const disabled = await disabledIndexes(page, SINGLE);
    const target = before.findIndex((isSelected, index) => !isSelected && !disabled.includes(index));

    await option(page, SINGLE, target).click();

    expect(await selectedFlags(page, SINGLE), "a click picks the option it lands on, and only it").toEqual(
        before.map((_flag, index) => index === target),
    );
    expect(await focusedIndex(page, SINGLE), "and focus follows it there").toBe(target);
});

test("in a several-value list, Enter or Space picks and drops one option and leaves the others", async ({ page }) => {
    const before = await selectedFlags(page, MULTIPLE);
    const start = before.indexOf(true);
    const disabled = await disabledIndexes(page, MULTIPLE);

    await option(page, MULTIPLE, start).focus();
    await page.keyboard.press("ArrowDown");

    const landed = await focusedIndex(page, MULTIPLE);

    expect(disabled, "the down arrow skips a disabled option that has nothing to explain").not.toContain(landed);
    expect(landed, "and lands on the next one after it").toBeGreaterThan(start);

    await page.keyboard.press("Space");
    expect(await selectedFlags(page, MULTIPLE), "Space adds the focused option and keeps the first").toEqual(
        before.map((flag, index) => flag || index === landed),
    );

    await page.keyboard.press("Enter");
    expect(await selectedFlags(page, MULTIPLE), "and Enter drops it again").toEqual(before);
});

test("the walk crosses from one group into the next", async ({ page }) => {
    const firstGroupSize = await page.locator(`${MULTIPLE} [role="group"]`).first().locator('[role="option"]').count();

    await option(page, MULTIPLE, firstGroupSize - 1).focus();
    await page.keyboard.press("ArrowDown");

    expect(await focusedIndex(page, MULTIPLE), "the down arrow goes on into the next group").toBe(firstGroupSize);
    expect(
        await page.evaluate(
            (selector) => document.activeElement?.closest('[role="group"]') === document.querySelectorAll(selector)[1],
            `${MULTIPLE} [role="group"]`,
        ),
        "which is the second group's first option",
    ).toBe(true);
});

/**
 * A group's heading shows whether its options are all picked, some, or none. The second group is the one
 * without a disabled option, so every option in it can be picked and the heading can reach "all".
 */
test("a group heading follows its options: none, some, all", async ({ page }) => {
    const group = page.locator(`${MULTIPLE} [role="group"]`).nth(1);
    const header = page.locator(`${MULTIPLE} ${GROUP_HEADER}`).nth(1);
    const members = await group.locator('[role="option"]').count();

    await expect(header, "nothing in the group is picked").toHaveAttribute(CHECKED_STATE, "false");

    await group.locator('[role="option"]').nth(0).click();
    await expect(header, "one option picked makes it mixed").toHaveAttribute(CHECKED_STATE, "mixed");

    for (let index = 1; index < members; index++) await group.locator('[role="option"]').nth(index).click();

    await expect(header, "and every option picked makes it all").toHaveAttribute(CHECKED_STATE, "true");
});

/**
 * Found while writing this spec, and left red on purpose. With focus already inside the list — somebody tabbed
 * in, or picked something by key — pressing an option further down does nothing. The press moves focus to the
 * option, the list scrolls itself as the highlight follows focus, the option slides out from under the pointer
 * between the press and the release, and the click lands on the group around it instead. The scroll is the list
 * bringing its highlighted row into view even though that row was already on screen.
 */
test("with focus already in the list, clicking another option picks it", async ({ page }) => {
    const before = await selectedFlags(page, MULTIPLE);
    const start = before.indexOf(true);
    const target = before.length - 2;

    await option(page, MULTIPLE, start).focus();
    await option(page, MULTIPLE, target).click();

    expect(await selectedFlags(page, MULTIPLE), "the click adds the option it was aimed at").toEqual(
        before.map((flag, index) => flag || index === target),
    );
});

/**
 * A horizontal list walks with the arrows along its own axis, and in a right-to-left page "forward" is to the
 * left. The vertical arrows belong to nothing here.
 */
test("a horizontal list in a right-to-left page walks forward with the left arrow", async ({ page }) => {
    const disabled = await disabledIndexes(page, HORIZONTAL);

    await option(page, HORIZONTAL, 0).focus();

    await page.keyboard.press("ArrowLeft");
    expect(await focusedIndex(page, HORIZONTAL), "the left arrow moves forward").toBe(1);

    await page.keyboard.press("ArrowRight");
    expect(await focusedIndex(page, HORIZONTAL), "and the right arrow moves back").toBe(0);

    await page.keyboard.press("ArrowDown");
    expect(await focusedIndex(page, HORIZONTAL), "the down arrow does nothing on a horizontal list").toBe(0);

    const visited: number[] = [];

    for (let step = 0; step < 4; step++) {
        await page.keyboard.press("ArrowLeft");
        visited.push(await focusedIndex(page, HORIZONTAL));
    }

    expect(
        visited.filter((index) => disabled.includes(index)),
        "and the walk steps over a disabled option that has nothing to explain",
    ).toEqual([]);

    await page.keyboard.press("Enter");
    expect(await activeMatches(page, `${HORIZONTAL} [role="option"][aria-selected="true"]`), "Enter picks it").toBe(
        true,
    );
});
