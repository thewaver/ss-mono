import { expect, test } from "@playwright/test";

/** `PointerTrackerReactUtils.usePointerReading`: where the pointer is relative to an element, in shape terms. */
const STORY = "Abstracts/PointerTracker/Default";

test("the reading is 0 at the center, 1 on the edge and more outside, and the pointer is present", async ({
    page,
    mount,
}) => {
    const component = await mount(STORY);
    const box = (await component.getByTestId("box").boundingBox())!;

    await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5);
    await expect(component.locator('[data-readout="edgeRatio"]')).toHaveText("0.00");
    await expect(component.locator('[data-readout="present"]')).toHaveText("true");

    await page.mouse.move(box.x + box.width, box.y + box.height * 0.5);
    await expect(component.locator('[data-readout="edgeRatio"]')).toHaveText("1.00");

    await page.mouse.move(box.x + box.width * 1.5, box.y + box.height * 0.5);
    await expect(component.locator('[data-readout="edgeRatio"]')).toHaveText("2.00");
});
