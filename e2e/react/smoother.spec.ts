import { expect, test } from "@playwright/test";

/** `SmootherReactUtils.useSmoothed`: a value trailing its target on animation frames. */
const STORY = "Abstracts/Smoother/Default";

const value = '[data-readout="value"]';

test("a value eases towards a new target rather than jumping, and lands on it", async ({ mount }) => {
    const component = await mount(STORY, { smoothingMs: 300 });

    await component.getByRole("button").click();

    const midway = Number(await component.locator(value).textContent());

    expect(midway, "partway there shortly after the change").toBeLessThan(100);

    await expect(component.locator(value), "and settled on the target in the end").toHaveText("100.00");
});

test("with no smoothing the value is put on its target at once", async ({ mount }) => {
    const component = await mount(STORY, { smoothingMs: 0 });

    await component.getByRole("button").click();

    await expect(component.locator(value)).toHaveText("100.00");
});
