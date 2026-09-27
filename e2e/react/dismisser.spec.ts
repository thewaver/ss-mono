import { expect, test } from "@playwright/test";

/** `DismisserReactUtils.useLayer`: a layer closed by Escape or a press outside it, and not by one inside. */
const STORY = "Abstracts/Dismisser/Default";

const reason = '[data-readout="reason"]';

test("Escape dismisses the open layer, and says so", async ({ page, mount }) => {
    const component = await mount(STORY);

    await component.getByTestId("open").click();
    await expect(component.getByTestId("layer")).toBeVisible();

    await page.keyboard.press("Escape");

    await expect(component.getByTestId("layer")).toHaveCount(0);
    await expect(component.locator(reason)).toHaveText("escape");
});

test("a press outside dismisses it, and a press inside does not", async ({ mount }) => {
    const component = await mount(STORY);

    await component.getByTestId("open").click();
    await component.getByTestId("layer").getByRole("button").click();
    await expect(component.getByTestId("layer"), "a press inside leaves it open").toBeVisible();

    await component.getByTestId("outside").click();

    await expect(component.getByTestId("layer")).toHaveCount(0);
    await expect(component.locator(reason)).toHaveText("press");
});
