import { expect, test } from "@playwright/test";

/**
 * `NavigatorReactUtils.useDirection` over the framework-free watcher, mounted on the React gallery rather than the
 * Playground. The gallery renders every story under `StrictMode`, so each effect has already been started, torn
 * down and started again by the time a test looks — a watcher that did not survive that would read `ltr` forever.
 */
const STORY = "Abstracts/Navigator/Default";

const direction = '[data-readout="direction"]';

test("reads left to right when nothing says otherwise", async ({ mount }) => {
    const component = await mount(STORY);

    await expect(component.locator(direction)).toHaveText("ltr");
});

test("reads right to left under an ancestor that says so", async ({ mount }) => {
    const component = await mount(STORY, { dir: "rtl" });

    await expect(component.locator(direction)).toHaveText("rtl");
});

test("follows a dir change React made after mount", async ({ mount }) => {
    const component = await mount(STORY);

    await expect(component.locator(direction)).toHaveText("ltr");

    await component.update({ dir: "rtl" });
    await expect(component.locator(direction), "the new attribute is seen").toHaveText("rtl");

    await component.update({ dir: "ltr" });
    await expect(component.locator(direction), "and so is its reversal").toHaveText("ltr");
});

test("follows a dir change made outside React entirely", async ({ page, mount }) => {
    const component = await mount(STORY);

    await expect(component.locator(direction)).toHaveText("ltr");

    await page.evaluate(() => document.documentElement.setAttribute("dir", "rtl"));
    await expect(component.locator(direction), "a dir on the document root reaches the element").toHaveText("rtl");

    await page.evaluate(() => document.documentElement.removeAttribute("dir"));
    await expect(component.locator(direction), "and taking it away is seen too").toHaveText("ltr");
});
