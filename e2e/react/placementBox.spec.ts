import { type Page, expect, test } from "@playwright/test";

/**
 * The React `PlacementBox`: the container its items' positions resolve against, and the pointer tracking it hands
 * down to them. The layout cases follow `e2e/formation.spec.ts`, which covers the Solid box through `Formation`; the
 * pointer and reduced-motion cases are the box's own, driven from a story whose effect grows whichever item the
 * pointer is over.
 *
 * Every position the box writes is in `cqw`, so geometry is read in layout space — `offsetLeft` and `offsetWidth`
 * against the box's own width — and the transforms are compared with each other rather than with written values.
 */
const STORY = "Primitives/PlacementBox/Default";

const itemOf = (page: Page, index: number) => page.locator(`[data-item="${index}"]`).locator("..");

const boxOf = (page: Page) => page.locator('[data-item="0"]').locator("../..");

const transformOf = (page: Page, index: number) => itemOf(page, index).evaluate((element) => element.style.transform);

const runningAnimations = (page: Page) =>
    page.evaluate(() =>
        [...document.querySelectorAll("[data-item]")].reduce(
            (count, child) => count + child.parentElement!.getAnimations().length,
            0,
        ),
    );

test("the box is a query container, which is what the written units resolve against", async ({ page, mount }) => {
    await mount(STORY);

    expect(
        await boxOf(page).evaluate((element) => getComputedStyle(element).containerType),
        "without this the units would silently fall back to the viewport",
    ).toBe("inline-size");
});

test("a position and a size written as fractions of the width land at those fractions", async ({ page, mount }) => {
    await mount(STORY);

    const measured = await itemOf(page, 0).evaluate((element: HTMLElement) => ({
        left: element.offsetLeft,
        width: element.offsetWidth,
        hostWidth: element.parentElement!.offsetWidth,
        written: getComputedStyle(element).left,
    }));

    expect(measured.written.endsWith("px"), "the browser resolved the unit rather than the component").toBe(true);
    expect(measured.left / measured.hostWidth, "the first of three sits a sixth of the way across").toBeCloseTo(
        1 / 6,
        2,
    );
    expect(measured.width / measured.hostWidth, "and its size is a fraction of the width too").toBeCloseTo(0.2, 2);
});

test("the height comes from the width, through a spacer kept out of the accessibility tree", async ({
    page,
    mount,
}) => {
    await mount(STORY);

    const box = await boxOf(page).evaluate((element) => ({
        width: (element as HTMLElement).offsetWidth,
        height: (element as HTMLElement).offsetHeight,
        role: element.getAttribute("role"),
        spacerHidden: element.firstElementChild!.getAttribute("aria-hidden"),
    }));

    expect(box.height / box.width, "a row reserves a quarter of its width").toBeCloseTo(0.25, 2);
    expect(box.role).toBe("presentation");
    expect(box.spacerHidden).toBe("true");

    await page.getByTestId("rearrange").click();

    const tall = await boxOf(page).evaluate((element) => (element as HTMLElement).offsetHeight);

    expect(tall, "and a taller arrangement reserves more, on the first paint").toBeGreaterThan(box.height);
});

test("the box hands its element to the consumer's ref", async ({ mount }) => {
    const component = await mount(STORY);

    await expect(component.locator('[data-readout="boxRef"]')).toHaveText("div");
});

test("without an effect, an item carries no transform however the pointer moves", async ({ page, mount }) => {
    await mount(STORY);

    await itemOf(page, 0).hover();

    expect(await transformOf(page, 0)).toBe("");
});

test("with an effect, the item under the pointer answers it and the rest stay at rest", async ({ page, mount }) => {
    await mount(STORY, { hasEffect: true });

    const resting = await transformOf(page, 0);

    expect(resting, "an item with the pointer away still carries the effect's resting look").not.toBe("");

    await itemOf(page, 0).hover();

    await expect.poll(() => transformOf(page, 0), { message: "the item under the pointer changed" }).not.toBe(resting);
    expect(await transformOf(page, 1), "and its neighbor did not").toBe(resting);

    await itemOf(page, 1).hover();

    await expect
        .poll(() => transformOf(page, 0), { message: "and it settles back once the pointer moves on" })
        .toBe(resting);
});

test("with reduced motion, a glide is not run and the items jump", async ({ page, mount }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await mount(STORY, { transitionDurationMs: 1000 });

    const written = () => itemOf(page, 0).evaluate((element) => `${element.style.left} ${element.style.top}`);
    const before = await written();

    await page.getByTestId("rearrange").click();

    await expect.poll(written, { message: "the arrangement did change" }).not.toBe(before);
    expect(await runningAnimations(page), "and nothing is in flight on the way there").toBe(0);
});
