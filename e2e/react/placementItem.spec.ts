import { type Page, expect, test } from "@playwright/test";

/**
 * The React `PlacementItem`: one item drawn where its placement says, stacked by the consumer's order, and gliding
 * to a new placement only while its box asks it to. The glide and stacking cases follow `e2e/formation.spec.ts`,
 * which covers the Solid item through `Formation`; the rest are the item's own.
 *
 * `getAnimations()` is the browser's own answer to whether anything is moving, so it is what every glide case reads;
 * the duration and easing are not the spec's business.
 */
const STORY = "Primitives/PlacementBox/Default";

const itemOf = (page: Page, index: number | string) => page.locator(`[data-item="${index}"]`).locator("..");

const runningAnimations = (page: Page) =>
    page.evaluate(() =>
        [...document.querySelectorAll("[data-item]")].reduce(
            (count, child) => count + child.parentElement!.getAnimations().length,
            0,
        ),
    );

const writtenPlace = (page: Page) =>
    itemOf(page, 0).evaluate((element) => `${element.style.left} ${element.style.top}`);

test("with a glide set, changing the arrangement moves the items there rather than jumping", async ({
    page,
    mount,
}) => {
    await mount(STORY, { transitionDurationMs: 1000 });

    expect(await runningAnimations(page), "nothing glides into its first place").toBe(0);

    await page.getByTestId("rearrange").click();

    await expect
        .poll(() => runningAnimations(page), { message: "the items are gliding to the new arrangement" })
        .toBeGreaterThan(0);
});

test("with the glide at zero, changing the arrangement moves the items at once", async ({ page, mount }) => {
    await mount(STORY, { transitionDurationMs: 0 });

    const before = await writtenPlace(page);

    await page.getByTestId("rearrange").click();

    await expect.poll(() => writtenPlace(page), { message: "the arrangement did change" }).not.toBe(before);
    expect(await runningAnimations(page), "and nothing is in flight on the way there").toBe(0);
});

test("once a glide has finished, the item stops carrying a transition", async ({ page, mount }) => {
    await mount(STORY, { transitionDurationMs: 200 });

    await page.getByTestId("rearrange").click();

    await expect.poll(() => itemOf(page, 0).evaluate((element) => element.style.transition)).not.toBe("");
    await expect
        .poll(() => itemOf(page, 0).evaluate((element) => element.style.transition), {
            message: "so a later change that is not a rearrangement does not glide",
        })
        .toBe("");
});

test("re-rendering with the same placements starts no glide", async ({ page, mount }) => {
    const component = await mount(STORY, { transitionDurationMs: 1000 });

    await page.getByTestId("rerender").click();
    await expect(component.locator('[data-readout="renders"]')).toHaveText("1");

    expect(await itemOf(page, 0).evaluate((element) => element.style.transition)).toBe("");
    expect(await runningAnimations(page)).toBe(0);
});

test("each item waits its own delay, which is what staggers an arrangement", async ({ page, mount }) => {
    await mount(STORY, { transitionDurationMs: 1000, staggerMs: 300 });

    await page.getByTestId("rearrange").click();

    const delayOf = (index: number) =>
        itemOf(page, index).evaluate((element) => parseFloat(getComputedStyle(element).transitionDelay));

    await expect.poll(() => delayOf(2)).toBeGreaterThan(0);
    expect(await delayOf(1), "the second waits less than the third").toBeLessThan(await delayOf(2));
    expect(await delayOf(0), "and the first not at all").toBe(0);
});

test("the stacking order is the consumer's, a placement's own depth wins, and neither moves anything", async ({
    page,
    mount,
}) => {
    const place = (index: number) =>
        itemOf(page, index).evaluate((element: HTMLElement) => ({
            zIndex: element.style.zIndex,
            left: element.offsetLeft,
            top: element.offsetTop,
        }));

    await mount(STORY);

    const plain = await place(0);

    expect(plain.zIndex, "an item with no order given is left to the document's").toBe("");

    await mount(STORY, { isStacked: true });

    const stacked = [await place(0), await place(1)];

    expect(Number(stacked[1].zIndex), "a later item sits above an earlier one").toBeGreaterThan(
        Number(stacked[0].zIndex),
    );
    expect({ left: stacked[0].left, top: stacked[0].top }).toEqual({ left: plain.left, top: plain.top });

    await mount(STORY, { isStacked: true, hasDepth: true });

    const deep = [await place(0), await place(1)];

    expect(Number(deep[0].zIndex), "the placement's depth outranks the consumer's order").toBeGreaterThan(
        Number(deep[1].zIndex),
    );
    expect({ left: deep[0].left, top: deep[0].top }).toEqual({ left: plain.left, top: plain.top });
});

test("an item outside any box stands where it was placed, still and without a glide", async ({ page, mount }) => {
    await mount("Primitives/PlacementBox/Loose");

    const loose = await itemOf(page, "loose").evaluate((element: HTMLElement) => ({
        left: element.offsetLeft,
        hostWidth: element.parentElement!.offsetWidth,
        transform: element.style.transform,
        transition: element.style.transition,
    }));

    expect(loose.left / loose.hostWidth).toBeCloseTo(0.5, 2);
    expect(loose.transform).toBe("");
    expect(loose.transition).toBe("");
});
