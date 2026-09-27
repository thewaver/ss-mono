import { expect, test } from "@playwright/test";

/** `MaskedFieldReactUtils.useMaskedField`: a time field whose value is committed only from a complete entry. */
const STORY = "Abstracts/MaskedField/Default";

const field = '[data-testid="field"]';

test("a half-typed entry commits nothing and is only called wrong once the field is left", async ({ page, mount }) => {
    const component = await mount(STORY);

    await component.locator(field).pressSequentially("12");
    await expect(component.locator('[data-readout="value"]')).toHaveText("none");
    await expect(component.locator('[data-readout="issue"]'), "not while still typing").toHaveText("false");

    await page.keyboard.press("Tab");
    await expect(component.locator('[data-readout="issue"]'), "but once the field is left").toHaveText("true");
});

test("a complete entry commits its value", async ({ mount }) => {
    const component = await mount(STORY);

    await component.locator(field).pressSequentially("1234");

    await expect(component.locator(field)).toHaveValue("12:34");
    await expect(component.locator('[data-readout="value"]')).toHaveText("12:34");
});

test("digits no value could start with are wrong at once", async ({ mount }) => {
    const component = await mount(STORY);

    await component.locator(field).pressSequentially("9");

    await expect(component.locator('[data-readout="issue"]')).toHaveText("true");
});

test("a value set from outside rewrites the text", async ({ mount }) => {
    const component = await mount(STORY);

    await component.getByTestId("set").click();

    await expect(component.locator(field)).toHaveValue("09:15");
});
