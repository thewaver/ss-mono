import { createEffect, createSignal, untrack } from "solid-js";

import {
    type CycleColorKey,
    type GradientSwarmSampleOpts,
    type PointerReading,
    SVGDefsUtils,
    TrackedGradientDefaults,
} from "@thewaver/ss-components";
import { SwarmConst, TrackedGradientSampleConst } from "@thewaver/ss-components/internal";
import { MathUtils, type Point2d } from "@thewaver/ss-utils";

import { PointerTrackerSolidUtils } from "../../../../Abstracts/PointerTracker/PointerTrackerSolid.utils";
import { SVGGradientDefsSolidUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefsSolid.utils";
import type { TrackedGradientConfig } from "../../SVGDefsSolid.types";
import { SVGDefsSolidUtils } from "../../SVGDefsSolid.utils";

const NO_REF = () => undefined;

const clock = SVGDefsSolidUtils.createClock(SwarmConst.SETTLE_MS);

const createTracers = (
    getReading: () => PointerReading,
    getIsPointerPresent: () => boolean,
    defaults: typeof TrackedGradientDefaults.SWARM_DEFAULTS,
    opts?: GradientSwarmSampleOpts,
) => {
    const count = opts?.spotCount ?? defaults.spotCount;
    const length = opts?.tailLength ?? defaults.tailLength;
    const stiffness = opts?.stiffness ?? defaults.stiffness;
    const damping = opts?.damping ?? defaults.damping;
    const follow = opts?.followStiffness ?? defaults.followStiffness;
    const wanderRatio = opts?.wanderRatio ?? defaults.wanderRatio;
    const wanderMs = opts?.wanderMs ?? defaults.wanderMs;

    const [getChains, setChains] = createSignal<Point2d[][]>(
        Array.from({ length: count }, () => Array.from({ length }, () => SwarmConst.RESTING_POINT)),
    );

    const velocities = Array.from({ length: count }, () => SwarmConst.STILL);

    let lastMs: number | undefined;

    clock.subscribe();

    createEffect(() => {
        const nowMs = clock.getFrameMs();
        const reading = getReading();
        const frameMs = lastMs === undefined ? 0 : nowMs - lastMs;

        lastMs = nowMs;

        if (SVGDefsUtils.getPointerFade(reading, getIsPointerPresent()) > TrackedGradientSampleConst.NO_FADE)
            clock.keepAwake();

        if (frameMs <= 0) return;

        setChains(
            untrack(getChains).map((chain, tracer) => {
                const target = SVGDefsUtils.computeSwarmTarget(
                    reading.boxRatio,
                    tracer,
                    count,
                    nowMs,
                    wanderRatio,
                    wanderMs,
                );
                const head = SVGDefsUtils.stepSpring(chain[0], velocities[tracer], target, frameMs, stiffness, damping);

                velocities[tracer] = head.velocity;

                return SVGDefsUtils.followChain(chain, head.position, follow);
            }),
        );
    });

    return getChains;
};

export const createSwarmSample =
    (colorKeys: CycleColorKey[], defaults: typeof TrackedGradientDefaults.SWARM_DEFAULTS) =>
    (opts?: GradientSwarmSampleOpts): TrackedGradientConfig => ({
        computeSVGDefs: (id, __, getRef, defs) => {
            const sharedBlur = SVGDefsSolidUtils.getBaseBlur(id, defs);
            const sharedBlurRef = SVGDefsUtils.getSharedFilter(sharedBlur);
            const count = opts?.spotCount ?? defaults.spotCount;
            const length = opts?.tailLength ?? defaults.tailLength;
            const spotScale = opts?.spotScale ?? defaults.spotScale;
            const cycleMs = opts?.cycles ? (opts.cycleMs ?? SwarmConst.CYCLING_DEFAULTS.cycleMs) : undefined;
            const tracers = Array.from({ length: count }, (_unused, tracer) => count - 1 - tracer);

            const { getReading, getIsPointerPresent } = PointerTrackerSolidUtils.create(
                getRef ?? NO_REF,
                undefined,
                defs.getPointSource,
            );

            const getChains = createTracers(getReading, getIsPointerPresent, defaults, opts);

            const getFade = () => SVGDefsUtils.getPointerFade(getReading(), getIsPointerPresent());

            const getColor = (tracer: number) => {
                if (cycleMs && getFade() > TrackedGradientSampleConst.NO_FADE) clock.keepAwake();

                return SVGDefsUtils.computeTracerColor(
                    defs.colors,
                    colorKeys,
                    tracer,
                    count,
                    clock.getFrameMs(),
                    cycleMs,
                );
            };

            const layers = tracers.flatMap((tracer, order) =>
                Array.from({ length }, (_unused, stamp) => length - 1 - stamp).map((index) => {
                    const share = length > 1 ? index / (length - 1) : 0;
                    const gradientId = `gradient-${tracer}-${index}-${id}`;
                    const getAlpha = () => (opts?.spotAlpha ?? defaults.spotAlpha) * (1 - share) * getFade();

                    return {
                        gradientOrPattern: {
                            id: gradientId,
                            renderDefsElement: () =>
                                SVGGradientDefsSolidUtils.computeRadialGradient({
                                    id: gradientId,
                                    elementSize:
                                        (opts?.circular ?? defaults.circular) ? () => defs.getSize() : undefined,
                                    origin: () => getChains()[tracer][index],
                                    scale: MathUtils.lerp(
                                        spotScale,
                                        spotScale * (opts?.tailScale ?? defaults.tailScale),
                                        share,
                                    ),
                                    colors: () => [
                                        { value: `rgb(from ${getColor(tracer)} r g b / ${getAlpha()})` },
                                        { value: `rgb(from ${getColor(tracer)} r g b / 0)`, stop: 100 },
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
