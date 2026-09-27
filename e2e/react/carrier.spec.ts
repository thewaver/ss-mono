import { expect, test } from "@playwright/test";

/**
 * `CarrierReactUtils`: two zones registered with `useZone`, the carry read with `useCarry`, and the keyboard route
 * driven through `CarrierUtils` directly — pick up, aim at the next zone, drop.
 */
const STORY = "Abstracts/Carrier/Default";

test("an item carried to the other zone by the keyboard route moves there", async ({ mount }) => {
    const component = await mount(STORY);

    await component.getByTestId("pick").click();
    await expect(component.locator('[data-readout="carrying"]')).toHaveText("one");
    await expect(component.locator('[data-readout="target"]'), "aimed at its own zone to begin with").toHaveText(
        "left",
    );

    await component.getByTestId("next").click();
    await expect(component.locator('[data-readout="target"]')).toHaveText("right");
    await expect(component.locator('[data-readout="allowed"]')).toHaveText("true");

    await component.getByTestId("drop").click();
    await expect(component.locator('[data-readout="carrying"]')).toHaveText("nothing");
    await expect(component.getByTestId("left")).toHaveText("two");
    await expect(component.getByTestId("right")).toHaveText("one");
});
