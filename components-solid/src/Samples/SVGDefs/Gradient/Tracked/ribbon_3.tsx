import { createEffect, createSignal, untrack } from "solid-js";

import {
    type GradientRibbonSampleOpts,
    type PointerReading,
    SVGDefsUtils,
    TrackedGradientDefaults,
} from "@thewaver/ss-components";
import { MathUtils, type Point2d } from "@thewaver/ss-utils";

import { PointerTrackerSolidUtils } from "../../../../Abstracts/PointerTracker/PointerTrackerSolid.utils";
import { SVGGradientDefsSolidUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefsSolid.utils";
import type { TrackedGradientConfig } from "../../SVGDefsSolid.types";
import { SVGDefsSolidUtils } from "../../SVGDefsSolid.utils";

const COLOR_KEYS = ["primary", "secondary", "tertiary"] as const;
const PACE_BY_RIBBON = [1, 0.7, 0.5];
const SETTLE_MS = 1500;
const RESTING_POINT: Point2d = { x: 0.5, y: 0.5 };
const STILL: Point2d = { x: 0, y: 0 };
const NO_FADE = 0;

const DEFAULTS = TrackedGradientDefaults.RIBBON_DEFAULTS;

const NO_REF = () => undefined;

const clock = SVGDefsSolidUtils.createClock(SETTLE_MS);

const createRibbons = (
    getReading: () => PointerReading,
    getIsPointerPresent: () => boolean,
    opts?: GradientRibbonSampleOpts,
) => {
    const length = opts?.ribbonLength ?? DEFAULTS.ribbonLength;
    const stiffness = opts?.stiffness ?? DEFAULTS.stiffness;
    const damping = opts?.damping ?? DEFAULTS.damping;
    const follow = opts?.followStiffness ?? DEFAULTS.followStiffness;

    const [getChains, setChains] = createSignal<Point2d[][]>(
        COLOR_KEYS.map(() => Array.from({ length }, () => RESTING_POINT)),
    );

    let velocities = COLOR_KEYS.map(() => STILL);
    let lastMs: number | undefined;

    clock.subscribe();

    createEffect(() => {
        const nowMs = clock.getFrameMs();
        const reading = getReading();
        const frameMs = lastMs === undefined ? 0 : nowMs - lastMs;

        lastMs = nowMs;

        if (SVGDefsUtils.getPointerFade(reading, getIsPointerPresent()) > NO_FADE) clock.keepAwake();

        if (frameMs <= 0) return;

        setChains(
            untrack(getChains).map((chain, ribbon) => {
                const head = SVGDefsUtils.stepSpring(
                    chain[0],
                    velocities[ribbon],
                    reading.boxRatio,
                    frameMs,
                    stiffness * PACE_BY_RIBBON[ribbon],
                    damping,
                );
                const next = [head.position];

                velocities[ribbon] = head.velocity;

                for (let index = 1; index < chain.length; index++) {
                    const ahead = next[index - 1];

                    next.push({
                        x: MathUtils.lerp(chain[index].x, ahead.x, follow),
                        y: MathUtils.lerp(chain[index].y, ahead.y, follow),
                    });
                }

                return next;
            }),
        );
    });

    return getChains;
};

export const ribbon_3 = (opts?: GradientRibbonSampleOpts): TrackedGradientConfig => ({
    computeSVGDefs: (id, __, getRef, defs) => {
        const sharedBlur = SVGDefsSolidUtils.getBaseBlur(id, defs);
        const sharedBlurRef = SVGDefsUtils.getSharedFilter(sharedBlur);
        const length = opts?.ribbonLength ?? DEFAULTS.ribbonLength;

        const { getReading, getIsPointerPresent } = PointerTrackerSolidUtils.create(
            getRef ?? NO_REF,
            undefined,
            defs.getPointSource,
        );

        const getChains = createRibbons(getReading, getIsPointerPresent, opts);

        const getFade = () => SVGDefsUtils.getPointerFade(getReading(), getIsPointerPresent());

        const layers = COLOR_KEYS.flatMap((colorKey, ribbon) =>
            Array.from({ length }, (_unused, stamp) => length - 1 - stamp).map((index) => {
                const share = length > 1 ? index / (length - 1) : 0;
                const gradientId = `gradient-${ribbon}-${index}-${id}`;
                const getAlpha = () => (opts?.headAlpha ?? DEFAULTS.headAlpha) * (1 - share) * getFade();

                return {
                    gradientOrPattern: {
                        id: gradientId,
                        renderDefsElement: () =>
                            SVGGradientDefsSolidUtils.computeRadialGradient({
                                id: gradientId,
                                elementSize: (opts?.circular ?? DEFAULTS.circular) ? () => defs.getSize() : undefined,
                                origin: () => getChains()[ribbon][index],
                                scale: MathUtils.lerp(
                                    opts?.headScale ?? DEFAULTS.headScale,
                                    opts?.tailScale ?? DEFAULTS.tailScale,
                                    share,
                                ),
                                colors: () => [
                                    { value: `rgb(from ${defs.colors[colorKey]} r g b / ${getAlpha()})` },
                                    { value: `rgb(from ${defs.colors[colorKey]} r g b / 0)`, stop: 100 },
                                ],
                            }),
                    },
                    filter: ribbon === 0 && index === length - 1 ? sharedBlur : sharedBlurRef,
                };
            }),
        );

        return [{ color: SVGDefsUtils.getBaseBorderColor(defs) }, ...layers];
    },
});
