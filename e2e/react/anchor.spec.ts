import { expect, test } from "@playwright/test";

/**
 * `AnchorReactUtils.usePortalPosition`. The anchor sits against the right edge of the window and asks for its popup
 * to open to the right, where there is no room, so the popup has to flip to the left side and stay on screen.
 */
const STORY = "Abstracts/Anchor/Default";

test("content asked to open where it does not fit takes the mirrored placement and stays on screen", async ({
    page,
    mount,
}) => {
    const component = await mount(STORY);

    await component.getByTestId("anchor").click();

    await expect(component.locator('[data-readout="positioned"]')).toHaveText("true");
    await expect(component.locator('[data-readout="placement"]')).toHaveText("left-out top-in");

    const popup = (await component.getByTestId("popup").boundingBox())!;
    const anchor = (await component.getByTestId("anchor").boundingBox())!;
    const viewport = page.viewportSize()!;

    expect(popup.x + popup.width, "the popup ends at the anchor's left edge").toBeCloseTo(anchor.x, 0);
    expect(popup.x + popup.width, "and inside the window").toBeLessThanOrEqual(viewport.width);
    expect(Number(await component.locator('[data-readout="zIndex"]').textContent())).toBeGreaterThanOrEqual(1);
});
