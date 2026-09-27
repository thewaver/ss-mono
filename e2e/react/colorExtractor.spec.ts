import { expect, test } from "@playwright/test";

/** `useColorExtractor`: the dominant color of a solid crimson image the gallery serves. */
test("reads the dominant color out of an image", async ({ mount }) => {
    const component = await mount("Abstracts/ColorExtractor/Default");

    await expect(component.locator('[data-readout="colors"]')).toHaveText("#dc143c");
    await expect(component.locator('[data-readout="error"]')).toHaveText("none");
});
