import { type Page, expect, test } from "@playwright/test";

/**
 * The Looks page draws one row per Look, each a radio whose samples are painted in that row's Look whatever the page
 * around it wears, and picking a row applies its Look to the whole Playground. The samples are a picture, not
 * controls. A row is found by the id the page gives it from its Look's registry key, and what a Look paints is never
 * written down: rows are compared with each other, and the page with the row it was switched to.
 */
const LOOKS = '[data-view="looks"]';
const SAMPLES = `${LOOKS} [aria-hidden="true"]`;

const row = (look: string) => `#look-row-${look}`;

/** What the first button among a row's samples looks like: whatever a Look may change about a button. */
const samplePaint = (page: Page, look: string) =>
    page
        .locator(`${row(look)} button > *`)
        .first()
        .evaluate((painter) => {
            const style = getComputedStyle(painter);

            return [
                style.fontFamily,
                style.backgroundColor,
                style.backgroundImage,
                style.boxShadow,
                style.color,
                style.borderColor,
            ].join("|");
        });

/** The classes of the element inside a row that carries the row's Look, two levels in, past the boundary. */
const rowLookClasses = (page: Page, look: string) =>
    page.locator(`${row(look)} > * > *`).evaluate((element) => [...element.classList]);

/** Whether the document root carries every one of those classes, which is what applying a Look to the page does. */
const pageWears = (page: Page, classes: string[]) =>
    page.evaluate((tokens) => tokens.every((token) => document.documentElement.classList.contains(token)), classes);

test.beforeEach(async ({ page }) => {
    await page.goto("/looks");
    await expect(page.locator(LOOKS).getByRole("radio").first()).toBeVisible();
});

test("a row's samples wear its own Look, and keep it when the page changes Look", async ({ page }) => {
    const plasticine = await rowLookClasses(page, "plasticine");
    const terminal = await rowLookClasses(page, "terminal");

    expect(await pageWears(page, plasticine), "the page starts on Plasticine").toBe(true);
    expect(await pageWears(page, terminal), "and not on Terminal").toBe(false);

    const terminalPaint = await samplePaint(page, "terminal");

    expect(terminalPaint, "Terminal's row is drawn unlike Plasticine's").not.toBe(
        await samplePaint(page, "plasticine"),
    );

    await page.locator(LOOKS).getByRole("radio", { name: "Material" }).click();

    await expect.poll(() => pageWears(page, plasticine), "the page has left Plasticine").toBe(false);
    expect(await samplePaint(page, "terminal"), "and Terminal's row is drawn as it was").toBe(terminalPaint);
});

test("clicking a row applies its Look to the page and checks its radio", async ({ page }) => {
    const radio = page.locator(LOOKS).getByRole("radio", { name: "Terminal" });
    const terminal = await rowLookClasses(page, "terminal");

    await expect(radio).not.toBeChecked();

    await radio.click();

    await expect(radio, "the row is picked").toBeChecked();
    await expect(page.locator(LOOKS).getByRole("radio", { checked: true }), "and only that row").toHaveCount(1);
    await expect.poll(() => pageWears(page, terminal), "the page wears the row's Look").toBe(true);
});

test("nothing among the samples takes focus, by keyboard or from script", async ({ page }) => {
    const focusables = page.locator(`${SAMPLES} :is(button, input, textarea, [tabindex])`);

    expect(await focusables.count(), "the samples hold controls that would otherwise be focusable").toBeGreaterThan(0);

    await page.locator(LOOKS).getByRole("radio", { checked: true }).focus();
    await page.keyboard.press("Tab");

    expect(
        await page.evaluate((selector) => document.activeElement?.closest(selector) !== null, SAMPLES),
        "Tab leaves the group without stopping inside a row",
    ).toBe(false);

    const tookFocus = await focusables.evaluateAll((elements) =>
        elements.some((element) => {
            (element as HTMLElement).focus();

            return document.activeElement === element;
        }),
    );

    expect(tookFocus, "no sample accepts focus when asked for it").toBe(false);
});
