import { type Locator, expect, test } from "@playwright/test";

/**
 * The React `CellAnimation` and `ScanlineAnimation` over it. The cases follow `e2e/cellAnimation.spec.ts`, which covers
 * the Solid one, where they are about the component rather than the Playground's source builders: every cell is filled
 * with the source — a drawn one included, whose parentheses an unquoted `url()` would drop — and a new picture starts
 * the timeline over. The rest state what the props promise: pausing holds the grid still, writing the progress scrubs
 * it, the passes end and report it, and the final frame decides what is left. The motion itself is read only as
 * "the cells' transforms changed", never as a value.
 */
const STORY = "Exotics/CellAnimation/Default";
const CELLS = '[data-testid="animation"] [aria-hidden="true"] > div > div';

const cellImages = (component: Locator) =>
    component.locator(CELLS).evaluateAll((cells) => cells.map((cell) => getComputedStyle(cell).backgroundImage));

const transformsOf = (component: Locator) =>
    component
        .locator(CELLS)
        .evaluateAll((cells) => cells.map((cell) => (cell as HTMLElement).style.transform).join("|"));

const progressOf = async (component: Locator) =>
    Number(await component.locator('[data-readout="progress"]').textContent());

test("every cell is filled with the source, a drawn one included", async ({ mount }) => {
    const component = await mount(STORY);

    await expect(component.locator(CELLS), "one cell per place in the grid").toHaveCount(32);

    const drawn = await cellImages(component);

    expect(
        drawn.every((image) => image.startsWith('url("data:image/svg+xml')),
        "the drawn source reaches every cell, which an unquoted url would have dropped",
    ).toBe(true);

    await component.getByTestId("filed").click();

    await expect
        .poll(async () => (await cellImages(component)).every((image) => image.includes("crimson.png")), {
            message: "and a file reaches them just the same",
        })
        .toBe(true);
});

test("a new picture starts the cell timeline over", async ({ mount }) => {
    const component = await mount(STORY, { animationDurationMs: 4000 });

    await expect.poll(() => progressOf(component), { message: "the pass is under way" }).toBeGreaterThan(0.2);

    const before = await progressOf(component);

    await component.getByTestId("filed").click();

    await expect
        .poll(() => progressOf(component), { message: "and it is running again from the start" })
        .toBeLessThan(before);
});

test("paused, the grid holds still, and writing the progress scrubs it", async ({ page, mount }) => {
    const component = await mount(STORY, { animationDurationMs: 4000 });

    await expect.poll(() => progressOf(component)).toBeGreaterThan(0);
    await component.getByTestId("pause").click();

    const held = await transformsOf(component);
    const heldProgress = await progressOf(component);

    await page.waitForTimeout(300);

    expect(await transformsOf(component), "nothing moves while paused").toBe(held);
    expect(await progressOf(component)).toBe(heldProgress);

    await component.getByTestId("scrub").click();

    await expect(component.locator('[data-readout="progress"]')).toHaveText("0.500");
    await expect.poll(() => transformsOf(component), { message: "the grid is drawn at the new point" }).not.toBe(held);

    await component.getByTestId("play").click();
    await expect.poll(() => progressOf(component), { message: "and plays on from it" }).toBeGreaterThan(0.5);
});

test("the passes end when counted out, and say so", async ({ mount }) => {
    const component = await mount(STORY, { animationIterationCount: 2, animationDurationMs: 200 });

    await expect(component.locator('[data-readout="ended"]')).toHaveText("true");
    await expect(component.locator('[data-readout="passes"]'), "one report per pass").toHaveText("2");
    await expect(component.locator(CELLS), "and the default final frame keeps the cells").toHaveCount(32);
});

test("a final frame of nothing takes the cells away, and one of source shows the picture", async ({ mount }) => {
    const empty = await mount(STORY, { animationIterationCount: 1, animationDurationMs: 200, finalFrame: "nothing" });

    await expect(empty.locator(CELLS)).toHaveCount(0);
    expect(
        await empty.locator("img").evaluate((element) => getComputedStyle(element).opacity),
        "and the picture stays hidden",
    ).toBe("0");

    const source = await mount(STORY, { animationIterationCount: 1, animationDurationMs: 200, finalFrame: "source" });

    await expect(source.locator(CELLS)).toHaveCount(0);
    await expect.poll(() => source.locator("img").evaluate((element) => getComputedStyle(element).opacity)).toBe("1");
});

test("named, it is an image; unnamed, it is hidden from assistive technology", async ({ mount }) => {
    const named = await mount(STORY, { ariaLabel: "A red card" });

    await expect(named.getByRole("img", { name: "A red card" })).toHaveCount(1);

    const unnamed = await mount(STORY);

    await expect(unnamed.locator('[data-testid="animation"] > div')).toHaveAttribute("aria-hidden", "true");
    await expect(unnamed.locator('[data-testid="animation"] > div')).not.toHaveAttribute("role");
});

test("scanlines cut the picture into rows, or into columns when they run upright", async ({ mount }) => {
    const sizes = (component: Locator) =>
        component.locator(CELLS).evaluateAll((cells) =>
            cells.map((cell) => ({
                width: (cell as HTMLElement).offsetWidth,
                height: (cell as HTMLElement).offsetHeight,
                boxWidth: (cell.parentElement as HTMLElement).offsetWidth,
                boxHeight: (cell.parentElement as HTMLElement).offsetHeight,
            })),
        );

    const rows = await mount("Exotics/CellAnimation/Scanlines");

    await expect(rows.locator(CELLS)).toHaveCount(10);
    expect(
        (await sizes(rows)).every((cell) => cell.width >= cell.boxWidth),
        "each row runs the whole width",
    ).toBe(true);

    const columns = await mount("Exotics/CellAnimation/Scanlines", { orientation: "vertical" });

    await expect(columns.locator(CELLS)).toHaveCount(10);
    expect(
        (await sizes(columns)).every((cell) => cell.height >= cell.boxHeight),
        "and each column the whole height",
    ).toBe(true);
});
