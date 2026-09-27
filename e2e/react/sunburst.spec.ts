import { type Page, expect, test } from "@playwright/test";

/**
 * The React `Sunburst`. The cases follow `e2e/sunburst.spec.ts`, which covers the Solid one, so the two frameworks are
 * held to the same behavior: which arcs are drawn, which are buttons, zooming in and back out by press, by the page's
 * own button in the middle and by the keyboard, and the arcs being left hidden from a reader while a zoom runs.
 *
 * An arc is found by the label drawn on it. The story's zoom takes no time unless a test asks for one, which is what
 * the Playground does under reduced motion; the ring count is a story prop where the Playground has a knob.
 */
const STORY = "Exotics/Sunburst/Default";
const ARC = 'svg [role="listitem"]';
const BRANCH = 'svg [role="button"]';
const UP = "#sunburstUp";
const READOUT = '[data-readout="library"]';
const ZOOM_MS = 750;

const arcNamed = (page: Page, name: string) =>
    page.locator(ARC).filter({ has: page.locator("text", { hasText: new RegExp(`^${name}$`) }) });

const branchNamed = (page: Page, name: string) =>
    page.locator(BRANCH).filter({ has: page.locator("text", { hasText: new RegExp(`^${name}$`) }) });

const activeLabel = (page: Page) =>
    page.evaluate(() => document.activeElement?.querySelector("text")?.textContent ?? "");

const readout = async (page: Page) => ((await page.locator(READOUT).textContent()) ?? "").trim();

/**
 * The arcs a zoom leaves behind exist only while it runs, so the page is watched from before the press and the most
 * hidden arcs ever drawn at once is what is checked, as the Solid spec does.
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

test("two rings are drawn around the middle, and nothing further out", async ({ page, mount }) => {
    await mount(STORY);

    await expect(arcNamed(page, "Essentials"), "the first ring").toHaveCount(1);
    await expect(arcNamed(page, "Input"), "the second ring").toHaveCount(1);
    await expect(arcNamed(page, "Calendar"), "a third ring is not drawn").toHaveCount(0);
});

test("the number of rings follows the prop", async ({ page, mount }) => {
    await mount(STORY, { ringCount: 1 });

    await expect(arcNamed(page, "Essentials")).toHaveCount(1);
    await expect(arcNamed(page, "Input"), "the second ring has gone").toHaveCount(0);
});

test("an arc with rings outside it is a button and a leaf is not", async ({ page, mount }) => {
    await mount(STORY);

    await expect(branchNamed(page, "Exotics")).toHaveCount(1);
    await expect(arcNamed(page, "src files")).toHaveCount(1);
    await expect(arcNamed(page, "src files").locator('[role="button"]')).toHaveCount(0);
});

test("pressing an arc puts it in the middle, with its children in the first ring", async ({ page, mount }) => {
    await mount(STORY);
    await branchNamed(page, "Exotics").click();

    expect(await readout(page)).toMatch(/^showing src\/Exotics /);
    await expect(branchNamed(page, "Mosaics"), "a child is now in the first ring").toHaveCount(1);
    await expect(arcNamed(page, "ElementMosaic"), "and a grandchild in the second").toHaveCount(1);
    await expect(arcNamed(page, "Essentials"), "and the old first ring is gone").toHaveCount(0);
});

test("the middle goes back out one level at a time, and does nothing at the root", async ({ page, mount }) => {
    await mount(STORY);
    await branchNamed(page, "Exotics").click();
    await branchNamed(page, "Mosaics").click();

    expect(await readout(page)).toMatch(/^showing src\/Exotics\/Mosaics /);

    await page.locator(UP).click();
    expect(await readout(page)).toMatch(/^showing src\/Exotics /);

    await page.locator(UP).click();
    expect(await readout(page)).toMatch(/^showing src /);
    await expect(page.locator(UP)).toHaveAttribute("aria-disabled", "true");
});

test("one tab stop: the arrows walk the arcs, Enter goes in and Escape comes back to where it went in", async ({
    page,
    mount,
}) => {
    await mount(STORY);
    await expect(page.locator(`${BRANCH}[tabindex="0"]`), "exactly one arc is in the tab order").toHaveCount(1);
    await page.locator(`${BRANCH}[tabindex="0"]`).focus();

    const first = await activeLabel(page);

    await page.keyboard.press("ArrowRight");

    const second = await activeLabel(page);

    expect(second, "the arrow moved to another arc").not.toBe(first);

    await page.keyboard.press("Enter");

    const inside = (await readout(page)).split(" ")[1];

    expect(inside, "Enter zoomed into it").toMatch(new RegExp(`/${second}$`));

    await page.keyboard.press("Escape");

    expect((await readout(page)).split(" ")[1], "Escape came out one level").toBe(
        inside.slice(0, inside.lastIndexOf("/")),
    );
    expect(await activeLabel(page), "focus is back on the arc it went in through").toBe(second);
});

test("with motion on, the arcs being left are hidden from a screen reader until they have gone", async ({
    page,
    mount,
}) => {
    await mount(STORY, { zoomDurationMs: ZOOM_MS });
    await watchHiddenArcs(page);
    await branchNamed(page, "Exotics").click();

    await expect
        .poll(() => mostHiddenArcs(page), "the rings being left are still drawn while the zoom runs")
        .toBeGreaterThan(0);

    await expect(page.locator(`${ARC}[aria-hidden="true"]`), "and removed when it finishes").toHaveCount(0);
    await expect(branchNamed(page, "Mosaics")).toHaveCount(1);
});
