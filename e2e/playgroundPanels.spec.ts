import { expect, test } from "@playwright/test";

import { inlineStyle, inputValue, prop, revealProp } from "./helpers";

const CORNER_GRID = '[data-panel="local"] [style*="grid-template-columns"]';

/**
 * The Playground's props panels are the only consumer of these controls that was not written to
 * demonstrate them. These assertions are what makes that migration a fact rather than a claim: no native
 * control is left, and a migrated field still drives the page state the raw one used to.
 */
test.beforeEach(async ({ page }) => {
    await page.goto("/shape");
    await expect(page.locator('[data-panel="global"]').first()).toBeVisible();
});

test("no native control survives in a props panel", async ({ page }) => {
    await revealProp(page, "shouldClipChildren", "default");

    await expect(page.locator("select"), "no native select survives in a props panel").toHaveCount(0);
    await expect(page.locator("input[disabled]"), "and nothing uses the native disabled attribute").toHaveCount(0);

    expect(
        await page.locator('[role="combobox"]').count(),
        "the panel's dropdowns are Select instead",
    ).toBeGreaterThanOrEqual(4);
    expect(await page.locator('input[type="checkbox"]').count(), "and its toggles are Checkbox").toBeGreaterThanOrEqual(
        3,
    );
    expect(
        await page.locator('button[aria-haspopup="dialog"]').count(),
        "with a ColorInput for the color swatches, which is now its own popup rather than the OS dialog",
    ).toBeGreaterThanOrEqual(1);
});

test("a migrated Checkbox still drives the page state the raw one did", async ({ page }) => {
    await revealProp(page, "hasIndividualCorners", "default");

    expect(
        await inlineStyle(page.locator(CORNER_GRID).first(), "grid-template-columns"),
        "the corner grid starts collapsed to one column",
    ).toBe("repeat(1, 1fr)");

    await page.locator(`${prop("hasIndividualCorners")} input`).click();
    expect(
        await inlineStyle(page.locator(CORNER_GRID).first(), "grid-template-columns"),
        "and a migrated Checkbox still drives the page state the raw one did",
    ).not.toBe("repeat(1, 1fr)");
});

test("a migrated Select still drives the page state the raw one did", async ({ page }) => {
    const before = await page.locator('[role="combobox"]').first().textContent();

    await page.locator('[role="combobox"]').first().click();
    await expect(page.locator('[role="combobox"]').first()).toHaveAttribute("aria-activedescendant", /.+/);
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");

    expect(await page.locator('[role="combobox"]').first().textContent(), "and a migrated Select does too").not.toBe(
        before,
    );
});

/**
 * The panel's number fields used to bring every keystroke into range before handing it to the page, and the
 * page's new value was then written straight back over the text — so with a floor of 10, pressing `5` to
 * begin `50` replaced it with `10` and the second digit had nowhere to land. The floor and the ceiling belong
 * to the value the field settles on: `NumberInput` now hands an out-of-range reading to nobody and clamps
 * when the field is left, so the page keeps the last value it was given and the text is left alone. This
 * assertion is here as well as in `numberInput.spec.ts` because the panel is where the fault shipped.
 */
test("a migrated NumberInput is not brought into range while it is still being typed", async ({ page }) => {
    // The cell size only shows while a pattern is painting something, so the fill is switched to one first.
    await page.getByRole("combobox", { name: "Fill", exact: true }).click();
    await page.getByRole("option", { name: "Timed pattern", exact: true }).click();
    await revealProp(page, "cellSize");
    const field = page.locator(`${prop("cellSize")} input`);

    await field.focus();
    await page.keyboard.press("ControlOrMeta+a");
    await page.keyboard.type("5");
    expect(await inputValue(field), "the first digit survives a floor of 10").toBe("5");

    await page.keyboard.type("0");
    expect(await inputValue(field), "so the second one has somewhere to land").toBe("50");

    await field.blur();
    expect(await inputValue(field), "an in-range value stands once the field is left").toBe("50");

    await field.focus();
    await page.keyboard.press("ControlOrMeta+a");
    await page.keyboard.type("5");
    await field.blur();
    expect(await inputValue(field), "and leaving is when an out-of-range one is brought in").toBe("10");
});

/**
 * Every row of a props panel says what it controls: a prop of the component, a sentence saying how the row reaches one,
 * or that it is the example's alone. Read as the tooltip of the row's hint button carrying a line of its own with
 * something in it, on a page whose panel mixes all three kinds; what the line says is the page's copy and is not
 * checked here.
 */
test("every row's hint says what the row controls", async ({ page }) => {
    await page.goto("/overhead-wheel");

    const rows = page.locator('[data-prop] button[aria-label^="About "]');

    await expect(rows.first()).toBeVisible();

    for (const button of await rows.all()) {
        await button.focus();

        const line = page.locator('[role="tooltip"] [data-hint-controls]').last();

        await expect(line, `${await button.getAttribute("aria-label")} names what it controls`).toBeVisible();
        expect((await line.textContent())?.trim().length ?? 0).toBeGreaterThan(0);

        await button.blur();
    }
});

/**
 * A long prop path is allowed to break after each dot, so it wraps inside the tooltip instead of running out of it.
 * Read as the line's content never being wider than the line itself.
 */
test("a long prop path wraps inside the hint rather than running out of it", async ({ page }) => {
    await page.goto("/accordion/docs");

    const button = page.locator('[data-prop][data-testid="transitionDurationMs"] button[aria-label^="About "]');

    await button.focus();

    const line = page.locator('[role="tooltip"] [data-hint-controls]').last();

    await expect(line).toBeVisible();
    expect(
        await line.evaluate((element) => element.scrollWidth <= element.clientWidth + 1),
        "nothing runs past the edge",
    ).toBe(true);
});
