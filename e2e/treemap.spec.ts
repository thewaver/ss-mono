import { type Page, expect, test } from "@playwright/test";

import { example, readout } from "./helpers";

/**
 * The tiles are arithmetic over a tree, so the checks are relationships — the tiles against the box they share,
 * one level against the next — rather than pixel positions, which belong to the page's box and its data.
 *
 * Most tests run with reduced motion, which the page answers with a zoom duration of zero, so a level is in place
 * the moment it is asked for. The one test about the zoom itself turns motion back on.
 */
const LIBRARY = example("library");
const TREEMAP = `${LIBRARY} [aria-label="The library's source, by lines of code"]`;
const TILE = `${TREEMAP} > li`;
const BRANCH = `${TILE} [role="button"]`;
const UP = "#treemapUp";

type Box = { left: number; top: number; width: number; height: number };

const readTiles = (page: Page) =>
    page.evaluate((selector) => {
        const items = [...document.querySelectorAll(selector)] as HTMLElement[];

        return items.map((item) => ({
            text: (item.textContent ?? "").trim(),
            left: item.offsetLeft,
            top: item.offsetTop,
            width: item.offsetWidth,
            height: item.offsetHeight,
        }));
    }, TILE);

const readBox = (page: Page) =>
    page.locator(TREEMAP).evaluate((element) => ({
        width: (element as HTMLElement).offsetWidth,
        height: (element as HTMLElement).offsetHeight,
    }));

const overlaps = (first: Box, second: Box) =>
    first.left < second.left + second.width &&
    second.left < first.left + first.width &&
    first.top < second.top + second.height &&
    second.top < first.top + first.height;

const branchNamed = (page: Page, name: string) => page.locator(BRANCH).filter({ hasText: new RegExp(`^${name}`) });

test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/treemap");
    await expect(page.locator(TILE).first()).toBeVisible();
});

test("the tiles cover the box between them, with none overlapping another", async ({ page }) => {
    const tiles = await readTiles(page);
    const box = await readBox(page);
    const covered = tiles.reduce((sum, tile) => sum + tile.width * tile.height, 0);

    expect(covered, "every pixel of the box belongs to exactly one tile").toBe(box.width * box.height);

    tiles.forEach((tile, index) =>
        tiles
            .slice(index + 1)
            .forEach((other) => expect(overlaps(tile, other), `${tile.text} / ${other.text}`).toBe(false)),
    );
});

test("a branch is a button and a leaf is not", async ({ page }) => {
    await expect(branchNamed(page, "Exotics")).toHaveCount(1);
    await expect(
        page
            .locator(TILE)
            .filter({ hasText: /^src files/ })
            .locator('[role="button"]'),
    ).toHaveCount(0);
});

test("pressing a branch shows its children, tiled across the whole box", async ({ page }) => {
    await branchNamed(page, "Exotics").click();

    expect(await readout(page, "library")).toMatch(/^showing src\/Exotics /);
    await expect(branchNamed(page, "Mosaics"), "a branch one level down is now on show").toHaveCount(1);

    const tiles = await readTiles(page);
    const box = await readBox(page);

    expect(tiles.reduce((sum, tile) => sum + tile.width * tile.height, 0)).toBe(box.width * box.height);
});

test("the page's bar goes back up one level at a time, and does nothing at the root", async ({ page }) => {
    await branchNamed(page, "Exotics").click();
    await branchNamed(page, "Mosaics").click();

    expect(await readout(page, "library")).toMatch(/^showing src\/Exotics\/Mosaics /);

    await page.locator(UP).click();
    expect(await readout(page, "library")).toMatch(/^showing src\/Exotics /);

    await page.locator(UP).click();
    expect(await readout(page, "library")).toMatch(/^showing src /);
    await expect(page.locator(UP)).toHaveAttribute("aria-disabled", "true");
});

test("one tab stop: the arrows walk the branches, Enter goes in and Escape comes back to where it went in", async ({
    page,
}) => {
    await page.locator(UP).focus();
    await page.keyboard.press("Tab");

    const first = await page.evaluate(() => document.activeElement?.textContent ?? "");

    await page.keyboard.press("ArrowRight");

    const second = await page.evaluate(() => document.activeElement?.textContent ?? "");

    expect(second, "the arrow moved to another branch").not.toBe(first);
    await expect(
        page.locator(BRANCH).and(page.locator('[tabindex="0"]')),
        "and only that one is a tab stop",
    ).toHaveText(second);

    await page.keyboard.press("Enter");

    expect(await readout(page, "library"), "Enter zoomed into it").not.toMatch(/^showing src /);
    expect(
        await page.evaluate((selector) => document.querySelector(selector)?.contains(document.activeElement), TREEMAP),
        "and focus stayed inside rather than falling to the page",
    ).toBe(true);

    await page.keyboard.press("Escape");

    expect(await readout(page, "library")).toMatch(/^showing src /);
    expect(
        await page.evaluate(() => document.activeElement?.textContent ?? ""),
        "focus is back on the branch it went in through",
    ).toBe(second);
});

test("with motion on, the zoom animates and the old level is gone once it settles", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await branchNamed(page, "Exotics").click();

    expect(
        await page.locator(`${LIBRARY} ul[aria-hidden="true"]`).count(),
        "the level being left is still drawn while the zoom runs",
    ).toBe(1);

    await expect(page.locator(`${LIBRARY} ul[aria-hidden="true"]`), "and removed when it finishes").toHaveCount(0);
    expect(await readout(page, "library")).toMatch(/^showing src\/Exotics /);
});
