import { expect, test } from "@playwright/test";

/** `TextSyncReactUtils.useValueSync`: an input written by the hook rather than by React, through a mask. */
const STORY = "Abstracts/TextSync/Default";

const field = '[data-testid="field"]';

test("typing goes through the mask, and the value follows", async ({ mount }) => {
    const component = await mount(STORY);

    await component.locator(field).pressSequentially("1234");

    await expect(component.locator(field)).toHaveValue("12/34");
    await expect(component.locator('[data-readout="value"]')).toHaveText("12/34");
});

test("a value set from outside is written into the input", async ({ mount }) => {
    const component = await mount(STORY);

    await component.getByRole("button").click();

    await expect(component.locator(field)).toHaveValue("98/76");
});

test("deleting a separator removes the digit before it, keeping the caret with it", async ({ page, mount }) => {
    const component = await mount(STORY);

    await component.locator(field).pressSequentially("1234");
    await component.locator(field).evaluate((element: HTMLInputElement) => element.setSelectionRange(3, 3));
    await page.keyboard.press("Backspace");

    await expect(component.locator(field)).toHaveValue("13/4");
    expect(await component.locator(field).evaluate((element: HTMLInputElement) => element.selectionStart)).toBe(1);
});
