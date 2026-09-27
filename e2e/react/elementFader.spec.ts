import { expect, test } from "@playwright/test";

/**
 * `ElementFaderReactUtils.useFader` over the framework-free fader, on the React gallery. The story mounts a layer
 * while the fader says it is visible and drives its opacity from the transition target, which is exactly what a
 * popup does with it. Every story runs under `StrictMode`, so the fade must also survive having its effects
 * started, torn down and started again on the way in.
 */
const STORY = "Abstracts/ElementFader/Default";

const readout = (name: string) => `[data-readout="${name}"]`;
const LAYER = '[data-testid="layer"]';

test("opening mounts the layer, then moves it to fully shown and settles", async ({ mount }) => {
    const component = await mount(STORY);

    await expect(component.locator(LAYER), "nothing is mounted while closed").toHaveCount(0);

    await component.getByRole("button").click();

    await expect(component.locator(LAYER)).toBeVisible();
    await expect(component.locator(readout("transitionTarget")), "the target is committed").toHaveText("1");
    await expect(component.locator(readout("hasTransitionFinished")), "and the fade in settles").toHaveText("true");
    await expect(component.locator(LAYER)).toHaveCSS("opacity", "1");
});

test("closing keeps the layer mounted while it fades out, then removes it", async ({ mount }) => {
    const component = await mount(STORY, { transitionDurationMs: 600 });

    await component.getByRole("button").click();
    await expect(component.locator(readout("transitionTarget"))).toHaveText("1");
    await expect(component.locator(readout("hasTransitionFinished"))).toHaveText("true");

    await component.getByRole("button").click();

    await expect(component.locator(readout("transitionTarget")), "the target heads for hidden").toHaveText("0");
    await expect(component.locator(LAYER), "while the layer is still there to animate").toHaveCount(1);
    await expect(component.locator(readout("isVisible"))).toHaveText("true");

    await expect(component.locator(LAYER), "and once the fade is over it goes").toHaveCount(0);
    await expect(component.locator(readout("isVisible"))).toHaveText("false");
});

/**
 * The fader looks for the layer's running transition once React has applied the new opacity. When it finds one it
 * waits on it, with a grace period beyond the stated duration; when it finds none it trusts the stated duration
 * alone. Stating a duration of nothing against a CSS transition of a second separates the two: seen, the fade
 * settles no sooner than the grace allows; missed, it settles almost at once.
 */
test("the fade waits on the transition React started, not only on the stated duration", async ({ mount }) => {
    const component = await mount(STORY, { transitionDurationMs: 0, cssDurationMs: 1000 });

    await component.getByRole("button").click();
    await expect(component.locator(readout("transitionTarget"))).toHaveText("1");
    await expect(component.locator(readout("hasTransitionFinished"))).toHaveText("true");

    const committedAt = Number(await component.locator(readout("transitionTarget")).getAttribute("data-at"));
    const finishedAt = Number(await component.locator(readout("hasTransitionFinished")).getAttribute("data-at"));

    expect(finishedAt - committedAt, "the running transition held the fade open").toBeGreaterThan(50);
});
