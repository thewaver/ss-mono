import { createEffect, createSignal } from "solid-js";

import { MathUtils, type Point2d, Point2dUtils } from "@thewaver/ss-utils";

import type { PointerReading } from "../../../../Abstracts/PointerTracker/PointerTracker.types";
import { PointerTrackerUtils } from "../../../../Abstracts/PointerTracker/PointerTracker.utils";
import { SVGGradientDefsUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefs.utils";
import type { GradientFalloffOpts, GradientSpotTrailOpts, TrackedGradientConfig } from "../../SVGDefs.types";
import { SVGDefsUtils } from "../../SVGDefs.utils";
import { TrackedGradientDefaults } from "../TrackedGradient.const";

type TrailStamp = {
    origin: Point2d;
    fade: number;
    bornMs: number;
};

const STAMP_COUNT = Math.ceil(1000 / 60) * 2;
const STAMP_INTERVAL_MS = Math.ceil(1000 / 60);
const TRAIL_LIFETIME_MS = STAMP_COUNT * STAMP_INTERVAL_MS;
const MOTION_STEP_RATIO = 0.002;
const MOTION_GRACE_MS = STAMP_INTERVAL_MS * 2;

const RESTING_ORIGIN: Point2d = { x: 0.5, y: 0.5 };
const FULL_AGE_RATIO = 1;
const FULL_ALPHA = 1;
const NO_FADE = 0;

const DEFAULTS = TrackedGradientDefaults.SPOT_TRAIL_DEFAULTS;

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

const clock = SVGDefsUtils.createClock(TRAIL_LIFETIME_MS);

const createTrailStamp = (
    index: number,
    getReading: () => PointerReading,
    getIsPointerPresent: () => boolean,
    opts?: GradientSpotTrailOpts,
) => {
    const [getStamp, setStamp] = createSignal<TrailStamp>();

    let bornTick: number | undefined;
    let lastOrigin: Point2d | undefined;
    let lastMovedMs: number | undefined;

    clock.subscribe();

    createEffect(() => {
        const nowMs = clock.getFrameMs();
        const reading = getReading();
        const origin = reading.boxRatio;
        const fade = SVGDefsUtils.getPointerFade(reading, getIsPointerPresent());
        const step = lastOrigin && Point2dUtils.getLength({ x: origin.x - lastOrigin.x, y: origin.y - lastOrigin.y });

        lastOrigin = origin;

        if (step !== undefined && step > MOTION_STEP_RATIO) {
            lastMovedMs = performance.now();

            if (fade > NO_FADE) clock.keepAwake();
        }

        const tick = Math.floor(nowMs / STAMP_INTERVAL_MS);

        if (tick % STAMP_COUNT !== index || tick === bornTick) return;
        if (lastMovedMs === undefined || performance.now() - lastMovedMs > MOTION_GRACE_MS) return;

        bornTick = tick;

        setStamp({ origin, fade, bornMs: nowMs });
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
        getColors: (color: string) => computePoolColors(color, getAlpha(), opts),
    };
};

export const spot_trail_1 = (opts?: GradientSpotTrailOpts): TrackedGradientConfig => ({
    computeSVGDefs: (id, __, getRef, defs) => {
        const sharedBlur = SVGDefsUtils.getBaseBlur(id, defs);
        const sharedBlurRef = SVGDefsUtils.getSharedFilter(sharedBlur);

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
                            elementSize: (opts?.circular ?? DEFAULTS.circular) ? () => defs.getSize() : undefined,
                            origin: () => getReading().boxRatio,
                            scale: opts?.glowScale ?? DEFAULTS.glowScale,
                            colors: computePoolColors(defs.colors.primary, FULL_ALPHA, opts),
                        });
                    },
                },
                filter: sharedBlur,
            },
            ...Array.from({ length: STAMP_COUNT }, (_unused, index) => ({
                gradientOrPattern: {
                    id: `gradient${index + 2}-${id}`,
                    renderDefsElement: () => {
                        const stamp = createTrailStamp(index, getReading, getIsPointerPresent, opts);

                        return SVGGradientDefsUtils.computeRadialGradient({
                            id: `gradient${index + 2}-${id}`,
                            elementSize: (opts?.circular ?? DEFAULTS.circular) ? () => defs.getSize() : undefined,
                            origin: stamp.getOrigin,
                            scale: opts?.glowScale ?? DEFAULTS.glowScale,
                            colors: () => stamp.getColors(defs.colors.primary),
                        });
                    },
                },
                filter: sharedBlurRef,
            })),
        ];
    },
});
