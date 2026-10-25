import { expect, test } from "@playwright/test";

import { docsDemo, docsSettled, isIndeterminate } from "./helpers";

const DOCS = "/src/App/Pages/TogglePage/Docs";

const BASIC = docsDemo(DOCS, "Basic");
const DEFAULT = `${BASIC} input`;
const SUMMARY = "#allSettings";
const FIRST_SETTING = "#firstSetting";

test.beforeEach(async ({ page }) => {
    await page.goto("/toggle/docs");
    await expect(page.locator(DEFAULT)).toBeVisible();
    await docsSettled(page);
});

test("a plain toggle is a switch over a native checkbox", async ({ page }) => {
    await expect(page.locator(DEFAULT), "a plain toggle announces as a switch").toHaveAttribute("role", "switch");
    await expect(page.locator(DEFAULT), "over a native checkbox input").toHaveAttribute("type", "checkbox");
});

/**
 * The switch and its words are one painter, hidden from screen readers as a whole, so the name a reader hears is the
 * native input's alone. The words on screen hold that name (WCAG 2.5.3, Label in Name).
 */
test("the painted words are hidden, and the switch carries the same words as its name", async ({ page }) => {
    const painter = page.locator(`${BASIC} [aria-hidden="true"]`).first();
    const name = (await page.locator(DEFAULT).getAttribute("aria-label")) ?? "";

    expect(name, "the switch is named").not.toBe("");
    await expect(painter, "the painter is out of the accessibility tree").toHaveAttribute("aria-hidden", "true");
    await expect(painter, "and shows the words the switch is named by").toContainText(name);
});

test("a mixed toggle drops the switch role and takes it back", async ({ page }) => {
    await expect(
        page.locator(SUMMARY),
        'a mixed toggle drops role="switch", which ARIA gives no mixed state',
    ).not.toHaveAttribute("role");
    expect(await isIndeterminate(page.locator(SUMMARY)), "and falls back to a mixed native checkbox").toBe(true);

    await page.locator(SUMMARY).click();
    await expect(
        page.locator(SUMMARY),
        "resolving the mixed state hands the switch role straight back",
    ).toHaveAttribute("role", "switch");

    await page.locator(FIRST_SETTING).click();
    await expect(page.locator(SUMMARY), "and going mixed again takes it away").not.toHaveAttribute("role");
});
