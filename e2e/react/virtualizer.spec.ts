import { expect, test } from "@playwright/test";

/** `VirtualizerReactUtils.useRowWindow` over `virtual-core`: a thousand rows, only those on screen drawn. */
const STORY = "Abstracts/Virtualizer/Default";

const rows = "[data-row]";

test("only the rows on screen are drawn, plus the pinned one", async ({ mount }) => {
    const component = await mount(STORY);

    await expect(component.locator('[data-row="0"]')).toBeVisible();

    const count = await component.locator(rows).count();

    expect(count, "far fewer than a thousand").toBeLessThan(50);
    await expect(component.locator('[data-row="900"]'), "the pinned row is drawn wherever the scroll is").toHaveCount(
        1,
    );
});

test("scrolling brings the rows further down into the window", async ({ mount }) => {
    const component = await mount(STORY);

    await component.getByTestId("scroller").evaluate((element) => element.scrollTo({ top: 10_000 }));

    await expect(component.locator('[data-row="500"]')).toBeVisible();
    await expect(component.locator('[data-row="0"]'), "and lets the first ones go").toHaveCount(0);
});
