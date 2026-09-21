import { createEffect, createSignal } from "solid-js";

import { MathUtils, type Point2d, Point2dUtils } from "@thewaver/ss-utils";

import type { PointerReading } from "../../../../Abstracts/PointerTracker/PointerTracker.types";
import { PointerTrackerUtils } from "../../../../Abstracts/PointerTracker/PointerTracker.utils";
import { SVGGradientDefsUtils } from "../../../../Abstracts/SVG/Defs/Gradient/SVGGradientDefs.utils";
import type { GradientFalloffOpts, GradientSmearSampleOpts, TrackedGradientConfig } from "../../SVGDefs.types";
import { SVGDefsUtils } from "../../SVGDefs.utils";
import { SVGDefsFrameUtils } from "../../SVGDefsFrames.utils";
import { TrackedGradientKnobs } from "../TrackedGradient.knobs";

type TrailStamp = {
    origin: Point2d;
    fade: number;
    bornMs: number;
    heading: number;
    stretch: number;
};

const STAMP_COUNT = Math.ceil(1000 / 60) * 2;
const STAMP_INTERVAL_MS = Math.ceil(1000 / 60);
const TRAIL_LIFETIME_MS = STAMP_COUNT * STAMP_INTERVAL_MS;
const MOTION_STEP_RATIO = 0.002;
const MOTION_GRACE_MS = STAMP_INTERVAL_MS * 2;

const RESTING_ORIGIN: Point2d = { x: 0.5, y: 0.5 };
const RESTING_HEADING = 0;
const NO_STRETCH = 1;
const NO_SPEED = 0;
const FULL_AGE_RATIO = 1;
const FULL_ALPHA = 1;
const NO_FADE = 0;

const DEFAULTS = TrackedGradientKnobs.SPOT_SMEAR_DEFAULTS;

const NO_REF = () => undefined;

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

const clock = SVGDefsFrameUtils.createClock(TRAIL_LIFETIME_MS);

const createTrailStamp = (
    index: number,
    getReading: () => PointerReading,
    getIsPointerPresent: () => boolean,
    opts?: GradientSmearSampleOpts,
) => {
    const [getStamp, setStamp] = createSignal<TrailStamp>();

    let bornTick: number | undefined;
    let lastOrigin: Point2d | undefined;
    let lastMovedMs: number | undefined;
    let lastTravel: Point2d | undefined;
    let speed = NO_SPEED;

    clock.subscribe();

    createEffect(() => {
        const nowMs = clock.getFrameMs();
        const reading = getReading();
        const origin = reading.boxRatio;
        const fade = SVGDefsUtils.getPointerFade(reading, getIsPointerPresent());
        const travel = lastOrigin && { x: origin.x - lastOrigin.x, y: origin.y - lastOrigin.y };
        const step = travel && Point2dUtils.getLength(travel);

        lastOrigin = origin;
        speed += ((step ?? NO_SPEED) - speed) * (opts?.smearSmoothing ?? DEFAULTS.smearSmoothing);

        if (step !== undefined && step > MOTION_STEP_RATIO) {
            lastMovedMs = performance.now();
            lastTravel = travel;

            if (fade > NO_FADE) clock.keepAwake();
        }

        const tick = Math.floor(nowMs / STAMP_INTERVAL_MS);

        if (tick % STAMP_COUNT !== index || tick === bornTick) return;
        if (lastMovedMs === undefined || performance.now() - lastMovedMs > MOTION_GRACE_MS) return;

        bornTick = tick;

        setStamp({
            origin,
            fade,
            bornMs: nowMs,
            heading: lastTravel ? Point2dUtils.getAngle(lastTravel) : RESTING_HEADING,
            stretch: MathUtils.lerp(
                NO_STRETCH,
                opts?.smearMax ?? DEFAULTS.smearMax,
                MathUtils.clamp01(speed / (opts?.smearFullStepRatio ?? DEFAULTS.smearFullStepRatio)),
            ),
        });
    });

    const getAgeRatio = () => {
        const stamp = getStamp();

        return stamp ? MathUtils.clamp01((clock.getFrameMs() - stamp.bornMs) / TRAIL_LIFETIME_MS) : FULL_AGE_RATIO;
    };

    const getAlpha = () =>
        (getStamp()?.fade ?? 0) *
        (opts?.trailAlpha ?? DEFAULTS.trailAlpha) *
        (1 - getAgeRatio()) ** (opts?.trailDecay ?? DEFAULTS.trailDecay);

    return {
        getOrigin: () => getStamp()?.origin ?? RESTING_ORIGIN,
        getAngle: () => getStamp()?.heading ?? RESTING_HEADING,
        getAspect: () => {
            const stretch = getStamp()?.stretch ?? NO_STRETCH;

            return { width: stretch, height: NO_STRETCH / stretch };
        },
        getColors: (color: string) => computePoolColors(color, getAlpha(), opts),
    };
};

export const spot_smear_1 = (opts?: GradientSmearSampleOpts): TrackedGradientConfig => ({
    computeSVGDefs: (id, __, getRef, defs) => {
        const { getReading, getIsPointerPresent } = PointerTrackerUtils.create(getRef ?? NO_REF);

        return [
            {
                color: SVGDefsUtils.getBaseBorderColor(defs),
            },
            {
                gradientOrPattern: {
                    id: `gradient1-${id}`,
                    renderDefsElement: () => {
                        return SVGGradientDefsUtils.computeRadialGradient({
                            id: `gradient1-${id}`,
                            elementSize: opts?.circular ? () => defs.getSize() : undefined,
                            origin: () => getReading().boxRatio,
                            scale: opts?.glowScale ?? DEFAULTS.glowScale,
                            colors: computePoolColors(defs.colors.primary, FULL_ALPHA, opts),
                        });
                    },
                },
                filter: SVGDefsUtils.getBaseBlur(id, defs),
            },
            ...Array.from({ length: STAMP_COUNT }, (_unused, index) => ({
                gradientOrPattern: {
                    id: `gradient${index + 2}-${id}`,
                    renderDefsElement: () => {
                        const stamp = createTrailStamp(index, getReading, getIsPointerPresent, opts);

                        return SVGGradientDefsUtils.computeRadialGradient({
                            id: `gradient${index + 2}-${id}`,
                            elementSize: opts?.circular ? () => defs.getSize() : undefined,
                            origin: stamp.getOrigin,
                            scale: opts?.glowScale ?? DEFAULTS.glowScale,
                            aspect: stamp.getAspect,
                            angle: stamp.getAngle,
                            colors: () => stamp.getColors(defs.colors.primary),
                        });
                    },
                },
                filter: SVGDefsUtils.getBaseBlur(id, defs),
            })),
        ];
    },
});
