import { type Page, expect, test } from "@playwright/test";

import { computedStyle, docsDemo, docsSettled, inlineStyle, inputValue, prop } from "./helpers";

const DOCS = "/src/App/Pages/ImageSwitcherPage/Docs";

const BASIC = docsDemo(DOCS, "Basic");
const IMAGES = `${BASIC} img`;
const PROFILE = "knight_profile";
const DATE = "knight_date";
const MISSING = "missing_image.webp";

const OPTION = '[role="listbox"] [role="option"]';

const PRELOAD_DELAY_MS = 1500;

/**
 * Only the crossfade itself needs pixels. Everything this component decides is in the DOM, because the two
 * `<img>` elements carry the swap between them: which one holds the current source, which one is fading
 * out, and — the part that matters — that neither changes until the incoming image has finished loading
 * somewhere the user cannot see.
 */
const chooseSource = async (page: Page, name: string) => {
    await page.locator(`${prop("sourceType")} [role="combobox"]`).click();
    await page.locator(OPTION, { hasText: name }).first().click();
};

const sources = (page: Page) =>
    page
        .locator(IMAGES)
        .evaluateAll((images) => images.map((image) => (image as HTMLImageElement).getAttribute("src")));

/** Each element's source, its text, and whether it is hidden from a screen reader, read together. */
const layers = (page: Page) =>
    page.locator(IMAGES).evaluateAll((images) =>
        images.map((image) => ({
            src: image.getAttribute("src"),
            alt: image.getAttribute("alt"),
            isHidden: image.getAttribute("aria-hidden") === "true",
        })),
    );

const loadReadout = async (page: Page) => ((await page.locator(`${BASIC} [data-readout]`).textContent()) ?? "").trim();

/** How many loads the example's `onLoad` has counted, read off its readout. */
const loadCount = async (page: Page) => Number(/(\d+)/.exec(await loadReadout(page))?.[1] ?? Number.NaN);

/**
 * Whether the starting picture has begun to leave. Clearing leaves the pair holding the same sources as before — the
 * old picture on one element and nothing on the other — so the swap shows only in which element is the one shown.
 */
const isStartGoing = (page: Page) => async () =>
    (await layers(page)).some((layer) => layer.src?.includes(PROFILE) && layer.isHidden);

/** Resolves once the switcher has said it could not preload a source, which is when it has finished deciding. */
const preloadFailure = (page: Page) =>
    page.waitForEvent(
        "console",
        (message) => message.type() === "warning" && message.text().includes("failed to preload"),
    );

/**
 * Readiness is "the starting image has landed on one of the two elements", not visibility: the element
 * with nothing to show is deliberately `visibility: hidden`, and which of the pair that is depends on how
 * many swaps have happened — so waiting for the first one to be visible waits forever on a fresh page.
 */
test.beforeEach(async ({ page }) => {
    await page.goto("/image-switcher/docs");

    await expect(page.locator(IMAGES)).toHaveCount(2);
    await expect.poll(async () => (await sources(page)).filter((src) => src?.includes(PROFILE)).length).toBe(1);
    await docsSettled(page);
});

test("both elements stay mounted, and the outgoing one keeps its image while it fades", async ({ page }) => {
    await expect(page.locator(IMAGES), "the pair is the mechanism, so it is always both").toHaveCount(2);

    const before = await sources(page);

    expect(
        before.filter((src) => src?.includes(PROFILE)),
        "one of them holds the starting image",
    ).toHaveLength(1);

    await chooseSource(page, "date");
    await expect
        .poll(async () => (await sources(page)).filter((src) => src?.includes(DATE)).length, {
            message: "the new image lands on the other element",
        })
        .toBe(1);

    const after = await sources(page);

    expect(after, "the pair is still both elements — nothing was torn out").toHaveLength(2);
    expect(
        after.filter((src) => src?.includes(PROFILE)),
        "and the outgoing element keeps the old image rather than being emptied",
    ).toHaveLength(1);

    const opacities = await Promise.all([
        inlineStyle(page.locator(IMAGES).first(), "opacity"),
        inlineStyle(page.locator(IMAGES).last(), "opacity"),
    ]);

    expect(opacities.sort(), "one is on and one is off, which is the crossfade").toEqual(["0", "1"]);
});

/**
 * The text travels with its picture: the element on screen is read with its own words, and the one fading out is
 * hidden from a screen reader from the moment it starts to go, so the picture is announced once.
 */
test("each picture is read with its own text, and only the one on screen is read", async ({ page }) => {
    const start = (await layers(page)).find((layer) => !layer.isHidden)!;

    expect(start.src, "the element read out is the one holding the starting image").toContain(PROFILE);
    expect(start.alt, "and it has words of its own").toBeTruthy();

    await chooseSource(page, "date");
    await expect.poll(async () => (await sources(page)).some((src) => src?.includes(DATE))).toBe(true);

    const after = await layers(page);
    const shown = after.filter((layer) => !layer.isHidden);
    const outgoing = after.find((layer) => layer.src?.includes(PROFILE))!;

    expect(shown, "one element is read").toHaveLength(1);
    expect(shown[0].src, "the incoming one").toContain(DATE);
    expect(shown[0].alt, "with words of its own, not the old picture's").not.toBe(start.alt);
    expect(outgoing.isHidden, "while the outgoing one is hidden as it fades").toBe(true);
    expect(outgoing.alt, "keeping its own words rather than borrowing the new ones").toBe(start.alt);
});

test("a new source is preloaded before either element changes", async ({ page }) => {
    await page.route(`**/*${DATE}*`, async (route) => {
        await new Promise((resolve) => setTimeout(resolve, PRELOAD_DELAY_MS));
        await route.continue();
    });

    const before = await sources(page);

    await chooseSource(page, "date");

    expect(
        await sources(page),
        "while the request is in flight both elements still hold what they held — the preload is off-screen",
    ).toEqual(before);

    await expect
        .poll(async () => (await sources(page)).filter((src) => src?.includes(DATE)).length, {
            message: "and the swap happens only once the image has loaded",
            timeout: PRELOAD_DELAY_MS * 3,
        })
        .toBe(1);
});

/**
 * The user's call: a picture that cannot load is never swapped in, so the reader keeps looking at the last picture
 * that did, read with that picture's own words, and the consumer hears about it.
 */
test("a source that fails to load keeps the old picture and its text, and says so", async ({ page }) => {
    const before = await layers(page);
    const failed = preloadFailure(page);

    await chooseSource(page, "missing_file");
    await failed;

    expect(await layers(page), "neither element changed: the old picture and its words stay").toEqual(before);
    expect(
        (await sources(page)).some((src) => src?.includes(MISSING)),
        "the broken source never reached either element",
    ).toBe(false);
});

test("clearing the source swaps immediately and hides the element that has nothing to show", async ({ page }) => {
    await chooseSource(page, "none");

    await expect
        .poll(isStartGoing(page), {
            message: "there is nothing to preload, so the swap does not wait for a load that will never come",
        })
        .toBe(true);
    expect(
        (await sources(page)).filter((src) => src?.includes(PROFILE)),
        "while the outgoing element keeps the old image to fade out",
    ).toHaveLength(1);

    const visibilities = await Promise.all([
        computedStyle(page.locator(IMAGES).first(), "visibility"),
        computedStyle(page.locator(IMAGES).last(), "visibility"),
    ]);

    expect(
        visibilities.filter((value) => value === "hidden"),
        "the element with no image is hidden rather than drawing a broken one",
    ).toHaveLength(1);
});

/**
 * `onLoad` is invisible to a suite unless the page shows what it consumed, so the example counts loads in a
 * readout. What it reports is the **preloader's** load rather than either visible element's, which is why the
 * count can be checked against the source that was chosen rather than against what is on screen.
 */
test("each source that actually loads is reported once, and names itself", async ({ page }) => {
    await expect.poll(() => loadCount(page), { message: "the starting image is a load like any other" }).toBe(1);
    expect(await loadReadout(page), "and the consumer is told which one landed").toContain(PROFILE);

    await chooseSource(page, "date");

    await expect.poll(() => loadCount(page), { message: "a second source is a second load" }).toBe(2);
    expect(await loadReadout(page), "named in its turn").toContain(DATE);
});

/**
 * The two paths that never complete a preload. Both are easy to get wrong in the same direction — reporting a load
 * that never happened.
 */
test("a source that fails and a source that is cleared both go without reporting a load", async ({ page }) => {
    await expect.poll(() => loadCount(page)).toBe(1);

    const failed = preloadFailure(page);

    await chooseSource(page, "missing_file");
    await failed;

    expect(await loadCount(page), "nothing loaded, so nothing is reported").toBe(1);

    await chooseSource(page, "none");
    await expect.poll(isStartGoing(page), { message: "clearing swaps immediately" }).toBe(true);

    expect(await loadCount(page), "and there was nothing to preload either").toBe(1);
});

test("the transition duration the consumer sets reaches both elements", async ({ page }) => {
    const knob = page.locator(`${prop("transitionDurationMs")} input`);
    const before = await inputValue(knob);

    await knob.click();
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Tab");

    const after = await inputValue(knob);

    expect(after, "the knob stepped to a new duration").not.toBe(before);
    await expect
        .poll(() => inlineStyle(page.locator(IMAGES).first(), "transition-duration"), {
            message: "both halves of the crossfade run for the duration the consumer stated",
        })
        .toBe(`${after}ms`);
    expect(await inlineStyle(page.locator(IMAGES).last(), "transition-duration")).toBe(`${after}ms`);
});
