import { type Page, expect, test } from "@playwright/test";

/**
 * The React `ImageMosaic`, over the React `Mosaic`. The cases follow `e2e/imageMosaic.spec.ts`, which covers the
 * Solid one: every row ends flush with both edges, an image is resized but never reshaped, the row count falls out
 * of the target shape, anchoring the height fills columns instead, and whatever the consumer wraps the image in fills
 * the cell without being told a size.
 */
const STORY = "Exotics/ImageMosaic/Default";

const TILE = '[data-frame] div[style*="left"]';

type Tile = { left: number; top: number; width: number; height: number; ratio: number };

const tiles = (page: Page): Promise<Tile[]> =>
    page.evaluate(
        (selector) =>
            [...document.querySelectorAll(selector)].map((element) => {
                const box = element as HTMLElement;
                const image = box.querySelector("img") as HTMLImageElement;

                return {
                    left: box.offsetLeft,
                    top: box.offsetTop,
                    width: box.offsetWidth,
                    height: box.offsetHeight,
                    ratio: image.naturalWidth / image.naturalHeight,
                };
            }),
        TILE,
    );

const rootSize = (page: Page) =>
    page.evaluate((selector) => {
        const root = (document.querySelector(selector) as HTMLElement).parentElement as HTMLElement;

        return { width: root.offsetWidth, height: root.offsetHeight };
    }, TILE);

const rowsOf = (placed: Tile[]) => {
    const byTop = new Map<number, Tile[]>();

    for (const tile of placed) byTop.set(tile.top, [...(byTop.get(tile.top) ?? []), tile]);

    return [...byTop.values()];
};

const gapOf = async (page: Page) => Number(await page.getByTestId("gap").textContent());

const pickShape = (page: Page, name: string) => page.getByRole("combobox", { name: "Target shape" }).selectOption(name);

const mountPlaced = async (page: Page, mount: (story: string, props?: object) => Promise<unknown>, props?: object) => {
    await mount(STORY, props);
    await expect(page.locator(`${TILE} img`).first()).toBeVisible();
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

test("every row ends flush with both edges, gaps counted", async ({ page, mount }) => {
    await mountPlaced(page, mount);

    const gap = await gapOf(page);
    const root = await rootSize(page);

    const spans = rowsOf(await tiles(page)).map(
        (row) => row.reduce((span, tile) => span + tile.width, 0) + (row.length - 1) * gap,
    );

    for (const span of spans) expect(Math.abs(span - root.width)).toBeLessThanOrEqual(1);
});

test("an image is resized but never reshaped", async ({ page, mount }) => {
    await mountPlaced(page, mount);

    const distorted = (await tiles(page)).filter((tile) => Math.abs(tile.width / tile.height - tile.ratio) > 0.02);

    expect(distorted).toEqual([]);
});

test("every picture carries its text alternative", async ({ page, mount }) => {
    await mountPlaced(page, mount);

    const alts = await page
        .locator(`${TILE} img`)
        .evaluateAll((images) => images.map((image) => image.getAttribute("alt")));

    expect(alts.every((alt) => alt?.startsWith("Sample "))).toBe(true);
});

test("asking for a square lands nearer a square than asking for a panorama does", async ({ page, mount }) => {
    await mountPlaced(page, mount);

    const square = await rootSize(page);

    await pickShape(page, "panorama");

    await expect.poll(async () => (await rootSize(page)).height).toBeLessThan(square.height);
});

test("a taller target shape asks for more rows than a wider one", async ({ page, mount }) => {
    await mountPlaced(page, mount);
    await pickShape(page, "panorama");
    await expect.poll(async () => rowsOf(await tiles(page)).length).toBeGreaterThan(0);

    const wide = rowsOf(await tiles(page)).length;

    await pickShape(page, "portrait");

    await expect.poll(async () => rowsOf(await tiles(page)).length).toBeGreaterThan(wide);
});

test("anchoring the height fills columns instead of rows", async ({ page, mount }) => {
    await mountPlaced(page, mount);

    const upright = await rootSize(page);

    await mountPlaced(page, mount, { sizeAnchor: "height" });

    await expect.poll(async () => (await rootSize(page)).width).not.toBe(upright.width);

    const gap = await gapOf(page);

    await expect
        .poll(async () => {
            const root = await rootSize(page);
            const columns = new Map<number, Tile[]>();

            for (const tile of await tiles(page)) columns.set(tile.left, [...(columns.get(tile.left) ?? []), tile]);

            return [...columns.values()].every(
                (column) =>
                    Math.abs(
                        column.reduce((total, tile) => total + tile.height, 0) +
                            (column.length - 1) * gap -
                            root.height,
                    ) <= 1,
            );
        })
        .toBe(true);
});

test("whatever the consumer wraps the image in fills the cell, without being told a size", async ({ page, mount }) => {
    await mountPlaced(page, mount, { isDecorated: true });
    await expect(page.locator(`${TILE} a`).first()).toBeVisible();

    const mismatched = await page.evaluate((selector) => {
        const cells = [...document.querySelectorAll(selector)] as HTMLElement[];

        return cells
            .map((cell) => {
                const wrapper = cell.querySelector("a") as HTMLElement;

                return {
                    cell: `${cell.offsetWidth}x${cell.offsetHeight}`,
                    wrapper: `${wrapper.offsetWidth}x${wrapper.offsetHeight}`,
                };
            })
            .filter((pair) => pair.cell !== pair.wrapper);
    }, TILE);

    expect(mismatched).toEqual([]);
});

test("a walked image mosaic is one named list with one tab stop", async ({ page, mount }) => {
    await mountPlaced(page, mount, { isWalked: true });

    await expect(page.getByRole("list", { name: "Pictures" })).toHaveCount(1);
    await expect(page.locator('[data-frame] [role="button"][tabindex="0"]')).toHaveCount(1);

    await page.locator('[data-frame] [role="button"][tabindex="0"]').focus();
    await page.keyboard.press("Enter");

    await expect(page.locator('[data-readout="activations"]')).not.toHaveText("");
});
