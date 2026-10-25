import { type Page, expect, test } from "@playwright/test";

import { activeMatches, docsDemo, docsSettled, isChecked, isIndeterminate, prop, tabIndex } from "./helpers";

const DOCS = "/src/App/Pages/CheckboxPage/Docs";

const BASIC = docsDemo(DOCS, "Basic");
const MIXED = docsDemo(DOCS, "Mixed");
const REFUSING = docsDemo(DOCS, "Refusing");
const TOOLTIP = docsDemo(DOCS, "Tooltip");

const BOX = `${BASIC} input`;
const SUMMARY = "#selectAll";
const FIRST_CHILD = "#firstChild";
const EMAIL = "#email";
const TOOLTIP_BOX = `${TOOLTIP} input`;

const knob = (page: Page, key: string) => page.locator(`${prop(key)} input`);

/** Every box a demo holds, checked or not, in the order they are drawn. */
const checkedStates = (page: Page, scope: string) =>
    page.locator(`${scope} input`).evaluateAll((inputs) => inputs.map((input) => (input as HTMLInputElement).checked));

test.beforeEach(async ({ page }) => {
    await page.goto("/checkbox/docs");
    await expect(page.locator(BOX)).toBeVisible();
    await docsSettled(page);
});

test("no control uses the native disabled attribute", async ({ page }) => {
    await knob(page, "isDisabled").click();

    await expect(page.locator(BOX), "a disabled box carries no native disabled attribute").not.toHaveAttribute(
        "disabled",
    );
    await expect(page.locator("input[disabled]"), "and not one input on the page has it").toHaveCount(0);
});

/**
 * The painter draws the box and the words beside it, and is hidden from screen readers as a whole: the name comes
 * from the native input, so a reader hears it once. What is checked is that the two say the same thing — the words
 * on screen hold the input's name (WCAG 2.5.3, Label in Name) — rather than what either says.
 */
test("the painted words are hidden, and the input carries the same words as its name", async ({ page }) => {
    const painter = page.locator(`${BASIC} [aria-hidden="true"]`).first();
    const name = (await page.locator(BOX).getAttribute("aria-label")) ?? "";

    expect(name, "the input is named").not.toBe("");
    await expect(painter, "the painter is out of the accessibility tree").toHaveAttribute("aria-hidden", "true");
    await expect(painter, "and shows the words the input is named by").toContainText(name);
});

test("a plain box toggles by pointer and by Space", async ({ page }) => {
    const before = await isChecked(page.locator(BOX));

    await page.locator(BOX).click();
    expect(await isChecked(page.locator(BOX)), "clicking the box changes it").toBe(!before);

    await page.locator(BOX).focus();
    await page.keyboard.press(" ");
    expect(await isChecked(page.locator(BOX)), "Space toggles it back").toBe(before);
});

test("a mixed summary box resolves to checked and follows its children", async ({ page }) => {
    expect(await isIndeterminate(page.locator(SUMMARY)), "a mixed summary box starts indeterminate").toBe(true);
    expect(await isChecked(page.locator(SUMMARY)), "and unchecked, since its children disagree").toBe(false);

    await page.locator(SUMMARY).click();
    expect(
        await checkedStates(page, MIXED),
        "clicking a mixed box resolves it to checked and sets every child with it",
    ).not.toContain(false);
    expect(
        await isIndeterminate(page.locator(SUMMARY)),
        "the indeterminate property follows the resolution rather than the browser's clear",
    ).toBe(false);

    await page.locator(FIRST_CHILD).click();
    expect(
        await isIndeterminate(page.locator(SUMMARY)),
        "unchecking one child puts the summary box back to indeterminate",
    ).toBe(true);
    expect(await isChecked(page.locator(SUMMARY)), "and drops its checkedness with it").toBe(false);
});

/**
 * Of the two boxes, at least one must stay on, and the page starts with only Email on — so Email is the last one on,
 * and its owner writes it back on whenever it is pressed.
 */
test("an owner that refuses a write leaves the control where it put it", async ({ page }) => {
    expect(await checkedStates(page, REFUSING), "only one of the pair starts on").toEqual([true, false]);

    await page.locator(EMAIL).click();
    expect(
        await isChecked(page.locator(EMAIL)),
        "the input is resynced rather than left holding the browser's pre-change flip",
    ).toBe(true);

    await page.locator(EMAIL).click();
    expect(
        await isChecked(page.locator(EMAIL)),
        "a second click still refuses, which is where a missing resync would have inverted the control",
    ).toBe(true);
});

test("a disabled box refuses activation and focus", async ({ page }) => {
    const before = await isChecked(page.locator(BOX));

    await knob(page, "isDisabled").click();

    await expect(page.locator(BOX), "a disabled box says so through ARIA").toHaveAttribute("aria-disabled", "true");
    expect(await tabIndex(page.locator(BOX)), "and is out of the tab order").toBe(-1);

    await page.locator(BOX).click({ force: true });
    expect(await isChecked(page.locator(BOX)), "and the canceled click leaves the input alone").toBe(before);
    expect(await activeMatches(page, BOX), "clicking a disabled box does not even focus it").toBe(false);
});

test("a reachable disabled box keeps its tab stop and explains itself", async ({ page }) => {
    const before = await isChecked(page.locator(TOOLTIP_BOX));

    await knob(page, "tooltipIsDisabled").click();
    await knob(page, "tooltipIsReachableWhenDisabled").click();

    expect(await tabIndex(page.locator(TOOLTIP_BOX)), "a reachable disabled box keeps its tab stop").toBe(0);

    await page.locator(TOOLTIP_BOX).focus();
    expect(await activeMatches(page, TOOLTIP_BOX), "and can be focused so its tooltip can be read").toBe(true);

    await page.keyboard.press(" ");
    expect(await isChecked(page.locator(TOOLTIP_BOX)), "Space on a reachable disabled box changes nothing").toBe(
        before,
    );

    await page.locator(TOOLTIP_BOX).hover({ force: true });
    await expect(page.locator('[role="tooltip"]'), "hovering it reveals the tooltip that explains it").toBeVisible();
    await expect(
        page.locator(TOOLTIP_BOX),
        "and the tooltip wires itself up as the control's description",
    ).toHaveAttribute("aria-describedby", /.+/);
});
