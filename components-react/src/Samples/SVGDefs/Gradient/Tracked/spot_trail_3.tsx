import { Fragment, useEffect, useRef, useState } from "react";

import {
    type GradientFalloffOpts,
    type GradientSpotTrailOpts,
    type SVGDefsColors,
    SVGDefsUtils,
    type TrackedGradientElementDefs,
} from "@thewaver/ss-components";
import {
    SpotConst,
    SpotTrail3Const,
    TrackedGradientSampleConst,
    TrailStampConst,
} from "@thewaver/ss-components/internal";
import { Color, MathUtils, type Point2d, Point2dUtils } from "@thewaver/ss-utils";

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

const getCycleColor = (colors: SVGDefsColors, atMs: number, opts?: GradientSpotTrailOpts) => {
    const cycleMs = opts?.cycleMs ?? SpotTrail3Const.DEFAULTS.cycleMs;
    const phase = ((atMs % cycleMs) / cycleMs) * SpotTrail3Const.COLOR_KEYS.length;
    const index = Math.floor(phase);
    const from = colors[SpotTrail3Const.COLOR_KEYS[index % SpotTrail3Const.COLOR_KEYS.length]];
    const to = colors[SpotTrail3Const.COLOR_KEYS[(index + 1) % SpotTrail3Const.COLOR_KEYS.length]];

    if (!Color.Hex.isHex(from) || !Color.Hex.isHex(to)) return from;

    return Color.Hex.interpolate(from, to, phase - index);
};

const computePoolColors = (color: string, alpha: number, opts?: GradientFalloffOpts) => [
    { value: `rgb(from ${color} r g b / ${alpha})` },
    {
        value: `rgb(from ${color} r g b / ${alpha * (opts?.coreAlpha ?? SpotTrail3Const.DEFAULTS.coreAlpha)})`,
        stop: opts?.coreStop ?? SpotTrail3Const.DEFAULTS.coreStop,
    },
    {
        value: `rgb(from ${color} r g b / ${alpha * (opts?.falloffAlpha ?? SpotTrail3Const.DEFAULTS.falloffAlpha)})`,
        stop: opts?.falloffStop ?? SpotTrail3Const.DEFAULTS.falloffStop,
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
    (opts?.trailAlpha ?? SpotTrail3Const.DEFAULTS.trailAlpha) *
    (1 - getAgeRatio(stamp, frameMs)) ** (opts?.trailDecay ?? SpotTrail3Const.DEFAULTS.trailDecay);

const getColorKey = (ageRatio: number, opts?: GradientSpotTrailOpts) => {
    const band = Math.floor(
        (ageRatio / (opts?.ageColorSpan ?? SpotTrail3Const.DEFAULTS.ageColorSpan)) * SpotTrail3Const.COLOR_KEYS.length,
    );

    return SpotTrail3Const.COLOR_KEYS[Math.min(band, SpotTrail3Const.COLOR_KEYS.length - 1)];
};

const computeStampColors = (
    stamp: TrailStamp | undefined,
    colors: SVGDefsColors,
    frameMs: number,
    opts?: GradientSpotTrailOpts,
) =>
    opts?.cycles
        ? computePoolColors(getCycleColor(colors, stamp?.bornMs ?? 0, opts), getStampAlpha(stamp, frameMs, opts))
        : computePoolColors(
              colors[getColorKey(getAgeRatio(stamp, frameMs), opts)],
              getStampAlpha(stamp, frameMs, opts),
              opts,
          );

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

    const isCycling = Boolean(props.opts?.cycles);

    useEffect(() => {
        const motion = motionRef.current;
        const origin = reading.boxRatio;
        const fade = SVGDefsUtils.getPointerFade(reading, isPointerPresent);
        const lastOrigin = motion.lastOrigin;
        const step = lastOrigin && Point2dUtils.getLength({ x: origin.x - lastOrigin.x, y: origin.y - lastOrigin.y });
        const isMoving = step !== undefined && step > SpotConst.MOTION_STEP_RATIO;

        motion.lastOrigin = origin;

        if (fade > TrackedGradientSampleConst.NO_FADE && (isCycling || isMoving)) clock.keepAwake();

        if (isMoving) motion.lastMovedMs = performance.now();

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
    }, [frameMs, reading, isPointerPresent, isCycling]);

    const elementSize = (props.opts?.circular ?? SpotTrail3Const.DEFAULTS.circular) ? props.defs.getSize() : undefined;
    const scale = props.opts?.glowScale ?? SpotTrail3Const.DEFAULTS.glowScale;

    return (
        <>
            {SVGGradientDefsReactUtils.computeRadialGradient({
                id: `gradient1-${props.id}`,
                elementSize,
                origin: reading.boxRatio,
                scale,
                colors: isCycling
                    ? computePoolColors(
                          getCycleColor(props.defs.colors, frameMs, props.opts),
                          TrailStampConst.FULL_ALPHA,
                      )
                    : computePoolColors(props.defs.colors.primary, TrailStampConst.FULL_ALPHA, props.opts),
            })}
            {stamps.map((stamp, index) => (
                <Fragment key={index}>
                    {SVGGradientDefsReactUtils.computeRadialGradient({
                        id: getStampId(props.id, index),
                        elementSize,
                        origin: stamp?.origin ?? SpotConst.RESTING_ORIGIN,
                        scale,
                        colors: computeStampColors(stamp, props.defs.colors, frameMs, props.opts),
                    })}
                </Fragment>
            ))}
        </>
    );
};

export const spot_trail_3 = (opts?: GradientSpotTrailOpts): TrackedGradientConfig => ({
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
