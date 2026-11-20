import { type Page, expect, test } from "@playwright/test";

import { docsDemo, docsSettled, prop } from "./helpers";

/**
 * The clock on its own page, where the time picker's specs reach it only inside a popup. The basic example starts at
 * 09:30 and shows its value only as the picked option in each column, so that is what is read. The page is `en-GB`,
 * so the columns are named `hour` and `minute` by `Intl.DisplayNames`, not by the painter.
 */
const DOCS = "/src/App/Pages/ClockPage/Docs";

const BASIC = docsDemo(DOCS, "Basic");
const LIMITS = docsDemo(DOCS, "Limits");

const column = (scope: string, name: string) => `${scope} [role="listbox"][aria-label="${name}"]`;

const option = (scope: string, name: string, label: string) =>
    `${column(scope, name)} [role="option"][aria-label="${label}"]`;

const picked = (page: Page, scope: string, name: string) =>
    page.locator(`${column(scope, name)} [role="option"][aria-selected="true"]`);

test.beforeEach(async ({ page }) => {
    await page.goto("/clock/docs");
    await expect(page.locator(column(BASIC, "hour"))).toBeVisible();
    await docsSettled(page);
});

test("each column picks its own unit of the value it holds", async ({ page }) => {
    await expect(picked(page, BASIC, "hour")).toHaveAttribute("aria-label", "09");
    await expect(picked(page, BASIC, "minute")).toHaveAttribute("aria-label", "30");
});

/**
 * The arrows move a highlight and only Enter picks, so walking across a column does not write each hour it passes.
 * Tab lands on the picked hour, the one tab stop the clock keeps.
 */
test("the arrows walk a column and Enter picks", async ({ page }) => {
    await page.locator(option(BASIC, "hour", "09")).focus();
    await page.keyboard.press("ArrowDown");

    await expect(page.locator(option(BASIC, "hour", "10")), "the highlight moves").toBeFocused();
    await expect(picked(page, BASIC, "hour"), "and the value does not").toHaveAttribute("aria-label", "09");

    await page.keyboard.press("Enter");

    await expect(picked(page, BASIC, "hour")).toHaveAttribute("aria-label", "10");
    await expect(picked(page, BASIC, "minute"), "the other unit is left alone").toHaveAttribute("aria-label", "30");
});

test("an hour outside the bounds is offered but refused", async ({ page }) => {
    const early = page.locator(option(LIMITS, "hour", "08"));

    await expect(early, "before opening").toHaveAttribute("aria-disabled", "true");

    const before = await picked(page, LIMITS, "hour").getAttribute("aria-label");

    await early.click({ force: true });

    await expect(picked(page, LIMITS, "hour"), "pressing it picks nothing").toHaveAttribute("aria-label", before!);
});

test("a disabled clock leaves the tab order and refuses the keyboard", async ({ page }) => {
    await page.locator(`${prop("isDisabled")} input`).click();

    await expect(page.locator(`${BASIC} [role="option"][tabindex="0"]`), "no option is a tab stop").toHaveCount(0);

    await page.locator(option(BASIC, "hour", "09")).focus();
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");

    await expect(picked(page, BASIC, "hour"), "nothing it is sent moves it").toHaveAttribute("aria-label", "09");
});
