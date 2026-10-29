import { type Page, expect, test } from "@playwright/test";

import { demo, prop, revealProp } from "./helpers";

/**
 * The RGB animation stacks one copy of its picture per channel, each filtered down to its channel and blended back
 * with the other two. What it does over time is the consumer's function and is not read here; what is read is the
 * part that lives in the DOM: that every copy is filled with the picture and points at a filter that exists, that
 * the copies sit on one another at rest and part mid-tear, and which blend puts them back together.
 *
 * Each example is paused before it is read, and moved through its pass with its scrubber's keyboard, so the frame
 * read is the one asked for rather than whichever the clock had reached. A channel's own animation is written to its
 * `transform`, `filter` and `opacity`, so the three together are what tell one copy's frame from another's.
 */
const channelsOf = (key: string) => `${demo(key)} [role="img"] > div:last-child > div`;

const readChannels = (page: Page, key: string) =>
    page.locator(channelsOf(key)).evaluateAll((channels) =>
        channels.map((channel) => {
            const picture = channel.firstElementChild as HTMLElement;
            const id = /url\(["']?#([^"')]+)["']?\)/.exec(picture.style.filter)?.[1];

            return {
                transform: (channel as HTMLElement).style.transform,
                filter: (channel as HTMLElement).style.filter,
                opacity: (channel as HTMLElement).style.opacity,
                blend: (channel as HTMLElement).style.mixBlendMode,
                image: getComputedStyle(picture).backgroundImage,
                hasFilter: !!id && !!document.getElementById(id)?.querySelector("feColorMatrix"),
            };
        }),
    );

const pause = async (page: Page, key: string) => {
    await page.locator(`#${key}Playback`).click();
    await expect(page.locator(`#${key}Playback`)).toHaveAccessibleName("Play");
};

const scrubTo = async (page: Page, key: string, percent: number) => {
    await page.locator(`#${key}Progress`).focus();
    await page.keyboard.press("Home");

    for (let i = 0; i < percent; i++) await page.keyboard.press("ArrowRight");
};

const choose = async (page: Page, key: string, name: string) => {
    await revealProp(page, key);
    await page.locator(`${prop(key)} [role="combobox"]`).click();
    await page.getByRole("option", { name, exact: true }).click();
};

const chooseColorMixing = (page: Page, name: string) => choose(page, "colorMixing", name);

const countFrames = async (page: Page, key: string) =>
    new Set(
        (await readChannels(page, key)).map((channel) => `${channel.transform}|${channel.filter}|${channel.opacity}`),
    ).size;

test.beforeEach(async ({ page }) => {
    await page.goto("/rgb-animation");
    await expect(page.locator(channelsOf("glitch"))).toHaveCount(3);
});

/**
 * The page's Source knob picks the picture for every example at once: the photograph, or SVG text drawn into a data
 * address.
 */
test("every channel copy is filled with the picture the page picks, and points at a filter that is in the page", async ({
    page,
}) => {
    const photo = await readChannels(page, "glitch");

    expect(photo.every((channel) => channel.image.startsWith("url(") && channel.hasFilter)).toBe(true);
    expect(photo.some((channel) => channel.image.includes("data:image/svg+xml"))).toBe(false);

    await choose(page, "source", "text");

    await expect.poll(async () => (await readChannels(page, "swell")).every((channel) => channel.hasFilter)).toBe(true);

    for (const key of ["glitch", "swell"]) {
        await expect
            .poll(
                async () =>
                    (await readChannels(page, key)).every((channel) =>
                        channel.image.startsWith('url("data:image/svg+xml'),
                    ),
                { message: `${key} takes the drawn SVG, which an unquoted url would have dropped` },
            )
            .toBe(true);
    }
});

/**
 * Every example starts its pass with the picture whole, so the rest between passes is a rest, and parts its copies
 * mid-pass. Which way each part moves is the example's own function and is not read. An example with no controls of
 * its own — the stress test — cannot be scrubbed and is left out.
 */
test("every example starts its pass with its copies together, and parts them mid-pass", async ({ page }) => {
    const cardKeys = await page
        .locator("[data-example]")
        .evaluateAll((cards) => cards.map((card) => card.dataset.testid!));
    const keys: string[] = [];

    for (const key of cardKeys) {
        if ((await page.locator(`#${key}Playback`).count()) > 0) keys.push(key);
    }

    expect(keys.length).toBeGreaterThan(0);

    for (const key of keys) {
        await pause(page, key);
        await scrubTo(page, key, 0);
        await expect.poll(() => countFrames(page, key), { message: `${key} is whole at the start` }).toBe(1);

        await scrubTo(page, key, 45);
        await expect.poll(() => countFrames(page, key), { message: `${key} parts mid-pass` }).toBeGreaterThan(1);
    }
});

test("at rest the three copies sit on one another, and mid-tear each moves its own way", async ({ page }) => {
    await pause(page, "glitch");
    await scrubTo(page, "glitch", 0);
    await expect.poll(async () => new Set((await readChannels(page, "glitch")).map((c) => c.transform)).size).toBe(1);

    await scrubTo(page, "glitch", 45);
    await expect.poll(async () => new Set((await readChannels(page, "glitch")).map((c) => c.transform)).size).toBe(3);
});

/**
 * The two mixings are told apart only by their blends being different from each other.
 */
test("the two color mixings blend differently, and every copy blends the same way", async ({ page }) => {
    await chooseColorMixing(page, "additive");
    const additive = (await readChannels(page, "glitch"))[0].blend;

    await chooseColorMixing(page, "subtractive");
    await expect.poll(async () => (await readChannels(page, "glitch"))[0].blend).not.toBe(additive);

    const channels = await readChannels(page, "glitch");

    expect(new Set(channels.map((channel) => channel.blend)).size).toBe(1);
});

test.describe("on a dark page", () => {
    test.use({ colorScheme: "dark" });

    /**
     * The color scheme was once read before the element was in the page, where it reads as light, so the first pass
     * of a dark page blended as a light one.
     */
    test("following the color scheme blends as additive from the first frame", async ({ page }) => {
        const following = (await readChannels(page, "glitch"))[0].blend;

        await chooseColorMixing(page, "additive");

        await expect.poll(async () => (await readChannels(page, "glitch"))[0].blend).toBe(following);
    });
});
