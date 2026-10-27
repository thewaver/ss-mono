import { type Page, expect, test } from "@playwright/test";

import { inlineStyle, prop } from "./helpers";

/**
 * A `ParticleDissolve` has no id and no test key of its own, so each example sits in a stage that does, and the spec walks down
 * from it: the stage's first child is the `ParticleDissolve` root, whose first child is the content and whose second, present
 * only while a dissolve is running, is the layer the particles are drawn in. Each particle is one more `ParticleField`
 * layer's item, placed by an inline `left` and `top` in the content's own layout pixels, so the window's scale never
 * enters a comparison of where a particle is and what is painted there.
 *
 * Every test reads a relationship, never a number the page could tune: a particle lies on something painted, takes the
 * color of what it came from, the edge has moved on, the content is out of reach. The page's durations are left as they
 * are; a run takes a little over a second, and the specs wait for it to end rather than for a time.
 *
 * `Viewport` scales what is inside it, and the window these specs run in is not the size where the scale is 1. That
 * matters here, since the painted area is measured on screen and written in layout pixels, so a missing division by the
 * scale puts every particle somewhere else; `beforeEach` fails outright if the window ever lands on a scale of 1, where
 * that mistake could not show.
 */
const stage = (key: string) => `#particleDissolve${key}Stage`;

const root = (key: string) => `${stage(key)} > :first-child`;

const content = (key: string) => `${root(key)} > :first-child`;

const layer = (key: string) => `${root(key)} > [aria-hidden="true"]`;

const MIN_SCALE_DISTANCE = 0.01;
const SAMPLE_INTERVAL_MS = 30;
const RUN_MS = 1500;

type Dot = { x: number; y: number; color: string };

type DotSample = { dots: Dot[]; width: number; height: number };

const setNumber = async (page: Page, key: string, value: number) => {
    await page.locator(`${prop(key)} input`).fill(String(value));
    await page.locator(`${prop(key)} input`).blur();
};

/**
 * A dense run: every painted spot releases a particle and a cell releases several, so a rule about where particles
 * come from is tested against hundreds of them rather than the few a default run leaves.
 */
const makeDense = async (page: Page) => {
    await setNumber(page, "spawnChance", 1);
    await setNumber(page, "particlesPerCell", 4);
};

/**
 * Watches a dissolve for a while and keeps every particle it sees, once, where it was placed. A particle is in the page
 * only while it lives, so a single read at the end would find none.
 */
const watchDots = (page: Page, key: string, watchMs: number): Promise<DotSample> =>
    page.evaluate(
        ([rootSelector, ms, interval]) =>
            new Promise<DotSample>((resolve) => {
                const rootElement = document.querySelector(rootSelector as string) as HTMLElement;
                const seen = new Map<Element, Dot>();
                const startedAt = performance.now();

                const read = () => {
                    for (const item of rootElement.querySelectorAll(
                        ":scope > [aria-hidden='true'] div[style*='left']",
                    )) {
                        if (seen.has(item)) continue;

                        const dot = item.querySelector("div > div[style*='background-color']") as HTMLElement | null;

                        if (!dot) continue;

                        seen.set(item, {
                            x: Number.parseFloat((item as HTMLElement).style.left),
                            y: Number.parseFloat((item as HTMLElement).style.top),
                            color: dot.style.backgroundColor,
                        });
                    }

                    if (performance.now() - startedAt < (ms as number)) {
                        setTimeout(read, interval as number);

                        return;
                    }

                    resolve({
                        dots: [...seen.values()],
                        width: rootElement.offsetWidth,
                        height: rootElement.offsetHeight,
                    });
                };

                read();
            }),
        [root(key), watchMs, SAMPLE_INTERVAL_MS] as const,
    );

const particleDissolveAndWatch = async (page: Page, key: string, burnId: string) => {
    const watching = watchDots(page, key, RUN_MS);

    await page.locator(burnId).click();

    return watching;
};

test.beforeEach(async ({ page }) => {
    await page.goto("/particle-dissolve");
    await expect(page.locator("#particleDissolveCardBurn")).toBeVisible();

    const scale = await page.evaluate(() => {
        const box = document.querySelector("#particleDissolveCardStage") as HTMLElement;

        return box.getBoundingClientRect().width / box.offsetWidth;
    });

    expect(
        Math.abs(scale - 1),
        "the window is not where the Viewport scale is 1, or a particle written without the scale could not be told apart",
    ).toBeGreaterThan(MIN_SCALE_DISTANCE);
});

/**
 * Dissolved content is not a button somebody can still press: a mask changes what is painted and not what can be
 * clicked, so the content is made inert from the first frame of the dissolve until it is whole again.
 */
test("dissolved content is out of reach, and rebuilding gives it back", async ({ page }) => {
    const wrapper = page.locator(content("Button"));
    const button = page.locator("#particleDissolveBurn");

    await expect(wrapper, "whole content is reachable").not.toHaveAttribute("inert");

    await button.click();
    await expect(wrapper, "from the first frame of the dissolve").toHaveAttribute("inert");
    await expect(page.locator(layer("Button")), "the particles come").toHaveCount(1);
    await expect(page.locator(layer("Button")), "and go, which is the end of the dissolve").toHaveCount(0);

    const isFocusable = await button.evaluate((element) => {
        (element as HTMLElement).focus();

        return document.activeElement === element;
    });

    expect(isFocusable, "a dissolved button cannot take focus").toBe(false);
    await expect(wrapper, "and stays out of reach once it has gone").toHaveAttribute("inert");

    await page.locator("#particleDissolveRebuild").click();
    await expect(wrapper, "whole again").not.toHaveAttribute("inert");
    expect(await inlineStyle(wrapper, "mask-image"), "with nothing masking it").toBe("");
});

test("the edge moves across the content as the dissolve goes on", async ({ page }) => {
    const wrapper = page.locator(content("Card"));

    await page.locator("#particleDissolveCardBurn").click();
    await expect
        .poll(() => inlineStyle(wrapper, "mask-image"), "a mask is drawn once the dissolve starts")
        .not.toBe("");

    const first = await inlineStyle(wrapper, "mask-image");

    await expect
        .poll(() => inlineStyle(wrapper, "mask-image"), "and it is a different one a moment later")
        .not.toBe(first);
});

/**
 * Pressing a control burns it outward from the point pressed, which the example writes as the sweep's origin, a share
 * of the content's width and height. With the pointer that is where it landed; with the keyboard there is no point, so
 * it is the center.
 */
test("a pointer press burns outward from where it landed", async ({ page }) => {
    const button = page.locator("#particleDissolveBurn");
    const box = (await button.boundingBox())!;

    await page.mouse.click(box.x + box.width * 0.85, box.y + box.height * 0.5);

    const wrapper = page.locator(content("Button"));

    await expect.poll(() => inlineStyle(wrapper, "mask-image")).toContain("radial-gradient");

    const origin = await wrapper.evaluate((element) => {
        const match = /at\s+(-?[\d.]+)px\s+(-?[\d.]+)px/.exec((element as HTMLElement).style.maskImage);

        return {
            x: Number(match?.[1]) / element.clientWidth,
            y: Number(match?.[2]) / element.clientHeight,
        };
    });

    expect(origin.x, "near the right edge, where the press was").toBeGreaterThan(0.7);
    expect(origin.y, "and in the middle of its height").toBeGreaterThan(0.3);
    expect(origin.y).toBeLessThan(0.7);
});

test("a keyboard press burns outward from the center", async ({ page }) => {
    await page.locator("#particleDissolveBurn").focus();
    await page.keyboard.press("Enter");

    const wrapper = page.locator(content("Button"));

    await expect.poll(() => inlineStyle(wrapper, "mask-image")).toContain("radial-gradient");

    const originX = await wrapper.evaluate((element) => {
        const match = /at\s+(-?[\d.]+)px/.exec((element as HTMLElement).style.maskImage);

        return Number(match?.[1]) / element.clientWidth;
    });

    expect(originX).toBeGreaterThan(0.4);
    expect(originX).toBeLessThan(0.6);
});

/**
 * The particles take the color of what they came from. The card's title is text, and its badge is a box with a
 * gradient on top of a background color, so the two have to be told apart by the colors the browser computes for them,
 * which the particles must include.
 */
test("particles take the color of the text and the boxes they came from", async ({ page }) => {
    await makeDense(page);

    const colors = await page.evaluate(() => ({
        title: getComputedStyle(document.querySelector("#particleDissolveCardTitle")!).color,
        badge: getComputedStyle(document.querySelector("#particleDissolveCardBadge")!).backgroundColor,
    }));
    const { dots } = await particleDissolveAndWatch(page, "Card", "#particleDissolveCardBurn");

    expect(dots.length, "a dense run releases plenty").toBeGreaterThan(50);
    expect(
        dots.map((dot) => dot.color),
        "the text's color",
    ).toContain(colors.title);
    expect(
        dots.map((dot) => dot.color),
        "the badge's background color, under its gradient",
    ).toContain(colors.badge);
});

/**
 * An SVG shape is read point by point against its fill and its stroke, with the page's scale divided out, so asking the
 * shape itself about each particle's place, the way the browser would, finds every one of them on it.
 */
test("an SVG sheds particles only from its own fill and stroke", async ({ page }) => {
    await makeDense(page);

    const { dots } = await particleDissolveAndWatch(page, "Svg", "#particleDissolveSvgBurn");

    expect(dots.length, "a dense run releases plenty").toBeGreaterThan(50);

    const stray = await page.evaluate((places) => {
        const path = document.querySelector("#particleDissolveSvgStage svg path") as SVGGeometryElement;

        return places.filter((place) => {
            const point = new DOMPoint(place.x, place.y);

            return !path.isPointInFill(point) && !path.isPointInStroke(point);
        }).length;
    }, dots);

    expect(stray, "no particle starts outside the shape").toBe(0);
});

/**
 * A picture is read pixel by pixel, so what it does not paint sheds nothing. The picture's own pixels are the reference:
 * every particle has something opaque within a few layout pixels, which a whole-box reading, spreading particles over
 * the picture's transparent surround, fails by a long way.
 */
test("an image sheds particles only where it has pixels", async ({ page }) => {
    await makeDense(page);

    const { dots } = await particleDissolveAndWatch(page, "Image", "#particleDissolveImageBurn");

    expect(dots.length, "a dense run releases plenty").toBeGreaterThan(50);

    const stray = await page.evaluate(async (places) => {
        const image = document.querySelector("#particleDissolveImageStage img") as HTMLImageElement;
        const canvas = document.createElement("canvas");

        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;

        const context = canvas.getContext("2d")!;

        context.drawImage(image, 0, 0);

        const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
        const toNatural = image.naturalWidth / image.offsetWidth;
        const reach = Math.ceil(toNatural * 5);

        const hasPixelsNear = (x: number, y: number) => {
            for (let row = Math.max(0, y - reach); row <= Math.min(canvas.height - 1, y + reach); row++) {
                for (let col = Math.max(0, x - reach); col <= Math.min(canvas.width - 1, x + reach); col++) {
                    if ((pixels.data[(row * canvas.width + col) * 4 + 3] ?? 0) > 16) return true;
                }
            }

            return false;
        };

        return places.filter(
            (place) => !hasPixelsNear(Math.round(place.x * toNatural), Math.round(place.y * toNatural)),
        ).length;
    }, dots);

    expect(stray, "no particle starts where the picture is transparent").toBe(0);
});

test("a cell releases as many particles as the page asks for", async ({ page }) => {
    await setNumber(page, "particlesPerCell", 3);
    await page.locator("#particleDissolveCardBurn").click();
    await expect(page.locator(layer("Card"))).toHaveCount(1);

    expect(
        await page.locator(layer("Card")).evaluate((element) => element.children.length),
        "one layer of particles for each one a cell can release",
    ).toBe(3);
});

test("rebuilding part-way turns the dissolve round", async ({ page }) => {
    const wrapper = page.locator(content("Card"));

    await page.locator("#particleDissolveCardBurn").click();
    await expect(page.locator(layer("Card"))).toHaveCount(1);
    await page.locator("#particleDissolveCardRebuild").click();

    await expect(page.locator(layer("Card")), "the particles are gone once it has turned round").toHaveCount(0);
    await expect(wrapper, "and the content is whole and reachable").not.toHaveAttribute("inert");
    expect(await inlineStyle(wrapper, "mask-image")).toBe("");
});

/**
 * A reader who asked for reduced motion gets no particles and no sweep, only the content fading out, and quickly.
 */
test("under reduced motion the content fades and nothing is released", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.reload();
    await expect(page.locator("#particleDissolveCardBurn")).toBeVisible();

    const { dots } = await particleDissolveAndWatch(page, "Card", "#particleDissolveCardBurn");
    const wrapper = page.locator(content("Card"));

    expect(dots, "no particle was ever drawn").toHaveLength(0);
    expect(await inlineStyle(wrapper, "mask-image"), "and no mask swept across").toBe("");
    await expect(wrapper, "the content has faded away").toHaveCSS("opacity", "0");
});
