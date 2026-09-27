import { type Locator, expect, test } from "@playwright/test";

/**
 * The React `ShadowCaster`. There is no Solid spec for it to follow, so these cases state what it does: its wrapper
 * carries a `drop-shadow` filter that falls straight down while nothing points at it, and is thrown away from the
 * pointer once one is near. Only the direction is read, so no figure written here decides the outcome. The lengths are
 * read in order off the filter, whichever side of them the browser writes the color.
 */
const STORY = "Exotics/ShadowCaster/Default";
const WRAPPER = '[data-testid="frame"] > div';

const throwOf = async (wrapper: Locator) => {
    const filter = await wrapper.evaluate((element) => (element as HTMLElement).style.filter);
    const [x, y] = [...filter.matchAll(/(-?[\d.]+(?:e-?\d+)?)px/g)].map((match) => Number(match[1]));

    return { x, y };
};

test("at rest the shadow drops straight down", async ({ mount }) => {
    const component = await mount(STORY);
    const shadow = await throwOf(component.locator(WRAPPER));

    expect(shadow.x, "no sideways throw").toBe(0);
    expect(shadow.y, "and some weight beneath it").toBeGreaterThan(0);
});

test("the shadow is thrown away from the pointer", async ({ page, mount }) => {
    const component = await mount(STORY);
    const wrapper = component.locator(WRAPPER);
    const box = (await component.getByTestId("surface").boundingBox())!;

    await page.mouse.move(box.x + box.width + 100, box.y + box.height * 0.5);
    await expect
        .poll(async () => (await throwOf(wrapper)).x, { message: "a light to the right throws it left" })
        .toBeLessThan(0);

    await page.mouse.move(box.x - 100, box.y + box.height * 0.5);
    await expect
        .poll(async () => (await throwOf(wrapper)).x, { message: "and a light to the left throws it right" })
        .toBeGreaterThan(0);
});

test("turned off, the shadow stays at rest", async ({ page, mount }) => {
    const component = await mount(STORY, { isDisabled: true });
    const wrapper = component.locator(WRAPPER);
    const box = (await component.getByTestId("surface").boundingBox())!;

    await page.mouse.move(box.x + box.width + 100, box.y + box.height * 0.5);
    await page.waitForTimeout(100);

    expect((await throwOf(wrapper)).x).toBe(0);
});
