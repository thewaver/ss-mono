import { useEffect, useState } from "react";

import {
    type GradientSwarmSampleOpts,
    SVGDefsUtils,
    TrackedGradientDefaults,
    type TrackedGradientElementDefs,
} from "@thewaver/ss-components";
import type { Point2d } from "@thewaver/ss-utils";

import { PointerTrackerReactUtils } from "../../../../Abstracts/PointerTracker/PointerTrackerReact.utils";
import type { TrackedGradientConfig } from "../../SVGDefsReact.types";
import { SVGDefsReactUtils } from "../../SVGDefsReact.utils";

type SwarmMotion = {
    spots: Point2d[];
    velocities: Point2d[];
    lastMs: number | undefined;
};

type SwarmProps = {
    id: string;
    element: HTMLElement | undefined;
    defs: TrackedGradientElementDefs;
    opts?: GradientSwarmSampleOpts;
};

const COLOR_KEYS = ["primary", "secondary", "tertiary"] as const;
const SETTLE_MS = 1500;
const RESTING_POINT: Point2d = { x: 0.5, y: 0.5 };
const STILL: Point2d = { x: 0, y: 0 };
const NO_FADE = 0;

const DEFAULTS = TrackedGradientDefaults.SWARM_DEFAULTS;

const clock = SVGDefsUtils.createClock(SETTLE_MS);

const getPatternId = (id: string) => `pattern-${id}`;
const getMergeId = (id: string) => `merge-${id}`;

const Swarm = (props: SwarmProps) => {
    const ref = SVGDefsReactUtils.useElementRef(props.element);
    const { reading, isPointerPresent } = PointerTrackerReactUtils.usePointerReading(
        ref,
        false,
        props.defs.getPointSource?.(),
    );
    const frameMs = SVGDefsReactUtils.useFrameMs(clock);

    const count = props.opts?.spotCount ?? DEFAULTS.spotCount;
    const stiffness = props.opts?.stiffness ?? DEFAULTS.stiffness;
    const damping = props.opts?.damping ?? DEFAULTS.damping;
    const wanderRatio = props.opts?.wanderRatio ?? DEFAULTS.wanderRatio;
    const wanderMs = props.opts?.wanderMs ?? DEFAULTS.wanderMs;

    const [motion] = useState<SwarmMotion>(() => ({
        spots: Array.from({ length: count }, () => RESTING_POINT),
        velocities: Array.from({ length: count }, () => STILL),
        lastMs: undefined,
    }));

    useEffect(() => {
        const elapsedMs = motion.lastMs === undefined ? 0 : frameMs - motion.lastMs;

        motion.lastMs = frameMs;

        if (SVGDefsUtils.getPointerFade(reading, isPointerPresent) > NO_FADE) clock.keepAwake();

        if (elapsedMs <= 0) return;

        const nextVelocities: Point2d[] = [];

        motion.spots = motion.spots.map((spot, index) => {
            const target = SVGDefsUtils.computeSwarmTarget(
                reading.boxRatio,
                index,
                count,
                frameMs,
                wanderRatio,
                wanderMs,
            );
            const step = SVGDefsUtils.stepSpring(spot, motion.velocities[index], target, elapsedMs, stiffness, damping);

            nextVelocities.push(step.velocity);

            return step.position;
        });

        motion.velocities = nextVelocities;
    }, [frameMs, reading, isPointerPresent]);

    const alpha =
        (props.opts?.spotAlpha ?? DEFAULTS.spotAlpha) * SVGDefsUtils.getPointerFade(reading, isPointerPresent);
    const size = props.defs.getSize();
    const radii = SVGDefsUtils.computeSwarmRadii(
        size,
        props.opts?.spotScale ?? DEFAULTS.spotScale,
        props.opts?.circular ?? DEFAULTS.circular,
    );
    const mergeId = getMergeId(props.id);

    return (
        <>
            <filter id={mergeId} x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation={SVGDefsUtils.computeSwarmMergeBlur(radii)} />
                <feColorMatrix type="matrix" values={SVGDefsUtils.SWARM_MERGE_MATRIX} />
            </filter>

            <pattern id={getPatternId(props.id)} patternUnits="userSpaceOnUse" width={size.width} height={size.height}>
                <g opacity={alpha}>
                    <g filter={`url(#${mergeId})`}>
                        {motion.spots.map((spot, index) => (
                            <ellipse
                                key={index}
                                cx={spot.x * size.width}
                                cy={spot.y * size.height}
                                rx={radii.x}
                                ry={radii.y}
                                fill={props.defs.colors[COLOR_KEYS[index % COLOR_KEYS.length]]}
                            />
                        ))}
                    </g>
                </g>
            </pattern>
        </>
    );
};

export const swarm_3 = (opts?: GradientSwarmSampleOpts): TrackedGradientConfig => ({
    computeSVGDefs: (id, __, element, defs) => [
        { color: SVGDefsUtils.getBaseBorderColor(defs) },
        {
            gradientOrPattern: {
                id: getPatternId(id),
                renderDefsElement: () => (
                    <Swarm
                        key={opts?.spotCount ?? DEFAULTS.spotCount}
                        id={id}
                        element={element}
                        defs={defs}
                        opts={opts}
                    />
                ),
            },
            filter: SVGDefsReactUtils.getBaseBlur(id, defs),
        },
    ],
});
