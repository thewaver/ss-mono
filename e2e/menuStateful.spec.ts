import { type Page, expect, test } from "@playwright/test";

import { demo, readout } from "./helpers";

const MENU = '[role="menu"]';
const ROW = '[role="menu"] [role^="menuitem"]';

const open = async (page: Page) => {
    await page.locator(`${demo("stateful")} button`).click();
    await expect(page.locator(MENU)).toHaveCount(1);
};

/** The readout names the action that ran as well as the list, so the list is read out of the brackets. */
const ticked = async (page: Page) => (await readout(page, "stateful")).split("ticked: ")[1] ?? "";

const rows = (page: Page) =>
    page.evaluate(() =>
        [...document.querySelectorAll('[role="menu"] [role^="menuitem"]')].map((element) => ({
            role: element.getAttribute("role"),
            checked: element.getAttribute("aria-checked"),
            inGroup: element.closest('[role="group"]') !== null,
        })),
    );

test.beforeEach(async ({ page }) => {
    await page.goto("/menu");
    await expect(page.locator("[data-example]").first()).toBeVisible();
});

/**
 * Three kinds of row now share one list, and the role is what a reader is told them by. A row that holds no
 * state carries no `aria-checked` at all rather than `false` — the attribute is what says a thing is
 * checkable, so putting it on a command would announce one that cannot be checked.
 */
test("a row's role says what kind it is, and only a stateful one is checkable", async ({ page }) => {
    await open(page);

    await expect(page.locator(ROW), "one row per record whatever the kind").toHaveCount(7);

    expect(await rows(page), "roles, checked state and grouping all follow the record").toEqual([
        { role: "menuitemcheckbox", checked: "true", inGroup: false },
        { role: "menuitemcheckbox", checked: "false", inGroup: false },
        { role: "menuitemcheckbox", checked: "false", inGroup: false },
        { role: "menuitemradio", checked: "false", inGroup: true },
        { role: "menuitemradio", checked: "true", inGroup: true },
        { role: "menuitemradio", checked: "false", inGroup: true },
        { role: "menuitem", checked: null, inGroup: false },
    ]);
});

/**
 * A run of adjacent radio rows is one set, boxed in a `role="group"` the way the published pattern asks. The
 * run is worked out from adjacency rather than declared, so the record stays a flat list and a group cannot
 * fall out of step with its members.
 */
test("adjacent radio rows are one group, and the rows around them are not in it", async ({ page }) => {
    await open(page);

    await expect(page.locator(`${MENU} [role="group"]`), "one group, not one per radio").toHaveCount(1);
    await expect(
        page.locator(`${MENU} [role="group"] [role="menuitemradio"]`),
        "holding every radio in the run",
    ).toHaveCount(3);
});

/**
 * Ticking is a thing you do several times, picking is a thing you do once. That is the same split `Select`
 * and `MultiSelect` already make — a multi list stays open across a pick and a single one closes — so the
 * menu follows it rather than inventing a third answer.
 */
test("a tick keeps the menu open, and a pick closes it", async ({ page }) => {
    await open(page);

    await page.locator('[role="menuitemcheckbox"]', { hasText: "Minimap" }).click();

    await expect(page.locator(MENU), "ticking leaves the menu up to tick again").toHaveCount(1);
    expect(await ticked(page), "and the tick is in the owner's list").toContain("Minimap");

    await page.locator('[role="menuitemradio"]', { hasText: "Large" }).click();

    await expect(page.locator(MENU), "picking one of a set closes it").toHaveCount(0);
});

test("ticking is a toggle, and the owner's list is what says so", async ({ page }) => {
    await open(page);

    expect(await ticked(page), "word wrap starts ticked").toContain("Word wrap");

    await page.locator('[role="menuitemcheckbox"]', { hasText: "Word wrap" }).click();

    expect(await ticked(page), "and ticking it again takes it out").not.toContain("Word wrap");
});

/**
 * The one behaviour a radio row has that a checkbox does not: picking it clears whichever of its own run was
 * picked before, and leaves every tick outside that run alone.
 */
test("picking a radio clears its own run and nothing else", async ({ page }) => {
    await open(page);

    expect(await ticked(page), "medium starts picked, word wrap starts ticked").toContain("Word wrap, Medium");

    await page.locator('[role="menuitemradio"]', { hasText: "Small" }).click();

    const after = await ticked(page);

    expect(after, "the size that was picked is gone").not.toContain("Medium");
    expect(after, "the newly picked one is in").toContain("Small");
    expect(after, "and the tick outside the run is untouched").toContain("Word wrap");
});

/**
 * Opening is not instant: the menu mounts and only then points at a highlighted row, so an arrow pressed
 * before that lands nowhere. Same wait `select.spec.ts` records for the same reason.
 */
test("the keyboard reaches a stateful row the same as any other", async ({ page }) => {
    await page.locator(`${demo("stateful")} button`).focus();
    await page.keyboard.press("Enter");
    await expect(page.locator(MENU)).toHaveAttribute("aria-activedescendant", /.+/);
    await expect(page.locator(MENU), "and the keys only reach it once focus has moved into it").toBeFocused();

    // Opening already highlights the first row, so one press reaches the second.
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");

    expect(await ticked(page), "the second row was ticked from the keyboard").toContain("Show whitespace");
    await expect(page.locator(MENU), "and ticking from the keyboard leaves it open too").toHaveCount(1);
});
