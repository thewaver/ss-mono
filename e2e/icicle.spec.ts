import { type Page, expect, test } from "@playwright/test";

import { example, prop, readout } from "./helpers";

/**
 * The same tree as the treemap, drawn in columns. The layout is arithmetic the unit tests hold; what is checked here is
 * what a press and a key do, and which cells a reader is handed.
 *
 * A cell is found by the name drawn on it followed by its line count. Most tests run with reduced motion, which the
 * page answers with a zoom duration of zero.
 */
const LIBRARY = example("library");
const CELL = `${LIBRARY} li`;
const BUTTON = `${LIBRARY} [role="button"]`;
const SETTLE_MS = 150;

const cellNamed = (page: Page, name: string) => page.locator(BUTTON).filter({ hasText: new RegExp(`^${name} \\d`) });

const activeName = (page: Page) =>
    page.evaluate(() => (document.activeElement?.textContent ?? "").replace(/ [\d,]+ lines$/, "").trim());

/**
 * Which cell is drawn highest in the column to the right of the named one. The order of a column follows the data,
 * so the spec reads it off the page rather than naming it, and a refresh of the library tree cannot break it.
 */
const topmostChildName = (page: Page, parentName: string) =>
    page.locator(BUTTON).evaluateAll((buttons, name) => {
        const nameOf = (element: Element) => (element.textContent ?? "").replace(/ [\d,]+ lines$/, "").trim();
        const parent = buttons.find((button) => nameOf(button) === name)!.getBoundingClientRect();
        const next = buttons
            .map((button) => ({ name: nameOf(button), rect: button.getBoundingClientRect() }))
            .filter(({ rect }) => rect.left >= parent.right - 1 && rect.left < parent.right + parent.width * 0.5)
            .sort((a, b) => a.rect.top - b.rect.top);

        return next[0]?.name;
    }, parentName);

test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/icicle");
    await expect(page.locator(CELL).first()).toBeVisible();
});

test("three columns fit across, and the fourth level is not drawn", async ({ page }) => {
    await expect(cellNamed(page, "src"), "the root in the first").toHaveCount(1);
    await expect(cellNamed(page, "Essentials"), "its children in the second").toHaveCount(1);
    await expect(cellNamed(page, "Input"), "theirs in the third").toHaveCount(1);
    await expect(cellNamed(page, "Calendar"), "and nothing further").toHaveCount(0);
});

test("the number of columns follows the page", async ({ page }) => {
    await page.locator(`${prop("columnCount")} input`).fill("4");
    await page.locator(`${prop("columnCount")} input`).blur();
    await page.waitForTimeout(SETTLE_MS);

    await expect(cellNamed(page, "Calendar"), "a fourth level now fits").toHaveCount(1);
});

test("pressing any cell brings it to the left, and pressing it again goes back up", async ({ page }) => {
    await cellNamed(page, "Exotics").click();

    expect(await readout(page, "library")).toMatch(/^showing src\/Exotics /);
    await expect(cellNamed(page, "src"), "the root has slid out of view").toHaveCount(0);

    await cellNamed(page, "SortableGrid").click();
    expect(await readout(page, "library"), "a leaf can be brought to the left too").toMatch(
        /^showing src\/Exotics\/SortableGrid /,
    );

    await cellNamed(page, "SortableGrid").click();
    expect(await readout(page, "library")).toMatch(/^showing src\/Exotics /);
});

test("the arrows walk a column and across it, Enter brings a cell left, Escape goes back up", async ({ page }) => {
    await expect(page.locator(`${BUTTON}[tabindex="0"]`), "exactly one cell is in the tab order").toHaveCount(1);
    await page.locator(`${BUTTON}[tabindex="0"]`).focus();

    expect(await activeName(page), "the cell in view is where the walk starts").toBe("src");

    await page.keyboard.press("ArrowRight");
    const topmost = await topmostChildName(page, "src");

    expect(await activeName(page), "right goes to the topmost child").toBe(topmost);

    await page.keyboard.press("ArrowDown");

    const below = await activeName(page);

    expect(below, "down goes to the next cell in the column").not.toBe(topmost);

    await page.keyboard.press("ArrowLeft");
    expect(await activeName(page), "left goes to the parent").toBe("src");

    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");

    expect(await readout(page, "library")).toMatch(new RegExp(`^showing src/${below} `));

    await page.keyboard.press("Escape");

    expect(await readout(page, "library")).toMatch(/^showing src /);
    expect(await activeName(page), "focus is back on the cell it went in through").toBe(below);
});

test("with motion on, the cells being left are hidden from a screen reader until they have gone", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await cellNamed(page, "Exotics").click();

    expect(
        await page.locator(`${CELL}[aria-hidden="true"]`).count(),
        "still drawn while the zoom runs",
    ).toBeGreaterThan(0);
    await expect(page.locator(`${CELL}[aria-hidden="true"]`), "and removed when it finishes").toHaveCount(0);
});
