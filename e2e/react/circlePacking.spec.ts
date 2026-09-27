import { type Page, expect, test } from "@playwright/test";

/**
 * The React `CirclePacking`. The cases follow `e2e/circlePacking.spec.ts`, which covers the Solid one, so the two
 * frameworks are held to the same behavior: what a press does — into a circle, back to the top from anywhere else, up
 * one level on Escape — and what a reader is handed at each level.
 *
 * A circle is found by its hover title, which starts with its path, because the labels live in their own layer above
 * every circle. The story's zoom takes no time, which is what the Playground does under reduced motion.
 */
const STORY = "Exotics/CirclePacking/Default";
const CIRCLE = 'svg [role="listitem"]';
const BRANCH = 'svg [role="button"]';
const READOUT = '[data-readout="library"]';

const branchAt = (page: Page, path: string) =>
    page.locator(BRANCH).filter({ has: page.locator("title", { hasText: new RegExp(`^${path}\\s`) }) });

const activeTitle = (page: Page) =>
    page.evaluate(() => document.activeElement?.querySelector("title")?.textContent?.split("\n")[0] ?? "");

const readout = async (page: Page) => ((await page.locator(READOUT).textContent()) ?? "").trim();

test("only the circles directly inside the one in view are offered to a screen reader", async ({ page, mount }) => {
    await mount(STORY);

    const offered = page.locator(`${CIRCLE}:not([aria-hidden="true"])`);

    await expect(offered.filter({ has: page.locator("title", { hasText: /^src\/Exotics\s/ }) })).toHaveCount(1);
    await expect(offered.filter({ has: page.locator("title", { hasText: /^src\/Exotics\/Mosaics\s/ }) })).toHaveCount(
        0,
    );
});

test("pressing a circle with circles inside it zooms into it", async ({ page, mount }) => {
    await mount(STORY);
    await branchAt(page, "src/Exotics").click();

    expect(await readout(page)).toMatch(/^showing src\/Exotics /);
    await expect(branchAt(page, "src/Exotics/Mosaics"), "a circle one level down is now a button").toHaveCount(1);
});

test("a press that lands on no circle to zoom into — a leaf, or the circle in view — goes back to the top", async ({
    page,
    mount,
}) => {
    await mount(STORY);
    await branchAt(page, "src/Exotics").click();

    expect(await readout(page)).toMatch(/^showing src\/Exotics /);

    const leaf = page
        .locator(CIRCLE)
        .filter({ has: page.locator("title", { hasText: /^src\/Exotics\/SortableGrid\s/ }) });
    const box = (await leaf.locator("circle").boundingBox())!;

    await page.mouse.click(box.x + box.width * 0.5, box.y + box.height * 0.5);

    expect(await readout(page)).toMatch(/^showing src /);
});

test("one tab stop: the arrows walk the circles, Enter goes in and Escape comes back to where it went in", async ({
    page,
    mount,
}) => {
    await mount(STORY);
    await expect(page.locator(`${BRANCH}[tabindex="0"]`), "exactly one circle is in the tab order").toHaveCount(1);
    await page.locator(`${BRANCH}[tabindex="0"]`).focus();

    const first = await activeTitle(page);

    await page.keyboard.press("ArrowRight");

    const second = await activeTitle(page);

    expect(second, "the arrow moved to another circle").not.toBe(first);

    await page.keyboard.press("Enter");

    expect(await readout(page), "Enter zoomed into it").toMatch(new RegExp(`^showing ${second} `));

    await page.keyboard.press("Escape");

    expect(await readout(page), "Escape came out one level").toMatch(/^showing src /);
    expect(await activeTitle(page), "focus is back on the circle it went in through").toBe(second);
});
