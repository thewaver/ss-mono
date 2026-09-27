import { expect, test } from "@playwright/test";

/** `MediaQueryMonitorReactUtils`: a media query and the reduced-motion preference as state. */
const STORY = "Abstracts/MediaQueryMonitor/Default";

test("follows a width query as the window is resized", async ({ page, mount }) => {
    const component = await mount(STORY);

    await expect(component.locator('[data-readout="wide"]')).toHaveText("true");

    await page.setViewportSize({ width: 600, height: 600 });
    await expect(component.locator('[data-readout="wide"]'), "narrower than the query").toHaveText("false");
});

test("follows the reduced-motion preference", async ({ page, mount }) => {
    const component = await mount(STORY);

    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(component.locator('[data-readout="reduced"]')).toHaveText("true");

    await page.emulateMedia({ reducedMotion: "no-preference" });
    await expect(component.locator('[data-readout="reduced"]')).toHaveText("false");
});

test("a disabled query reads false whatever the window says", async ({ mount }) => {
    const component = await mount(STORY, { isDisabled: true });

    await expect(component.locator('[data-readout="wide"]')).toHaveText("false");
});
