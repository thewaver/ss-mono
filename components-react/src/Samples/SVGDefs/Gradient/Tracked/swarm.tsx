import { Fragment, useEffect, useState } from "react";

import {
    type CycleColorKey,
    type GradientSwarmSampleOpts,
    SVGDefsUtils,
    TrackedGradientDefaults,
    type TrackedGradientElementDefs,
} from "@thewaver/ss-components";
import { MathUtils, type Point2d } from "@thewaver/ss-utils";

import { PointerTrackerReactUtils } from "../../../../Abstracts/PointerTracker/PointerTrackerReact.utils";
import { SVGGradientDefsReactUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefsReact.utils";
import type { TrackedGradientConfig } from "../../SVGDefsReact.types";
import { SVGDefsReactUtils } from "../../SVGDefsReact.utils";

type SwarmMotion = {
    chains: Point2d[][];
    velocities: Point2d[];
    lastMs: number | undefined;
};

type TracersProps = {
    id: string;
    element: HTMLElement | undefined;
    defs: TrackedGradientElementDefs;
    colorKeys: CycleColorKey[];
    defaults: typeof TrackedGradientDefaults.SWARM_DEFAULTS;
    opts?: GradientSwarmSampleOpts;
};

const SETTLE_MS = 1500;
const RESTING_POINT: Point2d = { x: 0.5, y: 0.5 };
const STILL: Point2d = { x: 0, y: 0 };
const NO_FADE = 0;

const CYCLING_DEFAULTS = TrackedGradientDefaults.SWARM_CYCLING_DEFAULTS;

const RENDERED_ELSEWHERE = () => undefined;

const clock = SVGDefsUtils.createClock(SETTLE_MS);

const getGradientId = (id: string, tracer: number, index: number) => `gradient-${tracer}-${index}-${id}`;

const getTracerOrder = (count: number) => Array.from({ length: count }, (_unused, tracer) => count - 1 - tracer);

const getStampOrder = (length: number) => Array.from({ length }, (_unused, stamp) => length - 1 - stamp);

const Tracers = (props: TracersProps) => {
    const ref = SVGDefsReactUtils.useElementRef(props.element);
    const { reading, isPointerPresent } = PointerTrackerReactUtils.usePointerReading(
        ref,
        false,
        props.defs.getPointSource?.(),
    );
    const frameMs = SVGDefsReactUtils.useFrameMs(clock);

    const count = props.opts?.spotCount ?? props.defaults.spotCount;
    const length = props.opts?.tailLength ?? props.defaults.tailLength;
    const stiffness = props.opts?.stiffness ?? props.defaults.stiffness;
    const damping = props.opts?.damping ?? props.defaults.damping;
    const follow = props.opts?.followStiffness ?? props.defaults.followStiffness;
    const wanderRatio = props.opts?.wanderRatio ?? props.defaults.wanderRatio;
    const wanderMs = props.opts?.wanderMs ?? props.defaults.wanderMs;

    const [motion] = useState<SwarmMotion>(() => ({
        chains: Array.from({ length: count }, () => Array.from({ length }, () => RESTING_POINT)),
        velocities: Array.from({ length: count }, () => STILL),
        lastMs: undefined,
    }));

    useEffect(() => {
        const elapsedMs = motion.lastMs === undefined ? 0 : frameMs - motion.lastMs;

        motion.lastMs = frameMs;

        if (SVGDefsUtils.getPointerFade(reading, isPointerPresent) > NO_FADE) clock.keepAwake();

        if (elapsedMs <= 0) return;

        motion.chains = motion.chains.map((chain, tracer) => {
            const target = SVGDefsUtils.computeSwarmTarget(
                reading.boxRatio,
                tracer,
                count,
                frameMs,
                wanderRatio,
                wanderMs,
            );
            const head = SVGDefsUtils.stepSpring(
                chain[0],
                motion.velocities[tracer],
                target,
                elapsedMs,
                stiffness,
                damping,
            );

            motion.velocities[tracer] = head.velocity;

            return SVGDefsUtils.followChain(chain, head.position, follow);
        });
    }, [frameMs, reading, isPointerPresent]);

    const fade = SVGDefsUtils.getPointerFade(reading, isPointerPresent);
    const cycleMs = props.opts?.cycles ? (props.opts.cycleMs ?? CYCLING_DEFAULTS.cycleMs) : undefined;
    const elementSize = (props.opts?.circular ?? props.defaults.circular) ? props.defs.getSize() : undefined;
    const spotAlpha = props.opts?.spotAlpha ?? props.defaults.spotAlpha;
    const spotScale = props.opts?.spotScale ?? props.defaults.spotScale;
    const tailScale = props.opts?.tailScale ?? props.defaults.tailScale;

    return (
        <>
            {getTracerOrder(count).map((tracer) => {
                const color = SVGDefsUtils.computeTracerColor(
                    props.defs.colors,
                    props.colorKeys,
                    tracer,
                    count,
                    frameMs,
                    cycleMs,
                );

                return getStampOrder(length).map((index) => {
                    const share = length > 1 ? index / (length - 1) : 0;
                    const alpha = spotAlpha * (1 - share) * fade;

                    return (
                        <Fragment key={`${tracer}-${index}`}>
                            {SVGGradientDefsReactUtils.computeRadialGradient({
                                id: getGradientId(props.id, tracer, index),
                                elementSize,
                                origin: motion.chains[tracer][index],
                                scale: MathUtils.lerp(spotScale, spotScale * tailScale, share),
                                colors: [
                                    { value: `rgb(from ${color} r g b / ${alpha})` },
                                    { value: `rgb(from ${color} r g b / 0)`, stop: 100 },
                                ],
                            })}
                        </Fragment>
                    );
                });
            })}
        </>
    );
};

export const createSwarmSample =
    (colorKeys: CycleColorKey[], defaults: typeof TrackedGradientDefaults.SWARM_DEFAULTS) =>
    (opts?: GradientSwarmSampleOpts): TrackedGradientConfig => ({
        computeSVGDefs: (id, __, element, defs) => {
            const sharedBlur = SVGDefsReactUtils.getBaseBlur(id, defs);
            const sharedBlurRef = SVGDefsUtils.getSharedFilter(sharedBlur);
            const count = opts?.spotCount ?? defaults.spotCount;
            const length = opts?.tailLength ?? defaults.tailLength;

            const layers = getTracerOrder(count).flatMap((tracer, order) =>
                getStampOrder(length).map((index) => {
                    const isFirst = order === 0 && index === length - 1;

                    return {
                        gradientOrPattern: {
                            id: getGradientId(id, tracer, index),
                            renderDefsElement: isFirst
                                ? () => (
                                      <Tracers
                                          key={`${count}-${length}`}
                                          id={id}
                                          element={element}
                                          defs={defs}
                                          colorKeys={colorKeys}
                                          defaults={defaults}
                                          opts={opts}
                                      />
                                  )
                                : RENDERED_ELSEWHERE,
                        },
                        filter: isFirst ? sharedBlur : sharedBlurRef,
                    };
                }),
            );

            return [{ color: SVGDefsUtils.getBaseBorderColor(defs) }, ...layers];
        },
    });
