import { type Page, expect, test } from "@playwright/test";

import { example, prop, readout } from "./helpers";

/**
 * The same tree as the treemap, drawn as rings. What is checked is which arcs are drawn and what they do — the
 * geometry itself is arithmetic the unit tests already hold, and a painted angle is the page's choice of size.
 *
 * Every arc's text starts with its hover title, so an arc is found by the label drawn on it rather than by the
 * start of its text. Most tests run with reduced motion, which the page answers with a zoom duration of zero.
 */
const LIBRARY = example("library");
const ARC = `${LIBRARY} svg [role="listitem"]`;
const BRANCH = `${LIBRARY} svg [role="button"]`;
const UP = "#sunburstUp";
const SETTLE_MS = 150;

const arcNamed = (page: Page, name: string) =>
    page.locator(ARC).filter({ has: page.locator("text", { hasText: new RegExp(`^${name}$`) }) });

const branchNamed = (page: Page, name: string) =>
    page.locator(BRANCH).filter({ has: page.locator("text", { hasText: new RegExp(`^${name}$`) }) });

const activeLabel = (page: Page) =>
    page.evaluate(() => document.activeElement?.querySelector("text")?.textContent ?? "");

/**
 * The zoom lasts under a second, and the arcs it leaves behind exist only for that long. Counting them once after
 * the click asked "are they hidden while drawn" and "did the count arrive before the zoom ended" at once — and on a
 * loaded machine the click's own round trip can outlast the zoom, so the second answered in the same red as the
 * first. So the page is watched from before the click: after every change the zoom makes to the document, the
 * hidden arcs are counted, and the most ever drawn at once is what is checked. A zoom that drew no hidden arcs
 * still records none, however slowly the spec gets round to asking.
 */
const watchHiddenArcs = (page: Page) =>
    page.evaluate((selector) => {
        const record = window as unknown as { __mostHiddenArcs: number };

        record.__mostHiddenArcs = 0;

        new MutationObserver(() => {
            record.__mostHiddenArcs = Math.max(record.__mostHiddenArcs, document.querySelectorAll(selector).length);
        }).observe(document.body, {
            subtree: true,
            childList: true,
            attributes: true,
            attributeFilter: ["aria-hidden"],
        });
    }, `${ARC}[aria-hidden="true"]`);

const mostHiddenArcs = (page: Page) =>
    page.evaluate(() => (window as unknown as { __mostHiddenArcs: number }).__mostHiddenArcs);

test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/sunburst");
    await expect(page.locator(ARC).first()).toBeVisible();
});

test("two rings are drawn around the middle, and nothing further out", async ({ page }) => {
    await expect(arcNamed(page, "Essentials"), "the first ring").toHaveCount(1);
    await expect(arcNamed(page, "Input"), "the second ring").toHaveCount(1);
    await expect(arcNamed(page, "Calendar"), "a third ring is not drawn").toHaveCount(0);
});

test("the number of rings follows the page", async ({ page }) => {
    await page.locator(`${prop("ringCount")} input`).fill("1");
    await page.locator(`${prop("ringCount")} input`).blur();
    await page.waitForTimeout(SETTLE_MS);

    await expect(arcNamed(page, "Essentials")).toHaveCount(1);
    await expect(arcNamed(page, "Input"), "the second ring has gone").toHaveCount(0);
});

test("an arc with rings outside it is a button and a leaf is not", async ({ page }) => {
    await expect(branchNamed(page, "Exotics")).toHaveCount(1);
    await expect(arcNamed(page, "src files")).toHaveCount(1);
    await expect(arcNamed(page, "src files").locator('[role="button"]')).toHaveCount(0);
});

test("pressing an arc puts it in the middle, with its children in the first ring", async ({ page }) => {
    await branchNamed(page, "Exotics").click();

    expect(await readout(page, "library")).toMatch(/^showing src\/Exotics /);
    await expect(branchNamed(page, "Mosaics"), "a child is now in the first ring").toHaveCount(1);
    await expect(arcNamed(page, "ElementMosaic"), "and a grandchild in the second").toHaveCount(1);
    await expect(arcNamed(page, "Essentials"), "and the old first ring is gone").toHaveCount(0);
});

test("the middle goes back out one level at a time, and does nothing at the root", async ({ page }) => {
    await branchNamed(page, "Exotics").click();
    await branchNamed(page, "Mosaics").click();

    expect(await readout(page, "library")).toMatch(/^showing src\/Exotics\/Mosaics /);

    await page.locator(UP).click();
    expect(await readout(page, "library")).toMatch(/^showing src\/Exotics /);

    await page.locator(UP).click();
    expect(await readout(page, "library")).toMatch(/^showing src /);
    await expect(page.locator(UP)).toHaveAttribute("aria-disabled", "true");
});

test("one tab stop: the arrows walk the arcs, Enter goes in and Escape comes back to where it went in", async ({
    page,
}) => {
    await expect(page.locator(`${BRANCH}[tabindex="0"]`), "exactly one arc is in the tab order").toHaveCount(1);
    await page.locator(`${BRANCH}[tabindex="0"]`).focus();

    const first = await activeLabel(page);

    await page.keyboard.press("ArrowRight");

    const second = await activeLabel(page);

    expect(second, "the arrow moved to another arc").not.toBe(first);

    await page.keyboard.press("Enter");

    const inside = (await readout(page, "library")).split(" ")[1];

    expect(inside, "Enter zoomed into it").toMatch(new RegExp(`/${second}$`));

    await page.keyboard.press("Escape");

    expect((await readout(page, "library")).split(" ")[1], "Escape came out one level").toBe(
        inside.slice(0, inside.lastIndexOf("/")),
    );
    expect(await activeLabel(page), "focus is back on the arc it went in through").toBe(second);
});

test("with motion on, the arcs being left are hidden from a screen reader until they have gone", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await watchHiddenArcs(page);
    await branchNamed(page, "Exotics").click();

    await expect
        .poll(() => mostHiddenArcs(page), "the rings being left are still drawn while the zoom runs")
        .toBeGreaterThan(0);

    await expect(page.locator(`${ARC}[aria-hidden="true"]`), "and removed when it finishes").toHaveCount(0);
    await expect(branchNamed(page, "Mosaics")).toHaveCount(1);
});
