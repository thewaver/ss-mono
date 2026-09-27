import { type Page, expect, test } from "@playwright/test";

/**
 * The React `ViewportWrapper`, and the React `Viewport` context it provides. The cases follow `e2e/viewport.spec.ts`,
 * which covers the Solid one on the Playground's page: a nested viewport is a fixed square with its own resolution,
 * its scale multiplies with the enclosing one's, a layer opened inside it portals into it, and nothing of that layer
 * is painted outside it. The page's `Select` is not ported yet, so the layer here is a bare `Popover`.
 */
const STORY = "Essentials/ViewportWrapper/Nested";
const STAGE = "[data-stage]";
const ANCHOR = "#anchor";
const LIST = '[role="listbox"]';
const READOUT = "[data-inner-readout]";

const DRIFT_TOLERANCE = 2;
const OUTSIDE_PROBE = 20;

const expectNoOverlap = (anchor: { y: number; height: number }, layer: { y: number; height: number }) => {
    const overlap = Math.min(anchor.y + anchor.height, layer.y + layer.height) - Math.max(anchor.y, layer.y);

    expect(overlap, "the layer is clear of its anchor").toBeLessThanOrEqual(DRIFT_TOLERANCE);
};

const isListPaintedAt = (page: Page, point: { x: number; y: number }) =>
    page.evaluate((at) => document.elementFromPoint(at.x, at.y)?.closest('[role="listbox"]') != null, point);

const paintedScale = (page: Page) =>
    page
        .locator(ANCHOR)
        .evaluate((element) => element.getBoundingClientRect().height / (element as HTMLElement).offsetHeight);

test("the scale resizes the content without moving the boundary", async ({ page, mount }) => {
    await mount(STORY);

    const stageBefore = (await page.locator(STAGE).boundingBox())!;
    const anchorBefore = (await page.locator(ANCHOR).boundingBox())!;

    await expect(page.locator(READOUT), "a square drawn at its own resolution is at one").toHaveText(/1\.00×/);

    await mount(STORY, { scalePercent: 50 });

    const stageAfter = (await page.locator(STAGE).boundingBox())!;
    const anchorAfter = (await page.locator(ANCHOR).boundingBox())!;

    expect(stageAfter.height, "the square is the same square").toBe(stageBefore.height);
    expect(anchorAfter.height, "while the control inside it is drawn at half the size").toBeLessThan(
        anchorBefore.height,
    );
    await expect(page.locator(READOUT), "and the viewport reports the scale it is drawing at").toHaveText(/0\.50×/);
});

test("a nested viewport's scale is the product of both, not either one", async ({ page, mount }) => {
    await mount(STORY, { scalePercent: 50 });

    await expect(page.locator(READOUT)).toHaveText(/0\.50×/);
    expect(await paintedScale(page), "a control two levels in is painted at half its layout size").toBeCloseTo(0.5, 1);

    const window = page.viewportSize()!;

    await page.setViewportSize({ width: window.width, height: Math.round(window.height * 0.5) });

    await expect(
        page.locator(READOUT),
        "halving the window halves the outer factor and leaves the inner one, so the product quarters",
    ).toHaveText(/0\.25×/);
    await expect
        .poll(() => paintedScale(page), { message: "which is what the control is drawn at" })
        .toBeCloseTo(0.25, 1);
});

test("a layer opened inside a nested viewport portals into that viewport", async ({ page, mount }) => {
    await mount(STORY);

    await page.locator(ANCHOR).click();
    await expect(page.locator(LIST)).toBeVisible();

    expect(
        await page.locator(LIST).evaluate((element) => element.closest("[data-stage]") !== null),
        "the list lives inside the square rather than at the foot of the document",
    ).toBe(true);
});

test("a list with nowhere to fit keeps its size, stays off its anchor, and is cut by the edge", async ({
    page,
    mount,
}) => {
    await mount(STORY, { scalePercent: 200, anchorTop: 50 });

    await page.locator(ANCHOR).click();
    await expect(page.locator(LIST)).toBeVisible();

    const stage = (await page.locator(STAGE).boundingBox())!;
    const anchor = (await page.locator(ANCHOR).boundingBox())!;

    await expect
        .poll(async () => (await page.locator(LIST).boundingBox())!.height, {
            message: "the list kept the size its painter asked for rather than shrinking to fit",
        })
        .toBeGreaterThan(stage.height * 0.5);

    const list = (await page.locator(LIST).boundingBox())!;

    expect(
        list.y < stage.y - DRIFT_TOLERANCE || list.y + list.height > stage.y + stage.height + DRIFT_TOLERANCE,
        "so its box really does hang past the square",
    ).toBe(true);
    expectNoOverlap(anchor, list);

    for (const y of [stage.y - OUTSIDE_PROBE, stage.y + stage.height + OUTSIDE_PROBE]) {
        expect(
            await isListPaintedAt(page, { x: stage.x + stage.width * 0.5, y }),
            "and none of it is painted outside, because the viewport clips",
        ).toBe(false);
    }
});

test("a list opened near the bottom edge turns around rather than cross it", async ({ page, mount }) => {
    await mount(STORY, { anchorTop: 85 });

    await page.locator(ANCHOR).click();
    await expect(page.locator(LIST)).toBeVisible();

    const stage = (await page.locator(STAGE).boundingBox())!;
    const anchor = (await page.locator(ANCHOR).boundingBox())!;

    await expect
        .poll(async () => (await page.locator(LIST).boundingBox())!.y, { message: "the list sits above its anchor" })
        .toBeLessThan(anchor.y);

    const list = (await page.locator(LIST).boundingBox())!;

    expect(list.y, "and inside the square").toBeGreaterThanOrEqual(stage.y - DRIFT_TOLERANCE);
    expectNoOverlap(anchor, list);
});
