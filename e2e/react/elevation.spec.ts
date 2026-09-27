import { expect, test } from "@playwright/test";

/** `ElevationReactUtils`: a registered layer raising what is inside it, and dropping back when it goes. */
const STORY = "Abstracts/Elevation/Default";

test("an element inside an active layer has that layer's index to clear, and none once it is inactive", async ({
    mount,
}) => {
    const component = await mount(STORY);

    await expect(component.locator('[data-readout="base"]')).toHaveText("100");

    await component.getByRole("button").click();

    await expect(component.locator('[data-readout="base"]')).toHaveText("0");
});
