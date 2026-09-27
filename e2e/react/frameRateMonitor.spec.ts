import { expect, test } from "@playwright/test";

/** `FrameRateMonitorReactUtils.useFrameRate`: a rate appears once the first sample completes. */
test("reports a rate once the first second of frames has been counted", async ({ mount }) => {
    const component = await mount("Abstracts/FrameRateMonitor/Default");

    await expect(component.locator('[data-readout="current"]')).toHaveText("zero");
    await expect(component.locator('[data-readout="current"]')).toHaveText("counting");
});
