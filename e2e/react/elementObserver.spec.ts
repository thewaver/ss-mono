import { expect, test } from "@playwright/test";

/** `ElementObserverReactUtils`: sizes, progress through a scroller and intersection, kept current as state. */
test("a border-box size is reported on mount and again when the element resizes", async ({ mount }) => {
    const component = await mount("Abstracts/ElementObserver/Size");

    await expect(component.locator('[data-readout="size"]'), "padding and border included").toHaveText("120x60");

    await component.getByRole("button").click();

    await expect(component.locator('[data-readout="size"]')).toHaveText("180x60");
});

test("progress through a scroller follows its scroll, and intersection follows the element leaving", async ({
    mount,
}) => {
    const component = await mount("Abstracts/ElementObserver/Progress");
    const progress = component.locator('[data-readout="progress"]');

    await expect(progress, "the item starts at the scroller's bottom edge").toHaveText("0.00");

    await component.getByTestId("container").evaluate((element) => element.scrollTo({ top: 125 }));
    await expect(progress, "halfway across once scrolled halfway").toHaveText("0.50");

    await component.getByTestId("container").evaluate((element) => element.scrollTo({ top: 400 }));
    await expect(progress, "and done once it has left through the top").toHaveText("1.00");
    await expect(component.locator('[data-readout="intersecting"]'), "at which point it is off screen").toHaveText(
        "false",
    );
});
