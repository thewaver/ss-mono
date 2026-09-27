import { expect, test } from "@playwright/test";

/** `RotatorReactUtils.useRotator`: a four-step wheel that spins to step 2, and turns to a step set from outside. */
const STORY = "Abstracts/Rotator/Default";

test("a spin runs, lands on its target, reports it and writes the target index", async ({ mount }) => {
    const component = await mount(STORY);

    await component.getByTestId("spin").click();
    await expect(component.locator('[data-readout="phase"]')).toHaveText("spinning");

    await expect(component.locator('[data-readout="landed"]')).toHaveText("2");
    await expect(component.locator('[data-readout="phase"]')).toHaveText("still");
    await expect(component.locator('[data-readout="current"]')).toHaveText("2");
    await expect(component.locator('[data-readout="target"]')).toHaveText("2");
});

test("a target index set from outside turns the wheel there", async ({ mount }) => {
    const component = await mount(STORY);

    await component.getByTestId("toOne").click();

    await expect(component.locator('[data-readout="current"]')).toHaveText("1");
    await expect(component.locator('[data-readout="phase"]')).toHaveText("still");
});

test("with a drift delay the wheel idles on its own", async ({ mount }) => {
    const component = await mount(STORY, { idleDelayMs: 200 });

    await expect(component.locator('[data-readout="phase"]')).toHaveText("idling");
    await expect(component.locator('[data-readout="current"]'), "and moves off its starting step").not.toHaveText("0");
});
