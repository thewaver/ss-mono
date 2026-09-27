import { expect, test } from "@playwright/test";

/** `HoverIntentReactUtils.useHoverIntent`: a panel opened by resting on its anchor and kept open across the gap. */
const STORY = "Abstracts/HoverIntent/Default";

const shown = '[data-readout="shown"]';

test("resting on the anchor opens the panel after the delay, and moving onto the panel keeps it", async ({ mount }) => {
    const component = await mount(STORY);

    await component.getByTestId("anchor").hover();
    await expect(component.locator(shown), "not at once").toHaveText("false");
    await expect(component.locator(shown), "but once the delay has passed").toHaveText("true");

    await component.getByTestId("panel").hover();
    await expect(component.locator(shown), "crossing to the panel keeps it open").toHaveText("true");

    await component.getByTestId("away").hover();
    await expect(component.locator(shown), "and leaving both closes it").toHaveText("false");
});
