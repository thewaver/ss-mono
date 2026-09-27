import { type Page, expect, test } from "@playwright/test";

/**
 * The React `AudioSwitcher`. The cases follow `e2e/audioSwitcher.spec.ts`, which covers the Solid one, and observe
 * it the same way: the switcher renders nothing and keeps its two `Audio` elements out of the document, so `play`
 * and `pause` are recorded on the prototype before the story loads, and the story's Play/Stop caption reads the
 * playback state the switcher writes back.
 *
 * Asking for playback and getting it are two moments, so a test that needs sound to have started waits for the
 * recorder to see `play()` settle rather than for a clock.
 */
const recordMediaCalls = `
    window.__mediaCalls = [];
    window.__mediaElements = new Set();

    const play = HTMLMediaElement.prototype.play;
    const pause = HTMLMediaElement.prototype.pause;

    HTMLMediaElement.prototype.play = function (...args) {
        const name = (this.src || "").split("/").pop();

        window.__mediaCalls.push("play:" + name);
        window.__mediaElements.add(this);

        const attempt = play.apply(this, args);

        attempt.then(
            () => window.__mediaCalls.push("started:" + name),
            () => window.__mediaCalls.push("refused:" + name),
        );

        return attempt;
    };

    HTMLMediaElement.prototype.pause = function (...args) {
        window.__mediaCalls.push("pause:" + (this.src || "").split("/").pop());

        return pause.apply(this, args);
    };
`;

/** Holds every `play()` back before it reaches the browser, so a stop can land squarely inside a start. */
const slowPlayback = `
    const slowPlay = HTMLMediaElement.prototype.play;

    HTMLMediaElement.prototype.play = function (...args) {
        return new Promise((resolve) => setTimeout(resolve, 800)).then(() => slowPlay.apply(this, args));
    };
`;

const STORY = "Essentials/AudioSwitcher/Default";

const mediaCalls = (page: Page) => page.evaluate(() => (window as unknown as { __mediaCalls: string[] }).__mediaCalls);

const playCalls = async (page: Page) => (await mediaCalls(page)).filter((call) => call.startsWith("play:"));

const settledPlays = async (page: Page) =>
    (await mediaCalls(page)).filter((call) => call.startsWith("started:") || call.startsWith("refused:"));

const startedPlays = async (page: Page) => (await mediaCalls(page)).filter((call) => call.startsWith("started:"));

/** Only pauses that name a source count; an element emptied on teardown is paused with an empty `src`. */
const pauseCalls = async (page: Page) =>
    (await mediaCalls(page)).filter((call) => call.startsWith("pause:") && call !== "pause:");

const soundingVolume = (page: Page) =>
    page.evaluate(
        () =>
            [...(window as unknown as { __mediaElements: Set<HTMLMediaElement> }).__mediaElements].find(
                (element) => !element.paused,
            )?.volume,
    );

const playControl = (page: Page) => page.getByRole("button", { name: "Play", exact: true });

const stopControl = (page: Page) => page.getByRole("button", { name: "Stop", exact: true });

const startOverControl = (page: Page) => page.getByRole("button", { name: "Start over", exact: true });

const playbackCaption = async (page: Page) => ((await stopControl(page).count()) ? "Stop" : "Play");

const playbackReadout = async (page: Page) =>
    ((await page.locator('[data-readout="playback"]').textContent()) ?? "").trim();

test.beforeEach(async ({ page }) => {
    await page.addInitScript(recordMediaCalls);
});

test("a source that arrives at mount is not played, and is not even attempted", async ({ page, mount }) => {
    await mount(STORY);
    await expect(playControl(page)).toBeVisible();

    expect(await playCalls(page), "nothing is asked to play before anybody has asked for anything").toEqual([]);
    expect(await playbackCaption(page), "so the control offers to start it").toBe("Play");
    expect(await playbackReadout(page)).toContain("stopped");
});

test("pressing play starts it, and the caption follows the component rather than the press", async ({
    page,
    mount,
}) => {
    await mount(STORY);
    await playControl(page).click();
    await expect.poll(() => settledPlays(page), "the browser has answered the request to play").toHaveLength(1);

    expect(await playCalls(page), "the first source is what plays").toHaveLength(1);
    expect((await playCalls(page))[0]).toContain("lofi");
    await expect(stopControl(page), "and the control now offers to stop it").toBeVisible();
    expect(await playbackReadout(page)).toContain("playing");
});

test("changing the source plays what arrived, without being asked twice", async ({ page, mount }) => {
    await mount(STORY);
    await page.getByRole("combobox", { name: "Track" }).selectOption("Synthwave");
    await expect.poll(() => settledPlays(page), "the browser has answered the request to play").toHaveLength(1);

    const calls = await playCalls(page);

    expect(calls, "one source change, one play").toHaveLength(1);
    expect(calls[0], "and it is the source that arrived").toContain("synthwave");
    await expect(stopControl(page), "the caption notices a start nobody pressed for").toBeVisible();
});

test("the controller's subscription hears playback start and stop", async ({ page, mount }) => {
    await mount(STORY);
    await expect(page.locator('[data-readout="notifications"]')).toHaveText("0");

    await playControl(page).click();
    await expect(page.locator('[data-readout="notifications"]'), "one change: it started").toHaveText("1");

    await stopControl(page).click();
    await expect(page.locator('[data-readout="notifications"]'), "and another: it stopped").toHaveText("2");
});

test("stopping fades it out and pauses it, rather than cutting", async ({ page, mount }) => {
    await mount(STORY);
    await playControl(page).click();
    await expect.poll(() => startedPlays(page), "sound is coming out").toHaveLength(1);

    const askedVolume = Number(await page.getByTestId("volume").textContent());

    await expect.poll(() => soundingVolume(page), "and has faded all the way in").toBe(askedVolume);

    expect(await pauseCalls(page), "nothing is paused while it is playing").toEqual([]);

    await stopControl(page).click();

    await expect
        .poll(() => pauseCalls(page), "the pause lands at the end of the fade, not at the press")
        .toHaveLength(1);
    expect(await playbackCaption(page)).toBe("Play");
});

test("starting over is offered only while something is playing", async ({ page, mount }) => {
    await mount(STORY);
    await expect(startOverControl(page), "there is nothing to restart yet").toHaveAttribute("aria-disabled", "true");

    await playControl(page).click();
    await expect.poll(() => startedPlays(page), "sound is coming out").toHaveLength(1);

    await expect(startOverControl(page)).not.toHaveAttribute("aria-disabled", "true");

    await stopControl(page).click();

    await expect(startOverControl(page), "and nothing to restart once more").toHaveAttribute("aria-disabled", "true");
});

test("a stop pressed while the sound is still starting wins over the start", async ({ page, mount }) => {
    await page.addInitScript(slowPlayback);
    await mount(STORY);
    await expect(playControl(page)).toBeVisible();

    await playControl(page).click();
    await stopControl(page).click();

    await expect.poll(() => startedPlays(page), "the start came through after the stop").toHaveLength(1);
    await expect
        .poll(() => pauseCalls(page), "and the component answered it by pausing, not by playing")
        .toHaveLength(1);
    expect(await playbackCaption(page), "so the control still offers to start it").toBe("Play");
    expect(await playbackReadout(page)).toContain("stopped");
});
