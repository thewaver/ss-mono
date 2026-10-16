import { type Page, expect, test } from "@playwright/test";

import { demo, prop, revealProp } from "./helpers";

/**
 * The RGB Splitter wraps its content in an element whose `filter` points at an SVG filter it renders beside the
 * content. The split's offsets are drawn at random each time it opens, so no offset is ever compared with a number:
 * what is read is whether the wrapper points at the filter at all, whether the filter it names is in the page,
 * and whether the shifts are something other than nothing.
 *
 * The photo example's wrapper is the image's parent. The pointer's far corner of the window is well outside the
 * split's range, which is what "away" means below.
 */
const PHOTO = demo("photo");
const IMAGE = `${PHOTO} img`;
const FAR_AWAY = { x: 1, y: 1 };

const filterOf = (page: Page) =>
    page.locator(IMAGE).evaluate((image) => (image.parentElement as HTMLElement).style.filter);

const filterId = (filter: string) => /url\(["']?#([^"')]+)["']?\)/.exec(filter)?.[1];

const isSplit = (page: Page) =>
    page.locator(IMAGE).evaluate((image) => {
        const id = /url\(["']?#([^"')]+)["']?\)/.exec((image.parentElement as HTMLElement).style.filter)?.[1];
        const offsets = id ? [...(document.getElementById(id)?.querySelectorAll("feOffset") ?? [])] : [];

        return offsets.some(
            (offset) => Number(offset.getAttribute("dx")) !== 0 || Number(offset.getAttribute("dy")) !== 0,
        );
    });

const blendModes = (page: Page) =>
    page
        .locator(PHOTO)
        .evaluate((element) => [
            ...new Set([...element.querySelectorAll("feBlend")].map((blend) => blend.getAttribute("mode"))),
        ]);

const chooseColorMixing = async (page: Page, name: string) => {
    await revealProp(page, "colorMixing");
    await page.locator(`${prop("colorMixing")} [role="combobox"]`).click();
    await page.getByRole("option", { name, exact: true }).click();
};

test.beforeEach(async ({ page }) => {
    await page.goto("/rgb-splitter");
    await page.locator(PHOTO).scrollIntoViewIfNeeded();
    await page.mouse.move(FAR_AWAY.x, FAR_AWAY.y);
});

/**
 * Nothing is written while the content rests, since even an unshifted split would draw see-through pixels a little
 * more opaque than the original.
 */
test("the content carries no filter until the pointer comes near", async ({ page }) => {
    await expect.poll(() => filterOf(page)).toBe("");
});

test("the pointer on the content's center points it at a filter that is in the page, with the channels shifted", async ({
    page,
}) => {
    await page.locator(IMAGE).hover();

    await expect.poll(async () => filterId(await filterOf(page))).toBeTruthy();

    const id = filterId(await filterOf(page))!;

    await expect(page.locator(`filter[id="${id}"]`)).toHaveCount(1);
    await expect.poll(() => isSplit(page)).toBe(true);
});

test("the filter is taken off again once the pointer goes away", async ({ page }) => {
    await page.locator(IMAGE).hover();
    await expect.poll(async () => filterId(await filterOf(page))).toBeTruthy();

    await page.mouse.move(FAR_AWAY.x, FAR_AWAY.y);

    await expect.poll(() => filterOf(page)).toBe("");
});

test("a disabled splitter stays whole with the pointer on its center", async ({ page }) => {
    await revealProp(page, "isDisabled");
    await page.locator(`${prop("isDisabled")} input`).check();

    await page.locator(IMAGE).hover();

    await expect.poll(() => filterOf(page)).toBe("");
});

/**
 * The two ways of putting the channels back together are told apart by the blend the filter uses, and only by
 * the two being different from each other. Following the color scheme lands on one of the two.
 */
test("the two color mixings blend differently, and following the color scheme picks one of them", async ({ page }) => {
    await chooseColorMixing(page, "additive");
    await expect.poll(async () => (await blendModes(page)).length).toBe(1);
    const [additive] = await blendModes(page);

    await chooseColorMixing(page, "subtractive");
    await expect.poll(async () => (await blendModes(page))[0]).not.toBe(additive);
    const [subtractive] = await blendModes(page);

    await chooseColorMixing(page, "from color-scheme");
    await expect.poll(async () => [additive, subtractive].includes((await blendModes(page))[0])).toBe(true);
});
