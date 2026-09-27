import { expect, test } from "@playwright/test";

/**
 * `SignalMirrorReactUtils`. The story's consumer clamps what it is given to 5, so a mirror handed 10 must come back
 * showing what the consumer accepted rather than what it was asked.
 */
const STORY = "Abstracts/SignalMirror/Default";

test("a mirror shows the value its consumer settled on, not the one it was asked for", async ({ mount }) => {
    const component = await mount(STORY);

    await component.getByTestId("ten").click();

    await expect(component.locator('[data-readout="outer"]')).toHaveText("5");
    await expect(component.locator('[data-readout="inner"]')).toHaveText("5");
});

test("optional state with no source is the hook's own", async ({ mount }) => {
    const component = await mount(STORY);

    await expect(component.locator('[data-readout="optional"]')).toHaveText("7");

    await component.getByTestId("optional").click();
    await expect(component.locator('[data-readout="optional"]')).toHaveText("8");
});
