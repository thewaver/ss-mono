import { expect, test } from "@playwright/test";

import { example, prop, waitUntilStill } from "./helpers";

/**
 * Three properties of the packing can only be confirmed in a browser, because all three depend on sizes the
 * component reads off mounted elements rather than on numbers it was given.
 *
 * The first is that nothing overlaps. The packer places each item on the lowest free spot rather than on a
 * shelf, so an off-by-one in the skyline arithmetic shows up as two tiles sitting on top of each other and
 * as nothing else — the layout still looks broadly plausible.
 *
 * The second is that every item rests on something. A tile's top edge is either the top of the mosaic or
 * exactly one gap below the bottom edge of some other tile, which is what "the next item that fits rises
 * into the hole" means when written down as an invariant. A packer that quietly fell back to rows would
 * still satisfy the no-overlap check and would fail this one.
 *
 * The third is the reading order. Items are rendered in the order they read rather than the order they were
 * passed, so Tab and a screen reader follow the eye — and the property that holds however the arrangement
 * decomposes is that an item announced later never sits above **and** to the left of one announced earlier.
 * Announcement is allowed to move right, and it is allowed to move down; it is never allowed to go back.
 *
 * Items are found by their inline `left`, which only the item wrappers carry. The measure box around the
 * demo and the mosaic root both write inline styles too, but neither writes a position.
 *
 * Both presets share one Playground page, so the demo is addressed by the key of its example rather than by
 * the page: `elements` here, `images` in `imageMosaic.spec.ts`.
 */
const MOSAIC = example("elements");

const item = (scope: string) => `${scope} div[style*="left"]`;

const numberField = (key: string) => `${prop(key)} input`;
const selectField = (key: string) => `${prop(key)} [role="combobox"]`;

const option = '[role="listbox"] [role="option"]';

type Box = { left: number; top: number; right: number; bottom: number; name: string };

const boxes = (page: import("@playwright/test").Page, scope: string): Promise<Box[]> =>
    page.evaluate(
        (selector) =>
            [...document.querySelectorAll(selector)].map((element) => {
                const tile = element as HTMLElement;

                return {
                    left: tile.offsetLeft,
                    top: tile.offsetTop,
                    right: tile.offsetLeft + tile.offsetWidth,
                    bottom: tile.offsetTop + tile.offsetHeight,
                    name: (tile.querySelector("div div") as HTMLElement).innerText.trim(),
                };
            }),
        item(scope),
    );

const rootSize = (page: import("@playwright/test").Page, scope: string) =>
    page.evaluate((selector) => {
        const root = (document.querySelector(selector) as HTMLElement).parentElement as HTMLElement;

        return { width: root.offsetWidth, height: root.offsetHeight };
    }, item(scope));

const setField = async (page: import("@playwright/test").Page, key: string, value: string) => {
    await page.locator(numberField(key)).fill(value);
    await page.locator(numberField(key)).blur();
};

const pick = async (page: import("@playwright/test").Page, key: string, name: string) => {
    await page.locator(selectField(key)).click();
    await page.locator(option, { hasText: name }).click();
};

test.beforeEach(async ({ page }) => {
    await page.goto("/element-mosaic");
    await expect(page.locator(item(MOSAIC)).first()).toBeVisible();
});

test("no two items overlap, however tightly they are packed", async ({ page }) => {
    const placed = await boxes(page, MOSAIC);

    const overlaps = placed.flatMap((a, index) =>
        placed
            .slice(index + 1)
            .filter((b) => a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom)
            .map((b) => `${a.name} over ${b.name}`),
    );

    expect(overlaps, "a skyline off by one shows up here and nowhere else").toEqual([]);
});

test("every item rests on the top edge or one gap under another item, which is what filling a hole means", async ({
    page,
}) => {
    const gap = Number(await page.locator(numberField("gap")).inputValue());
    const placed = await boxes(page, MOSAIC);

    const floating = placed
        .filter((tile) => tile.top !== 0 && !placed.some((other) => other.bottom + gap === tile.top))
        .map((tile) => tile.name);

    expect(floating, "an item resting on nothing means the packer fell back to rows").toEqual([]);
});

test("items are handed over in the order they read, not the order they were given", async ({ page }) => {
    const placed = await boxes(page, MOSAIC);

    expect(placed[0].top, "the first thing announced is the one in the top-left corner").toBe(0);
    expect(placed[0].left).toBe(0);
    expect(
        placed.map((tile) => tile.name),
        "the packing reorders, so the DOM cannot still be alphabetical",
    ).not.toEqual([...placed.map((tile) => tile.name)].sort());
});

test("the announcement never goes back up and to the left of where it already was", async ({ page }) => {
    const placed = await boxes(page, MOSAIC);

    const backwards = placed
        .slice(1)
        .filter((tile, index) => tile.top < placed[index].top && tile.left < placed[index].left)
        .map((tile) => tile.name);

    expect(backwards, "a screen reader reading these would contradict what the eye sees").toEqual([]);
});

test("widening the gap makes the mosaic taller, since the same items need more room", async ({ page }) => {
    await setField(page, "gap", "0");

    const tight = await rootSize(page, MOSAIC);

    await setField(page, "gap", "24");

    await expect.poll(async () => (await rootSize(page, MOSAIC)).height).toBeGreaterThan(tight.height);
});

test("anchoring the height instead grows the mosaic sideways", async ({ page }) => {
    const upright = await rootSize(page, MOSAIC);

    await pick(page, "sizeAnchor", "height");

    await expect
        .poll(async () => (await rootSize(page, MOSAIC)).width, {
            message: "the free side is now the width, so it is no longer the parent's",
        })
        .not.toBe(upright.width);

    const placed = await boxes(page, MOSAIC);

    const overlaps = placed.flatMap((a, index) =>
        placed
            .slice(index + 1)
            .filter((b) => a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom)
            .map((b) => `${a.name} over ${b.name}`),
    );

    expect(overlaps, "the sideways layout is the same packing transposed, so it packs just as cleanly").toEqual([]);
});

/**
 * Tiles are keyed by the item they show, not by where they sit. Taking an item out re-packs the rest, so the
 * reading order shuffles; keyed by position, every tile after the first change would be handed its
 * neighbor's contents, and a glide would then slide the wrong tiles. So each tile element is stamped with
 * the name it carries, one item is taken out, and every element still standing must still carry the stamp it
 * was given — a stamp missing means the element was rebuilt, a stamp that disagrees means it was reused for
 * somebody else.
 */
test("taking an item out keeps every other tile's own element", async ({ page }) => {
    const before = await page.locator(item(MOSAIC)).count();

    await page.evaluate((selector) => {
        for (const element of document.querySelectorAll(selector)) {
            const tile = element as HTMLElement;

            tile.dataset.stamp = (tile.querySelector(":scope > div > div > div") as HTMLElement).innerText.trim();
        }
    }, item(MOSAIC));

    await setField(page, "itemCount", String(before - 1));

    await expect(page.locator(item(MOSAIC))).toHaveCount(before - 1);

    const survivors = await page.evaluate(
        (selector) =>
            [...document.querySelectorAll(selector)].map((element) => {
                const tile = element as HTMLElement;

                return {
                    stamp: tile.dataset.stamp,
                    name: (tile.querySelector(":scope > div > div > div") as HTMLElement).innerText.trim(),
                };
            }),
        item(MOSAIC),
    );

    expect(
        survivors.filter((survivor) => survivor.stamp !== survivor.name),
        "no tile was rebuilt, and none was handed another item's contents",
    ).toEqual([]);
});

/**
 * The walked example passes `onActivate`, which turns the mosaic into one labelled list with a single Tab
 * stop: a `role="button"` inside each tile, only one of which is in the tab order at a time. Left and Right
 * follow the reading order, which is the DOM order; Up and Down follow what the eye sees, going to the tile
 * directly below or above. Pressing a tile grows it, the rest re-pack around it, and focus has to survive the
 * tile element being moved in the document.
 *
 * Tiles are told apart by a stamp the spec writes onto each button, never by the name painted on it, and all
 * geometry is read in layout space from the list items, which are the elements the mosaic positions.
 */
const WALKED = example("walked");
const WALK_LIST = `${WALKED} [role="list"]`;
const WALK_TILE = `${WALK_LIST} [role="button"]`;

type WalkBox = { left: number; top: number; right: number; bottom: number; stamp: string; tabIndex: number };

const stampTiles = (page: import("@playwright/test").Page) =>
    page.evaluate((selector) => {
        document.querySelectorAll(selector).forEach((element, index) => {
            (element as HTMLElement).dataset.stamp = String(index);
        });
    }, WALK_TILE);

const walkBoxes = (page: import("@playwright/test").Page): Promise<WalkBox[]> =>
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

const focusedStamp = (page: import("@playwright/test").Page) =>
    page.evaluate(() => (document.activeElement as HTMLElement | null)?.dataset.stamp);

const isFocusInside = (page: import("@playwright/test").Page, selector: string) =>
    page.evaluate((value) => document.querySelector(value)?.contains(document.activeElement) ?? false, selector);

const walkIsStill = (page: import("@playwright/test").Page) =>
    expect
        .poll(() => page.locator(WALK_LIST).evaluate((element) => element.getAnimations({ subtree: true }).length), {
            message: "the re-pack glide finishes",
        })
        .toBe(0);

/**
 * Whether `to` can be seen from `from` looking straight down (or up): across the width the two share, some
 * of it is not covered by tiles lying between them. A step that jumps a tile standing squarely in the way
 * has skipped the tile the eye goes to first.
 */
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
    test.beforeEach(async ({ page }) => {
        await expect(page.locator(WALK_TILE).first()).toBeVisible();
        await expect
            .poll(
                () =>
                    page
                        .locator(WALK_LIST)
                        .evaluate((list) =>
                            [...list.querySelectorAll('[role="listitem"]')].every(
                                (tile) => getComputedStyle(tile).visibility === "visible",
                            ),
                        ),
                { message: "every tile has been measured and placed before the spec stamps them" },
            )
            .toBe(true);
        await waitUntilStill(page.locator(WALK_LIST));
        await stampTiles(page);
    });

    test("is one named list of tiles, with exactly one of them in the tab order", async ({ page }) => {
        await expect(page.locator(WALK_LIST), "a list a screen reader can name").toHaveAccessibleName(/\S/);

        const tiles = await walkBoxes(page);

        await expect(page.locator(`${WALK_LIST} [role="listitem"]`)).toHaveCount(tiles.length);
        expect(
            tiles.filter((tile) => tile.tabIndex === 0).map((tile) => tile.stamp),
            "the first tile in reading order is the one stop",
        ).toEqual(["0"]);

        await page.locator(WALK_TILE).first().focus();
        await page.keyboard.press("Tab");

        expect(await isFocusInside(page, WALK_LIST), "one Tab press leaves the mosaic altogether").toBe(false);
    });

    test("Left and Right follow the reading order, and neither wraps", async ({ page }) => {
        const count = await page.locator(WALK_TILE).count();

        await page.locator(WALK_TILE).first().focus();
        await page.keyboard.press("ArrowLeft");

        expect(await focusedStamp(page), "there is nothing before the first tile").toBe("0");

        await page.keyboard.press("ArrowRight");

        expect(await focusedStamp(page), "Right goes to the next tile in reading order").toBe("1");

        await page.keyboard.press("ArrowRight");
        await page.keyboard.press("ArrowLeft");

        expect(await focusedStamp(page), "and Left comes back").toBe("1");

        expect(
            (await walkBoxes(page)).filter((tile) => tile.tabIndex === 0).map((tile) => tile.stamp),
            "the tab stop travels with focus, so Tab back in returns here",
        ).toEqual(["1"]);

        await page.keyboard.press("End");

        expect(await focusedStamp(page), "End goes to the last tile in reading order").toBe(String(count - 1));

        await page.keyboard.press("ArrowRight");

        expect(await focusedStamp(page), "there is nothing after the last one").toBe(String(count - 1));

        await page.keyboard.press("Home");

        expect(await focusedStamp(page), "and Home goes back to the first").toBe("0");
    });

    test("Down goes to a tile in sight below, and Up to one in sight above", async ({ page }) => {
        const tiles = await walkBoxes(page);

        await page.locator(WALK_TILE).first().focus();
        await page.keyboard.press("ArrowDown");

        const from = tiles[0];
        const downStamp = await focusedStamp(page);
        const down = tiles.find((tile) => tile.stamp === downStamp)!;

        expect(downStamp, "the top-left tile has something under it").not.toBe("0");
        expect(down.top, "the tile Down reached is below the one it left").toBeGreaterThanOrEqual(from.bottom);
        expect(
            Math.min(from.right, down.right) - Math.max(from.left, down.left),
            "and shares some of its width, rather than being merely next in reading order",
        ).toBeGreaterThan(0);
        expect(isInSight(from, down, tiles), "and no tile stands squarely between the two").toBe(true);

        await page.keyboard.press("ArrowUp");

        const upStamp = await focusedStamp(page);
        const up = tiles.find((tile) => tile.stamp === upStamp)!;

        expect(up.bottom, "Up reached a tile above").toBeLessThanOrEqual(down.top);
        expect(Math.min(up.right, down.right) - Math.max(up.left, down.left)).toBeGreaterThan(0);
        expect(isInSight(down, up, tiles), "in sight of the one it left").toBe(true);
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
            .poll(async () => (await walkBoxes(page)).map((tile) => tile.stamp), {
                message: "the tiles re-packed around the grown one, so the reading order is not what it was",
            })
            .not.toEqual(before.map((tile) => tile.stamp));
        await walkIsStill(page);

        const after = await walkBoxes(page);
        const grown = after.find((tile) => tile.stamp === PRESSED)!;

        expect(grown.right - grown.left, "the pressed tile grew").toBeGreaterThan(pressed.right - pressed.left);
        expect(
            await focusedStamp(page),
            "moving a focused element in the document drops its focus, and the mosaic puts it back",
        ).toBe(PRESSED);
        expect(
            after.filter((tile) => tile.tabIndex === 0).map((tile) => tile.stamp),
            "and the tab stop is still the pressed tile",
        ).toEqual([PRESSED]);

        await page.keyboard.press(" ");

        await expect
            .poll(async () => (await walkBoxes(page)).map((tile) => tile.stamp), {
                message: "Space presses it too, and a second press shrinks it back into its old place",
            })
            .toEqual(before.map((tile) => tile.stamp));
        await walkIsStill(page);

        const shrunk = (await walkBoxes(page)).find((tile) => tile.stamp === PRESSED)!;

        expect(shrunk.right - shrunk.left).toBe(pressed.right - pressed.left);
        expect(await focusedStamp(page), "and focus survived the second move as well").toBe(PRESSED);
    });
});
