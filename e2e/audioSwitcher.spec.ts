import { type Page, expect, test } from "@playwright/test";

import { inputValue, prop, readout } from "./helpers";

/**
 * `AudioSwitcher` renders nothing and holds its two `Audio` elements in a variable rather than in the
 * document, so there is no element to query and no attribute to read. What it does is therefore observed
 * two ways: `play` and `pause` are recorded on the prototype before any application code runs, which is the
 * same trick `noAnimationFrames.spec.ts` uses on `requestAnimationFrame`, and the control the page paints
 * from `playbackSignal` says what the component believes about itself.
 *
 * That second reading is the one worth having. The signal used to be written only by the consumer, so a
 * switcher that started on its own left it saying stopped and the page painted "Play" over sound that was
 * already coming out. The button's caption is now downstream of the component, which is why these tests
 * read a caption at all rather than treating it as editorial.
 *
 * Playback is refused by browsers that have not seen a gesture, so every test that expects sound presses
 * something first. The one test that expects silence expects it whatever the policy: the assertion is that
 * `play` was never *attempted*, which is a fact about the component rather than about the browser.
 *
 * Asking for playback and getting it are two moments, not one. `play()` hands back a promise that settles
 * only once sound is actually coming out — or once the browser has refused — and the component waits on it
 * before it says it is playing. How long that takes is the machine's business: a quiet one starts in a few
 * milliseconds, a loaded one under a full parallel sweep can take most of a second. So the recorder also
 * notes when each `play()` settles, and a test that needs sound to have started waits on that rather than on
 * a clock. A fixed wait asked "did it start" and "was the machine quick" at once, and the second answered in
 * the same red as the first.
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

const FAST_CROSSFADE_MS = "250";

const mediaCalls = (page: Page) => page.evaluate(() => (window as unknown as { __mediaCalls: string[] }).__mediaCalls);

const playCalls = async (page: Page) => (await mediaCalls(page)).filter((call) => call.startsWith("play:"));

/**
 * Every `play()` that has had its answer, whichever answer it was. A test that is about to read what the
 * component believes waits for this first, since the component only settles its belief once the browser has
 * settled the attempt — and waiting for the answer rather than for a success keeps a refusal visible as a
 * refusal, rather than as a wait that ran out.
 */
const settledPlays = async (page: Page) =>
    (await mediaCalls(page)).filter((call) => call.startsWith("started:") || call.startsWith("refused:"));

const startedPlays = async (page: Page) => (await mediaCalls(page)).filter((call) => call.startsWith("started:"));

/**
 * Sound starts silent and fades up, so "it is playing" in the sense a listener means is the moment the fade
 * has reached the volume the page asked for — not the moment `play()` settled, when the element is still at
 * nothing. Both sides of the comparison are read, so the check is that the two agree rather than that either
 * is a particular number.
 */
const soundingVolume = (page: Page) =>
    page.evaluate(
        () =>
            [...(window as unknown as { __mediaElements: Set<HTMLMediaElement> }).__mediaElements].find(
                (element) => !element.paused,
            )?.volume,
    );

const askedVolume = async (page: Page) => Number(await inputValue(page.locator(`${prop("volume")} input`))) / 100;

/**
 * Only pauses that name a source count. An element torn down before it was ever handed one is paused with
 * an empty `src`, and the Playground builds its examples more than once on arrival, so a handful of those
 * arrive before anything has been pressed. They say nothing about the fade, which is what is under test.
 */
const pauseCalls = async (page: Page) =>
    (await mediaCalls(page)).filter((call) => call.startsWith("pause:") && call !== "pause:");

const playControl = (page: Page) => page.getByRole("button", { name: "Play", exact: true });

const stopControl = (page: Page) => page.getByRole("button", { name: "Stop", exact: true });

const startOverControl = (page: Page) => page.getByRole("button", { name: "Start over", exact: true });

/**
 * The caption is the whole of what a visitor can tell about playback, so it is read as one answer rather
 * than as two locators: whichever of the pair is on screen is what the component currently believes.
 */
const playbackCaption = async (page: Page) => ((await stopControl(page).count()) ? "Stop" : "Play");

const pickTrack = async (page: Page, name: string) => {
    await page.getByRole("combobox", { name: "Track" }).click();
    await page.getByRole("option", { name }).click();
};

test.beforeEach(async ({ page }) => {
    await page.addInitScript(recordMediaCalls);
    await page.goto("/audio-switcher");
    await expect(playControl(page)).toBeVisible();
    await page.locator(`${prop("crossfadeMs")} input`).fill(FAST_CROSSFADE_MS);
    await page.locator(`${prop("crossfadeMs")} input`).blur();
});

test("a source that arrives at mount is not played, and is not even attempted", async ({ page }) => {
    expect(await playCalls(page), "nothing is asked to play before anybody has asked for anything").toEqual([]);
    expect(await playbackCaption(page), "so the control offers to start it").toBe("Play");
    expect(await readout(page, "default")).toContain("stopped");
});

test("pressing play starts it, and the caption follows the component rather than the press", async ({ page }) => {
    await playControl(page).click();
    await expect.poll(() => settledPlays(page), "the browser has answered the request to play").toHaveLength(1);

    expect(await playCalls(page), "the first source is what plays").toHaveLength(1);
    expect((await playCalls(page))[0]).toContain("lofi");
    expect(await playbackCaption(page), "and the control now offers to stop it").toBe("Stop");
    expect(await readout(page, "default")).toContain("playing");
});

/**
 * The rule the component keeps: being handed a source means "play this". Only the source that arrives at
 * mount is exempt, so a switch made while nothing is playing starts sound without a second instruction —
 * and the caption has to notice, since nobody pressed play.
 */
test("changing the source plays what arrived, without being asked twice", async ({ page }) => {
    await pickTrack(page, "Synthwave");
    await expect.poll(() => settledPlays(page), "the browser has answered the request to play").toHaveLength(1);

    const calls = await playCalls(page);

    expect(calls, "one source change, one play").toHaveLength(1);
    expect(calls[0], "and it is the source that arrived").toContain("synthwave");
    expect(await playbackCaption(page), "the caption notices a start nobody pressed for").toBe("Stop");
});

test("stopping fades it out and pauses it, rather than cutting", async ({ page }) => {
    await playControl(page).click();
    await expect.poll(() => startedPlays(page), "sound is coming out").toHaveLength(1);
    await expect.poll(() => soundingVolume(page), "and has faded all the way in").toBe(await askedVolume(page));

    expect(await pauseCalls(page), "nothing is paused while it is playing").toEqual([]);

    await stopControl(page).click();

    await expect
        .poll(() => pauseCalls(page), "the pause lands at the end of the fade, not at the press")
        .toHaveLength(1);
    expect(await playbackCaption(page)).toBe("Play");
});

test("starting over is offered only while something is playing", async ({ page }) => {
    await expect(startOverControl(page), "there is nothing to restart yet").toHaveAttribute("aria-disabled", "true");

    await playControl(page).click();
    await expect.poll(() => startedPlays(page), "sound is coming out").toHaveLength(1);

    await expect(startOverControl(page)).not.toHaveAttribute("aria-disabled", "true");

    await stopControl(page).click();

    await expect(startOverControl(page), "and nothing to restart once more").toHaveAttribute("aria-disabled", "true");
});

/**
 * A stop that arrives while the sound is still starting has to win. The browser can take a while to begin
 * playback, and a visitor who presses Play and changes their mind at once has already said "stop" by the time
 * the start comes through. The component used to hear the start and set itself playing again, so the caption
 * flipped back to Stop over a sound nobody wanted. Playback is made slow on purpose here, by holding every
 * `play()` back before it reaches the browser, so the stop lands squarely inside the start.
 */
const slowPlayback = `
    const play = HTMLMediaElement.prototype.play;

    HTMLMediaElement.prototype.play = function (...args) {
        return new Promise((resolve) => setTimeout(resolve, 800)).then(() => play.apply(this, args));
    };
`;

test("a stop pressed while the sound is still starting wins over the start", async ({ page }) => {
    await page.addInitScript(slowPlayback);
    await page.reload();
    await expect(playControl(page)).toBeVisible();

    await playControl(page).click();
    await stopControl(page).click();

    await expect.poll(() => startedPlays(page), "the start came through after the stop").toHaveLength(1);
    await expect
        .poll(() => pauseCalls(page), "and the component answered it by pausing, not by playing")
        .toHaveLength(1);
    expect(await playbackCaption(page), "so the control still offers to start it").toBe("Play");
    expect(await readout(page, "default")).toContain("stopped");
});
