import { type Locator, type Page, expect, test } from "@playwright/test";

/**
 * The React `LightCatcher`. There is no Solid spec for it to follow, so these cases state what it does: its wrapper
 * carries a `filter` that sits at the resting brightness with no pointer near, lifts with the pointer on the surface,
 * and goes back to rest when the pointer is outside the active range or the effect is turned off. Brightness is read
 * off the filter as a number and compared with its resting value, never with a figure written here.
 */
const STORY = "Exotics/LightCatcher/Default";
const WRAPPER = '[data-testid="frame"] > div';

const brightnessOf = async (wrapper: Locator) => {
    const filter = await wrapper.evaluate((element) => (element as HTMLElement).style.filter);

    return Number(/brightness\(([\d.]+)\)/.exec(filter)?.[1] ?? Number.NaN);
};

const pointAtSurface = async (page: Page, component: Locator) => {
    const box = (await component.getByTestId("surface").boundingBox())!;

    await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5);
};

test("the surface rests until the pointer is on it, and then lifts", async ({ page, mount }) => {
    const component = await mount(STORY);
    const wrapper = component.locator(WRAPPER);
    const resting = await brightnessOf(wrapper);

    await pointAtSurface(page, component);

    await expect
        .poll(() => brightnessOf(wrapper), { message: "the pointer on it brightens it" })
        .toBeGreaterThan(resting);
    await expect
        .poll(() => wrapper.evaluate((element) => (element as HTMLElement).style.filter))
        .toContain("invert(1)");
});

test("a pointer outside the active range leaves it at rest", async ({ page, mount }) => {
    const component = await mount(STORY, { activeRangePx: 10 });
    const wrapper = component.locator(WRAPPER);
    const resting = await brightnessOf(wrapper);
    const box = (await component.getByTestId("surface").boundingBox())!;

    await page.mouse.move(box.x + box.width * 0.5 + 60, box.y + box.height * 0.5);
    await page.waitForTimeout(100);

    expect(await brightnessOf(wrapper), "on the surface but further from its center than the range").toBe(resting);
});

test("turned off, it ignores the pointer", async ({ page, mount }) => {
    const component = await mount(STORY, { isDisabled: true });
    const wrapper = component.locator(WRAPPER);
    const resting = await brightnessOf(wrapper);

    await pointAtSurface(page, component);
    await page.waitForTimeout(100);

    expect(await brightnessOf(wrapper)).toBe(resting);
});
