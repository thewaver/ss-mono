import { type Page, expect, test } from "@playwright/test";

/**
 * The React timed gradient samples, each painting a `Shape`'s fill. There is no Solid spec to follow: these are the
 * Solid samples ported one for one, so what is worth holding them to is that each one's wiring arrives whole — a
 * painted path points at a gradient that exists, the gradient carries stops to draw with, and the SMIL animations the
 * sample builds are begun and actually move something. The story turns color cycling on wherever a sample offers it,
 * and adds a banded run of each flow, so both color-walking animations are exercised. Nothing here compares a color or
 * a coordinate with a value written down: movement is a later reading differing from an earlier one.
 */
const STORY = "Samples/TimedGradients/All";
const READINGS = 12;
const READING_INTERVAL_MS = 100;
const SAMPLES = [
    "elastic_circle_1",
    "elastic_drip_1",
    "elastic_inter_semicircle_1",
    "elastic_semicircle_1",
    "fill_2c",
    "fill_3c",
    "fill_diag_2v2c",
    "flow_2",
    "flow_2_banded",
    "flow_3",
    "flow_3_banded",
    "flow_diag_2",
    "flow_diag_2_banded",
    "flow_diag_3",
    "flow_diag_3_banded",
    "merge_1v1",
    "merge_diag_1v1",
    "merge_diag_async_4",
    "orbit_1",
    "orbit_1v1",
    "orbit_async_2v1",
    "orbit_async_3",
    "scan_1",
    "scan_1v1",
    "scan_diag_1",
    "scan_diag_1v1",
    "snake_1",
    "snake_1v1",
    "snake_2",
    "snake_4",
    "snake_async_3",
    "snake_inter_2",
    "sweep_1",
    "sweep_1v1",
    "sweep_diag_1",
    "sweep_diag_1v1",
    "sweep_diag_async_4",
];

/**
 * Every `url(#…)` the sample's painted paths point at, with what each one resolves to. It is looked up by id rather
 * than by selector, since the ids come from `useId` and are not guaranteed to be valid CSS.
 */
const paintOf = (page: Page, name: string) =>
    page.evaluate((sample) => {
        const root = document.querySelector(`[data-sample="${sample}"]`)!;

        return [...root.querySelectorAll("svg > path")]
            .flatMap((path) => [path.getAttribute("fill"), path.getAttribute("stroke")])
            .map((value) => value?.match(/^url\(#(.+)\)$/)?.[1])
            .filter((id): id is string => !!id)
            .map((id) => {
                const target = document.getElementById(id);

                return {
                    id,
                    tag: target?.tagName,
                    isInside: !!target && root.contains(target),
                    stopCount: target?.querySelectorAll(":scope > stop").length ?? 0,
                };
            });
    }, name);

/** How many `animate` elements the sample holds, and how many of them have begun an interval. */
const animationsOf = (page: Page, name: string) =>
    page.evaluate((sample) => {
        const animations = [...document.querySelectorAll(`[data-sample="${sample}"] animate`)] as SVGAnimateElement[];
        const begun = animations.filter((animation) => {
            try {
                animation.getStartTime();

                return true;
            } catch {
                return false;
            }
        });

        return { count: animations.length, begun: begun.length };
    }, name);

/**
 * Reads everything a timed sample can animate, a number of times over a second or so, and answers how many distinct
 * readings came back: a gradient's endpoints as the browser is currently drawing them, each stop's color as computed,
 * and each clip path's outline as computed.
 */
const distinctReadingsOf = (page: Page, name: string) =>
    page.evaluate(
        async ({ sample, readings, intervalMs }) => {
            const root = document.querySelector(`[data-sample="${sample}"]`)!;
            const read = () =>
                JSON.stringify([
                    [...root.querySelectorAll("linearGradient")].map((node) => {
                        const gradient = node as SVGLinearGradientElement;

                        return [gradient.x1, gradient.y1, gradient.x2, gradient.y2].map((length) =>
                            length.animVal.value.toFixed(4),
                        );
                    }),
                    [...root.querySelectorAll("stop")].map((stop) => getComputedStyle(stop).stopColor),
                    [...root.querySelectorAll("clipPath path")].map((path) => getComputedStyle(path).d),
                ]);
            const seen = new Set<string>();

            for (let i = 0; i < readings; i++) {
                seen.add(read());

                await new Promise((resolve) => setTimeout(resolve, intervalMs));
            }

            return seen.size;
        },
        { sample: name, readings: READINGS, intervalMs: READING_INTERVAL_MS },
    );

for (const name of SAMPLES) {
    test(`${name} paints with a gradient that has stops`, async ({ page, mount }) => {
        await mount(STORY);

        await expect
            .poll(async () => (await paintOf(page, name)).length, {
                message: "at least one painted path points at a def",
            })
            .toBeGreaterThan(0);

        for (const paint of await paintOf(page, name)) {
            expect(paint.tag, `#${paint.id} resolves to a gradient`).toMatch(/^(linearGradient|radialGradient)$/);
            expect(paint.isInside, `#${paint.id} is defined inside the sample's own shape`).toBe(true);
            expect(paint.stopCount, `#${paint.id} has stops to draw with`).toBeGreaterThan(0);
        }
    });

    test(`${name} begins its animations, and they move`, async ({ page, mount }) => {
        await mount(STORY);

        await expect
            .poll(async () => (await animationsOf(page, name)).count, { message: "the sample builds animations" })
            .toBeGreaterThan(0);
        await expect
            .poll(async () => (await animationsOf(page, name)).begun, { message: "and the scheduler has begun them" })
            .toBeGreaterThan(0);

        expect(
            await distinctReadingsOf(page, name),
            "what the sample animates reads differently from one moment to the next",
        ).toBeGreaterThan(1);
    });
}
