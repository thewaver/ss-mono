import { createEffect, createSignal } from "solid-js";

import { Color, MathUtils, type Point2d, Point2dUtils } from "@thewaver/ss-utils";

import type { PointerReading } from "../../../../Abstracts/PointerTracker/PointerTracker.types";
import { PointerTrackerUtils } from "../../../../Abstracts/PointerTracker/PointerTracker.utils";
import { SVGGradientDefsUtils } from "../../../../Abstracts/SVG/Defs/Gradient/SVGGradientDefs.utils";
import type {
    GradientFalloffOpts,
    GradientSpotTrailOpts,
    SVGDefsColors,
    TrackedGradientConfig,
} from "../../SVGDefs.types";
import { SVGDefsUtils } from "../../SVGDefs.utils";
import { SVGDefsFrameUtils } from "../../SVGDefsFrames.utils";
import { TrackedGradientKnobs } from "../TrackedGradient.knobs";

type TrailStamp = {
    origin: Point2d;
    fade: number;
    bornMs: number;
};

const STAMP_COUNT = Math.ceil(1000 / 60) * 2;
const STAMP_INTERVAL_MS = Math.ceil(1000 / 60);
const TRAIL_LIFETIME_MS = STAMP_COUNT * STAMP_INTERVAL_MS;
const MOTION_STEP_RATIO = 0.002;
const COLOR_KEYS: (keyof SVGDefsColors)[] = ["primary", "secondary"];
const MOTION_GRACE_MS = STAMP_INTERVAL_MS * 2;

const RESTING_ORIGIN: Point2d = { x: 0.5, y: 0.5 };
const FULL_AGE_RATIO = 1;
const FULL_ALPHA = 1;
const NO_FADE = 0;

const DEFAULTS = TrackedGradientKnobs.SPOT_TRAIL_CYCLING_DEFAULTS;

const NO_REF = () => undefined;

const getCycleColor = (colors: SVGDefsColors, atMs: number, opts?: GradientSpotTrailOpts) => {
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

const clock = SVGDefsFrameUtils.createClock(TRAIL_LIFETIME_MS);

const createTrailStamp = (
    index: number,
    getReading: () => PointerReading,
    getIsPointerPresent: () => boolean,
    isCycling: boolean,
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

        if (fade > NO_FADE && (isCycling || (step !== undefined && step > MOTION_STEP_RATIO))) clock.keepAwake();

        if (step !== undefined && step > MOTION_STEP_RATIO) lastMovedMs = performance.now();

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

    const getColorKey = () => {
        const band = Math.floor((getAgeRatio() / (opts?.ageColorSpan ?? DEFAULTS.ageColorSpan)) * COLOR_KEYS.length);

        return COLOR_KEYS[Math.min(band, COLOR_KEYS.length - 1)];
    };

    return {
        getOrigin: () => getStamp()?.origin ?? RESTING_ORIGIN,
        getColors: (colors: SVGDefsColors) =>
            isCycling
                ? computePoolColors(getCycleColor(colors, getStamp()?.bornMs ?? 0, opts), getAlpha())
                : computePoolColors(colors[getColorKey()], getAlpha(), opts),
    };
};

export const spot_trail_2 = (opts?: GradientSpotTrailOpts): TrackedGradientConfig => ({
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
                            elementSize: opts?.circular ? () => defs.getSize() : undefined,
                            origin: () => getReading().boxRatio,
                            scale: opts?.glowScale ?? DEFAULTS.glowScale,
                            colors: opts?.cycles
                                ? () =>
                                      computePoolColors(
                                          getCycleColor(defs.colors, clock.getFrameMs(), opts),
                                          FULL_ALPHA,
                                      )
                                : computePoolColors(defs.colors.primary, FULL_ALPHA, opts),
                        });
                    },
                },
                filter: sharedBlur,
            },
            ...Array.from({ length: STAMP_COUNT }, (_unused, index) => ({
                gradientOrPattern: {
                    id: `gradient${index + 2}-${id}`,
                    renderDefsElement: () => {
                        const stamp = createTrailStamp(
                            index,
                            getReading,
                            getIsPointerPresent,
                            Boolean(opts?.cycles),
                            opts,
                        );

                        return SVGGradientDefsUtils.computeRadialGradient({
                            id: `gradient${index + 2}-${id}`,
                            elementSize: opts?.circular ? () => defs.getSize() : undefined,
                            origin: stamp.getOrigin,
                            scale: opts?.glowScale ?? DEFAULTS.glowScale,
                            colors: () => stamp.getColors(defs.colors),
                        });
                    },
                },
                filter: sharedBlurRef,
            })),
        ];
    },
});
