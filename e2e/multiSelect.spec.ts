import { type Page, expect, test } from "@playwright/test";

import { activeDescendantText, attributesOf, docsDemo, docsSettled, selectedTexts } from "./helpers";

const DOCS = "/src/App/Pages/MultiSelectPage/Docs";

const LISTBOX = '[role="listbox"]';
const OPTION = '[role="listbox"] [role="option"]';
const GROUP_HEADER = '[role="listbox"] [role="group"] [data-checked-state]';
const CHECKED_STATE = "data-checked-state";

const field = (name: string) => `${docsDemo(DOCS, name)} [role="combobox"]`;

/**
 * Opening is not instant: the list mounts and only then does the field point at a highlighted option, so a case
 * waits on the highlight rather than on the list merely existing.
 */
const openedWithHighlight = async (page: Page, name: string) => {
    await page.locator(field(name)).click();
    await expect(page.locator(field(name))).toHaveAttribute("aria-activedescendant", /.+/);
};

test.beforeEach(async ({ page }) => {
    await page.goto("/multi-select/docs");
    await expect(page.locator(field("Basic"))).toBeVisible();
    await docsSettled(page);
});

/** The basic example starts with one country picked, and Belgium is not it. */
test("a multi list stays open, accumulates and toggles back out", async ({ page }) => {
    await openedWithHighlight(page, "Basic");
    await expect(page.locator(LISTBOX), "a multi list says it is multi").toHaveAttribute(
        "aria-multiselectable",
        "true",
    );

    const before = await selectedTexts(page, OPTION);

    expect(before, "something is picked to begin with").not.toEqual([]);
    expect(before, "and Belgium is not among it").not.toContain("Belgium");

    await page.locator(OPTION, { hasText: "Belgium" }).first().click();
    await expect(page.locator(LISTBOX), "picking in a multi list keeps it open").toHaveCount(1);
    expect(
        (await selectedTexts(page, OPTION)).toSorted(),
        "and adds to the selection without dropping what was already there",
    ).toEqual([...before, "Belgium"].toSorted());
    expect(
        await activeDescendantText(page, field("Basic")),
        "and the highlight moves to the row just picked, so arrowing carries on from there",
    ).toBe("Belgium");

    await page.locator(OPTION, { hasText: "Belgium" }).first().click();
    expect(await selectedTexts(page, OPTION), "picking it again toggles it back out").toEqual(before);
});

/**
 * The header of a group is painted by the consumer, so the library hands it a `checkedState` rather than
 * drawing anything itself. The Playground's header puts that value on `data-checked-state`, which is what
 * this reads — the paint beside it is the Playground's business and is deliberately not asserted.
 *
 * Nordics holds Denmark, a disabled Finland and Sweden. Finland cannot be picked, so that group can never
 * report `true` from the list alone; picking both of the others still leaves one option unselected, which
 * is exactly what mixed means. Benelux is the group that can go all the way.
 */
test("a group header summarizes its own options as unchecked, mixed or checked", async ({ page }) => {
    await openedWithHighlight(page, "Grouped");

    expect(
        await attributesOf(page, GROUP_HEADER, CHECKED_STATE),
        "with nothing picked, every header reads unchecked",
    ).toEqual(["false", "false"]);

    await page.locator(OPTION, { hasText: "Belgium" }).first().click();
    expect(
        await attributesOf(page, GROUP_HEADER, CHECKED_STATE),
        "picking one option in a group takes only that group to mixed",
    ).toEqual(["false", "mixed"]);

    await page.locator(OPTION, { hasText: "Netherlands" }).first().click();
    expect(
        await attributesOf(page, GROUP_HEADER, CHECKED_STATE),
        "and picking the rest of it takes that group to checked",
    ).toEqual(["false", "true"]);

    await page.locator(OPTION, { hasText: "Denmark" }).first().click();
    await page.locator(OPTION, { hasText: "Sweden" }).first().click();
    expect(
        await attributesOf(page, GROUP_HEADER, CHECKED_STATE),
        "a group holding an unpickable option stays mixed however much of it is picked",
    ).toEqual(["mixed", "true"]);
});
