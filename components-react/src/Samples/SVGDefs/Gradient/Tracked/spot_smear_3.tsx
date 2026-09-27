import { Fragment, useEffect, useRef, useState } from "react";

import {
    type GradientFalloffOpts,
    type GradientSmearSampleOpts,
    type SVGDefsColors,
    SVGDefsUtils,
    TrackedGradientDefaults,
    type TrackedGradientElementDefs,
} from "@thewaver/ss-components";
import { Color, MathUtils, type Point2d, Point2dUtils } from "@thewaver/ss-utils";

import { PointerTrackerReactUtils } from "../../../../Abstracts/PointerTracker/PointerTrackerReact.utils";
import { SVGGradientDefsReactUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefsReact.utils";
import type { TrackedGradientConfig } from "../../SVGDefsReact.types";
import { SVGDefsReactUtils } from "../../SVGDefsReact.utils";

type TrailStamp = {
    origin: Point2d;
    fade: number;
    bornMs: number;
    heading: number;
    stretch: number;
};

type TrailMotion = {
    lastOrigin: Point2d | undefined;
    lastMovedMs: number | undefined;
    lastTravel: Point2d | undefined;
    speed: number;
    bornTick: number | undefined;
};

type SpotSmearProps = {
    id: string;
    element: HTMLElement | undefined;
    defs: TrackedGradientElementDefs;
    opts?: GradientSmearSampleOpts;
};

const STAMP_COUNT = Math.ceil(1000 / 60) * 2;
const STAMP_INTERVAL_MS = Math.ceil(1000 / 60);
const TRAIL_LIFETIME_MS = STAMP_COUNT * STAMP_INTERVAL_MS;
const MOTION_STEP_RATIO = 0.002;
const COLOR_KEYS: (keyof SVGDefsColors)[] = ["primary", "secondary", "tertiary"];
const MOTION_GRACE_MS = STAMP_INTERVAL_MS * 2;

const RESTING_ORIGIN: Point2d = { x: 0.5, y: 0.5 };
const RESTING_HEADING = 0;
const NO_STRETCH = 1;
const NO_SPEED = 0;
const FULL_AGE_RATIO = 1;
const FULL_ALPHA = 1;
const NO_FADE = 0;
const NO_STAMPS: (TrailStamp | undefined)[] = Array.from({ length: STAMP_COUNT }, () => undefined);

const DEFAULTS = TrackedGradientDefaults.SPOT_SMEAR_CYCLING_DEFAULTS;

const RENDERED_ELSEWHERE = () => undefined;

const getStampId = (id: string, index: number) => `gradient${index + 2}-${id}`;

const getCycleColor = (colors: SVGDefsColors, atMs: number, opts?: GradientSmearSampleOpts) => {
    const cycleMs = opts?.cycleMs ?? DEFAULTS.cycleMs;
    const phase = ((atMs % cycleMs) / cycleMs) * COLOR_KEYS.length;
    const index = Math.floor(phase);
    const from = colors[COLOR_KEYS[index % COLOR_KEYS.length]];
    const to = colors[COLOR_KEYS[(index + 1) % COLOR_KEYS.length]];

    if (!Color.Hex.isHex(from) || !Color.Hex.isHex(to)) return from;

    return Color.Hex.interpolate(from, to, phase - index);
};

const computePoolColors = (color: string, alpha: number, opts?: GradientFalloffOpts) => [
    { value: `rgb(from ${color} r g b / ${alpha})` },
    {
        value: `rgb(from ${color} r g b / ${alpha * (opts?.coreAlpha ?? DEFAULTS.coreAlpha)})`,
        stop: opts?.coreStop ?? DEFAULTS.coreStop,
    },
    {
        value: `rgb(from ${color} r g b / ${alpha * (opts?.falloffAlpha ?? DEFAULTS.falloffAlpha)})`,
        stop: opts?.falloffStop ?? DEFAULTS.falloffStop,
    },
    { value: `rgb(from ${color} r g b / 0)`, stop: 100 },
];

const clock = SVGDefsUtils.createClock(TRAIL_LIFETIME_MS);

const getAgeRatio = (stamp: TrailStamp | undefined, frameMs: number) =>
    stamp ? MathUtils.clamp01((frameMs - stamp.bornMs) / TRAIL_LIFETIME_MS) : FULL_AGE_RATIO;

const getStampAlpha = (stamp: TrailStamp | undefined, frameMs: number, opts?: GradientSmearSampleOpts) =>
    (stamp?.fade ?? 0) *
    (opts?.trailAlpha ?? DEFAULTS.trailAlpha) *
    (1 - getAgeRatio(stamp, frameMs)) ** (opts?.trailDecay ?? DEFAULTS.trailDecay);

const getStampAspect = (stamp: TrailStamp | undefined) => {
    const stretch = stamp?.stretch ?? NO_STRETCH;

    return { width: stretch, height: NO_STRETCH / stretch };
};

const getColorKey = (ageRatio: number, opts?: GradientSmearSampleOpts) => {
    const band = Math.floor((ageRatio / (opts?.ageColorSpan ?? DEFAULTS.ageColorSpan)) * COLOR_KEYS.length);

    return COLOR_KEYS[Math.min(band, COLOR_KEYS.length - 1)];
};

const computeStampColors = (
    stamp: TrailStamp | undefined,
    colors: SVGDefsColors,
    frameMs: number,
    opts?: GradientSmearSampleOpts,
) =>
    opts?.cycles
        ? computePoolColors(getCycleColor(colors, stamp?.bornMs ?? 0, opts), getStampAlpha(stamp, frameMs, opts), opts)
        : computePoolColors(
              colors[getColorKey(getAgeRatio(stamp, frameMs), opts)],
              getStampAlpha(stamp, frameMs, opts),
              opts,
          );

const SpotSmear = (props: SpotSmearProps) => {
    const ref = SVGDefsReactUtils.useElementRef(props.element);
    const { reading, isPointerPresent } = PointerTrackerReactUtils.usePointerReading(ref);
    const frameMs = SVGDefsReactUtils.useFrameMs(clock);
    const [stamps, setStamps] = useState(NO_STAMPS);
    const motionRef = useRef<TrailMotion>({
        lastOrigin: undefined,
        lastMovedMs: undefined,
        lastTravel: undefined,
        speed: NO_SPEED,
        bornTick: undefined,
    });

    const isCycling = Boolean(props.opts?.cycles);

    useEffect(() => {
        const opts = props.opts;
        const motion = motionRef.current;
        const origin = reading.boxRatio;
        const fade = SVGDefsUtils.getPointerFade(reading, isPointerPresent);
        const lastOrigin = motion.lastOrigin;
        const travel = lastOrigin && { x: origin.x - lastOrigin.x, y: origin.y - lastOrigin.y };
        const step = travel && Point2dUtils.getLength(travel);
        const isMoving = step !== undefined && step > MOTION_STEP_RATIO;

        motion.lastOrigin = origin;
        motion.speed += ((step ?? NO_SPEED) - motion.speed) * (opts?.smearSmoothing ?? DEFAULTS.smearSmoothing);

        if (fade > NO_FADE && (isCycling || isMoving)) clock.keepAwake();

        if (isMoving) {
            motion.lastMovedMs = performance.now();
            motion.lastTravel = travel;
        }

        const tick = Math.floor(frameMs / STAMP_INTERVAL_MS);

        if (tick === motion.bornTick) return;
        if (motion.lastMovedMs === undefined || performance.now() - motion.lastMovedMs > MOTION_GRACE_MS) return;

        motion.bornTick = tick;

        const stamp = {
            origin,
            fade,
            bornMs: frameMs,
            heading: motion.lastTravel ? Point2dUtils.getAngle(motion.lastTravel) : RESTING_HEADING,
            stretch: MathUtils.lerp(
                NO_STRETCH,
                opts?.smearMax ?? DEFAULTS.smearMax,
                MathUtils.clamp01(motion.speed / (opts?.smearFullStepRatio ?? DEFAULTS.smearFullStepRatio)),
            ),
        };

        setStamps((previous) => previous.map((entry, index) => (index === tick % STAMP_COUNT ? stamp : entry)));
    }, [frameMs, reading, isPointerPresent, isCycling]);

    const elementSize = (props.opts?.circular ?? DEFAULTS.circular) ? props.defs.getSize() : undefined;
    const scale = props.opts?.glowScale ?? DEFAULTS.glowScale;

    return (
        <>
            {SVGGradientDefsReactUtils.computeRadialGradient({
                id: `gradient1-${props.id}`,
                elementSize,
                origin: reading.boxRatio,
                scale,
                colors: isCycling
                    ? computePoolColors(getCycleColor(props.defs.colors, frameMs, props.opts), FULL_ALPHA, props.opts)
                    : computePoolColors(props.defs.colors.primary, FULL_ALPHA, props.opts),
            })}
            {stamps.map((stamp, index) => (
                <Fragment key={index}>
                    {SVGGradientDefsReactUtils.computeRadialGradient({
                        id: getStampId(props.id, index),
                        elementSize,
                        origin: stamp?.origin ?? RESTING_ORIGIN,
                        scale,
                        aspect: getStampAspect(stamp),
                        angle: stamp?.heading ?? RESTING_HEADING,
                        colors: computeStampColors(stamp, props.defs.colors, frameMs, props.opts),
                    })}
                </Fragment>
            ))}
        </>
    );
};

export const spot_smear_3 = (opts?: GradientSmearSampleOpts): TrackedGradientConfig => ({
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
                    renderDefsElement: () => <SpotSmear id={id} element={element} defs={defs} opts={opts} />,
                },
                filter: sharedBlur,
            },
            ...Array.from({ length: STAMP_COUNT }, (_unused, index) => ({
                gradientOrPattern: {
                    id: getStampId(id, index),
                    renderDefsElement: RENDERED_ELSEWHERE,
                },
                filter: sharedBlurRef,
            })),
        ];
    },
});
