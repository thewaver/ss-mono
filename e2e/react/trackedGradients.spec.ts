import { type Locator, type Page, expect, test } from "@playwright/test";

/**
 * The React tracked gradient samples: the paints that follow the pointer across a `Shape`. There is no Solid spec for
 * them to follow, so these cases state what every one of them does. It paints with a gradient that exists and has
 * stops; sweeping the pointer across the shape moves or recolors that gradient; and the ones that leave something
 * behind the pointer — a trail, a smear, ripples — come to rest once the pointer does, which is what shows their
 * frame clock goes quiet rather than ticking forever. The drawing is compared with itself at another moment, never
 * with an attribute value written here.
 *
 * The paint is checked on the story that shows every sample at once, and the pointer cases on the one that shows a
 * single sample. With all of them on the page, the ones next to the pointer wake as well, and under a full parallel
 * run a sweep then takes long enough to deliver that a trail has faded before it can be read.
 */
const ALL = "Samples/TrackedGradients/All";
const ONE = "Samples/TrackedGradients/One";
const SAMPLES = [
    "band_1",
    "band_1v1",
    "band_diag_1",
    "hand_1",
    "hand_trail_1",
    "hand_trail_2",
    "hand_trail_3",
    "spot_1",
    "spot_flare_2",
    "spot_flare_3",
    "spot_ripple_1",
    "spot_ripple_2",
    "spot_ripple_3",
    "spot_smear_1",
    "spot_smear_2",
    "spot_smear_3",
    "spot_trail_1",
    "spot_trail_2",
    "spot_trail_3",
];
const LEAVES_A_WAKE = /trail|smear|ripple/;
const SWEEP_STEPS = 24;
const SETTLE_GAP_MS = 300;
const SETTLE_TIMEOUT_MS = 10_000;

/**
 * Everything the fill layer's definitions draw — every gradient's and clip path's attributes, and those of what sits
 * inside them — as one string, so two moments can be compared whole.
 */
const drawingOf = (sample: Locator) =>
    sample.evaluate((root) => {
        const describe = (element: Element): string => {
            const attributes = [...element.attributes].map((attribute) => `${attribute.name}=${attribute.value}`);

            return `<${element.tagName} ${attributes.join(" ")}>${[...element.children].map(describe).join("")}`;
        };

        return [...root.querySelectorAll("svg defs > *")].map(describe).join("\n");
    });

/** Each path of the fill layer: its fill, and what that fill points at when it is a `url(#…)`. */
const paintOf = (sample: Locator) =>
    sample.evaluate((root) => {
        const svg = root.querySelector("svg")!;

        return [...svg.querySelectorAll(":scope > path")].map((path) => {
            const fill = path.getAttribute("fill") ?? "";
            const id = /^url\(#(.+)\)$/.exec(fill)?.[1];
            const target = id ? svg.querySelector(`defs [id="${id}"]`) : null;

            return { fill, id, tag: target?.tagName, stops: target?.querySelectorAll("stop").length ?? 0 };
        });
    });

/**
 * How many of the gradients behind the pointer — every one but the first, which follows the pointer itself — are
 * showing anything. One whose stops all carry the same color is drawn fully transparent, so it counts as empty.
 */
const wakeOf = (sample: Locator) =>
    sample.evaluate(
        (root) =>
            [...root.querySelectorAll("svg defs linearGradient, svg defs radialGradient")]
                .slice(1)
                .filter(
                    (gradient) =>
                        new Set([...gradient.querySelectorAll("stop")].map((stop) => stop.getAttribute("stop-color")))
                            .size > 1,
                ).length,
    );

/**
 * Moves the pointer across the shape along a line that misses its center, so that the pointer's bearing from the
 * center turns steadily as well as its position moving — a line through the center would hold the bearing still and
 * then flip it, which gives the hand samples nothing to trail.
 *
 * The wake is read after every step rather than once at the end. What a sweep leaves behind lives well under a second,
 * and a loaded machine can take longer than that to deliver the steps, so a single read at the end can find it gone.
 *
 * @returns The most gradients seen showing behind the pointer at any one step.
 */
const sweepAcross = async (page: Page, sample: Locator) => {
    const box = (await sample.boundingBox())!;

    let mostWake = 0;

    for (let step = 0; step <= SWEEP_STEPS; step += 1) {
        const along = step / SWEEP_STEPS;

        await page.mouse.move(box.x + box.width * (0.2 + 0.6 * along), box.y + box.height * (0.3 + 0.1 * along));

        mostWake = Math.max(mostWake, await wakeOf(sample));
    }

    return mostWake;
};

for (const name of SAMPLES) {
    test.describe(name, () => {
        test("it paints with a gradient that exists and has stops", async ({ mount }) => {
            const component = await mount(ALL);
            const sample = component.locator(`[data-sample="${name}"]`);

            await expect
                .poll(async () => (await paintOf(sample)).filter((paint) => paint.id).length, {
                    message: "at least one layer is painted with a url(#…) fill",
                })
                .toBeGreaterThan(0);

            for (const paint of (await paintOf(sample)).filter((entry) => entry.id)) {
                expect(paint.tag, `${paint.fill} points at a gradient in the same layer`).toMatch(
                    /^(linearGradient|radialGradient)$/,
                );
                expect(paint.stops, `${paint.fill} has stops to paint with`).toBeGreaterThan(0);
            }
        });

        test("sweeping the pointer across it moves or recolors the gradient", async ({ page, mount }) => {
            const component = await mount(ONE, { name });
            const sample = component.locator(`[data-sample="${name}"]`);
            const box = (await sample.boundingBox())!;

            await page.mouse.move(box.x + box.width * 0.2, box.y + box.height * 0.3);
            await expect.poll(() => drawingOf(sample), { message: "the defs have been drawn" }).not.toBe("");

            const before = await drawingOf(sample);

            await sweepAcross(page, sample);

            await expect
                .poll(() => drawingOf(sample), { message: "the drawing is not what it was before the sweep" })
                .not.toBe(before);
        });

        if (LEAVES_A_WAKE.test(name)) {
            test("once the pointer stops, the drawing comes to rest", async ({ page, mount }) => {
                const component = await mount(ONE, { name });
                const sample = component.locator(`[data-sample="${name}"]`);

                await expect
                    .poll(() => sweepAcross(page, sample), {
                        message: "a sweep leaves something behind the pointer",
                        timeout: SETTLE_TIMEOUT_MS,
                    })
                    .toBeGreaterThan(0);

                await expect
                    .poll(
                        async () => {
                            const first = await drawingOf(sample);

                            await page.waitForTimeout(SETTLE_GAP_MS);

                            return first === (await drawingOf(sample));
                        },
                        { message: "two reads a while apart agree", timeout: SETTLE_TIMEOUT_MS },
                    )
                    .toBe(true);
            });
        }
    });
}
