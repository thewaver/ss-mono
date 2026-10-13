import { Fragment, useEffect, useRef, useState } from "react";

import {
    type GradientFalloffOpts,
    type GradientSpotTrailOpts,
    SVGDefsUtils,
    type TrackedGradientElementDefs,
} from "@thewaver/ss-components";
import {
    SpotConst,
    SpotTrail1Const,
    TrackedGradientSampleConst,
    TrailStampConst,
} from "@thewaver/ss-components/internal";
import { MathUtils, type Point2d, Point2dUtils } from "@thewaver/ss-utils";

import { PointerTrackerReactUtils } from "../../../../Abstracts/PointerTracker/PointerTrackerReact.utils";
import { SVGGradientDefsReactUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefsReact.utils";
import type { TrackedGradientConfig } from "../../SVGDefsReact.types";
import { SVGDefsReactUtils } from "../../SVGDefsReact.utils";

type TrailStamp = {
    origin: Point2d;
    fade: number;
    bornMs: number;
};

type TrailMotion = {
    lastOrigin: Point2d | undefined;
    lastMovedMs: number | undefined;
    bornTick: number | undefined;
};

type SpotTrailProps = {
    id: string;
    element: HTMLElement | undefined;
    defs: TrackedGradientElementDefs;
    opts?: GradientSpotTrailOpts;
};

const NO_STAMPS: (TrailStamp | undefined)[] = Array.from({ length: TrailStampConst.STAMP_COUNT }, () => undefined);

const getStampId = (id: string, index: number) => `gradient${index + 2}-${id}`;

const computePoolColors = (color: string, alpha: number, opts?: GradientFalloffOpts) => [
    { value: `rgb(from ${color} r g b / ${alpha})` },
    {
        value: `rgb(from ${color} r g b / ${alpha * (opts?.coreAlpha ?? SpotTrail1Const.DEFAULTS.coreAlpha)})`,
        stop: opts?.coreStop ?? SpotTrail1Const.DEFAULTS.coreStop,
    },
    {
        value: `rgb(from ${color} r g b / ${alpha * (opts?.falloffAlpha ?? SpotTrail1Const.DEFAULTS.falloffAlpha)})`,
        stop: opts?.falloffStop ?? SpotTrail1Const.DEFAULTS.falloffStop,
    },
    { value: `rgb(from ${color} r g b / 0)`, stop: 100 },
];

const clock = SVGDefsUtils.createClock(TrailStampConst.TRAIL_LIFETIME_MS);

const getAgeRatio = (stamp: TrailStamp | undefined, frameMs: number) =>
    stamp
        ? MathUtils.clamp01((frameMs - stamp.bornMs) / TrailStampConst.TRAIL_LIFETIME_MS)
        : TrackedGradientSampleConst.FULL_AGE_RATIO;

const getStampAlpha = (stamp: TrailStamp | undefined, frameMs: number, opts?: GradientSpotTrailOpts) =>
    (stamp?.fade ?? 0) *
    (opts?.trailAlpha ?? SpotTrail1Const.DEFAULTS.trailAlpha) *
    (1 - getAgeRatio(stamp, frameMs)) ** (opts?.trailDecay ?? SpotTrail1Const.DEFAULTS.trailDecay);

const SpotTrail = (props: SpotTrailProps) => {
    const ref = SVGDefsReactUtils.useElementRef(props.element);
    const { reading, isPointerPresent } = PointerTrackerReactUtils.usePointerReading(
        ref,
        false,
        props.defs.getPointSource?.(),
    );
    const frameMs = SVGDefsReactUtils.useFrameMs(clock);
    const [stamps] = useState(() => [...NO_STAMPS]);
    const motionRef = useRef<TrailMotion>({ lastOrigin: undefined, lastMovedMs: undefined, bornTick: undefined });

    useEffect(() => {
        const motion = motionRef.current;
        const origin = reading.boxRatio;
        const fade = SVGDefsUtils.getPointerFade(reading, isPointerPresent);
        const lastOrigin = motion.lastOrigin;
        const step = lastOrigin && Point2dUtils.getLength({ x: origin.x - lastOrigin.x, y: origin.y - lastOrigin.y });

        motion.lastOrigin = origin;

        if (step !== undefined && step > SpotConst.MOTION_STEP_RATIO) {
            motion.lastMovedMs = performance.now();

            if (fade > TrackedGradientSampleConst.NO_FADE) clock.keepAwake();
        }

        const tick = Math.floor(frameMs / TrailStampConst.STAMP_INTERVAL_MS);

        if (tick === motion.bornTick) return;
        if (
            motion.lastMovedMs === undefined ||
            performance.now() - motion.lastMovedMs > TrailStampConst.MOTION_GRACE_MS
        )
            return;

        motion.bornTick = tick;

        const stamp = { origin, fade, bornMs: frameMs };

        stamps[tick % TrailStampConst.STAMP_COUNT] = stamp;
    }, [frameMs, reading, isPointerPresent]);

    const elementSize = (props.opts?.circular ?? SpotTrail1Const.DEFAULTS.circular) ? props.defs.getSize() : undefined;
    const scale = props.opts?.glowScale ?? SpotTrail1Const.DEFAULTS.glowScale;

    return (
        <>
            {SVGGradientDefsReactUtils.computeRadialGradient({
                id: `gradient1-${props.id}`,
                elementSize,
                origin: reading.boxRatio,
                scale,
                colors: computePoolColors(props.defs.colors.primary, TrailStampConst.FULL_ALPHA, props.opts),
            })}
            {stamps.map((stamp, index) => (
                <Fragment key={index}>
                    {SVGGradientDefsReactUtils.computeRadialGradient({
                        id: getStampId(props.id, index),
                        elementSize,
                        origin: stamp?.origin ?? SpotConst.RESTING_ORIGIN,
                        scale,
                        colors: computePoolColors(
                            props.defs.colors.primary,
                            getStampAlpha(stamp, frameMs, props.opts),
                            props.opts,
                        ),
                    })}
                </Fragment>
            ))}
        </>
    );
};

export const spot_trail_1 = (opts?: GradientSpotTrailOpts): TrackedGradientConfig => ({
    computeSVGDefs: (id, __, element, defs) => {
        const sharedBlur = SVGDefsReactUtils.getBaseBlur(id, defs);
        const sharedBlurRef = SVGDefsUtils.getSharedFilter(sharedBlur);

        return [
            {
                color: SVGDefsUtils.getBaseBorderColor(defs),
            },
            {
                gradientOrPattern: {
                    id: `gradient1-${id}`,
                    renderDefsElement: () => <SpotTrail id={id} element={element} defs={defs} opts={opts} />,
                },
                filter: sharedBlur,
            },
            ...Array.from({ length: TrailStampConst.STAMP_COUNT }, (_unused, index) => ({
                gradientOrPattern: {
                    id: getStampId(id, index),
                    renderDefsElement: TrackedGradientSampleConst.RENDERED_ELSEWHERE,
                },
                filter: sharedBlurRef,
            })),
        ];
    },
});
