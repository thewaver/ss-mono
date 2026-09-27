import { expect, test } from "@playwright/test";

/** `InteractionTrackerReactUtils`: flags, presses, drags, swipes and holds, each over the framework-free trackers. */
test("hover and a keyboard focus show in the flags, and a disabled control shows neither", async ({ page, mount }) => {
    const component = await mount("Abstracts/InteractionTracker/Flags");

    await component.getByTestId("control").hover();
    await expect(component.locator('[data-readout="hovered"]')).toHaveText("true");

    await page.mouse.move(0, 0);
    await page.keyboard.press("Tab");
    await expect(component.locator('[data-readout="focusVisible"]'), "a keyboard focus draws the ring").toHaveText(
        "true",
    );

    await component.update({ isDisabled: true });
    await component.getByTestId("control").hover({ force: true });
    await expect(component.locator('[data-readout="hovered"]'), "hover is cleared while disabled").toHaveText("false");
    await expect(component.getByTestId("control"), "and it leaves the tab order").toHaveAttribute("tabindex", "-1");
});

test("each press counts, by pointer and by keyboard", async ({ page, mount }) => {
    const component = await mount("Abstracts/InteractionTracker/Flags");

    await component.getByTestId("control").click();
    await component.getByTestId("control").focus();
    await page.keyboard.press("Enter");

    await expect(component.locator('[data-readout="activations"]')).toHaveText("2");
});

test("a drag reports the position across the element and ends on release, surviving a re-render on the way", async ({
    page,
    mount,
}) => {
    const component = await mount("Abstracts/InteractionTracker/Drag");
    const track = (await component.getByTestId("track").boundingBox())!;

    await page.mouse.move(track.x + track.width * 0.1, track.y + track.height * 0.5);
    await page.mouse.down();
    await expect(component.locator('[data-readout="dragging"]')).toHaveText("true");

    await component.getByTestId("rerender").dispatchEvent("click");
    await page.mouse.move(track.x + track.width * 0.8, track.y + track.height * 0.5, { steps: 4 });
    await expect(component.locator('[data-readout="ratio"]'), "the moves after the re-render still land").toHaveText(
        "0.8 0.5",
    );

    await page.mouse.up();
    await expect(component.locator('[data-readout="dragging"]')).toHaveText("false");
    await expect(component.locator('[data-readout="ended"]')).toHaveText("release");
});

test("a swipe past the commit ratio commits, and the click it ends with is swallowed", async ({ page, mount }) => {
    const component = await mount("Abstracts/InteractionTracker/Swipe");
    const card = (await component.getByTestId("card").boundingBox())!;

    await page.mouse.move(card.x + card.width * 0.2, card.y + card.height * 0.5);
    await page.mouse.down();
    await page.mouse.move(card.x + card.width * 0.8, card.y + card.height * 0.5, { steps: 6 });
    await page.mouse.up();

    await expect(component.locator('[data-readout="direction"]')).toHaveText("right");
    await expect(component.locator('[data-readout="clicks"]')).toHaveText("0");
});

test("hovering an element holds it, and leaving lets go", async ({ mount }) => {
    const component = await mount("Abstracts/InteractionTracker/Hold");

    await component.getByTestId("box").hover();
    await expect(component.locator('[data-readout="held"]')).toHaveText("true");

    await component.getByTestId("away").hover();
    await expect(component.locator('[data-readout="held"]')).toHaveText("false");
});
