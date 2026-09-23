import { type Page, expect, test } from "@playwright/test";

import { attributesOf, demo, isChecked, isIndeterminate, readout } from "./helpers";

const DEFAULT = demo("default");
const SELECT_ALL = demo("selectAll");

const GROUP = '[role="group"]';
const PARENT = "#allToppings";

/**
 * Boxes are picked out by their place in the group, never by the captions beside them. The disabled one is
 * found by the `aria-disabled` it carries, which is also what a screen reader goes by.
 */
const boxes = (scope: string) => `${scope} ${GROUP} input[type="checkbox"]`;

const box = (page: Page, scope: string, index: number) => page.locator(boxes(scope)).nth(index);

const checkedFlags = (page: Page, scope: string) =>
    page.evaluate(
        (selector) => [...document.querySelectorAll(selector)].map((element) => (element as HTMLInputElement).checked),
        boxes(scope),
    );

const disabledFlags = (page: Page, scope: string) =>
    attributesOf(page, boxes(scope), "aria-disabled").then((values) => values.map((value) => value === "true"));

/** The reading lists what the group's value holds, so its length is the count of ticked boxes. */
const heldCount = async (page: Page, key: string) => {
    const listed = /value: (.+?) —/.exec(await readout(page, key))?.[1] ?? "";

    return listed === "none" ? 0 : listed.split(", ").length;
};

test.beforeEach(async ({ page }) => {
    await page.goto("/checkbox-group");
    await expect(page.locator("[data-example]").first()).toBeVisible();
});

test("the group is named on its own element, and every box answers to the list", async ({ page }) => {
    await expect(page.locator(`${DEFAULT} ${GROUP}`), "the group is named on its own element").toHaveAttribute(
        "aria-label",
        /.+/,
    );

    const ticked = (await checkedFlags(page, DEFAULT)).filter(Boolean).length;

    expect(ticked, "some box starts ticked, from the list the page started with").toBeGreaterThan(0);
    expect(await heldCount(page, "default"), "and exactly as many are ticked as the list holds").toBe(ticked);
});

/**
 * There is no walk and no single tab stop: each box is a choice of its own, so each is its own stop and Tab
 * visits them in turn. That is the one thing that separates this group from the radio one.
 */
test("every box is its own tab stop, and the arrows do not walk the group", async ({ page }) => {
    const count = await page.locator(boxes(DEFAULT)).count();

    expect(await attributesOf(page, boxes(DEFAULT), "tabindex"), "every box is a tab stop").toEqual(
        Array.from({ length: count }, () => "0"),
    );

    await page.locator("#defaultSource").focus();

    for (let index = 0; index < count; index++) {
        await page.keyboard.press("Tab");
        expect(
            await page.evaluate(
                (args) => document.activeElement === document.querySelectorAll(args.selector)[args.index],
                { selector: boxes(DEFAULT), index },
            ),
            `Tab reaches box ${index + 1} in turn`,
        ).toBe(true);
    }

    const before = await checkedFlags(page, DEFAULT);

    await box(page, DEFAULT, 0).focus();
    await page.keyboard.press("ArrowDown");

    expect(
        await page.evaluate((selector) => document.activeElement === document.querySelector(selector), boxes(DEFAULT)),
        "the down arrow leaves focus where it was",
    ).toBe(true);
    expect(await checkedFlags(page, DEFAULT), "and ticks nothing").toEqual(before);
});

test("pressing a box adds its value to the list, and pressing it again takes it out", async ({ page }) => {
    const before = await checkedFlags(page, DEFAULT);
    const target = before.indexOf(false);
    const held = await heldCount(page, "default");

    await box(page, DEFAULT, target).click();

    expect(await isChecked(box(page, DEFAULT, target)), "clicking an empty box ticks it").toBe(true);
    expect(await heldCount(page, "default"), "and adds one value to the list").toBe(held + 1);
    expect(await checkedFlags(page, DEFAULT), "leaving every other box as it was").toEqual(
        before.map((flag, index) => flag || index === target),
    );

    await box(page, DEFAULT, target).click();

    expect(await checkedFlags(page, DEFAULT), "clicking it again takes it back out").toEqual(before);
    expect(await heldCount(page, "default"), "and the list is back where it started").toBe(held);
});

test("Space toggles the focused box", async ({ page }) => {
    const before = await checkedFlags(page, DEFAULT);
    const target = before.indexOf(true);

    await box(page, DEFAULT, target).focus();
    await page.keyboard.press("Space");

    expect(await checkedFlags(page, DEFAULT), "Space clears a ticked box").toEqual(
        before.map((flag, index) => (index === target ? false : flag)),
    );

    await page.keyboard.press("Space");
    expect(await checkedFlags(page, DEFAULT), "and ticks it again").toEqual(before);
});

/**
 * A disabled box answers through `aria-disabled` rather than the native attribute, so it stays in the
 * accessibility tree; it is not a tab stop, and a press on it changes nothing.
 */
test("a disabled box is announced as disabled, is not a tab stop, and cannot be ticked", async ({ page }) => {
    const disabled = await disabledFlags(page, SELECT_ALL);
    const target = disabled.indexOf(true);

    expect(target, "the group has a disabled box").toBeGreaterThanOrEqual(0);
    await expect(page.locator(`${SELECT_ALL} input[disabled]`), "no box carries the native disabled").toHaveCount(0);
    await expect(box(page, SELECT_ALL, target), "it is not a tab stop").toHaveAttribute("tabindex", "-1");

    const before = await checkedFlags(page, SELECT_ALL);

    await box(page, SELECT_ALL, target).click({ force: true });
    expect(await checkedFlags(page, SELECT_ALL), "and a click on it changes nothing").toEqual(before);
});

/**
 * The select-all box is the page's own, drawn outside the group, and the group hands it the state to show.
 * The page starts with some toppings ticked and some not, so it starts mixed.
 */
test("the select-all box reads mixed while the boxes disagree", async ({ page }) => {
    const ticked = await checkedFlags(page, SELECT_ALL);
    const disabled = await disabledFlags(page, SELECT_ALL);
    const enabled = ticked.filter((_flag, index) => !disabled[index]);

    expect(enabled.some(Boolean) && enabled.some((flag) => !flag), "the enabled boxes start out disagreeing").toBe(
        true,
    );
    expect(await isIndeterminate(page.locator(PARENT)), "so the select-all box is mixed").toBe(true);
    expect(await isChecked(page.locator(PARENT)), "and not ticked").toBe(false);
});

test("pressing the select-all box ticks every enabled box and leaves the disabled one alone", async ({ page }) => {
    const disabled = await disabledFlags(page, SELECT_ALL);
    const before = await checkedFlags(page, SELECT_ALL);

    await page.locator(PARENT).click();

    expect(
        await checkedFlags(page, SELECT_ALL),
        "every enabled box is ticked, and the disabled one is as it was",
    ).toEqual(before.map((flag, index) => (disabled[index] ? flag : true)));
    expect(await isIndeterminate(page.locator(PARENT)), "the select-all box is no longer mixed").toBe(false);
    expect(
        await isChecked(page.locator(PARENT)),
        "and reads ticked, because the disabled box is left out of the count",
    ).toBe(true);

    await page.locator(PARENT).click();

    expect(await checkedFlags(page, SELECT_ALL), "pressing it again clears every enabled box").toEqual(
        before.map((flag, index) => (disabled[index] ? flag : false)),
    );
    expect(await isChecked(page.locator(PARENT)), "and it reads empty").toBe(false);
    expect(await isIndeterminate(page.locator(PARENT)), "rather than mixed").toBe(false);
});

test("ticking the last enabled box by hand turns the select-all box ticked", async ({ page }) => {
    const disabled = await disabledFlags(page, SELECT_ALL);
    const before = await checkedFlags(page, SELECT_ALL);

    for (const [index, flag] of before.entries()) {
        if (!flag && !disabled[index]) await box(page, SELECT_ALL, index).click();
    }

    expect(await isIndeterminate(page.locator(PARENT)), "once every enabled box is ticked it is not mixed").toBe(false);
    expect(await isChecked(page.locator(PARENT)), "but ticked, whatever the disabled box says").toBe(true);

    await box(page, SELECT_ALL, before.indexOf(true)).click();

    expect(await isIndeterminate(page.locator(PARENT)), "and clearing one box puts it back to mixed").toBe(true);
});
