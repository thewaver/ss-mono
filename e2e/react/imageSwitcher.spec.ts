import { type Page, expect, test } from "@playwright/test";

import { computedStyle, inlineStyle } from "../helpers";

/**
 * The React `ImageSwitcher`. The cases follow `e2e/imageSwitcher.spec.ts`, which covers the Solid one. Everything the
 * component decides is in the DOM: the two `<img>` elements carry the swap between them, and neither changes until
 * the incoming picture has finished loading somewhere the user cannot see.
 */
const STORY = "Essentials/ImageSwitcher/Default";
const IMAGES = '[data-testid="frame"] img';
const PROFILE = "knight_profile";
const DATE = "knight_date";
const MISSING = "missing_image.webp";

const PRELOAD_DELAY_MS = 1500;

const chooseSource = (page: Page, name: string) => page.getByRole("combobox", { name: "Source" }).selectOption(name);

const sources = (page: Page) =>
    page
        .locator(IMAGES)
        .evaluateAll((images) => images.map((image) => (image as HTMLImageElement).getAttribute("src")));

const loadReadout = async (page: Page) => ((await page.locator('[data-readout="loads"]').textContent()) ?? "").trim();

const mountStory = async (page: Page, mount: (story: string, props?: object) => Promise<unknown>, props?: object) => {
    await mount(STORY, props);
    await expect(page.locator(IMAGES)).toHaveCount(2);
    await expect.poll(async () => (await sources(page)).filter((src) => src?.includes(PROFILE)).length).toBe(1);
};

test("both elements stay mounted, and the outgoing one keeps its image while it fades", async ({ page, mount }) => {
    await mountStory(page, mount);

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
        "the outgoing element keeps the old image",
    ).toHaveLength(1);

    const opacities = await Promise.all([
        inlineStyle(page.locator(IMAGES).first(), "opacity"),
        inlineStyle(page.locator(IMAGES).last(), "opacity"),
    ]);

    expect(opacities.sort(), "one is on and one is off, which is the crossfade").toEqual(["0", "1"]);
});

test("a new source is preloaded before either element changes", async ({ page, mount }) => {
    await page.route(`**/*${DATE}*`, async (route) => {
        await new Promise((resolve) => setTimeout(resolve, PRELOAD_DELAY_MS));
        await route.continue();
    });

    await mountStory(page, mount);

    const before = await sources(page);

    await chooseSource(page, "date");

    expect(await sources(page), "while the request is in flight both elements still hold what they held").toEqual(
        before,
    );

    await expect
        .poll(async () => (await sources(page)).filter((src) => src?.includes(DATE)).length, {
            message: "and the swap happens only once the image has loaded",
            timeout: PRELOAD_DELAY_MS * 3,
        })
        .toBe(1);
});

test("a source that fails to load still swaps, rather than stranding the old image", async ({ page, mount }) => {
    const warnings: string[] = [];

    page.on("console", (message) => {
        if (message.type() === "warning") warnings.push(message.text());
    });

    await mountStory(page, mount);
    await chooseSource(page, "missingFile");

    await expect.poll(async () => (await sources(page)).some((src) => src?.includes(MISSING))).toBe(true);

    expect(
        warnings.some((text) => text.includes("failed to preload")),
        "and it says so",
    ).toBe(true);
});

test("clearing the source swaps immediately and hides the element that has nothing to show", async ({
    page,
    mount,
}) => {
    await mountStory(page, mount);
    await chooseSource(page, "none");

    await expect.poll(async () => (await sources(page)).filter((src) => src?.includes(PROFILE)).length).toBe(1);

    const visibilities = await Promise.all([
        computedStyle(page.locator(IMAGES).first(), "visibility"),
        computedStyle(page.locator(IMAGES).last(), "visibility"),
    ]);

    expect(
        visibilities.filter((value) => value === "hidden"),
        "the element with no image is hidden",
    ).toHaveLength(1);
});

test("each source that actually loads is reported once, and names itself", async ({ page, mount }) => {
    await mountStory(page, mount);

    await expect
        .poll(() => loadReadout(page), { message: "the starting image is a load like any other" })
        .toContain("loads: 1");
    expect(await loadReadout(page)).toContain(PROFILE);

    await chooseSource(page, "date");

    await expect.poll(() => loadReadout(page), { message: "a second source is a second load" }).toContain("loads: 2");
    expect(await loadReadout(page)).toContain(DATE);
});

test("a source that fails and a source that is cleared both swap without reporting a load", async ({ page, mount }) => {
    await mountStory(page, mount);
    await expect.poll(() => loadReadout(page)).toContain("loads: 1");

    await chooseSource(page, "missingFile");
    await expect.poll(async () => (await sources(page)).some((src) => src?.includes(MISSING))).toBe(true);

    expect(await loadReadout(page), "nothing loaded, so nothing is reported").toContain("loads: 1");

    await chooseSource(page, "none");
    await expect.poll(async () => (await sources(page)).filter((src) => src?.includes(MISSING)).length).toBe(1);

    expect(await loadReadout(page), "and there was nothing to preload either").toContain("loads: 1");
});

test("the transition duration the consumer sets reaches both elements", async ({ page, mount }) => {
    await mountStory(page, mount, { transitionDurationMs: 250 });

    expect(await inlineStyle(page.locator(IMAGES).first(), "transition-duration")).toBe("250ms");
    expect(await inlineStyle(page.locator(IMAGES).last(), "transition-duration")).toBe("250ms");
});
