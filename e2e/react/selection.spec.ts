import { expect, test } from "@playwright/test";

/** `SelectionReactUtils.useSelection`: plain, toggling and extending picks over a list the story owns. */
const STORY = "Abstracts/Selection/Default";

const selection = '[data-readout="selection"]';

test("a plain pick replaces the selection and becomes the anchor", async ({ mount }) => {
    const component = await mount(STORY);

    await component.getByTestId("b").click();
    await component.getByTestId("d").click();

    await expect(component.locator(selection)).toHaveText("d");
    await expect(component.locator('[data-readout="anchor"]')).toHaveText("d");
});

test("a shifted pick takes the whole run from the anchor", async ({ mount }) => {
    const component = await mount(STORY);

    await component.getByTestId("b").click();
    await component.getByTestId("d").click({ modifiers: ["Shift"] });

    await expect(component.locator(selection)).toHaveText("b,c,d");
});

test("a toggling pick adds without losing what was there, and takes it back off", async ({ mount }) => {
    const component = await mount(STORY);

    await component.getByTestId("a").click();
    await component.getByTestId("c").click({ modifiers: ["ControlOrMeta"] });
    await expect(component.locator(selection)).toHaveText("a,c");

    await component.getByTestId("a").click({ modifiers: ["ControlOrMeta"] });
    await expect(component.locator(selection)).toHaveText("c");
});
