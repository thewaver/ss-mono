import { createEffect, createSignal } from "solid-js";

import { MathUtils, type Point2d, Point2dUtils } from "@thewaver/ss-utils";

import { PointerTrackerUtils } from "../../../../Abstracts/PointerTracker/PointerTracker.utils";
import { SVGGradientDefsUtils } from "../../../../Abstracts/SVG/Defs/Gradient/SVGGradientDefs.utils";
import type { SVGDefsColors, TrackedGradientConfig } from "../../SVGDefs.types";
import { SVGDefsUtils } from "../../SVGDefs.utils";
import { SVGDefsFrameUtils } from "../../SVGDefsFrames.utils";

type TrailStamp = {
    origin: Point2d;
    fade: number;
    bornMs: number;
    heading: number;
    stretch: number;
};

const POOL_SCALE = 0.8;
const CORE_STOP = 5;
const FALLOFF_STOP = 30;
const CORE_ALPHA = 0.75;
const FALLOFF_ALPHA = 0.25;

const STAMP_COUNT = Math.ceil(1000 / 60) * 2;
const STAMP_INTERVAL_MS = Math.ceil(1000 / 60);
const TRAIL_LIFETIME_MS = STAMP_COUNT * STAMP_INTERVAL_MS;
const STAMP_ALPHA = 0.25;
const STAMP_DECAY_EXPONENT = 2.2;
const MOTION_STEP_RATIO = 0.002;
const SMEAR_FULL_STEP_RATIO = 0.03;
const SMEAR_SMOOTHING = 0.2;
const SMEAR_MAX = 4;
const AGE_COLOR_SPAN = 0.55;
const AGE_COLOR_KEYS: (keyof SVGDefsColors)[] = ["primary", "secondary", "tertiary"];
const MOTION_GRACE_MS = STAMP_INTERVAL_MS * 2;

const RESTING_ORIGIN: Point2d = { x: 0.5, y: 0.5 };
const RESTING_HEADING = 0;
const NO_STRETCH = 1;
const NO_SPEED = 0;
const FULL_AGE_RATIO = 1;
const FULL_ALPHA = 1;
const NO_FADE = 0;

const NO_REF = () => undefined;

const computePoolColors = (color: string, alpha: number) => [
    { value: `rgb(from ${color} r g b / ${alpha})` },
    { value: `rgb(from ${color} r g b / ${alpha * CORE_ALPHA})`, stop: CORE_STOP },
    { value: `rgb(from ${color} r g b / ${alpha * FALLOFF_ALPHA})`, stop: FALLOFF_STOP },
    { value: `rgb(from ${color} r g b / 0)`, stop: 100 },
];

const clock = SVGDefsFrameUtils.createClock(TRAIL_LIFETIME_MS);

const createTrailStamp = (index: number, getRef: () => HTMLElement | undefined) => {
    const { getReading, getIsPointerPresent } = PointerTrackerUtils.create(getRef);
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
        speed += ((step ?? NO_SPEED) - speed) * SMEAR_SMOOTHING;

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
            stretch: MathUtils.lerp(NO_STRETCH, SMEAR_MAX, MathUtils.clamp01(speed / SMEAR_FULL_STEP_RATIO)),
        });
    });

    const getAgeRatio = () => {
        const stamp = getStamp();

        return stamp ? MathUtils.clamp01((clock.getFrameMs() - stamp.bornMs) / TRAIL_LIFETIME_MS) : FULL_AGE_RATIO;
    };

    const getAlpha = () => (getStamp()?.fade ?? 0) * STAMP_ALPHA * (1 - getAgeRatio()) ** STAMP_DECAY_EXPONENT;

    const getColorKey = () => {
        const band = Math.floor((getAgeRatio() / AGE_COLOR_SPAN) * AGE_COLOR_KEYS.length);

        return AGE_COLOR_KEYS[Math.min(band, AGE_COLOR_KEYS.length - 1)];
    };

    return {
        getOrigin: () => getStamp()?.origin ?? RESTING_ORIGIN,
        getAngle: () => getStamp()?.heading ?? RESTING_HEADING,
        getAspect: () => {
            const stretch = getStamp()?.stretch ?? NO_STRETCH;

            return { width: stretch, height: NO_STRETCH / stretch };
        },
        getColors: (colors: SVGDefsColors) => computePoolColors(colors[getColorKey()], getAlpha()),
    };
};

export const spot_smear_3: TrackedGradientConfig = {
    computeSVGDefs: (id, __, getRef, defs) => [
        {
            color: SVGDefsUtils.getBaseBorderColor(defs),
        },
        {
            gradientOrPattern: {
                id: `gradient1-${id}`,
                renderDefsElement: () => {
                    const { getReading } = PointerTrackerUtils.create(getRef ?? NO_REF);

                    return SVGGradientDefsUtils.computeRadialGradient({
                        id: `gradient1-${id}`,
                        origin: () => getReading().boxRatio,
                        scale: POOL_SCALE,
                        colors: computePoolColors(defs.colors.primary, FULL_ALPHA),
                    });
                },
            },
            filter: SVGDefsUtils.getBaseBlur(id, defs),
        },
        ...Array.from({ length: STAMP_COUNT }, (_unused, index) => ({
            gradientOrPattern: {
                id: `gradient${index + 2}-${id}`,
                renderDefsElement: () => {
                    const stamp = createTrailStamp(index, getRef ?? NO_REF);

                    return SVGGradientDefsUtils.computeRadialGradient({
                        id: `gradient${index + 2}-${id}`,
                        origin: stamp.getOrigin,
                        scale: POOL_SCALE,
                        aspect: stamp.getAspect,
                        angle: stamp.getAngle,
                        colors: () => stamp.getColors(defs.colors),
                    });
                },
            },
            filter: SVGDefsUtils.getBaseBlur(id, defs),
        })),
    ],
};
