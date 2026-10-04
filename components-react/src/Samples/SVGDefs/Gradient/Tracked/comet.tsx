import { Fragment, useEffect, useState } from "react";

import {
    type CycleColorKey,
    type GradientCometSampleOpts,
    SVGDefsUtils,
    TrackedGradientDefaults,
    type TrackedGradientElementDefs,
} from "@thewaver/ss-components";
import { MathUtils, type Point2d } from "@thewaver/ss-utils";

import { PointerTrackerReactUtils } from "../../../../Abstracts/PointerTracker/PointerTrackerReact.utils";
import { SVGGradientDefsReactUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefsReact.utils";
import type { TrackedGradientConfig } from "../../SVGDefsReact.types";
import { SVGDefsReactUtils } from "../../SVGDefsReact.utils";

type CometMotion = {
    chains: Point2d[][];
    velocities: Point2d[];
    lastMs: number | undefined;
};

type CometsProps = {
    id: string;
    element: HTMLElement | undefined;
    defs: TrackedGradientElementDefs;
    colorKeys: CycleColorKey[];
    defaults: typeof TrackedGradientDefaults.COMET_DEFAULTS;
    opts?: GradientCometSampleOpts;
};

const PACE_BY_COMET = [1, 0.7, 0.5];
const SETTLE_MS = 1500;
const RESTING_POINT: Point2d = { x: 0.5, y: 0.5 };
const STILL: Point2d = { x: 0, y: 0 };
const NO_FADE = 0;

const CYCLING_DEFAULTS = TrackedGradientDefaults.COMET_CYCLING_DEFAULTS;

const RENDERED_ELSEWHERE = () => undefined;

const clock = SVGDefsUtils.createClock(SETTLE_MS);

const getGradientId = (id: string, comet: number, index: number) => `gradient-${comet}-${index}-${id}`;

const getCometOrder = () => PACE_BY_COMET.map((_unused, comet) => comet).reverse();

const getStampOrder = (length: number) => Array.from({ length }, (_unused, stamp) => length - 1 - stamp);

const Comets = (props: CometsProps) => {
    const ref = SVGDefsReactUtils.useElementRef(props.element);
    const { reading, isPointerPresent } = PointerTrackerReactUtils.usePointerReading(
        ref,
        false,
        props.defs.getPointSource?.(),
    );
    const frameMs = SVGDefsReactUtils.useFrameMs(clock);

    const length = props.opts?.tailLength ?? props.defaults.tailLength;
    const stiffness = props.opts?.stiffness ?? props.defaults.stiffness;
    const damping = props.opts?.damping ?? props.defaults.damping;
    const follow = props.opts?.followStiffness ?? props.defaults.followStiffness;

    const [motion] = useState<CometMotion>(() => ({
        chains: PACE_BY_COMET.map(() => Array.from({ length }, () => RESTING_POINT)),
        velocities: PACE_BY_COMET.map(() => STILL),
        lastMs: undefined,
    }));

    useEffect(() => {
        const elapsedMs = motion.lastMs === undefined ? 0 : frameMs - motion.lastMs;

        motion.lastMs = frameMs;

        if (SVGDefsUtils.getPointerFade(reading, isPointerPresent) > NO_FADE) clock.keepAwake();

        if (elapsedMs <= 0) return;

        motion.chains = motion.chains.map((chain, comet) => {
            const head = SVGDefsUtils.stepSpring(
                chain[0],
                motion.velocities[comet],
                reading.boxRatio,
                elapsedMs,
                stiffness * PACE_BY_COMET[comet],
                damping,
            );

            motion.velocities[comet] = head.velocity;

            return SVGDefsUtils.followChain(chain, head.position, follow);
        });
    }, [frameMs, reading, isPointerPresent]);

    const fade = SVGDefsUtils.getPointerFade(reading, isPointerPresent);
    const cycleMs = props.opts?.cycles ? (props.opts.cycleMs ?? CYCLING_DEFAULTS.cycleMs) : undefined;
    const elementSize = (props.opts?.circular ?? props.defaults.circular) ? props.defs.getSize() : undefined;
    const headAlpha = props.opts?.headAlpha ?? props.defaults.headAlpha;
    const headScale = props.opts?.headScale ?? props.defaults.headScale;
    const tailScale = props.opts?.tailScale ?? props.defaults.tailScale;

    return (
        <>
            {getCometOrder().map((comet) => {
                const color = SVGDefsUtils.computeTracerColor(
                    props.defs.colors,
                    props.colorKeys,
                    comet,
                    PACE_BY_COMET.length,
                    frameMs,
                    cycleMs,
                );

                return getStampOrder(length).map((index) => {
                    const share = length > 1 ? index / (length - 1) : 0;
                    const alpha = headAlpha * (1 - share) * fade;

                    return (
                        <Fragment key={`${comet}-${index}`}>
                            {SVGGradientDefsReactUtils.computeRadialGradient({
                                id: getGradientId(props.id, comet, index),
                                elementSize,
                                origin: motion.chains[comet][index],
                                scale: MathUtils.lerp(headScale, tailScale, share),
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

export const createCometSample =
    (colorKeys: CycleColorKey[], defaults: typeof TrackedGradientDefaults.COMET_DEFAULTS) =>
    (opts?: GradientCometSampleOpts): TrackedGradientConfig => ({
        computeSVGDefs: (id, __, element, defs) => {
            const sharedBlur = SVGDefsReactUtils.getBaseBlur(id, defs);
            const sharedBlurRef = SVGDefsUtils.getSharedFilter(sharedBlur);
            const length = opts?.tailLength ?? defaults.tailLength;

            const layers = getCometOrder().flatMap((comet, order) =>
                getStampOrder(length).map((index) => {
                    const isFirst = order === 0 && index === length - 1;

                    return {
                        gradientOrPattern: {
                            id: getGradientId(id, comet, index),
                            renderDefsElement: isFirst
                                ? () => (
                                      <Comets
                                          key={length}
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
