import { expect, test } from "@playwright/test";

/** `DateTimeValueReactUtils.useSplit`: a date and a time held apart until both are there. */
const STORY = "Abstracts/DateTimeValue/Default";

test("a time on its own leaves the whole value empty, and the date completes it", async ({ mount }) => {
    const component = await mount(STORY);

    await component.getByTestId("time").click();
    await expect(component.locator('[data-readout="whole"]')).toHaveText("none");
    await expect(component.locator('[data-readout="halves"]'), "the time is held all the same").toHaveText("- time");

    await component.getByTestId("date").click();
    await expect(component.locator('[data-readout="whole"]')).toHaveText("2026-03-01 9:30");
});

test("clearing the whole value from outside clears both halves", async ({ mount }) => {
    const component = await mount(STORY);

    await component.getByTestId("time").click();
    await component.getByTestId("date").click();
    await component.getByTestId("clear").click();

    await expect(component.locator('[data-readout="halves"]')).toHaveText("- -");
});
