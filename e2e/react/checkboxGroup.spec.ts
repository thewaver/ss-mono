import { type Page, expect, test } from "@playwright/test";

import { attributesOf, isChecked, isIndeterminate } from "../helpers";

/**
 * The React `CheckboxGroup` with React `Checkbox` members. The cases follow `e2e/checkboxGroup.spec.ts`, which covers
 * the Solid one: the group's value is the list of ticked members' values, every box is its own tab stop, and a
 * select-all box drawn outside the group reads and writes it through the controller it is handed. Boxes are picked
 * out by their place in the group, never by the captions beside them.
 */
const BOXES = '[role="group"] input[type="checkbox"]';
const PARENT = "#allToppings";

const box = (page: Page, index: number) => page.locator(BOXES).nth(index);

const checkedFlags = (page: Page) =>
    page.evaluate(
        (selector) => [...document.querySelectorAll(selector)].map((element) => (element as HTMLInputElement).checked),
        BOXES,
    );

const disabledFlags = (page: Page) =>
    attributesOf(page, BOXES, "aria-disabled").then((values) => values.map((value) => value === "true"));

const heldCount = async (page: Page) => {
    const listed = (await page.locator('[data-readout="value"]').textContent()) ?? "";

    return listed === "none" ? 0 : listed.split(", ").length;
};

test("the group is named on its own element, and every box answers to the list", async ({ page, mount }) => {
    const component = await mount("Essentials/CheckboxGroup/Default");

    await expect(component.locator('[role="group"]'), "the group is named on its own element").toHaveAttribute(
        "aria-label",
        /.+/,
    );

    const ticked = (await checkedFlags(page)).filter(Boolean).length;

    expect(ticked, "some box starts ticked, from the list the story started with").toBeGreaterThan(0);
    expect(await heldCount(page), "and exactly as many are ticked as the list holds").toBe(ticked);
});

test("every box is its own tab stop, and the arrows do not walk the group", async ({ page, mount }) => {
    await mount("Essentials/CheckboxGroup/Default");

    const count = await page.locator(BOXES).count();

    expect(await attributesOf(page, BOXES, "tabindex"), "every box is a tab stop").toEqual(
        Array.from({ length: count }, () => "0"),
    );

    await page.locator("#defaultSource").focus();

    for (let index = 0; index < count; index++) {
        await page.keyboard.press("Tab");
        expect(
            await page.evaluate(
                (args) => document.activeElement === document.querySelectorAll(args.selector)[args.index],
                { selector: BOXES, index },
            ),
            `Tab reaches box ${index + 1} in turn`,
        ).toBe(true);
    }

    const before = await checkedFlags(page);

    await box(page, 0).focus();
    await page.keyboard.press("ArrowDown");

    expect(
        await page.evaluate((selector) => document.activeElement === document.querySelector(selector), BOXES),
        "the down arrow leaves focus where it was",
    ).toBe(true);
    expect(await checkedFlags(page), "and ticks nothing").toEqual(before);
});

test("pressing a box adds its value to the list, and pressing it again takes it out", async ({ page, mount }) => {
    await mount("Essentials/CheckboxGroup/Default");

    const before = await checkedFlags(page);
    const target = before.indexOf(false);
    const held = await heldCount(page);

    await box(page, target).click();

    expect(await isChecked(box(page, target)), "clicking an empty box ticks it").toBe(true);
    await expect.poll(() => heldCount(page), "and adds one value to the list").toBe(held + 1);
    expect(await checkedFlags(page), "leaving every other box as it was").toEqual(
        before.map((flag, index) => flag || index === target),
    );

    await box(page, target).click();

    expect(await checkedFlags(page), "clicking it again takes it back out").toEqual(before);
    await expect.poll(() => heldCount(page), "and the list is back where it started").toBe(held);
});

test("Space toggles the focused box", async ({ page, mount }) => {
    await mount("Essentials/CheckboxGroup/Default");

    const before = await checkedFlags(page);
    const target = before.indexOf(true);

    await box(page, target).focus();
    await page.keyboard.press("Space");

    expect(await checkedFlags(page), "Space clears a ticked box").toEqual(
        before.map((flag, index) => (index === target ? false : flag)),
    );

    await page.keyboard.press("Space");
    expect(await checkedFlags(page), "and ticks it again").toEqual(before);
});

test("a disabled box is announced as disabled, is not a tab stop, and cannot be ticked", async ({ page, mount }) => {
    await mount("Essentials/CheckboxGroup/SelectAll");

    const disabled = await disabledFlags(page);
    const target = disabled.indexOf(true);

    expect(target, "the group has a disabled box").toBeGreaterThanOrEqual(0);
    await expect(page.locator("input[disabled]"), "no box carries the native disabled").toHaveCount(0);
    await expect(box(page, target), "it is not a tab stop").toHaveAttribute("tabindex", "-1");

    const before = await checkedFlags(page);

    await box(page, target).click({ force: true });
    expect(await checkedFlags(page), "and a click on it changes nothing").toEqual(before);
});

test("the select-all box reads mixed while the boxes disagree", async ({ page, mount }) => {
    await mount("Essentials/CheckboxGroup/SelectAll");

    const ticked = await checkedFlags(page);
    const disabled = await disabledFlags(page);
    const enabled = ticked.filter((_flag, index) => !disabled[index]);

    expect(enabled.some(Boolean) && enabled.some((flag) => !flag), "the enabled boxes start out disagreeing").toBe(
        true,
    );
    expect(await isIndeterminate(page.locator(PARENT)), "so the select-all box is mixed").toBe(true);
    expect(await isChecked(page.locator(PARENT)), "and not ticked").toBe(false);
});

/**
 * The select-all box renders before the group does, so it can only show the group's answer if the group hands the
 * controller over again once the answer changes. Both holders are covered: the consumer holding the list, which
 * re-renders the box anyway, and the group holding it, where the fresh hand-off is the only thing that does.
 */
for (const isOwned of [false, true]) {
    const holder = isOwned ? "the group" : "the consumer";

    test(`pressing the select-all box ticks every enabled box and leaves the disabled one alone, with ${holder} holding the list`, async ({
        page,
        mount,
    }) => {
        await mount("Essentials/CheckboxGroup/SelectAll", { isOwned });

        const disabled = await disabledFlags(page);
        const before = await checkedFlags(page);

        await page.locator(PARENT).click();

        expect(await checkedFlags(page), "every enabled box is ticked, and the disabled one is as it was").toEqual(
            before.map((flag, index) => (disabled[index] ? flag : true)),
        );
        expect(await isIndeterminate(page.locator(PARENT)), "the select-all box is no longer mixed").toBe(false);
        expect(
            await isChecked(page.locator(PARENT)),
            "and reads ticked, because the disabled box is left out of the count",
        ).toBe(true);

        await page.locator(PARENT).click();

        expect(await checkedFlags(page), "pressing it again clears every enabled box").toEqual(
            before.map((flag, index) => (disabled[index] ? flag : false)),
        );
        expect(await isChecked(page.locator(PARENT)), "and it reads empty").toBe(false);
        expect(await isIndeterminate(page.locator(PARENT)), "rather than mixed").toBe(false);
    });

    test(`ticking the last enabled box by hand turns the select-all box ticked, with ${holder} holding the list`, async ({
        page,
        mount,
    }) => {
        await mount("Essentials/CheckboxGroup/SelectAll", { isOwned });

        const disabled = await disabledFlags(page);
        const before = await checkedFlags(page);

        for (const [index, flag] of before.entries()) {
            if (!flag && !disabled[index]) await box(page, index).click();
        }

        expect(await isIndeterminate(page.locator(PARENT)), "once every enabled box is ticked it is not mixed").toBe(
            false,
        );
        expect(await isChecked(page.locator(PARENT)), "but ticked, whatever the disabled box says").toBe(true);

        await box(page, 0).click();

        expect(await isIndeterminate(page.locator(PARENT)), "and clearing one box puts it back to mixed").toBe(true);
    });
}
