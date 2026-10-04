import { Index, createEffect, createSignal, untrack } from "solid-js";

import {
    type GradientSwarmSampleOpts,
    type PointerReading,
    SVGDefsUtils,
    TrackedGradientDefaults,
} from "@thewaver/ss-components";
import type { Point2d } from "@thewaver/ss-utils";

import { PointerTrackerSolidUtils } from "../../../../Abstracts/PointerTracker/PointerTrackerSolid.utils";
import type { TrackedGradientConfig } from "../../SVGDefsSolid.types";
import { SVGDefsSolidUtils } from "../../SVGDefsSolid.utils";

const COLOR_KEYS = ["primary", "secondary", "tertiary"] as const;
const SETTLE_MS = 1500;
const RESTING_POINT: Point2d = { x: 0.5, y: 0.5 };
const STILL: Point2d = { x: 0, y: 0 };
const NO_FADE = 0;

const DEFAULTS = TrackedGradientDefaults.SWARM_DEFAULTS;

const NO_REF = () => undefined;

const clock = SVGDefsSolidUtils.createClock(SETTLE_MS);

const createSwarm = (
    getReading: () => PointerReading,
    getIsPointerPresent: () => boolean,
    opts?: GradientSwarmSampleOpts,
) => {
    const count = opts?.spotCount ?? DEFAULTS.spotCount;
    const stiffness = opts?.stiffness ?? DEFAULTS.stiffness;
    const damping = opts?.damping ?? DEFAULTS.damping;
    const wanderRatio = opts?.wanderRatio ?? DEFAULTS.wanderRatio;
    const wanderMs = opts?.wanderMs ?? DEFAULTS.wanderMs;

    const [getSpots, setSpots] = createSignal<Point2d[]>(Array.from({ length: count }, () => RESTING_POINT));

    let velocities = Array.from({ length: count }, () => STILL);
    let lastMs: number | undefined;

    clock.subscribe();

    createEffect(() => {
        const nowMs = clock.getFrameMs();
        const reading = getReading();
        const frameMs = lastMs === undefined ? 0 : nowMs - lastMs;

        lastMs = nowMs;

        if (SVGDefsUtils.getPointerFade(reading, getIsPointerPresent()) > NO_FADE) clock.keepAwake();

        if (frameMs <= 0) return;

        const nextVelocities: Point2d[] = [];

        setSpots(
            untrack(getSpots).map((spot, index) => {
                const target = SVGDefsUtils.computeSwarmTarget(
                    reading.boxRatio,
                    index,
                    count,
                    nowMs,
                    wanderRatio,
                    wanderMs,
                );
                const step = SVGDefsUtils.stepSpring(spot, velocities[index], target, frameMs, stiffness, damping);

                nextVelocities.push(step.velocity);

                return step.position;
            }),
        );

        velocities = nextVelocities;
    });

    return getSpots;
};

export const swarm_3 = (opts?: GradientSwarmSampleOpts): TrackedGradientConfig => ({
    computeSVGDefs: (id, __, getRef, defs) => {
        const sharedBlur = SVGDefsSolidUtils.getBaseBlur(id, defs);
        const patternId = `pattern-${id}`;
        const mergeId = `merge-${id}`;

        const { getReading, getIsPointerPresent } = PointerTrackerSolidUtils.create(
            getRef ?? NO_REF,
            undefined,
            defs.getPointSource,
        );

        const getSpots = createSwarm(getReading, getIsPointerPresent, opts);

        const getAlpha = () =>
            (opts?.spotAlpha ?? DEFAULTS.spotAlpha) * SVGDefsUtils.getPointerFade(getReading(), getIsPointerPresent());

        const getRadii = () =>
            SVGDefsUtils.computeSwarmRadii(
                defs.getSize(),
                opts?.spotScale ?? DEFAULTS.spotScale,
                opts?.circular ?? DEFAULTS.circular,
            );

        return [
            { color: SVGDefsUtils.getBaseBorderColor(defs) },
            {
                gradientOrPattern: {
                    id: patternId,
                    renderDefsElement: () => (
                        <>
                            <filter id={mergeId} x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur stdDeviation={SVGDefsUtils.computeSwarmMergeBlur(getRadii())} />
                                <feColorMatrix type="matrix" values={SVGDefsUtils.SWARM_MERGE_MATRIX} />
                            </filter>

                            <pattern
                                id={patternId}
                                patternUnits="userSpaceOnUse"
                                width={defs.getSize().width}
                                height={defs.getSize().height}
                            >
                                <g opacity={getAlpha()}>
                                    <g filter={`url(#${mergeId})`}>
                                        <Index each={getSpots()}>
                                            {(getSpot, index) => (
                                                <ellipse
                                                    cx={getSpot().x * defs.getSize().width}
                                                    cy={getSpot().y * defs.getSize().height}
                                                    rx={getRadii().x}
                                                    ry={getRadii().y}
                                                    fill={defs.colors[COLOR_KEYS[index % COLOR_KEYS.length]]}
                                                />
                                            )}
                                        </Index>
                                    </g>
                                </g>
                            </pattern>
                        </>
                    ),
                },
                filter: sharedBlur,
            },
        ];
    },
});
