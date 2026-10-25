import { type Page, expect, test } from "@playwright/test";

import { activeMatches, attributesOf, docsDemo, docsSettled, inlineStyle, prop } from "./helpers";

const DOCS = "/src/App/Pages/RadioPage/Docs";

const BASIC = docsDemo(DOCS, "Basic");
const DISABLED_OPTION = docsDemo(DOCS, "DisabledOption");
const SEGMENTED = docsDemo(DOCS, "Segmented");

const option = (scope: string, label: string) => `${scope} input[aria-label="${label}"]`;

const knob = (page: Page, key: string) => page.locator(`${prop(key)} input`);

/**
 * No example shows its value in words any more, so the value is read the way a screen reader reads it: the name of
 * the radio that is checked, or `undefined` while none is.
 */
const checkedLabel = (page: Page, scope: string) =>
    page
        .locator(`${scope} input`)
        .evaluateAll(
            (inputs) =>
                (inputs as HTMLInputElement[]).find((input) => input.checked)?.getAttribute("aria-label") ?? undefined,
        );

test.beforeEach(async ({ page }) => {
    await page.goto("/radio/docs");
    await expect(page.locator(`${BASIC} input`).first()).toBeVisible();
    await docsSettled(page);
});

test("a group is named on its own element and uses no native disabled", async ({ page }) => {
    await expect(page.locator(`${BASIC} [role="radiogroup"]`), "the group is named on its own element").toHaveAttribute(
        "aria-label",
        /.+/,
    );

    await knob(page, "isDisabled").click();
    await expect(page.locator("input[disabled]"), "no radio carries the native disabled attribute").toHaveCount(0);
});

/**
 * Each radio's painter draws the dot and the option's words, and is hidden from screen readers; the native input
 * carries the name, and the words on screen hold it (WCAG 2.5.3, Label in Name).
 */
test("the painted words are hidden, and each radio carries the same words as its name", async ({ page }) => {
    const radios = page.locator(`${BASIC} input`);

    for (let index = 0; index < (await radios.count()); index++) {
        const radio = radios.nth(index);
        const painter = radio.locator("xpath=..").locator('[aria-hidden="true"]').first();
        const name = (await radio.getAttribute("aria-label")) ?? "";

        expect(name, "the radio is named").not.toBe("");
        await expect(painter, "its painter is out of the accessibility tree").toHaveAttribute("aria-hidden", "true");
        await expect(painter, "and shows the words the radio is named by").toContainText(name);
    }
});

test("a group is one tab stop that travels with the selection", async ({ page }) => {
    expect(
        await attributesOf(page, `${BASIC} input`, "tabindex"),
        "a group is one tab stop, and with nothing picked it starts on the first navigable radio",
    ).toEqual(["0", "-1", "-1"]);

    await page.locator(option(BASIC, "Small")).focus();
    await page.keyboard.press("ArrowRight");
    expect(await checkedLabel(page, BASIC), "an arrow both moves and selects").toBe("Medium");
    expect(await activeMatches(page, option(BASIC, "Medium")), "and focus follows the selection").toBe(true);
    expect(await attributesOf(page, `${BASIC} input`, "tabindex"), "the single tab stop moves with it").toEqual([
        "-1",
        "0",
        "-1",
    ]);
});

test("the walk wraps and honors the edge keys", async ({ page }) => {
    await page.locator(option(BASIC, "Small")).focus();

    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");
    expect(await checkedLabel(page, BASIC), "the walk wraps around the end").toBe("Small");

    await page.keyboard.press("End");
    expect(await checkedLabel(page, BASIC), "End jumps to the last radio").toBe("Large");

    await page.keyboard.press("Home");
    expect(await checkedLabel(page, BASIC), "Home jumps back to the first").toBe("Small");
});

test("a wholly disabled group has no tab stop at all", async ({ page }) => {
    await knob(page, "isDisabled").click();

    expect(
        await attributesOf(page, `${BASIC} input`, "tabindex"),
        "a group whose every radio is disabled has no tab stop at all",
    ).toEqual(["-1", "-1", "-1"]);
});

/**
 * Medium is the disabled option, and Small is picked to begin with. Without the knob the walk steps straight over
 * Medium; with it, Medium is reachable so its tooltip can be read, and the walk stops there without picking it.
 */
test("the walk steps over a disabled radio, and stops on a reachable one without selecting it", async ({ page }) => {
    await expect(page.locator(option(DISABLED_OPTION, "Medium")), "Medium is the disabled one").toHaveAttribute(
        "aria-disabled",
        "true",
    );

    await page.locator(option(DISABLED_OPTION, "Small")).focus();
    await page.keyboard.press("ArrowRight");
    expect(await checkedLabel(page, DISABLED_OPTION), "the walk passes over a disabled radio").toBe("Large");

    await knob(page, "isReachableWhenDisabled").click();

    await page.locator(option(DISABLED_OPTION, "Small")).click();
    await page.keyboard.press("ArrowRight");
    expect(
        await activeMatches(page, option(DISABLED_OPTION, "Medium")),
        "the walk stops on a disabled radio that is reachable, so its tooltip can be read",
    ).toBe(true);
    expect(await checkedLabel(page, DISABLED_OPTION), "and refuses to select it while it is there").toBe("Small");

    await page.keyboard.press("ArrowRight");
    expect(await checkedLabel(page, DISABLED_OPTION), "carrying on from it selects the next enabled radio").toBe(
        "Large",
    );

    await page.locator(option(DISABLED_OPTION, "Medium")).click({ force: true });
    expect(
        await checkedLabel(page, DISABLED_OPTION),
        "clicking a reachable disabled radio leaves the value alone too",
    ).toBe("Large");
});

/**
 * The floater is the group's, not the painter's: `RadioGroup` measures the selected radio's wrapper and
 * writes the box as inline `top` / `left` / `width` / `height`, and the consumer only paints inside it.
 * So what is asserted here is the measurement, read off the wrapper the library positions — the painted
 * child carries a hashed class and says nothing about where it is.
 *
 * The first assertion is the one that catches a floater that mounted but never measured: a box still
 * sitting at its initial empty style would pass a visibility check and fail this. The second is the
 * movement itself, polled because the position is written from a `ResizeObserver` callback rather than
 * synchronously with the click.
 *
 * A group with no `renderSelectionFloater` runs no observer at all, which is why only the segmented group has a box
 * to find; the basic one is checked for its absence so that the guard cannot quietly stop guarding.
 */
const FLOATER_TIMEOUT_MS = 5_000;

test("the floater is measured from the selected radio and moves with it", async ({ page }) => {
    await expect(
        page.locator(`${BASIC} [data-floater]`),
        "a group that passes no floater renders none, and runs no observer for one",
    ).toHaveCount(0);

    const box = page.locator(`${SEGMENTED} [data-floater]`).locator("..");
    const before = await inlineStyle(box, "left");

    expect(before, "the floater is placed off a real measurement rather than left at zero").not.toBe("");

    const unpicked = await page
        .locator(`${SEGMENTED} input`)
        .evaluateAll(
            (inputs) =>
                (inputs as HTMLInputElement[]).find((input) => !input.checked)?.getAttribute("aria-label") ?? "",
        );

    await page.locator(option(SEGMENTED, unpicked)).click();

    await expect.poll(() => inlineStyle(box, "left"), { timeout: FLOATER_TIMEOUT_MS }).not.toBe(before);
    expect(await checkedLabel(page, SEGMENTED), "and the value moved with it").toBe(unpicked);
});

test("each group generates its own name", async ({ page }) => {
    const names = await attributesOf(page, "input[type='radio']", "name");

    expect(new Set(names).size, "each group generates its own name, so the browser cannot mix two of them").toBe(
        await page.locator('[role="radiogroup"]').count(),
    );
});

/**
 * The arc rating is the same radios as the row rating, with a layout function added and nothing else
 * changed. A group takes children rather than a list of records, so the placement cannot be handed down
 * as a prop — each `Radio` asks the group's context for its own, keyed on the entry it registered — and
 * these check that the answer arrives and that the group's own behavior is untouched by it.
 */
const ARC = docsDemo(DOCS, "Arc");
const RATING = docsDemo(DOCS, "Rating");

const placedBox = (scope: string) => `${scope} [role="presentation"][style*="left"]`;

const star = (scope: string, count: number) =>
    `${scope} input[aria-label="${count === 1 ? "1 star" : `${count} stars`}"]`;

test("every radio in a laid-out group gets a box, and one in a row gets none", async ({ page }) => {
    await expect(page.locator(placedBox(ARC))).toHaveCount(await page.locator(`${ARC} input`).count());
    await expect(page.locator(placedBox(RATING)), "the row rating places nothing").toHaveCount(0);
});

test("a placed radio is still a radio: the walk, the single tab stop and the selection all hold", async ({ page }) => {
    const states = await page
        .locator(`${ARC} input`)
        .evaluateAll((inputs) =>
            (inputs as HTMLInputElement[]).map((input) => ({ checked: input.checked, stop: input.tabIndex === 0 })),
        );

    expect(
        states.filter((state) => state.stop),
        "one tab stop",
    ).toHaveLength(1);
    expect(
        states.findIndex((state) => state.stop),
        "sitting on the selected star",
    ).toBe(states.findIndex((state) => state.checked));

    await page.locator(star(ARC, 3)).click();
    await page.keyboard.press("ArrowRight");

    expect(await checkedLabel(page, ARC), "an arrow round the arc both moves and selects").toBe("4 stars");
    expect(await activeMatches(page, star(ARC, 4)), "and focus follows it").toBe(true);
});

test("a placed radio is clicked where it is drawn, not where the row would have put it", async ({ page }) => {
    await page.locator(star(ARC, 1)).click();

    expect(await checkedLabel(page, ARC), "the first star sits at one end of the arc and takes the press").toBe(
        "1 star",
    );

    await page.locator(star(ARC, 5)).click();

    expect(await checkedLabel(page, ARC), "and the last at the other").toBe("5 stars");
});
