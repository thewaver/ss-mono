import { createEffect, createSignal, untrack } from "solid-js";

import {
    type CycleColorKey,
    type GradientCometSampleOpts,
    type PointerReading,
    SVGDefsUtils,
    TrackedGradientDefaults,
} from "@thewaver/ss-components";
import { MathUtils, type Point2d } from "@thewaver/ss-utils";

import { PointerTrackerSolidUtils } from "../../../../Abstracts/PointerTracker/PointerTrackerSolid.utils";
import { SVGGradientDefsSolidUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefsSolid.utils";
import type { TrackedGradientConfig } from "../../SVGDefsSolid.types";
import { SVGDefsSolidUtils } from "../../SVGDefsSolid.utils";

const PACE_BY_COMET = [1, 0.7, 0.5];
const SETTLE_MS = 1500;
const RESTING_POINT: Point2d = { x: 0.5, y: 0.5 };
const STILL: Point2d = { x: 0, y: 0 };
const NO_FADE = 0;

const CYCLING_DEFAULTS = TrackedGradientDefaults.COMET_CYCLING_DEFAULTS;

const NO_REF = () => undefined;

const clock = SVGDefsSolidUtils.createClock(SETTLE_MS);

const createComets = (
    getReading: () => PointerReading,
    getIsPointerPresent: () => boolean,
    defaults: typeof TrackedGradientDefaults.COMET_DEFAULTS,
    opts?: GradientCometSampleOpts,
) => {
    const length = opts?.tailLength ?? defaults.tailLength;
    const stiffness = opts?.stiffness ?? defaults.stiffness;
    const damping = opts?.damping ?? defaults.damping;
    const follow = opts?.followStiffness ?? defaults.followStiffness;

    const [getChains, setChains] = createSignal<Point2d[][]>(
        PACE_BY_COMET.map(() => Array.from({ length }, () => RESTING_POINT)),
    );

    const velocities = PACE_BY_COMET.map(() => STILL);

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
            untrack(getChains).map((chain, comet) => {
                const head = SVGDefsUtils.stepSpring(
                    chain[0],
                    velocities[comet],
                    reading.boxRatio,
                    frameMs,
                    stiffness * PACE_BY_COMET[comet],
                    damping,
                );

                velocities[comet] = head.velocity;

                return SVGDefsUtils.followChain(chain, head.position, follow);
            }),
        );
    });

    return getChains;
};

export const createCometSample =
    (colorKeys: CycleColorKey[], defaults: typeof TrackedGradientDefaults.COMET_DEFAULTS) =>
    (opts?: GradientCometSampleOpts): TrackedGradientConfig => ({
        computeSVGDefs: (id, __, getRef, defs) => {
            const sharedBlur = SVGDefsSolidUtils.getBaseBlur(id, defs);
            const sharedBlurRef = SVGDefsUtils.getSharedFilter(sharedBlur);
            const length = opts?.tailLength ?? defaults.tailLength;
            const cycleMs = opts?.cycles ? (opts.cycleMs ?? CYCLING_DEFAULTS.cycleMs) : undefined;
            const comets = PACE_BY_COMET.map((_unused, comet) => comet).reverse();

            const { getReading, getIsPointerPresent } = PointerTrackerSolidUtils.create(
                getRef ?? NO_REF,
                undefined,
                defs.getPointSource,
            );

            const getChains = createComets(getReading, getIsPointerPresent, defaults, opts);

            const getFade = () => SVGDefsUtils.getPointerFade(getReading(), getIsPointerPresent());

            const getColor = (comet: number) => {
                if (cycleMs && getFade() > NO_FADE) clock.keepAwake();

                return SVGDefsUtils.computeTracerColor(
                    defs.colors,
                    colorKeys,
                    comet,
                    PACE_BY_COMET.length,
                    clock.getFrameMs(),
                    cycleMs,
                );
            };

            const layers = comets.flatMap((comet, order) =>
                Array.from({ length }, (_unused, stamp) => length - 1 - stamp).map((index) => {
                    const share = length > 1 ? index / (length - 1) : 0;
                    const gradientId = `gradient-${comet}-${index}-${id}`;
                    const getAlpha = () => (opts?.headAlpha ?? defaults.headAlpha) * (1 - share) * getFade();

                    return {
                        gradientOrPattern: {
                            id: gradientId,
                            renderDefsElement: () =>
                                SVGGradientDefsSolidUtils.computeRadialGradient({
                                    id: gradientId,
                                    elementSize:
                                        (opts?.circular ?? defaults.circular) ? () => defs.getSize() : undefined,
                                    origin: () => getChains()[comet][index],
                                    scale: MathUtils.lerp(
                                        opts?.headScale ?? defaults.headScale,
                                        opts?.tailScale ?? defaults.tailScale,
                                        share,
                                    ),
                                    colors: () => [
                                        { value: `rgb(from ${getColor(comet)} r g b / ${getAlpha()})` },
                                        { value: `rgb(from ${getColor(comet)} r g b / 0)`, stop: 100 },
                                    ],
                                }),
                        },
                        filter: order === 0 && index === length - 1 ? sharedBlur : sharedBlurRef,
                    };
                }),
            );

            return [{ color: SVGDefsUtils.getBaseBorderColor(defs) }, ...layers];
        },
    });
