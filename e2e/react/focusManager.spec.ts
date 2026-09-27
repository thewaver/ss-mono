import { expect, test } from "@playwright/test";

/** `FocusManagerReactUtils.useAutoFocus`: focus moved into a layer as it appears and back as it goes. */
const STORY = "Abstracts/FocusManager/Default";

test("focus moves to the chosen element when the layer opens, and back to the opener when it closes", async ({
    mount,
}) => {
    const component = await mount(STORY);

    await component.getByTestId("toggle").click();
    await expect(component.getByTestId("initial"), "the initial element rather than the first").toBeFocused();

    await component.getByTestId("close").click();
    await expect(component.getByTestId("toggle"), "focus returns where it came from").toBeFocused();
});
