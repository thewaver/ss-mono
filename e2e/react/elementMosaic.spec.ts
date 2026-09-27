import { type Page, expect, test } from "@playwright/test";

import { waitUntilStill } from "../helpers";

/**
 * The React `ElementMosaic`, over the React `Mosaic`. The cases follow `e2e/elementMosaic.spec.ts`, which covers the
 * Solid one: nothing overlaps, every tile rests on the top edge or one gap under another, the document is in reading
 * order and never reads back up and to the left, tiles are keyed by the item they show, and the walked mosaic is one
 * labelled list with one tab stop, Left and Right in reading order, Up and Down by sight, and focus kept across a
 * re-pack.
 *
 * Tiles are found by their inline `left`, which only the tile wrappers carry, and named by the `data-name` the story's
 * painter writes.
 */
const DEFAULT = "Exotics/ElementMosaic/Default";
const WALKED_STORY = "Exotics/ElementMosaic/Walked";

const TILE = '[data-frame] div[style*="left"]';

type Box = { left: number; top: number; right: number; bottom: number; name: string };

const boxes = (page: Page): Promise<Box[]> =>
    page.evaluate(
        (selector) =>
            [...document.querySelectorAll(selector)].map((element) => {
                const tile = element as HTMLElement;

                return {
                    left: tile.offsetLeft,
                    top: tile.offsetTop,
                    right: tile.offsetLeft + tile.offsetWidth,
                    bottom: tile.offsetTop + tile.offsetHeight,
                    name: (tile.querySelector("[data-name]") as HTMLElement).innerText.trim(),
                };
            }),
        TILE,
    );

const rootSize = (page: Page) =>
    page.evaluate((selector) => {
        const root = (document.querySelector(selector) as HTMLElement).parentElement as HTMLElement;

        return { width: root.offsetWidth, height: root.offsetHeight };
    }, TILE);

const overlapsOf = (placed: Box[]) =>
    placed.flatMap((a, index) =>
        placed
            .slice(index + 1)
            .filter((b) => a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom)
            .map((b) => `${a.name} over ${b.name}`),
    );

const mountPlaced = async (page: Page, mount: (story: string, props?: object) => Promise<unknown>, props?: object) => {
    await mount(DEFAULT, props);
    await expect
        .poll(() =>
            page.evaluate(
                (selector) =>
                    [...document.querySelectorAll(selector)].every(
                        (tile) => getComputedStyle(tile).visibility === "visible",
                    ),
                TILE,
            ),
        )
        .toBe(true);
};

test("no two items overlap, however tightly they are packed", async ({ page, mount }) => {
    await mountPlaced(page, mount);

    expect(overlapsOf(await boxes(page))).toEqual([]);
});

test("every item rests on the top edge or one gap under another item", async ({ page, mount }) => {
    await mountPlaced(page, mount);

    const gap = Number(await page.getByTestId("gap").inputValue());
    const placed = await boxes(page);

    const floating = placed
        .filter((tile) => tile.top !== 0 && !placed.some((other) => other.bottom + gap === tile.top))
        .map((tile) => tile.name);

    expect(floating, "an item resting on nothing means the packer fell back to rows").toEqual([]);
});

test("items are handed over in the order they read, not the order they were given", async ({ page, mount }) => {
    await mountPlaced(page, mount);

    const placed = await boxes(page);

    expect(placed[0].top).toBe(0);
    expect(placed[0].left).toBe(0);
    expect(placed.map((tile) => tile.name)).not.toEqual([...placed.map((tile) => tile.name)].sort());
});

test("the announcement never goes back up and to the left of where it already was", async ({ page, mount }) => {
    await mountPlaced(page, mount);

    const placed = await boxes(page);

    const backwards = placed
        .slice(1)
        .filter((tile, index) => tile.top < placed[index].top && tile.left < placed[index].left)
        .map((tile) => tile.name);

    expect(backwards).toEqual([]);
});

test("each tile is told where it falls in the reading order", async ({ page, mount }) => {
    await mountPlaced(page, mount);

    const readings = await page.evaluate(
        (selector) =>
            [...document.querySelectorAll(selector)].map(
                (tile) => (tile.querySelector("[data-name] + div") as HTMLElement).innerText,
            ),
        TILE,
    );

    expect(readings[0]).toBe("reads 1 of 12");
    expect(readings[11]).toBe("reads 12 of 12");
});

test("widening the gap makes the mosaic taller, since the same items need more room", async ({ page, mount }) => {
    await mountPlaced(page, mount);

    await page.getByTestId("gap").fill("0");

    const tight = await rootSize(page);

    await page.getByTestId("gap").fill("24");

    await expect.poll(async () => (await rootSize(page)).height).toBeGreaterThan(tight.height);
});

test("anchoring the height instead grows the mosaic sideways", async ({ page, mount }) => {
    await mountPlaced(page, mount);

    const upright = await rootSize(page);

    await mountPlaced(page, mount, { sizeAnchor: "height" });

    await expect.poll(async () => (await rootSize(page)).width).not.toBe(upright.width);

    expect(overlapsOf(await boxes(page)), "the sideways layout packs just as cleanly").toEqual([]);
});

test("taking an item out keeps every other tile's own element", async ({ page, mount }) => {
    await mountPlaced(page, mount);

    const before = await page.locator(TILE).count();

    await page.evaluate((selector) => {
        for (const element of document.querySelectorAll(selector)) {
            const tile = element as HTMLElement;

            tile.dataset.stamp = (tile.querySelector("[data-name]") as HTMLElement).innerText.trim();
        }
    }, TILE);

    await page.getByTestId("itemCount").fill(String(before - 1));

    await expect(page.locator(TILE)).toHaveCount(before - 1);

    const survivors = await page.evaluate(
        (selector) =>
            [...document.querySelectorAll(selector)].map((element) => {
                const tile = element as HTMLElement;

                return {
                    stamp: tile.dataset.stamp,
                    name: (tile.querySelector("[data-name]") as HTMLElement).innerText.trim(),
                };
            }),
        TILE,
    );

    expect(survivors.filter((survivor) => survivor.stamp !== survivor.name)).toEqual([]);
});

const WALK_LIST = '[data-frame] [role="list"]';
const WALK_TILE = `${WALK_LIST} [role="button"]`;

type WalkBox = { left: number; top: number; right: number; bottom: number; stamp: string; tabIndex: number };

const stampTiles = (page: Page) =>
    page.evaluate((selector) => {
        document.querySelectorAll(selector).forEach((element, index) => {
            (element as HTMLElement).dataset.stamp = String(index);
        });
    }, WALK_TILE);

const walkBoxes = (page: Page): Promise<WalkBox[]> =>
    page.evaluate(
        (selector) =>
            [...document.querySelectorAll(selector)].map((element) => {
                const button = element as HTMLElement;
                const tile = button.closest('[role="listitem"]') as HTMLElement;

                return {
                    left: tile.offsetLeft,
                    top: tile.offsetTop,
                    right: tile.offsetLeft + tile.offsetWidth,
                    bottom: tile.offsetTop + tile.offsetHeight,
                    stamp: button.dataset.stamp ?? "",
                    tabIndex: button.tabIndex,
                };
            }),
        WALK_TILE,
    );

const focusedStamp = (page: Page) => page.evaluate(() => (document.activeElement as HTMLElement | null)?.dataset.stamp);

const isFocusInside = (page: Page, selector: string) =>
    page.evaluate((value) => document.querySelector(value)?.contains(document.activeElement) ?? false, selector);

const walkIsStill = (page: Page) =>
    expect
        .poll(() => page.locator(WALK_LIST).evaluate((element) => element.getAnimations({ subtree: true }).length))
        .toBe(0);

const isInSight = (from: WalkBox, to: WalkBox, all: WalkBox[]) => {
    const start = Math.max(from.left, to.left);
    const end = Math.min(from.right, to.right);
    const [upper, lower] = from.top < to.top ? [from, to] : [to, from];

    const covering = all
        .filter((tile) => tile !== from && tile !== to)
        .filter((tile) => tile.top >= upper.bottom && tile.bottom <= lower.top)
        .map((tile) => [Math.max(tile.left, start), Math.min(tile.right, end)] as const)
        .filter(([left, right]) => left < right)
        .sort((a, b) => a[0] - b[0]);

    let reached = start;

    for (const [left, right] of covering) {
        if (left > reached) return true;

        reached = Math.max(reached, right);
    }

    return reached < end;
};

test.describe("the walked mosaic", () => {
    test.beforeEach(async ({ page, mount }) => {
        await mount(WALKED_STORY);
        await expect(page.locator(WALK_TILE).first()).toBeVisible();
        await expect
            .poll(() =>
                page
                    .locator(WALK_LIST)
                    .evaluate((list) =>
                        [...list.querySelectorAll('[role="listitem"]')].every(
                            (tile) => getComputedStyle(tile).visibility === "visible",
                        ),
                    ),
            )
            .toBe(true);
        await waitUntilStill(page.locator(WALK_LIST));
        await stampTiles(page);
    });

    test("is one named list of tiles, with exactly one of them in the tab order", async ({ page }) => {
        await expect(page.locator(WALK_LIST)).toHaveAccessibleName("Tiles");

        const tiles = await walkBoxes(page);

        await expect(page.locator(`${WALK_LIST} [role="listitem"]`)).toHaveCount(tiles.length);
        expect(tiles.filter((tile) => tile.tabIndex === 0).map((tile) => tile.stamp)).toEqual(["0"]);

        await page.locator(WALK_TILE).first().focus();
        await page.keyboard.press("Tab");

        expect(await isFocusInside(page, WALK_LIST), "one Tab press leaves the mosaic altogether").toBe(false);
    });

    test("Left and Right follow the reading order, and neither wraps", async ({ page }) => {
        const count = await page.locator(WALK_TILE).count();

        await page.locator(WALK_TILE).first().focus();
        await page.keyboard.press("ArrowLeft");

        expect(await focusedStamp(page)).toBe("0");

        await page.keyboard.press("ArrowRight");

        expect(await focusedStamp(page)).toBe("1");

        await page.keyboard.press("ArrowRight");
        await page.keyboard.press("ArrowLeft");

        expect(await focusedStamp(page)).toBe("1");
        expect(
            (await walkBoxes(page)).filter((tile) => tile.tabIndex === 0).map((tile) => tile.stamp),
            "the tab stop travels with focus",
        ).toEqual(["1"]);

        await page.keyboard.press("End");

        expect(await focusedStamp(page)).toBe(String(count - 1));

        await page.keyboard.press("ArrowRight");

        expect(await focusedStamp(page)).toBe(String(count - 1));

        await page.keyboard.press("Home");

        expect(await focusedStamp(page)).toBe("0");
    });

    test("Down goes to a tile in sight below, and Up to one in sight above", async ({ page }) => {
        const tiles = await walkBoxes(page);

        await page.locator(WALK_TILE).first().focus();
        await page.keyboard.press("ArrowDown");

        const from = tiles[0];
        const downStamp = await focusedStamp(page);
        const down = tiles.find((tile) => tile.stamp === downStamp)!;

        expect(downStamp).not.toBe("0");
        expect(down.top).toBeGreaterThanOrEqual(from.bottom);
        expect(Math.min(from.right, down.right) - Math.max(from.left, down.left)).toBeGreaterThan(0);
        expect(isInSight(from, down, tiles)).toBe(true);

        await page.keyboard.press("ArrowUp");

        const upStamp = await focusedStamp(page);
        const up = tiles.find((tile) => tile.stamp === upStamp)!;

        expect(up.bottom).toBeLessThanOrEqual(down.top);
        expect(Math.min(up.right, down.right) - Math.max(up.left, down.left)).toBeGreaterThan(0);
        expect(isInSight(down, up, tiles)).toBe(true);
    });

    test("Enter grows the tile, the rest re-pack around it, and focus stays on the tile it pressed", async ({
        page,
    }) => {
        const PRESSED = "2";

        const before = await walkBoxes(page);
        const pressed = before.find((tile) => tile.stamp === PRESSED)!;

        await page.locator(`${WALK_TILE}[data-stamp="${PRESSED}"]`).focus();
        await page.keyboard.press("Enter");

        await expect
            .poll(async () => (await walkBoxes(page)).map((tile) => tile.stamp))
            .not.toEqual(before.map((tile) => tile.stamp));
        await walkIsStill(page);

        const after = await walkBoxes(page);
        const grown = after.find((tile) => tile.stamp === PRESSED)!;

        expect(grown.right - grown.left, "the pressed tile grew").toBeGreaterThan(pressed.right - pressed.left);
        expect(await focusedStamp(page), "the mosaic puts focus back after moving the element").toBe(PRESSED);
        expect(after.filter((tile) => tile.tabIndex === 0).map((tile) => tile.stamp)).toEqual([PRESSED]);

        await page.keyboard.press(" ");

        await expect
            .poll(async () => (await walkBoxes(page)).map((tile) => tile.stamp))
            .toEqual(before.map((tile) => tile.stamp));
        await walkIsStill(page);

        const shrunk = (await walkBoxes(page)).find((tile) => tile.stamp === PRESSED)!;

        expect(shrunk.right - shrunk.left).toBe(pressed.right - pressed.left);
        expect(await focusedStamp(page), "and focus survived the second move as well").toBe(PRESSED);
    });

    test("a re-pack glides the tiles rather than jumping them", async ({ page }) => {
        await page.locator(WALK_TILE).first().focus();
        await page.keyboard.press("Enter");

        await expect
            .poll(() => page.locator(WALK_LIST).evaluate((element) => element.getAnimations({ subtree: true }).length))
            .toBeGreaterThan(0);
    });

    test("a press activates the tile it landed on, and makes it the tab stop", async ({ page }) => {
        await page.locator(`${WALK_TILE}[data-stamp="3"]`).click();

        await expect(page.locator('[data-readout="activations"]')).not.toHaveText("");
        await expect
            .poll(async () => (await walkBoxes(page)).filter((tile) => tile.tabIndex === 0).map((tile) => tile.stamp))
            .toEqual(["3"]);
    });
});
